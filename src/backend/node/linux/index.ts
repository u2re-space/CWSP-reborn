/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/linux/index.ts
 * Change date and time: 11.25.00_18.07.2026
 * Reason for changes: Wire clipboard prompt hooks through startNeutralinoBackend so
 *   /service/clipboard-prompt routes the popup UI to the live hub instance on linux.
 *   2026-07-18: tray longevity — exit only when Neutralino host (CWSP_NL_PID)
 *   is gone; keep control/hub alive if only extNode IPC dies.
 */

import fs from "node:fs";
import path from "node:path";

import { ProtocolServer } from "protocol/node/index.ts";
import {
    startNeutralinoBackend,
    createClipboardHub,
    createClipboardPromptHost
} from "../shared/neutralino/index.ts";
import { startWebnativeBackend } from "../shared/webnative/index.ts";
import { createClipboardExecutor } from "../shared/executor/Clipboardy.ts";

export * from "./settings.ts";
export { startNeutralinoBackend, startWebnativeBackend, createClipboardHub };

// WHY: Cursor.exe on desk often steals :19875/:19876 (ERR_EMPTY_RESPONSE).
const DEFAULT_CONTROL_PORT = 29110;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

function resolvePackageRoot(): string {
    const candidates = [
        process.env.CWSP_NL_PACKAGE_ROOT,
        process.env.CWSP_ROOT,
        process.env.NL_PATH,
        process.cwd()
    ];
    for (const c of candidates) {
        if (c && fs.existsSync(c)) return path.resolve(c);
    }
    return path.resolve(process.cwd());
}

/**
 * Clipboard-hub is for Neutralino/WebNative *desktop* shells only.
 * WHY: `deploy:200:node` / PM2 `cwsp-reborn-node` on the gateway used to start
 * hub as default `L-110` without a token → 4001 reconnect storm → Capacitor/fleet die.
 * INVARIANT: on server hosts require explicit `CWSP_CLIPBOARD_HUB=1`.
 */
function shouldStartClipboardHub(packageRoot: string): boolean {
    const flag = String(process.env.CWSP_CLIPBOARD_HUB || "").trim();
    if (flag === "0" || flag.toLowerCase() === "false") return false;
    if (flag === "1" || flag.toLowerCase() === "true") return true;
    // WHY: desktop shells always need hub; gateway PM2 must set CWSP_CLIPBOARD_HUB=0.
    const shell = String(process.env.CWSP_DESKTOP_SHELL || "").trim().toLowerCase();
    if (shell === "neutralino" || shell === "webnative") return true;
    // Auto-enable only inside a Neutralino desktop package tree.
    const markers = [
        path.join(packageRoot, "resources.neu"),
        path.join(packageRoot, "neutralino.config.json"),
        path.join(packageRoot, "cwsp-neutralino-linux_x64"),
        path.join(packageRoot, "cwsp-neutralino-win_x64.exe")
    ];
    if (markers.some((p) => fs.existsSync(p))) return true;
    if (/cwsp-neutralino/i.test(packageRoot)) return true;
    if (process.env.CWSP_NL_PACKAGE_ROOT) return true;
    return false;
}

