/*
 * Filename: PathCapabilityMesh.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/PathCapabilityMesh.java
 * Change date and time: 17.50.00_23.07.2026
 * Reason for changes: Continuous P2P Path Capability Mesh — Cap/Java runner.
 *   Probes lan-direct (Control pair/hello) + lan/wan gateway (/lna-probe) on WS
 *   open, network change, and ~45s interval; announces network:pathCapability;
 *   Accept drops known-down lan-direct URLs (never gateway-first when unknown).
 *   2026-07-23: retain verified direct peer origins for hub-independent dial.
 */

package emission;

import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import core.Configure;
import space.u2re.cwsp.ControlApiServer;
import space.u2re.cwsp.CwspWsClient;

/**
 * Continuous path-capability mesh for Cap. Payload shape matches cwsp-shared
 * {@code network:pathCapability}.
 */
public final class PathCapabilityMesh {
    private static final String TAG = "path-capability";
    public static final String WHAT = "network:pathCapability";
    private static final long DEFAULT_TTL_MS = 90_000L;
    private static final long INTERVAL_MS = 45_000L;
    private static final String PEER_ENDPOINT_PREFS = "cwsp_path_capability";
    private static final String PEER_ENDPOINTS_KEY = "cwsp_peer_endpoints_v1";
    private static final String[] FLEET_PEERS = {
            "L-110", "L-196", "L-208", "L-210"
    };

    private static final ConcurrentHashMap<String, CacheEntry> CACHE = new ConcurrentHashMap<>();
    private static final AtomicBoolean REFRESHING = new AtomicBoolean(false);
    private static final AtomicBoolean PERSISTED_ENDPOINTS_LOADED = new AtomicBoolean(false);
    private static final ExecutorService EXEC = Executors.newSingleThreadExecutor(r -> {
        Thread t = new Thread(r, "cwsp-path-mesh");
        t.setDaemon(true);
        return t;
    });

    private static volatile Handler intervalHandler;
    private static volatile Runnable intervalTask;
    private static volatile Context appCtx;
    private static volatile CwspWsClient wsClient;

    private PathCapabilityMesh() {
    }

    public static void start(Context app, CwspWsClient ws) {
        if (app == null || ws == null) return;
        appCtx = app.getApplicationContext();
        wsClient = ws;
        loadPersistedPeerEndpoints(appCtx);
        if (intervalHandler == null) {
            intervalHandler = new Handler(Looper.getMainLooper());
        }
        stopInterval();
        final long jitter = (long) ((Math.random() * 20 - 10) * 1000);
        intervalTask = new Runnable() {
            @Override
            public void run() {
                scheduleRefresh("interval");
                if (intervalHandler != null) {
                    intervalHandler.postDelayed(this, INTERVAL_MS + jitter);
                }
            }
        };
        intervalHandler.postDelayed(intervalTask, 2_000L);
        Log.i(TAG, "mesh-started intervalMs=" + INTERVAL_MS);
    }

    public static void stop() {
        stopInterval();
        wsClient = null;
    }

    private static void stopInterval() {
        if (intervalHandler != null && intervalTask != null) {
            intervalHandler.removeCallbacks(intervalTask);
        }
        intervalTask = null;
    }

    /** Debounced refresh (network change / hello). */
    public static void scheduleRefresh(String reason) {
        if (intervalHandler == null) {
            intervalHandler = new Handler(Looper.getMainLooper());
        }
        intervalHandler.removeCallbacks(refreshRunnable);
        final String r = reason != null ? reason : "manual";
        refreshRunnable = () -> EXEC.execute(() -> refreshNow(r));
        long delay = "network".equals(r) ? 1_000L : 200L;
        intervalHandler.postDelayed(refreshRunnable, delay);
    }

    private static Runnable refreshRunnable = () -> {
    };

