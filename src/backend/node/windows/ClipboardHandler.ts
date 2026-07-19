/*
 * Filename: ClipboardHandler.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/ClipboardHandler.ts
 * Change date and time: 12.35.00_19.07.2026
 * Reason for changes: Expose ContainsImage for Neutralino clipboard-hub image poll (PS1, not clipboardy).
 *   2026-07-19: Harden ContainsImage/GetImage against clipboard lock after idle
 *   ("Requested Clipboard operation did not succeed") — retry in PS, soft-fail
 *   probe to false so hub lastError / UI err= is not poisoned every poll.
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
        stdinText = ""
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
        const env: Record<string, string | undefined> = { ...process.env };
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

try {
    $sourceImage = [System.Drawing.Image]::FromStream(
        $inputStream
    )

    # Clone before clipboard ownership.
    $bitmap = [System.Drawing.Bitmap]::new(
        $sourceImage
    )

    $data = New-Object System.Windows.Forms.DataObject
    $data.SetImage($bitmap)

    # WHY: Capacitor/Chrome prefer PNG format; Bitmap alone is flaky across processes.
    $pngStream = New-Object System.IO.MemoryStream
    $bitmap.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
    [void]$pngStream.Seek(0, 'Begin')
    $data.SetData("PNG", $false, $pngStream)

    [System.Windows.Forms.Clipboard]::Clear()
    # copy=$true persists after this PS child exits (SetImage alone often evaporates).
    [System.Windows.Forms.Clipboard]::SetDataObject($data, $true)
    Start-Sleep -Milliseconds 350

    if (-not [System.Windows.Forms.Clipboard]::ContainsImage()) {
        throw "Clipboard.SetDataObject did not stick (ContainsImage=false)"
    }

    [Console]::Out.Write("OK")
}
finally {
    if ($null -ne $sourceImage) {
        $sourceImage.Dispose()
    }

    $inputStream.Dispose()
}
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
        value: string
    ): Promise<void> {
        const base64 = validateBase64(
            value,
            this.maxImageBytes
        );

        return this.serial(() => {
            return this.retry(async () => {
                await this.powershell.run(
                    WRITE_IMAGE_PS_SCRIPT,
                    base64
                );
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