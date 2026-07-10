/*
 * Filename: SettingsStoreTest.java
 * FullPath: apps/CWSP-reborn/test/java/backend/space/u2re/cwsp/backend/test/SettingsStoreTest.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — prove Java settings get/patch sibling-safe persistence.
 */

package space.u2re.cwsp.backend.test;

import space.u2re.cwsp.backend.json.Json;
import space.u2re.cwsp.backend.settings.SettingsStore;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Behavioral parity with Node {@code settings-backend.test.mjs} (not a copy).
 */
public final class SettingsStoreTest {

    private SettingsStoreTest() {}

    public static void main(String[] args) throws Exception {
        Path dir = Files.createTempDirectory("cwsp-java-settings-");
        try {
            Path filePath = dir.resolve("portable.config.json");

            Map<String, Object> extraDefaults = new LinkedHashMap<>();
            Map<String, Object> coreDefaults = new LinkedHashMap<>();
            coreDefaults.put("mode", "endpoint");
            coreDefaults.put("keepMe", true);
            extraDefaults.put("core", coreDefaults);
            Map<String, Object> appearance = new LinkedHashMap<>();
            appearance.put("theme", "system");
            extraDefaults.put("appearance", appearance);

            SettingsStore backend = new SettingsStore(filePath, extraDefaults);
            Map<String, Object> initial = backend.get();
            assertEq("endpoint", dig(initial, "core", "mode"));
            assertEq(true, dig(initial, "core", "keepMe"));

            Map<String, Object> patch = new LinkedHashMap<>();
            Map<String, Object> corePatch = new LinkedHashMap<>();
            Map<String, Object> bridge = new LinkedHashMap<>();
            bridge.put("enabled", true);
            corePatch.put("bridge", bridge);
            patch.put("core", corePatch);
            Map<String, Object> appearancePatch = new LinkedHashMap<>();
            appearancePatch.put("theme", "dark");
            patch.put("appearance", appearancePatch);

            Map<String, Object> patched = backend.patch(patch);
            assertEq("endpoint", dig(patched, "core", "mode"), "sibling core.mode must survive patch");
            assertEq(true, dig(patched, "core", "keepMe"), "sibling core.keepMe must survive patch");
            assertEq(true, dig(patched, "core", "bridge", "enabled"));
            assertEq("dark", dig(patched, "appearance", "theme"));

            Map<String, Object> onDisk = Json.parseObject(Files.readString(filePath, StandardCharsets.UTF_8));
            assertEq("endpoint", dig(onDisk, "core", "mode"));
            assertEq(true, dig(onDisk, "core", "keepMe"));
            assertEq(true, dig(onDisk, "core", "bridge", "enabled"));
            assertEq("dark", dig(onDisk, "appearance", "theme"));

            SettingsStore reloaded = new SettingsStore(filePath);
            Map<String, Object> again = reloaded.get();
            assertEq(true, dig(again, "core", "bridge", "enabled"));
            assertEq(true, dig(again, "core", "keepMe"));
            assertEq("dark", dig(again, "appearance", "theme"));

            // Platform projections export the shared factory (parity with Node windows/linux settings).
            SettingsStore win = space.u2re.cwsp.backend.windows.Settings.createStore(filePath);
            SettingsStore lin = space.u2re.cwsp.backend.linux.Settings.createStore(filePath);
            assertTrue(win != null && lin != null, "windows/linux Settings.createStore must exist");
            assertEq("dark", dig(win.get(), "appearance", "theme"));
            assertEq("dark", dig(lin.get(), "appearance", "theme"));

            System.out.println("OK SettingsStoreTest");
        } finally {
            deleteRecursive(dir);
        }
    }

    @SuppressWarnings("unchecked")
    static Object dig(Map<String, Object> root, String... path) {
        Object cur = root;
        for (String key : path) {
            if (!(cur instanceof Map<?, ?> map)) return null;
            cur = map.get(key);
        }
        return cur;
    }

    static void assertEq(Object expected, Object actual) {
        assertEq(expected, actual, "expected " + expected + " but got " + actual);
    }

    static void assertEq(Object expected, Object actual, String message) {
        if (expected == null ? actual != null : !expected.equals(actual)) {
            throw new AssertionError(message + " (expected=" + expected + ", actual=" + actual + ")");
        }
    }

    static void assertTrue(boolean cond, String message) {
        if (!cond) throw new AssertionError(message);
    }

    static void deleteRecursive(Path root) throws Exception {
        if (!Files.exists(root)) return;
        try (var walk = Files.walk(root)) {
            walk.sorted((a, b) -> b.compareTo(a)).forEach(p -> {
                try {
                    Files.deleteIfExists(p);
                } catch (Exception ignored) {
                }
            });
        }
    }
}
