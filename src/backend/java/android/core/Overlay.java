/*
 * Filename: Overlay.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/core/Overlay.java
 * Change date and time: 20.45.00_10.07.2026
 * Reason for changes: Permanent SYSTEM_ALERT_WINDOW "CWSP" bubble removed.
 *
 * NOTE: canDrawOverlays / openOverlaySettings remain for Settings UI compatibility.
 * Share target uses ShareActivity translucent overlay instead.
 */

package core;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

/**
 * Overlay permission helpers. Permanent floating indicator is intentionally disabled.
 */
public class Overlay {
    private static final String TAG = "core.Overlay";

    private boolean visible = false;

    public static boolean canDrawOverlays(Context context) {
        if (context == null) return false;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return true;
        return Settings.canDrawOverlays(context.getApplicationContext());
    }

    public static void openOverlaySettings(Activity activity) {
        if (activity == null) return;
        try {
            Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + activity.getPackageName())
            );
            activity.startActivity(intent);
        } catch (Exception e) {
            Log.w(TAG, "openOverlaySettings failed", e);
            try {
                activity.startActivity(new Intent(Settings.ACTION_SETTINGS));
            } catch (Exception ignored) {
                /* best-effort */
            }
        }
    }

    /** No-op: permanent floating "CWSP" bubble removed. */
    public synchronized void show(Context context) {
        Log.i(TAG, "show skipped — permanent overlay disabled");
        visible = false;
    }

    public synchronized void hide() {
        visible = false;
    }

    public boolean isVisible() {
        return visible;
    }
}
