/*
 * Filename: ClipboardFile.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/executor/ClipboardFile.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: file-asset clipboard executor stub (apply remote file -> local).
 */

package executor;

/**
 * ClipboardFile executor scaffold: applies a remote file DataAssetEnvelope
 * onto local storage/clipboard. Placeholder until Pass-III wiring.
 */
public class ClipboardFile {

    private String savedPath = null;

    public boolean applyRemote(String hash, String name, long size) {
        if (name == null || name.isEmpty()) {
            return false;
        }
        this.savedPath = "cwsp/" + name;
        return true;
    }

    public String savedPath() {
        return savedPath;
    }
}
