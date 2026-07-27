/*
 * Filename: WebSocket.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/network/WebSocket.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Provide thin canonical WebSocket helpers for the web transport.
 *
 * NOTE: Implemented against `globalThis.WebSocket` (available in secure browser contexts).
 * The canonical /ws path is the realtime transport (see network.mdc).
 */

export interface CwspWsHandlers {
    onOpen?: (ev: Event) => void;
    onMessage?: (ev: MessageEvent) => void;
    onClose?: (ev: CloseEvent) => void;
    onError?: (ev: Event) => void;
}

export interface CwspWsAskOptions {
    timeoutMs?: number;
    /** Match the reply by this uuid; defaults to the request packet's `uuid`. */
    matchUuid?: string;
}

/**
 * Build the canonical /ws URL from an endpoint origin.
 * Strips a trailing slash from the origin and appends `/ws`, or the given path.
 */
export function createCwspWsUrl(origin: string, path?: string): string {
    const base = origin.replace(/\/+$/, "");
    const suffix = path ? path.replace(/^\/+/, "") : "ws";
    return `${base}/${suffix}`;
}

/**
 * Open a canonical WebSocket against `globalThis.WebSocket` and wire handlers.
 * Returns the raw WebSocket instance; callers own retry/backoff policy.
 */
export function openCwspWebSocket(url: string, handlers?: CwspWsHandlers): WebSocket {
    const WS = globalThis.WebSocket;
    if (!WS) {
        throw new Error(
            "openCwspWebSocket: globalThis.WebSocket is undefined.",
        );
    }
    const ws = new WS(url);
    if (handlers?.onOpen) ws.addEventListener("open", handlers.onOpen);
    if (handlers?.onMessage) ws.addEventListener("message", handlers.onMessage);
    if (handlers?.onClose) ws.addEventListener("close", handlers.onClose);
    if (handlers?.onError) ws.addEventListener("error", handlers.onError);
    return ws;
}

/**
 * Send a CWSP packet over an open WebSocket. Objects are JSON-stringified; strings
 * are sent verbatim. No-op if the socket is not in the OPEN readyState (1).
 */
export function sendCwspPacket(ws: WebSocket, packet: unknown): void {
    if (ws.readyState !== 1) return;
    const data = typeof packet === "string" ? packet : JSON.stringify(packet);
    ws.send(data);
}

/**
 * Send a request packet and resolve with the first reply whose `uuid` matches,
 * or reject on timeout. The request packet must carry a `uuid` (or pass matchUuid).
 */
export function askCwspPacket(
    ws: WebSocket,
    packet: Record<string, unknown>,
    options: CwspWsAskOptions = {},
): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const matchUuid = options.matchUuid ?? (packet.uuid as string | undefined);
        const timeoutMs = options.timeoutMs ?? 5000;

        const onMessage = (ev: MessageEvent) => {
            let parsed: unknown = ev.data;
            if (typeof parsed === "string") {
                try {
                    parsed = JSON.parse(parsed);
                } catch {
                    return;
                }
            }
            const reply = parsed as Record<string, unknown> | null;
            if (!reply || typeof reply !== "object") return;
            if (matchUuid && reply.uuid !== matchUuid) return;
            cleanup();
            resolve(reply);
        };
        const onError = (ev: Event) => {
            cleanup();
            reject(ev);
        };
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error(`askCwspPacket: timeout after ${timeoutMs}ms (uuid=${matchUuid})`));
        }, timeoutMs);

        function cleanup() {
            clearTimeout(timeout);
            ws.removeEventListener("message", onMessage);
            ws.removeEventListener("error", onError);
        }

        ws.addEventListener("message", onMessage);
        ws.addEventListener("error", onError);
        sendCwspPacket(ws, packet);
    });
}
