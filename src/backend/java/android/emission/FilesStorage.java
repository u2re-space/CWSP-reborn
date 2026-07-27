/*
 * Filename: FilesStorage.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesStorage.java
 * Change date and time: 21.30.00_21.07.2026
 * Reason for changes: Capacitor files landing (app/Downloads/SAF) + staging root
 *   (app/cache/external). App-private dirs are invisible in system Files — this
 *   helper exposes paths, ensures dirs, writes a README, and shares it via
 *   FileProvider. Also shareLandingTransfer() for re-sharing received files
 *   from the "Files saved" notification Share action.
 *   2026-07-21: openLandingFolder() — tap "Files saved" opens the configured
 *   landing (SAF tree / Downloads / CWSP Files DocumentsProvider) in the
 *   default file manager (e.g. Material Files).
 *   2026-07-21b: open via createChooser on SAF document Uri (broadcast from
 *   notification) — restores file-manager picker after file:// regressionands broke it.
 *   2026-07-21c: openLandingFile() — "Open File" notification action views the
 *   first landed file via FileProvider ACTION_VIEW chooser.
 *   2026-07-21r: resolveLandingFile understands clipboard/ + clip-* singles.
 *   2026-07-21t: Open File prefers exported Downloads/SAF/DocumentsProvider Uri
 *   (final filename) over app-private intermediate FileProvider path.
 *
 * INVARIANT: staging is always under an app-owned directory first; SAF/Downloads
 * are landing/export targets only (never the Open-with wire source).
 */
package emission;

import android.app.DownloadManager;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.util.Log;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Resolves Capacitor files staging / landing paths from shell prefs.
 */
public final class FilesStorage {
    private static final String TAG = "emission.FilesStorage";
    private static final String PREFS = "cwsp_configure";

    public static final String REL_OUTGOING = "files/outgoing";
    public static final String REL_INCOMING = "files/incoming";
    public static final String REL_LANDING = "files/landing";
    public static final String README_NAME = "README-cwsp-files.txt";

    private FilesStorage() { /* no instances */ }

    public static String readStagingRoot(Context context) {
        String v = prefs(context).getString("filesStagingRoot", "app");
        if ("cache".equalsIgnoreCase(v) || "external".equalsIgnoreCase(v)) return v.toLowerCase();
        return "app";
    }

    public static String readLandingMode(Context context) {
        String v = prefs(context).getString("filesLandingMode", "app");
        if ("downloads".equalsIgnoreCase(v) || "saf".equalsIgnoreCase(v)) return v.toLowerCase();
        return "app";
    }

    public static String readIncomingDir(Context context) {
        return String.valueOf(prefs(context).getString("filesIncomingDir", "")).trim();
    }

    public static boolean readAskDirEveryTime(Context context) {
        return prefs(context).getBoolean("filesAskDirEveryTime", true);
    }

    public static void writeLandingPrefs(
            Context context,
            String landingMode,
            String incomingDir,
            Boolean askEveryTime,
            String stagingRoot
    ) {
        if (context == null) return;
        SharedPreferences.Editor ed = prefs(context).edit();
        if (landingMode != null && !landingMode.isEmpty()) {
            ed.putString("filesLandingMode", landingMode);
        }
        if (incomingDir != null) {
            ed.putString("filesIncomingDir", incomingDir.trim());
        }
        if (askEveryTime != null) {
            ed.putBoolean("filesAskDirEveryTime", askEveryTime);
        }
        if (stagingRoot != null && !stagingRoot.isEmpty()) {
            ed.putString("filesStagingRoot", stagingRoot);
        }
        ed.apply();
    }

    /**
     * Base directory for all {@code files/…} staging (outgoing + incoming temp).
     * WHY: Open-with / share-target must copy into an app-owned path before pack.
     */
    public static File resolveFilesBase(Context context) {
        return resolveFilesBase(context, readStagingRoot(context));
    }

