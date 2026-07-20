/*
 * Filename: ControlPairStore.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlPairStore.java
 * Change date and time: 20.40.00_20.07.2026
 * Reason for changes: In-memory Control pairing + short-lived sessions bound to Origin.
 *   SECURITY: public SPA never receives ecosystem token — only session after user Accept.
 *   chrome-extension:// origins get persistent (≈10y) sessions after Accept.
 */

package space.u2re.cwsp;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.security.SecureRandom;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Pending pair requests and issued control sessions for {@link ControlApiServer}.
 */
public final class ControlPairStore {
    private static final String TAG = "ControlPairStore";

    public static final long PAIR_TTL_MS = 60_000L;
    /** INVARIANT: public SPA Control session after Accept lasts at most 1 hour. */
    public static final long SESSION_TTL_MS = 60 * 60_000L;
    /**
     * WHY: Chrome extension pairs once; session must outlive browser restarts.
     * INVARIANT: only {@code chrome-extension://} origins receive this TTL.
     */
    public static final long SESSION_TTL_PERSISTENT_MS = 10L * 365L * 24L * 60L * 60L * 1000L;
    private static final int BEGIN_RATE_LIMIT = 5;
    private static final long BEGIN_RATE_WINDOW_MS = 60_000L;

    public enum PairState {
        pending,
        accepted,
        denied,
        expired
    }

    public static final class PairRequest {
        public final String pairId;
        public final String origin;
        public final String pairCode;
        public final String clientLabel;
        public final long createdAtMs;
        public final long expiresAtMs;
        public volatile PairState state = PairState.pending;
        /** One-shot session delivery after Accept. */
        public volatile String sessionToken;
        public volatile long sessionExpiresAtMs;
        public volatile boolean sessionDelivered;

        PairRequest(String pairId, String origin, String pairCode, String clientLabel, long now) {
            this.pairId = pairId;
            this.origin = origin;
            this.pairCode = pairCode;
            this.clientLabel = clientLabel;
            this.createdAtMs = now;
            this.expiresAtMs = now + PAIR_TTL_MS;
        }
    }

    public static final class Session {
        public final String token;
        public final String origin;
        public final long expiresAtMs;
        public final boolean persistent;

        Session(String token, String origin, long expiresAtMs, boolean persistent) {
            this.token = token;
            this.origin = origin;
            this.expiresAtMs = expiresAtMs;
            this.persistent = persistent;
        }

        boolean validAt(long now) {
            return now < expiresAtMs;
        }
    }

    private static final SecureRandom RNG = new SecureRandom();
    private static final Handler MAIN = new Handler(Looper.getMainLooper());
    private static final ConcurrentHashMap<String, PairRequest> PAIRS = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, Session> SESSIONS = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, long[]> BEGIN_HITS = new ConcurrentHashMap<>();

    private ControlPairStore() {}

    public static boolean allowBegin(String clientIp) {
        String key = clientIp == null || clientIp.isBlank() ? "unknown" : clientIp.trim();
        long now = System.currentTimeMillis();
        long[] hits = BEGIN_HITS.computeIfAbsent(key, k -> new long[BEGIN_RATE_LIMIT]);
        synchronized (hits) {
            int usable = 0;
            for (int i = 0; i < hits.length; i++) {
                if (hits[i] > 0 && now - hits[i] < BEGIN_RATE_WINDOW_MS) usable++;
            }
            if (usable >= BEGIN_RATE_LIMIT) return false;
            for (int i = 0; i < hits.length; i++) {
                if (hits[i] <= 0 || now - hits[i] >= BEGIN_RATE_WINDOW_MS) {
                    hits[i] = now;
                    return true;
                }
            }
            return false;
        }
    }

    public static PairRequest begin(String origin, String clientLabel) {
        purgeExpired();
        long now = System.currentTimeMillis();
        String pairId = randomHex(16);
        String pairCode = randomPairCode();
        PairRequest req = new PairRequest(pairId, origin, pairCode, clientLabel == null ? "" : clientLabel, now);
        PAIRS.put(pairId, req);
        MAIN.postDelayed(() -> expireIfStillPending(pairId), PAIR_TTL_MS + 250L);
        Log.i(TAG, "pair begin id=" + pairId + " origin=" + origin + " code=" + pairCode);
        return req;
    }

    public static PairRequest get(String pairId) {
        if (pairId == null || pairId.isBlank()) return null;
        purgeExpired();
        PairRequest req = PAIRS.get(pairId.trim());
        if (req == null) return null;
        long now = System.currentTimeMillis();
        if (req.state == PairState.pending && now >= req.expiresAtMs) {
            req.state = PairState.expired;
        }
        return req;
    }

