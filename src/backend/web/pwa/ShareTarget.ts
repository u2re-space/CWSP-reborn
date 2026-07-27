/*
 * Filename: ShareTarget.ts
 * FullPath: apps/CWSP-reborn/src/backend/web/pwa/ShareTarget.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream C — parse Web Share Target POST/search payloads
 * into a normalized shape ready for clipboard defer.
 *
 * NOTE: PWA share targets receive data either as a URLSearchParams body (form
 * `application/x-www-form-urlencoded`) or as `?title=...&text=...&url=...` on
 * the launch URL. We normalize both into one object and prefer `text` as the
 * clipboard body, mirroring the CWSP clipboard payload rule (text preferred).
 */

export interface ShareTargetPayload {
    title?: string;
    text?: string;
    url?: string;
}

/** Result of normalization: the original fields plus a single `body` for defer. */
export interface NormalizedShareTarget extends ShareTargetPayload {
    /** First usable textual value, in CWSP clipboard-preference order: text, url, title. */
    body?: string;
}

function asSearchParams(search: string | URLSearchParams): URLSearchParams {
    if (typeof search === "string") {
        // Tolerate a leading `?` and a full URL with a query component.
        const queryStart = search.indexOf("?");
        const qs = queryStart >= 0 ? search.slice(queryStart + 1) : search.replace(/^\?+/, "");
        return new URLSearchParams(qs);
    }
    return search;
}

/** Parse a share-target search string or URLSearchParams into raw fields. */
export function parseShareTargetSearch(search: string | URLSearchParams): ShareTargetPayload {
    const params = asSearchParams(search);
    const title = params.get("title") ?? undefined;
    const text = params.get("text") ?? undefined;
    const url = params.get("url") ?? undefined;

    const result: ShareTargetPayload = {};
    if (title) result.title = title;
    if (text) result.text = text;
    if (url) result.url = url;
    return result;
}

/**
 * Normalize a share payload for clipboard defer.
 *
 * Preference order matches the CWSP clipboard contract (text preferred over
 * url, url preferred over title) so the deferred body is always textual and
 * non-empty when any field is present.
 */
export function normalizeShareTarget(payload: ShareTargetPayload): NormalizedShareTarget {
    const body = payload.text ?? payload.url ?? payload.title;
    return { ...payload, body };
}
