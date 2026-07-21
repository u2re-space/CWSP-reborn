/*
 * Filename: portable-runtime.js
 * FullPath: apps/CWSP-reborn/app/windows/neutralino-ext-node/extensions/node/portable-runtime.js
 * Change date and time: 11.40.00_21.07.2026
 * Reason for changes: Unpack sibling .tar.gz (backend/ + extensions/) under TEMP for portable Neutralino.
 *
 * WHY (not resources.neu): Neutralino spawns extNode at bootstrap from a filesystem
 * command path — before frontend can call Neutralino.resources.extractDirectory.
 * See https://neutralino.js.org/docs/api/resources/ and extensions loader lifecycle.
 * Keep a thin host stub (run.cmd + bootstrap.mjs + this file); full tree lives in .tar.gz.
 */

const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { spawnSync } = require("node:child_process");

/** Neutralino host root — folder with .exe / resources.neu / .config / .tar.gz. */
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

/** Sibling archive next to the .exe (preferred name = exe basename + .tar.gz). */
function findRuntimeArchive(hostRoot) {
    try {
        const entries = fs.readdirSync(hostRoot);
        const exes = entries.filter((n) => /\.exe$/i.test(n));
        for (const exe of exes) {
            const named = path.join(hostRoot, exe.replace(/\.exe$/i, ".tar.gz"));
            if (fs.existsSync(named)) return named;
        }
        const preferred = entries
            .filter(
                (n) =>
                    /cwsp-neutralino.*\.tar\.gz$/i.test(n) ||
                    /neutralino.*\.tar\.gz$/i.test(n)
            )
            .sort();
        if (preferred.length) return path.join(hostRoot, preferred[0]);
        const any = entries.filter((n) => /\.tar\.gz$/i.test(n)).sort();
        if (any.length) return path.join(hostRoot, any[0]);
    } catch (_) {
        /* ignore */
    }
    return null;
}

function runtimeStampFor(archivePath) {
    try {
        const st = fs.statSync(archivePath);
        return `${path.basename(archivePath)}:${st.size}:${Math.floor(st.mtimeMs)}`;
    } catch (_) {
        return path.basename(archivePath || "none");
    }
}

function writeDiag(hostRoot, message, extra) {
    try {
        const line =
            JSON.stringify({
                ts: new Date().toISOString(),
                message,
                argv: process.argv,
                extra: extra || null
            }) + "\n";
        fs.appendFileSync(path.join(hostRoot, "ext-spawn.log"), line);
    } catch (_) {
        /* ignore */
    }
}

/**
 * Resolve portable runtime (backend/ + extensions/) for Neutralino desk packages.
 *
 * Prefer order:
 * 1. CWSP_NL_RUNTIME_ROOT (set by bootstrap after unpack)
 * 2. Unpacked host backend/ + host main.js (dev / CWSP_KEEP_* )
 * 3. Sibling .tar.gz → %TEMP%/cwsp-neutralino/{backend,extensions}
 *
 * @returns {{ runtimeRoot: string, runBackend: string, mainJs: string, fromArchive: boolean } | null}
 */
function ensurePortableRuntime(hostRoot) {
    const forceArchive = process.env.CWSP_FORCE_BACKEND_ARCHIVE === "1";

    const envRoot = String(process.env.CWSP_NL_RUNTIME_ROOT || "").trim();
    if (envRoot) {
        const runBackend = path.join(envRoot, "backend", "node", "run-backend.mjs");
        const mainJs = path.join(envRoot, "extensions", "node", "main.js");
        if (fs.existsSync(runBackend) && fs.existsSync(mainJs)) {
            return { runtimeRoot: envRoot, runBackend, mainJs, fromArchive: true };
        }
    }

    const localRun = path.join(hostRoot, "backend", "node", "run-backend.mjs");
    const localMain = path.join(hostRoot, "extensions", "node", "main.js");
    if (
        !forceArchive &&
        fs.existsSync(localRun) &&
        fs.existsSync(localMain)
    ) {
        return {
            runtimeRoot: hostRoot,
            runBackend: localRun,
            mainJs: localMain,
            fromArchive: false
        };
    }

    const archive = findRuntimeArchive(hostRoot);
    if (!archive) {
        return null;
    }

    // INVARIANT: archive top-level entries are `backend/` and `extensions/`.
    const runtimeRoot = path.join(os.tmpdir(), "cwsp-neutralino");
    const runBackend = path.join(runtimeRoot, "backend", "node", "run-backend.mjs");
    const mainJs = path.join(runtimeRoot, "extensions", "node", "main.js");
    const stampPath = path.join(runtimeRoot, ".cwsp-runtime-stamp");
    const stamp = runtimeStampFor(archive);

    let needExtract = true;
    try {
        if (
            fs.existsSync(runBackend) &&
            fs.existsSync(mainJs) &&
            fs.existsSync(stampPath)
        ) {
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
            writeDiag(hostRoot, "runtime-extract-failed", {
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
        writeDiag(hostRoot, "runtime-extracted", { archive, runtimeRoot, stamp });
    }

    if (!fs.existsSync(runBackend)) {
        writeDiag(hostRoot, "runtime-extract-missing-entry", {
            runBackend,
            mainJs,
            archive
        });
        return null;
    }

    // COMPAT: older archives shipped only backend/; host still had full extensions/.
    let resolvedMain = mainJs;
    if (!fs.existsSync(resolvedMain)) {
        const hostMain = path.join(hostRoot, "extensions", "node", "main.js");
        const hostWs = path.join(
            hostRoot,
            "extensions",
            "node",
            "node_modules",
            "ws"
        );
        if (fs.existsSync(hostMain) && fs.existsSync(hostWs)) {
            resolvedMain = hostMain;
            writeDiag(hostRoot, "runtime-compat-host-extensions", {
                hostMain,
                archive
            });
        } else {
            writeDiag(hostRoot, "runtime-extract-missing-entry", {
                runBackend,
                mainJs,
                archive
            });
            return null;
        }
    }
    return {
        runtimeRoot,
        runBackend,
        mainJs: resolvedMain,
        fromArchive: true
    };
}

module.exports = {
    resolveHostRoot,
    findRuntimeArchive,
    ensurePortableRuntime
};
