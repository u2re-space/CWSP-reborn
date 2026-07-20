/*
 * Filename: clipboard-prompt-host.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-prompt-host.ts
 * Change date and time: 13.00.00_20.07.2026
 * Reason for changes: Node-owned clipboard toast (WinForms PS1) — fully decoupled from
 *   Neutralino UI. Reset crash-loop on each new ensureRunning so give-up does not
 *   permanently kill popups; never spawn a second Neutralino for prompts.
 *   2026-07-18: Do NOT spawn with windowsHide/CREATE_NO_WINDOW — that makes
 *   Environment.UserInteractive=false and WinForms ShowDialog throws.
 * Invariant: Toast UI is Node→powershell only; Neutralino WebView is unrelated.
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
    /**
     * Called when host stops respawning (crash-loop / give-up) while a prompt
     * was still wanted — hub must clear the hold so Waiting toasts stop.
     */
    onGiveUp?: () => void;
};

export type ClipboardPromptHost = {
    ensureRunning: () => void;
    /** Soft release — toast may drain empty polls; does not kill the process. */
    release: () => void;
    /** Hard stop — terminate toast (shutdown / dispose only). */
    stop: () => void;
    dispose: () => void;
};

const TOAST_FILE = "prompt-toast.ps1";
/** Debounce crash-loop respawns only (not used after soft release). */
const CRASH_RESPAWN_MS = 250;
/** WHY: rapid exit+respawn while hold is open looks like infinite Share blink. */
const RAPID_EXIT_BACKOFF_MS = 2_000;
/**
 * WHY: Waiting-fail cycles are ~1.2s paint + 2s backoff ≈ 3s+. An 8s window never
 * reached CRASH_LOOP_MAX after standby → infinite Waiting toast storm.
 */
const CRASH_LOOP_WINDOW_MS = 45_000;
const CRASH_LOOP_MAX = 3;
/** Toast that lived this long was interactive enough — clear crash history. */
const HEALTHY_TOAST_MS = 4_000;

