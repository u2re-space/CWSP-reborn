/*
 * Filename: Clipboard.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Clipboard.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Extract clipboard text/asset content from any compatible
 *                     carrier without platform APIs (Java counterpart to
 *                     cwsp-shared/src/v2/clipboard.ts).
 */
package space.u2re.cwsp.protocol.packet;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Clipboard content extraction. Reads compatible clipboard carriers
 * (payload/data/result/body, then text/content/body, plus asset envelopes)
 * without invoking any platform clipboard API.
 */
public final class Clipboard {

    // Outer carrier order matches clipboard.ts carriers().
    private static final List<String> OUTER = Collections.unmodifiableList(
            Arrays.asList("payload", "data", "result", "body"));

    // Inner text field order matches clipboard.ts textFromCarrier().
    private static final List<String> TEXT_FIELDS = Collections.unmodifiableList(
            Arrays.asList("text", "content", "body"));

    // Asset fields inside a carrier record.
    private static final List<String> ASSET_FIELDS = Collections.unmodifiableList(
            Arrays.asList("asset", "dataAsset", "file", "image"));

    private Clipboard() {
    }

    /** Clipboard content: text and/or asset, plus a dedupe key. */
    public static final class Content {
        private String text;
        private Packet.DataAsset asset;
        private String dedupeKey;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public Packet.DataAsset getAsset() {
            return asset;
        }

        public void setAsset(Packet.DataAsset asset) {
            this.asset = asset;
        }

        public String getDedupeKey() {
            return dedupeKey;
        }

        public void setDedupeKey(String dedupeKey) {
            this.dedupeKey = dedupeKey;
        }
    }

    /**
     * Extract clipboard content from any compatible carrier. Accepts a
     * {@link Packet} (uses its payload), a Map, a String, or a nested record.
     * Returns null if neither text nor an asset envelope is present.
     */
    public static Content extractContent(Object value) {
        // A normalized Packet carries the body in getPayload(); treat that as
        // the carrier so callers can pass either a raw map or a Packet.
        if (value instanceof Packet) {
            return extractContent(((Packet) value).getPayload());
        }
        List<Object> candidates = carriers(value);
        String text = null;
        Packet.DataAsset asset = null;

        for (Object candidate : candidates) {
            if (text == null) {
                text = textFromCarrier(candidate);
            }
            if (asset == null) {
                asset = assetFromCarrier(candidate);
            }
            if (text != null && asset != null) {
                break;
            }
        }

        if (text == null && asset == null) {
            return null;
        }
        Content c = new Content();
        if (text != null) {
            c.text = text;
            c.dedupeKey = "text:" + text;
        }
        if (asset != null) {
            c.asset = asset;
            if (c.dedupeKey == null) {
                c.dedupeKey = "asset:" + asset.getHash();
            }
        }
        return c;
    }

    public static String extractText(Object value) {
        Content c = extractContent(value);
        return c == null ? null : c.text;
    }

    public static Packet.DataAsset extractAsset(Object value) {
        Content c = extractContent(value);
        return c == null ? null : c.asset;
    }

    public static String dedupeKey(Object value) {
        Content c = extractContent(value);
        return c == null ? null : c.dedupeKey;
    }

    private static List<Object> carriers(Object value) {
        List<Object> result = new ArrayList<>();
        Map<String, Object> rec = Types.asRecord(value);
        if (rec == null) {
            result.add(value);
            return result;
        }
        for (String field : OUTER) {
            if (rec.containsKey(field) && rec.get(field) != null) {
                result.add(rec.get(field));
            }
        }
        result.add(value);
        return result;
    }

    private static String textFromCarrier(Object value) {
        if (value instanceof String) {
            return (String) value;
        }
        Map<String, Object> rec = Types.asRecord(value);
        if (rec == null) {
            return null;
        }
        for (String field : TEXT_FIELDS) {
            Object v = rec.get(field);
            if (v instanceof String) {
                return (String) v;
            }
        }
        return null;
    }

    private static Packet.DataAsset assetFromCarrier(Object value) {
        Map<String, Object> rec = Types.asRecord(value);
        if (rec == null) {
            return null;
        }
        for (String field : ASSET_FIELDS) {
            Packet.DataAsset asset = Payload.normalizeDataAsset(rec.get(field));
            if (asset != null) {
                return asset;
            }
        }
        return null;
    }
}
