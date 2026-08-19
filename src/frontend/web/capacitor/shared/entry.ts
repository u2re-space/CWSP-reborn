/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/capacitor/shared/entry.ts
 * Change date and time: 18.35.00_19.08.2026
 * Reason for changes: Capacitor hub SKU — minimal + network/settings/history (launcher lives in CWSP-shell).
 */

import { bootMinimal } from "boot/BootLoader";

const enabledViews = ["minimal", "network", "settings", "history"] as const;

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");
document.documentElement.dataset.cwspNativeShell = "capacitor";

function showBootFailure(error: unknown): void {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error("[CWSP Capacitor] boot failed", error);
    const root = document.body;
    root.replaceChildren();
    root.style.cssText =
        "margin:0;padding:16px;font:14px/1.4 ui-monospace,monospace;background:#111;color:#f66;white-space:pre-wrap;";
    root.textContent = `[CWSP Capacitor] boot failed\n\n${message}`;
}

void bootMinimal(document.body, "network").catch(showBootFailure);

void import("../../../../shared/src/files-hub")
    .then((m) => m.startFilesHub())
    .catch(() => { /* best-effort */ });

void import("views/history/transfer-history-runtime")
    .then((m) => m.startCapacitorTransferHistory())
    .catch(() => { /* best-effort */ });
