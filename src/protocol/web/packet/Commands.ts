/*
 * Filename: Commands.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Commands.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical action/verb helpers.
 *
 * NOTE: Re-export only. Action canonicalization and verb normalization are owned by
 * `@fest-lib/cwsp-shared` v2 so the web transport does not invent parallel names.
 */

export {
    canonicalizeCwspAction,
    normalizeCwspVerb,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/normalize.ts";
