/*
 * Filename: CwspBridgeService.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwspBridgeService.java
 * Change date and time: 19.25.00_14.07.2026
 * Reason for changes: Fix inbound Accept applying stale OS clipboard — snapshot held
 *   text, ignore older superseding packets, force-write + lastSeen, and route
 *   Accept/Undo/Share/Erase through a foreground Activity trampoline (Android 10+
 *   denies setPrimaryClip from background BroadcastReceiver).
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

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * CWSP foreground service: OS clipboard watch + native /ws keepalive.
 */
public class CwspBridgeService extends Service {
    private static final String TAG = "CwspBridgeService";
    public static final String CHANNEL_ID = "cwsp_bridge";
    public static final int NOTIFICATION_ID = 8434;

    // WHY: phase-2 clipboard prompt notifications live on a separate, user-visible
    // channel (IMPORTANCE_DEFAULT) so Accept/Dismiss/Undo/Share/Erase actions are
    // surfaced without interfering with the low-importance bridge keepalive.
    public static final String PROMPT_CHANNEL_ID = "cwsp_clipboard_prompt";
    public static final int PROMPT_NOTIF_ID_INBOUND = 8435;
    public static final int PROMPT_NOTIF_ID_OUTBOUND = 8436;

    // PendingIntent broadcast actions consumed by ClipboardPromptReceiver.
    public static final String ACTION_ACCEPT = "space.u2re.cwsp.CLIPBOARD_ACCEPT";
    public static final String ACTION_DISMISS = "space.u2re.cwsp.CLIPBOARD_DISMISS";
    public static final String ACTION_UNDO = "space.u2re.cwsp.CLIPBOARD_UNDO";
    public static final String ACTION_SHARE = "space.u2re.cwsp.CLIPBOARD_SHARE";
    public static final String ACTION_ERASE = "space.u2re.cwsp.CLIPBOARD_ERASE";
    public static final String EXTRA_DIRECTION = "cwsp.direction";

    private static volatile boolean running = false;
    private static volatile CwspWsClient sharedWs;
    /** Suppress text watch fan-out after image/asset share (avoids coerceToText echo). */
    private static volatile long suppressTextWatchUntilMs = 0L;

    // WHY: service instance + held prompt slots are static so ClipboardPromptReceiver
    // (manifest-registered, triggered by notification PendingIntents) can reach the
    // live coordinator/clipboard without binding. Lost on process death (acceptable
    // for this pass — a killed process drops the held payload along with the notif).
    private static volatile CwspBridgeService instance = null;
    private static volatile PromptHold inboundHold = null;
    private static volatile PromptHold outboundHold = null;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private Clipboard clipboard;
    private Coordinator coordinator;
    private CwspWsClient wsClient;
    private String lastSeen = "";

    // WHY: auto-dismiss the held prompt after shell.clipboardPromptDismissMs —
    // treats the timeout as Dismiss so a forgotten prompt never applies/sends.
    private final Runnable inboundAutoDismiss = () -> doDismissInbound("timeout");
    private final Runnable outboundAutoDismiss = () -> doDismissOutbound("timeout");

