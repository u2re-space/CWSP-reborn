/*
 * Filename: files-hub.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-hub.ts
 * Change date and time: 15.45.00_21.07.2026
 * Reason for changes: Wave 3 Task 3 — extend the Neutralino files-hub SoT to
 *   materialize batches (zip/raw/compressed via `fflate`, already a dep),
 *   publish batch bytes through a `putBlob` adapter (W2 blob endpoint) with
 *   small-batch `asset.data` embed fallback, and emit a canonical
 *   `files:offer` packet via the `sendPacket` adapter using the W1
 *   `buildFilesOfferPacket` builder. Adds a SEPARATE `FilesPromptState`
 *   (open-for-share / need-destinations / progress) so the clipboard prompt
 *   state machine is NOT overloaded. Android is untouched; the hardlinked
 *   generic/ mirror follows.
 */

import { createHash, randomUUID } from "node:crypto";
import { readFile, stat, copyFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
    assertStageLimits,
    buildFilesOfferPacket,
    decideOfferAfterStage,
    planFilesBatches,
    OFFER_TTL_MS_DEFAULT,
    SMALL_FILE_MAX,
    COMPRESS_WORTHWHILE,
    FILES_PURPOSE,
    FILES_WHAT_ERROR,
    createCwspPacket,
    type ByteTransport,
    type CwspPacket,
    type FilesBatchDescriptor,
    type FilesBatchKind,
    type FilesHubPhase,
    type FilesIngressSource,
    type FilesLogicalFile,
    type FilesOfferPayload,
    type FilesPackerBatchPlan,
    type FilesStageLimitsResult,
} from "@fest-lib/cwsp-shared/v2/index.ts";
import { gzipSync, strToU8, zipSync } from "fflate";

/**
 * One staged file. `name` is the collision-suffixed basename inside
 * `stageDir`; `sourcePath` is the original absolute path the caller passed in;
 * `stagedPath` is the absolute path under `stageDir` after the copy.
 */
export interface FilesHubFile {
    name: string;
    sourcePath: string;
    stagedPath: string;
    size: number;
}

/**
 * Active hub session. `batchPlan` comes from the W1 packer; zip bytes are
 * materialized in Task 3 (offer emission), not here.
 */
export interface FilesHubSession {
    transferId: string;
    stageDir: string;
    files: FilesHubFile[];
    phase: FilesHubPhase;
    batchPlan: FilesPackerBatchPlan[];
    source: FilesIngressSource;
    defaultDestinations: string[];
    openForShare: "manual" | "auto";
    /** Present only on `readyToOffer` (set by ingress auto-offer or confirmOffer). */
    destinations?: string[];
    createdAt: number;
}

export interface FilesHubIngressInput {
    source: FilesIngressSource;
    paths: string[];
    defaultDestinations: string[];
    openForShare: "manual" | "auto";
}

export interface FilesHubOptions {
    /** Root for per-transfer stage dirs. Defaults to `os.tmpdir()/cwsp-files`. */
    stageRoot?: string;
    /** Override id generator (defaults to `node:crypto.randomUUID`). */
    generateId?: () => string;
    /**
     * Wire-send adapter. When set, `confirmOffer` and ingress auto-offer
     * (`readyToOffer`) materialize batches and emit a `files:offer` packet.
     * WHY: boot can construct the hub before the WS sender exists; a no-op
     * sender keeps the hub staged-only (W4 wires the real sender).
     */
    sendPacket?: (packet: CwspPacket) => void | Promise<void>;
    /**
     * Blob publisher — PUT each materialized batch to the desk loopback
     * endpoint (`PUT /files/blob/:transferId/:batchId`, W2). Returns the GET
     * URL (and optional token) that receivers fetch. When unset or when PUT
     * fails, small batches (`<= SMALL_FILE_MAX`) fall back to `asset.data`
     * embed; larger batches surface `files:error` and cancel the session.
     */
    putBlob?: (input: FilesPutBlobInput) => Promise<FilesPutBlobResult>;
    /** Sender peer id placed on outbound `files:offer` packets. Default `L-110`. */
    senderId?: string;
    /** `byteTransportHint` placed on the offer payload. Default `auto`. */
    byteTransportHint?: ByteTransport;
    /** Offer TTL (ms). Defaults to `OFFER_TTL_MS_DEFAULT`. */
    offerTtlMs?: number;
    /**
     * Files prompt push callback — fired whenever the SEPARATE files prompt
     * state changes (open-for-share / need-destinations / progress). Receives
     * `null` when the prompt clears. INVARIANT: never reuses
     * `ClipboardPromptState`; the clipboard popup host stays untouched.
     */
    onFilesPromptUpdate?: (state: FilesPromptState | null) => void;
}

