/*
 * Filename: clipboard-hub.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-hub.ts
 * Change date and time: 13.10.00_21.07.2026
 * Reason for changes: Add clipboard prompt policy (auto/ask + pending hold + erase/undo)
 *   per docs/superpowers/specs/2026-07-14-clipboard-prompt-popup-design.md.
 *   Prefer imageThumbPath over inline data URL in holdToState.
 *   Multi-line textPreview (keep newlines) for Share/Accept toast/popup.
 *   2026-07-21: pong watchdog + reconnect-while-connecting queue (idle/sleep half-open /ws).
 *   Hub owns detect/decide/share/apply gates; popup UI is rendered by Neutralino.
 *   2026-07-17: snapshot previousImage before apply (Undo restores image when
 *   present, else previousText); expose dismissMs + imageThumbDataUrl on
 *   ClipboardPromptState so popup/toast can auto-dismiss and render thumbs.
 *   2026-07-17: outbound image ask/Share + auto toast; persist thumb file path
 *   for WinForms toast (large PNGs cannot inline as data URLs).
 *   2026-07-18: WS stability — protocol ping keepalive + slow backoff on 4001
 *   (invalid credentials) so Neutralino desk hub stays warm under tray/idle.
 *   2026-07-18b: self-loop guards — ask-mode poll must seed lastPushText and
 *   skip while the same outbound hold is active; content-echo inbound suppress.
 *   2026-07-18c: sticky dismiss — after Dismiss/timeout, never re-open ask/auto
 *   toast for the same OS clipboard text/hash until the user copies something else.
 *   2026-07-19: after long idle, Win clipboard lock must not poison lastError or
 *   re-arm ask toast — soft-skip CLIPBOARD_BUSY / "did not succeed"; on poll
 *   reconnect re-seed sticky + lastPushText so standby loops are suppressed.
 *   2026-07-19b: takeInboundAskForPaste — Accept + return full hold text for
 *   CRX "Paste by CWSP" / Android PROCESS_TEXT (bypass Accept popup click).
 *   2026-07-20: WS close / reconnect wake clears stale promptHold so Waiting
 *   toast cannot respawn against a dead or half-awake control path.
 */

import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import {
    extractClipboardAsset,
    type DataAssetEnvelope
} from "@fest-lib/cwsp-shared/v2/index.ts";
import { createCwspWsUrl } from "protocol/node/network/WebSocket.ts";
import { createClipboardEmission } from "../emission/Clipboardy.ts";
import type { SettingsBlob } from "../settings/types.ts";

export interface ClipboardHubAdapters {
    readText(): Promise<string>;
    writeText(text: string): Promise<void>;
    /** Preferred inbound path: ProtocolServer.ingest (text + image + aliases). */
    ingest?(packet: unknown): Promise<unknown>;
    /** Windows: WinForms ContainsImage (optional). */
    containsImage?(): Promise<boolean>;
    /** Windows: PS1 GetImage → PNG base64 (optional; clipboardy cannot do this). */
    readImageBase64?(): Promise<string | null>;
    /** Windows: PS1 SetImage from PNG/base64 (optional). */
    writeImageBase64?(data: string): Promise<void>;
}

export type ClipboardPromptKind = "outbound" | "inbound";
export type ClipboardPromptMode = "auto" | "ask";
export type ClipboardPromptAction = "share" | "dismiss" | "erase" | "accept" | "undo";

/**
 * Public prompt state consumed by the popup UI / control RPC.
 * WHY: full asset bytes never leave the hub — only a compact preview + hash
 * so the popup stays small and the WebView never owns the binary payload.
 */
export interface ClipboardPromptState {
    /** Stable id (randomUUID) for UI tracking + dedupe. */
    id: string;
    kind: ClipboardPromptKind;
    mode: ClipboardPromptMode;
    /**
     * Truncated text preview for spoiler/toast display.
     * WHY: keeps newlines (≤4 lines / ≤180 chars) so Share/Accept shows
     * multi-line clipboard content instead of a collapsed one-liner.
     */
    textPreview: string;
    /**
     * Full held text for authenticated loopback control (CRX Paste / take).
     * WHY: popup UI uses textPreview only; Paste by CWSP needs the complete body
     * without a manual Accept click.
     */
    text: string;
    /** Full text length (spoiler collapses long content). */
    textLength: number;
    /** True when an image/file asset is the payload (text may be empty). */
    hasImage: boolean;
    /** Asset hash when available (dedupe key + thumb identifier). */
    assetHash: string;
    /** Asset MIME type when available (e.g. image/png). */
    assetMimeType: string;
    /** Asset size in bytes (UI display). */
    assetSize: number;
    /** Outbound auto: show Erase button. */
    showErase: boolean;
    /** Inbound auto: show Undo button. */
    showUndo: boolean;
    /** Absolute ms timestamp when the popup auto-dismisses. */
    expiresAt: number;
    /** Auto-dismiss window (ms) the popup/toast should use; mirrors hold expiresAt span. */
    dismissMs: number;
    /**
     * Data URL (or bare base64) thumbnail for the held image asset.
     * WHY: full asset bytes never leave the hub — only a compact thumb so the
     * popup/PowerShell toast can render a preview without owning the binary.
     * Empty when the asset is too large to inline (hasImage stays true; see imageThumbPath).
     */
    imageThumbDataUrl: string;
    /**
     * Absolute path to a PNG preview file under packageRoot/.tmp/clipboard-prompt/.
     * WHY: WinForms toast can Load FromFile for large clipboard images that exceed
     * the inline data-URL budget; Neutralino HTML popup still uses imageThumbDataUrl.
     */
    imageThumbPath: string;
    /** Sender peer id for inbound prompts (diagnostics). */
    sender: string;
    /** Outbound destination peer ids (diagnostics). */
    targets: string[];
}

/**
 * Internal hold for pending ask-mode ops and the data needed to fulfil/dismiss them.
 * INVARIANT: only one prompt is active at a time — newer prompts replace older
 * duplicates by fingerprint; different prompts replace and discard the prior hold.
 */
interface ClipboardPromptHold {
    id: string;
    kind: ClipboardPromptKind;
    mode: ClipboardPromptMode;
    /** Normalized clipboard text (outbound share or inbound apply). */
    text: string;
    /** Asset bytes + compact metadata when the payload is an image/file. */
    asset?: { data: string; hash?: string; size?: number; mimeType?: string };
    /** Outbound destination peer ids. */
    nodes: string[];
    /** Inbound sender peer id (empty for outbound). */
    sender: string;
    /** Inbound auto snapshot of OS clipboard text before apply (for Undo). */
    previousText: string;
    /** Inbound auto snapshot of OS clipboard image (PNG base64) before apply.
     * WHY: when the inbound apply overwrote an image, Undo must restore the
     * prior image, not just the prior text. Empty when the OS clipboard had no
     * image or no image adapter is available.
     */
    previousImage?: string;
    /** Auto-dismiss window (ms) — stored at hold creation so holdToState is stable. */
    dismissMs: number;
    /** Outbound auto: show Erase button (from `clipboardOutboundShowErase` setting). */
    showErase: boolean;
    /** Inbound auto: show Undo button (from `clipboardInboundShowUndo` setting). */
    showUndo: boolean;
    /** Absolute ms timestamp when the hold auto-dismisses. */
    expiresAt: number;
    /** Dedupe fingerprint (kind|mode|text|hash) to suppress popup stacking. */
    fingerprint: string;
}

export interface ClipboardHubOptions {
    localId: string;
    /** Fresh settings snapshot (portable.config.json via Node settings backend). */
    getSettings: () => Promise<SettingsBlob>;
    adapters: ClipboardHubAdapters;
    /** Package root for `.tmp/cwsp-hub-auth.json` (tokens from WebView sync). */
    packageRoot?: string;
    /** Local OS clipboard poll interval (ms). */
    pollMs?: number;
    /** WS reconnect base delay (ms). */
    reconnectMs?: number;
    /** Echo suppress after applying remote text (ms). */
    echoSuppressMs?: number;
    /**
     * Prompt push callback — fired whenever the active prompt changes.
     * WHY: host (Node backend) forwards this to the control RPC / Neutralino
     * popup bridge so the WebView can render the toast without polling tight.
     * The callback receives `null` when the prompt is cleared.
     */
    onPromptUpdate?: (state: ClipboardPromptState | null) => void;
}

export interface ClipboardHubStatus {
    running: boolean;
    connected: boolean;
    hubUrl: string;
    localId: string;
    lastPushAt: number;
    lastInboundAt: number;
    /** Absolute ms until outbound push is allowed after phone inbound (sink window). */
    outboundHoldUntil: number;
    lastError: string;
    lastPushTextLength: number;
    hasToken: boolean;
    /** Last outbound destination list (diagnostics). */
    lastTargets: string[];
    /** Last pushed/applied image hash (empty if none). */
    lastImageHash: string;
    /** True when a prompt popup is currently active (ask hold or auto toast). */
    hasPrompt: boolean;
    /** Current prompt kind ("outbound" | "inbound") or empty when none. */
    promptKind: string;
    /** Current prompt mode ("auto" | "ask") or empty when none. */
    promptMode: string;
}

export interface ClipboardHubRuntime {
    start(): void;
    stop(): void;
    /** Force reconnect (e.g. after WebView synced tokens into settings). */
    reload(): void;
    status(): ClipboardHubStatus;
    /** Current prompt state for popup UI / control RPC, or null when none. */
    getPromptState(): ClipboardPromptState | null;
    /**
     * Resolve the active prompt with a user action.
     * Returns true when the action was applied to the active prompt.
     * WHY: safe to call when no prompt is active (returns false, no side effect).
     */
    resolvePrompt(action: ClipboardPromptAction): Promise<boolean>;
    /**
     * Accept pending inbound ask-hold and return full text (CRX / PROCESS_TEXT paste bypass).
     * WHY: GET prompt only exposes textPreview — Paste by CWSP needs the full hold body
     * and must dismiss the Accept popup without a manual click.
     */
    takeInboundAskForPaste(): Promise<{ applied: boolean; text: string; hasImage: boolean }>;
}

