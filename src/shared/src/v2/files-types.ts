/*
 * Filename: files-types.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/files-types.ts
 * Change date and time: 14.14.00_21.07.2026
 * Reason for changes: Wave 1 — transport-neutral types for the files-transfer
 * offer/chunk/progress protocol. No filesystem or platform APIs here; packer
 * input is sizes-only so the contract stays isomorphic.
 */

import type { DataAssetEnvelope } from "./types.ts";

// ByteTransport is a hint, not a hard selection. `auto` lets the receiver pick
// between streaming (`ws`) and bulk (`http`) based on its own policy.
export type ByteTransport = "http" | "ws" | "auto";
export type FilesBatchKind = "zip" | "raw" | "compressed";

// Logical file descriptor carried inside a batch. `hash` is optional at offer
// time and required once a batch asset is materialized.
export interface FilesLogicalFile {
    name: string;
    size: number;
    hash?: string;
}

// One materialized batch in an offer. `asset` is the DataAsset envelope for the
// batch payload (zip blob, raw file, or compressed stream).
export interface FilesBatchDescriptor {
    batchId: string;
    index: number;
    count: number;
    kind: FilesBatchKind;
    asset: DataAssetEnvelope;
    files: FilesLogicalFile[];
}

// Offer payload sent by the sender. `expiresAt` bounds how long the receiver
// may accept; `batches` is the full plan (no lazy fetch in Wave 1).
export interface FilesOfferPayload {
    transferId: string;
    sender: string;
    destinations?: string[];
    createdAt: number;
    expiresAt: number;
    summary: { fileCount: number; totalBytes: number; label?: string };
    batches: FilesBatchDescriptor[];
    flags?: { openForShare?: boolean; autoAcceptHint?: boolean };
    byteTransportHint?: ByteTransport;
}

export interface FilesAcceptPayload {
    transferId: string;
    byteTransport?: ByteTransport;
}

// One chunk of a batch. `encoding` distinguishes base64 (text-safe over ws/json)
// from `binary-frame` (raw bytes over a binary-capable transport).
export interface FilesChunkPayload {
    transferId: string;
    batchId: string;
    chunkIndex: number;
    chunkCount: number;
    offset: number;
    size: number;
    hash?: string;
    encoding: "base64" | "binary-frame";
    data?: string;
}

export interface FilesProgressPayload {
    transferId: string;
    bytesDone: number;
    totalBytes: number;
    batchIndex: number;
    batchCount: number;
    speedBps: number;
    etaMs: number | null;
}

/** Packer input — sizes only; no filesystem. */
export interface FilesPackerInputFile {
    name: string;
    size: number;
}

export interface FilesPackerBatchPlan {
    kind: FilesBatchKind;
    files: FilesPackerInputFile[];
    /** Uncompressed sum of member sizes (planning aid). */
    totalUncompressed: number;
}

// Files-hub ingress source. Identifies how files entered the hub so the offer
// decision can apply hybrid rules (open-with / share-target are pre-addressed;
// clipboard / picker require explicit Open-for-Share intent).
export type FilesIngressSource = "clipboard" | "open-with" | "share-target" | "picker";

// Files-hub lifecycle phase. `staged` → `readyToOffer` | `needDestinations`
// (decided by `decideOfferAfterStage`), then `offering` → `progress` → `done`
// or `cancel`. Kept transport-neutral; shells own the UI transitions.
export type FilesHubPhase =
    | "staged"
    | "readyToOffer"
    | "needDestinations"
    | "offering"
    | "progress"
    | "done"
    | "cancel";

// Result of `assertStageLimits`. On failure, `reason` distinguishes which
// threshold was breached so the hub can surface a precise error.
export type FilesStageLimitsResult =
    | { ok: true }
    | { ok: false; reason: "count" | "bytes"; count: number; totalBytes: number };

// Input to `decideOfferAfterStage`. `openForShare` reflects the user's intent
// for clipboard/picker sources; ignored for open-with/share-target (hybrid).
export interface FilesOfferStageInput {
    source: FilesIngressSource;
    defaultDestinations: string[];
    openForShare: "manual" | "auto";
}

// Result of `decideOfferAfterStage`. `destinations` is present only on
// `readyToOffer` so the hub can immediately seed the offer payload.
export type FilesOfferStageResult =
    | { phase: "readyToOffer"; destinations: string[] }
    | { phase: "needDestinations" };
