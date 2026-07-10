/*
 * Filename: CwspBridgeService.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwspBridgeService.java
 * Change date and time: 18.45.00_10.07.2026
 * Reason for changes: Clipboard watch + CwspWsClient /ws keepalive fan-out.
 */

package space.u2re.cwsp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import core.Configure;
import core.Coordinator;
import core.Settings;
import emission.Clipboard;

/**
 * CWSP foreground service: OS clipboard watch + native /ws keepalive.
 */
public class CwspBridgeService extends Service {
    private static final String TAG = "CwspBridgeService";
    public static final String CHANNEL_ID = "cwsp_bridge";
    public static final int NOTIFICATION_ID = 8434;

    private static volatile boolean running = false;
    private static volatile CwspWsClient sharedWs;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private Clipboard clipboard;
    private Coordinator coordinator;
    private CwspWsClient wsClient;
    private String lastSeen = "";

    private final Runnable watchLoop = new Runnable() {
        @Override
        public void run() {
            if (!running) return;
            try {
                if (clipboard != null) {
                    String text = clipboard.read();
                    if (text != null && !text.equals(lastSeen)) {
                        String previous = lastSeen;
                        lastSeen = text;
                        Log.d(TAG, "clipboard changed len=" + text.length());
                        // Fan-out when WS is up; skip empty clears that match prior empty.
                        if (wsClient != null && wsClient.isOpen() && !text.isEmpty()) {
                            String clientId = Configure.readClientId(getApplicationContext());
                            boolean sent = wsClient.sendClipboardUpdate(text, clientId);
                            Log.d(TAG, "clipboard:update sent=" + sent + " prevLen="
                                    + (previous != null ? previous.length() : 0));
                        }
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "clipboard watch tick failed", e);
            }
            handler.postDelayed(this, 1500L);
        }
    };

    public static boolean isRunning() {
        return running;
    }

    public static boolean isWsOpen() {
        CwspWsClient ws = sharedWs;
        return ws != null && ws.isOpen();
    }

    /** Soft-reconnect after settings/token patch while the service is already running. */
    public static void requestReconnect(Context context) {
        try {
            Intent i = new Intent(context, CwspBridgeService.class);
            i.setAction("space.u2re.cwsp.RECONNECT");
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(i);
            } else {
                context.startService(i);
            }
        } catch (Exception e) {
            Log.w(TAG, "requestReconnect failed", e);
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        ensureChannel();
        Context ctx = getApplicationContext();
        clipboard = new Clipboard(ctx);
        Settings settings = new Settings(ctx);
        coordinator = new Coordinator(settings, clipboard);
        wsClient = new CwspWsClient(ctx, coordinator);
        sharedWs = wsClient;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        running = true;
        Notification notification = buildNotification();
        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            );
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
        handler.removeCallbacks(watchLoop);
        handler.post(watchLoop);
        boolean reconnect = intent != null
                && "space.u2re.cwsp.RECONNECT".equals(intent.getAction());
        if (wsClient != null) {
            // WHY: connectNow() already replaces any open socket; avoid disconnect()+connect()
            // race that would cancel the pending connect via removeCallbacksAndMessages.
            if (wsClient.isConfigured()) {
                wsClient.connect();
            } else {
                Log.i(TAG, "WS skip: missing endpoint/clientId/token");
            }
        }
        Log.i(TAG, "started reconnect=" + reconnect);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        running = false;
        handler.removeCallbacks(watchLoop);
        if (wsClient != null) {
            wsClient.disconnect();
        }
        if (sharedWs == wsClient) {
            sharedWs = null;
        }
        Log.i(TAG, "stopped");
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID,
                "CWSP Bridge",
                NotificationManager.IMPORTANCE_LOW
        );
        ch.setDescription("Clipboard sync and CWSP bridge keepalive");
        nm.createNotificationChannel(ch);
    }

    private Notification buildNotification() {
        Intent launch = new Intent(this, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(
                this,
                0,
                launch,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        String status = (wsClient != null && wsClient.isOpen()) ? "WS connected" : "clipboard watch";
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("CWSP")
                .setContentText("Bridge active — " + status)
                .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                .setContentIntent(pi)
                .setOngoing(true)
                .build();
    }
}
