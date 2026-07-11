/*
 * Build and deploy Neutralinojs application.
 *
 * Usage:
 *   node scripts/build-neutralino.mjs
 *   node scripts/build-neutralino.mjs --release
 *   node scripts/build-neutralino.mjs --web-only
 *   node scripts/build-neutralino.mjs --skip-web
 *   node scripts/build-neutralino.mjs --update
 *   node scripts/build-neutralino.mjs --clean
 *
 * Deploy:
 *   node scripts/build-neutralino.mjs --target 110
 *   node scripts/build-neutralino.mjs --release --target 110
 *   node scripts/build-neutralino.mjs --target 200 --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
    APP_ROOT,
    targetSpec
} from "./lib/runtime-env.mjs";


const ROOT = path.resolve(APP_ROOT);

const CONFIG_FILE = path.join(ROOT, "neutralino.config.json");
const BUILD_ROOT = path.join(ROOT, "build", "neutralino");
const WEB_OUT_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_WEB_OUT || "build/neutralino/web"
);
const RESOURCES_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_RESOURCES_DIR || "resources"
);
const BIN_DIR = path.resolve(
    ROOT,
    process.env.CWSP_NEUTRALINO_BIN_DIR || "bin"
);

const WEB_MANIFEST = path.join(
    BUILD_ROOT,
    ".resources-manifest.json"
);


function printHelp() {
    console.log(`
CWSP-reborn Neutralinojs build

Usage:
  node scripts/build-neutralino.mjs [options]

Build options:
  --release             Release build
  --web-only            Build web and sync resources only
  --skip-web            Do not run Vite build
  --update              Run "neu update" before build
  --clean               Remove previous Neutralino build output
  --embed-resources     Pass --embed-resources to Neutralino CLI

Deploy options:
  --target <110|200|windows|linux>
                        Build and deploy to target
  --dry-run             Do not execute remote upload

Other:
  --help, -h            Show this help

Environment:
  CWSP_NEUTRALINO_WEB_SCRIPT
                        Vite package script name.
                        Default: build:neutralino:web

  CWSP_NEUTRALINO_WEB_OUT
                        Vite output directory.
                        Default: build/neutralino/web

  CWSP_NEUTRALINO_RESOURCES_DIR
                        Neutralino resources directory.
                        Default: resources

  CWSP_NEUTRALINO_BIN_DIR
                        Neutralino binary output directory.
                        Default: bin
`);
}


function parseArgs(argv) {
    const result = {
        release: false,
        webOnly: false,
        skipWeb: false,
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
        } else if (arg === "--update") {
            result.update = true;
        } else if (arg === "--clean") {
            result.clean = true;
        } else if (arg === "--embed-resources") {
            result.embedResources = true;
        } else if (arg === "--dry-run") {
            result.dryRun = true;
        } else if (arg === "--target") {
            result.target = argv[++i];
        } else if (arg.startsWith("--target=")) {
            result.target = arg.slice("--target=".length);
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
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

    if (/^[a-zA-Z0-9_./:@%+=,-]+$/.test(text)) {
        return text;
    }

    return JSON.stringify(text);
}


function run(command, args = [], options = {}) {
    const cwd = options.cwd || ROOT;

    console.log(
        `[build:neutralino] ${command} ${args.map(quote).join(" ")}`
    );

    const result = spawnSync(command, args, {
        cwd,
        stdio: "inherit",
        env: {
            ...process.env,
            ...(options.env || {})
        },
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


function runNeu(args) {
    /*
     * @neutralinojs/neu should be installed locally:
     *
     *   npm install --save-dev @neutralinojs/neu
     */
    return run(commandName("npx"), [
        "--no-install",
        "neu",
        ...args
    ]);
}


function readJson(file) {
    if (!fs.existsSync(file)) {
        throw new Error(`File not found: ${file}`);
    }

    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        throw new Error(
            `Invalid JSON in ${file}: ${error.message}`
        );
    }
}


function readNeutralinoConfig() {
    return readJson(CONFIG_FILE);
}


function remove(target) {
    fs.rmSync(target, {
        recursive: true,
        force: true
    });
}


function ensureDir(dir) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}


function copyFile(source, destination) {
    ensureDir(path.dirname(destination));
    fs.copyFileSync(source, destination);
}


