/*
 * Filename: control-attestation.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/control-attestation.ts
 * Change date and time: 20.40.00_20.07.2026
 * Reason for changes: Shared Control pairing + 20s rotating device code (Node/Neutralino).
 *   SECURITY: public SPA must enter live device code; ecosystem token alone is not enough.
 *   2026-07-20: previous code stays valid for CONTROL_CODE_PREVIOUS_GRACE_MS after rotation.
 *   2026-07-20: chrome-extension:// origins get persistent sessions (file-backed).
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const CONTROL_CODE_PERIOD_MS = 20_000;
/** WHY: typing/paste across a 20s tick — previous code still accepted briefly after rotation. */
export const CONTROL_CODE_PREVIOUS_GRACE_MS = 10_000;
export const CONTROL_PAIR_TTL_MS = 60_000;
/** INVARIANT: public SPA Control session after pairing lasts at most 1 hour. */
export const CONTROL_SESSION_TTL_MS = 60 * 60_000;
/**
 * WHY: Chrome extension pairs once; session must survive browser + Neutralino restarts.
 * INVARIANT: only `chrome-extension://` origins receive this TTL (not https SPA).
 */
export const CONTROL_SESSION_TTL_PERSISTENT_MS = 10 * 365 * 24 * 60 * 60_000;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LEN = 6;
const BEGIN_RATE_LIMIT = 5;
const BEGIN_RATE_WINDOW_MS = 60_000;

export const DEFAULT_CONTROL_ALLOWED_ORIGINS = [
    "https://cwsp.u2re.space",
    "https://www.cwsp.u2re.space",
    "https://md.u2re.space",
    "https://www.md.u2re.space"
] as const;

export type PairState = "pending" | "accepted" | "denied" | "expired";

export type PairRequest = {
    pairId: string;
    origin: string;
    pairCode: string;
    clientLabel: string;
    createdAtMs: number;
    expiresAtMs: number;
    state: PairState;
    sessionToken?: string;
    sessionExpiresAtMs?: number;
    sessionDelivered?: boolean;
};

export type ControlSession = {
    token: string;
    origin: string;
    expiresAtMs: number;
    /** Set for chrome-extension:// sessions (long TTL + disk restore). */
    persistent?: boolean;
};

const pairs = new Map<string, PairRequest>();
const sessions = new Map<string, ControlSession>();
const beginHits = new Map<string, number[]>();

let deviceSecret = "";
let publicToken = "";
let displayCodePath = "";
let displayTickerStarted = false;
let publicTokenPath = "";
let sessionsPath = "";

/** Seed HMAC secret from Control public token (never the ecosystem WS token). */
export function setControlDeviceSecret(
    secret: string,
    opts?: { displayFile?: string; publicTokenFile?: string; sessionsFile?: string }
): void {
    deviceSecret = String(secret || "").trim();
    if (deviceSecret) publicToken = deviceSecret;
    if (opts?.displayFile) displayCodePath = opts.displayFile;
    if (opts?.publicTokenFile) publicTokenPath = opts.publicTokenFile;
    if (opts?.sessionsFile) {
        sessionsPath = opts.sessionsFile;
        loadPersistedSessions();
    }
    persistDisplayCode();
    persistPublicTokenFile();
}

export function getControlDeviceSecret(): string {
    return deviceSecret;
}

export function getControlPublicToken(): string {
    return publicToken || deviceSecret;
}

export function ensureControlPublicToken(preferred?: string): string {
    const existing = String(preferred || publicToken || deviceSecret || "").trim();
    if (existing) {
        publicToken = existing;
        deviceSecret = existing;
        persistPublicTokenFile();
        persistDisplayCode();
        return existing;
    }
    return regenerateControlPublicToken();
}

export function regenerateControlPublicToken(): string {
    const token = `cwsp-pub-${randomBytes(18).toString("hex")}`;
    publicToken = token;
    deviceSecret = token;
    revokeAllControlAttestation();
    persistPublicTokenFile();
    persistDisplayCode();
    return token;
}

export function matchesControlPublicToken(incoming: string): boolean {
    const expected = getControlPublicToken();
    const a = String(incoming || "").trim();
    const b = String(expected || "").trim();
    if (!a || !b || a.length !== b.length) return false;
    try {
        return timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
        return false;
    }
}

function persistPublicTokenFile(): void {
    if (!publicTokenPath || !publicToken) return;
    try {
        mkdirSync(dirname(publicTokenPath), { recursive: true });
        writeFileSync(publicTokenPath, `${publicToken}\n`, "utf8");
    } catch {
        /* ignore */
    }
}

export function controlCodePeriodMs(): number {
    return CONTROL_CODE_PERIOD_MS;
}

