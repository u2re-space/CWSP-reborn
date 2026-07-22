/*
 * Filename: path-capability-mesh.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/path-capability-mesh.ts
 * Change date and time: 09.20.00_22.07.2026
 * Reason for changes: Continuous P2P Path Capability Mesh — Neu/Node runner.
 *   Probes lan-direct (Control pair/hello), lan-gateway + wan-gateway (/lna-probe)
 *   on WS connect / reload / interval; announces network:pathCapability; feeds
 *   Accept candidate filter via shared cache.
 */

import { randomUUID } from "node:crypto";
import http from "node:http";
import https from "node:https";
import type { IncomingMessage } from "node:http";

import {
    FLEET_PATH_PEER_IDS,
    NETWORK_WHAT_PATH_CAPABILITY,
    PATH_CAPABILITY_DEFAULT_TTL_MS,
    buildPathCapabilityPacket,
    createPathCapabilityCache,
    lanHostFromPeerId,
    parsePathCapabilityPayload,
    type PathCapabilityCache,
    type PathProbeResult,
    type RouteClass,
} from "@fest-lib/cwsp-shared/v2/index.ts";

const FLEET_LAN_GW = "192.168.0.200";
const FLEET_WAN_GW_FALLBACK = "45.147.121.152";

let sharedCache: PathCapabilityCache | null = null;

export function getPathCapabilityCache(): PathCapabilityCache {
    if (!sharedCache) sharedCache = createPathCapabilityCache(PATH_CAPABILITY_DEFAULT_TTL_MS);
    return sharedCache;
}

export interface PathCapabilityMeshOptions {
    localId: string;
    /** Peer ids to probe (fleet + destinations). */
    getPeerIds: () => string[] | Promise<string[]>;
    /** Gateway HTTPS origins, e.g. https://192.168.0.200:8434 */
    getGatewayOrigins?: () => { lan?: string; wan?: string } | Promise<{ lan?: string; wan?: string }>;
    sendPacket: (packet: Record<string, unknown>) => boolean | void | Promise<boolean | void>;
    /** Local Control listen port (default 8434 / 29110 desk often uses 29110). */
    controlPort?: number;
    lanHost?: () => string | null | Promise<string | null>;
    intervalMs?: number;
}

export interface PathCapabilityMeshRuntime {
    refresh: (reason?: string) => Promise<void>;
    stop: () => void;
    handleInbound: (packet: Record<string, unknown>) => void;
    cache: PathCapabilityCache;
}

function trimOrigin(raw: string): string {
    return String(raw || "").trim().replace(/\/+$/, "");
}

function probeHttp(
    urlStr: string,
    method: "HEAD" | "GET",
    timeoutMs: number,
): Promise<{ ok: boolean; rttMs: number; error?: string }> {
    const started = Date.now();
    return new Promise((resolve) => {
        let settled = false;
        const done = (ok: boolean, error?: string) => {
            if (settled) return;
            settled = true;
            resolve({ ok, rttMs: Date.now() - started, error });
        };
        try {
            const u = new URL(urlStr);
            const isHttps = u.protocol === "https:";
            const reqFn = isHttps ? https.request : http.request;
            const req = reqFn(
                {
                    protocol: u.protocol,
                    hostname: u.hostname,
                    port: u.port || (isHttps ? 443 : 80),
                    path: u.pathname + u.search,
                    method,
                    rejectUnauthorized: false,
                    headers: { Accept: "*/*" },
                    timeout: timeoutMs,
                },
                (res: IncomingMessage) => {
                    const code = res.statusCode || 0;
                    res.resume();
                    done(code >= 200 && code < 300, code < 200 || code >= 300 ? `http-${code}` : undefined);
                },
            );
            req.on("error", (e) => done(false, e instanceof Error ? e.message : String(e)));
            req.on("timeout", () => {
                try {
                    req.destroy();
                } catch {
                    /* */
                }
                done(false, "timeout");
            });
            req.end();
        } catch (e) {
            done(false, e instanceof Error ? e.message : String(e));
        }
    });
}

