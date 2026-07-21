/*
 * Filename: blob-store.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/blob-store.ts
 * Change date and time: 14.35.00_21.07.2026
 * Reason for changes: Wave 2 Task 1 — TTL-gated on-disk blob store for
 * files-transfer batches. Stores one blob per (transferId, batchId) under a
 * configurable root, mints HMAC tokens that bind (transferId, batchId, expiry)
 * so the HTTP layer can hand out a single-use fetch credential without a
 * session. Missing/expired/bad-token reads return `null`; the HTTP layer maps
 * that to 404/410. Lazy GC on get + optional `sweep()`.
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

export interface FilesBlobStore {
    put(input: FilesBlobPutInput): Promise<FilesBlobPutResult>;
    get(input: FilesBlobGetInput): Promise<Buffer | null>;
    delete(transferId: string, batchId?: string): Promise<void>;
    sweep(): Promise<void>;
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
 * Verify a blob token. Rejects expired tokens and mismatched MACs in constant
 * time. Returns `false` on any malformed input (never throws).
 */
export function verifyFilesBlobToken(
    token: string,
    transferId: string,
    batchId: string,
    secret: string,
): boolean {
    if (!token || typeof token !== "string") return false;
    const sep = token.indexOf(TOKEN_SEP);
    if (sep <= 0) return false;
    const expiresStr = token.slice(0, sep);
    const sigB64 = token.slice(sep + 1);
    const expiresAt = Number(expiresStr);
    if (!Number.isFinite(expiresAt)) return false;
    if (expiresAt <= Date.now()) return false;
    const payload = `${transferId}|${batchId}|${expiresAt}`;
    const expected = createHmac("sha256", secret).update(payload).digest();
    let given: Buffer;
    try {
        given = fromBase64url(sigB64);
    } catch {
        return false;
    }
    if (given.length !== expected.length) return false;
    return timingSafeEqual(given, expected);
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

export function createFilesBlobStore(options?: FilesBlobStoreOptions): FilesBlobStore {
    const rootDir = options?.rootDir ?? defaultRootDir();
    const ttlMs = options?.ttlMs ?? 15 * 60 * 1000;
    const secret = defaultSecret();

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
            const { transferId, batchId, token } = input;
            // Token gate first: a bad token never reaches the filesystem.
            if (!verifyFilesBlobToken(token, transferId, batchId, secret)) return null;
            const metaPathStr = metaPath(rootDir, transferId, batchId);
            const meta = await readMeta(metaPathStr);
            if (!meta) return null;
            if (await isExpired(meta.expiresAt)) {
                // Lazy GC: drop expired blob + meta so disk doesn't leak.
                await this.delete(transferId, batchId).catch(() => {});
                return null;
            }
            const filePath = blobPath(rootDir, transferId, batchId);
            try {
                const st = await stat(filePath);
                if (!st.isFile()) return null;
                return await readFile(filePath);
            } catch {
                return null;
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
