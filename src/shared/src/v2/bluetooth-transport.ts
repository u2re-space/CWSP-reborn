/**
 * FIND:bluetooth
 * TAG:device-aliases,network
 *
 * Classic Bluetooth (RFCOMM) frame for clipboard / images / files ≤ 2 MiB.
 * WHY: phones on LTE (or any host with no gateway) still need a direct path;
 * BLE MTU is too small, so the wire is length-prefixed RFCOMM, not GATT notify.
 *
 * INVARIANT: payload bytes never exceed {@link BLUETOOTH_MAX_BYTES}.
 * INVARIANT: same CWSP meaning as /ws — header.kind maps onto clipboard/files.
 */

export const BLUETOOTH_MAX_BYTES = 2 * 1024 * 1024;
export const BLUETOOTH_SERVICE_UUID = "6e757265-4357-5350-4254-000000000001";
export const BLUETOOTH_SERVICE_NAME = "CWSP";
export const BLUETOOTH_MAGIC = "CWSB";
export const BLUETOOTH_FRAME_VERSION = 1;

export type BluetoothPayloadKind =
    | "hello"
    | "clipboard-text"
    | "clipboard-image"
    | "file"
    | "packet";

export interface BluetoothFrameHeader {
    kind: BluetoothPayloadKind;
    fromId: string;
    toId?: string;
    name?: string;
    mimeType?: string;
    size: number;
    uuid?: string;
    what?: string;
    /** Fleet token; never log. */
    auth?: string;
}

export interface BluetoothFrame {
    header: BluetoothFrameHeader;
    payload: Uint8Array;
}

export class BluetoothFrameError extends Error {
    readonly code: string;
    constructor(code: string, message: string) {
        super(message);
        this.name = "BluetoothFrameError";
        this.code = code;
    }
}

const KIND_SET = new Set<BluetoothPayloadKind>([
    "hello",
    "clipboard-text",
    "clipboard-image",
    "file",
    "packet",
]);

export function assertBluetoothSize(bytes: number): void {
    if (!Number.isFinite(bytes) || bytes < 0) {
        throw new BluetoothFrameError("bt-size", "invalid payload size");
    }
    if (bytes > BLUETOOTH_MAX_BYTES) {
        throw new BluetoothFrameError(
            "bt-too-large",
            `bluetooth payload ${bytes} exceeds ${BLUETOOTH_MAX_BYTES}`,
        );
    }
}

export function encodeBluetoothFrame(
    header: BluetoothFrameHeader,
    payload: Uint8Array | string = new Uint8Array(),
): Uint8Array {
    const body = typeof payload === "string" ? utf8(payload) : payload;
    assertBluetoothSize(body.byteLength);
    const head: BluetoothFrameHeader = {
        ...header,
        kind: header.kind,
        fromId: String(header.fromId || "").trim(),
        size: body.byteLength,
    };
    if (!head.fromId) throw new BluetoothFrameError("bt-from", "fromId required");
    if (!KIND_SET.has(head.kind)) throw new BluetoothFrameError("bt-kind", "unknown kind");
    const headBytes = utf8(JSON.stringify(head));
    const out = new Uint8Array(4 + 1 + 4 + headBytes.byteLength + 4 + body.byteLength);
    out.set(utf8(BLUETOOTH_MAGIC), 0);
    out[4] = BLUETOOTH_FRAME_VERSION;
    writeU32(out, 5, headBytes.byteLength);
    out.set(headBytes, 9);
    writeU32(out, 9 + headBytes.byteLength, body.byteLength);
    out.set(body, 13 + headBytes.byteLength);
    return out;
}

