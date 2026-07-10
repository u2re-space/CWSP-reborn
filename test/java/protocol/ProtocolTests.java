/*
 * Filename: ProtocolTests.java
 * FullPath: apps/CWSP-reborn/test/java/protocol/ProtocolTests.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: JUnit-less assertion harness proving the CWSP v2 Java
 *                     protocol base matches the TS contract for: verb alias
 *                     mapping, action canonicalization, clipboard text extract,
 *                     destination preservation (direct vs gateway-routed), and
 *                     canonicalV2 flag stamping.
 */
package space.u2re.cwsp.protocol.test;

import space.u2re.cwsp.protocol.codec.Decoder;
import space.u2re.cwsp.protocol.codec.Encoder;
import space.u2re.cwsp.protocol.network.Coordinator;
import space.u2re.cwsp.protocol.network.Policy;
import space.u2re.cwsp.protocol.network.Protocol;
import space.u2re.cwsp.protocol.packet.Clipboard;
import space.u2re.cwsp.protocol.packet.Commands;
import space.u2re.cwsp.protocol.packet.Packet;
import space.u2re.cwsp.protocol.packet.Types;
import space.u2re.cwsp.protocol.state.Settings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Minimal assertion harness. Run via {@code java -cp <out> space.u2re.cwsp.protocol.test.ProtocolTests}.
 * Exits non-zero on the first failed assertion.
 */
public final class ProtocolTests {

    private static int passed = 0;
    private static int failed = 0;

    private ProtocolTests() {
    }

