/*
 * Filename: settings-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/settings-bridge.ts
 * Change date and time: 16.17.00_11.07.2026
 * Reason for changes: Pass-III — fix CWSP arm to hit /service/config (not /neutralino/config),
 *   add dual Neutralino arm (CWSP settings via /service/config + shell metadata via /neutralino/config),
 *   add readNeutralinoAuth() that probes __NEUTRALINO_AUTH__ and NL_* globals.
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
        const g = globalThis as unknown as { __WEBNATIVE_AUTH__?: WebnativeAuth | NeutralinoAuth };
        const auth = g.__WEBNATIVE_AUTH__;
        if (auth && typeof auth.port === "number") return auth;
    } catch {
        /* ignore */
    }
    return null;
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
        const headers = new Headers(init?.headers);
        headers.set("Content-Type", "application/json");
        if (auth.key) headers.set("X-API-Key", auth.key);
        const res = await fetch(`http://127.0.0.1:${auth.port}/service/config`, {
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
            const body = await serviceConfigFetch<{ settings?: SettingsBlob; portable?: SettingsBlob }>(
                resolved,
                { method: "GET" }
            );
            return body?.settings ?? body?.portable ?? {};
        },
        patch: async (patch) => {
            const body = await serviceConfigFetch<{ settings?: SettingsBlob; portable?: SettingsBlob }>(
                resolved,
                { method: "POST", body: JSON.stringify(patch) }
            );
            return body?.settings ?? body?.portable ?? {};
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
                serviceConfigFetch<{ settings?: SettingsBlob; portable?: SettingsBlob }>(
                    resolved,
                    { method: "GET" }
                ),
                neutralinoConfigFetch<{ config?: NeutralinoAuth }>(resolved, { method: "GET" })
            ]);
            const cwspSettings = cwsp?.settings ?? cwsp?.portable ?? {};
            const shellMeta = shell?.config ?? {};
            return { ...cwspSettings, neutralino: shellMeta };
        },
        patch: async (patch) => {
            const body = await serviceConfigFetch<{ settings?: SettingsBlob; portable?: SettingsBlob }>(
                resolved,
                { method: "POST", body: JSON.stringify(patch) }
            );
            return body?.settings ?? body?.portable ?? {};
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