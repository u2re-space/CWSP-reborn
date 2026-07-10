/*
 * Filename: Coordinator.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/network/Coordinator.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade for coordination decisions (policy + extensions). | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. The canonical /ws coordinator applies shared policy +
 * extension resolution; this facade exposes them to the NodeJS endpoint runtime.
 */

export {
    evaluateCwspPolicy,
    evaluatePacketPolicy,
    classifyCwspPacket,
    DEFAULT_CWSP_POLICY,
    DEFAULT_CWSP_RECONNECT_QUEUE_SIZE,
} from "@fest-lib/cwsp-shared/v2/policy.ts";

export {
    resolveCwspExtensions,
    evaluateExtensions,
    handleExtensions,
    buildUnsupportedExtensionError,
    CwspExtensionResolutionError,
} from "@fest-lib/cwsp-shared/v2/extensions.ts";

export type {
    CwspPolicyDecision,
    CwspPolicyContext,
    CwspPolicyConfig,
    CwspPolicyClass,
    CwspPolicyAction,
    CwspPolicyReason,
    CwspExtensionResolution,
    CwspExtension,
    SupportedCwspExtension,
} from "@fest-lib/cwsp-shared/v2/types.ts";
