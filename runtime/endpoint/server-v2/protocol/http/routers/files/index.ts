/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/protocol/http/routers/files/index.ts
 * Change date and time: 14.43.00_21.07.2026
 * Reason for changes: Wave 2 Task 3 — HTTP `/files/blob` router exposing the
 * TTL-gated on-disk blob store over PUT/GET/HEAD/DELETE. Auth is a per-batch
 * HMAC token carried via `?token=` or `X-CWSP-Files-Token`; the store mints one
 * on PUT when the caller omits it. Status mapping: bad/missing token -> 401,
 * missing blob -> 404, expired-but-valid token -> 410 (lazy GC), success -> 200.
 *
 * INVARIANT: this router must NOT register a wildcard content-type parser —
 * doing so would hijack JSON/text parsing for every other router mounted on
 * the shared server-v2 app. Only `application/octet-stream` is claimed.
 */

import type { FastifyInstance, FastifyReply } from "fastify";

import {
    createFilesBlobStore,
    type FilesBlobStore
} from "../../../../files/blob-store.ts";

const FILES_TOKEN_HEADER = "X-CWSP-Files-Token";
const OCTET_STREAM = "application/octet-stream";

/**
 * Resolve the per-request blob token. `?token=` wins over the header so a
 * caller can hand a fetch URL to a peer without forcing a header.
 */
function resolveToken(request: { query: Record<string, unknown>; headers: Record<string, string | string[] | undefined> }): string | undefined {
    const queryToken = request.query?.token;
    if (typeof queryToken === "string" && queryToken.length > 0) return queryToken;
    const headerToken = request.headers?.[FILES_TOKEN_HEADER.toLowerCase()];
    if (typeof headerToken === "string" && headerToken.length > 0) return headerToken;
    return undefined;
}

/**
 * Map a `FilesBlobGetStatus` to an HTTP status code. WHY: the store exposes a
 * discriminated status so the router can return 401/404/410 precisely instead
 * of collapsing all failures to 404.
 */
function statusToHttp(status: "ok" | "missing" | "expired" | "unauthorized"): number {
    switch (status) {
        case "ok": return 200;
        case "missing": return 404;
        case "expired": return 410;
        case "unauthorized": return 401;
    }
}

/**
 * Register the `/files/blob/:transferId/:batchId` routes on a Fastify app.
 *
 * NOTE: unlike the clipboard/dispatch routers this registrar does NOT require
 * a runtimeContext — it builds a default `createFilesBlobStore()` when none is
 * supplied. Inject tests may pass `runtimeContext.filesBlobStore` to root the
 * store in a temp dir; production wiring passes the shared store the same way.
 */
export const registerFilesHttpRouter = async (
    app: FastifyInstance,
    runtimeContext?: { filesBlobStore?: FilesBlobStore } & Record<string, unknown>
): Promise<void> => {
    // WHY: a single store instance per app; the secret lives inside it and is
    // never exposed to the router. Tests override via runtimeContext.
    const store: FilesBlobStore = runtimeContext?.filesBlobStore ?? createFilesBlobStore();

    // Claim only `application/octet-stream` as a raw buffer. COMPAT: registering
    // a wildcard here would break JSON/text parsing for sibling routers on the
    // shared app, so we deliberately scope this to the files binary media type.
    app.addContentTypeParser(
        OCTET_STREAM,
        { parseAs: "buffer" },
        (_request, body, done) => {
            done(null, body as Buffer);
        }
    );

    const routePath = "/files/blob/:transferId/:batchId";

    // PUT: upload raw bytes. Mints a token if the caller did not supply one.
    app.put(routePath, async (request, reply: FastifyReply) => {
        const { transferId, batchId } = request.params as { transferId: string; batchId: string };
        const bytes = Buffer.isBuffer(request.body) ? request.body : Buffer.from("");
        const providedToken = resolveToken(request);

        const result = await store.put({
            transferId,
            batchId,
            bytes,
            token: providedToken
        });

        return reply.code(200).send({
            ok: true,
            token: result.token,
            size: result.size
        });
    });

    // GET: stream the blob bytes back to the caller.
    // WHY: `exposeHeadRoute: false` here because we register an explicit HEAD
    // handler below with cheaper no-body semantics (avoids reading the file
    // just to discard the body for a probe).
    app.get(routePath, { exposeHeadRoute: false }, async (request, reply: FastifyReply) => {
        const { transferId, batchId } = request.params as { transferId: string; batchId: string };
        const token = resolveToken(request);

        const result = await store.getWithStatus({
            transferId,
            batchId,
            token: token ?? ""
        });

        const httpStatus = statusToHttp(result.status);
        if (result.status !== "ok" || !result.bytes) {
            return reply.code(httpStatus).send();
        }
        return reply
            .code(httpStatus)
            .header("content-type", OCTET_STREAM)
            .header("content-length", String(result.bytes.length))
            .send(result.bytes);
    });

    // HEAD: same status as GET, no body. Used as a cheap readiness/probe.
    app.head(routePath, async (request, reply: FastifyReply) => {
        const { transferId, batchId } = request.params as { transferId: string; batchId: string };
        const token = resolveToken(request);

        const result = await store.getWithStatus({
            transferId,
            batchId,
            token: token ?? ""
        });

        const httpStatus = statusToHttp(result.status);
        if (result.status === "ok" && result.bytes) {
            reply.header("content-type", OCTET_STREAM);
            reply.header("content-length", String(result.bytes.length));
        }
        return reply.code(httpStatus).send();
    });

    // DELETE: sender cancel / GC. Gated by the same token as GET so a hostile
    // peer cannot wipe another peer's batch. Expired/missing blobs report 410/404
    // for symmetry with GET; a valid token over an existing blob deletes and 200s.
    app.delete(routePath, async (request, reply: FastifyReply) => {
        const { transferId, batchId } = request.params as { transferId: string; batchId: string };
        const token = resolveToken(request);

        const result = await store.getWithStatus({
            transferId,
            batchId,
            token: token ?? ""
        });

        const httpStatus = statusToHttp(result.status);
        if (result.status !== "ok") {
            return reply.code(httpStatus).send();
        }
        await store.delete(transferId, batchId);
        return reply.code(200).send({ ok: true });
    });
};
