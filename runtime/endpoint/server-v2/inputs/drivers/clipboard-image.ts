/*
 * Filename: clipboard-image.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/inputs/drivers/clipboard-image.ts
 * Change date and time: 21.45.00_10.07.2026
 * Reason for changes: Write image DataAsset bytes to OS clipboard (clipboardy is text-only).
 *
 * WHY: Phone share-target sends clipboard:update { asset }. Without OS image write,
 * DST desk only got text (or nothing after asset-only fix). Windows uses WinForms
 * Clipboard.SetImage; Linux uses xclip when available.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;

/** Decode inline base64 / data-url from a DataAssetEnvelope. */
export const decodeAssetImageBytes = (asset: Record<string, unknown>): { bytes: Buffer; mime: string } | null => {
    const data = String(asset.data || "").trim();
    if (!data) return null;
    let mime = String(asset.mimeType || asset.type || "application/octet-stream").toLowerCase();
    let b64 = data;
    if (data.startsWith("data:")) {
        const comma = data.indexOf(",");
        if (comma < 0) return null;
        const meta = data.slice(5, comma);
        b64 = data.slice(comma + 1);
        const mimeMatch = meta.match(/^([^;]+)/);
        if (mimeMatch?.[1]) mime = mimeMatch[1].toLowerCase();
    }
    if (!mime.startsWith("image/")) return null;
    try {
        const bytes = Buffer.from(b64.replace(/\s+/g, ""), "base64");
        if (!bytes.length) return null;
        return { bytes, mime };
    } catch {
        return null;
    }
};

const extForMime = (mime: string): string => {
    if (mime.includes("png")) return "png";
    if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
    if (mime.includes("gif")) return "gif";
    if (mime.includes("webp")) return "webp";
    if (mime.includes("bmp")) return "bmp";
    return "png";
};

const writeImageWindows = (bytes: Buffer, mime: string): boolean => {
    const dir = mkdtempSync(join(tmpdir(), "cwsp-clip-"));
    const file = join(dir, `asset.${extForMime(mime)}`);
    try {
        writeFileSync(file, bytes);
        // WHY: stdin/base64 on the command line blows past ARG_MAX for multi-MB shares.
        // Load from a temp file, convert to Bitmap, SetImage on the STA clipboard.
        const ps = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$path = ${JSON.stringify(file)}
$img = [System.Drawing.Image]::FromFile($path)
try {
  [System.Windows.Forms.Clipboard]::SetImage($img)
} finally {
  $img.Dispose()
}
`;
        const result = spawnSync("powershell", ["-NoProfile", "-STA", "-Command", ps], {
            encoding: "utf8",
            timeout: 20_000
        });
        if (result.error) throw result.error;
        if (result.status !== 0) {
            throw new Error((result.stderr || result.stdout || "SetImage failed").trim());
        }
        return true;
    } catch (error) {
        console.warn("[clipboard-image] Windows write failed:", String((error as Error)?.message || error));
        return false;
    } finally {
        try {
            rmSync(dir, { recursive: true, force: true });
        } catch {
            /* ignore */
        }
    }
};

const writeImageLinux = (bytes: Buffer, mime: string): boolean => {
    const dir = mkdtempSync(join(tmpdir(), "cwsp-clip-"));
    const file = join(dir, `asset.${extForMime(mime)}`);
    try {
        writeFileSync(file, bytes);
        const type = mime.startsWith("image/") ? mime : "image/png";
        const result = spawnSync("xclip", ["-selection", "clipboard", "-t", type, "-i", file], {
            encoding: "utf8",
            timeout: 10_000
        });
        if (result.error) throw result.error;
        if (result.status !== 0) {
            throw new Error((result.stderr || result.stdout || "xclip failed").trim());
        }
        return true;
    } catch (error) {
        console.warn("[clipboard-image] Linux write failed:", String((error as Error)?.message || error));
        return false;
    } finally {
        try {
            rmSync(dir, { recursive: true, force: true });
        } catch {
            /* ignore */
        }
    }
};

/**
 * Write an image DataAsset to the OS clipboard when possible.
 * @returns true when the platform clipboard accepted the image
 */
export const writeClipboardImageAsset = async (asset: unknown): Promise<boolean> => {
    const root = asRecord(asset);
    if (!root) return false;
    const decoded = decodeAssetImageBytes(root);
    if (!decoded) return false;
    if (process.platform === "win32") {
        return writeImageWindows(decoded.bytes, decoded.mime);
    }
    if (process.platform === "linux") {
        return writeImageLinux(decoded.bytes, decoded.mime);
    }
    // macOS: osascript / pbcopy image path is non-trivial; persist-only for now.
    console.warn("[clipboard-image] OS image clipboard not implemented for", process.platform);
    return false;
};

export default writeClipboardImageAsset;
