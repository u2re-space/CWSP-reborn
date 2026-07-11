/*
 * Filename: Payload.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Payload.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Carrier selection + DataAsset envelope normalization
 *                     (Java counterpart to cwsp-shared normalize.ts payload
 *                     helpers and validation.ts normalizeDataAssetEnvelope).
 */
package space.u2re.cwsp.protocol.packet;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Payload carrier selection and DataAsset normalization helpers.
 *
 * COMPAT: CWSP packets historically carried the body in any of
 * {@code payload | data | body | params | result}. The normalizer picks the
 * first present field, mirroring normalize.ts selectPayload().
 */
public final class Payload {

    // Order matters: matches normalize.ts selectPayload().
    private static final List<String> CARRIERS = Collections.unmodifiableList(
            Arrays.asList("payload", "data", "body", "params", "result"));

    // Allowed fields for a compact DataAsset envelope (validation.ts).
    private static final Set<String> DATA_ASSET_FIELDS = Collections.unmodifiableSet(
            new LinkedHashSet<>(Arrays.asList(
                    "hash", "name", "mimeType", "type", "size", "source", "data", "url")));

    // Fields that may carry a DataAsset in a clipboard payload.
    private static final List<String> ASSET_FIELDS = Collections.unmodifiableList(
            Arrays.asList("asset", "dataAsset", "file", "image"));

    private Payload() {
    }

    /**
     * Select the first present carrier field from an input record.
     *
     * @return the carrier value, or null if none present.
     */
    public static Object selectCarrier(Map<String, Object> input) {
        if (input == null) {
            return null;
        }
        for (String field : CARRIERS) {
            if (input.containsKey(field) && input.get(field) != null) {
                return input.get(field);
            }
        }
        return null;
    }

    /**
     * Normalize a candidate value into a compact DataAsset envelope, or return
     * null if it is not a valid envelope. Mirrors normalizeDataAssetEnvelope().
     */
    public static Packet.DataAsset normalizeDataAsset(Object value) {
        Map<String, Object> rec = Types.asRecord(value);
        if (rec == null) {
            return null;
        }
        // Reject envelopes with unknown fields.
        for (String key : rec.keySet()) {
            if (!DATA_ASSET_FIELDS.contains(key)) {
                return null;
            }
        }
        String hash = asString(rec.get("hash"));
        String name = asString(rec.get("name"));
        String mimeType = asString(rec.get("mimeType"));
        String type = asString(rec.get("type"));
        String effectiveMime = mimeType != null ? mimeType : type;
        Object sizeObj = rec.get("size");
        String source = asString(rec.get("source"));
        Object dataObj = rec.get("data");
        Object urlObj = rec.get("url");

        if (hash == null || hash.isEmpty()
                || name == null || name.isEmpty()
                || effectiveMime == null || effectiveMime.isEmpty()
                || !Types.isSafeNonNegInt(sizeObj)
                || source == null || source.isEmpty()
                || (dataObj != null && !(dataObj instanceof String))
                || (urlObj != null && !(urlObj instanceof String))) {
            return null;
        }

        Packet.DataAsset asset = new Packet.DataAsset();
        asset.setHash(hash);
        asset.setName(name);
        asset.setMimeType(effectiveMime);
        asset.setSize(((Number) sizeObj).longValue());
        asset.setSource(source);
        if (dataObj instanceof String) asset.setData((String) dataObj);
        if (urlObj instanceof String) asset.setUrl((String) urlObj);
        return asset;
    }

    /**
     * If the payload is a record and contains asset/dataAsset/file/image
     * fields, return a shallow copy with those fields normalized to DataAsset
     * envelopes. Mirrors normalizePayloadDataAssets().
     */
    public static Object normalizePayloadDataAssets(Object payload) {
        Map<String, Object> rec = Types.asRecord(payload);
        if (rec == null) {
            return payload;
        }
        boolean changed = false;
        Map<String, Object> normalized = rec;
        for (String field : ASSET_FIELDS) {
            if (!rec.containsKey(field)) {
                continue;
            }
            Packet.DataAsset asset = normalizeDataAsset(rec.get(field));
            if (asset == null) {
                throw new IllegalArgumentException(
                        "CWSP_PACKET_DATA_ASSET_INVALID: payload." + field
                                + " must be a compact DataAsset envelope");
            }
            if (!changed) {
                normalized = new LinkedHashMap<>(rec);
                changed = true;
            }
            normalized.put(field, asset.toMap());
        }
        return normalized;
    }

    /** List of carrier field names, in preference order. */
    public static List<String> carriers() {
        return CARRIERS;
    }

    /** List of asset-bearing field names inside a payload record. */
    public static List<String> assetFields() {
        return ASSET_FIELDS;
    }

    private static String asString(Object v) {
        return (v instanceof String) ? (String) v : null;
    }
}
