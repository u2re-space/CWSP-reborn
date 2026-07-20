/*
 * Filename: control.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/control.ts
 * Change date and time: 10.25.00_20.07.2026
 * Reason for changes: strictPort for CRX Local hub alias :8434 (no port bump).
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
    /**
     * When true, EADDRINUSE fails immediately (used for CRX Local hub alias :8434).
     * Default false — primary control may bump ports when Cursor steals the band.
     */
    strictPort?: boolean;
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

/** CORS + Chromium Private Network Access for public hubs (e.g. https://cwsp.u2re.space → 127.0.0.1). */
function corsHeaders(req: IncomingMessage): Record<string, string> {
    const origin = String(req.headers.origin || "").trim();
    const wantPna = String(req.headers["access-control-request-private-network"] || "")
        .trim()
        .toLowerCase() === "true";
    const headers: Record<string, string> = {
        // COMPAT: keep wildcard for local WebView; reflect Origin when present (PNA prefers concrete).
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Headers":
            "Content-Type, X-API-Key, Authorization, Access-Control-Request-Private-Network",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
        Vary: "Origin, Access-Control-Request-Private-Network"
    };
    if (wantPna || origin) {
        headers["Access-Control-Allow-Private-Network"] = "true";
    }
    return headers;
}

function sendJson(res: ServerResponse, status: number, body: unknown, req?: IncomingMessage): void {
    const payload = status === 204 ? "" : JSON.stringify(body);
    const headers: Record<string, string> = {
        ...(req ? corsHeaders(req) : {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
        })
    };
    if (status !== 204) {
        headers["Content-Type"] = "application/json; charset=utf-8";
        headers["Content-Length"] = String(Buffer.byteLength(payload));
    }
    res.writeHead(status, headers);
    res.end(payload);
}

function checkKey(expected: string, incoming: string | string[] | undefined): boolean {
    if (typeof incoming !== "string") return false;
    const a = Buffer.from(incoming);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

const asRecord = (value: unknown): Record<string, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};

/**
 * Map AppSettings-shaped `core.*` into portable `shell`/`bridge` that clipboard-hub reads.
 * WHY: /cwsp + Settings UI persist `core.endpointUrl`; hub historically only read shell.remoteHost.
 */
