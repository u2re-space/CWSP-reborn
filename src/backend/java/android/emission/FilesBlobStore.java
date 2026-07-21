/*
 * Filename: FilesBlobStore.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesBlobStore.java
 * Change date and time: 21.50.00_21.07.2026
 * Reason for changes: Cap putBlob stub made large Cap→Cap / Cap→desk shares
 *   fail instantly. Persist batch bytes under files/blobs and serve via
 *   ControlApiServer GET /service/files-blob/:t/:b?token=.
 *   2026-07-21i: putFile + open() — hundreds-of-MiB shares must never
 *   allocate a full byte[] (Android heap / Contiguous allocation limit).
 *   2026-07-22: mirrorPutToGateway — Cap WAN shares PUT bytes to gateway
 *   `/files/blob` so receivers fetch a public URL instead of Cap LAN.
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
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.util.Locale;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import core.Configure;
import space.u2re.cwsp.SecureTokenStore;

/**
 * App-private blob store for Capacitor files-hub putBlob.
 */
public final class FilesBlobStore {
    private static final String TAG = "emission.FilesBlobStore";
    private static final long TTL_MS = 30L * 60L * 1000L;
    private static final SecureRandom RNG = new SecureRandom();
    /** Copy buffer — keep constant memory for 100–512 MiB blobs. */
    private static final int COPY_BUF = 64 * 1024;

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

    /**
     * Streaming open for HTTP GET. WHY: {@link #get} loads the whole bin into
     * RAM and OOMs on ~100+ MiB Cap→peer pulls.
     */
    public static final class OpenResult {
        public final File file;
        public final String mimeType;
        public final String name;
        public final long size;

