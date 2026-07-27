/*
 * Filename: w2-smoke.test.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/w2-smoke.test.ts
 * Change date and time: 14.55.00_21.07.2026
 * Reason for changes: Wave 2 Task 5 — cross-module smoke test that wires the W1
 *   shared byte-transport chooser together with the W2 route-probe candidate
 *   list. Asserts the two contracts that the live mount depends on:
 *     1. `chooseByteTransport("auto", ...)` prefers `http` only when the receiver
 *        is HTTP-reachable AND the batch fits in a single chunk; otherwise `ws`.
 *     2. `listBlobUrlCandidates` emits LAN-direct origins first, then gateway
 *        LAN, then gateway WAN — matching network.mdc transport preference.
 *   Pure: no network I/O, no disk, no env. Keeps W1/W2 boundaries aligned.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { chooseByteTransport } from "../../shared/v2/files.ts";
import { listBlobUrlCandidates } from "./route-probe.ts";
import { CHUNK_MAX } from "../../shared/v2/files-constants.ts";

test("auto prefers http when reachable and batch fits one chunk", () => {
    assert.equal(chooseByteTransport("auto", 1024, true), "http");
    assert.equal(chooseByteTransport("auto", CHUNK_MAX, true), "http");
});

test("auto falls back to ws when http is not reachable", () => {
    assert.equal(chooseByteTransport("auto", 1024, false), "ws");
});

test("auto falls back to ws when batch exceeds CHUNK_MAX (multi-chunk)", () => {
    assert.equal(chooseByteTransport("auto", CHUNK_MAX + 1, true), "ws");
});

test("explicit http/ws hints are honored regardless of reachability or size", () => {
    assert.equal(chooseByteTransport("http", CHUNK_MAX + 1, false), "http");
    assert.equal(chooseByteTransport("ws", 1024, true), "ws");
});

test("listBlobUrlCandidates orders LAN peer, gateway LAN, then gateway WAN", () => {
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

test("listBlobUrlCandidates emits multiple peer origins before gateway fallbacks", () => {
    const urls = listBlobUrlCandidates(
        ["https://192.168.0.110:8434", "https://192.168.0.111:8434/"],
        "https://192.168.0.200:8434/",
        "https://45.147.121.152:8434/",
        "files/blob/tr1/b0",
    );
    assert.equal(urls[0], "https://192.168.0.110:8434/files/blob/tr1/b0");
    assert.equal(urls[1], "https://192.168.0.111:8434/files/blob/tr1/b0");
    assert.equal(urls[2], "https://192.168.0.200:8434/files/blob/tr1/b0");
    assert.equal(urls[3], "https://45.147.121.152:8434/files/blob/tr1/b0");
});
