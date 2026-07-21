/*
 * Filename: FilesBatchMaterializer.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesBatchMaterializer.java
 * Change date and time: 16.10.00_21.07.2026
 * Reason for changes: Task 6 — framework-free pack helper that turns a
 *   batch plan (kind + staged-file names) into wire bytes: zip for
 *   multi-file small batches, gzip for "compressed" (downgraded to raw
 *   when savings < COMPRESS_WORTHWHILE), and raw bytes for "raw". Also
 *   exposes a documented putBlob stub so the Capacitor files-hub can
 *   request batch bytes via the CwsBridge `files:read-batch` channel and
 *   know that HTTP PUT (`files:put-blob`) is not wired in Wave 3.
 *
 * WHY framework-free: scripts/check-java-android-pure.sh compiles + runs
 * this with JDK only (java.io / java.util.zip / java.security), so the
 * zip + raw + compress-downgrade contract is unit-testable without the
 * Android SDK, mirroring the W1 planFilesBatches policy.
 *
 * INVARIANT: no android.* imports. Reads staged files by absolute path
 * under the per-transfer stage dir; never escapes via name (callers pass
 * already-sanitized basenames from FilesStageNames).
 */
package emission;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.List;
import java.util.zip.GZIPOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Materialize one batch plan (kind + staged-file names) into wire bytes.
 * Mirrors the Neutralino files-hub materializeOne() contract.
 */
public final class FilesBatchMaterializer {
    /** Mirrors cwsp-shared COMPRESS_WORTHWHILE (0.1). */
    public static final double COMPRESS_WORTHWHILE = 0.1;

    /** Result of materializing one batch. */
    public static final class MaterializedBatch {
        /** Wire bytes (zip / gzip / raw). */
        public final byte[] bytes;
        /** Effective kind after compress downgrade ("zip" | "raw" | "compressed"). */
        public final String kind;
        /** File extension for the asset name ({@code <batchId>.<ext>}). */
        public final String ext;
        /** MIME type placed on the DataAsset envelope. */
        public final String mimeType;
        /** SHA-256 hex of {@link #bytes}. */
        public final String hash;

        public MaterializedBatch(byte[] bytes, String kind, String ext, String mimeType, String hash) {
            this.bytes = bytes;
            this.kind = kind;
            this.ext = ext;
            this.mimeType = mimeType;
            this.hash = hash;
        }
    }

    private FilesBatchMaterializer() {}

    /**
     * Materialize one batch. {@code names} are basenames relative to
     * {@code stageDir}; each must exist. Throws on a missing staged file
     * so the caller (CwsBridge) surfaces a clean error to the WebView hub.
     */
    public static MaterializedBatch materializeBatch(File stageDir, String kind, List<String> names)
            throws IOException {
        if (stageDir == null || kind == null || names == null || names.isEmpty()) {
            throw new IOException("CWSP_FILES_BATCH_INVALID_ARGS");
        }
        byte[] bytes;
        String effKind = kind;
        String ext;
        String mimeType;
        if ("zip".equals(kind)) {
            bytes = zipFiles(stageDir, names);
            ext = "zip";
            mimeType = "application/zip";
        } else if ("compressed".equals(kind)) {
            // Single member per W1 packer for large batches.
            byte[] raw = readFile(new File(stageDir, names.get(0)));
            byte[] gz = gzip(raw);
            double saved = raw.length > 0 ? (raw.length - gz.length) / (double) raw.length : 0.0;
            if (saved >= COMPRESS_WORTHWHILE) {
                bytes = gz;
                ext = "gz";
                mimeType = "application/gzip";
            } else {
                // WHY: downgrade to raw when compression is not worthwhile.
                bytes = raw;
                effKind = "raw";
                ext = extOf(names.get(0), "bin");
                mimeType = "application/octet-stream";
            }
        } else if ("raw".equals(kind)) {
            bytes = readFile(new File(stageDir, names.get(0)));
            ext = extOf(names.get(0), "bin");
            mimeType = "application/octet-stream";
        } else {
            throw new IOException("CWSP_FILES_BATCH_UNKNOWN_KIND:" + kind);
        }
        return new MaterializedBatch(bytes, effKind, ext, mimeType, sha256Hex(bytes));
    }

    /**
     * Documented putBlob stub. WHY: HTTP PUT to a desk-reachable
     * {@code /files/blob/<transferId>/<batchId>} endpoint is not wired in
     * Wave 3; the Capacitor hub embeds small batches as base64 and emits
     * {@code files:error} for large ones until a blob server lands. This
     * method returns a fixed failure so callers can branch without a null
     * adapter.
     */
    public static PutBlobResult putBlobStub(String transferId, String batchId) {
        return new PutBlobResult(false, "CWSP_FILES_PUT_BLOB_UNAVAILABLE", null, null);
    }

    /** Result of a putBlob attempt. */
    public static final class PutBlobResult {
        public final boolean ok;
        public final String error;
        public final String url;
        public final String token;
        public PutBlobResult(boolean ok, String error, String url, String token) {
            this.ok = ok;
            this.error = error;
            this.url = url;
            this.token = token;
        }
    }

    // ------------------------------------------------------------------
    // internals
    // ------------------------------------------------------------------

    private static byte[] zipFiles(File stageDir, List<String> names) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (String name : names) {
                File f = new File(stageDir, name);
                if (!f.isFile()) throw new IOException("CWSP_FILES_STAGE_MISS:" + name);
                zos.putNextEntry(new ZipEntry(name));
                try (FileInputStream in = new FileInputStream(f)) {
                    byte[] buf = new byte[8192];
                    int n;
                    while ((n = in.read(buf)) >= 0) zos.write(buf, 0, n);
                }
                zos.closeEntry();
            }
        }
        return baos.toByteArray();
    }

    private static byte[] gzip(byte[] raw) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPOutputStream gz = new GZIPOutputStream(baos)) {
            gz.write(raw);
        }
        return baos.toByteArray();
    }

    private static byte[] readFile(File f) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (FileInputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) >= 0) baos.write(buf, 0, n);
        }
        return baos.toByteArray();
    }

    private static String extOf(String name, String fallback) {
        if (name == null) return fallback;
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) return fallback;
        return name.substring(dot + 1).toLowerCase(java.util.Locale.US);
    }

    private static String sha256Hex(byte[] bytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(bytes);
            StringBuilder sb = new StringBuilder(d.length * 2);
            for (byte b : d) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }
}