async function probeOne(
    toId: string,
    routeClass: RouteClass,
    origin: string,
    path: string,
    method: "HEAD" | "GET",
    timeoutMs: number,
): Promise<PathProbeResult> {
    const url = `${trimOrigin(origin)}${path.startsWith("/") ? path : `/${path}`}`;
    const r = await probeHttp(url, method, timeoutMs);
    const out: PathProbeResult = {
        toId,
        class: routeClass,
        ok: r.ok,
        rttMs: r.rttMs,
        origin: trimOrigin(origin),
        ts: Date.now(),
    };
    if (!r.ok && r.error) out.error = r.error;
    return out;
}

/** Cap Control :8434; Neu desk Control/blobs :29110. ok if any oracle answers. */
async function probeLanDirectMultiPort(toId: string, host: string): Promise<PathProbeResult> {
    const isDesk =
        host === "192.168.0.110" ||
        toId === "L-110" ||
        /^L-192\.168\.0\.110$/i.test(toId);
    const ports = isDesk ? [8434, 29110] : [8434];
    let bestFail: PathProbeResult | null = null;
    for (const port of ports) {
        const origin = `http://${host}:${port}`;
        const hello = await probeOne(toId, "lan-direct", origin, "/service/pair/hello", "HEAD", 1_500);
        if (hello.ok) return hello;
        bestFail = hello;
        const lna = await probeOne(toId, "lan-direct", origin, "/lna-probe", "GET", 1_500);
        if (lna.ok) return lna;
        bestFail = lna;
    }
    return (
        bestFail || {
            toId,
            class: "lan-direct",
            ok: false,
            error: "unreachable",
            origin: `http://${host}:8434`,
            ts: Date.now(),
        }
    );
}

/**
 * Start background path probes + announce. Call `refresh` on hub connect.
 */
