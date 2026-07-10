/*
 * Filename: CwsBridgePlugin.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwsBridgePlugin.java
 * Change date and time: 18.35.00_10.07.2026
 * Reason for changes: Capacitor CwsBridge — settings/clipboard/network/coordinator IPC for WebView.
 */

package space.u2re.cwsp;

import android.content.Context;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import core.Coordinator;
import core.Settings;
import emission.Clipboard;

/**
 * Native half of {@code registerPlugin("CwsBridge")}.
 *
 * <p>Routes {@code invoke({channel,payload})} into {@link Coordinator} / local
 * Android helpers and returns the {@code CwsBridgeInvokeResult} shape expected
 * by {@code cws-bridge.ts}.</p>
 */
@CapacitorPlugin(name = "CwsBridge")
public class CwsBridgePlugin extends Plugin {
    private static final String TAG = "CwsBridge";

    private Settings settings;
    private Clipboard clipboard;
    private Coordinator coordinator;

    private static volatile CwsBridgePlugin instance;

    @Override
    public void load() {
        Context ctx = getContext();
        settings = new Settings(ctx);
        clipboard = new Clipboard(ctx);
        coordinator = new Coordinator(settings, clipboard);
        instance = this;
        Log.i(TAG, "loaded");
    }

    /** Best-effort push to WebView listeners ({@code nativeMessage}). */
    public static void emitNativeMessage(JSObject payload) {
        CwsBridgePlugin plugin = instance;
        if (plugin == null) return;
        JSObject event = new JSObject();
        event.put("payload", payload);
        plugin.notifyListeners("nativeMessage", event);
    }

    public static void emitShareIntent(String text, String action) {
        CwsBridgePlugin plugin = instance;
        if (plugin == null || plugin.getBridge() == null) return;
        try {
            JSONObject data = new JSONObject();
            data.put("text", text != null ? text : "");
            data.put("action", action != null ? action : "SEND");
            plugin.getBridge().triggerWindowJSEvent("cws:shareIntent", data.toString());
        } catch (Exception e) {
            Log.w(TAG, "emitShareIntent failed", e);
        }
    }

    @PluginMethod
    public void getShellInfo(PluginCall call) {
        JSObject info = new JSObject();
        info.put("shell", "capacitor");
        info.put("bridge", "cws-bridge");
        info.put("native", true);
        info.put("platform", "android");
        call.resolve(info);
    }

