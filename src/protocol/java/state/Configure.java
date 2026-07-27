/*
 * Filename: Configure.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Configure.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin builder helper around Config. Keeps construction
 *                     readable for backend bootstrap. Replaces a prior symlink
 *                     alias so the class name matches its file.
 */
package space.u2re.cwsp.protocol.state;

import space.u2re.cwsp.protocol.network.Linking;

/**
 * Fluent builder for {@link Config}.
 */
public final class Configure {

    private final Config config = new Config();

    public Configure mode(String mode) {
        config.setMode(mode);
        return this;
    }

    public Configure bridge(Linking bridge) {
        config.setBridge(bridge);
        return this;
    }

    public Config build() {
        return config;
    }
}
