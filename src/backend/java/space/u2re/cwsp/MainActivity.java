/*
 * Filename: MainActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/MainActivity.java
 * Change date and time: 22.55.00_22.08.2026
 * Reason for changes: Hide 3-button nav; kill Capacitor white splash stripe behind status inset.
 */

package space.u2re.cwsp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

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
        try {
            // WHY: targetSdk 36 ignores setNavigationBarColor; Capacitor 8 SystemBars
            // then pads the WebView and paints windowBackground (opaque 3-button slab).
            EdgeToEdge.enable(
                    this,
                    SystemBarStyle.dark(Color.TRANSPARENT),
                    SystemBarStyle.dark(Color.TRANSPARENT));
        } catch (Exception e) {
            Log.w(TAG, "EdgeToEdge.enable failed", e);
        }
        super.onCreate(savedInstanceState);
        hideNativeTitleBar();
        applyTransparentSystemBars();
        handleConfigureIntent(getIntent());
        ensureBridgeDaemonOnLaunch();
        ControlApiServer.syncFromSettings(getApplicationContext());
    }

    /** WHY: AppTheme used to be DarkActionBar — splash/EdgeToEdge can revive a "CWSP" title strip. */
    private void hideNativeTitleBar() {
        try {
            setTitle("");
            androidx.appcompat.app.ActionBar bar = getSupportActionBar();
            if (bar != null) bar.hide();
        } catch (Exception e) {
            Log.w(TAG, "hide title bar failed", e);
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        hideNativeTitleBar();
        applyTransparentSystemBars();
    }

    /**
     * FIND:navbar
     * WHY: Capacitor 8 + API 35+ draw a black 3-button pad via SystemBars insets.
     * Hide nav (swipe to peek). If OEM ignores hide, keep the bar scrimless.
     */
    private void applyTransparentSystemBars() {
        android.view.Window window = getWindow();
        if (window == null) return;
        try {
            WindowCompat.setDecorFitsSystemWindows(window, false);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.TRANSPARENT);
            window.setNavigationBarColor(Color.TRANSPARENT);
            int chrome = getColor(R.color.colorPrimary);
            window.setBackgroundDrawableResource(R.color.colorPrimary);
            window.getDecorView().setBackgroundColor(chrome);
            try {
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().setBackgroundColor(chrome);
                }
            } catch (Exception ignored) {
                /* bridge not ready until onStart */
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                window.setNavigationBarDividerColor(Color.TRANSPARENT);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setNavigationBarContrastEnforced(false);
                window.setStatusBarContrastEnforced(false);
            }
            WindowInsetsControllerCompat insets =
                    WindowCompat.getInsetsController(window, window.getDecorView());
            if (insets != null) {
                insets.setAppearanceLightStatusBars(false);
                insets.setAppearanceLightNavigationBars(false);
                insets.setSystemBarsBehavior(
                        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                insets.hide(WindowInsetsCompat.Type.navigationBars());
            }
        } catch (Exception e) {
            Log.w(TAG, "transparent system bars failed", e);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applyTransparentSystemBars();
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
        applyTransparentSystemBars();
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
