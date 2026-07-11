/*
 * Filename: clipboard-hub.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-hub.ts
 * Change date and time: 21.50.00_11.07.2026
 * Reason for changes: Stop Win→Android echo — quiet window + IO mutex + CRLF-normalized
 *   sync after inbound apply so local poll cannot rebroadcast desk buffer as rewrite.
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
}

export interface ClipboardHubStatus {
    running: boolean;
    connected: boolean;
    hubUrl: string;
    localId: string;
    lastPushAt: number;
    lastInboundAt: number;
    lastError: string;
    lastPushTextLength: number;
    hasToken: boolean;
    /** Last outbound destination list (diagnostics). */
    lastTargets: string[];
    /** Last pushed/applied image hash (empty if none). */
    lastImageHash: string;
}

export interface ClipboardHubRuntime {
    start(): void;
    stop(): void;
    /** Force reconnect (e.g. after WebView synced tokens into settings). */
    reload(): void;
    status(): ClipboardHubStatus;
}

type WsLike = {
    readyState: number;
    send(data: string): void;
    close(): void;
    on?(event: string, listener: (...args: unknown[]) => void): void;
    addEventListener?(event: string, listener: (...args: unknown[]) => void): void;
    removeAllListeners?(event?: string): void;
};

const OPEN = 1;
const DEFAULT_POLL_MS = 900;
const DEFAULT_RECONNECT_MS = 1500;
/** WHY: match Android CwspClipboardSync; inbound quiet must outlast one poll tick. */
const DEFAULT_ECHO_MS = 5000;
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
        process.env.CWSP_HUB_URLS,
        process.env.CWSP_REMOTE_HOST,
        process.env.CWSP_ENDPOINT_URL
    ]
        .filter(Boolean)
        .flatMap((v) => splitList(String(v)));

    const fromSettings = [
        fileAuth.hubUrl,
        fileAuth.remoteHost,
        dig(settings, ["shell", "remoteHost"]),
        dig(settings, ["socket", "remoteHost"]),
        dig(settings, ["core", "ops", "hubUrl"]),
        dig(settings, ["core", "ops", "endpointUrl"]),
        dig(settings, ["network", "remoteHost"])
    ]
        .filter(Boolean)
        .flatMap((v) => splitList(String(v)));

    const raw = [...fromEnv, ...fromSettings];
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
        dig(settings, ["core", "ops", "accessToken"])
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
        return new WS(url, insecure ? { rejectUnauthorized: false } : undefined);
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
    let reconnectAttempt = 0;
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
    let lastHasToken = false;
    let lastTargets: string[] = [];
    let lastImageHash = "";
    /** INVARIANT: false until connect baselines OS clipboard without flushing history. */
    let baselineReady = false;

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

    const isQuiet = (): boolean => Date.now() < quietUntil;

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

    const closeSocket = (): void => {
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
            enterQuiet(echoMs);
            lastInboundAt = Date.now();
            const text = normalizeClipboardText(extractClipboardText(rec));
            // WHY: strict DataAsset first; loose only when no plaintext (avoids text→fake image).
            const strictAsset =
                extractClipboardAsset(packet) ?? extractClipboardAsset(rec.payload);
            const asset =
                strictAsset ??
                (text ? undefined : extractClipboardAssetLoose(rec));

            try {
                // INVARIANT: Android→Win plaintext must win when there is no real image asset.
                // Do not rely solely on protocol.ingest (silent) — write OS clipboard here.
                if (text && !strictAsset) {
                    if (isEcho(text) || text === lastPushText) {
                        enterQuiet(echoMs);
                        return;
                    }
                    await options.adapters.writeText(text);
                    await settleAfterLocalWrite(text);
                    await reseedImageHashFromClipboard();
                    console.log(
                        JSON.stringify({
                            channel: "cwsp-clipboard-hub",
                            event: "inbound-text",
                            localId,
                            sender,
                            len: text.length,
                            quietMs: echoMs
                        })
                    );
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
                    enterQuiet(echoMs);
                    console.log(
                        JSON.stringify({
                            channel: "cwsp-clipboard-hub",
                            event: "inbound-image",
                            localId,
                            sender,
                            hash: asset.hash || "",
                            reseededHash: lastImageHash,
                            size: asset.size ?? 0,
                            quietMs: echoMs
                        })
                    );
                    if (text && !(isEcho(text) || text === lastPushText)) {
                        await options.adapters.writeText(text);
                        await settleAfterLocalWrite(text);
                    }
                    return;
                }

                if (options.adapters.ingest) {
                    await options.adapters.ingest(packet);
                    if (text) {
                        await settleAfterLocalWrite(text);
                        await reseedImageHashFromClipboard();
                        console.log(
                            JSON.stringify({
                                channel: "cwsp-clipboard-hub",
                                event: "inbound-text",
                                localId,
                                sender,
                                len: text.length,
                                via: "ingest",
                                quietMs: echoMs
                            })
                        );
                    } else {
                        enterQuiet(echoMs);
                    }
                    return;
                }

                if (!text) return;
                if (isEcho(text) || text === lastPushText) return;
                await options.adapters.writeText(text);
                await settleAfterLocalWrite(text);
                // WHY: inbound text replaces paste SoT — do not re-push prior image formats.
                await reseedImageHashFromClipboard();
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "inbound-text",
                        localId,
                        sender,
                        len: text.length,
                        quietMs: echoMs
                    })
                );
            } catch (error) {
                lastError = error instanceof Error ? error.message : String(error);
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
        if (isQuiet()) return false;
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

            const nodes = resolveBroadcastTargets(settings, localId);
            lastTargets = nodes;
            const asset = buildPngAsset(bare, hash);
            const packet = emission.buildUpdate({
                asset,
                nodes,
                destinations: nodes,
                sender: localId,
                uuid: randomUUID()
            });
            if (!sendPacket(packet)) return false;
            markImageSynced(hash);
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
            // Empty clipboard image is normal — do not poison lastError on every poll.
            const msg = error instanceof Error ? error.message : String(error);
            if (!/does not contain an image|CLIPBOARD_IMAGE/i.test(msg)) {
                lastError = msg;
            }
            return false;
        }
    };

    const tickPush = async (): Promise<void> => {
        if (!ws || ws.readyState !== OPEN || !baselineReady) return;
        await withIoLock(async () => {
            // WHY: Android→Win apply owns the clipboard briefly — never fan-out desk buffer
            // (or CRLF-mutated inbound text) back to phones as a rewrite.
            if (isQuiet()) return;
            try {
                const settings = await options.getSettings();
                if (isQuiet()) return;

                // INVARIANT: text wins over residual images. Windows often keeps CF_DIB after
                // a text copy; image-first polling re-pushed bitmaps and starved text sync.
                const text = normalizeClipboardText(await options.adapters.readText());
                if (isQuiet()) return;
                if (text && !isEcho(text) && text !== lastPushText) {
                    const nodes = resolveBroadcastTargets(settings, localId);
                    lastTargets = nodes;
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
            } catch (error) {
                lastError = error instanceof Error ? error.message : String(error);
            }
        });
    };

    const startPoll = async (): Promise<void> => {
        stopPoll();
        baselineReady = false;
        // WHY: seed lastPushText / lastImageHash without sending — avoids history flush on connect.
        try {
            const seed = normalizeClipboardText(await options.adapters.readText());
            if (seed) {
                lastPushText = seed;
                lastPushAt = Date.now();
                lastPushTextLength = seed.length;
                markEcho(seed);
            }
        } catch {
            /* ignore seed errors */
        }
        try {
            if (options.adapters.containsImage && options.adapters.readImageBase64) {
                if (await options.adapters.containsImage()) {
                    const raw = await options.adapters.readImageBase64();
                    const bare = String(raw || "")
                        .replace(/^data:[^;]+;base64,/i, "")
                        .replace(/\s/g, "");
                    if (bare) lastImageHash = hashImageBase64(bare);
                }
            }
        } catch {
            /* ignore image seed */
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

    const scheduleReconnect = (): void => {
        if (!running) return;
        clearReconnect();
        reconnectAttempt += 1;
        const delay = Math.min(reconnectBase * Math.max(1, reconnectAttempt), 20000);
        reconnectTimer = setTimeout(() => {
            void connect();
        }, delay);
    };

    const connect = async (): Promise<void> => {
        if (!running || connecting) return;
        connecting = true;
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

            for (const base of candidates) {
                const url = withQuery(base, {
                    clientId: localId,
                    userId: localId,
                    peerId: localId,
                    clientToken,
                    accessToken,
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
                console.log(
                    JSON.stringify({
                        channel: "cwsp-clipboard-hub",
                        event: "closed",
                        localId,
                        code: code ?? null
                    })
                );
                ws = null;
                baselineReady = false;
                stopPoll();
                if (running) scheduleReconnect();
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

            await startPoll();
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
            scheduleReconnect();
        } finally {
            connecting = false;
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
            clearReconnect();
            stopPoll();
            closeSocket();
        },
        reload() {
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
            return {
                running,
                connected: Boolean(ws && ws.readyState === OPEN),
                hubUrl: hubUrl.split("?")[0] || "",
                localId,
                lastPushAt,
                lastInboundAt,
                lastError,
                lastPushTextLength,
                hasToken: lastHasToken,
                lastTargets,
                lastImageHash
            };
        }
    };
}
