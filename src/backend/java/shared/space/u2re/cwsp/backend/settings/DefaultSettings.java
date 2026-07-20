/*
 * Filename: DefaultSettings.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/settings/DefaultSettings.java
 * Change date and time: 15.20.00_20.07.2026
 * Reason for changes: Add shell.clipboard* prompt defaults for parity with Node
 *   ShellSettings (outbound/inbound mode, showErase/showUndo, dismissMs) so the
 *   Android settings system recognizes the same keys as the Node/Capacitor stack.
 *   2026-07-20: clipboard*Mode default auto→ask so Accept/Share notifications post.
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

        // WHY: parity with Node ShellSettings.clipboard* — Android reads the same keys
        // so settings sync (portable.config.json) hydrates the prompt policy on phones.
        Map<String, Object> shell = new LinkedHashMap<>();
        // WHY: Accept/Share notifications only post in "ask"; "auto" silent-applies.
        shell.put("clipboardOutboundMode", "ask");
        shell.put("clipboardInboundMode", "ask");
        shell.put("clipboardOutboundShowErase", true);
        shell.put("clipboardInboundShowUndo", true);
        shell.put("clipboardPromptDismissMs", 10000);

        Map<String, Object> root = new LinkedHashMap<>();
        root.put("core", core);
        root.put("shell", shell);
        return root;
    }

    private static List<Object> listOf(String... values) {
        List<Object> list = new ArrayList<>(values.length);
        for (String v : values) list.add(v);
        return list;
    }
}
