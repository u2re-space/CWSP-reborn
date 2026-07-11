/*
 * Filename: entry.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/neutralino/web/entry.ts
 * Change date and time: 17.55.00_11.07.2026
 * Reason for changes: Wait for Node control auth then register settings arm + boot network.
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
const DEFAULT_CONTROL_PORT = 18765;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

document.documentElement.dataset.cwspEnabledViews = enabledViews.join(",");

// WHY: Neutralino reuses the WebNative settings surface (same /service/config
// control-RPC contract), so both boot flags are marked. The settings-sync-adapter
// detects `__CWS_WEBNATIVE_BOOT__` and resolves the arm registered below.
markNeutralinoBoot();
markWebnativeBoot();

function applyAuthGlobals(auth: { port: number; key: string }): NeutralinoAuth {
    const shaped: NeutralinoAuth = { port: auth.port, key: auth.key };
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: { port: number; key: string };
        __NEUTRALINO_AUTH__?: NeutralinoAuth;
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
    };
    g.__WEBNATIVE_AUTH__ = { port: auth.port, key: auth.key };
    g.__NEUTRALINO_AUTH__ = shaped;
    g.__CWS_WEBNATIVE_BOOT__ = true;
    g.__CWS_NEUTRALINO_BOOT__ = true;
    return shaped;
}

/** Probe GET /service/config until the Node control host answers. */
async function probeControl(auth: { port: number; key: string }): Promise<boolean> {
    try {
        const res = await fetch(`http://127.0.0.1:${auth.port}/service/config`, {
            headers: { "X-API-Key": auth.key },
            cache: "no-store"
        });
        return res.ok;
    } catch {
        return false;
    }
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

/**
 * Resolve control-RPC auth for the settings arm.
 * Prefers published `.tmp/cwsp-control-auth.json`, then globals, then loopback defaults.
 * Waits briefly for the backend control host to accept connections.
 */
async function ensureControlAuth(timeoutMs = 12000): Promise<NeutralinoAuth | null> {
    const deadline = Date.now() + timeoutMs;
    let candidate =
        (await readAuthFromPackageFile()) ||
        (() => {
            const existing = readNeutralinoAuth();
            if (existing && typeof existing.port === "number" && existing.key) {
                return { port: existing.port, key: String(existing.key) };
            }
            return { port: DEFAULT_CONTROL_PORT, key: DEFAULT_CONTROL_KEY };
        })();

    applyAuthGlobals(candidate);

    while (Date.now() < deadline) {
        const fromFile = await readAuthFromPackageFile();
        if (fromFile) {
            candidate = fromFile;
            applyAuthGlobals(candidate);
        }
        if (await probeControl(candidate)) {
            return applyAuthGlobals(candidate);
        }
        await new Promise((r) => setTimeout(r, 250));
    }

    // Soft-fail: still register arm with defaults so Save can retry later.
    console.warn("[CWSP Neutralino] control host not ready — using default auth arm");
    return applyAuthGlobals(candidate);
}

async function boot(): Promise<void> {
    try {
        const neutralinoAuth = await ensureControlAuth();
        if (neutralinoAuth) {
            const arm = createNeutralinoSettingsArm(neutralinoAuth);
            if (arm) registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
        } else {
            const arm = createWebnativeSettingsArm();
            if (arm) registerSettingsSyncArm("webnative", arm as SettingsSyncArm);
        }
    } catch (error) {
        console.warn("[CWSP] settings arm registration skipped", error);
    }

    await bootMinimal(document.body, "network");
}

void boot().catch((error: unknown) => {
    console.error("[CWSP Neutralino] minimal-shell boot failed", error);
});
