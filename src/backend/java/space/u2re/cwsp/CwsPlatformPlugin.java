/*
 * Filename: CwsPlatformPlugin.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwsPlatformPlugin.java
 * Change date and time: 07.25.00_12.07.2026
 * Reason for changes: Drop SMS permission alias — banks flag READ_SMS as malware-like.
 */

package space.u2re.cwsp;

import android.Manifest;
import android.os.Build;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.util.PermissionHelper;

import java.util.ArrayList;
import java.util.List;

import core.Service;

/**
 * Native half of {@code Capacitor.Plugins.CwsPlatform} used by
 * {@code capacitor-permissions.ts} / {@code capacitor-settings-permissions.ts}.
 *
 * INVARIANT: no SMS permissions — never request READ_SMS / RECEIVE_SMS / SEND_SMS.
 */
@CapacitorPlugin(
        name = "CwsPlatform",
        permissions = {
                @Permission(
                        alias = "notifications",
                        strings = { Manifest.permission.POST_NOTIFICATIONS }
                ),
                @Permission(
                        alias = "contacts",
                        strings = { Manifest.permission.READ_CONTACTS }
                )
        }
)
public class CwsPlatformPlugin extends Plugin {
    private static final String TAG = "CwsPlatform";

    private final Service bridgeService = new Service();

    @PluginMethod
    public void requestRuntimePermissions(PluginCall call) {
        List<String> aliases = new ArrayList<>();
        if (Build.VERSION.SDK_INT >= 33) {
            aliases.add("notifications");
        }
        if (aliases.isEmpty()) {
            JSObject out = new JSObject();
            out.put("prompted", false);
            call.resolve(out);
            return;
        }
        requestPermissionForAliases(aliases.toArray(new String[0]), call, "runtimePermsCallback");
    }

    @PermissionCallback
    private void runtimePermsCallback(PluginCall call) {
        JSObject out = new JSObject();
        out.put("prompted", true);
        call.resolve(out);
    }

    @PluginMethod
    public void canDrawOverlays(PluginCall call) {
        // COMPAT: permanent overlay removed — always report unused/not required.
        JSObject out = new JSObject();
        out.put("granted", true);
        out.put("required", false);
        call.resolve(out);
    }

    @PluginMethod
    public void openOverlaySettings(PluginCall call) {
        // No-op: SYSTEM_ALERT_WINDOW bubble removed; share uses ShareActivity.
        Log.i(TAG, "openOverlaySettings skipped — overlay not required");
        call.resolve();
    }

    @PluginMethod
    public void requestSettingsPermissions(PluginCall call) {
        boolean contacts = Boolean.TRUE.equals(call.getBoolean("contacts", false));
        boolean notifications = Boolean.TRUE.equals(call.getBoolean("notifications", false));
        // WHY: ignore sms/overlay flags — SMS removed (bank malware heuristics); overlay bubble removed.

        List<String> aliases = new ArrayList<>();
        if (contacts) aliases.add("contacts");
        if (notifications && Build.VERSION.SDK_INT >= 33) aliases.add("notifications");

        if (aliases.isEmpty()) {
            JSObject out = new JSObject();
            out.put("prompted", false);
            out.put("results", new JSArray());
            call.resolve(out);
            return;
        }

        requestPermissionForAliases(aliases.toArray(new String[0]), call, "settingsPermsCallback");
    }

    @PermissionCallback
    private void settingsPermsCallback(PluginCall call) {
        JSArray results = new JSArray();

        appendPermResult(results, "notifications", Manifest.permission.POST_NOTIFICATIONS);
        appendPermResult(results, "contacts", Manifest.permission.READ_CONTACTS);

        JSObject out = new JSObject();
        out.put("prompted", true);
        out.put("results", results);
        call.resolve(out);
    }

    private void appendPermResult(JSArray results, String alias, String permission) {
        // Only include rows for permissions that exist on this API / were requested.
        if (Manifest.permission.POST_NOTIFICATIONS.equals(permission) && Build.VERSION.SDK_INT < 33) {
            return;
        }
        boolean granted = PermissionHelper.hasPermissions(getContext(), new String[]{permission});
        JSObject row = new JSObject();
        row.put("permission", permission);
        row.put("alias", alias);
        row.put("granted", granted);
        results.put(row);
    }

    @PluginMethod
    public void startCwspBridge(PluginCall call) {
        try {
            bridgeService.start(getContext());
            // WHY: permanent "CWSP" SYSTEM_ALERT_WINDOW bubble removed — share uses ShareActivity.
            Log.i(TAG, "startCwspBridge ok running=" + bridgeService.isRunning());
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "startCwspBridge failed", e);
            call.reject(e.getMessage(), e);
        }
    }

    @PluginMethod
    public void stopCwspBridge(PluginCall call) {
        try {
            bridgeService.stop(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage(), e);
        }
    }
}
