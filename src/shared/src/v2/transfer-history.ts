/*
 * Filename: transfer-history.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/transfer-history.ts
 * Change date and time: 09.45.00_31.07.2026
 * Reason for changes: Cap+Neu Transfer History — ring store (max 100) for
 *   clipboard/files prompts (active + expired) with progress merge by transferId.
 *   2026-07-31: `batch()` coalesces notify storms from Neu poll replace/upsert.
 *   2026-07-25: inbound clipboard stays actionable (no expired mute) — Accept /
 *   Open / Download remain available; retainedText for re-apply after toast TTL.
 *   2026-07-25c: merge by id/transferId/contentKey — no duplicate done/failed
 *   rows; lastActionAt on the existing entry (files progress→done in-place).
 *   2026-07-25d: `remove` action on every History row (incl. done/expired).
 *   2026-07-25e: clipboard-image — thumbDataUrl for UI; Accept/Download stay
 *   available; formatTransferBytes for image size subtitles.
 *   2026-07-25f: localFilePath for Neu durable PNG (toast already materializes
 *   files under .tmp; History keeps a copy for Accept/Open after TTL).
 *   2026-07-25i: History actions ≥ toast/notif — `share` (Share again) for
 *   outbound images + former clipboard when Neu/peer was offline.
 *   2026-07-25j: same-content clipboard Accept echoes collapse into one recent
 *   row (stable contentKey + body match); keep Accept/Open/Download actions.
 *   2026-07-25k: image Open+Save actions; Remove aborts files; URL Open always
 *   present when body has http(s); no sparse done clones.
 *   2026-07-25o: inbound done single-file transfers get Open (+ Reveal).
 *
 * WHY: Native toast/notification is short-lived; History is the durable second
 * channel (plan 1C + 2A). Pure / side-effect free — no DOM, Android, or Node I/O.
 */

/** Clipboard text, clipboard image asset, or multi-file transfer. */
export type TransferHistoryKind = "clipboard-text" | "clipboard-image" | "files";

export type TransferHistoryDirection = "in" | "out";

/**
 * Lifecycle status for a history row.
 * - actionable: user can Accept / Decline / Open / etc.
 * - progress: bytes moving (files); show bar + speed
 * - expired: offer/hold timed out — keep in list, muted, no actions
 */
export type TransferHistoryStatus =
    | "pending"
    | "actionable"
    | "progress"
    | "done"
    | "declined"
    | "expired"
    | "error";

/** Computed UI actions from kind + direction + status (not free-form flags). */
export type TransferHistoryAction =
    | "accept"
    | "dismiss"
    | "decline"
    | "open"
    | "download"
    | "cancel"
    | "reveal"
    /**
     * Re-fan clipboard text/image to peers (toast Share parity).
     * WHY: desk/Neu may have been offline when Cap Shared — History retries.
     */
    | "share"
    /** Drop this row from History (any status, including done/expired). */
    | "remove";

export interface TransferHistoryEntry {
    id: string;
    ts: number;
    kind: TransferHistoryKind;
    direction: TransferHistoryDirection;
    status: TransferHistoryStatus;
    title: string;
    subtitle?: string;
    textPreview?: string;
    /**
     * Full clipboard body for History re-Accept after toast/hold TTL.
     * WHY: textPreview is truncated for UI; Accept needs the real payload.
     * Cap ~64KiB; larger bodies still keep preview + actions best-effort.
     */
    retainedText?: string;
    /**
     * Compact image preview (`data:image/…;base64,…`) for History cards.
     * WHY: clipboard-image rows need a visual — full asset stays in native hold
     * / temp file; thumb is display + best-effort re-Accept after toast TTL.
     */
    thumbDataUrl?: string;
    /**
     * Absolute path to a retained image file (Neutralino/desk).
     * WHY: hub already materializes PNGs for the toast; History copies them so
     * Accept / Open File still work after prompt TTL deletes `.tmp/clipboard-prompt`.
     */
    localFilePath?: string;
    fileNames?: string[];
    /** Stable key for files progress merge (and offer correlation). */
    transferId?: string;
    bytesDone?: number;
    totalBytes?: number;
    speedBps?: number;
    etaMs?: number | null;
    expiresAt?: number;
    /** Optional peer / dest label for subtitle. */
    peerId?: string;
    error?: string;
    /** Clipboard fingerprint for merge (same content → one History row). */
    contentKey?: string;
    /**
     * Last successful action / terminal update (Accept, transfer done, …).
     * WHY: avoid spawning a second "done" row — stamp the existing entry instead.
     * `ts` stays first-seen; UI prefers lastActionAt when set.
     */
    lastActionAt?: number;
}

