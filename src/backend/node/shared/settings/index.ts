/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/settings/index.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — public exports for the shared Node settings backend contract.
 */

export { mergeSettingsPatch } from "./merge.ts";
export {
    DEFAULT_NODE_SETTINGS,
    createNodeSettingsBackend,
    toSettingsSyncArm
} from "./store.ts";
export type {
    CreateNodeSettingsBackendOptions,
    NodeSettingsBackend,
    SettingsBlob,
    SettingsPatch
} from "./types.ts";
