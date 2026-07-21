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
            } else if (total < 0) {
                b.setProgress(0, 0, true);
            } else {
                b.setProgress(0, 0, false);
                b.setAutoCancel(true);
            }
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifId, b.build());
        } catch (Throwable t) {
            Log.w(TAG, "notifyProgress failed: " + t.getMessage());
        }
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
