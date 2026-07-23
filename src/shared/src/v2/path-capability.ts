/*
 * Filename: path-capability.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/path-capability.ts
 * Change date and time: 17.10.00_23.07.2026
 * Reason for changes: Continuous P2P Path Capability Mesh — shared types,
 *   TTL cache, packet builders, and Accept candidate filtering so Cap/Neu
 *   discover lan-direct / lan-gateway / wan-gateway *before* file transfer.
 *   2026-07-23: Multi-hub failover + identity peer maps — wan-direct,
 *   peerRegistry, merge/order helpers (LAN → white IP → hub).
 *
 * INVARIANT: never reorder Accept to gateway-first when peer is unknown/ok;
 *   only drop known-down lan-direct URLs (fresh cache).
 * INVARIANT: dial preference is identity-verified lan-direct → wan-direct → hub.
 */

import { createCwspPacket } from "./packet.ts";
import type { CwspPacket, CwspPacketInput } from "./types.ts";

/** Route class names aligned with endpoint files/route-probe.ts. */
export type RouteClass =
    | "lan-direct"
    | "lan-gateway"
    | "wan-gateway"
    | "wan-direct";

/** Stable wire action for path mesh announce / ask / result. */
export const NETWORK_WHAT_PATH_CAPABILITY = "network:pathCapability";

/** Hub registry ask/result — peer id → known Control origins (2B). */
export const NETWORK_WHAT_PEER_REGISTRY = "network:peerRegistry";

export const PATH_CAPABILITY_DEFAULT_TTL_MS = 90_000;

/** How an endpoint mapping was learned (trust ordering below). */
export type PeerEndpointSource = "probe" | "self" | "hub" | "cache";

export interface PathProbeResult {
    toId: string;
    class: RouteClass;
    ok: boolean;
    rttMs?: number;
    origin?: string;
    error?: string;
    /** Wall time when this probe was observed (ms). */
    ts?: number;
    /** True when pair/hello (or equivalent) confirmed matching clientId. */
    verified?: boolean;
    source?: PeerEndpointSource;
}

/**
 * Compact peer Control endpoint for local durable maps / announce extras.
 * WHY: P2P dial must not depend on whichever hub is currently active.
 */
export interface PeerEndpoint {
    toId: string;
    class: "lan-direct" | "wan-direct";
    origin: string;
    verified?: boolean;
    source?: PeerEndpointSource;
    ts?: number;
    lastVerifiedAt?: number;
}

export interface PathCapabilitySnapshot {
    fromId: string;
    lanHost?: string;
    controlPort?: number;
    ts: number;
    ttlMs: number;
    paths: PathProbeResult[];
    /** Optional self/public Control endpoints this peer advertises (2A). */
    endpoints?: PeerEndpoint[];
}

export interface PathCapabilityCacheEntry {
    result: PathProbeResult;
    expiresAt: number;
}

export interface PathCapabilityCache {
    get(toId: string, routeClass: RouteClass): PathProbeResult | undefined;
    set(result: PathProbeResult, ttlMs?: number): void;
    /** Merge a remote/local snapshot; newer ts wins per (toId, class). */
    mergeSnapshot(snapshot: PathCapabilitySnapshot): void;
    /** True when a fresh entry says lan-direct is down for toId. */
    isLanDirectKnownDown(toId: string): boolean;
    /** True when a fresh entry says lan-direct is up for toId. */
    isLanDirectKnownUp(toId: string): boolean;
    listFresh(): PathProbeResult[];
    invalidate(toId: string, routeClass?: RouteClass): void;
    clear(): void;
    snapshot(fromId: string, extras?: Partial<PathCapabilitySnapshot>): PathCapabilitySnapshot;
}

function cacheKey(toId: string, routeClass: RouteClass): string {
    return `${String(toId || "").trim().toLowerCase()}|${routeClass}`;
}

/**
 * Small in-memory TTL cache for local path probes (and inbound announces).
 * WHY: Accept must skip known-dead Cap Control peers without re-probing every GET.
 */
