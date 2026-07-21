/*
 * Filename: files.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/protocol/socket/handlers/files.ts
 * Change date and time: 14.47.00_21.07.2026
 * Reason for changes: Wave 2 Task 4 — socket `files:*` handler + forward path.
 *   Files-transfer packets (offer/accept/decline/progress/done/error/chunk/
 *   chunk-ack) are relay-only on the endpoint: the handler decides "forward"
 *   and never touches OS clipboard drivers. On a gateway host it optionally
 *   rewrites `files:offer` batch asset URLs onto the public base URL with
 *   freshly minted per-batch fetch tokens, but only when both
 *   `CWS_FILES_PUBLIC_BASE_URL` and a blob secret are configured — otherwise
 *   rewrite is skipped (documented) so we never invent a public base URL.
 *
 * INVARIANT: this handler returns `null` for any non-`files:*` action so the
 *   dispatch chain in `handler.ts` (handleAct/handleAsk) falls through to the
 *   next handler exactly like clipboard/airpad. It must never call
 *   clipboardAccess.write / writeClipboardImageAsset — files payloads are not
 *   clipboard payloads.
 *
 * WHY forward-by-default: the endpoint is a relay/bridge for files-transfer
 *   between peers (e.g. phone -> gateway -> desk). Local OS apply happens on
 *   the final receiver, not on every transit hop, so the only correct local
 *   2026-07-22: prepareFilesOfferForForward is async — after rewrite, pull
 *   private LAN blob URLs into the shared store so reminted tokens serve bytes
 *   (Cap/Neu WAN Accept through WS intermediary chain).
 *   2026-07-22c: pull-cache is size-tiered — await ≤64MiB so WAN mid-size
 *   Accept has bytes; GB stays fire-and-forget (peer URL / sender mirror).
 */

import type { Packet } from "../types.ts";
import { rewriteOfferBlobUrls } from "../../../files/rewrite-offer.ts";
import { mintFilesBlobToken, getSharedFilesBlobStore } from "../../../files/blob-store.ts";
import { pullCacheRewrittenOfferBlobs } from "../../../files/pull-cache-offer.ts";
import {
    resolveFleetLanGatewayHttpsBase,
    resolveFleetWanGatewayHttpsBase,
} from "../../../files/gateway-hosts.ts";
import {
    FILES_WHAT_OFFER,
    OFFER_TTL_MS_DEFAULT,
} from "../../../../shared/v2/files-constants.ts";
import {
    parseFilesOfferPayload,
    type FilesOfferPayload,
} from "../../../../shared/v2/files.ts";

/** True for any canonical `files:*` action name. */
export const isFilesWhat = (what: string): boolean =>
    typeof what === "string" && what.startsWith("files:");

export interface FilesHandlerResult {
    // Always true when this handler handled the action (i.e. `isFilesWhat(what)`).
    handled: boolean;
    // Always true for files:* in Wave 2 — endpoint is relay-only for files-transfer.
    forward: boolean;
    what: string;
    // Payload to forward. Equals the inbound payload unless a gateway offer
    // rewrite produced a new offer (then `rewritten === true`).
    payload?: unknown;
    // True when an offer was rewritten onto the public base URL with fresh tokens.
    rewritten?: boolean;
    // Reason metadata for diagnostics / Task 5 forward wiring.
    reason?: string;
}

/**
 * Gateway detection for the optional `files:offer` URL rewrite. Mirrors the
 * clipboard relay-only host check: env override wins, otherwise the associated
 * id `.200` / `192.168.0.200` is treated as the gateway. WHY: only the gateway
 * has a public-facing origin worth repointing offer asset URLs onto; a desk
 * or phone forwarding an offer must leave the sender's URLs intact.
 */
const isFilesGatewayHost = (): boolean => {
    const forced = String(process.env.CWS_FILES_REWRITE_OFFER_URLS || "").toLowerCase();
    if (forced === "1" || forced === "true") return true;
    if (forced === "0" || forced === "false") return false;
    const id = String(
        process.env.CWS_ASSOCIATED_ID
            || process.env.CWS_BRIDGE_USER_ID
            || process.env.CWS_BRIDGE_DEVICE_ID
            || ""
    )
        .trim()
        .toLowerCase()
        .replace(/^l-/, "");
    return id === "200" || id === "192.168.0.200";
};

/**
 * Resolve the HMAC secret used to mint per-batch fetch tokens. Mirrors
 * blob-store.defaultSecret so a shared-secret deployment reuses one configured
 * value. WHY: kept local (not importing blob-store's private defaultSecret) so
 * this handler stays side-effect-free — we never construct a store here, so
 * no on-disk blob root is touched in the forward path.
 */
