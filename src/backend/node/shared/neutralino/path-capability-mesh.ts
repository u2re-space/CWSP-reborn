/*
 * Filename: path-capability-mesh.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/path-capability-mesh.ts
 * Change date and time: 17.20.00_23.07.2026
 * Reason for changes: Continuous P2P Path Capability Mesh — Neu/Node runner.
 *   Probes lan-direct (Control pair/hello), lan-gateway + wan-gateway (/lna-probe)
 *   on WS connect / reload / interval; announces network:pathCapability; feeds
 *   Accept candidate filter via shared cache.
 *   2026-07-23: Persist compact peer Control endpoints and advertise local
 *   LAN/WAN origins so peer dial can survive a hub switch or reconnect.
 */

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import type { IncomingMessage } from "node:http";

import {
    FLEET_PATH_PEER_IDS,
    NETWORK_WHAT_PATH_CAPABILITY,
    NETWORK_WHAT_PEER_REGISTRY,
    PATH_CAPABILITY_DEFAULT_TTL_MS,
    buildPathCapabilityPacket,
    createPathCapabilityCache,
    lanHostFromPeerId,
    listLanDirectUpPeerIds,
    mergePeerEndpointMaps,
    parsePathCapabilityPayload,
    parsePeerRegistryPayload,
    peerEndpointsFromCache,
    peerEndpointsFromRegistry,
    peerIdsEqual,
    type PathCapabilityCache,
    type PeerEndpoint,
    type PathProbeResult,
    type RouteClass,
} from "@fest-lib/cwsp-shared/v2/index.ts";

const FLEET_LAN_GW = "192.168.0.200";
const FLEET_WAN_GW_FALLBACK = "45.147.121.152";

let sharedCache: PathCapabilityCache | null = null;
let peerEndpointStore: PeerEndpoint[] = [];
const loadedPeerEndpointStores = new Set<string>();

export function getPathCapabilityCache(): PathCapabilityCache {
    if (!sharedCache) sharedCache = createPathCapabilityCache(PATH_CAPABILITY_DEFAULT_TTL_MS);
    return sharedCache;
}

/**
 * Compact Control endpoint map shared by hub registry, mesh probes, and peer dial.
 * Return copies so callers cannot silently change the module-level source of truth.
 */
export function getPeerEndpointStore(): PeerEndpoint[] {
    return peerEndpointStore.map((endpoint) => ({ ...endpoint }));
}

function peerEndpointStoreFile(packageRoot?: string): string | null {
    const root = String(packageRoot || "").trim();
    return root ? path.join(root, ".data", "peer-endpoints.json") : null;
}

function loadPeerEndpointStore(packageRoot?: string): void {
    const filePath = peerEndpointStoreFile(packageRoot);
    if (!filePath || loadedPeerEndpointStores.has(filePath)) return;
    loadedPeerEndpointStores.add(filePath);
    try {
        if (!fs.existsSync(filePath)) return;
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
        const record = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
        const endpoints = Array.isArray(record.endpoints) ? record.endpoints : Array.isArray(parsed) ? parsed : [];
        peerEndpointStore = mergePeerEndpointMaps(peerEndpointStore, endpoints as PeerEndpoint[]);
    } catch {
        // COMPAT: a corrupt cache must never prevent the Control mesh from starting.
    }
}

function persistPeerEndpointStore(packageRoot?: string): void {
    const filePath = peerEndpointStoreFile(packageRoot);
    if (!filePath) return;
    try {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(
            filePath,
            JSON.stringify({ version: 1, updatedAt: Date.now(), endpoints: peerEndpointStore }),
            "utf8",
        );
    } catch {
        // Best effort only: a read-only portable package still retains its in-memory map.
    }
}

/** Merge trusted probe/self/hub endpoint discoveries and persist the compact map. */
export function mergePeerEndpointStore(
    incoming: readonly PeerEndpoint[],
    packageRoot?: string,
): PeerEndpoint[] {
    peerEndpointStore = mergePeerEndpointMaps(peerEndpointStore, incoming);
    persistPeerEndpointStore(packageRoot);
    return getPeerEndpointStore();
}

