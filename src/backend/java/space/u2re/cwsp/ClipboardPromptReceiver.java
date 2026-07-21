/*
 * Filename: ClipboardPromptReceiver.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ClipboardPromptReceiver.java
 * Change date and time: 18.45.00_14.07.2026
 * Reason for changes: Phase-2 — manifest-registered receiver that turns clipboard
 *   prompt notification actions (Accept/Dismiss/Undo/Share/Erase) into service
 *   calls. Static hold state on CwspBridgeService survives as long as the process
 *   is alive; if the service was killed, the receiver just cancels the notification.
 *
 * WHY: a static manifest receiver (not a dynamic one) keeps the PendingIntents
 * deliverable even when the app process is gone, matching how Android rewrites
 * clipboard prompt taps that arrive after the foreground service briefly stops.
 *
 * INVARIANT: exported=false — only this app's own PendingIntents can fire it.
 */

package space.u2re.cwsp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * Receiver for clipboard prompt notification actions.
 *
 * <p>Delegates every action to the matching static entry point on
 * {@link CwspBridgeService}, which owns the coordinator / clipboard / wsClient
 * and the held prompt slots. No work is done here beyond dispatch.</p>
 */
public class ClipboardPromptReceiver extends BroadcastReceiver {

    private static final String TAG = "ClipboardPromptReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (action == null) return;
        try {
            switch (action) {
                case CwspBridgeService.ACTION_ACCEPT:
                    CwspBridgeService.acceptInbound(context);
                    break;
                case CwspBridgeService.ACTION_DOWNLOAD:
                    CwspBridgeService.downloadInbound(context);
                    break;
                case CwspBridgeService.ACTION_UNDO:
                    CwspBridgeService.undoInbound(context);
                    break;
                case CwspBridgeService.ACTION_SHARE:
                    CwspBridgeService.shareOutbound(context);
                    break;
                case CwspBridgeService.ACTION_ERASE:
                    CwspBridgeService.eraseOutbound(context);
                    break;
                case CwspBridgeService.ACTION_DISMISS:
                    // WHY: dismiss is shared by inbound + outbound; the direction extra
                    // (attached when the PendingIntent was built) selects which slot.
                    String dir = intent.getStringExtra(CwspBridgeService.EXTRA_DIRECTION);
                    CwspBridgeService.dismissPrompt(context, dir);
                    break;
                default:
                    Log.d(TAG, "unknown action: " + action);
                    break;
            }
        } catch (Throwable t) {
            // SECURITY: never let a notification tap crash the receiver process.
            Log.w(TAG, "onReceive failed for " + action, t);
        }
    }
}
