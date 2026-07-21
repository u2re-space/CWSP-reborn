/*
 * Filename: FilesStageNames.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesStageNames.java
 * Change date and time: 16.02.00_21.07.2026
 * Reason for changes: Task 5 follow-up — extract the stage-name sanitize +
 *   unique-basename logic into a framework-free helper so the pure Java
 *   check script can unit-test collision suffixing (`-1`, `-2`, …) without
 *   the Android SDK. Mirrors uniqueBasename() in
 *   modules/projects/cwsp-shared/.../files-hub.ts (Neutralino hub).
 *
 * INVARIANT: no android.* imports — must compile with bare javac.
 * COMPAT: collision suffix is `-N` before the extension, matching the TS hub
 *   so Android-staged names and hub-staged names disambiguate identically.
 */
package emission;

import java.util.Locale;
import java.util.Set;

/**
 * Pure, framework-free stage-name sanitizer + unique basename builder for the
 * CWSP files-hub. Used by {@link FilesIngress} so a malicious provider cannot
 * traverse out of the per-transfer stage dir, and so two URIs reporting the
 * same display name do not overwrite each other.
 */
public final class FilesStageNames {
    private FilesStageNames() {}

    /**
     * Defang a display name so a malicious provider cannot traverse out of the
     * per-transfer stage dir. Does NOT disambiguate collisions — call
     * {@link #uniqueBasename(Set, String)} next.
     */
    public static String sanitize(String name) {
        if (name == null || name.isEmpty()) name = "file";
        name = name.replaceAll("[/\\\\]+", "_");
        if (name.contains("..")) name = name.replace("..", "_");
        String trimmed = name.trim();
        if (trimmed.isEmpty()) trimmed = "file";
        return trimmed;
    }

    /**
     * Build a unique basename for a desired name, appending `-N` before the
     * extension when a collision would occur. Pure: callers must reserve the
     * returned name — it is added to {@code used} (lower-cased for
     * case-insensitive filesystems).
     *
     * <p>Examples: {@code photo.jpg} → {@code photo.jpg}; a second
     * {@code photo.jpg} → {@code photo-1.jpg}; a third → {@code photo-2.jpg}.
     * A name with no extension: {@code file} → {@code file-1}.</p>
     */
    public static String uniqueBasename(Set<String> used, String desired) {
        String base = sanitize(desired);
        String key = base.toLowerCase(Locale.US);
        if (!used.contains(key)) {
            used.add(key);
            return base;
        }
        int dot = base.lastIndexOf('.');
        String ext = (dot >= 0 && dot < base.length() - 1) ? base.substring(dot) : "";
        String stem = (dot >= 0 && dot < base.length() - 1) ? base.substring(0, dot) : base;
        int i = 1;
        for (;;) {
            String candidate = stem + "-" + i + ext;
            String candidateKey = candidate.toLowerCase(Locale.US);
            if (!used.contains(candidateKey)) {
                used.add(candidateKey);
                return candidate;
            }
            i++;
        }
    }
}
