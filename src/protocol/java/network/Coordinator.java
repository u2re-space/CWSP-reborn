/*
 * Filename: Coordinator.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/Coordinator.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin routing helpers (sender/destination resolution and
 *                     broadcast/self-route predicates) for canonical packets.
 *                     Java counterpart to the routing portions of normalize.ts.
 *
 * WHY: Routing is by normalized node id, never by raw endpoint URL. Keeping
 *      destination resolution in one place preserves the distinction between
 *      endpoint URL, target URL, AirPad URL, and destination client id.
 */
package space.u2re.cwsp.protocol.network;

import space.u2re.cwsp.protocol.packet.Identify;
import space.u2re.cwsp.protocol.packet.Schema;
import space.u2re.cwsp.protocol.packet.Types;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Routing helpers for canonical and ingress packets. */
public final class Coordinator {

    private Coordinator() {
    }

    /**
     * Resolve the canonical sender id from one of the accepted identity hints:
     * sender, byId, from, or ids.byId.
     */
    public static String resolveSender(Map<String, Object> input) {
        Map<String, Object> ids = Types.asRecord(input.get(Schema.IDS));
        for (String field : new String[]{Schema.SENDER, Schema.BY_ID, Schema.FROM}) {
            String s = asString(input.get(field));
            if (s != null) {
                return s;
            }
        }
        if (ids != null) {
            String s = asString(ids.get(Schema.BY_ID));
            if (s != null) {
                return s;
            }
        }
        throw new Protocol.NormalizationError(
                "CWSP_PACKET_SENDER_REQUIRED",
                "CWSP packet sender must be a non-empty string");
    }

    /**
     * Resolve destinations from destinations, nodes, ids.destinations, or the
     * single target/targetId/deviceId hint. Returns null for broadcast (no
     * targets). Dedupes and trims.
     */
    public static List<String> resolveDestinations(Map<String, Object> input) {
        Map<String, Object> ids = Types.asRecord(input.get(Schema.IDS));
        for (String field : new String[]{Schema.DESTINATIONS, Schema.NODES}) {
            List<String> list = normalizeList(input.get(field));
            if (list != null) {
                return list;
            }
        }
        if (ids != null) {
            List<String> list = normalizeList(ids.get(Schema.DESTINATIONS));
            if (list != null) {
                return list;
            }
        }
        for (String field : new String[]{Schema.TARGET, Schema.TARGET_ID, Schema.DEVICE_ID}) {
            String s = asString(input.get(field));
            if (s != null) {
                List<String> single = new ArrayList<>();
                single.add(s);
                return single;
            }
        }
        return null;
    }

    /** Normalize a routing list value into a deduped, trimmed List, or null. */
    public static List<String> normalizeList(Object value) {
        if (!(value instanceof List)) {
            return null;
        }
        List<?> list = (List<?>) value;
        Set<String> out = new LinkedHashSet<>();
        for (Object candidate : list) {
            if (!(candidate instanceof String)) {
                continue;
            }
            String s = ((String) candidate).trim();
            if (!s.isEmpty()) {
                out.add(s);
            }
        }
        return out.isEmpty() ? null : new ArrayList<>(out);
    }

    /** True if the packet has no destinations (local broadcast/fan-out). */
    public static boolean isBroadcast(List<String> destinations) {
        return destinations == null || destinations.isEmpty();
    }

    /** True if any destination is the wildcard fan-out marker. */
    public static boolean isWildcard(List<String> destinations) {
        if (destinations == null) {
            return false;
        }
        for (String d : destinations) {
            if (Identify.isWildcard(d)) {
                return true;
            }
        }
        return false;
    }

    /** True if the packet routes back to its own sender (self-echo). */
    public static boolean isSelfRoute(String sender, List<String> destinations) {
        if (sender == null || destinations == null) {
            return false;
        }
        for (String d : destinations) {
            if (sender.equals(d)) {
                return true;
            }
        }
        return false;
    }

    /** True if the given destination is a known canonical node id. */
    public static boolean isKnownNode(String id) {
        return Identify.isCanonical(id) || Identify.KNOWN_NODES.contains(id);
    }

    private static String asString(Object v) {
        if (!(v instanceof String)) {
            return null;
        }
        String s = ((String) v).trim();
        return s.isEmpty() ? null : s;
    }
}
