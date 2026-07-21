/*
 * Filename: blob-store.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/blob-store.ts
 * Change date and time: 14.38.00_21.07.2026
 * Reason for changes: Wave 2 Task 1 — TTL-gated on-disk blob store for
 * files-transfer batches. Stores one blob per (transferId, batchId) under a
 * configurable root, mints HMAC tokens that bind (transferId, batchId, expiry)
 * so the HTTP layer can hand out a single-use fetch credential without a
 * session. Missing/expired/bad-token reads return `null`; the HTTP layer maps
 * that to 404/410. Lazy GC on get + optional `sweep()`.
 *
 * Review fix (14.38 21.07.2026): split HMAC signature verification from expiry
 * check so a well-formed expired token (valid HMAC) still triggers lazy GC of
 * blob+meta on `get()` instead of short-circuiting at the token gate and
 * leaking files on disk.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

// WHY: tokens are `exp.base64url(sig)` so verification can reject expired
// tokens before any HMAC work and without a separate metadata file.
const TOKEN_SEP = ".";

export interface FilesBlobStoreOptions {
    rootDir?: string;
    ttlMs?: number;
    // Shared upload secret gating PUT uploads. WHY: the HTTP router must reject
    // anonymous PUTs; this is the credential a sender presents via
    // `X-CWSP-Files-Upload-Secret` (or a valid per-batch blob token). When
    // unset, the store falls back to `CWS_FILES_BLOB_UPLOAD_SECRET` then
    // `CWS_FILES_BLOB_SECRET` env at creation time. SECURITY: never logged.
    uploadSecret?: string;
}

export interface FilesBlobPutInput {
    transferId: string;
    batchId: string;
    bytes: Buffer;
    token?: string;
    expiresAt?: number;
}

export interface FilesBlobPutResult {
    token: string;
    size: number;
    path: string;
}

export interface FilesBlobGetInput {
    transferId: string;
    batchId: string;
    token: string;
}

/**
 * Outcome of a gated `get`. WHY: the HTTP layer must distinguish a bad token
 * (401) from a missing blob (404) and an expired-but-valid token (410). The
 * plain `get()` contract collapses all three to `null`, so `getWithStatus`
 * exposes the discriminated status while keeping the HMAC secret encapsulated
 * inside the store (the router never sees the secret).
 */
export type FilesBlobGetStatus = "ok" | "missing" | "expired" | "unauthorized";

export interface FilesBlobGetResult {
    status: FilesBlobGetStatus;
    bytes: Buffer | null;
}

export interface FilesBlobStore {
    put(input: FilesBlobPutInput): Promise<FilesBlobPutResult>;
    get(input: FilesBlobGetInput): Promise<Buffer | null>;
    getWithStatus(input: FilesBlobGetInput): Promise<FilesBlobGetResult>;
    delete(transferId: string, batchId?: string): Promise<void>;
    sweep(): Promise<void>;
    // Authorize a PUT upload. Accepts either a shared upload secret (matched
    // in constant time) OR a pre-existing per-batch blob token with a valid
    // HMAC signature for (transferId, batchId). WHY: the HTTP router must gate
    // PUT on a credential so anonymous peers cannot fill the on-disk store.
    authorizePut(input: { transferId: string; batchId: string; token?: string; uploadSecret?: string }): boolean;
}

/**
 * Default blob root. `CWS_FILES_BLOB_DIR` wins; otherwise a process-local
 * `.data/cwsp-files-blobs` under cwd. INVARIANT: never hardcode a production
 * path that would collide across hosts — env override is the supported lever.
 */
function defaultRootDir(): string {
    return process.env.CWS_FILES_BLOB_DIR || join(process.cwd(), ".data", "cwsp-files-blobs");
}

