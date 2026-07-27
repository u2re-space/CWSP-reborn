/*
 * Filename: control-pairing.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/control-pairing.ts
 * Change date and time: 20.15.00_20.07.2026
 * Reason for changes: Pairing modal — publicToken + live 20s deviceCode; session ≤ 1h.
 *   INVARIANT: ok only after GET /service/config verifies the session (no 401 flood).
 *   SECURITY: public SPA never sends/stores ecosystem token as X-API-Key to Control.
 */

import {
    bridgeFetch,
    looksLikeAndroidControlTarget,
    type ConnectionSource
} from "./connection-source";
import { showControlPairModal } from "./control-pair-modal";

const SESSION_STORAGE_KEY = "cwsp-control-session-v1";
const PUBLIC_TOKEN_HINT_KEY = "cwsp-control-public-token-hint-v1";

export type ControlSession = {
    token: string;
    origin: string;
    host: string;
    port: number;
    expiresAt: number;
    pairCode?: string;
};

export type PairBeginResult = {
    pairId: string;
    pairCode: string;
    expiresAt: number;
    session?: string;
    sessionExpiresAt?: number;
    state?: string;
};

export type PairStatusResult = {
    state: "pending" | "accepted" | "denied" | "expired" | string;
    session?: string;
    sessionExpiresAt?: number;
    pairCode?: string;
    error?: string;
};

const pageOrigin = (): string => {
    try {
        return String(location.origin || "").trim();
    } catch {
        return "";
    }
};

export const readControlSession = (): ControlSession | null => {
    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ControlSession;
        if (!parsed?.token || !parsed.origin || !parsed.expiresAt) return null;
        if (Date.now() >= Number(parsed.expiresAt)) {
            clearControlSession();
            return null;
        }
        if (parsed.origin !== pageOrigin()) {
            clearControlSession();
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
};

export const saveControlSession = (session: ControlSession): void => {
    try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
        /* ignore */
    }
    try {
        (globalThis as { __CWSP_CONTROL_SESSION__?: string }).__CWSP_CONTROL_SESSION__ = session.token;
    } catch {
        /* ignore */
    }
};

export const clearControlSession = (): void => {
    try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
        /* ignore */
    }
    try {
        delete (globalThis as { __CWSP_CONTROL_SESSION__?: string }).__CWSP_CONTROL_SESSION__;
    } catch {
        /* ignore */
    }
};

type ControlAuthRecoveryHandler = (info: {
    status: number;
    path: string;
}) => void | Promise<void>;

let authRecoveryHandler: ControlAuthRecoveryHandler | null = null;
let authRecoveryInFlight = false;
let authRecoveryCooldownUntil = 0;
let authRecoveryArmed = false;

/** Register boot-time recovery (clear session → re-pair modal). */
export const setControlAuthRecoveryHandler = (handler: ControlAuthRecoveryHandler | null): void => {
    authRecoveryHandler = handler;
};

/**
 * Call when Control returns 401/403 on an authenticated route.
 * INVARIANT: debounced — one re-pair attempt, no request storms.
 */
export const notifyControlUnauthorized = (status: number, path: string): void => {
    const p = String(path || "");
    // Pairing discovery / loopback-only display — not a session failure signal for re-pair.
    if (
        p.includes("/service/pair/hello") ||
        p.includes("/service/pair/begin") ||
        p.includes("/service/pair/status") ||
        p.includes("/service/pair/display")
    ) {
        return;
    }
    if (status !== 401 && status !== 403) return;

    let wasLive = false;
    try {
        const g = globalThis as {
            __CWSP_CONTROL_BRIDGE_LIVE__?: boolean;
            __CWS_NODE_CLIPBOARD_HUB__?: boolean;
        };
        wasLive = Boolean(g.__CWSP_CONTROL_BRIDGE_LIVE__);
        g.__CWSP_CONTROL_BRIDGE_LIVE__ = false;
        g.__CWS_NODE_CLIPBOARD_HUB__ = false;
    } catch {
        /* ignore */
    }
    clearControlSession();

    if (!authRecoveryHandler || authRecoveryInFlight) return;
    const now = Date.now();
    if (now < authRecoveryCooldownUntil) return;
    // WHY: boot discovery probes 401 before pairing — only recover once armed or after a false live.
    if (!authRecoveryArmed && !wasLive) return;

    authRecoveryInFlight = true;
    authRecoveryCooldownUntil = now + 8_000;
    console.warn("[CWSP Control] Control unauthorized — requesting re-pair", status, p);
    void Promise.resolve(authRecoveryHandler({ status, path: p }))
        .catch((error) => {
            console.warn("[CWSP Control] auth recovery failed", error);
        })
        .finally(() => {
            authRecoveryInFlight = false;
        });
};

/** Enable 401→re-pair after boot hydrate finished (avoids modal storms during discovery). */
export const armControlAuthRecovery = (): void => {
    authRecoveryArmed = true;
};

export const isControlAuthPath = (path: string): boolean => {
    const p = String(path || "");
    return p.includes("/service/") && !p.includes("/service/pair/");
};

