/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/entry.ts
 * Change date and time: 22.05.00_19.07.2026
 * Reason for changes: /cwsp shares Neutralino Node /service/config SoT (auto-probe bridge).
 *   2026-07-19: Distinguish Android :8434 Control API auth failures from offline bridge.
 *   2026-07-19: Boot-time LNA/PNA + Capacitor :8434 fleet discovery for settings hydrate.
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
    looksLikeAndroidControlTarget,
    normalizeBridgeAuth,
    probeBridgeLive,
    saveConnectionSource,
    sourceToAppSettingsCore,
    type ConnectionSource
} from "./connection-source";
import { discoverControlBridge } from "./control-discovery";
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

const setBootStatus = (text: string): void => {
    try {
        const el = document.getElementById("cwsp-control-boot");
        if (el) el.textContent = text;
    } catch {
        /* ignore */
    }
};

const setBridgeStatus = (live: boolean, via?: string): void => {
    try {
        document.documentElement.dataset.cwspBridge = live ? "live" : "offline";
        if (via) document.documentElement.dataset.cwspBridgeVia = via;
        const btn = document.querySelector("[data-connection-source]") as HTMLButtonElement | null;
        if (btn) {
            btn.textContent = live ? "SYNC" : "SRC";
            btn.title = live
                ? via === "android"
                    ? "Android Control API live — settings from Capacitor :8434 (PNA)"
                    : "Control bridge live — settings sync via /service/config"
                : "Control offline — Allow Control API on phone, grant Local Network Access, or open SRC";
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

function registerArm(
    source: ConnectionSource,
    bridgeLive: boolean,
    via: "android" | "neutralino" | "saved" | "none" = "none"
): void {
    applyConnectionGlobals(source, { bridgeLive, via });
    try {
        // WHY: only Neutralino L-110 gets NEUTRALINO_BOOT — Capacitor L-210 must not impersonate desk.
        if (bridgeLive && via === "neutralino") {
            markNeutralinoBoot();
            markWebnativeBoot();
        }
        setSurfaceDetector(() => (bridgeLive ? "webnative" : "web"));
        const arm = createSharedControlSettingsArm(source, bridgeLive);
        registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
        registerSettingsSyncArm("web", arm as SettingsSyncArm);
        setBridgeStatus(bridgeLive, via);
    } catch (error) {
        console.warn("[CWSP Control] settings arm registration skipped", error);
    }
}

async function syncClipboardHubCredentials(source: ConnectionSource): Promise<void> {
    const live = (globalThis as unknown as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean })
        .__CWSP_CONTROL_BRIDGE_LIVE__;
    if (!live) return;
    // WHY: Capacitor Java Control API exposes /service/config only — not Node clipboard-hub.
    if (looksLikeAndroidControlTarget(source) || Number(source.port) !== 29110) return;
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
    // Remote-only: skip LNA/discovery (operator opt-out).
    if (source.mode === "remote") {
        const next = normalizeBridgeAuth(source);
        registerArm(next, false, "none");
        await seedAppSettingsFromSource(next);
        await hydrateAirpad(next);
        document.documentElement.dataset.cwspControlMode = "remote";
        setBridgeStatus(false, "none");
        return { source: next, bridgeLive: false };
    }

    setBootStatus("PNA→client Control (127.0.0.1:8434)…");
    const discovered = await discoverControlBridge(source);
    let next = discovered.source;
    let bridgeLive = discovered.live;
    let via = discovered.via;

    if (bridgeLive) {
        setBootStatus(
            via === "android"
                ? `Loading Capacitor Control ${next.host}:${next.port} (phone)…`
                : via === "neutralino"
                  ? `Loading Neutralino Control ${next.host}:${next.port} (L-110)…`
                  : `Loading Control ${next.host}:${next.port}…`
        );
        next = await hydrateFromBridge({ ...next, mode: "bridge" });
        next = normalizeBridgeAuth({ ...next, mode: "bridge" });
        saveConnectionSource(next);
        console.log(`[CWSP Control] Control SoT via ${via} ${next.host}:${next.port}`);
    } else {
        if (discovered.unauthorizedHost) {
            console.warn(
                `[CWSP Control] Capacitor ${discovered.unauthorizedHost}:8434 reachable but 401 — desk Neutralino still preferred when live`
            );
        }
        console.warn(
            "[CWSP Control] No Control bridge — start Neutralino on L-110 (:29110) or Allow Control API on phone"
        );
        setBootStatus("Control offline — Neutralino :29110 or phone Allow Control API");
    }

    registerArm(next, bridgeLive, via);
    await seedAppSettingsFromSource(next);
    await hydrateAirpad(next);
    await syncClipboardHubCredentials(next);
    document.documentElement.dataset.cwspControlMode = bridgeLive ? "bridge" : "remote";
    document.documentElement.dataset.cwspBridgeVia = via;
    setBridgeStatus(bridgeLive, via);
    return { source: next, bridgeLive };
}

async function onSourceSaved(source: ConnectionSource): Promise<void> {
    await activateSource(source);
}

async function boot(): Promise<void> {
    setBootStatus("CWSP Control — discovering Capacitor Control API (PNA)…");
    const initial = loadConnectionSource();
    // WHY: discovery should run even when legacy SRC mode was remote — public /cwsp
    // threshold always tries LNA→Android first unless user re-locks Remote after connect.
    const bootSource: ConnectionSource =
        initial.mode === "remote" && !looksLikeAndroidControlTarget(initial)
            ? { ...initial, mode: "bridge" }
            : initial;
    bindConnectionSourceOpener(onSourceSaved);
    const activated = await activateSource(bootSource);

    await bootMinimal(document.body, "network");
    try {
        document.getElementById("cwsp-control-boot")?.remove();
    } catch {
        /* ignore */
    }

    // Re-apply toolbar label after shell mount.
    setBridgeStatus(
        Boolean((globalThis as unknown as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean }).__CWSP_CONTROL_BRIDGE_LIVE__),
        document.documentElement.dataset.cwspBridgeVia
    );

    // Background re-discovery: phone Allow Control API / LNA grant may arrive after first paint.
    if (activated.source.mode !== "remote" || bootSource.mode === "bridge") {
        const tick = async () => {
            const src = loadConnectionSource();
            if (src.mode === "remote") return;
            const wasLive = Boolean(
                (globalThis as unknown as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean }).__CWSP_CONTROL_BRIDGE_LIVE__
            );
            if (wasLive) {
                const live = await probeBridgeLive({ ...src, mode: "bridge" });
                setBridgeStatus(live, document.documentElement.dataset.cwspBridgeVia);
                return;
            }
            console.log("[CWSP Control] re-discovering Control bridge (PNA / Capacitor)…");
            await activateSource({ ...src, mode: "bridge" });
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
