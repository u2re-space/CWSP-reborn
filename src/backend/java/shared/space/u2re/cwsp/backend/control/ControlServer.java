/*
 * Filename: ControlServer.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/control/ControlServer.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — loopback GET|POST /service/config control host (JDK HttpServer).
 */

package space.u2re.cwsp.backend.control;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import space.u2re.cwsp.backend.json.Json;
import space.u2re.cwsp.backend.settings.SettingsStore;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Loopback control RPC used by desktop shells (parity with Node WebNative control).
 *
 * Routes:
 *   GET  /service/config → { portable, defaults, snapshot, settings }
 *   POST /service/config → merge patch into portable.config.json
 *
 * SECURITY: when a control key is configured ({@code CWSP_CONTROL_KEY} or constructor),
 * requests without a matching {@code X-API-Key} header receive 401. Never hardcode secrets.
 */
public final class ControlServer implements AutoCloseable {

    public static final String ENV_CONTROL_KEY = "CWSP_CONTROL_KEY";
    public static final String HEADER_API_KEY = "X-API-Key";

    private final SettingsStore store;
    private final String controlKey; // null/blank = auth disabled
    private final HttpServer server;
    private final String host;
    private final int port;

    public record Auth(int port, String key) {}

    public static final class Options {
        public SettingsStore store;
        public String host = "127.0.0.1";
        public int port = 0;
        /** Explicit key; when null, falls back to env {@link #ENV_CONTROL_KEY}. */
        public String controlKey;
        public boolean useEnvKey = true;
    }

    public ControlServer(Options options) throws IOException {
        Objects.requireNonNull(options, "options");
        this.store = Objects.requireNonNull(options.store, "store");
        this.host = options.host == null || options.host.isBlank() ? "127.0.0.1" : options.host;

        String key = options.controlKey;
        if ((key == null || key.isBlank()) && options.useEnvKey) {
            String env = System.getenv(ENV_CONTROL_KEY);
            if (env != null && !env.isBlank()) key = env;
        }
        this.controlKey = (key == null || key.isBlank()) ? null : key;

        this.server = HttpServer.create(new InetSocketAddress(this.host, Math.max(0, options.port)), 0);
        this.server.createContext("/service/config", this::handleConfig);
        this.server.setExecutor(null);
        this.server.start();
        this.port = this.server.getAddress().getPort();
    }

    public Auth auth() {
        return new Auth(port, controlKey);
    }

    public int getPort() {
        return port;
    }

    /** True when a control key is required. */
    public boolean isAuthRequired() {
        return controlKey != null;
    }

    private void handleConfig(HttpExchange exchange) throws IOException {
        try {
            if (!authorize(exchange)) {
                sendJson(exchange, 401, Map.of("error", "Unauthorized"));
                return;
            }

            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                Map<String, Object> settings = store.get();
                Map<String, Object> defaults = store.defaults();
                Map<String, Object> snapshot = store.snapshot();
                Map<String, Object> body = new LinkedHashMap<>();
                body.put("portable", settings);
                body.put("defaults", defaults);
                body.put("snapshot", snapshot);
                body.put("settings", settings);
                sendJson(exchange, 200, body);
                return;
            }

            if ("POST".equalsIgnoreCase(method)) {
                String raw = readBody(exchange);
                Map<String, Object> patch = raw.isBlank() ? Map.of() : Json.parseObject(raw);
                Map<String, Object> merged = store.patch(patch);
                Map<String, Object> body = new LinkedHashMap<>();
                body.put("ok", true);
                body.put("portable", merged);
                body.put("settings", merged);
                sendJson(exchange, 200, body);
                return;
            }

            sendJson(exchange, 405, Map.of("error", "Method not allowed"));
        } catch (Exception error) {
            String message = error.getMessage() == null ? "Internal error" : error.getMessage();
            sendJson(exchange, 500, Map.of("error", message));
        }
    }

    private boolean authorize(HttpExchange exchange) {
        if (controlKey == null) return true;
        Headers headers = exchange.getRequestHeaders();
        String incoming = headers.getFirst(HEADER_API_KEY);
        if (incoming == null) {
            incoming = headers.getFirst("x-api-key");
        }
        return constantTimeEquals(controlKey, incoming);
    }

    private static boolean constantTimeEquals(String expected, String incoming) {
        if (incoming == null) return false;
        byte[] a = expected.getBytes(StandardCharsets.UTF_8);
        byte[] b = incoming.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(a, b);
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream in = exchange.getRequestBody()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static void sendJson(HttpExchange exchange, int status, Object body) throws IOException {
        byte[] bytes = Json.stringifyCompact(body).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(bytes);
        }
    }

    @Override
    public void close() {
        server.stop(0);
    }
}
