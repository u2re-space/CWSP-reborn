/*
 * Filename: settings-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/settings-bridge.ts
 * Change date and time: 22.05.00_19.07.2026
 * Reason for changes: Shared Neutralino /service/config SoT for /cwsp ↔ desk WebView.
 */

import {
    normalizeServiceConfigToAppSettings,
    type SettingsBlob,
    type SettingsPatch,
    type SettingsSyncArmLike
} from "../../neutralino/web/settings-bridge";
import {
    applyConnectionGlobals,
    bridgeFetch,
    loadConnectionSource,
    saveConnectionSource,
    sourceToAppSettingsCore,
    type ConnectionSource
} from "./connection-source";

export {
    normalizeServiceConfigToAppSettings,
    markNeutralinoBoot,
    markWebnativeBoot,
    type SettingsBlob,
    type SettingsPatch,
    type SettingsSyncArmLike,
    type NeutralinoAuth,
    type WebnativeAuth
} from "../../neutralino/web/settings-bridge";

async function serviceConfigViaSource<T>(
    source: ConnectionSource,
    init?: RequestInit
): Promise<T | null> {
    try {
        const res = await bridgeFetch(source, "/service/config", init);
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

/** Mirror portable.core fields back into SRC localStorage so UI stays aligned. */
const mirrorCoreIntoConnectionSource = (
    source: ConnectionSource,
    settings: SettingsBlob
): ConnectionSource => {
    const core = (settings.core || {}) as Record<string, unknown>;
    const fromCore = String(core.endpointUrl || "").trim();
    const fromShell = String((settings.shell as { remoteHost?: string } | undefined)?.remoteHost || "").trim();
    const fromBridge = String((settings.bridge as { endpointUrl?: string } | undefined)?.endpointUrl || "").trim();
    const nextEp = fromCore || fromShell || fromBridge || source.endpointUrl;
    const next: ConnectionSource = {
        ...source,
        endpointUrl: nextEp,
        userId: String(core.userId || source.userId || "").trim(),
        userKey: String(core.userKey || core.ecosystemToken || source.userKey || "")
    };
    saveConnectionSource(next);
    return next;
};

/** Offline / remote-only arm — browser localStorage SRC (not Neutralino SoT). */
export function createRemoteControlSettingsArm(
    source?: ConnectionSource | null
): SettingsSyncArmLike {
    let current = source || loadConnectionSource();
    return {
        get: async () => {
            current = loadConnectionSource();
            const core = sourceToAppSettingsCore(current) as Record<string, unknown>;
            // WHY: empty/missing relay must not inject factory loopback over IDB during hydrate merge.
            if (!String(current.endpointUrl || "").trim()) {
                delete core.endpointUrl;
            }
            return { core };
        },
        patch: async (patch: SettingsPatch) => {
            const core = (patch.core || {}) as Record<string, unknown>;
            const nextEp = String(core.endpointUrl ?? current.endpointUrl ?? "").trim();
            current = {
                ...current,
                endpointUrl: nextEp || current.endpointUrl,
                userId: String(core.userId ?? current.userId),
                userKey: String(core.userKey ?? core.ecosystemToken ?? current.userKey)
            };
            applyConnectionGlobals(current, { bridgeLive: false });
            saveConnectionSource(current);
            return { core: sourceToAppSettingsCore(current) };
        },
        defaults: async () => ({ core: sourceToAppSettingsCore(current) }),
        snapshot: async () => ({ core: sourceToAppSettingsCore(current) })
    };
}

/**
 * Neutralino Node `/service/config` arm — same contract as desk WebView.
 * INVARIANT: shared SoT with Neutralino portable backend when bridge is live.
 */
export function createBridgeControlSettingsArm(
    source?: ConnectionSource | null
): SettingsSyncArmLike | null {
    let resolved = source || loadConnectionSource();
    if (!resolved.port) return null;
    applyConnectionGlobals(resolved, { bridgeLive: true });

    return {
        get: async () => {
            const body = await serviceConfigViaSource<{
                settings?: SettingsBlob;
                portable?: SettingsBlob;
                snapshot?: SettingsBlob;
            }>(resolved, { method: "GET" });
            const settings = normalizeServiceConfigToAppSettings(body);
            if (Object.keys(settings).length) {
                resolved = mirrorCoreIntoConnectionSource(resolved, settings);
                applyConnectionGlobals(resolved, { bridgeLive: true });
            }
            return settings;
        },
        patch: async (patch: SettingsPatch) => {
            // WHY: mirror AppSettings.core → portable shell/bridge so Node clipboard-hub
            // dials core.endpointUrl (e.g. https://45.147.121.152:8434/).
            const core = (patch.core || {}) as Record<string, unknown>;
            const endpointUrl = String(core.endpointUrl || "").trim();
            const userId = String(core.userId || "").trim();
            const token = String(core.userKey || core.ecosystemToken || "").trim();
            const expanded: SettingsPatch = { ...patch };
            if (endpointUrl || userId || token) {
                expanded.bridge = {
                    ...((patch.bridge || {}) as Record<string, unknown>),
                    ...(endpointUrl ? { endpointUrl } : {}),
                    ...(userId ? { userId } : {}),
                    ...(token ? { userKey: token } : {})
                };
                expanded.shell = {
                    ...((patch.shell || {}) as Record<string, unknown>),
                    ...(endpointUrl ? { remoteHost: endpointUrl } : {}),
                    ...(userId ? { clientId: userId, userId } : {}),
                    ...(token ? { accessToken: token, clientToken: token } : {})
                };
            }
            const body = await serviceConfigViaSource<{
                settings?: SettingsBlob;
                portable?: SettingsBlob;
                snapshot?: SettingsBlob;
            }>(resolved, { method: "POST", body: JSON.stringify(expanded) });
            const settings = normalizeServiceConfigToAppSettings(body);
            if (Object.keys(settings).length) {
                resolved = mirrorCoreIntoConnectionSource(resolved, settings);
            }
            // Nudge hub reconnect — Neutralino Node only (Capacitor Control has no clipboard-hub).
            if (endpointUrl && Number(resolved.port) === 29110) {
                try {
                    await bridgeFetch(resolved, "/service/clipboard-hub", {
                        method: "POST",
                        body: JSON.stringify({
                            remoteHost: endpointUrl,
                            ...(token
                                ? { accessToken: token, clientToken: token }
                                : {}),
                            ...(userId ? { clientId: userId } : {}),
                            reload: true
                        })
                    });
                } catch {
                    /* hub optional */
                }
            }
            return settings;
        },
        defaults: async () => {
            const body = await serviceConfigViaSource<{ defaults?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.defaults ?? {};
        },
        snapshot: async () => {
            const body = await serviceConfigViaSource<{ snapshot?: SettingsBlob }>(resolved, {
                method: "GET"
            });
            return body?.snapshot ?? {};
        }
    };
}

/**
 * Prefer Neutralino when live; otherwise SRC/local fallback.
 * WHY: /cwsp and Neutralino WebView must edit the same portable.config.
 */
export function createSharedControlSettingsArm(
    source: ConnectionSource,
    bridgeLive: boolean
): SettingsSyncArmLike {
    if (bridgeLive) {
        const bridge = createBridgeControlSettingsArm(source);
        if (bridge) return bridge;
    }
    return createRemoteControlSettingsArm(source);
}

/** @deprecated */
export function createCwspControlSettingsArm(
    source?: ConnectionSource | null
): SettingsSyncArmLike | null {
    const resolved = source || loadConnectionSource();
    return createSharedControlSettingsArm(resolved, resolved.mode === "bridge");
}