function listFiles(root) {
    if (!fs.existsSync(root)) {
        return [];
    }

    const result = [];

    function walk(current) {
        for (const entry of fs.readdirSync(current, {
            withFileTypes: true
        })) {
            const source = path.join(current, entry.name);

            if (entry.isDirectory()) {
                walk(source);
            } else if (entry.isFile()) {
                result.push(source);
            }
        }
    }

    walk(root);
    return result;
}


function copyDirectoryContents(sourceDir, destinationDir) {
    ensureDir(destinationDir);

    for (const entry of fs.readdirSync(sourceDir, {
        withFileTypes: true
    })) {
        const source = path.join(sourceDir, entry.name);
        const destination = path.join(destinationDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectoryContents(source, destination);
        } else if (entry.isFile()) {
            copyFile(source, destination);
        }
    }
}


function safeResourcePath(root, relativePath) {
    const resolvedRoot = path.resolve(root);
    const resolvedPath = path.resolve(root, relativePath);
    const prefix = `${resolvedRoot}${path.sep}`;

    if (
        resolvedPath !== resolvedRoot &&
        !resolvedPath.startsWith(prefix)
    ) {
        return null;
    }

    return resolvedPath;
}


function syncWebToResources() {
    if (!fs.existsSync(WEB_OUT_DIR)) {
        throw new Error(
            `Web output directory does not exist: ${WEB_OUT_DIR}\n` +
            `Run the web build first or set CWSP_NEUTRALINO_WEB_OUT.`
        );
    }

    ensureDir(BUILD_ROOT);
    ensureDir(RESOURCES_DIR);

    let previousManifest = {
        files: []
    };

    if (fs.existsSync(WEB_MANIFEST)) {
        try {
            previousManifest = readJson(WEB_MANIFEST);
        } catch {
            previousManifest = {
                files: []
            };
        }
    }

    /*
     * Remove only files created by the previous execution.
     * This preserves manually maintained files in resources/,
     * for example extensions or neutralino.js.
     */
    for (const relativePath of previousManifest.files || []) {
        const destination = safeResourcePath(
            RESOURCES_DIR,
            relativePath
        );

        if (destination && fs.existsSync(destination)) {
            fs.rmSync(destination, {
                force: true
            });
        }
    }

    const generatedFiles = [];

    for (const source of listFiles(WEB_OUT_DIR)) {
        const relativePath = path.relative(WEB_OUT_DIR, source);
        const destination = safeResourcePath(
            RESOURCES_DIR,
            relativePath
        );

        if (!destination) {
            throw new Error(
                `Unsafe resource path generated by Vite: ${relativePath}`
            );
        }

        copyFile(source, destination);
        generatedFiles.push(relativePath);
    }

    fs.writeFileSync(
        WEB_MANIFEST,
        JSON.stringify(
            {
                source: WEB_OUT_DIR,
                files: generatedFiles
            },
            null,
            4
        ) + "\n"
    );

    console.log(
        `[build:neutralino] synced ${generatedFiles.length} web files`
    );
    console.log(
        `[build:neutralino] resources: ${RESOURCES_DIR}`
    );
}


function cleanBuild() {
    console.log("[build:neutralino] cleaning previous output");

    remove(BUILD_ROOT);
    remove(BIN_DIR);
}


function buildWeb(args) {
    if (args.skipWeb) {
        console.log(
            "[build:neutralino] --skip-web — using existing web output"
        );
    } else {
        const script =
            process.env.CWSP_NEUTRALINO_WEB_SCRIPT ||
            "build:neutralino:web";

        runNpm(["run", script]);
    }

    syncWebToResources();
}


function buildNeutralino(args) {
    const buildArgs = ["build"];

    if (args.release) {
        buildArgs.push("--release");
    }

    if (args.embedResources) {
        buildArgs.push("--embed-resources");
    }

    runNeu(buildArgs);

    if (!fs.existsSync(BIN_DIR)) {
        throw new Error(
            `Neutralino build completed, but output directory was not found: ${BIN_DIR}`
        );
    }

    const artifacts = listFiles(BIN_DIR);

    if (artifacts.length === 0) {
        throw new Error(
            `Neutralino output directory is empty: ${BIN_DIR}`
        );
    }

    console.log(
        `[build:neutralino] artifacts: ${artifacts.length} files`
    );

    for (const artifact of artifacts) {
        console.log(
            `  ${path.relative(ROOT, artifact)}`
        );
    }
}


