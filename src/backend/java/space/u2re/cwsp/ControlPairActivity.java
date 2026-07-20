/*
 * Filename: ControlPairActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlPairActivity.java
 * Change date and time: 19.42.00_20.07.2026
 * Reason for changes: Foreground trampoline / fallback UI for Control pair Accept/Deny.
 */

package space.u2re.cwsp;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

/**
 * Handles Control pair notification actions. When launched as notification-disabled
 * fallback ({@code cwsp.promptUi=true}), shows a minimal Accept/Deny dialog.
 */
public class ControlPairActivity extends Activity {
    private static final String TAG = "ControlPairActivity";
    private boolean handled = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (handled) {
            finish();
            return;
        }
        Intent intent = getIntent();
        String pairId = intent != null ? intent.getStringExtra(ControlPairUi.EXTRA_PAIR_ID) : null;
        boolean promptUi = intent != null && intent.getBooleanExtra("cwsp.promptUi", false);
        String action = intent != null ? intent.getAction() : null;

        if (promptUi && pairId != null) {
            handled = true;
            String code = intent.getStringExtra("cwsp.pairCode");
            String origin = intent.getStringExtra("cwsp.origin");
            String msg = "Allow Control access?\n\nCode: "
                    + (code != null ? code : "?")
                    + "\nFrom: "
                    + (origin != null ? origin : "?")
                    + "\n\nAccept only for the official CWSP Control page.";
            new AlertDialog.Builder(this)
                    .setTitle("CWSP — Allow Control?")
                    .setMessage(msg)
                    .setCancelable(false)
                    .setPositiveButton("Accept", (d, w) -> {
                        ControlPairUi.handleAction(this, ControlPairUi.ACTION_ACCEPT, pairId);
                        finish();
                    })
                    .setNegativeButton("Deny", (d, w) -> {
                        ControlPairUi.handleAction(this, ControlPairUi.ACTION_DENY, pairId);
                        finish();
                    })
                    .show();
            return;
        }

        handled = true;
        try {
            if (action != null && pairId != null) {
                ControlPairUi.handleAction(this, action, pairId);
            } else {
                Log.d(TAG, "missing action/pairId");
            }
        } catch (Throwable t) {
            Log.w(TAG, "pair action failed", t);
        } finally {
            finish();
        }
    }
}
