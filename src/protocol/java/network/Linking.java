/*
 * Filename: Linking.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/Linking.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Bridge/tunnel linking descriptor stub.
 *
 * NOTE: Documents the bridge/tunnel/link role described in network.mdc. Real
 *       bridge dialing and preconnect behavior is owned by the endpoint runtime.
 */
package space.u2re.cwsp.protocol.network;

import java.util.Collections;
import java.util.List;

/**
 * Bridge/tunnel linking descriptor. Thin stub describing preconnect targets and
 * reconnect intervals for keeping reverse/tunnel paths warm.
 */
public final class Linking {

    public static final String MODE_ACTIVE = "active";
    public static final String MODE_PASSIVE = "passive";

    private final boolean enabled;
    private final String mode;
    private final List<String> endpoints;
    private final List<String> preconnectTargets;
    private final long reconnectMs;

    public Linking(boolean enabled, String mode, List<String> endpoints,
                   List<String> preconnectTargets, long reconnectMs) {
        this.enabled = enabled;
        this.mode = mode;
        this.endpoints = endpoints == null ? Collections.emptyList() : endpoints;
        this.preconnectTargets = preconnectTargets == null ? Collections.emptyList() : preconnectTargets;
        this.reconnectMs = reconnectMs;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getMode() {
        return mode;
    }

    public List<String> getEndpoints() {
        return endpoints;
    }

    public List<String> getPreconnectTargets() {
        return preconnectTargets;
    }

    public long getReconnectMs() {
        return reconnectMs;
    }
}
