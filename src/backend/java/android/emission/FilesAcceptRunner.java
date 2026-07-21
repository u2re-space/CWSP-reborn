/*
 * Filename: FilesAcceptRunner.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesAcceptRunner.java
 * Change date and time: 18.25.00_21.07.2026
 * Reason for changes: Cap Accept previously only launched MainActivity — desk
 *   never saw files:accept and no bytes landed. This runner (1) emits
 *   files:accept|/decline over CwspWsClient, (2) materializes embed/url
 *   batches into files/incoming + landing, (3) exports to Downloads/SAF
 *   per shell prefs.
 *
 * INVARIANT: never touches clipboard channels. Progress uses FilesIncomingNotifier.
 */
package emission;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
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
    private static final int HTTP_TIMEOUT_MS = 60_000;

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

        // WHY: embedded offers already carry bytes — do not hard-fail Accept when
        // /ws is briefly down (second Cap often lost Accept solely because
        // sendFilesAct returned false, even though landing could succeed).
        boolean needsHttp = offerNeedsHttpPull(offer);
        boolean signaled = sendFilesAct(app, "files:accept", tid, sender);
        Log.i(TAG, "accept files:accept sent=" + signaled
                + " transferId=" + tid + " to=" + sender
                + " needsHttp=" + needsHttp);
        if (!signaled && needsHttp) {
            notifyFail(app, tid, "WebSocket not connected — open CWSP then Accept again");
            return false;
        }
        if (!signaled) {
            Log.w(TAG, "accept: WS signal failed — continuing embed materialize");
        }

        try {
            JSONArray batches = offer.optJSONArray("batches");
            if (batches == null || batches.length() == 0) {
                // WHY: summary-only notify path (old bridge) — accept reached desk
                // but Cap cannot materialize without batches/asset.
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

            int written = 0;
            int total = batches.length();
            for (int i = 0; i < total; i++) {
                JSONObject batch = batches.optJSONObject(i);
                if (batch == null) continue;
                notifyProgress(app, tid, "Downloading batch " + (i + 1) + "/" + total, i, total);
                written += materializeBatch(app, batch, incomingRoot, landingRoot);
            }

            exportLanding(app, landingRoot);

            FilesPendingOffers.delete(app, tid);
            FilesIncomingNotifier.cancel(app, tid);
            notifyDone(app, tid, written, landingRoot.getAbsolutePath());
            Log.i(TAG, "accept done transferId=" + tid + " files=" + written
                    + " landing=" + landingRoot.getAbsolutePath());
            return true;
        } catch (Exception e) {
            Log.w(TAG, "accept materialize failed", e);
            notifyFail(app, tid, String.valueOf(e.getMessage()));
            return false;
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
            // Brief wait for reconnect after requestReconnect.
            for (int i = 0; i < 15 && (ws == null || !ws.isOpen()); i++) {
                try { Thread.sleep(200); } catch (InterruptedException ignored) { break; }
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
            File landingRoot
    ) throws Exception {
        String kind = batch.optString("kind", "raw");
        String batchId = batch.optString("batchId", "batch");
        JSONObject asset = batch.optJSONObject("asset");
        if (asset == null) throw new Exception("CWSP_FILES_NO_ASSET:" + batchId);

        byte[] bytes = loadAssetBytes(asset);
        if (bytes == null || bytes.length == 0) {
            throw new Exception("CWSP_FILES_EMPTY_ASSET:" + batchId
                    + " (large batch needs putBlob/HTTP — desk stub)");
        }

        String safeBatch = sanitizeName(batchId, "batch");
        File blobFile = new File(incomingRoot, safeBatch + ".bin");
        try (FileOutputStream fos = new FileOutputStream(blobFile)) {
            fos.write(bytes);
        }

        if ("zip".equals(kind)) {
            return unzipTo(landingRoot, bytes);
        }
        if ("compressed".equals(kind)) {
            byte[] raw = gunzip(bytes);
            String name = firstLogicalName(batch, safeBatch + ".bin");
            writeBytes(new File(landingRoot, sanitizeName(name, "file.bin")), raw);
            return 1;
        }
        // raw
        String name = firstLogicalName(batch, asset.optString("name", safeBatch + ".bin"));
        writeBytes(new File(landingRoot, sanitizeName(name, "file.bin")), bytes);
        return 1;
    }

    private static byte[] loadAssetBytes(JSONObject asset) throws Exception {
        String data = asset.optString("data", "");
        if (data != null && !data.isEmpty()) {
            // WHY: data may be bare base64 or a data: URL.
            String b64 = data;
            int comma = data.indexOf(',');
            if (data.startsWith("data:") && comma > 0) {
                b64 = data.substring(comma + 1);
            }
            return Base64.decode(b64, Base64.DEFAULT);
        }
        String url = asset.optString("url", "");
        if (url != null && !url.isEmpty()) {
            return httpGet(url);
        }
        return null;
    }

    private static byte[] httpGet(String urlStr) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        conn.setConnectTimeout(HTTP_TIMEOUT_MS);
        conn.setReadTimeout(HTTP_TIMEOUT_MS);
        conn.setInstanceFollowRedirects(true);
        conn.setRequestMethod("GET");
        int code = conn.getResponseCode();
        InputStream in = code >= 200 && code < 300 ? conn.getInputStream() : conn.getErrorStream();
        if (in == null) throw new Exception("CWSP_FILES_HTTP_" + code);
        try {
            byte[] buf = readAll(in);
            if (code < 200 || code >= 300) {
                throw new Exception("CWSP_FILES_HTTP_" + code);
            }
            return buf;
        } finally {
            conn.disconnect();
        }
    }

    private static int unzipTo(File destDir, byte[] zipBytes) throws Exception {
        int count = 0;
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipBytes))) {
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

    private static byte[] gunzip(byte[] gz) throws Exception {
        try (GZIPInputStream gis = new GZIPInputStream(new ByteArrayInputStream(gz))) {
            return readAll(gis);
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
     */
    private static void exportLanding(Context app, File landingRoot) {
        if (landingRoot == null || !landingRoot.isDirectory()) return;
        File[] kids = landingRoot.listFiles();
        if (kids == null || kids.length == 0) return;
        String mode = FilesStorage.readLandingMode(app);
        String saf = FilesStorage.readIncomingDir(app);
        for (File kid : kids) {
            if (!kid.isFile()) continue;
            try {
                if ("downloads".equals(mode)) {
                    copyToDownloads(app, kid);
                } else if ("saf".equals(mode) && saf != null && !saf.isEmpty()) {
                    copyToSafTree(app, Uri.parse(saf), kid);
                }
            } catch (Exception e) {
                Log.w(TAG, "export failed " + kid.getName(), e);
            }
        }
    }

    private static void copyToDownloads(Context app, File file) throws Exception {
        String name = file.getName();
        String mime = guessMime(name);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, name);
            values.put(MediaStore.Downloads.MIME_TYPE, mime);
            values.put(MediaStore.Downloads.IS_PENDING, 1);
            ContentResolver cr = app.getContentResolver();
            Uri uri = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new Exception("MediaStore insert failed");
            try (OutputStream os = cr.openOutputStream(uri);
                 InputStream is = new FileInputStream(file)) {
                if (os == null) throw new Exception("openOutputStream null");
                copyStream(is, os);
            }
            values.clear();
            values.put(MediaStore.Downloads.IS_PENDING, 0);
            cr.update(uri, values, null, null);
        } else {
            File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!dir.exists()) dir.mkdirs();
            File dest = new File(dir, name);
            try (InputStream is = new FileInputStream(file);
                 OutputStream os = new FileOutputStream(dest)) {
                copyStream(is, os);
            }
        }
    }

    private static void copyToSafTree(Context app, Uri treeUri, File file) throws Exception {
        ContentResolver cr = app.getContentResolver();
        String docId = DocumentsContract.getTreeDocumentId(treeUri);
        Uri parent = DocumentsContract.buildDocumentUriUsingTree(treeUri, docId);
        String mime = guessMime(file.getName());
        Uri child = DocumentsContract.createDocument(cr, parent, mime, file.getName());
        if (child == null) throw new Exception("createDocument failed");
        try (OutputStream os = cr.openOutputStream(child);
             InputStream is = new FileInputStream(file)) {
            if (os == null) throw new Exception("SAF openOutputStream null");
            copyStream(is, os);
        }
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

    private static void notifyDone(Context app, String tid, int fileCount, String path) {
        FilesIncomingNotifier.notifyProgress(app, tid,
                "Saved " + fileCount + " file(s)", fileCount, fileCount);
        Log.i(TAG, "landing path=" + path);
    }

    private static void notifyFail(Context app, String tid, String reason) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("transferId", tid != null ? tid : "");
        m.put("sender", reason != null ? reason : "failed");
        FilesIncomingNotifier.notify(app, m, true);
    }
}
