/*
 * Filename: bootstrap.mjs
 * FullPath: apps/CWSP-reborn/app/windows/neutralino-ext-node/extensions/node/bootstrap.mjs
 * Change date and time: 11.40.00_21.07.2026
 * Reason for changes: Host-side extNode entry — unpack .tar.gz then require in-process main.js.
 *
 * INVARIANT: Neutralino attaches stdin IPC to THIS process. Do not spawn a child for main.js.
 * WHY: full extensions/ (+ ws) ship inside sibling .tar.gz; only bootstrap stays beside the .exe.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const {
    resolveHostRoot,
    ensurePortableRuntime
} = require(path.join(here, "portable-runtime.js"));

const hostRoot = resolveHostRoot();
process.env.CWSP_NL_HOST_ROOT = hostRoot;
process.env.CWSP_ROOT = hostRoot;
process.env.CWSP_NL_PACKAGE_ROOT = hostRoot;
process.env.CWSP_DESKTOP_SHELL = process.env.CWSP_DESKTOP_SHELL || "neutralino";

const runtime = ensurePortableRuntime(hostRoot);
if (!runtime) {
    console.error(
        "[extNode] portable runtime missing — need sibling .tar.gz (backend+extensions) or unpacked trees under",
        hostRoot
    );
    process.exit(1);
}

process.env.CWSP_NL_RUNTIME_ROOT = runtime.runtimeRoot;
process.env.CWSP_BACKEND_ROOT = runtime.runtimeRoot;

// Load the real extension (CJS) in-process so Neutralino stdin handshake stays on this PID.
require(runtime.mainJs);
