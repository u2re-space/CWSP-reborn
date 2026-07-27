/*
 * Filename: path-capability-mesh.test.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/path-capability-mesh.test.ts
 * Change date and time: 09.30.00_22.07.2026
 * Reason for changes: Mesh known-down lan-direct must omit peer URL from Accept hedge.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { filterCandidatesByCapability } from "@fest-lib/cwsp-shared/v2/index.ts";
import { expandFilesBlobFetchUrls, partitionBlobFetchUrls } from "./files-blob-store.ts";
import { getPathCapabilityCache } from "./path-capability-mesh.ts";

test("mesh marks peer down → peer URL omitted from hedge list", () => {
    const peer = "http://192.168.0.196:8434/service/files-blob/t/b?token=a";
    const gw = "https://192.168.0.200:8434/files/blob/t/b?token=b";
    const cache = getPathCapabilityCache();
    cache.clear();
    cache.set({
        toId: "L-196",
        class: "lan-direct",
        ok: false,
        error: "connect",
        ts: Date.now(),
    });

    const expanded = expandFilesBlobFetchUrls(peer, [peer, gw]);
    const filtered = filterCandidatesByCapability(expanded, cache);
    assert.ok(
        !filtered.some((u) => u.includes("192.168.0.196")),
        "known-down Cap Control URL must be dropped",
    );
    assert.ok(
        filtered.some((u) => u.includes("192.168.0.200")),
        "gateway candidate must remain",
    );
    const { peer: peerClass, gateway } = partitionBlobFetchUrls(filtered);
    assert.equal(peerClass.length, 0, "hedge peer class empty when mesh says down");
    assert.ok(gateway.length >= 1);
    cache.clear();
});

test("mesh unknown peer keeps lan-direct in hedge (no gateway-first flip)", () => {
    const peer = "http://192.168.0.210:8434/service/files-blob/t/b?token=a";
    const gw = "https://192.168.0.200:8434/files/blob/t/b?token=b";
    const cache = getPathCapabilityCache();
    cache.clear();
    const filtered = filterCandidatesByCapability(
        expandFilesBlobFetchUrls(peer, [peer, gw]),
        cache,
    );
    assert.equal(filtered[0], peer, "cold cache must keep peer-first order");
    cache.clear();
});

test("desk :29110 blob kept even when L-110 lan-direct marked down", () => {
    // WHY: Cap mesh probed :8434 only → known-down L-110; Neu GB URL is :29110.
    const desk = "http://192.168.0.110:29110/service/files-blob/t/b?token=a";
    const gw = "https://192.168.0.200:8434/files/blob/t/b?token=b";
    const cache = getPathCapabilityCache();
    cache.clear();
    cache.set({
        toId: "L-110",
        class: "lan-direct",
        ok: false,
        error: "connect",
        ts: Date.now(),
    });
    const filtered = filterCandidatesByCapability([desk, gw], cache);
    assert.ok(
        filtered.some((u) => u.includes(":29110")),
        "Neu desk blob port must survive Cap-port known-down",
    );
    cache.clear();
});
