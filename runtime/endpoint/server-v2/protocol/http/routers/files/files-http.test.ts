/*
 * Filename: files-http.test.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/protocol/http/routers/files/files-http.test.ts
 * Change date and time: 14.43.00_21.07.2026
 * Reason for changes: Wave 2 Task 3 — TDD for the HTTP `/files/blob` router.
 * Exercises PUT/GET/HEAD/DELETE plus the 401/404/410 auth mapping by injecting
 * a per-test `createFilesBlobStore` rooted in a temp dir via
 * `runtimeContext.filesBlobStore` (no live runtimeContext required).
 */

import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import fastify from "fastify";

import { createFilesBlobStore } from "../../../../files/blob-store.ts";
import { registerFilesHttpRouter } from "./index.ts";

interface TestContext {
    rootDir: string;
    app: ReturnType<typeof fastify>;
}

async function setup(): Promise<TestContext> {
    const rootDir = await mkdtemp(join(tmpdir(), "cwsp-files-http-"));
    const app = fastify();
    const store = createFilesBlobStore({ rootDir, ttlMs: 60_000 });
    await registerFilesHttpRouter(app, { filesBlobStore: store });
    await app.ready();
    return { rootDir, app };
}

async function teardown(ctx: TestContext): Promise<void> {
    await ctx.app.close();
    await rm(ctx.rootDir, { recursive: true, force: true });
}

test("PUT then GET returns the same bytes as application/octet-stream", async () => {
    const ctx = await setup();
    try {
        const bytes = Buffer.from("hello-files-blob");
        const put = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: { "content-type": "application/octet-stream" },
            payload: bytes
        });
        assert.equal(put.statusCode, 200);
        const putBody = put.json();
        assert.equal(putBody.ok, true);
        assert.equal(putBody.size, bytes.length);
        assert.ok(typeof putBody.token === "string" && putBody.token.length > 0);

        const get = await ctx.app.inject({
            method: "GET",
            url: `/files/blob/tr1/b0?token=${encodeURIComponent(putBody.token)}`
        });
        assert.equal(get.statusCode, 200);
        assert.equal(get.headers["content-type"], "application/octet-stream");
        assert.deepEqual(get.rawPayload, bytes);
    } finally {
        await teardown(ctx);
    }
});

test("GET accepts the token via X-CWSP-Files-Token header", async () => {
    const ctx = await setup();
    try {
        const bytes = Buffer.from("header-token");
        const put = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/trH/bH",
            headers: { "content-type": "application/octet-stream" },
            payload: bytes
        });
        const token = put.json().token;

        const get = await ctx.app.inject({
            method: "GET",
            url: "/files/blob/trH/bH",
            headers: { "X-CWSP-Files-Token": token }
        });
        assert.equal(get.statusCode, 200);
        assert.deepEqual(get.rawPayload, bytes);
    } finally {
        await teardown(ctx);
    }
});

test("GET without a token is 401", async () => {
    const ctx = await setup();
    try {
        const get = await ctx.app.inject({
            method: "GET",
            url: "/files/blob/tr1/b0"
        });
        assert.equal(get.statusCode, 401);
    } finally {
        await teardown(ctx);
    }
});

test("GET with a bad token is 401", async () => {
    const ctx = await setup();
    try {
        const put = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: { "content-type": "application/octet-stream" },
            payload: Buffer.from("x")
        });
        assert.equal(put.statusCode, 200);

        const get = await ctx.app.inject({
            method: "GET",
            url: "/files/blob/tr1/b0?token=not-a-real-token"
        });
        assert.equal(get.statusCode, 401);
    } finally {
        await teardown(ctx);
    }
});