export function createPathCapabilityCache(defaultTtlMs = PATH_CAPABILITY_DEFAULT_TTL_MS): PathCapabilityCache {
    const store = new Map<string, PathCapabilityCacheEntry>();
    const now = () => Date.now();

    const getFresh = (toId: string, routeClass: RouteClass): PathProbeResult | undefined => {
        const key = cacheKey(toId, routeClass);
        const hit = store.get(key);
        if (!hit) return undefined;
        if (hit.expiresAt <= now()) {
            store.delete(key);
            return undefined;
        }
        return hit.result;
    };

    return {
        get(toId, routeClass) {
            return getFresh(toId, routeClass);
        },
        set(result, ttlMs) {
            const toId = String(result?.toId || "").trim();
            if (!toId || !result?.class) return;
            // WHY: allow short TTLs in tests; production uses 90s default.
            const ttl = Math.max(10, Number(ttlMs) || defaultTtlMs);
            const ts = Number(result.ts) || now();
            store.set(cacheKey(toId, result.class), {
                result: { ...result, toId, ts },
                expiresAt: ts + ttl,
            });
        },
        mergeSnapshot(snapshot) {
            if (!snapshot || !Array.isArray(snapshot.paths)) return;
            const ttl = Math.max(10, Number(snapshot.ttlMs) || defaultTtlMs);
            const baseTs = Number(snapshot.ts) || now();
            for (const p of snapshot.paths) {
                if (!p || !p.toId || !p.class) continue;
                const key = cacheKey(p.toId, p.class);
                const prev = store.get(key);
                const ts = Number(p.ts) || baseTs;
                if (prev && Number(prev.result.ts || 0) > ts) continue;
                store.set(key, {
                    result: { ...p, ts },
                    expiresAt: ts + ttl,
                });
            }
        },
        isLanDirectKnownDown(toId) {
            const hit = getFresh(toId, "lan-direct");
            return Boolean(hit && hit.ok === false);
        },
        isLanDirectKnownUp(toId) {
            const hit = getFresh(toId, "lan-direct");
            return Boolean(hit && hit.ok === true);
        },
        listFresh() {
            const out: PathProbeResult[] = [];
            const t = now();
            for (const [key, entry] of store) {
                if (entry.expiresAt <= t) {
                    store.delete(key);
                    continue;
                }
                out.push(entry.result);
            }
            return out;
        },
        invalidate(toId, routeClass) {
            if (!routeClass) {
                const prefix = `${String(toId || "").trim().toLowerCase()}|`;
                for (const key of [...store.keys()]) {
                    if (key.startsWith(prefix)) store.delete(key);
                }
                return;
            }
            store.delete(cacheKey(toId, routeClass));
        },
        clear() {
            store.clear();
        },
        snapshot(fromId, extras) {
            return {
                fromId: String(fromId || "").trim() || "unknown",
                lanHost: extras?.lanHost,
                controlPort: extras?.controlPort ?? 8434,
                ts: extras?.ts ?? now(),
                ttlMs: extras?.ttlMs ?? defaultTtlMs,
                paths: this.listFresh(),
            };
        },
    };
}

