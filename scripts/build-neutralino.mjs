/*
 * Filename: build-neutralino.mjs
 * FullPath: apps/CWSP-reborn/scripts/build-neutralino.mjs
 * Change date and time: 16.35.00_11.07.2026
 * Reason for changes: Fix infinite npm recursion (build:neutralino:web → self),
 *   separate --platform from --target deploy, align resources/extensions layout.
 *
 * Usage:
 *   node scripts/build-neutralino.mjs
 *   node scripts/build-neutralino.mjs --platform windows
 *   node scripts/build-neutralino.mjs --platform linux
 *   node scripts/build-neutralino.mjs --web-only
 *   node scripts/build-neutralino.mjs --skip-web
 *   node scripts/build-neutralino.mjs --update
 *   node scripts/build-neutralino.mjs --clean
 *
 * Deploy (only with --target):
 *   node scripts/build-neutralino.mjs --target 110
 *   node scripts/build-neutralino.mjs --platform windows --target 110
 *   node scripts/build-neutralino.mjs --target 200 --dry-run
 *
 * INVARIANT: `npm run build:neutralino:web` MUST be Vite only
 * (`vite build --mode neutralino`), never this script — recursion loop.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import {
    APP_ROOT,
    targetSpec
} from "./lib/runtime-env.mjs";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(APP_ROOT);

const CONFIG_FILE = path.join(ROOT, "neutralino.config.json");
const BUILD_ROOT = path.join(ROOT, "build", "neutralino");
/** Vite --mode neutralino outDir (see vite.config.ts). */
const WEB_OUT_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_WEB_OUT || "build/neutralino/web"
);
/** Neutralino CLI resourcesPath (/resources/ → ./resources). */
const RESOURCES_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_RESOURCES_DIR || "resources"
);
const EXTENSIONS_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_EXTENSIONS_DIR || "extensions"
);
/** Framework binaries from `neu update` (neutralino-linux_x64, …). */
const FRAMEWORK_BIN_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_FRAMEWORK_BIN_DIR || "bin"
);
/**
 * neu app output directory.
 * INVARIANT: must NOT be `dist`/`build` root — `dist` → `build` symlink, and
 * staging into `build/deploy/...` would recursively copy itself (ENAMETOOLONG).
 * Default: `build/<cli.binaryName>` (neu writes here when dist→build).
 */
const WEB_MANIFEST = path.join(BUILD_ROOT, ".resources-manifest.json");

/** Source of extNode CJS bridge (Windows Neutralino packaging). */
const NODE_EXT_SRC = path.join(
    ROOT,
    "app",
    "windows",
    "neutralino",
    "node"
);

function printHelp() {
    console.log(`
CWSP-reborn Neutralinojs build

Usage:
  node scripts/build-neutralino.mjs [options]

Build options:
  --platform <windows|linux|web>
                        Packaging hint. "web" ⇒ --web-only.
                        Does NOT deploy (use --target for deploy).
  --release             Release build (neu --release)
  --web-only            Vite + sync resources only (no neu build)
  --skip-web            Skip Vite; sync existing web output
  --backend-only        Package Node backend beside existing neu exe(s)
                        (no Vite / no neu build; refreshes backend/ + extNode)
  --update              Run "neu update" before build
  --clean               Remove previous Neutralino build output
  --embed-resources     Pass --embed-resources to Neutralino CLI

Deploy options:
  --target <110|200>    Build and deploy to target host
  --dry-run             Do not execute remote upload

Other:
  --help, -h            Show this help

npm scripts:
  build:neutralino:web       → vite build --mode neutralino  (NOT this file)
  build:neutralino           → full local neu build
  build:neutralino:windows   → full build (--platform windows)
  build:neutralino:linux     → full build (--platform linux)
`);
}

