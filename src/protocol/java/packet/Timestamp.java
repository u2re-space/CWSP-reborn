/*
 * Filename: Timestamp.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Timestamp.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Provide millisecond timestamps for packet builders.
 */
package space.u2re.cwsp.protocol.packet;

/**
 * Timestamp helper. CWSP v2 uses epoch milliseconds (matching JS Date.now()).
 */
public final class Timestamp {

    private Timestamp() {
    }

    /** Current epoch time in milliseconds. */
    public static long now() {
        return System.currentTimeMillis();
    }
}
