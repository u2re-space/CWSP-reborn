/*
 * Filename: ClipboardPacketAdapter.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/clipboard/ClipboardPacketAdapter.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — thin adapter so backend compiles without incomplete protocol/java.
 */

package space.u2re.cwsp.backend.clipboard;

import java.util.List;
import java.util.Map;

/**
 * Extracts clipboard text from CWSP packet-like maps.
 *
 * NOTE: {@code src/protocol/java} is owned by another agent and may still be stubs.
 * This adapter depends only on stable conceptual package names / payload carriers
 * ({@code payload}/{@code data} text fields) so the backend compiles today.
 * When {@code space.u2re.cwsp.protocol.packet.Clipboard} lands, wrap it here —
 * do not rewrite protocol/java from the backend contour.
 */
public interface ClipboardPacketAdapter {

    /**
     * Return the first usable textual clipboard body, or null.
     * Carriers (order): payload.text|content|body, data.text|content|body, direct string.
     */
    String extractText(Object packetOrPayload);

    /** Default map-based extractor matching network.mdc clipboard payload rules. */
    static ClipboardPacketAdapter mapBased() {
        return ClipboardPacketAdapter::extractFromUnknown;
    }

    static String extractFromUnknown(Object packetOrPayload) {
        if (packetOrPayload == null) return null;
        if (packetOrPayload instanceof String s) {
            return s.isEmpty() ? null : s;
        }
        if (!(packetOrPayload instanceof Map<?, ?> map)) return null;

        String direct = firstText(map.get("text"), map.get("content"), map.get("body"));
        if (direct != null) return direct;

        String fromPayload = extractCarrier(map.get("payload"));
        if (fromPayload != null) return fromPayload;

        String fromData = extractCarrier(map.get("data"));
        if (fromData != null) return fromData;

        String fromResult = extractCarrier(map.get("result"));
        if (fromResult != null) return fromResult;

        return null;
    }

    private static String extractCarrier(Object carrier) {
        if (carrier instanceof String s) {
            return s.isEmpty() ? null : s;
        }
        if (carrier instanceof Map<?, ?> map) {
            return firstText(map.get("text"), map.get("content"), map.get("body"));
        }
        return null;
    }

    private static String firstText(Object... candidates) {
        for (Object c : candidates) {
            if (c instanceof String s && !s.isEmpty()) return s;
            if (c instanceof Number || c instanceof Boolean) return String.valueOf(c);
            if (c instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof String s && !s.isEmpty()) {
                return s;
            }
        }
        return null;
    }
}