function parseArgs(argv) {
    const result = {
        platform: null,
        release: false,
        webOnly: false,
        skipWeb: false,
        backendOnly: false,
        update: false,
        clean: false,
        embedResources: false,
        target: null,
        dryRun: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === "--help" || arg === "-h") {
            result.help = true;
        } else if (arg === "--release") {
            result.release = true;
        } else if (arg === "--web-only") {
            result.webOnly = true;
        } else if (arg === "--skip-web") {
            result.skipWeb = true;
        } else if (arg === "--backend-only") {
            result.backendOnly = true;
        } else if (arg === "--update") {
            result.update = true;
        } else if (arg === "--clean") {
            result.clean = true;
        } else if (arg === "--embed-resources") {
            result.embedResources = true;
        } else if (arg === "--dry-run") {
            result.dryRun = true;
        } else if (arg === "--platform" || arg.startsWith("--platform=")) {
            const value = arg.includes("=")
                ? arg.slice("--platform=".length)
                : argv[++i];
            if (!value) throw new Error("--platform requires windows|linux|web");
            result.platform = String(value).toLowerCase();
        } else if (arg === "--target" || arg.startsWith("--target=")) {
            const value = arg.includes("=")
                ? arg.slice("--target=".length)
                : argv[++i];
            if (!value) throw new Error("--target requires 110|200");
            result.target = String(value);
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    if (result.platform === "web") {
        result.webOnly = true;
    }

    if (
        result.platform &&
        !["windows", "linux", "web"].includes(result.platform)
    ) {
        throw new Error(
            `Invalid --platform: ${result.platform} (expected windows|linux|web)`
        );
    }

    return result;
}

function commandName(name) {
    if (process.platform === "win32") {
        if (name === "npm") return "npm.cmd";
        if (name === "npx") return "npx.cmd";
    }
    return name;
}

function quote(value) {
    const text = String(value);
    if (/^[a-zA-Z0-9_./:@%+=,-]+$/.test(text)) return text;
    return JSON.stringify(text);
}

function run(command, args = [], options = {}) {
    const cwd = options.cwd || ROOT;
    console.log(`[build:neutralino] ${command} ${args.map(quote).join(" ")}`);

    const result = spawnSync(command, args, {
        cwd,
        stdio: "inherit",
        env: { ...process.env, ...(options.env || {}) },
        shell: process.platform === "win32"
    });

    if (result.error) {
        throw new Error(
            `${command} could not be started: ${result.error.message}`
        );
    }
    if (result.status !== 0) {
        const suffix = result.signal
            ? `, signal ${result.signal}`
            : `, status ${result.status}`;
        throw new Error(`${command} failed${suffix}`);
    }
    return result;
}

function runNpm(args) {
    return run(commandName("npm"), args);
}

function resolveNeuBin() {
    // Prefer package resolution so hoisted monorepo installs (root node_modules) work.
    try {
        const pkgJson = require.resolve("@neutralinojs/neu/package.json");
        const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf8"));
        const binField = pkg.bin?.neu || pkg.bin;
        if (typeof binField === "string") {
            const neuJs = path.resolve(path.dirname(pkgJson), binField);
            if (fs.existsSync(neuJs)) {
                return { command: process.execPath, argsPrefix: [neuJs] };
            }
        }
    } catch {
        /* not resolvable from this script path */
    }

    const candidates = [
        path.join(ROOT, "node_modules", "@neutralinojs", "neu"),
        path.join(ROOT, "..", "..", "node_modules", "@neutralinojs", "neu"),
        path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "node_modules", "@neutralinojs", "neu")
    ];

    for (const pkgDir of candidates) {
        const neuJs = path.join(pkgDir, "bin", "neu.js");
        if (fs.existsSync(neuJs)) {
            return { command: process.execPath, argsPrefix: [neuJs] };
        }
    }

    const binName = process.platform === "win32" ? "neu.cmd" : "neu";
    for (const binDir of [
        path.join(ROOT, "node_modules", ".bin"),
        path.join(ROOT, "..", "..", "node_modules", ".bin")
    ]) {
        const localBin = path.join(binDir, binName);
        if (fs.existsSync(localBin)) {
            return { command: localBin, argsPrefix: [] };
        }
    }

    return null;
}

function runNeu(args) {
    const resolved = resolveNeuBin();
    if (!resolved) {
        throw new Error(
            "Neutralino CLI not found. Install with:\n" +
                "  npm install -D @neutralinojs/neu\n" +
                "Then re-run this build (optionally with --update)."
        );
    }
    return run(resolved.command, [...resolved.argsPrefix, ...args]);
}

function readJson(file) {
    if (!fs.existsSync(file)) {
        throw new Error(`File not found: ${file}`);
    }
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        throw new Error(`Invalid JSON in ${file}: ${error.message}`);
    }
}

function readNeutralinoConfig() {
    return readJson(CONFIG_FILE);
}

function remove(target) {
    fs.rmSync(target, { recursive: true, force: true });
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, destination) {
    ensureDir(path.dirname(destination));
    fs.copyFileSync(source, destination);
}

function listFiles(root) {
    if (!fs.existsSync(root)) return [];
    const result = [];
    function walk(current) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const source = path.join(current, entry.name);
            if (entry.isDirectory()) walk(source);
            else if (entry.isFile()) result.push(source);
        }
    }
    walk(root);
    return result;
}

function copyDirectoryContents(sourceDir, destinationDir) {
    const srcReal = fs.realpathSync(sourceDir);
    ensureDir(destinationDir);
    const destReal = fs.realpathSync(destinationDir);

    // SAFETY: refuse copy when dest is inside source (dist→build + stage under build/).
    if (destReal === srcReal || destReal.startsWith(`${srcReal}${path.sep}`)) {
        throw new Error(
            `Refusing recursive copy: destination is inside source\n` +
                `  source: ${srcReal}\n` +
                `  dest:   ${destReal}`
        );
    }

    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        // Skip nested deploy staging leftovers if someone points at a wide root.
        if (entry.name === "deploy") continue;

        const source = path.join(sourceDir, entry.name);
        const destination = path.join(destinationDir, entry.name);
        if (entry.isDirectory()) copyDirectoryContents(source, destination);
        else if (entry.isFile()) copyFile(source, destination);
    }
}

function readBinaryName() {
    try {
        const cfg = readNeutralinoConfig();
        const name = cfg?.cli?.binaryName;
        if (typeof name === "string" && name.trim()) return name.trim();
    } catch {
        /* config may be validated later */
    }
    return "cwsp-neutralino";
}

/**
 * Directory produced by `neu build` for this app (executables + resources.neu).
 * WHY: never return `dist`/`build` root — that symlink nest caused ENAMETOOLONG.
 */
function resolveAppOutDir() {
    if (process.env.CWSP_NEUTRALINO_BIN_DIR) {
        return path.resolve(ROOT, process.env.CWSP_NEUTRALINO_BIN_DIR);
    }
    const name = readBinaryName();
    const candidates = [
        path.join(ROOT, "build", name),
        path.join(ROOT, "dist", name)
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) return fs.realpathSync(candidate);
    }
    return path.join(ROOT, "build", name);
}

function resolveBinDir() {
    return resolveAppOutDir();
}

