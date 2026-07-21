/*
 * Filename: build-neutralino.mjs
 * FullPath: apps/CWSP-reborn/scripts/build-neutralino.mjs
 * Change date and time: 16.40.00_21.07.2026
 * Reason for changes: Portable .tar.gz = backend/ + extensions/ + loose resources/
 *   (toast). UI already in resources.neu; host drops unpacked resources/.
 *   2026-07-21: vendor `fflate` into the packaged backend — files-hub.ts
 *   statically imported it for zip/gzip batch materialization, but the
 *   portable package only vendored clipboardy + ws, so the backend crashed
 *   with ERR_MODULE_NOT_FOUND and crash-looped :29110. fflate is now in
 *   writePackagedBackendPackageJson deps + vendorNodeDeps fallback +
 *   vendorNodeDepsFromWorkspace default rootDeps.
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
    targetSpec,
    toMsysRsyncPath,
    toWindowsSlashPath,
    isWindowsStylePath,
    normalizeSlashPath
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

/**
 * neu packs symlink targets as {"link":"..."} instead of file bytes.
 * On Windows that unresolved link crashes the exe (Event 1000 / 0xc0000409).
 * INVARIANT: project-root neutralino.config.json must be a real file at neu build time.
 */
function materializeNeutralinoConfigForPack() {
    const canonical = path.join(ROOT, "app", "windows", "neutralino.config.json");
    if (!fs.existsSync(canonical)) {
        throw new Error(`Canonical Neutralino config missing: ${canonical}`);
    }
    const body = fs.readFileSync(canonical);
    let wasLink = false;
    try {
        wasLink = fs.lstatSync(CONFIG_FILE).isSymbolicLink();
    } catch {
        wasLink = false;
    }
    if (wasLink) {
        fs.unlinkSync(CONFIG_FILE);
    }
    fs.writeFileSync(CONFIG_FILE, body);
    console.log(
        `[build:neutralino] materialized real neutralino.config.json` +
            (wasLink ? " (was symlink — required for Windows neu pack)" : "")
    );
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

/**
 * Stage loose toast/icons/js under package `resources/` for the portable .tar.gz.
 *
 * WHY: main UI already lives in `resources.neu` (neu build). Loose `resources/` is
 * only needed by Node→PowerShell toast (`prompt-toast.ps1`). It cannot be read from
 * resources.neu via Neutralino.resources from the Node backend process — so it ships
 * in the sibling `.tar.gz` and is unpacked under %TEMP% with backend/extensions.
 * COMPAT: `--res-mode=directory` Neutralino popup path is legacy; toast is PS1 now.
 */
function stageClipboardPromptResources(destRoot) {
    const srcPrompt = path.join(ROOT, "resources", "clipboard-prompt");
    if (!fs.existsSync(srcPrompt)) {
        console.warn("[build:neutralino] skip clipboard-prompt resources (missing)");
        return;
    }
    const destPrompt = path.join(destRoot, "resources", "clipboard-prompt");
    remove(destPrompt);
    copyDirectoryContents(srcPrompt, destPrompt);

    const jsSrc = path.join(ROOT, "resources", "js", "neutralino.js");
    if (fs.existsSync(jsSrc)) {
        const jsDestDir = path.join(destRoot, "resources", "js");
        ensureDir(jsDestDir);
        copyFile(jsSrc, path.join(jsDestDir, "neutralino.js"));
    }

    // Optional icons referenced by clipboard-prompt / filesystem tray fallbacks.
    for (const name of ["trayIcon.png", "appIcon.png", "appIcon.ico"]) {
        const iconSrc = path.join(ROOT, "resources", "icons", name);
        if (!fs.existsSync(iconSrc)) continue;
        const iconDestDir = path.join(destRoot, "resources", "icons");
        ensureDir(iconDestDir);
        copyFile(iconSrc, path.join(iconDestDir, name));
    }

    console.log(`[build:neutralino] staged unpacked resources/clipboard-prompt → ${destRoot}`);
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

    // Branding icons live under resources/icons/ (NOT resources/assets/ —
    // Vite emits JS/CSS/WASM into assets/). neu uses applicationIcon (PNG)
    // for Windows .exe; modes.window.icon for the window chrome; cli.icon (.ico).
    syncAppIcons();

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
 * Copy project branding into Neutralino resources/icons/.
 * Source of truth: apps/CWSP-reborn/assets/{icon.png,icon.ico}.
 * WHY: keep icons out of Vite `assets/` so rebuilds do not clobber branding.
 * ALSO: write trayIcon.png @ 32×32 — Windows GDI+ tray + docs prefer ~20–32px PNG.
 */
function syncAppIcons() {
    const iconsDir = path.join(RESOURCES_DIR, "icons");
    ensureDir(iconsDir);

    const mappings = [
        { src: path.join(ROOT, "assets", "icon.png"), dest: "appIcon.png" },
        { src: path.join(ROOT, "assets", "icon.ico"), dest: "appIcon.ico" }
    ];

    for (const { src, dest } of mappings) {
        const destPath = path.join(iconsDir, dest);
        if (fs.existsSync(src)) {
            copyFile(src, destPath);
            console.log(
                `[build:neutralino] icon ${path.relative(ROOT, src)} → icons/${dest}`
            );
            continue;
        }
        if (dest.endsWith(".png") && !fs.existsSync(destPath)) {
            // Minimal 1x1 PNG so missing branding does not block neu build.
            const png = Buffer.from(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
                "base64"
            );
            fs.writeFileSync(destPath, png);
            console.warn(
                `[build:neutralino] missing ${path.relative(ROOT, src)}; wrote placeholder icons/${dest}`
            );
        } else if (!fs.existsSync(src)) {
            console.warn(
                `[build:neutralino] missing icon source: ${path.relative(ROOT, src)}`
            );
        }
    }

    // WHY: Windows setTray uses GDI+ FromStream on resources::getFile bytes.
    // A 2048² PNG often yields a blank HICON; Neutralino docs recommend ~20×20.
    const trayDest = path.join(iconsDir, "trayIcon.png");
    const traySrc =
        fs.existsSync(path.join(iconsDir, "appIcon.png"))
            ? path.join(iconsDir, "appIcon.png")
            : path.join(ROOT, "assets", "icon.png");
    if (fs.existsSync(traySrc)) {
        try {
            // PNG32: GDI+ tray decode is unreliable on palette/indexed PNGs.
            const r = spawnSync(
                "convert",
                [traySrc, "-resize", "32x32", `PNG32:${trayDest}`],
                { encoding: "utf8" }
            );
            if (r.status === 0 && fs.existsSync(trayDest)) {
                console.log("[build:neutralino] icon trayIcon.png (32×32) ready");
            } else {
                copyFile(traySrc, trayDest);
                console.warn(
                    "[build:neutralino] convert trayIcon failed; copied full appIcon as trayIcon"
                );
            }
        } catch {
            copyFile(traySrc, trayDest);
        }
    }
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
        "portable-runtime.js",
        "bootstrap.cjs",
        "bootstrap.mjs",
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
    vendorExtNodeDeps(dest);
    console.log(`[build:neutralino] synced extNode → ${dest}`);
}

/**
 * Vendor deps required by extNode (NeutralinoExtension uses `ws`).
 * WHY: system Node on the desk has no project node_modules; without this,
 * require('ws') kills the extension immediately after spawn.
 */
function vendorExtNodeDeps(extNodeDir) {
    const deps = ["ws"];
    const searchRoots = [
        path.join(ROOT, "node_modules"),
        path.join(ROOT, "..", "..", "node_modules")
    ];
    const destRoot = path.join(extNodeDir, "node_modules");
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
                `[build:neutralino] extNode dep ${dep} not found for vendoring`
            );
            continue;
        }
        const dest = path.join(destRoot, dep);
        remove(dest);
        ensureDir(path.dirname(dest));
        fs.cpSync(found, dest, { recursive: true, dereference: true });
        console.log(`[build:neutralino] vendored extNode/${dep} → ${dest}`);
    }
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
process.env.CWSP_CLIENT_ID = process.env.CWSP_CLIENT_ID || "L-110";
process.env.CWSP_ALLOW_INSECURE_TLS = process.env.CWSP_ALLOW_INSECURE_TLS || "1";
process.env.CWSP_HUB_URL = process.env.CWSP_HUB_URL || "https://192.168.0.200:8434/";
process.env.CWSP_CLIPBOARD_HUB = process.env.CWSP_CLIPBOARD_HUB || "1";

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
    stdio: "inherit",
    windowsHide: true
});

