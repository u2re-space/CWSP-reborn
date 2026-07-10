/*
 * Filename: Clipboard.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/Clipboard.java
 * Change date and time: 18.45.00_10.07.2026
 * Reason for changes: Implement writeAsset — persist DataAssetEnvelope to app-private storage.
 *
 * INVARIANT: do not push binary to ClipboardManager; WebView owns ClipboardItem via
 * CwsBridgePlugin.emitNativeMessage / cws:clipboardAsset.
 */

package emission;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Android clipboard bridge for the CWSP contour.
 *
 * <p>Text-first via {@link ClipboardManager}; binary assets persist under
 * {@code files/cwsp/clipboard-assets/&lt;hash&gt;.&lt;ext&gt;}.</p>
 */
public class Clipboard {
    private static final String TAG = "emission.Clipboard";
    public static final String ASSET_DIR = "cwsp/clipboard-assets";

    private String lastText = null;
    private long lastTs = 0L;
    private String lastAssetHash = null;
    /** Absolute path of last persisted asset file (diagnostics / WebView handoff). */
    private String lastAssetPath = null;

    private final Context appContext;
    private final ClipboardManager clipboardManager;

    public Clipboard(Context context) {
        this.appContext = context != null ? context.getApplicationContext() : null;
        this.clipboardManager = (appContext == null) ? null
                : (ClipboardManager) appContext.getSystemService(Context.CLIPBOARD_SERVICE);
    }

    public void write(String text) {
        if (TextUtils.isEmpty(text)) {
            clear();
            return;
        }
        this.lastText = text;
        this.lastTs = System.currentTimeMillis();
        if (clipboardManager != null) {
            ClipData clip = ClipData.newPlainText("cwsp", text);
            clipboardManager.setPrimaryClip(clip);
        }
    }

    public String read() {
        if (clipboardManager != null) {
            ClipData clip = clipboardManager.getPrimaryClip();
            if (clip != null && clip.getItemCount() > 0) {
                CharSequence text = clip.getItemAt(0).coerceToText(null);
                if (text != null) {
                    return text.toString();
                }
            }
        }
        return lastText;
    }

    public void clear() {
        this.lastText = null;
        this.lastTs = 0L;
        this.lastAssetHash = null;
        this.lastAssetPath = null;
        if (clipboardManager != null) {
            try {
                ClipData clip = ClipData.newPlainText("cwsp", "");
                clipboardManager.setPrimaryClip(clip);
            } catch (Throwable ignored) {
                /* COMPAT: some OEMs throw on empty clip */
            }
        }
    }

    public long lastWriteTimestamp() {
        return lastTs;
    }

    public String lastShadowText() {
        return lastText;
    }

    public String lastAssetHash() {
        return lastAssetHash;
    }

    public String lastAssetPath() {
        return lastAssetPath;
    }

    /**
     * Persist a DataAssetEnvelope and update hash/path metadata.
     *
     * @return true when bytes were persisted or a URL/URI source was accepted for WebView handoff
     */
    public boolean writeAsset(Map<String, Object> asset) {
        if (asset == null) {
            return false;
        }
        Object hashObj = asset.get("hash");
        String hash = hashObj instanceof String ? (String) hashObj : null;
        if (hash == null || hash.isEmpty()) {
            // WHY: hash-addressable names are required by features-data-asset.mdc.
            hash = "asset-" + System.currentTimeMillis();
        }
        this.lastAssetHash = hash;

        String source = stringOrEmpty(asset.get("source")).toLowerCase(Locale.US);
        String data = stringOrEmpty(asset.get("data"));
        String mime = stringOrEmpty(asset.get("mimeType"));
        if (mime.isEmpty()) mime = stringOrEmpty(asset.get("type"));
        String name = stringOrEmpty(asset.get("name"));

        // URL / file / blob: no native fetch — WebView owns the fetch; accept for handoff.
        if ("url".equals(source) || "file".equals(source) || "blob".equals(source)
                || looksLikeUrl(data)) {
            this.lastAssetPath = data;
            this.lastTs = System.currentTimeMillis();
            return !data.isEmpty();
        }

        byte[] bytes = decodeAssetBytes(source, data);
        if (bytes == null || bytes.length == 0) {
            Log.w(TAG, "writeAsset: no usable bytes");
            return false;
        }
        if (appContext == null) {
            // Host-free / shadow mode: accept metadata only.
            this.lastTs = System.currentTimeMillis();
            return true;
        }

        String ext = extFromNameOrMime(name, mime);
        File dir = new File(appContext.getFilesDir(), ASSET_DIR);
        if (!dir.exists() && !dir.mkdirs()) {
            Log.e(TAG, "writeAsset: mkdirs failed " + dir);
            return false;
        }
        File out = new File(dir, hash + "." + ext);
        if (!out.exists()) {
            try (FileOutputStream fos = new FileOutputStream(out)) {
                fos.write(bytes);
            } catch (Exception e) {
                Log.e(TAG, "writeAsset: persist failed", e);
                return false;
            }
        }
        this.lastAssetPath = out.getAbsolutePath();
        this.lastTs = System.currentTimeMillis();
        // Enrich caller's map for WebView handoff (caller may re-read these keys).
        asset.put("hash", hash);
        if (mime.isEmpty()) asset.put("mimeType", "application/octet-stream");
        else asset.put("mimeType", mime);
        asset.put("size", bytes.length);
        asset.put("uri", "file://" + out.getAbsolutePath());
        asset.put("path", out.getAbsolutePath());
        return true;
    }

    public Map<String, Object> buildUpdatePayload(String text) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("text", text);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:update");
        packet.put("purpose", "clipboard");
        packet.put("payload", payload);
        return packet;
    }

    private static byte[] decodeAssetBytes(String source, String data) {
        if (data == null || data.isEmpty()) return null;
        try {
            if ("data-url".equals(source) || data.startsWith("data:")) {
                int comma = data.indexOf(',');
                if (comma < 0) return null;
                String meta = data.substring(5, comma); // after "data:"
                String payload = data.substring(comma + 1);
                if (meta.toLowerCase(Locale.US).contains(";base64")) {
                    return Base64.decode(payload, Base64.DEFAULT);
                }
                return java.net.URLDecoder.decode(payload, StandardCharsets.UTF_8.name())
                        .getBytes(StandardCharsets.UTF_8);
            }
            // bare base64 (default)
            return Base64.decode(data, Base64.DEFAULT);
        } catch (Exception e) {
            Log.w(TAG, "decodeAssetBytes failed", e);
            return null;
        }
    }

    private static String extFromNameOrMime(String name, String mime) {
        if (name != null) {
            int dot = name.lastIndexOf('.');
            if (dot >= 0 && dot < name.length() - 1) {
                String e = name.substring(dot + 1).replaceAll("[^A-Za-z0-9]", "");
                if (!e.isEmpty()) return e.toLowerCase(Locale.US);
            }
        }
        if (mime != null && mime.contains("/")) {
            String sub = mime.substring(mime.indexOf('/') + 1).replaceAll("[^A-Za-z0-9]", "");
            if (!sub.isEmpty() && !"octetstream".equals(sub)) return sub.toLowerCase(Locale.US);
        }
        return "bin";
    }

    private static boolean looksLikeUrl(String data) {
        if (data == null) return false;
        String d = data.toLowerCase(Locale.US);
        return d.startsWith("http://") || d.startsWith("https://") || d.startsWith("content://")
                || d.startsWith("file://");
    }

    private static String stringOrEmpty(Object v) {
        return v instanceof String ? (String) v : (v != null ? String.valueOf(v) : "");
    }
}
