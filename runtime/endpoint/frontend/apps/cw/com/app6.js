import { f as isEnabledView } from "../chunks/views.js";
import { A as makeTask, B as hasActiveCloseable, E as resolveOverlayHost, G as E, I as H, M as navigationEnable, P as defineElement, T as registerTransientOverlay, W as navigate, f as placeOverlay, j as getBy, k as bindOutsideDismiss, z as closeHighestPriority } from "../vendor/culori.js";
import { a as refreshAppWallpaperPaint, c as restoreWallpaperThemeCache, i as initializeAppCanvasLayer, s as applyWallpaperPaperFromLuma } from "../vendor/culori2.js";
import { W as registerDirectoryRoot } from "./app.js";
import { t as CwsBridge } from "../chunks/cws-bridge.js";
import { C as defaultIconScaleForDisplay, D as syncShapelessIconShadow, E as normalizeTileShape, S as createTileUiIconElement, T as normalizeIconDisplay, _ as resolveSpeedDialCellFromClientPoint, a as applyItemIconScaleToElement, b as ICON_DISPLAY_OPTIONS, d as isClientPointOverSpeedDial, g as pinLauncherAppEntry, i as applyIconScaleToPaintedNodes, l as findNextFreeSpeedDialCell, m as parseSpeedDialItemFromJSON, p as normalizeItemIconBitmapScale, r as addSpeedDialItem, s as buildLauncherAppDragEnvelope, t as ICON_BITMAP_SCALE_OPTIONS, w as inferIconDisplay, x as TILE_SHAPE_OPTIONS, y as tileIconFetchSize } from "./app4.js";
import { b as showError, c as __decorate, d as openUnifiedContextMenu$1, o as UIElement, s as UIElement_default, x as showSuccess } from "./app5.js";
import { h as flyout_default, l as taskbar_default, m as quick_settings_default, p as statusbar_default, u as app_menu_default } from "../fest/veela.js";
import { i as resolveShellOverlaysMount, n as SHELL_SLOT, r as resolveOverlayMountPoint, t as ShellBase } from "../chunks/shells.js";
import { n as initBootShellWindowActivity } from "../shells/preference.js";
import { a as peekAppMenuSort, c as attachIconResourcePickButton, d as getCachedIconResourceObjectUrl, f as getCachedLauncherIconObjectUrl, h as isAndroidIconRef, i as hydrateAppColorKeys, l as applyLauncherIconToUiIcon, m as tryLaunchSiblingView, n as APP_MENU_SORT_OPTIONS, o as sortLauncherApps, p as resolveIconResourceUrl, r as defaultDirForAppSort, s as writeAppMenuSort, t as APP_MENU_SORT_EVENT, u as ensureLauncherIconObjectUrl, v as getSpeedDialViewOpener } from "./app8.js";
import { i as switchWorkspacePage, n as getActiveWorkspaceId, r as listWorkspacePages, t as WORKSPACE_PAGE_EVENT } from "./app9.js";
import { t as installLauncherBackStack } from "./app10.js";
import "../chunks/launcher-bridge.js";
import { MOCElement, addEvent, loadInlineStyle, preloadStyle } from "/fest/dom.js";
import { booleanRef, effect, numberRef, observe, ref } from "/fest/object.js";
import "/fest/core.js";
import { preloadStyle as preloadStyle$1 } from "/fest/style-lib.js";
import { ensureStyleSheet } from "/fest/icon.js";
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/app-launch.ts
var STORAGE_KEY$1 = "cwsp-app-launch-spec-v1";
var cache$1 = null;
var launchKey = (packageName) => `app:${String(packageName || "").trim()}`;
function readAll$1() {
	if (cache$1) return cache$1;
	try {
		const raw = localStorage.getItem(STORAGE_KEY$1);
		if (!raw) {
			cache$1 = {};
			return cache$1;
		}
		const parsed = JSON.parse(raw);
		cache$1 = parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		cache$1 = {};
	}
	return cache$1;
}
function writeAll$1(map) {
	cache$1 = map;
	try {
		localStorage.setItem(STORAGE_KEY$1, JSON.stringify(map));
	} catch {}
}
var sanitizeDataUri = (raw) => {
	const data = String(raw || "").trim();
	if (!data) return "";
	if (/^javascript:/i.test(data)) return "";
	return data;
};
function normalizeLauncherLaunchSpec(raw) {
	const src = raw && typeof raw === "object" ? raw : {};
	const extrasIn = src.extras && typeof src.extras === "object" ? src.extras : {};
	const extras = {};
	for (const [k, v] of Object.entries(extrasIn)) {
		const key = String(k || "").trim();
		if (!key) continue;
		if (typeof v === "boolean" || typeof v === "number" || typeof v === "string") extras[key] = v;
	}
	const flags = Array.isArray(src.flags) ? src.flags.map((f) => String(f || "").trim().toUpperCase()).filter(Boolean) : [];
	const categories = Array.isArray(src.categories) ? src.categories.map((c) => String(c || "").trim()).filter(Boolean) : [];
	return {
		action: String(src.action || "").trim(),
		data: sanitizeDataUri(String(src.data || "")),
		mimeType: String(src.mimeType || "").trim(),
		extras,
		flags,
		categories,
		componentName: String(src.componentName || "").trim()
	};
}
function isLauncherLaunchSpecEmpty(spec) {
	if (!spec) return true;
	return !spec.action && !spec.data && !spec.mimeType && !spec.componentName && (!spec.flags || spec.flags.length === 0) && (!spec.categories || spec.categories.length === 0) && (!spec.extras || Object.keys(spec.extras).length === 0);
}
function getAppLaunchSpec(packageName) {
	const key = launchKey(packageName);
	if (!key || key === "app:") return {};
	return normalizeLauncherLaunchSpec(readAll$1()[key]);
}
function setAppLaunchSpec(packageName, spec) {
	const key = launchKey(packageName);
	if (!key || key === "app:") return {};
	const next = normalizeLauncherLaunchSpec(spec);
	const all = { ...readAll$1() };
	if (isLauncherLaunchSpecEmpty(next)) delete all[key];
	else all[key] = next;
	writeAll$1(all);
	return next;
}
function clearAppLaunchSpec(packageName) {
	const key = launchKey(packageName);
	if (!key || key === "app:") return;
	const all = { ...readAll$1() };
	delete all[key];
	writeAll$1(all);
}
/** Stock MAIN/LAUNCHER when nothing is stored. */
function resolveAppLaunchSpec(packageName) {
	return getAppLaunchSpec(packageName);
}
/** Same as environment-overlay ENV_OVERLAY_Z — above `$z-shell-chrome`. */
var CHROME_FLYOUT_Z = "2147483600";
var openControllers = /* @__PURE__ */ new Map();
var sessions = /* @__PURE__ */ new Map();
var overlayShellHost = null;
var flyoutAnchorSelectors = [
	"[data-chrome-flyout-anchor]",
	".env-shell-taskbar__clock",
	".env-ui-statusbar__clock",
	".env-device-tray",
	".speed-dial-chrome-rail",
	".speed-dial-core-rail"
];
var resolveFlyoutAlign = (anchor) => {
	if (!anchor) return "end";
	if (anchor.dataset.chromeFlyoutSide === "start") return "start";
	if (anchor.closest?.(".speed-dial-chrome-rail, [data-chrome-flyout-side='start']")) return "start";
	return "end";
};
var isDesktopChrome = () => {
	if (typeof document !== "undefined") {
		if (document.querySelector(".env-shell-chrome[data-desktop]")) return true;
		const layout = document.querySelector("[data-chrome-layout]");
		if (layout?.dataset.chromeLayout === "desktop") return true;
		if (layout?.dataset.chromeLayout === "mobile") return false;
	}
	return typeof matchMedia !== "undefined" && matchMedia("(min-width: 641px)").matches;
};
/** Optional: shell can register the env-shell host used for overlay mounting. */
var setChromeFlyoutShellHost = (host) => {
	overlayShellHost = host;
};
var ensureOverlayRoot = (host) => {
	const ATTR = "data-env-shell-overlays";
	const tryHost = host || overlayShellHost || document.querySelector(".env-shell-root") || document.querySelector("#app") || document.body;
	const existing = tryHost.querySelector(`[${ATTR}]`);
	if (existing) {
		if (!existing.style.zIndex) existing.style.zIndex = CHROME_FLYOUT_Z;
		return existing;
	}
	try {
		const mod = globalThis.__ENV_OVERLAY_MOUNT__;
		if (typeof mod === "function") return mod(tryHost);
	} catch {}
	const el = document.createElement("div");
	el.setAttribute(ATTR, "");
	el.className = "env-shell-overlays";
	el.setAttribute("data-part", "env-overlays");
	el.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${CHROME_FLYOUT_Z};box-sizing:border-box;`;
	tryHost.appendChild(el);
	return el;
};
/**
* Place flyout for desktop (bottom-right) or mobile (calendar center / QS top-center).
* INVARIANT: panel itself must set `pointer-events: auto`.
*/
var positionFlyout = (el, mode, opts) => {
	const desktop = isDesktopChrome();
	const align = opts?.align ?? resolveFlyoutAlign(opts?.anchor);
	el.dataset.flyoutAlign = align;
	el.style.position = "fixed";
	el.style.zIndex = String(Number(CHROME_FLYOUT_Z) + 1);
	el.style.pointerEvents = "auto";
	el.style.margin = "0";
	if (desktop) {
		el.style.top = "auto";
		el.style.bottom = "4.5rem";
		el.style.transform = "none";
		if (align === "start") {
			el.style.left = "0.75rem";
			el.style.right = "auto";
		} else {
			el.style.left = "auto";
			el.style.right = "0.75rem";
		}
		return;
	}
	if (mode === "calendar") {
		el.style.top = "50%";
		el.style.left = "50%";
		el.style.right = "auto";
		el.style.bottom = "auto";
		el.style.transform = "translate(-50%, -50%)";
		return;
	}
	el.style.top = "calc(env(safe-area-inset-top, 0px) + 0.75rem)";
	el.style.left = "50%";
	el.style.right = "auto";
	el.style.bottom = "auto";
	el.style.transform = "translateX(-50%)";
};
var closeChromeFlyout = (kind) => {
	const ctrl = openControllers.get(kind);
	if (!ctrl) return;
	openControllers.delete(kind);
	const session = sessions.get(kind);
	sessions.delete(kind);
	session?.disposeDismiss();
	session?.unregisterBack();
	try {
		const el = ctrl.el;
		if (typeof el.close === "function") el.close();
		else {
			el.removeAttribute("open");
			el.hidden = true;
		}
		el.dispatchEvent(new CustomEvent("chrome-flyout-close", { bubbles: true }));
	} catch {}
};
/**
* Register an open flyout; closes the other kind (exclusive).
* Caller must already append `el` into the overlay root and call `positionFlyout`.
*/
var registerOpenFlyout = (ctrl) => {
	if (openControllers.has(ctrl.kind)) closeChromeFlyout(ctrl.kind);
	for (const kind of [...openControllers.keys()]) {
		if (kind === ctrl.kind) continue;
		closeChromeFlyout(kind);
	}
	openControllers.set(ctrl.kind, {
		...ctrl,
		close: () => closeChromeFlyout(ctrl.kind)
	});
	ctrl.el.hidden = false;
	ctrl.el.removeAttribute("hidden");
	ctrl.el.setAttribute("open", "");
	sessions.set(ctrl.kind, {
		disposeDismiss: bindOutsideDismiss({
			root: document,
			inside: ctrl.el,
			isInside: (event) => ctrl.contains(event.target),
			exceptSelectors: flyoutAnchorSelectors,
			onDismiss: () => closeChromeFlyout(ctrl.kind)
		}),
		unregisterBack: registerTransientOverlay({
			id: `chrome-flyout-${ctrl.kind}`,
			kind: "overlay",
			element: ctrl.el,
			isActive: () => openControllers.get(ctrl.kind)?.el === ctrl.el && ctrl.el.isConnected && !ctrl.el.hidden && ctrl.el.hasAttribute("open"),
			close: () => {
				closeChromeFlyout(ctrl.kind);
				return true;
			}
		})
	});
};
var isChromeFlyoutOpen = (kind) => openControllers.has(kind);
/**
* Toggle helper: if open → close; else open via `mountAndOpen`.
*/
var toggleChromeFlyout = (kind, mountAndOpen) => {
	if (isChromeFlyoutOpen(kind)) {
		closeChromeFlyout(kind);
		return;
	}
	registerOpenFlyout(mountAndOpen());
};
//#endregion
//#region src/frontend/shells/environment/components/calendar/CalendarFlyout.ts
var styled$4 = preloadStyle$1(flyout_default);
/** Shared exclusivity/positioning kind — see `ChromeFlyout.ts`. */
var FLYOUT_KIND$1 = "calendar";
/** 1 Jan 2023 (UTC) is a Sunday — stable anchor for deriving weekday short-labels per locale. */
var REFERENCE_SUNDAY_UTC = Date.UTC(2023, 0, 1);
var DAY_MS = 864e5;
/**
* Locale week start, 0 (Sunday) .. 6 (Saturday) — matches `Date#getDay()`.
* `Intl.Locale` week info is still a staged API; both accessor shapes are probed,
* with a Sunday-start fallback when unsupported.
*/
function resolveFirstDayOfWeek(locale) {
	try {
		const loc = new Intl.Locale(locale);
		const first = (loc.weekInfo ?? loc.getWeekInfo?.())?.firstDay;
		if (typeof first === "number" && first >= 1 && first <= 7) return first % 7;
	} catch {}
	return 0;
}
function weekdayShortLabels(locale, startDay) {
	const fmt = new Intl.DateTimeFormat(locale, {
		weekday: "short",
		timeZone: "UTC"
	});
	const labels = [];
	for (let i = 0; i < 7; i++) {
		const dow = (startDay + i) % 7;
		labels.push(fmt.format(new Date(REFERENCE_SUNDAY_UTC + dow * DAY_MS)));
	}
	return labels;
}
function isSameDate(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
/** Full 6×7 (or shorter, week-complete) grid for `year`/`month`, leading/trailing days included. */
function buildMonthCells(year, month, startDay) {
	const today = /* @__PURE__ */ new Date();
	const firstOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const leading = (firstOfMonth.getDay() - startDay + 7) % 7;
	const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
	const cells = [];
	for (let i = 0; i < totalCells; i++) {
		const dayNum = i - leading + 1;
		const date = new Date(year, month, dayNum);
		cells.push({
			date,
			day: date.getDate(),
			otherMonth: date.getMonth() !== month,
			isToday: isSameDate(date, today)
		});
	}
	return cells;
}
var CalendarFlyout = class CalendarFlyout extends UIElement {
	#year;
	#month;
	#selected = null;
	#unbind = null;
	styles = function() {
		return styled$4;
	};
	render = function() {
		return H`<div class="ui-cal-flyout__panel" part="panel">
            <header class="ui-cal-flyout__header" part="header">
                <p class="ui-cal-flyout__today" part="today"></p>
            </header>
            <div class="ui-cal-flyout__nav" part="nav">
                <button type="button" class="ui-cal-flyout__nav-btn" data-nav="prev" aria-label="Previous month" title="Previous month">
                    <ui-icon icon="caret-left"></ui-icon>
                </button>
                <div class="ui-cal-flyout__month-label" part="month-label" aria-live="polite"></div>
                <button type="button" class="ui-cal-flyout__nav-btn" data-nav="next" aria-label="Next month" title="Next month">
                    <ui-icon icon="caret-right"></ui-icon>
                </button>
            </div>
            <div class="ui-cal-flyout__weekdays" part="weekdays" role="row"></div>
            <div class="ui-cal-flyout__grid" part="grid" role="grid"></div>
        </div>`;
	};
	constructor() {
		super();
		const now = /* @__PURE__ */ new Date();
		this.#year = now.getFullYear();
		this.#month = now.getMonth();
	}
	onRender() {
		super.onRender();
		this.#wire();
		this.#renderFrame();
	}
	disconnectedCallback() {
		this.#unbind?.();
		this.#unbind = null;
		super.disconnectedCallback?.();
	}
	/** Bind nav / day-cell clicks once (element persists as a hidden singleton — see module helpers below). */
	#wire() {
		const root = this.shadowRoot;
		if (!root || this.#unbind) return;
		const onClick = (ev) => {
			const t = ev.target;
			const nav = t?.closest?.("[data-nav]");
			if (nav) {
				if (nav.dataset.nav === "prev") this.#shiftMonth(-1);
				else if (nav.dataset.nav === "next") this.#shiftMonth(1);
				return;
			}
			const day = t?.closest?.(".ui-cal-flyout__day");
			if (day) this.#selectDay(day);
		};
		const off = addEvent(root, "click", onClick);
		this.#unbind = () => off?.();
	}
	#shiftMonth(delta) {
		this.#month += delta;
		if (this.#month < 0) {
			this.#month = 11;
			this.#year -= 1;
		} else if (this.#month > 11) {
			this.#month = 0;
			this.#year += 1;
		}
		this.#renderFrame();
	}
	/** Jump the visible grid back to the month containing today (does not touch selection). */
	#goToday() {
		const now = /* @__PURE__ */ new Date();
		this.#year = now.getFullYear();
		this.#month = now.getMonth();
		this.#renderFrame();
	}
	#selectDay(el) {
		const iso = el.dataset.date;
		if (!iso) return;
		this.#selected = new Date(iso);
		this.shadowRoot?.querySelectorAll(".ui-cal-flyout__day[data-selected]")?.forEach((n) => n.removeAttribute("data-selected"));
		el.setAttribute("data-selected", "");
		this.dispatchEvent(new CustomEvent("calendar-select", {
			bubbles: true,
			composed: true,
			detail: { date: this.#selected }
		}));
	}
	/** Re-paint today-header / month-label / weekday-row / day-grid from `#year`/`#month`/`#selected`. */
	#renderFrame() {
		const root = this.shadowRoot;
		if (!root) return;
		const locale = typeof navigator !== "undefined" ? navigator.language : void 0;
		const startDay = resolveFirstDayOfWeek(locale ?? "en-US");
		const today = /* @__PURE__ */ new Date();
		const todayEl = root.querySelector(".ui-cal-flyout__today");
		if (todayEl) todayEl.textContent = today.toLocaleDateString(locale, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		});
		const monthLabelEl = root.querySelector(".ui-cal-flyout__month-label");
		if (monthLabelEl) monthLabelEl.textContent = new Date(this.#year, this.#month, 1).toLocaleDateString(locale, {
			month: "long",
			year: "numeric"
		});
		const weekdaysEl = root.querySelector(".ui-cal-flyout__weekdays");
		if (weekdaysEl) weekdaysEl.replaceChildren(...weekdayShortLabels(locale ?? "en-US", startDay).map((label) => {
			const span = document.createElement("span");
			span.className = "ui-cal-flyout__weekday";
			span.setAttribute("role", "columnheader");
			span.textContent = label;
			return span;
		}));
		const gridEl = root.querySelector(".ui-cal-flyout__grid");
		if (gridEl) {
			const cells = buildMonthCells(this.#year, this.#month, startDay);
			gridEl.replaceChildren(...cells.map((cell) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "ui-cal-flyout__day";
				btn.textContent = String(cell.day);
				btn.dataset.date = cell.date.toISOString();
				btn.setAttribute("role", "gridcell");
				if (cell.otherMonth) btn.setAttribute("data-other-month", "");
				if (cell.isToday) btn.setAttribute("data-today", "");
				if (this.#selected && isSameDate(cell.date, this.#selected)) btn.setAttribute("data-selected", "");
				btn.setAttribute("aria-label", cell.date.toLocaleDateString(locale, {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				}));
				return btn;
			}));
		}
	}
	open() {
		this.#goToday();
		this.removeAttribute("hidden");
		this.hidden = false;
		this.setAttribute("open", "");
	}
	close() {
		this.hidden = true;
		this.setAttribute("hidden", "");
		this.removeAttribute("open");
	}
	toggle(anchor) {
		if (this.hasAttribute("open")) this.close();
		else this.open();
	}
};
CalendarFlyout = __decorate([defineElement("ui-calendar-flyout")], CalendarFlyout);
var singleton$1 = null;
/** Mount (once) the singleton `<ui-calendar-flyout>` into the shared overlay root. */
function ensureCalendarFlyout() {
	if (singleton$1?.isConnected) return singleton$1;
	const overlayRoot = ensureOverlayRoot();
	let el = overlayRoot.querySelector("ui-calendar-flyout");
	if (!el) {
		el = document.createElement("ui-calendar-flyout");
		el.hidden = true;
		overlayRoot.appendChild(el);
	}
	singleton$1 = el;
	return el;
}
/** Toggle the shared calendar flyout, wired through `ChromeFlyout`'s exclusive-open contract. */
function toggleCalendarFlyout(anchor) {
	toggleChromeFlyout(FLYOUT_KIND$1, () => {
		const el = ensureCalendarFlyout();
		const pinned = document.documentElement.getAttribute("data-theme");
		if (pinned === "light" || pinned === "dark") {
			el.dataset.theme = pinned;
			el.style.colorScheme = pinned;
		}
		positionFlyout(el, FLYOUT_KIND$1, { anchor });
		el.open();
		return {
			kind: FLYOUT_KIND$1,
			el,
			close: () => {
				el.close();
				closeChromeFlyout(FLYOUT_KIND$1);
			},
			contains: (node) => node instanceof Node && el.contains(node)
		};
	});
}
//#endregion
//#region src/frontend/shells/environment/components/settings/QuickSettings.ts
/**
* WHY: Singleton `ui-quick-settings` custom element mounted into the shared ChromeFlyout
* overlay root (see `../flyout/ChromeFlyout`), exclusive with the calendar flyout via the
* shared registry. Theme toggling and the night-light/brightness overlay filters are local,
* dependency-free helpers — no hard import of the app-level Theme/Settings subsystem — so
* this component stays usable standalone inside `fl.ui`. Apps that ship a real Theme
* subsystem can still react via the `u2-theme-change` event this module dispatches.
*/
var styled$3 = preloadStyle$1(quick_settings_default);
/** Shared exclusivity/positioning kind — see `ChromeFlyout.ts`. Mirrors `CalendarFlyout.ts`. */
var FLYOUT_KIND = "quick-settings";
var THEME_ATTR = "data-theme";
/** Minimum required key per spec; `THEME_STORAGE_KEY_DOTTED` mirrors readers that expect a dotted name. */
var THEME_STORAGE_KEY = "rs-appearance-theme";
var THEME_STORAGE_KEY_DOTTED = "appearance.theme";
/** Best-effort merge targets: patch `appearance.theme` inside any settings blob found under these keys. */
var SETTINGS_BLOB_KEYS = [
	"rs-settings",
	"cwsp-settings",
	"u2-settings"
];
var prefersDarkScheme = () => {
	try {
		return matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
	} catch {
		return true;
	}
};
/** Patch `.appearance.theme` into any parseable JSON settings blob under known keys (best-effort). */
var mergeThemeIntoSettingsBlobs = (mode) => {
	for (const key of SETTINGS_BLOB_KEYS) try {
		const raw = localStorage.getItem(key);
		if (!raw) continue;
		const blob = JSON.parse(raw);
		if (!blob || typeof blob !== "object") continue;
		blob.appearance = {
			...blob.appearance ?? {},
			theme: mode
		};
		localStorage.setItem(key, JSON.stringify(blob));
	} catch {}
};
/** Current theme: `data-theme` attr > stored pref > OS `prefers-color-scheme`. */
var getCurrentQuickTheme = () => {
	try {
		const attr = document.documentElement.getAttribute(THEME_ATTR);
		if (attr === "light" || attr === "dark") return attr;
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === "light" || stored === "dark") return stored;
	} catch {}
	return prefersDarkScheme() ? "dark" : "light";
};
/**
* Apply light/dark from Quick Settings without importing app Theme.ts (fl.ui ↔ subsystem cycle).
* WHY: Must mirror `syncBrowserChromeTheme` — `data-scheme` + hosts + body — or env-shell /
* veela keep OS `prefers-color-scheme` / stale `data-scheme="auto"` and light never sticks.
*
* When preference is `auto`, keep `data-scheme="auto"` and pin `data-theme` to the resolved
* OS mode so light-dark()/components refresh while still tracking system changes.
*/
var applyQuickTheme = (mode) => {
	const root = document.documentElement;
	const resolved = mode === "auto" ? prefersDarkScheme() ? "dark" : "light" : mode;
	const schemeAttr = mode === "auto" ? "auto" : mode;
	root.setAttribute("data-scheme", schemeAttr);
	root.setAttribute(THEME_ATTR, resolved);
	root.style.colorScheme = resolved;
	try {
		if (document.body) document.body.style.colorScheme = resolved;
	} catch {}
	try {
		document.querySelectorAll(".env-shell-root, [data-shell], ui-window").forEach((node) => {
			const el = node;
			el.dataset.theme = resolved;
			el.style.colorScheme = resolved;
			const inner = el.shadowRoot?.querySelector?.(".app-shell");
			if (inner) {
				inner.dataset.theme = resolved;
				inner.style.colorScheme = resolved;
			}
		});
	} catch {}
	try {
		localStorage.setItem(THEME_STORAGE_KEY, mode === "auto" ? "auto" : mode);
		localStorage.setItem(THEME_STORAGE_KEY_DOTTED, mode === "auto" ? "auto" : mode);
	} catch {}
	if (mode !== "auto") mergeThemeIntoSettingsBlobs(mode);
	root.dispatchEvent(new CustomEvent("u2-theme-change", {
		bubbles: true,
		detail: {
			source: "quick-settings",
			theme: resolved,
			preference: mode
		}
	}));
};
/** Stored preference: light | dark | auto (missing → auto on Cap / OS-follow). */
var getStoredThemePreference = () => {
	try {
		const stored = String(localStorage.getItem(THEME_STORAGE_KEY) || "").trim().toLowerCase();
		if (stored === "light" || stored === "dark" || stored === "auto") return stored;
		const dotted = String(localStorage.getItem(THEME_STORAGE_KEY_DOTTED) || "").trim().toLowerCase();
		if (dotted === "light" || dotted === "dark" || dotted === "auto") return dotted;
	} catch {}
	return "auto";
};
/** Follow OS light/dark when preference is `auto`. Idempotent. */
var installAutoThemeFollow = () => {
	const g = globalThis;
	if (g.__CWSP_AUTO_THEME_FOLLOW__) return;
	g.__CWSP_AUTO_THEME_FOLLOW__ = true;
	const mq = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
	if (!mq) return;
	const sync = () => {
		if (getStoredThemePreference() !== "auto") return;
		applyQuickTheme("auto");
	};
	try {
		mq.addEventListener("change", sync);
	} catch {
		try {
			mq.addListener(sync);
		} catch {}
	}
	try {
		sync();
	} catch {}
};
var unlockOrientationLock = (unlocked) => {
	document.documentElement.style.setProperty("--orientation-lock", unlocked ? "unlocked" : "locked");
	document.documentElement.style.setProperty("--orientation-lock-angle", unlocked ? "0deg" : "90deg");
	Promise.try(async () => {
		try {
			const orientation = screen.orientation;
			if (unlocked) {
				orientation.unlock?.();
				return;
			}
			if (typeof orientation.lock !== "function") return;
			const locked = orientation.lock(orientation.type || "natural");
			if (locked && typeof locked.catch === "function") await locked.catch(() => {});
		} catch (error) {
			console.warn(error);
		}
	})?.catch?.(console.warn.bind(console));
};
var NIGHT_FILTER_ID = "env-night-filter";
/** Below `CHROME_FLYOUT_Z` (2147483600, ChromeFlyout.ts); above env-shell wallpaper/chrome. */
var NIGHT_FILTER_Z = "2147483001";
var NIGHT_STORAGE_KEY = "rs-night-filter";
var BRIGHTNESS_STORAGE_KEY = "rs-brightness-filter";
var clampPct = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
/** Ensure the single fixed overlay div used for both the night-light tint and the brightness stub filter. */
var ensureNightFilterEl = () => {
	const existing = document.getElementById(NIGHT_FILTER_ID);
	if (existing instanceof HTMLElement) return existing;
	const el = document.createElement("div");
	el.id = NIGHT_FILTER_ID;
	el.setAttribute("aria-hidden", "true");
	el.style.cssText = [
		"dynamic-range-limit:no-limit",
		"color-space:display-p3",
		"position:fixed",
		"inset:0",
		"pointer-events:none",
		`z-index:${NIGHT_FILTER_Z}`,
		"background-color:color(display-p3 1 0.55 0.24)",
		"mix-blend-mode:multiply",
		"opacity:0",
		"visibility:hidden",
		"transition:opacity 160ms ease"
	].join(";");
	(document.body ?? document.documentElement).appendChild(el);
	return el;
};
/** value: 0-100 night-light intensity mapped to overlay opacity 0-1. */
var applyNightFilter = (value) => {
	const v = clampPct(value);
	const el = ensureNightFilterEl();
	const opacity = v / 100;
	el.style.opacity = String(opacity);
	el.style.visibility = opacity >= .01 ? "visible" : "hidden";
	try {
		localStorage.setItem(NIGHT_STORAGE_KEY, String(v));
	} catch {}
};
/** value: 0-100 brightness stub; 50 == neutral (`brightness(1)`), mapped to ~0.4-1.2. */
var applyBrightnessFilter = (value) => {
	const v = clampPct(value);
	ensureNightFilterEl();
	v <= 50 ? .4 + v / 50 * .6 : 1 + (v - 50) / 50 * .2;
	try {
		localStorage.setItem(BRIGHTNESS_STORAGE_KEY, String(v));
	} catch {}
};
var readStoredFilterValue = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		if (raw == null) return fallback;
		const n = Number(raw);
		return Number.isFinite(n) ? clampPct(n) : fallback;
	} catch {
		return fallback;
	}
};
/** Restore persisted night/brightness filters; idempotent — safe to call on every panel open. */
var restoreQuickFilters = () => {
	const night = readStoredFilterValue(NIGHT_STORAGE_KEY, 0);
	const brightness = readStoredFilterValue(BRIGHTNESS_STORAGE_KEY, 50);
	applyNightFilter(night);
	applyBrightnessFilter(brightness);
	return {
		night,
		brightness
	};
};
if (typeof document !== "undefined") {
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => restoreQuickFilters(), { once: true });
	else restoreQuickFilters();
}
var PLACEHOLDER_TILE_IDS = [
	"wifi",
	"bluetooth",
	"focus",
	"airplane",
	"orientation"
];
var THEME_TILE_ICON = {
	light: "sun",
	dark: "moon"
};
var THEME_TILE_SUB = {
	light: "Light",
	dark: "Dark"
};
var syncThemeTile = (root) => {
	const tile = root.querySelector("[data-qs-tile=\"theme\"]");
	if (!tile) return;
	const mode = getCurrentQuickTheme();
	tile.querySelector("ui-icon")?.setAttribute("icon", THEME_TILE_ICON[mode]);
	const sub = tile.querySelector("[data-qs-tile-sub]");
	if (sub) sub.textContent = THEME_TILE_SUB[mode];
	tile.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
};
/** One-time wiring for a freshly-rendered panel shadow root (guarded by `data-qs-wired`). */
var wireQuickSettingsPanel = (host) => {
	const root = host.shadowRoot;
	const panel = root?.querySelector(".qs-panel");
	if (!root || !panel || panel.hasAttribute("data-qs-wired")) return;
	panel.setAttribute("data-qs-wired", "");
	syncThemeTile(root);
	root.querySelector("[data-qs-tile=\"theme\"]")?.addEventListener("click", () => {
		applyQuickTheme(getCurrentQuickTheme() === "dark" ? "light" : "dark");
		syncThemeTile(root);
	});
	const isPressed = (target) => Boolean(target?.getAttribute?.("aria-pressed")) && target?.getAttribute?.("aria-pressed") === "true";
	root.querySelector?.("[data-qs-tile=\"orientation\"]")?.addEventListener?.("click", (ev) => {
		const realTarget = MOCElement((ev?.target?.matches?.("[data-qs-tile=\"orientation\"]") ? ev?.target : ev?.target?.querySelector?.("[data-qs-tile=\"orientation\"]")) || ev?.target, "[data-qs-tile=\"orientation\"]");
		const isUnlocking = isPressed(realTarget);
		unlockOrientationLock(isUnlocking);
		const icon = realTarget?.matches?.("ui-icon") ? realTarget : realTarget?.querySelector?.("ui-icon");
		if (icon) icon.setAttribute?.("icon", !isUnlocking ? "lock" : "device-rotate");
		if (icon) icon.setAttribute?.("icon-style", "duotone");
	});
	for (const id of PLACEHOLDER_TILE_IDS) {
		const tile = root.querySelector(`[data-qs-tile="${id}"]`);
		if (!tile) continue;
		tile.addEventListener("click", () => {
			const next = tile.getAttribute("aria-pressed") !== "true";
			tile.setAttribute("aria-pressed", String(next));
			const sub = tile.querySelector("[data-qs-tile-sub]");
			if (sub) sub.textContent = next ? "On" : "Off";
		});
	}
	const { night, brightness } = restoreQuickFilters();
	const nightSlider = root.querySelector("[data-qs-slider=\"night\"]");
	const brightnessSlider = root.querySelector("[data-qs-slider=\"brightness\"]");
	if (nightSlider) {
		nightSlider.value = String(night);
		nightSlider.addEventListener("input", () => applyNightFilter(nightSlider.valueAsNumber));
	}
	if (brightnessSlider) {
		brightnessSlider.value = String(brightness);
		brightnessSlider.addEventListener("input", () => applyBrightnessFilter(brightnessSlider.valueAsNumber));
	}
	const openShellView = (view) => {
		closeQuickSettingsFlyout();
		const run = () => {
			const opener = getSpeedDialViewOpener();
			if (typeof opener === "function") {
				opener(view, {});
				return;
			}
			const hash = `#${view}`;
			if (typeof location !== "undefined" && location.hash !== hash) navigate(hash);
		};
		if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
		else queueMicrotask(run);
	};
	root.querySelectorAll("[data-qs-open]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const view = String(btn.getAttribute("data-qs-open") || "").trim();
			if (view === "settings" || view === "explorer") openShellView(view);
		});
	});
};
var QuickSettings = class QuickSettings extends UIElement {
	constructor() {
		super();
	}
	styles = () => styled$3;
	render = () => H`
<div class="qs-panel" part="panel" role="menu" aria-label="Quick settings">
    <div class="qs-tiles" part="tiles" role="group" aria-label="Quick toggles">
        <button type="button" class="qs-tile qs-tile--theme" part="tile" data-qs-tile="theme" role="menuitemcheckbox" aria-pressed="false" title="Theme">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="moon" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Theme</span>
                <span class="qs-tile-sub" data-qs-tile-sub>Dark</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="wifi" role="menuitemcheckbox" aria-pressed="true" title="Wi-Fi">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="wifi-high" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Wi-Fi</span>
                <span class="qs-tile-sub" data-qs-tile-sub>On</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="bluetooth" role="menuitemcheckbox" aria-pressed="true" title="Bluetooth">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="bluetooth" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Bluetooth</span>
                <span class="qs-tile-sub" data-qs-tile-sub>On</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="focus" role="menuitemcheckbox" aria-pressed="false" title="Focus assist">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="bell-slash" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Focus assist</span>
                <span class="qs-tile-sub" data-qs-tile-sub>Off</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="airplane" role="menuitemcheckbox" aria-pressed="false" title="Airplane mode">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="airplane" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Airplane mode</span>
                <span class="qs-tile-sub" data-qs-tile-sub>Off</span>
            </span>
        </button>
        <button type="button" class="qs-tile qs-tile--orientation" part="tile" data-qs-tile="orientation" role="menuitemcheckbox" aria-pressed="true" title="Orientation lock">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="lock" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Orientation lock</span>
                <span class="qs-tile-sub" data-qs-tile-sub>On</span>
            </span>
        </button>
    </div>
    <div class="qs-sliders" part="sliders">
        <label class="qs-slider-row" part="slider-row">
            <ui-icon class="qs-slider-icon" part="slider-icon" icon="moon-stars" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-slider-col">
                <span class="qs-slider-label">Night light</span>
                <input class="qs-slider" part="slider" type="range" min="0" max="100" step="1" value="0" data-qs-slider="night" aria-label="Night light" />
            </span>
        </label>
        <label class="qs-slider-row" part="slider-row">
            <ui-icon class="qs-slider-icon" part="slider-icon" icon="sun-dim" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-slider-col">
                <span class="qs-slider-label">Brightness</span>
                <input class="qs-slider" part="slider" type="range" min="0" max="100" step="1" value="50" data-qs-slider="brightness" aria-label="Brightness" />
            </span>
        </label>
    </div>
    <div class="qs-footer" part="footer" role="group" aria-label="Open apps">
        <button type="button" class="qs-footer-btn" part="footer-btn" data-qs-open="explorer" role="menuitem" title="Explorer">
            <ui-icon class="qs-footer-icon" icon="books" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span>Explorer</span>
        </button>
        <button type="button" class="qs-footer-btn" part="footer-btn" data-qs-open="settings" role="menuitem" title="Settings">
            <ui-icon class="qs-footer-icon" icon="gear-six" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span>Settings</span>
        </button>
    </div>
</div>`;
	onRender() {
		super.onRender();
		wireQuickSettingsPanel(this);
		return this;
	}
	open() {
		syncThemeTile(this.shadowRoot);
		this.removeAttribute("hidden");
		this.hidden = false;
		this.setAttribute("open", "");
	}
	close() {
		this.hidden = true;
		this.setAttribute("hidden", "");
		this.removeAttribute("open");
	}
	toggle(anchor) {
		if (this.hasAttribute("open")) this.close();
		else this.open();
	}
};
QuickSettings = __decorate([defineElement("ui-quick-settings")], QuickSettings);
var singleton = null;
/** Mount (once) the singleton `<ui-quick-settings>` into the shared overlay root. */
function ensureQuickSettingsElement() {
	if (singleton?.isConnected) return singleton;
	const overlayRoot = ensureOverlayRoot();
	let el = overlayRoot.querySelector("ui-quick-settings");
	if (!el) {
		el = document.createElement("ui-quick-settings");
		el.hidden = true;
		overlayRoot.appendChild(el);
	}
	singleton = el;
	return el;
}
/** Toggle the shared Quick Settings flyout, wired through `ChromeFlyout`'s exclusive-open contract. */
function toggleQuickSettingsFlyout(anchor) {
	toggleChromeFlyout(FLYOUT_KIND, () => {
		const el = ensureQuickSettingsElement();
		const pinned = document.documentElement.getAttribute("data-theme");
		if (pinned === "light" || pinned === "dark") {
			el.dataset.theme = pinned;
			el.style.colorScheme = pinned;
		}
		positionFlyout(el, FLYOUT_KIND, { anchor });
		el.open();
		return {
			kind: FLYOUT_KIND,
			el,
			close: () => {
				el.close();
				closeChromeFlyout(FLYOUT_KIND);
			},
			contains: (node) => node instanceof Node && el.contains(node)
		};
	});
}
/** Close the Quick Settings flyout if open (no-op otherwise). */
function closeQuickSettingsFlyout() {
	closeChromeFlyout(FLYOUT_KIND);
}
Promise.try(() => {
	if (typeof requestAnimationFrame !== "function") return;
	requestAnimationFrame(() => {
		Promise.try(async () => {
			const lock = screen?.orientation?.lock;
			if (typeof lock !== "function") return;
			const locked = lock.call(screen.orientation, "natural");
			if (locked && typeof locked.catch === "function") await locked.catch(() => {});
		}).catch(() => {});
	});
}).catch(() => {});
try {
	installAutoThemeFollow();
} catch {}
//#endregion
//#region src/frontend/shells/environment/components/statusbar/statusbar.ts
/**
* WHY: Uses FL-UI `ui-statusbar` (left/center/right slots) — not a parallel component.
* Reactive network/battery chips are shared via {@link attachShellDeviceStatus} for the desktop taskbar.
* Overlay mode (mobile browser / fullscreen, not standalone): transparent top band, time L / icons R.
*/
var styled$2 = preloadStyle$1(statusbar_default);
function matchShellDisplayMode() {
	if (typeof matchMedia !== "function") return "unknown";
	try {
		if (matchMedia("(display-mode: window-controls-overlay)").matches) return "window-controls-overlay";
		if (matchMedia("(display-mode: fullscreen)").matches) return "fullscreen";
		if (matchMedia("(display-mode: standalone)").matches) return "standalone";
		if (matchMedia("(display-mode: minimal-ui)").matches) return "minimal-ui";
		if (matchMedia("(display-mode: browser)").matches) return "browser";
	} catch {}
	return "unknown";
}
function isShellStandaloneDisplay() {
	const mode = matchShellDisplayMode();
	if (mode === "standalone" || mode === "minimal-ui") return true;
	try {
		if (navigator.standalone === true) return true;
	} catch {}
	return false;
}
/** Capacitor Android/iOS shell — OS owns the status bar; suppress in-app overlay chrome. */
function isNativeCapacitorHost() {
	if (typeof document !== "undefined" && document.documentElement.dataset.cwspNativeShell === "capacitor") return true;
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
}
/**
* Transparent top status overlay when:
* - mobile browser (not standalone), or
* - PWA / CSS fullscreen, or
* - document fullscreen API on a mobile-sized viewport.
* Standalone installed PWA: no overlay (OS chrome / edge-to-edge windows).
*/
function shouldShowStatusOverlay(opts) {
	if (isNativeCapacitorHost()) return false;
	if (opts.standalone ?? isShellStandaloneDisplay()) return false;
	const mode = opts.displayMode ?? matchShellDisplayMode();
	const docFs = typeof document !== "undefined" && Boolean(document.fullscreenElement || document.webkitFullscreenElement);
	if (mode === "fullscreen" || docFs) return true;
	return !opts.desktop;
}
/** European 24h clock + DD.MM.YYYY for taskbar / status overlay. */
function formatChromeClock(now = /* @__PURE__ */ new Date()) {
	const pad = (n) => String(n).padStart(2, "0");
	return {
		time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
		date: `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`
	};
}
function formatStatusClock(d = /* @__PURE__ */ new Date()) {
	return formatChromeClock(d).time;
}
/**
* Sample wallpaper + open-window chrome → status/launcher fg.
* WHY: Overlay status sits on wallpaper OR on light window title spacers (`data-status-gap`);
* wallpaper-only probe kept white icons over light titlebars in app light theme.
*/
function attachStatusBarContrast(target) {
	let disposed = false;
	let timer = null;
	const lumaOf = (data, step = 48) => {
		let sum = 0;
		let n = 0;
		let maxChan = 0;
		for (let i = 0; i < data.length; i += 4 * step) {
			if ((data[i + 3] ?? 255) < 16) continue;
			const r = data[i] / 255;
			const g = data[i + 1] / 255;
			const b = data[i + 2] / 255;
			maxChan = Math.max(maxChan, r, g, b);
			sum += .2126 * r + .7152 * g + .0722 * b;
			n++;
		}
		if (n < 8) return null;
		if (maxChan < .02) return null;
		return sum / n;
	};
	const applyStatusFg = (luma) => {
		const darkFg = luma > .55;
		target.style.setProperty("--env-status-fg", darkFg ? "#1c1c1e" : "#f5f5f7");
		target.style.setProperty("--env-status-fg-muted", darkFg ? "rgba(28,28,30,0.72)" : "rgba(245,245,247,0.78)");
		target.dataset.statusContrast = darkFg ? "dark" : "light";
	};
	const applyStatusFgFromWallpaper = () => {
		target.style.setProperty("--env-status-fg", "var(--wallpaper-contrast-color)");
		target.style.setProperty("--env-status-fg-muted", "color-mix(in oklab, var(--wallpaper-contrast-color) 78%, transparent)");
		target.dataset.statusContrast = "wallpaper";
	};
	const applyLauncherFg = (luma) => {
		applyWallpaperPaperFromLuma(luma, [target]);
		target.dataset.launcherContrast = luma > .52 ? "dark" : "light";
	};
	/** Open managed windows that reserve the top status inset (title under overlay). */
	const statusGapWindowsOpen = () => {
		try {
			for (const win of document.querySelectorAll("ui-window[managed]")) {
				if (win.hidden || win.hasAttribute("hidden")) continue;
				if (win.getAttribute("aria-hidden") === "true") continue;
				const st = getComputedStyle(win);
				if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) === 0) continue;
				if (win.hasAttribute("data-status-gap") || win.hasAttribute("data-status-overlay-gap")) return true;
				if (win.getBoundingClientRect().top < Math.max(8, parseFloat(getComputedStyle(target).getPropertyValue("--env-status-inset-top")) || 32) + 8) return true;
			}
		} catch {}
		return false;
	};
	const sample = () => {
		if (disposed) return;
		const appTheme = (document.documentElement.getAttribute("data-theme") || "").toLowerCase();
		const windowsUnderStatus = statusGapWindowsOpen();
		if (windowsUnderStatus && appTheme === "light") applyStatusFg(.9);
		else if (windowsUnderStatus && appTheme === "dark") applyStatusFg(.15);
		else applyStatusFgFromWallpaper();
		try {
			const canvas = target.querySelector(".env-shell-wallpaper canvas") || document.querySelector(".env-shell-wallpaper canvas");
			if (canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0) {
				const ctx = canvas.getContext("2d", { willReadFrequently: true });
				if (ctx) {
					const sw = canvas.width;
					const midY = Math.max(0, Math.round(canvas.height * .28));
					const midH = Math.max(1, Math.round(canvas.height * .36));
					const midLuma = lumaOf(ctx.getImageData(0, midY, sw, Math.min(midH, canvas.height - midY)).data);
					if (midLuma != null) {
						applyLauncherFg(midLuma);
						if (!windowsUnderStatus) applyStatusFgFromWallpaper();
						return;
					}
				}
			}
		} catch {}
	};
	const schedule = () => {
		if (timer != null) clearTimeout(timer);
		timer = setTimeout(sample, 120);
	};
	sample();
	const mo = typeof MutationObserver === "function" ? new MutationObserver(schedule) : null;
	const wallpaper = target.querySelector(".env-shell-wallpaper") || document.querySelector(".env-shell-wallpaper");
	if (wallpaper && mo) mo.observe(wallpaper, {
		childList: true,
		subtree: true,
		attributes: true
	});
	const winMo = typeof MutationObserver === "function" ? new MutationObserver(schedule) : null;
	winMo?.observe(document.documentElement, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: [
			"hidden",
			"data-status-gap",
			"data-theme",
			"aria-hidden",
			"style",
			"class"
		]
	});
	window.addEventListener("resize", schedule);
	document.addEventListener("visibilitychange", schedule);
	document.addEventListener("env-chrome-surface", schedule);
	document.addEventListener("u2-theme-change", schedule);
	const mq = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
	mq?.addEventListener?.("change", schedule);
	const interval = setInterval(sample, 8e3);
	return () => {
		disposed = true;
		if (timer != null) clearTimeout(timer);
		clearInterval(interval);
		mo?.disconnect();
		winMo?.disconnect();
		window.removeEventListener("resize", schedule);
		document.removeEventListener("visibilitychange", schedule);
		document.removeEventListener("env-chrome-surface", schedule);
		document.removeEventListener("u2-theme-change", schedule);
		mq?.removeEventListener?.("change", schedule);
	};
}
var StatusBar = class StatusBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$2;
	render = () => {
		return H`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`;
	};
};
StatusBar = __decorate([defineElement("ui-statusbar")], StatusBar);
function connectionOf(nav) {
	return nav.connection;
}
function networkIconForEffectiveType(etRaw) {
	const et = etRaw.toLowerCase();
	if (et === "slow-2g") return "wifi-low";
	if (et === "2g") return "wifi-medium";
	return "wifi-high";
}
function attachShellDeviceStatus() {
	const networkIcon = ref("wifi-high");
	const networkTitle = ref("");
	const batteryIcon = ref("battery-full");
	const batteryTitle = ref("");
	const batteryPct = ref("");
	const syncNetwork = () => {
		if (!navigator.onLine) {
			networkIcon.value = "wifi-slash";
			networkTitle.value = "Offline";
			return;
		}
		const c = connectionOf(navigator);
		if (!c || typeof c.effectiveType !== "string") {
			networkIcon.value = "globe";
			networkTitle.value = "Online (connection details unavailable)";
			return;
		}
		const et = String(c.effectiveType || "").toLowerCase();
		const down = typeof c.downlink === "number" ? `${c.downlink} Mb/s` : "";
		const save = c.saveData ? " · Data saver" : "";
		networkTitle.value = [et.toUpperCase(), down].filter(Boolean).join(" · ") + save;
		networkIcon.value = networkIconForEffectiveType(et);
	};
	let batteryLevelHandler = null;
	let batteryChargingHandler = null;
	let batteryManager = null;
	const applyBattery = (level, charging) => {
		const pct = Math.max(0, Math.min(100, Math.round(level * 100)));
		batteryPct.value = `${pct}%`;
		if (charging) {
			batteryIcon.value = "battery-charging-vertical";
			batteryTitle.value = `Charging · ${batteryPct.value}`;
			return;
		}
		batteryTitle.value = `Battery · ${batteryPct.value}`;
		if (level <= .08) batteryIcon.value = "battery-warning";
		else if (level <= .22) batteryIcon.value = "battery-low";
		else if (level <= .5) batteryIcon.value = "battery-medium";
		else if (level <= .8) batteryIcon.value = "battery-high";
		else batteryIcon.value = "battery-full";
	};
	syncNetwork();
	window.addEventListener("online", syncNetwork);
	window.addEventListener("offline", syncNetwork);
	const conn = connectionOf(navigator);
	conn?.addEventListener?.("change", syncNetwork);
	if (typeof navigator.getBattery === "function") navigator.getBattery().then((b) => {
		batteryManager = b;
		batteryLevelHandler = () => applyBattery(b.level, b.charging);
		batteryChargingHandler = batteryLevelHandler;
		b.addEventListener("levelchange", batteryLevelHandler);
		b.addEventListener("chargingchange", batteryChargingHandler);
		applyBattery(b.level, b.charging);
	});
	else {
		batteryIcon.value = "question";
		batteryTitle.value = "Battery status not supported in this browser";
		batteryPct.value = "—";
	}
	const dispose = () => {
		window.removeEventListener("online", syncNetwork);
		window.removeEventListener("offline", syncNetwork);
		conn?.removeEventListener?.("change", syncNetwork);
		if (batteryManager && batteryLevelHandler && batteryChargingHandler) {
			batteryManager.removeEventListener("levelchange", batteryLevelHandler);
			batteryManager.removeEventListener("chargingchange", batteryChargingHandler);
		}
	};
	return {
		networkIcon,
		networkTitle,
		batteryIcon,
		batteryTitle,
		batteryPct,
		dispose
	};
}
/** Reactive tray; use two instances (taskbar + footer) with visibility toggled by CSS — same refs update both. */
function buildShellDeviceTray(device, trayClass) {
	const row = H`<div class="env-status-bar__tray ${trayClass}">
        <span class="env-status-bar__chip" title=${device.networkTitle} aria-label=${device.networkTitle}>
            <ui-icon icon=${device.networkIcon} aria-hidden="true"></ui-icon>
        </span>
        <span class="env-status-bar__chip" title=${device.batteryTitle} aria-label=${device.batteryTitle}>
            <ui-icon icon=${device.batteryIcon} aria-hidden="true"></ui-icon>
            <span class="env-status-bar__pct"></span>
        </span>
    </div>`;
	const pctSpan = row.querySelector(".env-status-bar__pct");
	if (pctSpan instanceof HTMLElement) E(pctSpan, { properties: { textContent: device.batteryPct } });
	return row;
}
/**
* `ui-statusbar`:
* - Desktop footer: intro (left), shell meta (center), device tray (right; often CSS-hidden).
* - Overlay (mobile/fullscreen): clock (left), device tray (right); intro/meta hidden.
*/
function mountEnvironmentStatusBar(shell, introInnerHtml, device) {
	const bar = document.createElement("ui-statusbar");
	bar.className = "env-ui-statusbar wf-chrome-no-select";
	bar.setAttribute("part", "status-bar");
	const left = document.createElement("div");
	left.slot = "left";
	left.className = "env-ui-statusbar__left";
	const clock = document.createElement("time");
	clock.className = "env-ui-statusbar__clock";
	clock.dateTime = "";
	clock.textContent = formatStatusClock();
	clock.setAttribute("role", "button");
	clock.setAttribute("tabindex", "0");
	clock.setAttribute("aria-label", "Calendar");
	clock.setAttribute("aria-haspopup", "dialog");
	clock.setAttribute("data-chrome-flyout-anchor", "calendar");
	const intro = document.createElement("div");
	intro.className = "env-ui-statusbar__intro";
	if (introInnerHtml) intro.innerHTML = introInnerHtml;
	left.append(clock, intro);
	const center = document.createElement("div");
	center.slot = "center";
	const meta = document.createElement("p");
	meta.className = "env-status-bar__meta";
	center.appendChild(meta);
	const right = document.createElement("div");
	right.slot = "right";
	right.className = "env-ui-statusbar__right";
	const deviceTray = buildShellDeviceTray(device, "env-device-tray env-device-tray--footer");
	deviceTray.setAttribute("role", "button");
	deviceTray.setAttribute("tabindex", "0");
	deviceTray.setAttribute("aria-label", "Quick settings");
	deviceTray.setAttribute("aria-haspopup", "dialog");
	deviceTray.setAttribute("data-chrome-flyout-anchor", "quick-settings");
	right.appendChild(deviceTray);
	const onClockActivate = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		toggleCalendarFlyout(clock);
	};
	const onTrayActivate = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		toggleQuickSettingsFlyout(deviceTray);
	};
	clock.addEventListener("click", onClockActivate);
	clock.addEventListener("keydown", (ev) => {
		if (ev.key === "Enter" || ev.key === " ") onClockActivate(ev);
	});
	deviceTray.addEventListener("click", onTrayActivate);
	deviceTray.addEventListener("keydown", (ev) => {
		if (ev.key === "Enter" || ev.key === " ") onTrayActivate(ev);
	});
	bar.append(left, center, right);
	effect(() => {
		const nav = shell.navEcho.value ? ` │ ${shell.navEcho.value}` : "";
		meta.textContent = `doc=${shell.selectedPath.value} │ viewer=${shell.viewerStatus.value} │ layout=${shell.mqLabel.value}${nav}`;
	}, [
		shell.selectedPath,
		shell.viewerStatus,
		shell.mqLabel,
		shell.navEcho
	], { triggerImmediately: true });
	const tickClock = () => {
		const now = /* @__PURE__ */ new Date();
		clock.textContent = formatStatusClock(now);
		clock.dateTime = now.toISOString();
	};
	tickClock();
	const clockTimer = setInterval(tickClock, 15e3);
	const dispose = () => {
		clearInterval(clockTimer);
	};
	return {
		element: bar,
		dispose
	};
}
//#endregion
//#region src/frontend/shells/environment/components/statusbar/capacitor-native-safe-area.ts
var CSS_TOP = "--env-native-safe-top";
var CSS_BOTTOM = "--env-native-safe-bottom";
var lastTopPx = 0;
var lastBottomPx = 0;
var installed = false;
function readEnvSafeAreaProbe() {
	if (typeof document === "undefined" || !document.body) return {
		top: 0,
		bottom: 0
	};
	const probe = document.createElement("div");
	probe.style.cssText = "position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none;";
	document.body.appendChild(probe);
	const cs = getComputedStyle(probe);
	const top = Number.parseFloat(cs.paddingTop) || 0;
	const bottom = Number.parseFloat(cs.paddingBottom) || 0;
	probe.remove();
	return {
		top,
		bottom
	};
}
function androidFallbackTopPx() {
	try {
		if (!/android/i.test(navigator.userAgent)) return 0;
	} catch {
		return 0;
	}
	return 28;
}
function applyInsets(topPx, bottomPx) {
	lastTopPx = Math.max(0, Math.round(topPx));
	lastBottomPx = Math.max(0, Math.round(bottomPx));
	const top = `${lastTopPx}px`;
	const bottom = `${lastBottomPx}px`;
	document.documentElement.style.setProperty(CSS_TOP, top);
	document.documentElement.style.setProperty(CSS_BOTTOM, bottom);
	document.documentElement.toggleAttribute("data-capacitor-native", true);
	for (const node of document.querySelectorAll(".env-shell-root, env-shell-container")) {
		if (!(node instanceof HTMLElement)) continue;
		node.style.setProperty(CSS_TOP, top);
		node.style.setProperty(CSS_BOTTOM, bottom);
		node.toggleAttribute("data-capacitor-native", true);
	}
}
function stampLateShellRoots() {
	if (lastTopPx <= 0 && lastBottomPx <= 0) return;
	const top = `${lastTopPx}px`;
	const bottom = `${lastBottomPx}px`;
	for (const node of document.querySelectorAll(".env-shell-root, env-shell-container")) {
		if (!(node instanceof HTMLElement)) continue;
		if (node.style.getPropertyValue(CSS_TOP) === top) continue;
		node.style.setProperty(CSS_TOP, top);
		node.style.setProperty(CSS_BOTTOM, bottom);
		node.toggleAttribute("data-capacitor-native", true);
	}
}
async function resolveNativeInsets() {
	let top = 0;
	try {
		const info = await CwsBridge.getShellInfo();
		top = Number(info.statusBarHeightCss) || 0;
	} catch {}
	const env = readEnvSafeAreaProbe();
	top = Math.max(top, env.top);
	const bottom = 0;
	if (top <= 0) top = androidFallbackTopPx();
	return {
		top,
		bottom
	};
}
/** Idempotent — sets `--env-native-safe-*` used by `capacitor-native.scss`. */
async function installCapacitorNativeSafeAreaInsets() {
	if (!isNativeCapacitorHost()) return;
	if (installed) {
		stampLateShellRoots();
		return;
	}
	installed = true;
	const sync = async () => {
		const { top, bottom } = await resolveNativeInsets();
		applyInsets(top, bottom);
	};
	await sync();
	window.addEventListener("resize", () => void sync());
	window.visualViewport?.addEventListener("resize", () => void sync());
	document.addEventListener("orientationchange", () => void sync());
	stampLateShellRoots();
	globalThis.setTimeout?.(stampLateShellRoots, 400);
}
//#endregion
//#region src/frontend/shells/environment/components/explorer/fs-backend.ts
function normalizeVirtualPath(path, asDirectory = true) {
	let p = String(path || "/").trim() || "/";
	if (!p.startsWith("/")) p = `/${p}`;
	p = p.replace(/\/{2,}/g, "/");
	if (p !== "/" && asDirectory && !p.endsWith("/")) p += "/";
	if (p !== "/" && !asDirectory && p.endsWith("/")) p = p.slice(0, -1);
	return p;
}
/**
* WHY: Transfer / Android send `/storage/emulated/0/…`, `file://`, or
* `content://…/primary:Download/…`. Explorer lists that as `/sdcard/…`.
* Do not map `/saf/` — that is Explorer's own tree, not Transfer landing.
*/
function toExplorerStoragePath(path, asDirectory = true) {
	let p = String(path || "").trim();
	if (!p) return "";
	try {
		if (/^file:/i.test(p)) {
			const u = new URL(p);
			p = decodeURIComponent(u.pathname || p);
		}
	} catch {}
	if (/^content:/i.test(p)) {
		let decoded = p;
		try {
			decoded = decodeURIComponent(p);
		} catch {
			decoded = p;
		}
		const id = decoded.match(/(?:primary|home):([^?#]*)/i);
		if (!id) return "";
		const rel = String(id[1] || "").replace(/^\/+/, "");
		p = rel ? `/sdcard/${rel}` : "/sdcard/";
	}
	p = p.replace(/\\/g, "/");
	p = p.replace(/^(?:\/storage\/emulated\/0|\/mnt\/sdcard|storage\/emulated\/0|mnt\/sdcard)(?=\/|$)/i, "/sdcard");
	p = p.replace(/^\/sdcard\/sdcard(?=\/|$)/i, "/sdcard");
	if (!p.startsWith("/")) p = `/${p}`;
	return normalizeVirtualPath(p, asDirectory);
}
//#endregion
//#region src/frontend/shells/environment/components/explorer/backends/chrome-bookmarks-backend.ts
var BOOKMARKS_ROOT = "/bookmarks/";
/**
* chrome.bookmarks is callback-first historically; modern Chromium returns a
* Promise when the callback arg is omitted. Normalize both shapes so
* `await api.getTree()` never resolves to `undefined` (empty Explorer list).
*/
function promisifyBookmarksApi(api) {
	const chromeErr = () => {
		try {
			const err = globalThis?.chrome?.runtime?.lastError;
			return err ? new Error(String(err.message || err)) : null;
		} catch {
			return null;
		}
	};
	const call = (method, ...args) => {
		const fn = api?.[method];
		if (typeof fn !== "function") return Promise.reject(/* @__PURE__ */ new Error(`chrome.bookmarks.${String(method)} missing`));
		try {
			const result = fn.apply(api, args);
			if (result != null && typeof result.then === "function") return result;
		} catch (e) {
			return Promise.reject(e);
		}
		return new Promise((resolve, reject) => {
			try {
				fn.apply(api, [...args, (res) => {
					const err = chromeErr();
					if (err) reject(err);
					else resolve(res);
				}]);
			} catch (e) {
				reject(e);
			}
		});
	};
	return {
		getTree: () => call("getTree"),
		getChildren: (id) => call("getChildren", id),
		create: (opts) => call("create", opts),
		update: (id, changes) => call("update", id, changes),
		move: (id, dest) => call("move", id, dest),
		remove: (id) => call("remove", id),
		removeTree: (id) => call("removeTree", id),
		onCreated: api.onCreated,
		onChanged: api.onChanged,
		onRemoved: api.onRemoved,
		onMoved: api.onMoved
	};
}
var toEntry = (node) => {
	if (typeof node.url === "string" && node.url.length > 0) return {
		name: node.title || node.id,
		kind: "file",
		href: node.url,
		type: "text/uri-list",
		bookmarkId: node.id,
		path: `${BOOKMARKS_ROOT}${node.id}`
	};
	return {
		name: node.title || node.id,
		kind: "directory",
		bookmarkId: node.id,
		path: `${BOOKMARKS_ROOT}${node.id}/`
	};
};
/**
* Extract the trailing path segment as a Chrome bookmark id.
* `/bookmarks/1/` → "1"; `/bookmarks/1/10` → "10"; `/bookmarks/` → "" (root).
*/
var lastId = (path) => {
	const segments = normalizeVirtualPath(path, false).split("/").filter(Boolean);
	const ids = segments[0] === "bookmarks" ? segments.slice(1) : segments;
	return ids[ids.length - 1] ?? "";
};
/**
* `true` when the path addresses a folder (ends with `/`).
*
* WHY (final review #3): the previous impl called `normalizeVirtualPath(path,
* true)` which **forces** a trailing slash onto every input, so URL bookmark
* paths like `/bookmarks/10` were rewritten to `/bookmarks/10/` and `remove`
* always picked `removeTree`. Chrome `remove` rejects folders-with-children
* and `removeTree` rejects URL nodes, so URL deletes failed. We now collapse
* duplicate slashes only and inspect the original trailing slash, which the
* backend's own `toEntry` sets deterministically (folders end with `/`, URL
* nodes do not).
*/
var isFolderPath = (path) => {
	const raw = String(path || "").replace(/\/{2,}/g, "/");
	return raw.length > 1 && raw.endsWith("/");
};
/**
* Build a FsBackend backed by `chrome.bookmarks`. Pass the real API in CRX
* boot, or a mock in tests. Returns `null` if no API is provided so callers
* can short-circuit registration outside CRX.
*/
function createChromeBookmarksBackend(api) {
	if (!api) return null;
	const bookmarks = promisifyBookmarksApi(api);
	const list = async (path) => {
		const norm = normalizeVirtualPath(path, true);
		if (norm === BOOKMARKS_ROOT) {
			const tree = await bookmarks.getTree();
			const entries = [];
			for (const root of tree || []) for (const child of root?.children ?? []) entries.push(toEntry(child));
			return entries;
		}
		const id = lastId(norm);
		if (!id) return [];
		return (await bookmarks.getChildren(id) || []).map(toEntry);
	};
	const mkdir = async (parentPath, name) => {
		const parentId = lastId(parentPath) || "0";
		await bookmarks.create({
			parentId,
			title: name
		});
	};
	const createUrl = async (parentPath, title, url) => {
		const parentId = lastId(parentPath) || "0";
		await bookmarks.create({
			parentId,
			title,
			url
		});
	};
	const rename = async (path, newName) => {
		const id = lastId(path);
		if (!id) return;
		await bookmarks.update(id, { title: newName });
	};
	const update = async (path, patch) => {
		const id = lastId(path);
		if (!id) return;
		const body = {};
		if (patch.title != null) body.title = String(patch.title || "").trim();
		if (patch.url != null && !isFolderPath(path)) body.url = String(patch.url || "").trim();
		if (!Object.keys(body).length) return;
		await bookmarks.update(id, body);
	};
	const move = async (fromPath, toDirPath) => {
		const id = lastId(fromPath);
		const parentId = lastId(toDirPath) || "0";
		if (!id) return;
		await bookmarks.move(id, { parentId });
	};
	const remove = async (path, _recursive) => {
		const id = lastId(path);
		if (!id) return;
		if (isFolderPath(path)) await bookmarks.removeTree(id);
		else await bookmarks.remove(id);
	};
	const writeFile = async (_parentPath, _file) => {
		throw new Error("bookmarks backend does not store file bytes");
	};
	const invalidationListeners = /* @__PURE__ */ new Set();
	const emitInvalidation = () => {
		for (const cb of invalidationListeners) try {
			cb();
		} catch {}
	};
	if (bookmarks.onCreated?.addListener) bookmarks.onCreated.addListener(emitInvalidation);
	if (bookmarks.onChanged?.addListener) bookmarks.onChanged.addListener(emitInvalidation);
	if (bookmarks.onRemoved?.addListener) bookmarks.onRemoved.addListener(emitInvalidation);
	if (bookmarks.onMoved?.addListener) bookmarks.onMoved.addListener(emitInvalidation);
	const subscribeBookmarksInvalidation = (cb) => {
		if (typeof cb !== "function") return () => {};
		invalidationListeners.add(cb);
		return () => {
			invalidationListeners.delete(cb);
		};
	};
	return {
		root: BOOKMARKS_ROOT,
		writable: true,
		list,
		mkdir,
		createUrl,
		rename,
		update,
		move,
		remove,
		writeFile,
		subscribeBookmarksInvalidation
	};
}
//#endregion
//#region src/frontend/shells/environment/components/explorer/backends/chrome-downloads-backend.ts
var DOWNLOADS_ROOT = "/downloads/";
var fileNameOf = (item) => {
	const raw = String(item.filename || item.url || "").trim();
	if (!raw) return `download-${item.id ?? "0"}`;
	const parts = raw.split(/[/\\]/).filter(Boolean);
	return parts[parts.length - 1] || raw;
};
var createChromeDownloadsBackend = (downloads) => {
	if (typeof downloads?.search !== "function") return null;
	return {
		root: DOWNLOADS_ROOT,
		writable: false,
		async list() {
			const rows = await downloads.search({});
			return (Array.isArray(rows) ? rows : []).filter((item) => item && item.exists !== false && String(item.state || "") !== "interrupted").map((item) => {
				const id = String(item.id ?? fileNameOf(item));
				return {
					name: fileNameOf(item),
					kind: "file",
					path: `${DOWNLOADS_ROOT}${id}`
				};
			});
		}
	};
};
//#endregion
//#region src/frontend/shells/environment/components/explorer/storage-bridge.ts
var api = null;
var INVOKE_MS = 12e3;
var withTimeout$1 = async (task, ms, fallback) => {
	let timer;
	try {
		return await Promise.race([task, new Promise((resolve) => {
			timer = setTimeout(() => resolve(fallback), ms);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};
var capacitorInvoke = async (channel, payload = {}) => {
	const g = globalThis;
	const plugin = g.__CWS_BRIDGE_PLUGIN__ || g.Capacitor?.Plugins?.CwsBridge;
	if (typeof plugin?.invoke !== "function") return {
		ok: false,
		error: "no-bridge"
	};
	const r = await withTimeout$1(Promise.resolve(plugin.invoke({
		channel,
		payload
	})), INVOKE_MS, {
		ok: false,
		error: "timeout"
	});
	const echo = r?.echo && typeof r.echo === "object" ? r.echo : {};
	return {
		...r || {},
		...echo
	};
};
/**
* WHY: Speed Dial / shortcuts store `file:///storage/emulated/0/…`, `/mnt/sdcard/…`,
* or `sdcard/…`. CwsStorageHost only understands `/sdcard/` `/saf/`.
*/
var toNativeStorageVirtualPath = (raw) => {
	let s = String(raw || "").trim();
	if (!s) return "";
	try {
		s = decodeURIComponent(s);
	} catch {}
	const mapped = toExplorerStoragePath(s, false);
	return /^\/(?:sdcard|saf)(?:\/|$)/i.test(mapped) ? mapped : "";
};
var parseNativeStoragePath = (virtualPath) => {
	const raw = toNativeStorageVirtualPath(virtualPath) || String(virtualPath || "").trim();
	if (!raw) return null;
	const root = raw === "/saf" || raw.startsWith("/saf/") ? "saf" : raw === "/sdcard" || raw.startsWith("/sdcard/") ? "sdcard" : "";
	if (!root) return null;
	if (raw === `/${root}`) return {
		root,
		rel: "/"
	};
	const prefix = root === "saf" ? "/saf/" : "/sdcard/";
	return {
		root,
		rel: (raw.startsWith(prefix) ? raw.slice(prefix.length - 1) : raw) || "/"
	};
};
var isNativeStorageAvailable = () => {
	if (api?.list) return true;
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && c.isNativePlatform();
	} catch {
		return false;
	}
};
var listNativeStorage = async (root, path = "/") => {
	if (api?.list) return api.list(root, path);
	const echo = await capacitorInvoke("storage:list", {
		root,
		path
	});
	const rows = echo.entries || echo.files;
	return Array.isArray(rows) ? rows : [];
};
var dataUrlToFile = async (dataUrl, name, mime) => {
	const src = String(dataUrl || "").trim();
	if (!src) return null;
	const fileName = name || "file";
	const fallbackType = mime || "application/octet-stream";
	if (src.startsWith("data:")) {
		const comma = src.indexOf(",");
		if (comma < 0) return null;
		const meta = src.slice(5, comma);
		const payload = src.slice(comma + 1);
		const type = meta.split(";")[0] || fallbackType;
		try {
			if (/;base64/i.test(meta)) {
				const bin = atob(payload);
				const bytes = new Uint8Array(bin.length);
				for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
				return new File([bytes], fileName, { type });
			}
			return new File([decodeURIComponent(payload)], fileName, { type });
		} catch {
			return null;
		}
	}
	if (/^[A-Za-z0-9+/=\s]+$/.test(src) && src.length > 16) try {
		const bin = atob(src.replace(/\s/g, ""));
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		return new File([bytes], fileName, { type: fallbackType });
	} catch {}
	try {
		const blob = await (await fetch(src)).blob();
		return new File([blob], fileName, { type: blob.type || fallbackType });
	} catch {
		return null;
	}
};
/** Read one `/sdcard/` or `/saf/` file through CwsBridge (`storage:read`). */
var readNativeStorageFile = async (virtualPath, opts) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return null;
	const readOnce = async () => {
		const echo = await capacitorInvoke("storage:read", {
			root: parsed.root,
			path: parsed.rel
		});
		const name = String(echo.name || virtualPath.split("/").filter(Boolean).pop() || "file");
		const mime = String(echo.mime || echo.mimeType || "application/octet-stream");
		const error = String(echo.error || "");
		const text = String(echo.text || echo.content || "");
		if (text) return {
			file: new File([text], name, { type: mime || "text/markdown" }),
			error
		};
		const data = String(echo.data || echo.dataUrl || "");
		if (data) return {
			file: await dataUrlToFile(data, name, mime),
			error
		};
		return {
			file: null,
			error
		};
	};
	let got = await readOnce();
	if (got.file) return got.file;
	if (opts?.requestAccess === false) return null;
	if (parsed.root === "sdcard") {
		const denied = /all-files-required|permission|EACCES|denied|timeout/i.test(got.error);
		const status = await getAllFilesStatus();
		if (denied || !status.allFilesAccess) {
			await requestAllFilesAccess();
			got = await readOnce();
		}
	}
	return got.file;
};
/** Delete a `/sdcard/` or `/saf/` file or folder through CwsBridge (`storage:delete`). */
var removeNativeStorage = async (virtualPath) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) throw new Error("not native storage");
	const plugin = globalThis.Capacitor?.Plugins?.CwsBridge;
	if (typeof plugin?.invoke !== "function") throw new Error("no native storage");
	const r = await plugin.invoke({
		channel: "storage:delete",
		payload: {
			root: parsed.root,
			path: parsed.rel
		}
	});
	const echo = r?.echo || {};
	if (r?.ok === false || echo.deleted !== true) throw new Error(String(echo.error || "delete failed"));
};
var getAllFilesStatus = async () => {
	if (api?.allFilesStatus) return api.allFilesStatus();
	const echo = await capacitorInvoke("storage:all-files-status", {});
	return {
		allFilesAccess: echo.allFilesAccess === true,
		runtimeGranted: echo.runtimeGranted === true,
		note: echo.note ? String(echo.note) : void 0
	};
};
var requestAllFilesAccess = async () => {
	if (api?.requestAllFiles) return api.requestAllFiles();
	const echo = await capacitorInvoke("storage:all-files-request", {});
	return echo.ok === true || echo.opened === true;
};
//#endregion
//#region src/frontend/shells/environment/components/explorer/backends/native-fs-backend.ts
var toEntries = (path, rows) => {
	const base = normalizeVirtualPath(path, true);
	return rows.filter((row) => row?.name).map((row) => {
		const kind = row.kind === "directory" ? "directory" : "file";
		return {
			name: String(row.name),
			kind,
			path: row.path || `${base}${row.name}${kind === "directory" ? "/" : ""}`,
			type: kind === "file" ? void 0 : void 0
		};
	});
};
var createNativeFsBackend = (root) => ({
	root,
	writable: true,
	async list(path) {
		const rel = normalizeVirtualPath(path, true).slice(root.length - 1) || "/";
		return toEntries(path, await listNativeStorage(root === "/saf/" ? "saf" : "sdcard", rel));
	},
	async readFile(path) {
		return readNativeStorageFile(path);
	},
	async remove(path, _recursive) {
		await removeNativeStorage(path);
	}
});
//#endregion
//#region src/frontend/shells/environment/components/explorer/backends/neutralino-fs-backend.ts
var DESKTOP_ROOT = "/desktop/";
var neu = () => {
	try {
		return globalThis.Neutralino ?? null;
	} catch {
		return null;
	}
};
var isNeutralinoFilesystemAvailable = () => typeof neu()?.filesystem?.readDirectory === "function";
var resolveNeutralinoHome = async () => {
	const os = neu()?.os;
	if (typeof os?.getPath === "function") for (const name of ["home", "documents"]) try {
		const path = String(await os.getPath(name) || "").trim();
		if (path) return path;
	} catch {}
	return "";
};
var joinNative = (home, rel) => {
	const base = home.replace(/[/\\]+$/, "");
	const tail = rel.replace(/^[/\\]+/, "").replace(/[/\\]+$/, "");
	if (!tail) return base || home;
	const sep = base.includes("\\") ? "\\" : "/";
	return `${base}${sep}${tail.replace(/[/\\]+/g, sep)}`;
};
var virtualToNative = (home, virtualPath, asDirectory) => {
	const v = normalizeVirtualPath(virtualPath, asDirectory);
	return joinNative(home, v.startsWith("/desktop/") ? v.slice(9) : v.replace(/^\/+/, ""));
};
var createNeutralinoFsBackend = (homePath) => {
	const fs = neu()?.filesystem;
	const home = String(homePath || "").trim();
	if (!home || typeof fs?.readDirectory !== "function") return null;
	return {
		root: DESKTOP_ROOT,
		writable: true,
		async list(path) {
			const native = virtualToNative(home, path, true);
			const rows = await fs.readDirectory(native);
			const base = normalizeVirtualPath(path, true);
			return (Array.isArray(rows) ? rows : []).map((row) => {
				const name = String(row?.entry || "").trim();
				if (!name || name === "." || name === "..") return null;
				const kind = String(row?.type || "").toUpperCase() === "DIRECTORY" ? "directory" : "file";
				return {
					name,
					kind,
					path: `${base}${name}${kind === "directory" ? "/" : ""}`
				};
			}).filter((row) => Boolean(row));
		},
		async mkdir(path, name) {
			if (typeof fs.createDirectory !== "function") throw new Error("Neutralino filesystem.createDirectory unavailable");
			const parent = virtualToNative(home, path, true);
			const sep = parent.includes("\\") ? "\\" : "/";
			await fs.createDirectory(`${parent}${sep}${name}`);
		},
		async remove(path) {
			if (typeof fs.remove !== "function") throw new Error("Neutralino filesystem.remove unavailable");
			await fs.remove(virtualToNative(home, path, false));
		},
		async rename(path, newName) {
			if (typeof fs.move !== "function") throw new Error("Neutralino filesystem.move unavailable");
			const from = virtualToNative(home, path, false);
			const parentVirt = normalizeVirtualPath(path, false).replace(/[^/]+$/, "");
			const dest = virtualToNative(home, `${parentVirt}${newName}`, false);
			await fs.move(from, dest);
		},
		async move(fromPath, toDirPath) {
			if (typeof fs.move !== "function") throw new Error("Neutralino filesystem.move unavailable");
			const from = virtualToNative(home, fromPath, false);
			const name = normalizeVirtualPath(fromPath, false).split("/").filter(Boolean).pop() || "";
			const dest = virtualToNative(home, `${normalizeVirtualPath(toDirPath, true)}${name}`, false);
			await fs.move(from, dest);
		},
		async writeFile(parentPath, file) {
			const dest = virtualToNative(home, `${normalizeVirtualPath(parentPath, true)}${file.name}`, false);
			const bytes = await file.arrayBuffer();
			if (typeof fs.writeBinaryFile === "function") {
				await fs.writeBinaryFile(dest, bytes);
				return;
			}
			if (typeof fs.writeFile === "function") {
				await fs.writeFile(dest, await file.text());
				return;
			}
			throw new Error("Neutralino filesystem write unavailable");
		}
	};
};
//#endregion
//#region src/frontend/shells/environment/components/explorer/mounts.ts
var MOUNTS_ROOT = "/mounts/";
var CATALOG_KEY = "cw::explorer::mounts";
var handles = /* @__PURE__ */ new Map();
var observer = null;
var readCatalog = () => {
	try {
		const raw = localStorage.getItem(CATALOG_KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		if (parsed && Array.isArray(parsed.mounts)) return parsed;
	} catch {}
	return { mounts: [] };
};
var walkHandle = async (dir, virtualDir) => {
	const entries = [];
	const base = normalizeVirtualPath(virtualDir, true);
	try {
		for await (const [name, handle] of dir.entries()) {
			const kind = handle.kind === "directory" ? "directory" : "file";
			entries.push({
				name,
				kind,
				path: `${base}${name}${kind === "directory" ? "/" : ""}`
			});
		}
	} catch {
		return [];
	}
	return entries;
};
var resolveNestedHandle = async (root, rel) => {
	let dir = root;
	for (const seg of rel.split("/").filter(Boolean)) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return null;
	}
	return dir;
};
var createMountBackend = (mount) => ({
	root: mount.path,
	writable: true,
	async list(path) {
		const handle = handles.get(mount.id);
		if (!handle) return [];
		const rel = normalizeVirtualPath(path, true).slice(mount.path.length);
		const dir = rel ? await resolveNestedHandle(handle, rel) : handle;
		if (!dir) return [];
		return walkHandle(dir, path);
	}
});
var observeHandle = (handle) => {
	const Ctor = globalThis.FileSystemObserver;
	if (typeof Ctor !== "function") return;
	try {
		observer?.disconnect?.();
		const next = new Ctor(() => {
			window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
		});
		next.observe(handle);
		observer = next;
	} catch {}
};
var listExplorerMounts = () => readCatalog().mounts;
var restoreDirectoryMounts = () => {
	restorePersistedHandles().then(() => {
		for (const mount of readCatalog().mounts) {
			const handle = handles.get(mount.id);
			if (!handle) continue;
			registerFsBackend(createMountBackend(mount));
			registerDirectoryRoot(mount.path, handle);
			observeHandle(handle);
		}
	});
};
var HANDLE_DB = "cw-explorer-fs";
var HANDLE_STORE = "handles";
var openHandleDb = () => new Promise((resolve, reject) => {
	const req = indexedDB.open(HANDLE_DB, 1);
	req.onupgradeneeded = () => req.result.createObjectStore(HANDLE_STORE);
	req.onsuccess = () => resolve(req.result);
	req.onerror = () => reject(req.error);
});
var restorePersistedHandles = async () => {
	if (typeof indexedDB === "undefined") return;
	try {
		const db = await openHandleDb();
		const stored = await new Promise((resolve, reject) => {
			const req = db.transaction(HANDLE_STORE, "readonly").objectStore(HANDLE_STORE).openCursor();
			const rows = [];
			req.onsuccess = () => {
				const cursor = req.result;
				if (!cursor) {
					resolve(rows);
					return;
				}
				rows.push([String(cursor.key), cursor.value]);
				cursor.continue();
			};
			req.onerror = () => reject(req.error);
		});
		for (const [id, handle] of stored) {
			if (!handle || handles.has(id)) continue;
			try {
				const perm = await handle.queryPermission?.({ mode: "read" });
				if (perm && perm !== "granted") continue;
				handles.set(id, handle);
			} catch {}
		}
	} catch {}
};
/** Placeholder so /mounts/ appears at virtual root even before a pick. */
var ensureMountsRootBackend = () => {
	registerFsBackend({
		root: MOUNTS_ROOT,
		writable: false,
		async list() {
			return listExplorerMounts().map((m) => ({
				name: m.label,
				kind: "directory",
				path: m.path
			}));
		}
	});
	restoreDirectoryMounts();
};
//#endregion
//#region src/frontend/shells/environment/components/explorer/path-router.ts
/**
* INVARIANT: registry keys are normalized directory roots (trailing slash,
* except `/` itself). Longest-prefix match wins so nested backends (e.g.
* `/bookmarks/` under a future `/`-rooted fallback) resolve deterministically.
*/
var registry = /* @__PURE__ */ new Map();
var normalizeRoot = (root) => normalizeVirtualPath(root, true);
var backendListeners = /* @__PURE__ */ new Set();
var notifyBackendRegistered = (root) => {
	for (const listener of backendListeners) try {
		listener(root);
	} catch {}
};
function registerFsBackend(backend) {
	if (!backend?.root) return;
	const key = normalizeRoot(backend.root);
	registry.set(key, backend);
	notifyBackendRegistered(key);
	bindFsBackendToProvide(backend);
}
function unregisterFsBackend(root) {
	registry.delete(normalizeRoot(root));
}
/**
* Longest-prefix match. A backend rooted at `/user/` matches `/user/links/`
* but not `/user-other/`. The root `/` matches anything when registered.
*/
function resolveFsBackend(path) {
	const target = normalizeVirtualPath(path, true);
	let best = null;
	let bestLen = -1;
	for (const [root, backend] of registry) {
		if (root === "/") {
			if (bestLen < 1) {
				best = backend;
				bestLen = 1;
			}
			continue;
		}
		if (target === root || target.startsWith(root)) {
			if (root.length > bestLen) {
				best = backend;
				bestLen = root.length;
			}
		}
	}
	return best;
}
var OPFS_SUPPORT_KEY = "cwsp.opfs.enabled";
var isOpfsSupportEnabledSync = () => {
	try {
		if (typeof localStorage === "undefined") return true;
		const value = localStorage.getItem(OPFS_SUPPORT_KEY);
		return value !== "0" && value !== "false";
	} catch {
		return true;
	}
};
var isOpfsCapabilityAvailableSync = () => typeof navigator !== "undefined" && typeof navigator.storage?.getDirectory === "function";
var isOpfsBackendActiveSync = () => isOpfsCapabilityAvailableSync() && isOpfsSupportEnabledSync();
var stripStoragePrefix = (path, scope) => {
	const vpath = String(path || "").replace(/^\/+/, "");
	const prefix = `${scope}/`;
	if (vpath.startsWith(prefix)) return `/${vpath.slice(prefix.length)}`;
	if (vpath === scope) return "/";
	return `/${vpath}`;
};
var listHandleDirectory = async (root, path) => {
	if (!root) return [];
	const segments = stripStoragePrefix(path, normalizeVirtualPath(path, true).startsWith("/idb/") ? "idb" : "user").split("/").filter(Boolean);
	let dir = root;
	for (const seg of segments) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return [];
	}
	const entries = [];
	try {
		for await (const [name, handle] of dir.entries()) {
			const kind = handle?.kind === "directory" ? "directory" : "file";
			const childPath = `${normalizeVirtualPath(path, true)}${name}${kind === "directory" ? "/" : ""}`;
			entries.push({
				name,
				kind,
				path: childPath
			});
		}
	} catch {
		return [];
	}
	return entries;
};
var readHandleFile = async (root, path, scope) => {
	if (!root) return null;
	const segments = stripStoragePrefix(path, scope).split("/").filter(Boolean);
	if (!segments.length) return null;
	let dir = root;
	for (const seg of segments.slice(0, -1)) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return null;
	}
	try {
		return await (await dir.getFileHandle(segments[segments.length - 1], { create: false })).getFile();
	} catch {
		return null;
	}
};
var bindFsBackendToProvide = (backend) => {
	if (backend.root === "/bookmarks/" || backend.root === "/downloads/") return;
	import("../vendor/culori.js").then((n) => n.t).then(({ registerProvideBackend }) => {
		registerProvideBackend({
			root: backend.root,
			list: async (path) => {
				const rows = await backend.list(path);
				const base = normalizeVirtualPath(path, true);
				return rows.map((row) => ({
					name: row.name,
					kind: row.kind,
					path: row.path || `${base}${row.name}${row.kind === "directory" ? "/" : ""}`
				}));
			},
			readFile: backend.readFile,
			writeFile: backend.writeFile ? async (path, file) => {
				const slash = String(path || "").lastIndexOf("/");
				const parent = slash >= 0 ? path.slice(0, slash + 1) : backend.root;
				await backend.writeFile?.(parent, file);
				return true;
			} : void 0
		});
	}).catch(() => {});
};
var loadIdbRoot = async () => {
	if (typeof indexedDB === "undefined") return null;
	try {
		const { getIdbRoot } = await import("../vendor/culori.js").then((n) => n.t);
		return await getIdbRoot();
	} catch {
		return null;
	}
};
var resolveUserHandleRoot = async () => {
	if (isOpfsBackendActiveSync()) try {
		return await navigator.storage.getDirectory();
	} catch {
		return null;
	}
	return loadIdbRoot();
};
var createStorageFsBackend = (root, getRoot) => {
	const scope = root === "/idb/" ? "idb" : "user";
	return {
		root,
		writable: true,
		async list(path) {
			return listHandleDirectory(await getRoot().catch(() => null), path);
		},
		async readFile(path) {
			return readHandleFile(await getRoot().catch(() => null), path, scope);
		},
		async mkdir(parentPath, name) {
			const handleRoot = await getRoot();
			if (!handleRoot) return;
			const segments = [...stripStoragePrefix(parentPath, scope).split("/").filter(Boolean), String(name || "").trim()].filter(Boolean);
			let dir = handleRoot;
			for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create: true });
		},
		async writeFile(parentPath, file) {
			const handleRoot = await getRoot();
			if (!handleRoot || !file) return;
			const segments = stripStoragePrefix(parentPath, scope).split("/").filter(Boolean);
			let dir = handleRoot;
			for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create: true });
			const writable = await (await dir.getFileHandle(file.name || `file-${Date.now()}`, { create: true })).createWritable();
			await writable.write(file);
			await writable.close();
		},
		async remove(path, recursive = true) {
			const handleRoot = await getRoot();
			if (!handleRoot) return;
			const segments = stripStoragePrefix(path, scope).replace(/\/+$/g, "").split("/").filter(Boolean);
			if (!segments.length) return;
			const name = segments.pop();
			let dir = handleRoot;
			for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create: false });
			await dir.removeEntry(name, { recursive });
		}
	};
};
function ensureDefaultFsBackends() {
	if (!resolveFsBackend("/user/")) registerFsBackend(createStorageFsBackend("/user/", resolveUserHandleRoot));
	if (isOpfsBackendActiveSync() && typeof indexedDB !== "undefined") {
		if (!resolveFsBackend("/idb/")) registerFsBackend(createStorageFsBackend("/idb/", loadIdbRoot));
	} else {
		unregisterFsBackend("/idb/");
		import("../vendor/culori.js").then((n) => n.t).then(({ unregisterProvideBackend }) => {
			unregisterProvideBackend("/idb/");
		}).catch(() => {});
	}
	if (!resolveFsBackend("/assets/")) registerFsBackend({
		root: "/assets/",
		writable: false,
		async list(path) {
			try {
				const { tryRemoteMountedList } = await import("../vendor/culori.js").then((n) => n.t);
				return await tryRemoteMountedList(path) ?? [];
			} catch {
				return [];
			}
		},
		async readFile(path) {
			const p = String(path || "").trim();
			if (!p || p.endsWith("/")) return null;
			try {
				const { tryRemoteMountedRead } = await import("../vendor/culori.js").then((n) => n.t);
				const remote = await tryRemoteMountedRead(p);
				if (remote) return remote;
			} catch {}
			try {
				const r = await fetch(p);
				if (!r?.ok) return null;
				const blob = await r.blob();
				const name = p.slice(p.lastIndexOf("/") + 1) || "asset";
				return new File([blob], name, { type: blob.type || "" });
			} catch {
				return null;
			}
		}
	});
	import("../vendor/culori.js").then((n) => n.t).then(({ ensureRemoteMountedFs }) => {
		ensureRemoteMountedFs();
	}).catch(() => {});
	if (!resolveFsBackend("/bookmarks/")) {
		const chromeAny = globalThis?.chrome;
		if (chromeAny?.bookmarks) {
			const backend = createChromeBookmarksBackend(chromeAny.bookmarks);
			if (backend) registerFsBackend(backend);
		}
	}
	if (!resolveFsBackend("/downloads/")) {
		const chromeAny = globalThis?.chrome;
		if (chromeAny?.downloads) {
			const backend = createChromeDownloadsBackend(chromeAny.downloads);
			if (backend) registerFsBackend(backend);
		}
	}
	if (isNativeStorageAvailable()) {
		if (!resolveFsBackend("/sdcard/")) registerFsBackend(createNativeFsBackend("/sdcard/"));
		if (!resolveFsBackend("/saf/")) registerFsBackend(createNativeFsBackend("/saf/"));
	}
	if (isNeutralinoFilesystemAvailable() && !resolveFsBackend("/desktop/")) resolveNeutralinoHome().then((home) => {
		if (!home || resolveFsBackend("/desktop/")) return;
		const backend = createNeutralinoFsBackend(home);
		if (backend) registerFsBackend(backend);
	});
	if (!resolveFsBackend("/mounts/")) ensureMountsRootBackend();
	observeUserFileSystem();
}
/**
* WHY: FileSystemObserver is Chromium-experimental. When present, OPFS
* mutations refresh Explorer without polling. Cap / SAF fall back to the
* toolbar refresh and `cwsp:explorer-mount-change`.
*/
var observeUserFileSystem = () => {
	if (typeof window === "undefined") return;
	const g = globalThis;
	const Ctor = g.FileSystemObserver;
	const getDir = g.navigator?.storage?.getDirectory;
	if (typeof Ctor !== "function" || typeof getDir !== "function") return;
	if (globalThis.__CWSP_USER_FS_OBS__) return;
	globalThis.__CWSP_USER_FS_OBS__ = true;
	getDir.call(g.navigator?.storage).then((root) => {
		return new Ctor(() => {
			window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
		}).observe(root);
	}).catch(() => {
		globalThis.__CWSP_USER_FS_OBS__ = false;
	});
};
ensureDefaultFsBackends();
//#endregion
//#region src/frontend/shells/environment/components/explorer/ContextMenu.ts
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var IMPORTANT_CSS = "important";
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var rootMenuPlacement = null;
var rootMenuOverlayUnregister = null;
var cleanupFns = [];
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuPlacementByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
var SUBMENU_FALLBACKS = [
	"left-start",
	"right-end",
	"left-end",
	"bottom-start",
	"top-start"
];
/**
* WHY: Chromium CSS Anchor (`strategy: auto`) only flips — it does not keep the
* submenu inside the visual viewport. Force the JS solver + a post-layout
* measure so the first paint (icons/fonts) cannot leave a 0×0 clamp.
*/
var placeMenuOverlay = (menu, options) => {
	const handle = placeOverlay(menu, {
		...options,
		strategy: "js"
	});
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => {
		handle.update?.();
	});
	return handle;
};
/**
* WHY: Before Settings opens, `html[data-theme]` may lag OS prefers-color-scheme.
* Stamp the same pin QS/Theme uses so light panels never keep dark-default white ink.
*/
var resolveContextMenuTheme = () => {
	const root = document.documentElement;
	const pinned = String(root.getAttribute("data-theme") || "").trim().toLowerCase();
	if (pinned === "light" || pinned === "dark") return pinned;
	const scheme = String(root.getAttribute("data-scheme") || "").trim().toLowerCase();
	if (scheme === "light" || scheme === "dark") return scheme;
	try {
		const stored = String(localStorage.getItem("rs-appearance-theme") || "").trim().toLowerCase();
		if (stored === "light" || stored === "dark") return stored;
	} catch {}
	return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};
/**
* WHY: Explorer menus can be mounted beside host-shell controls that apply
* broad `button`, `ul`, and `ui-icon` rules. Inline geometry stays important;
* INVARIANT: do not stamp slate/hex background/color — wallpaper `--base-color` must tint the panel.
*/
var stampContextMenuPanel = (menu, compact) => {
	menu.style.setProperty("position", "fixed", IMPORTANT_CSS);
	menu.style.setProperty("box-sizing", "border-box", IMPORTANT_CSS);
	menu.style.setProperty("min-width", compact ? "188px" : "220px", IMPORTANT_CSS);
	menu.style.setProperty("max-width", "min(320px, calc(100vw - 24px))", IMPORTANT_CSS);
	menu.style.setProperty("padding", compact ? "0.3rem" : "0.4rem", IMPORTANT_CSS);
	menu.style.setProperty("border-radius", "14px", IMPORTANT_CSS);
	menu.style.setProperty("pointer-events", "auto", IMPORTANT_CSS);
	menu.style.setProperty("backdrop-filter", "blur(10px)", IMPORTANT_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "blur(10px)", IMPORTANT_CSS);
	menu.style.removeProperty("border");
	menu.style.removeProperty("background");
	menu.style.removeProperty("color");
	menu.style.removeProperty("box-shadow");
	const theme = resolveContextMenuTheme();
	menu.dataset.theme = theme;
	menu.style.setProperty("color-scheme", theme === "light" ? "light only" : "dark only", IMPORTANT_CSS);
};
var stampContextMenuList = (list) => {
	list.style.setProperty("list-style", "none", IMPORTANT_CSS);
	list.style.setProperty("list-style-type", "none", IMPORTANT_CSS);
	list.style.setProperty("margin", "0", IMPORTANT_CSS);
	list.style.setProperty("padding", "0", IMPORTANT_CSS);
	list.style.setProperty("display", "flex", IMPORTANT_CSS);
	list.style.setProperty("flex-direction", "column", IMPORTANT_CSS);
	list.style.setProperty("align-items", "stretch", IMPORTANT_CSS);
	list.style.setProperty("gap", "0.2rem", IMPORTANT_CSS);
	list.style.setProperty("width", "100%", IMPORTANT_CSS);
	list.style.setProperty("box-sizing", "border-box", IMPORTANT_CSS);
};
var stampContextMenuItem = (button, danger) => {
	button.style.setProperty("appearance", "none", IMPORTANT_CSS);
	button.style.setProperty("-webkit-appearance", "none", IMPORTANT_CSS);
	button.style.setProperty("box-sizing", "border-box", IMPORTANT_CSS);
	button.style.setProperty("width", "100%", IMPORTANT_CSS);
	button.style.setProperty("max-width", "100%", IMPORTANT_CSS);
	button.style.setProperty("margin", "0", IMPORTANT_CSS);
	button.style.setProperty("display", "grid", IMPORTANT_CSS);
	button.style.setProperty("grid-template-columns", "1.375rem minmax(0, 1fr) auto", IMPORTANT_CSS);
	button.style.setProperty("align-items", "center", IMPORTANT_CSS);
	button.style.setProperty("justify-items", "start", IMPORTANT_CSS);
	button.style.setProperty("gap", "0.55rem", IMPORTANT_CSS);
	button.style.setProperty("border", "none", IMPORTANT_CSS);
	button.style.setProperty("border-radius", "10px", IMPORTANT_CSS);
	button.style.setProperty("padding", "0.5rem 0.6rem", IMPORTANT_CSS);
	button.style.setProperty("min-height", "2.35rem", IMPORTANT_CSS);
	button.style.setProperty("font", "inherit", IMPORTANT_CSS);
	button.style.setProperty("font-size", "0.8125rem", IMPORTANT_CSS);
	button.style.setProperty("line-height", "1.25", IMPORTANT_CSS);
	button.style.setProperty("text-align", "start", IMPORTANT_CSS);
	button.style.setProperty("cursor", "pointer", IMPORTANT_CSS);
	button.style.removeProperty("background");
	button.style.removeProperty("background-color");
	if (!danger) button.style.setProperty("color", "inherit", IMPORTANT_CSS);
	else {
		const dangerInk = resolveContextMenuTheme() === "light" ? "#9f1239" : "#fecaca";
		button.style.setProperty("color", dangerInk, IMPORTANT_CSS);
		button.style.setProperty("--cw-menu-fg", dangerInk, IMPORTANT_CSS);
	}
};
var ensureStyle = () => {
	let style = document.getElementById("cw-unified-context-menu-style");
	if (!style) {
		style = document.createElement("style");
		style.id = "cw-unified-context-menu-style";
		document.head.appendChild(style);
	}
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${CONTEXT_MENU_LAYER_Z_FALLBACK});
            pointer-events: none;
        }

        .cw-context-menu {
            /* WHY: Menu often mounts outside .wf-demo-root — use :root wallpaper seeds. */
            --cw-menu-seed: var(--base-color, var(--color-primary, #5a7fff));
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            /*
             * WHY: !important — unlayered button rules / token-fallback sheets shipped by some hosts
             * override the panel shadow otherwise; mirror the explorer-view unified menu so the
             * speed-dial context menu keeps visible elevation + glass blur.
             */
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            pointer-events: auto;
            user-select: none;
            /* WHY: nested Actions/Open-in menus are taller than the remaining
             * viewport; CSS Anchor flip does not clamp, so the panel must scroll. */
            max-height: min(80dvh, calc(100vh - 16px));
            overflow-x: hidden;
            overflow-y: auto;
            overscroll-behavior: contain;
        }

        html[data-theme="light"] .cw-context-menu,
        .cw-context-menu[data-theme="light"] {
            color-scheme: light only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        html[data-theme="dark"] .cw-context-menu,
        .cw-context-menu[data-theme="dark"] {
            color-scheme: dark only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) .cw-context-menu:not([data-theme="dark"]) {
                color-scheme: light only;
                --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
                --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
                --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
                border-color: var(--cw-menu-border);
                background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
                color: var(--cw-menu-fg);
                box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
            }
        }

        .cw-context-menu.cw-context-menu--compact {
            min-width: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: left;
        }

        .cw-context-menu__list > li {
            list-style: none !important;
            list-style-type: none !important;
            display: block !important;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
        }

        button.cw-context-menu__item,
        .cw-context-menu button.cw-context-menu__item {
            appearance: none !important;
            -webkit-appearance: none !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: grid !important;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto !important;
            align-items: center !important;
            justify-items: start !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
        }

        .cw-context-menu__item > * {
            pointer-events: none;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 16%, transparent) !important;
        }

        .cw-context-menu__item[disabled] {
            opacity: 0.45;
            cursor: default;
        }

        .cw-context-menu__item--danger {
            color: #fecaca !important;
        }

        html[data-theme="light"] .cw-context-menu__item--danger,
        .cw-context-menu[data-theme="light"] .cw-context-menu__item--danger {
            color: #9f1239 !important;
        }

        .cw-context-menu__icon {
            justify-self: center;
            inline-size: 1.375rem;
            block-size: 1.375rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            inline-size: 1.125rem !important;
            block-size: 1.125rem !important;
            min-inline-size: 1.125rem !important;
            min-block-size: 1.125rem !important;
            --icon-padding: 0px !important;
            color: var(--cw-menu-fg, inherit) !important;
            pointer-events: none;
        }

        .cw-context-menu__label {
            justify-self: stretch;
            text-align: start !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-inline-size: 0;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron {
            justify-self: end;
            opacity: 0.72;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            pointer-events: none;
        }
    `;
};
var clearCleanup = () => {
	for (const fn of cleanupFns) try {
		fn();
	} catch {}
	cleanupFns = [];
};
var clearTimersFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuOpenTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuOpenTimers.delete(key);
	}
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		submenuPlacementByDepth.get(key)?.dispose();
		submenuPlacementByDepth.delete(key);
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session, placementStrategy) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	menu.style.zIndex = String(depth + 1);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	stampContextMenuList(list);
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session, placementStrategy);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		submenuPlacementByDepth.set(nextDepth, placeMenuOverlay(submenu, {
			origin: {
				type: "element",
				element: anchorButton
			},
			placement: "right-start",
			fallbacks: SUBMENU_FALLBACKS,
			strategy: "js"
		}));
	};
	const scheduleOpenSubmenu = (item, anchorButton, nextDepth) => {
		const existingOpen = submenuOpenTimers.get(nextDepth);
		if (existingOpen) clearTimeout(existingOpen);
		cancelScheduledCloseFromDepth(nextDepth);
		const timer = setTimeout(() => {
			submenuOpenTimers.delete(nextDepth);
			openSubmenu(item, anchorButton, nextDepth);
		}, SUBMENU_HOVER_OPEN_MS);
		submenuOpenTimers.set(nextDepth, timer);
	};
	const scheduleCloseSubmenuFromDepth = (nextDepth) => {
		const existingClose = submenuCloseTimers.get(nextDepth);
		if (existingClose) clearTimeout(existingClose);
		const timer = setTimeout(() => {
			submenuCloseTimers.delete(nextDepth);
			closeSubmenusFromDepth(nextDepth);
		}, SUBMENU_HOVER_CLOSE_MS);
		submenuCloseTimers.set(nextDepth, timer);
	};
	for (const item of entries) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `cw-context-menu__item${item.danger ? " cw-context-menu__item--danger" : ""}`;
		button.setAttribute("role", "menuitem");
		button.disabled = Boolean(item.disabled);
		stampContextMenuItem(button, Boolean(item.danger));
		const hasChildren = Boolean(item.children?.length);
		button.innerHTML = `
            <span class="cw-context-menu__icon">${item.icon ? `<ui-icon icon="${item.icon}"></ui-icon>` : ""}</span>
            <span class="cw-context-menu__label">${item.label}</span>
            <span class="cw-context-menu__chevron">${hasChildren ? `<ui-icon icon="caret-right"></ui-icon>` : ""}</span>
        `;
		if (hasChildren) {
			const nextDepth = depth + 1;
			button.setAttribute("aria-haspopup", "menu");
			button.addEventListener("pointerenter", () => scheduleOpenSubmenu(item, button, nextDepth));
			button.addEventListener("pointerleave", () => scheduleCloseSubmenuFromDepth(nextDepth));
			button.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (session !== menuSession || !rootMenu?.isConnected) return;
				cancelScheduledCloseFromDepth(nextDepth);
				const existing = submenuByDepth.get(nextDepth);
				const activeAnchor = submenuAnchorByDepth.get(nextDepth);
				if (existing?.isConnected && activeAnchor === button) {
					closeSubmenusFromDepth(nextDepth);
					return;
				}
				openSubmenu(item, button, nextDepth);
			});
		} else button.addEventListener("click", async (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (session !== menuSession || !rootMenu?.isConnected) return;
			closeUnifiedContextMenu();
			if (item.disabled) return;
			await item.action();
		});
		const li = document.createElement("li");
		li.appendChild(button);
		list.appendChild(li);
	}
	stampContextMenuPanel(menu, compact);
	menu.addEventListener("pointerenter", () => cancelScheduledCloseFromDepth(depth));
	menu.addEventListener("pointerleave", () => {
		if (depth > 0) {
			const existingClose = submenuCloseTimers.get(depth);
			if (existingClose) clearTimeout(existingClose);
			const timer = setTimeout(() => {
				submenuCloseTimers.delete(depth);
				closeSubmenusFromDepth(depth);
			}, SUBMENU_HOVER_CLOSE_MS);
			submenuCloseTimers.set(depth, timer);
		}
	});
	return menu;
};
var closeUnifiedContextMenu = () => {
	clearCleanup();
	clearTimersFromDepth(0);
	rootMenuOverlayUnregister?.();
	rootMenuOverlayUnregister = null;
	rootMenuPlacement?.dispose();
	rootMenuPlacement = null;
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	submenuPlacementByDepth.clear();
	rootMenu?.remove();
	rootMenu = null;
	menuLayer?.remove();
	menuLayer = null;
	menuSession += 1;
};
var openUnifiedContextMenu = (request) => {
	const entries = (request.items || []).filter((item) => item && item.id && item.label);
	if (!entries.length) {
		closeUnifiedContextMenu();
		return;
	}
	ensureStyle();
	closeUnifiedContextMenu();
	const session = menuSession;
	const overlayHost = resolveOverlayHost() ?? document.body;
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	menuLayer = layer;
	overlayHost.appendChild(layer);
	const submenuPlacementStrategy = request.placementStrategy ?? "auto";
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session, submenuPlacementStrategy);
	rootMenu = menu;
	layer.appendChild(menu);
	rootMenuPlacement = placeMenuOverlay(menu, {
		origin: {
			type: "point",
			x: request.x,
			y: request.y
		},
		placement: "bottom-start",
		gap: 0,
		strategy: "js"
	});
	rootMenuOverlayUnregister = registerTransientOverlay({
		id: `context-menu-${session}`,
		kind: "context-menu",
		element: layer,
		isActive: () => menuSession === session && menuLayer === layer && layer.isConnected,
		close: () => {
			closeUnifiedContextMenu();
			return true;
		}
	});
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		const target = event.target;
		if (target && menuLayer.contains(target)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		const parentItem = target.closest?.(".cw-context-menu__item");
		if (!parentItem) {
			closeSubmenusFromDepth(1);
			return;
		}
		if (!(parentItem.getAttribute("aria-haspopup") === "menu")) closeSubmenusFromDepth(1);
	};
	const onEscape = (event) => {
		if (session !== menuSession) return;
		if (event.key === "Escape") closeUnifiedContextMenu();
	};
	const close = () => closeUnifiedContextMenu();
	document.addEventListener("pointerdown", onPointerDown, { capture: true });
	document.addEventListener("contextmenu", onPointerDown, { capture: true });
	document.addEventListener("keydown", onEscape);
	menu.addEventListener("click", onMenuInternalClick, { capture: true });
	window.addEventListener("resize", close, { passive: true });
	window.addEventListener("blur", close, { passive: true });
	cleanupFns.push(() => document.removeEventListener("pointerdown", onPointerDown, { capture: true }));
	cleanupFns.push(() => document.removeEventListener("contextmenu", onPointerDown, { capture: true }));
	cleanupFns.push(() => document.removeEventListener("keydown", onEscape));
	cleanupFns.push(() => menu.removeEventListener("click", onMenuInternalClick, { capture: true }));
	cleanupFns.push(() => window.removeEventListener("resize", close));
	cleanupFns.push(() => window.removeEventListener("blur", close));
};
//#endregion
//#region src/frontend/shells/environment/components/app-menu/bookmarks-menu.ts
/** Local copy — avoid relative `../../explorer/fs-backend` (breaks when this file is hardlinked under home-view). */
function faviconForHref(href, size = 64) {
	const raw = String(href || "").trim();
	if (!raw || !/^https?:\/\//i.test(raw)) return "";
	try {
		const host = new URL(raw).hostname;
		if (!host) return "";
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
	} catch {
		return "";
	}
}
/** Chrome `_favicon`, Google S2, or generic favicon URL — not Android adaptive bitmaps. */
function isBookmarkFaviconResourceUrl(raw) {
	const u = String(raw || "").trim().toLowerCase();
	if (!u) return false;
	if (u.includes("/_favicon/")) return true;
	if (u.includes("s2/favicons")) return true;
	if (u.includes("favicon")) return true;
	if (u.startsWith("android-icon:")) return false;
	return false;
}
/** Accept http(s) and other schemes; bare hosts become `https://…`. */
function normalizeBookmarkHref(raw) {
	const text = String(raw || "").trim();
	if (!text) return "";
	if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return text;
	return `https://${text}`;
}
var RECENT_KEY = "rs-app-menu-bookmark-recent";
var PINNED_KEY = "rs-app-menu-bookmark-pinned";
var MAX_RECENT = 12;
var MAX_PINNED = 16;
var registeredBookmarksApi = null;
function setBookmarksMenuApi(api) {
	registeredBookmarksApi = api;
}
var chromeErr = () => {
	try {
		const err = globalThis.chrome?.runtime?.lastError;
		return err ? new Error(String(err.message || err)) : null;
	} catch {
		return null;
	}
};
var callChrome = (api, method, ...args) => {
	const fn = api[method];
	if (typeof fn !== "function") return Promise.reject(/* @__PURE__ */ new Error(`chrome.bookmarks.${String(method)} missing`));
	try {
		const result = fn.apply(api, args);
		if (result != null && typeof result.then === "function") return result;
	} catch (e) {
		return Promise.reject(e);
	}
	return new Promise((resolve, reject) => {
		try {
			fn.apply(api, [...args, (res) => {
				const err = chromeErr();
				if (err) reject(err);
				else resolve(res);
			}]);
		} catch (e) {
			reject(e);
		}
	});
};
var nodeToEntry = (node) => {
	const url = typeof node.url === "string" && node.url ? node.url : void 0;
	return {
		id: String(node.id),
		title: String(node.title || node.url || node.id || "Bookmark"),
		url,
		folder: !url,
		parentId: node.parentId
	};
};
/** Build BookmarksMenuApi from `chrome.bookmarks` (CRX extension pages). */
function createChromeBookmarksMenuApi(raw) {
	const api = raw || (globalThis.chrome?.bookmarks ?? null);
	if (!api?.getTree || !api?.getChildren) return null;
	const resolveIconUrl = (href, size = 128) => {
		const page = String(href || "").trim();
		if (!/^https?:\/\//i.test(page)) return "";
		const s2 = faviconForHref(page, size);
		if (s2) return s2;
		try {
			const chromeRt = globalThis.chrome?.runtime;
			if (typeof chromeRt?.getURL === "function") {
				const u = new URL(chromeRt.getURL("/_favicon/"));
				u.searchParams.set("pageUrl", page);
				u.searchParams.set("size", String(size));
				return u.toString();
			}
		} catch {}
		return "";
	};
	return {
		resolveIconUrl,
		async listChildren(folderId) {
			if (folderId) return (await callChrome(api, "getChildren", folderId) || []).map(nodeToEntry);
			const roots = await callChrome(api, "getTree") || [];
			const out = [];
			for (const root of roots) for (const child of root.children || []) out.push(nodeToEntry(child));
			return out;
		},
		async search(query) {
			const q = String(query || "").trim();
			if (!q) return this.listChildren();
			if (typeof api.search !== "function") {
				const all = await this.listChildren();
				const lower = q.toLowerCase();
				return all.filter((e) => e.title.toLowerCase().includes(lower) || String(e.url || "").toLowerCase().includes(lower));
			}
			return (await callChrome(api, "search", q) || []).map(nodeToEntry);
		},
		async open(entry) {
			if (entry.folder) return;
			const href = String(entry.url || "").trim();
			if (!href) return;
			try {
				const tabs = globalThis.chrome?.tabs;
				if (typeof tabs?.create === "function") {
					await Promise.resolve(tabs.create({ url: href }));
					return;
				}
			} catch {}
			globalThis.open?.(href, "_blank", "noopener,noreferrer");
		},
		async remove(entry) {
			const id = String(entry?.id || "").trim();
			if (!id) return false;
			try {
				if (entry.folder) {
					if (typeof api.removeTree !== "function") return false;
					await callChrome(api, "removeTree", id);
				} else {
					if (typeof api.remove !== "function") return false;
					await callChrome(api, "remove", id);
				}
				return true;
			} catch {
				return false;
			}
		},
		async update(id, patch) {
			const key = String(id || "").trim();
			if (!key || typeof api.update !== "function") return null;
			const body = {};
			if (patch.title != null) body.title = String(patch.title || "").trim();
			if (patch.url != null) {
				const href = normalizeBookmarkHref(patch.url);
				if (href) body.url = href;
			}
			try {
				const node = await callChrome(api, "update", key, body);
				return node ? nodeToEntry(node) : null;
			} catch {
				return null;
			}
		},
		async create(parentId, spec) {
			if (typeof api.create !== "function") return null;
			const title = String(spec.title || "").trim();
			if (!title) return null;
			const body = {
				parentId: String(parentId || "0"),
				title
			};
			if (spec.url != null) {
				const href = normalizeBookmarkHref(spec.url);
				if (!href) return null;
				body.url = href;
			}
			const attempt = async (pid) => {
				const node = await callChrome(api, "create", {
					...body,
					parentId: pid
				});
				return node ? nodeToEntry(node) : null;
			};
			try {
				return await attempt(body.parentId);
			} catch {
				if (body.parentId === "0") try {
					return await attempt("1");
				} catch {
					return null;
				}
				return null;
			}
		}
	};
}
function resolveBookmarksMenuApi() {
	if (registeredBookmarksApi) return registeredBookmarksApi;
	return createChromeBookmarksMenuApi();
}
function hasBookmarksMenuApi() {
	return Boolean(resolveBookmarksMenuApi());
}
function readRecentBookmarks() {
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((e) => e && e.id && e.title).slice(0, MAX_RECENT);
	} catch {
		return [];
	}
}
function pushRecentBookmark(entry) {
	if (!entry?.id || entry.folder) return;
	const next = [entry, ...readRecentBookmarks().filter((e) => e.id !== entry.id)].slice(0, MAX_RECENT);
	try {
		localStorage.setItem(RECENT_KEY, JSON.stringify(next));
	} catch {}
}
var readBookmarkList = (key, max) => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((e) => e && e.id && e.title && !e.folder).slice(0, max);
	} catch {
		return [];
	}
};
function readPinnedBookmarks() {
	return readBookmarkList(PINNED_KEY, MAX_PINNED);
}
function isBookmarkPinnedToStart(id) {
	return readPinnedBookmarks().some((e) => e.id === id);
}
function pinBookmarkToStart(entry) {
	if (!entry?.id || entry.folder || !String(entry.url || "").trim()) return false;
	const next = [entry, ...readPinnedBookmarks().filter((e) => e.id !== entry.id)].slice(0, MAX_PINNED);
	try {
		localStorage.setItem(PINNED_KEY, JSON.stringify(next));
		return true;
	} catch {
		return false;
	}
}
function unpinBookmarkFromStart(id) {
	const key = String(id || "").trim();
	if (!key) return false;
	const next = readPinnedBookmarks().filter((e) => e.id !== key);
	try {
		localStorage.setItem(PINNED_KEY, JSON.stringify(next));
		return true;
	} catch {
		return false;
	}
}
var writeBookmarkList = (key, items, max) => {
	localStorage.setItem(key, JSON.stringify(items.slice(0, max)));
};
/** Keep Start pin/recent tiles in sync after a chrome.bookmarks update. */
function syncStoredBookmark(entry) {
	const id = String(entry?.id || "").trim();
	if (!id) return;
	const patch = (list) => list.map((item) => item.id === id ? {
		...item,
		title: entry.title || item.title,
		url: entry.url || item.url
	} : item);
	try {
		writeBookmarkList(PINNED_KEY, patch(readPinnedBookmarks()), MAX_PINNED);
		writeBookmarkList(RECENT_KEY, patch(readRecentBookmarks()), MAX_RECENT);
	} catch {}
}
/** Drop a deleted Chrome bookmark from Start pin/recent lists. */
function forgetBookmarkFromLists(id) {
	const key = String(id || "").trim();
	if (!key) return;
	unpinBookmarkFromStart(key);
	try {
		writeBookmarkList(RECENT_KEY, readRecentBookmarks().filter((item) => item.id !== key), MAX_RECENT);
	} catch {}
}
var DESKTOP_FAVICON_SIZE = 256;
/** Bump `_favicon` / S2 query size so desktop tiles are not upscaled from 16–32px assets. */
function bumpBookmarkIconUrlSize(raw, size = DESKTOP_FAVICON_SIZE) {
	const url = String(raw || "").trim();
	if (!url) return "";
	try {
		const parsed = new URL(url, globalThis.location?.href);
		if (parsed.searchParams.has("pageUrl")) {
			parsed.searchParams.set("size", String(size));
			return parsed.toString();
		}
		if (parsed.hostname.endsWith("google.com") && parsed.pathname.includes("favicon")) {
			parsed.searchParams.set("sz", String(size));
			return parsed.toString();
		}
	} catch {}
	return url;
}
/** Best favicon URL for Start / desktop — Google S2 first, then Chrome `_favicon`. */
function resolveBookmarkDesktopIconUrl(entry, api) {
	const href = String(entry.url || "").trim();
	if (!href) return "";
	return faviconForHref(href, DESKTOP_FAVICON_SIZE) || faviconForHref(href, 128) || faviconForHref(href, 64) || api?.resolveIconUrl?.(href, DESKTOP_FAVICON_SIZE) || api?.resolveIconUrl?.(href, 128) || "";
}
/** Place bookmark on Speed Dial — same open-link tile path as Android launcher pins. */
function placeBookmarkOnDesktop(entry, cell, api, iconUrl = "") {
	return pinBookmarkEntry(entry, cell, String(iconUrl || "").trim() || bumpBookmarkIconUrlSize(resolveBookmarkDesktopIconUrl(entry, api), DESKTOP_FAVICON_SIZE));
}
/** JSON drag envelope for Bookmarks AppMenu → SpeedDial. */
function buildBookmarkPinEnvelope(entry, iconUrl = "") {
	const href = String(entry.url || "").trim();
	return JSON.stringify({
		state: {
			icon: entry.folder ? "folder" : "link",
			label: entry.title || href || "Bookmark",
			action: entry.folder ? "open-path" : "open-link"
		},
		desc: {
			action: entry.folder ? "open-path" : "open-link",
			href: entry.folder ? "" : href,
			path: entry.folder ? `/bookmarks/${entry.id}/` : `/bookmarks/${entry.id}`,
			meta: {
				entityType: "bookmark",
				bookmarkId: entry.id,
				...iconUrl ? { iconUrl } : {}
			}
		}
	});
}
function pinBookmarkEntry(entry, cell, iconUrl = "") {
	if (entry.folder || !String(entry.url || "").trim()) return null;
	const targetCell = cell ?? findNextFreeSpeedDialCell();
	const item = parseSpeedDialItemFromJSON(buildBookmarkPinEnvelope(entry, iconUrl), targetCell);
	if (!item) return null;
	addSpeedDialItem(item);
	return item;
}
var appendPhosphorGlyph = (plate, name) => {
	const icon = document.createElement("ui-icon");
	icon.setAttribute("icon", name);
	icon.setAttribute("icon-style", "duotone");
	icon.setAttribute("aria-hidden", "true");
	icon.style.setProperty("--icon-size", "1.75rem");
	icon.style.setProperty("--icon-padding", "0px");
	icon.style.setProperty("--icon-color", "currentColor");
	icon.style.color = "currentColor";
	plate.append(icon);
	customElements.whenDefined("ui-icon").then(() => {
		if (!icon.isConnected) return;
		if (!icon.getAttribute("icon")) icon.setAttribute("icon", name);
		icon.style.setProperty("--icon-size", "1.75rem");
		icon.style.setProperty("--icon-padding", "0px");
	});
};
/**
* Paint bookmark tile icon.
* WHY: list UI uses plain `<img>` (not ui-icon mask). Size probes used to clear the
* plate and reject typical 16–32px favicons (≥48px gate), leaving empty slots.
*/
async function applyBookmarkIconToPlate(plate, entry, api) {
	plate.replaceChildren();
	if (entry.folder) {
		appendPhosphorGlyph(plate, "folder");
		plate.toggleAttribute("data-bookmark-bitmap", false);
		return "";
	}
	const href = String(entry.url || "").trim();
	const candidates = [];
	const s2 = faviconForHref(href, DESKTOP_FAVICON_SIZE);
	if (s2) candidates.push(s2);
	const s2128 = faviconForHref(href, 128);
	if (s2128 && !candidates.includes(s2128)) candidates.push(s2128);
	const s264 = faviconForHref(href, 64);
	if (s264 && !candidates.includes(s264)) candidates.push(s264);
	const fromApi256 = api?.resolveIconUrl?.(href, DESKTOP_FAVICON_SIZE) || "";
	if (fromApi256 && !candidates.includes(fromApi256)) candidates.push(fromApi256);
	const fromApi128 = api?.resolveIconUrl?.(href, 128) || "";
	if (fromApi128 && !candidates.includes(fromApi128)) candidates.push(fromApi128);
	const fromApi64 = api?.resolveIconUrl?.(href, 64) || "";
	if (fromApi64 && !candidates.includes(fromApi64)) candidates.push(fromApi64);
	try {
		const chromeRt = globalThis.chrome?.runtime;
		if (typeof chromeRt?.getURL === "function" && href) {
			const u = new URL(chromeRt.getURL("/_favicon/"));
			u.searchParams.set("pageUrl", href);
			u.searchParams.set("size", String(DESKTOP_FAVICON_SIZE));
			const chromeFav = u.toString();
			if (chromeFav && !candidates.includes(chromeFav)) candidates.push(chromeFav);
		}
	} catch {}
	appendPhosphorGlyph(plate, "link");
	plate.toggleAttribute("data-bookmark-bitmap", false);
	if (!candidates.length) return "";
	return await new Promise((resolve) => {
		let index = 0;
		const tryNext = () => {
			if (index >= candidates.length) {
				resolve("");
				return;
			}
			const url = candidates[index++];
			const img = document.createElement("img");
			img.className = "env-shell-app-menu__tile-favicon";
			img.alt = "";
			img.decoding = "async";
			img.loading = "eager";
			img.referrerPolicy = "no-referrer";
			img.draggable = false;
			img.addEventListener("load", () => {
				plate.replaceChildren(img);
				plate.toggleAttribute("data-bookmark-bitmap", true);
				resolve(url);
			}, { once: true });
			img.addEventListener("error", () => {
				tryNext();
			}, { once: true });
			img.src = url;
		};
		tryNext();
	});
}
//#endregion
//#region src/frontend/shells/environment/components/app-menu/app-actions.ts
var FLAG_CHOICES = [
	"NEW_TASK",
	"CLEAR_TOP",
	"SINGLE_TOP",
	"CLEAR_TASK",
	"NO_HISTORY",
	"REORDER_TO_FRONT",
	"MULTIPLE_TASK"
];
var esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var fmtTime = (ms) => {
	const n = Number(ms);
	if (!Number.isFinite(n) || n <= 0) return "—";
	try {
		return new Date(n).toLocaleString();
	} catch {
		return String(n);
	}
};
var openEditorDialog = (inner) => {
	const modal = document.createElement("dialog");
	modal.className = "speed-dial-editor env-shell-app-menu__chrome-editor";
	modal.innerHTML = inner;
	const close = () => {
		try {
			if (modal.open) modal.close();
		} catch {}
		modal.remove();
	};
	modal.addEventListener("cancel", (ev) => {
		ev.preventDefault();
		close();
	});
	modal.__cwspClose = close;
	document.body.append(modal);
	try {
		modal.showModal();
	} catch {
		modal.setAttribute("open", "");
	}
	return modal;
};
var extrasToText = (extras) => {
	if (!extras || !Object.keys(extras).length) return "";
	try {
		return JSON.stringify(extras, null, 2);
	} catch {
		return "";
	}
};
var parseExtrasText = (raw) => {
	const text = String(raw || "").trim();
	if (!text) return {};
	if (text.startsWith("{")) try {
		return normalizeLauncherLaunchSpec({ extras: JSON.parse(text) }).extras || {};
	} catch {}
	const extras = {};
	for (const line of text.split(/\r?\n/)) {
		const eq = line.indexOf("=");
		if (eq < 1) continue;
		const key = line.slice(0, eq).trim();
		const value = line.slice(eq + 1).trim();
		if (!key) continue;
		if (value === "true" || value === "false") extras[key] = value === "true";
		else if (/^-?\d+(\.\d+)?$/.test(value)) extras[key] = Number(value);
		else extras[key] = value;
	}
	return extras;
};
function openAppInfoDialog(opts) {
	const info = opts.info || {};
	const pkg = String(info.packageName || opts.fallback.packageName || "").trim();
	const label = String(info.label || opts.fallback.label || opts.title || pkg).trim();
	const rows = [
		["Label", label],
		["Package", pkg],
		["Activity", String(info.componentName || opts.fallback.componentName || "—")],
		["Version", `${info.versionName || "—"} (${info.versionCode ?? "—"})`],
		["Installer", String(info.installer || "—")],
		["Enabled", info.enabled === false ? "no" : "yes"],
		["System", info.system ? info.updatedSystem ? "updated system" : "yes" : "no"],
		["Installed", fmtTime(info.firstInstallTime)],
		["Updated", fmtTime(info.lastUpdateTime)]
	];
	const modal = openEditorDialog(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">App info</h2>
                <p class="modal-description">${esc(label)}</p>
            </header>
            <div class="modal-fields">
                ${rows.map(([k, v]) => `
                    <div class="modal-field">
                        <label>${esc(k)}</label>
                        <input type="text" readonly value="${esc(v)}" />
                    </div>`).join("")}
            </div>
            <div class="modal-actions" role="group">
                ${opts.onOpenSystem ? `<button type="button" data-action="system" class="btn secondary">System details</button>` : `<span></span>`}
                <button type="button" data-action="close" class="btn save">Close</button>
            </div>
        </form>
    `);
	const close = modal.__cwspClose;
	modal.querySelector("form")?.addEventListener("click", (ev) => {
		const action = ev.target?.closest?.("[data-action]")?.getAttribute("data-action");
		if (action === "close") {
			ev.preventDefault();
			close?.();
		}
		if (action === "system") {
			ev.preventDefault();
			Promise.resolve(opts.onOpenSystem?.()).finally(() => close?.());
		}
	});
}
function openAppLaunchEditor(opts) {
	const initial = getAppLaunchSpec(opts.packageName);
	const selected = new Set((initial.flags || []).map((f) => f.toUpperCase()));
	const modal = openEditorDialog(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">Edit launch</h2>
                <p class="modal-description">${esc(opts.title)} — action, data URI, extras, flags</p>
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-launch-component">Activity</label>
                    <input id="am-launch-component" name="componentName" type="text" value="${esc(initial.componentName || opts.defaultComponent || "")}" placeholder="pkg/.MainActivity" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-action">Intent action</label>
                    <input id="am-launch-action" name="action" type="text" value="${esc(initial.action || "")}" placeholder="android.intent.action.MAIN" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-data">Data URI</label>
                    <input id="am-launch-data" name="data" type="text" value="${esc(initial.data || "")}" placeholder="https://…  content://…  app scheme" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-mime">MIME</label>
                    <input id="am-launch-mime" name="mimeType" type="text" value="${esc(initial.mimeType || "")}" placeholder="text/plain" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-categories">Categories (comma)</label>
                    <input id="am-launch-categories" name="categories" type="text" value="${esc((initial.categories || []).join(", "))}" placeholder="android.intent.category.LAUNCHER" />
                </div>
                <div class="modal-field">
                    <label>Flags</label>
                    <div>
                        ${FLAG_CHOICES.map((flag) => `
                        <label style="display:flex;gap:0.4rem;align-items:center;margin:0.2rem 0;">
                            <input type="checkbox" name="flag" value="${flag}"${selected.has(flag) ? " checked" : ""} />
                            <span>${flag}</span>
                        </label>`).join("")}
                    </div>
                </div>
                <div class="modal-field">
                    <label for="am-launch-extras">Extras (JSON or key=value)</label>
                    <textarea id="am-launch-extras" name="extras" rows="5" placeholder='{"debug": true}'>${esc(extrasToText(initial.extras))}</textarea>
                </div>
            </div>
            <div class="modal-actions" role="group">
                <button type="button" data-action="reset" class="btn secondary">Reset</button>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">Save</button>
            </div>
        </form>
    `);
	const close = modal.__cwspClose;
	const form = modal.querySelector("form");
	const readSpec = () => {
		const flags = [...modal.querySelectorAll("input[name=\"flag\"]:checked")].map((el) => el.value);
		const categories = String(modal.querySelector("[name=\"categories\"]")?.value || "").split(",").map((c) => c.trim()).filter(Boolean);
		return normalizeLauncherLaunchSpec({
			componentName: modal.querySelector("[name=\"componentName\"]")?.value,
			action: modal.querySelector("[name=\"action\"]")?.value,
			data: modal.querySelector("[name=\"data\"]")?.value,
			mimeType: modal.querySelector("[name=\"mimeType\"]")?.value,
			categories,
			flags,
			extras: parseExtrasText(modal.querySelector("[name=\"extras\"]")?.value || "")
		});
	};
	form?.addEventListener("click", (ev) => {
		const action = ev.target?.closest?.("[data-action]")?.getAttribute("data-action");
		if (action === "cancel") {
			ev.preventDefault();
			close?.();
		}
		if (action === "reset") {
			ev.preventDefault();
			clearAppLaunchSpec(opts.packageName);
			opts.onSave?.({});
			showSuccess("Launch reset to default");
			close?.();
		}
	});
	form?.addEventListener("submit", (ev) => {
		ev.preventDefault();
		const spec = readSpec();
		setAppLaunchSpec(opts.packageName, spec);
		opts.onSave?.(spec);
		showSuccess(isLauncherLaunchSpecEmpty(spec) ? "Launch reset to default" : "Launch saved");
		close?.();
	});
}
function confirmUninstall(label, verb = "Uninstall") {
	return globalThis.confirm?.(`${verb} “${label}”?`) === true;
}
function refreshWhenVisible(onRefresh) {
	const tick = () => {
		if (document.visibilityState !== "visible") return;
		document.removeEventListener("visibilitychange", tick);
		onRefresh();
	};
	document.addEventListener("visibilitychange", tick);
	globalThis.setTimeout?.(onRefresh, 1600);
}
function openBookmarkInfoDialog(entry) {
	const rows = [
		["Title", entry.title || "—"],
		["URL", entry.url || "—"],
		["Id", entry.id],
		["Type", entry.folder ? "Folder" : "Bookmark"]
	];
	const modal = openEditorDialog(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">${entry.folder ? "Folder info" : "Bookmark info"}</h2>
                <p class="modal-description">${esc(entry.title)}</p>
            </header>
            <div class="modal-fields">
                ${rows.map(([k, v]) => `
                    <div class="modal-field">
                        <label>${esc(k)}</label>
                        <input type="text" readonly value="${esc(v)}" />
                    </div>`).join("")}
            </div>
            <div class="modal-actions" role="group">
                <span></span>
                <button type="button" data-action="close" class="btn save">Close</button>
            </div>
        </form>
    `);
	const close = modal.__cwspClose;
	modal.querySelector("form")?.addEventListener("click", (ev) => {
		if (ev.target?.closest?.("[data-action]")?.getAttribute("data-action") === "close") {
			ev.preventDefault();
			close?.();
		}
	});
}
function openBookmarkFieldsDialog(opts) {
	const showUrl = opts.showUrl !== false;
	return new Promise((resolve) => {
		let settled = false;
		const modal = openEditorDialog(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">${esc(opts.heading)}</h2>
                ${opts.description ? `<p class="modal-description">${esc(opts.description)}</p>` : ""}
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-bm-title">Title</label>
                    <input id="am-bm-title" name="title" type="text" value="${esc(opts.initialTitle || "")}" />
                </div>
                ${showUrl ? `<div class="modal-field">
                    <label for="am-bm-url">URL</label>
                    <input id="am-bm-url" name="url" type="url" value="${esc(opts.initialUrl || "")}" placeholder="https://" />
                </div>` : ""}
            </div>
            <div class="modal-actions" role="group">
                <span></span>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">${esc(opts.submitLabel || "Save")}</button>
            </div>
        </form>
    `);
		const close = modal.__cwspClose;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			close?.();
			resolve(value);
		};
		const form = modal.querySelector("form");
		form?.addEventListener("click", (ev) => {
			if (ev.target?.closest?.("[data-action]")?.getAttribute("data-action") === "cancel") {
				ev.preventDefault();
				finish(null);
			}
		});
		modal.addEventListener("cancel", () => finish(null));
		form?.addEventListener("submit", (ev) => {
			ev.preventDefault();
			const title = String(modal.querySelector("[name=\"title\"]")?.value || "").trim();
			if (!title) {
				showError("Title is required");
				return;
			}
			if (!showUrl) {
				finish({ title });
				return;
			}
			const href = normalizeBookmarkHref(modal.querySelector("[name=\"url\"]")?.value || "");
			if (!href) {
				showError("URL is required");
				return;
			}
			finish({
				title,
				url: href
			});
		});
	});
}
function openBookmarkLaunchEditor(opts) {
	const entry = opts.entry;
	(async () => {
		const fields = await openBookmarkFieldsDialog({
			heading: entry.folder ? "Rename folder" : "Edit bookmark",
			description: entry.folder ? entry.title : `${entry.title} — Chrome bookmark`,
			initialTitle: entry.title,
			initialUrl: entry.url || "",
			showUrl: !entry.folder,
			submitLabel: "Save"
		});
		if (!fields) return;
		if (!opts.api.update) {
			showError("Bookmark edit unavailable");
			return;
		}
		const next = await opts.api.update(entry.id, entry.folder ? { title: fields.title } : {
			title: fields.title,
			url: fields.url
		});
		if (!next) {
			showError(entry.folder ? "Could not rename folder" : "Could not update bookmark");
			return;
		}
		syncStoredBookmark(next);
		showSuccess(entry.folder ? "Folder renamed" : "Bookmark updated");
		opts.onSaved?.(next);
	})();
}
//#endregion
//#region src/frontend/shells/environment/components/app-menu/tile-chrome.ts
var STORAGE_KEY = "cwsp-app-menu-tile-chrome-v1";
var cache = null;
function readAll() {
	if (cache) return cache;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			cache = {};
			return cache;
		}
		const parsed = JSON.parse(raw);
		cache = parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		cache = {};
	}
	return cache;
}
function writeAll(map) {
	cache = map;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
	} catch {}
}
function appMenuChromeKeyForPackage(packageName) {
	return `app:${String(packageName || "").trim()}`;
}
function appMenuChromeKeyForBookmark(id) {
	return `bm:${String(id || "").trim()}`;
}
function getAppMenuTileChrome(key) {
	const k = String(key || "").trim();
	if (!k) return {};
	return { ...readAll()[k] || {} };
}
function setAppMenuTileChrome(key, patch) {
	const k = String(key || "").trim();
	if (!k) return {};
	const all = { ...readAll() };
	const next = {
		...all[k] || {},
		...patch
	};
	if (next.shape) next.shape = normalizeTileShape(next.shape, "circle");
	if (next.iconDisplay) next.iconDisplay = normalizeIconDisplay(next.iconDisplay) || "colored";
	if (next.iconScale != null) next.iconScale = normalizeItemIconBitmapScale(next.iconScale);
	all[k] = next;
	writeAll(all);
	return next;
}
function clearAppMenuTileChrome(key) {
	const k = String(key || "").trim();
	if (!k) return;
	const all = { ...readAll() };
	delete all[k];
	writeAll(all);
}
/** Compact dialog to tweak App Menu tile shape + icon display. */
function openAppMenuTileChromeEditor(opts) {
	const initial = {
		...opts.defaults || {},
		...opts.initial || {},
		...getAppMenuTileChrome(opts.key)
	};
	const storedUrl = String(initial.iconUrl || "").trim();
	const safeUrl = storedUrl.startsWith("blob:") ? "" : storedUrl;
	const modal = document.createElement("dialog");
	modal.className = "speed-dial-editor env-shell-app-menu__chrome-editor";
	modal.innerHTML = `
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">Icon design</h2>
                <p class="modal-description">${String(opts.title || "").replace(/[<>&]/g, "")}</p>
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-chrome-shape">Shape</label>
                    <select id="am-chrome-shape" name="shape">
                        ${TILE_SHAPE_OPTIONS.map((o) => `<option value="${o.value}"${normalizeTileShape(initial.shape, "circle") === o.value ? " selected" : ""}>${o.label}</option>`).join("")}
                    </select>
                </div>
                <div class="modal-field">
                    <label for="am-chrome-display">Icon display</label>
                    <select id="am-chrome-display" name="iconDisplay">
                        ${ICON_DISPLAY_OPTIONS.map((o) => `<option value="${o.value}"${(normalizeIconDisplay(initial.iconDisplay) || "colored") === o.value ? " selected" : ""}>${o.label}</option>`).join("")}
                    </select>
                </div>
                <div class="modal-field">
                    <label for="am-chrome-icon-scale">Icon scale (inside plate)</label>
                    <select id="am-chrome-icon-scale" name="iconScale">
                        ${ICON_BITMAP_SCALE_OPTIONS.map((o) => `<option value="${o.value}"${normalizeItemIconBitmapScale(initial.iconScale) === o.value ? " selected" : ""}>${o.label}</option>`).join("")}
                    </select>
                </div>
                <div class="modal-field" data-field="glyph">
                    <label for="am-chrome-icon">Icon (Phosphor)</label>
                    <input id="am-chrome-icon" name="icon" type="text" value="${String(initial.icon || "").replace(/"/g, "&quot;")}" placeholder="device-mobile" />
                </div>
                <div class="modal-field" data-field="url">
                    <label for="am-chrome-url">Icon resource</label>
                    <div class="sd-icon-resource-row">
                        <input id="am-chrome-url" name="iconUrl" type="text" value="${safeUrl.replace(/"/g, "&quot;")}" placeholder="URL / data: / android-icon:…" />
                        <button type="button" class="btn secondary sd-icon-resource-pick" data-action="pick-icon" title="Pick alternative icon" aria-label="Pick alternative icon">
                            <ui-icon icon="squares-four" icon-style="duotone" aria-hidden="true"></ui-icon>
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-actions" role="group" aria-label="Icon design actions">
                <button type="button" data-action="reset" class="btn secondary">Reset</button>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">Save</button>
            </div>
        </form>
    `;
	const form = modal.querySelector("form");
	const actions = form?.querySelector(".modal-actions");
	if (actions) {
		actions.style.setProperty("display", "grid", "important");
		actions.style.setProperty("grid-template-columns", "1fr auto auto", "important");
		actions.style.setProperty("align-items", "center", "important");
		actions.style.setProperty("gap", "0.45rem", "important");
	}
	const shapeSelect = modal.querySelector("select[name=\"shape\"]");
	const displaySelect = modal.querySelector("select[name=\"iconDisplay\"]");
	const iconScaleSelect = modal.querySelector("select[name=\"iconScale\"]");
	const iconInput = modal.querySelector("input[name=\"icon\"]");
	const urlInput = modal.querySelector("input[name=\"iconUrl\"]");
	const glyphField = modal.querySelector("[data-field=\"glyph\"]");
	const urlField = modal.querySelector("[data-field=\"url\"]");
	const pkg = String(opts.packageName || "").trim() || (opts.key.startsWith("app:") ? opts.key.slice(4) : "");
	const pageUrl = String(opts.pageUrl || "").trim();
	if (urlField && urlInput) attachIconResourcePickButton(urlField, urlInput, {
		packageName: pkg,
		pageUrl
	});
	const sync = () => {
		const d = normalizeIconDisplay(displaySelect?.value) || "colored";
		if (glyphField) {
			if (d === "glyph") glyphField.removeAttribute("hidden");
			else glyphField.setAttribute("hidden", "");
		}
		if (urlField) {
			if (d === "glyph") urlField.setAttribute("hidden", "");
			else urlField.removeAttribute("hidden");
		}
	};
	displaySelect?.addEventListener("change", sync);
	sync();
	const close = () => {
		try {
			if (modal.open) modal.close();
		} catch {}
		modal.remove();
	};
	form?.addEventListener("click", (ev) => {
		const action = ev.target?.closest?.("[data-action]")?.getAttribute("data-action");
		if (action === "cancel") {
			ev.preventDefault();
			close();
		}
		if (action === "reset") {
			ev.preventDefault();
			clearAppMenuTileChrome(opts.key);
			opts.onSave({});
			close();
		}
	});
	form?.addEventListener("submit", (ev) => {
		ev.preventDefault();
		const rawUrl = String(urlInput?.value || "").trim();
		const chrome = {
			shape: normalizeTileShape(shapeSelect?.value, "circle"),
			iconDisplay: normalizeIconDisplay(displaySelect?.value) || "colored",
			iconScale: normalizeItemIconBitmapScale(iconScaleSelect?.value),
			icon: String(iconInput?.value || "").trim(),
			iconUrl: rawUrl.startsWith("blob:") ? "" : rawUrl
		};
		setAppMenuTileChrome(opts.key, chrome);
		opts.onSave(chrome);
		close();
	});
	modal.addEventListener("cancel", (ev) => {
		ev.preventDefault();
		close();
	});
	document.body.append(modal);
	try {
		modal.showModal();
	} catch {
		modal.setAttribute("open", "");
	}
}
//#endregion
//#region src/frontend/shells/environment/components/app-menu/AppMenu.ts
/**
* WHY: `.env-shell-app-menu` slide-over host for launcher SKU.
* Avoids a static import of subsystem `launcher-bridge` (fl.ui ↔ subsystem cycle) — hosts
* resolve `com/routing/native/launcher-bridge` at runtime, or register via {@link setLauncherBridgeForAppMenu}.
*/
var styled$1 = preloadStyle$1(app_menu_default);
var documentStylesApplied = false;
var LONG_PRESS_MS = 420;
var PRE_DRAG_MOVE_PX = 10;
var registeredLauncherBridge = null;
/** Matches {@code BootLoader} + launcher design spec. */
function isLauncherSku() {
	return document.documentElement.dataset.cwspShellRole === "launcher" || globalThis.__RS_SHELL_ROLE__ === "launcher";
}
/** App Menu mounts for Android launcher SKU or CRX bookmarks Start. */
function isAppMenuEnabled() {
	return isLauncherSku() || hasBookmarksMenuApi();
}
function resolveAppMenuMode() {
	if (isLauncherSku()) return "launcher";
	if (hasBookmarksMenuApi()) return "bookmarks";
	return null;
}
async function resolveLauncherBridge() {
	if (registeredLauncherBridge) return registeredLauncherBridge;
	try {
		return await import("../chunks/launcher-bridge.js").then((n) => n.t);
	} catch {
		return null;
	}
}
function ensureDocumentStyles() {
	if (documentStylesApplied) return;
	documentStylesApplied = true;
	try {
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, styled$1];
	} catch {}
}
function resolveAppMenuHost() {
	return document.querySelector(".env-shell-root") || document.querySelector("env-shell-container") || document.querySelector(".env-shell-chrome")?.parentElement || document.body;
}
function createDragGhost(iconPlate, label) {
	const ghost = document.createElement("div");
	ghost.className = "env-shell-app-menu__drag-ghost";
	ghost.setAttribute("aria-hidden", "true");
	const ghostIcon = iconPlate.cloneNode(true);
	ghostIcon.className = "env-shell-app-menu__drag-ghost-icon ui-ws-item-icon shaped";
	ghostIcon.setAttribute("data-shape", normalizeTileShape(iconPlate.getAttribute("data-shape"), "circle"));
	const ghostLabel = document.createElement("span");
	ghostLabel.className = "env-shell-app-menu__drag-ghost-label";
	ghostLabel.textContent = label;
	ghost.append(ghostIcon, ghostLabel);
	return ghost;
}
var APP_MENU_DEFAULT_SHAPE = "circle";
function paintAppMenuIconPlate(iconPlate, opts) {
	const shape = normalizeTileShape(opts.chrome.shape, APP_MENU_DEFAULT_SHAPE);
	iconPlate.setAttribute("data-shape", shape);
	iconPlate.classList.add("ui-ws-item-icon", "shaped");
	const resourceRaw = String(opts.chrome.iconUrl || "").trim() || String(opts.resourceUrl || "").trim();
	const fetchSize = tileIconFetchSize(opts.chrome.iconScale);
	const cachedAndroid = isAndroidIconRef(resourceRaw) ? getCachedIconResourceObjectUrl(resourceRaw, fetchSize) : "";
	const resource = String(cachedAndroid || (isAndroidIconRef(resourceRaw) ? "" : resourceRaw) || "").trim();
	const display = normalizeIconDisplay(opts.chrome.iconDisplay) || inferIconDisplay({
		iconDisplay: opts.chrome.iconDisplay,
		iconUrl: resource || resourceRaw,
		isLauncherApp: Boolean(opts.launcher),
		isBookmarkFavicon: Boolean(resource || resourceRaw) && !opts.launcher
	});
	iconPlate.setAttribute("data-icon-display", display);
	applyItemIconScaleToElement(iconPlate, defaultIconScaleForDisplay(display, opts.chrome.iconScale));
	iconPlate.replaceChildren();
	const finishPaint = () => {
		applyIconScaleToPaintedNodes(iconPlate);
		syncShapelessIconShadow(iconPlate);
	};
	if (display === "glyph") {
		const glyph = String(opts.chrome.icon || opts.fallbackGlyph || "device-mobile").trim() || "device-mobile";
		const icon = document.createElement("ui-icon");
		icon.setAttribute("icon", glyph);
		icon.setAttribute("icon-style", "duotone");
		icon.setAttribute("aria-hidden", "true");
		iconPlate.append(icon);
		finishPaint();
		return;
	}
	if (display === "colored") {
		const img = document.createElement("img");
		img.className = opts.launcher ? "ui-ws-item-icon-img" : "ui-ws-item-icon-img env-shell-app-menu__tile-favicon";
		img.alt = "";
		img.decoding = "async";
		img.draggable = false;
		img.referrerPolicy = "no-referrer";
		if (!opts.launcher && (isBookmarkFaviconResourceUrl(resource) || isBookmarkFaviconResourceUrl(resourceRaw))) img.toggleAttribute("data-bookmark-favicon", true);
		else if (opts.launcher) img.toggleAttribute("data-launcher-icon", true);
		if (resource) img.src = resource;
		else img.toggleAttribute("data-icon-pending", true);
		iconPlate.append(img);
		finishPaint();
		if (isAndroidIconRef(resourceRaw)) resolveIconResourceUrl(resourceRaw, fetchSize).then((url) => {
			if (!url || !img.isConnected) return;
			img.src = url;
			img.removeAttribute("data-icon-pending");
			finishPaint();
		});
		return;
	}
	const host = createTileUiIconElement({
		display,
		glyph: String(opts.chrome.icon || opts.fallbackGlyph || "device-mobile"),
		resourceUrl: resource || void 0,
		launcher: opts.launcher,
		className: "ui-ws-item-icon-native"
	});
	iconPlate.append(host);
	finishPaint();
	if (opts.launcher && resource && display !== "glyph") {
		applyLauncherIconToUiIcon(host, resource, display);
		finishPaint();
	}
	if (isAndroidIconRef(resourceRaw)) resolveIconResourceUrl(resourceRaw, fetchSize).then((url) => {
		if (!url || !host.isConnected) return;
		applyLauncherIconToUiIcon(host, url, display);
		finishPaint();
	});
}
function bindLauncherAppTileDrag(tile, app, iconPlate, hooks) {
	const envelope = () => buildLauncherAppDragEnvelope(app);
	const coarse = typeof window !== "undefined" && (window.matchMedia?.("(pointer: coarse)")?.matches || "ontouchstart" in window);
	tile.draggable = !coarse;
	if (!coarse) {
		tile.addEventListener("dragstart", (ev) => {
			const json = envelope();
			ev.dataTransfer?.setData("text/plain", json);
			ev.dataTransfer?.setData("application/json", json);
			if (ev.dataTransfer) {
				ev.dataTransfer.effectAllowed = "copy";
				try {
					ev.dataTransfer.setDragImage(iconPlate, 24, 24);
				} catch {}
			}
			document.documentElement.toggleAttribute("data-app-menu-dragging", true);
		});
		tile.addEventListener("dragend", () => {
			document.documentElement.toggleAttribute("data-app-menu-dragging", false);
		});
	}
	let pressTimer;
	let pointerId = null;
	let startX = 0;
	let startY = 0;
	let dragArmed = false;
	let dragging = false;
	let suppressClick = false;
	let ghost = null;
	const clearPressTimer = () => {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = void 0;
		}
	};
	const cancelPointerDrag = () => {
		clearPressTimer();
		dragArmed = false;
		if (!dragging) return;
		dragging = false;
		tile.classList.remove("env-shell-app-menu__tile--dragging");
		document.documentElement.toggleAttribute("data-app-menu-dragging", false);
		ghost?.remove();
		ghost = null;
		if (pointerId != null) {
			try {
				tile.releasePointerCapture(pointerId);
			} catch {}
			pointerId = null;
		}
	};
	const beginPointerDrag = (clientX, clientY, id) => {
		if (dragging) return;
		dragArmed = false;
		dragging = true;
		suppressClick = true;
		tile.classList.add("env-shell-app-menu__tile--dragging");
		document.documentElement.toggleAttribute("data-app-menu-dragging", true);
		ghost = createDragGhost(iconPlate, app.label);
		document.body.appendChild(ghost);
		ghost.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
		try {
			tile.setPointerCapture(id);
		} catch {}
	};
	const moveGhost = (clientX, clientY) => {
		if (!ghost) return;
		ghost.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
	};
	const finishPointerDrag = (clientX, clientY) => {
		if (!isClientPointOverSpeedDial(clientX, clientY)) return;
		const cell = resolveSpeedDialCellFromClientPoint(clientX, clientY);
		if (pinLauncherAppEntry(app, cell ?? void 0)) {
			showSuccess(`Pinned ${app.label} to desktop`);
			hooks.onPinned?.();
		}
	};
	const endPointerDrag = (ev) => {
		if (!dragging) return;
		dragging = false;
		dragArmed = false;
		tile.classList.remove("env-shell-app-menu__tile--dragging");
		document.documentElement.toggleAttribute("data-app-menu-dragging", false);
		ghost?.remove();
		ghost = null;
		if (pointerId != null) {
			try {
				tile.releasePointerCapture(pointerId);
			} catch {}
			pointerId = null;
		}
		finishPointerDrag(ev.clientX, ev.clientY);
	};
	tile.addEventListener("pointerdown", (ev) => {
		if (ev.button !== 0) return;
		clearPressTimer();
		pointerId = ev.pointerId;
		startX = ev.clientX;
		startY = ev.clientY;
		suppressClick = false;
		dragging = false;
		dragArmed = false;
		pressTimer = setTimeout(() => {
			pressTimer = void 0;
			dragArmed = true;
			suppressClick = true;
		}, LONG_PRESS_MS);
	}, { passive: true });
	tile.addEventListener("pointermove", (ev) => {
		if (pressTimer && !dragging && !dragArmed) {
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			if (Math.hypot(dx, dy) > PRE_DRAG_MOVE_PX) clearPressTimer();
			return;
		}
		if (dragArmed && !dragging) {
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			if (Math.hypot(dx, dy) > PRE_DRAG_MOVE_PX) beginPointerDrag(ev.clientX, ev.clientY, ev.pointerId);
			return;
		}
		if (dragging) {
			moveGhost(ev.clientX, ev.clientY);
			ev.preventDefault();
		}
	}, { passive: false });
	tile.addEventListener("pointerup", (ev) => {
		clearPressTimer();
		dragArmed = false;
		if (dragging) {
			endPointerDrag(ev);
			return;
		}
	});
	tile.addEventListener("pointercancel", (ev) => {
		clearPressTimer();
		dragArmed = false;
		if (dragging) endPointerDrag(ev);
	});
	tile.addEventListener("contextmenu", () => {
		cancelPointerDrag();
	}, true);
	tile.addEventListener("click", (ev) => {
		if (suppressClick) {
			ev.preventDefault();
			ev.stopPropagation();
			suppressClick = false;
		}
	}, true);
}
async function launchListedApp(bridge, app) {
	const spec = resolveAppLaunchSpec(app.packageName);
	const component = spec.componentName || app.componentName;
	if (!await bridge.launcherLaunch(app.packageName, component, isLauncherLaunchSpecEmpty(spec) ? void 0 : spec)) showError(`Unable to open “${app.label}”`);
}
function renderAppTile(app, bridge, gen, refreshGen, hooks) {
	const tile = document.createElement("button");
	tile.type = "button";
	tile.className = "env-shell-app-menu__tile";
	tile.setAttribute("data-package", app.packageName);
	tile.title = `${app.label} — right-click: info / uninstall / launch; hold and drag`;
	const chromeKey = appMenuChromeKeyForPackage(app.packageName);
	const iconPlate = document.createElement("span");
	iconPlate.className = "env-shell-app-menu__tile-icon ui-ws-item-icon shaped";
	const label = document.createElement("span");
	label.className = "env-shell-app-menu__tile-label";
	label.textContent = app.label;
	tile.append(iconPlate, label);
	const cacheKey = app.iconCacheKey || app.packageName;
	const paint = (resourceUrl = "") => {
		paintAppMenuIconPlate(iconPlate, {
			chrome: getAppMenuTileChrome(chromeKey),
			fallbackGlyph: "device-mobile",
			resourceUrl,
			launcher: true
		});
	};
	const fetchSize = tileIconFetchSize(getAppMenuTileChrome(chromeKey).iconScale);
	paint(getCachedLauncherIconObjectUrl(cacheKey, fetchSize));
	ensureLauncherIconObjectUrl(cacheKey, fetchSize).then((objectUrl) => {
		if (gen !== refreshGen()) return;
		if (!objectUrl) return;
		paint(objectUrl);
	}).catch(() => {});
	bindLauncherAppTileDrag(tile, app, iconPlate, hooks);
	tile.addEventListener("contextmenu", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		openUnifiedContextMenu$1({
			x: ev.clientX,
			y: ev.clientY,
			compact: true,
			items: [
				{
					id: "place-desktop",
					label: "Place on desktop",
					icon: "desktop",
					action: () => {
						if (pinLauncherAppEntry(app)) {
							showSuccess(`Placed “${app.label}” on desktop`);
							hooks.onPinned?.();
						}
					}
				},
				{
					id: "icon-design",
					label: "Icon design…",
					icon: "palette",
					action: () => {
						openAppMenuTileChromeEditor({
							title: app.label,
							key: chromeKey,
							packageName: app.packageName,
							defaults: {
								shape: APP_MENU_DEFAULT_SHAPE,
								iconDisplay: "colored"
							},
							onSave: (chrome) => {
								const merged = {
									...getAppMenuTileChrome(chromeKey),
									...chrome
								};
								const size = tileIconFetchSize(merged.iconScale);
								const paintChrome = (resourceUrl = "") => {
									paintAppMenuIconPlate(iconPlate, {
										chrome: merged,
										fallbackGlyph: "device-mobile",
										resourceUrl,
										launcher: true
									});
								};
								paintChrome(getCachedLauncherIconObjectUrl(cacheKey, size) || (isAndroidIconRef(String(merged.iconUrl || "")) ? "" : String(merged.iconUrl || "").trim()));
								if (isAndroidIconRef(String(merged.iconUrl || ""))) resolveIconResourceUrl(merged.iconUrl, size).then((url) => {
									if (url) paintChrome(url);
								});
								else ensureLauncherIconObjectUrl(cacheKey, size).then((url) => {
									if (url) paintChrome(url);
								});
							}
						});
					}
				},
				{
					id: "launch",
					label: "Open",
					icon: "arrow-square-out",
					action: async () => {
						try {
							await launchListedApp(bridge, app);
						} catch {}
					}
				},
				{
					id: "app-info",
					label: "App info",
					icon: "info",
					action: async () => {
						let info = null;
						try {
							info = await bridge.launcherAppInfo?.(app.packageName) || null;
						} catch {
							info = null;
						}
						openAppInfoDialog({
							title: app.label,
							fallback: {
								packageName: app.packageName,
								componentName: app.componentName,
								label: app.label
							},
							info,
							onOpenSystem: bridge.launcherOpenAppInfo ? () => bridge.launcherOpenAppInfo(app.packageName) : void 0
						});
					}
				},
				...bridge.launcherOpenAppInfo ? [{
					id: "android-settings",
					label: "Android settings",
					icon: "gear",
					action: async () => {
						try {
							if (!await bridge.launcherOpenAppInfo(app.packageName)) showError(`Cannot open Android settings for “${app.label}”`);
						} catch {
							showError(`Cannot open Android settings for “${app.label}”`);
						}
					}
				}] : [],
				{
					id: "edit-launch",
					label: "Edit launch…",
					icon: "sliders",
					action: () => {
						openAppLaunchEditor({
							title: app.label,
							packageName: app.packageName,
							defaultComponent: app.componentName
						});
					}
				},
				...bridge.launcherUninstall ? [{
					id: "uninstall",
					label: "Uninstall",
					icon: "trash",
					danger: true,
					action: async () => {
						if (!confirmUninstall(app.label, "Uninstall")) return;
						try {
							if (!await bridge.launcherUninstall(app.packageName)) {
								showError(`Cannot uninstall “${app.label}”`);
								return;
							}
							showSuccess(`Uninstall started for “${app.label}”`);
							refreshWhenVisible(() => hooks.onAppsChanged?.());
						} catch {
							showError(`Cannot uninstall “${app.label}”`);
						}
					}
				}] : []
			]
		});
	});
	tile.addEventListener("click", async (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		try {
			await launchListedApp(bridge, app);
		} catch {}
	});
	return tile;
}
function bindBookmarkTileDrag(tile, entry, iconPlate, iconUrl, hooks) {
	if (entry.folder || !String(entry.url || "").trim()) return;
	let pressTimer;
	let dragArmed = false;
	let dragging = false;
	let startX = 0;
	let startY = 0;
	let pointerId = -1;
	let ghost = null;
	const clearPress = () => {
		if (pressTimer != null) {
			clearTimeout(pressTimer);
			pressTimer = void 0;
		}
	};
	const cancelDrag = () => {
		clearPress();
		dragArmed = false;
		if (!dragging) return;
		dragging = false;
		tile.classList.remove("env-shell-app-menu__tile--dragging");
		document.documentElement.toggleAttribute("data-app-menu-dragging", false);
		ghost?.remove();
		ghost = null;
		try {
			tile.releasePointerCapture?.(pointerId);
		} catch {}
	};
	const beginDrag = (clientX, clientY) => {
		if (dragging) return;
		dragArmed = false;
		dragging = true;
		tile.classList.add("env-shell-app-menu__tile--dragging");
		document.documentElement.toggleAttribute("data-app-menu-dragging", true);
		ghost = createDragGhost(iconPlate, entry.title);
		document.body.appendChild(ghost);
		ghost.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
		try {
			tile.setPointerCapture?.(pointerId);
		} catch {}
	};
	const endDrag = (clientX, clientY) => {
		clearPress();
		dragArmed = false;
		if (!dragging) return;
		dragging = false;
		tile.classList.remove("env-shell-app-menu__tile--dragging");
		document.documentElement.toggleAttribute("data-app-menu-dragging", false);
		ghost?.remove();
		ghost = null;
		try {
			tile.releasePointerCapture?.(pointerId);
		} catch {}
		if (isClientPointOverSpeedDial(clientX, clientY)) {
			const cell = resolveSpeedDialCellFromClientPoint(clientX, clientY) ?? void 0;
			const paint = String(iconUrl.current || "").trim() || resolveBookmarkDesktopIconUrl(entry, resolveBookmarksMenuApi());
			if (placeBookmarkOnDesktop(entry, cell, resolveBookmarksMenuApi(), paint)) {
				showSuccess(`Placed “${entry.title}” on desktop`);
				hooks.onPinned?.();
			}
		}
	};
	tile.addEventListener("pointerdown", (ev) => {
		if (ev.button != null && ev.button !== 0) return;
		startX = ev.clientX;
		startY = ev.clientY;
		pointerId = ev.pointerId;
		dragging = false;
		dragArmed = false;
		clearPress();
		pressTimer = setTimeout(() => {
			pressTimer = void 0;
			dragArmed = true;
		}, LONG_PRESS_MS);
	});
	tile.addEventListener("pointermove", (ev) => {
		if (!dragging && !dragArmed) {
			if (pressTimer == null) return;
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			if (dx * dx + dy * dy > 100) clearPress();
			return;
		}
		if (dragArmed && !dragging) {
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			if (dx * dx + dy * dy > 100) beginDrag(ev.clientX, ev.clientY);
			return;
		}
		if (ghost) {
			ghost.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px) translate(-50%, -50%)`;
			ev.preventDefault();
		}
	}, { passive: false });
	tile.addEventListener("pointerup", (ev) => endDrag(ev.clientX, ev.clientY));
	tile.addEventListener("pointercancel", (ev) => endDrag(ev.clientX, ev.clientY));
	tile.addEventListener("contextmenu", () => cancelDrag(), true);
}
function bindBookmarkTileContextMenu(tile, entry, api, iconUrl, hooks) {
	tile.addEventListener("contextmenu", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		if (entry.folder) {
			openUnifiedContextMenu$1({
				x: ev.clientX,
				y: ev.clientY,
				compact: true,
				items: [
					{
						id: "open-folder",
						label: "Open folder",
						icon: "folder-open",
						action: () => {
							tile.click();
						}
					},
					{
						id: "bm-info",
						label: "Info",
						icon: "info",
						action: () => {
							openBookmarkInfoDialog(entry);
						}
					},
					...api.update ? [{
						id: "bm-edit",
						label: "Rename folder…",
						icon: "pencil",
						action: () => {
							openBookmarkLaunchEditor({
								entry,
								api,
								onSaved: () => hooks.onAppsChanged?.()
							});
						}
					}] : [],
					...api.remove ? [{
						id: "bm-delete",
						label: "Delete folder",
						icon: "trash",
						danger: true,
						action: async () => {
							if (!confirmUninstall(entry.title, "Delete")) return;
							try {
								if (!await api.remove(entry)) {
									showError(`Could not delete “${entry.title}”`);
									return;
								}
								showSuccess(`Deleted “${entry.title}”`);
								forgetBookmarkFromLists(entry.id);
								hooks.onAppsChanged?.();
							} catch {
								showError(`Could not delete “${entry.title}”`);
							}
						}
					}] : []
				]
			});
			return;
		}
		const pinned = isBookmarkPinnedToStart(entry.id);
		openUnifiedContextMenu$1({
			x: ev.clientX,
			y: ev.clientY,
			compact: true,
			items: [
				{
					id: "place-desktop",
					label: "Place on desktop",
					icon: "desktop",
					action: () => {
						if (placeBookmarkOnDesktop(entry, void 0, api, String(iconUrl.current || "").trim() || resolveBookmarkDesktopIconUrl(entry, api))) {
							showSuccess(`Placed “${entry.title}” on desktop`);
							hooks.onPinned?.();
						}
					}
				},
				{
					id: "icon-design",
					label: "Icon design…",
					icon: "palette",
					action: () => {
						const key = appMenuChromeKeyForBookmark(entry.id);
						openAppMenuTileChromeEditor({
							title: entry.title,
							key,
							pageUrl: String(entry.url || "").trim(),
							defaults: {
								shape: APP_MENU_DEFAULT_SHAPE,
								iconDisplay: "colored"
							},
							onSave: (chrome) => {
								const plate = tile.querySelector(".env-shell-app-menu__tile-icon");
								if (!plate) return;
								const merged = {
									...getAppMenuTileChrome(key),
									...chrome
								};
								const resource = String(merged.iconUrl || "").trim() || String(iconUrl.current || "").trim() || resolveBookmarkDesktopIconUrl(entry, api);
								paintAppMenuIconPlate(plate, {
									chrome: merged,
									fallbackGlyph: entry.folder ? "folder" : "link",
									resourceUrl: resource
								});
								if (resource) iconUrl.current = resource;
							}
						});
					}
				},
				pinned ? {
					id: "unpin-start",
					label: "Unpin from Start",
					icon: "push-pin-slash",
					action: () => {
						if (unpinBookmarkFromStart(entry.id)) {
							showSuccess(`Unpinned “${entry.title}”`);
							hooks.onStartPinsChanged?.();
						}
					}
				} : {
					id: "pin-start",
					label: "Pin to Start",
					icon: "push-pin",
					action: () => {
						if (pinBookmarkToStart(entry)) {
							showSuccess(`Pinned “${entry.title}” to Start`);
							hooks.onStartPinsChanged?.();
						}
					}
				},
				{
					id: "open",
					label: "Open",
					icon: "arrow-square-out",
					action: async () => {
						pushRecentBookmark(entry);
						try {
							await api.open(entry);
						} catch {}
					}
				},
				{
					id: "bm-info",
					label: "Info",
					icon: "info",
					action: () => {
						openBookmarkInfoDialog(entry);
					}
				},
				...api.update && !entry.folder ? [{
					id: "bm-edit",
					label: "Edit bookmark…",
					icon: "pencil",
					action: () => {
						openBookmarkLaunchEditor({
							entry,
							api,
							onSaved: () => hooks.onAppsChanged?.()
						});
					}
				}] : [],
				...api.remove ? [{
					id: "bm-delete",
					label: entry.folder ? "Delete folder" : "Delete",
					icon: "trash",
					danger: true,
					action: async () => {
						if (!confirmUninstall(entry.title, "Delete")) return;
						try {
							if (!await api.remove(entry)) {
								showError(`Could not delete “${entry.title}”`);
								return;
							}
							showSuccess(`Deleted “${entry.title}”`);
							forgetBookmarkFromLists(entry.id);
							hooks.onAppsChanged?.();
						} catch {
							showError(`Could not delete “${entry.title}”`);
						}
					}
				}] : []
			]
		});
	});
}
function renderBookmarkTile(entry, api, hooks, onFolder) {
	const tile = document.createElement("button");
	tile.type = "button";
	tile.className = "env-shell-app-menu__tile";
	tile.setAttribute("data-bookmark-id", entry.id);
	if (entry.folder) tile.setAttribute("data-folder", "");
	tile.title = entry.folder ? `${entry.title} — open folder` : `${entry.title} — right-click: info / edit / delete; hold to drag`;
	const chromeKey = appMenuChromeKeyForBookmark(entry.id);
	const iconPlate = document.createElement("span");
	iconPlate.className = "env-shell-app-menu__tile-icon ui-ws-item-icon shaped";
	iconPlate.setAttribute("data-shape", APP_MENU_DEFAULT_SHAPE);
	const label = document.createElement("span");
	label.className = "env-shell-app-menu__tile-label";
	label.textContent = entry.title;
	tile.append(iconPlate, label);
	const iconUrl = { current: "" };
	const applyChromePaint = (url) => {
		const chrome = getAppMenuTileChrome(chromeKey);
		if (chrome.shape || chrome.iconDisplay || chrome.icon || chrome.iconUrl) {
			paintAppMenuIconPlate(iconPlate, {
				chrome,
				fallbackGlyph: entry.folder ? "folder" : "link",
				resourceUrl: String(chrome.iconUrl || url || "").trim()
			});
			return;
		}
		iconPlate.setAttribute("data-shape", APP_MENU_DEFAULT_SHAPE);
	};
	applyBookmarkIconToPlate(iconPlate, entry, api).then((url) => {
		iconUrl.current = url;
		applyChromePaint(url);
	});
	bindBookmarkTileDrag(tile, entry, iconPlate, iconUrl, hooks);
	bindBookmarkTileContextMenu(tile, entry, api, iconUrl, hooks);
	tile.addEventListener("click", async (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		if (document.documentElement.hasAttribute("data-app-menu-dragging")) return;
		if (entry.folder) {
			onFolder(entry.id, entry.title);
			return;
		}
		pushRecentBookmark(entry);
		try {
			await api.open(entry);
		} catch {}
	});
	return tile;
}
/**
* Mount `.env-shell-app-menu` beside the shell chrome.
* Launcher SKU → Android apps grid; CRX bookmarks API → Win7-style Start (recent | folders).
*/
function mountEnvironmentAppMenu() {
	ensureDocumentStyles();
	const mode = resolveAppMenuMode();
	const root = document.createElement("div");
	root.className = "env-shell-app-menu";
	root.hidden = true;
	root.setAttribute("role", "dialog");
	root.setAttribute("aria-modal", "false");
	root.setAttribute("aria-label", mode === "bookmarks" ? "Bookmarks" : "Apps");
	if (mode) root.setAttribute("data-menu-mode", mode);
	const syncAppMenuColorScheme = () => {
		try {
			const html = document.documentElement;
			const pinned = (html.getAttribute("data-theme") || "").toLowerCase();
			const inline = (html.style.colorScheme || "").trim().toLowerCase();
			const scheme = pinned === "light" || pinned === "dark" ? pinned : inline === "light" || inline === "dark" ? inline : "";
			if (scheme === "light" || scheme === "dark") {
				root.dataset.theme = scheme;
				root.style.colorScheme = scheme;
				return;
			}
			delete root.dataset.theme;
			root.style.colorScheme = "inherit";
		} catch {}
	};
	syncAppMenuColorScheme();
	const onThemeChange = () => syncAppMenuColorScheme();
	document.addEventListener("u2-theme-change", onThemeChange);
	const themeAttrObserver = new MutationObserver(onThemeChange);
	try {
		themeAttrObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: [
				"data-theme",
				"data-scheme",
				"style"
			]
		});
	} catch {}
	const panel = document.createElement("div");
	panel.className = "env-shell-app-menu__panel";
	if (mode === "bookmarks") panel.setAttribute("data-layout", "start-split");
	const banner = document.createElement("div");
	banner.className = "env-shell-app-menu__banner";
	banner.hidden = true;
	const bannerText = document.createElement("p");
	bannerText.className = "env-shell-app-menu__banner-text";
	bannerText.textContent = "Set CWSP Launcher as Home";
	const bannerAction = document.createElement("button");
	bannerAction.type = "button";
	bannerAction.className = "env-shell-app-menu__banner-action btn";
	bannerAction.textContent = "Set as default";
	banner.append(bannerText, bannerAction);
	const search = document.createElement("input");
	search.type = "search";
	search.className = "env-shell-app-menu__search";
	search.placeholder = mode === "bookmarks" ? "Search bookmarks" : "Search apps";
	search.autocomplete = "off";
	search.inputMode = "search";
	search.setAttribute("aria-label", mode === "bookmarks" ? "Search bookmarks" : "Search apps");
	const tools = document.createElement("div");
	tools.className = "env-shell-app-menu__tools";
	const sortBySelect = document.createElement("select");
	sortBySelect.className = "env-shell-app-menu__sort";
	sortBySelect.setAttribute("aria-label", "Sort apps");
	for (const [value, label] of APP_MENU_SORT_OPTIONS) {
		const opt = document.createElement("option");
		opt.value = value;
		opt.textContent = label;
		sortBySelect.appendChild(opt);
	}
	const sortDirSelect = document.createElement("select");
	sortDirSelect.className = "env-shell-app-menu__sort-dir";
	sortDirSelect.setAttribute("aria-label", "Sort order");
	for (const [value, label] of [["asc", "A–Z / oldest"], ["desc", "Z–A / newest"]]) {
		const opt = document.createElement("option");
		opt.value = value;
		opt.textContent = label;
		sortDirSelect.appendChild(opt);
	}
	const syncSortControls = () => {
		const prefs = peekAppMenuSort();
		sortBySelect.value = prefs.sortBy;
		sortDirSelect.value = prefs.sortDir;
	};
	syncSortControls();
	tools.append(search, sortBySelect, sortDirSelect);
	const startBody = document.createElement("div");
	startBody.className = "env-shell-app-menu__start-body";
	startBody.hidden = mode !== "bookmarks";
	const leftCol = document.createElement("div");
	leftCol.className = "env-shell-app-menu__start-left";
	leftCol.setAttribute("aria-label", "Pinned and recent bookmarks");
	const pinnedHeading = document.createElement("div");
	pinnedHeading.className = "env-shell-app-menu__start-heading";
	pinnedHeading.textContent = "Pinned";
	const pinnedList = document.createElement("div");
	pinnedList.className = "env-shell-app-menu__start-recent env-shell-app-menu__start-pinned";
	const recentHeading = document.createElement("div");
	recentHeading.className = "env-shell-app-menu__start-heading";
	recentHeading.textContent = "Recent";
	const recentList = document.createElement("div");
	recentList.className = "env-shell-app-menu__start-recent";
	leftCol.append(pinnedHeading, pinnedList, recentHeading, recentList);
	const rightCol = document.createElement("div");
	rightCol.className = "env-shell-app-menu__start-right";
	const crumb = document.createElement("div");
	crumb.className = "env-shell-app-menu__crumb";
	const crumbNav = document.createElement("div");
	crumbNav.className = "env-shell-app-menu__crumb-nav";
	const crumbActions = document.createElement("div");
	crumbActions.className = "env-shell-app-menu__crumb-actions";
	crumb.append(crumbNav, crumbActions);
	const gridHost = document.createElement("div");
	gridHost.className = "env-shell-app-menu__grid";
	gridHost.setAttribute("data-part", "grid");
	gridHost.setAttribute("aria-label", mode === "bookmarks" ? "Bookmarks" : "Installed apps");
	rightCol.append(crumb, gridHost);
	startBody.append(leftCol, rightCol);
	if (mode === "bookmarks") panel.append(banner, tools, startBody);
	else panel.append(banner, tools, gridHost);
	root.appendChild(panel);
	resolveAppMenuHost().appendChild(root);
	let open = false;
	let refreshGen = 0;
	let searchQuery = "";
	let searchTimer;
	let folderStack = [];
	const syncVisibility = () => {
		if (!isAppMenuEnabled()) {
			root.hidden = true;
			root.toggleAttribute("data-open", false);
			return;
		}
		root.hidden = !open;
		root.toggleAttribute("data-open", open);
	};
	const close = () => {
		if (!open) return;
		open = false;
		root.toggleAttribute("data-page", false);
		syncVisibility();
		root.dispatchEvent(new CustomEvent("env-app-menu-close", { bubbles: true }));
	};
	root.addEventListener("env-app-menu-request-close", (ev) => {
		ev.stopPropagation();
		close();
	});
	const openMenu = () => {
		if (!isAppMenuEnabled()) return;
		syncAppMenuColorScheme();
		open = true;
		syncVisibility();
		refresh();
		root.dispatchEvent(new CustomEvent("env-app-menu-open", { bubbles: true }));
	};
	const openPage = () => {
		root.toggleAttribute("data-page", true);
		openMenu();
	};
	const toggle = () => {
		if (open) close();
		else openMenu();
	};
	const tileDragHooks = {
		onPinned: () => {
			close();
		},
		onStartPinsChanged: () => {
			refresh();
		},
		onAppsChanged: () => {
			refresh();
		}
	};
	const beginCreateBookmark = (kind) => {
		const api = resolveBookmarksMenuApi();
		if (!api?.create) {
			showError("Cannot create bookmark here");
			return;
		}
		const parent = folderStack.length ? folderStack[folderStack.length - 1] : null;
		const parentId = parent?.id || "0";
		const parentTitle = parent?.title || "Bookmarks";
		(async () => {
			const fields = await openBookmarkFieldsDialog({
				heading: kind === "folder" ? "New folder" : "New bookmark",
				description: `Add to “${parentTitle}” (Chrome bookmarks)`,
				showUrl: kind === "url",
				initialTitle: kind === "folder" ? "New folder" : "",
				initialUrl: kind === "url" ? "https://" : "",
				submitLabel: "Create"
			});
			if (!fields) return;
			const created = await api.create(parentId, {
				title: fields.title,
				url: kind === "url" ? fields.url : void 0
			});
			if (!created) {
				showError(kind === "folder" ? "Could not create folder" : "Could not create bookmark");
				return;
			}
			showSuccess(kind === "folder" ? `Created folder “${created.title}”` : `Created “${created.title}”`);
			refresh();
		})();
	};
	const makeCrumbAction = (label, onClick) => {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "env-shell-app-menu__crumb-action";
		btn.textContent = label;
		btn.addEventListener("click", (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			onClick();
		});
		return btn;
	};
	crumbActions.append(makeCrumbAction("New bookmark", () => beginCreateBookmark("url")), makeCrumbAction("New folder", () => beginCreateBookmark("folder")));
	gridHost.addEventListener("contextmenu", (ev) => {
		if (ev.target?.closest?.("[data-bookmark-id]")) return;
		if (resolveAppMenuMode() !== "bookmarks") return;
		if (!resolveBookmarksMenuApi()?.create) return;
		ev.preventDefault();
		ev.stopPropagation();
		openUnifiedContextMenu$1({
			x: ev.clientX,
			y: ev.clientY,
			compact: true,
			items: [{
				id: "new-bookmark",
				label: "New bookmark…",
				icon: "bookmark-simple",
				action: () => beginCreateBookmark("url")
			}, {
				id: "new-folder",
				label: "New folder…",
				icon: "folder-plus",
				action: () => beginCreateBookmark("folder")
			}]
		});
	});
	const paintCrumb = () => {
		crumbNav.replaceChildren();
		crumbActions.hidden = mode !== "bookmarks" || !resolveBookmarksMenuApi()?.create;
		if (mode !== "bookmarks") return;
		const rootBtn = document.createElement("button");
		rootBtn.type = "button";
		rootBtn.className = "env-shell-app-menu__crumb-item";
		rootBtn.textContent = "Bookmarks";
		rootBtn.addEventListener("click", () => {
			folderStack = [];
			refresh();
		});
		crumbNav.appendChild(rootBtn);
		folderStack.forEach((seg, idx) => {
			const sep = document.createElement("span");
			sep.className = "env-shell-app-menu__crumb-sep";
			sep.textContent = "›";
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "env-shell-app-menu__crumb-item";
			btn.textContent = seg.title;
			btn.addEventListener("click", () => {
				folderStack = folderStack.slice(0, idx + 1);
				refresh();
			});
			crumbNav.append(sep, btn);
		});
	};
	const populateLauncherGrid = async (bridge, gen) => {
		let apps = [];
		try {
			apps = await bridge.launcherList(searchQuery || void 0);
		} catch {
			apps = [];
		}
		if (gen !== refreshGen) return;
		gridHost.replaceChildren();
		const prefs = peekAppMenuSort();
		if (prefs.sortBy === "color") {
			await hydrateAppColorKeys(apps, gridHost);
			if (gen !== refreshGen) return;
		}
		apps = sortLauncherApps(apps, prefs);
		if (apps.length === 0) {
			const empty = document.createElement("p");
			empty.className = "env-shell-app-menu__empty";
			empty.textContent = searchQuery ? "No matching apps" : "No apps found";
			gridHost.appendChild(empty);
			return;
		}
		const frag = document.createDocumentFragment();
		for (const app of apps) frag.appendChild(renderAppTile(app, bridge, gen, () => refreshGen, tileDragHooks));
		gridHost.appendChild(frag);
	};
	const enterFolder = (id, title) => {
		folderStack.push({
			id,
			title
		});
		searchQuery = "";
		search.value = "";
		refresh();
	};
	const populateBookmarks = async (api, gen) => {
		paintCrumb();
		const fillLeftSection = (host, entries, emptyLabel) => {
			host.replaceChildren();
			if (entries.length === 0) {
				const empty = document.createElement("p");
				empty.className = "env-shell-app-menu__empty env-shell-app-menu__empty--compact";
				empty.textContent = emptyLabel;
				host.appendChild(empty);
				return;
			}
			for (const entry of entries) host.appendChild(renderBookmarkTile(entry, api, tileDragHooks, enterFolder));
		};
		fillLeftSection(pinnedList, readPinnedBookmarks(), "No pinned bookmarks");
		fillLeftSection(recentList, readRecentBookmarks(), "No recent bookmarks");
		let entries = [];
		try {
			if (searchQuery) entries = await api.search(searchQuery);
			else {
				const folderId = folderStack.length ? folderStack[folderStack.length - 1].id : void 0;
				entries = await api.listChildren(folderId);
			}
		} catch {
			entries = [];
		}
		if (gen !== refreshGen) return;
		gridHost.replaceChildren();
		if (entries.length === 0) {
			const empty = document.createElement("p");
			empty.className = "env-shell-app-menu__empty";
			empty.textContent = searchQuery ? "No matching bookmarks" : "This folder is empty";
			gridHost.appendChild(empty);
			return;
		}
		const frag = document.createDocumentFragment();
		const dir = peekAppMenuSort().sortDir === "desc" ? -1 : 1;
		const folders = entries.filter((e) => e.folder);
		const links = entries.filter((e) => !e.folder);
		const byTitle = (a, b) => String(a.title || "").localeCompare(String(b.title || ""), void 0, {
			numeric: true,
			sensitivity: "base"
		}) * dir;
		for (const entry of [...folders.sort(byTitle), ...links.sort(byTitle)]) frag.appendChild(renderBookmarkTile(entry, api, tileDragHooks, enterFolder));
		gridHost.appendChild(frag);
	};
	const refresh = async () => {
		const gen = ++refreshGen;
		banner.hidden = true;
		tools.hidden = false;
		search.hidden = false;
		const activeMode = resolveAppMenuMode();
		if (!activeMode) {
			syncVisibility();
			return;
		}
		root.setAttribute("data-menu-mode", activeMode);
		if (activeMode === "bookmarks") {
			panel.setAttribute("data-layout", "start-split");
			startBody.hidden = false;
			if (!panel.contains(startBody)) {
				panel.append(banner, tools, startBody);
				if (gridHost.parentElement !== rightCol) rightCol.append(crumb, gridHost);
			}
			const api = resolveBookmarksMenuApi();
			if (!api) {
				banner.hidden = false;
				bannerText.textContent = "Bookmarks API unavailable in this context";
				bannerAction.hidden = true;
				search.hidden = true;
				tools.hidden = true;
				startBody.hidden = true;
				return;
			}
			bannerAction.hidden = true;
			await populateBookmarks(api, gen);
			return;
		}
		panel.removeAttribute("data-layout");
		startBody.hidden = true;
		if (gridHost.parentElement !== panel) panel.append(gridHost);
		const bridge = await resolveLauncherBridge();
		if (gen !== refreshGen) return;
		if (!bridge?.launcherList || !bridge?.launcherLaunch || !bridge?.launcherIcon) {
			banner.hidden = false;
			bannerText.textContent = "Launcher bridge unavailable — rebuild the Capacitor APK";
			bannerAction.hidden = true;
			search.hidden = true;
			tools.hidden = true;
			gridHost.hidden = true;
			return;
		}
		let isDefault = false;
		try {
			isDefault = await bridge.launcherIsDefault();
		} catch {
			isDefault = false;
		}
		if (gen !== refreshGen) return;
		if (!isDefault) {
			banner.hidden = false;
			bannerText.textContent = "Set CWSP Launcher as Home for full launcher integration";
			bannerAction.hidden = false;
		} else banner.hidden = true;
		search.hidden = false;
		tools.hidden = false;
		gridHost.hidden = false;
		await populateLauncherGrid(bridge, gen);
	};
	sortBySelect.addEventListener("change", () => {
		const sortBy = sortBySelect.value;
		writeAppMenuSort({
			sortBy,
			sortDir: defaultDirForAppSort(sortBy)
		});
		syncSortControls();
	});
	sortDirSelect.addEventListener("change", () => {
		writeAppMenuSort({ sortDir: sortDirSelect.value === "desc" ? "desc" : "asc" });
	});
	const onSortPrefs = () => {
		syncSortControls();
		if (open) refresh();
	};
	window.addEventListener(APP_MENU_SORT_EVENT, onSortPrefs);
	search.addEventListener("input", () => {
		searchQuery = search.value.trim();
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			refresh();
		}, 180);
	});
	bannerAction.addEventListener("click", async (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		const bridge = await resolveLauncherBridge();
		if (!bridge) return;
		try {
			await bridge.launcherRequestDefault();
		} catch {}
		refresh();
	});
	const onDocPointer = (ev) => {
		if (!open) return;
		if (document.documentElement.hasAttribute("data-app-menu-dragging")) return;
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		for (const n of path) {
			if (n === root || n === panel) return;
			if (n instanceof Element && root.contains(n)) return;
			if (n instanceof Element && n.closest?.(".cw-context-menu-layer")) return;
			if (n instanceof Element && n.closest?.(".env-shell-app-menu__chrome-editor")) return;
			if (n instanceof Element && n.closest?.("dialog.speed-dial-editor")) return;
		}
		close();
	};
	document.addEventListener("pointerdown", onDocPointer, { capture: true });
	const APP_MENU_KEEP_OPEN_SEL = [
		".env-shell-app-menu__tile",
		".env-shell-app-menu__search",
		".env-shell-app-menu__sort",
		".env-shell-app-menu__sort-dir",
		".env-shell-app-menu__tools",
		".env-shell-app-menu__banner",
		".env-shell-app-menu__pin-menu",
		".env-shell-app-menu__crumb-item",
		".env-shell-app-menu__start-heading",
		".env-shell-app-menu__chrome-editor",
		".env-shell-app-menu__drag-ghost",
		".cw-context-menu-layer",
		"dialog.speed-dial-editor"
	].join(", ");
	const TAP_DISMISS_SLOP_PX = 14;
	let dismissTap = null;
	const isKeepOpenTarget = (t) => t instanceof Element && Boolean(t.closest(APP_MENU_KEEP_OPEN_SEL));
	const onEmptySurfacePointerDown = (ev) => {
		if (!open) return;
		if (ev.button != null && ev.button !== 0) return;
		if (document.documentElement.hasAttribute("data-app-menu-dragging") || isKeepOpenTarget(ev.target)) {
			dismissTap = null;
			return;
		}
		dismissTap = {
			id: ev.pointerId,
			x: ev.clientX,
			y: ev.clientY
		};
	};
	const onEmptySurfacePointerUp = (ev) => {
		if (!dismissTap || dismissTap.id !== ev.pointerId) return;
		const dx = ev.clientX - dismissTap.x;
		const dy = ev.clientY - dismissTap.y;
		dismissTap = null;
		if (!open) return;
		if (document.documentElement.hasAttribute("data-app-menu-dragging")) return;
		if (isKeepOpenTarget(ev.target)) return;
		if (Math.hypot(dx, dy) > TAP_DISMISS_SLOP_PX) return;
		close();
	};
	const onEmptySurfacePointerCancel = (ev) => {
		if (dismissTap?.id === ev.pointerId) dismissTap = null;
	};
	root.addEventListener("pointerdown", onEmptySurfacePointerDown);
	root.addEventListener("pointerup", onEmptySurfacePointerUp);
	root.addEventListener("pointercancel", onEmptySurfacePointerCancel);
	syncVisibility();
	const dispose = () => {
		if (searchTimer) clearTimeout(searchTimer);
		document.documentElement.toggleAttribute("data-app-menu-dragging", false);
		document.removeEventListener("pointerdown", onDocPointer, { capture: true });
		root.removeEventListener("pointerdown", onEmptySurfacePointerDown);
		root.removeEventListener("pointerup", onEmptySurfacePointerUp);
		root.removeEventListener("pointercancel", onEmptySurfacePointerCancel);
		document.removeEventListener("u2-theme-change", onThemeChange);
		window.removeEventListener(APP_MENU_SORT_EVENT, onSortPrefs);
		try {
			themeAttrObserver.disconnect();
		} catch {}
		root.remove();
	};
	return {
		element: root,
		toggle,
		open: openMenu,
		openPage,
		close,
		isOpen: () => open,
		refresh,
		dispose
	};
}
//#endregion
//#region src/frontend/shells/environment/components/taskbar/element/TaskBar.ts
var styled = preloadStyle$1(taskbar_default);
var UITaskBar = class UITaskBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled;
	render = () => H`<div part="taskbar" class="taskbar"><slot></slot></div>`;
};
UITaskBar = __decorate([defineElement("ui-taskbar")], UITaskBar);
var HOME_TASK = "#env-home";
var VIEWER_TASK = "#env-viewer";
var WIN_TASK_PREFIX = "#env-win-";
/** Long-press threshold for mobile Home → process switcher (ms). */
var HOME_LONG_PRESS_MS = 420;
var CLOCK_TICK_MS = 3e4;
function winTaskId(viewId) {
	return `${WIN_TASK_PREFIX}${String(viewId || "").trim().toLowerCase()}`;
}
function isMobileChrome() {
	const chrome = document.querySelector(".env-shell-chrome");
	if (chrome instanceof HTMLElement && chrome.hasAttribute("data-desktop")) return false;
	if (chrome instanceof HTMLElement && chrome.dataset.chromeLayout === "mobile") return true;
	return typeof matchMedia === "function" && matchMedia("(max-width: 640px)").matches;
}
/** True when a managed sub-app window (explorer, settings, …) is visible on the desktop. */
function hasVisibleManagedWindows(windows, focusedTaskId) {
	if (windows.some((w) => {
		const id = String(w.id || "").trim().toLowerCase();
		if (!id || id === "home") return false;
		return w.visible !== false && !w.minimized;
	})) return true;
	const focused = String(focusedTaskId.value || "home").trim().toLowerCase();
	if (focused && focused !== "home" && focused !== "viewer") return true;
	const workspace = document.querySelector(".env-shell-workspace");
	if (!workspace) return false;
	for (const node of workspace.querySelectorAll("ui-window")) {
		if (!(node instanceof HTMLElement)) continue;
		if (node.hidden || node.hasAttribute("data-minimized")) continue;
		const style = getComputedStyle(node);
		if (style.display === "none" || style.visibility === "hidden") continue;
		if (Number.parseFloat(style.opacity || "1") <= 0) continue;
		return true;
	}
	return false;
}
function formatTrayClock(now = /* @__PURE__ */ new Date()) {
	return formatChromeClock(now);
}
/**
* Task bar with Home / Markdown pins + dynamic open-window tasks and reactive system tray.
*/
function mountEnvironmentTaskBar(opts) {
	const taskList = observe([]);
	navigationEnable(taskList);
	makeTask(HOME_TASK, taskList, {
		title: "Home",
		icon: "house-line"
	}, {}, function() {
		for (const t of taskList) if (t !== this) t.active = false;
		this.active = true;
		opts.focusedTaskId.value = "home";
		opts.onHome();
	});
	makeTask(VIEWER_TASK, taskList, {
		title: "Markdown",
		icon: "article"
	}, {}, function() {
		for (const t of taskList) if (t !== this) t.active = false;
		this.active = true;
		opts.focusedTaskId.value = "viewer";
		opts.onViewer();
	});
	const bar = document.createElement("ui-taskbar");
	bar.className = "env-shell-taskbar wf-chrome-no-select";
	bar.setAttribute("part", "taskbar");
	bar.setAttribute("data-type", "desktop");
	const pinsHost = document.createElement("div");
	pinsHost.className = "env-shell-taskbar__pins";
	const windowsHost = document.createElement("div");
	windowsHost.className = "env-shell-taskbar__windows";
	const tHome = document.createElement("ui-task");
	tHome.setAttribute("title", "Home");
	tHome.setAttribute("icon", "house-line");
	tHome.setAttribute("data-id", HOME_TASK);
	tHome.setAttribute("data-env-home", "");
	tHome.setAttribute("aria-label", "Home");
	tHome.setAttribute("aria-haspopup", "menu");
	pinsHost.append(tHome);
	const workspacePager = document.createElement("div");
	workspacePager.className = "env-shell-taskbar__workspaces";
	workspacePager.setAttribute("aria-label", "Workspaces");
	const paintWorkspacePager = () => {
		const pages = listWorkspacePages();
		const active = getActiveWorkspaceId();
		workspacePager.replaceChildren();
		for (const page of pages) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "env-shell-taskbar__workspace";
			btn.title = page.label;
			btn.textContent = page.label.replace(/^Side\s+/i, "") || page.id.slice(-1).toUpperCase();
			btn.toggleAttribute("data-active", page.id === active);
			btn.addEventListener("click", (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				switchWorkspacePage(page.id);
			});
			workspacePager.append(btn);
		}
	};
	paintWorkspacePager();
	window.addEventListener(WORKSPACE_PAGE_EVENT, paintWorkspacePager);
	pinsHost.append(workspacePager);
	installLauncherBackStack();
	const syncStartChrome = () => {
		const mobile = isMobileChrome();
		tHome.setAttribute("title", mobile ? "Home" : "Start");
		tHome.setAttribute("aria-label", mobile ? "Home" : "Start");
		tHome.setAttribute("icon", mobile ? "house-line" : "aperture");
		tHome.toggleAttribute("data-env-start", !mobile);
		if (mobile) tHome.setAttribute("aria-keyshortcuts", "LongPress");
		else tHome.removeAttribute("aria-keyshortcuts");
	};
	syncStartChrome();
	const trayHost = document.createElement("div");
	trayHost.className = "env-shell-taskbar__tray-host";
	const clockHost = document.createElement("div");
	clockHost.className = "env-shell-taskbar__clock";
	clockHost.setAttribute("role", "button");
	clockHost.setAttribute("tabindex", "0");
	clockHost.setAttribute("aria-label", "Calendar");
	clockHost.setAttribute("aria-haspopup", "dialog");
	clockHost.setAttribute("data-chrome-flyout-anchor", "calendar");
	const clockTime = document.createElement("span");
	clockTime.className = "env-shell-taskbar__clock-time";
	const clockDate = document.createElement("span");
	clockDate.className = "env-shell-taskbar__clock-date";
	clockHost.append(clockTime, clockDate);
	const paintClock = () => {
		const { time, date } = formatTrayClock();
		clockTime.textContent = time;
		clockDate.textContent = date;
		clockHost.title = `${time} · ${date}`;
	};
	paintClock();
	const clockTimer = setInterval(paintClock, CLOCK_TICK_MS);
	const deviceTray = buildShellDeviceTray(opts.device, "env-device-tray env-device-tray--taskbar");
	deviceTray.setAttribute("role", "button");
	deviceTray.setAttribute("tabindex", "0");
	deviceTray.setAttribute("aria-label", "Quick settings");
	deviceTray.setAttribute("aria-haspopup", "dialog");
	deviceTray.setAttribute("data-chrome-flyout-anchor", "quick-settings");
	const onClockActivate = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		toggleCalendarFlyout(clockHost);
	};
	const onTrayActivate = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		toggleQuickSettingsFlyout(deviceTray);
	};
	clockHost.addEventListener("click", onClockActivate);
	clockHost.addEventListener("keydown", (ev) => {
		if (ev.key === "Enter" || ev.key === " ") onClockActivate(ev);
	});
	deviceTray.addEventListener("click", onTrayActivate);
	deviceTray.addEventListener("keydown", (ev) => {
		if (ev.key === "Enter" || ev.key === " ") onTrayActivate(ev);
	});
	trayHost.append(deviceTray, clockHost);
	const switcher = document.createElement("div");
	switcher.className = "env-shell-navbar__switcher";
	switcher.setAttribute("role", "menu");
	switcher.setAttribute("aria-label", "Open apps");
	switcher.hidden = true;
	const switcherList = document.createElement("ul");
	switcherList.className = "env-shell-navbar__switcher-list";
	switcher.appendChild(switcherList);
	bar.append(pinsHost, windowsHost, trayHost, switcher);
	const appMenuEnabled = isAppMenuEnabled();
	const appMenu = appMenuEnabled ? mountEnvironmentAppMenu() : void 0;
	const windowTaskEls = /* @__PURE__ */ new Map();
	let lastWindows = [];
	let longPressTimer = null;
	let longPressFired = false;
	let switcherOpen = false;
	const cleanupFns = [];
	cleanupFns.push(() => clearInterval(clockTimer));
	const findWindowDesc = (viewId) => lastWindows.find((w) => String(w.id || "").trim().toLowerCase() === viewId);
	/**
	* Win-style task click: minimized → restore+focus; focused+visible → minimize; else → focus.
	* WHY: do NOT route through `task.focus = true` — ITask focus setter only runs takeAction when
	* focus *changes*, so a second click on an already-focused task never minimized.
	*/
	const activateWindowTask = (viewId) => {
		const id = String(viewId || "").trim().toLowerCase();
		if (!id) return;
		const desc = findWindowDesc(id);
		const focusedId = String(opts.focusedTaskId.value || "").trim().toLowerCase();
		const isFocused = Boolean(desc?.focused) || focusedId === id || focusedId === "markdown" && id === "viewer" || focusedId === "viewer" && (id === "viewer" || id === "markdown");
		if (desc?.minimized) {
			desc.minimized = false;
			desc.focused = true;
			windowTaskEls.get(id)?.toggleAttribute("data-minimized", false);
			opts.focusedTaskId.value = id === "markdown" ? "viewer" : id;
			opts.onWindowTask?.(id);
			return;
		}
		if (isFocused && desc && desc.visible !== false) {
			desc.minimized = true;
			desc.focused = false;
			windowTaskEls.get(id)?.toggleAttribute("data-minimized", true);
			opts.onMinimizeWindow?.(id);
			return;
		}
		opts.focusedTaskId.value = id === "markdown" ? "viewer" : id;
		opts.onWindowTask?.(id);
	};
	const openTaskContextMenu = (ev, viewId, title) => {
		if (isMobileChrome()) return;
		ev.preventDefault();
		ev.stopPropagation();
		const id = String(viewId || "").trim().toLowerCase();
		const desc = findWindowDesc(id);
		const minimized = Boolean(desc?.minimized);
		const items = [{
			id: minimized ? "restore" : "minimize",
			label: minimized ? "Restore" : "Minimize",
			icon: minimized ? "arrow-square-out" : "minus",
			action: () => {
				if (minimized) {
					opts.focusedTaskId.value = id;
					opts.onWindowTask?.(id);
				} else opts.onMinimizeWindow?.(id);
			}
		}, {
			id: "close",
			label: "Close",
			icon: "x",
			danger: true,
			action: () => opts.onCloseWindow?.(id)
		}];
		openUnifiedContextMenu({
			x: ev.clientX,
			y: ev.clientY,
			compact: true,
			anchor: ev.target instanceof Element ? ev.target : bar,
			items
		});
	};
	const openBarContextMenu = (ev) => {
		if (isMobileChrome()) return;
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		for (const n of path) if (n instanceof Element && n.closest?.("ui-task")) return;
		ev.preventDefault();
		ev.stopPropagation();
		openUnifiedContextMenu({
			x: ev.clientX,
			y: ev.clientY,
			compact: true,
			anchor: bar,
			items: [{
				id: "show-desktop",
				label: "Show desktop",
				icon: "desktop",
				action: () => opts.onHome()
			}, {
				id: "home",
				label: "Home",
				icon: "house-line",
				action: () => opts.onHome()
			}]
		});
	};
	bar.addEventListener("contextmenu", openBarContextMenu);
	const closeSwitcher = () => {
		switcherOpen = false;
		switcher.hidden = true;
		switcherList.replaceChildren();
		bar.removeAttribute("data-switcher-open");
	};
	const openSwitcher = () => {
		const open = lastWindows.filter((w) => String(w.id || "").trim());
		switcherList.replaceChildren();
		if (!open.length) {
			const empty = document.createElement("li");
			empty.className = "env-shell-navbar__switcher-empty";
			empty.textContent = "No open apps";
			switcherList.appendChild(empty);
		} else for (const w of open) {
			const id = String(w.id || "").trim().toLowerCase();
			const li = document.createElement("li");
			li.className = "env-shell-navbar__switcher-row";
			li.setAttribute("role", "none");
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "env-shell-navbar__switcher-item";
			btn.setAttribute("role", "menuitem");
			btn.toggleAttribute("data-active", Boolean(w.focused) && !w.minimized);
			btn.toggleAttribute("data-minimized", Boolean(w.minimized));
			const icon = document.createElement("ui-icon");
			icon.setAttribute("icon", w.icon || "app-window");
			icon.setAttribute("icon-style", "duotone");
			icon.setAttribute("aria-hidden", "true");
			const label = document.createElement("span");
			label.className = "env-shell-navbar__switcher-label";
			label.textContent = w.title || id;
			btn.append(icon, label);
			btn.addEventListener("click", (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				closeSwitcher();
				opts.focusedTaskId.value = id;
				const taskId = winTaskId(id);
				const t = getBy(taskList, taskId);
				if (t) t.focus = true;
				else opts.onWindowTask?.(id);
			});
			const closeBtn = document.createElement("button");
			closeBtn.type = "button";
			closeBtn.className = "env-shell-navbar__switcher-close";
			closeBtn.setAttribute("aria-label", `Close ${w.title || id}`);
			closeBtn.title = "Close";
			const closeIcon = document.createElement("ui-icon");
			closeIcon.setAttribute("icon", "x");
			closeIcon.setAttribute("icon-style", "bold");
			closeIcon.setAttribute("aria-hidden", "true");
			closeBtn.appendChild(closeIcon);
			closeBtn.addEventListener("click", (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				opts.onCloseWindow?.(id);
				lastWindows = lastWindows.filter((row) => String(row.id || "").trim().toLowerCase() !== id);
				windowTaskEls.get(id)?.remove();
				windowTaskEls.delete(id);
				if (!lastWindows.length) closeSwitcher();
				else openSwitcher();
			});
			li.append(btn, closeBtn);
			switcherList.appendChild(li);
		}
		switcherOpen = true;
		switcher.hidden = false;
		bar.setAttribute("data-switcher-open", "");
	};
	const clearLongPress = () => {
		if (longPressTimer != null) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	};
	const syncAppMenuChrome = () => {
		bar.toggleAttribute("data-app-menu-open", Boolean(appMenu?.isOpen()));
	};
	const goHome = () => {
		closeSwitcher();
		appMenu?.close();
		syncAppMenuChrome();
		getBy(taskList, HOME_TASK).focus = true;
		opts.onHome();
	};
	const toggleAppMenuFromStart = () => {
		closeSwitcher();
		appMenu?.toggle();
		syncAppMenuChrome();
		getBy(taskList, HOME_TASK).focus = true;
		opts.focusedTaskId.value = "home";
		paintActive();
	};
	/** Open only — used by empty-desktop swipe-up on Capacitor. */
	const openAppMenuFromDesktop = () => {
		if (!appMenu || appMenu.isOpen()) return;
		closeSwitcher();
		appMenu.open();
		syncAppMenuChrome();
		getBy(taskList, HOME_TASK).focus = true;
		opts.focusedTaskId.value = "home";
		paintActive();
	};
	const openAppMenuPage = () => {
		if (!appMenu) return;
		closeSwitcher();
		appMenu.openPage();
		syncAppMenuChrome();
		getBy(taskList, HOME_TASK).focus = true;
		opts.focusedTaskId.value = "home";
		paintActive();
	};
	try {
		const g = globalThis;
		g.__CWSP_LAUNCHER_HOME__ = {
			...g.__CWSP_LAUNCHER_HOME__ || {},
			openAppMenu: openAppMenuFromDesktop,
			openAppMenuPage
		};
	} catch {}
	const handleLauncherHomeTap = () => {
		if (hasVisibleManagedWindows(lastWindows, opts.focusedTaskId)) {
			goHome();
			return;
		}
		if (appMenu?.isOpen()) {
			appMenu.close();
			syncAppMenuChrome();
			return;
		}
		toggleAppMenuFromStart();
	};
	tHome.addEventListener("click", (ev) => {
		if (longPressFired) {
			ev.preventDefault();
			ev.stopPropagation();
			longPressFired = false;
			return;
		}
		if (appMenuEnabled && appMenu) {
			ev.preventDefault();
			ev.stopPropagation();
			handleLauncherHomeTap();
			return;
		}
		goHome();
	});
	tHome.addEventListener("pointerdown", (ev) => {
		if (!isMobileChrome()) return;
		if (ev.button != null && ev.button !== 0) return;
		longPressFired = false;
		clearLongPress();
		longPressTimer = setTimeout(() => {
			longPressTimer = null;
			longPressFired = true;
			try {
				tHome.releasePointerCapture?.(ev.pointerId);
			} catch {}
			openSwitcher();
		}, HOME_LONG_PRESS_MS);
		try {
			tHome.setPointerCapture?.(ev.pointerId);
		} catch {}
	}, { capture: true });
	const endHomePress = () => {
		clearLongPress();
	};
	tHome.addEventListener("pointerup", endHomePress, { capture: true });
	tHome.addEventListener("pointercancel", endHomePress, { capture: true });
	tHome.addEventListener("contextmenu", (ev) => {
		if (!isMobileChrome()) return;
		ev.preventDefault();
		longPressFired = true;
		clearLongPress();
		openSwitcher();
	});
	const onDocPointer = (ev) => {
		if (!switcherOpen) return;
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		for (const n of path) {
			if (n === switcher || n === tHome) return;
			if (n instanceof Element && (n === switcher || switcher.contains(n) || n === tHome)) return;
		}
		closeSwitcher();
	};
	document.addEventListener("pointerdown", onDocPointer, { capture: true });
	cleanupFns.push(() => document.removeEventListener("pointerdown", onDocPointer, { capture: true }));
	const paintActive = () => {
		const id = String(opts.focusedTaskId.value || "home");
		const mark = (el, active) => {
			el.toggleAttribute("data-env-active", active);
			el.toggleAttribute("data-active", active);
			el.toggleAttribute("data-focus", active);
		};
		mark(tHome, id === "home");
		for (const [viewId, el] of windowTaskEls) mark(el, id === viewId);
	};
	effect(() => {
		paintActive();
	}, [opts.focusedTaskId], { triggerImmediately: true });
	const ensureWindowTask = (desc) => {
		const viewId = String(desc.id || "").trim().toLowerCase();
		if (!viewId || viewId === "home") return;
		const taskId = winTaskId(viewId);
		const title = desc.title || viewId;
		const iconName = String(desc.icon || "").trim() || "app-window";
		let el = windowTaskEls.get(viewId);
		if (!el) {
			const task = makeTask(taskId, null, {
				title,
				icon: iconName
			}, { viewId }, function() {
				for (const t of taskList) if (t !== this) t.active = false;
				this.active = true;
				activateWindowTask(viewId);
			});
			task.list = taskList;
			taskList.push(task);
			el = document.createElement("ui-task");
			el.setAttribute("data-id", taskId);
			el.setAttribute("data-view", viewId);
			el.setAttribute("title", title);
			el.setAttribute("aria-label", title);
			el.setAttribute("icon", iconName);
			el.addEventListener("click", (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				activateWindowTask(viewId);
			});
			el.addEventListener("contextmenu", (ev) => {
				openTaskContextMenu(ev, viewId, title);
			});
			windowTaskEls.set(viewId, el);
			windowsHost.appendChild(el);
		}
		el.setAttribute("title", title);
		el.setAttribute("aria-label", title);
		el.setAttribute("icon", iconName);
		el.toggleAttribute("data-minimized", Boolean(desc.minimized));
		el.hidden = desc.visible === false;
	};
	const syncWindowTasks = (windows) => {
		lastWindows = Array.isArray(windows) ? windows.slice() : [];
		const seen = /* @__PURE__ */ new Set();
		for (const w of windows) {
			const id = String(w.id || "").trim().toLowerCase();
			if (!id || id === "home") continue;
			seen.add(id);
			ensureWindowTask(w);
			if (w.focused) opts.focusedTaskId.value = id;
		}
		for (const [viewId, el] of [...windowTaskEls.entries()]) {
			if (seen.has(viewId)) continue;
			const taskId = winTaskId(viewId);
			const t = getBy(taskList, taskId);
			if (t) {
				const idx = taskList.indexOf(t);
				if (idx >= 0) taskList.splice(idx, 1);
			}
			el.remove();
			windowTaskEls.delete(viewId);
		}
		paintActive();
		if (switcherOpen) openSwitcher();
	};
	const setFocusedTaskId = (id) => {
		const raw = String(id || "home").toLowerCase();
		let taskId = HOME_TASK;
		if (raw === "viewer" || raw === "markdown") taskId = VIEWER_TASK;
		else if (raw !== "home") taskId = winTaskId(raw);
		const t = getBy(taskList, taskId);
		if (t) {
			for (const x of taskList) if (x !== t) x.active = false;
			t.active = true;
		}
		opts.focusedTaskId.value = raw === "markdown" ? "viewer" : raw;
		paintActive();
	};
	queueMicrotask(syncStartChrome);
	if (appMenu) {
		const onAppMenuSurface = () => syncAppMenuChrome();
		bar.addEventListener("env-app-menu-open", onAppMenuSurface);
		bar.addEventListener("env-app-menu-close", onAppMenuSurface);
		cleanupFns.push(() => {
			bar.removeEventListener("env-app-menu-open", onAppMenuSurface);
			bar.removeEventListener("env-app-menu-close", onAppMenuSurface);
		});
	}
	const dispose = () => {
		clearLongPress();
		closeSwitcher();
		appMenu?.dispose();
		for (const fn of cleanupFns) try {
			fn();
		} catch {}
		cleanupFns.length = 0;
		windowTaskEls.clear();
		windowsHost.replaceChildren();
	};
	return {
		element: bar,
		taskList,
		setFocusedTaskId,
		syncWindowTasks,
		appMenu,
		openAppMenu: appMenu ? openAppMenuFromDesktop : void 0,
		openAppMenuPage: appMenu ? openAppMenuPage : void 0,
		isSwitcherOpen: () => switcherOpen,
		closeSwitcher,
		dispose
	};
}
//#endregion
//#region src/frontend/shells/environment/scss/container.scss?inline
var container_default = ":host{block-size:var(--lv-height,100lvb);box-sizing:border-box;color-scheme:light dark;display:block;isolation:isolate;min-block-size:var(--lv-height,100lvb);overflow:visible;position:relative}.esc-stack{display:grid;grid-template:1fr/1fr}.esc-layer,.esc-stack{box-sizing:border-box;min-block-size:inherit}.esc-layer{grid-area:1/1}.esc-underlying{overflow:visible;pointer-events:none;z-index:0}.esc-main{align-items:stretch;display:flex;flex-direction:column;min-block-size:inherit;pointer-events:auto;z-index:1}.esc-main,.esc-overlays{overflow:visible;position:relative}.esc-overlays{pointer-events:none;z-index:2}@media print{:host{block-size:auto!important;contain:none!important;container-type:normal!important;display:block!important;height:auto!important;isolation:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.esc-layer,.esc-main,.esc-stack{block-size:auto!important;contain:none!important;display:block!important;height:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.esc-overlays,.esc-underlying{display:none!important}}";
//#endregion
//#region src/frontend/shells/environment/environment-shell-container.ts
/**
* Multi-layer environment host: `underlying` (back), default `main` content, `overlay` (front).
* Aligns with {@link SHELL_SLOT} from `boot/shell-slots` for cross-shell consistency.
*
* INVARIANT: Custom element constructor must NOT set attributes (incl. via `element.style`).
* Chromium throws `NotSupportedError: The result must not have attributes` on
* `document.createElement("env-shell-container")` if the constructor writes attrs.
* Host display/box-sizing live in `:host` SCSS instead.
*/
var ENV_SHELL_CONTAINER_TAG = "env-shell-container";
var template = document.createElement("template");
template.innerHTML = `
<div class="esc-stack" part="stack">
  <div class="esc-layer esc-underlying" part="underlying">
    <slot name="${SHELL_SLOT.underlying}"></slot>
  </div>
  <div class="esc-layer esc-main" part="main" data-shell-content role="main">
    <slot></slot>
  </div>
  <div
    class="esc-layer esc-overlays"
    part="overlays"
    data-shell-overlays
    data-env-shell-overlays
  >
    <slot name="${SHELL_SLOT.overlay}"></slot>
  </div>
</div>`;
var EnvironmentShellContainer = class extends HTMLElement {
	#ready = false;
	get overlayMount() {
		this.#ensureShadow();
		return this.shadowRoot?.querySelector("[data-shell-overlays]") ?? null;
	}
	constructor() {
		super();
		this.#ensureShadow();
	}
	connectedCallback() {
		this.#ensureShadow();
	}
	#ensureShadow() {
		if (this.#ready && this.shadowRoot) return;
		const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
		if (!root.querySelector(".esc-stack")) root.appendChild(template.content.cloneNode(true));
		if (root.adoptedStyleSheets.length === 0) {
			const sheet = new CSSStyleSheet();
			sheet.replaceSync(container_default);
			root.adoptedStyleSheets = [sheet];
		}
		this.#ready = true;
	}
};
var defined = false;
/** Registers `<env-shell-container>` once (open shadow, three named layers). */
function defineEnvironmentShellContainer() {
	if (!defined && !customElements.get("env-shell-container")) {
		customElements.define(ENV_SHELL_CONTAINER_TAG, EnvironmentShellContainer);
		defined = true;
	}
	return EnvironmentShellContainer;
}
/**
* Safe factory — prefers `new` after define so constructor attribute rules are explicit.
* Falls back to `createElement` once the CE is upgraded.
*/
function createEnvironmentShellContainer() {
	defineEnvironmentShellContainer();
	const Ctor = customElements.get(ENV_SHELL_CONTAINER_TAG);
	if (Ctor) try {
		return new Ctor();
	} catch (err) {
		console.warn("[env-shell-container] `new` failed, falling back to createElement", err);
	}
	return document.createElement(ENV_SHELL_CONTAINER_TAG);
}
function isEnvironmentShellContainerHost(el) {
	return el instanceof HTMLElement && el.localName === "env-shell-container";
}
//#endregion
//#region src/frontend/shells/environment/environment-overlay.ts
/**
* Stacking root for transient UI when the app has no `cw-shell-*` element (typical environment demo).
* Create once under e.g. `#app` / `.env-shell-root`; mount menus/modals as children (use pointer-events on children).
*/
var ENV_SHELL_OVERLAYS_ATTR = "data-env-shell-overlays";
/**
* WHY: Must beat `.env-shell-chrome` (`$z-shell-chrome` = 2147483000) so speed-dial /
* explorer context menus paint above the taskbar / mobile nav.
*/
var ENV_OVERLAY_Z = "2147483600";
function getOrCreateEnvironmentOverlayMount(host) {
	const sel = `[${ENV_SHELL_OVERLAYS_ATTR}]`;
	const existing = host.querySelector(sel);
	if (existing) {
		if (!existing.style.zIndex) existing.style.zIndex = ENV_OVERLAY_Z;
		if (!existing.style.position) existing.style.position = isEnvironmentShellContainerHost(host) ? "absolute" : "fixed";
		return existing;
	}
	const el = document.createElement("div");
	el.setAttribute(ENV_SHELL_OVERLAYS_ATTR, "");
	el.className = "env-shell-overlays";
	el.setAttribute("data-part", "env-overlays");
	if (isEnvironmentShellContainerHost(host)) {
		el.slot = SHELL_SLOT.overlay;
		el.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:${ENV_OVERLAY_Z};box-sizing:border-box;`;
		host.appendChild(el);
		return el;
	}
	el.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${ENV_OVERLAY_Z};box-sizing:border-box;`;
	host.appendChild(el);
	return el;
}
Object.freeze({
	w: 360,
	h: 240
});
function createChromeModel(title, seed = {}) {
	const { x = 48, y = 48, w = 640, h = 480, z = 10, demoRole } = seed;
	const mq = matchMedia("(max-width: 640px)");
	return {
		demoRole,
		title,
		bounds: {
			x: numberRef(x),
			y: numberRef(y),
			w: numberRef(w),
			h: numberRef(h)
		},
		z: numberRef(z),
		maximizedMobile: booleanRef(mq.matches),
		minimized: booleanRef(false),
		desktopMaximized: booleanRef(false),
		nativeMode: booleanRef(false),
		visible: booleanRef(true),
		isMobileMq: mq
	};
}
//#endregion
//#region src/frontend/shells/environment/window/views/markdown-view-window.ts
/**
* Contract for opening `views/markdown-view` (CwViewViewer) inside `mountWindowFrame`.
*
* - **`viewer`** — primary id (registry, IPC, demo `readerWindow` map key).
* - **`markdown`** (and related strings) — aliases; same module, same managed window row as `viewer`.
*
* Shells MUST collapse aliases via {@link normalizeMarkdownViewWindowId} before `Map` lookups / `focusWindow`.
*/
var MARKDOWN_VIEW_MANAGED_WINDOW_KEY = "viewer";
var ALIASES = /* @__PURE__ */ new Set([
	"markdown",
	"markdown-view",
	"markdown-viewer",
	"reader",
	"env-viewer"
]);
/**
* Strip legacy desktop typos, normalize markdown family → {@link MARKDOWN_VIEW_MANAGED_WINDOW_KEY};
* leave all other ids unchanged (`explorer`, `settings`, …).
*/
function normalizeMarkdownViewWindowId(raw) {
	let id = String(raw ?? "").trim().toLowerCase();
	id = id.replace(/^#/, "");
	const todo = /^todo:\s*(.*)$/i.exec(id);
	if (todo) id = String(todo[1] ?? "").trim().toLowerCase();
	id = id.replace(/\s+/g, "");
	if (!id) return "";
	if (id === "viewer" || ALIASES.has(id)) return MARKDOWN_VIEW_MANAGED_WINDOW_KEY;
	return id;
}
function isMarkdownViewManagedWindowKey(id) {
	return String(id || "").trim().toLowerCase() === MARKDOWN_VIEW_MANAGED_WINDOW_KEY;
}
//#endregion
//#region src/frontend/shells/environment/window/views/view-mount.ts
function isViewLike(x) {
	return Boolean(x && typeof x === "object" && typeof x.render === "function");
}
function runViewLifecycle(view, phase) {
	const fn = view?.lifecycle?.[phase];
	if (typeof fn === "function") Promise.resolve(fn());
}
/** `export default` is a `CustomElementConstructor` (e.g. markdown-view) — must use `new`. */
function isHTMLElementSubclassConstructor(value) {
	if (typeof value !== "function") return false;
	try {
		const proto = value.prototype;
		return Boolean(proto != null && typeof HTMLElement !== "undefined" && HTMLElement.prototype.isPrototypeOf(proto));
	} catch {
		return false;
	}
}
/**
* Factory result plus optional {@link View} instance so callers can run {@link ViewLifecycle}
* after the root node is connected (e.g. settings-view adopted stylesheets / shadow roots).
*/
function instantiateViewForMount(mod, options) {
	const d = mod.default ?? mod.createView ?? mod.createHomeView;
	if (!d || typeof d !== "function") throw new Error("window-frame view-mount: module has no default/createView factory");
	const instance = isHTMLElementSubclassConstructor(d) ? new d(options) : d(options);
	if (isViewLike(instance)) {
		const view = instance;
		const root = view.render(options);
		if (!(root instanceof HTMLElement)) throw new Error("window-frame view-mount: view.render() must return HTMLElement");
		return {
			root,
			view
		};
	}
	if (instance instanceof HTMLElement) return { root: instance };
	throw new Error("window-frame view-mount: factory did not return View or HTMLElement");
}
function mountViewIntoHost(host, root) {
	host.replaceChildren(root);
	return () => {
		root.remove();
		host.replaceChildren();
	};
}
/** Lazy-load e.g. `import('views/home-view')`, attach into frame body. */
async function mountViewModule(importer, host, options) {
	const mod = await importer();
	if (typeof requestAnimationFrame === "function") await new Promise((resolve) => requestAnimationFrame(() => resolve()));
	const { root, view } = instantiateViewForMount(mod, options);
	root.classList.add("wf-mounted-view");
	const disposeHost = mountViewIntoHost(host, root);
	runViewLifecycle(view, "onMount");
	runViewLifecycle(view, "onShow");
	return () => {
		runViewLifecycle(view, "onHide");
		runViewLifecycle(view, "onUnmount");
		disposeHost();
	};
}
//#endregion
//#region src/frontend/shells/environment/window/window/mount-ui-window.ts
/**
* WHY: Replaces `.wf-frame` / {@link mountWindowFrame} for environment-shell floating views.
* Keeps {@link WindowChromeModel} as the reactive bounds source; chrome is `ui-window`.
*
* INVARIANT: With `managed`, Windows2 only emits intents (`window-maximize` / `minimize` /
* `restore` / `close` / `window-native` / `window-exit-native`). This module applies attrs +
* geometry and notifies the tasking layer.
*/
function isNativeCapacitorShell$1() {
	try {
		if (document.documentElement.dataset.cwspNativeShell === "capacitor") return true;
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
}
var zBoostCache = null;
/** When mounted under `.env-shell-root`, add this boost so windows stack above the home layer. */
function readEnvWindowZBoost(host) {
	const shell = host?.closest?.(".env-shell-root") ?? host?.closest?.("env-shell-container");
	if (!(shell instanceof HTMLElement)) return 0;
	if (zBoostCache?.shell === shell) return zBoostCache.n;
	const raw = shell.style.getPropertyValue("--env-window-z-boost").trim() || getComputedStyle(shell).getPropertyValue("--env-window-z-boost").trim();
	const n = Number.parseInt(raw, 10);
	const val = Number.isFinite(n) ? n : 0;
	zBoostCache = {
		shell,
		n: val
	};
	return val;
}
function resolveEnvShellRoot(host) {
	const shell = host.closest?.(".env-shell-root") ?? host.closest?.("env-shell-container") ?? document.querySelector?.(".env-shell-root, env-shell-container");
	return shell instanceof HTMLElement ? shell : null;
}
/** Sync host `data-env-native-task` when any managed window is in nativeMode. */
function syncEnvNativeTaskAttr(host) {
	const root = resolveEnvShellRoot(host);
	if (!root) return;
	const anyNative = Boolean(root.querySelector?.("ui-window[native-mode], ui-window[data-native-active]"));
	root.toggleAttribute("data-env-native-task", anyNative);
}
/**
* Mounts a managed `<ui-window>` around `content`, wiring model bounds + chrome events.
*/
function mountUiWindow(host, model, content, onFocus, options = {}) {
	const { bounds, z, maximizedMobile, minimized, desktopMaximized, visible, isMobileMq } = model;
	if (!model.nativeMode) model.nativeMode = booleanRef(Boolean(options.startNative));
	const nativeMode = model.nativeMode;
	if (options.startNative) nativeMode.value = true;
	const win = document.createElement("ui-window");
	win.setAttribute("managed", "");
	win.className = "env-ui-window";
	win.setAttribute("part", "window");
	{
		const pinned = document.documentElement.getAttribute("data-theme") || document.documentElement.style.colorScheme || "";
		if (pinned === "light" || pinned === "dark") {
			win.dataset.theme = pinned;
			win.style.colorScheme = pinned;
		}
	}
	const titleEl = document.createElement("span");
	titleEl.slot = "title";
	titleEl.className = "env-ui-window__title";
	titleEl.textContent = model.title;
	content.slot = "content";
	content.classList.add("env-ui-window__body");
	win.append(titleEl, content);
	host.appendChild(win);
	const managedKey = String(options?.managedViewKey ?? "").trim();
	if (managedKey) {
		win.setAttribute("data-ui-window-view", managedKey);
		win.setAttribute("data-wf-managed-view", managedKey);
	}
	let savedDesktop = null;
	const notifyChrome = () => {
		options.onChromeChange?.();
		syncEnvNativeTaskAttr(host);
	};
	const clearDeskMaxInline = () => {
		win.style.right = "";
		win.style.bottom = "";
	};
	const applyDeskMaxGeometry = () => {
		win.style.left = "0";
		win.style.top = "0";
		win.style.right = "0";
		win.style.bottom = "var(--env-shell-chrome-stack-reserve, 2.5rem)";
		win.style.width = "auto";
		win.style.height = "auto";
		win.style.removeProperty("--ui-win-width");
		win.style.removeProperty("--ui-win-height");
	};
	const applyNativeGeometry = () => {
		win.style.left = "0";
		win.style.top = "0";
		win.style.right = "0";
		win.style.bottom = "0";
		win.style.width = "100%";
		win.style.height = "100%";
		win.style.removeProperty("--ui-win-width");
		win.style.removeProperty("--ui-win-height");
	};
	const applyChrome = () => {
		const mqMobile = Boolean(isMobileMq.matches);
		const zBoost = readEnvWindowZBoost(host);
		const zNow = (z.value ?? 10) + zBoost;
		win.style.zIndex = String(zNow);
		if (mqMobile) {
			if (desktopMaximized.value) desktopMaximized.value = false;
			if (!minimized.value && !nativeMode.value && !maximizedMobile.value) maximizedMobile.value = true;
		}
		const isNative = Boolean(nativeMode.value);
		const isMin = Boolean(minimized.value);
		const isDeskMax = !mqMobile && Boolean(desktopMaximized.value) && !isNative && !isMin;
		const isMobMax = mqMobile && !isNative && !isMin;
		const shellEl = host.closest?.(".env-shell-root") ?? host.closest?.("env-shell-container") ?? document.querySelector?.(".env-shell-root, env-shell-container");
		const statusOverlay = shellEl instanceof HTMLElement && shellEl.hasAttribute("data-status-overlay") || document.documentElement.hasAttribute("data-env-status-overlay");
		const standalone = shellEl instanceof HTMLElement && shellEl.hasAttribute("data-standalone") || document.documentElement.hasAttribute("data-env-standalone");
		const statusGap = statusOverlay && !isNative && !isMin && (isMobMax || isDeskMax);
		const nativeCapacitor = isNativeCapacitorShell$1();
		const noTitlebar = standalone && mqMobile && !isNative && !isMin || nativeCapacitor && mqMobile && !isNative && !isMin;
		win.toggleAttribute("native-mode", isNative && !isMin);
		win.toggleAttribute("minimized", isMin);
		win.toggleAttribute("data-mobile-max", isMobMax);
		win.toggleAttribute("data-desk-max", isDeskMax);
		win.toggleAttribute("data-status-gap", statusGap);
		win.toggleAttribute("data-no-titlebar", noTitlebar);
		win.toggleAttribute("maximized", !isMin && (isDeskMax || isMobMax || isNative));
		if (isMin) {
			win.setVisible(false);
			syncEnvNativeTaskAttr(host);
			return;
		}
		win.setVisible(Boolean(visible.value));
		if (!visible.value) {
			syncEnvNativeTaskAttr(host);
			return;
		}
		if (isNative) {
			applyNativeGeometry();
			syncEnvNativeTaskAttr(host);
			return;
		}
		if (isMobMax) {
			win.style.left = "0";
			win.style.top = "0";
			win.style.right = "0";
			win.style.bottom = "0";
			win.style.width = "100%";
			win.style.height = "auto";
			syncEnvNativeTaskAttr(host);
			return;
		}
		if (isDeskMax) {
			applyDeskMaxGeometry();
			syncEnvNativeTaskAttr(host);
			return;
		}
		clearDeskMaxInline();
		win.applyBounds({
			x: bounds.x.value,
			y: bounds.y.value,
			w: bounds.w.value,
			h: bounds.h.value,
			z: zNow
		});
		syncEnvNativeTaskAttr(host);
	};
	const onMq = () => {
		if (isMobileMq.matches) {
			if (!nativeMode.value) maximizedMobile.value = true;
			if (desktopMaximized.value) {
				desktopMaximized.value = false;
				if (savedDesktop) {
					bounds.x.value = savedDesktop.x;
					bounds.y.value = savedDesktop.y;
					bounds.w.value = savedDesktop.w;
					bounds.h.value = savedDesktop.h;
					savedDesktop = null;
				}
			}
		}
		applyChrome();
		notifyChrome();
	};
	if (isMobileMq.matches && !nativeMode.value && !minimized.value) maximizedMobile.value = true;
	const stopFx = effect(() => {
		applyChrome();
	}, [
		bounds.x,
		bounds.y,
		bounds.w,
		bounds.h,
		z,
		maximizedMobile,
		minimized,
		desktopMaximized,
		nativeMode,
		visible
	], { triggerImmediately: true });
	isMobileMq.addEventListener("change", onMq);
	const onChromeSurface = () => {
		applyChrome();
		notifyChrome();
	};
	const surfaceRoot = host.closest?.(".env-shell-root") ?? host.closest?.("env-shell-container") ?? document.documentElement;
	surfaceRoot?.addEventListener?.("env-chrome-surface", onChromeSurface);
	const onWinFocus = () => {
		if (minimized.value) {
			minimized.value = false;
			visible.value = true;
		}
		onFocus();
		const zBoost = readEnvWindowZBoost(host);
		const zNow = (z.value ?? 10) + zBoost;
		if (typeof win.bringToFront === "function") win.bringToFront(zNow);
		else {
			win.style.zIndex = String(zNow);
			win.toggleAttribute("data-focused", true);
		}
		notifyChrome();
	};
	const onWinMove = (ev) => {
		const detail = ev.detail;
		if (nativeMode.value || desktopMaximized.value || maximizedMobile.value || minimized.value) return;
		if (typeof detail?.x === "number") bounds.x.value = detail.x;
		if (typeof detail?.y === "number") bounds.y.value = detail.y;
	};
	const onWinResize = (ev) => {
		const detail = ev.detail;
		if (nativeMode.value || desktopMaximized.value || maximizedMobile.value || minimized.value) return;
		if (typeof detail?.w === "number") bounds.w.value = detail.w;
		if (typeof detail?.h === "number") bounds.h.value = detail.h;
	};
	const onWinMinimize = () => {
		if (nativeMode.value) nativeMode.value = false;
		if (desktopMaximized.value) {
			desktopMaximized.value = false;
			if (savedDesktop) {
				bounds.x.value = savedDesktop.x;
				bounds.y.value = savedDesktop.y;
				bounds.w.value = savedDesktop.w;
				bounds.h.value = savedDesktop.h;
				savedDesktop = null;
			}
		}
		minimized.value = true;
		applyChrome();
		notifyChrome();
	};
	const onWinMaximize = () => {
		if (nativeMode.value) {
			onWinExitNative();
			return;
		}
		if (isMobileMq.matches) {
			minimized.value = false;
			maximizedMobile.value = true;
			applyChrome();
			notifyChrome();
			return;
		}
		if (minimized.value) minimized.value = false;
		if (desktopMaximized.value) {
			onWinRestore();
			return;
		}
		savedDesktop = {
			x: bounds.x.value,
			y: bounds.y.value,
			w: bounds.w.value,
			h: bounds.h.value
		};
		desktopMaximized.value = true;
		applyChrome();
		notifyChrome();
	};
	const onWinNative = () => {
		if (minimized.value) {
			minimized.value = false;
			visible.value = true;
		}
		if (!nativeMode.value && !desktopMaximized.value && !maximizedMobile.value) savedDesktop = {
			x: bounds.x.value,
			y: bounds.y.value,
			w: bounds.w.value,
			h: bounds.h.value
		};
		desktopMaximized.value = false;
		maximizedMobile.value = false;
		nativeMode.value = true;
		applyChrome();
		notifyChrome();
	};
	const onWinExitNative = () => {
		if (!nativeMode.value) return;
		nativeMode.value = false;
		if (savedDesktop) {
			bounds.x.value = savedDesktop.x;
			bounds.y.value = savedDesktop.y;
			bounds.w.value = savedDesktop.w;
			bounds.h.value = savedDesktop.h;
			savedDesktop = null;
		}
		if (isMobileMq.matches) maximizedMobile.value = true;
		applyChrome();
		notifyChrome();
	};
	const onWinRestore = () => {
		if (nativeMode.value) {
			onWinExitNative();
			return;
		}
		if (minimized.value) {
			minimized.value = false;
			visible.value = true;
		}
		if (isMobileMq.matches) {
			if (maximizedMobile.value) maximizedMobile.value = false;
		} else if (desktopMaximized.value) {
			desktopMaximized.value = false;
			if (savedDesktop) {
				bounds.x.value = savedDesktop.x;
				bounds.y.value = savedDesktop.y;
				bounds.w.value = savedDesktop.w;
				bounds.h.value = savedDesktop.h;
				savedDesktop = null;
			}
		}
		applyChrome();
		notifyChrome();
	};
	let closing = false;
	let disposed = false;
	const onWinClose = (ev) => {
		ev.preventDefault();
		if (closing || disposed) return;
		closing = true;
		try {
			if (nativeMode.value) nativeMode.value = false;
			visible.value = false;
			options.onClose?.();
		} catch (err) {
			console.error("[mount-ui-window] onClose failed", err);
		} finally {
			if (!disposed) {
				disposed = true;
				stopFx?.();
				isMobileMq.removeEventListener("change", onMq);
				surfaceRoot?.removeEventListener?.("env-chrome-surface", onChromeSurface);
				try {
					if (win.isConnected) win.remove();
				} catch {}
			}
			syncEnvNativeTaskAttr(host);
		}
	};
	/**
	* WHY: Dual-path chrome. Windows2 owns primary handlers; shell also stamps shadow
	* button properties and keeps a host bubble fallback so desk max/min/close cannot die
	* when lure replaces shadow nodes or click synthesis fails.
	*/
	let lastShellChromeAt = 0;
	const consumeShellChrome = () => {
		const now = typeof performance !== "undefined" ? performance.now() : Date.now();
		if (now - lastShellChromeAt < 280) return false;
		lastShellChromeAt = now;
		return true;
	};
	const runShellChrome = (which) => {
		if (closing || disposed) return;
		if (!consumeShellChrome()) return;
		if (which === "close") {
			onWinClose(new Event("window-close", { cancelable: true }));
			return;
		}
		if (which === "exit-native") {
			onWinExitNative();
			return;
		}
		if (which === "maximize") {
			if (nativeMode.value || desktopMaximized.value || maximizedMobile.value) onWinRestore();
			else onWinMaximize();
			return;
		}
		if (minimized.value) onWinRestore();
		else onWinMinimize();
	};
	const hitTitleControl = (ev) => {
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		for (const n of path) {
			if (!(n instanceof Element)) continue;
			const action = n.getAttribute?.("data-ui-win-action");
			if (action === "close" || action === "exit-native" || action === "maximize" || action === "minimize") return action;
			if (n.matches?.(".title-close")) return "close";
			if (n.matches?.(".title-exit-native")) return "exit-native";
			if (n.matches?.(".title-maximize")) return "maximize";
			if (n.matches?.(".title-minimize")) return "minimize";
		}
		return null;
	};
	const onHostControlBubble = (ev) => {
		if (closing || disposed) return;
		if (ev.defaultPrevented) return;
		const which = hitTitleControl(ev);
		if (!which) return;
		ev.preventDefault();
		ev.stopPropagation();
		runShellChrome(which);
	};
	/** Nuclear path: bind live shadow buttons from the shell (open shadow). */
	let chromeMo = null;
	const stampShellButtonHandlers = () => {
		const root = win.shadowRoot;
		if (!root || closing || disposed) return;
		const nodes = root.querySelectorAll("[data-ui-win-action], .title-minimize, .title-maximize, .title-close, .title-exit-native");
		for (const btn of nodes) {
			let which = btn.getAttribute("data-ui-win-action");
			if (!which) {
				if (btn.classList.contains("title-close")) which = "close";
				else if (btn.classList.contains("title-exit-native")) which = "exit-native";
				else if (btn.classList.contains("title-maximize")) which = "maximize";
				else if (btn.classList.contains("title-minimize")) which = "minimize";
			}
			if (!which) continue;
			btn.setAttribute("data-ui-win-action", which);
			const action = which;
			const run = (ev) => {
				if (ev.defaultPrevented) return;
				ev.preventDefault();
				ev.stopPropagation();
				runShellChrome(action);
			};
			btn.onclick = run;
			btn.onpointerup = (ev) => {
				if (ev.button !== 0) return;
				run(ev);
			};
		}
	};
	stampShellButtonHandlers();
	queueMicrotask(stampShellButtonHandlers);
	requestAnimationFrame(stampShellButtonHandlers);
	if (typeof MutationObserver !== "undefined") {
		chromeMo = new MutationObserver(() => stampShellButtonHandlers());
		const observeRoot = () => {
			if (win.shadowRoot) chromeMo?.observe(win.shadowRoot, {
				childList: true,
				subtree: true
			});
			else requestAnimationFrame(observeRoot);
		};
		observeRoot();
	}
	win.addEventListener("window-focus", onWinFocus);
	win.addEventListener("window-move", onWinMove);
	win.addEventListener("window-resize", onWinResize);
	win.addEventListener("window-minimize", onWinMinimize);
	win.addEventListener("window-maximize", onWinMaximize);
	win.addEventListener("window-restore", onWinRestore);
	win.addEventListener("window-native", onWinNative);
	win.addEventListener("window-exit-native", onWinExitNative);
	win.addEventListener("window-close", onWinClose);
	win.addEventListener("click", onHostControlBubble);
	win.addEventListener("pointerup", onHostControlBubble);
	return () => {
		if (disposed) return;
		disposed = true;
		closing = true;
		stopFx?.();
		chromeMo?.disconnect();
		chromeMo = null;
		isMobileMq.removeEventListener("change", onMq);
		surfaceRoot?.removeEventListener?.("env-chrome-surface", onChromeSurface);
		win.removeEventListener("window-focus", onWinFocus);
		win.removeEventListener("window-move", onWinMove);
		win.removeEventListener("window-resize", onWinResize);
		win.removeEventListener("window-minimize", onWinMinimize);
		win.removeEventListener("window-maximize", onWinMaximize);
		win.removeEventListener("window-restore", onWinRestore);
		win.removeEventListener("window-native", onWinNative);
		win.removeEventListener("window-exit-native", onWinExitNative);
		win.removeEventListener("window-close", onWinClose);
		win.removeEventListener("click", onHostControlBubble);
		win.removeEventListener("pointerup", onHostControlBubble);
		try {
			if (nativeMode.value) nativeMode.value = false;
			if (win.isConnected) win.remove();
		} catch {}
		syncEnvNativeTaskAttr(host);
	};
}
//#endregion
//#region src/frontend/shells/environment/workspace-window-layer.ts
/** Direct-child managed window tagged via {@link mountUiWindow}'s `managedViewKey`. */
function findKeyedFrame(workspace, key) {
	const selKey = typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(key) : key.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
	const el = workspace.querySelector(`:scope > ui-window[data-ui-window-view="${selKey}"]`) || workspace.querySelector(`:scope > ui-window[data-wf-managed-view="${selKey}"]`) || workspace.querySelector(`:scope > section.wf-frame[data-wf-managed-view="${selKey}"]`);
	return el instanceof HTMLElement ? el : null;
}
var VIEW_ICONS = {
	home: "house",
	viewer: "article",
	markdown: "article",
	browser: "globe",
	web: "globe",
	explorer: "books",
	settings: "gear-six",
	apps: "squares-four",
	workcenter: "briefcase",
	history: "clock-counter-clockwise",
	editor: "pencil-simple-line",
	network: "wifi-high",
	task: "list-checks",
	event: "calendar",
	bonus: "gift",
	person: "address-book"
};
var VIEW_TITLES = {
	home: "Home",
	viewer: "Markdown",
	browser: "Browser",
	web: "Browser",
	explorer: "Explorer",
	settings: "Settings",
	apps: "Apps",
	workcenter: "Work Center",
	history: "History",
	editor: "Editor",
	network: "Network",
	task: "Plan",
	event: "Events",
	bonus: "Bonuses",
	person: "Contacts"
};
/** Stable managed-window key so each URL can have its own floating frame. */
function browserWindowKey(url) {
	const href = String(url || "").trim();
	if (!href) return "browser";
	let h = 2166136261;
	for (let i = 0; i < href.length; i++) {
		h ^= href.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return `browser:${(h >>> 0).toString(36)}`;
}
function browserTitleFromUrl(url) {
	try {
		return new URL(url).hostname.replace(/^www\./i, "") || "Browser";
	} catch {
		return "Browser";
	}
}
function normalizeBrowserViewId(raw) {
	const id = String(raw || "").trim().toLowerCase();
	if (id === "browser" || id === "web" || id === "iframe" || id === "web-view" || id === "webview") return "browser";
	return id;
}
function iconForManagedKey(key) {
	const id = String(key || "").trim().toLowerCase();
	if (VIEW_ICONS[id]) return VIEW_ICONS[id];
	if (id.startsWith("browser:")) return VIEW_ICONS.browser;
	return "app-window";
}
/**
* Package-local defaults intentionally empty except built-in browser iframe view.
* WHY: relative `../../../views/*-view` imports break when this file is consumed via
* CWSP-shell's symlink (`src/frontend/shells/environment` → modules). Hosts must pass
* {@link WorkspaceWindowLayerOptions.viewLoaders} (CWSP adapter / demo boot).
*/
function defaultViewLoaderForId(viewId) {
	if (normalizeBrowserViewId(viewId) === "browser") return () => import("../shells/environment-window-views-browser-view.js");
	return null;
}
function readOpenViewExternalUrl(opts) {
	if (!opts || typeof opts !== "object") return "";
	const o = opts;
	const nested = o.params && typeof o.params === "object" && !Array.isArray(o.params) ? o.params : {};
	return String(nested.url || nested.href || nested.src || o.url || o.href || o.src || "").trim();
}
function titleForView(viewId, overrides) {
	const id = normalizeMarkdownViewWindowId(viewId) || String(viewId || "").trim().toLowerCase();
	const base = id.startsWith("browser:") ? "browser" : id;
	if (overrides?.[id]) return overrides[id];
	if (overrides?.[base]) return overrides[base];
	if (VIEW_TITLES[base]) return VIEW_TITLES[base];
	const raw = String(viewId || "").trim();
	return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "View";
}
function placeholderBody(viewId, overrides) {
	const wrap = document.createElement("div");
	wrap.className = "wf-view-placeholder";
	wrap.setAttribute("part", "placeholder");
	wrap.innerHTML = `<p class="wf-view-placeholder__title">${titleForView(viewId, overrides)}</p>
<p class="wf-view-placeholder__hint">No window module is registered for this shortcut in environment-shell yet.</p>`;
	return wrap;
}
/**
* Shell helpers: open registered views in `ui-window` overlays, keep `home` as a workspace underlay.
*/
function createWorkspaceWindowLayer(workspace, options = {}) {
	const topZ = numberRef(120);
	const managed = /* @__PURE__ */ new Map();
	let disposed = false;
	let focusedKey = null;
	readEnvWindowZBoost(workspace);
	let taskingRaf = 0;
	const emitTasking = () => {
		if (disposed) return;
		if (taskingRaf) return;
		taskingRaf = requestAnimationFrame(() => {
			taskingRaf = 0;
			if (!disposed) options.onTaskingChange?.(listWindowTasks());
		});
	};
	const listWindowTasks = () => {
		const out = [];
		for (const m of managed.values()) {
			if (!findKeyedFrame(workspace, m.key)) continue;
			out.push({
				id: m.key,
				title: m.model.title || titleForView(m.key, options.viewTitles),
				icon: iconForManagedKey(m.key),
				focused: focusedKey === m.key,
				minimized: Boolean(m.model.minimized.value),
				visible: Boolean(m.model.visible.value)
			});
		}
		return out;
	};
	const clearFocusedAttrs = () => {
		for (const m of managed.values()) {
			const frame = findKeyedFrame(workspace, m.key);
			if (!frame) continue;
			frame.toggleAttribute("data-focused", false);
			const clear = frame.clearFocused;
			if (typeof clear === "function") clear.call(frame);
		}
	};
	const exitNativeExcept = (keepKey) => {
		for (const [k, m] of managed) {
			if (keepKey && k === keepKey) continue;
			if (m.model.nativeMode?.value) m.model.nativeMode.value = false;
		}
	};
	const elevateModel = (model, key) => {
		if (focusedKey === key && !model.minimized.value) {
			const frame = findKeyedFrame(workspace, key);
			if (frame && frame === workspace.lastElementChild) return;
		}
		topZ.value += 1;
		model.z.value = topZ.value;
		model.minimized.value = false;
		model.visible.value = true;
		focusedKey = key;
		if (model.nativeMode?.value) exitNativeExcept(key);
		const frame = findKeyedFrame(workspace, key);
		if (frame) {
			const zBoost = readEnvWindowZBoost(workspace);
			const zNow = (model.z.value ?? 10) + zBoost;
			clearFocusedAttrs();
			frame.style.zIndex = String(zNow);
			frame.toggleAttribute("data-focused", true);
			const bring = frame.bringToFront;
			if (typeof bring === "function") bring.call(frame, zNow);
			if (frame.parentElement === workspace && frame !== workspace.lastElementChild) workspace.appendChild(frame);
		}
		emitTasking();
	};
	const shellContext = { showMessage: (msg) => {
		console.log(`[environment] ${typeof msg === "string" ? msg : String(msg ?? "")}`);
	} };
	const envOverlayMount = options.overlayMountHost ? getOrCreateEnvironmentOverlayMount(options.overlayMountHost) : null;
	shellContext.resolveOverlayMountPoint = (anchor) => {
		if (envOverlayMount) return envOverlayMount;
		if (options.environmentShellHost) {
			const fromShell = resolveShellOverlaysMount(options.environmentShellHost);
			if (fromShell) return fromShell;
		}
		return resolveOverlayMountPoint(anchor ?? null);
	};
	const viewLoaderForId = (viewId) => {
		const id = normalizeBrowserViewId(normalizeMarkdownViewWindowId(viewId) || String(viewId || "").trim().toLowerCase());
		const fromHost = options.viewLoaders?.[id];
		if (fromHost) return fromHost;
		return defaultViewLoaderForId(id);
	};
	const openReaderWindow = () => {
		const rw = options.readerWindow;
		if (!rw?.content) return;
		const key = MARKDOWN_VIEW_MANAGED_WINDOW_KEY;
		const ex = managed.get(key);
		if (ex && findKeyedFrame(workspace, key)) {
			elevateModel(ex.model, key);
			return;
		}
		if (ex && !findKeyedFrame(workspace, key)) {
			managed.delete(key);
			try {
				ex.disposeFrame();
			} catch {}
		}
		const seed = rw.seed || {};
		const model = createChromeModel(rw.title || titleForView(key, options.viewTitles), {
			x: seed.x ?? 96,
			y: seed.y ?? 96,
			w: seed.w ?? 420,
			h: seed.h ?? 340,
			z: seed.z ?? topZ.value + 1
		});
		topZ.value = model.z.value;
		let disposeFrame = () => {};
		disposeFrame = mountUiWindow(workspace, model, rw.content, () => elevateModel(model, key), {
			managedViewKey: key,
			onChromeChange: emitTasking,
			onClose: () => {
				const m = managed.get(key);
				if (!m) return;
				managed.delete(key);
				if (focusedKey === key) focusedKey = null;
				try {
					m.disposeFrame();
				} catch {}
				emitTasking();
			}
		});
		managed.set(key, {
			key,
			model,
			disposeFrame
		});
		elevateModel(model, key);
	};
	const openViewWindow = (viewId, opts) => {
		if (disposed) return;
		let id = normalizeMarkdownViewWindowId(String(viewId || "").trim());
		id = normalizeBrowserViewId(id);
		if (!id || id === "home") return;
		if (id === "airpad") return;
		try {
			const native = document.documentElement.dataset.cwspNativeShell === "capacitor" || Boolean(globalThis.Capacitor?.isNativePlatform?.());
			if (document.documentElement.dataset.cwspSku === "launcher" && native) {
				tryLaunchSiblingView(id).then((launched) => {
					if (!launched) openViewWindowContinue(id, opts);
				});
				return;
			}
		} catch {}
		openViewWindowContinue(id, opts);
	};
	const openViewWindowContinue = (id, opts) => {
		if (disposed) return;
		const params = { ...opts?.params || {} };
		const externalUrl = readOpenViewExternalUrl(opts);
		if (externalUrl) {
			params.url = externalUrl;
			params.href = externalUrl;
		}
		const managedKey = id === "browser" ? String(params.windowKey || "").trim() || browserWindowKey(externalUrl) : id;
		if (isMarkdownViewManagedWindowKey(id) && options.readerWindow?.content) {
			openReaderWindow();
			return;
		}
		const wantNative = new Set((options.startNativeViewIds || []).map((v) => normalizeMarkdownViewWindowId(String(v || "")))).has(id) || String(opts?.native || "") === "1" || String(params.native || "") === "1";
		const existing = managed.get(managedKey);
		if (existing && findKeyedFrame(workspace, managedKey)) {
			elevateModel(existing.model, managedKey);
			if (wantNative && existing.model.nativeMode) {
				existing.model.nativeMode.value = true;
				existing.model.minimized.value = false;
				existing.model.visible.value = true;
				exitNativeExcept(managedKey);
			}
			if (isMarkdownViewManagedWindowKey(id)) {
				const src = String(params.src || params.source || params.path || "").trim();
				const filename = String(params.filename || params.name || "").trim();
				const content = String(params.content || "");
				if (src || content.trim()) try {
					globalThis.dispatchEvent(new CustomEvent("cwsp:document-open", { detail: {
						src,
						filename,
						content
					} }));
				} catch {}
			}
			if (id === "browser" && externalUrl) try {
				const frame = findKeyedFrame(workspace, managedKey);
				const iframe = frame?.querySelector?.("iframe.wf-browser__frame");
				const input = frame?.querySelector?.("input.wf-browser__url");
				if (iframe && iframe.src !== externalUrl) iframe.src = externalUrl;
				if (input) input.value = externalUrl;
				if (externalUrl) try {
					existing.model.title = browserTitleFromUrl(externalUrl);
				} catch {}
			} catch {}
			return;
		}
		if (existing && !findKeyedFrame(workspace, managedKey)) {
			existing.disposeView?.();
			managed.delete(managedKey);
			try {
				existing.disposeFrame();
			} catch {}
		}
		const loader = viewLoaderForId(id);
		const body = document.createElement("div");
		body.className = "wf-view-host env-ui-window__view-host";
		body.setAttribute("part", "view-host");
		{
			const loading = document.createElement("p");
			loading.className = "wf-view-placeholder__hint";
			loading.style.cssText = "margin:1rem;font:400 .9rem/1.4 system-ui,sans-serif;opacity:.8";
			loading.textContent = `Loading ${titleForView(id, options.viewTitles)}…`;
			body.append(loading);
		}
		const offset = managed.size * 24;
		const model = createChromeModel(id === "browser" && externalUrl ? browserTitleFromUrl(externalUrl) : titleForView(id, options.viewTitles), {
			x: 72 + offset,
			y: 72 + offset,
			w: id === "browser" ? 720 : 640,
			h: id === "browser" ? 520 : 480,
			z: topZ.value + 1
		});
		topZ.value = model.z.value;
		let disposeFrame = () => {};
		disposeFrame = mountUiWindow(workspace, model, body, () => elevateModel(model, managedKey), {
			managedViewKey: managedKey,
			startNative: wantNative,
			onChromeChange: emitTasking,
			onClose: () => {
				const m = managed.get(managedKey);
				if (!m) return;
				managed.delete(managedKey);
				if (focusedKey === managedKey) focusedKey = null;
				try {
					m.disposeView?.();
				} catch {}
				try {
					m.disposeFrame();
				} catch {}
				emitTasking();
			}
		});
		if (wantNative) {
			model.nativeMode.value = true;
			exitNativeExcept(managedKey);
		}
		const rec = {
			key: managedKey,
			model,
			disposeFrame,
			disposeView: void 0
		};
		managed.set(managedKey, rec);
		elevateModel(model, managedKey);
		const mountOpts = {
			...opts || {},
			shellContext
		};
		if (id === "browser" && externalUrl) mountOpts.params = {
			...mountOpts.params || {},
			url: externalUrl,
			href: externalUrl
		};
		else if (externalUrl && !(mountOpts.params && (mountOpts.params.url || mountOpts.params.href))) mountOpts.params = {
			...mountOpts.params || {},
			url: externalUrl,
			href: externalUrl
		};
		if (!loader) {
			body.replaceChildren(placeholderBody(id, options.viewTitles));
			return;
		}
		mountViewModule(loader, body, mountOpts).then((unmountView) => {
			if (disposed) {
				unmountView();
				return;
			}
			const cur = managed.get(managedKey);
			if (cur) cur.disposeView = unmountView;
			if (wantNative || model.nativeMode?.value) {
				model.nativeMode.value = true;
				model.minimized.value = false;
				model.visible.value = true;
				exitNativeExcept(managedKey);
				elevateModel(model, managedKey);
			}
		}, (err) => {
			console.error(`[workspace-window-layer] mountViewModule failed for view "${id}"`, err);
			body.replaceChildren(placeholderBody(id, options.viewTitles));
		});
	};
	shellContext.navigate = (viewId, opts) => {
		openViewWindow(String(viewId), opts);
	};
	shellContext.openView = (viewId, opts) => {
		openViewWindow(String(viewId), opts);
	};
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		if (taskingRaf) {
			cancelAnimationFrame(taskingRaf);
			taskingRaf = 0;
		}
		for (const m of managed.values()) {
			m.disposeView?.();
			m.disposeFrame();
		}
		managed.clear();
		focusedKey = null;
		emitTasking();
	};
	const focusWindow = (viewId) => {
		const id = normalizeMarkdownViewWindowId(String(viewId || ""));
		const m = managed.get(id);
		if (!m || !findKeyedFrame(workspace, id)) return false;
		elevateModel(m.model, id);
		return true;
	};
	const minimizeWindow = (viewId) => {
		const id = normalizeMarkdownViewWindowId(String(viewId || ""));
		const m = managed.get(id);
		if (!m || !findKeyedFrame(workspace, id)) return false;
		if (m.model.nativeMode?.value) m.model.nativeMode.value = false;
		if (m.model.desktopMaximized?.value) m.model.desktopMaximized.value = false;
		m.model.visible.value = true;
		m.model.minimized.value = true;
		if (focusedKey === id) {
			focusedKey = null;
			clearFocusedAttrs();
		}
		emitTasking();
		return true;
	};
	/** Collapse all floating views so the launcher shows — apps stay in the switcher. */
	const minimizeAllWindows = () => {
		if (disposed) return;
		exitNativeExcept(null);
		focusedKey = null;
		clearFocusedAttrs();
		for (const m of managed.values()) {
			if (!findKeyedFrame(workspace, m.key)) continue;
			if (m.model.desktopMaximized?.value) m.model.desktopMaximized.value = false;
			m.model.visible.value = true;
			m.model.minimized.value = true;
		}
		emitTasking();
	};
	const closeWindow = (viewId) => {
		const id = normalizeMarkdownViewWindowId(String(viewId || ""));
		const m = managed.get(id);
		if (!m) return false;
		managed.delete(id);
		if (focusedKey === id) focusedKey = null;
		try {
			m.disposeView?.();
		} catch {}
		try {
			m.disposeFrame();
		} catch {}
		emitTasking();
		return true;
	};
	const blurWindows = () => {
		exitNativeExcept(null);
		focusedKey = null;
		clearFocusedAttrs();
		emitTasking();
	};
	/**
	* WHY: Mobile Home replaces title Close — dispose all floating views so the
	* launcher is visible again under always-maximized windows.
	*/
	const closeAllWindows = () => {
		if (disposed) return;
		exitNativeExcept(null);
		for (const m of [...managed.values()]) {
			try {
				m.disposeView?.();
			} catch {}
			try {
				m.disposeFrame();
			} catch {}
		}
		managed.clear();
		focusedKey = null;
		emitTasking();
	};
	const enterNative = (viewId) => {
		const id = normalizeMarkdownViewWindowId(String(viewId || ""));
		const m = managed.get(id);
		if (!m || !findKeyedFrame(workspace, id)) return false;
		exitNativeExcept(id);
		m.model.nativeMode.value = true;
		m.model.minimized.value = false;
		m.model.visible.value = true;
		elevateModel(m.model, id);
		return true;
	};
	const exitNative = (viewId) => {
		if (viewId) {
			const id = normalizeMarkdownViewWindowId(String(viewId || ""));
			const m = managed.get(id);
			if (m?.model.nativeMode) m.model.nativeMode.value = false;
			emitTasking();
			return;
		}
		exitNativeExcept(null);
		emitTasking();
	};
	return {
		shellContext,
		dispose,
		focusWindow,
		minimizeWindow,
		minimizeAllWindows,
		closeWindow,
		blurWindows,
		closeAllWindows,
		enterNative,
		exitNative,
		listWindowTasks,
		getFocusedKey: () => focusedKey
	};
}
//#endregion
//#region src/frontend/shells/environment/index.ts
/**
* environment-shell — public entry for host apps: status bar, taskbar, wallpaper helpers.
*
* Import this module (or `environment-shell`) to register FL-UI `ui-statusbar` / `ui-taskbar`
* via the re-exported component modules, then call {@link mountEnvironmentChrome} or mount pieces a la carte.
*/
/** Default `localStorage` key for {@link initializeAppCanvasLayer} wallpaper URL (`fest/image` Canvas-2). */
var ENV_SHELL_WALLPAPER_STORAGE_KEY = "rs-wallpaper-image";
/**
* If no wallpaper URL is stored yet, set `defaultUrl` (idempotent, swallows storage errors).
* Call before `initializeAppCanvasLayer` when embedding the stock/demo background.
*/
function seedEnvironmentWallpaperIfUnset(defaultUrl, storageKey = ENV_SHELL_WALLPAPER_STORAGE_KEY) {
	try {
		if (!localStorage.getItem(storageKey)) localStorage.setItem(storageKey, defaultUrl);
	} catch {}
}
/**
* One-call chrome mount: shared {@link ShellDeviceStatus}, `ui-statusbar`, optional `ui-taskbar` + tasking tray.
* Appends a `.env-shell-chrome` node to `host` (import `environment-shell/scss/main.scss` or the partials you need).
*/
function mountEnvironmentChrome(host, options) {
	const device = attachShellDeviceStatus();
	const nativeCapacitor = isNativeCapacitorHost();
	if (nativeCapacitor) installCapacitorNativeSafeAreaInsets();
	let statusBar;
	let disposeStatusBar;
	if (nativeCapacitor) {
		statusBar = document.createElement("ui-statusbar");
		statusBar.className = "env-ui-statusbar";
		statusBar.hidden = true;
		disposeStatusBar = () => {
			statusBar.remove();
		};
	} else {
		const mounted = mountEnvironmentStatusBar(options.shell, options.introHtml, device);
		statusBar = mounted.element;
		disposeStatusBar = mounted.dispose;
	}
	const root = document.createElement("div");
	root.className = "env-shell-chrome wf-chrome-no-select";
	let taskbar;
	if (options.taskbar) {
		try {
			const bookmarksApi = createChromeBookmarksMenuApi();
			if (bookmarksApi) setBookmarksMenuApi(bookmarksApi);
		} catch {}
		taskbar = mountEnvironmentTaskBar({
			...options.taskbar,
			device
		});
		root.append(taskbar.element, statusBar);
	} else root.append(statusBar);
	const shellRoot = (host.classList?.contains("env-shell-root") ? host : null) || host.closest?.(".env-shell-root") || host.closest?.("env-shell-container") || host;
	setChromeFlyoutShellHost(shellRoot);
	globalThis.__ENV_OVERLAY_MOUNT__ = getOrCreateEnvironmentOverlayMount;
	getOrCreateEnvironmentOverlayMount(shellRoot);
	restoreQuickFilters();
	const desktopMq = typeof matchMedia === "function" ? matchMedia("(min-width: 641px) and (not ((pointer: coarse) or (hover: none)))") : null;
	const displayMqs = typeof matchMedia === "function" ? [
		"(display-mode: standalone)",
		"(display-mode: fullscreen)",
		"(display-mode: minimal-ui)",
		"(display-mode: browser)",
		"(display-mode: window-controls-overlay)"
	].map((q) => matchMedia(q)) : [];
	const syncChromeSurface = () => {
		const desktop = desktopMq ? desktopMq.matches : true;
		const displayMode = matchShellDisplayMode();
		const standalone = isShellStandaloneDisplay();
		const statusOverlay = shouldShowStatusOverlay({
			desktop,
			standalone,
			displayMode
		});
		root.toggleAttribute("data-desktop", desktop);
		root.toggleAttribute("data-standalone", standalone);
		root.toggleAttribute("data-status-overlay", statusOverlay);
		root.dataset.chromeLayout = desktop ? "desktop" : "mobile";
		root.dataset.displayMode = displayMode;
		shellRoot.toggleAttribute("data-standalone", standalone);
		shellRoot.toggleAttribute("data-status-overlay", statusOverlay);
		shellRoot.dataset.displayMode = displayMode;
		shellRoot.style.setProperty("--env-status-inset-top", statusOverlay ? "max(2rem, env(safe-area-inset-top, 0px))" : "0px");
		document.documentElement.toggleAttribute("data-env-status-overlay", statusOverlay);
		document.documentElement.toggleAttribute("data-env-standalone", standalone);
		try {
			shellRoot.dispatchEvent(new CustomEvent("env-chrome-surface", {
				bubbles: true,
				detail: {
					statusOverlay,
					standalone,
					displayMode,
					desktop
				}
			}));
		} catch {}
	};
	syncChromeSurface();
	desktopMq?.addEventListener?.("change", syncChromeSurface);
	for (const mq of displayMqs) mq.addEventListener?.("change", syncChromeSurface);
	document.addEventListener("fullscreenchange", syncChromeSurface);
	document.addEventListener("webkitfullscreenchange", syncChromeSurface);
	const disposeContrast = nativeCapacitor ? () => {} : attachStatusBarContrast(shellRoot);
	if (isEnvironmentShellContainerHost(host)) root.slot = SHELL_SLOT.overlay;
	host.appendChild(root);
	return {
		root,
		device,
		statusBar,
		taskbar,
		disposeDevice: () => {
			desktopMq?.removeEventListener?.("change", syncChromeSurface);
			for (const mq of displayMqs) mq.removeEventListener?.("change", syncChromeSurface);
			document.removeEventListener("fullscreenchange", syncChromeSurface);
			document.removeEventListener("webkitfullscreenchange", syncChromeSurface);
			disposeContrast();
			disposeStatusBar();
			device.dispose();
			setChromeFlyoutShellHost(null);
		}
	};
}
//#endregion
//#region src/routing/native/launcher-home-lifecycle.ts
var HOOKS_BOOT = "__CWSP_LAUNCHER_HOME_HOOKS_V1__";
var hookSlot = () => {
	const g = globalThis;
	return {
		get: () => HOOKS_BOOT in g ? g[HOOKS_BOOT] : null,
		set: (v) => {
			g[HOOKS_BOOT] = v;
		}
	};
};
function registerLauncherHomeLifecycleHooks(hooks) {
	hookSlot().set(hooks);
}
//#endregion
//#region ../../modules/shells/window-frame/public/demo/wf-demo.css?inline
var wf_demo_default = "*,:after,:before{box-sizing:border-box}@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color>{--i:clamp(0, var(--index), 1000);--pivot:550;--white-distance:clamp(0, calc((var(--pivot) - var(--i)) / var(--pivot)), 1);--black-distance:clamp(0, calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))), 1);--to-white:pow(var(--white-distance), 1.15);--to-black:pow(var(--black-distance), 1.08);--center-left:clamp(0, calc(var(--i) / var(--pivot)), 1);--center-right:clamp(0, calc((1000 - var(--i)) / (1000 - var(--pivot))), 1);--chroma-shape:sqrt(min(var(--center-left), var(--center-right)));--chroma-scale:calc(0.08 + 0.92 * var(--chroma-shape));result:oklch(from var(--base-color) calc(l + (.985 - l) * var(--to-white) + (.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h)}.wf-demo-root{isolation:isolate;min-block-size:100dvb;--wf-md-primary:var(--color-primary, #5a7fff);--base-color:var(--color-primary, var(--wf-md-primary));--wf-md-on-primary:--u2-color-mod(var(--wf-md-primary), 920);--wf-md-surface:--u2-color-mod(var(--wf-md-primary), 940);--wf-md-surf-container-low:--u2-color-mod(var(--wf-md-primary), 900);--wf-md-surf-container:--u2-color-mod(var(--wf-md-primary), 860);--wf-md-surf-container-high:--u2-color-mod(var(--wf-md-primary), 820);--wf-md-outline-variant:color-mix(in oklab, --u2-color-mod(var(--wf-md-primary), 100) 12%, transparent);--wf-md-on-surface:--u2-color-mod(var(--wf-md-primary), 100);--wf-md-on-surface-variant:--u2-color-mod(var(--wf-md-primary), 280);--wf-md-error:#ef4444}.wf-demo-root:not(.env-shell-root){background:radial-gradient(1200px 700px at 12% -8%,color-mix(in oklch,var(--wf-md-primary) 18%,--u2-color-mod(var(--wf-md-primary),940)),--u2-color-mod(var(--wf-md-primary),960));overflow:clip}.env-shell-root.wf-demo-root{background:transparent;overflow:visible}.wf-chrome-no-select{user-select:none;-webkit-user-select:none}.wf-content-select{user-select:text;-webkit-user-select:text}.wf-frame{--wf-shape-xl:0.375rem;background:var(--wf-md-surf-container-low);border:1px solid var(--wf-md-outline-variant);border-radius:var(--wf-shape-xl);box-shadow:0 2px 1px rgb(0 0 0/22%),0 4px 3px rgb(0 0 0/16%),0 8px 10px rgb(0 0 0/12%),0 24px 32px rgb(0 0 0/32%);color:var(--wf-md-on-surface);display:flex;flex-direction:column;overflow:clip;position:fixed}.wf-frame.wf-hidden,.wf-frame.wf-minimized .wf-frame-body{display:none!important}.wf-frame.wf-minimized{block-size:auto!important;box-shadow:0 1px 2px rgb(0 0 0/22%),0 2px 4px rgb(0 0 0/14%)}.wf-titlebar{align-items:stretch;background:linear-gradient(165deg,color-mix(in oklch,var(--wf-md-surf-container-high) 88%,transparent),var(--wf-md-surf-container));border-block-end:1px solid var(--wf-md-outline-variant);display:flex;flex:none;flex-direction:row;gap:.25rem;padding-block:.125rem;padding-inline:.5rem .25rem;pointer-events:auto;position:relative;z-index:1}.wf-titlebar-drag{align-items:center;cursor:grab;display:flex;flex:1;min-block-size:2.5rem;min-inline-size:0;padding-inline-start:.35rem;touch-action:none}.wf-titlebar-drag:active{cursor:grabbing}.wf-titlebar-actions{align-items:center;display:flex;flex:none;flex-direction:row;gap:.125rem}.wf-title{color:var(--wf-md-on-surface);font:550 .875rem/1.2 Google Sans Flex,ui-sans-serif,system-ui,sans-serif;letter-spacing:.015em;opacity:.96;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wf-chrome-btn{background:transparent;block-size:2.25rem;border:none;border-radius:.5rem;color:var(--wf-md-on-surface-variant);cursor:pointer;display:grid;flex:none;inline-size:2.25rem;margin:0;outline:none;padding:0;place-items:center;transition:background .14s ease,color .14s ease}.wf-chrome-btn:hover{background:color-mix(in oklch,var(--wf-md-on-surface) 10%,transparent);color:var(--wf-md-on-surface)}.wf-chrome-btn:focus-visible{box-shadow:0 0 0 2px color-mix(in oklch,var(--wf-md-primary) 56%,transparent)}.wf-chrome-btn_close:hover{background:color-mix(in oklch,var(--wf-md-error) 22%,transparent);color:var(--wf-md-on-surface)}.wf-frame-body{background:var(--wf-md-surface);border-end-end-radius:max(0px,calc(var(--wf-shape-xl) - 1px));border-end-start-radius:max(0px,calc(var(--wf-shape-xl) - 1px));display:flex;flex:1;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:relative;transform:translateZ(0);z-index:0}.wf-frame-slot.wf-mounted-view,.wf-frame-slot>.wf-mounted-view{flex:1;min-block-size:0;overflow:auto}.wf-mobile-max.wf-mobile,.wf-mobile-max.wf-mobile .wf-frame-body{border-radius:0}.wf-resize{background:linear-gradient(135deg,transparent 53%,color-mix(in oklch,var(--wf-md-on-surface) 52%,transparent) 53%) 100% 100% /11px 11px no-repeat;block-size:22px;cursor:se-resize;inline-size:22px;inset-block-end:4px;inset-inline-end:4px;pointer-events:auto;position:absolute;touch-action:none;z-index:2}.wf-explorer{display:flex;flex:1;flex-direction:column;gap:6px;overflow:auto;padding-inline:2px}.wf-exp-row{appearance:none;background:color-mix(in oklch,var(--wf-md-on-surface) 8%,transparent);border:1px solid transparent;border-radius:.75rem;color:inherit;cursor:pointer;font:inherit;padding:8px;text-align:start}.wf-exp-row:hover{border-color:var(--wf-md-outline-variant)}.wf-exp-row_sel{outline:1px solid color-mix(in oklch,var(--wf-md-primary) 55%,transparent)}.wf-viewer{flex:1;min-block-size:0}.wf-md-body{block-size:100%;font-family:Google Sans Flex,ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.52;margin:0;overflow:auto;padding:12px}.wf-md :is(h1,h2,h3){margin:0 0 .5rem}.wf-md h1{font-size:1.25rem}.wf-md p{margin:.35rem 0}.wf-md pre{background:color-mix(in oklch,var(--wf-md-on-surface) 8%,transparent);border-radius:.75rem;overflow:auto;padding:.75rem}.wf-md code{font-family:ui-monospace,Google Sans Mono,monospace}.wf-md ul{margin:.25rem;padding-inline-start:1.35rem}.wf-md-err{color:color-mix(in oklch,var(--wf-md-error) 85%,transparent)}.wf-hud{color:var(--wf-md-on-surface-variant);font:12px ui-sans-serif,system-ui,sans-serif;inset-block-end:4px;inset-inline-start:4px;margin:0;max-inline-size:min(920px,96vw);opacity:.88;padding:6px 10px;position:fixed}.wf-hud p{margin:.15rem}@media print{.wf-demo-root{background:#fff!important}.wf-demo-root,.wf-frame{min-block-size:0!important;overflow:visible!important}.wf-frame{background:transparent!important;block-size:auto!important;border:none!important;border-radius:0!important;inset:auto!important;bottom:auto!important;box-shadow:none!important;break-inside:avoid;color:#000!important;inline-size:100%!important;left:auto!important;max-block-size:none!important;max-inline-size:100%!important;position:static!important;right:auto!important;top:auto!important;z-index:auto!important}.wf-resize,.wf-titlebar{display:none!important}.wf-frame-body{background:transparent!important;block-size:auto!important;border-radius:0!important;flex:none!important;flex-basis:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;transform:none!important}.wf-hud{display:none!important}}";
//#endregion
//#region src/frontend/shells/environment/scss/main.scss?inline
var main_default = ".env-shell-root.wf-demo-root{background:transparent;overflow:visible}.view-home.env-home-workspace,.view-home.view-home--grid{background:transparent!important}@layer layout{.env-shell-root{color-scheme:inherit;--env-z-shell-chrome:2147483000;--env-z-shell-overlays:2147483600;--env-status-inset-top:0px;--base-color-neutralized:color-mix(in oklab, var(--base-color) 60%, gray);--wf-md-seed:var(--base-color);--wf-md-primary:var(--color-primary);--wf-md-surface:var(--color-surface);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);block-size:var(--lv-height,100lvb);isolation:isolate;min-block-size:var(--lv-height,100lvb);overflow:visible;position:relative;--env-window-z-boost:400;--env-mobile-dock-reserve:3rem;--env-shell-chrome-stack-reserve:var(--env-mobile-dock-reserve)}@media (min-width:641px){.env-shell-root{--env-shell-chrome-stack-reserve:2.5rem;--env-mobile-dock-reserve:0px}}.env-shell-root[data-status-overlay]{--env-status-inset-top:max(2rem, env(safe-area-inset-top, 0px));--env-status-fg:var(--wallpaper-contrast-color);--env-status-fg-muted:color-mix(in oklab, var(--wallpaper-contrast-color) 78%, transparent)}.env-shell-root[data-standalone]{--env-status-inset-top:0px}@media screen and (pointer:fine) and ((min-width:768px) or (hover:hover)){.env-shell-root{--env-status-inset-top:max(3rem, env(safe-area-inset-top, 0px))}}.env-shell-wallpaper{inset:0;pointer-events:none;position:fixed;z-index:0}.env-shell-root:-webkit-full-screen .env-shell-wallpaper,.env-shell-root:fullscreen .env-shell-wallpaper,.env-shell-root[data-status-overlay] .env-shell-wallpaper{inset:0}.env-shell-overlays,[data-env-shell-overlays]{background-color:initial!important;box-sizing:border-box;inset:0;pointer-events:none;position:absolute;z-index:8}.env-shell-workspace{align-items:stretch;background-color:initial!important;block-size:var(--lv-height,100lvb);box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;min-block-size:var(--lv-height,100lvb);position:relative;z-index:1}}@layer overrides{html[data-theme=light] .env-shell-root,html[data-theme=light] .env-shell-root .view-settings,html[data-theme=light] .env-shell-root .view-viewer,html[data-theme=light] .env-shell-root ui-window{color-scheme:light only}html[data-theme=light] .env-shell-root .view-viewer{--view-bg:var(--color-container-high);--view-fg:var(--color-on-surface);--view-code-bg:var(--color-surface-container-low);background-color:var(--view-bg);color:var(--view-fg)}@supports (color:contrast-color(red)){html[data-theme=light] .env-shell-root .view-viewer{color:contrast-color(var(--view-bg))}}html[data-theme=light] .env-shell-root :is(.env-shell-app-menu__drag-ghost-icon,.env-shell-app-menu__tile-icon) .ui-ws-item-icon-mask{color-scheme:light only;--icon-color:--u2-color-mod(var(--base-color, var(--color-primary, #5a9ec8)), 900);color:var(--icon-color)}html[data-theme=dark] .env-shell-root,html[data-theme=dark] .env-shell-root .view-settings,html[data-theme=dark] .env-shell-root .view-viewer,html[data-theme=dark] .env-shell-root ui-window{color-scheme:dark only}html[data-theme=dark] .env-shell-root .view-viewer{--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-code-bg:var(--color-surface-container);background-color:var(--view-bg);color:var(--view-fg)}@supports (color:contrast-color(red)){html[data-theme=dark] .env-shell-root .view-viewer{color:contrast-color(var(--view-bg))}}html[data-theme=dark] .env-shell-root :is(.env-shell-app-menu__drag-ghost-icon,.env-shell-app-menu__tile-icon) .ui-ws-item-icon-mask{color-scheme:dark only;--icon-color:--u2-color-mod(var(--base-color, var(--color-primary, #5a9ec8)), 100);color:var(--icon-color)}}.wf-view-host,.wf-view-placeholder{box-sizing:border-box;margin:0;padding:0}.wf-view-host,.wf-view-host>.wf-mounted-view,.wf-view-placeholder{align-self:stretch;display:flex;flex:1 1 0%;flex-direction:column;min-block-size:0;min-inline-size:0;overflow:hidden}.wf-view-placeholder__title{font:600 1rem/1.3 system-ui,sans-serif;margin:0 0 .5rem}.wf-view-placeholder__hint{font:400 .875rem/1.4 system-ui,sans-serif;margin:0;opacity:.75}.env-shell-workspace .wf-frame,.env-shell-workspace ui-window.env-ui-window{border-color:color-mix(in oklch,var(--wf-md-outline-variant,oklch(100% .02 280deg/.12)) 130%,transparent)}.env-shell-workspace ui-window.env-ui-window{--env-window-z-boost:var(--env-window-z-boost, 0);pointer-events:auto}.env-shell-workspace ui-window.env-ui-window[data-desk-max],.env-shell-workspace ui-window.env-ui-window[maximized]:not([data-mobile-max]){box-sizing:border-box}.env-shell-workspace :is(.env-ui-window__body,.env-ui-window__view-host,.wf-mounted-view){block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;pointer-events:auto}.env-shell-home-mount,.env-shell-workspace .env-home-workspace,.env-shell-workspace .speed-dial-root,.env-shell-workspace .view-home{block-size:100%;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0}.env-shell-workspace .wf-frame .wf-titlebar,.env-shell-workspace ui-window.env-ui-window::part(title-handler){pointer-events:auto;position:relative;z-index:6}.env-shell-workspace .wf-frame .wf-frame-body,.env-shell-workspace ui-window.env-ui-window::part(content-handler){contain:paint;position:relative;transform:translateZ(0);z-index:0}.env-shell-workspace .wf-frame .wf-resize,.env-shell-workspace ui-window.env-ui-window::part(resizer){pointer-events:auto;z-index:3}@media print{:is(html,body):has(.env-shell-root),:is(html,body):has([data-shell=environment]),:is(html,body):has(cw-shell-environment),:is(html,body):has(env-shell-container){background:#fff!important;block-size:auto!important;color:#000!important;contain:none!important;container-type:normal!important;content-visibility:visible!important;display:block!important;inline-size:100%!important;height:auto!important;inset:auto!important;max-block-size:none!important;max-height:none!important;min-block-size:0!important;min-height:0!important;overflow:visible!important;position:static!important}#app:has(.env-shell-root),#app:has(env-shell-container),#app:has(ui-window.env-ui-window),.env-shell-root,:is(html,body):has(.env-shell-root) #app,:is(html,body):has(.env-shell-root) [data-app-layer-root],:is(html,body):has(.env-shell-root) [data-app-layer=shell],:is(html,body):has([data-shell=environment]) #app,:is(html,body):has([data-shell=environment]) [data-app-layer-root],:is(html,body):has(cw-shell-environment) #app,:is(html,body):has(cw-shell-environment) [data-app-layer-root],:is(html,body):has(env-shell-container) #app,:is(html,body):has(env-shell-container) [data-app-layer-root],:is(html,body):has(env-shell-container) [data-app-layer=shell],cw-shell-environment,env-shell-container,html[data-print-markdown] #app{block-size:auto!important;contain:none!important;container-type:normal!important;content-visibility:visible!important;display:block!important;inline-size:100%!important;height:auto!important;inset:auto!important;isolation:auto!important;max-block-size:none!important;max-height:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.env-shell-app-menu,.env-shell-chrome,.env-shell-home-mount,.env-shell-overlays,.env-shell-wallpaper,.env-shell-workspace .env-home-workspace,.env-shell-workspace .speed-dial-root,.env-shell-workspace .view-home,.env-shell-workspace .wf-frame:not([data-print-window]):not([data-ui-window-view=viewer]):not([data-wf-managed-view=viewer]),.env-shell-workspace .wf-frame[minimized],.env-shell-workspace ui-window.env-ui-window:not([data-print-window]):not([data-ui-window-view=viewer]):not([data-ui-window-view=markdown]),.env-shell-workspace ui-window.env-ui-window[minimized],[data-app-layer=canvas],[data-app-layer=orient],[data-app-layer=overlay]:not(:has(ui-window.env-ui-window,.wf-frame)),[data-env-shell-overlays],[data-window-dock],[data-window-status],cw-app-dock,cw-status-bar{display:none!important}.env-shell-workspace{block-size:auto!important;contain:none!important;container-type:normal!important;display:block!important;height:auto!important;inline-size:100%!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.env-shell-workspace .wf-frame[data-focused]:has(cw-view-viewer,[data-view-id=viewer],.view-viewer),.env-shell-workspace .wf-frame[data-print-window],.env-shell-workspace .wf-frame[data-ui-window-view=viewer],.env-shell-workspace ui-window.env-ui-window[data-desk-max]:has(cw-view-viewer,[data-view-id=viewer],.view-viewer),.env-shell-workspace ui-window.env-ui-window[data-focused]:has(cw-view-viewer,[data-view-id=viewer],.view-viewer),.env-shell-workspace ui-window.env-ui-window[data-print-window],.env-shell-workspace ui-window.env-ui-window[data-ui-window-view=markdown],.env-shell-workspace ui-window.env-ui-window[data-ui-window-view=viewer],.env-shell-workspace ui-window.env-ui-window[maximized]:has(cw-view-viewer,[data-view-id=viewer],.view-viewer){background:#fff!important;block-size:auto!important;border:none!important;border-radius:0!important;inset:auto!important;bottom:auto!important;box-shadow:none!important;color:#000!important;contain:none!important;container-type:normal!important;display:block!important;inline-size:100%!important;height:auto!important;left:auto!important;max-block-size:none!important;max-inline-size:100%!important;min-block-size:0!important;overflow:visible!important;position:static!important;right:auto!important;top:auto!important;transform:none!important;z-index:auto!important}.env-shell-workspace .wf-frame .wf-resize,.env-shell-workspace .wf-frame .wf-titlebar,.env-shell-workspace ui-window.env-ui-window::part(footer-handler),.env-shell-workspace ui-window.env-ui-window::part(resizer),.env-shell-workspace ui-window.env-ui-window::part(title-handler){display:none!important}.env-shell-workspace .env-ui-window__body,.env-shell-workspace .env-ui-window__view-host,.env-shell-workspace .wf-frame .wf-frame-body,.env-shell-workspace .wf-mounted-view,.env-shell-workspace .wf-view-host,.env-shell-workspace .wf-view-host>.wf-mounted-view,.env-shell-workspace ui-window.env-ui-window::part(content-handler),.env-shell-workspace ui-window.env-ui-window::part(window-container){align-self:stretch!important;background:#fff!important;block-size:auto!important;color:#000!important;contain:none!important;container-type:normal!important;display:block!important;flex:none!important;inline-size:100%!important;height:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important;transform:none!important}.env-shell-workspace .cw-view-viewer-shell,.env-shell-workspace .markdown-body,.env-shell-workspace .result-content,.env-shell-workspace .view-viewer,.env-shell-workspace [data-cw-view-host=true][data-view-id=viewer],.env-shell-workspace [data-render-target],.env-shell-workspace cw-view-viewer{block-size:auto!important;contain:none!important;container-type:normal!important;content-visibility:visible!important;display:block!important;height:auto!important;inset:auto!important;max-block-size:none!important;min-block-size:0!important;opacity:1!important;overflow:visible!important;position:static!important;visibility:visible!important}}.env-shell-workspace{background-color:initial!important;padding:0}:host(ui-statusbar){align-items:center;background:transparent;box-sizing:border-box;color:var(--env-status-fg,var(--wallpaper-contrast-color,CanvasText));display:flex;flex-direction:row;gap:.35rem;inline-size:100%;justify-content:space-between}:host(ui-statusbar) :is(.center,.left,.right){align-items:center;background:transparent;display:flex;min-inline-size:0;padding-block-start:.5rem}:host(ui-statusbar) .left{flex:0 1 auto;justify-content:flex-start;padding-inline-start:max(1rem,env(safe-area-inset-left,0))}:host(ui-statusbar) .center{flex:1 1 auto;justify-content:center}:host(ui-statusbar) .right{flex:0 1 auto;justify-content:flex-end;margin-inline-start:auto;padding-inline-end:max(1rem,env(safe-area-inset-right,0))}@media screen and (pointer:fine) and ((min-width:768px) or (hover:hover)){:host(ui-statusbar),ui-statusbar{display:none!important}}@layer components{.env-ui-statusbar{backdrop-filter:blur(10px);background:color-mix(in oklab,var(--color-surface-container,--u2-color-mod(var(--base-color,#5a9ec8),960)) 88%,transparent);border-block-start:1px solid var(--wf-md-outline-variant,var(--color-outline-variant));color:var(--color-on-surface,--u2-color-mod(var(--base-color,#5a9ec8),100));order:1;padding:.35rem .65rem calc(.35rem + env(safe-area-inset-bottom, 0))}.env-ui-statusbar__intro p{margin:.1rem 0;opacity:.92}.env-ui-statusbar__right{align-items:center;display:flex;justify-content:flex-end}.env-ui-statusbar__clock{border-radius:.35rem;color:inherit;cursor:pointer;font:600 .8125rem/1 ui-sans-serif,system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.01em;padding:.15rem .25rem;pointer-events:auto;user-select:none}.env-ui-statusbar__clock:focus-visible,.env-ui-statusbar__clock:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--footer{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--footer:focus-visible,.env-device-tray--footer:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-status-bar__tray{align-items:center;display:flex;flex-wrap:nowrap;gap:.35rem}.env-status-bar__chip{align-items:center;background:color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 10%,transparent);border:1px solid color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 18%,transparent);border-radius:999px;color:inherit;color:contrast-color(inherit(background-color));display:inline-flex;gap:.25rem;line-height:1;padding:.12rem .35rem}.env-status-bar__chip,.env-status-bar__chip span{font-variant-numeric:tabular-nums}.env-status-bar__chip ui-icon{--icon-size:1.15rem;--icon-padding:0;--icon-color:var(--env-status-fg, var(--wallpaper-contrast-color, currentColor));block-size:var(--icon-size);color:var(--icon-color);display:block;font-size:var(--icon-size);inline-size:var(--icon-size);min-block-size:var(--icon-size);min-inline-size:var(--icon-size)}.env-status-bar__pct{font-variant-numeric:tabular-nums;opacity:.95}.env-status-bar__meta{font-size:11px;margin:0;opacity:.88}.env-shell-chrome[data-status-overlay] .env-ui-statusbar,.env-shell-root[data-status-overlay]>.env-shell-chrome .env-ui-statusbar{align-items:center;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));border:0!important;box-sizing:border-box;display:flex;inset-block-end:auto;inset-block-start:0;inset-inline:0;min-block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));order:unset;padding:0 .75rem;position:fixed;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 2);--icon-color:var(--env-status-fg, var(--wallpaper-contrast-color));color:var(--env-status-fg,var(--wallpaper-contrast-color));pointer-events:none}.env-shell-chrome[data-status-overlay] :is(.env-status-bar__meta,.env-ui-statusbar__intro){display:none!important}.env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock{color:var(--env-status-fg,var(--wallpaper-contrast-color));display:block;font-size:.875rem}.env-shell-chrome[data-status-overlay] :is(.env-device-tray--footer,.env-status-bar__chip){color:var(--env-status-fg,var(--wallpaper-contrast-color))}.env-shell-chrome[data-status-overlay] .env-status-bar__chip ui-icon{--icon-size:1.25rem;--icon-padding:0;--icon-color:var(--env-status-fg, var(--wallpaper-contrast-color));block-size:var(--icon-size);color:var(--icon-color);font-size:var(--icon-size);inline-size:var(--icon-size);min-block-size:var(--icon-size);min-inline-size:var(--icon-size)}.env-shell-chrome[data-status-overlay] .env-status-bar__pct{font-size:.8125rem}.env-shell-chrome[data-status-overlay] .env-device-tray--footer{display:flex!important}.env-shell-chrome[data-status-overlay] .env-status-bar__chip{background:transparent;border-color:transparent;padding-inline:.15rem}.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-ui-statusbar__clock,.env-shell-chrome[data-standalone] .env-ui-statusbar,.env-shell-root[data-standalone] .env-shell-chrome:not([data-desktop]) .env-ui-statusbar{display:none!important}.env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop]{opacity:0;pointer-events:none;visibility:hidden}ui-taskbar{gap:0 0!important;padding:0!important}}@layer components{ui-taskbar::part(taskbar){display:grid!important;gap:0 0!important;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);padding:0!important}ui-taskbar ui-task{margin:0!important}.env-shell-chrome{color:var(--color-on-surface,var(--wf-md-on-surface-variant,#1c1c1e));display:flex;flex-direction:column;font:12px ui-sans-serif,system-ui,sans-serif;gap:0!important;inset-block-end:0;inset-inline:0;isolation:isolate;padding:0!important;pointer-events:none;position:fixed;z-index:var(--env-z-shell-chrome,2147483000)}.env-shell-chrome[data-desktop]{box-shadow:0 -8px 28px rgba(0,0,0,.28)}.env-shell-chrome>*{pointer-events:auto}.env-shell-taskbar{--env-taskbar-surface:color-mix(\n        in oklab,\n        var(--color-surface-container-high, --u2-color-mod(var(--base-color, #5a9ec8), 980)) 88%,\n        transparent\n    );--env-taskbar-ink:var(\n        --color-on-surface,\n        light-dark(\n            --u2-color-mod(var(--base-color, #5a9ec8), 900),\n            --u2-color-mod(var(--base-color, #5a9ec8), 100)\n        )\n    );--env-taskbar-accent:var(--wf-md-primary, var(--color-primary, #5a9ec8));align-items:stretch;backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);background:var(--env-taskbar-surface);block-size:2.5rem;border-block-start:1px solid light-dark(color-mix(in oklab,#000 10%,transparent),color-mix(in oklab,#fff 14%,transparent));box-shadow:none;color-scheme:inherit;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;min-block-size:2.5rem;order:0;padding:0 .25rem;padding-block-end:env(safe-area-inset-bottom,0);position:relative}.env-shell-taskbar,.env-shell-taskbar ui-icon{--icon-color:var(--env-taskbar-ink);color:var(--env-taskbar-ink)}.env-shell-taskbar::part(taskbar){align-items:stretch;display:flex;flex:1;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:100%;min-inline-size:0}.env-shell-taskbar__pins,.env-shell-taskbar__windows{align-items:stretch;display:flex;flex-direction:row;flex-wrap:nowrap;gap:0 0;margin:0;min-inline-size:0}.env-shell-taskbar__workspaces{align-items:center;display:none;flex-direction:row;gap:.25rem;margin-inline-start:.35rem}.env-shell-taskbar__workspace{background:color-mix(in oklab,CanvasText 10%,transparent);border:none;border-radius:.35rem;color:inherit;cursor:pointer;font:inherit;font-size:.7rem;min-block-size:1.35rem;min-inline-size:1.35rem;padding:0 .35rem}.env-shell-taskbar__workspace[data-active]{background:color-mix(in oklab,CanvasText 22%,transparent);font-weight:650}.env-shell-chrome[data-desktop] .env-shell-taskbar__workspaces{display:flex}.env-shell-taskbar__pins{content-visibility:visible;flex:0 0 auto;gap:0 0;inline-size:stretch;margin:0}.env-shell-taskbar__pins [data-env-home]{color:inherit;content-visibility:visible;--icon-color:currentColor;background:color-mix(in oklab,var(--env-taskbar-surface) 60%,transparent)!important;background-color:color-mix(in oklab,var(--env-taskbar-surface) 60%,transparent)!important}.env-shell-taskbar__pins ui-task{backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);box-shadow:inset 0 -2px 0 var(--env-taskbar-accent)}.env-shell-taskbar__pins ui-task::part(glyph),.env-shell-taskbar__pins ui-task::part(icon){color:var(--env-taskbar-ink);--icon-color:var(--env-taskbar-ink)}.env-shell-taskbar__windows{flex:1 1 auto;inline-size:stretch;justify-content:flex-start;overflow-x:auto;scrollbar-width:thin}.env-shell-taskbar ui-task{align-self:stretch;background:transparent;border:0;border-radius:0;box-shadow:inset 0 -2px 0 transparent;color:inherit;cursor:pointer;inline-size:fit-content;min-block-size:100%;min-inline-size:2.75rem;opacity:1;outline:none;padding-inline:.55rem}.env-shell-taskbar ui-task:hover{background:color-mix(in oklab,var(--env-taskbar-ink) 10%,transparent);color:var(--env-taskbar-ink);opacity:1}.env-shell-taskbar :is(ui-task[data-active],ui-task[data-env-active=true],ui-task[data-focus]){background:color-mix(in oklab,var(--env-taskbar-surface) 12%,transparent);box-shadow:inset 0 -2px 0 var(--env-taskbar-accent);color:var(--env-taskbar-ink);opacity:1;outline:none}.env-shell-taskbar ui-task[data-minimized]{opacity:.65}.env-shell-taskbar__tray-host{align-items:center;border-inline-start:1px solid light-dark(color-mix(in oklab,#000 10%,transparent),color-mix(in oklab,#fff 12%,transparent));display:flex;flex:0 0 auto;gap:.35rem;margin-inline-start:auto;padding-inline:.35rem}.env-shell-taskbar__clock{align-items:flex-end;border-radius:.35rem;cursor:pointer;display:flex;flex-direction:column;gap:.05rem;inline-size:fit-content;justify-content:center;line-height:1.05;min-inline-size:4rem;padding-inline:.35rem .15rem;pointer-events:auto;user-select:none}.env-shell-taskbar__clock,.env-shell-taskbar__clock .env-shell-taskbar__clock-date,.env-shell-taskbar__clock .env-shell-taskbar__clock-time{font-variant-numeric:tabular-nums}.env-shell-taskbar__clock:focus-visible,.env-shell-taskbar__clock:hover{background:color-mix(in oklab,var(--env-taskbar-ink) 10%,transparent);color:var(--env-taskbar-ink);outline:none}.env-device-tray--taskbar{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--taskbar:focus-visible,.env-device-tray--taskbar:hover{background:color-mix(in oklab,var(--env-taskbar-ink) 10%,transparent);color:var(--env-taskbar-ink);outline:none}.env-shell-taskbar__clock-time{color:inherit;font-size:.78rem;font-variant-numeric:tabular-nums;font-weight:600}.env-shell-taskbar__clock-date{color:color-mix(in oklab,currentColor 72%,transparent);font-size:.62rem;font-variant-numeric:tabular-nums;font-weight:500;white-space:nowrap}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title){display:none!important}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task{min-inline-size:2.5rem;padding-inline:.45rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]::part(icon){block-size:1.75rem;inline-size:1.75rem;min-block-size:1.75rem;min-inline-size:1.75rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]::part(glyph){block-size:100%;inline-size:100%;--icon-size:100%;--icon-padding:0.05rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter){font-size:.8rem}.env-shell-chrome[data-desktop] .env-shell-taskbar__pins{background:transparent;background-color:initial;margin:0;outline:0 none transparent;padding:0}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home],.env-shell-chrome[data-desktop] .env-shell-taskbar__pins{backdrop-filter:none;-webkit-backdrop-filter:none;border:0 transparent;border-radius:0;box-shadow:0 0 0 none transparent;margin-inline-end:.2rem;min-inline-size:2.75rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]{display:inline-flex!important;outline:none;outline:0 none transparent;transform:none}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]:focus-visible,.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]:hover{background:color-mix(in oklab,var(--env-taskbar-accent) 32%,transparent)}.env-shell-chrome[data-desktop] .env-shell-taskbar :is(ui-task[data-env-home][data-active],ui-task[data-env-home][data-env-active=true],ui-task[data-env-home][data-focus]){background:color-mix(in oklab,var(--env-taskbar-accent) 28%,transparent)}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;block-size:3rem;border-block-start:none;box-shadow:none;color:var(--env-status-fg,var(--env-taskbar-ink));display:block;gap:0;inline-size:100%;min-block-size:3rem;padding:.15rem .75rem;padding-block-end:.15rem;place-self:stretch;position:relative;--icon-color:currentColor;pointer-events:none}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar::part(taskbar){block-size:100%;display:block!important;grid-template-columns:none!important;inline-size:100%;position:relative}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins{display:contents}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]),.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]{background:color-mix(in oklab,var(--color-surface-container-high,--u2-color-mod(var(--base-color,#5a9ec8),980)) 88%,transparent);border-radius:999px;bottom:.22rem;box-shadow:0 6px 20px -8px color-mix(in oklab,#000 45%,transparent);left:auto;margin:0;min-block-size:2.5rem;min-inline-size:2.5rem;padding:0;pointer-events:auto;position:absolute;right:calc(.7rem + env(safe-area-inset-right, 0px));top:auto;touch-action:manipulation;user-select:none;z-index:5}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title){display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon){block-size:1.7rem;inline-size:1.7rem;min-block-size:1.7rem;min-inline-size:1.7rem}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph){block-size:100%;inline-size:100%;--icon-padding:0.1rem;--icon-size:100%;opacity:1}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter){opacity:0}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home]:active,ui-task[data-env-home]:hover){background:color-mix(in oklch,#fff 10%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home][data-active],ui-task[data-env-home][data-env-active=true],ui-task[data-env-home][data-focus]){background:color-mix(in oklch,#fff 8%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-ui-statusbar{display:none!important}.env-shell-navbar__switcher{--navbar-switcher-background:light-dark(color-mix(in oklch, #f2f2f7 96%, transparent), color-mix(in oklch, #1c1c1e 96%, transparent));background:var(--navbar-switcher-background);border-radius:.85rem;color:contrast-color(var(--navbar-switcher-background));inset-block-end:4rem;inset-inline:.75rem;max-block-size:min(50dvb,20rem);overflow:auto;padding:.35rem;position:fixed;z-index:4;--icon-color:contrast-color(var(--navbar-switcher-background));backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid light-dark(color-mix(in oklch,#fff 12%,transparent),color-mix(in oklch,#1c1c1e 12%,transparent));box-shadow:0 12px 32px rgba(0,0,0,.45);inline-size:calc(100cqi - 1rem);place-self:center}.env-shell-navbar__switcher[hidden]{display:none!important}.env-shell-navbar__switcher-list{display:flex;flex-direction:column;gap:.15rem;list-style:none;margin:0;padding:0}.env-shell-navbar__switcher-empty{font:400 .8125rem/1.3 system-ui,sans-serif;opacity:.72;padding:.75rem .85rem;text-align:center}.env-shell-navbar__switcher-row{align-items:stretch;display:flex;flex-direction:row;gap:.2rem}.env-shell-navbar__switcher-item{align-items:center;appearance:none;background:transparent;border:0;border-radius:.65rem;color:inherit;cursor:pointer;display:flex;flex:1 1 auto;flex-direction:row;font:500 .875rem/1.25 system-ui,sans-serif;gap:.65rem;margin:0;min-inline-size:0;padding:.65rem .75rem;text-align:start}.env-shell-navbar__switcher-label{flex:1 1 auto;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.env-shell-navbar__switcher-item:focus-visible,.env-shell-navbar__switcher-item:hover{background:light-dark(color-mix(in oklch,#fff 10%,transparent),color-mix(in oklch,#1c1c1e 10%,transparent));outline:none}.env-shell-navbar__switcher-item[data-active]{background:light-dark(color-mix(in oklch,#60cdff 18%,transparent),color-mix(in oklch,#60cdff 18%,transparent))}.env-shell-navbar__switcher-item[data-minimized]{opacity:.78}.env-shell-navbar__switcher-item ui-icon{flex:0 0 auto;--icon-size:1.25rem;block-size:1.25rem;inline-size:1.25rem}.env-shell-navbar__switcher-close{align-items:center;appearance:none;background:transparent;border:0;border-radius:.65rem;color:inherit;cursor:pointer;display:inline-flex;flex:0 0 auto;inline-size:2.5rem;justify-content:center;margin:0;min-inline-size:2.5rem;padding:0}.env-shell-navbar__switcher-close:focus-visible,.env-shell-navbar__switcher-close:hover{background:light-dark(color-mix(in oklch,#ff6b6b 22%,transparent),color-mix(in oklch,#ff6b6b 22%,transparent));color:#ffb4b4;outline:none}.env-shell-navbar__switcher-close ui-icon{--icon-size:1.1rem;block-size:1.1rem;inline-size:1.1rem}}@media (min-width:641px){.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-device-tray--footer{display:none!important}}.env-shell-chrome:not([data-desktop]) :is(.env-device-tray--taskbar,.env-shell-taskbar__tray-host),.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-device-tray--footer,.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-device-tray--footer{display:none!important}@layer components{.ui-ws-item-icon-mask[data-launcher-icon]{background-color:var(--icon-color,var(--sd-figure-ink,currentColor));block-size:var(--launcher-icon-size,var(--icon-size,2.2rem));box-sizing:border-box;color:var(--icon-color,var(--sd-figure-ink,currentColor));display:block;filter:drop-shadow(0 1px 2px color-mix(in oklab,#000 14%,transparent));flex-shrink:0;inline-size:var(--launcher-icon-size,var(--icon-size,2.2rem));mask-image:var(--launcher-app-icon-url);mask-origin:center;mask-position:center;mask-repeat:no-repeat;mask-size:calc(100% * var(--launcher-icon-mask-scale, 1.1))}.env-shell-app-menu[data-page]{align-items:stretch;inset:0;justify-items:stretch;padding:0;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 4)}.env-shell-app-menu[data-page] .env-shell-app-menu__panel{block-size:100%;border-radius:0;inline-size:100%;max-block-size:stretch;max-inline-size:stretch;overflow:hidden;overflow-y:auto!important;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;pointer-events:auto}.env-shell-app-menu__panel>.env-shell-app-menu__grid{align-content:start;align-self:stretch;block-size:max-content;grid-auto-rows:max-content;justify-content:start;max-block-size:max-content;min-block-size:fit-content;overflow:visible;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}.env-shell-app-menu[data-page] .env-shell-app-menu__grid{column-gap:.45rem;padding-block-end:calc(var(--env-shell-chrome-stack-reserve, 3rem) + env(safe-area-inset-bottom, 0px));row-gap:.85rem}.env-shell-app-menu{align-items:end;box-sizing:border-box;color-scheme:inherit;display:grid;inset-block-end:var(--env-shell-chrome-stack-reserve,3rem);inset-inline:0;justify-items:start;padding:.5rem;padding-inline-start:max(.5rem,env(safe-area-inset-left,0px));pointer-events:auto;position:fixed;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 2);--env-app-menu-accent:var(--wf-md-primary, var(--color-primary, #5a9ec8));--env-app-menu-surface:color-mix(\n        in oklab,\n        var(--color-surface-container, --u2-color-mod(var(--base-color, #5a9ec8), 960)) 88%,\n        transparent\n    );--env-app-menu-surface-raised:var(\n        --color-surface-container-high,\n        --u2-color-mod(var(--base-color, #5a9ec8), 980)\n    );--env-app-menu-ink:var(\n        --color-on-surface,\n        light-dark(\n            --u2-color-mod(var(--base-color, #5a9ec8), 900),\n            --u2-color-mod(var(--base-color, #5a9ec8), 100)\n        )\n    );--env-app-menu-plate:var(\n        --color-primary-container,\n        light-dark(\n            --u2-color-mod(var(--base-color, #5a9ec8), 160),\n            --u2-color-mod(var(--base-color, #5a9ec8), 820)\n        )\n    )}.env-shell-app-menu[hidden]{display:none!important}.env-shell-app-menu__panel{background:var(--env-app-menu-surface);border:1px solid light-dark(color-mix(in oklab,#000 12%,transparent),color-mix(in oklab,#fff 14%,transparent));border-radius:14px;box-shadow:0 20px 48px -20px light-dark(rgba(0,0,0,.22),rgba(0,0,0,.45)),0 2px 8px -2px light-dark(rgba(0,0,0,.12),rgba(0,0,0,.25));color:var(--env-app-menu-ink);display:grid;gap:.75rem;inline-size:min(420px,100vw - 1rem);max-block-size:min(520px,100dvb - var(--env-shell-chrome-stack-reserve,3rem) - 1rem);overflow:hidden;overflow-y:auto!important;overscroll-behavior:contain;padding:.85rem;pointer-events:auto;touch-action:pan-y;-webkit-overflow-scrolling:touch;animation:e .14s cubic-bezier(.22,.8,.3,1);backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);block-size:fit-content;color-scheme:inherit;grid-template-rows:auto auto minmax(0,1fr);min-block-size:max(60dvb,60cqb)}.env-shell-app-menu__panel[data-layout=start-split]{grid-template-rows:auto auto minmax(0,1fr);inline-size:min(560px,100vw - 1rem);max-block-size:min(580px,100dvb - var(--env-shell-chrome-stack-reserve,3rem) - 1rem)}.env-shell-app-menu__start-body{display:grid;gap:.65rem;grid-template-columns:minmax(9.5rem,.42fr) minmax(0,1fr);max-block-size:100%;min-block-size:12rem;overflow:hidden}.env-shell-app-menu__start-left{background:light-dark(color-mix(in oklab,var(--env-app-menu-accent) 8%,transparent),color-mix(in oklab,var(--env-app-menu-accent) 12%,transparent));border:1px solid light-dark(color-mix(in oklab,var(--env-app-menu-accent) 22%,transparent),color-mix(in oklab,#fff 14%,transparent));border-radius:12px;display:flex;flex-direction:column;gap:.4rem;min-block-size:fit-content;min-inline-size:0;overflow:auto;padding:.45rem}.env-shell-app-menu__start-right{display:grid;gap:.4rem;grid-template-rows:auto minmax(0,1fr);min-block-size:fit-content;min-inline-size:0;overflow:hidden}.env-shell-app-menu__start-heading{flex:0 0 auto;font:600 .72rem/1.2 ui-sans-serif,system-ui,sans-serif;letter-spacing:.04em;opacity:.72;padding-inline:.25rem;text-transform:uppercase}.env-shell-app-menu__start-recent{align-content:start;display:grid;flex:0 0 auto;gap:.2rem;grid-template-columns:1fr}.env-shell-app-menu__start-recent .env-shell-app-menu__tile{align-items:center;gap:.45rem;grid-template-columns:auto minmax(0,1fr);justify-items:start;padding:.35rem .4rem;text-align:start}.env-shell-app-menu__start-recent .env-shell-app-menu__tile-icon{block-size:2.25rem;inline-size:2.25rem;min-block-size:2.25rem;min-inline-size:2.25rem}.env-shell-app-menu__start-recent .env-shell-app-menu__tile-icon ui-icon:not([data-launcher-icon]){block-size:1.5rem!important;inline-size:1.5rem!important;--icon-size:1.5rem;--icon-padding:0px}.env-shell-app-menu__start-recent .env-shell-app-menu__tile-label{font-size:.78rem;-webkit-line-clamp:1;text-align:start}.env-shell-app-menu__start-right .env-shell-app-menu__grid{align-content:start;display:flex;flex-direction:column;flex-wrap:nowrap;gap:.2rem;grid-template-columns:none;min-block-size:fit-content;overflow:auto}.env-shell-app-menu__start-right .env-shell-app-menu__tile{align-items:center;border-radius:10px;box-sizing:border-box;display:grid;gap:.65rem;grid-template-columns:auto minmax(0,1fr);inline-size:100%;justify-items:start;padding:.4rem .55rem;text-align:start}.env-shell-app-menu__start-right .env-shell-app-menu__tile-icon{block-size:2.5rem;inline-size:2.5rem;min-block-size:2.5rem;min-inline-size:2.5rem}.env-shell-app-menu__start-right .env-shell-app-menu__tile-icon ui-icon:not([data-launcher-icon]){block-size:1.75rem!important;inline-size:1.75rem!important;--icon-size:1.75rem;--icon-padding:0px}.env-shell-app-menu__start-right .env-shell-app-menu__tile-label{font:500 .9rem/1.25 ui-sans-serif,system-ui,sans-serif;justify-self:stretch;-webkit-line-clamp:1;text-align:start}.env-shell-app-menu__crumb{align-items:center;display:flex;flex-wrap:wrap;gap:.35rem .55rem;min-block-size:1.4rem}.env-shell-app-menu__crumb-nav{align-items:center;display:flex;flex:1 1 auto;flex-wrap:wrap;gap:.2rem;min-inline-size:0}.env-shell-app-menu__crumb-actions{align-items:center;display:flex;flex-wrap:wrap;gap:.3rem;margin-inline-start:auto}.env-shell-app-menu__crumb-actions[hidden]{display:none!important}.env-shell-app-menu__crumb-action{appearance:none;background:var(--env-app-menu-surface-raised);border:1px solid light-dark(color-mix(in oklab,#000 12%,transparent),color-mix(in oklab,#fff 14%,transparent));border-radius:8px;color:inherit;cursor:pointer;font:600 .72rem/1.2 ui-sans-serif,system-ui,sans-serif;padding:.28rem .5rem}.env-shell-app-menu__crumb-action:hover{background:light-dark(color-mix(in oklab,#000 8%,transparent),color-mix(in oklab,#fff 10%,transparent))}.env-shell-app-menu__crumb-item{appearance:none;background:transparent;border:0;border-radius:6px;color:inherit;cursor:pointer;font:600 .78rem/1.2 ui-sans-serif,system-ui,sans-serif;padding:.15rem .35rem}.env-shell-app-menu__crumb-item:hover{background:light-dark(color-mix(in oklab,#000 8%,transparent),color-mix(in oklab,#fff 10%,transparent))}.env-shell-app-menu__crumb-sep{font-size:.85rem;opacity:.45}.env-shell-app-menu__empty--compact{font-size:.75rem;margin:.35rem 0;padding-inline:.25rem;text-align:start}}@layer components{@media (max-width:520px){.env-shell-app-menu__tools{grid-template-columns:1fr 1fr}.env-shell-app-menu__search{grid-column:1/-1}.env-shell-app-menu__sort,.env-shell-app-menu__sort-dir{max-inline-size:none}.env-shell-app-menu__start-body{grid-template-columns:1fr;grid-template-rows:minmax(0,8rem) minmax(0,1fr)}.env-shell-app-menu__start-recent{display:flex;flex-direction:column;overflow:auto}}.env-shell-app-menu__banner{background:color-mix(in oklab,var(--env-app-menu-accent,var(--color-primary,#60cdff)) 14%,transparent);border:1px solid color-mix(in oklab,var(--env-app-menu-accent,var(--color-primary,#60cdff)) 35%,transparent);border-radius:10px;display:grid;gap:.65rem;padding:.65rem .75rem}.env-shell-app-menu__banner[hidden]{display:none!important}.env-shell-app-menu__banner-text{font:500 .9rem/1.35 ui-sans-serif,system-ui,sans-serif;margin:0}.env-shell-app-menu__banner-action{justify-self:start}.env-shell-app-menu__tools{align-items:stretch;display:grid;gap:.4rem;grid-template-columns:minmax(0,1fr) auto auto;inset-block-start:0;position:sticky;z-index:7}.env-shell-app-menu__tools[hidden]{display:none!important}.env-shell-app-menu__search,.env-shell-app-menu__sort,.env-shell-app-menu__sort-dir{background:var(--env-app-menu-surface-raised);border:1px solid light-dark(color-mix(in oklab,#000 12%,transparent),color-mix(in oklab,#fff 14%,transparent));border-radius:10px;box-sizing:border-box;color:inherit;font:400 .9rem/1.2 ui-sans-serif,system-ui,sans-serif;padding:.55rem .65rem}.env-shell-app-menu__search{inline-size:100%;min-inline-size:0}.env-shell-app-menu__sort,.env-shell-app-menu__sort-dir{max-inline-size:11rem}.env-shell-app-menu__search[hidden]{display:none!important}.env-shell-app-menu__grid{align-content:start;block-size:max-content;display:grid;gap:.5rem;grid-auto-rows:max-content;grid-template-columns:repeat(auto-fill,minmax(4.5rem,1fr));min-block-size:fit-content;touch-action:pan-y;-webkit-overflow-scrolling:touch;overflow:visible;pointer-events:auto}.env-shell-app-menu__grid[hidden]{display:none!important}.env-shell-app-menu__tile{align-content:start;background:transparent;border:0;border-radius:12px;color:inherit;cursor:pointer;display:grid;flex-shrink:0;gap:.35rem;justify-items:center;min-block-size:fit-content;padding:.45rem .25rem;text-align:center;touch-action:pan-y;user-select:none}.env-shell-app-menu__tile:focus-visible,.env-shell-app-menu__tile:hover{background:color-mix(in oklab,var(--env-app-menu-accent,var(--color-primary,#60cdff)) 12%,transparent);outline:none}.env-shell-app-menu__tile--dragging{opacity:.45}html[data-app-menu-dragging] .env-shell-app-menu{pointer-events:none}html[data-app-menu-dragging] .env-shell-app-menu__panel{opacity:0;visibility:hidden}.env-shell-app-menu__drag-ghost{display:grid;gap:.35rem;inline-size:4.5rem;inset:0 auto auto 0;justify-items:center;pointer-events:none;position:fixed;will-change:transform;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 8)}.env-shell-app-menu__drag-ghost-icon{aspect-ratio:1/1;backdrop-filter:blur(16px) saturate(1.35);-webkit-backdrop-filter:blur(16px) saturate(1.35);background:light-dark(color-mix(in oklab,#e8eaed 72%,var(--wf-md-primary,var(--color-primary,#60cdff)) 28%),color-mix(in oklab,#111827 72%,var(--wf-md-primary,var(--color-primary,#60cdff)) 28%));block-size:3rem;border:none;border-radius:50%;box-shadow:0 8px 24px -8px rgba(0,0,0,.55);box-sizing:border-box;contain:layout style;display:grid;inline-size:3rem;overflow:hidden;padding:0;place-content:center;place-items:center;position:relative}@supports (corner-shape:round){.env-shell-app-menu__drag-ghost-icon{corner-shape:round}}.env-shell-app-menu__drag-ghost-icon img[data-icon-pending],.env-shell-app-menu__drag-ghost-icon img[data-launcher-icon]:not([src]),.env-shell-app-menu__drag-ghost-icon ui-icon[data-icon-pending]{opacity:0;visibility:hidden}.env-shell-app-menu__drag-ghost-icon .ui-ws-item-icon-img,.env-shell-app-menu__drag-ghost-icon img[data-launcher-icon]{block-size:100%;border-radius:0;inline-size:100%;inset:0;object-fit:cover;object-position:center;pointer-events:none;position:absolute;transform:scale(1.28);transform-origin:center}.env-shell-app-menu__drag-ghost-icon ui-icon[data-launcher-icon]{block-size:100%;inline-size:100%;inset:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;position:absolute;--icon-size:100%;--icon-padding:0px;pointer-events:none;transform:scale(1.28);transform-origin:center}.env-shell-app-menu__drag-ghost-label{display:-webkit-box;-webkit-box-orient:vertical;font:600 .68rem/1.15 ui-sans-serif,system-ui,sans-serif;-webkit-line-clamp:2;overflow:hidden;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.35)}.env-shell-app-menu__tile-icon{backdrop-filter:blur(16px) saturate(1.35);-webkit-backdrop-filter:blur(16px) saturate(1.35);background:var(--env-app-menu-plate);block-size:2.5rem!important;border:none;box-shadow:0 6px 24px -8px color-mix(in oklab,#000 38%,transparent);box-sizing:border-box;color:var(--color-on-primary-container,var(--env-app-menu-ink));display:grid;inline-size:2.5rem!important;min-block-size:2.5rem!important;min-inline-size:2.5rem!important;overflow:hidden;padding:0!important;place-content:center;place-items:center;position:relative;--icon-color:var(--color-on-primary-container, var(--env-app-menu-ink))}.env-shell-app-menu__tile-icon,.env-shell-app-menu__tile-icon:not([data-shape]),.env-shell-app-menu__tile-icon[data-shape=circle]{aspect-ratio:1/1!important;border-radius:50%!important}@supports (corner-shape:round){.env-shell-app-menu__tile-icon:not([data-shape]),.env-shell-app-menu__tile-icon[data-shape=circle]{corner-shape:round}}.env-shell-app-menu__tile-icon[data-shape=squircle]{border-radius:1.5rem!important}@supports (corner-shape:squircle){.env-shell-app-menu__tile-icon[data-shape=squircle]{corner-shape:unset}}@supports (corner-shape:round){.env-shell-app-menu__tile-icon[data-shape=squircle]{corner-shape:round}}.env-shell-app-menu__tile-icon[data-shape=square]{border-radius:12%!important}@supports (corner-shape:square){.env-shell-app-menu__tile-icon[data-shape=square]{corner-shape:square}}.env-shell-app-menu__tile-icon[data-shape=shapeless]{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;border-radius:0!important;box-shadow:none!important;contain:none;overflow:visible!important}@supports (corner-shape:squircle){.env-shell-app-menu__tile-icon[data-shape=shapeless]{corner-shape:unset}}.env-shell-app-menu__tile-icon[data-shape=shapeless] .env-shell-app-menu__tile-favicon,.env-shell-app-menu__tile-icon[data-shape=shapeless] .ui-ws-item-icon-img,.env-shell-app-menu__tile-icon[data-shape=shapeless] img[data-launcher-icon],.env-shell-app-menu__tile-icon[data-shape=shapeless] ui-icon{object-fit:contain}.env-shell-app-menu__tile-icon[data-shape=shapeless] :is(img.sd-icon-silhouette,ui-icon.sd-icon-silhouette){filter:brightness(0) blur(6px);inset:0;object-fit:contain;opacity:.4;pointer-events:none;position:absolute;transform:translateY(10%);z-index:0}.env-shell-app-menu__tile-icon[data-shape=shapeless] .ui-ws-item-icon-img:not(.sd-icon-silhouette),.env-shell-app-menu__tile-icon[data-shape=shapeless] img[data-launcher-icon]:not(.sd-icon-silhouette){filter:none;object-fit:contain;z-index:2}.env-shell-app-menu__tile-icon[data-shape=shapeless][data-icon-display=glyph] ui-icon:not(.sd-icon-silhouette){filter:drop-shadow(0 2px 5px rgba(0,0,0,.4))}.env-shell-app-menu__tile-icon[data-shape=shapeless][data-icon-display=glyph] .sd-icon-silhouette{display:none}.env-shell-app-menu__tile-icon img[data-icon-pending],.env-shell-app-menu__tile-icon img[data-launcher-icon]:not([src]),.env-shell-app-menu__tile-icon ui-icon[data-icon-pending]{opacity:0;visibility:hidden}.env-shell-app-menu__tile-icon .ui-ws-item-icon-img[data-launcher-icon],.env-shell-app-menu__tile-icon img[data-launcher-icon]{block-size:100%;border-radius:0;display:block;inline-size:100%;inset:0;max-block-size:none;max-inline-size:none;object-fit:cover;object-position:center;pointer-events:none;position:absolute;transform:scale(var(--sd-item-icon-scale,var(--sd-launcher-icon-scale,1.28)));transform-origin:center;z-index:1}.env-shell-app-menu__tile-icon .ui-ws-item-icon-img[data-launcher-icon][data-icon-pack],.env-shell-app-menu__tile-icon img[data-launcher-icon][data-icon-pack]{transform:scale(var(--sd-item-icon-scale,var(--sd-launcher-icon-scale,1.28)))}.env-shell-app-menu__tile-icon .env-shell-app-menu__tile-favicon:not([data-launcher-icon]),.env-shell-app-menu__tile-icon .ui-ws-item-icon-img:not([data-launcher-icon]){block-size:1.75rem;border-radius:4px;display:block;inline-size:1.75rem;max-block-size:90%;max-inline-size:90%;object-fit:contain;object-position:center;pointer-events:none;position:relative;z-index:1}.env-shell-app-menu__tile-icon ui-icon{block-size:1.75rem!important;display:inline-grid!important;inline-size:1.75rem!important;max-block-size:1.75rem!important;max-inline-size:1.75rem!important;min-block-size:1.75rem!important;min-inline-size:1.75rem!important;position:relative;z-index:1;--icon-size:1.75rem;--icon-padding:0px;--icon-color:currentColor;color:inherit;pointer-events:none}.env-shell-app-menu__tile-icon ui-icon[data-launcher-icon]{block-size:100%!important;inline-size:100%!important;inset:0;max-block-size:none!important;max-inline-size:none!important;min-block-size:0!important;min-inline-size:0!important;position:absolute;--icon-size:100%;--icon-padding:0px;pointer-events:none;transform:scale(1.28);transform-origin:center;z-index:1}.env-shell-app-menu__tile-label{display:-webkit-box;-webkit-box-orient:vertical;font:500 .68rem/1.15 ui-sans-serif,system-ui,sans-serif;-webkit-line-clamp:2;overflow:hidden;word-break:break-word}.env-shell-app-menu__empty{font:400 .85rem/1.3 ui-sans-serif,system-ui,sans-serif;grid-column:1/-1;margin:.5rem 0;opacity:.75;text-align:center}@keyframes e{0%{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}.env-shell-app-menu__pin-menu{background:var(--env-app-menu-surface);border:1px solid light-dark(color-mix(in oklab,#000 12%,transparent),color-mix(in oklab,#fff 14%,transparent));border-radius:10px;box-shadow:0 12px 32px -12px light-dark(rgba(0,0,0,.22),rgba(0,0,0,.45)),0 2px 8px -2px light-dark(rgba(0,0,0,.12),rgba(0,0,0,.25));color:var(--env-app-menu-ink);color-scheme:inherit;display:grid;gap:.25rem;min-inline-size:10rem;padding:.35rem;position:fixed;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 4)}.env-shell-app-menu__pin-action{inline-size:100%;justify-content:start;text-align:start}}.env-shell-root[data-env-crx=\"1\"]{isolation:isolate}html[data-cwsp-native-shell=capacitor],html[data-cwsp-native-shell=capacitor] body{background:transparent;--cwsp-native-safe-top:var(--env-native-safe-top, env(safe-area-inset-top, 0px));--cwsp-native-safe-bottom:var(--env-native-safe-bottom, env(safe-area-inset-bottom, 0px))}.env-shell-root[data-capacitor-native] .env-ui-statusbar,.env-shell-root[data-capacitor-native] ui-statusbar.env-ui-statusbar,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-ui-statusbar,html[data-cwsp-native-shell=capacitor] .env-shell-root ui-statusbar.env-ui-statusbar{display:none!important}.env-shell-root[data-capacitor-native],.env-shell-root[data-capacitor-native] .env-shell-chrome[data-status-overlay],html[data-cwsp-native-shell=capacitor] .env-shell-root,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-chrome[data-status-overlay]{--env-status-inset-top:0px}.env-shell-root[data-capacitor-native] .env-shell-workspace>ui-window.env-ui-window[managed][data-mobile-max]:not([minimized]),html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace>ui-window.env-ui-window[managed][data-mobile-max]:not([minimized]){--ui-win-radius:0;background:var(--color-surface-container,var(--ui-win-titlebar-bg,Canvas));border-radius:0;box-shadow:none}.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed][data-no-titlebar]:not([minimized])>.env-ui-window__body,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed][data-no-titlebar]:not([minimized])>.env-ui-window__body{background:var(--color-surface-container,var(--sv-surface-2,var(--ui-win-titlebar-bg,Canvas)));box-sizing:border-box;padding-block-end:0;padding-block-start:var(--cwsp-native-safe-top)}.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .env-ui-window__view-host,.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer,.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer__content,.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .wf-mounted-view.view-explorer,.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized])>.env-ui-window__body,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .env-ui-window__view-host,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer__content,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .wf-mounted-view.view-explorer,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized])>.env-ui-window__body{align-self:stretch;block-size:100%;box-sizing:border-box;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden}.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer{background:var(--color-surface-container,var(--color-surface,var(--view-bg,light-dark(#f7f8fc,#1a1d24))));border:none;border-radius:0;color:var(--color-on-surface,var(--view-fg,light-dark(#1a1c1f,#e8eaed)));font-family:var(--font-family,var(--explorer-font-sans,system-ui,sans-serif));font-size:.875rem;line-height:1.5}.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer ui-file-manager,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer ui-file-manager{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;padding-block-end:0}.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host],.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .cw-view-viewer-shell,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host],html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .cw-view-viewer-shell{align-self:stretch;block-size:100%;box-sizing:border-box;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden}.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .view-viewer,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .view-viewer{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden}@media screen and (pointer:coarse) and (hover:none){.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed] .view-explorer,html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed] .view-explorer{--explorer-row-height:3rem}}";
//#endregion
//#region src/frontend/ai-slop/window/environment-shell.ts
/**
* WHY: Hybrid SoT (plan 1C): wallpaper / SpeedDial / OrientDesktop / taskbar / statusbar /
* `ui-window` layer come from `environment-shell` modules; CWSP views load from app `views/*`.
*
* INVARIANT: Do **not** mount workspace under `cw-shell-*` closed/open shadow. Document-adopted
* SpeedDial + viewer SCSS cannot pierce that shadow — labels/toolbars look “unstyled”.
* Match `environment-shell/demo/boot.ts`: `<env-shell-container>` + light-DOM slotted layers.
*/
defineEnvironmentShellContainer();
function isNativeCapacitorShell() {
	try {
		if (document.documentElement.dataset.cwspNativeShell === "capacitor") return true;
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
}
/** `?native=1` or path `/explorer` with native query → mono native start set. */
function readStartNativeViewIds() {
	try {
		const sp = new URLSearchParams(globalThis.location?.search || "");
		if (sp.get("native") !== "1" && sp.get("native") !== "true") return [];
		const view = (sp.get("view") || "").trim().toLowerCase();
		let path = String(globalThis.location?.pathname || "").replace(/^\/+|\/+$/g, "").toLowerCase();
		const mount = path.match(/^(cwsp|markdown|kvm)\/(.+)$/);
		if (mount?.[2]) path = mount[2];
		const fromPath = path.split("/")[0] || "";
		const id = ((fromPath && fromPath !== "home" ? fromPath : view) || "explorer").split("/")[0] || "explorer";
		if (!id || id === "home") return ["explorer"];
		return [id === "markdown" ? "viewer" : id];
	} catch {
		return [];
	}
}
function wantsNative(opts) {
	const p = opts || {};
	return p.native === 1 || p.native === "1" || p.native === true || p.params?.native === "1" || p.params?.native === "true";
}
function mergeNativeOpt(viewId, opts) {
	if (!readStartNativeViewIds().includes(viewId) && !wantsNative(opts)) return opts || {};
	const base = { ...opts || {} };
	base.native = "1";
	base.params = {
		...base.params || {},
		native: "1"
	};
	return base;
}
var CWSP_VIEW_LOADERS = {
	network: () => import("../chunks/src6.js"),
	settings: () => import("../chunks/src7.js"),
	explorer: () => import("./app7.js"),
	viewer: () => import("../chunks/src8.js"),
	markdown: () => import("../chunks/src8.js"),
	history: () => import("../chunks/src4.js"),
	workcenter: () => import("./app19.js").then((n) => n.t),
	editor: () => import("../chunks/src3.js"),
	home: () => import("../chunks/src5.js")
};
/** Views allowed as Speed Dial / floating windows (no airpad). */
var CWSP_LAUNCHER_VIEWS = [
	"home",
	"network",
	"settings",
	"explorer",
	"viewer",
	"history",
	"workcenter",
	"editor"
];
async function seedCwspLauncherTiles() {
	try {
		const mod = await import("../chunks/launcher-state.js").then((n) => n.j);
		const items = mod.speedDialItems;
		if (!items || typeof items.findIndex !== "function") return;
		let removedAirpad = false;
		for (let i = items.length - 1; i >= 0; i--) {
			const it = items[i];
			const view = String(it?.meta?.view || "").toLowerCase();
			const id = String(it?.id || "").toLowerCase();
			if (view === "airpad" || id.includes("airpad")) {
				items.splice(i, 1);
				removedAirpad = true;
			}
		}
		if (removedAirpad) mod.persistSpeedDialItems?.();
	} catch (err) {
		console.warn("[EnvironmentShell] speed-dial seed skipped", err);
	}
}
var EnvironmentShell = class extends ShellBase {
	id = "environment";
	name = "Environment";
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: true,
		supportsWindowing: true
	};
	workspaceEl = null;
	homeMountEl = null;
	windowLayer = null;
	chromeDispose = null;
	wallpaperLifecycleDispose = null;
	homeUnmount = null;
	shellActivityDispose = null;
	focusedTaskId = ref("home");
	setFocusedTaskId = null;
	syncWindowTasks = null;
	navEcho = ref("");
	mqLabel = ref("desktop");
	/** Mono `?native=1` boot — Home desktop deferred until exit-native / explicit Home. */
	_monoNativeBoot = false;
	_pendingHomeMount = null;
	/** Unused — light-DOM mount builds nodes imperatively (see {@link mount}). */
	createLayout() {
		return document.createElement("div");
	}
	getStylesheet() {
		return main_default;
	}
	/**
	* Light-DOM environment host (demo parity). Avoids `cw-shell-environment` shadow so
	* document-adopted SpeedDial / viewer / veela styles reach launcher + window bodies.
	*/
	async mount(container) {
		if (this.mounted) {
			console.warn(`[${this.id}] Shell already mounted`);
			return;
		}
		this.container = container;
		seedEnvironmentWallpaperIfUnset("/assets/wallpaper.jpg");
		defineEnvironmentShellContainer();
		try {
			await preloadStyle(wf_demo_default);
			loadInlineStyle(wf_demo_default);
		} catch (err) {
			console.warn("[EnvironmentShell] wf-demo tokens failed", err);
		}
		const envCss = this.getStylesheet();
		if (envCss) try {
			await preloadStyle(envCss);
			loadInlineStyle(envCss);
		} catch (err) {
			console.warn("[EnvironmentShell] env shell styles failed", err);
		}
		try {
			ensureStyleSheet();
		} catch {}
		try {
			document.documentElement.dataset.cwspSurface = "environment";
		} catch {}
		const host = createEnvironmentShellContainer();
		host.className = "env-shell-root wf-demo-root";
		host.setAttribute("data-shell", "environment");
		host.setAttribute("data-shell-system", "task-tab");
		host.style.gridColumn = "content-column";
		host.style.gridRow = "content-row";
		host.style.alignSelf = "stretch";
		host.style.justifySelf = "stretch";
		host.style.minInlineSize = "0";
		host.style.minBlockSize = "0";
		host.style.inlineSize = "100%";
		host.style.blockSize = "100%";
		host.style.pointerEvents = "auto";
		const wallpaper = document.createElement("div");
		wallpaper.slot = SHELL_SLOT.underlying;
		wallpaper.className = "env-shell-wallpaper";
		wallpaper.setAttribute("data-env-wallpaper", "");
		const workspace = document.createElement("div");
		workspace.className = "env-shell-workspace";
		workspace.setAttribute("data-shell-content", "");
		const homeMount = document.createElement("div");
		homeMount.className = "env-shell-home-mount";
		homeMount.style.display = "flex";
		homeMount.style.flex = "1 1 auto";
		homeMount.style.flexDirection = "column";
		homeMount.style.alignSelf = "stretch";
		homeMount.style.minHeight = "0";
		homeMount.style.minWidth = "0";
		workspace.appendChild(homeMount);
		host.append(wallpaper, workspace);
		container.replaceChildren(host);
		this.rootElement = host;
		this.workspaceEl = workspace;
		this.homeMountEl = homeMount;
		this.contentContainer = workspace;
		this.overlayContainer = host.overlayMount ?? host.shadowRoot?.querySelector?.("[data-shell-overlays]") ?? null;
		this.mounted = true;
		this.shellActivityDispose = initBootShellWindowActivity(this.id);
		const nativeCapacitor = isNativeCapacitorShell();
		if (nativeCapacitor) {
			host.dataset.capacitorNative = "";
			document.documentElement.dataset.cwspNativeShell = document.documentElement.dataset.cwspNativeShell || "capacitor";
		}
		try {
			restoreWallpaperThemeCache();
			if (nativeCapacitor) seedEnvironmentWallpaperIfUnset("/assets/wallpaper.jpg");
			initializeAppCanvasLayer(wallpaper);
			const repaintWallpaperIfVisible = () => {
				if (document.visibilityState !== "visible") return;
				try {
					refreshAppWallpaperPaint();
				} catch {}
			};
			window.addEventListener("pageshow", repaintWallpaperIfVisible);
			document.addEventListener("visibilitychange", repaintWallpaperIfVisible);
			this.wallpaperLifecycleDispose = () => {
				window.removeEventListener("pageshow", repaintWallpaperIfVisible);
				document.removeEventListener("visibilitychange", repaintWallpaperIfVisible);
			};
		} catch (err) {
			console.warn("[EnvironmentShell] wallpaper init failed", err);
		}
		const loaders = {};
		for (const id of CWSP_LAUNCHER_VIEWS) {
			if (id === "home") continue;
			if (!isEnabledView(id) && id !== "viewer") continue;
			const loader = CWSP_VIEW_LOADERS[id];
			if (loader) loaders[id] = loader;
		}
		if (loaders.viewer) loaders.markdown = loaders.viewer;
		const mobileMq = matchMedia("(max-width: 640px)");
		this.mqLabel.value = mobileMq.matches ? "mobile" : "desktop";
		mobileMq.addEventListener("change", () => {
			this.mqLabel.value = mobileMq.matches ? "mobile" : "desktop";
		});
		const chrome = mountEnvironmentChrome(host, {
			shell: {
				selectedPath: ref(""),
				viewerStatus: ref(""),
				navEcho: this.navEcho,
				mqLabel: this.mqLabel
			},
			introHtml: `<p><strong>CWSP environment</strong> — Speed Dial / desktop launcher. Views open in <code>ui-window</code>.</p>`,
			taskbar: {
				focusedTaskId: this.focusedTaskId,
				onHome: () => this.focusHome(),
				onViewer: () => {
					this.openInWindow("viewer");
				},
				onWindowTask: (viewId) => {
					this.openInWindow(viewId);
				},
				onMinimizeWindow: (viewId) => {
					const id = String(viewId || "").trim().toLowerCase();
					if (!id) return;
					if (this.windowLayer?.minimizeWindow?.(id)) {
						this.setFocusedTaskId?.("home");
						this.focusedTaskId.value = "home";
					}
				},
				onCloseWindow: (viewId) => {
					const id = String(viewId || "").trim().toLowerCase();
					if (!id) return;
					this.windowLayer?.closeWindow?.(id);
					if (String(this.focusedTaskId.value || "") === id) {
						this.setFocusedTaskId?.("home");
						this.focusedTaskId.value = "home";
					}
				}
			}
		});
		this.setFocusedTaskId = chrome.taskbar?.setFocusedTaskId ?? null;
		this.syncWindowTasks = chrome.taskbar?.syncWindowTasks ?? null;
		if (document.documentElement.dataset.cwspShellRole === "launcher" || globalThis.__RS_SHELL_ROLE__ === "launcher") registerLauncherHomeLifecycleHooks({
			navigateHome: () => this.focusHome(),
			openAppMenu: () => chrome.taskbar?.openAppMenu?.(),
			openAppMenuPage: () => chrome.taskbar?.openAppMenuPage?.() ?? chrome.taskbar?.appMenu?.openPage?.(),
			closeAppMenu: () => chrome.taskbar?.appMenu?.close(),
			isAppMenuOpen: () => Boolean(chrome.taskbar?.appMenu?.isOpen()),
			tryConsumeBack: () => {
				if (hasActiveCloseable()) return closeHighestPriority() != null;
				if (chrome.taskbar?.isSwitcherOpen?.()) {
					chrome.taskbar.closeSwitcher?.();
					return true;
				}
				return false;
			}
		});
		this.chromeDispose = () => {
			chrome.disposeDevice();
			chrome.taskbar?.dispose?.();
			chrome.root.remove();
		};
		const startNativeViewIds = readStartNativeViewIds();
		this.windowLayer = createWorkspaceWindowLayer(workspace, {
			overlayMountHost: host,
			environmentShellHost: host,
			viewLoaders: loaders,
			startNativeViewIds,
			viewTitles: {
				network: "Network",
				settings: "Settings",
				explorer: "Explorer",
				viewer: "Markdown",
				browser: "Browser",
				history: "History",
				workcenter: "Work Center",
				editor: "Editor"
			},
			onTaskingChange: (windows) => {
				this.syncWindowTasks?.(windows);
				const focused = windows.find((w) => w.focused);
				if (focused) this.setFocusedTaskId?.(focused.id);
			}
		});
		const shellContext = {
			...this.windowLayer.shellContext,
			navigate: (viewId, opts) => {
				this.navEcho.value = `shell.navigate("${viewId}")`;
				this.routeView(String(viewId), opts);
			},
			openView: (viewId, opts) => {
				this.navEcho.value = `shell.openView("${viewId}")`;
				this.routeView(String(viewId), opts);
			},
			showMessage: (msg) => {
				this.showMessage(typeof msg === "string" ? msg : String(msg ?? ""));
			}
		};
		seedCwspLauncherTiles();
		if (startNativeViewIds.length > 0) {
			for (const vid of startNativeViewIds) this.openInWindow(vid, {
				native: "1",
				params: { native: "1" }
			});
			this._monoNativeBoot = true;
			this._pendingHomeMount = {
				homeMount,
				shellContext: { shellContext }
			};
		} else this.mountHomeDesktop(homeMount, shellContext);
	}
	mountHomeDesktop(homeMount, shellContext) {
		mountViewModule(() => import("../chunks/src5.js"), homeMount, { shellContext }).then((unmount) => {
			this.homeUnmount = unmount;
		}).catch((err) => {
			console.warn("[EnvironmentShell] home-view failed", err);
			homeMount.innerHTML = `<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`;
		});
	}
	/** Lazily mount Home when leaving mono native (or user presses Home). */
	ensureHomeMounted() {
		const pending = this._pendingHomeMount;
		if (!pending || this.homeUnmount) return;
		this._pendingHomeMount = null;
		this._monoNativeBoot = false;
		this.mountHomeDesktop(pending.homeMount, pending.shellContext.shellContext);
	}
	syncLauncherHomeAddressBar() {
		if (typeof location === "undefined" || typeof history === "undefined") return;
		try {
			const sp = new URLSearchParams(location.search || "");
			sp.set("shell", this.id);
			sp.delete("native");
			sp.delete("view");
			const search = sp.toString() ? `?${sp.toString()}` : "";
			let pathname = location.pathname || "/";
			const seg = pathname.replace(/^\/+|\/+$/g, "").split("/")[0]?.toLowerCase() || "";
			if ((/* @__PURE__ */ new Set([
				"settings",
				"explorer",
				"viewer",
				"markdown",
				"network",
				"history",
				"workcenter",
				"editor"
			])).has(seg)) pathname = "/";
			const next = `${pathname}${search}`;
			if (`${location.pathname}${location.search}` !== next) history.replaceState({
				viewId: "home",
				params: Object.fromEntries(sp)
			}, "", next);
		} catch {}
	}
	focusHome() {
		this.ensureHomeMounted();
		if (typeof this.windowLayer?.minimizeAllWindows === "function") this.windowLayer.minimizeAllWindows();
		else {
			for (const t of this.windowLayer?.listWindowTasks?.() ?? []) this.windowLayer?.minimizeWindow?.(t.id);
			this.windowLayer?.blurWindows?.();
		}
		this.setFocusedTaskId?.("home");
		this.focusedTaskId.value = "home";
		this.currentView.value = "home";
		this.syncLauncherHomeAddressBar();
		try {
			refreshAppWallpaperPaint();
		} catch {}
	}
	openInWindow(viewId, opts) {
		const id = String(viewId || "").trim().toLowerCase();
		if (!id || id === "airpad") return;
		const withNative = mergeNativeOpt(id, opts);
		this.windowLayer?.shellContext.openView?.(id, withNative);
		if (wantsNative(withNative)) {
			const promote = () => {
				this.windowLayer?.enterNative?.(id);
				this.preserveNativeDeepLink(id);
			};
			promote();
			requestAnimationFrame(promote);
			setTimeout(promote, 0);
		}
		this.setFocusedTaskId?.(id === "markdown" ? "viewer" : id);
		this.currentView.value = id;
	}
	/**
	* Keep mono-native deep link as a readable path: `/settings?shell=…&native=1&view=settings`.
	* WHY: root `/?view=` looked “wrong” in the address bar; path + view= stay in sync so
	* BootLoader / readStartNativeViewIds still resolve after reloads.
	* INVARIANT: do not leave a stale `#env-viewer` (tasking) on a Settings mono window.
	*/
	preserveNativeDeepLink(viewId) {
		if (typeof location === "undefined" || typeof history === "undefined") return;
		try {
			const id = String(viewId || "").trim().toLowerCase();
			if (!id || id === "home") return;
			const sp = new URLSearchParams(location.search || "");
			sp.set("shell", this.id);
			sp.set("native", "1");
			sp.set("view", id);
			const next = `${`/${id}`}?${sp.toString()}`;
			if (`${location.pathname}${location.search}${location.hash || ""}` !== next) history.replaceState({
				viewId: id,
				params: Object.fromEntries(sp)
			}, "", next);
		} catch {}
	}
	async routeView(viewId, opts) {
		const id = String(viewId || "").trim().toLowerCase();
		if (!id || id === "airpad") return;
		if (id === "home") {
			this.focusHome();
			return;
		}
		this.openInWindow(id, opts);
	}
	async navigate(viewId, params, _navOptions) {
		const id = String(viewId || "home").toLowerCase();
		if (id === "airpad") {
			this.showMessage("AirPad view is disabled in environment shell");
			return;
		}
		if (id === "home") {
			const startNative = readStartNativeViewIds();
			if (startNative.length) {
				for (const vid of startNative) this.openInWindow(vid, {
					native: "1",
					params: {
						native: "1",
						...params || {}
					}
				});
				return;
			}
			this.focusHome();
			return;
		}
		let urlParams = {};
		try {
			urlParams = Object.fromEntries(new URLSearchParams(location.search || ""));
		} catch {
			urlParams = {};
		}
		const merged = {
			...urlParams,
			...params || {}
		};
		const opts = { params: merged };
		if (merged.native === "1" || merged.native === "true" || readStartNativeViewIds().includes(id)) {
			opts.native = "1";
			opts.params = {
				...merged,
				native: "1"
			};
		}
		this.openInWindow(id, opts);
	}
	unmount() {
		try {
			this.homeUnmount?.();
		} catch {}
		this.homeUnmount = null;
		try {
			this.windowLayer?.dispose();
		} catch {}
		this.windowLayer = null;
		try {
			this.chromeDispose?.();
		} catch {}
		this.chromeDispose = null;
		try {
			this.shellActivityDispose?.();
		} catch {}
		this.shellActivityDispose = null;
		try {
			this.wallpaperLifecycleDispose?.();
		} catch {}
		this.wallpaperLifecycleDispose = null;
		if (document.documentElement.dataset.cwspShellRole === "launcher" || globalThis.__RS_SHELL_ROLE__ === "launcher") registerLauncherHomeLifecycleHooks(null);
		if (this.mounted && this.container && this.rootElement) try {
			if (this.container.contains(this.rootElement)) this.rootElement.remove();
		} catch {}
		this.rootElement = null;
		this.contentContainer = null;
		this.overlayContainer = null;
		this.workspaceEl = null;
		this.homeMountEl = null;
		this.container = null;
		this.mounted = false;
	}
};
function createEnvironmentShell(_container) {
	return new EnvironmentShell();
}
//#endregion
export { createEnvironmentShell as n, EnvironmentShell as t };