export function parsePathCapabilityPayload(raw: unknown): PathCapabilitySnapshot | null {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    const fromId = String(o.fromId || "").trim();
    if (!fromId) return null;
    const pathsRaw = Array.isArray(o.paths) ? o.paths : [];
    const paths: PathProbeResult[] = [];
    for (const item of pathsRaw) {
        if (!item || typeof item !== "object") continue;
        const p = item as Record<string, unknown>;
        const toId = String(p.toId || "").trim();
        const cls = String(p.class || "").trim() as RouteClass;
        if (!toId) continue;
        if (
            cls !== "lan-direct"
            && cls !== "lan-gateway"
            && cls !== "wan-gateway"
            && cls !== "wan-direct"
        ) {
            continue;
        }
        const entry: PathProbeResult = {
            toId,
            class: cls,
            ok: Boolean(p.ok),
        };
        if (p.rttMs != null && Number.isFinite(Number(p.rttMs))) entry.rttMs = Number(p.rttMs);
        if (typeof p.origin === "string" && p.origin) entry.origin = p.origin;
        if (typeof p.error === "string" && p.error) entry.error = p.error;
        if (p.ts != null && Number.isFinite(Number(p.ts))) entry.ts = Number(p.ts);
        if (typeof p.verified === "boolean") entry.verified = p.verified;
        const src = String(p.source || "").trim() as PeerEndpointSource;
        if (src === "probe" || src === "self" || src === "hub" || src === "cache") {
            entry.source = src;
        }
        paths.push(entry);
    }
    const endpoints = parsePeerEndpoints(o.endpoints, fromId);
    return {
        fromId,
        lanHost: typeof o.lanHost === "string" ? o.lanHost : undefined,
        controlPort: o.controlPort != null ? Number(o.controlPort) || 8434 : 8434,
        ts: Number(o.ts) || Date.now(),
        ttlMs: Number(o.ttlMs) || PATH_CAPABILITY_DEFAULT_TTL_MS,
        paths,
        endpoints: endpoints.length ? endpoints : undefined,
    };
}

export function buildPathCapabilityPacket(input: {
    snapshot: PathCapabilitySnapshot;
    sender: string;
    destinations?: string[];
    uuid: string;
    timestamp: number;
    op?: "act" | "ask" | "result";
}): CwspPacket {
    const snap = input.snapshot;
    const payload: Record<string, unknown> = {
        fromId: snap.fromId,
        lanHost: snap.lanHost ?? "",
        controlPort: snap.controlPort ?? 8434,
        ts: snap.ts,
        ttlMs: snap.ttlMs,
        paths: snap.paths,
    };
    if (snap.endpoints?.length) payload.endpoints = snap.endpoints;
    const packetInput: CwspPacketInput = {
        op: input.op ?? "act",
        what: NETWORK_WHAT_PATH_CAPABILITY,
        purpose: "general",
        sender: input.sender,
        uuid: input.uuid,
        timestamp: input.timestamp,
        destinations: input.destinations?.length ? input.destinations : ["*"],
        payload,
        flags: { canonicalV2: true },
    };
    return createCwspPacket(packetInput);
}

/** Fleet / short clientId → dotted LAN IPv4 (home mesh). */
export function lanHostFromPeerId(peerId: string): string | null {
    if (!peerId) return null;
    const id = peerId.trim();
    if (!/^L-/i.test(id)) return null;
    const host = id.slice(2).trim();
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return host;
    if (host === "110") return "192.168.0.110";
    if (host === "196") return "192.168.0.196";
    if (host === "208") return "192.168.0.208";
    if (host === "210") return "192.168.0.210";
    if (host === "200") return "192.168.0.200";
    return null;
}

/** Infer peer id from a Cap Control / gateway blob URL host when possible. */
export function peerIdFromLanHost(host: string): string | null {
    const h = String(host || "").trim().toLowerCase();
    if (!h) return null;
    if (h === "192.168.0.110") return "L-110";
    if (h === "192.168.0.196") return "L-196";
    if (h === "192.168.0.208") return "L-208";
    if (h === "192.168.0.210") return "L-210";
    if (h === "192.168.0.200") return "L-200";
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return `L-${h}`;
    return null;
}

export function classifyBlobFetchUrl(
    url: string,
    opts?: { lanGatewayHost?: string; wanGatewayHost?: string },
): RouteClass | "other" {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        const path = u.pathname || "";
        const lanGw = (opts?.lanGatewayHost || "192.168.0.200").toLowerCase();
        const wanGw = (opts?.wanGatewayHost || "").toLowerCase();
        if (host === lanGw) return "lan-gateway";
        if (wanGw && host === wanGw) return "wan-gateway";
        // Historical WAN fallback often still in offers.
        if (host === "45.147.121.152") return "wan-gateway";
        if (path.includes("/service/files-blob/")) return "lan-direct";
        if (path.includes("/files/blob/") && host.startsWith("192.168.")) return "lan-direct";
        return "other";
    } catch {
        return "other";
    }
}

