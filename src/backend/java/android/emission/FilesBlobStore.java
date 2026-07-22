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
 *   2026-07-22d: abortable mirror PUT + progress sink; deleteTransfer for Abort.
 *   2026-07-22i: isGatewayBlobBase accepts any public relay host (not only
 *   historical WAN IP); resolveWanGatewayHost never returns RFC1918 peers.
 *   2026-07-22l: mirror PUT — short connect on private hosts, 1× retry,
 *   progress flush; WAN-stable uploads from LTE.
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
        /**
         * Optional peer/LAN control URL retained after gateway mirror so Accept
         * can prefer P2P before gateway LAN/WAN.
         */
        public final String peerUrl;

        public PutResult(boolean ok, String url, String token, String error) {
            this(ok, url, token, error, "");
        }

        public PutResult(boolean ok, String url, String token, String error, String peerUrl) {
            this.ok = ok;
            this.url = url != null ? url : "";
            this.token = token != null ? token : "";
            this.error = error != null ? error : "";
            this.peerUrl = peerUrl != null ? peerUrl : "";
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
        return putFile(context, transferId, batchId, source, hash, name, mimeType, publicBaseUrl, null);
    }

    public static PutResult putFile(
            Context context,
            String transferId,
            String batchId,
            File source,
            String hash,
            String name,
            String mimeType,
            String publicBaseUrl,
            UploadProgress progress
    ) {
        if (context == null || source == null || !source.isFile()) {
            return new PutResult(false, "", "", "no-source");
        }
        if (!isSafeId(transferId) || !isSafeId(batchId)) {
            return new PutResult(false, "", "", "bad-id");
        }
        try {
            if (FilesTransferControl.isAborted(transferId)) {
                return new PutResult(false, "", "", "CWSP_FILES_ABORTED");
            }
            File dir = blobDir(context, transferId);
            if (dir == null) return new PutResult(false, "", "", "mkdir-failed");
            File bin = new File(dir, batchId + ".bin");
            long total = source.length();
            // Same path → already in blob store (rare); just write meta.
            if (!bin.getCanonicalFile().equals(source.getCanonicalFile())) {
                try (InputStream in = new FileInputStream(source);
                     OutputStream out = new FileOutputStream(bin)) {
                    byte[] buf = new byte[COPY_BUF];
                    int n;
                    long copied = 0L;
                    while ((n = in.read(buf)) > 0) {
                        FilesTransferControl.throwIfAborted(transferId);
                        out.write(buf, 0, n);
                        copied += n;
                        if (progress != null) progress.onBytes(copied, total);
                    }
                }
            } else if (progress != null && total > 0) {
                progress.onBytes(total, total);
            }
            long size = bin.length();
            if (size <= 0) return new PutResult(false, "", "", "empty-blob");
            return finishPut(dir, transferId, batchId, size, hash, name, mimeType, publicBaseUrl);
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "putFile OOM", oom);
            return new PutResult(false, "", "", "CWSP_FILES_OOM_HEAP");
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("CWSP_FILES_ABORTED")) {
                return new PutResult(false, "", "", "CWSP_FILES_ABORTED");
            }
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
    /** Optional byte progress for gateway mirror / large PUT. */
    public interface UploadProgress {
        void onBytes(long uploadedInThisPut, long putTotal);
    }

    public static PutResult mirrorPutToGateway(
            Context context,
            String transferId,
            String batchId,
            File source,
            String mimeType,
            String gatewayBase,
            PutResult local
    ) {
        return mirrorPutToGateway(context, transferId, batchId, source, mimeType, gatewayBase, local, null);
    }

    public static PutResult mirrorPutToGateway(
            Context context,
            String transferId,
            String batchId,
            File source,
            String mimeType,
            String gatewayBase,
            PutResult local,
            UploadProgress progress
    ) {
        if (context == null || source == null || !source.isFile()
                || gatewayBase == null || gatewayBase.isEmpty()
                || !isSafeId(transferId) || !isSafeId(batchId)) {
            return local != null ? local : new PutResult(false, "", "", "bad-mirror-args");
        }
        if (FilesTransferControl.isAborted(transferId)) {
            return local != null ? local : new PutResult(false, "", "", "CWSP_FILES_ABORTED");
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
        // WHY (WAN/WAN stability): one quick retry on transient IO/5xx — LTE flaps
        // and gateway restarts otherwise look like random "failed" mid-bar.
        PutResult last = null;
        for (int attempt = 0; attempt < 2; attempt++) {
            if (FilesTransferControl.isAborted(transferId)) {
                return new PutResult(false, "", "", "CWSP_FILES_ABORTED");
            }
            if (attempt > 0) {
                Log.i(TAG, "mirror PUT retry attempt=" + attempt + " base=" + base);
                try { Thread.sleep(400L * attempt); } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
            last = mirrorPutToGatewayOnce(
                    context, transferId, batchId, source, mimeType, base, uploadSecret,
                    local, progress);
            if (last != null && last.ok) return last;
            if (last != null && "CWSP_FILES_ABORTED".equals(last.error)) return last;
            // Retry only transport-ish failures (not auth / bad-args).
            String err = last != null ? String.valueOf(last.error) : "";
            boolean retryable = err.startsWith("http-5")
                    || err.contains("Timeout")
                    || err.contains("timeout")
                    || err.contains("ConnectException")
                    || err.contains("SocketException")
                    || err.contains("SSL")
                    || err.contains("UnknownHost")
                    || err.contains("ECONNRESET")
                    || err.contains("Broken pipe");
            if (!retryable) break;
        }
        return last != null ? last : (local != null ? local : new PutResult(false, "", "", "mirror-failed"));
    }

    private static PutResult mirrorPutToGatewayOnce(
            Context context,
            String transferId,
            String batchId,
            File source,
            String mimeType,
            String base,
            String uploadSecret,
            PutResult local,
            UploadProgress progress
    ) {
        HttpURLConnection conn = null;
        try {
            URL url = new URL(base + "/files/blob/"
                    + java.net.URLEncoder.encode(transferId, "UTF-8")
                    + "/"
                    + java.net.URLEncoder.encode(batchId, "UTF-8"));
            conn = (HttpURLConnection) url.openConnection();
            String host = url.getHost();
            // WHY: unreachable .200 from LTE must fail in ~3s, not freeze the bar for 12s+.
            int connectMs = isPrivateLanHost(host) || isLanGatewayHost(host) ? 3_000 : 15_000;
            conn.setConnectTimeout(connectMs);
            long total = source.length();
            // WHY: hundreds-of-MiB WAN mirror needs more than 180s on slow LTE.
            long readTimeoutMs = total > 64L * 1024L * 1024L
                    ? Math.min(1_800_000L, Math.max(300_000L, (total / 50_000L) * 1000L + 120_000L))
                    : 180_000L;
            conn.setReadTimeout((int) readTimeoutMs);
            conn.setDoOutput(true);
            conn.setRequestMethod("PUT");
            // INVARIANT: Fastify files router only registers application/octet-stream
            // as a raw buffer parser — other mime types yield empty body / 401 path.
            conn.setRequestProperty("Content-Type", "application/octet-stream");
            if (mimeType != null && !mimeType.isEmpty()) {
                conn.setRequestProperty("X-CWSP-Files-Mime", mimeType);
            }
            conn.setRequestProperty("X-CWSP-Files-Upload-Secret", uploadSecret);
            conn.setFixedLengthStreamingMode(total);
            if (conn instanceof HttpsURLConnection) {
                // COMPAT: gateway may use LAN/self-signed certs (same as APK update).
                applyInsecureTls((HttpsURLConnection) conn);
            }
            FilesTransferControl.bindConnection(transferId, conn);
            try (InputStream in = new FileInputStream(source);
                 OutputStream out = conn.getOutputStream()) {
                byte[] buf = new byte[COPY_BUF];
                int n;
                long uploaded = 0L;
                long lastProgress = 0L;
                while ((n = in.read(buf)) > 0) {
                    FilesTransferControl.throwIfAborted(transferId);
                    out.write(buf, 0, n);
                    uploaded += n;
                    // Throttle UI callbacks (~256 KiB) so NotificationManager does not stall the PUT.
                    if (progress != null && (uploaded - lastProgress >= 256L * 1024L || uploaded >= total)) {
                        lastProgress = uploaded;
                        progress.onBytes(uploaded, total);
                    }
                }
                out.flush();
                if (progress != null && uploaded > 0) {
                    progress.onBytes(uploaded, total);
                }
            }
            int code = conn.getResponseCode();
            InputStream respStream = code >= 200 && code < 300
                    ? conn.getInputStream()
                    : conn.getErrorStream();
            String body = readUtf8Limited(respStream, 8192);
            if (code < 200 || code >= 300) {
                Log.w(TAG, "mirror PUT failed code=" + code + " body=" + body + " base=" + base);
                return new PutResult(false, "", "", "http-" + code);
            }
            String token = "";
            try {
                JSONObject j = new JSONObject(body != null ? body : "{}");
                token = j.optString("token", "");
            } catch (Exception ignored) { /* */ }
            if (token.isEmpty()) {
                Log.w(TAG, "mirror PUT ok but no token in body");
                return new PutResult(false, "", "", "no-token-resp");
            }
            String publicUrl = base + "/files/blob/" + transferId + "/" + batchId
                    + "?token=" + java.net.URLEncoder.encode(token, "UTF-8");
            Log.i(TAG, "mirror PUT ok size=" + source.length() + " url=" + publicUrl);
            return new PutResult(true, publicUrl, token, "");
        } catch (Exception e) {
            if (FilesTransferControl.isAborted(transferId)
                    || (e.getMessage() != null && e.getMessage().contains("CWSP_FILES_ABORTED"))) {
                return new PutResult(false, "", "", "CWSP_FILES_ABORTED");
            }
            String msg = e.getClass().getSimpleName() + ":" + e.getMessage();
            Log.w(TAG, "mirror PUT exception base=" + base + " err=" + msg, e);
            return new PutResult(false, "", "", msg);
        } finally {
            if (conn != null) {
                FilesTransferControl.unbindConnection(transferId, conn);
                try { conn.disconnect(); } catch (Exception ignored) { /* */ }
            }
        }
    }

    /**
     * Ordered gateway bases for Cap mirror PUT: public WAN first (LTE-safe),
     * then LAN .200. Avoids freezing Uploading on unreachable private hosts.
     */
    public static java.util.List<String> resolveMirrorBases(Context context, String preferredBase) {
        java.util.LinkedHashSet<String> out = new java.util.LinkedHashSet<>();
        String wan = resolveWanGatewayHttpsBase(context);
        if (wan != null && !wan.isEmpty() && isGatewayBlobBase(wan)) {
            out.add(wan.replaceAll("/+$", ""));
        }
        if (preferredBase != null && !preferredBase.isEmpty() && isGatewayBlobBase(preferredBase)) {
            out.add(preferredBase.replaceAll("/+$", ""));
        }
        String lan = "https://" + LAN_GATEWAY_HOST + ":8434";
        if (isGatewayBlobBase(lan)) out.add(lan);
        return new java.util.ArrayList<>(out);
    }

    /** Drop local blob dir so peer HTTP GET fails after sender Abort. */
    public static void deleteTransfer(Context context, String transferId) {
        if (context == null || !isSafeId(transferId)) return;
        try {
            File dir = new File(FilesStorage.resolveFilesBase(context), "blobs/" + transferId);
            deleteRecursively(dir);
        } catch (Exception e) {
            Log.w(TAG, "deleteTransfer failed tid=" + transferId, e);
        }
    }

    private static void deleteRecursively(File f) {
        if (f == null || !f.exists()) return;
        if (f.isDirectory()) {
            File[] kids = f.listFiles();
            if (kids != null) {
                for (File k : kids) deleteRecursively(k);
            }
        }
        //noinspection ResultOfMethodCallIgnored
        f.delete();
    }

    /** Last-resort fleet WAN host (historical VPS). Prefer Cap endpoint/relay prefs. */
    public static final String WAN_GATEWAY_HOST_FALLBACK = "45.147.121.152";
    public static final String LAN_GATEWAY_HOST = "192.168.0.200";

    /**
     * True when {@code base} is a valid gateway/relay blob host.
     * WHY: must accept any configured public relay — not only the historical
     * {@link #WAN_GATEWAY_HOST_FALLBACK} (softcoded endpoint broke mirror).
     */
    public static boolean isGatewayBlobBase(String base) {
        if (base == null || base.isEmpty()) return false;
        String e = normalizeHttpsBase(base);
        String host = hostOf(e);
        if (host.isEmpty()) return false;
        if (isLanGatewayHost(host)) return true;
        // Any non-private host is a valid WAN/relay mirror target.
        return !isPrivateLanHost(host);
    }

    /**
     * Prefer gateway HTTPS base from Cap endpoint prefs when sharing via coordinator.
     * WHY: Cap LAN {@code http://192.168.0.210:8434} is unreachable from LTE/WAN peers.
     * Uses configured relay/endpoint (any public host), not only the historical WAN IP.
     * Falls back to {@link #resolveWanGatewayHttpsBase} when endpoint is a peer LAN.
     */
    public static String resolveGatewayBlobBase(Context context) {
        if (context == null) return resolveWanGatewayHttpsBase(null);
        try {
            String endpoint = Configure.readEndpoint(context);
            String e = normalizeHttpsBase(endpoint);
            if (e == null || e.isEmpty()) return resolveWanGatewayHttpsBase(context);
            String host = hostOf(e);
            if (host.isEmpty()) return resolveWanGatewayHttpsBase(context);
            if (isLanGatewayHost(host)) return e;
            // Reject private peer LANs — mirror target must be coordinator/relay.
            if (isPrivateLanHost(host)) {
                return resolveWanGatewayHttpsBase(context);
            }
            return e;
        } catch (Exception ex) {
            Log.w(TAG, "resolveGatewayBlobBase failed", ex);
            return resolveWanGatewayHttpsBase(context);
        }
    }

    /**
     * WAN gateway hostname: configured Cap endpoint/relay host when public,
     * else {@link #WAN_GATEWAY_HOST_FALLBACK}.
     * INVARIANT: never returns RFC1918 / loopback (desk .110 must not become "WAN").
     */
    public static String resolveWanGatewayHost(Context context) {
        try {
            if (context != null) {
                String endpoint = Configure.readEndpoint(context);
                String e = normalizeHttpsBase(endpoint);
                String host = hostOf(e);
                if (!host.isEmpty() && !isLanGatewayHost(host) && !isPrivateLanHost(host)) {
                    return host;
                }
            }
        } catch (Exception ignored) { /* */ }
        return WAN_GATEWAY_HOST_FALLBACK;
    }

    public static String resolveWanGatewayHttpsBase(Context context) {
        String host = resolveWanGatewayHost(context);
        if (host == null || host.isEmpty()) host = WAN_GATEWAY_HOST_FALLBACK;
        try {
            if (context != null) {
                String endpoint = Configure.readEndpoint(context);
                String e = normalizeHttpsBase(endpoint);
                String eh = hostOf(e);
                if (!eh.isEmpty() && eh.equalsIgnoreCase(host)) return e;
            }
        } catch (Exception ignored) { /* */ }
        return "https://" + host + ":8434";
    }

    /** RFC1918 / loopback — not a WAN relay. */
    public static boolean isPrivateLanHost(String host) {
        if (host == null || host.isEmpty()) return true;
        String h = host.trim().toLowerCase(Locale.US);
        if ("localhost".equals(h) || h.startsWith("127.")) return true;
        if (h.startsWith("10.")) return true;
        if (h.startsWith("192.168.")) return true;
        if (h.startsWith("172.")) {
            // 172.16.0.0 – 172.31.255.255
            try {
                String[] p = h.split("\\.");
                if (p.length >= 2) {
                    int second = Integer.parseInt(p[1]);
                    if (second >= 16 && second <= 31) return true;
                }
            } catch (Exception ignored) { /* */ }
        }
        return false;
    }

    public static boolean isLanGatewayHost(String host) {
        if (host == null) return false;
        String h = host.trim().toLowerCase(Locale.US);
        return LAN_GATEWAY_HOST.equals(h)
                || "l-192.168.0.200".equals(h)
                || "l-200".equals(h);
    }

    public static boolean isWanGatewayHost(Context context, String host) {
        if (host == null || host.isEmpty()) return false;
        String h = host.trim().toLowerCase(Locale.US);
        if (WAN_GATEWAY_HOST_FALLBACK.equals(h)) return true;
        return h.equals(resolveWanGatewayHost(context).toLowerCase(Locale.US));
    }

    private static String normalizeHttpsBase(String endpoint) {
        if (endpoint == null) return null;
        String e = endpoint.trim();
        if (e.isEmpty()) return null;
        if (e.endsWith("/")) e = e.substring(0, e.length() - 1);
        String lower = e.toLowerCase(Locale.US);
        if (lower.startsWith("wss://")) e = "https://" + e.substring("wss://".length());
        else if (lower.startsWith("ws://")) e = "http://" + e.substring("ws://".length());
        else if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
            e = "https://" + e;
        }
        int ws = e.toLowerCase(Locale.US).indexOf("/ws");
        if (ws > 0) e = e.substring(0, ws);
        if (e.endsWith("/")) e = e.substring(0, e.length() - 1);
        return e;
    }

    private static String hostOf(String base) {
        if (base == null || base.isEmpty()) return "";
        try {
            java.net.URI u = java.net.URI.create(base);
            return u.getHost() != null ? u.getHost().toLowerCase(Locale.US) : "";
        } catch (Exception e) {
            return "";
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