    public static void refreshNow(String reason) {
        if (!REFRESHING.compareAndSet(false, true)) return;
        Context app = appCtx;
        try {
            if (app == null) {
                Log.d(TAG, "probe-skip reason=" + reason + " (no app)");
                return;
            }
            // WHY: hub may be down — still probe lan-direct for autonomy dials.
            // Announce only when a socket is available.
            CwspWsClient ws = wsClient;
            boolean canAnnounce = ws != null && ws.isOpen();
            String localId = Configure.readClientId(app);
            if (localId == null || localId.isEmpty()) localId = "L-unknown";

            LinkedHashSet<String> peers = new LinkedHashSet<>();
            Collections.addAll(peers, FLEET_PEERS);
            peers.remove(localId);
            peers.remove(shortId(localId));
            // Cap ~12 peers.
            List<String> peerList = new ArrayList<>();
            for (String p : peers) {
                if (peerList.size() >= 12) break;
                peerList.add(p);
            }

            String lanGw = "https://" + FilesBlobStore.LAN_GATEWAY_HOST + ":8434";
            String wanHost = FilesBlobStore.resolveWanGatewayHost(app);
            String wanGw = "https://" + wanHost + ":8434";

            List<Probe> paths = new ArrayList<>();
            for (String toId : peerList) {
                String host = FilesOutboundOffer.lanHostFromClientId(toId);
                if (host == null || host.isEmpty()) continue;
                // WHY: Cap Control is :8434; Neu desk Control/blobs are :29110.
                Probe p = probeLanDirect(toId, host);
                paths.add(p);
                putCache(p);
            }
            Probe lanGwProbe = probe("L-200", "lan-gateway", lanGw + "/lna-probe", "GET", 3_000);
            Probe wanGwProbe = probe("L-wan", "wan-gateway", wanGw + "/lna-probe", "GET", 5_000);
            putCache(lanGwProbe);
            putCache(wanGwProbe);
            paths.add(lanGwProbe);
            paths.add(wanGwProbe);
            for (String toId : peerList) {
                Probe lg = new Probe(toId, "lan-gateway", lanGwProbe.ok, lanGwProbe.rttMs,
                        lanGwProbe.origin, lanGwProbe.error);
                Probe wg = new Probe(toId, "wan-gateway", wanGwProbe.ok, wanGwProbe.rttMs,
                        wanGwProbe.origin, wanGwProbe.error);
                putCache(lg);
                putCache(wg);
                paths.add(lg);
                paths.add(wg);
            }
            persistPeerEndpoints(app);

            List<String> lanDirectOk = new ArrayList<>();
            List<String> lanDirectDown = new ArrayList<>();
            for (Probe p : paths) {
                if (!"lan-direct".equals(p.routeClass)) continue;
                if (p.ok) lanDirectOk.add(p.toId);
                else lanDirectDown.add(p.toId);
            }
            Log.i(TAG, "probe-complete reason=" + reason
                    + " localId=" + localId
                    + " pathCount=" + paths.size()
                    + " lanDirectOk=" + lanDirectOk
                    + " lanDirectDown=" + lanDirectDown
                    + " announce=" + canAnnounce);

            if (canAnnounce) {
                Map<String, Object> packet = buildAnnouncePacket(app, localId, paths);
                boolean sent = ws.send(packet);
                Log.i(TAG, "announce sent=" + sent + " paths=" + paths.size());
            }
        } catch (Exception e) {
            Log.w(TAG, "refresh failed reason=" + reason, e);
        } finally {
            REFRESHING.set(false);
        }
    }

    /** Fresh peer ids with lan-direct ok (for peer `/ws` dial when hub down). */
    public static List<String> listLanDirectUpPeers() {
        List<String> out = new ArrayList<>();
        long now = System.currentTimeMillis();
        for (Map.Entry<String, CacheEntry> e : CACHE.entrySet()) {
            CacheEntry ce = e.getValue();
            if (ce == null || ce.expiresAt <= now) continue;
            Probe p = ce.probe;
            if (p == null || !"lan-direct".equals(p.routeClass) || !p.ok) continue;
            String id = p.toId;
            if (id != null && !id.isEmpty() && !out.contains(id)) out.add(id);
        }
        return out;
    }

    /**
     * Verified direct Control origins for a peer, ordered LAN before WAN.
     * WHY: a public direct route is useful when the hub is down, but an
     * identity-verified LAN endpoint remains lower-latency and preferred.
     */
    public static List<String> listPeerEndpoints(String toId) {
        List<String> lan = new ArrayList<>();
        List<String> wan = new ArrayList<>();
        long now = System.currentTimeMillis();
        for (CacheEntry ce : CACHE.values()) {
            if (ce == null || ce.expiresAt <= now || ce.probe == null) continue;
            Probe p = ce.probe;
            if (!p.ok || !p.verified || !samePeerId(p.toId, toId) || p.origin.isEmpty()) continue;
            if ("lan-direct".equals(p.routeClass)) {
                if (!lan.contains(p.origin)) lan.add(p.origin);
            } else if ("wan-direct".equals(p.routeClass)) {
                if (!wan.contains(p.origin)) wan.add(p.origin);
            }
        }
        List<String> out = new ArrayList<>(lan.size() + wan.size());
        out.addAll(lan);
        out.addAll(wan);
        return out;
    }

