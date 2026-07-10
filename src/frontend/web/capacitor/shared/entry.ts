/*
 * Filename: entry.ts
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/frontend/web/capacitor/shared/entry.ts
 * Change date and time: 14.18.00_10.07.2026
 * Reason for changes: Provide the static Capacitor minimal-shell bootstrap entrypoint.
 */

import { bootMinimal } from "boot/BootLoader";

const enabledViews = ["minimal", "network", "settings", "airpad"] as const;

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

void bootMinimal(document.body, "network").catch((error: unknown) => {
    console.error("[CWSP Capacitor] minimal-shell boot failed", error);
});
