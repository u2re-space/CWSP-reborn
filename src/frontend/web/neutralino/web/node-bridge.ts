/*
 * Filename: node-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/neutralino/windows/web/node-bridge.ts
 * Change date and time: 16.17.00_11.07.2026
 * Reason for changes: Pass-III — thin frontend helper to invoke the extNode Neutralino
 *   extension via Neutralino.extensions.dispatch for CWSP/clipboard/settings RPC.
 */

/**
 * Thin bridge from the WebView to the `extNode` Neutralino extension.
 *
 * WHY: the Neutralino shell runs the Node backend as an extension
 * (`extNode`) reachable via `Neutralino.extensions.dispatch('extNode',
 * 'runNode', { function, parameter })`. This module normalizes a small set of
 * CWSP verbs to that RPC so frontend code does not depend on the Neutralino
 * client API shape directly.
 *
 * Safe no-op: when the Neutralino native API is missing (browser/PWA dev mode),
 * every call resolves to `null` instead of throwing, so callers can fall back to
 * the HTTP control RPC (`/service/config`) or in-memory arms.
 */

const EXT_ID = "extNode";
const EVENT = "runNode";

/** Function names understood by the extNode extension's `runNode` handler. */
export type NodeBridgeFunction =
    | "ping"
    | "cwsp.dispatch"
    | "clipboard.read"
    | "clipboard.write"
    | "settings.get"
    | "settings.patch"
    | "backend.status"
    | "backend.auth"
    | "control.auth";

/** Minimal shape of the Neutralino client we depend on. */
interface NeutralinoExtensions {
    dispatch(extId: string, event: string, data: unknown): Promise<unknown>;
}
interface NeutralinoGlobal {
    extensions?: NeutralinoExtensions;
}

function neutralino(): NeutralinoGlobal | null {
    try {
        const g = globalThis as unknown as { Neutralino?: NeutralinoGlobal };
        return g.Neutralino ?? null;
    } catch {
        return null;
    }
}

/** True when the Neutralino client + extensions API is available. */
export function hasNodeBridge(): boolean {
    const nl = neutralino();
    return Boolean(nl?.extensions?.dispatch);
}

/**
 * Dispatch a function call to the extNode extension.
 * Returns the extension reply, or `null` when the bridge is unavailable.
 */
export async function dispatchNode(
    fn: NodeBridgeFunction,
    parameter?: unknown
): Promise<unknown> {
    const nl = neutralino();
    if (!nl?.extensions?.dispatch) return null;
    try {
        return await nl.extensions.dispatch(EXT_ID, EVENT, { function: fn, parameter });
    } catch {
        return null;
    }
}

/** Ping the Node extension — resolves to a pong string or null. */
export function pingNode(parameter?: unknown): Promise<unknown> {
    return dispatchNode("ping", parameter);
}

/** Forward a canonical CWSP dispatch packet to the Node backend. */
export function cwspDispatchNode(packet: unknown): Promise<unknown> {
    return dispatchNode("cwsp.dispatch", packet);
}

/** Read the OS clipboard via the Node backend. */
export function clipboardReadNode(): Promise<unknown> {
    return dispatchNode("clipboard.read");
}

/** Write text to the OS clipboard via the Node backend. */
export function clipboardWriteNode(text: string): Promise<unknown> {
    return dispatchNode("clipboard.write", text);
}

/** Read CWSP settings via the Node backend (control-RPC mirror). */
export function settingsGetNode(): Promise<unknown> {
    return dispatchNode("settings.get");
}

/** Patch CWSP settings via the Node backend (control-RPC mirror). */
export function settingsPatchNode(patch: Record<string, unknown>): Promise<unknown> {
    return dispatchNode("settings.patch", patch);
}

export default dispatchNode;
