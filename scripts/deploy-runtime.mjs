/*
 * Filename: deploy-runtime.mjs
 * FullPath: apps/CWSP-reborn/scripts/deploy-runtime.mjs
 * Change date and time: 00.10.00_21.07.2026
 * Reason for changes: Stage Neutralino archive-only packages (.tar.gz + .config); do not lstat missing backend/.
 *
 * Usage:
 *   node scripts/deploy-runtime.mjs --target 110|200 --runtime node|java|neutralino [--dry-run]
 *   node scripts/deploy-runtime.mjs --target 110 --runtime neutralino --rebuild
 *
 * Destinations (override via env):
 *   .110 node       → C:/U2RE/cwsp-node
 *   .110 java       → C:/U2RE/cwsp-java
 *   .110 neutralino → C:/U2RE/cwsp-neutralino  (rsync uses /c/U2RE/cwsp-neutralino)
 *   .200 node       → /home/u2re-dev/cwsp-node
 *   .200 java       → /home/u2re-dev/cwsp-java
 *   .200 neutralino → /home/u2re-dev/cwsp-neutralino
 *
 * SECURITY: no tokens in this file; SSH auth uses the operator's agent/keys.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    APP_ROOT,
    javaMainForPlatform,
    targetSpec,
    toMsysRsyncPath,
    toWindowsSlashPath,
    isWindowsStylePath,
    normalizeSlashPath
} from "./lib/runtime-env.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function printHelp() {
    console.log(`CWSP-reborn deploy-runtime

Options:
  --target <110|200>                              (required)
  --runtime <node|java|neutralino|windows>        (required; windows ≡ neutralino)
  --dry-run                                       print actions only
  --rebuild                                       force Neutralino rebuild before deploy
  --skip-build                                    never rebuild Neutralino (fail if missing)
  --help

Env overrides:
  CWSP_DEPLOY_110_HOST / USER / DIR_NODE / DIR_JAVA / DIR_NEUTRALINO
  CWSP_DEPLOY_200_HOST / USER / DIR_NODE / DIR_JAVA / DIR_NEUTRALINO
`);
}

function parseArgs(argv) {
    const out = {
        target: null,
        runtime: null,
        dryRun: false,
        rebuild: false,
        skipBuild: false,
        help: false
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--help" || a === "-h") out.help = true;
        else if (a === "--dry-run") out.dryRun = true;
        else if (a === "--rebuild") out.rebuild = true;
        else if (a === "--skip-build") out.skipBuild = true;
        else if (a === "--target") out.target = argv[++i];
        else if (a === "--runtime") out.runtime = argv[++i];
        else if (a.startsWith("--target=")) out.target = a.slice("--target=".length);
        else if (a.startsWith("--runtime=")) out.runtime = a.slice("--runtime=".length);
    }
    if (out.runtime === "windows") out.runtime = "neutralino";
    return out;
}

function rimraf(dir) {
    fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(src, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
}

function copyTree(src, dest, { filter, keepNodeModules = false } = {}) {
    if (!fs.existsSync(src)) return;
    const st = fs.statSync(src);
    if (st.isFile()) {
        if (filter && !filter(src)) return;
        copyFile(src, dest);
        return;
    }
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
        if (name === ".git" || name === "build" || name === "dist") continue;
        if (name === "node_modules" && !keepNodeModules) continue;
        copyTree(path.join(src, name), path.join(dest, name), {
            filter,
            keepNodeModules
        });
    }
}

function writeText(file, text) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
}

function stageNode(stageRoot) {
    rimraf(stageRoot);
    fs.mkdirSync(stageRoot, { recursive: true });
    copyTree(path.join(APP_ROOT, "src/backend/node"), path.join(stageRoot, "src/backend/node"));
    copyFile(
        path.join(APP_ROOT, "scripts/resolve-aliases.mjs"),
        path.join(stageRoot, "scripts/resolve-aliases.mjs")
    );
    writeText(
        path.join(stageRoot, "package.json"),
        JSON.stringify(
            {
                name: "cwsp-reborn-node-portable",
                private: true,
                type: "module",
                scripts: {
                    start: "node --import ./scripts/resolve-aliases.mjs --experimental-strip-types src/backend/node/linux/index.ts",
                    "start:windows": "node --import ./scripts/resolve-aliases.mjs --experimental-strip-types src/backend/node/windows/index.ts"
                }
            },
            null,
            4
        ) + "\n"
    );
    writeText(
        path.join(stageRoot, "README.md"),
        `# cwsp-node portable

Staged from CWSP-reborn. Start:

\`\`\`bash
npm start          # linux entry
npm run start:windows
\`\`\`

**WARNING (.200 / gateway):** do **not** PM2-start this as a clipboard peer.
The linux entry defaults to Neutralino desk identity \`L-110\` + clipboard-hub;
that reconnects without a desk token and floods gateway \`/ws\` (4001), breaking Capacitor.
Gateway realtime stays \`pm2\` app \`cwsp\` (legacy endpoint). Desk clipboard = Neutralino on \`.110\`.
Set \`CWSP_CLIPBOARD_HUB=0\` if you must run this process on a server host.
`
    );
    if (fs.existsSync(path.join(APP_ROOT, "build/webnative"))) {
        copyTree(path.join(APP_ROOT, "build/webnative"), path.join(stageRoot, "build/webnative"));
    }
}

function stageJava(stageRoot, platform) {
    rimraf(stageRoot);
    fs.mkdirSync(stageRoot, { recursive: true });
    const classes = path.join(stageRoot, "classes");
    fs.mkdirSync(classes, { recursive: true });

    const shared = path.join(APP_ROOT, "src/backend/java/shared/space");
    const plat = path.join(APP_ROOT, `src/backend/java/${platform}/space`);
    const sources = [];
    for (const root of [shared, plat]) {
        if (!fs.existsSync(root)) continue;
        const walk = (dir) => {
            for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
                const p = path.join(dir, ent.name);
                if (ent.isDirectory()) walk(p);
                else if (ent.name.endsWith(".java")) sources.push(p);
            }
        };
        walk(root);
    }
    if (sources.length === 0) {
        throw new Error(`no Java sources for platform=${platform}`);
    }
    console.log(`[deploy:java] javac ${sources.length} files`);
    const r = spawnSync("javac", ["--release", "17", "-d", classes, ...sources], {
        cwd: APP_ROOT,
        stdio: "inherit"
    });
    if (r.status !== 0) {
        throw new Error("javac failed while staging java deploy");
    }
    const main = javaMainForPlatform(platform);
    writeText(
        path.join(stageRoot, "run.sh"),
        `#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
exec java -cp ./classes ${main}
`
    );
    writeText(
        path.join(stageRoot, "run.cmd"),
        `@echo off
cd /d "%~dp0"
java -cp .\\classes ${main}
`
    );
    try {
        fs.chmodSync(path.join(stageRoot, "run.sh"), 0o755);
    } catch {
        /* Windows may ignore chmod */
    }
    writeText(
        path.join(stageRoot, "README.md"),
        `# cwsp-java portable

Staged from CWSP-reborn (${platform}).

\`\`\`bash
./run.sh
# or
run.cmd
\`\`\`
`
    );
}

