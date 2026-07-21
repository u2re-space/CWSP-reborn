/*
 * Filename: ClipboardHandler.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/ClipboardHandler.ts
 * Change date and time: 17.10.00_21.07.2026
 * Reason for changes: Expose ContainsImage for Neutralino clipboard-hub image poll (PS1, not clipboardy).
 *   2026-07-19: Harden ContainsImage/GetImage against clipboard lock after idle
 *   ("Requested Clipboard operation did not succeed") — retry in PS, soft-fail
 *   probe to false so hub lastError / UI err= is not poisoned every poll.
 *   2026-07-21: Add ContainsFileDropList / GetFileDropList (CF_HDROP) so Windows
 *   Explorer "Copy" file lists can be detected and diverted to files-hub
 *   instead of being silently dropped (text/image-only handlers cannot see them).
 *   2026-07-21j: writeImageBase64 also persists PNG + CF_HDROP on the same
 *   DataObject so Accept pastes as image AND as file (Explorer / Word / Paint).
 *   2026-07-21n: CF_HDROP basename from CWSP_CLIPBOARD_IMAGE_NAME (DataAsset.name).
 *   2026-07-21q: stop -<hash8> collision suffixes on HDROP (wire SHA ≠ saved PNG).
 *
 * Clipboard implementation for:
 *   - Neutralinojs
 *   - Clipboardy
 *   - Node.js
 *   - Windows PowerShell
 *
 * Protocol:
 *
 * Read text:
 *   {
 *     "id": 1,
 *     "type": "clipboard.read",
 *     "payload": {
 *       "kind": "text"
 *     }
 *   }
 *
 * Read image:
 *   {
 *     "id": 2,
 *     "type": "clipboard.read",
 *     "payload": {
 *       "kind": "image"
 *     }
 *   }
 *
 * Write text:
 *   {
 *     "id": 3,
 *     "type": "clipboard.write",
 *     "payload": {
 *       "kind": "text",
 *       "data": "Hello"
 *     }
 *   }
 *
 * Write image:
 *   {
 *     "id": 4,
 *     "type": "clipboard.write",
 *     "payload": {
 *       "kind": "image",
 *       "data": "<base64>"
 *     }
 *   }
 */

import clipboard from "clipboardy";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";


export type ClipboardKind = "text" | "image";


export interface ClipboardReadPayload {
    kind?: ClipboardKind;
}


export interface ClipboardWritePayload {
    kind: ClipboardKind;
    data: string;
    mime?: string;
}


export interface ClipboardProtocolRequest {
    id?: string | number | null;
    type?: string;
    method?: string;
    payload?: unknown;
    params?: unknown;
}


export interface ClipboardProtocolSuccess {
    id: string | number | null;
    ok: true;
    result: {
        kind: ClipboardKind;
        data: string;
        mime?: string;
    };
}


export interface ClipboardProtocolFailure {
    id: string | number | null;
    ok: false;
    error: {
        code: string;
        message: string;
    };
}


export type ClipboardProtocolResponse =
    | ClipboardProtocolSuccess
    | ClipboardProtocolFailure;


export interface ClipboardServiceOptions {
    powershellPath?: string;
    timeoutMs?: number;
    retries?: number;
    maxImageBytes?: number;
}


interface PowerShellResult {
    stdout: string;
    stderr: string;
}


function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}


function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


function getString(
    value: unknown,
    fieldName: string
): string {
    if (typeof value !== "string") {
        throw new Error(`${fieldName} must be a string`);
    }

    return value;
}


function getPayload(
    request: ClipboardProtocolRequest
): Record<string, unknown> {
    const payload = request.payload ?? request.params ?? {};

    if (!isRecord(payload)) {
        throw new Error("Protocol payload must be an object");
    }

    return payload;
}


function normalizeBase64(value: string): string {
    const dataUrlMatch = value.match(
        /^data:[^;]+;base64,(.*)$/s
    );

    const base64 = dataUrlMatch
        ? dataUrlMatch[1]
        : value;

    return base64.replace(/\s/g, "");
}


