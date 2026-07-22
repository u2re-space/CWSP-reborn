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
 *   2026-07-22n: Cap WAN→Neu was broken — peer-first probed Cap LTE LAN for
 *   8s+ before gateway; when asset.url is gateway/WAN, prefer gw LAN→WAN→peer
 *   (desk hairpin). Also httpGetFilesBlobToFile for insecure TLS stream Accept.
 *   2026-07-22o: restore always peer→gwLAN→WAN (LAN P2P first). Short private
 *   connect timeouts cover Cap-on-LTE dead LAN; gateway-first skipped P2P on LAN.
 *   2026-07-22r: httpGetFilesBlobToFile onProgress — Cap Sending bars froze
 *   during large stream Accept because Neu emitted progress only at batch ends.
 *   2026-07-22s: dual-path Accept hedge — peer P2P first, after HEDGE_MS race
 *   gateway; never reorder to gateway-first when asset.url is WAN (LAN/WAN swings).
 *   2026-07-22t: WAN Accept broke again — hub called httpGet per-peer URL without
 *   urls[] so hedge had no gateway class, then fell into hanging getBlob(peer).
 *   bytes GET now uses the same hedged path; callers must pass full candidate urls.
 *   2026-07-22u: 400ms hedge stole LAN P2P — gateway (mirrored) answered before
 *   Cap Control TLS; adaptive exclusive window: ~1.5s same-subnet peer, ~400ms
 *   off-subnet (Cap-on-LTE) so WAN failover stays fast without killing P2P.
 *   2026-07-22v: WAN→Neu failed — claim() rejected same-class retry after gw LAN
 *   mid-stream abort, so WAN URL never tried (GET .200 → files:error). Also
 *   Windows rename(tmp,dest) cannot overwrite; use replaceFile.
 *
 * INVARIANT: transferId/batchId allowlisted (no path traversal). TTL GC on put.
 * INVARIANT (Accept order): peer/P2P → gw LAN → gw WAN → other. Never flip by
 *   primary URL class; reachability is runtime (hedged connect), not reorder.
 */
import { mkdir, writeFile, readFile, rm, copyFile, stat, rename, unlink } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { networkInterfaces, tmpdir } from "node:os";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import type { ClientRequest, IncomingMessage } from "node:http";
import { pipeline } from "node:stream/promises";
import { URL } from "node:url";
import { filterCandidatesByCapability } from "@fest-lib/cwsp-shared/v2/index.ts";
import { getPathCapabilityCache } from "./path-capability-mesh.ts";

/**
 * Total/idle HTTP budget for Accept GET (ms). Scales with declared size so
 * GB streams are not killed at the legacy 180s floor mid-progress.
 * Floor 180s; ~256 KiB/s worst-case + 2 min slack; cap 2h.
 */
export function resolveFilesBlobTransferTimeoutMs(expectedSize?: number): number {
    const floor = 180_000;
    const size = Number(expectedSize) || 0;
    if (size <= 0) return floor;
    const bySize = Math.floor(size / 256) + 120_000;
    return Math.min(Math.max(floor, bySize), 2 * 60 * 60 * 1000);
}

/**
 * Peer exclusive window when peer host is on a local NIC subnet.
 * WHY: Cap Control TLS/handshake often >400ms; gateway mirror answers faster
 * and stole LAN P2P when hedge was 400ms.
 */
export const FILES_BLOB_HEDGE_MS_LAN = 1_500;
/**
 * Fast gateway failover when peer is private but not on our subnet (Cap LTE).
 */
