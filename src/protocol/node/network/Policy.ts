/*
 * Filename: Policy.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/network/Policy.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical v2 policy state helpers. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only, mirrors state/Policy.ts. Endpoint policy state (dedupe, stale,
 * reconnect buffering, clipboard echo suppression) is evaluated by the shared canonical
 * policy module so the NodeJS network layer does not duplicate policy logic.
 */

export {
    evaluateCwspPolicy,
    evaluatePacketPolicy,
    classifyCwspPacket,
    DEFAULT_CWSP_POLICY,
    DEFAULT_CWSP_RECONNECT_QUEUE_SIZE,
} from "@fest-lib/cwsp-shared/v2/policy.ts";

export type {
    CwspPolicyConfig,
    CwspPolicyContext,
    CwspPolicyDecision,
    CwspPolicyClass,
    CwspPolicyAction,
    CwspPolicyReason,
} from "@fest-lib/cwsp-shared/v2/types.ts";
