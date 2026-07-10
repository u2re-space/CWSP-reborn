/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/index.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — Windows WebNative Node backend entrypoint (settings + control).
 */

import { startWebnativeBackend } from "../shared/webnative/index.ts";

export * from "./settings.ts";
export { startWebnativeBackend };

/**
 * Windows desktop backend entry.
 * WHY: `@mindw1n/webnative` looks for `app/backend/dist/index.js`; this module is the
 * source that packaging will compile into that slot. Until packaging lands, run via:
 *   node --experimental-strip-types src/backend/node/windows/index.ts
 */
export async function main(): Promise<void> {
    const runtime = await startWebnativeBackend({ platform: "windows" });
    // NOTE: auth is for the local WebView only — never log the key.
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
    (process.argv[1].endsWith("/windows/index.ts") ||
        process.argv[1].endsWith("\\windows\\index.ts") ||
        process.argv[1].endsWith("/windows/index.js") ||
        process.argv[1].endsWith("\\windows\\index.js"));

if (isDirectRun) {
    void main().catch((error: unknown) => {
        console.error("[CWSP WebNative/windows] backend failed", error);
        process.exitCode = 1;
    });
}