function stopChild(signal = "SIGTERM") {
    if (!child || child.killed || !child.pid) return;
    try {
        if (process.platform === "win32") {
            spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
                stdio: "ignore",
                windowsHide: true
            });
        } else {
            child.kill(signal);
        }
    } catch {
        /* ignore */
    }
}

child.on("exit", (code, signal) => {
    if (signal) {
        try { process.kill(process.pid, signal); } catch { /* ignore */ }
    }
    process.exit(code ?? 1);
});

// WHY: when extNode taskkill/SIGTERM this launcher, also kill windows/index.ts.
process.on("SIGINT", () => { stopChild("SIGINT"); process.exit(0); });
process.on("SIGTERM", () => { stopChild("SIGTERM"); process.exit(0); });
process.on("exit", () => { stopChild("SIGTERM"); });
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
            // WHY: files-hub.ts uses zipSync/gzipSync for batch materialization.
            fflate: "^0.8.3",
            ws: "^8.21.0"
        }
    };
    fs.writeFileSync(
        path.join(backendNodeDir, "package.json"),
        JSON.stringify(pkg, null, 2) + "\n"
    );
}

/**
 * Install runtime deps into the packaged backend (canonical portable approach).
 * WHY: clipboardy pulls a deep nested tree; plain cpSync misses nested installs.
 */
function vendorNodeDeps(backendNodeDir) {
    writePackagedBackendPackageJson(backendNodeDir);
    console.log(`[build:neutralino] npm install in ${backendNodeDir}`);
    const result = spawnSync(
        commandName("npm"),
        ["install", "--omit=dev", "--no-fund", "--no-audit", "--no-package-lock"],
        {
            cwd: backendNodeDir,
            stdio: "inherit",
            env: { ...process.env, npm_config_fund: "false" },
            shell: process.platform === "win32"
        }
    );
    if (result.status !== 0) {
        console.warn(
            "[build:neutralino] npm install failed — falling back to workspace copy"
        );
        vendorNodeDepsFromWorkspace(backendNodeDir, ["clipboardy", "fflate", "ws"]);
        return;
    }
    // Remove .bin shims that often remain as absolute symlinks.
    remove(path.join(backendNodeDir, "node_modules", ".bin"));
}

