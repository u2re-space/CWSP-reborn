// NeutralinoExtension
//
// A Node extension engine for Neutralino.
// Based on marketmix neutralino-ext-node, hardened for CWSP portable packs.
//
// COMPAT: Neutralino may pass IPC bootstrap via:
//   1) process.argv  (--nl-port= / --nl-token= / --nl-extension-id=)
//   2) stdin JSON    ({ nlPort, nlToken, nlConnectToken, nlExtensionId })
//   3) fallback file ${NL_PATH}/.tmp/auth_info.json (exportAuthInfo) + ext id
//
// (c)2023-2024 Harald Schneider - marketmix.com
// CWSP changes: argv key parsing, auth_info.json fallback, spawn diagnostics.
// 2026-07-18: IPC WS reconnect (do not process.exit on transient close) so
//   tray hide / WebView recycle cannot kill extNode + clipboard-hub.

const fs = require("node:fs");
const path = require("node:path");

function packageRootFromModule() {
    // extensions/node → package root
    return path.resolve(__dirname, "..", "..");
}

function parseArgvMap(argv) {
    const out = {};
    for (const raw of argv.slice(2)) {
        const s = String(raw || "");
        const eq = s.indexOf("=");
        if (eq <= 0) continue;
        const key = s.slice(0, eq).replace(/^--/, "").trim();
        const val = s.slice(eq + 1).trim();
        if (key) out[key] = val;
    }
    return out;
}

function readStdinJsonBlocking() {
    try {
        // Neutralino writes IPC JSON to the extension stdin, then closes it.
        // INVARIANT: must block — a non-blocking read races the parent write.
        if (process.stdin.isTTY) return null;
        const text = fs.readFileSync(0, "utf-8").trim();
        if (!text) return null;
        return JSON.parse(text);
    } catch (_) {
        return null;
    }
}

function readAuthInfoFallback(extensionId) {
    const root =
        process.env.NL_PATH ||
        process.env.CWSP_NL_PACKAGE_ROOT ||
        packageRootFromModule();
    const authPath = path.join(root, ".tmp", "auth_info.json");
    if (!fs.existsSync(authPath)) return null;
    try {
        const conf = JSON.parse(fs.readFileSync(authPath, "utf8"));
        return {
            nlPort: conf.nlPort,
            nlToken: conf.nlToken,
            nlConnectToken: conf.nlConnectToken || "",
            nlExtensionId: conf.nlExtensionId || extensionId || "extNode"
        };
    } catch (_) {
        return null;
    }
}

function writeSpawnDiag(message, extra) {
    try {
        const root = packageRootFromModule();
        const line =
            JSON.stringify({
                ts: new Date().toISOString(),
                message,
                argv: process.argv,
                extra: extra || null
            }) + "\n";
        fs.appendFileSync(path.join(root, "ext-spawn.log"), line);
    } catch (_) {
        /* ignore */
    }
}

class NeutralinoExtension {
    constructor(debug = false) {
        this.version = "1.0.4-cwsp";
        this.debug = debug;

        this.debugTermColors = true;
        this.debugTermColorIN = "\x1b[32m";
        this.debugTermColorCALL = "\x1b[91m";
        this.debugTermColorOUT = "\x1b[33m";

        let conf = null;
        const argvMap = parseArgvMap(process.argv);

        if (argvMap["nl-port"] || argvMap.nlPort) {
            conf = {
                nlPort: argvMap["nl-port"] || argvMap.nlPort,
                nlToken: argvMap["nl-token"] || argvMap.nlToken,
                nlConnectToken:
                    argvMap["nl-connect-token"] || argvMap.nlConnectToken || "",
                nlExtensionId:
                    argvMap["nl-extension-id"] ||
                    argvMap.nlExtensionId ||
                    "extNode"
            };
            writeSpawnDiag("boot-via-argv", conf);
        } else {
            conf = readStdinJsonBlocking();
            if (conf) writeSpawnDiag("boot-via-stdin", conf);
        }

        if (!conf) {
            conf = readAuthInfoFallback("extNode");
            if (conf) writeSpawnDiag("boot-via-auth_info.json", conf);
        }

        if (!conf || !conf.nlPort || !conf.nlToken) {
            writeSpawnDiag("boot-failed-no-ipc-config", {
                stdinIsTTY: Boolean(process.stdin.isTTY)
            });
            throw new Error(
                "NeutralinoExtension: missing IPC bootstrap (argv/stdin/auth_info.json)"
            );
        }

        this.port = conf.nlPort;
        this.token = conf.nlToken;
        this.connectToken = conf.nlConnectToken || "";
        this.idExtension = conf.nlExtensionId || "extNode";
        this.urlSocket = this.connectToken
            ? `ws://127.0.0.1:${this.port}?extensionId=${this.idExtension}&connectToken=${this.connectToken}`
            : `ws://127.0.0.1:${this.port}?extensionId=${this.idExtension}`;

        this.socket = undefined;
        // WHY: hide-to-tray / WebView recycle can close the IPC socket while
        // Neutralino.exe stays alive. Exiting kills extNode → clipboard-hub dies.
        // Opt-in legacy: CWSP_NL_TERM_ON_IPC_CLOSE=1
        this.termOnWindowClose =
            process.env.CWSP_NL_TERM_ON_IPC_CLOSE === "1" ||
            process.env.CWSP_NL_TERM_ON_IPC_CLOSE === "true";
        this._ipcHandler = null;
        this._ipcReconnectTimer = null;
        this._ipcAttempt = 0;
        this._ipcClosed = false;

        this.debugLog(`${this.idExtension} running on port ${this.port}`);
    }

