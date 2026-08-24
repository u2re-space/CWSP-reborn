/*
 * Filename: sync-capacitor-android-icons.mjs
 * FullPath: apps/CWSP-transfer/scripts/sync-capacitor-android-icons.mjs
 * FIND:sku
 * Change date and time: 13.54.00_24.08.2026
 * Reason for changes: Transfer APK icon = Phosphor drone.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const renderer = path.resolve(APP_ROOT, "../CWSP-shell/scripts/render-sku-android-icon.mjs");
const res = path.join(APP_ROOT, "app/android/res");
const r = spawnSync(process.execPath, [renderer, "--icon", "drone", "--res", res], { stdio: "inherit" });
process.exit(r.status ?? 1);
