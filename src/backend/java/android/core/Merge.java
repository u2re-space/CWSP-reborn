/*
 * Filename: Merge.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Merge.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — pure one-level settings merge helper (SharedPreferences sibling-safe parity with Node merge.ts).
 *
 * WHY: extracted as a framework-free pure class so the sibling-key merge invariant
 * is unit-testable with plain `javac` (no Android SDK / Robolectric needed).
 * Mirrors `apps/CWSP-reborn/src/backend/node/generic/settings/merge.ts` semantics:
 *   - top-level keys overwrite
 *   - when both base[key] and patch[key] are non-array Maps, siblings are shallow-merged
 *   - arrays / scalars replace wholesale
 *
 * INVARIANT: patching a nested object must NOT drop sibling keys already persisted.
 */

package core;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Pure settings merge logic, free of any Android import.
 *
 * Used by {@link Settings} for SharedPreferences-backed patch operations, and
 * reused by the host-free unit test under {@code test/java/android/core/MergeTest}.
 */
public final class Merge {

    private Merge() {
        // stateless helper
    }

    /**
     * One-level object merge.
     *
     * @param base  current persisted blob (must not be null)
     * @param patch partial patch to apply (must not be null)
     * @return a new merged map; base is left untouched
     */
    public static Map<String, Object> mergeSettingsPatch(Map<String, Object> base,
                                                         Map<String, Object> patch) {
        Map<String, Object> out = new LinkedHashMap<>(base);
        for (Map.Entry<String, Object> e : patch.entrySet()) {
            String key = e.getKey();
            Object value = e.getValue();
            Object prev = out.get(key);
            if (isPlainMap(value) && isPlainMap(prev)) {
                // WHY: shallow-merge siblings so hidden/unsupported UI sections keep their values.
                @SuppressWarnings("unchecked")
                Map<String, Object> prevMap = (Map<String, Object>) prev;
                @SuppressWarnings("unchecked")
                Map<String, Object> valMap = (Map<String, Object>) value;
                Map<String, Object> merged = new LinkedHashMap<>(prevMap);
                merged.putAll(valMap);
                out.put(key, merged);
            } else {
                out.put(key, value);
            }
        }
        return out;
    }

    /** True when value is a non-null Map that is NOT a List (array). */
    static boolean isPlainMap(Object v) {
        return v instanceof Map && !(v instanceof List);
    }
}
