/*
 * Filename: FilesIngressTest.java
 * FullPath: apps/CWSP-reborn/test/java/android/emission/FilesIngressTest.java
 * Change date and time: 15.47.00_21.07.2026
 * Reason for changes: Task 5 — host-free pure test for FilesStageLimits caps
 *   (no Android SDK / Robolectric). Mirrors assertStageLimits() in
 *   cwsp-shared/test/v2-files-hub-policy.test.ts so the Java hub refuses
 *   oversized staging at the same boundary as the TS shells.
 *
 * Run via: scripts/check-java-android-pure.sh
 *
 * Expected `am start` smoke (manual, recorded in task-5-report.md):
 *   adb shell am start -a android.intent.action.SEND -t application/octet-stream \
 *     --eu android.intent.extra.STREAM file:///sdcard/Download/test.bin \
 *     -n space.u2re.cwsp/.ShareActivity
 *   # Expect: Temp under files/outgoing/<transferId>; logcat FilesIngress stage ok;
 *   # cwspFilesIngress event to WebView; no clipboard.writeAsset call.
 */
package emission;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FilesIngressTest {

    private static int failures = 0;

    public static void main(String[] args) {
        checkUnderLimits();
        checkCountOverLimit();
        checkBytesOverLimit();
        checkEmptyOk();
        checkNegativeCoerced();
        checkLargeFileNoInt32Wrap();

        if (failures > 0) {
            System.err.println("FilesIngressTest FAILED: " + failures + " assertion(s)");
            System.exit(1);
        }
        System.out.println("FilesIngressTest OK: all assertions passed");
    }

    static void checkUnderLimits() {
        List<Long> sizes = Arrays.asList(1024L, 2048L, 4096L);
        FilesStageLimits.Result r = FilesStageLimits.check(sizes);
        assertOk(r, true, "under-limits");
        assertEqual("count", 3, r.count, "under-limits count");
        assertEqual("totalBytes", 7168L, r.totalBytes, "under-limits totalBytes");
    }

    static void checkCountOverLimit() {
        List<Long> sizes = new ArrayList<>();
        for (int i = 0; i < FilesStageLimits.MAX_COUNT + 1; i++) sizes.add(1L);
        FilesStageLimits.Result r = FilesStageLimits.check(sizes);
        assertOk(r, false, "count-over");
        assertEqual("reason", "count", r.reason, "count-over reason");
    }

    static void checkBytesOverLimit() {
        // 4 files of 200 MiB each = 800 MiB > 512 MiB cap.
        long chunk = 200L * 1024 * 1024;
        List<Long> sizes = Arrays.asList(chunk, chunk, chunk, chunk);
        FilesStageLimits.Result r = FilesStageLimits.check(sizes);
        assertOk(r, false, "bytes-over");
        assertEqual("reason", "bytes", r.reason, "bytes-over reason");
    }

    static void checkEmptyOk() {
        FilesStageLimits.Result r = FilesStageLimits.check(new ArrayList<Long>());
        assertOk(r, true, "empty");
        assertEqual("count", 0, r.count, "empty count");
        assertEqual("totalBytes", 0L, r.totalBytes, "empty totalBytes");
    }

    static void checkNegativeCoerced() {
        FilesStageLimits.Result r = FilesStageLimits.check(-1, -100L);
        assertOk(r, true, "negative-coerced");
        assertEqual("count", 0, r.count, "negative count");
        assertEqual("totalBytes", 0L, r.totalBytes, "negative totalBytes");
    }

    /**
     * WHY: a single file ≥ 2 GiB must not wrap past the 512 MiB cap. ToInt32 would
     * wrap; we use long so 3 GiB stays > 512 MiB and is rejected.
     */
    static void checkLargeFileNoInt32Wrap() {
        long threeGiB = 3L * 1024 * 1024 * 1024;
        FilesStageLimits.Result r = FilesStageLimits.check(1, threeGiB);
        assertOk(r, false, "large-file");
        assertEqual("reason", "bytes", r.reason, "large-file reason");
    }

    static void assertOk(FilesStageLimits.Result r, boolean expected, String label) {
        if (r.ok != expected) {
            fail(label + ": expected ok=" + expected + " but got ok=" + r.ok
                    + " reason=" + r.reason);
        }
    }

    static void assertEqual(String field, Object expected, Object actual, String label) {
        if (!eq(expected, actual)) {
            fail(label + ": " + field + " expected=" + expected + " actual=" + actual);
        }
    }

    static boolean eq(Object a, Object b) {
        if (a == null || b == null) return a == b;
        return a.equals(b);
    }

    static void fail(String msg) {
        failures++;
        System.err.println("ASSERT FAIL: " + msg);
    }
}