        public OpenResult(File file, String mimeType, String name, long size) {
            this.file = file;
            this.mimeType = mimeType != null ? mimeType : "application/octet-stream";
            this.name = name != null ? name : "batch.bin";
            this.size = size;
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
            File dir = blobDir(context, transferId);
            if (dir == null) return new PutResult(false, "", "", "mkdir-failed");
            File bin = new File(dir, batchId + ".bin");
            try (FileOutputStream fos = new FileOutputStream(bin)) {
                fos.write(bytes);
            }
            return finishPut(dir, transferId, batchId, bin.length(), hash, name, mimeType, publicBaseUrl);
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "put OOM size=" + (bytes != null ? bytes.length : -1), oom);
            return new PutResult(false, "", "", "CWSP_FILES_OOM_HEAP");
        } catch (Exception e) {
            Log.w(TAG, "put failed", e);
            return new PutResult(false, "", "", String.valueOf(e.getMessage()));
        }
    }

    /**
     * Persist a staged file by streaming copy (constant memory).
     * WHY: Cap Share of 100–512 MiB must not allocate {@code new byte[size]}.
     */
    public static PutResult putFile(
            Context context,
            String transferId,
            String batchId,
            File source,
            String hash,
            String name,
            String mimeType,
            String publicBaseUrl
    ) {
        if (context == null || source == null || !source.isFile()) {
            return new PutResult(false, "", "", "no-source");
        }
        if (!isSafeId(transferId) || !isSafeId(batchId)) {
            return new PutResult(false, "", "", "bad-id");
        }
        try {
            File dir = blobDir(context, transferId);
            if (dir == null) return new PutResult(false, "", "", "mkdir-failed");
            File bin = new File(dir, batchId + ".bin");
            // Same path → already in blob store (rare); just write meta.
            if (!bin.getCanonicalFile().equals(source.getCanonicalFile())) {
                try (InputStream in = new FileInputStream(source);
                     OutputStream out = new FileOutputStream(bin)) {
                    byte[] buf = new byte[COPY_BUF];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                }
            }
            long size = bin.length();
            if (size <= 0) return new PutResult(false, "", "", "empty-blob");
            return finishPut(dir, transferId, batchId, size, hash, name, mimeType, publicBaseUrl);
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "putFile OOM", oom);
            return new PutResult(false, "", "", "CWSP_FILES_OOM_HEAP");
        } catch (Exception e) {
            Log.w(TAG, "putFile failed", e);
            return new PutResult(false, "", "", String.valueOf(e.getMessage()));
        }
    }

    private static File blobDir(Context context, String transferId) {
        File dir = new File(FilesStorage.resolveFilesBase(context), "blobs/" + transferId);
        if (!dir.exists() && !dir.mkdirs()) return null;
        return dir;
    }

    private static PutResult finishPut(
            File dir,
            String transferId,
            String batchId,
            long size,
            String hash,
            String name,
            String mimeType,
            String publicBaseUrl
    ) throws Exception {
        String token = randomToken();
        JSONObject meta = new JSONObject();
        meta.put("transferId", transferId);
        meta.put("batchId", batchId);
        meta.put("hash", hash != null ? hash : "");
        meta.put("name", name != null ? name : batchId + ".bin");
        meta.put("mimeType", mimeType != null ? mimeType : "application/octet-stream");
        meta.put("size", size);
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
                + " size=" + size + " streamed=true");
        return new PutResult(true, url, token, "");
    }

    /**
     * Token-validated open for streaming HTTP. Prefer over {@link #get}.
     */
    public static OpenResult open(Context context, String transferId, String batchId, String token) {
        if (context == null || !isSafeId(transferId) || !isSafeId(batchId)) return null;
        try {
            File dir = new File(FilesStorage.resolveFilesBase(context), "blobs/" + transferId);
            File metaFile = new File(dir, batchId + ".json");
            File bin = new File(dir, batchId + ".bin");
            if (!metaFile.exists() || !bin.exists() || !bin.isFile()) return null;
            StringBuilder sb = new StringBuilder();
            try (FileInputStream fis = new FileInputStream(metaFile)) {
                byte[] buf = new byte[4096];
                int n;
                while ((n = fis.read(buf)) > 0) {
                    sb.append(new String(buf, 0, n, java.nio.charset.StandardCharsets.UTF_8));
                }
            }
            JSONObject meta = new JSONObject(sb.toString());
            long expiresAt = meta.optLong("expiresAt", 0L);
            if (expiresAt > 0 && expiresAt < System.currentTimeMillis()) return null;
            String want = meta.optString("token", "");
            if (token == null || !token.equals(want)) return null;
            long size = meta.optLong("size", bin.length());
            if (size <= 0) size = bin.length();
            return new OpenResult(
                    bin,
                    meta.optString("mimeType", "application/octet-stream"),
                    meta.optString("name", batchId + ".bin"),
                    size
            );
        } catch (Exception e) {
            Log.w(TAG, "open failed", e);
            return null;
        }
    }

    /** COMPAT: small blobs only — loads entire file into RAM. Prefer {@link #open}. */
    public static GetResult get(Context context, String transferId, String batchId, String token) {
        OpenResult open = open(context, transferId, batchId, token);
        if (open == null) return null;
        try {
            // SECURITY/PERF: refuse to heap-load oversized bins via legacy get().
            if (open.size > 8L * 1024L * 1024L) {
                Log.w(TAG, "get refused large blob size=" + open.size + " — use open()");
                return null;
            }
            byte[] bytes = new byte[(int) open.file.length()];
            try (FileInputStream fis = new FileInputStream(open.file)) {
                int off = 0;
                while (off < bytes.length) {
                    int n = fis.read(bytes, off, bytes.length - off);
                    if (n < 0) break;
                    off += n;
                }
            }
            return new GetResult(bytes, open.mimeType, open.name);
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "get OOM", oom);
            return null;
        } catch (Exception e) {
            Log.w(TAG, "get failed", e);
            return null;
        }
    }

    /**
     * PUT local blob bytes to the CWSP gateway `/files/blob` so WAN peers can
     * HTTP-GET a public URL. Uses the Cap client token as uploadSecret (matches
     * gateway {@code CWS_ASSOCIATED_TOKEN} / {@code CWS_FILES_BLOB_SECRET}).
     *
     * @return gateway URL+token on success; otherwise {@code local} unchanged
     */
    public static PutResult mirrorPutToGateway(
            Context context,
            String transferId,
            String batchId,
            File source,
            String mimeType,
            String gatewayBase,
            PutResult local
    ) {
        if (context == null || source == null || !source.isFile()
                || gatewayBase == null || gatewayBase.isEmpty()
                || !isSafeId(transferId) || !isSafeId(batchId)) {
            return local != null ? local : new PutResult(false, "", "", "bad-mirror-args");
        }
        String base = gatewayBase.replaceAll("/+$", "");
        String uploadSecret = null;
        try {
            uploadSecret = new SecureTokenStore(context.getApplicationContext()).getToken();
        } catch (Exception e) {
            Log.w(TAG, "mirror: token read failed", e);
        }
        if (uploadSecret == null || uploadSecret.isEmpty()) {
            Log.w(TAG, "mirror: no client token — keep local URL");
            return local != null ? local : new PutResult(false, "", "", "no-token");
        }
        HttpURLConnection conn = null;
        try {
            URL url = new URL(base + "/files/blob/"
                    + java.net.URLEncoder.encode(transferId, "UTF-8")
                    + "/"
                    + java.net.URLEncoder.encode(batchId, "UTF-8"));
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(12_000);
            conn.setReadTimeout(180_000);
            conn.setDoOutput(true);
            conn.setRequestMethod("PUT");
            // INVARIANT: Fastify files router only registers application/octet-stream
            // as a raw buffer parser — other mime types yield empty body / 401 path.
            conn.setRequestProperty("Content-Type", "application/octet-stream");
            if (mimeType != null && !mimeType.isEmpty()) {
                conn.setRequestProperty("X-CWSP-Files-Mime", mimeType);
            }
            conn.setRequestProperty("X-CWSP-Files-Upload-Secret", uploadSecret);
            conn.setFixedLengthStreamingMode(source.length());
            if (conn instanceof HttpsURLConnection) {
                // COMPAT: gateway may use LAN/self-signed certs (same as APK update).
                applyInsecureTls((HttpsURLConnection) conn);
            }
            try (InputStream in = new FileInputStream(source);
                 OutputStream out = conn.getOutputStream()) {
                byte[] buf = new byte[COPY_BUF];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                out.flush();
            }
            int code = conn.getResponseCode();
            InputStream respStream = code >= 200 && code < 300
                    ? conn.getInputStream()
                    : conn.getErrorStream();
            String body = readUtf8Limited(respStream, 8192);
            if (code < 200 || code >= 300) {
                Log.w(TAG, "mirror PUT failed code=" + code + " body=" + body);
                return local != null ? local : new PutResult(false, "", "", "http-" + code);
            }
            String token = "";
            try {
                JSONObject j = new JSONObject(body != null ? body : "{}");
                token = j.optString("token", "");
            } catch (Exception ignored) { /* */ }
            if (token.isEmpty()) {
                Log.w(TAG, "mirror PUT ok but no token in body");
                return local != null ? local : new PutResult(false, "", "", "no-token-resp");
            }
            String publicUrl = base + "/files/blob/" + transferId + "/" + batchId
                    + "?token=" + token;
            Log.i(TAG, "mirror PUT ok size=" + source.length() + " url=" + publicUrl);
            return new PutResult(true, publicUrl, token, "");
        } catch (Exception e) {
            Log.w(TAG, "mirror PUT exception — keep local URL", e);
            return local != null ? local : new PutResult(false, "", "", String.valueOf(e.getMessage()));
        } finally {
            if (conn != null) try { conn.disconnect(); } catch (Exception ignored) { /* */ }
        }
    }

    /** True when {@code base} looks like the CWSP gateway (LAN .200 or WAN entry). */
    public static boolean isGatewayBlobBase(String base) {
        if (base == null || base.isEmpty()) return false;
        String b = base.toLowerCase(Locale.US);
        return b.contains("192.168.0.200")
                || b.contains("45.147.121.152")
                || b.contains("://192.168.0.200")
                || b.contains("l-192.168.0.200");
    }

    /**
     * Prefer gateway HTTPS base from Cap endpoint prefs when sharing via coordinator.
     * WHY: Cap LAN {@code http://192.168.0.210:8434} is unreachable from LTE/WAN peers.
     */
    public static String resolveGatewayBlobBase(Context context) {
        if (context == null) return null;
        try {
            String endpoint = Configure.readEndpoint(context);
            if (endpoint == null || endpoint.trim().isEmpty()) return null;
            String e = endpoint.trim();
            if (e.endsWith("/")) e = e.substring(0, e.length() - 1);
            String lower = e.toLowerCase(Locale.US);
            boolean isGw = lower.contains("192.168.0.200")
                    || lower.contains("45.147.121.152");
            if (!isGw) return null;
            if (lower.startsWith("wss://")) e = "https://" + e.substring("wss://".length());
            else if (lower.startsWith("ws://")) e = "http://" + e.substring("ws://".length());
            else if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
                e = "https://" + e;
            }
            // Strip /ws path if present.
            int ws = e.toLowerCase(Locale.US).indexOf("/ws");
            if (ws > 0) e = e.substring(0, ws);
            if (e.endsWith("/")) e = e.substring(0, e.length() - 1);
            return e;
        } catch (Exception ex) {
            Log.w(TAG, "resolveGatewayBlobBase failed", ex);
            return null;
        }
    }

    private static void applyInsecureTls(HttpsURLConnection conn) {
        try {
            TrustManager[] trustAll = new TrustManager[]{
                    new X509TrustManager() {
                        public void checkClientTrusted(java.security.cert.X509Certificate[] c, String a) { }
                        public void checkServerTrusted(java.security.cert.X509Certificate[] c, String a) { }
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new java.security.cert.X509Certificate[0];
                        }
                    }
            };
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAll, new SecureRandom());
            conn.setSSLSocketFactory(sc.getSocketFactory());
            HostnameVerifier allHosts = (hostname, session) -> true;
            conn.setHostnameVerifier(allHosts);
        } catch (Exception e) {
            Log.w(TAG, "applyInsecureTls failed", e);
        }
    }

    private static String readUtf8Limited(InputStream in, int max) {
        if (in == null) return "";
        try {
            byte[] buf = new byte[Math.min(max, 4096)];
            StringBuilder sb = new StringBuilder();
            int total = 0;
            int n;
            while (total < max && (n = in.read(buf, 0, Math.min(buf.length, max - total))) > 0) {
                sb.append(new String(buf, 0, n, java.nio.charset.StandardCharsets.UTF_8));
                total += n;
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
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
