/*
 * Filename: ClipboardExecutorTest.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/test/java/android/executor/ClipboardExecutorTest.java
 * Change date and time: 17.50.00_10.07.2026
 * Reason for changes: Host-free assertions for protocol clipboard executor
 *   (write/read/ask/result + echo suppress + asset hash).
 */

package executor;

import java.util.LinkedHashMap;
import java.util.Map;

/** JUnit-less harness for {@link Clipboard} MemoryDriver path. */
public final class ClipboardExecutorTest {

    private ClipboardExecutorTest() {
    }

    public static void main(String[] args) {
        int failed = 0;
        failed += checkWriteRead();
        failed += checkAskRead();
        failed += checkUpdateAct();
        failed += checkEchoSuppress();
        failed += checkAsset();
        failed += checkClear();
        if (failed != 0) {
            System.err.println("ClipboardExecutorTest FAILED: " + failed + " assertion(s)");
            System.exit(1);
        }
        System.out.println("ClipboardExecutorTest OK: all assertions passed");
    }

    private static int checkWriteRead() {
        Clipboard exec = new Clipboard(new Clipboard.MemoryDriver());
        exec.writeText("hello-android");
        if (!"hello-android".equals(exec.readText())) {
            System.err.println("fail | write/read round-trip");
            return 1;
        }
        return 0;
    }

    private static int checkAskRead() {
        Clipboard exec = new Clipboard(new Clipboard.MemoryDriver());
        exec.writeText("ask-me");
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "ask");
        packet.put("what", "clipboard:read");
        Map<String, Object> out = exec.handlePacket(packet);
        if (!"result".equals(out.get("op"))) {
            System.err.println("fail | ask read op");
            return 1;
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) out.get("result");
        if (result == null || !"ask-me".equals(result.get("text"))) {
            System.err.println("fail | ask read text");
            return 1;
        }
        return 0;
    }

    private static int checkUpdateAct() {
        Clipboard exec = new Clipboard(new Clipboard.MemoryDriver());
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("text", "from-remote");
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:update");
        packet.put("payload", payload);
        Map<String, Object> out = exec.handlePacket(packet);
        if (!"result".equals(out.get("op")) || !"from-remote".equals(exec.readText())) {
            System.err.println("fail | update act apply");
            return 1;
        }
        return 0;
    }

    private static int checkEchoSuppress() {
        Clipboard exec = new Clipboard(new Clipboard.MemoryDriver(), 5_000L);
        exec.applyRemote("same");
        Clipboard.ApplyResult second = exec.applyText("same");
        if (!second.suppressed || second.applied) {
            System.err.println("fail | echo suppress");
            return 1;
        }
        return 0;
    }

    private static int checkAsset() {
        Clipboard.MemoryDriver driver = new Clipboard.MemoryDriver();
        Clipboard exec = new Clipboard(driver);
        Map<String, Object> asset = new LinkedHashMap<>();
        asset.put("hash", "abc123");
        asset.put("name", "pic.png");
        asset.put("mimeType", "image/png");
        asset.put("size", 12);
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("asset", asset);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:write");
        packet.put("payload", payload);
        Map<String, Object> out = exec.handlePacket(packet);
        if (!"result".equals(out.get("op"))) {
            System.err.println("fail | asset result op");
            return 1;
        }
        if (!"abc123".equals(driver.lastAssetHash())) {
            System.err.println("fail | asset hash stored");
            return 1;
        }
        return 0;
    }

    private static int checkClear() {
        Clipboard exec = new Clipboard(new Clipboard.MemoryDriver());
        exec.writeText("x");
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:clear");
        exec.handlePacket(packet);
        if (exec.readText() != null) {
            System.err.println("fail | clear");
            return 1;
        }
        return 0;
    }
}