/** True when dir looks like a Neutralino portable package. */
function isNeutralinoPackage(dir) {
    if (!fs.existsSync(dir)) return false;
    if (fs.existsSync(path.join(dir, "resources.neu"))) return true;
    try {
        return fs
            .readdirSync(dir)
            .some(
                (n) =>
                    /cwsp-neutralino/i.test(n) ||
                    /\.exe$/i.test(n) ||
                    /_linux_x64$/i.test(n)
            );
    } catch {
        return false;
    }
}

/**
 * Prefer slim platform package (exe + backend), then local deploy mirror, then full neu out.
 */
function resolveNeutralinoPackageSource(platform) {
    const candidates = [
        path.join(APP_ROOT, "build", "neutralino", platform),
        path.join(APP_ROOT, "build", "deploy", `local-${platform}-neutralino`),
        path.join(APP_ROOT, "build", "neutralino", "app"),
        path.join(APP_ROOT, "build", "cwsp-neutralino")
    ];
    for (const dir of candidates) {
        if (isNeutralinoPackage(dir)) return dir;
    }
    return null;
}

function runNeutralinoBuild(platform, { skipWeb = false } = {}) {
    const script = path.join(HERE, "build-neutralino.mjs");
    const webOut = path.join(APP_ROOT, "build", "neutralino", "web");
    const args = [script, "--platform", platform];
    // WHY: --rebuild must re-run Vite; only skip-web when reusing an existing web tree.
    if (skipWeb && fs.existsSync(webOut)) {
        args.push("--skip-web");
    }
    console.log(`[deploy:neutralino] $ node ${args.join(" ")}`);
    const r = spawnSync(process.execPath, args, {
        cwd: APP_ROOT,
        stdio: "inherit"
    });
    if (r.status !== 0) {
        throw new Error("Neutralino build failed (see build-neutralino.mjs output)");
    }
}

