/*
 * Filename: settings.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/linux/settings.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — Linux projection of the shared Node settings contract.
 */

export {
    DEFAULT_NODE_SETTINGS,
    createNodeSettingsBackend,
    mergeSettingsPatch,
    toSettingsSyncArm
} from "../shared/settings/index.ts";

export type {
    CreateNodeSettingsBackendOptions,
    NodeSettingsBackend,
    SettingsBlob,
    SettingsPatch
} from "../shared/settings/index.ts";
