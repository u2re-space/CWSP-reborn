/*
 * Filename: Encoder.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/codec/Encoder.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical packet builders for encoding. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export only. Packet construction/building lives in `@fest-lib/cwsp-shared` v2;
 * the NodeJS codec layer must not duplicate builder logic.
 */

export {
    createCwspPacket,
    buildPacket,
    buildCwspPacket,
    buildClipboardPacket,
    buildPacketReply,
    buildDriverReadinessError,
    CwspPacketBuildError,
} from "@fest-lib/cwsp-shared/v2/packet.ts";
