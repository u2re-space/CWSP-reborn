/*
 * Filename: deploy-runtime.mjs
 * FullPath: apps/CWSP-reborn/scripts/deploy-runtime.mjs
 * Change date and time: 18.00.00_10.07.2026
 * Reason for changes: Stage + rsync/scp Node or Java portable trees to .110 / .200.
 *
 * Usage:
 *   node scripts/deploy-runtime.mjs --target 110|200 --runtime node|java [--dry-run]
 *
 * Destinations (override via env):
 *   .110 node → C:/U2RE/cwsp-node
 *   .110 java → C:/U2RE/cwsp-java
 *   .200 node → /home/u2re-dev/cwsp-node
 *   .200 java → /home/u2re-dev/cwsp-java
 *
 * SECURITY: no tokens in this file; SSH auth uses the operator's agent/keys.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
    APP_ROOT,
    javaMainForPlatform,
    targetSpec
} from "./lib/runtime-env.mjs";

function printHelp() {
    console.log(`CWSP-reborn deploy-runtime

Options:
  --target <110|200>           (required)
  --runtime <node|java>        (required)
  --dry-run                    print actions only
  --help

Env overrides:
  CWSP_DEPLOY_110_HOST / USER / DIR_NODE / DIR_JAVA
  CWSP_DEPLOY_200_HOST / USER / DIR_NODE / DIR_JAVA
`);
}

function parseArgs(argv) {
    const out = { target: null, runtime: null, dryRun: false, help: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--help" || a === "-h") out.help = true;
        else if (a === "--dry-run") out.dryRun = true;
        else if (a === "--target") out.target = argv[++i];
        else if (a === "--runtime") out.runtime = argv[++i];
        else if (a.startsWith("--target=")) out.target = a.slice("--target=".length);
        else if (a.startsWith("--runtime=")) out.runtime = a.slice("--runtime=".length);
    }
    return out;
}

function rimraf(dir) {
    fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(src, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
}

function copyTree(src, dest, { filter } = {}) {
    if (!fs.existsSync(src)) return;
    const st = fs.statSync(src);
    if (st.isFile()) {
        if (filter && !filter(src)) return;
        copyFile(src, dest);
        return;
    }
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
        if (name === "node_modules" || name === ".git" || name === "build") continue;
        copyTree(path.join(src, name), path.join(dest, name), { filter });
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
    // Minimal package for remote npm/node runs.
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

function hasCmd(cmd) {
    const r = spawnSync(cmd, ["--version"], { stdio: "ignore" });
    return r.status === 0 || r.status === 1; // some tools exit 1 on --version
}

function remoteSync({ user, host, dir, stageRoot, dryRun }) {
    const remote = `${user}@${host}:${dir.replace(/\\/g, "/")}`;
    // Prefer rsync; fall back to scp -r.
    if (hasCmd("rsync")) {
        const args = [
            "-az",
            "--delete",
            `${stageRoot}/`,
            remote + "/"
        ];
        console.log(`[deploy] rsync ${args.join(" ")}`);
        if (dryRun) return;
        const r = spawnSync("rsync", args, { stdio: "inherit" });
        if (r.status !== 0) throw new Error("rsync failed");
        return;
    }
    console.log(`[deploy] scp -r ${stageRoot}/. ${remote}/`);
    if (dryRun) return;
    // Ensure remote dir exists.
    spawnSync("ssh", [`${user}@${host}`, `mkdir -p "${dir.replace(/\\/g, "/")}"`], {
        stdio: "inherit"
    });
    const r = spawnSync("scp", ["-r", `${stageRoot}/.`, remote], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("scp failed");
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.target || !args.runtime) {
        printHelp();
        process.exit(args.help ? 0 : 1);
    }
    if (!["110", "200", "windows", "linux"].includes(args.target)) {
        console.error("--target must be 110 or 200, or windows or linux");
        process.exit(1);
    }
    if (!["node", "java", "neutralino"].includes(args.runtime)) {
        console.error("--runtime must be node, java, or neutralino");
        process.exit(1);
    }

    const spec = targetSpec(args.target, args.runtime);
    const stageRoot = path.join(APP_ROOT, "build", "deploy", `${args.target}-${args.runtime}`);
    // WHY: .110 is Windows desk; .200 is Linux gateway — stage for the *target*, not the build host.
    const platform = (args.target === "110" || args.target === "windows") ? "windows" : "linux";

    console.log(`[deploy] staging ${args.runtime} (${platform}) → ${stageRoot}`);
    if (args.runtime === "node") stageNode(stageRoot);
    else stageJava(stageRoot, platform);

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