function ensureNeutralinoPackage(platform, { rebuild, skipBuild }) {
    if (rebuild) {
        if (skipBuild) {
            throw new Error("--rebuild and --skip-build cannot be combined");
        }
        // INVARIANT: rebuild always refreshes Vite → resources → resources.neu.
        runNeutralinoBuild(platform, { skipWeb: false });
    }
    let src = resolveNeutralinoPackageSource(platform);
    if (src) return src;
    if (skipBuild) {
        throw new Error(
            `Neutralino package missing for ${platform}. Run: npm run build:neutralino:${platform}`
        );
    }
    console.log(`[deploy:neutralino] no package found — building (${platform})`);
    runNeutralinoBuild(platform);
    src = resolveNeutralinoPackageSource(platform);
    if (!src) {
        throw new Error(
            `Neutralino package still missing after build (${platform})`
        );
    }
    return src;
}

/** True when stage has either unpacked backend or portable sibling .tar.gz. */
function hasNeutralinoBackendArtifact(root) {
    if (fs.existsSync(path.join(root, "backend", "node", "run-backend.mjs"))) {
        return true;
    }
    try {
        return fs.readdirSync(root).some((n) => /\.tar\.gz$/i.test(n));
    } catch {
        return false;
    }
}

/**
 * Copy portable backend artifacts (prefer .tar.gz + .config; COMPAT unpacked backend/).
 */
function syncNeutralinoBackendArtifacts(fromRoot, toRoot) {
    if (!fromRoot || !fs.existsSync(fromRoot)) return;
    // Sibling archives (cwsp-neutralino-win_x64.tar.gz, …)
    for (const name of fs.readdirSync(fromRoot)) {
        if (!/\.tar\.gz$/i.test(name)) continue;
        fs.cpSync(path.join(fromRoot, name), path.join(toRoot, name));
    }
    const configSrc = path.join(fromRoot, ".config");
    if (fs.existsSync(configSrc)) {
        fs.cpSync(configSrc, path.join(toRoot, ".config"), { recursive: true });
    }
    const backendSrc = path.join(fromRoot, "backend");
    const runBackend = path.join(backendSrc, "node", "run-backend.mjs");
    if (fs.existsSync(runBackend)) {
        fs.cpSync(backendSrc, path.join(toRoot, "backend"), {
            recursive: true,
            filter: (from) => !from.split(path.sep).includes("node_modules")
        });
    }
    // Keep extNode spawn wiring fresh after --backend-only.
    const extMain = path.join(fromRoot, "extensions", "node", "main.js");
    const extDest = path.join(toRoot, "extensions", "node");
    if (fs.existsSync(extMain) && fs.existsSync(extDest)) {
        for (const name of ["main.js", "run.cmd", "cwsp-bridge.js"]) {
            const srcFile = path.join(fromRoot, "extensions", "node", name);
            if (fs.existsSync(srcFile)) {
                fs.cpSync(srcFile, path.join(extDest, name));
            }
        }
    }
}

/**
 * Stage Neutralino portable tree for deploy.
 * Layout: exe + sibling .tar.gz (Node backend) + .config/ (durable settings).
 * COMPAT: unpacked backend/ still accepted when present.
 */
