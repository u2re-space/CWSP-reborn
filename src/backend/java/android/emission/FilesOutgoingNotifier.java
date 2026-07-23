/*
 * Filename: FilesOutgoingNotifier.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesOutgoingNotifier.java
 * Change date and time: 05.20.00_22.07.2026
 * Reason for changes: Pending-ingress persistence for ShareActivity (no WebView).
 *   2026-07-21 UX: notify() is a no-op — native Share/Open-with auto-offers via
 *   FilesOutboundOffer; the old "Open for Share" heads-up opened MainActivity
 *   and asked for a second confirm.
 *   2026-07-22: outgoing upload progress (upload icon + bar + speed) + Abort;
 *   Aborted summary when sender cancels unfinished peers.
 *   2026-07-22e: waiting used done==total (bar invisible + stuck ongoing);
 *   peer accept/done → status text; notifyComplete auto-dismisses.
 *   2026-07-22h: peer-download phase shows filled bar + speed (not indeterminate).
 *   2026-07-22l: notifyFailed for unstable WAN upload / mirror errors.
 *   2026-07-22n: per-peer download notifs (transferId+peerId) so multi-Accept
 *   shows independent bars; Abort may target one peer via EXTRA_PEER_ID.
 *   2026-07-22p: outgoing peer legs titled Sending (not Downloading) — sender POV.
 *   2026-07-22r: coalesce peer Sending notif updates on main (~2.5Hz) so OEM
 *   shade (Xiaomi/HyperOS) does not freeze the bar while bytes still move.
 *   2026-07-23t: flush immediately at ≥98% / complete — coalesce left the
 *   shade frozen at the last tick while Accept finished export/files:done.
 *   2026-07-23v: multi-dest Accept timeout shade ("Timeout → L-xxx").
 *
 *   Owns pending-ingress helpers:
 *     files/pending-ingress/<transferId>.json
 *     files/pending-ingress/latest.json
 */
package emission;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Outgoing Share/Open-with: upload progress notifications + pending-ingress
 * persistence. Legacy "Open for Share" heads-up stays suppressed.
 */
public final class FilesOutgoingNotifier {
    private static final String TAG = "emission.FilesOutgoingNotifier";
    public static final String CHANNEL_ID = "cwsp-files-outgoing-heads";
    public static final String NOTIF_ACTION_SHARE = "space.u2re.cwsp.FILES_OUTGOING_SHARE";
    public static final String NOTIF_ACTION_DISMISS = "space.u2re.cwsp.FILES_OUTGOING_DISMISS";
    public static final String NOTIF_ACTION_ABORT = "space.u2re.cwsp.FILES_OUTGOING_ABORT";
    public static final String EXTRA_TRANSFER_ID = "cwsp_files_transfer_id";
    /** Accepting peer clientId for per-leg Abort (empty = whole transfer). */
    public static final String EXTRA_PEER_ID = "cwsp_files_peer_id";
    public static final String EXTRA_FILES_INGRESS = "cwsp_files_ingress";
    /** Absolute path of a single landed file for "Open File" notification action. */
    public static final String EXTRA_FILE_PATH = "cwsp_files_file_path";
    /**
     * Final user-visible content Uri (Downloads MediaStore / SAF document /
     * CWSP Files DocumentsProvider) — preferred by Open File over app-private path.
     */
    public static final String EXTRA_CONTENT_URI = "cwsp_files_content_uri";

    private static final int NOTIFICATION_ID_BASE = 0xC570;
    public static final String PENDING_REL_DIR = "files/pending-ingress";
    /** OEM shade: spam notify() from HTTP threads freezes determinate bars. */
    private static final long PEER_UI_COALESCE_MS = 400L;
    private static final Handler MAIN = new Handler(Looper.getMainLooper());
    private static final ConcurrentHashMap<String, PeerProgressUi> PEER_UI =
            new ConcurrentHashMap<>();

