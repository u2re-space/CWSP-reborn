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
    hubFailoverCandidates,
    isPrivateHubUrl,
    isPrivateLanHost,
    lanHostFromPeerId,
    listLanDirectUpPeerIds,
    mergePeerEndpointMaps,
    nextHubCandidateIndex,
    orderedDialCandidates,
    parsePathCapabilityPayload,
    parsePeerRegistryPayload,
    peerControlWsCandidates,
    peerEndpointsFromRegistry,
    peerIdFromLanHost,
    peerIdsEqual,
    type PeerEndpoint,
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

test("peerControlWsCandidates Cap phone is :8434 only", () => {
    assert.deepEqual(peerControlWsCandidates("L-210"), [
        "ws://192.168.0.210:8434/ws",
    ]);
});

test("peerControlWsCandidates desk includes :8434 then :29110", () => {
    assert.deepEqual(peerControlWsCandidates("L-110"), [
        "ws://192.168.0.110:8434/ws",
        "ws://192.168.0.110:29110/ws",
    ]);
});

test("listLanDirectUpPeerIds returns only known-up lan-direct", () => {
    const cache = createPathCapabilityCache(60_000);
    cache.set({ toId: "L-210", class: "lan-direct", ok: true });
    cache.set({ toId: "L-196", class: "lan-direct", ok: false });
    cache.set({ toId: "L-208", class: "lan-gateway", ok: true });
    assert.deepEqual(listLanDirectUpPeerIds(cache), ["L-210"]);
});

test("peerIdsEqual collapses short and long forms", () => {
    assert.equal(peerIdsEqual("L-210", "L-192.168.0.210"), true);
    assert.equal(peerIdsEqual("L-110", "L-196"), false);
});

test("mergePeerEndpointMaps prefers probe-verified over hub", () => {
    const hub: PeerEndpoint[] = [{
        toId: "L-210",
        class: "lan-direct",
        origin: "http://192.168.0.210:8434",
        source: "hub",
        ts: 100,
    }];
    const probe: PeerEndpoint[] = [{
        toId: "L-210",
        class: "lan-direct",
        origin: "http://192.168.0.210:8434",
        source: "probe",
        verified: true,
        ts: 100,
    }];
    const merged = mergePeerEndpointMaps(hub, probe);
    assert.equal(merged.length, 1);
    assert.equal(merged[0].source, "probe");
    assert.equal(merged[0].verified, true);
});

test("orderedDialCandidates prefers verified lan before wan-direct", () => {
    const eps: PeerEndpoint[] = [
        {
            toId: "L-210",
            class: "wan-direct",
            origin: "https://45.150.9.153:8434",
            verified: true,
            source: "self",
            ts: 2,
        },
        {
            toId: "L-210",
            class: "lan-direct",
            origin: "http://192.168.0.210:8434",
            verified: true,
            source: "probe",
            ts: 2,
        },
    ];
    const ordered = orderedDialCandidates("L-210", eps);
    assert.equal(ordered[0].class, "lan-direct");
    assert.ok(ordered[0].wsUrl.includes("192.168.0.210"));
    assert.equal(ordered[1].class, "wan-direct");
});

test("hubFailoverCandidates normalizes https list and dedupes", () => {
    const out = hubFailoverCandidates([
        "https://192.168.0.200:8434/",
        "https://192.168.0.200:8434/ws",
        "https://45.147.121.152:8434",
    ]);
    assert.equal(out.length, 2);
    assert.ok(out[0].startsWith("wss://192.168.0.200:8434"));
    assert.ok(out[0].includes("/ws"));
    assert.ok(out[1].includes("45.147.121.152"));
});

test("orderHubCandidatesPreferPublic puts WAN before RFC1918", () => {
    const out = hubFailoverCandidates(
        ["https://192.168.0.200:8434", "https://45.147.121.152:8434"],
        { preferPublic: true },
    );
    assert.ok(out[0].includes("45.147.121.152"));
    assert.ok(out[1].includes("192.168.0.200"));
});

test("nextHubCandidateIndex sticks on public when preferPublic", () => {
    const c = hubFailoverCandidates([
        "https://45.147.121.152:8434",
        "https://192.168.0.200:8434",
    ]);
    assert.equal(nextHubCandidateIndex(c, 0, { preferPublic: true }), 0);
    assert.equal(nextHubCandidateIndex(c, 1, { preferPublic: false }), 0);
});

test("isPrivateLanHost covers fleet LAN", () => {
    assert.equal(isPrivateLanHost("192.168.0.200"), true);
    assert.equal(isPrivateLanHost("45.147.121.152"), false);
    assert.equal(isPrivateHubUrl("wss://192.168.0.200:8434/ws"), true);
});

test("peerRegistry parse + endpointsFromRegistry", () => {
    const parsed = parsePeerRegistryPayload({
        ts: 50,
        peers: [{
            id: "L-196",
            origins: [{ class: "lan-direct", origin: "http://192.168.0.196:8434/" }],
            viaHub: true,
        }],
    });
    assert.ok(parsed);
    const eps = peerEndpointsFromRegistry(parsed!);
    assert.equal(eps[0].source, "hub");
    assert.equal(eps[0].origin, "http://192.168.0.196:8434");
});
