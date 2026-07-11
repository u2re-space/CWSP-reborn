/*
 * Filename: Measure.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Measure.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Small timing/size helpers for packet diagnostics.
 */
package space.u2re.cwsp.protocol.packet;

/** Timing/size helpers used by policy and diagnostics. */
public final class Measure {

    private Measure() {
    }

    /** Non-negative age in ms between now and an earlier timestamp. */
    public static long age(long now, long timestamp) {
        return Math.max(0L, now - timestamp);
    }

    /** True if age exceeds the given max-age window. */
    public static boolean isStale(long now, long timestamp, long maxAgeMs) {
        return age(now, timestamp) > maxAgeMs;
    }
}
