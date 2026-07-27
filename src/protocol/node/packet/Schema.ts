/*
 * Filename: Schema.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Schema.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical v2 validation helpers. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. Packet/field validation helpers live in `@fest-lib/cwsp-shared` v2
 * and stay aligned with packet.schema.json.
 */

export {
    isCwspStatus,
    isNamespacedCwspExtensionId,
    normalizeDataAssetEnvelope,
    CWSP_STATUS_MIN,
    CWSP_STATUS_MAX,
    CWSP_EXTENSION_ID_PATTERN,
    CWSP_EXTENSION_ID_PATTERN_SOURCE,
} from "@fest-lib/cwsp-shared/v2/validation.ts";
