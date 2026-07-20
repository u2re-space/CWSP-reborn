/*
 * Filename: connection-source.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/connection-source.ts
 * Change date and time: 16.40.00_20.07.2026
 * Reason for changes: Default remote CWSP mode — avoid PNA/loopback spam from public /cwsp.
 *   2026-07-19: Bridge also targets Capacitor Android Control API on LAN :8434 (PNA).
 *   2026-07-19: LNA targetAddressSpace + API key from ecosystem token for phone :8434.
 *   2026-07-19: Canonical split — /cwsp PNA→client :8434; WAN :8434/ = gateway+auth.
 *   2026-07-20: Control SPA hosts (cwsp.u2re.space) must not become Relay / gateway URL.
 *   2026-07-20: Android Control uses X-Control-Session (pairing); never send ecosystem token.
 */

export const CONNECTION_STORAGE_KEY = "cwsp-control-bridge-v9";
export const OPEN_CONNECTION_EVENT = "cwsp:open-connection-source";

/**
 * bridge = PNA to **client-local** Control `/service/config` (surface A: public `/cwsp`).
 * remote = browser-only SRC/IDB — opt-out when client Control unavailable.
 *
 * ## Surface split (see `control-surfaces.ts`)
 * - `https://HOST/cwsp` → PNA → client `127.0.0.1:8434` (Capacitor/Java) or Neutralino sidecar `:29110`
 *   (same idea as Chrome extension). Never treat WAN `https://HOST:8434/` as this bridge.
 * - `https://HOST:8434/` → gateway server backend + login/cookies (surface B).
 *
 * `endpointUrl` = hub/WS target (often `https://HOST:8434/`) — orthogonal to Control bridge host/port.
 */
export type ConnectionMode = "remote" | "bridge";

export type ConnectionSource = {
    mode: ConnectionMode;
    /** Neutralino / Node / Capacitor control RPC (PNA). */
    scheme: "http" | "https";
    host: string;
    port: number;
    apiKey: string;
    /** CWSP hub/gateway origin (clipboard/WS) — not the Control settings port unless Capacitor. */
    endpointUrl: string;
    userId: string;
    userKey: string;
};

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);
const NEUTRALINO_DEFAULT_KEY = "cwsp-neutralino-local";

/**
 * Public Control SPA hosts — these serve `/cwsp` UI, not the CWSP Relay `/ws` endpoint.
 * WHY: using `location.hostname` here poisoned Relay with `https://cwsp.u2re.space:8434/`.
 */
const CONTROL_SPA_HOSTS = new Set([
    "cwsp.u2re.space",
    "www.cwsp.u2re.space",
    "md.u2re.space",
    "www.md.u2re.space"
]);

/** True when URL/host is a Control SPA (not a fleet gateway / phone Control API). */
export const isControlSpaEndpoint = (endpointOrHost: string): boolean => {
    const raw = String(endpointOrHost || "").trim().toLowerCase();
    if (!raw) return false;
    try {
        const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
        const host = new URL(withScheme).hostname.toLowerCase();
        if (CONTROL_SPA_HOSTS.has(host)) return true;
        // COMPAT: bare hostname without port/path
        return CONTROL_SPA_HOSTS.has(raw.replace(/\/+$/, ""));
    } catch {
        return CONTROL_SPA_HOSTS.has(raw.replace(/\/+$/, ""));
    }
};

/**
 * Hub URL for WS/clipboard.
 * WHY: factory loopback poisoned /cwsp on VDS — but page host must NOT be used for Control
 * SPAs (`cwsp.u2re.space`); Relay comes from Android Configure / Neutralino portable instead.
 * Empty default lets hydrateFromBridge + settings:get fill the real gateway.
 */
const defaultEndpointUrl = (): string => {
    try {
        const host = String(location.hostname || "").trim().toLowerCase();
        if (!host || LOOPBACK.has(host) || isControlSpaEndpoint(host)) {
            return "";
        }
        // Page is itself a gateway-like host (IP / named endpoint host).
        return `https://${host}:8434/`;
    } catch {
        /* ignore */
    }
    return "";
};

const DEFAULTS = (): ConnectionSource => ({
    // WHY: public /cwsp PNA default = client-local Control on :8434 (Capacitor/Java + future unified).
    // COMPAT: discovery still probes Neutralino sidecar :29110 when :8434 is hub-only/redirect.
    mode: "bridge",
    scheme: "http",
    host: "127.0.0.1",
    port: 8434,
    apiKey: "",
    endpointUrl: defaultEndpointUrl(),
    userId: "",
    userKey: ""
});

