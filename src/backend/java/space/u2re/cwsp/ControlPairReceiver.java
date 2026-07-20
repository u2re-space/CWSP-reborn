/*
 * Filename: ControlPairReceiver.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlPairReceiver.java
 * Change date and time: 19.42.00_20.07.2026
 * Reason for changes: Compat broadcast path for Control pair Accept/Deny.
 */

package space.u2re.cwsp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * COMPAT: notification actions prefer {@link ControlPairActivity}; receiver kept for
 * explicit broadcast PendingIntents if needed.
 */
public class ControlPairReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String pairId = intent.getStringExtra(ControlPairUi.EXTRA_PAIR_ID);
        ControlPairUi.handleAction(context, action, pairId);
    }
}
