/*
 * Filename: settings-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/settings-bridge.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — backend-facing settings:get/patch arm for WebNative control RPC.
 */

/**
 * Thin client for the Node WebNative control host (`GET|POST /service/config`).
 *
 * WHY: the settings-view module registers a `SettingsSyncArm` at bootstrap; this
 * factory builds that arm from `globalThis.__WEBNATIVE_AUTH__` without bundling
 * Node filesystem code into the WebView.
 *
 * Backend-facing only — does not rewrite Vite entry or view modules.
 */

export type SettingsBlob = Record<string, unknown>;
export type SettingsPatch = SettingsBlob;

export interface WebnativeAuth {
    port: number;
    key: string;
}

export interface SettingsSyncArmLike {
    get(): Promise<SettingsBlob>;
    patch(patch: SettingsPatch): Promise<SettingsBlob>;
    defaults?(): Promise<SettingsBlob>;
    snapshot?(): Promise<SettingsBlob>;
}

function readAuth(explicit?: WebnativeAuth | null): WebnativeAuth | null {
    if (explicit && typeof explicit.port === "number") return explicit;
    try {
        const g = globalThis as unknown as { __WEBNATIVE_AUTH__?: WebnativeAuth };
        const auth = g.__WEBNATIVE_AUTH__;
        if (auth && typeof auth.port === "number") return auth;
    } catch {
        /* ignore */
    }
    return null;
}

async function controlFetch<T>(
    auth: WebnativeAuth,
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
 * Build a settings sync arm that talks to the Node `/service/config` control RPC.
 * Returns null when auth is unavailable (caller may fall back to memory/IDB).
 */
export function createWebnativeSettingsArm(
    auth?: WebnativeAuth | null
): SettingsSyncArmLike | null {
    const resolved = readAuth(auth);
    if (!resolved) return null;

    return {
        get: async () => {
            const body = await controlFetch<{ settings?: SettingsBlob; portable?: SettingsBlob }>(
                resolved,
                { method: "GET" }
            );
            return body?.settings ?? body?.portable ?? {};
        },
        patch: async (patch) => {
            const body = await controlFetch<{ settings?: SettingsBlob; portable?: SettingsBlob }>(
                resolved,
                { method: "POST", body: JSON.stringify(patch) }
            );
            return body?.settings ?? body?.portable ?? {};
        },
        defaults: async () => {
            const body = await controlFetch<{ defaults?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.defaults ?? {};
        },
        snapshot: async () => {
            const body = await controlFetch<{ snapshot?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.snapshot ?? {};
        }
    };
}

/** Mark the WebNative surface so settings-sync-adapter resolves the webnative arm. */
export function markWebnativeBoot(): void {
    try {
        (globalThis as unknown as { __CWS_WEBNATIVE_BOOT__?: boolean }).__CWS_WEBNATIVE_BOOT__ = true;
    } catch {
        /* ignore */
    }
}
