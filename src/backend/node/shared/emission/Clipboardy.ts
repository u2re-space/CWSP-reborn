/*
 * Filename: Clipboardy.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/emission/Clipboardy.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Resolve cwsp-shared via @fest-lib alias (Node loader).
 */

import { randomUUID } from "node:crypto";

import {
    buildClipboardPacket,
    type CwspPacket,
    type DataAssetEnvelope
} from "@fest-lib/cwsp-shared/v2/index.ts";

export interface ClipboardEmissionOptions {
    /** Logical peer id stamped on emitted packets. */
    sender?: string;
    /** Diagnostics protocol stamp (default `ws`). */
    protocol?: string;
    /** Diagnostics transport stamp (default `ws`). */
    transport?: string;
}

export interface ClipboardUpdateInput {
    text?: string;
    asset?: DataAssetEnvelope;
    destinations?: string[];
    nodes?: string[];
    uuid?: string;
    timestamp?: number;
    sender?: string;
}

export interface ClipboardEmission {
    /**
     * Build a canonical `clipboard:update` act packet.
     * WHY: emission stays pure — no OS clipboard I/O; executor owns apply/read/write.
     */
    buildUpdate(input: ClipboardUpdateInput): CwspPacket;
}

/**
 * Factory for clipboard packet emission (text and/or DataAsset envelope).
 * INVARIANT: protocol/transport default to `ws` for native-first peers.
 */
export function createClipboardEmission(
    options: ClipboardEmissionOptions = {}
): ClipboardEmission {
    const defaultSender = options.sender ?? "local";
    const protocol = options.protocol ?? "ws";
    const transport = options.transport ?? "ws";

    return {
        buildUpdate(input: ClipboardUpdateInput): CwspPacket {
            if (input.text === undefined && input.asset === undefined) {
                throw new TypeError(
                    "clipboard emission requires text and/or asset"
                );
            }

            const payload: Record<string, unknown> = {};
            if (input.text !== undefined) {
                payload.text = input.text;
            }
            if (input.asset !== undefined) {
                payload.asset = input.asset;
            }

            return buildClipboardPacket({
                op: "act",
                what: "clipboard:update",
                purpose: "clipboard",
                protocol,
                transport,
                uuid: input.uuid ?? randomUUID(),
                timestamp: input.timestamp ?? Date.now(),
                sender: input.sender ?? defaultSender,
                destinations: input.destinations,
                nodes: input.nodes,
                payload
            });
        }
    };
}
