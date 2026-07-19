/*
 * Filename: control-discovery.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/control-discovery.ts
 * Change date and time: 23.10.00_19.07.2026
 * Reason for changes: Separate Neutralino L-110 (:29110) from Capacitor L-210 (:8434).
 *   Phone 401 must not block desk Neutralino; never poison __NEUTRALINO_AUTH__.
 */

import {
    looksLikeAndroidControlTarget,
    normalizeBridgeAuth,
    probeBridge,
    type BridgeProbeResult,
    type ConnectionSource
} from "./connection-source";

export const ANDROID_CONTROL_PORT = 8434;
export const NEUTRALINO_CONTROL_PORT = 29110;
export const LAST_ANDROID_HOST_KEY = "cwsp-control-android-host-v1";

/** On-device Capacitor Control API (same phone as the browser / WebView). */
export const LOOPBACK_ANDROID_HOSTS = ["127.0.0.1", "localhost"] as const;

/** Home-fleet phone LAN literals (Allow Control API → 0.0.0.0:8434). */
export const FLEET_ANDROID_HOSTS = [
    "192.168.0.196",
    "192.168.0.208",
    "192.168.0.210"
] as const;

export type ControlDiscoveryResult = {
    source: ConnectionSource;
    live: boolean;
    via: "android" | "neutralino" | "saved" | "none";
    /** Host answered 401 — Control API up, token wrong/missing (non-fatal for Neutralino). */
    unauthorizedHost?: string;
};

const uniqHosts = (hosts: string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const h of hosts) {
        const t = String(h || "").trim();
        if (!t || seen.has(t)) continue;
        seen.add(t);
        out.push(t);
    }
    return out;
};

const readQueryOverrides = (): Partial<ConnectionSource> => {
    try {
        const q = new URLSearchParams(location.search);
        const host = String(q.get("controlHost") || q.get("cwsp_control_host") || "").trim();
        const portRaw = String(q.get("controlPort") || q.get("cwsp_control_port") || "").trim();
        const key = String(q.get("controlKey") || q.get("cwsp_control_key") || "").trim();
        const out: Partial<ConnectionSource> = {};
        if (host) out.host = host;
        if (portRaw) {
            const port = Number(portRaw);
            if (Number.isFinite(port) && port > 0) out.port = port;
        }
        if (key) {
            out.apiKey = key;
            out.userKey = key;
        }
        return out;
    } catch {
        return {};
    }
};

const readLastAndroidHost = (): string => {
    try {
        return String(localStorage.getItem(LAST_ANDROID_HOST_KEY) || "").trim();
    } catch {
        return "";
    }
};

export const rememberAndroidControlHost = (host: string): void => {
    const t = String(host || "").trim();
    if (!t) return;
    try {
        localStorage.setItem(LAST_ANDROID_HOST_KEY, t);
    } catch {
        /* ignore */
    }
};

export const requestLocalNetworkAccessPermission = async (): Promise<void> => {
    try {
        const perms = navigator.permissions;
        if (!perms || typeof perms.query !== "function") return;
        await perms.query({ name: "local-network-access" as PermissionName });
    } catch {
        /* unsupported */
    }
};

export const loadEcosystemTokenFromAppSettings = async (): Promise<string> => {
    try {
        const { loadSettings } = await import("com/config/Settings");
        const s = await loadSettings();
        const core = (s?.core || {}) as Record<string, unknown>;
        const socket = (core.socket || {}) as Record<string, unknown>;
        return String(
            core.ecosystemToken || core.userKey || socket.accessToken || ""
        ).trim();
    } catch {
        return "";
    }
};

const isPublicHttpsPage = (): boolean => {
    try {
        const host = String(location.hostname || "").toLowerCase();
        return (
            location.protocol === "https:" &&
            host !== "127.0.0.1" &&
            host !== "localhost" &&
            host !== "::1"
        );
    } catch {
        return false;
    }
};

const isLoopbackHostName = (host: string): boolean => {
    const h = String(host || "").trim().toLowerCase();
    return h === "127.0.0.1" || h === "localhost" || h === "::1";
};

/** Phone fleet ids — prefer Capacitor Control when operator targets these. */
const looksLikePhoneClientId = (id: string): boolean =>
    /^L-?(196|208|210|192\.168\.0\.(196|208|210))$/i.test(String(id || "").trim());

/** Desk Neutralino / CWSP client — prefer :29110. */
const looksLikeDeskClientId = (id: string): boolean =>
    /^L-?(110|192\.168\.0\.110)$/i.test(String(id || "").trim());

const androidCandidateHosts = (base: ConnectionSource, queryHost?: string): string[] => {
    const hosts: string[] = [];
    if (!isPublicHttpsPage()) {
        hosts.push(...LOOPBACK_ANDROID_HOSTS);
    }
    if (queryHost && !isLoopbackHostName(queryHost)) hosts.push(queryHost);
    if (looksLikeAndroidControlTarget(base) && !isLoopbackHostName(base.host)) {
        hosts.push(base.host);
    }
    const last = readLastAndroidHost();
    if (last && !(isPublicHttpsPage() && isLoopbackHostName(last))) hosts.push(last);
    hosts.push(...FLEET_ANDROID_HOSTS);
    return uniqHosts(hosts);
};

