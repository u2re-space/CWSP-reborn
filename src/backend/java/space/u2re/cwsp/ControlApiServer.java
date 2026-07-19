/*
 * Filename: ControlApiServer.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlApiServer.java
 * Change date and time: 22.40.00_19.07.2026
 * Reason for changes: Hidden Android Control API (PNA) — GET|POST /service/config on :8434
 *   for public /cwsp SPA; gated by shell.allowControlApi.
 */

package space.u2re.cwsp;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import core.Configure;
import core.Settings;

/**
 * Minimal cleartext HTTP control host for Capacitor/Android.
 *
 * <p>Parity with Neutralino Node {@code /service/config}: public {@code /cwsp} reaches the
 * phone over PNA ({@code Access-Control-Allow-Private-Network}) when
 * {@code shell.allowControlApi} is enabled.</p>
 *
 * <p>INVARIANT: bind {@code 0.0.0.0:8434} only while the flag is on; default off.</p>
 * <p>SECURITY: require {@code X-API-Key} = ecosystem token ({@link SecureTokenStore})
 * or a generated control key persisted in {@link Configure}.</p>
 */
public final class ControlApiServer implements AutoCloseable {
    private static final String TAG = "ControlApiServer";

    public static final int DEFAULT_PORT = 8434;

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

    /**
     * Start or stop based on {@code shell.allowControlApi} in persisted settings.
     */
    public static synchronized void syncFromSettings(Context context) {
        if (context == null) return;
        boolean allow = Configure.readAllowControlApi(context);
        if (allow) {
            ensureControlKey(context);
            start(context, DEFAULT_PORT);
        } else {
            stop();
        }
    }

    /** Ensure an API key exists before binding (ecosystem token preferred). */
    private static void ensureControlKey(Context context) {
        String token = new SecureTokenStore(context).getToken();
        if (token != null && !token.isBlank()) return;
        String existing = Configure.readControlApiKey(context);
        if (existing != null && !existing.isBlank()) return;
        String generated = "cwsp-ctrl-" + UUID.randomUUID().toString().replace("-", "");
        Configure.writeControlApiKey(context, generated);
        Log.i(TAG, "generated control API key (no ecosystem token yet)");
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
            Log.i(TAG, "listening 0.0.0.0:" + next.port + " /service/config (PNA)");
        } catch (Exception e) {
            Log.e(TAG, "failed to bind control API on :" + port, e);
            next.closeQuietly();
            INSTANCE = null;
        }
    }

    public static synchronized void stop() {
        ControlApiServer prev = INSTANCE;
        INSTANCE = null;
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
                // periodic wake to observe running flag
            } catch (Exception e) {
                if (running.get()) {
                    Log.w(TAG, "accept failed", e);
                }
            }
        }
    }

    private void handleClient(Socket socket) {
        try (Socket s = socket) {
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
                writeResponse(out, 204, "", pnaHeaders(origin));
                return;
            }

            if (!"/service/config".equals(path)) {
                writeResponse(out, 404, "{\"error\":\"Not found\"}", pnaHeaders(origin));
                return;
            }

            if (!authorize(req)) {
                writeResponse(out, 401, "{\"error\":\"Unauthorized\"}", pnaHeaders(origin));
                return;
            }

            if ("GET".equals(method) || "HEAD".equals(method)) {
                Settings settings = new Settings(appContext);
                Map<String, Object> all = enrichSettingsForControl(settings.getAll());
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
                Map<String, Object> merged = settings.patch(patch);
                Configure.applyFromSettings(appContext, merged);
                // WHY: toggling allowControlApi via Control API itself must start/stop the listener.
                syncFromSettings(appContext);
                if (CwspBridgeService.isRunning()) {
                    CwspBridgeService.requestReconnect(appContext);
                }
                JSONObject payload = new JSONObject();
                payload.put("ok", true);
                JSONObject settingsJson = mapToJson(merged);
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
        } catch (Exception ignored) {
            /* ignore */
        }
        return meta;
    }

    /**
     * Ensure /cwsp hydrate sees clientId / endpoint even when the SharedPreferences blob is thin.
     * WHY: Configure cache is written on every settings:patch; blob may omit nested core until a full save.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> enrichSettingsForControl(Map<String, Object> all) {
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
            if (isBlank(core.get("endpointUrl"))) core.put("endpointUrl", endpoint);
            if (isBlank(shell.get("remoteHost"))) shell.put("remoteHost", endpoint);
        }
        if (clientId != null && !clientId.isBlank()) {
            if (isBlank(core.get("userId"))) core.put("userId", clientId);
            if (isBlank(shell.get("clientId"))) shell.put("clientId", clientId);
        }
        if (!shell.containsKey("allowControlApi")) {
            shell.put("allowControlApi", true);
        }
        // PreferBackendSync so /cwsp form merge keeps treating this blob as SoT.
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

    private boolean authorize(HttpRequest req) {
        String expected = new SecureTokenStore(appContext).getToken();
        if (expected == null || expected.isBlank()) {
            expected = Configure.readControlApiKey(appContext);
        }
        if (expected == null || expected.isBlank()) {
            // SECURITY: refuse open control when no key is configured.
            return false;
        }
        String incoming = req.header("x-api-key");
        if (incoming == null || incoming.isBlank()) {
            String auth = req.header("authorization");
            if (auth != null && auth.regionMatches(true, 0, "Bearer ", 0, 7)) {
                incoming = auth.substring(7).trim();
            }
        }
        return constantTimeEquals(expected, incoming);
    }

    private static boolean constantTimeEquals(String expected, String incoming) {
        if (incoming == null) return false;
        byte[] a = expected.getBytes(StandardCharsets.UTF_8);
        byte[] b = incoming.getBytes(StandardCharsets.UTF_8);
        if (a.length != b.length) {
            // Keep timing roughly flat vs length-mismatch early return.
            MessageDigest.isEqual(a, a);
            return false;
        }
        return MessageDigest.isEqual(a, b);
    }

    private static Map<String, String> pnaHeaders(String origin) {
        Map<String, String> h = new LinkedHashMap<>();
        h.put("Access-Control-Allow-Origin", origin != null && !origin.isBlank() ? origin : "*");
        h.put(
                "Access-Control-Allow-Headers",
                "Content-Type, X-API-Key, Authorization, Access-Control-Request-Private-Network"
        );
        h.put("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
        h.put("Vary", "Origin, Access-Control-Request-Private-Network");
        // Always advertise for Chromium PNA preflights from public /cwsp.
        h.put("Access-Control-Allow-Private-Network", "true");
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
                        : status == 401 ? "Unauthorized"
                        : status == 404 ? "Not Found"
                        : status == 405 ? "Method Not Allowed"
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

    /** Tiny HTTP/1.1 request parser (headers + Content-Length body). */
    private static final class HttpRequest {
        final String method;
        final String path;
        final Map<String, String> headers;
        final String body;

        private HttpRequest(String method, String path, Map<String, String> headers, String body) {
            this.method = method;
            this.path = path;
            this.headers = headers;
            this.body = body;
        }

        String header(String name) {
            return headers.get(name.toLowerCase(Locale.ROOT));
        }

        static HttpRequest parse(InputStream in) throws IOException {
            ByteArrayOutputStream headBuf = new ByteArrayOutputStream(1024);
            int state = 0; // 0=normal, 1=saw \r, 2=saw \r\n, 3=saw \r\n\r
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
            String path = parts[1];
            int q = path.indexOf('?');
            if (q >= 0) path = path.substring(0, q);

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
            return new HttpRequest(method, path, headers, new String(bodyBytes, StandardCharsets.UTF_8));
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
