/*
 * Filename: clipboard-prompt-host.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-prompt-host.ts
 * Reason: Run one independent native Windows clipboard toast.
 * Invariant: Never spawn a second Neutralino process for clipboard prompts.
 */

import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ClipboardPromptHostAuth = {
    port: number;
    key: string;
};

export type ClipboardPromptHostOptions = {
    packageRoot: string;
    getAuth: () => ClipboardPromptHostAuth;
};

export type ClipboardPromptHost = {
    ensureRunning: () => void;
    stop: () => void;
    dispose: () => void;
};

const TOAST_FILE = "prompt-toast.ps1";
const RESTART_COOLDOWN_MS = 1_000;

function resolveToastScript(packageRoot: string): string | null {
    const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));

    const candidates = [
        path.join(packageRoot, "resources", "clipboard-prompt", TOAST_FILE),
        path.join(packageRoot, "backend", "node", "windows", TOAST_FILE),

        // This file lives in src/backend/node/shared/neutralino/.
        // Five ".." segments reach the CWSP-reborn project root.
        path.resolve(
            moduleDirectory,
            "../../../../../resources/clipboard-prompt",
            TOAST_FILE
        )
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function isRunning(child: ChildProcess | null): child is ChildProcess {
    return child !== null && child.exitCode === null && child.signalCode === null;
}

function terminate(child: ChildProcess | null): void {
    if (!child?.pid) return;

    try {
        if (process.platform === "win32") {
            spawn("taskkill.exe", ["/pid", String(child.pid), "/t", "/f"], {
                stdio: "ignore",
                windowsHide: true
            });
            return;
        }

        child.kill("SIGTERM");
    } catch {
        // A child may have already exited between the state check and termination.
    }
}

export function createClipboardPromptHost(
    options: ClipboardPromptHostOptions
): ClipboardPromptHost {
    let child: ChildProcess | null = null;
    let activeAuthFingerprint = "";
    let lastStartAt = 0;

    const stop = (): void => {
        const previousChild = child;

        child = null;
        activeAuthFingerprint = "";

        terminate(previousChild);
    };

    const ensureRunning = (): void => {
        if (process.platform !== "win32") {
            return;
        }

        const auth = options.getAuth();
        const fingerprint = `${auth.port}:${auth.key}`;

        if (isRunning(child) && activeAuthFingerprint === fingerprint) {
            return;
        }

        if (Date.now() - lastStartAt < RESTART_COOLDOWN_MS) {
            return;
        }

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

        const previousChild = child;
        child = null;
        terminate(previousChild);

        lastStartAt = Date.now();

        try {
            const spawnedChild = spawn(
                "powershell.exe",
                [
                    "-NoLogo",
                    "-NoProfile",
                    "-STA",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-File",
                    script,
                    "-ControlPort",
                    String(auth.port),
                    "-ControlKey",
                    auth.key
                ],
                {
                    cwd: options.packageRoot,
                    detached: false,
                    stdio: "ignore",
                    windowsHide: true,
                    env: {
                        ...process.env,
                        CWSP_CONTROL_PORT: String(auth.port),
                        CWSP_CONTROL_KEY: auth.key,
                        CWSP_CLIPBOARD_PROMPT: "1"
                    }
                }
            );

            child = spawnedChild;
            activeAuthFingerprint = fingerprint;

            // Do not clear a newly created child when an older process exits.
            spawnedChild.once("exit", () => {
                if (child === spawnedChild) {
                    child = null;
                    activeAuthFingerprint = "";
                }
            });

            spawnedChild.once("error", (error) => {
                if (child === spawnedChild) {
                    child = null;
                    activeAuthFingerprint = "";
                }

                console.warn(
                    JSON.stringify({
                        channel: "cwsp-clipboard-prompt-host",
                        event: "spawn-error",
                        error: error.message
                    })
                );
            });

            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawned-winforms",
                    pid: spawnedChild.pid,
                    script,
                    controlPort: auth.port
                })
            );
        } catch (error) {
            child = null;
            activeAuthFingerprint = "";

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