export const getActiveControlSessionToken = (): string => {
    const s = readControlSession();
    if (s?.token) return s.token;
    try {
        return String((globalThis as { __CWSP_CONTROL_SESSION__?: string }).__CWSP_CONTROL_SESSION__ || "").trim();
    } catch {
        return "";
    }
};

const readPublicTokenHint = (): string => {
    try {
        return String(sessionStorage.getItem(PUBLIC_TOKEN_HINT_KEY) || "").trim();
    } catch {
        return "";
    }
};

const savePublicTokenHint = (token: string): void => {
    try {
        sessionStorage.setItem(PUBLIC_TOKEN_HINT_KEY, String(token || "").trim());
    } catch {
        /* ignore */
    }
};

/** Probe Control without secrets — pairing hello (Android or Neutralino). */
export const probeControlPairHello = async (
    source: ConnectionSource
): Promise<{ ok: boolean; surface?: string; periodMs?: number }> => {
    try {
        const ctrl =
            typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
                ? AbortSignal.timeout(2500)
                : undefined;
        const res = await bridgeFetch(source, "/service/pair/hello", {
            method: "GET",
            signal: ctrl,
            headers: { "X-Skip-Legacy-Key": "1" }
        } as RequestInit);
        if (!res.ok) return { ok: false };
        const body = (await res.json()) as {
            ok?: boolean;
            pairing?: boolean;
            deviceCodePeriodMs?: number;
            control?: { surface?: string };
        };
        if (!body?.ok || !body?.pairing) return { ok: false };
        return {
            ok: true,
            surface: String(body?.control?.surface || ""),
            periodMs: Number(body?.deviceCodePeriodMs) || 20_000
        };
    } catch {
        return { ok: false };
    }
};

/** @deprecated use probeControlPairHello */
export const probeAndroidPairHello = async (source: ConnectionSource): Promise<boolean> => {
    if (!looksLikeAndroidControlTarget(source)) return false;
    const r = await probeControlPairHello(source);
    return r.ok;
};

export type PairBeginAttempt =
    | { ok: true; begin: PairBeginResult }
    | { ok: false; error: string; status?: number };

