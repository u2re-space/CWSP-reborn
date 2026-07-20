/*
 * Filename: control-discovery.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/control-discovery.ts
 * Change date and time: 21.45.00_20.07.2026
 * Reason for changes: /cwsp (surface A) PNA→client Control :8434; WAN :8434/ is gateway (B).
 *   2026-07-20: Android discovery via pair/hello — no ecosystem token in query/SRC.
 *   2026-07-20: Neutralino also pair/hello + deviceCode for public SPA.
 *   2026-07-20: On-device Capacitor loopback first; desk browser prefers Neutralino :29110
 *     before LAN phones (LAN Cap stole desk publicToken+deviceCode pairing).
 */

import {
    looksLikeAndroidControlTarget,
    normalizeBridgeAuth,
    probeBridge,
    type BridgeProbeResult,
    type ConnectionSource
} from "./connection-source";
import {
    CLIENT_CONTROL_PORT,
    NEUTRALINO_CONTROL_SIDECAR_PORT,
    detectCwspControlSurface
} from "./control-surfaces";

export const ANDROID_CONTROL_PORT = CLIENT_CONTROL_PORT;
export const NEUTRALINO_CONTROL_PORT = NEUTRALINO_CONTROL_SIDECAR_PORT;
export const LAST_ANDROID_HOST_KEY = "cwsp-control-android-host-v1";

export const LOOPBACK_CLIENT_HOSTS = ["127.0.0.1", "localhost"] as const;

/** Phone LAN when browser is not on-device (still surface A — client Control, not WAN gateway). */
export const FLEET_ANDROID_HOSTS = [
    "192.168.0.196",
    "192.168.0.208",
    "192.168.0.210"
] as const;

