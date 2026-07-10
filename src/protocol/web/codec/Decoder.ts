/*
 * Filename: Decoder.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/codec/Decoder.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting the canonical ingress normalizer for decoding. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. `normalizeCwspPacket` is the canonical boundary normalizer from
 * `@fest-lib/cwsp-shared` v2; the web codec layer must not duplicate normalization.
 */

export {
    normalizeCwspPacket,
    normalizePacket,
    CwspNormalizationError,
} from "@fest-lib/cwsp-shared/v2/normalize.ts";
