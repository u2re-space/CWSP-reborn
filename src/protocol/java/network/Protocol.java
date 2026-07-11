/*
 * Filename: Protocol.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/Protocol.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Implement the single ingress normalizer that converts
 *                     compatibility packet carriers into a canonical CWSP v2
 *                     Packet. Java counterpart to cwsp-shared normalize.ts.
 *
 * INVARIANT: A normalized Packet always has canonicalV2=true, a canonical Verb
 *            op, a non-empty uuid/timestamp/sender, and resolved destinations.
 */
package space.u2re.cwsp.protocol.network;

import space.u2re.cwsp.protocol.packet.Clipboard;
import space.u2re.cwsp.protocol.packet.Commands;
import space.u2re.cwsp.protocol.packet.Meta;
import space.u2re.cwsp.protocol.packet.Packet;
import space.u2re.cwsp.protocol.packet.Payload;
import space.u2re.cwsp.protocol.packet.Schema;
import space.u2re.cwsp.protocol.packet.Types;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Ingress normalizer. Accepts a Map (parsed JSON) or any compatibility carrier
 * and produces a canonical {@link Packet}. Performs no I/O, no clock reads, no
 * UUID generation, and no routing — mirrors normalizeCwspPacket().
 */
public final class Protocol {

    private Protocol() {
    }

    /** Thrown when an input cannot be normalized. Mirrors CwspNormalizationError. */
    public static final class NormalizationError extends RuntimeException {
        private final String code;

        public NormalizationError(String code, String message) {
            super(message);
            this.code = code;
        }

        public String code() {
            return code;
        }
    }

    /**
     * Normalize an untrusted logical packet (Map / parsed JSON) into a canonical
     * {@link Packet}. Throws {@link NormalizationError} on contract violations.
     */
    public static Packet normalizeIngress(Object value) {
        Map<String, Object> input = Types.asRecord(value);
        if (input == null) {
            throw new NormalizationError("CWSP_PACKET_INVALID",
                    "CWSP packet must be an object");
        }

        Types.Verb op = normalizeVerb(input.get(Schema.OP));
        Object payload = Payload.normalizePayloadDataAssets(Payload.selectCarrier(input));
        String what = inferAction(input, payload);
        List<String> destinations = Coordinator.resolveDestinations(input);
        List<Packet.Extension> extensions = normalizeExtensions(input.get(Schema.EXTENSIONS));
        Packet.Error error = normalizeError(input.get(Schema.ERROR));
        String uuid = requireString(input.get(Schema.UUID), "uuid");
        long timestamp = requireTimestamp(input.get(Schema.TIMESTAMP));
        String sender = Coordinator.resolveSender(input);

        Packet p = new Packet();
        p.setOp(op);
        p.setWhat(what);
        p.setPurpose(Meta.inferPurpose(what, asString(input.get(Schema.PURPOSE))));
        p.setUuid(uuid);
        p.setTimestamp(timestamp);
        p.setSender(sender);
        p.setFlags(Types.canonicalFlags(Types.asRecord(input.get(Schema.FLAGS))));

        String protocol = asString(input.get(Schema.PROTOCOL));
        if (protocol != null) p.setProtocol(protocol);
        String transport = asString(input.get(Schema.TRANSPORT));
        if (transport != null) p.setTransport(transport);

        if (destinations != null) {
            p.setDestinations(new ArrayList<>(destinations));
            p.setNodes(new ArrayList<>(destinations));
        }
        if (payload != null) {
            p.setPayload(payload);
        }

        Object statusObj = input.get(Schema.STATUS);
        if (statusObj != null) {
            if (!Types.isCwspStatus(statusObj)) {
                throw new NormalizationError("CWSP_PACKET_STATUS_INVALID",
                        "CWSP packet status must be an integer from 100 through 599");
            }
            p.setStatus(((Number) statusObj).intValue());
        }
        if (error != null) p.setError(error);
        if (extensions != null) p.setExtensions(extensions);

        return p;
    }

    /** Convenience alias matching the TS export name. */
    public static Packet normalizePacket(Object value) {
        return normalizeIngress(value);
    }

