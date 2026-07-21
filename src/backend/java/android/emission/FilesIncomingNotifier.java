/*
 * Filename: FilesIncomingNotifier.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesIncomingNotifier.java
 * Change date and time: 18.30.00_21.07.2026
 * Reason for changes: W4 minimal — post a "Files ready to download" system
 *   notification when an inbound `files:offer` (or `files:error`) reaches the
 *   Android bridge. Capacitor web forwards via CwsBridgePlugin
 *   `files:incoming-offer`; native /ws (CwspWsClient) also calls notify()
 *   directly when Java owns the realtime socket.
 *   2026-07-21 (Bug B fix): rewrite channel to cwsp-files-incoming-heads
 *   with IMPORTANCE_HIGH + PRIORITY_HIGH + CATEGORY_MESSAGE (mirrors the
 *   clipboard prompt fix cwsp_clipboard_prompt_heads). Add Accept/Decline
 *   actions via FilesPromptReceiver so the user can act on the heads-up
 *   without diving into the app shell. The old IMPORTANCE_DEFAULT channel
 *   was silently dropped by the OS on backgrounded apps.
 *   2026-07-21e: persist full offer JSON on notify (Accept materialize);
 *   notifyProgress for Accept download status.
 *   2026-07-21f: notifySaved contentIntent + "Open folder" open SAF/Downloads/
 *   CWSP Files landing (not MainActivity).
 *   2026-07-21g: tap always broadcasts → createChooser on SAF document Uri
 *   (no silent file:// / package-locked VIEW that offered zero managers).
 *   2026-07-21h: notifyProgressBytes — byte bar + speed/ETA (batch i/N was
 *   useless for a single 5–10+ MiB file).
 *   2026-07-21i: notifySaved adds "Open File" (FileProvider VIEW) beside
 *   "Open in Folder".
 *   2026-07-21r: Open File/Folder/Share via FilesPromptActivity trampoline
 *   (receiver startActivity was a silent no-op under BAL).
 *   2026-07-21s: multi-file Saved shows Open in Folder only (no Open File).
 *   2026-07-21u: notifySaved title/body show real DISPLAY_NAME, not app-private
 *   absolute landing path.
 *
 * INVARIANT: never touches clipboard notification channels. Uses a dedicated
 * cwsp-files-incoming-heads notification channel so the user can mute files
 * independently of clipboard prompts.
 */
package emission;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;

import space.u2re.cwsp.FilesPromptActivity;
import space.u2re.cwsp.FilesPromptReceiver;

/**
 * Posts a "Files ready to download" notification for inbound files:offer.
 * Self-contained: takes a Context + the normalized offer map from the bridge.
 */
public final class FilesIncomingNotifier {
    private static final String TAG = "emission.FilesIncomingNotifier";
    /**
     * WHY (Bug B): IMPORTANCE_HIGH channel so the heads-up actually surfaces
     * when the app is backgrounded. The old cwsp-files-incoming channel was
     * IMPORTANCE_DEFAULT and the OS silently dropped it on backgrounded apps
     * (same trap as the clipboard prompt before cwsp_clipboard_prompt_heads).
     */
    public static final String CHANNEL_ID = "cwsp-files-incoming-heads";
    public static final int NOTIFICATION_ID = 0xC5F1; // stable id for the active incoming offer

    private FilesIncomingNotifier() { /* no instances */ }

