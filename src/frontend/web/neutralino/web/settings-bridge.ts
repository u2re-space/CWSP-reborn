/*
 * Filename: settings-bridge.ts
 * FullPath: apps/CWSP-reborn/app/windows/neutralino/web/settings-bridge.ts
 * Change date and time: 14.20.00_19.07.2026
 * Reason for changes: Normalize /service/config → AppSettings so Settings fields prefer backend SoT.
 *   2026-07-19: Lift flat Capacitor `cwsp.*` maps into core/shell for /cwsp hydrate.
 */

/**
 * Thin client for the Node WebNative / Neutralino control host.
 *
 * WHY: the settings-view module registers a `SettingsSyncArm` at bootstrap; this
 * factory builds that arm from auth globals (`__WEBNATIVE_AUTH__` /
 * `__NEUTRALINO_AUTH__` / Neutralino `NL_*` globals) without bundling Node
 * filesystem code into the WebView.
 *
 * Contract: CWSP settings flow through `GET|POST /service/config` with
 * `X-API-Key` (shared by WebNative and Neutralino shells). Neutralino shell
 * metadata (applicationId, modes, etc.) is read from `GET /neutralino/config`
 * by the dual Neutralino arm.
 *
 * Backend-facing only — does not rewrite Vite entry or view modules.
 */

export type SettingsBlob = Record<string, unknown>;
export type SettingsPatch = SettingsBlob;

export interface WebnativeAuth {
    port: number;
    key: string;
}

export interface NeutralinoAuth {
    port: number;
    key?: string;
    version?: string;
    applicationId?: string;
    defaultMode?: string;
    documentRoot?: string;
    url?: string;
    enableServer?: boolean;
    nativeAllowList?: string[];
    modes?: Record<string, any>;
    cli?: Record<string, any>;
    extensions?: Record<string, any>;
    binaryName?: string;
    resourcesPath?: string;
    extensionsPath?: string;
    clientLibrary?: string;
    binaryPath?: string;
    binaryArgs?: string[];
    binaryEnv?: Record<string, string>;
}

export interface SettingsSyncArmLike {
    get(): Promise<SettingsBlob>;
    patch(patch: SettingsPatch): Promise<SettingsBlob>;
    defaults?(): Promise<SettingsBlob>;
    snapshot?(): Promise<SettingsBlob>;
}

function readAuth(explicit?: WebnativeAuth | NeutralinoAuth | null): WebnativeAuth | NeutralinoAuth | null {
    if (explicit && typeof explicit.port === "number") return explicit;
    try {
        const g = globalThis as unknown as {
            __WEBNATIVE_AUTH__?: WebnativeAuth | NeutralinoAuth;
            __NEUTRALINO_AUTH__?: NeutralinoAuth;
        };
        const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
        if (auth && typeof auth.port === "number") return auth;
    } catch {
        /* ignore */
    }
    return null;
}

const asRecord = (value: unknown): SettingsBlob =>
    value !== null && typeof value === "object" && !Array.isArray(value)
        ? (value as SettingsBlob)
        : {};

/**
 * Map Node `/service/config` payload into AppSettings-shaped keys the Settings UI binds.
 * WHY: portable blobs often store `bridge.endpointUrl` / `shell.remoteHost` while the form
 * reads `core.endpointUrl` / `core.ecosystemToken` — without this, fields stay on IDB defaults.
 * INVARIANT: backend non-empty values win; empty backend strings do not wipe good local values
 * (handled later by mergeSettingsFromSync).
 */
