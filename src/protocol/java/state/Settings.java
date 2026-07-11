/*
 * Filename: Settings.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Settings.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Settings-flow payload helper. CWSP v2 carries settings
 *                     via payload on settings:* actions; this class provides a
 *                     minimal extract/merge surface for backend sync.
 */
package space.u2re.cwsp.protocol.state;

import space.u2re.cwsp.protocol.packet.Packet;
import space.u2re.cwsp.protocol.packet.Types;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Settings-flow helper. Extracts a settings payload from a canonical packet and
 * merges incoming settings into a local settings map.
 */
public final class Settings {

    private Settings() {
    }

    /**
     * Extract the settings payload from a packet. Returns the payload record
     * if the packet action is {@code settings:*} and the payload is a record,
     * otherwise null.
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> extract(Packet packet) {
        if (packet == null || packet.getWhat() == null) {
            return null;
        }
        if (!packet.getWhat().startsWith("settings:")) {
            return null;
        }
        Map<String, Object> rec = Types.asRecord(packet.getPayload());
        if (rec == null) {
            return null;
        }
        return new LinkedHashMap<>(rec);
    }

    /**
     * Merge incoming settings into a target map (mutates target). Returns the
     * target for chaining.
     */
    public static Map<String, Object> merge(Map<String, Object> target, Map<String, Object> incoming) {
        if (target == null || incoming == null) {
            return target;
        }
        target.putAll(incoming);
        return target;
    }
}