/**
 * Filter Accept candidates using the local mesh cache.
 * WHY: drop known-down Cap Control (lan-direct) URLs so Cap↔Cap does not wait
 * on a dead peer before hedging to gateway. Never promote gateway above peer
 * when peer is unknown or known-up — order stays peer → gwLAN → gwWAN.
 */
export function filterCandidatesByCapability(
    urls: readonly string[],
    cache: PathCapabilityCache,
    opts?: {
        lanGatewayHost?: string;
        wanGatewayHost?: string;
        /** Map URL host → peer id; default uses peerIdFromLanHost. */
        peerIdForUrl?: (url: string) => string | null;
    },
): string[] {
    const peerIdForUrl =
        opts?.peerIdForUrl
        ?? ((url: string) => {
            try {
                return peerIdFromLanHost(new URL(url).hostname);
            } catch {
                return null;
            }
        });

    const peer: string[] = [];
    const gwLan: string[] = [];
    const gwWan: string[] = [];
    const other: string[] = [];

    for (const url of urls) {
        if (!url) continue;
        const cls = classifyBlobFetchUrl(url, opts);
        if (cls === "lan-direct") {
            const toId = peerIdForUrl(url);
            // WHY: Neu desk blobs live on :29110; Cap Control probes are :8434.
            // Do not drop desk P2P URLs when mesh only knows Cap-port reachability.
            let deskBlobPort = false;
            try {
                deskBlobPort = new URL(url).port === "29110";
            } catch {
                /* */
            }
            if (!deskBlobPort && toId && cache.isLanDirectKnownDown(toId)) {
                continue; // skip known-dead Cap Control P2P
            }
            peer.push(url);
            continue;
        }
        if (cls === "lan-gateway") {
            gwLan.push(url);
            continue;
        }
        if (cls === "wan-gateway") {
            gwWan.push(url);
            continue;
        }
        other.push(url);
    }

    return [...peer, ...gwLan, ...gwWan, ...other];
}

/** @deprecated alias — plan name; prefer filterCandidatesByCapability. */
export const orderCandidatesByCapability = filterCandidatesByCapability;

/** Default fleet peer ids for home mesh probing. */
export const FLEET_PATH_PEER_IDS = ["L-110", "L-196", "L-208", "L-210"] as const;

/** Cap Control default; Neu desk primary Control is often 29110 with 8434 alias. */
export const PEER_CONTROL_WS_PORT_CAP = 8434;
export const PEER_CONTROL_WS_PORT_DESK = 29110;

function isDeskPeerId(peerId: string): boolean {
    const id = String(peerId || "").trim();
    if (!id) return false;
    if (/^L-110$/i.test(id)) return true;
    if (/^L-192\.168\.0\.110$/i.test(id)) return true;
    return false;
}

/**
 * Ordered cleartext Control `/ws` dial URLs for LAN peer autonomy (hub fallback).
 * WHY: Cap hosts Control on :8434; Neu desk uses :29110 (and sometimes :8434 alias).
 * Returns empty when peer id cannot map to a LAN host.
 */
export function peerControlWsCandidates(
    toId: string,
    opts?: { lanHost?: string | null; includeDeskAlias?: boolean },
): string[] {
    const host =
        (opts?.lanHost && String(opts.lanHost).trim())
        || lanHostFromPeerId(toId);
    if (!host) return [];
    const out: string[] = [];
    const push = (port: number) => {
        const url = `ws://${host}:${port}/ws`;
        if (!out.includes(url)) out.push(url);
    };
    if (isDeskPeerId(toId) || host === "192.168.0.110") {
        // Desk: try Cap-compat :8434 first (alias), then Neu primary :29110.
        push(PEER_CONTROL_WS_PORT_CAP);
        if (opts?.includeDeskAlias !== false) push(PEER_CONTROL_WS_PORT_DESK);
    } else {
        push(PEER_CONTROL_WS_PORT_CAP);
    }
    return out;
}

