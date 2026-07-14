/*
 * Filename: clipboard-prompt-host.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-prompt-host.ts
 * Change date and time: 20.25.00_14.07.2026
 * Reason for changes: ABANDON second Neutralino process for clipboard toast.
 *   It repeatedly opened empty/fullscreen shells and left orphan processes.
 * WHY: Neutralino cannot reliably host a tiny toast beside the main package
 *   (config/mode/res-mode fights + resources.neu). Android uses notifications;
 *   Windows uses a WinForms PowerShell dialog; Linux uses zenity when present.
 * INVARIANT: never spawn cwsp-neutralino*.exe for prompts; kill any prior toast child.
 */

import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ClipboardPromptHostAuth = { port: number; key: string };

export type ClipboardPromptHostOptions = {
    /** Deploy/package root that contains resources/ + backend/. */
    packageRoot: string;
    /** Live control-RPC auth written by the main backend. */
    getAuth: () => ClipboardPromptHostAuth;
};

export type ClipboardPromptHost = {
    /** Ensure the toast UI is showing for the current prompt (idempotent). */
    ensureRunning: () => void;
    /** Soft-stop: ask process to exit; clears handle. */
    stop: () => void;
    dispose: () => void;
};

function resolveToastScript(packageRoot: string): string | null {
    const candidates = [
        path.join(packageRoot, "resources", "clipboard-prompt", "prompt-toast.ps1"),
        path.join(packageRoot, "backend", "node", "windows", "prompt-toast.ps1"),
        // Dev tree (this file under src/backend/node/shared/neutralino/).
        path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../../../../../resources/clipboard-prompt/prompt-toast.ps1"
        )
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function killTree(child: ChildProcess | null): void {
    if (!child || child.killed) return;
    const pid = child.pid;
    try {
        if (process.platform === "win32" && pid) {
            spawn("taskkill", ["/pid", String(pid), "/t", "/f"], {
                stdio: "ignore",
                windowsHide: true
            });
        } else {
            child.kill("SIGTERM");
        }
    } catch {
        /* best-effort */
    }
}

/**
 * Native OS toast host — NOT a second Neutralino.
 * Posts Accept/Share/… back to loopback /service/clipboard-prompt.
 */
export function createClipboardPromptHost(options: ClipboardPromptHostOptions): ClipboardPromptHost {
    let child: ChildProcess | null = null;
    let lastSpawnAt = 0;
    let lastFingerprint = "";
    const SPAWN_COOLDOWN_MS = 800;

    const stop = (): void => {
        const c = child;
        child = null;
        lastFingerprint = "";
        killTree(c);
    };

    const ensureRunning = (): void => {
        if (Date.now() - lastSpawnAt < SPAWN_COOLDOWN_MS) return;

        const auth = options.getAuth();
        const fingerprint = `${auth.port}:${auth.key}`;
        // Idempotent: keep one toast process while the same control auth is live.
        if (child && child.exitCode == null && !child.killed && fingerprint === lastFingerprint) {
            return;
        }

        stop();
        lastSpawnAt = Date.now();
        lastFingerprint = fingerprint;

        if (process.platform === "win32") {
            const script = resolveToastScript(options.packageRoot);
            if (!script) {
                console.warn(
                    JSON.stringify({
                        channel: "cwsp-clipboard-prompt-host",
                        event: "spawn-skip",
                        reason: "toast-script-missing",
                        packageRoot: options.packageRoot
                    })
                );
                return;
            }
            try {
                // WHY: -File (not -Command) so path/quoting stays stable on desk .110.
                child = spawn(
                    "powershell.exe",
                    [
                        "-NoProfile",
                        "-ExecutionPolicy",
                        "Bypass",
                        "-STA",
                        "-File",
                        script,
                        "-ControlPort",
                        String(auth.port),
                        "-ControlKey",
                        String(auth.key)
                    ],
                    {
                        cwd: options.packageRoot,
                        detached: false,
                        stdio: "ignore",
                        // WHY: WinForms needs a desktop session; windowsHide still shows the form.
                        windowsHide: true,
                        env: {
                            ...process.env,
                            CWSP_CONTROL_PORT: String(auth.port),
                            CWSP_CONTROL_KEY: String(auth.key),
                            CWSP_CLIPBOARD_PROMPT: "1"
                        }
                    }
                );
                child.on("exit", () => {
                    child = null;
                });
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-prompt-host",
                        event: "spawned-winforms",
                        pid: child.pid,
                        script,
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
            return;
        }

        // Linux: best-effort zenity info (non-blocking actions still via HTTP timeout).
        try {
            child = spawn(
                "zenity",
                [
                    "--info",
                    "--title=CWSP Clipboard",
                    "--width=360",
                    "--height=160",
                    "--text=Clipboard prompt active — use Accept/Share from the app notification path, or wait for auto-dismiss."
                ],
                { detached: false, stdio: "ignore" }
            );
            child.on("exit", () => {
                child = null;
            });
        } catch {
            console.warn(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawn-skip",
                    reason: "zenity-unavailable"
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
