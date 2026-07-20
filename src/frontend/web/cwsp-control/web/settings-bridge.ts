/*
 * Filename: settings-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/settings-bridge.ts
 * Change date and time: 21.25.00_20.07.2026
 * Reason for changes: Shared Control /service/config SoT for /cwsp ↔ desk/phone.
 *   2026-07-20: Strip Control SPA hosts when mirroring Relay into SRC localStorage.
 *   2026-07-20: Android Control patches must not expand ecosystem token into body.
 *   2026-07-20: POST failures throw (401 → re-pair) instead of soft-empty success.
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
    isControlSpaEndpoint,
    loadConnectionSource,
    looksLikeAndroidControlTarget,
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
    const method = String(init?.method || "GET").toUpperCase();
    const isWrite = method === "POST" || method === "PUT" || method === "PATCH";
    try {
        const res = await bridgeFetch(source, "/service/config", init);
        if (!res.ok) {
            // WHY: Save must not report success when Capacitor/Neutralino reject the session.
            if (isWrite) {
                const android = looksLikeAndroidControlTarget(source);
                if (res.status === 401 || res.status === 403) {
                    throw new Error(
                        android
                            ? "Control unauthorized — Pair again (public token + 20s code), then Accept on the phone"
                            : "Control unauthorized — Pair again (public token + 20s code from desk Control)"
                    );
                }
                throw new Error(`Control rejected settings save (HTTP ${res.status})`);
            }
            return null;
        }
        return (await res.json()) as T;
    } catch (error) {
        if (isWrite) throw error;
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
    // WHY: never persist Control SPA page-host as Relay (cwsp.u2re.space:8434).
    const pick = (...cands: string[]): string => {
        for (const c of cands) {
            if (c && !isControlSpaEndpoint(c)) return c;
        }
        return "";
    };
    const nextEp = pick(fromCore, fromShell, fromBridge, source.endpointUrl);
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
            const android = looksLikeAndroidControlTarget(resolved);
            const expanded: SettingsPatch = { ...patch };
            // SECURITY: never POST ecosystem token to Android Control — device already holds it.
            if (endpointUrl || userId || (!android && token)) {
                expanded.bridge = {
                    ...((patch.bridge || {}) as Record<string, unknown>),
                    ...(endpointUrl ? { endpointUrl } : {}),
                    ...(userId ? { userId } : {}),
                    ...(!android && token ? { userKey: token } : {})
                };
                expanded.shell = {
                    ...((patch.shell || {}) as Record<string, unknown>),
                    ...(endpointUrl ? { remoteHost: endpointUrl } : {}),
                    ...(userId ? { clientId: userId, userId } : {}),
                    ...(!android && token ? { accessToken: token, clientToken: token } : {})
                };
            }
            if (android && expanded.core && typeof expanded.core === "object") {
                const c = { ...(expanded.core as Record<string, unknown>) };
                delete c.userKey;
                delete c.ecosystemToken;
                if (c.socket && typeof c.socket === "object") {
                    const sock = { ...(c.socket as Record<string, unknown>) };
                    delete sock.accessToken;
                    delete sock.airpadAuthToken;
                    delete sock.clientAccessToken;
                    c.socket = sock;
                }
                expanded.core = c;
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
