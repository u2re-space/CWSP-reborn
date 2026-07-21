/*
 * Filename: FilesPromptReceiver.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/FilesPromptReceiver.java
 * Change date and time: 21.20.00_21.07.2026
 * Reason for changes: Accept via goAsync left "Accepting…" forever when the OS
 *   killed the budget mid-download. Now starts FilesAcceptService (FGS).
 *   Also handles SHARE_LANDING so received files can be shared via system Share.
 *   2026-07-21: OPEN_LANDING opens SAF/Downloads/CWSP Files folder.
 */
package space.u2re.cwsp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import emission.FilesAcceptRunner;
import emission.FilesIngress;
import emission.FilesOutgoingNotifier;
import emission.FilesStorage;

/**
 * Receiver for inbound files:offer (Accept/Decline/Share/Open folder) and
 * outgoing-share (Dismiss) notification actions.
 */
public class FilesPromptReceiver extends BroadcastReceiver {

    private static final String TAG = "FilesPromptReceiver";

    public static final String ACTION_INCOMING_ACCEPT = "space.u2re.cwsp.FILES_INCOMING_ACCEPT";
    public static final String ACTION_INCOMING_DECLINE = "space.u2re.cwsp.FILES_INCOMING_DECLINE";
    public static final String ACTION_SHARE_LANDING = "space.u2re.cwsp.FILES_SHARE_LANDING";
    /** Open the configured landing folder in the default file manager. */
    public static final String ACTION_OPEN_LANDING = "space.u2re.cwsp.FILES_OPEN_LANDING";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (action == null) return;
        try {
            String transferId = intent.getStringExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID);
            switch (action) {
                case ACTION_INCOMING_ACCEPT: {
                    // WHY: FGS outlives goAsync — large HTTP / base64 decode can
                    // take >10s; goAsync death left Accepting… forever on L-196.
                    FilesAcceptService.startAccept(context.getApplicationContext(), transferId);
                    try {
                        Intent launch = new Intent(context, MainActivity.class);
                        launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        launch.putExtra("cwsp_files_incoming_accept", true);
                        if (transferId != null) {
                            launch.putExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID, transferId);
                        }
                        context.startActivity(launch);
                    } catch (Throwable t) {
                        Log.w(TAG, "launch MainActivity after accept failed", t);
                    }
                    break;
                }
                case ACTION_INCOMING_DECLINE: {
                    FilesAcceptRunner.decline(context.getApplicationContext(), transferId);
                    break;
                }
                case ACTION_SHARE_LANDING: {
                    // WHY: user asked to Share received Cap files via system sheet.
                    boolean ok = FilesStorage.shareLandingTransfer(
                            context.getApplicationContext(), transferId);
                    if (!ok) {
                        Log.w(TAG, "shareLandingTransfer failed transferId=" + transferId);
                    }
                    break;
                }
                case ACTION_OPEN_LANDING: {
                    // WHY: tap Saved / "Open folder" → Material Files (or default
                    // Documents UI) at SAF tree / Downloads / CWSP Files landing.
                    boolean ok = FilesStorage.openLandingFolder(
                            context.getApplicationContext(), transferId);
                    if (!ok) {
                        Log.w(TAG, "openLandingFolder failed transferId=" + transferId);
                    }
                    break;
                }
                case FilesOutgoingNotifier.NOTIF_ACTION_DISMISS: {
                    if (transferId != null) {
                        FilesOutgoingNotifier.cancel(context, transferId);
                        FilesOutgoingNotifier.deletePendingIngress(context, transferId);
                        try {
                            android.content.Context app = context.getApplicationContext();
                            java.io.File stageDir = FilesIngress.stageDirFor(app, transferId);
                            if (stageDir != null) FilesIngress.deleteRecursively(stageDir);
                        } catch (Exception e) {
                            Log.w(TAG, "outgoing dismiss GC failed", e);
                        }
                    }
                    break;
                }
                default:
                    Log.d(TAG, "unknown action: " + action);
                    break;
            }
        } catch (Throwable t) {
            Log.w(TAG, "onReceive failed for " + action, t);
        }
    }
}
