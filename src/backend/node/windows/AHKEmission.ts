/*
 * Filename: AHKEmission.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/AHKEmission.ts
 * Change date and time: 16.30.00_11.07.2026
 * Reason for changes: Neutralino/Windows — build outgoing CWSP v2 act envelopes from AHK side-effects.
 */

import { randomUUID } from "node:crypto";

export interface EmissionIdentity {
    byId?: string;
    sender?: string;
}

function baseAct(what: string, purpose: string, payload: Record<string, unknown>, id?: EmissionIdentity) {
    const peer = id?.byId ?? id?.sender ?? "L-192.168.0.110";
    return {
        op: "act" as const,
        what,
        purpose,
        protocol: "local" as const,
        transport: "bridge" as const,
        uuid: randomUUID(),
        timestamp: Date.now(),
        sender: peer,
        byId: peer,
        payload,
        data: payload,
        flags: { canonicalV2: true }
    };
}

export function emitClipboardUpdate(input: { text?: string; byId?: string }) {
    const text = input.text ?? "";
    return baseAct(
        "clipboard:update",
        "clipboard",
        { text, content: text, body: text },
        input
    );
}

export function emitMouseMove(input: { x: number; y: number; byId?: string }) {
    return baseAct("mouse:move", "airpad", { x: input.x, y: input.y }, input);
}

export function emitMouseClick(input: { button?: string; double?: boolean; byId?: string }) {
    return baseAct(
        "mouse:click",
        "airpad",
        { button: input.button ?? "left", double: Boolean(input.double) },
        input
    );
}

export function emitKeyboardType(input: { text: string; byId?: string }) {
    return baseAct("keyboard:type", "airpad", { text: input.text }, input);
}

export function emitKeyboardTap(input: { key: string; modifiers?: string[]; byId?: string }) {
    return baseAct(
        "keyboard:tap",
        "airpad",
        { key: input.key, modifier: input.modifiers ?? [] },
        input
    );
}