const isLoopbackHost = (host: string): boolean => LOOPBACK.has(String(host || "").trim().toLowerCase());

/** RFC1918 / link-local / ULA — private IP literals (LNA mixed-content exemption). */
const isPrivateIpLiteral = (host: string): boolean => {
    const h = String(host || "").trim().toLowerCase();
    if (!h) return false;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^fc[0-9a-f]{2}:/i.test(h) || /^fd[0-9a-f]{2}:/i.test(h)) return true;
    return false;
};

/**
 * Capacitor Java Control API binds :8434 (loopback on-device + LAN) — never Neutralino :29110.
 * WHY: same-device /cwsp → `http://127.0.0.1:8434/service/config` must use ecosystem token.
 */
export const looksLikeAndroidControlTarget = (source: Pick<ConnectionSource, "host" | "port">): boolean => {
    return Number(source.port) === 8434;
};

/**
 * Resolve X-API-Key for the Control host.
 * INVARIANT: Capacitor :8434 auth = ecosystem token; Neutralino :29110 keeps local desk key.
 */
export const resolveBridgeApiKey = (source: ConnectionSource): string => {
    const raw = String(source.apiKey || "").trim();
    const token = String(source.userKey || "").trim();
    if (looksLikeAndroidControlTarget(source)) {
        if (token) return token;
        if (raw && raw !== NEUTRALINO_DEFAULT_KEY) return raw;
        return token || raw;
    }
    // Neutralino desk control
    if (Number(source.port) === 29110) {
        return raw || NEUTRALINO_DEFAULT_KEY;
    }
    if (!raw || (raw === NEUTRALINO_DEFAULT_KEY && token)) {
        return token || raw || NEUTRALINO_DEFAULT_KEY;
    }
    return raw || NEUTRALINO_DEFAULT_KEY;
};

/** Annotate fetch for Chrome Local Network Access (mixed-content exemption + permission). */
const targetAddressSpaceForHost = (host: string): "loopback" | "local" | undefined => {
    if (isLoopbackHost(host)) return "loopback";
    if (isPrivateIpLiteral(host) || String(host || "").toLowerCase().endsWith(".local")) {
        return "local";
    }
    return undefined;
};

/**
 * Prefer ecosystem token as API key when targeting Android :8434 with the Neutralino factory key.
 */
export const normalizeBridgeAuth = (source: ConnectionSource): ConnectionSource => {
    const apiKey = resolveBridgeApiKey(source);
    if (apiKey === source.apiKey) return source;
    return { ...source, apiKey };
};

const isLoopbackEndpoint = (endpointUrl: string): boolean =>
    /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(String(endpointUrl || "").trim());

const migrateLegacy = (parsed: Record<string, unknown>): Partial<ConnectionSource> => {
    // COMPAT: missing mode → bridge (shared Neutralino SoT). Explicit remote is preserved.
    let mode: ConnectionMode =
        parsed.mode === "remote" ? "remote" : parsed.mode === "bridge" ? "bridge" : "bridge";
    // v5 factory remote + loopback endpoint → promote to bridge for shared settings.
    if (
        mode === "remote" &&
        !String(parsed.userId || "").trim() &&
        !String(parsed.userKey || "").trim() &&
        isLoopbackEndpoint(String(parsed.endpointUrl || ""))
    ) {
        mode = "bridge";
    }
    // INVARIANT: never rewrite a user/Neutralino gateway (e.g. https://45.147.121.152:8434/)
    // back to loopback — that host is a valid Relay / gateway target for the desk backend.
    const endpointUrl = String(parsed.endpointUrl || "").trim();
    return { ...parsed, mode, endpointUrl: endpointUrl || undefined };
};

