import { h as shouldHandoffViewToSibling, p as publicHrefForView } from "./ecosystem-skus.js";
import { f as isEnabledView } from "./views.js";
import { d as dynamicTheme } from "../vendor/culori.js";
import { a as loadSettings, s as saveSettings } from "./Settings.js";
import { _ as syncBrowserChromeTheme, a as hubSettingsSectionPath, g as resyncThemeAfterAdoptedViewSheet, h as applyTheme, l as resolveEffectiveHubSettingsSection, n as canonicalHubSettingsSection, p as scheduleViewModulePrefetch } from "./settings-shell-profile.js";
import { n as ViewRegistry, p as serviceChannels } from "../com/service.js";
import { a as stripHistoryBase, i as pathForSkuHostView, n as initBootShellWindowActivity, o as withHistoryBase, r as ensureHistoryBaseDataset } from "../shells/preference.js";
import { t as showToast } from "./toast.js";
import { ref } from "/fest/object.js";
import { loadInlineStyle, preloadStyle } from "/fest/style-lib.js";
import { ensureStyleSheet } from "/fest/icon.js";
//#region src/shared/routing/core/view-transitions.ts
/**
* Canonical view order used to determine navigation direction.
* Earlier index = "back", later index = "forward".
*/
var VIEW_ORDER = [
	"home",
	"viewer",
	"editor",
	"explorer",
	"workcenter",
	"history",
	"settings",
	"print"
];
/** `true` when `document.startViewTransition` is available (Chrome 111+). */
var supportsViewTransitions = () => typeof document !== "undefined" && "startViewTransition" in document;
/**
* WHY: Neutralino / WebNative WebViews have flaky View Transition teardown —
* a stuck `::view-transition` layer makes the whole shell unclickable.
* Prefer an instant DOM swap there.
*/
function shouldSkipViewTransitions() {
	try {
		const g = globalThis;
		if (g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__) return true;
		if (g.NL_OS || g.Neutralino) return true;
		if (typeof document !== "undefined" && document.documentElement?.dataset?.cwspDisableVt === "1") return true;
	} catch {}
	return false;
}
/**
* Compute navigation direction based on the ordered view list.
*
* Unknown view IDs fall back to `"fade"` (no slide animation).
*/
function getTransitionDirection(from, to) {
	const fi = VIEW_ORDER.indexOf(from);
	const ti = VIEW_ORDER.indexOf(to);
	if (fi === -1 || ti === -1 || fi === ti) return "fade";
	return fi < ti ? "forward" : "backward";
}
/**
* Wrap a DOM mutation in a View Transition, with a transparent fallback.
*
* Before starting the transition, `data-vt-direction` is set on `:root` so
* CSS `::view-transition-old/new(active-view)` can select the right keyframe
* animation via inherited CSS custom properties.
*
* If a transition is already running, the browser will abort the previous one
* and start the new one — this is intentional and handled gracefully.
*/
async function withViewTransition(update, options = {}) {
	const finishOnce = () => {
		try {
			options.onTransitionFinished?.();
		} catch (error) {
			console.warn("[view-transition] onTransitionFinished error:", error);
		}
	};
	let finishedCalled = false;
	const guardedFinish = () => {
		if (finishedCalled) return;
		finishedCalled = true;
		finishOnce();
	};
	if (!supportsViewTransitions() || shouldSkipViewTransitions()) {
		await update();
		requestAnimationFrame(() => requestAnimationFrame(guardedFinish));
		return;
	}
	const { direction = "fade", types } = options;
	document.documentElement.dataset.vtDirection = direction;
	const doc = document;
	const transition = types?.length ? doc.startViewTransition({
		update,
		types
	}) : doc.startViewTransition(update);
	transition.finished.then(guardedFinish).catch(guardedFinish);
	globalThis.setTimeout?.(() => {
		try {
			transition.skipTransition();
		} catch {}
		guardedFinish();
	}, 900);
	try {
		await (transition.updateCallbackDone ?? transition.finished);
	} catch {} finally {
		delete document.documentElement.dataset.vtDirection;
	}
	transition.finished.catch(() => {});
}
//#endregion
//#region src/frontend/boot/shell-elements.ts
var ShellHost = class extends HTMLElement {
	mountShellLayout(layout) {
		if (!this.shadowRoot) this.attachShadow({ mode: "open" });
		this.style.display = "block";
		this.style.boxSizing = "border-box";
		this.shadowRoot.replaceChildren(layout);
	}
};
function ensureShellElementDefined(id) {
	const tag = `cw-shell-${id}`;
	if (!customElements.get(tag)) customElements.define(tag, ShellHost);
	return tag;
}
//#endregion
//#region src/frontend/boot/shell-slots.ts
/**
* Light-DOM `slot` assignments for `cw-shell-*` hosts. Layouts project these into shadow `<slot>` nodes.
*
* - `content`: default (unnamed) slot — routed views and most UI.
* - `underlying`: behind content (wallpaper, canvas, speed dial / home when shell hosts them).
* - `overlay`: above content (toasts, dialogs, menus, tooltips — assign in consuming code).
*
* NOTE: Content script shell omits the underlying layer. **Window frames** (`wf-frame`) are not shells:
* imperative or slotted overlay UI must mount under the parent `cw-shell-*` `[data-shell-overlays]` layer
* (use {@link resolveOverlayMountPoint} / {@link resolveShellOverlaysMount}).
*/
var SHELL_SLOT = {
	underlying: "underlying",
	overlay: "overlay",
	/** Default slot: use empty string / omit `slot` on the element. */
	content: ""
};
/**
* Comma-separated selector for {@link Element.closest} — matches `cw-shell-*` tags from shell registration.
* Keep aligned with `ShellId` values registered via {@link ensureShellElementDefined}.
*/
var SHELL_HOST_SELECTOR = [
	"cw-shell-base",
	"cw-shell-window",
	"cw-shell-tabbed",
	"cw-shell-minimal",
	"cw-shell-environment",
	"env-shell-container",
	"cw-shell-content",
	"cw-shell-immersive",
	"cw-shell-faint"
].join(",");
/**
* Nearest shell's shadow `[data-shell-overlays]` for stacking UI above routed views.
* Walks past `.wf-frame` and other non-shell ancestors to the enclosing shell host (`cw-shell-*` or `env-shell-container`).
*/
function resolveShellOverlaysMount(from) {
	if (!(from instanceof Element) || typeof from.closest !== "function") return null;
	const host = from.closest(SHELL_HOST_SELECTOR);
	if (!host) return null;
	const fromApi = host.overlayMount;
	if (fromApi instanceof HTMLElement) return fromApi;
	const fromShadow = host.shadowRoot?.querySelector?.("[data-shell-overlays]") ?? null;
	if (fromShadow instanceof HTMLElement) return fromShadow;
	const fromLight = host.querySelector?.("[data-shell-overlays]") ?? null;
	return fromLight instanceof HTMLElement ? fromLight : null;
}
/**
* Prefer shell overlay layer (from `anchor`'s enclosing shell), then `[data-app-layer="overlay"]`,
* then `.basic-app`, then `document.body`.
*/
function resolveOverlayMountPoint(anchor) {
	if (typeof document === "undefined") return;
	const shellOverlays = anchor ? resolveShellOverlaysMount(anchor) : null;
	if (shellOverlays) return shellOverlays;
	const appLayer = document.querySelector("[data-app-layer=\"overlay\"]");
	if (appLayer) return appLayer;
	const basicApp = document.querySelector(".basic-app");
	if (basicApp) return basicApp;
	return document.body;
}
//#endregion
//#region src/frontend/boot/shells.ts
/** Views backed by {@link SERVICE_CHANNEL_CONFIG}; lazily initialized on first navigate when not boot-preloaded. */
var VIEW_SERVICE_CHANNEL_IDS = /* @__PURE__ */ new Set([
	"workcenter",
	"settings",
	"viewer",
	"explorer",
	"print",
	"editor",
	"home"
]);
/**
* Abstract base shell with common functionality
*/
var ShellBase = class {
	theme = ref({
		id: "auto",
		name: "Auto",
		colorScheme: "auto"
	});
	currentView = ref("home");
	navigationState = {
		currentView: "home",
		viewHistory: []
	};
	container = null;
	rootElement = null;
	contentContainer = null;
	toolbarContainer = null;
	toolbarViewSlot = null;
	toolbarThemeSlot = null;
	statusContainer = null;
	overlayContainer = null;
	loadedViews = /* @__PURE__ */ new Map();
	currentViewElement = null;
	navigationToken = 0;
	mounted = false;
	themeCycleButton = null;
	themeCycleIcon = null;
	themeAttrObserver = null;
	shellActivityDispose = null;
	/** Tear down {@link ShellBase.setupViewOpenRequestBridge} on unmount. */
	viewOpenRequestCleanup = null;
	/** When `colorScheme` is `auto`, re-run `applyTheme` on OS light/dark changes. */
	systemColorSchemeMq = null;
	systemColorSchemeHandler = null;
	async mount(container) {
		if (this.mounted) {
			console.warn(`[${this.id}] Shell already mounted`);
			return;
		}
		this.container = container;
		const stylesheet = this.getStylesheet();
		if (stylesheet) {
			if (await preloadStyle(stylesheet)) await loadInlineStyle(stylesheet);
		}
		const shellTagName = ensureShellElementDefined(this.id);
		const shellHost = document.createElement(shellTagName);
		const shellLayout = this.createLayout();
		shellHost.mountShellLayout(shellLayout);
		this.rootElement = shellHost;
		const shellCss = this.getStylesheet();
		if (shellCss && shellHost.shadowRoot) loadInlineStyle(shellCss, shellHost.shadowRoot);
		if (this.id === "minimal" && shellHost.shadowRoot) {
			const iconSheet = ensureStyleSheet();
			if (iconSheet) try {
				const cur = [...shellHost.shadowRoot.adoptedStyleSheets];
				if (!cur.includes(iconSheet)) shellHost.shadowRoot.adoptedStyleSheets = [...cur, iconSheet];
			} catch (e) {
				console.warn("[Shell] Could not adopt icon registry stylesheet into minimal shell shadow:", e);
			}
		}
		this.rootElement.setAttribute("data-shell", this.id);
		this.rootElement.setAttribute("data-shell-system", "task-tab");
		this.rootElement.style.gridColumn = "content-column";
		this.rootElement.style.gridRow = "content-row";
		this.rootElement.style.alignSelf = "stretch";
		this.rootElement.style.justifySelf = "stretch";
		this.rootElement.style.minInlineSize = "0";
		const parentIsShellGrid = container?.dataset?.appLayer === "shell" || (() => {
			try {
				const cs = getComputedStyle(container);
				return cs.display === "grid" && String(cs.gridTemplateRows || "").includes("content-row");
			} catch {
				return false;
			}
		})();
		if (this.id !== "immersive" && this.id !== "content") {
			if (parentIsShellGrid) this.rootElement.style.minBlockSize = "0";
			else {
				this.rootElement.style.position = "absolute";
				this.rootElement.style.inset = "0";
				this.rootElement.style.inlineSize = "100%";
				this.rootElement.style.blockSize = "100%";
				this.rootElement.style.minBlockSize = "100%";
			}
		} else this.rootElement.style.minBlockSize = "";
		this.rootElement.style.pointerEvents = this.id === "content" ? "none" : "auto";
		this.contentContainer = shellLayout.querySelector("[data-shell-content]") || shellLayout;
		this.toolbarContainer = shellLayout.querySelector("[data-shell-toolbar]");
		this.statusContainer = shellLayout.querySelector("[data-shell-status]");
		this.overlayContainer = shellLayout.querySelector("[data-shell-overlays]");
		this.ensureToolbarChrome();
		this.applyTheme(this.getThemeRefValue());
		this.bindThemeAttrObserver();
		container.replaceChildren(this.rootElement);
		this.mounted = true;
		this.shellActivityDispose = this.id === "immersive" || this.id === "content" ? null : initBootShellWindowActivity(this.id);
		this.syncNavigationFromUrl();
		this.reconcileBootShellQueryParam();
		this.setupViewOpenRequestBridge();
		try {
			globalThis.__LURE_DYNAMIC_THEME_PRIORITY__ = true;
			dynamicTheme(document.documentElement);
		} catch (e) {
			console.warn(`[${this.id}] dynamicTheme init failed:`, e);
		}
		console.log(`[${this.id}] Shell mounted with data-shell="${this.id}"`);
	}
	/** Match route search params (order-insensitive). */
	sameRouteParams(a, b) {
		const ea = new URLSearchParams(a || {});
		const eb = new URLSearchParams(b || {});
		if (ea.toString() === eb.toString()) return true;
		const keys = /* @__PURE__ */ new Set([...ea.keys(), ...eb.keys()]);
		for (const k of keys) if (ea.get(k) !== eb.get(k)) return false;
		return true;
	}
	/**
	* When the shell mounts on a path-backed view, mirror it into navigation state so
	* boot / first navigate() does not treat a placeholder as the previous view.
	*/
	syncNavigationFromUrl() {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		const stateView = (globalThis?.history?.state)?.viewId;
		const fromPath = this.getViewFromPathname();
		const resolved = stateView && isEnabledView(String(stateView)) ? stateView : fromPath && isEnabledView(String(fromPath)) ? fromPath : null;
		if (!resolved) return;
		this.navigationState.currentView = resolved;
		this.navigationState.previousView = void 0;
		this.navigationState.params = Object.fromEntries(new URLSearchParams(globalThis.location?.search || ""));
		this.currentView.value = resolved;
		this.navigationState.viewHistory = [resolved];
	}
	/**
	* If the address bar carries `?shell=` from another host/tab (e.g. immersive) while this
	* instance is content/minimal/…, fix the hint so routing and mental model match reality.
	*/
	reconcileBootShellQueryParam() {
		if (typeof globalThis.window === "undefined") return;
		try {
			const raw = (globalThis.location?.search || "").replace(/^\?/, "");
			const params = new URLSearchParams(raw);
			const qs = (params.get("shell") || "").trim().toLowerCase();
			if (!qs) return;
			if (qs === String(this.id)) return;
			params.set("shell", this.id);
			const search = params.toString();
			const next = globalThis.location.pathname + (search ? `?${search}` : "");
			globalThis.history?.replaceState?.(globalThis.history.state ?? null, "", next);
		} catch {}
	}
	/**
	* Dispatch `cw:view-open-request` (see `view-api.requestOpenView`) for window shells; singleton
	* minimal/immersive/content route it here so programmatic opens match toolbar `navigate()` calls.
	*/
	setupViewOpenRequestBridge() {
		if (typeof globalThis.window === "undefined") return;
		const onOpen = (ev) => {
			const d = ev.detail || {};
			const vid = typeof d.viewId === "string" ? d.viewId.trim().toLowerCase() : "";
			if (!vid) return;
			if (shouldHandoffViewToSibling(vid)) {
				const href = publicHrefForView(vid);
				if (href) globalThis.location.assign(href);
				return;
			}
			let params;
			if (d.params && typeof d.params === "object" && !Array.isArray(d.params)) {
				const out = {};
				for (const [k, v] of Object.entries(d.params)) {
					if (v === void 0 || v === null) continue;
					out[String(k)] = typeof v === "string" ? v : String(v);
				}
				if (Object.keys(out).length > 0) params = out;
			}
			if ([
				"window",
				"tabbed",
				"environment"
			].includes(this.id)) {
				this.navigate(vid, params);
				return;
			}
			if (!isEnabledView(vid)) return;
			this.navigate(vid, params);
		};
		globalThis.addEventListener("cw:view-open-request", onOpen);
		this.viewOpenRequestCleanup = () => {
			try {
				globalThis.removeEventListener("cw:view-open-request", onOpen);
			} catch {}
			this.viewOpenRequestCleanup = null;
		};
	}
	unmount() {
		if (!this.mounted) return;
		this.shellActivityDispose?.();
		this.shellActivityDispose = null;
		this.viewOpenRequestCleanup?.();
		this.viewOpenRequestCleanup = null;
		for (const [viewId] of this.loadedViews) try {
			ViewRegistry.unload(viewId);
		} catch (e) {
			console.warn(`[${this.id}] View ${viewId} unmount error:`, e);
		}
		this.loadedViews.clear();
		this.rootElement?.remove();
		this.rootElement = null;
		this.contentContainer = null;
		this.toolbarContainer = null;
		this.statusContainer = null;
		this.overlayContainer = null;
		this.container = null;
		this.mounted = false;
		this.themeAttrObserver?.disconnect();
		this.themeAttrObserver = null;
		this.teardownSystemColorSchemeListener();
		try {
			delete document.documentElement.dataset.activeView;
		} catch {}
		console.log(`[${this.id}] Shell unmounted`);
	}
	async navigate(viewId, params, navOptions) {
		console.log(`[${this.id}] Navigating to: ${viewId}`, params);
		if (shouldHandoffViewToSibling(viewId)) {
			const href = publicHrefForView(viewId);
			if (href && typeof globalThis.location !== "undefined") {
				globalThis.location.assign(href);
				return;
			}
		}
		const navToken = ++this.navigationToken;
		const mergedParams = { ...params || {} };
		if (viewId === "settings") {
			const section = hubSettingsSectionPath(canonicalHubSettingsSection(mergedParams.section || resolveEffectiveHubSettingsSection() || ""));
			if (section) mergedParams.section = section;
			else delete mergedParams.section;
		}
		if (!navOptions?.force && viewId === this.currentView.value && this.sameRouteParams(mergedParams, this.navigationState.params)) {
			const entry = this.loadedViews.get(viewId);
			if (entry?.element.isConnected && (this.contentContainer?.contains(entry.element) || this.rootElement?.contains(entry.element)) && !entry.element.hidden) {
				this.hideShellLoadingPlaceholder();
				return;
			}
		}
		const previousView = this.navigationState.currentView;
		this.navigationState.previousView = previousView;
		this.navigationState.currentView = viewId;
		this.navigationState.params = mergedParams;
		if (this.navigationState.viewHistory[this.navigationState.viewHistory.length - 1] !== viewId) {
			this.navigationState.viewHistory.push(viewId);
			if (this.navigationState.viewHistory.length > 50) this.navigationState.viewHistory.shift();
		}
		this.currentView.value = viewId;
		if (typeof window !== "undefined" && typeof window != "undefined") {
			ensureHistoryBaseDataset();
			const searchParams = new URLSearchParams(mergedParams);
			searchParams.set("shell", this.id);
			searchParams.delete("section");
			const isPathRoutedShell = this.id === "minimal" || this.id === "immersive" || this.id === "environment";
			const search = searchParams.toString() ? "?" + searchParams.toString() : "";
			const viewPath = viewId === "settings" ? mergedParams.section ? `/settings/${mergedParams.section}` : "/settings" : `/${String(viewId || "home").replace(/^\/+/, "")}`;
			const pathname = withHistoryBase(isPathRoutedShell ? pathForSkuHostView(viewPath) : "/");
			const newPathAndSearch = pathname + search;
			try {
				const next = new URL(newPathAndSearch, globalThis.location.origin);
				const cur = new URL(globalThis.location.href);
				if (next.pathname !== cur.pathname || next.search !== cur.search) globalThis?.history?.pushState?.({
					viewId,
					params: mergedParams
				}, "", next.pathname + next.search);
			} catch {
				if (globalThis?.location?.pathname !== pathname || (globalThis?.location?.search || "") !== search) globalThis?.history?.pushState?.({
					viewId,
					params: mergedParams
				}, "", newPathAndSearch);
			}
		}
		try {
			const element = await this.loadView(viewId, mergedParams);
			if (navToken !== this.navigationToken) {
				this.hideShellLoadingPlaceholder();
				return;
			}
			await this.renderViewWithTransition(element);
			if (navToken !== this.navigationToken) {
				this.hideShellLoadingPlaceholder();
				return;
			}
			scheduleViewModulePrefetch(viewId);
			this.hideShellLoadingPlaceholder();
		} catch (error) {
			console.error(`[${this.id}] Failed to load view ${viewId}:`, error);
			this.showMessage(`Failed to load ${viewId}`);
			this.hideShellLoadingPlaceholder();
		}
	}
	/** Dismiss shell loading overlay (content row and/or shadow `.app-shell__viewport`). */
	hideShellLoadingPlaceholder() {
		try {
			const candidates = [];
			const fromContent = this.contentContainer?.querySelector(".app-shell__loading");
			const fromShadow = this.rootElement?.shadowRoot?.querySelector(".app-shell__loading");
			if (fromContent) candidates.push(fromContent);
			if (fromShadow && fromShadow !== fromContent) candidates.push(fromShadow);
			for (const el of candidates) el.hidden = true;
		} catch {}
	}
	async loadView(viewId, params) {
		let initialData;
		const bodyToken = params?._bodyToken;
		if (bodyToken) try {
			const raw = globalThis?.sessionStorage?.getItem?.(bodyToken);
			if (raw != null) {
				globalThis?.sessionStorage?.removeItem?.(bodyToken);
				try {
					initialData = JSON.parse(raw);
				} catch {
					initialData = raw;
				}
			}
		} catch {}
		const cached = this.loadedViews.get(viewId);
		if (cached) {
			if (!cached.element.isConnected) {
				const refreshed = cached.view.render({
					shellContext: this.getContext(),
					params,
					initialData
				});
				this.loadedViews.set(viewId, {
					view: cached.view,
					element: refreshed
				});
				if (cached.view.lifecycle?.onMount) await cached.view.lifecycle.onMount();
				return refreshed;
			}
			if (viewId === "settings") {
				const refreshed = cached.view.render({
					shellContext: this.getContext(),
					params,
					initialData
				});
				this.loadedViews.set(viewId, {
					view: cached.view,
					element: refreshed
				});
				if (cached.view.getToolbar && this.toolbarContainer) this.setViewToolbar(cached.view.getToolbar());
				return refreshed;
			}
			if (viewId === "viewer" || viewId === "print") {
				const v = cached.view;
				if (typeof v.shellNavigateHydrate === "function") v.shellNavigateHydrate({
					shellContext: this.getContext(),
					params,
					initialData
				}, initialData);
			}
			if (cached.view.getToolbar && this.toolbarContainer) {
				const toolbar = cached.view.getToolbar();
				this.setViewToolbar(toolbar);
			}
			return cached.element;
		}
		const view = await ViewRegistry.load(viewId, {
			shellContext: this.getContext(),
			params,
			initialData
		});
		if (VIEW_SERVICE_CHANNEL_IDS.has(viewId)) try {
			await serviceChannels.initChannel(viewId);
		} catch (err) {
			console.warn(`[${this.id}] initChannel(${viewId}) failed:`, err);
		}
		const element = view.render({
			shellContext: this.getContext(),
			params,
			initialData
		});
		this.loadedViews.set(viewId, {
			view,
			element
		});
		if (view.getToolbar && this.toolbarContainer) {
			const toolbar = view.getToolbar();
			this.setViewToolbar(toolbar);
		}
		if (view.lifecycle?.onMount) try {
			await view.lifecycle.onMount();
		} catch (err) {
			console.error(`[${this.id}] onMount(${viewId}) failed:`, err);
		}
		return element;
	}
	setTheme(theme) {
		this.theme.value = theme;
		this.applyTheme(theme);
		this.syncThemeToolbarControls();
	}
	getContext() {
		const navigateFn = (viewId, params, opts) => this.navigate(viewId, params, opts);
		return {
			shellId: this.id,
			navigate: navigateFn,
			openView: navigateFn,
			goBack: () => this.goBack(),
			showMessage: (msg, duration) => this.showMessage(msg, duration),
			navigationState: this.navigationState,
			theme: this.getThemeRefValue(),
			layout: this.layout,
			getContentContainer: () => this.contentContainer,
			getOverlayContainer: () => this.overlayContainer,
			getToolbarContainer: () => this.toolbarContainer,
			setViewToolbar: (toolbar) => this.setViewToolbar(toolbar),
			resolveOverlayMountPoint: (anchor) => {
				const c = this.overlayContainer;
				if (c) return c;
				return resolveOverlayMountPoint(anchor ?? null);
			}
		};
	}
	getElement() {
		if (!this.rootElement) throw new Error(`[${this.id}] Shell not mounted`);
		return this.rootElement;
	}
	/**
	* Perform the raw DOM swap for a view change (no transition animation).
	*
	* This is the synchronous inner mutation used both as a standalone call
	* and as the update callback inside `renderViewWithTransition`.
	* `onHide` must be called by the caller BEFORE invoking this when using
	* a view transition so the old view's final state is captured correctly.
	*/
	renderView(element) {
		if (!this.contentContainer) {
			console.warn(`[${this.id}] No content container available`);
			return;
		}
		this.contentContainer.setAttribute("data-current-view", this.currentView.value);
		const previousId = this.navigationState.previousView;
		if (previousId && previousId !== this.currentView.value && this.loadedViews.has(previousId)) {
			const prev = this.loadedViews.get(previousId);
			prev.element.removeAttribute("data-view");
			prev.element.hidden = true;
			if (this.contentContainer.contains(prev.element)) prev.element.remove();
		}
		element.setAttribute("data-view", this.currentView.value);
		element.hidden = false;
		if (!this.contentContainer.contains(element)) this.contentContainer.appendChild(element);
		this.currentViewElement = element;
		try {
			const vid = this.currentView.value;
			document.documentElement.dataset.activeView = vid;
			if (this.rootElement) this.rootElement.dataset.activeView = vid;
		} catch {}
	}
	/**
	* Render a view with a View Transition animation.
	*
	* Runs the DOM swap inside `document.startViewTransition()` so snapshots can separate.
	* The outgoing view's {@link ViewLifecycle.onHide} runs after pseudo-element teardown
	* (see {@link withViewTransition} `onTransitionFinished`) so document-level view styles survive
	* the disappear animation when applicable.
	*/
	async renderViewWithTransition(element) {
		if (!this.contentContainer) {
			this.renderView(element);
			this.invokeCurrentViewOnShow();
			return;
		}
		const previousId = this.navigationState.previousView;
		const prevEntry = previousId && previousId !== this.currentView.value ? this.loadedViews.get(previousId) : void 0;
		const direction = getTransitionDirection(previousId ?? "", this.currentView.value);
		await withViewTransition(() => this.renderView(element), {
			direction,
			types: [direction, `to-${this.currentView.value}`],
			onTransitionFinished: () => {
				if (prevEntry?.view.lifecycle?.onHide) try {
					prevEntry.view.lifecycle.onHide();
				} catch (error) {
					console.warn(`[${this.id}] View ${previousId} onHide error:`, error);
				}
			}
		});
		this.invokeCurrentViewOnShow();
	}
	resolveShellColorScheme(theme) {
		const prefersDark = globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
		return theme.colorScheme === "dark" ? "dark" : theme.colorScheme === "light" ? "light" : prefersDark ? "dark" : "light";
	}
	/**
	* Apply theme to the shell
	*/
	applyTheme(theme) {
		if (!this.rootElement) return;
		const resolved = this.resolveShellColorScheme(theme);
		this.rootElement.dataset.theme = resolved;
		this.rootElement.style.colorScheme = resolved;
		syncBrowserChromeTheme(resolved, theme.colorScheme);
		if (theme.cssVariables) for (const [key, value] of Object.entries(theme.cssVariables)) this.rootElement.style.setProperty(key, value);
		this.syncSystemColorSchemeListener();
	}
	teardownSystemColorSchemeListener() {
		if (this.systemColorSchemeMq && this.systemColorSchemeHandler) this.systemColorSchemeMq.removeEventListener("change", this.systemColorSchemeHandler);
		this.systemColorSchemeMq = null;
		this.systemColorSchemeHandler = null;
	}
	/** Keep shell + document chrome aligned when settings use `auto` and the OS scheme changes. */
	syncSystemColorSchemeListener() {
		this.teardownSystemColorSchemeListener();
		if (typeof globalThis.matchMedia !== "function") return;
		if (this.getThemeRefValue().colorScheme !== "auto") return;
		const mq = globalThis.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (!this.mounted || this.getThemeRefValue().colorScheme !== "auto") return;
			this.applyTheme(this.getThemeRefValue());
		};
		this.systemColorSchemeMq = mq;
		this.systemColorSchemeHandler = handler;
		mq.addEventListener("change", handler);
	}
	getThemeRefValue() {
		return this.theme?.value;
	}
	/**
	* Go back in navigation history
	*/
	goBack() {
		const history = this.navigationState.viewHistory;
		if (history.length > 1) {
			history.pop();
			const previous = history[history.length - 1];
			if (previous) this.navigate(previous);
		}
	}
	/**
	* Show a status message
	*/
	showMessage(message, duration = 3e3) {
		showToast({
			message,
			duration,
			kind: "info"
		});
	}
	/**
	* Set the current view's toolbar
	*/
	setViewToolbar(toolbar) {
		this.ensureToolbarChrome();
		if (!this.toolbarViewSlot) return;
		this.toolbarViewSlot.replaceChildren();
		if (toolbar) this.toolbarViewSlot.appendChild(toolbar);
	}
	ensureToolbarChrome() {
		if (!this.toolbarContainer) return;
		if (this.toolbarViewSlot && this.toolbarThemeSlot) return;
		this.toolbarContainer.replaceChildren();
		this.toolbarContainer.style.display = "flex";
		this.toolbarContainer.style.alignItems = "center";
		this.toolbarContainer.style.justifyContent = "space-between";
		this.toolbarContainer.style.gap = "0.5rem";
		this.toolbarContainer.style.flexWrap = "wrap";
		const themeSlot = document.createElement("div");
		themeSlot.className = "shell-theme-controls";
		themeSlot.setAttribute("data-shell-toolbar-theme", "true");
		themeSlot.style.display = "inline-flex";
		themeSlot.style.alignItems = "center";
		themeSlot.style.gap = "0.35rem";
		const cycleBtn = document.createElement("button");
		cycleBtn.type = "button";
		cycleBtn.className = "app-shell__nav-btn shell-theme-cycle-btn";
		cycleBtn.setAttribute("aria-label", "Theme: follow system");
		cycleBtn.title = "Theme: follow system — click to pin dark or light, then click again to return to auto";
		const icon = document.createElement("ui-icon");
		icon.setAttribute("icon", "lamp");
		icon.setAttribute("icon-style", "duotone");
		cycleBtn.appendChild(icon);
		cycleBtn.addEventListener("click", () => {
			if (this.getThemeModeFromShellTheme() === "auto") {
				const eff = this.resolveEffectiveSystemScheme();
				this.applyThemeMode(eff === "light" ? "dark" : "light");
			} else this.applyThemeMode("auto");
		});
		themeSlot.append(cycleBtn);
		const viewSlot = document.createElement("div");
		viewSlot.className = "shell-view-toolbar-slot";
		viewSlot.setAttribute("data-shell-toolbar-view", "true");
		viewSlot.style.display = "inline-flex";
		viewSlot.style.alignItems = "center";
		viewSlot.style.gap = "0.5rem";
		viewSlot.style.flex = "1 1 auto";
		viewSlot.style.justifyContent = "flex-end";
		this.toolbarContainer.append(themeSlot, viewSlot);
		this.toolbarThemeSlot = themeSlot;
		this.toolbarViewSlot = viewSlot;
		this.themeCycleButton = cycleBtn;
		this.themeCycleIcon = icon;
		this.syncThemeToolbarControls();
	}
	getThemeModeFromShellTheme() {
		const theme = this.getThemeRefValue();
		const id = (theme?.id || "").toLowerCase();
		if (id === "dark" || theme?.colorScheme === "dark") return "dark";
		if (id === "light" || theme?.colorScheme === "light") return "light";
		return "auto";
	}
	resolveEffectiveSystemScheme() {
		return globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	}
	createShellTheme(mode) {
		if (mode === "dark") return {
			id: "dark",
			name: "Dark",
			colorScheme: "dark"
		};
		if (mode === "light") return {
			id: "light",
			name: "Light",
			colorScheme: "light"
		};
		return {
			id: "auto",
			name: "Auto",
			colorScheme: "auto"
		};
	}
	syncThemeToolbarControls() {
		const mode = this.getThemeModeFromShellTheme();
		const effectiveMode = mode === "auto" ? this.getExternalThemeModeHint() : mode;
		const iconEl = this.themeCycleIcon;
		const btn = this.themeCycleButton;
		if (!iconEl || !btn) return;
		const iconName = effectiveMode === "light" ? "sun-dim" : effectiveMode === "dark" ? "moon-stars" : "lamp";
		iconEl.setAttribute("icon", iconName);
		if (mode === "auto") {
			btn.title = "Theme: follow system — click to pin the opposite of the current appearance, then click again for auto";
			btn.setAttribute("aria-label", "Theme follows system. Activate to pin light or dark.");
		} else if (mode === "light") {
			btn.title = "Theme: light — click to follow system again";
			btn.setAttribute("aria-label", "Light theme is on. Activate to follow system appearance.");
		} else {
			btn.title = "Theme: dark — click to follow system again";
			btn.setAttribute("aria-label", "Dark theme is on. Activate to follow system appearance.");
		}
	}
	async applyThemeMode(mode) {
		this.setTheme(this.createShellTheme(mode));
		try {
			const current = await loadSettings();
			const saved = await saveSettings({
				...current,
				appearance: {
					...current.appearance || {},
					theme: mode
				}
			});
			applyTheme(saved);
		} catch (error) {
			console.warn(`[${this.id}] Failed to save theme mode:`, error);
		}
	}
	getExternalThemeModeHint() {
		const scheme = (document?.documentElement?.getAttribute?.("data-scheme") || "").toLowerCase();
		if (scheme === "light" || scheme === "dark") return scheme;
		return "auto";
	}
	bindThemeAttrObserver() {
		this.themeAttrObserver?.disconnect();
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		this.themeAttrObserver = new MutationObserver(() => {
			this.syncThemeToolbarControls();
		});
		this.themeAttrObserver.observe(root, {
			attributes: true,
			attributeFilter: ["data-scheme", "data-theme"]
		});
	}
	/**
	* Setup path-based navigation (listen to route-change events)
	* @deprecated Use setupPopstateNavigation instead
	*/
	setupHashNavigation() {}
	/**
	* Setup popstate navigation (back/forward buttons)
	*/
	setupPopstateNavigation() {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		globalThis?.addEventListener?.("popstate", (event) => {
			const navToken = ++this.navigationToken;
			const fallbackView = this.getViewFromPathname();
			const viewId = event.state?.viewId || fallbackView || "home";
			const popParams = event.state?.params ?? Object.fromEntries(new URLSearchParams(globalThis.location.search || ""));
			if (viewId !== this.currentView.value || !this.sameRouteParams(popParams, this.navigationState.params)) {
				const previousViewId = this.navigationState.currentView;
				this.navigationState.previousView = previousViewId;
				this.navigationState.currentView = viewId;
				this.navigationState.params = popParams;
				this.currentView.value = viewId;
				const hist = this.navigationState.viewHistory;
				const idx = hist.lastIndexOf(viewId);
				if (idx >= 0) this.navigationState.viewHistory = hist.slice(0, idx + 1);
				else this.navigationState.viewHistory = [viewId];
				this.loadView(viewId, popParams).then((element) => {
					if (navToken !== this.navigationToken) return;
					return this.renderViewWithTransition(element);
				}).then(() => {
					if (navToken !== this.navigationToken) return;
					scheduleViewModulePrefetch(viewId);
					this.hideShellLoadingPlaceholder();
				}).catch(console.error);
			}
		});
	}
	invokeCurrentViewOnShow() {
		const entry = this.loadedViews.get(this.currentView.value);
		if (entry?.view?.lifecycle?.onShow) try {
			entry.view.lifecycle.onShow();
		} catch (error) {
			console.warn(`[${this.id}] View ${this.currentView.value} onShow error:`, error);
		}
		if (this.currentView.value === "settings" || this.currentView.value === "workcenter") resyncThemeAfterAdoptedViewSheet();
	}
	/**
	* Get view ID from current pathname
	* WHY: strip VDS mounts (`/cwsp`, `/markdown`) so `/cwsp/settings` boots Settings.
	*/
	getViewFromPathname() {
		if (typeof window === "undefined" || typeof window == "undefined") return null;
		const stripped = stripHistoryBase(String(globalThis?.location?.pathname || "/")).replace(/^\//, "").toLowerCase();
		if (!stripped || stripped === "/") {
			const stateView = (globalThis?.history?.state)?.viewId;
			return stateView && isEnabledView(String(stateView)) ? stateView : null;
		}
		if ((stripped.split("/").filter(Boolean)[0] || "") === "settings" && isEnabledView("settings")) return "settings";
		return isEnabledView(stripped) ? stripped : null;
	}
};
//#endregion
export { resolveShellOverlaysMount as i, SHELL_SLOT as n, resolveOverlayMountPoint as r, ShellBase as t };
