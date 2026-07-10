/*
 * Filename: DataType.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/DataType.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: DataAsset source discriminator constants (mirrors the
 *                     {@code source} field values of DataAssetEnvelope).
 */
package space.u2re.cwsp.protocol.packet;

/** DataAsset {@code source} values used by the unified DataAsset pipeline. */
public final class DataType {

    public static final String DATA_URL = "data-url";
    public static final String BASE64 = "base64";
    public static final String URL = "url";
    public static final String FILE = "file";
    public static final String BLOB = "blob";
    public static final String TEXT = "text";

    private DataType() {
    }
}
