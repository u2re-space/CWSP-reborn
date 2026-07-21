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
 *
 * INVARIANT: this branch never calls clipboard.writeAsset — text/plain and
 * small image/* share still take the legacy clipboard path in ShareTarget
 * (SEND / SEND_MULTIPLE only; VIEW always stages).
 * WHY stage to getFilesDir(): content:// URIs are transient grants; copying
 * into app-private Temp gives the hub a stable path for pack/PUT/serve.
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

    /** App-private stage root, relative to {@link Context#getFilesDir()}. */
    public static final String STAGE_REL_DIR = "files/outgoing";

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
        File stageRoot = new File(context.getFilesDir(), STAGE_REL_DIR + "/" + transferId);
        if (!stageRoot.exists() && !stageRoot.mkdirs()) {
            Log.e(TAG, "stage mkdirs failed " + stageRoot);
            return new StageResult(false, "io", transferId, source, null, null);
        }
        List<StagedFile> staged = new ArrayList<>();
        // WHY: track reserved basenames so two URIs reporting the same
        // DISPLAY_NAME do not overwrite each other (photo.jpg -> photo-1.jpg).
        Set<String> usedNames = new LinkedHashSet<>();
        long total = 0;
        try {
            for (Uri uri : uris) {
                String displayName = queryDisplayName(context, uri);
                File out = new File(stageRoot,
                        FilesStageNames.uniqueBasename(usedNames, displayName));
                long size = copyUriToFile(context, uri, out);
                if (size < 0) {
                    Log.e(TAG, "copy failed uri=" + uri);
                    return new StageResult(false, "io", transferId, source, staged,
                            stageRoot.getAbsolutePath());
                }
                total += size;
                staged.add(new StagedFile(out.getName(), size, out.getAbsolutePath()));
                FilesStageLimits.Result lim = FilesStageLimits.check(staged.size(), total);
                if (!lim.ok) {
                    Log.w(TAG, "stage limit " + lim.reason + " at count=" + staged.size()
                            + " total=" + total);
                    return new StageResult(false, lim.reason, transferId, source, staged,
                            stageRoot.getAbsolutePath());
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "stage exception", e);
            return new StageResult(false, "io", transferId, source, staged,
                    stageRoot.getAbsolutePath());
        }
        Log.i(TAG, "stage ok transferId=" + transferId + " count=" + staged.size()
                + " total=" + total);
        return new StageResult(true, null, transferId, source, staged,
                stageRoot.getAbsolutePath());
    }

    /**
     * Build the {@code cwspFilesIngress} JSON envelope for the bridge listener.
     * Shape: { transferId, source, stageDir, ok, reason?, files:[{name,size,path}] }.
     */
    public static JSONObject toIngressJson(StageResult r) {
        JSONObject o = new JSONObject();
        if (r == null) return o;
        try {
            o.put("transferId", r.transferId != null ? r.transferId : JSONObject.NULL);
            o.put("source", r.source != null ? r.source : JSONObject.NULL);
            o.put("stageDir", r.stageDir != null ? r.stageDir : JSONObject.NULL);
            o.put("ok", r.ok);
            if (r.reason != null) o.put("reason", r.reason);
            JSONArray arr = new JSONArray();
            if (r.files != null) {
                for (StagedFile f : r.files) {
                    JSONObject fo = new JSONObject();
                    fo.put("name", f.name);
                    fo.put("size", f.size);
                    fo.put("path", f.path);
                    arr.put(fo);
                }
            }
            o.put("files", arr);
        } catch (Exception e) {
            Log.w(TAG, "toIngressJson failed", e);
        }
        return o;
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
