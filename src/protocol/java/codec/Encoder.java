/*
 * Filename: Encoder.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/codec/Encoder.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Minimal dependency-free JSON serializer for CWSP v2 packets.
 *
 * WHY: Mirror of Decoder.java; keeps the Java protocol base free of external JSON
 *      libs. Serializes Map / List / String / Number / Boolean / null into JSON.
 */
package space.u2re.cwsp.protocol.codec;

import java.util.List;
import java.util.Map;

/** Minimal JSON encoder. {@link #toJson(Object)} produces compact JSON. */
public final class Encoder {

    private Encoder() {
    }

    /** Serialize a JSON-compatible value (Map/List/primitive) into a compact JSON string. */
    public static String toJson(Object value) {
        StringBuilder sb = new StringBuilder();
        write(sb, value);
        return sb.toString();
    }

    private static void write(StringBuilder sb, Object value) {
        if (value == null) {
            sb.append("null");
            return;
        }
        if (value instanceof String) {
            writeString(sb, (String) value);
            return;
        }
        if (value instanceof Boolean) {
            sb.append(((Boolean) value) ? "true" : "false");
            return;
        }
        if (value instanceof Number) {
            sb.append(value.toString());
            return;
        }
        if (value instanceof Map) {
            writeMap(sb, asStringMap((Map<?, ?>) value));
            return;
        }
        if (value instanceof List) {
            writeList(sb, (List<?>) value);
            return;
        }
        // Fallback: treat as string
        writeString(sb, String.valueOf(value));
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asStringMap(Map<?, ?> map) {
        return (Map<String, Object>) map;
    }

    private static void writeMap(StringBuilder sb, Map<String, Object> map) {
        sb.append('{');
        boolean first = true;
        for (Map.Entry<String, Object> e : map.entrySet()) {
            if (e.getValue() == null) {
                // COMPAT: skip null fields to keep packets compact like the TS builder.
                continue;
            }
            if (!first) {
                sb.append(',');
            }
            first = false;
            writeString(sb, e.getKey());
            sb.append(':');
            write(sb, e.getValue());
        }
        sb.append('}');
    }

    private static void writeList(StringBuilder sb, List<?> list) {
        sb.append('[');
        boolean first = true;
        for (Object item : list) {
            if (!first) {
                sb.append(',');
            }
            first = false;
            write(sb, item);
        }
        sb.append(']');
    }

    private static void writeString(StringBuilder sb, String s) {
        sb.append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        sb.append('"');
    }
}
