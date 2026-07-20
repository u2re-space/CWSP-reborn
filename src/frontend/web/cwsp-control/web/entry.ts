/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/entry.ts
 * Change date and time: 21.30.00_20.07.2026
 * Reason for changes: /cwsp shares Neutralino Node /service/config SoT (auto-probe bridge).
 *   2026-07-20: Gate bridgeLive on verified /service/config; public SPA surface stays "web".
 *   2026-07-20: Rotating deviceCode + Neutralino pairing for public /cwsp SPA.
 *   2026-07-20: __CWSP_ENSURE_CONTROL_FOR_SAVE__ — Settings Save pairs before Android push.
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
    isControlSpaEndpoint,
    loadConnectionSource,
    looksLikeAndroidControlTarget,
    normalizeBridgeAuth,
    probeBridgeLive,
    saveConnectionSource,
    sourceToAppSettingsCore,
    type ConnectionSource
} from "./connection-source";
import {
    armControlAuthRecovery,
    clearControlSession,
    ensureControlSession,
    setControlAuthRecoveryHandler
} from "./control-pairing";
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

async function hydrateFromBridge(
    source: ConnectionSource
): Promise<{ source: ConnectionSource; ok: boolean }> {
    try {
        const res = await bridgeFetch(source, "/service/config");
        if (!res.ok) {
            console.warn("[CWSP Control] hydrate /service/config failed", res.status);
            return { source, ok: false };
        }
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
        // WHY: Control SPA page-host must not win over empty Android Configure / portable relay.
        const relay =
            fromPortable && !isControlSpaEndpoint(fromPortable)
                ? fromPortable
                : source.endpointUrl && !isControlSpaEndpoint(source.endpointUrl)
                  ? source.endpointUrl
                  : "";
        const next: ConnectionSource = {
            ...source,
            mode: "bridge",
            // Prefer Neutralino/Android portable gateway; keep SRC when portable has no relay yet.
            endpointUrl: relay,
            userId: String(core.userId || source.userId || "").trim(),
            userKey: String(core.userKey || core.ecosystemToken || source.userKey || "")
        };
        saveConnectionSource(next);
        return { source: next, ok: true };
    } catch (error) {
        console.warn("[CWSP Control] hydrate /service/config error", error);
        return { source, ok: false };
    }
}

