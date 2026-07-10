/*
 * Filename: Payload.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Payload.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical clipboard payload extractors.
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
} from "../../../../../../modules/projects/cwsp-shared/src/v2/clipboard.ts";

export type { ClipboardContent } from "../../../../../../modules/projects/cwsp-shared/src/v2/clipboard.ts";
