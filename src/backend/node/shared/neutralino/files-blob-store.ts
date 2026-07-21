/*
 * Filename: files-blob-store.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-blob-store.ts
 * Change date and time: 22.10.00_21.07.2026
 * Reason for changes: W2 minimal — in-process blob store for files-hub putBlob.
 *   Large batches were instantly failing (putBlob stub returned empty url).
 *   Store bytes under stageRoot/blobs and serve via GET /service/files-blob/:t/:b.
 *   2026-07-21k: putFilesBlobFromFile + getFilesBlobOpen — gigabyte files must
 *   never readFile/writeFile a full Buffer (stream / copyFile only).
 *
 * INVARIANT: transferId/batchId allowlisted (no path traversal). TTL GC on put.
 */
import { mkdir, writeFile, readFile, rm, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { networkInterfaces } from "node:os";

const SAFE_ID = /^[A-Za-z0-9._-]{1,128}$/;
const DEFAULT_TTL_MS = 30 * 60 * 1000;
/** Legacy getFilesBlobBytes refuses to heap-load above this. */
const HEAP_GET_MAX = 64 * 1024 * 1024;

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
 * Prefer {@link putFilesBlobFromFile} for large/GB batches.
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
    return registerMeta({
        transferId: input.transferId,
        batchId: input.batchId,
        hash: input.hash,
        name: input.name,
        mimeType: input.mimeType || "application/octet-stream",
        size: input.bytes.length,
        filePath,
        ttlMs: input.ttlMs,
    });
}

/**
 * Persist by copying/streaming from an on-disk source (constant memory).
 * WHY: Neutralino Explorer copy of multi-GB files must not Buffer.alloc(size).
 */
export async function putFilesBlobFromFile(input: {
    rootDir: string;
    transferId: string;
    batchId: string;
    sourcePath: string;
    hash: string;
    name: string;
    mimeType: string;
    size?: number;
    ttlMs?: number;
}): Promise<FilesBlobMeta> {
    if (!isSafeBlobId(input.transferId) || !isSafeBlobId(input.batchId)) {
        throw new Error("CWSP_FILES_BLOB_BAD_ID");
    }
    if (!input.sourcePath) throw new Error("CWSP_FILES_BLOB_NO_SOURCE");
    const dir = path.join(input.rootDir, "blobs", input.transferId);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${input.batchId}.bin`);
    const srcAbs = path.resolve(input.sourcePath);
    const destAbs = path.resolve(filePath);
    if (srcAbs !== destAbs) {
        // WHY: GB files — prefer hardlink (instant) over full second copy.
        try {
            const { link } = await import("node:fs/promises");
            await link(srcAbs, destAbs);
        } catch {
            await copyFile(srcAbs, destAbs);
        }
    }
    const st = await stat(destAbs);
    const size = st.size > 0 ? st.size : (input.size ?? 0);
    if (size <= 0) throw new Error("CWSP_FILES_BLOB_EMPTY");
    return registerMeta({
        transferId: input.transferId,
        batchId: input.batchId,
        hash: input.hash,
        name: input.name,
        mimeType: input.mimeType || "application/octet-stream",
        size,
        filePath: destAbs,
        ttlMs: input.ttlMs,
    });
}

function registerMeta(input: {
    transferId: string;
    batchId: string;
    hash: string;
    name: string;
    mimeType: string;
    size: number;
    filePath: string;
    ttlMs?: number;
}): FilesBlobMeta {
    const token = randomBytes(16).toString("hex");
    const meta: FilesBlobMeta = {
        transferId: input.transferId,
        batchId: input.batchId,
        hash: input.hash,
        name: input.name,
        mimeType: input.mimeType,
        size: input.size,
        token,
        expiresAt: Date.now() + (input.ttlMs ?? DEFAULT_TTL_MS),
        filePath: input.filePath,
    };
    metaByKey.set(keyOf(input.transferId, input.batchId), meta);
    void gcExpired();
    return meta;
}

/**
 * Token-validated open for streaming HTTP (no heap load).
 */
export function getFilesBlobOpen(
    transferId: string,
    batchId: string,
    token?: string,
): FilesBlobMeta | null {
    if (!isSafeBlobId(transferId) || !isSafeBlobId(batchId)) return null;
    const meta = metaByKey.get(keyOf(transferId, batchId));
    if (!meta) return null;
    if (meta.expiresAt < Date.now()) {
        metaByKey.delete(keyOf(transferId, batchId));
        return null;
    }
    if (token !== undefined && token !== meta.token) return null;
    return meta;
}

/** COMPAT: small blobs only — prefer {@link getFilesBlobOpen} + createReadStream. */
export async function getFilesBlobBytes(
    transferId: string,
    batchId: string,
    token?: string,
): Promise<{ bytes: Buffer; meta: FilesBlobMeta } | null> {
    const meta = getFilesBlobOpen(transferId, batchId, token);
    if (!meta) return null;
    if (meta.size > HEAP_GET_MAX) {
        return null;
    }
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

/** Build a LAN-reachable control URL for Cap HTTP GET. */
export function buildFilesBlobUrl(input: {
    baseUrl: string;
    transferId: string;
    batchId: string;
    token: string;
}): string {
    const base = String(input.baseUrl || "").replace(/\/+$/, "");
    return `${base}/service/files-blob/${encodeURIComponent(input.transferId)}/${encodeURIComponent(input.batchId)}?token=${encodeURIComponent(input.token)}`;
}

export function detectLanIpv4(prefix = "192.168.0."): string | null {
    const nets = networkInterfaces();
    for (const list of Object.values(nets)) {
        if (!list) continue;
        for (const n of list) {
            if (n.family !== "IPv4" || n.internal) continue;
            if (n.address.startsWith(prefix)) return n.address;
        }
    }
    for (const list of Object.values(nets)) {
        if (!list) continue;
        for (const n of list) {
            if (n.family !== "IPv4" || n.internal) continue;
            return n.address;
        }
    }
    return null;
}

export function lanHostFromPeerId(peerId: string): string | null {
    const m = /^L-(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(String(peerId || "").trim());
    return m ? m[1]! : null;
}
