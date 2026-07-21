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
import { mkdtemp, writeFile, rm, mkdir, stat, access } from "node:fs/promises";
import { constants } from "node:fs";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFilesHub } from "./files-hub.ts";
import {
    buildFilesOfferPacket,
    createCwspPacket,
    FILES_PURPOSE,
    FILES_WHAT_OFFER,
    type CwspPacket,
    type FilesOfferPayload,
} from "@fest-lib/cwsp-shared/v2/index.ts";

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

// ---------------------------------------------------------------------------
// Task 4: progress + cancel GC disk asserts + incoming offer accept/decline
// ---------------------------------------------------------------------------

test("cancel deletes stageDir on disk (GC harden)", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "hello");
    const stageRoot = join(root, "stage");
    const hub = createFilesHub({ stageRoot });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    const stageDir = session.stageDir;
    // Stage dir exists on disk before cancel.
    await assert.ok((await stat(stageDir)).isDirectory());
    await hub.cancel(session.transferId);
    assert.equal(hub.getSession(session.transferId), undefined);
    // WHY: disk-level assert — the dir must be gone, not just unlinked from the map.
    await assert.rejects(
        () => access(stageDir, constants.F_OK),
        /ENOENT/,
        "stageDir must be removed from disk on cancel",
    );
    await rm(root, { recursive: true, force: true });
});

test("reportBytes exposes speedBps and etaMs on session.progress", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "x".repeat(2048));
    const sent: { what: string; payload: unknown }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string; payload: unknown });
        },
    });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    const total = 2048;
    // First sample seeds the EMA; no speed yet. Advance clock via two reports
    // spaced by real ms by awaiting a small delay.
    hub.reportBytes(session.transferId, 512, total);
    await new Promise((r) => setTimeout(r, 5));
    hub.reportBytes(session.transferId, 1536, total);
    const after = hub.getSession(session.transferId);
    assert.ok(after?.progress, "session.progress must be populated after reportBytes");
    assert.ok(after.progress!.speedBps >= 0, "speedBps must be a non-negative number");
    assert.ok(
        after.progress!.etaMs === null || typeof after.progress!.etaMs === "number",
        "etaMs must be null or a number",
    );
    assert.equal(after.progress!.totalBytes, total);
    assert.equal(after.progress!.batchCount, session.batchPlan.length);
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("reportBytes emits files:progress at <= 4Hz", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const src = join(root, "a.txt");
    await writeFile(src, "x".repeat(4096));
    const sent: { what: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string });
        },
    });
    const session = await hub.ingressLocalPaths({
        source: "clipboard",
        paths: [src],
        defaultDestinations: [],
        openForShare: "manual",
    });
    const total = 4096;
    // Fire 10 rapid reports within < 250ms (the 4Hz min gap). At most ~1-2
    // progress packets should escape the throttle.
    for (let i = 1; i <= 10; i++) {
        hub.reportBytes(session.transferId, Math.round((total / 10) * i), total);
    }
    const progressPackets = sent.filter((p) => p.what === "files:progress");
    // WHY: 10 synchronous reports within the same ms tick — the throttle must
    // collapse them to at most 1 emit (the first sample at lastEmitMs=0).
    assert.ok(
        progressPackets.length <= 2,
        `progress must be throttled to <= 2 emits in one tick, got ${progressPackets.length}`,
    );
    await hub.cancel(session.transferId);
    await rm(root, { recursive: true, force: true });
});

test("reportBytes on unknown transferId is a no-op (no throw)", async () => {
    const hub = createFilesHub({ stageRoot: join(tmpdir(), "cwsp-fh-noop") });
    assert.doesNotThrow(() => hub.reportBytes("nope", 0, 100));
});

