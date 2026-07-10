/*
 * Filename: PING.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/PING.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Reachability probe stub (/lna-probe style diagnostics).
 */
package space.u2re.cwsp.protocol.network;

/**
 * Reachability probe stub. Used for cheap reachability checks before a
 * websocket handshake. Concrete probe logic lives in the endpoint runtime.
 */
public final class PING {

    private PING() {
    }

    /** Default probe timeout in milliseconds. */
    public static final long DEFAULT_TIMEOUT_MS = 5_000L;
}
