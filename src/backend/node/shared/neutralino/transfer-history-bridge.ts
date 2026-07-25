/*
 * Filename: transfer-history-bridge.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/transfer-history-bridge.ts
 * Change date and time: 22.40.00_25.07.2026
 * Reason for changes: Node-side Transfer History store for Neu control GET/POST
 *   + mappers from clipboard/files prompt states (progress merge).
 *   2026-07-25e: clipboard-image thumbs — resolve data URL from inline or
 *   imageThumbPath so History cards can render previews.
 *   2026-07-25f: copy toast PNGs into .data/transfer-history-assets so History
 *   Accept/Open File survive prompt TTL cleanup of .tmp/clipboard-prompt.
 */

import fs from "node:fs";
import path from "node:path";
import {
    clipRetainedText,
    createTransferHistoryStore,
    parseTransferHistory,
    serializeTransferHistory,
    type TransferHistoryEntry,
    type TransferHistoryStore
} from "@fest-lib/cwsp-shared/v2/transfer-history.ts";
import type { ClipboardPromptState } from "./clipboard-hub.ts";
import type { FilesPromptState } from "./files-hub.ts";
import type { FilesProgressPayload } from "@fest-lib/cwsp-shared/v2/files-types.ts";

const FILE_NAME = "transfer-history-v1.json";
const ASSETS_DIR = "transfer-history-assets";

let store: TransferHistoryStore | null = null;
let persistPath: string | null = null;
let assetsRoot: string | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;

export function getNeuTransferHistoryStore(packageRoot?: string): TransferHistoryStore {
    if (store) return store;
    let initial: TransferHistoryEntry[] = [];
    if (packageRoot) {
        persistPath = path.join(packageRoot, ".data", FILE_NAME);
        assetsRoot = path.join(packageRoot, ".data", ASSETS_DIR);
        try {
            if (fs.existsSync(persistPath)) {
                initial = parseTransferHistory(fs.readFileSync(persistPath, "utf8"));
            }
        } catch {
            initial = [];
        }
    }
    store = createTransferHistoryStore({ initial });
    store.subscribe(() => schedulePersist());
    return store;
}

/**
 * Resolve a retained History image file by entry id / transferId / contentKey.
 * Used by GET /service/transfer-history/preview and Accept/Open File.
 */
export function resolveTransferHistoryMedia(
    packageRoot: string | undefined,
    idOrKey: string
): { filePath: string; mimeType: string } | null {
    const key = String(idOrKey || "").trim();
    if (!key) return null;
    const s = getNeuTransferHistoryStore(packageRoot);
    const entry =
        s.get(key) ||
        s.list().find(
            (e) =>
                e.id === key ||
                e.transferId === key ||
                e.contentKey === key ||
                (e.localFilePath && path.basename(e.localFilePath).startsWith(key))
        );
    const filePath = String(entry?.localFilePath || "").trim();
    if (!filePath || !fs.existsSync(filePath)) return null;
    try {
        if (!fs.statSync(filePath).isFile()) return null;
    } catch {
        return null;
    }
    const lower = filePath.toLowerCase();
    const mimeType = lower.endsWith(".jpg") || lower.endsWith(".jpeg")
        ? "image/jpeg"
        : lower.endsWith(".webp")
          ? "image/webp"
          : lower.endsWith(".gif")
            ? "image/gif"
            : "image/png";
    return { filePath, mimeType };
}

/**
 * Copy toast temp PNG into durable History assets dir.
 * WHY: cleanupPromptThumb deletes `.tmp/clipboard-prompt/<hash>.png` on dismiss.
 */
function retainDurableImage(
    packageRoot: string | undefined,
    state: ClipboardPromptState
): string | undefined {
    if (!packageRoot || !state.hasImage) return undefined;
    const src = String(state.imageThumbPath || "").trim();
    const hash = String(state.assetHash || "").trim().slice(0, 32);
    const dir = path.join(packageRoot, ".data", ASSETS_DIR);
    try {
        fs.mkdirSync(dir, { recursive: true });
        const base = hash || `img-${String(state.id || Date.now()).slice(0, 24)}`;
        const dest = path.join(dir, `${base}.png`);
        if (src && fs.existsSync(src)) {
            if (path.resolve(src) !== path.resolve(dest)) {
                fs.copyFileSync(src, dest);
            }
            return dest;
        }
        // Fallback: materialize from inline data URL / bare base64.
        const inline = String(state.imageThumbDataUrl || "").trim();
        if (!inline) return fs.existsSync(dest) ? dest : undefined;
        const bare = inline
            .replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "")
            .replace(/\s/g, "");
        if (!bare) return fs.existsSync(dest) ? dest : undefined;
        fs.writeFileSync(dest, Buffer.from(bare, "base64"));
        return dest;
    } catch {
        return undefined;
    }
}

