/*
 * Filename: MainActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 18.35.00_19.08.2026
 * Reason for changes: Hub Capacitor shell only (CWSP Launcher MainActivity lives in CWSP-shell).
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
 * CWSP Capacitor shell entrypoint (hub SKU).
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
        registerPlugin(CwsBridgePlugin.class);
        registerPlugin(CwsPlatformPlugin.class);
        super.onCreate(savedInstanceState);
        handleConfigureIntent(getIntent());
        ensureBridgeDaemonOnLaunch();
        ControlApiServer.syncFromSettings(getApplicationContext());
    }

    private void ensureBridgeDaemonOnLaunch() {
        try {
            SharedPreferences prefs = getApplicationContext()
                    .getSharedPreferences("cwsp_configure", MODE_PRIVATE);
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
    public void onResume() {
        super.onResume();
        try {
            SharedPreferences prefs = getApplicationContext()
                    .getSharedPreferences("cwsp_configure", MODE_PRIVATE);
            if (!prefs.getBoolean("bridgeDaemonEnabled", true)) return;
            if (CwspBridgeService.isRunning() && !CwspBridgeService.isPaused()) {
                if (!CwspBridgeService.isWsOpen()) {
                    Log.i(TAG, "onResume — /ws not open, requestReconnect");
                    CwspBridgeService.requestReconnect(this);
                }
            } else if (!CwspBridgeService.isRunning()) {
                ensureBridgeDaemonOnLaunch();
            }
        } catch (Exception e) {
            Log.w(TAG, "onResume heal failed", e);
        }
        tryHandleFilesIngressIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleConfigureIntent(intent);
        tryHandleFilesIngressIntent(intent);
    }

    private void tryHandleFilesIngressIntent(Intent intent) {
        if (intent == null) return;
        if (!intent.getBooleanExtra("cwsp_files_ingress", false)
                && !intent.getBooleanExtra(emission.FilesOutgoingNotifier.EXTRA_FILES_INGRESS, false)) {
            return;
        }
        String transferId = intent.getStringExtra("cwsp_files_transfer_id");
        if (transferId == null || transferId.isEmpty()) {
            transferId = intent.getStringExtra(emission.FilesOutgoingNotifier.EXTRA_TRANSFER_ID);
        }
        Log.i(TAG, "files ingress intent transferId=" + transferId + " — requesting drain");
        try {
            CwsBridgePlugin.requestDrainPendingIngress(transferId);
        } catch (Exception e) {
            Log.w(TAG, "requestDrainPendingIngress failed", e);
        }
    }

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