    /** Ordered Control `/ws` dial URLs for a peer (Cap :8434; desk + :29110). */
    public static List<String> peerControlWsCandidates(String toId) {
        List<String> out = new ArrayList<>();
        String host = FilesOutboundOffer.lanHostFromClientId(toId);
        if (host == null || host.isEmpty()) return out;
        boolean desk = "192.168.0.110".equals(host)
                || "L-110".equalsIgnoreCase(toId)
                || "L-192.168.0.110".equalsIgnoreCase(toId);
        out.add("ws://" + host + ":8434/ws");
        if (desk) out.add("ws://" + host + ":29110/ws");
        return out;
    }

    /** Merge inbound announce (remote view) into local cache. */
    public static void handleInbound(Map<String, Object> packet) {
        if (packet == null) return;
        Object payloadObj = packet.get("payload");
        if (!(payloadObj instanceof Map)) return;
        @SuppressWarnings("unchecked")
        Map<String, Object> payload = (Map<String, Object>) payloadObj;
        Object pathsObj = payload.get("paths");
        if (!(pathsObj instanceof List)) return;
        long ttl = toLong(payload.get("ttlMs"), DEFAULT_TTL_MS);
        long baseTs = toLong(payload.get("ts"), System.currentTimeMillis());
        @SuppressWarnings("unchecked")
        List<Object> paths = (List<Object>) pathsObj;
        int merged = 0;
        for (Object item : paths) {
            if (!(item instanceof Map)) continue;
            @SuppressWarnings("unchecked")
            Map<String, Object> p = (Map<String, Object>) item;
            String toId = str(p.get("toId"));
            String cls = str(p.get("class"));
            if (toId.isEmpty() || !isRouteClass(cls)) continue;
            Probe probe = new Probe(
                    toId,
                    cls,
                    Boolean.TRUE.equals(p.get("ok")) || "true".equalsIgnoreCase(str(p.get("ok"))),
                    toLong(p.get("rttMs"), -1),
                    str(p.get("origin")),
                    str(p.get("error"))
            );
            long ts = toLong(p.get("ts"), baseTs);
            probe.ts = ts;
            putCache(probe, ttl);
            merged++;
        }
        persistPeerEndpoints(appCtx);
        Log.i(TAG, "inbound-merged fromId=" + str(payload.get("fromId")) + " pathCount=" + merged);

        // ask → answer with local snapshot
        if ("ask".equals(str(packet.get("op")))) {
            Context app = appCtx;
            CwspWsClient ws = wsClient;
            if (app == null || ws == null) return;
            String localId = Configure.readClientId(app);
            Map<String, Object> reply = buildAnnouncePacket(app, localId, listFresh());
            reply.put("op", "result");
            Object uuid = packet.get("uuid");
            if (uuid != null) reply.put("uuid", uuid);
            List<String> dest = new ArrayList<>();
            dest.add(str(payload.get("fromId")));
            reply.put("destinations", dest);
            ws.send(reply);
        }
    }

    public static boolean isLanDirectKnownDown(String toId) {
        Probe p = getFresh(toId, "lan-direct");
        if (p == null) p = getFresh(shortId(toId), "lan-direct");
        if (p == null) {
            String host = FilesOutboundOffer.lanHostFromClientId(toId);
            if (host != null) p = getFresh(peerIdFromHost(host), "lan-direct");
        }
        return p != null && !p.ok;
    }

    public static boolean isLanDirectKnownUp(String toId) {
        Probe p = getFresh(toId, "lan-direct");
        if (p == null) p = getFresh(shortId(toId), "lan-direct");
        return p != null && p.ok;
    }

