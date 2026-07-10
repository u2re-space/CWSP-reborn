/*
 * Filename: ClipboardImage.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/executor/ClipboardImage.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: image-asset clipboard executor stub (apply remote image -> local).
 */

package executor;

/**
 * ClipboardImage executor scaffold: applies a remote image DataAssetEnvelope
 * via navigator.clipboard/ClipboardItem parity. Placeholder until Pass-III.
 */
public class ClipboardImage {

    private String lastHash = null;

    public boolean applyRemote(String hash, String mimeType) {
        if (hash == null || hash.isEmpty()) {
            return false;
        }
        this.lastHash = hash;
        return true;
    }

    public String lastHash() {
        return lastHash;
    }
}
