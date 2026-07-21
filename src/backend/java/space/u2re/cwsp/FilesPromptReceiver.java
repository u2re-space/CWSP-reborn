/*
 * Filename: FilesPromptReceiver.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/FilesPromptReceiver.java
 * Change date and time: 18.35.00_21.07.2026
 * Reason for changes: Bug B fix — inbound files:offer notifications need
 *   Accept/Decline actions so the user can act on a heads-up without diving
 *   into the app shell. Mirrors ClipboardPromptReceiver's static manifest
 *   receiver pattern: PendingIntents stay deliverable even when the app
 *   process is gone.
 *
 *   2026-07-21e: Accept/Decline now run FilesAcceptRunner (emit files:accept
 *   / files:decline on /ws + materialize embed/url batches). Previously Accept
 *   only launched MainActivity and never signaled the Node desk — no progress,
 *   no landing files.
 *
 *   Actions handled:
 *     space.u2re.cwsp.FILES_INCOMING_ACCEPT  — goAsync → FilesAcceptRunner.accept
 *     space.u2re.cwsp.FILES_INCOMING_DECLINE — FilesAcceptRunner.decline
 *     space.u2re.cwsp.FILES_OUTGOING_DISMISS — Bug A dismiss + GC stage
 *
 * INVARIANT: exported=false — only this app's own PendingIntents can fire it.
 * WHY a static manifest receiver: a dynamic receiver dies with the process;
 * a notification tap after the OS killed the app would otherwise be dropped.
 */
package space.u2re.cwsp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import emission.FilesAcceptRunner;
import emission.FilesIngress;
import emission.FilesOutgoingNotifier;

/**
 * Receiver for inbound files:offer (Accept/Decline) and outgoing-share
 * (Dismiss) notification actions.
 */
public class FilesPromptReceiver extends BroadcastReceiver {

    private static final String TAG = "FilesPromptReceiver";

    public static final String ACTION_INCOMING_ACCEPT = "space.u2re.cwsp.FILES_INCOMING_ACCEPT";
    public static final String ACTION_INCOMING_DECLINE = "space.u2re.cwsp.FILES_INCOMING_DECLINE";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (action == null) return;
        try {
            String transferId = intent.getStringExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID);
            switch (action) {
                case ACTION_INCOMING_ACCEPT: {
                    // WHY: Accept must emit files:accept + write bytes. Launching
                    // MainActivity alone never reached the desk (user symptom).
                    // goAsync keeps the process alive for embed decode / HTTP GET.
                    final PendingResult pending = goAsync();
                    final Context app = context.getApplicationContext();
                    final String tid = transferId;
                    new Thread(() -> {
                        try {
                            FilesAcceptRunner.accept(app, tid);
                        } catch (Throwable t) {
                            Log.w(TAG, "accept runner failed", t);
                        } finally {
                            try { pending.finish(); } catch (Throwable ignored) { /* */ }
                        }
                    }, "cwsp-files-accept").start();
                    // Also bring the shell up so the user can browse CWSP Files.
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
                case FilesOutgoingNotifier.NOTIF_ACTION_DISMISS: {
                    // WHY (Bug A): outgoing-share Dismiss cancels the heads-up
                    // and best-effort GCs the staged Temp + persisted envelope
                    // so a cancelled share does not leak app-private files.
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
            // SECURITY: never let a notification tap crash the receiver process.
            Log.w(TAG, "onReceive failed for " + action, t);
        }
    }
}
