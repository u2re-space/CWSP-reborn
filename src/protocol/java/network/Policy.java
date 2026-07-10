/*
 * Filename: Policy.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/Policy.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Implement the adapter-independent policy evaluator
 *                     (stale, duplicate, reconnect decisions). Java counterpart
 *                     to cwsp-shared/src/v2/policy.ts.
 *
 * INVARIANT: evaluate() returns a Decision only. Callers update seen sets,
 *            queues, and clocks after applying it. This keeps the policy
 *            portable across browser, Java, and Node.
 */
package space.u2re.cwsp.protocol.network;

import space.u2re.cwsp.protocol.packet.Clipboard;
import space.u2re.cwsp.protocol.packet.Commands;
import space.u2re.cwsp.protocol.packet.Measure;
import space.u2re.cwsp.protocol.packet.Packet;
import space.u2re.cwsp.protocol.packet.Types;

import java.util.List;

/** CWSP v2 packet policy evaluator. */
public final class Policy {

    /** Safe bound when a reconnect queue omits its limit. */
    public static final long DEFAULT_RECONNECT_QUEUE_SIZE = 100L;

    /** Default policy config, mirroring DEFAULT_CWSP_POLICY in policy.ts. */
    public static final Config DEFAULT_CONFIG = new Config();

    private Policy() {
    }

    /** Policy configuration (max-age windows and queue bounds). Immutable. */
    public static final class Config {
        public final long relativeInputMaxAgeMs;
        public final long discreteInputMaxAgeMs;
        public final long generalMaxAgeMs;
        public final long clipboardMaxAgeMs;
        public final long clipboardEchoWindowMs;
        public final long reconnectMaxAgeMs;
        public final long settingsMaxAgeMs;
        public final long debugMaxAgeMs;
        public final long debugMaxPending;
        public final long replyMaxAgeMs;

        public Config() {
            this(250L, 2_000L, 4_000L, 30_000L, 3_500L, 12_000L,
                    30_000L, 30_000L, 200L, 8_000L);
        }

        public Config(long relativeInputMaxAgeMs, long discreteInputMaxAgeMs,
                      long generalMaxAgeMs, long clipboardMaxAgeMs,
                      long clipboardEchoWindowMs, long reconnectMaxAgeMs,
                      long settingsMaxAgeMs, long debugMaxAgeMs,
                      long debugMaxPending, long replyMaxAgeMs) {
            this.relativeInputMaxAgeMs = relativeInputMaxAgeMs;
            this.discreteInputMaxAgeMs = discreteInputMaxAgeMs;
            this.generalMaxAgeMs = generalMaxAgeMs;
            this.clipboardMaxAgeMs = clipboardMaxAgeMs;
            this.clipboardEchoWindowMs = clipboardEchoWindowMs;
            this.reconnectMaxAgeMs = reconnectMaxAgeMs;
            this.settingsMaxAgeMs = settingsMaxAgeMs;
            this.debugMaxAgeMs = debugMaxAgeMs;
            this.debugMaxPending = debugMaxPending;
            this.replyMaxAgeMs = replyMaxAgeMs;
        }

        /**
         * Apply partial overrides. Null fields in {@code overrides} keep the
         * default value; non-null fields replace it. Mirrors TS spread merge.
         */
        public Config withOverrides(Overrides overrides) {
            if (overrides == null) {
                return this;
            }
            return new Config(
                    overrides.relativeInputMaxAgeMs != null ? overrides.relativeInputMaxAgeMs : relativeInputMaxAgeMs,
                    overrides.discreteInputMaxAgeMs != null ? overrides.discreteInputMaxAgeMs : discreteInputMaxAgeMs,
                    overrides.generalMaxAgeMs != null ? overrides.generalMaxAgeMs : generalMaxAgeMs,
                    overrides.clipboardMaxAgeMs != null ? overrides.clipboardMaxAgeMs : clipboardMaxAgeMs,
                    overrides.clipboardEchoWindowMs != null ? overrides.clipboardEchoWindowMs : clipboardEchoWindowMs,
                    overrides.reconnectMaxAgeMs != null ? overrides.reconnectMaxAgeMs : reconnectMaxAgeMs,
                    overrides.settingsMaxAgeMs != null ? overrides.settingsMaxAgeMs : settingsMaxAgeMs,
                    overrides.debugMaxAgeMs != null ? overrides.debugMaxAgeMs : debugMaxAgeMs,
                    overrides.debugMaxPending != null ? overrides.debugMaxPending : debugMaxPending,
                    overrides.replyMaxAgeMs != null ? overrides.replyMaxAgeMs : replyMaxAgeMs);
        }
    }

