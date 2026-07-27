/*
 * Filename: Clipboardy.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/executor/Clipboardy.ts
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Resolve cwsp-shared via @fest-lib alias (Node loader).
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
    extractClipboardContent,
    normalizeDataAssetEnvelope,
    type DataAssetEnvelope
} from "@fest-lib/cwsp-shared/v2/index.ts";

export interface ClipboardExecutorOptions {
    /** Persist inline asset bytes under this directory as `<hash>.<ext>`. */
    assetDir?: string;
    /** Ignore identical text apply/write echoes for this window (default 400ms). */
    echoSuppressMs?: number;
    /** Force in-memory store even when clipboardy is available. */
    memoryOnly?: boolean;
}

export interface ClipboardMemorySnapshot {
    text: string;
    asset: DataAssetEnvelope | null;
    lastAssetPath: string | null;
    memoryOnly: boolean;
    ready: boolean;
}

export interface ClipboardApplyResult {
    applied: boolean;
    suppressed: boolean;
    text?: string;
    asset?: DataAssetEnvelope;
    assetPath?: string | null;
}

type ClipboardyModule = {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
};

export interface ClipboardExecutor {
    readText(): Promise<string>;
    writeText(text: string): Promise<string>;
    applyPacket(packet: unknown): Promise<ClipboardApplyResult>;
    isReady(): Promise<boolean>;
    getMemorySnapshot(): ClipboardMemorySnapshot;
}

const DEFAULT_ECHO_SUPPRESS_MS = 400;

function resolveAssetDir(options: ClipboardExecutorOptions): string | undefined {
    const fromOpt = typeof options.assetDir === "string" ? options.assetDir.trim() : "";
    if (fromOpt) {
        return path.resolve(fromOpt);
    }
    const fromEnv = String(process.env.CWS_CLIPBOARD_ASSET_DIR ?? "").trim();
    return fromEnv ? path.resolve(fromEnv) : undefined;
}

function extFromAsset(asset: DataAssetEnvelope): string {
    const named = path.extname(asset.name || "");
    if (named.length > 1) {
        return named.slice(1).toLowerCase();
    }
    const mime = String(asset.mimeType || "").toLowerCase();
    if (mime === "image/png") return "png";
    if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
    if (mime === "image/webp") return "webp";
    if (mime === "image/gif") return "gif";
    if (mime === "image/svg+xml") return "svg";
    if (mime === "application/pdf") return "pdf";
    if (mime.startsWith("text/")) return "txt";
    return "bin";
}

/**
 * Decode data-url or bare base64 payload bytes.
 * NOTE: URL/file sources are not fetched here — only inline carriers.
 */
function decodeInlineAssetBytes(data: string): Buffer | null {
    const raw = String(data ?? "");
    if (!raw) {
        return null;
    }
    if (raw.startsWith("data:")) {
        const comma = raw.indexOf(",");
        if (comma < 0) {
            return null;
        }
        const meta = raw.slice(0, comma);
        const body = raw.slice(comma + 1);
        if (/;base64/i.test(meta)) {
            return Buffer.from(body, "base64");
        }
        try {
            return Buffer.from(decodeURIComponent(body), "utf8");
        } catch {
            return Buffer.from(body, "utf8");
        }
    }
    // Bare base64 (common clipboard asset carrier).
    try {
        const buf = Buffer.from(raw, "base64");
        // Reject obvious non-base64 garbage that decodes to empty.
        if (buf.length === 0 && raw.length > 0) {
            return null;
        }
        return buf;
    } catch {
        return null;
    }
}

async function loadClipboardy(): Promise<ClipboardyModule | null> {
    try {
        const mod = await import("clipboardy");
        return ((mod as { default?: ClipboardyModule }).default ??
            mod) as ClipboardyModule;
    } catch {
        return null;
    }
}

/**
 * Local clipboard apply/read/write for WebNative Node backends.
 *
 * WHY: OS clipboard (clipboardy) is text-only; DataAsset bytes persist to
 * `assetDir` / `CWS_CLIPBOARD_ASSET_DIR` when present, never into the OS clip.
 * INVARIANT: after writeText/applyPacket, identical text is ignored for
 * `echoSuppressMs` to avoid local watch echo storms.
 */