/** Current rotating device code (+ previous for display/diagnostics). */
export function currentDeviceCodes(nowMs = Date.now()): {
    current: string;
    previous: string;
    expiresInMs: number;
    previousGraceMs: number;
    previousAccepted: boolean;
} {
    const secret = deviceSecret || "cwsp-unseeded";
    const counter = Math.floor(nowMs / CONTROL_CODE_PERIOD_MS);
    const elapsedInPeriod = nowMs % CONTROL_CODE_PERIOD_MS;
    const expiresInMs = CONTROL_CODE_PERIOD_MS - elapsedInPeriod;
    const previousAccepted = elapsedInPeriod < CONTROL_CODE_PREVIOUS_GRACE_MS;
    return {
        current: codeForCounter(secret, counter),
        previous: codeForCounter(secret, counter - 1),
        expiresInMs,
        previousGraceMs: CONTROL_CODE_PREVIOUS_GRACE_MS,
        previousAccepted
    };
}

/**
 * Accept current period code always; previous period code only during the first
 * {@link CONTROL_CODE_PREVIOUS_GRACE_MS} after rotation (~10s).
 */
export function verifyDeviceCode(input: string, nowMs = Date.now()): boolean {
    const raw = String(input || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    if (raw.length !== CODE_LEN) return false;
    const secret = deviceSecret || "cwsp-unseeded";
    const counter = Math.floor(nowMs / CONTROL_CODE_PERIOD_MS);
    const elapsedInPeriod = nowMs % CONTROL_CODE_PERIOD_MS;
    const current = codeForCounter(secret, counter);
    const previous = codeForCounter(secret, counter - 1);
    const matchCurrent = safeEqualCode(raw, current);
    // INVARIANT: always evaluate previous compare (constant-time-ish); only honor it in grace.
    const matchPrevious = safeEqualCode(raw, previous);
    if (matchCurrent) return true;
    return elapsedInPeriod < CONTROL_CODE_PREVIOUS_GRACE_MS && matchPrevious;
}

function codeForCounter(secret: string, counter: number): string {
    const hmac = createHmac("sha256", secret)
        .update(`cwsp-ctrl-v1|${counter}`)
        .digest();
    const offset = hmac[hmac.length - 1]! & 0x0f;
    const binary =
        ((hmac[offset]! & 0x7f) << 24) |
        ((hmac[offset + 1]! & 0xff) << 16) |
        ((hmac[offset + 2]! & 0xff) << 8) |
        (hmac[offset + 3]! & 0xff);
    let n = binary >>> 0;
    let out = "";
    for (let i = 0; i < CODE_LEN; i++) {
        out = CODE_ALPHABET[n % CODE_ALPHABET.length]! + out;
        n = Math.floor(n / CODE_ALPHABET.length);
    }
    return out;
}

const safeEqualCode = (a: string, b: string): boolean => {
    try {
        const ba = Buffer.from(a);
        const bb = Buffer.from(b);
        if (ba.length !== bb.length) return false;
        return timingSafeEqual(ba, bb);
    } catch {
        return false;
    }
};

export function persistDisplayCode(): void {
    if (!displayCodePath) return;
    try {
        mkdirSync(dirname(displayCodePath), { recursive: true });
        const { current, expiresInMs } = currentDeviceCodes();
        writeFileSync(
            displayCodePath,
            [
                `deviceCode=${current}`,
                `publicToken=${getControlPublicToken()}`,
                `periodMs=${CONTROL_CODE_PERIOD_MS}`,
                `expiresInMs=${expiresInMs}`,
                `sessionTtlMs=${CONTROL_SESSION_TTL_MS}`,
                ""
            ].join("\n"),
            "utf8"
        );
    } catch {
        /* ignore */
    }
}

export function pairingDisplayPayload(): Record<string, unknown> {
    const codes = currentDeviceCodes();
    return {
        publicToken: getControlPublicToken(),
        deviceCode: codes.current,
        expiresInMs: codes.expiresInMs,
        periodMs: CONTROL_CODE_PERIOD_MS,
        previousGraceMs: CONTROL_CODE_PREVIOUS_GRACE_MS,
        previousAccepted: codes.previousAccepted,
        sessionTtlMs: CONTROL_SESSION_TTL_MS,
        sessionTtlPersistentMs: CONTROL_SESSION_TTL_PERSISTENT_MS
    };
}

export function startDisplayCodeTicker(): void {
    persistDisplayCode();
    if (displayTickerStarted) return;
    displayTickerStarted = true;
    setInterval(() => persistDisplayCode(), 1000).unref?.();
}

export function originsEqual(a: string, b: string): boolean {
    const norm = (s: string): string =>
        String(s || "")
            .trim()
            .toLowerCase()
            .replace(/\/+$/, "");
    return norm(a) === norm(b);
}

export function isLoopbackOrCapacitorOrigin(origin: string | undefined | null): boolean {
    if (!origin || !String(origin).trim()) return true;
    const o = String(origin).trim().toLowerCase();
    if (o.startsWith("capacitor://") || o.startsWith("ionic://")) return true;
    if (o.startsWith("http://localhost") || o.startsWith("https://localhost")) return true;
    if (o.startsWith("http://127.0.0.1") || o.startsWith("https://127.0.0.1")) return true;
    if (o.startsWith("http://[::1]") || o.startsWith("https://[::1]")) return true;
    return false;
}

/** Chrome extension options/SW Origin — not loopback; requires X-Control-Session. */
export function isChromeExtensionOrigin(origin: string | undefined | null): boolean {
    const o = String(origin || "")
        .trim()
        .toLowerCase();
    return o.startsWith("chrome-extension://");
}

function sessionTtlMsForOrigin(origin: string): number {
    return isChromeExtensionOrigin(origin)
        ? CONTROL_SESSION_TTL_PERSISTENT_MS
        : CONTROL_SESSION_TTL_MS;
}

function loadPersistedSessions(): void {
    if (!sessionsPath || !existsSync(sessionsPath)) return;
    try {
        const raw = JSON.parse(readFileSync(sessionsPath, "utf8")) as {
            sessions?: Array<{
                token?: string;
                origin?: string;
                expiresAtMs?: number;
                persistent?: boolean;
            }>;
        };
        const list = Array.isArray(raw?.sessions) ? raw.sessions : [];
        const now = Date.now();
        for (const item of list) {
            const token = String(item?.token || "").trim();
            const origin = String(item?.origin || "").trim();
            const expiresAtMs = Number(item?.expiresAtMs) || 0;
            if (!token || !origin || expiresAtMs <= now) continue;
            sessions.set(token, {
                token,
                origin,
                expiresAtMs,
                persistent: Boolean(item?.persistent) || isChromeExtensionOrigin(origin)
            });
        }
    } catch {
        /* ignore corrupt file */
    }
}

function persistSessions(): void {
    if (!sessionsPath) return;
    try {
        mkdirSync(dirname(sessionsPath), { recursive: true });
        const now = Date.now();
        const list = [...sessions.values()].filter((s) => s.expiresAtMs > now);
        writeFileSync(
            sessionsPath,
            JSON.stringify({ version: 1, sessions: list }),
            "utf8"
        );
    } catch {
        /* ignore */
    }
}

export function isAllowedControlOrigin(
    origin: string | undefined | null,
    extraCsv?: string
): boolean {
    if (isLoopbackOrCapacitorOrigin(origin)) return true;
    // WHY: any installed CRX that knows publicToken+deviceCode may pair (same bar as SPA).
    if (isChromeExtensionOrigin(origin)) return true;
    if (!origin || !String(origin).trim()) return true;
    const allowed = new Set<string>(DEFAULT_CONTROL_ALLOWED_ORIGINS);
    if (extraCsv) {
        for (const part of String(extraCsv).split(/[;,]/)) {
            const t = part.trim();
            if (t) allowed.add(t);
        }
    }
    for (const a of allowed) {
        if (originsEqual(a, origin)) return true;
    }
    return false;
}

export function allowPairBegin(clientIp: string): boolean {
    const key = clientIp || "unknown";
    const now = Date.now();
    const hits = beginHits.get(key) || [];
    const fresh = hits.filter((t) => now - t < BEGIN_RATE_WINDOW_MS);
    if (fresh.length >= BEGIN_RATE_LIMIT) {
        beginHits.set(key, fresh);
        return false;
    }
    fresh.push(now);
    beginHits.set(key, fresh);
    return true;
}

export function beginPair(origin: string, clientLabel = ""): PairRequest {
    purgeExpired();
    const now = Date.now();
    const pairId = randomBytes(16).toString("hex");
    const pairCode = randomPairCode();
    const req: PairRequest = {
        pairId,
        origin,
        pairCode,
        clientLabel,
        createdAtMs: now,
        expiresAtMs: now + CONTROL_PAIR_TTL_MS,
        state: "pending"
    };
    pairs.set(pairId, req);
    setTimeout(() => {
        const p = pairs.get(pairId);
        if (p && p.state === "pending") p.state = "expired";
    }, CONTROL_PAIR_TTL_MS + 250).unref?.();
    return req;
}

export function getPair(pairId: string): PairRequest | null {
    purgeExpired();
    const p = pairs.get(String(pairId || "").trim());
    if (!p) return null;
    if (p.state === "pending" && Date.now() >= p.expiresAtMs) p.state = "expired";
    return p;
}

export function acceptPair(pairId: string): boolean {
    const p = getPair(pairId);
    if (!p || p.state !== "pending") return false;
    if (Date.now() >= p.expiresAtMs) {
        p.state = "expired";
        return false;
    }
    const sessionToken = randomBytes(32).toString("hex");
    const persistent = isChromeExtensionOrigin(p.origin);
    const sessionExpiresAtMs = Date.now() + sessionTtlMsForOrigin(p.origin);
    p.state = "accepted";
    p.sessionToken = sessionToken;
    p.sessionExpiresAtMs = sessionExpiresAtMs;
    p.sessionDelivered = false;
    sessions.set(sessionToken, {
        token: sessionToken,
        origin: p.origin,
        expiresAtMs: sessionExpiresAtMs,
        persistent
    });
    persistSessions();
    return true;
}

export function denyPair(pairId: string): boolean {
    const p = getPair(pairId);
    if (!p) return false;
    if (p.state === "pending" || p.state === "accepted") {
        p.state = "denied";
        if (p.sessionToken) {
            sessions.delete(p.sessionToken);
            persistSessions();
        }
        p.sessionToken = undefined;
        return true;
    }
    return false;
}

export function pairStatusPayload(pairId: string): Record<string, unknown> {
    const p = getPair(pairId);
    if (!p) return { state: "expired", error: "unknown_pair" };
    const out: Record<string, unknown> = {
        pairId: p.pairId,
        origin: p.origin,
        pairCode: p.pairCode,
        expiresAt: p.expiresAtMs,
        state: p.state
    };
    if (
        p.state === "accepted" &&
        p.sessionToken &&
        !p.sessionDelivered &&
        p.sessionExpiresAtMs &&
        Date.now() < p.sessionExpiresAtMs
    ) {
        out.session = p.sessionToken;
        out.sessionExpiresAt = p.sessionExpiresAtMs;
        out.sessionPersistent = isChromeExtensionOrigin(p.origin);
        p.sessionDelivered = true;
    }
    return out;
}

export function validateSession(token: string | undefined, origin: string | undefined): ControlSession | null {
    if (!token) return null;
    purgeExpired();
    const s = sessions.get(String(token).trim());
    if (!s) return null;
    if (Date.now() >= s.expiresAtMs) {
        sessions.delete(s.token);
        return null;
    }
    const reqOrigin = String(origin || "").trim();
    // WHY: Chrome often omits Origin on extension→loopback GET (PNA / opaque).
    // INVARIANT: never validate a chrome-extension session against http://127.0.0.1.
    if (!reqOrigin) {
        return isChromeExtensionOrigin(s.origin) || isAllowedControlOrigin(s.origin)
            ? s
            : null;
    }
    if (!originsEqual(s.origin, reqOrigin)) return null;
    return s;
}

/** Lookup unexpired session by token only (diagnostics / Origin-less retry). */
export function peekControlSession(token: string | undefined): ControlSession | null {
    if (!token) return null;
    purgeExpired();
    const s = sessions.get(String(token).trim());
    if (!s) return null;
    if (Date.now() >= s.expiresAtMs) {
        sessions.delete(s.token);
        return null;
    }
    return s;
}

export function revokeAllControlAttestation(): void {
    pairs.clear();
    sessions.clear();
    persistSessions();
}

function purgeExpired(): void {
    const now = Date.now();
    let sessionsChanged = false;
    for (const [id, p] of pairs) {
        if (p.state === "pending" && now >= p.expiresAtMs) p.state = "expired";
        // WHY: persistent CRX sessions keep pair records longer than SPA 1h TTL.
        const keepMs = isChromeExtensionOrigin(p.origin)
            ? CONTROL_SESSION_TTL_PERSISTENT_MS
            : CONTROL_SESSION_TTL_MS;
        if (p.state !== "pending" && now - p.expiresAtMs > keepMs) pairs.delete(id);
    }
    for (const [tok, s] of sessions) {
        if (now >= s.expiresAtMs) {
            sessions.delete(tok);
            sessionsChanged = true;
        }
    }
    if (sessionsChanged) persistSessions();
}

function randomPairCode(): string {
    let out = "";
    const bytes = randomBytes(CODE_LEN);
    for (let i = 0; i < CODE_LEN; i++) {
        out += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
    }
    return out;
}

/** Default display file under cwd `.data`. */
export function defaultDisplayCodePath(cwd = process.cwd()): string {
    return join(cwd, ".data", "cwsp-control-device-code.txt");
}

export function defaultPublicTokenPath(cwd = process.cwd()): string {
    return join(cwd, ".data", "cwsp-control-public-token.txt");
}

/** Persistent chrome-extension Control sessions (survive Neutralino restart). */
export function defaultSessionsPath(cwd = process.cwd()): string {
    return join(cwd, ".data", "cwsp-control-sessions.json");
}