/**
 * Fresh lan-direct peers that are known-up (for peer `/ws` dial when hub is down).
 */
export function listLanDirectUpPeerIds(cache: PathCapabilityCache): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of cache.listFresh()) {
        if (p.class !== "lan-direct" || !p.ok) continue;
        const id = String(p.toId || "").trim();
        if (!id || seen.has(id.toLowerCase())) continue;
        seen.add(id.toLowerCase());
        out.push(id);
    }
    return out;
}

/** Collapse L-110 ↔ L-192.168.0.110 for identity checks. */
export function peerIdsEqual(a: string, b: string): boolean {
    const na = normalizePeerIdKey(a);
    const nb = normalizePeerIdKey(b);
    if (!na || !nb) return false;
    return na === nb;
}

export function normalizePeerIdKey(id: string): string {
    const s = String(id || "").trim().toLowerCase();
    if (!s) return "";
    const bare = s.replace(/^l-/, "");
    if (/^192\.168\.0\.(\d+)$/.test(bare)) {
        const last = bare.split(".").pop() || bare;
        return `l-${last}`;
    }
    return `l-${bare}`;
}

function parsePeerEndpoints(raw: unknown, defaultToId?: string): PeerEndpoint[] {
    if (!Array.isArray(raw)) return [];
    const out: PeerEndpoint[] = [];
    for (const item of raw) {
        if (!item || typeof item !== "object") continue;
        const p = item as Record<string, unknown>;
        const toId = String(p.toId || defaultToId || "").trim();
        const cls = String(p.class || "").trim();
        const origin = String(p.origin || "").trim().replace(/\/+$/, "");
        if (!toId || !origin) continue;
        if (cls !== "lan-direct" && cls !== "wan-direct") continue;
        const ep: PeerEndpoint = { toId, class: cls, origin };
        if (typeof p.verified === "boolean") ep.verified = p.verified;
        const src = String(p.source || "").trim() as PeerEndpointSource;
        if (src === "probe" || src === "self" || src === "hub" || src === "cache") {
            ep.source = src;
        }
        if (p.ts != null && Number.isFinite(Number(p.ts))) ep.ts = Number(p.ts);
        if (p.lastVerifiedAt != null && Number.isFinite(Number(p.lastVerifiedAt))) {
            ep.lastVerifiedAt = Number(p.lastVerifiedAt);
        }
        out.push(ep);
    }
    return out;
}

/** Trust rank — higher wins on merge when ts is equal. */
export function peerEndpointTrustRank(source?: PeerEndpointSource, verified?: boolean): number {
    // WHY: probe-verified identity beats self-announce; hub registry is advisory.
    if (verified && (source === "probe" || !source)) return 40;
    if (source === "probe") return 35;
    if (source === "self") return verified ? 30 : 25;
    if (source === "hub") return 15;
    if (source === "cache") return 10;
    return verified ? 20 : 5;
}

function endpointKey(ep: PeerEndpoint): string {
    return `${normalizePeerIdKey(ep.toId)}|${ep.class}|${String(ep.origin || "").toLowerCase()}`;
}

/**
 * Merge peer Control endpoint maps.
 * INVARIANT: newer ts wins; on equal ts higher trust wins (probe > self > hub > cache).
 */
