/*
 * Filename: FilesIngressJson.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesIngressJson.java
 * Change date and time: 17.30.00_21.07.2026
 * Reason for changes: Task 6 — framework-free builder for the
 *   `cwspFilesIngress` envelope shape so the payload contract
 *   (transferId + source + stageDir + ok + reason? + files[]) is
 *   unit-testable without the Android SDK or org.json. FilesIngress.toIngressJson()
 *   delegates here and converts the returned Map to a JSONObject on the Android
 *   side; the Capacitor files-hub listener (Task 6) subscribes to the resulting
 *   event and runs decideOfferAfterStage → pack → files:offer.
 *   2026-07-21 (Bug A fix): optional `defaultDestinations` on the envelope so
 *   the Capacitor hub can skip the picker when Java already knows the target
 *   peer(s) (resolved from Configure.readClipboardDestinations, local client
 *   id filtered out). Without this, decideOfferAfterStage almost always yields
 *   needDestinations and the user sees no UI for Open-with shares.
 *
 * INVARIANT: no android.* / no org.json imports — only JDK, so this stays
 * compilable by scripts/check-java-android-pure.sh.
 */
package emission;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Builds the {@code cwspFilesIngress} envelope shape as a plain Map so it is
 * framework-free and unit-testable. {@code FilesIngress.toIngressJson()} wraps
 * this into a {@code org.json.JSONObject} for {@code CwsBridgePlugin.emitFilesIngress}.
 *
 * <p>Shape: {@code { transferId, source, stageDir, ok, reason?, files:[{name,size,path}] }}.</p>
 */
public final class FilesIngressJson {
    private FilesIngressJson() {}

    /** Framework-free staged-file input (mirrors FilesIngress.StagedFile). */
    public static final class StagedFileInput {
        public final String name;
        public final long size;
        public final String path;
        public StagedFileInput(String name, long size, String path) {
            this.name = name;
            this.size = size;
            this.path = path;
        }
    }

    /**
     * Build the ingress envelope as a Map. Null {@code transferId}/
     * {@code source}/{@code stageDir} are emitted as {@code null} so the
     * listener can detect a failed stage (ok=false) without a missing-key crash.
     */
    public static Map<String, Object> build(
            String transferId,
            String source,
            String stageDir,
            boolean ok,
            String reason,
            List<StagedFileInput> files
    ) {
        return build(transferId, source, stageDir, ok, reason, files, null);
    }

    /**
     * Build the ingress envelope with optional {@code defaultDestinations}.
     * WHY (Bug A): the Capacitor files-hub runs {@code decideOfferAfterStage}
     * on the envelope; without defaultDestinations it almost always yields
     * {@code needDestinations} and the user sees no picker UI for Open-with.
     * Java resolves destinations from Configure.readClipboardDestinations
     * (local client id filtered out) and seeds them here so the hub can
     * auto-offer when a real peer is configured, or pre-fill the picker.
     * Null / empty list omits the key (backward-compatible).
     */
    public static Map<String, Object> build(
            String transferId,
            String source,
            String stageDir,
            boolean ok,
            String reason,
            List<StagedFileInput> files,
            List<String> defaultDestinations
    ) {
        Map<String, Object> o = new LinkedHashMap<>();
        o.put("transferId", transferId);
        o.put("source", source);
        o.put("stageDir", stageDir);
        o.put("ok", ok);
        if (reason != null) o.put("reason", reason);
        List<Map<String, Object>> arr = new ArrayList<>();
        if (files != null) {
            for (StagedFileInput f : files) {
                Map<String, Object> fo = new LinkedHashMap<>();
                fo.put("name", f.name);
                fo.put("size", f.size);
                fo.put("path", f.path);
                arr.add(fo);
            }
        }
        o.put("files", arr);
        if (defaultDestinations != null && !defaultDestinations.isEmpty()) {
            o.put("defaultDestinations", new ArrayList<>(defaultDestinations));
        }
        return o;
    }
}
