/*
 * Filename: types.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/settings/types.ts
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — shared Node settings blob/patch types for WebNative backends.
 */

/**
 * Settings blob persisted by the WebNative Node backend (`portable.config.json`).
 * WHY: mirrors the frontend `SettingsSyncArm` contract without importing the view module
 * (backend sits beside the shell; import hierarchy must stay flat).
 */
export type SettingsBlob = Record<string, unknown>;
export type SettingsPatch = SettingsBlob;

/**
 * Canonical Node settings backend surface used by Windows/Linux WebNative projections.
 *
 * Verbs align with CWSP stable action names:
 *   - settings:get  → `get()`
 *   - settings:patch → `patch()` (merge + persist)
 */
export interface NodeSettingsBackend {
    /** Absolute path of the portable config file. */
    readonly filePath: string;
    /** settings:get — read the persisted blob (defaults applied when file missing). */
    get(): Promise<SettingsBlob>;
    /**
     * settings:patch — one-level object merge into persisted settings, then atomic write.
     * INVARIANT: nested object patches must not drop sibling keys already persisted.
     */
    patch(patch: SettingsPatch): Promise<SettingsBlob>;
    /** Force-flush the in-memory snapshot to disk (no-op when unchanged). */
    persist(): Promise<SettingsBlob>;
    /** Config-driven defaults used when the file is absent or incomplete. */
    defaults(): Promise<SettingsBlob>;
    /** Resolved runtime snapshot (currently the same as get; reserved for endpoint overlay). */
    snapshot(): Promise<SettingsBlob>;
}

export interface CreateNodeSettingsBackendOptions {
    /** Absolute or relative path to `portable.config.json` (default: cwd/portable.config.json). */
    filePath?: string;
    /** Seed defaults merged under any on-disk values. */
    defaults?: SettingsBlob;
}
