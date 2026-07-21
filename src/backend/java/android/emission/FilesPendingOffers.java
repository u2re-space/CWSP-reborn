/*
 * Filename: FilesPendingOffers.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesPendingOffers.java
 * Change date and time: 20.05.00_21.07.2026
 * Reason for changes: Persist inbound files:offer payloads so Accept can run
 *   without the WebView. Large asset.data embeds are stripped to binary
 *   sidecars — keeping multi-MiB base64 inside JSON OOM'd L-196 and left
 *   Accept stuck on "Accepting…" / offer missing.
 *
 * INVARIANT: store under app-private files/pending-offers/; consume on Accept
 * or Decline. Full offer (batches + asset.url|sidecar|data) must be present
 * for materialize; otherwise Accept surfaces files:error locally.
 */
package emission;

import android.content.Context;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
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
    /** WHY: base64 inside JSON doubles peak RAM; strip above this to .bin sidecars. */
    private static final int SIDECAR_DATA_CHARS = 48 * 1024;

    private FilesPendingOffers() { /* no instances */ }

    public static File pendingDir(Context context) {
        return new File(context.getApplicationContext().getFilesDir(), PENDING_REL_DIR);
    }

    /**
     * Persist the full offer map (including batches) keyed by transferId.
     * WHY: Accept runs from a BroadcastReceiver/FGS; WebView may be dead.
     * Large {@code asset.data} is decoded to {@code <tid>-<i>.bin} sidecars.
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
        try {
            // WHY: strip BEFORE toString — cloning via toString() would OOM first.
            stripLargeEmbedsToSidecars(dir, transferId, offerJson);
            File f = new File(dir, transferId + ".json");
            try (Writer w = new OutputStreamWriter(new FileOutputStream(f), StandardCharsets.UTF_8)) {
                w.write(offerJson.toString());
            }
            Log.i(TAG, "persisted offer transferId=" + transferId
                    + " jsonBytes=" + f.length());
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "persist OOM transferId=" + transferId + " — offer too large for JSON", oom);
        } catch (Exception e) {
            Log.w(TAG, "persist write failed transferId=" + transferId, e);
        }
    }

    /**
     * Move oversized {@code asset.data} into binary sidecars and replace with
     * {@code asset.sidecar} relative name under the pending-offers dir.
     */
    private static void stripLargeEmbedsToSidecars(File dir, String transferId, JSONObject offer)
            throws Exception {
        JSONArray batches = offer.optJSONArray("batches");
        if (batches == null) return;
        for (int i = 0; i < batches.length(); i++) {
            JSONObject batch = batches.optJSONObject(i);
            if (batch == null) continue;
            JSONObject asset = batch.optJSONObject("asset");
            if (asset == null) continue;
            String data = asset.optString("data", "");
            if (data == null || data.length() < SIDECAR_DATA_CHARS) continue;
            String batchId = batch.optString("batchId", "b" + i);
            String safeBatch = isSafeTransferId(batchId) ? batchId : ("b" + i);
            String sidecarName = transferId + "-" + safeBatch + ".bin";
            File sidecar = new File(dir, sidecarName);
            byte[] bytes = decodeBase64Payload(data);
            if (bytes == null || bytes.length == 0) {
                Log.w(TAG, "sidecar decode empty batch=" + batchId);
                continue;
            }
            try (FileOutputStream fos = new FileOutputStream(sidecar)) {
                fos.write(bytes);
            }
            asset.remove("data");
            asset.put("sidecar", sidecarName);
            asset.put("source", "sidecar");
            Log.i(TAG, "sidecar wrote " + sidecarName + " bytes=" + bytes.length);
        }
    }

    private static byte[] decodeBase64Payload(String data) {
        if (data == null || data.isEmpty()) return null;
        String b64 = data;
        int comma = data.indexOf(',');
        if (data.startsWith("data:") && comma > 0) {
            b64 = data.substring(comma + 1);
        }
        try {
            return Base64.decode(b64, Base64.DEFAULT);
        } catch (Exception e) {
            Log.w(TAG, "base64 decode failed", e);
            return null;
        }
    }

    /** Read without deleting (Accept may retry after partial write). */
    public static JSONObject peek(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return null;
        if (!isSafeTransferId(transferId)) return null;
        File f = new File(pendingDir(context), transferId + ".json");
        if (!f.exists()) return null;
        try {
            StringBuilder sb = new StringBuilder((int) Math.min(f.length() + 64, Integer.MAX_VALUE / 4));
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(new FileInputStream(f), StandardCharsets.UTF_8), 64 * 1024)) {
                String line;
                while ((line = br.readLine()) != null) sb.append(line).append('\n');
            }
            return new JSONObject(sb.toString());
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "peek OOM " + f, oom);
            return null;
        } catch (Exception e) {
            Log.w(TAG, "peek failed " + f, e);
            return null;
        }
    }

    /** Resolve a sidecar file name from {@link #pendingDir}. */
    public static File sidecarFile(Context context, String sidecarName) {
        if (context == null || sidecarName == null || sidecarName.isEmpty()) return null;
        String base = new File(sidecarName).getName();
        if (base.isEmpty() || base.contains("..") || base.length() > 220) return null;
        for (int i = 0; i < base.length(); i++) {
            char c = base.charAt(i);
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
                    || (c >= '0' && c <= '9') || c == '-' || c == '_' || c == '.') {
                continue;
            }
            return null;
        }
        File f = new File(pendingDir(context), base);
        return f.isFile() ? f : null;
    }

    /** Delete persisted offer + any {@code <tid>-*.bin} sidecars. */
    public static void delete(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return;
        if (!isSafeTransferId(transferId)) return;
        File dir = pendingDir(context);
        File f = new File(dir, transferId + ".json");
        try {
            if (f.exists() && !f.delete()) {
                Log.w(TAG, "delete failed " + f);
            }
        } catch (Exception e) {
            Log.w(TAG, "delete exception " + f, e);
        }
        File[] kids = dir.listFiles();
        if (kids == null) return;
        String prefix = transferId + "-";
        for (File kid : kids) {
            String n = kid.getName();
            if (n.startsWith(prefix) && n.endsWith(".bin")) {
                //noinspection ResultOfMethodCallIgnored
                kid.delete();
            }
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