function validateBase64(
    value: string,
    maxBytes: number
): string {
    const base64 = normalizeBase64(value);

    if (base64.length === 0) {
        throw new Error("Image Base64 data is empty");
    }

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
        throw new Error("Invalid Base64 image data");
    }

    const bytes = Buffer.from(base64, "base64");

    if (bytes.length === 0) {
        throw new Error("Decoded image is empty");
    }

    if (bytes.length > maxBytes) {
        throw new Error(
            `Image is too large: ${bytes.length} bytes, ` +
            `maximum is ${maxBytes} bytes`
        );
    }

    return base64;
}


class PowerShellRunner {
    private readonly executable: string;
    private readonly timeoutMs: number;

    public constructor(
        options: ClipboardServiceOptions = {}
    ) {
        this.executable =
            options.powershellPath ||
            process.env.CWSP_POWERSHELL ||
            (process.platform === "win32"
                ? "powershell.exe"
                : "pwsh");

        this.timeoutMs = options.timeoutMs ?? 15_000;
    }

    public async run(
        script: string,
        stdinText = "",
        extraEnv?: Record<string, string>
    ): Promise<PowerShellResult> {
        if (process.platform !== "win32") {
            throw new Error(
                "PowerShell clipboard implementation is available only on Windows"
            );
        }

        // WHY: prefer `-File` over `-Command -` — stdin scripts from Node hidden
        // children were observed to SetDataObject(OK) then evaporate for siblings.
        let payloadPath: string | null = null;
        let scriptPath: string | null = null;
        const env: Record<string, string | undefined> = { ...process.env, ...(extraEnv || {}) };
        if (stdinText) {
            payloadPath = path.join(
                os.tmpdir(),
                `cwsp-clip-${Date.now()}-${Math.random().toString(16).slice(2)}.b64`
            );
            fs.writeFileSync(payloadPath, String(stdinText), "utf8");
            env.CWSP_CLIPBOARD_B64_FILE = payloadPath;
        }

        scriptPath = path.join(
            os.tmpdir(),
            `cwsp-clip-${Date.now()}-${Math.random().toString(16).slice(2)}.ps1`
        );
        fs.writeFileSync(scriptPath, String(script).replace(/^\uFEFF/, ""), "utf8");

        try {
            return await new Promise<PowerShellResult>((resolve, reject) => {
                const child = spawn(
                    this.executable,
                    [
                        "-NoLogo",
                        "-NoProfile",
                        "-NonInteractive",
                        "-ExecutionPolicy",
                        "Bypass",
                        "-STA",
                        "-File",
                        scriptPath as string
                    ],
                    {
                        windowsHide: true,
                        env,
                        stdio: ["ignore", "pipe", "pipe"]
                    }
                );

                let stdout = "";
                let stderr = "";
                let settled = false;

                const timer = setTimeout(() => {
                    if (settled) return;
                    settled = true;
                    child.kill();
                    reject(
                        new Error(
                            `PowerShell clipboard operation timed out after ` +
                                `${this.timeoutMs} ms`
                        )
                    );
                }, this.timeoutMs);

                child.stdout.setEncoding("utf8");
                child.stderr.setEncoding("utf8");
                child.stdout.on("data", (chunk: string) => {
                    stdout += chunk;
                });
                child.stderr.on("data", (chunk: string) => {
                    stderr += chunk;
                });

                child.once("error", (error) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timer);
                    reject(error);
                });

                child.once("close", (code, signal) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timer);
                    if (code !== 0) {
                        const details = stderr.trim();
                        reject(
                            new Error(
                                `PowerShell exited with code ${code}` +
                                    (signal ? `, signal ${signal}` : "") +
                                    (details ? `: ${details}` : "")
                            )
                        );
                        return;
                    }
                    resolve({ stdout, stderr });
                });
            });
        } finally {
            if (payloadPath) {
                try {
                    fs.unlinkSync(payloadPath);
                } catch {
                    /* ignore */
                }
            }
            if (scriptPath) {
                try {
                    fs.unlinkSync(scriptPath);
                } catch {
                    /* ignore */
                }
            }
        }
    }
}