export function decodeBluetoothFrame(bytes: Uint8Array): BluetoothFrame {
    if (!bytes || bytes.byteLength < 13) {
        throw new BluetoothFrameError("bt-short", "frame too short");
    }
    const magic = String.fromCharCode(bytes[0]!, bytes[1]!, bytes[2]!, bytes[3]!);
    if (magic !== BLUETOOTH_MAGIC) {
        throw new BluetoothFrameError("bt-magic", "not a CWSP bluetooth frame");
    }
    if (bytes[4] !== BLUETOOTH_FRAME_VERSION) {
        throw new BluetoothFrameError("bt-version", `unsupported frame version ${bytes[4]}`);
    }
    const headerLen = readU32(bytes, 5);
    if (headerLen <= 0 || 9 + headerLen + 4 > bytes.byteLength) {
        throw new BluetoothFrameError("bt-header", "header length out of range");
    }
    const headerJson = utf8decode(bytes.subarray(9, 9 + headerLen));
    let parsed: BluetoothFrameHeader;
    try {
        parsed = JSON.parse(headerJson) as BluetoothFrameHeader;
    } catch {
        throw new BluetoothFrameError("bt-json", "header is not JSON");
    }
    const payloadLen = readU32(bytes, 9 + headerLen);
    assertBluetoothSize(payloadLen);
    const start = 13 + headerLen;
    if (start + payloadLen > bytes.byteLength) {
        throw new BluetoothFrameError("bt-payload", "payload truncated");
    }
    const kind = String(parsed.kind || "") as BluetoothPayloadKind;
    if (!KIND_SET.has(kind)) throw new BluetoothFrameError("bt-kind", "unknown kind");
    const header: BluetoothFrameHeader = {
        ...parsed,
        kind,
        fromId: String(parsed.fromId || "").trim(),
        size: payloadLen,
    };
    if (!header.fromId) throw new BluetoothFrameError("bt-from", "fromId required");
    return { header, payload: bytes.subarray(start, start + payloadLen) };
}

export function bluetoothKindForPacket(packet: unknown): BluetoothPayloadKind {
    const rec = asRecord(packet);
    const what = String(rec.what || rec.type || rec.action || "").toLowerCase();
    const payload = asRecord(rec.payload) || asRecord(rec.data) || {};
    if (payload.asset || payload.image || payload.dataAsset) {
        const asset = asRecord(payload.asset) || asRecord(payload.image) || asRecord(payload.dataAsset) || {};
        const mime = String(asset.mimeType || asset.type || "").toLowerCase();
        return mime.startsWith("image/") ? "clipboard-image" : "file";
    }
    if (what.startsWith("clipboard")) {
        return payload.text != null || payload.content != null || payload.body != null
            ? "clipboard-text"
            : "packet";
    }
    if (what.startsWith("files:")) return "packet";
    return "packet";
}

/**
 * When to take the Bluetooth path.
 * Hub-primary unless {@code preferBluetooth}; BT is the no-gateway / send-fail bypass.
 */
export function shouldUseBluetoothBypass(opts: {
    enabled?: boolean;
    preferBluetooth?: boolean;
    hubOpen?: boolean;
    peerOpen?: boolean;
    payloadBytes?: number;
}): boolean {
    if (opts.enabled === false) return false;
    const size = opts.payloadBytes ?? 0;
    if (size > BLUETOOTH_MAX_BYTES) return false;
    if (opts.preferBluetooth) return true;
    if (opts.hubOpen && !opts.preferBluetooth) return false;
    return !opts.hubOpen && !opts.peerOpen;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null;
}

function utf8(text: string): Uint8Array {
    return new TextEncoder().encode(text);
}

function utf8decode(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
}

function writeU32(buf: Uint8Array, offset: number, value: number): void {
    buf[offset] = (value >>> 24) & 0xff;
    buf[offset + 1] = (value >>> 16) & 0xff;
    buf[offset + 2] = (value >>> 8) & 0xff;
    buf[offset + 3] = value & 0xff;
}

function readU32(buf: Uint8Array, offset: number): number {
    return ((buf[offset]! << 24) | (buf[offset + 1]! << 16) | (buf[offset + 2]! << 8) | buf[offset + 3]!) >>> 0;
}
