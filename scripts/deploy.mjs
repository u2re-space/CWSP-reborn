/*
 * Filename: deploy.mjs
 * FullPath: apps/CWSP-reborn/scripts/deploy.mjs
 * Change date and time: 18.00.00_10.07.2026
 * Reason for changes: Thin wrapper → deploy-runtime.mjs.
 *
 * Examples:
 *   node scripts/deploy.mjs 110 node
 *   node scripts/deploy.mjs 200 java --dry-run
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = process.argv[2];
const runtime = process.argv[3];
const rest = process.argv.slice(4);

if (!target || !runtime) {
    console.error(
        "Usage: node scripts/deploy.mjs <110|200> <node|java|neutralino> [--dry-run] [--rebuild]"
    );
    process.exit(1);
}

const child = spawn(
    process.execPath,
    [
        path.join(here, "deploy-runtime.mjs"),
        "--target",
        target,
        "--runtime",
        runtime,
        ...rest
    ],
    { stdio: "inherit", cwd: path.join(here, "..") }
);
child.on("exit", (code) => process.exit(code ?? 1));
