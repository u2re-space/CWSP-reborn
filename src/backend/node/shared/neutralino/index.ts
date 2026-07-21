/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/index.ts
 * Change date and time: 15.22.00_21.07.2026
 * Reason for changes: Export the files-hub SoT (createFilesHub + types) so the
 *   Neutralino backend and the hardlinked generic/ mirror can consume it.
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
import {
    createFilesHub,
    type FilesHubFile,
    type FilesHubIngressInput,
    type FilesHubOptions,
    type FilesHubPhaseEvent,
    type FilesHubRuntime,
    type FilesHubSession,
    type FilesIncomingOffer,
    type FilesPromptKind,
    type FilesPromptState,
    type FilesPutBlobInput,
    type FilesPutBlobResult
} from "./files-hub.ts";

export {
    createNeutralinoControlServer,
    createClipboardHub,
    createClipboardPromptHost,
    createFilesHub
};
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
    ClipboardPromptHostOptions,
    FilesHubFile,
    FilesHubIngressInput,
    FilesHubOptions,
    FilesHubPhaseEvent,
    FilesHubRuntime,
    FilesHubSession,
    FilesIncomingOffer,
    FilesPromptKind,
    FilesPromptState,
    FilesPutBlobInput,
    FilesPutBlobResult
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
    onClipboardPromptAction?: (
        action: "share" | "dismiss" | "erase" | "accept" | "undo" | "take"
    ) => Promise<boolean | { applied: boolean; text?: string; hasImage?: boolean }>;
    /**
     * Absolute paths → filesHub.ingressLocalPaths (POST /service/files-ingress).
     * WHY: Neutralino Network drop-zone Open-for-Share without Explorer Copy.
     */
    onFilesIngress?: (input: {
        paths?: string[];
        fromClipboard?: boolean;
    }) => Promise<Record<string, unknown>>;
    /** GET /service/files-blob/:transferId/:batchId?token= — Cap large-batch pull. */
    onFilesBlobGet?: (
        transferId: string,
        batchId: string,
        token: string
    ) => Promise<{ bytes: Buffer; mimeType: string; name: string } | null>;
}

/** CRX Extension default Local hub port — cleartext Control alias when free. */
export const NEUTRALINO_CONTROL_HUB_ALIAS_PORT = 8434;

export interface NeutralinoBackendRuntime {
    platform: "windows" | "linux";
    settings: NodeSettingsBackend;
    control: NeutralinoControlServer;
    /** Extra /service/config listener (e.g. :8434) when primary is :29110. */
    controlAlias: NeutralinoControlServer | null;
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
    const controlShared = {
        backend: settings,
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
        onClipboardPromptAction: options.onClipboardPromptAction,
        onFilesIngress: options.onFilesIngress,
        onFilesBlobGet: options.onFilesBlobGet
    };

    const control = await createNeutralinoControlServer({
        ...controlShared,
        port: options.controlPort
    });

    // WHY: CRX Extension Local hub URL defaults to http(s)://127.0.0.1:8434 — expose the
    // same /service/config SoT there when the port is free (skip if local CWSP hub owns it).
    let controlAlias: NeutralinoControlServer | null = null;
    const primaryPort = control.auth.port;
    if (primaryPort !== NEUTRALINO_CONTROL_HUB_ALIAS_PORT) {
        try {
            controlAlias = await createNeutralinoControlServer({
                ...controlShared,
                host: "127.0.0.1",
                port: NEUTRALINO_CONTROL_HUB_ALIAS_PORT,
                strictPort: true
            });
            console.log(
                JSON.stringify({
                    channel: "cwsp-control",
                    event: "alias-listen",
                    port: NEUTRALINO_CONTROL_HUB_ALIAS_PORT,
                    primaryPort,
                    path: "/service/config"
                })
            );
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.log(
                JSON.stringify({
                    channel: "cwsp-control",
                    event: "alias-skip",
                    port: NEUTRALINO_CONTROL_HUB_ALIAS_PORT,
                    reason: msg.includes("EADDRINUSE") ? "EADDRINUSE" : msg
                })
            );
            controlAlias = null;
        }
    }

    return {
        platform: options.platform,
        settings,
        control,
        controlAlias,
        publicDir,
        auth: control.auth,
        close: async () => {
            if (controlAlias) await controlAlias.close();
            await control.close();
        }
    };
}
