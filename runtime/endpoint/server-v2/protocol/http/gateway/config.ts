/*
 * Filename: config.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/gateway/config.ts
 * Change date and time: 13.43.00_17.07.2026
 * Reason for changes: Resolve fail-closed source policy and non-secret gateway
 *   authentication settings for the L-200 human UI.
 */

import { isIP } from "node:net";

export type GatewayLanPolicy = "off" | "optional" | "required";
export type GatewaySourceClass = "lan" | "wan";

export type GatewayConfig = {
    pinHash: string;
    lanPolicy: GatewayLanPolicy;
    trustedCidrs: string[];
    trustedProxies: string[];
    idleMs: number;
    absoluteMs: number;
    rememberMs: number;
    loginWindowMs: number;
    loginMaxFailures: number;
    loginBackoffMs: number;
};

const DEFAULT_LAN_CIDRS = [
    "127.0.0.0/8",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    "169.254.0.0/16",
    "::1/128",
    "fc00::/7",
    "fe80::/10"
];

const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const asPositiveInteger = (value: unknown, fallback: number): number => {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const splitList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.map((entry) => String(entry || "").trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value
            .split(/[;,]/)
            .map((entry) => entry.trim())
            .filter(Boolean);
    }
    return [];
};

const envOr = (env: NodeJS.ProcessEnv, key: string, fallback: unknown): unknown => {
    const value = env[key];
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const normalizeIp = (value: string): string => {
    const trimmed = String(value || "").trim().replace(/^\[(.*)\]$/, "$1");
    if (trimmed.startsWith("::ffff:")) return trimmed.slice("::ffff:".length);
    return trimmed;
};

const parseIpv4 = (value: string): number | null => {
    const parts = value.split(".");
    if (parts.length !== 4) return null;
    let result = 0;
    for (const part of parts) {
        if (!/^\d+$/.test(part)) return null;
        const octet = Number(part);
        if (octet < 0 || octet > 255) return null;
        result = (result << 8) | octet;
    }
    return result >>> 0;
};

const parseIpv6 = (value: string): bigint | null => {
    const normalized = normalizeIp(value).toLowerCase();
    if (!normalized.includes(":")) return null;
    const halves = normalized.split("::");
    if (halves.length > 2) return null;
    const left = halves[0] ? halves[0].split(":") : [];
    const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
    const groups = [...left, ...right];
    if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return null;
    const missing = 8 - groups.length;
    if (halves.length === 1 && missing !== 0) return null;
    if (halves.length === 2 && missing < 1) return null;
    const expanded = [...left, ...Array.from({ length: Math.max(0, missing) }, () => "0"), ...right];
    let result = 0n;
    for (const group of expanded) {
        result = (result << 16n) | BigInt(parseInt(group, 16));
    }
    return result;
};

const cidrContains = (address: string, cidr: string): boolean => {
    const [rawNetwork, rawPrefix] = String(cidr || "").trim().split("/");
    const network = normalizeIp(rawNetwork);
    const addressVersion = isIP(normalizeIp(address));
    const networkVersion = isIP(network);
    if (!addressVersion || addressVersion !== networkVersion) return false;
    const prefix = rawPrefix === undefined ? (addressVersion === 4 ? 32 : 128) : Number(rawPrefix);
    if (!Number.isInteger(prefix)) return false;

    if (addressVersion === 4) {
        const addressNumber = parseIpv4(normalizeIp(address));
        const networkNumber = parseIpv4(network);
        if (addressNumber === null || networkNumber === null || prefix < 0 || prefix > 32) return false;
        const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
        return (addressNumber & mask) === (networkNumber & mask);
    }

    const addressNumber = parseIpv6(normalizeIp(address));
    const networkNumber = parseIpv6(network);
    if (addressNumber === null || networkNumber === null || prefix < 0 || prefix > 128) return false;
    if (prefix === 0) return true;
    const shift = 128n - BigInt(prefix);
    const mask = ((1n << BigInt(prefix)) - 1n) << shift;
    return (addressNumber & mask) === (networkNumber & mask);
};

export const resolveGatewayConfig = (
    config: Record<string, unknown>,
    env: NodeJS.ProcessEnv = process.env
): GatewayConfig => {
    const gateway = asRecord(config.gateway);
    const auth = asRecord(gateway.auth);
    const pinHash = String(envOr(env, "CWS_GATEWAY_PIN_HASH", auth.pinHash || "") || "").trim();
    const lanPolicyRaw = String(envOr(env, "CWS_GATEWAY_LAN_POLICY", auth.lanPolicy || "optional") || "")
        .trim()
        .toLowerCase();
    const lanPolicy: GatewayLanPolicy =
        lanPolicyRaw === "off" || lanPolicyRaw === "required" ? lanPolicyRaw : "optional";
    const trustedCidrs = splitList(envOr(env, "CWS_GATEWAY_TRUSTED_CIDRS", auth.trustedCidrs || []));
    const trustedProxies = splitList(envOr(env, "CWS_GATEWAY_TRUSTED_PROXIES", auth.trustedProxies || []));

    return {
        pinHash,
        lanPolicy,
        trustedCidrs,
        trustedProxies,
        idleMs: asPositiveInteger(envOr(env, "CWS_GATEWAY_SESSION_IDLE_MS", auth.idleMs), 30 * 60 * 1000),
        absoluteMs: asPositiveInteger(
            envOr(env, "CWS_GATEWAY_SESSION_MAX_MS", auth.absoluteMs),
            24 * 60 * 60 * 1000
        ),
        rememberMs: asPositiveInteger(
            envOr(env, "CWS_GATEWAY_REMEMBER_MS", auth.rememberMs),
            7 * 24 * 60 * 60 * 1000
        ),
        loginWindowMs: asPositiveInteger(
            envOr(env, "CWS_GATEWAY_LOGIN_WINDOW_MS", auth.loginWindowMs),
            60 * 1000
        ),
        loginMaxFailures: asPositiveInteger(
            envOr(env, "CWS_GATEWAY_LOGIN_MAX_FAILURES", auth.loginMaxFailures),
            5
        ),
        loginBackoffMs: asPositiveInteger(
            envOr(env, "CWS_GATEWAY_LOGIN_BACKOFF_MS", auth.loginBackoffMs),
            1000
        )
    };
};

export const classifyGatewaySource = (address: string, config: GatewayConfig): GatewaySourceClass => {
    const normalized = normalizeIp(address);
    if (!isIP(normalized)) return "wan";
    const lanCidrs = [...DEFAULT_LAN_CIDRS, ...config.trustedCidrs];
    return lanCidrs.some((cidr) => cidrContains(normalized, cidr)) ? "lan" : "wan";
};

/**
 * WHY: WAN façades reached through hairpin NAT often show a private TCP peer
 * (`192.168.0.1`) while the browser Host remains the public IP/domain. Public
 * Host must force WAN auth so `/` and `/network` cannot skip the login gate.
 */
export const classifyGatewayRequestSource = (
    remoteAddress: string,
    hostHeader: string,
    config: GatewayConfig
): GatewaySourceClass => {
    const hostName = String(hostHeader || "").split(",")[0].trim().split(":")[0].trim();
    if (hostName && classifyGatewaySource(hostName, config) === "wan") {
        return "wan";
    }
    return classifyGatewaySource(remoteAddress, config);
};

export const isGatewayAuthRequired = (
    sourceClass: GatewaySourceClass,
    lanPolicy: GatewayLanPolicy
): boolean => {
    if (sourceClass === "wan") return true;
    return lanPolicy === "required";
};

export const isTrustedGatewayProxy = (address: string, config: GatewayConfig): boolean => {
    const normalized = normalizeIp(address);
    return Boolean(isIP(normalized) && config.trustedProxies.some((cidr) => cidrContains(normalized, cidr)));
};

