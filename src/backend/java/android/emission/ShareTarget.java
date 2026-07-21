/*
 * Filename: ShareTarget.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/ShareTarget.java
 * Change date and time: 20.30.00_21.07.2026
 * Reason for changes: Downscale/recompress phone photos before WS send — OkHttp 16MiB queue cap.
 *   2026-07-21: Files-hub ingress — VIEW / SEND_MULTIPLE / non-image SEND streams
 *   stage into app-private Temp (file-manager Share of selected files).
 *   2026-07-21 (Bug A): persist pending + Open for Share notif + seeded destinations.
 *   2026-07-21: Fix Share-from-Files — SEND_MULTIPLE always stages; API 33 URI
 *   collect; avoid double-offer when live WebView emit succeeds.
 *   2026-07-21: Single image/* SEND also stages via files-hub — clipboard path
 *   loaded full photo + Bitmap on main thread → OOM killed Cap ("unknown error").
 */

package emission;

import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.security.MessageDigest;
import androidx.core.app.ShareCompat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.json.JSONObject;

import space.u2re.cwsp.CwsBridgePlugin;

/**
 * Android share-target / process-text emission into CWSP clipboard contract.
 */
public class ShareTarget {
    private static final String TAG = "ShareTarget";
    /** Phone JPEGs are often 4–12MB; keep headroom under typical WS limits. */
    private static final int MAX_ASSET_BYTES = 12 * 1024 * 1024;
    /**
     * WHY: OkHttp enforces a hard 16 MiB outgoing WebSocket queue cap (MAX_QUEUE_SIZE,
     * non-configurable). A 12MB JPEG → ~16MB base64 + JSON envelope overflows → send()
     * returns false and OkHttp closes 1001. Downscale images above this threshold so
     * the base64 wire payload stays well under the cap.
     */
    private static final int DOWNSCALE_THRESHOLD = 3 * 1024 * 1024;
    private static final int DOWNSCALE_TARGET = 2 * 1024 * 1024;
    private static final int DOWNSCALE_MAX_DIM = 2048;

    private String lastSharedText = null;

    public static final class ShareResult {
        public final String text;
        public final Map<String, Object> asset;
        /** Count of files staged into app-private Temp (files-hub ingress branch). */
        public final int filesStagedCount;
        /** Transfer id for the staged files ingress; null when no files branch. */
        public final String transferId;
        /** Whether the files staging itself succeeded (independent of text/asset). */
        public final boolean filesOk;

        public ShareResult(String text, Map<String, Object> asset) {
            this(text, asset, 0, null, false);
        }

        private ShareResult(String text, Map<String, Object> asset,
                            int filesStagedCount, String transferId, boolean filesOk) {
            this.text = text;
            this.asset = asset;
            this.filesStagedCount = filesStagedCount;
            this.transferId = transferId;
            this.filesOk = filesOk;
        }

        /**
         * Files-staged result factory. WHY (Bug A): ShareTarget.stageFilesIngress
         * used to return {@code new ShareResult("", null)} which ShareActivity
         * treated as a failure ("Nothing to share"). A dedicated factory carries
         * the transferId + count so ShareActivity can show a real "ready to Open
         * for Share" status and the heads-up notification can fire.
         */
        public static ShareResult filesStaged(int count, String transferId, boolean ok) {
            return new ShareResult("", null, count, transferId, ok);
        }

        public boolean hasText() {
            return text != null && !text.isEmpty();
        }

        public boolean hasAsset() {
            return asset != null && !asset.isEmpty();
        }

        /** True when the files-hub ingress branch staged at least one file. */
        public boolean hasFilesStaged() {
            return filesStagedCount > 0 && transferId != null && !transferId.isEmpty();
        }
    }

    public void onShare(String text) {
        this.lastSharedText = text;
    }

    public String lastShared() {
        return lastSharedText;
    }

