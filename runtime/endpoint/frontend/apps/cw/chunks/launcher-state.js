import { n as __exportAll } from "./rolldown-runtime.js";
import { d as makeObjectAssignable, p as safe, s as observe, u as stringRef } from "../fest/object.js";
import { C as loadDesktopRaw, S as decodeDesktopState, b as saveUIState, x as JSOX, y as makeUIState } from "../com/app2.js";
//#region ../../modules/views/home-view/src/ts/launcher-state.ts
var launcher_state_exports = /* @__PURE__ */ __exportAll({
	NAVIGATION_SHORTCUTS: () => NAVIGATION_SHORTCUTS,
	addSpeedDialItem: () => addSpeedDialItem,
	applyGridSettings: () => applyGridSettings,
	buildSpeedDialViewPathHref: () => buildSpeedDialViewPathHref,
	createEmptySpeedDialItem: () => createEmptySpeedDialItem,
	createSpeedDialItemFromClipboard: () => createSpeedDialItemFromClipboard,
	ensureSpeedDialMeta: () => ensureSpeedDialMeta,
	findSpeedDialItem: () => findSpeedDialItem,
	getDefaultOpenLinkTarget: () => getDefaultOpenLinkTarget,
	getSpeedDialMeta: () => getSpeedDialMeta,
	gridLayoutState: () => gridLayoutState,
	isExternalWebHref: () => isExternalWebHref,
	normalizeExternalWebHref: () => normalizeExternalWebHref,
	normalizeOpenLinkTarget: () => normalizeOpenLinkTarget,
	openInDetachedBrowserWindow: () => openInDetachedBrowserWindow,
	openInNewBrowserTab: () => openInNewBrowserTab,
	parseSpeedDialItemFromJSON: () => parseSpeedDialItemFromJSON,
	parseSpeedDialItemFromURL: () => parseSpeedDialItemFromURL,
	parseSpeedDialViewFromHref: () => parseSpeedDialViewFromHref,
	persistGridLayout: () => persistGridLayout,
	persistSpeedDialItems: () => persistSpeedDialItems,
	persistSpeedDialMeta: () => persistSpeedDialMeta,
	persistWallpaper: () => persistWallpaper,
	removeSpeedDialItem: () => removeSpeedDialItem,
	removeSpeedDialMeta: () => removeSpeedDialMeta,
	resolveItemOpenLinkTarget: () => resolveItemOpenLinkTarget,
	resolveSpeedDialItemHref: () => resolveSpeedDialItemHref,
	snapshotSpeedDialItem: () => snapshotSpeedDialItem,
	speedDialItems: () => speedDialItems,
	speedDialMeta: () => speedDialMeta,
	upsertSpeedDialItem: () => upsertSpeedDialItem,
	wallpaperState: () => wallpaperState
});
var viewEnabledCheck = null;
var isEnabledView = (view) => viewEnabledCheck ? viewEnabledCheck(String(view || "").trim()) : true;
var OPEN_LINK_TARGET_KEY = "rs-open-link-target";
var normalizeOpenLinkTarget = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	if (!v) return "inline";
	if (v === "inline" || v === "in-shell" || v === "env" || v === "shell") return "inline";
	if (v === "new-tab" || v === "newtab" || v === "tab" || v === "browser" || v === "browser-tab" || v === "external-tab") return "new-tab";
	if (v === "native-window" || v === "native" || v === "window" || v === "app-window") return "native-window";
	return "inline";
};
/** True for http(s), protocol-relative, or bare `www.` hosts (not app view paths). */
var isExternalWebHref = (raw) => {
	const s = String(raw || "").trim();
	if (!s || /^(mailto:|blob:|data:|javascript:)/i.test(s)) return false;
	if (/^https?:\/\//i.test(s) || /^\/\//.test(s)) return true;
	if (/^www\./i.test(s)) return true;
	if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#]|$)/i.test(s) && !s.startsWith("/") && !s.startsWith("#")) return true;
	return false;
};
/** Normalize `www…` / `//…` / bare host into an absolute http(s) URL. */
var normalizeExternalWebHref = (raw) => {
	const s = String(raw || "").trim();
	if (!s) return "";
	try {
		if (/^https?:\/\//i.test(s)) return new URL(s).href;
		if (/^\/\//.test(s)) return new URL(`https:${s}`).href;
		if (/^www\./i.test(s) || /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#]|$)/i.test(s)) return new URL(`https://${s.replace(/^\/+/, "")}`).href;
	} catch {
		return "";
	}
	return "";
};
/** Global default (Settings / localStorage); per-tile meta.openLinkTarget wins. */
var getDefaultOpenLinkTarget = () => {
	try {
		const stored = localStorage.getItem(OPEN_LINK_TARGET_KEY);
		if (stored == null || !String(stored).trim()) return "inline";
		return normalizeOpenLinkTarget(stored);
	} catch {
		return "inline";
	}
};
var resolveItemOpenLinkTarget = (meta) => {
	if (meta?.openLinkTarget != null && String(meta.openLinkTarget).trim()) return normalizeOpenLinkTarget(meta.openLinkTarget);
	if (isExternalWebHref(meta?.href)) return "new-tab";
	return getDefaultOpenLinkTarget();
};
/** WHY: document PWA disables Network at build time — hide it from add-shortcut menus too. */
var NAVIGATION_SHORTCUTS = [
	{
		view: "home",
		label: "Home",
		icon: "house-line"
	},
	{
		view: "network",
		label: "Network",
		icon: "wifi-high"
	},
	{
		view: "viewer",
		label: "Markdown",
		icon: "article"
	},
	{
		view: "explorer",
		label: "Explorer",
		icon: "books"
	},
	{
		view: "workcenter",
		label: "Work Center",
		icon: "briefcase"
	},
	{
		view: "history",
		label: "History",
		icon: "clock-counter-clockwise"
	},
	{
		view: "settings",
		label: "Settings",
		icon: "gear-six"
	}
].filter((shortcut) => isEnabledView(shortcut.view));
var STORAGE_KEY = "cw::workspace::speed-dial";
var META_STORAGE_KEY = `${STORAGE_KEY}::meta`;
var fallbackClone = (value) => {
	if (typeof structuredClone === "function") try {
		return structuredClone(safe(value));
	} catch {}
	try {
		return JSON.parse(JSON.stringify(safe(value)));
	} catch {
		return value;
	}
};
var generateItemId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `sd-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e3)}`;
};
var EXTERNAL_SHORTCUTS = [];
var DEFAULT_SPEED_DIAL_DATA_ALL = [
	{
		id: "shortcut-explorer",
		cell: observe([2, 0]),
		icon: "books",
		label: "Explorer",
		action: "open-view",
		meta: { view: "explorer" }
	},
	{
		id: "shortcut-settings",
		cell: observe([3, 0]),
		icon: "gear-six",
		label: "Settings",
		action: "open-view",
		meta: { view: "settings" }
	},
	{
		id: "shortcut-viewer",
		cell: observe([1, 0]),
		icon: "article",
		label: "Markdown",
		action: "open-view",
		meta: { view: "viewer" }
	},
	...EXTERNAL_SHORTCUTS
];
/** Drop view shortcuts that this host build disabled (e.g. Network on CWSP-document). */
var isSpeedDialViewAllowed = (meta, id) => {
	if (id === "shortcut-network" && !isEnabledView("network")) return false;
	const view = String(meta?.view || "").trim();
	if (!view) return true;
	return isEnabledView(view);
};
var DEFAULT_SPEED_DIAL_DATA = DEFAULT_SPEED_DIAL_DATA_ALL.filter((entry) => isSpeedDialViewAllowed(entry.meta, entry.id));
var splitDefaultEntries = (entries) => {
	const records = [];
	const metaEntries = [];
	entries.forEach((entry) => {
		const { meta, ...record } = entry;
		records.push(record);
		const normalizedMeta = {
			action: entry.action,
			...meta || {}
		};
		metaEntries.push([entry.id, normalizedMeta]);
	});
	return {
		records,
		metaEntries
	};
};
var { records: DEFAULT_SPEED_DIAL_RECORDS, metaEntries: DEFAULT_META_ENTRIES } = splitDefaultEntries(DEFAULT_SPEED_DIAL_DATA);
var legacyMetaBuffer = [];
var ensureCell = (cell) => {
	if (cell && Array.isArray(cell) && cell.length >= 2) return observe([Number(cell[0]) || 0, Number(cell[1]) || 0]);
	return observe([0, 0]);
};
var createMetaState = (meta = {}) => {
	return makeObjectAssignable(observe({
		action: meta.action || "open-view",
		view: meta.view || "",
		href: meta.href || "",
		description: meta.description || "",
		entityType: meta.entityType || "",
		tags: Array.isArray(meta.tags) ? [...meta.tags] : [],
		...meta
	}));
};
var registryFromEntries = (entries) => {
	const registry = /* @__PURE__ */ new Map();
	for (const [id, meta] of entries) registry.set(id, createMetaState(meta));
	return registry;
};
var normalizeMetaEntries = (raw) => {
	if (!raw) return [];
	if (raw instanceof Map) return Array.from(raw.entries());
	if (Array.isArray(raw)) return raw.map((entry) => {
		if (entry && typeof entry === "object" && "id" in entry) return [entry.id, entry.meta || entry];
		return null;
	}).filter(Boolean);
	if (typeof raw === "object") return Object.entries(raw);
	return [];
};
var packMetaRegistry = (registry) => {
	const payload = {};
	registry?.forEach((meta, id) => {
		payload[id] = fallbackClone(meta ?? {});
	});
	return payload;
};
var createInitialMetaRegistry = () => registryFromEntries(DEFAULT_META_ENTRIES);
var unpackMetaRegistry = (raw) => {
	const entries = normalizeMetaEntries(raw);
	return registryFromEntries(entries.length ? entries : DEFAULT_META_ENTRIES);
};
var unwrapRef = (value, fallback) => {
	if (value && typeof value === "object" && "value" in value) return value.value ?? fallback;
	return value ?? fallback;
};
var serializeItemState = (item) => {
	return {
		id: item.id,
		cell: [Number(item.cell?.[0]) || 0, Number(item.cell?.[1]) || 0],
		icon: unwrapRef(item.icon, "sparkle"),
		label: unwrapRef(item.label, "Shortcut"),
		action: item.action
	};
};
var createStatefulItem = (config) => {
	return observe({
		id: config.id || generateItemId(),
		cell: observe(ensureCell(config.cell)),
		icon: stringRef(config.icon || "sparkle"),
		label: stringRef(config.label || "Shortcut"),
		action: config.action || "open-view"
	});
};
var createInitialState = () => observe(DEFAULT_SPEED_DIAL_RECORDS.map(createStatefulItem));
var unpackState = (raw) => {
	const records = (Array.isArray(raw) && raw.length ? raw : DEFAULT_SPEED_DIAL_DATA).filter((entry) => isSpeedDialViewAllowed(entry.meta, entry.id)).map((entry) => {
		const { meta, ...record } = entry;
		if (meta) legacyMetaBuffer.push([entry.id, {
			action: entry.action,
			...meta
		}]);
		else legacyMetaBuffer.push([entry.id, { action: entry.action }]);
		return record;
	});
	return observe(records.map(createStatefulItem));
};
var packState = (collection) => collection.map(serializeItemState);
/**
* WHY: Vite `preserveSymlinks` can load this file via fl.ui and home-view paths as
* two module graphs. Without a process singleton, idle-save from the stale copy
* overwrites user shortcuts with defaults after refresh.
*/
var SPEED_DIAL_ITEMS_BOOT = "__CWSP_SPEED_DIAL_ITEMS_V1__";
var SPEED_DIAL_META_BOOT = "__CWSP_SPEED_DIAL_META_V1__";
var bootSpeedDialMeta = () => {
	const g = globalThis;
	if (g[SPEED_DIAL_META_BOOT]) return g[SPEED_DIAL_META_BOOT];
	const state = makeUIState(META_STORAGE_KEY, createInitialMetaRegistry, unpackMetaRegistry, packMetaRegistry);
	g[SPEED_DIAL_META_BOOT] = state;
	return state;
};
var bootSpeedDialItems = () => {
	const g = globalThis;
	if (g[SPEED_DIAL_ITEMS_BOOT]) return g[SPEED_DIAL_ITEMS_BOOT];
	const state = makeUIState(STORAGE_KEY, createInitialState, unpackState, packState);
	g[SPEED_DIAL_ITEMS_BOOT] = state;
	return state;
};
var speedDialMeta = bootSpeedDialMeta();
var speedDialItems = bootSpeedDialItems();
var persistSpeedDialItems = () => {
	try {
		saveUIState(STORAGE_KEY);
		return;
	} catch {}
	try {
		if (typeof localStorage === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSOX.stringify(packState(speedDialItems)));
	} catch {}
};
var persistSpeedDialMeta = () => {
	try {
		saveUIState(META_STORAGE_KEY);
		return;
	} catch {}
	try {
		if (typeof localStorage === "undefined") return;
		localStorage.setItem(META_STORAGE_KEY, JSOX.stringify(packMetaRegistry(speedDialMeta)));
	} catch {}
};
var getSpeedDialMeta = (id) => {
	if (!id) return null;
	return speedDialMeta?.get?.(id) ?? null;
};
var ensureSpeedDialMeta = (id, defaults = {}) => {
	let meta = speedDialMeta?.get?.(id);
	if (!meta) {
		meta = createMetaState(defaults);
		speedDialMeta?.set?.(id, meta);
		persistSpeedDialMeta();
	}
	if (defaults?.action && meta.action !== defaults.action) meta.action = defaults.action;
	return meta;
};
var removeSpeedDialMeta = (id) => {
	const removed = speedDialMeta?.delete?.(id);
	if (removed) persistSpeedDialMeta();
	return removed;
};
var syncMetaActionFromItem = (item) => {
	if (!item) return false;
	const desiredAction = item.action || "open-view";
	const meta = ensureSpeedDialMeta(item.id, { action: desiredAction });
	if (meta.action !== desiredAction) {
		meta.action = desiredAction;
		return true;
	}
	return false;
};
var syncMetaActionsForAllItems = () => {
	let changed = false;
	speedDialItems?.forEach?.((item) => {
		if (syncMetaActionFromItem(item)) changed = true;
	});
	if (changed) persistSpeedDialMeta();
};
var flushLegacyMetaBuffer = () => {
	if (!legacyMetaBuffer.length) return;
	legacyMetaBuffer.forEach(([id, meta]) => {
		const target = ensureSpeedDialMeta(id, meta);
		Object.assign(target, meta);
	});
	legacyMetaBuffer.length = 0;
	persistSpeedDialMeta();
};
flushLegacyMetaBuffer();
syncMetaActionsForAllItems();
var ensureExternalShortcuts = () => {
	let changed = false;
	EXTERNAL_SHORTCUTS.forEach((shortcut) => {
		if (!speedDialItems?.find?.((item) => item?.id === shortcut.id)) {
			const item = createStatefulItem(shortcut);
			if (shortcut.label && item.label && typeof item.label === "object" && "value" in item.label) item.label.value = shortcut.label;
			if (shortcut.icon && item.icon && typeof item.icon === "object" && "value" in item.icon) item.icon.value = shortcut.icon;
			speedDialItems.push(observe(item));
			ensureSpeedDialMeta(item.id, shortcut.meta);
			changed = true;
		} else {
			const currentMeta = getSpeedDialMeta(shortcut.id);
			if (shortcut.meta && currentMeta) {
				const nextHref = String(shortcut.meta.href ?? "");
				if (nextHref !== String(currentMeta.href ?? "")) {
					currentMeta.href = nextHref;
					changed = true;
				}
				const nextDesc = String(shortcut.meta.description ?? "");
				if (nextDesc !== String(currentMeta.description ?? "")) {
					currentMeta.description = nextDesc;
					changed = true;
				}
			} else if (shortcut.meta && !currentMeta) {
				ensureSpeedDialMeta(shortcut.id, shortcut.meta);
				changed = true;
			}
		}
	});
	if (changed) {
		persistSpeedDialItems();
		persistSpeedDialMeta();
	}
};
ensureExternalShortcuts();
/**
* WHY: Existing IDB/localStorage grids keep old default sets — missing core view tiles
* (e.g. Work Center) never appear until storage is wiped. Merge by id or meta.view.
*/
var ensureCoreViewShortcuts = () => {
	const core = DEFAULT_SPEED_DIAL_DATA_ALL.filter((entry) => entry.action === "open-view" && isSpeedDialViewAllowed(entry.meta, entry.id));
	let changed = false;
	const occupied = new Set((speedDialItems || []).map((item) => `${Number(item?.cell?.[0]) || 0}:${Number(item?.cell?.[1]) || 0}`));
	for (const shortcut of core) {
		const shortcutView = String(shortcut.meta?.view || "").trim().toLowerCase();
		const exists = speedDialItems?.find?.((item) => {
			if (item?.id === shortcut.id) return true;
			if (!shortcutView) return false;
			return String(getSpeedDialMeta(item.id)?.view || "").trim().toLowerCase() === shortcutView;
		});
		if (exists) {
			const meta = getSpeedDialMeta(exists.id) || ensureSpeedDialMeta(exists.id, {
				action: "open-view",
				...shortcut.meta || {}
			});
			if (!String(meta.view || "").trim() && shortcut.meta?.view) {
				meta.view = shortcut.meta.view;
				meta.action = meta.action || "open-view";
				changed = true;
			}
			continue;
		}
		let cellX = Number(shortcut.cell?.[0]) || 0;
		let cellY = Number(shortcut.cell?.[1]) || 0;
		let key = `${cellX}:${cellY}`;
		if (occupied.has(key)) {
			let placed = false;
			for (let y = 0; y < 12 && !placed; y += 1) for (let x = 0; x < 8 && !placed; x += 1) {
				const candidate = `${x}:${y}`;
				if (!occupied.has(candidate)) {
					cellX = x;
					cellY = y;
					key = candidate;
					placed = true;
				}
			}
		}
		occupied.add(key);
		const item = createStatefulItem({
			...shortcut,
			cell: observe([cellX, cellY])
		});
		if (shortcut.label && item.label && typeof item.label === "object" && "value" in item.label) item.label.value = shortcut.label;
		if (shortcut.icon && item.icon && typeof item.icon === "object" && "value" in item.icon) item.icon.value = shortcut.icon;
		speedDialItems.push(observe(item));
		ensureSpeedDialMeta(item.id, {
			action: "open-view",
			...shortcut.meta || {}
		});
		changed = true;
	}
	if (changed) {
		persistSpeedDialItems();
		persistSpeedDialMeta();
	}
};
ensureCoreViewShortcuts();
/**
* WHY: Past merges left both legacy `settings` and `shortcut-settings` (same view) on disk.
* Keep the preferred default id when present; otherwise keep the first match.
*/
var dedupeCoreOpenViewTiles = () => {
	let changed = false;
	const core = DEFAULT_SPEED_DIAL_DATA_ALL.filter((entry) => entry.action === "open-view" && isSpeedDialViewAllowed(entry.meta, entry.id));
	const getItemLabel = (item) => {
		const raw = item?.label;
		if (raw && typeof raw === "object" && "value" in raw) return String(raw.value || "").trim().toLowerCase();
		return String(raw || "").trim().toLowerCase();
	};
	for (const shortcut of core) {
		const view = String(shortcut.meta?.view || "").trim().toLowerCase();
		const label = String(shortcut.label || "").trim().toLowerCase();
		if (!view && !label) continue;
		const matches = (speedDialItems || []).filter((item) => {
			const metaView = String(getSpeedDialMeta(item.id)?.view || "").trim().toLowerCase();
			if (String(getSpeedDialMeta(item.id)?.action || item?.action || "open-view").toLowerCase() !== "open-view") return false;
			if (view && metaView === view) return true;
			return Boolean(label) && getItemLabel(item) === label;
		});
		if (matches.length <= 1) continue;
		const keep = matches.find((item) => item.id === shortcut.id) || matches[0];
		for (const item of matches) {
			if (item === keep) continue;
			const idx = speedDialItems.findIndex((row) => row?.id === item.id);
			if (idx >= 0) {
				speedDialItems.splice(idx, 1);
				changed = true;
			}
		}
	}
	if (changed) {
		persistSpeedDialItems();
		persistSpeedDialMeta();
	}
};
dedupeCoreOpenViewTiles();
/** Router mount prefix (`/cwsp`, `/markdown`, …) when present on `<html>`. */
var getSpeedDialRouterBase = () => {
	try {
		return String(document.documentElement?.dataset?.cwspRouterBase || "").trim().replace(/\/+$/, "");
	} catch {
		return "";
	}
};
/**
* Entry URL for a view deep link: `/settings?shell=environment[&native=1]&view=settings`
* WHY: address-bar readable path; environment keeps `/${view}` (not root `/?view=`).
* INVARIANT: open with this path; `preserveNativeDeepLink` must not strip it to `/`.
*/
var buildSpeedDialViewPathHref = (viewId, absolute = false, opts) => {
	const id = String(viewId || "").trim().replace(/^#/, "").replace(/^\/+/, "").split(/[/?#]/)[0].toLowerCase();
	if (!id) return "";
	const useNative = opts?.native === true;
	const path = `${getSpeedDialRouterBase().replace(/\/+$/, "") || ""}/${id}`.replace(/\/{2,}/g, "/") || `/${id}`;
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const withQuery = useNative ? `${normalized}?shell=environment&native=1&view=${encodeURIComponent(id)}` : `${normalized}?shell=environment&view=${encodeURIComponent(id)}`;
	if (!absolute || typeof location === "undefined") return withQuery;
	try {
		const url = new URL(location.href);
		url.pathname = normalized;
		url.hash = "";
		url.search = "";
		url.searchParams.set("shell", "environment");
		url.searchParams.set("view", id);
		if (useNative) url.searchParams.set("native", "1");
		else url.searchParams.delete("native");
		return url.href;
	} catch {
		return withQuery;
	}
};
/**
* Open `href` in a **new browser tab** without navigating the current tab.
* WHY: `window.open(url, "_blank", "noopener")` returns `null` by spec even when the
* window opened — our old `if (!opened) location.assign(href)` hijacked the desktop.
* INVARIANT: never `location.assign` / `location.href =` from native/open-link paths.
*/
var openInNewBrowserTab = (href) => {
	const url = String(href || "").trim();
	if (!url || typeof document === "undefined") return false;
	try {
		window?.open?.(url, window?.self != window?.top ? "_unfencedTop" : "_blank", "noreferrer,noopener");
		return true;
	} catch (e) {
		console.warn("[home-view] openInNewBrowserTab failed", e);
		return false;
	}
};
/**
* Open a **detached window** for native-window mode (never a browser tab).
*
* INVARIANT:
* - Do **not** use bare `window.open(url, "_blank")` — Chromium/Edge treat that as a **tab**.
* - Do **not** fall back to {@link openInNewBrowserTab} (that is the `new-tab` mode).
* - Do **not** request `menubar`/`toolbar`/`location` — those force full browser chrome
*   and break PWA/WCO when the window is captured as an app window.
* - Use a unique window name + `popup=yes,width,height` so each Native open is a
*   separate window. From an installed PWA, size features still open another app window.
*
* Never hijack the opener via `location.assign`.
*/
var windowOpenThrottled = Date.now();
var openInDetachedBrowserWindow = (href) => {
	const url = String(href || "").trim();
	if (!url || typeof window === "undefined") return false;
	try {
		const name = `cwsp-native-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
		const opened = Date.now() - windowOpenThrottled > 200 ? window.open(url, name, "popup,menubar=false,toolbar=false,location=false,width=1280,height=800") : null;
		windowOpenThrottled = Date.now();
		if (opened) {
			try {
				opened.opener = null;
			} catch {}
			return true;
		}
	} catch (e) {
		console.warn("[home-view] openInDetachedBrowserWindow failed", e);
	}
	return false;
};
/** True when href is (or resolves to) a same-origin app view path / bare view token. */
var parseSpeedDialViewFromHref = (raw) => {
	const input = String(raw || "").trim();
	if (!input || /^(mailto:|blob:|data:)/i.test(input)) return "";
	try {
		if (/^https?:\/\//i.test(input)) {
			const u = new URL(input);
			if (typeof location !== "undefined" && u.origin !== location.origin) return "";
			const id = (u.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "").toLowerCase();
			if (!id || id === "home") return "";
			return id === "markdown" ? "viewer" : id;
		}
	} catch {
		return "";
	}
	if (input.startsWith("/")) {
		const seg = input.replace(/^\//, "").split(/[/?#]/)[0].toLowerCase();
		if (!seg || seg === "home") return "";
		return seg === "markdown" ? "viewer" : seg;
	}
	const token = input.replace(/^#/, "").split(/[/?#]/)[0].trim().toLowerCase();
	if (!token || token === "home" || /[.:]/.test(token)) return "";
	return token === "markdown" ? "viewer" : token;
};
/**
* Prefer explicit `meta.href`; for view tiles synthesize path deep links
* (`/settings`, `/workcenter`, …) for Open link → new tab / native window.
*/
var resolveSpeedDialItemHref = (item) => {
	if (!item?.id) return "";
	const meta = getSpeedDialMeta(item.id);
	const explicit = String(meta?.href || item?.href || "").trim();
	if (explicit) return explicit;
	const view = String(meta?.view || "").trim().replace(/^#/, "");
	if (!view) return "";
	return buildSpeedDialViewPathHref(view, true);
};
var findSpeedDialItem = (id) => {
	if (!id) return null;
	return speedDialItems?.find?.((item) => item?.id === id) || null;
};
var createEmptySpeedDialItem = (cell = observe([0, 0])) => {
	const item = createStatefulItem({
		id: generateItemId(),
		cell,
		icon: "sparkle",
		label: "New shortcut",
		action: "open-link"
	});
	ensureSpeedDialMeta(item.id, {
		action: item.action,
		href: "",
		description: ""
	});
	return item;
};
var addSpeedDialItem = (item) => {
	speedDialItems?.push?.(observe(item));
	syncMetaActionFromItem(item);
	persistSpeedDialItems();
	persistSpeedDialMeta();
	return item;
};
var upsertSpeedDialItem = (item) => {
	const existingIndex = speedDialItems?.findIndex?.((entry) => entry?.id === item?.id) ?? -1;
	if (existingIndex === -1) speedDialItems?.push?.(observe(item));
	else if (speedDialItems[existingIndex] !== item) speedDialItems.splice(existingIndex, 1, observe(item));
	syncMetaActionFromItem(item);
	persistSpeedDialItems();
	persistSpeedDialMeta();
	return item;
};
var removeSpeedDialItem = (id) => {
	const index = speedDialItems?.findIndex?.((entry) => entry?.id === id) ?? -1;
	if (index === -1) return false;
	speedDialItems.splice(index, 1);
	removeSpeedDialMeta(id);
	persistSpeedDialItems();
	return true;
};
var snapshotSpeedDialItem = (item) => {
	const meta = getSpeedDialMeta(item.id);
	const resolvedAction = meta?.action || item.action;
	const metaSnapshot = fallbackClone(meta ?? {});
	if (!metaSnapshot.action) metaSnapshot.action = resolvedAction;
	return {
		state: {
			id: item.id,
			cell: observe([item.cell?.[0] ?? 0, item.cell?.[1] ?? 0]),
			icon: unwrapRef(item.icon, ""),
			label: unwrapRef(item.label, "")
		},
		desc: {
			action: resolvedAction,
			meta: metaSnapshot
		}
	};
};
var wallpaperState = makeUIState("cw::workspace::wallpaper", () => observe({
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (raw) => observe(raw || {
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (state) => ({ ...state }));
var persistWallpaper = () => wallpaperState?.$save?.();
var gridLayoutState = makeUIState("cw::workspace::grid-layout", () => observe({
	columns: 4,
	rows: 8,
	shape: "square"
}), (raw) => observe(raw || {
	columns: 4,
	rows: 8,
	shape: "square"
}), (state) => ({ ...state }));
var persistGridLayout = () => gridLayoutState?.$save?.();
var hasStoredValue = (key) => {
	try {
		return typeof localStorage !== "undefined" && localStorage.getItem(key) !== null;
	} catch {
		return false;
	}
};
var storedSpeedDialStateIsCustom = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return false;
		const parsed = JSOX.parse(raw);
		if (!Array.isArray(parsed)) return false;
		const signature = (entry) => JSOX.stringify([
			String(entry?.id || ""),
			Number(entry?.cell?.[0]) || 0,
			Number(entry?.cell?.[1]) || 0,
			String(unwrapRef(entry?.icon, "") || ""),
			String(unwrapRef(entry?.label, "") || ""),
			String(entry?.action || "")
		]);
		const defaults = DEFAULT_SPEED_DIAL_DATA.map(signature).sort();
		const current = parsed.map(signature).sort();
		return defaults.length !== current.length || defaults.some((value, index) => value !== current[index]);
	} catch {
		return true;
	}
};
/**
* Import the former orient-layer storage once. The renderer now has one state
* model, but old users must not lose shortcuts when the new entrypoint mounts.
*/
var migrateLegacyDesktopState = () => {
	const legacy = loadDesktopRaw();
	const decoded = legacy ? decodeDesktopState(legacy) : null;
	if (!decoded?.items?.length) return;
	if (hasStoredValue(STORAGE_KEY) && storedSpeedDialStateIsCustom()) return;
	const columns = Math.max(1, Math.min(32, Number(decoded.columns) || 4));
	const rows = Math.max(1, Math.min(32, Number(decoded.rows) || 8));
	const nextItems = [];
	speedDialItems.splice(0, speedDialItems.length);
	speedDialMeta.clear();
	for (const raw of decoded.items) {
		const action = raw?.action === "open-link" ? "open-link" : "open-view";
		const item = createStatefulItem({
			id: String(raw?.id || generateItemId()),
			cell: observe([Number(raw?.cell?.[0]) || 0, Number(raw?.cell?.[1]) || 0]),
			icon: String(raw?.icon || (action === "open-link" ? "link" : "sparkle")),
			label: String(raw?.label || "Shortcut"),
			action
		});
		const meta = {
			action,
			view: action === "open-view" ? String(raw?.viewId || "") : "",
			href: action === "open-link" ? String(raw?.href || "") : "",
			description: String(raw?.description || ""),
			shape: String(raw?.shape || "squircle"),
			iconSrc: String(raw?.iconSrc || "")
		};
		speedDialItems.push(item);
		ensureSpeedDialMeta(item.id, meta);
		nextItems.push(item);
	}
	if (!nextItems.length) return;
	gridLayoutState.columns = columns;
	gridLayoutState.rows = rows;
	gridLayoutState.shape = "square";
	persistSpeedDialItems();
	persistSpeedDialMeta();
	persistGridLayout();
};
migrateLegacyDesktopState();
var applyGridSettings = (settings) => {
	const gridConfig = settings?.grid || gridLayoutState;
	const columns = gridConfig?.columns ?? 4;
	const rows = gridConfig?.rows ?? 8;
	const shape = gridConfig?.shape ?? "square";
	if (gridLayoutState) {
		gridLayoutState.columns = columns;
		gridLayoutState.rows = rows;
		gridLayoutState.shape = shape;
		persistGridLayout();
	}
	if (typeof document === "undefined") return;
	document.querySelectorAll(".speed-dial-grid").forEach((grid) => {
		const el = grid;
		el.dataset.gridColumns = String(columns);
		el.dataset.gridRows = String(rows);
		el.dataset.gridShape = shape;
	});
	document.documentElement.dataset.gridColumns = String(columns);
	document.documentElement.dataset.gridRows = String(rows);
	document.documentElement.dataset.gridShape = shape;
};
if (typeof globalThis !== "undefined" && typeof document !== "undefined") {
	const run = () => applyGridSettings();
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
	else queueMicrotask(run);
}
var parseSpeedDialItemFromJSON = (jsonText, suggestedCell) => {
	try {
		const parsed = JSON.parse(jsonText);
		if (!parsed || typeof parsed !== "object") return null;
		const state = parsed.state || parsed;
		const desc = parsed.desc || parsed.meta || {};
		if (!state || typeof state !== "object") return null;
		const cellValue = state.cell && Array.isArray(state.cell) && state.cell.length >= 2 ? [Number(state.cell[0]) || 0, Number(state.cell[1]) || 0] : suggestedCell || [0, 0];
		const item = createStatefulItem({
			id: state.id || generateItemId(),
			cell: cellValue,
			icon: state.icon || desc.icon || "sparkle",
			label: state.label || desc.label || "Shortcut",
			action: desc.action || state.action || "open-view"
		});
		const meta = {
			action: desc.action || state.action || "open-view",
			...desc.meta || desc || {},
			...state.meta || {}
		};
		if (meta.href) meta.action = meta.action || "open-link";
		else if (meta.view) meta.action = meta.action || "open-view";
		ensureSpeedDialMeta(item.id, meta);
		return item;
	} catch (e) {
		console.warn("Failed to parse JSON for speed dial item:", e);
		return null;
	}
};
var parseSpeedDialItemFromURL = (urlText, suggestedCell) => {
	try {
		const trimmed = urlText.trim();
		if (!trimmed) return null;
		let url;
		try {
			url = new URL(trimmed);
		} catch {
			try {
				url = new URL(trimmed, globalThis?.location?.href);
			} catch {
				return null;
			}
		}
		const domain = (url.hostname || "").replace(/^www\./, "");
		const pathname = url.pathname || "";
		const label = domain || url.host || "Link";
		const item = createStatefulItem({
			id: generateItemId(),
			cell: suggestedCell || [0, 0],
			icon: "link",
			label,
			action: "open-link"
		});
		const meta = {
			action: "open-link",
			href: url.href,
			description: `${label}${pathname ? ` - ${pathname}` : ""}`
		};
		ensureSpeedDialMeta(item.id, meta);
		return item;
	} catch (e) {
		console.warn("Failed to parse URL for speed dial item:", e);
		return null;
	}
};
var readClipboardTextBrowser = async () => {
	try {
		if (!navigator.clipboard?.readText) return {
			ok: false,
			error: "clipboard.readText unavailable"
		};
		const data = await navigator.clipboard.readText();
		return {
			ok: true,
			data: String(data ?? "")
		};
	} catch (e) {
		return {
			ok: false,
			error: String(e?.message || e)
		};
	}
};
var createSpeedDialItemFromClipboard = async (suggestedCell) => {
	try {
		const clipboardResult = await readClipboardTextBrowser();
		if (!clipboardResult.ok || !clipboardResult.data) {
			console.warn("Failed to read clipboard text:", clipboardResult.error);
			return null;
		}
		const clipboardText = String(clipboardResult.data);
		if (!clipboardText.trim()) return null;
		const trimmed = clipboardText.trim();
		if ((/^https?:\/\/[^\s]+$/i.test(trimmed) || /^[^\s]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) && typeof URL !== "undefined" && URL.canParse(trimmed, globalThis?.location?.origin)) return parseSpeedDialItemFromURL(trimmed, suggestedCell);
		if (trimmed.startsWith("{") && trimmed.endsWith("}") || trimmed.startsWith("[") && trimmed.endsWith("]")) {
			const parsed = parseSpeedDialItemFromJSON(trimmed, suggestedCell);
			if (parsed) return parsed;
		}
		return null;
	} catch (e) {
		console.warn("Failed to create speed dial item from clipboard:", e);
		return null;
	}
};
//#endregion
export { wallpaperState as A, removeSpeedDialItem as C, speedDialItems as D, snapshotSpeedDialItem as E, speedDialMeta as O, persistWallpaper as S, resolveSpeedDialItemHref as T, parseSpeedDialItemFromJSON as _, createSpeedDialItemFromClipboard as a, persistSpeedDialItems as b, getDefaultOpenLinkTarget as c, isExternalWebHref as d, launcher_state_exports as f, openInNewBrowserTab as g, openInDetachedBrowserWindow as h, createEmptySpeedDialItem as i, upsertSpeedDialItem as k, getSpeedDialMeta as l, normalizeOpenLinkTarget as m, addSpeedDialItem as n, ensureSpeedDialMeta as o, normalizeExternalWebHref as p, buildSpeedDialViewPathHref as r, findSpeedDialItem as s, NAVIGATION_SHORTCUTS as t, gridLayoutState as u, parseSpeedDialItemFromURL as v, resolveItemOpenLinkTarget as w, persistSpeedDialMeta as x, parseSpeedDialViewFromHref as y };
