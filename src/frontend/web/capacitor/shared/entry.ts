/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/capacitor/shared/entry.ts
 * Change date and time: 18.25.00_10.07.2026
 * Reason for changes: Visible boot-failure UI so WebView errors are not a silent black screen.
 */

import { bootMinimal } from "boot/BootLoader";

/** Capacitor contour: minimal shell + network/settings/airpad (debug is capture-only, not a view). */
const enabledViews = ["minimal", "network", "settings", "airpad"] as const;

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

function showBootFailure(error: unknown): void {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error("[CWSP Capacitor] minimal-shell boot failed", error);
    const root = document.body;
    root.replaceChildren();
    root.style.cssText =
        "margin:0;padding:16px;font:14px/1.4 ui-monospace,monospace;background:#111;color:#f66;white-space:pre-wrap;";
    root.textContent = `[CWSP Capacitor] boot failed\n\n${message}`;
}

void bootMinimal(document.body, "network").catch(showBootFailure);
