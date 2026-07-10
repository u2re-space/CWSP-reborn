/*
 * Filename: CwspWsClient.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwspWsClient.java
 * Change date and time: 18.45.00_10.07.2026
 * Reason for changes: OkHttp /ws keepalive for CwspBridgeService (hello/ping/reconnect/clipboard).
 */

package space.u2re.cwsp;

import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;

import org.json.JSONObject;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import core.Configure;
import core.Coordinator;
import core.Settings;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

/**
 * CWSP native WebSocket client for the Capacitor foreground service.
 *
 * <p>Auth via query {@code userId}/{@code userKey}/{@code clientId}. Sends hello +
 * 10s ping. Local clipboard changes fan out as {@code clipboard:update} acts;
 * inbound clipboard acts go through {@link Coordinator}.</p>
 */
public final class CwspWsClient {
    private static final String TAG = "CwspWsClient";
    private static final long PING_MS = 10_000L;
    private static final long BASE_RECONNECT_MS = 2_000L;
    private static final long MAX_RECONNECT_MS = 30_000L;

    private final Context appContext;
    private final Coordinator coordinator;
    private final SecureTokenStore tokenStore;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final HandlerThread bgThread = new HandlerThread("cwsp-ws");
    private final Handler bgHandler;
    private final OkHttpClient http;
    private final AtomicBoolean open = new AtomicBoolean(false);
    private final AtomicBoolean wantConnected = new AtomicBoolean(false);
    private final AtomicInteger attempt = new AtomicInteger(0);

    private WebSocket socket;
    private final Runnable pingTask = new Runnable() {
        @Override
        public void run() {
            if (!wantConnected.get() || !open.get() || socket == null) return;
            try {
                JSONObject ping = new JSONObject();
                ping.put("type", "ping");
                ping.put("ts", System.currentTimeMillis());
                socket.send(ping.toString());
            } catch (Exception e) {
                Log.w(TAG, "[socket:initiate-error] ping failed", e);
            }
            bgHandler.postDelayed(this, PING_MS);
        }
    };

