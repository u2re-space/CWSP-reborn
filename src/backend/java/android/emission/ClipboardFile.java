/*
 * Filename: ClipboardFile.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/emission/ClipboardFile.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: file-asset clipboard emission stub (DataAssetEnvelope parity).
 */

package emission;

/**
 * ClipboardFile scaffold: emits a file DataAssetEnvelope (hash/name/size) to
 * the endpoint. Pending Pass-III: normalize via shared DataAsset rules.
 */
public class ClipboardFile {

    private String hash;
    private String name;
    private long size;

    public void set(String hash, String name, long size) {
        this.hash = hash;
        this.name = name;
        this.size = size;
    }

    public String getHash() { return hash; }
    public String getName() { return name; }
    public long getSize() { return size; }
}
