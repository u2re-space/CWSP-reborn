/*
 * Filename: UUID.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/UUID.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Provide deterministic UUID v4 generation for packets.
 */
package space.u2re.cwsp.protocol.packet;

/**
 * UUID helper. Generates RFC-4122 v4 strings via {@link java.util.UUID}.
 */
public final class UUID {

    private UUID() {
    }

    /** Generate a fresh random UUID v4 string. */
    public static String generate() {
        return java.util.UUID.randomUUID().toString();
    }

    /** True for non-null strings parseable as a UUID. */
    public static boolean isValid(String s) {
        if (s == null || s.isEmpty()) {
            return false;
        }
        try {
            java.util.UUID.fromString(s);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