    @PluginMethod
    public void invoke(PluginCall call) {
        String channel = call.getString("channel", "");
        if (channel == null || channel.isEmpty()) {
            call.reject("channel required");
            return;
        }
        JSObject payload = call.getObject("payload", new JSObject());
        try {
            JSObject result = dispatch(channel, payload);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "invoke failed channel=" + channel, e);
            JSObject fail = baseResult(false, channel);
            JSObject echo = new JSObject();
            echo.put("error", e.getMessage() != null ? e.getMessage() : e.toString());
            fail.put("echo", echo);
            call.resolve(fail);
        }
    }

    private JSObject dispatch(String channel, JSObject payload) throws Exception {
        switch (channel) {
            case "settings:get":
                return settingsGet();
            case "settings:patch":
                return settingsPatch(payload);
            case "clipboard:read-local":
            case "clipboard:paste-remote":
                return clipboardRead(channel);
            case "clipboard:write-local":
                return clipboardWrite(channel, payload);
            case "clipboard:write-local-image":
                return clipboardWriteImage(channel, payload);
            case "clipboard:isReady":
                return clipboardReady(channel);
            case "network:probe":
                return networkProbe(payload);
            case "network:dispatch-probe":
                return networkDispatchProbe(payload);
            case "coordinator:status":
                return coordinatorStatus();
            case "coordinator:act":
            case "coordinator:ask":
            case "coordinator:dispatch":
                return coordinatorPacket(channel, payload);
            case "coordinator:binary":
                return binaryStub(channel);
            case "runtime:reload-settings":
                return settingsGetReload(channel);
            case "airmouse:start":
            case "airmouse:stop":
                return airmouseStub(channel);
            case "debug:logcat":
                return debugLogcat(payload);
            case "debug:frontend":
                return emptyOk(channel);
            default: {
                // COMPAT: treat unknown as soft-ok so WebView does not hard-fail.
                JSObject r = baseResult(false, channel);
                JSObject echo = new JSObject();
                echo.put("error", "unhandled channel: " + channel);
                r.put("echo", echo);
                return r;
            }
        }
    }

    private JSObject settingsGet() {
        Map<String, Object> all = settings.getAll();
        JSObject r = baseResult(true, "settings:get");
        JSObject appSettings = JsonMaps.toJSObject(all);
        r.put("appSettings", appSettings);
        r.put("nativeSettings", appSettings);
        r.put("echo", appSettings);
        return r;
    }

    private JSObject settingsPatch(JSObject payload) {
        JSObject appSettingsObj = payload.getJSObject("appSettings");
        Map<String, Object> changes = JsonMaps.fromJSObject(
                appSettingsObj != null ? appSettingsObj : payload
        );
        // Also merge shellPatch extras when present.
        JSObject shellPatch = payload.getJSObject("shellPatch");
        if (shellPatch != null) {
            Map<String, Object> shell = JsonMaps.fromJSObject(shellPatch);
            Object existingShell = changes.get("shell");
            if (existingShell instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> mergedShell = new LinkedHashMap<>((Map<String, Object>) existingShell);
                mergedShell.putAll(shell);
                changes.put("shell", mergedShell);
            } else {
                changes.put("shell", shell);
            }
        }

        // SECURITY: extract identity token before SharedPreferences persistence.
        extractAndStoreToken(changes);

        Map<String, Object> merged = settings.patch(changes);
        Object cwsp = merged.get("cwsp");
        if (cwsp instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> c = (Map<String, Object>) cwsp;
            core.Configure.applyFromSettings(getContext(), c);
        }
        // Restart WS if the daemon is already running and config is now complete.
        if (CwspBridgeService.isRunning()) {
            CwspBridgeService.requestReconnect(getContext());
        }
        JSObject r = baseResult(true, "settings:patch");
        JSObject appSettings = JsonMaps.toJSObject(merged);
        r.put("appSettings", appSettings);
        r.put("nativeSettings", appSettings);
        JSObject echo = new JSObject();
        echo.put("ok", true);
        r.put("echo", echo);
        return r;
    }

    /**
     * Pull token/identificationToken/accessToken out of {@code cwsp} into
     * {@link SecureTokenStore} and strip them from the map that will be persisted.
     */
    @SuppressWarnings("unchecked")
    private void extractAndStoreToken(Map<String, Object> changes) {
        if (changes == null) return;
        Object cwspObj = changes.get("cwsp");
        if (!(cwspObj instanceof Map)) return;
        Map<String, Object> cwsp = (Map<String, Object>) cwspObj;
        String token = firstString(cwsp, "token", "identificationToken", "accessToken", "userKey");
        if (token != null && !token.isEmpty()) {
            new SecureTokenStore(getContext()).setToken(token);
        }
        cwsp.remove("token");
        cwsp.remove("identificationToken");
        cwsp.remove("accessToken");
        cwsp.remove("userKey");
        cwsp.remove("password");
        cwsp.remove("secret");
    }

    private static String firstString(Map<String, Object> map, String... keys) {
        for (String k : keys) {
            Object v = map.get(k);
            if (v instanceof String && !((String) v).isEmpty()) return (String) v;
        }
        return null;
    }

    private JSObject settingsGetReload(String channel) {
        JSObject r = settingsGet();
        r.put("channel", channel);
        return r;
    }

    private JSObject clipboardRead(String channel) {
        String text = clipboard.read();
        JSObject r = baseResult(true, channel);
        JSObject echo = new JSObject();
        echo.put("text", text != null ? text : "");
        r.put("echo", echo);
        return r;
    }

    private JSObject clipboardWrite(String channel, JSObject payload) {
        String text = payload.getString("text", "");
        clipboard.write(text != null ? text : "");
        JSObject r = baseResult(true, channel);
        JSObject echo = new JSObject();
        echo.put("ok", true);
        r.put("echo", echo);
        return r;
    }

    private JSObject clipboardWriteImage(String channel, JSObject payload) {
        Map<String, Object> asset = JsonMaps.fromJSObject(payload);
        // Accept nested payload.asset / data.asset shapes.
        if (asset.containsKey("asset") && asset.get("asset") instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> nested = (Map<String, Object>) asset.get("asset");
            asset = nested;
        }
        boolean ok = clipboard.writeAsset(asset);
        if (ok) {
            try {
                JSObject handoff = new JSObject();
                handoff.put("type", "clipboard:asset");
                handoff.put("asset", JsonMaps.toJSObject(asset));
                if (clipboard.lastAssetPath() != null) {
                    handoff.put("path", clipboard.lastAssetPath());
                }
                emitNativeMessage(handoff);
                if (getBridge() != null) {
                    getBridge().triggerWindowJSEvent("cws:clipboardAsset", handoff.toString());
                }
            } catch (Exception e) {
                Log.w(TAG, "clipboard asset WebView handoff failed", e);
            }
        }
        JSObject r = baseResult(ok, channel);
        JSObject echo = new JSObject();
        echo.put("ok", ok);
        if (clipboard.lastAssetHash() != null) echo.put("hash", clipboard.lastAssetHash());
        if (clipboard.lastAssetPath() != null) echo.put("path", clipboard.lastAssetPath());
        if (!ok) echo.put("error", "clipboard asset persist/handoff failed");
        r.put("echo", echo);
        return r;
    }

    private JSObject clipboardReady(String channel) {
        JSObject r = baseResult(true, channel);
        JSObject echo = new JSObject();
        echo.put("ready", true);
        r.put("echo", echo);
        return r;
    }

    private JSObject networkProbe(JSObject payload) {
        JSObject r = baseResult(true, "network:probe");
        com.getcapacitor.JSArray results = new com.getcapacitor.JSArray();
        org.json.JSONArray candidates = payload != null ? payload.optJSONArray("candidates") : null;
        if (candidates != null) {
            for (int i = 0; i < candidates.length(); i++) {
                String url = String.valueOf(candidates.opt(i));
                results.put(probeOne(url));
            }
        }
        JSObject echo = new JSObject();
        echo.put("results", results);
        r.put("echo", echo);
        r.put("results", results);
        return r;
    }

    private JSObject networkDispatchProbe(JSObject payload) {
        String origin = payload.getString("origin", "");
        JSObject one = probeOne(origin);
        boolean reachable = Boolean.TRUE.equals(one.getBoolean("reachable", false));
        JSObject r = baseResult(reachable, "network:dispatch-probe");
        r.put("echo", one);
        Iterator<String> keys = one.keys();
        while (keys.hasNext()) {
            String k = keys.next();
            r.put(k, one.opt(k));
        }
        return r;
    }

    private JSObject probeOne(String url) {
        JSObject row = new JSObject();
        row.put("url", url != null ? url : "");
        if (url == null || url.isEmpty()) {
            row.put("reachable", false);
            row.put("error", "empty url");
            return row;
        }
        HttpURLConnection conn = null;
        try {
            URL u = new URL(url);
            conn = (HttpURLConnection) u.openConnection();
            conn.setConnectTimeout(2500);
            conn.setReadTimeout(2500);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestMethod("GET");
            int code = conn.getResponseCode();
            row.put("statusCode", code);
            row.put("reachable", code > 0 && code < 500);
            row.put("privateNetworkAllowed", true);
        } catch (Exception e) {
            row.put("reachable", false);
            row.put("error", e.getMessage() != null ? e.getMessage() : e.toString());
        } finally {
            if (conn != null) conn.disconnect();
        }
        return row;
    }

    private JSObject coordinatorStatus() {
        JSObject r = baseResult(true, "coordinator:status");
        JSObject echo = new JSObject();
        echo.put("connected", CwspBridgeService.isWsOpen());
        echo.put("daemon", CwspBridgeService.isRunning());
        echo.put("wsOpen", CwspBridgeService.isWsOpen());
        r.put("echo", echo);
        return r;
    }

    private JSObject coordinatorPacket(String channel, JSObject payload) {
        Map<String, Object> packet = JsonMaps.fromJSObject(payload);
        if (!packet.containsKey("what") && payload.getString("what") != null) {
            packet.put("what", payload.getString("what"));
        }
        if (!packet.containsKey("op")) {
            packet.put("op", channel.endsWith("ask") ? "ask" : "act");
        }
        Map<String, Object> out = coordinator.dispatch(packet);
        JSObject r = baseResult(!"error".equals(String.valueOf(out.get("op"))), channel);
        JSObject echo = JsonMaps.toJSObject(out);
        echo.put("sent", true);
        echo.put("result", JsonMaps.toJSObject(out));
        echo.put("body", JsonMaps.toJSObject(out));
        r.put("echo", echo);
        return r;
    }

    private JSObject binaryStub(String channel) {
        JSObject r = baseResult(true, channel);
        JSObject echo = new JSObject();
        echo.put("sent", false);
        echo.put("error", "binary coordinator not wired yet");
        r.put("echo", echo);
        return r;
    }

    private JSObject airmouseStub(String channel) {
        JSObject r = baseResult(true, channel);
        JSObject echo = new JSObject();
        echo.put("ok", true);
        echo.put("active", channel.endsWith("start"));
        r.put("echo", echo);
        return r;
    }

    private JSObject debugLogcat(JSObject payload) {
        int limit = payload.getInteger("limit", 80);
        if (limit < 1) limit = 80;
        if (limit > 400) limit = 400;
        StringBuilder raw = new StringBuilder();
        try {
            Process p = Runtime.getRuntime().exec(new String[]{"logcat", "-d", "-t", String.valueOf(limit)});
            try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    raw.append(line).append('\n');
                }
            }
        } catch (Exception e) {
            raw.append("logcat error: ").append(e.getMessage());
        }
        JSObject r = baseResult(true, "debug:logcat");
        JSObject echo = new JSObject();
        echo.put("raw", raw.toString());
        echo.put("lines", raw.toString().split("\n").length);
        r.put("echo", echo);
        return r;
    }

    private JSObject emptyOk(String channel) {
        JSObject r = baseResult(true, channel);
        r.put("echo", new JSObject());
        return r;
    }

    private static JSObject baseResult(boolean ok, String channel) {
        JSObject r = new JSObject();
        r.put("ok", ok);
        r.put("channel", channel);
        return r;
    }
}
