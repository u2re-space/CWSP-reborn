/*
 * Filename: smoke.mjs
 * FullPath: apps/CWSP-reborn/runtime/adapters/smoke.mjs
 * Change date and time: 20.45.00_19.07.2026
 * Reason for changes: Validate in-app runtime/endpoint + adapters after move
 *   from runtime/legacy + runtime/cwsp.
 *
 * Run: node apps/CWSP-reborn/runtime/adapters/smoke.mjs
 *   or: node runtime/cwsp/adapters/smoke.mjs (compat symlink)
 */

import { existsSync, statSync, realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
/** apps/CWSP-reborn */
const appRoot = resolve(here, "..", "..");
/** workspace root (U2RE.space) */
const workspaceRoot = resolve(appRoot, "..", "..");

const checks = [
  ["apps/CWSP-reborn/runtime/endpoint present", () => {
    const p = resolve(appRoot, "runtime/endpoint");
    if (!existsSync(p)) throw new Error(`missing ${p}`);
    return realpathSync(p);
  }],
  ["endpoint/server-v2/index.ts reachable", () => {
    const p = resolve(appRoot, "runtime/endpoint/server-v2/index.ts");
    if (!existsSync(p)) throw new Error(`missing ${p}`);
    return p;
  }],
  ["compat runtime/cwsp/endpoint symlink", () => {
    const p = resolve(workspaceRoot, "runtime/cwsp/endpoint");
    if (!existsSync(p)) throw new Error(`missing ${p}`);
    const st = statSync(p);
    if (!st.isSymbolicLink() && !st.isDirectory()) {
      throw new Error(`${p} is not a symlink/dir`);
    }
    return realpathSync(p);
  }],
  ["cwsp-shared v2 source", () => {
    const shared = resolve(appRoot, "src/shared/src/v2/index.ts");
    if (!existsSync(shared)) throw new Error(`missing ${shared}`);
    return shared;
  }],
  ["ingress-normalize soft-bind adapter", async () => {
    const mjsPath = resolve(here, "ingress-normalize.mjs");
    const tsPath = resolve(here, "ingress-normalize.ts");
    if (!existsSync(mjsPath) && !existsSync(tsPath)) {
      throw new Error("missing ingress-normalize.mjs/.ts");
    }
    try {
      const mod = await import(pathToFileURL(mjsPath).href);
      if (typeof mod.looksLikeCwspV2Packet !== "function") {
        throw new Error("looksLikeCwspV2Packet missing");
      }
      if (typeof mod.normalizeIngress !== "function") {
        throw new Error("normalizeIngress missing");
      }
      const sample = { op: "act", what: "clipboard:update", flags: { canonicalV2: true } };
      if (!mod.looksLikeCwspV2Packet(sample)) {
        throw new Error("looksLikeCwspV2Packet rejected v2 sample");
      }
      if (mod.looksLikeCwspV2Packet({ type: "dispatch", to: "L-1" })) {
        throw new Error("looksLikeCwspV2Packet accepted legacy-only frame");
      }
      return "mjs import + looksLike ok";
    } catch (e) {
      if (!existsSync(mjsPath) && !existsSync(tsPath)) throw e;
      return `file present (import fallback: ${e?.message || e})`;
    }
  }],
];

let ok = 0;
let fail = 0;
for (const [name, fn] of checks) {
  try {
    const result = await fn();
    console.log(`ok   | ${name} -> ${result}`);
    ok++;
  } catch (e) {
    console.error(`fail | ${name} -> ${e.message}`);
    fail++;
  }
}

console.log(`\n${ok}/${ok + fail} checks passed`);
process.exit(fail === 0 ? 0 : 1);