export const loadConnectionSource = (): ConnectionSource => {
    const base = DEFAULTS();
    try {
        const raw =
            localStorage.getItem(CONNECTION_STORAGE_KEY) ||
            localStorage.getItem("cwsp-control-bridge-v8") ||
            localStorage.getItem("cwsp-control-bridge-v7") ||
            localStorage.getItem("cwsp-control-bridge-v6") ||
            localStorage.getItem("cwsp-control-bridge-v5") ||
            localStorage.getItem("cwsp-control-bridge-v4") ||
            localStorage.getItem("cwsp-control-bridge-v3");
        if (!raw) return base;
        const parsed = migrateLegacy(JSON.parse(raw) as Record<string, unknown>);
        let storedEp = String(parsed.endpointUrl || "").trim();
        // WHY: legacy SRC hub `https://127.0.0.1:8434/` poisons public /cwsp settings forms.
        // INVARIANT: never replace loopback with Control SPA page-host (cwsp.u2re.space:8434).
        if (storedEp && isLoopbackEndpoint(storedEp) && !isLoopbackHost(location.hostname)) {
            storedEp = base.endpointUrl && !isControlSpaEndpoint(base.endpointUrl) ? base.endpointUrl : "";
        }
        if (storedEp && isControlSpaEndpoint(storedEp)) {
            storedEp = "";
        }
        return normalizeBridgeAuth({
            mode: parsed.mode === "remote" ? "remote" : "bridge",
            scheme: parsed.scheme === "https" ? "https" : "http",
            host: String(parsed.host || base.host).trim() || base.host,
            port: Number(parsed.port) || base.port,
            apiKey: String(parsed.apiKey ?? base.apiKey),
            endpointUrl: storedEp || base.endpointUrl,
            userId: String(parsed.userId || ""),
            userKey: String(parsed.userKey || "")
        });
    } catch {
        return base;
    }
};

export const saveConnectionSource = (source: ConnectionSource): void => {
    // SECURITY: do not persist ecosystem token / API key for Android Control auth.
    // Pairing session lives in sessionStorage; Neutralino desk key stays for :29110 only.
    const safe: ConnectionSource = { ...source };
    if (looksLikeAndroidControlTarget(safe) || Number(safe.port) === 8434) {
        safe.apiKey = "";
        safe.userKey = "";
    }
    localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(safe));
};

export const bridgeBaseUrl = (source: ConnectionSource): string => {
    const host = source.host.includes(":") && !source.host.startsWith("[") ? `[${source.host}]` : source.host;
    return `${source.scheme}://${host}:${source.port}`;
};

export const endpointNeedsLogin = (endpointUrl: string): boolean => {
    try {
        const withScheme = /^https?:\/\//i.test(endpointUrl) ? endpointUrl : `https://${endpointUrl}`;
        const host = new URL(withScheme).hostname.toLowerCase();
        return !LOOPBACK.has(host);
    } catch {
        return true;
    }
};

export const clearDesktopBridgeGlobals = (): void => {
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: { port: number; key: string };
        __NEUTRALINO_AUTH__?: { port: number; key: string };
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
        __CWS_NODE_CLIPBOARD_HUB__?: boolean;
        __CWSP_CONTROL_MODE__?: ConnectionMode;
        __CWSP_CONTROL_SOURCE__?: ConnectionSource;
        __CWSP_CONTROL_BRIDGE_LIVE__?: boolean;
    };
    delete g.__WEBNATIVE_AUTH__;
    delete g.__NEUTRALINO_AUTH__;
    g.__CWS_WEBNATIVE_BOOT__ = false;
    g.__CWS_NEUTRALINO_BOOT__ = false;
    g.__CWS_NODE_CLIPBOARD_HUB__ = false;
    g.__CWSP_CONTROL_BRIDGE_LIVE__ = false;
};

export type ControlBridgeVia = "android" | "neutralino" | "saved" | "none";

/**
 * Apply globals for the active Control bridge.
 *
 * INVARIANT (L-110 vs L-210):
 * - Neutralino desk (L-110): `__NEUTRALINO_AUTH__` + BOOT + clipboard-hub on :29110 only.
 * - Capacitor phone (L-210/…): `__CWSP_CONTROL_*` + `__WEBNATIVE_AUTH__` (host=LAN) only —
 *   never write `__NEUTRALINO_AUTH__` / NEUTRALINO_BOOT (that poisoned desk SoT).
 */
