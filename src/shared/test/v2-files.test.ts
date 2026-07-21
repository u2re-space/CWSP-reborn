/*
 * Files-transfer constants and types contract tests.
 * WHY: lock the design thresholds and the canonical `files:*` action surface
 * before any packer/transport implementation lands in later waves.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
    CHUNK_MAX,
    SMALL_FILE_MAX,
    ZIP_BATCH_MAX,
    FILES_WHAT_OFFER,
    FILES_PURPOSE,
} from "../src/v2/files-constants.ts";
import { planFilesBatches } from "../src/v2/files-packer.ts";
import { createFilesProgressTracker, shouldEmitProgress } from "../src/v2/files-progress.ts";
import {
    buildFilesOfferPacket,
    parseFilesOfferPayload,
    chooseByteTransport,
    parseFilesChunkPayload,
    buildFilesChunkPacket,
    buildFilesProgressPacket,
    parseFilesAcceptPayload,
    buildFilesAcceptPacket,
    parseFilesProgressPayload,
} from "../src/v2/files.ts";
import { normalizeCwspPacket } from "../src/v2/normalize.ts";

test("files constants match design thresholds", () => {
    assert.equal(SMALL_FILE_MAX, 500 * 1024);
    assert.equal(ZIP_BATCH_MAX, 8 * 1024 * 1024);
    assert.equal(CHUNK_MAX, 16 * 1024 * 1024);
    assert.equal(FILES_WHAT_OFFER, "files:offer");
    assert.equal(FILES_PURPOSE, "storage");
});

// --- Task 2: packer policy (pure) -------------------------------------------

test("packer groups small files into zip batches under ZIP_BATCH_MAX", () => {
    const files = [
        { name: "a.txt", size: 200 * 1024 },
        { name: "b.txt", size: 200 * 1024 },
        { name: "c.txt", size: 200 * 1024 },
    ];
    const plan = planFilesBatches(files);
    assert.equal(plan.length, 1);
    assert.equal(plan[0].kind, "zip");
    assert.equal(plan[0].files.length, 3);
});

test("packer emits raw for single file between 8MiB and 12MiB", () => {
    const plan = planFilesBatches([{ name: "big.bin", size: 9 * 1024 * 1024 }]);
    assert.equal(plan.length, 1);
    assert.equal(plan[0].kind, "raw");
});

test("packer marks >12MiB as compress-try (compressed kind plan)", () => {
    const plan = planFilesBatches([{ name: "huge.bin", size: 13 * 1024 * 1024 }]);
    assert.equal(plan.length, 1);
    assert.equal(plan[0].kind, "compressed");
});

test("packer splits small files across zip batches when sum exceeds ZIP_BATCH_MAX", () => {
    const files = Array.from({ length: 20 }, (_, i) => ({
        name: `f${i}.bin`,
        size: 500 * 1024,
    }));
    const plan = planFilesBatches(files);
    assert.ok(plan.length >= 2);
    for (const batch of plan) {
        assert.equal(batch.kind, "zip");
        assert.ok(batch.totalUncompressed <= 8 * 1024 * 1024);
    }
});

// --- Task 3: progress EMA + ETA ---------------------------------------------

test("progress tracker reports increasing speed and finite ETA", () => {
    const t = createFilesProgressTracker();
    t.update(0, 1_000);
    t.update(2_000_000, 2_000); // ~2 MB/s over 1s
    const snap = t.snapshot({
        transferId: "t1",
        totalBytes: 10_000_000,
        batchIndex: 0,
        batchCount: 1,
    });
    assert.equal(snap.transferId, "t1");
    assert.equal(snap.bytesDone, 2_000_000);
    assert.ok(snap.speedBps > 0);
    assert.ok(snap.etaMs !== null && snap.etaMs! > 0);
});

test("progress tracker returns null ETA when speed is zero", () => {
    const t = createFilesProgressTracker();
    t.update(0, 1_000);
    const snap = t.snapshot({
        transferId: "t1",
        totalBytes: 100,
        batchIndex: 0,
        batchCount: 1,
    });
    assert.equal(snap.etaMs, null);
});

test("shouldEmitProgress throttles to maxHz", () => {
    // 4Hz => 250ms minimum gap between emits
    assert.equal(shouldEmitProgress(0, 100, 4), false); // 100ms < 250ms
    assert.equal(shouldEmitProgress(0, 250, 4), true);  // exactly 250ms
    assert.equal(shouldEmitProgress(0, 300, 4), true);   // 300ms > 250ms
});

// --- Task 4: build/parse offer, accept, chunk, progress ---------------------

test("build/parse files:offer round-trip", () => {
    const packet = buildFilesOfferPacket({
        transferId: "tr-1",
        sender: "L-192.168.0.110",
        destinations: ["L-192.168.0.196"],
        createdAt: 1_700_000_000_000,
        expiresAt: 1_700_000_900_000,
        summary: { fileCount: 1, totalBytes: 100 },
        batches: [{
            batchId: "b0",
            index: 0,
            count: 1,
            kind: "zip",
            asset: {
                hash: "abc",
                name: "batch-abc.zip",
                mimeType: "application/zip",
                size: 100,
                source: "file",
                url: "https://192.168.0.110:8434/files/blob/tr-1/b0",
            },
            files: [{ name: "a.txt", size: 100 }],
        }],
        byteTransportHint: "auto",
    });
    assert.equal(packet.what, "files:offer");
    assert.equal(packet.purpose, "storage");
    assert.equal(packet.sender, "L-192.168.0.110");
    assert.deepEqual(packet.nodes, ["L-192.168.0.196"]);
    const parsed = parseFilesOfferPayload(packet.payload);
    assert.ok(parsed);
    assert.equal(parsed!.transferId, "tr-1");
    assert.equal(parsed!.batches[0].asset.hash, "abc");
    assert.equal(parsed!.batches[0].asset.url, "https://192.168.0.110:8434/files/blob/tr-1/b0");
});

test("parseFilesOfferPayload rejects malformed offers", () => {
    assert.equal(parseFilesOfferPayload(undefined), undefined);
    assert.equal(parseFilesOfferPayload({}), undefined);
    assert.equal(parseFilesOfferPayload({ transferId: "t" }), undefined);
    assert.equal(
        parseFilesOfferPayload({
            transferId: "t",
            sender: "s",
            createdAt: 1,
            expiresAt: 2,
            summary: { fileCount: 1, totalBytes: 1 },
            batches: [{
                batchId: "b",
                index: 0,
                count: 1,
                kind: "zip",
                asset: { hash: "h", name: "n", mimeType: "x", size: 1, source: "file", bogus: 1 },
                files: [{ name: "a", size: 1 }],
            }],
        }),
        undefined,
    );
});

test("chooseByteTransport auto prefers http for small reachable batches", () => {
    assert.equal(chooseByteTransport("auto", CHUNK_MAX, true), "http");
    assert.equal(chooseByteTransport("auto", CHUNK_MAX + 1, true), "ws");
    assert.equal(chooseByteTransport("auto", 100, false), "ws");
    assert.equal(chooseByteTransport("ws", 100, true), "ws");
    assert.equal(chooseByteTransport("http", CHUNK_MAX + 1, true), "http");
});

test("parseFilesChunkPayload rejects oversized chunk", () => {
    assert.equal(
        parseFilesChunkPayload({
            transferId: "t",
            batchId: "b",
            chunkIndex: 0,
            chunkCount: 1,
            offset: 0,
            size: CHUNK_MAX + 1,
            encoding: "base64",
        }),
        undefined,
    );
});

test("build/parse files:chunk round-trip", () => {
    const packet = buildFilesChunkPacket({
        transferId: "t",
        batchId: "b",
        chunkIndex: 0,
        chunkCount: 1,
        offset: 0,
        size: 10,
        encoding: "base64",
        data: "aGVsbG8=",
        sender: "L-192.168.0.110",
        destinations: ["L-192.168.0.196"],
    });
    assert.equal(packet.what, "files:chunk");
    assert.equal(packet.purpose, "storage");
    const parsed = parseFilesChunkPayload(packet.payload);
    assert.ok(parsed);
    assert.equal(parsed!.size, 10);
    assert.equal(parsed!.data, "aGVsbG8=");
});

test("build/parse files:accept round-trip", () => {
    const packet = buildFilesAcceptPacket({
        payload: { transferId: "tr-1", byteTransport: "ws" },
        meta: { sender: "L-192.168.0.196", destinations: ["L-192.168.0.110"] },
    });
    assert.equal(packet.what, "files:accept");
    assert.equal(packet.purpose, "storage");
    const parsed = parseFilesAcceptPayload(packet.payload);
    assert.ok(parsed);
    assert.equal(parsed!.byteTransport, "ws");
});

test("buildFilesProgressPacket produces storage-purpose progress packet", () => {
    const packet = buildFilesProgressPacket(
        {
            transferId: "t",
            bytesDone: 100,
            totalBytes: 1000,
            batchIndex: 0,
            batchCount: 2,
            speedBps: 500,
            etaMs: 1800,
        },
        { sender: "L-192.168.0.110", destinations: ["L-192.168.0.196"] },
    );
    assert.equal(packet.what, "files:progress");
    assert.equal(packet.purpose, "storage");
    const parsed = parseFilesProgressPayload(packet.payload);
    assert.ok(parsed);
    assert.equal(parsed!.bytesDone, 100);
    assert.equal(parsed!.etaMs, 1800);
});

test("buildFilesOfferPacket generates uuid/timestamp when omitted", () => {
    const packet = buildFilesOfferPacket({
        transferId: "tr-2",
        sender: "L-192.168.0.110",
        createdAt: 1,
        expiresAt: 2,
        summary: { fileCount: 0, totalBytes: 0 },
        batches: [],
    });
    assert.ok(typeof packet.uuid === "string" && packet.uuid.length > 0);
    assert.ok(typeof packet.timestamp === "number");
});

// --- Task 5: normalize files:* -> purpose storage ---------------------------

test("normalizeCwspPacket maps files:* to purpose storage", () => {
    const packet = normalizeCwspPacket({
        op: "act",
        what: "files:offer",
        uuid: "00000000-0000-4000-8000-000000000001",
        timestamp: Date.now(),
        sender: "L-192.168.0.110",
        payload: { transferId: "tr" },
        flags: { canonicalV2: true },
    });
    assert.equal(packet.purpose, "storage");
});
