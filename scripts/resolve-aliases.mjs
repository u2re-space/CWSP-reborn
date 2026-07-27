/*
 * Filename: resolve-aliases.mjs
 * FullPath: apps/CWSP-reborn/scripts/resolve-aliases.mjs
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Node 20+ custom loader so short path aliases resolve at runtime.
 *
 * Usage:
 *   node --import ./scripts/resolve-aliases.mjs --experimental-strip-types --test ...
 *   node --import ./scripts/resolve-aliases.mjs ./scripts/with-aliases.mjs ...
 *
 * WHY: package.json "imports" / file: deps do not cover bare `protocol/web` /
 * `backend/node` prefixes; a resolve hook keeps Node --test + strip-types working.
 */

import { register } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
/** apps/CWSP-reborn */
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
/** modules/projects/cwsp-shared/src */
const CWSP_SHARED_SRC = path.resolve(
    APP_ROOT,
    "../../modules/projects/cwsp-shared/src"
);

/**
 * Longer prefixes first so `@fest-lib/cwsp-shared` wins over nothing conflicting,
 * and `protocol/node` is distinct from `protocol/web`.
 * @type {ReadonlyArray<{ prefix: string, root: string }>}
 */
const ALIAS_TABLE = Object.freeze([
    {
        prefix: "@fest-lib/cwsp-shared",
        root: CWSP_SHARED_SRC
    },
    {
        prefix: "cwsp-shared",
        root: CWSP_SHARED_SRC
    },
    {
        prefix: "protocol/node",
        root: path.join(APP_ROOT, "src/protocol/node")
    },
    {
        prefix: "protocol/web",
        root: path.join(APP_ROOT, "src/protocol/web")
    },
    {
        prefix: "backend/node",
        root: path.join(APP_ROOT, "src/backend/node")
    },
    {
        prefix: "backend/web",
        root: path.join(APP_ROOT, "src/backend/web")
    }
]);

/**
 * Map an alias specifier to an absolute filesystem path (may still need .ts).
 * @param {string} specifier
 * @returns {string | null}
 */
function mapAliasToPath(specifier) {
    for (const { prefix, root } of ALIAS_TABLE) {
        if (specifier === prefix) {
            // `@fest-lib/cwsp-shared` → .../src/index.ts
            return path.join(root, "index.ts");
        }
        if (!specifier.startsWith(prefix + "/")) {
            continue;
        }
        // Subpaths keep optional `.ts`; bare dirs (e.g. `/v2`) resolve via index.ts below.
        return path.join(root, specifier.slice(prefix.length + 1));
    }
    return null;
}

/**
 * Prefer an existing file; append `.ts` when the bare path is missing.
 * INVARIANT: keep caller-supplied `.ts` extensions as-is for strip-types.
 * @param {string} absPath
 * @returns {string | null}
 */
function resolveExisting(absPath) {
    if (existsSync(absPath)) {
        return absPath;
    }
    if (!absPath.endsWith(".ts") && !absPath.endsWith(".js") && !absPath.endsWith(".mjs")) {
        const withTs = `${absPath}.ts`;
        if (existsSync(withTs)) {
            return withTs;
        }
        const indexTs = path.join(absPath, "index.ts");
        if (existsSync(indexTs)) {
            return indexTs;
        }
    }
    // Allow unresolved .ts paths through — Node strip-types / nextResolve may still load them.
    if (absPath.endsWith(".ts") || absPath.endsWith(".js") || absPath.endsWith(".mjs")) {
        return absPath;
    }
    return null;
}

// Register this module as the custom loader (hooks exported below).
register(import.meta.url);

/**
 * Custom resolve hook for CWSP-reborn short-path aliases.
 * @param {string} specifier
 * @param {{ parentURL?: string, conditions: string[], importAttributes: object }} context
 * @param {(specifier: string, context: object) => Promise<{ url: string, shortCircuit?: boolean, format?: string }>} nextResolve
 */
export async function resolve(specifier, context, nextResolve) {
    const mapped = mapAliasToPath(specifier);
    if (mapped) {
        const resolved = resolveExisting(mapped) ?? mapped;
        return {
            shortCircuit: true,
            url: pathToFileURL(resolved).href
        };
    }
    return nextResolve(specifier, context);
}
