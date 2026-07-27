/*
 * Filename: FilesAcceptService.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/FilesAcceptService.java
 * Change date and time: 19.55.00_21.07.2026
 * Reason for changes: Accept via BroadcastReceiver goAsync was killed mid-transfer
 *   (Android ~10s goAsync budget) leaving the notif stuck on "Accepting…".
 *   Run Accept in a short-lived FGS so embed decode / HTTP pull can finish.
 *
 * INVARIANT: exported=false; stops itself after accept completes or fails.
 */
package space.u2re.cwsp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import emission.FilesAcceptRunner;
import emission.FilesOutgoingNotifier;

/**
 * Foreground Accept worker — keeps process alive past goAsync limits.
 */
public class FilesAcceptService extends Service {
    private static final String TAG = "FilesAcceptService";
    public static final String ACTION_RUN_ACCEPT = "space.u2re.cwsp.FILES_RUN_ACCEPT";
    private static final String CHANNEL_ID = "cwsp-files-accept-work";
    private static final int NOTIF_ID = 0xC5FA;

    public static void startAccept(Context context, String transferId) {
        if (context == null) return;
        Intent i = new Intent(context, FilesAcceptService.class);
        i.setAction(ACTION_RUN_ACCEPT);
        if (transferId != null) {
            i.putExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID, transferId);
        }
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(i);
            } else {
                context.startService(i);
            }
        } catch (Throwable t) {
            Log.w(TAG, "startAccept failed — falling back to inline runner", t);
            // WHY: if FGS start is blocked, still try Accept so L-196 is not stuck.
            new Thread(() -> FilesAcceptRunner.accept(context.getApplicationContext(), transferId),
                    "cwsp-files-accept-fallback").start();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String tid = intent != null
                ? intent.getStringExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID)
                : null;
        ensureChannel();
        Notification n = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setContentTitle("CWSP Files")
                .setContentText("Accepting transfer…")
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
        try {
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } else {
                startForeground(NOTIF_ID, n);
            }
        } catch (Throwable t) {
            Log.w(TAG, "startForeground failed", t);
            try { startForeground(NOTIF_ID, n); } catch (Throwable ignored) { /* */ }
        }
        final String transferId = tid;
        new Thread(() -> {
            try {
                FilesAcceptRunner.accept(getApplicationContext(), transferId);
            } catch (Throwable t) {
                Log.w(TAG, "accept failed", t);
                try {
                    FilesAcceptRunner.notifyFailPublic(getApplicationContext(), transferId,
                            String.valueOf(t.getMessage()));
                } catch (Throwable ignored) { /* */ }
            } finally {
                try { stopForeground(true); } catch (Throwable ignored) { /* */ }
                stopSelf(startId);
            }
        }, "cwsp-files-accept-svc").start();
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm == null || nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID, "CWSP Files Transfer", NotificationManager.IMPORTANCE_LOW);
        ch.setDescription("Foreground work while accepting a files transfer");
        nm.createNotificationChannel(ch);
    }
}
