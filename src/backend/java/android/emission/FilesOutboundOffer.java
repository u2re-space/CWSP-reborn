/*
 * Filename: FilesOutboundOffer.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesOutboundOffer.java
 * Change date and time: 20.40.00_21.07.2026
 * Reason for changes: Native Share / Open-with must auto-send files:offer without
 *   an extra "Open for Share" notification or opening MainActivity. ShareActivity
 *   has no WebView — pack + putBlob + WS offer here so peers get Accept immediately;
 *   download still happens only on Accept (HTTP pull).
 *   2026-07-21i: large raw files stream via putFile + sha256HexFile — never
 *   materializeBatch into a 100–512 MiB byte[] (Android allocation limit).
 *   2026-07-22: when Cap endpoint is gateway (.200/WAN), mirror putBlob to
 *   `/files/blob` so LTE/WAN Accept can HTTP-GET a public URL.
 *   2026-07-22c: large (>64MiB) mirror is background-only — offer Cap LAN URL
 *   immediately so Accept appears without waiting for GB PUT after Wi‑Fi restore.
 *   Mid-size (≤64MiB, e.g. 30–50MiB WAN) still sync-mirrors before offer.
 *
 * INVARIANT: never posts FilesOutgoingNotifier. Does not open Activities.
 */
package emission;

import android.content.Context;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import core.Configure;
import space.u2re.cwsp.ControlApiServer;
import space.u2re.cwsp.CwspBridgeService;
import space.u2re.cwsp.CwspWsClient;

/**
 * Auto-offer staged Share/Open-with files over {@code files:offer} from Java.
 */
public final class FilesOutboundOffer {
    private static final String TAG = "emission.FilesOutboundOffer";
    /** Mirror cwsp-shared SMALL_FILE_MAX — above this use HTTP putBlob URL. */
    private static final long SMALL_FILE_MAX = 500L * 1024L;
    /** Do not base64 across WS above this — always putBlob. */
    private static final long WS_EMBED_MAX = 4L * 1024L * 1024L;
    private static final long OFFER_TTL_MS = 30L * 60L * 1000L;

    private FilesOutboundOffer() { /* no instances */ }

