/*
 * Filename: deploy-runtime.mjs
 * FullPath: apps/CWSP-reborn/scripts/deploy-runtime.mjs
 * Change date and time: 16.52.00_11.07.2026
 * Reason for changes: Stage + rsync Neutralino portable package to .110 / .200
 *   (exe + resources.neu + extensions + backend/node), beside node/java paths.
 *
 * Usage:
 *   node scripts/deploy-runtime.mjs --target 110|200 --runtime node|java|neutralino [--dry-run]
 *   node scripts/deploy-runtime.mjs --target 110 --runtime neutralino --rebuild
 *
 * Destinations (override via env):
 *   .110 node       → C:/U2RE/cwsp-node
 *   .110 java       → C:/U2RE/cwsp-java
 *   .110 neutralino → C:/U2RE/cwsp-neutralino
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
    targetSpec
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

function runNeutralinoBuild(platform) {
    const script = path.join(HERE, "build-neutralino.mjs");
    const webOut = path.join(APP_ROOT, "build", "neutralino", "web");
    const args = [script, "--platform", platform];
    if (fs.existsSync(webOut)) {
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
        runNeutralinoBuild(platform);
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

/**
 * Stage Neutralino portable tree for deploy.
 * WHY: keep backend/node/node_modules (vendored clipboardy/ws) — unlike node/java staging.
 */
function stageNeutralino(stageRoot, platform, opts) {
    const src = ensureNeutralinoPackage(platform, opts);
    console.log(`[deploy:neutralino] package source → ${src}`);
    rimraf(stageRoot);
    fs.mkdirSync(path.dirname(stageRoot), { recursive: true });
    // Full recursive copy including vendored node_modules under backend/.
    fs.cpSync(src, stageRoot, { recursive: true });

    // Ensure backend present (older packages / slim copies).
    const runBackend = path.join(stageRoot, "backend", "node", "run-backend.mjs");
    if (!fs.existsSync(runBackend)) {
        console.log(
            "[deploy:neutralino] backend missing in package — refreshing via --backend-only"
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
        // Re-copy from refreshed platform dir if stage was a different path.
        const refreshed = resolveNeutralinoPackageSource(platform);
        if (refreshed && path.resolve(refreshed) !== path.resolve(stageRoot)) {
            fs.cpSync(
                path.join(refreshed, "backend"),
                path.join(stageRoot, "backend"),
                { recursive: true }
            );
        }
    }

    if (!fs.existsSync(path.join(stageRoot, "README.md"))) {
        writeText(
            path.join(stageRoot, "README.md"),
            `# CWSP Neutralino (${platform})

Deployed portable package. Run \`run.cmd\` / \`run.sh\` or the Neutralino binary.
extNode auto-starts \`backend/node/run-backend.mjs\`.
`
        );
    }
}

function hasCmd(cmd) {
    const r = spawnSync(cmd, ["--version"], { stdio: "ignore" });
    return r.status === 0 || r.status === 1;
}

function remoteSync({ user, host, dir, stageRoot, dryRun }) {
    const normalizedDir = String(dir).replace(/\\/g, "/");
    const remote = `${user}@${host}:${normalizedDir}`;
    const sshTarget = `${user}@${host}`;

    // Ensure remote dir exists (OpenSSH on Windows accepts mkdir -p for this path form).
    console.log(`[deploy] ssh ${sshTarget} mkdir -p ${normalizedDir}`);
    if (!dryRun) {
        const mk = spawnSync(
            "ssh",
            [sshTarget, `mkdir -p "${normalizedDir}"`],
            { stdio: "inherit" }
        );
        if (mk.status !== 0) {
            console.warn("[deploy] remote mkdir failed (continuing)");
        }
    }

    if (hasCmd("rsync")) {
        const args = ["-az", "--delete", `${stageRoot}/`, `${remote}/`];
        console.log(`[deploy] rsync ${args.join(" ")}`);
        if (dryRun) return;
        const r = spawnSync("rsync", args, { stdio: "inherit" });
        if (r.status !== 0) throw new Error("rsync failed");
        return;
    }
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
        dryRun: args.dryRun
    });
    console.log(`[deploy] OK ${spec.label}`);
}

try {
    main();
} catch (err) {
    console.error("[deploy-runtime]", err?.message || err);
    process.exit(1);
}
