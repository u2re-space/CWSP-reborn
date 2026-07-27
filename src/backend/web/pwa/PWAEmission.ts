/*
 * Filename: PWAEmission.ts
 * FullPath: apps/CWSP-reborn/src/backend/web/pwa/PWAEmission.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Use protocol/web alias imports (Node resolve-aliases loader).
 *
 * NOTE: All packet construction goes through `buildWebClipboardPacket` from
 * `protocol/web/packet/Clipboard.ts`, which delegates to cwsp-shared v2. We do
 * NOT duplicate envelope/verb normalization here.
 */

import { buildWebClipboardPacket, extractClipboardText } from "protocol/web/packet/Clipboard.ts";
import type { CwspPacket, CwspPacketInput } from "protocol/web/packet/Packet.ts";

export { extractClipboardText };

/** Injected PWA identity used to stamp outgoing packets. */
export interface PWAIdentity {
    sender: string;
    /** Optional default destinations (target node ids). */
    destinations?: readonly string[];
}

/** Input for a PWA clipboard emission. */
export interface PWAClipboardEmissionInput {
    text: string;
    uuid: string;
    timestamp: number;
    identity: PWAIdentity;
    /** Override default destinations for this emission. */
    destinations?: readonly string[];
}

/**
 * Build a canonical `clipboard:update` act packet for a PWA clipboard write.
 * Uses the web facade so transport diagnostics (`protocol: ws`, `transport: ws`)
 * stay consistent across PWA and frontend transports.
 */
export function buildPwaClipboardPacket(input: PWAClipboardEmissionInput): CwspPacket {
    const packetInput: CwspPacketInput = {
        op: "act",
        uuid: input.uuid,
        timestamp: input.timestamp,
        sender: input.identity.sender,
        destinations: input.destinations ?? input.identity.destinations,
        payload: { text: input.text },
    };
    return buildWebClipboardPacket(packetInput);
}