    private static final class PeerProgressUi {
        volatile Context app;
        volatile String transferId = "";
        volatile String peerId = "";
        volatile String message = "Sending";
        volatile long bytesDone;
        volatile long totalBytes;
        volatile long speedBps;
        volatile Long etaMs;
        /** True while a delayed flush is queued on MAIN. */
        volatile boolean scheduled;
        final Runnable flush = () -> {
            scheduled = false;
            Context ctx = app;
            if (ctx == null) return;
            postPeerProgressNow(
                    ctx, transferId, peerId, message,
                    bytesDone, totalBytes, speedBps, etaMs);
        };
    }

    private FilesOutgoingNotifier() { /* no instances */ }

    public static void ensureChannel(Context context) {
        if (context == null) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID,
                "CWSP Files Outgoing",
                NotificationManager.IMPORTANCE_DEFAULT
        );
        ch.setDescription("Upload progress when sharing files to CWSP peers");
        nm.createNotificationChannel(ch);
    }

    /**
     * Formerly posted "Open for Share" and launched MainActivity on tap.
     * WHY (2026-07-21 UX): native Share/Open-with auto-offers via
     * {@link FilesOutboundOffer}; this heads-up opened the app and asked for a
     * second confirm. Kept as a no-op so old call sites do not reintroduce that UX.
     */
    public static void notify(Context context, String transferId, int fileCount) {
        Log.i(TAG, "outgoing Open-for-Share notify suppressed transferId=" + transferId
                + " count=" + fileCount + " (native auto-offer)");
    }

    /**
     * Byte-accurate outgoing upload progress (putBlob / gateway mirror).
     * Same bar/speed/ETA shape as incoming download; upload system icon.
     */
    public static void notifyProgressBytes(
            Context context,
            String transferId,
            String message,
            long bytesDone,
            long totalBytes,
            long speedBps,
            Long etaMs
    ) {
        notifyProgressBytes(context, transferId, "Uploading files", message,
                bytesDone, totalBytes, speedBps, etaMs);
    }

    /**
     * Outgoing progress with custom title (upload vs peer-download phase).
     * WHY: "Transfer in progress" must show a filled bar + MB/s, not indeterminate.
     */
    public static void notifyProgressBytes(
            Context context,
            String transferId,
            String title,
            String message,
            long bytesDone,
            long totalBytes,
            long speedBps,
            Long etaMs
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            boolean complete = totalBytes > 0 && bytesDone >= totalBytes;
            String safeTitle = (title != null && !title.isEmpty()) ? title : "Uploading files";
            StringBuilder body = new StringBuilder();
            if (message != null && !message.isEmpty()) body.append(message);
            if (totalBytes > 0) {
                if (body.length() > 0) body.append(" — ");
                body.append(FilesIncomingNotifier.formatByteSize(bytesDone))
                        .append(" / ")
                        .append(FilesIncomingNotifier.formatByteSize(totalBytes));
            } else if (bytesDone > 0) {
                if (body.length() > 0) body.append(" — ");
                body.append(FilesIncomingNotifier.formatByteSize(bytesDone));
            }
            if (speedBps > 0 && !complete) {
                body.append(" · ").append(FilesIncomingNotifier.formatByteSize(speedBps)).append("/s");
            }
            if (etaMs != null && etaMs >= 0 && !complete) {
                body.append(" · ").append(FilesIncomingNotifier.formatEta(etaMs));
            }
            int barMax;
            int barCur;
            if (totalBytes <= 0) {
                barMax = -1;
                barCur = 0;
            } else if (complete) {
                barMax = 1000;
                barCur = 1000;
            } else {
                barMax = 1000;
                barCur = (int) Math.max(0L, Math.min(999L, (bytesDone * 1000L) / totalBytes));
            }
            postProgressNotif(context, notifId, tid, null, safeTitle, body.toString(),
                    barCur, barMax, !complete);
        } catch (Throwable t) {
            Log.w(TAG, "notifyProgressBytes failed: " + t.getMessage());
        }
    }

    /**
     * Waiting for peer Accept after offer (still abortable).
     * WHY: must use indeterminate progress — done==total hides the bar on many OEMs
     * and left the notif stuck as "Uploading" forever.
     */
    public static void notifyWaiting(Context context, String transferId, int fileCount) {
        notifyWaiting(context, transferId, fileCount, 0, 0);
    }

    /**
     * Waiting for Accept after offer.
     * @param acceptedPeers peers that already Accepted (for multi-dest offers)
     * @param totalPeers    named destination count (0 = unknown / wildcard)
     */
    public static void notifyWaiting(
            Context context,
            String transferId,
            int fileCount,
            int acceptedPeers,
            int totalPeers
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            String body = (fileCount > 0 ? fileCount + " file" + (fileCount == 1 ? "" : "s") : "Files")
                    + " offered — waiting for Accept";
            if (totalPeers > 0) {
                body += " (" + Math.max(0, acceptedPeers) + "/" + totalPeers + " peers)";
            } else if (acceptedPeers > 0) {
                body += " (" + acceptedPeers + " peer"
                        + (acceptedPeers == 1 ? "" : "s") + " receiving)";
            }
            // total=-1 → indeterminate spinner (visible) + whole-transfer Abort
            postProgressNotif(context, notifId, tid, null, "Files offered", body, 0, -1, true);
        } catch (Throwable t) {
            Log.w(TAG, "notifyWaiting failed: " + t.getMessage());
        }
    }

    /**
     * COMPAT: single-notif accept (pre multi-peer). Prefer
     * {@link #notifyPeerDownloading}.
     */
    public static void notifyPeerAccepted(Context context, String transferId, int fileCount) {
        notifyPeerDownloading(context, transferId, "peer", fileCount);
    }

    /**
     * Per-peer outgoing notif after files:accept.
     * WHY: title is Sending (sender POV) — peer is downloading from us/gateway.
     */
    public static void notifyPeerDownloading(
            Context context,
            String transferId,
            String peerId,
            int fileCount
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
            int notifId = notificationIdForPeer(tid, peer);
            String body = (fileCount > 0 ? fileCount + " file" + (fileCount == 1 ? "" : "s") : "Files")
                    + " — sending…";
            postProgressNotif(context, notifId, tid, peer,
                    "Sending → " + shortPeerLabel(peer), body, 0, -1, true);
        } catch (Throwable t) {
            Log.w(TAG, "notifyPeerDownloading failed: " + t.getMessage());
        }
    }

    /** Byte progress for one Accepting peer leg (outgoing / send bar). */
    public static void notifyPeerProgressBytes(
            Context context,
            String transferId,
            String peerId,
            String message,
            long bytesDone,
            long totalBytes,
            long speedBps,
            Long etaMs
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
            boolean complete = totalBytes > 0 && bytesDone >= totalBytes;
            boolean nearComplete = totalBytes > 0
                    && !complete
                    && (bytesDone * 100L) >= (totalBytes * 98L);
            String key = tid + "\0" + peer;
            PeerProgressUi ui = PEER_UI.computeIfAbsent(key, k -> new PeerProgressUi());
            ui.app = context.getApplicationContext();
            ui.transferId = tid;
            ui.peerId = peer;
            ui.message = message != null ? message : "Sending";
            ui.bytesDone = bytesDone;
            ui.totalBytes = totalBytes;
            ui.speedBps = speedBps;
            ui.etaMs = etaMs;
            // WHY: complete / near-complete must paint immediately — coalesce
            // would leave the shade frozen after the peer already has the file.
            if (complete || nearComplete) {
                MAIN.removeCallbacks(ui.flush);
                ui.scheduled = false;
                if (complete) {
                    PEER_UI.remove(key, ui);
                }
                if (Looper.myLooper() == Looper.getMainLooper()) {
                    ui.flush.run();
                } else {
                    MAIN.post(ui.flush);
                }
                return;
            }
            if (!ui.scheduled) {
                ui.scheduled = true;
                MAIN.postDelayed(ui.flush, PEER_UI_COALESCE_MS);
            }
        } catch (Throwable t) {
            Log.w(TAG, "notifyPeerProgressBytes failed: " + t.getMessage());
        }
    }

    /** Immediate (non-coalesced) paint — used by coalesce flush + complete. */
    private static void postPeerProgressNow(
            Context context,
            String transferId,
            String peerId,
            String message,
            long bytesDone,
            long totalBytes,
            long speedBps,
            Long etaMs
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
            int notifId = notificationIdForPeer(tid, peer);
            boolean complete = totalBytes > 0 && bytesDone >= totalBytes;
            String safeMsg = message;
            if (safeMsg != null) {
                // COMPAT: older call sites still pass "Downloading".
                if (safeMsg.equalsIgnoreCase("Downloading")
                        || safeMsg.toLowerCase(java.util.Locale.US).startsWith("downloading")) {
                    safeMsg = safeMsg.replaceAll("(?i)Downloading", "Sending");
                }
            }
            StringBuilder body = new StringBuilder();
            if (safeMsg != null && !safeMsg.isEmpty()) body.append(safeMsg);
            if (totalBytes > 0) {
                if (body.length() > 0) body.append(" — ");
                body.append(FilesIncomingNotifier.formatByteSize(bytesDone))
                        .append(" / ")
                        .append(FilesIncomingNotifier.formatByteSize(totalBytes));
            } else if (bytesDone > 0) {
                if (body.length() > 0) body.append(" — ");
                body.append(FilesIncomingNotifier.formatByteSize(bytesDone));
            }
            if (speedBps > 0 && !complete) {
                body.append(" · ").append(FilesIncomingNotifier.formatByteSize(speedBps)).append("/s");
            }
            if (etaMs != null && etaMs >= 0 && !complete) {
                body.append(" · ").append(FilesIncomingNotifier.formatEta(etaMs));
            }
            int barMax;
            int barCur;
            if (totalBytes <= 0) {
                barMax = -1;
                barCur = 0;
            } else if (complete) {
                barMax = 1000;
                barCur = 1000;
            } else {
                barMax = 1000;
                barCur = (int) Math.max(0L, Math.min(999L, (bytesDone * 1000L) / totalBytes));
            }
            postProgressNotif(context, notifId, tid, peer,
                    "Sending → " + shortPeerLabel(peer),
                    body.toString(), barCur, barMax, !complete);
        } catch (Throwable t) {
            Log.w(TAG, "postPeerProgressNow failed: " + t.getMessage());
        }
    }

    /** One peer finished — auto-dismiss that peer's notif only. */
    public static void notifyPeerComplete(
            Context context,
            String transferId,
            String peerId,
            int fileCount
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
            clearPeerProgressUi(tid, peer);
            // WHY: cancel both raw and short ids — older ticks may have used
            // L-192.168.0.xxx before canonicalize; otherwise Sending bar sticks.
            cancelPeerNotifIds(context, tid, peer);
            int notifId = notificationIdForPeer(tid, peer);
            String body = fileCount > 0
                    ? ("Sent " + fileCount + " file" + (fileCount == 1 ? "" : "s")
                    + " → " + shortPeerLabel(peer))
                    : ("Sent → " + shortPeerLabel(peer));
            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_sys_upload_done)
                    .setContentTitle("Files sent")
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setProgress(0, 0, false)
                    .setOngoing(false)
                    .setAutoCancel(true)
                    .setOnlyAlertOnce(true)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setCategory(NotificationCompat.CATEGORY_STATUS)
                    .setTimeoutAfter(8_000L);
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifyPeerComplete failed: " + t.getMessage());
        }
    }

    /**
     * Named destination never Accepted within the multi-dest wait window.
     * WHY: Share to L-210+L-196 — one Accept, the other must not stay "waiting".
     */
    public static void notifyPeerTimeout(Context context, String transferId, String peerId) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
            clearPeerProgressUi(tid, peer);
            cancelPeerNotifIds(context, tid, peer);
            int notifId = notificationIdForPeer(tid, peer);
            String body = "No Accept within 30s → " + shortPeerLabel(peer);
            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.ic_menu_recent_history)
                    .setContentTitle("Timeout")
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setProgress(0, 0, false)
                    .setOngoing(false)
                    .setAutoCancel(true)
                    .setOnlyAlertOnce(true)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setCategory(NotificationCompat.CATEGORY_STATUS)
                    .setTimeoutAfter(12_000L);
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifyPeerTimeout failed: " + t.getMessage());
        }
    }

    public static void cancelPeer(Context context, String transferId, String peerId) {
        if (context == null || transferId == null) return;
        try {
            String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
            clearPeerProgressUi(transferId, peer);
            cancelPeerNotifIds(context, transferId, peer);
        } catch (Exception e) {
            Log.w(TAG, "cancelPeer failed", e);
        }
    }

    /** Cancel shade ids for raw + short peer forms (alias mismatch cleanup). */
    private static void cancelPeerNotifIds(Context context, String transferId, String peerId) {
        if (context == null) return;
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        String tid = transferId != null ? transferId : "";
        String peer = peerId != null ? peerId.trim() : "";
        nm.cancel(notificationIdForPeer(tid, peer));
        nm.cancel(notificationIdForPeerRaw(tid, peer));
        try {
            String shortId = core.Configure.toShortFleetClientId(peer);
            if (shortId != null && !shortId.isEmpty() && !shortId.equalsIgnoreCase(peer)) {
                nm.cancel(notificationIdForPeerRaw(tid, shortId));
            }
        } catch (Throwable ignored) { /* */ }
        // COMPAT: full home-LAN form L-192.168.0.N may have been used as the key.
        if (peer.regionMatches(true, 0, "L-", 0, 2) && peer.indexOf('.') < 0) {
            try {
                String octet = peer.substring(2).trim();
                if (!octet.isEmpty()) {
                    nm.cancel(notificationIdForPeerRaw(tid, "L-192.168.0." + octet));
                }
            } catch (Throwable ignored) { /* */ }
        }
    }

    private static void clearPeerProgressUi(String transferId, String peerId) {
        String tid = transferId != null ? transferId : "";
        String peer = peerId != null && !peerId.isEmpty() ? peerId : "peer";
        removePeerUiKey(tid + "\0" + peer);
        try {
            String shortId = core.Configure.toShortFleetClientId(peer);
            if (shortId != null && !shortId.isEmpty()) {
                removePeerUiKey(tid + "\0" + shortId);
            }
        } catch (Throwable ignored) { /* */ }
        if (peer.regionMatches(true, 0, "L-", 0, 2) && peer.indexOf('.') < 0) {
            try {
                String octet = peer.substring(2).trim();
                if (!octet.isEmpty()) {
                    removePeerUiKey(tid + "\0" + "L-192.168.0." + octet);
                }
            } catch (Throwable ignored) { /* */ }
        }
    }

    private static void removePeerUiKey(String key) {
        PeerProgressUi ui = PEER_UI.remove(key);
        if (ui != null) {
            try {
                MAIN.removeCallbacks(ui.flush);
            } catch (Throwable ignored) { /* */ }
            ui.scheduled = false;
        }
    }

    /** Upload/mirror failed — clear ongoing progress so the shade does not hang. */
    public static void notifyFailed(Context context, String transferId, String reason) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            String body = (reason != null && !reason.isEmpty())
                    ? reason
                    : "Upload failed";
            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_notify_error)
                    .setContentTitle("Upload failed")
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setProgress(0, 0, false)
                    .setOngoing(false)
                    .setAutoCancel(true)
                    .setOnlyAlertOnce(true)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setCategory(NotificationCompat.CATEGORY_STATUS)
                    .setTimeoutAfter(12_000L);
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifyFailed failed: " + t.getMessage());
        }
    }

    /**
     * Final success: clear ongoing, auto-cancel. Called on files:done / local complete.
     */
    public static void notifyComplete(Context context, String transferId, int fileCount) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            String body = fileCount > 0
                    ? ("Sent " + fileCount + " file" + (fileCount == 1 ? "" : "s"))
                    : "Sent";
            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_sys_upload_done)
                    .setContentTitle("Files sent")
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setProgress(0, 0, false)
                    .setOngoing(false)
                    .setAutoCancel(true)
                    .setOnlyAlertOnce(true)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setCategory(NotificationCompat.CATEGORY_STATUS)
                    .setTimeoutAfter(8_000L);
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifyComplete failed: " + t.getMessage());
        }
    }

    /**
     * Single Aborted summary for unfinished outbound files.
     * @param savedOrDone count already finished before abort
     * @param remaining   count not yet delivered / still pending
     */
    public static void notifyAborted(
            Context context,
            String transferId,
            int savedOrDone,
            int remaining
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            String body;
            if (remaining > 0 && savedOrDone > 0) {
                body = "Aborted — " + remaining + " unfinished, " + savedOrDone + " already done";
            } else if (remaining > 0) {
                body = "Aborted — " + remaining + " file" + (remaining == 1 ? "" : "s") + " unfinished";
            } else {
                body = "Aborted";
            }
            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_sys_upload_done)
                    .setContentTitle("Aborted")
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setAutoCancel(true)
                    .setOngoing(false)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setCategory(NotificationCompat.CATEGORY_STATUS);
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifyAborted failed: " + t.getMessage());
        }
    }

    private static void postProgressNotif(
            Context context,
            int notifId,
            String transferId,
            String peerId,
            String title,
            String body,
            int done,
            int total,
            boolean showAbort
    ) {
        NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_upload)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setOnlyAlertOnce(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setCategory(NotificationCompat.CATEGORY_PROGRESS);
        if (total < 0) {
            // Indeterminate — waiting / peer-download phases (must stay visible).
            b.setProgress(0, 0, true);
            b.setOngoing(true);
        } else if (total > 0 && done >= 0 && done < total) {
            b.setProgress(total, done, false);
            b.setOngoing(true);
        } else if (total > 0 && done >= total) {
            // Upload bytes finished — keep a full bar briefly until waiting/complete.
            b.setProgress(total, total, false);
            b.setOngoing(showAbort);
            if (!showAbort) b.setAutoCancel(true);
        } else {
            b.setProgress(0, 0, false);
            b.setOngoing(false);
            b.setAutoCancel(true);
        }
        if (showAbort && transferId != null && !transferId.isEmpty()) {
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
            Intent abort = new Intent(NOTIF_ACTION_ABORT);
            abort.setPackage(context.getPackageName());
            abort.putExtra(EXTRA_TRANSFER_ID, transferId);
            // WHY: peer notif Abort cancels one leg; waiting/upload Abort is whole.
            if (peerId != null && !peerId.isEmpty()) {
                abort.putExtra(EXTRA_PEER_ID, peerId);
            }
            PendingIntent abortPi = PendingIntent.getBroadcast(
                    context, notifId | 0x2000, abort, flags);
            b.addAction(0, "Abort", abortPi);
        }
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(notifId, b.build());
    }

    /** Short label for shade title (L-192.168.0.196 → L-196). */
    public static String shortPeerLabel(String peerId) {
        if (peerId == null || peerId.isEmpty()) return "peer";
        String p = peerId.trim();
        if (p.regionMatches(true, 0, "L-", 0, 2)) {
            int lastDot = p.lastIndexOf('.');
            if (lastDot > 2 && lastDot < p.length() - 1) {
                return "L-" + p.substring(lastDot + 1);
            }
        }
        return p.length() > 18 ? p.substring(0, 18) : p;
    }

    public static void cancel(Context context, String transferId) {
        if (context == null || transferId == null) return;
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(notificationIdFor(transferId));
        } catch (Exception e) {
            Log.w(TAG, "cancel failed", e);
        }
    }

    public static void persistPendingIngress(Context context, String transferId, JSONObject json) {
        if (context == null || transferId == null || transferId.isEmpty() || json == null) return;
        File dir = pendingDir(context);
        if (!dir.exists() && !dir.mkdirs()) {
            Log.w(TAG, "persistPendingIngress mkdirs failed " + dir);
            return;
        }
        File f = new File(dir, transferId + ".json");
        try (Writer w = new OutputStreamWriter(new FileOutputStream(f), StandardCharsets.UTF_8)) {
            w.write(json.toString());
        } catch (Exception e) {
            Log.w(TAG, "persistPendingIngress write failed " + f, e);
            return;
        }
        try {
            File latest = new File(dir, "latest.json");
            JSONObject ptr = new JSONObject();
            ptr.put("transferId", transferId);
            try (Writer w = new OutputStreamWriter(new FileOutputStream(latest), StandardCharsets.UTF_8)) {
                w.write(ptr.toString());
            }
        } catch (Exception e) {
            Log.w(TAG, "persistPendingIngress latest pointer failed", e);
        }
    }

    public static void deletePendingIngress(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return;
        try {
            File f = new File(pendingDir(context), transferId + ".json");
            if (f.isFile() && !f.delete()) {
                Log.w(TAG, "deletePendingIngress failed " + f);
            }
        } catch (Exception e) {
            Log.w(TAG, "deletePendingIngress", e);
        }
    }

    /** Read + delete one pending ingress envelope (consumed by files-hub drain). */
    public static JSONObject takePendingIngress(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return null;
        File f = new File(pendingDir(context), transferId + ".json");
        if (!f.exists()) return null;
        try {
            java.io.FileInputStream fis = new java.io.FileInputStream(f);
            StringBuilder sb = new StringBuilder();
            try (java.io.BufferedReader br = new java.io.BufferedReader(
                    new java.io.InputStreamReader(fis, StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) sb.append(line).append('\n');
            }
            try { f.delete(); } catch (Exception ignored) { /* best-effort */ }
            return new JSONObject(sb.toString());
        } catch (Exception e) {
            Log.w(TAG, "takePendingIngress failed " + f, e);
            return null;
        }
    }

    /** List pending ingress transferIds (filenames without {@code .json}). */
    public static java.util.List<String> listPendingTransferIds(Context context) {
        java.util.List<String> out = new java.util.ArrayList<>();
        if (context == null) return out;
        File dir = pendingDir(context);
        if (!dir.isDirectory()) return out;
        File[] kids = dir.listFiles();
        if (kids == null) return out;
        for (File k : kids) {
            String n = k.getName();
            if (n.endsWith(".json") && !n.equals("latest.json")) {
                out.add(n.substring(0, n.length() - ".json".length()));
            }
        }
        return out;
    }

    public static File pendingDir(Context context) {
        return new File(context.getFilesDir(), PENDING_REL_DIR);
    }

    private static int notificationIdFor(String transferId) {
        return NOTIFICATION_ID_BASE ^ (transferId != null ? transferId.hashCode() : 0);
    }

    /** Distinct shade id per Accepting peer leg.
     * INVARIANT: canonicalize peer id so {@code L-210} and {@code L-192.168.0.210}
     * share one notification (files:done must clear the Sending bar).
     */
    public static int notificationIdForPeer(String transferId, String peerId) {
        int tid = transferId != null ? transferId.hashCode() : 0;
        String peerKey = peerId != null ? peerId.trim() : "";
        try {
            String shortId = core.Configure.toShortFleetClientId(peerKey);
            if (shortId != null && !shortId.isEmpty()) peerKey = shortId;
        } catch (Throwable ignored) { /* */ }
        int peer = peerKey.hashCode();
        return NOTIFICATION_ID_BASE ^ tid ^ (peer * 31);
    }

    /** Raw hash (no canonicalize) — used to cancel stale alias shade ids. */
    private static int notificationIdForPeerRaw(String transferId, String peerId) {
        int tid = transferId != null ? transferId.hashCode() : 0;
        int peer = peerId != null ? peerId.hashCode() : 0;
        return NOTIFICATION_ID_BASE ^ tid ^ (peer * 31);
    }
}
