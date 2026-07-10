/*
 * Filename: Timestamp.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/packet/Timestamp.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Provide a thin canonical epoch-ms timestamp for the web transport.
 *
 * NOTE: CWSP v2 timestamps are Unix epoch milliseconds. `Date.now()` is the canonical
 * source so packet timestamps stay transport-neutral and timezone-free.
 */

/**
 * Returns the current CWSP packet timestamp as Unix epoch milliseconds.
 */
export function nowCwspTimestamp(): number {
    return Date.now();
}
