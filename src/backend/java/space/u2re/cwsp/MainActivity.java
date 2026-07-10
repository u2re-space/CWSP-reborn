/*
 * Filename: MainActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 18.25.00_10.07.2026
 * Reason for changes: Install AndroidX splash before BridgeActivity so theme handoff works.
 */

package space.u2re.cwsp;

import android.os.Bundle;

import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;

/**
 * CWSP Capacitor shell entrypoint.
 *
 * Loads the static web bundle (minimal/network/settings/airpad) via the
 * Capacitor bridge. Plugin registration for settings/clipboard bridges can be
 * added here as those @CapacitorPlugin classes land.
 */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // WHY: must run before super so SplashScreen theme → AppTheme.NoActionBar.
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        // TODO(Pass-III): registerPlugin(SettingsBridge.class) / ClipboardBridge when ready.
    }
}
