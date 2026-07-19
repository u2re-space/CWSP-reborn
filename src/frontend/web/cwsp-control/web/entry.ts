/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/entry.ts
 * Change date and time: 22.05.00_19.07.2026
 * Reason for changes: /cwsp shares Neutralino Node /service/config SoT (auto-probe bridge).
 */

import { bootMinimal } from "boot/BootLoader";
import {
    createSharedControlSettingsArm,
    markNeutralinoBoot,
    markWebnativeBoot,
    normalizeServiceConfigToAppSettings
} from "./settings-bridge";
import {
    applyConnectionGlobals,
    bindConnectionSourceOpener,
    bridgeFetch,
    loadConnectionSource,
    probeBridgeLive,
    saveConnectionSource,
    sourceToAppSettingsCore,
    type ConnectionSource
} from "./connection-source";
import {
    registerSettingsSyncArm,
    setSurfaceDetector,
    type SettingsSyncArm
} from "./settings/ts/settings-sync-adapter";

const enabledViews = ["minimal", "network", "settings"] as const;

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");
document.documentElement.dataset.cwspSurface = "cwsp-control";

try {
    (globalThis as unknown as { __CWS_SKIP_PWA__?: boolean }).__CWS_SKIP_PWA__ = true;
    const m = String(location.pathname || "").match(/^(\/cwsp)(?:\/|$)/i);
    if (m) document.documentElement.dataset.cwspRouterBase = m[1].toLowerCase();
} catch {
    /* ignore */
}

const setBridgeStatus = (live: boolean): void => {
    try {
        document.documentElement.dataset.cwspBridge = live ? "live" : "offline";
        const btn = document.querySelector("[data-connection-source]") as HTMLButtonElement | null;
        if (btn) {
            btn.textContent = live ? "SYNC" : "SRC";
            btn.title = live
                ? "Neutralino bridge live — settings sync via /service/config"
                : "Neutralino offline — open to connect bridge (localhost:29110)";
            btn.dataset.bridgeLive = live ? "1" : "0";
        }
    } catch {
        /* ignore */
    }
};

async function hydrateFromBridge(source: ConnectionSource): Promise<ConnectionSource> {
    try {
        const res = await bridgeFetch(source, "/service/config");
        if (!res.ok) return source;
        const body = (await res.json()) as {
            settings?: Record<string, unknown>;
            portable?: Record<string, unknown>;
            snapshot?: Record<string, unknown>;
        };
        const settings = normalizeServiceConfigToAppSettings(body);
        const core = (settings.core || {}) as Record<string, unknown>;
        const shell = (settings.shell || {}) as Record<string, unknown>;
        const bridge = (settings.bridge || {}) as Record<string, unknown>;
        const fromPortable =
            String(core.endpointUrl || shell.remoteHost || bridge.endpointUrl || "").trim();
        const next: ConnectionSource = {
            ...source,
            mode: "bridge",
            // Prefer Neutralino portable gateway; keep SRC when portable has no relay yet.
            endpointUrl: fromPortable || source.endpointUrl,
            userId: String(core.userId || source.userId || "").trim(),
            userKey: String(core.userKey || core.ecosystemToken || source.userKey || "")
        };
        saveConnectionSource(next);
        return next;
    } catch {
        return source;
    }
}

async function hydrateAirpad(source: ConnectionSource): Promise<void> {
    try {
        const { syncAirpadRemoteConfigFromAppSettings } = await import("views/airpad/config/config");
        syncAirpadRemoteConfigFromAppSettings(
            {
                core: {
                    endpointUrl: source.endpointUrl,
                    userId: source.userId,
                    userKey: source.userKey,
                    ecosystemToken: source.userKey
                }
            } as never,
            { persist: true }
        );
    } catch (error) {
        console.warn("[CWSP Control] airpad hydrate skipped", error);
    }
}

async function seedAppSettingsFromSource(source: ConnectionSource): Promise<void> {
    try {
        const { loadSettings, saveSettings } = await import("com/config/Settings");
        const current = await loadSettings();
        const corePatch = sourceToAppSettingsCore(source) as Record<string, unknown>;
        const existingEp = String((current.core as { endpointUrl?: string } | undefined)?.endpointUrl || "").trim();
        const sourceEp = String(corePatch.endpointUrl || "").trim();
        const sourceIsLoopback = /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(sourceEp);
        const existingIsNonLoopback =
            Boolean(existingEp) &&
            !/^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(existingEp);
        // WHY: factory SRC default 127.0.0.1:8434 must not clobber a saved WAN gateway in IDB.
        if (existingIsNonLoopback && sourceIsLoopback) {
            corePatch.endpointUrl = existingEp;
        } else if (!sourceEp && existingEp) {
            corePatch.endpointUrl = existingEp;
        }
        await saveSettings({
            ...current,
            core: {
                ...(current.core || {}),
                ...corePatch,
                preferBackendSync: true
            }
        } as never);
    } catch (error) {
        console.warn("[CWSP Control] settings IDB seed skipped", error);
    }
}

