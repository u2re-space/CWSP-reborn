/*
 * Filename: FilesAccessPermissions.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesAccessPermissions.java
 * Change date and time: 18.15.00_21.07.2026
 * Reason for changes: Capacitor file-access permission status + intents.
 *   Runtime: READ_MEDIA_* (API 33+) / READ_EXTERNAL_STORAGE (≤32).
 *   Special: MANAGE_EXTERNAL_STORAGE via system settings page (all-files access).
 *   Refs: https://developer.android.com/training/data-storage/manage-all-files
 *         https://developer.android.com/guide/topics/permissions/overview
 *         https://developer.android.com/reference/android/Manifest.permission
 *
 * NOTE: All-files access still cannot browse other apps' Android/data private
 * dirs. Our own tree stays on DocumentsProvider ("CWSP Files").
 */
package emission;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Helpers for CWSP Capacitor shared-storage / all-files permission UX. */
public final class FilesAccessPermissions {
    private FilesAccessPermissions() { /* no instances */ }

    /** Runtime permissions to request for media / legacy shared storage. */
    public static String[] runtimePermissionsNeeded() {
        if (Build.VERSION.SDK_INT >= 33) {
            return new String[] {
                    Manifest.permission.READ_MEDIA_IMAGES,
                    Manifest.permission.READ_MEDIA_VIDEO,
                    Manifest.permission.READ_MEDIA_AUDIO
            };
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return new String[] { Manifest.permission.READ_EXTERNAL_STORAGE };
        }
        return new String[0];
    }

    public static List<String> missingRuntime(Context context) {
        List<String> missing = new ArrayList<>();
        if (context == null) return missing;
        for (String p : runtimePermissionsNeeded()) {
            if (ContextCompat.checkSelfPermission(context, p) != PackageManager.PERMISSION_GRANTED) {
                missing.add(p);
            }
        }
        return missing;
    }

    public static boolean hasAllRuntime(Context context) {
        return missingRuntime(context).isEmpty();
    }

    /**
     * Whether the user granted all-files access (API 30+).
     * @see Environment#isExternalStorageManager()
     */
    public static boolean isExternalStorageManager(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            // Pre-R: WRITE/READ external covered shared storage more broadly.
            return hasAllRuntime(context);
        }
        try {
            return Environment.isExternalStorageManager();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Intent to the per-app "Allow access to manage all files" page.
     * Prefer {@link Settings#ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION}.
     */
    public static Intent buildManageAllFilesIntent(Context context) {
        if (context == null) return null;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            Intent legacy = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            legacy.setData(Uri.fromParts("package", context.getPackageName(), null));
            legacy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            return legacy;
        }
        try {
            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            intent.setData(Uri.parse("package:" + context.getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            return intent;
        } catch (Exception e) {
            Intent fallback = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
            fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            return fallback;
        }
    }

    public static Map<String, Object> statusMap(Context context) {
        Map<String, Object> m = new LinkedHashMap<>();
        boolean runtimeOk = hasAllRuntime(context);
        boolean allFiles = isExternalStorageManager(context);
        List<String> missing = missingRuntime(context);
        m.put("runtimeGranted", runtimeOk);
        m.put("allFilesAccess", allFiles);
        m.put("sdkInt", Build.VERSION.SDK_INT);
        m.put("missingRuntime", String.join(",", missing));
        m.put(
                "note",
                allFiles
                        ? "All-files access granted (shared storage). Own app tree: Files → CWSP Files."
                        : "Grant media/storage runtime and/or Allow manage all files in system settings. "
                                + "All-files still cannot open other apps' Android/data; use CWSP Files provider for ours."
        );
        return m;
    }

    public static boolean openManageAllFilesSettings(Context context, Activity activity) {
        Intent intent = buildManageAllFilesIntent(context);
        if (intent == null) return false;
        try {
            if (activity != null) {
                activity.startActivity(intent);
            } else if (context != null) {
                context.startActivity(intent);
            } else {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
