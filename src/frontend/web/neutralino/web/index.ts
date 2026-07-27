/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/webnative/web/index.ts
 * Change date and time: 16.17.00_11.07.2026
 * Reason for changes: Pass-III — export Neutralino settings arm + readNeutralinoAuth for the
 *   shared WebNative/Neutralino frontend bridge (same /service/config contract).
 */

export {
    createWebnativeSettingsArm,
    createNeutralinoSettingsArm,
    readNeutralinoAuth,
    markNeutralinoBoot,
    markWebnativeBoot,
    type SettingsBlob,
    type SettingsPatch,
    type SettingsSyncArmLike,
    type WebnativeAuth,
    type NeutralinoAuth
} from "./settings-bridge";

export {
    dispatchNode,
    hasNodeBridge,
    pingNode,
    cwspDispatchNode,
    clipboardReadNode,
    clipboardWriteNode,
    settingsGetNode,
    settingsPatchNode,
    type NodeBridgeFunction
} from "./node-bridge";
