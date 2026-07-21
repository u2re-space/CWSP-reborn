/*
 * Filename: files-hub.test.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-hub.test.ts
 * Change date and time: 15.22.00_21.07.2026
 * Reason for changes: Wave 3 Task 2 — TDD for the Neutralino files-hub local
 *   stage + pack plan. Covers ingress staging, needDestinations phase,
 *   confirmOffer transition, cancel GC, stage-limit rejection, and batchPlan
 *   wiring from the W1 packer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFilesHub } from "./files-hub.ts";

test("ingressLocalPaths stages and needs destinations when empty", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    assert.equal(session.phase, "needDestinations");
    assert.ok(session.files.some((f) => f.name === "a.txt"));
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths auto-offers when destinations provided", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "auto",
    });
    assert.equal(session.phase, "readyToOffer");
    assert.deepEqual(session.destinations, ["L-192.168.0.110"]);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths populates batchPlan from packer", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "small.txt");
    await writeFile(src, "x".repeat(1024));
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "picker",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    assert.ok(session.batchPlan.length >= 1);
    assert.equal(session.batchPlan[0].kind, "zip");
    assert.equal(session.batchPlan[0].files.length, 1);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths rejects on stage count limit and cleans partial dir", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const files: string[] = [];
    // FILES_STAGE_MAX_COUNT = 64 → stage 65 to breach.
    for (let i = 0; i < 65; i++) {
        const p = join(root, `f${i}.txt`);
        await writeFile(p, "x");
        files.push(p);
    }
    const stageRoot = join(root, "stage");
    const hub = createFilesHub({ stageRoot });
    await assert.rejects(
        () =>
            hub.ingressLocalPaths({
                source: "picker",
                paths: files,
                defaultDestinations: [],
                openForShare: "manual",
            }),
        /count|stage/i,
    );
    // Partial stage dir must be removed on rejection.
    const sessions = hub.listSessions();
    assert.equal(sessions.length, 0);
    await rm(root, { recursive: true, force: true });
});

test("confirmOffer transitions needDestinations → readyToOffer", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await hub.confirmOffer(session.transferId, ["L-192.168.0.110", "L-192.168.0.208"]);
    const after = hub.getSession(session.transferId);
    assert.equal(after?.phase, "readyToOffer");
    assert.deepEqual(after?.destinations, ["L-192.168.0.110", "L-192.168.0.208"]);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("cancel removes session and deletes stage dir", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await hub.cancel(session.transferId);
    assert.equal(hub.getSession(session.transferId), undefined);
    await rm(root, { recursive: true, force: true });
});

test("onPhase fires for staged, confirmOffer, and cancel", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const phases: string[] = [];
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const off = hub.onPhase((evt) => phases.push(evt.phase));
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await hub.confirmOffer(session.transferId, ["L-192.168.0.110"]);
    await hub.cancel(session.transferId);
    off();
    assert.deepEqual(phases, ["needDestinations", "readyToOffer", "cancel"]);
    await rm(root, { recursive: true, force: true });
});

test("confirmOffer emits files:offer packet", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const sent: unknown[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p);
        },
        putBlob: async () => ({
            url: "https://127.0.0.1:8434/files/blob/t/b?token=x",
        }),
    });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await hub.confirmOffer(session.transferId, ["L-192.168.0.110"]);
    assert.equal((sent[0] as { what: string }).what, "files:offer");
    const packet = sent[0] as {
        payload: { transferId: string; batches: { asset: { url?: string } }[] };
    };
    assert.equal(packet.payload.transferId, session.transferId);
    assert.ok(packet.payload.batches.length >= 1);
    assert.ok(packet.payload.batches[0].asset.url);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths auto-offer emits files:offer when sendPacket wired", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const sent: unknown[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p);
        },
        putBlob: async () => ({ url: "https://127.0.0.1:8434/files/blob/t/b?token=x" }),
    });
    const session = await hub.ingressLocalPaths({
        source: "open-with",
        paths: [src],
        defaultDestinations: ["L-192.168.0.110"],
        openForShare: "manual",
    });
    assert.equal(session.phase, "offering");
    assert.equal((sent[0] as { what: string }).what, "files:offer");
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("offer embeds small batch via asset.data when putBlob absent", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const sent: unknown[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p);
        },
    });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await hub.confirmOffer(session.transferId, ["L-192.168.0.110"]);
    const packet = sent[0] as {
        what: string;
        payload: { batches: { asset: { data?: string; url?: string } }[] };
    };
    assert.equal(packet.what, "files:offer");
    assert.ok(packet.payload.batches[0].asset.data);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths resolves basename collisions with suffix", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const dirA = join(root, "a");
    const dirB = join(root, "b");
    await mkdir(dirA, { recursive: true });
    await mkdir(dirB, { recursive: true });
    await writeFile(join(dirA, "dup.txt"), "one");
    await writeFile(join(dirB, "dup.txt"), "two");
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "picker",
        paths: [join(dirA, "dup.txt"), join(dirB, "dup.txt")],
        defaultDestinations: [],
        openForShare: "manual",
    });
    const names = session.files.map((f) => f.name).sort();
    assert.deepEqual(names, ["dup-1.txt", "dup.txt"]);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("offer does NOT send broken files:offer when large batch publish fails", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    // WHY: > SMALL_FILE_MAX (500 KiB) with no putBlob → publishOrEmbed returns
    // CWSP_FILES_PUT_BLOB_UNAVAILABLE; offer() must emit files:error + cancel
    // and NOT send the broken files:offer packet. Use random (incompressible)
    // bytes so zip deflation cannot shrink the batch below SMALL_FILE_MAX.
    const src = join(root, "big.bin");
    await writeFile(src, randomBytes(600 * 1024));
    const sent: { what: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string });
        },
        // No putBlob → large batch cannot be published.
    });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await assert.rejects(
        () => hub.confirmOffer(session.transferId, ["L-192.168.0.110"]),
        /CWSP_FILES_PUT_BLOB_UNAVAILABLE/,
    );
    // WHY: the broken files:offer must never reach the wire — only files:error.
    const offers = sent.filter((p) => p.what === "files:offer");
    const errors = sent.filter((p) => p.what === "files:error");
    assert.equal(offers.length, 0, "broken files:offer must not be sent");
    assert.equal(errors.length, 1, "files:error must be emitted exactly once");
    // Session must be cancelled.
    assert.equal(hub.getSession(session.transferId), undefined);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths with wildcard-only destinations does NOT auto-offer", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const sent: { what: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string });
        },
    });
    // WHY: clipboard auto with ["*"] would normally readyToOffer; wildcard guard
    // downgrades to needDestinations so the UI asks for real peers.
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: ["*"],
        openForShare: "auto",
    });
    assert.equal(session.phase, "needDestinations");
    assert.equal(session.destinations, undefined);
    assert.equal(sent.length, 0, "no offer must be emitted for wildcard-only destinations");
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("confirmOffer rejects bare wildcard destinations", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const hub = createFilesHub({ stageRoot: join(root, "stage") });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    await assert.rejects(
        () => hub.confirmOffer(session.transferId, ["*"]),
        /CWSP_FILES_CONFIRM_NO_DESTINATIONS/,
    );
    await assert.rejects(
        () => hub.confirmOffer(session.transferId, ["ALL", "broadcast"]),
        /CWSP_FILES_CONFIRM_NO_DESTINATIONS/,
    );
    // WHY: phase stays needDestinations — wildcard confirm must not advance.
    const after = hub.getSession(session.transferId);
    assert.equal(after?.phase, "needDestinations");
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("allowShareToAll:true permits wildcard destinations through offer", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const sent: { what: string; payload: { destinations: string[] } }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        allowShareToAll: true,
        sendPacket: async (p) => {
            sent.push(p as { what: string; payload: { destinations: string[] } });
        },
        putBlob: async () => ({ url: "https://127.0.0.1:8434/files/blob/t/b?token=x" }),
    });
    // WHY: with allowShareToAll, ["*"] is a valid readyToOffer destination.
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: ["*"],
        openForShare: "auto",
    });
    assert.equal(session.phase, "offering");
    assert.equal(sent[0].what, "files:offer");
    assert.deepEqual(sent[0].payload.destinations, ["*"]);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("ingressLocalPaths emits open-for-share prompt on staging", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const prompts: { kind: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        onFilesPromptUpdate: (state) => {
            if (state) prompts.push({ kind: state.kind });
        },
    });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    // WHY: open-for-share must be emitted first, then need-destinations.
    assert.deepEqual(prompts.map((p) => p.kind), ["open-for-share", "need-destinations"]);
    assert.equal(hub.getFilesPromptState()?.kind, "need-destinations");
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});