export const FILES_BLOB_HEDGE_MS_WAN = 400;
/** COMPAT: default alias = LAN exclusive window. */
export const FILES_BLOB_HEDGE_MS = FILES_BLOB_HEDGE_MS_LAN;

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
                // WHY: GB PUT at ~5–20 MiB/s needs many minutes; 180s aborted
                // Neu→Cap gigabyte mirrors → Cap Accept had no gateway URL.
                timeout: Math.max(180_000, Math.min(3_600_000, Math.ceil(size / (512 * 1024)) * 1000 + 60_000))
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
                                body: body.slice(0, 200),
                                size
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
 * INVARIANT: never reorder to gateway-first when `asset.url` / primary is WAN —
 * that skipped P2P on same-LAN. Dead Cap-on-LTE LANs fail via short connect +
 * {@link httpGetFilesBlobToFile} hedge (gateway starts after {@link FILES_BLOB_HEDGE_MS}).
 */
export function orderFilesBlobFetchUrls(
    urls: readonly string[],
    _opts?: { primary?: string },
): string[] {
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

/** Split ordered candidates into peer class vs gateway/other (for hedge race). */
export function partitionBlobFetchUrls(urls: readonly string[]): {
    peer: string[];
    gateway: string[];
} {
    const peer: string[] = [];
    const gateway: string[] = [];
    for (const url of urls) {
        if (isPeerLanBlobUrl(url)) peer.push(url);
        else gateway.push(url);
    }
    return { peer, gateway };
}

/** True when peer IPv4 shares a /24 with a non-internal local NIC. */
export function hostOnLocalSubnet(peerHost: string): boolean {
    const host = (peerHost || "").toLowerCase().trim();
    if (!host) return false;
    if (host === "127.0.0.1" || host === "localhost" || host === "::1") return true;
    if (!isPrivateLanHost(host) || host === FLEET_LAN_HOST) return false;
    const peerParts = host.split(".").map((x) => Number(x));
    if (peerParts.length !== 4 || peerParts.some((n) => !Number.isFinite(n))) return false;
    const nets = networkInterfaces();
    for (const list of Object.values(nets)) {
        if (!list) continue;
        for (const n of list) {
            if (n.family !== "IPv4" || n.internal) continue;
            const localParts = n.address.split(".").map((x) => Number(x));
            if (localParts.length !== 4) continue;
            // /24 — fleet LAN phones/desk share 192.168.0.x
            if (
                localParts[0] === peerParts[0]
                && localParts[1] === peerParts[1]
                && localParts[2] === peerParts[2]
            ) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Peer exclusive window before gateway race.
 * Same-subnet Cap Control → long window (P2P). Off-subnet private → short (WAN).
 */
export function resolveFilesBlobHedgeMs(peerUrls: readonly string[]): number {
    for (const url of peerUrls) {
        try {
            const host = new URL(url).hostname.toLowerCase();
            if (hostOnLocalSubnet(host)) return FILES_BLOB_HEDGE_MS_LAN;
        } catch {
            /* */
        }
    }
    return FILES_BLOB_HEDGE_MS_WAN;
}

function isPrivateLanHost(host: string): boolean {
    const h = (host || "").toLowerCase();
    if (!h) return false;
    if (h === "localhost" || h === "127.0.0.1" || h === "::1") return true;
    if (h.startsWith("10.")) return true;
    if (h.startsWith("192.168.")) return true;
    if (h.startsWith("172.")) {
        const second = Number(h.split(".")[1] || "");
        return second >= 16 && second <= 31;
    }
    return false;
}

/**
 * Build ordered HTTP GET candidates from primary URL + optional `asset.urls`.
 * Gateway `/files/blob` URLs also expand LAN↔WAN host variants (same token).
 */
export function expandFilesBlobFetchUrls(
    primary: string,
    extra?: readonly string[],
): string[] {
    // WHY: keep primary first in expansion seed so WAN/gateway primary is visible
    // to orderFilesBlobFetchUrls (do not bury it under Cap peer LAN urls[]).
    const raw = [primary, ...(extra || [])].map((u) => String(u || "").trim()).filter(Boolean);
    const expanded: string[] = [];
    for (const url of raw) {
        expanded.push(url);
        const lan = preferLanGatewayBlobUrl(url);
        const wan = preferWanGatewayBlobUrl(url);
        if (lan !== url) expanded.push(lan);
        if (wan !== url) expanded.push(wan);
    }
    return orderFilesBlobFetchUrls(expanded, { primary });
}

/**
 * HTTP(S) GET blob bytes with fleet self-signed TLS allowed.
 * WHY: Node undici `fetch` rejects gateway certs → Cap→Neu Accept "fetch failed".
 * Uses the same dual-path hedge as {@link httpGetFilesBlobToFile} when `urls`
 * includes peer + gateway (pass the full Accept candidate list).
 */
export async function httpGetFilesBlobBytes(
    url: string,
    opts?: {
        maxBytes?: number;
        timeoutMs?: number;
        urls?: readonly string[];
        hedgeMs?: number;
    }
): Promise<Uint8Array> {
    const maxBytes = opts?.maxBytes ?? 256 * 1024 * 1024;
    const timeoutMs = opts?.timeoutMs ?? 180_000;
    const tmp = path.join(
        tmpdir(),
        `cwsp-blob-bytes-${randomBytes(8).toString("hex")}`,
    );
    try {
        await httpGetFilesBlobToFileHedged(url, tmp, {
            timeoutMs,
            urls: opts?.urls,
            hedgeMs: opts?.hedgeMs,
        });
        const buf = await readFile(tmp);
        if (buf.length > maxBytes) {
            throw new Error(`CWSP_FILES_HTTP_TOO_LARGE:${buf.length}>${maxBytes}`);
        }
        return new Uint8Array(buf);
    } finally {
        try {
            await unlink(tmp);
        } catch {
            /* */
        }
    }
}

/**
 * Stream blob URL → file with insecure TLS (no full Buffer).
 * WHY: files-hub streamBlobUrlToFileOnce used undici `fetch` which rejects
 * gateway self-signed certs; Cap→Neu large Accept then fell into heap getBlob.
 */
/** Byte progress while streaming a files-blob GET to disk. */
export type FilesBlobGetProgress = (bytesDone: number, totalBytes: number) => void;

type HttpGetToFileCtl = {
    /** Return false to drop this 2xx body (lost hedge race). */
    claimBody?: () => boolean;
    /** True when another path already won — abort connect/body. */
    isAborted?: () => boolean;
    onRegisterDestroy?: (destroy: () => void) => void;
};

/**
 * Stream blob URL → file (insecure TLS). Uses dual-path hedge by default:
 * peer class immediately, gateway class after {@link FILES_BLOB_HEDGE_MS}.
 */
export async function httpGetFilesBlobToFile(
    url: string,
    dest: string,
    opts?: {
        timeoutMs?: number;
        expectedSize?: number;
        urls?: readonly string[];
        onProgress?: FilesBlobGetProgress;
        /** Override hedge delay; 0 = start gateway immediately with peer. */
        hedgeMs?: number;
    },
): Promise<void> {
    return httpGetFilesBlobToFileHedged(url, dest, opts);
}

/**
 * Dual-path Accept: peer/P2P first, then race gateway so WAN does not wait
 * the full private connect timeout on dead Cap-on-LTE LAN URLs.
 */
export async function httpGetFilesBlobToFileHedged(
    url: string,
    dest: string,
    opts?: {
        timeoutMs?: number;
        /** Declared Content-Length / asset.size — used when timeoutMs omitted. */
        expectedSize?: number;
        urls?: readonly string[];
        onProgress?: FilesBlobGetProgress;
        hedgeMs?: number;
    },
): Promise<void> {
    const timeoutMs =
        opts?.timeoutMs
        ?? resolveFilesBlobTransferTimeoutMs(opts?.expectedSize);
    // WHY: continuous path mesh — drop known-down Cap Control URLs before hedge.
    const candidates = filterCandidatesByCapability(
        expandFilesBlobFetchUrls(url, opts?.urls),
        getPathCapabilityCache(),
    );
    const { peer, gateway } = partitionBlobFetchUrls(candidates);
    // WHY: adaptive exclusive window — short hedge stole LAN P2P to gateway.
    const hedgeMs = opts?.hedgeMs ?? resolveFilesBlobHedgeMs(peer);

    if (peer.length === 0) {
        await httpGetSequentialToFile(gateway, dest, timeoutMs, opts?.onProgress);
        return;
    }
    if (gateway.length === 0) {
        await httpGetSequentialToFile(peer, dest, timeoutMs, opts?.onProgress);
        return;
    }

    console.info(
        JSON.stringify({
            channel: "cwsp-files-hub",
            event: "blob-get-hedge-start",
            hedgeMs,
            peerCount: peer.length,
            gatewayCount: gateway.length,
        }),
    );

    let winner: "peer" | "gateway" | null = null;
    const destroyFns: Array<{ who: "peer" | "gateway"; destroy: () => void }> = [];
    /**
     * Claim the body stream for a class.
     * WHY: same-class retry must stay allowed — gw LAN mid-abort used to make
     * claim() return false for WAN (winner already "gateway") → files:error
     * while Cap→Neu WAN still had a good WAN URL.
     */
    const claim = (who: "peer" | "gateway"): boolean => {
        if (winner && winner !== who) return false;
        const first = winner == null;
        winner = who;
        if (first) {
            for (const entry of destroyFns) {
                if (entry.who === who) continue;
                try {
                    entry.destroy();
                } catch {
                    /* */
                }
            }
        }
        return true;
    };
    const isAborted = (who: "peer" | "gateway") => winner !== null && winner !== who;

    const replaceFile = async (tmp: string, finalDest: string): Promise<void> => {
        // WHY: Windows rename cannot overwrite an existing dest.
        try {
            await unlink(finalDest);
        } catch {
            /* */
        }
        try {
            await rename(tmp, finalDest);
        } catch {
            await copyFile(tmp, finalDest);
            try {
                await unlink(tmp);
            } catch {
                /* */
            }
        }
    };

    const runClass = async (
        classUrls: string[],
        who: "peer" | "gateway",
    ): Promise<void> => {
        let lastErr: unknown = null;
        for (const candidate of classUrls) {
            if (isAborted(who)) {
                throw new Error("CWSP_FILES_HEDGE_LOST");
            }
            const tmp = `${dest}.hedge-${who}-${randomBytes(4).toString("hex")}`;
            try {
                await httpGetToFileOnce(candidate, tmp, timeoutMs, opts?.onProgress, {
                    claimBody: () => claim(who),
                    isAborted: () => isAborted(who),
                    onRegisterDestroy: (destroy) => {
                        destroyFns.push({ who, destroy });
                    },
                });
                if (winner !== who) {
                    try {
                        await unlink(tmp);
                    } catch {
                        /* */
                    }
                    throw new Error("CWSP_FILES_HEDGE_LOST");
                }
                await replaceFile(tmp, dest);
                console.info(
                    JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "blob-get-hedge-win",
                        who,
                        url: candidate,
                    }),
                );
                return;
            } catch (err) {
                try {
                    await unlink(tmp);
                } catch {
                    /* */
                }
                if (winner && winner !== who) {
                    throw new Error("CWSP_FILES_HEDGE_LOST");
                }
                lastErr = err;
                console.warn(
                    JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "blob-get-file-candidate-fail",
                        who,
                        url: candidate,
                        error: err instanceof Error ? err.message : String(err),
                    }),
                );
            }
        }
        // WHY: release claim so the other class can still win after we exhaust.
        if (winner === who) winner = null;
        throw lastErr instanceof Error
            ? lastErr
            : new Error(String(lastErr || "CWSP_FILES_HTTP_UNREACHABLE"));
    };

    const peerP = runClass(peer, "peer");
    // WHY: if peer class fails before hedge fires, start gateway immediately.
    let hedgeTimer: ReturnType<typeof setTimeout> | null = null;
    let gwStarted = false;
    const gwP = new Promise<void>((resolve, reject) => {
        const startGw = () => {
            if (winner && winner !== "gateway") {
                // Peer already owns the transfer — do not start gateway.
                if (gwStarted) return;
                reject(new Error("CWSP_FILES_HEDGE_LOST"));
                return;
            }
            if (gwStarted) return;
            gwStarted = true;
            if (hedgeTimer) {
                clearTimeout(hedgeTimer);
                hedgeTimer = null;
            }
            runClass(gateway, "gateway").then(resolve, reject);
        };
        hedgeTimer = setTimeout(startGw, Math.max(0, hedgeMs));
        peerP.catch(() => {
            // Peer class exhausted.
            if (winner === "gateway") return; // gateway already owning the GET
            if (winner === "peer") {
                // Peer claimed then failed — it destroyed the in-flight gateway;
                // clear claim and restart gateway class.
                winner = null;
                gwStarted = false;
                startGw();
                return;
            }
            // Peer never claimed — start gateway if the hedge timer has not.
            if (!gwStarted) startGw();
        });
    });

    try {
        await Promise.any([peerP, gwP]);
    } catch (err) {
        // AggregateError when both lose — surface the peer/gateway last errors.
        const agg = err as { errors?: unknown[] };
        const nested = Array.isArray(agg?.errors) ? agg.errors : [err];
        const real = nested.find(
            (e) => !(e instanceof Error && e.message === "CWSP_FILES_HEDGE_LOST"),
        );
        throw real instanceof Error
            ? real
            : new Error(String(real || err || "fetch failed"));
    } finally {
        if (hedgeTimer) clearTimeout(hedgeTimer);
    }
}

