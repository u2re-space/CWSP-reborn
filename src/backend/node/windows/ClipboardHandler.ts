/*
 * Filename: ClipboardProtocolHandler.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/ClipboardProtocolHandler.ts
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

        return new Promise((resolve, reject) => {
            const child = spawn(
                this.executable,
                [
                    "-NoLogo",
                    "-NoProfile",
                    "-NonInteractive",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-STA",
                    "-Command",
                    "-"
                ],
                {
                    windowsHide: true,
                    stdio: [
                        "pipe",
                        "pipe",
                        "pipe"
                    ]
                }
            );

            let stdout = "";
            let stderr = "";
            let settled = false;

            const timer = setTimeout(() => {
                if (settled) {
                    return;
                }

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
                if (settled) {
                    return;
                }

                settled = true;
                clearTimeout(timer);
                reject(error);
            });

            child.once("close", (code, signal) => {
                if (settled) {
                    return;
                }

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

                resolve({
                    stdout,
                    stderr
                });
            });

            child.stdin.end(stdinText, "utf8");
        });
    }
}


const READ_IMAGE_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$image = [System.Windows.Forms.Clipboard]::GetImage()

if ($null -eq $image) {
    throw "Clipboard does not contain an image"
}

$stream = [System.IO.MemoryStream]::new()

try {
    $image.Save(
        $stream,
        [System.Drawing.Imaging.ImageFormat]::Png
    )

    $base64 = [Convert]::ToBase64String(
        $stream.ToArray()
    )

    [Console]::Out.Write($base64)
}
finally {
    $stream.Dispose()
    $image.Dispose()
}
`;


const WRITE_IMAGE_PS_SCRIPT = String.raw`
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$base64 = [Console]::In.ReadToEnd()

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

try {
    $sourceImage = [System.Drawing.Image]::FromStream(
        $inputStream
    )

    /*
     * Clone the image before putting it into the clipboard.
     * This prevents the clipboard from depending on the input stream.
     */
    $bitmap = [System.Drawing.Bitmap]::new(
        $sourceImage
    )

    [System.Windows.Forms.Clipboard]::SetDataObject(
        $bitmap,
        $true
    )

    [Console]::Out.Write("OK")
}
finally {
    if ($null -ne $bitmap) {
        $bitmap.Dispose()
    }

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