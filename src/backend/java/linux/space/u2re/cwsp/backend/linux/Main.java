/*
 * Filename: Main.java
 * FullPath: apps/CWSP-reborn/src/backend/java/linux/space/u2re/cwsp/backend/linux/Main.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — thin Linux entrypoint for the shared Java backend.
 */

package space.u2re.cwsp.backend.linux;

import space.u2re.cwsp.backend.BackendRuntime;
import space.u2re.cwsp.backend.json.Json;
import space.u2re.cwsp.backend.settings.DefaultSettings;
import space.u2re.cwsp.backend.settings.SettingsStore;

/**
 * Linux desktop Java backend entry (settings + control; AutoKey emission stays separate stubs).
 */
public final class Main {

    private Main() {}

    /** Re-export shared factory for platform projections / tests. */
    public static SettingsStore createSettingsStore(java.nio.file.Path filePath) {
        return new SettingsStore(filePath);
    }

    public static void main(String[] args) throws Exception {
        BackendRuntime.Options options = new BackendRuntime.Options();
        options.platform = "linux";
        try (BackendRuntime runtime = BackendRuntime.start(options)) {
            System.out.println(Json.stringifyCompact(runtime.describe()));
            Thread.currentThread().join();
        }
    }

    public static java.util.Map<String, Object> defaultSettings() {
        return DefaultSettings.create();
    }
}
