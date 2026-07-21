/*
 * Filename: files-blob-store.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-blob-store.ts
 * Change date and time: 00.50.00_22.07.2026
 * Reason for changes: W2 minimal — in-process blob store for files-hub putBlob.
 *   Large batches were instantly failing (putBlob stub returned empty url).
 *   Store bytes under stageRoot/blobs and serve via GET /service/files-blob/:t/:b.
 *   2026-07-21k: putFilesBlobFromFile + getFilesBlobOpen — gigabyte files must
 *   never readFile/writeFile a full Buffer (stream / copyFile only).
 *   2026-07-22: mirrorFilesBlobToGateway — WAN Accept cannot HTTP-GET desk
 *   LAN `:29110` URLs; PUT bytes to gateway `/files/blob` first.
 *   2026-07-22: expandFilesBlobFetchUrls / orderFilesBlobFetchUrls — P2P-first
 *   Accept candidates (peer → gateway LAN → WAN).
 *
 * INVARIANT: transferId/batchId allowlisted (no path traversal). TTL GC on put.
 */
import { mkdir, writeFile, readFile, rm, copyFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { networkInterfaces } from "node:os";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import type { IncomingMessage } from "node:http";
import { URL } from "node:url";

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
    const raw = String(peerId || "").trim();
    const full = /^L-(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(raw);
    if (full) return full[1]!;
    // COMPAT: short fleet ids used in Neutralino prefs (L-110 / L-210).
    const short = /^L-(\d{1,3})$/i.exec(raw);
    if (!short) return null;
    const n = short[1]!;
    if (n === "110") return "192.168.0.110";
    if (n === "196") return "192.168.0.196";
    if (n === "200") return "192.168.0.200";
    if (n === "208") return "192.168.0.208";
    if (n === "210") return "192.168.0.210";
    return null;
}

/** Last-resort fleet WAN host; prefer settings/env relay·hub·endpoint. */
const FLEET_WAN_HOST_FALLBACK = "45.147.121.152";
const FLEET_LAN_HOST = "192.168.0.200";

function envFirst(...keys: string[]): string {
    for (const k of keys) {
        const v = String(process.env[k] || "").trim();
        if (v) return v;
    }
    return "";
}

function httpsBaseOf(raw: string): string {
    let e = String(raw || "").trim().replace(/\/+$/, "");
    if (!e) return "";
    const lower = e.toLowerCase();
    if (lower.startsWith("wss://")) e = "https://" + e.slice(6);
    else if (lower.startsWith("ws://")) e = "http://" + e.slice(5);
    else if (!lower.startsWith("http://") && !lower.startsWith("https://")) e = "https://" + e;
    const ws = e.toLowerCase().indexOf("/ws");
    if (ws > 0) e = e.slice(0, ws);
    return e.replace(/\/+$/, "");
}

function hostOfBase(base: string): string {
    try {
        return new URL(base).hostname.toLowerCase();
    } catch {
        return "";
    }
}

/** WAN HTTPS base: settings/env first, historical VPS IP last. */
export function resolveConfiguredWanGatewayHttpsBase(extras: unknown[] = []): string {
    const preferred = [
        envFirst(
            "CWS_FILES_PUBLIC_WAN_BASE_URL",
            "CWS_GATEWAY_WAN_BASE_URL",
            "CWSP_GATEWAY_WAN_URL",
            "CWS_RELAY_HTTPS_URL",
            "CWSP_RELAY_HTTPS_URL",
            "CWSP_HUB_URL",
            "CWSP_ENDPOINT_URL",
        ),
        ...extras.map((x) => String(x || "").trim()),
    ];
    for (const raw of preferred) {
        const base = httpsBaseOf(raw);
        const host = hostOfBase(base);
        if (!base || !host) continue;
        if (host === FLEET_LAN_HOST) continue;
        return base;
    }
    return `https://${FLEET_WAN_HOST_FALLBACK}:8434`;
}

export function resolveConfiguredWanGatewayHost(extras: unknown[] = []): string {
    return hostOfBase(resolveConfiguredWanGatewayHttpsBase(extras)) || FLEET_WAN_HOST_FALLBACK;
}

/** True when base looks like the CWSP coordinator (LAN .200 or configured/fallback WAN). */
export function isGatewayFilesBase(base: string): boolean {
    const b = String(base || "").toLowerCase();
    if (!b) return false;
    if (b.includes("192.168.0.200") || b.includes("l-192.168.0.200") || b.includes("l-200")) {
        return true;
    }
    const wan = resolveConfiguredWanGatewayHost().toLowerCase();
    return Boolean(wan) && b.includes(wan);
}

/**
 * Normalize settings hub/endpoint URL → `https://host:8434` (no /ws).
 */
export function resolveGatewayHttpBase(candidates: unknown[]): string | null {
    for (const raw of candidates) {
        const s = String(raw || "").trim();
        if (!s) continue;
        const e = httpsBaseOf(s);
        if (isGatewayFilesBase(e)) return e;
    }
    return null;
}

/**
 * Stream local blob file to gateway PUT `/files/blob/:t/:b`.
 * @returns public GET URL with minted token, or null on failure
 */
export async function mirrorFilesBlobToGateway(input: {
    gatewayBase: string;
    uploadSecret: string;
    transferId: string;
    batchId: string;
    filePath: string;
    mimeType?: string;
    size?: number;
}): Promise<{ url: string; token: string; size: number } | null> {
    const base = String(input.gatewayBase || "").replace(/\/+$/, "");
    const secret = String(input.uploadSecret || "").trim();
    if (!base || !secret || !isSafeBlobId(input.transferId) || !isSafeBlobId(input.batchId)) {
        return null;
    }
    if (!input.filePath) return null;
    let size = input.size ?? 0;
    try {
        if (!size) size = (await stat(input.filePath)).size;
    } catch {
        return null;
    }
    if (size <= 0) return null;

    const putUrl = `${base}/files/blob/${encodeURIComponent(input.transferId)}/${encodeURIComponent(input.batchId)}`;
    const target = new URL(putUrl);
    const isHttps = target.protocol === "https:";
    const reqFn = isHttps ? httpsRequest : httpRequest;

    return await new Promise((resolve) => {
        const req = reqFn(
            {
                protocol: target.protocol,
                hostname: target.hostname,
                port: target.port || (isHttps ? 443 : 80),
                path: target.pathname + target.search,
                method: "PUT",
                headers: {
                    "Content-Type": "application/octet-stream",
                    "Content-Length": String(size),
                    "X-CWSP-Files-Upload-Secret": secret,
                    ...(input.mimeType
                        ? { "X-CWSP-Files-Mime": input.mimeType }
                        : {})
                },
                // COMPAT: fleet self-signed TLS on .200 / WAN entry.
                rejectUnauthorized: false,
                timeout: 180_000
            },
            (res: IncomingMessage) => {
                const chunks: Buffer[] = [];
                res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
                res.on("end", () => {
                    const body = Buffer.concat(chunks).toString("utf8");
                    const code = res.statusCode || 0;
                    if (code < 200 || code >= 300) {
                        console.warn(
                            JSON.stringify({
                                channel: "cwsp-files-hub",
                                event: "gateway-mirror-fail",
                                code,
                                body: body.slice(0, 200)
                            })
                        );
                        resolve(null);
                        return;
                    }
                    let token = "";
                    try {
                        token = String(JSON.parse(body)?.token || "");
                    } catch {
                        /* */
                    }
                    if (!token) {
                        resolve(null);
                        return;
                    }
                    const url =
                        `${base}/files/blob/${input.transferId}/${input.batchId}`
                        + `?token=${encodeURIComponent(token)}`;
                    console.log(
                        JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: "gateway-mirror-ok",
                            transferId: input.transferId,
                            batchId: input.batchId,
                            size,
                            url
                        })
                    );
                    resolve({ url, token, size });
                });
            }
        );
        req.on("error", (err) => {
            console.warn(
                JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "gateway-mirror-error",
                    error: err instanceof Error ? err.message : String(err)
                })
            );
            resolve(null);
        });
        req.on("timeout", () => {
            try {
                req.destroy();
            } catch {
                /* */
            }
            resolve(null);
        });
        createReadStream(input.filePath).pipe(req);
    });
}

