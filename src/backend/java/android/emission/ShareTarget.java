/*
 * Filename: ShareTarget.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/ShareTarget.java
 * Change date and time: 18.35.00_10.07.2026
 * Reason for changes: Handle ACTION_SEND / PROCESS_TEXT → clipboard + WebView event.
 */

package emission;

import android.content.Intent;
import android.util.Log;

import space.u2re.cwsp.CwsBridgePlugin;

/**
 * Android share-target / process-text emission into CWSP clipboard contract.
 */
public class ShareTarget {
    private static final String TAG = "ShareTarget";

    private String lastSharedText = null;

    public void onShare(String text) {
        this.lastSharedText = text;
    }

    public String lastShared() {
        return lastSharedText;
    }

    /**
     * Extract shared text from an Intent and fan it into clipboard + WebView.
     *
     * @return extracted text (may be empty)
     */
    public String handleIntent(Intent intent, Clipboard clipboard) {
        if (intent == null) return "";
        String action = intent.getAction();
        String text = null;
        if (Intent.ACTION_SEND.equals(action)) {
            CharSequence seq = intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
            if (seq != null) text = seq.toString();
        } else if (Intent.ACTION_PROCESS_TEXT.equals(action)) {
            CharSequence seq = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
            if (seq != null) text = seq.toString();
        }
        if (text == null) return "";
        text = text.trim();
        if (text.isEmpty()) return "";

        onShare(text);
        if (clipboard != null) {
            try {
                clipboard.write(text);
            } catch (Exception e) {
                Log.w(TAG, "clipboard write from share failed", e);
            }
        }
        CwsBridgePlugin.emitShareIntent(text, action != null ? action : Intent.ACTION_SEND);
        return text;
    }
}