function safeResourcePath(root, relativePath) {
    const resolvedRoot = path.resolve(root);
    const resolvedPath = path.resolve(root, relativePath);
    const prefix = `${resolvedRoot}${path.sep}`;
    if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(prefix)) {
        return null;
    }
    return resolvedPath;
}

/**
 * Copy Vite web output into Neutralino /resources/.
 * Preserves non-manifest files (e.g. icons, hand-placed assets).
 */
function syncWebToResources() {
    if (!fs.existsSync(WEB_OUT_DIR)) {
        throw new Error(
            `Web output directory does not exist: ${WEB_OUT_DIR}\n` +
                `Run: npm run build:neutralino:web\n` +
                `Or set CWSP_NEUTRALINO_WEB_OUT.`
        );
    }

    ensureDir(BUILD_ROOT);
    ensureDir(RESOURCES_DIR);

    let previousManifest = { files: [] };
    if (fs.existsSync(WEB_MANIFEST)) {
        try {
            previousManifest = readJson(WEB_MANIFEST);
        } catch {
            previousManifest = { files: [] };
        }
    }

    for (const relativePath of previousManifest.files || []) {
        const destination = safeResourcePath(RESOURCES_DIR, relativePath);
        if (destination && fs.existsSync(destination)) {
            fs.rmSync(destination, { force: true });
        }
    }

    const generatedFiles = [];
    for (const source of listFiles(WEB_OUT_DIR)) {
        const relativePath = path.relative(WEB_OUT_DIR, source);
        const destination = safeResourcePath(RESOURCES_DIR, relativePath);
        if (!destination) {
            throw new Error(
                `Unsafe resource path generated by Vite: ${relativePath}`
            );
        }
        copyFile(source, destination);
        generatedFiles.push(relativePath);
    }

    // Ensure a placeholder icon path exists so neu config does not hard-fail.
    const iconRel = path.join("icons", "appIcon.png");
    const iconDest = path.join(RESOURCES_DIR, iconRel);
    if (!fs.existsSync(iconDest)) {
        ensureDir(path.dirname(iconDest));
        // Minimal 1x1 PNG so missing branding does not block neu build.
        const png = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            "base64"
        );
        fs.writeFileSync(iconDest, png);
        if (!generatedFiles.includes(iconRel)) generatedFiles.push(iconRel);
    }

    fs.writeFileSync(
        WEB_MANIFEST,
        JSON.stringify({ source: WEB_OUT_DIR, files: generatedFiles }, null, 4) +
            "\n"
    );

    console.log(
        `[build:neutralino] synced ${generatedFiles.length} web files → ${RESOURCES_DIR}`
    );
}

/**
 * Stage extNode (main.js + cwsp-bridge.js + runners) under /extensions/node.
 */
function syncNodeExtension() {
    if (!fs.existsSync(NODE_EXT_SRC)) {
        console.warn(
            `[build:neutralino] node extension source missing: ${NODE_EXT_SRC}`
        );
        return;
    }
    const dest = path.join(EXTENSIONS_DIR, "node");
    ensureDir(dest);
    for (const name of [
        "main.js",
        "cwsp-bridge.js",
        "neutralino-extension.js",
        "run",
        "run.cmd",
        "npm",
        "npm.cmd",
        "install.sh",
        "install.cmd"
    ]) {
        const src = path.join(NODE_EXT_SRC, name);
        if (fs.existsSync(src)) {
            copyFile(src, path.join(dest, name));
            try {
                if (name === "run" || name === "npm" || name.endsWith(".sh")) {
                    fs.chmodSync(path.join(dest, name), 0o755);
                }
            } catch {
                /* ignore */
            }
        }
    }
    // Preserve _runtime placeholder so install scripts have a target dir.
    ensureDir(path.join(dest, "_runtime"));
    console.log(`[build:neutralino] synced extNode → ${dest}`);
}

/**
 * Copy a source tree of .ts/.js/.mjs/.json files (skip build artifacts / huge trees).
 */
function copyTsTree(sourceDir, destinationDir) {
    if (!fs.existsSync(sourceDir)) return;
    ensureDir(destinationDir);
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        if (
            entry.name === "node_modules" ||
            entry.name === "build" ||
            entry.name === "dist" ||
            entry.name === ".git" ||
            entry.name === "test" ||
            entry.name === "tests"
        ) {
            continue;
        }
        const src = path.join(sourceDir, entry.name);
        const dest = path.join(destinationDir, entry.name);
        if (entry.isDirectory()) {
            // Skip nested java/web protocol façades when copying protocol root.
            if (
                entry.name === "java" ||
                entry.name === "web" ||
                entry.name === "android"
            ) {
                continue;
            }
            copyTsTree(src, dest);
            continue;
        }
        if (!entry.isFile()) continue;
        if (!/\.(ts|js|mjs|cjs|json|md)$/i.test(entry.name)) continue;
        copyFile(src, dest);
    }
}

