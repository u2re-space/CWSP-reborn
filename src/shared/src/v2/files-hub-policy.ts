/*
 * Filename: files-hub-policy.ts
 * FullPath: modules/projects/cwsp-shared/src/v2/files-hub-policy.ts
 * Change date and time: 15.18.00_21.07.2026
 * Reason for changes: Wave 3 — shared files-hub policy: stage limits (count +
 * bytes) and the hybrid offer-after-stage decision. Pure functions, no I/O,
 * transport-neutral; consumed by Neutralino/Android/endpoint hubs.
 */

import {
    FILES_STAGE_MAX_BYTES,
    FILES_STAGE_MAX_COUNT,
} from "./files-constants.ts";
import type {
    FilesOfferStageInput,
    FilesOfferStageResult,
    FilesStageLimitsResult,
} from "./files-types.ts";

/**
 * Assert the staged file set fits within the hub's count and byte thresholds.
 * WHY: enforce a single, isomorphic limit before offer materialization so
 * every shell refuses oversized staging at the same boundary.
 * NOTE: negative/NaN sizes are coerced to 0 via `Math.max(0, Number(f.size) || 0)`
 * so a malformed descriptor cannot shrink the total below the real byte sum.
 * WHY NOT `| 0`: ToInt32 wraps at 2^31, so a file ≥ 2 GiB would wrap and could
 * bypass FILES_STAGE_MAX_BYTES (512 MiB). We keep the full IEEE-754 double,
 * which safely represents integer sizes up to 2^53.
 */
export function assertStageLimits(
    files: { size: number }[],
): FilesStageLimitsResult {
    const count = files.length;
    const totalBytes = files.reduce(
        (acc, f) => acc + Math.max(0, Number(f?.size) || 0),
        0,
    );
    if (count > FILES_STAGE_MAX_COUNT) {
        return { ok: false, reason: "count", count, totalBytes };
    }
    if (totalBytes > FILES_STAGE_MAX_BYTES) {
        return { ok: false, reason: "bytes", count, totalBytes };
    }
    return { ok: true };
}

/**
 * Decide the hub phase after staging, applying the hybrid offer rule.
 * WHY: open-with / share-target are pre-addressed by the OS (a target is
 * implied), so non-empty `defaultDestinations` short-circuits to
 * `readyToOffer`. clipboard / picker have no implicit target, so they require
 * explicit `openForShare: "auto"` AND non-empty destinations to auto-offer;
 * `manual` always yields `needDestinations` so the UI can present the
 * Open-for-Share / picker flow.
 */
export function decideOfferAfterStage(
    input: FilesOfferStageInput,
): FilesOfferStageResult {
    const dest = (input.defaultDestinations || [])
        .map(String)
        .filter(Boolean);
    const openWithLike =
        input.source === "open-with" || input.source === "share-target";

    if (openWithLike) {
        if (dest.length > 0) {
            return { phase: "readyToOffer", destinations: dest };
        }
        return { phase: "needDestinations" };
    }

    // clipboard / picker: only `auto` with destinations can auto-offer.
    if (input.openForShare === "auto") {
        if (dest.length > 0) {
            return { phase: "readyToOffer", destinations: dest };
        }
        return { phase: "needDestinations" };
    }

    // manual: always let the UI drive destination selection.
    return { phase: "needDestinations" };
}