const resolveFilesBlobSecret = (): string => {
    const env = process.env.CWS_FILES_BLOB_SECRET
        || process.env.CWS_BRIDGE_USER_KEY
        || process.env.CWS_UPSTREAM_USER_KEY
        || process.env.CWS_ASSOCIATED_TOKEN
        || process.env.CWS_CLIENT_TOKEN;
    return String(env || "").trim();
};

/**
 * Public base for rewritten offer URLs. Prefer explicit env; else derive from
 * associated id (.200) so gateway rewrite works without inventing WAN hosts.
 */
const resolveFilesPublicBaseUrl = (): string => {
    const explicit = String(process.env.CWS_FILES_PUBLIC_BASE_URL || "").trim();
    if (explicit) return explicit.replace(/\/+$/, "");
    // Prefer WAN entry when set — Cap LTE Accept must reach this host.
    const wan = String(process.env.CWS_FILES_PUBLIC_WAN_BASE_URL || "").trim();
    if (wan) return wan.replace(/\/+$/, "");
    const id = String(
        process.env.CWS_ASSOCIATED_ID
            || process.env.CWS_BRIDGE_USER_ID
            || process.env.CWS_BRIDGE_DEVICE_ID
            || ""
    )
        .trim()
        .toLowerCase()
        .replace(/^l-/, "");
    if (id === "200" || id === "192.168.0.200") {
        // WHY: LTE Cap Accept must reach a public host. Prefer relay/WAN from
        // env/settings; historical VPS IP is last-resort only.
        return resolveFleetWanGatewayHttpsBase();
    }
    
    const isValidIpv4 = (value: string): boolean => {
        const parts = value.split(".");
        return (
            parts.length === 4
            && parts.every((part) => {
                if (!/^\d{1,3}$/.test(part)) return false;
                const octet = Number(part);
                return octet >= 0 && octet <= 255;
            })
        );
    };

    const lanIp = /^\d+$/.test(id)
        ? `192.168.0.${id}`
        : id;

    if (
        (isValidIpv4(lanIp)
            && (!/^\d+$/.test(id) || Number(id) <= 255))
    ) {
        return `https://${lanIp}:8434`;
    }

    return "";
};

/**
 * Optionally rewrite a `files:offer` payload onto the gateway's public base
 * URL with freshly minted per-batch tokens. Returns `null` (skip rewrite) when:
 *   - this host is not a gateway, or
 *   - no public base can be resolved, or
 *   - no blob secret is configured (cannot mint tokens), or
 *   - the payload is not a valid offer.
 *
 * After rewrite, best-effort pull-cache of private LAN source URLs into the
 * shared blob store so reminted tokens actually serve bytes on WAN Accept.
 *
 * SECURITY: token minting reuses the same HMAC secret as the blob store so
 *   tokens issued here are accepted by the HTTP `/files/blob` router. Cap/Neu
 *   should also PUT (mirror) when on LTE — pull only helps when gateway can
 *   reach the sender's LAN control URL.
 */
const maybeRewriteOffer = async (payload: unknown): Promise<FilesOfferPayload | null> => {
    if (!isFilesGatewayHost()) return null;
    const publicBaseUrl = resolveFilesPublicBaseUrl();
    if (!publicBaseUrl) return null;
    const secret = resolveFilesBlobSecret();
    if (!secret) return null;
    const offer = parseFilesOfferPayload(payload);
    if (!offer) return null;
    // WHY: bind token expiry to the offer's own expiry so a fetch token never
    // outlives the offer window the sender declared.
    const expiresAt = offer.expiresAt || (Date.now() + OFFER_TTL_MS_DEFAULT);
    const tokenFor = (batchId: string): string =>
        mintFilesBlobToken(offer.transferId, batchId, secret, expiresAt);
    const rewritten = rewriteOfferBlobUrls(offer, {
        publicBaseUrl,
        // WHY: Accept candidates prefer gateway LAN (.200) before WAN.
        // WAN comes from relay/env settings with historical IP as fallback.
        gatewayLanBaseUrl: resolveFleetLanGatewayHttpsBase(),
        gatewayWanBaseUrl: resolveFleetWanGatewayHttpsBase(),
        tokenFor
    });
    // WHY (WAN mid-size): Cap/Neu Accept through gateway reminted tokens 404s
    // unless bytes land before forward. Await pull when every batch fits the
    // RAM pull cap (≤64MiB). GB offers stay non-blocking (peer URL / sender mirror).
    const maxBatch = offer.batches.reduce(
        (m, b) => Math.max(m, Number(b?.asset?.size) || 0),
        0,
    );
    const pullMax = Number(process.env.CWS_FILES_GATEWAY_PULL_MAX_BYTES || "")
        || (64 * 1024 * 1024);
    const pullJob = pullCacheRewrittenOfferBlobs({
        original: offer,
        rewritten,
        store: getSharedFilesBlobStore()
    }).catch((err) => {
        console.warn(
            JSON.stringify({
                channel: "cwsp-files-gateway",
                event: "pull-cache-error",
                error: err instanceof Error ? err.message : String(err)
            })
        );
    });
    if (maxBatch > 0 && maxBatch <= pullMax) {
        await pullJob;
    } else {
        void pullJob;
    }
    return rewritten;
};