    /**
     * Extract shared text and/or image from an Intent into clipboard + optional WebView event.
     */
    public ShareResult handleIntent(Context context, Intent intent, Clipboard clipboard) {
        if (intent == null) return new ShareResult("", null);
        String action = intent.getAction();
        String type = intent.getType();
        boolean imageShare = type != null && type.toLowerCase(Locale.US).startsWith("image/");

        // WHY: Share/PROCESS_TEXT already means explicit CWSP share — arm watch
        // suppress before clipboard.write so outbound ask never posts Share notif.
        if (Intent.ACTION_SEND.equals(action)
                || Intent.ACTION_SEND_MULTIPLE.equals(action)
                || Intent.ACTION_PROCESS_TEXT.equals(action)
                || Intent.ACTION_VIEW.equals(action)) {
            try {
                space.u2re.cwsp.CwspBridgeService.suppressTextWatch(15_000L);
            } catch (Throwable ignored) { /* */ }
        }

        // Files-hub ingress (Amendment A2 + file-manager Share fix):
        // VIEW always stages. SEND_MULTIPLE always stages (selected files).
        // SEND with stream URIs stages unless it is a legacy single image/*
        // or text/* body share (clipboard path).
        if (isFilesIngressIntent(action, type, intent)) {
            return stageFilesIngress(context, intent,
                    Intent.ACTION_VIEW.equals(action)
                            ? FilesIngress.SOURCE_OPEN_WITH
                            : FilesIngress.SOURCE_SHARE_TARGET);
        }

        Map<String, Object> asset = null;
        if ((Intent.ACTION_SEND.equals(action) || Intent.ACTION_SEND_MULTIPLE.equals(action))
                && context != null) {
            Uri stream = resolveStreamUri(intent);
            Log.i(TAG, "share stream uri=" + stream + " type=" + type
                    + " grantRead=" + ((intent.getFlags() & Intent.FLAG_GRANT_READ_URI_PERMISSION) != 0));
            if (stream != null) {
                asset = readStreamAsAsset(context, stream, type);
                if (asset == null) {
                    Log.e(TAG, "readStreamAsAsset returned null for " + stream);
                } else {
                    Log.i(TAG, "asset ok hash=" + asset.get("hash")
                            + " size=" + asset.get("size")
                            + " mime=" + asset.get("mimeType"));
                }
            } else if (imageShare) {
                Log.e(TAG, "image share without resolvable EXTRA_STREAM/ClipData URI");
            }
        }

        // WHY: image ClipData.coerceToText() yields content://… — not a real text body.
        String text = imageShare ? "" : extractText(context, intent);

        if (text != null && !text.isEmpty()) {
            onShare(text);
            if (clipboard != null) {
                try {
                    clipboard.write(text);
                } catch (Exception e) {
                    Log.w(TAG, "clipboard write from share failed", e);
                }
            }
            CwsBridgePlugin.emitShareIntent(text, action != null ? action : Intent.ACTION_SEND);
        } else if (asset == null) {
            Log.w(TAG, "no text/asset in share intent action=" + action
                    + " type=" + type
                    + " extras=" + (intent.getExtras() != null ? intent.getExtras().keySet() : "null"));
        }

        if (asset != null && clipboard != null) {
            try {
                clipboard.writeAsset(asset);
                CwsBridgePlugin.emitClipboardAsset(asset);
            } catch (Exception e) {
                Log.w(TAG, "clipboard asset from share failed", e);
            }
        }

        return new ShareResult(text != null ? text : "", asset);
    }