export function normalizeServiceConfigToAppSettings(
    body: {
        settings?: SettingsBlob;
        portable?: SettingsBlob;
        snapshot?: SettingsBlob;
        control?: SettingsBlob;
    } | null
): SettingsBlob {
    if (!body || typeof body !== "object") return {};
    const raw = asRecord(body.settings || body.portable);
    const snap = asRecord(body.snapshot);
    if (!Object.keys(raw).length && !Object.keys(snap).length) return {};

    // COMPAT: Capacitor/Java sometimes persists a flat `cwsp` map alongside AppSettings.
    const cwspFlat = asRecord(raw.cwsp || snap.cwsp);

    const bridge = asRecord(raw.bridge || snap.bridge || asRecord(raw.core).bridge);
    const shellRaw: SettingsBlob = {
        ...asRecord(cwspFlat),
        ...asRecord(raw.shell || snap.shell)
    };
    const coreRaw = asRecord(raw.core);

    const endpoints = Array.isArray(bridge.endpoints)
        ? bridge.endpoints.map((e) => String(e || "").trim()).filter(Boolean)
        : [];
    const endpointUrl = String(
        coreRaw.endpointUrl ||
            bridge.endpointUrl ||
            shellRaw.remoteHost ||
            shellRaw.endpointUrl ||
            cwspFlat.endpointUrl ||
            cwspFlat.endpoint ||
            cwspFlat.origin ||
            cwspFlat.gatewayUrl ||
            endpoints[0] ||
            ""
    ).trim();
    const userId = String(
        coreRaw.userId ||
            bridge.userId ||
            bridge.deviceId ||
            shellRaw.clientId ||
            shellRaw.userId ||
            cwspFlat.clientId ||
            cwspFlat.userId ||
            cwspFlat.nodeId ||
            ""
    ).trim();
    const token = String(
        coreRaw.ecosystemToken ||
            coreRaw.userKey ||
            bridge.userKey ||
            shellRaw.accessToken ||
            shellRaw.clientToken ||
            cwspFlat.accessToken ||
            cwspFlat.clientToken ||
            ""
    ).trim();
    const allowInsecureTls =
        bridge.allowInsecureTls !== undefined
            ? Boolean(bridge.allowInsecureTls)
            : coreRaw.allowInsecureTls !== undefined
              ? Boolean(coreRaw.allowInsecureTls)
              : undefined;

    const socketPrev = asRecord(coreRaw.socket);
    const core: SettingsBlob = { ...coreRaw };
    if (endpointUrl) core.endpointUrl = endpointUrl;
    if (userId) core.userId = userId;
    if (token) {
        core.userKey = token;
        core.ecosystemToken = token;
        core.socket = { ...socketPrev, accessToken: token };
    } else if (Object.keys(socketPrev).length) {
        core.socket = socketPrev;
    }
    if (allowInsecureTls !== undefined) core.allowInsecureTls = allowInsecureTls;
    if (core.preferBackendSync === undefined) core.preferBackendSync = true;

    if (endpointUrl && !shellRaw.remoteHost) shellRaw.remoteHost = endpointUrl;
    if (userId && !shellRaw.clientId) shellRaw.clientId = userId;

    const control = asRecord(body.control);
    const out: SettingsBlob = { ...raw, core, shell: { ...shellRaw } };
    if (Object.keys(control).length) out.control = control;
    return out;
}

/**
 * Resolve Neutralino control-RPC auth.
 *
 * Probes in order:
 *   1. explicit argument
 *   2. `globalThis.__NEUTRALINO_AUTH__` (injected by the Neutralino shell/host)
 *   3. Neutralino `NL_*` globals (`NL_PORT` + `NL_KEY`/`NL_TOKEN`)
 *
 * Returns `{ port, key? }` usable for `/service/config` X-API-Key calls, or null
 * when no Neutralino surface is present (browser fallback).
 */
export function readNeutralinoAuth(explicit?: NeutralinoAuth | null): NeutralinoAuth | null {
    if (explicit && typeof explicit.port === "number") return explicit;
    try {
        const g = globalThis as unknown as {
            __NEUTRALINO_AUTH__?: NeutralinoAuth;
            NL_PORT?: number | string;
            NL_KEY?: string;
            NL_TOKEN?: string;
        };
        const injected = g.__NEUTRALINO_AUTH__;
        if (injected && typeof injected.port === "number") return injected;
        // COMPAT: Neutralino exposes NL_PORT (server port) and NL_TOKEN (native API
        // token) as globals; reuse them as the control-RPC endpoint + X-API-Key when
        // no explicit __NEUTRALINO_AUTH__ was injected.
        const rawPort = g.NL_PORT;
        const port = typeof rawPort === "number" ? rawPort : rawPort ? Number(rawPort) : NaN;
        if (Number.isFinite(port)) {
            const key = g.NL_KEY ?? g.NL_TOKEN;
            return { port, key: typeof key === "string" ? key : undefined };
        }
    } catch {
        /* ignore */
    }
    return null;
}

/**
 * Fetch the canonical CWSP control RPC (`/service/config`) with `X-API-Key`.
 * WHY: WebNative and Neutralino share this endpoint for settings:get/patch —
 * the previous implementation hit `/neutralino/config` for both arms, which was
 * incorrect for the WebNative/CWSP contract.
 */
async function serviceConfigFetch<T>(
    auth: WebnativeAuth | NeutralinoAuth,
    init?: RequestInit
): Promise<T | null> {
    try {
        // INVARIANT: Neutralino Control RPC is :29110. Hub :8434 ≠ settings SoT unless Capacitor.
        let port = typeof auth.port === "number" && auth.port > 0 ? auth.port : 29110;
        if (port === 8434) {
            const key = String(auth.key || "");
            const looksCapacitorKey = Boolean(key) && key !== "cwsp-neutralino-local";
            if (!looksCapacitorKey) port = 29110;
        }
        const headers = new Headers(init?.headers);
        headers.set("Content-Type", "application/json");
        if (auth.key) headers.set("X-API-Key", auth.key);
        const timeoutMs = 2000;
        const signal =
            init?.signal ??
            (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
                ? AbortSignal.timeout(timeoutMs)
                : undefined);
        const fetchInit: RequestInit & { targetAddressSpace?: string } = {
            ...init,
            headers,
            cache: "no-store",
            signal,
            mode: "cors",
            credentials: "omit",
            targetAddressSpace: "loopback"
        };
        const res = await fetch(`http://127.0.0.1:${port}/service/config`, fetchInit as RequestInit);
        if (!res.ok) return null;
        const body = (await res.json()) as T & { control?: { surface?: string } };
        if (port === 8434) {
            const surface = body && typeof body === "object" ? body.control?.surface : undefined;
            if (surface !== "capacitor-android") return null;
        }
        return body as T;
    } catch {
        return null;
    }
}

