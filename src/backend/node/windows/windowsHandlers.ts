/*
 * Filename: windowsHandlers.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/windowsHandlers.ts
 * Change date and time: 19.55.00_11.07.2026
 * Reason for changes: Apply inbound clipboard DataAsset images via PS1 SetImage (not clipboardy).
 */

import { extractClipboardAsset } from "@fest-lib/cwsp-shared/v2/index.ts";
import type { ProtocolHandler, ProtocolServer } from "protocol/node/index.ts";
import { ProtocolServer as ProtocolServerCtor } from "protocol/node/index.ts";

import { ClipboardService } from "./ClipboardHandler.ts";
import AHKExecutor from "./AHKExecutor.ts";
import { emitClipboardUpdate, emitMouseMove, emitKeyboardType } from "./AHKEmission.ts";

export interface CreateWindowsProtocolOptions {
    localId?: string;
    ahkPath?: string;
    clipboard?: ClipboardService;
    ahk?: AHKExecutor;
    onEmit?: (packet: unknown) => void | Promise<void>;
}

function payloadOf(packet: { payload?: unknown; data?: unknown }): Record<string, unknown> {
    const p = packet.payload ?? packet.data;
    return p && typeof p === "object" && !Array.isArray(p)
        ? (p as Record<string, unknown>)
        : {};
}

function num(value: unknown, fallback = 0): number {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : fallback;
}

/**
 * Build a ProtocolServer with Windows clipboard + AHK input handlers.
 * WHY: keeps shared ProtocolServer free of platform imports (hardlink-safe).
 */
