/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/gateway/web/entry.ts
 * Change date and time: 22.10.00_19.07.2026
 * Reason for changes: Skip PWA sw.js probes on gateway SPA (no worker shipped → 404 spam).
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

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");
document.documentElement.dataset.cwspSurface = "gateway";
try {
    // WHY: gateway static shell has no sw.js / apps/cw/sw.js — BootLoader must not probe.
    (globalThis as unknown as { __CWS_SKIP_PWA__?: boolean }).__CWS_SKIP_PWA__ = true;
} catch {
    /* ignore */
}

const boot = async (): Promise<void> => {
    const session = await getGatewaySession();
    if (!session.authenticated) {
        const next = `${window.location.pathname}${window.location.search || ""}`;
        const suffix = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
        window.location.replace(`/${suffix}`);
        return;
    }

    // INVARIANT: surface must resolve to `web` so resolveSettingsSyncArm() hits this arm.
    // NOTE: cwspSurface=gateway is for BootLoader/PWA skip only — sync arm stays on "web".
    setSurfaceDetector(() => "web");
    registerSettingsSyncArm("web", createGatewaySettingsArm() as SettingsSyncArm);
    await bootMinimal(document.body, "network");
};

void boot().catch((error: unknown) => {
    console.error("[CWSP Gateway] shell boot failed", error);
});