type WsLike = {
    readyState: number;
    send(data: string): void;
    close(): void;
    ping?(data?: Buffer): void;
    on?(event: string, listener: (...args: unknown[]) => void): void;
    addEventListener?(event: string, listener: (...args: unknown[]) => void): void;
    removeAllListeners?(event?: string): void;
};

const OPEN = 1;
const DEFAULT_POLL_MS = 600;
const DEFAULT_RECONNECT_MS = 1500;
/** Protocol ping interval — keeps NAT/idle paths from silently dropping /ws. */
const DEFAULT_KEEPALIVE_MS = 15000;
/**
 * WHY: after sleep/NAT, readyState can stay OPEN while the peer is dead.
 * No pong within this window → terminate() so close→reconnect can run.
 */
const DEFAULT_PONG_TIMEOUT_MS = 45000;
/** Auth-reject close from gateway — do not storm reconnect. */
const WS_CLOSE_INVALID_CREDENTIALS = 4001;
const AUTH_RECONNECT_MS = 30000;
/** WHY: outlast Android A2A + gateway hops so desk cannot stomp phone↔phone mid-flight. */
const DEFAULT_ECHO_MS = 12000;
/**
 * WHY: after any phone→desk apply, hold ALL outbound pushes. Quiet alone was too short when
 * OS clipboard later drifted to residual desk text and tickPush fan-out rewrote both phones.
 */
const OUTBOUND_HOLD_AFTER_INBOUND_MS = 8000;
/** Triangle defaults when settings omit routeTarget — avoid `*` + stale inactive peers. */
const DEFAULT_BROADCAST_TARGETS = ["L-196", "L-210"];
const DEFAULT_HUB = "https://192.168.0.200:8434/";

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

/**
 * WHY: Windows clipboardy often round-trips `\n` → `\r\n`. Strict string equality then
 * treats the just-applied Android text as "new" and fan-outs a rewrite to phones.
 */
