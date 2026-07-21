/*
 * Filename: blob-store.test.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/blob-store.test.ts
 * Change date and time: 14.35.00_21.07.2026
 * Reason for changes: Wave 2 Task 1 — TDD for the TTL files blob store with
 * HMAC token gating. Tests are copied verbatim from the task brief so the
 * implementation is verified against the exact contract.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createFilesBlobStore,
  mintFilesBlobToken,
  verifyFilesBlobToken,
} from "./blob-store.ts";

test("mint/verify token round-trip", () => {
  const token = mintFilesBlobToken("tr1", "b0", "secret", Date.now() + 60_000);
  assert.equal(verifyFilesBlobToken(token, "tr1", "b0", "secret"), true);
  assert.equal(verifyFilesBlobToken(token, "tr1", "b1", "secret"), false);
});

test("put/get/delete blob with token gate", async () => {
  const root = await mkdtemp(join(tmpdir(), "cwsp-files-"));
  try {
    const store = createFilesBlobStore({ rootDir: root, ttlMs: 60_000 });
    const bytes = Buffer.from("hello-files");
    const { token } = await store.put({ transferId: "tr1", batchId: "b0", bytes });
    const got = await store.get({ transferId: "tr1", batchId: "b0", token });
    assert.ok(got);
    assert.equal(got!.toString("utf8"), "hello-files");
    assert.equal(await store.get({ transferId: "tr1", batchId: "b0", token: "bad" }), null);
    await store.delete("tr1");
    assert.equal(await store.get({ transferId: "tr1", batchId: "b0", token }), null);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("expired blob returns null", async () => {
  const root = await mkdtemp(join(tmpdir(), "cwsp-files-"));
  try {
    const store = createFilesBlobStore({ rootDir: root, ttlMs: 1 });
    const { token } = await store.put({
      transferId: "tr1",
      batchId: "b0",
      bytes: Buffer.from("x"),
      expiresAt: Date.now() - 1,
    });
    assert.equal(await store.get({ transferId: "tr1", batchId: "b0", token }), null);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
