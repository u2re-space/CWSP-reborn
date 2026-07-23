/*
 * Filename: control.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/control.ts
 * Change date and time: 20.20.00_21.07.2026
 * Reason for changes: Control pairing + 20s rotating deviceCode for public SPA;
 *   ecosystem / desk API key alone cannot authorize https://* Control clones.
 *   Persist chrome-extension Control sessions across Neutralino restarts.
 *   Fix: Origin-less CRX GETs must not validate session against 127.0.0.1.
 *   2026-07-21: Cap Accept large-file pull — bind 0.0.0.0 by default and
 *   exempt GET /service/files-blob (token query is the auth). Loopback-only
 *   listen + X-API-Key gate made phone HTTP GET fail (401 / unreachable).
 *   2026-07-21: restore default LAN bind (was left loopback-only after crash fix).
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";

import type { NodeSettingsBackend, SettingsBlob } from "../settings/types.ts";
import {
    acceptPair,
    allowPairBegin,
    beginPair,
    controlCodePeriodMs,
    currentDeviceCodes,
    defaultDisplayCodePath,
    defaultPublicTokenPath,
    defaultSessionsPath,
    denyPair,
    ensureControlPublicToken,
    getControlPublicToken,
    isAllowedControlOrigin,
    isLoopbackOrCapacitorOrigin,
    matchesControlPublicToken,
    originsEqual,
    pairingDisplayPayload,
    pairStatusPayload,
    regenerateControlPublicToken,
    setControlDeviceSecret,
    startDisplayCodeTicker,
    peekControlSession,
    validateSession,
    verifyDeviceCode,
    isChromeExtensionOrigin
} from "./control-attestation.ts";
import { peerIdsEqual } from "@fest-lib/cwsp-shared/v2/index.ts";

export type ClipboardPromptAction =
    | "share"
    | "dismiss"
    | "erase"
    | "accept"
    | "undo"
    | "take"
    /** files-ready toast: open primary landed file with the default app */
    | "open-file"
    /** files-ready toast: reveal landing folder / select file in Explorer */
    | "open-folder";

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
    /**
     * Stage absolute file paths into files-hub (POST /service/files-ingress).
     * WHY: Neutralino Network screen drop/paste shares files without Explorer-only flow.
     * `fromClipboard: true` reads the current OS CF_HDROP list (paste fallback).
     */
    onFilesIngress?: (input: {
        paths?: string[];
        fromClipboard?: boolean;
    }) => Promise<Record<string, unknown>>;
    /**
     * Serve staged files-hub blob bytes (GET /service/files-blob/:t/:b?token=).
     * WHY: Cap Accept HTTP-pulls large batches; putBlob stub made big shares fail instantly.
     * Prefer `filePath` for streaming multi-GB responses (no full Buffer).
     */
    onFilesBlobGet?: (
        transferId: string,
        batchId: string,
        token: string
    ) => Promise<{
        bytes?: Buffer;
        filePath?: string;
        size?: number;
        mimeType: string;
        name: string;
    } | null>;
    /**
     * Inbound peer Control `/ws` frames (LAN autonomy when hub is down).
     * WHY: Cap/Neu dial each other's Control /ws; reuse clipboard-hub divert.
     */
    onPeerWsMessage?: (raw: unknown, meta?: { peerId?: string; remoteAddress?: string }) => void;
    /**
     * Shared fleet token for peer `/ws` auth (same as hub clientToken).
     * When omitted, resolved from env / settings on each upgrade.
     */
    resolvePeerWsToken?: () => string | Promise<string>;
    /**
     * Canonical peer id for identity-verified `/service/pair/hello` (e.g. L-110).
     * WHY: mesh probes must confirm the answering host matches expected toId.
     */
    resolveLocalClientId?: () => string | Promise<string>;
}

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        req.on("error", reject);
    });
}

const asRecord = (value: unknown): Record<string, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};

