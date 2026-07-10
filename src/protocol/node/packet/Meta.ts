/*
 * Filename: Meta.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Meta.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical purpose inference + meta types. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. `inferCwspPurpose` and the purpose/flags types are owned by
 * `@fest-lib/cwsp-shared` v2 to keep `purpose` classification single-source.
 */

export { inferCwspPurpose } from "@fest-lib/cwsp-shared/v2/normalize.ts";

export type {
    CwspPurpose,
    CwspPacketFlags,
} from "@fest-lib/cwsp-shared/v2/types.ts";
