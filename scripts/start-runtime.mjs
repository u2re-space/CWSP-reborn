/*
 * Filename: start-runtime.mjs
 * FullPath: apps/CWSP-reborn/scripts/start-runtime.mjs
 * Change date and time: 18.00.00_10.07.2026
 * Reason for changes: Local start for Node/Java backends and PM2 wrappers.
 *
 * Usage:
 *   node scripts/start-runtime.mjs --runtime node|java|pm2-node|pm2-java|pm2
 *   node scripts/start-runtime.mjs --help
 */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
    APP_ROOT,
    DEFAULTS,
    detectPlatform,
    javaMainForPlatform,
    nodeEntryForPlatform
} from "./lib/runtime-env.mjs";

function printHelp() {
    console.log(`CWSP-reborn start-runtime

Options:
  --runtime <node|java|pm2|pm2-node|pm2-java>   (required)
  --platform <linux|windows>                   (default: host)
  --help

Env:
  CWSP_PLATFORM, CWSP_JAVA_OUT, CWSP_PM2_NODE_NAME, CWSP_PM2_JAVA_NAME
  CWSP_CONTROL_KEY (optional API key for backends)
`);
}

function parseArgs(argv) {
    const out = { runtime: null, platform: detectPlatform(), help: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--help" || a === "-h") out.help = true;
        else if (a === "--runtime") out.runtime = argv[++i];
        else if (a === "--platform") out.platform = String(argv[++i] || "").toLowerCase();
        else if (a.startsWith("--runtime=")) out.runtime = a.slice("--runtime=".length);
        else if (a.startsWith("--platform=")) out.platform = a.slice("--platform=".length).toLowerCase();
    }
    return out;
}

function runForeground(command, args, opts = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: APP_ROOT,
            stdio: "inherit",
            env: { ...process.env, ...opts.env },
            shell: opts.shell === true
        });
        child.on("error", reject);
        child.on("exit", (code, signal) => {
            if (signal) reject(new Error(`killed by ${signal}`));
            else resolve(code ?? 1);
        });
    });
}

function ensureJavaClasses(platform) {
    const outDir = DEFAULTS.javaOut;
    fs.mkdirSync(outDir, { recursive: true });
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
    console.log(`[start:java] javac ${sources.length} files → ${outDir}`);
    const r = spawnSync("javac", ["--release", "17", "-d", outDir, ...sources], {
        cwd: APP_ROOT,
        stdio: "inherit"
    });
    if (r.status !== 0) {
        throw new Error(`javac failed with status ${r.status}`);
    }
    return outDir;
}

async function startNode(platform) {
    const entry = nodeEntryForPlatform(platform);
    const abs = path.join(APP_ROOT, entry);
    if (!fs.existsSync(abs)) {
        throw new Error(`missing node entry ${entry}`);
    }
    const loader = path.join(APP_ROOT, "scripts/resolve-aliases.mjs");
    console.log(`[start:node] platform=${platform} entry=${entry}`);
    return runForeground(process.execPath, [
        "--import",
        pathToFileURL(loader).href,
        "--experimental-strip-types",
        abs
    ]);
}

async function startJava(platform) {
    const outDir = ensureJavaClasses(platform);
    const main = javaMainForPlatform(platform);
    console.log(`[start:java] platform=${platform} main=${main}`);
    return runForeground("java", ["-cp", outDir, main]);
}

function pm2Start(name, scriptArgs) {
    const eco = path.join(APP_ROOT, "ecosystem.config.cjs");
    const args = ["start", eco, "--only", name, "--update-env"];
    console.log(`[start:pm2] pm2 ${args.join(" ")}`);
    const r = spawnSync("pm2", args, { cwd: APP_ROOT, stdio: "inherit", env: process.env });
    if (r.status !== 0) {
        throw new Error(`pm2 start failed for ${name}`);
    }
    // Attach logs briefly for visibility (non-fatal if pm2 logs exits).
    spawnSync("pm2", ["logs", name, "--lines", "20"], {
        cwd: APP_ROOT,
        stdio: "inherit"
    });
    return 0;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.runtime) {
        printHelp();
        process.exit(args.help ? 0 : 1);
    }
    const platform = args.platform === "windows" || args.platform === "linux"
        ? args.platform
        : detectPlatform();

    switch (args.runtime) {
        case "node":
            process.exit(await startNode(platform));
            break;
        case "java":
            process.exit(await startJava(platform));
            break;
        case "pm2-node":
            process.exit(pm2Start(DEFAULTS.pm2NodeName));
            break;
        case "pm2-java":
            process.exit(pm2Start(DEFAULTS.pm2JavaName));
            break;
        case "pm2": {
            // Default dual-stack: node first, then java (both under PM2).
            pm2Start(DEFAULTS.pm2NodeName);
            pm2Start(DEFAULTS.pm2JavaName);
            process.exit(0);
            break;
        }
        default:
            console.error(`unknown --runtime ${args.runtime}`);
            printHelp();
            process.exit(1);
    }
}

main().catch((err) => {
    console.error("[start-runtime]", err?.message || err);
    process.exit(1);
});
