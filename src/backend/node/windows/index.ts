/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/index.ts
 * Change date and time: 16.40.00_11.07.2026
 * Reason for changes: Neutralino/Windows — bootstrap settings control + ProtocolServer handlers.
 */

import { startNeutralinoBackend } from "../shared/neutralino/index.ts";
import { startWebnativeBackend } from "../shared/webnative/index.ts";
import { createWindowsProtocolServer } from "./windowsHandlers.ts";

export * from "./settings.ts";
export { startNeutralinoBackend, startWebnativeBackend };
export { createWindowsProtocolServer };

/**
 * Windows desktop backend entry for Neutralino (preferred) and WebNative (compat).
 *
 * Shell selection:
 *   CWSP_DESKTOP_SHELL=webnative → WebNative control host
 *   default / neutralino         → Neutralino control host (/service/config + /neutralino/config)
 *
 * WHY: Neutralino extNode and the WebView settings arm share the same settings
 * contract; ProtocolServer executes clipboard/input locally via AHK + ClipboardService.
 */
export async function main(): Promise<void> {
    const shell = String(process.env.CWSP_DESKTOP_SHELL ?? "neutralino").toLowerCase();
    const useWebnative = shell === "webnative";

    const runtime = useWebnative
        ? await startWebnativeBackend({ platform: "windows", enableClipboard: true })
        : await startNeutralinoBackend({ platform: "windows" });

    const { server: protocol } = createWindowsProtocolServer({
        localId: process.env.CWSP_CLIENT_ID ?? "L-192.168.0.110",
        onEmit: async (packet) => {
            // Hook for later WS fan-out; for now log compactly.
            if (process.env.CWSP_PROTOCOL_TRACE === "1") {
                console.log("[cwsp:protocol:emit]", JSON.stringify(packet));
            }
        }
    });

    // Expose for Neutralino extension / diagnostics without a second process.
    const g = globalThis as unknown as {
        __CWSP_PROTOCOL__?: typeof protocol;
        __CWSP_CONTROL_AUTH__?: { port: number; key: string };
    };
    g.__CWSP_PROTOCOL__ = protocol;
    g.__CWSP_CONTROL_AUTH__ = runtime.auth;

    console.log(
        JSON.stringify({
            shell: useWebnative ? "webnative" : "neutralino",
            platform: runtime.platform,
            publicDir: runtime.publicDir,
            controlPort: runtime.auth.port,
            configPath: runtime.settings.filePath,
            // NOTE: control HTTP server keeps the process alive.
            protocol: "ready"
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
        console.error("[CWSP Neutralino/windows] backend failed", error);
        process.exitCode = 1;
    });
}
