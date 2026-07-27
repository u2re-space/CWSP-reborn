/*
 * Filename: Gateway.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/transmission/Gateway.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin stub describing the gateway/forward role. No full
 *                     tunnel implementation in the protocol base.
 */
package space.u2re.cwsp.protocol.transmission;

/**
 * Gateway role stub. Documents the central coordinator / bridge / tunnel-proxy
 * role described in network.mdc. Concrete impl lives in the endpoint runtime.
 */
public final class Gateway {

    public static final String ROLE = "gateway";

    private Gateway() {
    }
}
