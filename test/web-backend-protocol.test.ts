/*
 * Filename: web-backend-protocol.test.ts
 * FullPath: apps/CWSP-reborn/test/web-backend-protocol.test.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream C — prove the Web/PWA backend barrel works
 * end-to-end: memory KV round-trip, share-target parse, clipboard emission
 * packet shape, and executor apply + defer-to-store behavior.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
    createMemoryKvStore,
    parseShareTargetSearch,
    normalizeShareTarget,
    buildPwaClipboardPacket,
    buildAirPadClipboardPacket,
    buildAirPadClipboardWriteWrapper,
    applyClipboardPacket,
    restoreDeferredClipboard,
    applyAirPadClipboardPacket,
    CLIPBOARD_LAST_KEY,
    AIRPAD_CLIPBOARD_LAST_KEY,
} from "../src/backend/web/index.ts";

const NOW = 1_700_000_000_000;
const SENDER = "L-192.168.0.196";
const TARGET = "L-192.168.0.110";

test("memory KV store: round-trip set/get/delete", async () => {
    const kv = createMemoryKvStore();
    assert.equal(await kv.get("missing"), undefined);

    await kv.set("k", { a: 1 });
    assert.deepEqual(await kv.get("k"), { a: 1 });

    await kv.set("k", "overwrite");
    assert.equal(await kv.get("k"), "overwrite");

    await kv.delete("k");
    assert.equal(await kv.get("k"), undefined);
});

test("ShareTarget: parseShareTargetSearch reads title/text/url from string and URLSearchParams", () => {
    const fromString = parseShareTargetSearch("?title=Hi&text=Hello&url=https://x.test/y");
    assert.equal(fromString.title, "Hi");
    assert.equal(fromString.text, "Hello");
    assert.equal(fromString.url, "https://x.test/y");

    const fromParams = parseShareTargetSearch(new URLSearchParams("text=only"));
    assert.equal(fromParams.text, "only");
    assert.equal(fromParams.title, undefined);
});

test("ShareTarget: normalize prefers text over url over title for the defer body", () => {
    assert.equal(normalizeShareTarget({ text: "t", url: "u", title: "ti" }).body, "t");
    assert.equal(normalizeShareTarget({ url: "u", title: "ti" }).body, "u");
    assert.equal(normalizeShareTarget({ title: "ti" }).body, "ti");
    assert.equal(normalizeShareTarget({}).body, undefined);
});

test("PWA emission: buildPwaClipboardPacket produces op=act, what=clipboard:update", () => {
    const packet = buildPwaClipboardPacket({
        text: "clip-pwa",
        uuid: "11111111-1111-4111-8111-111111111111",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });

    assert.equal(packet.op, "act");
    assert.equal(packet.what, "clipboard:update");
    assert.equal(packet.purpose, "clipboard");
    assert.equal(packet.protocol, "ws");
    assert.equal(packet.transport, "ws");
    assert.equal(packet.flags.canonicalV2, true);
    assert.deepEqual(packet.destinations, [TARGET]);
    assert.equal((packet.payload as { text: string }).text, "clip-pwa");
});

test("AirPad emission: canonical + alias wrappers both carry clipboard semantics", () => {
    const canonical = buildAirPadClipboardPacket({
        text: "clip-air",
        uuid: "22222222-2222-4222-8222-222222222222",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });
    assert.equal(canonical.op, "act");
    assert.equal(canonical.what, "clipboard:update");
    assert.equal(canonical.purpose, "clipboard");

    const alias = buildAirPadClipboardWriteWrapper({
        text: "clip-air",
        uuid: "33333333-3333-4333-8333-333333333333",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });
    assert.equal(alias.op, "act");
    assert.equal(alias.what, "airpad:clipboard:write");
    assert.equal(alias.purpose, "clipboard");
});

test("PWA executor: applies text to the injected writer", async () => {
    const written: string[] = [];
    const writer = async (text: string) => {
        written.push(text);
    };

    const packet = buildPwaClipboardPacket({
        text: "apply-me",
        uuid: "44444444-4444-4444-8444-444444444444",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });

    const result = await applyClipboardPacket(packet, { writer });
    assert.equal(result.applied, true);
    if (result.applied) {
        assert.equal(result.text, "apply-me");
    }
    assert.deepEqual(written, ["apply-me"]);
});

test("PWA executor: defers to KvStore under clipboard:last when the writer rejects", async () => {
    const kv = createMemoryKvStore();
    let fail = true;
    const writer = async (text: string) => {
        if (fail) {
            throw new Error("writer-busy");
        }
        void text;
    };

    const packet = buildPwaClipboardPacket({
        text: "defer-me",
        uuid: "55555555-5555-4555-8555-555555555555",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });

    const result = await applyClipboardPacket(packet, { writer, kv });
    assert.equal(result.applied, false);
    if (!result.applied && "deferred" in result) {
        assert.equal(result.deferred, true);
        assert.equal(result.text, "defer-me");
    }
    assert.equal(await kv.get(CLIPBOARD_LAST_KEY), "defer-me");

    // Now the writer recovers; restore should apply + clear the slot.
    fail = false;
    const restored = await restoreDeferredClipboard(kv, writer);
    assert.equal(restored.applied, true);
    assert.equal(await kv.get(CLIPBOARD_LAST_KEY), undefined);
});

test("PWA executor: no-text packet is not applied and not deferred", async () => {
    const writer = async () => {
        throw new Error("should-not-call");
    };
    const kv = createMemoryKvStore();

    // Build a packet and strip its text to simulate a textless clipboard frame.
    const packet = buildPwaClipboardPacket({
        text: "x",
        uuid: "66666666-6666-4666-8666-666666666666",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });
    packet.payload = {};

    const result = await applyClipboardPacket(packet, { writer, kv });
    assert.equal(result.applied, false);
    if (!result.applied && "deferred" in result) {
        assert.equal(result.deferred, false);
    }
});

test("AirPad executor: applies text and reuses the same defer contract", async () => {
    const written: string[] = [];
    const writer = async (text: string) => {
        written.push(text);
    };
    const kv = createMemoryKvStore();

    const packet = buildAirPadClipboardPacket({
        text: "air-apply",
        uuid: "77777777-7777-4777-8777-777777777777",
        timestamp: NOW,
        identity: { sender: SENDER, destinations: [TARGET] },
    });

    const result = await applyAirPadClipboardPacket(packet, { writer, kv });
    assert.equal(result.applied, true);
    if (result.applied) {
        assert.equal(result.text, "air-apply");
    }
    assert.deepEqual(written, ["air-apply"]);
    // AirPad executor uses the same defer key name as PWA by contract.
    assert.equal(AIRPAD_CLIPBOARD_LAST_KEY, CLIPBOARD_LAST_KEY);
});