function stageNeutralino(stageRoot, platform) {
    if (!fs.existsSync(BIN_DIR)) {
        throw new Error(
            `Cannot stage Neutralino build: ${BIN_DIR} does not exist`
        );
    }

    remove(stageRoot);
    ensureDir(stageRoot);

    /*
     * Copy the complete bin directory.
     *
     * This is intentional: depending on Neutralino CLI options,
     * the application may consist of an executable plus additional
     * files such as resources.neu, DLLs or metadata.
     */
    copyDirectoryContents(BIN_DIR, stageRoot);

    const runFile = platform === "windows"
        ? "run.cmd"
        : "run.sh";

    const readme = platform === "windows"
        ? [
            "# CWSP Neutralino",
            "",
            "Run the application executable from this directory.",
            `See ${runFile} for a helper command.`,
            ""
        ].join("\n")
        : [
            "# CWSP Neutralino",
            "",
            "Find the Linux executable and run:",
            "",
            "```bash",
            "chmod +x ./<binary>",
            "./<binary>",
            "```",
            ""
        ].join("\n");

    fs.writeFileSync(
        path.join(stageRoot, "README.md"),
        readme
    );

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
    } else {
        const runSh = [
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
        ].join("\n");

        const runFilePath = path.join(stageRoot, "run.sh");

        fs.writeFileSync(runFilePath, runSh);

        try {
            fs.chmodSync(runFilePath, 0o755);
        } catch {
            // chmod can be ignored on Windows.
        }
    }

    console.log(
        `[build:neutralino] staged ${platform} deployment: ${stageRoot}`
    );
}


function hasCommand(command) {
    const result = spawnSync(command, ["--version"], {
        stdio: "ignore",
        shell: process.platform === "win32"
    });

    return !result.error && (
        result.status === 0 ||
        result.status === 1
    );
}


function shellQuote(value) {
    return `'${String(value).replaceAll("'", "'\\''")}'`;
}


function remoteSync({
    user,
    host,
    dir,
    stageRoot,
    dryRun
}) {
    const normalizedDir = String(dir).replaceAll("\\", "/");
    const remote = `${user}@${host}:${normalizedDir}`;

    if (hasCommand("rsync")) {
        const args = [
            "-az",
            "--delete",
            `${stageRoot}${path.sep}`,
            `${remote}/`
        ];

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

    const mkdirCommand = [
        "mkdir",
        "-p",
        shellQuote(normalizedDir)
    ].join(" ");

    if (dryRun) {
        console.log(
            `[deploy] dry-run ssh ${sshTarget} ${mkdirCommand}`
        );
        console.log(
            `[deploy] dry-run scp -r ${stageRoot}${path.sep}. ${remote}`
        );
        return;
    }

    run("ssh", [
        sshTarget,
        mkdirCommand
    ]);

    run("scp", [
        "-r",
        path.join(stageRoot, "."),
        remote
    ]);
}


function deployNeutralino(args) {
    if (!args.target) {
        throw new Error(
            "Deployment requires --target 110, --target 200, " +
            "--target windows or --target linux"
        );
    }

    const validTargets = [
        "110",
        "200",
        "windows",
        "linux"
    ];

    if (!validTargets.includes(args.target)) {
        throw new Error(
            `Invalid target: ${args.target}`
        );
    }

    const platform =
        args.target === "110" ||
        args.target === "windows"
            ? "windows"
            : "linux";

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
        `[deploy] ${spec.label} → ` +
        `${spec.user}@${spec.host}:${spec.dir}`
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
        throw new Error(
            "--web-only cannot be used together with --target"
        );
    }

    readNeutralinoConfig();

    if (args.clean) {
        cleanBuild();
    }

    if (args.update) {
        runNeu(["update"]);
    }

    buildWeb(args);

    if (args.webOnly) {
        console.log(
            "[build:neutralino] web-only build completed"
        );
        return;
    }

    buildNeutralino(args);

    if (args.target) {
        deployNeutralino(args);
    }

    console.log(
        "[build:neutralino] OK"
    );
}


try {
    main();
} catch (error) {
    console.error(
        `[build:neutralino] ${error?.stack || error?.message || error}`
    );
    process.exit(1);
}