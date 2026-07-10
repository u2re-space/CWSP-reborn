/*
 * Filename: ClipboardImage.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/executor/ClipboardImage.java
 * Change date and time: 17.50.00_10.07.2026
 * Reason for changes: Image DataAsset apply hook used by executor.Clipboard
 *   when clipboard packets carry payload.asset with image/* mime.
 *
 * NOTE: Full ClipboardItem / content:// handoff remains deferred; this records
 * the hash so protocol apply can succeed without blocking the text path.
 */

package executor;

/**
 * ClipboardImage executor: accepts remote image DataAsset metadata.
 * Binary OS clipboard write is deferred (WebView ClipboardItem / content URI).
 */
public class ClipboardImage {

    private String lastHash = null;
    private String lastMime = null;

    public boolean applyRemote(String hash, String mimeType) {
        if (hash == null || hash.isEmpty()) {
            return false;
        }
        this.lastHash = hash;
        this.lastMime = mimeType;
        return true;
    }

    public String lastHash() {
        return lastHash;
    }

    public String lastMime() {
        return lastMime;
    }
}
