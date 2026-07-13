/*
 * Filename: vite.config.ts
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/vite.config.ts
 * Change date and time: 18.10.00_10.07.2026
 * Reason for changes: Capacitor web outDir → build/capacitor/web so APKs can live
 *   beside it under build/capacitor/apk (dist → build).
 */

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const resolveProjectPath = (relativePath: string): string => path.resolve(projectRoot, relativePath);
/**
 * WHY: Neutralino (and some platform trees) may be symlinked onto webnative.
 * Vite/Rolldown reject emit paths like `../../webnative/web/index.html` when
 * `root` is a symlink whose realpath differs from the configured root string.
 * Always pin `root` to the real directory.
 */
const resolvePlatformWebRoot = (relativePath: string): string => {
    const abs = resolveProjectPath(relativePath);
    try {
        return fs.realpathSync(abs);
    } catch {
        return abs;
    }
};
const workspaceRoot = resolveProjectPath("../..");
const crossWordRoot = path.join(workspaceRoot, "apps", "CrossWord");
const subsystemRoot = path.join(workspaceRoot, "modules", "projects", "subsystem", "src");
const cwspSharedRoot = path.join(workspaceRoot, "modules", "projects", "cwsp-shared", "src");
const flUiRoot = path.join(workspaceRoot, "modules", "projects", "fl.ui", "src", "ui");
const veelaScssRoot = path.join(workspaceRoot, "modules", "projects", "veela.css", "src", "scss");

/** COMPAT: fl-ui SCSS still `@use "veela-lib"`; map it onto the monorepo Veela entry. */
const veelaLibImporter = {
    findFileUrl(url: string) {
        if (url === "veela-lib") {
            return pathToFileURL(path.join(veelaScssRoot, "index.scss"));
        }
        if (url.startsWith("veela-lib/")) {
            return pathToFileURL(path.join(veelaScssRoot, url.slice("veela-lib/".length)));
        }
        return null;
    }
};

type BuildTarget = "capacitor" | "webnative" | "neutralino";

const DISABLED_VIEW_IDS = ["viewer", "editor", "workcenter", "explorer", "history", "home", "print"] as const;
const DISABLED_SHELL_IDS = ["content", "immersive"] as const;
const VIRTUAL_DISABLED_PREFIX = "\0cwsp-disabled-entry:";

const TARGETS = {
    capacitor: {
        entry: "src/frontend/web/capacitor/shared/entry.ts",
        html: "src/frontend/web/capacitor/shared/index.html",
        // WHY: keep web assets under …/web so Gradle can publish APKs to …/apk
        // without Vite emptyOutDir wiping them. dist/ is a symlink to build/.
        outDir: "build/capacitor/web",
        VITE_ENABLED_VIEWS: "minimal,network,settings,airpad",
        platformWebRoot: "src/frontend/web/capacitor/shared",
        viewDefines: {
            __RS_VIEW_VIEWER__: "false",
            __RS_VIEW_EDITOR__: "false",
            __RS_VIEW_WORKCENTER__: "false",
            __RS_VIEW_EXPLORER__: "false",
            __RS_VIEW_SETTINGS__: "true",
            __RS_VIEW_HISTORY__: "false",
            __RS_VIEW_HOME__: "false",
            __RS_VIEW_PRINT__: "false",
            __RS_VIEW_AIRPAD__: "true",
            __RS_VIEW_NETWORK__: "true"
        }
    },
    webnative: {
        entry: "src/frontend/web/webnative/web/entry.ts",
        html: "src/frontend/web/webnative/web/index.html",
        outDir: "build/webnative",
        VITE_ENABLED_VIEWS: "minimal,network,settings",
        platformWebRoot: "src/frontend/web/webnative/web",
        viewDefines: {
            __RS_VIEW_VIEWER__: "false",
            __RS_VIEW_EDITOR__: "false",
            __RS_VIEW_WORKCENTER__: "false",
            __RS_VIEW_EXPLORER__: "false",
            __RS_VIEW_SETTINGS__: "true",
            __RS_VIEW_HISTORY__: "false",
            __RS_VIEW_HOME__: "false",
            __RS_VIEW_PRINT__: "false",
            __RS_VIEW_AIRPAD__: "false",
            __RS_VIEW_NETWORK__: "true"
        }
    },
    neutralino: {
        entry: "src/frontend/web/neutralino/web/entry.ts",
        html: "src/frontend/web/neutralino/web/index.html",
        // WHY: nest under …/web so neu bin/ + resources/ are not wiped by Vite emptyOutDir.
        outDir: "build/neutralino/web",
        VITE_ENABLED_VIEWS: "minimal,network,settings",
        platformWebRoot: "src/frontend/web/neutralino/web",
        viewDefines: {
            __RS_VIEW_VIEWER__: "false",
            __RS_VIEW_EDITOR__: "false",
            __RS_VIEW_WORKCENTER__: "false",
            __RS_VIEW_EXPLORER__: "false",
            __RS_VIEW_SETTINGS__: "true",
            __RS_VIEW_HISTORY__: "false",
            __RS_VIEW_HOME__: "false",
            __RS_VIEW_PRINT__: "false",
            __RS_VIEW_AIRPAD__: "false",
            __RS_VIEW_NETWORK__: "true"
        }
    }
} as const;

