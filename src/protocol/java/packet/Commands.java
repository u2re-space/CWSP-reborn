/*
 * Filename: Commands.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Commands.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Stable CWSP v2 action name constants and the legacy
 *                     verb/action alias tables used by the normalizer.
 *
 * INVARIANT: These action names are part of the stable contract documented in
 *            .cursor/rules/network.mdc. Do not rename without a migration.
 */
package space.u2re.cwsp.protocol.packet;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/** Stable action name constants and compatibility alias resolution. */
public final class Commands {

    // --- Clipboard ---------------------------------------------------------
    public static final String CLIPBOARD_UPDATE = "clipboard:update";
    public static final String CLIPBOARD_WRITE = "clipboard:write";
    public static final String CLIPBOARD_READ = "clipboard:read";
    public static final String CLIPBOARD_GET = "clipboard:get";
    public static final String CLIPBOARD_CLEAR = "clipboard:clear";
    public static final String CLIPBOARD_IS_READY = "clipboard:isReady";

    // --- AirPad-compatible clipboard aliases -------------------------------
    public static final String AIRPAD_CLIPBOARD_WRITE = "airpad:clipboard:write";
    public static final String AIRPAD_CLIPBOARD_READ = "airpad:clipboard:read";
    public static final String AIRPAD_CLIPBOARD_DELIVERY = "airpad:clipboard:delivery";
    public static final String AIRPAD_CLIPBOARD_IS_READY = "airpad:clipboard:isReady";

    // --- Mouse -------------------------------------------------------------
    public static final String MOUSE_MOVE = "mouse:move";
    public static final String MOUSE_CLICK = "mouse:click";
    public static final String MOUSE_SCROLL = "mouse:scroll";
    public static final String MOUSE_DOWN = "mouse:down";
    public static final String MOUSE_UP = "mouse:up";
    public static final String MOUSE_IS_READY = "mouse:isReady";

    // --- Keyboard ----------------------------------------------------------
    public static final String KEYBOARD_TYPE = "keyboard:type";
    public static final String KEYBOARD_TAP = "keyboard:tap";
    public static final String KEYBOARD_TOGGLE = "keyboard:toggle";
    public static final String KEYBOARD_IS_READY = "keyboard:isReady";

    // --- AirPad wrappers ---------------------------------------------------
    public static final String AIRPAD_MOUSE = "airpad:mouse";
    public static final String AIRPAD_KEYBOARD = "airpad:keyboard";

    // --- Voice -------------------------------------------------------------
    public static final String VOICE_SUBMIT = "voice:submit";

    // --- Network / dispatch -----------------------------------------------
    public static final String NETWORK_DISPATCH = "network:dispatch";

    // --- Misc --------------------------------------------------------------
    public static final String NOTIFICATION_SPEAK = "notification:speak";
    public static final String SMS_SEND = "sms:send";
    public static final String DEBUG_LOG = "debug:log";
    public static final String DEBUG_EVENT = "debug:event";
    public static final String DEBUG_SUBSCRIBE = "debug:subscribe";
    public static final String DEBUG_TAIL = "debug:tail";
    public static final String DEBUG_IS_READY = "debug:isReady";

    // --- Legacy verb aliases -> canonical Verb -----------------------------
    // COMPAT: keys are compared case-insensitively after trim.
    private static final Map<String, Types.Verb> VERB_ALIASES;
    static {
        Map<String, Types.Verb> m = new HashMap<>();
        m.put("ask", Types.Verb.ASK);
        m.put("request", Types.Verb.ASK);
        m.put("act", Types.Verb.ACT);
        m.put("signal", Types.Verb.ACT);
        m.put("notify", Types.Verb.ACT);
        m.put("redirect", Types.Verb.ACT);
        m.put("result", Types.Verb.RESULT);
        m.put("response", Types.Verb.RESULT);
        m.put("ack", Types.Verb.RESULT);
        m.put("resolve", Types.Verb.RESULT);
        m.put("error", Types.Verb.ERROR);
        m.put("failure", Types.Verb.ERROR);
        VERB_ALIASES = Collections.unmodifiableMap(m);
    }

    // --- Legacy single-word actions -> canonical namespaced actions --------
    private static final Map<String, String> ACTION_ALIASES;
    static {
        Map<String, String> m = new HashMap<>();
        m.put("clipboard", CLIPBOARD_UPDATE);
        m.put("sms", SMS_SEND);
        m.put("notifications", NOTIFICATION_SPEAK);
        m.put("notify", NOTIFICATION_SPEAK);
        m.put("dispatch", NETWORK_DISPATCH);
        m.put("network.dispatch", NETWORK_DISPATCH);
        m.put("http:dispatch", NETWORK_DISPATCH);
        m.put("request:dispatch", NETWORK_DISPATCH);
        ACTION_ALIASES = Collections.unmodifiableMap(m);
    }

    private Commands() {
    }

    /** @return canonical verb for a raw verb string, or null if unsupported. */
    public static Types.Verb normalizeVerb(String raw) {
        if (raw == null) {
            return null;
        }
        return VERB_ALIASES.get(raw.trim().toLowerCase());
    }

    /**
     * Maps only documented legacy action spellings; namespaced actions pass
     * through unchanged. Blank/missing actions resolve to {@code network:dispatch}.
     */
    public static String canonicalizeAction(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return NETWORK_DISPATCH;
        }
        String action = raw.trim();
        String mapped = ACTION_ALIASES.get(action.toLowerCase());
        return mapped != null ? mapped : action;
    }

    /** Read-only view of the verb alias table (for diagnostics/tests). */
    public static Map<String, Types.Verb> verbAliases() {
        return VERB_ALIASES;
    }

    /** Read-only view of the action alias table (for diagnostics/tests). */
    public static Map<String, String> actionAliases() {
        return ACTION_ALIASES;
    }
}
