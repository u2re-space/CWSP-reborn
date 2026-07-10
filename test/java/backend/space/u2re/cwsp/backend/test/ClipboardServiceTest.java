/*
 * Filename: ClipboardServiceTest.java
 * FullPath: apps/CWSP-reborn/test/java/backend/space/u2re/cwsp/backend/test/ClipboardServiceTest.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — prove clipboard shadow + packet adapter text extraction.
 */

package space.u2re.cwsp.backend.test;

import space.u2re.cwsp.backend.clipboard.ClipboardService;

import java.util.LinkedHashMap;
import java.util.Map;

public final class ClipboardServiceTest {

    private ClipboardServiceTest() {}

    public static void main(String[] args) {
        ClipboardService svc = new ClipboardService();
        SettingsStoreTest.assertEq(true, svc.isReady());
        svc.write("hello-shadow");
        SettingsStoreTest.assertEq("hello-shadow", svc.read());

        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:update");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("text", "from-packet");
        packet.put("payload", payload);

        SettingsStoreTest.assertEq("from-packet", svc.applyPacket(packet));
        SettingsStoreTest.assertEq("from-packet", svc.read());

        svc.clear();
        SettingsStoreTest.assertEq("", svc.read());
        System.out.println("OK ClipboardServiceTest");
    }
}
