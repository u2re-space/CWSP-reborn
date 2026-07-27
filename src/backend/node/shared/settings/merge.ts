/*
 * Filename: merge.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/settings/merge.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — one-level merge matching settings-sync-adapter sibling-key invariant.
 */

import type { SettingsBlob, SettingsPatch } from "./types.ts";

/**
 * One-level object merge used by the Node settings backend.
 *
 * INVARIANT: patching a nested object must not drop sibling keys already persisted
 * (hidden / unsupported UI sections must not delete persisted values).
 * WHY: keep parity with `modules/views/settings-view` `mergeSettingsPatch` without
 * importing that package into the Node backend.
 */
export function mergeSettingsPatch(base: SettingsBlob, patch: SettingsPatch): SettingsBlob {
    const out: SettingsBlob = { ...base };
    for (const [key, value] of Object.entries(patch)) {
        const prev = out[key];
        if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            prev !== null &&
            typeof prev === "object" &&
            !Array.isArray(prev)
        ) {
            out[key] = { ...(prev as SettingsBlob), ...(value as SettingsBlob) };
        } else {
            out[key] = value;
        }
    }
    return out;
}
