/*
 * Filename: files-probe.test.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/protocol/http/routers/files/files-probe.test.ts
 * Change date and time: 15.00.00_21.07.2026
 * Reason for changes: Wave 2 Task 5 — verify the live-mount `/files/probe` surface
 *   (OPTIONS + GET + HEAD) returns 204 with CORS + private-network headers
 *   mirroring `/lna-probe`. Mounted through `registerCoreApp` so the test
 *   exercises the same wiring the `:8434` boot uses, not a hand-rolled app.
 */

import assert from "node:assert/strict";
import test from "node:test";

import fastify from "fastify";

import { registerCoreApp } from "../../../../../server/routing/core-app.ts";

async function withApp<T>(fn: (app: ReturnType<typeof fastify>) => Promise<T>): Promise<T> {
    const app = fastify();
    await registerCoreApp(app);
    await app.ready();
    try {
        return await fn(app);
    } finally {
        await app.close();
    }
}

test("OPTIONS /files/probe returns 204 with CORS + private-network headers", async () => {
    await withApp(async (app) => {
        // WHY: real browser preflights carry `access-control-request-method`; the
        // global @fastify/cors preflight hook intercepts OPTIONS and returns 204
        // with reflected origin + PNA — same path `/lna-probe` takes.
        const res = await app.inject({
            method: "OPTIONS",
            url: "/files/probe",
            headers: {
                origin: "https://192.168.0.196",
                "access-control-request-method": "GET",
                "access-control-request-private-network": "true",
            },
        });
        assert.equal(res.statusCode, 204);
        assert.equal(res.headers["access-control-allow-origin"], "https://192.168.0.196");
        assert.equal(res.headers["access-control-allow-private-network"], "true");
        assert.match(
            String(res.headers["access-control-allow-methods"] || ""),
            /GET/,
        );
    });
});

test("GET /files/probe returns 204 with CORS origin echo", async () => {
    await withApp(async (app) => {
        const res = await app.inject({
            method: "GET",
            url: "/files/probe",
            headers: { origin: "https://192.168.0.196" },
        });
        assert.equal(res.statusCode, 204);
        assert.equal(res.headers["access-control-allow-origin"], "https://192.168.0.196");
        assert.equal(res.headers["cache-control"], "no-store");
    });
});

test("HEAD /files/probe returns 204 with no body", async () => {
    await withApp(async (app) => {
        const res = await app.inject({
            method: "HEAD",
            url: "/files/probe",
            headers: { origin: "https://192.168.0.196" },
        });
        assert.equal(res.statusCode, 204);
        assert.equal(res.rawPayload.length, 0);
    });
});

test("GET /files/probe without origin still returns 204 (no PNA header)", async () => {
    await withApp(async (app) => {
        const res = await app.inject({ method: "GET", url: "/files/probe" });
        assert.equal(res.statusCode, 204);
        // WHY: no private-network request header means no PNA allow header back.
        assert.equal(res.headers["access-control-allow-private-network"], undefined);
    });
});
