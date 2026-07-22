/*
 * Filename: ControlApiServer.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlApiServer.java
 * Change date and time: 21.15.00_20.07.2026
 * Reason for changes: Hidden Android Control API (PNA) — GET|POST /service/config on :8434
 *   for public /cwsp SPA; gated by shell.allowControlApi.
 *   2026-07-20: Prefer Configure.endpointOrigin over blob/SPA-poisoned core.endpointUrl.
 *   2026-07-20: Pairing attestation — public SPA uses X-Control-Session after Accept;
 *     ecosystem token never authorizes https://* Control clones.
 *   2026-07-20: pair/begin requires live 20s rotating deviceCode (ControlRotatingCode).
 *   2026-07-20: CORS Allow-Headers parity with Neutralino (X-Skip-Legacy-Key, X-Control-Origin)
 *     so https://cwsp.u2re.space Save preflight succeeds after pair.
 *   2026-07-21: keepForFilesBlob — Cap↔Cap 50MB+ APK HTTP pulls must not lose :8434
 *     when syncFromSettings sees allowControlApi=false.
 *   2026-07-21i: stream files-blob GET from disk (no full-byte[] for 100–512 MiB).
 *   2026-07-22h: files-blob GET reports byte progress to outgoing transfer notif.
 *   2026-07-22q: pass clientIp into outgoing progress so multi-peer Sending bars
 *   attribute Cap Control GET to the right peer (not only soleDownloadingPeer).
 */

package space.u2re.cwsp;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import core.Configure;
import core.Settings;

/**
 * Minimal cleartext HTTP control host for Capacitor/Android.
 *
 * <p>SECURITY: public Control SPA must complete device pairing (Accept notification).
 * Ecosystem token authorizes only loopback/Capacitor same-device clients — never arbitrary
 * {@code https://*} origins (blocks cloned cwsp.u2re.space stealers).</p>
 */
public final class ControlApiServer implements AutoCloseable {
    private static final String TAG = "ControlApiServer";

    public static final int DEFAULT_PORT = 8434;

    private static final Set<String> DEFAULT_ALLOWED_ORIGINS = new LinkedHashSet<>(Arrays.asList(
            "https://cwsp.u2re.space",
            "https://www.cwsp.u2re.space",
            "https://md.u2re.space",
            "https://www.md.u2re.space"
    ));

    private static volatile ControlApiServer INSTANCE;

    private final Context appContext;
    private final int port;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private ServerSocket serverSocket;
    private ExecutorService acceptPool;
    private ExecutorService workerPool;

    private ControlApiServer(Context context, int port) {
        this.appContext = context.getApplicationContext();
        this.port = port > 0 ? port : DEFAULT_PORT;
    }

    public static boolean isListening() {
        ControlApiServer s = INSTANCE;
        return s != null && s.running.get();
    }

    public static int listeningPort() {
        ControlApiServer s = INSTANCE;
        return s != null && s.running.get() ? s.port : 0;
    }

    /** WHY: Cap↔Cap large APK pulls need :8434 even when shell.allowControlApi is false. */
    private static volatile boolean keepForFilesBlob = false;

    public static synchronized void syncFromSettings(Context context) {
        if (context == null) return;
        boolean allow = Configure.readAllowControlApi(context);
        if (allow) {
            ensureControlKey(context);
            start(context, DEFAULT_PORT);
        } else if (!keepForFilesBlob) {
            // WHY: do not stop a server that putBlob opened for Cap↔Cap HTTP pulls.
            stop();
        } else if (!isListening()) {
            ensureControlKey(context);
            start(context, DEFAULT_PORT);
        }
    }

    /**
     * Start Control :8434 for files-blob GET even when allowControlApi is off.
     * WHY: Cap putBlob URLs must be reachable for Cap↔Cap / Cap→desk large pulls.
     * INVARIANT: does not stop an already-running server; survives syncFromSettings
     * while {@code keepForFilesBlob} is set (TTL of staged blobs ~30m).
     */
    public static synchronized void ensureListening(Context context) {
        if (context == null) return;
        keepForFilesBlob = true;
        if (isListening()) return;
        ensureControlKey(context);
        start(context, DEFAULT_PORT);
    }

    private static void ensureControlKey(Context context) {
        // WHY: pairing uses Control public token (regenerable), not ecosystem WS token.
        ControlPublicToken.ensure(context);
    }