/** Browser Origin header (for CORS reflect). */
function requestOrigin(req: IncomingMessage): string {
    return String(req.headers.origin || "").trim();
}

/**
 * Auth-binding origin: prefer real Origin, else CRX `X-Control-Origin`.
 * WHY: Chromium may omit Origin on some extension→loopback GETs after PNA preflight.
 */
function authOrigin(req: IncomingMessage): string {
    const fromHeader = requestOrigin(req);
    if (fromHeader) return fromHeader;
    return String(req.headers["x-control-origin"] || "").trim();
}

function clientIp(req: IncomingMessage): string {
    const xf = String(req.headers["x-forwarded-for"] || "")
        .split(",")[0]
        ?.trim();
    return xf || String(req.socket.remoteAddress || "unknown");
}

function extraAllowedOrigins(settings: SettingsBlob | null | undefined): string {
    const shell = asRecord(asRecord(settings).shell);
    return String(shell.controlAllowedOrigins || "").trim();
}

/**
 * CORS + Chromium Private Network Access for public hubs (e.g. https://cwsp.u2re.space → 127.0.0.1).
 * SECURITY: reflect Origin only when allowlisted (or loopback/Capacitor); never * + credentials for public.
 */
function corsHeaders(
    req: IncomingMessage,
    opts?: { allowedOriginsCsv?: string; forceDeny?: boolean }
): Record<string, string> {
    const origin = requestOrigin(req);
    const wantPna = String(req.headers["access-control-request-private-network"] || "")
        .trim()
        .toLowerCase() === "true";
    const allowed =
        !opts?.forceDeny &&
        (isLoopbackOrCapacitorOrigin(origin) ||
            !origin ||
            isAllowedControlOrigin(origin, opts?.allowedOriginsCsv));
    const headers: Record<string, string> = {
        "Access-Control-Allow-Origin": allowed ? origin || "*" : "null",
        "Access-Control-Allow-Headers":
            "Content-Type, X-API-Key, Authorization, X-Control-Session, X-Control-Origin, X-Skip-Legacy-Key, Access-Control-Request-Private-Network",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Expose-Headers": "X-Control-Session",
        Vary: "Origin, Access-Control-Request-Private-Network"
    };
    if (allowed && (wantPna || origin)) {
        headers["Access-Control-Allow-Private-Network"] = "true";
    }
    return headers;
}

