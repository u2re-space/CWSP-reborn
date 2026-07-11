/*
 * Filename: Clipboard.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/executor/Clipboard.java
 * Change date and time: 17.50.00_10.07.2026
 * Reason for changes: Protocol-facing clipboard executor — accept clipboard:*
 *   ask/act packets and apply/read via a pluggable Driver (OS or memory).
 *
 * WHY: emission.Clipboard is the local OS bridge (ClipboardManager); this
 * executor is the protocol driver that Coordinator (and future WS handlers)
 * call for remote requests/responses. Matches Node shared/executor/Clipboardy.
 *
 * INVARIANT: stable actions from network.mdc — clipboard:update|write|read|get|
 * clear|isReady (+ airpad:clipboard:* aliases). Echo suppression after remote
 * apply prevents watch-loop storms.
 */

package executor;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Clipboard protocol executor / driver.
 *
 * <p>Handles normalized CWSP clipboard packets and applies them through a
 * {@link Driver} (Android {@code emission.Clipboard} adapter or
 * {@link MemoryDriver} for host-free tests).</p>
 */
public class Clipboard {

    /** Default echo-suppression window after applying remote text (ms). */
    public static final long DEFAULT_ECHO_SUPPRESS_MS = 3500L;

    /**
     * Platform clipboard surface. Implementations must be safe to call from
     * the coordinator thread; Android drivers should hop to the main looper
     * when required by ClipboardManager.
     */
    public interface Driver {
        void write(String text);

        String read();

        void clear();

        /**
         * Optional DataAsset handoff (image/file). Default: unsupported.
         *
         * @return true if the asset was accepted/persisted
         */
        default boolean writeAsset(Map<String, Object> asset) {
            return false;
        }
    }

    /** In-memory driver for host-free tests (no android.jar). */
    public static final class MemoryDriver implements Driver {
        private String text = null;
        private String lastAssetHash = null;

        @Override
        public void write(String text) {
            this.text = text;
        }

        @Override
        public String read() {
            return text;
        }

        @Override
        public void clear() {
            this.text = null;
            this.lastAssetHash = null;
        }

        @Override
        public boolean writeAsset(Map<String, Object> asset) {
            if (asset == null) {
                return false;
            }
            Object hash = asset.get("hash");
            if (hash instanceof String && !((String) hash).isEmpty()) {
                this.lastAssetHash = (String) hash;
                return true;
            }
            return false;
        }

        public String lastAssetHash() {
            return lastAssetHash;
        }
    }

    private final Driver driver;
    private final ClipboardImage imageExecutor;
    private final ClipboardFile fileExecutor;
    private final long echoSuppressMs;

    private boolean echoSuppressed = false;
    private long echoSuppressUntil = 0L;
    private String lastAppliedText = null;
    private long lastApplyTs = 0L;

    public Clipboard(Driver driver) {
        this(driver, new ClipboardImage(), new ClipboardFile(), DEFAULT_ECHO_SUPPRESS_MS);
    }

    public Clipboard(Driver driver, long echoSuppressMs) {
        this(driver, new ClipboardImage(), new ClipboardFile(), echoSuppressMs);
    }

    public Clipboard(
            Driver driver,
            ClipboardImage imageExecutor,
            ClipboardFile fileExecutor,
            long echoSuppressMs
    ) {
        if (driver == null) {
            throw new IllegalArgumentException("clipboard driver required");
        }
        this.driver = driver;
        this.imageExecutor = imageExecutor != null ? imageExecutor : new ClipboardImage();
        this.fileExecutor = fileExecutor != null ? fileExecutor : new ClipboardFile();
        this.echoSuppressMs = echoSuppressMs > 0 ? echoSuppressMs : DEFAULT_ECHO_SUPPRESS_MS;
    }

