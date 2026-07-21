/*
 * Filename: FilesOutgoingNotifier.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesOutgoingNotifier.java
 * Change date and time: 17.55.00_21.07.2026
 * Reason for changes: Bug A fix — Open-with / share-target of arbitrary MIME
 *   stages into app-private Temp but ShareActivity has no WebView, so the
 *   live cwspFilesIngress emit no-ops when the plugin instance is null. This
 *   notifier posts a heads-up "Open for Share" notification (channel
 *   cwsp-files-outgoing-heads, IMPORTANCE_HIGH) so the user can re-enter the
 *   app and the Capacitor files-hub can drain the persisted pending ingress.
 *
 *   Also owns the pending-ingress persistence helpers:
 *     files/pending-ingress/<transferId>.json   — one envelope per transfer
 *     files/pending-ingress/latest.json         — pointer to the latest stage
 *   drained by CwsBridgePlugin.load() and the files:drain-pending-ingress
 *   bridge channel.
 *
 * INVARIANT: never touches clipboard notification channels. Uses a dedicated
 * cwsp-files-outgoing-heads channel so the user can mute outgoing-share
 * heads-up independently of clipboard prompts and inbound files-incoming.
 *
 * WHY no WebView here: ShareActivity is a transient overlay with no Capacitor
 * bridge; the notification is the durable surface that survives process
 * death and lets the user re-enter MainActivity where the WebView boots and
 * drains the pending ingress.
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

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import space.u2re.cwsp.MainActivity;

/**
 * Posts a heads-up "Open for Share" notification for outbound staged files
 * (Open-with / share-target), and persists the ingress envelope so a later
 * Capacitor WebView boot can drain it via
 * {@code files:drain-pending-ingress}.
 */
public final class FilesOutgoingNotifier {
    private static final String TAG = "emission.FilesOutgoingNotifier";
    public static final String CHANNEL_ID = "cwsp-files-outgoing-heads";
    public static final String NOTIF_ACTION_SHARE = "space.u2re.cwsp.FILES_OUTGOING_SHARE";
    public static final String NOTIF_ACTION_DISMISS = "space.u2re.cwsp.FILES_OUTGOING_DISMISS";
    public static final String EXTRA_TRANSFER_ID = "cwsp_files_transfer_id";
    public static final String EXTRA_FILES_INGRESS = "cwsp_files_ingress";

    /** Per-transfer id base; notification id is derived from the transferId hash. */
    private static final int NOTIFICATION_ID_BASE = 0xC570;

