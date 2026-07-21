/*
 * Filename: FilesOutgoingNotifier.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesOutgoingNotifier.java
 * Change date and time: 20.40.00_21.07.2026
 * Reason for changes: Pending-ingress persistence for ShareActivity (no WebView).
 *   2026-07-21 UX: notify() is a no-op — native Share/Open-with auto-offers via
 *   FilesOutboundOffer; the old "Open for Share" heads-up opened MainActivity
 *   and asked for a second confirm.
 *
 *   Owns pending-ingress helpers:
 *     files/pending-ingress/<transferId>.json
 *     files/pending-ingress/latest.json
 */
package emission;

import android.app.NotificationManager;
import android.content.Context;
import android.util.Log;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;

/**
 * Pending-ingress persistence for outbound Share/Open-with (and a suppressed
 * legacy outgoing notification API).
 */
public final class FilesOutgoingNotifier {
    private static final String TAG = "emission.FilesOutgoingNotifier";
    public static final String CHANNEL_ID = "cwsp-files-outgoing-heads";
    public static final String NOTIF_ACTION_SHARE = "space.u2re.cwsp.FILES_OUTGOING_SHARE";
    public static final String NOTIF_ACTION_DISMISS = "space.u2re.cwsp.FILES_OUTGOING_DISMISS";
    public static final String EXTRA_TRANSFER_ID = "cwsp_files_transfer_id";
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

    private FilesOutgoingNotifier() { /* no instances */ }

    public static void ensureChannel(Context context) {
        /* channel unused while notify() is suppressed */
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
}
