/*
 * Filename: ClipboardFile.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/executor/ClipboardFile.java
 * Change date and time: 17.50.00_10.07.2026
 * Reason for changes: File DataAsset apply hook used by executor.Clipboard for
 *   non-image clipboard assets (persist path placeholder).
 */

package executor;

/**
 * ClipboardFile executor: accepts remote file DataAsset metadata.
 * Full app-private persistence / content URI remains deferred.
 */
public class ClipboardFile {

    private String savedPath = null;
    private String lastHash = null;

    public boolean applyRemote(String hash, String name, long size) {
        if (name == null || name.isEmpty()) {
            return false;
        }
        this.lastHash = hash;
        this.savedPath = "cwsp/" + name;
        return true;
    }

    public String savedPath() {
        return savedPath;
    }

    public String lastHash() {
        return lastHash;
    }
}
