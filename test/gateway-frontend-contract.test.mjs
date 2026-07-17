import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

test("Vite and npm expose a gateway build target", () => {
    const viteConfig = read("vite.config.ts");
    const packageJson = JSON.parse(read("package.json"));

    assert.match(viteConfig, /gateway\s*:/);
    assert.match(String(packageJson.scripts["build:gateway:web"] || ""), /--mode gateway/);
});

test("gateway frontend has a session gate and BFF settings arm", () => {
    assert.equal(exists("src/frontend/web/gateway/web/entry.ts"), true);
    assert.equal(exists("src/frontend/web/gateway/web/gateway-auth.ts"), true);
    assert.equal(exists("src/frontend/web/gateway/web/settings-bridge.ts"), true);

    const entry = read("src/frontend/web/gateway/web/entry.ts");
    const auth = read("src/frontend/web/gateway/web/gateway-auth.ts");
    const bridge = read("src/frontend/web/gateway/web/settings-bridge.ts");
    assert.match(entry, /gateway-auth|gateway\/auth\/session/);
    assert.match(entry, /window\.location\.replace\(`\/\$\{suffix\}`\)/);
    assert.match(entry, /registerSettingsSyncArm\("web"/);
    assert.match(entry, /setSurfaceDetector/);
    assert.match(entry, /views\/settings\/ts\/settings-sync-adapter/);
    assert.match(auth, /window\.location\.assign\("\/"\)/);
    assert.doesNotMatch(entry, /\/gateway\/login|location\.(assign|replace)\([^)]*\/login/);
    assert.doesNotMatch(auth, /location\.(assign|replace)\([^)]*\/login/);
    assert.doesNotMatch(bridge, /X-API-Key/);
    assert.doesNotMatch(bridge, /localStorage.*(token|accessToken)/i);
    assert.match(bridge, /\/gateway\/api\/settings/);
});

test("settings view hydrates fields from the registered sync arm", () => {
    const view = read("src/frontend/submodules/views/settings/ts/Settings.ts");
    const contrib = read("src/frontend/submodules/views/settings/ts/settings-contributions.ts");
    assert.match(contrib, /mergeSettingsFromSync|loadSettingsHydratedFromSync/);
    assert.match(view, /loadSettingsHydratedFromSync/);
    assert.match(view, /persistContributionsViaSync/);
});

