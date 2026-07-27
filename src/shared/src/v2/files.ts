/*
 * Filename: files.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/files.ts
 * Change date and time: 14.22.00_21.07.2026
 * Reason for changes: Wave 1 Task 4 — build/parse the `files:*` offer/accept/
 * chunk/progress packets on top of `createCwspPacket` + `normalizeDataAssetEnvelope`.
 * Pure and side-effect free except for uuid/timestamp generation in the builders
 * when callers omit them. No transport, no I/O, no platform drivers.
 */

import { createCwspPacket } from "./packet.ts";
import { normalizeDataAssetEnvelope } from "./validation.ts";
import {
    CHUNK_MAX,
    FILES_PURPOSE,
    FILES_WHAT_ACCEPT,
    FILES_WHAT_CHUNK,
    FILES_WHAT_OFFER,
    FILES_WHAT_PROGRESS,
} from "./files-constants.ts";
import type { CwspPacket } from "./types.ts";
import type {
    ByteTransport,
    FilesAcceptPayload,
    FilesBatchDescriptor,
    FilesBatchKind,
    FilesChunkPayload,
    FilesLogicalFile,
    FilesOfferPayload,
    FilesProgressPayload,
} from "./files-types.ts";

// ---------------------------------------------------------------------------
// Shared validation helpers
// ---------------------------------------------------------------------------