    /**
     * Ensure the dedicated files-incoming notification channel exists.
     * WHY: POST_NOTIFICATIONS + a real channel are required on Android 8+.
     * Idempotent — safe to call on every offer.
     */
    public static void ensureChannel(Context context) {
        if (context == null) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID,
                "CWSP Files Incoming",
                NotificationManager.IMPORTANCE_HIGH
        );
        ch.setDescription("Heads-up when files arrive from a CWSP peer");
        nm.createNotificationChannel(ch);
    }

    /** Cancel the incoming-offer notification for a transferId. */
    public static void cancel(Context context, String transferId) {
        if (context == null || transferId == null) return;
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(notificationIdFor(transferId));
        } catch (Exception e) {
            Log.w(TAG, "cancel failed", e);
        }
    }

    /** Stable notification id per transferId so each offer gets its own slot. */
    public static int notificationIdFor(String transferId) {
        if (transferId == null || transferId.isEmpty()) return NOTIFICATION_ID;
        return NOTIFICATION_ID + (transferId.hashCode() & 0x0FFF);
    }

    /**
     * Post a heads-up notification for an inbound files:offer / files:error.
     *
     * @param context  Application / service context
     * @param offerMap Normalized packet payload (transferId, summary.fileCount,
     *                 summary.totalBytes, sender). Null-safe.
     * @param isError  true for files:error (shows a failure line instead of "ready")
     */
    public static void notify(Context context, Map<String, Object> offerMap, boolean isError) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String transferId = stringOf(offerMap, "transferId");
            String sender = stringOf(offerMap, "sender");
            int fileCount = intOf(offerMap, "fileCount",
                    nestedInt(offerMap, "summary", "fileCount"));
            long totalBytes = longOf(offerMap, "totalBytes",
                    nestedLong(offerMap, "summary", "totalBytes"));

            // WHY: Accept runs from FilesPromptReceiver without WebView — must
            // keep batches/asset.data|url on disk until Accept/Decline.
            if (!isError && transferId != null && !transferId.isEmpty() && offerMap != null) {
                try {
                    JSONObject json = mapToJson(offerMap);
                    FilesPendingOffers.persist(context, transferId, json);
                } catch (Exception e) {
                    Log.w(TAG, "persist pending offer failed", e);
                }
            }

            String title = isError
                    ? "Files transfer failed"
                    : "Files ready to download";
            StringBuilder body = new StringBuilder();
            if (isError) {
                body.append("Transfer ").append(transferId.isEmpty() ? "unknown" : transferId).append(" failed");
            } else {
                body.append(fileCount).append(" file").append(fileCount == 1 ? "" : "s");
                if (totalBytes > 0) body.append(" (").append(formatBytes(totalBytes)).append(")");
                if (!sender.isEmpty()) body.append(" from ").append(sender);
            }

            // WHY (Bug B): Accept/Decline actions via FilesPromptReceiver so
            // the user can act on the heads-up without diving into the app
            // shell. Accept launches MainActivity with the transferId extra;
            // Decline just cancels the notification (the offer expires on TTL).
            int notifId = notificationIdFor(transferId);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;

            Intent accept = new Intent(FilesPromptReceiver.ACTION_INCOMING_ACCEPT);
            accept.setPackage(context.getPackageName());
            if (!transferId.isEmpty()) accept.putExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID, transferId);
            PendingIntent acceptPi = PendingIntent.getBroadcast(context, notifId, accept, flags);

            Intent decline = new Intent(FilesPromptReceiver.ACTION_INCOMING_DECLINE);
            decline.setPackage(context.getPackageName());
            if (!transferId.isEmpty()) decline.putExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID, transferId);
            PendingIntent declinePi = PendingIntent.getBroadcast(context, notifId | 0x4000, decline, flags);

            Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            PendingIntent pi = null;
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                if (!transferId.isEmpty()) {
                    launch.putExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID, transferId);
                }
                pi = PendingIntent.getActivity(context, notifId, launch, flags);
            }

            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_sys_download)
                    .setContentTitle(title)
                    .setContentText(body.toString())
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body.toString()))
                    .setAutoCancel(true)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setCategory(NotificationCompat.CATEGORY_MESSAGE);
            if (pi != null) b.setContentIntent(pi);
            if (!isError) {
                b.addAction(0, "Accept", acceptPi);
                b.addAction(0, "Decline", declinePi);
            }

            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.notify(notifId, b.build());
            }
        } catch (Throwable t) {
            Log.w(TAG, "notify failed: " + t.getMessage());
        }
    }

    // ---- tiny map helpers (the bridge payload is a loose Map<String,Object>) ----

    private static String stringOf(Map<String, Object> m, String key) {
        if (m == null) return "";
        Object v = m.get(key);
        return v == null ? "" : v.toString();
    }

    private static int intOf(Map<String, Object> m, String key, int fallback) {
        if (m == null) return fallback;
        Object v = m.get(key);
        if (v instanceof Number) return ((Number) v).intValue();
        if (v instanceof String) {
            try { return Integer.parseInt((String) v); } catch (NumberFormatException e) { return fallback; }
        }
        return fallback;
    }

    private static long longOf(Map<String, Object> m, String key, long fallback) {
        if (m == null) return fallback;
        Object v = m.get(key);
        if (v instanceof Number) return ((Number) v).longValue();
        if (v instanceof String) {
            try { return Long.parseLong((String) v); } catch (NumberFormatException e) { return fallback; }
        }
        return fallback;
    }

    @SuppressWarnings("unchecked")
    private static int nestedInt(Map<String, Object> m, String outer, String inner) {
        Object o = m == null ? null : m.get(outer);
        if (o instanceof Map) {
            Object v = ((Map<String, Object>) o).get(inner);
            if (v instanceof Number) return ((Number) v).intValue();
            if (v instanceof String) {
                try { return Integer.parseInt((String) v); } catch (NumberFormatException e) { return 0; }
            }
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    private static long nestedLong(Map<String, Object> m, String outer, String inner) {
        Object o = m == null ? null : m.get(outer);
        if (o instanceof Map) {
            Object v = ((Map<String, Object>) o).get(inner);
            if (v instanceof Number) return ((Number) v).longValue();
            if (v instanceof String) {
                try { return Long.parseLong((String) v); } catch (NumberFormatException e) { return 0L; }
            }
        }
        return 0L;
    }

    /**
     * Progress / status heads-up for an in-flight Accept (same notif id slot).
     * WHY: user reported Accept with zero visible progress.
     * COMPAT: batch-step (done/total) — prefer {@link #notifyProgressBytes} for
     * large single-file HTTP pulls.
     */
    public static void notifyProgress(
            Context context,
            String transferId,
            String message,
            int done,
            int total
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            String title = total > 0 && done >= total
                    ? "Files saved"
                    : "Files transfer";
            String body = message != null ? message : "";
            if (total > 0 && done >= 0 && done < total) {
                body = body + " (" + done + "/" + total + ")";
            }
            postProgressNotif(context, notifId, title, body, done, total);
        } catch (Throwable t) {
            Log.w(TAG, "notifyProgress failed: " + t.getMessage());
        }
    }

    /**
     * Byte-accurate Accept progress with speed / ETA.
     * WHY: batch i/N stays at 0 for the whole multi-second HTTP of one 5–10+ MiB
     * file; users need reality (bytes + MB/s + remaining time).
     *
     * @param bytesDone  bytes completed across the whole transfer (0..)
     * @param totalBytes known total, or &lt;=0 for indeterminate
     * @param speedBps   EMA bytes/sec (0 if unknown)
     * @param etaMs      remaining ms, or null if unknown
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
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            boolean complete = totalBytes > 0 && bytesDone >= totalBytes;
            String title = complete ? "Files saved" : "Files transfer";
            StringBuilder body = new StringBuilder();
            if (message != null && !message.isEmpty()) body.append(message);
            if (totalBytes > 0) {
                if (body.length() > 0) body.append(" — ");
                body.append(formatByteSize(bytesDone)).append(" / ").append(formatByteSize(totalBytes));
            } else if (bytesDone > 0) {
                if (body.length() > 0) body.append(" — ");
                body.append(formatByteSize(bytesDone));
            }
            if (speedBps > 0 && !complete) {
                body.append(" · ").append(formatByteSize(speedBps)).append("/s");
            }
            if (etaMs != null && etaMs >= 0 && !complete) {
                body.append(" · ").append(formatEta(etaMs));
            }
            // WHY: NotificationCompat.setProgress uses int — map to 0..1000 so
            // multi-GiB totals never overflow the bar range.
            int barMax;
            int barCur;
            if (totalBytes <= 0) {
                barMax = -1; // indeterminate
                barCur = 0;
            } else if (complete) {
                barMax = 1000;
                barCur = 1000;
            } else {
                barMax = 1000;
                barCur = (int) Math.max(0L, Math.min(999L, (bytesDone * 1000L) / totalBytes));
            }
            postProgressNotif(context, notifId, title, body.toString(), barCur, barMax);
        } catch (Throwable t) {
            Log.w(TAG, "notifyProgressBytes failed: " + t.getMessage());
        }
    }

    private static void postProgressNotif(
            Context context,
            int notifId,
            String title,
            String body,
            int done,
            int total
    ) {
        NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setOnlyAlertOnce(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setCategory(NotificationCompat.CATEGORY_PROGRESS);
        if (total > 0 && done >= 0 && done < total) {
            b.setProgress(total, done, false);
            b.setOngoing(true);
        } else if (total < 0) {
            b.setProgress(0, 0, true);
            b.setOngoing(true);
        } else {
            b.setProgress(0, 0, false);
            b.setOngoing(false);
            b.setAutoCancel(true);
        }
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(notifId, b.build());
    }

    /** Human size: B / KB / MB / GB with one decimal when useful. */
    public static String formatByteSize(long bytes) {
        if (bytes < 0) bytes = 0;
        if (bytes < 1000L) return bytes + " B";
        double v = bytes;
        String[] units = { "KB", "MB", "GB", "TB" };
        int u = -1;
        do {
            v /= 1024.0;
            u++;
        } while (v >= 1000.0 && u < units.length - 1);
        if (v >= 100.0 || u == 0 && v >= 10.0) {
            return String.format(java.util.Locale.US, "%.0f %s", v, units[u]);
        }
        return String.format(java.util.Locale.US, "%.1f %s", v, units[u]);
    }

    /** Compact remaining time for notification body. */
    public static String formatEta(long etaMs) {
        if (etaMs < 0) return "";
        long sec = Math.max(1L, (etaMs + 500L) / 1000L);
        if (sec < 60L) return "~" + sec + "s";
        long min = sec / 60L;
        long rem = sec % 60L;
        if (min < 60L) {
            return rem > 0 ? "~" + min + "m " + rem + "s" : "~" + min + "m";
        }
        long hr = min / 60L;
        long m2 = min % 60L;
        return m2 > 0 ? "~" + hr + "h " + m2 + "m" : "~" + hr + "h";
    }

    /**
     * Final "saved" heads-up: tap opens landing folder (SAF / Downloads / CWSP
     * Files). Actions: Open in Folder + Share always; Open File only for a
     * single landed file (multi-file has no primary file to VIEW).
     *
     * WHY: Open File / Folder / Share use {@link FilesPromptActivity} (Activity
     * PendingIntent), not BroadcastReceiver — Android 10+ blocks background
     * {@code startActivity} from a receiver, so taps looked like no-ops.
     */
    public static void notifySaved(Context context, String transferId, int fileCount, String path) {
        notifySaved(context, transferId, fileCount, path, null, null);
    }

    public static void notifySaved(
            Context context,
            String transferId,
            int fileCount,
            String path,
            String contentUri
    ) {
        notifySaved(context, transferId, fileCount, path, contentUri, null);
    }

    /**
     * @param contentUri final public/DocumentsProvider Uri for Open File (preferred
     *                   over app-private landing path). Null falls back to path.
     * @param displayName user-facing filename for the notification body (preferred
     *                    over absolute app-private path).
     */
    public static void notifySaved(
            Context context,
            String transferId,
            int fileCount,
            String path,
            String contentUri,
            String displayName
    ) {
        if (context == null) return;
        try {
            ensureChannel(context);
            String tid = transferId != null ? transferId : "";
            int notifId = notificationIdFor(tid);
            String mode = FilesStorage.readLandingMode(context);
            String where =
                    "saf".equals(mode) ? "SAF folder"
                            : "downloads".equals(mode) ? "Downloads"
                            : "CWSP Files";
            // WHY: show real final filename, never the app-private absolute path.
            String shownName = resolveSavedDisplayName(context, displayName, contentUri, path);
            String body;
            if (fileCount == 1 && shownName != null && !shownName.isEmpty()) {
                body = shownName + " → " + where;
            } else if (shownName != null && !shownName.isEmpty() && fileCount > 1) {
                body = "Saved " + fileCount + " file(s) → " + where + "\n" + shownName + " …";
            } else {
                body = "Saved " + fileCount + " file(s) → " + where;
            }
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;

            PendingIntent sharePi = filesActivityAction(
                    context, FilesPromptReceiver.ACTION_SHARE_LANDING, tid, null, null, notifId | 0x5000, flags);
            PendingIntent openFolderPi = filesActivityAction(
                    context, FilesPromptReceiver.ACTION_OPEN_LANDING, tid, null, null, notifId | 0x5200, flags);

            // WHY: Open File only for singles — multi-file has no one primary target.
            boolean singleFile = fileCount == 1
                    || (path != null && new java.io.File(path).isFile());

            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_sys_download_done)
                    .setContentTitle(singleFile && shownName != null && !shownName.isEmpty()
                            ? shownName
                            : "Files saved")
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setAutoCancel(true)
                    .setOnlyAlertOnce(true)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(openFolderPi);
            if (singleFile) {
                PendingIntent openFilePi = filesActivityAction(
                        context,
                        FilesPromptReceiver.ACTION_OPEN_FILE,
                        tid,
                        path,
                        contentUri,
                        notifId | 0x5400,
                        flags
                );
                b.addAction(0, "Open File", openFilePi);
            }
            b.addAction(0, "Open in Folder", openFolderPi)
                    .addAction(0, "Share", sharePi);
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifySaved failed: " + t.getMessage());
            notifyProgress(context, transferId, "Saved " + fileCount + " file(s)", fileCount, fileCount);
        }
    }

    /**
     * Pick a user-facing basename for "Files saved".
     * Prefers explicit displayName → MediaStore/SAF DISPLAY_NAME → file basename.
     * Never returns a full app-private absolute path.
     */
    private static String resolveSavedDisplayName(
            Context context,
            String displayName,
            String contentUri,
            String path
    ) {
        if (displayName != null) {
            String d = displayName.trim();
            if (!d.isEmpty()) {
                // Strip any accidental directory prefix.
                int slash = Math.max(d.lastIndexOf('/'), d.lastIndexOf('\\'));
                return slash >= 0 ? d.substring(slash + 1) : d;
            }
        }
        if (contentUri != null && !contentUri.trim().isEmpty()) {
            try {
                android.net.Uri uri = android.net.Uri.parse(contentUri.trim());
                String fromUri = queryDisplayName(context, uri);
                if (fromUri != null && !fromUri.isEmpty()) return fromUri;
                String last = uri.getLastPathSegment();
                if (last != null && !last.isEmpty() && !last.contains(":")) {
                    // DocumentsProvider ids often end with /filename
                    int slash = last.lastIndexOf('/');
                    if (slash >= 0 && slash < last.length() - 1) {
                        return last.substring(slash + 1);
                    }
                    return last;
                }
            } catch (Exception ignored) { /* fall through */ }
        }
        if (path != null && !path.isEmpty()) {
            java.io.File f = new java.io.File(path);
            if (f.isFile()) {
                String n = f.getName();
                if (n != null && !n.isEmpty()) return n;
            }
        }
        return null;
    }

    private static String queryDisplayName(Context context, android.net.Uri uri) {
        if (context == null || uri == null) return null;
        android.database.Cursor c = null;
        try {
            c = context.getContentResolver().query(
                    uri,
                    new String[]{android.provider.OpenableColumns.DISPLAY_NAME},
                    null,
                    null,
                    null
            );
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) {
                    String name = c.getString(idx);
                    if (name != null && !name.trim().isEmpty()) return name.trim();
                }
            }
        } catch (Exception ignored) {
            return null;
        } finally {
            if (c != null) try { c.close(); } catch (Exception ignored) { /* */ }
        }
        return null;
    }

    /**
     * Activity trampoline PendingIntent — same pattern as clipboard Accept.
     * WHY: notification BAL exemption applies to getActivity, not reliably to
     * receiver→startActivity chains on Android 12+/OEM builds.
     */
    private static PendingIntent filesActivityAction(
            Context context,
            String action,
            String transferId,
            String filePath,
            String contentUri,
            int requestCode,
            int flags
    ) {
        Intent i = new Intent(context, FilesPromptActivity.class);
        i.setAction(action);
        if (transferId != null && !transferId.isEmpty()) {
            i.putExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID, transferId);
        }
        if (filePath != null && !filePath.isEmpty()) {
            i.putExtra(FilesOutgoingNotifier.EXTRA_FILE_PATH, filePath);
        }
        if (contentUri != null && !contentUri.isEmpty()) {
            i.putExtra(FilesOutgoingNotifier.EXTRA_CONTENT_URI, contentUri);
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_NO_ANIMATION
                | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        return PendingIntent.getActivity(context, requestCode, i, flags);
    }

    @SuppressWarnings("unchecked")
    private static JSONObject mapToJson(Map<String, Object> map) throws Exception {
        JSONObject obj = new JSONObject();
        if (map == null) return obj;
        for (Map.Entry<String, Object> e : map.entrySet()) {
            obj.put(e.getKey(), toJsonValue(e.getValue()));
        }
        return obj;
    }

    @SuppressWarnings("unchecked")
    private static Object toJsonValue(Object v) throws Exception {
        if (v == null) return JSONObject.NULL;
        if (v instanceof Map) return mapToJson((Map<String, Object>) v);
        if (v instanceof List) {
            JSONArray arr = new JSONArray();
            for (Object o : (List<?>) v) arr.put(toJsonValue(o));
            return arr;
        }
        if (v instanceof JSONObject || v instanceof JSONArray) return v;
        return v;
    }

    private static String formatBytes(long n) {
        if (n <= 0) return "0 B";
        String[] units = {"B", "KB", "MB", "GB"};
        double v = n;
        int i = 0;
        while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
        return (v < 10 && i > 0 ? String.format("%.1f", v) : String.format("%.0f", v)) + " " + units[i];
    }
}