    public static synchronized void start(Context context, int port) {
        if (context == null) return;
        if (INSTANCE != null && INSTANCE.running.get() && INSTANCE.port == port) {
            return;
        }
        stop();
        ControlApiServer next = new ControlApiServer(context, port);
        try {
            next.bindAndServe();
            INSTANCE = next;
            Log.i(TAG, "listening 0.0.0.0:" + next.port + " /service/* (pairing)");
        } catch (Exception e) {
            Log.e(TAG, "failed to bind control API on :" + port, e);
            next.closeQuietly();
            INSTANCE = null;
        }
    }

    public static synchronized void stop() {
        ControlApiServer prev = INSTANCE;
        INSTANCE = null;
        ControlPairStore.revokeAll();
        if (prev != null) {
            prev.closeQuietly();
            Log.i(TAG, "stopped");
        }
    }

    private void bindAndServe() throws IOException {
        serverSocket = new ServerSocket();
        serverSocket.setReuseAddress(true);
        serverSocket.bind(new InetSocketAddress("0.0.0.0", port));
        serverSocket.setSoTimeout(1000);
        running.set(true);
        acceptPool = Executors.newSingleThreadExecutor(r -> {
            Thread t = new Thread(r, "cwsp-control-accept");
            t.setDaemon(true);
            return t;
        });
        workerPool = Executors.newCachedThreadPool(r -> {
            Thread t = new Thread(r, "cwsp-control-worker");
            t.setDaemon(true);
            return t;
        });
        acceptPool.execute(this::acceptLoop);
    }

    private void acceptLoop() {
        while (running.get()) {
            try {
                Socket socket = serverSocket.accept();
                workerPool.execute(() -> handleClient(socket));
            } catch (SocketTimeoutException ignored) {
                /* periodic wake */
            } catch (Exception e) {
                if (running.get()) {
                    Log.w(TAG, "accept failed", e);
                }
            }
        }
    }

