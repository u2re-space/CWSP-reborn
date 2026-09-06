#!/usr/bin/env node
/*
 * Filename: stage-gateway-web.mjs
 * FullPath: apps/CWSP-reborn/scripts/stage-gateway-web.mjs
 * Change date and time: 14.00.00_06.09.2026
 * Reason for changes: Stage gateway SPA as a portable relative link (not an absolute host path).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "build/gateway/web");
const destDir = path.join(root, "runtime/endpoint/gateway");
const dest = path.join(destDir, "web");

if (!fs.existsSync(path.join(src, "index.html"))) {
    console.error(`[stage-gateway-web] missing ${src}/index.html — run build:gateway:web first`);
    process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
try {
    const st = fs.lstatSync(dest);
    if (st.isSymbolicLink() || st.isDirectory() || st.isFile()) {
        fs.rmSync(dest, { recursive: true, force: true });
    }
} catch {
    /* absent */
}

// WHY: dest lives at runtime/endpoint/gateway/web; three `..` reach app root.
// INVARIANT: never write an absolute host path — it breaks other checkouts and dirties git.
const rel = path.relative(destDir, src);
fs.symlinkSync(rel, dest, "dir");
console.log(`[stage-gateway-web] ${dest} → ${rel}`);
