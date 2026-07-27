/*
 * Filename: Json.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/json/Json.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — minimal JDK-only JSON codec for settings/control (no external deps).
 */

package space.u2re.cwsp.backend.json;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Tiny JSON object/array codec sufficient for {@code portable.config.json} and control RPC.
 * WHY: desktop Java backend must compile with stock JDK only (HttpServer + this codec).
 */
public final class Json {

    private Json() {}

    public static Object parse(String raw) {
        if (raw == null) return null;
        Parser p = new Parser(raw.trim());
        if (p.done()) return null;
        Object value = p.parseValue();
        p.skipWs();
        if (!p.done()) {
            throw new IllegalArgumentException("Trailing JSON at index " + p.i);
        }
        return value;
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseObject(String raw) {
        Object value = parse(raw);
        if (value == null) return new LinkedHashMap<>();
        if (!(value instanceof Map)) {
            throw new IllegalArgumentException("Expected JSON object");
        }
        return (Map<String, Object>) value;
    }

    public static String stringify(Object value) {
        StringBuilder sb = new StringBuilder();
        write(sb, value, 0, true);
        sb.append('\n');
        return sb.toString();
    }

    public static String stringifyCompact(Object value) {
        StringBuilder sb = new StringBuilder();
        write(sb, value, 0, false);
        return sb.toString();
    }

    private static void write(StringBuilder sb, Object value, int depth, boolean pretty) {
        if (value == null) {
            sb.append("null");
            return;
        }
        if (value instanceof String s) {
            writeString(sb, s);
            return;
        }
        if (value instanceof Boolean || value instanceof Number) {
            sb.append(value);
            return;
        }
        if (value instanceof Map<?, ?> map) {
            sb.append('{');
            boolean first = true;
            for (Map.Entry<?, ?> e : map.entrySet()) {
                if (!(e.getKey() instanceof String key)) continue;
                if (!first) sb.append(',');
                if (pretty) {
                    sb.append('\n');
                    indent(sb, depth + 1);
                }
                writeString(sb, key);
                sb.append(pretty ? ": " : ":");
                write(sb, e.getValue(), depth + 1, pretty);
                first = false;
            }
            if (pretty && !first) {
                sb.append('\n');
                indent(sb, depth);
            }
            sb.append('}');
            return;
        }
        if (value instanceof List<?> list) {
            sb.append('[');
            boolean first = true;
            for (Object item : list) {
                if (!first) sb.append(',');
                if (pretty) {
                    sb.append('\n');
                    indent(sb, depth + 1);
                }
                write(sb, item, depth + 1, pretty);
                first = false;
            }
            if (pretty && !first) {
                sb.append('\n');
                indent(sb, depth);
            }
            sb.append(']');
            return;
        }
        writeString(sb, String.valueOf(value));
    }

    private static void indent(StringBuilder sb, int depth) {
        for (int i = 0; i < depth; i++) sb.append("  ");
    }

    private static void writeString(StringBuilder sb, String s) {
        sb.append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\b' -> sb.append("\\b");
                case '\f' -> sb.append("\\f");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        sb.append('"');
    }

    private static final class Parser {
        final String s;
        int i;

        Parser(String s) {
            this.s = s;
        }

        boolean done() {
            return i >= s.length();
        }

        void skipWs() {
            while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++;
        }

        char peek() {
            return s.charAt(i);
        }

        char next() {
            return s.charAt(i++);
        }

        Object parseValue() {
            skipWs();
            if (done()) throw new IllegalArgumentException("Unexpected end of JSON");
            char c = peek();
            if (c == '{') return parseObject();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (c == 't') return parseLiteral("true", Boolean.TRUE);
            if (c == 'f') return parseLiteral("false", Boolean.FALSE);
            if (c == 'n') return parseLiteral("null", null);
            if (c == '-' || (c >= '0' && c <= '9')) return parseNumber();
            throw new IllegalArgumentException("Unexpected JSON at index " + i);
        }

        Map<String, Object> parseObject() {
            next(); // {
            Map<String, Object> out = new LinkedHashMap<>();
            skipWs();
            if (!done() && peek() == '}') {
                next();
                return out;
            }
            while (true) {
                skipWs();
                if (done() || peek() != '"') {
                    throw new IllegalArgumentException("Expected object key at index " + i);
                }
                String key = parseString();
                skipWs();
                if (done() || next() != ':') {
                    throw new IllegalArgumentException("Expected ':' after key at index " + i);
                }
                out.put(key, parseValue());
                skipWs();
                if (done()) throw new IllegalArgumentException("Unterminated object");
                char c = next();
                if (c == '}') return out;
                if (c != ',') throw new IllegalArgumentException("Expected ',' or '}' at index " + (i - 1));
            }
        }

        List<Object> parseArray() {
            next(); // [
            List<Object> out = new ArrayList<>();
            skipWs();
            if (!done() && peek() == ']') {
                next();
                return out;
            }
            while (true) {
                out.add(parseValue());
                skipWs();
                if (done()) throw new IllegalArgumentException("Unterminated array");
                char c = next();
                if (c == ']') return out;
                if (c != ',') throw new IllegalArgumentException("Expected ',' or ']' at index " + (i - 1));
            }
        }

        String parseString() {
            next(); // "
            StringBuilder sb = new StringBuilder();
            while (!done()) {
                char c = next();
                if (c == '"') return sb.toString();
                if (c == '\\') {
                    if (done()) throw new IllegalArgumentException("Bad escape");
                    char e = next();
                    switch (e) {
                        case '"' -> sb.append('"');
                        case '\\' -> sb.append('\\');
                        case '/' -> sb.append('/');
                        case 'b' -> sb.append('\b');
                        case 'f' -> sb.append('\f');
                        case 'n' -> sb.append('\n');
                        case 'r' -> sb.append('\r');
                        case 't' -> sb.append('\t');
                        case 'u' -> {
                            if (i + 4 > s.length()) throw new IllegalArgumentException("Bad unicode escape");
                            int code = Integer.parseInt(s.substring(i, i + 4), 16);
                            i += 4;
                            sb.append((char) code);
                        }
                        default -> throw new IllegalArgumentException("Bad escape \\" + e);
                    }
                } else {
                    sb.append(c);
                }
            }
            throw new IllegalArgumentException("Unterminated string");
        }

        Object parseLiteral(String lit, Object value) {
            if (!s.startsWith(lit, i)) {
                throw new IllegalArgumentException("Expected " + lit + " at index " + i);
            }
            i += lit.length();
            return value;
        }

        Number parseNumber() {
            int start = i;
            if (peek() == '-') i++;
            while (!done() && Character.isDigit(peek())) i++;
            boolean frac = false;
            if (!done() && peek() == '.') {
                frac = true;
                i++;
                while (!done() && Character.isDigit(peek())) i++;
            }
            if (!done() && (peek() == 'e' || peek() == 'E')) {
                frac = true;
                i++;
                if (!done() && (peek() == '+' || peek() == '-')) i++;
                while (!done() && Character.isDigit(peek())) i++;
            }
            String num = s.substring(start, i);
            if (frac || num.contains("e") || num.contains("E")) {
                return Double.parseDouble(num);
            }
            long v = Long.parseLong(num);
            if (v >= Integer.MIN_VALUE && v <= Integer.MAX_VALUE) {
                return (int) v;
            }
            return v;
        }
    }
}