    /** Resolve image/file URI from EXTRA_STREAM, ClipData, ShareCompat, or intent data. */
    private static Uri resolveStreamUri(Intent intent) {
        if (intent == null) return null;
        Uri stream = null;
        try {
            if (android.os.Build.VERSION.SDK_INT >= 33) {
                stream = intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri.class);
            } else {
                Object raw = intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (raw instanceof Uri) stream = (Uri) raw;
            }
        } catch (Exception e) {
            Log.w(TAG, "EXTRA_STREAM read failed", e);
        }
        if (stream == null) {
            try {
                Bundle extras = intent.getExtras();
                if (extras != null) {
                    Object raw = extras.get(Intent.EXTRA_STREAM);
                    if (raw instanceof Uri) stream = (Uri) raw;
                    else if (raw instanceof ArrayList && !((ArrayList<?>) raw).isEmpty()) {
                        Object first = ((ArrayList<?>) raw).get(0);
                        if (first instanceof Uri) stream = (Uri) first;
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "EXTRA_STREAM bundle read failed", e);
            }
        }
        if (stream == null) {
            ClipData clip = intent.getClipData();
            if (clip != null) {
                for (int i = 0; i < clip.getItemCount(); i++) {
                    ClipData.Item item = clip.getItemAt(i);
                    if (item != null && item.getUri() != null) {
                        stream = item.getUri();
                        break;
                    }
                }
            }
        }
        if (stream == null && intent.getData() != null) {
            String scheme = intent.getData().getScheme();
            if ("content".equalsIgnoreCase(scheme) || "file".equalsIgnoreCase(scheme)) {
                stream = intent.getData();
            }
        }
        return stream;
    }

    /** @deprecated Prefer {@link #handleIntent(Context, Intent, Clipboard)}. */
    @Deprecated
    public String handleIntent(Intent intent, Clipboard clipboard) {
        ShareResult result = handleIntent(null, intent, clipboard);
        return result.hasText() ? result.text : "";
    }

    /**
     * Pull shared/selected text from every common carrier.
     * WHY: PROCESS_TEXT OEMs differ — CharSequence vs String, ClipData-only, or EXTRA_TEXT.
     * Prefer raw Bundle.get() — typed getters can fail on Spannable/OEM wrappers.
     */
    private static String extractText(Context context, Intent intent) {
        if (intent == null) return "";

        String text = firstNonEmpty(
                readShareCompatText(context, intent),
                readBundleValue(intent, Intent.EXTRA_PROCESS_TEXT),
                readBundleValue(intent, Intent.EXTRA_TEXT),
                readCharSequenceList(intent, Intent.EXTRA_TEXT),
                readBundleValue(intent, Intent.EXTRA_HTML_TEXT),
                readBundleValue(intent, Intent.EXTRA_SUBJECT),
                readExtraCharSequence(intent, Intent.EXTRA_PROCESS_TEXT),
                readExtraString(intent, Intent.EXTRA_PROCESS_TEXT),
                readExtraCharSequence(intent, Intent.EXTRA_TEXT),
                readExtraString(intent, Intent.EXTRA_TEXT),
                readClipDataText(context, intent),
                readTextStream(context, intent),
                readIntentDataText(intent),
                readAnyTextLikeExtra(intent)
        );
        return text != null ? text.trim() : "";
    }

    private static String readShareCompatText(Context context, Intent intent) {
        if (!(context instanceof android.app.Activity) || intent == null) return null;
        try {
            ShareCompat.IntentReader reader =
                    new ShareCompat.IntentReader((android.app.Activity) context);
            CharSequence t = reader.getText();
            if (t != null) {
                String s = t.toString().trim();
                if (!s.isEmpty()) return s;
            }
            String html = reader.getHtmlText();
            if (html != null && !html.trim().isEmpty()) return html.trim();
        } catch (Exception e) {
            Log.w(TAG, "ShareCompat read failed", e);
        }
        return null;
    }