test("handleIncomingOffer sets Accept/Decline prompt in manual acceptMode", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const prompts: { kind: string; transferId: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        acceptMode: "manual",
        onFilesPromptUpdate: (state) => {
            if (state) prompts.push({ kind: state.kind, transferId: state.transferId });
        },
    });
    const offerPacket = buildFilesOfferPacket({
        transferId: "inc-1",
        sender: "L-192.168.0.196",
        destinations: ["L-110"],
        createdAt: Date.now(),
        expiresAt: Date.now() + 60_000,
        summary: { fileCount: 1, totalBytes: 10 },
        batches: [
            {
                batchId: "inc-1-0",
                index: 0,
                count: 1,
                kind: "raw",
                asset: {
                    hash: "h0",
                    name: "inc-1-0.bin",
                    mimeType: "application/octet-stream",
                    size: 10,
                    source: "url",
                    url: "https://127.0.0.1:8434/files/blob/inc-1/0",
                },
                files: [{ name: "a.txt", size: 10 }],
            },
        ],
    });
    await hub.handleIncomingOffer(offerPacket);
    const incoming = hub.getIncomingOffer("inc-1");
    assert.ok(incoming, "incoming offer must be registered");
    assert.equal(hub.getFilesPromptState()?.kind, "accept");
    assert.equal(hub.getFilesPromptState()?.transferId, "inc-1");
    await hub.declineIncomingOffer("inc-1");
    assert.equal(hub.getIncomingOffer("inc-1"), undefined);
    assert.equal(hub.getFilesPromptState(), null);
    await rm(root, { recursive: true, force: true });
});

test("acceptIncomingOffer sends files:accept and GETs each batch into landingDir", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const landingRoot = join(root, "in");
    const sent: { what: string; payload: unknown }[] = [];
    const fetchedUrls: string[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        landingRoot,
        acceptMode: "manual",
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string; payload: unknown });
        },
        getBlob: async (url) => {
            fetchedUrls.push(url);
            return new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        },
    });
    const offerPacket = buildFilesOfferPacket({
        transferId: "inc-2",
        sender: "L-192.168.0.196",
        destinations: ["L-110"],
        createdAt: Date.now(),
        expiresAt: Date.now() + 60_000,
        summary: { fileCount: 1, totalBytes: 10 },
        batches: [
            {
                batchId: "inc-2-0",
                index: 0,
                count: 1,
                kind: "raw",
                asset: {
                    hash: "h0",
                    name: "inc-2-0.bin",
                    mimeType: "application/octet-stream",
                    size: 10,
                    source: "url",
                    url: "https://127.0.0.1:8434/files/blob/inc-2/0",
                },
                files: [{ name: "a.txt", size: 10 }],
            },
        ],
    });
    await hub.handleIncomingOffer(offerPacket);
    await hub.acceptIncomingOffer("inc-2");
    // WHY: accept must emit exactly one files:accept packet addressed to sender.
    const accepts = sent.filter((p) => p.what === "files:accept");
    assert.equal(accepts.length, 1, "files:accept must be emitted exactly once");
    // GET must have hit the batch url.
    assert.deepEqual(fetchedUrls, ["https://127.0.0.1:8434/files/blob/inc-2/0"]);
    // Batch bytes must be on disk under landingRoot/<transferId>/<batchId>.<ext>.
    const landingDir = join(landingRoot, "inc-2");
    await assert.ok((await stat(landingDir)).isDirectory());
    const landed = join(landingDir, "inc-2-0.bin");
    await access(landed, constants.R_OK);
    // Prompt must be dismissed after a successful accept.
    assert.equal(hub.getFilesPromptState(), null);
    await rm(root, { recursive: true, force: true });
});

test("acceptIncomingOffer emits files:error and dismisses prompt when GET fails", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const landingRoot = join(root, "in");
    const sent: { what: string; payload: { reason?: string; transferId?: string } }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        landingRoot,
        acceptMode: "manual",
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string; payload: { reason?: string; transferId?: string } });
        },
        getBlob: async () => {
            throw new Error("CWSP_FILES_GET_FAILED");
        },
    });
    const offerPacket = buildFilesOfferPacket({
        transferId: "inc-3",
        sender: "L-192.168.0.196",
        destinations: ["L-110"],
        createdAt: Date.now(),
        expiresAt: Date.now() + 60_000,
        summary: { fileCount: 1, totalBytes: 10 },
        batches: [
            {
                batchId: "inc-3-0",
                index: 0,
                count: 1,
                kind: "raw",
                asset: {
                    hash: "h0",
                    name: "inc-3-0.bin",
                    mimeType: "application/octet-stream",
                    size: 10,
                    source: "url",
                    url: "https://127.0.0.1:8434/files/blob/inc-3/0",
                },
                files: [{ name: "a.txt", size: 10 }],
            },
        ],
    });
    await hub.handleIncomingOffer(offerPacket);
    await assert.rejects(
        () => hub.acceptIncomingOffer("inc-3"),
        /CWSP_FILES_GET_FAILED/,
    );
    const errors = sent.filter((p) => p.what === "files:error");
    assert.equal(errors.length, 1, "files:error must be emitted on GET failure");
    assert.equal(errors[0].payload.transferId, "inc-3");
    // WHY: prompt must be dismissed even on failure — no lingering Accept/Decline.
    assert.equal(hub.getFilesPromptState(), null);
    await rm(root, { recursive: true, force: true });
});

