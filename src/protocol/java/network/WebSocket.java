/*
 * Filename: WebSocket.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/WebSocket.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Define the canonical realtime transport client interface
 *                     (/ws). No full server implementation — only the surface
 *                     Android/desktop backends will bind to.
 *
 * NOTE: The native WebSocket at /ws is the canonical realtime transport per
 *       .cursor/rules/network.mdc. Concrete client impl is platform-specific.
 */
package space.u2re.cwsp.protocol.network;

import space.u2re.cwsp.protocol.packet.Packet;

/**
 * Canonical realtime transport client interface ({@code /ws}).
 *
 * Implementations connect to a CWSP endpoint gateway, send/receive canonical
 * packets as JSON frames, and notify a {@link Listener}. This interface is a
 * stub — no server or full client is provided in the protocol base.
 */
public interface WebSocket {

    /** Connect to the given {@code /ws} URL (e.g. {@code wss://host:8434/ws}). */
    void connect(String url) throws Exception;

    /** Send a canonical packet as a JSON frame. */
    void send(Packet packet) throws Exception;

    /** Send a raw JSON frame. */
    void sendRaw(String json) throws Exception;

    /** True if the transport currently has an open handshake. */
    boolean isOpen();

    /** Close the transport. */
    void close();

    /** Listener for inbound frames and lifecycle events. */
    interface Listener {
        void onOpen();
        void onMessage(String json);
        void onClose(int code, String reason);
        void onError(Throwable cause);
    }
}
