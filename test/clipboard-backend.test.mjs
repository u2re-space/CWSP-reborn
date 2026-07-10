/*
 * Filename: clipboard-backend.test.mjs
 * FullPath: apps/CWSP-reborn/test/clipboard-backend.test.mjs
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream B — Node clipboard emission/executor memory + asset tests.
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadExecutor() {
    const url = pathToFileURL(
        path.join(projectRoot, "src/backend/node/shared/executor/Clipboardy.ts")
    ).href;
    return import(url);
}

async function loadEmission() {
    const url = pathToFileURL(
        path.join(projectRoot, "src/backend/node/shared/emission/Clipboardy.ts")
    ).href;
    return import(url);
}

test("memory-only write/read text round-trips", async () => {
    const { createClipboardExecutor } = await loadExecutor();
    const clipboard = createClipboardExecutor({ memoryOnly: true });

    assert.equal(await clipboard.isReady(), true);
    await clipboard.writeText("hello-cwsp");
    assert.equal(await clipboard.readText(), "hello-cwsp");
    assert.equal(clipboard.getMemorySnapshot().text, "hello-cwsp");
    assert.equal(clipboard.getMemorySnapshot().memoryOnly, true);
});

test("applyPacket with payload.text updates memory store", async () => {
    const { createClipboardExecutor } = await loadExecutor();
    const { createClipboardEmission } = await loadEmission();

    const clipboard = createClipboardExecutor({ memoryOnly: true, echoSuppressMs: 0 });
    const emission = createClipboardEmission({ sender: "L-test" });
    const packet = emission.buildUpdate({ text: "from-packet" });

    assert.equal(packet.what, "clipboard:update");
    assert.equal(packet.op, "act");
    assert.equal(packet.protocol, "ws");
    assert.equal(packet.transport, "ws");

    const result = await clipboard.applyPacket(packet);
    assert.equal(result.applied, true);
    assert.equal(result.suppressed, false);
    assert.equal(await clipboard.readText(), "from-packet");
});

test("echo suppression ignores identical text within window", async () => {
    const { createClipboardExecutor } = await loadExecutor();
    const clipboard = createClipboardExecutor({
        memoryOnly: true,
        echoSuppressMs: 400
    });

    await clipboard.writeText("echo-me");
    const suppressed = await clipboard.applyPacket({
        payload: { text: "echo-me" }
    });
    assert.equal(suppressed.suppressed, true);
    assert.equal(suppressed.applied, false);

    // Different text still applies inside the window.
    const other = await clipboard.applyPacket({
        payload: { text: "other-text" }
    });
    assert.equal(other.applied, true);
    assert.equal(await clipboard.readText(), "other-text");
});

test("asset envelope accepted and persisted to temp dir", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "cwsp-clip-asset-"));
    try {
        const { createClipboardExecutor } = await loadExecutor();
        const { createClipboardEmission } = await loadEmission();

        const clipboard = createClipboardExecutor({
            memoryOnly: true,
            assetDir: dir,
            echoSuppressMs: 0
        });
        const emission = createClipboardEmission();

        // Minimal PNG-ish payload as bare base64 ("hi").
        const asset = {
            hash: "abc123deadbeef",
            name: "clip-abc123deadbeef.png",
            mimeType: "image/png",
            size: 2,
            source: "base64",
            data: Buffer.from("hi").toString("base64")
        };

        const packet = emission.buildUpdate({ asset });
        const result = await clipboard.applyPacket(packet);

        assert.equal(result.applied, true);
        assert.ok(result.assetPath);
        assert.equal(path.basename(result.assetPath), "abc123deadbeef.png");

        const onDisk = await readFile(result.assetPath);
        assert.equal(onDisk.toString("utf8"), "hi");

        const snap = clipboard.getMemorySnapshot();
        assert.equal(snap.asset?.hash, "abc123deadbeef");
        assert.equal(snap.lastAssetPath, result.assetPath);
        // Asset-only: OS/memory text untouched.
        assert.equal(snap.text, "");
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
});

test("asset envelope accepted in memory without assetDir", async () => {
    const { createClipboardExecutor } = await loadExecutor();
    const clipboard = createClipboardExecutor({ memoryOnly: true });

    const result = await clipboard.applyPacket({
        payload: {
            text: "with-asset",
            asset: {
                hash: "memhash",
                name: "memhash.bin",
                mimeType: "application/octet-stream",
                size: 3,
                source: "base64",
                data: Buffer.from("xyz").toString("base64")
            }
        }
    });

    assert.equal(result.applied, true);
    assert.equal(result.assetPath ?? null, null);
    assert.equal(await clipboard.readText(), "with-asset");
    assert.equal(clipboard.getMemorySnapshot().asset?.hash, "memhash");
});
