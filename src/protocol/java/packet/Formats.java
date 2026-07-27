/*
 * Filename: Formats.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Formats.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Transport/format name constants used in diagnostics.
 */
package space.u2re.cwsp.protocol.packet;

/** Transport and format name constants (wire-stable). */
public final class Formats {

    public static final String WS_PATH = "/ws";
    public static final String SOCKETIO_PATH = "/socket.io";

    public static final String TRANSPORT_WS = "ws";
    public static final String TRANSPORT_SOCKETIO = "socketio";
    public static final String TRANSPORT_BRIDGE = "bridge";
    public static final String TRANSPORT_HTTP = "http";

    // Preference order per network.mdc Transport Preference section.
    public static final String[] PREFERENCE = {"ws", "http", "tcp", "socketio"};
    public static final String[] FALLBACK = {"ws", "bridge", "socketio"};

    private Formats() {
    }
}
