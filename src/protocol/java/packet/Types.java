/*
 * Filename: Types.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Types.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Define the transport-neutral CWSP v2 type surface (Java
 *                     counterpart to cwsp-shared/src/v2/types.ts).
 *
 * INVARIANT: String wire values of these enums must match the canonical TS
 *            strings so packets stay wire-compatible across Node, browser,
 *            and Android.
 */
package space.u2re.cwsp.protocol.packet;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * Container of static constants, shared helpers, and nested enums used across
 * the packet model. Mirrors exported constants from {@code validation.ts} and
 * the union types of {@code types.ts}.
 */
public final class Types {

    public static final int STATUS_MIN = 100;
    public static final int STATUS_MAX = 599;

    // COMPAT: must match CWSP_EXTENSION_ID_PATTERN in validation.ts.
    public static final String EXTENSION_ID_PATTERN = "^[^/\\s]+\\.[^/\\s]+/.+$";

    private Types() {
    }

    /** CWSP v2 logical verbs. Maps to the {@code op} field of a packet. */
    public enum Verb {
        ASK("ask"),
        ACT("act"),
        RESULT("result"),
        ERROR("error");

        private final String wire;

        Verb(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }

        public static Verb fromWire(String s) {
            for (Verb v : values()) {
                if (v.wire.equals(s)) {
                    return v;
                }
            }
            throw new IllegalArgumentException("Unsupported CWSP verb: " + s);
        }
    }

    /** Logical purpose inferred from the action domain or explicit hint. */
    public enum Purpose {
        AIRPAD("airpad"),
        CLIPBOARD("clipboard"),
        INPUT("input"),
        MOUSE("mouse"),
        SMS("sms"),
        CONTACT("contact"),
        NOTIFICATION("notification"),
        STORAGE("storage"),
        DEBUG("debug"),
        GENERAL("general");

        private final String wire;

        Purpose(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }

        private static final Set<String> WIRES = Collections.unmodifiableSet(
                new LinkedHashSet<>(Arrays.asList(
                        "airpad", "clipboard", "input", "mouse", "sms",
                        "contact", "notification", "storage", "debug", "general")));

        public static boolean isKnown(String s) {
            return s != null && WIRES.contains(s);
        }

        public static Purpose fromWire(String s) {
            if (s == null) {
                return GENERAL;
            }
            for (Purpose p : values()) {
                if (p.wire.equals(s)) {
                    return p;
                }
            }
            return GENERAL;
        }
    }

    /** Optional protocol diagnostic advertised by a peer. */
    public enum Protocol {
        SOCKET("socket"),
        WS("ws"),
        HTTP("http"),
        WORKER("worker"),
        CHROME("chrome"),
        LOCAL("local");

        private final String wire;

        Protocol(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }
    }

    /** Transport over which a packet travelled. Diagnostics-only metadata. */
    public enum Transport {
        WS("ws"),
        SOCKETIO("socketio"),
        BRIDGE("bridge"),
        HTTP("http");

        private final String wire;

        Transport(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }
    }

    /** Policy class derived from {@code what}. Drives max-age and reconnect rules. */
    public enum PolicyClass {
        RELATIVE_INPUT("relative-input"),
        DISCRETE_INPUT("discrete-input"),
        CLIPBOARD("clipboard"),
        SETTINGS("settings"),
        DEBUG("debug"),
        REPLY("reply"),
        GENERAL("general");

        private final String wire;

        PolicyClass(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }
    }

    /** Policy action returned by the policy evaluator. */
    public enum PolicyAction {
        ACCEPT("accept"),
        ENQUEUE("enqueue"),
        DROP("drop");

        private final String wire;

        PolicyAction(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }
    }

    /** Policy reason returned by the policy evaluator. */
    public enum PolicyReason {
        ACCEPTED("accepted"),
        DUPLICATE_UUID("duplicate-uuid"),
        DUPLICATE_CONTENT("duplicate-content"),
        CLIPBOARD_ECHO("clipboard-echo"),
        STALE("stale"),
        RECONNECT_NO_INPUT_REPLAY("reconnect-no-input-replay"),
        RECONNECT_NO_AUTOMATIC_REPLAY("reconnect-no-automatic-replay"),
        RECONNECT_BUFFERED("reconnect-buffered"),
        QUEUE_FULL("queue-full"),
        INACTIVE_CORRELATION("inactive-correlation");

        private final String wire;

        PolicyReason(String wire) {
            this.wire = wire;
        }

        public String wire() {
            return wire;
        }
    }

    /** True for integers in the HTTP-style status range [100, 599]. */
    public static boolean isCwspStatus(Object value) {
        if (!(value instanceof Number)) {
            return false;
        }
        double d = ((Number) value).doubleValue();
        if (d != Math.rint(d)) {
            return false;
        }
        int i = (int) d;
        return i >= STATUS_MIN && i <= STATUS_MAX;
    }

    /** True for non-negative safe integers (JS Number.isSafeInteger parity). */
    public static boolean isSafeNonNegInt(Object value) {
        if (!(value instanceof Number)) {
            return false;
        }
        double d = ((Number) value).doubleValue();
        return d == Math.rint(d) && d >= 0 && d <= 9_007_199_254_740_991L;
    }

    /** True if the value is a Map (treated as a JSON object/record). */
    public static boolean isRecord(Object value) {
        return value instanceof Map;
    }

    /** Returns the Map if value is a Map, else null. */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> asRecord(Object value) {
        if (value instanceof Map) {
            return (Map<String, Object>) value;
        }
        return null;
    }

    /** Namespaced extension id check, e.g. {@code org.cwsp.foo/bar}. */
    public static boolean isNamespacedExtensionId(String id) {
        return id != null && id.matches(EXTENSION_ID_PATTERN);
    }

    /** Canonical packet flags: always sets {@code canonicalV2=true}. */
    public static Map<String, Object> canonicalFlags(Map<String, Object> incoming) {
        Map<String, Object> flags = new LinkedHashMap<>();
        if (incoming != null) {
            flags.putAll(incoming);
        }
        flags.put("canonicalV2", Boolean.TRUE);
        return flags;
    }
}