    sendMessage(event, data = null) {
        let d = {
            id: crypto.randomUUID(),
            method: "app.broadcast",
            accessToken: this.token,
            data: {
                event: event,
                data: data
            }
        };
        let msg = JSON.stringify(d);
        if (!this.socket || this.socket.readyState !== 1) {
            writeSpawnDiag("ws-send-skip", { reason: "not-open" });
            return;
        }
        this.socket.send(msg);
        this.debugLog(`${msg}`, "out");
    }

    _clearIpcReconnect() {
        if (this._ipcReconnectTimer) {
            clearTimeout(this._ipcReconnectTimer);
            this._ipcReconnectTimer = null;
        }
    }

    _scheduleIpcReconnect(reason) {
        if (this._ipcClosed || this.termOnWindowClose) return;
        if (this._ipcReconnectTimer) return;
        this._ipcAttempt += 1;
        const delay = Math.min(500 * Math.max(1, this._ipcAttempt), 10000);
        writeSpawnDiag("ws-reconnect-scheduled", { reason, delay, attempt: this._ipcAttempt });
        this._ipcReconnectTimer = setTimeout(() => {
            this._ipcReconnectTimer = null;
            if (this._ipcClosed) return;
            this._attachIpcSocket(this._ipcHandler);
        }, delay);
    }

    _attachIpcSocket(onReceiveMessage) {
        const WebSocket = require("ws");
        this._clearIpcReconnect();
        try {
            if (this.socket) {
                try {
                    this.socket.removeAllListeners();
                } catch (_) {
                    /* ignore */
                }
                try {
                    this.socket.close();
                } catch (_) {
                    /* ignore */
                }
            }
        } catch (_) {
            /* ignore */
        }

        this.socket = new WebSocket(this.urlSocket);
        const self = this;

        this.socket.on("open", () => {
            self._ipcAttempt = 0;
            console.log("WebSocket ready");
            console.log(`Running on port ${self.port}`);
            writeSpawnDiag("ws-open", { url: self.urlSocket });
        });

        this.socket.on("message", (data) => {
            let msg = data.toString("utf-8");
            try {
                msg = JSON.parse(msg);
            } catch (_) {
                /* keep string */
            }
            if (typeof onReceiveMessage === "function") {
                onReceiveMessage(msg);
            }
            self.debugLog(JSON.stringify(msg), "in");
        });

        this.socket.on("close", (code, reason) => {
            writeSpawnDiag("ws-close", {
                code: typeof code === "number" ? code : null,
                reason: reason ? String(reason) : null,
                termOnWindowClose: self.termOnWindowClose
            });
            if (self.termOnWindowClose) {
                process.exit(0);
                return;
            }
            // WHY: keep extNode + packaged backend alive; redial Neutralino IPC.
            self._scheduleIpcReconnect(`close:${code ?? "?"}`);
        });

        this.socket.on("error", (error) => {
            writeSpawnDiag("ws-error", { error: String(error) });
            console.error("WebSocket error", error);
        });

        // PERF: protocol-level ping keeps idle IPC from being GC'd by proxies.
        try {
            const pingMs = Number(process.env.CWSP_NL_IPC_PING_MS || 15000) || 15000;
            if (this._ipcPingTimer) clearInterval(this._ipcPingTimer);
            this._ipcPingTimer = setInterval(() => {
                try {
                    if (self.socket && self.socket.readyState === 1 && typeof self.socket.ping === "function") {
                        self.socket.ping();
                    }
                } catch (_) {
                    /* ignore */
                }
            }, pingMs);
            if (typeof this._ipcPingTimer.unref === "function") this._ipcPingTimer.unref();
        } catch (_) {
            /* ignore */
        }
    }

    run(onReceiveMessage) {
        this._ipcHandler = onReceiveMessage;
        this._ipcClosed = false;
        this._attachIpcSocket(onReceiveMessage);
    }

    debugLog(msg, dir = "in") {
        if (!this.debug) return;
        const color =
            dir === "out"
                ? this.debugTermColorOUT
                : dir === "call"
                  ? this.debugTermColorCALL
                  : this.debugTermColorIN;
        const reset = this.debugTermColors ? "\x1b[0m" : "";
        const prefix = this.debugTermColors ? color : "";
        console.log(`${prefix}${msg}${reset}`);
    }

    isEvent(e, eventName) {
        if (!e || !eventName) return false;
        if (e.event === eventName) return true;
        if (e.data && e.data.event === eventName) return true;
        return false;
    }
}

module.exports = NeutralinoExtension;
