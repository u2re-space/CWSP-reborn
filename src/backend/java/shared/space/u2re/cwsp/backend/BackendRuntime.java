/*
 * Filename: BackendRuntime.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/BackendRuntime.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — shared Java backend bootstrap (settings + clipboard + control).
 */

package space.u2re.cwsp.backend;

import space.u2re.cwsp.backend.clipboard.ClipboardService;
import space.u2re.cwsp.backend.control.ControlServer;
import space.u2re.cwsp.backend.settings.SettingsStore;

import java.io.IOException;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Thin dual-stack Java backend runtime: settings store + clipboard shadow + control RPC.
 * Mirrors Node {@code startWebnativeBackend} without requiring WebNative packaging.
 */
public final class BackendRuntime implements AutoCloseable {

    public final String platform;
    public final SettingsStore settings;
    public final ClipboardService clipboard;
    public final ControlServer control;

    public static final class Options {
        public String platform = "generic";
        public Path configPath;
        public Integer controlPort;
        public String controlKey;
        public boolean useEnvKey = true;
        public String host = "127.0.0.1";
    }

    private BackendRuntime(
            String platform,
            SettingsStore settings,
            ClipboardService clipboard,
            ControlServer control
    ) {
        this.platform = platform;
        this.settings = settings;
        this.clipboard = clipboard;
        this.control = control;
    }

    public static BackendRuntime start(Options options) throws IOException {
        Objects.requireNonNull(options, "options");
        Path config = options.configPath != null
                ? options.configPath
                : Path.of(System.getProperty("user.dir"), "portable.config.json");
        SettingsStore store = new SettingsStore(config);
        ClipboardService clipboard = new ClipboardService();

        ControlServer.Options controlOpts = new ControlServer.Options();
        controlOpts.store = store;
        controlOpts.host = options.host;
        controlOpts.port = options.controlPort == null ? 0 : options.controlPort;
        controlOpts.controlKey = options.controlKey;
        controlOpts.useEnvKey = options.useEnvKey;

        ControlServer control = new ControlServer(controlOpts);
        return new BackendRuntime(
                options.platform == null ? "generic" : options.platform,
                store,
                clipboard,
                control
        );
    }

    /** Safe diagnostic map — never includes the control key. */
    public Map<String, Object> describe() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("platform", platform);
        out.put("controlPort", control.getPort());
        out.put("authRequired", control.isAuthRequired());
        out.put("configPath", settings.getFilePath().toString());
        return out;
    }

    @Override
    public void close() {
        control.close();
    }
}
