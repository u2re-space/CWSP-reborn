/*
 * Filename: control.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/webnative/control.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — thin loopback /service/config control host for WebNative settings.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";

import type { NodeSettingsBackend, SettingsBlob } from "../settings/types.ts";

export interface WebnativeControlAuth {
    port: number;
    key: string;
}

export interface WebnativeControlServer {
    readonly auth: WebnativeControlAuth;
    readonly server: Server;
    close(): Promise<void>;
}

export interface CreateWebnativeControlOptions {
    backend: NodeSettingsBackend;
    /** Bind host (default 127.0.0.1). */
    host?: string;
    /** Fixed port for tests; 0 = ephemeral. */
    port?: number;
    /** Optional API key; generated when omitted. */
    apiKey?: string;
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
        "Content-Length": Buffer.byteLength(payload)
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
 * Loopback control RPC used by the WebNative webview settings overlay.
 *
 * Routes (parity with CrossWord desktop control comments):
 *   GET  /service/config → { portable, defaults, snapshot, settings }
 *   POST /service/config → merge patch into portable.config.json
 *
 * WHY: frontend `loadSettings` / `saveSettings` talk to this host via
 * `globalThis.__WEBNATIVE_AUTH__` without importing Node modules into the bundle.
 */
export async function createWebnativeControlServer(
    options: CreateWebnativeControlOptions
): Promise<WebnativeControlServer> {
    const host = options.host ?? "127.0.0.1";
    const key = options.apiKey ?? randomBytes(32).toString("hex");
    const { backend } = options;

    const server = createServer(async (req, res) => {
        try {
            if (!checkKey(key, req.headers["x-api-key"])) {
                sendJson(res, 401, { error: "Unauthorized" });
                return;
            }

            const url = new URL(req.url ?? "/", `http://${host}`);
            if (url.pathname !== "/service/config") {
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
                    settings
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
                    settings: merged
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

    const auth = await new Promise<WebnativeControlAuth>((resolve, reject) => {
        server.once("error", reject);
        server.listen(options.port ?? 0, host, () => {
            const address = server.address();
            if (!address || typeof address === "string") {
                reject(new Error("Failed to bind WebNative control server"));
                return;
            }
            resolve({ port: address.port, key });
        });
    });

    return {
        auth,
        server,
        close: () =>
            new Promise((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            })
    };
}
