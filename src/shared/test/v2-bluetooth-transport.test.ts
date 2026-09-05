import assert from "node:assert/strict";
import test from "node:test";

import {
    BLUETOOTH_MAX_BYTES,
    bluetoothKindForPacket,
    decodeBluetoothFrame,
    encodeBluetoothFrame,
    shouldUseBluetoothBypass,
} from "../src/v2/bluetooth-transport.ts";

test("bluetooth frame round-trips clipboard text", () => {
    const encoded = encodeBluetoothFrame(
        { kind: "clipboard-text", fromId: "L-196", toId: "L-110", size: 0 },
        "hello",
    );
    const decoded = decodeBluetoothFrame(encoded);
    assert.equal(decoded.header.kind, "clipboard-text");
    assert.equal(decoded.header.fromId, "L-196");
    assert.equal(decoded.header.toId, "L-110");
    assert.equal(new TextDecoder().decode(decoded.payload), "hello");
    assert.equal(decoded.header.size, 5);
});

test("bluetooth frame rejects payloads above 2 MiB", () => {
    assert.throws(
        () => encodeBluetoothFrame(
            { kind: "file", fromId: "L-110", size: 0 },
            new Uint8Array(BLUETOOTH_MAX_BYTES + 1),
        ),
        /exceeds/,
    );
});

test("packet kind inference", () => {
    assert.equal(
        bluetoothKindForPacket({ what: "clipboard:update", payload: { text: "x" } }),
        "clipboard-text",
    );
    assert.equal(
        bluetoothKindForPacket({
            what: "clipboard:update",
            payload: { asset: { mimeType: "image/png" } },
        }),
        "clipboard-image",
    );
    assert.equal(bluetoothKindForPacket({ what: "files:offer" }), "packet");
});

test("bluetooth is gateway-bypass unless preferred", () => {
    assert.equal(shouldUseBluetoothBypass({ hubOpen: true, peerOpen: false }), false);
    assert.equal(shouldUseBluetoothBypass({ hubOpen: false, peerOpen: false }), true);
    assert.equal(shouldUseBluetoothBypass({ hubOpen: true, preferBluetooth: true }), true);
    assert.equal(shouldUseBluetoothBypass({ enabled: false, hubOpen: false }), false);
    assert.equal(
        shouldUseBluetoothBypass({ hubOpen: false, payloadBytes: BLUETOOTH_MAX_BYTES + 1 }),
        false,
    );
});