export type ControlDiscoveryResult = {
    source: ConnectionSource;
    live: boolean;
    via: "android" | "neutralino" | "saved" | "none";
    unauthorizedHost?: string;
    /** Android Control listener reachable (pair/hello) — needs deviceCode + Accept before hydrate. */
    androidReachable?: boolean;
    /** Neutralino Control reachable (pair/hello) — needs deviceCode before hydrate on public SPA. */
    neutralinoReachable?: boolean;
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
        // SECURITY: ignore controlKey / cwsp_control_key — never inject secrets via URL.
        const out: Partial<ConnectionSource> = {};
        if (host) out.host = host;
        if (portRaw) {
            const port = Number(portRaw);
            if (Number.isFinite(port) && port > 0) out.port = port;
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

const isLoopbackHostName = (host: string): boolean => {
    const h = String(host || "").trim().toLowerCase();
    return h === "127.0.0.1" || h === "localhost" || h === "::1";
};

const isCapacitorProbe = (probe: BridgeProbeResult): boolean =>
    probe.kind === "capacitor" || probe.surface === "capacitor-android";

const isNeutralinoProbe = (probe: BridgeProbeResult, port: number): boolean =>
    port === NEUTRALINO_CONTROL_SIDECAR_PORT &&
    (probe.kind === "neutralino" ||
        probe.surface === "neutralino-node" ||
        probe.reachable ||
        probe.live);

/**
 * Surface A discovery for `https://HOST/cwsp`:
 * 1) PNA client loopback Control `:8434` (Capacitor/Java — primary)
 * 2) Neutralino sidecar `:29110` (COMPAT desk Node until Control is unified on client :8434)
 * 3) Optional phone LAN `:8434` when managing a remote device from desk browser
 *
 * INVARIANT: never use WAN `https://HOST:8434/` as Control bridge (that is surface B + login).
 */
export const discoverControlBridge = async (
    base: ConnectionSource
): Promise<ControlDiscoveryResult> => {
    const surface = detectCwspControlSurface();
    if (surface === "gateway-server") {
        // Surface B — settings belong to same-origin gateway; no PNA bridge required here.
        return {
            source: normalizeBridgeAuth({ ...base, mode: "remote" }),
            live: false,
            via: "none"
        };
    }

    const query = readQueryOverrides();
    // SECURITY: Neutralino desk key only for :29110 — never seed ecosystem token for Android Control.
    const seeded: ConnectionSource = normalizeBridgeAuth({
        ...base,
        mode: "bridge",
        ...(query.host ? { host: query.host } : {}),
        ...(query.port ? { port: query.port } : {}),
        userKey: "",
        apiKey: ""
    });

    await requestLocalNetworkAccessPermission();

    let unauthorizedHost: string | undefined;
    let androidCandidate: ConnectionSource | undefined;

    // --- 1) Client loopback :8434 (Capacitor / on-device Control) ---
    for (const host of LOOPBACK_CLIENT_HOSTS) {
        const candidate = normalizeBridgeAuth({
            ...seeded,
            mode: "bridge",
            scheme: "http",
            host,
            port: CLIENT_CONTROL_PORT,
            userKey: "",
            apiKey: ""
        });
        const probe = await probeBridge(candidate);
        if (isCapacitorProbe(probe) && (probe.live || probe.reachable || probe.unauthorized)) {
            rememberAndroidControlHost(host);
            if (probe.live) {
                return { source: candidate, live: true, via: "android", androidReachable: true };
            }
            unauthorizedHost = host;
            androidCandidate = candidate;
            // Prefer pairing on loopback before falling through to Neutralino when phone Control is up.
            break;
        }
    }

    // On-device phone Chrome → unpaired Capacitor loopback (never steal to desk Neutralino).
    if (androidCandidate) {
        return {
            source: androidCandidate,
            live: false,
            via: "android",
            unauthorizedHost,
            androidReachable: true
        };
    }

    // --- 2) Neutralino sidecar :29110 (desk browser → desk Control) ---
    // WHY: LAN phones below must not win with a different publicToken — that broke
    // Neutralino pairing when Allow Control API was on any fleet phone.
    {
        const neutralino = normalizeBridgeAuth({
            ...seeded,
            mode: "bridge",
            scheme: "http",
            host: "127.0.0.1",
            port: NEUTRALINO_CONTROL_SIDECAR_PORT,
            apiKey: "cwsp-neutralino-local"
        });
        const nProbe = await probeBridge(neutralino);
        if (isNeutralinoProbe(nProbe, NEUTRALINO_CONTROL_SIDECAR_PORT)) {
            return {
                source: neutralino,
                live: Boolean(nProbe.live),
                via: "neutralino",
                unauthorizedHost,
                androidReachable: false,
                neutralinoReachable: Boolean(nProbe.reachable || nProbe.live || nProbe.unauthorized)
            };
        }
    }

    // --- 3) Phone LAN Control :8434 (desk browser, Neutralino down → phone) ---
    const lanHosts = uniqHosts([
        query.host && !isLoopbackHostName(query.host) ? query.host : "",
        looksLikeAndroidControlTarget(seeded) && !isLoopbackHostName(seeded.host)
            ? seeded.host
            : "",
        readLastAndroidHost(),
        ...FLEET_ANDROID_HOSTS
    ].filter(Boolean));

    for (const host of lanHosts) {
        if (isLoopbackHostName(host)) continue;
        const candidate = normalizeBridgeAuth({
            ...seeded,
            mode: "bridge",
            scheme: "http",
            host,
            port: CLIENT_CONTROL_PORT,
            userKey: "",
            apiKey: ""
        });
        const probe = await probeBridge(candidate);
        if (isCapacitorProbe(probe) && (probe.live || probe.reachable || probe.unauthorized)) {
            rememberAndroidControlHost(host);
            return {
                source: candidate,
                live: Boolean(probe.live),
                via: "android",
                unauthorizedHost: probe.live ? undefined : host,
                androidReachable: true
            };
        }
    }

    // Offline: keep surface-A default — client loopback Control :8434 (not WAN gateway).
    return {
        source: normalizeBridgeAuth({
            ...seeded,
            mode: "bridge",
            scheme: "http",
            host: "127.0.0.1",
            port: CLIENT_CONTROL_PORT,
            userKey: "",
            apiKey: ""
        }),
        live: false,
        via: "none",
        unauthorizedHost
    };
};
