/*
 * Filename: Clipboard.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Clipboard.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical clipboard extractors. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
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
} from "@fest-lib/cwsp-shared/v2/clipboard.ts";

export type { ClipboardContent } from "@fest-lib/cwsp-shared/v2/clipboard.ts";
export type { DataAssetEnvelope } from "@fest-lib/cwsp-shared/v2/types.ts";

export { normalizeDataAssetEnvelope } from "@fest-lib/cwsp-shared/v2/validation.ts";

import { createCwspPacket } from "@fest-lib/cwsp-shared/v2/packet.ts";
import type { CwspPacket, CwspPacketInput } from "@fest-lib/cwsp-shared/v2/types.ts";

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
