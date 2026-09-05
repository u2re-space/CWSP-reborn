/*
 * Filename: DeviceAliases.java
 * FullPath: apps/CWSP-transfer/src/backend/java/android/core/DeviceAliases.java
 * Reason for changes: Name → L-* id (+ optional BT MAC) for Transfer routing.
 *
 * FIND:device-aliases
 * INVARIANT: short fleet form only (L-110). Overlay prefs never expand to full LAN ids.
 */

package core;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Java parity with {@code cwsp-shared} {@code device-aliases.ts}.
 */
public final class DeviceAliases {

    private DeviceAliases() {}

    public static final class Record {
        public final String id;
        public final String label;
        public final List<String> aliases;
        public String bluetooth;

        Record(String id, String label, List<String> aliases, String bluetooth) {
            this.id = id;
            this.label = label;
            this.aliases = aliases;
            this.bluetooth = bluetooth;
        }
    }

    private static final String[][] DEFAULTS = {
            { "L-110", "Desk", "desk,ultrabook,110" },
            { "L-111", "Laptop", "laptop,111" },
            { "L-196", "Phone", "phone,196" },
            { "L-208", "Phone-208", "208" },
            { "L-210", "Phone-210", "210" },
            { "L-200", "Gateway", "gateway,hub,200" },
    };

    public static List<Record> merge(String aliasOverlay, String bluetoothOverlay) {
        Map<String, Record> byId = new LinkedHashMap<>();
        for (String[] row : DEFAULTS) {
            byId.put(row[0], new Record(row[0], row[1], splitCsv(row[2]), null));
        }
        Map<String, String> aliases = parseOverlay(aliasOverlay);
        for (Map.Entry<String, String> e : aliases.entrySet()) {
            String alias = e.getKey();
            String target = e.getValue();
            String id = canonicalize(target);
            if (id == null || id.isEmpty()) id = canonicalize(alias);
            if (id == null || id.isEmpty()) continue;
            Record rec = byId.get(id);
            if (rec == null) {
                rec = new Record(id, alias.isEmpty() ? id : alias, new ArrayList<String>(), null);
                byId.put(id, rec);
            }
            String name = looksLikeId(alias) ? target : alias;
            if (name != null && !name.isEmpty() && !name.equalsIgnoreCase(id)
                    && !containsIgnoreCase(rec.aliases, name)) {
                rec.aliases.add(name);
            }
        }
        Map<String, String> macs = parseBluetoothOverlay(bluetoothOverlay);
        for (Map.Entry<String, String> e : macs.entrySet()) {
            Record rec = byId.get(e.getKey());
            if (rec == null) {
                rec = new Record(e.getKey(), e.getKey(), new ArrayList<String>(), e.getValue());
                byId.put(e.getKey(), rec);
            } else {
                rec.bluetooth = e.getValue();
            }
        }
        return new ArrayList<>(byId.values());
    }

    public static String resolve(String raw, List<Record> map) {
        if (raw == null) return null;
        String t = raw.trim();
        if (t.isEmpty()) return t;
        if ("*".equals(t) || "all".equalsIgnoreCase(t) || "broadcast".equalsIgnoreCase(t)) {
            return t;
        }
        String token = null;
        int sep = t.lastIndexOf("::");
        String node = t;
        if (sep > 0) {
            node = t.substring(0, sep).trim();
            token = t.substring(sep + 2).trim();
            if (token.isEmpty()) token = null;
        }
        String id = resolveBare(node, map);
        if (id == null || id.isEmpty()) return t;
        return token != null ? id + "::" + token : id;
    }

    public static List<String> resolveAll(List<String> raw, List<Record> map) {
        List<String> out = new ArrayList<>();
        Map<String, Boolean> seen = new LinkedHashMap<>();
        if (raw == null) return out;
        for (String item : raw) {
            String id = resolve(item, map);
            if (id == null || id.isEmpty()) continue;
            String key = id.toLowerCase(Locale.US);
            if (seen.containsKey(key)) continue;
            seen.put(key, Boolean.TRUE);
            out.add(id);
        }
        return out;
    }

    public static String bluetoothMac(String idOrAlias, List<Record> map) {
        Record rec = lookup(idOrAlias, map);
        return rec != null ? rec.bluetooth : null;
    }

    public static String idForMac(String mac, List<Record> map) {
        String norm = normalizeMac(mac);
        if (norm == null) return null;
        for (Record rec : mapOrDefault(map)) {
            if (norm.equals(rec.bluetooth)) return rec.id;
        }
        return null;
    }

    public static String idForBluetoothName(String name, List<Record> map) {
        if (name == null) return null;
        String n = name.trim().toLowerCase(Locale.US);
        if (n.isEmpty()) return null;
        List<Record> records = mapOrDefault(map);
        for (Record rec : records) {
            if (n.equals(rec.id.toLowerCase(Locale.US)) || n.equals(rec.label.toLowerCase(Locale.US))) {
                return rec.id;
            }
            if (containsIgnoreCase(rec.aliases, n)) return rec.id;
        }
        for (Record rec : records) {
            if (n.contains(rec.id.toLowerCase(Locale.US))) return rec.id;
            for (String a : rec.aliases) {
                if (a != null && a.length() >= 3 && n.contains(a.toLowerCase(Locale.US))) {
                    return rec.id;
                }
            }
        }
        return null;
    }

