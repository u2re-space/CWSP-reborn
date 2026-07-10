/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/linux/index.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — Linux WebNative Node backend entrypoint (settings + control).
 */

import { startWebnativeBackend } from "../shared/webnative/index.ts";

export * from "./settings.ts";
export { startWebnativeBackend };

/**
 * Linux desktop backend entry (same settings contract as Windows).
 * Driver capability selection for Wayland/X11 clipboard/input is deferred.
 */
export async function main(): Promise<void> {
    const runtime = await startWebnativeBackend({ platform: "linux" });
    console.log(
        JSON.stringify({
            platform: runtime.platform,
            publicDir: runtime.publicDir,
            controlPort: runtime.auth.port,
            configPath: runtime.settings.filePath
        })
    );
}

const isDirectRun =
    typeof process.argv[1] === "string" &&
    (process.argv[1].endsWith("/linux/index.ts") ||
        process.argv[1].endsWith("/linux/index.js"));

if (isDirectRun) {
    void main().catch((error: unknown) => {
        console.error("[CWSP WebNative/linux] backend failed", error);
        process.exitCode = 1;
    });
}
