/*
 * Filename: CwspBridgeService.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwspBridgeService.java
 * Change date and time: 15.05.00_20.07.2026
 * Reason for changes: Fix inbound Accept applying stale OS clipboard — snapshot held
 *   text, ignore older superseding packets, force-write + lastSeen, and route
 *   Accept/Undo/Share/Erase through a foreground Activity trampoline (Android 10+
 *   denies setPrimaryClip from background BroadcastReceiver).
 *   2026-07-17: ask-accept no longer posts an Undo toast (spec). Inbound ask
 *   notification now decodes the packet image asset and uses BigPictureStyle +
 *   setLargeIcon; auto-undo notification uses BigText when previous text exists.
 *   2026-07-17: cast bigLargeIcon((Bitmap) null) — API 23+ also has Icon overload.
 *   2026-07-17: truncatePreview keeps newlines for Share/Accept BigText (parity
 *   with Neutralino multi-line textPreview).
 *   2026-07-19: takePasteForProcessText — empty PROCESS_TEXT menu path Accepts
 *   held inbound ask (dismisses notif) and/or returns OS clipboard for insert.
 *   2026-07-20: clipboard prompt channel → IMPORTANCE_HIGH + PRIORITY_HIGH so
 *   Accept/Share heads-up instead of silent tray-only DEFAULT importance.
 *   2026-07-20: FGS notification actions Start/Restart + Stop for WS/Control service.
 *   2026-07-21: FGS out of silent — brand ic_stat_cwsp in status bar + visible channel.
 *   2026-07-21b: acknowledgeExplicitShare — PROCESS_TEXT / Share sheet already
 *   fan out; clipboard write must not post a second "Share clipboard?" ask.
 *   2026-07-21k: inbound image ask — third action "Download" saves asset to
 *   landing/Downloads without replacing Accept (clipboard paste).
 *   2026-07-21m: Accept for images also lands a file (paste URI + Downloads/
 *   SAF); Windows dual-format clipboard parity. Download remains save-only.
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
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import core.Configure;
import core.Coordinator;
import core.Settings;
import emission.Clipboard;
import emission.FilesIncomingNotifier;
import emission.FilesStorage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * CWSP foreground service: OS clipboard watch + native /ws keepalive.
 */
public class CwspBridgeService extends Service {
    private static final String TAG = "CwspBridgeService";
    // WHY: old `cwsp_bridge` was IMPORTANCE_LOW + setSilent — frozen importance hid the
    // status-bar glyph on many OEMs. New id forces a visible ongoing notification.
    public static final String CHANNEL_ID = "cwsp_bridge_status";
    private static final String CHANNEL_ID_LEGACY = "cwsp_bridge";
    public static final int NOTIFICATION_ID = 8434;

    // WHY: Accept/Share must heads-up. Old channel `cwsp_clipboard_prompt` was
    // IMPORTANCE_DEFAULT (tray-only after first create — Android freezes importance).
    // New id forces HIGH so banners appear without asking users to reconfigure.
    public static final String PROMPT_CHANNEL_ID = "cwsp_clipboard_prompt_heads";
    /** COMPAT: previous tray-only channel — deleted on ensure so it cannot confuse UX. */
    private static final String PROMPT_CHANNEL_ID_LEGACY = "cwsp_clipboard_prompt";
    public static final int PROMPT_NOTIF_ID_INBOUND = 8435;
    public static final int PROMPT_NOTIF_ID_OUTBOUND = 8436;

    // PendingIntent broadcast actions consumed by ClipboardPromptReceiver.
    public static final String ACTION_ACCEPT = "space.u2re.cwsp.CLIPBOARD_ACCEPT";
    public static final String ACTION_DISMISS = "space.u2re.cwsp.CLIPBOARD_DISMISS";
    public static final String ACTION_UNDO = "space.u2re.cwsp.CLIPBOARD_UNDO";
    public static final String ACTION_SHARE = "space.u2re.cwsp.CLIPBOARD_SHARE";
    public static final String ACTION_ERASE = "space.u2re.cwsp.CLIPBOARD_ERASE";
    /** Save inbound clipboard image asset to landing/Downloads (keep Accept available). */
    public static final String ACTION_DOWNLOAD = "space.u2re.cwsp.CLIPBOARD_DOWNLOAD";
    public static final String EXTRA_DIRECTION = "cwsp.direction";

