import { C as getCorrectOrientation, F as isInFocus, O as MOCElement, o as DOMMixin, p as loadAsAdopted, w as orientationNumberMap } from "../fest/dom.js";
import { c as propRef, n as affected, o as numberRef, s as observe } from "../fest/object.js";
import { i as setAppWallpaperFromBlob, n as getWallpaperStoragePointer } from "../vendor/culori.js";
import { i as H, u as M } from "./app.js";
import { I as vector2Ref, L as registerModal, R as navigate, k as elementPointerMap, l as handleIncomingEntries, v as pointerAnchorRef } from "./app2.js";
import "../fest/icon.js";
import "../chunks/src.js";
import { r as HomeChannelAction } from "../chunks/channel-actions.js";
import { A as wallpaperState, C as removeSpeedDialItem, D as speedDialItems, E as snapshotSpeedDialItem, O as speedDialMeta, S as persistWallpaper, T as resolveSpeedDialItemHref, _ as parseSpeedDialItemFromJSON, a as createSpeedDialItemFromClipboard, b as persistSpeedDialItems, c as getDefaultOpenLinkTarget, d as isExternalWebHref, g as openInNewBrowserTab, h as openInDetachedBrowserWindow, i as createEmptySpeedDialItem, k as upsertSpeedDialItem, l as getSpeedDialMeta, m as normalizeOpenLinkTarget, n as addSpeedDialItem, o as ensureSpeedDialMeta, p as normalizeExternalWebHref, r as buildSpeedDialViewPathHref, s as findSpeedDialItem, t as NAVIGATION_SHORTCUTS, u as gridLayoutState, v as parseSpeedDialItemFromURL, w as resolveItemOpenLinkTarget, x as persistSpeedDialMeta, y as parseSpeedDialViewFromHref } from "../chunks/launcher-state.js";
//#region ../../modules/views/home-view/src/ts/layout.ts
var DEFAULT_LAYOUT = [4, 8];
var clamp = (value, min, max) => {
	return Math.max(min, Math.min(max, value));
};
var positiveInteger = (value, fallback) => {
	const number = Number(value);
	return Number.isFinite(number) && number > 0 ? Math.max(1, Math.floor(number)) : fallback;
};
var normalizeLayout = (layout) => {
	return [positiveInteger(layout?.[0], DEFAULT_LAYOUT[0]), positiveInteger(layout?.[1], DEFAULT_LAYOUT[1])];
};
/**
* Normalize numeric orientation values without allowing invalid strings to
* silently select a different layout.
*/
var normalizeOrient = (value) => {
	if (typeof value === "string" && !/^-?\d+(?:\.\d+)?$/.test(value.trim())) return 0;
	const number = Number(value);
	if (!Number.isFinite(number)) return 0;
	return (Math.trunc(number) % 4 + 4) % 4;
};
/** Return the visible `[columns, rows]` for a logical grid and orientation. */
var visualLayout = (layout, orient) => {
	const [columns, rows] = normalizeLayout(layout);
	return normalizeOrient(orient) % 2 ? [rows, columns] : [columns, rows];
};
var clampVisualCell = (cell, layout, orient) => {
	const [columns, rows] = visualLayout(layout, orient);
	return [clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1), clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1)];
};
/**
* Convert persisted logical coordinates to visible CSS-grid coordinates.
*
* Persisted cells always use the unrotated grid. Only this projection changes
* when `orient` changes, so rotating the root never rewrites user state.
*/
var logicalToVisualCell = (cell, layout, orient) => {
	const [columns, rows] = normalizeLayout(layout);
	const normalizedOrient = normalizeOrient(orient);
	const x = clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1);
	const y = clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1);
	switch (normalizedOrient) {
		case 1: return [y, columns - 1 - x];
		case 2: return [columns - 1 - x, rows - 1 - y];
		case 3: return [rows - 1 - y, x];
		default: return [x, y];
	}
};
/** Convert visible CSS-grid coordinates back to persisted logical coordinates. */
var visualToLogicalCell = (cell, layout, orient) => {
	const [columns, rows] = normalizeLayout(layout);
	const normalizedOrient = normalizeOrient(orient);
	const [x, y] = clampVisualCell(cell, [columns, rows], normalizedOrient);
	switch (normalizedOrient) {
		case 1: return [columns - 1 - y, x];
		case 2: return [columns - 1 - x, rows - 1 - y];
		case 3: return [y, rows - 1 - x];
		default: return [x, y];
	}
};
/**
* Resolve a local point in the visible grid content box to a logical cell.
* The caller is responsible for subtracting CSS padding from the point and
* passing the content-box size.
*/
var pointToLogicalCell = (point, size, layout, orient, mode = "floor") => {
	const visible = visualLayout(layout, orient);
	const width = Math.max(1, Number(size?.[0]) || 1);
	const height = Math.max(1, Number(size?.[1]) || 1);
	const xRatio = clamp((Number(point?.[0]) || 0) / width, 0, 1);
	const yRatio = clamp((Number(point?.[1]) || 0) / height, 0, 1);
	const project = (ratio, count) => {
		const value = ratio * count;
		return mode === "round" ? Math.round(value - .5) : Math.floor(value);
	};
	return visualToLogicalCell([clamp(project(xRatio, visible[0]), 0, visible[0] - 1), clamp(project(yRatio, visible[1]), 0, visible[1] - 1)], layout, orient);
};
var cellKey = (cell) => `${cell[0]}:${cell[1]}`;
/** Clamp a logical cell to the supplied grid. */
var clampLogicalCell = (cell, layout) => {
	const [columns, rows] = normalizeLayout(layout);
	return [clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1), clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1)];
};
/**
* Choose the closest deterministic free cell without mutating the occupied
* set. The dragged item is excluded by the caller before invoking this helper.
*/
var findNearestFreeCell = (preferred, occupied, layout) => {
	const normalizedLayout = normalizeLayout(layout);
	const start = clampLogicalCell(preferred, normalizedLayout);
	if (!occupied.has(cellKey(start))) return start;
	const [columns, rows] = normalizedLayout;
	const maxRadius = Math.max(columns, rows);
	for (let radius = 1; radius <= maxRadius; radius += 1) for (let y = Math.max(0, start[1] - radius); y <= Math.min(rows - 1, start[1] + radius); y += 1) for (let x = Math.max(0, start[0] - radius); x <= Math.min(columns - 1, start[0] + radius); x += 1) {
		if (Math.abs(x - start[0]) !== radius && Math.abs(y - start[1]) !== radius) continue;
		const candidate = [x, y];
		if (!occupied.has(cellKey(candidate))) return candidate;
	}
	return start;
};
//#endregion
//#region ../../modules/views/home-view/src/ts/pointer-interaction.ts
var DRAG_THRESHOLD_PX = 6;
var SETTLE_DURATION_MS = 240;
var SETTLE_EASING = "cubic-bezier(0.22, 0.8, 0.3, 1)";
var centerOf = (rect) => [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
var translate = (x, y) => `translate3d(${x}px, ${y}px, 0)`;
var getGridContentPoint = (grid, clientPoint) => {
	const rect = grid.getBoundingClientRect();
	const styles = getComputedStyle(grid);
	const paddingLeft = parseFloat(styles.paddingLeft) || 0;
	const paddingRight = parseFloat(styles.paddingRight) || 0;
	const paddingTop = parseFloat(styles.paddingTop) || 0;
	const paddingBottom = parseFloat(styles.paddingBottom) || 0;
	const width = Math.max(1, rect.width - paddingLeft - paddingRight);
	const height = Math.max(1, rect.height - paddingTop - paddingBottom);
	return {
		point: [clientPoint[0] - rect.left - paddingLeft, clientPoint[1] - rect.top - paddingTop],
		size: [width, height]
	};
};
var setInteractionState = (nodes, state, coordinate) => {
	for (const node of nodes) {
		node.dataset.interactionState = state;
		node.dataset.gridCoordinateState = coordinate;
	}
};
var resetTransforms = (nodes) => {
	for (const node of nodes) {
		node.style.removeProperty("transform");
		node.style.setProperty("--drag-x", "0px");
		node.style.setProperty("--drag-y", "0px");
		node.removeAttribute("data-dragging");
	}
};
var clearDragOffsets = (nodes) => {
	for (const node of nodes) {
		node.style.setProperty("--drag-x", "0px");
		node.style.setProperty("--drag-y", "0px");
	}
};
var animateNodeToCell = async (node, fromRect, toRect) => {
	const [fromX, fromY] = centerOf(fromRect);
	const [toX, toY] = centerOf(toRect);
	const offsetX = fromX - toX;
	const offsetY = fromY - toY;
	const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
	node.style.transition = "none";
	node.style.transform = translate(offsetX, offsetY);
	if (reducedMotion || typeof node.animate !== "function" || Math.abs(offsetX) < .5 && Math.abs(offsetY) < .5) {
		node.style.removeProperty("transform");
		node.style.removeProperty("transition");
		return;
	}
	const animation = node.animate([{ transform: translate(offsetX, offsetY) }, { transform: translate(0, 0) }], {
		duration: SETTLE_DURATION_MS,
		easing: SETTLE_EASING,
		fill: "forwards"
	});
	try {
		await animation.finished;
	} catch {} finally {
		animation.cancel();
		node.style.removeProperty("transform");
		node.style.removeProperty("transition");
	}
};
var occupiedCells = (items, exceptId) => {
	const occupied = /* @__PURE__ */ new Set();
	for (const entry of items) if (entry.id !== exceptId) occupied.add(cellKey(entry.cell));
	return occupied;
};
/**
* Bind one launcher tile to a pointer-driven drag lifecycle.
* The caller owns persistence and cell rendering; this controller only owns
* pointer capture, target selection, animation, and interaction state.
*/
var bindPointerInteraction = (node, options) => {
	let pointerId = null;
	let pointerDownAt = null;
	let grabOffset = [0, 0];
	let lastPointerClient = null;
	let dragging = false;
	let suppressClickUntil = 0;
	let animationRun = 0;
	const nodes = () => [node];
	const getDropCell = (clientPoint) => {
		const grid = node.closest(".speed-dial-grid");
		if (!grid) return [...options.item.cell];
		const { point, size } = getGridContentPoint(grid, clientPoint);
		return findNearestFreeCell(pointToLogicalCell([point[0] - grabOffset[0], point[1] - grabOffset[1]], size, options.getLayout(), options.getOrient()), occupiedCells(options.items, options.item.id), options.getLayout());
	};
	const clearPointer = () => {
		pointerId = null;
		pointerDownAt = null;
		grabOffset = [0, 0];
		lastPointerClient = null;
	};
	const onPointerDown = (event) => {
		if (pointerId !== null || event.button !== 0) return;
		pointerId = event.pointerId;
		lastPointerClient = null;
		pointerDownAt = [event.clientX, event.clientY];
		const center = centerOf(node.getBoundingClientRect());
		grabOffset = [event.clientX - center[0], event.clientY - center[1]];
		node.setPointerCapture?.(event.pointerId);
	};
	const onPointerMove = (event) => {
		if (pointerId !== event.pointerId || !pointerDownAt) return;
		const dx = event.clientX - pointerDownAt[0];
		const dy = event.clientY - pointerDownAt[1];
		if (!dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
		if (!dragging) {
			dragging = true;
			suppressClickUntil = performance.now() + SETTLE_DURATION_MS + 80;
			node.dataset.dragging = "";
			setInteractionState(nodes(), "onGrab", "source");
			node.dispatchEvent(new CustomEvent("m-dragstart", { bubbles: true }));
		}
		event.preventDefault();
		lastPointerClient = [event.clientX, event.clientY];
		const activeNodes = nodes();
		node.style.setProperty("--drag-x", `${dx}px`);
		node.style.setProperty("--drag-y", `${dy}px`);
		setInteractionState(activeNodes, "onMoving", "intermediate");
		node.dispatchEvent(new CustomEvent("m-dragging", {
			bubbles: true,
			detail: {
				dx,
				dy,
				cell: [...options.item.cell]
			}
		}));
	};
	const finishDrag = async (event) => {
		if (pointerId !== event.pointerId || !pointerDownAt) return;
		const wasDragging = dragging;
		dragging = false;
		node.releasePointerCapture?.(event.pointerId);
		const dropPoint = lastPointerClient ?? [event.clientX, event.clientY];
		clearPointer();
		if (!wasDragging) return;
		event.preventDefault();
		const currentNodes = nodes();
		const fromRects = new Map(currentNodes.map((entry) => [entry, entry.getBoundingClientRect()]));
		const targetCell = getDropCell(dropPoint);
		const run = ++animationRun;
		setInteractionState(currentNodes, "onRelax", "destination");
		options.onCommitCell(targetCell);
		clearDragOffsets(currentNodes);
		node.offsetWidth;
		const animations = currentNodes.map((entry) => animateNodeToCell(entry, fromRects.get(entry) || entry.getBoundingClientRect(), entry.getBoundingClientRect()));
		await Promise.all(animations);
		if (run !== animationRun) return;
		resetTransforms(currentNodes);
		setInteractionState(currentNodes, "onPlace", "destination");
		options.onSettled?.(targetCell);
		node.dispatchEvent(new CustomEvent("m-dragsettled", {
			bubbles: true,
			detail: {
				cell: [...targetCell],
				interactionState: "onPlace",
				coordinateState: "destination"
			}
		}));
		window.setTimeout(() => {
			if (run !== animationRun) return;
			setInteractionState(nodes(), "onHover", "source");
		}, SETTLE_DURATION_MS);
	};
	const onPointerUp = (event) => {
		finishDrag(event);
	};
	const onPointerCancel = (event) => {
		if (pointerId !== event.pointerId) return;
		animationRun += 1;
		dragging = false;
		node.releasePointerCapture?.(event.pointerId);
		resetTransforms(nodes());
		setInteractionState(nodes(), "onHover", "source");
		clearPointer();
	};
	const onClick = (event) => {
		if (performance.now() < suppressClickUntil) {
			event.preventDefault();
			event.stopPropagation();
		}
	};
	node.addEventListener("pointerdown", onPointerDown);
	node.addEventListener("pointermove", onPointerMove);
	node.addEventListener("pointerup", onPointerUp);
	node.addEventListener("pointercancel", onPointerCancel);
	node.addEventListener("click", onClick, true);
	return () => {
		animationRun += 1;
		node.removeEventListener("pointerdown", onPointerDown);
		node.removeEventListener("pointermove", onPointerMove);
		node.removeEventListener("pointerup", onPointerUp);
		node.removeEventListener("pointercancel", onPointerCancel);
		node.removeEventListener("click", onClick, true);
		resetTransforms(nodes());
		clearPointer();
	};
};
//#endregion
//#region ../../modules/views/home-view/src/ts/toast.ts
/**
* Lightweight toasts for home-view / SpeedDial (no CWSP-shell core).
* Shells may listen for `view:toast` on `window` and render FL-UI / status UI.
*/
function showSuccess(message) {
	globalThis.dispatchEvent?.(new CustomEvent("view:toast", { detail: {
		type: "success",
		message: String(message || "")
	} }));
}
function showError(message) {
	globalThis.dispatchEvent?.(new CustomEvent("view:toast", { detail: {
		type: "error",
		message: String(message || "")
	} }));
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/ContextMenu.ts
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var IMPORTANT_CSS = "important";
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var cleanupFns = [];
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
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
	menu.style.setProperty("backdrop-filter", "none", IMPORTANT_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "none", IMPORTANT_CSS);
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
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
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
            box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16));
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
var getOverlayHost = () => {
	return document.querySelector("[data-app-layer=\"overlay\"]") || document.body;
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
	stampContextMenuList(list);
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
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
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
	const overlayHost = getOverlayHost();
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	menuLayer = layer;
	overlayHost.appendChild(layer);
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session);
	rootMenu = menu;
	layer.appendChild(menu);
	placeMenu(menu, request.x, request.y);
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
//#region ../../modules/views/home-view/src/ts/ShortcutEditor.ts
/** WHY: Match context-menu pin — Settings may not have applied data-theme yet. */
function resolveEditorTheme() {
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
}
function synthesizeViewHref(view, openLinkTarget = "inline") {
	const id = String(view || "").trim().replace(/^#/, "").replace(/^\/+/, "");
	if (!id) return "";
	const target = String(openLinkTarget || "inline").trim().toLowerCase();
	return `/${id}?shell=environment${target === "native-window" || target === "native" || target === "window" ? "&native=1" : ""}&view=${encodeURIComponent(id)}`;
}
/** WHY: Coerce fest refs / odd wrappers into a plain string for form controls. */
function asDraftText(value, fallback = "") {
	if (value == null) return fallback;
	if (typeof value === "object" && value !== null && "value" in value) {
		const inner = value.value;
		if (inner == null) return fallback;
		return String(inner);
	}
	return String(value) || fallback;
}
function fillTextControl(el, value) {
	if (!el) return;
	el.value = value;
	if (el instanceof HTMLInputElement) el.setAttribute("value", value);
}
var isDefaultViewAction = (action) => action === "open-view";
var isDefaultHrefAction = (action) => action === "open-link";
var setSelectOptions = (select, options, selectedValue, placeholder) => {
	if (!select) return;
	select.innerHTML = "";
	if (placeholder) {
		const placeholderOption = document.createElement("option");
		placeholderOption.value = placeholder.value;
		placeholderOption.textContent = placeholder.label;
		placeholderOption.selected = selectedValue === placeholder.value;
		select.append(placeholderOption);
	}
	for (const option of options) {
		const node = document.createElement("option");
		node.value = option.value;
		node.textContent = option.label;
		node.selected = option.value === selectedValue;
		select.append(node);
	}
	if (selectedValue && !options.some((option) => option.value === selectedValue)) {
		const fallbackOption = document.createElement("option");
		fallbackOption.value = selectedValue;
		fallbackOption.textContent = selectedValue;
		fallbackOption.selected = true;
		select.append(fallbackOption);
	}
	if (selectedValue) select.value = selectedValue;
};
var openShortcutEditor = (options) => {
	const { mode, initial, actionOptions, viewOptions, onSave, onDelete, isViewAction = isDefaultViewAction, isHrefAction = isDefaultHrefAction, registerForBackNavigation = false } = options;
	const modal = document.createElement("dialog");
	modal.className = "speed-dial-editor";
	const theme = resolveEditorTheme();
	modal.dataset.theme = theme;
	modal.innerHTML = `
        <form class="speed-dial-editor__form" data-theme="${theme}" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">${mode === "create" ? "Create shortcut" : "Edit shortcut"}</h2>
                <p class="modal-description">Configure quick access tiles for frequently used views or links.</p>
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="sd-edit-label">Label</label>
                    <input id="sd-edit-label" name="label" type="text" minlength="1" required />
                </div>
                <div class="modal-field">
                    <label for="sd-edit-icon">Icon</label>
                    <input id="sd-edit-icon" name="icon" type="text" placeholder="phosphor icon name" />
                </div>
                <div class="modal-field">
                    <label for="sd-edit-shape">Shape</label>
                    <select id="sd-edit-shape" name="shape">
                        <option value="squircle">Squircle</option>
                        <option value="circle">Circle</option>
                        <option value="square">Rounded square</option>
                    </select>
                </div>
                <div class="modal-field">
                    <label for="sd-edit-action">Action</label>
                    <select id="sd-edit-action" name="action"></select>
                </div>
                <div class="modal-field" data-field="view">
                    <label for="sd-edit-view">View</label>
                    <select id="sd-edit-view" name="view"></select>
                </div>
                <div class="modal-field" data-field="href">
                    <label for="sd-edit-href">Link</label>
                    <input id="sd-edit-href" name="href" type="text" inputmode="url" autocomplete="off" placeholder="/settings?native=1, /workcenter, or https://…" />
                </div>
                <div class="modal-field" data-field="open-link-target">
                    <label for="sd-edit-open-target">Open link in</label>
                    <select id="sd-edit-open-target" name="openLinkTarget">
                        <option value="inline">Open Inline (env window, same tab)</option>
                        <option value="native-window">Native window (new browser window)</option>
                        <option value="new-tab">Open in new tab</option>
                    </select>
                </div>
                <div class="modal-field">
                    <label for="sd-edit-description">Description</label>
                    <textarea id="sd-edit-description" name="description" rows="2" placeholder="Optional description"></textarea>
                </div>
            </div>
            <footer class="modal-actions">
                <div class="modal-actions-left">
                    ${mode === "edit" ? "<button type=\"button\" data-action=\"delete\" class=\"btn danger\">Delete</button>" : ""}
                </div>
                <div class="modal-actions-right">
                    <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                    <button type="submit" class="btn save">Save</button>
                </div>
            </footer>
        </form>
    `;
	const form = modal.querySelector("form");
	const fields = form?.querySelector(".modal-fields");
	const labelInput = form?.querySelector("input[name=\"label\"]");
	const iconInput = form?.querySelector("input[name=\"icon\"]");
	const shapeSelect = form?.querySelector("select[name=\"shape\"]");
	const actionSelect = form?.querySelector("select[name=\"action\"]");
	const viewSelect = form?.querySelector("select[name=\"view\"]");
	const hrefInput = form?.querySelector("input[name=\"href\"]");
	const openLinkTargetSelect = form?.querySelector("select[name=\"openLinkTarget\"]");
	const descriptionInput = form?.querySelector("textarea[name=\"description\"]");
	const viewField = form?.querySelector("[data-field=\"view\"]");
	const hrefField = form?.querySelector("[data-field=\"href\"]");
	const openLinkTargetField = form?.querySelector("[data-field=\"open-link-target\"]");
	const labelValue = asDraftText(initial.label, "New shortcut");
	const iconValue = asDraftText(initial.icon, "sparkle");
	const hrefValue = asDraftText(initial.href, "");
	const descriptionValue = asDraftText(initial.description, "");
	const actionValue = asDraftText(initial.action, "open-view");
	const viewValue = asDraftText(initial.view, "");
	const shapeVal = asDraftText(initial.shape, "squircle").toLowerCase();
	const olt = asDraftText(initial.openLinkTarget, "inline").toLowerCase();
	fillTextControl(labelInput, labelValue);
	fillTextControl(iconInput, iconValue);
	if (shapeSelect) shapeSelect.value = [
		"circle",
		"square",
		"squircle"
	].includes(shapeVal) ? shapeVal : "squircle";
	if (openLinkTargetSelect) openLinkTargetSelect.value = olt === "native-window" || olt === "native" || olt === "window" ? "native-window" : olt === "new-tab" || olt === "tab" || olt === "browser" || olt === "browser-tab" ? "new-tab" : "inline";
	if (hrefInput) {
		fillTextControl(hrefInput, hrefValue);
		const autoHref = synthesizeViewHref(viewValue, openLinkTargetSelect?.value || olt);
		if (autoHref) hrefInput.placeholder = `Auto: ${autoHref}`;
	}
	fillTextControl(descriptionInput, descriptionValue);
	setSelectOptions(actionSelect, actionOptions, actionValue);
	setSelectOptions(viewSelect, viewOptions, viewValue, {
		value: "",
		label: "Choose view"
	});
	const currentOpenTarget = () => String(openLinkTargetSelect?.value || olt || "inline");
	const syncFieldVisibility = () => {
		const action = String(actionSelect?.value || "");
		if (viewField) viewField.hidden = !isViewAction(action);
		if (hrefField) hrefField.hidden = !isHrefAction(action);
		if (openLinkTargetField) openLinkTargetField.hidden = !(action === "open-link" || isHrefAction(action));
		if (action === "open-link" && hrefInput && !String(hrefInput.value || "").trim()) {
			const fromView = synthesizeViewHref(String(viewSelect?.value || viewValue || ""), currentOpenTarget());
			if (fromView) hrefInput.value = fromView;
		}
		const autoHref = synthesizeViewHref(String(viewSelect?.value || viewValue || ""), currentOpenTarget());
		if (hrefInput && autoHref) hrefInput.placeholder = `Auto: ${autoHref}`;
	};
	viewSelect?.addEventListener("change", () => {
		const autoHref = synthesizeViewHref(String(viewSelect?.value || ""), currentOpenTarget());
		if (hrefInput && autoHref) hrefInput.placeholder = `Auto: ${autoHref}`;
	});
	openLinkTargetSelect?.addEventListener("change", syncFieldVisibility);
	let closed = false;
	let unregisterBackNav = null;
	const closeModal = () => {
		if (closed) return;
		closed = true;
		unregisterBackNav?.();
		unregisterBackNav = null;
		try {
			if (modal.open) modal.close();
		} catch {}
		modal.remove();
	};
	actionSelect?.addEventListener("change", syncFieldVisibility);
	syncFieldVisibility();
	modal.addEventListener("cancel", (event) => {
		event.preventDefault();
		closeModal();
	});
	modal.addEventListener("click", (event) => {
		if (event.target === modal) closeModal();
	});
	form?.addEventListener("pointerdown", (event) => {
		event.stopPropagation();
	}, true);
	form?.addEventListener("click", (event) => {
		const target = event.target;
		const action = target?.closest?.("[data-action]")?.getAttribute?.("data-action") || target?.dataset?.action || "";
		if (action === "cancel") {
			event.preventDefault();
			closeModal();
			return;
		}
		if (action === "delete" && mode === "edit") {
			event.preventDefault();
			onDelete?.();
			closeModal();
		}
	});
	form?.addEventListener("submit", (event) => {
		event.preventDefault();
		onSave({
			label: String(labelInput?.value || "").trim() || "Item",
			icon: String(iconInput?.value || "").trim() || "sparkle",
			action: String(actionSelect?.value || "open-view"),
			view: String(viewSelect?.value || "").trim(),
			href: String(hrefInput?.value || "").trim(),
			description: String(descriptionInput?.value || "").trim(),
			shape: String(shapeSelect?.value || "squircle").toLowerCase(),
			openLinkTarget: (() => {
				const v = String(openLinkTargetSelect?.value || "inline").toLowerCase();
				if (v === "native-window" || v === "native" || v === "window") return "native-window";
				if (v === "new-tab" || v === "tab" || v === "browser") return "new-tab";
				return "inline";
			})()
		});
		closeModal();
	});
	if (registerForBackNavigation) unregisterBackNav = registerModal(modal, void 0, closeModal);
	modal.style.setProperty("color-scheme", theme === "light" ? "light only" : "dark only", "important");
	form?.style.setProperty("color-scheme", theme === "light" ? "light only" : "dark only", "important");
	form?.style.setProperty("pointer-events", "auto", "important");
	form?.style.setProperty("contain", "none", "important");
	form?.style.setProperty("content-visibility", "visible", "important");
	form?.querySelectorAll("input, select, textarea, button").forEach((node) => {
		const el = node;
		el.style.setProperty("pointer-events", "auto", "important");
		el.style.setProperty("position", "relative", "important");
		el.style.setProperty("z-index", "1", "important");
	});
	document.body.append(modal);
	try {
		modal.showModal();
	} catch {
		modal.setAttribute("open", "");
		modal.style.setProperty("position", "fixed", "important");
		modal.style.setProperty("inset", "0", "important");
		modal.style.setProperty("z-index", "2147483646", "important");
	}
	requestAnimationFrame(() => {
		if (fields) fields.scrollTop = 0;
		fillTextControl(labelInput, labelValue);
		fillTextControl(iconInput, iconValue);
		fillTextControl(descriptionInput, descriptionValue);
		if (actionSelect && actionValue) actionSelect.value = actionValue;
		if (viewSelect && viewValue) viewSelect.value = viewValue;
		labelInput?.focus({ preventScroll: true });
	});
};
//#endregion
//#region ../../modules/views/home-view/src/ts/view-opener.ts
var viewOpener = null;
/** Register how "open-view" shortcuts reach your shell (tabs, router, etc.). */
function setSpeedDialViewOpener(opener) {
	viewOpener = typeof opener === "function" ? opener : null;
}
function getSpeedDialViewOpener() {
	return viewOpener;
}
//#endregion
//#region ../../modules/views/home-view/src/ts/action-registry.ts
var MARKDOWN_VIEW_MANAGED_WINDOW_KEY = "viewer";
var MARKDOWN_VIEW_ALIASES = /* @__PURE__ */ new Set([
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
var normalizeMarkdownViewWindowId = (raw) => {
	let id = String(raw ?? "").trim().toLowerCase();
	id = id.replace(/^#/, "");
	const todo = /^todo:\s*(.*)$/i.exec(id);
	if (todo) id = String(todo[1] ?? "").trim().toLowerCase();
	id = id.replace(/\s+/g, "");
	if (!id) return "";
	if (id === MARKDOWN_VIEW_MANAGED_WINDOW_KEY || MARKDOWN_VIEW_ALIASES.has(id)) return MARKDOWN_VIEW_MANAGED_WINDOW_KEY;
	return id;
};
/**
* Resolve speed-dial / shortcut `meta.view` and desktop `viewId` strings to a canonical `ViewId`.
* WHY: Persisted rows may store the human label ("Markdown", "Plan") or legacy ids; {@link normalizeMarkdownViewWindowId}
* only covers the markdown family.
*/
function resolveOpenViewTarget(raw) {
	const t = String(raw ?? "").trim();
	if (!t) return "";
	const tLower = t.toLowerCase().replace(/^#/, "");
	const byShortcut = NAVIGATION_SHORTCUTS.find((s) => String(s.view).toLowerCase() === tLower || String(s.label).trim().toLowerCase() === tLower);
	if (byShortcut) return String(byShortcut.view);
	return normalizeMarkdownViewWindowId(t) || t.replace(/^#/, "").trim();
}
var actionRegistry = /* @__PURE__ */ new Map();
var labelsPerAction = /* @__PURE__ */ new Map();
var iconsPerAction = /* @__PURE__ */ new Map();
var builtinsInstalled = false;
/**
* Turn bare view tokens (`settings`, `#workcenter`, `/viewer`) into absolute
* mono-app URLs (`https://host/settings?shell=environment&native=1&view=settings`).
* External http(s)/mailto links pass through unchanged.
*/
var normalizeSpeedDialOpenHref = (raw) => {
	const input = String(raw || "").trim();
	if (!input) return "";
	if (/^(mailto:|blob:|data:)/i.test(input)) return input;
	const asView = (candidate) => {
		const view = resolveOpenViewTarget(candidate);
		return view ? buildSpeedDialViewPathHref(view, true, { native: true }) : "";
	};
	if (/^https?:\/\//i.test(input)) try {
		const u = new URL(input);
		if (typeof location !== "undefined" && u.origin === location.origin) {
			const mono = asView(u.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "");
			if (mono) return mono;
		}
		return u.href;
	} catch {
		return input;
	}
	if (input.startsWith("/")) {
		const seg = input.replace(/^\//, "").split(/[/?#]/)[0];
		const mono = asView(seg);
		if (mono) return mono;
		try {
			return new URL(input, location.href).href;
		} catch {
			return input;
		}
	}
	const token = input.replace(/^#/, "").split(/[/?#]/)[0].trim();
	const mono = asView(token);
	if (mono && !/[.:]/.test(token)) return mono;
	try {
		return new URL(input, location.href).href;
	} catch {
		return input;
	}
};
var copyTextToClipboard = async (text) => {
	const t = String(text || "").trim();
	if (!t.length) throw new Error("empty");
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(t);
		return;
	}
	const ta = document.createElement("textarea");
	ta.value = t;
	ta.style.position = "fixed";
	ta.style.left = "-9999px";
	document.body.appendChild(ta);
	ta.select();
	document.execCommand("copy");
	ta.remove();
};
var ensureHashNavigation = (view, viewMaker, props) => {
	if (!view || typeof window === "undefined") return;
	if (typeof viewMaker === "function") {
		viewMaker(view, props);
		return;
	}
	const opener = getSpeedDialViewOpener();
	if (opener) {
		opener(view, props);
		return;
	}
	const hash = `#${String(view).replace(/^#/, "")}`;
	if (location.hash !== hash) navigate(hash);
};
var installBuiltins = () => {
	if (builtinsInstalled) return;
	builtinsInstalled = true;
	iconsPerAction.set("open-view", "compass");
	iconsPerAction.set("open-link", "arrow-square-out");
	iconsPerAction.set("copy-link", "copy");
	iconsPerAction.set("copy-state-desc", "brackets-curly");
	labelsPerAction.set("open-view", (d) => `Open ${d?.label || "view"}`);
	labelsPerAction.set("open-link", (d) => d?.label ? `Open ${d.label}` : "Open link");
	labelsPerAction.set("copy-link", () => "Copy link");
	labelsPerAction.set("copy-state-desc", () => "Copy shortcut JSON");
	actionRegistry.set("open-view", async (context, entityDesc) => {
		const item = context?.items?.find?.((i) => i?.id === context?.id) || null;
		const metaMap = context?.meta;
		const meta = item && metaMap?.get ? metaMap.get(item.id) : null;
		const rawTarget = meta?.view || entityDesc?.view || entityDesc?.type || "";
		const targetView = resolveOpenViewTarget(String(rawTarget || ""));
		if (!targetView) {
			showError("No view target");
			return;
		}
		const viewMaker = context?.viewMaker ?? getSpeedDialViewOpener();
		const linkTarget = context?.openLinkTarget != null ? normalizeOpenLinkTarget(context.openLinkTarget) : meta?.openLinkTarget != null && String(meta.openLinkTarget).trim() ? normalizeOpenLinkTarget(meta.openLinkTarget) : "inline";
		if (linkTarget === "native-window") {
			const href = buildSpeedDialViewPathHref(targetView, true, { native: true });
			if (!href) {
				showError("Link is missing");
				return;
			}
			if (!openInDetachedBrowserWindow(href)) showError("Unable to open native window");
			return;
		}
		if (linkTarget === "new-tab") {
			const href = buildSpeedDialViewPathHref(targetView, true, { native: false });
			if (!href) {
				showError("Link is missing");
				return;
			}
			if (!openInNewBrowserTab(href)) showError("Unable to open new tab");
			return;
		}
		ensureHashNavigation(targetView, viewMaker, {});
	});
	actionRegistry.set("open-link", async (context) => {
		const item = context?.items?.find?.((i) => i?.id === context?.id) || null;
		const metaMap = context?.meta;
		const meta = item && metaMap?.get ? metaMap.get(item.id) : null;
		const raw = meta?.href || item?.href || context?.href || resolveSpeedDialItemHref(item);
		const viewFromMeta = resolveOpenViewTarget(String(meta?.view || ""));
		const externalHref = isExternalWebHref(raw) ? normalizeExternalWebHref(raw) || normalizeSpeedDialOpenHref(String(raw || "")) : "";
		const view = externalHref ? "" : resolveOpenViewTarget(parseSpeedDialViewFromHref(String(raw || ""))) || viewFromMeta;
		const linkTarget = context?.openLinkTarget != null ? normalizeOpenLinkTarget(context.openLinkTarget) : resolveItemOpenLinkTarget(meta);
		const opener = context?.viewMaker ?? getSpeedDialViewOpener();
		if (linkTarget === "inline") {
			if (view && typeof opener === "function") try {
				opener(view, {});
				return;
			} catch (e) {
				console.warn("[speed-dial] inline openView failed; falling back to URL", e);
			}
			if (externalHref && typeof opener === "function") try {
				opener("viewer", { params: {
					url: externalHref,
					href: externalHref
				} });
				return;
			} catch (e) {
				console.warn("[speed-dial] inline viewer open failed", e);
			}
			showError(externalHref ? "Unable to open link inline" : "Link is missing");
			return;
		}
		if (linkTarget === "new-tab") {
			const href = externalHref ? externalHref : view ? buildSpeedDialViewPathHref(view, true, { native: false }) : normalizeSpeedDialOpenHref(String(raw || ""));
			if (!href) {
				showError("Link is missing");
				return;
			}
			if (!openInNewBrowserTab(href)) showError("Unable to open new tab");
			return;
		}
		const href = externalHref ? externalHref : view ? buildSpeedDialViewPathHref(view, true, { native: true }) : normalizeSpeedDialOpenHref(String(raw || ""));
		if (!href) {
			showError("Link is missing");
			return;
		}
		if (!openInDetachedBrowserWindow(href)) showError("Unable to open native window (popup blocked?)");
	});
	actionRegistry.set("copy-link", async (context) => {
		const item = context?.items?.find?.((i) => i?.id === context?.id) || null;
		const metaMap = context?.meta;
		const raw = (item && metaMap?.get ? metaMap.get(item.id) : null)?.href || item?.href || context?.href || resolveSpeedDialItemHref(item);
		const href = normalizeSpeedDialOpenHref(String(raw || ""));
		if (!href) {
			showError("Nothing to copy");
			return;
		}
		try {
			await copyTextToClipboard(String(href));
			showSuccess("Link copied");
		} catch (e) {
			console.warn(e);
			showError("Failed to copy link");
		}
	});
	actionRegistry.set("copy-state-desc", async (context) => {
		const item = context?.items?.find?.((i) => i?.id === context?.id) || null;
		if (!item) {
			showError("Nothing to copy");
			return;
		}
		const snapshot = snapshotSpeedDialItem(item);
		if (!snapshot) {
			showError("Nothing to copy");
			return;
		}
		try {
			await copyTextToClipboard(JSON.stringify(snapshot, null, 2));
			showSuccess("Shortcut saved to clipboard");
		} catch (e) {
			console.warn(e);
			showError("Failed to copy shortcut");
		}
	});
	for (const shortcut of NAVIGATION_SHORTCUTS) {
		const actionId = `open-view-${shortcut.view}`;
		if (!iconsPerAction.has(actionId)) iconsPerAction.set(actionId, shortcut.icon);
		if (!labelsPerAction.has(actionId)) labelsPerAction.set(actionId, () => `Open ${shortcut.label}`);
		if (!actionRegistry.has(actionId)) actionRegistry.set(actionId, async (context) => {
			return actionRegistry.get("open-view")?.(context, {
				label: shortcut.label,
				type: shortcut.view,
				view: shortcut.view,
				DIR: "/"
			});
		});
	}
	for (const { alias, label } of [{
		alias: "markdown",
		label: "Markdown"
	}, {
		alias: "reader",
		label: "Markdown"
	}]) {
		const actionId = `open-view-${alias}`;
		if (actionRegistry.has(actionId)) continue;
		iconsPerAction.set(actionId, "article");
		labelsPerAction.set(actionId, () => `Open ${label}`);
		actionRegistry.set(actionId, async (context) => {
			return actionRegistry.get("open-view")?.(context, {
				label,
				type: MARKDOWN_VIEW_MANAGED_WINDOW_KEY,
				view: MARKDOWN_VIEW_MANAGED_WINDOW_KEY,
				DIR: "/"
			});
		});
	}
};
function getSpeedDialActionRegistry() {
	installBuiltins();
	return actionRegistry;
}
function getSpeedDialActionLabels() {
	installBuiltins();
	return labelsPerAction;
}
function getSpeedDialActionIcons() {
	installBuiltins();
	return iconsPerAction;
}
//#endregion
//#region ../../modules/views/home-view/src/ts/SpeedDial.ts
var ctxMenuBound = false;
var persistItemsTimer = null;
/** Lazy-init: top-level `observe` + `pointerAnchorRef` ran during chunk eval and hit TDZ vs `com-app` (see vite-chunk-placement). */
var layoutSingleton = null;
function getLayout() {
	if (!layoutSingleton) {
		layoutSingleton = observe([gridLayoutState.columns ?? 4, gridLayoutState.rows ?? 8]);
		affected(gridLayoutState, () => {
			layoutSingleton[0] = gridLayoutState.columns ?? 4;
			layoutSingleton[1] = gridLayoutState.rows ?? 8;
		});
	}
	return layoutSingleton;
}
var getScreenOrient = () => {
	const type = String(globalThis.screen?.orientation?.type || "");
	if (type.includes("landscape")) return type.endsWith("secondary") ? 3 : 1;
	return type.endsWith("secondary") ? 2 : 0;
};
var getRootOrient = (root) => {
	return normalizeOrient(root?.getAttribute("orient") ?? getScreenOrient());
};
var getGridLayout = () => [Number(gridLayoutState.columns) || 4, Number(gridLayoutState.rows) || 8];
var getItemCell = (item) => [Number(item.cell?.[0]) || 0, Number(item.cell?.[1]) || 0];
var applyVisualCell = (el, item, root) => {
	const orient = getRootOrient(root);
	const layout = getGridLayout();
	const visualCell = logicalToVisualCell(getItemCell(item), layout, orient);
	el.dataset.cellX = String(item.cell?.[0] ?? 0);
	el.dataset.cellY = String(item.cell?.[1] ?? 0);
	el.style.setProperty("--cell-column", String(visualCell[0] + 1));
	el.style.setProperty("--cell-row", String(visualCell[1] + 1));
	if (el.dataset.layer === "labels") {
		const [, visualRows] = visualLayout(layout, orient);
		let placement = "below";
		const rootRect = root?.getBoundingClientRect();
		const itemRect = el.getBoundingClientRect();
		const labelHeight = (el.querySelector(".ui-ws-item-label")?.getBoundingClientRect())?.height || 28;
		const nearLastRow = visualCell[1] >= visualRows - 1;
		if (rootRect && itemRect.height > 0) {
			const viewportBottom = Number(globalThis.innerHeight) || rootRect.bottom;
			const visibleTop = Math.max(rootRect.top, 0);
			const visibleBottom = Math.min(rootRect.bottom, viewportBottom);
			const itemId = String(item.id || "");
			let iconSibling = null;
			root?.querySelectorAll("[data-speed-dial-item][data-layer=\"icons\"]").forEach((node) => {
				if (!iconSibling && node.dataset.id === itemId) iconSibling = node;
			});
			const anchorRect = iconSibling?.getBoundingClientRect() || itemRect;
			const fitsBelow = anchorRect.bottom + labelHeight <= visibleBottom + 1;
			const fitsAbove = anchorRect.top - labelHeight >= visibleTop - 1;
			placement = !fitsBelow && fitsAbove ? "above" : "below";
		} else if (nearLastRow) placement = "below";
		el.dataset.labelPlacement = placement;
	}
};
var scheduleLabelPlacementSync = (root) => {
	if (root.dataset.labelPlacementFrame === "pending") return;
	root.dataset.labelPlacementFrame = "pending";
	const sync = () => {
		delete root.dataset.labelPlacementFrame;
		root.querySelectorAll("[data-speed-dial-item][data-layer=\"labels\"]").forEach((node) => {
			const item = findSpeedDialItem(node.dataset.id);
			if (item) applyVisualCell(node, item, root);
		});
	};
	if (typeof globalThis.requestAnimationFrame === "function") globalThis.requestAnimationFrame(sync);
	else globalThis.setTimeout(sync, 0);
};
var syncGridLayout = (root) => {
	const logicalLayout = getGridLayout();
	const orient = getRootOrient(root);
	const [columns, rows] = visualLayout(logicalLayout, orient);
	root.dataset.orient = String(orient);
	root.style.setProperty("--orient", String(orient));
	root.querySelectorAll(".speed-dial-grid").forEach((grid) => {
		grid.style.setProperty("--grid-columns", String(columns));
		grid.style.setProperty("--grid-rows", String(rows));
		grid.dataset.gridColumns = String(columns);
		grid.dataset.gridRows = String(rows);
	});
	root.querySelectorAll("[data-speed-dial-item]").forEach((node) => {
		const item = findSpeedDialItem(node.dataset.id);
		if (item) applyVisualCell(node, item, root);
	});
	scheduleLabelPlacementSync(root);
};
var bindRootOrientation = (root) => {
	if (root.dataset.orientObserverBound === "true") {
		syncGridLayout(root);
		return;
	}
	root.dataset.orientObserverBound = "true";
	new MutationObserver((records) => {
		if (records.some((record) => record.attributeName === "orient")) syncGridLayout(root);
	}).observe(root, {
		attributes: true,
		attributeFilter: ["orient"]
	});
	const screenOrientation = globalThis.screen?.orientation;
	const onScreenOrientationChange = () => {
		if (!root.hasAttribute("orient")) syncGridLayout(root);
	};
	screenOrientation?.addEventListener?.("change", onScreenOrientationChange);
	affected(gridLayoutState, () => syncGridLayout(root));
	syncGridLayout(root);
	queueMicrotask(() => syncGridLayout(root));
};
var refreshRootCells = (root) => {
	root.querySelectorAll("[data-speed-dial-item]").forEach((node) => {
		const item = findSpeedDialItem(node.dataset.id);
		if (item) applyVisualCell(node, item, root);
	});
	scheduleLabelPlacementSync(root);
};
var coordinateRefSingleton = null;
function getCoordinateRef() {
	if (!coordinateRefSingleton) coordinateRefSingleton = typeof document !== "undefined" ? pointerAnchorRef() : [numberRef(0), numberRef(0)];
	return coordinateRefSingleton;
}
var schedulePersistItems = () => {
	if (persistItemsTimer) clearTimeout(persistItemsTimer);
	persistItemsTimer = setTimeout(() => {
		persistItemsTimer = null;
		persistSpeedDialItems();
	}, 80);
};
var resolveItemAction = (item, override) => {
	if (override) return override;
	return getSpeedDialMeta(item.id)?.action || item?.action || "open-view";
};
var ACTION_OPTIONS = [
	{
		value: "open-view",
		label: "Open view"
	},
	{
		value: "open-link",
		label: "Open link"
	},
	{
		value: "copy-link",
		label: "Copy link"
	},
	{
		value: "copy-state-desc",
		label: "Copy state + desc"
	}
];
var WALLPAPER_EXTENSIONS = /* @__PURE__ */ new Set([
	"png",
	"jpg",
	"jpeg",
	"webp",
	"gif",
	"bmp",
	"svg",
	"avif"
]);
var getRefValue = (ref, fallback = "") => {
	if (ref && typeof ref === "object" && "value" in ref) return ref.value ?? fallback;
	return ref ?? fallback;
};
var buildDescriptor = (item) => {
	const meta = getSpeedDialMeta(item.id);
	return {
		label: getRefValue(item?.label),
		type: meta?.view || "speed-dial",
		DIR: "/",
		href: meta?.href,
		view: meta?.view,
		action: resolveItemAction(item)
	};
};
var bindCell = (el, args) => {
	const item = args?.item;
	if (!item) return;
	const root = el.closest(".speed-dial-root");
	const sync = () => applyVisualCell(el, item, root);
	sync();
	affected([item.cell, 0], sync);
	affected([item.cell, 1], sync);
};
var runItemAction = (item, actionId, extras = {}, makeView) => {
	const resolvedAction = resolveItemAction(item, actionId);
	const action = getSpeedDialActionRegistry().get(resolvedAction);
	if (!action) {
		showError("Action is unavailable");
		return;
	}
	const context = {
		id: item.id,
		items: speedDialItems,
		meta: speedDialMeta,
		action: resolvedAction,
		viewMaker: makeView
	};
	try {
		action(context, item, extras?.initiator);
	} catch (error) {
		console.warn(error);
		showError("Failed to run action");
	}
};
var attachItemNode = (item, el, interactive = true, makeView) => {
	if (!el) return;
	const args = {
		layout: getLayout(),
		items: speedDialItems,
		item,
		meta: speedDialMeta
	};
	const root = el.closest(".speed-dial-root") || el.ownerDocument?.getElementById("home");
	el.dataset.id = item.id;
	el.dataset.speedDialItem = "true";
	if (interactive) {
		el.addEventListener("dragstart", (ev) => ev.preventDefault());
		if (!el.dataset.dragGuardBound) {
			el.dataset.dragGuardBound = "1";
			el.addEventListener("m-dragsettled", () => {
				schedulePersistItems();
			});
		}
		el.addEventListener("click", (ev) => {
			ev?.preventDefault?.();
			const interactionState = String(el?.dataset?.interactionState || "");
			if (!(interactionState === "onGrab" || interactionState === "onMoving" || interactionState === "onRelax") && !MOCElement(ev?.target, "[data-interaction-state=\"onMoving\"],[data-interaction-state=\"onGrab\"],[data-interaction-state=\"onRelax\"]")) runItemAction(item, void 0, {
				event: ev,
				initiator: el
			}, makeView);
		});
		el.addEventListener("dblclick", (ev) => {
			ev?.preventDefault?.();
			openItemEditor(item);
		});
	}
	if (el.dataset.layer === "labels") {
		el.style.pointerEvents = "none";
		bindCell(el, args);
	}
	if (el.dataset.layer === "icons") {
		const dragItem = {
			id: item.id,
			cell: getItemCell(item)
		};
		const bindDrag = (mountedRoot) => {
			if (!mountedRoot || el.dataset.pointerInteractionBound === "true") return;
			el.dataset.pointerInteractionBound = "true";
			bindPointerInteraction(el, {
				root: mountedRoot,
				item: dragItem,
				items: speedDialItems,
				getLayout: getGridLayout,
				getOrient: () => getRootOrient(mountedRoot),
				onCommitCell: (cell) => {
					dragItem.cell = [...cell];
					item.cell[0] = cell[0];
					item.cell[1] = cell[1];
					refreshRootCells(mountedRoot);
				}
			});
		};
		bindDrag(root);
		if (!root) queueMicrotask(() => bindDrag(el.closest(".speed-dial-root") || el.ownerDocument?.getElementById("home")));
		applyVisualCell(el, item, root);
	}
};
var resolveCellFromGrid = (grid, coordinate) => {
	if (!grid || !coordinate) return [0, 0];
	const rect = grid.getBoundingClientRect();
	const styles = getComputedStyle(grid);
	const paddingLeft = parseFloat(styles.paddingLeft) || 0;
	const paddingRight = parseFloat(styles.paddingRight) || 0;
	const paddingTop = parseFloat(styles.paddingTop) || 0;
	const paddingBottom = parseFloat(styles.paddingBottom) || 0;
	const size = [Math.max(1, rect.width - paddingLeft - paddingRight), Math.max(1, rect.height - paddingTop - paddingBottom)];
	return pointToLogicalCell([coordinate[0] - rect.left - paddingLeft, coordinate[1] - rect.top - paddingTop], size, getGridLayout(), getRootOrient(grid.closest(".speed-dial-root")));
};
var deriveCellFromEvent = (ev) => {
	return resolveCellFromGrid(document.querySelector("#home .speed-dial-grid[data-grid-layer=\"icons\"]") || document.querySelector("#home .speed-dial-grid:last-of-type") || document.querySelector("#home .speed-dial-grid"), ev ? [ev.clientX, ev.clientY] : null);
};
var deriveCellFromCoordinate = (coordinate) => {
	return resolveCellFromGrid(document.querySelector("#home .speed-dial-grid[data-grid-layer=\"icons\"]") || document.querySelector("#home .speed-dial-grid:last-of-type") || document.querySelector("#home .speed-dial-grid"), coordinate);
};
var deriveCellFromAnchor = () => {
	const ref = getCoordinateRef();
	return deriveCellFromCoordinate([ref[0].value, ref[1].value]);
};
var looksLikeImageFile = (file) => {
	if (!file) return false;
	if (String(file.type || "").toLowerCase().startsWith("image/")) return true;
	const name = String(file.name || "").trim().toLowerCase();
	const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : "";
	return WALLPAPER_EXTENSIONS.has(ext);
};
var parseUrlFromHtml = (html) => {
	const source = String(html || "").trim();
	if (!source) return null;
	const hrefMatch = source.match(/href\s*=\s*["']([^"']+)["']/i);
	const href = String(hrefMatch?.[1] || "").trim();
	if (!href) return null;
	if (!/^https?:\/\//i.test(href) && !href.startsWith("//")) return null;
	return href;
};
/** Bare host or host/path without scheme (github.com, www.youtube.com/watch?v=1). */
var BARE_HOST_PATTERN = /^(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:[/:?#][^\s]*)?$/i;
/**
* Normalize a pasted/dropped URL candidate to an absolute http(s) URL.
* WHY: users paste bare domains from messengers ("github.com") without scheme;
* relative hrefs would resolve against the shell origin and produce junk tiles.
* Returns the canonical href string, or null when not a usable http(s) URL.
*/
var normalizePasteUrl = (text) => {
	const value = String(text || "").trim();
	if (!value) return null;
	try {
		const parsed = new URL(value);
		if (/^https?:$/i.test(parsed.protocol)) return parsed.href;
		return null;
	} catch {}
	if (!/\s/.test(value) && BARE_HOST_PATTERN.test(value)) try {
		const parsed = new URL(`https://${value.replace(/^\/+/, "")}`);
		if (/^https?:$/i.test(parsed.protocol)) return parsed.href;
	} catch {}
	return null;
};
var parseShortcutFromTransfer = (transfer, suggestedCell) => {
	if (!transfer) return null;
	const plain = String(transfer.getData("text/plain") || "").trim();
	const uriList = String(transfer.getData("text/uri-list") || "").trim();
	const html = String(transfer.getData("text/html") || "").trim();
	for (const candidate of [uriList, plain].filter(Boolean)) {
		const normalized = normalizePasteUrl(candidate);
		if (!normalized) continue;
		const item = parseSpeedDialItemFromURL(normalized, suggestedCell);
		if (item) return item;
	}
	const href = parseUrlFromHtml(html);
	if (href) {
		const normalized = normalizePasteUrl(href);
		if (normalized) {
			const item = parseSpeedDialItemFromURL(normalized, suggestedCell);
			if (item) return item;
		}
	}
	if (plain) {
		const item = parseSpeedDialItemFromJSON(plain, suggestedCell);
		if (item) return item;
	}
	return null;
};
var createMenuEntryForAction = (actionId, item, fallbackLabel = "", makeView) => {
	const descriptor = buildDescriptor(item);
	return {
		id: actionId,
		label: getSpeedDialActionLabels().get(actionId)?.(descriptor) || fallbackLabel,
		icon: getSpeedDialActionIcons().get(actionId) || "command",
		action: (initiator, _menuItem, ev) => runItemAction(item, actionId, {
			event: ev,
			initiator
		}, makeView)
	};
};
var pickWallpaper = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.onchange = async () => {
		const file = input.files?.[0];
		if (!file) return;
		try {
			await setAppWallpaperFromBlob(file);
			wallpaperState.src = getWallpaperStoragePointer() || "idb:rs-wallpaper";
			persistWallpaper();
			showSuccess("Wallpaper updated");
		} catch (e) {
			console.warn(e);
			showError("Failed to set wallpaper");
		}
	};
	input.click();
};
var handleSpeedDialPaste = async (event, suggestedCell) => {
	if (!isInFocus(event?.target, "#home") && !isInFocus(event?.target, "#home:is(:hover, :focus, :focus-visible), #home:has(:hover, :focus, :focus-visible)", "child")) return false;
	event.preventDefault();
	event.stopPropagation();
	try {
		const targetCell = suggestedCell ?? deriveCellFromAnchor();
		const item = parseShortcutFromTransfer(event.clipboardData, targetCell) || await createSpeedDialItemFromClipboard(targetCell);
		if (!item) return false;
		addSpeedDialItem(item);
		persistSpeedDialItems();
		persistSpeedDialMeta();
		showSuccess("Shortcut created from clipboard");
		return true;
	} catch (e) {
		console.warn("Failed to paste speed dial item:", e);
		return false;
	}
};
var handleWallpaperDropOrPaste = (event) => {
	if (isInFocus(event?.target, "#home") || isInFocus(event?.target, "#home:is(:hover, :focus, :focus-visible), #home:has(:hover, :focus, :focus-visible)", "child")) {
		const isPaste = event instanceof ClipboardEvent;
		const droppedOnItem = !!event.target?.closest?.("[data-speed-dial-item]");
		const suggestedCell = deriveCellFromAnchor();
		const dataTransfer = isPaste ? event.clipboardData : event.dataTransfer;
		if (isPaste) {
			const fromTransfer = parseShortcutFromTransfer(dataTransfer, suggestedCell);
			if (fromTransfer) {
				event.preventDefault();
				event.stopPropagation();
				addSpeedDialItem(fromTransfer);
				persistSpeedDialItems();
				persistSpeedDialMeta();
				showSuccess("Shortcut created from pasted link");
				return;
			}
			handleSpeedDialPaste(event, suggestedCell);
		}
		if (!isPaste) {
			const parsed = parseShortcutFromTransfer(dataTransfer, suggestedCell);
			if (parsed) {
				event.preventDefault();
				event.stopPropagation();
				addSpeedDialItem(parsed);
				persistSpeedDialItems();
				persistSpeedDialMeta();
				showSuccess("Shortcut created from dropped link");
				return;
			}
		}
		event.preventDefault();
		event.stopPropagation();
		const dt = dataTransfer || event.clipboardData || event.dataTransfer;
		if (!!!Array.from(dt?.files || []).find((file) => looksLikeImageFile(file)) || droppedOnItem) return;
		queueMicrotask(() => {
			handleIncomingEntries(dt, "/images/wallpaper/", null, (file, path) => {
				if (!looksLikeImageFile(file)) return;
				setAppWallpaperFromBlob(file).then(() => {
					wallpaperState.src = getWallpaperStoragePointer() || path || "idb:rs-wallpaper";
					persistWallpaper();
					showSuccess("Wallpaper updated");
				}).catch((err) => {
					console.warn(err);
					showError("Failed to set wallpaper");
				});
			});
		});
	}
};
function SpeedDial(makeView) {
	getLayout();
	getCoordinateRef();
	if (typeof makeView === "function") setSpeedDialViewOpener(makeView);
	const columnsRef = propRef(gridLayoutState, "columns", 4);
	const rowsRef = propRef(gridLayoutState, "rows", 8);
	const shapeRef = propRef(gridLayoutState, "shape", "square");
	const tileShapeForItem = (item) => {
		const raw = String(getSpeedDialMeta(item.id)?.shape || "squircle").toLowerCase();
		return raw === "circle" || raw === "square" || raw === "squircle" ? raw : "squircle";
	};
	const renderIconItem = (item) => {
		return H`<div data-shape=${tileShapeForItem(item)} class="ui-ws-item ui-ws-item-icon shaped" data-speed-dial-item data-layer="icons" ref=${(el) => attachItemNode(item, el, true, makeView)}>
            <ui-icon icon=${item.icon}></ui-icon>
        </div>`;
	};
	const renderLabelItem = (item) => {
		return H`<div style="background-color: transparent;" class="ui-ws-item ui-ws-item-label" data-speed-dial-item data-layer="labels" ref=${(el) => attachItemNode(item, el, false, makeView)}>
            <span style="background-color: transparent;">${getRefValue(item.label)}</span>
        </div>`;
	};
	return H`<div slot="underlay" style="pointer-events: auto; position: relative; contain: strict; overflow: hidden; display: grid;" id="home" class="speed-dial-root" ref=${(el) => bindRootOrientation(el)} on:dragover=${(ev) => ev.preventDefault()} on:drop=${(ev) => handleWallpaperDropOrPaste(ev)} prop:onPaste=${async (ev) => await handleWallpaperDropOrPaste(ev)}>
        <div style="background-color: transparent; pointer-events: none;" class="speed-dial-grid speed-dial-label-layer speed-dial-grid--labels ui-launcher-grid" data-layer="items" data-grid-layer="labels" data-grid-columns=${columnsRef} data-grid-rows=${rowsRef} data-grid-shape=${shapeRef}>
            ${M(speedDialItems, renderLabelItem)}
        </div>
        <div style="background-color: transparent; pointer-events: none;" class="speed-dial-grid speed-dial-icon-layer speed-dial-grid--icons ui-launcher-grid" data-layer="items" data-grid-layer="icons" data-grid-columns=${columnsRef} data-grid-rows=${rowsRef} data-grid-shape=${shapeRef}>
            ${M(speedDialItems, renderIconItem)}
        </div>
    </div>`;
}
var openItemEditor = (item, opts) => {
	const workingItem = item ?? createEmptySpeedDialItem(opts?.suggestedCell ?? deriveCellFromAnchor());
	const isNew = !item;
	const workingMeta = ensureSpeedDialMeta(workingItem.id);
	const seed = opts?.seed || {};
	if (isNew && seed?.action) {
		workingItem.action = seed.action;
		workingMeta.action = seed.action;
	}
	if (isNew && seed?.label) workingItem.label.value = seed.label;
	if (isNew && seed?.icon) workingItem.icon.value = seed.icon;
	if (isNew && seed?.view) workingMeta.view = seed.view;
	if (isNew && seed?.href) workingMeta.href = seed.href;
	if (isNew && seed?.description) workingMeta.description = seed.description;
	const draft = {
		label: String(getRefValue(workingItem.label, "New shortcut") ?? "New shortcut"),
		icon: String(getRefValue(workingItem.icon, "sparkle") ?? "sparkle"),
		action: String(resolveItemAction(workingItem) || "open-view"),
		href: String(workingMeta?.href || ""),
		view: String(workingMeta?.view || ""),
		description: String(workingMeta?.description || ""),
		shape: String(workingMeta?.shape || "squircle"),
		openLinkTarget: resolveItemOpenLinkTarget(workingMeta)
	};
	openShortcutEditor({
		mode: isNew ? "create" : "edit",
		initial: {
			label: draft.label,
			icon: draft.icon,
			action: draft.action,
			href: draft.href,
			view: draft.view,
			description: draft.description,
			shape: draft.shape,
			openLinkTarget: draft.openLinkTarget || getDefaultOpenLinkTarget()
		},
		actionOptions: ACTION_OPTIONS,
		viewOptions: [...NAVIGATION_SHORTCUTS].map((shortcut) => ({
			value: String(shortcut.view || ""),
			label: String(shortcut.label || shortcut.view || "")
		})),
		registerForBackNavigation: true,
		isViewAction: (value) => value === "open-view",
		isHrefAction: (value) => value === "open-link" || value === "copy-link" || value === "open-view",
		onSave: (next) => {
			workingItem.label.value = next.label;
			workingItem.icon.value = next.icon || "sparkle";
			workingItem.action = next.action || "open-view";
			workingMeta.action = workingItem.action;
			workingMeta.view = next.view;
			workingMeta.href = next.href;
			workingMeta.description = next.description;
			workingMeta.shape = next.shape;
			{
				const v = String(next.openLinkTarget || "").toLowerCase();
				workingMeta.openLinkTarget = v === "native-window" || v === "native" || v === "window" ? "native-window" : v === "new-tab" || v === "tab" || v === "browser" || v === "browser-tab" ? "new-tab" : "inline";
			}
			if (isNew) addSpeedDialItem(workingItem);
			else upsertSpeedDialItem(workingItem);
			persistSpeedDialItems();
			persistSpeedDialMeta();
			showSuccess(isNew ? "Shortcut created" : "Shortcut updated");
		},
		onDelete: isNew ? void 0 : () => {
			removeSpeedDialItem(workingItem.id);
			persistSpeedDialItems();
			persistSpeedDialMeta();
			showSuccess("Shortcut removed");
		}
	});
};
function createCtxMenu(makeView) {
	getLayout();
	getCoordinateRef();
	if (typeof makeView === "function") setSpeedDialViewOpener(makeView);
	if (!ctxMenuBound) {
		ctxMenuBound = true;
		document.addEventListener("contextmenu", (event) => {
			const target = event.target;
			if (!(target?.closest?.("#home, .speed-dial-root, .env-home-workspace, [data-view='home']") || null)) return;
			event.preventDefault();
			const targetEl = target?.closest?.("[data-speed-dial-item]");
			const itemId = targetEl?.getAttribute?.("data-id");
			const item = findSpeedDialItem(itemId);
			const guessedCell = deriveCellFromEvent(event) ?? deriveCellFromAnchor();
			const toLeaf = (entry) => ({
				id: String(entry?.id || "menu-action"),
				label: String(entry?.label || "Action"),
				icon: String(entry?.icon || "command"),
				action: () => entry?.action?.(targetEl, entry, event)
			});
			const openViewTask = (view, params = {}) => {
				const opener = getSpeedDialViewOpener() || makeView;
				if (opener) {
					opener(view, {
						...params,
						newTask: "1"
					});
					return;
				}
				getSpeedDialActionRegistry().get(`open-view-${view}`)?.({
					id: "",
					items: speedDialItems,
					meta: speedDialMeta
				}, {});
			};
			const menuItems = item ? [
				{
					id: "open",
					label: "Open",
					icon: "play",
					action: () => runItemAction(item, void 0, {
						event,
						initiator: targetEl
					}, getSpeedDialViewOpener() || makeView)
				},
				{
					id: "actions",
					label: "Actions",
					icon: "dots-three",
					action: () => {},
					children: [
						toLeaf(createMenuEntryForAction(resolveItemAction(item) || "open-view", item, "Run action", getSpeedDialViewOpener() || makeView)),
						...getSpeedDialMeta(item.id)?.href ? [toLeaf(createMenuEntryForAction("open-link", item, "Open link", getSpeedDialViewOpener() || makeView)), toLeaf(createMenuEntryForAction("copy-link", item, "Copy link", getSpeedDialViewOpener() || makeView))] : [],
						toLeaf(createMenuEntryForAction("copy-state-desc", item, "Copy shortcut JSON", getSpeedDialViewOpener() || makeView))
					]
				},
				{
					id: "open-in",
					label: "Open In New",
					icon: "app-window",
					action: () => {},
					children: [{
						id: "open-in-regular-window",
						label: "Regular window",
						icon: "app-window",
						action: () => {
							const targetView = String(getSpeedDialMeta(item.id)?.view || "viewer");
							openViewTask(targetView, { windowType: "regular" });
						}
					}, {
						id: "open-in-tabbed-window",
						label: "Tabbed window",
						icon: "rows-plus-bottom",
						action: () => {
							const targetView = String(getSpeedDialMeta(item.id)?.view || "viewer");
							openViewTask(targetView, { windowType: "tabbed" });
						}
					}]
				},
				{
					id: "manage",
					label: "Manage",
					icon: "wrench",
					action: () => {},
					children: [{
						id: "edit",
						label: "Edit Properties",
						icon: "pencil-simple-line",
						action: () => openItemEditor(item)
					}, {
						id: "remove",
						label: "Remove",
						icon: "trash",
						danger: true,
						action: () => {
							removeSpeedDialItem(item.id);
							persistSpeedDialItems();
							persistSpeedDialMeta();
							showSuccess("Shortcut removed");
						}
					}]
				}
			] : [
				{
					id: "new",
					label: "New",
					icon: "plus",
					action: () => {},
					children: [
						{
							id: "create-shortcut",
							label: "Create shortcut",
							icon: "plus",
							action: () => {
								openItemEditor(void 0, { suggestedCell: guessedCell });
							}
						},
						{
							id: "create-link-shortcut",
							label: "Create link shortcut",
							icon: "link",
							action: () => {
								openItemEditor(void 0, {
									suggestedCell: guessedCell,
									seed: {
										action: "open-link",
										icon: "link",
										label: "New link",
										href: "",
										description: ""
									}
								});
							}
						},
						{
							id: "paste-shortcut",
							label: "Paste shortcut",
							icon: "clipboard",
							action: async () => {
								try {
									const speedDialItem = await createSpeedDialItemFromClipboard(guessedCell);
									if (!speedDialItem) {
										showError("Clipboard does not contain a valid URL or shortcut JSON");
										return;
									}
									addSpeedDialItem(speedDialItem);
									persistSpeedDialItems();
									persistSpeedDialMeta();
									showSuccess("Shortcut created from clipboard");
								} catch (e) {
									console.warn(e);
									showError("Failed to paste shortcut");
								}
							}
						}
					]
				},
				{
					id: "open",
					label: "Open",
					icon: "squares-four",
					action: () => {},
					children: [
						{
							id: "open-explorer",
							label: "Explorer",
							icon: "books",
							action: () => {
								getSpeedDialActionRegistry().get("open-view-explorer")?.({
									id: "",
									items: speedDialItems,
									meta: speedDialMeta,
									viewMaker: getSpeedDialViewOpener() || makeView
								}, {});
							}
						},
						{
							id: "open-settings",
							label: "Settings",
							icon: "gear-six",
							action: () => {
								getSpeedDialActionRegistry().get("open-view-settings")?.({
									id: "",
									items: speedDialItems,
									meta: speedDialMeta,
									viewMaker: getSpeedDialViewOpener() || makeView
								}, {});
							}
						},
						{
							id: "open-window-type",
							label: "New Window",
							icon: "app-window",
							action: () => {},
							children: [{
								id: "open-viewer-regular",
								label: "Viewer (regular)",
								icon: "article",
								action: () => openViewTask("viewer", { windowType: "regular" })
							}, {
								id: "open-viewer-tabbed",
								label: "Viewer (tabbed)",
								icon: "rows-plus-bottom",
								action: () => openViewTask("viewer", { windowType: "tabbed" })
							}]
						}
					]
				},
				{
					id: "wallpaper",
					label: "Wallpaper",
					icon: "image",
					action: () => {},
					children: [{
						id: "change-wallpaper",
						label: "Change wallpaper",
						icon: "image",
						action: pickWallpaper
					}]
				}
			];
			openUnifiedContextMenu({
				x: event.clientX,
				y: event.clientY,
				items: menuItems,
				compact: true
			});
		}, { capture: true });
	}
	return H`<div data-home-ctx-menu style="display:none;"></div>`;
}
//#endregion
//#region ../../modules/views/home-view/src/ts/SpeedDial.scss?inline
var SpeedDial_default = "@layer views{.speed-dial-root,.speed-dial-root.app-oriented-desktop{--home-font-sans:system-ui,-apple-system,\"Segoe UI\",Roboto,\"Noto Sans\",\"Helvetica Neue\",Arial,\"Apple Color Emoji\",\"Segoe UI Emoji\",sans-serif;font-family:var(--home-font-sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal;font-variant-numeric:tabular-nums;text-rendering:optimizeLegibility}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.speed-dial-root{background-color:initial;block-size:100%;border-radius:0;box-sizing:border-box;display:grid;grid-column:1/-1;grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:auto;position:absolute;user-select:none;user-drag:none;-webkit-user-drag:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none}.speed-dial-root>*{grid-column:1/-1;grid-row:1/-1}.speed-dial-root.ui-orientbox:focus,.speed-dial-root.ui-orientbox:focus-visible{box-shadow:none!important;outline:none!important}.speed-dial-root.app-oriented-desktop.ui-orientbox{pointer-events:auto}.speed-dial-grid{border-radius:0;display:grid;grid-column:1/-1;grid-row:1/-1;grid-template-columns:repeat(var(--grid-columns,4),minmax(0,1fr));grid-template-rows:repeat(var(--grid-rows,8),minmax(0,1fr));padding:var(--speed-dial-padding,1rem)}.speed-dial-grid[data-grid-layer=icons]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none;z-index:1}.speed-dial-grid[data-grid-layer=icons]:has([data-dragging]){z-index:3}.speed-dial-grid[data-grid-layer=labels]{background:transparent!important;contain:layout style;isolation:isolate;overflow:visible;pointer-events:none!important;z-index:2}.speed-dial-grid .ui-ws-item{--drag-x:0px;--drag-y:0px;--tile-size:4rem;aspect-ratio:1/1;background-color:initial;block-size:100%;display:grid;grid-column:var(--cell-column,auto);grid-row:var(--cell-row,auto);grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;max-block-size:var(--tile-size);max-inline-size:var(--tile-size);min-block-size:0;min-inline-size:0;place-content:center;place-items:center;place-self:center;pointer-events:auto;position:relative;text-align:center;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;contain:none;filter:none;overflow:visible;transform:translate3d(var(--drag-x,0),var(--drag-y,0),0);transform-origin:50% 50%;transition:transform .24s cubic-bezier(.22,.8,.3,1),scale .18s ease-out,filter .18s ease-out;z-index:1}.speed-dial-grid .ui-ws-item:hover{scale:1.06}.speed-dial-grid .ui-ws-item:hover .ui-ws-item-icon{background:color-mix(in oklab,var(--color-surface-container-high,#1f2937) 60%,transparent);box-shadow:0 10px 36px -10px color-mix(in oklab,#000 40%,transparent)}.speed-dial-grid .ui-ws-item:active{scale:.94}.speed-dial-grid .ui-ws-item.ui-ws-item-icon{aspect-ratio:1/1;backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);background:color-mix(in oklab,var(--color-surface-container,#111827) 80%,transparent);block-size:100%;border:none;border-radius:22%;box-shadow:0 6px 24px -8px color-mix(in oklab,#000 38%,transparent);contain:layout style;cursor:pointer;display:grid;filter:none;inline-size:100%;line-height:0;max-block-size:var(--tile-size);max-inline-size:var(--tile-size);min-block-size:0;min-inline-size:0;overflow:hidden;padding:.8rem;place-content:center;place-items:center;pointer-events:auto;position:relative;text-align:center;transition:background-color .2s ease,box-shadow .2s ease}.speed-dial-grid .ui-ws-item.ui-ws-item-icon[data-shape=circle]{border-radius:50%}.speed-dial-grid .ui-ws-item.ui-ws-item-icon[data-shape=square]{border-radius:max(.55rem,14%)}.speed-dial-grid .ui-ws-item.ui-ws-item-icon[data-shape=squircle]{border-radius:22%}.speed-dial-grid .ui-ws-item.ui-ws-item-icon[data-shape=wavy]{clip-path:var(--clip-path)}.speed-dial-grid .ui-ws-item.ui-ws-item-icon.ui-ws-item-icon-image{block-size:calc(100% - .9rem);filter:drop-shadow(0 1px 3px rgba(0,0,0,.2));inline-size:calc(100% - .9rem);inset:.45rem;object-fit:contain;object-position:center;pointer-events:none;position:absolute;z-index:3}.speed-dial-grid .ui-ws-item.ui-ws-item-icon ui-icon{--icon-size:2.2rem;aspect-ratio:1/1;block-size:var(--icon-size,1.8rem);color:var(--on-surface-variant,var(--on-surface-color,currentColor));filter:drop-shadow(0 1px 2px rgba(0,0,0,.1333333333));inline-size:var(--icon-size,1.8rem);line-height:0;max-block-size:var(--icon-size,1.8rem);max-inline-size:var(--icon-size,1.8rem);min-block-size:fit-content;min-inline-size:fit-content;object-fit:contain;object-position:center;pointer-events:none;z-index:2}.speed-dial-grid .ui-ws-item.ui-ws-item-label{align-items:flex-start;background:transparent;color:var(--on-surface-color,currentColor);display:flex;filter:none;inset-block-start:100%;inset-inline:0;justify-content:center;overflow:visible;padding-block-start:.35rem;pointer-events:none;position:absolute;text-align:center;white-space:nowrap}.speed-dial-grid .ui-ws-item.ui-ws-item-label span{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;border:none;border-radius:6px;box-shadow:none;color:color-mix(in oklab,var(--on-surface-color,#e5e7eb) 90%,transparent);display:inline-flex;font-size:.72rem;font-weight:500;inline-size:max-content;letter-spacing:.01em;line-height:1.25;max-inline-size:min(100%,9rem);overflow:hidden;padding-block:.15rem;padding-inline:.4rem;place-content:center;place-items:center;pointer-events:none;text-align:center;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.4);white-space:nowrap}.speed-dial-grid .ui-ws-item:not([data-layer=labels])[data-label-placement=above] .speed-dial-grid .ui-ws-item.ui-ws-item-label{inset-block-end:100%;inset-block-start:auto;padding-block-end:.35rem;padding-block-start:0}.speed-dial-grid .ui-ws-item:active{will-change:transform}.speed-dial-grid :is(.ui-ws-item[data-interaction-state=onGrab],.ui-ws-item[data-interaction-state=onMoving]){cursor:grabbing;transform:translate3d(var(--drag-x,0),var(--drag-y,0),0);transition:none!important;will-change:transform;z-index:5}.speed-dial-grid :is(.ui-ws-item[data-interaction-state=onGrab].ui-ws-item-label,.ui-ws-item[data-interaction-state=onMoving].ui-ws-item-label){opacity:1;pointer-events:none}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace],.speed-dial-grid .ui-ws-item[data-interaction-state=onRelax]{transform:translate3d(var(--drag-x,0),var(--drag-y,0),0);transition:none!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-layer=labels]{background:transparent!important;filter:none;overflow:visible;pointer-events:none!important;transition:transform .24s cubic-bezier(.22,.8,.3,1);z-index:0;--sd-label-gap:0.8rem;--sd-label-max:min(calc(var(--tile-size, 3.5rem) * 2.85),min(94dvi,10.5rem));align-items:start;aspect-ratio:auto;block-size:auto;display:grid;inline-size:var(--sd-label-max);justify-items:center;max-block-size:none;max-inline-size:var(--sd-label-max);min-block-size:0;min-inline-size:var(--sd-label-max);place-self:center;translate:0 calc(var(--tile-size) * .5 + var(--sd-label-gap))}.speed-dial-grid .ui-ws-item[data-layer=labels].ui-ws-item-label{background:transparent!important;color:var(--env-launcher-fg,#f7f7f8);display:grid;inline-size:100%;inset:unset;justify-items:center;margin-inline:0;max-inline-size:100%;overflow:visible;padding-block-start:0;pointer-events:none!important;position:relative;text-align:center;transform:none}.speed-dial-grid .ui-ws-item[data-layer=labels].ui-ws-item-label span{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;border-radius:999px;box-shadow:none;color:var(--env-launcher-fg,#f7f7f8);display:block;font-family:inherit;font-size:clamp(.68rem,.09 * var(--tile-size,3.75rem),.82rem);font-weight:650;inline-size:auto;letter-spacing:.02em;line-height:1.15;margin-inline:auto;max-inline-size:100%;overflow:hidden;padding-block:.04rem .08rem;padding-inline:.22rem;pointer-events:none!important;text-align:center;text-overflow:ellipsis;text-shadow:0 1px 2px var(--env-launcher-fg-shadow,rgba(0,0,0,.88)),0 0 12px var(--env-launcher-fg-glow,rgba(0,0,0,.45));white-space:nowrap}.speed-dial-grid .ui-ws-item[data-layer=labels][data-label-placement=above]{translate:0 calc(var(--tile-size) * -.5 - var(--sd-label-gap) - 1.15em)}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onLabelDocked]{cursor:default;transform:none!important;transition:none!important}.speed-dial-grid :is(.ui-ws-item[data-layer=labels][data-interaction-state=onGrab],.ui-ws-item[data-layer=labels][data-interaction-state=onMoving]){transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=icons]{filter:none;touch-action:none;z-index:4}.speed-dial-grid :is(.ui-ws-item[data-layer=icons][data-interaction-state=onGrab],.ui-ws-item[data-layer=icons][data-interaction-state=onMoving],.ui-ws-item[data-layer=icons][data-interaction-state=onPlace],.ui-ws-item[data-layer=icons][data-interaction-state=onRelax]){z-index:5}.speed-dial-grid>.ui-ws-item-icon-under,.speed-dial-grid>.ui-ws-item-icon-under.underlying-shadow-container{background-color:initial!important;filter:blur(12px)!important;grid-column:unset!important;grid-row:unset!important;overflow:visible!important;pointer-events:none!important;z-index:0!important}.speed-dial-grid>.ui-ws-item-icon-under .underlying-shadow-geometry{background:rgba(0,0,0,.6862745098)!important;color:contrast-color(inherit(background-color));transition:filter .2s ease,box-shadow .2s ease}.speed-dial-grid>.ui-ws-item-icon-under:has(+.ui-ws-item:hover) .underlying-shadow-geometry{filter:blur(8px)!important}.speed-dial-label-layer{pointer-events:none!important}.speed-dial-label-layer .ui-ws-item{pointer-events:none;scale:1;touch-action:auto;transform:none;transition:none;z-index:0}.speed-dial-label-layer :is(.ui-ws-item:active,.ui-ws-item:hover){scale:1;transform:none}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop :is(.speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-grid.app-oriented-desktop__grid--labels){padding-block:clamp(.35rem,2.8cqh,var(--padding-lg));padding-inline:clamp(.35rem,3.2cqw,var(--padding-lg))}}@container (max-height: 29rem){.speed-dial-root.app-oriented-desktop :is(.speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-grid.app-oriented-desktop__grid--labels){padding-block:clamp(.3rem,2.2cqh,var(--padding-md))}}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .ui-ws-item{--tile-size:clamp(4rem,12dvmin,6rem)}.speed-dial-root.app-oriented-desktop .ui-ws-item .ui-ws-item-icon{padding:.65rem}}.speed-dial-editor{--sd-editor-seed:var(--base-color,var(--color-primary,#5a7fff));background:transparent;block-size:100%;border:none;color:--u2-color-mod(var(--sd-editor-seed),100);contain:none;content-visibility:visible;display:grid;inline-size:100%;inset:0;margin:0;max-block-size:100%;max-inline-size:100%;overflow:auto;padding:1rem;place-items:center;pointer-events:auto;position:fixed}.speed-dial-editor::backdrop{backdrop-filter:blur(10px) saturate(1.08);-webkit-backdrop-filter:blur(10px) saturate(1.08);background:color-mix(in oklab,--u2-color-mod(var(--base-color,var(--color-primary,#5a7fff)),920) 58%,transparent)}.speed-dial-editor__form{--sd-editor-seed:var(--base-color,var(--color-primary,#5a7fff));--sd-editor-ink:--u2-color-mod(var(--sd-editor-seed),100);--sd-editor-muted:color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),100) 70%,transparent);--sd-editor-field-bg:--u2-color-mod(var(--sd-editor-seed),900);--sd-editor-field-ink:--u2-color-mod(var(--sd-editor-seed),100);--sd-editor-panel:--u2-color-mod(var(--sd-editor-seed),860);--sd-editor-border:color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),100) 16%,transparent);--sd-editor-accent:--u2-color-mod(var(--sd-editor-seed),520);--sd-editor-danger-bg:#7f1d1d;--sd-editor-danger-ink:#fff7f7;backdrop-filter:blur(14px) saturate(1.12);-webkit-backdrop-filter:blur(14px) saturate(1.12);background:color-mix(in oklab,var(--color-surface-container,var(--sd-editor-panel)) 88%,transparent);border:1px solid var(--sd-editor-border);border-radius:18px;box-shadow:0 24px 64px -28px color-mix(in oklab,#000 60%,transparent),0 0 0 1px color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),100) 10%,transparent);color:var(--sd-editor-ink);color-scheme:dark;contain:none!important;content-visibility:visible!important;display:grid;grid-template-rows:auto minmax(0,1fr) auto;inline-size:min(100%,560px);margin-inline:auto;max-block-size:min(86vh,760px);min-block-size:0;overflow:hidden;pointer-events:auto}.speed-dial-editor[data-theme=light] .speed-dial-editor__form,.speed-dial-editor__form[data-theme=light],html[data-theme=light] .speed-dial-editor__form{color-scheme:light only;--sd-editor-ink:--u2-color-mod(var(--sd-editor-seed),900);--sd-editor-muted:color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),900) 70%,transparent);--sd-editor-field-bg:--u2-color-mod(var(--sd-editor-seed),140);--sd-editor-field-ink:--u2-color-mod(var(--sd-editor-seed),900);--sd-editor-panel:--u2-color-mod(var(--sd-editor-seed),120);--sd-editor-border:color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),900) 14%,transparent);--sd-editor-accent:--u2-color-mod(var(--sd-editor-seed),480);--sd-editor-danger-bg:#9f1239;--sd-editor-danger-ink:#fff7f7;background:color-mix(in oklab,var(--color-surface-container,var(--sd-editor-panel)) 92%,transparent);box-shadow:0 18px 48px -24px color-mix(in oklab,#0f172a 26%,transparent),0 0 0 1px var(--sd-editor-border);color:var(--sd-editor-ink)}.speed-dial-editor[data-theme=dark] .speed-dial-editor__form,.speed-dial-editor__form[data-theme=dark],html[data-theme=dark] .speed-dial-editor__form{color-scheme:dark only;--sd-editor-ink:--u2-color-mod(var(--sd-editor-seed),100);--sd-editor-muted:color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),100) 70%,transparent);--sd-editor-field-bg:--u2-color-mod(var(--sd-editor-seed),900);--sd-editor-field-ink:--u2-color-mod(var(--sd-editor-seed),100);--sd-editor-panel:--u2-color-mod(var(--sd-editor-seed),860);--sd-editor-border:color-mix(in oklab,--u2-color-mod(var(--sd-editor-seed),100) 16%,transparent);--sd-editor-accent:--u2-color-mod(var(--sd-editor-seed),520);background:color-mix(in oklab,var(--color-surface-container,var(--sd-editor-panel)) 88%,transparent);color:var(--sd-editor-ink)}.speed-dial-editor__form .modal-header{border-block-end:none;box-shadow:0 1px 0 var(--sd-editor-border);display:grid;gap:.4rem;padding:1rem 1rem .75rem}.speed-dial-editor__form .modal-title{color:var(--sd-editor-ink);font-size:1.2rem;font-weight:650;line-height:1.25;margin:0}.speed-dial-editor__form .modal-description{color:var(--sd-editor-muted);font-size:.86rem;line-height:1.35;margin:0}.speed-dial-editor__form .modal-fields{align-content:start;display:grid;gap:.75rem;min-block-size:0;overflow:auto;padding:.9rem 1rem 1rem}.speed-dial-editor__form .modal-field{display:grid;gap:.35rem;pointer-events:auto}.speed-dial-editor__form .modal-field>:is(span,label){color:var(--sd-editor-muted);font-size:.84rem;font-weight:600;margin:0;pointer-events:none;user-select:none}.speed-dial-editor__form :is(input,select,textarea,button,.btn){pointer-events:auto!important;position:relative;z-index:1}.speed-dial-editor__form :is(input,select,textarea){appearance:none;background:var(--sd-editor-field-bg);border:1px solid var(--sd-editor-border);border-radius:8px;caret-color:var(--sd-editor-field-ink);color:var(--sd-editor-field-ink);contain:none!important;content-visibility:visible!important;inline-size:100%;min-inline-size:0;outline:none;padding:.55rem .7rem}.speed-dial-editor__form :is(input,select,textarea)::placeholder{color:color-mix(in oklab,var(--sd-editor-field-ink) 45%,transparent)}.speed-dial-editor__form textarea{min-block-size:4.4rem;resize:vertical}.speed-dial-editor__form :is(input,select,textarea):focus{border-color:color-mix(in oklab,var(--sd-editor-accent) 64%,--u2-color-mod(var(--sd-editor-seed),100) 12%);box-shadow:0 0 0 2px color-mix(in oklab,var(--sd-editor-accent) 28%,transparent)}.speed-dial-editor__form .modal-actions{align-items:center;background:transparent;border-block-start:1px solid var(--sd-editor-border);border:0 transparent;color:var(--sd-editor-ink);display:flex;gap:.5rem;justify-content:space-between;outline:0 none transparent;padding:.75rem 1rem}.speed-dial-editor__form :is(.modal-actions-left,.modal-actions-right){align-items:center;display:inline-flex;gap:.5rem}.speed-dial-editor__form .btn{background:color-mix(in oklab,var(--sd-editor-field-bg) 82%,transparent);border:1px solid var(--sd-editor-border);border-radius:8px;color:var(--sd-editor-ink);cursor:pointer;font-size:.86rem;line-height:1.2;padding:.46rem .86rem}.speed-dial-editor__form .btn.secondary{background:color-mix(in oklab,var(--sd-editor-field-bg) 68%,transparent);color:var(--sd-editor-ink)}.speed-dial-editor__form .btn.save{background:color-mix(in oklab,var(--sd-editor-accent) 78%,--u2-color-mod(var(--sd-editor-seed),920) 22%);border-color:color-mix(in oklab,var(--sd-editor-accent) 55%,transparent);color:--u2-color-mod(var(--sd-editor-seed),100)}.speed-dial-editor[data-theme=light] .speed-dial-editor__form .btn.save,.speed-dial-editor__form[data-theme=light] .btn.save,html[data-theme=light] .speed-dial-editor__form .btn.save{background:color-mix(in oklab,var(--sd-editor-accent) 82%,--u2-color-mod(var(--sd-editor-seed),120) 18%);color:--u2-color-mod(var(--sd-editor-seed),980)}.speed-dial-editor__form .btn.danger{background:var(--sd-editor-danger-bg);border-color:color-mix(in oklab,var(--sd-editor-danger-bg) 70%,transparent);color:var(--sd-editor-danger-ink)}.speed-dial-editor__form .btn:hover{filter:brightness(1.08)}.speed-dial-editor__form [hidden]{display:none!important}@media (max-width:820px){.speed-dial-editor{place-items:center}.speed-dial-editor__form{inline-size:100%;max-block-size:94vh}}}@layer view.home{:root:has([data-view=home]),html:has([data-view=home]){--view-home-bg:linear-gradient(135deg,light-dark(#f8f9fa,#1b1f24),light-dark(#e9ecef,#0f1216));--view-fg:light-dark(#1a1a1a,#e9ecef);--view-border:light-dark(rgba(0,0,0,0.08),rgba(255,255,255,0.12));--view-card-bg:light-dark(#ffffff,#1a1f26);--view-primary:light-dark(#007acc,#66b7ff);--view-layout:\"flex\";--view-padding:var(--space-8);--view-content-max-width:1200px;--view-hero-padding:var(--space-16);--view-card-gap:var(--space-6)}.view-home{align-items:center;background:var(--view-home-bg);block-size:100%;color:var(--view-fg);display:flex;justify-content:center;overflow-y:auto;padding:2rem}.view-home__content{max-inline-size:800px;text-align:center}.view-home__header{margin-block-end:3rem}.view-home__title{background:linear-gradient(135deg,var(--view-primary) 0,light-dark(#0059a6,#3a8ad6) 100%);-webkit-background-clip:text;font-size:3rem;font-weight:800;margin:0;-webkit-text-fill-color:transparent;background-clip:text}.view-home__subtitle{color:var(--view-fg);font-size:1.125rem;margin:.5rem 0 0;opacity:.7}.view-home__actions{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.view-home__action{align-items:center;background-color:var(--view-card-bg);border:1px solid var(--view-border);border-radius:16px;color:var(--view-fg);cursor:pointer;display:flex;flex-direction:column;gap:.75rem;padding:1.5rem;text-align:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.view-home__action ui-icon{color:var(--view-primary);opacity:.8}.view-home__action:hover{border-color:var(--view-primary);box-shadow:0 8px 24px light-dark(rgba(0,0,0,.1),rgba(0,0,0,.4));transform:translateY(-4px)}.view-home__action:hover ui-icon{opacity:1}.view-home__action:focus-visible{outline:2px solid var(--view-primary);outline-offset:2px}.view-home__action-title{font-size:1rem;font-weight:600}.view-home__action-desc{font-size:.8125rem;opacity:.6}.view-home.env-home-workspace,.view-home.view-home--grid{align-items:stretch;background:transparent!important;display:grid;justify-items:stretch;overflow:hidden;padding:0;pointer-events:auto!important}.speed-dial-root.app-oriented-desktop,.view-home.env-home-workspace>.speed-dial-root{pointer-events:auto!important}.view-home--grid{align-items:stretch;background:transparent;block-size:100%;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;justify-items:stretch;overflow:hidden;padding:0;position:relative}.view-home--grid .speed-dial-root{block-size:100%;inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;overflow:hidden;position:absolute}@container (max-width: 768px){.view-home{--view-hero-padding:var(--space-8);--view-card-gap:var(--space-4)}}@container (max-width: 480px){.view-home__actions{grid-template-columns:1fr}}}.speed-dial-editor,.speed-dial-editor__form,.speed-dial-editor__form .modal-field,.speed-dial-editor__form :is(input,select,textarea,button){pointer-events:auto!important}.speed-dial-editor__form{contain:none!important;content-visibility:visible!important;min-block-size:0!important}.speed-dial-editor__form .modal-field>label{pointer-events:none!important}";
//#endregion
//#region ../../modules/projects/fl.ui/src/styles/ui/home-host-apply.scss?inline
var home_host_apply_default = ":where(body):has([data-view=home]){margin:0;min-block-size:100dvb}:where(main,[role=main]):has(>.view-home.env-home-workspace){background:transparent;border:none;box-shadow:none;box-sizing:border-box;display:flex;flex-direction:column;min-block-size:100dvb;outline:none}:where(env-shell-container:is([role=main],#app)):has(.env-shell-workspace>.view-home.env-home-workspace,.env-shell-workspace>.env-shell-home-mount>.view-home.env-home-workspace){background:transparent;border:none;box-shadow:none;box-sizing:border-box;display:flex;flex-direction:column;min-block-size:100dvb;outline:none}:where(main,[role=main]):has(>.view-home.env-home-workspace:not(.wf-mounted-view)){margin-inline:0;max-inline-size:none}:where(env-shell-container:is([role=main],#app)):has(.env-shell-workspace>.view-home.env-home-workspace:not(.wf-mounted-view),.env-shell-workspace>.env-shell-home-mount>.view-home.env-home-workspace:not(.wf-mounted-view)){margin-inline:0;max-inline-size:none}.env-home-workspace,.view-home.env-home-workspace{box-sizing:border-box;overflow:visible;pointer-events:none}.view-home.env-home-workspace{align-items:stretch;background:transparent;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;justify-items:stretch;min-block-size:100dvb;min-inline-size:0;padding:0;position:relative}.view-home.env-home-workspace>.speed-dial-root{block-size:100%;inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;pointer-events:none;position:absolute}.env-shell-workspace>.env-shell-home-mount>.view-home.env-home-workspace.wf-mounted-view,.env-shell-workspace>.view-home.env-home-workspace.wf-mounted-view,.wf-view-host>.view-home.env-home-workspace.wf-mounted-view{align-self:stretch;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;block-size:auto;border:none!important;border-radius:0!important;box-shadow:none!important;flex:1 1 auto;isolation:isolate;margin:0;margin-inline:0;max-inline-size:none;min-block-size:0;outline:none!important;position:relative;z-index:0}.env-shell-workspace>.env-shell-home-mount>.view-home.env-home-workspace.wf-mounted-view>.speed-dial-root,.env-shell-workspace>.view-home.env-home-workspace.wf-mounted-view>.speed-dial-root,.wf-view-host>.view-home.env-home-workspace.wf-mounted-view>.speed-dial-root{block-size:100%;border:none!important;border-radius:0!important;box-shadow:none!important;flex:1 1 auto;inline-size:100%;min-block-size:0;outline:none!important}.env-shell-workspace>.env-shell-home-mount>.view-home.env-home-workspace.wf-mounted-view,.env-shell-workspace>.view-home.env-home-workspace.wf-mounted-view{padding-block-end:env(safe-area-inset-block-end,0);padding-block-start:env(safe-area-inset-block-start,0);padding-inline-end:env(safe-area-inset-inline-end,0);padding-inline-start:env(safe-area-inset-inline-start,0)}.view-home.env-home-workspace:not(.wf-mounted-view){backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;border:none!important;border-radius:0!important;box-shadow:none!important;margin-inline:0;max-inline-size:none;min-block-size:100dvb;outline:none!important}";
//#endregion
//#region ../../modules/views/home-view/src/ts/OrientBox.ts
var UIOrientBox = class extends DOMMixin {
	constructor(name) {
		super(name);
	}
	connect(ws) {
		const self = ws?.deref?.() ?? ws;
		self.classList.add("ui-orientbox");
		const zoom = numberRef(1), orient = numberRef(orientationNumberMap?.[getCorrectOrientation()] || 0);
		self.style.setProperty("--zoom", zoom.value);
		self.style.setProperty("--orient", orient.value);
		Object.defineProperty(self, "size", { get: () => size });
		Object.defineProperty(self, "zoom", {
			get: () => parseFloat(zoom.value) || 1,
			set: (value) => {
				zoom.value = value;
				self.style.setProperty("--zoom", value);
			}
		});
		Object.defineProperty(self, "orient", {
			get: () => parseInt(orient.value) || 0,
			set: (value) => {
				orient.value = value;
				self.style.setProperty("--orient", value);
			}
		});
		const size = vector2Ref(self.clientWidth, self.clientHeight);
		new ResizeObserver((entries) => {
			for (const entry of entries) if (entry?.contentBoxSize) {
				const contentBoxSize = entry?.contentBoxSize?.[0];
				size.x.value = contentBoxSize?.inlineSize || size.x.value || 0;
				size.y.value = contentBoxSize?.blockSize || size.y.value || 0;
			}
		}).observe(self, { box: "content-box" });
		elementPointerMap.set(self, {
			pointerMap: /* @__PURE__ */ new Map(),
			pointerCache: /* @__PURE__ */ new Map()
		});
		return this;
	}
};
new UIOrientBox("ui-orientbox");
//#endregion
//#region ../../modules/views/home-view/src/ts/OrientDesktop.ts
/** Orient-layer desktop shares SpeedDial styles; HomeView only adopts this sheet while home is visible, so load once here. */
var orientDesktopStyleSheet = null;
var homeHostStyleSheet = null;
var ensureOrientDesktopStyles = () => {
	if (!orientDesktopStyleSheet) orientDesktopStyleSheet = loadAsAdopted(SpeedDial_default);
	if (!homeHostStyleSheet) homeHostStyleSheet = loadAsAdopted(home_host_apply_default);
};
/**
* Compatibility entrypoint for shells that used the former manual desktop
* renderer. All rendering delegates to the canonical SpeedDial renderer
* (MutationObserver orient + `bindPointerInteraction`); no second desktop
* implementation lives here.
*
* INVARIANT: OrientDesktop stays an adapter — do not re-add a parallel
* desktop renderer here. Product behaviors (wallpaper IDB, paste/drop URL
* hygiene) belong in SpeedDial so both mount paths share them.
*/
var initializeOrientedDesktop = (host, makeView) => {
	if (!host || host.dataset.desktopMounted === "true") return;
	host.dataset.desktopMounted = "true";
	ensureOrientDesktopStyles();
	const root = SpeedDial(makeView);
	root.classList.add("app-oriented-desktop");
	host.appendChild(root);
	createCtxMenu(makeView);
};
//#endregion
//#region ../../modules/views/home-view/src/index.ts
var HomeView = class {
	id = "home";
	name = "Home";
	icon = "house";
	options;
	shellContext;
	element = null;
	lifecycle = { onUnmount: () => {
		setSpeedDialViewOpener(null);
		this.element = null;
	} };
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	/**
	* WHY: prefer `openView` when the host provides it — calling both navigate + openView
	* caused duplicate navigation and unreliable overlay open on environment shell.
	*/
	dispatchShellRoute(viewId, opts) {
		const id = resolveOpenViewTarget(viewId);
		if (!id) return;
		const shellContext = this.shellContext;
		if (!shellContext) {
			console.warn("[HomeView] No shellContext; cannot open:", id);
			return;
		}
		if (typeof shellContext.openView === "function") Promise.resolve(shellContext.openView(id, opts)).catch((e) => console.warn("[HomeView] shellContext.openView failed", id, e));
		else if (typeof shellContext.navigate === "function") Promise.resolve(shellContext.navigate(id, opts)).catch((e) => console.warn("[HomeView] shellContext.navigate failed", id, e));
		else console.warn("[HomeView] shellContext has no navigate/openView; cannot open:", id);
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext ?? this.shellContext;
		}
		const root = document.createElement("section");
		root.className = "view-home view-home--grid env-home-workspace";
		root.dataset.view = "home";
		root.id = "home-view";
		const openFromLauncher = (viewId, params) => {
			const p = { ...params || {} };
			const native = String(p.native || "");
			this.dispatchShellRoute(viewId, {
				...native === "1" || native === "true" ? { native: "1" } : {},
				params: p
			});
		};
		setSpeedDialViewOpener(openFromLauncher);
		this.shellContext?.resolveOverlayMountPoint;
		initializeOrientedDesktop(root, openFromLauncher);
		this.element = root;
		return root;
	}
	invokeChannelApi(action, payload) {
		if (action !== HomeChannelAction.Navigate && action !== HomeChannelAction.OpenView) return void 0;
		const viewId = typeof payload === "string" ? payload : payload && typeof payload === "object" && "viewId" in payload ? String(payload.viewId) : "";
		if (!viewId.trim()) return false;
		this.dispatchShellRoute(viewId.trim());
		return true;
	}
};
function createView(options) {
	return new HomeView(options);
}
var createHomeView = createView;
//#endregion
export { HomeView, createHomeView, createView, createView as default, initializeOrientedDesktop };