/**
 * Default HMAC secret. SECURITY: production must set `CWS_FILES_BLOB_SECRET`.
 * We fall back to the existing bridge/upstream user-key env if present so a
 * shared-secret deployment reuses one configured value. If none is set we
 * derive a per-process random key (non-persistent: tokens invalidate on
 * restart, which is acceptable for tests but not for multi-process deploys).
 */
function defaultSecret(): string {
    const env = process.env.CWS_FILES_BLOB_SECRET
        || process.env.CWS_BRIDGE_USER_KEY
        || process.env.CWS_UPSTREAM_USER_KEY;
    if (env && env.trim()) return env;
    // NOTE: per-process fallback only; logged once by caller if needed.
    return randomBytes(32).toString("hex");
}

function base64url(input: Buffer | string): string {
    return Buffer.from(input).toString("base64url");
}

function fromBase64url(input: string): Buffer {
    return Buffer.from(input, "base64url");
}

/**
 * Mint a bearer token for a batch blob. Format: `<expiresAt>.<hmac>` where
 * hmac = HMAC_SHA256(secret, `transferId|batchId|expiresAt`), both base64url.
 * WHY: binding `batchId` into the MAC means a token issued for one batch
 * cannot be replayed against another batch of the same transfer.
 */
export function mintFilesBlobToken(
    transferId: string,
    batchId: string,
    secret: string,
    expiresAt: number,
): string {
    const payload = `${transferId}|${batchId}|${expiresAt}`;
    const sig = createHmac("sha256", secret).update(payload).digest();
    return `${expiresAt}${TOKEN_SEP}${base64url(sig)}`;
}

/**
 * Parse a blob token and verify only its HMAC signature (NOT expiry).
 * Returns the parsed `expiresAt` on valid shape + signature, or `null` on any
 * malformed input (never throws). WHY: `get()` must distinguish a "valid
 * token that simply expired" from a "bad token" so it can lazy-delete the
 * on-disk blob+meta for the former while leaving unknown tokens alone. Splitting
 * the signature gate from the expiry gate keeps the public `verifyFilesBlobToken`
 * contract intact for callers that only need a boolean.
 */
export function verifyFilesBlobTokenSignature(
    token: string,
    transferId: string,
    batchId: string,
    secret: string,
): number | null {
    if (!token || typeof token !== "string") return null;
    const sep = token.indexOf(TOKEN_SEP);
    if (sep <= 0) return null;
    const expiresStr = token.slice(0, sep);
    const sigB64 = token.slice(sep + 1);
    const expiresAt = Number(expiresStr);
    if (!Number.isFinite(expiresAt)) return null;
    const payload = `${transferId}|${batchId}|${expiresAt}`;
    const expected = createHmac("sha256", secret).update(payload).digest();
    let given: Buffer;
    try {
        given = fromBase64url(sigB64);
    } catch {
        return null;
    }
    if (given.length !== expected.length) return null;
    if (!timingSafeEqual(given, expected)) return null;
    return expiresAt;
}

/**
 * Verify a blob token. Rejects expired tokens and mismatched MACs in constant
 * time. Returns `false` on any malformed input (never throws). Composed from
 * `verifyFilesBlobTokenSignature` so the signature gate stays the single source
 * of truth.
 */
export function verifyFilesBlobToken(
    token: string,
    transferId: string,
    batchId: string,
    secret: string,
): boolean {
    const expiresAt = verifyFilesBlobTokenSignature(token, transferId, batchId, secret);
    if (expiresAt === null) return false;
    return expiresAt > Date.now();
}

function blobPath(rootDir: string, transferId: string, batchId: string): string {
    // WHY: hash the ids so hostile/odd transfer ids cannot escape the root via
    // path traversal, and keep the layout sharded by transfer for easy delete.
    const tHash = createHash("sha256").update(transferId).digest("hex").slice(0, 24);
    const bHash = createHash("sha256").update(batchId).digest("hex").slice(0, 24);
    return join(rootDir, tHash, `${bHash}.blob`);
}

