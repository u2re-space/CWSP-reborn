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

test("files constants match design thresholds", () => {
    assert.equal(SMALL_FILE_MAX, 500 * 1024);
    assert.equal(ZIP_BATCH_MAX, 8 * 1024 * 1024);
    assert.equal(CHUNK_MAX, 16 * 1024 * 1024);
    assert.equal(FILES_WHAT_OFFER, "files:offer");
    assert.equal(FILES_PURPOSE, "storage");
});

// --- Task 2: packer policy (pure) -------------------------------------------

import { planFilesBatches } from "../src/v2/files-packer.ts";

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

import { createFilesProgressTracker, shouldEmitProgress } from "../src/v2/files-progress.ts";

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