export const beginControlPair = async (
    source: ConnectionSource,
    creds: { publicToken: string; deviceCode: string }
): Promise<PairBeginAttempt> => {
    const origin = pageOrigin();
    if (!origin) return { ok: false, error: "Missing page origin" };
    const publicToken = String(creds.publicToken || "").trim();
    const code = String(creds.deviceCode || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    if (!publicToken || !code) {
        return { ok: false, error: "Public token and device code are required" };
    }
    try {
        const res = await bridgeFetch(source, "/service/pair/begin", {
            method: "POST",
            headers: { "X-Skip-Legacy-Key": "1" },
            body: JSON.stringify({
                origin,
                publicToken,
                deviceCode: code,
                clientLabel: `cwsp-control ${origin}`
            })
        } as RequestInit);
        let errMsg = "";
        try {
            const failBody = (await res.clone().json()) as { error?: string };
            errMsg = String(failBody?.error || "").trim();
        } catch {
            /* ignore */
        }
        if (!res.ok) {
            console.warn("[CWSP Control] pair/begin failed", res.status, errMsg);
            if (res.status === 403) {
                return {
                    ok: false,
                    status: res.status,
                    error: errMsg || "Invalid public token or expired device code"
                };
            }
            return {
                ok: false,
                status: res.status,
                error: errMsg || `Pairing failed (HTTP ${res.status})`
            };
        }
        const body = (await res.json()) as PairBeginResult & { ok?: boolean };
        if (!body?.pairId || !body?.pairCode) {
            return { ok: false, error: "Pairing response incomplete" };
        }
        savePublicTokenHint(publicToken);
        return {
            ok: true,
            begin: {
                pairId: body.pairId,
                pairCode: body.pairCode,
                expiresAt: Number(body.expiresAt) || Date.now() + 60_000,
                session: body.session,
                sessionExpiresAt: body.sessionExpiresAt,
                state: body.state
            }
        };
    } catch (error) {
        console.warn("[CWSP Control] pair/begin error", error);
        return {
            ok: false,
            error: "Cannot reach Control (CORS / Local Network Access / app offline)"
        };
    }
};

/** INVARIANT: only treat Control as live after /service/config accepts the session. */
export const verifyControlSessionAuthorized = async (
    source: ConnectionSource
): Promise<boolean> => {
    try {
        const res = await bridgeFetch(source, "/service/config", {
            method: "GET",
            headers: { "X-Skip-Legacy-Key": "1" }
        } as RequestInit);
        return res.ok;
    } catch {
        return false;
    }
};

export const pollControlPairStatus = async (
    source: ConnectionSource,
    pairId: string
): Promise<PairStatusResult | null> => {
    try {
        const res = await bridgeFetch(
            source,
            `/service/pair/status?pairId=${encodeURIComponent(pairId)}`,
            { method: "GET", headers: { "X-Skip-Legacy-Key": "1" } } as RequestInit
        );
        if (!res.ok) return null;
        return (await res.json()) as PairStatusResult;
    } catch {
        return null;
    }
};

const sessionFromBegin = (
    source: ConnectionSource,
    begin: PairBeginResult
): ControlSession | null => {
    if (!begin.session) return null;
    return {
        token: begin.session,
        origin: pageOrigin(),
        host: source.host,
        port: Number(source.port) || 8434,
        expiresAt: Number(begin.sessionExpiresAt) || Date.now() + 60 * 60_000,
        pairCode: begin.pairCode
    };
};

/**
 * Ensure a valid Control session (publicToken + deviceCode modal; Accept on Android).
 * INVARIANT: returns ok only after GET /service/config succeeds with the session.
 */
export const ensureControlSession = async (
    source: ConnectionSource,
    opts?: {
        onPairCode?: (code: string, pairId: string) => void;
        onNeedDeviceCode?: (periodMs: number) => void;
        publicToken?: string;
        deviceCode?: string;
        timeoutMs?: number;
        forceModal?: boolean;
    }
): Promise<{
    ok: boolean;
    session?: ControlSession;
    denied?: boolean;
    badCode?: boolean;
    authFailed?: boolean;
    error?: string;
}> => {
    const hello = await probeControlPairHello(source);
    const periodMs = hello.periodMs || 20_000;

    const existing = readControlSession();
    if (
        !opts?.forceModal &&
        existing &&
        existing.host === source.host &&
        Number(existing.port) === Number(source.port) &&
        existing.origin === pageOrigin()
    ) {
        if (await verifyControlSessionAuthorized(source)) {
            return { ok: true, session: existing };
        }
        clearControlSession();
    }

    opts?.onNeedDeviceCode?.(periodMs);

    let lastError = "";
    let publicToken = String(opts?.publicToken || "").trim();
    let deviceCode = String(opts?.deviceCode || "").trim();
    const maxAttempts = publicToken && deviceCode ? 1 : 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (!publicToken || !deviceCode || attempt > 0) {
            const modal = await showControlPairModal({
                title: hello.surface === "neutralino-node" ? "Pair desk Control" : "Pair phone Control",
                hint:
                    hello.surface === "neutralino-node"
                        ? "Open desk CWSP Settings → Control pairing. Enter public token + live 20s code. We verify /service/config before enabling Control."
                        : "Open phone CWSP Settings → Control pairing. Enter public token + live 20s code, then Accept on the phone.",
                initialPublicToken: publicToken || readPublicTokenHint(),
                error: lastError || undefined
            });
            if (!modal) return { ok: false, badCode: true, error: "Pairing cancelled" };
            publicToken = modal.publicToken;
            deviceCode = modal.deviceCode;
        }

        const attemptBegin = await beginControlPair(source, { publicToken, deviceCode });
        if (!attemptBegin.ok) {
            lastError = attemptBegin.error;
            publicToken = publicToken;
            deviceCode = "";
            continue;
        }
        const begin = attemptBegin.begin;
        opts?.onPairCode?.(begin.pairCode, begin.pairId);

        let session = sessionFromBegin(source, begin);
        if (!session) {
            const deadline = Math.min(begin.expiresAt, Date.now() + (opts?.timeoutMs ?? 70_000));
            while (Date.now() < deadline && !session) {
                const status = await pollControlPairStatus(source, begin.pairId);
                if (!status) {
                    await sleep(800);
                    continue;
                }
                if (status.state === "denied" || status.state === "expired") {
                    clearControlSession();
                    return {
                        ok: false,
                        denied: status.state === "denied",
                        error:
                            status.state === "denied"
                                ? "Pairing denied on device"
                                : "Pairing expired — try again with a fresh device code"
                    };
                }
                if (status.state === "accepted" && status.session) {
                    session = {
                        token: status.session,
                        origin: pageOrigin(),
                        host: source.host,
                        port: Number(source.port) || 8434,
                        expiresAt: Number(status.sessionExpiresAt) || Date.now() + 60 * 60_000,
                        pairCode: begin.pairCode
                    };
                } else {
                    await sleep(800);
                }
            }
        }

        if (!session) {
            lastError = "No session yet — Accept on the phone, or restart desk Control with pairing support";
            deviceCode = "";
            continue;
        }

        saveControlSession(session);
        if (await verifyControlSessionAuthorized(source)) {
            return { ok: true, session };
        }
        clearControlSession();
        lastError =
            "Credentials accepted, but Control still rejects the session. Restart Neutralino/Capacitor with the latest build, then retry.";
        deviceCode = "";
    }

    clearControlSession();
    return { ok: false, badCode: true, authFailed: true, error: lastError || "Pairing failed" };
};

/** @deprecated use ensureControlSession */
export const ensureAndroidControlSession = ensureControlSession;

/** @deprecated — use modal via ensureControlSession */
export const promptDeviceCode = async (): Promise<string | null> => {
    const modal = await showControlPairModal({ initialPublicToken: readPublicTokenHint() });
    return modal?.deviceCode || null;
};

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
