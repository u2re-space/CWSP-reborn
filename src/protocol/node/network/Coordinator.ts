/*
 * Filename: Coordinator.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/network/Coordinator.ts
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Thin NodeJS facade for coordination decisions (policy + extensions).
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
} from "../../../../../../modules/projects/cwsp-shared/src/v2/policy.ts";

export {
    resolveCwspExtensions,
    evaluateExtensions,
    handleExtensions,
    buildUnsupportedExtensionError,
    CwspExtensionResolutionError,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/extensions.ts";

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
} from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";