    /** Nullable partial overrides for {@link Config}. Mirrors Partial&lt;CwspPolicyConfig&gt;. */
    public static final class Overrides {
        public Long relativeInputMaxAgeMs;
        public Long discreteInputMaxAgeMs;
        public Long generalMaxAgeMs;
        public Long clipboardMaxAgeMs;
        public Long clipboardEchoWindowMs;
        public Long reconnectMaxAgeMs;
        public Long settingsMaxAgeMs;
        public Long debugMaxAgeMs;
        public Long debugMaxPending;
        public Long replyMaxAgeMs;

        public Overrides() {
        }
    }

    /** Policy evaluation context. Mirrors CwspPolicyContext. */
    public static final class Context {
        public final long now;
        public final boolean reconnecting;
        public final List<String> seenUuids;          // nullable
        public final List<String> seenClipboardKeys;  // nullable
        public final RemoteClipboard remoteClipboard; // nullable
        public final long queueSize;
        public final Long maxQueueSize;               // nullable
        public final List<String> activeCorrelations;// nullable

        public Context(long now, boolean reconnecting,
                       List<String> seenUuids, List<String> seenClipboardKeys,
                       RemoteClipboard remoteClipboard,
                       long queueSize, Long maxQueueSize,
                       List<String> activeCorrelations) {
            this.now = now;
            this.reconnecting = reconnecting;
            this.seenUuids = seenUuids;
            this.seenClipboardKeys = seenClipboardKeys;
            this.remoteClipboard = remoteClipboard;
            this.queueSize = queueSize;
            this.maxQueueSize = maxQueueSize;
            this.activeCorrelations = activeCorrelations;
        }

        public static Context connected(long now) {
            return new Context(now, false, null, null, null, 0L, null, null);
        }
    }

    /** Recently applied remote clipboard entry (for echo suppression). */
    public static final class RemoteClipboard {
        public final String key;
        public final long appliedAt;

        public RemoteClipboard(String key, long appliedAt) {
            this.key = key;
            this.appliedAt = appliedAt;
        }
    }

    /** Policy decision returned by evaluate(). */
    public static final class Decision {
        public final Types.PolicyAction action;
        public final Types.PolicyReason reason;
        public final Types.PolicyClass packetClass;
        public final String dedupeKey; // nullable
        public final String evict;     // nullable, "oldest"

        public Decision(Types.PolicyAction action, Types.PolicyReason reason,
                        Types.PolicyClass packetClass, String dedupeKey, String evict) {
            this.action = action;
            this.reason = reason;
            this.packetClass = packetClass;
            this.dedupeKey = dedupeKey;
            this.evict = evict;
        }

        public boolean accepted() {
            return action == Types.PolicyAction.ACCEPT;
        }

        public boolean dropped() {
            return action == Types.PolicyAction.DROP;
        }

        public boolean enqueued() {
            return action == Types.PolicyAction.ENQUEUE;
        }
    }

    /** Classify a packet for policy purposes. Mirrors classifyCwspPacket(). */
    public static Types.PolicyClass classify(Packet packet) {
        if (packet == null) {
            return Types.PolicyClass.GENERAL;
        }
        if (packet.getOp() == Types.Verb.RESULT || packet.getOp() == Types.Verb.ERROR) {
            return Types.PolicyClass.REPLY;
        }
        String what = packet.getWhat();
        if (what == null) {
            return Types.PolicyClass.GENERAL;
        }
        if (what.startsWith("clipboard:")) {
            return Types.PolicyClass.CLIPBOARD;
        }
        if (what.startsWith("settings:")) {
            return Types.PolicyClass.SETTINGS;
        }
        if (what.startsWith("debug:")) {
            return Types.PolicyClass.DEBUG;
        }
        String action = what.startsWith("airpad:") ? wrapperAction(packet, what) : what;
        if (Commands.MOUSE_MOVE.equals(action) || Commands.MOUSE_SCROLL.equals(action)) {
            return Types.PolicyClass.RELATIVE_INPUT;
        }
        if (action.startsWith("mouse:") || action.startsWith("keyboard:")
                || Commands.AIRPAD_MOUSE.equals(what) || Commands.AIRPAD_KEYBOARD.equals(what)) {
            return Types.PolicyClass.DISCRETE_INPUT;
        }
        return Types.PolicyClass.GENERAL;
    }

    private static String wrapperAction(Packet packet, String what) {
        Object payload = packet.getPayload();
        if (!(payload instanceof java.util.Map)) {
            return what;
        }
        @SuppressWarnings("unchecked")
        java.util.Map<String, Object> rec = (java.util.Map<String, Object>) payload;
        for (String field : new String[]{"op", "action", "type"}) {
            Object v = rec.get(field);
            if (v instanceof String && !((String) v).isEmpty()) {
                String s = (String) v;
                return s.contains(":") ? s : what.substring("airpad:".length()) + ":" + s;
            }
        }
        return what;
    }