function writePackagedResolveAliases(backendNodeDir) {
    const content = `/*
 * Portable alias loader for packaged Neutralino Node backend.
 * Generated by scripts/build-neutralino.mjs — do not edit by hand in packages.
 */
import { register } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PKG_ROOT = path.dirname(fileURLToPath(import.meta.url));
const CWSP_SHARED = path.join(PKG_ROOT, "vendor", "cwsp-shared");

const ALIAS_TABLE = Object.freeze([
    { prefix: "@fest-lib/cwsp-shared", root: CWSP_SHARED },
    { prefix: "cwsp-shared", root: CWSP_SHARED },
    { prefix: "protocol/node", root: path.join(PKG_ROOT, "protocol") },
    { prefix: "backend/node", root: PKG_ROOT }
]);

function mapAliasToPath(specifier) {
    for (const { prefix, root } of ALIAS_TABLE) {
        if (specifier === prefix) return path.join(root, "index.ts");
        if (!specifier.startsWith(prefix + "/")) continue;
        return path.join(root, specifier.slice(prefix.length + 1));
    }
    return null;
}

function resolveExisting(absPath) {
    if (existsSync(absPath)) return absPath;
    if (!absPath.endsWith(".ts") && !absPath.endsWith(".js") && !absPath.endsWith(".mjs")) {
        const withTs = absPath + ".ts";
        if (existsSync(withTs)) return withTs;
        const indexTs = path.join(absPath, "index.ts");
        if (existsSync(indexTs)) return indexTs;
    }
    if (absPath.endsWith(".ts") || absPath.endsWith(".js") || absPath.endsWith(".mjs")) {
        return absPath;
    }
    return null;
}

register(import.meta.url);

export async function resolve(specifier, context, nextResolve) {
    const mapped = mapAliasToPath(specifier);
    if (!mapped) return nextResolve(specifier, context);
    const existing = resolveExisting(mapped);
    if (!existing) return nextResolve(specifier, context);
    return {
        shortCircuit: true,
        url: pathToFileURL(existing).href
    };
}
`;
    fs.writeFileSync(
        path.join(backendNodeDir, "resolve-aliases.mjs"),
        content
    );
}

function writePackagedRunBackend(backendNodeDir) {
    const content = `#!/usr/bin/env node
/*
 * Launch CWSP Neutralino Node backend from a packaged Neutralino app folder.
 * Layout expected:
 *   <package>/backend/node/windows/index.ts
 *   <package>/backend/node/resolve-aliases.mjs
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(HERE, "..", "..");
const ENTRY = path.join(HERE, "windows", "index.ts");
const LOADER = path.join(HERE, "resolve-aliases.mjs");

if (!existsSync(ENTRY)) {
    console.error("[cwsp-backend] missing entry:", ENTRY);
    process.exit(1);
}

process.env.CWSP_DESKTOP_SHELL = process.env.CWSP_DESKTOP_SHELL || "neutralino";
process.env.CWSP_ROOT = process.env.CWSP_ROOT || PACKAGE_ROOT;
process.env.CWSP_BACKEND_HOLD = process.env.CWSP_BACKEND_HOLD || "0";

const args = [
    "--import",
    pathToFileURL(LOADER).href,
    "--experimental-strip-types",
    ENTRY
];

console.log("[cwsp-backend] starting", process.execPath, args.join(" "));
const child = spawn(process.execPath, args, {
    cwd: HERE,
    env: process.env,
    stdio: "inherit"
});

child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
});
`;
    const out = path.join(backendNodeDir, "run-backend.mjs");
    fs.writeFileSync(out, content);
    try {
        fs.chmodSync(out, 0o755);
    } catch {
        /* ignore */
    }
}

function writePackagedBackendPackageJson(backendNodeDir) {
    const pkg = {
        name: "cwsp-neutralino-backend",
        private: true,
        type: "module",
        description:
            "Packaged CWSP Node backend for Neutralino (Windows/Linux desk).",
        scripts: {
            start: "node ./run-backend.mjs"
        },
        dependencies: {
            clipboardy: "^5.3.1",
            ws: "^8.21.0"
        }
    };
    fs.writeFileSync(
        path.join(backendNodeDir, "package.json"),
        JSON.stringify(pkg, null, 2) + "\n"
    );
}

/**
 * Try to vendor runtime deps next to the backend so the desk package works
 * without a monorepo install (best-effort copy from workspace node_modules).
 */
function vendorNodeDeps(backendNodeDir) {
    const deps = ["clipboardy", "ws"];
    const searchRoots = [
        path.join(ROOT, "node_modules"),
        path.join(ROOT, "..", "..", "node_modules")
    ];
    const destRoot = path.join(backendNodeDir, "node_modules");
    for (const dep of deps) {
        let found = null;
        for (const root of searchRoots) {
            const candidate = path.join(root, dep);
            if (fs.existsSync(candidate)) {
                found = candidate;
                break;
            }
        }
        if (!found) {
            console.warn(
                `[build:neutralino] dep ${dep} not found for vendoring — run npm install in backend/node on target`
            );
            continue;
        }
        const dest = path.join(destRoot, dep);
        remove(dest);
        ensureDir(path.dirname(dest));
        fs.cpSync(found, dest, { recursive: true });
        console.log(`[build:neutralino] vendored ${dep} → ${dest}`);
    }
}

/**
 * Package CWSP Node backend beside the Neutralino exe.
 *
 * WHY: Neutralino extNode only ships the IPC bridge (main.js / cwsp-bridge.js);
 * the real settings/protocol/AHK backend lives under src/backend/node and must
 * travel with the portable package.
 *
 * Layout inside packageRoot:
 *   backend/node/windows/
 *   backend/node/shared/
 *   backend/node/protocol/
 *   backend/node/vendor/cwsp-shared/
 *   backend/node/resolve-aliases.mjs
 *   backend/node/run-backend.mjs
 *   backend/node/package.json
 */
