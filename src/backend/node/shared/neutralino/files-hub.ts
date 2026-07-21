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
 *   2026-07-21 (W3 final review): sanitize `offer.transferId` before joining
 *   `landingRoot` — `path.basename` + UUID-safe allowlist + `path.relative`
 *   containment, mirroring the asset-name defense. WHY: `offer.transferId` is
 *   remote-supplied and only required to be a non-empty string by the parser;
 *   a malicious peer could ship `../../etc` and escape `landingRoot`. The
 *   canonical id is still used as the `incomingOffers` map key (routing /
 *   accept), so the sanitized segment only affects the on-disk landing path.
 *   2026-07-21 (boot hardening): switch `fflate` from a static import to a
 *   LAZY dynamic `import("fflate")` inside `materializeOne`. WHY: the
 *   portable Neutralino backend package only vendored clipboardy + ws, so the
 *   static `import "fflate"` crashed windows/index.ts / linux/index.ts with
 *   ERR_MODULE_NOT_FOUND and crash-looped :29110 (control + clipboard dead).
 *   A missing fflate now only fails zip/gzip packing at offer time, never
 *   boot. `strToU8` (unused) dropped alongside the static import.
 */

/** Allowlist for a safe path segment (UUID + a few harmless extras). */
const SAFE_SEGMENT_RE = /^[A-Za-z0-9._-]+$/;

/**
 * Sanitize a remote-supplied transferId for use as a landing dir segment.
 * WHY: `offer.transferId` arrives from a remote sender and the parser only
 * requires it to be a non-empty string. `path.basename` strips every
 * directory component; we then allowlist the charset and reject `.`/`..` so
 * the resolved landing dir cannot escape `landingRoot`. Falls back to a fresh
 * local UUID when the input is unsafe so the landing write always proceeds.
 * SECURITY: defense-in-depth alongside the `path.relative` containment check
 * performed by the caller.
 */
function sanitizeTransferIdSegment(raw: unknown, fallback: () => string): string {
    const base = path.basename(String(raw ?? ""));
    if (!base || base === "." || base === ".." || !SAFE_SEGMENT_RE.test(base)) {
        return fallback();
    }
    return base;
}