/** Best-effort recursive copy from workspace node_modules (fallback). */
function vendorNodeDepsFromWorkspace(backendNodeDir, rootDeps = ["clipboardy", "fflate", "ws"]) {
    const searchRoots = [
        path.join(ROOT, "node_modules"),
        path.join(ROOT, "..", "..", "node_modules")
    ];
    const destRoot = path.join(backendNodeDir, "node_modules");
    const pending = [...rootDeps];
    const seen = new Set();

    function resolveInstalled(name) {
        for (const root of searchRoots) {
            const candidate = path.join(root, name);
            if (fs.existsSync(candidate)) return candidate;
        }
        return null;
    }

    while (pending.length) {
        const name = pending.shift();
        if (!name || seen.has(name)) continue;
        seen.add(name);
        const found = resolveInstalled(name);
        if (!found) {
            console.warn(`[build:neutralino] dep ${name} not found for vendoring`);
            continue;
        }
        const dest = path.join(destRoot, name);
        remove(dest);
        ensureDir(path.dirname(dest));
        fs.cpSync(found, dest, { recursive: true, dereference: true });
        remove(path.join(dest, "node_modules", ".bin"));
        remove(path.join(dest, ".bin"));
        console.log(`[build:neutralino] vendored ${name} → ${dest}`);
        try {
            const pkg = JSON.parse(
                fs.readFileSync(path.join(found, "package.json"), "utf8")
            );
            for (const depName of Object.keys(pkg.dependencies || {})) {
                if (!seen.has(depName)) pending.push(depName);
            }
        } catch {
            /* ignore */
        }
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

    // WHY: toast PS1 must travel with backend when host `resources/` is slimmed away.
    const toastSrc = path.join(ROOT, "resources", "clipboard-prompt", "prompt-toast.ps1");
    if (fs.existsSync(toastSrc)) {
        const toastDestDir = path.join(backendNodeDir, "resources", "clipboard-prompt");
        ensureDir(toastDestDir);
        copyFile(toastSrc, path.join(toastDestDir, "prompt-toast.ps1"));
    }

    fs.writeFileSync(
        path.join(packageRoot, "backend", "README.md"),
        [
            "# CWSP Neutralino Node backend",
            "",
            "Shipped inside a sibling `.tar.gz` (with `extensions/` + loose `resources/`).",
            "`bootstrap.mjs` unpacks under `%TEMP%/cwsp-neutralino/` and runs",
            "`backend/node/run-backend.mjs` from there. Durable settings stay in",
            "`<exeDir>/.config/portable.config.json`.",
            "Main UI is in `resources.neu` beside the `.exe` (not this archive).",
            "",
            "## Manual (dev / unpacked)",
            "",
            "```bash",
            "node backend/node/run-backend.mjs",
            "```",
            "",
            "If clipboardy/fflate/ws are missing:",
            "",
            "```bash",
            "cd backend/node && npm install",
            "```",
            ""
        ].join("\n")
    );

    console.log(`[build:neutralino] packaged Node backend → ${backendNodeDir}`);
    return backendNodeDir;
}

/**
 * Durable settings directory beside the Neutralino .exe (not wiped by TEMP unpack).
 */
function ensureConfigDir(packageRoot) {
    const configDir = path.join(packageRoot, ".config");
    ensureDir(configDir);
    const dest = path.join(configDir, "portable.config.json");
    if (fs.existsSync(dest)) return dest;

    const legacy = [
        path.join(packageRoot, "portable.config.json"),
        path.join(packageRoot, "backend", "node", "portable.config.json")
    ];
    for (const src of legacy) {
        if (!fs.existsSync(src)) continue;
        copyFile(src, dest);
        console.log(`[build:neutralino] migrated config → ${dest}`);
        return dest;
    }

    // Minimal seed so first launch has a writable SoT.
    fs.writeFileSync(
        dest,
        `${JSON.stringify(
            {
                core: {
                    mode: "endpoint",
                    endpointUrl: "https://192.168.0.200:8434/"
                },
                shell: {
                    clientId: "L-110",
                    clipboardBroadcastTargets: "L-196,L-210"
                }
            },
            null,
            2
        )}\n`,
        "utf8"
    );
    console.log(`[build:neutralino] seeded ${dest}`);
    return dest;
}

/**
 * Resolve archive basename from the Neutralino exe in packageRoot
 * (e.g. cwsp-neutralino-win_x64.exe → cwsp-neutralino-win_x64.tar.gz).
 */
function resolveBackendArchiveBase(packageRoot) {
    try {
        const entries = fs.readdirSync(packageRoot);
        // Prefer the Windows portable exe name so archive matches findRuntimeArchive().
        const winExe =
            entries.find((n) => /cwsp-neutralino.*win_x64\.exe$/i.test(n)) ||
            entries.find((n) => /win_x64\.exe$/i.test(n)) ||
            entries.find((n) => /^cwsp-neutralino.*\.exe$/i.test(n)) ||
            entries.find((n) => /\.exe$/i.test(n) && /neutralino/i.test(n));
        if (winExe) return winExe.replace(/\.exe$/i, "");
        const linuxBin = entries.find(
            (n) =>
                /^cwsp-neutralino/i.test(n) &&
                !/\./.test(n) &&
                !/\.tar\.gz$/i.test(n)
        );
        if (linuxBin) return linuxBin;
    } catch {
        /* ignore */
    }
    return "cwsp-neutralino-win_x64";
}

/** Host-side files that must remain beside the .exe after portable slim. */
const EXTNODE_HOST_STUB_FILES = [
    "run.cmd",
    "run",
    "bootstrap.cjs",
    "bootstrap.mjs",
    "portable-runtime.js"
];

/**
 * After archiving, leave only the thin extNode stub under extensions/node/.
 * WHY: Neutralino must spawn `${NL_PATH}/extensions/node/run.cmd` at bootstrap,
 * but the full bridge (main.js + ws) lives in the sibling .tar.gz.
 */
function slimHostExtNode(packageRoot) {
    const extNode = path.join(packageRoot, "extensions", "node");
    if (!fs.existsSync(extNode)) {
        console.warn(`[build:neutralino] slim skip — missing ${extNode}`);
        return;
    }
    const keep = new Set(EXTNODE_HOST_STUB_FILES);
    for (const name of fs.readdirSync(extNode)) {
        if (keep.has(name)) continue;
        // Keep empty _runtime placeholder for install.cmd targets.
        if (name === "_runtime") continue;
        remove(path.join(extNode, name));
    }
    ensureDir(path.join(extNode, "_runtime"));
    // Ensure stub files are present (source of truth = NODE_EXT_SRC).
    for (const name of EXTNODE_HOST_STUB_FILES) {
        const src = path.join(NODE_EXT_SRC, name);
        if (fs.existsSync(src)) {
            copyFile(src, path.join(extNode, name));
            try {
                if (name === "run") fs.chmodSync(path.join(extNode, name), 0o755);
            } catch {
                /* ignore */
            }
        }
    }
    console.log(
        `[build:neutralino] slimmed host extensions/node → stub (${EXTNODE_HOST_STUB_FILES.join(", ")})`
    );
}

/**
 * Archive `backend/` + `extensions/` + loose `resources/` as sibling `.tar.gz`,
 * then slim host trees so the portable folder stays compact.
 *
 * WHY: desk packages ship exe + resources.neu + tar.gz + .config; bootstrap unpacks
 * code assets to %TEMP%. UI shell stays in resources.neu (already bundled by neu).
 * Loose resources/ (toast PS1) cannot be consumed from resources.neu by Node — pack
 * it in the archive. See https://neutralino.js.org/docs/api/resources/
 */
function archiveNodeBackend(packageRoot, opts = {}) {
    const keepUnpacked =
        opts.keepUnpacked === true ||
        process.env.CWSP_KEEP_BACKEND_UNPACKED === "1";
    const keepExtUnpacked =
        opts.keepExtUnpacked === true ||
        process.env.CWSP_KEEP_EXTENSIONS_UNPACKED === "1";
    const keepResourcesUnpacked =
        opts.keepResourcesUnpacked === true ||
        process.env.CWSP_KEEP_RESOURCES_UNPACKED === "1";
    const backendDir = path.join(packageRoot, "backend");
    const extensionsDir = path.join(packageRoot, "extensions");
    const resourcesDir = path.join(packageRoot, "resources");
    const runBackend = path.join(backendDir, "node", "run-backend.mjs");
    const extMain = path.join(extensionsDir, "node", "main.js");
    if (!fs.existsSync(runBackend)) {
        console.warn(
            `[build:neutralino] skip archive — missing ${runBackend}`
        );
        return null;
    }
    if (!fs.existsSync(extMain)) {
        console.warn(
            `[build:neutralino] skip archive — missing ${extMain} (sync extNode first)`
        );
        return null;
    }

    ensureConfigDir(packageRoot);
    // Ensure toast/icons exist under package resources/ before archiving.
    stageClipboardPromptResources(packageRoot);

    const base = resolveBackendArchiveBase(packageRoot);
    const archivePath = path.join(packageRoot, `${base}.tar.gz`);
    // Drop stale archives with other names in the same folder.
    try {
        for (const name of fs.readdirSync(packageRoot)) {
            if (!/\.tar\.gz$/i.test(name)) continue;
            const full = path.join(packageRoot, name);
            if (path.resolve(full) === path.resolve(archivePath)) continue;
            if (/cwsp-neutralino|backend/i.test(name)) remove(full);
        }
    } catch {
        /* ignore */
    }

    const tarParts = ["backend", "extensions"];
    if (fs.existsSync(resourcesDir)) tarParts.push("resources");
    const tarArgs = ["-czf", archivePath, ...tarParts];
    console.log(
        `[build:neutralino] archiving ${tarParts.join("+")} → ${archivePath}`
    );
    const result = spawnSync("tar", tarArgs, {
        cwd: packageRoot,
        encoding: "utf8"
    });
    if (result.status !== 0) {
        console.error(
            `[build:neutralino] tar failed: ${result.stderr || result.stdout || result.status}`
        );
        return null;
    }

    if (!keepUnpacked) {
        remove(backendDir);
        console.log(
            `[build:neutralino] removed unpacked backend/ (runtime unpacks from .tar.gz)`
        );
    } else {
        console.log(
            `[build:neutralino] kept unpacked backend/ (CWSP_KEEP_BACKEND_UNPACKED=1)`
        );
    }

    if (!keepExtUnpacked && !keepUnpacked) {
        slimHostExtNode(packageRoot);
    } else if (keepExtUnpacked || keepUnpacked) {
        console.log(
            `[build:neutralino] kept full extensions/ (CWSP_KEEP_EXTENSIONS_UNPACKED / KEEP_BACKEND_UNPACKED)`
        );
    }

    // WHY: UI is already in resources.neu; loose resources/ is toast-only → TEMP via tar.
    if (!keepResourcesUnpacked && !keepUnpacked && fs.existsSync(resourcesDir)) {
        remove(resourcesDir);
        console.log(
            `[build:neutralino] removed unpacked resources/ (toast assets in .tar.gz; UI in resources.neu)`
        );
    } else if (keepResourcesUnpacked || keepUnpacked) {
        console.log(
            `[build:neutralino] kept unpacked resources/ (CWSP_KEEP_RESOURCES_UNPACKED / KEEP_BACKEND_UNPACKED)`
        );
    }
    return archivePath;
}

/** Package backend + emit portable .tar.gz / .config beside the exe. */
function packageNodeBackendPortable(packageRoot, opts = {}) {
    packageNodeBackend(packageRoot);
    // Ensure latest stub + full extNode tree before archiving.
    syncExtNodeIntoPackage(packageRoot);
    return archiveNodeBackend(packageRoot, opts);
}

/**
 * Copy full extNode tree into packageRoot/extensions/node (pre-archive).
 */
function syncExtNodeIntoPackage(packageRoot) {
    const dest = path.join(packageRoot, "extensions", "node");
    ensureDir(dest);
    for (const name of [
        "main.js",
        "cwsp-bridge.js",
        "neutralino-extension.js",
        "portable-runtime.js",
        "bootstrap.cjs",
        "bootstrap.mjs",
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
    ensureDir(path.join(dest, "_runtime"));
    vendorExtNodeDeps(dest);
    console.log(`[build:neutralino] synced full extNode → ${dest}`);
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
    for (const name of [
        "cwsp-bridge.js",
        "neutralino-extension.js",
        "neutralino-extension.cjs",
        "run.cmd",
        "run"
    ]) {
        const src = path.join(path.dirname(srcMain), name);
        if (!fs.existsSync(src)) continue;
        copyFile(src, path.join(path.dirname(destMain), name));
    }
    vendorExtNodeDeps(path.dirname(destMain));
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
        packageNodeBackendPortable(dir);
        // WHY: refresh README for portable tar.gz + .config layout (backend-only skips full stage).
        const plat =
            /linux/i.test(dir) || /linux/i.test(path.basename(dir))
                ? "linux"
                : "windows";
        writeStageHelpers(dir, plat);
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

/** Inject Neutralino client script + init into the Vite-built index.html. */
function injectClientScriptTag() {
    const htmlPath = path.join(RESOURCES_DIR, "index.html");
    if (!fs.existsSync(htmlPath)) {
        throw new Error(`Missing resources/index.html (run web build first): ${htmlPath}`);
    }

    let html = fs.readFileSync(htmlPath, "utf8");

    // WHY: Vite emits crossorigin on module/script/link tags. Neutralino's resource
    // protocol does not send CORS headers → modules fail to load → blank WebView.
    html = html.replace(/\s+crossorigin(?:="[^"]*")?/gi, "");
    // WHY: modulepreload hints also fail under some Neutralino/WebView2 resource loads;
    // the main type=module script still pulls the graph.
    html = html.replace(/\s*<link[^>]*rel=["']modulepreload["'][^>]*>\s*/gi, "\n");

    // WHY: classic (non-module) inline runs even when type=module MIME/CORS fails.
    // If Inspect has zero logs, this still paints a visible boot line → proves HTML+JS.
    const earlySmoke = [
        "    <script>",
        "      (function () {",
        "        try {",
        "          window.__CWS_BOOT_SMOKE__ = Date.now();",
        "          console.log('[cwsp-neutralino] inline-smoke ok', location.href, 'NL_PORT=' + (typeof NL_PORT !== 'undefined' ? NL_PORT : '?'));",
        "          window.addEventListener('error', function (ev) {",
        "            try {",
        "              console.error('[cwsp-neutralino] window.error', ev && (ev.message || ev.error));",
        "              var el = document.getElementById('cwsp-boot-fallback');",
        "              if (el) el.innerHTML = 'CWSP boot error: ' + String((ev && ev.message) || 'unknown');",
        "            } catch (_) {}",
        "          });",
        "          window.addEventListener('unhandledrejection', function (ev) {",
        "            try { console.error('[cwsp-neutralino] unhandledrejection', ev && ev.reason); } catch (_) {}",
        "          });",
        "        } catch (e) {",
        "          try { document.title = 'CWSP smoke fail'; } catch (_) {}",
        "        }",
        "      })();",
        "    </script>",
        ""
    ].join("\n");

    const initBlock = [
        '    <script src="./js/neutralino.js"></script>',
        "    <script>",
        "      (function () {",
        "        // WHY: Settings overlay needs __WEBNATIVE_AUTH__ before first loadSettings.",
        "        // Loopback defaults match extNode/backend (CWSP_CONTROL_PORT/KEY).",
        "        // INVARIANT: never use NL_PORT as control-RPC port (CWSP fleet uses 8434).",
        "        // WHY: Cursor.exe steals :19875/:19876 (ERR_EMPTY_RESPONSE). Control lives on 29110.",
        "        var defaultAuth = { port: 29110, key: 'cwsp-neutralino-local' };",
        "        try {",
        "          window.__WEBNATIVE_AUTH__ = defaultAuth;",
        "          window.__NEUTRALINO_AUTH__ = defaultAuth;",
        "          window.__CWS_WEBNATIVE_BOOT__ = true;",
        "          window.__CWS_NEUTRALINO_BOOT__ = true;",
        "          window.__CWS_NODE_CLIPBOARD_HUB__ = true;",
        "        } catch (_) {}",
        "        function applyAuth(auth) {",
        "          if (!auth || typeof auth.port !== 'number') return;",
        "          if (auth.port === 8434 || auth.port < 1024) return;",
        "          window.__WEBNATIVE_AUTH__ = { port: auth.port, key: auth.key || defaultAuth.key };",
        "          window.__NEUTRALINO_AUTH__ = window.__WEBNATIVE_AUTH__;",
        "        }",
        "        async function refreshAuthFromDisk() {",
        "          try {",
        "            if (!window.Neutralino || !Neutralino.filesystem || !window.NL_PATH) return;",
        "            var raw = await Neutralino.filesystem.readFile(NL_PATH + '/.tmp/cwsp-control-auth.json');",
        "            applyAuth(JSON.parse(raw));",
        "          } catch (_) {}",
        "        }",
        "        function markSmoke(msg) {",
        "          try {",
        "            var el = document.getElementById('cwsp-boot-fallback');",
        "            if (el) {",
        "              var line = el.querySelector('[data-cwsp-smoke]');",
        "              if (!line) {",
        "                line = document.createElement('div');",
        "                line.setAttribute('data-cwsp-smoke', '1');",
        "                line.style.cssText = 'opacity:.85;margin-top:8px;font-size:12px';",
        "                el.appendChild(line);",
        "              }",
        "              line.textContent = msg;",
        "            }",
        "            console.log('[cwsp-neutralino]', msg);",
        "          } catch (_) {}",
        "        }",
        "        // WHY: tray must run AFTER Neutralino.init. Early inline checks see",
        "        // Neutralino===undefined and silently skip. Close→hide needs",
        "        // modes.window.exitProcessOnClose=false in neutralino.config.json.",
        "        // WHY: Windows iconic-minimize parks HWND at ~(-18000,-18000).",
        "        // show()+focus() alone leaves the main window 'invisible' until unminimize.",
        "        function ensureMainWindowVisible(opts) {",
        "          var wantFocus = !opts || opts.focus !== false;",
        "          return Promise.resolve()",
        "            .then(function () {",
        "              if (Neutralino.window && typeof Neutralino.window.unminimize === 'function') {",
        "                return Neutralino.window.unminimize();",
        "              }",
        "            })",
        "            .catch(function () {})",
        "            .then(function () { return Neutralino.window.show(); })",
        "            .then(function () {",
        "              if (!Neutralino.window.getPosition || !Neutralino.window.getSize) return;",
        "              return Promise.all([",
        "                Neutralino.window.getPosition(),",
        "                Neutralino.window.getSize()",
        "              ]).then(function (pair) {",
        "                var pos = pair[0] || {};",
        "                var size = pair[1] || {};",
        "                var x = Number(pos.x);",
        "                var y = Number(pos.y);",
        "                var w = Number(size.width);",
        "                var h = Number(size.height);",
        "                var off =",
        "                  !Number.isFinite(x) || !Number.isFinite(y) ||",
        "                  x < -8000 || y < -8000 || x > 50000 || y > 50000 ||",
        "                  !Number.isFinite(w) || w < 200 || !Number.isFinite(h) || h < 200;",
        "                if (!off) return;",
        "                markSmoke('window geometry rescue x=' + x + ' y=' + y + ' w=' + w + ' h=' + h);",
        "                return Promise.resolve()",
        "                  .then(function () {",
        "                    if (typeof Neutralino.window.setSize === 'function') {",
        "                      return Neutralino.window.setSize({ width: 960, height: 640 });",
        "                    }",
        "                  })",
        "                  .then(function () {",
        "                    if (typeof Neutralino.window.center === 'function') {",
        "                      return Neutralino.window.center();",
        "                    }",
        "                  });",
        "              });",
        "            })",
        "            .then(function () {",
        "              if (wantFocus && Neutralino.window && typeof Neutralino.window.focus === 'function') {",
        "                return Neutralino.window.focus();",
        "              }",
        "            });",
        "        }",
        "        // WHY: exitProcessOnClose=false → Close only works via windowClose→hide.",
        "        // After sleep/idle the client WS can die (serverOffline): chrome + tray go dead.",
        "        // Windows explorer restart also drops tray (#1492) — must re-setTray.",
        "        function trayIconCandidates() {",
        "          // WHY (Windows): setTray loads via resources::getFile(iconPath) + GDI+.",
        "          // Absolute NL_PATH/… paths miss slim packages (no loose resources/) → blank tray slot.",
        "          // Prefer neu resource paths; keep filesystem paths only as last-resort fallbacks.",
        "          var list = [",
        "            '/resources/icons/trayIcon.png',",
        "            '/resources/icons/appIcon.png',",
        "            '/resources/icons/appIcon.ico'",
        "          ];",
        "          if (window.CWSP_ICON) list.push(window.CWSP_ICON);",
        "          try {",
        "            if (typeof NL_PATH === 'string' && NL_PATH) {",
        "              var base = NL_PATH.replace(/\\\\/g, '/');",
        "              list.push(base + '/resources/icons/trayIcon.png');",
        "              list.push(base + '/resources/icons/appIcon.png');",
        "              list.push(base + '/resources/icons/appIcon.ico');",
        "            }",
        "          } catch (_) {}",
        "          var uniq = [];",
        "          list.forEach(function (p) { if (p && uniq.indexOf(p) < 0) uniq.push(p); });",
        "          return uniq;",
        "        }",
        "        function trayIconPath() {",
        "          return trayIconCandidates()[0] || '/resources/icons/trayIcon.png';",
        "        }",
        "        function bindWindowChromeOnce() {",
        "          if (window.__CWS_WINDOW_CHROME_BOUND__) return;",
        "          if (!window.Neutralino || !Neutralino.events || typeof Neutralino.events.on !== 'function') return;",
        "          window.__CWS_WINDOW_CHROME_BOUND__ = true;",
        "          Neutralino.events.on('windowClose', function () {",
        "            // Hide to tray instead of exiting (backend/extNode keep running).",
        "            Promise.resolve()",
        "              .then(function () { return installTray(true); })",
        "              .catch(function () {})",
        "              .then(function () { return Neutralino.window.hide(); })",
        "              .catch(function (error) {",
        "                console.error('[cwsp-neutralino] window.hide failed', error);",
        "                // WHY: if hide fails (bridge dead), force exit so Close is never a brick.",
        "                try { Neutralino.app.exit(); } catch (_) {}",
        "              });",
        "          });",
        "          Neutralino.events.on('trayMenuItemClicked', function (ev) {",
        "            var id = ev && ev.detail && ev.detail.id;",
        "            if (id === 'SHOW') {",
        "              Promise.resolve()",
        "                .then(function () {",
        "                  if (Neutralino.extensions && typeof Neutralino.extensions.dispatch === 'function') {",
        "                    return Neutralino.extensions.dispatch('extNode', 'runNode', {",
        "                      function: 'backend.ensure',",
        "                      parameter: null",
        "                    });",
        "                  }",
        "                })",
        "                .catch(function () {})",
        "                .then(function () { return ensureMainWindowVisible({ focus: true }); })",
        "                .catch(function (error) {",
        "                  console.error('[cwsp-neutralino] window.show failed', error);",
        "                });",
        "            } else if (id === 'QUIT') {",
        "              Promise.resolve()",
        "                .then(function () {",
        "                  if (Neutralino.extensions && typeof Neutralino.extensions.dispatch === 'function') {",
        "                    return Neutralino.extensions.dispatch('extNode', 'runNode', {",
        "                      function: 'backend.stop',",
        "                      parameter: null",
        "                    });",
        "                  }",
        "                })",
        "                .catch(function () {})",
        "                .then(function () {",
        "                  return new Promise(function (resolve) { setTimeout(resolve, 200); });",
        "                })",
        "                .then(function () { return Neutralino.app.exit(); })",
        "                .catch(function (error) {",
        "                  console.error('[cwsp-neutralino] quit failed', error);",
        "                  try { Neutralino.app.exit(); } catch (_) {}",
        "                });",
        "            }",
        "          });",
        "          Neutralino.events.on('serverOffline', function () {",
        "            markSmoke('serverOffline — reloading UI to restore window chrome/tray');",
        "            window.__CWS_TRAY_READY__ = false;",
        "            if (window.__CWS_SERVER_OFFLINE_RELOAD__) return;",
        "            window.__CWS_SERVER_OFFLINE_RELOAD__ = true;",
        "            setTimeout(function () {",
        "              try { location.reload(); } catch (_) {}",
        "            }, 400);",
        "          });",
        "          Neutralino.events.on('clientConnect', function () {",
        "            markSmoke('clientConnect — reinstall tray');",
        "            installTray(true);",
        "          });",
        "          Neutralino.events.on('clientDisconnect', function () {",
        "            window.__CWS_TRAY_READY__ = false;",
        "            markSmoke('clientDisconnect');",
        "          });",
        "        }",
        "        function installTray(force) {",
        "          if (!force && window.__CWS_TRAY_READY__) return Promise.resolve();",
        "          if (!window.Neutralino || !Neutralino.os || typeof Neutralino.os.setTray !== 'function') {",
        "            markSmoke('tray: Neutralino.os.setTray unavailable');",
        "            return Promise.resolve();",
        "          }",
        "          bindWindowChromeOnce();",
        "          var uniq = trayIconCandidates();",
        "          function trySet(i) {",
        "            if (i >= uniq.length) {",
        "              window.__CWS_TRAY_READY__ = false;",
        "              markSmoke('tray failed: all icon paths');",
        "              return Promise.resolve();",
        "            }",
        "            return Neutralino.os.setTray({",
        "              icon: uniq[i],",
        "              menuItems: [",
        "                { id: 'SHOW', text: 'Show CWSP' },",
        "                { id: 'SEP', text: '-' },",
        "                { id: 'QUIT', text: 'Quit CWSP' }",
        "              ]",
        "            }).then(function () {",
        "              window.__CWS_TRAY_READY__ = true;",
        "              markSmoke('tray ready (' + uniq[i] + ')');",
        "            }).catch(function (error) {",
        "              console.error('[cwsp-neutralino] setTray failed', uniq[i], error);",
        "              return trySet(i + 1);",
        "            });",
        "          }",
        "          return trySet(0);",
        "        }",
        "        function healWindowChrome(reason) {",
        "          // WHY: probe native bridge; if dead, reload. Else re-setTray (explorer/sleep).",
        "          if (!window.Neutralino || !Neutralino.window) return;",
        "          var probe =",
        "            typeof Neutralino.window.isVisible === 'function'",
        "              ? Neutralino.window.isVisible()",
        "              : typeof Neutralino.window.getTitle === 'function'",
        "                ? Neutralino.window.getTitle()",
        "                : Promise.resolve(true);",
        "          Promise.resolve(probe)",
        "            .then(function () { return installTray(true); })",
        "            .catch(function (error) {",
        "              markSmoke('chrome heal fail (' + reason + '): ' + String(error && error.message || error));",
        "              if (!window.__CWS_SERVER_OFFLINE_RELOAD__) {",
        "                window.__CWS_SERVER_OFFLINE_RELOAD__ = true;",
        "                setTimeout(function () { try { location.reload(); } catch (_) {} }, 300);",
        "              }",
        "            });",
        "        }",
        "        function installChromeLongevity() {",
        "          if (window.__CWS_CHROME_LONGEVITY__) return;",
        "          window.__CWS_CHROME_LONGEVITY__ = true;",
        "          document.addEventListener('visibilitychange', function () {",
        "            if (document.visibilityState === 'visible') healWindowChrome('visible');",
        "          });",
        "          window.addEventListener('pageshow', function () { healWindowChrome('pageshow'); });",
        "          window.addEventListener('focus', function () { healWindowChrome('focus'); });",
        "          // WHY: explorer.exe restart drops tray (#1492); periodic re-setTray is the JS-side fix.",
        "          setInterval(function () { installTray(true); }, 60000);",
        "        }",
        "        document.addEventListener('DOMContentLoaded', function () {",
        "          markSmoke('DOM ready; Neutralino=' + (!!window.Neutralino) + ' NL_PORT=' + (typeof NL_PORT !== 'undefined' ? NL_PORT : '?'));",
        "          try {",
        "            if (!window.Neutralino || typeof Neutralino.init !== 'function') {",
        "              markSmoke('neutralino.js missing or Neutralino.init unavailable');",
        "              return;",
        "            }",
        "            // COMPAT: some Neutralino client builds return void, not a Promise.",
        "            Promise.resolve(Neutralino.init()).then(function () {",
        "              markSmoke('Neutralino.init ok');",
        "              bindWindowChromeOnce();",
        "              installChromeLongevity();",
        "              return installTray(true);",
        "            }).then(function () {",
        "              // WHY: rescued minimized/off-screen geometry without relying on useSavedState.",
        "              return ensureMainWindowVisible({ focus: false }).catch(function () {});",
        "            }).then(function () {",
        "              return refreshAuthFromDisk();",
        "            }).catch(function (error) {",
        "              console.error('[cwsp-neutralino] Neutralino.init failed', error);",
        "              markSmoke('Neutralino.init failed: ' + String(error && error.message || error));",
        "            });",
        "          } catch (error) {",
        "            console.error('[cwsp-neutralino] Neutralino.init threw', error);",
        "            markSmoke('Neutralino.init threw: ' + String(error && error.message || error));",
        "          }",
        "        });",
        "      })();",
        "    </script>",
        ""
    ].join("\n");

    const bootFallback = [
        '    <div id="cwsp-boot-fallback" style="font:14px/1.4 system-ui,sans-serif;padding:24px;color:#e8e8ea;background:#121214;min-height:100vh;box-sizing:border-box">',
        "      CWSP Neutralino starting…",
        "      <div style=\"opacity:.7;margin-top:8px;font-size:12px\">If this stays forever, open DevTools (F12) and check module load errors.</div>",
        "    </div>",
        ""
    ].join("\n");

    // Replace any prior Neutralino.js / init / smoke injection so rebuilds stay idempotent.
    html = html.replace(
        /\s*<script>\s*\(function \(\) \{\s*try \{\s*window\.__CWS_BOOT_SMOKE__[\s\S]*?<\/script>\s*/i,
        "\n"
    );
    html = html.replace(
        /\s*<script[^>]*neutralino\.js[^>]*><\/script>\s*(?:<script>[\s\S]*?(?:Neutralino\.init|__WEBNATIVE_AUTH__)[\s\S]*?<\/script>\s*)?/i,
        "\n"
    );
    html = html.replace(/\s*<div id="cwsp-boot-fallback"[\s\S]*?<\/div>\s*/i, "\n");

    // Early smoke first in <head> (before module scripts).
    if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${earlySmoke}`);
    } else {
        html = earlySmoke + html;
    }

    if (/<\/head>/i.test(html)) {
        html = html.replace(/<\/head>/i, `${initBlock}</head>`);
    } else if (/<body[^>]*>/i.test(html)) {
        html = html.replace(/<body[^>]*>/i, (m) => `${m}\n${initBlock}`);
    } else {
        html = initBlock + html;
    }

    if (/<body[^>]*>/i.test(html)) {
        html = html.replace(/<body[^>]*>/i, (m) => `${m}\n${bootFallback}`);
    } else {
        html += bootFallback;
    }

    // WHY: move the Vite entry module to end of <body> so classic smoke/init run first
    // and a failed module does not block DOM paint of the fallback banner.
    const moduleTagMatch = html.match(
        /<script\s+type=["']module["'][^>]*src=["'][^"']+["'][^>]*>\s*<\/script>/i
    );
    if (moduleTagMatch && /<\/body>/i.test(html)) {
        html = html.replace(moduleTagMatch[0], "");
        html = html.replace(/<\/body>/i, `    ${moduleTagMatch[0]}\n  </body>`);
    }

    fs.writeFileSync(htmlPath, html);
    console.log(
        "[build:neutralino] injected smoke+neutralino.js+boot fallback; stripped crossorigin from index.html"
    );
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
    // WHY: root neutralino.config.json was a symlink; neu stored {"link":...} in
    // resources.neu and the Windows exe crashed at startup (0xc0000409 / BEX64).
    materializeNeutralinoConfigForPack();
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
    packageNodeBackendPortable(binDir);

    // Independent popup process config (no extensions) — hub spawns the same binary with this file.
    const promptCfgSrc = path.join(ROOT, "clipboard-prompt.config.json");
    if (fs.existsSync(promptCfgSrc)) {
        fs.copyFileSync(promptCfgSrc, path.join(binDir, "clipboard-prompt.config.json"));
        console.log("[build:neutralino] staged clipboard-prompt.config.json");
    }
    // Toast/icons go into the portable .tar.gz via packageNodeBackendPortable (above).
    // resources.neu already holds the main UI bundle from `neu build`.

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
    // Refresh portable archive (.tar.gz = backend + extensions + loose resources) + .config.
    // INVARIANT: do not re-stage unpacked resources/ afterward — toast lives in the archive.
    packageNodeBackendPortable(stageRoot);
    const promptCfg = path.join(ROOT, "clipboard-prompt.config.json");
    if (fs.existsSync(promptCfg) && !fs.existsSync(path.join(stageRoot, "clipboard-prompt.config.json"))) {
        copyFile(promptCfg, path.join(stageRoot, "clipboard-prompt.config.json"));
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
                  "# CWSP Neutralino (portable)",
                  "",
                  "Contents:",
                  "- `cwsp-neutralino-win_x64.exe` — Neutralino shell",
                  "- `cwsp-neutralino-win_x64.tar.gz` — `backend/` + `extensions/` + loose `resources/` (toast)",
                  "- `.config/` — durable settings (`portable.config.json`)",
                  "- `resources.neu` — main UI bundle (already from `neu build`)",
                  "- `extensions/node/` — thin stub (`run.cmd`, `bootstrap.cjs`, `portable-runtime.js`)",
                  "",
                  "Run `run.cmd` or the `.exe`.",
                  "On launch, `bootstrap.cjs` unpacks the `.tar.gz` under `%TEMP%\\cwsp-neutralino\\`",
                  "and loads `main.js` in-process. Config stays in `.config\\`.",
                  "",
                  "Notes:",
                  "- UI is in `resources.neu` (not re-packed into the archive).",
                  "- Loose `resources/` (PowerShell toast) ships in `.tar.gz` — Node cannot read",
                  "  toast scripts from `resources.neu` via Neutralino.resources.",
                  "- Extensions stay out of `resources.neu` (spawned at bootstrap before extract API).",
                  "",
                  "Dev: `CWSP_KEEP_BACKEND_UNPACKED=1` / `CWSP_KEEP_EXTENSIONS_UNPACKED=1` /",
                  "`CWSP_KEEP_RESOURCES_UNPACKED=1` keep unpacked trees.",
                  ""
              ].join("\n")
            : [
                  "# CWSP Neutralino (portable)",
                  "",
                  "Contents:",
                  "- Neutralino binary",
                  "- sibling `.tar.gz` — `backend/` + `extensions/` + loose `resources/`",
                  "- `.config/` — durable settings",
                  "- `resources.neu` — main UI bundle",
                  "- `extensions/node/` — thin stub (`run`, `bootstrap.cjs`, `portable-runtime.js`)",
                  "",
                  "```bash",
                  "chmod +x ./<binary>",
                  "./<binary>",
                  "```",
                  "",
                  "bootstrap unpacks the `.tar.gz` under `$TMPDIR/cwsp-neutralino/`.",
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

    // Full multi-arch package beside web/ (already portable-packed in binDir).
    const appDir = path.join(BUILD_ROOT, "app");
    remove(appDir);
    ensureDir(appDir);
    copyDirectoryContents(binDir, appDir);
    const appHasTar = fs
        .readdirSync(appDir)
        .some((n) => /\.tar\.gz$/i.test(n));
    const appHasBackend = fs.existsSync(
        path.join(appDir, "backend", "node", "run-backend.mjs")
    );
    if (!appHasTar && !appHasBackend) {
        packageNodeBackendPortable(appDir);
    } else if (!appHasTar && appHasBackend) {
        archiveNodeBackend(appDir);
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

    // Independent clipboard-prompt process config (no extensions).
    const promptCfg = path.join(ROOT, "clipboard-prompt.config.json");
    if (fs.existsSync(promptCfg)) {
        copyFile(promptCfg, path.join(appDir, "clipboard-prompt.config.json"));
    }
    // Toast assets already inside sibling .tar.gz from packageNodeBackendPortable(binDir).

    if (platform === "windows" || platform === "linux") {
        const platDir = path.join(BUILD_ROOT, platform);
        remove(platDir);
        ensureDir(platDir);

        // WHY: packageNodeBackendPortable(binDir) already ran — copy the finished
        // portable layout. Do NOT re-archive before the platform binary is present
        // (that produced cwsp-neutralino-backend.tar.gz and skipped the exe-named tar).
        const wantedBin =
            platform === "windows"
                ? [/win_x64\.exe$/i, /win.*\.exe$/i]
                : [/_linux_x64$/i, /linux_x64$/i];
        for (const entry of fs.readdirSync(binDir)) {
            if (wantedBin.some((re) => re.test(entry))) {
                copyFile(path.join(binDir, entry), path.join(platDir, entry));
            }
            // Sibling portable archives + helpers next to the exe.
            if (/\.tar\.gz$/i.test(entry) && /cwsp-neutralino|neutralino/i.test(entry)) {
                copyFile(path.join(binDir, entry), path.join(platDir, entry));
            }
        }
        for (const name of [
            "resources.neu",
            "extensions",
            "backend",
            ".config",
            "clipboard-prompt.config.json",
            "README.md",
            "run.cmd",
            "run.sh"
        ]) {
            const src = path.join(binDir, name);
            if (!fs.existsSync(src)) {
                if (name === "clipboard-prompt.config.json" && fs.existsSync(promptCfg)) {
                    copyFile(promptCfg, path.join(platDir, name));
                }
                continue;
            }
            const dest = path.join(platDir, name);
            if (fs.statSync(src).isDirectory()) {
                copyDirectoryContents(src, dest);
            } else {
                copyFile(src, dest);
            }
        }

        // Rebuild portable archive only when neither unpacked backend nor sibling tar exists.
        const hasTar = fs
            .readdirSync(platDir)
            .some((n) => /\.tar\.gz$/i.test(n) && /cwsp-neutralino|neutralino/i.test(n));
        const hasBackend = fs.existsSync(
            path.join(platDir, "backend", "node", "run-backend.mjs")
        );
        if (!hasTar && !hasBackend) {
            packageNodeBackendPortable(platDir);
        } else if (!hasTar && hasBackend) {
            // Unpacked backend without archive — pack now (exe already copied).
            archiveNodeBackend(platDir);
        } else {
            // Ensure host stub matches NODE_EXT_SRC (bootstrap.cjs, run.cmd, …).
            slimHostExtNode(platDir);
        }

        // INVARIANT: do not re-stage loose resources/ here — toast is inside .tar.gz;
        // resources.neu already holds the UI. stageClipboardPromptResources would
        // leave an unpacked resources/ tree beside a slim package.

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

function remoteSync({ user, host, dir, stageRoot, dryRun, windowsRemote = false }) {
    const useWindowsPaths = windowsRemote || isWindowsStylePath(dir);
    const rsyncDir = useWindowsPaths ? toMsysRsyncPath(dir) : normalizeSlashPath(dir);
    const scpDir = useWindowsPaths ? toWindowsSlashPath(dir) : normalizeSlashPath(dir);
    const sshTarget = `${user}@${host}`;

    if (hasCommand("rsync")) {
        const remote = `${user}@${host}:${rsyncDir}`;
        const args = ["-az", "--delete"];
        const probe = spawnSync("rsync", ["--help"], { encoding: "utf8" });
        const help = `${probe.stdout || ""}${probe.stderr || ""}`;
        if (/--mkpath/.test(help)) args.push("--mkpath");
        args.push(`${stageRoot}${path.sep}`, `${remote}/`);
        if (dryRun) {
            console.log(
                `[deploy] dry-run rsync ${args.map(quote).join(" ")}`
            );
            return;
        }
        // Best-effort mkdir (PowerShell or MSYS) before sync.
        if (useWindowsPaths) {
            const winPath = toWindowsSlashPath(dir);
            const msysPath = toMsysRsyncPath(dir);
            const mkCmd = `powershell -NoProfile -Command "New-Item -ItemType Directory -Force -Path '${winPath.replace(/'/g, "''")}' | Out-Null" 2>nul || mkdir -p '${msysPath}'`;
            try {
                run("ssh", [sshTarget, mkCmd]);
            } catch {
                console.warn("[deploy] remote mkdir failed (continuing)");
            }
        }
        run("rsync", args);
        return;
    }

    const remote = `${user}@${host}:${scpDir}`;
    const mkdirCommand = useWindowsPaths
        ? `powershell -NoProfile -Command "New-Item -ItemType Directory -Force -Path '${scpDir.replace(/'/g, "''")}' | Out-Null"`
        : ["mkdir", "-p", shellQuote(scpDir)].join(" ");

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
        dryRun: args.dryRun,
        windowsRemote: Boolean(spec.windowsRemote)
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