function packageNodeBackend(packageRoot) {
    const backendNodeDir = path.join(packageRoot, "backend", "node");
    remove(backendNodeDir);
    ensureDir(backendNodeDir);

    const windowsSrc = path.join(ROOT, "src", "backend", "node", "windows");
    const sharedSrc = path.join(ROOT, "src", "backend", "node", "shared");
    const protocolSrc = path.join(ROOT, "src", "protocol", "node");
    const cwspSharedSrc = path.resolve(
        ROOT,
        "..",
        "..",
        "modules",
        "projects",
        "cwsp-shared",
        "src"
    );

    copyTsTree(windowsSrc, path.join(backendNodeDir, "windows"));
    // windows/protocol is often a symlink into app/src/protocol — replace with a real copy.
    // Dirent skips the symlink during copyTsTree; still wipe any followed residue.
    remove(path.join(backendNodeDir, "windows", "protocol"));
    copyTsTree(sharedSrc, path.join(backendNodeDir, "shared"));
    copyTsTree(protocolSrc, path.join(backendNodeDir, "protocol"));
    // Also materialize under windows/protocol for any relative imports.
    copyTsTree(protocolSrc, path.join(backendNodeDir, "windows", "protocol", "node"));
    if (fs.existsSync(cwspSharedSrc)) {
        copyTsTree(cwspSharedSrc, path.join(backendNodeDir, "vendor", "cwsp-shared"));
    } else {
        console.warn(
            `[build:neutralino] cwsp-shared src missing: ${cwspSharedSrc}`
        );
    }

    writePackagedResolveAliases(backendNodeDir);
    writePackagedRunBackend(backendNodeDir);
    writePackagedBackendPackageJson(backendNodeDir);
    vendorNodeDeps(backendNodeDir);

    fs.writeFileSync(
        path.join(packageRoot, "backend", "README.md"),
        [
            "# CWSP Neutralino Node backend",
            "",
            "Packaged beside the Neutralino executable because `extNode` only",
            "provides the WebView↔Node IPC bridge — not the CWSP protocol/settings runtime.",
            "",
            "## Start",
            "",
            "```bash",
            "node backend/node/run-backend.mjs",
            "```",
            "",
            "On Windows desk packages the Neutralino `extNode` extension auto-spawns",
            "this backend when `backend/node/run-backend.mjs` is present.",
            "",
            "If clipboardy/ws are missing:",
            "",
            "```bash",
            "cd backend/node && npm install",
            "```",
            ""
        ].join("\n")
    );

    // Refresh extNode main.js so packaged bridge auto-spawns this backend.
    syncExtNodeMain(packageRoot);

    console.log(`[build:neutralino] packaged Node backend → ${backendNodeDir}`);
    return backendNodeDir;
}

/**
 * Copy latest Neutralino node extension entry into a package's extensions/node/.
 * WHY: neu may have baked an older main.js; backend packaging must keep spawn wiring.
 */
function syncExtNodeMain(packageRoot) {
    const srcMain = path.join(ROOT, "app", "windows", "neutralino", "node", "main.js");
    const destMain = path.join(packageRoot, "extensions", "node", "main.js");
    if (!fs.existsSync(srcMain)) {
        console.warn(`[build:neutralino] extNode main missing: ${srcMain}`);
        return;
    }
    if (!fs.existsSync(path.dirname(destMain))) {
        console.warn(
            `[build:neutralino] package has no extensions/node — skip main.js sync (${packageRoot})`
        );
        return;
    }
    copyFile(srcMain, destMain);
    // Bridge + helpers if present next to main in source.
    for (const name of ["cwsp-bridge.js", "neutralino-extension.js", "neutralino-extension.cjs"]) {
        const src = path.join(path.dirname(srcMain), name);
        if (!fs.existsSync(src)) continue;
        copyFile(src, path.join(path.dirname(destMain), name));
    }
    console.log(`[build:neutralino] synced extNode → ${destMain}`);
}

/**
 * Package backend into existing Neutralino output trees (no Vite / neu).
 */
function packageBackendOnly(platformHint) {
    const candidates = [
        resolveAppOutDir(),
        path.join(BUILD_ROOT, "app"),
        path.join(BUILD_ROOT, "windows"),
        path.join(BUILD_ROOT, "linux"),
        path.join(ROOT, "build", "deploy", "local-windows-neutralino"),
        path.join(ROOT, "build", "deploy", "local-linux-neutralino")
    ];

    const wanted =
        platformHint === "windows"
            ? ["windows", "local-windows"]
            : platformHint === "linux"
              ? ["linux", "local-linux"]
              : null;

    let count = 0;
    for (const dir of candidates) {
        if (!fs.existsSync(dir)) continue;
        // Need at least an exe/binary or resources.neu to treat as a package root.
        const hasNeu =
            fs.existsSync(path.join(dir, "resources.neu")) ||
            fs.readdirSync(dir).some((n) => /neutralino|cwsp-/i.test(n));
        if (!hasNeu) continue;
        if (wanted) {
            const base = path.basename(dir);
            if (
                !wanted.some((w) => base.includes(w)) &&
                dir !== resolveAppOutDir() &&
                path.basename(dir) !== "app"
            ) {
                continue;
            }
        }
        packageNodeBackend(dir);
        count += 1;
    }
    if (count === 0) {
        throw new Error(
            "No Neutralino package roots found for --backend-only (run a full build first)"
        );
    }
    console.log(`[build:neutralino] backend-only packaged into ${count} root(s)`);
}