import { createHash, randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { readFile, stat, copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
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

/*
 * WHY: `fflate` (zipSync / gzipSync) is loaded LAZILY inside `materializeOne`
 *   so the module graph of windows/index.ts and linux/index.ts can load even
 *   when `fflate` is NOT installed in the portable backend package. A missing
 *   fflate must NOT kill control + clipboard boot — it only breaks zip/gzip
 *   batch packing, which throws a clear error at offer time. The static
 *   `import ... from "fflate"` previously crashed the whole backend with
 *   ERR_MODULE_NOT_FOUND on desks where the portable package omitted fflate.
 * COMPAT: keep the call sites identical (zipSync(entries) / gzipSync(raw)).
 */
type FflatePacker = {
    zipSync: (entries: Record<string, Uint8Array>) => Uint8Array;
    gzipSync: (data: Uint8Array) => Uint8Array;
    unzipSync: (data: Uint8Array) => Record<string, Uint8Array>;
    gunzipSync: (data: Uint8Array) => Uint8Array;
};
let fflatePromise: Promise<FflatePacker> | null = null;
async function loadFflatePacker(): Promise<FflatePacker> {
    if (fflatePromise) return fflatePromise;
    fflatePromise = (async () => {
        const mod = await import("fflate");
        return mod as unknown as FflatePacker;
    })();
    return fflatePromise;
}

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
    /**
     * Called after a successful Accept lands files under `landingDir`.
     * WHY (desk): Windows Neutralino can then CF_HDROP-copy paths for Paste /
     * re-forward when `shell.filesCopyOnReceive` is on (default).
     */
    onAcceptedLanding?: (info: {
        transferId: string;
        landingDir: string;
        paths: string[];
        sender: string;
    }) =>
        | void
        | { copied?: boolean }
        | Promise<void | { copied?: boolean }>;
}

/**
 * Input to the `putBlob` adapter. WHY: the hub owns batch bytes + compact
 * metadata; the adapter only transports them to the W2 blob endpoint.
 */
export interface FilesPutBlobInput {
    transferId: string;
    batchId: string;
    /** In-memory bytes for small/mid batches. Prefer filePath for GB files. */
    bytes?: Uint8Array;
    /** On-disk source for streaming put (multi-GB Neutralino copies). */
    filePath?: string;
    /** Declared size when using filePath. */
    size?: number;
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
    | "accept"
    /** Inbound transfer landed — notify + optional Copy (manual copy-on-receive). */
    | "ready";

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
    /**
     * Absolute landed file paths (kind === "ready"). WHY: toast Copy writes
     * CF_HDROP from these paths when `filesCopyOnReceive` is manual.
     */
    paths?: string[];
    /** Landing directory for the transfer (kind === "ready"). */
    landingDir?: string;
    /**
     * True when CF_HDROP was already written (auto copy-on-receive).
     * False → toast shows Copy; true → notify-only Dismiss.
     */
    copied?: boolean;
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
    /** Clear Accept/ready toast state (Dismiss / after Copy). */
    clearFilesPrompt(): void;
    /** Flip ready prompt to copied=true after manual CF_HDROP copy. */
    markReadyCopied(transferId: string): void;
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
    const onAcceptedLanding = options.onAcceptedLanding;
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

    /** Streaming SHA-256 — required for multi-GB staged files. */
    async function sha256HexFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = createHash("sha256");
            const stream = createReadStream(filePath);
            stream.on("data", (chunk) => hash.update(chunk));
            stream.on("error", reject);
            stream.on("end", () => resolve(hash.digest("hex")));
        });
    }

    /**
     * Stream a blob URL to disk (local files-blob open or HTTP fetch).
     * WHY: acceptIncomingOffer must not Buffer.alloc(GB).
     */
    async function streamBlobUrlToFile(
        url: string,
        dest: string,
        getBlobFn: (u: string) => Promise<Uint8Array>,
    ): Promise<void> {
        try {
            const u = new URL(url);
            const m = u.pathname.match(/\/service\/files-blob\/([^/]+)\/([^/]+)/);
            if (m) {
                // Local/same-process blob: copyFile when getFilesBlobOpen is available
                // via dynamic import (desk Accept of own/peer LAN URL).
                try {
                    const { getFilesBlobOpen } = await import("./files-blob-store.ts");
                    const token = u.searchParams.get("token") || "";
                    const meta = getFilesBlobOpen(
                        decodeURIComponent(m[1] || ""),
                        decodeURIComponent(m[2] || ""),
                        token,
                    );
                    if (meta?.filePath) {
                        await copyFile(meta.filePath, dest);
                        return;
                    }
                } catch {
                    /* fall through to HTTP */
                }
            }
        } catch {
            /* fall through */
        }
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`CWSP_FILES_HTTP_${res.status}`);
            if (res.body) {
                const { Readable } = await import("node:stream");
                await pipeline(
                    Readable.fromWeb(res.body as import("node:stream/web").ReadableStream),
                    createWriteStream(dest),
                );
                return;
            }
        } catch {
            /* last resort: getBlob (may OOM on GB — only if stream failed) */
        }
        const bytes = await getBlobFn(url);
        await writeFile(dest, bytes);
    }

    /**
     * Above this, Neutralino must not readFile into RAM — stream putBlob from disk.
     * WHY: stage limit is 8GiB; Node heap cannot hold gigabyte batches.
     */
    const HEAP_SAFE_MAX = 64 * 1024 * 1024;

    /**
     * Materialize one batch plan into bytes per `kind`.
     * WHY: zip multi-file small batches; raw single large files; compressed
     * attempts gzip and downgrades to raw when savings < COMPRESS_WORTHWHILE
     * (per the W1 packer contract). Large raw returns filePath only (no bytes).
     */
    async function materializeOne(
        session: FilesHubSession,
        plan: FilesPackerBatchPlan,
    ): Promise<{
        bytes?: Uint8Array;
        filePath?: string;
        size: number;
        kind: FilesBatchKind;
        ext: string;
        mimeType: string;
    }> {
        if (plan.kind === "zip") {
            const entries: Record<string, Uint8Array> = {};
            for (const f of plan.files) {
                const staged = session.files.find((sf) => sf.name === f.name);
                if (!staged) {
                    throw new Error(`CWSP_FILES_STAGE_MISS:${f.name}`);
                }
                entries[f.name] = new Uint8Array(await readFile(staged.stagedPath));
            }
            const { zipSync } = await loadFflatePacker();
            const bytes = zipSync(entries);
            return { bytes, size: bytes.length, kind: "zip", ext: "zip", mimeType: "application/zip" };
        }
        const member = plan.files[0];
        const staged = session.files.find((sf) => sf.name === member?.name);
        if (!staged) {
            throw new Error(`CWSP_FILES_STAGE_MISS:${member?.name ?? "?"}`);
        }
        const st = await stat(staged.stagedPath);
        let ext = path.extname(staged.name) || ".bin";
        if (ext.startsWith(".")) ext = ext.slice(1);
        if (!ext) ext = "bin";
        // WHY: packer marks ≥COMPRESS_TRY_MIN as "compressed", which previously
        // fell through to readFile+gzipSync. Node fs.readFile refuses >2 GiB
        // (ERR_FS_FILE_TOO_LARGE) — user saw ingress-failed on ~3.2 GB copies
        // with no files:offer on Cap. Any batch above HEAP_SAFE_MAX must stay
        // on disk as raw (no heap, no compress attempt).
        if (st.size > HEAP_SAFE_MAX) {
            return {
                filePath: staged.stagedPath,
                size: st.size,
                kind: "raw",
                ext,
                mimeType: "application/octet-stream",
            };
        }
        const raw = new Uint8Array(await readFile(staged.stagedPath));
        if (plan.kind === "compressed") {
            const { gzipSync } = await loadFflatePacker();
            const gz = gzipSync(raw);
            const saved = raw.length > 0 ? (raw.length - gz.length) / raw.length : 0;
            if (saved >= COMPRESS_WORTHWHILE) {
                return { bytes: gz, size: gz.length, kind: "compressed", ext: "gz", mimeType: "application/gzip" };
            }
            return { bytes: raw, size: raw.length, kind: "raw", ext, mimeType: "application/octet-stream" };
        }
        return { bytes: raw, size: raw.length, kind: "raw", ext, mimeType: "application/octet-stream" };
    }

    /**
     * Publish batch bytes via `putBlob`, or embed as `asset.data` (base64) for
     * small batches when PUT is unavailable/fails. Large batches with no
     * successful PUT surface `files:error` and cancel — no second blob server.
     */
    async function publishOrEmbed(
        session: FilesHubSession,
        batchId: string,
        materialized: {
            bytes?: Uint8Array;
            filePath?: string;
            size: number;
            kind: FilesBatchKind;
            ext: string;
            mimeType: string;
        },
    ): Promise<{ asset: FilesOfferPayload["batches"][number]["asset"]; error?: string }> {
        const hash = materialized.bytes
            ? sha256Hex(materialized.bytes)
            : materialized.filePath
              ? await sha256HexFile(materialized.filePath)
              : "";
        const idxMatch = /-(\d+)$/.exec(batchId);
        const planIdx = idxMatch ? Number(idxMatch[1]) : -1;
        const planFiles =
            planIdx >= 0 && planIdx < session.batchPlan.length
                ? session.batchPlan[planIdx]?.files
                : undefined;
        let name: string;
        if (materialized.kind === "zip") {
            name = `${session.transferId}-files.zip`;
        } else if (planFiles && planFiles.length === 1 && planFiles[0]?.name) {
            name = path.basename(planFiles[0].name) || `${batchId}.${materialized.ext}`;
        } else {
            name = `${batchId}.${materialized.ext}`;
        }
        const size = materialized.size;
        if (putBlob) {
            try {
                const result = await putBlob({
                    transferId: session.transferId,
                    batchId,
                    bytes: materialized.bytes,
                    filePath: materialized.filePath,
                    size,
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
        if (!materialized.bytes) {
            return {
                asset: {
                    hash,
                    name,
                    mimeType: materialized.mimeType,
                    size,
                    source: "url",
                },
                error: "CWSP_FILES_PUT_BLOB_UNAVAILABLE",
            };
        }
        // WHY: Cap↔Cap and Cap receive from desk need bytes on the wire before
        // W2 blob HTTP exists. Cap WS embed cap is 4MiB; keep Neutralino aligned.
        const WS_EMBED_MAX = 4 * 1024 * 1024;
        if (size <= SMALL_FILE_MAX || (size <= WS_EMBED_MAX && !putBlob)) {
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
        if (size <= WS_EMBED_MAX) {
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
                // WHY: GB files — prefer hardlink (instant) over full stage copy.
                // Cross-volume falls back to copyFile (same as putFilesBlobFromFile).
                try {
                    const { link } = await import("node:fs/promises");
                    await link(abs, stagedPath);
                } catch {
                    await copyFile(abs, stagedPath);
                }
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
            // WHY: Cap↔Cap Map.toString batches / truncated wire payloads used
            // to drop silently — desk never showed Ask Accept. Log so operators
            // re-share after Cap serialization fix.
            console.warn(JSON.stringify({
                channel: "cwsp-files-hub",
                event: "inbound-offer-parse-failed",
                sender: (packet as { sender?: string }).sender
                    ?? (packet as { byId?: string }).byId
                    ?? null,
                transferId: (raw && typeof raw === "object"
                    ? (raw as { transferId?: string }).transferId
                    : null) ?? null,
                batchesType: Array.isArray((raw as { batches?: unknown } | null)?.batches)
                    ? typeof (raw as { batches: unknown[] }).batches[0]
                    : typeof (raw as { batches?: unknown } | null)?.batches,
            }));
            return;
        }
        const landingDir = path.join(landingRoot, sanitizeTransferIdSegment(offer.transferId, generateId));
        // SECURITY: defense-in-depth — verify the resolved landing dir stays
        // under landingRoot (handles symlinked roots or a basename that still
        // resolves outside). A malformed transferId that escapes is dropped
        // silently rather than written outside landingRoot.
        const landingRel = path.relative(landingRoot, landingDir);
        if (landingRel.startsWith("..") || path.isAbsolute(landingRel)) {
            return;
        }
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
                const embedded = batch.asset.data;
                // SECURITY: sanitize the remote-supplied asset name first so
                // stream downloads can write directly to landing.
                const logical =
                    Array.isArray(batch.files) && batch.files.length > 0
                        ? String(batch.files[0]?.name || "").trim()
                        : "";
                const rawName = logical || batch.asset.name || "";
                const baseName = path.basename(rawName);
                const name = baseName || `${batch.batchId}.bin`;
                const dest = path.join(offer.landingDir, name);
                const rel = path.relative(offer.landingDir, dest);
                if (rel.startsWith("..") || path.isAbsolute(rel)) {
                    throw new Error(`CWSP_FILES_LANDING_ESCAPE:${name}`);
                }
                const kind = String(batch.kind || "raw");
                const declaredSize = Number(batch.asset.size) || 0;
                let bytes: Uint8Array | undefined;
                if (typeof embedded === "string" && embedded.length > 0) {
                    const raw = embedded.includes(",")
                        ? embedded.slice(embedded.indexOf(",") + 1)
                        : embedded;
                    bytes = Buffer.from(raw, "base64");
                } else if (url) {
                    if (!getBlob) {
                        throw new Error("CWSP_FILES_GET_UNAVAILABLE");
                    }
                    // WHY: GB HTTP pulls must stream to disk — getBlob loads RAM.
                    // Also stream when size unknown (0) — Cap may omit size early.
                    if (kind === "raw" && (declaredSize <= 0 || declaredSize > HEAP_SAFE_MAX)) {
                        await streamBlobUrlToFile(url, dest, getBlob);
                        continue;
                    }
                    bytes = await getBlob(url);
                } else {
                    throw new Error("CWSP_FILES_GET_NO_URL");
                }
                if (kind === "zip") {
                    const { unzipSync } = await loadFflatePacker();
                    const unzipped = unzipSync(bytes!);
                    for (const [entryName, entryBytes] of Object.entries(unzipped)) {
                        const safe = path.basename(entryName) || "file.bin";
                        const entryDest = path.join(offer.landingDir, safe);
                        const entryRel = path.relative(offer.landingDir, entryDest);
                        if (entryRel.startsWith("..") || path.isAbsolute(entryRel)) continue;
                        await writeFile(entryDest, entryBytes);
                    }
                } else if (kind === "compressed") {
                    const { gunzipSync } = await loadFflatePacker();
                    const rawBytes = gunzipSync(bytes!);
                    const outName = name.replace(/\.gz$/i, "") || `${batch.batchId}.bin`;
                    await writeFile(path.join(offer.landingDir, path.basename(outName)), rawBytes);
                } else {
                    await writeFile(dest, bytes!);
                }
            }
            // WHY: do not emit null before ready — toast would empty-poll-exit
            // before the "Files ready" prompt is published.
            incomingOffers.delete(transferId);
            // WHY: collect landed paths for CF_HDROP copy / re-forward hooks.
            let landed: string[] = [];
            try {
                const { readdir, stat } = await import("node:fs/promises");
                const names = await readdir(offer.landingDir);
                for (const n of names) {
                    const p = path.join(offer.landingDir, n);
                    try {
                        if ((await stat(p)).isFile()) landed.push(p);
                    } catch {
                        /* skip */
                    }
                }
            } catch {
                landed = [];
            }
            let copied = false;
            if (onAcceptedLanding) {
                try {
                    const result = await onAcceptedLanding({
                        transferId,
                        landingDir: offer.landingDir,
                        paths: landed,
                        sender: offer.sender,
                    });
                    if (result && typeof result === "object" && "copied" in result) {
                        copied = Boolean((result as { copied?: boolean }).copied);
                    } else {
                        // Legacy void callback — treat as auto-copied when paths exist.
                        copied = landed.length > 0;
                    }
                } catch {
                    /* best-effort desk clipboard copy — Accept already succeeded */
                }
            }
            emitFilesPrompt({
                id: transferId,
                transferId,
                kind: "ready",
                fileCount: landed.length || offer.summary.fileCount,
                totalBytes: offer.summary.totalBytes,
                destinations: offer.destinations,
                sender: offer.sender,
                paths: landed,
                landingDir: offer.landingDir,
                copied,
            });
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
        clearFilesPrompt: () => {
            emitFilesPrompt(null);
        },
        markReadyCopied: (transferId: string) => {
            if (
                filesPrompt &&
                filesPrompt.kind === "ready" &&
                filesPrompt.transferId === transferId
            ) {
                emitFilesPrompt({ ...filesPrompt, copied: true });
            }
        },
        handleIncomingOffer,
        getIncomingOffer,
        acceptIncomingOffer,
        declineIncomingOffer,
    };
}