function stageNeutralino(stageRoot, platform, opts) {
    const src = ensureNeutralinoPackage(platform, opts);
    console.log(`[deploy:neutralino] package source → ${src}`);
    rimraf(stageRoot);
    fs.mkdirSync(path.dirname(stageRoot), { recursive: true });
    fs.cpSync(src, stageRoot, {
        recursive: true,
        filter: (from) => {
            // Skip bulky/fragile node_modules inside unpacked backend only.
            const parts = from.split(path.sep);
            if (parts.includes("node_modules") && parts.includes("backend")) {
                return false;
            }
            return true;
        }
    });

    // Ensure portable backend artifact (tar.gz preferred; unpacked COMPAT).
    if (!hasNeutralinoBackendArtifact(stageRoot)) {
        console.log(
            "[deploy:neutralino] backend artifact missing — refreshing via --backend-only"
        );
        const r = spawnSync(
            process.execPath,
            [
                path.join(HERE, "build-neutralino.mjs"),
                "--backend-only",
                "--platform",
                platform
            ],
            { cwd: APP_ROOT, stdio: "inherit" }
        );
        if (r.status !== 0) {
            throw new Error("backend-only packaging failed");
        }
        const refreshed = resolveNeutralinoPackageSource(platform);
        if (refreshed && path.resolve(refreshed) !== path.resolve(stageRoot)) {
            syncNeutralinoBackendArtifacts(refreshed, stageRoot);
        }
        if (!hasNeutralinoBackendArtifact(stageRoot)) {
            throw new Error(
                `Neutralino backend missing after refresh (need .tar.gz or backend/node under ${stageRoot})`
            );
        }
    }

    // Keep a tiny extNode ws vendor if present (required for Neutralino IPC).
    const extWs = path.join(stageRoot, "extensions", "node", "node_modules", "ws");
    if (!fs.existsSync(extWs)) {
        const srcWs = path.join(src, "extensions", "node", "node_modules", "ws");
        if (fs.existsSync(srcWs)) {
            fs.cpSync(srcWs, extWs, { recursive: true, dereference: true });
        }
    }

    if (!fs.existsSync(path.join(stageRoot, "README.md"))) {
        writeText(
            path.join(stageRoot, "README.md"),
            `# CWSP Neutralino (${platform})

Deployed portable package. Run \`run.cmd\` / \`run.sh\` or the Neutralino binary.
Layout: \`.exe\` + sibling \`.tar.gz\` (Node backend) + \`.config/\` (durable settings).
extNode unpacks the archive under \`%TEMP%\` and starts Node from there.
`
        );
    }
}

