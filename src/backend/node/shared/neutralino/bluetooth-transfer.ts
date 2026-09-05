/**
 * FIND:bluetooth
 * Node helper for CWSP Bluetooth frames (encode + optional send hook).
 * WHY: Neutralino has no RFCOMM stack in-process; Cap Java owns the live radio.
 * This module still resolves destinations and encodes ≤2MiB frames so desk
 * can log / test / plug a future adapter without changing clipboard-hub.
 */

import {
    BLUETOOTH_MAX_BYTES,
    encodeBluetoothFrame,
    shouldUseBluetoothBypass,
    type BluetoothFrameHeader,
    type BluetoothPayloadKind,
} from "@fest-lib/cwsp-shared/v2/index.ts";
import {
    mergeDeviceAliasMap,
    resolveDeviceIds,
    type DeviceAliasRecord,
} from "@fest-lib/cwsp-shared/v2/index.ts";

export interface BluetoothSendHooks {
    send?(destId: string, frame: Uint8Array): boolean | Promise<boolean>;
}

export function deviceMapFromSettings(settings: unknown): DeviceAliasRecord[] {
    const shell = settings && typeof settings === "object"
        ? (settings as { shell?: Record<string, unknown> }).shell
        : undefined;
    return mergeDeviceAliasMap(shell?.deviceAliases, shell?.deviceBluetooth);
}

export function resolveBluetoothDestinations(
    raw: readonly unknown[],
    settings: unknown,
): string[] {
    return resolveDeviceIds(raw, deviceMapFromSettings(settings));
}

export function encodeClipboardTextFrame(opts: {
    fromId: string;
    toId?: string;
    text: string;
    auth?: string;
}): Uint8Array {
    const header: BluetoothFrameHeader = {
        kind: "clipboard-text",
        fromId: opts.fromId,
        toId: opts.toId,
        size: 0,
        what: "clipboard:update",
        auth: opts.auth,
    };
    return encodeBluetoothFrame(header, opts.text);
}

export function shouldSendBluetooth(opts: {
    settings?: unknown;
    hubOpen?: boolean;
    peerOpen?: boolean;
    payloadBytes?: number;
}): boolean {
    const shell = opts.settings && typeof opts.settings === "object"
        ? (opts.settings as { shell?: Record<string, unknown> }).shell
        : undefined;
    return shouldUseBluetoothBypass({
        enabled: shell?.bluetoothEnabled !== false,
        preferBluetooth: shell?.preferBluetooth === true,
        hubOpen: opts.hubOpen,
        peerOpen: opts.peerOpen,
        payloadBytes: opts.payloadBytes ?? 0,
    });
}

/**
 * Best-effort Bluetooth send. Returns false unless a hook is injected
 * (desktop has no built-in RFCOMM).
 */
export async function trySendBluetoothFrame(
    destIds: readonly string[],
    kind: BluetoothPayloadKind,
    fromId: string,
    payload: Uint8Array,
    hooks?: BluetoothSendHooks,
): Promise<boolean> {
    if (!hooks?.send || payload.byteLength > BLUETOOTH_MAX_BYTES) return false;
    const header: BluetoothFrameHeader = {
        kind,
        fromId,
        size: payload.byteLength,
    };
    const frame = encodeBluetoothFrame(header, payload);
    let any = false;
    for (const dest of destIds) {
        if (!dest || dest === "*") continue;
        try {
            if (await hooks.send(dest, frame)) any = true;
        } catch {
            /* adapter missing */
        }
    }
    return any;
}