function publishControlAuth(auth: { port: number; key: string }, packageRoot: string): string {
    const tmpDir = path.join(packageRoot, ".tmp");
    fs.mkdirSync(tmpDir, { recursive: true });
    const authPath = path.join(tmpDir, "cwsp-control-auth.json");
    fs.writeFileSync(
        authPath,
        JSON.stringify(
            {
                port: auth.port,
                key: auth.key,
                host: "127.0.0.1",
                serviceConfig: "/service/config",
                serviceClipboard: "/service/clipboard",
                serviceClipboardHub: "/service/clipboard-hub",
                serviceDispatch: "/service/dispatch",
                neutralinoConfig: "/neutralino/config",
                writtenAt: new Date().toISOString()
            },
            null,
            2
        ) + "\n",
        "utf8"
    );
    fs.writeFileSync(
        path.join(tmpDir, "__webnative_auth__.js"),
        `globalThis.__WEBNATIVE_AUTH__ = ${JSON.stringify({ port: auth.port, key: auth.key })};\n` +
            `globalThis.__NEUTRALINO_AUTH__ = ${JSON.stringify({ port: auth.port, key: auth.key })};\n` +
            `globalThis.__CWS_WEBNATIVE_BOOT__ = true;\n` +
            `globalThis.__CWS_NEUTRALINO_BOOT__ = true;\n` +
            `globalThis.__CWS_NODE_CLIPBOARD_HUB__ = true;\n`,
        "utf8"
    );
    return authPath;
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

/**
 * Linux Neutralino/WebNative backend: settings + control + clipboard-hub.
 * WHY: clipboard LAN sync must run in Node (clipboardy), not in the WebView.
 */
export async function main(): Promise<void> {
    const shell = String(process.env.CWSP_DESKTOP_SHELL ?? "neutralino").toLowerCase();
    const useWebnative = shell === "webnative";
    const packageRoot = resolvePackageRoot();
    const controlPort = Number(process.env.CWSP_CONTROL_PORT || DEFAULT_CONTROL_PORT) || DEFAULT_CONTROL_PORT;
    const apiKey = String(process.env.CWSP_CONTROL_KEY || DEFAULT_CONTROL_KEY);
    const localId = process.env.CWSP_CLIENT_ID ?? "L-110";

    const clipboard = createClipboardExecutor();

    const clipboardWrite = async ({
        packet,
        reply
    }: {
        packet: { what?: string; payload?: unknown; data?: unknown };
        reply: (op: "result" | "error", payload?: Record<string, unknown>) => unknown;
    }) => {
        const applied = await clipboard.applyPacket(packet);
        return reply("result", { ok: true, what: packet.what, ...applied });
    };

    const protocol = new ProtocolServer({
        localId,
        handlers: {
            "clipboard:update": clipboardWrite,
            "clipboard:write": clipboardWrite,
            "clipboard:read": async ({ reply }) => {
                const text = await clipboard.readText();
                return reply("result", { ok: true, kind: "text", text, content: text, data: text });
            },
            "clipboard:get": async ({ reply }) => {
                const text = await clipboard.readText();
                return reply("result", { ok: true, kind: "text", text, content: text, data: text });
            },
            "clipboard:isReady": async ({ reply }) =>
                reply("result", { ok: true, ready: await clipboard.isReady() })
        },
        aliases: {
            clipboard: "clipboard:update",
            "airpad:clipboard:write": "clipboard:write",
            "airpad:clipboard:delivery": "clipboard:update",
            "airpad:clipboard:read": "clipboard:read"
        }
    });

    const onDispatch = async (packet: unknown) => protocol.ingest(packet);
    const onClipboard = {
        async read(opts?: { kind?: string }) {
            const kind = String(opts?.kind || "text").toLowerCase();
            if (kind === "image") {
                return { ok: false, kind: "image", error: { code: "CLIPBOARD_IMAGE_UNSUPPORTED" } };
            }
            const text = await clipboard.readText();
            return { ok: true, kind: "text", text, content: text, body: text, data: text };
        },
        async write(payload: Record<string, unknown>) {
            const body = asRecord(payload);
            const text =
                (typeof body.text === "string" && body.text) ||
                (typeof body.content === "string" && body.content) ||
                (typeof body.body === "string" && body.body) ||
                (typeof body.data === "string" && body.data) ||
                "";
            await clipboard.writeText(text);
            return { ok: true, kind: "text", textLength: text.length };
        }
    };

    let hubStatus = (): Record<string, unknown> => ({ running: false, connected: false });
    let hubReload = (): void => undefined;
    // WHY: prompt hooks read live hub state; safe to return null before hub is wired.
    let hubPromptGet = (): Record<string, unknown> | null => null;
    let hubPromptAction = async (
        _action: "share" | "dismiss" | "erase" | "accept" | "undo"
    ): Promise<boolean> => false;

    const runtime = useWebnative
        ? await startWebnativeBackend({
              platform: "linux",
              enableClipboard: true,
              controlPort,
              apiKey
          })
        : await startNeutralinoBackend({
              platform: "linux",
              controlPort,
              apiKey,
              publicDir: path.join(packageRoot, "build", "neutralino"),
              onDispatch,
              onClipboard,
              onClipboardHubStatus: async () => hubStatus(),
              onClipboardHubReload: async () => {
                  hubReload();
              },
              // WHY: popup bridge polls /service/clipboard-prompt — plumb to hub state.
              onClipboardPromptGet: async () => hubPromptGet(),
              onClipboardPromptAction: async (action) => hubPromptAction(action)
          });

    // Native toast host (NOT a second Neutralino). Spawned when a prompt is active.
    const promptHost = createClipboardPromptHost({
        packageRoot,
        getAuth: () => ({ port: runtime.auth.port, key: runtime.auth.key })
    });

    // WHY: exit when Neutralino host dies. If only extNode dies, keep serving
    // loopback control so a tray WebView can still reach settings/clipboard.
    const parentPid = Number(process.env.CWSP_PARENT_PID || 0);
    const nlPid = Number(process.env.CWSP_NL_PID || 0);
    let parentWatch: ReturnType<typeof setInterval> | null = null;
    let loggedExtNodeGone = false;
    if (nlPid > 0 || parentPid > 0) {
        parentWatch = setInterval(() => {
            const probe = (pid: number): boolean => {
                try {
                    process.kill(pid, 0);
                    return true;
                } catch {
                    return false;
                }
            };
            if (nlPid > 0) {
                if (!probe(nlPid)) {
                    try {
                        promptHost.dispose();
                    } catch {
                        /* ignore */
                    }
                    if (parentWatch) clearInterval(parentWatch);
                    process.exit(0);
                }
                if (parentPid > 0 && !probe(parentPid) && !loggedExtNodeGone) {
                    loggedExtNodeGone = true;
                    console.warn(
                        JSON.stringify({
                            channel: "cwsp-backend",
                            event: "extnode-gone-keep-alive",
                            parentPid,
                            nlPid
                        })
                    );
                }
                return;
            }
            if (parentPid > 0 && !probe(parentPid)) {
                try {
                    promptHost.dispose();
                } catch {
                    /* ignore */
                }
                if (parentWatch) clearInterval(parentWatch);
                process.exit(0);
            }
        }, 2000);
    }
    const shutdown = () => {
        try {
            promptHost.dispose();
        } catch {
            /* ignore */
        }
        if (parentWatch) clearInterval(parentWatch);
    };
    process.once("SIGINT", () => {
        shutdown();
        process.exit(0);
    });
    process.once("SIGTERM", () => {
        shutdown();
        process.exit(0);
    });
    process.once("exit", () => {
        shutdown();
    });

    // INVARIANT: hub exists for Neutralino + WebNative; start remains desk-gated.
    const clipboardHub = createClipboardHub({
              localId,
              packageRoot,
              getSettings: () => runtime.settings.get(),
              adapters: {
                  readText: () => clipboard.readText(),
                  writeText: (text) => clipboard.writeText(text).then(() => undefined),
                  ingest: (packet) => protocol.ingest(packet)
              },
              onPromptUpdate: (state) => {
                // WHY: soft release on null — hard stop blocked the next spawn (Windows host).
                if (state) promptHost.ensureRunning();
                else promptHost.release();
              }
          });

    if (clipboardHub) {
        hubStatus = () => clipboardHub.status() as unknown as Record<string, unknown>;
        hubReload = () => clipboardHub.reload();
        // WHY: control RPC delegates /service/clipboard-prompt to the live hub instance.
        hubPromptGet = () =>
            clipboardHub.getPromptState() as unknown as Record<string, unknown> | null;
        hubPromptAction = (action) => clipboardHub.resolvePrompt(action);
        if (shouldStartClipboardHub(packageRoot)) {
            clipboardHub.start();
        } else {
            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "skipped",
                    reason: "not-desktop-package; set CWSP_CLIPBOARD_HUB=1 to force",
                    localId,
                    packageRoot
                })
            );
        }
    }

    // WHY: WebNative UI needs the same auth file as Neutralino to sync hub tokens on boot.
    publishControlAuth(runtime.auth, packageRoot);

    console.log(
        JSON.stringify({
            shell: useWebnative ? "webnative" : "neutralino",
            platform: runtime.platform,
            publicDir: runtime.publicDir,
            controlPort: runtime.auth.port,
            configPath: runtime.settings.filePath,
            clipboard: "ready",
            clipboardHub:
                clipboardHub && shouldStartClipboardHub(packageRoot) ? "starting" : "skipped"
        })
    );
}

const isDirectRun =
    typeof process.argv[1] === "string" &&
    (process.argv[1].endsWith("/linux/index.ts") ||
        process.argv[1].endsWith("/linux/index.js"));

if (isDirectRun) {
    void main().catch((error: unknown) => {
        console.error("[CWSP Neutralino/linux] backend failed", error);
        process.exitCode = 1;
    });
}
