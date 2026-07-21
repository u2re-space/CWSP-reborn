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
} from "../src/v2/files-constants.ts";

test("files constants match design thresholds", () => {
    assert.equal(SMALL_FILE_MAX, 500 * 1024);
    assert.equal(ZIP_BATCH_MAX, 8 * 1024 * 1024);
    assert.equal(CHUNK_MAX, 16 * 1024 * 1024);
    assert.equal(FILES_WHAT_OFFER, "files:offer");
});