    public static File resolveFilesBase(Context context, String stagingRoot) {
        if (context == null) return null;
        String mode = stagingRoot == null ? "app" : stagingRoot.trim().toLowerCase();
        File base;
        if ("cache".equals(mode)) {
            base = context.getCacheDir();
        } else if ("external".equals(mode)) {
            File ext = context.getExternalFilesDir(null);
            base = ext != null ? ext : context.getFilesDir();
        } else {
            base = context.getFilesDir();
        }
        File files = new File(base, "files");
        if (!files.exists() && !files.mkdirs()) {
            Log.w(TAG, "mkdirs failed " + files);
        }
        return files;
    }

    public static File resolveOutgoingRoot(Context context) {
        File base = resolveFilesBase(context);
        File out = new File(base, "outgoing");
        if (!out.exists()) out.mkdirs();
        return out;
    }

    public static File resolveIncomingTempRoot(Context context) {
        File base = resolveFilesBase(context);
        File in = new File(base, "incoming");
        if (!in.exists()) in.mkdirs();
        return in;
    }

    public static File resolveAppLandingRoot(Context context) {
        File base = resolveFilesBase(context);
        File land = new File(base, "landing");
        if (!land.exists()) land.mkdirs();
        return land;
    }

    /** Relative stage path used by FilesIngress (under the resolved files base). */
    public static String outgoingRelForIngress() {
        return REL_OUTGOING;
    }

    public static Map<String, Object> statusMap(Context context) {
        Map<String, Object> m = new LinkedHashMap<>();
        if (context == null) {
            m.put("error", "no-context");
            return m;
        }
        ensureDirsAndReadme(context);
        File outgoing = resolveOutgoingRoot(context);
        File incoming = resolveIncomingTempRoot(context);
        File landing = resolveAppLandingRoot(context);
        File readme = new File(resolveFilesBase(context), README_NAME);
        m.put("stagingRoot", readStagingRoot(context));
        m.put("landingMode", readLandingMode(context));
        m.put("incomingDir", readIncomingDir(context));
        m.put("askDirEveryTime", readAskDirEveryTime(context));
        m.put("outgoingDir", outgoing.getAbsolutePath());
        m.put("incomingAppDir", incoming.getAbsolutePath());
        m.put("landingAppDir", landing.getAbsolutePath());
        m.put("readmePath", readme.getAbsolutePath());
        m.put("filesBase", resolveFilesBase(context).getAbsolutePath());
        m.put(
                "note",
                "App-private paths are not under Android/data in Files. Use sidebar → CWSP Files (DocumentsProvider), Downloads/SAF landing, or Share README."
        );
        return m;
    }

    public static File ensureDirsAndReadme(Context context) {
        File base = resolveFilesBase(context);
        resolveOutgoingRoot(context);
        resolveIncomingTempRoot(context);
        resolveAppLandingRoot(context);
        File readme = new File(base, README_NAME);
        try (OutputStreamWriter w = new OutputStreamWriter(
                new FileOutputStream(readme, false), StandardCharsets.UTF_8)) {
            w.write("CWSP Capacitor file storage\n");
            w.write("===========================\n\n");
            w.write("These folders are APP-PRIVATE. Most phone File Managers cannot open them.\n\n");
            w.write("Outgoing temp (Open-with / Share): \n  ");
            w.write(resolveOutgoingRoot(context).getAbsolutePath());
            w.write("\n\nIncoming temp (download unpack): \n  ");
            w.write(resolveIncomingTempRoot(context).getAbsolutePath());
            w.write("\n\nApp landing (when Save = App storage): \n  ");
            w.write(resolveAppLandingRoot(context).getAbsolutePath());
            w.write("\n\nStaging root mode: ");
            w.write(readStagingRoot(context));
            w.write("\nLanding mode: ");
            w.write(readLandingMode(context));
            String saf = readIncomingDir(context);
            if (!saf.isEmpty()) {
                w.write("\nSAF tree URI:\n  ");
                w.write(saf);
            }
            w.write("\n\nIn system Files app: open the sidebar and look for \"CWSP Files\"\n");
            w.write("(DocumentsProvider / SAF). This is NOT under Android/data.\n");
            w.write("Tip: CWSP Settings → Files storage → Browse CWSP Files…\n");
            w.write("Or set Save to Downloads / SAF for folders you can browse normally.\n");
        } catch (Exception e) {
            Log.w(TAG, "readme write failed", e);
        }
        return readme;
    }

