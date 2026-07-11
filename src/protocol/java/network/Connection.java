/*
 * Filename: Connection.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/Connection.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin connection-state stub for the canonical /ws client.
 */
package space.u2re.cwsp.protocol.network;

/**
 * Connection state descriptor. A thin stub; concrete client implementations
 * own the real socket lifecycle.
 */
public final class Connection {

    public enum State {
        DISCONNECTED,
        CONNECTING,
        CONNECTED,
        RECONNECTING,
        FAILED
    }

    private final String url;
    private State state;

    public Connection(String url) {
        this.url = url;
        this.state = State.DISCONNECTED;
    }

    public String getUrl() {
        return url;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public boolean isConnected() {
        return state == State.CONNECTED;
    }
}
