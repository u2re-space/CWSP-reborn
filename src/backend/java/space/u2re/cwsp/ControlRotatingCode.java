/*
 * Filename: ControlRotatingCode.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlRotatingCode.java
 * Change date and time: 20.20.00_20.07.2026
 * Reason for changes: 20s HMAC rotating device code — must match Node control-attestation.ts.
 *   SECURITY: seeded by Control public token (not ecosystem WS token).
 *   2026-07-20: previous code accepted for PREVIOUS_GRACE_MS (~10s) after rotation.
 */

package space.u2re.cwsp;

import android.content.Context;
import android.util.Log;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import core.Configure;

/**
 * Rotating Control confirmation code (period = {@link #PERIOD_MS}).
 * Algorithm is shared with Node {@code control-attestation.ts}.
 * After each tick, the previous code remains valid for {@link #PREVIOUS_GRACE_MS}.
 */
public final class ControlRotatingCode {
    private static final String TAG = "ControlRotatingCode";
    public static final long PERIOD_MS = 20_000L;
    /** WHY: typing/paste across a tick — previous code still accepted briefly. */
    public static final long PREVIOUS_GRACE_MS = 10_000L;
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LEN = 6;

    private ControlRotatingCode() {}

    public static String resolveSecret(Context context) {
        if (context == null) return "cwsp-unseeded";
        // INVARIANT: HMAC seed = Control public token only (never ecosystem WS token).
        String pub = ControlPublicToken.ensure(context);
        if (pub != null && !pub.isBlank()) return pub.trim();
        String key = Configure.readControlApiKey(context);
        if (key != null && !key.isBlank()) return key.trim();
        return "cwsp-unseeded";
    }

    public static String currentCode(Context context) {
        return codeForCounter(resolveSecret(context), Math.floorDiv(System.currentTimeMillis(), PERIOD_MS));
    }

    public static long expiresInMs() {
        long now = System.currentTimeMillis();
        return PERIOD_MS - (now % PERIOD_MS);
    }

    public static boolean verify(Context context, String input) {
        if (input == null) return false;
        String raw = input.trim().toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]", "");
        if (raw.length() != CODE_LEN) return false;
        String secret = resolveSecret(context);
        long now = System.currentTimeMillis();
        long counter = Math.floorDiv(now, PERIOD_MS);
        long elapsedInPeriod = now % PERIOD_MS;
        String current = codeForCounter(secret, counter);
        String previous = codeForCounter(secret, counter - 1);
        boolean matchCurrent = constantTimeEquals(raw, current);
        // INVARIANT: always compare previous; only honor it during grace after rotation.
        boolean matchPrevious = constantTimeEquals(raw, previous);
        if (matchCurrent) return true;
        return elapsedInPeriod < PREVIOUS_GRACE_MS && matchPrevious;
    }

    private static String codeForCounter(String secret, long counter) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hmac = mac.doFinal(("cwsp-ctrl-v1|" + counter).getBytes(StandardCharsets.UTF_8));
            int offset = hmac[hmac.length - 1] & 0x0f;
            int binary =
                    ((hmac[offset] & 0x7f) << 24)
                            | ((hmac[offset + 1] & 0xff) << 16)
                            | ((hmac[offset + 2] & 0xff) << 8)
                            | (hmac[offset + 3] & 0xff);
            long n = binary & 0xffffffffL;
            StringBuilder out = new StringBuilder(CODE_LEN);
            for (int i = 0; i < CODE_LEN; i++) {
                int idx = (int) (n % ALPHABET.length());
                out.insert(0, ALPHABET.charAt(idx));
                n = n / ALPHABET.length();
            }
            return out.toString();
        } catch (Exception e) {
            Log.e(TAG, "codeForCounter failed", e);
            return "XXXXXX";
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) return false;
        byte[] x = a.getBytes(StandardCharsets.UTF_8);
        byte[] y = b.getBytes(StandardCharsets.UTF_8);
        if (x.length != y.length) {
            MessageDigest.isEqual(x, x);
            return false;
        }
        return MessageDigest.isEqual(x, y);
    }
}
