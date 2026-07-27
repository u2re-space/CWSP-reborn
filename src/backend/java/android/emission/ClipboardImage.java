/*
 * Filename: ClipboardImage.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/emission/ClipboardImage.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: image-asset clipboard emission stub (DataAssetEnvelope parity).
 */

package emission;

/**
 * ClipboardImage scaffold: emits an image DataAssetEnvelope (hash/name/mime)
 * to the endpoint. Pending Pass-III: base64/data-url normalization.
 */
public class ClipboardImage {

    private String hash;
    private String mimeType;

    public void set(String hash, String mimeType) {
        this.hash = hash;
        this.mimeType = mimeType;
    }

    public String getHash() { return hash; }
    public String getMimeType() { return mimeType; }
}
