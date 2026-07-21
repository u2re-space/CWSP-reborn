/*
 * Filename: ClipboardPromptActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ClipboardPromptActivity.java
 * Change date and time: 19.28.00_14.07.2026
 * Reason for changes: Foreground trampoline for clipboard prompt Accept/Undo/Share/Erase.
 *   2026-07-21k: ACTION_DOWNLOAD — save inbound image asset to landing.
 *
 * WHY: Android 10+ often denies ClipboardManager.setPrimaryClip from a background
 *   BroadcastReceiver / FGS. Accept appeared to succeed (notif dismissed) while the
 *   OS clipboard stayed on the earlier text. Running the action from a brief
 *   translucent Activity (onResume = focused) makes the write stick.
 *
 * INVARIANT: finish() immediately after dispatch — never show UI or WebView.
 */

package space.u2re.cwsp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

/**
 * Transparent activity that applies clipboard-prompt notification actions
 * while the process is foregrounded, then exits.
 */
public class ClipboardPromptActivity extends Activity {

    private static final String TAG = "ClipboardPromptActivity";
    private boolean handled = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // WHY: translucent ShareOverlay theme; wait for onResume so the window is focused
        // before setPrimaryClip (Android 10+ clipboard write gate).
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (handled) {
            finish();
            return;
        }
        handled = true;

        Intent intent = getIntent();
        String action = intent != null ? intent.getAction() : null;
        try {
            if (action != null) {
                switch (action) {
                    case CwspBridgeService.ACTION_ACCEPT:
                        CwspBridgeService.acceptInbound(this);
                        break;
                    case CwspBridgeService.ACTION_DOWNLOAD:
                        CwspBridgeService.downloadInbound(this);
                        break;
                    case CwspBridgeService.ACTION_UNDO:
                        CwspBridgeService.undoInbound(this);
                        break;
                    case CwspBridgeService.ACTION_SHARE:
                        CwspBridgeService.shareOutbound(this);
                        break;
                    case CwspBridgeService.ACTION_ERASE:
                        CwspBridgeService.eraseOutbound(this);
                        break;
                    case CwspBridgeService.ACTION_DISMISS: {
                        String dir = intent.getStringExtra(CwspBridgeService.EXTRA_DIRECTION);
                        CwspBridgeService.dismissPrompt(this, dir);
                        break;
                    }
                    default:
                        Log.d(TAG, "unknown action: " + action);
                        break;
                }
            }
        } catch (Throwable t) {
            Log.w(TAG, "prompt action failed: " + action, t);
        } finally {
            finish();
        }
    }
}