    /** App-private pending-ingress dir, relative to {@link Context#getFilesDir()}. */
    public static final String PENDING_REL_DIR = "files/pending-ingress";

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
                NotificationManager.IMPORTANCE_HIGH
        );
        ch.setDescription("Heads-up when files are staged for Open-for-Share");
        nm.createNotificationChannel(ch);
    }

    /**
     * Post a heads-up "Open for Share" notification for a staged transfer.
     * Actions: Share (launch MainActivity with drain extra) / Dismiss
     * (cancel notif + best-effort GC the stage dir).
     */
    public static void notify(Context context, String transferId, int fileCount) {
        if (context == null || transferId == null || transferId.isEmpty()) return;
        try {
            ensureChannel(context);
            int notifId = notificationIdFor(transferId);
            String title = "Open for Share";
            String body = String.format(Locale.US,
                    "%d file%s staged — tap Share to send to a peer",
                    fileCount, fileCount == 1 ? "" : "s");

            // WHY: Share action launches MainActivity (NEW_TASK | CLEAR_TOP) with
            // extras so MainActivity.onResume / onNewIntent can ask the bridge
            // to drain pending ingress for this transferId.
            Intent share = new Intent(context, MainActivity.class);
            share.setAction(Intent.ACTION_VIEW);
            share.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            share.putExtra(EXTRA_FILES_INGRESS, true);
            share.putExtra(EXTRA_TRANSFER_ID, transferId);
            int shareFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) shareFlags |= PendingIntent.FLAG_IMMUTABLE;
            PendingIntent sharePi = PendingIntent.getActivity(context, notifId, share, shareFlags);

            // WHY: Dismiss action is a broadcast to FilesPromptReceiver so it can
            // cancel the notification + best-effort GC the stage dir without
            // launching an activity. Receiver is registered exported=false.
            Intent dismiss = new Intent(NOTIF_ACTION_DISMISS);
            dismiss.setPackage(context.getPackageName());
            dismiss.putExtra(EXTRA_TRANSFER_ID, transferId);
            int dismissFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) dismissFlags |= PendingIntent.FLAG_IMMUTABLE;
            PendingIntent dismissPi = PendingIntent.getBroadcast(context, notifId, dismiss, dismissFlags);

            NotificationCompat.Builder b = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_sys_upload)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setAutoCancel(true)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                    .setContentIntent(sharePi)
                    .addAction(0, "Share", sharePi)
                    .addAction(0, "Dismiss", dismissPi);

            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.notify(notifId, b.build());
            }
        } catch (Throwable t) {
            Log.w(TAG, "notify failed: " + t.getMessage());
        }
    }

    /** Cancel the heads-up notification for a transferId (e.g. after the WebView drained it). */
    public static void cancel(Context context, String transferId) {
        if (context == null || transferId == null) return;
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(notificationIdFor(transferId));
        } catch (Exception e) {
            Log.w(TAG, "cancel failed", e);
        }
    }

    /**
     * Persist a pending ingress envelope to
     * {@code files/pending-ingress/<transferId>.json} and a {@code latest.json}
     * pointer. WHY: ShareActivity has no WebView, so the live emit may no-op;
     * a later MainActivity boot drains these via
     * {@code files:drain-pending-ingress}.
     */
    public static void persistPendingIngress(Context context, String transferId, JSONObject json) {
        if (context == null || transferId == null || transferId.isEmpty() || json == null) return;
        File dir = pendingDir(context);
        if (!dir.exists() && !dir.mkdirs()) {
            Log.w(TAG, "persistPendingIngress mkdirs failed " + dir);
            return;
        }
        File f = new File(dir, transferId + ".json");
        try (Writer w = new OutputStreamWriter(
                new FileOutputStream(f), StandardCharsets.UTF_8)) {
            w.write(json.toString());
        } catch (Exception e) {
            Log.w(TAG, "persistPendingIngress write failed " + f, e);
            return;
        }
        // WHY: latest.json pointer lets the bridge drain the most recent stage
        // first when the WebView boots before any explicit transferId tap.
        File latest = new File(dir, "latest.json");
        try (Writer w = new OutputStreamWriter(
                new FileOutputStream(latest), StandardCharsets.UTF_8)) {
            w.write("{\"transferId\":\"" + transferId + "\"}");
        } catch (Exception e) {
            Log.w(TAG, "persistPendingIngress latest pointer failed", e);
        }
    }

    /**
     * Read and remove a pending ingress envelope by transferId. WHY: the
     * {@code files:drain-pending-ingress} bridge channel drains one (or all)
     * pending envelopes when the Capacitor WebView boots; reading consumes
     * the file so a re-drain does not double-emit.
     */
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
            // best-effort delete after read
            try { f.delete(); } catch (Exception ignored) { /* best-effort */ }
            return new JSONObject(sb.toString());
        } catch (Exception e) {
            Log.w(TAG, "takePendingIngress failed " + f, e);
            return null;
        }
    }

    /** List all pending ingress transferIds (filenames without the {@code .json} suffix). */
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

    /**
     * Best-effort delete of the persisted pending ingress for a transferId.
     * WHY: called from FilesPromptReceiver Dismiss action and from the bridge
     * after a successful drain so a cancelled / completed transfer does not
     * leak a stale envelope.
     */
    public static boolean deletePendingIngress(Context context, String transferId) {
        if (context == null || transferId == null) return false;
        try {
            File f = new File(pendingDir(context), transferId + ".json");
            return f.exists() && f.delete();
        } catch (Exception e) {
            Log.w(TAG, "deletePendingIngress failed", e);
            return false;
        }
    }

    public static File pendingDir(Context context) {
        return new File(context.getFilesDir(), PENDING_REL_DIR);
    }

    /** Stable notification id derived from the transferId hash so each transfer gets its own slot. */
    public static int notificationIdFor(String transferId) {
        if (transferId == null) return NOTIFICATION_ID_BASE;
        return NOTIFICATION_ID_BASE + (transferId.hashCode() & 0x0FFF);
    }
}
