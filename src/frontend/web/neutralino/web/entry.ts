/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/neutralino/web/entry.ts
 * Change date and time: 17.45.00_14.07.2026
 * Reason for changes: Start clipboard prompt popup bridge after boot so the main WebView
 *   spawns the standalone popup window on the first clipboard prompt from the Node hub.
 */

import { bootMinimal } from "boot/BootLoader";
import {
    createWebnativeSettingsArm,
    createNeutralinoSettingsArm,
    readNeutralinoAuth,
    markNeutralinoBoot,
    markWebnativeBoot,
    type NeutralinoAuth
} from "./settings-bridge";
import {
    registerSettingsSyncArm,
    type SettingsSyncArm
} from "./settings/ts/settings-sync-adapter";

const enabledViews = ["minimal", "network", "settings"] as const;

/** Loopback defaults shared with extNode / backend (CWSP_CONTROL_*). */
// WHY: Cursor.exe steals :19875/:19876 → ERR_EMPTY_RESPONSE on desk.
const DEFAULT_CONTROL_PORT = 29110;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

markNeutralinoBoot();
markWebnativeBoot();

function applyAuthGlobals(auth: { port: number; key: string }): NeutralinoAuth {
    const shaped: NeutralinoAuth = { port: auth.port, key: auth.key };
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: { port: number; key: string };
        __NEUTRALINO_AUTH__?: NeutralinoAuth;
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
        __CWS_NODE_CLIPBOARD_HUB__?: boolean;
    };
    g.__WEBNATIVE_AUTH__ = { port: auth.port, key: auth.key };
    g.__NEUTRALINO_AUTH__ = shaped;
    g.__CWS_WEBNATIVE_BOOT__ = true;
    g.__CWS_NEUTRALINO_BOOT__ = true;
    g.__CWS_NODE_CLIPBOARD_HUB__ = true;
    return shaped;
}

/**
 * Push AirPad/Network credentials into Node clipboard-hub.
 * WHY: gateway closes /ws with 4001 without client/access token; WebView owns
 * the saved token, Node owns the clipboard socket.
 */
async function syncClipboardHubCredentials(auth: { port: number; key: string }): Promise<void> {
    try {
        // WHY: dynamic import — static airpad/config pulls probe IIFEs and delayed first paint.
        const { getRemoteHost, getAccessToken, getAirPadClientId } = await import(
            "views/airpad/config/config"
        );
        const remoteHost = getRemoteHost().trim();
        const accessToken = getAccessToken().trim();
        const clientId = getAirPadClientId().trim();
        const body: Record<string, string | boolean> = {};
        if (remoteHost) body.remoteHost = remoteHost;
        if (accessToken) {
            body.accessToken = accessToken;
            body.clientToken = accessToken;
        }
        if (clientId) body.clientId = clientId;
        // WHY: boot sync must not tear a healthy Node /ws (Connected→Disconnected race).
        // Control reloads only when values actually change; keep reload=false as belt/suspenders.
        body.reload = false;
        if (!Object.keys(body).filter((k) => k !== "reload").length) return;
        const ctrl = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
            ? AbortSignal.timeout(2000)
            : undefined;
        await fetch(`http://127.0.0.1:${auth.port}/service/clipboard-hub`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": auth.key
            },
            body: JSON.stringify(body),
            cache: "no-store",
            signal: ctrl
        });
        // Also drop a file auth mirror for reconnects before WebView is up next time.
        try {
            const g = globalThis as unknown as {
                NL_PATH?: string;
                Neutralino?: { filesystem?: { writeFile: (p: string, d: string) => Promise<void> } };
            };
            const root = typeof g.NL_PATH === "string" ? g.NL_PATH : "";
            const writeFile = g.Neutralino?.filesystem?.writeFile;
            if (root && writeFile) {
                // WHY: do not write WAN remoteHost as hubUrl — that made WAN the first
                // reconnect candidate and caused post-boot disconnect flaps.
                await writeFile(
                    `${root}/.tmp/cwsp-hub-auth.json`,
                    JSON.stringify(
                        {
                            remoteHost: remoteHost || undefined,
                            accessToken: accessToken || undefined,
                            clientToken: accessToken || undefined,
                            clientId: clientId || undefined,
                            writtenAt: new Date().toISOString()
                        },
                        null,
                        2
                    )
                );
            }
        } catch {
            /* filesystem optional */
        }
    } catch (error) {
        console.warn("[CWSP Neutralino] clipboard-hub credential sync skipped", error);
    }
}

function registerArm(auth: NeutralinoAuth): void {
    try {
        const arm = createNeutralinoSettingsArm(auth);
        if (arm) registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
    } catch (error) {
        console.warn("[CWSP] settings arm registration skipped", error);
    }
}

