/*
 * Filename: files-hub.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-hub.ts
 * Change date and time: 15.50.00_21.07.2026
 * Reason for changes: Wave 3 Task 3 — extend the Neutralino files-hub SoT to
 *   materialize batches (zip/raw/compressed via `fflate`, already a dep),
 *   publish batch bytes through a `putBlob` adapter (W2 blob endpoint) with
 *   small-batch `asset.data` embed fallback, and emit a canonical
 *   `files:offer` packet via the `sendPacket` adapter using the W1
 *   `buildFilesOfferPacket` builder. Adds a SEPARATE `FilesPromptState`
 *   (open-for-share / need-destinations / progress) so the clipboard prompt
 *   state machine is NOT overloaded. Android is untouched; the hardlinked
 *   generic/ mirror follows.
 *   2026-07-21 (Task 3 review fixes): never send a broken `files:offer` when
 *   a batch publish fails (emit `files:error` + cancel only); reject bare
 *   wildcard destinations (`*`/`all`/`broadcast`) by default unless
 *   `allowShareToAll: true` is set; emit `open-for-share` prompt on staging.
 *   2026-07-21 (Task 4): add `reportBytes` progress via the W1
 *   `createFilesProgressTracker` + `buildFilesProgressPacket` at <= 4Hz, with
 *   `session.progress` exposing `speedBps` / `etaMs`; cancel now drops the
 *   progress tracker; add the inbound `files:offer` stub — `handleIncomingOffer`
 *   surfaces an Accept/Decline prompt (manual) or accepts immediately (auto),
 *   `acceptIncomingOffer` emits `buildFilesAcceptPacket` and HTTP GETs each
 *   `batch.asset.url` into `landingRoot/<transferId>` via a `getBlob` adapter,
 *   emitting `files:error` + dismissing the prompt on failure. INVARIANT: the
 *   incoming path never touches clipboard-hub — only files-only adapters.
 *   2026-07-21 (Task 4 hardening): sanitize `batch.asset.name` with
 *   `path.basename` on the landing write (reject empty; fallback to batchId)
 *   and verify the resolved dest stays under `landingDir` via `path.relative`
 *   so a `../../etc/passwd`-style remote name cannot escape the landing dir.
 *   Removed unused `FILES_WHAT_ACCEPT` / `FILES_WHAT_OFFER` /
 *   `FILES_WHAT_PROGRESS` imports.
 */

import { createHash, randomUUID } from "node:crypto";
import { readFile, stat, copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
    assertStageLimits,
    buildFilesAcceptPacket,
    buildFilesOfferPacket,
    buildFilesProgressPacket,
    createFilesProgressTracker,
    decideOfferAfterStage,
    parseFilesOfferPayload,
    planFilesBatches,
    shouldEmitProgress,
    OFFER_TTL_MS_DEFAULT,
    SMALL_FILE_MAX,
    COMPRESS_WORTHWHILE,
    FILES_PURPOSE,
    FILES_WHAT_ERROR,
    createCwspPacket,
    type ByteTransport,
    type CwspPacket,
    type FilesAcceptPayload,
    type FilesBatchDescriptor,
    type FilesBatchKind,
    type FilesHubPhase,
    type FilesIngressSource,
    type FilesLogicalFile,
    type FilesOfferPayload,
    type FilesPackerBatchPlan,
    type FilesProgressPayload,
    type FilesProgressTracker,
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
    /**
     * Last progress snapshot populated by `reportBytes`. WHY: exposes
     * `speedBps` / `etaMs` to UI/tests without re-running the tracker.
     */
    progress?: FilesProgressPayload;
}

/**
 * Inbound offer registered by `handleIncomingOffer` until the user Accepts or
 * Declines. WHY: kept separate from outbound `FilesHubSession` so the incoming
 * path never collides with the local staging/offer lifecycle.
 */
