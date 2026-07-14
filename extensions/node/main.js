// main.js — CWSP Neutralino Node extension
//
// Bridges Neutralino WebView ↔ Node protocol execution (clipboard / input / settings).
// Based on marketmix neutralino-ext-node; CWSP handlers live in ./cwsp-bridge.js.
//
// Also auto-spawns the packaged CWSP Node backend at:
//   <NL_PATH>/backend/node/run-backend.mjs
// WHY: extNode alone is only an IPC shim — settings/protocol/AHK live in the backend.
//
// Events from frontend (Neutralino.extensions.dispatch):
//   runNode { function, parameter }
//     ping | cwsp.dispatch | clipboard.read | clipboard.write | settings.get | settings.patch
//     mouse.move | mouse.click | mouse.scroll | keyboard.type | keyboard.tap

const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

const bridge = require("./cwsp-bridge");

const DEBUG = process.env.CWSP_NL_DEBUG === "1" || process.env.CWSP_NL_DEBUG === "true";

let backendChild = null;
let ext = null;
/** Cached loopback control auth published by backend / pre-written at spawn. */
let controlAuth = null;

const DEFAULT_CONTROL_PORT = 19875;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

/**
 * Resolve Neutralino package root (folder that contains the .exe / resources.neu).
 */
function resolvePackageRoot() {
    if (process.env.NL_PATH && fs.existsSync(process.env.NL_PATH)) {
        return process.env.NL_PATH;
    }
    if (process.env.CWSP_NL_PACKAGE_ROOT && fs.existsSync(process.env.CWSP_NL_PACKAGE_ROOT)) {
        return process.env.CWSP_NL_PACKAGE_ROOT;
    }
    // extensions/node → package root
    return path.resolve(__dirname, "..", "..");
}

function writeDiag(message, extra) {
    try {
        const line =
            JSON.stringify({
                ts: new Date().toISOString(),
                message,
                argv: process.argv,
                extra: extra || null
            }) + "\n";
        fs.appendFileSync(path.join(resolvePackageRoot(), "ext-spawn.log"), line);
    } catch (_) {
        /* ignore */
    }
}