function initialAuth(): { port: number; key: string } {
    // Prefer inject / prior globals only when they look like control-RPC (not NL_PORT=8434).
    const existing = readNeutralinoAuth();
    if (
        existing &&
        typeof existing.port === "number" &&
        existing.key &&
        existing.port !== 8434 &&
        Number(existing.port) > 1024
    ) {
        return { port: existing.port, key: String(existing.key) };
    }
    return { port: DEFAULT_CONTROL_PORT, key: DEFAULT_CONTROL_KEY };
}

async function readAuthFromPackageFile(): Promise<{ port: number; key: string } | null> {
    try {
        const g = globalThis as unknown as {
            NL_PATH?: string;
            Neutralino?: {
                filesystem?: { readFile: (p: string) => Promise<string> };
            };
        };
        const root = typeof g.NL_PATH === "string" ? g.NL_PATH : "";
        const readFile = g.Neutralino?.filesystem?.readFile;
        if (!root || !readFile) return null;
        const raw = await readFile(`${root}/.tmp/cwsp-control-auth.json`);
        const parsed = JSON.parse(raw) as { port?: number; key?: string };
        if (typeof parsed.port === "number" && typeof parsed.key === "string") {
            return { port: parsed.port, key: parsed.key };
        }
    } catch {
        /* auth file not ready yet */
    }
    return null;
}

/** Background: refresh auth from disk / live control host without blocking first paint. */
function refreshControlAuthInBackground(timeoutMs = 15000): void {
    const deadline = Date.now() + timeoutMs;
    const tick = async (): Promise<void> => {
        while (Date.now() < deadline) {
            const fromFile = await readAuthFromPackageFile();
            if (fromFile) {
                const auth = applyAuthGlobals(fromFile);
                registerArm(auth);
                try {
                    const res = await fetch(`http://127.0.0.1:${fromFile.port}/service/config`, {
                        headers: { "X-API-Key": fromFile.key },
                        cache: "no-store"
                    });
                    if (res.ok) {
                        console.log("[CWSP Neutralino] control host ready", fromFile.port);
                        try {
                            // WHY: Neutralino port:0 used to change WebView origin every launch
                            // and wipe localStorage AirPad settings. Hydrate from portable SoT.
                            const body = (await res.json()) as {
                                settings?: Record<string, unknown>;
                                portable?: Record<string, unknown>;
                            };
                            const settings = body.settings || body.portable || {};
                            const { syncAirpadRemoteConfigFromAppSettings } = await import(
                                "views/airpad/config/config"
                            );
                            syncAirpadRemoteConfigFromAppSettings(settings as never, {
                                persist: true
                            });
                        } catch (error) {
                            console.warn("[CWSP Neutralino] airpad hydrate from portable skipped", error);
                        }
                        await syncClipboardHubCredentials(fromFile);
                        return;
                    }
                } catch {
                    /* retry */
                }
            }
            await new Promise((r) => setTimeout(r, 400));
        }
        console.warn("[CWSP Neutralino] control host still warming — clipboard/settings will retry on use");
    };
    void tick();
}

async function boot(): Promise<void> {
    // Prefer disk auth before first paint when ready — avoids Cursor-owned :19875 empty replies.
    let seed = initialAuth();
    try {
        const fromFile = await Promise.race([
            readAuthFromPackageFile(),
            new Promise<null>((r) => setTimeout(() => r(null), 400))
        ]);
        if (fromFile) seed = fromFile;
    } catch {
        /* ignore */
    }
    const auth = applyAuthGlobals(seed);
    registerArm(auth);
    try {
        const fallback = createWebnativeSettingsArm();
        if (fallback && !auth) registerSettingsSyncArm("webnative", fallback as SettingsSyncArm);
    } catch {
        /* ignore */
    }

    refreshControlAuthInBackground();
    await bootMinimal(document.body, "network");
    try {
        document.getElementById("cwsp-boot-fallback")?.remove();
    } catch {
        /* ignore */
    }
    // Best-effort: sync tokens only after auth file/globals point at a live control port.
    void (async () => {
        const live = (await readAuthFromPackageFile()) || auth;
        applyAuthGlobals(live);
        await syncClipboardHubCredentials(live);
    })();
    // WHY: clipboard prompt UI is an independent Neutralino process spawned by Node hub
    // (clipboard-prompt-host). Main WebView window.create re-runs extensions and is dead.
    // Do not start clipboard-prompt-bridge here.
}

void boot().catch((error: unknown) => {
    console.error("[CWSP Neutralino] minimal-shell boot failed", error);
    try {
        const el = document.getElementById("cwsp-boot-fallback");
        if (el) {
            el.textContent = `CWSP boot failed: ${error instanceof Error ? error.message : String(error)}`;
        }
    } catch {
        /* ignore */
    }
});
