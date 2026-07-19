/*
 * Filename: control.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/control.ts
 * Change date and time: 14.40.00_19.07.2026
 * Reason for changes: GET /service/clipboard-prompt now returns BOTH `prompt`
 *   and `state` keys (same payload) so popup.js (data.state) and
 *   prompt-toast.ps1 (data.state) consumers stay compatible after the hub
 *   renamed the field to `prompt`.
 *   2026-07-19: POST action `take` — Accept inbound ask + return full text
 *   for CRX Paste by CWSP (bypass Accept popup).
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";

import type { NodeSettingsBackend, SettingsBlob } from "../settings/types.ts";

export type ClipboardPromptAction = "share" | "dismiss" | "erase" | "accept" | "undo" | "take";

/** Result of POST /service/clipboard-prompt (boolean applied, or take payload). */
export type ClipboardPromptActionResult =
    | boolean
    | { applied: boolean; text?: string; hasImage?: boolean };

export interface NeutralinoControlAuth {
    port: number;
    key: string;
}

export interface NeutralinoControlServer {
    readonly auth: NeutralinoControlAuth;
    readonly server: Server;
    close(): Promise<void>;
}

export interface NeutralinoClipboardHooks {
    read(opts?: { kind?: string }): Promise<unknown>;
    write(payload: Record<string, unknown>): Promise<unknown>;
}

export interface CreateNeutralinoControlOptions {
    backend: NodeSettingsBackend;
    host?: string;
    port?: number;
    apiKey?: string;
    /** Optional Neutralino shell metadata returned by GET /neutralino/config. */
    shellMeta?: Record<string, unknown>;
    /**
     * Protocol ingest hook (ProtocolServer.ingest).
     * WHY: WebView + extNode need a loopback path into the TS protocol without IPC reply races.
     */
    onDispatch?: (packet: unknown) => Promise<unknown>;
    /** Direct clipboard OS I/O (ClipboardService) for /service/clipboard. */
    onClipboard?: NeutralinoClipboardHooks;
    /** Node-owned clipboard hub status (GET /service/clipboard-hub). */
    onClipboardHubStatus?: () => Record<string, unknown> | Promise<Record<string, unknown>>;
    /** Reload Node clipboard hub after WebView syncs tokens (POST /service/clipboard-hub). */
    onClipboardHubReload?: () => void | Promise<void>;
    /**
     * Current clipboard prompt state for GET /service/clipboard-prompt.
     * Returns null when no prompt is active (popup should hide).
     */
    onClipboardPromptGet?: () => Record<string, unknown> | null | Promise<Record<string, unknown> | null>;
    /**
     * Resolve the active clipboard prompt with a user action (POST /service/clipboard-prompt).
     * Returns true when the action applied; `take` may return `{ applied, text }`.
     */
    onClipboardPromptAction?: (
        action: ClipboardPromptAction
    ) => Promise<ClipboardPromptActionResult>;
}

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        req.on("error", reject);
    });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
    const payload = JSON.stringify(body);
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
    });
    res.end(payload);
}

