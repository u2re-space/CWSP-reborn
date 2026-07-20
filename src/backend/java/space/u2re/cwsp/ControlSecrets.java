/*
 * Filename: ControlSecrets.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlSecrets.java
 * Change date and time: 19.40.00_20.07.2026
 * Reason for changes: Shared secret strip/redact for Control API + Capacitor settings:patch.
 *   SECURITY: ecosystem token must not round-trip through Control GET/POST blobs.
 */

package space.u2re.cwsp;

import android.content.Context;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Extract ecosystem tokens into {@link SecureTokenStore} and redact secrets for Control responses.
 */
public final class ControlSecrets {
    private ControlSecrets() {}

    /**
     * Pull identity tokens into Keystore-backed store and strip them from the patch map
     * before SharedPreferences persistence.
     */
    @SuppressWarnings("unchecked")
    public static void extractAndStoreToken(Context context, Map<String, Object> changes) {
        if (context == null || changes == null) return;
        String token = null;

        Object cwspObj = changes.get("cwsp");
        if (cwspObj instanceof Map) {
            Map<String, Object> cwsp = (Map<String, Object>) cwspObj;
            token = firstString(cwsp, "ecosystemToken", "token", "identificationToken", "accessToken", "userKey");
            stripSecretKeys(cwsp);
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
                    token = firstString(socket, "accessToken", "airpadAuthToken", "clientAccessToken");
                }
                socket.remove("accessToken");
                socket.remove("airpadAuthToken");
                socket.remove("clientAccessToken");
                socket.remove("transportSecret");
                socket.remove("signingSecret");
            }
            core.remove("ecosystemToken");
            core.remove("userKey");
        }

        Object shellObj = changes.get("shell");
        if (shellObj instanceof Map) {
            Map<String, Object> shell = (Map<String, Object>) shellObj;
            if (token == null || token.isEmpty()) {
                token = firstString(shell, "accessToken", "clientToken", "userKey");
            }
            shell.remove("accessToken");
            shell.remove("clientToken");
            shell.remove("userKey");
            shell.remove("password");
        }

        Object bridgeObj = changes.get("bridge");
        if (bridgeObj instanceof Map) {
            Map<String, Object> bridge = (Map<String, Object>) bridgeObj;
            if (token == null || token.isEmpty()) {
                token = firstString(bridge, "userKey", "accessToken", "token");
            }
            bridge.remove("userKey");
            bridge.remove("accessToken");
            bridge.remove("token");
        }

        if (token == null || token.isEmpty()) {
            token = firstString(changes, "ecosystemToken", "identificationToken", "accessToken", "userKey", "token");
        }

        if (token != null && !token.isEmpty()) {
            new SecureTokenStore(context).setToken(token);
        }
        stripSecretKeys(changes);
    }

    /** Deep-copy settings and replace secret string fields with {@code [redacted]}. */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> redactSecrets(Map<String, Object> all) {
        if (all == null) return new LinkedHashMap<>();
        return (Map<String, Object>) redactValue(all);
    }

    @SuppressWarnings("unchecked")
    private static Object redactValue(Object value) {
        if (value instanceof Map) {
            Map<String, Object> in = (Map<String, Object>) value;
            Map<String, Object> out = new LinkedHashMap<>();
            for (Map.Entry<String, Object> e : in.entrySet()) {
                String key = e.getKey();
                if (isSecretKey(key)) {
                    Object v = e.getValue();
                    if (v instanceof String && !((String) v).isEmpty()) {
                        out.put(key, "[redacted]");
                    } else if (v != null) {
                        out.put(key, "[redacted]");
                    }
                    continue;
                }
                out.put(key, redactValue(e.getValue()));
            }
            return out;
        }
        if (value instanceof List) {
            List<?> list = (List<?>) value;
            java.util.ArrayList<Object> out = new java.util.ArrayList<>(list.size());
            for (Object o : list) out.add(redactValue(o));
            return out;
        }
        return value;
    }

    private static void stripSecretKeys(Map<String, Object> map) {
        if (map == null) return;
        map.remove("ecosystemToken");
        map.remove("identificationToken");
        map.remove("accessToken");
        map.remove("userKey");
        map.remove("token");
        map.remove("password");
        map.remove("secret");
        map.remove("clientToken");
        map.remove("controlApiKey");
        map.remove("clientAccessToken");
        map.remove("airpadAuthToken");
        map.remove("transportSecret");
        map.remove("signingSecret");
    }

    private static boolean isSecretKey(String key) {
        if (key == null) return false;
        String k = key.trim();
        return "ecosystemToken".equals(k)
                || "identificationToken".equals(k)
                || "accessToken".equals(k)
                || "userKey".equals(k)
                || "token".equals(k)
                || "password".equals(k)
                || "secret".equals(k)
                || "clientToken".equals(k)
                || "controlApiKey".equals(k)
                || "clientAccessToken".equals(k)
                || "airpadAuthToken".equals(k)
                || "transportSecret".equals(k)
                || "signingSecret".equals(k)
                || "apiKey".equals(k);
    }

    private static String firstString(Map<String, Object> map, String... keys) {
        if (map == null) return null;
        for (String k : keys) {
            Object v = map.get(k);
            if (v instanceof String && !((String) v).isEmpty()) return (String) v;
        }
        return null;
    }
}
