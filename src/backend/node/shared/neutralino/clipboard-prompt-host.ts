/*
 * Filename: clipboard-prompt-host.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-prompt-host.ts
 * Change date and time: 19.25.00_14.07.2026
 * Reason for changes: Spawn independent Neutralino toast with --res-mode=directory.
 * WHY: same exe + --config-file still preferred resources.neu (main shell) → fullscreen app.
 * INVARIANT: popup must load unpacked resources/clipboard-prompt/ (360×200), enableExtensions:false,
 *   never open fleet /ws — only loopback HTTP /service/clipboard-prompt.
 */

import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ClipboardPromptHostAuth = { port: number; key: string };

export type ClipboardPromptHostOptions = {
    /** Deploy/package root that contains the Neutralino binary + resources/. */
    packageRoot: string;
    /** Live control-RPC auth written by the main backend. */
    getAuth: () => ClipboardPromptHostAuth;
};

export type ClipboardPromptHost = {
    /** Ensure the independent popup process is running (idempotent). */
    ensureRunning: () => void;
    /** Soft-stop: ask process to exit; clears handle. */
    stop: () => void;
    dispose: () => void;
};

const CONFIG_NAME = "clipboard-prompt.config.json";

function resolveNeutralinoBinary(packageRoot: string): string | null {
    const candidates =
        process.platform === "win32"
            ? [
                  "cwsp-neutralino-win_x64.exe",
                  "cwsp-neutralino.exe",
                  "neutralino-win_x64.exe",
                  path.join("bin", "neutralino-win_x64.exe")
              ]
            : process.platform === "linux"
              ? [
                    "cwsp-neutralino-linux_x64",
                    "cwsp-neutralino",
                    "neutralino-linux_x64",
                    path.join("bin", "neutralino-linux_x64")
                ]
              : ["cwsp-neutralino-mac_x64", "neutralino-mac_x64"];

    for (const rel of candidates) {
        const abs = path.join(packageRoot, rel);
        if (fs.existsSync(abs)) return abs;
    }
    return null;
}

function resolveConfigPath(packageRoot: string): string | null {
    const candidates = [
        path.join(packageRoot, CONFIG_NAME),
        path.join(packageRoot, "resources", "clipboard-prompt", CONFIG_NAME),
        // Dev tree: apps/CWSP-reborn/clipboard-prompt.config.json next to this module's package.
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../../", CONFIG_NAME)
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

/**
 * Create a host that spawns/kills the independent clipboard-prompt Neutralino app.
 * IPC stays on the main backend control port (HTTP); optional WS can be added later.
 */
export function createClipboardPromptHost(options: ClipboardPromptHostOptions): ClipboardPromptHost {
    let child: ChildProcess | null = null;
    let lastSpawnAt = 0;
    const SPAWN_COOLDOWN_MS = 1500;

    const stop = (): void => {
        const c = child;
        child = null;
        if (!c || c.killed) return;
        try {
            if (process.platform === "win32") {
                spawn("taskkill", ["/pid", String(c.pid), "/t", "/f"], {
                    stdio: "ignore",
                    windowsHide: true
                });
            } else {
                c.kill("SIGTERM");
            }
        } catch {
            /* best-effort */
        }
    };

    const ensureRunning = (): void => {
        if (child && child.exitCode == null && !child.killed) return;
        if (Date.now() - lastSpawnAt < SPAWN_COOLDOWN_MS) return;

        const bin = resolveNeutralinoBinary(options.packageRoot);
        const configPath = resolveConfigPath(options.packageRoot);
        if (!bin || !configPath) {
            console.warn(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawn-skip",
                    reason: !bin ? "binary-missing" : "config-missing",
                    packageRoot: options.packageRoot
                })
            );
            return;
        }

        const auth = options.getAuth();
        lastSpawnAt = Date.now();

        try {
            // WHY: without --res-mode=directory, Neutralino prefers resources.neu next to the
            // exe (main CWSP shell) and ignores clipboard-prompt url/size → fullscreen main UI.
            // Unpacked resources/clipboard-prompt/ must be staged beside the binary by build.
            const args = [
                `--path=${options.packageRoot}`,
                `--config-file=${configPath}`,
                "--res-mode=directory",
                "--mode=window",
                "--url=/clipboard-prompt/",
                // WHY: Cursor often owns 18764/18765 — popup must not collide with main UI.
                "--port=19876",
                "--window-width=360",
                "--window-height=200",
                "--chrome-width=360",
                "--chrome-height=200",
                "--window-maximize=false",
                "--window-full-screen=false",
                "--window-always-on-top=true",
                "--window-borderless=true",
                "--window-resizable=false",
                "--enable-extensions=false",
                "--window-transparent=true"
            ];
            child = spawn(bin, args, {
                cwd: options.packageRoot,
                detached: true,
                stdio: "ignore",
                windowsHide: false,
                env: {
                    ...process.env,
                    CWSP_CONTROL_PORT: String(auth.port),
                    CWSP_CONTROL_KEY: String(auth.key),
                    CWSP_CLIPBOARD_PROMPT: "1",
                    // Popup must not start clipboard-hub / backend again.
                    CWSP_CLIPBOARD_HUB: "0",
                    CWSP_DESKTOP_SHELL: ""
                }
            });
            child.unref();
            child.on("exit", () => {
                child = null;
            });
            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawned",
                    pid: child.pid,
                    bin,
                    configPath,
                    controlPort: auth.port
                })
            );
        } catch (error) {
            child = null;
            console.warn(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawn-error",
                    error: error instanceof Error ? error.message : String(error)
                })
            );
        }
    };

    return {
        ensureRunning,
        stop,
        dispose: stop
    };
}
