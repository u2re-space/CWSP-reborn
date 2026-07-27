/*
 * Filename: MergeTest.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/test/java/android/core/MergeTest.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — host-free pure merge invariant test (sibling keys not dropped on nested patch).
 *
 * WHY: plain `javac`/`java` runnable (no Android SDK / Robolectric). Asserts the
 * one-level sibling-safe merge invariant that Settings relies on for SharedPreferences
 * persistence parity with the Node settings backend.
 *
 * Run via: scripts/check-java-android-pure.sh
 */

package core;

import java.util.LinkedHashMap;
import java.util.Map;

public class MergeTest {

    private static int failures = 0;

    public static void main(String[] args) {
        checkOverwriteScalar();
        checkNestedSiblingSafe();
        checkArrayReplaces();
        checkNullPatchValueReplaces();
        checkBaseUntouched();
        checkEmptyPatch();

        if (failures > 0) {
            System.err.println("MergeTest FAILED: " + failures + " assertion(s)");
            System.exit(1);
        }
        System.out.println("MergeTest OK: all assertions passed");
    }

    static void checkOverwriteScalar() {
        Map<String, Object> base = map("a", 1, "b", 2);
        Map<String, Object> patch = map("b", 99);
        Map<String, Object> out = Merge.mergeSettingsPatch(base, patch);
        assertEquals(1, out.get("a"), "overwrite-scalar: a preserved");
        assertEquals(99, out.get("b"), "overwrite-scalar: b replaced");
    }

    static void checkNestedSiblingSafe() {
        // INVARIANT: patching nested "core" must NOT drop sibling key "kept".
        Map<String, Object> baseCore = map("kept", "yes", "mode", "endpoint");
        Map<String, Object> base = map("core", baseCore);
        Map<String, Object> patchCore = map("mode", "bridge");
        Map<String, Object> patch = map("core", patchCore);

        Map<String, Object> out = Merge.mergeSettingsPatch(base, patch);
        @SuppressWarnings("unchecked")
        Map<String, Object> outCore = (Map<String, Object>) out.get("core");
        assertEquals("yes", outCore.get("kept"), "nested-sibling: kept preserved");
        assertEquals("bridge", outCore.get("mode"), "nested-sibling: mode overwritten");
    }

    static void checkArrayReplaces() {
        Map<String, Object> base = map("roles", java.util.Arrays.asList("endpoint"));
        Map<String, Object> patch = map("roles", java.util.Arrays.asList("bridge", "requestor"));
        Map<String, Object> out = Merge.mergeSettingsPatch(base, patch);
        @SuppressWarnings("unchecked")
        java.util.List<Object> roles = (java.util.List<Object>) out.get("roles");
        assertEquals(2, roles.size(), "array-replaces: array replaced wholesale");
    }

    static void checkNullPatchValueReplaces() {
        Map<String, Object> base = map("a", 1);
        Map<String, Object> patch = map("a", null);
        Map<String, Object> out = Merge.mergeSettingsPatch(base, patch);
        assertEquals(null, out.get("a"), "null-value: null replaces scalar");
    }

    static void checkBaseUntouched() {
        Map<String, Object> baseCore = map("kept", "yes");
        Map<String, Object> base = map("core", baseCore);
        Map<String, Object> patchCore = map("mode", "bridge");
        Map<String, Object> patch = map("core", patchCore);

        Merge.mergeSettingsPatch(base, patch);
        @SuppressWarnings("unchecked")
        Map<String, Object> baseCoreAfter = (Map<String, Object>) base.get("core");
        assertEquals(1, baseCoreAfter.size(), "base-untouched: base map not mutated");
        assertEquals("yes", baseCoreAfter.get("kept"), "base-untouched: base value not mutated");
    }

    static void checkEmptyPatch() {
        Map<String, Object> base = map("a", 1);
        Map<String, Object> out = Merge.mergeSettingsPatch(base, new LinkedHashMap<>());
        assertEquals(1, out.size(), "empty-patch: size preserved");
        assertEquals(1, out.get("a"), "empty-patch: value preserved");
    }

    // ---- tiny assertion helpers ----

    static void assertEquals(Object expected, Object actual, String label) {
        boolean ok = (expected == null) ? actual == null : expected.equals(actual);
        if (!ok) {
            failures++;
            System.err.println("FAIL " + label + ": expected=" + expected + " actual=" + actual);
        }
    }

    @SafeVarargs
    static Map<String, Object> map(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i + 1 < kv.length; i += 2) {
            m.put((String) kv[i], kv[i + 1]);
        }
        return m;
    }
}