export function mergePeerEndpointMaps(
    existing: readonly PeerEndpoint[],
    incoming: readonly PeerEndpoint[],
): PeerEndpoint[] {
    const map = new Map<string, PeerEndpoint>();
    const put = (ep: PeerEndpoint) => {
        const toId = String(ep?.toId || "").trim();
        const origin = String(ep?.origin || "").trim().replace(/\/+$/, "");
        if (!toId || !origin) return;
        if (ep.class !== "lan-direct" && ep.class !== "wan-direct") return;
        const next: PeerEndpoint = { ...ep, toId, origin };
        const key = endpointKey(next);
        const prev = map.get(key);
        if (!prev) {
            map.set(key, next);
            return;
        }
        const pts = Number(prev.ts || 0);
        const nts = Number(next.ts || 0);
        if (nts > pts) {
            map.set(key, next);
            return;
        }
        if (nts < pts) return;
        const pr = peerEndpointTrustRank(prev.source, prev.verified);
        const nr = peerEndpointTrustRank(next.source, next.verified);
        if (nr >= pr) map.set(key, next);
    };
    for (const ep of existing || []) put(ep);
    for (const ep of incoming || []) put(ep);
    return [...map.values()];
}

/** Convert cache probe hits into PeerEndpoint list (ok + origin only). */
export function peerEndpointsFromCache(cache: PathCapabilityCache, toId?: string): PeerEndpoint[] {
    const out: PeerEndpoint[] = [];
    for (const p of cache.listFresh()) {
        if (p.class !== "lan-direct" && p.class !== "wan-direct") continue;
        if (!p.ok || !p.origin) continue;
        if (toId && !peerIdsEqual(p.toId, toId)) continue;
        out.push({
            toId: p.toId,
            class: p.class,
            origin: p.origin.replace(/\/+$/, ""),
            verified: p.verified === true,
            source: p.source || (p.verified ? "probe" : "cache"),
            ts: p.ts,
            lastVerifiedAt: p.verified ? p.ts : undefined,
        });
    }
    return out;
}

export interface OrderedDialCandidate {
    class: "lan-direct" | "wan-direct";
    /** Cleartext Control `/ws` URL. */
    wsUrl: string;
    /** HTTP(S) Control origin (no trailing slash). */
    origin: string;
    verified: boolean;
    source?: PeerEndpointSource;
}

function originToWsUrl(origin: string): string | null {
    try {
        const u = new URL(origin.includes("://") ? origin : `http://${origin}`);
        const proto = u.protocol === "https:" ? "wss:" : "ws:";
        const port = u.port || (u.protocol === "https:" ? "443" : "80");
        return `${proto}//${u.hostname}:${port}/ws`;
    } catch {
        return null;
    }
}

/**
 * Ordered peer Control `/ws` dials: verified lan-direct → verified wan-direct
 * → unverified lan → unverified wan. Hub is not included (use hubFailoverCandidates).
 */
export function orderedDialCandidates(
    toId: string,
    endpoints: readonly PeerEndpoint[],
    opts?: { includeUnverified?: boolean },
): OrderedDialCandidate[] {
    const includeUnverified = opts?.includeUnverified !== false;
    const matched = (endpoints || []).filter((ep) => peerIdsEqual(ep.toId, toId));
    const rank = (ep: PeerEndpoint): number => {
        const classRank = ep.class === "lan-direct" ? 200 : 100;
        const verRank = ep.verified ? 50 : 0;
        return classRank + verRank + peerEndpointTrustRank(ep.source, ep.verified);
    };
    const sorted = [...matched].sort((a, b) => rank(b) - rank(a));
    const out: OrderedDialCandidate[] = [];
    const seen = new Set<string>();
    for (const ep of sorted) {
        if (!ep.verified && !includeUnverified) continue;
        // Prefer verified first — skip unverified until verified of same class exhausted
        // (already sorted).
        const wsUrl = originToWsUrl(ep.origin);
        if (!wsUrl) continue;
        const key = wsUrl.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
            class: ep.class,
            wsUrl,
            origin: ep.origin.replace(/\/+$/, ""),
            verified: ep.verified === true,
            source: ep.source,
        });
    }
    // WHY: cold cache — fall back to fleet LAN host mapping.
    if (!out.length) {
        for (const ws of peerControlWsCandidates(toId)) {
            const key = ws.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            let origin = ws.replace(/^ws:/i, "http:").replace(/\/ws$/i, "");
            out.push({
                class: "lan-direct",
                wsUrl: ws,
                origin,
                verified: false,
                source: "cache",
            });
        }
    }
    return out;
}

