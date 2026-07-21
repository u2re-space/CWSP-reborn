/*
 * Filename: FilesIngress.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesIngress.java
 * Change date and time: 16.02.00_21.07.2026
 * Reason for changes: Task 5 — Android Open-with / share-target staging into
 *   app-private Temp (files/outgoing/<transferId>) and JSON envelope emission
 *   for the Capacitor files-hub listener (Task 6 wires the bridge event).
 *   2026-07-21 (Task 5 follow-up): VIEW always stages regardless of MIME
 *   (handled in ShareTarget.isFilesIngressIntent); basename collisions under
 *   stageDir now disambiguate with `-1`, `-2`, … via the pure
 *   FilesStageNames.uniqueBasename helper (mirrors Neutralino hub).
 *   2026-07-21 (W3 final review): on any ok:false after the per-transfer dir
 *   is created, the partial stage dir is deleted best-effort so the hub never
 *   re-reads a half-populated stage. Added deleteRecursively(File) reused by
 *   the CwsBridge `files:gc-stage` channel for cancel / picker dismiss paths.
 *
 * INVARIANT: this branch never calls clipboard.writeAsset — text/plain and
 * small image/* share still take the legacy clipboard path in ShareTarget
 * (SEND / SEND_MULTIPLE only; VIEW always stages).
 * WHY stage to app-owned Temp (FilesStorage): content:// URIs are transient
 * grants; copying into app-private Temp gives the hub a stable path for
 * pack/PUT/serve. Staging root follows shell.filesStagingRoot (app/cache/external).
 */
package emission;

