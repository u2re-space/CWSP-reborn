import assert from "node:assert/strict";
import test from "node:test";

import {
    bluetoothAddressFor,
    deviceIdForBluetoothAddress,
    deviceIdForBluetoothName,
    displayDeviceLabel,
    mergeDeviceAliasMap,
    parseDeviceAliasOverlay,
    parseDeviceBluetoothOverlay,
    resolveDestinationEntries,
    resolveDeviceId,
    resolveDeviceIds,
} from "../src/v2/device-aliases.ts";

test("fleet names collapse onto short L- ids", () => {
    assert.equal(resolveDeviceId("desk"), "L-110");
    assert.equal(resolveDeviceId("ultrabook"), "L-110");
    assert.equal(resolveDeviceId("110"), "L-110");
    assert.equal(resolveDeviceId("L-192.168.0.110"), "L-110");
    assert.equal(resolveDeviceId("phone"), "L-196");
    assert.equal(resolveDeviceId("gateway"), "L-200");
    assert.equal(resolveDeviceId("*"), "*");
});

test("overlay aliases and bluetooth MACs merge onto fleet defaults", () => {
    const map = mergeDeviceAliasMap("pixel=L-210; desk=L-110", "L-210=AA:BB:CC:DD:EE:FF");
    assert.equal(resolveDeviceId("pixel", map), "L-210");
    assert.equal(bluetoothAddressFor("L-210", map), "AA:BB:CC:DD:EE:FF");
    assert.equal(deviceIdForBluetoothAddress("aa-bb-cc-dd-ee-ff", map), "L-210");
    assert.equal(displayDeviceLabel("desk", map), "Desk (L-110)");
});

test("parse overlays accept JSON and id=alias order", () => {
    assert.deepEqual(parseDeviceAliasOverlay('{"fold":"L-208"}'), { fold: "L-208" });
    assert.equal(parseDeviceAliasOverlay("L-110=ultrabook").ultrabook, "L-110");
    assert.equal(parseDeviceBluetoothOverlay("L-196=aa:bb:cc:dd:ee:01")["L-196"], "AA:BB:CC:DD:EE:01");
});

test("destination lists keep per-id tokens after alias resolve", () => {
    const entries = resolveDestinationEntries("desk::abc; L-192.168.0.210");
    assert.equal(entries[0]?.nodeId, "L-110");
    assert.equal(entries[0]?.accessToken, "abc");
    assert.equal(entries[1]?.nodeId, "L-210");
    assert.deepEqual(resolveDeviceIds(["desk", "L-110", "110"]), ["L-110"]);
});

test("bluetooth adapter name maps back to a fleet id", () => {
    assert.equal(deviceIdForBluetoothName("Pixel L-210"), "L-210");
    assert.equal(deviceIdForBluetoothName("ultrabook"), "L-110");
});
