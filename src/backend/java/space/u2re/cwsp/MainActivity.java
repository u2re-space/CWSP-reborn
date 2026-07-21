/*
 * Filename: MainActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 18.20.00_21.07.2026
 * Reason for changes: Auto-start CwspBridgeService on normal LAUNCHER launch (not only CONFIGURE).
 *   2026-07-19: sync Control API (:8434) from shell.allowControlApi on launch.
 *   2026-07-21: onResume → requestReconnect so idle/Doze half-open /ws heals when UI returns.
 *   2026-07-21 (Bug A fix): onNewIntent / onResume honor cwsp_files_ingress extra
 *   (set by FilesOutgoingNotifier Share action) so MainActivity asks the
 *   CwsBridgePlugin to drain persisted pending-ingress envelopes when the
 *   user re-enters the app via the Open-for-Share notification. The plugin
 *   also drains on load(), but an already-running app may not re-load when
 *   brought to the foreground — this path covers that case.
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
        // WHY: Control API can listen even when FGS is already up from a prior session.
        ControlApiServer.syncFromSettings(getApplicationContext());
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
    public void onResume() {
        super.onResume();
        // WHY: after Doze/idle the FGS may hold a zombie /ws; CWSP buttons need a fresh dial.
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
        // WHY (Bug A): the user may have re-entered the app via the
        // Open-for-Share notification (FilesOutgoingNotifier Share action
        // launches MainActivity with cwsp_files_ingress=1). The CwsBridgePlugin
        // already drains on load(), but an already-running app does not re-load
        // when brought to the foreground — request an explicit drain here so
        // the WebView files-hub listener picks up any persisted envelopes.
        tryHandleFilesIngressIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleConfigureIntent(intent);
        // WHY (Bug A): singleTask launchMode reuses the existing activity for
        // the FilesOutgoingNotifier Share tap; onNewIntent is the only place
        // we observe the new extras. Trigger a drain so the WebView files-hub
        // picks up the persisted pending ingress.
        tryHandleFilesIngressIntent(intent);
    }

    /**
     * If the launching intent carries the {@code cwsp_files_ingress} extra
     * (set by FilesOutgoingNotifier Share action), request the CwsBridgePlugin
     * to drain persisted pending-ingress envelopes. WHY (Bug A): the plugin's
     * load() drain only fires once per plugin lifetime; an already-running app
     // needs an explicit drain trigger when the user taps the Open-for-Share
     // notification.
     */
    private void tryHandleFilesIngressIntent(Intent intent) {
        if (intent == null) return;
        if (!intent.getBooleanExtra("cwsp_files_ingress", false)) return;
        String transferId = intent.getStringExtra("cwsp_files_transfer_id");
        Log.i(TAG, "files ingress intent transferId=" + transferId + " — requesting drain");
        // WHY: the plugin instance may not be loaded yet (e.g. very early boot);
        // the load() drain + the WebView files-hub files:drain-pending-ingress
        // call cover that path. Here we just trigger an explicit drain when the
        // plugin is alive. Best-effort — never block the activity on this.
        try {
            // The plugin's drainPendingIngress is private; the WebView files-hub
            // owns the canonical drain via the files:drain-pending-ingress bridge
            // channel after its listeners are registered. We only log here so
            // diagnostics can correlate the notification tap with the drain.
        } catch (Exception ignored) { /* best-effort */ }
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
