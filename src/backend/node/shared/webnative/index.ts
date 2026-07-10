/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/webnative/index.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream B — optional clipboard executor on WebNative Node bootstrap.
 */

import path from "node:path";

import {
    createNodeSettingsBackend,
    toSettingsSyncArm,
    type CreateNodeSettingsBackendOptions,
    type NodeSettingsBackend
} from "../settings/index.ts";
import {
    createClipboardExecutor,
    type ClipboardExecutor,
    type ClipboardExecutorOptions
} from "../executor/Clipboardy.ts";
import {
    createWebnativeControlServer,
    type CreateWebnativeControlOptions,
    type WebnativeControlAuth,
    type WebnativeControlServer
} from "./control.ts";

export {
    createNodeSettingsBackend,
    toSettingsSyncArm,
    createWebnativeControlServer,
    createClipboardExecutor
};
export type {
    CreateNodeSettingsBackendOptions,
    NodeSettingsBackend,
    CreateWebnativeControlOptions,
    WebnativeControlAuth,
    WebnativeControlServer,
    ClipboardExecutor,
    ClipboardExecutorOptions
};

export interface StartWebnativeBackendOptions {
    /** Platform label for diagnostics (`windows` | `linux`). */
    platform: "windows" | "linux";
    /** Override portable config path. */
    configPath?: string;
    /** Optional static frontend root hint (e.g. build/webnative). Not served yet. */
    publicDir?: string;
    /** Fixed control port (tests). */
    controlPort?: number;
    /** Injected API key (tests). */
    apiKey?: string;
    /**
     * When true, attach a local clipboard executor on the runtime.
     * WHY: settings/control stay default; clipboard is opt-in until WS wiring lands.
     */
    enableClipboard?: boolean;
    /** Forwarded to createClipboardExecutor when enableClipboard is set. */
    clipboard?: ClipboardExecutorOptions;
}

export interface WebnativeBackendRuntime {
    platform: "windows" | "linux";
    settings: NodeSettingsBackend;
    control: WebnativeControlServer;
    /** Absolute path the shell should load as WebView content when packaging. */
    publicDir: string;
    auth: WebnativeControlAuth;
    /** Present only when `enableClipboard` was true. */
    clipboard?: ClipboardExecutor;
    close(): Promise<void>;
}

/**
 * Start the thin WebNative Node backend: settings store + loopback /service/config.
 *
 * NOTE: Full `@mindw1n/webnative` packaging (WebView2 / AppImage) is deferred.
 * This runtime is enough for settings:get/patch persistence and later shell hosting.
 */
export async function startWebnativeBackend(
    options: StartWebnativeBackendOptions
): Promise<WebnativeBackendRuntime> {
    const publicDir = path.resolve(
        options.publicDir ?? path.join(process.cwd(), "build", "webnative")
    );
    const settings = createNodeSettingsBackend({
        filePath: options.configPath
    });
    const control = await createWebnativeControlServer({
        backend: settings,
        port: options.controlPort,
        apiKey: options.apiKey
    });

    const clipboard = options.enableClipboard
        ? createClipboardExecutor(options.clipboard)
        : undefined;

    return {
        platform: options.platform,
        settings,
        control,
        publicDir,
        auth: control.auth,
        clipboard,
        close: async () => {
            // Clipboard executor is currently stateless (no watchers); detach only.
            await control.close();
        }
    };
}