type TargetDefinition = (typeof TARGETS)[BuildTarget];

const selectTarget = (mode: string): BuildTarget => {
    if (mode === "webnative") return "webnative";
    if (mode === "neutralino") return "neutralino";
    return "capacitor";
};

/**
 * The shared registry still declares every historical dynamic view/shell import.
 * Replace only exact disabled entry modules so target builds do not traverse
 * unrelated legacy graphs; supporting subpaths such as AirPad config remain real.
 */
const selectedEntryClosurePlugin = (target: TargetDefinition) => {
    const disabledViews = [
        ...DISABLED_VIEW_IDS,
        ...(target === TARGETS.webnative || target === TARGETS.neutralino
            ? (["airpad"] as const)
            : [])
    ];

    return {
        name: "cwsp-selected-entry-closure",
        enforce: "pre" as const,
        resolveId(id: string) {
            if (id.startsWith("virtual:cwsp-disabled-entry/")) {
                return `${VIRTUAL_DISABLED_PREFIX}${id.slice("virtual:cwsp-disabled-entry/".length)}`;
            }
            return null;
        },
        load(id: string) {
            if (!id.startsWith(VIRTUAL_DISABLED_PREFIX)) return null;
            const feature = id.slice(VIRTUAL_DISABLED_PREFIX.length);
            if (feature === "boot-crx-entry") {
                return [
                    "export async function crxFrontend() {",
                    "    throw new Error('[CWSP] CRX boot entry is disabled in this target build');",
                    "}",
                    "export default crxFrontend;"
                ].join("\n");
            }
            if (feature === "crx-surface") {
                return [
                    "export function getCrxNetworkCoordinator() {",
                    "    throw new Error('[CWSP] CRX network surface is disabled in this target build');",
                    "}",
                    "export default {};"
                ].join("\n");
            }
            return [
                `const feature = ${JSON.stringify(feature)};`,
                "export function createView() {",
                "    throw new Error(`[CWSP] Disabled build entry requested: ${feature}`);",
                "}",
                "export default createView;"
            ].join("\n");
        },
        disabledAliases: [
            ...disabledViews.map((viewId) => ({
                find: new RegExp(`^views/${viewId}$`),
                replacement: `virtual:cwsp-disabled-entry/view-${viewId}`
            })),
            // COMPAT: channel-unknown still dynamic-imports `frontend/views/<id>`.
            ...disabledViews.map((viewId) => ({
                find: new RegExp(`^frontend/views/${viewId}$`),
                replacement: `virtual:cwsp-disabled-entry/view-${viewId}`
            })),
            ...DISABLED_SHELL_IDS.map((shellId) => ({
                find: new RegExp(`^shells/${shellId}/index$`),
                replacement: `virtual:cwsp-disabled-entry/shell-${shellId}`
            })),
            // WHY: settings imports `navigateToView` from the boot barrel, which
            // statically re-exports CRX entry; Capacitor/WebNative must not pull CRX.
            {
                find: /^boot\/ts\/crx-entry$/,
                replacement: "virtual:cwsp-disabled-entry/boot-crx-entry"
            },
            {
                find: /^crx(\/.*)?$/,
                replacement: "virtual:cwsp-disabled-entry/crx-surface"
            }
        ]
    };
};

