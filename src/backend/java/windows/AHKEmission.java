/*
 * Filename: AHKEmission.java
 * FullPath: apps/CWSP-reborn/src/backend/java/windows/AHKEmission.java
 * Change date and time: 16.17.00_11.07.2026
 * Reason for changes: Build outgoing CWSP v2-shaped envelopes (Java Maps) for
 *   mouse/keyboard/clipboard acts emitted by the Java/Neutralino Windows bridge.
 */

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Builds canonical CWSP v2-shaped message envelopes as Java Maps for the
 * Java/Neutralino Windows bridge. Mirrors the Node AHKEmission.ts parity surface.
 *
 * INVARIANT: what/action names match CWSP v2 stable action names
 * (mouse:move, mouse:click, mouse:scroll, keyboard:type, keyboard:tap,
 * clipboard:update). The preferred payload carrier is `payload`; `data` is a
 * compatibility mirror pointing at the same map.
 */
public class AHKEmission {

    public static final String PROTOCOL = "local";
    public static final String TRANSPORT = "bridge";

    /** Base canonical v2 envelope for a fire-and-forget act. */
    private static Map<String, Object> base(String what, String purpose, Map<String, Object> payload) {
        Map<String, Object> env = new LinkedHashMap<>();
        env.put("op", "act");
        env.put("what", what);
        env.put("purpose", purpose);
        env.put("protocol", PROTOCOL);
        env.put("transport", TRANSPORT);
        env.put("uuid", UUID.randomUUID().toString());
        env.put("timestamp", System.currentTimeMillis());
        // payload is the preferred carrier; data is a compat mirror (same map).
        env.put("payload", payload);
        env.put("data", payload);
        Map<String, Object> flags = new HashMap<>();
        flags.put("canonicalV2", true);
        env.put("flags", flags);
        return env;
    }

    /** mouse:move (relative dx/dy). */
    public static Map<String, Object> mouseMove(int dx, int dy) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("x", dx);
        p.put("y", dy);
        return base("mouse:move", "input", p);
    }

    /** mouse:click. */
    public static Map<String, Object> mouseClick(String button, boolean doubleClick) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("button", button == null ? "left" : button);
        p.put("double", doubleClick);
        return base("mouse:click", "input", p);
    }

    /** mouse:scroll (delta > 0 up, delta < 0 down). */
    public static Map<String, Object> mouseScroll(int delta) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("delta", delta);
        return base("mouse:scroll", "input", p);
    }

    /** keyboard:type (literal text). */
    public static Map<String, Object> keyboardType(String text) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("text", text == null ? "" : text);
        return base("keyboard:type", "input", p);
    }

    /** keyboard:tap (key + modifiers, matches AirPad payload shape). */
    public static Map<String, Object> keyboardTap(String key, List<String> modifiers) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("key", key == null ? "enter" : key);
        p.put("modifier", modifiers == null ? List.of() : modifiers);
        return base("keyboard:tap", "input", p);
    }

    /** clipboard:update (text). Node remains canonical clipboard transport. */
    public static Map<String, Object> clipboardUpdate(String text) {
        Map<String, Object> p = new LinkedHashMap<>();
        String value = text == null ? "" : text;
        p.put("text", value);
        // COMPAT: mirror text under content/body for legacy receivers.
        p.put("content", value);
        p.put("body", value);
        return base("clipboard:update", "clipboard", p);
    }
}
