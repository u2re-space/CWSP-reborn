/*
 * Filename: HTTP.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/HTTP.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: HTTP compatibility/fallback transport stub.
 *
 * NOTE: HTTP is a compatibility and fallback transport used when a peer is not
 *       yet websocket-routable or only legacy clients/scripts are available.
 */
package space.u2re.cwsp.protocol.network;

/**
 * HTTP compatibility transport stub. Documents the legacy endpoints; the real
 * client lives in the endpoint runtime.
 */
public final class HTTP {

    public static final String DISPATCH_PATH = "/api/network/dispatch";
    public static final String BROADCAST_PATH = "/api/broadcast";
    public static final String CLIPBOARD_PATH = "/clipboard";
    public static final String LNA_PROBE_PATH = "/lna-probe";

    private HTTP() {
    }
}
