/*
 * Filename: DataType.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/DataType.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting the unified DataAsset envelope helper.
 *
 * NOTE: Re-export only. Binary/file/blob/base64/url normalization stays single-source in
 * `@fest-lib/cwsp-shared` v2 (see features-data-asset.mdc).
 */

export { normalizeDataAssetEnvelope } from "../../../../../../modules/projects/cwsp-shared/src/v2/validation.ts";

export type { DataAssetEnvelope } from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";
