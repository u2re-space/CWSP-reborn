/*
 * Filename: Settings.java
 * FullPath: apps/CWSP-reborn/src/backend/java/linux/space/u2re/cwsp/backend/linux/Settings.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — Linux projection of the shared Java settings contract.
 */

package space.u2re.cwsp.backend.linux;

import space.u2re.cwsp.backend.settings.DefaultSettings;
import space.u2re.cwsp.backend.settings.SettingsMerge;
import space.u2re.cwsp.backend.settings.SettingsStore;

import java.nio.file.Path;
import java.util.Map;

/** Linux projection of shared settings helpers (parity with Node linux/settings.ts). */
public final class Settings {

    private Settings() {}

    public static Map<String, Object> defaults() {
        return DefaultSettings.create();
    }

    public static Map<String, Object> merge(Map<String, Object> base, Map<String, Object> patch) {
        return SettingsMerge.merge(base, patch);
    }

    public static SettingsStore createStore(Path filePath) {
        return new SettingsStore(filePath);
    }

    public static SettingsStore createStore(Path filePath, Map<String, Object> extraDefaults) {
        return new SettingsStore(filePath, extraDefaults);
    }
}