    /**
     * Share the README via the system sheet so the user can open it in another
     * app and see absolute paths (workaround for invisible app-private storage).
     */
    public static boolean shareReadme(Context context) {
        if (context == null) return false;
        try {
            File readme = ensureDirsAndReadme(context);
            String authority = context.getPackageName() + ".fileprovider";
            Uri uri = FileProvider.getUriForFile(context, authority, readme);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("text/plain");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.putExtra(Intent.EXTRA_SUBJECT, "CWSP file storage paths");
            send.putExtra(Intent.EXTRA_TEXT, "CWSP app file paths (see attached README).");
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            send.setClipData(ClipData.newRawUri("", uri));
            Intent chooser = Intent.createChooser(send, "Share CWSP files README");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "shareReadme failed", e);
            return false;
        }
    }

    /**
     * Build the canonical landing folder Uri for the current prefs.
     * SAF → document Uri under the persisted tree; Downloads → Downloads tree;
     * else CWSP Files DocumentsProvider landing[/transferId].
     */
    public static Uri buildLandingBrowseUri(Context context, String transferId) {
        if (context == null) return null;
        String mode = readLandingMode(context);
        String saf = readIncomingDir(context);
        try {
            if ("saf".equals(mode) && saf != null && !saf.isEmpty()) {
                Uri tree = Uri.parse(saf);
                String treeDocId = DocumentsContract.getTreeDocumentId(tree);
                return DocumentsContract.buildDocumentUriUsingTree(tree, treeDocId);
            }
            if ("downloads".equals(mode)) {
                // Primary Downloads as a DocumentsContract location when possible.
                Uri tree = Uri.parse(
                        "content://com.android.externalstorage.documents/tree/primary%3ADownload"
                );
                try {
                    String treeDocId = DocumentsContract.getTreeDocumentId(tree);
                    return DocumentsContract.buildDocumentUriUsingTree(tree, treeDocId);
                } catch (Exception ignored) {
                    return tree;
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "buildLandingBrowseUri saf/downloads failed", e);
        }
        String tid = transferId != null ? transferId.trim() : "";
        if (!tid.isEmpty() && !FilesPendingOffers.isSafeTransferId(tid)) {
            String base = new File(tid).getName();
            tid = FilesPendingOffers.isSafeTransferId(base) ? base : "";
        }
        String docId = CwspFilesDocumentsProvider.DOC_ROOT + "/landing";
        if (!tid.isEmpty()) {
            File dir = new File(resolveAppLandingRoot(context), tid);
            if (dir.isDirectory()) {
                docId = CwspFilesDocumentsProvider.DOC_ROOT + "/landing/" + tid;
            }
        }
        return CwspFilesDocumentsProvider.buildDocumentUri(context, docId);
    }

    /**
     * @deprecated Prefer {@link #openLandingFolder}; kept for call sites that
     * need a single Intent. Always returns a chooser-friendly VIEW Intent.
     */
    public static Intent buildOpenLandingIntent(Context context, String transferId) {
        return buildOpenFolderChooserIntent(context, transferId);
    }

    /**
     * Build ACTION_VIEW + createChooser for the landing Uri so the user can
     * pick Material Files / DocumentsUI / Google Files (never a silent no-op).
     * WHY: PendingIntent.getActivity with a package-locked or file:// Intent
     * often resolves at notify time then fails on tap (Android 7+ blocks
     * file://; Material Files UOE on some content shapes).
     */
    public static Intent buildOpenFolderChooserIntent(Context context, String transferId) {
        if (context == null) return null;
        Uri browse = buildLandingBrowseUri(context, transferId);
        if (browse == null) return null;

        Intent view = new Intent(Intent.ACTION_VIEW);
        view.setDataAndType(browse, DocumentsContract.Document.MIME_TYPE_DIR);
        view.addFlags(landingFlags());
        // WHY: grant through ClipData so the chosen app receives persistable access.
        try {
            view.setClipData(ClipData.newUri(context.getContentResolver(), "CWSP", browse));
        } catch (Exception ignored) { /* optional */ }

        java.util.ArrayList<Intent> extras = new java.util.ArrayList<>();
        // Material Files: resource/folder often works on externalstorage trees.
        Intent mf = new Intent(Intent.ACTION_VIEW);
        mf.setDataAndType(browse, "resource/folder");
        mf.setPackage("me.zhanghai.android.files");
        mf.addFlags(landingFlags());
        if (mf.resolveActivity(context.getPackageManager()) != null) extras.add(mf);

        Intent googleFiles = new Intent(Intent.ACTION_VIEW);
        googleFiles.setDataAndType(browse, DocumentsContract.Document.MIME_TYPE_DIR);
        googleFiles.setPackage("com.google.android.apps.nbu.files");
        googleFiles.addFlags(landingFlags());
        if (googleFiles.resolveActivity(context.getPackageManager()) != null) {
            extras.add(googleFiles);
        }

        for (String pkg : new String[] {
                "com.google.android.documentsui", "com.android.documentsui"
        }) {
            Intent docs = new Intent(Intent.ACTION_VIEW);
            docs.setDataAndType(browse, DocumentsContract.Document.MIME_TYPE_DIR);
            docs.setPackage(pkg);
            docs.addFlags(landingFlags());
            if (docs.resolveActivity(context.getPackageManager()) != null) extras.add(docs);
        }

        // Downloads mode: also offer Material Files' dedicated action.
        if ("downloads".equals(readLandingMode(context))) {
            Intent mfDl = new Intent("me.zhanghai.android.files.intent.action.VIEW_DOWNLOADS");
            mfDl.setPackage("me.zhanghai.android.files");
            mfDl.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            if (mfDl.resolveActivity(context.getPackageManager()) != null) extras.add(mfDl);
            Intent sysDl = new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS);
            sysDl.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            if (sysDl.resolveActivity(context.getPackageManager()) != null) extras.add(sysDl);
        }

        Intent chooser = Intent.createChooser(view, "Open folder");
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION
                | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        if (!extras.isEmpty()) {
            chooser.putExtra(
                    Intent.EXTRA_INITIAL_INTENTS,
                    extras.toArray(new Intent[0])
            );
        }
        return chooser;
    }

    private static int landingFlags() {
        return Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_GRANT_READ_URI_PERMISSION
                | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                | Intent.FLAG_GRANT_PREFIX_URI_PERMISSION;
    }

    /**
     * Open the landing folder via system chooser (SAF / Downloads / CWSP Files).
     * @return true if an activity was started
     */
    public static boolean openLandingFolder(Context context, String transferId) {
        if (context == null) return false;
        try {
            Intent chooser = buildOpenFolderChooserIntent(context, transferId);
            if (chooser == null) {
                Log.w(TAG, "openLandingFolder: no browse Uri");
                return false;
            }
            context.startActivity(chooser);
            return true;
        } catch (Throwable t) {
            Log.w(TAG, "openLandingFolder chooser failed", t);
            // Last resort: raw VIEW without chooser.
            try {
                Uri browse = buildLandingBrowseUri(context, transferId);
                if (browse == null) return false;
                Intent view = new Intent(Intent.ACTION_VIEW);
                view.setDataAndType(browse, DocumentsContract.Document.MIME_TYPE_DIR);
                view.addFlags(landingFlags());
                context.startActivity(view);
                return true;
            } catch (Throwable t2) {
                Log.w(TAG, "openLandingFolder fallback failed", t2);
                return false;
            }
        }
    }

    /**
     * Resolve a single landed file for {@code transferId} / optional path hint.
     * WHY: "Open File" needs a concrete File; Accept passes a landing dir,
     * clipboard Download passes an absolute file path.
     */
    public static File resolveLandingFile(Context context, String transferId, String filePathHint) {
        if (filePathHint != null && !filePathHint.trim().isEmpty()) {
            File hinted = new File(filePathHint.trim());
            if (hinted.isFile()) return hinted;
            if (hinted.isDirectory()) {
                File first = firstFileInDir(hinted);
                if (first != null) return first;
            }
        }
        if (context == null) return null;
        String tid = transferId != null ? transferId.trim() : "";
        // Clipboard Download lands under landing/clipboard/ (not clip-<ts>).
        if (tid.isEmpty() || "clipboard".equals(tid) || tid.startsWith("clip-")) {
            File clip = firstFileInDir(new File(resolveAppLandingRoot(context), "clipboard"));
            if (clip != null) return clip;
        }
        if (tid.isEmpty()) return null;
        if (!FilesPendingOffers.isSafeTransferId(tid)) {
            String base = new File(tid).getName();
            if (!FilesPendingOffers.isSafeTransferId(base)) return null;
            tid = base;
        }
        File dir = new File(resolveAppLandingRoot(context), tid);
        return firstFileInDir(dir);
    }

    private static File firstFileInDir(File dir) {
        if (dir == null || !dir.isDirectory()) return null;
        File[] kids = dir.listFiles();
        if (kids == null) return null;
        File best = null;
        for (File kid : kids) {
            if (kid == null || !kid.isFile()) continue;
            String n = kid.getName();
            if (n == null || n.startsWith(".")) continue;
            if ("README.txt".equalsIgnoreCase(n)) continue;
            if (best == null || kid.lastModified() > best.lastModified()) best = kid;
        }
        return best;
    }

    /**
     * Share landed files for a transfer via the system Share sheet.
     * WHY: Cap users need to re-share received CWSP files out of the app.
     */
    public static boolean shareLandingTransfer(Context context, String transferId) {
        if (context == null || transferId == null || transferId.isEmpty()) return false;
        String tid = transferId.trim();
        if (!FilesPendingOffers.isSafeTransferId(tid)) {
            String base = new File(tid).getName();
            if (!FilesPendingOffers.isSafeTransferId(base)) return false;
            tid = base;
        }
        try {
            File dir = new File(resolveAppLandingRoot(context), tid);
            if (!dir.isDirectory()) {
                Log.w(TAG, "shareLanding: missing " + dir);
                return false;
            }
            File[] kids = dir.listFiles();
            if (kids == null || kids.length == 0) return false;
            String authority = context.getPackageName() + ".fileprovider";
            java.util.ArrayList<Uri> uris = new java.util.ArrayList<>();
            File first = null;
            for (File kid : kids) {
                if (!kid.isFile()) continue;
                try {
                    uris.add(FileProvider.getUriForFile(context, authority, kid));
                    if (first == null) first = kid;
                } catch (Exception e) {
                    Log.w(TAG, "FileProvider failed " + kid.getName(), e);
                }
            }
            if (uris.isEmpty() || first == null) return false;
            Intent send;
            if (uris.size() == 1) {
                send = new Intent(Intent.ACTION_SEND);
                send.setType(guessMime(first.getName()));
                send.putExtra(Intent.EXTRA_STREAM, uris.get(0));
                send.setClipData(ClipData.newRawUri("", uris.get(0)));
            } else {
                send = new Intent(Intent.ACTION_SEND_MULTIPLE);
                send.setType("*/*");
                send.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
                ClipData clip = ClipData.newRawUri("", uris.get(0));
                for (int i = 1; i < uris.size(); i++) {
                    clip.addItem(new ClipData.Item(uris.get(i)));
                }
                send.setClipData(clip);
            }
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            Intent chooser = Intent.createChooser(send, "Share CWSP files");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "shareLandingTransfer failed", e);
            return false;
        }
    }

    private static String guessMime(String name) {
        String lower = name != null ? name.toLowerCase() : "";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".txt")) return "text/plain";
        if (lower.endsWith(".zip")) return "application/zip";
        return "application/octet-stream";
    }

    public static void takePersistableTreePermission(Context context, Uri treeUri) {
        if (context == null || treeUri == null) return;
        try {
            final int flags = Intent.FLAG_GRANT_READ_URI_PERMISSION
                    | Intent.FLAG_GRANT_WRITE_URI_PERMISSION;
            context.getContentResolver().takePersistableUriPermission(treeUri, flags);
        } catch (Exception e) {
            Log.w(TAG, "takePersistableUriPermission failed", e);
        }
    }

    public static Intent buildOpenDocumentTreeIntent() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(
                Intent.FLAG_GRANT_READ_URI_PERMISSION
                        | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                        | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                        | Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Prefer starting at Downloads when possible (OEM-dependent).
            intent.putExtra("android.provider.extra.INITIAL_URI", (Uri) null);
        }
        return intent;
    }

    /**
     * Result of landing a single file: app-private path + optional public Uri.
     * WHY: Open File must VIEW the final Downloads/SAF/DocumentsProvider copy
     * (real DISPLAY_NAME), not only the intermediate app-private file.
     */
    public static final class LandedFile {
        public final String appPath;
        public final String contentUri;
        public final String displayName;

        public LandedFile(String appPath, String contentUri, String displayName) {
            this.appPath = appPath;
            this.contentUri = contentUri;
            this.displayName = displayName;
        }
    }

    /**
     * Persist raw bytes into app landing and export to Downloads/SAF per prefs.
     * WHY: clipboard inbound "Download" must save an image without files:offer Accept.
     *
     * @return absolute path of the app-landing file, or null on failure
     */
    public static String saveBytesToLanding(
            Context context,
            byte[] bytes,
            String displayName,
            String mimeType
    ) {
        LandedFile landed = saveBytesToLandingDetailed(context, bytes, displayName, mimeType);
        return landed != null ? landed.appPath : null;
    }

    /**
     * Same as {@link #saveBytesToLanding} but also returns the final public Uri
     * when exported (Downloads/SAF) or DocumentsProvider Uri (CWSP Files mode).
     */
    public static LandedFile saveBytesToLandingDetailed(
            Context context,
            byte[] bytes,
            String displayName,
            String mimeType
    ) {
        if (context == null || bytes == null || bytes.length == 0) return null;
        Context app = context.getApplicationContext();
        try {
            ensureDirsAndReadme(app);
            String name = sanitizeFileName(displayName, mimeType);
            File landDir = new File(resolveAppLandingRoot(app), "clipboard");
            if (!landDir.exists() && !landDir.mkdirs()) {
                Log.w(TAG, "mkdir clipboard landing failed");
                return null;
            }
            File dest = new File(landDir, name);
            try (FileOutputStream fos = new FileOutputStream(dest)) {
                fos.write(bytes);
            }
            Uri publicUri = exportOneFile(app, dest, mimeType, "clipboard");
            Log.i(TAG, "saveBytesToLanding ok path=" + dest.getAbsolutePath()
                    + " size=" + bytes.length
                    + " publicUri=" + (publicUri != null ? publicUri : "app-private"));
            return new LandedFile(
                    dest.getAbsolutePath(),
                    publicUri != null ? publicUri.toString() : null,
                    name
            );
        } catch (Throwable t) {
            Log.w(TAG, "saveBytesToLanding failed", t);
            return null;
        }
    }

    /**
     * Export one app-private landing file to the configured final location.
     * @return public content Uri, or DocumentsProvider Uri for CWSP Files mode
     */
    public static Uri exportOneFile(Context app, File file, String mimeType, String transferId) {
        if (app == null || file == null || !file.isFile()) return null;
        String mode = readLandingMode(app);
        String saf = readIncomingDir(app);
        try {
            if ("downloads".equals(mode)) {
                return exportFileToDownloads(app, file, mimeType);
            }
            if ("saf".equals(mode) && saf != null && !saf.isEmpty()) {
                return exportFileToSaf(app, Uri.parse(saf), file, mimeType);
            }
        } catch (Exception e) {
            Log.w(TAG, "exportOneFile failed " + file.getName(), e);
        }
        // CWSP Files mode (or export failed): DocumentsProvider so DISPLAY_NAME is the basename.
        return buildLandingFileDocumentUri(app, transferId, file.getName());
    }

    /** DocumentsProvider document Uri for a file under landing[/transferId]/name. */
    public static Uri buildLandingFileDocumentUri(Context context, String transferId, String fileName) {
        if (context == null || fileName == null || fileName.isEmpty()) return null;
        String tid = transferId != null ? transferId.trim() : "";
        String docId = CwspFilesDocumentsProvider.DOC_ROOT + "/landing";
        if (!tid.isEmpty()) docId = docId + "/" + tid;
        docId = docId + "/" + fileName;
        return CwspFilesDocumentsProvider.buildDocumentUri(context, docId);
    }

    /**
     * Open the final landed file (public Uri preferred) via ACTION_VIEW chooser.
     * WHY: app-private FileProvider path is an intermediate copy; Downloads/SAF
     * / DocumentsProvider carry the user-facing filename.
     */
    public static boolean openLandingFile(
            Context context,
            String transferId,
            String filePathHint,
            String contentUriHint
    ) {
        if (context == null) return false;
        try {
            // 1) Prefer explicit final content Uri from notifySaved.
            if (contentUriHint != null && !contentUriHint.trim().isEmpty()) {
                if (openContentUri(context, Uri.parse(contentUriHint.trim()), null)) {
                    return true;
                }
            }
            File target = resolveLandingFile(context, transferId, filePathHint);
            if (target == null || !target.isFile()) {
                Log.w(TAG, "openLandingFile: no file transferId=" + transferId
                        + " hint=" + filePathHint);
                return false;
            }
            // 2) Build final Uri for current landing mode (re-export not needed —
            //    DocumentsProvider for app mode; try resolve Downloads by name).
            Uri finalUri = resolveFinalOpenUri(context, transferId, target);
            if (finalUri != null && openContentUri(context, finalUri, target.getName())) {
                return true;
            }
            // 3) Last resort: FileProvider on app-private copy (still uses basename).
            String authority = context.getPackageName() + ".fileprovider";
            Uri uri = FileProvider.getUriForFile(context, authority, target);
            return openContentUri(context, uri, target.getName());
        } catch (Throwable t) {
            Log.w(TAG, "openLandingFile failed", t);
            return false;
        }
    }

    /** Compat overload — no content Uri hint. */
    public static boolean openLandingFile(Context context, String transferId, String filePathHint) {
        return openLandingFile(context, transferId, filePathHint, null);
    }

    private static Uri resolveFinalOpenUri(Context context, String transferId, File target) {
        if (target == null) return null;
        String mode = readLandingMode(context);
        String tid = transferId != null ? transferId.trim() : "";
        if (tid.isEmpty()) {
            // Infer clipboard landing.
            File clip = new File(resolveAppLandingRoot(context), "clipboard");
            try {
                if (target.getCanonicalPath().startsWith(clip.getCanonicalPath())) {
                    tid = "clipboard";
                }
            } catch (Exception ignored) {
                if (target.getAbsolutePath().contains("/landing/clipboard/")) tid = "clipboard";
            }
        }
        if ("downloads".equals(mode) || "saf".equals(mode)) {
            // Prefer DocumentsProvider only when still in app mode; for downloads/saf
            // the notify path should have passed EXTRA_CONTENT_URI. Fallback: FileProvider.
            return null;
        }
        return buildLandingFileDocumentUri(context, tid, target.getName());
    }

    private static boolean openContentUri(Context context, Uri uri, String displayName) {
        if (uri == null) return false;
        try {
            String mime = null;
            try {
                mime = context.getContentResolver().getType(uri);
            } catch (Exception ignored) { /* */ }
            if (mime == null || mime.isEmpty()) {
                String name = displayName != null ? displayName : uri.getLastPathSegment();
                mime = guessMime(name);
            }
            Intent view = new Intent(Intent.ACTION_VIEW);
            view.setDataAndType(uri, mime);
            view.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            try {
                String label = displayName != null ? displayName
                        : (uri.getLastPathSegment() != null ? uri.getLastPathSegment() : "CWSP file");
                view.setClipData(ClipData.newUri(context.getContentResolver(), label, uri));
            } catch (Exception ignored) { /* optional */ }
            Intent chooser = Intent.createChooser(view, "Open File");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            context.startActivity(chooser);
            Log.i(TAG, "openContentUri ok uri=" + uri + " mime=" + mime + " name=" + displayName);
            return true;
        } catch (Throwable t) {
            Log.w(TAG, "openContentUri failed uri=" + uri, t);
            return false;
        }
    }

    private static String sanitizeFileName(String displayName, String mimeType) {
        String base = displayName != null ? new File(displayName).getName().trim() : "";
        if (base.isEmpty() || ".".equals(base) || "..".equals(base)) {
            String ext = extFromMime(mimeType);
            base = "cwsp-image-" + System.currentTimeMillis() + "." + ext;
        }
        StringBuilder sb = new StringBuilder(base.length());
        for (int i = 0; i < base.length(); i++) {
            char c = base.charAt(i);
            if (c < 32 || "/\\:*?\"<>|".indexOf(c) >= 0) sb.append('_');
            else sb.append(c);
        }
        String out = sb.toString().trim();
        return out.isEmpty() ? ("cwsp-image-" + System.currentTimeMillis() + ".bin") : out;
    }

    private static String extFromMime(String mime) {
        String m = mime != null ? mime.toLowerCase() : "";
        if (m.contains("png")) return "png";
        if (m.contains("jpeg") || m.contains("jpg")) return "jpg";
        if (m.contains("webp")) return "webp";
        if (m.contains("gif")) return "gif";
        if (m.startsWith("image/")) return "img";
        return "bin";
    }

    /** @return MediaStore Downloads Uri after write */
    private static Uri exportFileToDownloads(Context app, File file, String mimeType) throws Exception {
        String name = file.getName();
        String mime = mimeType != null && !mimeType.isEmpty() ? mimeType : "application/octet-stream";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, name);
            values.put(MediaStore.Downloads.MIME_TYPE, mime);
            values.put(MediaStore.Downloads.IS_PENDING, 1);
            ContentResolver cr = app.getContentResolver();
            Uri uri = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new Exception("MediaStore insert failed");
            try (OutputStream os = cr.openOutputStream(uri);
                 InputStream is = new FileInputStream(file)) {
                if (os == null) throw new Exception("openOutputStream null");
                copyStream(is, os);
            }
            values.clear();
            values.put(MediaStore.Downloads.IS_PENDING, 0);
            cr.update(uri, values, null, null);
            return uri;
        }
        File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        if (!dir.exists()) dir.mkdirs();
        File dest = new File(dir, name);
        try (InputStream is = new FileInputStream(file);
             OutputStream os = new FileOutputStream(dest)) {
            copyStream(is, os);
        }
        return Uri.fromFile(dest);
    }

    /** @return SAF document Uri after create+write */
    private static Uri exportFileToSaf(Context app, Uri treeUri, File file, String mimeType)
            throws Exception {
        ContentResolver cr = app.getContentResolver();
        String docId = DocumentsContract.getTreeDocumentId(treeUri);
        Uri parent = DocumentsContract.buildDocumentUriUsingTree(treeUri, docId);
        String mime = mimeType != null && !mimeType.isEmpty() ? mimeType : "application/octet-stream";
        Uri child = DocumentsContract.createDocument(cr, parent, mime, file.getName());
        if (child == null) throw new Exception("createDocument failed");
        try (OutputStream os = cr.openOutputStream(child);
             InputStream is = new FileInputStream(file)) {
            if (os == null) throw new Exception("SAF openOutputStream null");
            copyStream(is, os);
        }
        return child;
    }

    private static void copyStream(InputStream is, OutputStream os) throws Exception {
        byte[] buf = new byte[64 * 1024];
        int n;
        while ((n = is.read(buf)) > 0) os.write(buf, 0, n);
        os.flush();
    }

    private static SharedPreferences prefs(Context context) {
        return context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