function sendJson(
    res: ServerResponse,
    status: number,
    body: unknown,
    req?: IncomingMessage,
    opts?: { allowedOriginsCsv?: string; forceDeny?: boolean }
): void {
    const payload = status === 204 ? "" : JSON.stringify(body);
    const headers: Record<string, string> = {
        ...(req
            ? corsHeaders(req, opts)
            : {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, X-Control-Session"
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
 *   POST     /service/files-ingress → absolute paths or fromClipboard → filesHub (Network drop/paste)
 *   POST     /service/dispatch   → ProtocolServer.ingest (clipboard/input/…)
 *   GET      /service/pair/hello → discovery (no secrets)
 *   POST     /service/pair/begin → deviceCode + origin → session (desk auto-accept)
 *   GET      /service/pair/status → one-shot session delivery
 *
 * WHY: frontend Settings overlay and clipboard-device share one auth surface;
 * Neutralino.extensions.dispatch does not reliably return runNodeResult.
 * INVARIANT: Win/Linux Neutralino clipboard sync is owned by Node clipboard-hub,
 * not by the WebView websocket push/apply loops.
 * SECURITY: public https Origin must present X-Control-Session after live deviceCode;
 * desk X-API-Key remains for loopback/Capacitor only.
 */
export async function createNeutralinoControlServer(
    options: CreateNeutralinoControlOptions
): Promise<NeutralinoControlServer> {
    // WHY: Cap Accept HTTP-GETs putBlob URLs on the desk LAN IP (:29110).
    // Default bind 0.0.0.0 so phones can pull; WebView still uses 127.0.0.1
    // (same socket). Opt out with CWSP_CONTROL_LAN=0 or CWSP_CONTROL_HOST=127.0.0.1.
    // Fallback to 127.0.0.1 if Windows blocks 0.0.0.0 (EACCES / excluded ranges).
    // INVARIANT: never mix ?? with || without parens — Node --experimental-strip-types
    // throws ERR_INVALID_TYPESCRIPT_SYNTAX and crash-loops :29110.
    const hostFromOpt = options.host != null ? String(options.host).trim() : "";
    const hostFromEnv = String(process.env.CWSP_CONTROL_HOST || "").trim();
    const hostExplicit = hostFromOpt || hostFromEnv;
    const lanEnv = String(process.env.CWSP_CONTROL_LAN || "").trim();
    const lanForcedOff = /^(0|false|no|off)$/i.test(lanEnv);
    const wantLan = !lanForcedOff && (
        hostExplicit === "0.0.0.0"
        || hostExplicit === ""
        || /^(1|true|yes)$/i.test(lanEnv)
    );
    const hostCandidates = hostExplicit
        ? (hostExplicit === "0.0.0.0" ? ["0.0.0.0", "127.0.0.1"] : [hostExplicit])
        : wantLan
            ? ["0.0.0.0", "127.0.0.1"]
            : ["127.0.0.1"];
    let host = hostCandidates[0];
    const key = options.apiKey != null && String(options.apiKey).length > 0
        ? String(options.apiKey)
        : randomBytes(32).toString("hex");
    const { backend } = options;
    const shellMeta = options.shellMeta ?? {};

    // WHY: HMAC seed = Control public token (regenerable), not ecosystem WS token.
    // Desk loopback API key remains `key` for Neutralino WebView; publicToken is separate pairing cred.
    const bootSettings = await backend.get().catch(() => null);
    const shellPub = String(asRecord(asRecord(bootSettings).shell).controlPublicToken || "").trim();
    const pub = ensureControlPublicToken(shellPub || undefined);
    setControlDeviceSecret(pub, {
        displayFile: defaultDisplayCodePath(),
        publicTokenFile: defaultPublicTokenPath(),
        sessionsFile: defaultSessionsPath()
    });
    if (!shellPub || shellPub !== pub) {
        try {
            await backend.patch({ shell: { controlPublicToken: pub } });
        } catch {
            /* ignore */
        }
    }
    startDisplayCodeTicker();

    const readSessionToken = (req: IncomingMessage): string => {
        const direct = String(req.headers["x-control-session"] || "").trim();
        if (direct) return direct;
        const auth = String(req.headers.authorization || "").trim();
        const m = /^Bearer\s+(.+)$/i.exec(auth);
        return m?.[1]?.trim() || "";
    };

    const authorizeRequest = async (req: IncomingMessage): Promise<{ ok: boolean; denyCors?: boolean }> => {
        const origin = authOrigin(req);
        const settings = await backend.get().catch(() => null);
        const allowedCsv = extraAllowedOrigins(settings as SettingsBlob);
        if (origin && !isAllowedControlOrigin(origin, allowedCsv) && !isLoopbackOrCapacitorOrigin(origin)) {
            return { ok: false, denyCors: true };
        }
        const session = readSessionToken(req);
        // WHY: session token presented → validate first (CRX / public SPA).
        if (session) {
            if (origin) {
                if (validateSession(session, origin)) return { ok: true };
                if (!isLoopbackOrCapacitorOrigin(origin)) return { ok: false };
            } else {
                // WHY: never validate CRX session against synthetic http://127.0.0.1.
                const peeked = peekControlSession(session);
                if (peeked && isChromeExtensionOrigin(peeked.origin)) return { ok: true };
                if (peeked && isAllowedControlOrigin(peeked.origin, allowedCsv)) return { ok: true };
            }
        }
        // Public / extension Origin without valid session: deny (never desk API key).
        if (origin && !isLoopbackOrCapacitorOrigin(origin)) {
            return { ok: false };
        }
        // Loopback / no Origin (Neutralino WebView, local tools): desk API key.
        if (checkKey(key, req.headers["x-api-key"])) return { ok: true };
        return { ok: false };
    };

    const server = createServer(async (req, res) => {
        const corsOrigin = requestOrigin(req);
        const origin = authOrigin(req);
        let allowedCsv = "";
        try {
            const settings = await backend.get();
            allowedCsv = extraAllowedOrigins(settings as SettingsBlob);
        } catch {
            /* ignore */
        }
        const replyJson = (status: number, body: unknown = {}, forceDeny = false) =>
            sendJson(res, status, body, req, { allowedOriginsCsv: allowedCsv, forceDeny });
        try {
            if (req.method === "OPTIONS") {
                if (
                    corsOrigin &&
                    !isAllowedControlOrigin(corsOrigin, allowedCsv) &&
                    !isLoopbackOrCapacitorOrigin(corsOrigin)
                ) {
                    replyJson(403, { error: "Origin not allowed" }, true);
                    return;
                }
                replyJson(204, {});
                return;
            }

            const url = new URL(req.url ?? "/", `http://${host}`);
            const pathName = url.pathname;

            // --- pairing (no desk key / session required) -----------------
            if (pathName === "/service/pair/hello" && (req.method === "GET" || req.method === "HEAD")) {
                if (origin && !isAllowedControlOrigin(origin, allowedCsv) && !isLoopbackOrCapacitorOrigin(origin)) {
                    replyJson(403, { error: "Origin not allowed" }, true);
                    return;
                }
                const codes = currentDeviceCodes();
                const pub = getControlPublicToken();
                // WHY: CRX can confirm UI token matches this process (suffix only — not the secret).
                const publicTokenSuffix = pub.length >= 4 ? pub.slice(-4) : "";
                let clientId = "";
                try {
                    if (options.resolveLocalClientId) {
                        clientId = String(await options.resolveLocalClientId() || "").trim();
                    }
                } catch {
                    clientId = "";
                }
                if (!clientId) {
                    try {
                        const settings = await backend.get();
                        const shell = (settings as { shell?: Record<string, unknown> })?.shell;
                        clientId = String(
                            shell?.clientId || shell?.userId || process.env.CWSP_CLIENT_ID || "L-110"
                        ).trim();
                    } catch {
                        clientId = String(process.env.CWSP_CLIENT_ID || "L-110").trim();
                    }
                }
                const expectId = String(url.searchParams.get("expectId") || "").trim();
                if (expectId && clientId && !peerIdsEqual(expectId, clientId)) {
                    replyJson(409, {
                        ok: false,
                        pairing: true,
                        clientId,
                        peerId: clientId,
                        error: "expectId-mismatch",
                        expected: expectId
                    }, true);
                    return;
                }
                const body = {
                    ok: true,
                    pairing: true,
                    clientId,
                    peerId: clientId,
                    deviceCodePeriodMs: controlCodePeriodMs(),
                    // SECURITY: never return the live code / full public token — only TTL + suffix.
                    deviceCodeExpiresInMs: codes.expiresInMs,
                    publicTokenSuffix,
                    control: {
                        surface: "neutralino-node",
                        pairing: true,
                        auth: "session",
                        port: Number((req.headers.host || "").split(":").pop()) || undefined,
                        deviceCodePeriodMs: controlCodePeriodMs(),
                        publicTokenSuffix,
                        clientId
                    }
                };
                // HEAD: headers + empty body (identity still in JSON for GET).
                if (req.method === "HEAD") {
                    replyJson(200, body, true);
                    return;
                }
                replyJson(200, body);
                return;
            }

            if (pathName === "/service/pair/begin" && req.method === "POST") {
                if (origin && !isAllowedControlOrigin(origin, allowedCsv) && !isLoopbackOrCapacitorOrigin(origin)) {
                    replyJson(403, { error: "Origin not allowed" }, true);
                    return;
                }
                if (!allowPairBegin(clientIp(req))) {
                    replyJson(429, { error: "Too many pair attempts" });
                    return;
                }
                const raw = await readBody(req);
                const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
                const bodyOrigin = String(body.origin || origin || "").trim();
                const clientLabel = String(body.clientLabel || "").trim();
                const deviceCode = String(body.deviceCode || body.code || "").trim();
                const publicToken = String(body.publicToken || body.controlPublicToken || "").trim();
                if (!bodyOrigin) {
                    replyJson(400, { error: "origin required" });
                    return;
                }
                if (!isAllowedControlOrigin(bodyOrigin, allowedCsv)) {
                    replyJson(403, { error: "Origin not allowed" });
                    return;
                }
                if (origin && !originsEqual(origin, bodyOrigin)) {
                    replyJson(403, { error: "Origin mismatch" });
                    return;
                }
                // SECURITY: stable publicToken + live 20s deviceCode (not ecosystem token).
                if (!matchesControlPublicToken(publicToken)) {
                    replyJson(403, { error: "Invalid public token" });
                    return;
                }
                if (!verifyDeviceCode(deviceCode)) {
                    replyJson(403, { error: "Invalid or expired device code" });
                    return;
                }
                const pair = beginPair(bodyOrigin, clientLabel);
                // WHY: desk has no Accept notification — valid deviceCode *is* physical confirmation.
                acceptPair(pair.pairId);
                const status = pairStatusPayload(pair.pairId);
                replyJson(200, {
                    ok: true,
                    pairId: pair.pairId,
                    pairCode: pair.pairCode,
                    expiresAt: pair.expiresAtMs,
                    state: status.state,
                    session: status.session,
                    sessionExpiresAt: status.sessionExpiresAt,
                    sessionPersistent: status.sessionPersistent,
                    deviceCodePeriodMs: controlCodePeriodMs()
                });
                return;
            }

            if (pathName === "/service/pair/status" && req.method === "GET") {
                if (origin && !isAllowedControlOrigin(origin, allowedCsv) && !isLoopbackOrCapacitorOrigin(origin)) {
                    replyJson(403, { error: "Origin not allowed" }, true);
                    return;
                }
                const pairId = String(url.searchParams.get("pairId") || "").trim();
                const status = pairStatusPayload(pairId);
                const pairOrigin = String(status.origin || "");
                if (origin && pairOrigin && !originsEqual(pairOrigin, origin)) {
                    replyJson(403, { error: "Origin mismatch" });
                    return;
                }
                replyJson(200, status);
                return;
            }

            // Desk-local deny (optional; loopback API key).
            if (pathName === "/service/pair/deny" && req.method === "POST") {
                if (!checkKey(key, req.headers["x-api-key"])) {
                    replyJson(401, { error: "Unauthorized" });
                    return;
                }
                const raw = await readBody(req);
                const body = raw ? (JSON.parse(raw) as { pairId?: string }) : {};
                const ok = denyPair(String(body.pairId || ""));
                replyJson(200, { ok });
                return;
            }

            // Loopback-only: show public token + live device code for Settings UI.
            if (pathName === "/service/pair/display" && req.method === "GET") {
                if (!checkKey(key, req.headers["x-api-key"]) && !isLoopbackOrCapacitorOrigin(origin)) {
                    replyJson(401, { error: "Unauthorized" });
                    return;
                }
                if (!isLoopbackOrCapacitorOrigin(origin) && origin) {
                    replyJson(403, { error: "Display is loopback-only" });
                    return;
                }
                replyJson(200, { ok: true, ...pairingDisplayPayload() });
                return;
            }

            if (pathName === "/service/pair/regenerate-public-token" && req.method === "POST") {
                if (!checkKey(key, req.headers["x-api-key"])) {
                    replyJson(401, { error: "Unauthorized" });
                    return;
                }
                const token = regenerateControlPublicToken();
                try {
                    await backend.patch({ shell: { controlPublicToken: token } });
                } catch {
                    /* ignore */
                }
                replyJson(200, { ok: true, ...pairingDisplayPayload() });
                return;
            }

            // --- files blob (Cap HTTP pull) — BEFORE desk API-key gate -------
            // WHY: Cap Accept only sends ?token= (no X-API-Key). Token is
            // validated inside onFilesBlobGet / getFilesBlobBytes. Requiring
            // authorizeRequest here caused instant 401 → "Files transfer failed".
            if (pathName.startsWith("/service/files-blob/")) {
                if (req.method === "GET" || req.method === "HEAD") {
                    if (!options.onFilesBlobGet) {
                        replyJson(503, { error: "Files blob store not attached" });
                        return;
                    }
                    const parts = pathName.split("/").filter(Boolean);
                    // service files-blob :transferId :batchId
                    const transferId = parts[2] ? decodeURIComponent(parts[2]) : "";
                    const batchId = parts[3] ? decodeURIComponent(parts[3]) : "";
                    const q = url.searchParams.get("token") || "";
                    if (!transferId || !batchId) {
                        replyJson(400, { error: "transferId/batchId required" });
                        return;
                    }
                    if (!q) {
                        replyJson(401, { error: "token required" });
                        return;
                    }
                    try {
                        const hit = await options.onFilesBlobGet(transferId, batchId, q);
                        if (!hit) {
                            replyJson(404, { error: "blob not found or expired" });
                            return;
                        }
                        const { createReadStream } = await import("node:fs");
                        const { stat } = await import("node:fs/promises");
                        let size = hit.size ?? hit.bytes?.length ?? 0;
                        if (hit.filePath && !(size > 0)) {
                            try {
                                size = (await stat(hit.filePath)).size;
                            } catch {
                                replyJson(404, { error: "blob file missing" });
                                return;
                            }
                        }
                        res.writeHead(200, {
                            "Content-Type": hit.mimeType || "application/octet-stream",
                            "Content-Length": String(size),
                            "Content-Disposition": `attachment; filename="${String(hit.name || batchId).replace(/"/g, "")}"`,
                            "Cache-Control": "no-store",
                            "Access-Control-Allow-Origin": "*",
                        });
                        if (req.method === "HEAD") {
                            res.end();
                            return;
                        }
                        // WHY: stream from disk for GB blobs — res.end(Buffer) OOMs Node.
                        if (hit.filePath) {
                            const stream = createReadStream(hit.filePath);
                            stream.on("error", () => {
                                try { res.destroy(); } catch { /* */ }
                            });
                            stream.pipe(res);
                            return;
                        }
                        res.end(hit.bytes ?? Buffer.alloc(0));
                    } catch (error) {
                        replyJson(500, {
                            error: error instanceof Error ? error.message : String(error),
                        });
                    }
                    return;
                }
                replyJson(405, { error: "Method not allowed" });
                return;
            }

            const auth = await authorizeRequest(req);
            if (!auth.ok) {
                replyJson(401, { error: "Unauthorized" }, Boolean(auth.denyCors));
                return;
            }

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
                        "take",
                        "open-file",
                        "open-folder"
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

            // --- files ingress (Network drop → filesHub) --------------------
            if (pathName === "/service/files-ingress") {
                if (req.method === "POST") {
                    if (!options.onFilesIngress) {
                        replyJson(503, { error: "Files hub not attached" });
                        return;
                    }
                    try {
                        const raw = await readBody(req);
                        const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
                        const fromClipboard = body.fromClipboard === true || body.fromClipboard === "true";
                        const pathsRaw = body.paths;
                        const paths = Array.isArray(pathsRaw)
                            ? pathsRaw.map((p) => String(p || "").trim()).filter(Boolean)
                            : typeof body.path === "string" && body.path.trim()
                              ? [body.path.trim()]
                              : [];
                        if (!fromClipboard && paths.length === 0) {
                            replyJson(400, { ok: false, error: "paths or fromClipboard required" });
                            return;
                        }
                        // SECURITY: only absolute local paths — no URLs / relative traversal.
                        const safe = paths.filter((p) => {
                            if (p.includes("://")) return false;
                            if (p.startsWith("\\\\")) return true; // UNC
                            if (/^[A-Za-z]:[\\/]/.test(p)) return true; // Windows
                            if (p.startsWith("/")) return true; // POSIX
                            return false;
                        });
                        if (!fromClipboard && safe.length === 0) {
                            replyJson(400, { ok: false, error: "absolute paths required" });
                            return;
                        }
                        const result = await options.onFilesIngress({
                            paths: safe,
                            fromClipboard
                        });
                        replyJson(200, { ok: true, ...result });
                    } catch (error) {
                        replyJson(500, {
                            ok: false,
                            error: error instanceof Error ? error.message : String(error)
                        });
                    }
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
        let hostIdx = 0;
        host = hostCandidates[0];
        const tryListen = (portTry: number, attemptsLeft: number): void => {
            const onError = (error: NodeJS.ErrnoException): void => {
                server.off("error", onError);
                const code = String(error?.code || "");
                // WHY: 0.0.0.0 can fail on Windows (excluded ranges / ACL) while
                // 127.0.0.1 still works — fall back so WebView :29110 stays up.
                if (
                    (code === "EACCES" || code === "EADDRNOTAVAIL" || code === "EINVAL")
                    && hostIdx + 1 < hostCandidates.length
                ) {
                    hostIdx += 1;
                    host = hostCandidates[hostIdx];
                    console.warn(
                        `[cwsp-control] bind ${hostCandidates[hostIdx - 1]}:${portTry} failed (${code}) — fallback host ${host}`
                    );
                    tryListen(portTry, attemptsLeft);
                    return;
                }
                // WHY: Cursor.exe often occupies :18765 and the whole :1987x band
                // (TCP accept + empty HTTP → WebView ERR_EMPTY_RESPONSE). Jump out of that band.
                if (
                    code === "EADDRINUSE" &&
                    preferred > 0 &&
                    attemptsLeft > 0 &&
                    !strictPort
                ) {
                    // If 0.0.0.0 is busy, try loopback on same port before bumping.
                    if (hostIdx + 1 < hostCandidates.length && host !== "127.0.0.1") {
                        hostIdx += 1;
                        host = hostCandidates[hostIdx];
                        console.warn(
                            `[cwsp-control] ${hostCandidates[hostIdx - 1]}:${portTry} busy — fallback host ${host}`
                        );
                        tryListen(portTry, attemptsLeft);
                        return;
                    }
                    let next = portTry + 1;
                    if (portTry >= 18700 && portTry < 20000) {
                        next = 29110;
                    } else if (next === portTry) {
                        next = portTry + 1;
                    }
                    // Avoid re-trying the same Cursor-owned port forever.
                    if (next === portTry) next = portTry + 11;
                    // Reset host chain for the new port (prefer LAN again).
                    hostIdx = 0;
                    host = hostCandidates[0];
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
                // WHY: Node 18+ default requestTimeout=300s aborts GB files-blob
                // streams mid-progress while Cap Accept bar is still moving.
                try {
                    server.requestTimeout = 0;
                    server.headersTimeout = 0;
                    server.keepAliveTimeout = 120_000;
                    // Idle socket timeout 0 = unlimited (long Cap P2P GET).
                    server.timeout = 0;
                } catch {
                    /* older Node */
                }
                console.log(JSON.stringify({
                    channel: "cwsp-control",
                    event: "listen",
                    host,
                    port: portTry,
                    lanBlob: host === "0.0.0.0",
                    requestTimeout: 0
                }));
                const addr = server.address();
                if (addr && typeof addr === "object") resolve(addr.port);
                else reject(new Error("Neutralino control server failed to bind"));
            });
        };
        tryListen(preferred, preferred > 0 ? 8 : 0);
    });

    // WHY: LAN autonomy — Cap dials desk Control /ws when hub is down.
    // Attach after listen so `server` is bound; path must be exactly /ws.
    let peerWss: { close: () => void } | null = null;
    try {
        const { WebSocketServer } = await import("ws");
        const wss = new WebSocketServer({ noServer: true });
        peerWss = wss;
        server.on("upgrade", async (req, socket, head) => {
            try {
                const u = new URL(req.url || "/", "http://127.0.0.1");
                if (u.pathname !== "/ws") {
                    socket.destroy();
                    return;
                }
                const q = u.searchParams;
                const peerId = String(
                    q.get("clientId") || q.get("userId") || q.get("peerId") || ""
                ).trim();
                const presented = String(
                    q.get("token")
                        || q.get("userKey")
                        || q.get("accessToken")
                        || q.get("clientToken")
                        || ""
                ).trim();
                let expected = "";
                if (typeof options.resolvePeerWsToken === "function") {
                    expected = String((await options.resolvePeerWsToken()) || "").trim();
                }
                if (!expected) {
                    const settings = await backend.get().catch(() => null);
                    const shell = asRecord(asRecord(settings).shell);
                    const core = asRecord(asRecord(settings).core);
                    const ops = asRecord(core.ops);
                    expected = String(
                        process.env.CWSP_CLIENT_TOKEN
                            || process.env.CWS_CLIENT_TOKEN
                            || shell.clientToken
                            || shell.accessToken
                            || ops.clientToken
                            || core.ecosystemToken
                            || core.userKey
                            || ""
                    ).trim();
                }
                // SECURITY: require shared fleet token; reject empty.
                if (!expected || !presented || presented !== expected) {
                    socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
                    socket.destroy();
                    return;
                }
                wss.handleUpgrade(req, socket, head, (ws) => {
                    const remote =
                        String(req.socket.remoteAddress || "").replace(/^::ffff:/, "");
                    console.log(JSON.stringify({
                        channel: "cwsp-control",
                        event: "peer-ws-open",
                        peerId: peerId || null,
                        remote,
                        port
                    }));
                    ws.on("message", (data) => {
                        if (typeof options.onPeerWsMessage !== "function") return;
                        try {
                            options.onPeerWsMessage(data, {
                                peerId: peerId || undefined,
                                remoteAddress: remote
                            });
                        } catch (err) {
                            console.warn(JSON.stringify({
                                channel: "cwsp-control",
                                event: "peer-ws-handler-error",
                                error: err instanceof Error ? err.message : String(err)
                            }));
                        }
                    });
                    ws.on("close", () => {
                        console.log(JSON.stringify({
                            channel: "cwsp-control",
                            event: "peer-ws-close",
                            peerId: peerId || null,
                            remote
                        }));
                    });
                });
            } catch {
                try {
                    socket.destroy();
                } catch {
                    /* */
                }
            }
        });
        console.log(JSON.stringify({
            channel: "cwsp-control",
            event: "peer-ws-ready",
            port
        }));
    } catch (err) {
        console.warn(JSON.stringify({
            channel: "cwsp-control",
            event: "peer-ws-skip",
            error: err instanceof Error ? err.message : String(err)
        }));
    }

    return {
        auth: { port, key },
        server,
        close: () =>
            new Promise((resolve, reject) => {
                try {
                    peerWss?.close();
                } catch {
                    /* */
                }
                server.close((err) => (err ? reject(err) : resolve()));
            })
    };
}
