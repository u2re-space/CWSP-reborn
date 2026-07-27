/*
 * Filename: settings-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/gateway/web/settings-bridge.ts
 * Change date and time: 14.47.00_17.07.2026
 * Reason for changes: Same-origin BFF arm for settings:get/patch so Settings UI
 *   prefills and persists against core-settings on the gateway host.
 */

import type { SettingsSyncArm } from "../../webnative/web/settings/ts/settings-sync-adapter";

export type GatewaySettingsBlob = Record<string, unknown>;

const gatewayFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
        ...init,
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json",
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...init?.headers
        }
    });
    if (response.status === 401) {
        window.location.assign("/");
        throw new Error("Gateway session expired");
    }
    if (!response.ok) throw new Error(`Gateway settings request failed (${response.status})`);
    return (await response.json()) as T;
};

export const createGatewaySettingsArm = (): SettingsSyncArm => ({
    get: async () => {
        const body = await gatewayFetch<{ settings?: GatewaySettingsBlob }>("/gateway/api/settings");
        return body.settings || {};
    },
    patch: async (patch) => {
        const body = await gatewayFetch<{ settings?: GatewaySettingsBlob }>("/gateway/api/settings", {
            method: "PATCH",
            body: JSON.stringify(patch)
        });
        return body.settings || {};
    }
});

