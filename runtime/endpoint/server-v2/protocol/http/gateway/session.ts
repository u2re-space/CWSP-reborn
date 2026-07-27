/*
 * Filename: session.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/gateway/session.ts
 * Change date and time: 13.45.00_17.07.2026
 * Reason for changes: Keep opaque, revocable human gateway sessions server-side
 *   while exposing only safe expiry metadata to the browser.
 */

import { randomBytes } from "node:crypto";

import type { GatewaySourceClass } from "./config.ts";

export type GatewaySession = {
    token: string;
    sourceClass: GatewaySourceClass;
    expiresAt: number;
};

export type GatewaySessionStoreOptions = {
    idleMs: number;
    absoluteMs: number;
    rememberMs: number;
};

type SessionRecord = GatewaySession & {
    createdAt: number;
    lastSeenAt: number;
    remember: boolean;
};

const createToken = (): string => randomBytes(32).toString("base64url");

export const createGatewaySessionStore = (
    options: GatewaySessionStoreOptions,
    now: () => number = Date.now
) => {
    const sessions = new Map<string, SessionRecord>();

    const effectiveExpiry = (record: SessionRecord, timestamp: number): number => {
        const idleLimit = record.remember ? options.rememberMs : options.idleMs;
        return Math.min(timestamp + idleLimit, record.createdAt + options.absoluteMs);
    };

    const removeIfExpired = (record: SessionRecord, timestamp: number): boolean => {
        const absoluteExpiry = record.createdAt + options.absoluteMs;
        const idleExpiry = record.lastSeenAt + (record.remember ? options.rememberMs : options.idleMs);
        if (timestamp >= absoluteExpiry || timestamp >= idleExpiry) {
            sessions.delete(record.token);
            return true;
        }
        return false;
    };

    return {
        issue(sourceClass: GatewaySourceClass, remember: boolean): GatewaySession {
            const timestamp = now();
            let token = createToken();
            while (sessions.has(token)) token = createToken();
            const record: SessionRecord = {
                token,
                sourceClass,
                remember,
                createdAt: timestamp,
                lastSeenAt: timestamp,
                expiresAt: effectiveExpiry(
                    {
                        token,
                        sourceClass,
                        remember,
                        createdAt: timestamp,
                        lastSeenAt: timestamp,
                        expiresAt: timestamp
                    },
                    timestamp
                )
            };
            sessions.set(token, record);
            return {
                token: record.token,
                sourceClass: record.sourceClass,
                expiresAt: record.expiresAt
            };
        },

        rotate(token: string, sourceClass: GatewaySourceClass, remember: boolean): GatewaySession | null {
            const current = this.get(token);
            if (!current) return null;
            sessions.delete(current.token);
            return this.issue(sourceClass, remember);
        },

        get(token: string): GatewaySession | null {
            const record = sessions.get(String(token || ""));
            if (!record) return null;
            const timestamp = now();
            if (removeIfExpired(record, timestamp)) return null;
            record.lastSeenAt = timestamp;
            record.expiresAt = effectiveExpiry(record, timestamp);
            return {
                token: record.token,
                sourceClass: record.sourceClass,
                expiresAt: record.expiresAt
            };
        },

        revoke(token: string): void {
            sessions.delete(String(token || ""));
        },

        clear(): void {
            sessions.clear();
        }
    };
};

