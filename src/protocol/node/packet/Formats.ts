/*
 * Filename: Formats.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Formats.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting the canonical wire normalization entrypoint.
 *
 * NOTE: Re-export only. `normalizePacketForWire` is the canonical pre-send sanitizer from
 * `@fest-lib/cwsp-shared` v2; the NodeJS endpoint must not duplicate sanitization.
 */

export {
    normalizePacketForWire,
    normalizePacket,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/normalize.ts";