export default defineConfig(({ mode }) => {
    const targetName = selectTarget(mode);
    const target = TARGETS[targetName];
    const platformWebRoot = resolvePlatformWebRoot(target.platformWebRoot);
    const closurePlugin = selectedEntryClosurePlugin(target);

    return {
        // Static shells may be served from a WebView filesystem or nested path.
        // WHY: root at the *real* platform web dir so emitted HTML is `index.html`,
        // not a relative escape path when the configured root is a symlink.
        root: platformWebRoot,
        base: "./",
        plugins: [closurePlugin],
        define: {
            "import.meta.env.VITE_ENABLED_VIEWS": JSON.stringify(target.VITE_ENABLED_VIEWS),
            ...target.viewDefines
        },
        resolve: {
            alias: [
                ...closurePlugin.disabledAliases,
                // Target-specific modules keep platform shells and views isolated.
                { find: "shells/minimal", replacement: path.join(platformWebRoot, "minimal") },
                { find: "views/network", replacement: path.join(platformWebRoot, "network") },
                { find: "views/settings", replacement: path.join(platformWebRoot, "settings") },
                // WHY: entry/index historically import bare `settings-bridge` (tsconfig path);
                // Vite does not read that path map — pin it to the platform web root.
                { find: "settings-bridge", replacement: path.join(platformWebRoot, "settings-bridge.ts") },
                ...(target === TARGETS.capacitor
                    ? [{ find: "views/airpad", replacement: path.join(platformWebRoot, "airpad") }]
                    : []),
                // Keep the same split application/core alias topology used by CrossWord.
                { find: "boot/ts", replacement: path.join(subsystemRoot, "boot") },
                { find: "boot", replacement: resolveProjectPath("src/frontend/submodules/shells/boot") },
                { find: "shells", replacement: resolveProjectPath("src/frontend/submodules/shells") },
                { find: "views/apis", replacement: path.join(subsystemRoot, "routing", "api") },
                { find: "views/registry", replacement: resolveProjectPath("src/frontend/submodules/views/registry.ts") },
                { find: "views/types", replacement: resolveProjectPath("src/frontend/submodules/views/types.ts") },
                { find: "views", replacement: resolveProjectPath("src/frontend/submodules/views") },
                { find: "com/config", replacement: path.join(crossWordRoot, "src", "shared", "other", "config") },
                { find: "com/other", replacement: path.join(subsystemRoot, "other") },
                { find: "com/styles", replacement: path.join(subsystemRoot, "styles.ts") },
                {
                    find: "com/core/view-ingress-validation",
                    replacement: path.join(subsystemRoot, "core", "view-ingress-validation.ts")
                },
                { find: "com/core", replacement: path.join(subsystemRoot, "routing", "channel") },
                { find: "com/routing", replacement: path.join(crossWordRoot, "src", "shared", "routing") },
                { find: "com/service", replacement: path.join(crossWordRoot, "src", "shared", "service") },
                { find: "com/template", replacement: path.join(subsystemRoot, "service", "template") },
                { find: "com/store", replacement: path.join(crossWordRoot, "src", "shared", "store") },
                { find: "com", replacement: subsystemRoot },
                { find: "shared/transport/websocket", replacement: path.join(subsystemRoot, "boot", "websocket.ts") },
                { find: "shared/transport/hub-socket-boot", replacement: path.join(subsystemRoot, "boot", "hub-socket-boot.ts") },
                {
                    find: "shared/transport/native-coordinator-bridge",
                    replacement: path.join(subsystemRoot, "boot", "native-coordinator-bridge.ts")
                },
                {
                    find: "shared/routing/registry",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "registry.ts")
                },
                {
                    find: "shared/routing/views",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "views.ts")
                },
                {
                    find: "shared/routing/view-prefetch",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "view-prefetch.ts")
                },
                {
                    find: "shared/routing/layer-manager",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "layer-manager.ts")
                },
                {
                    find: "shared/routing/app-layers",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "app-layers.ts")
                },
                {
                    find: "shared/routing/implicit-view-bridge",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "implicit-view-bridge.ts")
                },
                {
                    find: "shared/routing/channel-unknown",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "core", "channel-unknown.ts")
                },
                { find: "shared/routing", replacement: path.join(crossWordRoot, "src", "shared", "routing") },
                { find: "shared/config", replacement: path.join(crossWordRoot, "src", "shared", "other", "config") },
                { find: "shared/utils", replacement: path.join(crossWordRoot, "src", "shared", "other", "utils") },
                {
                    find: "shared/native",
                    replacement: path.join(crossWordRoot, "src", "shared", "routing", "native")
                },
                { find: "shared/styles", replacement: path.join(crossWordRoot, "src", "shared", "styles.ts") },
                { find: "shared/policies", replacement: path.join(subsystemRoot, "routing", "policies") },
                { find: "shared", replacement: path.join(crossWordRoot, "src", "shared") },
                { find: "core/config", replacement: path.join(crossWordRoot, "src", "shared", "other", "config") },
                // WHY: CWSP-reborn `submodules/core` → subsystem; keep document/storage/workers on that SoT.
                { find: "core/document", replacement: path.join(subsystemRoot, "other", "document") },
                {
                    find: "core/modules/TemplateManager",
                    replacement: path.join(workspaceRoot, "modules", "projects", "lur.e", "src", "interactive", "modules", "TemplateManager.ts")
                },
                { find: "core/utils", replacement: path.join(crossWordRoot, "src", "shared", "other", "utils") },
                { find: "core/workers", replacement: path.join(subsystemRoot, "routing", "workers") },
                { find: "core/pwa", replacement: path.join(crossWordRoot, "src", "shared", "routing", "pwa") },
                { find: "core/store", replacement: path.join(crossWordRoot, "src", "shared", "store") },
                { find: "core/storage", replacement: path.join(subsystemRoot, "storage.ts") },
                { find: "core/service", replacement: path.join(crossWordRoot, "src", "shared", "service") },
                { find: "core/routing", replacement: path.join(crossWordRoot, "src", "shared", "routing") },
                { find: "core", replacement: path.join(crossWordRoot, "src", "shared") },
                { find: "fl-ui", replacement: flUiRoot },
                { find: "@fl-ui", replacement: flUiRoot },
                { find: "cwsp-shared", replacement: cwspSharedRoot },
                { find: "@fest-lib/cwsp-shared", replacement: cwspSharedRoot },
                { find: "protocol/node", replacement: resolveProjectPath("src/protocol/node") },
                { find: "protocol/web", replacement: resolveProjectPath("src/protocol/web") },
                { find: "backend/node", replacement: resolveProjectPath("src/backend/node") },
                { find: "backend/web", replacement: resolveProjectPath("src/backend/web") },
                // COMPAT: historical `markdown-view/viewer` import used by shared shells.
                {
                    find: "markdown-view/viewer",
                    replacement: path.join(workspaceRoot, "modules", "views", "markdown-view", "src", "needs-to-API.ts")
                },
                { find: "markdown-view", replacement: path.join(workspaceRoot, "modules", "views", "markdown-view", "src") },
                { find: "veela-lib", replacement: path.join(veelaScssRoot, "index.scss") },
                { find: "fest/veela/runtime", replacement: path.join(subsystemRoot, "boot", "veela-variant-runtime.ts") },
                { find: "fest", replacement: resolveProjectPath("src/frontend/submodules/fest") }
            ]
        },
        css: {
            // Match CrossWord: Veela SCSS load paths + avoid lightningcss minify crashes on fl-ui CSS.
            preprocessorOptions: {
                scss: {
                    api: "modern",
                    quietDeps: true,
                    charset: false,
                    precision: 8,
                    loadPaths: [veelaScssRoot],
                    importers: [veelaLibImporter]
                }
            }
        },
        build: {
            emptyOutDir: true,
            // Absolute outDir required when `root` is nested under the project.
            outDir: resolveProjectPath(target.outDir),
            // WHY: esbuild CSS minify chokes on Veela `sass()` custom functions in output;
            // keep CSS minify on esbuild for JS pipeline but disable CSS minify for Neutralino
            // if needed. Capacitor/WebNative already use esbuild; warnings are non-fatal.
            cssMinify: "esbuild",
            // WHY: Neutralino resource protocol has no CORS — Vite modulepreload/crossorigin
            // tags break module graph load (blank WebView). polyfill still strips crossorigin
            // in build-neutralino.mjs; disable preload hints here too.
            // WHY: one entry chunk reduces relative-import graph failures under Neutralino's
            // resource server (MIME / path / partial-load → blank WebView, zero console).
            ...(targetName === "neutralino"
                ? {
                      modulePreload: false as const,
                      cssCodeSplit: false,
                      rollupOptions: {
                          output: {
                              inlineDynamicImports: true,
                              entryFileNames: "assets/cwsp-app.js",
                              assetFileNames: "assets/[name]-[hash][extname]"
                          }
                      }
                  }
                : {})
        }
    };
});