/**
 * Ordered hub/relay WSS candidates (1A failover — one active at a time).
 * Accepts raw HTTPS/WSS/HTTP origins or comma/semicolon-separated lists.
 */
export function hubFailoverCandidates(
    raw: readonly string[],
    opts?: { defaultHub?: string; preferPublic?: boolean },
): string[] {
    const flat: string[] = [];
    for (const entry of raw || []) {
        if (!entry) continue;
        for (const part of String(entry).split(/[,;\s]+/)) {
            const t = part.trim();
            if (t) flat.push(t);
        }
    }
    if (!flat.length && opts?.defaultHub) flat.push(opts.defaultHub);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const entry of flat) {
        const ws = normalizeHubWsUrl(entry);
        if (!ws) continue;
        const key = ws.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(ws);
    }
    return opts?.preferPublic ? orderHubCandidatesPreferPublic(out) : out;
}

/** True for RFC1918 / localhost hosts (LAN hubs unreachable from LTE/WAN). */
export function isPrivateLanHost(host: string | null | undefined): boolean {
    const h = String(host || "").trim().toLowerCase();
    if (!h) return false;
    if (h === "localhost" || h.endsWith(".local")) return true;
    if (h.startsWith("10.")) return true;
    if (h.startsWith("192.168.")) return true;
    if (h.startsWith("172.")) {
        const second = Number(h.split(".")[1]);
        return Number.isFinite(second) && second >= 16 && second <= 31;
    }
    return false;
}

export function isPrivateHubUrl(url: string | null | undefined): boolean {
    const ws = normalizeHubWsUrl(String(url || ""));
    if (!ws) return false;
    try {
        return isPrivateLanHost(new URL(ws).hostname);
    } catch {
        return false;
    }
}

/**
 * Prefer public/WAN hubs ahead of RFC1918 when the client is off-LAN (LTE).
 * Private hubs remain as last-resort when Wi‑Fi returns mid-session.
 */
export function orderHubCandidatesPreferPublic(candidates: readonly string[]): string[] {
    const pub: string[] = [];
    const priv: string[] = [];
    for (const c of candidates || []) {
        if (isPrivateHubUrl(c)) priv.push(c);
        else pub.push(c);
    }
    if (!pub.length) return [...candidates];
    return [...pub, ...priv];
}

/**
 * Next hub index after failure. When preferPublic, never land on RFC1918 if a
 * public candidate exists — stick to the failed public index instead.
 */
export function nextHubCandidateIndex(
    candidates: readonly string[],
    failedIndex: number,
    opts?: { preferPublic?: boolean },
): number {
    const n = candidates?.length || 0;
    if (!n) return -1;
    const failed = Math.max(0, Math.min(failedIndex, n - 1));
    if (opts?.preferPublic && !isPrivateHubUrl(candidates[failed])) {
        return failed;
    }
    for (let i = 1; i <= n; i++) {
        const idx = (failed + i) % n;
        if (!opts?.preferPublic || !isPrivateHubUrl(candidates[idx])) {
            return idx;
        }
    }
    return failed;
}

