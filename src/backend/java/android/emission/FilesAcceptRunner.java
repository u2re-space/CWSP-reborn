/*
 * Filename: FilesAcceptRunner.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesAcceptRunner.java
 * Change date and time: 23.40.00_21.07.2026
 * Reason for changes: Cap Accept previously only launched MainActivity — desk
 *   never saw files:accept and no bytes landed. This runner (1) emits
 *   files:accept|/decline over CwspWsClient, (2) materializes embed/url/
 *   sidecar batches into files/incoming + landing, (3) exports to
 *   Downloads/SAF per shell prefs. HTTP pulls stream to disk (no full
 *   buffer) with short timeouts so LTE→LAN URLs fail fast instead of
 *   hanging forever on Accepting….
 *   2026-07-21: do not hard-fail HTTP Accept when /ws signal is down —
 *   putBlob URL is already on the offer; wait longer for WS reconnect.
 *   2026-07-21h: byte-accurate Accept progress + EMA speed/ETA during HTTP
 *   pull (batch i/N was stuck for single large files).
 *   2026-07-21t: notifySaved gets concrete file path + final public Uri so
 *   Open File opens Downloads/SAF/Docs with real DISPLAY_NAME.
 *   2026-07-22: insecure TLS + WAN→LAN hairpin for gateway `/files/blob`
 *   Accept (self-signed cert + NAT hairpin broke Cap/Neu after mirror).
 *   2026-07-22b: ordered asset.urls candidates — peer/P2P → gw LAN → WAN.
 *   2026-07-22i: WAN primary → try public gateway first; short connect for RFC1918.
 *   2026-07-22d: Abort/Cancel mid-download — disconnect HTTP only (WS stays);
 *   notify peer via files:error code=aborted; Aborted summary notif.
 *   2026-07-22m: retry files:done after Accept (WS often dead after long WAN GET).
 *   2026-07-22n: emit files:progress to offer.sender (~4Hz) so Cap multi-peer
 *   outgoing notifs get independent bars during Accept download.
 *   2026-07-22o: Accept probe always peer→gwLAN→WAN (LAN P2P first); short
 *   private connect timeout covers Cap-on-LTE dead LAN without gateway-first.
 *   2026-07-22s: dual-path hedge — peer class immediately, gateway after
 *   HEDGE_MS; first 2xx body wins. Never reorder to gateway-first by primary URL.
 *   2026-07-22u: HEDGE_MS 400→1500 — gateway mirror stole LAN P2P before Cap
 *   Control TLS finished; peerExhausted still starts gateway early on WAN.
 *   2026-07-22x: Cap↔Cap — expand peer candidates with sender fleet LAN host;
 *   HEAD peer-path-probe logs whether Cap Control is reachable before GET body
 *   (Neu→Cap worked; Cap→Cap often never even asked the peer path).
 *
 * INVARIANT: never touches clipboard channels. Progress uses FilesIncomingNotifier.
 * INVARIANT (Accept order): peer → gwLAN → gwWAN → other. Reachability via hedge,
 *   not compile-time flip of who-is-first.
 */
package emission;

import android.content.ContentResolver;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import core.Configure;

import space.u2re.cwsp.CwspBridgeService;
import space.u2re.cwsp.CwspWsClient;

/**
 * Execute inbound files Accept / Decline from notification actions.
 */
public final class FilesAcceptRunner {
    private static final String TAG = "emission.FilesAcceptRunner";
    /** Connect timeout — LAN blob must fail fast on LTE (no hang on Accepting…). */
    private static final int HTTP_CONNECT_MS = 8_000;
    /**
     * RFC1918 Cap/peer LAN probes fail fast on LTE.
     * WHY: hedge starts gateway at {@link #HEDGE_MS}; no need for 2.5s exclusive wait.
     */
    private static final int HTTP_CONNECT_PRIVATE_MS = 1_500;
    /** Read timeout — large desk blobs (tens of MiB) need more than a short read budget. */
    private static final int HTTP_READ_MS = 180_000;
    /**
     * Peer exclusive window before gateway race.
     * WHY: 400ms let mirrored gateway win over Cap Control TLS on same Wi‑Fi.
     * peerExhausted still starts gateway immediately when all peer connects fail
     * (Cap-on-LTE / WAN) — do not wait the full window after hard fail.
     */
    private static final long HEDGE_MS = 1_500L;
    /** Max progress notification rate (~4Hz) — mirrors TS FilesProgressTracker. */
    private static final long PROGRESS_MIN_INTERVAL_MS = 250L;
    /** transferIds currently inside {@link #accept} — abort() lets the thread finish cleanup. */
    private static final java.util.concurrent.ConcurrentHashMap<String, Boolean> ACTIVE_ACCEPT =
            new java.util.concurrent.ConcurrentHashMap<>();

    /**
     * Aggregate byte clock for one Accept. WHY: Notification must show real
     * bytes/speed/ETA; batch index alone looks frozen on a 5–10+ MiB file.
     */
    private static final class ByteProgress {
        final Context app;
        final String transferId;
        /** Offer sender — receive files:progress for per-peer outgoing bar. */
        final String reportToSender;
        final int batchCount;
        /** Bytes already finished from prior batches. */
        long completedBytes;
        /** Mutable when Content-Length arrives after offer lacked summary. */
        long totalBytes;
        long speedBps;
        long lastSampleMs;
        long lastSampleBytes;
        long lastNotifyMs;
        long lastRemoteEmitMs;
        int batchIndex;
        String label = "Downloading";

        ByteProgress(
                Context app,
                String transferId,
                String reportToSender,
                long totalBytes,
                int batchCount
        ) {
            this.app = app;
            this.transferId = transferId != null ? transferId : "";
            this.reportToSender = reportToSender != null ? reportToSender : "";
            this.totalBytes = Math.max(0L, totalBytes);
            this.batchCount = Math.max(1, batchCount);
            long now = System.currentTimeMillis();
            this.lastSampleMs = now;
            this.lastNotifyMs = 0L;
            this.lastRemoteEmitMs = 0L;
        }

        void setLabel(String label) {
            if (label != null && !label.isEmpty()) this.label = label;
        }

        void setBatchIndex(int index) {
            if (index >= 0) batchIndex = index;
        }

        /** Raise known total if HTTP Content-Length is larger than offer hint. */
        void ensureTotalAtLeast(long hint) {
            if (hint > totalBytes) totalBytes = hint;
        }

        void addCompleted(long bytes) {
            if (bytes > 0) completedBytes += bytes;
            reportAbsolute(completedBytes, true);
        }

        void reportInFlight(long bytesInCurrentBatch) {
            long abs = completedBytes + Math.max(0L, bytesInCurrentBatch);
            reportAbsolute(abs, false);
        }

