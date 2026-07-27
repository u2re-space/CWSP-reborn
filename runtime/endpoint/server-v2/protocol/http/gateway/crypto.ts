/*
 * Filename: crypto.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/gateway/crypto.ts
 * Change date and time: 13.42.00_17.07.2026
 * Reason for changes: Add salted scrypt credentials for the human gateway UI.
 */

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const DERIVED_KEY_BYTES = 32;
const SALT_BYTES = 16;
const MAX_MEMORY_BYTES = 32 * 1024 * 1024;

const encode = (value: Uint8Array): string => Buffer.from(value).toString("base64url");

const decode = (value: string): Buffer => Buffer.from(value, "base64url");

const derive = async (value: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        scryptCallback(
            value,
            salt,
            DERIVED_KEY_BYTES,
            {
                N: n,
                r,
                p,
                maxmem: MAX_MEMORY_BYTES
            },
            (error, derived) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(Buffer.from(derived));
            }
        );
    });
};

export const createScryptHash = async (value: string): Promise<string> => {
    const salt = randomBytes(SALT_BYTES);
    const derived = await derive(String(value), salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);
    return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${encode(salt)}$${encode(derived)}`;
};

export const verifyScryptHash = async (value: string, encoded: string): Promise<boolean> => {
    const parts = String(encoded || "").split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;

    const n = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    if (![n, r, p].every((part) => Number.isInteger(part) && part > 0)) return false;

    try {
        const salt = decode(parts[4]);
        const expected = decode(parts[5]);
        if (!salt.length || expected.length !== DERIVED_KEY_BYTES) return false;
        const actual = await derive(String(value), salt, n, r, p);
        return actual.length === expected.length && timingSafeEqual(actual, expected);
    } catch {
        return false;
    }
};