function resolveToastScript(packageRoot: string): string | null {
    const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));

    const candidates = [
        path.join(packageRoot, "resources", "clipboard-prompt", TOAST_FILE),
        path.join(packageRoot, "backend", "node", "windows", TOAST_FILE),
        // Deployed Node package often nests resources under backend/node.
        path.join(packageRoot, "backend", "node", "resources", "clipboard-prompt", TOAST_FILE),
        // This file lives in src/backend/node/shared/neutralino/.
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
    /** WHY: while true, unexpected toast exit must respawn (hub still has a prompt). */
    let wantRunning = false;
    let respawnTimer: ReturnType<typeof setTimeout> | null = null;
    let crashTimestamps: number[] = [];
    let lastSpawnAt = 0;
    let lastExitAt = 0;
    /** WHY: after give-up, next ensureRunning must be allowed (new clipboard hold). */
    let gaveUp = false;

    const clearRespawnTimer = (): void => {
        if (respawnTimer) {
            clearTimeout(respawnTimer);
            respawnTimer = null;
        }
    };

    const resetCrashLoop = (reason: string): void => {
        if (crashTimestamps.length || gaveUp) {
            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "crash-loop-reset",
                    reason,
                    previousCrashes: crashTimestamps.length,
                    gaveUp
                })
            );
        }
        crashTimestamps = [];
        gaveUp = false;
    };

    const stop = (): void => {
        wantRunning = false;
        clearRespawnTimer();
        const previousChild = child;
        child = null;
        activeAuthFingerprint = "";
        terminate(previousChild);
    };

    const release = (): void => {
        // Soft: hub cleared prompt — let toast self-close on empty GET polls.
        // WHY: hard kill + cooldown previously blocked the next ensureRunning.
        wantRunning = false;
        clearRespawnTimer();
        // WHY: successful hub clear means the next prompt is a new cycle.
        if (isRunning(child) && lastSpawnAt > 0 && Date.now() - lastSpawnAt >= HEALTHY_TOAST_MS) {
            resetCrashLoop("release-healthy");
        }
    };

    const spawnToast = (): void => {
        if (process.platform !== "win32") {
            return;
        }
        if (!wantRunning) {
            return;
        }
        if (isRunning(child)) {
            return;
        }

        const auth = options.getAuth();
        const fingerprint = `${auth.port}:${auth.key}`;
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

        // Crash-loop guard: too many exits in a short window → stop respawning.
        const now = Date.now();
        crashTimestamps = crashTimestamps.filter((t) => now - t < CRASH_LOOP_WINDOW_MS);
        if (crashTimestamps.length >= CRASH_LOOP_MAX) {
            console.warn(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawn-skip",
                    reason: "crash-loop",
                    crashes: crashTimestamps.length
                })
            );
            wantRunning = false;
            gaveUp = true;
            clearRespawnTimer();
            // WHY: leave hub hold → toast keeps Getting "Waiting" forever on next ensure.
            try {
                options.onGiveUp?.();
            } catch {
                /* hub clear must not throw host */
            }
            return;
        }

        const previousChild = child;
        child = null;
        terminate(previousChild);

        try {
            lastSpawnAt = Date.now();
            // WHY: windowsHide→CREATE_NO_WINDOW breaks WinForms ShowDialog
            // (UserInteractive=false). -WindowStyle Hidden keeps an interactive
            // desktop session without a visible console.
            const spawnedChild = spawn(
                "powershell.exe",
                [
                    "-NoLogo",
                    "-NoProfile",
                    "-STA",
                    "-WindowStyle",
                    "Hidden",
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
                    stdio: ["ignore", "ignore", "pipe"],
                    windowsHide: false,
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

            // WHY: surface toast stderr (Add-Type / ShowDialog) into backend logs.
            let stderrBuf = "";
            spawnedChild.stderr?.on("data", (chunk: Buffer | string) => {
                stderrBuf += String(chunk);
                if (stderrBuf.length > 4_000) {
                    stderrBuf = stderrBuf.slice(-4_000);
                }
            });

            spawnedChild.once("exit", (code, signal) => {
                if (child === spawnedChild) {
                    child = null;
                    activeAuthFingerprint = "";
                }
                const livedMs =
                    lastSpawnAt > 0 ? Date.now() - lastSpawnAt : 0;
                // WHY: only unexpected exits (hub still wants toast) count toward crash-loop.
                const unexpected = wantRunning;
                if (unexpected) {
                    // Healthy paint (user saw toast) should not permanently poison the loop.
                    if (livedMs >= HEALTHY_TOAST_MS) {
                        resetCrashLoop("healthy-lifetime");
                    } else {
                        crashTimestamps.push(Date.now());
                    }
                }
                const stderrTail = stderrBuf.trim().slice(-800);
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-prompt-host",
                        event: "toast-exit",
                        code,
                        signal,
                        wantRunning,
                        unexpected,
                        livedMs,
                        ...(stderrTail ? { stderr: stderrTail } : {})
                    })
                );
                // WHY: toast died while hub still wants a prompt (crash / Alt-F4).
                if (wantRunning) {
                    lastExitAt = Date.now();
                    const delay =
                        livedMs < 1_500
                            ? Math.max(CRASH_RESPAWN_MS, RAPID_EXIT_BACKOFF_MS)
                            : CRASH_RESPAWN_MS;
                    clearRespawnTimer();
                    respawnTimer = setTimeout(() => {
                        respawnTimer = null;
                        spawnToast();
                    }, delay);
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
                if (wantRunning) {
                    clearRespawnTimer();
                    respawnTimer = setTimeout(() => {
                        respawnTimer = null;
                        spawnToast();
                    }, CRASH_RESPAWN_MS);
                }
            });

            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-prompt-host",
                    event: "spawned-winforms",
                    pid: spawnedChild.pid,
                    script,
                    controlPort: auth.port,
                    note: "Node-owned toast (not Neutralino UI)"
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

    const ensureRunning = (): void => {
        const wasWanted = wantRunning;
        wantRunning = true;
        clearRespawnTimer();
        // WHY: reset only on a new hold (after release/give-up), not on every
        // duplicate onPromptUpdate while a crash-loop is still counting.
        if (gaveUp || !wasWanted) {
            resetCrashLoop(gaveUp ? "ensure-after-giveup" : "ensure-new-hold");
        }

        if (process.platform !== "win32") {
            return;
        }

        const auth = options.getAuth();
        const fingerprint = `${auth.port}:${auth.key}`;

        // Auth changed while toast alive — replace process.
        if (isRunning(child) && activeAuthFingerprint !== fingerprint) {
            terminate(child);
            child = null;
            activeAuthFingerprint = "";
        }

        if (isRunning(child)) {
            return;
        }

        spawnToast();
    };

    return {
        ensureRunning,
        release,
        stop,
        dispose: stop
    };
}
