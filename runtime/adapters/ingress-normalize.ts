/*
 * Filename: ingress-normalize.ts
 * FullPath: apps/CWSP-reborn/runtime/adapters/ingress-normalize.ts
 * Change date and time: 20.45.00_19.07.2026
 * Reason for changes: Soft-bind bridge — typed wrapper over ingress-normalize.mjs
 *   (legacy frames ↔ cwsp-shared v2). Living under apps/CWSP-reborn/runtime.
 *
 * NOTE: Runnable SoT is ingress-normalize.mjs (plain ESM + dynamic shared import).
 * COMPAT: looksLikeCwspV2Packet / normalizeIngress match the .mjs surface.
 */

import { normalizeCwspPacket } from "./cwsp-shared-v2.ts";
import type { CwspPacket } from "../../src/shared/src/v2/types.ts";
import { randomUUID } from "node:crypto";

export type IngressNormalizeResult = {
  packet: CwspPacket;
  frame: Record<string, unknown>;
};

/** True when the payload looks like a coordinator / cwsp-shared v2 packet. */
export function looksLikeCwspV2Packet(raw: unknown): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  const r = raw as Record<string, unknown>;
  if ("op" in r || "what" in r) return true;
  const flags = r.flags;
  if (flags && typeof flags === "object" && !Array.isArray(flags)) {
    return (flags as Record<string, unknown>).canonicalV2 === true;
  }
  return false;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

function prepareIngressInput(
  raw: Record<string, unknown>,
  sourceId: string,
): Record<string, unknown> {
  const input: Record<string, unknown> = { ...raw };

  if (
    !(typeof input.sender === "string" && input.sender.trim()) &&
    !(typeof input.byId === "string" && input.byId.trim()) &&
    !(typeof input.from === "string" && input.from.trim())
  ) {
    input.sender = sourceId;
  }

  if (!(typeof input.uuid === "string" && input.uuid.trim())) {
    input.uuid = randomUUID();
  }
  if (typeof input.timestamp !== "number" || !Number.isSafeInteger(input.timestamp)) {
    input.timestamp = Date.now();
  }

  const destinations = asStringList(input.destinations);
  const nodes = asStringList(input.nodes);
  if (destinations.length === 0 && nodes.length === 0) {
    const routeTarget =
      (typeof input.target === "string" && input.target.trim()) ||
      (typeof input.targetId === "string" && input.targetId.trim()) ||
      (typeof input.cwsp_route_target === "string" && input.cwsp_route_target.trim()) ||
      "";
    if (routeTarget) {
      input.destinations = [routeTarget];
    }
  }

  return input;
}

function packetToLegacyFrame(
  packet: CwspPacket,
  sourceId: string,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const destinations = asStringList(packet.destinations);
  const nodes = asStringList(packet.nodes);
  const destList = destinations.length ? destinations : nodes;
  const first = destList[0] || "broadcast";
  const what =
    packet.what ||
    (typeof raw.what === "string" && raw.what) ||
    (typeof raw.type === "string" && raw.type) ||
    (typeof raw.action === "string" && raw.action) ||
    "dispatch";

  return {
    ...raw,
    ...packet,
    type: what,
    action: what,
    from: packet.sender || sourceId || "unknown",
    to: first,
    target: first,
    payload: packet.payload ?? (raw.payload as unknown) ?? (raw.data as unknown),
    mode: typeof raw.mode === "string" && raw.mode.trim() ? raw.mode : "blind",
    transport: packet.transport || "ws",
    op: packet.op,
    what: packet.what,
    destinations: destList.length ? destList : packet.destinations,
    nodes: packet.nodes ?? (destList.length ? destList : undefined),
    uuid: packet.uuid,
    flags: packet.flags,
  };
}

/**
 * Normalize ingress: full cwsp-shared packet + legacy frame overlay.
 * INVARIANT: destinations/nodes preserved; target/cwsp_route_target fill when empty.
 */
export function normalizeIngress(raw: unknown, sourceId: string): IngressNormalizeResult {
  const base =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const prepared = prepareIngressInput(base, sourceId);
  const packet = normalizeCwspPacket(prepared);

  let destinations = asStringList(packet.destinations);
  let nodes = asStringList(packet.nodes);
  if (destinations.length === 0 && nodes.length === 0) {
    const routeTarget =
      (typeof prepared.target === "string" && prepared.target.trim()) ||
      (typeof prepared.targetId === "string" && prepared.targetId.trim()) ||
      (typeof prepared.cwsp_route_target === "string" &&
        prepared.cwsp_route_target.trim()) ||
      "";
    if (routeTarget) {
      destinations = [routeTarget];
      packet.destinations = destinations;
      packet.nodes = destinations;
    }
  } else if (destinations.length === 0 && nodes.length > 0) {
    packet.destinations = nodes;
  } else if (nodes.length === 0 && destinations.length > 0) {
    packet.nodes = destinations;
  }

  const frame = packetToLegacyFrame(packet, sourceId, base);
  return { packet, frame };
}