    private void handleClient(Socket socket) {
        String clientIp = "";
        try (Socket s = socket) {
            try {
                if (s.getInetAddress() != null) clientIp = s.getInetAddress().getHostAddress();
            } catch (Exception ignored) {
                /* ignore */
            }
            s.setSoTimeout(8000);
            InputStream in = s.getInputStream();
            OutputStream out = s.getOutputStream();

            HttpRequest req = HttpRequest.parse(in);
            if (req == null) {
                writeResponse(out, 400, "{\"error\":\"Bad request\"}", null);
                return;
            }

            String path = req.path;
            String method = req.method;
            String origin = req.header("origin");

            if ("OPTIONS".equals(method)) {
                if (!corsAllows(origin)) {
                    writeResponse(out, 403, "{\"error\":\"Origin not allowed\"}", denyCorsHeaders());
                    return;
                }
                writeResponse(out, 204, "", pnaHeaders(origin));
                return;
            }

            // --- pairing / discovery (no session) ---
            if ("/service/pair/hello".equals(path) && ("GET".equals(method) || "HEAD".equals(method))) {
                if (!corsAllows(origin) && !isLoopbackOrCapacitorOrigin(origin) && origin != null && !origin.isBlank()) {
                    writeResponse(out, 403, "{\"error\":\"Origin not allowed\"}", denyCorsHeaders());
                    return;
                }
                JSONObject payload = new JSONObject();
                payload.put("ok", true);
                payload.put("pairing", true);
                payload.put("deviceCodePeriodMs", ControlRotatingCode.PERIOD_MS);
                payload.put("control", controlMeta());
                writeResponse(out, 200, "HEAD".equals(method) ? "" : payload.toString(), pnaHeaders(origin));
                return;
            }

            if ("/service/pair/begin".equals(path) && "POST".equals(method)) {
                if (!corsAllows(origin)) {
                    writeResponse(out, 403, "{\"error\":\"Origin not allowed\"}", denyCorsHeaders());
                    return;
                }
                if (!ControlPairStore.allowBegin(clientIp)) {
                    writeResponse(out, 429, "{\"error\":\"Too many pair attempts\"}", pnaHeaders(origin));
                    return;
                }
                String bodyOrigin = origin;
                String clientLabel = "";
                String deviceCode = "";
                String publicToken = "";
                try {
                    if (!req.body.isBlank()) {
                        JSONObject body = new JSONObject(req.body);
                        String o = body.optString("origin", "").trim();
                        if (!o.isEmpty()) bodyOrigin = o;
                        clientLabel = body.optString("clientLabel", "").trim();
                        deviceCode = body.optString("deviceCode", body.optString("code", "")).trim();
                        publicToken = body.optString("publicToken", body.optString("controlPublicToken", "")).trim();
                    }
                } catch (Exception ignored) {
                    /* ignore */
                }
                if (bodyOrigin == null || bodyOrigin.isBlank()) {
                    writeResponse(out, 400, "{\"error\":\"origin required\"}", pnaHeaders(origin));
                    return;
                }
                if (!corsAllows(bodyOrigin)) {
                    writeResponse(out, 403, "{\"error\":\"Origin not allowed\"}", pnaHeaders(origin));
                    return;
                }
                // INVARIANT: request Origin header must match body origin when both present.
                if (origin != null && !origin.isBlank() && !ControlPairStore.originsEqual(origin, bodyOrigin)) {
                    writeResponse(out, 403, "{\"error\":\"Origin mismatch\"}", pnaHeaders(origin));
                    return;
                }
                // SECURITY: publicToken (stable) + live 20s deviceCode — never ecosystem WS token.
                ControlPublicToken.ensure(appContext);
                if (!ControlPublicToken.matches(appContext, publicToken)) {
                    writeResponse(out, 403, "{\"error\":\"Invalid public token\"}", pnaHeaders(origin));
                    return;
                }
                if (!ControlRotatingCode.verify(appContext, deviceCode)) {
                    writeResponse(out, 403, "{\"error\":\"Invalid or expired device code\"}", pnaHeaders(origin));
                    return;
                }
                ControlPairStore.PairRequest pair = ControlPairStore.begin(bodyOrigin, clientLabel);
                ControlPairUi.prompt(appContext, pair);
                JSONObject payload = new JSONObject();
                payload.put("ok", true);
                payload.put("pairId", pair.pairId);
                payload.put("pairCode", pair.pairCode);
                payload.put("expiresAt", pair.expiresAtMs);
                payload.put("state", pair.state.name());
                payload.put("deviceCodePeriodMs", ControlRotatingCode.PERIOD_MS);
                writeResponse(out, 200, payload.toString(), pnaHeaders(origin));
                return;
            }

            if ("/service/pair/status".equals(path) && ("GET".equals(method) || "HEAD".equals(method))) {
                if (!corsAllows(origin) && !isLoopbackOrCapacitorOrigin(origin)) {
                    writeResponse(out, 403, "{\"error\":\"Origin not allowed\"}", denyCorsHeaders());
                    return;
                }
                String pairId = req.queryParam("pairId");
                Map<String, Object> status = ControlPairStore.statusPayload(pairId);
                // SECURITY: only deliver session to the Origin that started the pair.
                ControlPairStore.PairRequest pair = ControlPairStore.get(pairId);
                if (pair != null && origin != null && !origin.isBlank()
                        && !ControlPairStore.originsEqual(pair.origin, origin)) {
                    status = new LinkedHashMap<>();
                    status.put("state", "denied");
                    status.put("error", "origin_mismatch");
                }
                writeResponse(out, 200, "HEAD".equals(method) ? "" : mapToJson(status).toString(), pnaHeaders(origin));
                return;
            }

            // --- files blob (Cap→Cap / Cap→desk large-batch HTTP pull) ----
            if (path.startsWith("/service/files-blob/") && ("GET".equals(method) || "HEAD".equals(method))) {
                String[] parts = path.split("/");
                // "", "service", "files-blob", transferId, batchId
                String transferId = parts.length > 3 ? urlDecode(parts[3]) : "";
                String batchId = parts.length > 4 ? urlDecode(parts[4]) : "";
                String token = req.queryParam("token");
                if (token == null) token = "";
                // WHY: open()+stream — FilesBlobStore.get() heap-loads and OOMs
                // on 100–512 MiB Cap→peer Accept pulls.
                emission.FilesBlobStore.OpenResult hit =
                        emission.FilesBlobStore.open(appContext, transferId, batchId, token);
                if (hit == null || hit.file == null || !hit.file.isFile()) {
                    writeResponse(out, 404, "{\"error\":\"blob not found or expired\"}", pnaHeaders(origin));
                    return;
                }
                // WHY: leave "waiting for Accept" as soon as peer starts pulling —
                // accept/done WS frames often arrive late or never (gateway path).
                final boolean isGet = "GET".equals(method);
                final String remoteHost = clientIp != null ? clientIp : "";
                if (isGet) {
                    try {
                        emission.FilesOutboundOffer.onBlobServing(
                                appContext, transferId, batchId, remoteHost);
                    } catch (Throwable ignored) { /* best-effort */ }
                }
                final Context progressCtx = appContext;
                final String progressTid = transferId;
                final String progressBatch = batchId;
                final String progressRemote = remoteHost;
                writeBinaryFileResponse(
                        out, 200, hit.file, hit.mimeType, hit.name,
                        hit.size, "HEAD".equals(method), pnaHeaders(origin),
                        isGet ? (done, total) -> {
                            try {
                                emission.FilesOutboundOffer.onBlobServeProgress(
                                        progressCtx, progressTid, progressBatch,
                                        done, total, progressRemote);
                            } catch (Throwable ignored) { /* best-effort */ }
                        } : null);
                // WHY: clear stuck outgoing upload notif when peer finishes HTTP pull
                // even if they never send files:done (older Cap / Neu).
                if (isGet) {
                    try {
                        emission.FilesOutboundOffer.onBlobServed(
                                appContext, transferId, batchId, remoteHost);
                    } catch (Throwable ignored) { /* best-effort */ }
                }
                return;
            }

            if (!"/service/config".equals(path)) {
                writeResponse(out, 404, "{\"error\":\"Not found\"}", pnaHeaders(origin));
                return;
            }

            if (!authorizeConfig(req, origin)) {
                writeResponse(out, 401, "{\"error\":\"Unauthorized\"}", pnaHeaders(origin));
                return;
            }

            if ("GET".equals(method) || "HEAD".equals(method)) {
                Map<String, Object> all = ControlSecrets.redactSecrets(readEnrichedSettings(appContext));
                JSONObject settingsJson = mapToJson(all);
                JSONObject payload = new JSONObject();
                payload.put("portable", settingsJson);
                payload.put("settings", settingsJson);
                payload.put("snapshot", settingsJson);
                payload.put("defaults", new JSONObject());
                payload.put("control", controlMeta());
                writeResponse(out, 200, "HEAD".equals(method) ? "" : payload.toString(), pnaHeaders(origin));
                return;
            }

            if ("POST".equals(method)) {
                Settings settings = new Settings(appContext);
                Map<String, Object> patch = req.body.isBlank()
                        ? new LinkedHashMap<>()
                        : jsonObjectToMap(new JSONObject(req.body));
                ControlSecrets.extractAndStoreToken(appContext, patch);
                Map<String, Object> merged = settings.patch(patch);
                Configure.applyFromSettings(appContext, merged);
                syncFromSettings(appContext);
                if (CwspBridgeService.isRunning()) {
                    CwspBridgeService.requestReconnect(appContext);
                }
                JSONObject payload = new JSONObject();
                payload.put("ok", true);
                JSONObject settingsJson = mapToJson(ControlSecrets.redactSecrets(merged));
                payload.put("portable", settingsJson);
                payload.put("settings", settingsJson);
                payload.put("control", controlMeta());
                writeResponse(out, 200, payload.toString(), pnaHeaders(origin));
                return;
            }

            writeResponse(out, 405, "{\"error\":\"Method not allowed\"}", pnaHeaders(origin));
        } catch (Exception e) {
            Log.w(TAG, "client handler failed", e);
        }
    }

