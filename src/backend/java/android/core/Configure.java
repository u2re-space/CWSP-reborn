/*
 * Filename: Configure.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/core/Configure.java
 * Change date and time: 15.10.00_13.07.2026
 * Reason for changes: Persist bridgeDaemonEnabled so MainActivity can auto-start FGS on launch.
 *
 * SECURITY: never persist tokens/passwords here — only non-secret routing hints.
 */

package core;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
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
     * Extract non-secret routing hints from AppSettings / {@code cwsp} maps and
     * mirror them into SharedPreferences for the foreground service.
     */
    public static void applyFromSettings(Context context, Map<String, Object> bag) {
        if (context == null || bag == null) return;

        Map<String, Object> core = asMap(bag.get("core"));
        Map<String, Object> socket = core != null ? asMap(core.get("socket")) : null;
        Map<String, Object> shell = asMap(bag.get("shell"));
        Map<String, Object> cwsp = asMap(bag.get("cwsp"));
        if (cwsp == null && looksLikeCwspFlat(bag)) cwsp = bag;

        String origin = firstString(
                cwsp,
                "endpointUrl", "endpoint", "origin", "gatewayUrl", "relayHttpsUrl"
        );
        if (origin == null && core != null) {
            origin = firstString(core, "endpointUrl");
        }

        String clientId = firstString(cwsp, "clientId", "nodeId", "byId", "userId", "associatedClientId");
        if (clientId == null && core != null) {
            clientId = firstString(core, "userId", "appClientId");
        }
        clientId = toShortFleetClientId(clientId);

        String routeTarget = firstString(cwsp, "routeTarget", "destinationId", "destinationNodeIds");
        if (routeTarget == null && socket != null) {
            routeTarget = firstString(socket, "routeTarget", "destinationId");
        }
        // Do not take socket.selfId as routeTarget — that competed with Client id.

        String shareDest = firstString(cwsp, "shareIntentDestinationIds", "clipboardShareDestinationIds");
        if (shareDest == null && shell != null) {
            shareDest = firstString(shell, "clipboardShareDestinationIds", "clipboardBroadcastTargets");
        }

        SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor ed = prefs.edit();
        if (origin != null && !origin.isEmpty()) ed.putString("endpointOrigin", origin);
        if (clientId != null && !clientId.isEmpty()) ed.putString("clientId", clientId);
        // WHY: phone-only lists (L-196;L-210) made Android↔Android work but blocked Win images.
        if (routeTarget != null) ed.putString("routeTarget", ensureDeskPeerInCsv(routeTarget));
        if (shareDest != null) ed.putString("shareDestinations", ensureDeskPeerInCsv(shareDest));
        // WHY: MainActivity reads this on LAUNCHER start — default true when unset.
        if (shell != null && shell.containsKey("bridgeDaemonEnabled")) {
            ed.putBoolean("bridgeDaemonEnabled", asTruthy(shell.get("bridgeDaemonEnabled"), true));
        } else if (cwsp != null && cwsp.containsKey("bridgeDaemonEnabled")) {
            ed.putBoolean("bridgeDaemonEnabled", asTruthy(cwsp.get("bridgeDaemonEnabled"), true));
        }
        ed.apply();
    }

    private static boolean asTruthy(Object value, boolean defaultValue) {
        if (value == null) return defaultValue;
        if (value instanceof Boolean) return (Boolean) value;
        String s = String.valueOf(value).trim();
        if (s.isEmpty()) return defaultValue;
        if ("0".equals(s) || "false".equalsIgnoreCase(s) || "no".equalsIgnoreCase(s) || "off".equalsIgnoreCase(s)) {
            return false;
        }
        if ("1".equals(s) || "true".equalsIgnoreCase(s) || "yes".equalsIgnoreCase(s) || "on".equalsIgnoreCase(s)) {
            return true;
        }
        return defaultValue;
    }

    public static String readEndpoint(Context context) {
        if (context == null) return null;
        return context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("endpointOrigin", null);
    }

    public static String readClientId(Context context) {
        if (context == null) return null;
        String raw = context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("clientId", null);
        return toShortFleetClientId(raw);
    }

    /**
     * Prefer short Client-ID in native prefs ({@code L-196}).
     * Collapse full home-LAN form {@code L-192.168.0.196} → {@code L-196}; never expand short → full.
     */
    public static String toShortFleetClientId(String raw) {
        if (raw == null) return null;
        String t = raw.trim();
        if (t.isEmpty()) return t;
        if (t.matches("(?i)L-192\\.168\\.0\\.\\d{1,3}")) {
            return "L-" + t.substring(t.lastIndexOf('.') + 1);
        }
        if (t.matches("(?i)L-\\d{1,3}")) {
            return "L-" + t.substring(2);
        }
        if (t.matches("\\d{1,3}")) {
            return "L-" + t;
        }
        return t;
    }

    public static String readRouteTarget(Context context) {
        if (context == null) return null;
        return context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("routeTarget", null);
    }

    public static String readShareDestinations(Context context) {
        if (context == null) return null;
        return context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("shareDestinations", null);
    }

    /**
     * Clipboard / probe destinations: share list → routeTarget → {@code *}.
     * INVARIANT: non-wildcard lists always include desk peer {@code L-110}.
     * WHY (Decision A): if prefs collapsed to desk-only, expand to fleet phones so
     * Android↔Android still has a peer without requiring Neutralino UI settings.
     */
    public static List<String> readClipboardDestinations(Context context) {
        List<String> fromShare = splitIds(readShareDestinations(context));
        List<String> base = !fromShare.isEmpty() ? fromShare : splitIds(readRouteTarget(context));
        if (base.isEmpty()) {
            List<String> star = new ArrayList<>(1);
            star.add("*");
            return star;
        }
        List<String> ensured = ensureDeskPeerInDestinations(base);
        ensured = ensureFleetPhonesWhenDeskOnly(ensured);
        // Persist one-shot migration so ShareTarget / WS keep desk without waiting for Settings save.
        if (context != null && !joinIds(ensured).equals(joinIds(base))) {
            String csv = joinIds(ensured);
            SharedPreferences prefs = context.getApplicationContext()
                    .getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            SharedPreferences.Editor ed = prefs.edit();
            ed.putString("shareDestinations", csv);
            if (fromShare.isEmpty()) {
                ed.putString("routeTarget", csv);
            }
            ed.apply();
        }
        return ensured;
    }

    /** Desk Neutralino / CWSP endpoint peer id (short fleet form). */
    public static final String DESK_PEER_ID = "L-110";

    /** Fleet phone peers used when prefs collapsed to desk-only. */
    public static final String[] FLEET_PHONE_PEERS = { "L-196", "L-210" };

    public static boolean isDeskPeerId(String id) {
        if (id == null) return false;
        String shortId = toShortFleetClientId(id);
        return DESK_PEER_ID.equalsIgnoreCase(shortId);
    }

    /**
     * When destinations are only {@code L-110}, add default phone peers.
     * Leaves multi-peer / wildcard lists unchanged.
     */
    public static List<String> ensureFleetPhonesWhenDeskOnly(List<String> dests) {
        if (dests == null || dests.isEmpty()) return dests;
        if (dests.size() == 1 && "*".equals(dests.get(0))) return dests;
        boolean onlyDesk = true;
        for (String d : dests) {
            if (!isDeskPeerId(d)) {
                onlyDesk = false;
                break;
            }
        }
        if (!onlyDesk) return dests;
        List<String> out = new ArrayList<>(1 + FLEET_PHONE_PEERS.length);
        out.add(DESK_PEER_ID);
        for (String phone : FLEET_PHONE_PEERS) {
            out.add(phone);
        }
        return out;
    }

    /**
     * Prepend {@code L-110} when missing. Leaves {@code *} alone (wildcard already covers desk).
     */
    public static List<String> ensureDeskPeerInDestinations(List<String> dests) {
        if (dests == null || dests.isEmpty()) {
            List<String> out = new ArrayList<>(1);
            out.add(DESK_PEER_ID);
            return out;
        }
        if (dests.size() == 1 && "*".equals(dests.get(0))) {
            return dests;
        }
        for (String d : dests) {
            if (isDeskPeerId(d)) return dests;
        }
        List<String> out = new ArrayList<>(dests.size() + 1);
        out.add(DESK_PEER_ID);
        out.addAll(dests);
        return out;
    }

    public static String ensureDeskPeerInCsv(String raw) {
        return joinIds(ensureDeskPeerInDestinations(splitIds(raw)));
    }

    public static String joinIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String id : ids) {
            if (id == null || id.isEmpty()) continue;
            if (sb.length() > 0) sb.append(';');
            sb.append(id);
        }
        return sb.toString();
    }

    public static List<String> splitIds(String raw) {
        List<String> out = new ArrayList<>();
        if (raw == null || raw.trim().isEmpty()) return out;
        String[] parts = raw.trim().split("[,;\\s\\n\\r]+");
        Map<String, Boolean> seen = new LinkedHashMap<>();
        for (String part : parts) {
            String id = part != null ? part.trim() : "";
            if (id.isEmpty() || seen.containsKey(id)) continue;
            seen.put(id, Boolean.TRUE);
            out.add(id);
        }
        return out;
    }

    private static boolean looksLikeCwspFlat(Map<String, Object> bag) {
        return bag.containsKey("endpointUrl") || bag.containsKey("clientId") || bag.containsKey("routeTarget");
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object value) {
        if (value instanceof Map) return (Map<String, Object>) value;
        return null;
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
