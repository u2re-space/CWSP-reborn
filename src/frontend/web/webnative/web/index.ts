/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/index.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — export backend-facing WebNative settings bridge helpers.
 */

export {
    createWebnativeSettingsArm,
    markWebnativeBoot,
    type SettingsBlob,
    type SettingsPatch,
    type SettingsSyncArmLike,
    type WebnativeAuth
} from "./settings-bridge.ts";
