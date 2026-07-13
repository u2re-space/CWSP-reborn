/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/entry.ts
 * Change date and time: 15.10.00_13.07.2026
 * Reason for changes: Boot-time clipboard-hub credential sync (parity with Neutralino entry).
 */

import { bootMinimal } from "boot/BootLoader";
import {
    createWebnativeSettingsArm,
    createNeutralinoSettingsArm,
    readNeutralinoAuth,
    markNeutralinoBoot,
    markWebnativeBoot,
    type NeutralinoAuth
} from "settings-bridge";
import {
    registerSettingsSyncArm,
    type SettingsSyncArm
} from "./settings/ts/settings-sync-adapter";

const enabledViews = ["minimal", "network", "settings"] as const;

/** Loopback defaults shared with extNode / backend (CWSP_CONTROL_*). */
const DEFAULT_CONTROL_PORT = 18765;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

// WHY: Neutralino reuses the WebNative settings surface (same /service/config
// control-RPC contract), so both boot flags are marked. The settings-sync-adapter
// detects `__CWS_WEBNATIVE_BOOT__` and resolves the arm registered below.
markNeutralinoBoot();
markWebnativeBoot();

function applyAuthGlobals(auth: { port: number; key: string }): NeutralinoAuth {
    const shaped: NeutralinoAuth = { port: auth.port, key: auth.key };
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: { port: number; key: string };
        __NEUTRALINO_AUTH__?: NeutralinoAuth;
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
        __CWS_NODE_CLIPBOARD_HUB__?: boolean;
    };
    g.__WEBNATIVE_AUTH__ = { port: auth.port, key: auth.key };
    g.__NEUTRALINO_AUTH__ = shaped;
    g.__CWS_WEBNATIVE_BOOT__ = true;
    g.__CWS_NEUTRALINO_BOOT__ = true;
    // WHY: WebView must not own LAN clipboard — Node clipboard-hub does.
    g.__CWS_NODE_CLIPBOARD_HUB__ = true;
    return shaped;
}

function initialAuth(): { port: number; key: string } {
    const fromGlobals = readNeutralinoAuth();
    if (fromGlobals && typeof fromGlobals.port === "number") {
        return {
            port: fromGlobals.port,
            key: String(fromGlobals.key || DEFAULT_CONTROL_KEY)
        };
    }
    try {
        const g = globalThis as unknown as { __WEBNATIVE_AUTH__?: { port?: number; key?: string } };
        if (g.__WEBNATIVE_AUTH__ && typeof g.__WEBNATIVE_AUTH__.port === "number") {
            return {
                port: g.__WEBNATIVE_AUTH__.port,
                key: String(g.__WEBNATIVE_AUTH__.key || DEFAULT_CONTROL_KEY)
            };
        }
    } catch {
        /* ignore */
    }
    return { port: DEFAULT_CONTROL_PORT, key: DEFAULT_CONTROL_KEY };
}

/**
 * Push AirPad/Network credentials into Node clipboard-hub on cold boot.
 * WHY: Settings Save already does this; without boot sync the hub stays tokenless.
 */
async function syncClipboardHubCredentials(auth: { port: number; key: string }): Promise<void> {
    try {
        const { getRemoteHost, getAccessToken, getAirPadClientId } = await import(
            "views/airpad/config/config"
        );
        const remoteHost = getRemoteHost().trim();
        const accessToken = getAccessToken().trim();
        const clientId = getAirPadClientId().trim();
        const body: Record<string, string> = {};
        if (remoteHost) body.remoteHost = remoteHost;
        if (accessToken) {
            body.accessToken = accessToken;
            body.clientToken = accessToken;
        }
        if (clientId) body.clientId = clientId;
        if (!Object.keys(body).length) return;
        const ctrl =
            typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
                ? AbortSignal.timeout(2000)
                : undefined;
        await fetch(`http://127.0.0.1:${auth.port}/service/clipboard-hub`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": auth.key
            },
            body: JSON.stringify(body),
            cache: "no-store",
            signal: ctrl
        });
    } catch (error) {
        console.warn("[CWSP WebNative] clipboard-hub credential sync skipped", error);
    }
}

function registerArm(auth: NeutralinoAuth): void {
    try {
        const arm = createNeutralinoSettingsArm(auth);
        if (arm) registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
    } catch (error) {
        console.warn("[CWSP WebNative] Neutralino settings arm skipped", error);
        try {
            const fallback = createWebnativeSettingsArm();
            if (fallback) registerSettingsSyncArm("webnative", fallback as SettingsSyncArm);
        } catch (inner) {
            console.warn("[CWSP WebNative] settings arm registration skipped", inner);
        }
    }
}

/**
 * Wait briefly for Node control host (extNode / backend) then hydrate + sync hub.
 */
function refreshControlAuthInBackground(): void {
    const tick = async (): Promise<void> => {
        const auth = initialAuth();
        for (let i = 0; i < 12; i++) {
            try {
                const ctrl =
                    typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
                        ? AbortSignal.timeout(800)
                        : undefined;
                const res = await fetch(`http://127.0.0.1:${auth.port}/service/config`, {
                    method: "GET",
                    headers: { "X-API-Key": auth.key },
                    cache: "no-store",
                    signal: ctrl
                });
                if (res.ok) {
                    const fromFile = applyAuthGlobals(auth);
                    registerArm(fromFile);
                    try {
                        const body = (await res.json()) as {
                            settings?: Record<string, unknown>;
                            portable?: Record<string, unknown>;
                        };
                        const settings = body.settings || body.portable || {};
                        const { syncAirpadRemoteConfigFromAppSettings } = await import(
                            "views/airpad/config/config"
                        );
                        syncAirpadRemoteConfigFromAppSettings(settings as never, {
                            persist: true
                        });
                    } catch (error) {
                        console.warn("[CWSP WebNative] airpad hydrate from portable skipped", error);
                    }
                    await syncClipboardHubCredentials(fromFile);
                    return;
                }
            } catch {
                /* retry */
            }
            await new Promise((r) => setTimeout(r, 400));
        }
        console.warn(
            "[CWSP WebNative] control host still warming — clipboard/settings will retry on use"
        );
    };
    void tick();
}

async function boot(): Promise<void> {
    const auth = applyAuthGlobals(initialAuth());
    registerArm(auth);
    refreshControlAuthInBackground();
    await bootMinimal(document.body, "network");
    // Best-effort: sync tokens after shell mounts (IndexedDB/settings may be ready).
    void syncClipboardHubCredentials(auth);
}

void boot().catch((error: unknown) => {
    console.error("[CWSP WebNative] minimal-shell boot failed", error);
});
