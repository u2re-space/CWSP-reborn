/*
 * Filename: ControlPublicToken.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlPublicToken.java
 * Change date and time: 20.05.00_20.07.2026
 * Reason for changes: Persistent regenerable Control public token (not ecosystem WS token).
 *   SECURITY: seeds rotating deviceCode HMAC; SPA pairing requires publicToken + live code.
 */

package space.u2re.cwsp;

import android.content.Context;
import android.util.Log;

import java.security.SecureRandom;
import java.util.Locale;

import core.Configure;

/**
 * Long-lived Control pairing credential shown in Settings.
 * Independent from the ecosystem / WS identity token in {@link SecureTokenStore}.
 */
public final class ControlPublicToken {
    private static final String TAG = "ControlPublicToken";
    private static final SecureRandom RNG = new SecureRandom();

    private ControlPublicToken() {}

    /** Ensure a public token exists; return the current value. */
    public static String ensure(Context context) {
        String existing = read(context);
        if (existing != null && !existing.isBlank()) return existing.trim();
        return regenerate(context);
    }

    public static String read(Context context) {
        if (context == null) return "";
        String key = Configure.readControlPublicToken(context);
        if (key != null && !key.isBlank()) return key.trim();
        // COMPAT: migrate legacy generated controlApiKey into public token slot once.
        String legacy = Configure.readControlApiKey(context);
        if (legacy != null && !legacy.isBlank() && legacy.startsWith("cwsp-ctrl-")) {
            Configure.writeControlPublicToken(context, legacy.trim());
            return legacy.trim();
        }
        return "";
    }

    public static String regenerate(Context context) {
        if (context == null) return "";
        byte[] raw = new byte[18];
        RNG.nextBytes(raw);
        StringBuilder sb = new StringBuilder("cwsp-pub-");
        for (byte b : raw) {
            sb.append(String.format(Locale.ROOT, "%02x", b));
        }
        String token = sb.toString();
        Configure.writeControlPublicToken(context, token);
        // Keep controlApiKey aligned for any legacy loopback readers.
        Configure.writeControlApiKey(context, token);
        Log.i(TAG, "regenerated Control public token");
        ControlPairStore.revokeAll();
        return token;
    }

    public static boolean matches(Context context, String incoming) {
        String expected = ensure(context);
        if (incoming == null || expected.isEmpty()) return false;
        String a = incoming.trim();
        String b = expected.trim();
        if (a.length() != b.length()) return false;
        int diff = 0;
        for (int i = 0; i < a.length(); i++) {
            diff |= a.charAt(i) ^ b.charAt(i);
        }
        return diff == 0;
    }
}