    private JSONObject controlMeta() {
        JSONObject meta = new JSONObject();
        try {
            meta.put("port", port);
            meta.put("listening", running.get());
            meta.put("surface", "capacitor-android");
            meta.put("path", "/service/config");
            meta.put("pairing", true);
            meta.put("auth", "session");
            meta.put("deviceCodePeriodMs", ControlRotatingCode.PERIOD_MS);
        } catch (Exception ignored) {
            /* ignore */
        }
        return meta;
    }

    public static Map<String, Object> readEnrichedSettings(Context context) {
        Settings settings = new Settings(context);
        return enrichSettingsForControl(context, settings.getAll());
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> enrichSettingsForControl(Context appContext, Map<String, Object> all) {
        Map<String, Object> out = all != null ? new LinkedHashMap<>(all) : new LinkedHashMap<>();
        Map<String, Object> core = out.get("core") instanceof Map
                ? new LinkedHashMap<>((Map<String, Object>) out.get("core"))
                : new LinkedHashMap<>();
        Map<String, Object> shell = out.get("shell") instanceof Map
                ? new LinkedHashMap<>((Map<String, Object>) out.get("shell"))
                : new LinkedHashMap<>();

        String endpoint = Configure.readEndpoint(appContext);
        String clientId = Configure.readClientId(appContext);
        if (endpoint != null && !endpoint.isBlank()) {
            core.put("endpointUrl", endpoint);
            shell.put("remoteHost", endpoint);
        } else {
            if (looksLikeControlSpaHost(String.valueOf(core.get("endpointUrl")))) {
                core.remove("endpointUrl");
            }
            if (looksLikeControlSpaHost(String.valueOf(shell.get("remoteHost")))) {
                shell.remove("remoteHost");
            }
        }
        if (clientId != null && !clientId.isBlank()) {
            if (isBlank(core.get("userId"))) core.put("userId", clientId);
            if (isBlank(shell.get("clientId"))) shell.put("clientId", clientId);
        }
        if (!shell.containsKey("allowControlApi")) {
            shell.put("allowControlApi", true);
        }
        if (!core.containsKey("preferBackendSync")) {
            core.put("preferBackendSync", true);
        }
        out.put("core", core);
        out.put("shell", shell);
        return out;
    }

    private static boolean isBlank(Object value) {
        if (value == null) return true;
        return String.valueOf(value).trim().isEmpty();
    }

    private static boolean looksLikeControlSpaHost(String endpointOrHost) {
        if (endpointOrHost == null) return false;
        String s = endpointOrHost.trim().toLowerCase(Locale.ROOT);
        if (s.isEmpty() || "null".equals(s)) return false;
        String host = s;
        int scheme = host.indexOf("://");
        if (scheme >= 0) host = host.substring(scheme + 3);
        int slash = host.indexOf('/');
        if (slash >= 0) host = host.substring(0, slash);
        int colon = host.indexOf(':');
        if (colon >= 0) host = host.substring(0, colon);
        return "cwsp.u2re.space".equals(host)
                || "www.cwsp.u2re.space".equals(host)
                || "md.u2re.space".equals(host)
                || "www.md.u2re.space".equals(host);
    }

    /**
     * Config auth: paired session for public origins; legacy bearer only for loopback/Capacitor.
     */
    private boolean authorizeConfig(HttpRequest req, String origin) {
        String session = req.header("x-control-session");
        if (session != null && !session.isBlank()) {
            return ControlPairStore.validateSession(session, origin) != null;
        }
        // SECURITY: https://* public pages cannot use raw ecosystem token as Control credential.
        if (!isLoopbackOrCapacitorOrigin(origin)) {
            return false;
        }
        String expected = new SecureTokenStore(appContext).getToken();
        if (expected == null || expected.isBlank()) {
            expected = Configure.readControlApiKey(appContext);
        }
        if (expected == null || expected.isBlank()) return false;
        String incoming = req.header("x-api-key");
        if (incoming == null || incoming.isBlank()) {
            String auth = req.header("authorization");
            if (auth != null && auth.regionMatches(true, 0, "Bearer ", 0, 7)) {
                incoming = auth.substring(7).trim();
            }
        }
        return constantTimeEquals(expected, incoming);
    }

    private boolean corsAllows(String origin) {
        if (origin == null || origin.isBlank()) {
            // Non-browser / same-device probes without Origin.
            return true;
        }
        if (isLoopbackOrCapacitorOrigin(origin)) return true;
        // WHY: CRX pairs with publicToken + deviceCode (+ Accept); any extension id may try.
        if (ControlPairStore.isChromeExtensionOrigin(origin)) return true;
        Set<String> allowed = allowedOrigins();
        for (String a : allowed) {
            if (ControlPairStore.originsEqual(a, origin)) return true;
        }
        return false;
    }

    private Set<String> allowedOrigins() {
        Set<String> out = new LinkedHashSet<>(DEFAULT_ALLOWED_ORIGINS);
        try {
            Settings settings = new Settings(appContext);
            Map<String, Object> all = settings.getAll();
            Object shellObj = all.get("shell");
            if (shellObj instanceof Map) {
                Object csv = ((Map<?, ?>) shellObj).get("controlAllowedOrigins");
                if (csv instanceof String && !((String) csv).isBlank()) {
                    for (String part : ((String) csv).split("[;,]")) {
                        String t = part.trim();
                        if (!t.isEmpty()) out.add(t);
                    }
                }
            }
        } catch (Exception ignored) {
            /* defaults only */
        }
        return out;
    }

    private static boolean isLoopbackOrCapacitorOrigin(String origin) {
        if (origin == null || origin.isBlank()) return true;
        String o = origin.trim().toLowerCase(Locale.ROOT);
        if (o.startsWith("capacitor://") || o.startsWith("ionic://")) return true;
        if (o.startsWith("http://localhost") || o.startsWith("https://localhost")) return true;
        if (o.startsWith("http://127.0.0.1") || o.startsWith("https://127.0.0.1")) return true;
        if (o.startsWith("http://[::1]") || o.startsWith("https://[::1]")) return true;
        return false;
    }

    private static boolean constantTimeEquals(String expected, String incoming) {
        if (incoming == null) return false;
        byte[] a = expected.getBytes(StandardCharsets.UTF_8);
        byte[] b = incoming.getBytes(StandardCharsets.UTF_8);
        if (a.length != b.length) {
            MessageDigest.isEqual(a, a);
            return false;
        }
        return MessageDigest.isEqual(a, b);
    }

    private static Map<String, String> denyCorsHeaders() {
        Map<String, String> h = new LinkedHashMap<>();
        h.put("Vary", "Origin");
        return h;
    }

    private static Map<String, String> pnaHeaders(String origin) {
        Map<String, String> h = new LinkedHashMap<>();
        if (origin != null && !origin.isBlank()) {
            h.put("Access-Control-Allow-Origin", origin);
        } else {
            h.put("Access-Control-Allow-Origin", "*");
        }
        // INVARIANT: match Neutralino corsHeaders — SPA Settings sends X-Skip-Legacy-Key after pair.
        h.put(
                "Access-Control-Allow-Headers",
                "Content-Type, X-API-Key, Authorization, X-Control-Session, X-Control-Origin, X-Skip-Legacy-Key, Access-Control-Request-Private-Network"
        );
        h.put("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
        h.put("Vary", "Origin, Access-Control-Request-Private-Network");
        h.put("Access-Control-Allow-Private-Network", "true");
        h.put("Access-Control-Expose-Headers", "X-Control-Session");
        return h;
    }

    private static void writeResponse(
            OutputStream out,
            int status,
            String body,
            Map<String, String> extraHeaders
    ) throws IOException {
        byte[] bytes = body == null ? new byte[0] : body.getBytes(StandardCharsets.UTF_8);
        String reason =
                status == 200 ? "OK"
                        : status == 204 ? "No Content"
                        : status == 400 ? "Bad Request"
                        : status == 401 ? "Unauthorized"
                        : status == 403 ? "Forbidden"
                        : status == 404 ? "Not Found"
                        : status == 405 ? "Method Not Allowed"
                        : status == 429 ? "Too Many Requests"
                        : "Error";
        StringBuilder sb = new StringBuilder();
        sb.append("HTTP/1.1 ").append(status).append(' ').append(reason).append("\r\n");
        sb.append("Content-Type: application/json; charset=utf-8\r\n");
        sb.append("Content-Length: ").append(bytes.length).append("\r\n");
        sb.append("Connection: close\r\n");
        if (extraHeaders != null) {
            for (Map.Entry<String, String> e : extraHeaders.entrySet()) {
                sb.append(e.getKey()).append(": ").append(e.getValue()).append("\r\n");
            }
        }
        sb.append("\r\n");
        out.write(sb.toString().getBytes(StandardCharsets.UTF_8));
        if (bytes.length > 0) out.write(bytes);
        out.flush();
    }

    private static void writeBinaryResponse(
            OutputStream out,
            int status,
            byte[] body,
            String mimeType,
            String fileName,
            boolean headOnly,
            Map<String, String> extraHeaders
    ) throws IOException {
        byte[] bytes = body == null ? new byte[0] : body;
        String safeName = fileName == null ? "batch.bin" : fileName.replace("\"", "");
        StringBuilder sb = new StringBuilder();
        sb.append("HTTP/1.1 ").append(status).append(" OK\r\n");
        sb.append("Content-Type: ").append(mimeType != null ? mimeType : "application/octet-stream").append("\r\n");
        sb.append("Content-Length: ").append(bytes.length).append("\r\n");
        sb.append("Content-Disposition: attachment; filename=\"").append(safeName).append("\"\r\n");
        sb.append("Cache-Control: no-store\r\n");
        sb.append("Connection: close\r\n");
        if (extraHeaders != null) {
            for (Map.Entry<String, String> e : extraHeaders.entrySet()) {
                sb.append(e.getKey()).append(": ").append(e.getValue()).append("\r\n");
            }
        }
        sb.append("\r\n");
        out.write(sb.toString().getBytes(StandardCharsets.UTF_8));
        if (!headOnly && bytes.length > 0) out.write(bytes);
        out.flush();
    }

    /** Byte progress while streaming a blob body (done, total). */
    @FunctionalInterface
    private interface BlobStreamProgress {
        void onBytes(long done, long total);
    }

    /**
     * Stream a blob file to the socket (constant memory).
     * WHY: writeBinaryResponse(byte[]) OOMs on hundreds-of-MiB Cap shares.
     */
    private static void writeBinaryFileResponse(
            OutputStream out,
            int status,
            File file,
            String mimeType,
            String fileName,
            long declaredSize,
            boolean headOnly,
            Map<String, String> extraHeaders
    ) throws IOException {
        writeBinaryFileResponse(out, status, file, mimeType, fileName,
                declaredSize, headOnly, extraHeaders, null);
    }

    private static void writeBinaryFileResponse(
            OutputStream out,
            int status,
            File file,
            String mimeType,
            String fileName,
            long declaredSize,
            boolean headOnly,
            Map<String, String> extraHeaders,
            BlobStreamProgress progress
    ) throws IOException {
        long size = declaredSize > 0 ? declaredSize : (file != null ? file.length() : 0L);
        if (file != null && file.isFile() && file.length() > 0) size = file.length();
        String safeName = fileName == null ? "batch.bin" : fileName.replace("\"", "");
        StringBuilder sb = new StringBuilder();
        sb.append("HTTP/1.1 ").append(status).append(" OK\r\n");
        sb.append("Content-Type: ").append(mimeType != null ? mimeType : "application/octet-stream").append("\r\n");
        sb.append("Content-Length: ").append(size).append("\r\n");
        sb.append("Content-Disposition: attachment; filename=\"").append(safeName).append("\"\r\n");
        sb.append("Cache-Control: no-store\r\n");
        sb.append("Connection: close\r\n");
        if (extraHeaders != null) {
            for (Map.Entry<String, String> e : extraHeaders.entrySet()) {
                sb.append(e.getKey()).append(": ").append(e.getValue()).append("\r\n");
            }
        }
        sb.append("\r\n");
        out.write(sb.toString().getBytes(StandardCharsets.UTF_8));
        if (!headOnly && file != null && file.isFile() && size > 0) {
            try (InputStream in = new FileInputStream(file)) {
                byte[] buf = new byte[64 * 1024];
                int n;
                long written = 0L;
                long lastReport = 0L;
                long lastReportMs = System.currentTimeMillis();
                while ((n = in.read(buf)) > 0) {
                    out.write(buf, 0, n);
                    written += n;
                    // WHY: byte OR time gate — slow WAN tails used to look frozen
                    // when <256KiB arrived between sparse socket writes.
                    long now = System.currentTimeMillis();
                    if (progress != null && (
                            written - lastReport >= 256L * 1024L
                                    || written >= size
                                    || (written > lastReport && now - lastReportMs >= 400L))) {
                        lastReport = written;
                        lastReportMs = now;
                        progress.onBytes(written, size);
                    }
                }
                if (progress != null && written > 0) {
                    progress.onBytes(written, size);
                }
            }
        }
        out.flush();
    }

    private static String queryParam(String query, String key) {
        if (query == null || query.isEmpty() || key == null) return "";
        for (String part : query.split("&")) {
            int eq = part.indexOf('=');
            if (eq <= 0) continue;
            String k = urlDecode(part.substring(0, eq));
            if (key.equals(k)) return urlDecode(part.substring(eq + 1));
        }
        return "";
    }

    private static String urlDecode(String s) {
        if (s == null) return "";
        try {
            return java.net.URLDecoder.decode(s, StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            return s;
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
        return v;
    }

    private static Map<String, Object> jsonObjectToMap(JSONObject obj) {
        Map<String, Object> out = new LinkedHashMap<>();
        if (obj == null) return out;
        for (java.util.Iterator<String> it = obj.keys(); it.hasNext(); ) {
            String key = it.next();
            Object value = obj.opt(key);
            if (value instanceof JSONObject) {
                out.put(key, jsonObjectToMap((JSONObject) value));
            } else if (value == JSONObject.NULL) {
                out.put(key, null);
            } else {
                out.put(key, value);
            }
        }
        return out;
    }

    private void closeQuietly() {
        running.set(false);
        try {
            if (serverSocket != null) serverSocket.close();
        } catch (Exception ignored) {
            /* ignore */
        }
        if (acceptPool != null) acceptPool.shutdownNow();
        if (workerPool != null) workerPool.shutdownNow();
    }

    @Override
    public void close() {
        closeQuietly();
    }

    private static final class HttpRequest {
        final String method;
        final String path;
        final String rawQuery;
        final Map<String, String> headers;
        final String body;

        private HttpRequest(
                String method,
                String path,
                String rawQuery,
                Map<String, String> headers,
                String body
        ) {
            this.method = method;
            this.path = path;
            this.rawQuery = rawQuery != null ? rawQuery : "";
            this.headers = headers;
            this.body = body;
        }

        String header(String name) {
            return headers.get(name.toLowerCase(Locale.ROOT));
        }

        String queryParam(String name) {
            if (rawQuery.isEmpty() || name == null) return null;
            for (String part : rawQuery.split("&")) {
                int eq = part.indexOf('=');
                String k = eq >= 0 ? part.substring(0, eq) : part;
                String v = eq >= 0 ? part.substring(eq + 1) : "";
                try {
                    k = java.net.URLDecoder.decode(k, StandardCharsets.UTF_8);
                    v = java.net.URLDecoder.decode(v, StandardCharsets.UTF_8);
                } catch (Exception ignored) {
                    /* keep raw */
                }
                if (name.equals(k)) return v;
            }
            return null;
        }

        static HttpRequest parse(InputStream in) throws IOException {
            ByteArrayOutputStream headBuf = new ByteArrayOutputStream(1024);
            int state = 0;
            while (state < 4) {
                int b = in.read();
                if (b < 0) break;
                headBuf.write(b);
                if (b == '\r') {
                    if (state == 0 || state == 2) state++;
                    else state = 1;
                } else if (b == '\n') {
                    if (state == 1) state = 2;
                    else if (state == 3) state = 4;
                    else state = 0;
                } else {
                    state = 0;
                }
                if (headBuf.size() > 64_000) return null;
            }
            String head = headBuf.toString(StandardCharsets.UTF_8);
            String[] lines = head.split("\r\n");
            if (lines.length < 1) return null;
            String[] parts = lines[0].split("\\s+");
            if (parts.length < 2) return null;
            String method = parts[0].toUpperCase(Locale.ROOT);
            String target = parts[1];
            String path = target;
            String query = "";
            int q = target.indexOf('?');
            if (q >= 0) {
                path = target.substring(0, q);
                query = target.substring(q + 1);
            }

            Map<String, String> headers = new LinkedHashMap<>();
            int contentLength = 0;
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i];
                if (line.isEmpty()) break;
                int colon = line.indexOf(':');
                if (colon <= 0) continue;
                String name = line.substring(0, colon).trim().toLowerCase(Locale.ROOT);
                String value = line.substring(colon + 1).trim();
                headers.put(name, value);
                if ("content-length".equals(name)) {
                    try {
                        contentLength = Integer.parseInt(value);
                    } catch (NumberFormatException ignored) {
                        contentLength = 0;
                    }
                }
            }

            byte[] bodyBytes = new byte[0];
            if (contentLength > 0 && contentLength < 2_000_000) {
                bodyBytes = readExact(in, contentLength);
            }
            return new HttpRequest(
                    method,
                    path,
                    query,
                    headers,
                    new String(bodyBytes, StandardCharsets.UTF_8)
            );
        }

        private static byte[] readExact(InputStream in, int length) throws IOException {
            byte[] buf = new byte[length];
            int off = 0;
            while (off < length) {
                int n = in.read(buf, off, length - off);
                if (n < 0) break;
                off += n;
            }
            if (off == length) return buf;
            byte[] trimmed = new byte[off];
            System.arraycopy(buf, 0, trimmed, 0, off);
            return trimmed;
        }
    }
}