        private void reportAbsolute(long absoluteDone, boolean force) {
            long now = System.currentTimeMillis();
            long dt = now - lastSampleMs;
            if (dt >= 200L && absoluteDone >= lastSampleBytes) {
                long delta = absoluteDone - lastSampleBytes;
                if (delta > 0 && dt > 0) {
                    double inst = (delta * 1000.0) / (double) dt;
                    // EMA α≈0.35 — same spirit as cwsp-shared FilesProgressTracker
                    speedBps = speedBps > 0
                            ? Math.round(0.35 * inst + 0.65 * speedBps)
                            : Math.round(inst);
                }
                lastSampleMs = now;
                lastSampleBytes = absoluteDone;
            }
            if (!force && lastNotifyMs > 0 && (now - lastNotifyMs) < PROGRESS_MIN_INTERVAL_MS) {
                return;
            }
            lastNotifyMs = now;
            Long eta = null;
            if (totalBytes > 0 && speedBps > 1 && absoluteDone < totalBytes) {
                long remaining = totalBytes - absoluteDone;
                eta = Math.round((remaining * 1000.0) / (double) speedBps);
            }
            FilesIncomingNotifier.notifyProgressBytes(
                    app, transferId, label, absoluteDone, totalBytes, speedBps, eta);
            // WHY: sender Cap needs per-peer bars when gateway serves the GET.
            if (!reportToSender.isEmpty()
                    && (force || lastRemoteEmitMs == 0L
                    || (now - lastRemoteEmitMs) >= PROGRESS_MIN_INTERVAL_MS)) {
                lastRemoteEmitMs = now;
                sendFilesProgress(
                        app, transferId, reportToSender,
                        absoluteDone, totalBytes, batchIndex, batchCount, speedBps, eta);
            }
        }
    }

    private FilesAcceptRunner() { /* no instances */ }

    /**
     * Accept: send {@code files:accept}, pull/embed batches, land files.
     * WHY: must run off the main thread (use receiver goAsync / worker).
     *
     * @return true if accept was signaled and at least one file landed (or
     *         offer had zero batches after a successful accept signal)
     */
    public static boolean accept(Context context, String transferId) {
        if (context == null) return false;
        Context app = context.getApplicationContext();
        String tid = transferId != null ? transferId.trim() : "";
        if (!FilesPendingOffers.isSafeTransferId(tid)) {
            Log.w(TAG, "accept: bad transferId");
            notifyFail(app, tid, "invalid transferId");
            return false;
        }
        JSONObject offer = FilesPendingOffers.peek(app, tid);
        if (offer == null) {
            Log.w(TAG, "accept: no pending offer for " + tid);
            notifyFail(app, tid, "offer expired or missing — re-share from desk");
            return false;
        }
        String sender = offer.optString("sender", "");
        if (sender.isEmpty()) sender = offer.optString("from", "");

        FilesTransferControl.clear(tid);
        ACTIVE_ACCEPT.put(tid, Boolean.TRUE);
        notifyProgress(app, tid, "Accepting…", 0, -1);

        // WHY: putBlob URLs are already on the offer (desk TTL ~30m). Do not
        // hard-fail Accept when /ws is mid-reconnect — that left Cap on
        // "Accepting…" / fail while the LAN blob was reachable (L-210 2026-07-21:
        // sent=false needsHttp=true, then WS connect 40ms later).
        // INVARIANT: files:accept signal is best-effort; HTTP/embed materialize owns landing.
        boolean needsHttp = offerNeedsHttpPull(offer);
        boolean signaled = false;
        try {
            signaled = sendFilesAct(app, "files:accept", tid, sender);
        } catch (Throwable t) {
            Log.w(TAG, "sendFilesAct threw", t);
        }
        Log.i(TAG, "accept files:accept sent=" + signaled
                + " transferId=" + tid + " to=" + sender
                + " needsHttp=" + needsHttp);
        if (!signaled) {
            Log.w(TAG, "accept: WS signal failed — continuing "
                    + (needsHttp ? "HTTP" : "embed") + " materialize");
        }

        try {
            JSONArray batches = offer.optJSONArray("batches");
            if (batches == null || batches.length() == 0) {
                notifyFail(app, tid, "offer has no batches (rebuild Cap + re-share)");
                FilesPendingOffers.delete(app, tid);
                return false;
            }

            File incomingRoot = new File(FilesStorage.resolveIncomingTempRoot(app), tid);
            File landingRoot = new File(FilesStorage.resolveAppLandingRoot(app), tid);
            if (!incomingRoot.exists() && !incomingRoot.mkdirs()) {
                throw new Exception("mkdir incoming failed");
            }
            if (!landingRoot.exists() && !landingRoot.mkdirs()) {
                throw new Exception("mkdir landing failed");
            }

            long offerTotalBytes = resolveOfferTotalBytes(offer, batches);
            int total = batches.length();
            ByteProgress progress = new ByteProgress(app, tid, sender, offerTotalBytes, total);
            progress.setLabel(needsHttp ? "Downloading" : "Saving");
            progress.reportInFlight(0);

            int written = 0;
            int skippedCorrupt = 0;
            for (int i = 0; i < total; i++) {
                FilesTransferControl.throwIfAborted(tid);
                JSONObject batch = batches.optJSONObject(i);
                if (batch == null) {
                    // WHY (Cap↔Cap Saved 0): old senders put Map.toString() into
                    // batches[] — optJSONObject returns null and we used to skip
                    // silently. Fail loudly so the user re-shares after the fix.
                    Object raw = batches.opt(i);
                    Log.w(TAG, "accept corrupt batch[" + i + "] type="
                            + (raw == null ? "null" : raw.getClass().getSimpleName()));
                    skippedCorrupt++;
                    continue;
                }
                progress.setBatchIndex(i);
                progress.setLabel("Downloading " + (i + 1) + "/" + total);
                written += materializeBatch(app, batch, incomingRoot, landingRoot, sender, progress);
            }
            if (FilesTransferControl.isAborted(tid)) {
                throw new Exception("CWSP_FILES_ABORTED");
            }
            if (written <= 0) {
                throw new Exception(skippedCorrupt > 0
                        ? "CWSP_FILES_CORRUPT_BATCHES (re-share from sender Cap after update)"
                        : "CWSP_FILES_ZERO_WRITTEN");
            }

            Uri primaryPublicUri = exportLanding(app, landingRoot, tid);
            File primaryFile = null;
            File[] kids = landingRoot.listFiles();
            if (kids != null) {
                for (File kid : kids) {
                    if (kid == null || !kid.isFile()) continue;
                    String n = kid.getName();
                    if (n == null || n.startsWith(".") || "README.txt".equalsIgnoreCase(n)) continue;
                    if (primaryFile == null || kid.lastModified() > primaryFile.lastModified()) {
                        primaryFile = kid;
                    }
                }
            }
            // WHY: Open File needs the concrete file + final public Uri (not the dir).
            String openPath = primaryFile != null
                    ? primaryFile.getAbsolutePath()
                    : landingRoot.getAbsolutePath();
            String openUri = primaryPublicUri != null ? primaryPublicUri.toString() : null;
            if (openUri == null && primaryFile != null && written == 1) {
                Uri doc = FilesStorage.buildLandingFileDocumentUri(app, tid, primaryFile.getName());
                if (doc != null) openUri = doc.toString();
            }

            FilesPendingOffers.delete(app, tid);
            FilesIncomingNotifier.cancel(app, tid);
            String displayName = primaryFile != null ? primaryFile.getName() : null;
            notifyDone(app, tid, written, openPath, openUri, displayName);
            // WHY: sender Cap outgoing notif stuck on "waiting" without files:done.
            try {
                sendFilesDone(app, tid, sender, written);
            } catch (Throwable t) {
                Log.w(TAG, "send files:done failed", t);
            }
            Log.i(TAG, "accept done transferId=" + tid + " files=" + written
                    + " landing=" + landingRoot.getAbsolutePath()
                    + " openUri=" + openUri
                    + " displayName=" + displayName);
            return true;
        } catch (Exception e) {
            String msg = String.valueOf(e.getMessage());
            boolean aborted = FilesTransferControl.isAborted(tid)
                    || (msg != null && msg.contains("CWSP_FILES_ABORTED"));
            if (aborted) {
                Log.i(TAG, "accept aborted transferId=" + tid);
                finishLocalAbort(app, tid, sender, offer);
                return false;
            }
            Log.w(TAG, "accept materialize failed", e);
            notifyFail(app, tid, msg);
            return false;
        } finally {
            ACTIVE_ACCEPT.remove(tid);
            FilesTransferControl.clear(tid);
        }
    }

