/*
 * Filename: Meta.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Meta.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Packet metadata helpers (purpose inference from action).
 */
package space.u2re.cwsp.protocol.packet;

/**
 * Packet metadata helpers. {@link #inferPurpose(String, String)} mirrors
 * inferCwspPurpose() in normalize.ts.
 */
public final class Meta {

    private Meta() {
    }

    /**
     * Infer a stable logical purpose from the action domain, optionally
     * accepting an explicit hint that overrides inference when valid.
     */
    public static Types.Purpose inferPurpose(String what, String explicit) {
        if (Types.Purpose.isKnown(explicit)) {
            return Types.Purpose.fromWire(explicit);
        }
        String domain = domainOf(what);
        switch (domain) {
            case "airpad":
            case "keyboard":
            case "mouse":
            case "voice":
                return Types.Purpose.AIRPAD;
            case "clipboard":
                return Types.Purpose.CLIPBOARD;
            case "settings":
            case "storage":
                return Types.Purpose.STORAGE;
            case "debug":
                return Types.Purpose.DEBUG;
            case "input":
                return Types.Purpose.INPUT;
            case "notification":
                return Types.Purpose.NOTIFICATION;
            case "sms":
                return Types.Purpose.SMS;
            case "contact":
                return Types.Purpose.CONTACT;
            default:
                return Types.Purpose.GENERAL;
        }
    }

    /** Lower-cased substring before the first {@code :}, or the whole string. */
    public static String domainOf(String what) {
        if (what == null) {
            return "";
        }
        int idx = what.indexOf(':');
        String domain = idx >= 0 ? what.substring(0, idx) : what;
        return domain.toLowerCase();
    }
}
