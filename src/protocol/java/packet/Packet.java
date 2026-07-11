/*
 * Filename: Packet.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Packet.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Implement the canonical CWSP v2 packet model (Java
 *                     counterpart to cwsp-shared/src/v2/packet.ts +
 *                     types.ts CwspPacket). Fixes the prior "Pakcet" typo.
 *
 * INVARIANT: A normalized Packet always has flags.canonicalV2 == true, a
 *            non-empty uuid/timestamp/sender, and a canonical Verb op.
 */
package space.u2re.cwsp.protocol.packet;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Canonical CWSP v2 packet. Logical meaning only; protocol/transport are
 * optional diagnostics. Use {@link #builder()} for construction and
 * {@link network.Protocol#normalizeIngress(Object)} for boundary normalization.
 */
public final class Packet {

    private Types.Verb op;
    private String what;
    private Types.Purpose purpose;
    private String protocol;   // optional, raw string allowed
    private String transport;  // optional, raw string allowed
    private String uuid;
    private long timestamp;
    private String sender;
    private List<String> nodes;        // nullable
    private List<String> destinations; // nullable
    private Object payload;            // nullable
    private Integer status;            // nullable
    private Error error;               // nullable
    private List<Extension> extensions;// nullable
    private Map<String, Object> flags; // always has canonicalV2=true

    public Packet() {
        // Used by builder/normalizer. Fields set afterward.
    }

    public Types.Verb getOp() {
        return op;
    }

    public void setOp(Types.Verb op) {
        this.op = op;
    }

    public String getWhat() {
        return what;
    }

    public void setWhat(String what) {
        this.what = what;
    }

    public Types.Purpose getPurpose() {
        return purpose;
    }

    public void setPurpose(Types.Purpose purpose) {
        this.purpose = purpose;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getTransport() {
        return transport;
    }

    public void setTransport(String transport) {
        this.transport = transport;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public List<String> getNodes() {
        return nodes;
    }

    public void setNodes(List<String> nodes) {
        this.nodes = nodes;
    }

    public List<String> getDestinations() {
        return destinations;
    }

    public void setDestinations(List<String> destinations) {
        this.destinations = destinations;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Error getError() {
        return error;
    }

    public void setError(Error error) {
        this.error = error;
    }

    public List<Extension> getExtensions() {
        return extensions;
    }

    public void setExtensions(List<Extension> extensions) {
        this.extensions = extensions;
    }

    public Map<String, Object> getFlags() {
        return flags;
    }

    public void setFlags(Map<String, Object> flags) {
        this.flags = flags;
    }

    /** Convenience: true if flags.canonicalV2 is true. */
    public boolean isCanonicalV2() {
        return flags != null && Boolean.TRUE.equals(flags.get("canonicalV2"));
    }

    /**
     * Serialize to a JSON-compatible Map (wire-neutral). Use codec.Encoder to
     * turn this into a JSON string.
     */
    public Map<String, Object> toMap() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("op", op != null ? op.wire() : null);
        m.put("what", what);
        m.put("purpose", purpose != null ? purpose.wire() : null);
        if (protocol != null) m.put("protocol", protocol);
        if (transport != null) m.put("transport", transport);
        m.put("uuid", uuid);
        m.put("timestamp", timestamp);
        m.put("sender", sender);
        if (nodes != null) m.put("nodes", nodes);
        if (destinations != null) m.put("destinations", destinations);
        if (payload != null) m.put("payload", payload);
        if (status != null) m.put("status", status);
        if (error != null) m.put("error", error.toMap());
        if (extensions != null) {
            List<Map<String, Object>> ext = new ArrayList<>();
            for (Extension e : extensions) {
                ext.add(e.toMap());
            }
            m.put("extensions", ext);
        }
        m.put("flags", flags != null ? flags : Types.canonicalFlags(null));
        return m;
    }

    @Override
    public String toString() {
        return "Packet{op=" + op + ", what=" + what + ", uuid=" + uuid
                + ", sender=" + sender + ", destinations=" + destinations + "}";
    }

    // --- Nested value types --------------------------------------------------

    /** CWSP packet error body. */
    public static final class Error {
        private String code;
        private String message;
        private Object details; // nullable

        public Error() {
        }

        public Error(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Object getDetails() {
            return details;
        }

        public void setDetails(Object details) {
            this.details = details;
        }

        public Map<String, Object> toMap() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("code", code);
            m.put("message", message);
            if (details != null) m.put("details", details);
            return m;
        }
    }

    /** CWSP extension descriptor. */
    public static final class Extension {
        private String id;
        private int version;
        private boolean required;
        private Object data; // nullable

        public Extension() {
        }

        public Extension(String id, int version, boolean required) {
            this.id = id;
            this.version = version;
            this.required = required;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public int getVersion() {
            return version;
        }

        public void setVersion(int version) {
            this.version = version;
        }

        public boolean isRequired() {
            return required;
        }

        public void setRequired(boolean required) {
            this.required = required;
        }

        public Object getData() {
            return data;
        }

        public void setData(Object data) {
            this.data = data;
        }

        public Map<String, Object> toMap() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", id);
            m.put("version", version);
            m.put("required", required);
            if (data != null) m.put("data", data);
            return m;
        }
    }

    /** Compact DataAsset envelope (text/image/file payload metadata). */
    public static final class DataAsset {
        private String hash;
        private String name;
        private String mimeType;
        private long size;
        private String source;
        private String data; // nullable
        private String url;  // nullable

        public DataAsset() {
        }

        public String getHash() {
            return hash;
        }

        public void setHash(String hash) {
            this.hash = hash;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getMimeType() {
            return mimeType;
        }

        public void setMimeType(String mimeType) {
            this.mimeType = mimeType;
        }

        public long getSize() {
            return size;
        }

        public void setSize(long size) {
            this.size = size;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public Map<String, Object> toMap() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("hash", hash);
            m.put("name", name);
            m.put("mimeType", mimeType);
            m.put("size", size);
            m.put("source", source);
            if (data != null) m.put("data", data);
            if (url != null) m.put("url", url);
            return m;
        }
    }

    // --- Builder -------------------------------------------------------------

    /** Fluent builder for canonical packets. */
    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private final Packet p = new Packet();

        public Builder op(Types.Verb op) {
            p.op = op;
            return this;
        }

        public Builder what(String what) {
            p.what = what;
            return this;
        }

        public Builder purpose(Types.Purpose purpose) {
            p.purpose = purpose;
            return this;
        }

        public Builder protocol(String protocol) {
            p.protocol = protocol;
            return this;
        }

        public Builder transport(String transport) {
            p.transport = transport;
            return this;
        }

        public Builder uuid(String uuid) {
            p.uuid = uuid;
            return this;
        }

        public Builder timestamp(long timestamp) {
            p.timestamp = timestamp;
            return this;
        }

        public Builder sender(String sender) {
            p.sender = sender;
            return this;
        }

        public Builder destinations(List<String> destinations) {
            p.destinations = destinations == null ? null : new ArrayList<>(destinations);
            p.nodes = p.destinations;
            return this;
        }

        public Builder payload(Object payload) {
            p.payload = payload;
            return this;
        }

        public Builder status(Integer status) {
            p.status = status;
            return this;
        }

        public Builder error(Error error) {
            p.error = error;
            return this;
        }

        public Builder extensions(List<Extension> extensions) {
            p.extensions = extensions == null ? null : new ArrayList<>(extensions);
            return this;
        }

        public Builder flags(Map<String, Object> flags) {
            p.flags = Types.canonicalFlags(flags);
            return this;
        }

        public Packet build() {
            if (p.flags == null) {
                p.flags = Types.canonicalFlags(null);
            }
            return p;
        }
    }
}