    private final Runnable watchLoop = new Runnable() {
        @Override
        public void run() {
            if (!running) return;
            try {
                if (clipboard != null
                        && System.currentTimeMillis() >= suppressTextWatchUntilMs) {
                    String text = clipboard.read();
                    if (text != null && !text.equals(lastSeen)) {
                        String previous = lastSeen;
                        lastSeen = text;
                        Log.d(TAG, "clipboard changed len=" + text.length());
                        // Fan-out when WS is up; skip empty clears that match prior empty.
                        if (wsClient != null && wsClient.isOpen() && !text.isEmpty()) {
                            String clientId = Configure.readClientId(getApplicationContext());
                            // WHY: phase-2 — outbound mode gates fan-out through a prompt.
                            routeOutboundClipboard(text, clientId, previous);
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

    /** Live /ws client for share-target overlay (may be null before service onCreate). */
    public static CwspWsClient getSharedWs() {
        return sharedWs;
    }

    /**
     * After image share, pause text watch so image ClipData is not coerced and sent as text.
     */
    public static void suppressTextWatch(long durationMs) {
        long until = System.currentTimeMillis() + Math.max(0L, durationMs);
        if (until > suppressTextWatchUntilMs) {
            suppressTextWatchUntilMs = until;
        }
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

        if (sharedWs != null) {
            try {
                // WHY: always soft-replace so endpoint/token patches take effect on an open socket.
                sharedWs.reconnectNow();
                if (!sharedWs.waitUntilConnected(5000L)) {
                    Log.w(TAG, "WS not connected — reconnect still pending");
                }
            } catch (Exception e) {
                Log.w(TAG, "requestReconnect connect failed", e);
            }
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        ensureChannel();
        ensurePromptChannel();
        Context ctx = getApplicationContext();
        clipboard = new Clipboard(ctx);
        Settings settings = new Settings(ctx);
        coordinator = new Coordinator(settings, clipboard);
        if (wsClient == null) {
            wsClient = new CwspWsClient(ctx, coordinator);
        }
        if (sharedWs == null) {
            sharedWs = wsClient;
            sharedWs.connectIfNotOpen();
        }   
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
            if (wsClient.isConfigured()) {
                // WHY: RECONNECT must replace an already-open socket (new endpoint/token).
                if (reconnect) {
                    wsClient.reconnectNow();
                } else {
                    wsClient.connect();
                }
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
        handler.removeCallbacks(inboundAutoDismiss);
        handler.removeCallbacks(outboundAutoDismiss);
        if (instance == this) instance = null;
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

    // ---- phase-2 clipboard prompt notifications ----
    //
    // Inbound (CwspWsClient → routeInbound → routeInboundClipboard):
    //   ask : hold the apply; post Accept/Dismiss; auto-dismiss → Dismiss.
    //   auto: apply now; post Undo (if shell.clipboardInboundShowUndo).
    // Outbound (watchLoop → routeOutboundClipboard):
    //   ask : hold the fan-out; post Share/Dismiss; auto-dismiss → Dismiss.
    //   auto: send now; post Erase (if shell.clipboardOutboundShowErase).
    //
    // INVARIANT: only clipboard:update/write/airpad:clipboard:write/delivery are
    // gated; read/get/isReady/clear still dispatch immediately (no prompt).
    // The Node hub owns the canonical prompt state; this is the Android-local parity
    // hold so prompts survive WS reconnects within a single process lifetime.

    /** Live service instance (null when stopped). */
    public static CwspBridgeService instance() {
        return instance;
    }

    /**
     * Entry point for inbound clipboard packets — called from CwspWsClient instead
     * of a direct {@link Coordinator#dispatch} so the prompt policy can hold/apply.
     * Falls back to immediate dispatch when the service is not alive (phase-1 path).
     */
    public static void routeInbound(Context context, Map<String, Object> packet, Coordinator fallback) {
        CwspBridgeService svc = instance;
        if (svc != null) {
            svc.routeInboundClipboard(packet);
        } else if (fallback != null) {
            fallback.dispatch(packet);
        }
    }

    private void routeInboundClipboard(Map<String, Object> packet) {
        if (packet == null || coordinator == null) return;
        String what = String.valueOf(packet.getOrDefault("what", packet.getOrDefault("type", "")));
        if (!isApplyAction(what)) {
            // read/get/isReady/clear — never prompt, dispatch now (phase-1 behavior).
            coordinator.dispatch(packet);
            return;
        }
        String mode = Configure.readClipboardInboundMode(getApplicationContext());
        String previousText = safeReadClipboard();
        if ("ask".equals(mode)) {
            long packetTs = packetTimestamp(packet);
            PromptHold current = inboundHold;
            // WHY: delayed/retry of an older clipboard:update must not replace a newer hold —
            // Accept would then write the earlier text (user-reported stale Accept).
            if (current != null && current.packetTs > 0L && packetTs > 0L && packetTs < current.packetTs) {
                Log.d(TAG, "inbound ask ignored older packet ts=" + packetTs + " holdTs=" + current.packetTs);
                return;
            }
            String heldText = extractHeldText(packet);
            // WHY: deep-copy so later WS parse mutations cannot corrupt the held apply payload.
            inboundHold = new PromptHold("inbound", deepCopyMap(packet), heldText, previousText, packetTs);
            handler.removeCallbacks(inboundAutoDismiss);
            handler.postDelayed(inboundAutoDismiss, Configure.readClipboardPromptDismissMs(getApplicationContext()));
            postInboundAskNotification();
            Log.d(TAG, "inbound clipboard held (ask) heldLen="
                    + (heldText != null ? heldText.length() : 0)
                    + " prevLen=" + (previousText != null ? previousText.length() : 0));
        } else {
            try {
                coordinator.dispatch(packet);
            } catch (Exception e) {
                Log.w(TAG, "inbound auto dispatch failed", e);
            }
            if (Configure.readClipboardInboundShowUndo(getApplicationContext())
                    && previousText != null && !previousText.isEmpty()) {
                inboundHold = new PromptHold("inbound", null, null, previousText, packetTimestamp(packet));
                handler.removeCallbacks(inboundAutoDismiss);
                handler.postDelayed(inboundAutoDismiss, Configure.readClipboardPromptDismissMs(getApplicationContext()));
                postInboundAutoUndoNotification();
            }
        }
    }

    private void routeOutboundClipboard(String text, String clientId, String previous) {
        String mode = Configure.readClipboardOutboundMode(getApplicationContext());
        if ("ask".equals(mode)) {
            // WHY: hold the fan-out until the user Shares; Dismiss/timeout drops it.
            outboundHold = new PromptHold("outbound", null, text, null, System.currentTimeMillis());
            handler.removeCallbacks(outboundAutoDismiss);
            handler.postDelayed(outboundAutoDismiss, Configure.readClipboardPromptDismissMs(getApplicationContext()));
            postOutboundAskNotification();
            Log.d(TAG, "outbound clipboard held (ask) len=" + text.length() + " prevLen="
                    + (previous != null ? previous.length() : 0));
        } else {
            boolean sent = wsClient.sendClipboardUpdate(text, clientId);
            Log.d(TAG, "clipboard:update sent=" + sent + " prevLen="
                    + (previous != null ? previous.length() : 0));
            if (Configure.readClipboardOutboundShowErase(getApplicationContext())) {
                postOutboundEraseNotification();
            }
        }
    }

    // ---- receiver entry points (ClipboardPromptReceiver → static dispatch) ----

    public static void acceptInbound(Context context) {
        CwspBridgeService svc = instance;
        if (svc != null) svc.doAcceptInbound(); else clearInboundHoldAndNotif(context);
    }

    public static void undoInbound(Context context) {
        CwspBridgeService svc = instance;
        if (svc != null) svc.doUndoInbound(); else clearInboundHoldAndNotif(context);
    }

    public static void shareOutbound(Context context) {
        CwspBridgeService svc = instance;
        if (svc != null) svc.doShareOutbound(); else clearOutboundHoldAndNotif(context);
    }

    public static void eraseOutbound(Context context) {
        CwspBridgeService svc = instance;
        if (svc != null) svc.doEraseOutbound(); else cancelPromptNotif(context, PROMPT_NOTIF_ID_OUTBOUND);
    }

    public static void dismissPrompt(Context context, String direction) {
        if ("outbound".equals(direction)) {
            CwspBridgeService svc = instance;
            if (svc != null) svc.doDismissOutbound("user"); else clearOutboundHoldAndNotif(context);
        } else {
            CwspBridgeService svc = instance;
            if (svc != null) svc.doDismissInbound("user"); else clearInboundHoldAndNotif(context);
        }
    }

    // ---- prompt action implementations (instance) ----

    private void doAcceptInbound() {
        PromptHold hold = inboundHold;
        inboundHold = null;
        handler.removeCallbacks(inboundAutoDismiss);
        cancelPromptNotif(this, PROMPT_NOTIF_ID_INBOUND);
        if (hold == null) return;

        // Prefer text snapshotted at hold time (stable); fall back to packet extract.
        String heldText = hold.text;
        if ((heldText == null || heldText.isEmpty()) && hold.packet != null) {
            heldText = extractHeldText(hold.packet);
        }

        // WHY: force OS write while foreground (ClipboardPromptActivity). Background
        // BroadcastReceiver Accept previously dismissed the notif but setPrimaryClip
        // failed → user still saw the earlier clipboard body.
        if (heldText != null && !heldText.isEmpty()) {
            try {
                if (coordinator != null && coordinator.clipboardExecutor() != null) {
                    coordinator.clipboardExecutor().clearEchoSuppression();
                    coordinator.clipboardExecutor().writeText(heldText);
                } else if (clipboard != null) {
                    clipboard.write(heldText);
                }
                lastSeen = heldText;
                Log.i(TAG, "inbound accept wrote heldLen=" + heldText.length());
            } catch (Exception e) {
                Log.w(TAG, "accept inbound write failed", e);
            }
        }

        // Dispatch for asset / side-effects; text apply echo-suppresses as duplicate.
        if (hold.packet != null && coordinator != null) {
            try {
                coordinator.dispatch(hold.packet);
            } catch (Exception e) {
                Log.w(TAG, "accept inbound dispatch failed", e);
            }
        }

        // WHY: spec — Undo only after accept, if showUndo and a previous text exists.
        if (Configure.readClipboardInboundShowUndo(getApplicationContext())
                && hold.previousText != null && !hold.previousText.isEmpty()) {
            inboundHold = new PromptHold("inbound", null, null, hold.previousText, hold.packetTs);
            handler.removeCallbacks(inboundAutoDismiss);
            handler.postDelayed(inboundAutoDismiss, Configure.readClipboardPromptDismissMs(getApplicationContext()));
            postInboundAutoUndoNotification();
        }
    }

    private void doDismissInbound(String reason) {
        inboundHold = null;
        handler.removeCallbacks(inboundAutoDismiss);
        cancelPromptNotif(this, PROMPT_NOTIF_ID_INBOUND);
        Log.d(TAG, "inbound prompt dismissed reason=" + reason);
    }

    private void doUndoInbound() {
        PromptHold hold = inboundHold;
        inboundHold = null;
        handler.removeCallbacks(inboundAutoDismiss);
        cancelPromptNotif(this, PROMPT_NOTIF_ID_INBOUND);
        if (hold == null || hold.previousText == null) return;
        try {
            clipboard.write(hold.previousText);
            // WHY: prevent watchLoop re-fanning the restored previous text as an update.
            lastSeen = hold.previousText;
            Log.i(TAG, "inbound clipboard undone prevLen=" + hold.previousText.length());
        } catch (Exception e) {
            Log.w(TAG, "undo inbound failed", e);
        }
    }

    private void doShareOutbound() {
        PromptHold hold = outboundHold;
        outboundHold = null;
        handler.removeCallbacks(outboundAutoDismiss);
        cancelPromptNotif(this, PROMPT_NOTIF_ID_OUTBOUND);
        if (hold == null || hold.text == null || hold.text.isEmpty()) return;
        if (wsClient != null && wsClient.isOpen()) {
            String clientId = Configure.readClientId(getApplicationContext());
            boolean sent = wsClient.sendClipboardUpdate(hold.text, clientId);
            Log.i(TAG, "outbound clipboard shared (ask) sent=" + sent + " len=" + hold.text.length());
        } else {
            Log.w(TAG, "outbound share: WS not open — dropped");
        }
    }

    private void doDismissOutbound(String reason) {
        outboundHold = null;
        handler.removeCallbacks(outboundAutoDismiss);
        cancelPromptNotif(this, PROMPT_NOTIF_ID_OUTBOUND);
        Log.d(TAG, "outbound prompt dismissed reason=" + reason);
    }

    private void doEraseOutbound() {
        cancelPromptNotif(this, PROMPT_NOTIF_ID_OUTBOUND);
        try {
            clipboard.clear();
            // WHY: cleared clipboard must not fan out an empty update.
            lastSeen = "";
            Log.i(TAG, "outbound clipboard erased (auto)");
        } catch (Exception e) {
            Log.w(TAG, "erase outbound failed", e);
        }
    }

    // ---- notification builders ----

    private long promptDismissMs() {
        return Configure.readClipboardPromptDismissMs(getApplicationContext());
    }

    private NotificationCompat.Builder promptBuilder(String title, String text, int icon) {
        // WHY: setTimeoutAfter makes the OS drop the notif even if the main looper is
        // busy; the handler auto-dismiss is the source of truth for clearing the hold.
        return new NotificationCompat.Builder(this, PROMPT_CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(text)
                .setSmallIcon(icon)
                .setContentIntent(launchIntent())
                .setOnlyAlertOnce(true)
                .setTimeoutAfter(promptDismissMs());
    }

    private void postInboundAskNotification() {
        PromptHold hold = inboundHold;
        String preview = hold != null ? hold.text : null;
        String content = (preview != null && !preview.isEmpty())
                ? truncatePreview(preview)
                : "Accept to paste";
        NotificationCompat.Builder b = promptBuilder("CWSP — Incoming clipboard", content,
                        android.R.drawable.stat_sys_download)
                .addAction(0, "Accept", activityAction(ACTION_ACCEPT, null, 1))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "inbound", 2));
        if (preview != null && !preview.isEmpty()) {
            b.setStyle(new NotificationCompat.BigTextStyle().bigText(truncatePreview(preview, 400)));
        }
        nm().notify(PROMPT_NOTIF_ID_INBOUND, b.build());
    }

    private void postInboundAutoUndoNotification() {
        Notification n = promptBuilder("CWSP — Clipboard pasted", "Undo?",
                        android.R.drawable.stat_notify_sync)
                .addAction(0, "Undo", activityAction(ACTION_UNDO, null, 3))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "inbound", 4))
                .build();
        nm().notify(PROMPT_NOTIF_ID_INBOUND, n);
    }

    private void postOutboundAskNotification() {
        PromptHold hold = outboundHold;
        String preview = hold != null ? hold.text : null;
        String content = (preview != null && !preview.isEmpty())
                ? truncatePreview(preview)
                : "Share to sync";
        NotificationCompat.Builder b = promptBuilder("CWSP — Share clipboard?", content,
                        android.R.drawable.stat_sys_upload)
                .addAction(0, "Share", activityAction(ACTION_SHARE, null, 5))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "outbound", 6));
        if (preview != null && !preview.isEmpty()) {
            b.setStyle(new NotificationCompat.BigTextStyle().bigText(truncatePreview(preview, 400)));
        }
        nm().notify(PROMPT_NOTIF_ID_OUTBOUND, b.build());
    }

    private void postOutboundEraseNotification() {
        Notification n = promptBuilder("CWSP — Clipboard shared", "Erase local clipboard?",
                        android.R.drawable.stat_notify_sync)
                .addAction(0, "Erase", activityAction(ACTION_ERASE, null, 7))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "outbound", 8))
                .build();
        nm().notify(PROMPT_NOTIF_ID_OUTBOUND, n);
    }

    // ---- prompt helpers ----

    /**
     * WHY: Accept/Undo/Share/Erase must run while the app is foregrounded so
     * ClipboardManager.setPrimaryClip is allowed (Android 10+). Dismiss stays
     * as a broadcast — it only clears hold state.
     */
    private PendingIntent activityAction(String action, String direction, int requestCode) {
        Intent i = new Intent(this, ClipboardPromptActivity.class);
        i.setAction(action);
        if (direction != null) i.putExtra(EXTRA_DIRECTION, direction);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_NO_ANIMATION
                | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        return PendingIntent.getActivity(this, requestCode, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private PendingIntent broadcast(String action, String direction, int requestCode) {
        Intent i = new Intent(this, ClipboardPromptReceiver.class);
        i.setAction(action);
        if (direction != null) i.putExtra(EXTRA_DIRECTION, direction);
        return PendingIntent.getBroadcast(this, requestCode, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private PendingIntent launchIntent() {
        Intent launch = new Intent(this, MainActivity.class);
        return PendingIntent.getActivity(this, 0, launch,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private NotificationManager nm() {
        return (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    }

    private void ensurePromptChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = nm();
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(
                PROMPT_CHANNEL_ID,
                "CWSP Clipboard prompts",
                NotificationManager.IMPORTANCE_DEFAULT
        );
        ch.setDescription("Accept / dismiss / undo / share / erase clipboard sync prompts");
        nm.createNotificationChannel(ch);
    }

    private String safeReadClipboard() {
        try {
            return clipboard != null ? clipboard.read() : "";
        } catch (Exception e) {
            return "";
        }
    }

    private static boolean isApplyAction(String what) {
        return "clipboard:update".equals(what) || "clipboard:write".equals(what)
                || "airpad:clipboard:write".equals(what) || "airpad:clipboard:delivery".equals(what);
    }

    private static void cancelPromptNotif(Context context, int id) {
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(id);
        } catch (Throwable ignored) {
            /* best-effort */
        }
    }

    private static String truncatePreview(String text) {
        return truncatePreview(text, 120);
    }

    private static String truncatePreview(String text, int max) {
        if (text == null) return "";
        String t = text.replace('\n', ' ').trim();
        if (t.length() <= max) return t;
        return t.substring(0, Math.max(0, max - 1)) + "…";
    }

    /** Snapshot clipboard text from a held packet (payload/data carriers). */
    @SuppressWarnings("unchecked")
    static String extractHeldText(Map<String, Object> packet) {
        if (packet == null) return null;
        for (String key : new String[]{"payload", "data", "body", "result"}) {
            Object v = packet.get(key);
            if (v instanceof Map) {
                String t = textFromCarrier((Map<String, Object>) v);
                if (t != null) return t;
            } else if (v instanceof String && !((String) v).isEmpty()) {
                return (String) v;
            }
        }
        return textFromCarrier(packet);
    }

    private static String textFromCarrier(Map<String, Object> map) {
        if (map == null) return null;
        for (String key : new String[]{"text", "content", "body"}) {
            Object v = map.get(key);
            if (v instanceof String && !((String) v).isEmpty()) {
                return (String) v;
            }
        }
        return null;
    }

    static long packetTimestamp(Map<String, Object> packet) {
        if (packet == null) return 0L;
        Object ts = packet.get("timestamp");
        if (ts == null) ts = packet.get("ts");
        if (ts instanceof Number) return ((Number) ts).longValue();
        if (ts instanceof String) {
            try {
                return Long.parseLong((String) ts);
            } catch (NumberFormatException ignored) {
                return 0L;
            }
        }
        return 0L;
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> deepCopyMap(Map<String, Object> src) {
        if (src == null) return null;
        Map<String, Object> out = new LinkedHashMap<>();
        for (Map.Entry<String, Object> e : src.entrySet()) {
            Object v = e.getValue();
            if (v instanceof Map) {
                out.put(e.getKey(), deepCopyMap((Map<String, Object>) v));
            } else if (v instanceof List) {
                List<Object> list = new ArrayList<>();
                for (Object o : (List<?>) v) {
                    if (o instanceof Map) {
                        list.add(deepCopyMap((Map<String, Object>) o));
                    } else {
                        list.add(o);
                    }
                }
                out.put(e.getKey(), list);
            } else {
                out.put(e.getKey(), v);
            }
        }
        return out;
    }

    private static void clearInboundHoldAndNotif(Context context) {
        inboundHold = null;
        cancelPromptNotif(context, PROMPT_NOTIF_ID_INBOUND);
    }

    private static void clearOutboundHoldAndNotif(Context context) {
        outboundHold = null;
        cancelPromptNotif(context, PROMPT_NOTIF_ID_OUTBOUND);
    }

    /** Held prompt state (static so the manifest receiver/activity can reach it). */
    private static final class PromptHold {
        final String direction;           // "inbound" | "outbound"
        final Map<String, Object> packet; // inbound held apply packet (ask mode)
        final String text;                // snapshotted held text (inbound ask / outbound ask)
        final String previousText;        // inbound: pre-apply text for Undo
        final long createdAtMs;
        final long packetTs;              // packet timestamp for stale-supersede guard

        PromptHold(String direction, Map<String, Object> packet, String text, String previousText) {
            this(direction, packet, text, previousText, 0L);
        }

        PromptHold(String direction, Map<String, Object> packet, String text, String previousText, long packetTs) {
            this.direction = direction;
            this.packet = packet;
            this.text = text;
            this.previousText = previousText;
            this.createdAtMs = System.currentTimeMillis();
            this.packetTs = packetTs;
        }
    }
}
