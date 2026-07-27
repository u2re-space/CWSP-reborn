/*
 * Filename: Decoder.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/codec/Decoder.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Minimal dependency-free JSON parser for CWSP v2 packets.
 *
 * WHY: The Java protocol base must compile with plain javac on JDK 17+ without
 *      Gson/Jackson. This parser understands the subset needed by packets:
 *      objects (Map<String,Object>), arrays (List<Object>), strings, numbers,
 *      booleans, and null. It is intentionally small and not spec-complete.
 */
package space.u2re.cwsp.protocol.codec;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Minimal JSON decoder. Use {@link #parse(String)} to obtain Map/List/primitive values. */
public final class Decoder {

    private Decoder() {
    }

    /** Parse a JSON document into Map / List / String / Double / Boolean / null. */
    public static Object parse(String json) {
        if (json == null) {
            return null;
        }
        Parser p = new Parser(json);
        p.skipWs();
        Object value = p.readValue();
        p.skipWs();
        if (!p.atEnd()) {
            throw new IllegalArgumentException("CWSP JSON: trailing data at index " + p.pos);
        }
        return value;
    }

    /** Parse a JSON object document into a Map. Throws if the top value is not an object. */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseObject(String json) {
        Object v = parse(json);
        if (!(v instanceof Map)) {
            throw new IllegalArgumentException("CWSP JSON: expected object, got " + typeName(v));
        }
        return (Map<String, Object>) v;
    }

    private static String typeName(Object v) {
        if (v == null) return "null";
        if (v instanceof List) return "array";
        if (v instanceof Map) return "object";
        return v.getClass().getSimpleName();
    }

    private static final class Parser {
        private final String src;
        private int pos;

        Parser(String src) {
            this.src = src;
            this.pos = 0;
        }

        boolean atEnd() {
            return pos >= src.length();
        }

        void skipWs() {
            while (pos < src.length()) {
                char c = src.charAt(pos);
                if (c == ' ' || c == '\t' || c == '\n' || c == '\r') {
                    pos++;
                } else {
                    break;
                }
            }
        }

        Object readValue() {
            skipWs();
            if (atEnd()) {
                throw new IllegalArgumentException("CWSP JSON: unexpected end of input");
            }
            char c = src.charAt(pos);
            switch (c) {
                case '{':
                    return readObject();
                case '[':
                    return readArray();
                case '"':
                    return readString();
                case 't':
                case 'f':
                    return readBoolean();
                case 'n':
                    return readNull();
                default:
                    if (c == '-' || (c >= '0' && c <= '9')) {
                        return readNumber();
                    }
                    throw new IllegalArgumentException("CWSP JSON: unexpected char '" + c + "' at " + pos);
            }
        }

        Map<String, Object> readObject() {
            expect('{');
            skipWs();
            Map<String, Object> obj = new LinkedHashMap<>();
            if (peek() == '}') {
                pos++;
                return obj;
            }
            while (true) {
                skipWs();
                String key = readString();
                skipWs();
                expect(':');
                Object value = readValue();
                obj.put(key, value);
                skipWs();
                char c = next();
                if (c == ',') {
                    continue;
                }
                if (c == '}') {
                    break;
                }
                throw new IllegalArgumentException("CWSP JSON: expected ',' or '}' at " + (pos - 1));
            }
            return obj;
        }

        List<Object> readArray() {
            expect('[');
            skipWs();
            List<Object> arr = new ArrayList<>();
            if (peek() == ']') {
                pos++;
                return arr;
            }
            while (true) {
                Object value = readValue();
                arr.add(value);
                skipWs();
                char c = next();
                if (c == ',') {
                    continue;
                }
                if (c == ']') {
                    break;
                }
                throw new IllegalArgumentException("CWSP JSON: expected ',' or ']' at " + (pos - 1));
            }
            return arr;
        }

        String readString() {
            skipWs();
            expect('"');
            StringBuilder sb = new StringBuilder();
            while (true) {
                if (atEnd()) {
                    throw new IllegalArgumentException("CWSP JSON: unterminated string");
                }
                char c = src.charAt(pos++);
                if (c == '"') {
                    break;
                }
                if (c == '\\') {
                    if (atEnd()) {
                        throw new IllegalArgumentException("CWSP JSON: unterminated escape");
                    }
                    char e = src.charAt(pos++);
                    switch (e) {
                        case '"': sb.append('"'); break;
                        case '\\': sb.append('\\'); break;
                        case '/': sb.append('/'); break;
                        case 'b': sb.append('\b'); break;
                        case 'f': sb.append('\f'); break;
                        case 'n': sb.append('\n'); break;
                        case 'r': sb.append('\r'); break;
                        case 't': sb.append('\t'); break;
                        case 'u':
                            if (pos + 4 > src.length()) {
                                throw new IllegalArgumentException("CWSP JSON: bad unicode escape");
                            }
                            int code = Integer.parseInt(src.substring(pos, pos + 4), 16);
                            sb.append((char) code);
                            pos += 4;
                            break;
                        default:
                            throw new IllegalArgumentException("CWSP JSON: bad escape '\\" + e + "'");
                    }
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }

        Object readNumber() {
            int start = pos;
            if (peek() == '-') pos++;
            while (pos < src.length()) {
                char c = src.charAt(pos);
                if ((c >= '0' && c <= '9') || c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-') {
                    pos++;
                } else {
                    break;
                }
            }
            String num = src.substring(start, pos);
            if (num.indexOf('.') >= 0 || num.indexOf('e') >= 0 || num.indexOf('E') >= 0) {
                return Double.parseDouble(num);
            }
            try {
                return Long.parseLong(num);
            } catch (NumberFormatException ex) {
                return Double.parseDouble(num);
            }
        }

        Boolean readBoolean() {
            if (src.startsWith("true", pos)) {
                pos += 4;
                return Boolean.TRUE;
            }
            if (src.startsWith("false", pos)) {
                pos += 5;
                return Boolean.FALSE;
            }
            throw new IllegalArgumentException("CWSP JSON: invalid literal at " + pos);
        }

        Object readNull() {
            if (src.startsWith("null", pos)) {
                pos += 4;
                return null;
            }
            throw new IllegalArgumentException("CWSP JSON: invalid literal at " + pos);
        }

        char peek() {
            if (atEnd()) {
                throw new IllegalArgumentException("CWSP JSON: unexpected end of input");
            }
            return src.charAt(pos);
        }

        char next() {
            if (atEnd()) {
                throw new IllegalArgumentException("CWSP JSON: unexpected end of input");
            }
            return src.charAt(pos++);
        }

        void expect(char c) {
            if (atEnd() || src.charAt(pos) != c) {
                throw new IllegalArgumentException("CWSP JSON: expected '" + c + "' at " + pos);
            }
            pos++;
        }
    }
}
