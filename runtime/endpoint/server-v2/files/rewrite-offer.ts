/*
 * Filename: rewrite-offer.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/rewrite-offer.ts
 * Change date and time: 00.45.00_22.07.2026
 * Reason for changes: Wave 2 Task 2 — pure URL rewriter for files-transfer
 * offers. Repoints each batch asset.url onto the public-facing base URL of the
 * serving endpoint and re-mints the per-batch fetch token via `tokenFor`. Pure
 * by design: no network I/O, no filesystem, no clock — callers own token
 * minting (see blob-store `mintFilesBlobToken`) so this module stays isomorphic
 * and unit-testable.
 *   2026-07-22: skip rewrite when URL already points at any known gateway
 *   `/files/blob` host (LAN .200 OR WAN .152) — Cap/Neu mirror tokens must
 *   survive; reminting broke WAN Accept GET.
 *   2026-07-22: emit ordered `asset.urls` candidates — peer LAN / P2P first,
 *   then gateway LAN, then gateway WAN — so Accept can prefer fastest path.
 */

import type { FilesOfferPayload } from "../../shared/v2/files-types.ts";
import {
    FLEET_LAN_GATEWAY_HOST,
    FLEET_LAN_GATEWAY_HTTPS,
    FLEET_WAN_GATEWAY_HTTPS_FALLBACK,
    isFleetGatewayHost,
    isFleetLanGatewayHost,
    isFleetWanGatewayHost,
    resolveFleetLanGatewayHttpsBase,
    resolveFleetWanGatewayHost,
    resolveFleetWanGatewayHttpsBase,
} from "./gateway-hosts.ts";

export interface RewriteOfferContext {
    // Public base URL of the endpoint that will actually serve the blob
    // (e.g. configured relay WAN, or fleet WAN fallback). Trailing slash ok.
    publicBaseUrl: string;
    /** Gateway LAN origin for Accept candidates (default `.200`). */
    gatewayLanBaseUrl?: string;
    /** Gateway WAN origin for Accept candidates (settings relay || fleet WAN). */
    gatewayWanBaseUrl?: string;
    // Mints a fresh fetch token for a given batchId. Caller binds the token to
    // (transferId, batchId, expiry) — see blob-store.mintFilesBlobToken.
    tokenFor: (batchId: string) => string;
}

const DEFAULT_GW_LAN = FLEET_LAN_GATEWAY_HTTPS;
const DEFAULT_GW_WAN = FLEET_WAN_GATEWAY_HTTPS_FALLBACK;

// Normalize `https://host:port/` -> `https://host:port` so concatenation with a
// leading-slash path never produces a double slash.
function trimTrailingSlash(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

function dedupeUrls(urls: readonly string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of urls) {
        const u = String(raw || "").trim();
        if (!u || seen.has(u)) continue;
        seen.add(u);
        out.push(u);
    }
    return out;
}

/** Cap/Neu may mirror to LAN or WAN entry — both serve the same blob store. */
function isAlreadyGatewayFilesBlobUrl(url: string): boolean {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        const path = u.pathname || "";
        if (!path.includes("/files/blob/")) return false;
        return isFleetGatewayHost(host) || host.endsWith(`.${FLEET_LAN_GATEWAY_HOST}`);
    } catch {
        return false;
    }
}

/**
 * True when the URL is a peer-local blob (Cap control / Neu control on private
 * LAN), not the gateway store. Those keep their original token and are the
 * fastest P2P Accept path when both peers share a LAN.
 */
function isPeerLanBlobUrl(url: string): boolean {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        const path = u.pathname || "";
        if (isFleetGatewayHost(host)) return false;
        if (path.includes("/service/files-blob/")) return true;
        if (path.includes("/files/blob/") && host.startsWith("192.168.")) return true;
        if (path.includes("/files/blob/") && (host.startsWith("10.") || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host))) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

function swapGatewayHost(url: string, toHost: string): string {
    try {
        const u = new URL(url);
        if (!(u.pathname || "").includes("/files/blob/")) return url;
        u.hostname = toHost;
        return u.toString();
    } catch {
        return url;
    }
}

/**
 * Order fetch candidates: peer/P2P → gateway LAN → gateway WAN → other.
 * INVARIANT: does not invent tokens; only reorders / host-swaps gateway URLs.
 */
export function orderFilesBlobFetchUrls(urls: readonly string[]): string[] {
    const wanHost = resolveFleetWanGatewayHost();
    const peer: string[] = [];
    const gwLan: string[] = [];
    const gwWan: string[] = [];
    const other: string[] = [];
    for (const url of dedupeUrls(urls)) {
        try {
            const host = new URL(url).hostname.toLowerCase();
            if (isFleetLanGatewayHost(host)) gwLan.push(url);
            else if (isFleetWanGatewayHost(host) || host === wanHost) gwWan.push(url);
            else if (isPeerLanBlobUrl(url)) peer.push(url);
            else other.push(url);
        } catch {
            other.push(url);
        }
    }
    return [...peer, ...gwLan, ...gwWan, ...other];
}

