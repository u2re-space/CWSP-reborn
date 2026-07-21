/*
 * Filename: rewrite-offer.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/rewrite-offer.ts
 * Change date and time: 00.30.00_22.07.2026
 * Reason for changes: Wave 2 Task 2 — pure URL rewriter for files-transfer
 * offers. Repoints each batch asset.url onto the public-facing base URL of the
 * serving endpoint and re-mints the per-batch fetch token via `tokenFor`. Pure
 * by design: no network I/O, no filesystem, no clock — callers own token
 * minting (see blob-store `mintFilesBlobToken`) so this module stays isomorphic
 * and unit-testable.
 *   2026-07-22: skip rewrite when URL already points at any known gateway
 *   `/files/blob` host (LAN .200 OR WAN .152) — Cap/Neu mirror tokens must
 *   survive; reminting broke WAN Accept GET.
 */

import type { FilesOfferPayload } from "../../shared/v2/files-types.ts";

export interface RewriteOfferContext {
    // Public base URL of the endpoint that will actually serve the blob
    // (e.g. `https://45.147.121.152:8434`). Trailing slash is tolerated.
    publicBaseUrl: string;
    // Mints a fresh fetch token for a given batchId. Caller binds the token to
    // (transferId, batchId, expiry) — see blob-store.mintFilesBlobToken.
    tokenFor: (batchId: string) => string;
}

// Normalize `https://host:port/` -> `https://host:port` so concatenation with a
// leading-slash path never produces a double slash.
function trimTrailingSlash(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** Cap/Neu may mirror to LAN or WAN entry — both serve the same blob store. */
function isAlreadyGatewayFilesBlobUrl(url: string): boolean {
    try {
        const u = new URL(url);
        const host = (u.hostname || "").toLowerCase();
        const path = u.pathname || "";
        if (!path.includes("/files/blob/")) return false;
        return (
            host === "192.168.0.200"
            || host === "45.147.121.152"
            || host.endsWith(".192.168.0.200")
        );
    } catch {
        return false;
    }
}

/**
 * Rewrite every batch `asset.url` in an offer so it points at `publicBaseUrl`
 * with a fresh token. Returns a shallow-cloned offer (batches/assets are
 * cloned, untouched fields preserved by reference) so the caller's original
 * offer is not mutated.
 *
 * INVARIANT: only `asset.url` is rewritten; `asset.hash/name/mimeType/size`
 * are preserved verbatim because receivers verify blob integrity by hash.
 */
export function rewriteOfferBlobUrls(
    offer: FilesOfferPayload,
    ctx: RewriteOfferContext,
): FilesOfferPayload {
    const base = trimTrailingSlash(ctx.publicBaseUrl);

    const batches = offer.batches.map((batch) => {
        if (!batch.asset) return batch;
        const existing = typeof batch.asset.url === "string" ? batch.asset.url.trim() : "";
        // WHY: Cap/Neu may already PUT to LAN or WAN gateway and embed URL+token.
        // Reminting invalidated the PUT token AND could swap WAN→LAN base, which
        // LTE Accept cannot reach.
        if (
            existing.startsWith(base + "/")
            || existing.startsWith(base + "?")
            || isAlreadyGatewayFilesBlobUrl(existing)
        ) {
            return batch;
        }
        // WHY: path is always `/files/blob/<transferId>/<batchId>` — keep it
        // canonical so receivers can dedupe candidates across routes.
        const path = `/files/blob/${encodeURIComponent(offer.transferId)}/${encodeURIComponent(batch.batchId)}`;
        const token = ctx.tokenFor(batch.batchId);
        const url = `${base}${path}?token=${encodeURIComponent(token)}`;
        return {
            ...batch,
            asset: { ...batch.asset, url },
        };
    });

    return { ...offer, batches };
}
