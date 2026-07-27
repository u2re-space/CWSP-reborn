/*
 * Filename: start.mjs
 * FullPath: apps/CWSP-reborn/scripts/start.mjs
 * Change date and time: 18.00.00_10.07.2026
 * Reason for changes: Thin wrapper → start-runtime.mjs (default: node).
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = process.argv[2] || "node";
const child = spawn(
    process.execPath,
    [path.join(here, "start-runtime.mjs"), "--runtime", runtime, ...process.argv.slice(3)],
    { stdio: "inherit", cwd: path.join(here, "..") }
);
child.on("exit", (code) => process.exit(code ?? 1));