/**
 * Input to the `putBlob` adapter. WHY: the hub owns batch bytes + compact
 * metadata; the adapter only transports them to the W2 blob endpoint.
 */
export interface FilesPutBlobInput {
    transferId: string;
    batchId: string;
    bytes: Uint8Array;
    hash: string;
    name: string;
    mimeType: string;
}

export interface FilesPutBlobResult {
    /** GET URL receivers fetch (with token already embedded by the adapter). */
    url: string;
    /** Optional opaque token retained for diagnostics / re-PUT. */
    token?: string;
}

/**
 * SEPARATE prompt state for the files flow. WHY: the clipboard popup state
 * machine owns text/image share/accept/erase/undo; files open-for-share has a
 * distinct lifecycle (open-for-share → need-destinations → progress) and must
 * not overload `ClipboardPromptState`.
 */
export type FilesPromptKind = "open-for-share" | "need-destinations" | "progress";

export interface FilesPromptState {
    /** Stable id (transferId) for UI tracking. */
    id: string;
    transferId: string;
    kind: FilesPromptKind;
    fileCount: number;
    totalBytes: number;
    /** Destinations (seeded on readyToOffer; empty on need-destinations). */
    destinations: string[];
    /** Present when the last action errored (e.g. blob PUT failed for a large batch). */
    error?: string;
}

export interface FilesHubPhaseEvent {
    transferId: string;
    phase: FilesHubPhase;
}

export interface FilesHubRuntime {
    ingressLocalPaths(input: FilesHubIngressInput): Promise<FilesHubSession>;
    confirmOffer(transferId: string, destinations: string[]): Promise<void>;
    /**
     * Materialize batches, publish bytes, and emit a `files:offer` packet via
     * the `sendPacket` adapter. WHY: callers (UI Confirm, ingress auto-offer)
     * drive the offer; the hub owns pack/publish/build. Returns the built
     * packet so callers/tests can assert on it. Requires `sendPacket` to be
     * configured; otherwise throws `CWSP_FILES_NO_SENDER`.
     */
    offer(transferId: string, destinations: string[]): Promise<CwspPacket>;
    cancel(transferId: string): Promise<void>;
    getSession(transferId: string): FilesHubSession | undefined;
    /** Snapshot of active sessions (diagnostics / tests). */
    listSessions(): FilesHubSession[];
    /** Subscribe to phase transitions. Returns an unsubscribe. */
    onPhase(cb: (evt: FilesHubPhaseEvent) => void): () => void;
    /** Current SEPARATE files prompt state, or null when none. */
    getFilesPromptState(): FilesPromptState | null;
}

class FilesHubStageLimitError extends Error {
    readonly limitResult: FilesStageLimitsResult;
    constructor(limitResult: FilesStageLimitsResult) {
        const r = limitResult as { ok: false; reason: string; count: number; totalBytes: number };
        super(`CWSP_FILES_STAGE_LIMIT:${r.reason}`);
        this.name = "FilesHubStageLimitError";
        this.limitResult = limitResult;
    }
}

/**
 * Build a unique basename inside `stageDir` for a desired name, appending
 * `-N` before the extension when a collision would occur. Pure: callers must
 * ensure the returned name is reserved before the next call.
 */
function uniqueBasename(used: Set<string>, desired: string): string {
    if (!used.has(desired)) {
        used.add(desired);
        return desired;
    }
    const ext = path.extname(desired);
    const base = path.basename(desired, ext);
    let i = 1;
    for (;;) {
        const candidate = `${base}-${i}${ext}`;
        if (!used.has(candidate)) {
            used.add(candidate);
            return candidate;
        }
        i++;
    }
}

