/*
 * Filename: https-upgrade.test.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/https-upgrade.test.ts
 * Change date and time: 14.32.00_17.07.2026
 * Reason for changes: Cover same-port plain-HTTP → HTTPS 308 and TLS handoff.
 */

import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { test } from "node:test";

import {
    TLS_HANDSHAKE_BYTE,
    buildHttpsRedirectLocation,
    createPlainHttpHttpsRedirectServer,
    createTlsHttpMux,
    listenNetServer
} from "./https-upgrade.ts";

test("buildHttpsRedirectLocation prefers Host and preserves path/query", () => {
    assert.equal(
        buildHttpsRedirectLocation(
            { headers: { host: "45.147.121.152:8434" }, url: "/admin?x=1" },
            "localhost:8434"
        ),
        "https://45.147.121.152:8434/admin?x=1"
    );
    assert.equal(
        buildHttpsRedirectLocation({ headers: {}, url: "/" }, "localhost:8434"),
        "https://localhost:8434/"
    );
});

test("plain HTTP through mux returns 308 Location https://", async () => {
    const httpsStub = net.createServer();
    const redirect = createPlainHttpHttpsRedirectServer("localhost:0");
    const mux = createTlsHttpMux(httpsStub, redirect);
    const port = await listenNetServer(mux, { host: "127.0.0.1", port: 0 });

    try {
        const res = await new Promise<http.IncomingMessage>((resolve, reject) => {
            const req = http.request(
                {
                    host: "127.0.0.1",
                    port,
                    path: "/network?next=1",
                    method: "GET",
                    headers: { Host: `127.0.0.1:${port}` }
                },
                resolve
            );
            req.on("error", reject);
            req.end();
        });
        assert.equal(res.statusCode, 308);
        assert.equal(res.headers.location, `https://127.0.0.1:${port}/network?next=1`);
    } finally {
        mux.close();
        redirect.close();
        httpsStub.close();
    }
});

test("TLS ClientHello first byte is handed to the HTTPS side", async () => {
    assert.equal(TLS_HANDSHAKE_BYTE, 0x16);

    let tlsHit = false;
    const httpsStub = net.createServer((socket) => {
        tlsHit = true;
        socket.end();
    });
    const redirect = createPlainHttpHttpsRedirectServer("localhost:0");
    const mux = createTlsHttpMux(httpsStub, redirect);
    const port = await listenNetServer(mux, { host: "127.0.0.1", port: 0 });

    try {
        await new Promise<void>((resolve, reject) => {
            const sock = net.connect({ host: "127.0.0.1", port }, () => {
                // Minimal TLS record header prefix (handshake type 0x16).
                sock.write(Buffer.from([TLS_HANDSHAKE_BYTE, 0x03, 0x01, 0x00, 0x01, 0x00]));
            });
            sock.on("close", () => resolve());
            sock.on("error", reject);
            setTimeout(() => {
                sock.destroy();
                resolve();
            }, 250);
        });
        assert.equal(tlsHit, true);
    } finally {
        mux.close();
        redirect.close();
        httpsStub.close();
    }
});
