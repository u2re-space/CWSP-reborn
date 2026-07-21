/*
 * Filename: rewrite-offer.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/rewrite-offer.ts
 * Change date and time: 14.40.00_21.07.2026
 * Reason for changes: Wave 2 Task 2 — pure URL rewriter for files-transfer
 * offers. Repoints each batch asset.url onto the public-facing base URL of the
 * serving endpoint and re-mints the per-batch fetch token via `tokenFor`. Pure
 * by design: no network I/O, no filesystem, no clock — callers own token
 * minting (see blob-store `mintFilesBlobToken`) so this module stays isomorphic
 * and unit-testable.
 */

import type { FilesOfferPayload } from "../../shared/v2/files-types.ts";

export interface RewriteOfferContext {
    // Public base URL of the endpoint that will actually serve the blob
    // (e.g. `https://192.168.0.200:8434`). Trailing slash is tolerated.
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