function cleanBuild() {
    console.log("[build:neutralino] cleaning previous output");
    remove(BUILD_ROOT);
    remove(resolveAppOutDir());
    // Wipe broken recursive stage nests from older builds.
    remove(path.join(ROOT, "build", "deploy", "local-windows-neutralino"));
    remove(path.join(ROOT, "build", "deploy", "local-linux-neutralino"));
}

function resolveNeutralinoLibJs() {
    try {
        const pkgJson = require.resolve("@neutralinojs/lib/package.json");
        const candidate = path.join(path.dirname(pkgJson), "dist", "neutralino.js");
        if (fs.existsSync(candidate)) return candidate;
    } catch {
        /* hoisted / missing */
    }

    const fallbacks = [
        path.join(ROOT, "node_modules", "@neutralinojs", "lib", "dist", "neutralino.js"),
        path.join(ROOT, "..", "..", "node_modules", "@neutralinojs", "lib", "dist", "neutralino.js")
    ];
    for (const candidate of fallbacks) {
        if (fs.existsSync(candidate)) return candidate;
    }
    return null;
}

/**
 * neu build requires cli.clientLibrary on disk (`./resources/js/neutralino.js`).
 * WHY: Vite does not emit it — copy from `@neutralinojs/lib` (or leave neu update copy).
 */
function ensureClientLibrary() {
    const dest = path.join(RESOURCES_DIR, "js", "neutralino.js");
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        console.log(`[build:neutralino] client library present: ${dest}`);
        return dest;
    }

    const src = resolveNeutralinoLibJs();
    if (!src) {
        throw new Error(
            "Missing Neutralino client library.\n" +
                "  Expected: resources/js/neutralino.js\n" +
                "  Install: npm install -D @neutralinojs/lib\n" +
                "  Or run:  node scripts/build-neutralino.mjs --update"
        );
    }

    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    console.log(`[build:neutralino] client library ← ${src}`);
    console.log(`[build:neutralino] client library → ${dest}`);
    return dest;
}

/** Inject Neutralino client script into the Vite-built index.html if missing. */
function injectClientScriptTag() {
    const htmlPath = path.join(RESOURCES_DIR, "index.html");
    if (!fs.existsSync(htmlPath)) {
        throw new Error(`Missing resources/index.html (run web build first): ${htmlPath}`);
    }

    let html = fs.readFileSync(htmlPath, "utf8");
    if (/neutralino\.js/.test(html)) return;

    const tag = '    <script src="./js/neutralino.js"></script>\n';
    if (/<\/head>/i.test(html)) {
        html = html.replace(/<\/head>/i, `${tag}</head>`);
    } else if (/<body[^>]*>/i.test(html)) {
        html = html.replace(/<body[^>]*>/i, (m) => `${m}\n${tag}`);
    } else {
        html = tag + html;
    }
    fs.writeFileSync(htmlPath, html);
    console.log("[build:neutralino] injected ./js/neutralino.js into resources/index.html");
}

function binariesPresent() {
    if (!fs.existsSync(FRAMEWORK_BIN_DIR)) return false;
    return fs
        .readdirSync(FRAMEWORK_BIN_DIR)
        .some((name) => name.startsWith("neutralino-"));
}

/**
 * Download Neutralino framework binaries when missing (`neu update`).
 * Client JS is handled separately via ensureClientLibrary().
 */
function ensureFrameworkBinaries(args) {
    if (args.update) return; // already requested explicitly in main()
    if (binariesPresent()) {
        console.log("[build:neutralino] framework binaries present in ./bin");
        return;
    }
    console.log("[build:neutralino] framework binaries missing — running neu update");
    runNeu(["update"]);
}

function buildWeb(args) {
    if (args.skipWeb) {
        console.log(
            "[build:neutralino] --skip-web — using existing web output"
        );
    } else {
        // INVARIANT: this npm script must call Vite, never this .mjs file.
        const script =
            process.env.CWSP_NEUTRALINO_WEB_SCRIPT || "build:neutralino:web";
        runNpm(["run", script]);
    }
    syncWebToResources();
    syncNodeExtension();
    ensureClientLibrary();
    injectClientScriptTag();
}

function buildNeutralino(args) {
    ensureClientLibrary();
    ensureFrameworkBinaries(args);

    const buildArgs = ["build"];
    if (args.release) buildArgs.push("--release");
    if (args.embedResources) buildArgs.push("--embed-resources");

    runNeu(buildArgs);

    const binDir = resolveAppOutDir();
    if (!fs.existsSync(binDir)) {
        throw new Error(
            `Neutralino build completed, but output directory was not found: ${binDir}`
        );
    }

    // Package Node backend next to exe inside neu output (before publish/stage copies).
    packageNodeBackend(binDir);

    const artifacts = listFiles(binDir);
    if (artifacts.length === 0) {
        throw new Error(`Neutralino output directory is empty: ${binDir}`);
    }

    console.log(`[build:neutralino] app out: ${binDir}`);
    console.log(`[build:neutralino] artifacts: ${artifacts.length} files`);
    for (const artifact of artifacts) {
        console.log(`  ${path.relative(ROOT, artifact)}`);
    }
}