export const applyConnectionGlobals = (
    source: ConnectionSource,
    options?: { bridgeLive?: boolean; via?: ControlBridgeVia }
): void => {
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: {
            port: number;
            key: string;
            host?: string;
            scheme?: "http" | "https";
        };
        __NEUTRALINO_AUTH__?: {
            port: number;
            key: string;
            host?: string;
            scheme?: "http" | "https";
        };
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
        __CWS_NODE_CLIPBOARD_HUB__?: boolean;
        __CWSP_CONTROL_MODE__?: ConnectionMode;
        __CWSP_CONTROL_SOURCE__?: ConnectionSource;
        __CWSP_CONTROL_BRIDGE_LIVE__?: boolean;
        __CWSP_CONTROL_VIA__?: ControlBridgeVia;
    };
    g.__CWSP_CONTROL_SOURCE__ = source;
    g.__CWSP_CONTROL_MODE__ = source.mode;

    if (source.mode !== "bridge" || !options?.bridgeLive) {
        clearDesktopBridgeGlobals();
        g.__CWSP_CONTROL_SOURCE__ = source;
        g.__CWSP_CONTROL_MODE__ = source.mode;
        g.__CWSP_CONTROL_VIA__ = "none";
        return;
    }

    const auth = {
        port: source.port,
        key: resolveBridgeApiKey(source),
        host: source.host,
        scheme: source.scheme
    };
    const via =
        options.via ||
        (Number(source.port) === 29110 && isLoopbackHost(source.host)
            ? "neutralino"
            : looksLikeAndroidControlTarget(source)
              ? "android"
              : "saved");
    g.__CWSP_CONTROL_VIA__ = via;
    g.__CWSP_CONTROL_BRIDGE_LIVE__ = true;

    if (via === "neutralino") {
        g.__WEBNATIVE_AUTH__ = auth;
        g.__NEUTRALINO_AUTH__ = { ...auth, host: "127.0.0.1", port: 29110 };
        g.__CWS_WEBNATIVE_BOOT__ = true;
        g.__CWS_NEUTRALINO_BOOT__ = true;
        g.__CWS_NODE_CLIPBOARD_HUB__ = true;
        return;
    }

    // Capacitor / saved non-Neutralino Control — do not impersonate Neutralino L-110.
    g.__WEBNATIVE_AUTH__ = auth;
    delete g.__NEUTRALINO_AUTH__;
    g.__CWS_WEBNATIVE_BOOT__ = false;
    g.__CWS_NEUTRALINO_BOOT__ = false;
    g.__CWS_NODE_CLIPBOARD_HUB__ = false;
};

/** @deprecated use applyConnectionGlobals */
export const applyBridgeAuthGlobals = (source: ConnectionSource): void => {
    applyConnectionGlobals(source, { bridgeLive: source.mode === "bridge" });
};

