/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/entry.ts
 * Change date and time: 16.17.00_11.07.2026
 * Reason for changes: Pass-III — mark Neutralino boot surface and register the settings
 *   sync arm (WebNative/Neutralino /service/config) when backend auth is present.
 */

import { bootMinimal } from "boot/BootLoader";
import {
    createWebnativeSettingsArm,
    createNeutralinoSettingsArm,
    readNeutralinoAuth,
    markNeutralinoBoot,
    markWebnativeBoot,
    type NeutralinoAuth
} from "./settings-bridge";
import {
    registerSettingsSyncArm,
    type SettingsSyncArm
} from "./settings/ts/settings-sync-adapter";

const enabledViews = ["minimal", "network", "settings"] as const;

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

// WHY: Neutralino reuses the WebNative settings surface (same /service/config
// control-RPC contract), so both boot flags are marked. The settings-sync-adapter
// detects `__CWS_WEBNATIVE_BOOT__` and resolves the arm registered below.
markNeutralinoBoot();
markWebnativeBoot();

// Try to register a backend settings arm when auth is present. No auth → the
// view falls back to IDB/memory (no regression for pure-web dev).
try {
    const neutralinoAuth: NeutralinoAuth | null = readNeutralinoAuth();
    if (neutralinoAuth) {
        const arm = createNeutralinoSettingsArm(neutralinoAuth);
        if (arm) registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
    } else {
        const arm = createWebnativeSettingsArm();
        if (arm) registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
    }
} catch (error) {
    console.warn("[CWSP] settings arm registration skipped", error);
}

void bootMinimal(document.body, "network").catch((error: unknown) => {
    console.error("[CWSP Neutralino] minimal-shell boot failed", error);
});