export const TRANSFER_HISTORY_MAX = 100;
/**
 * COMPAT: short-window body fallback when contentKey was missing on first write.
 * Same-content Accept echoes still merge by contentKey for the whole ring.
 */
export const TRANSFER_HISTORY_CLIP_DEDUPE_MS = 5_000;

/**
 * Recent-history window for collapsing identical clipboard bodies that lack a
 * stable contentKey (or had mismatched keys across Cap/Neu emits).
 * WHY: two Accept toasts for the same paste must show as one History row.
 */
export const TRANSFER_HISTORY_CLIP_RECENT_COLLAPSE_MS = 120_000;

export interface TransferHistoryStore {
    push(entry: TransferHistoryEntry): TransferHistoryEntry;
    upsert(entry: TransferHistoryEntry): TransferHistoryEntry;
    updateProgress(input: {
        transferId: string;
        bytesDone: number;
        totalBytes: number;
        speedBps?: number;
        etaMs?: number | null;
        ts?: number;
    }): TransferHistoryEntry | undefined;
    mark(
        idOrTransferId: string,
        status: TransferHistoryStatus,
        patch?: Partial<TransferHistoryEntry>
    ): TransferHistoryEntry | undefined;
    list(): TransferHistoryEntry[];
    get(id: string): TransferHistoryEntry | undefined;
    /** Remove one row by id or transferId. Returns true when something was dropped. */
    remove(idOrTransferId: string): boolean;
    clear(): void;
    /**
     * Run multiple mutations with a single listener notify at the end.
     * WHY: Neu GET replace loops upsert+remove per row; without batch each
     * mutation rebuilds History DOM and rewrites localStorage (UI freeze).
     */
    batch(fn: () => void): void;
    /** Subscribe to list changes; returns unsubscribe. */
    subscribe(listener: (entries: TransferHistoryEntry[]) => void): () => void;
}

export interface CreateTransferHistoryStoreOptions {
    max?: number;
    clipDedupeMs?: number;
    /** Seed from persistence (already GC'd or will be GC'd on create). */
    initial?: TransferHistoryEntry[];
}

function cloneEntry(e: TransferHistoryEntry): TransferHistoryEntry {
    return {
        ...e,
        fileNames: e.fileNames ? [...e.fileNames] : undefined
    };
}

/**
 * Actions available for a row.
 * WHY (clipboard inbound): payload already landed on-device — Keep Accept / Open /
 * Download available after toast TTL (do not treat clipboard as expired/muted).
 * Files offers still expire / decline with no operational actions.
 * INVARIANT: every row gets `remove` (including done / expired / declined).
 */
/**
 * True when a files row is a singleton (one landed/offered file).
 * WHY: History Open makes sense for one file; multi-file keeps Reveal/folder.
 */
export function isSingleFileTransfer(entry: TransferHistoryEntry): boolean {
    if (!entry || entry.kind !== "files") return false;
    const names = entry.fileNames;
    if (Array.isArray(names)) {
        if (names.length === 1) return true;
        if (names.length > 1) return false;
    }
    const sub = String(entry.subtitle || "").trim();
    const m = sub.match(/^(\d+)\s+file/i);
    if (m) return Number(m[1]) === 1;
    // Durable single path retained after toast TTL.
    if (String(entry.localFilePath || "").trim()) return true;
    return false;
}