export function createFilesHub(options: FilesHubOptions = {}): FilesHubRuntime {
    const stageRoot = options.stageRoot ?? path.join(os.tmpdir(), "cwsp-files");
    const generateId = options.generateId ?? (() => randomUUID());
    const sendPacket = options.sendPacket;
    const putBlob = options.putBlob;
    const senderId = options.senderId ?? "L-110";
    const byteTransportHint: ByteTransport = options.byteTransportHint ?? "auto";
    const offerTtlMs = options.offerTtlMs ?? OFFER_TTL_MS_DEFAULT;
    const onFilesPromptUpdate = options.onFilesPromptUpdate;
    const sessions = new Map<string, FilesHubSession>();
    const phaseListeners = new Set<(evt: FilesHubPhaseEvent) => void>();
    /** Current files prompt state (separate from clipboard prompt). */
    let filesPrompt: FilesPromptState | null = null;

    function emitPhase(session: FilesHubSession): void {
        const evt = { transferId: session.transferId, phase: session.phase };
        for (const cb of phaseListeners) {
            try {
                cb(evt);
            } catch {
                /* listener errors are non-fatal to the hub */
            }
        }
    }

    function setPhase(session: FilesHubSession, phase: FilesHubPhase): void {
        session.phase = phase;
        emitPhase(session);
    }

    async function removeStageDir(session: FilesHubSession): Promise<void> {
        try {
            await rm(session.stageDir, { recursive: true, force: true });
        } catch {
            /* best-effort GC; ignore fs errors on cleanup */
        }
    }

    function emitFilesPrompt(state: FilesPromptState | null): void {
        filesPrompt = state;
        try {
            onFilesPromptUpdate?.(state);
        } catch {
            /* prompt callback must never throw the hub */
        }
    }

    function buildFilesPrompt(
        session: FilesHubSession,
        kind: FilesPromptKind,
        error?: string,
    ): FilesPromptState {
        const totalBytes = session.files.reduce((a, f) => a + f.size, 0);
        return {
            id: session.transferId,
            transferId: session.transferId,
            kind,
            fileCount: session.files.length,
            totalBytes,
            destinations: session.destinations ?? [],
            ...(error ? { error } : {}),
        };
    }

    function sha256Hex(bytes: Uint8Array): string {
        return createHash("sha256").update(bytes).digest("hex");
    }

    /**
     * Materialize one batch plan into bytes per `kind`.
     * WHY: zip multi-file small batches; raw single large files; compressed
     * attempts gzip and downgrades to raw when savings < COMPRESS_WORTHWHILE
     * (per the W1 packer contract).
     */
    async function materializeOne(
        session: FilesHubSession,
        plan: FilesPackerBatchPlan,
    ): Promise<{ bytes: Uint8Array; kind: FilesBatchKind; ext: string; mimeType: string }> {
        if (plan.kind === "zip") {
            const entries: Record<string, Uint8Array> = {};
            for (const f of plan.files) {
                const staged = session.files.find((sf) => sf.name === f.name);
                if (!staged) {
                    throw new Error(`CWSP_FILES_STAGE_MISS:${f.name}`);
                }
                entries[f.name] = new Uint8Array(await readFile(staged.stagedPath));
            }
            const bytes = zipSync(entries);
            return { bytes, kind: "zip", ext: "zip", mimeType: "application/zip" };
        }
        // raw | compressed: single member (W1 packer guarantees one file per large batch).
        const member = plan.files[0];
        const staged = session.files.find((sf) => sf.name === member?.name);
        if (!staged) {
            throw new Error(`CWSP_FILES_STAGE_MISS:${member?.name ?? "?"}`);
        }
        const raw = new Uint8Array(await readFile(staged.stagedPath));
        if (plan.kind === "compressed") {
            const gz = gzipSync(raw);
            // WHY: keep compressed only when savings are worthwhile; else raw.
            const saved = raw.length > 0 ? (raw.length - gz.length) / raw.length : 0;
            if (saved >= COMPRESS_WORTHWHILE) {
                return { bytes: gz, kind: "compressed", ext: "gz", mimeType: "application/gzip" };
            }
            return { bytes: raw, kind: "raw", ext: path.extname(staged.name) || "bin", mimeType: "application/octet-stream" };
        }
        return { bytes: raw, kind: "raw", ext: path.extname(staged.name) || "bin", mimeType: "application/octet-stream" };
    }

    /**
     * Publish batch bytes via `putBlob`, or embed as `asset.data` (base64) for
     * small batches when PUT is unavailable/fails. Large batches with no
     * successful PUT surface `files:error` and cancel — no second blob server.
     */
    async function publishOrEmbed(
        session: FilesHubSession,
        batchId: string,
        materialized: { bytes: Uint8Array; kind: FilesBatchKind; ext: string; mimeType: string },
    ): Promise<{ asset: FilesOfferPayload["batches"][number]["asset"]; error?: string }> {
        const hash = sha256Hex(materialized.bytes);
        const name = `${batchId}.${materialized.ext}`;
        const size = materialized.bytes.length;
        if (putBlob) {
            try {
                const result = await putBlob({
                    transferId: session.transferId,
                    batchId,
                    bytes: materialized.bytes,
                    hash,
                    name,
                    mimeType: materialized.mimeType,
                });
                if (result?.url) {
                    return {
                        asset: {
                            hash,
                            name,
                            mimeType: materialized.mimeType,
                            size,
                            source: "url",
                            url: result.url,
                        },
                    };
                }
            } catch {
                /* fall through to embed-or-error below */
            }
        }
        // Fallback: embed only for small batches; else signal error.
        if (size <= SMALL_FILE_MAX) {
            const data = Buffer.from(materialized.bytes).toString("base64");
            return {
                asset: {
                    hash,
                    name,
                    mimeType: materialized.mimeType,
                    size,
                    source: "base64",
                    data,
                },
            };
        }
        return {
            asset: {
                hash,
                name,
                mimeType: materialized.mimeType,
                size,
                source: "base64",
            },
            error: "CWSP_FILES_PUT_BLOB_UNAVAILABLE",
        };
    }

    /**
     * Materialize all batches, publish bytes, and build the canonical
     * `files:offer` packet. INVARIANT: batch `asset` is always canonicalized
     * through `buildFilesOfferPacket` (which re-validates via the W1 parser).
     */
    async function buildOffer(
        session: FilesHubSession,
        destinations: string[],
    ): Promise<{ packet: CwspPacket; error?: string }> {
        const count = session.batchPlan.length;
        const batches: FilesBatchDescriptor[] = [];
        let firstError: string | undefined;
        for (let i = 0; i < count; i++) {
            const plan = session.batchPlan[i];
            const batchId = `${session.transferId}-${i}`;
            const materialized = await materializeOne(session, plan);
            const { asset, error } = await publishOrEmbed(session, batchId, materialized);
            if (error && !firstError) firstError = error;
            const files: FilesLogicalFile[] = plan.files.map((f) => ({ name: f.name, size: f.size }));
            batches.push({ batchId, index: i, count, kind: materialized.kind, asset, files });
        }
        const totalBytes = session.files.reduce((a, f) => a + f.size, 0);
        const payload: FilesOfferPayload = {
            transferId: session.transferId,
            sender: senderId,
            destinations,
            createdAt: session.createdAt,
            expiresAt: session.createdAt + offerTtlMs,
            summary: { fileCount: session.files.length, totalBytes },
            batches,
            flags: { openForShare: session.openForShare === "auto" },
            byteTransportHint,
        };
        const packet = buildFilesOfferPacket(payload);
        return { packet, error: firstError };
    }

    /**
     * Minimal `files:error` packet for large-batch PUT failures. WHY: keeps the
     * receiver informed that the transfer was cancelled; full error semantics
     * land in Task 4 — this is the minimum to not silently drop a transfer.
     */
    function buildFilesErrorPacket(session: FilesHubSession, reason: string): CwspPacket {
        return createCwspPacket({
            op: "act",
            what: FILES_WHAT_ERROR,
            purpose: FILES_PURPOSE,
            sender: senderId,
            destinations: session.destinations ?? [],
            payload: { transferId: session.transferId, reason },
        });
    }

    /**
     * Materialize + publish + emit `files:offer` via the `sendPacket` adapter.
     * WHY: driven by `confirmOffer` and ingress auto-offer; the hub owns pack,
     * publish, and build. On a large-batch PUT failure, emits `files:error`
     * (via sendPacket) and cancels the session — no second blob server in W3+.
     */
    async function offer(
        transferId: string,
        destinations: string[],
    ): Promise<CwspPacket> {
        if (!sendPacket) {
            throw new Error("CWSP_FILES_NO_SENDER");
        }
        const session = sessions.get(transferId);
        if (!session) {
            throw new Error(`CWSP_FILES_SESSION_NOT_FOUND:${transferId}`);
        }
        if (session.phase !== "readyToOffer") {
            throw new Error(`CWSP_FILES_OFFER_BAD_PHASE:${session.phase}`);
        }
        const dest = destinations.map(String).filter(Boolean);
        if (dest.length === 0) {
            throw new Error("CWSP_FILES_OFFER_NO_DESTINATIONS");
        }
        session.destinations = dest;
        setPhase(session, "offering");
        emitFilesPrompt(buildFilesPrompt(session, "progress"));
        const { packet, error } = await buildOffer(session, dest);
        await sendPacket(packet);
        if (error) {
            // WHY: large batch had no PUT path — surface files:error and cancel.
            const errorPacket = buildFilesErrorPacket(session, error);
            try {
                await sendPacket(errorPacket);
            } catch {
                /* best-effort — original offer already attempted */
            }
            await cancel(transferId);
            throw new Error(error);
        }
        return packet;
    }

    async function ingressLocalPaths(
        input: FilesHubIngressInput,
    ): Promise<FilesHubSession> {
        const transferId = generateId();
        const stageDir = path.join(stageRoot, transferId);
        // WHY: create the per-transfer dir up front so copyFile targets exist.
        await mkdir(stageDir, { recursive: true });

        const files: FilesHubFile[] = [];
        const usedNames = new Set<string>();

        try {
            for (const src of input.paths) {
                const abs = path.resolve(src);
                const stats = await stat(abs);
                if (!stats.isFile()) {
                    throw new Error(`CWSP_FILES_INGRESS_NOT_FILE:${abs}`);
                }
                const desired = path.basename(abs);
                const name = uniqueBasename(usedNames, desired);
                const stagedPath = path.join(stageDir, name);
                await copyFile(abs, stagedPath);
                files.push({
                    name,
                    sourcePath: abs,
                    stagedPath,
                    size: stats.size,
                });
            }

            // WHY: enforce the shared isomorphic stage boundary before any
            // offer materialization. On failure, delete the partial dir and
            // surface a precise reason via FilesHubStageLimitError.
            const limit = assertStageLimits(files);
            if (!limit.ok) {
                throw new FilesHubStageLimitError(limit);
            }

            // W1 packer: sizes-only input keeps the plan isomorphic across shells.
            const batchPlan = planFilesBatches(
                files.map((f) => ({ name: f.name, size: f.size })),
            );

            const decision = decideOfferAfterStage({
                source: input.source,
                defaultDestinations: input.defaultDestinations,
                openForShare: input.openForShare,
            });

            const session: FilesHubSession = {
                transferId,
                stageDir,
                files,
                phase: decision.phase,
                batchPlan,
                source: input.source,
                defaultDestinations: input.defaultDestinations,
                openForShare: input.openForShare,
                destinations:
                    decision.phase === "readyToOffer" ? decision.destinations : undefined,
                createdAt: Date.now(),
            };

            sessions.set(transferId, session);
            emitPhase(session);
            if (session.phase === "needDestinations") {
                // WHY: separate files prompt — UI shows Open-for-Share / destination picker.
                emitFilesPrompt(buildFilesPrompt(session, "need-destinations"));
            } else if (session.phase === "readyToOffer" && sendPacket) {
                // WHY: hybrid / clipboard auto — offer immediately once staged.
                try {
                    await offer(transferId, session.destinations ?? []);
                } catch (error) {
                    // offer() already cancels on hard errors; rethrow to caller.
                    throw error;
                }
            }
            return session;
        } catch (error) {
            // Partial stage dir must not survive a failed ingress.
            await rm(stageDir, { recursive: true, force: true });
            throw error;
        }
    }

    async function confirmOffer(
        transferId: string,
        destinations: string[],
    ): Promise<void> {
        const session = sessions.get(transferId);
        if (!session) {
            throw new Error(`CWSP_FILES_SESSION_NOT_FOUND:${transferId}`);
        }
        if (session.phase !== "needDestinations") {
            throw new Error(`CWSP_FILES_CONFIRM_BAD_PHASE:${session.phase}`);
        }
        const dest = destinations.map(String).filter(Boolean);
        if (dest.length === 0) {
            throw new Error("CWSP_FILES_CONFIRM_NO_DESTINATIONS");
        }
        session.destinations = dest;
        setPhase(session, "readyToOffer");
        // WHY: when a wire sender is wired, Confirm drives the offer emission.
        if (sendPacket) {
            await offer(transferId, dest);
        }
    }

    async function cancel(transferId: string): Promise<void> {
        const session = sessions.get(transferId);
        if (!session) {
            return;
        }
        sessions.delete(transferId);
        setPhase(session, "cancel");
        if (filesPrompt?.transferId === transferId) {
            emitFilesPrompt(null);
        }
        await removeStageDir(session);
    }

    function getSession(transferId: string): FilesHubSession | undefined {
        return sessions.get(transferId);
    }

    function listSessions(): FilesHubSession[] {
        return [...sessions.values()];
    }

    function onPhase(cb: (evt: FilesHubPhaseEvent) => void): () => void {
        phaseListeners.add(cb);
        return () => {
            phaseListeners.delete(cb);
        };
    }

    return {
        ingressLocalPaths,
        confirmOffer,
        offer,
        cancel,
        getSession,
        listSessions,
        onPhase,
        getFilesPromptState: () => filesPrompt,
    };
}
