/*
 * Filename: RealTime.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/RealTime.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin clock helper so callers can inject deterministic
 *                     time in tests instead of reading the wall clock directly.
 */
package space.u2re.cwsp.protocol.packet;

/**
 * Realtime clock abstraction. The default implementation reads the wall clock;
 * tests may subclass to provide deterministic timestamps.
 */
public class RealTime {

    /** Returns current epoch milliseconds. Override for deterministic tests. */
    public long now() {
        return System.currentTimeMillis();
    }

    /** Default shared instance using the wall clock. */
    public static final RealTime WALL = new RealTime();
}
