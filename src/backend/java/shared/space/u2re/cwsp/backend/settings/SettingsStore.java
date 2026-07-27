/*
 * Filename: SettingsStore.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/settings/SettingsStore.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — file-backed settings get/patch/persist for Java dual-stack backend.
 */

package space.u2re.cwsp.backend.settings;

import space.u2re.cwsp.backend.json.Json;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Objects;

/**
 * File-backed settings store ({@code portable.config.json}).
 *
 * Verbs align with CWSP / Node contract:
 *   - settings:get   → {@link #get()}
 *   - settings:patch → {@link #patch(Map)} (merge + atomic persist)
 */
public final class SettingsStore {

    private final Path filePath;
    private final Map<String, Object> defaults;
    private Map<String, Object> cache;

    public SettingsStore(Path filePath) {
        this(filePath, null);
    }

    public SettingsStore(Path filePath, Map<String, Object> extraDefaults) {
        this.filePath = Objects.requireNonNull(filePath, "filePath").toAbsolutePath().normalize();
        this.defaults = SettingsMerge.merge(DefaultSettings.create(), extraDefaults);
        this.cache = null;
    }

    public Path getFilePath() {
        return filePath;
    }

    /** settings:get — read persisted blob (defaults applied when file missing/corrupt). */
    public synchronized Map<String, Object> get() throws IOException {
        return SettingsMerge.shallowCopyMap(load());
    }

    /**
     * settings:patch — one-level object merge into persisted settings, then atomic write.
     * INVARIANT: nested object patches must not drop sibling keys already persisted.
     */
    public synchronized Map<String, Object> patch(Map<String, Object> patch) throws IOException {
        Map<String, Object> next = SettingsMerge.merge(load(), patch);
        return SettingsMerge.shallowCopyMap(save(next));
    }

    /** Force-flush the in-memory snapshot to disk. */
    public synchronized Map<String, Object> persist() throws IOException {
        return SettingsMerge.shallowCopyMap(save(load()));
    }

    public synchronized Map<String, Object> defaults() {
        return SettingsMerge.shallowCopyMap(defaults);
    }

    /** Resolved runtime snapshot (same as get; reserved for endpoint overlay). */
    public synchronized Map<String, Object> snapshot() throws IOException {
        return get();
    }

    private Map<String, Object> load() throws IOException {
        if (cache != null) {
            return cache;
        }
        Map<String, Object> disk = readJsonFile(filePath);
        cache = disk != null ? SettingsMerge.merge(defaults, disk) : SettingsMerge.shallowCopyMap(defaults);
        return cache;
    }

    private Map<String, Object> save(Map<String, Object> next) throws IOException {
        cache = SettingsMerge.shallowCopyMap(next);
        writeJsonAtomic(filePath, cache);
        return cache;
    }

    private static Map<String, Object> readJsonFile(Path path) {
        try {
            if (!Files.isRegularFile(path)) return null;
            String raw = Files.readString(path, StandardCharsets.UTF_8);
            return Json.parseObject(raw);
        } catch (Exception ignored) {
            // COMPAT: corrupt/partial writes fall back to defaults rather than crashing the shell.
            return null;
        }
    }

    /**
     * Atomic JSON write: temp file in the same directory, then replace.
     * WHY: a crash mid-write must not leave a truncated portable.config.json as the only copy.
     */
    private static void writeJsonAtomic(Path path, Map<String, Object> value) throws IOException {
        Path parent = path.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
        Path tmp = path.resolveSibling(
                path.getFileName() + "." + ProcessHandle.current().pid() + "." + System.currentTimeMillis() + ".tmp"
        );
        Files.writeString(tmp, Json.stringify(value), StandardCharsets.UTF_8);
        try {
            Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (IOException atomicFailed) {
            // COMPAT: some filesystems reject ATOMIC_MOVE across rename; fall back to replace.
            Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING);
        }
    }
}
