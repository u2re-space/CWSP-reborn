/*
 * Filename: Protocol.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/network/Protocol.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin web facade for the v2 ingress normalization contract. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: The web ingress boundary (WebSocket / Socket.IO / HTTP) feeds raw frames
 * into normalizeCwspPacket. This facade re-exports that canonical entrypoint so
 * browser transport layers do not duplicate verb/action/purpose normalization.
 */

export {
    normalizeCwspPacket,
    normalizePacket,
    normalizePacketForWire,
    normalizeCwspVerb,
    canonicalizeCwspAction,
    inferCwspPurpose,
    CwspNormalizationError,
} from "@fest-lib/cwsp-shared/v2/normalize.ts";

export type {
    CwspVerb,
    LegacyCwspVerb,
    CwspPurpose,
    CwspProtocol,
    CwspTransport,
} from "@fest-lib/cwsp-shared/v2/types.ts";
