/*
 * Filename: FilesBatchMaterializerTest.java
 * FullPath: apps/CWSP-reborn/test/java/android/emission/FilesBatchMaterializerTest.java
 * Change date and time: 16.20.00_21.07.2026
 * Reason for changes: Task 6 — host-free pure test for the framework-free
 *   FilesBatchMaterializer (zip + raw + compress-downgrade) and the
 *   FilesIngressJson envelope shape (transferId + source + files[]). No
 *   Android SDK / Robolectric; mirrors the W1 planFilesBatches contract
 *   and the cwspFilesIngress payload the Capacitor files-hub listens for.
 *
 * Run via: scripts/check-java-android-pure.sh
 */
package emission;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipInputStream;

public class FilesBatchMaterializerTest {

    private static int failures = 0;

    public static void main(String[] args) throws Exception {
        checkZipBatch();
        checkRawBatch();
        checkCompressDowngradeToRaw();
        checkIngressJsonShape();
        checkPutBlobStub();

        if (failures > 0) {
            System.err.println("FilesBatchMaterializerTest FAILED: " + failures + " assertion(s)");
            System.exit(1);
        }
        System.out.println("FilesBatchMaterializerTest OK: all assertions passed");
    }

    static void checkZipBatch() throws Exception {
        File dir = Files.createTempDirectory("cwsp-zip-").toFile();
        writeFile(new File(dir, "a.txt"), "hello");
        writeFile(new File(dir, "b.txt"), "world");
        List<String> names = Arrays.asList("a.txt", "b.txt");
        FilesBatchMaterializer.MaterializedBatch mb =
                FilesBatchMaterializer.materializeBatch(dir, "zip", names);
        assertEqual("kind", "zip", mb.kind, "zip-kind");
        assertEqual("ext", "zip", mb.ext, "zip-ext");
        assertEqual("mimeType", "application/zip", mb.mimeType, "zip-mime");
        // WHY: zip must contain both entries; round-trip proves the bytes are a real zip.
        java.util.Set<String> entries = new java.util.HashSet<>();
        try (ZipInputStream zis = new ZipInputStream(new java.io.ByteArrayInputStream(mb.bytes))) {
            java.util.zip.ZipEntry e;
            while ((e = zis.getNextEntry()) != null) entries.add(e.getName());
        }
        if (!entries.contains("a.txt") || !entries.contains("b.txt")) {
            fail("zip-entries: missing members, got " + entries);
        }
        if (mb.hash == null || mb.hash.length() != 64) fail("zip-hash: bad sha256 " + mb.hash);
        deleteRecursively(dir);
    }

    static void checkRawBatch() throws Exception {
        File dir = Files.createTempDirectory("cwsp-raw-").toFile();
        byte[] payload = "raw-bytes".getBytes("UTF-8");
        writeFile(new File(dir, "data.bin"), payload);
        FilesBatchMaterializer.MaterializedBatch mb =
                FilesBatchMaterializer.materializeBatch(dir, "raw", Arrays.asList("data.bin"));
        assertEqual("kind", "raw", mb.kind, "raw-kind");
        assertEqual("ext", "bin", mb.ext, "raw-ext");
        assertEqual("mimeType", "application/octet-stream", mb.mimeType, "raw-mime");
        if (!Arrays.equals(payload, mb.bytes)) fail("raw-bytes: mismatch");
        deleteRecursively(dir);
    }

    /**
     * WHY: "compressed" on already-incompressible bytes must downgrade to "raw"
     * (savings < COMPRESS_WORTHWHILE), matching the W1 packer contract.
     */
    static void checkCompressDowngradeToRaw() throws Exception {
        File dir = Files.createTempDirectory("cwsp-gz-").toFile();
        // High-entropy payload: gzip cannot shrink it below COMPRESS_WORTHWHILE.
        byte[] payload = new byte[64 * 1024];
        new java.util.Random(0xC5C5).nextBytes(payload);
        writeFile(new File(dir, "entropy.bin"), payload);
        FilesBatchMaterializer.MaterializedBatch mb =
                FilesBatchMaterializer.materializeBatch(dir, "compressed", Arrays.asList("entropy.bin"));
        assertEqual("kind", "raw", mb.kind, "compress-downgrade-kind");
        assertEqual("ext", "bin", mb.ext, "compress-downgrade-ext");
        if (!Arrays.equals(payload, mb.bytes)) fail("compress-downgrade-bytes: mismatch");
        deleteRecursively(dir);
    }

    /**
     * WHY: the Capacitor files-hub listener (Task 6) reads `source` + `transferId`
     * + `files[]` off the cwspFilesIngress event; the envelope shape must carry them.
     * Asserts on the framework-free Map (FilesIngress.toIngressJson wraps it into a
     * JSONObject on the Android side).
     */
    @SuppressWarnings("unchecked")
    static void checkIngressJsonShape() {
        List<FilesIngressJson.StagedFileInput> files = Arrays.asList(
                new FilesIngressJson.StagedFileInput("a.txt", 5L, "/tmp/a.txt"));
        java.util.Map<String, Object> o = FilesIngressJson.build(
                "T-1", "share-target", "/stage/T-1", true, null, files);
        assertEqual("transferId", "T-1", String.valueOf(o.get("transferId")), "json-transferId");
        assertEqual("source", "share-target", String.valueOf(o.get("source")), "json-source");
        assertEqual("ok", "true", String.valueOf(o.get("ok")), "json-ok");
        Object arr = o.get("files");
        if (!(arr instanceof List) || ((List<Object>) arr).size() != 1) {
            fail("json-files: expected 1 entry, got " + arr);
        } else {
            java.util.Map<String, Object> fo = (java.util.Map<String, Object>) ((List<Object>) arr).get(0);
            assertEqual("file.name", "a.txt", String.valueOf(fo.get("name")), "json-file-name");
            assertEqual("file.size", "5", String.valueOf(fo.get("size")), "json-file-size");
        }
    }

    static void checkPutBlobStub() {
        FilesBatchMaterializer.PutBlobResult r =
                FilesBatchMaterializer.putBlobStub("T-1", "T-1-0");
        if (r.ok) fail("putblob-stub: expected ok=false");
        assertEqual("error", "CWSP_FILES_PUT_BLOB_UNAVAILABLE", r.error, "putblob-stub-error");
    }

    // ------------------------------------------------------------------
    // helpers
    // ------------------------------------------------------------------

    static void writeFile(File f, byte[] bytes) throws Exception {
        try (FileOutputStream fos = new FileOutputStream(f)) {
            fos.write(bytes);
        }
    }

    static void writeFile(File f, String s) throws Exception {
        writeFile(f, s.getBytes("UTF-8"));
    }

    static void deleteRecursively(File f) {
        if (f == null) return;
        if (f.isDirectory()) {
            File[] kids = f.listFiles();
            if (kids != null) for (File k : kids) deleteRecursively(k);
        }
        f.delete();
    }

    static void assertEqual(String field, Object expected, Object actual, String label) {
        if (expected == null || actual == null) {
            if (expected != actual) fail(label + ": " + field + " expected=" + expected + " actual=" + actual);
            return;
        }
        if (!expected.equals(actual)) {
            fail(label + ": " + field + " expected=" + expected + " actual=" + actual);
        }
    }

    static void fail(String msg) {
        failures++;
        System.err.println("ASSERT FAIL: " + msg);
    }
}
