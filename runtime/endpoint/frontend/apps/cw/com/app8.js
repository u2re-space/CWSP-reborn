import { I as H, P as defineElement, T as registerTransientOverlay, W as navigate, k as bindOutsideDismiss } from "../vendor/culori.js";
import { w as inferIconDisplay } from "./app4.js";
import { c as __decorate, o as UIElement, y as resolveBookmarksMenuApi } from "./app5.js";
import { h as flyout_default, m as quick_settings_default } from "../fest/veela.js";
import { MOCElement, addEvent } from "/fest/dom.js";
import { preloadStyle as preloadStyle$1 } from "/fest/style-lib.js";
import "/fest/icon.js";
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/view-opener.ts
var VIEW_OPENER_BOOT = "__CWSP_SPEED_DIAL_VIEW_OPENER_V1__";
var bootSlot = (key) => {
	const g = globalThis;
	return {
		get: () => key in g ? g[key] : null,
		set: (v) => {
			g[key] = v;
		}
	};
};
var openerSlot = bootSlot(VIEW_OPENER_BOOT);
function getSpeedDialViewOpener() {
	const fn = openerSlot.get();
	return typeof fn === "function" ? fn : null;
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
//#region ../../modules/projects/fl.ui/src/ui/navigation/calendar/CalendarFlyout.ts
var styled$1 = preloadStyle$1(flyout_default);
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
		return styled$1;
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
//#region ../../modules/projects/fl.ui/src/ui/navigation/settings/QuickSettings.ts
/**
* WHY: Singleton `ui-quick-settings` custom element mounted into the shared ChromeFlyout
* overlay root (see `../flyout/ChromeFlyout`), exclusive with the calendar flyout via the
* shared registry. Theme toggling and the night-light/brightness overlay filters are local,
* dependency-free helpers — no hard import of the app-level Theme/Settings subsystem — so
* this component stays usable standalone inside `fl.ui`. Apps that ship a real Theme
* subsystem can still react via the `u2-theme-change` event this module dispatches.
*/
var styled = preloadStyle$1(quick_settings_default);
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
	styles = () => styled;
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
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/android-icon-ref.ts
var VARIANT_ALIASES = {
	default: "default",
	full: "default",
	colored: "default",
	monochrome: "monochrome",
	mono: "monochrome",
	material: "monochrome",
	"material-you": "monochrome",
	themed: "monochrome",
	foreground: "foreground",
	fg: "foreground",
	"adaptive-fg": "foreground"
};
function normalizeAndroidIconVariant(raw) {
	return VARIANT_ALIASES[String(raw || "default").trim().toLowerCase()] || "default";
}
/** Durable resource: `android-icon:com.pkg`, `?v=`, `?pack=`, `?drawable=`. */
function isAndroidIconRef(raw) {
	return String(raw || "").trim().toLowerCase().startsWith("android-icon:");
}
function formatAndroidIconRef(packageName, variant = "default", pack = "", drawable = "") {
	const pkg = String(packageName || "").trim();
	if (!pkg) return "";
	const v = normalizeAndroidIconVariant(variant);
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	const params = new URLSearchParams();
	if (v !== "default") params.set("v", v);
	if (packPkg) params.set("pack", packPkg);
	if (draw) params.set("drawable", draw);
	const q = params.toString();
	return q ? `android-icon:${pkg}?${q}` : `android-icon:${pkg}`;
}
function parseAndroidIconRef(raw) {
	const input = String(raw || "").trim();
	if (!isAndroidIconRef(input)) return null;
	const body = input.slice(13).replace(/^\/\//, "");
	if (!body) return null;
	const finish = (pkg, params) => {
		if (!pkg) return null;
		const parsed = {
			packageName: pkg,
			variant: normalizeAndroidIconVariant(params.get("v") || "default")
		};
		const pack = String(params.get("pack") || "").trim();
		const drawable = String(params.get("drawable") || "").trim();
		if (pack) parsed.pack = pack;
		if (drawable) parsed.drawable = drawable;
		return parsed;
	};
	try {
		const url = new URL(body.includes("://") ? body : `android-icon://${body}`);
		return finish(String(url.hostname || url.pathname.replace(/^\//, "") || "").trim(), url.searchParams);
	} catch {
		const [pkgPart, query = ""] = body.split("?");
		return finish(String(pkgPart || "").trim(), new URLSearchParams(query));
	}
}
/** Cache key so default / mono / fg / pack / drawable / pixel size don't collide. */
function androidIconCacheKey(packageName, variant = "default", pack = "", drawable = "", sizePx = 0) {
	const pkg = String(packageName || "").trim();
	if (!pkg) return "";
	const v = normalizeAndroidIconVariant(variant);
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	let key = v === "default" ? pkg : `${pkg}#${v}`;
	if (packPkg) key = `${key}#pack:${packPkg}`;
	if (draw) key = `${key}#d:${draw}`;
	const sz = Math.round(Number(sizePx) || 0);
	if (sz > 0) key = `${key}#s${sz}`;
	return key;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/action-registry.ts
var registeredLauncherBridge = null;
/** In-memory cache: Android package → blob: object URL (web-native image). */
var launcherIconObjectUrlCache = /* @__PURE__ */ new Map();
var launcherIconInflight = /* @__PURE__ */ new Map();
async function dataUrlToObjectUrl(dataUrl) {
	const blob = await (await fetch(dataUrl)).blob();
	const type = blob.type && blob.type.startsWith("image/") ? blob.type : "image/png";
	const normalized = blob.type === type ? blob : new Blob([await blob.arrayBuffer()], { type });
	return URL.createObjectURL(normalized);
}
/** Cached blob URL for an Android launcher icon, if already fetched this session. */
/**
* Parse `shortcut:pkg::id` (current) or `shortcut:pkg/id` (COMPAT).
* WHY: Material Files ids are file paths (`/storage/...`); first-slash split is fragile.
*/
function parseShortcutCacheKey(cacheKey) {
	const raw = String(cacheKey || "").trim();
	if (!raw.startsWith("shortcut:")) return null;
	const rest = raw.slice(9);
	const sep = rest.indexOf("::");
	if (sep > 0) {
		const packageName = rest.slice(0, sep).trim();
		const shortcutId = rest.slice(sep + 2).trim();
		return packageName && shortcutId ? {
			packageName,
			shortcutId
		} : null;
	}
	const slash = rest.indexOf("/");
	if (slash > 0) {
		const packageName = rest.slice(0, slash).trim();
		const shortcutId = rest.slice(slash + 1).trim();
		return packageName && shortcutId ? {
			packageName,
			shortcutId
		} : null;
	}
	return null;
}
function getCachedLauncherIconObjectUrl(cacheKey, size = 96, variant = "default", pack = "", drawable = "") {
	const pkg = String(cacheKey || "").trim();
	if (!pkg) return "";
	const shortcut = parseShortcutCacheKey(pkg);
	if (shortcut) return getCachedShortcutIconObjectUrl(shortcut.packageName, shortcut.shortcutId, size);
	return launcherIconObjectUrlCache.get(androidIconCacheKey(pkg, variant, pack, drawable, size)) || "";
}
var shortcutIconObjectUrlCache = /* @__PURE__ */ new Map();
var shortcutIconInflight = /* @__PURE__ */ new Map();
/** Fetch pinned-shortcut icon (document thumbnail / type icon), not the app icon. */
async function ensureShortcutIconObjectUrl(pkg, shortcutId, size = 96) {
	const packageName = String(pkg || "").trim();
	const id = String(shortcutId || "").trim();
	if (!packageName || !id) return "";
	const sz = Math.max(16, Math.min(512, Math.round(Number(size) || 96)));
	const key = `shortcut:${packageName}/${id}@${sz}`;
	const cached = shortcutIconObjectUrlCache.get(key);
	if (cached) return cached;
	let inflight = shortcutIconInflight.get(key);
	if (!inflight) {
		inflight = (async () => {
			const bridge = await resolveLauncherBridgeForSpeedDial();
			if (!bridge?.launcherShortcutIcon) return "";
			let dataUrl = "";
			try {
				dataUrl = String(await bridge.launcherShortcutIcon(packageName, id, sz) || "").trim();
			} catch {
				return "";
			}
			if (!dataUrl) return "";
			try {
				const objectUrl = await dataUrlToObjectUrl(dataUrl);
				shortcutIconObjectUrlCache.set(key, objectUrl);
				return objectUrl;
			} catch {
				return dataUrl;
			}
		})().finally(() => {
			shortcutIconInflight.delete(key);
		});
		shortcutIconInflight.set(key, inflight);
	}
	return inflight;
}
function getCachedShortcutIconObjectUrl(pkg, shortcutId, size = 96) {
	const packageName = String(pkg || "").trim();
	const id = String(shortcutId || "").trim();
	if (!packageName || !id) return "";
	const sz = Math.max(16, Math.min(512, Math.round(Number(size) || 96)));
	return shortcutIconObjectUrlCache.get(`shortcut:${packageName}/${id}@${sz}`) || "";
}
/** Fetch native icon once, convert data: URL → blob: object URL for WebView. */
async function ensureLauncherIconObjectUrl(cacheKey, size = 96, variant = "default", pack = "", drawable = "") {
	const pkg = String(cacheKey || "").trim();
	if (!pkg) return "";
	const shortcut = parseShortcutCacheKey(pkg);
	if (shortcut) return ensureShortcutIconObjectUrl(shortcut.packageName, shortcut.shortcutId, size);
	const v = normalizeAndroidIconVariant(variant);
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	const sz = Math.max(16, Math.min(512, Math.round(Number(size) || 96)));
	const key = androidIconCacheKey(pkg, v, packPkg, draw, sz);
	const cached = launcherIconObjectUrlCache.get(key);
	if (cached) return cached;
	let inflight = launcherIconInflight.get(key);
	if (!inflight) {
		inflight = (async () => {
			const bridge = await resolveLauncherBridgeForSpeedDial();
			if (!bridge?.launcherIcon) return "";
			let dataUrl = "";
			try {
				dataUrl = await bridge.launcherIcon(pkg, sz, v, packPkg || void 0, draw || void 0);
			} catch {
				return "";
			}
			if (!dataUrl) return "";
			try {
				const objectUrl = await dataUrlToObjectUrl(dataUrl);
				launcherIconObjectUrlCache.set(key, objectUrl);
				return objectUrl;
			} catch {
				return "";
			}
		})();
		launcherIconInflight.set(key, inflight);
	}
	try {
		return await inflight;
	} finally {
		launcherIconInflight.delete(key);
	}
}
/** Resolve durable `android-icon:` ref (or return plain URL as-is). */
async function resolveIconResourceUrl(raw, size = 96) {
	const u = String(raw || "").trim();
	if (!u || u.startsWith("blob:")) return "";
	const parsed = parseAndroidIconRef(u);
	if (parsed) return ensureLauncherIconObjectUrl(parsed.packageName, size, parsed.variant, parsed.pack || "", parsed.drawable || "");
	return u;
}
function getCachedIconResourceObjectUrl(raw, size = 96) {
	const parsed = parseAndroidIconRef(raw);
	if (!parsed) return "";
	return getCachedLauncherIconObjectUrl(parsed.packageName, size, parsed.variant, parsed.pack || "", parsed.drawable || "");
}
async function resolveLauncherBridgeForSpeedDial() {
	if (registeredLauncherBridge) return registeredLauncherBridge;
	try {
		return await import("../chunks/launcher-bridge.js").then((n) => n.t);
	} catch {
		return null;
	}
}
async function getLauncherBridgeForSpeedDial() {
	return resolveLauncherBridgeForSpeedDial();
}
/** Launch a sibling ecosystem APK by SKU (launcher HOME only). */
async function launchEcosystemSku(sku) {
	const { androidPackageForSku, isCwspSku } = await import("../chunks/ecosystem-skus2.js").then((n) => n.t);
	if (!isCwspSku(sku)) return false;
	const pkg = androidPackageForSku(sku);
	if (!pkg) return false;
	const bridge = await resolveLauncherBridgeForSpeedDial();
	if (!bridge?.launcherLaunch) return false;
	return bridge.launcherLaunch(pkg);
}
/** Native launcher APK only — web `u2re.space` opens explorer/document/process in-process. */
async function tryLaunchSiblingView(view) {
	try {
		const { isCwspNativeHost, readCwspSku, siblingSkuForView } = await import("../chunks/ecosystem-skus2.js").then((n) => n.t);
		if (!isCwspNativeHost()) return false;
		const sku = readCwspSku();
		if (sku !== "launcher" && sku !== "explorer") return false;
		const sibling = siblingSkuForView(view);
		if (!sibling) return false;
		return launchEcosystemSku(sibling);
	} catch {
		return false;
	}
}
/** Apply fetched Android icon to a launcher `ui-icon` via resource + presentation mode. */
function applyLauncherIconToUiIcon(host, objectUrl, mode = "colored") {
	const url = String(objectUrl || "").trim();
	if (!url) return;
	host.setAttribute("icon-padding", "0");
	host.style.setProperty("--icon-padding", "0px");
	host.style.setProperty("--icon-size", "100%");
	host.toggleAttribute("data-launcher-icon", true);
	const apply = () => {
		const icon = host;
		if (typeof icon.setResourceIcon !== "function") return false;
		icon.setResourceIcon(url, mode === "auto" ? "auto" : mode);
		if (mode !== "auto" && typeof icon.setBitmapPresentationMode === "function") icon.setBitmapPresentationMode(mode, true);
		host.removeAttribute("data-icon-pending");
		host.toggleAttribute("data-launcher-icon-ready", true);
		return true;
	};
	if (apply()) return;
	customElements.whenDefined("ui-icon").then(() => {
		if (!host.isConnected) return;
		apply();
	});
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/icon-resource-picker.ts
var VARIANT_FALLBACK = [
	{
		id: "default",
		label: "Default"
	},
	{
		id: "monochrome",
		label: "Material You"
	},
	{
		id: "foreground",
		label: "Adaptive FG"
	}
];
function resolveTheme(theme) {
	if (theme === "light" || theme === "dark") return theme;
	return String(document.documentElement.getAttribute("data-theme") || "").toLowerCase() === "light" ? "light" : "dark";
}
function httpPageUrl(raw) {
	const u = String(raw || "").trim();
	return /^https?:\/\//i.test(u) ? u : "";
}
function googleS2Favicon(pageUrl, size = 128) {
	try {
		const host = new URL(pageUrl).hostname;
		if (!host) return "";
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
	} catch {
		return "";
	}
}
function chromeExtensionFavicon(pageUrl, size = 128) {
	try {
		const chromeRt = globalThis.chrome?.runtime;
		if (typeof chromeRt?.getURL !== "function") return "";
		const u = new URL(chromeRt.getURL("/_favicon/"));
		u.searchParams.set("pageUrl", pageUrl);
		u.searchParams.set("size", String(size));
		return u.toString();
	} catch {
		return "";
	}
}
function resolveFaviconCandidates(pageUrl, api) {
	const page = httpPageUrl(pageUrl);
	if (!page) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (label, url) => {
		const u = String(url || "").trim();
		if (!u || seen.has(u)) return;
		seen.add(u);
		out.push({
			label,
			url: u
		});
	};
	const fromApi = api?.resolveIconUrl?.(page, 128) || api?.resolveIconUrl?.(page, 64) || "";
	const s2 = googleS2Favicon(page, 128);
	if (s2) push("Google S2", s2);
	const s2sm = googleS2Favicon(page, 64);
	if (s2sm) push("Google S2 (64)", s2sm);
	const chromeFav = chromeExtensionFavicon(page, 128);
	if (chromeFav) push("Chrome favicon", chromeFav);
	if (fromApi) push("Bookmark favicon", fromApi);
	return out;
}
var PICKER_GRID_COLS = "repeat(auto-fill, minmax(4.75rem, 1fr))";
var pin = (el, props) => {
	for (const [name, value] of Object.entries(props)) el.style.setProperty(name, value, "important");
};
function pinPickerGrid(grid) {
	pin(grid, {
		display: "grid",
		"grid-template-columns": PICKER_GRID_COLS,
		gap: "0.5rem 0.4rem",
		"align-content": "start",
		"justify-content": "stretch",
		"min-inline-size": "0",
		"min-block-size": "0",
		"inline-size": "100%"
	});
}
function pinPickerCard(btn, img, caption) {
	pin(btn, {
		display: "grid",
		"grid-template-columns": "minmax(0, 1fr)",
		"grid-template-rows": "auto max-content",
		"justify-items": "center",
		"align-content": "start",
		"align-items": "start",
		"flex-direction": "column",
		gap: "0.3rem",
		margin: "0",
		padding: "0.2rem 0.08rem 0.15rem",
		"min-inline-size": "0",
		"inline-size": "100%",
		"max-inline-size": "100%",
		"block-size": "auto",
		"min-block-size": "0",
		background: "transparent",
		border: "0",
		"border-radius": "0.7rem",
		"box-shadow": "none",
		appearance: "none",
		"-webkit-appearance": "none",
		position: "static",
		"z-index": "auto",
		overflow: "hidden"
	});
	pin(img, {
		display: "block",
		"grid-row": "1",
		"inline-size": "3rem",
		"block-size": "3rem",
		"max-inline-size": "3rem",
		"max-block-size": "3rem",
		"object-fit": "cover",
		"border-radius": "50%",
		"flex-shrink": "0"
	});
	pin(caption, {
		display: "block",
		"grid-row": "2",
		"inline-size": "100%",
		"max-inline-size": "100%",
		overflow: "hidden",
		"text-overflow": "ellipsis",
		"white-space": "nowrap",
		"font-size": "0.62rem",
		"line-height": "1.2",
		"text-align": "center",
		opacity: "0.88"
	});
}
function makeCard(label, title) {
	const btn = document.createElement("button");
	btn.type = "button";
	btn.className = "sd-icon-picker__card";
	btn.title = title || label;
	const img = document.createElement("img");
	img.alt = "";
	img.decoding = "async";
	img.draggable = false;
	img.referrerPolicy = "no-referrer";
	const caption = document.createElement("span");
	caption.className = "sd-icon-picker__card-label";
	caption.textContent = label;
	btn.append(img, caption);
	pinPickerCard(btn, img, caption);
	return {
		btn,
		img
	};
}
async function loadVariantCards(bridge, pkg, host, onPick, close) {
	host.replaceChildren();
	let variants = VARIANT_FALLBACK.map((v) => ({
		...v,
		available: true
	}));
	try {
		const listed = await bridge.launcherIconVariants?.(pkg);
		if (Array.isArray(listed) && listed.length) variants = listed.map((v) => ({
			id: normalizeAndroidIconVariant(v.id),
			label: String(v.label || v.id),
			available: v.available !== false
		}));
	} catch {}
	for (const v of variants) {
		if (!v.available && v.id !== "default") continue;
		const { btn, img } = makeCard(v.label);
		host.append(btn);
		ensureLauncherIconObjectUrl(pkg, 96, v.id).then((url) => {
			if (!url) {
				btn.disabled = true;
				btn.title = `${v.label} (unavailable)`;
				return;
			}
			img.src = url;
		});
		btn.addEventListener("click", () => {
			onPick({
				iconUrl: formatAndroidIconRef(pkg, v.id),
				packageName: pkg,
				variant: v.id,
				label: v.label,
				source: "android"
			});
			close();
		});
	}
}
async function loadIconPackCards(bridge, targetPkg, host, onPick, close) {
	host.replaceChildren();
	host.classList.remove("sd-icon-picker__grid--browse");
	pinPickerGrid(host);
	if (!bridge.launcherIconPacks) {
		host.textContent = "Icon packs unavailable.";
		return;
	}
	let packs = [];
	try {
		packs = await bridge.launcherIconPacks();
	} catch {
		host.textContent = "Failed to list icon packs.";
		return;
	}
	if (!packs.length) {
		host.textContent = "No icon packs installed.";
		return;
	}
	const frag = document.createDocumentFragment();
	for (const pack of packs.slice(0, 64)) {
		const packPkg = String(pack.packageName || "").trim();
		if (!packPkg) continue;
		const label = String(pack.label || packPkg);
		const wrap = document.createElement("div");
		wrap.className = "sd-icon-picker__pack-wrap";
		pin(wrap, {
			position: "relative",
			"min-inline-size": "0",
			"inline-size": "100%"
		});
		const { btn, img } = makeCard(label, `${label} — tap to apply, grid to browse`);
		ensureLauncherIconObjectUrl(targetPkg, 96, "default", packPkg).then((url) => {
			if (url) {
				img.src = url;
				return;
			}
			btn.disabled = true;
			btn.title = `${label} (no cover for this app)`;
			ensureLauncherIconObjectUrl(packPkg, 72, "default").then((packIcon) => {
				if (packIcon) img.src = packIcon;
			});
		});
		btn.addEventListener("click", () => {
			if (btn.disabled) return;
			onPick({
				iconUrl: formatAndroidIconRef(targetPkg, "default", packPkg),
				packageName: targetPkg,
				variant: "default",
				pack: packPkg,
				label,
				source: "icon-pack"
			});
			close();
		});
		const browse = document.createElement("button");
		browse.type = "button";
		browse.className = "sd-icon-picker__pack-browse";
		pin(browse, {
			position: "absolute",
			"inset-block-start": "0",
			"inset-inline-end": "0",
			display: "grid",
			"place-items": "center",
			margin: "0",
			padding: "0",
			"inline-size": "1.2rem",
			"block-size": "1.2rem",
			"min-inline-size": "1.2rem",
			"min-block-size": "1.2rem",
			border: "0",
			"border-radius": "999px"
		});
		browse.title = `Browse icons in ${label}`;
		browse.setAttribute("aria-label", `Browse icons in ${label}`);
		browse.innerHTML = "<ui-icon icon=\"squares-four\" aria-hidden=\"true\"></ui-icon>";
		browse.addEventListener("click", (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			host.dataset.packBrowse = "1";
			loadPackDrawableBrowse(bridge, targetPkg, packPkg, label, host, onPick, close, () => {
				delete host.dataset.packBrowse;
				loadIconPackCards(bridge, targetPkg, host, onPick, close);
			});
		});
		wrap.append(btn, browse);
		frag.append(wrap);
	}
	host.append(frag);
}
async function loadPackDrawableBrowse(bridge, targetPkg, packPkg, packLabel, host, onPick, close, onBack) {
	host.replaceChildren();
	host.classList.add("sd-icon-picker__grid--browse");
	host.style.setProperty("display", "grid", "important");
	host.style.setProperty("grid-template-columns", "minmax(0, 1fr)", "important");
	host.style.setProperty("grid-template-rows", "auto minmax(0, 1fr)", "important");
	host.style.setProperty("gap", "0.35rem", "important");
	const toolbar = document.createElement("div");
	toolbar.className = "sd-icon-picker__pack-toolbar";
	const back = document.createElement("button");
	back.type = "button";
	back.className = "sd-icon-picker__pack-back";
	back.textContent = "Packs";
	back.addEventListener("click", () => onBack());
	const title = document.createElement("span");
	title.className = "sd-icon-picker__pack-title";
	title.textContent = packLabel;
	const search = document.createElement("input");
	search.type = "search";
	search.placeholder = "Filter…";
	search.autocomplete = "off";
	search.className = "sd-icon-picker__search";
	toolbar.append(back, title, search);
	const grid = document.createElement("div");
	grid.className = "sd-icon-picker__grid";
	pinPickerGrid(grid);
	host.append(toolbar, grid);
	let timer = 0;
	const refresh = () => {
		(async () => {
			grid.replaceChildren();
			if (!bridge.launcherIconPackIcons) {
				grid.textContent = "Pack browse unavailable.";
				return;
			}
			let icons = [];
			try {
				icons = await bridge.launcherIconPackIcons(packPkg, String(search.value || ""), 96);
			} catch {
				grid.textContent = "Failed to list pack icons.";
				return;
			}
			if (!icons.length) {
				grid.textContent = "No matching icons.";
				return;
			}
			const frag = document.createDocumentFragment();
			const resolvePkg = targetPkg || packPkg;
			for (const icon of icons) {
				const drawable = String(icon.drawable || "").trim();
				if (!drawable) continue;
				const { btn, img } = makeCard(String(icon.label || drawable), `${packLabel}: ${drawable}`);
				frag.append(btn);
				ensureLauncherIconObjectUrl(resolvePkg, 72, "default", packPkg, drawable).then((url) => {
					if (url) img.src = url;
					else btn.disabled = true;
				});
				btn.addEventListener("click", () => {
					if (btn.disabled) return;
					onPick({
						iconUrl: formatAndroidIconRef(resolvePkg, "default", packPkg, drawable),
						packageName: resolvePkg,
						variant: "default",
						pack: packPkg,
						drawable,
						label: String(icon.label || drawable),
						source: "icon-pack"
					});
					close();
				});
			}
			grid.append(frag);
		})();
	};
	search.addEventListener("input", () => {
		window.clearTimeout(timer);
		timer = window.setTimeout(refresh, 160);
	});
	refresh();
}
async function loadAppBrowse(bridge, query, host, onPick, close) {
	host.replaceChildren();
	if (!bridge.launcherList) {
		host.textContent = "App list unavailable.";
		return;
	}
	let apps = [];
	try {
		apps = await bridge.launcherList(query);
	} catch {
		host.textContent = "Failed to list apps.";
		return;
	}
	if (!apps.length) {
		host.textContent = query.trim() ? "No matches." : "No apps.";
		return;
	}
	const frag = document.createDocumentFragment();
	for (const app of apps.slice(0, 96)) {
		const pkg = String(app.packageName || "").trim();
		if (!pkg) continue;
		const { btn, img } = makeCard(String(app.label || pkg), `${app.label} (${pkg})`);
		frag.append(btn);
		ensureLauncherIconObjectUrl(String(app.iconCacheKey || pkg).trim() || pkg, 72, "default").then((url) => {
			if (url) img.src = url;
		});
		btn.addEventListener("click", () => {
			onPick({
				iconUrl: formatAndroidIconRef(pkg, "default"),
				packageName: pkg,
				variant: "default",
				label: String(app.label || pkg),
				source: "android"
			});
			close();
		});
	}
	host.append(frag);
}
function loadFaviconVariantCards(pageUrl, api, host, onPick, close) {
	host.replaceChildren();
	const candidates = resolveFaviconCandidates(pageUrl, api);
	if (!candidates.length) {
		host.textContent = "No favicon sources for this URL.";
		return;
	}
	for (const c of candidates) {
		const { btn, img } = makeCard(c.label, c.url);
		img.src = c.url;
		img.addEventListener("error", () => {
			btn.disabled = true;
			btn.title = `${c.label} (failed to load)`;
		});
		btn.addEventListener("click", () => {
			onPick({
				iconUrl: c.url,
				label: c.label,
				source: "favicon"
			});
			close();
		});
		host.append(btn);
	}
}
async function loadBookmarkBrowse(api, query, host, onPick, close) {
	host.replaceChildren();
	let entries = [];
	try {
		const q = String(query || "").trim();
		entries = q ? await api.search(q) : await api.listChildren();
	} catch {
		host.textContent = "Failed to list bookmarks.";
		return;
	}
	const links = entries.filter((e) => !e.folder && httpPageUrl(e.url));
	if (!links.length) {
		host.textContent = query.trim() ? "No matching bookmarks." : "No bookmarks.";
		return;
	}
	const frag = document.createDocumentFragment();
	for (const entry of links.slice(0, 80)) {
		const page = httpPageUrl(entry.url);
		if (!page) continue;
		const icon = api.resolveIconUrl?.(page, 64) || chromeExtensionFavicon(page, 64) || googleS2Favicon(page, 64);
		const { btn, img } = makeCard(String(entry.title || page), page);
		if (icon) img.src = icon;
		frag.append(btn);
		btn.addEventListener("click", () => {
			const preferred = api.resolveIconUrl?.(page, 128) || chromeExtensionFavicon(page, 128) || googleS2Favicon(page, 128) || icon;
			if (!preferred) return;
			onPick({
				iconUrl: preferred,
				label: String(entry.title || page),
				source: "bookmark"
			});
			close();
		});
	}
	host.append(frag);
}
/**
* Modal picker:
* - Capacitor: Material You / adaptive + icon packs + installed apps (`android-icon:`)
* - CRX: favicon variants for a page URL + browse Chrome bookmarks
*/
async function openIconResourcePicker(opts) {
	const bridge = await getLauncherBridgeForSpeedDial();
	const bookmarksApi = resolveBookmarksMenuApi();
	const hasAndroid = Boolean(bridge?.launcherIcon);
	const pageSeed = httpPageUrl(opts.pageUrl) || httpPageUrl(opts.currentUrl) || "";
	if (!hasAndroid && !(Boolean(bookmarksApi) || Boolean(pageSeed))) {
		console.warn("[icon-resource-picker] no launcher bridge or bookmarks/favicon source");
		return;
	}
	const theme = resolveTheme(opts.theme);
	const pkgSeed = String(opts.packageName || "").trim();
	const showAndroidVariants = hasAndroid && Boolean(pkgSeed);
	const showIconPacks = hasAndroid && Boolean(pkgSeed) && Boolean(bridge?.launcherIconPacks);
	const showAndroidBrowse = hasAndroid && Boolean(bridge?.launcherList);
	const showFaviconVariants = Boolean(pageSeed);
	const showBookmarkBrowse = Boolean(bookmarksApi);
	const tabs = [];
	if (showAndroidVariants) tabs.push({
		id: "variants",
		label: "This app"
	});
	if (showIconPacks) tabs.push({
		id: "packs",
		label: "Packs"
	});
	if (showFaviconVariants) tabs.push({
		id: "favicon",
		label: "Link"
	});
	if (showAndroidBrowse) tabs.push({
		id: "browse",
		label: "Apps"
	});
	if (showBookmarkBrowse) tabs.push({
		id: "bookmarks",
		label: "Bookmarks"
	});
	const initialTab = tabs[0]?.id || "browse";
	const dialog = document.createElement("dialog");
	dialog.className = "sd-icon-picker";
	dialog.dataset.theme = theme;
	dialog.dataset.tab = initialTab;
	dialog.innerHTML = `
        <form class="sd-icon-picker__form" data-theme="${theme}" method="dialog">
            <header class="sd-icon-picker__header">
                <h2 class="sd-icon-picker__title">Icon</h2>
                <nav class="sd-icon-picker__tabs" role="tablist" aria-label="Icon source"></nav>
                <input class="sd-icon-picker__search" data-search type="search" placeholder="Search…" autocomplete="off" hidden />
            </header>
            <div class="sd-icon-picker__body">
                <section class="sd-icon-picker__section" data-section="variants" hidden>
                    <div class="sd-icon-picker__grid" data-variants></div>
                </section>
                <section class="sd-icon-picker__section" data-section="packs" hidden>
                    <div class="sd-icon-picker__grid" data-packs></div>
                </section>
                <section class="sd-icon-picker__section" data-section="favicon" hidden>
                    <div class="sd-icon-picker__grid" data-favicon></div>
                </section>
                <section class="sd-icon-picker__section" data-section="browse" hidden>
                    <div class="sd-icon-picker__grid" data-browse></div>
                </section>
                <section class="sd-icon-picker__section" data-section="bookmarks" hidden>
                    <div class="sd-icon-picker__grid" data-bookmarks></div>
                </section>
            </div>
            <footer class="sd-icon-picker__footer">
                <button type="button" data-action="cancel" class="sd-icon-picker__cancel">Cancel</button>
            </footer>
        </form>
    `;
	pin(dialog, {
		position: "fixed",
		inset: "0",
		top: "0",
		right: "0",
		bottom: "0",
		left: "0",
		width: "100%",
		height: "100%",
		"inline-size": "100%",
		"block-size": "100%",
		"max-inline-size": "100%",
		"max-block-size": "100%",
		"max-width": "100%",
		"max-height": "100%",
		margin: "0",
		padding: "1rem",
		display: "grid",
		"place-items": "center",
		"place-content": "center",
		background: "transparent",
		border: "none",
		"border-radius": "0",
		"box-shadow": "none",
		overflow: "auto"
	});
	const formEl = dialog.querySelector(".sd-icon-picker__form");
	if (formEl) pin(formEl, {
		display: "flex",
		"flex-direction": "column",
		"inline-size": "min(90cqi, 100dvi)",
		width: "min(90cqi, 100dvi)",
		"max-inline-size": "100%",
		"max-block-size": "min(86dvh, 36rem)",
		margin: "0",
		padding: "0",
		"border-radius": "18px",
		overflow: "hidden",
		"justify-self": "center",
		"align-self": "center",
		background: "color-mix(in oklab, var(--color-surface-container, Canvas) 92%, transparent)"
	});
	const tabsEl = dialog.querySelector(".sd-icon-picker__tabs");
	if (tabsEl) pin(tabsEl, {
		display: "grid",
		"grid-auto-flow": "column",
		"grid-auto-columns": "1fr",
		gap: "0.28rem",
		"inline-size": "100%"
	});
	const bodyEl = dialog.querySelector(".sd-icon-picker__body");
	if (bodyEl) pin(bodyEl, {
		display: "block",
		padding: "0.65rem 0.85rem 0.45rem",
		"min-block-size": "0",
		"max-block-size": "min(26rem, 52dvh)",
		overflow: "auto",
		background: "transparent"
	});
	const footerEl = dialog.querySelector(".sd-icon-picker__footer");
	if (footerEl) pin(footerEl, {
		display: "flex",
		"justify-content": "flex-end",
		"align-items": "center",
		gap: "0.45rem",
		padding: "0.55rem 0.85rem 0.7rem"
	});
	const cancelEl = dialog.querySelector(".sd-icon-picker__cancel");
	if (cancelEl) pin(cancelEl, {
		display: "inline-flex",
		"align-items": "center",
		"justify-content": "center",
		flex: "0 0 auto",
		margin: "0",
		padding: "0.42rem 0.86rem",
		"inline-size": "auto",
		width: "auto",
		"min-inline-size": "0",
		"max-inline-size": "none",
		"border-radius": "0.65rem"
	});
	const form = dialog.querySelector("form");
	const tablist = dialog.querySelector(".sd-icon-picker__tabs");
	const search = dialog.querySelector("[data-search]");
	const variantsHost = dialog.querySelector("[data-variants]");
	const packsHost = dialog.querySelector("[data-packs]");
	const faviconHost = dialog.querySelector("[data-favicon]");
	const browseHost = dialog.querySelector("[data-browse]");
	const bookmarksHost = dialog.querySelector("[data-bookmarks]");
	let closed = false;
	const close = () => {
		if (closed) return;
		closed = true;
		try {
			if (dialog.open) dialog.close();
		} catch {}
		dialog.remove();
	};
	const onPick = (pick) => {
		opts.onPick(pick);
	};
	form.addEventListener("click", (ev) => {
		if (ev.target?.closest?.("[data-action]")?.getAttribute("data-action") === "cancel") {
			ev.preventDefault();
			close();
		}
	});
	dialog.addEventListener("cancel", (ev) => {
		ev.preventDefault();
		close();
	});
	dialog.addEventListener("click", (ev) => {
		if (ev.target === dialog) close();
	});
	const setTab = (id) => {
		dialog.dataset.tab = id;
		dialog.querySelectorAll("[data-section]").forEach((section) => {
			section.hidden = section.dataset.section !== id;
		});
		tablist?.querySelectorAll("[data-tab]").forEach((btn) => {
			const on = btn.dataset.tab === id;
			btn.toggleAttribute("data-active", on);
			btn.setAttribute("aria-selected", on ? "true" : "false");
			btn.tabIndex = on ? 0 : -1;
		});
		const wantsSearch = id === "browse" || id === "bookmarks";
		if (search) {
			search.hidden = !wantsSearch;
			search.placeholder = id === "bookmarks" ? "Search bookmarks…" : "Search apps…";
			if (wantsSearch) search.value = "";
		}
		if (id === "packs" && packsHost?.dataset.packBrowse === "1" && bridge && pkgSeed) {
			delete packsHost.dataset.packBrowse;
			loadIconPackCards(bridge, pkgSeed, packsHost, onPick, close);
		}
	};
	if (tablist) {
		const frag = document.createDocumentFragment();
		for (const tab of tabs) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "sd-icon-picker__tab";
			btn.dataset.tab = tab.id;
			btn.setAttribute("role", "tab");
			btn.textContent = tab.label;
			pin(btn, {
				display: "inline-flex",
				flex: "1 1 0",
				"align-items": "center",
				"justify-content": "center",
				margin: "0",
				padding: "0.38rem 0.4rem",
				border: "0",
				"border-radius": "999px",
				"inline-size": "100%",
				"min-inline-size": "0",
				"block-size": "auto"
			});
			btn.addEventListener("click", (ev) => {
				ev.preventDefault();
				setTab(tab.id);
			});
			frag.append(btn);
		}
		tablist.append(frag);
		tablist.hidden = tabs.length <= 1;
	}
	if (showAndroidVariants && bridge && variantsHost) loadVariantCards(bridge, pkgSeed, variantsHost, onPick, close);
	if (showIconPacks && bridge && packsHost && pkgSeed) loadIconPackCards(bridge, pkgSeed, packsHost, onPick, close);
	if (showFaviconVariants && faviconHost) loadFaviconVariantCards(pageSeed, bookmarksApi, faviconHost, onPick, close);
	let appTimer = 0;
	const refreshApps = () => {
		if (!browseHost || !bridge) return;
		loadAppBrowse(bridge, String(search?.value || ""), browseHost, onPick, close);
	};
	let bmTimer = 0;
	const refreshBookmarks = () => {
		if (!bookmarksHost || !bookmarksApi) return;
		loadBookmarkBrowse(bookmarksApi, String(search?.value || ""), bookmarksHost, onPick, close);
	};
	search?.addEventListener("input", () => {
		const tab = dialog.dataset.tab;
		if (tab === "browse") {
			window.clearTimeout(appTimer);
			appTimer = window.setTimeout(refreshApps, 180);
			return;
		}
		if (tab === "bookmarks") {
			window.clearTimeout(bmTimer);
			bmTimer = window.setTimeout(refreshBookmarks, 180);
		}
	});
	if (showAndroidBrowse) refreshApps();
	if (showBookmarkBrowse && bookmarksApi) refreshBookmarks();
	tablist?.addEventListener("click", (ev) => {
		const id = ev.target?.closest?.("[data-tab]")?.getAttribute("data-tab");
		if (id === "browse") refreshApps();
		if (id === "bookmarks") refreshBookmarks();
	});
	setTab(initialTab);
	document.body.append(dialog);
	dialog.querySelectorAll(".sd-icon-picker__grid").forEach(pinPickerGrid);
	try {
		dialog.showModal();
	} catch {
		dialog.setAttribute("open", "");
	}
}
/** Icon-only button that opens {@link openIconResourcePicker} and fills an input. */
function attachIconResourcePickButton(field, input, opts) {
	let row = field.querySelector(".sd-icon-resource-row");
	if (!row) {
		row = document.createElement("div");
		row.className = "sd-icon-resource-row";
		input.replaceWith(row);
		row.append(input);
	}
	row.style.setProperty("display", "grid", "important");
	row.style.setProperty("grid-template-columns", "minmax(0,1fr) 2.5rem 2.5rem", "important");
	row.style.setProperty("align-items", "stretch", "important");
	row.style.setProperty("gap", "0.45rem", "important");
	row.style.setProperty("min-inline-size", "0", "important");
	row.style.setProperty("inline-size", "100%", "important");
	let btn = row.querySelector("[data-action='pick-icon']");
	if (!btn) {
		btn = document.createElement("button");
		btn.type = "button";
		btn.className = "btn secondary sd-icon-resource-pick";
		btn.setAttribute("data-action", "pick-icon");
		btn.title = "Pick alternative icon";
		btn.setAttribute("aria-label", "Pick alternative icon");
		btn.innerHTML = "<ui-icon icon=\"squares-four\" icon-style=\"duotone\" aria-hidden=\"true\"></ui-icon>";
		row.append(btn);
	}
	let photoBtn = row.querySelector("[data-action='pick-photo']");
	if (!photoBtn) {
		photoBtn = document.createElement("button");
		photoBtn.type = "button";
		photoBtn.className = "btn secondary sd-icon-resource-pick";
		photoBtn.setAttribute("data-action", "pick-photo");
		photoBtn.title = "Use photo / avatar";
		photoBtn.setAttribute("aria-label", "Use photo or avatar");
		photoBtn.innerHTML = "<ui-icon icon=\"user-circle\" icon-style=\"duotone\" aria-hidden=\"true\"></ui-icon>";
		row.append(photoBtn);
	}
	if (input.parentElement !== row) row.insertBefore(input, btn);
	if (btn.parentElement === row && photoBtn.parentElement === row) {
		row.append(btn, photoBtn);
		row.insertBefore(input, btn);
	}
	const stylePickBtn = (el) => {
		el.style.setProperty("display", "inline-flex", "important");
		el.style.setProperty("align-items", "center", "important");
		el.style.setProperty("justify-content", "center", "important");
		el.style.setProperty("inline-size", "2.5rem", "important");
		el.style.setProperty("min-inline-size", "2.5rem", "important");
		el.style.setProperty("max-inline-size", "2.5rem", "important");
		el.style.setProperty("min-block-size", "2.5rem", "important");
		el.style.setProperty("padding", "0", "important");
		el.style.setProperty("margin", "0", "important");
	};
	stylePickBtn(btn);
	stylePickBtn(photoBtn);
	btn.addEventListener("click", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		openIconResourcePicker({
			packageName: typeof opts.packageName === "function" ? opts.packageName() : String(opts.packageName || "").trim(),
			pageUrl: typeof opts.pageUrl === "function" ? opts.pageUrl() : String(opts.pageUrl || "").trim(),
			currentUrl: input.value,
			theme: opts.theme,
			onPick: (pick) => {
				input.value = pick.iconUrl;
				input.setAttribute("value", pick.iconUrl);
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
			}
		});
	});
	photoBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.style.display = "none";
		document.body.append(fileInput);
		fileInput.addEventListener("change", () => {
			const file = fileInput.files?.[0];
			fileInput.remove();
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				const dataUrl = String(reader.result || "").trim();
				if (!dataUrl.startsWith("data:image/")) return;
				input.value = dataUrl;
				input.setAttribute("value", dataUrl);
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
				const display = field.closest("form")?.querySelector("select[name=\"iconDisplay\"]");
				if (display) {
					display.value = "colored";
					display.dispatchEvent(new Event("change", { bubbles: true }));
				}
			};
			reader.readAsDataURL(file);
		}, { once: true });
		fileInput.click();
	});
	return btn;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/app-menu/tile-chrome.ts
var STORAGE_KEY$1 = "cwsp-app-menu-tile-chrome-v1";
var cache = null;
function readAll() {
	if (cache) return cache;
	try {
		const raw = localStorage.getItem(STORAGE_KEY$1);
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
function appMenuChromeKeyForPackage(packageName) {
	return `app:${String(packageName || "").trim()}`;
}
function getAppMenuTileChrome(key) {
	const k = String(key || "").trim();
	if (!k) return {};
	return { ...readAll()[k] || {} };
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/app-menu/app-sort.ts
var APP_MENU_SORT_EVENT = "cwsp:app-menu-sort-change";
var STORAGE_KEY = "cwsp-app-menu-sort";
var APP_MENU_SORT_OPTIONS = [
	["name", "Name"],
	["installed", "Date installed"],
	["updated", "Date updated"],
	["color", "Color (including mask)"],
	["category", "Category"],
	["package", "Package"]
];
var SORT_SET = new Set(APP_MENU_SORT_OPTIONS.map(([v]) => v));
var colorCache = /* @__PURE__ */ new Map();
var normalizeAppMenuSortBy = (raw, fallback = "name") => {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "install" || v === "install-date" || v === "date-installed") return "installed";
	if (v === "update" || v === "update-date" || v === "date-updated" || v === "recent") return "updated";
	if (v === "hue" || v === "colour") return "color";
	return SORT_SET.has(v) ? v : fallback;
};
var normalizeSortDir = (raw, fallback = "asc") => {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "desc" || v === "descending" || v === "newest" || v === "z-a") return "desc";
	if (v === "asc" || v === "ascending" || v === "oldest" || v === "a-z") return "asc";
	return fallback;
};
var defaultDirForAppSort = (sortBy) => sortBy === "installed" || sortBy === "updated" ? "desc" : "asc";
var peekAppMenuSort = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			const sortBy = normalizeAppMenuSortBy(parsed.sortBy);
			return {
				sortBy,
				sortDir: normalizeSortDir(parsed.sortDir, defaultDirForAppSort(sortBy))
			};
		}
	} catch {}
	return {
		sortBy: "name",
		sortDir: "asc"
	};
};
var writeAppMenuSort = (prefs) => {
	const cur = peekAppMenuSort();
	const sortBy = prefs.sortBy != null ? normalizeAppMenuSortBy(prefs.sortBy, cur.sortBy) : cur.sortBy;
	const next = {
		sortBy,
		sortDir: prefs.sortDir != null ? normalizeSortDir(prefs.sortDir, defaultDirForAppSort(sortBy)) : cur.sortDir
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent(APP_MENU_SORT_EVENT, { detail: next }));
	} catch {}
	return next;
};
var cmpStr = (a, b) => a.localeCompare(b, void 0, {
	numeric: true,
	sensitivity: "base"
}) || a.localeCompare(b);
var cmpNum = (a, b) => a === b ? 0 : a < b ? -1 : 1;
var categoryOf = (app) => {
	const cat = String(app.category || "").trim().toLowerCase();
	if (cat) return cat;
	if (app.system) return "system";
	return String(app.installer || "").trim().toLowerCase() || "other";
};
var displayForApp = (app) => {
	const chrome = getAppMenuTileChrome(appMenuChromeKeyForPackage(String(app.packageName || "")));
	return inferIconDisplay({
		iconDisplay: chrome.iconDisplay,
		iconUrl: chrome.iconUrl,
		isLauncherApp: true
	}) || "colored";
};
var parseCssColor = (raw) => {
	const s = String(raw || "").trim();
	const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
	if (hex) {
		const h = hex[1];
		const n = h.length === 3 ? h.split("").map((c) => parseInt(c + c, 16)) : [
			parseInt(h.slice(0, 2), 16),
			parseInt(h.slice(2, 4), 16),
			parseInt(h.slice(4, 6), 16)
		];
		return {
			r: n[0],
			g: n[1],
			b: n[2]
		};
	}
	const rgb = /rgba?\(\s*([\d.]+)[,\s/]+([\d.]+)[,\s/]+([\d.]+)/i.exec(s);
	if (!rgb) return null;
	return {
		r: Number(rgb[1]),
		g: Number(rgb[2]),
		b: Number(rgb[3])
	};
};
var rgbHue = (r, g, b) => {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const d = max - Math.min(rn, gn, bn);
	if (d < 1e-4) return 0;
	let h = 0;
	if (max === rn) h = (gn - bn) / d % 6;
	else if (max === gn) h = (bn - rn) / d + 2;
	else h = (rn - gn) / d + 4;
	h *= 60;
	if (h < 0) h += 360;
	return h;
};
var themeHueFrom = (el) => {
	try {
		const cs = el ? getComputedStyle(el) : getComputedStyle(document.documentElement);
		const rgb = parseCssColor(cs.getPropertyValue("--env-app-menu-ink") || cs.color);
		return rgb ? rgbHue(rgb.r, rgb.g, rgb.b) : 210;
	} catch {
		return 210;
	}
};
var sampleUrlHue = (url, mode, themeHue) => new Promise((resolve) => {
	const img = new Image();
	img.decoding = "async";
	img.onload = () => {
		try {
			const c = document.createElement("canvas");
			c.width = 32;
			c.height = 32;
			const ctx = c.getContext("2d", { willReadFrequently: true });
			if (!ctx) {
				resolve(themeHue);
				return;
			}
			ctx.drawImage(img, 0, 0, 32, 32);
			const data = ctx.getImageData(0, 0, 32, 32).data;
			let wr = 0;
			let wg = 0;
			let wb = 0;
			let wsum = 0;
			for (let i = 0; i < data.length; i += 4) {
				const a = data[i + 3] / 255;
				if (a < .12) continue;
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				const luma = (.2126 * r + .7152 * g + .0722 * b) / 255;
				const mask = mode === "masked-inverse" ? 1 - luma : luma;
				const weight = mode === "colored" ? a : a * (.15 + .85 * mask);
				wr += r * weight;
				wg += g * weight;
				wb += b * weight;
				wsum += weight;
			}
			if (wsum < .001) {
				resolve(themeHue);
				return;
			}
			let hue = rgbHue(wr / wsum, wg / wsum, wb / wsum);
			if (mode === "masked" || mode === "masked-inverse") hue = (hue * .28 + themeHue * .72) % 360;
			resolve(hue);
		} catch {
			resolve(themeHue);
		}
	};
	img.onerror = () => resolve(themeHue);
	img.src = url;
});
var hydrateAppColorKeys = async (apps, themeHost) => {
	const themeHue = themeHueFrom(themeHost);
	const jobs = [];
	for (const app of apps) {
		const pkg = String(app.packageName || app.iconCacheKey || "").trim();
		if (!pkg) continue;
		const mode = displayForApp(app);
		const cacheKey = `${pkg}|${mode}`;
		if (colorCache.has(cacheKey)) continue;
		jobs.push((async () => {
			try {
				const url = await ensureLauncherIconObjectUrl(app.iconCacheKey || pkg, 32);
				const hue = url ? await sampleUrlHue(url, mode, themeHue) : themeHue;
				colorCache.set(cacheKey, hue);
			} catch {
				colorCache.set(cacheKey, themeHue);
			}
		})());
	}
	const chunk = 12;
	for (let i = 0; i < jobs.length; i += chunk) await Promise.all(jobs.slice(i, i + chunk));
};
var colorKeyOf = (app) => {
	const pkg = String(app.packageName || app.iconCacheKey || "").trim();
	const mode = displayForApp(app);
	return colorCache.get(`${pkg}|${mode}`) ?? 0;
};
var sortLauncherApps = (apps, prefs) => {
	const dir = prefs.sortDir === "desc" ? -1 : 1;
	return [...apps].sort((a, b) => {
		let n = 0;
		if (prefs.sortBy === "installed") n = cmpNum(Number(a.firstInstallTime || 0), Number(b.firstInstallTime || 0));
		else if (prefs.sortBy === "updated") n = cmpNum(Number(a.lastUpdateTime || 0), Number(b.lastUpdateTime || 0));
		else if (prefs.sortBy === "color") n = cmpNum(colorKeyOf(a), colorKeyOf(b));
		else if (prefs.sortBy === "category") n = cmpStr(categoryOf(a), categoryOf(b));
		else if (prefs.sortBy === "package") n = cmpStr(String(a.packageName || ""), String(b.packageName || ""));
		else n = cmpStr(String(a.label || a.packageName || ""), String(b.label || b.packageName || ""));
		if (!n) n = cmpStr(String(a.label || ""), String(b.label || ""));
		if (!n) n = cmpStr(String(a.packageName || ""), String(b.packageName || ""));
		return n * dir;
	});
};
//#endregion
export { toggleCalendarFlyout as _, peekAppMenuSort as a, attachIconResourcePickButton as c, getCachedIconResourceObjectUrl as d, getCachedLauncherIconObjectUrl as f, toggleQuickSettingsFlyout as g, isAndroidIconRef as h, hydrateAppColorKeys as i, applyLauncherIconToUiIcon as l, tryLaunchSiblingView as m, APP_MENU_SORT_OPTIONS as n, sortLauncherApps as o, resolveIconResourceUrl as p, defaultDirForAppSort as r, writeAppMenuSort as s, APP_MENU_SORT_EVENT as t, ensureLauncherIconObjectUrl as u, getSpeedDialViewOpener as v };
