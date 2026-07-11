/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/index.ts
 * Change date and time: 16.25.00_11.07.2026
 * Reason for changes: Neutralino/Windows — generic Node ProtocolServer (shared hardlink-safe).
 */

/**
 * Platform-agnostic CWSP v2 protocol dispatch for Node runtimes.
 *
 * INVARIANT: This file is hardlinked across protocol façades — do NOT import
 * Windows AHK / Linux AutoKey / ClipboardService here. Inject handlers instead.
 *
 * WHY: Windows Neutralino, Linux Neutralino, WebNative, and Fastify all share
 * one ProtocolServer surface; platform execution lives in backend handlers
 * (windows / linux / shared), not in this hardlinked file.
 */

import { randomUUID } from "node:crypto";

import {
    buildPacketReply,
    createCwspPacket,
    normalizeCwspPacket,
    type CwspPacket,
    type CwspVerb
} from "@fest-lib/cwsp-shared/v2/index.ts";

export type ProtocolHandlerResult = unknown;

export interface ProtocolHandlerContext {
    packet: CwspPacket;
    /** Optional reply helper for ask → result/error. */
    reply: (op: "result" | "error", payload?: Record<string, unknown>) => CwspPacket;
}

export type ProtocolHandler = (
    ctx: ProtocolHandlerContext
) => ProtocolHandlerResult | Promise<ProtocolHandlerResult>;

export interface ProtocolServerOptions {
    /**
     * Map of canonical `what` → handler.
     * Aliases may be registered separately via `aliases`.
     */
    handlers?: Record<string, ProtocolHandler>;
    /** Legacy / short action → canonical what. */
    aliases?: Record<string, string>;
    /** Fallback when no handler matches (default: no-op result). */
    defaultHandler?: ProtocolHandler;
    /** Called after a successful local handle (for emission / WS fan-out). */
    onHandled?: (packet: CwspPacket, result: ProtocolHandlerResult) => void | Promise<void>;
    /** Local peer id stamped on replies when missing. */
    localId?: string;
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function resolveWhat(
    what: string,
    aliases: Record<string, string> | undefined
): string {
    const trimmed = String(what || "").trim();
    if (!trimmed) return "network:dispatch";
    if (aliases?.[trimmed]) return aliases[trimmed];
    const lower = trimmed.toLowerCase();
    if (aliases?.[lower]) return aliases[lower];
    return trimmed;
}

/**
 * Shared Node protocol executor.
 * COMPAT: accepts constructor options object only (inject platform handlers).
 */
export class ProtocolServer {
    private readonly handlers: Map<string, ProtocolHandler>;
    private readonly aliases: Record<string, string>;
    private readonly defaultHandler: ProtocolHandler | undefined;
    private readonly onHandled:
        | ((packet: CwspPacket, result: ProtocolHandlerResult) => void | Promise<void>)
        | undefined;
    private readonly localId: string;

    constructor(options: ProtocolServerOptions = {}) {
        this.handlers = new Map(Object.entries(options.handlers ?? {}));
        this.aliases = { ...(options.aliases ?? {}) };
        this.defaultHandler = options.defaultHandler;
        this.onHandled = options.onHandled;
        this.localId = options.localId ?? "L-local";
    }

    /** Register or replace a handler for a canonical `what`. */
    register(what: string, handler: ProtocolHandler): void {
        this.handlers.set(what, handler);
    }

    /** Register action aliases that collapse onto a canonical `what`. */
    alias(from: string, to: string): void {
        this.aliases[from] = to;
        this.aliases[from.toLowerCase()] = to;
    }

    /** Normalize an arbitrary ingress value into a CWSP v2 packet. */
    normalize(raw: unknown): CwspPacket {
        return normalizeCwspPacket(raw);
    }

    /**
     * Ingest + dispatch a raw Neutralino / HTTP / WS payload.
     * Returns the handler result (often a reply packet or apply status).
     */
    async ingest(raw: unknown): Promise<{
        packet: CwspPacket;
        result: ProtocolHandlerResult;
    }> {
        const packet = this.normalize(raw);
        const result = await this.dispatch(packet);
        return { packet, result };
    }

    /** Dispatch an already-normalized packet to the matching handler. */
    async dispatch(packet: CwspPacket): Promise<ProtocolHandlerResult> {
        const what = resolveWhat(packet.what, this.aliases);
        const handler = this.handlers.get(what) ?? this.defaultHandler;

        const reply = (
            op: "result" | "error",
            payload: Record<string, unknown> = {}
        ): CwspPacket => {
            const now = Date.now();
            if (op === "error") {
                return buildPacketReply(packet, {
                    op: "error",
                    timestamp: now,
                    sender: this.localId,
                    error: {
                        code: String(payload.code ?? "CWSP_HANDLER_ERROR"),
                        message: String(payload.message ?? payload.error ?? "handler error")
                    }
                });
            }
            return buildPacketReply(packet, {
                op: "result",
                timestamp: now,
                sender: this.localId,
                payload
            });
        };

        if (!handler) {
            const empty = reply("result", { handled: false, what });
            await this.onHandled?.(packet, empty);
            return empty;
        }

        const result = await handler({ packet: { ...packet, what }, reply });
        await this.onHandled?.(packet, result);
        return result;
    }

    /**
     * Build a local act/ask packet (helper for Neutralino extension callers).
     */
    build(
        what: string,
        payload: Record<string, unknown> = {},
        op: CwspVerb = "act"
    ): CwspPacket {
        return createCwspPacket({
            op,
            what: resolveWhat(what, this.aliases),
            protocol: "local",
            transport: "bridge",
            uuid: randomUUID(),
            timestamp: Date.now(),
            sender: this.localId,
            byId: this.localId,
            payload: asRecord(payload),
            flags: { canonicalV2: true }
        });
    }
}

export default ProtocolServer;