    /** Normalize the {@code op} verb field. */
    public static Types.Verb normalizeVerb(Object raw) {
        if (!(raw instanceof String)) {
            throw new NormalizationError("CWSP_PACKET_VERB_REQUIRED",
                    "CWSP packet op must be a string");
        }
        Types.Verb verb = Commands.normalizeVerb((String) raw);
        if (verb == null) {
            throw new NormalizationError("CWSP_PACKET_VERB_UNSUPPORTED",
                    "Unsupported CWSP packet op: " + raw);
        }
        return verb;
    }

    /** Infer the canonical action name from what/type/action or nested payload. */
    public static String inferAction(Map<String, Object> input, Object payload) {
        for (String field : new String[]{Schema.WHAT, Schema.TYPE, Schema.ACTION}) {
            String s = asString(input.get(field));
            if (s != null && !s.trim().isEmpty()) {
                return Commands.canonicalizeAction(s);
            }
        }
        Map<String, Object> rec = Types.asRecord(payload);
        if (rec != null) {
            for (String field : new String[]{Schema.OP, Schema.ACTION, Schema.TYPE}) {
                String s = asString(rec.get(field));
                if (s != null && !s.trim().isEmpty()) {
                    return Commands.canonicalizeAction(s);
                }
            }
        }
        return Commands.NETWORK_DISPATCH;
    }

    private static List<Packet.Extension> normalizeExtensions(Object value) {
        if (value == null) {
            return null;
        }
        if (!(value instanceof List)) {
            throw new NormalizationError("CWSP_PACKET_EXTENSIONS_INVALID",
                    "CWSP packet extensions must be an array");
        }
        List<?> list = (List<?>) value;
        List<Packet.Extension> out = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> rec = Types.asRecord(list.get(i));
            if (rec == null) {
                throw new NormalizationError("CWSP_PACKET_EXTENSION_INVALID",
                        "CWSP extension at index " + i + " must be an object");
            }
            String id = requireString(rec.get("id"), "extension_id");
            if (!Types.isNamespacedExtensionId(id)) {
                throw new NormalizationError("CWSP_PACKET_EXTENSION_ID_INVALID",
                        "CWSP extension id must be namespaced: " + id);
            }
            Object versionObj = rec.get("version");
            if (!Types.isSafeNonNegInt(versionObj) || ((Number) versionObj).doubleValue() < 1) {
                throw new NormalizationError("CWSP_PACKET_EXTENSION_VERSION_INVALID",
                        "CWSP extension " + id + " requires a positive integer version");
            }
            Packet.Extension ext = new Packet.Extension();
            ext.setId(id);
            ext.setVersion(((Number) versionObj).intValue());
            ext.setRequired(Boolean.TRUE.equals(rec.get("required")));
            if (rec.containsKey("data")) {
                ext.setData(rec.get("data"));
            }
            out.add(ext);
        }
        return out;
    }

    private static Packet.Error normalizeError(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof String) {
            String msg = (String) value;
            if (msg.isEmpty()) {
                return null;
            }
            Packet.Error e = new Packet.Error();
            e.setCode("CWSP_ERROR");
            e.setMessage(msg);
            return e;
        }
        Map<String, Object> rec = Types.asRecord(value);
        if (rec == null) {
            throw new NormalizationError("CWSP_PACKET_ERROR_INVALID",
                    "CWSP packet error must be an object or string");
        }
        Packet.Error e = new Packet.Error();
        e.setCode(requireString(rec.get("code"), "error_code"));
        e.setMessage(requireString(rec.get("message"), "error_message"));
        if (rec.containsKey("details")) {
            e.setDetails(rec.get("details"));
        }
        return e;
    }

    private static String requireString(Object value, String field) {
        if (!(value instanceof String) || ((String) value).trim().isEmpty()) {
            throw new NormalizationError(
                    "CWSP_PACKET_" + field.toUpperCase() + "_REQUIRED",
                    "CWSP packet " + field + " must be a non-empty string");
        }
        return ((String) value).trim();
    }

    private static long requireTimestamp(Object value) {
        if (!Types.isSafeNonNegInt(value)) {
            throw new NormalizationError("CWSP_PACKET_TIMESTAMP_REQUIRED",
                    "CWSP packet timestamp must be a non-negative safe integer");
        }
        return ((Number) value).longValue();
    }

    private static String asString(Object v) {
        if (!(v instanceof String)) {
            return null;
        }
        String s = (String) v;
        return s.trim().isEmpty() ? null : s.trim();
    }
}
