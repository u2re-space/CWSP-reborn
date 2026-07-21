/*
 * Filename: main.js
 * FullPath: apps/CWSP-reborn/app/windows/neutralino-ext-node/extensions/node/main.js
 * Change date and time: 13.05.00_21.07.2026
 * Reason for changes: Use shared portable-runtime (tar.gz = backend/ + extensions/).
 *   2026-07-21b: after idle, Neutralino UI stayed up while extNode+backend were gone —
 *   process.on(exit) killed backend with the extension. Keep backend while NL.exe lives;
 *   adopt live :29110 on restart; resolve NL host by exe name (not cmd ppid).
 */

// main.js — CWSP Neutralino Node extension
//
// Bridges Neutralino WebView ↔ Node protocol execution (clipboard / input / settings).
// Based on marketmix neutralino-ext-node; CWSP handlers live in ./cwsp-bridge.js.
//
// Portable layout (Windows desk):
//   <exeDir>/cwsp-neutralino-win_x64.exe
//   <exeDir>/cwsp-neutralino-win_x64.tar.gz   ← backend/ + extensions/
//   <exeDir>/.config/                        ← durable settings (not wiped by unpack)
//   <exeDir>/extensions/node/{run.cmd,bootstrap.mjs,portable-runtime.js}  ← thin stub
// bootstrap unpacks tar.gz → %TEMP%/cwsp-neutralino/ then requires this file in-process.
// COMPAT: unpacked <exeDir>/backend + <exeDir>/extensions/node/main.js still work (dev).
//
// Events from frontend (Neutralino.extensions.dispatch):
//   runNode { function, parameter }
//     ping | cwsp.dispatch | clipboard.read | clipboard.write | settings.get | settings.patch
//     mouse.move | mouse.click | mouse.scroll | keyboard.type | keyboard.tap
//     backend.stop | backend.status | control.auth
//
// WHY (orphan fix): tray Quit must tear down run-backend.mjs + windows/index.ts.
//   Pass CWSP_PARENT_PID / CWSP_NL_PID and kill the Windows process tree on stop.
// WHY (tray longevity 2026-07-18): IPC `disconnect` must NOT kill the backend —
//   Neutralino can detach the extension pipe while the tray/.exe stays alive.
//   Unexpected backend exits are auto-respawned while the NL host PID is alive.

const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");

const bridge = require("./cwsp-bridge");
const {
    resolveHostRoot,
    ensurePortableRuntime
} = require("./portable-runtime");

const DEBUG = process.env.CWSP_NL_DEBUG === "1" || process.env.CWSP_NL_DEBUG === "true";

let backendChild = null;
/** True when we attached to a pre-existing control host (survived prior extNode death). */
let backendAdopted = false;
let ext = null;
/** Cached loopback control auth published by backend / pre-written at spawn. */
let controlAuth = null;
/** True after intentional backend.stop / process shutdown — suppress respawn. */
let backendStopRequested = false;
let backendRespawnTimer = null;
let backendCrashTimestamps = [];
/** Cached Neutralino.exe PID (not cmd.exe from run.cmd). */
let cachedNeutralinoPid = 0;

// WHY: Cursor.exe steals :19875/:19876 → UI gets ERR_EMPTY_RESPONSE.
const DEFAULT_CONTROL_PORT = 29110;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";
const BACKEND_RESPAWN_MS = 1500;
const BACKEND_CRASH_LOOP_WINDOW_MS = 60_000;
const BACKEND_CRASH_LOOP_MAX = 6;
const NL_EXE_RE = /cwsp-neutralino.*\.exe$/i;

/** @deprecated alias — host root (exe dir), not TEMP runtime unpack. */
function resolvePackageRoot() {
    return resolveHostRoot();
}

function resolveConfigPath(hostRoot) {
    if (process.env.CWSP_PORTABLE_CONFIG && String(process.env.CWSP_PORTABLE_CONFIG).trim()) {
        return path.resolve(String(process.env.CWSP_PORTABLE_CONFIG).trim());
    }
    if (process.env.CWS_PORTABLE_CONFIG_PATH && String(process.env.CWS_PORTABLE_CONFIG_PATH).trim()) {
        return path.resolve(String(process.env.CWS_PORTABLE_CONFIG_PATH).trim());
    }
    const configDir = path.join(hostRoot, ".config");
    const preferred = path.join(configDir, "portable.config.json");
    try {
        fs.mkdirSync(configDir, { recursive: true });
    } catch (_) {
        /* ignore */
    }
    if (!fs.existsSync(preferred)) {
        const legacy = [
            path.join(hostRoot, "portable.config.json"),
            path.join(hostRoot, "backend", "node", "portable.config.json")
        ];
        for (const src of legacy) {
            if (!fs.existsSync(src)) continue;
            try {
                fs.copyFileSync(src, preferred);
                break;
            } catch (_) {
                /* ignore */
            }
        }
    }
    return preferred;
}

