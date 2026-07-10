/*
 * Filename: Configure.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/core/Configure.java
 * Change date and time: 18.35.00_10.07.2026
 * Reason for changes: Persist endpoint/clientId hints from settings blob for the bridge service.
 *
 * SECURITY: never persist tokens/passwords here — only non-secret routing hints.
 */

package core;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.Map;

/**
 * Lightweight endpoint configuration cache for Android native services.
 */
public class Configure {
    private static final String PREFS = "cwsp_configure";

    private String endpointOrigin = null;
    private String clientId = null;

    public void setEndpoint(String origin) {
        this.endpointOrigin = origin;
    }

    public String getEndpoint() {
        return endpointOrigin;
    }

    public void setClientId(String id) {
        this.clientId = id;
    }

    public String getClientId() {
        return clientId;
    }

    /**
     * Extract non-secret routing hints from a {@code cwsp} settings map and
     * mirror them into SharedPreferences for the foreground service.
     */
    public static void applyFromSettings(Context context, Map<String, Object> cwsp) {
        if (context == null || cwsp == null) return;
        String origin = firstString(cwsp, "endpointUrl", "endpoint", "origin", "gatewayUrl");
        String clientId = firstString(cwsp, "clientId", "nodeId", "byId");
        SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        if (origin != null && !origin.isEmpty()) ed.putString("endpointOrigin", origin);
        if (clientId != null && !clientId.isEmpty()) ed.putString("clientId", clientId);
        ed.apply();
    }

    public static String readEndpoint(Context context) {
        if (context == null) return null;
        return context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("endpointOrigin", null);
    }

    public static String readClientId(Context context) {
        if (context == null) return null;
        return context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("clientId", null);
    }

    private static String firstString(Map<String, Object> map, String... keys) {
        for (String k : keys) {
            Object v = map.get(k);
            if (v instanceof String && !((String) v).isEmpty()) return (String) v;
        }
        return null;
    }
}
