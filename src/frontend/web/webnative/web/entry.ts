/*
 * Filename: entry.ts
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/frontend/web/webnative/web/entry.ts
 * Change date and time: 14.18.00_10.07.2026
 * Reason for changes: Provide the static WebNative minimal-shell bootstrap entrypoint.
 */

import { bootMinimal } from "boot/BootLoader";

const enabledViews = ["minimal", "network", "settings"] as const;

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

void bootMinimal(document.body, "network").catch((error: unknown) => {
    console.error("[CWSP WebNative] minimal-shell boot failed", error);
});