    public static String displayLabel(String input, List<Record> map) {
        Record rec = lookup(input, map);
        String id = rec != null ? rec.id : resolve(input, map);
        if (id == null || id.isEmpty()) return "";
        if (rec == null || rec.label == null || rec.label.equalsIgnoreCase(id)) return id;
        return rec.label + " (" + id + ")";
    }

    public static Record lookup(String input, List<Record> map) {
        String id = resolveBare(input, map);
        if (id == null) return null;
        for (Record rec : mapOrDefault(map)) {
            if (id.equalsIgnoreCase(rec.id)) return rec;
        }
        return null;
    }

    public static String normalizeMac(String raw) {
        if (raw == null) return null;
        String hex = raw.trim().toUpperCase(Locale.US).replaceAll("[^0-9A-F]", "");
        if (hex.length() != 12) return null;
        StringBuilder sb = new StringBuilder(17);
        for (int i = 0; i < 12; i += 2) {
            if (i > 0) sb.append(':');
            sb.append(hex, i, i + 2);
        }
        return sb.toString();
    }

    private static String resolveBare(String input, List<Record> map) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.isEmpty()) return trimmed;
        if ("*".equals(trimmed) || "all".equalsIgnoreCase(trimmed) || "broadcast".equalsIgnoreCase(trimmed)) {
            return trimmed;
        }
        String shortId = canonicalize(trimmed);
        List<Record> records = mapOrDefault(map);
        if (shortId != null) {
            for (Record rec : records) {
                if (rec.id.equalsIgnoreCase(shortId)) return rec.id;
            }
            if (looksLikeId(shortId)) return shortId;
        }
        String key = trimmed.toLowerCase(Locale.US);
        for (Record rec : records) {
            if (rec.id.equalsIgnoreCase(key) || rec.label.equalsIgnoreCase(key)) return rec.id;
            if (containsIgnoreCase(rec.aliases, key)) return rec.id;
        }
        return shortId != null ? shortId : trimmed;
    }

    private static String canonicalize(String value) {
        return Configure.toShortFleetClientId(value);
    }

    private static boolean looksLikeId(String value) {
        return value != null && value.regionMatches(true, 0, "L-", 0, 2);
    }

    private static List<Record> mapOrDefault(List<Record> map) {
        return map != null ? map : merge(null, null);
    }

    private static boolean containsIgnoreCase(List<String> list, String value) {
        if (list == null || value == null) return false;
        for (String item : list) {
            if (item != null && item.equalsIgnoreCase(value)) return true;
        }
        return false;
    }

    private static List<String> splitCsv(String raw) {
        List<String> out = new ArrayList<>();
        if (raw == null || raw.isEmpty()) return out;
        for (String p : raw.split(",")) {
            String t = p.trim();
            if (!t.isEmpty()) out.add(t);
        }
        return out;
    }

    static Map<String, String> parseOverlay(String raw) {
        Map<String, String> out = new LinkedHashMap<>();
        if (raw == null) return out;
        String text = raw.trim();
        if (text.isEmpty()) return out;
        if (text.startsWith("{")) {
            try {
                JSONObject obj = new JSONObject(text);
                Iterator<String> keys = obj.keys();
                while (keys.hasNext()) {
                    String k = keys.next();
                    addPair(out, k, obj.optString(k, ""));
                }
                return out;
            } catch (Throwable ignored) {
                /* kv list */
            }
        }
        for (String part : text.split("[,;\\n]+")) {
            int eq = part.indexOf('=');
            if (eq <= 0) continue;
            addPair(out, part.substring(0, eq), part.substring(eq + 1));
        }
        return out;
    }

    static Map<String, String> parseBluetoothOverlay(String raw) {
        Map<String, String> aliases = parseOverlay(raw);
        Map<String, String> out = new LinkedHashMap<>();
        for (Map.Entry<String, String> e : aliases.entrySet()) {
            String key = e.getKey();
            String value = e.getValue();
            String id = looksLikeId(key) ? canonicalize(key) : canonicalize(value);
            String mac = normalizeMac(looksLikeId(key) ? value : key);
            if (id != null && !id.isEmpty() && mac != null) out.put(id, mac);
        }
        return out;
    }

    private static void addPair(Map<String, String> out, String leftRaw, String rightRaw) {
        String left = leftRaw != null ? leftRaw.trim() : "";
        String right = rightRaw != null ? rightRaw.trim() : "";
        if (left.isEmpty() || right.isEmpty()) return;
        if (looksLikeId(left) && !looksLikeId(right)) {
            String id = canonicalize(left);
            out.put(right, id != null ? id : left);
            return;
        }
        String id = canonicalize(right);
        out.put(left, id != null ? id : right);
    }
}