function metaPath(rootDir: string, transferId: string, batchId: string): string {
    const tHash = createHash("sha256").update(transferId).digest("hex").slice(0, 24);
    const bHash = createHash("sha256").update(batchId).digest("hex").slice(0, 24);
    return join(rootDir, tHash, `${bHash}.meta.json`);
}

interface BlobMeta {
    transferId: string;
    batchId: string;
    expiresAt: number;
    size: number;
}

/**
 * Resolve the shared PUT upload secret. `CWS_FILES_BLOB_UPLOAD_SECRET` wins;
 * otherwise we fall back to the blob HMAC secret env (`CWS_FILES_BLOB_SECRET`)
 * so a single configured value can serve both minting and upload gating. WHY:
 * keeps deployment to one env var when a shared secret is acceptable, while
 * still allowing operators to split upload-gating from token-minting.
 */
function resolveUploadSecret(explicit?: string): string {
    if (explicit && explicit.trim()) return explicit.trim();
    const env = process.env.CWS_FILES_BLOB_UPLOAD_SECRET
        || process.env.CWS_FILES_BLOB_SECRET;
    return String(env || "").trim();
}

/**
 * Constant-time string compare. WHY: avoid timing oracles on the upload secret
 * even though the blob token path already uses `timingSafeEqual` internally.
 */
