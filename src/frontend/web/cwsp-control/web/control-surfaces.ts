/*
 * Filename: control-surfaces.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/control-surfaces.ts
 * Change date and time: 23.40.00_19.07.2026
 * Reason for changes: Canonical split — public /cwsp (PNA→client) vs gateway :8434 (server+auth).
 */

/**
 * ## CWSP Control surfaces (INVARIANT)
 *
 * ### A) Public Control UI — `https://HOST/cwsp` (Fastify :443, e.g. 45.147.121.152/cwsp)
 * - Unauthenticated SPA (same idea as Chrome extension options).
 * - Settings SoT via **PNA** to the **client-local** Control RPC:
 *   - Capacitor/Java: `http://127.0.0.1:8434/service/config` (Allow Control API)
 *   - Neutralino Node (COMPAT sidecar): `http://127.0.0.1:29110/service/config`
 * - May also reach a phone on LAN `:8434` when the browser is not on-device.
 * - `core.endpointUrl` / hub WS may still point at `https://HOST:8434/` (server) — that is
 *   **not** the Control settings bridge.
 *
 * ### B) Gateway Control — `https://HOST:8434/` (CWSP endpoint process)
 * - Talks to **that server's** backend (same origin).
 * - External IP → login / cookies (`cwsp_gateway_session`); not PNA to 127.0.0.1.
 *
 * Do not conflate A and B: same numeric port 8434 means different roles
 * (client cleartext Control vs server HTTPS hub).
 */

export const CLIENT_CONTROL_PORT = 8434;
export const NEUTRALINO_CONTROL_SIDECAR_PORT = 29110;

export type CwspControlSurfaceKind = "public-cwsp-pna-client" | "gateway-server";

/** True when this page is the public Fastify `/cwsp` SPA (surface A). */
export const isPublicCwspControlPage = (): boolean => {
    try {
        const path = String(location.pathname || "").toLowerCase();
        return path === "/cwsp" || path.startsWith("/cwsp/");
    } catch {
        return false;
    }
};

/** True when this page is served from the CWSP gateway process on :8434 (surface B). */
export const isGatewayServerPage = (): boolean => {
    try {
        const port = String(location.port || "");
        if (port === "8434") return true;
        // HTTPS default port with gateway SPA markers
        const path = String(location.pathname || "");
        return (
            Boolean(document.documentElement.dataset.cwspSurface === "gateway") ||
            /\/gateway\//i.test(path)
        );
    } catch {
        return false;
    }
};

export const detectCwspControlSurface = (): CwspControlSurfaceKind => {
    if (isGatewayServerPage() && !isPublicCwspControlPage()) return "gateway-server";
    return "public-cwsp-pna-client";
};
