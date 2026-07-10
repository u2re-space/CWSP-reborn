/*
 * Filename: Types.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Types.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical CWSP v2 type contract. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. The canonical envelope/types live in `@fest-lib/cwsp-shared` v2.
 */

export * from "@fest-lib/cwsp-shared/v2/types.ts";
