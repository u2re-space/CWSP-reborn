/*
 * Filename: Policy.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/state/Policy.ts
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical v2 policy state helpers.
 *
 * NOTE: Re-export only. Web/PWA policy state (dedupe, stale, reconnect buffering)
 * is evaluated by the shared canonical policy module to keep one source of truth.
 */

export {
    evaluateCwspPolicy,
    evaluatePacketPolicy,
    classifyCwspPacket,
    DEFAULT_CWSP_POLICY,
    DEFAULT_CWSP_RECONNECT_QUEUE_SIZE,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/policy.ts";

export type {
    CwspPolicyConfig,
    CwspPolicyContext,
    CwspPolicyDecision,
    CwspPolicyClass,
    CwspPolicyAction,
    CwspPolicyReason,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";