/**
 * Fetch Neutralino shell metadata (`/neutralino/config`).
 * Used only by the dual Neutralino arm to surface applicationId/modes/etc.
 */
async function neutralinoConfigFetch<T>(
    auth: WebnativeAuth | NeutralinoAuth,
    init?: RequestInit
): Promise<T | null> {
    try {
        const headers = new Headers(init?.headers);
        headers.set("Content-Type", "application/json");
        if (auth.key) headers.set("X-API-Key", auth.key);
        const res = await fetch(`http://127.0.0.1:${auth.port}/neutralino/config`, {
            ...init,
            headers,
            cache: "no-store"
        });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

/**
 * Build a settings sync arm that talks to the Node `/service/config` control RPC.
 * Returns null when auth is unavailable (caller may fall back to memory/IDB).
 */
export function createWebnativeSettingsArm(
    auth?: WebnativeAuth | NeutralinoAuth | null
): SettingsSyncArmLike | null {
    const resolved = readAuth(auth);
    if (!resolved) return null;

    return {
        get: async () => {
            const body = await serviceConfigFetch<{
                settings?: SettingsBlob;
                portable?: SettingsBlob;
                snapshot?: SettingsBlob;
            }>(resolved, { method: "GET" });
            return normalizeServiceConfigToAppSettings(body);
        },
        patch: async (patch) => {
            const body = await serviceConfigFetch<{
                settings?: SettingsBlob;
                portable?: SettingsBlob;
                snapshot?: SettingsBlob;
            }>(resolved, { method: "POST", body: JSON.stringify(patch) });
            return normalizeServiceConfigToAppSettings(body);
        },
        defaults: async () => {
            const body = await serviceConfigFetch<{ defaults?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.defaults ?? {};
        },
        snapshot: async () => {
            const body = await serviceConfigFetch<{ snapshot?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.snapshot ?? {};
        }
    };
}

/**
 * Dual Neutralino settings arm.
 *
 * WHY: Neutralino shells need both CWSP settings (via `/service/config`, same
 * contract as WebNative) and Neutralino shell metadata (applicationId/modes/
 * nativeAllowList via `/neutralino/config`). `get()` merges both — CWSP settings
 * are the primary blob and shell metadata is nested under `neutralino` so views
 * can read it without clobbering CWSP keys. `patch()` posts to `/service/config`.
 *
 * Returns null when no Neutralino auth is resolvable (browser fallback).
 */
export function createNeutralinoSettingsArm(
    auth?: NeutralinoAuth | null
): SettingsSyncArmLike | null {
    const resolved = readNeutralinoAuth(auth);
    if (!resolved) return null;
    return {
        get: async () => {
            const [cwsp, shell] = await Promise.all([
                serviceConfigFetch<{
                    settings?: SettingsBlob;
                    portable?: SettingsBlob;
                    snapshot?: SettingsBlob;
                }>(resolved, { method: "GET" }),
                neutralinoConfigFetch<{ config?: NeutralinoAuth }>(resolved, { method: "GET" })
            ]);
            const cwspSettings = normalizeServiceConfigToAppSettings(cwsp);
            const shellMeta = shell?.config ?? {};
            return { ...cwspSettings, neutralino: shellMeta };
        },
        patch: async (patch) => {
            const body = await serviceConfigFetch<{
                settings?: SettingsBlob;
                portable?: SettingsBlob;
                snapshot?: SettingsBlob;
            }>(resolved, { method: "POST", body: JSON.stringify(patch) });
            return normalizeServiceConfigToAppSettings(body);
        },
        defaults: async () => {
            const body = await serviceConfigFetch<{ defaults?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.defaults ?? {};
        },
        snapshot: async () => {
            const body = await serviceConfigFetch<{ snapshot?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.snapshot ?? {};
        }
    };
}

/** Mark the WebNative surface so settings-sync-adapter resolves the webnative arm. */
export function markNeutralinoBoot(): void {
    try {
        (globalThis as unknown as { __CWS_NEUTRALINO_BOOT__?: boolean }).__CWS_NEUTRALINO_BOOT__ = true;
    } catch {
        /* ignore */
    }
}


export function markWebnativeBoot(): void {
    try {
        (globalThis as unknown as { __CWS_WEBNATIVE_BOOT__?: boolean }).__CWS_WEBNATIVE_BOOT__ = true;
    } catch {
        /* ignore */
    }
}