function schedulePersist(): void {
    if (!persistPath || !store) return;
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
        try {
            fs.mkdirSync(path.dirname(persistPath!), { recursive: true });
            fs.writeFileSync(persistPath!, serializeTransferHistory(store!.list()), "utf8");
        } catch {
            /* disk full / locked */
        }
    }, 400);
}

/** Max inline History thumb (~base64) so localStorage / control JSON stay light. */
const HISTORY_THUMB_MAX_BYTES = 96_000;

/**
 * Resolve a History-safe image data URL from prompt state.
 * WHY: large assets only leave `imageThumbPath` for WinForms — History WebView
 * needs a data URL (or a deliberate empty thumb + placeholder UI).
 */
function resolveClipboardThumb(state: ClipboardPromptState): string | undefined {
    const inline = String(state.imageThumbDataUrl || "").trim();
    if (inline.startsWith("data:image/")) {
        return inline.length <= HISTORY_THUMB_MAX_BYTES * 1.4 ? inline : undefined;
    }
    if (inline && !inline.includes("://") && inline.length > 32) {
        // Bare base64 from hub — wrap as PNG data URL when small enough.
        const bare = inline.replace(/\s/g, "");
        if (bare.length > 0 && bare.length <= HISTORY_THUMB_MAX_BYTES) {
            return `data:image/png;base64,${bare}`;
        }
    }
    const filePath = String(state.imageThumbPath || "").trim();
    if (!filePath) return undefined;
    try {
        if (!fs.existsSync(filePath)) return undefined;
        const st = fs.statSync(filePath);
        if (!st.isFile() || st.size <= 0 || st.size > HISTORY_THUMB_MAX_BYTES) {
            return undefined;
        }
        const buf = fs.readFileSync(filePath);
        const mime =
            filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg")
                ? "image/jpeg"
                : filePath.toLowerCase().endsWith(".webp")
                  ? "image/webp"
                  : "image/png";
        return `data:${mime};base64,${buf.toString("base64")}`;
    } catch {
        return undefined;
    }
}