    public static void main(String[] args) {
        // 1. Legacy verb "request" -> ask
        Types.Verb v = Commands.normalizeVerb("request");
        assertEquals("legacy verb request -> ask", Types.Verb.ASK, v);

        // 2. Legacy action "clipboard" -> clipboard:update
        String action = Commands.canonicalizeAction("clipboard");
        assertEquals("legacy action clipboard -> clipboard:update", Commands.CLIPBOARD_UPDATE, action);

        // 3. Clipboard text extract from payload.text
        Map<String, Object> clipPayload = new LinkedHashMap<>();
        clipPayload.put("text", "hello-cwsp");
        Map<String, Object> clipPacket = basePacketMap();
        clipPacket.put("op", "act");
        clipPacket.put("what", Commands.CLIPBOARD_UPDATE);
        clipPacket.put("payload", clipPayload);
        Packet normalizedClip = Protocol.normalizeIngress(clipPacket);
        String clipText = Clipboard.extractText(normalizedClip);
        assertEquals("clipboard text extracted from payload.text", "hello-cwsp", clipText);

        // 4a. Destination preservation: direct packet
        Map<String, Object> direct = basePacketMap();
        direct.put("op", "act");
        direct.put("what", Commands.MOUSE_MOVE);
        direct.put("destinations", Arrays.asList("L-192.168.0.110"));
        Packet directP = Protocol.normalizeIngress(direct);
        assertEquals("direct destinations preserved",
                Arrays.asList("L-192.168.0.110"), directP.getDestinations());
        assertEquals("direct nodes mirror destinations",
                Arrays.asList("L-192.168.0.110"), directP.getNodes());

        // 4b. Destination preservation: gateway-routed via target id
        Map<String, Object> routed = basePacketMap();
        routed.put("op", "act");
        routed.put("what", Commands.CLIPBOARD_UPDATE);
        routed.put("target", "L-192.168.0.110"); // single target -> one destination
        Packet routedP = Protocol.normalizeIngress(routed);
        assertEquals("gateway-routed target resolves to destination",
                Arrays.asList("L-192.168.0.110"), routedP.getDestinations());
        assertEquals("gateway-routed nodes mirror destinations",
                Arrays.asList("L-192.168.0.110"), routedP.getNodes());

        // 4c. No destinations -> broadcast (null)
        Map<String, Object> bcast = basePacketMap();
        bcast.put("op", "act");
        bcast.put("what", Commands.DEBUG_LOG);
        Packet bcastP = Protocol.normalizeIngress(bcast);
        if (bcastP.getDestinations() != null) {
            fail("broadcast packet should have null destinations, got " + bcastP.getDestinations());
        } else {
            pass("broadcast packet has null destinations");
        }

        // 5. flags.canonicalV2 stamped by builder/normalizer
        Packet built = Packet.builder()
                .op(Types.Verb.ACT)
                .what(Commands.CLIPBOARD_UPDATE)
                .uuid("test-uuid")
                .timestamp(1L)
                .sender("L-192.168.0.196")
                .build();
        assertEquals("built packet flags.canonicalV2 == true",
                Boolean.TRUE, built.getFlags().get("canonicalV2"));
        if (!built.isCanonicalV2()) {
            fail("isCanonicalV2() returned false");
        } else {
            pass("isCanonicalV2() true on built packet");
        }

        // 6. Normalized packet stamps canonicalV2 too
        if (!normalizedClip.isCanonicalV2()) {
            fail("normalized packet missing canonicalV2 flag");
        } else {
            pass("normalized packet stamps canonicalV2");
        }

        // 7. Codec round-trip through Encoder/Decoder
        String json = Encoder.toJson(built.toMap());
        Map<String, Object> parsed = Decoder.parseObject(json);
        Packet roundTrip = Protocol.normalizeIngress(parsed);
        assertEquals("codec round-trip op", Types.Verb.ACT, roundTrip.getOp());
        assertEquals("codec round-trip what", Commands.CLIPBOARD_UPDATE, roundTrip.getWhat());

        // 8. Policy: stale clipboard dropped
        Policy.Context staleCtx = new Policy.Context(
                100_000L, false, null, null, null, 0L, null, null);
        Packet staleClip = Packet.builder()
                .op(Types.Verb.ACT)
                .what(Commands.CLIPBOARD_UPDATE)
                .uuid("stale-uuid")
                .timestamp(1L) // very old
                .sender("L-192.168.0.196")
                .payload(clipPayload)
                .build();
        Policy.Decision staleDec = Policy.evaluate(staleClip, staleCtx);
        assertEquals("stale clipboard dropped",
                Types.PolicyAction.DROP, staleDec.action);
        assertEquals("stale clipboard reason",
                Types.PolicyReason.STALE, staleDec.reason);

        // 9. Policy: fresh clipboard accepted, class clipboard
        Policy.Context freshCtx = Policy.Context.connected(2L);
        Policy.Decision freshDec = Policy.evaluate(staleClip, freshCtx);
        assertEquals("fresh clipboard accepted",
                Types.PolicyAction.ACCEPT, freshDec.action);
        assertEquals("clipboard classified as clipboard",
                Types.PolicyClass.CLIPBOARD, freshDec.packetClass);

        // 10. Policy: duplicate uuid dropped
        List<String> seen = new ArrayList<>();
        seen.add("dup-uuid");
        Policy.Context dupCtx = new Policy.Context(
                2L, false, seen, null, null, 0L, null, null);
        Packet dupClip = Packet.builder()
                .op(Types.Verb.ACT)
                .what(Commands.CLIPBOARD_UPDATE)
                .uuid("dup-uuid")
                .timestamp(1L)
                .sender("L-192.168.0.196")
                .payload(clipPayload)
                .build();
        Policy.Decision dupDec = Policy.evaluate(dupClip, dupCtx);
        assertEquals("duplicate uuid dropped",
                Types.PolicyAction.DROP, dupDec.action);
        assertEquals("duplicate uuid reason",
                Types.PolicyReason.DUPLICATE_UUID, dupDec.reason);

        // 11. Settings extract from settings:* payload
        Map<String, Object> settingsPayload = new LinkedHashMap<>();
        settingsPayload.put("airpad.target", "L-192.168.0.110");
        Packet settingsPkt = Packet.builder()
                .op(Types.Verb.ACT)
                .what("settings:update")
                .uuid("set-uuid")
                .timestamp(1L)
                .sender("L-192.168.0.196")
                .payload(settingsPayload)
                .build();
        Map<String, Object> extracted = Settings.extract(settingsPkt);
        assertEquals("settings payload extracted", "L-192.168.0.110", extracted.get("airpad.target"));

        // 12. Coordinator helpers: broadcast + self-route
        if (!Coordinator.isBroadcast(null)) {
            fail("null destinations should be broadcast");
        } else {
            pass("null destinations isBroadcast true");
        }
        if (!Coordinator.isSelfRoute("L-1", Arrays.asList("L-1", "L-2"))) {
            fail("self-route not detected");
        } else {
            pass("self-route detected");
        }

        // 13. Purpose inference
        Packet mouseP = Protocol.normalizeIngress(direct);
        assertEquals("mouse action purpose airpad", Types.Purpose.AIRPAD, mouseP.getPurpose());
        assertEquals("clipboard action purpose clipboard",
                Types.Purpose.CLIPBOARD, normalizedClip.getPurpose());

        System.out.println();
        System.out.println("Passed: " + passed + ", Failed: " + failed);
        if (failed > 0) {
            System.exit(1);
        }
    }

    // --- Helpers -------------------------------------------------------------

    private static Map<String, Object> basePacketMap() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("uuid", "uuid-" + java.util.UUID.randomUUID());
        m.put("timestamp", 1L);
        m.put("sender", "L-192.168.0.196");
        return m;
    }

    private static void assertEquals(String name, Object expected, Object actual) {
        boolean ok = (expected == null) ? actual == null : expected.equals(actual);
        if (ok) {
            pass(name);
        } else {
            fail(name + " -- expected <" + expected + "> but got <" + actual + ">");
        }
    }

    private static void pass(String name) {
        passed++;
        System.out.println("  ok | " + name);
    }

    private static void fail(String message) {
        failed++;
        System.out.println("FAIL | " + message);
    }
}
