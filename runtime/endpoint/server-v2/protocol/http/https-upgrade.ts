/*
 * Filename: https-upgrade.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/https-upgrade.ts
 * Change date and time: 14.30.00_17.07.2026
 * Reason for changes: Same-port plain-HTTP → HTTPS redirect so browsers that
 *   default to http://host:8434/ get a 308 instead of an empty TLS mismatch.
 */

import http from "node:http";
import net from "node:net";
import type { Server as HttpsServer } from "node:https";
import type { Server as HttpServer } from "node:http";

/** TLS Handshake record type (ClientHello). */
export const TLS_HANDSHAKE_BYTE = 0x16;

/**
 * Build the absolute https Location for a plain-HTTP request on the HTTPS port.
 * Prefers the request Host header so WAN/LAN Hostnames stay correct.
 */
export const buildHttpsRedirectLocation = (
    req: Pick<http.IncomingMessage, "headers" | "url">,
    fallbackAuthority: string
): string => {
    const host = String(req.headers.host || "").trim() || fallbackAuthority;
    const rawPath = req.url && String(req.url).length ? String(req.url) : "/";
    const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    return `https://${host}${path}`;
};

/** Minimal HTTP server that only issues 308 redirects to https://. */
export const createPlainHttpHttpsRedirectServer = (fallbackAuthority: string): HttpServer => {
    return http.createServer((req, res) => {
        const location = buildHttpsRedirectLocation(req, fallbackAuthority);
        res.writeHead(308, {
            Location: location,
            "Content-Length": "0",
            Connection: "close"
        });
        res.end();
    });
};

/**
 * TCP multiplexer: first byte 0x16 → TLS/HTTPS server; otherwise → plain HTTP redirector.
 * WHY: one public port cannot run both `http.Server` and `https.Server` without sniffing.
 */
export const createTlsHttpMux = (
    httpsServer: HttpsServer | net.Server,
    httpServer: HttpServer | net.Server
): net.Server => {
    return net.createServer((socket) => {
        let handedOff = false;
        const fail = () => {
            if (!handedOff) {
                try {
                    socket.destroy();
                } catch {
                    /* ignore */
                }
            }
        };
        socket.once("error", fail);
        socket.once("data", (chunk: Buffer) => {
            handedOff = true;
            socket.pause();
            socket.unshift(chunk);
            if (chunk.length > 0 && chunk[0] === TLS_HANDSHAKE_BYTE) {
                httpsServer.emit("connection", socket);
            } else {
                httpServer.emit("connection", socket);
            }
            process.nextTick(() => {
                try {
                    socket.resume();
                } catch {
                    /* ignore */
                }
            });
        });
    });
};

export const listenNetServer = (
    server: net.Server,
    options: { host: string; port: number }
): Promise<number> => {
    return new Promise((resolve, reject) => {
        const onError = (err: Error) => {
            server.off("listening", onListening);
            reject(err);
        };
        const onListening = () => {
            server.off("error", onError);
            const addr = server.address();
            const port =
                addr && typeof addr === "object" && Number.isFinite(addr.port) ? addr.port : options.port;
            resolve(port);
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(options.port, options.host);
    });
};

export type HttpsUpgradeListenResult = {
    mux: net.Server;
    redirectServer: HttpServer;
    port: number;
};

/**
 * Ready the Fastify HTTPS app without binding it, then bind a mux that shares the port.
 * INVARIANT: do not call `app.listen()` when using this path — only the mux owns the port.
 */
export const listenHttpsWithHttpUpgrade = async (options: {
    httpsServer: HttpsServer;
    host: string;
    port: number;
    /** Used when the client omits Host (rare). */
    fallbackAuthority?: string;
}): Promise<HttpsUpgradeListenResult> => {
    const authority =
        String(options.fallbackAuthority || "").trim() ||
        `${options.host === "0.0.0.0" || options.host === "::" ? "localhost" : options.host}:${options.port}`;
    const redirectServer = createPlainHttpHttpsRedirectServer(authority);
    const mux = createTlsHttpMux(options.httpsServer, redirectServer);
    try {
        const bound = await listenNetServer(mux, { host: options.host, port: options.port });
        return { mux, redirectServer, port: bound };
    } catch (error) {
        mux.close();
        redirectServer.close();
        throw error;
    }
};
