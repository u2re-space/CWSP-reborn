/*
 * Filename: Clipboard.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Clipboard.ts
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical clipboard extractors.
 *
 * NOTE: Re-export only. The NodeJS endpoint relays asset clipboard packets but does
 * not write binary to the OS clipboard (text-only `clipboardy`); see network.mdc.
 */

export {
    extractClipboardContent,
    extractClipboardText,
    extractClipboardAsset,
    getClipboardDedupeKey,
    extractClipboard,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/clipboard.ts";

export type { ClipboardContent } from "../../../../../../modules/projects/cwsp-shared/src/v2/clipboard.ts";
export type { DataAssetEnvelope } from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";

export { normalizeDataAssetEnvelope } from "../../../../../../modules/projects/cwsp-shared/src/v2/validation.ts";

import { createCwspPacket } from "../../../../../../modules/projects/cwsp-shared/src/v2/packet.ts";
import type { CwspPacket, CwspPacketInput } from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";

/**
 * Node endpoint clipboard packet helper: canonical `clipboard:update` act.
 * Text payload shape stays canonical; binary asset envelopes are relayed as-is.
 */
export function buildNodeClipboardPacket(input: CwspPacketInput): CwspPacket {
    return createCwspPacket({
        op: "act",
        what: "clipboard:update",
        purpose: "clipboard",
        protocol: "ws",
        transport: "ws",
        ...input,
    });
}
