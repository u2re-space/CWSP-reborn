/*
 * Filename: UUID.ts
 * FullPath: apps/CWSP-reborn/src/protocol/node/packet/UUID.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Provide a thin canonical UUID generator for the NodeJS endpoint.
 *
 * NOTE: Uses the global `crypto.randomUUID()` available in Node 19+ and browsers.
 * No external dependency; keeps packet identity single-source.
 */

/**
 * Returns a fresh canonical v4 UUID string for a CWSP packet.
 * Falls back to a manual RFC4122 v4 generator if `crypto.randomUUID`
 * is unavailable (very old runtimes).
 */
export function newCwspUuid(): string {
    const c = globalThis.crypto as Crypto | undefined;
    if (c && typeof c.randomUUID === "function") {
        return c.randomUUID();
    }
    // COMPAT: manual v4 fallback for runtimes without crypto.randomUUID.
    const bytes = new Uint8Array(16);
    if (c && typeof c.getRandomValues === "function") {
        c.getRandomValues(bytes);
    } else {
        for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
