import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { n as initializeLayers, t as ensureAppLayers } from "../chunks/app-layers.js";
import { c as isCwspNativeHost, h as shouldHandoffViewToSibling, n as SKU_HUB_PATHS, p as publicHrefForView, s as inferCwspSkuFromLocation } from "../chunks/ecosystem-skus.js";
import { f as isEnabledView, n as ENABLED_VIEW_IDS$1, p as pickEnabledView, t as DEFAULT_VIEW_ID } from "../chunks/views.js";
import { P as defineElement } from "../vendor/culori.js";
import { i as initCwsNativeBridge, s as isCapacitorCwsNativeShell } from "../chunks/cws-bridge.js";
import { c as loadSettings, s as ensureCapacitorCwspSettingsSeeded, u as DEFAULT_SETTINGS } from "../chunks/packet-wire-hash.js";
import "../chunks/Settings.js";
import { c as __decorate, o as UIElement } from "../com/app5.js";
import "../chunks/settings-shell-profile.js";
import { a as initializeRegistries, c as registerDefaultViews, i as defaultTheme, l as startImplicitViewMessagingBridge, o as lightTheme, p as serviceChannels, r as darkTheme, s as registerDefaultShells, t as ShellRegistry } from "../com/service.js";
import "../com/app9.js";
import { r as isViewLocalToSurface } from "../chunks/ecosystem-skus2.js";
import { n as applyTheme, t as loadStyleSystem } from "../chunks/styles.js";
import { t as applyHubSocketFromSettings } from "../chunks/hub-socket-boot.js";
import { t as isCapacitorNative } from "../chunks/capacitor-permissions2.js";
import "/fest/object.js";
import "/fest/core.js";
import { loadAsAdopted } from "/fest/style-lib.js";
import "/fest/icon.js";
[
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
//#endregion
//#region src/frontend/shells/boot/registry.ts
var ViewBase = class ViewBase extends UIElement {
	__options;
	__initialized = false;
	/** Per-element broadcast surface for intra-view messaging (slots, decorators, tooling). Separate from CWSP routing. */
	__viewChannel = null;
	set options(value) {
		this.__options = value;
	}
	get options() {
		return this.__options;
	}
	get viewChannel() {
		if (!this.__viewChannel) this.__viewChannel = new EventTarget();
		return this.__viewChannel;
	}
	dispatchViewChannel(type, detail, init) {
		return this.viewChannel.dispatchEvent(new CustomEvent(type, {
			...init,
			detail
		}));
	}
	subscribeViewChannel(type, listener) {
		const bus = this.viewChannel;
		bus.addEventListener(type, listener);
		return () => bus.removeEventListener(type, listener);
	}
	viewInitialize() {
		const opts = this.options;
		opts?.initializator?.call?.(this, this, opts);
		return this;
	}
	constructor() {
		super();
	}
	onInitialize() {
		super.onInitialize?.call?.(this);
		this?.viewInitialize?.call?.(this);
		return this;
	}
};
ViewBase = __decorate([defineElement("cw-view-base")], ViewBase);
//#endregion
//#region ../../modules/projects/subsystem/src/boot/history-base.ts
var KNOWN_PATH_MOUNTS = [
	"cwsp",
	"transfer",
	"markdown",
	"document",
	"viewer",
	"explorer",
	"workcenter",
	"process",
	"ai",
	"kvm"
];
/** Dedicated PWA hosts — app lives at `/`. Hub/LAN keep `/markdown` `/viewer` path mounts. */
var DEDICATED_SKU_HOSTS = [
	"md.u2re.space",
	"www.md.u2re.space",
	"explorer.u2re.space",
	"www.explorer.u2re.space",
	"process.u2re.space",
	"workcenter.u2re.space",
	"ai.u2re.space",
	"cwsp.u2re.space",
	"www.cwsp.u2re.space",
	"transfer.u2re.space"
];
function isDedicatedSkuHost(hostname) {
	try {
		const host = String(hostname ?? globalThis.location?.hostname ?? "").toLowerCase();
		return DEDICATED_SKU_HOSTS.includes(host);
	} catch {
		return false;
	}
}
function isKnownPathMountSegment(segment) {
	return KNOWN_PATH_MOUNTS.includes(String(segment || "").toLowerCase());
}
/**
* On a named SKU host, `/viewer` `/markdown` `/explorer` … are Fastify aliases of `/`, not view routes.
* WHY: minimal path-routing wrote `/viewer?shell=minimal` → 302 `/viewer/` → 302 `/` → bootloop.
*/
function pathForSkuHostView(viewPath) {
	let path = String(viewPath || "/").trim() || "/";
	if (!path.startsWith("/")) path = `/${path}`;
	const sku = inferCwspSkuFromLocation();
	const nativeSku = isCwspNativeHost() && !!sku && sku !== "launcher" && sku !== "crx";
	if (!isDedicatedSkuHost() && !nativeSku) return path;
	const seg = path.replace(/^\/+/, "").split("/")[0]?.toLowerCase() || "";
	if (!seg || !isKnownPathMountSegment(seg)) return path;
	if (sku && sku !== "launcher" && sku !== "crx") return SKU_HUB_PATHS[sku]?.includes(seg) ? "/" : path;
	return "/";
}
/**
* Router base path without trailing slash ("" at domain root, "/cwsp" on IP path mount).
* WHY: absolute `/network` history entries drop the Fastify debugPath prefix and 404 on reload.
*/
function getHistoryBasePath() {
	try {
		const fromData = String(globalThis.document?.documentElement?.dataset?.cwspRouterBase || "").trim();
		if (fromData) return (fromData.startsWith("/") ? fromData : `/${fromData}`).replace(/\/+$/, "") || "";
		const baseHref = globalThis.document?.querySelector?.("base")?.getAttribute("href");
		if (baseHref && baseHref !== "/" && !baseHref.startsWith(".")) {
			const origin = globalThis.location?.origin || "http://localhost";
			return new URL(baseHref, origin).pathname.replace(/\/+$/, "") || "";
		}
		if (isDedicatedSkuHost()) return "";
		const pathname = String(globalThis.location?.pathname || "/");
		const re = new RegExp(`^/(${KNOWN_PATH_MOUNTS.join("|")})(?:/|$)`, "i");
		const m = pathname.match(re);
		if (m?.[1]) return `/${m[1].toLowerCase()}`;
	} catch {}
	return "";
}
/** Prefix an absolute app path with the history base (`/network` → `/cwsp/network`). */
function withHistoryBase(pathname) {
	const base = getHistoryBasePath();
	let path = String(pathname || "/").trim() || "/";
	if (!path.startsWith("/")) path = `/${path}`;
	if (!base) return path;
	if (path === base || path.startsWith(`${base}/`)) return path;
	const pathSeg = path.replace(/^\/+/, "").split("/")[0]?.toLowerCase() || "";
	const baseSeg = base.replace(/^\/+/, "").split("/")[0]?.toLowerCase() || "";
	if (baseSeg && pathSeg && isKnownPathMountSegment(baseSeg) && isKnownPathMountSegment(pathSeg) && pathSeg !== baseSeg) return path;
	if (path === "/") return `${base}/`;
	return `${base}${path}`;
}
/** Strip history base from a location pathname before view matching. */
function stripHistoryBase(pathname) {
	const base = getHistoryBasePath();
	let path = String(pathname || "/");
	if (!path.startsWith("/")) path = `/${path}`;
	if (!base) return path;
	if (path === base || path === `${base}/`) return "/";
	if (path.startsWith(`${base}/`)) {
		const rest = path.slice(base.length);
		return rest.startsWith("/") ? rest : `/${rest}`;
	}
	return path;
}
/** Persist detected mount on `<html>` so later navigations stay scoped. */
function ensureHistoryBaseDataset() {
	const base = getHistoryBasePath();
	try {
		const el = globalThis.document?.documentElement;
		if (el && base) el.dataset.cwspRouterBase = base;
	} catch {}
	return base;
}
//#endregion
//#region ../../modules/projects/subsystem/src/boot/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
/** Soft legacy default key — when absent or not remembered, prefer `environment`. */
var LS_BOOT_SHELL = "rs-boot-shell";
var LAST_ACTIVE_MAX_MS = 2592e6;
/**
* VDS public hub (`apps/.../vds-main` → u2re.space) stamps `data-cwsp-surface="vds-main"`.
* WHY: bookmarks / deep links often carry `?shell=minimal` from Capacitor/control; hub must stay desktop.
*/
function isForcedEnvironmentBootSurface() {
	try {
		if (globalThis.document?.documentElement?.dataset?.cwspSurface !== "vds-main") return false;
		const host = String(globalThis.location?.hostname || "").toLowerCase();
		if (!(host === "u2re.space" || host === "www.u2re.space")) return false;
		return !getHistoryBasePath();
	} catch {
		return false;
	}
}
/** Returns `environment` when the current document is the VDS hub; otherwise `null`. */
function resolveForcedBootShell() {
	if (isForcedEnvironmentBootSurface()) return "environment";
	try {
		const sku = inferCwspSkuFromLocation();
		if (sku && sku !== "launcher" && sku !== "crx") return "minimal";
	} catch {}
	return null;
}
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return shell;
	return getDefaultBootShellId();
}
/**
* Viewport coercion for boot shell ids.
* WHY: previously demoted `environment` → `minimal` on phones; CWSP-shell keeps environment
* as the launcher/NTP shell on mobile. Pass-through keeps explicit choices intact.
*/
function coerceShellForBootViewport(shell) {
	return shell;
}
/**
* Canonical default when no explicit shell preference exists: environment launcher.
*/
function getDefaultBootShellId() {
	return "environment";
}
/**
* Soft `minimal` from older builds was the implicit default — promote to environment
* unless the user checked “Remember my choice”.
*/
function promoteSoftMinimalShellPreference(shell) {
	if (isForcedEnvironmentBootSurface()) {
		try {
			globalThis.localStorage?.setItem(LS_BOOT_SHELL, "environment");
		} catch {}
		return "environment";
	}
	if (shell !== "minimal") return coerceShellForBootViewport(shell);
	try {
		if (globalThis.localStorage?.getItem("rs-boot-remember") === "1") return "minimal";
	} catch {}
	try {
		globalThis.localStorage?.setItem(LS_BOOT_SHELL, "environment");
	} catch {}
	return "environment";
}
function readLastActiveBootShell() {
	try {
		const raw = globalThis.localStorage?.getItem(LS_BOOT_SHELL_LAST_ACTIVE);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.t !== "number" || typeof parsed.shell !== "string") return null;
		if (Date.now() - parsed.t > LAST_ACTIVE_MAX_MS) return null;
		return normalizeBootShellId(parsed.shell);
	} catch {
		return null;
	}
}
//#endregion
//#region ../../modules/projects/subsystem/src/boot/capacitor-settings-permissions.ts
var capacitor_settings_permissions_exports = /* @__PURE__ */ __exportAll({ ensureCapacitorBridgeDaemonStarted: () => ensureCapacitorBridgeDaemonStarted });
var cap = () => {
	try {
		const c = globalThis?.Capacitor;
		return c && typeof c === "object" ? c : null;
	} catch {
		return null;
	}
};
var plugin = (name) => {
	const p = cap()?.Plugins?.[name];
	return p && typeof p === "object" ? p : null;
};
var callSafe = async (fn, ...args) => {
	try {
		return typeof fn === "function" ? await fn(...args) : void 0;
	} catch (e) {
		console.warn("[capacitor-settings-permissions]", e);
		return;
	}
};
/**
* Cold-start (or keep) the Android foreground bridge on app boot.
* WHY: previously only Settings Save / Share / CONFIGURE started CwspBridgeService.
*/
var ensureCapacitorBridgeDaemonStarted = async (settings) => {
	if (!isCapacitorNative()) return false;
	if (!(((settings?.shell || {}).bridgeDaemonEnabled ?? true) !== false)) return false;
	if (settings?.shell) {
		settings.shell.acceptSmsBridgeData = false;
		settings.shell.enableNativeSms = false;
	}
	const platform = plugin("CwsPlatform");
	if (!platform?.startCwspBridge) return false;
	await callSafe(platform.startCwspBridge);
	return true;
};
//#endregion
//#region ../../modules/projects/subsystem/src/boot/BootLoader.ts
var normalizeShellId = (shell) => {
	if (shell === "faint") return "tabbed";
	if (shell === "base") return "immersive";
	return shell;
};
/**
* Style system configurations
*/
var STYLE_CONFIGS = {
	"raw": {
		name: "Raw (No Framework)",
		stylesheets: [],
		description: "No CSS framework, raw browser defaults",
		recommendedShells: ["immersive"]
	},
	"vl-core": {
		name: "Core (Shared Foundation)",
		stylesheets: [],
		description: "Shared foundation styles for all veela variants",
		recommendedShells: ["immersive", "minimal"]
	},
	"vl-basic": {
		name: "Basic Veela Styles",
		stylesheets: [],
		description: "Minimal styling for basic functionality",
		recommendedShells: [
			"window",
			"tabbed",
			"minimal",
			"environment",
			"immersive",
			"content"
		]
	},
	"vl-advanced": {
		name: "Advanced (Full-Featured Styling)",
		stylesheets: [],
		description: "Full-featured styling with design tokens and effects",
		recommendedShells: [
			"tabbed",
			"minimal",
			"environment"
		]
	},
	"vl-beercss": {
		name: "BeerCSS (Beer CSS Compatible)",
		stylesheets: [],
		description: "Beer CSS compatible styling with Material Design 3",
		recommendedShells: ["tabbed"]
	}
};
/**
* Boot Loader
* 
* Manages the application boot sequence with proper ordering:
* Styles → Shell → View → Channels
*/
var BootLoader = class BootLoader {
	static instance;
	state = {
		phase: "idle",
		styleSystem: null,
		shell: null,
		view: null,
		error: null
	};
	stateChangeHandlers = /* @__PURE__ */ new Set();
	shellInstance = null;
	/** MutationObserver-driven view host bindings (shared routing); disconnected between boots. */
	implicitBridgeCleanup = null;
	phaseHandlers = /* @__PURE__ */ new Map();
	constructor() {
		initializeRegistries();
	}
	static getInstance() {
		if (!BootLoader.instance) BootLoader.instance = new BootLoader();
		return BootLoader.instance;
	}
	/**
	* Execute the boot sequence
	*/
	async boot(container, config) {
		console.log("[BootLoader] Starting boot sequence:", config);
		try {
			if (this.shellInstance) try {
				this.implicitBridgeCleanup?.();
				this.implicitBridgeCleanup = null;
				ShellRegistry.unload(this.shellInstance.id);
			} catch (error) {
				console.warn("[BootLoader] Failed to unload previous shell:", error);
			} finally {
				this.shellInstance = null;
			}
			initializeLayers();
			initCwsNativeBridge().catch(() => {});
			if (isCapacitorCwsNativeShell()) {
				import("../chunks/capacitor-share-intent2.js").then((mod) => mod.installCapacitorShareIntentBridge()).catch(() => void 0);
				import("../chunks/capacitor-clipboard-asset2.js").then((mod) => mod.installCapacitorClipboardAssetBridge()).catch(() => void 0);
				import("../com/app3.js").then((n) => n._).then((mod) => mod.ensureNativeStorageProvide()).catch(() => void 0);
			}
			try {
				const { initFrontendDebugCapture } = await import("../chunks/frontend-debug-capture2.js");
				initFrontendDebugCapture();
			} catch {}
			const persistedSettings = await loadSettings().catch((error) => {
				console.warn("[BootLoader] Failed to load settings:", error);
				return null;
			});
			let effectiveSettings = persistedSettings;
			if (isCapacitorCwsNativeShell()) {
				const seeded = await ensureCapacitorCwspSettingsSeeded().catch(() => null);
				if (seeded) effectiveSettings = seeded;
			}
			if (effectiveSettings) applyHubSocketFromSettings(effectiveSettings).catch(() => void 0);
			if (isCapacitorCwsNativeShell()) ensureCapacitorBridgeDaemonStarted(effectiveSettings).catch((error) => {
				console.warn("[BootLoader] CWSP bridge daemon auto-start skipped:", error);
			});
			applyTheme(effectiveSettings ?? DEFAULT_SETTINGS);
			if (!(() => {
				try {
					const g = globalThis;
					const surface = typeof document !== "undefined" ? String(document.documentElement?.dataset?.cwspSurface || "") : "";
					const protocol = String(globalThis.location?.protocol || "");
					const nativeShell = typeof document !== "undefined" ? String(document.documentElement?.dataset?.cwspNativeShell || "") : "";
					return Boolean(g.__CWS_SKIP_PWA__ || g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__ || g.Neutralino || typeof g.NL_OS === "string" || protocol === "chrome-extension:" || nativeShell === "crx" || surface.includes("crx") || surface === "cwsp-control" || surface === "gateway");
				} catch {
					return false;
				}
			})()) try {
				const { initIngressPWA } = await import("../index.js").then((n) => n.t);
				await initIngressPWA();
			} catch (e) {
				console.warn("[BootLoader] Share-target / service worker ingress failed (non-fatal):", e);
			}
			await this.loadStyles(config.styleSystem);
			const persistedTheme = this.resolveThemeFromSettings(persistedSettings);
			const shell = await this.loadShell(config.shell, container);
			shell.setTheme(config.theme || persistedTheme);
			await shell.mount(container);
			this.implicitBridgeCleanup?.();
			this.implicitBridgeCleanup = startImplicitViewMessagingBridge();
			if (config.channels && config.channels.length > 0) await this.initChannels(config.channels, config.channelPriorityId);
			if (config.skipInitialNavigate) this.dismissShellLoadingSpinner(shell);
			else {
				let bootParams;
				try {
					bootParams = Object.fromEntries(new URLSearchParams(globalThis.location?.search || ""));
				} catch {
					bootParams = void 0;
				}
				await shell.navigate(config.defaultView, bootParams);
			}
			this.setPhase("ready");
			try {
				if (typeof document !== "undefined") document.documentElement.dataset.cwspBoot = "ready";
				globalThis.dispatchEvent?.(new CustomEvent("cwsp:boot-ready"));
			} catch {}
			if (config.rememberChoice) this.savePreferences(config);
			console.log("[BootLoader] Boot complete");
			return shell;
		} catch (error) {
			console.error("[BootLoader] Boot failed:", error);
			this.updateState({
				phase: "error",
				error
			});
			throw error;
		}
	}
	resolveThemeFromSettings(settings) {
		const theme = settings?.appearance?.theme || "auto";
		if (theme === "dark") return darkTheme;
		if (theme === "light") return lightTheme;
		return defaultTheme;
	}
	/** Hide immersive/minimal shell loading row when skipping {@link Shell.navigate}. */
	dismissShellLoadingSpinner(shell) {
		try {
			const loading = shell.getElement().shadowRoot?.querySelector(".app-shell__loading");
			if (loading) loading.hidden = true;
		} catch {}
	}
	/**
	* Load style system
	*/
	async loadStyles(styleSystem) {
		this.setPhase("styles");
		console.log(`[BootLoader] Loading style system: ${styleSystem}`);
		const config = STYLE_CONFIGS[styleSystem] || STYLE_CONFIGS["vl-basic"];
		try {
			await loadStyleSystem(styleSystem);
		} catch (error) {
			console.error(`[BootLoader] Failed to load style system: ${styleSystem}`, error);
			throw error;
		}
		for (const sheet of config.stylesheets) try {
			await loadAsAdopted(sheet);
		} catch (error) {
			console.warn(`[BootLoader] Failed to load stylesheet: ${sheet}`, error);
		}
		this.updateState({ styleSystem });
		console.log(`[BootLoader] Style system ${styleSystem} loaded`);
	}
	/**
	* Load and initialize shell
	*/
	async loadShell(shellId, container) {
		this.setPhase("shell");
		const normalizedShell = normalizeShellId(shellId);
		if (normalizedShell !== shellId) console.warn(`[BootLoader] Shell "${shellId}" is temporarily disabled, redirecting to "${normalizedShell}"`);
		console.log(`[BootLoader] Loading shell: ${normalizedShell}`);
		const shell = await ShellRegistry.load(normalizedShell, container);
		this.shellInstance = shell;
		this.updateState({ shell: normalizedShell });
		console.log(`[BootLoader] Shell ${normalizedShell} loaded`);
		return shell;
	}
	/**
	* Initialize service channels: one high-priority channel blocks boot, the rest
	* run when the browser is idle so startup stays within interactive budgets.
	*/
	async initChannels(channelIds, priorityId) {
		this.setPhase("channels");
		const unique = [...new Set(channelIds)];
		if (unique.length === 0) return;
		const primary = (priorityId && unique.includes(priorityId) ? priorityId : null) ?? unique[0];
		const rest = unique.filter((id) => id !== primary);
		console.log(`[BootLoader] Initializing primary channel:`, primary, rest.length ? `(+${rest.length} deferred)` : "");
		try {
			await serviceChannels.initChannel(primary);
		} catch (error) {
			console.warn(`[BootLoader] Failed to init primary channel ${primary}:`, error);
		}
		if (rest.length === 0) {
			console.log("[BootLoader] Channels initialized");
			return;
		}
		const runDeferred = () => {
			(async () => {
				for (const channelId of rest) try {
					await serviceChannels.initChannel(channelId);
				} catch (error) {
					console.warn(`[BootLoader] Failed to init channel ${channelId}:`, error);
				}
				console.log("[BootLoader] Deferred channels initialized:", rest);
			})();
		};
		if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(runDeferred, { timeout: 5e3 });
		else globalThis.setTimeout?.(runDeferred, 0);
	}
	/**
	* Update state and notify handlers
	*/
	updateState(partial) {
		Object.assign(this.state, partial);
		this.notifyStateChange();
	}
	/**
	* Set current phase and notify handlers
	*/
	setPhase(phase) {
		this.updateState({ phase });
		const handlers = this.phaseHandlers.get(phase);
		if (handlers) for (const handler of handlers) try {
			handler(this.state);
		} catch (error) {
			console.error(`[BootLoader] Phase handler error:`, error);
		}
	}
	/**
	* Notify all state change handlers
	*/
	notifyStateChange() {
		for (const handler of this.stateChangeHandlers) try {
			handler(this.state);
		} catch (error) {
			console.error(`[BootLoader] State handler error:`, error);
		}
	}
	/**
	* Subscribe to state changes
	*/
	onStateChange(handler) {
		this.stateChangeHandlers.add(handler);
		return () => {
			this.stateChangeHandlers.delete(handler);
		};
	}
	/**
	* Register a phase handler
	*/
	onPhase(phase, handler) {
		if (!this.phaseHandlers.has(phase)) this.phaseHandlers.set(phase, /* @__PURE__ */ new Set());
		this.phaseHandlers.get(phase).add(handler);
		return () => {
			this.phaseHandlers.get(phase)?.delete(handler);
		};
	}
	/**
	* Get current state
	*/
	getState() {
		return { ...this.state };
	}
	/**
	* Get current shell instance
	*/
	getShell() {
		return this.shellInstance;
	}
	/**
	* Save boot preferences
	*/
	savePreferences(config) {
		try {
			const normalizedShell = normalizeShellId(config.shell);
			localStorage.setItem("rs-boot-style", config.styleSystem);
			localStorage.setItem("rs-boot-shell", normalizedShell);
			localStorage.setItem("rs-boot-view", config.defaultView);
			localStorage.setItem("rs-boot-remember", "1");
		} catch (error) {
			console.warn("[BootLoader] Failed to save preferences:", error);
		}
	}
	/**
	* Load boot preferences
	*/
	loadPreferences() {
		try {
			if (localStorage.getItem("rs-boot-remember") !== "1") return null;
			const shell = normalizeShellId(localStorage.getItem("rs-boot-shell") || "environment");
			return {
				styleSystem: localStorage.getItem("rs-boot-style") || void 0,
				shell,
				defaultView: localStorage.getItem("rs-boot-view") || void 0
			};
		} catch {
			return null;
		}
	}
	/**
	* Clear preferences
	*/
	clearPreferences() {
		try {
			localStorage.removeItem("rs-boot-style");
			localStorage.removeItem("rs-boot-shell");
			localStorage.removeItem("rs-boot-view");
			localStorage.removeItem("rs-boot-remember");
			localStorage.removeItem(LS_BOOT_SHELL_LAST_ACTIVE);
		} catch {}
	}
};
/**
* Get the singleton boot loader
*/
var bootLoader = BootLoader.getInstance();
async function bootTabbed(container, view = "home") {
	const channels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.find((c) => c === defaultView) ?? channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "tabbed",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: true
	});
}
async function bootEnvironment(container, view = "home") {
	if (typeof __RS_SHELL_ROLE__ !== "undefined" && __RS_SHELL_ROLE__ === "launcher") {
		document.documentElement.dataset.cwspShellRole = "launcher";
		document.documentElement.dataset.cwspDefaultView = "home";
	}
	const channels = [
		"home",
		"network",
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor"
	].filter((channelId) => isEnabledView(channelId));
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.find((c) => c === defaultView) ?? channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "environment",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: true
	});
}
/**
* Resolve the grid shell layer that {@link ShellBase.mount} anchors to
* (`content-row` / `content-column`). Bare `body` has no named lines → 0-height host.
* WHY: CWSP Control / Neutralino / Capacitor call `bootMinimal(document.body, …)`.
*/
function resolveMinimalShellMount(container) {
	try {
		if (container?.dataset?.appLayer === "shell") return container;
		const existing = container.querySelector?.(":scope > [data-app-layer=\"shell\"]");
		if (existing) return existing;
		return ensureAppLayers(container, {
			enableOrientLayer: false,
			enableCanvasLayer: false
		}).shellLayer;
	} catch (error) {
		console.warn("[BootLoader] ensureAppLayers failed; mounting into container directly:", error);
		return container;
	}
}
/**
* Boot with Minimal shell
*/
async function bootMinimal(container, view = "viewer", options) {
	const defaultView = pickEnabledView(view, "viewer");
	/** Minimal shell: init only the active view's channel — others register on first navigate (see ShellBase.loadView). */
	const channels = isEnabledView(defaultView) ? [defaultView] : ["viewer"];
	const channelPriorityId = channels[0];
	const mountRoot = resolveMinimalShellMount(container);
	return bootLoader.boot(mountRoot, {
		styleSystem: "vl-basic",
		shell: "minimal",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: options?.rememberChoice ?? true,
		skipInitialNavigate: options?.skipInitialNavigate ?? false
	});
}
async function bootWindow(container, view = "home") {
	const channels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.find((c) => c === defaultView) ?? channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "window",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: true
	});
}
/**
* Boot with Raw shell (minimal)
*/
async function bootBase(container, view = "viewer") {
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "base",
		defaultView: pickEnabledView(view, "viewer"),
		channels: [],
		rememberChoice: false
	});
}
async function bootContent(container, view = "home", options) {
	const defaultChannels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const channels = options?.channels !== void 0 ? options.channels : defaultChannels;
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.length > 0 ? channels.find((c) => c === defaultView) ?? channels[0] : void 0;
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "content",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: options?.rememberChoice ?? true,
		skipInitialNavigate: options?.skipInitialNavigate ?? false
	});
}
/**
* Immersive (chromeless): extension side panels / fullscreen single-view contexts.
*/
async function bootImmersive(container, view = "viewer", options) {
	const defaultView = pickEnabledView(view, "viewer");
	const channels = isEnabledView(defaultView) ? [defaultView] : ["viewer"];
	const channelPriorityId = channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "immersive",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: options?.rememberChoice ?? true,
		skipInitialNavigate: options?.skipInitialNavigate ?? false
	});
}
var VIEW_FLAGS = {
	network: "network",
	settings: "settings",
	viewer: "viewer",
	editor: "editor",
	workcenter: "workcenter",
	explorer: "explorer",
	history: "history",
	home: "home",
	print: "print"
};
/**
* Optional per-build allowlist: `VITE_ENABLED_VIEWS="network,settings"` restricts
* which views are enabled (e.g. the Capacitor CWSAndroid shell: Network + Settings
* only). When unset, all flagged views are enabled. Read from Vite env first,
* then Node env, guarded for non-bundled (tsx) contexts.
*/
var readEnabledViewsAllowlist = () => {
	let raw = "";
	try {
		const search = globalThis?.location?.search;
		if (search) {
			const params = new URLSearchParams(search);
			raw = String(params.get("views") || params.get("enabledViews") || "");
		}
	} catch {}
	if (!raw) try {
		raw = String(globalThis?.localStorage?.getItem?.("rs-enabled-views") ?? "");
	} catch {}
	if (!raw) try {
		raw = String("");
	} catch {}
	if (!raw) try {
		raw = String(globalThis?.process?.env?.VITE_ENABLED_VIEWS ?? "");
	} catch {}
	const list = raw.split(/[\s,;]+/).map((entry) => entry.trim().toLowerCase()).filter(Boolean);
	if (!list.length) return null;
	list.push("settings");
	try {
		const search = globalThis?.location?.search;
		if (search && new URLSearchParams(search).get("views")) globalThis?.localStorage?.setItem?.("rs-enabled-views", Array.from(new Set(list)).join(","));
	} catch {}
	return new Set(list);
};
var ENABLED_VIEWS_ALLOWLIST = readEnabledViewsAllowlist();
/**
* Build-time gate: the host bundler (CWSP-shell Vite) replaces `__RS_VIEW_<ID>__`
* with a boolean from `VITE_ENABLED_VIEWS`. `typeof` is safe for undeclared
* globals (returns "undefined") so non-bundled/tsx contexts fall back to enabled.
*/
var BUILD_VIEW_FLAGS = {
	viewer: true,
	editor: true,
	workcenter: true,
	explorer: true,
	settings: true,
	history: true,
	home: true,
	print: true,
	network: true
};
var buildAllows = (viewId) => BUILD_VIEW_FLAGS[String(viewId).toLowerCase()] !== false;
var runtimeAllows = (viewId) => !ENABLED_VIEWS_ALLOWLIST || ENABLED_VIEWS_ALLOWLIST.has(String(viewId).toLowerCase());
var isViewAllowed = (viewId) => buildAllows(viewId) && runtimeAllows(viewId);
Object.entries(VIEW_FLAGS).filter(([viewId, enabled]) => Boolean(enabled) && isViewAllowed(viewId) && isViewLocalToSurface(viewId)).map(([viewId]) => viewId);
//#endregion
//#region ../../modules/projects/subsystem/src/other/config/settings/settings-shell-profile.ts
var HUB_SETTINGS_ALIASES = {
	"": "hub",
	hub: "hub",
	shell: "hub",
	explorer: "explorer",
	cwsp: "transfer",
	transfer: "transfer",
	viewer: "document",
	markdown: "document",
	document: "document",
	md: "document",
	process: "process",
	workcenter: "process"
};
/** Canonical path segment for a hub settings section (`hub` → no extra segment). */
var hubSettingsSectionPath = (section) => {
	if (section === "hub") return "";
	if (section === "document") return "markdown";
	return section;
};
var canonicalHubSettingsSection = (raw) => {
	return HUB_SETTINGS_ALIASES[String(raw || "").trim().toLowerCase()] || "hub";
};
//#endregion
//#region ../../modules/projects/subsystem/src/boot/routing.ts
/** Default view when URL/localStorage do not specify one (Capacitor: Network home). */
var resolveShellDefaultView = (shell) => {
	const skuDefault = inferCwspSkuFromLocation();
	const preferred = skuDefault === "explorer" ? "explorer" : skuDefault === "process" ? "workcenter" : skuDefault === "transfer" ? "network" : skuDefault === "document" ? "viewer" : "";
	if (shell === "minimal" && preferred) return pickEnabledView(preferred, "settings");
	if (shell === "minimal" && isEnabledView("network")) return "network";
	if (shell === "base" || shell === "immersive" || shell === "minimal") return pickEnabledView(preferred || "viewer", "settings");
	return "home";
};
var normalizeShellPreference = (shell) => normalizeBootShellId(shell);
var getShellFromQuery = () => {
	if (resolveForcedBootShell()) return null;
	try {
		const shell = (new URLSearchParams(location.search).get("shell") || "").trim().toLowerCase();
		if (shell === "minimal" || shell === "faint" || shell === "base" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return normalizeShellPreference(shell);
	} catch {}
	return null;
};
/** All registered view routes */
var VALID_VIEWS = [...ENABLED_VIEW_IDS$1];
pickEnabledView("home", DEFAULT_VIEW_ID);
/**
* Normalize pathname (remove history/VDS base, leading/trailing slashes)
*/
function normalizePathname(pathname) {
	ensureHistoryBaseDataset();
	const stripped = stripHistoryBase(pathname);
	const base = document.querySelector("base")?.getAttribute("href") || "/";
	let normalized = stripped;
	if (base !== "/" && !base.startsWith(".") && stripped.startsWith(base.replace(/\/$/, ""))) normalized = stripped.slice(base.replace(/\/$/, "").length);
	return normalized.replace(/^\/+|\/+$/g, "").toLowerCase();
}
/**
* Build URL from route.
* WHY: prefer `/${view}?…` so environment/native deep links stay readable
* (`/settings?shell=environment&native=1`), not root `/?view=settings`.
*/
function buildUrl(route) {
	ensureHistoryBaseDataset();
	const view = String(route.view || "").trim().replace(/^\/+/, "").toLowerCase();
	if (shouldHandoffViewToSibling(view)) return publicHrefForView(view) || `/${view}`;
	const params = { ...route.params || {} };
	let path;
	if (view === "settings") {
		const section = hubSettingsSectionPath(canonicalHubSettingsSection(String(params.section || "").trim()));
		delete params.section;
		path = section ? withHistoryBase(`/settings/${section}`) : withHistoryBase("/settings");
	} else path = view && view !== "home" ? withHistoryBase(pathForSkuHostView(`/${view}`)) : withHistoryBase("/");
	let url = path;
	if (Object.keys(params).length > 0) {
		const search = new URLSearchParams(params).toString();
		url += (url.includes("?") ? "&" : "?") + search;
	}
	return url;
}
/**
* Navigate to a route (view)
*/
function navigate(route, options = {}) {
	const url = buildUrl(route);
	if (shouldHandoffViewToSibling(route.view) || /^https?:\/\//i.test(url)) {
		globalThis.location.assign(url);
		return;
	}
	if (options.replace) history.replaceState(options.state ?? route, "", url);
	else history.pushState(options.state ?? route, "", url);
	globalThis?.dispatchEvent?.(new CustomEvent("route-change", { detail: route }));
}
/**
* Navigate to a view
*/
function navigateToView(view, params) {
	navigate({
		view,
		params
	});
}
/**
* Check if a view is valid
*/
function isValidView(view) {
	return isEnabledView(view);
}
/**
* Get view from pathname
*/
function getViewFromPath() {
	const pathname = normalizePathname(location.pathname);
	if (!pathname || pathname === "/" || pathname === "") {
		const fromState = history.state?.viewId || "";
		if (fromState && isValidView(fromState)) return fromState;
		return null;
	}
	if (isValidView(pathname)) return pathname;
	if ((pathname.split("/").filter(Boolean)[0] || "") === "settings") return "settings";
	return null;
}
/**
* Get saved shell preference
*/
function getSavedShellPreference() {
	const forced = resolveForcedBootShell();
	if (forced) {
		try {
			localStorage.setItem("rs-boot-shell", forced);
		} catch {}
		return forced;
	}
	try {
		if (isDedicatedSkuHost() || getHistoryBasePath()) return getShellFromQuery() || "minimal";
	} catch {}
	const fromQuery = getShellFromQuery();
	if (fromQuery) {
		try {
			localStorage.setItem("rs-boot-shell", fromQuery);
		} catch {}
		return coerceShellForBootViewport(fromQuery);
	}
	try {
		const saved = localStorage.getItem("rs-boot-shell");
		if (saved === "minimal" || saved === "faint" || saved === "base" || saved === "window" || saved === "tabbed" || saved === "environment" || saved === "content" || saved === "immersive") {
			const normalized = normalizeShellPreference(saved);
			if (normalized !== saved) localStorage.setItem("rs-boot-shell", normalized);
			return promoteSoftMinimalShellPreference(normalized);
		}
		const lastActive = readLastActiveBootShell();
		if (lastActive && lastActive !== "immersive" && lastActive !== "content") return promoteSoftMinimalShellPreference(lastActive);
	} catch {}
	return getDefaultBootShellId();
}
/**
* Resolve the shell/view pair to mount and return a lazy mount entrypoint.
*
* AI-READ: this function does not mount immediately. It chooses the canonical
* shell, normalizes legacy aliases, picks a default view for that shell, and
* returns a loader object that the outer app entry can mount into the chosen
* shell layer.
*/
var loadSubAppWithShell = async (shellId, initialView) => {
	const shell = normalizeShellPreference(resolveForcedBootShell() || shellId || getSavedShellPreference() || getDefaultBootShellId());
	const shellDefaultView = resolveShellDefaultView(shell);
	let nativeViewHint = null;
	try {
		const sp = new URLSearchParams(location.search || "");
		if (sp.get("native") === "1" || sp.get("native") === "true") {
			const qView = (sp.get("view") || "").trim().toLowerCase();
			if (qView && isEnabledView(qView)) nativeViewHint = qView;
		}
	} catch {}
	const view = pickEnabledView(initialView || getViewFromPath() || nativeViewHint || shellDefaultView, "home");
	console.log("[App] Loading sub-app with shell:", shell, "view:", view);
	try {
		switch (shell) {
			case "faint":
			case "tabbed": return { mount: async (el) => {
				await bootTabbed(el, view);
			} };
			case "environment": return { mount: async (el) => {
				await bootEnvironment(el, view);
			} };
			case "base": return { mount: async (el) => {
				await bootBase(el, view);
			} };
			case "immersive": return { mount: async (el) => {
				await bootImmersive(el, view);
			} };
			case "content": return { mount: async (el) => {
				await bootContent(el, view);
			} };
			case "window": return { mount: async (el) => {
				await bootWindow(el, view);
			} };
			case "minimal": return { mount: async (el) => {
				await bootMinimal(el, view);
			} };
			default: return { mount: async (el) => {
				await bootMinimal(el, view);
			} };
		}
	} catch (error) {
		console.error("[App] Failed to load sub-app:", shell, error);
		throw error;
	}
};
//#endregion
//#region src/frontend/shells/boot/index.ts
var boot_exports = /* @__PURE__ */ __exportAll({
	BootLoader: () => BootLoader,
	VALID_VIEWS: () => VALID_VIEWS,
	ViewBase: () => ViewBase,
	bootBase: () => bootBase,
	bootContent: () => bootContent,
	bootEnvironment: () => bootEnvironment,
	bootImmersive: () => bootImmersive,
	bootMinimal: () => bootMinimal,
	bootTabbed: () => bootTabbed,
	bootWindow: () => bootWindow,
	buildUrl: () => buildUrl,
	darkTheme: () => darkTheme,
	defaultTheme: () => defaultTheme,
	getSavedShellPreference: () => getSavedShellPreference,
	getShellFromQuery: () => getShellFromQuery,
	getViewFromPath: () => getViewFromPath,
	initializeRegistries: () => initializeRegistries,
	isValidView: () => isValidView,
	lightTheme: () => lightTheme,
	loadSubAppWithShell: () => loadSubAppWithShell,
	navigate: () => navigate,
	navigateToView: () => navigateToView,
	registerDefaultShells: () => registerDefaultShells,
	registerDefaultViews: () => registerDefaultViews
});
//#endregion
export { navigateToView as n, capacitor_settings_permissions_exports as r, boot_exports as t };
