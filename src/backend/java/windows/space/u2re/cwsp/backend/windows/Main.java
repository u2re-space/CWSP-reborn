/*
 * Filename: Main.java
 * FullPath: apps/CWSP-reborn/src/backend/java/windows/space/u2re/cwsp/backend/windows/Main.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — thin Windows entrypoint for the shared Java backend.
 */

package space.u2re.cwsp.backend.windows;

import space.u2re.cwsp.backend.BackendRuntime;
import space.u2re.cwsp.backend.json.Json;
import space.u2re.cwsp.backend.settings.DefaultSettings;
import space.u2re.cwsp.backend.settings.SettingsStore;

import java.nio.file.Path;
import java.util.Map;

/**
 * Windows desktop Java backend entry (settings + control; AHK emission stays separate stubs).
 */
public final class Main {

    private Main() {}

    /** Re-export shared factory for platform projections / tests. */
    public static SettingsStore createSettingsStore(Path filePath) {
        return new SettingsStore(filePath);
    }

    /** Defaults mirror Node DEFAULT_NODE_SETTINGS (no secrets). */
    public static Map<String, Object> defaultSettings() {
        return DefaultSettings.create();
    }

    public static void main(String[] args) throws Exception {
        BackendRuntime.Options options = new BackendRuntime.Options();
        options.platform = "windows";
        try (BackendRuntime runtime = BackendRuntime.start(options)) {
            // NOTE: never log the control key — describe() omits it.
            System.out.println(Json.stringifyCompact(runtime.describe()));
            // Keep process alive for shell hosting; Ctrl-C / close stops the control server.
            Thread.currentThread().join();
        }
    }
}