    /**
     * Drop known-down lan-direct URLs; keep peer→gwLAN→gwWAN order.
     */
    public static List<String> filterCandidates(List<String> urls, Context app) {
        if (urls == null || urls.isEmpty()) return urls;
        String wanHost = FilesBlobStore.resolveWanGatewayHost(app);
        List<String> peer = new ArrayList<>();
        List<String> gwLan = new ArrayList<>();
        List<String> gwWan = new ArrayList<>();
        List<String> other = new ArrayList<>();
        for (String url : urls) {
            if (url == null || url.isEmpty()) continue;
            try {
                java.net.URI uri = java.net.URI.create(url);
                String host = uri.getHost();
                String path = uri.getRawPath();
                if (host == null) {
                    other.add(url);
                    continue;
                }
                if (FilesBlobStore.LAN_GATEWAY_HOST.equals(host)) {
                    gwLan.add(url);
                    continue;
                }
                if (FilesBlobStore.isWanGatewayHost(app, host)
                        || (wanHost != null && host.equalsIgnoreCase(wanHost))
                        || host.equalsIgnoreCase(FilesBlobStore.WAN_GATEWAY_HOST_FALLBACK)) {
                    gwWan.add(url);
                    continue;
                }
                boolean lanDirect = (path != null && path.contains("/service/files-blob/"))
                        || (path != null && path.contains("/files/blob/") && host.startsWith("192.168."));
                if (lanDirect) {
                    String toId = peerIdFromHost(host);
                    int port = uri.getPort();
                    // WHY: Neu desk blob URLs use :29110; mesh may only have probed
                    // Cap :8434. Never drop desk P2P candidates on that mismatch.
                    boolean deskBlobPort = port == 29110;
                    if (!deskBlobPort && toId != null && isLanDirectKnownDown(toId)) {
                        Log.i(TAG, "filter-skip known-down lan-direct toId=" + toId
                                + " port=" + port);
                        continue;
                    }
                    peer.add(url);
                } else {
                    other.add(url);
                }
            } catch (Exception e) {
                other.add(url);
            }
        }
        List<String> out = new ArrayList<>(peer.size() + gwLan.size() + gwWan.size() + other.size());
        out.addAll(peer);
        out.addAll(gwLan);
        out.addAll(gwWan);
        out.addAll(other);
        return out;
    }

    public static String peerIdFromHost(String host) {
        if (host == null || host.isEmpty()) return null;
        String h = host.toLowerCase(Locale.US);
        if ("192.168.0.110".equals(h)) return "L-110";
        if ("192.168.0.196".equals(h)) return "L-196";
        if ("192.168.0.208".equals(h)) return "L-208";
        if ("192.168.0.210".equals(h)) return "L-210";
        if ("192.168.0.200".equals(h)) return "L-200";
        if (h.matches("^\\d+\\.\\d+\\.\\d+\\.\\d+$")) return "L-" + h;
        return null;
    }

