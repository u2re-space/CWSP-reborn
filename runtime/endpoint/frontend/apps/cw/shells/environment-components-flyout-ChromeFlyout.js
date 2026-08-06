import { f as isEnabledView } from "../chunks/views.js";
import { O as MOCElement, h as preloadStyle, k as addEvent, m as loadInlineStyle } from "../fest/dom.js";
import { a as booleanRef, l as ref, o as numberRef, r as effect, s as observe } from "../fest/object.js";
import { a as restoreWallpaperThemeCache, r as initializeAppCanvasLayer } from "../vendor/culori.js";
import { c as E, i as H } from "../com/app.js";
import { A as makeTask, M as navigationEnable, O as createPanelUnderShadow, P as defineElement, j as getBy } from "../com/app2.js";
import { i as ensureStyleSheet } from "../fest/icon.js";
import "../chunks/src.js";
import { t as ShellBase } from "../chunks/shells.js";
import { n as initBootShellWindowActivity } from "./preference.js";
import { n as resolveOverlayMountPoint, r as resolveShellOverlaysMount, t as SHELL_SLOT } from "./slots.js";
import { t as __decorate } from "../chunks/decorate.js";
import { n as UIElement, r as UIElement_default, t as openUnifiedContextMenu } from "../com/app4.js";
/** Same as environment-overlay ENV_OVERLAY_Z — above `$z-shell-chrome`. */
var CHROME_FLYOUT_Z = "2147483600";
var openControllers = /* @__PURE__ */ new Map();
var dismissBound = false;
var overlayShellHost = null;
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
var positionFlyout = (el, mode) => {
	const desktop = isDesktopChrome();
	el.style.position = "fixed";
	el.style.zIndex = String(Number(CHROME_FLYOUT_Z) + 1);
	el.style.pointerEvents = "auto";
	el.style.margin = "0";
	if (desktop) {
		el.style.top = "auto";
		el.style.left = "auto";
		el.style.right = "0.75rem";
		el.style.bottom = "4.5rem";
		el.style.transform = "none";
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
var onDocPointerDown = (ev) => {
	const t = ev.target;
	for (const [kind, ctrl] of [...openControllers.entries()]) {
		if (ctrl.contains(t)) continue;
		if (t?.closest?.("[data-chrome-flyout-anchor], .env-shell-taskbar__clock, .env-ui-statusbar__clock, .env-device-tray")) continue;
		closeChromeFlyout(kind);
	}
};
var onDocKeyDown = (ev) => {
	if (ev.key !== "Escape") return;
	closeAllChromeFlyouts();
};
var ensureDismissListeners = () => {
	if (dismissBound) return;
	dismissBound = true;
	document.addEventListener("pointerdown", onDocPointerDown, true);
	document.addEventListener("keydown", onDocKeyDown, true);
};
var releaseDismissListenersIfIdle = () => {
	if (openControllers.size > 0) return;
	if (!dismissBound) return;
	dismissBound = false;
	document.removeEventListener("pointerdown", onDocPointerDown, true);
	document.removeEventListener("keydown", onDocKeyDown, true);
};
var closeChromeFlyout = (kind) => {
	const ctrl = openControllers.get(kind);
	if (!ctrl) return;
	openControllers.delete(kind);
	try {
		const el = ctrl.el;
		if (typeof el.close === "function") el.close();
		else {
			el.removeAttribute("open");
			el.hidden = true;
		}
		el.dispatchEvent(new CustomEvent("chrome-flyout-close", { bubbles: true }));
	} catch {}
	releaseDismissListenersIfIdle();
};
var closeAllChromeFlyouts = () => {
	for (const kind of [...openControllers.keys()]) closeChromeFlyout(kind);
};
/**
* Register an open flyout; closes the other kind (exclusive).
* Caller must already append `el` into the overlay root and call `positionFlyout`.
*/
var registerOpenFlyout = (ctrl) => {
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
	ensureDismissListeners();
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
var styled$3 = preloadStyle(":host{--cal-base-color:var(--color-primary);--cal-surface:var(--color-surface);--cal-on-surface:var(--color-on-surface);--cal-outline:color-mix(in oklab,var(--color-outline-variant) 80%,transparent);--cal-hover:color-mix(in oklab,var(--color-on-surface) 8%,transparent);box-sizing:border-box;color:var(--cal-on-surface);color-scheme:inherit;display:block;max-inline-size:min(360px,96vw);min-inline-size:280px;pointer-events:auto}:host([hidden]){display:none!important}.ui-cal-flyout__panel{background:var(--cal-surface);border:1px solid var(--cal-outline);border-radius:14px;box-shadow:0 18px 44px -18px color-mix(in oklab,#000 55%,transparent),0 2px 6px -2px color-mix(in oklab,#000 35%,transparent);box-sizing:border-box;color:contrast-color(var(--cal-surface));display:flex;flex-direction:column;gap:.6rem;inline-size:100%;padding:.9rem .9rem .75rem}.ui-cal-flyout__header{align-items:baseline;display:flex;justify-content:space-between;padding-inline:.15rem}.ui-cal-flyout__today{color:var(--cal-on-surface);font-size:.95rem;font-weight:650;line-height:1.25;margin:0}.ui-cal-flyout__nav{align-items:center;display:grid;gap:.35rem;grid-template-columns:auto 1fr auto}.ui-cal-flyout__nav-btn{align-items:center;appearance:none;background:transparent;block-size:2rem;border:none;border-radius:8px;color:var(--cal-on-surface);cursor:pointer;display:inline-flex;inline-size:2rem;justify-content:center;padding:0;-webkit-tap-highlight-color:transparent}.ui-cal-flyout__nav-btn ui-icon{--icon-size:1.05rem;--icon-color:currentColor;block-size:var(--icon-size);color:currentColor;inline-size:var(--icon-size);pointer-events:none}.ui-cal-flyout__nav-btn:hover{background:var(--cal-hover);color:contrast-color(var(--cal-hover))}.ui-cal-flyout__nav-btn:active{background:color-mix(in oklab,var(--cal-hover) 160%,transparent);color:contrast-color(color-mix(in oklab,var(--cal-hover) 160%,transparent))}.ui-cal-flyout__nav-btn:focus-visible{outline:2px solid var(--cal-base-color);outline-offset:1px}.ui-cal-flyout__month-label{color:var(--cal-on-surface);font-size:.86rem;font-weight:600;letter-spacing:.01em;text-align:center;user-select:none}.ui-cal-flyout__weekdays{display:grid;gap:2px;grid-template-columns:repeat(7,minmax(0,1fr));padding-inline:.1rem}.ui-cal-flyout__weekday{align-items:center;color:color-mix(in oklab,var(--cal-on-surface) 62%,transparent);display:flex;font-size:.7rem;font-weight:600;justify-content:center;letter-spacing:.02em;padding-block:.2rem;text-transform:uppercase;user-select:none}.ui-cal-flyout__grid{display:grid;gap:2px;grid-template-columns:repeat(7,minmax(0,1fr));padding-inline:.1rem}.ui-cal-flyout__day{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;border:none;border-radius:999px;color:var(--cal-on-surface);cursor:pointer;display:inline-flex;font-size:.82rem;font-variant-numeric:tabular-nums;inline-size:100%;justify-content:center;position:relative;-webkit-tap-highlight-color:transparent;transition:background-color .12s ease,color .12s ease}.ui-cal-flyout__day[data-other-month]{color:color-mix(in oklab,var(--cal-on-surface) 42%,transparent)}.ui-cal-flyout__day:hover{background:var(--cal-hover);color:contrast-color(var(--cal-hover))}.ui-cal-flyout__day:focus-visible{outline:2px solid var(--cal-base-color);outline-offset:1px}.ui-cal-flyout__day[data-today]{background:color-mix(in oklab,var(--cal-base-color) 88%,transparent);color:light-dark(#ffffff,#ffffff);font-weight:700}.ui-cal-flyout__day[data-selected]{box-shadow:0 0 0 2px var(--cal-base-color) inset}.ui-cal-flyout__day[data-today][data-selected]{box-shadow:0 0 0 2px color-mix(in oklab,var(--cal-base-color) 70%,#fff 20%) inset}");
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
		return styled$3;
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
		positionFlyout(el, FLYOUT_KIND$1);
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
var styled$2 = preloadStyle(":host{box-sizing:border-box;color-scheme:inherit;contain:layout style;display:block;pointer-events:auto}:host([data-theme=light]),:host-context(html[data-theme=light]){color-scheme:light only}:host([data-theme=dark]),:host-context(html[data-theme=dark]){color-scheme:dark only}:host([open]){animation:a .14s cubic-bezier(.22,.8,.3,1)}:host([hidden]){display:none!important}@keyframes a{0%{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}@layer ui-quick-settings{.qs-panel{--qs-primary:var(--color-primary);--qs-surface:var(--color-surface);--qs-on-surface:var(--color-on-surface);--qs-outline:color-mix(in oklab,var(--color-outline-variant) 80%,transparent);background:var(--qs-surface);border:1px solid var(--qs-outline);border-radius:14px;box-shadow:0 20px 48px -20px rgba(0,0,0,.4),0 2px 8px -2px rgba(0,0,0,.25);box-sizing:border-box;color:var(--qs-on-surface);display:grid;font:500 .85rem/1.3 ui-sans-serif,system-ui,sans-serif;gap:.85rem;inline-size:min(360px,100vw - 1.5rem);max-inline-size:360px;min-inline-size:320px;padding:.9rem;pointer-events:auto}@supports (color:contrast-color(red)){.qs-panel{color:contrast-color(var(--qs-surface))}}.qs-tiles{display:grid;gap:.5rem;grid-template-columns:repeat(2,minmax(0,1fr))}.qs-tile-icon{--icon-size:1.35rem;--icon-color:currentColor;block-size:var(--icon-size);color:contrast-color(var(--qs-surface));flex:0 0 auto;inline-size:var(--icon-size);line-height:0}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.qs-tile-icon{color:color-mix(in oklch,contrast-color(var(--qs-surface)) 40%,var(--color-primary,var(--qs-primary)))}}.qs-tile{align-items:center;background:color-mix(in oklab,var(--qs-on-surface) 8%,transparent);border:none;border-radius:10px;color:inherit;cursor:pointer;display:flex;gap:.6rem;min-inline-size:0;padding:.55rem .65rem;text-align:start;transition:background-color .14s ease,color .14s ease}.qs-tile,.qs-tile:hover{color:contrast-color(inherit(background-color))}.qs-tile:hover{background:color-mix(in oklab,var(--qs-on-surface) 14%,transparent)}.qs-tile:active{background:color-mix(in oklab,var(--qs-on-surface) 18%,transparent);color:contrast-color(inherit(background-color))}.qs-tile:focus-visible{outline:2px solid var(--color-primary,var(--qs-primary));outline-offset:2px}.qs-tile[aria-pressed=true]{background:color-mix(in oklab,var(--color-primary,var(--qs-primary)) 26%,transparent);color:var(--color-primary,var(--qs-primary))}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.qs-tile[aria-pressed=true]{color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 60%,var(--color-primary,var(--qs-primary)))}}.qs-tile[aria-pressed=true] .qs-tile-icon{--icon-color:var(--color-primary,var(--qs-primary));--icon-color:currentColor}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.qs-tile[aria-pressed=true] .qs-tile-icon{--icon-color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 60%,var(--color-primary,var(--qs-primary)))}}.qs-tile-text{color:color-mix(in oklch,contrast-color(var(--qs-surface)) 40%,var(--color-primary,var(--qs-primary)));display:flex;flex-direction:column;gap:.05rem;min-inline-size:0;overflow:hidden}.qs-tile-label{font-size:.78rem;font-weight:600}.qs-tile-label,.qs-tile-sub{color:contrast-color(var(--qs-surface));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.qs-tile-sub{font-size:.68rem;font-weight:500;opacity:.7}.qs-sliders{border-block-start:1px solid var(--qs-outline);color:contrast-color(var(--qs-surface));display:grid;gap:.6rem;padding-block-start:.7rem}.qs-slider-row{align-items:center;cursor:default;display:flex;gap:.65rem}.qs-slider-icon{--icon-size:1.15rem;--icon-color:currentColor flex:0 0 auto;block-size:var(--icon-size);color:contrast-color(var(--qs-surface));inline-size:var(--icon-size);line-height:0}.qs-slider-col{display:flex;flex:1 1 auto;flex-direction:column;gap:.25rem;min-inline-size:0}.qs-slider-label{font-size:.68rem;font-weight:500;opacity:.75}.qs-slider{appearance:none;-webkit-appearance:none;background:transparent;block-size:1.1rem;color:contrast-color(inherit(background-color));cursor:pointer;inline-size:100%;margin:0}.qs-slider::-webkit-slider-runnable-track{background:color-mix(in oklab,var(--qs-on-surface) 18%,transparent);block-size:4px;border-radius:999px;color:contrast-color(inherit(background-color))}.qs-slider::-moz-range-track{background:color-mix(in oklab,var(--qs-on-surface) 18%,transparent);block-size:4px;border-radius:999px;color:contrast-color(inherit(background-color))}.qs-slider::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;background:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));block-size:1rem;border:none;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));inline-size:1rem;margin-block-start:-6px}.qs-slider::-moz-range-thumb{background:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));block-size:1rem;border:none;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));inline-size:1rem}.qs-slider:focus-visible::-webkit-slider-thumb{background:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));outline:2px solid var(--color-primary,var(--qs-primary));outline-offset:2px}}");
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
*/
var applyQuickTheme = (mode) => {
	const root = document.documentElement;
	root.setAttribute("data-scheme", mode);
	root.setAttribute(THEME_ATTR, mode);
	root.style.colorScheme = mode;
	try {
		if (document.body) document.body.style.colorScheme = mode;
	} catch {}
	try {
		document.querySelectorAll(".env-shell-root, [data-shell], ui-window").forEach((node) => {
			const el = node;
			el.dataset.theme = mode;
			el.style.colorScheme = mode;
			const inner = el.shadowRoot?.querySelector?.(".app-shell");
			if (inner) {
				inner.dataset.theme = mode;
				inner.style.colorScheme = mode;
			}
		});
	} catch {}
	try {
		localStorage.setItem(THEME_STORAGE_KEY, mode);
		localStorage.setItem(THEME_STORAGE_KEY_DOTTED, mode);
	} catch {}
	mergeThemeIntoSettingsBlobs(mode);
	root.dispatchEvent(new CustomEvent("u2-theme-change", {
		bubbles: true,
		detail: {
			source: "quick-settings",
			theme: mode
		}
	}));
};
var unlockOrientationLock = (unlocked) => {
	document.documentElement.style.setProperty("--orientation-lock", unlocked ? "unlocked" : "locked");
	document.documentElement.style.setProperty("--orientation-lock-angle", unlocked ? "0deg" : "90deg");
	Promise.try(() => {
		try {
			if (unlocked) screen.orientation.unlock();
			else screen.orientation.lock(screen.orientation.type || "natural");
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
if (typeof document !== "undefined") if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => restoreQuickFilters(), { once: true });
else restoreQuickFilters();
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
};
var QuickSettings = class QuickSettings extends UIElement {
	constructor() {
		super();
	}
	styles = () => styled$2;
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
		positionFlyout(el, FLYOUT_KIND);
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
Promise.try(() => {
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => {
		Promise.try(() => {
			screen?.orientation?.lock?.("natural");
		}).catch(console.warn.bind(console));
	});
}).catch(console.warn.bind(console));
//#endregion
//#region src/frontend/shells/environment/components/statusbar/statusbar.ts
/**
* WHY: Uses FL-UI `ui-statusbar` (left/center/right slots) — not a parallel component.
* Reactive network/battery chips are shared via {@link attachShellDeviceStatus} for the desktop taskbar.
* Overlay mode (mobile browser / fullscreen, not standalone): transparent top band, time L / icons R.
*/
var styled$1 = preloadStyle(":host(ui-statusbar){align-items:center;background:transparent;box-sizing:border-box;color:var(--env-status-fg,CanvasText);display:flex;flex-direction:row;gap:.35rem;inline-size:100%;justify-content:space-between}:host(ui-statusbar) :is(.center,.left,.right){align-items:center;background:transparent;display:flex;min-inline-size:0;padding-block-start:.5rem}:host(ui-statusbar) .left{flex:0 1 auto;justify-content:flex-start;padding-inline-start:max(1rem,env(safe-area-inset-left,0))}:host(ui-statusbar) .center{flex:1 1 auto;justify-content:center}:host(ui-statusbar) .right{flex:0 1 auto;justify-content:flex-end;margin-inline-start:auto;padding-inline-end:max(1rem,env(safe-area-inset-right,0))}@media screen and (pointer:fine) and ((min-width:768px) or (hover:hover)){:host(ui-statusbar),ui-statusbar{display:none!important}}@layer ui-statusbar{.env-ui-statusbar{backdrop-filter:blur(10px);background:color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent);border-block-start:1px solid var(--wf-md-outline-variant,color-mix(in oklch,white 12%,transparent));color:contrast-color(color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent));order:1;padding:.35rem .65rem calc(.35rem + env(safe-area-inset-bottom, 0))}.env-ui-statusbar__intro p{margin:.1rem 0;opacity:.92}.env-ui-statusbar__right{align-items:center;display:flex;justify-content:flex-end}.env-ui-statusbar__clock{border-radius:.35rem;color:inherit;cursor:pointer;font:600 .8125rem/1 ui-sans-serif,system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.01em;padding:.15rem .25rem;pointer-events:auto;user-select:none}.env-ui-statusbar__clock:focus-visible,.env-ui-statusbar__clock:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--footer{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--footer:focus-visible,.env-device-tray--footer:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-status-bar__tray{align-items:center;display:flex;flex-wrap:nowrap;gap:.35rem}.env-status-bar__chip{align-items:center;background:color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 10%,transparent);border:1px solid color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 18%,transparent);border-radius:999px;color:inherit;color:contrast-color(inherit(background-color));display:inline-flex;gap:.25rem;line-height:1;padding:.12rem .35rem}.env-status-bar__chip ui-icon{color:var(--env-status-fg,inherit);display:block;font-size:1.15rem;--icon-color:var(--env-status-fg,#f5f5f7)}.env-status-bar__pct{font-variant-numeric:tabular-nums;opacity:.95}.env-status-bar__meta{font-size:11px;margin:0;opacity:.88}.env-shell-chrome[data-status-overlay] .env-ui-statusbar,.env-shell-root[data-status-overlay]>.env-shell-chrome .env-ui-statusbar{align-items:center;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));border:0!important;box-sizing:border-box;color:var(--env-status-fg,#f5f5f7);display:flex;inset-block-end:auto;inset-block-start:0;inset-inline:0;min-block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));order:unset;padding:0 .75rem;pointer-events:none;position:fixed;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 2)}.env-shell-chrome[data-status-overlay] :is(.env-status-bar__meta,.env-ui-statusbar__intro){display:none!important}.env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock{color:var(--env-status-fg,#f5f5f7);display:block}.env-shell-chrome[data-status-overlay] :is(.env-device-tray--footer,.env-status-bar__chip){color:var(--env-status-fg,#f5f5f7)}.env-shell-chrome[data-status-overlay] .env-status-bar__chip ui-icon{--icon-color:var(--env-status-fg,#f5f5f7);color:var(--env-status-fg,#f5f5f7)}.env-shell-chrome[data-status-overlay] .env-device-tray--footer{display:flex!important}.env-shell-chrome[data-status-overlay] .env-status-bar__chip{background:transparent;border-color:transparent;padding-inline:.15rem}.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-ui-statusbar__clock,.env-shell-chrome[data-standalone] .env-ui-statusbar,.env-shell-root[data-standalone] .env-shell-chrome:not([data-desktop]) .env-ui-statusbar{display:none!important}.env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop]{opacity:0;pointer-events:none;visibility:hidden}}");
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
/**
* Transparent top status overlay when:
* - mobile browser (not standalone), or
* - PWA / CSS fullscreen, or
* - document fullscreen API on a mobile-sized viewport.
* Standalone installed PWA: no overlay (OS chrome / edge-to-edge windows).
*/
function shouldShowStatusOverlay(opts) {
	if (opts.standalone ?? isShellStandaloneDisplay()) return false;
	const mode = opts.displayMode ?? matchShellDisplayMode();
	const docFs = typeof document !== "undefined" && Boolean(document.fullscreenElement || document.webkitFullscreenElement);
	if (mode === "fullscreen" || docFs) return true;
	return !opts.desktop;
}
function formatStatusClock(d = /* @__PURE__ */ new Date()) {
	try {
		return new Intl.DateTimeFormat(void 0, {
			hour: "numeric",
			minute: "2-digit"
		}).format(d);
	} catch {
		return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
	}
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
		for (let i = 0; i < data.length; i += 4 * step) {
			const r = data[i] / 255;
			const g = data[i + 1] / 255;
			const b = data[i + 2] / 255;
			sum += .2126 * r + .7152 * g + .0722 * b;
			n++;
		}
		return n > 0 ? sum / n : null;
	};
	const applyStatusFg = (luma) => {
		const darkFg = luma > .55;
		target.style.setProperty("--env-status-fg", darkFg ? "#1c1c1e" : "#f5f5f7");
		target.style.setProperty("--env-status-fg-muted", darkFg ? "rgba(28,28,30,0.72)" : "rgba(245,245,247,0.78)");
		target.dataset.statusContrast = darkFg ? "dark" : "light";
	};
	const applyLauncherFg = (luma) => {
		const darkFg = luma > .52;
		target.style.setProperty("--env-launcher-fg", darkFg ? "#141416" : "#f7f7f8");
		target.style.setProperty("--env-launcher-fg-shadow", darkFg ? "rgb(255 255 255 / 0.72)" : "rgb(0 0 0 / 0.88)");
		target.style.setProperty("--env-launcher-fg-glow", darkFg ? "rgb(255 255 255 / 0.35)" : "rgb(0 0 0 / 0.45)");
		target.dataset.launcherContrast = darkFg ? "dark" : "light";
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
		else try {
			const h = Math.max(8, Math.round(parseFloat(getComputedStyle(target).getPropertyValue("--env-status-inset-top")) || 32));
			const canvas = target.querySelector(".env-shell-wallpaper canvas") || document.querySelector(".env-shell-wallpaper canvas");
			if (canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0) {
				const ctx = canvas.getContext("2d", { willReadFrequently: true });
				if (ctx) {
					const sw = canvas.width;
					const shTop = Math.max(1, Math.round(h / Math.max(1, canvas.clientHeight || h) * canvas.height));
					const topLuma = lumaOf(ctx.getImageData(0, 0, sw, Math.min(shTop, canvas.height)).data);
					if (topLuma != null) applyStatusFg(topLuma);
					else {
						const darkUi = matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
						applyStatusFg(darkUi ? .2 : .85);
					}
				}
			} else {
				const darkUi = matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
				applyStatusFg(darkUi ? .2 : .85);
			}
		} catch {
			const darkUi = matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
			applyStatusFg(darkUi ? .2 : .85);
		}
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
						return;
					}
				}
			}
		} catch {}
		const darkUi = matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
		applyLauncherFg(darkUi ? .2 : .85);
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
		mq?.removeEventListener?.("change", schedule);
	};
}
var StatusBar = class StatusBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$1;
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
//#region src/frontend/shells/environment/components/taskbar/element/TaskBar.ts
var styled = preloadStyle("@layer ui-taskbar{.env-shell-chrome{color:var(--wf-md-on-surface-variant,oklch(78% .03 274deg));display:flex;flex-direction:column;font:12px ui-sans-serif,system-ui,sans-serif;gap:0;inset-block-end:0;inset-inline:0;isolation:isolate;pointer-events:none;position:fixed;z-index:var(--env-z-shell-chrome,2147483000)}@supports (color:contrast-color(red)) and (color:oklab(0% 0 0%)){.env-shell-chrome{color:contrast-color(var(--wf-md-on-surface-variant,oklch(78% .03 274deg)))}}.env-shell-chrome>*{pointer-events:auto}.env-shell-taskbar{align-items:stretch;backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);background:color-mix(in oklab,#1a1a1a 72%,transparent);block-size:2.5rem;border-block-start:1px solid color-mix(in oklab,#fff 12%,transparent);box-shadow:none;color:#f3f3f3;color:contrast-color(color-mix(in oklab,#1a1a1a 72%,transparent));display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;min-block-size:2.5rem;order:0;padding:0 .25rem;padding-block-end:env(safe-area-inset-bottom,0);position:relative}.env-shell-taskbar-under,.env-shell-taskbar-under.underlying-shadow-container{overflow:visible!important;pointer-events:none!important;z-index:-1!important}.env-shell-taskbar-under .underlying-shadow-geometry{background:transparent!important;box-shadow:0 -8px 28px rgba(0,0,0,.4)!important}.env-shell-taskbar::part(taskbar){align-items:stretch;display:flex;flex:1;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:100%;min-inline-size:0}.env-shell-taskbar__pins,.env-shell-taskbar__windows{align-items:stretch;display:flex;flex-direction:row;flex-wrap:nowrap;gap:0;min-inline-size:0}.env-shell-taskbar__pins{flex:0 0 auto}.env-shell-taskbar__pins [data-env-home]{backdrop-filter:blur(10px);background-color:color-mix(in oklab,var(--base-color,#1c1c1e) 10%,transparent);outline:1px solid light-dark(rgba(0,0,0,.1333333333),rgba(255,255,255,.1333333333));transform:translateY(-.5rem)}:has(ui-window:not([minimized])) .env-shell-taskbar__pins [data-env-home]{--color-surface:light-dark(--u2-color-mod(var(--base-color-neutralized),10),--u2-color-mod(var(--base-color-neutralized),980));background-color:color-mix(in oklab,var(--color-surface,#1c1c1e) 10%,transparent);color:contrast-color(var(--color-surface,#1c1c1e));--icon-color:contrast-color(var(--color-surface,#1c1c1e))}.env-shell-taskbar__windows{flex:1 1 auto;justify-content:flex-start;overflow-x:auto;scrollbar-width:thin}.env-shell-taskbar ui-task{align-self:stretch;background:transparent;border:0;border-radius:0;box-shadow:inset 0 -2px 0 transparent;color:inherit;cursor:pointer;min-block-size:100%;min-inline-size:2.75rem;opacity:1;outline:none;padding-inline:.55rem}.env-shell-taskbar ui-task:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));opacity:1}.env-shell-taskbar :is(ui-task[data-active],ui-task[data-env-active=true],ui-task[data-focus]){background:color-mix(in oklab,#fff 14%,transparent);box-shadow:inset 0 -2px 0 #60cdff;color:contrast-color(inherit(background-color));opacity:1;outline:none}.env-shell-taskbar ui-task[data-minimized]{opacity:.65}.env-shell-taskbar__tray-host{align-items:center;border-inline-start:1px solid color-mix(in oklab,#fff 12%,transparent);display:flex;flex:0 0 auto;gap:.35rem;margin-inline-start:auto;padding-inline:.35rem}.env-shell-taskbar__clock{align-items:flex-end;border-radius:.35rem;cursor:pointer;display:flex;flex-direction:column;gap:.05rem;justify-content:center;line-height:1.05;min-inline-size:4.5rem;padding-inline:.35rem .15rem;pointer-events:auto;user-select:none}.env-shell-taskbar__clock:focus-visible,.env-shell-taskbar__clock:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--taskbar{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--taskbar:focus-visible,.env-device-tray--taskbar:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-shell-taskbar__clock-time{color:#f3f3f3;font-size:.78rem;font-variant-numeric:tabular-nums;font-weight:600}.env-shell-taskbar__clock-date{color:color-mix(in oklab,#f3f3f3 72%,transparent);font-size:.62rem;font-weight:500;white-space:nowrap}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title){display:none!important}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task{min-inline-size:2.5rem;padding-inline:.45rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter){font-size:.8rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar{display:flex;flex-direction:row;place-content:center;place-items:center;align-items:center;backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;block-size:3rem;border-block-start:none;box-shadow:none;gap:0;justify-content:center;min-block-size:3rem;padding:.15rem .75rem;padding-block-end:calc(.15rem + env(safe-area-inset-bottom, 0px));place-self:center;position:relative}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins{align-items:center;flex:0 0 auto;justify-content:center}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]),.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]{background:transparent;border-radius:999px;box-shadow:none;min-block-size:2.75rem;min-inline-size:2.75rem;padding:0;touch-action:manipulation;user-select:none}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title){display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon){block-size:1.5rem;inline-size:1.5rem}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph){block-size:1.5rem;inline-size:1.5rem;opacity:1}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter){opacity:0}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home]:active,ui-task[data-env-home]:hover){background:color-mix(in oklch,#fff 10%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home][data-active],ui-task[data-env-home][data-env-active=true],ui-task[data-env-home][data-focus]){background:color-mix(in oklch,#fff 8%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-ui-statusbar{display:none!important}}");
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
function formatTrayClock(now = /* @__PURE__ */ new Date()) {
	return {
		time: now.toLocaleTimeString(void 0, {
			hour: "2-digit",
			minute: "2-digit"
		}),
		date: now.toLocaleDateString(void 0, {
			weekday: "short",
			day: "numeric",
			month: "short"
		})
	};
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
	tHome.setAttribute("aria-keyshortcuts", "LongPress");
	pinsHost.append(tHome);
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
	const windowTaskEls = /* @__PURE__ */ new Map();
	let lastWindows = [];
	let longPressTimer = null;
	let longPressFired = false;
	let switcherOpen = false;
	let barUnder = null;
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
	const goHome = () => {
		closeSwitcher();
		getBy(taskList, HOME_TASK).focus = true;
	};
	tHome.addEventListener("click", (ev) => {
		if (longPressFired) {
			ev.preventDefault();
			ev.stopPropagation();
			longPressFired = false;
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
	const syncAcrylicUnder = () => {
		if (!isMobileChrome()) {
			if (!barUnder && bar.isConnected) barUnder = createPanelUnderShadow(bar, {
				className: "env-shell-taskbar-under",
				shadowBlur: 28,
				shadowOffsetY: 8,
				shadowColor: "rgba(0, 0, 0, 0.4)"
			});
		} else if (barUnder) {
			barUnder.destroy();
			barUnder = null;
		}
	};
	queueMicrotask(syncAcrylicUnder);
	const mq = typeof matchMedia === "function" ? matchMedia("(min-width: 641px)") : null;
	const onMq = () => syncAcrylicUnder();
	mq?.addEventListener?.("change", onMq);
	cleanupFns.push(() => mq?.removeEventListener?.("change", onMq));
	const dispose = () => {
		clearLongPress();
		closeSwitcher();
		barUnder?.destroy();
		barUnder = null;
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
		dispose
	};
}
//#endregion
//#region src/frontend/shells/environment/scss/container.scss?inline
var container_default = ":host{box-sizing:border-box;color-scheme:light dark;display:block;isolation:isolate;min-block-size:100dvb;overflow:visible;position:relative}.esc-stack{display:grid;grid-template:1fr/1fr}.esc-layer,.esc-stack{box-sizing:border-box;min-block-size:inherit}.esc-layer{grid-area:1/1}.esc-underlying{overflow:clip;pointer-events:none;z-index:0}.esc-main{align-items:stretch;display:flex;flex-direction:column;min-block-size:inherit;pointer-events:auto;z-index:1}.esc-main,.esc-overlays{overflow:visible;position:relative}.esc-overlays{pointer-events:none;z-index:2}";
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
	const { root, view } = instantiateViewForMount(await importer(), options);
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
var DESK_INSET = 8;
/** When mounted under `.env-shell-root`, add this boost so windows stack above the home layer. */
function readEnvWindowZBoost$1(host) {
	const shell = host?.closest?.(".env-shell-root") ?? host?.closest?.("env-shell-container");
	if (!(shell instanceof HTMLElement)) return 0;
	const raw = getComputedStyle(shell).getPropertyValue("--env-window-z-boost").trim();
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) ? n : 0;
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
		win.style.left = `${DESK_INSET}px`;
		win.style.top = `${DESK_INSET}px`;
		win.style.right = `${DESK_INSET}px`;
		win.style.bottom = `${DESK_INSET}px`;
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
		const zBoost = readEnvWindowZBoost$1(host);
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
		const noTitlebar = standalone && mqMobile && !isNative && !isMin;
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
			win.style.bottom = "var(--env-mobile-dock-reserve, 3.25rem)";
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
	onMq();
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
		const zBoost = readEnvWindowZBoost$1(host);
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
function readEnvWindowZBoost(workspace) {
	const shell = workspace.closest?.(".env-shell-root") ?? workspace.closest?.("env-shell-container") ?? workspace.parentElement;
	if (!(shell instanceof HTMLElement)) return 0;
	const raw = getComputedStyle(shell).getPropertyValue("--env-window-z-boost").trim();
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) ? n : 0;
}
var VIEW_ICONS = {
	home: "house",
	viewer: "article",
	markdown: "article",
	explorer: "books",
	settings: "gear-six",
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
	explorer: "Explorer",
	settings: "Settings",
	workcenter: "Work Center",
	history: "History",
	editor: "Editor",
	network: "Network",
	task: "Plan",
	event: "Events",
	bonus: "Bonuses",
	person: "Contacts"
};
/**
* Package-local defaults intentionally empty.
* WHY: relative `../../../views/*-view` imports break when this file is consumed via
* CWSP-shell's symlink (`src/frontend/shells/environment` → modules). Hosts must pass
* {@link WorkspaceWindowLayerOptions.viewLoaders} (CWSP adapter / demo boot).
*/
function defaultViewLoaderForId(_viewId) {
	return null;
}
function titleForView(viewId, overrides) {
	const id = normalizeMarkdownViewWindowId(viewId) || String(viewId || "").trim().toLowerCase();
	if (overrides?.[id]) return overrides[id];
	if (VIEW_TITLES[id]) return VIEW_TITLES[id];
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
	const emitTasking = () => {
		options.onTaskingChange?.(listWindowTasks());
	};
	const listWindowTasks = () => {
		const out = [];
		for (const m of managed.values()) {
			if (!findKeyedFrame(workspace, m.key)) continue;
			out.push({
				id: m.key,
				title: m.model.title || titleForView(m.key, options.viewTitles),
				icon: VIEW_ICONS[m.key] || "app-window",
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
			if (frame.parentElement === workspace) workspace.appendChild(frame);
		}
		emitTasking();
	};
	const shellContext = {};
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
		const id = normalizeMarkdownViewWindowId(viewId) || String(viewId || "").trim().toLowerCase();
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
		const id = normalizeMarkdownViewWindowId(String(viewId || ""));
		if (!id || id === "home") return;
		if (id === "airpad") return;
		if (isMarkdownViewManagedWindowKey(id) && options.readerWindow?.content) {
			openReaderWindow();
			return;
		}
		const wantNative = new Set((options.startNativeViewIds || []).map((v) => normalizeMarkdownViewWindowId(String(v || "")))).has(id) || String(opts?.native || "") === "1" || String(opts?.params?.native || "") === "1";
		const existing = managed.get(id);
		if (existing && findKeyedFrame(workspace, id)) {
			elevateModel(existing.model, id);
			if (wantNative && existing.model.nativeMode) {
				existing.model.nativeMode.value = true;
				existing.model.minimized.value = false;
				existing.model.visible.value = true;
				exitNativeExcept(id);
			}
			return;
		}
		if (existing && !findKeyedFrame(workspace, id)) {
			existing.disposeView?.();
			managed.delete(id);
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
		const model = createChromeModel(titleForView(id, options.viewTitles), {
			x: 72 + offset,
			y: 72 + offset,
			w: 640,
			h: 480,
			z: topZ.value + 1
		});
		topZ.value = model.z.value;
		let disposeFrame = () => {};
		disposeFrame = mountUiWindow(workspace, model, body, () => elevateModel(model, id), {
			managedViewKey: id,
			startNative: wantNative,
			onChromeChange: emitTasking,
			onClose: () => {
				const m = managed.get(id);
				if (!m) return;
				managed.delete(id);
				if (focusedKey === id) focusedKey = null;
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
			exitNativeExcept(id);
		}
		const rec = {
			key: id,
			model,
			disposeFrame,
			disposeView: void 0
		};
		managed.set(id, rec);
		elevateModel(model, id);
		const mountOpts = {
			...opts || {},
			shellContext
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
			const cur = managed.get(id);
			if (cur) cur.disposeView = unmountView;
			if (wantNative || model.nativeMode?.value) {
				model.nativeMode.value = true;
				model.minimized.value = false;
				model.visible.value = true;
				exitNativeExcept(id);
				elevateModel(model, id);
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
	const { element: statusBar, dispose: disposeStatusBar } = mountEnvironmentStatusBar(options.shell, options.introHtml, device);
	const root = document.createElement("div");
	root.className = "env-shell-chrome wf-chrome-no-select";
	let taskbar;
	if (options.taskbar) {
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
	const disposeContrast = attachStatusBarContrast(shellRoot);
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
//#region ../../modules/shells/window-frame/public/demo/wf-demo.css?inline
var wf_demo_default = "*,:after,:before{box-sizing:border-box}@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color>{--i:clamp(0,var(--index),1000);--pivot:550;--white-distance:clamp(0,calc((var(--pivot) - var(--i)) / var(--pivot)),1);--black-distance:clamp(0,calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))),1);--to-white:pow(var(--white-distance),1.15);--to-black:pow(var(--black-distance),1.08);--center-left:clamp(0,calc(var(--i) / var(--pivot)),1);--center-right:clamp(0,calc((1000 - var(--i)) / (1000 - var(--pivot))),1);--chroma-shape:sqrt(min(var(--center-left),var(--center-right)));--chroma-scale:calc(0.08 + 0.92 * var(--chroma-shape));result:oklch(from var(--base-color) calc(l + (.985 - l) * var(--to-white) + (.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h)}.wf-demo-root{background:radial-gradient(1200px 700px at 12% -8%,color-mix(in oklch,var(--wf-md-primary) 18%,--u2-color-mod(var(--wf-md-primary),940)),--u2-color-mod(var(--wf-md-primary),960));isolation:isolate;min-block-size:100dvb;overflow:clip;--wf-md-primary:var(--color-primary,#5a7fff);--base-color:var(--color-primary,var(--wf-md-primary));--wf-md-on-primary:--u2-color-mod(var(--wf-md-primary),920);--wf-md-surface:--u2-color-mod(var(--wf-md-primary),940);--wf-md-surf-container-low:--u2-color-mod(var(--wf-md-primary),900);--wf-md-surf-container:--u2-color-mod(var(--wf-md-primary),860);--wf-md-surf-container-high:--u2-color-mod(var(--wf-md-primary),820);--wf-md-outline-variant:color-mix(in oklab,--u2-color-mod(var(--wf-md-primary),100) 12%,transparent);--wf-md-on-surface:--u2-color-mod(var(--wf-md-primary),100);--wf-md-on-surface-variant:--u2-color-mod(var(--wf-md-primary),280);--wf-md-error:#ef4444}.wf-chrome-no-select{user-select:none;-webkit-user-select:none}.wf-content-select{user-select:text;-webkit-user-select:text}.wf-frame{--wf-shape-xl:0.375rem;background:var(--wf-md-surf-container-low);border:1px solid var(--wf-md-outline-variant);border-radius:var(--wf-shape-xl);box-shadow:0 2px 1px rgb(0 0 0/22%),0 4px 3px rgb(0 0 0/16%),0 8px 10px rgb(0 0 0/12%),0 24px 32px rgb(0 0 0/32%);color:var(--wf-md-on-surface);display:flex;flex-direction:column;overflow:clip;position:fixed}.wf-frame.wf-hidden,.wf-frame.wf-minimized .wf-frame-body{display:none!important}.wf-frame.wf-minimized{block-size:auto!important;box-shadow:0 1px 2px rgb(0 0 0/22%),0 2px 4px rgb(0 0 0/14%)}.wf-titlebar{align-items:stretch;background:linear-gradient(165deg,color-mix(in oklch,var(--wf-md-surf-container-high) 88%,transparent),var(--wf-md-surf-container));border-block-end:1px solid var(--wf-md-outline-variant);display:flex;flex:none;flex-direction:row;gap:.25rem;padding-block:.125rem;padding-inline:.5rem .25rem;pointer-events:auto;position:relative;z-index:1}.wf-titlebar-drag{align-items:center;cursor:grab;display:flex;flex:1;min-block-size:2.5rem;min-inline-size:0;padding-inline-start:.35rem;touch-action:none}.wf-titlebar-drag:active{cursor:grabbing}.wf-titlebar-actions{align-items:center;display:flex;flex:none;flex-direction:row;gap:.125rem}.wf-title{color:var(--wf-md-on-surface);font:550 .875rem/1.2 Google Sans Flex,ui-sans-serif,system-ui,sans-serif;letter-spacing:.015em;opacity:.96;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wf-chrome-btn{background:transparent;block-size:2.25rem;border:none;border-radius:.5rem;color:var(--wf-md-on-surface-variant);cursor:pointer;display:grid;flex:none;inline-size:2.25rem;margin:0;outline:none;padding:0;place-items:center;transition:background .14s ease,color .14s ease}.wf-chrome-btn:hover{background:color-mix(in oklch,var(--wf-md-on-surface) 10%,transparent);color:var(--wf-md-on-surface)}.wf-chrome-btn:focus-visible{box-shadow:0 0 0 2px color-mix(in oklch,var(--wf-md-primary) 56%,transparent)}.wf-chrome-btn_close:hover{background:color-mix(in oklch,var(--wf-md-error) 22%,transparent);color:var(--wf-md-on-surface)}.wf-frame-body{background:var(--wf-md-surface);border-end-end-radius:max(0px,calc(var(--wf-shape-xl) - 1px));border-end-start-radius:max(0px,calc(var(--wf-shape-xl) - 1px));display:flex;flex:1;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:relative;transform:translateZ(0);z-index:0}.wf-frame-slot.wf-mounted-view,.wf-frame-slot>.wf-mounted-view{flex:1;min-block-size:0;overflow:auto}.wf-mobile-max.wf-mobile,.wf-mobile-max.wf-mobile .wf-frame-body{border-radius:0}.wf-resize{background:linear-gradient(135deg,transparent 53%,color-mix(in oklch,var(--wf-md-on-surface) 52%,transparent) 53%) 100% 100% /11px 11px no-repeat;block-size:22px;cursor:se-resize;inline-size:22px;inset-block-end:4px;inset-inline-end:4px;pointer-events:auto;position:absolute;touch-action:none;z-index:2}.wf-explorer{display:flex;flex:1;flex-direction:column;gap:6px;overflow:auto;padding-inline:2px}.wf-exp-row{appearance:none;background:color-mix(in oklch,var(--wf-md-on-surface) 8%,transparent);border:1px solid transparent;border-radius:.75rem;color:inherit;cursor:pointer;font:inherit;padding:8px;text-align:start}.wf-exp-row:hover{border-color:var(--wf-md-outline-variant)}.wf-exp-row_sel{outline:1px solid color-mix(in oklch,var(--wf-md-primary) 55%,transparent)}.wf-viewer{flex:1;min-block-size:0}.wf-md-body{block-size:100%;font-family:Google Sans Flex,ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.52;margin:0;overflow:auto;padding:12px}.wf-md :is(h1,h2,h3){margin:0 0 .5rem}.wf-md h1{font-size:1.25rem}.wf-md p{margin:.35rem 0}.wf-md pre{background:color-mix(in oklch,var(--wf-md-on-surface) 8%,transparent);border-radius:.75rem;overflow:auto;padding:.75rem}.wf-md code{font-family:ui-monospace,Google Sans Mono,monospace}.wf-md ul{margin:.25rem;padding-inline-start:1.35rem}.wf-md-err{color:color-mix(in oklch,var(--wf-md-error) 85%,transparent)}.wf-hud{color:var(--wf-md-on-surface-variant);font:12px ui-sans-serif,system-ui,sans-serif;inset-block-end:4px;inset-inline-start:4px;margin:0;max-inline-size:min(920px,96vw);opacity:.88;padding:6px 10px;position:fixed}.wf-hud p{margin:.15rem}@media print{.wf-demo-root{background:#fff!important}.wf-demo-root,.wf-frame{min-block-size:0!important;overflow:visible!important}.wf-frame{background:transparent!important;block-size:auto!important;border:none!important;border-radius:0!important;inset:auto!important;bottom:auto!important;box-shadow:none!important;break-inside:avoid;color:#000!important;inline-size:100%!important;left:auto!important;max-block-size:none!important;max-inline-size:100%!important;position:static!important;right:auto!important;top:auto!important;z-index:auto!important}.wf-resize,.wf-titlebar{display:none!important}.wf-frame-body{background:transparent!important;block-size:auto!important;border-radius:0!important;flex:none!important;flex-basis:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;transform:none!important}.wf-hud{display:none!important}}";
//#endregion
//#region src/frontend/shells/environment/scss/main.scss?inline
var main_default = ".env-shell-root.wf-demo-root{background:transparent}.env-shell-root{color-scheme:inherit;--env-z-shell-chrome:2147483000;--env-z-shell-overlays:2147483600;--env-status-inset-top:0px;--env-status-fg:light-dark(#1c1c1e,#f5f5f7);--env-status-fg-muted:color-mix(in oklab,var(--env-status-fg) 78%,transparent);--env-launcher-fg:#f7f7f8;--env-launcher-fg-shadow:rgb(0 0 0/0.88);--env-launcher-fg-glow:rgb(0 0 0/0.45);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-seed:var(--base-color);--wf-md-primary:var(--color-primary);--wf-md-surface:var(--color-surface);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);isolation:isolate;min-block-size:100dvb;overflow:visible;position:relative;--env-window-z-boost:400;--env-mobile-dock-reserve:calc(3rem + env(safe-area-inset-bottom, 0px));--env-shell-chrome-stack-reserve:var(--env-mobile-dock-reserve)}@media (min-width:641px){.env-shell-root{--env-shell-chrome-stack-reserve:7.5rem;--env-mobile-dock-reserve:0px}}.env-shell-root[data-status-overlay]{--env-status-inset-top:max(2rem,env(safe-area-inset-top,0px));--env-status-fg:light-dark(#1c1c1e,#f5f5f7)}.env-shell-root[data-standalone]{--env-status-inset-top:0px}@media screen and (pointer:fine) and ((min-width:768px) or (hover:hover)){.env-shell-root{--env-status-inset-top:max(3rem,env(safe-area-inset-top,0px))}}.env-shell-wallpaper{inset:0;pointer-events:none;position:fixed;z-index:0}:is(.env-shell-root:-webkit-full-screen,.env-shell-root:fullscreen,.env-shell-root[data-status-overlay]) .env-shell-wallpaper{inset:0}.env-shell-overlays,[data-env-shell-overlays]{background-color:initial!important;box-sizing:border-box;inset:0;pointer-events:none;position:absolute;z-index:2147483600}.env-shell-workspace{align-items:stretch;box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;min-block-size:100dvb;position:relative;z-index:1}html[data-theme=light] .env-shell-root,html[data-theme=light] .env-shell-root .view-settings,html[data-theme=light] .env-shell-root .view-viewer,html[data-theme=light] .env-shell-root ui-window{color-scheme:light only}html[data-theme=light] .env-shell-root .view-viewer{--view-bg:var(--color-container-high);--view-fg:var(--color-on-surface);--view-code-bg:var(--color-surface-container-low);background-color:var(--view-bg);color:var(--view-fg)}@supports (color:contrast-color(red)){html[data-theme=light] .env-shell-root .view-viewer{color:contrast-color(var(--view-bg))}}html[data-theme=light] .env-shell-root .ui-ws-item-icon ui-icon{color-scheme:light only;--icon-color:--u2-color-mod(var(--base-color,var(--color-primary,#5a7fff)),900);color:var(--icon-color)}html[data-theme=dark] .env-shell-root,html[data-theme=dark] .env-shell-root .view-settings,html[data-theme=dark] .env-shell-root .view-viewer,html[data-theme=dark] .env-shell-root ui-window{color-scheme:dark only}html[data-theme=dark] .env-shell-root .view-viewer{--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-code-bg:var(--color-surface-container);background-color:var(--view-bg);color:var(--view-fg)}@supports (color:contrast-color(red)){html[data-theme=dark] .env-shell-root .view-viewer{color:contrast-color(var(--view-bg))}}html[data-theme=dark] .env-shell-root .ui-ws-item-icon ui-icon{color-scheme:dark only;--icon-color:--u2-color-mod(var(--base-color,var(--color-primary,#5a7fff)),100);color:var(--icon-color)}.wf-view-host,.wf-view-placeholder{box-sizing:border-box;margin:0;padding:0}.wf-view-host,.wf-view-host>.wf-mounted-view,.wf-view-placeholder{align-self:stretch;display:flex;flex:1 1 0%;flex-direction:column;min-block-size:0;min-inline-size:0;overflow:hidden}.wf-view-placeholder__title{font:600 1rem/1.3 system-ui,sans-serif;margin:0 0 .5rem}.wf-view-placeholder__hint{font:400 .875rem/1.4 system-ui,sans-serif;margin:0;opacity:.75}.env-shell-workspace .wf-frame,.env-shell-workspace ui-window.env-ui-window{border-color:color-mix(in oklch,var(--wf-md-outline-variant,oklch(100% .02 280deg/.12)) 130%,transparent)}.env-shell-workspace ui-window.env-ui-window{--env-window-z-boost:var(--env-window-z-boost,0);pointer-events:auto}.env-shell-workspace ui-window.env-ui-window[data-desk-max],.env-shell-workspace ui-window.env-ui-window[maximized]:not([data-mobile-max]){box-sizing:border-box}.env-shell-workspace :is(.env-ui-window__body,.env-ui-window__view-host,.wf-mounted-view){block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;pointer-events:auto}.env-shell-home-mount,.env-shell-workspace .env-home-workspace,.env-shell-workspace .speed-dial-root,.env-shell-workspace .view-home{block-size:100%;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0}.env-shell-workspace .wf-frame .wf-titlebar,.env-shell-workspace ui-window.env-ui-window::part(title-handler){pointer-events:auto;position:relative;z-index:50}.env-shell-workspace .wf-frame .wf-frame-body,.env-shell-workspace ui-window.env-ui-window::part(content-handler){contain:paint;position:relative;transform:translateZ(0);z-index:0}.env-shell-workspace .wf-frame .wf-resize,.env-shell-workspace ui-window.env-ui-window::part(resizer){pointer-events:auto;z-index:4}@media print{.wf-view-host,.wf-view-host>.wf-mounted-view{align-self:stretch!important;block-size:auto!important;display:block!important;flex:none!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important}}.env-shell-workspace{background-color:initial!important;padding:0}:host(ui-statusbar){align-items:center;background:transparent;box-sizing:border-box;color:var(--env-status-fg,CanvasText);display:flex;flex-direction:row;gap:.35rem;inline-size:100%;justify-content:space-between}:host(ui-statusbar) :is(.center,.left,.right){align-items:center;background:transparent;display:flex;min-inline-size:0;padding-block-start:.5rem}:host(ui-statusbar) .left{flex:0 1 auto;justify-content:flex-start;padding-inline-start:max(1rem,env(safe-area-inset-left,0))}:host(ui-statusbar) .center{flex:1 1 auto;justify-content:center}:host(ui-statusbar) .right{flex:0 1 auto;justify-content:flex-end;margin-inline-start:auto;padding-inline-end:max(1rem,env(safe-area-inset-right,0))}@media screen and (pointer:fine) and ((min-width:768px) or (hover:hover)){:host(ui-statusbar),ui-statusbar{display:none!important}}@layer ui-statusbar{.env-ui-statusbar{backdrop-filter:blur(10px);background:color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent);border-block-start:1px solid var(--wf-md-outline-variant,color-mix(in oklch,white 12%,transparent));color:contrast-color(color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent));order:1;padding:.35rem .65rem calc(.35rem + env(safe-area-inset-bottom, 0))}.env-ui-statusbar__intro p{margin:.1rem 0;opacity:.92}.env-ui-statusbar__right{align-items:center;display:flex;justify-content:flex-end}.env-ui-statusbar__clock{border-radius:.35rem;color:inherit;cursor:pointer;font:600 .8125rem/1 ui-sans-serif,system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.01em;padding:.15rem .25rem;pointer-events:auto;user-select:none}.env-ui-statusbar__clock:focus-visible,.env-ui-statusbar__clock:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--footer{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--footer:focus-visible,.env-device-tray--footer:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-status-bar__tray{align-items:center;display:flex;flex-wrap:nowrap;gap:.35rem}.env-status-bar__chip{align-items:center;background:color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 10%,transparent);border:1px solid color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 18%,transparent);border-radius:999px;color:inherit;color:contrast-color(inherit(background-color));display:inline-flex;gap:.25rem;line-height:1;padding:.12rem .35rem}.env-status-bar__chip ui-icon{color:var(--env-status-fg,inherit);display:block;font-size:1.15rem;--icon-color:var(--env-status-fg,#f5f5f7)}.env-status-bar__pct{font-variant-numeric:tabular-nums;opacity:.95}.env-status-bar__meta{font-size:11px;margin:0;opacity:.88}.env-shell-chrome[data-status-overlay] .env-ui-statusbar,.env-shell-root[data-status-overlay]>.env-shell-chrome .env-ui-statusbar{align-items:center;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));border:0!important;box-sizing:border-box;color:var(--env-status-fg,#f5f5f7);display:flex;inset-block-end:auto;inset-block-start:0;inset-inline:0;min-block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));order:unset;padding:0 .75rem;pointer-events:none;position:fixed;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 2)}.env-shell-chrome[data-status-overlay] :is(.env-status-bar__meta,.env-ui-statusbar__intro){display:none!important}.env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock{color:var(--env-status-fg,#f5f5f7);display:block}.env-shell-chrome[data-status-overlay] :is(.env-device-tray--footer,.env-status-bar__chip){color:var(--env-status-fg,#f5f5f7)}.env-shell-chrome[data-status-overlay] .env-status-bar__chip ui-icon{--icon-color:var(--env-status-fg,#f5f5f7);color:var(--env-status-fg,#f5f5f7)}.env-shell-chrome[data-status-overlay] .env-device-tray--footer{display:flex!important}.env-shell-chrome[data-status-overlay] .env-status-bar__chip{background:transparent;border-color:transparent;padding-inline:.15rem}.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-ui-statusbar__clock,.env-shell-chrome[data-standalone] .env-ui-statusbar,.env-shell-root[data-standalone] .env-shell-chrome:not([data-desktop]) .env-ui-statusbar{display:none!important}.env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop]{opacity:0;pointer-events:none;visibility:hidden}}@layer ui-taskbar{.env-shell-chrome{color:var(--wf-md-on-surface-variant,oklch(78% .03 274deg));display:flex;flex-direction:column;font:12px ui-sans-serif,system-ui,sans-serif;gap:0;inset-block-end:0;inset-inline:0;isolation:isolate;pointer-events:none;position:fixed;z-index:var(--env-z-shell-chrome,2147483000)}@supports (color:contrast-color(red)) and (color:oklab(0% 0 0%)){.env-shell-chrome{color:contrast-color(var(--wf-md-on-surface-variant,oklch(78% .03 274deg)))}}.env-shell-chrome>*{pointer-events:auto}.env-shell-taskbar{align-items:stretch;backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);background:color-mix(in oklab,#1a1a1a 72%,transparent);block-size:2.5rem;border-block-start:1px solid color-mix(in oklab,#fff 12%,transparent);box-shadow:none;color:#f3f3f3;color:contrast-color(color-mix(in oklab,#1a1a1a 72%,transparent));display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;min-block-size:2.5rem;order:0;padding:0 .25rem;padding-block-end:env(safe-area-inset-bottom,0);position:relative}.env-shell-taskbar-under,.env-shell-taskbar-under.underlying-shadow-container{overflow:visible!important;pointer-events:none!important;z-index:-1!important}.env-shell-taskbar-under .underlying-shadow-geometry{background:transparent!important;box-shadow:0 -8px 28px rgba(0,0,0,.4)!important}.env-shell-taskbar::part(taskbar){align-items:stretch;display:flex;flex:1;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:100%;min-inline-size:0}.env-shell-taskbar__pins,.env-shell-taskbar__windows{align-items:stretch;display:flex;flex-direction:row;flex-wrap:nowrap;gap:0;min-inline-size:0}.env-shell-taskbar__pins{flex:0 0 auto}.env-shell-taskbar__pins [data-env-home]{backdrop-filter:blur(10px);background-color:color-mix(in oklab,var(--base-color,#1c1c1e) 10%,transparent);outline:1px solid light-dark(rgba(0,0,0,.1333333333),rgba(255,255,255,.1333333333));transform:translateY(-.5rem)}:has(ui-window:not([minimized])) .env-shell-taskbar__pins [data-env-home]{--color-surface:light-dark(--u2-color-mod(var(--base-color-neutralized),10),--u2-color-mod(var(--base-color-neutralized),980));background-color:color-mix(in oklab,var(--color-surface,#1c1c1e) 10%,transparent);color:contrast-color(var(--color-surface,#1c1c1e));--icon-color:contrast-color(var(--color-surface,#1c1c1e))}.env-shell-taskbar__windows{flex:1 1 auto;justify-content:flex-start;overflow-x:auto;scrollbar-width:thin}.env-shell-taskbar ui-task{align-self:stretch;background:transparent;border:0;border-radius:0;box-shadow:inset 0 -2px 0 transparent;color:inherit;cursor:pointer;min-block-size:100%;min-inline-size:2.75rem;opacity:1;outline:none;padding-inline:.55rem}.env-shell-taskbar ui-task:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));opacity:1}.env-shell-taskbar :is(ui-task[data-active],ui-task[data-env-active=true],ui-task[data-focus]){background:color-mix(in oklab,#fff 14%,transparent);box-shadow:inset 0 -2px 0 #60cdff;color:contrast-color(inherit(background-color));opacity:1;outline:none}.env-shell-taskbar ui-task[data-minimized]{opacity:.65}.env-shell-taskbar__tray-host{align-items:center;border-inline-start:1px solid color-mix(in oklab,#fff 12%,transparent);display:flex;flex:0 0 auto;gap:.35rem;margin-inline-start:auto;padding-inline:.35rem}.env-shell-taskbar__clock{align-items:flex-end;border-radius:.35rem;cursor:pointer;display:flex;flex-direction:column;gap:.05rem;justify-content:center;line-height:1.05;min-inline-size:4.5rem;padding-inline:.35rem .15rem;pointer-events:auto;user-select:none}.env-shell-taskbar__clock:focus-visible,.env-shell-taskbar__clock:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--taskbar{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--taskbar:focus-visible,.env-device-tray--taskbar:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-shell-taskbar__clock-time{color:#f3f3f3;font-size:.78rem;font-variant-numeric:tabular-nums;font-weight:600}.env-shell-taskbar__clock-date{color:color-mix(in oklab,#f3f3f3 72%,transparent);font-size:.62rem;font-weight:500;white-space:nowrap}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title){display:none!important}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task{min-inline-size:2.5rem;padding-inline:.45rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter){font-size:.8rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar{display:flex;flex-direction:row;place-content:center;place-items:center;align-items:center;backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;block-size:3rem;border-block-start:none;box-shadow:none;gap:0;justify-content:center;min-block-size:3rem;padding:.15rem .75rem;padding-block-end:calc(.15rem + env(safe-area-inset-bottom, 0px));place-self:center;position:relative}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins{align-items:center;flex:0 0 auto;justify-content:center}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]),.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]{background:transparent;border-radius:999px;box-shadow:none;min-block-size:2.75rem;min-inline-size:2.75rem;padding:0;touch-action:manipulation;user-select:none}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title){display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon){block-size:1.5rem;inline-size:1.5rem}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph){block-size:1.5rem;inline-size:1.5rem;opacity:1}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter){opacity:0}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home]:active,ui-task[data-env-home]:hover){background:color-mix(in oklch,#fff 10%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home][data-active],ui-task[data-env-home][data-env-active=true],ui-task[data-env-home][data-focus]){background:color-mix(in oklch,#fff 8%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-ui-statusbar{display:none!important}}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@property --color-primary{syntax:\"<color>\";inherits:true;initial-value:#5a7fff}@property --base-color{syntax:\"<color>\";inherits:true;initial-value:#5a7fff}@property --color-secondary{syntax:\"<color>\";inherits:true;initial-value:#6b8cff}@property --color-tertiary{syntax:\"<color>\";inherits:true;initial-value:#8aa0ff}@property --color-error{syntax:\"<color>\";inherits:true;initial-value:#ef4444}@property --color-success{syntax:\"<color>\";inherits:true;initial-value:#4caf50}@property --color-warning{syntax:\"<color>\";inherits:true;initial-value:#ff9800}@property --color-info{syntax:\"<color>\";inherits:true;initial-value:#2196f3}@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color>{--i:clamp(0,var(--index),1000);--pivot:550;--white-distance:clamp(0,calc((var(--pivot) - var(--i)) / var(--pivot)),1);--black-distance:clamp(0,calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))),1);--to-white:pow(var(--white-distance),1.15);--to-black:pow(var(--black-distance),1.08);--center-left:clamp(0,calc(var(--i) / var(--pivot)),1);--center-right:clamp(0,calc((1000 - var(--i)) / (1000 - var(--pivot))),1);--chroma-shape:sqrt(min(var(--center-left),var(--center-right)));--chroma-scale:calc(0.08 + 0.92 * var(--chroma-shape));result:oklch(from var(--base-color) calc(l + (.985 - l) * var(--to-white) + (.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{--color-primary:#5a7fff;color-scheme:light dark;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),40);--color-secondary:--u2-color-mod(var(--base-color),420);--color-on-secondary:--u2-color-mod(var(--base-color),40);--color-tertiary:--u2-color-mod(var(--base-color),400);--color-on-tertiary:--u2-color-mod(var(--base-color),40);--color-error:#ef4444;--color-on-error:--u2-color-mod(var(--color-error),40);--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:--u2-color-mod(var(--base-color),60);--color-on-background:--u2-color-mod(var(--base-color),900);--color-surface:--u2-color-mod(var(--base-color),60);--color-on-surface:--u2-color-mod(var(--base-color),900);--color-surface-variant:--u2-color-mod(var(--base-color),160);--color-on-surface-variant:--u2-color-mod(var(--base-color),700);--color-outline:--u2-color-mod(var(--base-color),300);--color-outline-variant:--u2-color-mod(var(--base-color),400);--color-surface-container-lowest:--u2-color-mod(var(--base-color),2);--color-surface-container-low:--u2-color-mod(var(--base-color),10);--color-surface-container:--u2-color-mod(var(--base-color),20);--color-surface-container-high:--u2-color-mod(var(--base-color),30);--color-surface-container-highest:--u2-color-mod(var(--base-color),40);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),40),var(--color-surface-container-high));--view-files-bg:var(--color-surface-container-low);--view-file-bg:var(--color-surface-container-lowest,var(--color-surface-container-low));--view-results-bg:var(--color-surface-container-low);--view-result-bg:var(--color-surface-container-lowest,var(--color-surface-container-low));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),620),--u2-color-mod(var(--base-color,var(--color-primary)),480));--color-primary-active:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),700),--u2-color-mod(var(--base-color,var(--color-primary)),400));--color-accent:var(--color-secondary);--color-accent-hover:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),500),--u2-color-mod(var(--base-color,var(--color-primary)),600));--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:var(--color-primary-hover);--color-success-light:--u2-color-mod(var(--color-success),280);--color-success-dark:--u2-color-mod(var(--color-success),720);--color-warning-light:--u2-color-mod(var(--color-warning),280);--color-warning-dark:--u2-color-mod(var(--color-warning),720);--color-error-light:--u2-color-mod(var(--color-error),280);--color-error-dark:--u2-color-mod(var(--color-error),720);--color-info-light:--u2-color-mod(var(--color-info),280);--color-info-dark:--u2-color-mod(var(--color-info),720);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs);--shell-bg:var(--color-surface);--shell-fg:var(--color-on-surface);--shell-nav-bg:var(--color-surface-container-high);--shell-nav-fg:var(--color-on-surface);--shell-nav-border:var(--color-outline-variant);--shell-btn-hover:var(--color-surface-container);--shell-btn-active-bg:color-mix(in oklab,var(--color-primary) 18%,var(--color-surface));--shell-btn-active-fg:var(--color-on-surface);--shell-status-bg:var(--color-surface-container-low);--shell-status-fg:var(--color-on-surface);--faint-nav-bg:var(--color-surface-container-high);--faint-nav-border:var(--color-outline-variant);--faint-sidebar-bg:var(--color-surface-container-high);--env-status-fg:light-dark(#1c1c1e,#f5f5f7);--env-status-fg-muted:color-mix(in oklab,var(--env-status-fg) 78%,transparent);--env-launcher-fg:#f7f7f8;--env-launcher-fg-shadow:rgb(0 0 0/0.88);--env-launcher-fg-glow:rgb(0 0 0/0.45);--error-color:var(--color-error,#f87171);--sv-bg:var(--color-surface-container-low,light-dark(#eef1f6,#0f1318));--sv-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--sv-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--sv-outline:var(--color-outline-variant,light-dark(#c5cdd8,#3d4755));--sv-surface-1:var(--color-surface-container-low,light-dark(#ffffff,#171c24));--sv-surface-2:var(--color-surface-container,light-dark(#f4f6fa,#1c232d));--sv-primary:var(--base-color,var(--color-primary,#5a7fff));--sv-danger:var(--color-error,#d32f2f);--vh-bg:var(--color-surface,light-dark(#eef1f6,#0f1318));--vh-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--vh-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--vh-primary:var(--color-primary,#007acc);--vh-danger:var(--color-error,#d32f2f);--vh-on-primary:var(--color-on-primary,#ffffff);--vh-item-bg:var(--color-surface-container-low,light-dark(#e0e5ee,#0a0d12));--view-fg-muted:color-mix(in oklab,var(--color-on-surface,#ccc) 72%,transparent);--view-hover-bg:color-mix(in oklab,var(--color-primary,#3794ff) 12%,transparent);--view-selected-bg:color-mix(in oklab,var(--color-primary,#3794ff) 18%,transparent);--view-selected-border:var(--color-primary,#3794ff)}@supports (color:color-mix(in lch,red,blue)){:host,:root,:scope{--view-border:color-mix(in oklab,var(--color-outline-variant,#888) 45%,transparent)}}@media (prefers-color-scheme:dark){:host:not([data-theme=light]):not([data-theme=dark]),:root:not([data-theme=light]):not([data-theme=dark]){color-scheme:dark;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),920);--color-secondary:--u2-color-mod(var(--base-color),680);--color-on-secondary:--u2-color-mod(var(--base-color),920);--color-tertiary:--u2-color-mod(var(--base-color),700);--color-on-tertiary:--u2-color-mod(var(--base-color),920);--color-error:#f87171;--color-on-error:--u2-color-mod(var(--color-error),920);--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:--u2-color-mod(var(--base-color),940);--color-on-background:--u2-color-mod(var(--base-color),100);--color-surface:--u2-color-mod(var(--base-color),940);--color-on-surface:--u2-color-mod(var(--base-color),100);--color-surface-variant:--u2-color-mod(var(--base-color),840);--color-on-surface-variant:--u2-color-mod(var(--base-color),280);--color-outline:--u2-color-mod(var(--base-color),720);--color-outline-variant:--u2-color-mod(var(--base-color),640);--color-surface-container-lowest:--u2-color-mod(var(--base-color),920);--color-surface-container-low:--u2-color-mod(var(--base-color),940);--color-surface-container:--u2-color-mod(var(--base-color),960);--color-surface-container-high:--u2-color-mod(var(--base-color),980);--color-surface-container-highest:--u2-color-mod(var(--base-color),1000);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant)}}:host[data-theme=light],:root[data-theme=light],[data-theme=light]{color-scheme:light only;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),40);--color-secondary:--u2-color-mod(var(--base-color),420);--color-on-secondary:--u2-color-mod(var(--base-color),40);--color-tertiary:--u2-color-mod(var(--base-color),400);--color-on-tertiary:--u2-color-mod(var(--base-color),40);--color-error:#ef4444;--color-on-error:--u2-color-mod(var(--color-error),40);--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:--u2-color-mod(var(--base-color),60);--color-on-background:--u2-color-mod(var(--base-color),900);--color-surface:--u2-color-mod(var(--base-color),60);--color-on-surface:--u2-color-mod(var(--base-color),900);--color-surface-variant:--u2-color-mod(var(--base-color),160);--color-on-surface-variant:--u2-color-mod(var(--base-color),700);--color-outline:--u2-color-mod(var(--base-color),300);--color-outline-variant:--u2-color-mod(var(--base-color),400);--color-surface-container-lowest:--u2-color-mod(var(--base-color),2);--color-surface-container-low:--u2-color-mod(var(--base-color),10);--color-surface-container:--u2-color-mod(var(--base-color),20);--color-surface-container-high:--u2-color-mod(var(--base-color),30);--color-surface-container-highest:--u2-color-mod(var(--base-color),40);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant)}:host[data-theme=dark],:root[data-theme=dark],[data-theme=dark]{color-scheme:dark only;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),920);--color-secondary:--u2-color-mod(var(--base-color),680);--color-on-secondary:--u2-color-mod(var(--base-color),920);--color-tertiary:--u2-color-mod(var(--base-color),700);--color-on-tertiary:--u2-color-mod(var(--base-color),920);--color-error:#f87171;--color-on-error:--u2-color-mod(var(--color-error),920);--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:--u2-color-mod(var(--base-color),940);--color-on-background:--u2-color-mod(var(--base-color),100);--color-surface:--u2-color-mod(var(--base-color),940);--color-on-surface:--u2-color-mod(var(--base-color),100);--color-surface-variant:--u2-color-mod(var(--base-color),840);--color-on-surface-variant:--u2-color-mod(var(--base-color),280);--color-outline:--u2-color-mod(var(--base-color),720);--color-outline-variant:--u2-color-mod(var(--base-color),640);--color-surface-container-lowest:--u2-color-mod(var(--base-color),920);--color-surface-container-low:--u2-color-mod(var(--base-color),940);--color-surface-container:--u2-color-mod(var(--base-color),960);--color-surface-container-high:--u2-color-mod(var(--base-color),980);--color-surface-container-highest:--u2-color-mod(var(--base-color),1000);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant)}:root[data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),:root[data-scheme=system]:not([data-theme=light]):not([data-theme=dark]){color-scheme:light dark}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@layer animations{}@function --wavy-step(--step <number>){--angle:calc((var(--step, 0) * 2) * 1rad * pi);--variant:calc(cos(var(--clip-freq, 8) * var(--angle, 0deg)) * 0.5 + 0.5);--adjust:calc(var(--variant, 0) * var(--clip-amplitude, 0));--x:calc(50% + (cos(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));--y:calc(50% + (sin(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));result:var(--x) var(--y)}@layer ux-shapes{.shaped{aspect-ratio:1/1;border-radius:1.5rem;clip-path:var(--clip-path,none);contain:strict;display:flex;overflow:hidden;padding:1.25rem;place-content:center;place-items:center;pointer-events:auto;transition:--background-tone-shift .2s ease-in-out,--icon-color .2s ease-in-out;transition-behavior:allow-discrete;user-select:none;z-index:1}.shaped,.shaped :is(span,ui-icon){block-size:stretch;inline-size:stretch}[data-dragging]{z-index:calc(100 + var(--z-index, 0))!important}:not(.shaped) .shaped,:not(.shaped)>*,:not(:has(.shaped)){--border-radius:var(--radius-md);--clip-path:none}:not(.shaped) .shaped[data-shape],:not(.shaped)>[data-shape],:not(:has(.shaped))[data-shape]{aspect-ratio:1/1;border-radius:var(--border-radius,var(--radius-md));clip-path:var(--clip-path,none);contain:strict;overflow:hidden;pointer-events:auto;touch-action:none}:not(.shaped) .shaped[data-shape=square],:not(.shaped)>[data-shape=square],:not(:has(.shaped))[data-shape=square]{--border-radius:var(--radius-md);--clip-path:none}:not(.shaped) .shaped[data-shape=squircle],:not(.shaped)>[data-shape=squircle],:not(:has(.shaped))[data-shape=squircle]{--border-radius:28%;--clip-path:none}:not(.shaped) .shaped[data-shape=circle],:not(.shaped)>[data-shape=circle],:not(:has(.shaped))[data-shape=circle]{--border-radius:50%;--clip-path:none}:not(.shaped) .shaped[data-shape=rounded],:not(.shaped)>[data-shape=rounded],:not(:has(.shaped))[data-shape=rounded]{--border-radius:var(--radius-xl);--clip-path:none}:not(.shaped) .shaped[data-shape=blob],:not(.shaped)>[data-shape=blob],:not(:has(.shaped))[data-shape=blob]{--border-radius:60% 40% 30% 70%/60% 30% 70% 40%;--clip-path:none}:not(.shaped) .shaped[data-shape=hexagon],:not(.shaped)>[data-shape=hexagon],:not(:has(.shaped))[data-shape=hexagon]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)}:not(.shaped) .shaped[data-shape=diamond],:not(.shaped)>[data-shape=diamond],:not(:has(.shaped))[data-shape=diamond]{--border-radius:0;--clip-path:polygon(round 0.5rem,50% 0%,100% 50%,50% 100%,0% 50%)}:not(.shaped) .shaped[data-shape=star],:not(.shaped)>[data-shape=star],:not(:has(.shaped))[data-shape=star]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 0%,61% 35%,98% 38%,68% 59%,79% 95%,50% 75%,21% 95%,32% 59%,2% 38%,39% 35%)}:not(.shaped) .shaped[data-shape=badge],:not(.shaped)>[data-shape=badge],:not(:has(.shaped))[data-shape=badge]{--border-radius:0;--clip-path:polygon(round 0.375rem,0% 0%,100% 0%,100% 70%,50% 100%,0% 70%)}:not(.shaped) .shaped[data-shape=heart],:not(.shaped)>[data-shape=heart],:not(:has(.shaped))[data-shape=heart]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 100%,10% 65%,0% 45%,0% 30%,5% 15%,18% 3%,35% 0%,50% 12%,65% 0%,82% 3%,95% 15%,100% 30%,100% 45%,90% 65%)}:not(.shaped) .shaped[data-shape=clover],:not(.shaped)>[data-shape=clover],:not(:has(.shaped))[data-shape=clover]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,60% 30%,70% 30%,100% 50%,70% 70%,60% 70%,50% 100%,40% 70%,30% 70%,0% 50%,30% 30%,40% 30%)}:not(.shaped) .shaped[data-shape=flower],:not(.shaped)>[data-shape=flower],:not(:has(.shaped))[data-shape=flower]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 0%,58% 25%,85% 15%,68% 40%,100% 50%,68% 60%,85% 85%,58% 75%,50% 100%,42% 75%,15% 85%,32% 60%,0% 50%,32% 40%,15% 15%,42% 25%)}:not(.shaped) .shaped[data-shape=triangle],:not(.shaped)>[data-shape=triangle],:not(:has(.shaped))[data-shape=triangle]{--border-radius:0;--clip-path:polygon(round 0.5rem,50% 0%,100% 87%,0% 87%)}:not(.shaped) .shaped[data-shape=pentagon],:not(.shaped)>[data-shape=pentagon],:not(:has(.shaped))[data-shape=pentagon]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,97.5% 35%,79.5% 95%,20.5% 95%,2.5% 35%)}:not(.shaped) .shaped[data-shape=octagon],:not(.shaped)>[data-shape=octagon],:not(:has(.shaped))[data-shape=octagon]{--border-radius:0;--clip-path:polygon(round 0.25rem,30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)}:not(.shaped) .shaped[data-shape=cross],:not(.shaped)>[data-shape=cross],:not(:has(.shaped))[data-shape=cross]{--border-radius:0;--clip-path:polygon(round 0.375rem,35% 0%,65% 0%,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0% 65%,0% 35%,35% 35%)}:not(.shaped) .shaped[data-shape=arrow],:not(.shaped)>[data-shape=arrow],:not(:has(.shaped))[data-shape=arrow]{--border-radius:0;--clip-path:polygon(round 0.375rem,0% 20%,60% 20%,60% 0%,100% 50%,60% 100%,60% 80%,0% 80%)}:not(.shaped) .shaped[data-shape=egg],:not(.shaped)>[data-shape=egg],:not(:has(.shaped))[data-shape=egg]{--border-radius:50% 50% 50% 50%/60% 60% 40% 40%;--clip-path:none}:not(.shaped) .shaped[data-shape=tear],:not(.shaped)>[data-shape=tear],:not(:has(.shaped))[data-shape=tear]{--border-radius:50cqmin 50cqmin 5rem 50cqmin;--clip-path:none;border-end-end-radius:5rem;border-end-start-radius:50cqmin;border-start-end-radius:50cqmin;border-start-start-radius:50cqmin}:not(.shaped) .shaped[data-shape=wavy],:not(.shaped)>[data-shape=wavy],:not(:has(.shaped))[data-shape=wavy]{--border-radius:calc(var(--icon-size, 100%) * 0.5)}}@layer ui-navbar{.env-shell-navbar__switcher{--navbar-switcher-background:light-dark(color-mix(in oklch,#f2f2f7 96%,transparent),color-mix(in oklch,#1c1c1e 96%,transparent));background:var(--navbar-switcher-background);border-radius:.85rem;color:contrast-color(var(--navbar-switcher-background));inset-block-end:4rem;inset-inline:.75rem;max-block-size:min(50dvb,20rem);overflow:auto;padding:.35rem;position:fixed;z-index:5;--icon-color:contrast-color(var(--navbar-switcher-background));backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid light-dark(color-mix(in oklch,#fff 12%,transparent),color-mix(in oklch,#1c1c1e 12%,transparent));box-shadow:0 12px 32px rgba(0,0,0,.45);inline-size:calc(100cqi - 1rem);place-self:center}.env-shell-navbar__switcher[hidden]{display:none!important}.env-shell-navbar__switcher-list{display:flex;flex-direction:column;gap:.15rem;list-style:none;margin:0;padding:0}.env-shell-navbar__switcher-empty{font:400 .8125rem/1.3 system-ui,sans-serif;opacity:.72;padding:.75rem .85rem;text-align:center}.env-shell-navbar__switcher-row{align-items:stretch;display:flex;flex-direction:row;gap:.2rem}.env-shell-navbar__switcher-item{align-items:center;appearance:none;background:transparent;border:0;border-radius:.65rem;color:inherit;cursor:pointer;display:flex;flex:1 1 auto;flex-direction:row;font:500 .875rem/1.25 system-ui,sans-serif;gap:.65rem;margin:0;min-inline-size:0;padding:.65rem .75rem;text-align:start}.env-shell-navbar__switcher-label{flex:1 1 auto;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.env-shell-navbar__switcher-item:focus-visible,.env-shell-navbar__switcher-item:hover{background:light-dark(color-mix(in oklch,#fff 10%,transparent),color-mix(in oklch,#1c1c1e 10%,transparent));outline:none}.env-shell-navbar__switcher-item[data-active]{background:light-dark(color-mix(in oklch,#60cdff 18%,transparent),color-mix(in oklch,#60cdff 18%,transparent))}.env-shell-navbar__switcher-item[data-minimized]{opacity:.78}.env-shell-navbar__switcher-item ui-icon{flex:0 0 auto;--icon-size:1.25rem;block-size:1.25rem;inline-size:1.25rem}.env-shell-navbar__switcher-close{align-items:center;appearance:none;background:transparent;border:0;border-radius:.65rem;color:inherit;cursor:pointer;display:inline-flex;flex:0 0 auto;inline-size:2.5rem;justify-content:center;margin:0;min-inline-size:2.5rem;padding:0}.env-shell-navbar__switcher-close:focus-visible,.env-shell-navbar__switcher-close:hover{background:light-dark(color-mix(in oklch,#ff6b6b 22%,transparent),color-mix(in oklch,#ff6b6b 22%,transparent));color:#ffb4b4;outline:none}.env-shell-navbar__switcher-close ui-icon{--icon-size:1.1rem;block-size:1.1rem;inline-size:1.1rem}}@media (min-width:641px){.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-device-tray--footer{display:none!important}}.env-shell-chrome:not([data-desktop]) :is(.env-device-tray--taskbar,.env-shell-taskbar__tray-host),.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-device-tray--footer,.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-device-tray--footer{display:none!important}.env-shell-app-menu{pointer-events:auto}.env-shell-app-menu:empty{display:none}.env-shell-root[data-env-crx=\"1\"]{isolation:isolate}";
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
	network: () => import("../chunks/src7.js"),
	settings: () => import("../chunks/src8.js"),
	explorer: () => import("../chunks/src5.js"),
	viewer: () => import("../chunks/src9.js"),
	markdown: () => import("../chunks/src9.js"),
	history: () => import("../chunks/src6.js"),
	workcenter: () => import("../chunks/src10.js"),
	editor: () => import("../chunks/src4.js"),
	home: () => import("../com/app8.js")
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
		const mod = await import("../chunks/launcher-state.js").then((n) => n.f);
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
		try {
			restoreWallpaperThemeCache();
			initializeAppCanvasLayer(wallpaper);
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
		mountViewModule(() => import("../com/app8.js"), homeMount, { shellContext }).then((unmount) => {
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
	}
	openInWindow(viewId, opts) {
		const id = String(viewId || "").trim().toLowerCase();
		if (!id || id === "airpad") return;
		const withNative = mergeNativeOpt(id, opts);
		if (!this.windowLayer?.focusWindow(id)) this.windowLayer?.shellContext.openView?.(id, withNative);
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
			try {
				const searchParams = new URLSearchParams(params || {});
				searchParams.set("shell", this.id);
				searchParams.delete("native");
				const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
				const next = `${location.pathname}${search}`;
				if (`${location.pathname}${location.search}` !== next) history.replaceState({
					viewId: "home",
					params
				}, "", next);
			} catch {}
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
