/*
 * Filename: pull-cache-offer.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/files/pull-cache-offer.ts
 * Change date and time: 00.20.00_22.07.2026
 * Reason for changes: Gateway rewrite alone remints tokens without bytes —
 *   WAN Accept then 404s. When the original offer URL is a private LAN
 *   control/blob path reachable from the gateway (Neu :29110 / Cap :8434 on
 *   home LAN), pull once and store under the reminted token.
 *   2026-07-22: offer forward must NOT await pull — GB/LAN reconnect delays
 *   Accept prompt otherwise. Large batches are skipped (sender mirrors).
 *
 * INVARIANT: never blocks forever — per-batch timeout + size cap. Failures
 *   leave rewrite URL in place (receiver may still succeed if sender mirrored).
 */

import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import { URL } from "node:url";
import type { IncomingMessage } from "node:http";

import type { FilesOfferPayload } from "../../shared/v2/files-types.ts";
import type { FilesBlobStore } from "./blob-store.ts";

/** Skip pulling blobs larger than this into gateway RAM (sender should mirror). */
const PULL_MAX_BYTES = Number(process.env.CWS_FILES_GATEWAY_PULL_MAX_BYTES || "")
    || (64 * 1024 * 1024);
/** Mid-size WAN pull (30–50MiB) needs headroom beyond a short LAN RTT. */
const PULL_TIMEOUT_MS = Number(process.env.CWS_FILES_GATEWAY_PULL_TIMEOUT_MS || "")
    || 180_000;

function isPrivateOrLanHost(host: string): boolean {
    const h = String(host || "").toLowerCase();
    if (!h) return false;
    if (h === "localhost" || h === "127.0.0.1") return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    return false;
}

function httpGetBuffer(urlStr: string): Promise<Buffer | null> {
    return new Promise((resolve) => {
        let settled = false;
        const done = (v: Buffer | null) => {
            if (settled) return;
            settled = true;
            resolve(v);
        };
        try {
            const target = new URL(urlStr);
            const isHttps = target.protocol === "https:";
            const reqFn = isHttps ? httpsRequest : httpRequest;
            const req = reqFn(
                {
                    protocol: target.protocol,
                    hostname: target.hostname,
                    port: target.port || (isHttps ? 443 : 80),
                    path: target.pathname + target.search,
                    method: "GET",
                    rejectUnauthorized: false,
                    timeout: PULL_TIMEOUT_MS,
                    headers: { Accept: "*/*" }
                },
                (res: IncomingMessage) => {
                    const code = res.statusCode || 0;
                    if (code < 200 || code >= 300) {
                        res.resume();
                        done(null);
                        return;
                    }
                    const chunks: Buffer[] = [];
                    let total = 0;
                    res.on("data", (c) => {
                        const buf = Buffer.isBuffer(c) ? c : Buffer.from(c);
                        total += buf.length;
                        if (total > PULL_MAX_BYTES) {
                            try {
                                req.destroy();
                            } catch {
                                /* */
                            }
                            done(null);
                            return;
                        }
                        chunks.push(buf);
                    });
                    res.on("end", () => done(Buffer.concat(chunks)));
                    res.on("error", () => done(null));
                }
            );
            req.on("error", () => done(null));
            req.on("timeout", () => {
                try {
                    req.destroy();
                } catch {
                    /* */
                }
                done(null);
            });
            req.end();
        } catch {
            done(null);
        }
    });
}

/**
 * For each rewritten batch whose *original* URL was a private LAN blob,
 * HTTP-GET the original and `store.put` under the reminted token so WAN
 * receivers can GET the public `/files/blob` URL.
 */
export async function pullCacheRewrittenOfferBlobs(input: {
    original: FilesOfferPayload;
    rewritten: FilesOfferPayload;
    store: FilesBlobStore;
}): Promise<{ pulled: number; failed: number }> {
    const { original, rewritten, store } = input;
    let pulled = 0;
    let failed = 0;
    const n = Math.min(original.batches?.length || 0, rewritten.batches?.length || 0);
    for (let i = 0; i < n; i++) {
        const src = original.batches[i];
        const dst = rewritten.batches[i];
        const srcUrl = typeof src?.asset?.url === "string" ? src.asset.url.trim() : "";
        const dstUrl = typeof dst?.asset?.url === "string" ? dst.asset.url.trim() : "";
        if (!srcUrl || !dstUrl || srcUrl === dstUrl) continue;
        let host = "";
        try {
            host = new URL(srcUrl).hostname;
        } catch {
            failed += 1;
            continue;
        }
        if (!isPrivateOrLanHost(host)) continue;
        // Already public gateway URL on source — Cap/Neu mirrored; skip pull.
        if (/\/files\/blob\//i.test(srcUrl)) continue;

        // WHY: never pull GB blobs into gateway RAM/disk on the offer hot path.
        // Sender should background-mirror; LAN Accept uses peer URL in asset.urls.
        const declared = Number(src?.asset?.size || dst?.asset?.size || 0);
        if (declared > PULL_MAX_BYTES) {
            console.log(
                JSON.stringify({
                    channel: "cwsp-files-gateway",
                    event: "pull-cache-skip-large",
                    transferId: original.transferId,
                    batchId: src.batchId,
                    size: declared,
                    max: PULL_MAX_BYTES
                })
            );
            continue;
        }

        let token = "";
        try {
            token = new URL(dstUrl).searchParams.get("token") || "";
        } catch {
            failed += 1;
            continue;
        }
        if (!token) {
            failed += 1;
            continue;
        }

        const bytes = await httpGetBuffer(srcUrl);
        if (!bytes || bytes.length === 0) {
            failed += 1;
            console.warn(
                JSON.stringify({
                    channel: "cwsp-files-gateway",
                    event: "pull-cache-miss",
                    transferId: original.transferId,
                    batchId: src.batchId,
                    srcHost: host
                })
            );
            continue;
        }
        try {
            await store.put({
                transferId: original.transferId,
                batchId: String(src.batchId || dst.batchId || ""),
                bytes,
                token,
                expiresAt: rewritten.expiresAt || original.expiresAt
            });
            pulled += 1;
            console.log(
                JSON.stringify({
                    channel: "cwsp-files-gateway",
                    event: "pull-cache-ok",
                    transferId: original.transferId,
                    batchId: src.batchId,
                    size: bytes.length,
                    srcHost: host
                })
            );
        } catch (err) {
            failed += 1;
            console.warn(
                JSON.stringify({
                    channel: "cwsp-files-gateway",
                    event: "pull-cache-put-fail",
                    error: err instanceof Error ? err.message : String(err)
                })
            );
        }
    }
    return { pulled, failed };
}
