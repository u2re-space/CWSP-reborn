/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/capacitor/shared/entry.ts
 * Change date and time: 16.35.00_21.07.2026
 * Reason for changes: Task 6 — start the Capacitor files-hub at boot so the
 *   `cwspFilesIngress` bridge event (Task 5 staged Open-with / share-target)
 *   drives decideOfferAfterStage → pack → files:offer. WHY here: entry.ts is
 *   the Capacitor contour entry tracked in CWSP-reborn; the minimal shell's
 *   mount() lives in the shared minimal-shell repo and registers the clipboard
 *   listeners, so the files-hub is started alongside it from this contour.
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

// Task 6: files-ingress bridge → hybrid offer (Open-with / share-target).
// WHY: dynamic import keeps the files-hub (and its cwsp-shared/v2 + native
// bridge deps) out of the critical boot path; best-effort, never fails boot.
void import("../../../../shared/src/files-hub")
    .then((m) => m.startFilesHub())
    .catch(() => { /* best-effort */ });