function writeControlAuthFile(auth, packageRoot) {
    try {
        const tmpDir = path.join(packageRoot, ".tmp");
        fs.mkdirSync(tmpDir, { recursive: true });
        const authPath = path.join(tmpDir, "cwsp-control-auth.json");
        const payload = {
            port: auth.port,
            key: auth.key,
            host: "127.0.0.1",
            serviceConfig: "/service/config",
            neutralinoConfig: "/neutralino/config",
            writtenAt: new Date().toISOString()
        };
        fs.writeFileSync(authPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
        controlAuth = { port: auth.port, key: auth.key };
        writeDiag("control-auth-written", { authPath, port: auth.port });
        return authPath;
    } catch (error) {
        writeDiag("control-auth-write-failed", { error: String(error) });
        return null;
    }
}

function startPackagedBackend() {
    if (process.env.CWSP_SKIP_BACKEND === "1") {
        console.log("[extNode] CWSP_SKIP_BACKEND=1 — not spawning backend");
        return null;
    }
    const packageRoot = resolvePackageRoot();
    const runBackend = path.join(
        packageRoot,
        "backend",
        "node",
        "run-backend.mjs"
    );
    if (!fs.existsSync(runBackend)) {
        console.warn(
            "[extNode] packaged backend missing (bridge-only mode):",
            runBackend
        );
        writeDiag("backend-missing", { runBackend });
        return null;
    }

    const controlPort =
        Number(process.env.CWSP_CONTROL_PORT || DEFAULT_CONTROL_PORT) ||
        DEFAULT_CONTROL_PORT;
    const controlKey = String(
        process.env.CWSP_CONTROL_KEY || DEFAULT_CONTROL_KEY
    );
    // WHY: write auth before spawn so the WebView can bind settings arm while
    // the control host is still starting.
    writeControlAuthFile({ port: controlPort, key: controlKey }, packageRoot);

    console.log("[extNode] spawning CWSP backend:", runBackend);
    writeDiag("backend-spawn", {
        runBackend,
        node: process.execPath,
        controlPort
    });
    const child = spawn(process.execPath, [runBackend], {
        cwd: path.dirname(runBackend),
        env: {
            ...process.env,
            CWSP_ROOT: packageRoot,
            CWSP_DESKTOP_SHELL: "neutralino",
            CWSP_NL_PACKAGE_ROOT: packageRoot,
            CWSP_CONTROL_PORT: String(controlPort),
            CWSP_CONTROL_KEY: controlKey,
            // WHY: backend can watch this and exit when extNode dies (orphan guard).
            CWSP_PARENT_PID: String(process.pid)
        },
        // WHY: pipe stdout so we can parse the ready JSON even when Neutralino
        // has no console attached (stdio inherit is silent on Windows GUI).
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
        detached: false
    });

    const appendBackendLog = (streamName, chunk) => {
        try {
            const line = chunk.toString("utf8");
            fs.appendFileSync(
                path.join(packageRoot, "backend-out.log"),
                `[${streamName}] ${line}`
            );
            // Parse ready banner: {"shell":"neutralino",...,"controlPort":18765,...}
            if (streamName === "stdout" && line.includes("controlPort")) {
                const match = line.match(/\{[\s\S]*"controlPort"[\s\S]*\}/);
                if (match) {
                    try {
                        const ready = JSON.parse(match[0]);
                        if (typeof ready.controlPort === "number") {
                            writeControlAuthFile(
                                {
                                    port: ready.controlPort,
                                    key: controlKey
                                },
                                packageRoot
                            );
                            writeDiag("backend-ready", {
                                controlPort: ready.controlPort,
                                protocol: ready.protocol || null
                            });
                        }
                    } catch (_) {
                        /* ignore partial JSON */
                    }
                }
            }
        } catch (_) {
            /* ignore */
        }
    };
    if (child.stdout) child.stdout.on("data", (c) => appendBackendLog("stdout", c));
    if (child.stderr) child.stderr.on("data", (c) => appendBackendLog("stderr", c));

    child.on("exit", (code, signal) => {
        console.warn(
            `[extNode] backend exited code=${code} signal=${signal || ""}`
        );
        writeDiag("backend-exit", { code, signal });
        backendChild = null;
    });
    child.on("error", (error) => {
        console.error("[extNode] backend spawn failed", error);
        writeDiag("backend-spawn-error", { error: String(error) });
        backendChild = null;
    });
    return child;
}

function stopPackagedBackend() {
    if (!backendChild || backendChild.killed) return;
    try {
        backendChild.kill();
    } catch (_) {
        /* ignore */
    }
    backendChild = null;
}

async function handle(fn, parameter) {
    switch (fn) {
        case "ping":
            return `Node PONG (${process.version}) ← ${JSON.stringify(parameter ?? null)}`;
        case "cwsp.dispatch":
            return bridge.dispatch(parameter);
        case "clipboard.read":
            return bridge.clipboardRead(parameter);
        case "clipboard.write":
            return bridge.clipboardWrite(parameter);
        case "settings.get":
            return bridge.settingsGet();
        case "settings.patch":
            return bridge.settingsPatch(parameter);
        case "mouse.move":
            return bridge.mouseMove(parameter);
        case "mouse.click":
            return bridge.mouseClick(parameter);
        case "mouse.scroll":
            return bridge.mouseScroll(parameter);
        case "keyboard.type":
            return bridge.keyboardType(parameter);
        case "keyboard.tap":
            return bridge.keyboardTap(parameter);
        case "backend.status":
            return {
                ok: true,
                running: Boolean(backendChild && !backendChild.killed),
                pid: backendChild?.pid ?? null,
                packageRoot: resolvePackageRoot(),
                controlAuth: controlAuth
            };
        case "backend.auth":
        case "control.auth":
            return {
                ok: true,
                ...(controlAuth || {
                    port: DEFAULT_CONTROL_PORT,
                    key: DEFAULT_CONTROL_KEY
                })
            };
        default:
            return { ok: false, error: { code: "UNKNOWN_FN", message: String(fn) } };
    }
}

function processAppEvent(d) {
    if (!ext || typeof ext.isEvent !== "function") return;
    if (!ext.isEvent(d, "runNode")) return;
    const fn = d?.data?.function;
    const parameter = d?.data?.parameter;
    Promise.resolve()
        .then(() => handle(fn, parameter))
        .then((result) => {
            ext.sendMessage("runNodeResult", { function: fn, result });
        })
        .catch((error) => {
            ext.sendMessage("runNodeResult", {
                function: fn,
                result: {
                    ok: false,
                    error: { code: "BRIDGE_ERROR", message: error?.message || String(error) }
                }
            });
        });
}

process.on("exit", stopPackagedBackend);
process.on("SIGINT", () => {
    stopPackagedBackend();
    process.exit(0);
});
process.on("SIGTERM", () => {
    stopPackagedBackend();
    process.exit(0);
});

console.log("---");
console.log("CWSP Neutralino Node extension");
console.log("NodeJS Version:", process.version);
console.log("NodeJS Path:", process.execPath);
console.log("Package root:", resolvePackageRoot());
console.log("---");
writeDiag("extNode-boot", { packageRoot: resolvePackageRoot() });

// WHY: start backend before Neutralino IPC handshake — if IPC/stdin fails,
// settings/protocol host must still come up beside the exe.
backendChild = startPackagedBackend();

try {
    const NeutralinoExtension = require("./neutralino-extension");
    ext = new NeutralinoExtension(DEBUG);

    // marketmix helper: isEvent may live on prototype
    if (typeof ext.isEvent !== "function") {
        ext.isEvent = function isEvent(d, eventName) {
            return Boolean(d && d.event === eventName);
        };
    }

    bridge
        .boot({
            onEmit: (packet) => {
                try {
                    ext.sendMessage("cwsp.packet", packet);
                } catch (_) {
                    /* ignore */
                }
            }
        })
        .then((info) => {
            if (info) {
                try {
                    ext.sendMessage("cwsp.ready", {
                        ...info,
                        backendPid: backendChild?.pid ?? null
                    });
                } catch (_) {
                    /* ignore */
                }
                console.log("[cwsp-bridge] ready", JSON.stringify(info));
            }
            ext.run(processAppEvent);
            writeDiag("extNode-ipc-running", { backendPid: backendChild?.pid ?? null });
        })
        .catch((error) => {
            console.error("[cwsp-bridge] boot failed", error);
            writeDiag("bridge-boot-failed", { error: String(error) });
            try {
                ext.run(processAppEvent);
            } catch (runError) {
                writeDiag("ext-run-failed", { error: String(runError) });
            }
        });
} catch (error) {
    console.error("[extNode] Neutralino IPC bootstrap failed", error);
    writeDiag("ext-ipc-failed", { error: String(error?.stack || error) });
    // Keep process alive so the backend child is not orphaned/killed with us.
    setInterval(() => {}, 60_000);
}
