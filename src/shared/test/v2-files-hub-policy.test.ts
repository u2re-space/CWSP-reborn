/*
 * Files-hub policy contract tests.
 * WHY: lock the staging limits (count + bytes) and the hybrid offer decision
 * before any hub UI / orchestration lands in later waves. Pure policy, no I/O.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
    FILES_STAGE_MAX_COUNT,
    FILES_STAGE_MAX_BYTES,
} from "../src/v2/files-constants.ts";
import {
    assertStageLimits,
    decideOfferAfterStage,
} from "../src/v2/files-hub-policy.ts";

test("stage limits constants", () => {
    assert.equal(FILES_STAGE_MAX_COUNT, 64);
    assert.equal(FILES_STAGE_MAX_BYTES, 512 * 1024 * 1024);
});

test("assertStageLimits rejects over count", () => {
    const files = Array.from({ length: 65 }, () => ({ size: 1 }));
    const r = assertStageLimits(files);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "count");
});

test("assertStageLimits rejects over bytes", () => {
    const files = [{ size: FILES_STAGE_MAX_BYTES + 1 }];
    const r = assertStageLimits(files);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "bytes");
});

test("assertStageLimits accepts at bounds", () => {
    const files = Array.from({ length: FILES_STAGE_MAX_COUNT }, () => ({
        size: 1,
    }));
    assert.equal(assertStageLimits(files).ok, true);
});

test("open-with with destinations → readyToOffer", () => {
    const r = decideOfferAfterStage({
        source: "open-with",
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "manual",
    });
    assert.equal(r.phase, "readyToOffer");
    assert.deepEqual(r.destinations, ["L-192.168.0.110"]);
});

test("open-with without destinations → needDestinations", () => {
    const r = decideOfferAfterStage({
        source: "open-with",
        defaultDestinations: [],
        openForShare: "auto",
    });
    assert.equal(r.phase, "needDestinations");
});

test("share-target with destinations → readyToOffer (hybrid)", () => {
    const r = decideOfferAfterStage({
        source: "share-target",
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "manual",
    });
    assert.equal(r.phase, "readyToOffer");
    assert.deepEqual(r.destinations, ["L-192.168.0.110"]);
});

test("clipboard manual → needDestinations even with destinations", () => {
    const r = decideOfferAfterStage({
        source: "clipboard",
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "manual",
    });
    assert.equal(r.phase, "needDestinations");
});

test("clipboard auto with destinations → readyToOffer", () => {
    const r = decideOfferAfterStage({
        source: "clipboard",
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "auto",
    });
    assert.equal(r.phase, "readyToOffer");
    assert.deepEqual(r.destinations, ["L-192.168.0.110"]);
});

test("clipboard auto without destinations → needDestinations", () => {
    const r = decideOfferAfterStage({
        source: "clipboard",
        defaultDestinations: [],
        openForShare: "auto",
    });
    assert.equal(r.phase, "needDestinations");
});

test("picker auto with destinations → readyToOffer", () => {
    const r = decideOfferAfterStage({
        source: "picker",
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "auto",
    });
    assert.equal(r.phase, "readyToOffer");
});

test("picker manual → needDestinations", () => {
    const r = decideOfferAfterStage({
        source: "picker",
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "manual",
    });
    assert.equal(r.phase, "needDestinations");
});