function checkKey(expected: string, incoming: string | string[] | undefined): boolean {
    if (typeof incoming !== "string") return false;
    const a = Buffer.from(incoming);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

/**
 * Loopback control RPC for Neutralino WebView + extNode.
 *
 * Routes:
 *   GET|POST /service/config     → CWSP portable settings
 *   GET|POST /neutralino/config  → same settings + shell metadata
 *   GET|POST /service/clipboard  → OS clipboard text/image (ClipboardService)
 *   GET      /service/clipboard-hub → Node clipboard /ws hub status
 *   POST     /service/clipboard-hub  → persist hub auth + reload
 *   GET      /service/clipboard-prompt → current clipboard prompt state (popup UI)
 *   POST     /service/clipboard-prompt → resolve prompt with share/dismiss/erase/accept/undo/take
 *   POST     /service/dispatch   → ProtocolServer.ingest (clipboard/input/…)
 *
 * WHY: frontend Settings overlay and clipboard-device share one auth surface;
 * Neutralino.extensions.dispatch does not reliably return runNodeResult.
 * INVARIANT: Win/Linux Neutralino clipboard sync is owned by Node clipboard-hub,
 * not by the WebView websocket push/apply loops.
 */
export async function createNeutralinoControlServer(
    options: CreateNeutralinoControlOptions
): Promise<NeutralinoControlServer> {
    const host = options.host ?? "127.0.0.1";
    const key = options.apiKey ?? randomBytes(32).toString("hex");
    const { backend } = options;
    const shellMeta = options.shellMeta ?? {};

    const server = createServer(async (req, res) => {
        try {
            if (req.method === "OPTIONS") {
                sendJson(res, 204, {});
                return;
            }

            if (!checkKey(key, req.headers["x-api-key"])) {
                sendJson(res, 401, { error: "Unauthorized" });
                return;
            }

            const url = new URL(req.url ?? "/", `http://${host}`);
            const pathName = url.pathname;

            // --- clipboard -------------------------------------------------
            if (pathName === "/service/clipboard") {
                if (!options.onClipboard) {
                    sendJson(res, 503, { error: "Clipboard hooks not attached" });
                    return;
                }
                if (req.method === "GET") {
                    const kind = url.searchParams.get("kind") || "text";
                    const result = await options.onClipboard.read({ kind });
                    sendJson(res, 200, result);
                    return;
                }
                if (req.method === "POST") {
                    const raw = await readBody(req);
                    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
                    const result = await options.onClipboard.write(parsed);
                    sendJson(res, 200, result);
                    return;
                }
                sendJson(res, 405, { error: "Method not allowed" });
                return;
            }

            // --- clipboard prompt (popup UI ↔ hub IPC) -------------------
            // WHY: popup window polls GET and POSTs user actions; same X-API-Key auth as hub.
            if (pathName === "/service/clipboard-prompt") {
                if (req.method === "GET") {
                    if (!options.onClipboardPromptGet) {
                        sendJson(res, 503, { error: "Clipboard prompt not attached" });
                        return;
                    }
                    const state = await options.onClipboardPromptGet();
                    // COMPAT: return BOTH `prompt` (canonical hub field) and `state`
                    // (legacy consumers: popup.js + prompt-toast.ps1 read `data.state`).
                    // Same reference — one source of truth, two alias keys.
                    sendJson(res, 200, { ok: true, prompt: state ?? null, state: state ?? null });
                    return;
                }
                if (req.method === "POST") {
                    if (!options.onClipboardPromptAction) {
                        sendJson(res, 503, { error: "Clipboard prompt not attached" });
                        return;
                    }
                    const raw = await readBody(req);
                    const body = raw ? (JSON.parse(raw) as { action?: string }) : {};
                    const action = String(body.action || "").trim().toLowerCase();
                    const validActions: ClipboardPromptAction[] = [
                        "share",
                        "dismiss",
                        "erase",
                        "accept",
                        "undo",
                        "take"
                    ];
                    if (!validActions.includes(action as ClipboardPromptAction)) {
                        sendJson(res, 400, {
                            error: "Invalid action",
                            action: body.action ?? "",
                            valid: validActions
                        });
                        return;
                    }
                    const result = await options.onClipboardPromptAction(
                        action as ClipboardPromptAction
                    );
                    // WHY: `take` returns full held text; other actions keep { ok, applied }.
                    if (result && typeof result === "object") {
                        sendJson(res, 200, {
                            ok: true,
                            applied: Boolean(result.applied),
                            text: String(result.text || ""),
                            hasImage: Boolean(result.hasImage)
                        });
                        return;
                    }
                    sendJson(res, 200, { ok: true, applied: Boolean(result) });
                    return;
                }
                sendJson(res, 405, { error: "Method not allowed" });
                return;
            }

            // --- clipboard hub (Node-owned /ws sync) ----------------------
            if (pathName === "/service/clipboard-hub") {
                if (req.method === "GET") {
                    if (!options.onClipboardHubStatus) {
                        sendJson(res, 503, { error: "Clipboard hub not attached" });
                        return;
                    }
                    const status = await options.onClipboardHubStatus();
                    sendJson(res, 200, { ok: true, ...status });
                    return;
                }
                if (req.method === "POST") {
                    const raw = await readBody(req);
                    const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
                    // Persist hub auth into portable settings when WebView posts tokens.
                    const current = await backend.get();
                    const currentShell =
                        current && typeof current === "object" && !Array.isArray(current)
                            ? ((current as { shell?: Record<string, unknown> }).shell ?? {})
                            : {};
                    const shellPatch: Record<string, unknown> = {};
                    const changed = (key: string, next: string): boolean =>
                        String(currentShell[key] ?? "").trim() !== next;

                    if (typeof body.remoteHost === "string" && body.remoteHost.trim()) {
                        const v = body.remoteHost.trim();
                        if (changed("remoteHost", v)) shellPatch.remoteHost = v;
                    }
                    // WHY: hubUrl is the fleet /ws origin; do not overwrite remoteHost with it
                    // (WAN gateway URL vs LAN hub are different — conflating them caused reconnect flaps).
                    if (typeof body.hubUrl === "string" && body.hubUrl.trim()) {
                        const v = body.hubUrl.trim();
                        // Store under shell.hubUrl when distinct; ops.hubUrl is also read by hub.
                        if (changed("hubUrl", v)) shellPatch.hubUrl = v;
                    }
                    if (typeof body.accessToken === "string" && body.accessToken.trim()) {
                        const v = body.accessToken.trim();
                        if (changed("accessToken", v)) shellPatch.accessToken = v;
                    }
                    if (typeof body.clientToken === "string" && body.clientToken.trim()) {
                        const v = body.clientToken.trim();
                        if (changed("clientToken", v)) shellPatch.clientToken = v;
                    }
                    // WHY: WebView posts clientId on boot/save — hub handshake query needs it too.
                    if (typeof body.clientId === "string" && body.clientId.trim()) {
                        const v = body.clientId.trim();
                        if (changed("clientId", v)) {
                            shellPatch.clientId = v;
                            shellPatch.userId = v;
                        }
                    }
                    const hasAuthPatch = Object.keys(shellPatch).length > 0;
                    if (hasAuthPatch) {
                        await backend.patch({ shell: shellPatch });
                    }
                    // WHY: boot credential sync used to POST identical tokens every launch and
                    // force reload — that tore down a healthy /ws (Connected → Disconnected).
                    // Reload only when values changed, or caller sets reload/force.
                    // `reload: false` explicitly suppresses reconnect even after a patch.
                    const reloadRequested = body.reload === true || body.force === true;
                    const reloadSuppressed = body.reload === false;
                    const shouldReload =
                        !reloadSuppressed && (hasAuthPatch || reloadRequested);
                    if (shouldReload && options.onClipboardHubReload) {
                        await options.onClipboardHubReload();
                    }
                    const status = options.onClipboardHubStatus
                        ? await options.onClipboardHubStatus()
                        : { running: false };
                    sendJson(res, 200, {
                        ok: true,
                        patched: hasAuthPatch,
                        reloaded: shouldReload,
                        ...status
                    });
                    return;
                }
                sendJson(res, 405, { error: "Method not allowed" });
                return;
            }

            // --- protocol dispatch ----------------------------------------
            if (pathName === "/service/dispatch") {
                if (!options.onDispatch) {
                    sendJson(res, 503, { error: "Protocol dispatch not attached" });
                    return;
                }
                if (req.method !== "POST") {
                    sendJson(res, 405, { error: "Method not allowed" });
                    return;
                }
                const raw = await readBody(req);
                const packet = raw ? JSON.parse(raw) : {};
                const result = await options.onDispatch(packet);
                sendJson(res, 200, result ?? { ok: true });
                return;
            }

            // --- settings -------------------------------------------------
            const isService = pathName === "/service/config";
            const isNeutralino = pathName === "/neutralino/config";
            if (!isService && !isNeutralino) {
                sendJson(res, 404, { error: "Not found" });
                return;
            }

            if (req.method === "GET") {
                const [settings, defaults, snapshot] = await Promise.all([
                    backend.get(),
                    backend.defaults(),
                    backend.snapshot()
                ]);
                sendJson(res, 200, {
                    portable: settings,
                    defaults,
                    snapshot,
                    settings,
                    config: isNeutralino ? { ...shellMeta, ...settings } : settings
                });
                return;
            }

            if (req.method === "POST") {
                const raw = await readBody(req);
                const parsed = raw ? (JSON.parse(raw) as SettingsBlob) : {};
                const merged = await backend.patch(parsed);
                sendJson(res, 200, {
                    ok: true,
                    portable: merged,
                    settings: merged,
                    config: isNeutralino ? { ...shellMeta, ...merged } : merged
                });
                return;
            }

            sendJson(res, 405, { error: "Method not allowed" });
        } catch (error) {
            sendJson(res, 500, {
                error: error instanceof Error ? error.message : "Internal error"
            });
        }
    });

    const port = await new Promise<number>((resolve, reject) => {
        const preferred = options.port ?? 0;
        const tryListen = (portTry: number, attemptsLeft: number): void => {
            const onError = (error: NodeJS.ErrnoException): void => {
                server.off("error", onError);
                // WHY: Cursor.exe often occupies :18765 and the whole :1987x band
                // (TCP accept + empty HTTP → WebView ERR_EMPTY_RESPONSE). Jump out of that band.
                if (error?.code === "EADDRINUSE" && preferred > 0 && attemptsLeft > 0) {
                    let next = portTry + 1;
                    if (portTry >= 18700 && portTry < 20000) {
                        next = 29110;
                    } else if (next === portTry) {
                        next = portTry + 1;
                    }
                    // Avoid re-trying the same Cursor-owned port forever.
                    if (next === portTry) next = portTry + 11;
                    console.warn(
                        `[cwsp-control] port ${portTry} busy — retry ${next} (${attemptsLeft - 1} left)`
                    );
                    tryListen(next, attemptsLeft - 1);
                    return;
                }
                reject(error);
            };
            server.once("error", onError);
            server.listen(portTry, host, () => {
                server.off("error", onError);
                const addr = server.address();
                if (addr && typeof addr === "object") resolve(addr.port);
                else reject(new Error("Neutralino control server failed to bind"));
            });
        };
        tryListen(preferred, preferred > 0 ? 8 : 0);
    });

    return {
        auth: { port, key },
        server,
        close: () =>
            new Promise((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            })
    };
}
