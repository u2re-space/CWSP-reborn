/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/index.ts
 * Change date and time: 16.35.00_11.07.2026
 * Reason for changes: Neutralino Node backend bootstrap (settings + control + optional protocol).
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

export { createNeutralinoControlServer };
export type { NeutralinoControlAuth, NeutralinoControlServer };

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
        onClipboard: options.onClipboard
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
