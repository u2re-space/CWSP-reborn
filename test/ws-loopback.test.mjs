/*
 * Filename: ws-loopback.test.mjs
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/test/ws-loopback.test.mjs
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream D — /ws loopback harness for ingress-normalize
 *   destination preservation + optional real WebSocket echo when `ws` resolves.
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const workspaceRoot = path.resolve(projectRoot, "../..");
const localIngress = path.resolve(projectRoot, "runtime/adapters/ingress-normalize.mjs");
const ingressMjs = existsSync(localIngress)
  ? localIngress
  : path.resolve(workspaceRoot, "runtime/cwsp/adapters/ingress-normalize.mjs");

async function loadIngress() {
  return import(pathToFileURL(ingressMjs).href);
}

/**
 * Resolve `ws` from endpoint / workspace node_modules.
 * @returns {{ WebSocket: Function, WebSocketServer: Function } | null}
 */
function tryLoadWs() {
  const candidates = [
    path.resolve(projectRoot, "runtime/endpoint/node_modules/ws"),
    path.resolve(workspaceRoot, "runtime/cwsp/endpoint/node_modules/ws"),
    path.resolve(workspaceRoot, "node_modules/ws"),
    path.resolve(projectRoot, "node_modules/ws"),
  ];
  const require = createRequire(import.meta.url);
  for (const candidate of candidates) {
    try {
      const mod = require(candidate);
      const WebSocket = mod.WebSocket || mod;
      const WebSocketServer = mod.WebSocketServer || mod.Server;
      if (typeof WebSocket === "function" && typeof WebSocketServer === "function") {
        return { WebSocket, WebSocketServer };
      }
    } catch {
      /* try next */
    }
  }
  try {
    const mod = require("ws");
    const WebSocket = mod.WebSocket || mod;
    const WebSocketServer = mod.WebSocketServer || mod.Server;
    if (typeof WebSocket === "function" && typeof WebSocketServer === "function") {
      return { WebSocket, WebSocketServer };
    }
  } catch {
    /* absent */
  }
  return null;
}

test("normalizeIngress preserves direct destinations", async () => {
  const { looksLikeCwspV2Packet, normalizeIngress } = await loadIngress();
  const raw = {
    op: "act",
    what: "clipboard:update",
    destinations: ["L-192.168.0.110"],
    payload: { text: "hello-direct" },
    flags: { canonicalV2: true },
  };
  assert.equal(looksLikeCwspV2Packet(raw), true);
  const { packet, frame } = await normalizeIngress(raw, "L-192.168.0.196");
  assert.deepEqual(packet.destinations, ["L-192.168.0.110"]);
  assert.equal(packet.sender, "L-192.168.0.196");
  assert.equal(frame.to, "L-192.168.0.110");
  assert.equal(frame.target, "L-192.168.0.110");
  assert.equal(frame.type, "clipboard:update");
  assert.equal(frame.from, "L-192.168.0.196");
});

test("normalizeIngress fills destinations from cwsp_route_target when empty", async () => {
  const { normalizeIngress } = await loadIngress();
  const raw = {
    op: "act",
    what: "mouse:move",
    cwsp_route_target: "L-192.168.0.110",
    payload: { x: 1, y: 2 },
  };
  const { packet, frame } = await normalizeIngress(raw, "L-192.168.0.196");
  assert.deepEqual(packet.destinations, ["L-192.168.0.110"]);
  assert.equal(frame.to, "L-192.168.0.110");
  assert.equal(frame.transport, "ws");
});

test("looksLikeCwspV2Packet rejects legacy-only frames", async () => {
  const { looksLikeCwspV2Packet } = await loadIngress();
  assert.equal(
    looksLikeCwspV2Packet({ type: "dispatch", action: "clipboard", to: "L-1" }),
    false,
  );
});

test("optional /ws loopback echo when ws package resolves", async (t) => {
  const wsApi = tryLoadWs();
  if (!wsApi) {
    t.skip("`ws` package not resolvable — normalize-only path covered above");
    return;
  }

  const { WebSocket, WebSocketServer } = wsApi;
  const { normalizeIngress } = await loadIngress();
  const httpServer = createServer((_req, res) => {
    res.writeHead(404);
    res.end();
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (socket) => {
    socket.on("message", async (data) => {
      try {
        const raw = JSON.parse(String(data));
        const { frame } = await normalizeIngress(raw, "loopback-peer");
        socket.send(JSON.stringify(frame));
      } catch (err) {
        socket.send(JSON.stringify({ error: String(err?.message || err) }));
      }
    });
  });

  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const { port } = httpServer.address();

  try {
    const client = new WebSocket(`ws://127.0.0.1:${port}/ws`);
    const reply = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("ws loopback timeout")), 5000);
      client.on("open", () => {
        client.send(
          JSON.stringify({
            op: "act",
            what: "clipboard:update",
            destinations: ["L-192.168.0.110"],
            payload: { text: "ws-loopback" },
          }),
        );
      });
      client.on("message", (data) => {
        clearTimeout(timer);
        resolve(JSON.parse(String(data)));
      });
      client.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    assert.equal(reply.to, "L-192.168.0.110");
    assert.equal(reply.type, "clipboard:update");
    assert.equal(reply.from, "loopback-peer");
    client.close();
  } finally {
    await new Promise((resolve) => wss.close(() => httpServer.close(resolve)));
  }
});
