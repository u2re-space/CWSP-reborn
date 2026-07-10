/*
 * Filename: Packet.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/Packet.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin NodeJS facade re-exporting canonical CWSP v2 packet builders. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: Re-export adapter only. Builders/normalizers live in `@fest-lib/cwsp-shared`.
 * The NodeJS endpoint speaks the canonical /ws transport (see network.mdc).
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

export type {
    CwspPacket,
    CwspPacketInput,
    CwspReplyInput,
    CwspPacketError,
    CwspPacketFlags,
    CwspVerb,
    LegacyCwspVerb,
    DriverReadiness,
    DriverReadinessState,
} from "@fest-lib/cwsp-shared/v2/types.ts";

import { createCwspPacket } from "@fest-lib/cwsp-shared/v2/packet.ts";
import type { CwspPacket, CwspPacketInput } from "@fest-lib/cwsp-shared/v2/types.ts";

/**
 * Node endpoint packet adapter: stamps server-side transport diagnostics
 * (`protocol: "ws"`, `transport: "ws"`) without overriding caller values.
 * Used by the canonical /ws gateway + coordinator when emitting frames.
 */
export function buildNodePacket(input: CwspPacketInput): CwspPacket {
    return createCwspPacket({
        protocol: "ws",
        transport: "ws",
        ...input,
    });
}
