/*
 * Filename: Clipboard.ts (airpad executor)
 * FullPath: apps/CWSP-reborn/src/backend/web/airpad/executor/Clipboard.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream C — AirPad-side clipboard executor. Extracts text
 * from a received packet via the shared web facade and applies it to an
 * injectable writer. Mirrors the PWA executor but stays AirPad-scoped so the
 * two surfaces can diverge (e.g. AirPad may later suppress local echo) without
 * coupling.
 *
 * NOTE: Text-only by design, matching the endpoint's text-only clipboardy path.
 * Binary assets remain owned by the web client via `normalizeDataAsset`.
 */

import type { CwspPacket } from "../protocol/packet/Packet.ts";
import { extractClipboardText } from "../protocol/packet/Clipboard.ts";
import type { KvStore } from "../../pwa/IDB.ts";

export { extractClipboardText };

export const AIRPAD_CLIPBOARD_LAST_KEY = "clipboard:last";

export type AirPadClipboardWriter = (text: string) => Promise<void>;

export type AirPadClipboardExecutorResult =
    | { applied: true; text: string }
    | { applied: false; deferred: true; text: string; reason: string }
    | { applied: false; deferred: false; reason: string };

export interface AirPadClipboardExecutorOptions {
    writer: AirPadClipboardWriter;
    kv?: KvStore;
}

/** Apply a received clipboard packet on the AirPad surface. */
export async function applyAirPadClipboardPacket(
    packet: CwspPacket,
    options: AirPadClipboardExecutorOptions,
): Promise<AirPadClipboardExecutorResult> {
    const text = extractClipboardText(packet);
    if (text === undefined || text === "") {
        return { applied: false, deferred: false, reason: "no-text" };
    }
    try {
        await options.writer(text);
        return { applied: true, text };
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        if (options.kv) {
            await options.kv.set(AIRPAD_CLIPBOARD_LAST_KEY, text);
            return { applied: false, deferred: true, text, reason };
        }
        return { applied: false, deferred: false, reason };
    }
}

/** Restore a deferred AirPad clipboard body, if present. */
export async function restoreDeferredAirPadClipboard(
    kv: KvStore,
    writer: AirPadClipboardWriter,
): Promise<AirPadClipboardExecutorResult> {
    const text = (await kv.get(AIRPAD_CLIPBOARD_LAST_KEY)) as string | undefined;
    if (text === undefined || text === "") {
        return { applied: false, deferred: false, reason: "no-deferred" };
    }
    try {
        await writer(text);
        await kv.delete(AIRPAD_CLIPBOARD_LAST_KEY);
        return { applied: true, text };
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        return { applied: false, deferred: false, reason };
    }
}
