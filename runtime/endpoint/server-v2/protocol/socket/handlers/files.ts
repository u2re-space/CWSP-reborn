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
 *   action here is "forward to destinations". Task 5 wires the actual forward
 *   transport; Task 4 only produces the decision (and optional offer rewrite).
 */

import type { Packet } from "../types.ts";
import { rewriteOfferBlobUrls } from "../../../files/rewrite-offer.ts";
import { mintFilesBlobToken } from "../../../files/blob-store.ts";
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
        || process.env.CWS_UPSTREAM_USER_KEY;
    return String(env || "").trim();
};

/**
 * Optionally rewrite a `files:offer` payload onto the gateway's public base
 * URL with freshly minted per-batch tokens. Returns `null` (skip rewrite) when:
 *   - this host is not a gateway, or
 *   - `CWS_FILES_PUBLIC_BASE_URL` is unset (we never invent a base URL), or
 *   - no blob secret is configured (cannot mint tokens), or
 *   - the payload is not a valid offer.
 *
 * SECURITY: token minting reuses the same HMAC secret as the blob store so
 *   tokens issued here are accepted by the HTTP `/files/blob` router. The
 *   caller (Task 5 forward) is responsible for actually persisting the batch
 *   bytes via the blob store PUT before receivers fetch them.
 */
const maybeRewriteOffer = (payload: unknown): FilesOfferPayload | null => {
    if (!isFilesGatewayHost()) return null;
    const publicBaseUrl = String(process.env.CWS_FILES_PUBLIC_BASE_URL || "").trim();
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
    return rewriteOfferBlobUrls(offer, { publicBaseUrl, tokenFor });
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
        const rewrittenOffer = maybeRewriteOffer(payload);
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
