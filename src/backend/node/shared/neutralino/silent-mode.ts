/*
 * Filename: silent-mode.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/silent-mode.ts
 * Change date and time: 14.55.00_26.07.2026
 * Reason for changes: Neutralino Silent Mode — suppress clipboard/files toast
 *   popups while Transfer History keeps recording inbound/outbound events.
 *
 * WHY: tray menu toggle must be sync-readable on the toast hot path (no await
 * settings I/O per prompt). Persist under packageRoot/.data/silent-mode.json.
 */

import fs from "node:fs";
import path from "node:path";

const FILE_NAME = "silent-mode.json";

type SilentModeFile = {
    enabled?: boolean;
    updatedAt?: number;
};

let cache: { enabled: boolean; mtimeMs: number; root: string } | null = null;

function filePath(packageRoot: string): string {
    return path.join(packageRoot, ".data", FILE_NAME);
}

/** Read Silent Mode flag (cached by mtime). Default off. */
export function readSilentMode(packageRoot: string): boolean {
    const root = String(packageRoot || "").trim();
    if (!root) return false;
    const p = filePath(root);
    try {
        const st = fs.statSync(p);
        if (cache && cache.root === root && cache.mtimeMs === st.mtimeMs) {
            return cache.enabled;
        }
        const raw = JSON.parse(fs.readFileSync(p, "utf8")) as SilentModeFile;
        const enabled = Boolean(raw?.enabled);
        cache = { enabled, mtimeMs: st.mtimeMs, root };
        return enabled;
    } catch {
        cache = { enabled: false, mtimeMs: 0, root };
        return false;
    }
}

/** Persist Silent Mode and refresh cache. Returns the stored value. */
export function writeSilentMode(packageRoot: string, enabled: boolean): boolean {
    const root = String(packageRoot || "").trim();
    if (!root) return false;
    const next = Boolean(enabled);
    const dir = path.join(root, ".data");
    fs.mkdirSync(dir, { recursive: true });
    const p = filePath(root);
    const body: SilentModeFile = { enabled: next, updatedAt: Date.now() };
    fs.writeFileSync(p, JSON.stringify(body), "utf8");
    try {
        cache = { enabled: next, mtimeMs: fs.statSync(p).mtimeMs, root };
    } catch {
        cache = { enabled: next, mtimeMs: Date.now(), root };
    }
    return next;
}

/** Toggle Silent Mode. Returns the new enabled value. */
export function toggleSilentMode(packageRoot: string): boolean {
    return writeSilentMode(packageRoot, !readSilentMode(packageRoot));
}
