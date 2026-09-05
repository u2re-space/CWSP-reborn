/**
 * FIND:device-aliases
 * TAG:bluetooth,network
 *
 * Internal device-name → canonical short fleet id.
 * WHY: settings and share targets use "desk" / "L-110" / "110" interchangeably;
 * routing must collapse those onto one peer id before WS or Bluetooth dial.
 *
 * INVARIANT: never expand short → full LAN form. L-192.168.0.110 → L-110.
 */

import { toShortFleetWireNodeId } from "../airpad-cwsp-client-parity.ts";
import { parseWireTargetEntry, parseWireTargetList, type WireTargetEntry } from "../wire-target-id.ts";

/** One named peer in the local fleet map. */
export interface DeviceAliasRecord {
    /** Canonical short id (`L-110`). */
    id: string;
    /** Human label for UI (`Desk`). */
    label: string;
    /** Extra names that resolve to {@link id} (`desk`, `ultrabook`). */
    aliases: string[];
    /** Optional Classic Bluetooth MAC (`AA:BB:CC:DD:EE:FF`). */
    bluetooth?: string;
}

export const FLEET_DEVICE_DEFAULTS: readonly DeviceAliasRecord[] = [
    { id: "L-110", label: "Desk", aliases: ["desk", "ultrabook", "110"] },
    { id: "L-111", label: "Laptop", aliases: ["laptop", "111"] },
    { id: "L-196", label: "Phone", aliases: ["phone", "196"] },
    { id: "L-208", label: "Phone-208", aliases: ["208"] },
    { id: "L-210", label: "Phone-210", aliases: ["210"] },
    { id: "L-200", label: "Gateway", aliases: ["gateway", "hub", "200"] },
];

const WILDCARD = new Set(["*", "all", "broadcast"]);

export function normalizeBluetoothMac(value: unknown): string {
    const raw = String(value ?? "").trim().toUpperCase();
    if (!raw) return "";
    const hex = raw.replace(/[^0-9A-F]/g, "");
    if (hex.length !== 12) return "";
    return hex.match(/.{2}/g)!.join(":");
}

/** `desk=L-110; pixel=L-210` or JSON `{"desk":"L-110"}`. Left `L-*` means id→alias. */
export function parseDeviceAliasOverlay(raw: unknown): Record<string, string> {
    const out: Record<string, string> = {};
    if (raw == null) return out;
    if (typeof raw === "object" && !Array.isArray(raw)) {
        for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
            addOverlayPair(out, k, String(v ?? ""));
        }
        return out;
    }
    const text = String(raw).trim();
    if (!text) return out;
    if (text.startsWith("{")) {
        try {
            return parseDeviceAliasOverlay(JSON.parse(text) as unknown);
        } catch {
            /* fall through to kv list */
        }
    }
    for (const part of text.split(/[;,\n]+/)) {
        const eq = part.indexOf("=");
        if (eq <= 0) continue;
        addOverlayPair(out, part.slice(0, eq), part.slice(eq + 1));
    }
    return out;
}

/** `L-110=AA:BB:…` or JSON `{ "L-110": "AA:BB:…" }`. */
export function parseDeviceBluetoothOverlay(raw: unknown): Record<string, string> {
    const aliases = parseDeviceAliasOverlay(raw);
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(aliases)) {
        const id = looksLikeFleetId(key) ? canonicalizeDeviceId(key) : canonicalizeDeviceId(value);
        const mac = normalizeBluetoothMac(looksLikeFleetId(key) ? value : key);
        if (id && mac) out[id] = mac;
    }
    return out;
}

export function mergeDeviceAliasMap(
    aliasOverlay?: unknown,
    bluetoothOverlay?: unknown,
): DeviceAliasRecord[] {
    const aliasMap = parseDeviceAliasOverlay(aliasOverlay);
    const btMap = parseDeviceBluetoothOverlay(bluetoothOverlay);
    const byId = new Map<string, DeviceAliasRecord>();
    for (const rec of FLEET_DEVICE_DEFAULTS) {
        byId.set(rec.id, {
            id: rec.id,
            label: rec.label,
            aliases: [...rec.aliases],
            bluetooth: rec.bluetooth,
        });
    }
    for (const [alias, target] of Object.entries(aliasMap)) {
        const id = canonicalizeDeviceId(target) || canonicalizeDeviceId(alias);
        if (!id) continue;
        const name = looksLikeFleetId(alias) ? target : alias;
        const existing = byId.get(id);
        if (existing) {
            const n = String(name || "").trim();
            if (n && !existing.aliases.some((a) => a.toLowerCase() === n.toLowerCase())
                && n.toLowerCase() !== id.toLowerCase()) {
                existing.aliases.push(n);
            }
        } else {
            byId.set(id, {
                id,
                label: String(name || id).trim() || id,
                aliases: name && name.toLowerCase() !== id.toLowerCase() ? [name] : [],
            });
        }
    }
    for (const [id, mac] of Object.entries(btMap)) {
        const existing = byId.get(id);
        if (existing) existing.bluetooth = mac;
        else byId.set(id, { id, label: id, aliases: [], bluetooth: mac });
    }
    return [...byId.values()];
}

