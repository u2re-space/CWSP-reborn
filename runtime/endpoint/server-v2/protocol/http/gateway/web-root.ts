/*
 * Filename: web-root.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/gateway/web-root.ts
 * Change date and time: 14.10.00_17.07.2026
 * Reason for changes: Resolve the Capacitor/Neutralino-parity gateway web build
 *   for / and /gateway/ instead of a missing cwd/gateway stub.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ResolveGatewayWebRootOptions = {
    env?: NodeJS.ProcessEnv | Record<string, string | undefined>;
    cwd?: string;
    /** Optional import.meta.url anchor for walking up to the workspace root. */
    fromFileUrl?: string;
};

const hasIndexHtml = (dir: string): boolean => existsSync(path.join(dir, "index.html"));

/**
 * WHY: Live server-v2 used `cwd/gateway`, but Vite emits
 * `apps/CWSP-reborn/build/gateway/web`. Prefer explicit env, then nearby
 * deploy copies, then the CWSP-reborn build tree discovered from this file.
 */
export const resolveGatewayWebRoot = (options: ResolveGatewayWebRootOptions = {}): string => {
    const env = options.env || process.env;
    const cwd = path.resolve(options.cwd || process.cwd());
    const configured = String(env.CWS_GATEWAY_WEB_ROOT || "").trim();
    if (configured) return path.resolve(configured);

    const anchors: string[] = [cwd];
    if (options.fromFileUrl) {
        anchors.push(path.dirname(fileURLToPath(options.fromFileUrl)));
    } else {
        anchors.push(path.dirname(fileURLToPath(import.meta.url)));
    }

    const candidates: string[] = [];
    for (const anchor of anchors) {
        candidates.push(
            path.resolve(anchor, "gateway"),
            path.resolve(anchor, "gateway/web"),
            path.resolve(anchor, "build/gateway/web")
        );
        // Walk upward looking for apps/CWSP-reborn/build/gateway/web
        let cursor = anchor;
        for (let i = 0; i < 10; i++) {
            candidates.push(path.resolve(cursor, "apps/CWSP-reborn/build/gateway/web"));
            candidates.push(path.resolve(cursor, "build/gateway/web"));
            const parent = path.dirname(cursor);
            if (parent === cursor) break;
            cursor = parent;
        }
    }

    for (const candidate of candidates) {
        if (hasIndexHtml(candidate)) return candidate;
    }

    // Keep the historical default so missing builds still produce a clear 503.
    return path.resolve(cwd, "gateway");
};