    /** FGS keepalive notification — start/resume WS + Control HTTPS (:8434). */
    public static final String ACTION_START = "space.u2re.cwsp.BRIDGE_START";
    /** Soft restart: reconnect /ws and re-sync Control API without tearing down FGS. */
    public static final String ACTION_RESTART = "space.u2re.cwsp.BRIDGE_RESTART";
    /** Pause WS + Control; keep FGS notification so Start remains one tap away. */
    public static final String ACTION_STOP = "space.u2re.cwsp.BRIDGE_STOP";
    /** Compat alias used by older call sites. */
    public static final String ACTION_RECONNECT = "space.u2re.cwsp.RECONNECT";

    private static volatile boolean running = false;
    /** WHY: Stop from notification pauses transports but keeps the FGS + Start action. */
    private static volatile boolean paused = false;
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

    /** Best-effort app Context for Control pair notification dismiss from store timers. */
    public static Context appContextOrNull() {
        CwspBridgeService s = instance;
        return s != null ? s.getApplicationContext() : null;
    }

    private final Handler handler = new Handler(Looper.getMainLooper());
    private Clipboard clipboard;
    private Coordinator coordinator;
    private CwspWsClient wsClient;
    private String lastSeen = "";
    /** Refresh FGS text with live 20s Control device code while Control API is up. */
    private final Runnable controlCodeTicker = new Runnable() {
        @Override
        public void run() {
            if (!running) return;
            try {
                if (!paused && ControlApiServer.isListening()) {
                    promoteForeground();
                }
            } catch (Exception e) {
                Log.w(TAG, "controlCodeTicker failed", e);
            }
            handler.postDelayed(this, 1000L);
        }
    };

    // WHY: auto-dismiss the held prompt after shell.clipboardPromptDismissMs —
    // treats the timeout as Dismiss so a forgotten prompt never applies/sends.
    private final Runnable inboundAutoDismiss = () -> doDismissInbound("timeout");
    private final Runnable outboundAutoDismiss = () -> doDismissOutbound("timeout");

