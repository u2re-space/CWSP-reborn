/*
 * Filename: Coordinator.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Coordinator.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — local coordinator bridge accepting normalized CWSP packet maps and dispatching clipboard/settings/readiness.
 *
 * WHY: package `core` keeps parity with sibling Settings/Service. The coordinator
 * is the Android-side analogue of the Node endpoint's local handler: it accepts
 * already-normalized CWSP packets (Map form) and routes the local subset of
 * actions (clipboard:update, clipboard:isReady, settings:get, settings:patch).
 *
 * INVARIANT: action names handled here are the stable canonical names from
 * network.mdc (clipboard:update, clipboard:isReady, settings:get, settings:patch).
 * Compatibility aliases are normalized by the caller (or {@link #normalizeWhat}).
 *
 * TODO(Pass-III/protocol): once `space.u2re.cwsp.protocol.packet.Packet` is filled
 * by the protocol agent, add an overload accepting a typed Packet and convert via
 * Packet.toMap(). Until then this uses Map<String,Object> as the local minimal
 * packet adapter (see network.mdc canonical envelope).
 */

package core;

import emission.Clipboard;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Local CWSP coordinator bridge for Android.
 *
 * <p>Accepts normalized CWSP packet maps and dispatches the local subset of
 * actions to {@link Settings} / {@link Clipboard}, returning a result map shaped
 * like a canonical {@code result} / {@code error} packet.</p>
 */
public class Coordinator {

    private final Settings settings;
    private final Clipboard clipboard;

    public Coordinator(Settings settings, Clipboard clipboard) {
        this.settings = settings;
        this.clipboard = clipboard;
    }

    /**
     * Dispatch a normalized packet map locally.
     *
     * @param packet canonical CWSP packet ({@code op}, {@code what}, {@code payload} / {@code data})
     * @return a {@code result} or {@code error} packet map
     */
    public Map<String, Object> dispatch(Map<String, Object> packet) {
        if (packet == null) {
            return error(400, "coordinator: null packet");
        }
        String what = normalizeWhat(packet.get("what"), packet.get("type"), packet.get("action"));
        Object op = packet.getOrDefault("op", "act");
        Map<String, Object> payload = extractPayload(packet);

        try {
            switch (what) {
                case "clipboard:update": {
                    String text = extractClipboardText(payload);
                    if (text != null) {
                        clipboard.write(text);
                    }
                    return result(what, clipboard.buildUpdatePayload(text));
                }
                case "clipboard:read":
                case "clipboard:get": {
                    Map<String, Object> p = new LinkedHashMap<>();
                    p.put("text", clipboard.read());
                    return result(what, p);
                }
                case "clipboard:clear": {
                    clipboard.clear();
                    Map<String, Object> p = new LinkedHashMap<>();
                    p.put("cleared", true);
                    return result(what, p);
                }
                case "clipboard:isReady": {
                    Map<String, Object> p = new LinkedHashMap<>();
                    p.put("ready", clipboard != null);
                    p.put("ts", clipboard.lastWriteTimestamp());
                    return result(what, p);
                }
                case "settings:get": {
                    Object key = payload == null ? null : payload.get("key");
                    Map<String, Object> p = new LinkedHashMap<>();
                    if (key instanceof String) {
                        p.put("value", settings.get((String) key));
                    } else {
                        p.put("all", settings.getAll());
                    }
                    return result(what, p);
                }
                case "settings:patch": {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> changes = (Map<String, Object>) (payload == null ? null : payload.get("changes"));
                    Map<String, Object> merged = settings.patch(changes);
                    Map<String, Object> p = new LinkedHashMap<>();
                    p.put("all", merged);
                    return result(what, p);
                }
                case "settings:isReady": {
                    Map<String, Object> p = new LinkedHashMap<>();
                    p.put("ready", settings != null);
                    return result(what, p);
                }
                default:
                    return error(404, "coordinator: unhandled what=" + what);
            }
        } catch (Throwable t) {
            return error(500, "coordinator: " + what + " failed: " + t.getMessage());
        }
    }

    /**
     * Readiness probe matching the canonical {@code clipboard:isReady} /
     * {@code settings:isReady} contract.
     */
    public Map<String, Object> isReady() {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("clipboardReady", clipboard != null);
        p.put("settingsReady", settings != null);
        return p;
    }

    // ---- normalization helpers (mirror network.mdc verb/what inference) ----

    /** Normalize the action name; falls back to "dispatch". */
    static String normalizeWhat(Object what, Object type, Object action) {
        Object w = what != null ? what : (type != null ? type : action);
        if (w == null) {
            return "dispatch";
        }
        String s = w.toString();
        // COMPAT: legacy single-word aliases -> canonical names (network.mdc).
        switch (s) {
            case "clipboard":
                return "clipboard:update";
            case "settings":
                return "settings:get";
            default:
                return s;
        }
    }

    /** Extract the first usable payload carrier (payload > data > body). */
    @SuppressWarnings("unchecked")
    static Map<String, Object> extractPayload(Map<String, Object> packet) {
        for (String key : new String[]{"payload", "data", "body"}) {
            Object v = packet.get(key);
            if (v instanceof Map) {
                return (Map<String, Object>) v;
            }
        }
        return null;
    }

    /** Extract clipboard text from a payload (payload.text > content > body; or direct string). */
    static String extractClipboardText(Map<String, Object> payload) {
        if (payload == null) {
            return null;
        }
        for (String key : new String[]{"text", "content", "body"}) {
            Object v = payload.get(key);
            if (v instanceof String && !((String) v).isEmpty()) {
                return (String) v;
            }
        }
        // COMPAT: direct string payload.
        Object direct = payload.get("payload");
        if (direct instanceof String) {
            return (String) direct;
        }
        return null;
    }

    private static Map<String, Object> result(String what, Map<String, Object> payload) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("op", "result");
        out.put("what", what);
        out.put("status", 200);
        out.put("result", payload);
        return out;
    }

    private static Map<String, Object> error(int status, String message) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("op", "error");
        out.put("status", status);
        Map<String, Object> err = new LinkedHashMap<>();
        err.put("message", message);
        out.put("error", err);
        return out;
    }
}