    /**
     * Evaluate a packet against the policy. Returns a Decision only.
     */
    public static Decision evaluate(Packet packet, Context context, Overrides overrides) {
        Config policy = overrides == null ? DEFAULT_CONFIG : DEFAULT_CONFIG.withOverrides(overrides);
        Types.PolicyClass packetClass = classify(packet);
        String dedupeKey = packetClass == Types.PolicyClass.CLIPBOARD
                ? Clipboard.dedupeKey(packet)
                : null;

        if (contains(context.seenUuids, packet.getUuid())) {
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.DUPLICATE_UUID,
                    packetClass, dedupeKey, null);
        }
        if (dedupeKey != null && contains(context.seenClipboardKeys, dedupeKey)) {
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.DUPLICATE_CONTENT,
                    packetClass, dedupeKey, null);
        }
        if (dedupeKey != null && context.remoteClipboard != null
                && dedupeKey.equals(context.remoteClipboard.key)
                && context.now >= context.remoteClipboard.appliedAt
                && context.now - context.remoteClipboard.appliedAt <= policy.clipboardEchoWindowMs) {
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.CLIPBOARD_ECHO,
                    packetClass, dedupeKey, null);
        }
        if (packetClass == Types.PolicyClass.REPLY
                && !contains(context.activeCorrelations, packet.getUuid())) {
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.INACTIVE_CORRELATION,
                    packetClass, null, null);
        }

        long age = Measure.age(context.now, packet.getTimestamp());
        if (age > maxAgeForClass(packetClass, policy)) {
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.STALE,
                    packetClass, dedupeKey, null);
        }

        if (!context.reconnecting) {
            return decision(Types.PolicyAction.ACCEPT, Types.PolicyReason.ACCEPTED,
                    packetClass, dedupeKey, null);
        }
        if (packetClass == Types.PolicyClass.RELATIVE_INPUT
                || packetClass == Types.PolicyClass.DISCRETE_INPUT) {
            return decision(Types.PolicyAction.DROP,
                    Types.PolicyReason.RECONNECT_NO_INPUT_REPLAY, packetClass, dedupeKey, null);
        }
        if (packetClass == Types.PolicyClass.SETTINGS || packetClass == Types.PolicyClass.REPLY) {
            return decision(Types.PolicyAction.DROP,
                    Types.PolicyReason.RECONNECT_NO_AUTOMATIC_REPLAY, packetClass, dedupeKey, null);
        }
        if (age > policy.reconnectMaxAgeMs) {
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.STALE,
                    packetClass, dedupeKey, null);
        }

        long queueSize = context.queueSize;
        long configuredMaximum = (context.maxQueueSize != null && context.maxQueueSize >= 0)
                ? context.maxQueueSize
                : DEFAULT_RECONNECT_QUEUE_SIZE;
        long maximum = packetClass == Types.PolicyClass.DEBUG
                ? Math.min(configuredMaximum, policy.debugMaxPending)
                : configuredMaximum;
        if (queueSize >= maximum) {
            if (packetClass == Types.PolicyClass.DEBUG) {
                return decision(Types.PolicyAction.ENQUEUE,
                        Types.PolicyReason.RECONNECT_BUFFERED, packetClass, dedupeKey, "oldest");
            }
            return decision(Types.PolicyAction.DROP, Types.PolicyReason.QUEUE_FULL,
                    packetClass, dedupeKey, null);
        }
        return decision(Types.PolicyAction.ENQUEUE, Types.PolicyReason.RECONNECT_BUFFERED,
                packetClass, dedupeKey, "oldest");
    }

    public static Decision evaluate(Packet packet, Context context) {
        return evaluate(packet, context, null);
    }

    private static long maxAgeForClass(Types.PolicyClass packetClass, Config policy) {
        switch (packetClass) {
            case RELATIVE_INPUT: return policy.relativeInputMaxAgeMs;
            case DISCRETE_INPUT: return policy.discreteInputMaxAgeMs;
            case CLIPBOARD:      return policy.clipboardMaxAgeMs;
            case SETTINGS:       return policy.settingsMaxAgeMs;
            case DEBUG:          return policy.debugMaxAgeMs;
            case REPLY:          return policy.replyMaxAgeMs;
            default:             return policy.generalMaxAgeMs;
        }
    }

    private static Decision decision(Types.PolicyAction action, Types.PolicyReason reason,
                                     Types.PolicyClass packetClass, String dedupeKey, String evict) {
        return new Decision(action, reason, packetClass, dedupeKey, evict);
    }

    private static boolean contains(List<String> list, String value) {
        if (list == null || value == null) {
            return false;
        }
        return list.contains(value);
    }
}
