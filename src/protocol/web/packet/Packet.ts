/*
 * Filename: Packet.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Packet.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin web facade re-exporting canonical CWSP v2 packet builders. | Alias migration 17.20.00_10.07.2026: long relative cwsp-shared imports -> @fest-lib/cwsp-shared/v2/*.
 *
 * NOTE: This is a re-export adapter only. All builders/normalizers live in
 * `@fest-lib/cwsp-shared` (modules/projects/cwsp-shared). Do not duplicate logic here.
 * COMPAT: relative import used so node --test can resolve without tsconfig path alias.
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
 * Web/PWA default packet adapter: stamps browser-side transport diagnostics
 * (`protocol: "ws"`, `transport: "ws"`) without overriding caller values.
 * The canonical envelope meaning is defined by op/what/payload/nodes/uuid;
 * these fields are transport diagnostics only (see .cursor/rules/network.mdc).
 */
export function buildWebPacket(input: CwspPacketInput): CwspPacket {
    return createCwspPacket({
        protocol: "ws",
        transport: "ws",
        ...input,
    });
}