export function actionsForEntry(entry: TransferHistoryEntry): TransferHistoryAction[] {
    const { kind, direction, status } = entry;
    const isClipboard =
        kind === "clipboard-text" || kind === "clipboard-image";
    const acts: TransferHistoryAction[] = [];
    const clipBody =
        entry.retainedText || entry.textPreview || entry.subtitle || "";

    // Inbound clipboard: Accept / Dismiss / Open / Save / Share again / Remove.
    if (isClipboard && direction === "in") {
        if (status !== "declined" && status !== "error") {
            acts.push("accept");
            if (status === "actionable" || status === "pending") {
                acts.push("dismiss");
            }
            if (kind === "clipboard-image") {
                // Open = view image; download = Save file (labels in UI).
                acts.push("open", "download");
                if (entry.localFilePath) acts.push("reveal");
            } else if (looksLikeHttpUrl(clipBody)) {
                // Links: Accept (paste) + Open (external browser).
                acts.push("open");
            }
            if (canShareAgain(entry)) acts.push("share");
        }
        // INVARIANT: Remove always present (archive / dismiss leftover).
        acts.push("remove");
        return acts;
    }

    // Outbound clipboard: Share again + Open/Save + Remove.
    if (isClipboard && direction === "out") {
        if (status !== "declined" && status !== "error") {
            if (canShareAgain(entry)) acts.push("share");
            if (kind === "clipboard-image") {
                if (
                    Boolean(entry.localFilePath) ||
                    isHistoryImageDataUrl(entry.thumbDataUrl)
                ) {
                    acts.push("open", "download");
                    if (entry.localFilePath) acts.push("reveal");
                }
            } else if (looksLikeHttpUrl(clipBody)) {
                acts.push("open");
            }
        }
        acts.push("remove");
        return acts;
    }

    if (status === "expired" || status === "declined" || status === "error") {
        acts.push("remove");
        return acts;
    }
    if (status === "done") {
        if (kind === "files" && direction === "in") {
            // WHY: singleton received file → Open like the "Files saved" notif.
            if (isSingleFileTransfer(entry)) acts.push("open");
            acts.push("reveal");
        }
        acts.push("remove");
        return acts;
    }
    if (kind === "files") {
        if (direction === "in") {
            if (status === "actionable" || status === "pending") {
                acts.push("accept", "decline");
            } else if (status === "progress") {
                acts.push("cancel");
            }
        } else if (
            status === "progress" ||
            status === "actionable" ||
            status === "pending"
        ) {
            acts.push("cancel");
        }
        // WHY: Remove also acts as Abort/Cancel for live file transfers (UI).
        acts.push("remove");
        return acts;
    }
    acts.push("remove");
    return acts;
}

/** True when History still holds a payload that can be re-fanned to peers. */
export function canShareAgain(entry: TransferHistoryEntry): boolean {
    if (!entry) return false;
    if (entry.kind === "clipboard-image") {
        return (
            Boolean(entry.localFilePath) ||
            isHistoryImageDataUrl(entry.thumbDataUrl)
        );
    }
    if (entry.kind === "clipboard-text") {
        const t = String(entry.retainedText || entry.textPreview || "").trim();
        return t.length > 0;
    }
    return false;
}

/** Max chars retained for History re-Accept (localStorage / control snapshot). */
export const TRANSFER_HISTORY_RETAINED_TEXT_MAX = 64_000;

export function clipRetainedText(text: string | undefined | null): string | undefined {
    if (text == null) return undefined;
    const s = String(text);
    if (!s) return undefined;
    return s.length > TRANSFER_HISTORY_RETAINED_TEXT_MAX
        ? s.slice(0, TRANSFER_HISTORY_RETAINED_TEXT_MAX)
        : s;
}

