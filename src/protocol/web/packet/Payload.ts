/*
 * Filename: Payload.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Payload.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical clipboard payload extractors. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. Clipboard text/asset extraction lives in `@fest-lib/cwsp-shared` v2
 * so payload carrier normalization (payload/data/body) stays single-source.
 */

export {
    extractClipboardContent,
    extractClipboardText,
    extractClipboardAsset,
    getClipboardDedupeKey,
    extractClipboard,
} from "@fest-lib/cwsp-shared/v2/clipboard.ts";

export type { ClipboardContent } from "@fest-lib/cwsp-shared/v2/clipboard.ts";
