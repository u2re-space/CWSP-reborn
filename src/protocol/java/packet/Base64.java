/*
 * Filename: Base64.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Base64.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin wrapper over java.util.Base64 for packet helpers.
 */
package space.u2re.cwsp.protocol.packet;

/** Base64 helpers for packet/data-asset encoding. */
public final class Base64 {

    private Base64() {
    }

    public static String encode(byte[] bytes) {
        return java.util.Base64.getEncoder().encodeToString(bytes);
    }

    public static byte[] decode(String s) {
        return java.util.Base64.getDecoder().decode(s);
    }

    public static String encodeUrl(byte[] bytes) {
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public static byte[] decodeUrl(String s) {
        return java.util.Base64.getUrlDecoder().decode(s);
    }
}
