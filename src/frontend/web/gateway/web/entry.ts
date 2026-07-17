/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/gateway/web/entry.ts
 * Change date and time: 14.47.00_17.07.2026
 * Reason for changes: Register gateway settings arm on the same views/settings
 *   adapter instance the Settings UI uses for settings:get prefill.
 */

import { bootMinimal } from "boot/BootLoader";
import {
    registerSettingsSyncArm,
    setSurfaceDetector,
    type SettingsSyncArm
} from "views/settings/ts/settings-sync-adapter";

import { getGatewaySession } from "./gateway-auth";
import { createGatewaySettingsArm } from "./settings-bridge";

const enabledViews = ["minimal", "network", "settings"] as const;

const boot = async (): Promise<void> => {
    document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");
    const session = await getGatewaySession();
    if (!session.authenticated) {
        const next = `${window.location.pathname}${window.location.search || ""}`;
        const suffix = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
        window.location.replace(`/${suffix}`);
        return;
    }

    // INVARIANT: surface must resolve to `web` so resolveSettingsSyncArm() hits this arm.
    setSurfaceDetector(() => "web");
    registerSettingsSyncArm("web", createGatewaySettingsArm() as SettingsSyncArm);
    await bootMinimal(document.body, "network");
};

void boot().catch((error: unknown) => {
    console.error("[CWSP Gateway] shell boot failed", error);
});