    private static String readCharSequenceList(Intent intent, String key) {
        try {
            ArrayList<CharSequence> list = intent.getCharSequenceArrayListExtra(key);
            if (list == null || list.isEmpty()) return null;
            StringBuilder sb = new StringBuilder();
            for (CharSequence c : list) {
                if (c == null) continue;
                if (sb.length() > 0) sb.append('\n');
                sb.append(c);
            }
            String s = sb.toString().trim();
            return s.isEmpty() ? null : s;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Last-resort: OEM text-like CharSequence extras only (never primary clipboard).
     * Skip empty SUBJECT/TITLE so we do not treat blank share metadata as body.
     */
    private static String readAnyTextLikeExtra(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras == null) return null;
        for (String key : extras.keySet()) {
            if (key == null) continue;
            String k = key.toLowerCase(Locale.US);
            if (k.contains("readonly") || k.contains("package") || k.contains("uid")
                    || k.contains("user") || k.contains("calling") || k.contains("task")
                    || k.contains("origin") || k.contains("subject") || k.contains("title")) {
                continue;
            }
            Object v;
            try {
                v = extras.get(key);
            } catch (Exception e) {
                continue;
            }
            if (!(v instanceof CharSequence)) continue;
            String s = ((CharSequence) v).toString().trim();
            if (s.length() < 1) continue;
            if (k.contains("process_text") || k.contains("extra.text")
                    || k.endsWith(".text") || k.contains("share") || k.contains("content")
                    || k.contains("clip") || k.contains("body") || k.contains("message")) {
                return s;
            }
        }
        return null;
    }

    /** Raw Bundle value — works when getCharSequenceExtra/getStringExtra disagree on type. */
    private static String readBundleValue(Intent intent, String key) {
        try {
            Bundle extras = intent.getExtras();
            if (extras == null || !extras.containsKey(key)) return null;
            Object v = extras.get(key);
            if (v == null) return null;
            if (v instanceof CharSequence) {
                String s = ((CharSequence) v).toString();
                return s.isEmpty() ? null : s;
            }
            String s = String.valueOf(v);
            return s.isEmpty() || "null".equals(s) ? null : s;
        } catch (Exception e) {
            Log.w(TAG, "readBundleValue " + key + " failed", e);
            return null;
        }
    }

    private static String readIntentDataText(Intent intent) {
        try {
            android.net.Uri data = intent.getData();
            if (data == null) return null;
            String scheme = data.getScheme();
            if ("data".equalsIgnoreCase(scheme) || "text".equalsIgnoreCase(scheme)) {
                String s = data.getSchemeSpecificPart();
                return s != null && !s.isEmpty() ? s : null;
            }
        } catch (Exception ignored) {
            /* ignore */
        }
        return null;
    }

    /**
     * ACTION_SEND text/plain with only EXTRA_STREAM (no EXTRA_TEXT) — read URI as UTF-8 text.
     */
    private static String readTextStream(Context context, Intent intent) {
        if (context == null || intent == null) return null;
        String type = intent.getType();
        boolean textMime = type != null && type.toLowerCase(Locale.US).startsWith("text/");
        if (!textMime && !Intent.ACTION_SEND.equals(intent.getAction())) return null;
        Uri stream = null;
        try {
            if (android.os.Build.VERSION.SDK_INT >= 33) {
                stream = intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri.class);
            } else {
                Object raw = intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (raw instanceof Uri) stream = (Uri) raw;
            }
        } catch (Exception e) {
            return null;
        }
        if (stream == null) return null;
        // Only treat as text when mime says so (or missing type with SEND text).
        String mime = type;
        try {
            String resolved = context.getContentResolver().getType(stream);
            if (resolved != null) mime = resolved;
        } catch (Exception ignored) {
            /* keep intent type */
        }
        if (mime != null && !mime.toLowerCase(Locale.US).startsWith("text/")
                && !mime.toLowerCase(Locale.US).contains("json")
                && !mime.equals("application/octet-stream")) {
            return null;
        }
        try (InputStream in = context.getContentResolver().openInputStream(stream)) {
            if (in == null) return null;
            byte[] bytes = readBounded(in, 512 * 1024);
            if (bytes == null || bytes.length == 0) return null;
            String s = new String(bytes, java.nio.charset.StandardCharsets.UTF_8).trim();
            return s.isEmpty() ? null : s;
        } catch (Exception e) {
            Log.w(TAG, "readTextStream failed", e);
            return null;
        }
    }

