/*
 * Filename: settings-backend.test.mjs
 * FullPath: apps/CWSP-reborn/test/settings-backend.test.mjs
 * Change date and time: 16.35.00_10.07.2026
 * Reason for changes: Pass-II — focused Node settings get/patch persistence + control RPC test.
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadSettingsModule() {
    const storeUrl = pathToFileURL(
        path.join(projectRoot, "src/backend/node/shared/settings/index.ts")
    ).href;
    return import(storeUrl);
}

async function loadControlModule() {
    const controlUrl = pathToFileURL(
        path.join(projectRoot, "src/backend/node/shared/webnative/control.ts")
    ).href;
    return import(controlUrl);
}

async function loadPlatformSettings(platform) {
    const url = pathToFileURL(
        path.join(projectRoot, `src/backend/node/${platform}/settings.ts`)
    ).href;
    return import(url);
}

test("Node settings backend get/patch persists sibling-safe merge to disk", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "cwsp-settings-"));
    const filePath = path.join(dir, "portable.config.json");

    try {
        const { createNodeSettingsBackend } = await loadSettingsModule();
        const backend = createNodeSettingsBackend({
            filePath,
            defaults: {
                core: { mode: "endpoint", keepMe: true },
                appearance: { theme: "system" }
            }
        });

        const initial = await backend.get();
        assert.equal(initial.core.mode, "endpoint");
        assert.equal(initial.core.keepMe, true);

        const patched = await backend.patch({
            core: { bridge: { enabled: true } },
            appearance: { theme: "dark" }
        });

        assert.equal(patched.core.mode, "endpoint", "sibling core.mode must survive patch");
        assert.equal(patched.core.keepMe, true, "sibling core.keepMe must survive patch");
        assert.equal(patched.core.bridge.enabled, true);
        assert.equal(patched.appearance.theme, "dark");

        const onDisk = JSON.parse(await readFile(filePath, "utf8"));
        assert.equal(onDisk.core.mode, "endpoint");
        assert.equal(onDisk.core.keepMe, true);
        assert.equal(onDisk.core.bridge.enabled, true);
        assert.equal(onDisk.appearance.theme, "dark");

        // Fresh instance must reload persisted state (settings:get after restart).
        const reloaded = createNodeSettingsBackend({ filePath });
        const again = await reloaded.get();
        assert.equal(again.core.bridge.enabled, true);
        assert.equal(again.core.keepMe, true);
        assert.equal(again.appearance.theme, "dark");
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
});

test("Windows and Linux settings projections export the shared factory", async () => {
    const windows = await loadPlatformSettings("windows");
    const linux = await loadPlatformSettings("linux");
    assert.equal(typeof windows.createNodeSettingsBackend, "function");
    assert.equal(typeof linux.createNodeSettingsBackend, "function");
    assert.equal(typeof windows.mergeSettingsPatch, "function");
    assert.equal(typeof linux.toSettingsSyncArm, "function");
});

test("WebNative control RPC GET/POST /service/config round-trips settings", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "cwsp-control-"));
    const filePath = path.join(dir, "portable.config.json");

    const { createNodeSettingsBackend } = await loadSettingsModule();
    const { createWebnativeControlServer } = await loadControlModule();

    const backend = createNodeSettingsBackend({ filePath });
    const control = await createWebnativeControlServer({
        backend,
        apiKey: "test-key-not-a-secret"
    });

    try {
        const headers = {
            "Content-Type": "application/json",
            "X-API-Key": control.auth.key
        };
        const base = `http://127.0.0.1:${control.auth.port}/service/config`;

        const getRes = await fetch(base, { headers, cache: "no-store" });
        assert.equal(getRes.status, 200);
        const got = await getRes.json();
        assert.equal(got.settings.core.mode, "endpoint");

        const postRes = await fetch(base, {
            method: "POST",
            headers,
            body: JSON.stringify({ core: { ops: { logLevel: "debug" } } })
        });
        assert.equal(postRes.status, 200);
        const posted = await postRes.json();
        assert.equal(posted.ok, true);
        assert.equal(posted.settings.core.ops.logLevel, "debug");
        assert.equal(posted.settings.core.mode, "endpoint");

        const unauthorized = await fetch(base, { cache: "no-store" });
        assert.equal(unauthorized.status, 401);
    } finally {
        await control.close();
        await rm(dir, { recursive: true, force: true });
    }
});
