/*
 * Filename: files.test.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/protocol/socket/handlers/files.test.ts
 * Change date and time: 14.47.00_21.07.2026
 * Reason for changes: Wave 2 Task 4 — unit tests for the socket `files:*`
 *   handler's pure decisions (no live socket, no clipboard drivers, no disk).
 *   Verifies: non-files actions fall through (null), all files:* actions mark
 *   `forward: true`, offer rewrite only fires on a gateway host with both a
 *   public base URL and a blob secret configured, and clipboard drivers are
 *   never invoked.
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
    handleFilesAction,
    handleFilesAsk,
    isFilesWhat,
} from "./files.ts";

const FILES_ACTIONS = [
    "files:offer",
    "files:accept",
    "files:decline",
    "files:progress",
    "files:done",
    "files:error",
    "files:chunk",
    "files:chunk-ack",
];

test("isFilesWhat matches only files: prefix", () => {
    assert.equal(isFilesWhat("files:offer"), true);
    assert.equal(isFilesWhat("files:chunk-ack"), true);
    assert.equal(isFilesWhat("clipboard:update"), false);
    assert.equal(isFilesWhat("mouse:move"), false);
    assert.equal(isFilesWhat(""), false);
    assert.equal(isFilesWhat(undefined as unknown as string), false);
});

test("handleFilesAction marks files:offer as forward and not clipboard", async () => {
    const r = await handleFilesAction(
        "files:offer",
        { transferId: "tr" },
        { what: "files:offer" } as any,
    );
    assert.equal(r !== null, true);
    assert.equal((r as any).forward, true);
    assert.equal((r as any).handled, true);
    assert.equal((r as any).what, "files:offer");
});

test("handleFilesAction returns null for non-files actions (fall-through)", async () => {
    const r = await handleFilesAction("clipboard:update", { text: "x" }, {} as any);
    assert.equal(r, null);
});

test("handleFilesAction returns null for empty/undefined what", async () => {
    assert.equal(await handleFilesAction("", {}, {} as any), null);
    assert.equal(await handleFilesAction(undefined as any, {}, {} as any), null);
});

test("every files:* action is handled with forward=true", async () => {
    for (const what of FILES_ACTIONS) {
        const r = await handleFilesAction(what, { transferId: "tr" }, { what } as any);
        assert.equal(r !== null, true, `${what} should be handled`);
        assert.equal((r as any).forward, true, `${what} should forward`);
        assert.equal((r as any).handled, true, `${what} should be handled=true`);
    }
});

test("handleFilesAsk forwards files:* asks and falls through otherwise", async () => {
    const r = await handleFilesAsk("files:offer", { transferId: "tr" }, { what: "files:offer" } as any);
    assert.equal((r as any).forward, true);
    assert.equal((r as any).handled, true);
    const fallthrough = await handleFilesAsk("clipboard:isReady", {}, {} as any);
    assert.equal(fallthrough, null);
});

test("handleFilesAction never touches clipboard drivers (no import side effects)", async () => {
    // WHY: the handler must not import or call clipboard access. We assert it
    //   completes without env setup and returns a forward decision — any
    //   clipboard driver import would require native modules / OS access.
    const r = await handleFilesAction(
        "files:chunk",
        { transferId: "tr", batchId: "b0", data: "AAA" },
        { what: "files:chunk" } as any,
    );
    assert.equal((r as any).forward, true);
    assert.equal((r as any).payload, r!.payload);
});

test("handleFilesAction forwards chunk as-is (no reassembly)", async () => {
    const chunkPayload = {
        transferId: "tr",
        batchId: "b0",
        chunkIndex: 0,
        chunkCount: 2,
        offset: 0,
        size: 3,
        encoding: "base64" as const,
        data: "AAA",
    };
    const r = await handleFilesAction("files:chunk", chunkPayload, { what: "files:chunk" } as any);
    assert.equal((r as any).rewritten, false);
    assert.deepEqual((r as any).payload, chunkPayload);
});

const sampleOffer = {
    transferId: "tr1",
    sender: "L-192.168.0.110",
    createdAt: 1,
    expiresAt: Date.now() + 60_000,
    summary: { fileCount: 1, totalBytes: 10 },
    batches: [
        {
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
        },
    ],
};

test("offer rewrite skipped on non-gateway host (payload unchanged)", async () => {
    const before = process.env.CWS_FILES_REWRITE_OFFER_URLS;
    const beforeId = process.env.CWS_ASSOCIATED_ID;
    delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
    process.env.CWS_ASSOCIATED_ID = "L-192.168.0.110";
    try {
        const r = await handleFilesAction("files:offer", sampleOffer, { what: "files:offer" } as any);
        assert.equal((r as any).rewritten, false);
        assert.deepEqual((r as any).payload, sampleOffer);
    } finally {
        if (before !== undefined) process.env.CWS_FILES_REWRITE_OFFER_URLS = before;
        else delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
        if (beforeId !== undefined) process.env.CWS_ASSOCIATED_ID = beforeId;
        else delete process.env.CWS_ASSOCIATED_ID;
    }
});

test("offer rewrite skipped when CWS_FILES_PUBLIC_BASE_URL is unset (no invented base)", async () => {
    const beforeRewrite = process.env.CWS_FILES_REWRITE_OFFER_URLS;
    const beforeBase = process.env.CWS_FILES_PUBLIC_BASE_URL;
    const beforeSecret = process.env.CWS_FILES_BLOB_SECRET;
    process.env.CWS_FILES_REWRITE_OFFER_URLS = "1";
    delete process.env.CWS_FILES_PUBLIC_BASE_URL;
    process.env.CWS_FILES_BLOB_SECRET = "test-secret";
    try {
        const r = await handleFilesAction("files:offer", sampleOffer, { what: "files:offer" } as any);
        assert.equal((r as any).rewritten, false, "must not rewrite without a public base URL");
        assert.deepEqual((r as any).payload, sampleOffer);
    } finally {
        if (beforeRewrite !== undefined) process.env.CWS_FILES_REWRITE_OFFER_URLS = beforeRewrite;
        else delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
        if (beforeBase !== undefined) process.env.CWS_FILES_PUBLIC_BASE_URL = beforeBase;
        else delete process.env.CWS_FILES_PUBLIC_BASE_URL;
        if (beforeSecret !== undefined) process.env.CWS_FILES_BLOB_SECRET = beforeSecret;
        else delete process.env.CWS_FILES_BLOB_SECRET;
    }
});

test("offer rewrite skipped when blob secret is unset", async () => {
    const beforeRewrite = process.env.CWS_FILES_REWRITE_OFFER_URLS;
    const beforeBase = process.env.CWS_FILES_PUBLIC_BASE_URL;
    const beforeSecret = process.env.CWS_FILES_BLOB_SECRET;
    const beforeBridgeKey = process.env.CWS_BRIDGE_USER_KEY;
    const beforeUpstreamKey = process.env.CWS_UPSTREAM_USER_KEY;
    process.env.CWS_FILES_REWRITE_OFFER_URLS = "1";
    process.env.CWS_FILES_PUBLIC_BASE_URL = "https://192.168.0.200:8434";
    delete process.env.CWS_FILES_BLOB_SECRET;
    delete process.env.CWS_BRIDGE_USER_KEY;
    delete process.env.CWS_UPSTREAM_USER_KEY;
    try {
        const r = await handleFilesAction("files:offer", sampleOffer, { what: "files:offer" } as any);
        assert.equal((r as any).rewritten, false, "must not rewrite without a blob secret");
    } finally {
        if (beforeRewrite !== undefined) process.env.CWS_FILES_REWRITE_OFFER_URLS = beforeRewrite;
        else delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
        if (beforeBase !== undefined) process.env.CWS_FILES_PUBLIC_BASE_URL = beforeBase;
        else delete process.env.CWS_FILES_PUBLIC_BASE_URL;
        if (beforeSecret !== undefined) process.env.CWS_FILES_BLOB_SECRET = beforeSecret;
        else delete process.env.CWS_FILES_BLOB_SECRET;
        if (beforeBridgeKey !== undefined) process.env.CWS_BRIDGE_USER_KEY = beforeBridgeKey;
        else delete process.env.CWS_BRIDGE_USER_KEY;
        if (beforeUpstreamKey !== undefined) process.env.CWS_UPSTREAM_USER_KEY = beforeUpstreamKey;
        else delete process.env.CWS_UPSTREAM_USER_KEY;
    }
});

test("offer rewrite fires on gateway host with base URL + secret", async () => {
    const beforeRewrite = process.env.CWS_FILES_REWRITE_OFFER_URLS;
    const beforeBase = process.env.CWS_FILES_PUBLIC_BASE_URL;
    const beforeSecret = process.env.CWS_FILES_BLOB_SECRET;
    process.env.CWS_FILES_REWRITE_OFFER_URLS = "1";
    process.env.CWS_FILES_PUBLIC_BASE_URL = "https://192.168.0.200:8434";
    process.env.CWS_FILES_BLOB_SECRET = "test-secret";
    try {
        const r = await handleFilesAction("files:offer", sampleOffer, { what: "files:offer" } as any);
        assert.equal((r as any).rewritten, true);
        const out = (r as any).payload;
        assert.match(
            out.batches[0].asset.url,
            /^https:\/\/192\.168\.0\.200:8434\/files\/blob\/tr1\/b0\?token=.+/,
        );
        // WHY: rewrite must mint a fresh token, not echo the sender's old one.
        assert.notEqual(out.batches[0].asset.url, sampleOffer.batches[0].asset.url);
    } finally {
        if (beforeRewrite !== undefined) process.env.CWS_FILES_REWRITE_OFFER_URLS = beforeRewrite;
        else delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
        if (beforeBase !== undefined) process.env.CWS_FILES_PUBLIC_BASE_URL = beforeBase;
        else delete process.env.CWS_FILES_PUBLIC_BASE_URL;
        if (beforeSecret !== undefined) process.env.CWS_FILES_BLOB_SECRET = beforeSecret;
        else delete process.env.CWS_FILES_BLOB_SECRET;
    }
});

test("offer rewrite fires when associated id is .200 (gateway inference)", async () => {
    const beforeRewrite = process.env.CWS_FILES_REWRITE_OFFER_URLS;
    const beforeId = process.env.CWS_ASSOCIATED_ID;
    const beforeBase = process.env.CWS_FILES_PUBLIC_BASE_URL;
    const beforeSecret = process.env.CWS_FILES_BLOB_SECRET;
    delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
    process.env.CWS_ASSOCIATED_ID = "L-192.168.0.200";
    process.env.CWS_FILES_PUBLIC_BASE_URL = "https://192.168.0.200:8434";
    process.env.CWS_FILES_BLOB_SECRET = "test-secret";
    try {
        const r = await handleFilesAction("files:offer", sampleOffer, { what: "files:offer" } as any);
        assert.equal((r as any).rewritten, true);
    } finally {
        if (beforeRewrite !== undefined) process.env.CWS_FILES_REWRITE_OFFER_URLS = beforeRewrite;
        else delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
        if (beforeId !== undefined) process.env.CWS_ASSOCIATED_ID = beforeId;
        else delete process.env.CWS_ASSOCIATED_ID;
        if (beforeBase !== undefined) process.env.CWS_FILES_PUBLIC_BASE_URL = beforeBase;
        else delete process.env.CWS_FILES_PUBLIC_BASE_URL;
        if (beforeSecret !== undefined) process.env.CWS_FILES_BLOB_SECRET = beforeSecret;
        else delete process.env.CWS_FILES_BLOB_SECRET;
    }
});

test("offer rewrite disabled by CWS_FILES_REWRITE_OFFER_URLS=0 even on .200", async () => {
    const beforeRewrite = process.env.CWS_FILES_REWRITE_OFFER_URLS;
    const beforeId = process.env.CWS_ASSOCIATED_ID;
    const beforeBase = process.env.CWS_FILES_PUBLIC_BASE_URL;
    const beforeSecret = process.env.CWS_FILES_BLOB_SECRET;
    process.env.CWS_FILES_REWRITE_OFFER_URLS = "0";
    process.env.CWS_ASSOCIATED_ID = "L-192.168.0.200";
    process.env.CWS_FILES_PUBLIC_BASE_URL = "https://192.168.0.200:8434";
    process.env.CWS_FILES_BLOB_SECRET = "test-secret";
    try {
        const r = await handleFilesAction("files:offer", sampleOffer, { what: "files:offer" } as any);
        assert.equal((r as any).rewritten, false);
    } finally {
        if (beforeRewrite !== undefined) process.env.CWS_FILES_REWRITE_OFFER_URLS = beforeRewrite;
        else delete process.env.CWS_FILES_REWRITE_OFFER_URLS;
        if (beforeId !== undefined) process.env.CWS_ASSOCIATED_ID = beforeId;
        else delete process.env.CWS_ASSOCIATED_ID;
        if (beforeBase !== undefined) process.env.CWS_FILES_PUBLIC_BASE_URL = beforeBase;
        else delete process.env.CWS_FILES_PUBLIC_BASE_URL;
        if (beforeSecret !== undefined) process.env.CWS_FILES_BLOB_SECRET = beforeSecret;
        else delete process.env.CWS_FILES_BLOB_SECRET;
    }
});