async function httpGetSequentialToFile(
    urls: readonly string[],
    dest: string,
    timeoutMs: number,
    onProgress?: FilesBlobGetProgress,
): Promise<void> {
    let lastErr: unknown = null;
    for (const candidate of urls) {
        try {
            await httpGetToFileOnce(candidate, dest, timeoutMs, onProgress);
            return;
        } catch (err) {
            lastErr = err;
            console.warn(
                JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "blob-get-file-candidate-fail",
                    url: candidate,
                    error: err instanceof Error ? err.message : String(err),
                }),
            );
        }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr || "fetch failed"));
}

function connectTimeoutForUrl(urlStr: string): number {
    try {
        const host = new URL(urlStr).hostname.toLowerCase();
        // WHY: Cap LTE "LAN" urls are dead from desk — fail fast; hedge covers WAN.
        if (isPrivateLanHost(host) && host !== FLEET_LAN_HOST) return 1_500;
        if (host === FLEET_LAN_HOST) return 5_000;
        return 15_000;
    } catch {
        return 15_000;
    }
}

function httpGetToFileOnce(
    urlStr: string,
    dest: string,
    timeoutMs: number,
    onProgress?: FilesBlobGetProgress,
    ctl?: HttpGetToFileCtl,
): Promise<void> {
    return new Promise((resolve, reject) => {
        let settled = false;
        let req: ClientRequest | null = null;
        const done = (err: Error | null) => {
            if (settled) return;
            settled = true;
            if (err) reject(err);
            else resolve();
        };
        const destroyReq = () => {
            try {
                req?.destroy();
            } catch {
                /* */
            }
        };
        try {
            if (ctl?.isAborted?.()) {
                done(new Error("CWSP_FILES_HEDGE_LOST"));
                return;
            }
            const target = new URL(urlStr);
            const isHttps = target.protocol === "https:";
            const reqFn = isHttps ? httpsRequest : httpRequest;
            const connectMs = connectTimeoutForUrl(urlStr);
            req = reqFn(
                {
                    protocol: target.protocol,
                    hostname: target.hostname,
                    port: target.port || (isHttps ? 443 : 80),
                    path: target.pathname + target.search,
                    method: "GET",
                    rejectUnauthorized: false,
                    headers: { Accept: "*/*" },
                },
                (res: IncomingMessage) => {
                    // Body may be slow on WAN — relax after headers arrive.
                    try {
                        req?.setTimeout(timeoutMs);
                    } catch {
                        /* */
                    }
                    if (ctl?.isAborted?.()) {
                        res.resume();
                        destroyReq();
                        done(new Error("CWSP_FILES_HEDGE_LOST"));
                        return;
                    }
                    const code = res.statusCode || 0;
                    if (code < 200 || code >= 300) {
                        res.resume();
                        done(new Error(`CWSP_FILES_HTTP_${code}`));
                        return;
                    }
                    // WHY: claim before writing so loser does not touch dest/progress.
                    if (ctl?.claimBody && !ctl.claimBody()) {
                        res.resume();
                        destroyReq();
                        done(new Error("CWSP_FILES_HEDGE_LOST"));
                        return;
                    }
                    const declared = Number(res.headers["content-length"]) || 0;
                    if (!onProgress) {
                        const out = createWriteStream(dest);
                        pipeline(res, out)
                            .then(() => done(null))
                            .catch((e) => done(e instanceof Error ? e : new Error(String(e))));
                        return;
                    }
                    const out = createWriteStream(dest);
                    let written = 0;
                    let lastReport = 0;
                    let lastReportMs = Date.now();
                    const tick = (force = false) => {
                        const now = Date.now();
                        if (
                            !force
                            && written - lastReport < 256 * 1024
                            && now - lastReportMs < 400
                        ) {
                            return;
                        }
                        lastReport = written;
                        lastReportMs = now;
                        try {
                            onProgress(written, declared > 0 ? declared : written);
                        } catch {
                            /* best-effort */
                        }
                    };
                    res.on("data", (chunk: Buffer | string) => {
                        if (ctl?.isAborted?.()) {
                            destroyReq();
                            try {
                                out.destroy();
                            } catch {
                                /* */
                            }
                            done(new Error("CWSP_FILES_HEDGE_LOST"));
                            return;
                        }
                        const buf = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
                        written += buf.length;
                        if (!out.write(buf)) {
                            res.pause();
                            out.once("drain", () => res.resume());
                        }
                        tick(false);
                    });
                    res.on("end", () => {
                        tick(true);
                        out.end(() => done(null));
                    });
                    res.on("error", (e) => {
                        try {
                            out.destroy();
                        } catch {
                            /* */
                        }
                        done(e instanceof Error ? e : new Error(String(e)));
                    });
                    out.on("error", (e) => {
                        try {
                            res.destroy();
                        } catch {
                            /* */
                        }
                        done(e instanceof Error ? e : new Error(String(e)));
                    });
                },
            );
            ctl?.onRegisterDestroy?.(destroyReq);
            // Connect-ish timeout: destroy early on dead Cap LAN peers.
            req.setTimeout(connectMs, () => {
                destroyReq();
                done(new Error("CWSP_FILES_HTTP_CONNECT_TIMEOUT"));
            });
            req.on("error", (e) => done(e instanceof Error ? e : new Error(String(e))));
            req.end();
        } catch (e) {
            done(e instanceof Error ? e : new Error(String(e)));
        }
    });
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
            const connectMs = connectTimeoutForUrl(urlStr);
            const req = reqFn(
                {
                    protocol: target.protocol,
                    hostname: target.hostname,
                    port: target.port || (isHttps ? 443 : 80),
                    path: target.pathname + target.search,
                    method: "GET",
                    rejectUnauthorized: false,
                    headers: { Accept: "*/*" }
                },
                (res: IncomingMessage) => {
                    try {
                        req.setTimeout(timeoutMs);
                    } catch {
                        /* */
                    }
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
            req.setTimeout(connectMs, () => {
                try {
                    req.destroy();
                } catch {
                    /* */
                }
                done(new Error("CWSP_FILES_HTTP_CONNECT_TIMEOUT"));
            });
            req.on("error", (e) => done(e instanceof Error ? e : new Error(String(e))));
            req.end();
        } catch (e) {
            done(e instanceof Error ? e : new Error(String(e)));
        }
    });
}