function expandCoreEndpointIntoPortable(parsed: SettingsBlob): {
    patch: SettingsBlob;
    hubTargetChanged: boolean;
    hubTarget: string;
} {
    const core = asRecord(parsed.core);
    const endpointUrl = String(core.endpointUrl || "").trim();
    const userId = String(core.userId || "").trim();
    const token = String(core.userKey || core.ecosystemToken || "").trim();
    if (!endpointUrl && !userId && !token) {
        return { patch: parsed, hubTargetChanged: false, hubTarget: "" };
    }

    const bridge = asRecord(parsed.bridge);
    const shell = asRecord(parsed.shell);
    const nextBridge: Record<string, unknown> = { ...bridge };
    const nextShell: Record<string, unknown> = { ...shell };

    if (endpointUrl) {
        nextBridge.endpointUrl = endpointUrl;
        nextShell.remoteHost = endpointUrl;
    }
    if (userId) {
        nextBridge.userId = userId;
        nextShell.clientId = userId;
        nextShell.userId = userId;
    }
    if (token) {
        nextBridge.userKey = token;
        nextShell.accessToken = token;
        nextShell.clientToken = token;
    }
    if (core.allowInsecureTls !== undefined) {
        nextBridge.allowInsecureTls = Boolean(core.allowInsecureTls);
    }

    return {
        patch: {
            ...parsed,
            bridge: nextBridge,
            shell: nextShell
        },
        hubTargetChanged: Boolean(endpointUrl),
        hubTarget: endpointUrl
    };
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
        const replyJson = (status: number, body: unknown = {}) => sendJson(res, status, body, req);
        try {
            if (req.method === "OPTIONS") {
                replyJson(204, {});
                return;
            }

            if (!checkKey(key, req.headers["x-api-key"])) {
                replyJson(401, { error: "Unauthorized" });
                return;
            }

            const url = new URL(req.url ?? "/", `http://${host}`);
            const pathName = url.pathname;

            // --- clipboard -------------------------------------------------
            if (pathName === "/service/clipboard") {
                if (!options.onClipboard) {
                    replyJson(503, { error: "Clipboard hooks not attached" });
                    return;
                }
                if (req.method === "GET") {
                    const kind = url.searchParams.get("kind") || "text";
                    const result = await options.onClipboard.read({ kind });
                    replyJson(200, result);
                    return;
                }
                if (req.method === "POST") {
                    const raw = await readBody(req);
                    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
                    const result = await options.onClipboard.write(parsed);
                    replyJson(200, result);
                    return;
                }
                replyJson(405, { error: "Method not allowed" });
                return;
            }

            // --- clipboard prompt (popup UI ↔ hub IPC) -------------------
            // WHY: popup window polls GET and POSTs user actions; same X-API-Key auth as hub.
            if (pathName === "/service/clipboard-prompt") {
                if (req.method === "GET") {
                    if (!options.onClipboardPromptGet) {
                        replyJson(503, { error: "Clipboard prompt not attached" });
                        return;
                    }
                    const state = await options.onClipboardPromptGet();
                    // COMPAT: return BOTH `prompt` (canonical hub field) and `state`
                    // (legacy consumers: popup.js + prompt-toast.ps1 read `data.state`).
                    // Same reference — one source of truth, two alias keys.
                    replyJson(200, { ok: true, prompt: state ?? null, state: state ?? null });
                    return;
                }
                if (req.method === "POST") {
                    if (!options.onClipboardPromptAction) {
                        replyJson(503, { error: "Clipboard prompt not attached" });
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
                        replyJson(400, {
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
                        replyJson(200, {
                            ok: true,
                            applied: Boolean(result.applied),
                            text: String(result.text || ""),
                            hasImage: Boolean(result.hasImage)
                        });
                        return;
                    }
                    replyJson(200, { ok: true, applied: Boolean(result) });
                    return;
                }
                replyJson(405, { error: "Method not allowed" });
                return;
            }

            // --- clipboard hub (Node-owned /ws sync) ----------------------
            if (pathName === "/service/clipboard-hub") {
                if (req.method === "GET") {
                    if (!options.onClipboardHubStatus) {
                        replyJson(503, { error: "Clipboard hub not attached" });
                        return;
                    }
                    const status = await options.onClipboardHubStatus();
                    replyJson(200, { ok: true, ...status });
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
                    replyJson(200, {
                        ok: true,
                        patched: hasAuthPatch,
                        reloaded: shouldReload,
                        ...status
                    });
                    return;
                }
                replyJson(405, { error: "Method not allowed" });
                return;
            }

            // --- protocol dispatch ----------------------------------------
            if (pathName === "/service/dispatch") {
                if (!options.onDispatch) {
                    replyJson(503, { error: "Protocol dispatch not attached" });
                    return;
                }
                if (req.method !== "POST") {
                    replyJson(405, { error: "Method not allowed" });
                    return;
                }
                const raw = await readBody(req);
                const packet = raw ? JSON.parse(raw) : {};
                const result = await options.onDispatch(packet);
                replyJson(200, result ?? { ok: true });
                return;
            }

            // --- settings -------------------------------------------------
            const isService = pathName === "/service/config";
            const isNeutralino = pathName === "/neutralino/config";
            if (!isService && !isNeutralino) {
                replyJson(404, { error: "Not found" });
                return;
            }

            if (req.method === "GET") {
                const [settings, defaults, snapshot] = await Promise.all([
                    backend.get(),
                    backend.defaults(),
                    backend.snapshot()
                ]);
                replyJson(200, {
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
                const before = await backend.get();
                const beforeRemote = String(asRecord(asRecord(before).shell).remoteHost || "").trim();
                const beforeCoreEp = String(asRecord(asRecord(before).core).endpointUrl || "").trim();
                const expanded = expandCoreEndpointIntoPortable(parsed);
                const merged = await backend.patch(expanded.patch);
                const afterRemote = String(asRecord(asRecord(merged).shell).remoteHost || "").trim();
                const afterCoreEp = String(asRecord(asRecord(merged).core).endpointUrl || "").trim();
                const hubChanged =
                    expanded.hubTargetChanged &&
                    (afterRemote !== beforeRemote ||
                        afterCoreEp !== beforeCoreEp ||
                        (expanded.hubTarget && expanded.hubTarget !== beforeRemote));
                // WHY: Node clipboard-hub must dial the new CWSP origin (WAN :8434) after Settings save.
                if (hubChanged && options.onClipboardHubReload) {
                    try {
                        await options.onClipboardHubReload();
                    } catch (error) {
                        console.warn("[cwsp-control] clipboard-hub reload after config patch failed", error);
                    }
                }
                replyJson(200, {
                    ok: true,
                    portable: merged,
                    settings: merged,
                    config: isNeutralino ? { ...shellMeta, ...merged } : merged,
                    hubReloaded: hubChanged
                });
                return;
            }

            replyJson(405, { error: "Method not allowed" });
        } catch (error) {
            replyJson(500, {
                error: error instanceof Error ? error.message : "Internal error"
            });
        }
    });

    const port = await new Promise<number>((resolve, reject) => {
        const preferred = options.port ?? 0;
        const strictPort = options.strictPort === true;
        const tryListen = (portTry: number, attemptsLeft: number): void => {
            const onError = (error: NodeJS.ErrnoException): void => {
                server.off("error", onError);
                // WHY: Cursor.exe often occupies :18765 and the whole :1987x band
                // (TCP accept + empty HTTP → WebView ERR_EMPTY_RESPONSE). Jump out of that band.
                if (
                    error?.code === "EADDRINUSE" &&
                    preferred > 0 &&
                    attemptsLeft > 0 &&
                    !strictPort
                ) {
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
