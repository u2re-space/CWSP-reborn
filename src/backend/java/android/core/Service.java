/*
 * Filename: Service.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/core/Service.java
 * Change date and time: 18.35.00_10.07.2026
 * Reason for changes: Controller for CwspBridgeService foreground daemon.
 */

package core;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.core.content.ContextCompat;

import space.u2re.cwsp.CwspBridgeService;

/**
 * Starts/stops the CWSP foreground bridge service (clipboard watch + keepalive).
 */
public class Service {
    private static final String TAG = "core.Service";

    public synchronized void start(Context context) {
        if (context == null) return;
        Intent intent = new Intent(context.getApplicationContext(), CwspBridgeService.class);
        ContextCompat.startForegroundService(context.getApplicationContext(), intent);
        Log.i(TAG, "startForegroundService requested");
    }

    public synchronized void stop(Context context) {
        if (context == null) return;
        Intent intent = new Intent(context.getApplicationContext(), CwspBridgeService.class);
        context.getApplicationContext().stopService(intent);
        Log.i(TAG, "stopService requested");
    }

    public synchronized boolean isRunning() {
        return CwspBridgeService.isRunning();
    }
}
