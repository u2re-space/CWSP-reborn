/*
 * Filename: files-packer.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/files-packer.ts
 * Change date and time: 14.18.00_21.07.2026
 * Reason for changes: Wave 1 Task 2 — pure packing policy that turns logical
 * file sizes into a batch plan (zip / raw / compressed). No filesystem or
 * platform APIs here; platform adapters only execute the plan. Keeps the
 * policy isomorphic across Neutralino/Android/endpoint.
 */

import {
    CHUNK_MAX,
    COMPRESS_TRY_MIN,
    COMPRESS_WORTHWHILE,
    RAW_FILE_MIN,
    SMALL_FILE_MAX,
    ZIP_BATCH_MAX,
} from "./files-constants.ts";
import type { FilesPackerBatchPlan, FilesPackerInputFile } from "./files-types.ts";

/**
 * Pure packing plan from logical file sizes.
 * WHY: platform adapters only execute zip/compress/IO; policy stays shared.
 * NOTE: kind "compressed" means "attempt compress at execute time"; if savings
 * < COMPRESS_WORTHWHILE, the platform must downgrade that batch to "raw".
 */
export function planFilesBatches(files: readonly FilesPackerInputFile[]): FilesPackerBatchPlan[] {
    const small: FilesPackerInputFile[] = [];
    const large: FilesPackerBatchPlan[] = [];

    for (const file of files) {
        if (!file?.name || !Number.isFinite(file.size) || file.size < 0) {
            throw new Error("CWSP_FILES_PACKER_INVALID_FILE");
        }
        if (file.size >= COMPRESS_TRY_MIN) {
            large.push({ kind: "compressed", files: [file], totalUncompressed: file.size });
        } else if (file.size >= RAW_FILE_MIN) {
            large.push({ kind: "raw", files: [file], totalUncompressed: file.size });
        } else if (file.size <= SMALL_FILE_MAX) {
            small.push(file);
        } else {
            // Between SMALL_FILE_MAX and RAW_FILE_MIN: still zip-candidate alone or with room.
            small.push(file);
        }
    }

    const zipBatches: FilesPackerBatchPlan[] = [];
    let current: FilesPackerInputFile[] = [];
    let currentSum = 0;
    for (const file of small) {
        if (current.length > 0 && currentSum + file.size > ZIP_BATCH_MAX) {
            zipBatches.push({ kind: "zip", files: current, totalUncompressed: currentSum });
            current = [];
            currentSum = 0;
        }
        if (file.size > ZIP_BATCH_MAX) {
            // Single member larger than zip cap but below RAW_FILE_MIN → solo zip/raw-ish zip batch.
            zipBatches.push({ kind: "zip", files: [file], totalUncompressed: file.size });
            continue;
        }
        current.push(file);
        currentSum += file.size;
    }
    if (current.length) {
        zipBatches.push({ kind: "zip", files: current, totalUncompressed: currentSum });
    }

    return [...zipBatches, ...large];
}

/** After real compress: keep compressed only if ratio saved ≥ COMPRESS_WORTHWHILE. */
export function resolveCompressKind(
    originalSize: number,
    compressedSize: number,
): "compressed" | "raw" {
    if (originalSize <= 0) return "raw";
    const saved = (originalSize - compressedSize) / originalSize;
    return saved >= COMPRESS_WORTHWHILE ? "compressed" : "raw";
}

export function planChunkCount(batchByteSize: number, chunkMax: number = CHUNK_MAX): number {
    if (batchByteSize <= 0) return 0;
    return Math.ceil(batchByteSize / chunkMax);
}