export function startPathCapabilityMesh(options: PathCapabilityMeshOptions): PathCapabilityMeshRuntime {
    const cache = getPathCapabilityCache();
    const intervalMs = Math.max(15_000, options.intervalMs ?? 45_000);
    let timer: ReturnType<typeof setInterval> | null = null;
    let stopped = false;
    let running = false;

    const refresh = async (reason = "manual"): Promise<void> => {
        if (stopped || running) return;
        running = true;
        try {
            const localId = String(options.localId || "").trim() || "L-unknown";
            const peerIds = new Set<string>();
            for (const id of FLEET_PATH_PEER_IDS) peerIds.add(id);
            const extra = await options.getPeerIds();
            for (const id of extra || []) {
                const t = String(id || "").trim();
                if (t && t !== "*" && !/^all$/i.test(t) && !/^broadcast$/i.test(t)) {
                    peerIds.add(t);
                }
            }
            peerIds.delete(localId);
            peerIds.delete(localId.replace(/^L-192\.168\.0\./i, "L-"));

            const gw = (await options.getGatewayOrigins?.()) || {};
            const lanGw = trimOrigin(gw.lan || `https://${FLEET_LAN_GW}:8434`);
            const wanGw = trimOrigin(gw.wan || `https://${FLEET_WAN_GW_FALLBACK}:8434`);

            const peerList = [...peerIds].slice(0, 12);
            const directTasks: Promise<PathProbeResult>[] = [];
            for (const toId of peerList) {
                const host = lanHostFromPeerId(toId);
                if (host) {
                    // WHY: Cap :8434 + Neu desk :29110 — either counts as lan-direct.
                    directTasks.push(probeLanDirectMultiPort(toId, host));
                }
            }
            // WHY: cheap oracles — one lna-probe per gateway, then fan-out to peer toIds
            // so announce shape matches Cap/UI (per-peer lan-gateway / wan-gateway).
            const [lanGwProbe, wanGwProbe, ...directResults] = await Promise.all([
                probeOne("L-200", "lan-gateway", lanGw, "/lna-probe", "GET", 3_000),
                probeOne("L-wan", "wan-gateway", wanGw, "/lna-probe", "GET", 5_000),
                ...directTasks,
            ]);

            const paths: PathProbeResult[] = [];
            for (const r of directResults) {
                paths.push(r);
                cache.set(r, PATH_CAPABILITY_DEFAULT_TTL_MS);
            }
            cache.set(lanGwProbe, PATH_CAPABILITY_DEFAULT_TTL_MS);
            cache.set(wanGwProbe, PATH_CAPABILITY_DEFAULT_TTL_MS);
            paths.push(lanGwProbe, wanGwProbe);
            for (const toId of peerList) {
                const lg: PathProbeResult = {
                    toId,
                    class: "lan-gateway",
                    ok: lanGwProbe.ok,
                    rttMs: lanGwProbe.rttMs,
                    origin: lanGwProbe.origin,
                    error: lanGwProbe.error,
                    ts: Date.now(),
                };
                const wg: PathProbeResult = {
                    toId,
                    class: "wan-gateway",
                    ok: wanGwProbe.ok,
                    rttMs: wanGwProbe.rttMs,
                    origin: wanGwProbe.origin,
                    error: wanGwProbe.error,
                    ts: Date.now(),
                };
                paths.push(lg, wg);
                cache.set(lg, PATH_CAPABILITY_DEFAULT_TTL_MS);
                cache.set(wg, PATH_CAPABILITY_DEFAULT_TTL_MS);
            }

            const lanHost =
                (options.lanHost ? await options.lanHost() : null)
                || lanHostFromPeerId(localId)
                || undefined;
            const snap = {
                fromId: localId,
                lanHost: lanHost || undefined,
                controlPort: options.controlPort ?? 8434,
                ts: Date.now(),
                ttlMs: PATH_CAPABILITY_DEFAULT_TTL_MS,
                paths: cache.listFresh(),
            };

            console.info(
                JSON.stringify({
                    channel: "cwsp-path-capability",
                    event: "probe-complete",
                    reason,
                    localId,
                    pathCount: paths.length,
                    lanDirectOk: paths.filter((p) => p.class === "lan-direct" && p.ok).map((p) => p.toId),
                    lanDirectDown: paths.filter((p) => p.class === "lan-direct" && !p.ok).map((p) => p.toId),
                }),
            );

            const packet = buildPathCapabilityPacket({
                snapshot: snap,
                sender: localId,
                destinations: ["*"],
                uuid: randomUUID(),
                timestamp: Date.now(),
                op: "act",
            });
            try {
                await options.sendPacket(packet as unknown as Record<string, unknown>);
            } catch (e) {
                console.warn(
                    JSON.stringify({
                        channel: "cwsp-path-capability",
                        event: "announce-failed",
                        error: e instanceof Error ? e.message : String(e),
                    }),
                );
            }
        } finally {
            running = false;
        }
    };

    const jitter = Math.floor((Math.random() * 20 - 10) * 1000);
    timer = setInterval(() => {
        void refresh("interval");
    }, intervalMs + jitter);

    const handleInbound = (packet: Record<string, unknown>): void => {
        const what = String(packet.what || packet.type || "").trim();
        if (what !== NETWORK_WHAT_PATH_CAPABILITY) return;
        const parsed = parsePathCapabilityPayload(packet.payload);
        if (!parsed) return;
        // WHY: store remote view for UI; Accept uses local probes primarily.
        cache.mergeSnapshot(parsed);
        console.info(
            JSON.stringify({
                channel: "cwsp-path-capability",
                event: "inbound-merged",
                fromId: parsed.fromId,
                pathCount: parsed.paths.length,
            }),
        );
        // ask → answer with our snapshot
        if (String(packet.op || "") === "ask") {
            const localId = String(options.localId || "").trim();
            const snap = cache.snapshot(localId, {
                controlPort: options.controlPort ?? 8434,
                ttlMs: PATH_CAPABILITY_DEFAULT_TTL_MS,
            });
            const reply = buildPathCapabilityPacket({
                snapshot: snap,
                sender: localId,
                destinations: [parsed.fromId],
                uuid: String(packet.uuid || randomUUID()),
                timestamp: Date.now(),
                op: "result",
            });
            void Promise.resolve(options.sendPacket(reply as unknown as Record<string, unknown>)).catch(() => {
                /* best-effort */
            });
        }
    };

    return {
        refresh,
        stop() {
            stopped = true;
            if (timer) clearInterval(timer);
            timer = null;
        },
        handleInbound,
        cache,
    };
}
