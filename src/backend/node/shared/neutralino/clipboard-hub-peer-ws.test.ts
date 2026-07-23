/*
 * Filename: clipboard-hub-peer-ws.test.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/clipboard-hub-peer-ws.test.ts
 * Change date and time: 17.05.00_23.07.2026
 * Reason for changes: LAN Peer WS Autonomy + Multi-Hub Failover — prove
 *   peer Control `/ws` fallback and candidate advance diagnostics.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { WebSocketServer } from "ws";
import { createClipboardHub } from "./clipboard-hub.ts";
import { getPathCapabilityCache } from "./path-capability-mesh.ts";

function createMockWs(readyOpen = true) {
    const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
    const sent: string[] = [];
    const sock = {
        readyState: readyOpen ? 1 : 0,
        sent,
        send(data: string) {
            sent.push(data);
        },
        close() {
            sock.readyState = 3;
        },
        on(event: string, listener: (...args: unknown[]) => void) {
            const arr = listeners.get(event) || [];
            arr.push(listener);
            listeners.set(event, arr);
            if (event === "open" && readyOpen) {
                queueMicrotask(() => listener());
            }
        },
        emit(event: string, ...args: unknown[]) {
            for (const fn of listeners.get(event) || []) fn(...args);
        },
    };
    return sock;
}

test("hub down + lan-direct up ⇒ sendWirePacket opens peer and delivers", async () => {
    const cache = getPathCapabilityCache();
    cache.clear();
    cache.set({
        toId: "L-210",
        class: "lan-direct",
        ok: true,
        rttMs: 5,
        origin: "http://192.168.0.210:8434",
        ts: Date.now(),
    });

    const dialed: string[] = [];
    const peerSock = createMockWs(true);

    const hub = createClipboardHub({
        localId: "L-110",
        getSettings: async () =>
            ({
                core: { ops: { clientToken: "test-token", accessToken: "test-token" } },
                shell: { clientToken: "test-token" },
            }) as never,
        adapters: {
            readText: async () => "",
            writeText: async () => {},
            ingest: async () => {},
        } as never,
        openWebSocket: async (url: string) => {
            dialed.push(url);
            // Never open hub — force peer fallback path.
            if (url.includes("192.168.0.200") || url.includes("45.147")) {
                const dead = createMockWs(false);
                queueMicrotask(() => dead.emit("error", new Error("hub-down")));
                return dead;
            }
            return peerSock;
        },
    });

    // Do not start() — hub socket stays closed; peer dial via sendWirePacket.
    const packet = {
        op: "act",
        what: "clipboard:update",
        purpose: "clipboard",
        destinations: ["L-210"],
        nodes: ["L-210"],
        payload: { text: "lan-autonomy" },
        flags: { canonicalV2: true },
    };

    // First call kicks async dial; may return false before peer opens.
    hub.sendWirePacket(packet);
    await new Promise((r) => setTimeout(r, 80));

    assert.ok(
        dialed.some((u) => u.includes("192.168.0.210") && u.includes("/ws")),
        "must dial Cap peer Control /ws",
    );

    const ok = hub.sendWirePacket(packet);
    assert.equal(ok, true, "second send must succeed via open peer");
    assert.ok(peerSock.sent.length >= 1, "peer socket must receive wire body");
    assert.ok(
        peerSock.sent.some((b) => b.includes("lan-autonomy")),
        "payload text must reach peer",
    );
    assert.ok(hub.status().peerConnectedCount >= 1);

    hub.stop();
    cache.clear();
});

test("hub failover advances to the next candidate and exposes sticky diagnostics", async () => {
    const server = await new Promise<WebSocketServer>((resolve) => {
        const next = new WebSocketServer({ port: 0 }, () => resolve(next));
    });
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const port = address.port;

    const priorHubUrl = process.env.CWSP_HUB_URL;
    const priorHubUrls = process.env.CWSP_HUB_URLS;
    process.env.CWSP_HUB_URL = "";
    process.env.CWSP_HUB_URLS = `ws://127.0.0.1:1/ws,ws://127.0.0.1:${port}/ws`;

    const hub = createClipboardHub({
        localId: "L-110",
        reconnectMs: 5,
        getSettings: async () => ({}) as never,
        adapters: {
            readText: async () => "",
            writeText: async () => {},
            ingest: async () => {},
        } as never,
    });

    try {
        hub.start();
        const deadline = Date.now() + 2_000;
        while (!hub.status().connected && Date.now() < deadline) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const status = hub.status() as unknown as Record<string, unknown>;
        assert.equal(status.connected, true, "the second hub must become active");
        assert.equal(status.hubCandidateIndex, 1, "the failed primary must advance to index 1");
        assert.equal(status.hubFailoverCount, 1, "the failed primary must increment failover count");
        assert.match(String(status.activeHubUrl || ""), new RegExp(`127\\.0\\.0\\.1:${port}`));
    } finally {
        hub.stop();
        if (priorHubUrl === undefined) delete process.env.CWSP_HUB_URL;
        else process.env.CWSP_HUB_URL = priorHubUrl;
        if (priorHubUrls === undefined) delete process.env.CWSP_HUB_URLS;
        else process.env.CWSP_HUB_URLS = priorHubUrls;
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});