    public static boolean accept(String pairId) {
        PairRequest req = get(pairId);
        if (req == null || req.state != PairState.pending) return false;
        long now = System.currentTimeMillis();
        if (now >= req.expiresAtMs) {
            req.state = PairState.expired;
            return false;
        }
        String sessionToken = randomHex(32);
        boolean persistent = isChromeExtensionOrigin(req.origin);
        long sessionExp = now + (persistent ? SESSION_TTL_PERSISTENT_MS : SESSION_TTL_MS);
        req.state = PairState.accepted;
        req.sessionToken = sessionToken;
        req.sessionExpiresAtMs = sessionExp;
        req.sessionDelivered = false;
        SESSIONS.put(sessionToken, new Session(sessionToken, req.origin, sessionExp, persistent));
        Log.i(TAG, "pair accepted id=" + pairId + " origin=" + req.origin
                + (persistent ? " persistent=true" : ""));
        return true;
    }

    public static boolean deny(String pairId) {
        PairRequest req = get(pairId);
        if (req == null) return false;
        if (req.state == PairState.pending || req.state == PairState.accepted) {
            req.state = PairState.denied;
            if (req.sessionToken != null) {
                SESSIONS.remove(req.sessionToken);
                req.sessionToken = null;
            }
            Log.i(TAG, "pair denied id=" + pairId);
            return true;
        }
        return false;
    }

    /**
     * Status payload for SPA poll. Session token is returned once after Accept.
     */
    public static Map<String, Object> statusPayload(String pairId) {
        PairRequest req = get(pairId);
        Map<String, Object> out = new java.util.LinkedHashMap<>();
        if (req == null) {
            out.put("state", PairState.expired.name());
            out.put("error", "unknown_pair");
            return out;
        }
        out.put("pairId", req.pairId);
        out.put("origin", req.origin);
        out.put("pairCode", req.pairCode);
        out.put("expiresAt", req.expiresAtMs);
        out.put("state", req.state.name());
        if (req.state == PairState.accepted
                && req.sessionToken != null
                && !req.sessionDelivered
                && System.currentTimeMillis() < req.sessionExpiresAtMs) {
            out.put("session", req.sessionToken);
            out.put("sessionExpiresAt", req.sessionExpiresAtMs);
            out.put("sessionPersistent", isChromeExtensionOrigin(req.origin));
            req.sessionDelivered = true;
        }
        return out;
    }

    public static Session validateSession(String token, String origin) {
        if (token == null || token.isBlank()) return null;
        purgeExpired();
        Session s = SESSIONS.get(token.trim());
        if (s == null) return null;
        long now = System.currentTimeMillis();
        if (!s.validAt(now)) {
            SESSIONS.remove(token.trim());
            return null;
        }
        if (origin == null || origin.isBlank()) return null;
        if (!originsEqual(s.origin, origin)) return null;
        return s;
    }

    public static void revokeAll() {
        PAIRS.clear();
        SESSIONS.clear();
        Log.i(TAG, "all pairs/sessions revoked");
    }

    public static boolean originsEqual(String a, String b) {
        if (a == null || b == null) return false;
        String na = a.trim().toLowerCase(Locale.ROOT).replaceAll("/+$", "");
        String nb = b.trim().toLowerCase(Locale.ROOT).replaceAll("/+$", "");
        return na.equals(nb);
    }

    /** Chrome extension options/SW Origin — not loopback; requires X-Control-Session. */
    public static boolean isChromeExtensionOrigin(String origin) {
        if (origin == null || origin.isBlank()) return false;
        return origin.trim().toLowerCase(Locale.ROOT).startsWith("chrome-extension://");
    }

    private static void expireIfStillPending(String pairId) {
        PairRequest req = PAIRS.get(pairId);
        if (req != null && req.state == PairState.pending) {
            req.state = PairState.expired;
            ControlPairUi.dismiss(pairId);
            Log.i(TAG, "pair expired id=" + pairId);
        }
    }

    private static void purgeExpired() {
        long now = System.currentTimeMillis();
        Iterator<Map.Entry<String, PairRequest>> pit = PAIRS.entrySet().iterator();
        while (pit.hasNext()) {
            Map.Entry<String, PairRequest> e = pit.next();
            PairRequest req = e.getValue();
            if (req.state == PairState.pending && now >= req.expiresAtMs) {
                req.state = PairState.expired;
            }
            // Drop finished pairs after a grace window.
            if (req.state != PairState.pending && now - req.expiresAtMs > SESSION_TTL_MS) {
                pit.remove();
            }
        }
        Iterator<Map.Entry<String, Session>> sit = SESSIONS.entrySet().iterator();
        while (sit.hasNext()) {
            Map.Entry<String, Session> e = sit.next();
            if (!e.getValue().validAt(now)) sit.remove();
        }
    }

    private static String randomHex(int bytes) {
        byte[] buf = new byte[bytes];
        RNG.nextBytes(buf);
        StringBuilder sb = new StringBuilder(bytes * 2);
        for (byte b : buf) sb.append(String.format(Locale.ROOT, "%02x", b));
        return sb.toString();
    }

    /** Short user-visible code (no ambiguous chars). */
    private static String randomPairCode() {
        final char[] alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
        char[] out = new char[6];
        for (int i = 0; i < out.length; i++) {
            out[i] = alphabet[RNG.nextInt(alphabet.length)];
        }
        return new String(out);
    }
}
