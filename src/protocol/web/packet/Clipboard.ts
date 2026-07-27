/*
 * Filename: Clipboard.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Clipboard.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical clipboard extractors. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. Web clients own File/Blob/base64 normalization via
 * normalizeDataAsset (see features-data-asset.mdc); this facade does not duplicate it.
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
 * Web clipboard packet helper: canonical `clipboard:update` act stamped with
 * browser transport diagnostics. Text/asset payload shape stays canonical.
 */
export function buildWebClipboardPacket(input: CwspPacketInput): CwspPacket {
    return createCwspPacket({
        op: "act",
        what: "clipboard:update",
        purpose: "clipboard",
        protocol: "ws",
        transport: "ws",
        ...input,
    });
}