export function normalizeHubWsUrl(entry: string): string | null {
    const t = String(entry || "").trim();
    if (!t) return null;
    try {
        let s = t;
        if (s.startsWith("https://")) s = "wss://" + s.slice("https://".length);
        else if (s.startsWith("http://")) s = "ws://" + s.slice("http://".length);
        else if (!/^wss?:\/\//i.test(s)) s = `wss://${s}`;
        const u = new URL(s);
        if (!u.pathname || u.pathname === "/") u.pathname = "/ws";
        else if (!u.pathname.endsWith("/ws")) {
            u.pathname = u.pathname.replace(/\/+$/, "") + "/ws";
        }
        return u.toString().replace(/\/$/, "");
    } catch {
        return null;
    }
}

export interface PeerRegistryPeer {
    id: string;
    origins: Array<{ class: "lan-direct" | "wan-direct" | "lan-gateway" | "wan-gateway"; origin: string }>;
    viaHub?: boolean;
    ts?: number;
}

export interface PeerRegistryPayload {
    peers: PeerRegistryPeer[];
    ts: number;
    viaHub?: boolean;
}

export function parsePeerRegistryPayload(raw: unknown): PeerRegistryPayload | null {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    const peersRaw = Array.isArray(o.peers) ? o.peers : [];
    const peers: PeerRegistryPeer[] = [];
    for (const item of peersRaw) {
        if (!item || typeof item !== "object") continue;
        const p = item as Record<string, unknown>;
        const id = String(p.id || p.peerId || p.clientId || "").trim();
        if (!id) continue;
        const origins: PeerRegistryPeer["origins"] = [];
        const oRaw = Array.isArray(p.origins) ? p.origins : [];
        for (const og of oRaw) {
            if (!og || typeof og !== "object") continue;
            const g = og as Record<string, unknown>;
            const cls = String(g.class || "lan-direct").trim();
            const origin = String(g.origin || "").trim().replace(/\/+$/, "");
            if (!origin) continue;
            if (
                cls !== "lan-direct"
                && cls !== "wan-direct"
                && cls !== "lan-gateway"
                && cls !== "wan-gateway"
            ) {
                continue;
            }
            origins.push({ class: cls, origin });
        }
        peers.push({
            id,
            origins,
            viaHub: p.viaHub !== false,
            ts: p.ts != null && Number.isFinite(Number(p.ts)) ? Number(p.ts) : undefined,
        });
    }
    return {
        peers,
        ts: Number(o.ts) || Date.now(),
        viaHub: o.viaHub !== false,
    };
}

/** Convert hub registry peers into PeerEndpoint entries (trust: hub). */
export function peerEndpointsFromRegistry(payload: PeerRegistryPayload): PeerEndpoint[] {
    const out: PeerEndpoint[] = [];
    const baseTs = Number(payload.ts) || Date.now();
    for (const peer of payload.peers || []) {
        const id = String(peer.id || "").trim();
        if (!id) continue;
        for (const og of peer.origins || []) {
            if (og.class !== "lan-direct" && og.class !== "wan-direct") continue;
            out.push({
                toId: id,
                class: og.class,
                origin: og.origin.replace(/\/+$/, ""),
                verified: false,
                source: "hub",
                ts: peer.ts || baseTs,
            });
        }
    }
    return out;
}

export function buildPeerRegistryAskPacket(input: {
    sender: string;
    uuid: string;
    timestamp: number;
    peerIds?: string[];
    destinations?: string[];
}): CwspPacket {
    return createCwspPacket({
        op: "ask",
        what: NETWORK_WHAT_PEER_REGISTRY,
        purpose: "general",
        sender: input.sender,
        uuid: input.uuid,
        timestamp: input.timestamp,
        destinations: input.destinations?.length ? input.destinations : ["*"],
        payload: {
            peerIds: input.peerIds?.length ? input.peerIds : ["*"],
        },
        flags: { canonicalV2: true },
    });
}

export function buildPeerRegistryResultPacket(input: {
    sender: string;
    uuid: string;
    timestamp: number;
    destinations: string[];
    peers: PeerRegistryPeer[];
}): CwspPacket {
    return createCwspPacket({
        op: "result",
        what: NETWORK_WHAT_PEER_REGISTRY,
        purpose: "general",
        sender: input.sender,
        uuid: input.uuid,
        timestamp: input.timestamp,
        destinations: input.destinations,
        payload: {
            peers: input.peers,
            ts: input.timestamp,
            viaHub: true,
        },
        flags: { canonicalV2: true },
    });
}
