import { f as isEnabledView } from "../chunks/views.js";
import { h as preloadStyle, m as loadInlineStyle } from "../fest/dom.js";
import { a as booleanRef, l as ref, o as numberRef, r as effect, s as observe } from "../fest/object.js";
import { t as initializeAppCanvasLayer } from "../chunks/Canvas-2.js";
import { c as E, i as H } from "../com/app.js";
import { F as getBy, I as navigationEnable, O as createPanelUnderShadow, P as makeTask } from "../com/app2.js";
import { i as ensureStyleSheet } from "../fest/icon.js";
import "../vendor/culori.js";
import { t as ShellBase } from "../chunks/shells.js";
import { n as initBootShellWindowActivity } from "./preference.js";
import { n as resolveOverlayMountPoint, r as resolveShellOverlaysMount, t as SHELL_SLOT } from "./slots.js";
import "../com/app4.js";
//#region src/frontend/shells/environment/components/statusbar.ts
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
* `ui-statusbar`: intro (left), shell meta (center), device tray (right, hidden on desktop when taskbar shows icons).
*/
function mountEnvironmentStatusBar(shell, introInnerHtml, device) {
	const bar = document.createElement("ui-statusbar");
	bar.className = "env-ui-statusbar wf-chrome-no-select";
	bar.setAttribute("part", "status-bar");
	const left = document.createElement("div");
	left.slot = "left";
	left.className = "env-ui-statusbar__intro";
	if (introInnerHtml) left.innerHTML = introInnerHtml;
	const center = document.createElement("div");
	center.slot = "center";
	const meta = document.createElement("p");
	meta.className = "env-status-bar__meta";
	center.appendChild(meta);
	const right = document.createElement("div");
	right.slot = "right";
	right.className = "env-ui-statusbar__right";
	right.appendChild(buildShellDeviceTray(device, "env-device-tray env-device-tray--footer"));
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
	const dispose = () => {};
	return {
		element: bar,
		dispose
	};
}
//#endregion
//#region src/frontend/shells/environment/views/explorer/ts/ContextMenu.ts
/** WHY: Must sit above `.env-shell-chrome` (see environment-shell `_variables.scss` $z-shell-chrome ~2.1e9) and near `[data-env-shell-overlays]` pass-through layer. */
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var styleMounted = false;
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var cleanupFns = [];
/** WHY: soft elevation must sit under the glass panel (not on the backdrop-filter host). */
var menuUnderByEl = /* @__PURE__ */ new Map();
var destroyMenuUnderShadows = () => {
	for (const shadow of menuUnderByEl.values()) try {
		shadow.destroy();
	} catch {}
	menuUnderByEl.clear();
};
var attachMenuUnderShadow = (menu) => {
	menuUnderByEl.get(menu)?.destroy();
	menuUnderByEl.set(menu, createPanelUnderShadow(menu));
};
var detachMenuUnderShadow = (menu) => {
	menuUnderByEl.get(menu)?.destroy();
	menuUnderByEl.delete(menu);
};
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
var IMP_CSS = "important";
/**
* WHY: Host apps load FL-UI native `button { … !important … }`; CSS files alone lose to style-attribute precedence.
* Stamping palette + transparent rows avoids “gray slab per row”.
*/
function stampUnifiedContextMenuPanelChrome(menu, compact) {
	const light = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches;
	menu.style.setProperty("position", "fixed", IMP_CSS);
	menu.style.setProperty("box-sizing", "border-box", IMP_CSS);
	menu.style.setProperty("min-width", compact ? "188px" : "220px", IMP_CSS);
	menu.style.setProperty("max-width", "min(320px, calc(100vw - 24px))", IMP_CSS);
	menu.style.setProperty("padding", compact ? "0.3rem" : "0.4rem", IMP_CSS);
	menu.style.setProperty("border-radius", "14px", IMP_CSS);
	menu.style.setProperty("pointer-events", "auto", IMP_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "none", IMP_CSS);
	menu.style.setProperty("backdrop-filter", "none", IMP_CSS);
	menu.style.setProperty("box-shadow", "none", IMP_CSS);
	if (light) {
		menu.style.setProperty("border", "1px solid rgba(15, 23, 42, 0.14)", IMP_CSS);
		menu.style.setProperty("background", "rgba(241, 245, 249, 0.98)", IMP_CSS);
		menu.style.setProperty("color", "#0f172a", IMP_CSS);
		menu.style.setProperty("outline", "1px solid rgba(15, 23, 42, 0.06)", IMP_CSS);
	} else {
		menu.style.setProperty("border", "1px solid rgba(255, 255, 255, 0.1)", IMP_CSS);
		menu.style.setProperty("background", "rgba(15, 23, 42, 0.97)", IMP_CSS);
		menu.style.setProperty("color", "#e8eaed", IMP_CSS);
		menu.style.setProperty("outline", "1px solid rgba(255, 255, 255, 0.06)", IMP_CSS);
	}
}
function stampUnifiedContextMenuListChrome(list) {
	list.style.setProperty("list-style", "none", IMP_CSS);
	list.style.setProperty("list-style-type", "none", IMP_CSS);
	list.style.setProperty("margin", "0", IMP_CSS);
	list.style.setProperty("padding", "0", IMP_CSS);
	list.style.setProperty("display", "flex", IMP_CSS);
	list.style.setProperty("flex-direction", "column", IMP_CSS);
	list.style.setProperty("align-items", "stretch", IMP_CSS);
	list.style.setProperty("gap", "0.2rem", IMP_CSS);
	list.style.setProperty("width", "100%", IMP_CSS);
	list.style.setProperty("box-sizing", "border-box", IMP_CSS);
	list.style.setProperty("text-align", "left", IMP_CSS);
}
function stampUnifiedContextMenuLiChrome(li) {
	li.style.setProperty("list-style", "none", IMP_CSS);
	li.style.setProperty("list-style-type", "none", IMP_CSS);
	li.style.setProperty("margin", "0", IMP_CSS);
	li.style.setProperty("padding", "0", IMP_CSS);
	li.style.setProperty("width", "100%", IMP_CSS);
	li.style.setProperty("display", "block", IMP_CSS);
	li.style.setProperty("box-sizing", "border-box", IMP_CSS);
}
function stampUnifiedContextMenuRowChrome(button, danger) {
	const light = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches;
	button.style.setProperty("appearance", "none", IMP_CSS);
	button.style.setProperty("-webkit-appearance", "none", IMP_CSS);
	button.style.setProperty("box-sizing", "border-box", IMP_CSS);
	button.style.setProperty("width", "100%", IMP_CSS);
	button.style.setProperty("max-width", "100%", IMP_CSS);
	button.style.setProperty("margin", "0", IMP_CSS);
	button.style.setProperty("display", "grid", IMP_CSS);
	button.style.setProperty("grid-template-columns", "1.375rem minmax(0, 1fr) auto", IMP_CSS);
	button.style.setProperty("align-items", "center", IMP_CSS);
	button.style.setProperty("justify-items", "start", IMP_CSS);
	button.style.setProperty("gap", "0.55rem", IMP_CSS);
	button.style.setProperty("border-style", "none", IMP_CSS);
	button.style.setProperty("border-width", "0", IMP_CSS);
	button.style.setProperty("outline", "none", IMP_CSS);
	button.style.setProperty("border-radius", "10px", IMP_CSS);
	button.style.setProperty("padding", "0.5rem 0.6rem", IMP_CSS);
	button.style.setProperty("min-height", "2.35rem", IMP_CSS);
	button.style.setProperty("font-family", "inherit", IMP_CSS);
	button.style.setProperty("font-size", "0.8125rem", IMP_CSS);
	button.style.setProperty("font-weight", "400", IMP_CSS);
	button.style.setProperty("line-height", "1.25", IMP_CSS);
	button.style.setProperty("text-align", "start", IMP_CSS);
	button.style.setProperty("cursor", "pointer", IMP_CSS);
	button.style.setProperty("background", "none", IMP_CSS);
	button.style.setProperty("background-color", "transparent", IMP_CSS);
	button.style.setProperty("background-image", "none", IMP_CSS);
	button.style.setProperty("box-shadow", "none", IMP_CSS);
	button.style.setProperty("transition", "none", IMP_CSS);
	if (!danger) button.style.setProperty("color", "inherit", IMP_CSS);
	else if (light) button.style.setProperty("color", "#b91c1c", IMP_CSS);
	else button.style.setProperty("color", "#fca5a5", IMP_CSS);
}
var ensureStyle = () => {
	if (styleMounted) return;
	styleMounted = true;
	const style = document.createElement("style");
	style.id = "cw-unified-context-menu-style";
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${CONTEXT_MENU_LAYER_Z_FALLBACK});
            pointer-events: none;
        }

        .cw-context-menu {
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: light dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.97);
            color: #e8eaed;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
        }

        .cw-context-menu-under.underlying-shadow-container,
        .cw-context-menu-under {
            pointer-events: none !important;
            overflow: visible !important;
            z-index: -1 !important;
            filter: blur(12px) saturate(1.2) !important;
        }

        .cw-context-menu-under .underlying-shadow-geometry {
            background: #000000af !important;
            border-radius: 14px;
            overflow: hidden !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu {
                border: 1px solid rgba(15, 23, 42, 0.14);
                background: rgba(241, 245, 249, 0.98);
                color: #0f172a;
                box-shadow: none;
            }

            .cw-context-menu-under .underlying-shadow-geometry {
                background: #0000001f !important;
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
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            box-sizing: border-box;
            display: block !important;
        }

        /*
         * INVARIANT: one horizontal row per item (icon | label | chevron).
         * Rows stay transparent inside the slab; FL-UI host button styling must not turn each row into its own gray chip.
         */
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
            justify-content: start !important;
            flex-direction: row !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            font-weight: 400 !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
            transition: none !important;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }

        @media (prefers-color-scheme: light) {
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: rgba(15, 23, 42, 0.08) !important;
            }
        }

        button.cw-context-menu__item[disabled],
        .cw-context-menu button.cw-context-menu__item[disabled] {
            opacity: 0.45 !important;
            cursor: default !important;
        }

        .cw-context-menu__item--danger {
            color: #fca5a5 !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu__item--danger {
                color: #b91c1c !important;
            }
        }

        .cw-context-menu__icon {
            justify-self: center !important;
            width: 1.375rem !important;
            height: 1.375rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /*
         * WHY:
         * 1) Inherited registered icon-color can be fully transparent — force currentColor.
         * 2) Phosphor min-size uses min(var(--icon-size), 100%); when percentage base is cyclic/0,
         *    mask ::before collapses — lock an explicit px box matching --icon-size.
         */
        .cw-context-menu__icon ui-icon,
        .cw-context-menu__chevron ui-icon {
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            width: var(--icon-size, 1.125rem) !important;
            height: var(--icon-size, 1.125rem) !important;
            min-width: var(--icon-size, 1.125rem) !important;
            min-height: var(--icon-size, 1.125rem) !important;
            min-inline-size: var(--icon-size, 1.125rem) !important;
            min-block-size: var(--icon-size, 1.125rem) !important;
            inline-size: var(--icon-size, 1.125rem) !important;
            block-size: var(--icon-size, 1.125rem) !important;
            max-inline-size: var(--icon-size, 1.125rem) !important;
            max-block-size: var(--icon-size, 1.125rem) !important;
            --icon-padding: 0px !important;
            color: inherit !important;
            --icon-color: currentColor !important;
            overflow: visible !important;
            pointer-events: none !important;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem !important;
        }

        .cw-context-menu__label {
            justify-self: stretch !important;
            text-align: start !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            min-width: 0 !important;
        }

        .cw-context-menu__chevron {
            justify-self: end !important;
            opacity: 0.72 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem !important;
        }

        @supports (color: color-mix(in oklab, white 50%, black)) {
            .cw-context-menu {
                border: 1px solid color-mix(in oklab, var(--wf-md-outline-variant, transparent) 100%, transparent);
                background: color-mix(in oklab, var(--wf-md-surf-container, rgba(30, 41, 59, 0.92)) 96%, transparent);
                color: var(--wf-md-on-surface, var(--color-on-surface, inherit));
                box-shadow:
                    var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                    0 0 0 1px color-mix(in oklab, var(--wf-md-on-surface, #fff) 7%, transparent);
            }
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: color-mix(in oklab, var(--wf-md-on-surface, #fff) 8%, transparent) !important;
            }
        }
    `;
	document.head.appendChild(style);
};
/** Re-run phosphor hydration after DOM connect (helps IO-deferred raster icons). */
function refreshContextMenuUiIcons(root) {
	if (typeof customElements !== "undefined" && typeof customElements.upgrade === "function") try {
		customElements.upgrade(root);
	} catch {}
	for (const node of root.querySelectorAll("ui-icon")) {
		const el = node;
		el.style.setProperty("--icon-size", "1.125rem", IMP_CSS);
		el.style.setProperty("--icon-padding", "0px", IMP_CSS);
		el.style.setProperty("--icon-color", "currentColor", IMP_CSS);
		el.style.setProperty("width", "1.125rem", IMP_CSS);
		el.style.setProperty("height", "1.125rem", IMP_CSS);
		el.style.setProperty("min-width", "1.125rem", IMP_CSS);
		el.style.setProperty("min-height", "1.125rem", IMP_CSS);
		el.style.setProperty("display", "inline-grid", IMP_CSS);
		if (typeof el.updateIcon === "function") el.updateIcon.call(node);
	}
}
function appendUiIcon(target, iconName) {
	const name = String(iconName || "").trim();
	if (!name) return;
	const el = document.createElement("ui-icon");
	el.setAttribute("icon", name);
	el.setAttribute("icon-style", "duotone");
	el.setAttribute("size", "18");
	el.setAttribute("aria-hidden", "true");
	el.style.setProperty("--icon-size", "1.125rem", IMP_CSS);
	el.style.setProperty("--icon-padding", "0px", IMP_CSS);
	el.style.setProperty("--icon-color", "currentColor", IMP_CSS);
	el.style.setProperty("width", "1.125rem", IMP_CSS);
	el.style.setProperty("height", "1.125rem", IMP_CSS);
	target.append(el);
}
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
var placeMenu = (menu, x, y) => {
	menu.style.left = `${x}px`;
	menu.style.top = `${y}px`;
	const rect = menu.getBoundingClientRect();
	const maxX = Math.max(8, window.innerWidth - rect.width - 8);
	const maxY = Math.max(8, window.innerHeight - rect.height - 8);
	menu.style.left = `${Math.min(Math.max(8, x), maxX)}px`;
	menu.style.top = `${Math.min(Math.max(8, y), maxY)}px`;
};
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		detachMenuUnderShadow(submenu);
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var placeSubmenuWithFallback = (submenu, anchor) => {
	const rect = anchor.getBoundingClientRect();
	placeMenu(submenu, Math.round(rect.right + 4), Math.round(rect.top));
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	menu.style.zIndex = String(depth + 1);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	stampUnifiedContextMenuListChrome(list);
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		placeSubmenuWithFallback(submenu, anchorButton);
		attachMenuUnderShadow(submenu);
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
		const hasChildren = Boolean(item.children?.length);
		const iconWrap = document.createElement("span");
		iconWrap.className = "cw-context-menu__icon";
		if (item.icon) appendUiIcon(iconWrap, item.icon);
		const labelSpan = document.createElement("span");
		labelSpan.className = "cw-context-menu__label";
		labelSpan.textContent = item.label;
		const chevronWrap = document.createElement("span");
		chevronWrap.className = "cw-context-menu__chevron";
		if (hasChildren) appendUiIcon(chevronWrap, "caret-right");
		button.append(iconWrap, labelSpan, chevronWrap);
		stampUnifiedContextMenuRowChrome(button, Boolean(item.danger));
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
		stampUnifiedContextMenuLiChrome(li);
		li.appendChild(button);
		list.appendChild(li);
	}
	stampUnifiedContextMenuPanelChrome(menu, compact);
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
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	destroyMenuUnderShadows();
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
	const mount = request.resolveOverlayMountPoint?.(request.anchor ?? null) ?? resolveOverlayMountPoint(request.anchor ?? null);
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	layer.style.setProperty("position", "fixed", IMP_CSS);
	layer.style.setProperty("inset", "0", IMP_CSS);
	layer.style.setProperty("z-index", CONTEXT_MENU_LAYER_Z_FALLBACK, IMP_CSS);
	layer.style.setProperty("pointer-events", "none", IMP_CSS);
	layer.style.setProperty("backdrop-filter", "none", IMP_CSS);
	layer.style.setProperty("-webkit-backdrop-filter", "none", IMP_CSS);
	menuLayer = layer;
	mount.appendChild(layer);
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session);
	rootMenu = menu;
	layer.appendChild(menu);
	placeMenu(menu, request.x, request.y);
	attachMenuUnderShadow(menu);
	const hydrateIcons = () => {
		if (session !== menuSession || !menu.isConnected) return;
		refreshContextMenuUiIcons(menu);
	};
	const whenIcon = typeof customElements !== "undefined" && customElements.whenDefined ? customElements.whenDefined("ui-icon").then(hydrateIcons).catch(() => {}) : Promise.resolve();
	queueMicrotask(() => {
		whenIcon.then(hydrateIcons);
		requestAnimationFrame(() => {
			hydrateIcons();
			requestAnimationFrame(hydrateIcons);
		});
	});
	/**
	* WHY: `menuLayer.contains(event.target)` is false for nodes inside open shadow trees (e.g. ui-icon internals).
	* That made document-capture pointerdown treat in-menu presses as "outside" → menu removed before click fires.
	*/
	const eventPathTouchesOpenMenu = (event) => {
		if (!menuLayer?.isConnected || !rootMenu) return false;
		const rawPath = typeof event.composedPath === "function" ? event.composedPath() : [];
		const path = Array.isArray(rawPath) && rawPath.length ? rawPath : [];
		for (const node of path) {
			if (!(node instanceof Element)) continue;
			if (node === menuLayer || node === rootMenu) return true;
			if (menuLayer.contains(node)) return true;
			if (node.classList?.contains?.("cw-context-menu") || node.closest?.(".cw-context-menu")) return true;
		}
		const t = event.target;
		if (t instanceof Node && menuLayer.contains(t)) return true;
		if (t instanceof Element && t.closest?.(".cw-context-menu")) return true;
		return false;
	};
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		if (eventPathTouchesOpenMenu(event)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		let parentItem = target.closest?.(".cw-context-menu__item");
		if (!parentItem && typeof event.composedPath === "function") {
			for (const node of event.composedPath()) if (node instanceof Element && node.classList?.contains?.("cw-context-menu__item")) {
				parentItem = node;
				break;
			}
		}
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
	queueMicrotask(() => {
		if (session !== menuSession) return;
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
	});
};
//#endregion
//#region src/frontend/shells/environment/components/taskbar.ts
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
		icon: "house"
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
	tHome.setAttribute("icon", "house");
	tHome.setAttribute("data-id", HOME_TASK);
	tHome.setAttribute("data-env-home", "");
	tHome.setAttribute("aria-label", "Home");
	tHome.setAttribute("aria-haspopup", "menu");
	tHome.setAttribute("aria-keyshortcuts", "LongPress");
	const tViewer = document.createElement("ui-task");
	tViewer.setAttribute("title", "Markdown");
	tViewer.setAttribute("icon", "article");
	tViewer.setAttribute("data-id", VIEWER_TASK);
	tViewer.setAttribute("data-env-pin", "viewer");
	tViewer.setAttribute("aria-label", "Markdown");
	pinsHost.append(tHome, tViewer);
	const trayHost = document.createElement("div");
	trayHost.className = "env-shell-taskbar__tray-host";
	const clockHost = document.createElement("div");
	clockHost.className = "env-shell-taskbar__clock";
	clockHost.setAttribute("role", "timer");
	clockHost.setAttribute("aria-live", "polite");
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
	trayHost.append(buildShellDeviceTray(opts.device, "env-device-tray env-device-tray--taskbar"), clockHost);
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
				icon: "house",
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
		const open = lastWindows.filter((w) => w.visible !== false && String(w.id || "").trim());
		switcherList.replaceChildren();
		if (!open.length) {
			const empty = document.createElement("li");
			empty.className = "env-shell-navbar__switcher-empty";
			empty.textContent = "No open apps";
			switcherList.appendChild(empty);
		} else for (const w of open) {
			const id = String(w.id || "").trim().toLowerCase();
			const li = document.createElement("li");
			li.setAttribute("role", "none");
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "env-shell-navbar__switcher-item";
			btn.setAttribute("role", "menuitem");
			btn.toggleAttribute("data-active", Boolean(w.focused));
			const icon = document.createElement("ui-icon");
			icon.setAttribute("icon", w.icon || "app-window");
			icon.setAttribute("icon-style", "duotone");
			icon.setAttribute("aria-hidden", "true");
			const label = document.createElement("span");
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
			li.appendChild(btn);
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
	tViewer.addEventListener("click", () => {
		const desc = findWindowDesc("viewer") || findWindowDesc("markdown");
		if (desc) {
			activateWindowTask(String(desc.id || "viewer").toLowerCase());
			return;
		}
		getBy(taskList, VIEWER_TASK).focus = true;
	});
	tViewer.addEventListener("contextmenu", (ev) => {
		const desc = findWindowDesc("viewer") || findWindowDesc("markdown");
		if (!desc) {
			if (isMobileChrome()) return;
			ev.preventDefault();
			openUnifiedContextMenu({
				x: ev.clientX,
				y: ev.clientY,
				compact: true,
				anchor: tViewer,
				items: [{
					id: "open-markdown",
					label: "Open Markdown",
					icon: "article",
					action: () => opts.onViewer()
				}]
			});
			return;
		}
		openTaskContextMenu(ev, String(desc.id || "viewer"), desc.title || "Markdown");
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
		mark(tViewer, id === "viewer" || id === "markdown");
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
//#region src/frontend/shells/environment/scss/environment-shell-container.scss?inline
var environment_shell_container_default = ":host{box-sizing:border-box;color-scheme:light dark;display:block;isolation:isolate;min-block-size:100dvb;overflow:visible;position:relative}.esc-stack{display:grid;grid-template:1fr/1fr}.esc-layer,.esc-stack{box-sizing:border-box;min-block-size:inherit}.esc-layer{grid-area:1/1}.esc-underlying{overflow:clip;pointer-events:none;z-index:0}.esc-main{align-items:stretch;display:flex;flex-direction:column;min-block-size:inherit;pointer-events:auto;z-index:1}.esc-main,.esc-overlays{overflow:visible;position:relative}.esc-overlays{pointer-events:none;z-index:2}";
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
			sheet.replaceSync(environment_shell_container_default);
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
Object.freeze({
	w: 240,
	h: 160
});
function createChromeModel(title, seed = {}) {
	const { x = 48, y = 48, w = 460, h = 320, z = 10, demoRole } = seed;
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
//#endregion
//#region src/frontend/shells/environment/mount-ui-window.ts
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
			if (!maximizedMobile.value) maximizedMobile.value = true;
			if (minimized.value) minimized.value = false;
			if (desktopMaximized.value) desktopMaximized.value = false;
		}
		const isNative = Boolean(nativeMode.value);
		const isMin = !mqMobile && Boolean(minimized.value);
		const isDeskMax = !mqMobile && Boolean(desktopMaximized.value) && !isNative;
		const isMobMax = mqMobile && !isNative;
		win.toggleAttribute("native-mode", isNative);
		win.toggleAttribute("minimized", isMin);
		win.toggleAttribute("data-mobile-max", isMobMax);
		win.toggleAttribute("data-desk-max", isDeskMax);
		win.toggleAttribute("maximized", isDeskMax || isMobMax || isNative);
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
		if (isMobileMq.matches) return;
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
		const existing = managed.get(id);
		if (existing && findKeyedFrame(workspace, id)) {
			elevateModel(existing.model, id);
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
		const offset = managed.size * 24;
		const model = createChromeModel(titleForView(id, options.viewTitles), {
			x: 72 + offset,
			y: 72 + offset,
			w: 480,
			h: 360,
			z: topZ.value + 1
		});
		topZ.value = model.z.value;
		const wantNative = new Set((options.startNativeViewIds || []).map((v) => normalizeMarkdownViewWindowId(String(v || "")))).has(id) || String(opts?.native || "") === "1" || String(opts?.params?.native || "") === "1";
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
		if (typeof matchMedia === "function" && matchMedia("(max-width: 640px)").matches) return false;
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
	const { element: statusBar } = mountEnvironmentStatusBar(options.shell, options.introHtml, device);
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
	const desktopMq = typeof matchMedia === "function" ? matchMedia("(min-width: 641px)") : null;
	const syncDesktopAttr = () => {
		const desktop = desktopMq ? desktopMq.matches : true;
		root.toggleAttribute("data-desktop", desktop);
		root.dataset.chromeLayout = desktop ? "desktop" : "mobile";
	};
	syncDesktopAttr();
	desktopMq?.addEventListener?.("change", syncDesktopAttr);
	if (isEnvironmentShellContainerHost(host)) root.slot = SHELL_SLOT.overlay;
	host.appendChild(root);
	return {
		root,
		device,
		statusBar,
		taskbar,
		disposeDevice: () => {
			desktopMq?.removeEventListener?.("change", syncDesktopAttr);
			device.dispose();
		}
	};
}
//#endregion
//#region ../../modules/shells/window-frame/public/demo/wf-demo.css?inline
var wf_demo_default = "*,:after,:before{box-sizing:border-box}.wf-demo-root{background:radial-gradient(1200px 700px at 12% -8%,color-mix(in oklch,var(--wf-md-primary) 18%,oklch(.13 .02 280)),oklch(.11 .02 280));isolation:isolate;min-block-size:100dvb;overflow:clip;--wf-md-primary:oklch(0.74 0.14 294);--wf-md-on-primary:oklch(0.2 0.04 294);--wf-md-surface:oklch(0.16 0.02 280);--wf-md-surf-container-low:oklch(0.19 0.025 278);--wf-md-surf-container:oklch(0.22 0.03 276);--wf-md-surf-container-high:oklch(0.26 0.035 274);--wf-md-outline-variant:oklch(1 0.02 280/12%);--wf-md-on-surface:oklch(0.93 0.02 274);--wf-md-on-surface-variant:oklch(0.74 0.03 274);--wf-md-error:oklch(0.7 0.18 22)}.wf-chrome-no-select{user-select:none;-webkit-user-select:none}.wf-content-select{user-select:text;-webkit-user-select:text}.wf-frame{--wf-shape-xl:0.375rem;background:var(--wf-md-surf-container-low);border:1px solid var(--wf-md-outline-variant);border-radius:var(--wf-shape-xl);box-shadow:0 2px 1px rgb(0 0 0/22%),0 4px 3px rgb(0 0 0/16%),0 8px 10px rgb(0 0 0/12%),0 24px 32px rgb(0 0 0/32%);color:var(--wf-md-on-surface);display:flex;flex-direction:column;overflow:clip;position:fixed}.wf-frame.wf-hidden,.wf-frame.wf-minimized .wf-frame-body{display:none!important}.wf-frame.wf-minimized{block-size:auto!important;box-shadow:0 1px 2px rgb(0 0 0/22%),0 2px 4px rgb(0 0 0/14%)}.wf-titlebar{align-items:stretch;background:linear-gradient(165deg,color-mix(in oklch,var(--wf-md-surf-container-high) 88%,transparent),var(--wf-md-surf-container));border-block-end:1px solid var(--wf-md-outline-variant);display:flex;flex:none;flex-direction:row;gap:.25rem;padding-block:.125rem;padding-inline:.5rem .25rem;pointer-events:auto;position:relative;z-index:1}.wf-titlebar-drag{align-items:center;cursor:grab;display:flex;flex:1;min-block-size:2.5rem;min-inline-size:0;padding-inline-start:.35rem;touch-action:none}.wf-titlebar-drag:active{cursor:grabbing}.wf-titlebar-actions{align-items:center;display:flex;flex:none;flex-direction:row;gap:.125rem}.wf-title{color:var(--wf-md-on-surface);font:550 .875rem/1.2 Google Sans Flex,ui-sans-serif,system-ui,sans-serif;letter-spacing:.015em;opacity:.96;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wf-chrome-btn{background:transparent;block-size:2.25rem;border:none;border-radius:.5rem;color:var(--wf-md-on-surface-variant);cursor:pointer;display:grid;flex:none;inline-size:2.25rem;margin:0;outline:none;padding:0;place-items:center;transition:background .14s ease,color .14s ease}.wf-chrome-btn:hover{background:color-mix(in oklch,var(--wf-md-on-surface) 10%,transparent);color:var(--wf-md-on-surface)}.wf-chrome-btn:focus-visible{box-shadow:0 0 0 2px color-mix(in oklch,var(--wf-md-primary) 56%,transparent)}.wf-chrome-btn_close:hover{background:color-mix(in oklch,var(--wf-md-error) 22%,transparent);color:var(--wf-md-on-surface)}.wf-frame-body{background:var(--wf-md-surface);border-end-end-radius:max(0px,calc(var(--wf-shape-xl) - 1px));border-end-start-radius:max(0px,calc(var(--wf-shape-xl) - 1px));display:flex;flex:1;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:relative;transform:translateZ(0);z-index:0}.wf-frame-slot.wf-mounted-view,.wf-frame-slot>.wf-mounted-view{flex:1;min-block-size:0;overflow:auto}.wf-mobile-max.wf-mobile,.wf-mobile-max.wf-mobile .wf-frame-body{border-radius:0}.wf-resize{background:linear-gradient(135deg,transparent 53%,color-mix(in oklch,var(--wf-md-on-surface) 52%,transparent) 53%) 100% 100% /11px 11px no-repeat;block-size:22px;cursor:se-resize;inline-size:22px;inset-block-end:4px;inset-inline-end:4px;pointer-events:auto;position:absolute;touch-action:none;z-index:2}.wf-explorer{display:flex;flex:1;flex-direction:column;gap:6px;overflow:auto;padding-inline:2px}.wf-exp-row{appearance:none;background:color-mix(in oklch,var(--wf-md-on-surface) 8%,transparent);border:1px solid transparent;border-radius:.75rem;color:inherit;cursor:pointer;font:inherit;padding:8px;text-align:start}.wf-exp-row:hover{border-color:var(--wf-md-outline-variant)}.wf-exp-row_sel{outline:1px solid color-mix(in oklch,var(--wf-md-primary) 55%,transparent)}.wf-viewer{flex:1;min-block-size:0}.wf-md-body{block-size:100%;font-family:Google Sans Flex,ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.52;margin:0;overflow:auto;padding:12px}.wf-md :is(h1,h2,h3){margin:0 0 .5rem}.wf-md h1{font-size:1.25rem}.wf-md p{margin:.35rem 0}.wf-md pre{background:color-mix(in oklch,var(--wf-md-on-surface) 8%,transparent);border-radius:.75rem;overflow:auto;padding:.75rem}.wf-md code{font-family:ui-monospace,Google Sans Mono,monospace}.wf-md ul{margin:.25rem;padding-inline-start:1.35rem}.wf-md-err{color:color-mix(in oklch,var(--wf-md-error) 85%,transparent)}.wf-hud{color:var(--wf-md-on-surface-variant);font:12px ui-sans-serif,system-ui,sans-serif;inset-block-end:4px;inset-inline-start:4px;margin:0;max-inline-size:min(920px,96vw);opacity:.88;padding:6px 10px;position:fixed}.wf-hud p{margin:.15rem}@media print{.wf-demo-root{background:#fff!important}.wf-demo-root,.wf-frame{min-block-size:0!important;overflow:visible!important}.wf-frame{background:transparent!important;block-size:auto!important;border:none!important;border-radius:0!important;inset:auto!important;bottom:auto!important;box-shadow:none!important;break-inside:avoid;color:#000!important;inline-size:100%!important;left:auto!important;max-block-size:none!important;max-inline-size:100%!important;position:static!important;right:auto!important;top:auto!important;z-index:auto!important}.wf-resize,.wf-titlebar{display:none!important}.wf-frame-body{background:transparent!important;block-size:auto!important;border-radius:0!important;flex:none!important;flex-basis:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;transform:none!important}.wf-hud{display:none!important}}";
//#endregion
//#region src/frontend/shells/environment/scss/main.scss?inline
var main_default = ".env-shell-root.wf-demo-root{background:transparent}.env-shell-root{color-scheme:light dark;--color-surface:var(--wf-md-surface,oklch(0.16 0.02 280));--color-on-surface:var(--wf-md-on-surface,oklch(0.93 0.02 274));--color-on-surface-variant:var(--wf-md-on-surface-variant,oklch(0.78 0.03 274));--color-surface-container:var(--wf-md-surf-container,oklch(0.22 0.03 276));--color-surface-container-high:var(--wf-md-surf-container-high,oklch(0.26 0.035 274));--color-outline-variant:var(--wf-md-outline-variant,oklch(1 0.02 280/12%));--on-surface-color:var(--wf-md-on-surface,oklch(0.93 0.02 274));--on-surface-variant:var(--wf-md-on-surface-variant,oklch(0.78 0.03 274))}@media (prefers-color-scheme:light){.env-shell-root{--wf-md-surface:oklch(0.98 0.008 280);--wf-md-surf-container-low:oklch(0.97 0.01 278);--wf-md-surf-container:oklch(0.94 0.012 276);--wf-md-surf-container-high:oklch(0.91 0.015 274);--wf-md-outline-variant:oklch(0 0 0/14%);--wf-md-on-surface:oklch(0.22 0.04 274);--wf-md-on-surface-variant:oklch(0.45 0.04 274);--color-surface:var(--wf-md-surface);--color-on-surface:var(--wf-md-on-surface);--color-on-surface-variant:var(--wf-md-on-surface-variant);--color-surface-container:var(--wf-md-surf-container);--color-surface-container-high:var(--wf-md-surf-container-high);--color-outline-variant:var(--wf-md-outline-variant);--on-surface-color:var(--wf-md-on-surface);--on-surface-variant:var(--wf-md-on-surface-variant)}}.env-shell-root{isolation:isolate;min-block-size:100dvb;overflow:visible;position:relative;--env-window-z-boost:400;--env-mobile-dock-reserve:calc(3rem + env(safe-area-inset-bottom, 0px));--env-shell-chrome-stack-reserve:var(--env-mobile-dock-reserve)}@media (min-width:641px){.env-shell-root{--env-shell-chrome-stack-reserve:7.5rem;--env-mobile-dock-reserve:0px}}.env-shell-wallpaper{inset:0;pointer-events:none;position:fixed;z-index:0}.env-shell-overlays,[data-env-shell-overlays]{box-sizing:border-box;inset:0;pointer-events:none;position:absolute;z-index:2147483600}.env-shell-workspace{align-items:stretch;box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;min-block-size:100dvb;position:relative;z-index:1}.wf-view-host,.wf-view-placeholder{box-sizing:border-box;margin:0;padding:0}.wf-view-host,.wf-view-host>.wf-mounted-view,.wf-view-placeholder{align-self:stretch;display:flex;flex:1 1 0%;flex-direction:column;min-block-size:0;min-inline-size:0;overflow:hidden}.wf-view-placeholder__title{font:600 1rem/1.3 system-ui,sans-serif;margin:0 0 .5rem}.wf-view-placeholder__hint{font:400 .875rem/1.4 system-ui,sans-serif;margin:0;opacity:.75}.env-shell-workspace .wf-frame,.env-shell-workspace ui-window.env-ui-window{border-color:color-mix(in oklch,var(--wf-md-outline-variant,oklch(100% .02 280deg/.12)) 130%,transparent)}.env-shell-workspace ui-window.env-ui-window{--env-window-z-boost:var(--env-window-z-boost,0);pointer-events:auto}.env-shell-workspace ui-window.env-ui-window[data-desk-max],.env-shell-workspace ui-window.env-ui-window[maximized]:not([data-mobile-max]){box-sizing:border-box}.env-shell-workspace :is(.env-ui-window__body,.env-ui-window__view-host,.wf-mounted-view){block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;pointer-events:auto}.env-shell-home-mount,.env-shell-workspace .env-home-workspace,.env-shell-workspace .speed-dial-root,.env-shell-workspace .view-home{block-size:100%;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0}.env-shell-workspace .wf-frame .wf-titlebar,.env-shell-workspace ui-window.env-ui-window::part(title-handler){pointer-events:auto;position:relative;z-index:50}.env-shell-workspace .wf-frame .wf-frame-body,.env-shell-workspace ui-window.env-ui-window::part(content-handler){contain:paint;position:relative;transform:translateZ(0);z-index:0}.env-shell-workspace .wf-frame .wf-resize,.env-shell-workspace ui-window.env-ui-window::part(resizer){pointer-events:auto;z-index:4}@media print{.wf-view-host,.wf-view-host>.wf-mounted-view{align-self:stretch!important;block-size:auto!important;display:block!important;flex:none!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important}}.env-shell-workspace{padding:0}.env-shell-chrome{color:var(--wf-md-on-surface-variant,oklch(78% .03 274deg));display:flex;flex-direction:column;font:12px ui-sans-serif,system-ui,sans-serif;gap:0;inset-block-end:0;inset-inline:0;isolation:isolate;pointer-events:none;position:fixed;z-index:2147483000}.env-shell-chrome>*{pointer-events:auto}.env-shell-taskbar{align-items:stretch;backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);background:color-mix(in oklab,#1a1a1a 72%,transparent);block-size:2.5rem;border-block-start:1px solid color-mix(in oklab,#fff 12%,transparent);box-shadow:none;color:#f3f3f3;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;min-block-size:2.5rem;order:0;padding:0 .25rem;padding-block-end:env(safe-area-inset-bottom,0);position:relative}.env-shell-taskbar-under,.env-shell-taskbar-under.underlying-shadow-container{overflow:visible!important;pointer-events:none!important;z-index:-1!important}.env-shell-taskbar-under .underlying-shadow-geometry{background:transparent!important;box-shadow:0 -8px 28px rgba(0,0,0,.4)!important}.env-shell-taskbar::part(taskbar){align-items:stretch;display:flex;flex:1;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:100%;min-inline-size:0}.env-shell-taskbar__pins,.env-shell-taskbar__windows{align-items:stretch;display:flex;flex-direction:row;flex-wrap:nowrap;gap:0;min-inline-size:0}.env-shell-taskbar__pins{flex:0 0 auto}.env-shell-taskbar__windows{flex:1 1 auto;justify-content:flex-start;overflow-x:auto;scrollbar-width:thin}.env-shell-taskbar ui-task{align-self:stretch;background:transparent;border:0;border-radius:0;box-shadow:inset 0 -2px 0 transparent;color:inherit;cursor:pointer;min-block-size:100%;min-inline-size:2.75rem;opacity:1;outline:none;padding-inline:.55rem}.env-shell-taskbar ui-task:hover{background:color-mix(in oklab,#fff 10%,transparent);opacity:1}.env-shell-taskbar :is(ui-task[data-active],ui-task[data-env-active=true],ui-task[data-focus]){background:color-mix(in oklab,#fff 14%,transparent);box-shadow:inset 0 -2px 0 #60cdff;opacity:1;outline:none}.env-shell-taskbar ui-task[data-minimized]{opacity:.65}.env-shell-taskbar__tray-host{align-items:center;border-inline-start:1px solid color-mix(in oklab,#fff 12%,transparent);display:flex;flex:0 0 auto;gap:.35rem;margin-inline-start:auto;padding-inline:.35rem}.env-shell-taskbar__clock{align-items:flex-end;display:flex;flex-direction:column;gap:.05rem;justify-content:center;line-height:1.05;min-inline-size:4.5rem;padding-inline:.35rem .15rem;pointer-events:none;user-select:none}.env-shell-taskbar__clock-time{color:#f3f3f3;font-size:.78rem;font-variant-numeric:tabular-nums;font-weight:600}.env-shell-taskbar__clock-date{color:color-mix(in oklab,#f3f3f3 72%,transparent);font-size:.62rem;font-weight:500;white-space:nowrap}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title){display:none!important}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task{min-inline-size:2.5rem;padding-inline:.45rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter){font-size:.8rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar{align-items:center;backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;block-size:3rem;border-block-start:none;box-shadow:none;display:flex;flex-direction:row;gap:0;justify-content:center;min-block-size:3rem;padding:.15rem .75rem;padding-block-end:calc(.15rem + env(safe-area-inset-bottom, 0px));position:relative}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins{align-items:center;flex:0 0 auto;justify-content:center}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]),.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]{background:transparent;border-radius:999px;box-shadow:none;min-block-size:2.75rem;min-inline-size:2.75rem;padding:0;touch-action:manipulation;user-select:none}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title){display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon){block-size:1.5rem;inline-size:1.5rem}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home]:active,ui-task[data-env-home]:hover){background:color-mix(in oklch,#fff 10%,transparent)}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home][data-active],ui-task[data-env-home][data-env-active=true],ui-task[data-env-home][data-focus]){background:color-mix(in oklch,#fff 8%,transparent);box-shadow:inset 0 -2px 0 #60cdff}.env-shell-navbar__switcher{backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);background:color-mix(in oklch,#1c1c1e 96%,transparent);border:1px solid color-mix(in oklch,#fff 12%,transparent);border-radius:.85rem;box-shadow:0 12px 32px rgba(0,0,0,.45);color:#f2f2f7;inset-block-end:calc(100% + .4rem);inset-inline:.75rem;max-block-size:min(50dvb,20rem);overflow:auto;padding:.35rem;position:absolute;z-index:5}.env-shell-navbar__switcher[hidden]{display:none!important}.env-shell-navbar__switcher-list{display:flex;flex-direction:column;gap:.15rem;list-style:none;margin:0;padding:0}.env-shell-navbar__switcher-empty{font:400 .8125rem/1.3 system-ui,sans-serif;opacity:.72;padding:.75rem .85rem;text-align:center}.env-shell-navbar__switcher-item{align-items:center;appearance:none;background:transparent;border:0;border-radius:.65rem;color:inherit;cursor:pointer;display:flex;flex-direction:row;font:500 .875rem/1.25 system-ui,sans-serif;gap:.65rem;margin:0;padding:.65rem .75rem;text-align:start;width:100%}.env-shell-navbar__switcher-item:focus-visible,.env-shell-navbar__switcher-item:hover{background:color-mix(in oklch,#fff 10%,transparent);outline:none}.env-shell-navbar__switcher-item[data-active]{background:color-mix(in oklch,#60cdff 18%,transparent)}.env-shell-navbar__switcher-item ui-icon{flex:0 0 auto;--icon-size:1.25rem;block-size:1.25rem;inline-size:1.25rem}.env-shell-chrome:not([data-desktop]) .env-ui-statusbar{display:none!important}.env-ui-statusbar{backdrop-filter:blur(10px);background:color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent);border-block-start:1px solid var(--wf-md-outline-variant,color-mix(in oklch,white 12%,transparent));order:1;padding:.35rem .65rem calc(.35rem + env(safe-area-inset-bottom, 0))}.env-ui-statusbar__intro p{margin:.1rem 0;opacity:.92}.env-ui-statusbar__right{align-items:center;display:flex;justify-content:flex-end}.env-status-bar__tray{align-items:center;display:flex;flex-wrap:wrap;gap:.35rem}.env-status-bar__chip{align-items:center;background:color-mix(in oklch,var(--wf-md-on-surface,white) 8%,transparent);border:1px solid var(--wf-md-outline-variant,color-mix(in oklch,white 10%,transparent));border-radius:999px;display:inline-flex;gap:.25rem;line-height:1;padding:.12rem .35rem}.env-status-bar__chip ui-icon{display:block;font-size:1.15rem}.env-status-bar__pct{font-variant-numeric:tabular-nums;opacity:.95}.env-status-bar__meta{font-size:11px;margin:0;opacity:.88}.env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop]{opacity:0;pointer-events:none;visibility:hidden}@media (min-width:641px){.env-device-tray--footer{display:none!important}}.env-shell-chrome:not([data-desktop]) :is(.env-device-tray--footer,.env-device-tray--taskbar,.env-shell-taskbar__tray-host),.env-shell-chrome[data-desktop] .env-device-tray--footer{display:none!important}.env-shell-app-menu{pointer-events:auto}.env-shell-app-menu:empty{display:none}.env-shell-root[data-env-crx=\"1\"]{isolation:isolate}";
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
		const path = String(globalThis.location?.pathname || "").replace(/^\/+|\/+$/g, "").toLowerCase();
		const id = view || path || "explorer";
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
	explorer: () => import("../chunks/src4.js"),
	viewer: () => import("../chunks/src8.js"),
	markdown: () => import("../chunks/src8.js"),
	history: () => import("../chunks/src5.js"),
	workcenter: () => import("../chunks/src9.js"),
	editor: () => import("../chunks/src3.js"),
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
		const mod = await import("../chunks/launcher-state.js").then((n) => n.n);
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
		const ensure = (id, cell, icon, label, view) => {
			if (!isEnabledView(view) && view !== "home") return;
			if (items.find?.((it) => String(it?.id) === id || String(it?.meta?.view || "").toLowerCase() === view)) return;
			mod.addSpeedDialItem({
				id,
				cell: observe(cell),
				icon,
				label,
				action: "open-view",
				meta: { view }
			});
		};
		ensure("shortcut-network", [0, 0], "wifi-high", "Network", "network");
		ensure("shortcut-settings", [1, 0], "gear-six", "Settings", "settings");
		ensure("shortcut-explorer", [2, 0], "books", "Explorer", "explorer");
		ensure("shortcut-viewer", [3, 0], "article", "Markdown", "viewer");
		ensure("shortcut-history", [0, 1], "clock-counter-clockwise", "History", "history");
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
		mountViewModule(() => import("../com/app8.js"), homeMount, { shellContext }).then((unmount) => {
			this.homeUnmount = unmount;
		}).catch((err) => {
			console.warn("[EnvironmentShell] home-view failed", err);
			homeMount.innerHTML = `<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`;
		});
	}
	focusHome() {
		if (typeof matchMedia === "function" && matchMedia("(max-width: 640px)").matches) this.windowLayer?.closeAllWindows?.();
		else this.windowLayer?.blurWindows?.();
		this.setFocusedTaskId?.("home");
		this.focusedTaskId.value = "home";
		this.currentView.value = "home";
	}
	openInWindow(viewId, opts) {
		const id = String(viewId || "").trim().toLowerCase();
		if (!id || id === "airpad") return;
		const withNative = mergeNativeOpt(id, opts);
		if (!this.windowLayer?.focusWindow(id)) this.windowLayer?.shellContext.openView?.(id, withNative);
		else if (wantsNative(withNative)) this.windowLayer?.enterNative?.(id);
		this.setFocusedTaskId?.(id === "markdown" ? "viewer" : id);
		this.currentView.value = id;
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
			this.focusHome();
			try {
				const searchParams = new URLSearchParams(params || {});
				searchParams.set("shell", this.id);
				const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
				const next = `${location.pathname}${search}`;
				if (`${location.pathname}${location.search}` !== next) history.replaceState({
					viewId: "home",
					params
				}, "", next);
			} catch {}
			return;
		}
		this.openInWindow(id, params ? { params } : void 0);
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
