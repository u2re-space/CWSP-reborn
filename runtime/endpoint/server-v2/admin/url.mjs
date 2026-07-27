/*
 * Filename: url.mjs
 * FullPath: runtime/cwsp/endpoint/server-v2/admin/url.mjs
 * Change date and time: 14.05.00_17.07.2026
 * Reason for changes: Inherit admin-page port when Endpoint URL is a bare host/IP.
 */

/**
 * WHY: Admin prefs often store bare IPs (`45.147.121.152`). Promoting them to
 * `https://host` alone targets :443, but CWSP endpoints listen on :8434.
 * When the raw value has no explicit port, inherit the port from the page origin.
 *
 * @param {string} raw
 * @param {string} fallbackOrigin Absolute origin used when raw is empty, and
 *   for scheme/port when promoting a bare host.
 * @returns {string}
 */
export const normalizeEndpointUrl = (raw, fallbackOrigin) => {
    const value = String(raw || "").trim();
    const fallback = String(fallbackOrigin || "").trim() || "https://localhost";
    if (!value) return fallback;
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value)) return value;

    const hostish = value.replace(/^\/+/, "");
    const scheme = fallback.startsWith("http://") ? "http://" : "https://";
    if (hasExplicitPort(hostish)) return `${scheme}${hostish}`;

    const fallbackPort = readUrlPort(fallback);
    return fallbackPort ? `${scheme}${hostish}:${fallbackPort}` : `${scheme}${hostish}`;
};

const hasExplicitPort = (hostish) => {
    const value = String(hostish || "");
    if (value.startsWith("[")) return /\]:\d+$/.test(value);
    const idx = value.lastIndexOf(":");
    if (idx <= 0) return false;
    return /^\d+$/.test(value.slice(idx + 1));
};

const readUrlPort = (origin) => {
    try {
        const parsed = new URL(origin.includes("://") ? origin : `https://${origin}`);
        return parsed.port || "";
    } catch {
        return "";
    }
};
