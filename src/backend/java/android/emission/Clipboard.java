/*
 * Filename: Clipboard.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/emission/Clipboard.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — ClipboardManager-backed clipboard bridge with shadow + dedupe timestamp (parity with CWSP clipboard:update contract).
 *
 * WHY: package `emission` matches path relative to the
 * `src/backend/java/android` source root. Pending Pass-III: Capacitor
 * @CapacitorPlugin bridging the CWSP clipboard:update contract.
 *
 * INVARIANT: the local shadow + lastWriteTimestamp mirror the endpoint's
 * duplicate-suppression window so echo storms are avoided after applying remote text.
 *
 * TODO(Pass-III/assets): image/file clipboard payloads arrive as a DataAssetEnvelope
 * (see network.mdc + features-data-asset.mdc). Android cannot reliably push binary
 * to the system clipboard; instead hand the asset URL/base64 to the WebView via
 * Capacitor JS bridge and let it use navigator.clipboard ClipboardItem, or write
 * the file to app-private storage and place a content:// URI clip. Hooks documented
 * below in {@link #writeAsset}.
 */

package emission;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.text.TextUtils;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Android clipboard bridge for the CWSP contour.
 *
 * <p>Text-first: writes/reads via {@link ClipboardManager} when a Context is
 * available; keeps an in-memory shadow + last-write timestamp for host-free
 * tests and duplicate-suppression parity with the CWSP endpoint.</p>
 */
public class Clipboard {

    /** Shadow of the last applied text (used for dedupe + tests without a real clipboard). */
    private String lastText = null;
    /** Timestamp of the last write, for duplicate-suppression parity with the endpoint. */
    private long lastTs = 0L;
    /** Last asset hash seen, for binary dedupe (set by {@link #writeAsset}). */
    private String lastAssetHash = null;

    private final ClipboardManager clipboardManager;

    /**
     * Construct with a Context. When Context is null the bridge runs in
     * "shadow-only" mode (no OS clipboard writes), which is what host-free
     * tests use.
     */
    public Clipboard(Context context) {
        this.clipboardManager = (context == null) ? null
                : (ClipboardManager) context.getApplicationContext()
                    .getSystemService(Context.CLIPBOARD_SERVICE);
    }

    /**
     * Write text to the OS clipboard (when available) and update the shadow.
     * Empty/null text is treated as a clear.
     */
    public void write(String text) {
        if (TextUtils.isEmpty(text)) {
            clear();
            return;
        }
        this.lastText = text;
        this.lastTs = System.currentTimeMillis();
        if (clipboardManager != null) {
            // NOTE: ClipData.newPlainText label "cwsp" is a stable tag for diagnostics.
            ClipData clip = ClipData.newPlainText("cwsp", text);
            clipboardManager.setPrimaryClip(clip);
        }
    }

    /**
     * Read current clipboard text. Prefers the live OS clipboard when available,
     * falling back to the shadow (host-free / no clipboard manager).
     */
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

    /** Clear the clipboard shadow and the OS clipboard when available. */
    public void clear() {
        this.lastText = null;
        this.lastTs = 0L;
        this.lastAssetHash = null;
        if (clipboardManager != null) {
            // NOTE: setPrimaryClip(null) is not supported; use an empty clip.
            try {
                ClipData clip = ClipData.newPlainText("cwsp", "");
                clipboardManager.setPrimaryClip(clip);
            } catch (Throwable ignored) {
                // COMPAT: some OEMs throw on empty clip; ignore.
            }
        }
    }

    /** Timestamp of the last write, for duplicate-suppression parity with the endpoint. */
    public long lastWriteTimestamp() {
        return lastTs;
    }

    /** Shadow text of the last write (diagnostics + tests). */
    public String lastShadowText() {
        return lastText;
    }

    /**
     * Asset handoff hook (image/file). NOT implemented yet — see TODO in file header.
     *
     * <p>Contract per network.mdc: a {@code clipboard:update} packet may carry a
     * {@code payload.asset} DataAssetEnvelope ({@code hash}, {@code name},
     * {@code mimeType}, {@code size}, {@code source}, {@code data}). Android
     * should NOT push binary to the OS clipboard; instead this hook will, in
     * Pass-III, persist the asset to app-private storage and emit a content URI
     * (or forward the data-url to the WebView for {@code ClipboardItem}).</p>
     *
     * @param asset envelope map with at least {@code hash} and {@code data}
     * @return placeholder: always returns false until Pass-III.
     */
    public boolean writeAsset(Map<String, Object> asset) {
        if (asset == null) {
            return false;
        }
        Object hash = asset.get("hash");
        if (hash instanceof String) {
            this.lastAssetHash = (String) hash;
        }
        // TODO(Pass-III): persist asset bytes / data-url and hand off to WebView.
        return false;
    }

    /** Last asset hash seen (diagnostics + dedupe). */
    public String lastAssetHash() {
        return lastAssetHash;
    }

    /**
     * Build a CWSP-compatible clipboard:update payload map (text branch).
     * Mirrors the Node {@code buildNodeClipboardPacket} text shape.
     */
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
}
