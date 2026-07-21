/*
 * Filename: FilesBlobStore.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesBlobStore.java
 * Change date and time: 18.50.00_21.07.2026
 * Reason for changes: Cap putBlob stub made large Cap→Cap / Cap→desk shares
 *   fail instantly. Persist batch bytes under files/blobs and serve via
 *   ControlApiServer GET /service/files-blob/:t/:b?token=.
 *
 * INVARIANT: transferId/batchId basename-safe; token required on GET.
 */
package emission;

import android.content.Context;
import android.util.Log;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.SecureRandom;
import java.util.Locale;

/**
 * App-private blob store for Capacitor files-hub putBlob.
 */
public final class FilesBlobStore {
    private static final String TAG = "emission.FilesBlobStore";
    private static final long TTL_MS = 30L * 60L * 1000L;
    private static final SecureRandom RNG = new SecureRandom();

    public static final class PutResult {
        public final boolean ok;
        public final String url;
        public final String error;
        public final String token;

        public PutResult(boolean ok, String url, String token, String error) {
            this.ok = ok;
            this.url = url != null ? url : "";
            this.token = token != null ? token : "";
            this.error = error != null ? error : "";
        }
    }

    public static final class GetResult {
        public final byte[] bytes;
        public final String mimeType;
        public final String name;

        public GetResult(byte[] bytes, String mimeType, String name) {
            this.bytes = bytes;
            this.mimeType = mimeType != null ? mimeType : "application/octet-stream";
            this.name = name != null ? name : "batch.bin";
        }
    }

    private FilesBlobStore() { /* no instances */ }

    public static boolean isSafeId(String id) {
        if (id == null || id.isEmpty() || id.length() > 128) return false;
        if (id.contains("..") || id.contains("/") || id.contains("\\")) return false;
        for (int i = 0; i < id.length(); i++) {
            char c = id.charAt(i);
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
                    || (c >= '0' && c <= '9') || c == '-' || c == '_' || c == '.') {
                continue;
            }
            return false;
        }
        return true;
    }

    public static PutResult put(
            Context context,
            String transferId,
            String batchId,
            byte[] bytes,
            String hash,
            String name,
            String mimeType,
            String publicBaseUrl
    ) {
        if (context == null || bytes == null) {
            return new PutResult(false, "", "", "no-context");
        }
        if (!isSafeId(transferId) || !isSafeId(batchId)) {
            return new PutResult(false, "", "", "bad-id");
        }
        try {
            File dir = new File(FilesStorage.resolveFilesBase(context), "blobs/" + transferId);
            if (!dir.exists() && !dir.mkdirs()) {
                return new PutResult(false, "", "", "mkdir-failed");
            }
            File bin = new File(dir, batchId + ".bin");
            try (FileOutputStream fos = new FileOutputStream(bin)) {
                fos.write(bytes);
            }
            String token = randomToken();
            JSONObject meta = new JSONObject();
            meta.put("transferId", transferId);
            meta.put("batchId", batchId);
            meta.put("hash", hash != null ? hash : "");
            meta.put("name", name != null ? name : batchId + ".bin");
            meta.put("mimeType", mimeType != null ? mimeType : "application/octet-stream");
            meta.put("size", bytes.length);
            meta.put("token", token);
            meta.put("expiresAt", System.currentTimeMillis() + TTL_MS);
            File metaFile = new File(dir, batchId + ".json");
            try (FileOutputStream fos = new FileOutputStream(metaFile)) {
                fos.write(meta.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
            }
            String base = publicBaseUrl != null ? publicBaseUrl.replaceAll("/+$", "") : "";
            if (base.isEmpty()) {
                return new PutResult(false, "", token, "no-public-base");
            }
            String url = base + "/service/files-blob/"
                    + transferId + "/" + batchId
                    + "?token=" + token;
            Log.i(TAG, "put ok transferId=" + transferId + " batchId=" + batchId
                    + " size=" + bytes.length);
            return new PutResult(true, url, token, "");
        } catch (Exception e) {
            Log.w(TAG, "put failed", e);
            return new PutResult(false, "", "", String.valueOf(e.getMessage()));
        }
    }

    public static GetResult get(Context context, String transferId, String batchId, String token) {
        if (context == null || !isSafeId(transferId) || !isSafeId(batchId)) return null;
        try {
            File dir = new File(FilesStorage.resolveFilesBase(context), "blobs/" + transferId);
            File metaFile = new File(dir, batchId + ".json");
            File bin = new File(dir, batchId + ".bin");
            if (!metaFile.exists() || !bin.exists()) return null;
            StringBuilder sb = new StringBuilder();
            try (FileInputStream fis = new FileInputStream(metaFile)) {
                byte[] buf = new byte[4096];
                int n;
                while ((n = fis.read(buf)) > 0) sb.append(new String(buf, 0, n, java.nio.charset.StandardCharsets.UTF_8));
            }
            JSONObject meta = new JSONObject(sb.toString());
            long expiresAt = meta.optLong("expiresAt", 0L);
            if (expiresAt > 0 && expiresAt < System.currentTimeMillis()) return null;
            String want = meta.optString("token", "");
            if (token == null || !token.equals(want)) return null;
            byte[] bytes = new byte[(int) bin.length()];
            try (FileInputStream fis = new FileInputStream(bin)) {
                int off = 0;
                while (off < bytes.length) {
                    int n = fis.read(bytes, off, bytes.length - off);
                    if (n < 0) break;
                    off += n;
                }
            }
            return new GetResult(
                    bytes,
                    meta.optString("mimeType", "application/octet-stream"),
                    meta.optString("name", batchId + ".bin")
            );
        } catch (Exception e) {
            Log.w(TAG, "get failed", e);
            return null;
        }
    }

    private static String randomToken() {
        byte[] b = new byte[16];
        RNG.nextBytes(b);
        StringBuilder sb = new StringBuilder(32);
        for (byte v : b) sb.append(String.format(Locale.US, "%02x", v));
        return sb.toString();
    }
}
