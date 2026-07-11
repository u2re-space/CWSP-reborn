/*
 * Filename: TLS.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/TLS.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: TLS configuration descriptor stub.
 *
 * NOTE: Endpoint behavior on :8434 must support certificate loading, browser/
 *       PWA/Android compatibility, and WebSocket upgrade over TLS. Concrete
 *       TLS setup is owned by the platform (Android Netty / desktop Java).
 */
package space.u2re.cwsp.protocol.network;

/**
 * TLS configuration descriptor. Stub; concrete cert loading is platform-owned.
 */
public final class TLS {

    private final String certPath;
    private final String keyPath;
    private final boolean allowInsecureTls;

    public TLS(String certPath, String keyPath, boolean allowInsecureTls) {
        this.certPath = certPath;
        this.keyPath = keyPath;
        this.allowInsecureTls = allowInsecureTls;
    }

    public String getCertPath() {
        return certPath;
    }

    public String getKeyPath() {
        return keyPath;
    }

    public boolean isAllowInsecureTls() {
        return allowInsecureTls;
    }
}