    public CwspWsClient(Context context, Coordinator coordinator) {
        this.appContext = context.getApplicationContext();
        this.coordinator = coordinator;
        this.tokenStore = new SecureTokenStore(appContext);
        bgThread.start();
        this.bgHandler = new Handler(bgThread.getLooper());
        this.http = new OkHttpClient.Builder()
                .connectTimeout(12, TimeUnit.SECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .pingInterval(0, TimeUnit.SECONDS)
                .build();
    }

    public boolean isConfigured() {
        String endpoint = Configure.readEndpoint(appContext);
        String clientId = Configure.readClientId(appContext);
        String token = tokenStore.getToken();
        return endpoint != null && !endpoint.isEmpty()
                && clientId != null && !clientId.isEmpty()
                && token != null && !token.isEmpty();
    }

    public boolean isOpen() {
        return open.get();
    }

    public void connect() {
        wantConnected.set(true);
        bgHandler.post(this::connectNow);
    }

    public void disconnect() {
        wantConnected.set(false);
        bgHandler.post(() -> {
            bgHandler.removeCallbacks(pingTask);
            bgHandler.removeCallbacksAndMessages(null);
            if (socket != null) {
                try {
                    socket.close(1000, "service-stop");
                } catch (Exception ignored) {
                    /* best-effort */
                }
                socket = null;
            }
            open.set(false);
        });
    }

    public boolean send(Map<String, Object> packet) {
        if (!open.get() || socket == null || packet == null) return false;
        try {
            JSONObject json = mapToJson(packet);
            return socket.send(json.toString());
        } catch (Exception e) {
            Log.w(TAG, "send failed", e);
            return false;
        }
    }

    public boolean sendClipboardUpdate(String text, String clientId) {
        if (text == null) return false;
        List<String> destinations = Configure.readClipboardDestinations(appContext);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:update");
        packet.put("purpose", "clipboard");
        packet.put("protocol", "ws");
        packet.put("transport", "ws");
        packet.put("uuid", UUID.randomUUID().toString());
        packet.put("timestamp", System.currentTimeMillis());
        packet.put("sender", clientId != null ? clientId : "");
        packet.put("byId", clientId != null ? clientId : "");
        packet.put("nodes", destinations);
        packet.put("destinations", destinations);
        Map<String, Object> flags = new LinkedHashMap<>();
        flags.put("canonicalV2", true);
        packet.put("flags", flags);
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("text", text);
        packet.put("payload", payload);
        return send(packet);
    }

    private void connectNow() {
        if (!wantConnected.get()) return;
        if (!isConfigured()) {
            Log.i(TAG, "[socket:initiate-failed] missing endpoint/clientId/token");
            return;
        }
        // Skip replace when already open — avoids CONFIGURE double-start races.
        if (open.get() && socket != null) {
            Log.i(TAG, "[socket:transport-connect] already-open");
            return;
        }
        if (socket != null) {
            try {
                socket.cancel();
            } catch (Exception ignored) {
                /* replace */
            }
            socket = null;
        }
        open.set(false);

        String url = buildWsUrl();
        if (url == null) {
            Log.w(TAG, "[socket:initiate-failed] bad endpoint URL");
            scheduleReconnect();
            return;
        }
        Log.i(TAG, "[socket:transport-connect] " + redactUrl(url));
        Request request = new Request.Builder().url(url).build();
        socket = http.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                open.set(true);
                attempt.set(0);
                Log.i(TAG, "[socket:transport-connect] open");
                try {
                    JSONObject hello = new JSONObject();
                    hello.put("type", "hello");
                    hello.put("archetype", "java-cwsp");
                    hello.put("clientId", Configure.readClientId(appContext));
                    hello.put("deviceId", deviceId());
                    hello.put("ts", System.currentTimeMillis());
                    webSocket.send(hello.toString());
                } catch (Exception e) {
                    Log.w(TAG, "hello failed", e);
                }
                bgHandler.removeCallbacks(pingTask);
                bgHandler.postDelayed(pingTask, PING_MS);
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                handleInbound(text);
            }

            @Override
            public void onClosing(WebSocket webSocket, int code, String reason) {
                webSocket.close(code, reason);
            }

            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                open.set(false);
                bgHandler.removeCallbacks(pingTask);
                Log.i(TAG, "[socket:transport-reconnect] closed code=" + code);
                if (code == 4001) {
                    // Invalid credentials — long cooldown.
                    attempt.set(8);
                }
                scheduleReconnect();
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                open.set(false);
                bgHandler.removeCallbacks(pingTask);
                Log.w(TAG, "[socket:initiate-error] " + (t != null ? t.getMessage() : "fail"));
                scheduleReconnect();
            }
        });
    }

    private void scheduleReconnect() {
        if (!wantConnected.get()) return;
        int n = attempt.getAndIncrement();
        long delay = Math.min(MAX_RECONNECT_MS, BASE_RECONNECT_MS * (1L << Math.min(n, 4)));
        Log.i(TAG, "[socket:initiate-timeout] reconnect in " + delay + "ms");
        bgHandler.postDelayed(this::connectNow, delay);
    }

    private void handleInbound(String text) {
        if (text == null || text.isEmpty()) return;
        try {
            JSONObject obj = new JSONObject(text);
            String type = obj.optString("type", "");
            if ("ping".equals(type)) {
                JSONObject pong = new JSONObject();
                pong.put("type", "pong");
                pong.put("ts", System.currentTimeMillis());
                if (socket != null) socket.send(pong.toString());
                return;
            }
            if ("pong".equals(type) || "hello".equals(type) || "welcome".equals(type)) {
                return;
            }
            Map<String, Object> packet = JsonMaps.fromJSONObject(obj);
            String what = String.valueOf(packet.getOrDefault("what", packet.getOrDefault("type", "")));
            if (what.startsWith("clipboard:") || what.startsWith("airpad:clipboard:")) {
                mainHandler.post(() -> {
                    try {
                        coordinator.dispatch(packet);
                    } catch (Exception e) {
                        Log.w(TAG, "inbound clipboard dispatch failed", e);
                    }
                });
            }
        } catch (Exception e) {
            Log.w(TAG, "inbound parse failed", e);
        }
    }

    private String buildWsUrl() {
        String endpoint = Configure.readEndpoint(appContext);
        String clientId = Configure.readClientId(appContext);
        String token = tokenStore.getToken();
        if (endpoint == null || clientId == null || token == null) return null;

        String base = endpoint.trim();
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        if (base.startsWith("https://")) {
            base = "wss://" + base.substring("https://".length());
        } else if (base.startsWith("http://")) {
            base = "ws://" + base.substring("http://".length());
        } else if (!base.startsWith("ws://") && !base.startsWith("wss://")) {
            base = "wss://" + base;
        }
        // WHY: bare host (45.147.121.152) → wss default port 443; nginx there returns 404 for /ws.
        // Canonical CWSP realtime lives on :8434 (LAN + public). Inject when port omitted.
        try {
            Uri tmp = Uri.parse(base);
            if (tmp.getHost() != null && tmp.getPort() < 0) {
                String scheme = tmp.getScheme() != null ? tmp.getScheme() : "wss";
                String path = tmp.getEncodedPath();
                if (path == null) path = "";
                base = scheme + "://" + tmp.getHost() + ":8434" + path;
            }
        } catch (Exception ignored) {
            /* keep base */
        }
        if (!base.contains("/ws")) {
            base = base + "/ws";
        }

        Uri.Builder b = Uri.parse(base).buildUpon();
        b.appendQueryParameter("userId", clientId);
        b.appendQueryParameter("userKey", token);
        b.appendQueryParameter("clientId", clientId);
        b.appendQueryParameter("label", "java-cwsp-" + clientId);
        b.appendQueryParameter("deviceId", deviceId());
        // WHY: server prefers archetype for parse; must be a known WsConnectionIntent.
        b.appendQueryParameter("archetype", "requestor-initiator");
        b.appendQueryParameter("mode", "push");
        b.appendQueryParameter("connectionType", "first-order");

        // Gateway route markers when talking to .200 / public entry (phone↔phone + desk via coordinator).
        try {
            Uri ep = Uri.parse(endpoint);
            String host = ep.getHost();
            if (host != null && (host.contains("192.168.0.200") || host.equals("45.147.121.152"))) {
                b.appendQueryParameter("cwsp_route", "gateway");
                b.appendQueryParameter("cwsp_via", host);
                b.appendQueryParameter("cwsp_protocol", base.startsWith("wss") ? "wss" : "ws");
                // Prefer configured destinations; do NOT invent L-110 when desk is offline.
                List<String> dests = Configure.readClipboardDestinations(appContext);
                String routeTarget = Configure.readRouteTarget(appContext);
                String primary = null;
                if (routeTarget != null && !routeTarget.trim().isEmpty() && !routeTarget.contains(";")
                        && !routeTarget.contains(",") && !"*".equals(routeTarget.trim())) {
                    primary = routeTarget.trim();
                } else if (dests != null) {
                    for (String d : dests) {
                        if (d != null && !d.isEmpty() && !"*".equals(d) && !d.equals(clientId)) {
                            primary = d;
                            break;
                        }
                    }
                }
                if (primary != null && !primary.isEmpty()) {
                    b.appendQueryParameter("cwsp_route_target", primary);
                    if (primary.startsWith("L-") && primary.length() > 2) {
                        String rest = primary.substring(2);
                        if (rest.matches("\\d+\\.\\d+\\.\\d+\\.\\d+")) {
                            b.appendQueryParameter("cwsp_target", rest);
                            b.appendQueryParameter("cwsp_target_port", "8434");
                        } else if (rest.matches("\\d{1,3}")) {
                            b.appendQueryParameter("cwsp_target", "192.168.0." + rest);
                            b.appendQueryParameter("cwsp_target_port", "8434");
                        }
                    }
                }
            }
        } catch (Exception ignored) {
            /* optional markers */
        }
        return b.build().toString();
    }

    private String deviceId() {
        Settings settings = new Settings(appContext);
        Object cwsp = settings.getAll().get("cwsp");
        if (cwsp instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) cwsp;
            Object d = m.get("deviceId");
            if (d instanceof String && !((String) d).isEmpty()) return (String) d;
            Object peer = m.get("peerInstanceId");
            if (peer instanceof String && !((String) peer).isEmpty()) return (String) peer;
        }
        // Stable-enough install id in private prefs (non-secret).
        android.content.SharedPreferences p =
                appContext.getSharedPreferences("cwsp_device", Context.MODE_PRIVATE);
        String id = p.getString("deviceId", null);
        if (id == null || id.isEmpty()) {
            id = UUID.randomUUID().toString();
            p.edit().putString("deviceId", id).apply();
        }
        return id;
    }

    private static String redactUrl(String url) {
        if (url == null) return "";
        return url.replaceAll("userKey=[^&]+", "userKey=***");
    }

    @SuppressWarnings("unchecked")
    private static JSONObject mapToJson(Map<String, Object> map) throws Exception {
        JSONObject obj = new JSONObject();
        for (Map.Entry<String, Object> e : map.entrySet()) {
            Object v = e.getValue();
            if (v instanceof Map) {
                obj.put(e.getKey(), mapToJson((Map<String, Object>) v));
            } else if (v instanceof java.util.List) {
                org.json.JSONArray arr = new org.json.JSONArray();
                for (Object o : (java.util.List<?>) v) arr.put(o);
                obj.put(e.getKey(), arr);
            } else {
                obj.put(e.getKey(), v);
            }
        }
        return obj;
    }
}