function registerArm(source: ConnectionSource, bridgeLive: boolean): void {
    applyConnectionGlobals(source, { bridgeLive });
    try {
        if (bridgeLive) {
            markNeutralinoBoot();
            markWebnativeBoot();
        }
        setSurfaceDetector(() => (bridgeLive ? "webnative" : "web"));
        const arm = createSharedControlSettingsArm(source, bridgeLive);
        registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
        registerSettingsSyncArm("web", arm as SettingsSyncArm);
        setBridgeStatus(bridgeLive);
    } catch (error) {
        console.warn("[CWSP Control] settings arm registration skipped", error);
    }
}

async function syncClipboardHubCredentials(source: ConnectionSource): Promise<void> {
    const live = (globalThis as unknown as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean })
        .__CWSP_CONTROL_BRIDGE_LIVE__;
    if (!live) return;
    try {
        const { getRemoteHost, getAccessToken, getAirPadClientId } = await import(
            "views/airpad/config/config"
        );
        const remoteHost = getRemoteHost().trim() || source.endpointUrl.trim();
        const accessToken = getAccessToken().trim() || source.userKey.trim();
        const clientId = getAirPadClientId().trim() || source.userId.trim();
        const body: Record<string, string | boolean> = { reload: false };
        if (remoteHost) body.remoteHost = remoteHost;
        if (accessToken) {
            body.accessToken = accessToken;
            body.clientToken = accessToken;
        }
        if (clientId) body.clientId = clientId;
        if (!Object.keys(body).filter((k) => k !== "reload").length) return;

        await bridgeFetch(source, "/service/clipboard-hub", {
            method: "POST",
            body: JSON.stringify(body)
        });
    } catch (error) {
        console.warn("[CWSP Control] clipboard-hub credential sync skipped", error);
    }
}

async function activateSource(source: ConnectionSource): Promise<{ source: ConnectionSource; bridgeLive: boolean }> {
    // Prefer Neutralino unless user locked Remote-only in SRC.
    const shouldProbe = source.mode !== "remote";
    let bridgeLive = false;
    let next = source;
    if (shouldProbe) {
        bridgeLive = await probeBridgeLive({ ...source, mode: "bridge" });
        if (bridgeLive) {
            next = await hydrateFromBridge({ ...source, mode: "bridge" });
            next = { ...next, mode: "bridge" };
            saveConnectionSource(next);
        } else if (source.mode === "bridge") {
            console.warn(
                "[CWSP Control] Neutralino bridge offline — settings stay local until desk app + PNA allow localhost:29110"
            );
        }
    }
    registerArm(next, bridgeLive);
    await seedAppSettingsFromSource(next);
    await hydrateAirpad(next);
    await syncClipboardHubCredentials(next);
    document.documentElement.dataset.cwspControlMode = bridgeLive ? "bridge" : "remote";
    setBridgeStatus(bridgeLive);
    return { source: next, bridgeLive };
}

async function onSourceSaved(source: ConnectionSource): Promise<void> {
    await activateSource(source);
}

async function boot(): Promise<void> {
    const initial = loadConnectionSource();
    bindConnectionSourceOpener(onSourceSaved);
    await activateSource(initial);

    await bootMinimal(document.body, "network");
    try {
        document.getElementById("cwsp-control-boot")?.remove();
    } catch {
        /* ignore */
    }

    // Re-apply toolbar label after shell mount.
    setBridgeStatus(
        Boolean((globalThis as unknown as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean }).__CWSP_CONTROL_BRIDGE_LIVE__)
    );

    // Background re-probe: desk Neutralino may start after the tab.
    if (initial.mode !== "remote") {
        const tick = async () => {
            const src = loadConnectionSource();
            if (src.mode === "remote") return;
            const live = await probeBridgeLive({ ...src, mode: "bridge" });
            const wasLive = Boolean(
                (globalThis as unknown as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean }).__CWSP_CONTROL_BRIDGE_LIVE__
            );
            if (live && !wasLive) {
                console.log("[CWSP Control] Neutralino bridge became live — switching settings SoT");
                await activateSource({ ...src, mode: "bridge" });
            } else {
                setBridgeStatus(live);
            }
        };
        window.setTimeout(() => void tick(), 2500);
        window.setInterval(() => void tick(), 15000);
    }
}

void boot().catch((error: unknown) => {
    console.error("[CWSP Control] minimal-shell boot failed", error);
    try {
        const el = document.getElementById("cwsp-control-boot");
        if (el) {
            el.textContent = `CWSP Control boot failed: ${
                error instanceof Error ? error.message : String(error)
            }`;
        }
    } catch {
        /* ignore */
    }
});
