/*
 * Filename: Meta.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Meta.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical purpose inference + meta types.
 *
 * NOTE: Re-export only. `inferCwspPurpose` and the purpose/flags types are owned by
 * `@fest-lib/cwsp-shared` v2 to keep `purpose` classification single-source.
 */

export { inferCwspPurpose } from "../../../../../../modules/projects/cwsp-shared/src/v2/normalize.ts";

export type {
    CwspPurpose,
    CwspPacketFlags,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";
