/*
 * Filename: control.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/control.ts
 * Change date and time: 16.35.00_11.07.2026
 * Reason for changes: Neutralino control host — /service/config + /neutralino/config aliases.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";

import type { NodeSettingsBackend, SettingsBlob } from "../settings/types.ts";

export interface NeutralinoControlAuth {
    port: number;
    key: string;
}

export interface NeutralinoControlServer {
    readonly auth: NeutralinoControlAuth;
    readonly server: Server;
    close(): Promise<void>;
}

export interface CreateNeutralinoControlOptions {
    backend: NodeSettingsBackend;
    host?: string;
    port?: number;
    apiKey?: string;
    /** Optional Neutralino shell metadata returned by GET /neutralino/config. */
    shellMeta?: Record<string, unknown>;
}

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        req.on("error", reject);
    });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
    const payload = JSON.stringify(body);
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
    });
    res.end(payload);
}

function checkKey(expected: string, incoming: string | string[] | undefined): boolean {
    if (typeof incoming !== "string") return false;
    const a = Buffer.from(incoming);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

/**
 * Loopback control RPC for Neutralino WebView settings overlay.
 *
 * Routes:
 *   GET|POST /service/config     → CWSP portable settings (WebNative parity)
 *   GET|POST /neutralino/config  → same settings + optional shell metadata
 *
 * WHY: frontend settings-bridge dual-arm probes both paths; one host serves both.
 */
export async function createNeutralinoControlServer(
    options: CreateNeutralinoControlOptions
): Promise<NeutralinoControlServer> {
    const host = options.host ?? "127.0.0.1";
    const key = options.apiKey ?? randomBytes(32).toString("hex");
    const { backend } = options;
    const shellMeta = options.shellMeta ?? {};

    const server = createServer(async (req, res) => {
        try {
            if (req.method === "OPTIONS") {
                sendJson(res, 204, {});
                return;
            }

            if (!checkKey(key, req.headers["x-api-key"])) {
                sendJson(res, 401, { error: "Unauthorized" });
                return;
            }

            const url = new URL(req.url ?? "/", `http://${host}`);
            const isService = url.pathname === "/service/config";
            const isNeutralino = url.pathname === "/neutralino/config";
            if (!isService && !isNeutralino) {
                sendJson(res, 404, { error: "Not found" });
                return;
            }

            if (req.method === "GET") {
                const [settings, defaults, snapshot] = await Promise.all([
                    backend.get(),
                    backend.defaults(),
                    backend.snapshot()
                ]);
                sendJson(res, 200, {
                    portable: settings,
                    defaults,
                    snapshot,
                    settings,
                    config: isNeutralino ? { ...shellMeta, ...settings } : settings
                });
                return;
            }

            if (req.method === "POST") {
                const raw = await readBody(req);
                const parsed = raw ? (JSON.parse(raw) as SettingsBlob) : {};
                const merged = await backend.patch(parsed);
                sendJson(res, 200, {
                    ok: true,
                    portable: merged,
                    settings: merged,
                    config: isNeutralino ? { ...shellMeta, ...merged } : merged
                });
                return;
            }

            sendJson(res, 405, { error: "Method not allowed" });
        } catch (error) {
            sendJson(res, 500, {
                error: error instanceof Error ? error.message : "Internal error"
            });
        }
    });

    const port = await new Promise<number>((resolve, reject) => {
        server.once("error", reject);
        server.listen(options.port ?? 0, host, () => {
            const addr = server.address();
            if (addr && typeof addr === "object") resolve(addr.port);
            else reject(new Error("Neutralino control server failed to bind"));
        });
    });

    return {
        auth: { port, key },
        server,
        close: () =>
            new Promise((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            })
    };
}
