/*
 * Filename: build-topology.test.mjs
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/test/build-topology.test.mjs
 * Change date and time: 18.10.00_10.07.2026
 * Reason for changes: Lock Capacitor web→build/capacitor/web and APK→build/capacitor/apk layout.
 */

import assert from "node:assert/strict";
import { existsSync, lstatSync, readFileSync, readlinkSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";
import { build, createServer } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function projectPath(relativePath) {
    return path.join(projectRoot, relativePath);
}

function readRequiredText(relativePath) {
    const absolutePath = projectPath(relativePath);
    assert.ok(existsSync(absolutePath), `expected ${relativePath} to exist`);
    return readFileSync(absolutePath, "utf8");
}

function readRequiredLink(relativePath) {
    const absolutePath = projectPath(relativePath);
    assert.ok(existsSync(absolutePath), `expected ${relativePath} to exist`);
    assert.ok(lstatSync(absolutePath).isSymbolicLink(), `expected ${relativePath} to be a symbolic link`);
    return readlinkSync(absolutePath);
}

async function resolveTargetAliases(mode, specifiers) {
    const server = await createServer({
        appType: "custom",
        configFile: projectPath("vite.config.ts"),
        mode,
        optimizeDeps: { noDiscovery: true },
        server: { middlewareMode: true }
    });

    try {
        const importer = projectPath(
            mode === "capacitor"
                ? "src/frontend/web/capacitor/shared/entry.ts"
                : "src/frontend/web/webnative/web/entry.ts"
        );
        const resolved = new Map();
        for (const specifier of specifiers) {
            const result = await server.pluginContainer.resolveId(specifier, importer);
            assert.ok(result?.id, `expected Vite ${mode} to resolve ${specifier}`);
            resolved.set(specifier, realpathSync(result.id.split("?")[0]));
        }
        return resolved;
    } finally {
        await server.close();
    }
}

async function buildTargetClosure(mode) {
    const result = await build({
        configFile: projectPath("vite.config.ts"),
        mode,
        build: {
            emptyOutDir: false,
            write: false
        }
    });
    const builds = Array.isArray(result) ? result : [result];
    const chunks = builds.flatMap((entry) => entry.output ?? []).filter((entry) => entry.type === "chunk");
    // WHY: Vite module ids may carry `?inline` / virtual `\0` prefixes that are not real paths.
    const resolved = new Set();
    for (const chunk of chunks) {
        for (const id of Object.keys(chunk.modules ?? {})) {
            const bare = id.split("\0").pop()?.split("?")[0] ?? id;
            if (!bare || bare.startsWith("virtual:") || bare.startsWith("\0")) continue;
            if (!existsSync(bare)) continue;
            resolved.add(realpathSync(bare));
        }
    }
    return resolved;
}

test("WebNative links resolve to canonical shared and platform sources", () => {
    assert.equal(readRequiredLink("app/linux/webnative"), "../../src/frontend/web/webnative/linux");
    assert.equal(readRequiredLink("src/frontend/web/webnative/shared"), "../shared");
    assert.equal(readRequiredLink("src/frontend/web/webnative/linux/shared"), "../../shared");
    assert.equal(readRequiredLink("src/frontend/web/webnative/linux/web"), "../web");
});

test("static target builds expose isolated entrypoints and outputs", () => {
    const packageJson = JSON.parse(readRequiredText("package.json"));
    assert.equal(packageJson.scripts["check:topology"], "node --test test/build-topology.test.mjs");
    assert.equal(packageJson.scripts["check:types"], "tsc --noEmit");
    assert.equal(packageJson.scripts["build:capacitor:web"], "vite build --mode capacitor");
    assert.equal(packageJson.scripts["build:capacitor"], "node scripts/build-capacitor.mjs");
    assert.equal(packageJson.scripts["build:capacitor:apk"], "node scripts/build-capacitor.mjs");
    assert.equal(packageJson.scripts["build:webnative"], "vite build --mode webnative");

    const capacitorConfig = readRequiredText("src/frontend/web/capacitor/capacitor.config.ts");
    assert.match(capacitorConfig, /webDir:\s*"\.\.\/\.\.\/build\/capacitor\/web"/);
    assert.match(capacitorConfig, /build\/capacitor\/apk/);

    const androidGradle = readRequiredText("app/android/build.gradle");
    assert.match(androidGradle, /copyCwspApks/);
    assert.match(androidGradle, /build\/capacitor\/apk/);
    assert.match(androidGradle, /project\(':capacitor-android'\)/);
    assert.match(androidGradle, /@capacitor\/android|capacitor-android/);

    const viteConfig = readRequiredText("vite.config.ts");
    assert.match(viteConfig, /outDir:\s*"build\/capacitor\/web"/);
    assert.match(viteConfig, /outDir:\s*"build\/webnative"/);
    assert.match(viteConfig, /VITE_ENABLED_VIEWS:\s*"minimal,network,settings,airpad"/);
    assert.match(viteConfig, /VITE_ENABLED_VIEWS:\s*"minimal,network,settings"/);
    assert.match(viteConfig, /__RS_VIEW_AIRPAD__:\s*"false"/);
    assert.match(viteConfig, /src\/frontend\/web\/capacitor\/shared\/entry\.ts/);
    assert.match(viteConfig, /src\/frontend\/web\/webnative\/web\/entry\.ts/);
    assert.match(viteConfig, /find: "com\/config"/);
    assert.match(viteConfig, /find: "com\/routing"/);
    assert.match(viteConfig, /find: "views\/apis"/);
    assert.match(viteConfig, /find: "cwsp-shared"/);

    const tsconfig = JSON.parse(readRequiredText("tsconfig.json"));
    assert.equal(tsconfig.compilerOptions.paths["boot/*"][0], "./src/frontend/submodules/shells/boot/*");
    assert.equal(tsconfig.compilerOptions.paths["views/*"][0], "./src/frontend/submodules/views/*");
    assert.equal(tsconfig.compilerOptions.paths["com/config/*"]?.[0], "../CrossWord/src/shared/other/config/*");
    assert.equal(tsconfig.compilerOptions.paths["views/apis/*"]?.[0], "./src/frontend/submodules/core/routing/api/*");

    const capacitorEntry = readRequiredText("src/frontend/web/capacitor/shared/entry.ts");
    assert.match(capacitorEntry, /bootMinimal/);
    assert.match(capacitorEntry, /"minimal", "network", "settings", "airpad"/);

    const webnativeEntry = readRequiredText("src/frontend/web/webnative/web/entry.ts");
    assert.match(webnativeEntry, /bootMinimal/);
    assert.match(webnativeEntry, /"minimal", "network", "settings"/);
    assert.doesNotMatch(webnativeEntry, /airpad/i);
});

test("Vite resolves imported shared aliases from their canonical source roots", async () => {
    const aliases = await resolveTargetAliases("capacitor", [
        "core/document/AIResponseParser",
        "core/modules/TemplateManager",
        "core/storage",
        "core/workers/ImageProcess",
        "fl-ui/base/UIElement",
        "cwsp-shared/v2",
        "markdown-view/viewer",
        "veela-lib"
    ]);

    assert.match(aliases.get("core/document/AIResponseParser"), /modules\/projects\/subsystem\/src\/other\/document\/AIResponseParser\.ts$/);
    assert.match(aliases.get("core/modules/TemplateManager"), /modules\/projects\/lur\.e\/src\/interactive\/modules\/TemplateManager\.ts$/);
    assert.match(aliases.get("core/storage"), /modules\/projects\/subsystem\/src\/storage\.ts$/);
    assert.match(aliases.get("core/workers/ImageProcess"), /modules\/projects\/subsystem\/src\/routing\/workers\/ImageProcess\.ts$/);
    assert.match(aliases.get("fl-ui/base/UIElement"), /modules\/projects\/fl\.ui\/src\/ui\/base\/UIElement\.ts$/);
    assert.match(aliases.get("cwsp-shared/v2"), /modules\/projects\/cwsp-shared\/src\/v2\/index\.ts$/);
    assert.match(aliases.get("markdown-view/viewer"), /modules\/views\/markdown-view\/src\/needs-to-API\.ts$/);
    assert.match(aliases.get("veela-lib"), /modules\/projects\/veela\.css\/src\/scss\/index\.scss$/);
});

test("selected Vite entry closures exclude disabled legacy views", async () => {
    const [capacitorModules, webnativeModules] = await Promise.all([
        buildTargetClosure("capacitor"),
        buildTargetClosure("webnative")
    ]);

    assert.ok(
        [...capacitorModules].some((id) => id.endsWith("/src/frontend/web/capacitor/shared/entry.ts")),
        "expected the Capacitor entry in its built dependency closure"
    );
    assert.ok(
        [...webnativeModules].some((id) => id.endsWith("/src/frontend/web/webnative/web/entry.ts")),
        "expected the WebNative entry in its built dependency closure"
    );
    assert.ok(
        ![...capacitorModules, ...webnativeModules].some((id) => id.includes("/modules/views/home-view/")),
        "disabled Home must not pull the legacy window-frame graph"
    );
    assert.ok(
        ![...webnativeModules].some((id) => id.endsWith("/modules/views/airpad-view/src/index.ts")),
        "WebNative must not include the disabled AirPad view entry"
    );
});