function safeEqualStrings(left: string, right: string): boolean {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

export function createFilesBlobStore(options?: FilesBlobStoreOptions): FilesBlobStore {
    const rootDir = options?.rootDir ?? defaultRootDir();
    const ttlMs = options?.ttlMs ?? 15 * 60 * 1000;
    const secret = defaultSecret();
    const uploadSecret = resolveUploadSecret(options?.uploadSecret);

    async function ensureDir(filePath: string): Promise<void> {
        await mkdir(join(filePath, ".."), { recursive: true });
    }

    async function writeMeta(metaPathStr: string, meta: BlobMeta): Promise<void> {
        await ensureDir(metaPathStr);
        await writeFile(metaPathStr, JSON.stringify(meta), "utf8");
    }

    async function readMeta(metaPathStr: string): Promise<BlobMeta | null> {
        try {
            const raw = await readFile(metaPathStr, "utf8");
            return JSON.parse(raw) as BlobMeta;
        } catch {
            return null;
        }
    }

    async function isExpired(expiresAt: number): Promise<boolean> {
        return expiresAt <= Date.now();
    }

    return {
        async put(input: FilesBlobPutInput): Promise<FilesBlobPutResult> {
            const { transferId, batchId, bytes, token: providedToken, expiresAt: providedExpiresAt } = input;
            const expiresAt = providedExpiresAt ?? (Date.now() + ttlMs);
            const token = providedToken && providedToken.length > 0
                ? providedToken
                : mintFilesBlobToken(transferId, batchId, secret, expiresAt);
            const filePath = blobPath(rootDir, transferId, batchId);
            const metaPathStr = metaPath(rootDir, transferId, batchId);
            await ensureDir(filePath);
            await writeFile(filePath, bytes);
            await writeMeta(metaPathStr, { transferId, batchId, expiresAt, size: bytes.length });
            return { token, size: bytes.length, path: filePath };
        },

        async get(input: FilesBlobGetInput): Promise<Buffer | null> {
            // WHY: delegate to `getWithStatus` so the discriminated-status path
            // is the single source of truth; `get` keeps its null-collapsing
            // contract for callers that only need the bytes.
            const result = await this.getWithStatus(input);
            return result.bytes;
        },

        async getWithStatus(input: FilesBlobGetInput): Promise<FilesBlobGetResult> {
            const { transferId, batchId, token } = input;
            // No token at all is an auth failure, not a missing blob.
            if (!token || typeof token !== "string") {
                return { status: "unauthorized", bytes: null };
            }
            // Token gate first: a bad token never reaches the filesystem.
            // WHY: we split HMAC verification from expiry so a well-formed
            // expired token (valid signature) still triggers lazy GC below
            // instead of short-circuiting here and leaking blob+meta on disk.
            const sigExpiresAt = verifyFilesBlobTokenSignature(token, transferId, batchId, secret);
            if (sigExpiresAt === null) {
                return { status: "unauthorized", bytes: null };
            }
            if (sigExpiresAt <= Date.now()) {
                // Lazy GC: valid-but-expired token — drop blob + meta, report 410.
                await this.delete(transferId, batchId).catch(() => {});
                return { status: "expired", bytes: null };
            }
            const metaPathStr = metaPath(rootDir, transferId, batchId);
            const meta = await readMeta(metaPathStr);
            if (!meta) return { status: "missing", bytes: null };
            if (await isExpired(meta.expiresAt)) {
                // Lazy GC: meta expired (e.g. ttlMs shorter than token). Drop and 410.
                await this.delete(transferId, batchId).catch(() => {});
                return { status: "expired", bytes: null };
            }
            const filePath = blobPath(rootDir, transferId, batchId);
            try {
                const st = await stat(filePath);
                if (!st.isFile()) return { status: "missing", bytes: null };
                return { status: "ok", bytes: await readFile(filePath) };
            } catch {
                return { status: "missing", bytes: null };
            }
        },

        async delete(transferId: string, batchId?: string): Promise<void> {
            if (batchId) {
                const filePath = blobPath(rootDir, transferId, batchId);
                const metaPathStr = metaPath(rootDir, transferId, batchId);
                await rm(filePath, { force: true });
                await rm(metaPathStr, { force: true });
                return;
            }
            // No batchId: drop the whole transfer shard dir.
            const tHash = createHash("sha256").update(transferId).digest("hex").slice(0, 24);
            await rm(join(rootDir, tHash), { recursive: true, force: true });
        },

        authorizePut(input: { transferId: string; batchId: string; token?: string; uploadSecret?: string }): boolean {
            // SECURITY: PUT requires a credential. Two accepted forms:
            //   1. shared upload secret (env CWS_FILES_BLOB_UPLOAD_SECRET, fallback
            //      CWS_FILES_BLOB_SECRET) via header/query — covers the initial
            //      upload before any token exists.
            //   2. an existing per-batch blob token with a valid HMAC signature —
            //      covers re-PUT / overwrite of a batch the caller already owns.
            // WHY: rejecting anonymous PUTs prevents hostile peers from filling
            //   the on-disk store with arbitrary blobs.
            const providedSecret = String(input?.uploadSecret || "").trim();
            if (uploadSecret && providedSecret && safeEqualStrings(providedSecret, uploadSecret)) {
                return true;
            }
            const providedToken = String(input?.token || "").trim();
            if (providedToken) {
                const sigExpiresAt = verifyFilesBlobTokenSignature(
                    providedToken,
                    input.transferId,
                    input.batchId,
                    secret,
                );
                if (sigExpiresAt !== null) return true;
            }
            return false;
        },

        async sweep(): Promise<void> {
            // Optional coarse sweep: walk root, expire per-meta. Kept simple;
            // production can run this on a timer. Errors are swallowed so a
            // sweep never takes down a request path.
            const { readdir } = await import("node:fs/promises");
            let shards: string[];
            try {
                shards = await readdir(rootDir);
            } catch {
                return;
            }
            for (const shard of shards) {
                const shardDir = join(rootDir, shard);
                let entries: string[];
                try {
                    entries = await readdir(shardDir);
                } catch {
                    continue;
                }
                for (const entry of entries) {
                    if (!entry.endsWith(".meta.json")) continue;
                    const metaPathStr = join(shardDir, entry);
                    const meta = await readMeta(metaPathStr);
                    if (!meta) continue;
                    if (await isExpired(meta.expiresAt)) {
                        await this.delete(meta.transferId, meta.batchId).catch(() => {});
                    }
                }
            }
        },
    };
}
