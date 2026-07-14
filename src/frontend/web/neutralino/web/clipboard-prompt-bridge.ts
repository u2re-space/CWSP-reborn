/*
 * Filename: clipboard-prompt-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/neutralino/web/clipboard-prompt-bridge.ts
 * Change date and time: 17.45.00_14.07.2026
 * Reason for changes: Main Neutralino WebView polls Node control RPC for clipboard prompt
 *   state and lazily spawns the standalone popup window on first non-null state. The popup
 *   self-manages visibility after spawn; this bridge only triggers creation once.
 * INVARIANT: WebView never opens /ws from here — Node hub owns the websocket. This bridge
 *   only talks to the loopback control RPC and the Neutralino window API.
 */

interface ClipboardPromptStateLike {
    kind?: "outbound" | "inbound" | null;
    mode?: "auto" | "ask" | null;
}

interface NeutralinoWindowLike {
    create?: (url: string, options: Record<string, unknown>) => Promise<unknown>;
}

interface NeutralinoLike {
    init?: (opts?: Record<string, unknown>) => void;
    window?: NeutralinoWindowLike;
}

interface NeutralinoAuthLike {
    port: number;
    key: string;
}

const POLL_MS = 1500;
const POPUP_URL = "/clipboard-prompt/index.html";

/** Popup window options mirror modes.popup in neutralino.config.json. */
const POPUP_OPTIONS: Record<string, unknown> = {
    title: "CWSP Clipboard",
    width: 360,
    height: 200,
    minWidth: 360,
    minHeight: 200,
    useLogicalPixels: true,
    center: false,
    fullScreen: false,
    alwaysOnTop: true,
    icon: "/resources/icons/appIcon.png",
    enableInspector: false,
    borderless: true,
    maximize: false,
    // WHY: popup self-shows after it positions itself bottom-right (see popup.js).
    hidden: true,
    transparent: true,
    resizable: false,
    exitProcessOnClose: false
};

function getAuth(): NeutralinoAuthLike {
    const g = globalThis as unknown as { __NEUTRALINO_AUTH__?: NeutralinoAuthLike };
    if (g.__NEUTRALINO_AUTH__ && g.__NEUTRALINO_AUTH__.port && g.__NEUTRALINO_AUTH__.key) {
        return g.__NEUTRALINO_AUTH__;
    }
    return { port: 18765, key: "cwsp-neutralino-local" };
}

function hasPromptState(data: unknown): data is ClipboardPromptStateLike {
    if (!data || typeof data !== "object") return false;
    const obj = data as Record<string, unknown>;
    // WHY: control RPC returns { state: {...} } or the state object directly.
    const state = (obj.state as Record<string, unknown> | undefined) || obj;
    return typeof state.kind === "string" && state.kind != null;
}

/**
 * Start polling the control RPC for clipboard prompt state. On the first non-null
 * state, spawn the standalone popup window once and stop polling — the popup
 * self-manages its visibility thereafter.
 */
export function startClipboardPromptBridge(): void {
    let spawned = false;
    let stopped = false;
    const auth = getAuth();

    const stop = (): void => {
        stopped = true;
    };

    const spawnPopup = (): void => {
        if (spawned) return;
        const g = globalThis as unknown as { Neutralino?: NeutralinoLike };
        const Neutralino = g.Neutralino;
        if (!Neutralino || !Neutralino.window || typeof Neutralino.window.create !== "function") {
            console.warn("[CWSP clipboard-prompt-bridge] Neutralino.window.create unavailable");
            return;
        }
        spawned = true;
        try {
            Neutralino.window
                .create(POPUP_URL, POPUP_OPTIONS)
                .then(() => {
                    console.log("[CWSP clipboard-prompt-bridge] popup window spawned");
                    stop();
                })
                .catch((error: unknown) => {
                    console.warn("[CWSP clipboard-prompt-bridge] popup spawn failed", error);
                    // WHY: allow one retry on next poll cycle if spawn failed.
                    spawned = false;
                });
        } catch (error) {
            console.warn("[CWSP clipboard-prompt-bridge] popup spawn threw", error);
            spawned = false;
        }
    };

    const poll = async (): Promise<void> => {
        while (!stopped) {
            try {
                const res = await fetch(
                    `http://127.0.0.1:${auth.port}/service/clipboard-prompt`,
                    {
                        method: "GET",
                        headers: { "X-API-Key": auth.key },
                        cache: "no-store"
                    }
                );
                if (res.ok) {
                    const data = (await res.json()) as unknown;
                    if (hasPromptState(data) && !spawned) {
                        spawnPopup();
                    }
                }
            } catch {
                // WHY: control host not ready yet — keep polling silently.
            }
            if (stopped) break;
            await new Promise((r) => setTimeout(r, POLL_MS));
        }
    };

    void poll();
}
