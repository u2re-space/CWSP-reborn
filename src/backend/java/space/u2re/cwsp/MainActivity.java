/*
 * Filename: MainActivity.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: Capacitor BridgeActivity entrypoint for the CWSP Android shell.
 *
 * WHY: package space.u2re.cwsp matches applicationId/namespace in build.gradle
 * so AGP/d8 can package this class. MainActivity is referenced by AndroidManifest.
 *
 * FIXME(Pass-III): uncomment the Capacitor imports + extends BridgeActivity once
 * `com.capacitorjs:capacitor-android` is wired in build.gradle dependencies.
 * Until then this is a plain Activity stub so the graph is non-empty without
 * resolving the Capacitor artifact.
 */

package space.u2re.cwsp;

// import com.getcapacitor.BridgeActivity;

/**
 * CWSP Capacitor shell entrypoint.
 *
 * Loads the static web bundle (minimal/network/settings/airpad) via the
 * Capacitor bridge and hosts the Java backend hooks (settings, clipboard).
 */
public class MainActivity
        // extends BridgeActivity
{
    /*
     * Pass-III:
     *   @Override
     *   public void onCreate(Bundle savedInstanceState) {
     *       super.onCreate(savedInstanceState);
     *       registerPlugin(SettingsBridge.class);
     *       registerPlugin(ClipboardBridge.class);
     *   }
     */

    // Placeholder no-op constructor so the class is instantiable by the framework
    // before BridgeActivity is wired.
    public MainActivity() {
    }
}
