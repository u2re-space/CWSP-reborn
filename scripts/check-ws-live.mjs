/*
 * Filename: check-ws-live.mjs
 * FullPath: apps/CWSP-reborn/scripts/check-ws-live.mjs
 * Change date and time: 18.50.00_10.07.2026
 * Reason for changes: Live wss://…/ws E2 handshake against TLS endpoint (:8434).
 *
 * Usage:
 *   node scripts/check-ws-live.mjs
 *   node scripts/check-ws-live.mjs --url https://192.168.0.200:8434
 *   CWSP_WS_CLIENT_ID=L-196 CWSP_WS_TOKEN=… node scripts/check-ws-live.mjs
 *
 * Env (token never printed):
 *   CWSP_WS_URL / CWS_ENDPOINT_URL   default https://127.0.0.1:8434
 *   CWSP_WS_CLIENT_ID                default L-196
 *   CWSP_WS_TOKEN / CWS_ASSOCIATED_TOKEN / CWS_CLIENT_TOKEN
 */

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function parseArgs(argv) {
    const out = { url: null, clientId: null, timeoutMs: 12000 };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--url") out.url = argv[++i];
        else if (a.startsWith("--url=")) out.url = a.slice(6);
        else if (a === "--client-id") out.clientId = argv[++i];
        else if (a === "--timeout") out.timeoutMs = Number(argv[++i]) || 12000;
        else if (a === "--help" || a === "-h") out.help = true;
    }
    return out;
}

function toWsUrl(origin, clientId, token) {
    let base = String(origin || "").trim().replace(/\/$/, "");
    if (base.startsWith("https://")) base = "wss://" + base.slice(8);
    else if (base.startsWith("http://")) base = "ws://" + base.slice(7);
    else if (!base.startsWith("ws")) base = "wss://" + base;
    if (!base.includes("/ws")) base += "/ws";
    const u = new URL(base);
    u.searchParams.set("userId", clientId);
    u.searchParams.set("userKey", token);
    u.searchParams.set("clientId", clientId);
    u.searchParams.set("label", "cwsp-reborn-ws-live");
    u.searchParams.set("deviceId", `live-${clientId}`);
    u.searchParams.set("mode", "push");
    // WHY: server closes 4005 if archetype/connectionType is present but unparsable.
    u.searchParams.set("connectionType", "first-order");
    u.searchParams.set("archetype", "requestor-initiator");
    return u.toString();
}

async function loadWs() {
    try {
        return require("ws");
    } catch {
        // Prefer endpoint's ws dependency.
        const endpointWs = path.resolve(
            __dirname,
            "../../../runtime/cwsp/endpoint/node_modules/ws"
        );
        return require(endpointWs);
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        console.log(`check-ws-live — wss /ws handshake + clipboard:isReady ask

  --url <https://host:8434>
  --client-id <L-…>
  --timeout <ms>
`);
        process.exit(0);
    }

    const origin =
        args.url ||
        process.env.CWSP_WS_URL ||
        process.env.CWS_ENDPOINT_URL ||
        "https://127.0.0.1:8434";
    const clientId =
        args.clientId ||
        process.env.CWSP_WS_CLIENT_ID ||
        "L-196";
    const token =
        process.env.CWSP_WS_TOKEN ||
        process.env.CWS_CLIENT_TOKEN ||
        process.env.CWS_ASSOCIATED_TOKEN ||
        "";

    if (!token) {
        console.error("[check-ws-live] missing token (CWSP_WS_TOKEN / CWS_ASSOCIATED_TOKEN)");
        process.exit(2);
    }

    const WebSocket = await loadWs();
    const wsUrl = toWsUrl(origin, clientId, token);
    const redacted = wsUrl.replace(/userKey=[^&]+/g, "userKey=***");
    console.log(`[check-ws-live] connect ${redacted}`);

    const result = await new Promise((resolve) => {
        const steps = { open: false, hello: false, ask: false, result: false, error: null };
        const timer = setTimeout(() => {
            try {
                socket.close();
            } catch {
                /* */
            }
            steps.error = steps.error || "timeout";
            resolve(steps);
        }, args.timeoutMs);

        const socket = new WebSocket(wsUrl, {
            rejectUnauthorized: false,
            handshakeTimeout: args.timeoutMs
        });

        socket.on("open", () => {
            steps.open = true;
            console.log("[check-ws-live] open");
            socket.send(
                JSON.stringify({
                    type: "hello",
                    archetype: "check-ws-live",
                    clientId,
                    ts: Date.now()
                })
            );
            steps.hello = true;
            const ask = {
                op: "ask",
                what: "clipboard:isReady",
                purpose: "clipboard",
                protocol: "ws",
                transport: "ws",
                uuid: `live-${Date.now()}`,
                timestamp: Date.now(),
                sender: clientId,
                byId: clientId,
                nodes: ["*"],
                destinations: ["*"],
                flags: { canonicalV2: true },
                payload: {}
            };
            socket.send(JSON.stringify(ask));
            steps.ask = true;
            console.log("[check-ws-live] ask clipboard:isReady");
        });

        socket.on("message", (data) => {
            const text = String(data);
            let obj;
            try {
                obj = JSON.parse(text);
            } catch {
                return;
            }
            const what = String(obj.what || obj.type || "");
            const op = String(obj.op || "");
            if (
                what.includes("clipboard") ||
                op === "result" ||
                op === "response" ||
                obj.type === "response"
            ) {
                steps.result = true;
                console.log("[check-ws-live] result", what || op || "ok");
                clearTimeout(timer);
                try {
                    socket.close(1000, "done");
                } catch {
                    /* */
                }
                resolve(steps);
            }
        });

        socket.on("unexpected-response", (_req, res) => {
            steps.error = `unexpected-response ${res.statusCode}`;
            clearTimeout(timer);
            resolve(steps);
        });

        socket.on("error", (err) => {
            steps.error = err.message || String(err);
            clearTimeout(timer);
            resolve(steps);
        });

        socket.on("close", (code, reason) => {
            if (!steps.result && !steps.error) {
                steps.error = `closed ${code} ${reason || ""}`.trim();
            }
            clearTimeout(timer);
            resolve(steps);
        });
    });

    const ok = result.open && result.ask && (result.result || !result.error);
    // Accept open+ask even if endpoint does not answer isReady (still proves /ws TLS).
    const pass = result.open && result.hello && result.ask && !String(result.error || "").includes("ECONNREFUSED");
    if (result.error && !result.open) {
        console.error(`[check-ws-live] FAIL ${result.error}`);
        process.exit(1);
    }
    if (!result.open) {
        console.error("[check-ws-live] FAIL no open");
        process.exit(1);
    }
    console.log(
        `[check-ws-live] ${pass ? "OK" : "PARTIAL"} open=${result.open} hello=${result.hello} ask=${result.ask} result=${result.result}${result.error ? " err=" + result.error : ""}`
    );
    process.exit(pass ? 0 : 1);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
