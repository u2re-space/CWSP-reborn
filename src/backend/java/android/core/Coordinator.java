/*
 * Filename: Coordinator.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Coordinator.java
 * Change date and time: 17.50.00_10.07.2026
 * Reason for changes: Route clipboard:* protocol requests through executor.Clipboard
 *   driver (read/write/ask/result), keeping settings on Settings store.
 *
 * WHY: emission.Clipboard is the OS bridge; executor.Clipboard is the protocol
 * driver that answers clipboard asks and applies remote acts (network.mdc).
 *
 * INVARIANT: clipboard actions are handled exclusively by the executor so
 * responses share one driver path with future WS/Capacitor bridges.
 */

package core;

import emission.Clipboard;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Local CWSP coordinator bridge for Android.
 *
 * <p>Accepts normalized CWSP packet maps and dispatches the local subset of
 * actions to {@link Settings} / {@link executor.Clipboard}, returning a result
 * map shaped like a canonical {@code result} / {@code error} packet.</p>
 */
public class Coordinator {

    private final Settings settings;
    private final executor.Clipboard clipboardExecutor;

    public Coordinator(Settings settings, executor.Clipboard clipboardExecutor) {
        this.settings = settings;
        this.clipboardExecutor = clipboardExecutor;
    }

    /**
     * Convenience: wrap an {@link emission.Clipboard} OS bridge as the executor
     * driver (production Capacitor / Activity path).
     */
    public Coordinator(Settings settings, Clipboard emissionClipboard) {
        this(
                settings,
                new executor.Clipboard(executor.Clipboard.adaptEmission(emissionClipboard))
        );
    }

    /**
     * Host-free / test constructor: memory clipboard driver.
     */
    public static Coordinator withMemoryClipboard(Settings settings) {
        return new Coordinator(settings, new executor.Clipboard(new executor.Clipboard.MemoryDriver()));
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

        try {
            if (isClipboardAction(what)) {
                // WHY: executor owns clipboard protocol responses (ask/act → result).
                return clipboardExecutor.handlePacket(packet);
            }
            Map<String, Object> payload = extractPayload(packet);
            switch (what) {
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
        p.put("clipboardReady", clipboardExecutor != null && clipboardExecutor.isReady());
        p.put("settingsReady", settings != null);
        return p;
    }

    public executor.Clipboard clipboardExecutor() {
        return clipboardExecutor;
    }

    // ---- normalization helpers (mirror network.mdc verb/what inference) ----

    static boolean isClipboardAction(String what) {
        if (what == null) {
            return false;
        }
        return what.startsWith("clipboard:") || what.startsWith("airpad:clipboard:");
    }

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