    private static String readExtraCharSequence(Intent intent, String key) {
        try {
            CharSequence seq = intent.getCharSequenceExtra(key);
            if (seq != null) {
                String s = seq.toString();
                if (!s.isEmpty()) return s;
            }
        } catch (Exception ignored) {
            /* type mismatch on some OEMs */
        }
        return null;
    }

    private static String readExtraString(Intent intent, String key) {
        try {
            String s = intent.getStringExtra(key);
            if (s != null && !s.isEmpty()) return s;
        } catch (Exception ignored) {
            /* ignore */
        }
        return null;
    }

    private static String readClipDataText(Context context, Intent intent) {
        ClipData clip = intent.getClipData();
        if (clip == null || clip.getItemCount() <= 0) return null;
        try {
            ClipData.Item item = clip.getItemAt(0);
            if (item == null) return null;
            CharSequence seq = context != null
                    ? item.coerceToText(context)
                    : item.getText();
            if (seq != null) {
                String s = seq.toString();
                if (!s.isEmpty()) return s;
            }
            if (item.getText() != null) {
                String s = item.getText().toString();
                if (!s.isEmpty()) return s;
            }
        } catch (Exception e) {
            Log.w(TAG, "ClipData text read failed", e);
        }
        return null;
    }

    private static String firstNonEmpty(String... values) {
        if (values == null) return null;
        for (String v : values) {
            if (v != null && !v.trim().isEmpty()) return v;
        }
        return null;
    }