    private final Runnable watchLoop = new Runnable() {
        @Override
        public void run() {
            if (!running || paused) return;
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

    /** True when FGS is up but WS/Control were paused via notification Stop. */
    public static boolean isPaused() {
        return paused;
    }

    public static boolean isWsOpen() {
        CwspWsClient ws = sharedWs;
        return ws != null && ws.isOpen() && !paused;
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

    /**
     * Call when ShareActivity / PROCESS_TEXT already fanned out clipboard to peers.
     * WHY: writing the same body to the OS clipboard otherwise triggers outbound
     * ask mode → redundant "CWSP — Share clipboard?" notification with Share.
     *
     * @param text shared text body, or null/empty for image/asset-only shares
     */
    public static void acknowledgeExplicitShare(String text) {
        suppressTextWatch(15_000L);
        final CwspBridgeService svc = instance;
        final Context ctx = svc != null ? svc.getApplicationContext() : appContextOrNull();
        Runnable clear = () -> {
            if (svc != null) {
                if (text != null && !text.isEmpty()) {
                    svc.lastSeen = text;
                } else {
                    try {
                        String cur = svc.safeReadClipboard();
                        if (cur != null) svc.lastSeen = cur;
                    } catch (Exception ignored) { /* */ }
                }
                svc.outboundHold = null;
                svc.handler.removeCallbacks(svc.outboundAutoDismiss);
            }
            if (ctx != null) {
                cancelPromptNotif(ctx, PROMPT_NOTIF_ID_OUTBOUND);
            }
        };
        if (svc != null) {
            svc.handler.post(clear);
        } else {
            clear.run();
        }
    }

    /** Soft-reconnect after settings/token patch while the service is already running. */
    public static void requestReconnect(Context context) {
        try {
            Intent i = new Intent(context, CwspBridgeService.class);
            i.setAction(ACTION_RESTART);
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(i);
            } else {
                context.startService(i);
            }
        } catch (Exception e) {
            Log.w(TAG, "requestReconnect failed", e);
        }

        if (sharedWs != null && !paused) {
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

    /** Start / resume FGS transports from notification or plugin. */
    public static void requestStart(Context context) {
        try {
            Intent i = new Intent(context, CwspBridgeService.class);
            i.setAction(ACTION_START);
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(i);
            } else {
                context.startService(i);
            }
        } catch (Exception e) {
            Log.w(TAG, "requestStart failed", e);
        }
    }

    /** Pause transports from notification (keeps FGS notification). */
    public static void requestStop(Context context) {
        try {
            Intent i = new Intent(context, CwspBridgeService.class);
            i.setAction(ACTION_STOP);
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(i);
            } else {
                context.startService(i);
            }
        } catch (Exception e) {
            Log.w(TAG, "requestStop failed", e);
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
        String action = intent != null ? intent.getAction() : null;
        if (ACTION_STOP.equals(action)) {
            pauseTransports("notification-stop");
            promoteForeground();
            return START_STICKY;
        }
        boolean startOrRestart = ACTION_START.equals(action)
                || ACTION_RESTART.equals(action)
                || ACTION_RECONNECT.equals(action);
        if (startOrRestart || action == null) {
            paused = false;
        }
        promoteForeground();
        handler.removeCallbacks(watchLoop);
        handler.post(watchLoop);
        handler.removeCallbacks(controlCodeTicker);
        handler.post(controlCodeTicker);
        if (!paused && wsClient != null) {
            if (wsClient.isConfigured()) {
                // WHY: RESTART/RECONNECT must replace an already-open socket (new endpoint/token).
                if (ACTION_RESTART.equals(action) || ACTION_RECONNECT.equals(action)) {
                    wsClient.reconnectNow();
                } else {
                    wsClient.connect();
                }
            } else {
                Log.i(TAG, "WS skip: missing endpoint/clientId/token");
            }
        }
        // WHY: keep Control API (:8434) aligned with shell.allowControlApi across FGS restarts.
        if (!paused) {
            ControlApiServer.syncFromSettings(getApplicationContext());
        }
        Log.i(TAG, "started action=" + action
                + " paused=" + paused
                + " controlApi=" + ControlApiServer.isListening());
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        running = false;
        paused = false;
        handler.removeCallbacks(watchLoop);
        handler.removeCallbacks(controlCodeTicker);
        handler.removeCallbacks(inboundAutoDismiss);
        handler.removeCallbacks(outboundAutoDismiss);
        if (instance == this) instance = null;
        if (wsClient != null) {
            wsClient.disconnect();
        }
        if (sharedWs == wsClient) {
            sharedWs = null;
        }
        try {
            ControlApiServer.stop();
        } catch (Exception e) {
            Log.w(TAG, "ControlApiServer.stop onDestroy failed", e);
        }
        Log.i(TAG, "stopped");
        super.onDestroy();
    }

    /** Pause /ws + Control HTTPS while keeping the FGS notification. */
    private void pauseTransports(String reason) {
        paused = true;
        handler.removeCallbacks(watchLoop);
        if (wsClient != null) {
            try {
                wsClient.disconnect();
            } catch (Exception e) {
                Log.w(TAG, "pause WS disconnect failed", e);
            }
        }
        try {
            ControlApiServer.stop();
        } catch (Exception e) {
            Log.w(TAG, "pause ControlApi stop failed", e);
        }
        Log.i(TAG, "transports paused reason=" + reason);
    }

    private void promoteForeground() {
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
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        // WHY: legacy LOW+silent channel hid the status-bar icon on several OEMs.
        try {
            nm.deleteNotificationChannel(CHANNEL_ID_LEGACY);
        } catch (Exception ignored) {
            /* may not exist */
        }
        NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID,
                "CWSP Bridge",
                NotificationManager.IMPORTANCE_DEFAULT
        );
        ch.setDescription("Clipboard sync and CWSP bridge keepalive (status bar)");
        ch.setShowBadge(true);
        ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        // WHY: visible in shade/status bar, but no beep on every status rewrite.
        ch.setSound(null, null);
        ch.enableVibration(false);
        nm.createNotificationChannel(ch);
    }

    /** White-alpha status glyph from branding (see scripts/sync-capacitor-status-icon.mjs). */
    private static int notificationSmallIcon() {
        return R.drawable.ic_stat_cwsp;
    }

    private Bitmap notificationLargeIcon() {
        try {
            return BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
        } catch (Exception e) {
            return null;
        }
    }

    private Notification buildNotification() {
        Intent launch = new Intent(this, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(
                this,
                0,
                launch,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        String status;
        if (paused) {
            status = "stopped — tap Start";
        } else if (wsClient != null && wsClient.isOpen()) {
            status = "WS connected";
        } else {
            status = "clipboard watch";
        }
        if (!paused && ControlApiServer.isListening()) {
            String code = ControlRotatingCode.currentCode(this);
            long left = Math.max(1L, ControlRotatingCode.expiresInMs() / 1000L);
            status = status + " · Control :" + ControlApiServer.listeningPort()
                    + " · code " + code + " (" + left + "s)";
        }
        NotificationCompat.Builder b = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("CWSP")
                .setContentText(paused ? "Bridge paused — " + status : "Bridge active — " + status)
                .setSmallIcon(notificationSmallIcon())
                .setContentIntent(pi)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setShowWhen(false);
        Bitmap large = notificationLargeIcon();
        if (large != null) {
            b.setLargeIcon(large);
        }
        // WHY: Start resumes WS+Control; Restart soft-reconnects while running; Stop pauses transports.
        if (paused) {
            b.addAction(notificationSmallIcon(), "Start", serviceAction(ACTION_START, 40));
        } else {
            b.addAction(notificationSmallIcon(), "Restart", serviceAction(ACTION_RESTART, 41));
            b.addAction(notificationSmallIcon(), "Stop", serviceAction(ACTION_STOP, 42));
        }
        return b.build();
    }

    private PendingIntent serviceAction(String action, int requestCode) {
        Intent i = new Intent(this, CwspBridgeService.class);
        i.setAction(action);
        return PendingIntent.getService(
                this,
                requestCode,
                i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
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

    /**
     * Save held inbound image asset to landing / Downloads.
     * WHY: Accept pastes to clipboard; Download is the optional "also keep a file"
     * path for browser Share-image packets (does not clear the ask hold).
     */
    public static void downloadInbound(Context context) {
        CwspBridgeService svc = instance;
        if (svc != null) {
            svc.doDownloadInbound();
        } else {
            Log.w(TAG, "downloadInbound: service not running");
        }
    }

    /**
     * Result of empty-{@code PROCESS_TEXT} paste path (context menu "CWSP" with no selection).
     * WHY: mirrors notification Accept — applies held inbound ask, dismisses the Ask
     * toast, and yields text for {@link Intent#EXTRA_PROCESS_TEXT} insert.
     */
    public static final class PasteOffer {
        /** Text to insert into the focused field (may be empty for image-only Accept). */
        public final String text;
        /** True when an inbound ask hold was consumed (notif cleared / packet applied). */
        public final boolean acceptedAsk;
        /** True when {@link #text} came from OS clipboard fallback (no active ask hold). */
        public final boolean fromClipboard;

        public PasteOffer(String text, boolean acceptedAsk, boolean fromClipboard) {
            this.text = text != null ? text : "";
            this.acceptedAsk = acceptedAsk;
            this.fromClipboard = fromClipboard;
        }

        public boolean hasText() {
            return text != null && !text.isEmpty();
        }
    }

    /**
     * Empty selection / empty field PROCESS_TEXT helper.
     * <ol>
     *   <li>If inbound ask hold exists → same as Accept (write OS, dispatch, clear notif).</li>
     *   <li>Else read primary clipboard (already-shared / previously accepted body).</li>
     * </ol>
     */
    public static PasteOffer takePasteForProcessText(Context context) {
        CwspBridgeService svc = instance;
        PromptHold hold = inboundHold;
        boolean hadHold = hold != null;
        String heldText = null;
        if (hold != null) {
            heldText = hold.text;
            if ((heldText == null || heldText.isEmpty()) && hold.packet != null) {
                heldText = extractHeldText(hold.packet);
            }
        }

        if (svc != null) {
            svc.doAcceptInbound();
        } else if (hadHold) {
            // WHY: service torn down but static hold + notif may still exist — apply text.
            inboundHold = null;
            cancelPromptNotif(context, PROMPT_NOTIF_ID_INBOUND);
            if (heldText != null && !heldText.isEmpty() && context != null) {
                try {
                    new Clipboard(context.getApplicationContext()).write(heldText);
                } catch (Exception e) {
                    Log.w(TAG, "takePasteForProcessText offline write failed", e);
                }
            }
        }

        if (heldText != null && !heldText.isEmpty()) {
            Log.i(TAG, "PROCESS_TEXT paste from ask-accept len=" + heldText.length());
            return new PasteOffer(heldText, true, false);
        }
        if (hadHold) {
            // Image-only (or empty) hold was accepted — nothing to type into the field.
            Log.i(TAG, "PROCESS_TEXT paste accepted ask hold without text body");
            return new PasteOffer("", true, false);
        }

        String clip = "";
        try {
            if (svc != null) {
                clip = svc.safeReadClipboard();
            } else if (context != null) {
                clip = new Clipboard(context.getApplicationContext()).read();
            }
        } catch (Exception e) {
            Log.w(TAG, "takePasteForProcessText clipboard read failed", e);
        }
        if (clip == null) clip = "";
        clip = clip.trim();
        if (!clip.isEmpty()) {
            Log.i(TAG, "PROCESS_TEXT paste from OS clipboard len=" + clip.length());
            return new PasteOffer(clip, false, true);
        }
        return new PasteOffer("", false, false);
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
        // WHY: image Accept already sets FileProvider ClipData (paste as image/URI).
        // Also land a user-visible file (Downloads/SAF/CWSP Files) so Accept = image
        // paste + file — parity with Windows dual-format clipboard; Download stays
        // for "save without dismissing ask".
        if (hold.packet != null && coordinator != null) {
            try {
                coordinator.dispatch(hold.packet);
            } catch (Exception e) {
                Log.w(TAG, "accept inbound dispatch failed", e);
            }
        }
        try {
            PacketAsset asset = hold.packet != null ? extractPacketAsset(hold.packet) : null;
            if (asset != null && asset.bytes != null && asset.bytes.length > 0) {
                String mime = asset.mimeType != null ? asset.mimeType : "";
                if (mime.toLowerCase(java.util.Locale.US).startsWith("image/")) {
                    String path = FilesStorage.saveBytesToLanding(
                            getApplicationContext(),
                            asset.bytes,
                            asset.name,
                            asset.mimeType
                    );
                    if (path != null && !path.isEmpty()) {
                        Log.i(TAG, "inbound accept also landed file path=" + path);
                    }
                }
            }
        } catch (Throwable t) {
            Log.w(TAG, "accept inbound land-file failed", t);
        }

        // WHY: spec — ask-accept must NOT show an Undo toast. The inbound ask
        // hold is now fully applied and cleared; no follow-up notification.
        // (Auto-mode Undo is posted by routeInboundClipboard, not by accept.)
    }

    /**
     * Save inbound image asset to landing without clearing the ask hold.
     * WHY: Accept = paste to clipboard; Download = optional file keep.
     */
    private void doDownloadInbound() {
        PromptHold hold = inboundHold;
        if (hold == null || hold.packet == null) {
            Log.w(TAG, "downloadInbound: no held packet");
            return;
        }
        PacketAsset asset = extractPacketAsset(hold.packet);
        if (asset == null || asset.bytes == null || asset.bytes.length == 0) {
            Log.w(TAG, "downloadInbound: no image bytes in hold");
            return;
        }
        String path = FilesStorage.saveBytesToLanding(
                getApplicationContext(),
                asset.bytes,
                asset.name,
                asset.mimeType
        );
        if (path == null || path.isEmpty()) {
            Log.w(TAG, "downloadInbound: save failed");
            return;
        }
        // Separate "Files saved" heads-up with Open folder — keep inbound ask alive.
        FilesIncomingNotifier.notifySaved(
                getApplicationContext(),
                "clip-" + System.currentTimeMillis(),
                1,
                path
        );
        Log.i(TAG, "downloadInbound ok size=" + asset.bytes.length + " path=" + path);
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
        // PRIORITY_HIGH + CATEGORY_MESSAGE → heads-up banner on modern Android.
        return new NotificationCompat.Builder(this, PROMPT_CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(text)
                .setSmallIcon(icon)
                .setContentIntent(launchIntent())
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setOnlyAlertOnce(false)
                .setAutoCancel(false)
                .setTimeoutAfter(promptDismissMs());
    }

    /** Post prompt only when the OS will actually show it; otherwise log clearly. */
    private void notifyPrompt(int id, Notification n) {
        NotificationManager nm = nm();
        if (nm == null) {
            Log.w(TAG, "notifyPrompt skipped: no NotificationManager id=" + id);
            return;
        }
        if (Build.VERSION.SDK_INT >= 24 && !nm.areNotificationsEnabled()) {
            Log.w(TAG, "notifyPrompt skipped: app notifications disabled id=" + id
                    + " — enable POST_NOTIFICATIONS / app notification toggle");
            return;
        }
        nm.notify(id, n);
    }

    private void postInboundAskNotification() {
        PromptHold hold = inboundHold;
        String preview = hold != null ? hold.text : null;
        // Collapsed tray: first line; expanded BigText: multi-line preview.
        String content = (preview != null && !preview.isEmpty())
                ? formatTextPreview(preview, 120, 1)
                : (hold != null && extractPacketAsset(hold.packet) != null
                        ? "Accept = paste image + keep file"
                        : "Accept to paste");
        NotificationCompat.Builder b = promptBuilder("CWSP — Incoming clipboard", content,
                        notificationSmallIcon())
                .addAction(0, "Accept", activityAction(ACTION_ACCEPT, null, 1));
        // WHY: Download = save landing file without dismissing ask / pasting.
        // Accept already pastes (FileProvider URI) + lands a copy for images.
        Bitmap imageBmp = hold != null ? decodePacketImage(hold.packet) : null;
        if (imageBmp != null || (hold != null && extractPacketAsset(hold.packet) != null)) {
            b.addAction(0, "Download", activityAction(ACTION_DOWNLOAD, null, 9));
        }
        b.addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "inbound", 2));
        // WHY: BigTextStyle keeps newlines so Accept shows multi-line clipboard text.
        if (preview != null && !preview.isEmpty()) {
            b.setStyle(new NotificationCompat.BigTextStyle()
                    .bigText(formatTextPreview(preview, 400, 8)));
        }
        // WHY: when the inbound packet carries an image asset, decode it and use
        // BigPictureStyle + setLargeIcon so the user sees the image preview. Falls
        // back to the text style above when decoding fails or no asset is present.
        if (imageBmp != null) {
            // WHY: bare null is ambiguous — BigPictureStyle has bigLargeIcon(Bitmap)
            // and bigLargeIcon(Icon). Cast selects Bitmap so the large icon is cleared
            // when the picture is expanded (standard Android BigPicture pattern).
            NotificationCompat.BigPictureStyle pic = new NotificationCompat.BigPictureStyle()
                    .bigPicture(imageBmp)
                    .bigLargeIcon((Bitmap) null);
            // WHY: BigPicture replaces BigText — keep multi-line caption when text coexists.
            if (preview != null && !preview.isEmpty()) {
                pic.setSummaryText(formatTextPreview(preview, 200, 4));
            }
            b.setStyle(pic).setLargeIcon(imageBmp);
        }
        notifyPrompt(PROMPT_NOTIF_ID_INBOUND, b.build());
    }

    private void postInboundAutoUndoNotification() {
        PromptHold hold = inboundHold;
        String prevText = hold != null ? hold.previousText : null;
        NotificationCompat.Builder b = promptBuilder("CWSP — Clipboard pasted", "Undo?",
                        notificationSmallIcon())
                .addAction(0, "Undo", activityAction(ACTION_UNDO, null, 3))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "inbound", 4));
        // WHY: show what Undo would restore so the user can decide; BigText when present.
        if (prevText != null && !prevText.isEmpty()) {
            b.setStyle(new NotificationCompat.BigTextStyle()
                    .bigText("Undo to restore:\n" + formatTextPreview(prevText, 360, 8)));
        }
        notifyPrompt(PROMPT_NOTIF_ID_INBOUND, b.build());
    }

    private void postOutboundAskNotification() {
        PromptHold hold = outboundHold;
        String preview = hold != null ? hold.text : null;
        String content = (preview != null && !preview.isEmpty())
                ? formatTextPreview(preview, 120, 1)
                : "Share to sync";
        NotificationCompat.Builder b = promptBuilder("CWSP — Share clipboard?", content,
                        notificationSmallIcon())
                .addAction(0, "Share", activityAction(ACTION_SHARE, null, 5))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "outbound", 6));
        if (preview != null && !preview.isEmpty()) {
            b.setStyle(new NotificationCompat.BigTextStyle()
                    .bigText(formatTextPreview(preview, 400, 8)));
        }
        notifyPrompt(PROMPT_NOTIF_ID_OUTBOUND, b.build());
    }

    private void postOutboundEraseNotification() {
        Notification n = promptBuilder("CWSP — Clipboard shared", "Erase local clipboard?",
                        notificationSmallIcon())
                .addAction(0, "Erase", activityAction(ACTION_ERASE, null, 7))
                .addAction(0, "Dismiss", broadcast(ACTION_DISMISS, "outbound", 8))
                .build();
        notifyPrompt(PROMPT_NOTIF_ID_OUTBOUND, n);
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
        // WHY: legacy DEFAULT channel never heads-up; drop it so only HIGH remains.
        try {
            nm.deleteNotificationChannel(PROMPT_CHANNEL_ID_LEGACY);
        } catch (Exception ignored) {
            /* channel may not exist on fresh installs */
        }
        NotificationChannel ch = new NotificationChannel(
                PROMPT_CHANNEL_ID,
                "CWSP Clipboard prompts",
                NotificationManager.IMPORTANCE_HIGH
        );
        ch.setDescription("Accept / dismiss / undo / share / erase clipboard sync prompts (heads-up)");
        ch.enableVibration(true);
        ch.setShowBadge(true);
        ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
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

    /**
     * Notification text preview that preserves newlines (Neutralino parity).
     * WHY: older code used {@code replace('\\n',' ')} which flattened Share/Accept.
     * Collapsed tray uses {@code maxLines=1}; BigTextStyle uses more lines.
     */
    private static String formatTextPreview(String text, int maxChars, int maxLines) {
        if (text == null) return "";
        String raw = text.replace("\r\n", "\n").replace('\r', '\n');
        if (raw.trim().isEmpty()) return "";

        final int lineCap = Math.max(1, maxLines);
        String[] split = raw.split("\n", -1);
        StringBuilder normalized = new StringBuilder(raw.length());
        for (int i = 0; i < split.length; i++) {
            // Collapse spaces/tabs within a line; keep newline separators.
            String line = split[i].replaceAll("[ \\t]+", " ").trim();
            if (i > 0) normalized.append('\n');
            normalized.append(line);
        }
        String norm = normalized.toString().replaceAll("\\n{3,}", "\n\n");
        String[] allLines = norm.split("\n", -1);

        java.util.ArrayList<String> head = new java.util.ArrayList<>(lineCap);
        int cursor = 0;
        for (; cursor < allLines.length && head.size() < lineCap; cursor++) {
            String line = allLines[cursor];
            // Skip leading / stacked blank lines so the notification stays dense.
            if (line.isEmpty() && (head.isEmpty() || head.get(head.size() - 1).isEmpty())) {
                continue;
            }
            head.add(line);
        }
        String preview = android.text.TextUtils.join("\n", head);
        boolean moreLines = cursor < allLines.length;

        if (preview.length() > maxChars) {
            return preview.substring(0, Math.max(0, maxChars - 1)) + "…";
        }
        if (moreLines) {
            return preview + "\n…";
        }
        return preview;
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

    /**
     * Decode an image asset from a held inbound packet into a Bitmap for
     * BigPictureStyle. Looks for asset/dataAsset/file/image under payload/data
     * (and at the top level as a COMPAT fallback), accepts data URLs or bare
     * base64. Returns null when no asset is present or decoding fails — callers
     * fall back to a text-style notification.
     */
    @SuppressWarnings("unchecked")
    static Bitmap decodePacketImage(Map<String, Object> packet) {
        PacketAsset asset = extractPacketAsset(packet);
        if (asset == null || asset.bytes == null || asset.bytes.length == 0) return null;
        try {
            Bitmap bmp = BitmapFactory.decodeByteArray(asset.bytes, 0, asset.bytes.length);
            // WHY: cap the bitmap size used in the notification to avoid OOM on
            // large inbound images; BigPictureStyle downsamples anyway.
            if (bmp != null && (bmp.getWidth() > 1024 || bmp.getHeight() > 1024)) {
                float scale = 1024f / Math.max(bmp.getWidth(), bmp.getHeight());
                int nw = Math.max(1, Math.round(bmp.getWidth() * scale));
                int nh = Math.max(1, Math.round(bmp.getHeight() * scale));
                Bitmap scaled = Bitmap.createScaledBitmap(bmp, nw, nh, true);
                if (scaled != bmp) bmp.recycle();
                bmp = scaled;
            }
            return bmp;
        } catch (Throwable t) {
            Log.d(TAG, "decodePacketImage failed: " + t.getMessage());
            return null;
        }
    }

    /** Decoded clipboard DataAsset bytes for Download / BigPicture. */
    private static final class PacketAsset {
        final byte[] bytes;
        final String mimeType;
        final String name;

        PacketAsset(byte[] bytes, String mimeType, String name) {
            this.bytes = bytes;
            this.mimeType = mimeType != null ? mimeType : "application/octet-stream";
            this.name = name != null ? name : "cwsp-image.bin";
        }
    }

    @SuppressWarnings("unchecked")
    private static PacketAsset extractPacketAsset(Map<String, Object> packet) {
        if (packet == null) return null;
        Map<String, Object> asset = null;
        for (String carrierKey : new String[]{"payload", "data", "body", "result"}) {
            Object carrier = packet.get(carrierKey);
            if (carrier instanceof Map) {
                Map<String, Object> c = (Map<String, Object>) carrier;
                for (String assetKey : new String[]{"asset", "dataAsset", "file", "image"}) {
                    Object a = c.get(assetKey);
                    if (a instanceof Map) {
                        asset = (Map<String, Object>) a;
                        break;
                    }
                }
                if (asset != null) break;
            }
        }
        if (asset == null) {
            for (String assetKey : new String[]{"asset", "dataAsset", "file", "image"}) {
                Object a = packet.get(assetKey);
                if (a instanceof Map) {
                    asset = (Map<String, Object>) a;
                    break;
                }
            }
        }
        if (asset == null) return null;

        Object dataObj = asset.get("data");
        if (!(dataObj instanceof String)) return null;
        String data = ((String) dataObj).trim();
        if (data.isEmpty()) return null;

        String base64 = data;
        int comma = data.indexOf(',');
        if (data.startsWith("data:") && comma >= 0) {
            base64 = data.substring(comma + 1);
        }
        base64 = base64.replaceAll("\\s", "");
        if (base64.isEmpty()) return null;

        try {
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            if (bytes.length == 0) return null;
            String mime = null;
            Object mt = asset.get("mimeType");
            if (!(mt instanceof String) || ((String) mt).isEmpty()) mt = asset.get("type");
            if (mt instanceof String) mime = (String) mt;
            if (mime == null || mime.isEmpty()) mime = "image/png";
            String name = null;
            Object n = asset.get("name");
            if (n instanceof String && !((String) n).isEmpty()) name = (String) n;
            if (name == null) {
                Object hash = asset.get("hash");
                String ext = mime.contains("jpeg") || mime.contains("jpg") ? "jpg"
                        : mime.contains("webp") ? "webp"
                        : mime.contains("gif") ? "gif" : "png";
                name = "cwsp-" + (hash instanceof String ? hash : System.currentTimeMillis()) + "." + ext;
            }
            return new PacketAsset(bytes, mime, name);
        } catch (Throwable t) {
            Log.d(TAG, "extractPacketAsset failed: " + t.getMessage());
            return null;
        }
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
