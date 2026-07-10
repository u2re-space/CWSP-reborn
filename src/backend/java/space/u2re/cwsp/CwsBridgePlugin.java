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
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
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

    /** Best-effort WebView handoff when MainActivity is alive; ShareActivity does not need this. */
    public static void emitClipboardAsset(Map<String, Object> asset) {
        CwsBridgePlugin plugin = instance;
        if (plugin == null || asset == null || asset.isEmpty()) return;
        try {
            JSObject handoff = new JSObject();
            handoff.put("type", "clipboard:asset");
            handoff.put("asset", JsonMaps.toJSObject(asset));
            emitNativeMessage(handoff);
            if (plugin.getBridge() != null) {
                plugin.getBridge().triggerWindowJSEvent("cws:clipboardAsset", handoff.toString());
            }
        } catch (Exception e) {
            Log.w(TAG, "emitClipboardAsset failed", e);
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
        // Prefer full AppSettings shape; fall back to legacy cwsp flat map.
        core.Configure.applyFromSettings(getContext(), merged);
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
     * Pull ecosystem / identification / access tokens into {@link SecureTokenStore}
     * and strip them from maps that will be persisted in SharedPreferences.
     * Accepts AppSettings {@code core.*}, legacy {@code cwsp.*}, and airpadJson fields.
     */
    @SuppressWarnings("unchecked")
    private void extractAndStoreToken(Map<String, Object> changes) {
        if (changes == null) return;
        String token = null;

        Object cwspObj = changes.get("cwsp");
        if (cwspObj instanceof Map) {
            Map<String, Object> cwsp = (Map<String, Object>) cwspObj;
            token = firstString(
                    cwsp,
                    "ecosystemToken", "token", "identificationToken", "accessToken", "userKey"
            );
            cwsp.remove("ecosystemToken");
            cwsp.remove("token");
            cwsp.remove("identificationToken");
            cwsp.remove("accessToken");
            cwsp.remove("userKey");
            cwsp.remove("password");
            cwsp.remove("secret");
        }

        Object coreObj = changes.get("core");
        if (coreObj instanceof Map) {
            Map<String, Object> core = (Map<String, Object>) coreObj;
            if (token == null || token.isEmpty()) {
                token = firstString(core, "ecosystemToken", "userKey");
            }
            Object socketObj = core.get("socket");
            if (socketObj instanceof Map) {
                Map<String, Object> socket = (Map<String, Object>) socketObj;
                if (token == null || token.isEmpty()) {
                    token = firstString(socket, "accessToken", "airpadAuthToken");
                }
                // Strip secrets from persisted socket blob.
                socket.remove("accessToken");
                socket.remove("airpadAuthToken");
                socket.remove("clientAccessToken");
                socket.remove("transportSecret");
                socket.remove("signingSecret");
            }
            core.remove("ecosystemToken");
            core.remove("userKey");
        }

        // COMPAT: airpadJson may carry identificationToken / accessToken at top level of payload
        // (handled by caller via appSettings); also accept flat keys on changes.
        if (token == null || token.isEmpty()) {
            token = firstString(
                    changes,
                    "ecosystemToken", "identificationToken", "accessToken", "userKey", "token"
            );
        }

        if (token != null && !token.isEmpty()) {
            new SecureTokenStore(getContext()).setToken(token);
        }
        changes.remove("ecosystemToken");
        changes.remove("identificationToken");
        changes.remove("accessToken");
        changes.remove("userKey");
        changes.remove("token");
        changes.remove("password");
        changes.remove("secret");
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
        String origin = payload != null ? payload.getString("origin", "") : "";
        if (origin == null) origin = "";
        origin = origin.trim();
        while (origin.endsWith("/")) origin = origin.substring(0, origin.length() - 1);

        String what = payload != null ? payload.getString("what", "debug:isReady") : "debug:isReady";
        if (what == null || what.isEmpty()) what = "debug:isReady";
        String clientId = payload != null ? payload.getString("clientId", "") : "";
        String token = payload != null ? payload.getString("token", "") : "";
        String accessToken = payload != null ? payload.getString("accessToken", "") : "";
        if ((token == null || token.isEmpty()) && accessToken != null && !accessToken.isEmpty()) {
            token = accessToken;
        }
        if ((token == null || token.isEmpty())) {
            token = new SecureTokenStore(getContext()).getToken();
        }
        if (clientId == null || clientId.isEmpty()) {
            clientId = core.Configure.readClientId(getContext());
        }

        List<String> nodes = new ArrayList<>();
        if (payload != null) {
            try {
                org.json.JSONArray arr = payload.optJSONArray("nodes");
                if (arr == null) arr = payload.optJSONArray("destinations");
                if (arr != null) {
                    for (int i = 0; i < arr.length(); i++) {
                        String id = String.valueOf(arr.opt(i)).trim();
                        if (!id.isEmpty()) nodes.add(id);
                    }
                }
            } catch (Exception ignored) {
                /* optional */
            }
        }

        long started = System.currentTimeMillis();
        JSObject r = baseResult(false, "network:dispatch-probe");
        if (origin.isEmpty()) {
            r.put("ok", false);
            r.put("error", "empty origin");
            r.put("statusCode", 0);
            return r;
        }

        HttpURLConnection conn = null;
        try {
            URL u = new URL(origin + "/api/network/dispatch");
            conn = (HttpURLConnection) u.openConnection();
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            if (accessToken != null && !accessToken.isEmpty()) {
                conn.setRequestProperty("x-auth-token", accessToken);
            }
            if (token != null && !token.isEmpty()) {
                conn.setRequestProperty("x-cws-token", token);
            }

            org.json.JSONObject body = new org.json.JSONObject();
            body.put("userId", clientId != null ? clientId : "");
            body.put("byId", clientId != null ? clientId : "");
            body.put("from", clientId != null ? clientId : "");
            body.put("clientId", clientId != null ? clientId : "");
            // COMPAT: server-v2 verifyRequestUser historically required userKey.
            body.put("userKey", token != null ? token : "");
            body.put("token", token != null ? token : "");
            body.put("accessToken", accessToken != null && !accessToken.isEmpty() ? accessToken : (token != null ? token : ""));
            body.put("op", "ask");
            body.put("what", what);
            body.put("purpose", what.startsWith("clipboard") ? "clipboard" : "general");
            body.put("payload", new org.json.JSONObject());
            if (!nodes.isEmpty()) {
                body.put("nodes", new org.json.JSONArray(nodes));
                body.put("destinations", new org.json.JSONArray(nodes));
            }

            byte[] bytes = body.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
            conn.getOutputStream().write(bytes);
            int code = conn.getResponseCode();
            java.io.InputStream stream = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
            String snippet = "";
            if (stream != null) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(stream))) {
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null && sb.length() < 240) {
                        sb.append(line);
                    }
                    snippet = sb.toString();
                }
            }
            boolean ok = code >= 200 && code < 300;
            r.put("ok", ok);
            r.put("statusCode", code);
            r.put("bodySnippet", snippet);
            r.put("origin", origin);
            r.put("latencyMs", System.currentTimeMillis() - started);
            if (!ok) r.put("error", "HTTP " + code);
            JSObject echo = new JSObject();
            echo.put("ok", ok);
            echo.put("statusCode", code);
            echo.put("bodySnippet", snippet);
            r.put("echo", echo);
            return r;
        } catch (Exception e) {
            r.put("ok", false);
            r.put("error", e.getMessage() != null ? e.getMessage() : e.toString());
            r.put("latencyMs", System.currentTimeMillis() - started);
            return r;
        } finally {
            if (conn != null) conn.disconnect();
        }
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