    private static Map<String, Object> buildAnnouncePacket(
            Context app,
            String localId,
            List<Probe> paths
    ) {
        String lanHost = detectLanIpv4();
        if (lanHost == null) lanHost = FilesOutboundOffer.lanHostFromClientId(localId);
        List<Map<String, Object>> pathMaps = new ArrayList<>();
        for (Probe p : paths) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("toId", p.toId);
            m.put("class", p.routeClass);
            m.put("ok", p.ok);
            if (p.rttMs >= 0) m.put("rttMs", p.rttMs);
            if (p.origin != null && !p.origin.isEmpty()) m.put("origin", p.origin);
            if (p.error != null && !p.error.isEmpty()) m.put("error", p.error);
            m.put("ts", p.ts > 0 ? p.ts : System.currentTimeMillis());
            pathMaps.add(m);
        }
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("fromId", localId);
        payload.put("lanHost", lanHost != null ? lanHost : "");
        payload.put("controlPort", 8434);
        payload.put("ts", System.currentTimeMillis());
        payload.put("ttlMs", DEFAULT_TTL_MS);
        payload.put("paths", pathMaps);

        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", WHAT);
        packet.put("type", WHAT);
        packet.put("purpose", "general");
        packet.put("sender", localId);
        packet.put("byId", localId);
        packet.put("uuid", UUID.randomUUID().toString());
        packet.put("timestamp", System.currentTimeMillis());
        List<String> dest = new ArrayList<>();
        dest.add("*");
        packet.put("destinations", dest);
        packet.put("nodes", dest);
        packet.put("payload", payload);
        Map<String, Object> flags = new LinkedHashMap<>();
        flags.put("canonicalV2", true);
        packet.put("flags", flags);
        return packet;
    }

    /**
     * Probe Cap Control (:8434) and Neu desk Control (:29110).
     * Prefer identity-verified GET pair/hello?expectId=…
     */
    private static Probe probeLanDirect(String toId, String host) {
        int[] ports = isDeskPeer(toId, host)
                ? new int[]{8434, 29110}
                : new int[]{8434};
        Probe bestFail = null;
        for (int port : ports) {
            String origin = "http://" + host + ":" + port;
            Probe p = probeIdentityHello(toId, origin, 1_500);
            if (p.ok && p.verified) return p;
            bestFail = p;
            // COMPAT: reachability-only — never verified for dial preference.
            Probe alt = probe(
                    toId,
                    "lan-direct",
                    origin + "/lna-probe",
                    "GET",
                    1_500
            );
            if (alt.ok) {
                alt.verified = false;
                return alt;
            }
            if (bestFail == null || alt.rttMs < bestFail.rttMs) bestFail = alt;
        }
        return bestFail != null ? bestFail
                : new Probe(toId, "lan-direct", false, 0, "http://" + host + ":8434", "unreachable");
    }

    /** GET /service/pair/hello?expectId= — require returned clientId match. */
    private static Probe probeIdentityHello(String toId, String origin, int timeoutMs) {
        long started = System.currentTimeMillis();
        String url = origin + "/service/pair/hello?expectId="
                + Uri.encode(toId != null ? toId : "");
        HttpURLConnection conn = null;
        try {
            conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(timeoutMs);
            conn.setReadTimeout(timeoutMs);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            if (conn instanceof HttpsURLConnection) {
                applyInsecureTls((HttpsURLConnection) conn);
            }
            int code = conn.getResponseCode();
            InputStream stream = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
            String body = readStreamLimited(stream, 4096);
            long rtt = System.currentTimeMillis() - started;
            if (code == 409) {
                return new Probe(toId, "lan-direct", false, rtt, origin, "expectId-mismatch");
            }
            if (code < 200 || code >= 300) {
                return new Probe(toId, "lan-direct", false, rtt, origin, "http-" + code);
            }
            String returned = extractClientIdFromHello(body);
            if (returned == null || returned.isEmpty()
                    || !ControlApiServer.peerIdsEqualJava(returned, toId)) {
                return new Probe(toId, "lan-direct", false, rtt, origin, "identity-mismatch");
            }
            Probe ok = new Probe(toId, "lan-direct", true, rtt, origin, null);
            ok.verified = true;
            return ok;
        } catch (Exception e) {
            String err = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return new Probe(toId, "lan-direct", false,
                    System.currentTimeMillis() - started, origin, err);
        } finally {
            if (conn != null) {
                try {
                    conn.disconnect();
                } catch (Exception ignored) { /* */ }
            }
        }
    }

    private static String extractClientIdFromHello(String body) {
        if (body == null || body.isEmpty()) return null;
        try {
            JSONObject o = new JSONObject(body);
            String id = o.optString("clientId", o.optString("peerId", "")).trim();
            if (!id.isEmpty()) return id;
            JSONObject control = o.optJSONObject("control");
            if (control != null) {
                id = control.optString("clientId", control.optString("peerId", "")).trim();
                if (!id.isEmpty()) return id;
            }
        } catch (Exception ignored) { /* */ }
        return null;
    }

    private static String readStreamLimited(InputStream in, int max) throws Exception {
        if (in == null) return "";
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] buf = new byte[512];
        int n;
        int total = 0;
        while ((n = in.read(buf)) >= 0 && total < max) {
            int take = Math.min(n, max - total);
            bos.write(buf, 0, take);
            total += take;
        }
        return bos.toString("UTF-8");
    }

    private static boolean isDeskPeer(String toId, String host) {
        if (host != null && ("192.168.0.110".equals(host) || host.endsWith(".110"))) return true;
        if (toId == null) return false;
        String id = toId.trim();
        return "L-110".equalsIgnoreCase(id)
                || id.equalsIgnoreCase("L-192.168.0.110");
    }

    private static Probe probe(String toId, String cls, String url, String method, int timeoutMs) {
        long started = System.currentTimeMillis();
        HttpURLConnection conn = null;
        try {
            conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(timeoutMs);
            conn.setReadTimeout(timeoutMs);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestMethod(method);
            if (conn instanceof HttpsURLConnection) {
                applyInsecureTls((HttpsURLConnection) conn);
            }
            int code = conn.getResponseCode();
            boolean ok = code >= 200 && code < 300;
            String origin;
            try {
                java.net.URI u = java.net.URI.create(url);
                origin = u.getScheme() + "://" + u.getHost()
                        + (u.getPort() > 0 ? ":" + u.getPort() : "");
            } catch (Exception e) {
                origin = url;
            }
            return new Probe(toId, cls, ok, System.currentTimeMillis() - started, origin,
                    ok ? null : ("http-" + code));
        } catch (Exception e) {
            String err = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            String origin = "";
            try {
                java.net.URI u = java.net.URI.create(url);
                origin = u.getScheme() + "://" + u.getHost()
                        + (u.getPort() > 0 ? ":" + u.getPort() : "");
            } catch (Exception ignored) { /* */ }
            return new Probe(toId, cls, false, System.currentTimeMillis() - started, origin, err);
        } finally {
            if (conn != null) {
                try {
                    conn.disconnect();
                } catch (Exception ignored) { /* */ }
            }
        }
    }

    private static void applyInsecureTls(HttpsURLConnection conn) {
        try {
            TrustManager[] trustAll = new TrustManager[]{
                    new X509TrustManager() {
                        public void checkClientTrusted(X509Certificate[] c, String a) {
                        }

                        public void checkServerTrusted(X509Certificate[] c, String a) {
                        }

                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }
                    }
            };
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAll, new SecureRandom());
            conn.setSSLSocketFactory(sc.getSocketFactory());
            conn.setHostnameVerifier((h, s) -> true);
        } catch (Exception e) {
            Log.w(TAG, "applyInsecureTls failed", e);
        }
    }

    private static String detectLanIpv4() {
        try {
            Enumeration<NetworkInterface> ifaces = NetworkInterface.getNetworkInterfaces();
            if (ifaces == null) return null;
            while (ifaces.hasMoreElements()) {
                NetworkInterface nif = ifaces.nextElement();
                if (nif == null || !nif.isUp() || nif.isLoopback()) continue;
                Enumeration<InetAddress> addrs = nif.getInetAddresses();
                while (addrs.hasMoreElements()) {
                    InetAddress a = addrs.nextElement();
                    if (!(a instanceof Inet4Address) || a.isLoopbackAddress()) continue;
                    String h = a.getHostAddress();
                    if (h != null && h.startsWith("192.168.")) return h;
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "detectLanIpv4 failed", e);
        }
        return null;
    }

    private static void putCache(Probe p) {
        putCache(p, DEFAULT_TTL_MS);
    }

    private static void putCache(Probe p, long ttlMs) {
        if (p == null || p.toId == null || p.routeClass == null) return;
        if (p.ts <= 0) p.ts = System.currentTimeMillis();
        CACHE.put(cacheKey(p.toId, p.routeClass), new CacheEntry(p, p.ts + Math.max(10L, ttlMs)));
    }

    /** Store only identity-verified direct origins; gateway probes are transient. */
    private static void persistPeerEndpoints(Context app) {
        if (app == null) return;
        try {
            JSONArray entries = new JSONArray();
            long now = System.currentTimeMillis();
            for (Map.Entry<String, CacheEntry> entry : CACHE.entrySet()) {
                CacheEntry ce = entry.getValue();
                if (ce == null || ce.expiresAt <= now || ce.probe == null) continue;
                Probe p = ce.probe;
                if (!p.ok || !p.verified
                        || (!"lan-direct".equals(p.routeClass) && !"wan-direct".equals(p.routeClass))
                        || p.origin.isEmpty()) {
                    continue;
                }
                JSONObject item = new JSONObject();
                item.put("toId", p.toId);
                item.put("class", p.routeClass);
                item.put("origin", p.origin);
                item.put("verified", true);
                item.put("ts", p.ts);
                item.put("expiresAt", ce.expiresAt);
                entries.put(item);
            }
            app.getSharedPreferences(PEER_ENDPOINT_PREFS, Context.MODE_PRIVATE)
                    .edit()
                    .putString(PEER_ENDPOINTS_KEY, entries.toString())
                    .apply();
        } catch (Exception e) {
            Log.d(TAG, "peer endpoint cache persist skipped: " + e.getMessage());
        }
    }

    /** Restore only unexpired direct identity-verified entries. */
    private static void loadPersistedPeerEndpoints(Context app) {
        if (app == null || !PERSISTED_ENDPOINTS_LOADED.compareAndSet(false, true)) return;
        try {
            String raw = app.getSharedPreferences(PEER_ENDPOINT_PREFS, Context.MODE_PRIVATE)
                    .getString(PEER_ENDPOINTS_KEY, "");
            if (raw == null || raw.isEmpty()) return;
            JSONArray entries = new JSONArray(raw);
            long now = System.currentTimeMillis();
            for (int i = 0; i < entries.length(); i++) {
                JSONObject item = entries.optJSONObject(i);
                if (item == null) continue;
                String toId = item.optString("toId", "").trim();
                String cls = item.optString("class", "").trim();
                String origin = item.optString("origin", "").trim();
                long expiresAt = item.optLong("expiresAt", 0L);
                if (toId.isEmpty() || origin.isEmpty() || expiresAt <= now
                        || (!"lan-direct".equals(cls) && !"wan-direct".equals(cls))) {
                    continue;
                }
                Probe p = new Probe(toId, cls, true, -1L, origin, null);
                p.verified = true;
                p.ts = item.optLong("ts", now);
                putCache(p, expiresAt - now);
            }
        } catch (Exception e) {
            Log.d(TAG, "peer endpoint cache load skipped: " + e.getMessage());
        }
    }

    private static Probe getFresh(String toId, String cls) {
        CacheEntry e = CACHE.get(cacheKey(toId, cls));
        if (e == null) return null;
        if (e.expiresAt <= System.currentTimeMillis()) {
            CACHE.remove(cacheKey(toId, cls));
            return null;
        }
        return e.probe;
    }

    private static List<Probe> listFresh() {
        long now = System.currentTimeMillis();
        List<Probe> out = new ArrayList<>();
        for (Map.Entry<String, CacheEntry> e : CACHE.entrySet()) {
            if (e.getValue().expiresAt <= now) {
                CACHE.remove(e.getKey());
                continue;
            }
            out.add(e.getValue().probe);
        }
        return out;
    }

    private static String cacheKey(String toId, String cls) {
        return (toId != null ? toId.trim().toLowerCase(Locale.US) : "") + "|" + cls;
    }

    private static boolean isRouteClass(String cls) {
        return "lan-direct".equals(cls)
                || "wan-direct".equals(cls)
                || "lan-gateway".equals(cls)
                || "wan-gateway".equals(cls);
    }

    private static String shortId(String id) {
        if (id == null) return "";
        String s = id.trim();
        if (s.regionMatches(true, 0, "L-192.168.0.", 0, 12)) {
            return "L-" + s.substring(12);
        }
        return s;
    }

    private static boolean samePeerId(String left, String right) {
        return shortId(left).equalsIgnoreCase(shortId(right));
    }

    private static String str(Object o) {
        return o == null ? "" : String.valueOf(o).trim();
    }

    private static long toLong(Object o, long def) {
        if (o == null) return def;
        if (o instanceof Number) return ((Number) o).longValue();
        try {
            return Long.parseLong(String.valueOf(o));
        } catch (Exception e) {
            return def;
        }
    }

    private static final class Probe {
        final String toId;
        final String routeClass;
        final boolean ok;
        final long rttMs;
        final String origin;
        final String error;
        long ts;
        boolean verified;

        Probe(String toId, String routeClass, boolean ok, long rttMs, String origin, String error) {
            this.toId = toId;
            this.routeClass = routeClass;
            this.ok = ok;
            this.rttMs = rttMs;
            this.origin = origin != null ? origin : "";
            this.error = error != null ? error : "";
            this.ts = System.currentTimeMillis();
            this.verified = false;
        }
    }

    private static final class CacheEntry {
        final Probe probe;
        final long expiresAt;

        CacheEntry(Probe probe, long expiresAt) {
            this.probe = probe;
            this.expiresAt = expiresAt;
        }
    }
}