    /**
     * Abort an in-flight Accept (notification Abort). Disconnects HTTP only;
     * does not close the CWSP WebSocket.
     */
    public static void abort(Context context, String transferId) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = transferId != null ? transferId.trim() : "";
        if (tid.isEmpty()) return;
        FilesTransferControl.requestAbort(tid);
        Log.i(TAG, "abort requested transferId=" + tid);
        // If Accept thread is active it will call finishLocalAbort; otherwise clean up here.
        if (!ACTIVE_ACCEPT.containsKey(tid)) {
            JSONObject offer = FilesPendingOffers.peek(app, tid);
            String sender = "";
            if (offer != null) {
                sender = offer.optString("sender", "");
                if (sender.isEmpty()) sender = offer.optString("from", "");
            }
            finishLocalAbort(app, tid, sender, offer);
            FilesTransferControl.clear(tid);
        }
    }

    private static void finishLocalAbort(
            Context app,
            String tid,
            String sender,
            JSONObject offer
    ) {
        int total = 0;
        int done = 0;
        try {
            File landingRoot = new File(FilesStorage.resolveAppLandingRoot(app), tid);
            File[] kids = landingRoot.isDirectory() ? landingRoot.listFiles() : null;
            if (kids != null) {
                for (File k : kids) {
                    if (k != null && k.isFile() && !k.getName().startsWith(".")) done++;
                }
            }
            JSONArray batches = offer != null ? offer.optJSONArray("batches") : null;
            total = batches != null ? batches.length() : 0;
            if (total <= 0) {
                JSONObject summary = offer != null ? offer.optJSONObject("summary") : null;
                if (summary != null) total = summary.optInt("fileCount", 0);
            }
        } catch (Exception ignored) { /* */ }
        int remaining = Math.max(0, total - done);
        try {
            sendFilesErrorAborted(app, tid, sender, done, remaining);
        } catch (Throwable t) {
            Log.w(TAG, "send abort error failed", t);
        }
        FilesPendingOffers.delete(app, tid);
        FilesIncomingNotifier.notifyAborted(app, tid, done, remaining);
    }

    /** Decline: emit {@code files:decline}, drop pending offer, cancel heads-up. */
    public static void decline(Context context, String transferId) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = transferId != null ? transferId.trim() : "";
        JSONObject offer = FilesPendingOffers.peek(app, tid);
        String sender = "";
        if (offer != null) {
            sender = offer.optString("sender", "");
            if (sender.isEmpty()) sender = offer.optString("from", "");
        }
        boolean sent = sendFilesAct(app, "files:decline", tid, sender);
        Log.i(TAG, "decline files:decline sent=" + sent + " transferId=" + tid);
        FilesPendingOffers.delete(app, tid);
        FilesIncomingNotifier.cancel(app, tid);
        FilesTransferControl.clear(tid);
    }

    /** True when any batch lacks embed data and needs HTTP GET of asset.url. */
    private static boolean offerNeedsHttpPull(JSONObject offer) {
        if (offer == null) return true;
        JSONArray batches = offer.optJSONArray("batches");
        if (batches == null || batches.length() == 0) return true;
        for (int i = 0; i < batches.length(); i++) {
            JSONObject batch = batches.optJSONObject(i);
            if (batch == null) return true;
            JSONObject asset = batch.optJSONObject("asset");
            if (asset == null) return true;
            String data = asset.optString("data", "");
            if (data != null && !data.isEmpty()) continue;
            String sidecar = asset.optString("sidecar", "");
            if (sidecar != null && !sidecar.isEmpty()) continue;
            String url = asset.optString("url", "");
            if (url == null || url.isEmpty()) return true;
            // Has URL only — needs HTTP (and preferably accept signal).
            return true;
        }
        return false;
    }

    private static boolean sendFilesAct(Context app, String what, String transferId, String dest) {
        try {
            // WHY: Accept may fire after process death / Doze — wake FGS + /ws
            // before emitting files:accept so the desk actually receives it.
            CwspBridgeService.requestReconnect(app);
        } catch (Throwable t) {
            Log.w(TAG, "requestReconnect failed", t);
        }
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        if (ws == null || !ws.isOpen()) {
            // WHY: WAN/gateway TLS reconnect often needs >1s (observed ~open right
            // after Accept aborted). Cap at ~6s so FGS Accept still completes.
            for (int i = 0; i < 40 && (ws == null || !ws.isOpen()); i++) {
                try { Thread.sleep(150); } catch (InterruptedException ignored) { break; }
                ws = CwspBridgeService.getSharedWs();
            }
        }
        if (ws == null || !ws.isOpen()) {
            Log.w(TAG, "sendFilesAct: ws not open what=" + what);
            return false;
        }
        String clientId = Configure.readClientId(app);
        if (clientId == null || clientId.isEmpty()) clientId = "L-unknown";
        List<String> destinations = new ArrayList<>(1);
        if (dest != null && !dest.isEmpty()) {
            destinations.add(dest);
        } else {
            destinations.add("L-110");
        }
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("transferId", transferId);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", what);
        packet.put("purpose", "storage");
        packet.put("protocol", "ws");
        packet.put("transport", "ws");
        packet.put("uuid", UUID.randomUUID().toString());
        packet.put("timestamp", System.currentTimeMillis());
        packet.put("sender", clientId);
        packet.put("byId", clientId);
        packet.put("nodes", destinations);
        packet.put("destinations", destinations);
        Map<String, Object> flags = new LinkedHashMap<>();
        flags.put("canonicalV2", true);
        packet.put("flags", flags);
        packet.put("payload", payload);
        return ws.send(packet);
    }

    /**
     * Tell offer sender Accept download progress (~4Hz) for per-peer outgoing bar.
     * Fire-and-forget — never blocks materialize on WS flaps.
     */
    private static void sendFilesProgress(
            Context app,
            String transferId,
            String dest,
            long bytesDone,
            long totalBytes,
            int batchIndex,
            int batchCount,
            long speedBps,
            Long etaMs
    ) {
        if (app == null || dest == null || dest.isEmpty()) return;
        try {
            CwspWsClient ws = CwspBridgeService.getSharedWs();
            if (ws == null || !ws.isOpen()) {
                // WHY: mid-Accept HTTP often flaps /ws — without progress the
                // sender Sending bar freezes until done/watchdog.
                try {
                    CwspBridgeService.requestReconnect(app);
                } catch (Throwable ignored) { /* */ }
                ws = CwspBridgeService.getSharedWs();
                if (ws == null || !ws.isOpen()) return;
            }
            String clientId = Configure.readClientId(app);
            if (clientId == null || clientId.isEmpty()) clientId = "L-unknown";
            List<String> destinations = new ArrayList<>(1);
            destinations.add(dest);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("transferId", transferId != null ? transferId : "");
            payload.put("bytesDone", Math.max(0L, bytesDone));
            payload.put("totalBytes", Math.max(0L, totalBytes));
            payload.put("batchIndex", Math.max(0, batchIndex));
            payload.put("batchCount", Math.max(1, batchCount));
            payload.put("speedBps", Math.max(0L, speedBps));
            payload.put("etaMs", etaMs);
            Map<String, Object> packet = new LinkedHashMap<>();
            packet.put("op", "act");
            packet.put("what", "files:progress");
            packet.put("type", "files:progress");
            packet.put("purpose", "storage");
            packet.put("protocol", "ws");
            packet.put("transport", "ws");
            packet.put("uuid", UUID.randomUUID().toString());
            packet.put("timestamp", System.currentTimeMillis());
            packet.put("sender", clientId);
            packet.put("byId", clientId);
            packet.put("nodes", destinations);
            packet.put("destinations", destinations);
            Map<String, Object> flags = new LinkedHashMap<>();
            flags.put("canonicalV2", true);
            packet.put("flags", flags);
            packet.put("payload", payload);
            ws.send(packet);
        } catch (Throwable t) {
            Log.d(TAG, "sendFilesProgress best-effort: " + t.getMessage());
        }
    }

    /**
     * Tell sender the transfer landed — clears their stuck outgoing progress notif.
     * WHY: long WAN Accept often drops /ws; retry reconnect+send so Cap sender
     * does not hang on "peer downloading…" until the done-watchdog.
     */
    private static boolean sendFilesDone(
            Context app,
            String transferId,
            String dest,
            int fileCount
    ) {
        final int attempts = 12;
        for (int attempt = 1; attempt <= attempts; attempt++) {
            try {
                CwspBridgeService.requestReconnect(app);
            } catch (Throwable ignored) { /* */ }
            CwspWsClient ws = CwspBridgeService.getSharedWs();
            if (ws == null || !ws.isOpen()) {
                for (int i = 0; i < 25 && (ws == null || !ws.isOpen()); i++) {
                    try { Thread.sleep(200); } catch (InterruptedException ignored) { break; }
                    ws = CwspBridgeService.getSharedWs();
                }
            }
            if (ws == null || !ws.isOpen()) {
                Log.w(TAG, "files:done wait-ws attempt=" + attempt
                        + "/" + attempts + " transferId=" + transferId);
                try { Thread.sleep(500L * attempt); } catch (InterruptedException ignored) { break; }
                continue;
            }
            String clientId = Configure.readClientId(app);
            if (clientId == null || clientId.isEmpty()) clientId = "L-unknown";
            List<String> destinations = new ArrayList<>(1);
            if (dest != null && !dest.isEmpty()) destinations.add(dest);
            else destinations.add("*");
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("transferId", transferId != null ? transferId : "");
            payload.put("fileCount", fileCount);
            Map<String, Object> summary = new LinkedHashMap<>();
            summary.put("fileCount", fileCount);
            payload.put("summary", summary);
            Map<String, Object> packet = new LinkedHashMap<>();
            packet.put("op", "act");
            packet.put("what", "files:done");
            packet.put("type", "files:done");
            packet.put("purpose", "storage");
            packet.put("protocol", "ws");
            packet.put("transport", "ws");
            packet.put("uuid", UUID.randomUUID().toString());
            packet.put("timestamp", System.currentTimeMillis());
            packet.put("sender", clientId);
            packet.put("byId", clientId);
            packet.put("nodes", destinations);
            packet.put("destinations", destinations);
            Map<String, Object> flags = new LinkedHashMap<>();
            flags.put("canonicalV2", true);
            packet.put("flags", flags);
            packet.put("payload", payload);
            boolean ok = ws.send(packet);
            Log.i(TAG, "files:done sent=" + ok + " attempt=" + attempt
                    + " transferId=" + transferId + " to=" + dest);
            if (ok) return true;
            try { Thread.sleep(400L * attempt); } catch (InterruptedException ignored) { break; }
        }
        Log.w(TAG, "files:done gave up transferId=" + transferId + " to=" + dest);
        return false;
    }

    /**
     * Notify peer that this side aborted. Uses {@code files:error} (stable contract)
     * with {@code code=aborted} so Cap/Neu can show Aborted without closing /ws.
     */
    private static boolean sendFilesErrorAborted(
            Context app,
            String transferId,
            String dest,
            int done,
            int remaining
    ) {
        try {
            CwspBridgeService.requestReconnect(app);
        } catch (Throwable ignored) { /* */ }
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        if (ws == null || !ws.isOpen()) {
            for (int i = 0; i < 20 && (ws == null || !ws.isOpen()); i++) {
                try { Thread.sleep(100); } catch (InterruptedException ignored) { break; }
                ws = CwspBridgeService.getSharedWs();
            }
        }
        if (ws == null || !ws.isOpen()) return false;
        String clientId = Configure.readClientId(app);
        if (clientId == null || clientId.isEmpty()) clientId = "L-unknown";
        List<String> destinations = new ArrayList<>(1);
        if (dest != null && !dest.isEmpty()) destinations.add(dest);
        else destinations.add("*");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("transferId", transferId != null ? transferId : "");
        payload.put("code", "aborted");
        payload.put("message", "CWSP_FILES_ABORTED");
        payload.put("done", done);
        payload.put("remaining", remaining);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("done", done);
        summary.put("remaining", remaining);
        summary.put("fileCount", done + remaining);
        payload.put("summary", summary);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "files:error");
        packet.put("type", "files:error");
        packet.put("purpose", "storage");
        packet.put("protocol", "ws");
        packet.put("transport", "ws");
        packet.put("uuid", UUID.randomUUID().toString());
        packet.put("timestamp", System.currentTimeMillis());
        packet.put("sender", clientId);
        packet.put("byId", clientId);
        packet.put("nodes", destinations);
        packet.put("destinations", destinations);
        Map<String, Object> flags = new LinkedHashMap<>();
        flags.put("canonicalV2", true);
        flags.put("aborted", true);
        packet.put("flags", flags);
        packet.put("payload", payload);
        return ws.send(packet);
    }

    /**
     * Decode one batch into landing files. Returns count of logical files written.
     */
    private static int materializeBatch(
            Context app,
            JSONObject batch,
            File incomingRoot,
            File landingRoot,
            String sender,
            ByteProgress progress
    ) throws Exception {
        String kind = batch.optString("kind", "raw");
        String batchId = batch.optString("batchId", "batch");
        JSONObject asset = batch.optJSONObject("asset");
        if (asset == null) throw new Exception("CWSP_FILES_NO_ASSET:" + batchId);

        String safeBatch = sanitizeName(batchId, "batch");
        File blobFile = new File(incomingRoot, safeBatch + ".bin");
        // WHY: stream URL / sidecar / embed to disk — avoid loading multi-MiB
        // batches twice into RAM (L-196 OOM → Accepting… forever).
        long expected = asset.optLong("size", 0L);
        if (expected <= 0L) expected = estimateBatchBytes(batch);
        long got = writeAssetToFile(app, asset, blobFile, sender, expected, progress);
        if (!blobFile.isFile() || blobFile.length() <= 0) {
            throw new Exception("CWSP_FILES_EMPTY_ASSET:" + batchId
                    + " (large batch needs putBlob/HTTP on LAN)");
        }
        // Prefer on-disk length (authoritative) over offer size hints.
        long landed = blobFile.length();
        if (progress != null) {
            progress.addCompleted(landed > 0 ? landed : Math.max(0L, got));
        }

        if ("zip".equals(kind)) {
            return unzipFileTo(landingRoot, blobFile);
        }
        if ("compressed".equals(kind)) {
            byte[] raw = gunzipFile(blobFile);
            String name = firstLogicalName(batch, safeBatch + ".bin");
            writeBytes(new File(landingRoot, sanitizeName(name, "file.bin")), raw);
            return 1;
        }
        // raw — copy blob into landing under the logical name
        String name = firstLogicalName(batch, asset.optString("name", safeBatch + ".bin"));
        File dest = new File(landingRoot, sanitizeName(name, "file.bin"));
        copyFile(blobFile, dest);
        return 1;
    }

    /**
     * Resolve asset bytes onto {@code dest}: sidecar → embed data → HTTP url.
     * @return bytes written (best-effort)
     */
    private static long writeAssetToFile(
            Context app,
            JSONObject asset,
            File dest,
            String sender,
            long expectedSize,
            ByteProgress progress
    ) throws Exception {
        String sidecar = asset.optString("sidecar", "");
        if (sidecar != null && !sidecar.isEmpty()) {
            File src = FilesPendingOffers.sidecarFile(app, sidecar);
            if (src == null) throw new Exception("CWSP_FILES_SIDECAR_MISSING:" + sidecar);
            copyFile(src, dest);
            return dest.isFile() ? dest.length() : 0L;
        }
        String data = asset.optString("data", "");
        if (data != null && !data.isEmpty()) {
            String b64 = data;
            int comma = data.indexOf(',');
            if (data.startsWith("data:") && comma > 0) {
                b64 = data.substring(comma + 1);
            }
            byte[] bytes = Base64.decode(b64, Base64.DEFAULT);
            writeBytes(dest, bytes);
            return bytes != null ? bytes.length : 0L;
        }
        String url = asset.optString("url", "");
        org.json.JSONArray urlsArr = asset.optJSONArray("urls");
        if ((url != null && !url.isEmpty()) || (urlsArr != null && urlsArr.length() > 0)) {
            return httpGetToFile(
                    rewriteLoopbackBlobUrl(url, sender),
                    dest,
                    expectedSize,
                    progress,
                    urlsArr,
                    sender,
                    app);
        }
        throw new Exception("CWSP_FILES_NO_DATA_OR_URL");
    }

    /**
     * WHY (Cap↔Cap): older senders advertised {@code http://127.0.0.1:8434/...}
     * when clientId was short {@code L-210}. Rewrite to the sender peer LAN IP
     * so Accept does not pull from the receiver's own loopback.
     */
    private static String rewriteLoopbackBlobUrl(String url, String sender) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null) return url;
            if (!"127.0.0.1".equals(host) && !"localhost".equalsIgnoreCase(host)) return url;
            String lan = FilesOutboundOffer.lanHostFromClientId(sender);
            if (lan == null || lan.isEmpty()) return url;
            int port = u.getPort() > 0 ? u.getPort() : 8434;
            String q = u.getRawQuery();
            String rewritten = "http://" + lan + ":" + port + u.getRawPath()
                    + (q != null && !q.isEmpty() ? "?" + q : "");
            Log.i(TAG, "rewrote loopback blob url → " + lan + " sender=" + sender);
            return rewritten;
        } catch (Exception e) {
            return url;
        }
    }

    private static void httpGetToFile(String urlStr, File dest) throws Exception {
        httpGetToFile(urlStr, dest, 0L, null, null, null, null);
    }

    /**
     * Stream HTTP blob to disk, reporting mid-read bytes into {@code progress}.
     * Dual-path hedge: peer/P2P immediately, gateway after {@link #HEDGE_MS}.
     * @return bytes written
     */
    private static long httpGetToFile(
            String urlStr,
            File dest,
            long expectedSize,
            ByteProgress progress
    ) throws Exception {
        return httpGetToFile(urlStr, dest, expectedSize, progress, null, null, null);
    }

    private static long httpGetToFile(
            String urlStr,
            File dest,
            long expectedSize,
            ByteProgress progress,
            org.json.JSONArray urlsArr,
            String sender,
            Context app
    ) throws Exception {
        List<String> candidates = buildBlobFetchCandidates(urlStr, urlsArr, sender, app);
        List<String> peer = new ArrayList<>();
        List<String> gateway = new ArrayList<>();
        partitionBlobFetchCandidates(candidates, app, peer, gateway);
        if (!peer.isEmpty()) {
            // WHY: surface Cap↔Cap reachability — Neu→Cap works (desk→phone TCP);
            // Cap→Cap often fails at connect with no prior "did we ask?" signal.
            probePeerPathAvailable(peer.get(0));
        }
        if (peer.isEmpty()) {
            return httpGetSequential(gateway, dest, expectedSize, progress);
        }
        if (gateway.isEmpty()) {
            return httpGetSequential(peer, dest, expectedSize, progress);
        }
        return httpGetHedged(peer, gateway, dest, expectedSize, progress);
    }

    /**
     * Cheap HEAD to Cap Control / peer blob URL. Logs only — does not skip GET
     * (some stacks mishandle HEAD; GET remains source of truth).
     */
    private static void probePeerPathAvailable(String url) {
        if (url == null || url.isEmpty()) return;
        HttpURLConnection conn = null;
        try {
            conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(HTTP_CONNECT_PRIVATE_MS);
            conn.setReadTimeout(2_000);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestMethod("HEAD");
            if (conn instanceof HttpsURLConnection) {
                applyInsecureTls((HttpsURLConnection) conn);
            }
            int code = conn.getResponseCode();
            boolean ok = code >= 200 && code < 300;
            Log.i(TAG, "peer-path-probe ok=" + ok + " code=" + code + " url=" + url);
        } catch (Exception e) {
            Log.w(TAG, "peer-path-probe ok=false url=" + url
                    + " err=" + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()));
        } finally {
            if (conn != null) {
                try {
                    conn.disconnect();
                } catch (Exception ignored) { /* */ }
            }
        }
    }

    private static void partitionBlobFetchCandidates(
            List<String> candidates,
            Context app,
            List<String> peerOut,
            List<String> gatewayOut
    ) {
        if (candidates == null) return;
        for (String u : candidates) {
            if (u == null || u.isEmpty()) continue;
            if (isPeerBlobCandidate(u, app)) peerOut.add(u);
            else gatewayOut.add(u);
        }
    }

    /** Cap Control / peer LAN blob URL (not fleet gateway). */
    private static boolean isPeerBlobCandidate(String url, Context app) {
        try {
            java.net.URI uri = java.net.URI.create(url);
            String host = uri.getHost();
            String path = uri.getRawPath();
            if (host == null) return false;
            if (FilesBlobStore.LAN_GATEWAY_HOST.equals(host)) return false;
            if (FilesBlobStore.isWanGatewayHost(app, host)) return false;
            if (path != null && path.contains("/service/files-blob/")) return true;
            return path != null && path.contains("/files/blob/")
                    && host.startsWith("192.168.");
        } catch (Exception e) {
            return false;
        }
    }

    private static long httpGetSequential(
            List<String> urls,
            File dest,
            long expectedSize,
            ByteProgress progress
    ) throws Exception {
        Exception last = null;
        for (String candidate : urls) {
            try {
                return httpGetToFileOnce(candidate, dest, expectedSize, progress);
            } catch (Exception e) {
                last = e;
                Log.w(TAG, "httpGet candidate failed url=" + candidate + " err=" + e.getMessage());
            }
        }
        throw last != null ? last : new Exception("CWSP_FILES_HTTP_UNREACHABLE");
    }

    /**
     * Peer class vs gateway class race. First HTTP 2xx that claims the body wins;
     * loser connections are disconnected before they write progress bytes.
     */
    private static long httpGetHedged(
            List<String> peer,
            List<String> gateway,
            File dest,
            long expectedSize,
            ByteProgress progress
    ) throws Exception {
        final AtomicReference<String> winner = new AtomicReference<>(null);
        final AtomicLong bytesOut = new AtomicLong(-1L);
        final AtomicReference<Exception> peerErr = new AtomicReference<>(null);
        final AtomicReference<Exception> gwErr = new AtomicReference<>(null);
        final AtomicBoolean peerExhausted = new AtomicBoolean(false);
        final CountDownLatch done = new CountDownLatch(1);
        final List<HttpURLConnection> live =
                Collections.synchronizedList(new ArrayList<HttpURLConnection>());

        Thread peerT = new Thread(() -> {
            Exception last = null;
            for (String candidate : peer) {
                if (winner.get() != null) break;
                File tmp = new File(dest.getAbsolutePath() + ".hedge-peer-"
                        + UUID.randomUUID().toString().substring(0, 8));
                try {
                    long n = httpGetToFileOnce(
                            candidate, tmp, expectedSize, progress, winner, "peer", live);
                    if (!"peer".equals(winner.get())) {
                        // lost race after write — discard
                        //noinspection ResultOfMethodCallIgnored
                        tmp.delete();
                        break;
                    }
                    if (!tmp.renameTo(dest)) {
                        copyFileReplace(tmp, dest);
                        //noinspection ResultOfMethodCallIgnored
                        tmp.delete();
                    }
                    bytesOut.set(n);
                    Log.i(TAG, "httpGet hedge win who=peer url=" + candidate);
                    done.countDown();
                    return;
                } catch (Exception e) {
                    //noinspection ResultOfMethodCallIgnored
                    tmp.delete();
                    if (winner.get() != null && !"peer".equals(winner.get())) break;
                    last = e;
                    Log.w(TAG, "httpGet peer candidate failed url=" + candidate
                            + " err=" + e.getMessage());
                }
            }
            peerExhausted.set(true);
            if (last != null) peerErr.set(last);
            if (winner.get() == null && bytesOut.get() < 0) {
                // gateway thread may still win
            }
        }, "cwsp-files-hedge-peer");
        peerT.setDaemon(true);

        Thread gwT = new Thread(() -> {
            // Wait hedge OR peer class exhausted (dead Cap-on-LTE → start early).
            long deadline = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(HEDGE_MS);
            while (winner.get() == null && !peerExhausted.get()
                    && System.nanoTime() < deadline) {
                try {
                    Thread.sleep(20L);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
            if (winner.get() != null) return;
            Exception last = null;
            for (String candidate : gateway) {
                if (winner.get() != null) break;
                File tmp = new File(dest.getAbsolutePath() + ".hedge-gw-"
                        + UUID.randomUUID().toString().substring(0, 8));
                try {
                    long n = httpGetToFileOnce(
                            candidate, tmp, expectedSize, progress, winner, "gateway", live);
                    if (!"gateway".equals(winner.get())) {
                        //noinspection ResultOfMethodCallIgnored
                        tmp.delete();
                        break;
                    }
                    if (!tmp.renameTo(dest)) {
                        copyFileReplace(tmp, dest);
                        //noinspection ResultOfMethodCallIgnored
                        tmp.delete();
                    }
                    bytesOut.set(n);
                    Log.i(TAG, "httpGet hedge win who=gateway url=" + candidate);
                    done.countDown();
                    return;
                } catch (Exception e) {
                    //noinspection ResultOfMethodCallIgnored
                    tmp.delete();
                    if (winner.get() != null && !"gateway".equals(winner.get())) break;
                    last = e;
                    Log.w(TAG, "httpGet gateway candidate failed url=" + candidate
                            + " err=" + e.getMessage());
                }
            }
            if (last != null) gwErr.set(last);
            done.countDown();
        }, "cwsp-files-hedge-gw");
        gwT.setDaemon(true);

        peerT.start();
        gwT.start();
        boolean finished = done.await(HTTP_READ_MS + 30_000L, TimeUnit.MILLISECONDS);
        if (!finished) {
            winner.compareAndSet(null, "timeout");
            disconnectAll(live, null);
            throw new Exception("CWSP_FILES_HTTP_TIMEOUT:hedge");
        }
        long n = bytesOut.get();
        if (n >= 0) return n;
        Exception pe = peerErr.get();
        Exception ge = gwErr.get();
        if (ge != null) throw ge;
        if (pe != null) throw pe;
        throw new Exception("CWSP_FILES_HTTP_UNREACHABLE:hedge");
    }

    private static void disconnectAll(List<HttpURLConnection> live, HttpURLConnection keep) {
        if (live == null) return;
        synchronized (live) {
            for (HttpURLConnection c : live) {
                if (c == null || c == keep) continue;
                try {
                    c.disconnect();
                } catch (Throwable ignored) { /* */ }
            }
        }
    }

    private static void copyFileReplace(File from, File to) throws Exception {
        try (FileInputStream in = new FileInputStream(from);
             FileOutputStream out = new FileOutputStream(to)) {
            byte[] buf = new byte[64 * 1024];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        }
    }

    /**
     * Build Accept probe order: peer LAN / P2P → gateway LAN → WAN.
     * Expands gateway host variants (same token) and rewrites Cap loopback URLs.
     */
    private static List<String> buildBlobFetchCandidates(
            String primary,
            org.json.JSONArray urlsArr,
            String sender,
            Context app
    ) {
        String wanHost = FilesBlobStore.resolveWanGatewayHost(app);
        java.util.LinkedHashSet<String> raw = new java.util.LinkedHashSet<>();
        if (urlsArr != null) {
            for (int i = 0; i < urlsArr.length(); i++) {
                String u = urlsArr.optString(i, "");
                if (u != null && !u.isEmpty()) {
                    raw.add(rewriteLoopbackBlobUrl(u, sender));
                }
            }
        }
        if (primary != null && !primary.isEmpty()) {
            raw.add(rewriteLoopbackBlobUrl(primary, sender));
        }
        // Expand gateway LAN↔WAN variants (same path+token).
        java.util.LinkedHashSet<String> expanded = new java.util.LinkedHashSet<>();
        String senderLan = FilesOutboundOffer.lanHostFromClientId(sender);
        for (String u : raw) {
            expanded.add(u);
            String lan = preferLanGatewayBlobUrl(u, wanHost);
            String wan = preferWanGatewayBlobUrl(u, wanHost);
            if (lan != null && !lan.isEmpty()) expanded.add(lan);
            if (wan != null && !wan.isEmpty()) expanded.add(wan);
            // WHY: Cap↔Cap — offer may advertise DHCP IP; also probe fleet map
            // host from sender id (L-210→192.168.0.210) so path ask is possible.
            if (senderLan != null && !senderLan.isEmpty()) {
                String peerAlias = FilesOutboundOffer.rewriteBlobUrlHost(u, senderLan);
                if (peerAlias != null && !peerAlias.isEmpty()) expanded.add(peerAlias);
            }
        }
        List<String> peer = new ArrayList<>();
        List<String> gwLan = new ArrayList<>();
        List<String> gwWan = new ArrayList<>();
        List<String> other = new ArrayList<>();
        for (String u : expanded) {
            try {
                java.net.URI uri = java.net.URI.create(u);
                String host = uri.getHost();
                String path = uri.getRawPath();
                if (host == null) {
                    other.add(u);
                } else if (FilesBlobStore.LAN_GATEWAY_HOST.equals(host)) {
                    gwLan.add(u);
                } else if (FilesBlobStore.isWanGatewayHost(app, host)) {
                    gwWan.add(u);
                } else if (path != null && path.contains("/service/files-blob/")) {
                    peer.add(u);
                } else if (path != null && path.contains("/files/blob/")
                        && host.startsWith("192.168.")) {
                    peer.add(u);
                } else {
                    other.add(u);
                }
            } catch (Exception e) {
                other.add(u);
            }
        }
        // INVARIANT: peer → gwLAN → gwWAN → other. Never flip by primary URL class.
        // Hedged connect (httpGetHedged) starts gateway after HEDGE_MS.
        List<String> out = new ArrayList<>(peer.size() + gwLan.size() + gwWan.size() + other.size());
        out.addAll(peer);
        out.addAll(gwLan);
        out.addAll(gwWan);
        out.addAll(other);
        return out;
    }

    /** Map WAN gateway entry → LAN for Accept while on home Wi‑Fi. */
    private static String preferLanGatewayBlobUrl(String url, String wanHost) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null) return url;
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

    /** Map LAN gateway → WAN entry for LTE Accept fallback. */
    private static String preferWanGatewayBlobUrl(String url, String wanHost) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null || !FilesBlobStore.LAN_GATEWAY_HOST.equals(host)) return url;
            String path = u.getRawPath();
            if (path == null || !path.contains("/files/blob/")) return url;
            String target = (wanHost != null && !wanHost.isEmpty())
                    ? wanHost
                    : FilesBlobStore.WAN_GATEWAY_HOST_FALLBACK;
            int port = u.getPort() > 0 ? u.getPort() : 8434;
            String q = u.getRawQuery();
            return "https://" + target + ":" + port + path
                    + (q != null && !q.isEmpty() ? "?" + q : "");
        } catch (Exception e) {
            return url;
        }
    }

    private static long httpGetToFileOnce(
            String urlStr,
            File dest,
            long expectedSize,
            ByteProgress progress
    ) throws Exception {
        return httpGetToFileOnce(urlStr, dest, expectedSize, progress, null, null, null);
    }

    /**
     * @param winner hedge claim slot; null = no race
     * @param who    "peer" | "gateway" when racing
     * @param live   live connections to disconnect on lost race
     */
    private static long httpGetToFileOnce(
            String urlStr,
            File dest,
            long expectedSize,
            ByteProgress progress,
            AtomicReference<String> winner,
            String who,
            List<HttpURLConnection> live
    ) throws Exception {
        String tid = progress != null ? progress.transferId : "";
        FilesTransferControl.throwIfAborted(tid);
        if (winner != null && winner.get() != null && (who == null || !who.equals(winner.get()))) {
            throw new Exception("CWSP_FILES_HEDGE_LOST");
        }
        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        int connectMs = HTTP_CONNECT_MS;
        try {
            String host = new URL(urlStr).getHost();
            if (FilesBlobStore.isPrivateLanHost(host)) {
                connectMs = HTTP_CONNECT_PRIVATE_MS;
            }
        } catch (Exception ignored) { /* */ }
        conn.setConnectTimeout(connectMs);
        conn.setReadTimeout(HTTP_READ_MS);
        conn.setInstanceFollowRedirects(true);
        conn.setRequestMethod("GET");
        if (conn instanceof HttpsURLConnection) {
            // COMPAT: gateway uses fleet self-signed certs (same as APK update).
            applyInsecureTls((HttpsURLConnection) conn);
        }
        if (live != null) live.add(conn);
        FilesTransferControl.bindConnection(tid, conn);
        int code;
        try {
            code = conn.getResponseCode();
        } catch (java.net.SocketTimeoutException e) {
            throw new Exception("CWSP_FILES_HTTP_TIMEOUT (use LAN; LTE cannot reach private blob URLs): "
                    + urlStr);
        } catch (java.net.ConnectException e) {
            if (FilesTransferControl.isAborted(tid)) throw new Exception("CWSP_FILES_ABORTED");
            throw new Exception("CWSP_FILES_HTTP_UNREACHABLE:" + urlStr);
        } catch (javax.net.ssl.SSLException e) {
            if (FilesTransferControl.isAborted(tid)) throw new Exception("CWSP_FILES_ABORTED");
            throw new Exception("CWSP_FILES_HTTP_TLS:" + urlStr + " " + e.getMessage());
        } catch (java.io.IOException e) {
            if (FilesTransferControl.isAborted(tid)) throw new Exception("CWSP_FILES_ABORTED");
            throw e;
        }
        InputStream in = code >= 200 && code < 300 ? conn.getInputStream() : conn.getErrorStream();
        if (in == null) throw new Exception("CWSP_FILES_HTTP_" + code);
        try {
            if (code == 401 || code == 403) {
                throw new Exception("CWSP_FILES_HTTP_" + code
                        + " (desk blob auth — redeploy Neutralino control with token-only files-blob)");
            }
            if (code < 200 || code >= 300) {
                throw new Exception("CWSP_FILES_HTTP_" + code);
            }
            // WHY: claim before body so loser does not advance Sending progress.
            if (winner != null && who != null) {
                if (!winner.compareAndSet(null, who) && !who.equals(winner.get())) {
                    throw new Exception("CWSP_FILES_HEDGE_LOST");
                }
                disconnectAll(live, conn);
            }
            long contentLen = 0L;
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    contentLen = conn.getContentLengthLong();
                } else {
                    contentLen = conn.getContentLength();
                }
            } catch (Throwable ignored) { /* */ }
            if (progress != null) {
                long known = Math.max(contentLen, expectedSize);
                if (known > 0) progress.ensureTotalAtLeast(progress.completedBytes + known);
            }
            long written = 0L;
            try (FileOutputStream fos = new FileOutputStream(dest)) {
                byte[] buf = new byte[64 * 1024];
                int n;
                while ((n = in.read(buf)) > 0) {
                    FilesTransferControl.throwIfAborted(tid);
                    if (winner != null && who != null && !who.equals(winner.get())) {
                        throw new Exception("CWSP_FILES_HEDGE_LOST");
                    }
                    fos.write(buf, 0, n);
                    written += n;
                    if (progress != null) {
                        progress.reportInFlight(written);
                    }
                }
            } catch (java.io.IOException e) {
                if (FilesTransferControl.isAborted(tid)) throw new Exception("CWSP_FILES_ABORTED");
                throw e;
            }
            if (progress != null) {
                progress.reportInFlight(written);
            }
            return written;
        } finally {
            FilesTransferControl.unbindConnection(tid, conn);
            if (live != null) {
                try {
                    live.remove(conn);
                } catch (Throwable ignored) { /* */ }
            }
            conn.disconnect();
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

    /** Prefer offer.summary.totalBytes; else sum asset.size / logical file sizes. */
    private static long resolveOfferTotalBytes(JSONObject offer, JSONArray batches) {
        if (offer != null) {
            JSONObject summary = offer.optJSONObject("summary");
            if (summary != null) {
                long t = summary.optLong("totalBytes", 0L);
                if (t > 0L) return t;
            }
        }
        long sum = 0L;
        if (batches == null) return 0L;
        for (int i = 0; i < batches.length(); i++) {
            JSONObject batch = batches.optJSONObject(i);
            if (batch == null) continue;
            sum += Math.max(0L, estimateBatchBytes(batch));
        }
        return sum;
    }

    private static long estimateBatchBytes(JSONObject batch) {
        if (batch == null) return 0L;
        JSONObject asset = batch.optJSONObject("asset");
        if (asset != null) {
            long s = asset.optLong("size", 0L);
            if (s > 0L) return s;
        }
        JSONArray files = batch.optJSONArray("files");
        if (files != null) {
            long sum = 0L;
            for (int i = 0; i < files.length(); i++) {
                JSONObject f = files.optJSONObject(i);
                if (f != null) sum += Math.max(0L, f.optLong("size", 0L));
            }
            if (sum > 0L) return sum;
        }
        return 0L;
    }

    private static int unzipFileTo(File destDir, File zipFile) throws Exception {
        int count = 0;
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            byte[] buf = new byte[8192];
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;
                String name = sanitizeName(new File(entry.getName()).getName(), "file.bin");
                File out = new File(destDir, name);
                // SECURITY: keep under destDir
                String rel = destDir.toURI().relativize(out.toURI()).getPath();
                if (rel.startsWith("..")) continue;
                try (FileOutputStream fos = new FileOutputStream(out)) {
                    int n;
                    while ((n = zis.read(buf)) > 0) fos.write(buf, 0, n);
                }
                count++;
                zis.closeEntry();
            }
        }
        return count;
    }

    private static byte[] gunzipFile(File gzFile) throws Exception {
        try (GZIPInputStream gis = new GZIPInputStream(new FileInputStream(gzFile))) {
            return readAll(gis);
        }
    }

    private static void copyFile(File src, File dest) throws Exception {
        try (InputStream is = new FileInputStream(src);
             OutputStream os = new FileOutputStream(dest)) {
            copyStream(is, os);
        }
    }

    private static byte[] readAll(InputStream in) throws Exception {
        byte[] buf = new byte[8192];
        java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
        int n;
        while ((n = in.read(buf)) > 0) bos.write(buf, 0, n);
        return bos.toByteArray();
    }

    private static void writeBytes(File f, byte[] bytes) throws Exception {
        try (FileOutputStream fos = new FileOutputStream(f)) {
            fos.write(bytes);
        }
    }

    private static String firstLogicalName(JSONObject batch, String fallback) {
        JSONArray files = batch.optJSONArray("files");
        if (files != null && files.length() > 0) {
            JSONObject f0 = files.optJSONObject(0);
            if (f0 != null) {
                String n = f0.optString("name", "");
                if (!n.isEmpty()) return n;
            }
        }
        return fallback;
    }

    private static String sanitizeName(String raw, String fallback) {
        if (raw == null || raw.isEmpty()) return fallback;
        String base = new File(raw).getName();
        if (base.isEmpty() || ".".equals(base) || "..".equals(base)) return fallback;
        StringBuilder sb = new StringBuilder(base.length());
        for (int i = 0; i < base.length(); i++) {
            char c = base.charAt(i);
            if (c < 32 || c == '/' || c == '\\' || c == ':' || c == '*' || c == '?' || c == '"' || c == '<' || c == '>' || c == '|') {
                sb.append('_');
            } else {
                sb.append(c);
            }
        }
        String out = sb.toString().trim();
        return out.isEmpty() ? fallback : out;
    }

    /**
     * Export app landing tree to Downloads and/or SAF tree per prefs.
     * WHY: app-private landing is invisible in many File Managers.
     * @return public Uri of the newest exported file (for single-file Open File), else null
     */
    private static Uri exportLanding(Context app, File landingRoot, String transferId) {
        if (landingRoot == null || !landingRoot.isDirectory()) return null;
        File[] kids = landingRoot.listFiles();
        if (kids == null || kids.length == 0) return null;
        Uri newestUri = null;
        long newestMod = -1L;
        for (File kid : kids) {
            if (!kid.isFile()) continue;
            try {
                Uri exported = FilesStorage.exportOneFile(app, kid, guessMime(kid.getName()), transferId);
                if (exported != null && kid.lastModified() >= newestMod) {
                    newestMod = kid.lastModified();
                    newestUri = exported;
                }
            } catch (Exception e) {
                Log.w(TAG, "export failed " + kid.getName(), e);
            }
        }
        return newestUri;
    }

    private static void copyStream(InputStream is, OutputStream os) throws Exception {
        byte[] buf = new byte[8192];
        int n;
        while ((n = is.read(buf)) > 0) os.write(buf, 0, n);
        os.flush();
    }

    private static String guessMime(String name) {
        String lower = name != null ? name.toLowerCase() : "";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".txt")) return "text/plain";
        if (lower.endsWith(".zip")) return "application/zip";
        if (lower.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }

    private static void notifyProgress(Context app, String tid, String msg, int done, int total) {
        FilesIncomingNotifier.notifyProgress(app, tid, msg, done, total);
    }

    private static void notifyDone(
            Context app,
            String tid,
            int fileCount,
            String path,
            String contentUri,
            String displayName
    ) {
        FilesIncomingNotifier.notifySaved(app, tid, fileCount, path, contentUri, displayName);
        Log.i(TAG, "landing path=" + path + " contentUri=" + contentUri
                + " displayName=" + displayName);
    }

    private static void notifyFail(Context app, String tid, String reason) {
        notifyFailPublic(app, tid, reason);
    }

    /** Public for FilesAcceptService catch path — never leave Accepting… stuck. */
    public static void notifyFailPublic(Context app, String tid, String reason) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("transferId", tid != null ? tid : "");
        m.put("sender", reason != null ? reason : "failed");
        FilesIncomingNotifier.notify(app, m, true);
    }
}
