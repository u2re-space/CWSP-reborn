/*
 * Filename: node-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/node-bridge.ts
 * Change date and time: 18.55.00_11.07.2026
 * Reason for changes: Prefer loopback /service/* control HTTP (reliable replies) over extNode IPC.
 */

/**
 * Thin bridge from the WebView to the Node desktop backend.
 *
 * Prefer order:
 *   1. Loopback control RPC (`__WEBNATIVE_AUTH__` → /service/clipboard|/service/dispatch)
 *   2. Neutralino.extensions.dispatch('extNode', 'runNode', …) when present
 *
 * WHY: Neutralino extension dispatch does not reliably return runNodeResult to the
 * Promise caller; HTTP control host does. clipboard-device also uses the same auth.
 */

const EXT_ID = "extNode";
const EVENT = "runNode";

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

interface NeutralinoExtensions {
    dispatch(extId: string, event: string, data: unknown): Promise<unknown>;
}
interface NeutralinoGlobal {
    extensions?: NeutralinoExtensions;
}

interface ControlAuth {
    port: number;
    key: string;
}

function neutralino(): NeutralinoGlobal | null {
    try {
        const g = globalThis as unknown as { Neutralino?: NeutralinoGlobal };
        return g.Neutralino ?? null;
    } catch {
        return null;
    }
}

function readControlAuth(): ControlAuth | null {
    try {
        const g = globalThis as unknown as {
            __WEBNATIVE_AUTH__?: { port?: number; key?: string };
            __NEUTRALINO_AUTH__?: { port?: number; key?: string };
        };
        const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
        if (!auth || typeof auth.port !== "number" || !auth.key) return null;
        if (auth.port === 8434) return null; // NL static server, not control RPC
        return { port: auth.port, key: String(auth.key) };
    } catch {
        return null;
    }
}

async function controlFetch(path: string, init?: RequestInit): Promise<unknown | null> {
    const auth = readControlAuth();
    if (!auth) return null;
    try {
        const headers = new Headers(init?.headers);
        headers.set("Content-Type", "application/json");
        headers.set("X-API-Key", auth.key);
        const res = await fetch(`http://127.0.0.1:${auth.port}${path}`, {
            ...init,
            headers,
            cache: "no-store"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export function hasNodeBridge(): boolean {
    return Boolean(readControlAuth() || neutralino()?.extensions?.dispatch);
}

export async function dispatchNode(
    fn: NodeBridgeFunction,
    parameter?: unknown
): Promise<unknown> {
    // Prefer HTTP control for clipboard/dispatch/settings (reliable JSON reply).
    if (fn === "clipboard.read") {
        const kind =
            parameter && typeof parameter === "object" && "kind" in (parameter as object)
                ? String((parameter as { kind?: string }).kind || "text")
                : "text";
        const via = await controlFetch(`/service/clipboard?kind=${encodeURIComponent(kind)}`);
        if (via != null) return via;
    }
    if (fn === "clipboard.write") {
        const body =
            typeof parameter === "string"
                ? { kind: "text", text: parameter, data: parameter }
                : parameter && typeof parameter === "object"
                  ? parameter
                  : { kind: "text", text: String(parameter ?? "") };
        const via = await controlFetch("/service/clipboard", {
            method: "POST",
            body: JSON.stringify(body)
        });
        if (via != null) return via;
    }
    if (fn === "cwsp.dispatch") {
        const via = await controlFetch("/service/dispatch", {
            method: "POST",
            body: JSON.stringify(parameter ?? {})
        });
        if (via != null) return via;
    }
    if (fn === "settings.get") {
        const via = await controlFetch("/service/config");
        if (via != null) return via;
    }
    if (fn === "settings.patch") {
        const via = await controlFetch("/service/config", {
            method: "POST",
            body: JSON.stringify(parameter ?? {})
        });
        if (via != null) return via;
    }
    if (fn === "backend.auth" || fn === "control.auth") {
        const auth = readControlAuth();
        if (auth) return { ok: true, ...auth };
    }

    const nl = neutralino();
    if (!nl?.extensions?.dispatch) return null;
    try {
        return await nl.extensions.dispatch(EXT_ID, EVENT, { function: fn, parameter });
    } catch {
        return null;
    }
}

export function pingNode(parameter?: unknown): Promise<unknown> {
    return dispatchNode("ping", parameter);
}

export function cwspDispatchNode(packet: unknown): Promise<unknown> {
    return dispatchNode("cwsp.dispatch", packet);
}

export function clipboardReadNode(parameter?: unknown): Promise<unknown> {
    return dispatchNode("clipboard.read", parameter);
}

export function clipboardWriteNode(textOrPayload: string | Record<string, unknown>): Promise<unknown> {
    return dispatchNode("clipboard.write", textOrPayload);
}

export function settingsGetNode(): Promise<unknown> {
    return dispatchNode("settings.get");
}

export function settingsPatchNode(patch: Record<string, unknown>): Promise<unknown> {
    return dispatchNode("settings.patch", patch);
}

export default dispatchNode;