/**
 * WHY: after long idle / KVM / other apps, OpenClipboard fails with
 * ExternalException "Requested Clipboard operation did not succeed".
 * Probe must soft-fail (false), not kill the poll with exit code 1.
 */
const HAS_IMAGE_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Continue"
Add-Type -AssemblyName System.Windows.Forms
$has = $false
for ($i = 0; $i -lt 5; $i++) {
    try {
        $has = [System.Windows.Forms.Clipboard]::ContainsImage()
        break
    } catch {
        Start-Sleep -Milliseconds (40 * ($i + 1))
    }
}
[Console]::Out.Write($(if ($has) { "true" } else { "false" }))
`;

const READ_IMAGE_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Emit-PngBase64([System.Drawing.Image] $image) {
    $stream = [System.IO.MemoryStream]::new()
    try {
        $image.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
        $base64 = [Convert]::ToBase64String($stream.ToArray())
        if ([string]::IsNullOrWhiteSpace($base64)) {
            throw "Encoded clipboard image Base64 is empty"
        }
        [Console]::Out.Write($base64)
    }
    finally {
        $stream.Dispose()
    }
}

# WHY: retry OpenClipboard contention after idle (same ExternalException as ContainsImage).
$image = $null
$data = $null
$lastErr = $null
for ($i = 0; $i -lt 5; $i++) {
    try {
        $image = [System.Windows.Forms.Clipboard]::GetImage()
        $data = [System.Windows.Forms.Clipboard]::GetDataObject()
        $lastErr = $null
        break
    } catch {
        $lastErr = $_.Exception.Message
        Start-Sleep -Milliseconds (50 * ($i + 1))
    }
}
if ($null -ne $lastErr -and $null -eq $image -and $null -eq $data) {
    throw ("CLIPBOARD_BUSY: " + $lastErr)
}

if ($null -ne $image) {
    try {
        Emit-PngBase64 $image
    }
    finally {
        $image.Dispose()
    }
    return
}

# COMPAT: some apps only place PNG bytes (no CF_BITMAP).
if ($null -ne $data -and $data.GetDataPresent("PNG")) {
    $png = $data.GetData("PNG")
    if ($png -is [System.IO.MemoryStream]) {
        $bytes = $png.ToArray()
        $base64 = [Convert]::ToBase64String($bytes)
        if ([string]::IsNullOrWhiteSpace($base64)) {
            throw "PNG clipboard stream Base64 is empty"
        }
        [Console]::Out.Write($base64)
        return
    }
}

$fmtList = if ($null -ne $data) { ($data.GetFormats() -join ",") } else { "<null>" }
throw "Clipboard does not contain an image (formats=$fmtList)"
`;

/** True when Windows refused OpenClipboard (idle lock / contention). */
export function isClipboardBusyError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error || "");
    return /CLIPBOARD_BUSY|Clipboard operation did not succeed|ExternalException|OpenClipboard/i.test(
        msg
    );
}


const WRITE_IMAGE_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# WHY: base64 arrives via temp file (CWSP_CLIPBOARD_B64_FILE) — stdin is the PS script.
$b64File = $env:CWSP_CLIPBOARD_B64_FILE
if ([string]::IsNullOrWhiteSpace($b64File) -or -not (Test-Path -LiteralPath $b64File)) {
    throw "Image Base64 input file is missing"
}
$base64 = [System.IO.File]::ReadAllText($b64File)

if ([string]::IsNullOrWhiteSpace($base64)) {
    throw "Image Base64 input is empty"
}

$bytes = [Convert]::FromBase64String(
    $base64.Trim()
)

$inputStream = [System.IO.MemoryStream]::new(
    $bytes
)

$sourceImage = $null
$bitmap = $null
$pngStream = $null
$effectStream = $null