export interface FilesIncomingOffer {
    transferId: string;
    sender: string;
    destinations: string[];
    createdAt: number;
    expiresAt: number;
    summary: { fileCount: number; totalBytes: number };
    batches: FilesBatchDescriptor[];
    landingDir: string;
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
     * Allow bare wildcard destinations (`*`, `all`, `broadcast`) to reach the
     * wire. WHY: a silent fleet-wide fan-out is dangerous; the hub rejects
     * wildcards by default and the caller must explicitly opt in. Default false.
     * SECURITY: gate against accidental broadcast of file offers.
     */
    allowShareToAll?: boolean;
    /**
     * Files prompt push callback — fired whenever the SEPARATE files prompt
     * state changes (open-for-share / need-destinations / progress / accept).
     * Receives `null` when the prompt clears. INVARIANT: never reuses
     * `ClipboardPromptState`; the clipboard popup host stays untouched.
     */
    onFilesPromptUpdate?: (state: FilesPromptState | null) => void;
    /**
     * Inbound offer accept policy. `manual` (default) surfaces an Accept/
     * Decline prompt; `auto` accepts immediately on `handleIncomingOffer`.
     */
    acceptMode?: "manual" | "auto";
    /**
     * Root for per-transfer inbound landing dirs. Defaults to
     * `os.tmpdir()/cwsp-files-in`. WHY: desktop has no SAF; we land batches
     * into a temp dir the user can later move out of.
     */
    landingRoot?: string;
    /**
     * HTTP GET adapter — fetches each `batch.asset.url` into the landing dir
     * on Accept. WHY: the hub owns the accept flow but not the transport; the
     * shell wires the real fetch (Node fetch / Neutralino adapter). When unset,
     * Accept fails with `CWSP_FILES_GET_UNAVAILABLE` and emits `files:error`.
     */
    getBlob?: (url: string) => Promise<Uint8Array>;
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
export type FilesPromptKind =
    | "open-for-share"
    | "need-destinations"
    | "progress"
    | "accept";

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
    /**
     * Sender of an inbound offer (kind === "accept"). WHY: the UI needs the
     * remote peer id to render "Accept from <sender>?".
     */
    sender?: string;
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
    /**
     * Feed transfer progress into the W1 tracker and emit `files:progress` via
     * `buildFilesProgressPacket` at <= 4Hz. WHY: callers own the byte clock
     * (chunk ack, transport tick); the hub owns smoothing + throttle. After a
     * report, `session.progress` exposes `speedBps` / `etaMs`. Unknown
     * transferId is a no-op so transport callbacks never throw the hub.
     */
    reportBytes(transferId: string, bytesDone: number, totalBytes: number): void;
    cancel(transferId: string): Promise<void>;
    getSession(transferId: string): FilesHubSession | undefined;
    /** Snapshot of active sessions (diagnostics / tests). */
    listSessions(): FilesHubSession[];
    /** Subscribe to phase transitions. Returns an unsubscribe. */
    onPhase(cb: (evt: FilesHubPhaseEvent) => void): () => void;
    /** Current SEPARATE files prompt state, or null when none. */
    getFilesPromptState(): FilesPromptState | null;
    /**
     * Inbound `files:offer` handler (desk). In `manual` acceptMode sets an
     * Accept/Decline prompt; in `auto` acceptMode accepts immediately. WHY:
     * the desk must pull batches via HTTP GET into a landing temp — no SAF on
     * desktop. INVARIANT: never touches clipboard-hub; operates only through
     * files-only adapters. Malformed offers are dropped silently (no throw).
     */
    handleIncomingOffer(packet: CwspPacket): Promise<void>;
    /** Registered incoming offer, or undefined when none/unknown. */
    getIncomingOffer(transferId: string): FilesIncomingOffer | undefined;
    /**
     * Accept an incoming offer: emit `buildFilesAcceptPacket` then HTTP GET
     * each `batch.asset.url` into `landingDir`. On any GET failure, emit
     * `files:error` and dismiss the prompt. WHY: failures must not leave a
     * lingering Accept/Decline prompt nor a half-populated landing dir.
     */
    acceptIncomingOffer(transferId: string): Promise<void>;
    /** Decline an incoming offer: dismiss the prompt and drop the registration. */
    declineIncomingOffer(transferId: string): Promise<void>;
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

/**
 * Bare wildcard destinations that would silently fan out to every peer.
 * WHY: rejecting these by default prevents accidental fleet-wide file offers;
 * callers must opt in via `allowShareToAll: true` to use them.
 */
const WILDCARD_DESTINATIONS = new Set(["*", "all", "broadcast"]);

function isWildcardDestination(dest: string): boolean {
    return WILDCARD_DESTINATIONS.has(String(dest).trim().toLowerCase());
}

/**
 * Strip bare wildcards from a destination list. WHY: used by `offer` /
 * `confirmOffer` / ingress auto-offer to enforce the default reject policy.
 */
function filterWildcards(dests: string[]): string[] {
    return dests.map(String).filter((d) => !isWildcardDestination(d));
}

export function createFilesHub(options: FilesHubOptions = {}): FilesHubRuntime {
    const stageRoot = options.stageRoot ?? path.join(os.tmpdir(), "cwsp-files");
    const landingRoot = options.landingRoot ?? path.join(os.tmpdir(), "cwsp-files-in");
    const generateId = options.generateId ?? (() => randomUUID());
    const sendPacket = options.sendPacket;
    const putBlob = options.putBlob;
    const getBlob = options.getBlob;
    const senderId = options.senderId ?? "L-110";
    const byteTransportHint: ByteTransport = options.byteTransportHint ?? "auto";
    const offerTtlMs = options.offerTtlMs ?? OFFER_TTL_MS_DEFAULT;
    const allowShareToAll = options.allowShareToAll ?? false;
    const acceptMode = options.acceptMode ?? "manual";
    const onFilesPromptUpdate = options.onFilesPromptUpdate;
    const sessions = new Map<string, FilesHubSession>();
    const incomingOffers = new Map<string, FilesIncomingOffer>();
    /** Per-session W1 progress tracker + last emit timestamp (4Hz throttle). */
    const progressTrackers = new Map<string, { tracker: FilesProgressTracker; lastEmitMs: number }>();
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

    /**
     * Build an Accept/Decline prompt from an inbound offer. WHY: incoming
     * offers have no local `FilesHubSession`, so they need their own builder;
     * `sender` is surfaced so the UI can render "Accept from <sender>?".
     */
    function buildAcceptPrompt(offer: FilesIncomingOffer): FilesPromptState {
        return {
            id: offer.transferId,
            transferId: offer.transferId,
            kind: "accept",
            fileCount: offer.summary.fileCount,
            totalBytes: offer.summary.totalBytes,
            destinations: offer.destinations,
            sender: offer.sender,
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
     * NOTE: must carry its own uuid + timestamp (createCwspPacket requires a
     * non-empty uuid); without this the error path itself threw and masked the
     * original CWSP_FILES_PUT_BLOB_UNAVAILABLE reason.
     */
    function buildFilesErrorPacket(session: FilesHubSession, reason: string): CwspPacket {
        return createCwspPacket({
            op: "act",
            what: FILES_WHAT_ERROR,
            purpose: FILES_PURPOSE,
            sender: senderId,
            uuid: generateId(),
            timestamp: Date.now(),
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
        // WHY: bare wildcards (`*`/`all`/`broadcast`) would silently fan out to
        // every peer; reject unless the caller explicitly opted in via
        // allowShareToAll. After filtering, empty → caller must supply real peers.
        const dest = (
            allowShareToAll
                ? destinations.map(String).filter(Boolean)
                : filterWildcards(destinations)
        ).filter(Boolean);
        if (dest.length === 0) {
            throw new Error("CWSP_FILES_OFFER_NO_DESTINATIONS");
        }
        session.destinations = dest;
        setPhase(session, "offering");
        emitFilesPrompt(buildFilesPrompt(session, "progress"));
        const { packet, error } = await buildOffer(session, dest);
        // WHY: if any batch could not be published (no url and no embeddable
        // asset.data), the built `files:offer` is broken — NEVER send it. Only
        // emit `files:error` and cancel the session. This is the critical
        // regression guard: a broken offer must not reach the wire.
        if (error) {
            const errorPacket = buildFilesErrorPacket(session, error);
            try {
                await sendPacket(errorPacket);
            } catch {
                /* best-effort — error path must not mask the original failure */
            }
            await cancel(transferId);
            throw new Error(error);
        }
        await sendPacket(packet);
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

            // WHY: even if the packer decided readyToOffer, wildcard-only default
            // destinations must NOT auto-broadcast. Downgrade to needDestinations
            // unless the caller explicitly opted in via allowShareToAll.
            let phase: FilesHubPhase = decision.phase;
            let destinations: string[] | undefined =
                decision.phase === "readyToOffer" ? decision.destinations : undefined;
            if (phase === "readyToOffer" && !allowShareToAll) {
                const filtered = filterWildcards(destinations ?? []);
                if (filtered.length === 0) {
                    phase = "needDestinations";
                    destinations = undefined;
                } else {
                    destinations = filtered;
                }
            }

            const session: FilesHubSession = {
                transferId,
                stageDir,
                files,
                phase,
                batchPlan,
                source: input.source,
                defaultDestinations: input.defaultDestinations,
                openForShare: input.openForShare,
                destinations,
                createdAt: Date.now(),
            };

            sessions.set(transferId, session);
            emitPhase(session);
            // WHY: emit `open-for-share` first so the UI surfaces the Open-for-Share
            // surface the moment files are staged; need-destinations / progress
            // follow as the user picks destinations or the auto-offer fires.
            emitFilesPrompt(buildFilesPrompt(session, "open-for-share"));
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
        // WHY: same wildcard guard as `offer` — confirm must not be a backdoor to
        // broadcast. Empty after filtering → caller must supply real destinations.
        const dest = (
            allowShareToAll
                ? destinations.map(String).filter(Boolean)
                : filterWildcards(destinations)
        ).filter(Boolean);
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
        // WHY: drop the progress tracker so a cancelled transfer does not leak
        // EMA state into a future transferId collision.
        progressTrackers.delete(transferId);
        setPhase(session, "cancel");
        if (filesPrompt?.transferId === transferId) {
            emitFilesPrompt(null);
        }
        await removeStageDir(session);
    }

    /**
     * Feed transfer progress into the W1 tracker and emit `files:progress` at
     * <= 4Hz via `buildFilesProgressPacket`. WHY: callers own the byte clock;
     * the hub owns smoothing + throttle. Unknown transferId is a no-op so
     * transport callbacks never throw the hub.
     */
    function reportBytes(transferId: string, bytesDone: number, totalBytes: number): void {
        const session = sessions.get(transferId);
        if (!session) {
            return;
        }
        let entry = progressTrackers.get(transferId);
        if (!entry) {
            entry = { tracker: createFilesProgressTracker(), lastEmitMs: 0 };
            progressTrackers.set(transferId, entry);
        }
        const now = Date.now();
        entry.tracker.update(bytesDone, now);
        const snapshot = entry.tracker.snapshot({
            transferId,
            totalBytes,
            // WHY: aggregate progress stub — batchIndex 0, batchCount = plan
            // length. Per-batch granularity lands with the chunk transport (W4).
            batchIndex: 0,
            batchCount: session.batchPlan.length,
        });
        session.progress = snapshot;
        if (session.phase !== "progress" && session.phase !== "done" && session.phase !== "cancel") {
            setPhase(session, "progress");
        }
        // WHY: throttle to <= 4Hz so receivers do not get a packet per chunk.
        if (sendPacket && shouldEmitProgress(entry.lastEmitMs, now, 4)) {
            entry.lastEmitMs = now;
            const packet = buildFilesProgressPacket(snapshot, {
                sender: senderId,
                destinations: session.destinations ?? [],
            });
            // WHY: progress is fire-and-forget; a sender rejection must not
            // throw the transport callback. The hub reports synchronously.
            try {
                const result = sendPacket(packet);
                if (result && typeof (result as Promise<void>).then === "function") {
                    (result as Promise<void>).catch(() => {
                        /* best-effort progress emit */
                    });
                }
            } catch {
                /* best-effort progress emit */
            }
        }
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

    function getIncomingOffer(transferId: string): FilesIncomingOffer | undefined {
        return incomingOffers.get(transferId);
    }

    /**
     * Inbound `files:offer` handler (desk). Parses the offer; in `manual`
     * acceptMode registers it and surfaces an Accept/Decline prompt; in `auto`
     * acceptMode accepts immediately. Malformed offers are dropped silently.
     * INVARIANT: never touches clipboard-hub — operates only through files
     * adapters (`sendPacket`, `getBlob`).
     */
    async function handleIncomingOffer(packet: CwspPacket): Promise<void> {
        const raw = (packet as { payload?: unknown }).payload;
        const offer = parseFilesOfferPayload(raw);
        if (!offer) {
            // WHY: a malformed offer must not throw into the caller (socket
            // handler / clipboard-hub boundary). Drop it silently.
            return;
        }
        const landingDir = path.join(landingRoot, offer.transferId);
        // WHY: create the landing dir up front so Accept can write directly.
        await mkdir(landingDir, { recursive: true });
        const incoming: FilesIncomingOffer = {
            transferId: offer.transferId,
            sender: offer.sender,
            destinations: offer.destinations ?? [],
            createdAt: offer.createdAt,
            expiresAt: offer.expiresAt,
            summary: { fileCount: offer.summary.fileCount, totalBytes: offer.summary.totalBytes },
            batches: offer.batches,
            landingDir,
        };
        incomingOffers.set(offer.transferId, incoming);
        if (acceptMode === "auto") {
            // WHY: auto mode skips the prompt and pulls immediately.
            await acceptIncomingOffer(offer.transferId);
            return;
        }
        emitFilesPrompt(buildAcceptPrompt(incoming));
    }

    /**
     * Emit `files:accept` and HTTP GET each `batch.asset.url` into the landing
     * dir. On any GET failure, emit `files:error`, dismiss the prompt, and
     * throw so the caller (UI / socket handler) can surface the failure.
     */
    async function acceptIncomingOffer(transferId: string): Promise<void> {
        const offer = incomingOffers.get(transferId);
        if (!offer) {
            throw new Error(`CWSP_FILES_INCOMING_NOT_FOUND:${transferId}`);
        }
        // WHY: accept addressed back to the remote sender so the endpoint routes
        // the reply correctly (routing by destination client id, not raw URL).
        const acceptPayload: FilesAcceptPayload = { transferId };
        const acceptPacket = buildFilesAcceptPacket({
            payload: acceptPayload,
            meta: {
                sender: senderId,
                destinations: [offer.sender],
            },
        });
        if (sendPacket) {
            await sendPacket(acceptPacket);
        }
        try {
            for (const batch of offer.batches) {
                const url = batch.asset.url;
                if (!url) {
                    throw new Error("CWSP_FILES_GET_NO_URL");
                }
                if (!getBlob) {
                    throw new Error("CWSP_FILES_GET_UNAVAILABLE");
                }
                const bytes = await getBlob(url);
                // SECURITY: sanitize the remote-supplied asset name. WHY: a
                // malicious or buggy sender could ship `../../etc/passwd` (or an
                // absolute path) as `batch.asset.name`; `path.basename` strips
                // every directory component. Reject empty results (e.g. a name
                // that was all separators) and fall back to the batchId so the
                // landing write always lands inside `landingDir`.
                const rawName = batch.asset.name ?? "";
                const baseName = path.basename(rawName);
                const name = baseName || `${batch.batchId}.bin`;
                const dest = path.join(offer.landingDir, name);
                // SECURITY: defense-in-depth — even after basename, verify the
                // resolved dest stays under landingDir (handles edge cases like
                // `..` surviving on weird inputs or symlinked landing roots).
                const rel = path.relative(offer.landingDir, dest);
                if (rel.startsWith("..") || path.isAbsolute(rel)) {
                    throw new Error(`CWSP_FILES_LANDING_ESCAPE:${name}`);
                }
                await writeFile(dest, bytes);
            }
            // WHY: success dismisses the prompt; the landing dir stays for the
            // user to move files out (desktop has no SAF).
            if (filesPrompt?.transferId === transferId) {
                emitFilesPrompt(null);
            }
            incomingOffers.delete(transferId);
        } catch (error) {
            // WHY: failure must not leave a lingering Accept/Decline prompt nor
            // a half-populated landing dir. Emit files:error, clean up, rethrow.
            const reason = error instanceof Error ? error.message : String(error);
            if (sendPacket) {
                const errorPacket = createCwspPacket({
                    op: "act",
                    what: FILES_WHAT_ERROR,
                    purpose: FILES_PURPOSE,
                    sender: senderId,
                    uuid: generateId(),
                    timestamp: Date.now(),
                    destinations: [offer.sender],
                    payload: { transferId, reason },
                });
                try {
                    await sendPacket(errorPacket);
                } catch {
                    /* best-effort — error path must not mask the original failure */
                }
            }
            if (filesPrompt?.transferId === transferId) {
                emitFilesPrompt(null);
            }
            incomingOffers.delete(transferId);
            // WHY: best-effort cleanup of the half-populated landing dir.
            try {
                await rm(offer.landingDir, { recursive: true, force: true });
            } catch {
                /* ignore fs errors on cleanup */
            }
            throw error;
        }
    }

    async function declineIncomingOffer(transferId: string): Promise<void> {
        const offer = incomingOffers.get(transferId);
        if (!offer) {
            return;
        }
        incomingOffers.delete(transferId);
        if (filesPrompt?.transferId === transferId) {
            emitFilesPrompt(null);
        }
        // WHY: best-effort cleanup of the empty landing dir created on offer.
        try {
            await rm(offer.landingDir, { recursive: true, force: true });
        } catch {
            /* ignore fs errors on cleanup */
        }
    }

    return {
        ingressLocalPaths,
        confirmOffer,
        offer,
        reportBytes,
        cancel,
        getSession,
        listSessions,
        onPhase,
        getFilesPromptState: () => filesPrompt,
        handleIncomingOffer,
        getIncomingOffer,
        acceptIncomingOffer,
        declineIncomingOffer,
    };
}