function looksLikeHttpUrl(s: string): boolean {
    const t = (s || "").trim();
    if (!t) return false;
    // WHY: shop Shares often are "Title\\nhttps://…" — Open must still appear.
    if (/https?:\/\//i.test(t) || /^www\./i.test(t)) return true;
    return false;
}

/** Human byte size for History image/file subtitles (e.g. `1.2 MB`). */
export function formatTransferBytes(bytes: number | undefined | null): string {
    if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "";
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** True when a History thumb looks like an inline image data URL. */
export function isHistoryImageDataUrl(value: string | undefined | null): boolean {
    if (value == null) return false;
    const s = String(value).trim();
    return /^data:image\/[a-z0-9.+-]+;base64,/i.test(s);
}

/** Human speed for History / toast (e.g. `12.4 MB/s`). */
export function formatTransferSpeed(speedBps: number | undefined | null): string {
    if (speedBps == null || !Number.isFinite(speedBps) || speedBps <= 0) return "—";
    const units = ["B/s", "KB/s", "MB/s", "GB/s"];
    let v = speedBps;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    const digits = v >= 100 || i === 0 ? 0 : v >= 10 ? 1 : 2;
    return `${v.toFixed(digits)} ${units[i]}`;
}

/** Progress fraction 0..1 for UI bars. */
export function transferProgressRatio(entry: TransferHistoryEntry): number {
    const total = entry.totalBytes ?? 0;
    const done = entry.bytesDone ?? 0;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, done / total));
}

export function isMutedHistoryStatus(
    status: TransferHistoryStatus,
    kind?: TransferHistoryKind
): boolean {
    // WHY: inbound clipboard is a durable archive — never mute as expired.
    if (kind === "clipboard-text" || kind === "clipboard-image") {
        return status === "declined" || status === "error";
    }
    return status === "expired" || status === "declined" || status === "error";
}

function entryRecency(e: TransferHistoryEntry): number {
    return Math.max(e.lastActionAt ?? 0, e.ts ?? 0);
}

function gcNewest(entries: TransferHistoryEntry[], max: number): TransferHistoryEntry[] {
    if (entries.length <= max) return entries;
    // Newest first by last action (or first-seen), keep max.
    const sorted = [...entries].sort((a, b) => entryRecency(b) - entryRecency(a));
    return sorted.slice(0, max);
}

/**
 * Merge patch into an existing row. Keeps stable id + first-seen `ts`.
 * Sets `lastActionAt` when reaching done or when the patch carries it.
 */
/**
 * Stable fingerprint for clipboard History merge (same paste → one row).
 * Prefer explicit contentKey, then retained body, preview, or image size tag.
 */
export function clipboardContentKey(entry: Partial<TransferHistoryEntry>): string {
    const explicit = String(entry.contentKey || "").trim();
    if (explicit && explicit !== "0" && !explicit.startsWith("img-clip-in-")) {
        return explicit;
    }
    const body = String(entry.retainedText || entry.textPreview || "").trim();
    if (body) {
        return body.length > 240 ? body.slice(0, 240) : body;
    }
    if (entry.kind === "clipboard-image") {
        const bytes = entry.totalBytes;
        if (typeof bytes === "number" && bytes > 0) {
            return `img-bytes-${bytes}`;
        }
    }
    return explicit;
}

function clipboardBodyFingerprint(entry: Partial<TransferHistoryEntry>): string {
    return String(entry.retainedText || entry.textPreview || entry.contentKey || "")
        .trim()
        .slice(0, 240);
}

