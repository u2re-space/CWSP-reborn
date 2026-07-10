/*
 * Filename: protocol-facade.test.ts
 * FullPath: apps/CWSP-reborn/test/protocol-facade.test.ts
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Prove the web/node protocol facades route through cwsp-shared v2
 * for normalize + clipboard extract + packet create without duplicating logic.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { buildWebPacket } from "../src/protocol/web/packet/Packet.ts";
import {
    buildWebClipboardPacket,
    extractClipboardContent,
    extractClipboardText,
} from "../src/protocol/web/packet/Clipboard.ts";
import { normalizeCwspPacket } from "../src/protocol/web/network/Protocol.ts";
import { classifyCwspPacket } from "../src/protocol/web/state/Policy.ts";
import { buildNodePacket } from "../src/protocol/node/packet/Packet.ts";
import { extractClipboardText as extractClipboardTextNode } from "../src/protocol/node/packet/Clipboard.ts";
import { normalizeCwspPacket as normalizeCwspPacketNode } from "../src/protocol/node/network/Protocol.ts";

const NOW = 1_700_000_000_000;
const SENDER = "L-192.168.0.196";

test("web facade: buildWebPacket normalizes a legacy verb and stamps ws transport", () => {
    const packet = buildWebPacket({
        op: "request",
        what: "clipboard",
        uuid: "11111111-1111-4111-8111-111111111111",
        timestamp: NOW,
        sender: SENDER,
        destinations: ["L-192.168.0.110"],
        payload: { text: "hello-web" },
    });

    assert.equal(packet.op, "ask");
    assert.equal(packet.what, "clipboard:update");
    assert.equal(packet.purpose, "clipboard");
    assert.equal(packet.protocol, "ws");
    assert.equal(packet.transport, "ws");
    assert.equal(packet.flags.canonicalV2, true);
    assert.deepEqual(packet.destinations, ["L-192.168.0.110"]);
});

test("web facade: extractClipboardText reads payload.text through the shared extractor", () => {
    const text = extractClipboardText({ payload: { text: "hello-clip" } });
    assert.equal(text, "hello-clip");

    const content = extractClipboardContent({ data: { content: "alt" } });
    assert.equal(content?.text, "alt");
    assert.equal(content?.dedupeKey, "text:alt");
});

test("web facade: buildWebClipboardPacket produces a canonical clipboard:update act", () => {
    const packet = buildWebClipboardPacket({
        uuid: "22222222-2222-4222-8222-222222222222",
        timestamp: NOW,
        sender: SENDER,
        destinations: ["L-192.168.0.110"],
        payload: { text: "clip-act" },
    });

    assert.equal(packet.op, "act");
    assert.equal(packet.what, "clipboard:update");
    assert.equal(packet.purpose, "clipboard");
    assert.equal(packet.protocol, "ws");
});

test("web facade: network/Protocol re-exports normalizeCwspPacket (alias collapse)", () => {
    const packet = normalizeCwspPacket({
        op: "signal",
        type: "dispatch",
        uuid: "33333333-3333-4333-8333-333333333333",
        timestamp: NOW,
        sender: SENDER,
    });

    assert.equal(packet.op, "act");
    assert.equal(packet.what, "network:dispatch");
    assert.equal(packet.purpose, "general");
});

test("web facade: state/Policy classifyCwspPacket marks clipboard packets", () => {
    const packet = buildWebClipboardPacket({
        uuid: "44444444-4444-4444-8444-444444444444",
        timestamp: NOW,
        sender: SENDER,
        payload: { text: "x" },
    });
    assert.equal(classifyCwspPacket(packet), "clipboard");
});

test("node facade: buildNodePacket + extract + normalize share the same v2 core", () => {
    const packet = buildNodePacket({
        op: "notify",
        what: "sms",
        uuid: "55555555-5555-4555-8555-555555555555",
        timestamp: NOW,
        sender: "L-192.168.0.110",
        destinations: ["L-192.168.0.196"],
        payload: { text: "node-clip" },
    });

    assert.equal(packet.op, "act");
    assert.equal(packet.what, "sms:send");
    assert.equal(packet.protocol, "ws");
    assert.equal(extractClipboardTextNode(packet), "node-clip");

    const normalized = normalizeCwspPacketNode({
        op: "ack",
        what: "clipboard:update",
        uuid: "66666666-6666-4666-8666-666666666666",
        timestamp: NOW,
        sender: "L-192.168.0.110",
    });
    assert.equal(normalized.op, "result");
});