/** Peer ids with fresh lan-direct ok (for peer Control `/ws` dial when hub down). */
export function listLanDirectUpPeers(): string[] {
    return listLanDirectUpPeerIds(getPathCapabilityCache());
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
    /** Portable package root; enables .data/peer-endpoints.json durability. */
    packageRoot?: string;
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

function advertisedSelfEndpoints(
    localId: string,
    lanHost: string | undefined,
    controlPort: number,
    timestamp: number,
): PeerEndpoint[] {
    const endpoints: PeerEndpoint[] = [];
    const localHost = String(lanHost || "").trim();
    if (localHost) {
        const origin = /^https?:\/\//i.test(localHost)
            ? trimOrigin(localHost)
            : `http://${localHost}:${controlPort}`;
        endpoints.push({
            toId: localId,
            class: "lan-direct",
            origin,
            verified: false,
            source: "self",
            ts: timestamp,
        });
    }

    // CWSP_PUBLIC_CONTROL_URL is intentionally an explicit public direct route,
    // not the active hub URL. A hub remains a separate routing concern.
    for (const raw of String(process.env.CWSP_PUBLIC_CONTROL_URL || "").split(/[,;\s]+/)) {
        const value = raw.trim();
        if (!value) continue;
        try {
            const normalized = value
                .replace(/^wss:/i, "https:")
                .replace(/^ws:/i, "http:");
            const url = new URL(normalized.includes("://") ? normalized : `https://${normalized}`);
            if (!url.port) url.port = "8434";
            endpoints.push({
                toId: localId,
                class: "wan-direct",
                origin: url.origin,
                verified: false,
                source: "self",
                ts: timestamp,
            });
        } catch {
            // Ignore malformed optional public-control configuration.
        }
    }
    return mergePeerEndpointMaps([], endpoints);
}

function probeHttp(
    urlStr: string,
    method: "HEAD" | "GET",
    timeoutMs: number,
    opts?: { readBody?: boolean },
): Promise<{ ok: boolean; rttMs: number; error?: string; body?: string; status?: number }> {
    const started = Date.now();
    return new Promise((resolve) => {
        let settled = false;
        const done = (ok: boolean, error?: string, body?: string, status?: number) => {
            if (settled) return;
            settled = true;
            resolve({ ok, rttMs: Date.now() - started, error, body, status });
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
                    headers: { Accept: "application/json,*/*" },
                    timeout: timeoutMs,
                },
                (res: IncomingMessage) => {
                    const code = res.statusCode || 0;
                    if (!opts?.readBody) {
                        res.resume();
                        done(code >= 200 && code < 300, code < 200 || code >= 300 ? `http-${code}` : undefined, undefined, code);
                        return;
                    }
                    const chunks: Buffer[] = [];
                    res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
                    res.on("end", () => {
                        const body = Buffer.concat(chunks).toString("utf8");
                        done(code >= 200 && code < 300, code < 200 || code >= 300 ? `http-${code}` : undefined, body, code);
                    });
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

/**
 * Identity-verified lan-direct: GET pair/hello?expectId=… must return matching clientId.
 * WHY: HTTP 200 alone is not enough — wrong host / captive portal must not mark peer up.
 */
async function probeLanDirectIdentity(toId: string, origin: string): Promise<PathProbeResult> {
    const path = `/service/pair/hello?expectId=${encodeURIComponent(toId)}`;
    const url = `${trimOrigin(origin)}${path}`;
    const r = await probeHttp(url, "GET", 1_500, { readBody: true });
    const base: PathProbeResult = {
        toId,
        class: "lan-direct",
        ok: false,
        rttMs: r.rttMs,
        origin: trimOrigin(origin),
        ts: Date.now(),
        source: "probe",
    };
    if (r.status === 409) {
        base.error = "expectId-mismatch";
        return base;
    }
    if (!r.ok) {
        base.error = r.error || "unreachable";
        return base;
    }
    let returnedId = "";
    try {
        const json = JSON.parse(String(r.body || "{}")) as Record<string, unknown>;
        returnedId = String(json.clientId || json.peerId || "").trim();
        const control = json.control && typeof json.control === "object"
            ? (json.control as Record<string, unknown>)
            : null;
        if (!returnedId && control) {
            returnedId = String(control.clientId || control.peerId || "").trim();
        }
    } catch {
        base.error = "hello-parse";
        return base;
    }
    if (!returnedId || !peerIdsEqual(returnedId, toId)) {
        base.error = "identity-mismatch";
        return base;
    }
    base.ok = true;
    base.verified = true;
    return base;
}

/** Cap Control :8434; Neu desk Control/blobs :29110. Prefer identity-verified hello. */
async function probeLanDirectMultiPort(toId: string, host: string): Promise<PathProbeResult> {
    const isDesk =
        host === "192.168.0.110" ||
        toId === "L-110" ||
        /^L-192\.168\.0\.110$/i.test(toId);
    const ports = isDesk ? [8434, 29110] : [8434];
    let bestFail: PathProbeResult | null = null;
    for (const port of ports) {
        const origin = `http://${host}:${port}`;
        const hello = await probeLanDirectIdentity(toId, origin);
        if (hello.ok && hello.verified) return hello;
        bestFail = hello;
        // Reachability-only fallback — never mark verified (dial must not trust alone).
        const lna = await probeOne(toId, "lan-direct", origin, "/lna-probe", "GET", 1_500);
        if (lna.ok) {
            lna.verified = false;
            lna.source = "probe";
            // Prefer identity fail over unverified reachability for dial maps;
            // still cache reachability so Accept can hedge.
            return lna;
        }
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
    loadPeerEndpointStore(options.packageRoot);
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
            const timestamp = Date.now();
            const localEndpoints = advertisedSelfEndpoints(
                localId,
                lanHost,
                options.controlPort ?? 8434,
                timestamp,
            );
            // Probe-derived identity verification outranks self/hub announcements.
            mergePeerEndpointStore(
                [...peerEndpointsFromCache(cache), ...localEndpoints],
                options.packageRoot,
            );
            const snap = {
                fromId: localId,
                lanHost: lanHost || undefined,
                controlPort: options.controlPort ?? 8434,
                ts: timestamp,
                ttlMs: PATH_CAPABILITY_DEFAULT_TTL_MS,
                paths: cache.listFresh(),
                endpoints: localEndpoints,
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

            // WHY: probe/cache always; announce only when send path is available
            // (hub or peer Control `/ws`). Never skip probes because hub is down.
            const packet = buildPathCapabilityPacket({
                snapshot: snap,
                sender: localId,
                destinations: ["*"],
                uuid: randomUUID(),
                timestamp: Date.now(),
                op: "act",
            });
            try {
                const sent = await options.sendPacket(packet as unknown as Record<string, unknown>);
                if (sent === false) {
                    console.info(
                        JSON.stringify({
                            channel: "cwsp-path-capability",
                            event: "announce-deferred",
                            reason,
                            localId,
                            note: "no hub/peer socket; cache still updated",
                        }),
                    );
                }
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
        const carrier =
            packet.payload && typeof packet.payload === "object"
                ? packet.payload
                : packet.result && typeof packet.result === "object"
                  ? packet.result
                  : packet.data;
        if (what === NETWORK_WHAT_PEER_REGISTRY) {
            const registry = parsePeerRegistryPayload(carrier);
            if (!registry) return;
            const merged = mergePeerEndpointStore(
                peerEndpointsFromRegistry(registry),
                options.packageRoot,
            );
            console.info(
                JSON.stringify({
                    channel: "cwsp-path-capability",
                    event: "peer-registry-merged",
                    peers: registry.peers.length,
                    endpointCount: merged.length,
                    viaHub: registry.viaHub === true,
                }),
            );
            return;
        }
        if (what !== NETWORK_WHAT_PATH_CAPABILITY) return;
        const parsed = parsePathCapabilityPayload(carrier);
        if (!parsed) return;
        // WHY: store remote view for UI; Accept uses local probes primarily.
        cache.mergeSnapshot(parsed);
        if (parsed.endpoints?.length) {
            mergePeerEndpointStore(parsed.endpoints, options.packageRoot);
        }
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
            const timestamp = Date.now();
            const localEndpoints = advertisedSelfEndpoints(
                localId,
                lanHostFromPeerId(localId) || undefined,
                options.controlPort ?? 8434,
                timestamp,
            );
            const snap = cache.snapshot(localId, {
                controlPort: options.controlPort ?? 8434,
                ttlMs: PATH_CAPABILITY_DEFAULT_TTL_MS,
            });
            snap.endpoints = localEndpoints;
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
