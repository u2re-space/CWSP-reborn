/*
 * Filename: DefaultSettings.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/settings/DefaultSettings.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — Java defaults shaped like Node DEFAULT_NODE_SETTINGS (no secrets).
 */

package space.u2re.cwsp.backend.settings;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Minimal desktop defaults — no secrets, no host-specific tokens.
 * WHY: parity with Node {@code DEFAULT_NODE_SETTINGS} so Cap/WebNative/Java dual-stack
 * hydrate the same core shape.
 */
public final class DefaultSettings {

    private DefaultSettings() {}

    /** Deep-ish copy of the canonical default blob. */
    public static Map<String, Object> create() {
        Map<String, Object> core = new LinkedHashMap<>();
        core.put("mode", "endpoint");
        core.put("roles", listOf("endpoint", "requestor-initiated", "responser-initiated"));

        Map<String, Object> preconnect = new LinkedHashMap<>();
        preconnect.put("enabled", true);
        preconnect.put("targets", new ArrayList<Object>());
        preconnect.put("reconnectMs", 1000);

        Map<String, Object> bridge = new LinkedHashMap<>();
        bridge.put("enabled", true);
        bridge.put("mode", "active");
        bridge.put("endpoints", new ArrayList<Object>());
        bridge.put("preconnect", preconnect);
        core.put("bridge", bridge);

        core.put("endpointIDs", new LinkedHashMap<String, Object>());

        Map<String, Object> ops = new LinkedHashMap<>();
        ops.put("httpTargets", new ArrayList<Object>());
        ops.put("allowUnencrypted", false);
        ops.put("allowInsecureTls", false);
        ops.put("logLevel", "info");
        core.put("ops", ops);

        Map<String, Object> root = new LinkedHashMap<>();
        root.put("core", core);
        return root;
    }

    private static List<Object> listOf(String... values) {
        List<Object> list = new ArrayList<>(values.length);
        for (String v : values) list.add(v);
        return list;
    }
}
