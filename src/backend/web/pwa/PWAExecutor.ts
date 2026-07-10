/*
 * Filename: PWAExecutor.ts
 * FullPath: apps/CWSP-reborn/src/backend/web/pwa/PWAExecutor.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Use protocol/web alias imports (Node resolve-aliases loader).
 *
 * NOTE: The writer is a thin async text writer (e.g. `navigator.clipboard.writeText`
 * bound, or a Node test stub). Binary asset application is owned by the web
 * client via `normalizeDataAsset` + `ClipboardItem`; this executor is text-only,
 * mirroring the endpoint's text-only clipboardy contract.
 */

import type { CwspPacket } from "protocol/web/packet/Packet.ts";
import { extractClipboardText } from "protocol/web/packet/Clipboard.ts";
import type { KvStore } from "./IDB.ts";

/** Defer slot for the last clipboard body that could not be applied immediately. */
export const CLIPBOARD_LAST_KEY = "clipboard:last";

/** Async text writer contract. Modeled on `navigator.clipboard.writeText`. */
export type ClipboardWriter = (text: string) => Promise<void>;

/** Outcome of an executor apply attempt. */
export type PWAExecutorResult =
    | { applied: true; text: string }
    | { applied: false; deferred: true; text: string; reason: string }
    | { applied: false; deferred: false; reason: string };

/** Configuration for the PWA clipboard executor. */
export interface PWAExecutorOptions {
    /** Required writer; pass a no-op stub in tests that only exercise defer. */
    writer: ClipboardWriter;
    /** Optional store for defer. If absent, defer is disabled. */
    kv?: KvStore;
}

/**
 * Apply a received clipboard packet.
 *
 * Behavior:
 * - extract text via the shared extractor (text preferred);
 * - if no text is present, report not-applied/deferred=false (no-op);
 * - attempt the writer; on success return `applied: true`;
 * - on writer failure (or rejection), if a KvStore was provided, persist the
 *   body under `clipboard:last` and return `deferred: true`;
 * - without a KvStore, return not-applied with the rejection reason.
 */
export async function applyClipboardPacket(
    packet: CwspPacket,
    options: PWAExecutorOptions,
): Promise<PWAExecutorResult> {
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
            await options.kv.set(CLIPBOARD_LAST_KEY, text);
            return { applied: false, deferred: true, text, reason };
        }
        return { applied: false, deferred: false, reason };
    }
}

/** Restore a previously deferred clipboard body from the KvStore, if any. */
export async function restoreDeferredClipboard(
    kv: KvStore,
    writer: ClipboardWriter,
): Promise<PWAExecutorResult> {
    const text = (await kv.get(CLIPBOARD_LAST_KEY)) as string | undefined;
    if (text === undefined || text === "") {
        return { applied: false, deferred: false, reason: "no-deferred" };
    }
    try {
        await writer(text);
        await kv.delete(CLIPBOARD_LAST_KEY);
        return { applied: true, text };
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        return { applied: false, deferred: false, reason };
    }
}
