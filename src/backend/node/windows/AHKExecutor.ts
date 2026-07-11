/*
 * Filename: AHKExecutor.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/AHKExecutor.ts
 * Change date and time: 16.30.00_11.07.2026
 * Reason for changes: Neutralino/Windows — AHK spawn for mouse/keyboard + clipboard RPC.
 */

import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { ClipboardService } from "./ClipboardHandler.ts";

const DEFAULT_AHK =
    process.env.CWSP_AHK_PATH?.trim() ||
    "C:\\Program Files\\AutoHotkey\\AutoHotkey.exe";

/**
 * Windows AutoHotkey executor used by Neutralino Node extension + ProtocolServer.
 *
 * WHY temp scripts: arbitrary clipboard/keyboard text breaks AHK CLI quoting;
 * write a v1 script file, run it, delete it.
 *
 * NOTE: Clipboard text/image preferred path is ClipboardService (clipboardy + PS).
 * AHK clipboard helpers remain for parity with the Java stub.
 */
export default class AHKExecutor {
    private readonly path: string;
    private readonly clipboardHandler: ClipboardService;
    private readonly timeoutMs: number;

    constructor(
        ahkPath: string = DEFAULT_AHK,
        clipboardHandler: ClipboardService = new ClipboardService(),
        timeoutMs = 5000
    ) {
        this.path = ahkPath;
        this.clipboardHandler = clipboardHandler;
        this.timeoutMs = timeoutMs;
    }

    /** Run an AHK v1 script body; returns process exit code. */
    async runScript(script: string): Promise<number> {
        if (process.platform !== "win32") {
            // Soft no-op off Windows so Linux CI / Neutralino cloud mode does not crash.
            return 0;
        }
        const dir = await mkdtemp(path.join(tmpdir(), "cwsp-ahk-"));
        const file = path.join(dir, "run.ahk");
        try {
            await writeFile(file, script, "utf8");
            return await new Promise<number>((resolve, reject) => {
                const child = spawn(this.path, [file], {
                    windowsHide: true,
                    stdio: ["ignore", "ignore", "pipe"]
                });
                let stderr = "";
                const timer = setTimeout(() => {
                    child.kill();
                    reject(new Error(`AHK timed out after ${this.timeoutMs}ms`));
                }, this.timeoutMs);
                child.stderr?.on("data", (c) => {
                    stderr += String(c);
                });
                child.on("error", (err) => {
                    clearTimeout(timer);
                    reject(err);
                });
                child.on("close", (code) => {
                    clearTimeout(timer);
                    if (code === 0) resolve(0);
                    else reject(new Error(stderr || `AHK exit ${code ?? "null"}`));
                });
            });
        } finally {
            await rm(dir, { recursive: true, force: true }).catch(() => undefined);
        }
    }

    async mouseMove(dx: number, dy: number): Promise<void> {
        await this.runScript(`CoordMode, Mouse, Screen\nMouseMove, ${dx | 0}, ${dy | 0}, 0, R\nExitApp\n`);
    }

    async mouseClick(button = "left", double = false): Promise<void> {
        const map: Record<string, string> = { left: "L", right: "R", middle: "M" };
        const b = map[String(button).toLowerCase()] ?? "L";
        const count = double ? ", 2" : "";
        await this.runScript(`Click, ${b}${count}\nExitApp\n`);
    }

    async mouseScroll(delta: number): Promise<void> {
        const n = Math.abs(delta | 0) || 1;
        const wheel = delta >= 0 ? "WheelUp" : "WheelDown";
        await this.runScript(`Click, ${wheel}, ${n}\nExitApp\n`);
    }

    async keyboardType(text: string): Promise<void> {
        // Expression-mode Raw send avoids comma/newline quoting issues.
        const escaped = JSON.stringify(String(text ?? ""));
        await this.runScript(`SendInput, % "{Raw}" ${escaped}\nExitApp\n`);
    }

    async keyboardTap(key: string, modifiers: string[] = []): Promise<void> {
        const mods = modifiers
            .map((m) => String(m).toLowerCase())
            .map((m) => (m === "ctrl" || m === "control" ? "^" : m === "alt" ? "!" : m === "shift" ? "+" : m === "win" || m === "meta" ? "#" : ""))
            .join("");
        const k = String(key || "").trim() || "Enter";
        await this.runScript(`SendInput, ${mods}{${k}}\nExitApp\n`);
    }

    /**
     * Legacy Neutralino message RPC (clipboard image/text).
     * Prefer CWSP v2 packets via ProtocolServer for new code.
     */
    public async handleMessage(message: any, response?: (result: any) => void): Promise<void> {
        switch (message?.type) {
            case "clipboard-image-read":
                response?.({
                    id: message.id,
                    type: "clipboard-image-read",
                    ok: true,
                    imageBase64: await this.clipboardHandler.readImageBase64()
                });
                break;
            case "clipboard-image-write":
                try {
                    await this.clipboardHandler.writeImageBase64(message.imageBase64);
                    response?.({ id: message.id, type: "clipboard-image-write", ok: true });
                } catch (error: any) {
                    response?.({
                        id: message.id,
                        type: "clipboard-image-write",
                        ok: false,
                        error: error?.message ?? String(error)
                    });
                }
                break;
            case "clipboard-text-read":
                response?.({
                    id: message.id,
                    type: "clipboard-text-read",
                    ok: true,
                    result: { kind: "text", data: await this.clipboardHandler.readText() }
                });
                break;
            case "clipboard-text-write":
                try {
                    await this.clipboardHandler.writeText(message.text);
                    response?.({ id: message.id, type: "clipboard-text-write", ok: true });
                } catch (error: any) {
                    response?.({
                        id: message.id,
                        type: "clipboard-text-write",
                        ok: false,
                        error: error?.message ?? String(error)
                    });
                }
                break;
            default:
                response?.({
                    id: message?.id ?? null,
                    ok: false,
                    error: { code: "UNKNOWN_TYPE", message: String(message?.type ?? "") }
                });
        }
    }
}