test("GET for a missing blob is 404", async () => {
    const ctx = await setup();
    try {
        // WHY: the HMAC token binds (transferId, batchId), so to exercise the
        // 404 path we need a *valid* token for a batch whose blob is gone.
        // PUT then DELETE leaves a valid token pointing at a missing blob.
        const put = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: { "content-type": "application/octet-stream" },
            payload: Buffer.from("x")
        });
        const token = put.json().token;
        await ctx.app.inject({
            method: "DELETE",
            url: `/files/blob/tr1/b0?token=${encodeURIComponent(token)}`
        });

        const get = await ctx.app.inject({
            method: "GET",
            url: `/files/blob/tr1/b0?token=${encodeURIComponent(token)}`
        });
        assert.equal(get.statusCode, 404);
    } finally {
        await teardown(ctx);
    }
});

test("GET for an expired blob is 410", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "cwsp-files-http-exp-"));
    const app = fastify();
    // ttlMs=1 so the default-minted token expires almost immediately; we also
    // pass an explicit past `expiresAt` via the store directly to make the
    // test deterministic without flaky timing.
    const store = createFilesBlobStore({ rootDir: rootDir, ttlMs: 60_000 });
    await registerFilesHttpRouter(app, { filesBlobStore: store });
    await app.ready();
    try {
        const expiredToken = await store.put({
            transferId: "trE",
            batchId: "bE",
            bytes: Buffer.from("expired"),
            expiresAt: Date.now() - 1
        });

        const get = await app.inject({
            method: "GET",
            url: `/files/blob/trE/bE?token=${encodeURIComponent(expiredToken.token)}`
        });
        assert.equal(get.statusCode, 410);
    } finally {
        await app.close();
        await rm(rootDir, { recursive: true, force: true });
    }
});

test("HEAD returns the same status as GET without a body", async () => {
    const ctx = await setup();
    try {
        const bytes = Buffer.from("head-probe");
        const put = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: { "content-type": "application/octet-stream" },
            payload: bytes
        });
        const token = put.json().token;

        const head = await ctx.app.inject({
            method: "HEAD",
            url: `/files/blob/tr1/b0?token=${encodeURIComponent(token)}`
        });
        assert.equal(head.statusCode, 200);
        assert.equal(head.rawPayload.length, 0);

        const headMissing = await ctx.app.inject({
            method: "HEAD",
            url: "/files/blob/tr1/b0"
        });
        assert.equal(headMissing.statusCode, 401);
    } finally {
        await teardown(ctx);
    }
});

test("DELETE removes the blob and subsequent GET is 404", async () => {
    const ctx = await setup();
    try {
        const put = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: { "content-type": "application/octet-stream" },
            payload: Buffer.from("delete-me")
        });
        const token = put.json().token;

        const del = await ctx.app.inject({
            method: "DELETE",
            url: `/files/blob/tr1/b0?token=${encodeURIComponent(token)}`
        });
        assert.equal(del.statusCode, 200);
        assert.equal(del.json().ok, true);

        const get = await ctx.app.inject({
            method: "GET",
            url: `/files/blob/tr1/b0?token=${encodeURIComponent(token)}`
        });
        assert.equal(get.statusCode, 404);
    } finally {
        await teardown(ctx);
    }
});

test("DELETE without a token is 401", async () => {
    const ctx = await setup();
    try {
        const del = await ctx.app.inject({
            method: "DELETE",
            url: "/files/blob/tr1/b0"
        });
        assert.equal(del.statusCode, 401);
    } finally {
        await teardown(ctx);
    }
});

test("PUT with an explicit token echoes it back instead of minting", async () => {
    const ctx = await setup();
    try {
        // Mint a token out-of-band via the store's helper by putting once,
        // then re-PUT the same batch with that token and expect it echoed.
        const first = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: { "content-type": "application/octet-stream" },
            payload: Buffer.from("first")
        });
        const token = first.json().token;

        const second = await ctx.app.inject({
            method: "PUT",
            url: "/files/blob/tr1/b0",
            headers: {
                "content-type": "application/octet-stream",
                "X-CWSP-Files-Token": token
            },
            payload: Buffer.from("second")
        });
        assert.equal(second.statusCode, 200);
        assert.equal(second.json().token, token);
        assert.equal(second.json().size, "second".length);
    } finally {
        await teardown(ctx);
    }
});
