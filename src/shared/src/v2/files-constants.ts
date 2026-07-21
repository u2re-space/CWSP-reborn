/*
 * Filename: files-constants.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/files-constants.ts
 * Change date and time: 14.14.00_21.07.2026
 * Reason for changes: Wave 1 — establish the files-transfer size thresholds and
 * the canonical `files:*` action surface shared by packer, transport, and
 * receiver implementations across Neutralino/Android/endpoint.
 */

// Size thresholds (bytes). INVARIANT: keep these in sync with the design doc;
// later waves branch on these to choose zip vs raw vs compressed batches.
export const SMALL_FILE_MAX = 500 * 1024;
export const ZIP_BATCH_MAX = 8 * 1024 * 1024;
export const RAW_FILE_MIN = 8 * 1024 * 1024 + 1;
export const COMPRESS_TRY_MIN = 12 * 1024 * 1024 + 1;
export const COMPRESS_WORTHWHILE = 0.1;
export const CHUNK_MAX = 16 * 1024 * 1024;
export const PROGRESS_EMIT_MAX_HZ = 4;
export const OFFER_TTL_MS_DEFAULT = 15 * 60 * 1000;

// Canonical `files:*` action names. These are stable contract names (see
// network.mdc "Stable Action Names" precedent); do not rename without a
// migration reason.
export const FILES_WHAT_OFFER = "files:offer";
export const FILES_WHAT_ACCEPT = "files:accept";
export const FILES_WHAT_DECLINE = "files:decline";
export const FILES_WHAT_CHUNK = "files:chunk";
export const FILES_WHAT_CHUNK_ACK = "files:chunk-ack";
export const FILES_WHAT_PROGRESS = "files:progress";
export const FILES_WHAT_DONE = "files:done";
export const FILES_WHAT_ERROR = "files:error";

// Canonical `purpose` value for files-transfer packets. INVARIANT: must stay in
// sync with the CWSP v2 `purpose` enum (see network.mdc "Canonical Envelope" —
// `purpose: "... | storage | ..."`). Files-transfer reuses the `storage`
// purpose rather than introducing a new one, so downstream `inferCwspPurpose`
// (Task 5) can resolve `files:*` actions to this constant.
export const FILES_PURPOSE = "storage" as const;

export const FILES_ACTIONS = [
    FILES_WHAT_OFFER,
    FILES_WHAT_ACCEPT,
    FILES_WHAT_DECLINE,
    FILES_WHAT_CHUNK,
    FILES_WHAT_CHUNK_ACK,
    FILES_WHAT_PROGRESS,
    FILES_WHAT_DONE,
    FILES_WHAT_ERROR,
] as const;

// Files-hub stage limits. INVARIANT: keep in sync with the design doc; the hub
// refuses to stage more than FILES_STAGE_MAX_COUNT files or more than
// FILES_STAGE_MAX_BYTES total bytes before offering. Shared by all shells
// (Neutralino/Android/endpoint) so the policy is isomorphic across surfaces.
export const FILES_STAGE_MAX_COUNT = 64;
export const FILES_STAGE_MAX_BYTES = 512 * 1024 * 1024;
