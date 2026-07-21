/*
 * Filename: rewrite-offer.test.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/rewrite-offer.test.ts
 * Change date and time: 14.40.00_21.07.2026
 * Reason for changes: Wave 2 Task 2 — TDD for the offer URL rewrite and route
 * candidate helpers. Tests are copied verbatim from the task brief so the
 * implementation is verified against the exact contract.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { rewriteOfferBlobUrls } from "./rewrite-offer.ts";
import { listBlobUrlCandidates } from "./route-probe.ts";

test("rewriteOfferBlobUrls rewrites each batch asset.url onto publicBaseUrl", () => {
  const offer = {
    transferId: "tr1",
    sender: "L-192.168.0.110",
    createdAt: 1,
    expiresAt: 2,
    summary: { fileCount: 1, totalBytes: 10 },
    batches: [{
      batchId: "b0",
      index: 0,
      count: 1,
      kind: "zip" as const,
      asset: {
        hash: "abc",
        name: "batch-abc.zip",
        mimeType: "application/zip",
        size: 10,
        source: "file",
        url: "https://192.168.0.110:8434/files/blob/tr1/b0?token=old",
      },
      files: [{ name: "a.txt", size: 10 }],
    }],
  };
  const out = rewriteOfferBlobUrls(offer, {
    publicBaseUrl: "https://192.168.0.200:8434",
    tokenFor: () => "tok",
  });
  assert.match(out.batches[0].asset.url!, /^https:\/\/192\.168\.0\.200:8434\/files\/blob\/tr1\/b0\?token=tok/);
});

test("listBlobUrlCandidates orders LAN peer then gateway LAN then WAN", () => {
  const urls = listBlobUrlCandidates(
    ["https://192.168.0.110:8434"],
    "https://192.168.0.200:8434",
    "https://45.147.121.152:8434",
    "/files/blob/tr1/b0",
  );
  assert.equal(urls[0], "https://192.168.0.110:8434/files/blob/tr1/b0");
  assert.equal(urls[1], "https://192.168.0.200:8434/files/blob/tr1/b0");
  assert.equal(urls[2], "https://45.147.121.152:8434/files/blob/tr1/b0");
});