async function hydrateAirpad(source: ConnectionSource): Promise<void> {
    try {
        const { syncAirpadRemoteConfigFromAppSettings } = await import("views/airpad/config/config");
        const core: Record<string, unknown> = {
            endpointUrl: source.endpointUrl,
            userId: source.userId
        };
        // SECURITY: Android pairing leaves userKey empty — do not wipe AirPad tokens.
        if (source.userKey && !looksLikeAndroidControlTarget(source)) {
            core.userKey = source.userKey;
            core.ecosystemToken = source.userKey;
        }
        syncAirpadRemoteConfigFromAppSettings({ core } as never, { persist: true });
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
        const existingIsRealRelay =
            Boolean(existingEp) &&
            !/^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(existingEp) &&
            !isControlSpaEndpoint(existingEp);
        // WHY: factory SRC default 127.0.0.1:8434 / Control SPA host must not clobber a saved gateway.
        if (existingIsRealRelay && (sourceIsLoopback || isControlSpaEndpoint(sourceEp) || !sourceEp)) {
            corePatch.endpointUrl = existingEp;
        } else if (!sourceEp && existingIsRealRelay) {
            corePatch.endpointUrl = existingEp;
        } else if (sourceEp && isControlSpaEndpoint(sourceEp)) {
            delete corePatch.endpointUrl;
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
        // WHY: never mark Neutralino boot on public https SPA — that would fake a desk shell
        // and re-show loopback-only pairing UI. Real Neutralino entry sets these itself.
        try {
            const host = String(location.hostname || "");
            const publicHttps =
                location.protocol === "https:" &&
                host !== "localhost" &&
                host !== "127.0.0.1";
            if (!publicHttps && bridgeLive && via === "neutralino") {
                markNeutralinoBoot();
                markWebnativeBoot();
            }
        } catch {
            /* ignore */
        }
        // WHY: public https SPA must stay surface "web" so Settings never polls
        // loopback-only /service/pair/display (403) or shows desk pairing secrets.
        setSurfaceDetector(() => {
            try {
                const host = String(location.hostname || "");
                const publicHttps =
                    location.protocol === "https:" &&
                    host !== "localhost" &&
                    host !== "127.0.0.1";
                if (publicHttps) return "web";
            } catch {
                /* ignore */
            }
            return bridgeLive ? "webnative" : "web";
        });
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

    // Paired Control (Android / Neutralino): publicToken + live 20s deviceCode (+ Accept on phone).
    const needsPair =
        !bridgeLive &&
        ((via === "android" && discovered.androidReachable) ||
            (via === "neutralino" && discovered.neutralinoReachable) ||
            Boolean(discovered.unauthorizedHost));
    if (needsPair) {
        const label = via === "android" ? "phone" : via === "neutralino" ? "desk" : "device";
        setBootStatus(`Pairing ${label} Control ${next.host}:${next.port}…`);
        const paired = await ensureControlSession(next, {
            forceModal: true,
            onNeedDeviceCode: () => {
                setBootStatus("Enter public token + live device code from device Settings…");
            },
            onPairCode: (code) => {
                setBootStatus(
                    via === "android"
                        ? `Confirm on phone: pair ${code} (Accept notification)`
                        : `Paired (${code})`
                );
                try {
                    document.documentElement.dataset.cwspPairCode = code;
                } catch {
                    /* ignore */
                }
            }
        });
        if (paired.ok) {
            bridgeLive = true;
            setBootStatus(`Loading Control ${next.host}:${next.port} (paired + verified)…`);
        } else {
            clearControlSession();
            bridgeLive = false;
            setBootStatus(
                paired.error ||
                    (paired.denied
                        ? "Control pairing denied on device"
                        : paired.authFailed
                          ? "Session rejected — restart desk/phone Control with latest pairing build"
                          : paired.badCode
                            ? "Pairing cancelled or invalid — use device Settings → Control pairing"
                            : "Control pairing failed — Allow Control API + public token + live code")
            );
            console.warn("[CWSP Control] pairing failed", via, paired);
        }
    }

    if (bridgeLive) {
        setBootStatus(
            via === "android"
                ? `Loading Capacitor Control ${next.host}:${next.port} (phone)…`
                : via === "neutralino"
                  ? `Loading Neutralino Control ${next.host}:${next.port} (L-110)…`
                  : `Loading Control ${next.host}:${next.port}…`
        );
        const hydrated = await hydrateFromBridge({ ...next, mode: "bridge" });
        if (!hydrated.ok) {
            clearControlSession();
            bridgeLive = false;
            setBootStatus(
                "Control session not authorized (401) — re-pair after restarting Neutralino/Capacitor"
            );
            console.warn("[CWSP Control] hydrate unauthorized — not arming live bridge");
        } else {
            next = normalizeBridgeAuth({ ...hydrated.source, mode: "bridge" });
            // Never persist ecosystem / desk secrets for public pairing Control.
            if (via === "android" || via === "neutralino") {
                next = { ...next, apiKey: via === "neutralino" ? next.apiKey : "", userKey: "" };
                // Public SPA must not keep Neutralino desk key either.
                try {
                    if (location.protocol === "https:") next = { ...next, apiKey: "", userKey: "" };
                } catch {
                    next = { ...next, apiKey: "", userKey: "" };
                }
            }
            saveConnectionSource(next);
            console.log(`[CWSP Control] Control SoT via ${via} ${next.host}:${next.port}`);
        }
    } else if (via !== "android" && via !== "neutralino") {
        if (discovered.unauthorizedHost) {
            console.warn(
                `[CWSP Control] Capacitor ${discovered.unauthorizedHost}:8434 reachable — pairing required`
            );
        }
        console.warn(
            "[CWSP Control] No Control bridge — start Neutralino on L-110 (:29110) or Allow Control API on phone"
        );
        if (!document.getElementById("cwsp-control-boot")?.textContent?.includes("pairing")) {
            setBootStatus("Control offline — Neutralino :29110 or phone Allow Control API");
        }
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

    // 401/403 on /service/* → clear session and re-open pairing (debounced).
    setControlAuthRecoveryHandler(async ({ status }) => {
        setBootStatus(`Control session expired (${status}) — re-pair…`);
        clearControlSession();
        const src = loadConnectionSource();
        registerArm({ ...src, mode: "bridge" }, false, "none");
        setBridgeStatus(false, "none");
        await activateSource({ ...src, mode: "bridge" });
    });
    // Settings.ts (shared) cannot import control-pairing — listen for unauthorized events.
    globalThis.addEventListener("cwsp-control-unauthorized", ((ev: Event) => {
        const detail = (ev as CustomEvent<{ status?: number; path?: string }>).detail || {};
        void import("./control-pairing").then(({ notifyControlUnauthorized }) => {
            notifyControlUnauthorized(
                Number(detail.status) || 401,
                String(detail.path || "/service/config")
            );
        });
    }) as EventListener);

    const activated = await activateSource(bootSource);
    armControlAuthRecovery();

    // WHY: Settings Save must not claim "Node sync failed" when unpaired — open pair modal first.
    try {
        const g = globalThis as unknown as {
            __CWSP_ENSURE_CONTROL_FOR_SAVE__?: () => Promise<{ ok: boolean; error?: string }>;
        };
        g.__CWSP_ENSURE_CONTROL_FOR_SAVE__ = async () => {
            const src = loadConnectionSource();
            if (src.mode === "remote") {
                return { ok: false, error: "Control mode is remote-only — switch to Bridge" };
            }
            let next = src;
            let via = String(document.documentElement.dataset.cwspBridgeVia || "");
            const liveNow = Boolean(
                (globalThis as { __CWSP_CONTROL_BRIDGE_LIVE__?: boolean }).__CWSP_CONTROL_BRIDGE_LIVE__
            );
            if (!liveNow) {
                const discovered = await discoverControlBridge(src);
                next = discovered.source;
                via = discovered.via;
            }
            const viaNorm: "android" | "neutralino" | "saved" | "none" =
                via === "android" || via === "neutralino" || via === "saved"
                    ? via
                    : looksLikeAndroidControlTarget(next)
                      ? "android"
                      : Number(next.port) === 29110
                        ? "neutralino"
                        : "saved";
            const paired = await ensureControlSession(next, { forceModal: !liveNow });
            if (!paired.ok) {
                return {
                    ok: false,
                    error:
                        paired.error ||
                        "Pair Control first (public token + 20s code" +
                            (viaNorm === "android" ? ", then Accept on phone)" : ")")
                };
            }
            registerArm({ ...next, mode: "bridge", apiKey: "", userKey: "" }, true, viaNorm);
            setBridgeStatus(true, viaNorm);
            saveConnectionSource({ ...next, mode: "bridge", apiKey: "", userKey: "" });
            return { ok: true };
        };
    } catch {
        /* ignore */
    }

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
                if (!live) {
                    // Session died — disarm and let auth recovery / next activate re-pair.
                    registerArm(src, false, "none");
                    setBridgeStatus(false, document.documentElement.dataset.cwspBridgeVia);
                    clearControlSession();
                    await activateSource({ ...src, mode: "bridge" });
                    return;
                }
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
