/*
 * Filename: Overlay.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/core/Overlay.java
 * Change date and time: 18.35.00_10.07.2026
 * Reason for changes: SYSTEM_ALERT_WINDOW helpers + minimal floating indicator.
 *
 * NOTE: Overlay is optional for share-target / context-menu clipboard paths;
 * it mainly helps background clipboard-read visibility on restricted OEMs.
 */

package core;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

/**
 * AirPad / clipboard floating overlay controller.
 */
public class Overlay {
    private static final String TAG = "core.Overlay";

    private View overlayView;
    private WindowManager windowManager;
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

    public synchronized void show(Context context) {
        if (context == null) return;
        if (!canDrawOverlays(context)) {
            Log.i(TAG, "show skipped — overlay permission missing");
            return;
        }
        if (visible && overlayView != null) return;

        Context app = context.getApplicationContext();
        windowManager = (WindowManager) app.getSystemService(Context.WINDOW_SERVICE);
        if (windowManager == null) return;

        TextView tv = new TextView(app);
        tv.setText("CWSP");
        tv.setTextColor(Color.WHITE);
        tv.setPadding(24, 12, 24, 12);
        tv.setBackgroundColor(0xCC1B1B1F);
        tv.setContentDescription("CWSP bridge overlay");

        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                type,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT
        );
        lp.gravity = Gravity.TOP | Gravity.END;
        lp.x = 24;
        lp.y = 120;

        try {
            windowManager.addView(tv, lp);
            overlayView = tv;
            visible = true;
            Log.i(TAG, "overlay shown");
        } catch (Exception e) {
            Log.e(TAG, "overlay show failed", e);
            visible = false;
            overlayView = null;
        }
    }

    public synchronized void hide() {
        if (windowManager != null && overlayView != null) {
            try {
                windowManager.removeView(overlayView);
            } catch (Exception e) {
                Log.w(TAG, "overlay hide failed", e);
            }
        }
        overlayView = null;
        visible = false;
    }

    public boolean isVisible() {
        return visible;
    }
}