/**
 * Expand a primary URL (+ optional extras) into an ordered Accept candidate
 * list. Gateway `/files/blob` URLs get LAN↔WAN host variants (same token).
 */
export function expandFilesBlobFetchUrls(
    primary: string,
    extra?: readonly string[],
): string[] {
    const raw = [...(extra || []), primary].map((u) => String(u || "").trim()).filter(Boolean);
    const lanHost = FLEET_LAN_GATEWAY_HOST;
    const wanHost = resolveFleetWanGatewayHost();
    const expanded: string[] = [];
    for (const url of raw) {
        expanded.push(url);
        if (isAlreadyGatewayFilesBlobUrl(url)) {
            expanded.push(swapGatewayHost(url, lanHost));
            expanded.push(swapGatewayHost(url, wanHost));
        }
    }
    return orderFilesBlobFetchUrls(expanded);
}

/**
 * Rewrite every batch `asset.url` in an offer so it points at `publicBaseUrl`
 * with a fresh token. Also fills `asset.urls` as ordered candidates:
 *   1. original peer LAN URL (original token) when present
 *   2. gateway LAN + reminted token
 *   3. gateway WAN + reminted token
 *
 * Returns a shallow-cloned offer (batches/assets are cloned, untouched fields
 * preserved by reference) so the caller's original offer is not mutated.
 *
 * INVARIANT: only `asset.url` / `asset.urls` are rewritten; hash/name/mime/size
 * are preserved verbatim because receivers verify blob integrity by hash.
 */
export function rewriteOfferBlobUrls(
    offer: FilesOfferPayload,
    ctx: RewriteOfferContext,
): FilesOfferPayload {
    const base = trimTrailingSlash(ctx.publicBaseUrl);
    const gwLan = trimTrailingSlash(
        ctx.gatewayLanBaseUrl || resolveFleetLanGatewayHttpsBase() || DEFAULT_GW_LAN,
    );
    const gwWan = trimTrailingSlash(
        ctx.gatewayWanBaseUrl || resolveFleetWanGatewayHttpsBase() || DEFAULT_GW_WAN,
    );
    const wanHost = (() => {
        try {
            return new URL(gwWan).hostname;
        } catch {
            return resolveFleetWanGatewayHost();
        }
    })();

    const batches = offer.batches.map((batch) => {
        if (!batch.asset) return batch;
        const existing = typeof batch.asset.url === "string" ? batch.asset.url.trim() : "";
        const priorUrls = Array.isArray((batch.asset as { urls?: unknown }).urls)
            ? ((batch.asset as { urls?: unknown }).urls as unknown[])
                .map((u) => String(u || "").trim())
                .filter(Boolean)
            : [];

        // WHY: Cap/Neu may already PUT to LAN or WAN gateway and embed URL+token.
        // Reminting invalidated the PUT token AND could swap WAN→LAN base, which
        // LTE Accept cannot reach. Still expand LAN↔WAN host variants.
        if (
            existing
            && (
                existing.startsWith(base + "/")
                || existing.startsWith(base + "?")
                || isAlreadyGatewayFilesBlobUrl(existing)
            )
        ) {
            const urls = expandFilesBlobFetchUrls(existing, priorUrls);
            // Primary stays LTE-reachable: prefer WAN variant of the same token.
            const wanPrimary = swapGatewayHost(existing, wanHost);
            const primary = isAlreadyGatewayFilesBlobUrl(wanPrimary) ? wanPrimary : existing;
            return {
                ...batch,
                asset: { ...batch.asset, url: primary, urls },
            };
        }

        // WHY: path is always `/files/blob/<transferId>/<batchId>` — keep it
        // canonical so receivers can dedupe candidates across routes.
        const path = `/files/blob/${encodeURIComponent(offer.transferId)}/${encodeURIComponent(batch.batchId)}`;
        const token = ctx.tokenFor(batch.batchId);
        const q = `?token=${encodeURIComponent(token)}`;
        const lanUrl = `${gwLan}${path}${q}`;
        const wanUrl = `${gwWan}${path}${q}`;
        const publicUrl = `${base}${path}${q}`;
        const peerUrl = existing && isPeerLanBlobUrl(existing) ? existing : "";
        const urls = orderFilesBlobFetchUrls([
            ...priorUrls,
            peerUrl,
            lanUrl,
            wanUrl,
            publicUrl,
        ].filter(Boolean));
        return {
            ...batch,
            asset: { ...batch.asset, url: publicUrl, urls },
        };
    });

    return { ...offer, batches };
}
