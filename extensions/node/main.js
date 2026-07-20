// main.js — CWSP Neutralino Node extension
//
// Bridges Neutralino WebView ↔ Node protocol execution (clipboard / input / settings).
// Based on marketmix neutralino-ext-node; CWSP handlers live in ./cwsp-bridge.js.
//
// Portable backend layout (Windows desk):
//   <exeDir>/cwsp-neutralino-win_x64.exe
//   <exeDir>/cwsp-neutralino-win_x64.tar.gz   ← backend/ archive
//   <exeDir>/.config/                        ← durable settings (not wiped by unpack)
// Unpacks tar.gz → %TEMP%/cwsp-neutralino/backend/ and runs run-backend.mjs from there.
// COMPAT: if <exeDir>/backend/node/run-backend.mjs exists, use it without unpack.
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
const os = require("node:os");
const { spawn, spawnSync } = require("node:child_process");

const bridge = require("./cwsp-bridge");

const DEBUG = process.env.CWSP_NL_DEBUG === "1" || process.env.CWSP_NL_DEBUG === "true";

let backendChild = null;
let ext = null;
/** Cached loopback control auth published by backend / pre-written at spawn. */
let controlAuth = null;
/** True after intentional backend.stop / process shutdown — suppress respawn. */
let backendStopRequested = false;
let backendRespawnTimer = null;
let backendCrashTimestamps = [];

// WHY: Cursor.exe steals :19875/:19876 → UI gets ERR_EMPTY_RESPONSE.
const DEFAULT_CONTROL_PORT = 29110;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";
const BACKEND_RESPAWN_MS = 1500;
const BACKEND_CRASH_LOOP_WINDOW_MS = 60_000;
const BACKEND_CRASH_LOOP_MAX = 6;

/**
 * Neutralino host root — folder with .exe / resources.neu / .config / .tar.gz.
 * INVARIANT: durable state (configs, auth .tmp, logs) stays here — never under TEMP unpack.
 */
function resolveHostRoot() {
    if (process.env.CWSP_NL_HOST_ROOT && fs.existsSync(process.env.CWSP_NL_HOST_ROOT)) {
        return path.resolve(process.env.CWSP_NL_HOST_ROOT);
    }
    if (process.env.NL_PATH && fs.existsSync(process.env.NL_PATH)) {
        return path.resolve(process.env.NL_PATH);
    }
    // extensions/node → package root
    return path.resolve(__dirname, "..", "..");
}

/** @deprecated alias — host root (exe dir), not TEMP backend unpack. */
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

/** Sibling archive next to the .exe (preferred name = exe basename + .tar.gz). */
function findBackendArchive(hostRoot) {
    try {
        const entries = fs.readdirSync(hostRoot);
        const exes = entries.filter((n) => /\.exe$/i.test(n));
        for (const exe of exes) {
            const named = path.join(hostRoot, exe.replace(/\.exe$/i, ".tar.gz"));
            if (fs.existsSync(named)) return named;
        }
        const preferred = entries
            .filter((n) => /cwsp-neutralino.*\.tar\.gz$/i.test(n) || /neutralino.*\.tar\.gz$/i.test(n))
            .sort();
        if (preferred.length) return path.join(hostRoot, preferred[0]);
        const any = entries.filter((n) => /\.tar\.gz$/i.test(n)).sort();
        if (any.length) return path.join(hostRoot, any[0]);
    } catch (_) {
        /* ignore */
    }
    return null;
}

function backendStampFor(archivePath) {
    try {
        const st = fs.statSync(archivePath);
        return `${path.basename(archivePath)}:${st.size}:${Math.floor(st.mtimeMs)}`;
    } catch (_) {
        return path.basename(archivePath || "none");
    }
}

/**
 * Ensure backend/node is available — prefer sibling .tar.gz unpacked under TEMP.
 * COMPAT: unpacked <host>/backend/node still wins when present (dev / old deploys).
 *
 * @returns {{ runtimeRoot: string, runBackend: string, fromArchive: boolean } | null}
 */