function stageNeutralino(stageRoot, platform) {
    // Prefer slim platform package (already has exe + backend), then full neu out.
    const preferred = [
        path.join(BUILD_ROOT, platform),
        path.join(ROOT, "build", "deploy", `local-${platform}-neutralino`),
        path.join(BUILD_ROOT, "app"),
        resolveAppOutDir()
    ];
    let binDir = null;
    for (const candidate of preferred) {
        if (!fs.existsSync(candidate)) continue;
        const hasPackage =
            fs.existsSync(path.join(candidate, "resources.neu")) ||
            fs.readdirSync(candidate).some((n) => /cwsp-neutralino|\.exe$/i.test(n));
        if (hasPackage) {
            binDir = candidate;
            break;
        }
    }
    if (!binDir) {
        throw new Error(
            `Cannot stage Neutralino build: no package under build/neutralino/{${platform},app} or build/cwsp-neutralino`
        );
    }

    // Always wipe previous stage first (may be a recursive nest from older bugs).
    remove(stageRoot);
    ensureDir(path.dirname(stageRoot));
    ensureDir(stageRoot);
    copyDirectoryContents(binDir, stageRoot);
    // Ensure backend is present even if binDir was staged from an older neu out.
    if (!fs.existsSync(path.join(stageRoot, "backend", "node", "run-backend.mjs"))) {
        packageNodeBackend(stageRoot);
    }

    if (platform === "web") return stageRoot;

    writeStageHelpers(stageRoot, platform);
    console.log(
        `[build:neutralino] staged ${platform} package: ${stageRoot} ← ${binDir}`
    );
    return stageRoot;
}

/** README + run.cmd/run.sh for a staged Neutralino package. */
function writeStageHelpers(stageRoot, platform) {
    const runFile = platform === "windows" ? "run.cmd" : "run.sh";
    const readme =
        platform === "windows"
            ? [
                  "# CWSP Neutralino",
                  "",
                  "Contents:",
                  "- `cwsp-neutralino-win_x64.exe` — Neutralino shell",
                  "- `resources.neu` — UI bundle",
                  "- `extensions/node/` — Neutralino↔Node IPC bridge (extNode)",
                  "- `backend/node/` — CWSP Node backend (settings/protocol/AHK)",
                  "",
                  "Run `run.cmd` or the `.exe`. extNode auto-starts `backend/node/run-backend.mjs`.",
                  "Manual backend:",
                  "",
                  "```bat",
                  "node backend\\node\\run-backend.mjs",
                  "```",
                  ""
              ].join("\n")
            : [
                  "# CWSP Neutralino",
                  "",
                  "Contents:",
                  "- Neutralino binary",
                  "- `resources.neu` — UI bundle",
                  "- `extensions/node/` — Neutralino↔Node IPC bridge (extNode)",
                  "- `backend/node/` — CWSP Node backend",
                  "",
                  "```bash",
                  "chmod +x ./<binary>",
                  "./<binary>",
                  "# or: node backend/node/run-backend.mjs",
                  "```",
                  ""
              ].join("\n");

    fs.writeFileSync(path.join(stageRoot, "README.md"), readme);

    if (platform === "windows") {
        fs.writeFileSync(
            path.join(stageRoot, "run.cmd"),
            [
                "@echo off",
                "setlocal",
                "for %%F in (*.exe) do (",
                "    start \"CWSP Neutralino\" \"%%F\"",
                "    exit /b 0",
                ")",
                "echo No .exe file found.",
                "exit /b 1",
                ""
            ].join("\n")
        );
        return;
    }

    const runFilePath = path.join(stageRoot, "run.sh");
    fs.writeFileSync(
        runFilePath,
        [
            "#!/usr/bin/env bash",
            "set -euo pipefail",
            'cd "$(dirname "$0")"',
            "",
            'binary="$(find . -maxdepth 1 -type f -perm -111 | head -n 1)"',
            "",
            'if [[ -z "$binary" ]]; then',
            '    echo "No executable Neutralino binary found." >&2',
            "    exit 1",
            "fi",
            "",
            'exec "$binary"',
            ""
        ].join("\n")
    );
    try {
        fs.chmodSync(runFilePath, 0o755);
    } catch {
        /* ignore */
    }
}

/**
 * Publish neu app output under `build/neutralino/` (canonical local tree)
 * without touching `build/neutralino/web` (Vite assets).
 *
 * Layout:
 *   build/neutralino/web/     — Vite frontend
 *   build/neutralino/app/     — full neu package (all OS binaries + resources.neu)
 *   build/neutralino/windows/ — windows-focused package (when --platform windows)
 *   build/neutralino/linux/   — linux-focused package (when --platform linux)
 */
function publishUnderBuildNeutralino(platform) {
    const binDir = resolveAppOutDir();
    if (!fs.existsSync(binDir)) {
        throw new Error(
            `Cannot publish Neutralino build: ${binDir} does not exist`
        );
    }

    ensureDir(BUILD_ROOT);

    // Full multi-arch package beside web/
    const appDir = path.join(BUILD_ROOT, "app");
    remove(appDir);
    ensureDir(appDir);
    copyDirectoryContents(binDir, appDir);
    if (!fs.existsSync(path.join(appDir, "backend", "node", "run-backend.mjs"))) {
        packageNodeBackend(appDir);
    }
    if (platform === "windows" || platform === "linux") {
        writeStageHelpers(appDir, platform);
    } else {
        // Default helpers for the host OS when no --platform given.
        writeStageHelpers(
            appDir,
            process.platform === "win32" ? "windows" : "linux"
        );
    }
    console.log(`[build:neutralino] published app → ${appDir}`);

    if (platform === "windows" || platform === "linux") {
        const platDir = path.join(BUILD_ROOT, platform);
        remove(platDir);
        ensureDir(platDir);

        // Copy shared pieces + backend.
        for (const name of ["resources.neu", "extensions", "backend"]) {
            const src = path.join(binDir, name);
            if (!fs.existsSync(src)) continue;
            const dest = path.join(platDir, name);
            if (fs.statSync(src).isDirectory()) {
                copyDirectoryContents(src, dest);
            } else {
                copyFile(src, dest);
            }
        }
        // If neu out lacked backend (race), package directly into platform dir.
        if (!fs.existsSync(path.join(platDir, "backend", "node", "run-backend.mjs"))) {
            packageNodeBackend(platDir);
        }

        // Platform binary only.
        const wanted =
            platform === "windows"
                ? [/win_x64\.exe$/i, /win.*\.exe$/i]
                : [/_linux_x64$/i, /linux_x64$/i];
        for (const entry of fs.readdirSync(binDir)) {
            if (wanted.some((re) => re.test(entry))) {
                copyFile(path.join(binDir, entry), path.join(platDir, entry));
            }
        }
        writeStageHelpers(platDir, platform);
        console.log(`[build:neutralino] published ${platform} → ${platDir}`);
    }
}

