/*
 * Filename: cwsp-shared-v2.ts
 * FullPath: apps/CWSP-reborn/runtime/adapters/cwsp-shared-v2.ts
 * Change date and time: 20.45.00_19.07.2026
 * Reason for changes: Bind endpoint adapters to in-app cwsp-shared (src/shared).
 *   Physical SoT moved from runtime/legacy → apps/CWSP-reborn/runtime.
 *
 * WHY: relative import keeps this resolvable from tsx/node without workspace
 *   path mapping. COMPAT: same surface as `@fest-lib/cwsp-shared` / `/v2`.
 */

export * from "../../src/shared/src/v2/index.ts";
