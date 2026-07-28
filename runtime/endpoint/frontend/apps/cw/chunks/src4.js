import { O as addEvent, a as handleStyleChange, g as removeAdopted, h as preloadStyle, p as loadAsAdopted } from "../fest/dom.js";
import { c as ref, n as affected, o as observe, s as propRef } from "../fest/object.js";
import { A as bindWith, i as H } from "../com/app.js";
import { E as initGlobalClipboard, M as GLitElement, N as defineElement, P as property, a as getDir } from "../com/app2.js";
import { a as persistSpeedDialItems, i as ensureSpeedDialMeta, o as persistSpeedDialMeta, r as createEmptySpeedDialItem, s as speedDialItems, t as addSpeedDialItem } from "./StateStorage.js";
import { i as ensureStyleSheet } from "../fest/icon.js";
import { t as __decorate } from "./decorate.js";
import { n as createViewConstructor, t as sendViewProtocolMessage } from "./UniformViewTransport.js";
import { t as ExplorerChannelAction } from "./channel-actions.js";
import { n as getString, r as setString, t as StorageKeys } from "../com/app7.js";
import { a as entryKind, c as FileOperative, i as entryKey, n as createItemCtxMenu, o as formatDate, r as openUnifiedContextMenu, s as iconFor } from "./ContextMenu.js";
//#region ../../modules/views/explorer-view/src/inject.ts
/** Merge inject layers: menu items concatenate; handlers shallow-merge last-wins; onWire chains in order. */
function mergeExplorerInject(...layers) {
	const defined = layers.filter(Boolean);
	if (!defined.length) return void 0;
	return {
		extraBackgroundMenuItems: (ctx) => defined.flatMap((l) => l.extraBackgroundMenuItems?.(ctx) ?? []),
		contextActionHandlers: defined.reduce((acc, l) => ({
			...acc,
			...l.contextActionHandlers ?? {}
		}), {}),
		onWire: (fm, root) => {
			for (const l of defined) l.onWire?.(fm, root);
		}
	};
}
var registered;
/** App-wide explorer hooks (boot/plugins). */
function registerExplorerInject(api) {
	registered = api;
}
function getRegisteredExplorerInject() {
	return registered;
}
//#endregion
//#region ../../modules/views/explorer-view/src/utils.ts
/**
* Empty-area / shell context menu for Explorer.
* Delegates to unified menu (icons, vertical layout, overlay mount, no backdrop-filter mask bugs).
*/
var openExplorerContextMenu = (x, y, items, options) => {
	openUnifiedContextMenu({
		x,
		y,
		items: items.map((item) => ({
			id: item.id,
			label: item.label,
			...item.icon ? { icon: item.icon } : {},
			action: () => item.action()
		})),
		compact: true,
		anchor: options?.anchor ?? null,
		resolveOverlayMountPoint: options?.resolveOverlayMountPoint
	});
};
var requestOpenView = (request) => {
	const viewId = String(request?.viewId || "").trim().toLowerCase();
	if (!viewId) return;
	const raw = request?.target || "window";
	const target = raw === "base" ? "immersive" : raw;
	globalThis?.dispatchEvent?.(new CustomEvent("cw:view-open-request", { detail: {
		viewId,
		target,
		params: request?.params || {}
	} }));
};
var TEXT_FILE_EXTENSIONS = /* @__PURE__ */ new Set([
	"md",
	"markdown",
	"txt",
	"text",
	"json",
	"xml",
	"yml",
	"yaml",
	"html",
	"htm",
	"css",
	"js",
	"mjs",
	"cjs",
	"ts",
	"tsx",
	"jsx",
	"log",
	"ini",
	"conf",
	"cfg",
	"csv"
]);
var buildExplorerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `explorer-${String(path || "root").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "root"}-${stamp}-${suffix}`;
};
var extOf = (filename = "") => {
	const next = String(filename).trim().toLowerCase();
	const idx = next.lastIndexOf(".");
	if (idx <= 0 || idx >= next.length - 1) return "";
	return next.slice(idx + 1);
};
var isTextLikeFile = (file) => {
	if (!file) return false;
	const type = String(file.type || "").toLowerCase();
	if (!type || type.startsWith("text/")) return true;
	if (type.includes("markdown") || type.includes("json") || type.includes("xml")) return true;
	return TEXT_FILE_EXTENSIONS.has(extOf(file.name || ""));
};
var buildViewerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `viewer-${String(path || "viewer").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "viewer"}-${stamp}-${suffix}`;
};
var guessNextShortcutCell = () => {
	const occupied = new Set(Array.from(speedDialItems ?? []).map((item) => `${Math.round(item?.cell?.[0] || 0)}:${Math.round(item?.cell?.[1] || 0)}`));
	const maxRows = 12;
	const maxCols = 8;
	for (let row = 0; row < maxRows; row += 1) for (let col = 0; col < maxCols; col += 1) {
		const key = `${col}:${row}`;
		if (!occupied.has(key)) return [col, row];
	}
	return [0, 0];
};
//#endregion
//#region ../../modules/views/explorer-view/src/runtime.ts
function loadLastPath(explorer, initialPath) {
	if (initialPath && initialPath.trim()) {
		explorer.path = initialPath.trim();
		return;
	}
	const persisted = String(getString(StorageKeys.EXPLORER_PATH, "/user/") || "").trim();
	explorer.path = !persisted || persisted === "/" ? "/user/" : persisted;
}
function setupExplorerEvents(explorer, opts, inject, signal) {
	const listenerOpts = { signal };
	const showMessage = (message) => opts.shellContext?.showMessage?.(message);
	const openFileInViewer = async (item, fullPath, target = "window") => {
		const file = item?.file;
		if (!file || !isTextLikeFile(file)) return false;
		const sourcePath = String(fullPath || "");
		if (target === "base" || target === "immersive") {
			requestOpenView({
				viewId: "viewer",
				target: "immersive",
				params: {
					src: sourcePath,
					filename: file.name || "",
					processId: buildViewerProcessId(sourcePath)
				}
			});
			return true;
		}
		const processId = buildViewerProcessId(sourcePath);
		requestOpenView({
			viewId: "viewer",
			target: "window",
			params: {
				processId,
				src: sourcePath,
				filename: file.name || ""
			}
		});
		try {
			if (!await sendViewProtocolMessage({
				type: "content-view",
				source: "explorer",
				destination: "viewer",
				contentType: file.type || "text/plain",
				attachments: [{
					data: file,
					source: "explorer-viewer-open"
				}],
				data: {
					filename: file.name,
					path: sourcePath,
					source: sourcePath
				},
				metadata: {
					processId,
					openTarget: "window"
				}
			})) showMessage("Viewer is not ready yet, retrying in background");
		} catch (error) {
			console.warn("[Explorer] Failed to send viewer payload:", error);
		}
		return true;
	};
	const attachToWorkCenter = async (item, mode) => {
		const file = item?.file;
		if (!file) {
			showMessage("No file selected");
			return;
		}
		const sourcePath = `${explorer?.path || "/"}${item?.name || file.name}`;
		if (mode === "headless") requestOpenView({
			viewId: "workcenter",
			target: "headless",
			params: {
				queue: "1",
				mode: "headless",
				sourcePath
			}
		});
		else if (mode === "active") requestOpenView({
			viewId: "workcenter",
			target: "window"
		});
		else requestOpenView({
			viewId: "workcenter",
			target: "window",
			params: {
				minimized: "1",
				queue: "1",
				sourcePath
			}
		});
		if (await sendViewProtocolMessage({
			type: "content-share",
			source: "explorer",
			destination: "workcenter",
			contentType: file.type || "application/octet-stream",
			attachments: [{
				data: file,
				source: "explorer-workcenter-attach"
			}],
			data: {
				filename: file.name,
				path: sourcePath,
				source: "explorer-attach",
				queued: mode !== "active"
			},
			metadata: {
				queueState: mode === "active" ? "awaiting" : mode === "queued" ? "pending" : "queued",
				mode,
				sourcePath
			}
		})) showMessage(mode === "active" ? `Attached ${file.name} to Work Center` : `Queued ${file.name} for Work Center (${mode})`);
		else showMessage("Work Center queue is unavailable");
	};
	const pinToHome = (item) => {
		const file = item?.file;
		const name = String(item?.name || file?.name || "").trim();
		if (!name) {
			showMessage("Nothing to pin");
			return;
		}
		const path = `${explorer?.path || "/"}${name}`;
		const shortcut = createEmptySpeedDialItem(observe(guessNextShortcutCell()));
		shortcut.label.value = name;
		shortcut.icon.value = item?.kind === "directory" ? "folder" : "file-text";
		shortcut.action = "open-link";
		addSpeedDialItem(shortcut);
		const meta = ensureSpeedDialMeta(shortcut.id, { action: "open-link" });
		meta.action = "open-link";
		meta.href = path;
		meta.description = `Pinned from Explorer: ${path}`;
		persistSpeedDialItems();
		persistSpeedDialMeta();
		showMessage(`Pinned ${name} to Home`);
	};
	const getItemPath = (item) => `${explorer?.path || "/"}${item?.name || ""}`;
	const mergedHandlers = {
		view: async (item) => {
			await openFileInViewer(item, getItemPath(item), "window");
		},
		"view-base": async (item) => {
			await openFileInViewer(item, getItemPath(item), "base");
		},
		"attach-workcenter": (item) => attachToWorkCenter(item, "active"),
		"attach-workcenter-queued": (item) => attachToWorkCenter(item, "queued"),
		"attach-workcenter-headless": (item) => attachToWorkCenter(item, "headless"),
		"pin-home": (item) => pinToHome(item),
		...inject?.contextActionHandlers ?? {}
	};
	const onFileOpen = async (e) => {
		const { item, path } = e.detail || {};
		if (item?.kind !== "file" || !item?.file) return;
		if (!await openFileInViewer(item, path, "window")) requestOpenView({
			viewId: "workcenter",
			target: "window"
		});
	};
	explorer.addEventListener("open-item", onFileOpen, listenerOpts);
	explorer.addEventListener("open", onFileOpen, listenerOpts);
	explorer.addEventListener("rs-open", onFileOpen, listenerOpts);
	const savePath = () => {
		setString(StorageKeys.EXPLORER_PATH, explorer.path || "/user/");
	};
	explorer.addEventListener("entries-updated", savePath, listenerOpts);
	explorer.addEventListener("rs-navigate", savePath, listenerOpts);
	explorer.addEventListener("context-action", async (event) => {
		const detail = event.detail || {};
		const action = String(detail.action || "");
		const item = detail.item;
		if (!action) return;
		const handler = mergedHandlers[action];
		if (!handler) return;
		await handler(item);
	}, listenerOpts);
	explorer.addEventListener("contextmenu", (event) => {
		if ((event.composedPath?.() || []).some((node) => {
			const el = node;
			if (!el || typeof el.classList?.contains !== "function") return false;
			return el.classList.contains("row") || el.classList.contains("action-btn") || el.classList.contains("ctx-menu");
		})) return;
		event.preventDefault();
		const path = explorer?.path || "/";
		const extra = inject?.extraBackgroundMenuItems?.({ path }) ?? [];
		openExplorerContextMenu(event.clientX, event.clientY, [
			{
				id: "refresh",
				label: "Refresh",
				icon: "arrows-clockwise",
				action: () => {
					explorer.navigate(path);
				}
			},
			{
				id: "open-new-explorer",
				label: "New Explorer window",
				icon: "books",
				action: () => requestOpenView({
					viewId: "explorer",
					target: "window",
					params: {
						path,
						processId: buildExplorerProcessId(path)
					}
				})
			},
			{
				id: "open-home",
				label: "Go to Home",
				icon: "house",
				action: () => opts.shellContext?.navigate?.("home")
			},
			...extra
		], {
			anchor: event.target instanceof Element ? event.target : explorer,
			resolveOverlayMountPoint: opts.shellContext?.resolveOverlayMountPoint
		});
	}, listenerOpts);
}
function setupFallbackExplorerEvents(shellRoot, opts, signal) {
	const listenerOpts = { signal };
	const showMessage = (msg) => opts.shellContext?.showMessage?.(msg);
	const filesList = shellRoot.querySelector("[data-fallback-files]");
	const pickBtn = shellRoot.querySelector("[data-action=\"pick-files\"]");
	const workBtn = shellRoot.querySelector("[data-action=\"open-workcenter\"]");
	if (!pickBtn || !filesList) return;
	const input = document.createElement("input");
	input.type = "file";
	input.multiple = true;
	input.accept = ".md,.markdown,.txt,.json,.xml,.yaml,.yml,.csv,.log,text/*";
	input.style.display = "none";
	shellRoot.append(input);
	pickBtn.addEventListener("click", () => input.click(), listenerOpts);
	workBtn?.addEventListener("click", () => requestOpenView({
		viewId: "workcenter",
		target: "window"
	}), listenerOpts);
	input.addEventListener("change", async () => {
		const files = Array.from(input.files || []);
		filesList.replaceChildren();
		if (files.length === 0) return;
		for (const file of files) {
			const li = document.createElement("li");
			li.textContent = file.name;
			filesList.append(li);
		}
		const firstTextLike = files.find((file) => isTextLikeFile(file));
		if (firstTextLike) {
			requestOpenView({
				viewId: "viewer",
				target: "window"
			});
			if (!await sendViewProtocolMessage({
				type: "content-view",
				source: "explorer-fallback",
				destination: "viewer",
				contentType: firstTextLike.type || "text/plain",
				attachments: [{
					data: firstTextLike,
					source: "explorer-fallback"
				}],
				data: {
					filename: firstTextLike.name,
					source: "explorer-fallback"
				}
			})) showMessage("Viewer is not ready yet");
		}
	}, listenerOpts);
}
/**
* Attach explorer behaviors to `shellRoot` (`.view-explorer`). Returns cleanup and the file manager host if present.
*/
function wireExplorerSubtree(shellRoot, wireOpts) {
	const injectMerged = mergeExplorerInject(getRegisteredExplorerInject(), wireOpts.inject);
	const ac = new AbortController();
	const { signal } = ac;
	const fm = shellRoot.querySelector("ui-file-manager");
	injectMerged?.onWire?.(fm, shellRoot);
	if (fm) {
		loadLastPath(fm, wireOpts.initialPath ?? null);
		setupExplorerEvents(fm, wireOpts, injectMerged, signal);
		return {
			cleanup: () => {
				setString(StorageKeys.EXPLORER_PATH, fm.path || "/user/");
				ac.abort();
			},
			fileManager: fm
		};
	}
	setupFallbackExplorerEvents(shellRoot, wireOpts, signal);
	return {
		cleanup: () => ac.abort(),
		fileManager: null
	};
}
//#endregion
//#region ../../modules/views/explorer-view/src/theme.ts
/** Read app-level resolved theme when available (PWA / shell); else null. */
function readAppDataTheme() {
	if (typeof document === "undefined") return null;
	const raw = document.documentElement?.getAttribute("data-theme");
	if (raw === "light" || raw === "dark") return raw;
	return null;
}
/** Effective scheme after resolving `system` — prefers `html[data-theme]`, then prefers-color-scheme. */
function resolveExplorerColorSchemePreference(mode) {
	if (mode === "light" || mode === "dark") return mode;
	const fromDoc = readAppDataTheme();
	if (fromDoc) return fromDoc;
	if (typeof globalThis.matchMedia === "function" && globalThis.matchMedia("(prefers-color-scheme: light)").matches) return "light";
	return "dark";
}
/** Push resolved scheme onto the explorer shell for CSS tokens under `[data-explorer-color-scheme]`. */
function applyExplorerColorScheme(shellRoot, mode) {
	if (!shellRoot) return;
	const resolved = resolveExplorerColorSchemePreference(mode ?? void 0);
	shellRoot.dataset.explorerColorScheme = resolved;
	shellRoot.style.setProperty("color-scheme", resolved);
}
/**
* When `colorScheme === "system"`, re-apply explorer tokens whenever app `data-theme` or OS scheme changes.
* Call `disconnect()` on unmount; no-op if `mode` is fixed `light` | `dark`.
*/
function subscribeExplorerSystemTheme(shellRoot, getMode) {
	const noop = () => ({ disconnect: () => {} });
	if (!shellRoot || typeof document === "undefined") return noop();
	const apply = () => {
		if (!shellRoot.isConnected) return;
		if ((getMode() ?? "system") !== "system") return;
		applyExplorerColorScheme(shellRoot, "system");
	};
	if ((getMode() ?? "system") !== "system") return noop();
	const root = document.documentElement;
	const mq = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia("(prefers-color-scheme: dark)") : null;
	const obs = new MutationObserver(apply);
	try {
		obs.observe(root, {
			attributes: true,
			attributeFilter: ["data-theme"]
		});
	} catch {
		obs.disconnect();
		return noop();
	}
	mq?.addEventListener("change", apply);
	apply();
	return { disconnect: () => {
		obs.disconnect();
		mq?.removeEventListener("change", apply);
	} };
}
//#endregion
//#region ../../modules/views/explorer-view/src/ts/UIElement.ts
var UIElement = class UIElement extends GLitElement() {
	theme = "default";
	render = function() {
		return H`<slot></slot>`;
	};
	constructor() {
		super();
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		return super.connectedCallback?.() ?? this;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], UIElement.prototype, "theme", void 0);
UIElement = __decorate([defineElement("ui-element")], UIElement);
//#endregion
//#region ../../modules/views/explorer-view/src/scss/FileManagerContent.scss?inline
var FileManagerContent_default$1 = "@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item:not([data-layer=labels]) span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color-scheme:light dark}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface,light-dark(#f6f8fc,#1b2029));block-size:fit-content;border:1px solid var(--color-outline-variant,light-dark(#c9ced8,#474e5e));border-radius:var(--radius-md,10px);box-shadow:0 10px 28px light-dark(rgba(15,23,42,.14),rgba(0,0,0,.42)),0 0 0 1px light-dark(rgba(15,23,42,.08),rgba(255,255,255,.07));color:var(--color-on-surface,light-dark(#12151c,#eceff7));display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm,8px);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface,light-dark(#12151c,#eceff7))}.ctx-menu>:hover{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140))}.ctx-menu>:active{background-color:var(--color-surface-container-highest,light-dark(#dde3ee,#343b4d));color:var(--color-on-surface,light-dark(#12151c,#eceff7))}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140));outline:2px solid var(--color-primary,light-dark(#1d6fd1,#7eb8ff));outline-offset:1px}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant,light-dark(#545c6f,#b4bfd4));flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant,light-dark(#c9ced8,#474e5e));block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.55;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon :is(img,svg){block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer ux-file-manager-content{:host(ui-file-manager-content),:host(ui-file-manager-content) :where(*){overflow:hidden;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none}:host(ui-file-manager-content){background-color:var(--color-surface,light-dark(#f7f8fc,#1a1d24));block-size:100%;border-radius:0;color:var(--color-on-surface,light-dark(#1a1c1f,#e8eaed));contain:none;container-type:size;display:flex;flex:1 1 auto;flex-direction:column;grid-column:1/-1;inline-size:100%;isolation:isolate;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;display:grid;flex:1 1 auto;grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:none;row-gap:0;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid{grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:100%;contain:none;contain-intrinsic-size:1px 2.625rem;content-visibility:visible;display:grid;gap:.25rem;grid-auto-rows:2.625rem;grid-column:1/-1;grid-template-columns:subgrid;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:2.625rem;border:none;border-radius:.625rem;color:var(--color-on-surface);cursor:pointer;display:grid;grid-column:1/-1;grid-template-rows:minmax(0,2.625rem)!important;inline-size:stretch;min-block-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:0 .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem;place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) :is(a,span){background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#3794ff);outline-offset:-2px}:host(ui-file-manager-content) .c{block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) .icon{grid-column:icon;place-content:center;place-items:center}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content)}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;overflow:visible;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{block-size:1.0625rem;inline-size:1.0625rem;min-block-size:1.0625rem;min-inline-size:1.0625rem}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;gap:.35rem;grid-column:1/-1;inset-block-start:0;letter-spacing:.04em;min-block-size:2rem;opacity:1;padding:.4rem .65rem;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;position:sticky!important;text-align:start;text-transform:uppercase;touch-action:manipulation;z-index:8}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}";
//#endregion
//#region ../../modules/views/explorer-view/src/ts/FileManagerContent.ts
initGlobalClipboard();
var styled$1 = preloadStyle(FileManagerContent_default$1);
var FileManagerContent = class FileManagerContent extends UIElement {
	gridRowsEl;
	gridEl;
	operativeInstance = null;
	operativeInstanceRef = ref(null);
	#rowsContainer = null;
	#dropHandlersBound = false;
	get entries() {
		return this.operativeInstance?.entries ?? [];
	}
	get path() {
		return this.operativeInstance?.path || "/";
	}
	set path(value) {
		if (this.operativeInstance) this.operativeInstance.path = value || "/";
	}
	get pathRef() {
		return this.operativeInstance?.pathRef;
	}
	refreshList() {
		this.findRowsContainer()?.replaceChildren();
		const operative = this.operativeInstance;
		if (!operative) {
			this.syncRows();
			return Promise.resolve();
		}
		return Promise.resolve(operative.refreshList(this.path || "/")).then(() => this.syncRows()).catch((error) => {
			console.warn(error);
		});
	}
	onInitialize() {
		return super.onInitialize() ?? this;
	}
	eventBelongsToExplorer(ev) {
		if (!ev) return false;
		if ((typeof ev.composedPath === "function" ? ev.composedPath() : []).includes(this)) return true;
		const target = ev.target;
		if (target === this || target && this.contains(target)) return true;
		let active = document.activeElement;
		while (active) {
			if (active === this || this.contains(active)) return true;
			const host = active.getRootNode?.({ composed: true })?.host;
			if (!host || host === active) break;
			active = host;
		}
		return false;
	}
	bindDropHandlers() {
		const container = this;
		if (!container || this.#dropHandlersBound) return;
		this.#dropHandlersBound = true;
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
		addEvent(container, "pointerdown", (ev) => {
			if ((typeof ev.composedPath === "function" ? ev.composedPath() : []).some((node) => node instanceof HTMLButtonElement)) return;
			this.focus({ preventScroll: true });
		});
		const acceptDrag = (ev) => {
			if (!this.eventBelongsToExplorer(ev)) return;
			ev.preventDefault();
			if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy";
		};
		addEvent(container, "dragenter", acceptDrag);
		addEvent(container, "dragover", acceptDrag);
		addEvent(container, "drop", (ev) => {
			if (!this.eventBelongsToExplorer(ev)) return;
			ev.preventDefault();
			ev.stopPropagation();
			this.operativeInstance?.onDrop?.(ev);
		});
	}
	onPaste(ev) {
		if (this.eventBelongsToExplorer(ev) && this.operativeInstance) this.operativeInstance.onPaste(ev);
	}
	onCopy(ev) {
		if (this.eventBelongsToExplorer(ev) && this.operativeInstance) this.operativeInstance.onCopy(ev);
	}
	byFirstTwoLetterOrName(name) {
		return ((name?.substring?.(0, 2)?.toUpperCase?.())?.charCodeAt?.(0) || 65) - 65;
	}
	constructor() {
		super();
		this.operativeInstance ??= new FileOperative();
		this.operativeInstance.host = this;
		this.addEventListener("entries-updated", () => this.syncRows());
		this.refreshList();
	}
	findRowsContainer() {
		if (this.#rowsContainer?.isConnected) return this.#rowsContainer;
		const latest = Array.from(this.shadowRoot?.querySelectorAll?.(".fm-grid") || []).at(-1)?.querySelector(".fm-grid-rows") ?? null;
		this.#rowsContainer = latest;
		return latest;
	}
	syncRows() {
		const rows = this.findRowsContainer();
		const operative = this.operativeInstance;
		if (!rows || !operative) return;
		const rawEntries = operative.entries;
		const currentEntries = Array.isArray(rawEntries) ? rawEntries : Array.isArray(rawEntries?.value) ? rawEntries.value : [];
		const uniqueEntries = /* @__PURE__ */ new Map();
		for (const item of Array.isArray(currentEntries) ? currentEntries : []) {
			if (!item || typeof item !== "object" || item.name == null) continue;
			const key = entryKey(item);
			if (!uniqueEntries.has(key)) uniqueEntries.set(key, item);
		}
		const safeEntries = Array.from(uniqueEntries.values()).sort((left, right) => {
			return Number(entryKind(left) === "file") - Number(entryKind(right) === "file") || left.name.localeCompare(right.name, void 0, {
				numeric: true,
				sensitivity: "base"
			}) || left.name.localeCompare(right.name);
		});
		rows.replaceChildren();
		const fragment = document.createDocumentFragment();
		safeEntries.forEach((item, index) => {
			fragment.append(this.makeListElement(item, operative, index + 1));
		});
		rows.append(fragment);
	}
	makeListElement(item, operative, order) {
		const op = operative;
		const kind = entryKind(item);
		const isFile = kind === "file";
		const itemEl = H`<div draggable="${isFile}" class="row c2-surface"
            on:click=${(ev) => requestAnimationFrame(() => op.onRowClick?.(item, ev))}
            on:dblclick=${(ev) => requestAnimationFrame(() => op.onRowDblClick?.(item, ev))}
            on:dragstart=${(ev) => op.onRowDragStart?.(item, ev)}
            data-id=${item?.name || ""}
            data-kind=${kind}
            data-entry-key=${entryKey(item)}
        >
            <div style="pointer-events: none; background-color: transparent;" class="c icon"><ui-icon icon=${iconFor(item)} /></div>
            <div style="pointer-events: none; background-color: transparent;" class="c name" title=${item?.name || ""}>${item?.name || ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c size">${isFile ? item?.size ?? "" : ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c date">${isFile ? formatDate(item?.lastModified ?? 0) : ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c actions">
                <button class="action-btn" title="Copy Path" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copyPath", ev));
		}}>
                    <ui-icon icon="copy" />
                </button>
                <button class="action-btn" title="Copy" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copy", ev));
		}}>
                    <ui-icon icon="clipboard" />
                </button>
                <button class="action-btn" title="Delete" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "delete", ev));
		}}>
                    <ui-icon icon="trash" />
                </button>
            </div>
        </div>`;
		bindWith(itemEl, "--order", order, handleStyleChange);
		return itemEl;
	}
	styles = () => styled$1;
	render = function() {
		const self = this;
		const fileHeader = H`<div class="fm-grid-header">
            <div class="c icon">@</div>
            <div class="c name">Name</div>
            <div class="c size">Size</div>
            <div class="c date">Modified</div>
            <div class="c actions">Actions</div>
        </div>`;
		const operative = self.operativeInstance;
		if (!operative) return "";
		const fileRows = H`<div class="fm-grid-rows" style="will-change: contents;"></div>`;
		this.#rowsContainer = fileRows;
		createItemCtxMenu?.(fileRows, operative.onMenuAction.bind(operative), self.entries);
		queueMicrotask(() => {
			self.bindDropHandlers();
			const root = self.shadowRoot;
			const grids = Array.from(root?.querySelectorAll?.(".fm-grid") || []);
			if (grids.length > 1) {
				const latest = grids.at(-1);
				for (const extra of grids) if (extra !== latest) extra.remove();
				self.#rowsContainer = latest.querySelector(".fm-grid-rows");
			}
			self.syncRows();
		});
		return H`<div class="fm-grid" part="grid">
            ${fileHeader}
            ${fileRows}
        </div>`;
	};
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManagerContent.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManagerContent.prototype, "gridEl", void 0);
FileManagerContent = __decorate([defineElement("ui-file-manager-content")], FileManagerContent);
var FileManagerContent_default = FileManagerContent;
//#endregion
//#region ../../modules/views/explorer-view/src/ts/FileManager.ts
var styled = preloadStyle("@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item:not([data-layer=labels]) span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color-scheme:light dark}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface,light-dark(#f6f8fc,#1b2029));block-size:fit-content;border:1px solid var(--color-outline-variant,light-dark(#c9ced8,#474e5e));border-radius:var(--radius-md,10px);box-shadow:0 10px 28px light-dark(rgba(15,23,42,.14),rgba(0,0,0,.42)),0 0 0 1px light-dark(rgba(15,23,42,.08),rgba(255,255,255,.07));color:var(--color-on-surface,light-dark(#12151c,#eceff7));display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm,8px);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface,light-dark(#12151c,#eceff7))}.ctx-menu>:hover{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140))}.ctx-menu>:active{background-color:var(--color-surface-container-highest,light-dark(#dde3ee,#343b4d));color:var(--color-on-surface,light-dark(#12151c,#eceff7))}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140));outline:2px solid var(--color-primary,light-dark(#1d6fd1,#7eb8ff));outline-offset:1px}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant,light-dark(#545c6f,#b4bfd4));flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant,light-dark(#c9ced8,#474e5e));block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.55;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon :is(img,svg){block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer ux-file-manager{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:var(--color-surface,light-dark(#f7f8fc,#1a1d24));block-size:100%;border-radius:0;color:var(--color-on-surface,light-dark(#1a1c1f,#e8eaed));container-type:inline-size;content-visibility:visible;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000}:host(ui-file-manager) .fm-root{block-size:100%;display:grid;flex:1 1 auto;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden}:host(ui-file-manager) .fm-toolbar{background:var(--color-surface,light-dark(#f7f8fc,#1a1d24));border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar :is(button,input){background-color:initial;color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 var(--explorer-font-mono,ui-monospace,\"Cascadia Code\",\"SF Mono\",Consolas,monospace);inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3794ff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar :is(.fm-toolbar-left,.fm-toolbar-right){background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-content{block-size:100%;border-radius:0;display:flex;flex:1 1 auto;flex-direction:column;grid-column:content-col;grid-row:2;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}}}");
var FileManager = class FileManager extends UIElement {
	gridRowsEl;
	gridEl;
	sidebar = "auto";
	inlineSize;
	styles = () => styled;
	#pathWatcherDisposer = null;
	constructor() {
		super();
	}
	get content() {
		return this?.querySelector?.("ui-file-manager-content");
	}
	get operative() {
		return this.content?.operativeInstance;
	}
	get pathRef() {
		return this.operative?.pathRef;
	}
	get path() {
		return this.content?.path || this.operative?.path || "/";
	}
	set path(value) {
		if (this.content) this.content.path = value || "/";
		if (this.operative) this.operative.path = value || "/";
	}
	get input() {
		return this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
	}
	get inputValue() {
		return this.input?.value || "/";
	}
	set inputValue(value) {
		if (this.input) this.input.value = value || "/";
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		const existingContents = Array.from(self.querySelectorAll("ui-file-manager-content"));
		const primaryContent = existingContents[0] ?? document.createElement("ui-file-manager-content");
		if (!existingContents.length) self.append(primaryContent);
		if (existingContents.length > 1) for (const extra of existingContents.slice(1)) extra?.remove?.();
		queueMicrotask(() => {
			this.#pathWatcherDisposer?.();
			this.#pathWatcherDisposer = null;
			if (!this.pathRef) return;
			this.#pathWatcherDisposer = affected(this.pathRef, (path) => {
				const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
				if (input && input instanceof HTMLInputElement && input.value != path) input.value = path || "/";
			});
		});
		return self;
	}
	onRender() {
		super.onRender();
		const weak = new WeakRef(this);
		const onEnter = (ev) => {
			if (ev.key === "Enter") {
				const self = weak.deref();
				const val = (self?.querySelector?.("input[name=\"address\"]"))?.value?.trim?.() || "";
				if (val) self?.navigate(val);
			}
		};
		addEvent(this, "keydown", onEnter);
	}
	get showSidebar() {
		const force = String(this.sidebar ?? "auto").toLowerCase();
		if (force === "true" || force === "1") return true;
		if (force === "false" || force === "0") return false;
		return (propRef(this, "inlineSize")?.value ?? this.inlineSize ?? 0) >= 720;
	}
	async navigate(toPath) {
		const clean = getDir(toPath);
		this.path = clean || this.path || "/";
		const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
		if (input && input instanceof HTMLInputElement && input.value != this.path) input.value = this.path || "/";
	}
	async goUp() {
		const parts = (this.path || this.content?.path || "/").replace(/\/+$/g, "").split("/").filter(Boolean);
		if (parts.length <= 1) {
			this.navigate(this.path = "/");
			return;
		}
		const clean = getDir("/" + parts.slice(0, -1).join("/") + "/");
		this.navigate(this.path = clean || "/");
	}
	requestUpload() {
		this.operative?.requestUpload?.();
	}
	requestPaste() {
		this.operative?.requestPaste?.();
	}
	requestUse() {
		this.operative?.requestUse?.();
	}
	render = function() {
		const self = this;
		const sidebarVisible = self.showSidebar;
		const content = H`<div part="content" class="fm-content"><slot></slot></div>`;
		return H`<div part="root" class="fm-root" data-with-sidebar=${sidebarVisible}>${H`<div part="toolbar" class="fm-toolbar">
            <div class="fm-toolbar-left">
                <button class="btn" title="Up" on:click=${() => requestAnimationFrame(() => self.goUp())}><ui-icon icon="arrow-up"/></button>
                <button class="btn" title="Refresh" on:click=${() => requestAnimationFrame(() => self.navigate(self.inputValue || self.path || "/"))}><ui-icon icon="arrow-clockwise"/></button>
            </div>
            <div class="fm-toolbar-center"><form style="display: contents;" onsubmit="return false;">
                <input class="address c2-surface" autocomplete="off" type="text" name="address" value=${self.path || "/"} />
            </form></div>
            <div class="fm-toolbar-right">
                <button class="btn" title="Add" on:click=${() => requestAnimationFrame(() => self.requestUpload?.())}><ui-icon icon="upload"/></button>
                <button class="btn" title="Paste" on:click=${() => requestAnimationFrame(() => self.requestPaste?.())}><ui-icon icon="clipboard"/></button>
                <button class="btn" title="Use" on:click=${() => requestAnimationFrame(() => self.requestUse?.())}><ui-icon icon="hand-withdraw"/></button>
            </div>
        </div>`}${content}</div>`;
	};
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManager.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManager.prototype, "gridEl", void 0);
__decorate([property({
	source: "attr",
	name: "sidebar"
})], FileManager.prototype, "sidebar", void 0);
__decorate([property({ source: "inline-size" })], FileManager.prototype, "inlineSize", void 0);
FileManager = __decorate([defineElement("ui-file-manager")], FileManager);
//#endregion
//#region ../../modules/views/explorer-view/src/index.scss?inline
var src_default = "@layer ux-file-manager{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:var(--color-surface,light-dark(#f7f8fc,#1a1d24));block-size:100%;border-radius:0;color:var(--color-on-surface,light-dark(#1a1c1f,#e8eaed));container-type:inline-size;content-visibility:visible;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000}:host(ui-file-manager) .fm-root{block-size:100%;display:grid;flex:1 1 auto;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden}:host(ui-file-manager) .fm-toolbar{background:var(--color-surface,light-dark(#f7f8fc,#1a1d24));border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar :is(button,input){background-color:initial;color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 var(--explorer-font-mono,ui-monospace,\"Cascadia Code\",\"SF Mono\",Consolas,monospace);inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3794ff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar :is(.fm-toolbar-left,.fm-toolbar-right){background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-content{block-size:100%;border-radius:0;display:flex;flex:1 1 auto;flex-direction:column;grid-column:content-col;grid-row:2;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}}}@layer ux-file-manager-content{:host(ui-file-manager-content),:host(ui-file-manager-content) :where(*){overflow:hidden;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none}:host(ui-file-manager-content){background-color:var(--color-surface,light-dark(#f7f8fc,#1a1d24));block-size:100%;border-radius:0;color:var(--color-on-surface,light-dark(#1a1c1f,#e8eaed));contain:none;container-type:size;display:flex;flex:1 1 auto;flex-direction:column;grid-column:1/-1;inline-size:100%;isolation:isolate;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;display:grid;flex:1 1 auto;grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:none;row-gap:0;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid{grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:100%;contain:none;contain-intrinsic-size:1px 2.625rem;content-visibility:visible;display:grid;gap:.25rem;grid-auto-rows:2.625rem;grid-column:1/-1;grid-template-columns:subgrid;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:2.625rem;border:none;border-radius:.625rem;color:var(--color-on-surface);cursor:pointer;display:grid;grid-column:1/-1;grid-template-rows:minmax(0,2.625rem)!important;inline-size:stretch;min-block-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:0 .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem;place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) :is(a,span){background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#3794ff);outline-offset:-2px}:host(ui-file-manager-content) .c{block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) .icon{grid-column:icon;place-content:center;place-items:center}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content)}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;overflow:visible;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{block-size:1.0625rem;inline-size:1.0625rem;min-block-size:1.0625rem;min-inline-size:1.0625rem}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;gap:.35rem;grid-column:1/-1;inset-block-start:0;letter-spacing:.04em;min-block-size:2rem;opacity:1;padding:.4rem .65rem;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;position:sticky!important;text-align:start;text-transform:uppercase;touch-action:manipulation;z-index:8}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item:not([data-layer=labels]) span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color-scheme:light dark}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface,light-dark(#f6f8fc,#1b2029));block-size:fit-content;border:1px solid var(--color-outline-variant,light-dark(#c9ced8,#474e5e));border-radius:var(--radius-md,10px);box-shadow:0 10px 28px light-dark(rgba(15,23,42,.14),rgba(0,0,0,.42)),0 0 0 1px light-dark(rgba(15,23,42,.08),rgba(255,255,255,.07));color:var(--color-on-surface,light-dark(#12151c,#eceff7));display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm,8px);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface,light-dark(#12151c,#eceff7))}.ctx-menu>:hover{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140))}.ctx-menu>:active{background-color:var(--color-surface-container-highest,light-dark(#dde3ee,#343b4d));color:var(--color-on-surface,light-dark(#12151c,#eceff7))}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140));outline:2px solid var(--color-primary,light-dark(#1d6fd1,#7eb8ff));outline-offset:1px}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant,light-dark(#545c6f,#b4bfd4));flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant,light-dark(#c9ced8,#474e5e));block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.55;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon :is(img,svg){block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer view-explorer{@layer tokens{:root:has([data-view=explorer]),html:has([data-view=explorer]){--view-layout:\"flex\";--view-content-max-width:none}.view-explorer{--view-border:color-mix(in oklab,var(--color-outline-variant,#888) 45%,transparent);--view-fg-muted:color-mix(in oklab,var(--color-on-surface,#ccc) 72%,transparent);--view-hover-bg:color-mix(in oklab,var(--color-primary,#3794ff) 12%,transparent);--view-selected-bg:color-mix(in oklab,var(--color-primary,#3794ff) 18%,transparent);--view-selected-border:var(--color-primary,#3794ff);--explorer-menu-radius:0.75rem;--explorer-menu-pad:0.35rem;--explorer-font-sans:var(--font-family,\"InterVariable\",\"Inter\",\"Segoe UI Variable\",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--explorer-font-mono:ui-monospace,\"Cascadia Code\",\"Cascadia Mono\",\"SF Mono\",Menlo,Consolas,\"DejaVu Sans Mono\",monospace}.view-explorer[data-explorer-color-scheme=light]{--color-surface:#f7f8fc;--color-on-surface:#1a1c1f;--color-on-surface-variant:#44474f;--color-primary:#1362c3;--color-on-primary:#ffffff;--color-outline-variant:#c3c7d1;--color-surface-container:#eaecef;--color-surface-container-high:#e1e4eb;--color-surface-container-highest:#d7dae4;--color-error:#ba1a1a;--error-color:#ba1a1a}.view-explorer[data-explorer-color-scheme=dark]{--color-surface:#1a1d24;--color-on-surface:#e8eaed;--color-on-surface-variant:#c4c6d0;--color-primary:#6eb4ff;--color-on-primary:#08294a;--color-outline-variant:#5a5f6a;--color-surface-container:#272a31;--color-surface-container-high:#31353d;--color-surface-container-highest:#3b404b;--color-error:#ffb4ab;--error-color:#ffb4ab}}@layer shell{:host:has(.view-explorer){background:var(--color-surface,var(--view-bg,light-dark(#f7f8fc,#1a1d24)));block-size:100%;color:var(--color-on-surface,var(--view-fg,light-dark(#1a1c1f,#e8eaed)));contain:layout style;display:flex;flex-direction:column;font-family:var(--font-family,var(--explorer-font-sans,system-ui,sans-serif));font-size:.875rem;line-height:1.5;min-block-size:0}cw-view-explorer{box-sizing:border-box}.view-explorer,cw-view-explorer{block-size:100%;display:flex;flex:1 1 0;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0}.view-explorer{background:var(--color-surface,var(--view-bg));border:none;border-radius:0;color:var(--color-on-surface,var(--view-fg));font-family:var(--font-family,var(--explorer-font-sans,system-ui,sans-serif));overflow:hidden}.view-explorer__content{background:transparent;box-sizing:border-box;color:inherit;display:flex;flex:1 1 0;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0}.view-explorer__content>ui-file-manager{block-size:100%;flex:1 1 0;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer components{.view-explorer__error,.view-explorer__loading{align-items:center;block-size:100%;display:flex;flex-direction:column;gap:1rem;justify-content:center}.view-explorer__loading{color:var(--color-on-surface);opacity:.65}.view-explorer__spinner{animation:d .8s linear infinite;block-size:32px;border:3px solid var(--view-border,color-mix(in oklab,var(--color-on-surface,#888) 18%,transparent));border-block-start-color:var(--color-primary,#3794ff);border-radius:50%;inline-size:32px}.view-explorer__error p{color:var(--color-error,#f2b8b5);margin:0}.view-explorer__error button{background:var(--color-primary,#3794ff);border:none;border-radius:.375rem;color:var(--color-on-primary,#fff);cursor:pointer;padding:.5rem 1rem}.view-explorer__error button:hover{filter:brightness(1.08)}.view-explorer__fallback{block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:.75rem;overflow:auto;padding:1rem 1.125rem}.view-explorer__fallback h3{font-size:1rem;font-weight:600;margin:0}.view-explorer__fallback p{color:var(--view-fg-muted,var(--color-on-surface-variant));font-size:.875rem;line-height:1.45;margin:0}.view-explorer__fallback-actions{display:flex;flex-wrap:wrap;gap:.5rem}.view-explorer__fallback-actions button{background:color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent);border:none;border-radius:999px;color:inherit;cursor:pointer;font-size:.8125rem;font-weight:500;padding:.5rem 1rem}.view-explorer__fallback-actions button:hover{background:color-mix(in oklab,var(--color-on-surface,#fff) 13%,transparent)}.view-explorer__fallback-actions button:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 60%,transparent);outline-offset:1px}.view-explorer__fallback-files{color:var(--color-on-surface-variant);display:grid;font-size:.8125rem;gap:.35rem;margin:.5rem 0 0;padding-inline-start:1.125rem}}@layer animations{@keyframes d{to{transform:rotate(1turn)}}}}";
//#endregion
//#region ../../modules/views/explorer-view/src/index.ts
function coerceColorScheme(raw) {
	if (raw === "light" || raw === "dark" || raw === "system") return raw;
	if (typeof raw === "string") {
		const t = raw.trim().toLowerCase();
		if (t === "light" || t === "dark" || t === "system") return t;
	}
}
function resolveExplorerOptionsColorScheme(opts) {
	if (!opts) return void 0;
	const ex = opts;
	if (ex.colorScheme) return ex.colorScheme;
	return coerceColorScheme(ex.params?.colorScheme ?? ex.params?.theme);
}
function normalizeSetColorSchemePayload(payload) {
	if (payload === void 0 || payload === null) return void 0;
	if (typeof payload === "string") return coerceColorScheme(payload.trim());
	if (typeof payload === "object") {
		const o = payload;
		return coerceColorScheme(o.colorScheme ?? o.scheme ?? o.theme);
	}
}
function buildExplorerShell() {
	const shell = document.createElement("div");
	shell.className = "view-explorer";
	shell.setAttribute("data-view", "explorer");
	shell.setAttribute("aria-label", "File explorer");
	const content = document.createElement("div");
	content.className = "view-explorer__content";
	content.setAttribute("data-explorer-content", "");
	const fm = document.createElement("ui-file-manager");
	fm.setAttribute("view-mode", "list");
	content.append(fm);
	shell.append(content);
	return shell;
}
function buildFallbackShell() {
	const shell = document.createElement("div");
	shell.className = "view-explorer";
	shell.setAttribute("data-view", "explorer");
	shell.setAttribute("aria-label", "File explorer (fallback)");
	const content = document.createElement("div");
	content.className = "view-explorer__content";
	content.setAttribute("data-explorer-content", "");
	content.innerHTML = `
        <div class="view-explorer__fallback">
            <h3>Explorer fallback mode</h3>
            <p>File manager component is unavailable; use local files below.</p>
            <div class="view-explorer__fallback-actions">
                <button type="button" data-action="pick-files">Open files</button>
                <button type="button" data-action="open-workcenter">Open Work Center</button>
            </div>
            <ul class="view-explorer__fallback-files" data-fallback-files></ul>
        </div>`;
	shell.append(content);
	return shell;
}
var TAG = "cw-view-explorer";
var CwViewExplorer = createViewConstructor(TAG, (Base) => {
	return class ExplorerView extends Base {
		id = "explorer";
		name = "Explorer";
		icon = "folder";
		explorerRoot = null;
		explorerCleanup = null;
		wiredFileManager = null;
		initialPath = null;
		explorerInject;
		_sheet = null;
		themeSync = null;
		lifecycle = {
			onMount: () => {
				this.attachExplorerWire();
			},
			onUnmount: () => {
				this.themeSync?.disconnect();
				this.themeSync = null;
				this.detachExplorerWire();
				removeAdopted(this._sheet);
				this._sheet = null;
			},
			onShow: () => {
				this._sheet ??= loadAsAdopted(src_default);
				this.syncExplorerThemeSubscription();
				if (!this.explorerCleanup && this.explorerRoot) this.attachExplorerWire();
			},
			onHide: () => {
				this.themeSync?.disconnect();
				this.themeSync = null;
				this.detachExplorerWire();
				try {
					if (this._sheet) removeAdopted(this._sheet);
				} catch {}
				this._sheet = null;
			}
		};
		constructor(options) {
			super();
			if (options) {
				this.options = options;
				this.explorerInject = options.explorerInject;
				if (options.params?.path) this.initialPath = String(options.params.path);
				const fromParams = coerceColorScheme(options.params?.colorScheme ?? options.params?.theme);
				if (!options.colorScheme && fromParams) this.options.colorScheme = fromParams;
			}
		}
		/** Imperative theme — persists on view options for later re-renders. */
		setExplorerColorScheme(mode) {
			this.options.colorScheme = mode;
			applyExplorerColorScheme(this.explorerRoot, mode);
			this.syncExplorerThemeSubscription();
		}
		/** When using `system`, follow `html[data-theme]` + OS scheme; rebuild subscription on mode change. */
		syncExplorerThemeSubscription() {
			this.themeSync?.disconnect();
			this.themeSync = null;
			if (!this.explorerRoot) return;
			this.themeSync = subscribeExplorerSystemTheme(this.explorerRoot, () => this.options.colorScheme ?? "system");
		}
		render = (options) => {
			if (options) {
				this.options = {
					...this.options,
					...options
				};
				const p = options?.params?.path;
				if (p) this.initialPath = String(p);
				const inj = options?.explorerInject;
				if (inj !== void 0) this.explorerInject = inj;
			}
			if (this.explorerCleanup) {
				this.themeSync?.disconnect();
				this.themeSync = null;
				this.detachExplorerWire();
			}
			const hasFileManager = Boolean(customElements.get("ui-file-manager"));
			this.explorerRoot = hasFileManager ? buildExplorerShell() : buildFallbackShell();
			const scheme = resolveExplorerOptionsColorScheme(options) ?? resolveExplorerOptionsColorScheme(this.options);
			applyExplorerColorScheme(this.explorerRoot, scheme ?? "system");
			this.syncExplorerThemeSubscription();
			return this.explorerRoot;
		};
		getToolbar() {
			return null;
		}
		canHandleMessage(messageType) {
			return [
				"file-save",
				"navigate-path",
				"content-explorer",
				ExplorerChannelAction.SetColorScheme
			].includes(messageType);
		}
		async handleMessage(message) {
			const msg = message;
			if (msg.type === ExplorerChannelAction.SetColorScheme) {
				const next = normalizeSetColorSchemePayload(msg.data?.colorScheme ?? msg.data?.scheme ?? msg.data?.theme) ?? "system";
				this.setExplorerColorScheme(next);
				return;
			}
			if (msg.data?.file instanceof File) {
				await this.saveIncomingFileToWorkspace(msg.data.file, msg.data.path || msg.data.into);
				return;
			}
			const targetPath = msg.data?.path || msg.data?.into;
			if (targetPath && this.wiredFileManager) this.wiredFileManager.navigate(targetPath);
		}
		async saveIncomingFileToWorkspace(file, destPath) {
			const op = this.wiredFileManager?.operative;
			if (!op?.ingestFileIntoWorkspace) return false;
			await op.ingestFileIntoWorkspace(file, destPath);
			return true;
		}
		/** Imperative API — channels / tooling (`ui-file-manager` when wired). */
		navigateExplorer(path) {
			const p = String(path || "").trim();
			if (!p || !this.wiredFileManager) return;
			return this.wiredFileManager.navigate(p);
		}
		getExplorerFileManager() {
			return this.wiredFileManager;
		}
		getExplorerShellRoot() {
			return this.explorerRoot;
		}
		invokeChannelApi(action, payload) {
			const pathFromPayload = () => {
				if (typeof payload === "string") return payload.trim();
				if (payload && typeof payload === "object") {
					const o = payload;
					const raw = o.path ?? o.into ?? o.target;
					return typeof raw === "string" ? raw.trim() : "";
				}
				return "";
			};
			switch (action) {
				case ExplorerChannelAction.NavigatePath:
				case ExplorerChannelAction.ContentExplorer:
				case ExplorerChannelAction.Navigate: {
					const path = pathFromPayload();
					if (!path) return false;
					this.navigateExplorer(path);
					return true;
				}
				case ExplorerChannelAction.GetPath: return this.wiredFileManager?.path ?? null;
				case ExplorerChannelAction.FileSave:
				case "file-save": {
					const o = payload && typeof payload === "object" ? payload : {};
					const file = o.file instanceof File ? o.file : null;
					const dest = typeof o.path === "string" ? o.path : typeof o.into === "string" ? o.into : void 0;
					if (!file) return false;
					return this.saveIncomingFileToWorkspace(file, dest);
				}
				case ExplorerChannelAction.RequestUse:
					this.wiredFileManager?.requestUse?.();
					return true;
				case ExplorerChannelAction.RequestUpload:
					this.wiredFileManager?.requestUpload?.();
					return true;
				case ExplorerChannelAction.RequestPaste:
					this.wiredFileManager?.requestPaste?.();
					return true;
				case ExplorerChannelAction.SetColorScheme: {
					const next = normalizeSetColorSchemePayload(payload) ?? "system";
					this.setExplorerColorScheme(next);
					return true;
				}
				case "get-color-scheme": {
					const o = this.options;
					return o.colorScheme ?? resolveExplorerOptionsColorScheme(o) ?? "system";
				}
				default: return this.handleMessage({
					type: action,
					data: typeof payload === "object" && payload ? payload : { path: pathFromPayload() || void 0 }
				}).then(() => true);
			}
		}
		attachExplorerWire() {
			if (!this.explorerRoot) return;
			const shellOpts = this.options;
			const { cleanup, fileManager } = wireExplorerSubtree(this.explorerRoot, {
				shellContext: shellOpts?.shellContext,
				initialPath: this.initialPath,
				inject: this.explorerInject
			});
			this.explorerCleanup = cleanup;
			this.wiredFileManager = fileManager;
		}
		detachExplorerWire() {
			this.explorerCleanup?.();
			this.explorerCleanup = null;
			this.wiredFileManager = null;
		}
	};
});
function createExplorerView(options) {
	return new CwViewExplorer(options);
}
//#endregion
export { CwViewExplorer, FileManager, FileManagerContent_default as FileManagerContent, TAG, applyExplorerColorScheme, createExplorerView, createExplorerView as default, getRegisteredExplorerInject, mergeExplorerInject, readAppDataTheme, registerExplorerInject, resolveExplorerColorSchemePreference, subscribeExplorerSystemTheme, wireExplorerSubtree };