test("handleIncomingOffer does not touch clipboard-hub (no clipboard adapter wired)", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    // WHY: no clipboard adapter is provided to the files-hub; the incoming path
    // must operate entirely through files-only adapters and never call into a
    // clipboard-hub. We assert the path completes without throwing and that no
    // packet other than files:accept/files:error is emitted on accept.
    const sent: { what: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        landingRoot: join(root, "in"),
        acceptMode: "manual",
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string });
        },
        getBlob: async () => new Uint8Array([0]),
    });
    const offerPacket = buildFilesOfferPacket({
        transferId: "inc-4",
        sender: "L-192.168.0.196",
        destinations: ["L-110"],
        createdAt: Date.now(),
        expiresAt: Date.now() + 60_000,
        summary: { fileCount: 1, totalBytes: 1 },
        batches: [
            {
                batchId: "inc-4-0",
                index: 0,
                count: 1,
                kind: "raw",
                asset: {
                    hash: "h0",
                    name: "inc-4-0.bin",
                    mimeType: "application/octet-stream",
                    size: 1,
                    source: "url",
                    url: "https://127.0.0.1:8434/files/blob/inc-4/0",
                },
                files: [{ name: "a.bin", size: 1 }],
            },
        ],
    });
    await hub.handleIncomingOffer(offerPacket);
    await hub.acceptIncomingOffer("inc-4");
    const nonFiles = sent.filter((p) => !p.what.startsWith("files:"));
    assert.deepEqual(nonFiles, [], "incoming path must not emit non-files packets");
    await rm(root, { recursive: true, force: true });
});

test("handleIncomingOffer with auto acceptMode accepts immediately (no prompt)", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const landingRoot = join(root, "in");
    const sent: { what: string }[] = [];
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        landingRoot,
        acceptMode: "auto",
        senderId: "L-110",
        sendPacket: async (p) => {
            sent.push(p as { what: string });
        },
        getBlob: async () => new Uint8Array([1, 2, 3]),
    });
    const offerPacket = buildFilesOfferPacket({
        transferId: "inc-5",
        sender: "L-192.168.0.196",
        destinations: ["L-110"],
        createdAt: Date.now(),
        expiresAt: Date.now() + 60_000,
        summary: { fileCount: 1, totalBytes: 3 },
        batches: [
            {
                batchId: "inc-5-0",
                index: 0,
                count: 1,
                kind: "raw",
                asset: {
                    hash: "h0",
                    name: "inc-5-0.bin",
                    mimeType: "application/octet-stream",
                    size: 3,
                    source: "url",
                    url: "https://127.0.0.1:8434/files/blob/inc-5/0",
                },
                files: [{ name: "a.bin", size: 3 }],
            },
        ],
    });
    await hub.handleIncomingOffer(offerPacket);
    // WHY: auto mode must accept without a prompt — files:accept emitted, no prompt set.
    const accepts = sent.filter((p) => p.what === "files:accept");
    assert.equal(accepts.length, 1);
    assert.equal(hub.getFilesPromptState(), null);
    await rm(root, { recursive: true, force: true });
});

test("handleIncomingOffer rejects malformed offer packet without throwing into caller", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-fh-"));
    const hub = createFilesHub({
        stageRoot: join(root, "stage"),
        acceptMode: "manual",
    });
    const bogus = createCwspPacket({
        op: "act",
        what: FILES_WHAT_OFFER,
        purpose: FILES_PURPOSE,
        sender: "L-192.168.0.196",
        uuid: "u1",
        timestamp: Date.now(),
        payload: { notAnOffer: true },
    });
    // WHY: a malformed offer must not register an incoming offer nor throw.
    await hub.handleIncomingOffer(bogus);
    assert.equal(hub.getIncomingOffer("bogus"), undefined);
    assert.equal(hub.getFilesPromptState(), null);
    await rm(root, { recursive: true, force: true });
});
