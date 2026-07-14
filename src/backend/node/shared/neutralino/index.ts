/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/index.ts
 * Change date and time: 17.55.00_14.07.2026
 * Reason for changes: Re-export clipboard prompt types (ClipboardPromptState/Kind/Mode/Action)
 *   and plumb onClipboardPromptGet/onClipboardPromptAction through startNeutralinoBackend
 *   so the control RPC /service/clipboard-prompt routes the popup UI to the hub.
 */

import path from "node:path";

import {
    createNodeSettingsBackend,
    type NodeSettingsBackend
} from "../settings/index.ts";
import {
    createNeutralinoControlServer,
    type NeutralinoControlAuth,
    type NeutralinoControlServer
} from "./control.ts";
import {
    createClipboardHub,
    type ClipboardHubAdapters,
    type ClipboardHubOptions,
    type ClipboardHubRuntime,
    type ClipboardHubStatus,
    type ClipboardPromptState,
    type ClipboardPromptKind,
    type ClipboardPromptMode,
    type ClipboardPromptAction
} from "./clipboard-hub.ts";
import {
    createClipboardPromptHost,
    type ClipboardPromptHost,
    type ClipboardPromptHostOptions
} from "./clipboard-prompt-host.ts";

export { createNeutralinoControlServer, createClipboardHub, createClipboardPromptHost };
export type {
    NeutralinoControlAuth,
    NeutralinoControlServer,
    ClipboardHubAdapters,
    ClipboardHubOptions,
    ClipboardHubRuntime,
    ClipboardHubStatus,
    ClipboardPromptState,
    ClipboardPromptKind,
    ClipboardPromptMode,
    ClipboardPromptAction,
    ClipboardPromptHost,
    ClipboardPromptHostOptions
};

export interface StartNeutralinoBackendOptions {
    platform: "windows" | "linux";
    configPath?: string;
    publicDir?: string;
    controlPort?: number;
    apiKey?: string;
    shellMeta?: Record<string, unknown>;
    onDispatch?: (packet: unknown) => Promise<unknown>;
    onClipboard?: {
        read(opts?: { kind?: string }): Promise<unknown>;
        write(payload: Record<string, unknown>): Promise<unknown>;
    };
    /** Node-owned clipboard /ws hub status for GET /service/clipboard-hub. */
    onClipboardHubStatus?: () => Record<string, unknown> | Promise<Record<string, unknown>>;
    onClipboardHubReload?: () => void | Promise<void>;
    /** Clipboard prompt state for GET /service/clipboard-prompt (popup UI polling). */
    onClipboardPromptGet?: () => Record<string, unknown> | null | Promise<Record<string, unknown> | null>;
    /** Resolve the active clipboard prompt (POST /service/clipboard-prompt). */
    onClipboardPromptAction?: (action: "share" | "dismiss" | "erase" | "accept" | "undo") => Promise<boolean>;
}

export interface NeutralinoBackendRuntime {
    platform: "windows" | "linux";
    settings: NodeSettingsBackend;
    control: NeutralinoControlServer;
    publicDir: string;
    auth: NeutralinoControlAuth;
    close(): Promise<void>;
}

/**
 * Start the thin Neutralino Node backend: settings store + loopback control RPC.
 *
 * NOTE: Full Neutralino packaging is via `npm run build:neutralino`. This runtime
 * is enough for settings:get/patch and for the extNode bridge to share auth.
 */
export async function startNeutralinoBackend(
    options: StartNeutralinoBackendOptions
): Promise<NeutralinoBackendRuntime> {
    const publicDir = path.resolve(
        options.publicDir ?? path.join(process.cwd(), "build", "neutralino")
    );
    const settings = createNodeSettingsBackend({
        filePath: options.configPath
    });
    const control = await createNeutralinoControlServer({
        backend: settings,
        port: options.controlPort,
        apiKey: options.apiKey,
        shellMeta: {
            platform: options.platform,
            publicDir,
            applicationId: "com.u2re.cwsp-reborn",
            ...(options.shellMeta ?? {})
        },
        onDispatch: options.onDispatch,
        onClipboard: options.onClipboard,
        onClipboardHubStatus: options.onClipboardHubStatus,
        onClipboardHubReload: options.onClipboardHubReload,
        onClipboardPromptGet: options.onClipboardPromptGet,
        onClipboardPromptAction: options.onClipboardPromptAction
    });

    return {
        platform: options.platform,
        settings,
        control,
        publicDir,
        auth: control.auth,
        close: async () => {
            await control.close();
        }
    };
}
