/*
 * Filename: SettingsMerge.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/settings/SettingsMerge.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — one-level merge matching Node/settings-view sibling-key invariant.
 */

package space.u2re.cwsp.backend.settings;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * One-level object merge used by the Java settings backend.
 *
 * INVARIANT: patching a nested object must not drop sibling keys already persisted
 * (hidden / unsupported UI sections must not delete persisted values).
 * WHY: behavioral parity with Node {@code mergeSettingsPatch} / settings-view adapter.
 */
public final class SettingsMerge {

    private SettingsMerge() {}

    @SuppressWarnings("unchecked")
    public static Map<String, Object> merge(Map<String, Object> base, Map<String, Object> patch) {
        Map<String, Object> out = shallowCopyMap(base);
        if (patch == null || patch.isEmpty()) return out;

        for (Map.Entry<String, Object> entry : patch.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            Object prev = out.get(key);
            if (isPlainObject(value) && isPlainObject(prev)) {
                Map<String, Object> mergedChild = shallowCopyMap((Map<String, Object>) prev);
                mergedChild.putAll((Map<String, Object>) value);
                out.put(key, mergedChild);
            } else {
                out.put(key, copyValue(value));
            }
        }
        return out;
    }

    public static boolean isPlainObject(Object value) {
        return value instanceof Map<?, ?> && !(value instanceof List<?>);
    }

    public static Map<String, Object> shallowCopyMap(Map<String, Object> src) {
        Map<String, Object> out = new LinkedHashMap<>();
        if (src == null) return out;
        for (Map.Entry<String, Object> e : src.entrySet()) {
            out.put(e.getKey(), copyValue(e.getValue()));
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private static Object copyValue(Object value) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> copy = new LinkedHashMap<>();
            for (Map.Entry<?, ?> e : map.entrySet()) {
                if (e.getKey() instanceof String key) {
                    copy.put(key, copyValue(e.getValue()));
                }
            }
            return copy;
        }
        if (value instanceof List<?> list) {
            return new java.util.ArrayList<>(list);
        }
        return value;
    }
}
