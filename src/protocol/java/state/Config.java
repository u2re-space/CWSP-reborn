/*
 * Filename: Config.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Config.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Runtime config descriptor (core.* shape from network.mdc).
 *                     Thin data holder; loading is owned by the backend.
 */
package space.u2re.cwsp.protocol.state;

import space.u2re.cwsp.protocol.network.Linking;

/**
 * Runtime config descriptor. Mirrors the {@code core.*} config shape documented
 * in network.mdc (mode, roles, bridge, endpointIDs, ops). Thin holder only.
 */
public final class Config {

    public static final String MODE_ENDPOINT = "endpoint";

    private String mode = MODE_ENDPOINT;
    private Linking bridge;

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Linking getBridge() {
        return bridge;
    }

    public void setBridge(Linking bridge) {
        this.bridge = bridge;
    }
}
