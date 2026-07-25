/*
 * Filename: TransferHistoryEmit.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/TransferHistoryEmit.java
 * Change date and time: 22.20.00_25.07.2026
 * Reason for changes: Cap → WebView Transfer History bridge events (plan 1C/2A).
 *   Native toasts stay; History is the durable second channel via cws:transferHistory.
 *   2026-07-25e: clipboard-image emits thumbDataUrl + size for History cards.
 *   2026-07-25g: outbound image contentKey prefers asset hash (not "out-image").
 *   2026-07-25j: inbound same-content → stable id/contentKey so History collapses.
 *   2026-07-25k: skip sparse image "done" emits (no thumb/key) — they spawned
 *   a broken-preview duplicate after Accept.
 *   2026-07-25n: localFilePath for full-res image (thumb is preview-only).
 */

package space.u2re.cwsp;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

/**
 * Builds TransferHistoryEntry-shaped JSON and pushes it into the WebView store.
 * WHY: notifications fire while WebView may be backgrounded — emit on every
 * native prompt/progress so History catches up when the shell resumes.
 */
public final class TransferHistoryEmit {
    private static final String TAG = "TransferHistoryEmit";

    private TransferHistoryEmit() {}

    /** Cap History re-Accept body cap (matches cwsp-shared TRANSFER_HISTORY_RETAINED_TEXT_MAX). */
    private static final int RETAINED_TEXT_MAX = 64_000;

    public static void clipboardInboundAsk(
            String id,
            String textPreview,
            boolean hasImage,
            String peerId,
            long expiresAtMs
    ) {
        clipboardInboundAsk(id, textPreview, hasImage, peerId, expiresAtMs, null, 0L, null);
    }

    /**
     * @param thumbDataUrl optional {@code data:image/…;base64,…} preview for History UI
     * @param totalBytes   asset size when known (image subtitle)
     * @param contentKey   stable merge key (prefer asset hash)
     */
    public static void clipboardInboundAsk(
            String id,
            String textPreview,
            boolean hasImage,
            String peerId,
            long expiresAtMs,
            String thumbDataUrl,
            long totalBytes,
            String contentKey
    ) {
        clipboardInboundAsk(
                id, textPreview, hasImage, peerId, expiresAtMs,
                thumbDataUrl, totalBytes, contentKey, null
        );
    }