try {
    $sourceImage = [System.Drawing.Image]::FromStream(
        $inputStream
    )

    # Clone before clipboard ownership.
    $bitmap = [System.Drawing.Bitmap]::new(
        $sourceImage
    )

    # WHY: also stage a real PNG so CF_HDROP can coexist with CF_DIB/PNG —
    # Accept then pastes into Paint/Word as image AND into Explorer as a file.
    $persistDir = Join-Path $env:TEMP "cwsp-clipboard-images"
    if (-not (Test-Path -LiteralPath $persistDir)) {
        New-Item -ItemType Directory -Force -Path $persistDir | Out-Null
    }
    $sha = [System.BitConverter]::ToString(
        [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    ).Replace("-", "").Substring(0, 16).ToLowerInvariant()
    # WHY: prefer original DataAsset name for CF_HDROP paste (Explorer shows it).
    # Content is always PNG after Bitmap.Save — keep basename, force .png.
    $wantedRaw = [string]$env:CWSP_CLIPBOARD_IMAGE_NAME
    $safeBase = ""
    if (-not [string]::IsNullOrWhiteSpace($wantedRaw)) {
        $leaf = [System.IO.Path]::GetFileName($wantedRaw.Trim())
        $safeBase = [System.IO.Path]::GetFileNameWithoutExtension($leaf)
        $safeBase = ($safeBase -replace '[<>:"/\\|?*\x00-\x1F]', '_').Trim().TrimEnd('.')
        if ($safeBase.Length -gt 120) { $safeBase = $safeBase.Substring(0, 120) }
    }
    if ([string]::IsNullOrWhiteSpace($safeBase)) {
        $safeBase = "cwsp-" + $sha
    }
    $outPath = Join-Path $persistDir ($safeBase + ".png")
    # WHY: clipboard Accept is last-wins for a given basename. Never append
    # "-<hash8>" — comparing wire-byte SHA to on-disk PNG after Bitmap.Save
    # almost always mismatches and mangled real names (photo.png → photo-a1b2c3d4.png).
    $bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $data = New-Object System.Windows.Forms.DataObject
    $data.SetImage($bitmap)

    # WHY: Capacitor/Chrome prefer PNG format; Bitmap alone is flaky across processes.
    $pngStream = New-Object System.IO.MemoryStream
    $bitmap.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
    [void]$pngStream.Seek(0, 'Begin')
    $data.SetData("PNG", $false, $pngStream)

    $sc = New-Object System.Collections.Specialized.StringCollection
    [void]$sc.Add($outPath)
    $data.SetFileDropList($sc)

    # WHY: hint Explorer that paste is Copy (not Move) for the HDROP path.
    $effectStream = New-Object System.IO.MemoryStream(,[BitConverter]::GetBytes([int]1))
    $data.SetData("Preferred DropEffect", $false, $effectStream)

    [System.Windows.Forms.Clipboard]::Clear()
    # copy=$true persists after this PS child exits (SetImage alone often evaporates).
    [System.Windows.Forms.Clipboard]::SetDataObject($data, $true)
    Start-Sleep -Milliseconds 350

    if (-not [System.Windows.Forms.Clipboard]::ContainsImage()) {
        throw "Clipboard.SetDataObject did not stick (ContainsImage=false)"
    }

    # OK|<absolute-png-path> — Node seeds HDROP fingerprint so poll won't divert to files-hub.
    [Console]::Out.Write("OK|" + $outPath)
}
finally {
    if ($null -ne $sourceImage) {
        $sourceImage.Dispose()
    }

    $inputStream.Dispose()
}
`;


/**
 * WHY: Windows Explorer "Copy" places a CF_HDROP file list on the clipboard.
 * `clipboardy` cannot see it (text/image only). Probe must soft-fail to false
 * on clipboard lock so the hub poll is not poisoned every tick.
 * INVARIANT: returns true only when a real file drop list is present.
 */
const HAS_FILE_DROP_LIST_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Continue"
Add-Type -AssemblyName System.Windows.Forms
$has = $false
for ($i = 0; $i -lt 5; $i++) {
    try {
        $has = [System.Windows.Forms.Clipboard]::ContainsFileDropList()
        break
    } catch {
        Start-Sleep -Milliseconds (40 * ($i + 1))
    }
}
[Console]::Out.Write($(if ($has) { "true" } else { "false" }))
`;

/**
 * WHY: write absolute file paths as CF_HDROP so Explorer Paste / CWSP re-forward
 * can pick them up after inbound Accept (shell.filesCopyOnReceive).
 * Paths arrive via CWSP_CLIPBOARD_B64_FILE (newline-separated), same as image write.
 * INVARIANT: only existing files are added; empty list is a no-op.
 */
const WRITE_FILE_DROP_LIST_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms

$pathFile = $env:CWSP_CLIPBOARD_B64_FILE
if (-not $pathFile -or -not (Test-Path -LiteralPath $pathFile)) {
    throw "CWSP_CLIPBOARD_B64_FILE missing for SetFileDropList"
}
$lines = Get-Content -LiteralPath $pathFile -ErrorAction Stop
$sc = New-Object System.Collections.Specialized.StringCollection
foreach ($line in $lines) {
    $p = [string]$line
    if ([string]::IsNullOrWhiteSpace($p)) { continue }
    if (Test-Path -LiteralPath $p -PathType Leaf) {
        [void]$sc.Add($p)
    }
}
if ($sc.Count -le 0) {
    [Console]::Out.Write("EMPTY")
    return
}
$lastErr = $null
for ($i = 0; $i -lt 5; $i++) {
    try {
        [System.Windows.Forms.Clipboard]::SetFileDropList($sc)
        [Console]::Out.Write("OK:" + $sc.Count)
        exit 0
    } catch {
        $lastErr = $_
        Start-Sleep -Milliseconds (40 * ($i + 1))
    }
}
throw ("SetFileDropList failed: " + $lastErr)
`;

/**
 * WHY: read the CF_HDROP file list as absolute paths. Only existing files are
 * returned; directories are skipped (files-hub ingressLocalPaths expects files).
 * Paths are NUL-separated on stdout so spaces / unicode survive intact.
 * INVARIANT: throws on clipboard lock; the hub soft-skips on busy.
 */
const READ_FILE_DROP_LIST_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms

$paths = $null
$lastErr = $null
for ($i = 0; $i -lt 5; $i++) {
    try {
        $paths = [System.Windows.Forms.Clipboard]::GetFileDropList()
        $lastErr = $null
        break
    } catch {
        $lastErr = $_.Exception.Message
        Start-Sleep -Milliseconds (50 * ($i + 1))
    }
}
if ($null -ne $lastErr -and $null -eq $paths) {
    throw ("CLIPBOARD_BUSY: " + $lastErr)
}
if ($null -eq $paths) {
    [Console]::Out.Write("")
    return
}
$filtered = New-Object System.Collections.Generic.List[string]
foreach ($p in $paths) {
    if ([string]::IsNullOrWhiteSpace($p)) { continue }
    try {
        $full = [System.IO.Path]::GetFullPath($p)
        if ([System.IO.File]::Exists($full)) {
            $filtered.Add($full)
        }
    } catch {
        # skip invalid / inaccessible paths
    }
}
# WHY: join on NUL ([char]0) — safe separator (Windows filenames cannot contain
# NUL) and avoids PowerShell backtick escapes which conflict with JS template
# literal syntax. Node splits the stdout on "\0".
$sep = [char]0
[Console]::Out.Write(($filtered -join $sep))
`;


export class ClipboardService {
    private readonly powershell: PowerShellRunner;
    private readonly retries: number;
    private readonly maxImageBytes: number;

    /*
     * Clipboard is a global resource.
     * Serialize all operations to prevent races between read/write calls.
     */
    private queue: Promise<void> = Promise.resolve();

    public constructor(
        options: ClipboardServiceOptions = {}
    ) {
        this.powershell = new PowerShellRunner(options);
        this.retries = Math.max(1, options.retries ?? 3);
        this.maxImageBytes =
            options.maxImageBytes ?? 64 * 1024 * 1024;
    }

    private serial<T>(
        operation: () => Promise<T>
    ): Promise<T> {
        const next = this.queue.then(
            operation,
            operation
        );

        this.queue = next.then(
            () => undefined,
            () => undefined
        );

        return next;
    }

    private async retry<T>(
        operation: () => Promise<T>
    ): Promise<T> {
        let lastError: unknown;

        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                if (attempt < this.retries) {
                    await sleep(80 * attempt);
                }
            }
        }

        throw lastError instanceof Error
            ? lastError
            : new Error(String(lastError));
    }

    public async readText(): Promise<string> {
        return this.serial(() => {
            return this.retry(async () => {
                return clipboard.read();
            });
        });
    }

    public async writeText(text: string): Promise<void> {
        return this.serial(() => {
            return this.retry(async () => {
                await clipboard.write(text);
            });
        });
    }

    /**
     * WHY: image sync must not call GetImage() every poll — ContainsImage is cheap.
     * clipboardy cannot see CF_BITMAP / PNG clipboard formats.
     * INVARIANT: clipboard lock after idle → false (never throw to hub lastError).
     */
    public async containsImage(): Promise<boolean> {
        return this.serial(async () => {
            try {
                return await this.retry(async () => {
                    const result = await this.powershell.run(HAS_IMAGE_PS_SCRIPT);
                    return result.stdout.trim().toLowerCase() === "true";
                });
            } catch (error) {
                // Soft-fail: busy clipboard is normal after sleep/KVM/other apps.
                if (isClipboardBusyError(error)) {
                    return false;
                }
                // Exit-code probes that still mention the classic lock text.
                const msg = error instanceof Error ? error.message : String(error);
                if (/Clipboard operation did not succeed/i.test(msg)) {
                    return false;
                }
                throw error instanceof Error ? error : new Error(String(error));
            }
        });
    }

    public async readImageBase64(): Promise<string> {
        return this.serial(() => {
            return this.retry(async () => {
                const result = await this.powershell.run(
                    READ_IMAGE_PS_SCRIPT
                );

                const base64 = normalizeBase64(
                    result.stdout.trim()
                );

                validateBase64(
                    base64,
                    this.maxImageBytes
                );

                return base64;
            });
        });
    }

    public async writeImageBase64(
        value: string,
        opts?: { fileName?: string }
    ): Promise<{ filePath?: string }> {
        const base64 = validateBase64(
            value,
            this.maxImageBytes
        );
        const fileName = String(opts?.fileName || "").trim();

        return this.serial(() => {
            return this.retry(async () => {
                const extraEnv = fileName
                    ? { CWSP_CLIPBOARD_IMAGE_NAME: fileName }
                    : undefined;
                const result = await this.powershell.run(
                    WRITE_IMAGE_PS_SCRIPT,
                    base64,
                    extraEnv
                );
                const out = String(result.stdout || "").trim();
                // COMPAT: older scripts printed bare "OK"; new prints "OK|<path>".
                if (out === "OK" || out.startsWith("OK|")) {
                    const filePath = out.startsWith("OK|") ? out.slice(3).trim() : "";
                    return filePath ? { filePath } : {};
                }
                return {};
            });
        });
    }

    /**
     * WHY: cheap probe for CF_HDROP file lists (Explorer "Copy" on files).
     * INVARIANT: clipboard lock after idle → false (never throw to hub lastError).
     */
    public async containsFileDropList(): Promise<boolean> {
        return this.serial(async () => {
            try {
                return await this.retry(async () => {
                    const result = await this.powershell.run(HAS_FILE_DROP_LIST_PS_SCRIPT);
                    return result.stdout.trim().toLowerCase() === "true";
                });
            } catch (error) {
                if (isClipboardBusyError(error)) {
                    return false;
                }
                const msg = error instanceof Error ? error.message : String(error);
                if (/Clipboard operation did not succeed/i.test(msg)) {
                    return false;
                }
                throw error instanceof Error ? error : new Error(String(error));
            }
        });
    }

    /**
     * WHY: read CF_HDROP file list as absolute existing file paths.
     * Returns empty array when no list is present or all entries are
     * directories / inaccessible. NUL-separated in PS to preserve spaces.
     */
    public async readFileDropList(): Promise<string[]> {
        return this.serial(() => {
            return this.retry(async () => {
                const result = await this.powershell.run(READ_FILE_DROP_LIST_PS_SCRIPT);
                const raw = String(result.stdout || "");
                if (!raw) return [];
                return raw
                    .split("\0")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0);
            });
        });
    }

    /**
     * WHY: after inbound files Accept, put landed paths on CF_HDROP so the user
     * can Paste in Explorer or re-forward via CWSP Network (filesCopyOnReceive).
     */
    public async writeFileDropList(paths: string[]): Promise<number> {
        const clean = (paths || [])
            .map((p) => String(p || "").trim())
            .filter((p) => p.length > 0);
        if (clean.length === 0) return 0;
        return this.serial(() => {
            return this.retry(async () => {
                const result = await this.powershell.run(
                    WRITE_FILE_DROP_LIST_PS_SCRIPT,
                    clean.join("\n")
                );
                const out = String(result.stdout || "").trim();
                if (out === "EMPTY") return 0;
                const m = /^OK:(\d+)$/.exec(out);
                return m ? Number(m[1]) : clean.length;
            });
        });
    }

    public async read(
        kind: ClipboardKind = "text"
    ): Promise<{
        kind: ClipboardKind;
        data: string;
        mime?: string;
    }> {
        if (kind === "text") {
            return {
                kind: "text",
                data: await this.readText()
            };
        }

        return {
            kind: "image",
            data: await this.readImageBase64(),
            mime: "image/png"
        };
    }

    public async write(
        kind: ClipboardKind,
        data: string
    ): Promise<void> {
        if (kind === "text") {
            await this.writeText(data);
            return;
        }

        await this.writeImageBase64(data);
    }
}


