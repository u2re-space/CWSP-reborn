/*
 * Filename: store.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/settings/store.ts
 * Change date and time: 05.15.00_17.07.2026
 * Reason for changes: Pass-II — file-backed settings:get/patch/persist for WebNative Node backends.
 *   2026-07-17: DEFAULT_NODE_SETTINGS.shell includes clipboard prompt modes so
 *   clipboard-hub resolvePromptSettings does not silently fall back to "auto".
 */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { mergeSettingsPatch } from "./merge.ts";
import type {
    CreateNodeSettingsBackendOptions,
    NodeSettingsBackend,
    SettingsBlob,
    SettingsPatch
} from "./types.ts";

/**
 * Minimal desktop defaults — no secrets, no host-specific tokens.
 * WHY: WebNative shells need a non-empty core shape so settings/network views
 * can hydrate; real fleet values come from patches or operator-owned config.
 */
export const DEFAULT_NODE_SETTINGS: SettingsBlob = {
    core: {
        mode: "endpoint",
        roles: ["endpoint", "requestor-initiated", "responser-initiated"],
        bridge: {
            enabled: true,
            mode: "active",
            endpoints: [],
            preconnect: {
                enabled: true,
                targets: [],
                reconnectMs: 1000
            }
        },
        endpointIDs: {},
        ops: {
            httpTargets: [],
            allowUnencrypted: false,
            allowInsecureTls: true,
            logLevel: "info",
            // Neutralino Node clipboard-hub default ingress (override via CWSP_HUB_URL).
            hubUrl: "https://192.168.0.200:8434/"
        }
    },
    // WHY: clipboard-hub reads these via dig(settings, ["shell", ...]). Without them,
    // every inbound prompt defaulted to auto+Undo even when the UI showed Ask.
    shell: {
        clipboardOutboundMode: "auto",
        clipboardInboundMode: "auto",
        clipboardOutboundShowErase: true,
        clipboardInboundShowUndo: true,
        clipboardPromptDismissMs: 10000
    }
};

function asRecord(value: unknown): SettingsBlob {
    return value !== null && typeof value === "object" && !Array.isArray(value)
        ? (value as SettingsBlob)
        : {};
}

async function readJsonFile(filePath: string): Promise<SettingsBlob | null> {
    try {
        const raw = await readFile(filePath, "utf8");
        return asRecord(JSON.parse(raw));
    } catch (error) {
        const code = (error as NodeJS.ErrnoException)?.code;
        if (code === "ENOENT") return null;
        // COMPAT: corrupt/partial writes fall back to defaults rather than crashing the shell.
        return null;
    }
}

/**
 * Atomic JSON write: temp file in the same directory, then rename.
 * WHY: WebNative packaging expects durable `portable.config.json`; a crash mid-write
 * must not leave a truncated file as the only copy.
 */
async function writeJsonAtomic(filePath: string, value: SettingsBlob): Promise<void> {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    const body = `${JSON.stringify(value, null, 2)}\n`;
    await writeFile(tmpPath, body, "utf8");
    await rename(tmpPath, filePath);
}

/**
 * Create a file-backed Node settings backend (settings:get / settings:patch / persist).
 *
 * Ownership: this store owns the portable config file for the WebNative desktop contour.
 * Endpoint child reload hooks can wrap `patch` later; this layer only persists.
 */
export function createNodeSettingsBackend(
    options: CreateNodeSettingsBackendOptions = {}
): NodeSettingsBackend {
    const filePath = path.resolve(options.filePath ?? path.join(process.cwd(), "portable.config.json"));
    const defaults = mergeSettingsPatch(DEFAULT_NODE_SETTINGS, options.defaults ?? {});
    let cache: SettingsBlob | null = null;

    const load = async (): Promise<SettingsBlob> => {
        if (cache) return { ...cache };
        const disk = await readJsonFile(filePath);
        cache = disk ? mergeSettingsPatch(defaults, disk) : { ...defaults };
        return { ...cache };
    };

    const save = async (next: SettingsBlob): Promise<SettingsBlob> => {
        cache = { ...next };
        await writeJsonAtomic(filePath, cache);
        return { ...cache };
    };

    return {
        filePath,
        get: async () => load(),
        patch: async (patch: SettingsPatch) => {
            const current = await load();
            return save(mergeSettingsPatch(current, patch));
        },
        persist: async () => {
            const current = await load();
            return save(current);
        },
        defaults: async () => ({ ...defaults }),
        snapshot: async () => load()
    };
}

/**
 * Adapt a Node settings backend into the frontend SettingsSyncArm shape
 * (`get` / `patch` / optional `defaults` / `snapshot`) without importing the view module.
 */
export function toSettingsSyncArm(backend: NodeSettingsBackend) {
    return {
        get: () => backend.get(),
        patch: (patch: SettingsPatch) => backend.patch(patch),
        defaults: () => backend.defaults(),
        snapshot: () => backend.snapshot()
    };
}
