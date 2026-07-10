/*
 * Filename: Encoder.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/codec/Encoder.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical packet builders for encoding.
 *
 * NOTE: Re-export only. Packet construction/building lives in `@fest-lib/cwsp-shared` v2;
 * the web codec layer must not duplicate builder logic.
 */

export {
    createCwspPacket,
    buildPacket,
    buildCwspPacket,
    buildClipboardPacket,
    buildPacketReply,
    buildDriverReadinessError,
    CwspPacketBuildError,
} from "../../../../../../modules/projects/cwsp-shared/src/v2/packet.ts";
