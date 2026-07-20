/*
 * Filename: ControlPairUi.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlPairUi.java
 * Change date and time: 19.42.00_20.07.2026
 * Reason for changes: Heads-up Accept/Deny for Control pairing (+ Activity fallback).
 */

package space.u2re.cwsp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

/**
 * Surfaces Control pair confirmation to the user without exposing the ecosystem token.
 */
public final class ControlPairUi {
    private static final String TAG = "ControlPairUi";

    public static final String CHANNEL_ID = "cwsp_control_pair";
    public static final String ACTION_ACCEPT = "space.u2re.cwsp.CONTROL_PAIR_ACCEPT";
    public static final String ACTION_DENY = "space.u2re.cwsp.CONTROL_PAIR_DENY";
    public static final String EXTRA_PAIR_ID = "cwsp.pairId";

    private static final int NOTIF_BASE = 8500;

    private ControlPairUi() {}

    public static void prompt(Context context, ControlPairStore.PairRequest req) {
        if (context == null || req == null) return;
        Context app = context.getApplicationContext();
        ensureChannel(app);

        NotificationManager nm = (NotificationManager) app.getSystemService(Context.NOTIFICATION_SERVICE);
        boolean notifOk = nm != null
                && (Build.VERSION.SDK_INT < 24 || nm.areNotificationsEnabled());

        String title = "CWSP — Allow Control?";
        // pairCode = short Accept label (deviceCode already verified at pair/begin).
        String text = "Pair " + req.pairCode + " · " + originHost(req.origin);

        if (notifOk) {
            NotificationCompat.Builder b = new NotificationCompat.Builder(app, CHANNEL_ID)
                    .setContentTitle(title)
                    .setContentText(text)
                    .setStyle(new NotificationCompat.BigTextStyle()
                            .bigText(text + "\nAccept only if you opened the official CWSP Control page."))
                    .setSmallIcon(android.R.drawable.ic_lock_lock)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                    .setDefaults(NotificationCompat.DEFAULT_ALL)
                    .setOnlyAlertOnce(false)
                    .setAutoCancel(false)
                    .setTimeoutAfter(ControlPairStore.PAIR_TTL_MS)
                    .addAction(0, "Accept", activityAction(app, ACTION_ACCEPT, req.pairId, 1))
                    .addAction(0, "Deny", activityAction(app, ACTION_DENY, req.pairId, 2))
                    .setContentIntent(activityAction(app, ACTION_ACCEPT, req.pairId, 0));
            try {
                nm.notify(notifId(req.pairId), b.build());
                Log.i(TAG, "pair notification posted code=" + req.pairCode);
            } catch (Exception e) {
                Log.w(TAG, "pair notification failed — launching Activity", e);
                notifOk = false;
            }
        }

        if (!notifOk) {
            // WHY: notifications disabled → still require explicit Accept via Activity.
            try {
                Intent i = new Intent(app, ControlPairActivity.class);
                i.setAction(ACTION_ACCEPT);
                i.putExtra(EXTRA_PAIR_ID, req.pairId);
                i.putExtra("cwsp.promptUi", true);
                i.putExtra("cwsp.pairCode", req.pairCode);
                i.putExtra("cwsp.origin", req.origin);
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_CLEAR_TOP
                        | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                app.startActivity(i);
            } catch (Exception e) {
                Log.e(TAG, "pair Activity fallback failed", e);
            }
        }
    }

    public static void dismiss(String pairId) {
        // Best-effort; Context may be unavailable from store timeout — use app via service.
        Context ctx = CwspBridgeService.appContextOrNull();
        if (ctx == null || pairId == null) return;
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            try {
                nm.cancel(notifId(pairId));
            } catch (Exception ignored) {
                /* ignore */
            }
        }
    }

    public static void handleAction(Context context, String action, String pairId) {
        if (pairId == null || pairId.isBlank()) return;
        boolean ok = false;
        if (ACTION_ACCEPT.equals(action)) {
            ok = ControlPairStore.accept(pairId);
        } else if (ACTION_DENY.equals(action)) {
            ok = ControlPairStore.deny(pairId);
        }
        dismiss(pairId);
        Log.i(TAG, "pair action=" + action + " id=" + pairId + " ok=" + ok);
    }

    private static PendingIntent activityAction(Context app, String action, String pairId, int code) {
        Intent i = new Intent(app, ControlPairActivity.class);
        i.setAction(action);
        i.putExtra(EXTRA_PAIR_ID, pairId);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_NO_ANIMATION
                | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        return PendingIntent.getActivity(
                app,
                code + Math.abs(pairId.hashCode() % 1000),
                i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static int notifId(String pairId) {
        return NOTIF_BASE + Math.abs(pairId.hashCode() % 1000);
    }

    private static String originHost(String origin) {
        if (origin == null) return "(unknown)";
        try {
            String s = origin.trim();
            int scheme = s.indexOf("://");
            if (scheme >= 0) s = s.substring(scheme + 3);
            int slash = s.indexOf('/');
            if (slash >= 0) s = s.substring(0, slash);
            return s.isEmpty() ? origin : s;
        } catch (Exception e) {
            return origin;
        }
    }

    private static void ensureChannel(Context app) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) app.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID,
                "CWSP Control pairing",
                NotificationManager.IMPORTANCE_HIGH
        );
        ch.setDescription("Confirm Control SPA access (Accept / Deny)");
        ch.enableVibration(true);
        ch.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        nm.createNotificationChannel(ch);
    }
}