/**
 * Collapse a typed name / short id / full LAN id onto the canonical short form.
 * `desk::token` keeps the per-id token suffix.
 */
export function resolveDeviceId(input: unknown, map?: readonly DeviceAliasRecord[]): string {
    const raw = String(input ?? "").trim();
    if (!raw) return "";
    if (WILDCARD.has(raw.toLowerCase())) return raw;
    const parsed = parseWireTargetEntry(raw);
    const resolved = resolveBareDeviceId(parsed.nodeId, map);
    if (!resolved) return raw;
    return parsed.accessToken ? `${resolved}::${parsed.accessToken}` : resolved;
}

export function resolveDeviceIds(
    inputs: readonly unknown[],
    map?: readonly DeviceAliasRecord[],
): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of inputs) {
        const id = resolveDeviceId(item, map);
        if (!id) continue;
        const key = id.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(id);
    }
    return out;
}

/** Resolve a destination list (csv / array / `ID::token`) onto canonical ids. */
export function resolveDestinationEntries(
    raw: unknown,
    map?: readonly DeviceAliasRecord[],
): WireTargetEntry[] {
    return parseWireTargetList(raw).map((e) => ({
        nodeId: resolveBareDeviceId(e.nodeId, map) || e.nodeId,
        accessToken: e.accessToken,
    })).filter((e) => e.nodeId);
}

export function lookupDevice(
    input: unknown,
    map?: readonly DeviceAliasRecord[],
): DeviceAliasRecord | null {
    const id = resolveBareDeviceId(String(input ?? "").trim(), map);
    if (!id) return null;
    const records = map ?? FLEET_DEVICE_DEFAULTS;
    return records.find((r) => r.id.toLowerCase() === id.toLowerCase()) ?? null;
}

/** UI label: `Desk (L-110)`. */
export function displayDeviceLabel(input: unknown, map?: readonly DeviceAliasRecord[]): string {
    const rec = lookupDevice(input, map);
    const id = rec?.id || resolveDeviceId(input, map);
    if (!id) return "";
    if (!rec || !rec.label || rec.label.toLowerCase() === id.toLowerCase()) return id;
    return `${rec.label} (${id})`;
}

export function bluetoothAddressFor(
    input: unknown,
    map?: readonly DeviceAliasRecord[],
): string | null {
    const rec = lookupDevice(input, map);
    return rec?.bluetooth || null;
}

export function deviceIdForBluetoothAddress(
    mac: unknown,
    map?: readonly DeviceAliasRecord[],
): string | null {
    const norm = normalizeBluetoothMac(mac);
    if (!norm) return null;
    const records = map ?? FLEET_DEVICE_DEFAULTS;
    const hit = records.find((r) => r.bluetooth === norm);
    return hit?.id ?? null;
}

/** Match a Classic Bluetooth adapter name against aliases / ids (`Pixel L-210`). */
export function deviceIdForBluetoothName(
    name: unknown,
    map?: readonly DeviceAliasRecord[],
): string | null {
    const n = String(name ?? "").trim().toLowerCase();
    if (!n) return null;
    const records = map ?? FLEET_DEVICE_DEFAULTS;
    for (const rec of records) {
        if (n === rec.id.toLowerCase() || n === rec.label.toLowerCase()) return rec.id;
        if (rec.aliases.some((a) => n === a.toLowerCase())) return rec.id;
    }
    for (const rec of records) {
        if (n.includes(rec.id.toLowerCase())) return rec.id;
        if (rec.aliases.some((a) => a.length >= 3 && n.includes(a.toLowerCase()))) return rec.id;
    }
    return null;
}

function resolveBareDeviceId(input: string, map?: readonly DeviceAliasRecord[]): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (WILDCARD.has(trimmed.toLowerCase())) return trimmed;
    const short = canonicalizeDeviceId(trimmed);
    const records = map ?? FLEET_DEVICE_DEFAULTS;
    if (short && records.some((r) => r.id.toLowerCase() === short.toLowerCase())) return short;
    if (short && looksLikeFleetId(short)) return short;
    const key = trimmed.toLowerCase();
    for (const rec of records) {
        if (rec.id.toLowerCase() === key) return rec.id;
        if (rec.label.toLowerCase() === key) return rec.id;
        if (rec.aliases.some((a) => a.toLowerCase() === key)) return rec.id;
    }
    return short || trimmed;
}

function canonicalizeDeviceId(value: string): string {
    const short = toShortFleetWireNodeId(value);
    return short || "";
}

function looksLikeFleetId(value: string): boolean {
    return /^L-/i.test(String(value || "").trim());
}

function addOverlayPair(out: Record<string, string>, leftRaw: string, rightRaw: string): void {
    const left = String(leftRaw || "").trim();
    const right = String(rightRaw || "").trim();
    if (!left || !right) return;
    if (looksLikeFleetId(left) && !looksLikeFleetId(right)) {
        out[right] = canonicalizeDeviceId(left) || left;
        return;
    }
    out[left] = canonicalizeDeviceId(right) || right;
}