    /**
     * @param localFilePath absolute path to full-res retained image (not the JPEG thumb)
     */
    public static void clipboardInboundAsk(
            String id,
            String textPreview,
            boolean hasImage,
            String peerId,
            long expiresAtMs,
            String thumbDataUrl,
            long totalBytes,
            String contentKey,
            String localFilePath
    ) {
        try {
            String key = contentKey;
            if (key == null || key.isEmpty()) {
                if (textPreview != null && !textPreview.isEmpty()) {
                    key = textPreview.length() > 240
                            ? textPreview.substring(0, 240) : textPreview;
                } else if (hasImage && totalBytes > 0) {
                    // WHY: same image re-ask without hash must still collapse.
                    key = "img-bytes-" + totalBytes;
                } else if (hasImage) {
                    key = "img-" + (id != null ? id : System.currentTimeMillis());
                }
            }
            // WHY: stable id from contentKey — packet timestamps must not spawn
            // a second History row for the same Accept body.
            String stableId = id;
            if (key != null && !key.isEmpty()) {
                stableId = "clip-in-" + Integer.toHexString(key.hashCode());
            } else if (stableId == null || stableId.isEmpty()) {
                stableId = "clip-in-" + System.currentTimeMillis();
            }
            JSONObject e = base(
                    stableId,
                    hasImage ? "clipboard-image" : "clipboard-text",
                    "in",
                    "actionable",
                    hasImage ? "Incoming image" : "Incoming clipboard"
            );
            if (!hasImage && textPreview != null && !textPreview.isEmpty()) {
                e.put("textPreview", textPreview.length() > 240
                        ? textPreview.substring(0, 240) : textPreview);
                // WHY: keep full body for History Accept after toast TTL clears the hold.
                e.put("retainedText", textPreview.length() > RETAINED_TEXT_MAX
                        ? textPreview.substring(0, RETAINED_TEXT_MAX) : textPreview);
            }
            if (key != null && !key.isEmpty()) e.put("contentKey", key);
            if (peerId != null && !peerId.isEmpty()) {
                e.put("peerId", peerId);
            }
            if (hasImage) {
                StringBuilder sub = new StringBuilder();
                if (peerId != null && !peerId.isEmpty()) {
                    sub.append("from ").append(peerId);
                }
                if (totalBytes > 0) {
                    if (sub.length() > 0) sub.append(" · ");
                    sub.append(formatBytes(totalBytes));
                }
                if (sub.length() > 0) e.put("subtitle", sub.toString());
                if (totalBytes > 0) e.put("totalBytes", totalBytes);
                if (thumbDataUrl != null && thumbDataUrl.startsWith("data:image/")) {
                    e.put("thumbDataUrl", thumbDataUrl);
                }
                // WHY: Open/Accept/Save must use full bytes — thumbDataUrl is 320px JPEG only.
                if (localFilePath != null && !localFilePath.isEmpty()) {
                    e.put("localFilePath", localFilePath);
                }
            } else if (peerId != null && !peerId.isEmpty()) {
                e.put("subtitle", "from " + peerId);
            }
            // expiresAt is toast metadata only — clipboard History stays actionable.
            if (expiresAtMs > 0) e.put("expiresAt", expiresAtMs);
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "clipboardInboundAsk failed", ex);
        }
    }

    private static String formatBytes(long n) {
        if (n < 1024) return n + " B";
        if (n < 1024 * 1024) return String.format(java.util.Locale.US, "%.1f KB", n / 1024.0);
        if (n < 1024L * 1024 * 1024) {
            return String.format(java.util.Locale.US, "%.1f MB", n / (1024.0 * 1024.0));
        }
        return String.format(java.util.Locale.US, "%.2f GB", n / (1024.0 * 1024.0 * 1024.0));
    }

    public static void clipboardInboundDone(String id, boolean hasImage, String status) {
        clipboardInboundDone(id, hasImage, status, null);
    }

    public static void clipboardInboundDone(
            String id,
            boolean hasImage,
            String status,
            String contentKey
    ) {
        try {
            // WHY: never emit clipboard "expired" — History keeps Accept/Open/Download.
            // Merge onto existing row (same contentKey/id) — do not spawn a second row.
            String st = status != null ? status : "done";
            if ("expired".equals(st)) st = "actionable";
            String key = contentKey != null ? contentKey.trim() : "";
            // WHY (2026-07-25k): image Ask already logged a full card with thumb.
            // A done/declined emit without contentKey used clip-in-<packetTs> and
            // created a second row with broken preview. Skip — mark via merge only
            // when we have the same stable key as the Ask row.
            if (hasImage && key.isEmpty()) {
                Log.d(TAG, "clipboardInboundDone skip sparse image status=" + st);
                return;
            }
            String stableId = !key.isEmpty()
                    ? ("clip-in-" + Integer.toHexString(key.hashCode()))
                    : (id != null && !id.isEmpty()
                            ? id
                            : ("clip-in-" + System.currentTimeMillis()));
            JSONObject e = base(
                    stableId,
                    hasImage ? "clipboard-image" : "clipboard-text",
                    "in",
                    st,
                    hasImage ? "Incoming image" : "Incoming clipboard"
            );
            if (!key.isEmpty()) e.put("contentKey", key);
            if ("done".equals(st)) {
                e.put("lastActionAt", System.currentTimeMillis());
            }
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "clipboardInboundDone failed", ex);
        }
    }

    public static void clipboardOutboundSent(String textPreview, boolean hasImage) {
        clipboardOutboundSent(textPreview, hasImage, null, 0L, null);
    }

    public static void clipboardOutboundSent(
            String textPreview,
            boolean hasImage,
            String thumbDataUrl,
            long totalBytes
    ) {
        clipboardOutboundSent(textPreview, hasImage, thumbDataUrl, totalBytes, null);
    }

    /**
     * @param contentKeyPrefer asset hash / stable key so distinct outbound images
     *                         do not collapse onto one History row
     */
    public static void clipboardOutboundSent(
            String textPreview,
            boolean hasImage,
            String thumbDataUrl,
            long totalBytes,
            String contentKeyPrefer
    ) {
        clipboardOutboundSent(
                textPreview, hasImage, thumbDataUrl, totalBytes, contentKeyPrefer, null
        );
    }

    public static void clipboardOutboundSent(
            String textPreview,
            boolean hasImage,
            String thumbDataUrl,
            long totalBytes,
            String contentKeyPrefer,
            String localFilePath
    ) {
        try {
            String preview = textPreview != null ? textPreview : "";
            // WHY: stable contentKey so Share + watch-loop echoes merge one History row.
            String contentKey = contentKeyPrefer != null && !contentKeyPrefer.isEmpty()
                    ? contentKeyPrefer
                    : (!preview.isEmpty()
                            ? (preview.length() > 120 ? preview.substring(0, 120) : preview)
                            : (hasImage
                                    ? ("out-image-" + System.currentTimeMillis())
                                    : "out-empty"));
            String id = "clip-out-" + Integer.toHexString(contentKey.hashCode());
            JSONObject e = base(
                    id,
                    hasImage ? "clipboard-image" : "clipboard-text",
                    "out",
                    "done",
                    hasImage ? "Outgoing image" : "Outgoing clipboard"
            );
            e.put("lastActionAt", System.currentTimeMillis());
            e.put("contentKey", contentKey);
            if (!hasImage && !preview.isEmpty()) {
                e.put("textPreview", preview.length() > 240
                        ? preview.substring(0, 240) : preview);
            }
            if (hasImage) {
                if (totalBytes > 0) {
                    e.put("totalBytes", totalBytes);
                    e.put("subtitle", formatBytes(totalBytes));
                }
                if (thumbDataUrl != null && thumbDataUrl.startsWith("data:image/")) {
                    e.put("thumbDataUrl", thumbDataUrl);
                }
                if (localFilePath != null && !localFilePath.isEmpty()) {
                    e.put("localFilePath", localFilePath);
                }
            }
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "clipboardOutboundSent failed", ex);
        }
    }

    public static void filesOffer(
            String transferId,
            String sender,
            int fileCount,
            long totalBytes,
            boolean error
    ) {
        try {
            String tid = transferId != null ? transferId : ("files-" + System.currentTimeMillis());
            JSONObject e = base(
                    tid,
                    "files",
                    "in",
                    error ? "error" : "actionable",
                    error ? "Files transfer failed" : ("Files from " + (sender != null && !sender.isEmpty() ? sender : "peer"))
            );
            e.put("transferId", tid);
            e.put("totalBytes", Math.max(0L, totalBytes));
            e.put("subtitle", fileCount + " file(s)");
            if (sender != null && !sender.isEmpty()) e.put("peerId", sender);
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "filesOffer failed", ex);
        }
    }

    public static void filesProgress(
            String transferId,
            String direction,
            long bytesDone,
            long totalBytes,
            long speedBps,
            Long etaMs,
            boolean complete
    ) {
        try {
            String tid = transferId != null ? transferId : "";
            if (tid.isEmpty()) return;
            String dir = "out".equals(direction) ? "out" : "in";
            JSONObject e = base(
                    tid,
                    "files",
                    dir,
                    complete ? "done" : "progress",
                    complete ? "Files transfer complete" : "Transferring files"
            );
            e.put("transferId", tid);
            e.put("bytesDone", Math.max(0L, bytesDone));
            e.put("totalBytes", Math.max(0L, totalBytes));
            if (speedBps > 0) e.put("speedBps", speedBps);
            if (etaMs != null) e.put("etaMs", etaMs.longValue());
            if (complete) e.put("lastActionAt", System.currentTimeMillis());
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "filesProgress failed", ex);
        }
    }

    public static void filesStatus(String transferId, String direction, String status, String title) {
        filesStatus(transferId, direction, status, title, 0, null, null);
    }

    /**
     * @param fileCount     when &gt; 0, sets subtitle / singleton Open affordance
     * @param localFilePath absolute path of a singleton landed file (Open)
     * @param displayName   basename for fileNames[0] when singleton
     */
    public static void filesStatus(
            String transferId,
            String direction,
            String status,
            String title,
            int fileCount,
            String localFilePath,
            String displayName
    ) {
        try {
            String tid = transferId != null ? transferId : "";
            if (tid.isEmpty()) return;
            // WHY: same transferId as progress/offer — in-place done, not a new row.
            String st = status != null ? status : "done";
            JSONObject e = base(
                    tid,
                    "files",
                    "out".equals(direction) ? "out" : "in",
                    st,
                    title != null ? title : "Files"
            );
            e.put("transferId", tid);
            if ("done".equals(st) || "error".equals(st)) {
                e.put("lastActionAt", System.currentTimeMillis());
            }
            if (fileCount > 0) {
                e.put("subtitle", fileCount + " file(s)");
            }
            // WHY: History Open for a singleton received file (notif parity).
            if (fileCount == 1 || (localFilePath != null && !localFilePath.isEmpty())) {
                if (localFilePath != null && !localFilePath.isEmpty()) {
                    e.put("localFilePath", localFilePath);
                }
                String name = displayName != null ? displayName.trim() : "";
                if (name.isEmpty() && localFilePath != null) {
                    int slash = Math.max(localFilePath.lastIndexOf('/'), localFilePath.lastIndexOf('\\'));
                    name = slash >= 0 ? localFilePath.substring(slash + 1) : localFilePath;
                }
                if (!name.isEmpty()) {
                    JSONArray arr = new JSONArray();
                    arr.put(name);
                    e.put("fileNames", arr);
                }
            }
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "filesStatus failed", ex);
        }
    }

    public static void filesOutgoingWaiting(String transferId, int fileCount, List<String> names) {
        try {
            String tid = transferId != null ? transferId : ("files-out-" + System.currentTimeMillis());
            JSONObject e = base(tid, "files", "out", "pending", "Waiting for peer Accept");
            e.put("transferId", tid);
            e.put("subtitle", fileCount + " file(s)");
            if (names != null && !names.isEmpty()) {
                JSONArray arr = new JSONArray();
                int n = Math.min(names.size(), 16);
                for (int i = 0; i < n; i++) arr.put(names.get(i));
                e.put("fileNames", arr);
            }
            CwsBridgePlugin.emitTransferHistory(e);
        } catch (Exception ex) {
            Log.w(TAG, "filesOutgoingWaiting failed", ex);
        }
    }

    private static JSONObject base(
            String id,
            String kind,
            String direction,
            String status,
            String title
    ) throws Exception {
        JSONObject e = new JSONObject();
        e.put("id", id);
        e.put("ts", System.currentTimeMillis());
        e.put("kind", kind);
        e.put("direction", direction);
        e.put("status", status);
        e.put("title", title);
        return e;
    }
}