function hasCommand(command) {
    const result = spawnSync(command, ["--version"], {
        stdio: "ignore",
        shell: process.platform === "win32"
    });
    return !result.error && (result.status === 0 || result.status === 1);
}

function shellQuote(value) {
    return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function remoteSync({ user, host, dir, stageRoot, dryRun }) {
    const normalizedDir = String(dir).replaceAll("\\", "/");
    const remote = `${user}@${host}:${normalizedDir}`;

    if (hasCommand("rsync")) {
        const args = ["-az", "--delete", `${stageRoot}${path.sep}`, `${remote}/`];
        if (dryRun) {
            console.log(
                `[deploy] dry-run rsync ${args.map(quote).join(" ")}`
            );
            return;
        }
        run("rsync", args);
        return;
    }

    const sshTarget = `${user}@${host}`;
    const mkdirCommand = ["mkdir", "-p", shellQuote(normalizedDir)].join(" ");

    if (dryRun) {
        console.log(`[deploy] dry-run ssh ${sshTarget} ${mkdirCommand}`);
        console.log(
            `[deploy] dry-run scp -r ${stageRoot}${path.sep}. ${remote}`
        );
        return;
    }

    run("ssh", [sshTarget, mkdirCommand]);
    run("scp", ["-r", path.join(stageRoot, "."), remote]);
}

function deployNeutralino(args) {
    if (!args.target) {
        throw new Error("Deployment requires --target 110 or --target 200");
    }

    const validTargets = ["110", "200"];
    if (!validTargets.includes(args.target)) {
        throw new Error(
            `Invalid --target: ${args.target} (expected 110|200). ` +
                `Use --platform windows|linux for packaging without deploy.`
        );
    }

    const platform =
        args.platform === "linux" || args.target === "200"
            ? "linux"
            : "windows";

    const spec = targetSpec(args.target, "neutralino");
    if (!spec) {
        throw new Error(
            `No deploy specification for target=${args.target}, runtime=neutralino`
        );
    }

    const stageRoot = path.join(
        ROOT,
        "build",
        "deploy",
        `${args.target}-neutralino`
    );

    stageNeutralino(stageRoot, platform);

    console.log(
        `[deploy] ${spec.label} → ${spec.user}@${spec.host}:${spec.dir}`
    );

    remoteSync({
        user: spec.user,
        host: spec.host,
        dir: spec.dir,
        stageRoot,
        dryRun: args.dryRun
    });

    console.log(`[deploy] OK ${spec.label}`);
}

function main() {
    const args = parseArgs(process.argv.slice(2));

    if (args.help) {
        printHelp();
        return;
    }

    if (args.webOnly && args.target) {
        throw new Error("--web-only cannot be used together with --target");
    }
    if (args.backendOnly && (args.webOnly || args.target)) {
        throw new Error("--backend-only cannot be used with --web-only or --target");
    }

    readNeutralinoConfig();

    if (args.backendOnly) {
        packageBackendOnly(args.platform);
        console.log("[build:neutralino] OK (backend-only)");
        return;
    }

    if (args.clean) cleanBuild();
    if (args.update) runNeu(["update"]);

    buildWeb(args);

    if (args.webOnly) {
        console.log("[build:neutralino] web-only build completed");
        return;
    }

    buildNeutralino(args);

    // Canonical local tree: build/neutralino/{web,app[,windows|linux]}
    // (web already filled by buildWeb; app/platform filled here — never wipe web/)
    const publishPlatform =
        args.platform === "windows" || args.platform === "linux"
            ? args.platform
            : null;
    publishUnderBuildNeutralino(publishPlatform);

    // Optional deploy-shaped mirror (kept for deploy:110/200 scripts).
    if (args.platform === "windows" || args.platform === "linux") {
        const stageRoot = path.join(
            ROOT,
            "build",
            "deploy",
            `local-${args.platform}-neutralino`
        );
        stageNeutralino(stageRoot, args.platform);
    }

    if (args.target) {
        deployNeutralino(args);
    }

    console.log("[build:neutralino] OK");
    console.log(`[build:neutralino] web → ${path.join(BUILD_ROOT, "web")}`);
    console.log(`[build:neutralino] app → ${path.join(BUILD_ROOT, "app")}`);
    if (publishPlatform) {
        console.log(
            `[build:neutralino] ${publishPlatform} → ${path.join(BUILD_ROOT, publishPlatform)}`
        );
    }
}

try {
    main();
} catch (error) {
    console.error(
        `[build:neutralino] ${error?.stack || error?.message || error}`
    );
    process.exit(1);
}
