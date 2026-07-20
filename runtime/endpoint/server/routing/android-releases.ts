/*
 * Filename: android-releases.ts
 * FullPath: runtime/cwsp/endpoint/server/routing/android-releases.ts
 * Change date and time: 14.05.00_20.07.2026
 * Reason for changes: Authenticated Capacitor APK /releases/android/* for in-app updates.
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

import config from "../config/config.ts";
import { pickEnvStringLegacy } from "../lib/env.ts";
import { DATA_DIR, safeJoin } from "../lib/paths.ts";
import { normalizeEndpointPolicies } from "../network/stack/endpoint-policy.ts";

const MANIFEST_NAME = "latest.json";

/** Resolve releases root: env override or `<DATA_DIR>/releases/android`. */
export const resolveAndroidReleasesDir = (): string => {
    const fromEnv = pickEnvStringLegacy("CWS_ANDROID_RELEASES_DIR");
    if (fromEnv) return path.resolve(fromEnv);
    return path.resolve(DATA_DIR, "releases", "android");
};

const normalizeToken = (value: unknown): string => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const bearer = raw.match(/^bearer\s+(.+)$/i);
    if (bearer?.[1]) return bearer[1].trim();
    if (raw.startsWith("inline:")) return raw.slice("inline:".length).trim();
    if (raw.startsWith("token:")) return raw.slice("token:".length).trim();
    return raw;
};

const extractRequestToken = (request: any): string => {
    const headers = request?.headers || {};
    const apiKey = headers["x-api-key"] || headers["X-API-Key"];
    const authToken = headers["x-auth-token"] || headers["X-Auth-Token"] || headers["x-auth_token"];
    const cwsToken = headers["x-cws-token"] || headers["X-Cws-Token"];
    const auth = headers.authorization || headers.Authorization;
    return (
        normalizeToken(apiKey) ||
        normalizeToken(authToken) ||
        normalizeToken(cwsToken) ||
        normalizeToken(auth) ||
        ""
    );
};

/** Collect accepted secrets: config.secret, env ecosystem tokens, endpointIDs.tokens. */
const collectAcceptedTokens = (): Set<string> => {
    const out = new Set<string>();
    const push = (value: unknown) => {
        const t = normalizeToken(value);
        if (t) out.add(t);
    };

    push((config as any)?.secret);
    // COMPAT: fleet phones / bridge use several env aliases for the shared ecosystem key.
    push(pickEnvStringLegacy("CWS_CLIENT_TOKEN"));
    push(pickEnvStringLegacy("CWS_ECOSYSTEM_TOKEN"));
    push(pickEnvStringLegacy("CWS_ACCESS_TOKEN"));
    push(pickEnvStringLegacy("CWS_ASSOCIATED_TOKEN"));
    push(pickEnvStringLegacy("CWS_BRIDGE_USER_KEY"));
    push(pickEnvStringLegacy("CWS_USER_KEY"));

    const runtimeRaw = (((config as any)?.endpointIDs || {}) as Record<string, any>);
    const policyMap = normalizeEndpointPolicies(runtimeRaw) as Record<string, any>;
    for (const entry of Object.values(policyMap || {})) {
        const tokens = Array.isArray(entry?.tokens) ? entry.tokens : [];
        for (const token of tokens) {
            if (token === "*") continue;
            push(token);
        }
    }

    // WHY: some gateways only persist the key under core settings, not endpointIDs.tokens.
    try {
        const core = (config as any)?.core || {};
        push(core.ecosystemToken);
        push(core.userKey);
        push(core?.socket?.accessToken);
    } catch {
        /* optional */
    }
    return out;
};

/**
 * WHY: Dev APKs are fleet-internal; require ecosystem/secret token (X-API-Key preferred).
 * INVARIANT: empty accepted set → reject (unlike clipboard isAuthorized which allows open when secret empty).
 */
export const isAndroidReleaseAuthorized = (request: any): boolean => {
    const presented = extractRequestToken(request);
    if (!presented) return false;
    const accepted = collectAcceptedTokens();
    if (accepted.size === 0) {
        // COMPAT: local lab with no tokens configured — still require a non-empty header
        // matching config.secret only when secret is set; otherwise deny.
        const secret = normalizeToken((config as any)?.secret);
        return Boolean(secret && presented === secret);
    }
    return accepted.has(presented);
};

const contentTypeFor = (fileName: string): string => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".json")) return "application/json; charset=utf-8";
    if (lower.endsWith(".apk")) return "application/vnd.android.package-archive";
    return "application/octet-stream";
};

const sendUnauthorized = (reply: any) => {
    reply.header("Content-Type", "application/json; charset=utf-8");
    return reply.code(401).send({ ok: false, error: "Unauthorized" });
};

const sendNotFound = (reply: any, message: string) => {
    reply.header("Content-Type", "application/json; charset=utf-8");
    return reply.code(404).send({ ok: false, error: message });
};

/**
 * Register GET /releases/android/latest.json and GET /releases/android/*
 * Files are served from CWS_ANDROID_RELEASES_DIR or data/releases/android/.
 */
export function registerAndroidReleaseRoutes(app: any): void {
    const root = resolveAndroidReleasesDir();

    app.get("/releases/android/latest.json", async (request: any, reply: any) => {
        if (!isAndroidReleaseAuthorized(request)) return sendUnauthorized(reply);
        const filePath = path.join(root, MANIFEST_NAME);
        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
            return sendNotFound(reply, "Android release manifest not found");
        }
        reply.header("Content-Type", "application/json; charset=utf-8");
        reply.header("Cache-Control", "no-store");
        return reply.send(createReadStream(filePath));
    });

    app.get("/releases/android/*", async (request: any, reply: any) => {
        if (!isAndroidReleaseAuthorized(request)) return sendUnauthorized(reply);

        const wildcard = String((request.params as any)?.["*"] || "").replace(/^\/+/, "");
        if (!wildcard || wildcard.includes("\0") || wildcard.includes("..")) {
            return sendNotFound(reply, "Invalid path");
        }

        const filePath = safeJoin(root, wildcard);
        if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
            return sendNotFound(reply, "Release file not found");
        }

        const base = path.basename(filePath);
        const st = statSync(filePath);
        reply.header("Content-Type", contentTypeFor(base));
        reply.header("Content-Length", String(st.size));
        reply.header("Cache-Control", "no-store");
        if (base.toLowerCase().endsWith(".apk")) {
            reply.header("Content-Disposition", `attachment; filename="${base}"`);
        }
        return reply.send(createReadStream(filePath));
    });

    app.log?.info?.(
        { root, routes: ["/releases/android/latest.json", "/releases/android/*"] },
        "[android-releases] routes registered"
    );
}
