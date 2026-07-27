/*
 * Filename: Transport.ts
 * FullPath: apps/CWSP-reborn/src/protocol/web/network/Transport.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Provide a transport-neutral session interface for the web transport.
 *
 * NOTE: The canonical /ws ingress speaks the CwspTransportSession shape so browser
 * transport adapters (WebSocket / message-port / bridge) share one send/close/readyState API.
 */

/** Low-level send primitive: accepts a raw string or a JSON-serializable object. */
export type CwspTransportSend = (data: string | object) => void;

/**
 * Transport-neutral session surface used by the web coordinator.
 * `readyState` mirrors the WebSocket readyState constants (0..3) so callers can
 * treat ws/message-port/bridge sessions uniformly.
 */
export interface CwspTransportSession {
    send(packet: unknown): void;
    close(code?: number, reason?: string): void;
    readonly readyState: number;
}
