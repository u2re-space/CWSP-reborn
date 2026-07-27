/*
 * Filename: files-progress.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/files-progress.ts
 * Change date and time: 14.20.00_21.07.2026
 * Reason for changes: Wave 1 Task 3 — EMA-smoothed transfer speed and ETA for
 * the files-transfer progress channel. Pure and stateful but side-effect free:
 * no timers, no I/O, no platform APIs. Callers feed `update(bytesDone, nowMs)`
 * from whatever clock they own (chunk ack, transport tick, etc.) and read
 * `snapshot()` to emit a `FilesProgressPayload`.
 */

import type { FilesProgressPayload } from "./files-types.ts";

export interface FilesProgressTracker {
    update(bytesDone: number, nowMs: number): void;
    snapshot(input: {
        transferId: string;
        totalBytes: number;
        batchIndex: number;
        batchCount: number;
    }): FilesProgressPayload;
}

/**
 * PERF: EMA over recent samples so UI speed does not jitter on every chunk.
 * `alpha` is the weight of the newest instantaneous sample; default 0.35 gives
 * an effective window of ~1.5s under steady 4Hz emit cadence. Higher alpha =
 * more responsive but noisier; lower = smoother but laggier.
 */
export function createFilesProgressTracker(alpha = 0.35): FilesProgressTracker {
    let bytesDone = 0;
    let lastMs = 0;
    let speedBps = 0;
    let hasSample = false;

    return {
        update(nextDone: number, nowMs: number) {
            // INVARIANT: only advance on a strictly later clock and non-decreasing
            // byte count. Equal or backward samples carry no speed information and
            // would otherwise produce Infinity/NaN or negative instantaneous speed.
            if (hasSample && nowMs > lastMs && nextDone >= bytesDone) {
                const dt = (nowMs - lastMs) / 1000;
                const inst = (nextDone - bytesDone) / dt;
                // First real sample seeds the EMA; subsequent samples blend.
                speedBps = speedBps > 0 ? alpha * inst + (1 - alpha) * speedBps : inst;
            }
            bytesDone = nextDone;
            lastMs = nowMs;
            hasSample = true;
        },
        snapshot(input) {
            const remaining = Math.max(0, input.totalBytes - bytesDone);
            // Below 1 Bps the ETA is meaningless; report null so UI shows
            // "calculating" rather than a multi-year countdown.
            const etaMs = speedBps > 1 ? Math.round((remaining / speedBps) * 1000) : null;
            return {
                transferId: input.transferId,
                bytesDone,
                totalBytes: input.totalBytes,
                batchIndex: input.batchIndex,
                batchCount: input.batchCount,
                speedBps: Math.round(speedBps),
                etaMs,
            };
        },
    };
}

/**
 * Throttle helper for progress emission. Keeps the wire at <= `maxHz` updates
 * per second so receivers do not get a packet per chunk. Pure: callers own the
 * `lastEmitMs` state.
 */
export function shouldEmitProgress(lastEmitMs: number, nowMs: number, maxHz = 4): boolean {
    const minGap = 1000 / maxHz;
    return nowMs - lastEmitMs >= minGap;
}