export function createWindowsProtocolServer(
    options: CreateWindowsProtocolOptions = {}
): {
    server: ProtocolServer;
    clipboard: ClipboardService;
    ahk: AHKExecutor;
} {
    const localId = options.localId ?? process.env.CWSP_CLIENT_ID ?? "L-110";
    const ahkPath =
        options.ahkPath ??
        process.env.CWSP_AHK_PATH ??
        "C:\\Program Files\\AutoHotkey\\AutoHotkey.exe";

    const clipboard = options.clipboard ?? new ClipboardService();
    const ahk = options.ahk ?? new AHKExecutor(ahkPath, clipboard);

    const clipboardWrite: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const text =
            (typeof body.text === "string" && body.text) ||
            (typeof body.content === "string" && body.content) ||
            (typeof body.body === "string" && body.body) ||
            "";
        if (text) {
            await clipboard.writeText(text);
        }

        const asset =
            extractClipboardAsset(packet) ||
            extractClipboardAsset(body);
        const imageData =
            (asset && typeof asset.data === "string" ? asset.data : "") ||
            (typeof body.imageBase64 === "string" ? body.imageBase64 : "") ||
            (typeof body.data === "string" &&
            String(body.mimeType || body.type || "").startsWith("image/")
                ? body.data
                : "");
        if (imageData) {
            await clipboard.writeImageBase64(imageData);
        }

        const emitted = emitClipboardUpdate({ text, byId: localId });
        await options.onEmit?.(emitted);
        return reply("result", {
            ok: true,
            what: packet.what,
            textLength: text.length,
            hasImage: Boolean(imageData)
        });
    };

    const clipboardRead: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const kind = String(body.kind || "text").toLowerCase();
        if (kind === "image") {
            try {
                const data = await clipboard.readImageBase64();
                return reply("result", {
                    ok: true,
                    kind: "image",
                    mimeType: "image/png",
                    data,
                    imageBase64: data
                });
            } catch (error) {
                return reply("error", {
                    ok: false,
                    code: "CLIPBOARD_IMAGE_EMPTY",
                    message: error instanceof Error ? error.message : String(error)
                });
            }
        }
        const text = await clipboard.readText();
        return reply("result", { ok: true, kind: "text", text, content: text, body: text, data: text });
    };

    const clipboardReady: ProtocolHandler = async ({ reply }) =>
        reply("result", { ok: true, ready: true });

    const mouseMove: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const data =
            body.data && typeof body.data === "object"
                ? (body.data as Record<string, unknown>)
                : body;
        const x = num(data.x);
        const y = num(data.y);
        await ahk.mouseMove(x, y);
        await options.onEmit?.(emitMouseMove({ x, y, byId: localId }));
        return reply("result", { ok: true, x, y });
    };

    const mouseClick: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const data =
            body.data && typeof body.data === "object"
                ? (body.data as Record<string, unknown>)
                : body;
        const button = String(data.button ?? "left");
        const double = Boolean(data.double);
        await ahk.mouseClick(button, double);
        return reply("result", { ok: true, button, double });
    };

    const mouseScroll: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const data =
            body.data && typeof body.data === "object"
                ? (body.data as Record<string, unknown>)
                : body;
        const delta = num(data.delta ?? data.y ?? data.z);
        await ahk.mouseScroll(delta);
        return reply("result", { ok: true, delta });
    };

    const keyboardType: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const data =
            body.data && typeof body.data === "object"
                ? (body.data as Record<string, unknown>)
                : body;
        const text = String(data.text ?? body.text ?? "");
        await ahk.keyboardType(text);
        await options.onEmit?.(emitKeyboardType({ text, byId: localId }));
        return reply("result", { ok: true, length: text.length });
    };

    const keyboardTap: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const data =
            body.data && typeof body.data === "object"
                ? (body.data as Record<string, unknown>)
                : body;
        const key = String(data.key ?? "");
        const modifiers = Array.isArray(data.modifier)
            ? data.modifier.map(String)
            : Array.isArray(data.modifiers)
              ? data.modifiers.map(String)
              : [];
        await ahk.keyboardTap(key, modifiers);
        return reply("result", { ok: true, key, modifiers });
    };

    const inputReady: ProtocolHandler = async ({ reply }) =>
        reply("result", { ok: true, ready: true, driver: "ahk" });

    const airpadMouse: ProtocolHandler = async (ctx) => {
        const body = payloadOf(ctx.packet);
        const op = String(body.op ?? body.action ?? body.type ?? "move").toLowerCase();
        if (op.includes("click")) return mouseClick(ctx);
        if (op.includes("scroll")) return mouseScroll(ctx);
        if (op.includes("down") || op.includes("up")) {
            // COMPAT: map down/up to click for now (AHK stub has no hold state yet).
            return mouseClick(ctx);
        }
        return mouseMove(ctx);
    };

    const airpadKeyboard: ProtocolHandler = async (ctx) => {
        const body = payloadOf(ctx.packet);
        const op = String(body.op ?? body.action ?? body.type ?? "type").toLowerCase();
        if (op.includes("tap") || op.includes("key")) return keyboardTap(ctx);
        return keyboardType(ctx);
    };

    // NOTE: `server` is assigned after handler map is built; nested dispatch
    // closes over this binding (TDZ-safe once handlers run asynchronously).
    let server!: ProtocolServer;

    const networkDispatch: ProtocolHandler = async ({ packet, reply }) => {
        const body = payloadOf(packet);
        const nested = body.payload ?? body.data ?? body;
        if (nested && typeof nested === "object") {
            const nestedWhat =
                typeof (nested as { what?: unknown }).what === "string"
                    ? String((nested as { what: string }).what)
                    : typeof (nested as { op?: unknown }).op === "string"
                      ? String((nested as { op: string }).op)
                      : "";
            if (nestedWhat) {
                return server.ingest({
                    ...(nested as object),
                    what: nestedWhat,
                    op: (nested as { op?: string }).op ?? "act"
                });
            }
        }
        return reply("result", { ok: true, forwarded: false });
    };

    server = new ProtocolServerCtor({
        localId,
        aliases: {
            clipboard: "clipboard:update",
            "clipboard.write": "clipboard:write",
            "clipboard.read": "clipboard:read",
            "clipboard.get": "clipboard:get",
            "airpad:clipboard:write": "clipboard:write",
            "airpad:clipboard:read": "clipboard:read",
            "airpad:clipboard:delivery": "clipboard:update",
            dispatch: "network:dispatch",
            "network.dispatch": "network:dispatch"
        },
        handlers: {
            "clipboard:update": clipboardWrite,
            "clipboard:write": clipboardWrite,
            "clipboard:read": clipboardRead,
            "clipboard:get": clipboardRead,
            "clipboard:clear": async ({ reply }) => {
                await clipboard.writeText("");
                return reply("result", { ok: true, cleared: true });
            },
            "clipboard:isReady": clipboardReady,
            "mouse:move": mouseMove,
            "mouse:click": mouseClick,
            "mouse:scroll": mouseScroll,
            "mouse:down": mouseClick,
            "mouse:up": mouseClick,
            "mouse:isReady": inputReady,
            "keyboard:type": keyboardType,
            "keyboard:tap": keyboardTap,
            "keyboard:toggle": keyboardTap,
            "keyboard:isReady": inputReady,
            "airpad:mouse": airpadMouse,
            "airpad:keyboard": airpadKeyboard,
            "network:dispatch": networkDispatch
        }
    });

    return { server, clipboard, ahk };
}
