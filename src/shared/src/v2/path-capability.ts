/*
 * Filename: path-capability.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/path-capability.ts
 * Change date and time: 09.15.00_22.07.2026
 * Reason for changes: Continuous P2P Path Capability Mesh — shared types,
 *   TTL cache, packet builders, and Accept candidate filtering so Cap/Neu
 *   discover lan-direct / lan-gateway / wan-gateway *before* file transfer.
 *
 * INVARIANT: never reorder Accept to gateway-first when peer is unknown/ok;
 *   only drop known-down lan-direct URLs (fresh cache).
 */

import { createCwspPacket } from "./packet.ts";
import type { CwspPacket, CwspPacketInput } from "./types.ts";

/** Route class names aligned with endpoint files/route-probe.ts. */
export type RouteClass = "lan-direct" | "lan-gateway" | "wan-gateway";

/** Stable wire action for path mesh announce / ask / result. */
export const NETWORK_WHAT_PATH_CAPABILITY = "network:pathCapability";

export const PATH_CAPABILITY_DEFAULT_TTL_MS = 90_000;

export interface PathProbeResult {
    toId: string;
    class: RouteClass;
    ok: boolean;
    rttMs?: number;
    origin?: string;
    error?: string;
    /** Wall time when this probe was observed (ms). */
    ts?: number;
}

export interface PathCapabilitySnapshot {
    fromId: string;
    lanHost?: string;
    controlPort?: number;
    ts: number;
    ttlMs: number;
    paths: PathProbeResult[];
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
        if (cls !== "lan-direct" && cls !== "lan-gateway" && cls !== "wan-gateway") continue;
        const entry: PathProbeResult = {
            toId,
            class: cls,
            ok: Boolean(p.ok),
        };
        if (p.rttMs != null && Number.isFinite(Number(p.rttMs))) entry.rttMs = Number(p.rttMs);
        if (typeof p.origin === "string" && p.origin) entry.origin = p.origin;
        if (typeof p.error === "string" && p.error) entry.error = p.error;
        if (p.ts != null && Number.isFinite(Number(p.ts))) entry.ts = Number(p.ts);
        paths.push(entry);
    }
    return {
        fromId,
        lanHost: typeof o.lanHost === "string" ? o.lanHost : undefined,
        controlPort: o.controlPort != null ? Number(o.controlPort) || 8434 : 8434,
        ts: Number(o.ts) || Date.now(),
        ttlMs: Number(o.ttlMs) || PATH_CAPABILITY_DEFAULT_TTL_MS,
        paths,
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
    const packetInput: CwspPacketInput = {
        op: input.op ?? "act",
        what: NETWORK_WHAT_PATH_CAPABILITY,
        purpose: "general",
        sender: input.sender,
        uuid: input.uuid,
        timestamp: input.timestamp,
        destinations: input.destinations?.length ? input.destinations : ["*"],
        payload: {
            fromId: snap.fromId,
            lanHost: snap.lanHost ?? "",
            controlPort: snap.controlPort ?? 8434,
            ts: snap.ts,
            ttlMs: snap.ttlMs,
            paths: snap.paths,
        },
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
