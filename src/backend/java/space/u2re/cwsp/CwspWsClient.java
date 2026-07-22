/*
 * Filename: CwspWsClient.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwspWsClient.java
 * Change date and time: 13.15.00_21.07.2026
 * Reason for changes: Soft network drop + reconnectNow — never clear wantConnected on capability flaps.
 *   2026-07-20: sendClipboardAsset strips uri/path so Share screenshots pass DataAsset validation.
 *   2026-07-21: idle/Doze half-open /ws — OkHttp pingInterval + inbound watchdog + force reconnect
 *     on network available (sticky open=true lied after NAT drop).
 *   2026-07-21d: inbound files:offer|files:error → FilesIncomingNotifier + WebView
 *     handoff (native /ws path never reached the Capacitor toast/bridge alone).
 *   2026-07-21e: mapToJson deep-converts List&lt;Map&gt; (Cap↔Cap batches were Map.toString).
 *   2026-07-22g: resolveClipboardWhat — Neu packets with action/purpose/nested what
 *     must still route to Cap inbound ask (bare what/type was dropping desk→phone).
 */

package space.u2re.cwsp;

import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;

import org.json.JSONObject;

import java.util.ArrayList;
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
import emission.FilesIncomingNotifier;
import emission.PathCapabilityMesh;
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
    /** OkHttp protocol ping — detects half-open TCP after Doze/NAT without app JSON. */
    private static final long OKHTTP_PING_SEC = 15L;
    /** No inbound (incl. pong/hello) for this long → soft-drop + reconnect. */
    private static final long INBOUND_STALE_MS = 45_000L;
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
    private final ConnectivityManager.NetworkCallback networkCallback;
    private final ConnectivityManager connectivityManager;

    private WebSocket socket;
    /** Wall-clock of last inbound WS frame (any type) — half-open detection. */
    private volatile long lastInboundMs = 0L;
    private final Runnable pingTask = new Runnable() {
        @Override
        public void run() {
            if (!wantConnected.get() || !open.get() || socket == null) return;
            long silentFor = System.currentTimeMillis() - lastInboundMs;
            if (lastInboundMs > 0L && silentFor > INBOUND_STALE_MS) {
                Log.w(TAG, "[socket:pong-timeout] silentForMs=" + silentFor);
                softDropSocket("pong-timeout");
                scheduleReconnect();
                return;
            }
            try {
                JSONObject ping = new JSONObject();
                ping.put("type", "ping");
                ping.put("ts", System.currentTimeMillis());
                boolean ok = socket.send(ping.toString());
                if (!ok) {
                    Log.w(TAG, "[socket:initiate-error] ping send rejected");
                    softDropSocket("ping-send-rejected");
                    scheduleReconnect();
                    return;
                }
            } catch (Exception e) {
                Log.w(TAG, "[socket:initiate-error] ping failed", e);
                softDropSocket("ping-failed");
                scheduleReconnect();
                return;
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
                // WHY: was 0 — after idle/Doze TCP stayed OPEN with no onClosed; buttons looked dead.
                .pingInterval(OKHTTP_PING_SEC, TimeUnit.SECONDS)
                .build();

        // Initialize network callback
        this.networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                // WHY: half-open sockets report isOpen()=true — always replace on new network.
                Log.d(TAG, "Network available — force /ws reconnect");
                if (wantConnected.get()) {
                    reconnectNow();
                }
                // WHY: path mesh must re-probe after Wi‑Fi↔LTE before next Share/Accept.
                PathCapabilityMesh.scheduleRefresh("network");
            }

            @Override
            public void onLost(Network network) {
                // WHY: do not call disconnect() — that clears wantConnected and kills reconnect.
                Log.d(TAG, "Network lost — soft drop /ws");
                bgHandler.post(() -> {
                    softDropSocket("network-lost");
                    scheduleReconnect();
                });
            }

            @Override
            public void onCapabilitiesChanged(Network network, NetworkCapabilities networkCapabilities) {
                boolean isWifi = networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI);
                boolean isCellular = networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR);
                boolean isValidated = networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);

                Log.d(TAG, "WiFi: " + isWifi + ", Cellular: " + isCellular + ", Has Internet: " + isValidated);

                if ((isWifi || isCellular) && isValidated && wantConnected.get()) {
                    // WHY: WiFi↔LTE can leave a zombie socket with open=true.
                    if (!isOpen() || isInboundStale()) {
                        reconnectNow();
                    }
                    PathCapabilityMesh.scheduleRefresh("network");
                }
                // INVARIANT: never disconnect() on unvalidated flaps — scheduleReconnect handles closes.
            }
        };

        // Initialize connectivity manager
        this.connectivityManager = (ConnectivityManager) appContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (this.connectivityManager != null) {
            this.connectivityManager.registerNetworkCallback(new NetworkRequest.Builder().build(), networkCallback);
        }
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
        return open.get() && socket != null && !isInboundStale();
    }

    /** Sticky flag only — for diagnostics. Prefer {@link #isOpen()} for send paths. */
    public boolean isSocketFlagOpen() {
        return open.get();
    }

    private boolean isInboundStale() {
        if (!open.get()) return false;
        if (lastInboundMs <= 0L) return false;
        return System.currentTimeMillis() - lastInboundMs > INBOUND_STALE_MS;
    }

    public void connectIfNotOpen() {
        if (isOpen()) { return; }
        connect();
    }

    public void connect() {
        wantConnected.set(true);
        bgHandler.post(this::connectNow);
    }

    /**
     * Force a fresh dial (settings/token change) without clearing {@code wantConnected}.
     * WHY: connectNow() skips when already open — RECONNECT must replace the socket.
     */
    public void reconnectNow() {
        wantConnected.set(true);
        bgHandler.post(() -> {
            softDropSocket("reconnect-now");
            attempt.set(0);
            connectNow();
        });
    }

    /** Close the live socket but keep reconnect intent. */
    private void softDropSocket(String reason) {
        Runnable drop = () -> {
            bgHandler.removeCallbacks(pingTask);
            lastInboundMs = 0L;
            if (socket != null) {
                try {
                    socket.close(1000, reason != null ? reason : "soft-drop");
                } catch (Exception ignored) {
                    try {
                        socket.cancel();
                    } catch (Exception ignored2) {
                        /* best-effort */
                    }
                }
                socket = null;
            }
            open.set(false);
        };
        if (Looper.myLooper() == bgHandler.getLooper()) {
            drop.run();
        } else {
            bgHandler.post(drop);
        }
    }

    public boolean waitUntilConnected(long timeoutMs) {
        if (timeoutMs <= 0) {
            timeoutMs = 10000L;
        }
        if (isOpen()) {
            return true;
        }
        long startTime = System.currentTimeMillis();
        while (!isOpen() && System.currentTimeMillis() - startTime < timeoutMs) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Log.w(TAG, "waitUntilConnected interrupted", e);
                break;
            }
        }
        if (!isOpen()) {
            Log.w(TAG, "waitUntilConnected timed out");
            return false;
        }
        return true;
    }

    public void disconnect() {
        wantConnected.set(false);
        PathCapabilityMesh.stop();
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
        if (isInboundStale()) {
            Log.w(TAG, "send skipped — inbound stale; reconnecting");
            reconnectNow();
            return false;
        }
        try {
            JSONObject json = mapToJson(packet);
            String body = json.toString();
            boolean ok = socket.send(body);
            // WHY: OkHttp rejects >16MiB queue with send()=false + close 1001 (no exception).
            // Surface the byte size so Android→Win image failures are diagnosable.
            if (!ok) {
                Log.w(TAG, "send rejected (OkHttp 16MiB queue overflow?) bytes=" + body.length()
                        + " what=" + packet.get("what"));
                softDropSocket("send-rejected");
                scheduleReconnect();
            }
            return ok;
        } catch (Exception e) {
            Log.w(TAG, "send failed", e);
            softDropSocket("send-failed");
            scheduleReconnect();
            return false;
        }
    }

    public boolean sendClipboardUpdate(String text, String clientId) {
        if (text == null) return false;
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("text", text);
        return sendClipboardPacket(payload, clientId);
    }

    /**
     * Fan-out image/file share as {@code clipboard:update} with {@code payload.asset}
     * (DataAssetEnvelope — hash/name/mimeType/size/source/data).
     */
    public boolean sendClipboardAsset(Map<String, Object> asset, String clientId) {
        if (asset == null || asset.isEmpty()) return false;
        // WHY: Clipboard.writeAsset used to stash FileProvider uri/path on the same Map;
        // hub/gateway Payload.normalizeDataAsset rejects unknown keys → silent Share drop.
        Map<String, Object> wire = emission.Clipboard.toWireDataAsset(asset);
        if (wire == null || wire.isEmpty()) {
            Log.w(TAG, "sendClipboardAsset: empty after wire compact");
            return false;
        }
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("asset", wire);
        Object name = wire.get("name");
        if (name != null) payload.put("name", name);
        Object mime = wire.get("mimeType");
        if (mime == null) mime = wire.get("type");
        if (mime != null) payload.put("mimeType", mime);
        return sendClipboardPacket(payload, clientId);
    }

    private boolean sendClipboardPacket(Map<String, Object> payload, String clientId) {
        // WHY: phone-only prefs (L-196;L-210) made Android↔Android work but skipped desk.
        // INVARIANT: non-wildcard clipboard fan-out always includes L-110.
        List<String> destinations = ensureDeskInDestinations(
                Configure.readClipboardDestinations(appContext));
        int assetB64 = 0;
        if (payload != null && payload.containsKey("asset")) {
            Object a = payload.get("asset");
            if (a instanceof Map) {
                Object d = ((Map<?, ?>) a).get("data");
                if (d instanceof String) assetB64 = ((String) d).length();
            }
        }
        // WHY: proves destinations include L-110 and shows base64 size vs OkHttp 16MiB cap.
        Log.i(TAG, "clipboard fan-out destinations=" + destinations
                + " hasAsset=" + (payload != null && payload.containsKey("asset"))
                + " assetB64=" + assetB64);
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
        packet.put("payload", payload);
        return send(packet);
    }

    /** Prepend desk peer when missing; leave {@code *} alone. */
    private static List<String> ensureDeskInDestinations(List<String> raw) {
        List<String> dests = raw != null ? raw : new ArrayList<>();
        try {
            return Configure.ensureDeskPeerInDestinations(dests);
        } catch (Throwable ignored) {
            /* older Configure without helper — inline below */
        }
        if (dests.isEmpty()) {
            List<String> out = new ArrayList<>(1);
            out.add("L-110");
            return out;
        }
        if (dests.size() == 1 && "*".equals(dests.get(0))) return dests;
        for (String d : dests) {
            if (d == null) continue;
            String t = d.trim();
            if ("L-110".equalsIgnoreCase(t) || "L-192.168.0.110".equalsIgnoreCase(t)) {
                return dests;
            }
            // Short/full collapse: L-110 / L-192.168.0.110
            if (t.matches("(?i)L-192\\.168\\.0\\.110") || t.equalsIgnoreCase("110")) {
                return dests;
            }
        }
        List<String> out = new ArrayList<>(dests.size() + 1);
        out.add("L-110");
        out.addAll(dests);
        return out;
    }

    private void connectNow() {
        if (!wantConnected.get()) return;
        if (!isConfigured()) {
            Log.i(TAG, "[socket:initiate-failed] missing endpoint/clientId/token");
            return;
        }
        // Skip replace when already open — avoids CONFIGURE double-start races.
        // WHY: sticky open + half-open TCP after Doze — isOpen() is false but open flag stays true.
        if (open.get() && socket != null) {
            if (isInboundStale()) {
                Log.w(TAG, "[socket:transport-connect] replacing stale half-open");
                softDropSocket("stale-before-connect");
            } else {
                Log.i(TAG, "[socket:transport-connect] already-open");
                return;
            }
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
                lastInboundMs = System.currentTimeMillis();
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
                // WHY: continuous path mesh — probe Cap peers + gateways after hello.
                PathCapabilityMesh.start(appContext, CwspWsClient.this);
                PathCapabilityMesh.scheduleRefresh("ws-open");
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                lastInboundMs = System.currentTimeMillis();
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
            // WHY: gateway may reply JSON pong; counts as liveness (lastInboundMs set in onMessage).
            if ("pong".equals(type) || "hello".equals(type) || "welcome".equals(type)) {
                return;
            }
            Map<String, Object> packet = JsonMaps.fromJSONObject(obj);
            // WHY: keep `what` effectively final for lambdas — never reassign after resolve.
            // Prefer files:* before clipboard heuristics (purpose=storage + empty what).
            final String what = resolveInboundWhat(packet);
            // WHY: path-capability mesh announces share /ws — never clipboard/files UI.
            if (PathCapabilityMesh.WHAT.equals(what)
                    || "network.pathCapability".equals(what)) {
                PathCapabilityMesh.handleInbound(packet);
                return;
            }
            if (what.startsWith("clipboard:") || what.startsWith("airpad:clipboard:")
                    || "clipboard".equals(what)) {
                if ("clipboard".equals(what) || what.isEmpty()) {
                    packet.put("what", "clipboard:update");
                } else if (!packet.containsKey("what") || String.valueOf(packet.get("what")).isEmpty()) {
                    packet.put("what", what);
                }
                final String routeWhat = "clipboard".equals(what) || what.isEmpty()
                        ? "clipboard:update" : what;
                mainHandler.post(() -> {
                    try {
                        // WHY: route through the bridge service so phase-2 prompt
                        // policy (shell.clipboardInboundMode) can hold/apply/undo.
                        // Falls back to direct dispatch when the service is not alive.
                        CwspBridgeService.routeInbound(appContext, packet, coordinator);
                    } catch (Exception e) {
                        Log.w(TAG, "inbound clipboard route failed what=" + routeWhat, e);
                    }
                });
                return;
            }
            // WHY: when Java owns /ws, WebView never sees files:offer frames.
            // Post the system notification here and hand off to WebView for toast.
            if ("files:offer".equals(what) || "files:error".equals(what)) {
                mainHandler.post(() -> routeInboundFilesOffer(packet, what));
            } else if ("files:accept".equals(what)
                    || "files:done".equals(what)
                    || "files:decline".equals(what)
                    || "files:progress".equals(what)) {
                // WHY: update Cap sender outgoing upload notif lifecycle (per-peer).
                mainHandler.post(() -> routeInboundFilesTransferSignal(packet, what));
            }
        } catch (Exception e) {
            Log.w(TAG, "inbound parse failed", e);
        }
    }

    /**
     * Route files:accept|done|decline|progress to outgoing session UI (sender Cap).
     * INVARIANT: does not post incoming-offer heads-up. Peer id from packet sender.
     */
    private void routeInboundFilesTransferSignal(Map<String, Object> packet, String what) {
        try {
            Map<String, Object> payload = extractMapCarrier(packet, "payload", "data", "result", "results");
            String tid = "";
            if (payload != null && payload.get("transferId") != null) {
                tid = String.valueOf(payload.get("transferId")).trim();
            }
            if (tid.isEmpty() && packet.get("transferId") != null) {
                tid = String.valueOf(packet.get("transferId")).trim();
            }
            String sessionId = emission.FilesOutboundOffer.resolveSessionId(tid);
            if (sessionId == null || sessionId.isEmpty()) {
                Log.d(TAG, "files signal ignored what=" + what + " tid=" + tid);
                return;
            }
            String peerId = "";
            Object sender = packet.get("sender");
            if (sender == null) sender = packet.get("byId");
            if (sender == null) sender = packet.get("from");
            if (sender != null) peerId = String.valueOf(sender).trim();
            if ("files:accept".equals(what)) {
                emission.FilesOutboundOffer.onPeerAccepted(appContext, sessionId, peerId);
            } else if ("files:done".equals(what)) {
                int count = intOf(payload != null ? payload : packet, "fileCount");
                emission.FilesOutboundOffer.onPeerDone(appContext, sessionId, peerId, count);
            } else if ("files:decline".equals(what)) {
                emission.FilesOutboundOffer.onPeerDeclined(appContext, sessionId, peerId);
            } else if ("files:progress".equals(what)) {
                Map<String, Object> src = payload != null ? payload : packet;
                long bytesDone = longOf(src, "bytesDone");
                if (bytesDone <= 0) bytesDone = longOf(src, "done");
                long totalBytes = longOf(src, "totalBytes");
                if (totalBytes <= 0) totalBytes = longOf(src, "total");
                long speedBps = longOf(src, "speedBps");
                emission.FilesOutboundOffer.onPeerProgress(
                        appContext, sessionId, peerId, bytesDone, totalBytes, speedBps);
            }
            Log.i(TAG, "outbound signal what=" + what + " transferId=" + sessionId
                    + " peer=" + peerId + " rawTid=" + tid);
        } catch (Exception e) {
            Log.w(TAG, "routeInboundFilesTransferSignal failed", e);
        }
    }

    /**
     * Native /ws path for inbound files:offer|files:error.
     * INVARIANT: uses FilesIncomingNotifier (not clipboard prompt channels).
     */
    private void routeInboundFilesOffer(Map<String, Object> packet, String what) {
        try {
            Map<String, Object> payload = extractMapCarrier(packet, "payload", "data", "result", "results");
            Map<String, Object> offerMap = new LinkedHashMap<>();
            if (payload != null) {
                offerMap.putAll(payload);
            }
            Object sender = packet.get("sender");
            if (sender == null) sender = packet.get("byId");
            if (sender == null) sender = packet.get("from");
            if (sender != null && !offerMap.containsKey("sender")) {
                offerMap.put("sender", String.valueOf(sender));
            }
            boolean isError = what != null && what.contains("error");
            // WHY: peer Abort while we are the sender — update outgoing upload UI.
            if (isError && looksAbortedPayload(offerMap)) {
                String tid = offerMap.get("transferId") != null
                        ? String.valueOf(offerMap.get("transferId")) : "";
                if (emission.FilesOutboundOffer.hasSession(tid)) {
                    int done = intOf(offerMap, "done");
                    int remaining = intOf(offerMap, "remaining");
                    try {
                        emission.FilesOutboundOffer.onRemoteAbort(appContext, tid, done, remaining);
                    } catch (Throwable t) {
                        Log.w(TAG, "onRemoteAbort failed", t);
                    }
                }
            }
            FilesIncomingNotifier.notify(appContext, offerMap, isError);

            Map<String, Object> detail = new LinkedHashMap<>();
            detail.put("what", what);
            detail.put("payload", payload != null ? payload : new LinkedHashMap<>());
            detail.put("sender", sender != null ? String.valueOf(sender) : "");
            detail.put("uuid", packet.get("uuid") != null ? String.valueOf(packet.get("uuid")) : "");
            detail.put("from", packet.get("from") != null ? String.valueOf(packet.get("from")) : "");
            CwsBridgePlugin.emitFilesIncomingOffer(detail);
            Log.i(TAG, "inbound files route what=" + what
                    + " transferId=" + offerMap.get("transferId"));
        } catch (Exception e) {
            Log.w(TAG, "inbound files route failed", e);
        }
    }

    private static boolean looksAbortedPayload(Map<String, Object> m) {
        if (m == null) return false;
        String code = m.get("code") != null ? String.valueOf(m.get("code")) : "";
        String msg = m.get("message") != null ? String.valueOf(m.get("message")) : "";
        if (msg.isEmpty() && m.get("reason") != null) msg = String.valueOf(m.get("reason"));
        String blob = (code + " " + msg).toLowerCase(java.util.Locale.US);
        return blob.contains("abort") || blob.contains("cancel");
    }

    /**
     * Resolve inbound {@code what} for clipboard + files routing.
     * WHY: files:accept|done must win over clipboard purpose heuristics, and
     * gateway frames sometimes blank {@code what} while keeping payload shape.
     */
    @SuppressWarnings("unchecked")
    private static String resolveInboundWhat(Map<String, Object> packet) {
        if (packet == null) return "";
        Map<String, Object> payload = null;
        Object p = packet.get("payload");
        if (p instanceof Map) payload = (Map<String, Object>) p;
        Object[] candidates = {
                packet.get("what"), packet.get("type"), packet.get("action"),
                payload != null ? payload.get("what") : null,
                payload != null ? payload.get("type") : null,
                payload != null ? payload.get("action") : null,
                payload != null ? payload.get("op") : null
        };
        for (Object c : candidates) {
            String w = c != null ? String.valueOf(c).trim() : "";
            if (w.startsWith("files:")) return w;
            if (PathCapabilityMesh.WHAT.equals(w) || "network.pathCapability".equals(w)) {
                return PathCapabilityMesh.WHAT;
            }
        }
        // Shape heuristics when relay cleared what/type.
        if (payload != null && payload.get("transferId") != null) {
            Object batches = payload.get("batches");
            if (batches instanceof java.util.List && !((java.util.List<?>) batches).isEmpty()) {
                return "files:offer";
            }
            // WHY: progress carries bytesDone — must win before fileCount→done.
            if (payload.containsKey("bytesDone") || payload.containsKey("totalBytes")) {
                return "files:progress";
            }
            if (payload.containsKey("fileCount")
                    || (payload.get("summary") instanceof Map
                    && ((Map<?, ?>) payload.get("summary")).containsKey("fileCount"))) {
                return "files:done";
            }
            if (emission.FilesOutboundOffer.hasSession(String.valueOf(payload.get("transferId")))) {
                return "files:accept";
            }
        }
        return resolveClipboardWhat(packet);
    }

    /**
     * COMPAT: resolve clipboard action from what/type/action/nested/purpose.
     * WHY: some Neu/gateway frames leave what empty but purpose=clipboard.
     */
    @SuppressWarnings("unchecked")
    private static String resolveClipboardWhat(Map<String, Object> packet) {
        if (packet == null) return "";
        Map<String, Object> payload = null;
        Map<String, Object> data = null;
        Object p = packet.get("payload");
        if (p instanceof Map) payload = (Map<String, Object>) p;
        Object d = packet.get("data");
        if (d instanceof Map) data = (Map<String, Object>) d;
        Object[] candidates = {
                packet.get("what"), packet.get("type"), packet.get("action"),
                payload != null ? payload.get("what") : null,
                payload != null ? payload.get("type") : null,
                payload != null ? payload.get("action") : null,
                payload != null ? payload.get("op") : null,
                data != null ? data.get("what") : null,
                data != null ? data.get("type") : null,
                data != null ? data.get("action") : null
        };
        for (Object c : candidates) {
            String w = c != null ? String.valueOf(c).trim() : "";
            if (w.isEmpty()) continue;
            String lower = w.toLowerCase(java.util.Locale.US);
            if ("clipboard".equals(lower)
                    || lower.startsWith("clipboard:")
                    || lower.startsWith("airpad:clipboard:")) {
                return "clipboard".equals(lower) ? "clipboard:update" : w;
            }
        }
        String purpose = String.valueOf(
                packet.get("purpose") != null ? packet.get("purpose")
                        : (payload != null && payload.get("purpose") != null
                        ? payload.get("purpose") : "")).trim().toLowerCase(java.util.Locale.US);
        if ("clipboard".equals(purpose)) {
            boolean hasText = payload != null && (
                    payload.get("text") instanceof String
                            || payload.get("content") instanceof String);
            boolean hasAsset = payload != null && (
                    payload.get("asset") != null
                            || payload.get("dataAsset") != null
                            || payload.get("image") != null);
            if (hasText || hasAsset) return "clipboard:update";
        }
        Object what = packet.get("what");
        if (what == null) what = packet.get("type");
        return what != null ? String.valueOf(what).trim() : "";
    }

    private static int intOf(Map<String, Object> m, String key) {
        if (m == null) return 0;
        Object v = m.get(key);
        if (v instanceof Number) return ((Number) v).intValue();
        if (v instanceof String) {
            try { return Integer.parseInt((String) v); } catch (NumberFormatException e) { return 0; }
        }
        Object summary = m.get("summary");
        if (summary instanceof Map) {
            Object nested = ((Map<?, ?>) summary).get(key);
            if (nested instanceof Number) return ((Number) nested).intValue();
        }
        return 0;
    }

    private static long longOf(Map<String, Object> m, String key) {
        if (m == null || key == null) return 0L;
        Object v = m.get(key);
        if (v instanceof Number) return ((Number) v).longValue();
        if (v instanceof String) {
            try { return Long.parseLong((String) v); } catch (NumberFormatException e) { return 0L; }
        }
        return 0L;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> extractMapCarrier(Map<String, Object> packet, String... keys) {
        if (packet == null) return null;
        for (String key : keys) {
            Object v = packet.get(key);
            if (v instanceof Map) {
                return (Map<String, Object>) v;
            }
        }
        return null;
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

    /**
     * Deep Map/List → JSONObject. WHY (2026-07-21 Cap↔Cap Saved 0): a previous
     * list branch did {@code arr.put(o)} for nested Maps — org.json stringifies
     * unknown types via {@code Map.toString()}, so peers persisted
     * {@code batches:["{batchId=…, asset={…}}"]} and Accept skipped every batch.
     */
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
        if (v instanceof java.util.List) {
            org.json.JSONArray arr = new org.json.JSONArray();
            for (Object o : (java.util.List<?>) v) arr.put(toJsonValue(o));
            return arr;
        }
        if (v instanceof JSONObject || v instanceof org.json.JSONArray) return v;
        return v;
    }
}