    private static Map<String, Object> readStreamAsAsset(Context context, Uri uri, String intentMime) {
        if (context == null || uri == null) return null;
        try {
            String mime = intentMime;
            if (mime == null || mime.isEmpty() || mime.startsWith("*")) {
                try {
                    mime = context.getContentResolver().getType(uri);
                } catch (Exception e) {
                    Log.w(TAG, "getType failed for " + uri, e);
                }
            }
            if (mime == null || mime.isEmpty()) mime = "application/octet-stream";

            String displayName = queryDisplayName(context, uri);
            byte[] rawBytes = readUriBytes(context, uri);
            if (rawBytes == null || rawBytes.length == 0) {
                Log.e(TAG, "no bytes from uri=" + uri + " mime=" + mime);
                return null;
            }

            // WHY: keep wire payload under OkHttp's 16MiB WS queue cap; ~1–2MB JPEG is safe.
            EncodedImage encoded = maybeDownscaleImage(rawBytes, mime);
            byte[] bytes = encoded.bytes;
            String finalMime = encoded.mime;
            if (!finalMime.equals(mime)) {
                Log.i(TAG, "downscaled image raw=" + rawBytes.length
                        + " enc=" + bytes.length + " mime=" + finalMime);
            }

            String hash = sha256Hex(bytes);
            String ext = extFromNameOrMime(displayName, finalMime);
            String name = "share-" + hash + "." + ext;
            String b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);

            Map<String, Object> asset = new LinkedHashMap<>();
            asset.put("hash", hash);
            asset.put("name", name);
            asset.put("mimeType", finalMime);
            asset.put("type", finalMime);
            asset.put("size", bytes.length);
            asset.put("source", "base64");
            asset.put("data", b64);
            return asset;
        } catch (SecurityException se) {
            Log.e(TAG, "readStreamAsAsset SecurityException (URI grant?) uri=" + uri, se);
            return null;
        } catch (Exception e) {
            Log.e(TAG, "readStreamAsAsset failed uri=" + uri, e);
            return null;
        }
    }

    /** Result of {@link #maybeDownscaleImage(byte[], String)} — bytes + effective mime. */
    private static final class EncodedImage {
        final byte[] bytes;
        final String mime;
        EncodedImage(byte[] bytes, String mime) {
            this.bytes = bytes;
            this.mime = mime;
        }
    }

    /**
     * Downscale/recompress phone photos so the base64 wire payload stays under
     * OkHttp's 16MiB WebSocket queue cap. Images already under the threshold are
     * returned unchanged (original bytes + mime preserved).
     */
    private static EncodedImage maybeDownscaleImage(byte[] bytes, String mime) {
        if (bytes == null || bytes.length <= DOWNSCALE_THRESHOLD) {
            return new EncodedImage(bytes, mime);
        }
        if (mime == null || !mime.toLowerCase(Locale.US).startsWith("image/")) {
            return new EncodedImage(bytes, mime);
        }
        try {
            BitmapFactory.Options bounds = new BitmapFactory.Options();
            bounds.inJustDecodeBounds = true;
            BitmapFactory.decodeByteArray(bytes, 0, bytes.length, bounds);
            int sample = 1;
            while (bounds.outWidth / sample > DOWNSCALE_MAX_DIM
                    || bounds.outHeight / sample > DOWNSCALE_MAX_DIM) {
                sample *= 2;
            }
            BitmapFactory.Options decode = new BitmapFactory.Options();
            decode.inSampleSize = sample;
            Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length, decode);
            if (bmp == null) return new EncodedImage(bytes, mime);
            try {
                int[] qualities = new int[]{85, 70, 50};
                for (int q : qualities) {
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    if (bmp.compress(Bitmap.CompressFormat.JPEG, q, out)) {
                        byte[] enc = out.toByteArray();
                        if (enc.length <= DOWNSCALE_TARGET) {
                            return new EncodedImage(enc, "image/jpeg");
                        }
                    }
                }
                // Still over target — halve dimensions and retry once at lower quality.
                int w = Math.max(1, bmp.getWidth() / 2);
                int h = Math.max(1, bmp.getHeight() / 2);
                Bitmap scaled = Bitmap.createScaledBitmap(bmp, w, h, true);
                try {
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    if (scaled.compress(Bitmap.CompressFormat.JPEG, 55, out)) {
                        return new EncodedImage(out.toByteArray(), "image/jpeg");
                    }
                } finally {
                    if (scaled != bmp) scaled.recycle();
                }
                return new EncodedImage(bytes, mime);
            } finally {
                bmp.recycle();
            }
        } catch (Exception e) {
            Log.w(TAG, "downscale failed — using original bytes", e);
            return new EncodedImage(bytes, mime);
        }
    }

    private static byte[] readUriBytes(Context context, Uri uri) throws Exception {
        // Prefer openInputStream; fall back to AssetFileDescriptor (some gallery providers).
        try {
            InputStream in = context.getContentResolver().openInputStream(uri);
            if (in != null) {
                try (InputStream stream = in) {
                    return readBounded(stream, MAX_ASSET_BYTES);
                }
            }
        } catch (SecurityException se) {
            throw se;
        } catch (Exception e) {
            Log.w(TAG, "openInputStream failed, trying AFD: " + e.getMessage());
        }
        try (android.content.res.AssetFileDescriptor afd =
                     context.getContentResolver().openAssetFileDescriptor(uri, "r")) {
            if (afd == null) return null;
            try (InputStream in = afd.createInputStream()) {
                return readBounded(in, MAX_ASSET_BYTES);
            }
        }
    }

    private static String queryDisplayName(Context context, Uri uri) {
        try (Cursor c = context.getContentResolver().query(uri, null, null, null, null)) {
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) {
                    String name = c.getString(idx);
                    if (name != null && !name.isEmpty()) return name;
                }
            }
        } catch (Exception ignored) {
            /* optional */
        }
        String last = uri.getLastPathSegment();
        return last != null ? last : "";
    }

    private static byte[] readBounded(InputStream in, int max) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int total = 0;
        int n;
        while ((n = in.read(buf)) >= 0) {
            total += n;
            if (total > max) {
                Log.w(TAG, "share asset exceeds " + max + " bytes — truncated reject");
                return null;
            }
            out.write(buf, 0, n);
        }
        return out.toByteArray();
    }

    private static String sha256Hex(byte[] bytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(bytes);
            StringBuilder sb = new StringBuilder(dig.length * 2);
            for (byte b : dig) sb.append(String.format(Locale.US, "%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return "share-" + System.currentTimeMillis();
        }
    }

    private static String extFromNameOrMime(String name, String mime) {
        if (name != null) {
            int dot = name.lastIndexOf('.');
            if (dot >= 0 && dot < name.length() - 1) {
                String ext = name.substring(dot + 1).toLowerCase(Locale.US);
                if (ext.matches("[a-z0-9]{1,8}")) return ext;
            }
        }
        String m = mime != null ? mime.toLowerCase(Locale.US) : "";
        if (m.contains("png")) return "png";
        if (m.contains("jpeg") || m.contains("jpg")) return "jpg";
        if (m.contains("webp")) return "webp";
        if (m.contains("gif")) return "gif";
        if (m.startsWith("image/")) return "img";
        return "bin";
    }

    /**
     * Files-hub ingress branch predicate.
     * WHY: File-manager Share of selected files must stage into Temp (files-hub),
     * not the clipboard path. SEND_MULTIPLE always stages. SEND with streams
     * stages for docs/zips/octet-stream/wildcard MIME; single image and text
     * body keep the legacy clipboard SEND path.
     */
    private static boolean isFilesIngressIntent(String action, String type, Intent intent) {
        if (action == null) return false;
        boolean isView = Intent.ACTION_VIEW.equals(action);
        boolean isSend = Intent.ACTION_SEND.equals(action);
        boolean isSendMultiple = Intent.ACTION_SEND_MULTIPLE.equals(action);
        if (!isView && !isSend && !isSendMultiple) return false;
        if (isView) return true;
        // WHY: multi-select from Files/Documents always means file transfer.
        if (isSendMultiple) return true;

        List<Uri> uris = FilesIngress.collectStreamUris(intent);
        // WHY: any stream (incl. single image/*) → files-hub Temp stage.
        // Legacy clipboard path loaded full photo + Bitmap on the main thread
        // and OOM-killed Cap when sharing from Files/Gallery ("unknown error").
        // Pure EXTRA_TEXT (no streams) still uses clipboard below.
        return uris != null && !uris.isEmpty();
    }

    /**
     * Stage all stream URIs from the intent into app-private Temp, persist the
     * ingress envelope to {@code files/pending-ingress/<transferId>.json}, post a
     * heads-up "Open for Share" notification (so the user can re-enter the app
     * even when ShareActivity has no WebView), and best-effort emit
     * {@code cwspFilesIngress} to a live WebView. Returns a files-staged
     * ShareResult so ShareActivity shows "N file(s) ready to Open for Share"
     * instead of the old "Nothing to share" failure status.
     *
     * WHY (Bug A): the previous implementation returned an empty ShareResult
     * and emitted cwspFilesIngress with no defaultDestinations, so even if the
     * WebView heard it, decideOfferAfterStage yielded needDestinations with no
     * UI. Seeding destinations + persisting pending + posting a heads-up notif
     * makes Open-with usable even when the WebView is not yet alive.
     */
    private ShareResult stageFilesIngress(Context context, Intent intent, String source) {
        if (context == null) {
            Log.w(TAG, "files ingress without context — skipping");
            return new ShareResult("", null);
        }
        List<Uri> uris = FilesIngress.collectStreamUris(intent);
        Log.i(TAG, "files ingress source=" + source + " uris=" + uris.size()
                + " action=" + intent.getAction() + " type=" + intent.getType());
        if (uris.isEmpty()) {
            Log.w(TAG, "files ingress empty — no resolvable stream URIs");
            return new ShareResult("", null);
        }
        FilesIngress.StageResult r = FilesIngress.stage(context, uris, source);
        int count = r.files != null ? r.files.size() : 0;
        Log.i(TAG, "files ingress ok=" + r.ok + " reason=" + r.reason
                + " transferId=" + r.transferId + " count=" + count
                + " stageDir=" + r.stageDir);

        // WHY (Bug A): seed defaultDestinations from Configure so the hub can
        // auto-offer or pre-fill the picker. Filter out the local client id —
        // self-routing is suppressed by the coordinator anyway and the picker
        // should not offer the user their own device.
        List<String> destinations = resolveIngressDestinations(context);

        JSONObject json = FilesIngress.toIngressJson(r, destinations);

        // WHY (2026-07-21 UX): native Share / Open-with must NOT post an
        // "Open for Share" notification or open MainActivity. Auto-offer over
        // /ws so peers get Accept immediately; download stays on Accept.
        //
        // WHY (Cap↔Cap Accept missing): when CwsBridgePlugin.isPluginReady()
        // we used to only emitFilesIngress and mark offered=true. ShareActivity
        // has no WebView; if MainActivity is paused the hub never sends
        // files:offer → peer never gets FilesIncomingNotifier. Always offer
        // from Java first; only fall back to WebView drain when native send fails.
        boolean offered = false;
        if (r.ok && r.transferId != null) {
            Log.i(TAG, "files auto-offer start transferId=" + r.transferId
                    + " dest=" + destinations
                    + " pluginReady=" + CwsBridgePlugin.isPluginReady());
            offered = FilesOutboundOffer.offer(context, r, destinations);
            if (offered) {
                try {
                    FilesOutgoingNotifier.deletePendingIngress(context, r.transferId);
                } catch (Exception ignored) { /* */ }
                Log.i(TAG, "files auto-offer ok transferId=" + r.transferId);
            } else {
                // WHY: WS down / pack failed — persist for hub drain without
                // opening the app. If WebView is live, also emit so hub can retry.
                try {
                    FilesOutgoingNotifier.persistPendingIngress(context, r.transferId, json);
                } catch (Exception pe) {
                    Log.w(TAG, "persist pending ingress failed", pe);
                }
                if (CwsBridgePlugin.isPluginReady()) {
                    CwsBridgePlugin.emitFilesIngress(json);
                    Log.w(TAG, "files auto-offer failed — handed to WebView hub transferId="
                            + r.transferId);
                } else {
                    Log.w(TAG, "files auto-offer failed — pending for later drain transferId="
                            + r.transferId);
                }
            }
        }

        return ShareResult.filesStaged(count, r.transferId, offered);
    }

    /**
     * Resolve default destinations for an ingress envelope from
     * {@link core.Configure#readClipboardDestinations}, filtering out the local
     * client id. WHY (Bug A): without seeded destinations the Capacitor hub
     * almost always lands on {@code needDestinations} with no UI for Open-with.
     * Returns an empty list (not null) when nothing is configured — the hub
     * will then surface its destination picker.
     */
    private static List<String> resolveIngressDestinations(Context context) {
        List<String> dests = new ArrayList<>();
        if (context == null) return dests;
        try {
            String localId = core.Configure.readClientId(context);
            List<String> raw = core.Configure.readClipboardDestinations(context);
            if (raw == null) return dests;
            // WHY (Cap↔Cap): Configure may return bare `*` when prefs are empty.
            // Cap files-hub strips wildcards unless allowShareToAll — expand to
            // concrete desk+fleet peers here so Open-with reaches other phones.
            boolean onlyStar = raw.size() == 1 && "*".equals(String.valueOf(raw.get(0)).trim());
            if (onlyStar || raw.isEmpty()) {
                raw = new ArrayList<>();
                raw.add(core.Configure.DESK_PEER_ID);
                for (String phone : core.Configure.FLEET_PHONE_PEERS) {
                    raw.add(phone);
                }
            }
            for (String d : raw) {
                if (d == null) continue;
                String t = d.trim();
                if (t.isEmpty() || "*".equals(t)) continue;
                // WHY: never offer self as a share destination.
                if (localId != null && t.equals(localId)) continue;
                dests.add(t);
            }
        } catch (Exception e) {
            Log.w(TAG, "resolveIngressDestinations failed", e);
        }
        return dests;
    }
}