// Isomorphic UUID generation. WHY: prefer the Web Crypto global (available in
// browsers, modern Node, and workers) so this module stays transport-agnostic
// and free of `node:` imports. The fallback is only for legacy Node runtimes
// that did not expose `globalThis.crypto`; prefer the global first.
function generateUuid(): string {
    const crypto = (globalThis as { crypto?: Crypto }).crypto;
    if (crypto && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    // Fallback: RFC4122 v4-ish UUID without global crypto. COMPAT: legacy Node.
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
        .slice(6, 8)
        .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeInt(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

const BATCH_KINDS = new Set<FilesBatchKind>(["zip", "raw", "compressed"]);
const BYTE_TRANSPORTS = new Set<ByteTransport>(["http", "ws", "auto"]);
const CHUNK_ENCODINGS = new Set<FilesChunkPayload["encoding"]>([
    "base64",
    "binary-frame",
]);

function normalizeLogicalFile(value: unknown): FilesLogicalFile | undefined {
    if (!isRecord(value) || !isNonEmptyString(value.name)) {
        return undefined;
    }
    const size = value.size;
    if (!isNonNegativeInt(size)) {
        return undefined;
    }
    const file: FilesLogicalFile = { name: value.name, size };
    if (isNonEmptyString(value.hash)) {
        file.hash = value.hash;
    }
    return file;
}

function normalizeBatchDescriptor(value: unknown): FilesBatchDescriptor | undefined {
    if (!isRecord(value)) {
        return undefined;
    }
    if (
        !isNonEmptyString(value.batchId)
        || !isNonNegativeInt(value.index)
        || !isNonNegativeInt(value.count)
        || typeof value.kind !== "string"
        || !BATCH_KINDS.has(value.kind as FilesBatchKind)
    ) {
        return undefined;
    }
    const asset = normalizeDataAssetEnvelope(value.asset);
    if (!asset) {
        return undefined;
    }
    if (!Array.isArray(value.files)) {
        return undefined;
    }
    const files: FilesLogicalFile[] = [];
    for (const candidate of value.files) {
        const file = normalizeLogicalFile(candidate);
        if (!file) {
            return undefined;
        }
        files.push(file);
    }
    return {
        batchId: value.batchId,
        index: value.index,
        count: value.count,
        kind: value.kind as FilesBatchKind,
        asset,
        files,
    };
}

function normalizeStringList(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) {
        return undefined;
    }
    const result: string[] = [];
    for (const candidate of value) {
        if (isNonEmptyString(candidate)) {
            result.push(candidate);
        }
    }
    return result.length > 0 ? result : undefined;
}

// ---------------------------------------------------------------------------
// Offer
// ---------------------------------------------------------------------------

/**
 * Parses an untrusted `files:offer` payload. Returns `undefined` for any shape
 * that is not a valid offer; unknown fields are ignored. INVARIANT: each batch
 * `asset` is canonicalized through `normalizeDataAssetEnvelope`.
 */
export function parseFilesOfferPayload(
    value: unknown,
): FilesOfferPayload | undefined {
    if (!isRecord(value)) {
        return undefined;
    }
    if (
        !isNonEmptyString(value.transferId)
        || !isNonEmptyString(value.sender)
        || !isNonNegativeInt(value.createdAt)
        || !isNonNegativeInt(value.expiresAt)
        || value.expiresAt < value.createdAt
    ) {
        return undefined;
    }
    const summary = value.summary;
    if (
        !isRecord(summary)
        || !isNonNegativeInt(summary.fileCount)
        || !isNonNegativeInt(summary.totalBytes)
    ) {
        return undefined;
    }
    if (!Array.isArray(value.batches)) {
        return undefined;
    }
    const batches: FilesBatchDescriptor[] = [];
    for (const candidate of value.batches) {
        const batch = normalizeBatchDescriptor(candidate);
        if (!batch) {
            return undefined;
        }
        batches.push(batch);
    }

    const payload: FilesOfferPayload = {
        transferId: value.transferId,
        sender: value.sender,
        createdAt: value.createdAt,
        expiresAt: value.expiresAt,
        summary: {
            fileCount: summary.fileCount,
            totalBytes: summary.totalBytes,
        },
        batches,
    };
    if (isNonEmptyString(summary.label)) {
        payload.summary.label = summary.label;
    }
    const destinations = normalizeStringList(value.destinations);
    if (destinations) {
        payload.destinations = destinations;
    }
    if (isRecord(value.flags)) {
        const flags: FilesOfferPayload["flags"] = {};
        if (value.flags.openForShare === true) {
            flags.openForShare = true;
        }
        if (value.flags.autoAcceptHint === true) {
            flags.autoAcceptHint = true;
        }
        if (Object.keys(flags).length > 0) {
            payload.flags = flags;
        }
    }
    if (
        typeof value.byteTransportHint === "string"
        && BYTE_TRANSPORTS.has(value.byteTransportHint as ByteTransport)
    ) {
        payload.byteTransportHint = value.byteTransportHint as ByteTransport;
    }
    return payload;
}

/**
 * Canonicalizes a caller-owned offer into the exact payload placed on the wire.
 * Re-validates batches/assets so builders and parsers share one code path.
 */
function toFilesOfferPayload(input: FilesOfferPayload): FilesOfferPayload | undefined {
    return parseFilesOfferPayload({
        ...input,
        batches: input.batches.map((batch) => ({
            ...batch,
            asset: batch.asset,
            files: batch.files,
        })),
    });
}

export interface BuildFilesOfferInput extends FilesOfferPayload {
    uuid?: string;
    timestamp?: number;
    nodes?: string[];
}

/**
 * Builds a canonical `files:offer` packet. Generates `uuid`/`timestamp` when
 * omitted. WHY: explicit `purpose: FILES_PURPOSE` ("storage") is required so
 * the packet is not normalized to `general` before Task 5 lands.
 */
export function buildFilesOfferPacket(input: BuildFilesOfferInput): CwspPacket {
    const payload = toFilesOfferPayload(input);
    if (!payload) {
        throw new TypeError("Invalid files:offer payload");
    }
    return createCwspPacket({
        op: "act",
        what: FILES_WHAT_OFFER,
        purpose: FILES_PURPOSE,
        sender: input.sender,
        uuid: isNonEmptyString(input.uuid) ? input.uuid! : generateUuid(),
        timestamp:
            isNonNegativeInt(input.timestamp) ? input.timestamp! : Date.now(),
        // WHY: stamp both — some gateways/peers route on `nodes`, clipboard path uses both.
        destinations: input.destinations ?? input.nodes,
        nodes: input.nodes ?? input.destinations,
        payload,
    });
}

// ---------------------------------------------------------------------------
// Accept
// ---------------------------------------------------------------------------

export function parseFilesAcceptPayload(
    value: unknown,
): FilesAcceptPayload | undefined {
    if (!isRecord(value) || !isNonEmptyString(value.transferId)) {
        return undefined;
    }
    const payload: FilesAcceptPayload = { transferId: value.transferId };
    if (
        typeof value.byteTransport === "string"
        && BYTE_TRANSPORTS.has(value.byteTransport as ByteTransport)
    ) {
        payload.byteTransport = value.byteTransport as ByteTransport;
    }
    return payload;
}

export interface BuildFilesAcceptInput {
    payload: FilesAcceptPayload;
    meta: {
        sender: string;
        uuid?: string;
        timestamp?: number;
        destinations?: string[];
        nodes?: string[];
    };
}

export function buildFilesAcceptPacket(input: BuildFilesAcceptInput): CwspPacket {
    const payload = parseFilesAcceptPayload(input.payload);
    if (!payload) {
        throw new TypeError("Invalid files:accept payload");
    }
    return createCwspPacket({
        op: "act",
        what: FILES_WHAT_ACCEPT,
        purpose: FILES_PURPOSE,
        sender: input.meta.sender,
        uuid: isNonEmptyString(input.meta.uuid) ? input.meta.uuid! : generateUuid(),
        timestamp: isNonNegativeInt(input.meta.timestamp)
            ? input.meta.timestamp!
            : Date.now(),
        destinations: input.meta.destinations ?? input.meta.nodes,
        payload,
    });
}

// ---------------------------------------------------------------------------
// Chunk
// ---------------------------------------------------------------------------

/**
 * Parses an untrusted `files:chunk` payload. Rejects chunks whose `size`
 * exceeds `CHUNK_MAX` so a malformed peer cannot push an oversized frame.
 */
export function parseFilesChunkPayload(
    value: unknown,
): FilesChunkPayload | undefined {
    if (!isRecord(value)) {
        return undefined;
    }
    if (
        !isNonEmptyString(value.transferId)
        || !isNonEmptyString(value.batchId)
        || !isNonNegativeInt(value.chunkIndex)
        || !isNonNegativeInt(value.chunkCount)
        || !isNonNegativeInt(value.offset)
        || !isNonNegativeInt(value.size)
        || typeof value.encoding !== "string"
        || !CHUNK_ENCODINGS.has(value.encoding as FilesChunkPayload["encoding"])
    ) {
        return undefined;
    }
    // INVARIANT: a chunk larger than CHUNK_MAX must never be accepted on the wire.
    if (value.size > CHUNK_MAX) {
        return undefined;
    }
    const payload: FilesChunkPayload = {
        transferId: value.transferId,
        batchId: value.batchId,
        chunkIndex: value.chunkIndex,
        chunkCount: value.chunkCount,
        offset: value.offset,
        size: value.size,
        encoding: value.encoding as FilesChunkPayload["encoding"],
    };
    if (isNonEmptyString(value.hash)) {
        payload.hash = value.hash;
    }
    if (typeof value.data === "string") {
        payload.data = value.data;
    }
    return payload;
}

export interface BuildFilesChunkInput extends FilesChunkPayload {
    sender: string;
    uuid?: string;
    timestamp?: number;
    destinations?: string[];
    nodes?: string[];
}

export function buildFilesChunkPacket(input: BuildFilesChunkInput): CwspPacket {
    const payload = parseFilesChunkPayload({
        transferId: input.transferId,
        batchId: input.batchId,
        chunkIndex: input.chunkIndex,
        chunkCount: input.chunkCount,
        offset: input.offset,
        size: input.size,
        encoding: input.encoding,
        hash: input.hash,
        data: input.data,
    });
    if (!payload) {
        throw new TypeError("Invalid files:chunk payload");
    }
    return createCwspPacket({
        op: "act",
        what: FILES_WHAT_CHUNK,
        purpose: FILES_PURPOSE,
        sender: input.sender,
        uuid: isNonEmptyString(input.uuid) ? input.uuid! : generateUuid(),
        timestamp: isNonNegativeInt(input.timestamp)
            ? input.timestamp!
            : Date.now(),
        destinations: input.destinations ?? input.nodes,
        payload,
    });
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export function parseFilesProgressPayload(
    value: unknown,
): FilesProgressPayload | undefined {
    if (!isRecord(value)) {
        return undefined;
    }
    if (
        !isNonEmptyString(value.transferId)
        || !isNonNegativeInt(value.bytesDone)
        || !isNonNegativeInt(value.totalBytes)
        || !isNonNegativeInt(value.batchIndex)
        || !isNonNegativeInt(value.batchCount)
        || !isNonNegativeInt(value.speedBps)
    ) {
        return undefined;
    }
    // etaMs is either null or a non-negative integer; anything else is invalid.
    let etaMs: number | null;
    if (value.etaMs === null) {
        etaMs = null;
    } else if (isNonNegativeInt(value.etaMs)) {
        etaMs = value.etaMs as number;
    } else {
        return undefined;
    }
    return {
        transferId: value.transferId,
        bytesDone: value.bytesDone,
        totalBytes: value.totalBytes,
        batchIndex: value.batchIndex,
        batchCount: value.batchCount,
        speedBps: value.speedBps,
        etaMs,
    };
}

export interface BuildFilesProgressMeta {
    sender: string;
    uuid?: string;
    timestamp?: number;
    destinations?: string[];
    nodes?: string[];
}

export function buildFilesProgressPacket(
    payload: FilesProgressPayload,
    meta: BuildFilesProgressMeta,
): CwspPacket {
    const normalized = parseFilesProgressPayload(payload);
    if (!normalized) {
        throw new TypeError("Invalid files:progress payload");
    }
    return createCwspPacket({
        op: "act",
        what: FILES_WHAT_PROGRESS,
        purpose: FILES_PURPOSE,
        sender: meta.sender,
        uuid: isNonEmptyString(meta.uuid) ? meta.uuid! : generateUuid(),
        timestamp: isNonNegativeInt(meta.timestamp)
            ? meta.timestamp!
            : Date.now(),
        destinations: meta.destinations ?? meta.nodes,
        payload: normalized,
    });
}

// ---------------------------------------------------------------------------
// Byte-transport choice
// ---------------------------------------------------------------------------

/**
 * Resolves the byte transport for a batch. `http`/`ws` are forced hints. `auto`
 * prefers `http` only when the receiver is HTTP-reachable AND the batch fits in
 * a single chunk (`batchSize <= CHUNK_MAX`); otherwise it falls back to `ws`.
 */
export function chooseByteTransport(
    hint: ByteTransport,
    batchSize: number,
    httpReachable: boolean,
): "http" | "ws" {
    if (hint === "http") {
        return "http";
    }
    if (hint === "ws") {
        return "ws";
    }
    // hint === "auto"
    return httpReachable && batchSize <= CHUNK_MAX ? "http" : "ws";
}