/** @returns {{ runtimeRoot: string, runBackend: string, fromArchive: boolean } | null} */
function ensureBackendRuntime(hostRoot) {
    return ensurePortableRuntime(hostRoot);
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
        fs.appendFileSync(path.join(resolveHostRoot(), "ext-spawn.log"), line);
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

/**
 * Kill a Node child and its descendants.
 * WHY: run-backend.mjs spawns windows/index.ts — bare child.kill() leaves orphans
 * on Windows after tray Quit.
 */
function killProcessTree(pid) {
    if (!pid || pid <= 0) return;
    if (process.platform === "win32") {
        try {
            spawnSync("taskkill", ["/pid", String(pid), "/t", "/f"], {
                stdio: "ignore",
                windowsHide: true
            });
            return;
        } catch (_) {
            /* fall through */
        }
    }
    try {
        process.kill(pid, "SIGTERM");
    } catch (_) {
        try {
            process.kill(pid, "SIGKILL");
        } catch (_) {
            /* already gone */
        }
    }
}

function isPidAlive(pid) {
    if (!pid || pid <= 0) return false;
    if (process.platform === "win32") {
        try {
            const out = spawnSync(
                "tasklist",
                ["/FI", `PID eq ${pid}`, "/NH"],
                { encoding: "utf8", windowsHide: true }
            );
            return String(out.stdout || "").includes(String(pid));
        } catch (_) {
            return true; // transient — assume alive
        }
    }
    try {
        process.kill(pid, 0);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Resolve Neutralino host PID.
 * WHY: commandWindows is run.cmd → process.ppid is cmd.exe, not the .exe.
 * Idle/recycle can kill cmd+extNode while cwsp-neutralino-win_x64.exe stays up.
 */
function resolveNeutralinoHostPid() {
    if (cachedNeutralinoPid > 0 && isPidAlive(cachedNeutralinoPid)) {
        return cachedNeutralinoPid;
    }
    const envPid = Number(process.env.CWSP_NL_PID || 0);
    if (envPid > 0 && isPidAlive(envPid)) {
        cachedNeutralinoPid = envPid;
        return envPid;
    }
    if (process.platform === "win32") {
        try {
            const out = spawnSync(
                "powershell",
                [
                    "-NoProfile",
                    "-Command",
                    "Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'cwsp-neutralino' -and $_.Name -like '*.exe' } | Select-Object -First 1 -ExpandProperty ProcessId"
                ],
                { encoding: "utf8", windowsHide: true, timeout: 4000 }
            );
            const pid = Number(String(out.stdout || "").trim());
            if (pid > 0) {
                cachedNeutralinoPid = pid;
                return pid;
            }
        } catch (_) {
            /* ignore */
        }
        try {
            const hostRoot = resolveHostRoot();
            const exe = fs
                .readdirSync(hostRoot)
                .find((n) => NL_EXE_RE.test(n));
            if (exe) {
                const out = spawnSync(
                    "powershell",
                    [
                        "-NoProfile",
                        "-Command",
                        `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq '${exe.replace(/'/g, "")}' } | Select-Object -First 1 -ExpandProperty ProcessId`
                    ],
                    { encoding: "utf8", windowsHide: true, timeout: 4000 }
                );
                const pid = Number(String(out.stdout || "").trim());
                if (pid > 0) {
                    cachedNeutralinoPid = pid;
                    return pid;
                }
            }
        } catch (_) {
            /* ignore */
        }
    }
    const ppid = Number(process.ppid || 0);
    if (ppid > 0 && isPidAlive(ppid)) {
        cachedNeutralinoPid = ppid;
        return ppid;
    }
    return 0;
}

function isNeutralinoHostAlive() {
    return resolveNeutralinoHostPid() > 0;
}

/** Probe loopback control — used to adopt a backend that survived extNode death. */
function probeControlAlive(port, key) {
    return new Promise((resolve) => {
        const req = http.request(
            {
                host: "127.0.0.1",
                port,
                path: "/service/clipboard-hub",
                method: "GET",
                headers: { "X-API-Key": key },
                timeout: 1200
            },
            (res) => {
                res.resume();
                resolve(res.statusCode === 200 || res.statusCode === 401);
            }
        );
        req.on("error", () => resolve(false));
        req.on("timeout", () => {
            try {
                req.destroy();
            } catch (_) {
                /* ignore */
            }
            resolve(false);
        });
        req.end();
    });
}

function clearBackendRespawnTimer() {
    if (backendRespawnTimer) {
        clearTimeout(backendRespawnTimer);
        backendRespawnTimer = null;
    }
}

function scheduleBackendRespawn(reason) {
    if (backendStopRequested) return;
    if (process.env.CWSP_SKIP_BACKEND === "1") return;
    if (!isNeutralinoHostAlive()) {
        writeDiag("backend-respawn-skip", { reason, why: "nl-host-gone" });
        return;
    }
    const now = Date.now();
    backendCrashTimestamps = backendCrashTimestamps.filter(
        (t) => now - t < BACKEND_CRASH_LOOP_WINDOW_MS
    );
    if (backendCrashTimestamps.length >= BACKEND_CRASH_LOOP_MAX) {
        writeDiag("backend-respawn-skip", {
            reason,
            why: "crash-loop",
            crashes: backendCrashTimestamps.length
        });
        console.error(
            "[extNode] backend crash-loop — not respawning (restart Neutralino)"
        );
        return;
    }
    if (backendRespawnTimer) return;
    writeDiag("backend-respawn-scheduled", { reason, delayMs: BACKEND_RESPAWN_MS });
    backendRespawnTimer = setTimeout(() => {
        backendRespawnTimer = null;
        if (backendStopRequested || backendChild) return;
        if (!isNeutralinoHostAlive()) return;
        console.warn(`[extNode] respawning CWSP backend (${reason})`);
        void ensurePackagedBackend().then((r) => {
            writeDiag("backend-respawn-result", { reason, ...r });
        });
    }, BACKEND_RESPAWN_MS);
}

function startPackagedBackend() {
    if (process.env.CWSP_SKIP_BACKEND === "1") {
        console.log("[extNode] CWSP_SKIP_BACKEND=1 — not spawning backend");
        return null;
    }
    if (backendChild && !backendChild.killed) {
        return backendChild;
    }
    // Host = exe dir (.config, auth, logs). Runtime may be TEMP unpack of .tar.gz.
    const hostRoot = resolveHostRoot();
    const runtime = ensureBackendRuntime(hostRoot);
    if (!runtime) {
        console.warn(
            "[extNode] packaged backend missing (need backend/ or sibling .tar.gz):",
            hostRoot
        );
        writeDiag("backend-missing", { hostRoot });
        return null;
    }
    const { runBackend, runtimeRoot, fromArchive } = runtime;
    const configPath = resolveConfigPath(hostRoot);

    const controlPort =
        Number(process.env.CWSP_CONTROL_PORT || DEFAULT_CONTROL_PORT) ||
        DEFAULT_CONTROL_PORT;
    const controlKey = String(
        process.env.CWSP_CONTROL_KEY || DEFAULT_CONTROL_KEY
    );
    // WHY: auth file stays beside the .exe so WebView can bind while control starts.
    writeControlAuthFile({ port: controlPort, key: controlKey }, hostRoot);

    // INVARIANT: backend watches Neutralino.exe (not cmd.exe from run.cmd).
    // CWSP_PARENT_PID = this extension (informational; backend keeps alive if only we die).
    const parentPid = process.pid;
    const nlPid = resolveNeutralinoHostPid();

    // WHY: prior extNode may have died while backend kept :29110 — adopt, don't EADDRINUSE.
    // Sync probe via deasync-less busy wait is awkward; use spawn path only when probe says down.
    // Callers that need adopt use ensurePackagedBackendAsync; sync path still tries spawn.
    console.log(
        "[extNode] spawning CWSP backend:",
        runBackend,
        fromArchive ? "(from tar.gz→TEMP)" : "(unpacked beside exe)"
    );
    writeDiag("backend-spawn", {
        runBackend,
        hostRoot,
        runtimeRoot,
        configPath,
        fromArchive,
        node: process.execPath,
        controlPort,
        parentPid,
        nlPid
    });
    const child = spawn(process.execPath, [runBackend], {
        cwd: path.dirname(runBackend),
        env: {
            ...process.env,
            // Durable host (exe + .config + resources + auth .tmp)
            CWSP_NL_HOST_ROOT: hostRoot,
            CWSP_ROOT: hostRoot,
            CWSP_NL_PACKAGE_ROOT: hostRoot,
            CWSP_PORTABLE_CONFIG: configPath,
            CWS_PORTABLE_CONFIG_PATH: configPath,
            // Code root when extracted from archive (TEMP)
            CWSP_BACKEND_ROOT: runtimeRoot,
            CWSP_DESKTOP_SHELL: "neutralino",
            CWSP_CONTROL_PORT: String(controlPort),
            CWSP_CONTROL_KEY: controlKey,
            CWSP_PARENT_PID: String(parentPid),
            CWSP_NL_PID: nlPid > 0 ? String(nlPid) : ""
        },
        // WHY: pipe stdout so we can parse the ready JSON even when Neutralino
        // has no console attached (stdio inherit is silent on Windows GUI).
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
        // WHY: detach so extNode process.exit does not tear down Node control/hub.
        // Tray Quit still calls backend.stop → killProcessTree.
        detached: true
    });
    try {
        child.unref();
    } catch (_) {
        /* ignore */
    }
    backendAdopted = false;

    const appendBackendLog = (streamName, chunk) => {
        try {
            const line = chunk.toString("utf8");
            fs.appendFileSync(
                path.join(hostRoot, "backend-out.log"),
                `[${streamName}] ${line}`
            );
            // Parse ready banner: {"shell":"neutralino",...,"controlPort":19875,...}
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
                                hostRoot
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
        writeDiag("backend-exit", {
            code,
            signal,
            stopRequested: backendStopRequested
        });
        if (backendChild === child) backendChild = null;
        if (!backendStopRequested) {
            backendCrashTimestamps.push(Date.now());
            scheduleBackendRespawn(`exit:${code ?? "null"}:${signal || ""}`);
        }
    });
    child.on("error", (error) => {
        console.error("[extNode] backend spawn failed", error);
        writeDiag("backend-spawn-error", { error: String(error) });
        if (backendChild === child) backendChild = null;
        if (!backendStopRequested) {
            backendCrashTimestamps.push(Date.now());
            scheduleBackendRespawn("spawn-error");
        }
    });
    return child;
}

function stopPackagedBackend() {
    backendStopRequested = true;
    clearBackendRespawnTimer();
    backendAdopted = false;
    if (!backendChild) return;
    const pid = backendChild.pid;
    writeDiag("backend-stop", { pid: pid || null });
    try {
        killProcessTree(pid);
    } catch (_) {
        /* ignore */
    }
    try {
        if (!backendChild.killed) backendChild.kill("SIGTERM");
    } catch (_) {
        /* ignore */
    }
    backendChild = null;
}

/**
 * WHY: when Neutralino recycles extNode, do NOT kill a healthy detached backend.
 * Only intentional backend.stop / NL.exe gone should tear the control host down.
 */
function maybeStopBackendOnExtNodeExit(reason) {
    if (backendStopRequested) {
        stopPackagedBackend();
        return;
    }
    if (!isNeutralinoHostAlive()) {
        writeDiag("backend-stop-nl-gone", { reason });
        stopPackagedBackend();
        return;
    }
    writeDiag("backend-keep-on-extnode-exit", {
        reason,
        backendPid: backendChild?.pid ?? null,
        adopted: backendAdopted,
        nlPid: resolveNeutralinoHostPid()
    });
    // Drop handle so GC/exit of extNode does not signal the detached child.
    backendChild = null;
    backendAdopted = true;
}

async function ensurePackagedBackend() {
    backendStopRequested = false;
    clearBackendRespawnTimer();
    if (backendChild && !backendChild.killed) {
        return {
            ok: true,
            running: true,
            pid: backendChild.pid ?? null,
            spawned: false,
            adopted: false
        };
    }
    const controlPort =
        Number(process.env.CWSP_CONTROL_PORT || DEFAULT_CONTROL_PORT) ||
        DEFAULT_CONTROL_PORT;
    const controlKey = String(
        process.env.CWSP_CONTROL_KEY || DEFAULT_CONTROL_KEY
    );
    const alive = await probeControlAlive(controlPort, controlKey);
    if (alive) {
        backendAdopted = true;
        writeControlAuthFile({ port: controlPort, key: controlKey }, resolveHostRoot());
        writeDiag("backend-adopted", { controlPort });
        return {
            ok: true,
            running: true,
            pid: null,
            spawned: false,
            adopted: true
        };
    }
    backendChild = startPackagedBackend();
    return {
        ok: true,
        running: Boolean(backendChild && !backendChild.killed),
        pid: backendChild?.pid ?? null,
        spawned: true,
        adopted: false
    };
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
                controlAuth: controlAuth,
                nlHostAlive: isNeutralinoHostAlive()
            };
        case "backend.ensure":
        case "backend.restart":
            // WHY: WebView/tray can ask for a live control host after an unexpected exit.
            if (fn === "backend.restart") {
                stopPackagedBackend();
                backendStopRequested = false;
            }
            return await ensurePackagedBackend();
        case "backend.stop":
            // WHY: tray Quit dispatches this before Neutralino.app.exit() so
            // run-backend + control host tear down before the extension is killed.
            stopPackagedBackend();
            return { ok: true, stopped: true };
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

process.on("exit", () => {
    maybeStopBackendOnExtNodeExit("process.exit");
});
process.on("SIGINT", () => {
    maybeStopBackendOnExtNodeExit("SIGINT");
    process.exit(0);
});
process.on("SIGTERM", () => {
    maybeStopBackendOnExtNodeExit("SIGTERM");
    process.exit(0);
});
process.on("SIGHUP", () => {
    // WHY: SIGHUP is not a reliable "host quit" signal under Neutralino tray;
    // only tear down when the Neutralino host PID is actually gone.
    writeDiag("extNode-sighup", { nlHostAlive: isNeutralinoHostAlive() });
    maybeStopBackendOnExtNodeExit("SIGHUP");
    if (!isNeutralinoHostAlive()) process.exit(0);
});
process.on("disconnect", () => {
    // WHY: Neutralino may IPC-detach the extension while tray/.exe stays alive
    // (hide-to-tray / WebView recycle). Do NOT kill the backend on disconnect —
    // nl-host watch owns teardown when Neutralino.exe is truly gone.
    writeDiag("extNode-disconnect-keep-alive", {
        backendPid: backendChild?.pid ?? null,
        nlHostAlive: isNeutralinoHostAlive()
    });
    if (!isNeutralinoHostAlive()) {
        maybeStopBackendOnExtNodeExit("disconnect-nl-gone");
        process.exit(0);
    }
});

/**
 * WHY: tray Quit / Neutralino.app.exit() sometimes kills only the .exe and leaves
 * extNode+backend alive. Poll Neutralino.exe by name (not cmd ppid from run.cmd).
 */
function watchNeutralinoHost() {
    const nlPid = resolveNeutralinoHostPid();
    writeDiag("nl-host-watch", { nlPid, ppid: process.ppid || null });
    setInterval(() => {
        if (!isNeutralinoHostAlive()) {
            writeDiag("nl-host-gone", { nlPid: cachedNeutralinoPid || nlPid });
            stopPackagedBackend();
            process.exit(0);
            return;
        }
        // WHY: if backend died while we were IPC-detached, bring it back (or adopt).
        if (!backendStopRequested && (!backendChild || backendChild.killed)) {
            void ensurePackagedBackend().then((r) => {
                if (r?.spawned) {
                    writeDiag("backend-respawned-by-watch", r);
                } else if (r?.adopted) {
                    writeDiag("backend-adopted-by-watch", r);
                }
            });
        }
    }, 2000);
}

console.log("---");
console.log("CWSP Neutralino Node extension");
console.log("NodeJS Version:", process.version);
console.log("NodeJS Path:", process.execPath);
console.log("Package root:", resolvePackageRoot());
console.log("---");
writeDiag("extNode-boot", {
    packageRoot: resolvePackageRoot(),
    nlPid: resolveNeutralinoHostPid()
});

// WHY: start/adopt backend before Neutralino IPC handshake — if IPC/stdin fails,
// settings/protocol host must still come up beside the exe.
void ensurePackagedBackend().then((r) => {
    writeDiag("backend-boot-result", r);
});
watchNeutralinoHost();

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