const isCapacitorProbe = (probe: BridgeProbeResult): boolean =>
    probe.kind === "capacitor" || probe.surface === "capacitor-android";

const probeNeutralino = async (seeded: ConnectionSource): Promise<ControlDiscoveryResult | null> => {
    const neutralino = normalizeBridgeAuth({
        ...seeded,
        mode: "bridge",
        scheme: "http",
        host: "127.0.0.1",
        port: NEUTRALINO_CONTROL_PORT,
        apiKey: "cwsp-neutralino-local"
    });
    const nProbe = await probeBridge(neutralino);
    if (nProbe.live) {
        return { source: neutralino, live: true, via: "neutralino" };
    }
    return null;
};

const probeAndroidFleet = async (
    seeded: ConnectionSource,
    token: string,
    queryHost?: string
): Promise<{ live?: ControlDiscoveryResult; unauthorizedHost?: string }> => {
    const androidHosts = androidCandidateHosts(seeded, queryHost);
    const androidProbes = await Promise.all(
        androidHosts.map(async (host) => {
            const candidate = normalizeBridgeAuth({
                ...seeded,
                mode: "bridge",
                scheme: "http",
                host,
                port: ANDROID_CONTROL_PORT,
                userKey: token || seeded.userKey,
                apiKey: token || seeded.apiKey
            });
            const probe = await probeBridge(candidate);
            return { candidate, probe, host };
        })
    );

    const androidLive = androidProbes.find((p) => p.probe.live && isCapacitorProbe(p.probe));
    if (androidLive) {
        rememberAndroidControlHost(androidLive.host);
        return {
            live: {
                source: androidLive.candidate,
                live: true,
                via: "android"
            }
        };
    }

    const androidUnauthorized = androidProbes.find(
        (p) => p.probe.unauthorized && isCapacitorProbe(p.probe)
    );
    if (androidUnauthorized) {
        rememberAndroidControlHost(androidUnauthorized.host);
        return { unauthorizedHost: androidUnauthorized.host };
    }
    return {};
};

/**
 * Discover Control SoT without destroying Neutralino L-110.
 *
 * Order:
 * 1. Explicit SRC Neutralino :29110 → desk first
 * 2. Client id L-110 → Neutralino first; L-210/196/208 → Capacitor first
 * 3. Else on public /cwsp: Neutralino then Capacitor (desk SoT wins when both up)
 * 4. Phone 401 is recorded but does NOT skip Neutralino
 */
export const discoverControlBridge = async (
    base: ConnectionSource
): Promise<ControlDiscoveryResult> => {
    const query = readQueryOverrides();
    const token =
        String(query.userKey || query.apiKey || base.userKey || base.apiKey || "").trim() ||
        (await loadEcosystemTokenFromAppSettings());

    const seeded: ConnectionSource = normalizeBridgeAuth({
        ...base,
        mode: "bridge",
        ...(query.host ? { host: query.host } : {}),
        ...(query.port ? { port: query.port } : {}),
        userKey: token || base.userKey,
        apiKey: token || base.apiKey
    });

    await requestLocalNetworkAccessPermission();

    const clientHint = String(seeded.userId || "").trim();
    const srcIsNeutralino =
        Number(seeded.port) === NEUTRALINO_CONTROL_PORT && isLoopbackHostName(seeded.host);
    const srcIsAndroid =
        looksLikeAndroidControlTarget(seeded) && !isLoopbackHostName(seeded.host);
    const preferPhone =
        srcIsAndroid || looksLikePhoneClientId(clientHint) || Boolean(query.host);
    const preferDesk =
        srcIsNeutralino || looksLikeDeskClientId(clientHint) || !preferPhone;

    let unauthorizedHost: string | undefined;

    const tryAndroid = async () => {
        const r = await probeAndroidFleet(seeded, token, query.host);
        if (r.unauthorizedHost) unauthorizedHost = r.unauthorizedHost;
        return r.live || null;
    };

    if (preferDesk && !preferPhone) {
        const n = await probeNeutralino(seeded);
        if (n) return n;
        const a = await tryAndroid();
        if (a) return a;
    } else if (preferPhone) {
        const a = await tryAndroid();
        if (a) return a;
        // WHY: phone 401/offline must not leave /cwsp without desk Neutralino SoT.
        const n = await probeNeutralino(seeded);
        if (n) return { ...n, unauthorizedHost };
    } else {
        // Balanced: desk Neutralino first (L-110), then Capacitor fleet.
        const n = await probeNeutralino(seeded);
        if (n) return n;
        const a = await tryAndroid();
        if (a) return a;
    }

    // Offline fallback — keep Neutralino default target (do not force phone LAN).
    return {
        source: normalizeBridgeAuth({
            ...seeded,
            mode: "bridge",
            scheme: "http",
            host: "127.0.0.1",
            port: NEUTRALINO_CONTROL_PORT,
            apiKey: "cwsp-neutralino-local"
        }),
        live: false,
        via: "none",
        unauthorizedHost
    };
};
