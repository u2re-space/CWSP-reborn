/*
 * Filename: FilesPendingOffers.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesPendingOffers.java
 * Change date and time: 18.20.00_21.07.2026
 * Reason for changes: Persist inbound files:offer payloads so Accept can run
 *   without the WebView — notification Accept previously only launched
 *   MainActivity and never emitted files:accept or wrote bytes.
 *
 * INVARIANT: store under app-private files/pending-offers/; consume on Accept
 * or Decline. Full offer (batches + asset.data/url) must be present for embed
 * path; otherwise Accept surfaces files:error locally.
 */
package emission;

import android.content.Context;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;

/**
 * Persist / load / delete inbound {@code files:offer} JSON for Accept.
 */
public final class FilesPendingOffers {
    private static final String TAG = "emission.FilesPendingOffers";
    public static final String PENDING_REL_DIR = "files/pending-offers";

    private FilesPendingOffers() { /* no instances */ }

    public static File pendingDir(Context context) {
        return new File(context.getApplicationContext().getFilesDir(), PENDING_REL_DIR);
    }

    /**
     * Persist the full offer map (including batches) keyed by transferId.
     * WHY: Accept runs from a BroadcastReceiver; WebView may be dead.
     */
    public static void persist(Context context, String transferId, JSONObject offerJson) {
        if (context == null || transferId == null || transferId.isEmpty() || offerJson == null) {
            return;
        }
        // SECURITY: reject path traversal in transferId filenames.
        if (!isSafeTransferId(transferId)) {
            Log.w(TAG, "persist rejected unsafe transferId");
            return;
        }
        File dir = pendingDir(context);
        if (!dir.exists() && !dir.mkdirs()) {
            Log.w(TAG, "persist mkdirs failed " + dir);
            return;
        }
        File f = new File(dir, transferId + ".json");
        try (Writer w = new OutputStreamWriter(new FileOutputStream(f), StandardCharsets.UTF_8)) {
            w.write(offerJson.toString());
            Log.i(TAG, "persisted offer transferId=" + transferId + " bytes=" + f.length());
        } catch (Exception e) {
            Log.w(TAG, "persist write failed " + f, e);
        }
    }

    /** Read without deleting (Accept may retry send after partial write). */
    public static JSONObject peek(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return null;
        if (!isSafeTransferId(transferId)) return null;
        File f = new File(pendingDir(context), transferId + ".json");
        if (!f.exists()) return null;
        try {
            StringBuilder sb = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(new FileInputStream(f), StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) sb.append(line).append('\n');
            }
            return new JSONObject(sb.toString());
        } catch (Exception e) {
            Log.w(TAG, "peek failed " + f, e);
            return null;
        }
    }

    /** Delete persisted offer after successful Accept or Decline. */
    public static void delete(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return;
        if (!isSafeTransferId(transferId)) return;
        File f = new File(pendingDir(context), transferId + ".json");
        try {
            if (f.exists() && !f.delete()) {
                Log.w(TAG, "delete failed " + f);
            }
        } catch (Exception e) {
            Log.w(TAG, "delete exception " + f, e);
        }
    }

    /** UUID-safe / basename-safe transferId (no {@code ..} / separators). */
    public static boolean isSafeTransferId(String transferId) {
        if (transferId == null || transferId.isEmpty() || transferId.length() > 128) return false;
        for (int i = 0; i < transferId.length(); i++) {
            char c = transferId.charAt(i);
            if ((c >= 'a' && c <= 'z')
                    || (c >= 'A' && c <= 'Z')
                    || (c >= '0' && c <= '9')
                    || c == '-' || c == '_' || c == '.') {
                continue;
            }
            return false;
        }
        return !transferId.contains("..");
    }
}
