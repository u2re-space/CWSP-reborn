/*
 * Filename: ShareTarget.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/ShareTarget.java
 * Change date and time: 20.55.00_10.07.2026
 * Reason for changes: Robust PROCESS_TEXT / SEND text extraction (ClipData + all extras).
 */

package emission;

import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
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
import java.util.Locale;
import java.util.Map;

import space.u2re.cwsp.CwsBridgePlugin;

/**
 * Android share-target / process-text emission into CWSP clipboard contract.
 */
public class ShareTarget {
    private static final String TAG = "ShareTarget";
    /** Phone JPEGs are often 4–12MB; keep headroom under typical WS limits. */
    private static final int MAX_ASSET_BYTES = 12 * 1024 * 1024;

    private String lastSharedText = null;

    public static final class ShareResult {
        public final String text;
        public final Map<String, Object> asset;

        public ShareResult(String text, Map<String, Object> asset) {
            this.text = text;
            this.asset = asset;
        }

        public boolean hasText() {
            return text != null && !text.isEmpty();
        }

        public boolean hasAsset() {
            return asset != null && !asset.isEmpty();
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
            byte[] bytes = readUriBytes(context, uri);
            if (bytes == null || bytes.length == 0) {
                Log.e(TAG, "no bytes from uri=" + uri + " mime=" + mime);
                return null;
            }

            String hash = sha256Hex(bytes);
            String ext = extFromNameOrMime(displayName, mime);
            String name = "share-" + hash + "." + ext;
            String b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);

            Map<String, Object> asset = new LinkedHashMap<>();
            asset.put("hash", hash);
            asset.put("name", name);
            asset.put("mimeType", mime);
            asset.put("type", mime);
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
}