function normalizeClipboardText(value: unknown): string {
    return String(value ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();
}

function dig(blob: SettingsBlob, pathParts: string[]): unknown {
    let cur: unknown = blob;
    for (const key of pathParts) {
        const rec = asRecord(cur);
        if (!(key in rec)) return undefined;
        cur = rec[key];
    }
    return cur;
}

function firstString(...values: unknown[]): string {
    for (const v of values) {
        if (typeof v === "string" && v.trim()) return v.trim();
        if (typeof v === "number" && Number.isFinite(v)) return String(v);
    }
    return "";
}

function splitList(value: string): string[] {
    return value
        .split(/[,;\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

function httpsToWssOrigin(origin: string): string {
    const t = origin.trim();
    if (!t) return "";
    if (/^wss?:\/\//i.test(t)) return t.replace(/\/+$/, "");
    if (/^https:\/\//i.test(t)) return t.replace(/^https/i, "wss").replace(/\/+$/, "");
    if (/^http:\/\//i.test(t)) return t.replace(/^http/i, "ws").replace(/\/+$/, "");
    if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(t)) return `wss://${t}`;
    if (/^[a-z0-9.-]+(?::\d+)?$/i.test(t)) return `wss://${t}`;
    return t.replace(/\/+$/, "");
}

function readHubAuthFile(packageRoot?: string): Record<string, unknown> {
    const roots = [
        packageRoot,
        process.env.CWSP_NL_PACKAGE_ROOT,
        process.env.CWSP_ROOT,
        process.cwd()
    ].filter(Boolean) as string[];
    for (const root of roots) {
        const filePath = path.join(root, ".tmp", "cwsp-hub-auth.json");
        try {
            if (!fs.existsSync(filePath)) continue;
            const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
            return asRecord(parsed);
        } catch {
            /* ignore corrupt auth file */
        }
    }
    return {};
}

function resolveHubCandidates(settings: SettingsBlob, packageRoot?: string): string[] {
    const fileAuth = readHubAuthFile(packageRoot);
    const fromEnv = [
        process.env.CWSP_HUB_URL,
        process.env.CWSP_HUB_URLS
    ]
        .filter(Boolean)
        .flatMap((v) => splitList(String(v)));

    // WHY: prefer explicit hub/LAN origins before WAN gateway `remoteHost`.
    // Boot sync used to put WAN first → connect, NAT drop, Connected→Disconnected flap.
    // NOTE: Settings UI SoT is `core.endpointUrl` (e.g. https://45.147.121.152:8434/) — must be read.
    const fromHubPreferred = [
        fileAuth.hubUrl,
        dig(settings, ["shell", "hubUrl"]),
        dig(settings, ["core", "ops", "hubUrl"]),
        dig(settings, ["core", "ops", "endpointUrl"]),
        dig(settings, ["socket", "hubUrl"])
    ]
        .filter(Boolean)
        .flatMap((v) => splitList(String(v)));

    const fromRemoteFallback = [
        process.env.CWSP_REMOTE_HOST,
        process.env.CWSP_ENDPOINT_URL,
        fileAuth.remoteHost,
        // Settings → Server /cwsp: primary connect URL written as core.endpointUrl
        dig(settings, ["core", "endpointUrl"]),
        dig(settings, ["shell", "remoteHost"]),
        dig(settings, ["socket", "remoteHost"]),
        dig(settings, ["bridge", "endpointUrl"]),
        dig(settings, ["network", "remoteHost"])
    ]
        .filter(Boolean)
        .flatMap((v) => splitList(String(v)));

    const raw = [...fromEnv, ...fromHubPreferred, ...fromRemoteFallback];
    if (!raw.length) raw.push(DEFAULT_HUB);

    const out: string[] = [];
    const seen = new Set<string>();
    for (const entry of raw) {
        const origin = httpsToWssOrigin(entry);
        if (!origin) continue;
        const url = origin.includes("/ws") ? origin : createCwspWsUrl(origin, "ws");
        const key = url.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(url);
    }
    return out;
}

function resolveAccessToken(settings: SettingsBlob, packageRoot?: string): string {
    const fileAuth = readHubAuthFile(packageRoot);
    return firstString(
        process.env.CWSP_ACCESS_TOKEN,
        process.env.CWS_CLIENT_TOKEN,
        process.env.CWSP_CLIENT_TOKEN,
        fileAuth.accessToken,
        fileAuth.clientToken,
        fileAuth.token,
        dig(settings, ["shell", "accessToken"]),
        dig(settings, ["socket", "accessToken"]),
        dig(settings, ["core", "ops", "accessToken"]),
        dig(settings, ["core", "ecosystemToken"]),
        dig(settings, ["core", "userKey"]),
        dig(settings, ["bridge", "userKey"])
    );
}

function resolveClientToken(settings: SettingsBlob, packageRoot?: string): string {
    const fileAuth = readHubAuthFile(packageRoot);
    return firstString(
        process.env.CWSP_CLIENT_TOKEN,
        process.env.CWS_CLIENT_TOKEN,
        fileAuth.clientToken,
        fileAuth.accessToken,
        fileAuth.token,
        dig(settings, ["shell", "clientToken"]),
        dig(settings, ["socket", "clientToken"]),
        dig(settings, ["core", "ops", "clientToken"]),
        dig(settings, ["core", "ecosystemToken"]),
        dig(settings, ["core", "userKey"]),
        resolveAccessToken(settings, packageRoot)
    );
}

function resolveBroadcastTargets(settings: SettingsBlob, localId: string): string[] {
    const raw = firstString(
        process.env.CWSP_CLIPBOARD_TARGETS,
        dig(settings, ["shell", "clipboardBroadcastTargets"]),
        dig(settings, ["core", "socket", "routeTarget"]),
        dig(settings, ["socket", "routeTarget"]),
        dig(settings, ["shell", "remoteRouteTarget"]),
        dig(settings, ["core", "ops", "clipboardTargets"])
    );
    const local = String(localId || "").trim().toLowerCase();
    const nodes = splitList(raw).filter((n) => {
        const key = n.trim().toLowerCase();
        if (!key || key === "self") return false;
        if (local && (key === local || key === `l-${local.replace(/^l-/, "")}`)) return false;
        return true;
    });
    // WHY: empty `*` fan-out historically replayed into offline/stale peers and looked like "history".
    return nodes.length ? nodes : [...DEFAULT_BROADCAST_TARGETS];
}

function resolvePollMs(settings: SettingsBlob, fallback: number): number {
    const n = Number(
        firstString(
            process.env.CWSP_CLIPBOARD_POLL_MS,
            dig(settings, ["shell", "clipboardPushIntervalMs"])
        ) || fallback
    );
    return Number.isFinite(n) && n >= 250 ? Math.floor(n) : fallback;
}

function allowInsecureTls(settings: SettingsBlob): boolean {
    if (process.env.CWSP_ALLOW_INSECURE_TLS === "1") return true;
    const flag = dig(settings, ["core", "ops", "allowInsecureTls"]);
    return flag === true || flag === "true" || flag === 1;
}

function isClipboardWhat(what: string): boolean {
    const w = what.trim().toLowerCase();
    return (
        w === "clipboard:update" ||
        w === "clipboard:write" ||
        w.startsWith("airpad:clipboard:")
    );
}

function extractClipboardText(value: unknown): string {
    if (typeof value === "string") return value;
    const rec = asRecord(value);
    for (const key of ["text", "content", "body"] as const) {
        if (typeof rec[key] === "string") return rec[key] as string;
    }
    // WHY: do not treat payload.data / asset.data (base64) as clipboard text.
    // Descend into payload/result first (canonical carriers). Also descend into
    // `data` ONLY when it is a plain object (legacy {data:{text:...}} carrier per
    // network.mdc); a bare base64/string `data` is an asset carrier, not text, and
    // is rejected by the typeof-object guard below to avoid text→fake-image loops.
    const nestedObj = rec.payload ?? rec.result;
    if (nestedObj && nestedObj !== value) {
        const found = extractClipboardText(nestedObj);
        if (found) return found;
    }
    const dataCarrier = rec.data;
    if (
        dataCarrier &&
        typeof dataCarrier === "object" &&
        !Array.isArray(dataCarrier) &&
        dataCarrier !== value
    ) {
        const found = extractClipboardText(dataCarrier);
        if (found) return found;
    }
    return "";
}

/**
 * Loose Android/OEM asset extract when strict DataAsset normalize rejects the envelope.
 * WHY: inbound hub must still SetImage when hash/mime quirks fail shared validation.
 */
function extractClipboardAssetLoose(
    value: unknown
): { data: string; hash?: string; size?: number } | undefined {
    const rec = asRecord(value);
    const carriers = [rec.payload, rec.data, rec.result, rec, asRecord(rec.payload).asset];
    for (const c of carriers) {
        const bag = asRecord(c);
        const nested = asRecord(bag.asset ?? bag.dataAsset ?? bag.image ?? bag.file);
        const mime = String(nested.mimeType || nested.type || bag.mimeType || bag.type || "")
            .trim()
            .toLowerCase();
        const dataRaw =
            (typeof nested.data === "string" && nested.data) ||
            (typeof bag.imageBase64 === "string" && bag.imageBase64) ||
            "";
        const data = String(dataRaw)
            .replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "")
            .replace(/\s/g, "");
        // WHY: plain clipboard text often lives in payload.data (legacy). Treating any
        // alphanumeric ≥64 chars as base64 image ate Android→Win text (incl. Latin).
        if (!data || data.length < 128) continue;
        const hasExplicitImageHint =
            mime.startsWith("image/") ||
            /^data:image\//i.test(String(dataRaw)) ||
            typeof nested.hash === "string" ||
            typeof bag.hash === "string";
        // Only accept bare base64 when it looks like a real image payload (long + padded).
        const looksLikeBareImageB64 =
            data.length >= 256 &&
            /^[A-Za-z0-9+/]+=*$/.test(data.slice(0, 120)) &&
            /=+$/.test(data.slice(-4));
        if (!hasExplicitImageHint && !looksLikeBareImageB64) continue;
        // Reject obvious plaintext (spaces / Cyrillic / punctuation).
        if (/[\sА-Яа-яЁё"'<>{}]/.test(data.slice(0, 200))) continue;
        const hash =
            typeof nested.hash === "string"
                ? nested.hash
                : typeof bag.hash === "string"
                  ? bag.hash
                  : undefined;
        const size = typeof nested.size === "number" ? nested.size : undefined;
        return { data, hash, size };
    }
    return undefined;
}

function hashImageBase64(base64: string): string {
    return createHash("sha256").update(base64).digest("hex").slice(0, 32);
}

function buildPngAsset(base64: string, hash?: string): DataAssetEnvelope {
    const bare = base64.replace(/^data:[^;]+;base64,/i, "").replace(/\s/g, "");
    const h = hash || hashImageBase64(bare);
    const size = Buffer.from(bare, "base64").length;
    return {
        hash: h,
        name: `clipboard-${h}.png`,
        mimeType: "image/png",
        size,
        source: "base64",
        data: bare
    };
}

function withQuery(url: string, params: Record<string, string>): string {
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) {
        if (v) u.searchParams.set(k, v);
    }
    return u.toString();
}

async function openNodeWebSocket(
    url: string,
    insecure: boolean
): Promise<WsLike> {
    // Prefer `ws` so we can relax TLS for desk/self-signed fleet certs.
    try {
        const mod = await import("ws");
        const WS = (mod as { default?: new (u: string, opts?: object) => WsLike }).default ??
            (mod as unknown as new (u: string, opts?: object) => WsLike);
        // WHY: disable perMessageDeflate — some proxies stall compressed idle frames.
        return new WS(url, {
            rejectUnauthorized: !insecure,
            perMessageDeflate: false,
            handshakeTimeout: 8000
        });
    } catch {
        const WS = globalThis.WebSocket;
        if (!WS) {
            throw new Error("clipboard-hub: neither `ws` nor globalThis.WebSocket available");
        }
        if (insecure) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }
        return new WS(url) as unknown as WsLike;
    }
}

function onWs(
    ws: WsLike,
    event: "open" | "message" | "close" | "error",
    listener: (...args: unknown[]) => void
): void {
    if (typeof ws.on === "function") {
        ws.on(event, listener);
        return;
    }
    ws.addEventListener?.(event, listener);
}

/**
 * Node-owned clipboard bridge for Neutralino desktop shells.
 *
 * INVARIANT: Win/Linux Neutralino must sync clipboard here — not via WebView
 * `websocket.ts` push/apply loops (those stay for Capacitor/PWA).
 *
 * Flow:
 *   inbound `/ws` clipboard:* → adapters.ingest | adapters.writeText
 *   local OS poll → clipboard:update act → `/ws`
 */
export function createClipboardHub(options: ClipboardHubOptions): ClipboardHubRuntime {
    const localId = options.localId || "L-110";
    const packageRoot = options.packageRoot;
    const emission = createClipboardEmission({ sender: localId, protocol: "ws", transport: "ws" });
    const echoMs = options.echoSuppressMs ?? DEFAULT_ECHO_MS;
    const reconnectBase = options.reconnectMs ?? DEFAULT_RECONNECT_MS;

    let running = false;
    let ws: WsLike | null = null;
    let hubUrl = "";
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let keepaliveTimer: ReturnType<typeof setInterval> | null = null;
    let reconnectAttempt = 0;
    /** Absolute ms — after 4001, delay reconnect until this time. */
    let authBackoffUntil = 0;
    let lastPushText = "";
    let lastPushAt = 0;
    let lastInboundAt = 0;
    let lastError = "";
    let lastPushTextLength = 0;
    let echoText = "";
    let echoUntil = 0;
    /** WHY: after inbound apply, suppress ALL outbound pushes for echoMs (not just equal text). */
    let quietUntil = 0;
    /** Serialize inbound apply vs local poll so poll cannot push desk buffer mid-apply. */
    let ioChain: Promise<void> = Promise.resolve();
    let connecting = false;
    /** Set when close fires during connect()/startPoll — drain in finally. */
    let reconnectQueued: { authReject?: boolean } | null = null;
    let lastPongAt = 0;
    let lastHasToken = false;
    let lastTargets: string[] = [];
    let lastImageHash = "";
    /** Last text successfully applied from a remote peer (Android/etc). */
    let lastInboundText = "";
    /** Absolute block on outbound until this time (inbound sink-only window). */
    let outboundHoldUntil = 0;
    /** INVARIANT: false until connect baselines OS clipboard without flushing history. */
    let baselineReady = false;

    // --- prompt popup state ------------------------------------------------
    /** Active prompt hold (ask-mode pending op or auto-mode toast). */
    let promptHold: ClipboardPromptHold | null = null;
    /** Auto-dismiss timer for the active prompt (timeout ⇒ dismiss). */
    let promptTimer: ReturnType<typeof setTimeout> | null = null;
    /**
     * Last prompt fingerprint (kind|mode|text|hash) — used to suppress
     * stacking duplicate popups in a short window even after the prior one
     * has been cleared (avoids poll storms re-prompting on the same content).
     */
    let promptLastFingerprint = "";
    let promptLastFingerprintAt = 0;
    /**
     * Dedupe window (ms) after a prompt clears.
     * WHY: while a hold is active, fingerprint match always drops (see setPrompt).
     * After clear, keep a longer sticky window than dismiss toast so poll cannot
     * re-open the same ask every 600ms (self-loop / prompt storm).
     */
    const PROMPT_DEDUPE_MS = 15000;
    /**
     * Sticky dismiss: same Ctrl+C text must not reopen toast after Dismiss/timeout.
     * Cleared only when OS clipboard changes to a different normalized value.
     */
    let stickyDismissedOutboundText = "";
    let stickyDismissedOutboundImageHash = "";

    const withIoLock = async <T>(fn: () => Promise<T>): Promise<T> => {
        const prev = ioChain;
        let release!: () => void;
        ioChain = new Promise<void>((resolve) => {
            release = resolve;
        });
        await prev;
        try {
            return await fn();
        } finally {
            release();
        }
    };

    const enterQuiet = (ms = echoMs): void => {
        quietUntil = Math.max(quietUntil, Date.now() + ms);
    };

    const enterOutboundHold = (ms = OUTBOUND_HOLD_AFTER_INBOUND_MS): void => {
        outboundHoldUntil = Math.max(outboundHoldUntil, Date.now() + ms);
        enterQuiet(ms);
    };

    const isQuiet = (): boolean => Date.now() < quietUntil;

    /** INVARIANT: phone inbound makes desk a sink — no fan-out until hold expires AND text is new. */
    const isOutboundHeld = (): boolean => Date.now() < outboundHoldUntil;

    const outboundPushDisabled = (): boolean =>
        process.env.CWSP_CLIPBOARD_PUSH === "0" ||
        process.env.CWSP_CLIPBOARD_SINK_ONLY === "1";

    // --- prompt popup helpers ---------------------------------------------
    /**
     * Resolve prompt mode + flags from the latest settings snapshot.
     * WHY: settings can change at runtime via Settings UI sync; re-read each prompt.
     */
    const resolvePromptSettings = async (): Promise<{
        outboundMode: ClipboardPromptMode;
        inboundMode: ClipboardPromptMode;
        showErase: boolean;
        showUndo: boolean;
        dismissMs: number;
    }> => {
        try {
            const settings = await options.getSettings();
            // COMPAT: prefer shell.*; also accept nested portable.shell if a wrapper is returned.
            const outRaw = String(
                dig(settings, ["shell", "clipboardOutboundMode"]) ??
                    dig(settings, ["portable", "shell", "clipboardOutboundMode"]) ??
                    "auto"
            )
                .trim()
                .toLowerCase();
            const inRaw = String(
                dig(settings, ["shell", "clipboardInboundMode"]) ??
                    dig(settings, ["portable", "shell", "clipboardInboundMode"]) ??
                    "auto"
            )
                .trim()
                .toLowerCase();
            const dismissRaw = Number(
                dig(settings, ["shell", "clipboardPromptDismissMs"]) ??
                    dig(settings, ["portable", "shell", "clipboardPromptDismissMs"]) ??
                    10000
            );
            const showErase =
                (dig(settings, ["shell", "clipboardOutboundShowErase"]) ??
                    dig(settings, ["portable", "shell", "clipboardOutboundShowErase"])) !== false;
            const showUndo =
                (dig(settings, ["shell", "clipboardInboundShowUndo"]) ??
                    dig(settings, ["portable", "shell", "clipboardInboundShowUndo"])) !== false;
            return {
                outboundMode: (outRaw === "ask" ? "ask" : "auto") as ClipboardPromptMode,
                inboundMode: (inRaw === "ask" ? "ask" : "auto") as ClipboardPromptMode,
                showErase,
                showUndo,
                dismissMs:
                    Number.isFinite(dismissRaw) && dismissRaw >= 1000
                        ? Math.floor(dismissRaw)
                        : 10000
            };
        } catch {
            // WHY: settings read should never block a prompt decision — fall back to spec defaults.
            return {
                outboundMode: "auto",
                inboundMode: "auto",
                showErase: true,
                showUndo: true,
                dismissMs: 10000
            };
        }
    };

    /**
     * Spoiler/toast preview that preserves newlines for multi-line clipboard text.
     * INVARIANT: collapse spaces/tabs within a line, but never flatten `\n` to spaces.
     * Cap: 4 lines / 180 chars so the WinForms toast and HTML popup stay compact.
     */
    const buildTextPreview = (text: string): string => {
        const raw = String(text || "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");
        if (!raw.trim()) return "";
        const lines = raw.split("\n").map((line) => line.replace(/[^\S\n]+/g, " ").trim());
        // WHY: squash huge blank runs in previews without erasing intentional line breaks.
        const normalized = lines.join("\n").replace(/\n{3,}/g, "\n\n");
        const allLines = normalized.split("\n");
        // Prefer content lines for the toast; keep at most one blank between blocks.
        const head: string[] = [];
        for (const line of allLines) {
            if (head.length >= 4) break;
            if (line === "" && (head.length === 0 || head[head.length - 1] === "")) continue;
            head.push(line);
        }
        let preview = head.join("\n");
        const moreLines = allLines.length > head.length;
        if (preview.length > 180) {
            preview = `${preview.slice(0, 177)}…`;
        } else if (moreLines) {
            preview = `${preview}\n…`;
        }
        return preview;
    };

    /** Dedupe fingerprint for the prompt (kind|mode|text|assetHash). */
    const buildPromptFingerprint = (hold: {
        kind: ClipboardPromptKind;
        mode: ClipboardPromptMode;
        text: string;
        asset?: { hash?: string };
    }): string =>
        `${hold.kind}|${hold.mode}|${normalizeClipboardText(hold.text)}|${hold.asset?.hash ?? ""}`;

    /** Persist held PNG bytes for WinForms toast preview (large images). */
    const materializePromptThumb = (hold: ClipboardPromptHold): string => {
        const bare = String(hold.asset?.data || "")
            .replace(/^data:[^;]+;base64,/i, "")
            .replace(/\s/g, "");
        if (!bare || !packageRoot) return "";
        try {
            const dir = path.join(packageRoot, ".tmp", "clipboard-prompt");
            fs.mkdirSync(dir, { recursive: true });
            const hash = String(hold.asset?.hash || hashImageBase64(bare)).slice(0, 32);
            const filePath = path.join(dir, `${hash}.png`);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, Buffer.from(bare, "base64"));
            }
            return filePath;
        } catch {
            return "";
        }
    };

    const cleanupPromptThumb = (hold: ClipboardPromptHold | null): void => {
        if (!hold?.asset?.data || !packageRoot) return;
        try {
            const hash = String(hold.asset.hash || "").slice(0, 32);
            if (!hash) return;
            const filePath = path.join(packageRoot, ".tmp", "clipboard-prompt", `${hash}.png`);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch {
            /* ignore temp cleanup */
        }
    };

    /** Convert internal hold to public state for the popup UI / control RPC. */
    const holdToState = (hold: ClipboardPromptHold): ClipboardPromptState => {
        const hasImage = Boolean(hold.asset?.data);
        const bareLen = String(hold.asset?.data || "").length;
        // Prefer temp PNG path for WinForms; skip inline when path works so GET
        // stays small (TimeoutSec 1 on toast) and popups stay responsive.
        const imageThumbPath = hasImage ? materializePromptThumb(hold) : "";
        const imageThumbDataUrl =
            hasImage && !imageThumbPath && bareLen > 0 && bareLen < 120_000
                ? `data:image/png;base64,${hold.asset!.data}`
                : "";
        return {
            id: hold.id,
            kind: hold.kind,
            mode: hold.mode,
            textPreview: buildTextPreview(hold.text),
            // WHY: control RPC is loopback + API-key; CRX reads full text for Accept bypass.
            text: hold.text,
            textLength: hold.text.length,
            hasImage,
            assetHash: String(hold.asset?.hash ?? ""),
            assetMimeType: String(hold.asset?.mimeType ?? ""),
            assetSize: Number(hold.asset?.size ?? 0),
            // WHY: Erase only on outbound auto (ask mode Erase would lose the pre-share payload).
            showErase: hold.kind === "outbound" && hold.mode === "auto" && hold.showErase,
            // WHY: Undo only on inbound auto (ask mode never applied, so nothing to undo).
            showUndo: hold.kind === "inbound" && hold.mode === "auto" && hold.showUndo,
            expiresAt: hold.expiresAt,
            dismissMs: hold.dismissMs,
            imageThumbDataUrl,
            imageThumbPath,
            sender: hold.sender,
            targets: hold.nodes
        };
    };

    const emitPromptUpdate = (hold: ClipboardPromptHold | null): void => {
        try {
            options.onPromptUpdate?.(hold ? holdToState(hold) : null);
        } catch {
            // WHY: popup callback must never throw the hub loop.
        }
    };

    const clearPromptTimer = (): void => {
        if (promptTimer) {
            clearTimeout(promptTimer);
            promptTimer = null;
        }
    };

    /** Clear the active prompt (no further action). Safe to call when none. */
    const clearPrompt = (emit = true): void => {
        if (!promptHold && !promptTimer) {
            if (emit) emitPromptUpdate(null);
            return;
        }
        if (promptHold) {
            // Remember fingerprint so a re-prompt of the same content within the dedupe window is dropped.
            promptLastFingerprint = promptHold.fingerprint;
            promptLastFingerprintAt = Date.now();
            cleanupPromptThumb(promptHold);
        }
        promptHold = null;
        clearPromptTimer();
        if (emit) emitPromptUpdate(null);
    };

    /** Schedule the auto-dismiss timeout that will resolve the prompt as `dismiss`. */
    const schedulePromptTimeout = (hold: ClipboardPromptHold): void => {
        clearPromptTimer();
        const delay = Math.max(500, hold.expiresAt - Date.now());
        promptTimer = setTimeout(() => {
            // WHY: timeout fires inside the io chain so it cannot race with a concurrent apply/share.
            void withIoLock(async () => {
                if (!promptHold || promptHold.id !== hold.id) return;
                await resolvePromptInternal("dismiss");
            });
        }, delay);
    };

    /**
     * Install a new prompt. Replaces any prior prompt (older ask hold is dropped).
     * WHY: only one popup at a time — never stack. Dedupe while hold is active or
     * within PROMPT_DEDUPE_MS so ask-mode poll (~600ms) cannot self-loop the toast.
     * @returns true when the hold was installed (caller may seed lastPushText).
     */
    const setPrompt = (hold: ClipboardPromptHold): boolean => {
        const fingerprint = hold.fingerprint;
        // INVARIANT: active hold with same fingerprint → no re-install, no log spam.
        if (promptHold && promptHold.fingerprint === fingerprint) {
            return false;
        }
        if (
            promptLastFingerprint === fingerprint &&
            Date.now() - promptLastFingerprintAt < PROMPT_DEDUPE_MS
        ) {
            // WHY: same content recently prompted — drop silently to avoid popup blink/stack.
            return false;
        }
        // Drop prior hold (no fulfil) — newer prompt wins.
        if (promptHold && promptHold.id !== hold.id) {
            cleanupPromptThumb(promptHold);
        }
        promptHold = hold;
        promptLastFingerprint = fingerprint;
        promptLastFingerprintAt = Date.now();
        schedulePromptTimeout(hold);
        emitPromptUpdate(hold);
        return true;
    };

    /**
     * Internal resolver — must be called inside withIoLock.
     * Returns true when the action applied to the active prompt.
     */
    const resolvePromptInternal = async (action: ClipboardPromptAction): Promise<boolean> => {
        const hold = promptHold;
        if (!hold) return false;

        switch (action) {
            case "share": {
                if (hold.kind !== "outbound" || hold.mode !== "ask") return false;
                // Send the held packet now.
                const packet = hold.asset?.data
                    ? emission.buildUpdate({
                        asset: buildPngAsset(hold.asset.data, hold.asset.hash),
                        nodes: hold.nodes,
                        destinations: hold.nodes,
                        sender: localId,
                        uuid: hold.id
                    })
                    : emission.buildUpdate({
                        text: hold.text,
                        nodes: hold.nodes,
                        destinations: hold.nodes,
                        sender: localId,
                        uuid: hold.id
                    });
                if (sendPacket(packet)) {
                    if (hold.text) markSynced(hold.text);
                    if (hold.asset?.hash) markImageSynced(hold.asset.hash);
                    lastTargets = hold.nodes;
                    console.log(JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "prompt-share",
                        localId,
                        len: hold.text.length,
                        hasImage: Boolean(hold.asset?.data),
                        targets: hold.nodes
                    }));
                }
                // WHY: after Share, same Ctrl+C must not reopen ask toast until
                // clipboard content changes (parity with dismiss sticky).
                if (hold.kind === "outbound") {
                    const sharedText = normalizeClipboardText(hold.text);
                    if (sharedText) stickyDismissedOutboundText = sharedText;
                    const hash = String(hold.asset?.hash || "").trim();
                    if (hash) stickyDismissedOutboundImageHash = hash;
                }
                clearPrompt();
                return true;
            }
            case "accept": {
                if (hold.kind !== "inbound" || hold.mode !== "ask") return false;
                // Apply the held text/asset now.
                if (hold.asset?.data && options.adapters.writeImageBase64) {
                    try {
                        await options.adapters.writeImageBase64(hold.asset.data);
                        if (hold.asset.hash) markImageSynced(hold.asset.hash);
                        await reseedImageHashFromClipboard();
                    } catch (error) {
                        lastError = error instanceof Error ? error.message : String(error);
                    }
                }
                if (hold.text) {
                    try {
                        await options.adapters.writeText(hold.text);
                        await settleAfterLocalWrite(hold.text);
                    } catch (error) {
                        lastError = error instanceof Error ? error.message : String(error);
                    }
                }
                enterOutboundHold();
                console.log(JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "prompt-accept",
                    localId,
                    sender: hold.sender,
                    len: hold.text.length,
                    hasImage: Boolean(hold.asset?.data)
                }));
                clearPrompt();
                return true;
            }
            case "erase": {
                if (hold.kind !== "outbound" || hold.mode !== "auto") return false;
                // Clear local OS clipboard (after auto share already happened).
                try {
                    await options.adapters.writeText("");
                    markSynced("");
                    markEcho("");
                    enterQuiet(echoMs);
                } catch (error) {
                    lastError = error instanceof Error ? error.message : String(error);
                }
                console.log(JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "prompt-erase",
                    localId
                }));
                clearPrompt();
                return true;
            }
            case "undo": {
                if (hold.kind !== "inbound" || hold.mode !== "auto") return false;
                // Restore the snapshot captured before the auto apply.
                // WHY: prefer image restore when the pre-apply clipboard held an
                // image (and an image writer is available); otherwise restore text.
                try {
                    if (
                        hold.previousImage &&
                        options.adapters.writeImageBase64
                    ) {
                        await options.adapters.writeImageBase64(hold.previousImage);
                        if (hold.previousText) {
                            // Best-effort: also re-seed text so poll doesn't fan-out the
                            // residual text buffer that often accompanies an image copy.
                            try {
                                await options.adapters.writeText(hold.previousText);
                                await settleAfterLocalWrite(hold.previousText);
                            } catch {
                                /* image restore is the source of truth */
                            }
                        }
                        await reseedImageHashFromClipboard();
                    } else if (hold.previousText) {
                        await options.adapters.writeText(hold.previousText);
                        await settleAfterLocalWrite(hold.previousText);
                    }
                } catch (error) {
                    lastError = error instanceof Error ? error.message : String(error);
                }
                console.log(JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "prompt-undo",
                    localId,
                    len: hold.previousText.length,
                    hadImage: Boolean(hold.previousImage)
                }));
                clearPrompt();
                return true;
            }
            case "dismiss":
            default: {
                // WHY: any outbound dismiss (ask or auto toast) must stick until clipboard changes.
                // Otherwise poll re-opens the toast after PROMPT_DEDUPE_MS → infinite Ctrl+C loop.
                if (hold.kind === "outbound") {
                    const dismissedText = normalizeClipboardText(hold.text);
                    if (dismissedText) {
                        stickyDismissedOutboundText = dismissedText;
                        markSynced(dismissedText);
                    }
                    const hash = String(hold.asset?.hash || "").trim();
                    if (hash) stickyDismissedOutboundImageHash = hash;
                }
                // WHY: on inbound ask dismiss, nothing was applied — just drop the hold.
                console.log(JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "prompt-dismiss",
                    localId,
                    kind: hold.kind,
                    mode: hold.mode,
                    stickyTextLen: stickyDismissedOutboundText.length,
                    stickyImage: Boolean(stickyDismissedOutboundImageHash)
                }));
                clearPrompt();
                return true;
            }
        }
    };

    const stopPoll = (): void => {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    };

    const clearReconnect = (): void => {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
    };

    const stopKeepalive = (): void => {
        if (keepaliveTimer) {
            clearInterval(keepaliveTimer);
            keepaliveTimer = null;
        }
    };

    const startKeepalive = (sock: WsLike): void => {
        stopKeepalive();
        if (typeof sock.ping !== "function") return;
        lastPongAt = Date.now();
        onWs(sock, "pong", () => {
            lastPongAt = Date.now();
        });
        keepaliveTimer = setInterval(() => {
            try {
                if (!ws || ws !== sock || sock.readyState !== OPEN) return;
                const silentFor = Date.now() - lastPongAt;
                if (silentFor > DEFAULT_PONG_TIMEOUT_MS) {
                    console.warn(
                        JSON.stringify({
                            channel: "cwsp-clipboard-hub",
                            event: "pong-timeout",
                            localId,
                            silentForMs: silentFor
                        })
                    );
                    lastError = `clipboard-hub: pong timeout (${silentFor}ms)`;
                    try {
                        // WHY: half-open TCP after sleep — close() may hang; terminate forces FIN.
                        const term = (sock as { terminate?: () => void }).terminate;
                        if (typeof term === "function") term.call(sock);
                        else sock.close();
                    } catch {
                        /* close handler owns reconnect */
                    }
                    return;
                }
                sock.ping?.();
            } catch {
                /* ignore — close handler owns reconnect */
            }
        }, DEFAULT_KEEPALIVE_MS);
        if (typeof (keepaliveTimer as { unref?: () => void }).unref === "function") {
            (keepaliveTimer as { unref: () => void }).unref();
        }
    };

    const markEcho = (text: string): void => {
        const t = normalizeClipboardText(text);
        echoText = t;
        echoUntil = Date.now() + echoMs;
    };

    const isEcho = (text: string): boolean => {
        const t = normalizeClipboardText(text);
        return Boolean(t) && t === echoText && Date.now() < echoUntil;
    };

    /** Treat applied/read text as already synced so poll will not rebroadcast it. */
    const markSynced = (text: string): void => {
        const t = normalizeClipboardText(text);
        if (!t) return;
        markEcho(t);
        lastPushText = t;
        lastPushAt = Date.now();
        lastPushTextLength = t.length;
    };

    /**
     * WHY: after writeText, re-read OS value (CRLF-normalized) and extend quiet window so
     * the next poll cannot treat Win-mutated text as a local change to fan-out to Android.
     */
    const settleAfterLocalWrite = async (intended: string): Promise<void> => {
        markSynced(intended);
        enterQuiet(echoMs);
        try {
            const actual = normalizeClipboardText(await options.adapters.readText());
            if (actual) markSynced(actual);
        } catch {
            /* ignore re-read — quiet window still holds */
        }
    };

    const markImageSynced = (hash: string): void => {
        const h = String(hash || "").trim();
        if (!h) return;
        lastImageHash = h;
        lastPushAt = Date.now();
    };

    /**
     * WHY: after an inbound image write, PS1 has re-encoded the bytes as a PNG bitmap.
     * Read it back and re-seed lastImageHash so the local poll's PNG read matches and
     * does not re-push the just-applied image to Android (echo storm guard).
     */
    const reseedImageHashFromClipboard = async (): Promise<void> => {
        if (!options.adapters.containsImage || !options.adapters.readImageBase64) return;
        try {
            const has = await options.adapters.containsImage();
            if (!has) return;
            const raw = await options.adapters.readImageBase64();
            const bare = String(raw || "")
                .replace(/^data:[^;]+;base64,/i, "")
                .replace(/\s/g, "");
            if (bare) lastImageHash = hashImageBase64(bare);
        } catch {
            /* ignore reseed errors — poll will reconcile on next tick */
        }
    };

    const packetSender = (rec: Record<string, unknown>): string => {
        const ids = asRecord(rec.ids);
        return String(
            rec.sender || rec.byId || rec.from || ids.byId || ids.sender || ""
        ).trim();
    };

    const isSelfSender = (sender: string): boolean => {
        const s = sender.trim().toLowerCase();
        if (!s) return false;
        if (s === "self") return true;
        const local = String(localId || "").trim().toLowerCase();
        if (!local) return false;
        if (s === local) return true;
        // COMPAT: L-110 ↔ L-192.168.0.110 collapse onto the same desk peer.
        const strip = (v: string): string =>
            v.replace(/^l-/, "").replace(/^192\.168\.0\./, "");
        return strip(s) === strip(local);
    };

    /** Content that we just pushed/applied — gateway mirrors with blank sender still loop. */
    const isContentEcho = (text: string): boolean => {
        const t = normalizeClipboardText(text);
        if (!t) return false;
        if (isEcho(t)) return true;
        if (t === lastPushText && Date.now() - lastPushAt < echoMs) return true;
        if (t === lastInboundText && Date.now() - lastInboundAt < echoMs) return true;
        return false;
    };

    const closeSocket = (): void => {
        stopKeepalive();
        const cur = ws;
        ws = null;
        if (!cur) return;
        try {
            cur.removeAllListeners?.();
        } catch {
            /* ignore */
        }
        try {
            cur.close();
        } catch {
            /* ignore */
        }
    };

    const sendPacket = (packet: unknown): boolean => {
        if (!ws || ws.readyState !== OPEN) return false;
        try {
            ws.send(typeof packet === "string" ? packet : JSON.stringify(packet));
            return true;
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
            return false;
        }
    };

    const handleInbound = async (raw: unknown): Promise<void> => {
        let packet = raw;
        if (typeof raw === "string") {
            try {
                packet = JSON.parse(raw);
            } catch {
                return;
            }
        }
        if (Buffer.isBuffer(raw)) {
            try {
                packet = JSON.parse(raw.toString("utf8"));
            } catch {
                return;
            }
        }
        const rec = asRecord(packet);
        const what = String(rec.what || rec.type || "").trim();
        if (!isClipboardWhat(what)) return;

        const sender = packetSender(rec);
        // WHY: self/echo frames and residual gateway mirrors must not rewrite OS clipboard.
        if (isSelfSender(sender)) return;

        await withIoLock(async () => {
            // INVARIANT: quiet FIRST so a concurrent poll cannot push desk buffer as Android rewrite.
            // WHY: sink-only window — phone text applies here; do not fan-out residual desk text.
            enterOutboundHold();
            lastInboundAt = Date.now();
            const text = normalizeClipboardText(extractClipboardText(rec));
            // WHY: blank-sender gateway mirrors of our own push must not re-apply (self-loop).
            if (text && isContentEcho(text)) {
                markSynced(text);
                return;
            }
            // WHY: strict DataAsset first; loose only when no plaintext (avoids text→fake image).
            const strictAsset =
                extractClipboardAsset(packet) ?? extractClipboardAsset(rec.payload);
            const asset =
                strictAsset ??
                (text ? undefined : extractClipboardAssetLoose(rec));

            // --- prompt policy (inbound) -----------------------------------
            // WHY: snapshot OS clipboard text + image BEFORE any apply so auto-mode
            // Undo can restore the prior content (image wins when present, else text).
            let previousText = "";
            try {
                previousText = normalizeClipboardText(await options.adapters.readText());
            } catch {
                previousText = "";
            }
            let previousImage = "";
            if (options.adapters.containsImage && options.adapters.readImageBase64) {
                try {
                    if (await options.adapters.containsImage()) {
                        const rawImg = await options.adapters.readImageBase64();
                        if (rawImg) previousImage = String(rawImg);
                    }
                } catch {
                    previousImage = "";
                }
            }
            const promptSettings = await resolvePromptSettings();
            /**
             * Build + install an inbound prompt hold (shared by ask + auto paths).
             * WHY: keep prompt shape consistent — kind/mode/showUndo/previousText/previousImage differ.
             */
            const showInboundPrompt = (
                mode: ClipboardPromptMode,
                prevText: string,
                prevImage: string
            ): void => {
                const hold: ClipboardPromptHold = {
                    id: randomUUID(),
                    kind: "inbound",
                    mode,
                    text,
                    asset: asset?.data
                        ? {
                            data: asset.data,
                            hash: typeof asset.hash === "string" ? asset.hash : undefined,
                            size: typeof asset.size === "number" ? asset.size : undefined,
                            mimeType: "image/png"
                        }
                        : undefined,
                    nodes: [],
                    sender,
                    previousText: prevText,
                    previousImage: prevImage,
                    showErase: promptSettings.showErase,
                    showUndo: promptSettings.showUndo,
                    dismissMs: promptSettings.dismissMs,
                    expiresAt: Date.now() + promptSettings.dismissMs,
                    fingerprint: ""
                };
                hold.fingerprint = buildPromptFingerprint(hold);
                setPrompt(hold);
            };
            // ASK mode: hold the apply until Accept/Dismiss/timeout.
            if (promptSettings.inboundMode === "ask" && (text || asset?.data)) {
                showInboundPrompt("ask", previousText, previousImage);
                // WHY: CRX is L-110-crx (not desk L-110) — without a mirror it never sees
                // the hold body while Accept popup is up. Fan-out paste-hold so
                // "Paste by CWSP" can insert + control-take can dismiss Accept.
                if (text) {
                    try {
                        const crxNodes = ["L-110-crx"];
                        const mirror = emission.buildUpdate({
                            text,
                            nodes: crxNodes,
                            destinations: crxNodes,
                            sender: localId,
                            uuid: randomUUID()
                        });
                        const payload = asRecord((mirror as { payload?: unknown }).payload);
                        payload.source = "neutralino-paste-hold";
                        payload.pasteHold = true;
                        (mirror as { payload?: unknown }).payload = payload;
                        const mirrored = sendPacket(mirror);
                        console.log(
                            JSON.stringify({
                                channel: "cwsp-clipboard-hub",
                                event: "prompt-inbound-ask-mirror-crx",
                                localId,
                                targets: crxNodes,
                                mirrored,
                                len: text.length
                            })
                        );
                    } catch {
                        /* mirror is best-effort — control take remains the fallback */
                    }
                }
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "prompt-inbound-ask",
                        localId,
                        sender,
                        len: text.length,
                        hasImage: Boolean(asset?.data)
                    })
                );
                return;
            }

            /**
             * WHY: apply inbound text to the local OS clipboard.
             * Do NOT skip solely because text===lastPushText — desk OS may hold a different
             * buffer; skipping write then letting quiet expire caused tickPush to fan-out the
             * desk buffer back to Android (direction inversion).
             * Skip only when OS already holds the same normalized text.
             * INVARIANT: after apply, desk is a sink — never rebroadcast this inbound string.
             */
            const applyInboundText = async (
                value: string,
                via: string
            ): Promise<boolean> => {
                const intended = normalizeClipboardText(value);
                if (!intended) return false;
                lastInboundText = intended;
                lastInboundAt = Date.now();
                enterOutboundHold();
                let current = "";
                try {
                    current = normalizeClipboardText(await options.adapters.readText());
                } catch {
                    current = "";
                }
                if (current !== intended) {
                    await options.adapters.writeText(intended);
                }
                await settleAfterLocalWrite(intended);
                await reseedImageHashFromClipboard();
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "inbound-text",
                        localId,
                        sender,
                        len: intended.length,
                        via,
                        wrote: current !== intended,
                        quietMs: echoMs,
                        outboundHoldMs: OUTBOUND_HOLD_AFTER_INBOUND_MS
                    })
                );
                return true;
            };

            try {
                // INVARIANT: Android→Win plaintext must win when there is no real image asset.
                // Do not rely solely on protocol.ingest (silent) — write OS clipboard here.
                if (text && !strictAsset) {
                    await applyInboundText(text, "direct");
                    if (promptSettings.inboundMode === "auto") {
                        showInboundPrompt("auto", previousText, previousImage);
                    }
                    return;
                }

                // WHY: write image when a real asset is present — ProtocolServer.ingest normalize
                // can throw and used to swallow the only Android→Win image path.
                if (asset?.data && options.adapters.writeImageBase64) {
                    await options.adapters.writeImageBase64(asset.data);
                    // WHY: PS1 re-encodes JPEG→PNG on SetImage, so the Android asset hash no
                    // longer matches the clipboard bitmap. Re-seed lastImageHash from the actual
                    // OS clipboard so the local poll does not echo the just-applied image back.
                    await reseedImageHashFromClipboard();
                    lastPushAt = Date.now();
                    enterOutboundHold();
                    console.log(
                        JSON.stringify({
                            channel: "cwsp-clipboard-hub",
                            event: "inbound-image",
                            localId,
                            sender,
                            hash: asset.hash || "",
                            reseededHash: lastImageHash,
                            size: asset.size ?? 0,
                            quietMs: echoMs,
                            outboundHoldMs: OUTBOUND_HOLD_AFTER_INBOUND_MS
                        })
                    );
                    if (text) {
                        await applyInboundText(text, "with-image");
                    }
                    if (promptSettings.inboundMode === "auto") {
                        showInboundPrompt("auto", previousText, previousImage);
                    }
                    return;
                }

                if (options.adapters.ingest) {
                    await options.adapters.ingest(packet);
                    if (text) {
                        // WHY: ingest may no-op or emit; force OS apply + hold so poll cannot bounce desk text.
                        await applyInboundText(text, "ingest");
                    } else {
                        enterOutboundHold();
                    }
                    if (promptSettings.inboundMode === "auto" && (text || asset?.data)) {
                        showInboundPrompt("auto", previousText, previousImage);
                    }
                    return;
                }

                if (!text) return;
                await applyInboundText(text, "fallback");
                if (promptSettings.inboundMode === "auto") {
                    showInboundPrompt("auto", previousText, previousImage);
                }
            } catch (error) {
                lastError = error instanceof Error ? error.message : String(error);
                // WHY: keep hold even on failure so a mid-apply poll cannot push desk buffer.
                enterOutboundHold();
                if (text) {
                    markSynced(text);
                    lastInboundText = text;
                }
                console.warn(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "inbound-error",
                        localId,
                        sender,
                        what,
                        error: lastError,
                        hasAsset: Boolean(asset?.data)
                    })
                );
            }
        });
    };

    const pushImageIfChanged = async (settings: SettingsBlob): Promise<boolean> => {
        if (!options.adapters.readImageBase64) return false;
        if (isQuiet() || isOutboundHeld() || outboundPushDisabled()) return false;
        try {
            if (options.adapters.containsImage) {
                const has = await options.adapters.containsImage();
                if (!has) return false;
            }
            const raw = await options.adapters.readImageBase64();
            const bare = String(raw || "")
                .replace(/^data:[^;]+;base64,/i, "")
                .replace(/\s/g, "");
            if (!bare) return false;
            const hash = hashImageBase64(bare);
            if (hash === lastImageHash) return false;
            // WHY: dismissed image ask must not reopen until a different bitmap is copied.
            if (
                stickyDismissedOutboundImageHash &&
                hash === stickyDismissedOutboundImageHash
            ) {
                markImageSynced(hash);
                return false;
            }
            if (
                stickyDismissedOutboundImageHash &&
                hash !== stickyDismissedOutboundImageHash
            ) {
                stickyDismissedOutboundImageHash = "";
            }

            const nodes = resolveBroadcastTargets(settings, localId);
            lastTargets = nodes;
            const asset = buildPngAsset(bare, hash);
            const promptSettings = await resolvePromptSettings();

            // WHY: outbound ask must hold image share until Share/Dismiss — same as text ask.
            // Without this, images always auto-pushed and Share never appeared for bitmaps.
            if (promptSettings.outboundMode === "ask") {
                const hold: ClipboardPromptHold = {
                    id: randomUUID(),
                    kind: "outbound",
                    mode: "ask",
                    text: "",
                    asset: {
                        data: bare,
                        hash,
                        size: asset.size,
                        mimeType: "image/png"
                    },
                    nodes,
                    sender: "",
                    previousText: "",
                    previousImage: "",
                    showErase: promptSettings.showErase,
                    showUndo: promptSettings.showUndo,
                    dismissMs: promptSettings.dismissMs,
                    expiresAt: Date.now() + promptSettings.dismissMs,
                    fingerprint: ""
                };
                hold.fingerprint = buildPromptFingerprint(hold);
                const installed = setPrompt(hold);
                // WHY: seed only when the hold stuck — avoids skipping a re-ask if dedupe dropped it.
                if (installed || (promptHold && promptHold.fingerprint === hold.fingerprint)) {
                    markImageSynced(hash);
                }
                if (installed) {
                    console.log(
                        JSON.stringify({
                            channel: "cwsp-clipboard-hub",
                            event: "prompt-outbound-ask-image",
                            localId,
                            hash,
                            size: asset.size,
                            targets: nodes,
                            held: true
                        })
                    );
                }
                return true;
            }

            const packet = emission.buildUpdate({
                asset,
                nodes,
                destinations: nodes,
                sender: localId,
                uuid: randomUUID()
            });
            if (!sendPacket(packet)) return false;
            markImageSynced(hash);
            // WHY: auto image share also gets a toast (Erase optional) — parity with text auto.
            const hold: ClipboardPromptHold = {
                id: randomUUID(),
                kind: "outbound",
                mode: "auto",
                text: "",
                asset: {
                    data: bare,
                    hash,
                    size: asset.size,
                    mimeType: "image/png"
                },
                nodes,
                sender: "",
                previousText: "",
                previousImage: "",
                showErase: promptSettings.showErase,
                showUndo: promptSettings.showUndo,
                dismissMs: promptSettings.dismissMs,
                expiresAt: Date.now() + promptSettings.dismissMs,
                fingerprint: ""
            };
            hold.fingerprint = buildPromptFingerprint(hold);
            setPrompt(hold);
            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "push-image",
                    localId,
                    hash,
                    size: asset.size,
                    targets: nodes
                })
            );
            return true;
        } catch (error) {
            // Empty / locked clipboard is normal after idle — do not poison lastError.
            const msg = error instanceof Error ? error.message : String(error);
            if (
                !/does not contain an image|CLIPBOARD_IMAGE|CLIPBOARD_BUSY|Clipboard operation did not succeed|ExternalException/i.test(
                    msg
                )
            ) {
                lastError = msg;
            }
            return false;
        }
    };

    /** Windows OpenClipboard contention after sleep/KVM/other apps. */
    const isClipboardBusyMessage = (msg: string): boolean =>
        /CLIPBOARD_BUSY|Clipboard operation did not succeed|ExternalException|OpenClipboard/i.test(
            msg
        );

    const tickPush = async (): Promise<void> => {
        if (!ws || ws.readyState !== OPEN || !baselineReady) return;
        await withIoLock(async () => {
            // WHY: Android→Win apply owns the clipboard — never fan-out desk/residual text
            // to phones (that stomped Capacitor↔Capacitor mid-flight).
            if (isQuiet() || isOutboundHeld() || outboundPushDisabled()) return;
            try {
                const settings = await options.getSettings();
                if (isQuiet() || isOutboundHeld()) return;

                // INVARIANT: text wins over residual images. Windows often keeps CF_DIB after
                // a text copy; image-first polling re-pushed bitmaps and starved text sync.
                let text = "";
                try {
                    text = normalizeClipboardText(await options.adapters.readText());
                } catch (error) {
                    // WHY: idle lock on text read — skip tick; do not clear sticky/lastPush.
                    const msg = error instanceof Error ? error.message : String(error);
                    if (!isClipboardBusyMessage(msg)) {
                        lastError = msg;
                    }
                    return;
                }
                if (isQuiet() || isOutboundHeld()) return;
                // WHY: user copied something new — allow a fresh ask/auto toast for it.
                if (text && stickyDismissedOutboundText && text !== stickyDismissedOutboundText) {
                    stickyDismissedOutboundText = "";
                }
                // WHY: sticky dismiss after Dismiss/timeout — same Ctrl+C must not reopen forever.
                if (text && stickyDismissedOutboundText && text === stickyDismissedOutboundText) {
                    markSynced(text);
                    return;
                }
                // WHY: never rebroadcast phone-originated text as L-110 rewrite — permanent
                // for that string until the desk user copies something different.
                if (text && lastInboundText && text === lastInboundText) {
                    markSynced(text);
                    return;
                }
                if (text && !isEcho(text) && text !== lastPushText) {
                    const nodes = resolveBroadcastTargets(settings, localId);
                    lastTargets = nodes;
                    // WHY: prompt policy — ask mode holds share until Share/Dismiss/timeout;
                    // auto mode sends immediately and shows a toast (Erase optional).
                    const promptSettings = await resolvePromptSettings();
                    if (promptSettings.outboundMode === "ask") {
                        // WHY: while ask hold is open for this text, poll must not re-enter
                        // (was logging prompt-outbound-ask every ~600ms = self-loop storm).
                        if (
                            promptHold &&
                            promptHold.kind === "outbound" &&
                            promptHold.mode === "ask" &&
                            normalizeClipboardText(promptHold.text) === text
                        ) {
                            markSynced(text);
                            return;
                        }
                        const hold: ClipboardPromptHold = {
                            id: randomUUID(),
                            kind: "outbound",
                            mode: "ask",
                            text,
                            nodes,
                            sender: "",
                            previousText: "",
                            previousImage: "",
                            showErase: promptSettings.showErase,
                            showUndo: promptSettings.showUndo,
                            dismissMs: promptSettings.dismissMs,
                            expiresAt: Date.now() + promptSettings.dismissMs,
                            fingerprint: ""
                        };
                        hold.fingerprint = buildPromptFingerprint(hold);
                        const installed = setPrompt(hold);
                        // INVARIANT: always seed — even when dedupe drops install.
                        // Otherwise after PROMPT_DEDUPE_MS the same Ctrl+C reopens forever.
                        markSynced(text);
                        if (installed) {
                            console.log(
                                JSON.stringify({
                                    channel: "cwsp-clipboard-hub",
                                    event: "prompt-outbound-ask",
                                    localId,
                                    len: text.length,
                                    targets: nodes
                                })
                            );
                        }
                        return;
                    }
                    const packet = emission.buildUpdate({
                        text,
                        nodes,
                        destinations: nodes,
                        sender: localId,
                        uuid: randomUUID()
                    });
                    if (sendPacket(packet)) {
                        markSynced(text);
                        // WHY: reseed image hash so leftover Bitmap is not fan-out as push-image.
                        await reseedImageHashFromClipboard();
                        // WHY: auto share succeeded — show the toast popup (Erase optional).
                        const hold: ClipboardPromptHold = {
                            id: randomUUID(),
                            kind: "outbound",
                            mode: "auto",
                            text,
                            nodes,
                            sender: "",
                            previousText: "",
                            previousImage: "",
                            showErase: promptSettings.showErase,
                            showUndo: promptSettings.showUndo,
                            dismissMs: promptSettings.dismissMs,
                            expiresAt: Date.now() + promptSettings.dismissMs,
                            fingerprint: ""
                        };
                        hold.fingerprint = buildPromptFingerprint(hold);
                        setPrompt(hold);
                        console.log(
                            JSON.stringify({
                                channel: "cwsp-clipboard-hub",
                                event: "push",
                                localId,
                                len: text.length,
                                targets: nodes,
                                afterImage: false
                            })
                        );
                    }
                    return;
                }

                if (!isQuiet()) await pushImageIfChanged(settings);
                // WHY: clear stale ContainsImage lock noise once a tick succeeds.
                if (
                    lastError &&
                    isClipboardBusyMessage(lastError)
                ) {
                    lastError = "";
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                if (!isClipboardBusyMessage(msg)) {
                    lastError = msg;
                }
            }
        });
    };

    const startPoll = async (): Promise<void> => {
        stopPoll();
        baselineReady = false;
        // WHY: reconnect after idle — never resume a pre-sleep ask hold (Waiting storm).
        if (promptHold) {
            clearPrompt(true);
        }
        // WHY: seed lastPushText / lastImageHash without sending — avoids history flush on connect.
        // INVARIANT: on seed failure keep prior lastPush*/sticky — idle reconnect must not
        // treat the same Ctrl+C as brand-new outbound content (toast loop after standby).
        try {
            const seed = normalizeClipboardText(await options.adapters.readText());
            if (seed) {
                // WHY: reconnect/idle must not re-open ask for whatever is already on clipboard.
                if (
                    stickyDismissedOutboundText &&
                    seed !== stickyDismissedOutboundText
                ) {
                    stickyDismissedOutboundText = "";
                }
                markSynced(seed);
                markEcho(seed);
            }
        } catch {
            /* ignore seed errors — keep previous lastPushText / sticky */
        }
        try {
            if (options.adapters.containsImage && options.adapters.readImageBase64) {
                if (await options.adapters.containsImage()) {
                    const raw = await options.adapters.readImageBase64();
                    const bare = String(raw || "")
                        .replace(/^data:[^;]+;base64,/i, "")
                        .replace(/\s/g, "");
                    if (bare) {
                        const hash = hashImageBase64(bare);
                        if (
                            stickyDismissedOutboundImageHash &&
                            hash !== stickyDismissedOutboundImageHash
                        ) {
                            stickyDismissedOutboundImageHash = "";
                        }
                        markImageSynced(hash);
                    }
                }
            }
        } catch {
            /* ignore image seed — keep previous lastImageHash / sticky */
        }
        baselineReady = true;
        const settings = await options.getSettings();
        lastTargets = resolveBroadcastTargets(settings, localId);
        const ms = resolvePollMs(settings, options.pollMs ?? DEFAULT_POLL_MS);
        pollTimer = setInterval(() => {
            void tickPush();
        }, ms);
        // Do not flush immediately; wait for a real OS change after baseline.
    };

    const scheduleReconnect = (opts?: { authReject?: boolean }): void => {
        if (!running) return;
        // WHY: close during await startPoll() used to schedule a timer that no-op'd
        // while connecting===true — after sleep the hub never came back.
        if (connecting) {
            reconnectQueued = { ...(reconnectQueued || {}), ...(opts || {}) };
            return;
        }
        clearReconnect();
        reconnectAttempt += 1;
        let delay = Math.min(reconnectBase * Math.max(1, reconnectAttempt), 20000);
        if (opts?.authReject) {
            authBackoffUntil = Date.now() + AUTH_RECONNECT_MS;
            delay = Math.max(delay, AUTH_RECONNECT_MS);
            lastError = lastError || "clipboard-hub: invalid credentials (4001)";
        } else if (authBackoffUntil > Date.now()) {
            delay = Math.max(delay, authBackoffUntil - Date.now());
        }
        reconnectTimer = setTimeout(() => {
            void connect();
        }, delay);
    };

    const connect = async (): Promise<void> => {
        if (!running || connecting) return;
        connecting = true;
        reconnectQueued = null;
        clearReconnect();
        closeSocket();
        stopPoll();

        try {
            const settings = await options.getSettings();
            const candidates = resolveHubCandidates(settings, packageRoot);
            const clientToken = resolveClientToken(settings, packageRoot);
            const accessToken = resolveAccessToken(settings, packageRoot);
            lastHasToken = Boolean(clientToken || accessToken);
            const insecure = allowInsecureTls(settings);
            let opened: WsLike | null = null;
            let usedUrl = "";

            // INVARIANT: gateway verify() reads userKey|token|accessToken — not clientToken alone.
            const authToken = accessToken || clientToken;
            for (const base of candidates) {
                const url = withQuery(base, {
                    clientId: localId,
                    userId: localId,
                    peerId: localId,
                    clientToken: clientToken || authToken,
                    accessToken: authToken,
                    token: authToken,
                    userKey: authToken,
                    cwsp_via: "neutralino-node-clipboard",
                    cwsp_local_endpoint: localId
                });
                try {
                    const sock = await openNodeWebSocket(url, insecure);
                    const ok = await new Promise<boolean>((resolve) => {
                        let settled = false;
                        const finish = (value: boolean) => {
                            if (settled) return;
                            settled = true;
                            resolve(value);
                        };
                        const timer = setTimeout(() => finish(false), 8000);
                        onWs(sock, "open", () => {
                            clearTimeout(timer);
                            finish(true);
                        });
                        onWs(sock, "error", () => {
                            clearTimeout(timer);
                            finish(false);
                        });
                        onWs(sock, "close", () => {
                            clearTimeout(timer);
                            finish(false);
                        });
                    });
                    // WHY: gateway may open-then-close before we attach permanent handlers.
                    if (!ok || sock.readyState !== OPEN) {
                        try {
                            sock.close();
                        } catch {
                            /* ignore */
                        }
                        continue;
                    }
                    opened = sock;
                    usedUrl = url;
                    break;
                } catch (error) {
                    lastError = error instanceof Error ? error.message : String(error);
                }
            }

            if (!opened || opened.readyState !== OPEN) {
                lastError = lastError || "clipboard-hub: no hub candidate connected";
                connecting = false;
                scheduleReconnect();
                return;
            }

            ws = opened;
            hubUrl = usedUrl;
            reconnectAttempt = 0;
            authBackoffUntil = 0;
            lastError = "";
            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "connected",
                    localId,
                    hubUrl: usedUrl.split("?")[0]
                })
            );

            onWs(opened, "message", (data: unknown) => {
                const payload =
                    data && typeof data === "object" && "data" in (data as object)
                        ? (data as { data: unknown }).data
                        : data;
                void handleInbound(payload);
            });
            onWs(opened, "close", (...args: unknown[]) => {
                const code = typeof args[0] === "number" ? args[0] : undefined;
                const reasonRaw = args[1];
                const reason =
                    typeof reasonRaw === "string"
                        ? reasonRaw
                        : reasonRaw && typeof (reasonRaw as { toString?: () => string }).toString === "function"
                          ? String(reasonRaw)
                          : "";
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "closed",
                        localId,
                        code: code ?? null,
                        reason: reason || null
                    })
                );
                stopKeepalive();
                ws = null;
                baselineReady = false;
                stopPoll();
                // WHY: standby/drop — drop ask hold + release toast. Otherwise toast
                // stays on "Waiting…" / respawns while hub has no live /ws.
                clearPrompt(true);
                if (running) {
                    const authReject =
                        code === WS_CLOSE_INVALID_CREDENTIALS ||
                        /invalid credentials/i.test(reason);
                    lastError = `clipboard-hub: ws closed ${code ?? "?"}${
                        reason ? ` (${reason})` : ""
                    }`;
                    scheduleReconnect({ authReject });
                }
            });
            onWs(opened, "error", (err: unknown) => {
                lastError =
                    err instanceof Error
                        ? err.message
                        : typeof err === "string"
                          ? err
                          : "ws error";
            });

            // Re-check after handler attach — still must be open to poll.
            if (opened.readyState !== OPEN) {
                ws = null;
                stopPoll();
                scheduleReconnect();
                return;
            }

            startKeepalive(opened);
            // WHY: release connecting before startPoll so close→scheduleReconnect can queue.
            connecting = false;
            if (reconnectQueued) {
                const queued = reconnectQueued;
                reconnectQueued = null;
                scheduleReconnect(queued);
                return;
            }
            await startPoll();
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
            scheduleReconnect();
        } finally {
            connecting = false;
            if (running && reconnectQueued) {
                const queued = reconnectQueued;
                reconnectQueued = null;
                scheduleReconnect(queued);
            }
        }
    };

    return {
        start() {
            if (running) return;
            running = true;
            void connect();
        },
        stop() {
            running = false;
            reconnectQueued = null;
            clearReconnect();
            stopPoll();
            clearPromptTimer();
            promptHold = null;
            closeSocket();
        },
        reload() {
            reconnectQueued = null;
            clearReconnect();
            stopPoll();
            closeSocket();
            reconnectAttempt = 0;
            if (!running) {
                running = true;
            }
            void connect();
        },
        status() {
            const open = Boolean(ws && ws.readyState === OPEN);
            const pongAgeMs = lastPongAt > 0 ? Date.now() - lastPongAt : null;
            // WHY: half-open after sleep — readyState OPEN but no pong → report disconnected.
            const connected =
                open &&
                (pongAgeMs == null || pongAgeMs <= DEFAULT_PONG_TIMEOUT_MS);
            return {
                running,
                connected,
                hubUrl: hubUrl.split("?")[0] || "",
                localId,
                lastPushAt,
                lastInboundAt,
                lastPongAt: lastPongAt || null,
                connecting,
                reconnectAttempt,
                outboundHoldUntil,
                lastError,
                lastPushTextLength,
                hasToken: lastHasToken,
                lastTargets,
                lastImageHash,
                hasPrompt: Boolean(promptHold),
                promptKind: promptHold?.kind ?? "",
                promptMode: promptHold?.mode ?? ""
            };
        },
        getPromptState() {
            return promptHold ? holdToState(promptHold) : null;
        },
        async resolvePrompt(action: ClipboardPromptAction): Promise<boolean> {
            // WHY: serialise against in-flight inbound/outbound IO so a poll or apply
            // cannot race the user's action.
            return withIoLock<boolean>(async () => resolvePromptInternal(action));
        },
        async takeInboundAskForPaste(): Promise<{
            applied: boolean;
            text: string;
            hasImage: boolean;
        }> {
            // WHY: capture full text before accept clears promptHold (GET state is preview-only).
            return withIoLock(async () => {
                const hold = promptHold;
                if (!hold || hold.kind !== "inbound" || hold.mode !== "ask") {
                    return { applied: false, text: "", hasImage: false };
                }
                const text = String(hold.text || "");
                const hasImage = Boolean(hold.asset?.data);
                const applied = await resolvePromptInternal("accept");
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "prompt-take-paste",
                        localId,
                        applied,
                        len: text.length,
                        hasImage
                    })
                );
                return { applied, text, hasImage };
            });
        }
    };
}
