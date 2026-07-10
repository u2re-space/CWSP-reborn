/*
 * Filename: Formats.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Formats.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting the canonical wire normalization entrypoint.
 *
 * NOTE: Re-export only. `normalizePacketForWire` is the canonical pre-send sanitizer from
 * `@fest-lib/cwsp-shared` v2; the web transport must not duplicate sanitization.
 */

export {
    normalizePacketForWire,
    normalizePacket,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/normalize.ts";