    /**
     * Pack staged files and send {@code files:offer} to {@code destinations}.
     * @return true if the offer packet was handed to an open WebSocket
     */
    public static boolean offer(
            Context context,
            FilesIngress.StageResult staged,
            List<String> destinations
    ) {
        if (context == null || staged == null || !staged.ok
                || staged.transferId == null || staged.files == null || staged.files.isEmpty()) {
            return false;
        }
        List<String> dest = destinations != null ? destinations : new ArrayList<>();
        if (dest.isEmpty()) {
            Log.w(TAG, "offer aborted — no destinations");
            return false;
        }
        Context app = context.getApplicationContext();
        try {
            CwspBridgeService.requestReconnect(app);
        } catch (Throwable t) {
            Log.w(TAG, "requestReconnect failed", t);
        }

        File stageDir = staged.stageDir != null
                ? new File(staged.stageDir)
                : FilesIngress.stageDirFor(app, staged.transferId);
        if (stageDir == null || !stageDir.isDirectory()) {
            Log.e(TAG, "offer missing stageDir");
            return false;
        }

        String senderId = Configure.readClientId(app);
        if (senderId == null || senderId.isEmpty()) senderId = "L-unknown";

        String publicBase = resolvePublicBase(app, senderId);
        // WHY (WAN/Gateway): Cap LAN URLs are unreachable from LTE peers. When
        // Cap's endpoint is the coordinator (.200 / WAN), mirror putBlob to
        // gateway `/files/blob` and advertise that public URL in the offer.
        String gatewayBase = FilesBlobStore.resolveGatewayBlobBase(app);
        try {
            ControlApiServer.ensureListening(app);
        } catch (Throwable t) {
            Log.w(TAG, "ensureListening failed", t);
        }

        JSONArray batches = new JSONArray();
        long totalBytes = 0;
        try {
            int n = staged.files.size();
            for (int i = 0; i < n; i++) {
                FilesIngress.StagedFile sf = staged.files.get(i);
                if (sf == null) continue;
                totalBytes += Math.max(0L, sf.size);
                String batchId = staged.transferId + "-" + i;
                List<String> names = new ArrayList<>(1);
                names.add(sf.name);

                // WHY: display name from Share; batchId+ext was opaque on desk.
                String displayName = sf.name != null ? new java.io.File(sf.name).getName().trim() : "";
                File stagedFile = new File(stageDir, sf.name);
                long fileSize = stagedFile.isFile() ? stagedFile.length() : Math.max(0L, sf.size);

                String kind = "raw";
                String ext;
                String mimeType = "application/octet-stream";
                String hash;
                JSONObject asset = new JSONObject();

                if (fileSize > FilesBatchMaterializer.HEAP_SAFE_MAX) {
                    // Stream path — constant memory for hundreds of MiB.
                    if (!stagedFile.isFile() || fileSize <= 0) {
                        Log.e(TAG, "large stage miss name=" + sf.name);
                        return false;
                    }
                    ext = FilesBatchMaterializer.fileExt(sf.name, "bin");
                    if (displayName.isEmpty() || ".".equals(displayName) || "..".equals(displayName)) {
                        displayName = batchId + "." + ext;
                    } else if (!displayName.toLowerCase(java.util.Locale.US)
                            .endsWith("." + ext.toLowerCase(java.util.Locale.US))) {
                        int dot = displayName.lastIndexOf('.');
                        if (dot < 0) displayName = displayName + "." + ext;
                    }
                    hash = FilesBatchMaterializer.sha256HexFile(stagedFile);
                    FilesBlobStore.PutResult put = FilesBlobStore.putFile(
                            app,
                            staged.transferId,
                            batchId,
                            stagedFile,
                            hash,
                            displayName,
                            mimeType,
                            publicBase
                    );
                    if (!put.ok || put.url.isEmpty()) {
                        Log.e(TAG, "putFile failed batch=" + batchId + " err=" + put.error);
                        return false;
                    }
                    put = maybeMirrorToGateway(app, staged.transferId, batchId, stagedFile, mimeType, gatewayBase, put);
                    asset.put("hash", hash);
                    asset.put("name", displayName);
                    asset.put("mimeType", mimeType);
                    asset.put("type", mimeType);
                    asset.put("size", fileSize);
                    asset.put("source", "url");
                    putUrlsOnAsset(app, asset, put);
                    Log.i(TAG, "offer streamed large file size=" + fileSize
                            + " batchId=" + batchId);
                } else {
                    FilesBatchMaterializer.MaterializedBatch mb =
                            FilesIngress.materializeBatch(stageDir, "raw", names);
                    kind = mb.kind;
                    ext = mb.ext;
                    mimeType = mb.mimeType;
                    hash = mb.hash;
                    if (displayName.isEmpty() || ".".equals(displayName) || "..".equals(displayName)) {
                        displayName = batchId + "." + mb.ext;
                    } else if (mb.ext != null && !mb.ext.isEmpty()
                            && !displayName.toLowerCase(java.util.Locale.US)
                                    .endsWith("." + mb.ext.toLowerCase(java.util.Locale.US))) {
                        int dot = displayName.lastIndexOf('.');
                        if (dot < 0) displayName = displayName + "." + mb.ext;
                    }
                    asset.put("hash", mb.hash);
                    asset.put("name", displayName);
                    asset.put("mimeType", mb.mimeType);
                    asset.put("type", mb.mimeType);
                    asset.put("size", mb.bytes.length);
                    if (mb.bytes.length > SMALL_FILE_MAX || mb.bytes.length > WS_EMBED_MAX) {
                        FilesBlobStore.PutResult put = FilesBlobStore.put(
                                app,
                                staged.transferId,
                                batchId,
                                mb.bytes,
                                mb.hash,
                                displayName,
                                mb.mimeType,
                                publicBase
                        );
                        if (!put.ok || put.url.isEmpty()) {
                            Log.e(TAG, "putBlob failed batch=" + batchId + " err=" + put.error);
                            return false;
                        }
                        // Mirror from local blob bin (same bytes Cap Control serves).
                        File localBin = new File(
                                new File(FilesStorage.resolveFilesBase(app), "blobs/" + staged.transferId),
                                batchId + ".bin");
                        put = maybeMirrorToGateway(app, staged.transferId, batchId, localBin, mb.mimeType, gatewayBase, put);
                        asset.put("source", "url");
                        putUrlsOnAsset(app, asset, put);
                    } else {
                        asset.put("source", "base64");
                        asset.put("data", Base64.encodeToString(mb.bytes, Base64.NO_WRAP));
                    }
                }
                JSONArray logical = new JSONArray();
                JSONObject lf = new JSONObject();
                lf.put("name", sf.name);
                lf.put("size", sf.size);
                logical.put(lf);

                JSONObject batch = new JSONObject();
                batch.put("batchId", batchId);
                batch.put("index", i);
                batch.put("count", n);
                batch.put("kind", kind);
                batch.put("asset", asset);
                batch.put("files", logical);
                batches.put(batch);
            }
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "offer pack OOM — use streaming path for large files", oom);
            return false;
        } catch (Exception e) {
            Log.e(TAG, "offer pack failed", e);
            return false;
        }

