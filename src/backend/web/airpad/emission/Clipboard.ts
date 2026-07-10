/*
 * Filename: Clipboard.ts (airpad emission)
 * FullPath: apps/CWSP-reborn/src/backend/web/airpad/emission/Clipboard.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Use protocol/web alias imports (Node resolve-aliases loader).
 *
 * NOTE: AirPad wrappers (`airpad:clipboard:write` / `airpad:clipboard:delivery`)
 * are compatibility aliases normalized by the endpoint into `clipboard:update`.
 * Here we expose both the canonical builder and a thin AirPad-aliased helper so
 * UI/emission code can pick the surface it needs without re-implementing packets.
 */

import { buildWebClipboardPacket, extractClipboardText, extractClipboardContent } from "protocol/web/packet/Clipboard.ts";
import type { CwspPacket, CwspPacketInput } from "protocol/web/packet/Packet.ts";

export { extractClipboardText, extractClipboardContent };

/** Identity of the AirPad peer emitting the clipboard packet. */
export interface AirPadClipboardIdentity {
    sender: string;
    destinations?: readonly string[];
}

/** Input for an AirPad clipboard emission. */
export interface AirPadClipboardEmissionInput {
    text: string;
    uuid: string;
    timestamp: number;
    identity: AirPadClipboardIdentity;
    destinations?: readonly string[];
}

/**
 * Canonical `clipboard:update` act packet from an AirPad peer. This is what the
 * endpoint ultimately normalizes AirPad wrappers to, so emitting it directly is
 * always safe and avoids an extra normalize hop.
 */
export function buildAirPadClipboardPacket(input: AirPadClipboardEmissionInput): CwspPacket {
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

/**
 * AirPad-aliased `airpad:clipboard:write` wrapper. The endpoint unwraps this to
 * `clipboard:update`; we keep the alias for callers that prefer the AirPad surface.
 */
export function buildAirPadClipboardWriteWrapper(input: AirPadClipboardEmissionInput): CwspPacket {
    const packetInput: CwspPacketInput = {
        op: "act",
        what: "airpad:clipboard:write",
        purpose: "clipboard",
        uuid: input.uuid,
        timestamp: input.timestamp,
        sender: input.identity.sender,
        destinations: input.destinations ?? input.identity.destinations,
        payload: { text: input.text },
    };
    return buildWebClipboardPacket(packetInput);
}