export function createClipboardExecutor(
    options: ClipboardExecutorOptions = {}
): ClipboardExecutor {
    const echoSuppressMs =
        typeof options.echoSuppressMs === "number" && options.echoSuppressMs >= 0
            ? options.echoSuppressMs
            : DEFAULT_ECHO_SUPPRESS_MS;
    const memoryOnly = options.memoryOnly === true;
    const assetDir = resolveAssetDir(options);

    let memoryText = "";
    let memoryAsset: DataAssetEnvelope | null = null;
    let lastAssetPath: string | null = null;
    let suppressText: string | null = null;
    let suppressUntil = 0;
    let clipboardyPromise: Promise<ClipboardyModule | null> | null = null;
    let ready = true;

    const getDriver = async (): Promise<ClipboardyModule | null> => {
        if (memoryOnly) {
            return null;
        }
        if (!clipboardyPromise) {
            clipboardyPromise = loadClipboardy();
        }
        return clipboardyPromise;
    };

    const markEcho = (text: string): void => {
        suppressText = text;
        suppressUntil = Date.now() + echoSuppressMs;
    };

    const isEchoSuppressed = (text: string): boolean => {
        if (suppressText === null) {
            return false;
        }
        if (Date.now() > suppressUntil) {
            suppressText = null;
            return false;
        }
        return suppressText === text;
    };

    const persistAsset = async (
        asset: DataAssetEnvelope
    ): Promise<string | null> => {
        if (!assetDir) {
            return null;
        }
        const inline = typeof asset.data === "string" ? asset.data : "";
        if (!inline) {
            return null;
        }
        const source = String(asset.source || "").toLowerCase();
        const looksInline =
            source.includes("base64") ||
            source.includes("data") ||
            inline.startsWith("data:") ||
            /^[A-Za-z0-9+/=\r\n]+$/.test(inline);
        if (!looksInline) {
            return null;
        }
        const bytes = decodeInlineAssetBytes(inline);
        if (!bytes || bytes.length === 0) {
            return null;
        }
        await mkdir(assetDir, { recursive: true });
        const filePath = path.join(assetDir, `${asset.hash}.${extFromAsset(asset)}`);
        await writeFile(filePath, bytes);
        lastAssetPath = filePath;
        return filePath;
    };

    const writeLocalText = async (text: string): Promise<string> => {
        const value = String(text ?? "");
        memoryText = value;
        markEcho(value);
        const driver = await getDriver();
        if (driver) {
            try {
                await driver.write(value);
            } catch {
                // COMPAT: headless / missing display — keep memory store.
            }
        }
        return value;
    };

    return {
        async readText(): Promise<string> {
            const driver = await getDriver();
            if (driver) {
                try {
                    const value = String((await driver.read()) ?? "");
                    memoryText = value;
                    return value;
                } catch {
                    // fall through to memory
                }
            }
            return memoryText;
        },

        async writeText(text: string): Promise<string> {
            return writeLocalText(text);
        },

        async applyPacket(packet: unknown): Promise<ClipboardApplyResult> {
            const content = extractClipboardContent(packet);
            if (!content) {
                return { applied: false, suppressed: false };
            }

            const text = content.text;
            if (typeof text === "string" && isEchoSuppressed(text)) {
                return {
                    applied: false,
                    suppressed: true,
                    text,
                    asset: content.asset,
                    assetPath: lastAssetPath
                };
            }

            let assetPath: string | null = null;
            let asset = content.asset;
            if (asset) {
                const normalized = normalizeDataAssetEnvelope(asset) ?? asset;
                memoryAsset = normalized;
                asset = normalized;
                assetPath = await persistAsset(normalized);
            }

            if (typeof text === "string") {
                await writeLocalText(text);
                return {
                    applied: true,
                    suppressed: false,
                    text,
                    asset,
                    assetPath
                };
            }

            // Asset-only packet: do not touch OS clipboard text.
            return {
                applied: true,
                suppressed: false,
                asset,
                assetPath
            };
        },

        async isReady(): Promise<boolean> {
            // Memory fallback always keeps the executor ready.
            ready = true;
            if (!memoryOnly) {
                await getDriver();
            }
            return ready;
        },

        getMemorySnapshot(): ClipboardMemorySnapshot {
            return {
                text: memoryText,
                asset: memoryAsset,
                lastAssetPath,
                memoryOnly,
                ready
            };
        }
    };
}
