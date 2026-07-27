/*
 * Filename: LaunchQueue.ts
 * FullPath: apps/CWSP-reborn/src/backend/web/pwa/LaunchQueue.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream C — File Handling API bridge for PWA launch params.
 *
 * NOTE: `window.launchQueue` is part of the File Handling API and only exists
 * in capable browsers. We expose a no-op-safe consumer so calling code never
 * needs to feature-detect twice. Each call sets a fresh consumer (matches the
 * platform contract: setConsumer is a one-time hook per launch).
 */

/** Minimal shape of a launched file handle passed to the consumer. */
export interface LaunchFile {
    readonly kind: "file";
    readonly name: string;
    getFile(): Promise<File>;
}

/** Window subset we depend on for launch queue detection. */
interface LaunchQueueWindow {
    launchQueue?: {
        setConsumer(consumer: (files: LaunchFile[]) => void): void;
    };
}

function getLaunchWindow(): LaunchQueueWindow | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }
    return window as unknown as LaunchQueueWindow;
}

/** True only when `window.launchQueue.setConsumer` is available. */
export function hasLaunchQueue(): boolean {
    const w = getLaunchWindow();
    return !!w?.launchQueue && typeof w.launchQueue.setConsumer === "function";
}

/**
 * Register a launch-file consumer. No-op when the File Handling API is
 * unavailable, so callers can always wire this without feature checks.
 */
export function consumeLaunchFiles(handler: (files: LaunchFile[]) => void): void {
    const w = getLaunchWindow();
    if (!w?.launchQueue) {
        return;
    }
    w.launchQueue.setConsumer(handler);
}
