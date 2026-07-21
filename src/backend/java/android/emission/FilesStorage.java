/*
 * Filename: FilesStorage.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesStorage.java
 * Change date and time: 18.00.00_21.07.2026
 * Reason for changes: Capacitor files landing (app/Downloads/SAF) + staging root
 *   (app/cache/external). App-private dirs are invisible in system Files — this
 *   helper exposes paths, ensures dirs, writes a README, and shares it via
 *   FileProvider so the user can locate CWSP file storage.
 *
 * INVARIANT: staging is always under an app-owned directory first; SAF/Downloads
 * are landing/export targets only (never the Open-with wire source).
 */
package emission;

import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
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

    private static SharedPreferences prefs(Context context) {
        return context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