    /**
     * Adapt an {@code emission.Clipboard} bridge without a hard compile-time
     * dependency on the emission package from pure tests.
     *
     * <p>Call sites that already have {@code emission.Clipboard} should use:</p>
     * <pre>{@code
     * new executor.Clipboard(executor.Clipboard.adaptEmission(emissionClipboard));
     * }</pre>
     */
    public static Driver adaptEmission(final Object emissionClipboard) {
        if (emissionClipboard == null) {
            return new MemoryDriver();
        }
        return new Driver() {
            @Override
            public void write(String text) {
                try {
                    emissionClipboard.getClass().getMethod("write", String.class)
                            .invoke(emissionClipboard, text);
                } catch (ReflectiveOperationException e) {
                    throw new IllegalStateException("emission.Clipboard.write failed", e);
                }
            }

            @Override
            public String read() {
                try {
                    Object v = emissionClipboard.getClass().getMethod("read")
                            .invoke(emissionClipboard);
                    return v == null ? null : v.toString();
                } catch (ReflectiveOperationException e) {
                    throw new IllegalStateException("emission.Clipboard.read failed", e);
                }
            }

            @Override
            public void clear() {
                try {
                    emissionClipboard.getClass().getMethod("clear").invoke(emissionClipboard);
                } catch (ReflectiveOperationException e) {
                    throw new IllegalStateException("emission.Clipboard.clear failed", e);
                }
            }

            @Override
            @SuppressWarnings("unchecked")
            public boolean writeAsset(Map<String, Object> asset) {
                try {
                    Object v = emissionClipboard.getClass()
                            .getMethod("writeAsset", Map.class)
                            .invoke(emissionClipboard, asset);
                    return Boolean.TRUE.equals(v);
                } catch (ReflectiveOperationException e) {
                    return false;
                }
            }
        };
    }

    /** Handle a normalized CWSP clipboard packet map; returns result/error map. */
    public Map<String, Object> handlePacket(Map<String, Object> packet) {
        if (packet == null) {
            return error(400, "clipboard-executor: null packet");
        }
        String what = normalizeWhat(packet.get("what"), packet.get("type"), packet.get("action"));
        Map<String, Object> payload = extractPayload(packet);

        try {
            switch (what) {
                case "clipboard:update":
                case "clipboard:write":
                case "airpad:clipboard:write":
                case "airpad:clipboard:delivery": {
                    ApplyResult applied = applyPayload(payload);
                    Map<String, Object> body = new LinkedHashMap<>();
                    body.put("applied", applied.applied);
                    body.put("suppressed", applied.suppressed);
                    if (applied.text != null) {
                        body.put("text", applied.text);
                    }
                    if (applied.assetHash != null) {
                        body.put("assetHash", applied.assetHash);
                    }
                    return result(what, body);
                }
                case "clipboard:read":
                case "clipboard:get":
                case "airpad:clipboard:read": {
                    Map<String, Object> body = new LinkedHashMap<>();
                    body.put("text", readText());
                    return result(what, body);
                }
                case "clipboard:clear": {
                    clear();
                    Map<String, Object> body = new LinkedHashMap<>();
                    body.put("cleared", true);
                    return result(what, body);
                }
                case "clipboard:isReady":
                case "airpad:clipboard:isReady": {
                    Map<String, Object> body = new LinkedHashMap<>();
                    body.put("ready", isReady());
                    body.put("ts", lastApplyTs);
                    return result(what, body);
                }
                default:
                    return error(404, "clipboard-executor: unhandled what=" + what);
            }
        } catch (Throwable t) {
            return error(500, "clipboard-executor: " + what + " failed: " + t.getMessage());
        }
    }

    /** Apply remote text (act path). Honors echo suppression for identical text. */
    public boolean applyRemote(String text) {
        return applyText(text).applied;
    }

    public ApplyResult applyPayload(Map<String, Object> payload) {
        String text = extractClipboardText(payload);
        Map<String, Object> asset = extractAsset(payload);
        ApplyResult out = new ApplyResult();
        boolean imageLike = false;

        if (asset != null) {
            String hash = stringField(asset, "hash");
            String mime = stringField(asset, "mimeType");
            if (mime == null) {
                mime = stringField(asset, "type");
            }
            String name = stringField(asset, "name");
            imageLike = mime != null && mime.startsWith("image/");
            boolean ok = driver.writeAsset(asset);
            if (imageLike) {
                ok = imageExecutor.applyRemote(hash, mime) || ok;
            } else if (name != null) {
                long size = 0L;
                Object sizeObj = asset.get("size");
                if (sizeObj instanceof Number) {
                    size = ((Number) sizeObj).longValue();
                }
                ok = fileExecutor.applyRemote(hash, name, size) || ok;
            }
            out.assetHash = hash;
            out.applied = ok || text != null;
        }

        if (text != null) {
            // WHY: image ClipData coerceToText often yields content:// — applying that
            // as clipboard text overwrote the just-set image and killed real text sync.
            boolean ghostUri =
                    imageLike
                            && (text.startsWith("content:")
                                    || text.startsWith("file:")
                                    || text.startsWith("http:")
                                    || text.startsWith("https:"));
            if (!ghostUri) {
                ApplyResult textResult = applyText(text);
                out.applied = out.applied || textResult.applied;
                out.suppressed = textResult.suppressed;
                out.text = textResult.text;
            }
        } else if (asset == null) {
            out.applied = false;
        }
        return out;
    }