export function mergeTransferHistoryEntry(
    prev: TransferHistoryEntry,
    next: TransferHistoryEntry
): TransferHistoryEntry {
    const now = Number.isFinite(next.ts) ? next.ts : Date.now();
    const becameDone = next.status === "done" && prev.status !== "done";
    const patchActionAt =
        typeof next.lastActionAt === "number" && Number.isFinite(next.lastActionAt)
            ? next.lastActionAt
            : undefined;
    let lastActionAt = prev.lastActionAt;
    if (patchActionAt != null) {
        lastActionAt = Math.max(prev.lastActionAt ?? 0, patchActionAt);
    } else if (becameDone || next.status === "done") {
        lastActionAt = Math.max(prev.lastActionAt ?? 0, now);
    } else if (next.status === "actionable" || next.status === "pending") {
        // WHY: same content re-asked → bump recency so the row stays on top.
        lastActionAt = Math.max(prev.lastActionAt ?? 0, now);
    }

    // Prefer non-empty retained fields from either side (status-only patches
    // must not wipe preview / retainedText / transferId).
    const pickStr = (a?: string, b?: string): string | undefined => {
        const x = a != null && String(a).length ? a : undefined;
        const y = b != null && String(b).length ? b : undefined;
        return x ?? y;
    };

    // WHY: same paste asked again must reopen Accept/Open/Download (not stay done).
    let status = next.status ?? prev.status;
    if (
        (next.kind === "clipboard-text" || next.kind === "clipboard-image") &&
        (next.status === "actionable" || next.status === "pending") &&
        (prev.status === "done" || prev.status === "expired" || prev.status === "actionable")
    ) {
        status = next.status;
    }

    const contentKey =
        clipboardContentKey({ ...prev, ...next }) ||
        pickStr(next.contentKey, prev.contentKey);

    return {
        ...prev,
        ...next,
        id: prev.id,
        ts: prev.ts,
        status,
        lastActionAt,
        retainedText: pickStr(next.retainedText, prev.retainedText),
        textPreview: pickStr(next.textPreview, prev.textPreview),
        contentKey,
        transferId: pickStr(next.transferId, prev.transferId),
        thumbDataUrl: pickStr(next.thumbDataUrl, prev.thumbDataUrl),
        localFilePath: pickStr(next.localFilePath, prev.localFilePath),
        subtitle: pickStr(next.subtitle, prev.subtitle),
        peerId: pickStr(next.peerId, prev.peerId),
        title: pickStr(next.title, prev.title) || prev.title,
        // Keep progress bytes unless the patch explicitly zeros them on done.
        bytesDone: next.bytesDone ?? prev.bytesDone,
        totalBytes: next.totalBytes ?? prev.totalBytes,
        speedBps: next.status === "done" ? undefined : (next.speedBps ?? prev.speedBps),
        etaMs: next.status === "done" ? null : (next.etaMs !== undefined ? next.etaMs : prev.etaMs),
        fileNames: next.fileNames?.length ? next.fileNames : prev.fileNames,
        error: next.status === "error" ? next.error ?? prev.error : next.error
    };
}

/**
 * Create an in-memory transfer history ring store.
 * INVARIANT: list length never exceeds `max` after any mutating call.
 */
