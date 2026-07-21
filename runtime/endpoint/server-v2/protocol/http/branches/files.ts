/*
 * Filename: files.ts
 * FullPath: apps/CWSP-reborn/runtime/endpoint/server-v2/protocol/http/branches/files.ts
 * Change date and time: 00.10.00_22.07.2026
 * Reason for changes: Live server-v2 boot never mounted `/files/blob` — Cap WAN
 *   offers advertised private LAN URLs and gateway rewrite had nowhere to serve
 *   bytes. Mount the W2 files HTTP router + `/files/probe` on the :8434 app.
 *
 * INVARIANT: process-singleton blob store so PUT-minted tokens match GET and
 *   offer-rewrite mint (same HMAC secret).
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { registerFilesHttpRouter } from "../routers/files/index.ts";
import {
    getSharedFilesBlobStore,
    type FilesBlobStore
} from "../../../files/blob-store.ts";
import type { ServerV2HttpBranch } from "../types.ts";

/** Shared with prepareFilesOfferForForward token mint via same env secret. */
export const getServerV2FilesBlobStore = (): FilesBlobStore => getSharedFilesBlobStore();

const noStore = (reply: FastifyReply): void => {
    reply.header("cache-control", "no-store");
    reply.header("pragma", "no-cache");
    reply.header("expires", "0");
};

const sendFilesProbe = async (req: FastifyRequest, reply: FastifyReply) => {
    const origin = String((req.headers as { origin?: string })?.origin || "");
    if (origin) {
        reply.header("Access-Control-Allow-Origin", origin);
        reply.header("Vary", "Origin");
        reply.header("Access-Control-Allow-Private-Network", "true");
    }
    noStore(reply);
    return reply.code(204).send();
};

export const filesHttpBranch: ServerV2HttpBranch = {
    id: "files",
    label: "Files blob",
    notes: "Gateway-reachable PUT/GET `/files/blob` + cheap `/files/probe` for Cap WAN Accept.",
    routes: [
        { method: "OPTIONS", path: "/files/probe" },
        { method: "GET", path: "/files/probe" },
        { method: "HEAD", path: "/files/probe" },
        { method: "PUT", path: "/files/blob/:transferId/:batchId" },
        { method: "GET", path: "/files/blob/:transferId/:batchId" },
        { method: "HEAD", path: "/files/blob/:transferId/:batchId" },
        { method: "DELETE", path: "/files/blob/:transferId/:batchId" }
    ],
    register: async ({ app, runtimeContext }) => {
        const store =
            (runtimeContext as { filesBlobStore?: FilesBlobStore } | undefined)?.filesBlobStore
            ?? getServerV2FilesBlobStore();

        // WHY: mirrors `/lna-probe` so Cap/Neutralino can probe before Accept GET.
        (app as FastifyInstance).options("/files/probe", async (req, reply) => {
            const origin = String((req.headers as { origin?: string })?.origin || "");
            if (origin) reply.header("Access-Control-Allow-Origin", origin);
            reply.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            reply.header("Access-Control-Allow-Headers", "Content-Type, X-CWSP-Files-Token, X-CWSP-Files-Upload-Secret");
            reply.header("Access-Control-Max-Age", "600");
            if (
                String(
                    (req.headers as { "access-control-request-private-network"?: string })
                        ?.["access-control-request-private-network"] || ""
                ).toLowerCase() === "true"
            ) {
                reply.header("Access-Control-Allow-Private-Network", "true");
                reply.header("Vary", "Origin, Access-Control-Request-Private-Network");
            } else if (origin) {
                reply.header("Vary", "Origin");
            }
            return reply.code(204).send();
        });
        (app as FastifyInstance).get("/files/probe", { exposeHeadRoute: false }, sendFilesProbe);
        (app as FastifyInstance).head("/files/probe", sendFilesProbe);

        await registerFilesHttpRouter(app as FastifyInstance, { filesBlobStore: store });
    }
};
