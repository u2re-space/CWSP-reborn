/*
 * Filename: gateway-hosts.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/gateway-hosts.ts
 * Change date and time: 03.20.00_22.07.2026
 * Reason for changes: Avoid hard-coding only 45.147.121.152 for WAN gateway —
 *   prefer env/settings relay·hub·endpoint, keep historical IP as last-resort.
 */

/** Last-resort fleet WAN host (historical VPS). Prefer env/settings. */
export const FLEET_WAN_GATEWAY_HOST_FALLBACK = "45.147.121.152";
export const FLEET_LAN_GATEWAY_HOST = "192.168.0.200";

export const FLEET_LAN_GATEWAY_HTTPS = `https://${FLEET_LAN_GATEWAY_HOST}:8434`;
export const FLEET_WAN_GATEWAY_HTTPS_FALLBACK =
    `https://${FLEET_WAN_GATEWAY_HOST_FALLBACK}:8434`;

const trimSlash = (s: string): string => s.replace(/\/+$/, "");

const env = (...keys: string[]): string => {
    for (const k of keys) {
        const v = String(process.env[k] || "").trim();
        if (v) return v;
    }
    return "";
};

const toHttpsBase = (raw: string): string => {
    let e = String(raw || "").trim().replace(/\/+$/, "");
    if (!e) return "";
    const lower = e.toLowerCase();
    if (lower.startsWith("wss://")) e = "https://" + e.slice("wss://".length);
    else if (lower.startsWith("ws://")) e = "http://" + e.slice("ws://".length);
    else if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
        e = "https://" + e;
    }
    const ws = e.toLowerCase().indexOf("/ws");
    if (ws > 0) e = e.slice(0, ws);
    return trimSlash(e);
};

const hostOf = (base: string): string => {
    try {
        return new URL(base).hostname.toLowerCase();
    } catch {
        return "";
    }
};

export const isFleetLanGatewayHost = (host: string): boolean => {
    const h = String(host || "").trim().toLowerCase();
    return h === FLEET_LAN_GATEWAY_HOST || h === "l-192.168.0.200" || h === "l-200";
};

/**
 * WAN gateway HTTPS base: settings/env first, historical WAN IP last.
 * Env: CWS_FILES_PUBLIC_WAN_BASE_URL, CWS_GATEWAY_WAN_BASE_URL,
 *      CWSP_GATEWAY_WAN_URL, CWS_RELAY_HTTPS_URL, CWSP_HUB_URL, …
 */
export const resolveFleetWanGatewayHttpsBase = (extras: unknown[] = []): string => {
    const preferred = [
        env(
            "CWS_FILES_PUBLIC_WAN_BASE_URL",
            "CWS_GATEWAY_WAN_BASE_URL",
            "CWSP_GATEWAY_WAN_URL",
            "CWS_RELAY_HTTPS_URL",
            "CWSP_RELAY_HTTPS_URL",
            "CWSP_HUB_URL",
            "CWS_HUB_URL",
            "CWSP_ENDPOINT_URL",
            "CWS_ENDPOINT_URL",
        ),
        ...extras.map((x) => String(x || "").trim()),
    ];
    for (const raw of preferred) {
        const base = toHttpsBase(raw);
        if (!base) continue;
        const host = hostOf(base);
        if (!host || isFleetLanGatewayHost(host)) continue;
        return base;
    }
    return FLEET_WAN_GATEWAY_HTTPS_FALLBACK;
};

export const resolveFleetWanGatewayHost = (extras: unknown[] = []): string =>
    hostOf(resolveFleetWanGatewayHttpsBase(extras)) || FLEET_WAN_GATEWAY_HOST_FALLBACK;

export const resolveFleetLanGatewayHttpsBase = (extras: unknown[] = []): string => {
    const preferred = [
        env("CWS_FILES_PUBLIC_LAN_BASE_URL", "CWS_GATEWAY_LAN_BASE_URL"),
        ...extras.map((x) => String(x || "").trim()),
    ];
    for (const raw of preferred) {
        const base = toHttpsBase(raw);
        if (!base) continue;
        if (isFleetLanGatewayHost(hostOf(base))) return base;
    }
    return FLEET_LAN_GATEWAY_HTTPS;
};

export const isFleetWanGatewayHost = (host: string, extras: unknown[] = []): boolean => {
    const h = String(host || "").trim().toLowerCase();
    if (!h) return false;
    if (h === FLEET_WAN_GATEWAY_HOST_FALLBACK) return true;
    return h === resolveFleetWanGatewayHost(extras).toLowerCase();
};

export const isFleetGatewayHost = (host: string, extras: unknown[] = []): boolean =>
    isFleetLanGatewayHost(host) || isFleetWanGatewayHost(host, extras);
