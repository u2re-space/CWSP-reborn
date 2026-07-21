/*
 * Filename: CwsBridgePlugin.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/CwsBridgePlugin.java
 * Change date and time: 18.50.00_13.07.2026
 * Reason for changes: coordinator:* fans out via CwspWsClient; reload-settings reconnects Java /ws.
 *   2026-07-19: settings:patch syncs ControlApiServer (:8434) from shell.allowControlApi.
 *   2026-07-20: app:update:check|install for gateway APK sideload.
 *   2026-07-20: settings:get returns Configure-enriched Relay (not SPA page-host).
 *   2026-07-21: emitFilesIngress(JSONObject) hands staged files-hub Temp to WebView (Task 5).
 *   2026-07-21 (Task 6): files:list-staged / files:read-batch / files:put-blob bridge
 *   channels so the Capacitor files-hub can pack staged batches via Java and emit
 *   a canonical files:offer over the shared /ws.
 *   2026-07-21 (Task 6 re-fix): filesReadBatch now mirrors `ok` onto `echo` on
 *   every return path (success + failure) so the WebView hub can read either
 *   top-level `result.ok` or `echo.ok`; aligns with files:put-blob.
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
import java.util.UUID;

import core.Coordinator;
import core.Service;
import core.Settings;
import emission.Clipboard;
import emission.FilesBatchMaterializer;
import emission.FilesIngress;

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

    /**
     * Hand a staged files-ingress envelope to the WebView files-hub listener.
     * WHY: Task 5 stages Open-with / share-target streams into app-private
     * Temp; the Capacitor listener (Task 6) subscribes to {@code cwspFilesIngress}
     * and runs decideOfferAfterStage → pack → files:offer. Minimal stub here;
     * the full Cap listener is Task 6.
     */
    public static void emitFilesIngress(JSONObject ingress) {
        CwsBridgePlugin plugin = instance;
        if (plugin == null || ingress == null) return;
        try {
            JSObject event = new JSObject();
            event.put("ingress", ingress);
            plugin.notifyListeners("cwspFilesIngress", event);
            if (plugin.getBridge() != null) {
                plugin.getBridge().triggerWindowJSEvent("cws:filesIngress", ingress.toString());
            }
        } catch (Exception e) {
            Log.w(TAG, "emitFilesIngress failed", e);
        }
    }

    @PluginMethod
    public void getShellInfo(PluginCall call) {
        JSObject info = new JSObject();
        info.put("shell", "capacitor");
        info.put("bridge", "cws-bridge");
        info.put("native", true);
        info.put("platform", "android");
        try {
            JSObject ver = AppUpdateHelper.info(getContext());
            if (ver != null) {
                Integer code = ver.getInteger("versionCode");
                if (code != null) info.put("versionCode", code.intValue());
                info.put("versionName", ver.getString("versionName", ""));
                JSObject echo = ver.getJSObject("echo");
                if (echo != null) {
                    info.put("signatureSha256", echo.getString("signatureSha256", ""));
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "getShellInfo version attach failed", e);
        }
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
            case "app:info":
            case "app:version":
                return AppUpdateHelper.info(getContext());
            case "app:update:check":
                return AppUpdateHelper.check(getContext(), payload);
            case "app:update:install":
                return AppUpdateHelper.install(getContext(), getActivity(), payload);
            case "control:pairing:status":
                return controlPairingStatus();
            case "control:public-token:regenerate":
                return controlPublicTokenRegenerate();
            // Task 6: files-hub pack bridge — Java owns staging + materialization;
            // the Capacitor WebView hub asks Java for staged list / batch bytes and
            // learns that HTTP PUT (files:put-blob) is not wired in Wave 3.
            case "files:list-staged":
                return filesListStaged(payload);
            case "files:read-batch":
                return filesReadBatch(payload);
            case "files:put-blob":
                return filesPutBlob(payload);
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
        // WHY: same enrich as Control GET — Relay field must show Configure.endpointOrigin, not SPA host.
        Map<String, Object> all = ControlApiServer.readEnrichedSettings(getContext());
        JSObject r = baseResult(true, "settings:get");
        JSObject appSettings = JsonMaps.toJSObject(all);
        r.put("appSettings", appSettings);
        r.put("nativeSettings", appSettings);
        r.put("echo", appSettings);
        // Diagnostics for Settings UI / automation (not persisted).
        JSObject control = new JSObject();
        control.put("listening", ControlApiServer.isListening());
        control.put("port", ControlApiServer.listeningPort());
        control.put("path", "/service/config");
        r.put("controlApi", control);
        r.put("controlPairing", controlPairingPayload());
        return r;
    }

    private JSObject controlPairingPayload() {
        Context ctx = getContext();
        JSObject pairing = new JSObject();
        String pub = ControlPublicToken.ensure(ctx);
        pairing.put("publicToken", pub);
        pairing.put("deviceCode", ControlRotatingCode.currentCode(ctx));
        pairing.put("expiresInMs", ControlRotatingCode.expiresInMs());
        pairing.put("periodMs", ControlRotatingCode.PERIOD_MS);
        pairing.put("sessionTtlMs", ControlPairStore.SESSION_TTL_MS);
        pairing.put("listening", ControlApiServer.isListening());
        pairing.put("port", ControlApiServer.listeningPort());
        return pairing;
    }

    private JSObject controlPairingStatus() {
        JSObject r = baseResult(true, "control:pairing:status");
        r.put("echo", controlPairingPayload());
        r.put("controlPairing", controlPairingPayload());
        return r;
    }

    private JSObject controlPublicTokenRegenerate() {
        String token = ControlPublicToken.regenerate(getContext());
        JSObject r = baseResult(true, "control:public-token:regenerate");
        JSObject echo = controlPairingPayload();
        echo.put("publicToken", token);
        r.put("echo", echo);
        r.put("controlPairing", echo);
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
        ControlSecrets.extractAndStoreToken(getContext(), changes);

        Map<String, Object> merged = settings.patch(changes);
        // Prefer full AppSettings shape; fall back to legacy cwsp flat map.
        core.Configure.applyFromSettings(getContext(), merged);
        Object cwsp = merged.get("cwsp");
        if (cwsp instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> c = (Map<String, Object>) cwsp;
            core.Configure.applyFromSettings(getContext(), c);
        }
        // WHY: Allow Control API toggle must bind/unbind :8434 without requiring a full app restart.
        ControlApiServer.syncFromSettings(getContext());
        // Restart WS if the daemon is already running and config is now complete.
        // Cold-start when Settings/WebView patch arrives before MainActivity auto-start.
        if (CwspBridgeService.isRunning()) {
            CwspBridgeService.requestReconnect(getContext());
        } else {
            boolean daemonEnabled = true;
            Object shellObj = merged.get("shell");
            if (shellObj instanceof Map) {
                Object flag = ((Map<?, ?>) shellObj).get("bridgeDaemonEnabled");
                if (flag instanceof Boolean) {
                    daemonEnabled = (Boolean) flag;
                } else if (flag != null) {
                    String s = String.valueOf(flag).trim();
                    if ("0".equals(s) || "false".equalsIgnoreCase(s) || "no".equalsIgnoreCase(s)) {
                        daemonEnabled = false;
                    }
                }
            }
            if (daemonEnabled) {
                try {
                    new core.Service().start(getContext());
                    Log.i(TAG, "settingsPatch cold-started CwspBridgeService");
                } catch (Exception e) {
                    Log.w(TAG, "settingsPatch bridge start failed", e);
                }
            }
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

    private JSObject settingsGetReload(String channel) {
        // WHY: WebView Save & Reconnect / AirPad must refresh Java /ws after identity patch.
        try {
            if (!CwspBridgeService.isRunning()) {
                new Service().start(getContext());
            }
            CwspBridgeService.requestReconnect(getContext());
        } catch (Exception e) {
            Log.w(TAG, "runtime:reload-settings reconnect failed", e);
        }
        JSObject r = settingsGet();
        r.put("channel", channel);
        JSObject echo = r.getJSObject("echo");
        if (echo == null) echo = new JSObject();
        echo.put("wsOpen", CwspBridgeService.isWsOpen());
        echo.put("daemon", CwspBridgeService.isRunning());
        r.put("echo", echo);
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

    /**
     * Local-only coordinator ops (settings / local clipboard probes).
     * INVARIANT: mouse/keyboard/clipboard fan-out must go over {@link CwspWsClient}, not local 404.
     */
    private static boolean isLocalCoordinatorWhat(String what) {
        if (what == null || what.isEmpty()) return false;
        if (what.startsWith("settings:")) return true;
        switch (what) {
            case "clipboard:isReady":
            case "airpad:clipboard:isReady":
            case "clipboard:read":
            case "clipboard:get":
                return true;
            default:
                return false;
        }
    }

    private void normalizeOutboundCoordinatorPacket(Map<String, Object> packet) {
        String clientId = core.Configure.readClientId(getContext());
        if (clientId == null) clientId = "";
        Object uuid = packet.get("uuid");
        if (!(uuid instanceof String) || ((String) uuid).isEmpty()) {
            packet.put("uuid", UUID.randomUUID().toString());
        }
        if (!packet.containsKey("timestamp")) {
            packet.put("timestamp", System.currentTimeMillis());
        }
        if (!packet.containsKey("protocol")) packet.put("protocol", "ws");
        if (!packet.containsKey("transport")) packet.put("transport", "ws");
        if (!packet.containsKey("sender") || String.valueOf(packet.get("sender")).isEmpty()) {
            packet.put("sender", clientId);
        }
        if (!packet.containsKey("byId") || String.valueOf(packet.get("byId")).isEmpty()) {
            packet.put("byId", clientId);
        }
        Object nodes = packet.get("nodes");
        if (nodes instanceof List && !packet.containsKey("destinations")) {
            packet.put("destinations", nodes);
        }
        Object destinations = packet.get("destinations");
        if (destinations instanceof List && !packet.containsKey("nodes")) {
            packet.put("nodes", destinations);
        }
        Map<String, Object> flags;
        Object flagsObj = packet.get("flags");
        if (flagsObj instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> existing = (Map<String, Object>) flagsObj;
            flags = new LinkedHashMap<>(existing);
        } else {
            flags = new LinkedHashMap<>();
        }
        flags.put("canonicalV2", true);
        packet.put("flags", flags);
        if (!packet.containsKey("purpose")) {
            String what = String.valueOf(packet.getOrDefault("what", ""));
            if (what.startsWith("clipboard:") || what.startsWith("airpad:clipboard:")) {
                packet.put("purpose", "clipboard");
            } else if (what.startsWith("mouse:") || what.startsWith("keyboard:")
                    || what.startsWith("airpad:") || what.startsWith("voice:")) {
                packet.put("purpose", "airpad");
            } else {
                packet.put("purpose", "general");
            }
        }
        if (!packet.containsKey("type") && packet.get("what") != null) {
            packet.put("type", packet.get("what"));
        }
    }

    private boolean sendCoordinatorViaSharedWs(Map<String, Object> packet) {
        try {
            if (!CwspBridgeService.isRunning()) {
                new Service().start(getContext());
            }
            CwspWsClient ws = CwspBridgeService.getSharedWs();
            if (ws == null || !ws.isOpen()) {
                CwspBridgeService.requestReconnect(getContext());
                ws = CwspBridgeService.getSharedWs();
                if (ws != null) {
                    ws.waitUntilConnected(3500L);
                }
            }
            if (ws == null) {
                Log.w(TAG, "coordinator send: shared WS null");
                return false;
            }
            return ws.send(packet);
        } catch (Exception e) {
            Log.w(TAG, "coordinator send failed", e);
            return false;
        }
    }

    private JSObject coordinatorPacket(String channel, JSObject payload) {
        Map<String, Object> packet = JsonMaps.fromJSObject(payload);
        if (!packet.containsKey("what") && payload.getString("what") != null) {
            packet.put("what", payload.getString("what"));
        }
        if (!packet.containsKey("op")) {
            packet.put("op", channel.endsWith("ask") ? "ask" : "act");
        }
        String what = String.valueOf(packet.getOrDefault("what", ""));

        // Local settings/clipboard probes stay on in-process Coordinator.
        if (isLocalCoordinatorWhat(what)) {
            Map<String, Object> out = coordinator.dispatch(packet);
            JSObject r = baseResult(!"error".equals(String.valueOf(out.get("op"))), channel);
            JSObject echo = JsonMaps.toJSObject(out);
            echo.put("sent", true);
            echo.put("result", JsonMaps.toJSObject(out));
            echo.put("body", JsonMaps.toJSObject(out));
            r.put("echo", echo);
            return r;
        }

        // WHY: AirPad mouse/keyboard + clipboard fan-out must use Java /ws (WebView socket dark).
        normalizeOutboundCoordinatorPacket(packet);
        boolean sent = sendCoordinatorViaSharedWs(packet);
        JSObject r = baseResult(sent, channel);
        JSObject echo = new JSObject();
        echo.put("sent", sent);
        echo.put("wsOpen", CwspBridgeService.isWsOpen());
        echo.put("daemon", CwspBridgeService.isRunning());
        if (!sent) {
            // WHY: UI used to show ok=true on half-open; surface honest failure so wake-heal can run.
            echo.put("error", CwspBridgeService.isWsOpen() ? "ws-send-failed" : "ws-not-open");
            r.put("ok", false);
        }
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

    // ------------------------------------------------------------------
    // Task 6: files-hub pack bridge
    // ------------------------------------------------------------------

    /**
     * List staged files for a transferId. WHY: the WebView files-hub asks Java
     * for the fresh staged list instead of trusting only the ingress envelope.
     * Returns {@code {files:[{name,size,path}], stageDir}}.
     */
    private JSObject filesListStaged(JSObject payload) {
        String transferId = payload != null ? payload.getString("transferId", "") : "";
        JSObject r = baseResult(true, "files:list-staged");
        JSObject echo = new JSObject();
        if (transferId == null || transferId.isEmpty()) {
            r.put("ok", false);
            echo.put("error", "transferId required");
            r.put("echo", echo);
            return r;
        }
        File stageDir = FilesIngress.stageDirFor(getContext(), transferId);
        java.util.List<FilesIngress.StagedFile> staged = FilesIngress.listStaged(stageDir);
        com.getcapacitor.JSArray arr = new com.getcapacitor.JSArray();
        for (FilesIngress.StagedFile f : staged) {
            JSObject fo = new JSObject();
            fo.put("name", f.name);
            fo.put("size", f.size);
            fo.put("path", f.path);
            arr.put(fo);
        }
        echo.put("files", arr);
        echo.put("stageDir", stageDir != null ? stageDir.getAbsolutePath() : "");
        r.put("echo", echo);
        return r;
    }

    /**
     * Materialize one batch (zip / gzip / raw) from staged files and return
     * base64 bytes + hash + size + mimeType. WHY: the WebView hub builds the
     * DataAsset envelope from this; for batches larger than the embed budget
     * the hub calls {@code files:put-blob} (stub) and, on failure, emits
     * {@code files:error} instead of a broken offer.
     */
    private JSObject filesReadBatch(JSObject payload) {
        JSObject r = baseResult(true, "files:read-batch");
        JSObject echo = new JSObject();
        String transferId = payload != null ? payload.getString("transferId", "") : "";
        String batchId = payload != null ? payload.getString("batchId", "") : "";
        String kind = payload != null ? payload.getString("kind", "raw") : "raw";
        if (transferId == null || transferId.isEmpty() || batchId == null || batchId.isEmpty()) {
            r.put("ok", false);
            echo.put("ok", false);
            echo.put("error", "transferId+batchId required");
            r.put("echo", echo);
            return r;
        }
        java.util.List<String> names = new ArrayList<>();
        try {
            org.json.JSONArray arr = payload != null ? payload.optJSONArray("names") : null;
            if (arr != null) {
                for (int i = 0; i < arr.length(); i++) names.add(String.valueOf(arr.opt(i)));
            }
        } catch (Exception ignored) { /* optional */ }
        if (names.isEmpty()) {
            r.put("ok", false);
            echo.put("ok", false);
            echo.put("error", "names required");
            r.put("echo", echo);
            return r;
        }
        try {
            File stageDir = FilesIngress.stageDirFor(getContext(), transferId);
            FilesBatchMaterializer.MaterializedBatch mb =
                    FilesIngress.materializeBatch(stageDir, kind, names);
            String base64 = android.util.Base64.encodeToString(
                    mb.bytes, android.util.Base64.NO_WRAP);
            echo.put("batchId", batchId);
            echo.put("ok", true);
            echo.put("kind", mb.kind);
            echo.put("ext", mb.ext);
            echo.put("mimeType", mb.mimeType);
            echo.put("size", mb.bytes.length);
            echo.put("hash", mb.hash);
            echo.put("data", base64);
            r.put("echo", echo);
            return r;
        } catch (Exception e) {
            Log.w(TAG, "files:read-batch failed", e);
            r.put("ok", false);
            echo.put("ok", false);
            echo.put("error", e.getMessage() != null ? e.getMessage() : e.toString());
            r.put("echo", echo);
            return r;
        }
    }

    /**
     * Documented putBlob stub. WHY: HTTP PUT to a desk-reachable
     * {@code /files/blob/<transferId>/<batchId>} endpoint is not wired in Wave 3.
     * Returns {@code ok:false, error:CWSP_FILES_PUT_BLOB_UNAVAILABLE} so the
     * WebView hub can fall back to base64 embed (small) or emit files:error (large).
     */
    private JSObject filesPutBlob(JSObject payload) {
        String transferId = payload != null ? payload.getString("transferId", "") : "";
        String batchId = payload != null ? payload.getString("batchId", "") : "";
        FilesBatchMaterializer.PutBlobResult stub =
                FilesIngress.putBlobStub(transferId, batchId);
        JSObject r = baseResult(stub.ok, "files:put-blob");
        JSObject echo = new JSObject();
        echo.put("ok", stub.ok);
        echo.put("error", stub.error);
        if (stub.url != null) echo.put("url", stub.url);
        if (stub.token != null) echo.put("token", stub.token);
        r.put("echo", echo);
        return r;
    }

    private static JSObject baseResult(boolean ok, String channel) {
        JSObject r = new JSObject();
        r.put("ok", ok);
        r.put("channel", channel);
        return r;
    }
}