export function createTransferHistoryStore(
    options: CreateTransferHistoryStoreOptions = {}
): TransferHistoryStore {
    const max = options.max ?? TRANSFER_HISTORY_MAX;
    const clipDedupeMs = options.clipDedupeMs ?? TRANSFER_HISTORY_CLIP_DEDUPE_MS;
    let entries: TransferHistoryEntry[] = gcNewest(
        (options.initial || []).map(cloneEntry),
        max
    );
    const listeners = new Set<(entries: TransferHistoryEntry[]) => void>();
    /** Nested batch depth; notify only when depth returns to 0. */
    let suppressNotify = 0;
    let notifyPending = false;

    function notify(): void {
        if (suppressNotify > 0) {
            notifyPending = true;
            return;
        }
        notifyPending = false;
        const snap = entries.map(cloneEntry);
        for (const l of listeners) {
            try {
                l(snap);
            } catch {
                /* listener errors must not break the store */
            }
        }
    }

    function findIndex(idOrTransferId: string): number {
        const key = String(idOrTransferId || "");
        if (!key) return -1;
        return entries.findIndex(
            (e) => e.id === key || (e.transferId != null && e.transferId === key)
        );
    }

    function applyGc(): void {
        entries = gcNewest(entries, max);
    }

    return {
        push(entry: TransferHistoryEntry): TransferHistoryEntry {
            const next = cloneEntry(entry);
            if (!next.id) {
                next.id =
                    next.transferId ||
                    `th-${next.ts || Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            }
            if (!Number.isFinite(next.ts)) next.ts = Date.now();

            // WHY: normalize contentKey so Cap clip-in-<ts> + Neu prompt UUID still merge.
            if (
                next.kind === "clipboard-text" ||
                next.kind === "clipboard-image"
            ) {
                const key = clipboardContentKey(next);
                if (key) next.contentKey = key;
            }

            // 1) Same id → in-place (done/failed must not spawn a second row).
            let idx = findIndex(next.id);
            // 2) Same files transferId → in-place (progress → done).
            if (idx < 0 && next.transferId) {
                idx = entries.findIndex((e) => e.transferId === next.transferId);
            }
            // 3) Same clipboard contentKey + direction + kind → in-place (whole ring).
            // WHY: Accept/done/share echoes must update lastActionAt, not clone.
            if (
                idx < 0 &&
                next.contentKey &&
                (next.kind === "clipboard-text" || next.kind === "clipboard-image")
            ) {
                const nextKey = clipboardContentKey(next);
                idx = entries.findIndex(
                    (e) =>
                        (e.kind === "clipboard-text" || e.kind === "clipboard-image") &&
                        e.direction === next.direction &&
                        e.kind === next.kind &&
                        clipboardContentKey(e) === nextKey
                );
                // 4) Recent same body (title/URL/paste) when keys briefly mismatched.
                if (idx < 0) {
                    const body = clipboardBodyFingerprint(next);
                    const windowMs = Math.max(
                        clipDedupeMs,
                        TRANSFER_HISTORY_CLIP_RECENT_COLLAPSE_MS
                    );
                    if (body) {
                        idx = entries.findIndex(
                            (e) =>
                                (e.kind === "clipboard-text" ||
                                    e.kind === "clipboard-image") &&
                                e.direction === next.direction &&
                                e.kind === next.kind &&
                                clipboardBodyFingerprint(e) === body &&
                                Math.abs(entryRecency(e) - next.ts) <= windowMs
                        );
                    }
                }
            }

            // WHY: Cap Accept "done" may carry asset hash while Ask used
            // img-bytes-<n> — still fold onto the newest inbound image card.
            if (
                idx < 0 &&
                next.kind === "clipboard-image" &&
                (next.status === "done" || next.status === "declined") &&
                !isHistoryImageDataUrl(next.thumbDataUrl) &&
                !String(next.localFilePath || "").trim()
            ) {
                const windowMs = Math.max(
                    clipDedupeMs,
                    TRANSFER_HISTORY_CLIP_RECENT_COLLAPSE_MS
                );
                idx = entries.findIndex(
                    (e) =>
                        e.kind === "clipboard-image" &&
                        e.direction === next.direction &&
                        (isHistoryImageDataUrl(e.thumbDataUrl) ||
                            Boolean(e.localFilePath)) &&
                        Math.abs(entryRecency(e) - next.ts) <= windowMs
                );
            }

            if (idx >= 0) {
                entries[idx] = mergeTransferHistoryEntry(entries[idx]!, next);
                // Bump row to front for recency without changing first-seen ts.
                const merged = entries[idx]!;
                entries = [merged, ...entries.filter((_, i) => i !== idx)];
                applyGc();
                notify();
                return cloneEntry(merged);
            }

            // WHY: status-only image patches without a merge target must not
            // spawn a second card with a broken preview.
            if (
                next.kind === "clipboard-image" &&
                (next.status === "done" || next.status === "declined") &&
                !isHistoryImageDataUrl(next.thumbDataUrl) &&
                !String(next.localFilePath || "").trim()
            ) {
                return next;
            }

            entries = [next, ...entries];
            applyGc();
            notify();
            return cloneEntry(next);
        },

        upsert(entry: TransferHistoryEntry): TransferHistoryEntry {
            return this.push(entry);
        },

        updateProgress(input): TransferHistoryEntry | undefined {
            const tid = String(input.transferId || "");
            if (!tid) return undefined;
            let idx = findIndex(tid);
            const now = input.ts ?? Date.now();
            if (idx < 0) {
                // Auto-create a progress stub so late UI mounts still see the bar.
                const stub: TransferHistoryEntry = {
                    id: tid,
                    ts: now,
                    kind: "files",
                    direction: "in",
                    status: "progress",
                    title: "File transfer",
                    transferId: tid,
                    bytesDone: input.bytesDone,
                    totalBytes: input.totalBytes,
                    speedBps: input.speedBps,
                    etaMs: input.etaMs ?? null
                };
                entries = [stub, ...entries];
                applyGc();
                notify();
                return cloneEntry(stub);
            }
            const prev = entries[idx]!;
            const complete =
                input.totalBytes > 0 && input.bytesDone >= input.totalBytes;
            const status: TransferHistoryStatus =
                prev.status === "expired" || prev.status === "declined"
                    ? prev.status
                    : complete
                      ? "done"
                      : prev.status === "done"
                        ? "done"
                        : "progress";
            entries[idx] = mergeTransferHistoryEntry(prev, {
                ...prev,
                status,
                bytesDone: input.bytesDone,
                totalBytes: input.totalBytes,
                speedBps: input.speedBps ?? prev.speedBps,
                etaMs: complete ? null : (input.etaMs !== undefined ? input.etaMs : prev.etaMs),
                ts: now,
                lastActionAt: complete ? now : prev.lastActionAt
            });
            const merged = entries[idx]!;
            entries = [merged, ...entries.filter((_, i) => i !== idx)];
            applyGc();
            notify();
            return cloneEntry(merged);
        },

        mark(idOrTransferId, status, patch): TransferHistoryEntry | undefined {
            const idx = findIndex(idOrTransferId);
            if (idx < 0) return undefined;
            const prev = entries[idx]!;
            const now = patch?.ts ?? Date.now();
            entries[idx] = mergeTransferHistoryEntry(prev, {
                ...prev,
                ...(patch || {}),
                status,
                ts: now,
                lastActionAt:
                    status === "done"
                        ? (patch?.lastActionAt ?? now)
                        : patch?.lastActionAt ?? prev.lastActionAt
            });
            const merged = entries[idx]!;
            entries = [merged, ...entries.filter((_, i) => i !== idx)];
            applyGc();
            notify();
            return cloneEntry(merged);
        },

        list(): TransferHistoryEntry[] {
            return entries.map(cloneEntry);
        },

        get(id: string): TransferHistoryEntry | undefined {
            const idx = findIndex(id);
            return idx >= 0 ? cloneEntry(entries[idx]!) : undefined;
        },

        remove(idOrTransferId: string): boolean {
            const idx = findIndex(idOrTransferId);
            if (idx < 0) return false;
            entries = entries.filter((_, i) => i !== idx);
            notify();
            return true;
        },

        clear(): void {
            entries = [];
            notify();
        },

        batch(fn: () => void): void {
            suppressNotify += 1;
            try {
                fn();
            } finally {
                suppressNotify -= 1;
                if (suppressNotify <= 0) {
                    suppressNotify = 0;
                    if (notifyPending) notify();
                }
            }
        },

        subscribe(listener): () => void {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        }
    };
}

/** Serialize for localStorage / control JSON (stable key order not required). */
export function serializeTransferHistory(entries: TransferHistoryEntry[]): string {
    return JSON.stringify({ v: 1, entries: entries.map(cloneEntry) });
}

export function parseTransferHistory(raw: string | null | undefined): TransferHistoryEntry[] {
    if (!raw || typeof raw !== "string") return [];
    try {
        const parsed = JSON.parse(raw) as { v?: number; entries?: unknown };
        if (!parsed || !Array.isArray(parsed.entries)) return [];
        const out: TransferHistoryEntry[] = [];
        for (const item of parsed.entries) {
            if (!item || typeof item !== "object") continue;
            const e = item as Partial<TransferHistoryEntry>;
            if (typeof e.id !== "string" || typeof e.ts !== "number") continue;
            if (typeof e.kind !== "string" || typeof e.direction !== "string") continue;
            if (typeof e.status !== "string" || typeof e.title !== "string") continue;
            out.push(cloneEntry(e as TransferHistoryEntry));
        }
        return gcNewest(out, TRANSFER_HISTORY_MAX);
    } catch {
        return [];
    }
}
