/*
 * Filename: files-blob-store.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-blob-store.ts
 * Change date and time: 18.45.00_21.07.2026
 * Reason for changes: W2 minimal — in-process blob store for files-hub putBlob.
 *   Large batches were instantly failing (putBlob stub returned empty url).
 *   Store bytes under stageRoot/blobs and serve via GET /service/files-blob/:t/:b.
 *
 * INVARIANT: transferId/batchId allowlisted (no path traversal). TTL GC on put.
 */
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const SAFE_ID = /^[A-Za-z0-9._-]{1,128}$/;
const DEFAULT_TTL_MS = 30 * 60 * 1000;

export type FilesBlobMeta = {
    transferId: string;
    batchId: string;
    hash: string;
    name: string;
    mimeType: string;
    size: number;
    token: string;
    expiresAt: number;
    filePath: string;
};

const metaByKey = new Map<string, FilesBlobMeta>();

function keyOf(transferId: string, batchId: string): string {
    return `${transferId}\0${batchId}`;
}

export function isSafeBlobId(id: string): boolean {
    return typeof id === "string" && SAFE_ID.test(id) && !id.includes("..");
}

/**
 * Persist batch bytes and return metadata (incl. one-time-ish token for GET).
 */
export async function putFilesBlob(input: {
    rootDir: string;
    transferId: string;
    batchId: string;
    bytes: Uint8Array;
    hash: string;
    name: string;
    mimeType: string;
    ttlMs?: number;
}): Promise<FilesBlobMeta> {
    if (!isSafeBlobId(input.transferId) || !isSafeBlobId(input.batchId)) {
        throw new Error("CWSP_FILES_BLOB_BAD_ID");
    }
    const dir = path.join(input.rootDir, "blobs", input.transferId);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${input.batchId}.bin`);
    await writeFile(filePath, input.bytes);
    const token = randomBytes(16).toString("hex");
    const meta: FilesBlobMeta = {
        transferId: input.transferId,
        batchId: input.batchId,
        hash: input.hash,
        name: input.name,
        mimeType: input.mimeType || "application/octet-stream",
        size: input.bytes.length,
        token,
        expiresAt: Date.now() + (input.ttlMs ?? DEFAULT_TTL_MS),
        filePath,
    };
    metaByKey.set(keyOf(input.transferId, input.batchId), meta);
    void gcExpired();
    return meta;
}

export async function getFilesBlobBytes(
    transferId: string,
    batchId: string,
    token?: string,
): Promise<{ bytes: Buffer; meta: FilesBlobMeta } | null> {
    if (!isSafeBlobId(transferId) || !isSafeBlobId(batchId)) return null;
    const meta = metaByKey.get(keyOf(transferId, batchId));
    if (!meta) return null;
    if (meta.expiresAt < Date.now()) {
        metaByKey.delete(keyOf(transferId, batchId));
        return null;
    }
    // SECURITY: require token when present on the meta (always set by put).
    if (token !== undefined && token !== meta.token) return null;
    try {
        const bytes = await readFile(meta.filePath);
        return { bytes, meta };
    } catch {
        return null;
    }
}

async function gcExpired(): Promise<void> {
    const now = Date.now();
    for (const [k, meta] of metaByKey) {
        if (meta.expiresAt >= now) continue;
        metaByKey.delete(k);
        try {
            await rm(meta.filePath, { force: true });
        } catch {
            /* best-effort */
        }
    }
}

/** Build a loopback/LAN control URL for Cap HTTP GET. */
export function buildFilesBlobUrl(input: {
    baseUrl: string;
    transferId: string;
    batchId: string;
    token: string;
}): string {
    const base = String(input.baseUrl || "").replace(/\/+$/, "");
    return `${base}/service/files-blob/${encodeURIComponent(input.transferId)}/${encodeURIComponent(input.batchId)}?token=${encodeURIComponent(input.token)}`;
}