/**
 * Prefer LAN gateway when Accept runs on the desk (hairpin NAT to WAN IP often
 * fails). Keep path+query; swap host for configured/fallback WAN entry.
 */
export function preferLanGatewayBlobUrl(url: string): string {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        const wan = resolveConfiguredWanGatewayHost();
        if (
            (host === wan || host === FLEET_WAN_HOST_FALLBACK)
            && (u.pathname || "").includes("/files/blob/")
        ) {
            u.hostname = FLEET_LAN_HOST;
            return u.toString();
        }
    } catch {
        /* */
    }
    return url;
}

/** Prefer WAN gateway entry (LTE-reachable) for the same token/path. */
export function preferWanGatewayBlobUrl(url: string): string {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        if (host === FLEET_LAN_HOST && (u.pathname || "").includes("/files/blob/")) {
            u.hostname = resolveConfiguredWanGatewayHost();
            return u.toString();
        }
    } catch {
        /* */
    }
    return url;
}

function dedupeBlobUrls(urls: readonly string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of urls) {
        const u = String(raw || "").trim();
        if (!u || seen.has(u)) continue;
        seen.add(u);
        out.push(u);
    }
    return out;
}

function isPeerLanBlobUrl(url: string): boolean {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        const path = u.pathname || "";
        const wan = resolveConfiguredWanGatewayHost();
        if (host === FLEET_LAN_HOST || host === wan || host === FLEET_WAN_HOST_FALLBACK) {
            return false;
        }
        if (path.includes("/service/files-blob/")) return true;
        if (path.includes("/files/blob/") && host.startsWith("192.168.")) return true;
        return false;
    } catch {
        return false;
    }
}

