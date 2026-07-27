/*
 * Filename: clipboard.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/socket/handlers/clipboard.ts
 * Change date and time: 22.50.00_11.07.2026
 * Reason for changes: Gateway L-200 relay-only — skip OS clipboard write so inbound
 *   Android packets are forwarded without minting a gateway paste rewrite.
 *
 * WHY: Image shares arrive as clipboard:update { asset }. Skipping write(undefined)
 * fixed text clobber; DST desk still applies images. Gateway must not apply at all.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Promised } from "@utils/Promised.ts";
import type { Packet } from "../types.ts";
import { writeClipboardImageAsset } from "../../../inputs/drivers/clipboard-image.ts";

const loadClipboardAccess = async () => {
    return Promised(Promised(await import("../../../inputs/access/clipboard.ts"))?.default);
};

/** Mirror of server/io/clipboard.isClipboardRelayOnly — keep light (no io import cycle). */
const isRelayOnlyHost = (): boolean => {
    const forced = String(process.env.CWS_CLIPBOARD_RELAY_ONLY || "").toLowerCase();
    if (forced === "1" || forced === "true") return true;
    if (forced === "0" || forced === "false") return false;
    const id = String(
        process.env.CWS_ASSOCIATED_ID ||
            process.env.CWS_BRIDGE_USER_ID ||
            process.env.CWS_BRIDGE_DEVICE_ID ||
            ""
    )
        .trim()
        .toLowerCase()
        .replace(/^l-/, "");
    return id === "200" || id === "192.168.0.200";
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;

const extractAsset = (payload: unknown): Record<string, unknown> | null => {
    const root = asRecord(payload);
    if (!root) return null;
    for (const key of ["asset", "dataAsset", "file", "image"] as const) {
        const asset = asRecord(root[key]);
        if (asset && (asset.hash || asset.data || asset.mimeType || asset.type)) {
            return asset;
        }
    }
    return null;
};

const extractText = (payload: unknown): string | undefined => {
    const root = asRecord(payload);
    if (!root) return typeof payload === "string" ? payload : undefined;
    for (const key of ["text", "content", "body"] as const) {
        const v = root[key];
        if (typeof v === "string") return v;
    }
    return undefined;
};

/** Persist inline base64/data-url asset when CWS_CLIPBOARD_ASSET_DIR is set (desktop retrieval). */
const persistClipboardAsset = (asset: Record<string, unknown>): string | null => {
    const dir = String(process.env.CWS_CLIPBOARD_ASSET_DIR || "").trim();
    if (!dir) return null;
    const data = String(asset.data || "").trim();
    if (!data) return null;
    try {
        let b64 = data;
        let ext = "bin";
        const mime = String(asset.mimeType || asset.type || "application/octet-stream").toLowerCase();
        if (data.startsWith("data:")) {
            const comma = data.indexOf(",");
            if (comma < 0) return null;
            b64 = data.slice(comma + 1);
            if (mime.includes("png")) ext = "png";
            else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
            else if (mime.includes("webp")) ext = "webp";
            else if (mime.includes("gif")) ext = "gif";
        } else if (mime.includes("png")) ext = "png";
        else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
        else if (mime.includes("webp")) ext = "webp";
        else if (mime.includes("gif")) ext = "gif";

        const hash = String(asset.hash || "asset").replace(/[^a-fA-F0-9]/g, "").slice(0, 64) || "asset";
        mkdirSync(dir, { recursive: true });
        const file = join(dir, `${hash}.${ext}`);
        writeFileSync(file, Buffer.from(b64, "base64"));
        return file;
    } catch {
        return null;
    }
};

//
export const handleClipboardAction = async (what: string, payload: any, packet: Packet) => {
    if (isRelayOnlyHost()) {
        return { ok: true, relayOnly: true, what, applied: false };
    }
    const clipboardAccess = await loadClipboardAccess();
    if (!clipboardAccess) return null;
    try {
        switch (what) {
            case "clipboard:update":
            case "clipboard:write": {
                const asset = extractAsset(payload);
                const text = extractText(payload);

                // INVARIANT: asset-only packets must not call write(undefined) — that clobbers DST text clipboard.
                if (asset) {
                    const saved = persistClipboardAsset(asset);
                    // WHY: clipboardy is text-only; images need a platform SetImage / xclip path.
                    const imageWritten = await writeClipboardImageAsset(asset);
                    let textWritten = false;
                    if (typeof text === "string" && text.length > 0
                        && !text.startsWith("content://")
                        && !text.startsWith("file://")) {
                        await clipboardAccess?.write?.(text);
                        textWritten = true;
                    }
                    return {
                        ok: true,
                        asset: true,
                        hash: asset.hash ?? null,
                        savedPath: saved,
                        imageWritten,
                        textWritten
                    };
                }

                if (typeof text === "string") {
                    return clipboardAccess?.write?.(text);
                }
                return { ok: false, reason: "clipboard-empty-payload" };
            }
            case "clipboard:read":
            case "clipboard:get":
                return clipboardAccess?.read?.();
            case "clipboard:clear":
                return clipboardAccess?.clear?.();
            default:
                return null;
        }
    } catch (error: any) {
        return {
            ok: false,
            reason: "clipboard-action-failed",
            what,
            error: error?.message || String(error)
        };
    }
}

//
export const handleClipboardAsk = async (what: string, payload: any, packet: Packet) => {
    const clipboardAccess = await loadClipboardAccess();
    if (!clipboardAccess) return null;
    try {
        switch (what) {
            case "clipboard:isReady":
                return clipboardAccess?.isReady?.();
            default:
                return null;
        }
    } catch (error: any) {
        return {
            ok: false,
            reason: "clipboard-ask-failed",
            what,
            error: error?.message || String(error)
        };
    }
}
