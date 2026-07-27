/*
 * Filename: route-probe.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/route-probe.ts
 * Change date and time: 14.40.00_21.07.2026
 * Reason for changes: Wave 2 Task 2 — produce an ordered list of candidate blob
 * URLs for a receiver to probe, plus a small TTL cache for per-pair route
 * classification. Probing order mirrors the network.mdc transport preference
 * (direct LAN peer first, then gateway LAN, then gateway WAN) so the receiver
 * picks the cheapest reachable path before falling back to tunneling.
 */

export type RouteClass = "lan-direct" | "lan-gateway" | "wan-gateway";

// Normalize `https://host:port/` -> `https://host:port` so concatenation with a
// leading-slash path never produces a double slash.
function trimTrailingSlash(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

// Ensure `path` starts with `/` so it joins cleanly onto any base origin.
function ensureLeadingSlash(path: string): string {
    return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Build the ordered list of candidate blob URLs for a receiver to probe.
 *
 * Order (per network.mdc route preference):
 *   1. each peer origin (LAN-direct) — closest/cheapest if reachable
 *   2. gateway LAN origin — reverse-proxy / tunnel entry on the local network
 *   3. gateway WAN origin — public IP, used when LAN is unreachable (NAT/LTE)
 *
 * `path` is the canonical blob path, e.g. `/files/blob/<transferId>/<batchId>`.
 * Query strings are intentionally not appended here; the caller mints the token
 * and appends `?token=...` after picking a reachable candidate.
 */
export function listBlobUrlCandidates(
    peerOrigins: readonly string[],
    gatewayLan: string,
    gatewayWan: string,
    path: string,
): string[] {
    const p = ensureLeadingSlash(path);
    const out: string[] = [];

    for (const origin of peerOrigins) {
        if (!origin) continue;
        out.push(`${trimTrailingSlash(origin)}${p}`);
    }
    if (gatewayLan) out.push(`${trimTrailingSlash(gatewayLan)}${p}`);
    if (gatewayWan) out.push(`${trimTrailingSlash(gatewayWan)}${p}`);

    return out;
}

export interface RouteProbeCacheEntry {
    route: RouteClass;
    expiresAt: number;
}

export interface RouteProbeCache {
    get(fromId: string, toId: string): RouteClass | undefined;
    set(fromId: string, toId: string, route: RouteClass): void;
    /** Remove a specific entry (e.g. on disconnect). */
    invalidate(fromId: string, toId: string): void;
    /** Remove all entries. */
    clear(): void;
}

/**
 * Small in-memory TTL cache for per-(from,to) route classification. Avoids
 * re-probing the same pair on every blob fetch; entries expire after `ttlMs` so
 * topology changes (peer joins/leaves, LAN/WAN flap) eventually re-probe.
 *
 * NOTE: no network I/O here — callers run the probe and call `set` with the
 * observed `RouteClass`. This keeps the cache pure and unit-testable.
 */
export function createRouteProbeCache(ttlMs = 30_000): RouteProbeCache {
    const store = new Map<string, RouteProbeCacheEntry>();

    const key = (fromId: string, toId: string) => `${fromId}::${toId}`;

    return {
        get(fromId, toId) {
            const entry = store.get(key(fromId, toId));
            if (!entry) return undefined;
            // Lazy expiry: a stale entry is treated as absent and evicted.
            if (entry.expiresAt <= Date.now()) {
                store.delete(key(fromId, toId));
                return undefined;
            }
            return entry.route;
        },
        set(fromId, toId, route) {
            store.set(key(fromId, toId), {
                route,
                expiresAt: Date.now() + ttlMs,
            });
        },
        invalidate(fromId, toId) {
            store.delete(key(fromId, toId));
        },
        clear() {
            store.clear();
        },
    };
}