function ensureBackendRuntime(hostRoot) {
    const localRun = path.join(hostRoot, "backend", "node", "run-backend.mjs");
    if (fs.existsSync(localRun) && process.env.CWSP_FORCE_BACKEND_ARCHIVE !== "1") {
        return {
            runtimeRoot: hostRoot,
            runBackend: localRun,
            fromArchive: false
        };
    }

    const archive = findBackendArchive(hostRoot);
    if (!archive) {
        return null;
    }

    const runtimeRoot = path.join(os.tmpdir(), "cwsp-neutralino", "backend");
    const runBackend = path.join(runtimeRoot, "backend", "node", "run-backend.mjs");
    const stampPath = path.join(runtimeRoot, ".cwsp-backend-stamp");
    const stamp = backendStampFor(archive);

    let needExtract = true;
    try {
        if (fs.existsSync(runBackend) && fs.existsSync(stampPath)) {
            const prev = fs.readFileSync(stampPath, "utf8").trim();
            if (prev === stamp) needExtract = false;
        }
    } catch (_) {
        needExtract = true;
    }

    if (needExtract) {
        try {
            fs.rmSync(runtimeRoot, { recursive: true, force: true });
        } catch (_) {
            /* ignore */
        }
        fs.mkdirSync(runtimeRoot, { recursive: true });
        // Windows 10+ ships bsdtar as tar.exe; Linux build hosts use GNU tar.
        const extracted = spawnSync("tar", ["-xzf", archive, "-C", runtimeRoot], {
            encoding: "utf8",
            windowsHide: true
        });
        if (extracted.status !== 0) {
            writeDiag("backend-extract-failed", {
                archive,
                runtimeRoot,
                status: extracted.status,
                stderr: String(extracted.stderr || "").slice(0, 500)
            });
            return null;
        }
        try {
            fs.writeFileSync(stampPath, stamp + "\n", "utf8");
        } catch (_) {
            /* ignore */
        }
        writeDiag("backend-extracted", { archive, runtimeRoot, stamp });
    }

    if (!fs.existsSync(runBackend)) {
        writeDiag("backend-extract-missing-entry", { runBackend, archive });
        return null;
    }
    return { runtimeRoot, runBackend, fromArchive: true };
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

function isNeutralinoHostAlive() {
    const nlPid = Number(process.ppid || 0);
    if (!nlPid || nlPid <= 0) return false;
    if (process.platform === "win32") {
        try {
            const out = spawnSync(
                "tasklist",
                ["/FI", `PID eq ${nlPid}`, "/NH"],
                { encoding: "utf8", windowsHide: true }
            );
            return String(out.stdout || "").includes(String(nlPid));
        } catch (_) {
            return true; // transient — assume alive
        }
    }
    try {
        process.kill(nlPid, 0);
        return true;
    } catch (_) {
        return false;
    }
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
        backendChild = startPackagedBackend();
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

    // INVARIANT: backend exits when Neutralino host dies (CWSP_NL_PID).
    // CWSP_PARENT_PID = this extension (informational; backend keeps alive if only we die).
    const parentPid = process.pid;
    const nlPid = Number(process.ppid || 0) || 0;

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
        detached: false
    });

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

function ensurePackagedBackend() {
    backendStopRequested = false;
    clearBackendRespawnTimer();
    if (backendChild && !backendChild.killed) {
        return {
            ok: true,
            running: true,
            pid: backendChild.pid ?? null,
            spawned: false
        };
    }
    backendChild = startPackagedBackend();
    return {
        ok: true,
        running: Boolean(backendChild && !backendChild.killed),
        pid: backendChild?.pid ?? null,
        spawned: true
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
            return ensurePackagedBackend();
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

process.on("exit", stopPackagedBackend);
process.on("SIGINT", () => {
    stopPackagedBackend();
    process.exit(0);
});
process.on("SIGTERM", () => {
    stopPackagedBackend();
    process.exit(0);
});
process.on("SIGHUP", () => {
    // WHY: SIGHUP is not a reliable "host quit" signal under Neutralino tray;
    // only tear down when the Neutralino host PID is actually gone.
    writeDiag("extNode-sighup", { nlHostAlive: isNeutralinoHostAlive() });
    if (!isNeutralinoHostAlive()) {
        stopPackagedBackend();
        process.exit(0);
    }
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
        stopPackagedBackend();
        process.exit(0);
    }
});

/**
 * WHY: tray Quit / Neutralino.app.exit() sometimes kills only the .exe and leaves
 * extNode+backend alive. Poll the Neutralino host PID (our ppid at boot).
 */
function watchNeutralinoHost() {
    const nlPid = Number(process.ppid || 0);
    if (!nlPid || nlPid <= 0) return;
    writeDiag("nl-host-watch", { nlPid });
    setInterval(() => {
        if (!isNeutralinoHostAlive()) {
            writeDiag("nl-host-gone", { nlPid });
            stopPackagedBackend();
            process.exit(0);
            return;
        }
        // WHY: if backend died while we were IPC-detached, bring it back.
        if (!backendStopRequested && (!backendChild || backendChild.killed)) {
            scheduleBackendRespawn("nl-host-watch-missing-backend");
        }
    }, 2000);
}

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