function formatImageSubtitle(state: ClipboardPromptState, inbound: boolean): string | undefined {
    const parts: string[] = [];
    if (state.sender) parts.push(inbound ? `from ${state.sender}` : `to peers`);
    const mime = String(state.assetMimeType || "").replace(/^image\//i, "").toUpperCase();
    if (mime) parts.push(mime);
    if (state.assetSize > 0) {
        const n = state.assetSize;
        const size =
            n < 1024
                ? `${n} B`
                : n < 1024 * 1024
                  ? `${(n / 1024).toFixed(1)} KB`
                  : `${(n / (1024 * 1024)).toFixed(1)} MB`;
        parts.push(size);
    }
    return parts.length ? parts.join(" · ") : undefined;
}

export function mapClipboardPromptToHistory(
    state: ClipboardPromptState
): TransferHistoryEntry {
    const inbound = state.kind === "inbound";
    const isImage = Boolean(state.hasImage);
    let status: TransferHistoryEntry["status"] = "actionable";
    // WHY: auto mode already applied — keep Undo/Erase as actionable briefly.
    if (state.mode === "auto") {
        status = state.showUndo || state.showErase ? "actionable" : "done";
    }
    // WHY (2026-07-25): clipboard already on-device — do NOT mark expired when
    // toast TTL elapses; History keeps Accept/Open/Download available.
    // contentKey merge collapses Accept/done onto the same row + lastActionAt.
    const now = Date.now();
    // WHY: prefer full text / asset hash — textLength alone collapses unrelated pastes.
    const body = String(state.text || state.textPreview || "").trim();
    const contentKey =
        String(state.assetHash || "").trim() ||
        (body ? (body.length > 240 ? body.slice(0, 240) : body) : "") ||
        (isImage && state.assetSize > 0 ? `img-bytes-${state.assetSize}` : "") ||
        undefined;
    const thumb = isImage ? resolveClipboardThumb(state) : undefined;
    // WHY: packageRoot comes from getNeuTransferHistoryStore persistPath parent.
    const packageRoot = persistPath ? path.dirname(path.dirname(persistPath)) : undefined;
    const localFilePath = isImage ? retainDurableImage(packageRoot, state) : undefined;
    // WHY: stable History id so two Accept toasts for the same paste = one row.
    const stableId = contentKey
        ? `clip-${inbound ? "in" : "out"}-${simpleHash(contentKey)}`
        : state.id;
    return {
        id: stableId,
        ts: now,
        kind: isImage ? "clipboard-image" : "clipboard-text",
        direction: inbound ? "in" : "out",
        status,
        title: isImage
            ? inbound
                ? "Incoming image"
                : "Outgoing image"
            : inbound
              ? "Incoming clipboard"
              : "Outgoing clipboard",
        subtitle: isImage
            ? formatImageSubtitle(state, inbound)
            : state.sender
              ? `from ${state.sender}`
              : undefined,
        // WHY: image rows use the thumb/file card — skip binary-as-text previews.
        textPreview: isImage ? undefined : state.textPreview || undefined,
        retainedText: isImage
            ? undefined
            : clipRetainedText(state.text || state.textPreview),
        thumbDataUrl: thumb,
        localFilePath,
        // expiresAt is toast metadata only — does not mute clipboard History.
        expiresAt: state.expiresAt || undefined,
        peerId: state.sender || undefined,
        contentKey: contentKey || undefined,
        totalBytes: state.assetSize > 0 ? state.assetSize : undefined,
        lastActionAt: status === "done" ? now : undefined
    };
}

export function mapFilesPromptToHistory(
    state: FilesPromptState,
    progress?: FilesProgressPayload | null
): TransferHistoryEntry {
    let status: TransferHistoryEntry["status"] = "pending";
    let direction: TransferHistoryEntry["direction"] = "out";
    if (state.kind === "accept") {
        status = "actionable";
        direction = "in";
    } else if (state.kind === "progress") {
        status = "progress";
        direction = "in";
    } else if (state.kind === "ready") {
        status = "done";
        direction = "in";
    } else if (state.kind === "open-for-share" || state.kind === "need-destinations") {
        status = "actionable";
        direction = "out";
    }
    if (state.error) status = "error";

    const now = Date.now();
    // WHY: stable id = transferId so accept→progress→ready merges one row.
    const stableId = state.transferId || state.id;
    return {
        id: stableId,
        ts: now,
        kind: "files",
        direction,
        status,
        title:
            state.kind === "accept"
                ? `Files from ${state.sender || "peer"}`
                : state.kind === "ready"
                  ? "Files received"
                  : state.kind === "progress"
                    ? "Transferring files"
                    : `Files (${state.fileCount})`,
        subtitle: `${state.fileCount} file(s) · ${formatBytes(state.totalBytes)}`,
        transferId: state.transferId,
        bytesDone: progress?.bytesDone,
        totalBytes: progress?.totalBytes ?? state.totalBytes,
        speedBps: status === "done" ? undefined : progress?.speedBps,
        etaMs: status === "done" ? null : (progress?.etaMs ?? null),
        peerId: state.sender,
        error: state.error,
        fileNames: state.paths?.map((p) => path.basename(p)),
        // WHY: singleton ready → keep absolute path so History Open works after toast TTL.
        localFilePath:
            status === "done" &&
            Array.isArray(state.paths) &&
            state.paths.length === 1 &&
            String(state.paths[0] || "").trim()
                ? String(state.paths[0]).trim()
                : undefined,
        lastActionAt: status === "done" || status === "error" ? now : undefined
    };
}

function formatBytes(n: number): string {
    if (!Number.isFinite(n) || n < 0) return "0 B";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Short stable hex for History ids (not cryptographic). */
function simpleHash(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return (h >>> 0).toString(16);
}

export function upsertClipboardPromptHistory(
    packageRoot: string | undefined,
    state: ClipboardPromptState | null
): void {
    const s = getNeuTransferHistoryStore(packageRoot);
    if (!state) return;
    s.upsert(mapClipboardPromptToHistory(state));
}

export function upsertFilesPromptHistory(
    packageRoot: string | undefined,
    state: FilesPromptState | null,
    progress?: FilesProgressPayload | null
): void {
    const s = getNeuTransferHistoryStore(packageRoot);
    if (!state) return;
    s.upsert(mapFilesPromptToHistory(state, progress));
}

export function listTransferHistoryJson(packageRoot?: string): {
    ok: true;
    entries: TransferHistoryEntry[];
    replace: true;
} {
    const s = getNeuTransferHistoryStore(packageRoot);
    // WHY: when a durable PNG exists, omit large inline thumbs from control JSON
    // — History UI loads GET /service/transfer-history/preview?id=&key=.
    const entries = s.list().map((e) => {
        if (
            e.localFilePath &&
            e.thumbDataUrl &&
            e.thumbDataUrl.length > 8_000
        ) {
            const { thumbDataUrl: _drop, ...rest } = e;
            return rest as TransferHistoryEntry;
        }
        return e;
    });
    return { ok: true, entries, replace: true };
}
