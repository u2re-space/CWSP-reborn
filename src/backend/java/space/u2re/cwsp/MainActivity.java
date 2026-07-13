/*
 * Filename: MainActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 15.10.00_13.07.2026
 * Reason for changes: Auto-start CwspBridgeService on normal LAUNCHER launch (not only CONFIGURE).
 */

package space.u2re.cwsp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;

import java.util.LinkedHashMap;
import java.util.Map;

import core.Configure;
import core.Service;

/**
 * CWSP Capacitor shell entrypoint.
 *
 * Registers native plugins. Share / PROCESS_TEXT is handled by {@link ShareActivity}.
 * Debug/E2: {@code am start -a space.u2re.cwsp.CONFIGURE --es endpoint …}.
 *
 * INVARIANT: normal MAIN/LAUNCHER launch also starts {@link CwspBridgeService}
 * when {@code bridgeDaemonEnabled} is not explicitly false (default on).
 */
public class MainActivity extends BridgeActivity {
    private static final String TAG = "CwspMain";
    public static final String ACTION_CONFIGURE = "space.u2re.cwsp.CONFIGURE";

    private final Service bridgeService = new Service();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        // WHY: register before super so Bridge discovers plugins during init.
        registerPlugin(CwsBridgePlugin.class);
        registerPlugin(CwsPlatformPlugin.class);
        super.onCreate(savedInstanceState);
        handleConfigureIntent(getIntent());
        // WHY: CONFIGURE path may already start the service; ensureBridge is idempotent enough.
        ensureBridgeDaemonOnLaunch();
    }

    /**
     * Cold-start clipboard/WS foreground service on app open.
     * Settings Save and ShareActivity also start it — this covers normal launcher use.
     */
    private void ensureBridgeDaemonOnLaunch() {
        try {
            SharedPreferences prefs = getApplicationContext()
                    .getSharedPreferences("cwsp_configure", MODE_PRIVATE);
            // Default true — matches AppSettings.shell.bridgeDaemonEnabled.
            boolean enabled = prefs.getBoolean("bridgeDaemonEnabled", true);
            if (!enabled) {
                Log.i(TAG, "bridge daemon disabled in prefs — skip auto-start");
                return;
            }
            if (CwspBridgeService.isRunning()) {
                CwspBridgeService.requestReconnect(this);
                return;
            }
            bridgeService.start(this);
            Log.i(TAG, "bridge daemon auto-started on launch");
        } catch (Exception e) {
            Log.w(TAG, "bridge auto-start failed", e);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleConfigureIntent(intent);
    }

    /**
     * E2 / automation: apply endpoint + clientId + token, optionally start bridge.
     * SECURITY: token goes to {@link SecureTokenStore} only — never SharedPreferences.
     */
    private void handleConfigureIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        boolean hasExtras =
                intent.hasExtra("endpoint")
                        || intent.hasExtra("clientId")
                        || intent.hasExtra("token");
        if (!ACTION_CONFIGURE.equals(action) && !hasExtras) return;

        String endpoint = intent.getStringExtra("endpoint");
        String clientId = intent.getStringExtra("clientId");
        String token = intent.getStringExtra("token");
        boolean startBridge = intent.getBooleanExtra("startBridge", true);

        Map<String, Object> cwsp = new LinkedHashMap<>();
        if (endpoint != null && !endpoint.isEmpty()) cwsp.put("endpointUrl", endpoint);
        if (clientId != null && !clientId.isEmpty()) cwsp.put("clientId", clientId);
        if (!cwsp.isEmpty()) {
            Configure.applyFromSettings(getApplicationContext(), cwsp);
        }
        if (token != null && !token.isEmpty()) {
            new SecureTokenStore(getApplicationContext()).setToken(token);
        }
        Log.i(TAG, "CONFIGURE applied endpoint="
                + (endpoint != null) + " clientId=" + (clientId != null)
                + " token=" + (token != null && !token.isEmpty())
                + " startBridge=" + startBridge);

        if (startBridge) {
            try {
                Intent svc = new Intent(this, CwspBridgeService.class);
                svc.setAction("space.u2re.cwsp.RECONNECT");
                if (android.os.Build.VERSION.SDK_INT >= 26) {
                    startForegroundService(svc);
                } else {
                    startService(svc);
                }
            } catch (Exception e) {
                Log.w(TAG, "start bridge failed", e);
            }
        }
    }
}
