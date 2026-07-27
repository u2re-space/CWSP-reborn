/*
 * Filename: ingress-normalize.mjs
 * FullPath: apps/CWSP-reborn/runtime/adapters/ingress-normalize.mjs
 * Change date and time: 20.45.00_19.07.2026
 * Reason for changes: Soft-bind bridge — legacy frames ↔ cwsp-shared v2 packets.
 *   Plain ESM SoT under apps/CWSP-reborn/runtime (moved from runtime/cwsp).
 *
 * NOTE: Dynamically imports cwsp-shared normalize.ts so tests can run without tsx.
 */

import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const SHARED_NORMALIZE = resolve(
  here,
  "../../src/shared/src/v2/normalize.ts",
);

/** @type {null | ((value: unknown) => Record<string, unknown>)} */
let normalizeCwspPacketFn = null;

async function loadNormalize() {
  if (normalizeCwspPacketFn) return normalizeCwspPacketFn;
  const mod = await import(pathToFileURL(SHARED_NORMALIZE).href);
  if (typeof mod.normalizeCwspPacket !== "function") {
    throw new Error("normalizeCwspPacket export missing from cwsp-shared");
  }
  normalizeCwspPacketFn = mod.normalizeCwspPacket;
  return normalizeCwspPacketFn;
}

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
export function looksLikeCwspV2Packet(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  const r = /** @type {Record<string, unknown>} */ (raw);
  if ("op" in r || "what" in r) return true;
  const flags = r.flags;
  if (flags && typeof flags === "object" && !Array.isArray(flags)) {
    return /** @type {Record<string, unknown>} */ (flags).canonicalV2 === true;
  }
  return false;
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function asStringList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

/**
 * @param {Record<string, unknown>} raw
 * @param {string} sourceId
 * @returns {Record<string, unknown>}
 */
function prepareIngressInput(raw, sourceId) {
  const input = { ...raw };

  // Sender defaults to the ingress peer when absent.
  if (
    !(typeof input.sender === "string" && input.sender.trim()) &&
    !(typeof input.byId === "string" && input.byId.trim()) &&
    !(typeof input.from === "string" && input.from.trim())
  ) {
    input.sender = sourceId;
  }

  // Harness-friendly defaults so incomplete coordinator packets still normalize.
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

/**
 * Build a legacy-compatible frame overlay from a normalized v2 packet.
 * @param {Record<string, unknown>} packet
 * @param {string} sourceId
 * @param {Record<string, unknown>} [raw]
 */
function packetToLegacyFrame(packet, sourceId, raw = {}) {
  const destinations = asStringList(packet.destinations);
  const nodes = asStringList(packet.nodes);
  const destList = destinations.length ? destinations : nodes;
  const first = destList[0] || "broadcast";
  const what =
    (typeof packet.what === "string" && packet.what) ||
    (typeof raw.what === "string" && raw.what) ||
    (typeof raw.type === "string" && raw.type) ||
    (typeof raw.action === "string" && raw.action) ||
    "dispatch";

  return {
    ...raw,
    ...packet,
    type: what,
    action: what,
    from:
      (typeof packet.sender === "string" && packet.sender) ||
      sourceId ||
      "unknown",
    to: first,
    target: first,
    payload: packet.payload ?? packet.data ?? raw.payload ?? raw.data,
    mode: typeof raw.mode === "string" && raw.mode.trim() ? raw.mode : "blind",
    transport: (typeof packet.transport === "string" && packet.transport) || "ws",
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
 * @param {unknown} raw
 * @param {string} sourceId
 * @returns {Promise<{ packet: Record<string, unknown>, frame: Record<string, unknown> }>}
 */
export async function normalizeIngress(raw, sourceId) {
  const normalizeCwspPacket = await loadNormalize();
  const base =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? /** @type {Record<string, unknown>} */ (raw)
      : {};
  const prepared = prepareIngressInput(base, sourceId);
  const packet = /** @type {Record<string, unknown>} */ (
    normalizeCwspPacket(prepared)
  );

  // Preserve explicit destinations/nodes; fill from route target if still empty.
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

export default {
  looksLikeCwspV2Packet,
  normalizeIngress,
};
