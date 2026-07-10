/*
 * Filename: MainActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 20.45.00_10.07.2026
 * Reason for changes: Share intents moved to ShareActivity; MainActivity keeps CONFIGURE only.
 */

package space.u2re.cwsp;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;

import java.util.LinkedHashMap;
import java.util.Map;

import core.Configure;

/**
 * CWSP Capacitor shell entrypoint.
 *
 * Registers native plugins. Share / PROCESS_TEXT is handled by {@link ShareActivity}.
 * Debug/E2: {@code am start -a space.u2re.cwsp.CONFIGURE --es endpoint …}.
 */
public class MainActivity extends BridgeActivity {
    private static final String TAG = "CwspMain";
    public static final String ACTION_CONFIGURE = "space.u2re.cwsp.CONFIGURE";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        // WHY: register before super so Bridge discovers plugins during init.
        registerPlugin(CwsBridgePlugin.class);
        registerPlugin(CwsPlatformPlugin.class);
        super.onCreate(savedInstanceState);
        handleConfigureIntent(getIntent());
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
