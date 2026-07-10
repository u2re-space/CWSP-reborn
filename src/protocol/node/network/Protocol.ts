/*
 * Filename: Protocol.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/network/Protocol.ts
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Thin NodeJS facade for the v2 ingress normalization contract.
 *
 * NOTE: The NodeJS endpoint ingress (/ws gateway, Socket.IO compat, HTTP fallback)
 * feeds raw frames into normalizeCwspPacket. Re-export only; no duplicate normalization.
 */

export {
    normalizeCwspPacket,
    normalizePacket,
    normalizePacketForWire,
    normalizeCwspVerb,
    canonicalizeCwspAction,
    inferCwspPurpose,
    CwspNormalizationError,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/normalize.ts";

export type {
    CwspVerb,
    LegacyCwspVerb,
    CwspPurpose,
    CwspProtocol,
    CwspTransport,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/types.ts";
