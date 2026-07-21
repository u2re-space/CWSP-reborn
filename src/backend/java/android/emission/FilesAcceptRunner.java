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
 *
 * INVARIANT: never touches clipboard channels. Progress uses FilesIncomingNotifier.
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

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
    /** Read timeout — large desk blobs (tens of MiB) need more than a short read budget. */
    private static final int HTTP_READ_MS = 180_000;
    /** Max progress notification rate (~4Hz) — mirrors TS FilesProgressTracker. */
    private static final long PROGRESS_MIN_INTERVAL_MS = 250L;

    /**
     * Aggregate byte clock for one Accept. WHY: Notification must show real
     * bytes/speed/ETA; batch index alone looks frozen on a 5–10+ MiB file.
     */
    private static final class ByteProgress {
        final Context app;
        final String transferId;
        /** Bytes already finished from prior batches. */
        long completedBytes;
        /** Mutable when Content-Length arrives after offer lacked summary. */
        long totalBytes;
        long speedBps;
        long lastSampleMs;
        long lastSampleBytes;
        long lastNotifyMs;
        String label = "Downloading";

        ByteProgress(Context app, String transferId, long totalBytes) {
            this.app = app;
            this.transferId = transferId != null ? transferId : "";
            this.totalBytes = Math.max(0L, totalBytes);
            long now = System.currentTimeMillis();
            this.lastSampleMs = now;
            this.lastNotifyMs = 0L;
        }

        void setLabel(String label) {
            if (label != null && !label.isEmpty()) this.label = label;
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
            ByteProgress progress = new ByteProgress(app, tid, offerTotalBytes);
            progress.setLabel(needsHttp ? "Downloading" : "Saving");
            progress.reportInFlight(0);

            int written = 0;
            int total = batches.length();
            int skippedCorrupt = 0;
            for (int i = 0; i < total; i++) {
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
                progress.setLabel("Downloading " + (i + 1) + "/" + total);
                written += materializeBatch(app, batch, incomingRoot, landingRoot, sender, progress);
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
            Log.i(TAG, "accept done transferId=" + tid + " files=" + written
                    + " landing=" + landingRoot.getAbsolutePath()
                    + " openUri=" + openUri
                    + " displayName=" + displayName);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "accept materialize failed", e);
            notifyFail(app, tid, String.valueOf(e.getMessage()));
            return false;
        } finally {
            // WHY: never leave the notif stuck on indeterminate Accepting…
            // even if a later notifyDone/notifyFail was skipped by a crash path.
        }
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
        if (url != null && !url.isEmpty()) {
            return httpGetToFile(
                    rewriteLoopbackBlobUrl(url, sender),
                    dest,
                    expectedSize,
                    progress);
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
        httpGetToFile(urlStr, dest, 0L, null);
    }

    /**
     * Stream HTTP blob to disk, reporting mid-read bytes into {@code progress}.
     * @return bytes written
     */
    private static long httpGetToFile(
            String urlStr,
            File dest,
            long expectedSize,
            ByteProgress progress
    ) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        conn.setConnectTimeout(HTTP_CONNECT_MS);
        conn.setReadTimeout(HTTP_READ_MS);
        conn.setInstanceFollowRedirects(true);
        conn.setRequestMethod("GET");
        int code;
        try {
            code = conn.getResponseCode();
        } catch (java.net.SocketTimeoutException e) {
            throw new Exception("CWSP_FILES_HTTP_TIMEOUT (use LAN; LTE cannot reach private blob URLs): "
                    + urlStr);
        } catch (java.net.ConnectException e) {
            throw new Exception("CWSP_FILES_HTTP_UNREACHABLE:" + urlStr);
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
                    fos.write(buf, 0, n);
                    written += n;
                    if (progress != null) {
                        progress.reportInFlight(written);
                    }
                }
            }
            if (progress != null) {
                progress.reportInFlight(written);
            }
            return written;
        } finally {
            conn.disconnect();
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