import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Stage shared/received file streams into app-private Temp for the files-hub.
 *
 * <p>Flow: {@link #collectStreamUris(Intent)} → {@link #stage(Context, List, String)}
 * → {@link #toIngressJson(StageResult)} → {@code CwsBridgePlugin.emitFilesIngress(json)}.</p>
 */
public final class FilesIngress {
    private static final String TAG = "FilesIngress";

    /** App-private stage root segment (under {@link FilesStorage#resolveFilesBase}). */
    public static final String STAGE_REL_DIR = FilesStorage.REL_OUTGOING;

    /** Ingress source constants — mirror cwsp-shared FilesIngressSource. */
    public static final String SOURCE_OPEN_WITH = "open-with";
    public static final String SOURCE_SHARE_TARGET = "share-target";

    /** One staged file descriptor (name, size, absolute path). */
    public static final class StagedFile {
        public final String name;
        public final long size;
        public final String path;

        StagedFile(String name, long size, String path) {
            this.name = name;
            this.size = size;
            this.path = path;
        }
    }

    /** Outcome of {@link #stage(Context, List, String)}. */
    public static final class StageResult {
        public final boolean ok;
        /** "count" | "bytes" | "io" | "empty" | null when ok. */
        public final String reason;
        public final String transferId;
        public final String source;
        public final List<StagedFile> files;
        public final String stageDir;

        StageResult(boolean ok, String reason, String transferId, String source,
                     List<StagedFile> files, String stageDir) {
            this.ok = ok;
            this.reason = reason;
            this.transferId = transferId;
            this.source = source;
            this.files = files;
            this.stageDir = stageDir;
        }
    }

    private FilesIngress() {}

    /**
     * Collect every stream URI carried by a share/open intent.
     * WHY: SEND uses EXTRA_STREAM (single Uri); SEND_MULTIPLE uses an
     * ArrayList; VIEW carries the data URI; ClipData can carry any of them.
     * De-dup preserves order (LinkedHashSet) so SEND_MULTIPLE stays stable.
     */
    public static List<Uri> collectStreamUris(Intent intent) {
        Set<Uri> set = new LinkedHashSet<>();
        if (intent == null) return new ArrayList<>(set);
        try {
            Bundle extras = intent.getExtras();
            if (extras != null) {
                Object raw = extras.get(Intent.EXTRA_STREAM);
                addUri(set, raw);
                if (raw instanceof List) {
                    for (Object o : (List<?>) raw) addUri(set, o);
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "EXTRA_STREAM collect failed", e);
        }
        try {
            ClipData clip = intent.getClipData();
            if (clip != null) {
                for (int i = 0; i < clip.getItemCount(); i++) {
                    ClipData.Item item = clip.getItemAt(i);
                    if (item != null) addUri(set, item.getUri());
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "ClipData collect failed", e);
        }
        if (set.isEmpty() && intent.getData() != null) {
            String scheme = intent.getData().getScheme();
            if ("content".equalsIgnoreCase(scheme) || "file".equalsIgnoreCase(scheme)) {
                set.add(intent.getData());
            }
        }
        return new ArrayList<>(set);
    }

    private static void addUri(Set<Uri> set, Object o) {
        if (o instanceof Uri) set.add((Uri) o);
    }

    /**
     * Stage every URI into {@code getFilesDir()/files/outgoing/<transferId>/}.
     * Enforces {@link FilesStageLimits} count + bytes caps incrementally so a
     * huge SEND_MULTIPLE aborts as soon as the limit is crossed.
     *
     * <p>INVARIANT: on any {@code ok:false} return after the per-transfer dir
     * has been created, the partial stage dir is deleted best-effort so the
     * hub never re-reads a half-populated stage (W3 final review GC fix).</p>
     */
    public static StageResult stage(Context context, List<Uri> uris, String source) {
        if (context == null || uris == null || uris.isEmpty()) {
            return new StageResult(false, "empty", null, source, null, null);
        }
        FilesStageLimits.Result pre = FilesStageLimits.check(uris.size(), 0L);
        if (!pre.ok) {
            Log.w(TAG, "stage refused " + pre.reason + " count=" + uris.size());
            return new StageResult(false, pre.reason, null, source, null, null);
        }
        String transferId = UUID.randomUUID().toString();
        File stageRoot = new File(FilesStorage.resolveOutgoingRoot(context), transferId);
        if (!stageRoot.exists() && !stageRoot.mkdirs()) {
            Log.e(TAG, "stage mkdirs failed " + stageRoot);
            return new StageResult(false, "io", transferId, source, null, null);
        }
        List<StagedFile> staged = new ArrayList<>();
        // WHY: track reserved basenames so two URIs reporting the same
        // DISPLAY_NAME do not overwrite each other (photo.jpg -> photo-1.jpg).
        Set<String> usedNames = new LinkedHashSet<>();
        long total = 0;
        StageResult failure = null;
        try {
            for (Uri uri : uris) {
                String displayName = queryDisplayName(context, uri);
                File out = new File(stageRoot,
                        FilesStageNames.uniqueBasename(usedNames, displayName));
                long size = copyUriToFile(context, uri, out);
                if (size < 0) {
                    Log.e(TAG, "copy failed uri=" + uri);
                    failure = new StageResult(false, "io", transferId, source, staged,
                            stageRoot.getAbsolutePath());
                    break;
                }
                total += size;
                staged.add(new StagedFile(out.getName(), size, out.getAbsolutePath()));
                FilesStageLimits.Result lim = FilesStageLimits.check(staged.size(), total);
                if (!lim.ok) {
                    Log.w(TAG, "stage limit " + lim.reason + " at count=" + staged.size()
                            + " total=" + total);
                    failure = new StageResult(false, lim.reason, transferId, source, staged,
                            stageRoot.getAbsolutePath());
                    break;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "stage exception", e);
            failure = new StageResult(false, "io", transferId, source, staged,
                    stageRoot.getAbsolutePath());
        }
        if (failure != null) {
            // WHY: a failed stage must not leave a partial per-transfer dir
            // behind; best-effort GC so the Capacitor hub never re-reads a
            // half-populated stage. The envelope still carries stageDir for
            // diagnostics, but env.ok === false so the hub never reads it.
            deleteRecursively(stageRoot);
            return failure;
        }
        Log.i(TAG, "stage ok transferId=" + transferId + " count=" + staged.size()
                + " total=" + total);
        return new StageResult(true, null, transferId, source, staged,
                stageRoot.getAbsolutePath());
    }

    /**
     * Best-effort recursive delete. WHY: plain {@link File#delete()} only
     * removes empty dirs; the stage dir contains copied files. Used by the
     * failure GC path and the {@code files:gc-stage} bridge channel.
     */
    public static boolean deleteRecursively(File dir) {
        if (dir == null || !dir.exists()) return false;
        boolean ok = true;
        File[] kids = dir.listFiles();
        if (kids != null) {
            for (File k : kids) {
                if (k.isDirectory()) {
                    ok &= deleteRecursively(k);
                } else {
                    ok &= k.delete();
                }
            }
        }
        return dir.delete() && ok;
    }

    /**
     * Build the {@code cwspFilesIngress} JSON envelope for the bridge listener.
     * Shape: { transferId, source, stageDir, ok, reason?, files:[{name,size,path}],
     *   defaultDestinations? }. Delegates the shape to framework-free
     * {@link FilesIngressJson#build} (unit-testable without the SDK) and wraps
     * the Map into a JSONObject for emitFilesIngress (Task 6).
     */
    public static JSONObject toIngressJson(StageResult r) {
        return toIngressJson(r, null);
    }

    /**
     * Build the ingress JSON envelope with optional {@code defaultDestinations}.
     * WHY (Bug A): the Capacitor files-hub needs seeded destinations to auto-offer
     * or pre-fill the picker; without them Open-with shares silently drop on the
     * {@code needDestinations} branch with no UI.
     */
    public static JSONObject toIngressJson(StageResult r, List<String> defaultDestinations) {
        if (r == null) return new JSONObject();
        java.util.List<FilesIngressJson.StagedFileInput> inputs = new ArrayList<>();
        if (r.files != null) {
            for (StagedFile f : r.files) {
                inputs.add(new FilesIngressJson.StagedFileInput(f.name, f.size, f.path));
            }
        }
        Map<String, Object> map = FilesIngressJson.build(
                r.transferId, r.source, r.stageDir, r.ok, r.reason, inputs, defaultDestinations);
        JSONObject o = new JSONObject();
        try {
            for (Map.Entry<String, Object> e : map.entrySet()) {
                Object v = e.getValue();
                if (v == null) o.put(e.getKey(), JSONObject.NULL);
                else if (v instanceof List) {
                    JSONArray arr = new JSONArray();
                    for (Object item : (List<?>) v) {
                        if (item instanceof Map) arr.put(new JSONObject((Map<?, ?>) item));
                        else arr.put(item);
                    }
                    o.put(e.getKey(), arr);
                } else {
                    o.put(e.getKey(), v);
                }
            }
        } catch (Exception ex) {
            Log.w(TAG, "toIngressJson failed", ex);
        }
        return o;
    }

    /**
     * List staged files for a transferId by reading the per-transfer stage dir.
     * WHY: the Capacitor files-hub (Task 6) asks Java for the fresh staged list
     * via the {@code files:list-staged} bridge channel instead of trusting only
     * the ingress envelope (which may be stale by the time the user confirms).
     */
    public static List<StagedFile> listStaged(File stageDir) {
        java.util.List<StagedFile> out = new ArrayList<>();
        if (stageDir == null || !stageDir.isDirectory()) return out;
        File[] kids = stageDir.listFiles();
        if (kids == null) return out;
        for (File f : kids) {
            if (f.isFile()) out.add(new StagedFile(f.getName(), f.length(), f.getAbsolutePath()));
        }
        return out;
    }

    /**
     * Resolve the per-transfer stage dir for a transferId under the configured
     * staging root ({@code …/files/outgoing/<transferId>}).
     */
    public static File stageDirFor(Context context, String transferId) {
        if (context == null || transferId == null) return null;
        return new File(FilesStorage.resolveOutgoingRoot(context), transferId);
    }

    /**
     * Materialize one batch plan into wire bytes (zip / gzip / raw). Delegates
     * to framework-free {@link FilesBatchMaterializer#materializeBatch} so the
     * zip + compress-downgrade contract is unit-testable without the SDK.
     * Called by the CwsBridge {@code files:read-batch} channel (Task 6).
     */
    public static FilesBatchMaterializer.MaterializedBatch materializeBatch(
            File stageDir, String kind, List<String> names) throws java.io.IOException {
        return FilesBatchMaterializer.materializeBatch(stageDir, kind, names);
    }

    /**
     * Documented putBlob stub. WHY: HTTP PUT to a desk-reachable
     * {@code /files/blob/<transferId>/<batchId>} endpoint is not wired in Wave 3;
     * the Capacitor hub embeds small batches as base64 and emits {@code files:error}
     * for large ones until a blob server lands. Surfaced via the CwsBridge
     * {@code files:put-blob} channel so the WebView hub can branch without a null adapter.
     */
    public static FilesBatchMaterializer.PutBlobResult putBlobStub(String transferId, String batchId) {
        return FilesBatchMaterializer.putBlobStub(transferId, batchId);
    }

    private static String queryDisplayName(Context context, Uri uri) {
        try (Cursor c = context.getContentResolver().query(uri, null, null, null, null)) {
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) {
                    String name = c.getString(idx);
                    if (name != null && !name.isEmpty()) return name;
                }
            }
        } catch (Exception ignored) {
            /* optional */
        }
        String last = uri.getLastPathSegment();
        return last != null ? last : "file";
    }

    /**
     * Defang display names so a malicious provider cannot traverse out of the
     * per-transfer stage dir. Disambiguation of duplicate basenames is handled
     * by {@link FilesStageNames#uniqueBasename(Set, String)} in the staging
     * loop (suffix `-1`, `-2`, … before the extension).
     */
    private static String sanitizeName(String name, int index) {
        String base = FilesStageNames.sanitize(name);
        if (base.equalsIgnoreCase("file") && index > 0) {
            base = base + "-" + index;
        }
        return base;
    }

    private static long copyUriToFile(Context context, Uri uri, File out) {
        // WHY: abort per-file at MAX_BYTES so one huge stream cannot OOM the hub.
        try (InputStream in = context.getContentResolver().openInputStream(uri);
             FileOutputStream fos = new FileOutputStream(out)) {
            if (in == null) return -1L;
            byte[] buf = new byte[8192];
            int n;
            long total = 0;
            while ((n = in.read(buf)) >= 0) {
                fos.write(buf, 0, n);
                total += n;
                if (total > FilesStageLimits.MAX_BYTES) {
                    Log.w(TAG, "single file exceeds MAX_BYTES — aborting " + uri);
                    return -1L;
                }
            }
            return total;
        } catch (Exception e) {
            Log.w(TAG, "copyUriToFile failed " + uri, e);
            return -1L;
        }
    }

    /** Locale-safe MIME prefix check used by ShareTarget to pick the staging branch. */
    public static boolean isClipboardTextMime(String type) {
        return type != null && type.toLowerCase(Locale.US).startsWith("text/");
    }

    public static boolean isClipboardImageMime(String type) {
        return type != null && type.toLowerCase(Locale.US).startsWith("image/");
    }
}
