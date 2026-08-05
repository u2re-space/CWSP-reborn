/*
 * Filename: bootstrap.cjs
 * FullPath: apps/CWSP-reborn/app/windows/neutralino-ext-node/extensions/node/bootstrap.cjs
 * Change date and time: 11.50.00_21.07.2026
 * Reason for changes: Pure CJS host entry — avoid ESM .mjs failures on desk Node;
 *   unpack sibling .tar.gz then require main.js in-process for Neutralino stdin IPC.
 *
 * INVARIANT: Neutralino attaches stdin IPC to THIS process. Do not spawn a child for main.js.
 */

"use strict";

const path = require("node:path");
const fs = require("node:fs");
const {
    resolveHostRoot,
    ensurePortableRuntime
} = require("./portable-runtime.js");

function fail(msg, extra) {
    console.error("[extNode]", msg, extra || "");
    try {
        const host = resolveHostRoot();
        fs.appendFileSync(
            path.join(host, "ext-spawn.log"),
            JSON.stringify({
                ts: new Date().toISOString(),
                message: "bootstrap-fail",
                msg: String(msg),
                extra: extra || null
            }) + "\n"
        );
    } catch (_) {
        /* ignore */
    }
    process.exit(1);
}

const hostRoot = resolveHostRoot();
process.env.CWSP_NL_HOST_ROOT = hostRoot;
process.env.CWSP_ROOT = hostRoot;
process.env.CWSP_NL_PACKAGE_ROOT = hostRoot;
process.env.CWSP_DESKTOP_SHELL = process.env.CWSP_DESKTOP_SHELL || "neutralino";

let runtime;
try {
    runtime = ensurePortableRuntime(hostRoot);
} catch (err) {
    fail("ensurePortableRuntime threw", {
        error: err instanceof Error ? err.message : String(err)
    });
}

if (!runtime) {
    fail(
        "portable runtime missing — need sibling .tar.gz (backend+extensions+resources) or unpacked trees",
        { hostRoot }
    );
}

process.env.CWSP_NL_RUNTIME_ROOT = runtime.runtimeRoot;
process.env.CWSP_BACKEND_ROOT = runtime.runtimeRoot;

try {
    // Load the real extension (CJS) in-process so Neutralino stdin handshake stays on this PID.
    require(runtime.mainJs);
} catch (err) {
    fail("require(main.js) failed", {
        mainJs: runtime.mainJs,
        error: err instanceof Error ? err.stack || err.message : String(err)
    });
}
