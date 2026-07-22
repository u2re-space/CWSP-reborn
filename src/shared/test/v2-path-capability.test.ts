/*
 * CWSP v2 path-capability mesh tests.
 * WHY: continuous P2P probe cache must drop known-down lan-direct without
 * promoting gateway above unknown/ok peers.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
    NETWORK_WHAT_PATH_CAPABILITY,
    buildPathCapabilityPacket,
    createPathCapabilityCache,
    filterCandidatesByCapability,
    lanHostFromPeerId,
    parsePathCapabilityPayload,
    peerIdFromLanHost,
} from "../src/v2/path-capability.ts";

test("lanHostFromPeerId maps short fleet ids", () => {
    assert.equal(lanHostFromPeerId("L-210"), "192.168.0.210");
    assert.equal(lanHostFromPeerId("L-192.168.0.196"), "192.168.0.196");
    assert.equal(lanHostFromPeerId("nope"), null);
});

test("parse + build pathCapability packet round-trip", () => {
    const cache = createPathCapabilityCache(60_000);
    cache.set({ toId: "L-110", class: "lan-direct", ok: true, rttMs: 12, origin: "http://192.168.0.110:8434" });
    cache.set({ toId: "L-196", class: "lan-direct", ok: false, error: "connect" });
    const snap = cache.snapshot("L-210", { lanHost: "192.168.0.210", controlPort: 8434 });
    const packet = buildPathCapabilityPacket({
        snapshot: snap,
        sender: "L-210",
        uuid: "11111111-1111-4111-8111-111111111111",
        timestamp: 1_700_000_000_000,
    });
    assert.equal(packet.what, NETWORK_WHAT_PATH_CAPABILITY);
    assert.equal(packet.op, "act");
    const parsed = parsePathCapabilityPayload(packet.payload);
    assert.ok(parsed);
    assert.equal(parsed!.fromId, "L-210");
    assert.equal(parsed!.paths.length, 2);
});

test("cache TTL expires lan-direct known-down", async () => {
    const cache = createPathCapabilityCache(30);
    cache.set({ toId: "L-196", class: "lan-direct", ok: false, ts: Date.now() }, 30);
    assert.equal(cache.isLanDirectKnownDown("L-196"), true);
    await new Promise((r) => setTimeout(r, 40));
    assert.equal(cache.isLanDirectKnownDown("L-196"), false);
});

test("filterCandidatesByCapability drops known-down peer URLs only", () => {
    const cache = createPathCapabilityCache(60_000);
    cache.set({ toId: "L-196", class: "lan-direct", ok: false });
    const peerUp = "http://192.168.0.210:8434/service/files-blob/t/b?token=1";
    const peerDown = "http://192.168.0.196:8434/service/files-blob/t/b?token=1";
    const gwLan = "https://192.168.0.200:8434/files/blob/t/b?token=1";
    const gwWan = "https://45.147.121.152:8434/files/blob/t/b?token=1";
    const out = filterCandidatesByCapability(
        [peerDown, peerUp, gwLan, gwWan],
        cache,
    );
    assert.deepEqual(out, [peerUp, gwLan, gwWan]);
    assert.equal(peerIdFromLanHost("192.168.0.196"), "L-196");
});

test("filter keeps peer when unknown (no gateway-first flip)", () => {
    const cache = createPathCapabilityCache(60_000);
    const peer = "http://192.168.0.208:8434/service/files-blob/t/b?token=1";
    const gw = "https://192.168.0.200:8434/files/blob/t/b?token=1";
    const out = filterCandidatesByCapability([gw, peer], cache);
    assert.deepEqual(out, [peer, gw]);
});

test("filter keeps Neu desk :29110 when L-110 lan-direct known-down", () => {
    const cache = createPathCapabilityCache(60_000);
    cache.set({
        toId: "L-110",
        class: "lan-direct",
        ok: false,
        error: "connect",
        ts: Date.now(),
    });
    const desk = "http://192.168.0.110:29110/service/files-blob/t/b?token=a";
    const gw = "https://192.168.0.200:8434/files/blob/t/b?token=b";
    const out = filterCandidatesByCapability([desk, gw], cache);
    assert.ok(out.some((u) => u.includes(":29110")));
    assert.equal(out[0], desk);
});