export const bridgeFetch = async (
    source: ConnectionSource,
    path: string,
    init?: RequestInit
): Promise<Response> => {
    const authSource = normalizeBridgeAuth(source);
    const url = new URL(path, `${bridgeBaseUrl(authSource)}/`).toString();
    const headers = new Headers(init?.headers || {});
    headers.set("Accept", "application/json");
    const skipLegacyKey = headers.get("X-Skip-Legacy-Key") === "1";
    if (skipLegacyKey) headers.delete("X-Skip-Legacy-Key");

    // Pairing session for Capacitor / Neutralino Control (public SPA / PNA).
    let sessionToken = "";
    try {
        const { getActiveControlSessionToken } = await import("./control-pairing");
        sessionToken = getActiveControlSessionToken();
    } catch {
        sessionToken = "";
    }
    if (sessionToken) {
        headers.set("X-Control-Session", sessionToken);
    }

    // SECURITY: public https Control SPA never sends desk/ecosystem keys — session only.
    let pageIsPublicHttps = false;
    try {
        pageIsPublicHttps =
            location.protocol === "https:" && !isLoopbackHost(String(location.hostname || ""));
    } catch {
        pageIsPublicHttps = true;
    }

    if (!skipLegacyKey && !pageIsPublicHttps) {
        // Loopback / Capacitor same-device: desk API key or local control key OK.
        const apiKey = resolveBridgeApiKey(authSource);
        if (apiKey) headers.set("X-API-Key", apiKey);
    }
    // INVARIANT: public https → Control never sends ecosystem / desk token as X-API-Key.

    if (init?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    const space = targetAddressSpaceForHost(authSource.host);
    const fetchInit: RequestInit & { targetAddressSpace?: string } = {
        ...init,
        headers,
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
    };
    // WHY: https://public/cwsp → http://192.168.x.x:8434 needs LNA annotation for mixed content.
    if (space) fetchInit.targetAddressSpace = space;
    const res = await fetch(url, fetchInit as RequestInit);
    // WHY: expired/invalid Control session → disarm + re-pair (debounced in control-pairing).
    if (res.status === 401 || res.status === 403) {
        try {
            const { isControlAuthPath, notifyControlUnauthorized } = await import("./control-pairing");
            if (isControlAuthPath(path)) {
                notifyControlUnauthorized(res.status, path);
            }
        } catch {
            /* ignore */
        }
    }
    return res;
};

export type BridgeProbeResult = {
    live: boolean;
    reachable: boolean;
    status: number;
    unauthorized: boolean;
    error?: string;
    /** `control.surface` from JSON body when present. */
    surface?: string;
    /** Classified Control backend (reject CWSP hub HTML on :8434). */
    kind?: "capacitor" | "neutralino" | "unknown";
};

const classifyControlBody = (
    source: ConnectionSource,
    body: unknown
): { surface?: string; kind: "capacitor" | "neutralino" | "unknown"; usable: boolean } => {
    if (!body || typeof body !== "object") {
        return { kind: "unknown", usable: false };
    }
    const rec = body as Record<string, unknown>;
    const control = rec.control && typeof rec.control === "object"
        ? (rec.control as Record<string, unknown>)
        : {};
    const surface = typeof control.surface === "string" ? control.surface : undefined;
    const hasBlob = Boolean(rec.settings || rec.portable || rec.snapshot);
    const port = Number(source.port) || 0;

    // Capacitor GET always advertises control.surface — require it on :8434 so desk hub ≠ SoT.
    if (port === 8434) {
        if (surface === "capacitor-android") {
            return { surface, kind: "capacitor", usable: true };
        }
        return { surface, kind: "unknown", usable: false };
    }
    if (port === 29110 && hasBlob) {
        return { surface, kind: "neutralino", usable: true };
    }
    if (hasBlob) {
        return { surface, kind: "unknown", usable: true };
    }
    return { surface, kind: "unknown", usable: false };
};

/**
 * Probe Control.
 * INVARIANT: pairing surfaces use `/service/pair/hello` (no secrets).
 *   Hydrate "live" requires paired session (public SPA) or desk X-API-Key (loopback).
 */
export const probeBridge = async (source: ConnectionSource): Promise<BridgeProbeResult> => {
    if (source.mode !== "bridge") {
        return { live: false, reachable: false, status: 0, unauthorized: false };
    }
    try {
        const ctrl =
            typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
                ? AbortSignal.timeout(2500)
                : undefined;

        // Prefer pair/hello when the Control advertises pairing (Android + Neutralino).
        {
            const hello = await bridgeFetch(source, "/service/pair/hello", {
                signal: ctrl,
                headers: { "X-Skip-Legacy-Key": "1" }
            } as RequestInit);
            if (hello.ok) {
                let body: unknown = null;
                try {
                    body = await hello.json();
                } catch {
                    body = null;
                }
                const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
                const control =
                    rec.control && typeof rec.control === "object"
                        ? (rec.control as Record<string, unknown>)
                        : {};
                const surface =
                    typeof control.surface === "string"
                        ? control.surface
                        : looksLikeAndroidControlTarget(source)
                          ? "capacitor-android"
                          : "neutralino-node";
                if (rec.pairing === true || surface === "capacitor-android" || surface === "neutralino-node") {
                    let sessionOk = false;
                    try {
                        const { getActiveControlSessionToken } = await import("./control-pairing");
                        sessionOk = Boolean(getActiveControlSessionToken());
                    } catch {
                        sessionOk = false;
                    }
                    // Loopback desk WebView may still hydrate with X-API-Key (no public Origin).
                    let pageIsPublicHttps = false;
                    try {
                        pageIsPublicHttps =
                            location.protocol === "https:" &&
                            !isLoopbackHost(String(location.hostname || ""));
                    } catch {
                        pageIsPublicHttps = true;
                    }
                    const kind = surface === "capacitor-android" ? "capacitor" : "neutralino";
                    if (!pageIsPublicHttps && !sessionOk) {
                        // Fall through to /service/config with desk key.
                    } else {
                        return {
                            live: sessionOk,
                            reachable: true,
                            status: hello.status,
                            unauthorized: !sessionOk,
                            kind,
                            surface
                        };
                    }
                }
            } else if (looksLikeAndroidControlTarget(source) || Number(source.port) === 29110) {
                // COMPAT: mid-deploy / older builds without pair/hello — 401 on config still means Control is up.
                try {
                    const res = await bridgeFetch(source, "/service/config", {
                        signal: ctrl,
                        headers: { "X-Skip-Legacy-Key": "1" }
                    } as RequestInit);
                    if (res.status === 401 || res.status === 403) {
                        return {
                            live: false,
                            reachable: true,
                            status: res.status,
                            unauthorized: true,
                            kind: looksLikeAndroidControlTarget(source) ? "capacitor" : "neutralino",
                            surface: looksLikeAndroidControlTarget(source)
                                ? "capacitor-android"
                                : "neutralino-node"
                        };
                    }
                } catch {
                    /* fall through */
                }
                return {
                    live: false,
                    reachable: false,
                    status: hello.status,
                    unauthorized: hello.status === 401 || hello.status === 403
                };
            }
        }

        const res = await bridgeFetch(source, "/service/config", { signal: ctrl });
        const unauthorized = res.status === 401 || res.status === 403;
        if (!res.ok) {
            return {
                live: false,
                reachable: unauthorized || res.status > 0,
                status: res.status,
                unauthorized,
                kind: looksLikeAndroidControlTarget(source)
                    ? "capacitor"
                    : Number(source.port) === 29110
                      ? "neutralino"
                      : undefined,
                surface: looksLikeAndroidControlTarget(source)
                    ? "capacitor-android"
                    : Number(source.port) === 29110
                      ? "neutralino-node"
                      : undefined
            };
        }
        let body: unknown = null;
        try {
            body = await res.json();
        } catch {
            body = null;
        }
        const classified = classifyControlBody(source, body);
        return {
            live: classified.usable,
            reachable: classified.usable,
            status: res.status,
            unauthorized: false,
            surface: classified.surface,
            kind: classified.kind
        };
    } catch (error) {
        return {
            live: false,
            reachable: false,
            status: 0,
            unauthorized: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
};

export const probeBridgeLive = async (source: ConnectionSource): Promise<boolean> => {
    const result = await probeBridge(source);
    return result.live;
};

/** Persist CWSP target credentials into Neutralino portable.core. */
export const patchCwspTargetViaBridge = async (source: ConnectionSource): Promise<void> => {
    const patch = {
        core: {
            endpointUrl: source.endpointUrl,
            userId: source.userId,
            userKey: source.userKey
        }
    };
    const res = await bridgeFetch(source, "/service/config", {
        method: "POST",
        body: JSON.stringify(patch)
    });
    if (!res.ok) {
        throw new Error(`Bridge POST /service/config failed (HTTP ${res.status})`);
    }
};

export const sourceToAppSettingsCore = (source: ConnectionSource): Record<string, unknown> => {
    const android = looksLikeAndroidControlTarget(source);
    const core: Record<string, unknown> = {
        endpointUrl: source.endpointUrl,
        userId: source.userId,
        // WHY: keep true so settings-contributions merges the SRC arm over empty IDB defaults.
        preferBackendSync: true
    };
    // SECURITY: Android Control pairing — do not seed ecosystem token into browser IDB from SRC.
    if (!android && source.userKey) {
        core.userKey = source.userKey;
        core.ecosystemToken = source.userKey;
        core.socket = { accessToken: source.userKey };
    }
    return core;
};

const DIALOG_STYLE = `
.cwsp-src-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);display:grid;place-items:center;z-index:99999;padding:1rem;font-family:system-ui,sans-serif}
.cwsp-src-panel{width:min(28rem,100%);background:#1d212a;color:#eef1f5;border:1px solid #303542;border-radius:1rem;padding:1.25rem;box-sizing:border-box}
.cwsp-src-panel h2{margin:0 0 .35rem;font-size:1.15rem}
.cwsp-src-panel p{margin:0 0 .75rem;color:#aeb6c4;font-size:.88rem;line-height:1.4}
.cwsp-src-panel label{display:grid;gap:.3rem;margin-top:.65rem;font-size:.82rem;font-weight:600;color:#aeb6c4}
.cwsp-src-panel input,.cwsp-src-panel select{width:100%;box-sizing:border-box;border-radius:.5rem;padding:.65rem;border:1px solid #4b5362;background:#12141a;color:inherit;font:inherit}
.cwsp-src-row{display:grid;grid-template-columns:1fr 1fr 5.5rem;gap:.5rem}
.cwsp-src-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.cwsp-src-actions button{border:0;border-radius:999px;padding:.55rem 1rem;font:inherit;font-weight:700;cursor:pointer}
.cwsp-src-actions .primary{background:#3975ca;color:#fff}
.cwsp-src-actions .ghost{background:transparent;color:#eef1f5;border:1px solid #4b5362}
.cwsp-src-msg{min-height:1.2rem;margin:.5rem 0 0;font-size:.85rem;color:#ff9e9e}
.cwsp-src-bridge[hidden],.cwsp-src-auth[hidden]{display:none!important}
@media(max-width:560px){.cwsp-src-row{grid-template-columns:1fr}}
`;

let openDialog: HTMLElement | null = null;

export const openConnectionSourceDialog = (options?: {
    onSaved?: (source: ConnectionSource) => void | Promise<void>;
}): void => {
    if (openDialog) {
        openDialog.remove();
        openDialog = null;
    }

    const current = loadConnectionSource();
    const backdrop = document.createElement("div");
    backdrop.className = "cwsp-src-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.innerHTML = `
      <style>${DIALOG_STYLE}</style>
      <form class="cwsp-src-panel" id="cwsp-src-form">
        <h2>Connection source</h2>
        <p><b>Bridge</b> (this <code>/cwsp</code> page) — PNA to <b>client</b> Control <code>:8434</code>. Android requires <b>Accept on the phone</b> (pairing) — ecosystem token stays on device. Neutralino desk <code>:29110</code> still uses a local API key. <b>Not</b> the gateway at <code>https://HOST:8434/</code>.</p>
        <label>Mode
          <select name="mode">
            <option value="bridge"${current.mode !== "remote" ? " selected" : ""}>Control bridge (shared SoT)</option>
            <option value="remote"${current.mode === "remote" ? " selected" : ""}>Remote only (no Control API)</option>
          </select>
        </label>
        <div class="cwsp-src-bridge" data-bridge ${current.mode === "bridge" ? "" : "hidden"}>
          <div class="cwsp-src-row">
            <label>Scheme
              <select name="scheme">
                <option value="http"${current.scheme === "http" ? " selected" : ""}>http</option>
                <option value="https"${current.scheme === "https" ? " selected" : ""}>https</option>
              </select>
            </label>
            <label>Bridge host
              <input name="host" value="${current.host}" spellcheck="false" autocomplete="off" />
            </label>
            <label>Port
              <input name="port" type="number" min="1" max="65535" value="${current.port}" />
            </label>
          </div>
          <label>Desk API key (Neutralino :29110 only — not Android)
            <input name="apiKey" type="password" value="${Number(current.port) === 29110 ? current.apiKey : ""}" autocomplete="off" spellcheck="false" placeholder="cwsp-neutralino-local" />
          </label>
        </div>
        <label>CWSP endpoint URL
          <input name="endpointUrl" type="url" value="${current.endpointUrl}" spellcheck="false" />
        </label>
        <div class="cwsp-src-auth" data-auth ${endpointNeedsLogin(current.endpointUrl) ? "" : "hidden"}>
          <label>User ID
            <input name="userId" value="${current.userId}" autocomplete="username" spellcheck="false" />
          </label>
          <label>Password / PIN / user key
            <input name="userKey" type="password" value="${current.userKey}" autocomplete="current-password" />
          </label>
        </div>
        <p class="cwsp-src-msg" data-msg role="status"></p>
        <div class="cwsp-src-actions">
          <button type="submit" class="primary">Save &amp; connect</button>
          <button type="button" class="ghost" data-probe>Probe</button>
          <button type="button" class="ghost" data-close>Close</button>
        </div>
      </form>
    `;

    const form = backdrop.querySelector("form") as HTMLFormElement;
    const msg = backdrop.querySelector("[data-msg]") as HTMLElement;
    const authBox = backdrop.querySelector("[data-auth]") as HTMLElement;
    const bridgeBox = backdrop.querySelector("[data-bridge]") as HTMLElement;
    const modeSelect = form.elements.namedItem("mode") as HTMLSelectElement;
    const endpointInput = form.elements.namedItem("endpointUrl") as HTMLInputElement;

    const readForm = (): ConnectionSource => {
        const raw: ConnectionSource = {
            mode: modeSelect.value === "bridge" ? "bridge" : "remote",
            scheme: (form.elements.namedItem("scheme") as HTMLSelectElement).value === "https" ? "https" : "http",
            host: String((form.elements.namedItem("host") as HTMLInputElement).value || "").trim() || "127.0.0.1",
            port: Number((form.elements.namedItem("port") as HTMLInputElement).value) || 29110,
            apiKey: String((form.elements.namedItem("apiKey") as HTMLInputElement).value || ""),
            endpointUrl:
                String((form.elements.namedItem("endpointUrl") as HTMLInputElement).value || "").trim() ||
                defaultEndpointUrl(),
            userId: String((form.elements.namedItem("userId") as HTMLInputElement).value || "").trim(),
            userKey: String((form.elements.namedItem("userKey") as HTMLInputElement).value || "")
        };
        // WHY: phone :8434 auth is ecosystem token — replace factory Neutralino key on save/probe.
        return normalizeBridgeAuth(raw);
    };

    const syncVisibility = () => {
        bridgeBox.hidden = modeSelect.value !== "bridge";
        authBox.hidden = !endpointNeedsLogin(endpointInput.value);
    };
    modeSelect.addEventListener("change", syncVisibility);
    endpointInput.addEventListener("input", syncVisibility);

    backdrop.querySelector("[data-close]")?.addEventListener("click", () => {
        backdrop.remove();
        openDialog = null;
    });

    backdrop.querySelector("[data-probe]")?.addEventListener("click", async () => {
        const source = readForm();
        msg.textContent = "Probing…";
        try {
            if (source.mode === "bridge") {
                const probe = await probeBridge(source);
                if (probe.live) {
                    msg.textContent = `Bridge OK ${bridgeBaseUrl(source)}`;
                    msg.style.color = "#3ecf8e";
                    return;
                }
                if (probe.unauthorized) {
                    msg.textContent = looksLikeAndroidControlTarget(source)
                        ? "Phone Control reachable — set API key = ecosystem token (Allow Control API)"
                        : "Bridge reachable — check API key (X-API-Key)";
                    msg.style.color = "#ffb020";
                    return;
                }
                msg.textContent = probe.error
                    ? `Bridge unreachable: ${probe.error}`
                    : `Bridge HTTP ${probe.status || "fail"}`;
                msg.style.color = "#ff9e9e";
                return;
            }
            const base = source.endpointUrl.replace(/\/?$/, "/");
            const res = await fetch(new URL("lna-probe", base).toString(), {
                method: "GET",
                cache: "no-store",
                mode: "cors"
            });
            msg.textContent = res.ok ? `Endpoint reachable ${base}` : `Endpoint HTTP ${res.status}`;
            msg.style.color = res.ok ? "#3ecf8e" : "#ff9e9e";
        } catch (error) {
            msg.textContent = error instanceof Error ? error.message : "Probe failed";
            msg.style.color = "#ff9e9e";
        }
    });

    form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const source = readForm();
        if (endpointNeedsLogin(source.endpointUrl) && (!source.userId || !source.userKey)) {
            msg.textContent = "Remote CWSP target needs user id and key/PIN.";
            msg.style.color = "#ff9e9e";
            authBox.hidden = false;
            return;
        }
        saveConnectionSource(source);
        msg.textContent = "Saving…";
        try {
            if (source.mode === "bridge") {
                const probe = await probeBridge(source);
                if (!probe.live) {
                    if (probe.unauthorized) {
                        throw new Error(
                            looksLikeAndroidControlTarget(source)
                                ? "Phone Control API returned 401 — API key must be the phone ecosystem token."
                                : "Control bridge returned 401 — check X-API-Key."
                        );
                    }
                    throw new Error(
                        "Client Control unreachable (PNA). Need local 127.0.0.1:8434 (Capacitor Allow Control API) or Neutralino :29110 — not WAN :8434 login."
                    );
                }
                applyConnectionGlobals(source, { bridgeLive: true });
                await patchCwspTargetViaBridge(source);
                msg.textContent = looksLikeAndroidControlTarget(source)
                    ? "Connected via Android Control API."
                    : "Connected via Control bridge.";
            } else {
                applyConnectionGlobals(source, { bridgeLive: false });
                msg.textContent = "Remote CWSP source saved (browser mode).";
            }
            msg.style.color = "#3ecf8e";
            await options?.onSaved?.(source);
            setTimeout(() => {
                backdrop.remove();
                openDialog = null;
            }, 400);
        } catch (error) {
            applyConnectionGlobals(source, { bridgeLive: false });
            msg.textContent = error instanceof Error ? error.message : "Save failed";
            msg.style.color = "#ff9e9e";
        }
    });

    document.body.appendChild(backdrop);
    openDialog = backdrop;
};

export const bindConnectionSourceOpener = (onSaved?: (source: ConnectionSource) => void | Promise<void>): void => {
    window.addEventListener(OPEN_CONNECTION_EVENT, () => {
        openConnectionSourceDialog({ onSaved });
    });
};