/**
 * Handle a `files:*` ACT. Returns `null` for non-files actions so the dispatch
 * chain falls through. For files:* it returns `{ handled, forward: true }` and
 * never touches clipboard drivers. `files:chunk` is forwarded as-is; chunks
 * are NOT reassembled to disk unless `CWS_FILES_GATEWAY_CACHE_CHUNKS=1`
 * (default off in Wave 2 — see brief).
 */
export const handleFilesAction = async (
    what: string,
    payload: any,
    _packet: Packet,
): Promise<FilesHandlerResult | null> => {
    if (!isFilesWhat(what)) return null;

    let outPayload: unknown = payload;
    let rewritten = false;
    let reason = "forward";

    if (what === FILES_WHAT_OFFER) {
        const rewrittenOffer = await maybeRewriteOffer(payload);
        if (rewrittenOffer) {
            outPayload = rewrittenOffer;
            rewritten = true;
            reason = "forward:offer-rewritten";
        }
    }

    // NOTE: files:chunk is forwarded as-is. CWS_FILES_GATEWAY_CACHE_CHUNKS is
    //   honored by the forward layer (Task 5) — this handler does not assemble
    //   chunks to disk regardless of that flag, keeping the decision pure.
    return {
        handled: true,
        forward: true,
        what,
        payload: outPayload,
        rewritten,
        reason,
    };
};

/**
 * Prepare a `files:offer` packet for outbound forward. On a gateway host (with
 * `CWS_FILES_PUBLIC_BASE_URL` + a blob secret configured) this rewrites the
 * offer's batch asset URLs onto the public base URL with freshly minted
 * per-batch fetch tokens and returns a *new* packet carrying the rewritten
 * payload. For every other action (or when rewrite is skipped) the input
 * packet/payload is returned unchanged.
 *
 * WHY this exists: the live forward paths (`server/network/socket/websocket.ts`
 * and `server-v2/protocol/socket/coordinator.ts`) forward the *original* inbound
 * packet to destinations. Without this hook, a gateway relaying a `files:offer`
 * from a sender behind NAT would forward the sender's private asset URL, which
 * receivers cannot reach. Coordinator/websocket MUST call this before forward
 * so the rewritten URL (and fresh token) is what actually goes on the wire.
 *
 * INVARIANT: never mutates the caller's packet — returns a shallow-cloned packet
 *   when rewrite applies, otherwise the same reference.
 */
export const prepareFilesOfferForForward = async (
    packet: { what?: string; payload?: unknown; [key: string]: unknown },
): Promise<{ packet: typeof packet; rewritten: boolean; payload: unknown }> => {
    if (!packet || packet.what !== FILES_WHAT_OFFER) {
        return { packet, rewritten: false, payload: packet?.payload };
    }
    const rewrittenOffer = await maybeRewriteOffer(packet.payload);
    if (!rewrittenOffer) {
        return { packet, rewritten: false, payload: packet.payload };
    }
    return {
        packet: { ...packet, payload: rewrittenOffer },
        rewritten: true,
        payload: rewrittenOffer,
    };
};

/**
 * Handle a `files:*` ASK. Wave 2 has no local files capability probes, so
 * files:* asks are forwarded to destinations exactly like acts. Returns `null`
 * for non-files actions so the dispatch chain falls through.
 */
export const handleFilesAsk = async (
    what: string,
    payload: any,
    _packet: Packet,
): Promise<FilesHandlerResult | null> => {
    if (!isFilesWhat(what)) return null;
    return {
        handled: true,
        forward: true,
        what,
        payload,
        reason: "forward:ask",
    };
};