    public ApplyResult applyText(String text) {
        ApplyResult out = new ApplyResult();
        if (text == null || text.isEmpty()) {
            return out;
        }
        long now = System.currentTimeMillis();
        if (echoSuppressed
                && now < echoSuppressUntil
                && text.equals(lastAppliedText)) {
            out.suppressed = true;
            out.text = text;
            return out;
        }
        driver.write(text);
        lastAppliedText = text;
        lastApplyTs = now;
        echoSuppressed = true;
        echoSuppressUntil = now + echoSuppressMs;
        out.applied = true;
        out.text = text;
        return out;
    }

    public String readText() {
        return driver.read();
    }

    public void writeText(String text) {
        if (text == null || text.isEmpty()) {
            clear();
            return;
        }
        driver.write(text);
        lastAppliedText = text;
        lastApplyTs = System.currentTimeMillis();
    }

    public void clear() {
        driver.clear();
        lastAppliedText = null;
        lastApplyTs = System.currentTimeMillis();
        clearEchoSuppression();
    }

    public boolean isReady() {
        return driver != null;
    }

    public boolean isEchoSuppressed() {
        return echoSuppressed && System.currentTimeMillis() < echoSuppressUntil;
    }

    public void clearEchoSuppression() {
        echoSuppressed = false;
        echoSuppressUntil = 0L;
    }

    public long lastApplyTimestamp() {
        return lastApplyTs;
    }

    public Driver driver() {
        return driver;
    }

    // ---- packet helpers (network.mdc carriers) ----

    static String normalizeWhat(Object what, Object type, Object action) {
        Object w = what != null ? what : (type != null ? type : action);
        if (w == null) {
            return "dispatch";
        }
        String s = w.toString();
        switch (s) {
            case "clipboard":
                return "clipboard:update";
            case "airpad:clipboard:delivery":
                return "airpad:clipboard:delivery";
            default:
                return s;
        }
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> extractPayload(Map<String, Object> packet) {
        for (String key : new String[]{"payload", "data", "body", "result"}) {
            Object v = packet.get(key);
            if (v instanceof Map) {
                return (Map<String, Object>) v;
            }
        }
        return null;
    }

    static String extractClipboardText(Map<String, Object> payload) {
        if (payload == null) {
            return null;
        }
        for (String key : new String[]{"text", "content", "body"}) {
            Object v = payload.get(key);
            if (v instanceof String && !((String) v).isEmpty()) {
                return (String) v;
            }
        }
        Object direct = payload.get("payload");
        if (direct instanceof String && !((String) direct).isEmpty()) {
            return (String) direct;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> extractAsset(Map<String, Object> payload) {
        if (payload == null) {
            return null;
        }
        for (String key : new String[]{"asset", "dataAsset", "file", "image"}) {
            Object v = payload.get(key);
            if (v instanceof Map) {
                return (Map<String, Object>) v;
            }
        }
        return null;
    }

    private static String stringField(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v instanceof String ? (String) v : null;
    }

    private static Map<String, Object> result(String what, Map<String, Object> payload) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("op", "result");
        out.put("what", what);
        out.put("status", 200);
        out.put("result", payload);
        return out;
    }

    private static Map<String, Object> error(int status, String message) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("op", "error");
        out.put("status", status);
        Map<String, Object> err = new LinkedHashMap<>();
        err.put("message", message);
        out.put("error", err);
        return out;
    }

    /** Outcome of an apply/write attempt. */
    public static final class ApplyResult {
        public boolean applied;
        public boolean suppressed;
        public String text;
        public String assetHash;
    }
}