function remoteInstallNeutralinoDeps({ user, host, dir, dryRun }) {
    const sshTarget = `${user}@${host}`;
    const winDir = toWindowsSlashPath(dir);
    const backend = `${winDir}/backend/node`.replace(/\//g, "\\");
    // WHY: portable packages ship deps inside .tar.gz — no on-desk backend/node tree.
    const probe = spawnSync(
        "ssh",
        [sshTarget, `if exist "${backend}\\run-backend.mjs" (exit 0) else (exit 1)`],
        { encoding: "utf8" }
    );
    if (probe.status !== 0) {
        console.log(
            `[deploy:neutralino] skip remote npm install — no unpacked backend/node (archive-only)`
        );
        return;
    }
    const cmd = `cd /d "${backend}" && npm install --omit=dev --no-fund --no-audit --no-package-lock`;
    console.log(`[deploy:neutralino] ssh ${sshTarget} npm install (backend/node)`);
    if (dryRun) return;
    const r = spawnSync("ssh", [sshTarget, cmd], { stdio: "inherit" });
    if (r.status !== 0) {
        throw new Error("remote npm install failed for backend/node");
    }
}

function hasCmd(cmd) {
    const r = spawnSync(cmd, ["--version"], { stdio: "ignore" });
    return r.status === 0 || r.status === 1;
}

/**
 * Ensure remote deploy directory exists.
 * Windows OpenSSH may be PowerShell (prefer New-Item) or MSYS bash (mkdir -p /c/...).
 */
function ensureRemoteDir({ user, host, dir, windowsRemote, dryRun }) {
    const sshTarget = `${user}@${host}`;
    const winPath = toWindowsSlashPath(dir);
    const msysPath = toMsysRsyncPath(dir);

    if (!windowsRemote && !isWindowsStylePath(dir)) {
        const cmd = `mkdir -p "${normalizeSlashPath(dir)}"`;
        console.log(`[deploy] ssh ${sshTarget} ${cmd}`);
        if (dryRun) return;
        const mk = spawnSync("ssh", [sshTarget, cmd], { stdio: "inherit" });
        if (mk.status !== 0) {
            console.warn("[deploy] remote mkdir failed (continuing)");
        }
        return;
    }

    // Try PowerShell first (default OpenSSH shell on many Windows desks), then MSYS mkdir.
    const ps = `powershell -NoProfile -Command "New-Item -ItemType Directory -Force -Path '${winPath.replace(/'/g, "''")}' | Out-Null"`;
    const bash = `mkdir -p '${msysPath.replace(/'/g, `'\\''`)}'`;
    const cmd = `${ps} 2>nul || ${bash}`;
    console.log(`[deploy] ssh ${sshTarget} ensure-dir ${winPath} (msys ${msysPath})`);
    if (dryRun) return;
    const mk = spawnSync("ssh", [sshTarget, cmd], { stdio: "inherit" });
    if (mk.status !== 0) {
        console.warn("[deploy] remote mkdir failed (continuing; rsync --mkpath may help)");
    }
}

function remoteSync({ user, host, dir, stageRoot, dryRun, windowsRemote = false }) {
    const useWindowsPaths = windowsRemote || isWindowsStylePath(dir);
    // WHY: MSYS2 rsync on .110 treats C:/foo as relative → /c/Users/U2RE/C:/foo.
    const rsyncDir = useWindowsPaths ? toMsysRsyncPath(dir) : normalizeSlashPath(dir);
    const scpDir = useWindowsPaths ? toWindowsSlashPath(dir) : normalizeSlashPath(dir);
    const sshTarget = `${user}@${host}`;

    // Avoid rsync --delete failing on busy neutralinojs.log / locked exe.
    // WHY: killing only the .exe leaves orphan extNode/main.js + dual backends holding
    // 18764/18765 — Neutralino UI HTTP then accepts TCP but never answers → blank WebView,
    // zero console logs (document never loads). Wipe the whole package process tree first.
    if (useWindowsPaths && !dryRun) {
        console.log(`[deploy] ssh ${sshTarget} stop cwsp-neutralino + orphan node/extNode`);
        // WHY: UTF-16LE EncodedCommand avoids nested quote breakage over ssh.
        const stopPs = [
            "$ErrorActionPreference='SilentlyContinue'",
            "taskkill /F /IM cwsp-neutralino-win_x64.exe /T 2>$null | Out-Null",
            "Get-CimInstance Win32_Process | Where-Object {",
            "  $_.Name -in @('node.exe','cmd.exe') -and $_.CommandLine -and ($_.CommandLine -match 'cwsp-neutralino')",
            "} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }",
            "Start-Sleep -Milliseconds 800",
            "Remove-Item -Force 'C:\\U2RE\\cwsp-neutralino\\neutralinojs.log' -ErrorAction SilentlyContinue"
        ].join("; ");
        const encoded = Buffer.from(stopPs, "utf16le").toString("base64");
        spawnSync(
            "ssh",
            [sshTarget, `powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}`],
            { stdio: "inherit" }
        );
    }

    ensureRemoteDir({ user, host, dir, windowsRemote: useWindowsPaths, dryRun });

    if (hasCmd("rsync")) {
        const remote = `${user}@${host}:${rsyncDir}`;
        // --mkpath: create destination dirs (rsync ≥ 3.2.3); harmless if unsupported? older rsync errors — probe.
        const baseArgs = useWindowsPaths
            ? ["-azL", "--delete"] // -L: materialize symlinks (nested npm .bin breaks MSYS rsync)
            : ["-az", "--delete"];
        const probe = spawnSync("rsync", ["--help"], { encoding: "utf8" });
        const help = `${probe.stdout || ""}${probe.stderr || ""}`;
        if (/\n\s*--mkpath\b/.test(help) || /--mkpath/.test(help)) {
            baseArgs.push("--mkpath");
        }
        // WHY: desk keeps operator tokens + hub auth; --delete must not wipe them.
        if (useWindowsPaths) {
            // WHY: --exclude alone is not enough on some MSYS rsync builds; Protect (P)
            // keeps operator tokens / auth / window state across --delete deploys.
            baseArgs.push(
                "--exclude",
                "portable.config.json",
                "--exclude",
                "backend/node/portable.config.json",
                "--exclude",
                ".config/",
                "--exclude",
                ".config/***",
                "--exclude",
                ".tmp/",
                "--exclude",
                "backend/node/.tmp/",
                "--exclude",
                "neutralinojs.log",
                "--filter",
                "P portable.config.json",
                "--filter",
                "P backend/node/portable.config.json",
                "--filter",
                "P .config/",
                "--filter",
                "P .config/***",
                "--filter",
                "P .tmp/",
                "--filter",
                "P backend/node/.tmp/",
                "--filter",
                "P **/window_state.config.json"
            );
        }
        const args = [...baseArgs, `${stageRoot}/`, `${remote}/`];
        console.log(`[deploy] rsync ${args.join(" ")}`);
        if (dryRun) return;
        const r = spawnSync("rsync", args, { stdio: "inherit" });
        // MSYS rsync may still warn on odd links; treat only hard failures as fatal.
        if (r.status !== 0 && r.status !== 23) throw new Error("rsync failed");
        if (r.status === 23) {
            console.warn(
                "[deploy] rsync completed with partial transfer warnings (code 23)"
            );
        }
        return;
    }

    const remote = `${user}@${host}:${scpDir}`;
    console.log(`[deploy] scp -r ${stageRoot}/. ${remote}/`);
    if (dryRun) return;
    const r = spawnSync("scp", ["-r", `${stageRoot}/.`, remote], {
        stdio: "inherit"
    });
    if (r.status !== 0) throw new Error("scp failed");
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.target || !args.runtime) {
        printHelp();
        process.exit(args.help ? 0 : 1);
    }
    if (!["110", "200"].includes(args.target)) {
        console.error("--target must be 110 or 200");
        process.exit(1);
    }
    if (!["node", "java", "neutralino"].includes(args.runtime)) {
        console.error("--runtime must be node, java, or neutralino");
        process.exit(1);
    }

    const spec = targetSpec(args.target, args.runtime);
    const stageRoot = path.join(
        APP_ROOT,
        "build",
        "deploy",
        `${args.target}-${args.runtime}`
    );
    // WHY: .110 is Windows desk; .200 is Linux gateway — stage for the *target*, not the build host.
    const platform =
        args.target === "110" ? "windows" : "linux";

    console.log(`[deploy] staging ${args.runtime} (${platform}) → ${stageRoot}`);
    if (args.runtime === "node") {
        stageNode(stageRoot);
    } else if (args.runtime === "java") {
        stageJava(stageRoot, platform);
    } else {
        stageNeutralino(stageRoot, platform, {
            rebuild: args.rebuild,
            skipBuild: args.skipBuild
        });
    }

    console.log(`[deploy] ${spec.label} → ${spec.user}@${spec.host}:${spec.dir}`);
    remoteSync({
        user: spec.user,
        host: spec.host,
        dir: spec.dir,
        stageRoot,
        dryRun: args.dryRun,
        windowsRemote: Boolean(spec.windowsRemote)
    });
    if (args.runtime === "neutralino") {
        remoteInstallNeutralinoDeps({
            user: spec.user,
            host: spec.host,
            dir: spec.dir,
            dryRun: args.dryRun
        });
    }
    console.log(`[deploy] OK ${spec.label}`);
}

try {
    main();
} catch (err) {
    console.error("[deploy-runtime]", err?.message || err);
    process.exit(1);
}
