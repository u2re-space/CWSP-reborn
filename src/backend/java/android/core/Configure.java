/*
 * Filename: Configure.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/core/Configure.java
 * Change date and time: 15.15.00_20.07.2026
 * Reason for changes: Persist bridgeDaemonEnabled so MainActivity can auto-start FGS on launch.
 *   2026-07-17: clipboard prompt defaults changed to "ask" for both inbound and
 *   outbound modes (Android native always asks; setting stays writable).
 *   2026-07-19: shell.allowControlApi + optional controlApiKey for Android :8434 PNA API.
 *   2026-07-20: one-shot migrate shell clipboard*Mode auto→ask so Accept heads-up posts.
 *
 * SECURITY: never persist ecosystem tokens/passwords here — only non-secret routing hints
 *   and (when no ecosystem token) a generated control API key for the local Control host.
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
        // WHY: Control API (:8434 /service/config) — default off; FGS/MainActivity sync listener.
        if (shell != null && shell.containsKey("allowControlApi")) {
            ed.putBoolean("allowControlApi", asTruthy(shell.get("allowControlApi"), false));
        } else if (cwsp != null && cwsp.containsKey("allowControlApi")) {
            ed.putBoolean("allowControlApi", asTruthy(cwsp.get("allowControlApi"), false));
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
     * Whether the hidden Control API should listen on {@code :8434}.
     * Prefers {@code cwsp_configure} cache, then {@code shell.allowControlApi} in the settings blob.
     */
    public static boolean readAllowControlApi(Context context) {
        if (context == null) return false;
        SharedPreferences prefs = context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (prefs.contains("allowControlApi")) {
            return prefs.getBoolean("allowControlApi", false);
        }
        return readShellBoolean(context, "allowControlApi", false);
    }

    /** Optional generated control key when ecosystem token is absent (not the WS identity token). */
    public static String readControlApiKey(Context context) {
        if (context == null) return null;
        return context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString("controlApiKey", null);
    }

    public static void writeControlApiKey(Context context, String key) {
        if (context == null) return;
        SharedPreferences.Editor ed = context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit();
        if (key == null || key.isEmpty()) {
            ed.remove("controlApiKey");
        } else {
            ed.putString("controlApiKey", key);
        }
        ed.apply();
    }

    // ---- clipboard prompt policy readers (shell.* from the Settings blob) ----
    //
    // WHY: phase-2 clipboard prompts are driven by the same shell.clipboard* keys
    // the Node/Capacitor stack uses (DefaultSettings.java mirrors them). These read
    // the {@code cwsp_settings} JSON blob (not the {@code cwsp_configure} routing
    // hints) so the foreground service and WS client share one policy source.

    /** One-shot flag: old DEFAULT seeded "auto" which never posts Accept notifications. */
    private static final String PREF_CLIPBOARD_ASK_MIGRATED = "clipboardAskHeadsMigratedV1";

    /**
     * WHY: installs created before 2026-07-20 often have shell.clipboard*Mode=auto from
     * DefaultSettings — Accept never appears. Migrate once to ask; user can switch back.
     */
    private static void migrateClipboardAskDefaultsOnce(Context context) {
        if (context == null) return;
        SharedPreferences prefs = context.getApplicationContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (prefs.getBoolean(PREF_CLIPBOARD_ASK_MIGRATED, false)) return;
        try {
            Settings settings = new Settings(context);
            Map<String, Object> all = settings.getAll();
            Object shellObj = all.get("shell");
            Map<String, Object> shell = new LinkedHashMap<>();
            if (shellObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> existing = (Map<String, Object>) shellObj;
                shell.putAll(existing);
            }
            boolean dirty = false;
            Object in = shell.get("clipboardInboundMode");
            if (in == null || "auto".equalsIgnoreCase(String.valueOf(in).trim())) {
                shell.put("clipboardInboundMode", "ask");
                dirty = true;
            }
            Object out = shell.get("clipboardOutboundMode");
            if (out == null || "auto".equalsIgnoreCase(String.valueOf(out).trim())) {
                shell.put("clipboardOutboundMode", "ask");
                dirty = true;
            }
            if (dirty) {
                Map<String, Object> patch = new LinkedHashMap<>();
                patch.put("shell", shell);
                settings.patch(patch);
            }
        } catch (Throwable ignored) {
            /* keep bootable — readers still default to ask when key missing */
        }
        prefs.edit().putBoolean(PREF_CLIPBOARD_ASK_MIGRATED, true).apply();
    }

    /** Read the {@code shell} map from the Settings blob (never null). */
    private static Map<String, Object> readShellMap(Context context) {
        if (context == null) return new LinkedHashMap<>();
        try {
            Settings settings = new Settings(context);
            Map<String, Object> all = settings.getAll();
            Object shell = all.get("shell");
            if (shell instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> m = (Map<String, Object>) shell;
                return m;
            }
        } catch (Throwable ignored) {
            /* COMPAT: corrupt/missing blob → callers fall back to defaults */
        }
        return new LinkedHashMap<>();
    }

    private static String readShellString(Context context, String key, String def) {
        Map<String, Object> shell = readShellMap(context);
        Object v = shell.get(key);
        if (v instanceof String && !((String) v).isEmpty()) return (String) v;
        return def;
    }

    private static boolean readShellBoolean(Context context, String key, boolean def) {
        Map<String, Object> shell = readShellMap(context);
        Object v = shell.get(key);
        if (v instanceof Boolean) return (Boolean) v;
        if (v instanceof String) return asTruthy(v, def);
        return def;
    }

    private static long readShellLong(Context context, String key, long def) {
        Map<String, Object> shell = readShellMap(context);
        Object v = shell.get(key);
        if (v instanceof Number) return ((Number) v).longValue();
        if (v instanceof String) {
            try {
                return Long.parseLong(((String) v).trim());
            } catch (NumberFormatException ignored) {
            }
        }
        return def;
    }

    /**
     * shell.clipboardInboundMode → "ask" | "auto".
     * WHY: Android native default is "ask" — inbound clipboard should be user-confirmed
     * before overwriting the OS clipboard; the setting stays writable so users can
     * switch to "auto" from Settings. Default changed from "auto" to "ask" on 2026-07-17.
     */
    public static String readClipboardInboundMode(Context context) {
        migrateClipboardAskDefaultsOnce(context);
        String m = readShellString(context, "clipboardInboundMode", "ask");
        return "ask".equalsIgnoreCase(m) ? "ask" : "auto";
    }

    /**
     * shell.clipboardOutboundMode → "ask" | "auto".
     * WHY: Android native always asks before sharing outbound clipboard (spec).
     * The setting remains read so users can switch to "auto"; default is "ask".
     */
    public static String readClipboardOutboundMode(Context context) {
        migrateClipboardAskDefaultsOnce(context);
        String m = readShellString(context, "clipboardOutboundMode", "ask");
        return "ask".equalsIgnoreCase(m) ? "ask" : "auto";
    }

    public static boolean readClipboardInboundShowUndo(Context context) {
        return readShellBoolean(context, "clipboardInboundShowUndo", true);
    }

    public static boolean readClipboardOutboundShowErase(Context context) {
        return readShellBoolean(context, "clipboardOutboundShowErase", true);
    }

    /** Auto-dismiss window for clipboard prompt notifications (default 10000ms). */
    public static long readClipboardPromptDismissMs(Context context) {
        long ms = readShellLong(context, "clipboardPromptDismissMs", 10000L);
        return ms > 0 ? ms : 10000L;
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