/**
 * Order Accept candidates: peer/P2P → gateway LAN → gateway WAN → other.
 * WHY: fastest path when both ends share a LAN; WAN remains LTE fallback.
 */
export function orderFilesBlobFetchUrls(urls: readonly string[]): string[] {
    const wan = resolveConfiguredWanGatewayHost();
    const peer: string[] = [];
    const gwLan: string[] = [];
    const gwWan: string[] = [];
    const other: string[] = [];
    for (const url of dedupeBlobUrls(urls)) {
        try {
            const host = new URL(url).hostname.toLowerCase();
            if (host === FLEET_LAN_HOST) gwLan.push(url);
            else if (host === wan || host === FLEET_WAN_HOST_FALLBACK) gwWan.push(url);
            else if (isPeerLanBlobUrl(url)) peer.push(url);
            else other.push(url);
        } catch {
            other.push(url);
        }
    }
    return [...peer, ...gwLan, ...gwWan, ...other];
}

/**
 * Build ordered HTTP GET candidates from primary URL + optional `asset.urls`.
 * Gateway `/files/blob` URLs also expand LAN↔WAN host variants (same token).
 */
export function expandFilesBlobFetchUrls(
    primary: string,
    extra?: readonly string[],
): string[] {
    const raw = [...(extra || []), primary].map((u) => String(u || "").trim()).filter(Boolean);
    const expanded: string[] = [];
    for (const url of raw) {
        expanded.push(url);
        const lan = preferLanGatewayBlobUrl(url);
        const wan = preferWanGatewayBlobUrl(url);
        if (lan !== url) expanded.push(lan);
        if (wan !== url) expanded.push(wan);
    }
    return orderFilesBlobFetchUrls(expanded);
}

/**
 * HTTP(S) GET blob bytes with fleet self-signed TLS allowed.
 * WHY: Node undici `fetch` rejects gateway certs → Cap→Neu Accept "fetch failed".
 * Tries ordered candidates (peer → gw LAN → WAN) when `urls` is provided.
 */
export async function httpGetFilesBlobBytes(
    url: string,
    opts?: { maxBytes?: number; timeoutMs?: number; urls?: readonly string[] }
): Promise<Uint8Array> {
    const maxBytes = opts?.maxBytes ?? 256 * 1024 * 1024;
    const timeoutMs = opts?.timeoutMs ?? 180_000;
    const candidates = expandFilesBlobFetchUrls(url, opts?.urls);

    let lastErr: unknown = null;
    for (const candidate of candidates) {
        try {
            return await httpGetBufferOnce(candidate, maxBytes, timeoutMs);
        } catch (err) {
            lastErr = err;
            console.warn(
                JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "blob-get-candidate-fail",
                    url: candidate,
                    error: err instanceof Error ? err.message : String(err)
                })
            );
        }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr || "fetch failed"));
}

function httpGetBufferOnce(urlStr: string, maxBytes: number, timeoutMs: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        let settled = false;
        const done = (err: Error | null, buf?: Uint8Array) => {
            if (settled) return;
            settled = true;
            if (err) reject(err);
            else resolve(buf || new Uint8Array(0));
        };
        try {
            const target = new URL(urlStr);
            const isHttps = target.protocol === "https:";
            const reqFn = isHttps ? httpsRequest : httpRequest;
            const req = reqFn(
                {
                    protocol: target.protocol,
                    hostname: target.hostname,
                    port: target.port || (isHttps ? 443 : 80),
                    path: target.pathname + target.search,
                    method: "GET",
                    rejectUnauthorized: false,
                    timeout: timeoutMs,
                    headers: { Accept: "*/*" }
                },
                (res: IncomingMessage) => {
                    const code = res.statusCode || 0;
                    if (code < 200 || code >= 300) {
                        res.resume();
                        done(new Error(`CWSP_FILES_HTTP_${code}`));
                        return;
                    }
                    const chunks: Buffer[] = [];
                    let total = 0;
                    res.on("data", (c) => {
                        const b = Buffer.isBuffer(c) ? c : Buffer.from(c);
                        total += b.length;
                        if (total > maxBytes) {
                            try {
                                req.destroy();
                            } catch {
                                /* */
                            }
                            done(new Error("CWSP_FILES_BLOB_TOO_LARGE_FOR_HEAP"));
                            return;
                        }
                        chunks.push(b);
                    });
                    res.on("end", () => done(null, new Uint8Array(Buffer.concat(chunks))));
                    res.on("error", (e) => done(e instanceof Error ? e : new Error(String(e))));
                }
            );
            req.on("error", (e) => done(e instanceof Error ? e : new Error(String(e))));
            req.on("timeout", () => {
                try {
                    req.destroy();
                } catch {
                    /* */
                }
                done(new Error("CWSP_FILES_HTTP_TIMEOUT"));
            });
            req.end();
        } catch (e) {
            done(e instanceof Error ? e : new Error(String(e)));
        }
    });
}