export class ClipboardProtocolHandler {
    private readonly clipboardService: ClipboardService;

    public constructor(
        options: ClipboardServiceOptions = {}
    ) {
        this.clipboardService = new ClipboardService(options);
    }

    public async handle(
        input: unknown
    ): Promise<ClipboardProtocolResponse> {
        const request = isRecord(input)
            ? input as ClipboardProtocolRequest
            : {};

        const id =
            typeof request.id === "string" ||
            typeof request.id === "number"
                ? request.id
                : null;

        try {
            const operation =
                request.type ||
                request.method;

            if (
                operation !== "clipboard.read" &&
                operation !== "clipboard.write"
            ) {
                throw new Error(
                    `Unsupported clipboard operation: ${String(operation)}`
                );
            }

            const payload = getPayload(request);

            if (operation === "clipboard.read") {
                const requestedKind = payload.kind ?? "text";

                if (
                    requestedKind !== "text" &&
                    requestedKind !== "image"
                ) {
                    throw new Error(
                        "clipboard.read payload.kind must be text or image"
                    );
                }

                const result = await this.clipboardService.read(
                    requestedKind
                );

                return {
                    id,
                    ok: true,
                    result
                };
            }

            const requestedKind = payload.kind;

            if (
                requestedKind !== "text" &&
                requestedKind !== "image"
            ) {
                throw new Error(
                    "clipboard.write payload.kind must be text or image"
                );
            }

            const data = getString(
                payload.data,
                "clipboard.write payload.data"
            );

            await this.clipboardService.write(
                requestedKind,
                data
            );

            return {
                id,
                ok: true,
                result: {
                    kind: requestedKind,
                    data: ""
                }
            };
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);

            return {
                id,
                ok: false,
                error: {
                    code: "CLIPBOARD_ERROR",
                    message
                }
            };
        }
    }
}


export default ClipboardProtocolHandler;