        long now = System.currentTimeMillis();
        try {
            JSONObject payload = new JSONObject();
            payload.put("transferId", staged.transferId);
            payload.put("sender", senderId);
            payload.put("destinations", new JSONArray(dest));
            payload.put("createdAt", now);
            payload.put("expiresAt", now + OFFER_TTL_MS);
            JSONObject summary = new JSONObject();
            summary.put("fileCount", staged.files.size());
            summary.put("totalBytes", totalBytes);
            payload.put("summary", summary);
            payload.put("batches", batches);
            JSONObject flags = new JSONObject();
            flags.put("openForShare", true);
            flags.put("nativeAutoOffer", true);
            payload.put("flags", flags);
            payload.put("byteTransportHint", "auto");

            Map<String, Object> packet = new LinkedHashMap<>();
            packet.put("op", "act");
            packet.put("what", "files:offer");
            // COMPAT: some relays keep `type` and drop/clear `what` — desk resolves both.
            packet.put("type", "files:offer");
            packet.put("purpose", "storage");
            packet.put("protocol", "ws");
            packet.put("transport", "ws");
            packet.put("uuid", UUID.randomUUID().toString());
            packet.put("timestamp", now);
            packet.put("sender", senderId);
            packet.put("byId", senderId);
            packet.put("nodes", dest);
            packet.put("destinations", dest);
            Map<String, Object> pFlags = new LinkedHashMap<>();
            pFlags.put("canonicalV2", true);
            packet.put("flags", pFlags);
            // WHY: CwspWsClient.send expects Map payload; JSONObject is not Map.
            packet.put("payload", jsonToMap(payload));

            boolean sent = sendWithWait(app, packet);
            Log.i(TAG, "files:offer sent=" + sent
                    + " transferId=" + staged.transferId
                    + " dest=" + dest
                    + " batches=" + batches.length());
            return sent;
        } catch (Exception e) {
            Log.e(TAG, "offer build/send failed", e);
            return false;
        }
    }

    private static boolean sendWithWait(Context app, Map<String, Object> packet) {
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        for (int i = 0; i < 40 && (ws == null || !ws.isOpen()); i++) {
            try {
                Thread.sleep(150);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                break;
            }
            ws = CwspBridgeService.getSharedWs();
        }
        if (ws == null || !ws.isOpen()) {
            Log.w(TAG, "WS not open — cannot send files:offer");
            return false;
        }
        return ws.send(packet);
    }

    private static String resolvePublicBase(Context app, String clientId) {
        // WHY (Cap↔Cap large fail): short fleet ids (L-210 / L-196) are not
        // L-<dotted-ip>. Advertising http://127.0.0.1:8434 made peers HTTP-GET
        // themselves → immediate fail / "transferring" hang.
        String fromId = lanHostFromClientId(clientId);
        if (fromId != null) {
            return "http://" + fromId + ":" + ControlApiServer.DEFAULT_PORT;
        }
        String lan = detectLanIpv4();
        if (lan != null && !lan.isEmpty()) {
            return "http://" + lan + ":" + ControlApiServer.DEFAULT_PORT;
        }
        Log.w(TAG, "resolvePublicBase fell back to loopback — peers cannot pull");
        return "http://127.0.0.1:" + ControlApiServer.DEFAULT_PORT;
    }

    /**
     * If Cap is pointed at the gateway, PUT local bytes there and prefer the
     * returned public URL. On failure keep the Cap LAN URL (LAN-only Accept).
     *
     * WHY (size tiers):
     *   ≤64MiB — sync-mirror before offer so WAN Accept has gateway bytes.
     *   >64MiB (GB) — background mirror; offer Cap LAN URL immediately for
     *   LAN P2P Accept without waiting on multi‑minute PUTs.
     */
    private static final long MIRROR_SYNC_MAX_BYTES = 64L * 1024L * 1024L;

    private static FilesBlobStore.PutResult maybeMirrorToGateway(
            Context app,
            String transferId,
            String batchId,
            File source,
            String mimeType,
            String gatewayBase,
            FilesBlobStore.PutResult local
    ) {
        if (gatewayBase == null || gatewayBase.isEmpty()
                || !FilesBlobStore.isGatewayBlobBase(gatewayBase)
                || source == null || !source.isFile()) {
            return local;
        }
        long size = source.length();
        if (size > MIRROR_SYNC_MAX_BYTES) {
            final Context appRef = app.getApplicationContext();
            final String tid = transferId;
            final String bid = batchId;
            final File src = source;
            final String mime = mimeType;
            final String base = gatewayBase;
            final FilesBlobStore.PutResult localRef = local;
            new Thread(() -> {
                try {
                    FilesBlobStore.PutResult mirrored = FilesBlobStore.mirrorPutToGateway(
                            appRef, tid, bid, src, mime, base, localRef);
                    Log.i(TAG, "bg gateway mirror "
                            + (mirrored != null && mirrored.ok ? "ok" : "fail")
                            + " batch=" + bid + " size=" + src.length());
                } catch (Throwable t) {
                    Log.w(TAG, "bg gateway mirror error batch=" + bid, t);
                }
            }, "cwsp-files-mirror-" + batchId).start();
            Log.i(TAG, "offer now with Cap LAN url; bg-mirror size=" + size
                    + " batch=" + batchId);
            return local;
        }
        FilesBlobStore.PutResult mirrored = FilesBlobStore.mirrorPutToGateway(
                app, transferId, batchId, source, mimeType, gatewayBase, local);
        if (mirrored != null && mirrored.ok && mirrored.url != null && !mirrored.url.isEmpty()) {
            Log.i(TAG, "offer url via gateway mirror batch=" + batchId);
            return new FilesBlobStore.PutResult(
                    true,
                    preferWanGatewayBlobUrl(app, mirrored.url),
                    mirrored.token,
                    "",
                    local != null && local.ok ? local.url : "");
        }
        Log.w(TAG, "gateway mirror skipped/failed — keep Cap LAN url batch=" + batchId);
        return local;
    }

    /**
     * Set {@code asset.url} (LTE-safe primary) and ordered {@code asset.urls}
     * (peer LAN → gateway LAN → WAN) for Accept probe.
     */
    private static void putUrlsOnAsset(Context app, JSONObject asset, FilesBlobStore.PutResult put)
            throws Exception {
        if (put == null || put.url == null || put.url.isEmpty()) {
            throw new Exception("CWSP_FILES_NO_PUT_URL");
        }
        java.util.LinkedHashSet<String> ordered = new java.util.LinkedHashSet<>();
        if (put.peerUrl != null && !put.peerUrl.isEmpty()) {
            ordered.add(put.peerUrl);
        }
        String lan = preferLanGatewayBlobUrl(app, put.url);
        String wan = preferWanGatewayBlobUrl(app, put.url);
        if (lan != null && !lan.isEmpty()) ordered.add(lan);
        if (wan != null && !wan.isEmpty()) ordered.add(wan);
        ordered.add(put.url);
        JSONArray urls = new JSONArray();
        for (String u : ordered) urls.put(u);
        asset.put("urls", urls);
        // Primary: WAN when available so LTE peers without urls[] still work.
        asset.put("url", wan != null && !wan.isEmpty() ? wan : put.url);
    }

    /**
     * Map WAN gateway entry → LAN for same-token Accept on home Wi‑Fi.
     * WHY: configured relay host (settings) || historical WAN fallback.
     */
    private static String preferLanGatewayBlobUrl(Context app, String url) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null) return url;
            String wanHost = FilesBlobStore.resolveWanGatewayHost(app);
            boolean isWan = host.equalsIgnoreCase(wanHost)
                    || host.equalsIgnoreCase(FilesBlobStore.WAN_GATEWAY_HOST_FALLBACK);
            if (!isWan) return url;
            String path = u.getRawPath();
            if (path == null || !path.contains("/files/blob/")) return url;
            int port = u.getPort() > 0 ? u.getPort() : 8434;
            String q = u.getRawQuery();
            return "https://" + FilesBlobStore.LAN_GATEWAY_HOST + ":" + port + path
                    + (q != null && !q.isEmpty() ? "?" + q : "");
        } catch (Exception e) {
            return url;
        }
    }

    /**
     * Map LAN gateway → WAN entry for LTE-reachable primary URL.
     * WHY: settings relay/endpoint host first, historical IP only as fallback.
     */
    private static String preferWanGatewayBlobUrl(Context app, String url) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null || !FilesBlobStore.LAN_GATEWAY_HOST.equals(host)) return url;
            String path = u.getRawPath();
            if (path == null || !path.contains("/files/blob/")) return url;
            String target = FilesBlobStore.resolveWanGatewayHost(app);
            if (target == null || target.isEmpty()) {
                target = FilesBlobStore.WAN_GATEWAY_HOST_FALLBACK;
            }
            int port = u.getPort() > 0 ? u.getPort() : 8434;
            String q = u.getRawQuery();
            return "https://" + target + ":" + port + path
                    + (q != null && !q.isEmpty() ? "?" + q : "");
        } catch (Exception e) {
            return url;
        }
    }

    /**
     * Map {@code L-192.168.0.210} or short {@code L-210} → LAN IPv4 for blob URLs.
     */
    public static String lanHostFromClientId(String clientId) {
        if (clientId == null) return null;
        String id = clientId.trim();
        if (!id.regionMatches(true, 0, "L-", 0, 2)) return null;
        String host = id.substring(2).trim();
        if (host.matches("\\d+\\.\\d+\\.\\d+\\.\\d+")) return host;
        // Short fleet form used in Cap prefs (L-110 / L-196 / L-208 / L-210).
        if ("110".equals(host)) return "192.168.0.110";
        if ("196".equals(host)) return "192.168.0.196";
        if ("208".equals(host)) return "192.168.0.208";
        if ("210".equals(host)) return "192.168.0.210";
        if ("200".equals(host)) return "192.168.0.200";
        return null;
    }

    /** Best-effort private IPv4 for Cap↔Cap blob URLs (same as CwsBridgePlugin). */
    private static String detectLanIpv4() {
        try {
            java.util.Enumeration<java.net.NetworkInterface> ifaces =
                    java.net.NetworkInterface.getNetworkInterfaces();
            if (ifaces == null) return null;
            while (ifaces.hasMoreElements()) {
                java.net.NetworkInterface nif = ifaces.nextElement();
                if (nif == null || !nif.isUp() || nif.isLoopback()) continue;
                java.util.Enumeration<java.net.InetAddress> addrs = nif.getInetAddresses();
                while (addrs.hasMoreElements()) {
                    java.net.InetAddress a = addrs.nextElement();
                    if (a == null || a.isLoopbackAddress() || !(a instanceof java.net.Inet4Address)) {
                        continue;
                    }
                    String host = a.getHostAddress();
                    if (host == null) continue;
                    if (host.startsWith("192.168.")
                            || host.startsWith("10.")
                            || host.matches("^172\\.(1[6-9]|2[0-9]|3[0-1])\\..*")) {
                        return host;
                    }
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "detectLanIpv4 failed", e);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> jsonToMap(JSONObject o) throws Exception {
        Map<String, Object> map = new LinkedHashMap<>();
        if (o == null) return map;
        java.util.Iterator<String> keys = o.keys();
        while (keys.hasNext()) {
            String k = keys.next();
            Object v = o.get(k);
            map.put(k, jsonValue(v));
        }
        return map;
    }

    private static Object jsonValue(Object v) throws Exception {
        if (v == null || v == JSONObject.NULL) return null;
        if (v instanceof JSONObject) return jsonToMap((JSONObject) v);
        if (v instanceof JSONArray) {
            JSONArray a = (JSONArray) v;
            List<Object> list = new ArrayList<>(a.length());
            for (int i = 0; i < a.length(); i++) list.add(jsonValue(a.get(i)));
            return list;
        }
        return v;
    }
}
