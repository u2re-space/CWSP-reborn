/*
 * Filename: FilesStageLimits.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesStageLimits.java
 * Change date and time: 15.47.00_21.07.2026
 * Reason for changes: Task 5 — host-free pure stage-limit check shared by
 *   Android ShareTarget staging and the pure Java check script. No android.*
 *   imports so javac can compile it without the SDK.
 *
 * COMPAT: keep MAX_COUNT / MAX_BYTES in sync with
 *   modules/projects/cwsp-shared/src/v2/files-constants.ts
 *   (FILES_STAGE_MAX_COUNT = 64, FILES_STAGE_MAX_BYTES = 512 * 1024 * 1024).
 *   INVARIANT: the hub refuses to stage more than MAX_COUNT files or more than
 *   MAX_BYTES total bytes before offering; mirrors assertStageLimits() in
 *   files-hub-policy.ts.
 */
package emission;

import java.util.List;

/** Pure, framework-free stage-limit policy for the CWSP files-hub. */
public final class FilesStageLimits {
    public static final int MAX_COUNT = 64;
    public static final long MAX_BYTES = 512L * 1024 * 1024;

    private FilesStageLimits() {}

    public static final class Result {
        public final boolean ok;
        /** "count" | "bytes" | null (null when ok). */
        public final String reason;
        public final int count;
        public final long totalBytes;

        private Result(boolean ok, String reason, int count, long totalBytes) {
            this.ok = ok;
            this.reason = reason;
            this.count = count;
            this.totalBytes = totalBytes;
        }
    }

    /**
     * Assert the staged file set fits within hub count + byte thresholds.
     * WHY: isomorphic with assertStageLimits() in cwsp-shared so every shell
     * refuses oversized staging at the same boundary.
     */
    public static Result check(int count, long totalBytes) {
        if (count < 0) count = 0;
        if (totalBytes < 0) totalBytes = 0;
        if (count > MAX_COUNT) return new Result(false, "count", count, totalBytes);
        if (totalBytes > MAX_BYTES) return new Result(false, "bytes", count, totalBytes);
        return new Result(true, null, count, totalBytes);
    }

    /**
     * Convenience overload: sum sizes (Number, null-safe) and check.
     * NOTE: uses long (not int) so a single file ≥ 2 GiB cannot wrap past the
     * 512 MiB cap — mirrors the ToInt32-avoidance rationale in files-hub-policy.ts.
     */
    public static Result check(List<? extends Number> sizes) {
        long total = 0;
        int count = 0;
        if (sizes != null) {
            for (Number s : sizes) {
                count++;
                if (s != null) total += s.longValue();
            }
        }
        return check(count, total);
    }
}
