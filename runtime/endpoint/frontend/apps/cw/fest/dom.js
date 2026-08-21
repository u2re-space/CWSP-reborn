import { i as cvt_cs_to_os } from "./core.js";
import { F as isArrayOrIterable, G as kebabToCamel, H as isVal, J as tryStringAsNumber, K as normalizePrimitive, P as hasValue, T as $avoidTrigger, W as isValueUnit, k as camelToKebab } from "./object.js";
//#region ../../modules/projects/dom.ts/src/agate/Properties.ts
var __registeredCssPropertiesSymbol = Symbol.for("dom.ts@__registeredCssProperties");
var __registeredCssProperties = globalThis[__registeredCssPropertiesSymbol] ??= /* @__PURE__ */ new Set();
[
	{
		name: "--screen-width",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--screen-height",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--visual-width",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--visual-height",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--clip-ampl",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--clip-freq",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--avail-width",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--avail-height",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	},
	{
		name: "--pixel-ratio",
		syntax: "<number>",
		inherits: true,
		initialValue: "1"
	},
	{
		name: "--percent",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--percent-x",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--percent-y",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--scroll-left",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--scroll-top",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	},
	{
		name: "--drag-x",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--drag-y",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--resize-x",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--resize-y",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--shift-x",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--shift-y",
		syntax: "<length>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-x",
		syntax: "<integer>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-y",
		syntax: "<integer>",
		inherits: false,
		initialValue: "0"
	}
].forEach((options) => {
	if (typeof CSS == "undefined" || typeof CSS?.registerProperty != "function") return;
	const name = String(options?.name || "").trim();
	if (!name || __registeredCssProperties.has(name)) return;
	try {
		CSS.registerProperty(options);
	} catch (e) {
		if (!(String(e?.name || "").toLowerCase() === "invalidmodificationerror")) console.warn(e);
	} finally {
		__registeredCssProperties.add(name);
	}
});
//#endregion
//#region ../../modules/projects/dom.ts/src/agate/Utils.ts
var createIdleDeadlineFallback = () => ({
	didTimeout: false,
	timeRemaining: () => 0
});
var runWhenIdle$1 = (cb, timeout = 1e3) => {
	if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(cb, { timeout });
	return setTimeout(() => cb(createIdleDeadlineFallback()), 0);
};
var makeRAFCycle = () => {
	const control = {
		canceled: false,
		rAFs: /* @__PURE__ */ new Set(),
		last: null,
		cancel() {
			this.canceled = true;
			cancelAnimationFrame(this.last);
			return this;
		},
		shedule(cb) {
			this.rAFs.add(cb);
			return this;
		}
	};
	(async () => {
		while (!control?.canceled) {
			await Promise.all((control?.rAFs?.values?.() ?? [])?.map?.((rAF) => Promise.try(rAF)?.catch?.(console.warn.bind(console))));
			control.rAFs?.clear?.();
			if (typeof requestAnimationFrame != "undefined") await new Promise((res) => {
				control.last = requestAnimationFrame(res);
			});
			else await new Promise((res) => {
				setTimeout(res, 16);
			});
		}
	})();
	return control;
};
typeof document != "undefined" && document?.documentElement;
var setAttributesIfNull = (element, attrs = {}) => {
	if (!attrs || typeof attrs != "object" || !element) return;
	return Array.from(Object.entries(attrs)).map(([name, value]) => {
		const old = element.getAttribute(name);
		if (value == null) element.removeAttribute(name);
		else if (value != old) element.setAttribute(name, old == "" ? value ?? old : old ?? value);
	});
};
var throttleMap = /* @__PURE__ */ new Map();
var setIdleInterval = (cb, timeout = 1e3, ...args) => {
	const status = {
		running: true,
		cancel: () => {
			status.running = false;
		}
	};
	runWhenIdle$1(async () => {
		if (!cb || typeof cb != "function") return;
		while (status.running) {
			await Promise.all([Promise.try(cb, ...args), new Promise((r) => setTimeout(r, timeout))]).catch?.(console.warn.bind(console));
			await Promise.any([new Promise((r) => runWhenIdle$1(r, timeout)), new Promise((r) => setTimeout(r, timeout))]);
		}
		status.cancel = () => {};
	}, timeout);
	return status?.cancel;
};
if (typeof requestAnimationFrame != "undefined") requestAnimationFrame(async () => {
	while (true) {
		throttleMap.forEach((cb) => cb?.());
		await new Promise((r) => requestAnimationFrame(r));
	}
});
var setChecked = (input, value, ev) => {
	if (value != null && input.checked != value) {
		if (input?.["type"] == "checkbox" || input?.["type"] == "radio" && !input?.checked) {
			input?.click?.();
			ev?.preventDefault?.();
		} else {
			input.checked = !!value;
			input?.dispatchEvent?.(new Event("change", {
				bubbles: true,
				cancelable: true
			}));
		}
	}
};
var isValidParent = (parent) => {
	return parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement) ? parent : null;
};
var indexOf = (element, node) => {
	if (element == null || node == null) return -1;
	return Array.from(element?.childNodes ?? [])?.indexOf?.(node) ?? -1;
};
var createElementVanilla = (selector) => {
	if (selector == ":fragment:") return document.createDocumentFragment();
	const create = document.createElement.bind(document);
	for (var node = create("div"), match, className = ""; selector && (match = selector.match("^(?:(-?[_a-zA-Z]+[_a-zA-Z0-9-]*))|^#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?:([*$|~^]?=)([\"'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]"));) {
		if (match[1]) node = create(match[1]);
		if (match[2]) node.id = match[2];
		if (match[3]) className += " " + match[3];
		if (match[4]) node.setAttribute(match[4], match[7] || "");
		selector = selector.slice(match[0].length);
	}
	if (className) node.className = className.slice(1);
	return node;
};
var isElement = (el) => {
	return el != null && (el instanceof Node || el instanceof Text || el instanceof Element || el instanceof Comment || el instanceof HTMLElement || el instanceof DocumentFragment) ? el : null;
};
var hasParent = (current, parent) => {
	while (current) {
		if (!(current?.element ?? current)) return false;
		if ((current?.element ?? current) === (parent?.element ?? parent)) return true;
		current = current.parentElement ?? (current.parentNode == current?.getRootNode?.({ composed: true }) ? current?.getRootNode?.({ composed: true })?.host : current?.parentNode);
	}
};
var passiveOpts$1 = {};
function addEvent(target, type, cb, opts = passiveOpts$1) {
	target?.addEventListener?.(type, cb, opts);
	const wr = typeof target == "object" || typeof target == "function" && !target?.deref ? new WeakRef(target) : target;
	return () => wr?.deref?.()?.removeEventListener?.(type, cb, opts);
}
var addEventsList = (el, events) => {
	if (events) {
		let entries = events;
		if (events instanceof Map) entries = [...events.entries()];
		else entries = [...Object.entries(events)];
		return entries.map(([name, list]) => ((isArrayOrIterable(list) ? [...list] : list) ?? [])?.map?.((cbs) => {
			return addEvent(el, name, cbs);
		}));
	}
};
var containsOrSelf = (a, b, ev) => {
	if (b == null || !(b instanceof Node) && b?.element == null) return false;
	if (a == b || (a?.element ?? a) == (b?.element ?? b)) return true;
	if (ev?.composedPath && typeof ev.composedPath === "function") {
		const path = ev.composedPath();
		const aEl = a?.element ?? a;
		const bEl = b?.element ?? b;
		if (path.includes(aEl) && path.includes(bEl)) {
			const aIndex = path.indexOf(aEl);
			const bIndex = path.indexOf(bEl);
			if (bIndex >= 0 && aIndex >= 0 && bIndex < aIndex) return true;
		}
	}
	if (a?.contains?.(b?.element ?? b) || a?.getRootNode({ composed: true })?.host == (b?.element ?? b)) return true;
	return false;
};
var MOCElement = (element, selector, ev) => {
	const sel = typeof selector === "string" ? selector.trim() : "";
	if (!sel) return element ?? null;
	if (ev?.composedPath && typeof ev.composedPath === "function") {
		const path = ev.composedPath();
		for (const node of path) if (node instanceof HTMLElement || node instanceof Element) try {
			if (node.matches?.(sel)) return node;
		} catch {}
	}
	let self = null;
	let hostMatched = null;
	let closest = null;
	try {
		self = element?.matches?.(sel) ? element : null;
		const host = (element?.getRootNode({ composed: true }) ?? element?.parentElement?.getRootNode({ composed: true }))?.host;
		hostMatched = host?.matches?.(sel) ? host : null;
		closest = element?.closest?.(sel) ?? self?.closest?.(sel) ?? hostMatched?.closest?.(sel) ?? null;
	} catch {}
	return self ?? closest ?? hostMatched;
};
var isInFocus = (element, selectorOrElement, dir = "parent") => {
	if (!element) return false;
	if (element.checkVisibility && !element.checkVisibility({
		checkOpacity: true,
		checkVisibilityCSS: true
	})) return false;
	if (!element.checkVisibility && element.offsetParent === null && element.style.position !== "fixed") return false;
	let active = document.activeElement;
	while (active && active.shadowRoot && active.shadowRoot.activeElement) active = active.shadowRoot.activeElement;
	const isFocused = active === element || hasParent(active, element);
	const isHovered = element.matches(":hover");
	if (!isFocused && !isHovered && !selectorOrElement) return false;
	if (selectorOrElement) {
		if (typeof selectorOrElement === "string") {
			if (dir === "parent") return !!MOCElement(element, selectorOrElement);
			else {
				const altCnd = !!MOCElement(isFocused ? active : element.querySelector(":hover") || element, selectorOrElement);
				return element?.querySelector?.(selectorOrElement) != null || element?.matches?.(selectorOrElement) || altCnd;
			}
		} else if (selectorOrElement instanceof HTMLElement) {
			if (dir === "parent") return hasParent(element, selectorOrElement) || false;
			else return hasParent(selectorOrElement, element) || false;
		}
	}
	return true;
};
//#endregion
//#region ../../modules/projects/dom.ts/src/agate/Zoom.ts
var zoomValuesSymbol = Symbol.for("dom.ts@zoomValues");
var zoomValues = globalThis[zoomValuesSymbol] ??= /* @__PURE__ */ new WeakMap();
var zoomOf = (element = document.documentElement) => {
	return zoomValues.getOrInsertComputed(element, () => {
		const container = (element?.matches?.(".ui-orientbox") ? element : null) || element?.closest?.(".ui-orientbox") || document.body;
		if (container?.zoom) return container?.zoom || 1;
		if (element?.currentCSSZoom) return element?.currentCSSZoom || 1;
	});
};
var fixedClientZoom = (element = document.documentElement) => {
	return (element?.currentCSSZoom != null ? 1 : zoomOf(element)) || 1;
};
var unfixedClientZoom = (element = document.documentElement) => {
	return (element?.currentCSSZoom == null ? 1 : element?.currentCSSZoom) || 1;
};
var orientOf = (element = document.documentElement) => {
	const container = (element?.matches?.("[orient], [data-mixin=\"ui-orientbox\"]") ? element : null) || element?.closest?.("[orient], [data-mixin=\"ui-orientbox\"]") || element;
	if (container?.hasAttribute?.("orient")) return parseInt(container?.getAttribute?.("orient") || "0") || 0;
	if (container?.orient != null && Number.isFinite(Number(container.orient))) return Number(container.orient) || 0;
	try {
		const raw = container?.style?.getPropertyValue?.("--orient") || (typeof getComputedStyle === "function" && container ? getComputedStyle(container).getPropertyValue("--orient") : "") || "";
		const n = parseInt(String(raw).trim(), 10);
		if (Number.isFinite(n)) return n;
	} catch {}
	return 0;
};
var getBoundingOrientRect = (element, orient = null) => {
	const zoom = unfixedClientZoom(element) || 1;
	const box = element?.getBoundingClientRect?.();
	const nbx = {
		left: box?.left / zoom,
		right: box?.right / zoom,
		top: box?.top / zoom,
		bottom: box?.bottom / zoom,
		width: box?.width / zoom,
		height: box?.height / zoom
	};
	const or_i = orient ?? (orientOf(element) || 0);
	const vv = typeof window !== "undefined" ? window.visualViewport : null;
	const size = [((vv?.width ?? document.documentElement?.clientWidth ?? window.innerWidth) || 1) / zoom, ((vv?.height ?? document.documentElement?.clientHeight ?? window.innerHeight) || 1) / zoom];
	const [left_, top_] = cvt_cs_to_os([nbx.left, nbx.top], size, or_i);
	const [right_, bottom_] = cvt_cs_to_os([nbx.right, nbx.bottom], size, or_i);
	const [left, right] = or_i == 0 || or_i == 3 ? [left_, right_] : [right_, left_];
	const [top, bottom] = or_i == 0 || or_i == 1 ? [top_, bottom_] : [bottom_, top_];
	const [width, height] = or_i % 2 ? [nbx.height, nbx.width] : [nbx.width, nbx.height];
	return {
		left,
		top,
		right,
		bottom,
		width,
		height
	};
};
//#endregion
//#region ../../modules/projects/dom.ts/src/agate/Viewport.ts
var runWhenIdle = (cb, timeout = 100) => {
	if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(cb, { timeout });
	return setTimeout(() => cb({
		didTimeout: false,
		timeRemaining: () => 0
	}), 0);
};
var getAvailSize = () => {
	const l = typeof matchMedia != "undefined" ? matchMedia("(orientation: landscape)")?.matches : false;
	const vv = typeof window !== "undefined" ? window.visualViewport : null;
	const vvBlock = vv ? {
		"--vv-width": `${vv.width}px`,
		"--vv-height": `${vv.height}px`,
		"--vv-offset-left": `${vv.offsetLeft}px`,
		"--vv-offset-top": `${vv.offsetTop}px`,
		"--vv-scale": String(vv.scale ?? 1)
	} : {
		"--vv-width": typeof window !== "undefined" ? `${window.innerWidth}px` : "0px",
		"--vv-height": typeof window !== "undefined" ? `${window.innerHeight}px` : "0px",
		"--vv-offset-left": "0px",
		"--vv-offset-top": "0px",
		"--vv-scale": "1"
	};
	if (typeof screen != "undefined") {
		const aw = screen?.availWidth + "px";
		const ah = screen?.availHeight + "px";
		return {
			"--screen-width": Math.min(screen?.width, screen?.availWidth) + "px",
			"--screen-height": Math.min(screen?.height, screen?.availHeight) + "px",
			"--avail-width": l ? ah : aw,
			"--avail-height": l ? aw : ah,
			"--view-height": Math.min(screen?.availHeight, window?.innerHeight) + "px",
			"--pixel-ratio": String(devicePixelRatio || 1),
			...vvBlock
		};
	}
	return {
		"--screen-width": "0px",
		"--screen-height": "0px",
		"--avail-width": "0px",
		"--avail-height": "0px",
		"--view-height": "0px",
		"--pixel-ratio": "1",
		...vvBlock
	};
};
var availSize = getAvailSize();
var orientationNumberMap = {
	"portrait-primary": 0,
	"landscape-primary": 1,
	"portrait-secondary": 2,
	"landscape-secondary": 3
};
var updateVP = (ev) => {
	const rule = document.documentElement;
	Object.assign(availSize, getAvailSize());
	Object.entries(availSize).forEach(([propName, propValue]) => {
		const exists = rule?.style?.getPropertyValue(propName);
		if (!exists || exists != propValue) rule?.style?.setProperty?.(propName, propValue || "", "");
	});
	document.documentElement.style.setProperty("--orientation-secondary", screen?.orientation?.type?.endsWith?.("secondary") ? "1" : "0");
};
var getCorrectOrientation = () => {
	let orientationType = screen?.orientation?.type || "portrait-primary";
	if (!globalThis.matchMedia("((display-mode: fullscreen) or (display-mode: standalone) or (display-mode: window-controls-overlay))").matches) {
		if (matchMedia("(orientation: portrait)").matches) orientationType = orientationType.replace("landscape", "portrait");
		else if (matchMedia("(orientation: landscape)").matches) orientationType = orientationType.replace("portrait", "landscape");
	}
	return orientationType;
};
var passiveOpts = { passive: true };
var whenAnyScreenChanges = (cb) => {
	let ticking = false;
	const update = () => {
		if (!ticking) {
			requestAnimationFrame(() => {
				updateVP();
				cb();
				ticking = false;
			});
			ticking = true;
		}
	};
	const unsubscribers = [];
	unsubscribers.push(addEvent(navigator?.virtualKeyboard, "geometrychange", update, passiveOpts));
	unsubscribers.push(addEvent(window?.visualViewport, "scroll", update, passiveOpts));
	unsubscribers.push(addEvent(window?.visualViewport, "resize", update, passiveOpts));
	unsubscribers.push(addEvent(screen?.orientation, "change", update));
	unsubscribers.push(addEvent(window, "resize", update));
	unsubscribers.push(addEvent(document?.documentElement, "fullscreenchange", update));
	unsubscribers.push(addEvent(document, "DOMContentLoaded", update));
	unsubscribers.push(addEvent(matchMedia("(orientation: portrait)"), "change", update));
	unsubscribers.push(addEvent(matchMedia("(orientation: landscape)"), "change", update));
	update();
	runWhenIdle(() => update(), 100);
	return () => unsubscribers.forEach((unsub) => unsub());
};
var fixOrientToScreen = (element) => {
	if (!element?.classList?.contains?.("native-portrait-optimized")) {
		element?.classList?.add?.("native-portrait-optimized");
		return whenAnyScreenChanges(() => {
			const next = orientationNumberMap?.[getCorrectOrientation()] ?? 0;
			element.orient = next;
			element.setAttribute?.("orient", String(next));
			element.style?.setProperty?.("--orient", String(next));
		});
	}
};
new OffscreenCanvas(1, 1).getContext("2d");
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/Observer.ts
var onBorderObserveSymbol = Symbol.for("dom.ts@onBorderObserve");
globalThis[onBorderObserveSymbol] ??= /* @__PURE__ */ new WeakMap();
var onContentObserveSymbol = Symbol.for("dom.ts@onContentObserve");
globalThis[onContentObserveSymbol] ??= /* @__PURE__ */ new WeakMap();
var unwrapFromQuery = (element) => {
	if (typeof element?.current == "object") element = element?.element ?? element?.current ?? (typeof element?.self == "object" ? element?.self : null) ?? element;
	return element;
};
/** INVARIANT: `querySelectorAll` / `matches` reject "" — normalize before DOM APIs. */
var normalizeSelector = (selector, fallback = "*") => {
	if (typeof selector !== "string") return fallback;
	return selector.trim() || fallback;
};
var safeQuerySelectorAll = (el, selector) => {
	if (!el || typeof el.querySelectorAll !== "function") return [];
	const sel = normalizeSelector(selector, "");
	if (!sel) return [];
	try {
		return Array.from(el.querySelectorAll(sel) || []);
	} catch {
		return [];
	}
};
var safeMatches = (el, selector) => {
	if (!el || typeof el.matches !== "function") return false;
	const sel = normalizeSelector(selector, "");
	if (!sel) return false;
	try {
		return !!el.matches(sel);
	} catch {
		return false;
	}
};
var observeAttribute = (element, attribute, cb) => {
	if (typeof element?.selector == "string") return observeAttributeBySelector(element, element?.selector, attribute, cb);
	const attributeList = new Set((attribute.split(",") || [attribute]).map((s) => s.trim()));
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) if (mutation.attributeName && attributeList.has(mutation.attributeName)) cb(mutation, observer);
	});
	if ((element?.element ?? element) instanceof Node) observer.observe(element = unwrapFromQuery(element), {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: [...attributeList]
	});
	attributeList.forEach((attribute) => cb({
		target: element,
		type: "attributes",
		attributeName: attribute,
		oldValue: element?.getAttribute?.(attribute)
	}, observer));
	return observer;
};
var observeAttributeBySelector = (element, selector, attribute, cb) => {
	const sel = normalizeSelector(selector);
	const attributeList = new Set([...attribute.split(",") || [attribute]].map((s) => s.trim()));
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) if (mutation.type == "childList") {
			const addedNodes = Array.from(mutation.addedNodes) || [];
			const removedNodes = Array.from(mutation.removedNodes) || [];
			addedNodes.push(...Array.from(mutation.addedNodes || []).flatMap((el) => safeQuerySelectorAll(el, sel)));
			removedNodes.push(...Array.from(mutation.removedNodes || []).flatMap((el) => safeQuerySelectorAll(el, sel)));
			[...new Set(addedNodes)].filter((el) => safeMatches(el, sel))?.map?.((target) => {
				attributeList.forEach((attribute) => {
					cb({
						target,
						type: "attributes",
						attributeName: attribute,
						oldValue: target?.getAttribute?.(attribute)
					}, observer);
				});
			});
		} else if (safeMatches(mutation.target, sel) && mutation.attributeName && attributeList.has(mutation.attributeName)) cb(mutation, observer);
	});
	observer.observe(element = unwrapFromQuery(element), {
		attributeOldValue: true,
		attributes: true,
		attributeFilter: [...attributeList],
		childList: true,
		subtree: true,
		characterData: true
	});
	safeQuerySelectorAll(element, sel).map((target) => attributeList.forEach((attribute) => cb({
		target,
		type: "attributes",
		attributeName: attribute,
		oldValue: target?.getAttribute?.(attribute)
	}, observer)));
	return observer;
};
var observeBySelector = (element, selector = "*", cb = (mut, obs) => {}) => {
	const sel = normalizeSelector(selector);
	const unwrapNodesBySelector = (nodes) => {
		const $nodes = Array.from(nodes || []) || [];
		$nodes.push(...Array.from(nodes || []).flatMap((el) => safeQuerySelectorAll(el, sel)));
		return [...Array.from(new Set($nodes).values())].filter((el) => safeMatches(el, sel));
	};
	let obRef = null;
	const handleMutation = (mutation) => {
		const observer = obRef?.deref?.();
		const addedNodes = unwrapNodesBySelector(mutation.addedNodes);
		const removedNodes = unwrapNodesBySelector(mutation.removedNodes);
		if (addedNodes.length > 0 || removedNodes.length > 0) cb?.({
			type: mutation.type,
			target: mutation.target,
			attributeName: mutation.attributeName,
			attributeNamespace: mutation.attributeNamespace,
			nextSibling: mutation.nextSibling,
			oldValue: mutation.oldValue,
			previousSibling: mutation.previousSibling,
			addedNodes,
			removedNodes
		}, observer);
	};
	const handleCome = (ev) => {
		handleMutation({
			addedNodes: [ev?.target].filter((el) => !!el),
			removedNodes: [ev?.relatedTarget].filter((el) => !!el),
			type: "childList",
			target: ev?.currentTarget
		});
	};
	const handleOutCome = (ev) => {
		handleMutation({
			addedNodes: [ev?.relatedTarget].filter((el) => !!el),
			removedNodes: [ev?.target].filter((el) => !!el),
			type: "childList",
			target: ev?.currentTarget
		});
	};
	const handleFocusClick = (ev) => {
		handleMutation({
			addedNodes: [ev?.target].filter((el) => !!el),
			removedNodes: [ev?.relatedTarget || document?.activeElement].filter((el) => !!el),
			type: "childList",
			target: ev?.currentTarget
		});
	};
	const factors = {
		passive: true,
		capture: false
	};
	if (sel?.includes?.(":hover") && sel?.includes?.(":active")) {
		element.addEventListener("pointerover", handleCome, factors);
		element.addEventListener("pointerout", handleOutCome, factors);
		element.addEventListener("pointerdown", handleCome, factors);
		element.addEventListener("pointerup", handleOutCome, factors);
		element.addEventListener("pointercancel", handleOutCome, factors);
		return { disconnect: () => {
			element.removeEventListener("pointerover", handleCome, factors);
			element.removeEventListener("pointerout", handleOutCome, factors);
			element.removeEventListener("pointerdown", handleCome, factors);
			element.removeEventListener("pointerup", handleOutCome, factors);
			element.removeEventListener("pointercancel", handleOutCome, factors);
		} };
	}
	if (sel?.includes?.(":hover")) {
		element.addEventListener("pointerover", handleCome, factors);
		element.addEventListener("pointerout", handleOutCome, factors);
		return { disconnect: () => {
			element.removeEventListener("pointerover", handleCome, factors);
			element.removeEventListener("pointerout", handleOutCome, factors);
		} };
	}
	if (sel?.includes?.(":active")) {
		element.addEventListener("pointerdown", handleCome, factors);
		element.addEventListener("pointerup", handleOutCome, factors);
		element.addEventListener("pointercancel", handleOutCome, factors);
		return { disconnect: () => {
			element.removeEventListener("pointerdown", handleCome, factors);
			element.removeEventListener("pointerup", handleOutCome, factors);
			element.removeEventListener("pointercancel", handleOutCome, factors);
		} };
	}
	if (sel?.includes?.(":focus") && sel?.includes?.(":focus-within") && sel?.includes?.(":focus-visible")) {
		element.addEventListener("focusin", handleCome, factors);
		element.addEventListener("focusout", handleOutCome, factors);
		element.addEventListener("click", handleFocusClick, factors);
		return { disconnect: () => {
			element.removeEventListener("focusin", handleCome, factors);
			element.removeEventListener("focusout", handleOutCome, factors);
			element.removeEventListener("click", handleFocusClick, factors);
		} };
	}
	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) if (mutation.type == "childList") handleMutation(mutation);
	});
	obRef = new WeakRef(observer);
	if ((element?.element ?? element) instanceof Node) observer.observe(element = unwrapFromQuery(element), {
		childList: true,
		subtree: true
	});
	const selected = safeQuerySelectorAll(element, sel);
	if (selected.length > 0) cb?.({
		addedNodes: selected,
		removedNodes: []
	}, observer);
	return observer;
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/Style.ts
var OWNER = "DOM";
var styleElement = typeof document != "undefined" ? document.createElement("style") : null;
if (styleElement) {
	document.querySelector("head")?.appendChild?.(styleElement);
	styleElement.dataset.owner = OWNER;
}
var supportsConstructableStylesheet = () => typeof globalThis !== "undefined" && typeof globalThis.CSSStyleSheet === "function";
var cssTextRequiresInlineStyleElement = (css) => typeof css === "string" && /@import\b/i.test(css);
var isLayerBlockRule = (rule) => typeof CSSLayerBlockRule !== "undefined" && rule instanceof CSSLayerBlockRule;
var getOrCreateLayerRule = (sheet, layerName) => {
	if (!sheet || !layerName) return void 0;
	const rules = Array.from(sheet.cssRules || []);
	const existing = rules.find((rule) => isLayerBlockRule(rule) && rule.name === layerName);
	if (existing) return existing;
	try {
		const ruleIndex = sheet.insertRule(`@layer ${layerName} {}`, rules.length);
		const created = sheet.cssRules?.[ruleIndex];
		return isLayerBlockRule(created) ? created : void 0;
	} catch {
		return;
	}
};
var setStyleURL = (base, url, layer = "") => {
	base[0][base[1]] = base[1] == "innerHTML" ? `@import url("${url}") ${layer && typeof layer == "string" ? `layer(${layer})` : ""};` : url;
};
var promiseOrDirect = (promise, cb) => {
	if (typeof promise?.then == "function") return promise?.then?.(cb);
	return cb(promise);
};
var blobURLMapSymbol = Symbol.for("dom.ts@blobURLMap");
var blobURLMap = globalThis[blobURLMapSymbol] ??= /* @__PURE__ */ new WeakMap();
var cacheMapSymbol = Symbol.for("dom.ts@cacheMap");
var cacheMap = globalThis[cacheMapSymbol] ??= /* @__PURE__ */ new Map();
var fetchAndCache = (url) => {
	if (!url) return null;
	if (cacheMap.has(url)) return cacheMap.get(url);
	if (url instanceof Blob || url instanceof File) {
		if (blobURLMap.has(url)) return blobURLMap.get(url);
		const burl = URL.createObjectURL(url);
		blobURLMap.set(url, burl);
		cacheMap.set(burl, burl);
		return burl;
	}
	if (URL.canParse(url) || url?.trim?.()?.startsWith?.("./")) {
		const promised = fetch(url?.replace?.("?url", "?raw"), {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (res) => {
			const blob = await res.blob();
			const burl = URL.createObjectURL(blob);
			blobURLMap.set(blob, burl);
			cacheMap.set(url, burl);
			cacheMap.set(burl, burl);
			return burl;
		});
		cacheMap.set(url, promised);
		return promised;
	}
	if (typeof url == "string") {
		const blob = new Blob([url], { type: "text/css" });
		const burl = URL.createObjectURL(blob);
		blobURLMap.set(blob, burl);
		cacheMap.set(burl, burl);
		return burl;
	}
	return url;
};
var cacheContentMap = /* @__PURE__ */ new Map();
var cacheBlobContentMap = /* @__PURE__ */ new WeakMap();
var fetchAsInline = (url) => {
	if (!url) return "";
	if (cacheContentMap.has(url)) return cacheContentMap.get(url) ?? "";
	if (url instanceof Blob || url instanceof File) {
		if (cacheBlobContentMap.has(url)) return cacheBlobContentMap.get(url) ?? "";
		const promised = url?.text?.()?.then?.((text) => {
			cacheBlobContentMap.set(url, text);
			return text;
		});
		cacheBlobContentMap.set(url, promised);
		return promised;
	}
	if (URL.canParse(url) || url?.trim?.()?.startsWith?.("./")) {
		const promised = fetch(url?.replace?.("?url", "?raw"), {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (res) => {
			const text = await res.text();
			cacheContentMap.set(url, text);
			return text;
		});
		cacheContentMap.set(url, promised);
		return promised;
	}
	if (typeof url == "string") {
		cacheContentMap.set(url, url);
		return url;
	}
	return url;
};
var adoptedSelectorMapSymbol = Symbol.for("dom.ts@adoptedSelectorMap");
var adoptedSelectorMap = globalThis[adoptedSelectorMapSymbol] ??= /* @__PURE__ */ new Map();
var adoptedShadowSelectorMapSymbol = Symbol.for("dom.ts@adoptedShadowSelectorMap");
var adoptedShadowSelectorMap = globalThis[adoptedShadowSelectorMapSymbol] ??= /* @__PURE__ */ new WeakMap();
var adoptedLayerMapSymbol = Symbol.for("dom.ts@adoptedLayerMap");
var adoptedLayerMap = globalThis[adoptedLayerMapSymbol] ??= /* @__PURE__ */ new Map();
var adoptedShadowLayerMapSymbol = Symbol.for("dom.ts@adoptedShadowLayerMap");
var adoptedShadowLayerMap = globalThis[adoptedShadowLayerMapSymbol] ??= /* @__PURE__ */ new WeakMap();
var getAdoptedStyleRule = (selector, layerName = "ux-query", basis = null) => {
	if (!selector) return null;
	if (!supportsConstructableStylesheet()) return null;
	const root = basis instanceof ShadowRoot ? basis : basis?.getRootNode ? basis.getRootNode({ composed: true }) : null;
	const isShadowRoot = root instanceof ShadowRoot;
	const targetAdoptedSheets = isShadowRoot ? root.adoptedStyleSheets : typeof document != "undefined" ? document.adoptedStyleSheets : null;
	if (!targetAdoptedSheets) return null;
	const selectorKey = `${layerName || ""}:${selector}`;
	let sheet;
	if (isShadowRoot) {
		let shadowMap = adoptedShadowSelectorMap.get(root);
		if (!shadowMap) {
			shadowMap = /* @__PURE__ */ new Map();
			adoptedShadowSelectorMap.set(root, shadowMap);
		}
		sheet = shadowMap.get(selectorKey);
		if (!sheet) {
			sheet = new CSSStyleSheet();
			shadowMap.set(selectorKey, sheet);
			if (!targetAdoptedSheets.includes(sheet)) targetAdoptedSheets.push(sheet);
		}
	} else {
		sheet = adoptedSelectorMap.get(selectorKey);
		if (!sheet) {
			sheet = new CSSStyleSheet();
			adoptedSelectorMap.set(selectorKey, sheet);
			if (!targetAdoptedSheets.includes(sheet)) targetAdoptedSheets.push(sheet);
		}
	}
	if (layerName) {
		let layerRule;
		if (isShadowRoot) {
			let shadowLayerMap = adoptedShadowLayerMap.get(root);
			if (!shadowLayerMap) {
				shadowLayerMap = /* @__PURE__ */ new Map();
				adoptedShadowLayerMap.set(root, shadowLayerMap);
			}
			layerRule = shadowLayerMap.get(layerName);
		} else layerRule = adoptedLayerMap.get(layerName);
		if (!layerRule) {
			layerRule = getOrCreateLayerRule(sheet, layerName);
			if (layerRule) {
				if (isShadowRoot) {
					let shadowLayerMap = adoptedShadowLayerMap.get(root);
					if (!shadowLayerMap) {
						shadowLayerMap = /* @__PURE__ */ new Map();
						adoptedShadowLayerMap.set(root, shadowLayerMap);
					}
					shadowLayerMap.set(layerName, layerRule);
				} else adoptedLayerMap.set(layerName, layerRule);
			}
		}
		if (layerRule) {
			let layerRuleIndex = Array.from(layerRule.cssRules || []).findIndex((r) => r instanceof CSSStyleRule && r.selectorText?.trim?.() === selector?.trim?.());
			if (layerRuleIndex === -1) try {
				layerRuleIndex = layerRule.insertRule(`${selector} {}`, layerRule.cssRules.length);
			} catch (e) {
				return null;
			}
			return layerRule.cssRules[layerRuleIndex];
		}
	}
	let ruleIndex = Array.from(sheet.cssRules || []).findIndex((rule) => rule instanceof CSSStyleRule && rule.selectorText?.trim?.() === selector?.trim?.());
	if (ruleIndex === -1) try {
		ruleIndex = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
	} catch (e) {
		return null;
	}
	const rule = sheet.cssRules[ruleIndex];
	if (rule instanceof CSSStyleRule) return rule;
	return null;
};
/**
* Определяет нативные CSS Typed OM значения (CSSUnitValue, CSSMathValue, etc.)
*/
var isNativeCSSStyleValue = (value) => {
	if (value == null || typeof value !== "object") return false;
	try {
		const CSSStyleValueCtor = globalThis.CSSStyleValue;
		if (typeof CSSStyleValueCtor === "function" && value instanceof CSSStyleValueCtor) return true;
		for (let prototype = value; prototype; prototype = Object.getPrototypeOf(prototype)) if (prototype?.constructor?.name === "CSSStyleValue") return true;
	} catch {}
	return false;
};
/**
* Определяет реактивные значения { value: ... }
*/
var isReactiveStyleValue = (value) => {
	if (value == null || typeof value !== "object" || isNativeCSSStyleValue(value)) return false;
	try {
		return "value" in value;
	} catch {
		return false;
	}
};
var getWindowConstructor = (win, name) => {
	return win?.[name] ?? globalThis?.[name];
};
var getCSSUnitFactoryName = (unit) => {
	switch (unit.toLowerCase()) {
		case "%": return "percent";
		case "q": return "Q";
		case "hz": return "Hz";
		case "khz": return "kHz";
		case "fr": return "flex";
		default: return unit.toLowerCase();
	}
};
var getCSSUnitConstructorName = (unit) => {
	return unit.toLowerCase() === "%" ? "percent" : unit.toLowerCase();
};
/**
* Создает CSS.px(value), CSS.deg(value), CSS.number(value), etc.
*/
var createTypedUnitValue = (win, unit, value) => {
	const CSSNamespace = win?.CSS;
	const factoryName = getCSSUnitFactoryName(unit);
	const factory = CSSNamespace?.[factoryName];
	if (typeof factory === "function") return factory.call(CSSNamespace, value);
	const CSSUnitValueCtor = getWindowConstructor(win, "CSSUnitValue");
	if (typeof CSSUnitValueCtor !== "function") throw new TypeError(`Typed OM does not support CSS unit "${unit}"`);
	return new CSSUnitValueCtor(value, getCSSUnitConstructorName(unit));
};
/**
* Токенизация CSS-выражений для парсинга calc(), min(), max(), clamp()
*/
var tokenizeNumericCSS = (source) => {
	const tokens = [];
	let cursor = 0;
	while (cursor < source.length) {
		const rest = source.slice(cursor);
		const whitespace = /^\s+/.exec(rest);
		if (whitespace) {
			cursor += whitespace[0].length;
			continue;
		}
		const number = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(rest);
		if (number) {
			cursor += number[0].length;
			const unitMatch = /^(%|[a-zA-Z]+)/.exec(source.slice(cursor));
			const unit = unitMatch?.[0] ?? null;
			if (unitMatch) cursor += unitMatch[0].length;
			tokens.push({
				kind: "number",
				value: Number(number[0]),
				unit: unit == null ? null : unit.toLowerCase()
			});
			continue;
		}
		const identifier = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(rest);
		if (identifier) {
			tokens.push({
				kind: "identifier",
				value: identifier[0].toLowerCase()
			});
			cursor += identifier[0].length;
			continue;
		}
		const symbol = rest[0];
		if ([
			"+",
			"-",
			"*",
			"/",
			"(",
			")",
			","
		].includes(symbol)) {
			tokens.push({
				kind: "symbol",
				value: symbol
			});
			cursor++;
			continue;
		}
		throw new SyntaxError(`Unsupported token near "${rest}"`);
	}
	return tokens;
};
/**
* Парсер Typed OM математических выражений
*/
var NumericTypedOMParser = class {
	tokens;
	win;
	index = 0;
	constructor(tokens, win) {
		this.tokens = tokens;
		this.win = win;
	}
	parse() {
		const root = this.parseSum();
		if (this.index !== this.tokens.length) throw new SyntaxError("Unexpected trailing expression");
		return root;
	}
	current() {
		return this.tokens[this.index];
	}
	consume() {
		const token = this.tokens[this.index];
		if (!token) throw new SyntaxError("Unexpected end of expression");
		this.index++;
		return token;
	}
	consumeSymbol(symbol) {
		const token = this.consume();
		if (token.kind !== "symbol" || token.value !== symbol) throw new SyntaxError(`Expected "${symbol}"`);
	}
	matchesSymbol(symbol) {
		const token = this.current();
		return token?.kind === "symbol" && token.value === symbol;
	}
	createMath(name, ...values) {
		const Constructor = getWindowConstructor(this.win, name);
		if (typeof Constructor !== "function") throw new TypeError(`${name} is not supported`);
		return new Constructor(...values);
	}
	parseSum() {
		let value = this.parseProduct();
		while (this.matchesSymbol("+") || this.matchesSymbol("-")) {
			const operator = this.consume();
			const right = this.parseProduct();
			if (operator.kind !== "symbol") throw new SyntaxError("Expected sum operator");
			if (operator.value === "+") value = this.createMath("CSSMathSum", value, right);
			else value = this.createMath("CSSMathSum", value, this.createMath("CSSMathNegate", right));
		}
		return value;
	}
	parseProduct() {
		let value = this.parseUnary();
		while (this.matchesSymbol("*") || this.matchesSymbol("/")) {
			const operator = this.consume();
			const right = this.parseUnary();
			if (operator.kind !== "symbol") throw new SyntaxError("Expected product operator");
			if (operator.value === "*") value = this.createMath("CSSMathProduct", value, right);
			else value = this.createMath("CSSMathProduct", value, this.createMath("CSSMathInvert", right));
		}
		return value;
	}
	parseUnary() {
		if (this.matchesSymbol("+")) {
			this.consume();
			return this.parseUnary();
		}
		if (this.matchesSymbol("-")) {
			this.consume();
			return this.createMath("CSSMathNegate", this.parseUnary());
		}
		return this.parsePrimary();
	}
	parsePrimary() {
		const token = this.consume();
		if (token.kind === "number") return createTypedUnitValue(this.win, token.unit ?? "number", token.value);
		if (token.kind === "symbol" && token.value === "(") {
			const value = this.parseSum();
			this.consumeSymbol(")");
			return value;
		}
		if (token.kind === "identifier") return this.parseFunction(token.value);
		throw new SyntaxError("Expected a numeric value");
	}
	parseFunction(name) {
		this.consumeSymbol("(");
		if (name === "calc") {
			const value = this.parseSum();
			this.consumeSymbol(")");
			return value;
		}
		const values = [];
		if (!this.matchesSymbol(")")) {
			values.push(this.parseSum());
			while (this.matchesSymbol(",")) {
				this.consume();
				values.push(this.parseSum());
			}
		}
		this.consumeSymbol(")");
		if (name === "min") {
			if (values.length === 0) throw new SyntaxError("min() requires a value");
			return this.createMath("CSSMathMin", ...values);
		}
		if (name === "max") {
			if (values.length === 0) throw new SyntaxError("max() requires a value");
			return this.createMath("CSSMathMax", ...values);
		}
		if (name === "clamp") {
			if (values.length !== 3) throw new SyntaxError("clamp() requires three values");
			return this.createMath("CSSMathClamp", values[0], values[1], values[2]);
		}
		throw new SyntaxError(`Unsupported function "${name}"`);
	}
};
/**
* Парсит строку CSS-выражения в Typed OM дерево
*/
var parseToTypedOM = (cssValue, win) => {
	try {
		return new NumericTypedOMParser(tokenizeNumericCSS(cssValue), win).parse();
	} catch {
		return null;
	}
};
var hasTypedOM = typeof CSSStyleValue !== "undefined" && typeof CSSUnitValue !== "undefined";
var isUnitValue = (val) => hasTypedOM && val instanceof CSSUnitValue;
var setPropertyIfNotEqual = (styleRef, kebab, value, importance = "") => {
	if (!styleRef || !kebab) return;
	if (value == null) {
		if (styleRef.getPropertyValue(kebab) !== "") styleRef.removeProperty(kebab);
		return;
	}
	if (styleRef.getPropertyValue(kebab) !== value) styleRef.setProperty(kebab, value, importance);
};
/**
* Улучшенная версия с парсингом Typed OM выражений
*/
var setStylePropertyTyped = (element, name, value, importance = "") => {
	if (!element || !name) return element;
	const kebab = camelToKebab(name);
	const styleRef = element.style;
	const styleMapRef = element.attributeStyleMap ?? element.styleMap;
	if (!hasTypedOM || !styleMapRef) return setStylePropertyFallback(element, name, value, importance);
	const win = element.ownerDocument?.defaultView ?? globalThis;
	let val = hasValue(value) && isReactiveStyleValue(value) ? value.value : value;
	if (val == null) {
		styleMapRef.delete?.(kebab);
		if (styleRef) setPropertyIfNotEqual(styleRef, kebab, null, importance);
		return element;
	}
	if (isNativeCSSStyleValue(val)) {
		const old = styleMapRef.get(kebab);
		if (isUnitValue(val) && isUnitValue(old)) {
			if (old.value === val.value && old.unit === val.unit) return element;
		} else if (old === val) return element;
		styleMapRef.set(kebab, val);
		return element;
	}
	if (typeof val === "number") {
		if (CSS?.number && !kebab.startsWith("--")) {
			const newVal = CSS.number(val);
			const old = styleMapRef.get(kebab);
			if (isUnitValue(old) && old.value === newVal.value && old.unit === newVal.unit) return element;
			styleMapRef.set(kebab, newVal);
			return element;
		} else {
			setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
			return element;
		}
	}
	if (typeof val === "string") {
		if (/\b(calc|min|max|clamp)\s*\(/.test(val)) {
			const parsed = parseToTypedOM(val, win);
			if (parsed) try {
				styleMapRef.set(kebab, parsed);
				return element;
			} catch {}
		}
		const maybeNum = tryStringAsNumber(val);
		if (typeof maybeNum === "number" && CSS?.number && !kebab.startsWith("--")) {
			const newVal = CSS.number(maybeNum);
			const old = styleMapRef.get(kebab);
			if (isUnitValue(old) && old.value === newVal.value && old.unit === newVal.unit) return element;
			styleMapRef.set(kebab, newVal);
			return element;
		}
		setPropertyIfNotEqual(styleRef, kebab, val, importance);
		return element;
	}
	setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
	return element;
};
var setStylePropertyFallback = (element, name, value, importance = "") => {
	if (!element || !name) return element;
	const kebab = camelToKebab(name);
	const styleRef = element.style;
	if (!styleRef) return element;
	let val = hasValue(value) && isReactiveStyleValue(value) ? value.value : value;
	if (typeof val === "string" && !isNativeCSSStyleValue(val)) val = tryStringAsNumber(val) ?? val;
	if (val == null) {
		setPropertyIfNotEqual(styleRef, kebab, null, importance);
		return element;
	}
	if (isNativeCSSStyleValue(val)) {
		setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
		return element;
	}
	if (typeof val === "number") {
		setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
		return element;
	}
	setPropertyIfNotEqual(styleRef, kebab, String(val), importance);
	return element;
};
var setStyleProperty = (element, name, value, importance = "") => {
	return hasTypedOM ? setStylePropertyTyped(element, name, value, importance) : setStylePropertyFallback(element, name, value, importance);
};
var loadStyleSheet = (inline, base, layer = "", integrity) => {
	const load = fetchAndCache(inline);
	const url = typeof inline == "string" ? URL.canParse(inline) ? inline : load : load;
	if (base?.[0]) base[0].fetchPriority = "high";
	if (base && url && typeof url == "string") setStyleURL(base, url, layer);
	if (base?.[0] && (!URL.canParse(inline) || integrity) && base?.[0] instanceof HTMLLinkElement) {}
	return promiseOrDirect(load, (res) => {
		if (base?.[0] && res) {
			setStyleURL(base, res, layer);
			base?.[0].setAttribute("loaded", "");
		}
	})?.catch?.((error) => {
		console.warn("Failed to load style sheet:", error);
	});
};
var loadBlobStyle = (inline) => {
	const style = typeof document != "undefined" ? document.createElement("link") : null;
	if (style) style.fetchPriority = "high";
	if (style) {
		Object.assign(style, {
			rel: "stylesheet",
			type: "text/css",
			crossOrigin: "same-origin"
		});
		style.dataset.owner = OWNER;
		loadStyleSheet(inline, [style, "href"]);
		typeof document != "undefined" && document.head.append(style);
		return style;
	}
	return null;
};
var loadInlineStyle = (inline, rootElement = typeof document != "undefined" ? document?.head : null, layer = "") => {
	const PLACE = rootElement?.querySelector?.("head") ?? rootElement;
	if (typeof HTMLHeadElement != "undefined" && PLACE instanceof HTMLHeadElement) return loadBlobStyle(inline);
	const style = typeof document != "undefined" ? document.createElement("style") : null;
	if (style) {
		style.dataset.owner = OWNER;
		loadStyleSheet(inline, [style, "innerHTML"], layer);
		PLACE?.prepend?.(style);
		return style;
	}
	return null;
};
var setProperty = (target, name, value, importance = "") => {
	return setStyleProperty(target, name, value, importance);
};
var preloadStyle = (styles) => {
	return loadAsAdopted(styles, "");
};
var adoptedMapSymbol = Symbol.for("dom.ts@adoptedMap");
var adoptedMap = globalThis[adoptedMapSymbol] ??= /* @__PURE__ */ new Map();
var adoptedBlobMapSymbol = Symbol.for("dom.ts@adoptedBlobMap");
var adoptedBlobMap = globalThis[adoptedBlobMapSymbol] ??= /* @__PURE__ */ new WeakMap();
var layerCounterSymbol = Symbol.for("dom.ts@layerCounter");
globalThis[layerCounterSymbol] ??= 0;
var applyAdoptedStyleText = (sheet, cssText) => {
	if (!sheet || !cssText) return false;
	try {
		sheet.replaceSync(cssText);
		return true;
	} catch (error) {
		const message = String(error?.message || "").toLowerCase();
		if (!(message.includes("@import rules are not allowed") || message.includes("@import") && message.includes("not allowed"))) console.warn("[DOM] Failed to apply adopted stylesheet:", error);
		return false;
	}
};
var loadAsAdopted = (styles, layerName = null) => {
	if (!supportsConstructableStylesheet()) {
		if (typeof styles === "string") loadInlineStyle(styles, void 0, layerName || "");
		return null;
	}
	if (typeof styles === "string" && cssTextRequiresInlineStyleElement(styles)) {
		loadInlineStyle(styles, void 0, layerName || "");
		return null;
	}
	if (typeof styles == "string" && adoptedMap?.has?.(styles)) {
		const cached = adoptedMap.get(styles);
		if (typeof document !== "undefined" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(cached)) document.adoptedStyleSheets.push(cached);
		return cached;
	}
	if ((styles instanceof Blob || styles instanceof File) && adoptedBlobMap?.has?.(styles)) {
		const cached = adoptedBlobMap.get(styles);
		if (typeof document !== "undefined" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(cached)) document.adoptedStyleSheets.push(cached);
		return cached;
	}
	if (!styles) return null;
	const sheet = typeof styles == "string" ? adoptedMap.getOrInsertComputed(styles, (styles) => new CSSStyleSheet()) : adoptedBlobMap.getOrInsertComputed(styles, (styles) => new CSSStyleSheet());
	if (typeof document != "undefined" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(sheet)) document.adoptedStyleSheets.push(sheet);
	if (typeof styles == "string" && !URL.canParse(styles)) {
		const layerWrapped = layerName ? `@layer ${layerName} { ${styles} }` : styles;
		adoptedMap.set(styles, sheet);
		if (!applyAdoptedStyleText(sheet, layerWrapped)) {
			removeAdopted(sheet);
			adoptedMap.delete(styles);
			loadInlineStyle(styles);
		}
		return sheet;
	} else promiseOrDirect(fetchAsInline(styles), (cached) => {
		adoptedMap.set(cached, sheet);
		if (cached) {
			if (cssTextRequiresInlineStyleElement(cached)) {
				removeAdopted(sheet);
				adoptedMap.delete(cached);
				adoptedBlobMap.delete(styles);
				loadInlineStyle(cached, void 0, layerName || "");
				return sheet;
			}
			const layerWrapped = layerName ? `@layer ${layerName} { ${cached} }` : cached;
			if (!applyAdoptedStyleText(sheet, layerWrapped)) {
				removeAdopted(sheet);
				adoptedMap.delete(cached);
				adoptedBlobMap.delete(styles);
				loadInlineStyle(cached, void 0, layerName || "");
			}
			return sheet;
		}
	});
	return sheet;
};
var removeAdopted = (sheet) => {
	if (!sheet) return false;
	const target = typeof sheet === "string" ? adoptedMap.get(sheet) : sheet;
	if (!target || typeof document === "undefined") return false;
	const sheets = document.adoptedStyleSheets;
	const idx = sheets.indexOf(target);
	if (idx !== -1) {
		sheets.splice(idx, 1);
		return true;
	}
	return false;
};
var getPropertyValue = (src, name) => {
	if ("computedStyleMap" in src) {
		const val = src?.computedStyleMap?.()?.get(name);
		return val instanceof CSSUnitValue ? val?.value || 0 : val?.toString?.();
	}
	if (src instanceof HTMLElement) {
		const cs = getComputedStyle?.(src, "");
		return parseFloat(cs?.getPropertyValue?.(name)?.replace?.("px", "")) || 0;
	}
	return parseFloat((src?.style ?? src).getPropertyValue?.(name)?.replace?.("px", "")) || 0;
};
var getPadding = (src, axis) => {
	if (axis == "inline") return getPropertyValue(src, "padding-inline-start") + getPropertyValue(src, "padding-inline-end");
	return getPropertyValue(src, "padding-block-start") + getPropertyValue(src, "padding-block-end");
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/Behavior.ts
var boundBehaviors = /* @__PURE__ */ new WeakMap();
var bindBehavior = (element, behSet, behavior) => {
	new WeakRef(element);
	if (!behSet.has(behavior)) behSet.add(behavior);
	return element;
};
var reflectBehaviors = (element, behaviors) => {
	if (!element) return;
	if (behaviors) {
		const behSet = boundBehaviors.getOrInsert(element, /* @__PURE__ */ new Set());
		[...behaviors?.values?.() || []].map((e) => bindBehavior(element, behSet, e));
	}
	return element;
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/Store.ts
var namedStoreMapsSymbol = Symbol.for("dom.ts@namedStoreMaps");
var namedStoreMaps = globalThis[namedStoreMapsSymbol] ??= /* @__PURE__ */ new Map();
var getStoresOfElement = (map, element) => {
	const E = [...map.entries() || []];
	return new Map(E?.map?.(([n, m]) => [n, m?.get?.(element)])?.filter?.(([n, e]) => !!e) || []);
};
var isWeakCompatible = (element) => {
	return (typeof element == "object" || typeof element == "function") && element != null;
};
var bindStore = (element, name, obj) => {
	if (!isWeakCompatible(element) && element != null) return element;
	let weakMap = namedStoreMaps.get(name);
	if (!weakMap) {
		weakMap = /* @__PURE__ */ new WeakMap();
		namedStoreMaps.set(name, weakMap);
	}
	if (!weakMap.has(element) && element != null) weakMap.set(element, obj);
	return element;
};
var reflectStores = (element, stores) => {
	if (!element || !stores) return;
	for (const [name, obj] of stores.entries()) bindStore(element, name, obj);
	return element;
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/Mixins.ts
var reflectMixins = (element, mixins) => {
	if (!element) return;
	if (mixins) {
		const mixinSet = boundMixinSet?.get?.(element) ?? /* @__PURE__ */ new WeakSet();
		if (!boundMixinSet?.has?.(element)) boundMixinSet?.set?.(element, mixinSet);
		[...mixins?.values?.() || []].map((e) => bindMixins(element, e, mixinSet));
	}
	return element;
};
var getElementRelated = (element) => {
	return {
		storeSet: getStoresOfElement(namedStoreMaps, element),
		mixinSet: boundMixinSet?.get?.(element),
		behaviorSet: boundBehaviors?.get?.(element)
	};
};
var bindMixins = (element, mixin, mixSet) => {
	const wel = new WeakRef(element);
	mixSet ||= boundMixinSet?.get?.(element);
	if (!mixSet?.has?.(mixin)) {
		mixSet?.add?.(mixin);
		mixinElements?.get?.(mixin)?.add?.(element);
		if (mixin.name) element?.setAttribute?.("data-mixin", [...element?.getAttribute?.("data-mixin")?.split?.(" ") || [], mixin.name].filter((n) => !!n).join(" "));
		mixin?.connect?.(wel, mixin, getElementRelated(element));
	}
	return element;
};
var boundMixinSetSymbol = Symbol.for("dom.ts@boundMixinSet");
var boundMixinSet = globalThis[boundMixinSetSymbol] ??= /* @__PURE__ */ new WeakMap();
var mixinElementsSymbol = Symbol.for("dom.ts@mixinElements");
var mixinElements = globalThis[mixinElementsSymbol] ??= /* @__PURE__ */ new WeakMap();
var mixinRegistrySymbol = Symbol.for("dom.ts@mixinRegistry");
var mixinRegistry = globalThis[mixinRegistrySymbol] ??= /* @__PURE__ */ new Map();
var mixinNamespaceSymbol = Symbol.for("dom.ts@mixinNamespace");
var mixinNamespace = globalThis[mixinNamespaceSymbol] ??= /* @__PURE__ */ new WeakMap();
var updateMixinAttributes = (element, mixin) => {
	if (typeof mixin == "string") mixin = mixinRegistry?.get?.(mixin);
	const names = /* @__PURE__ */ new Set([...element?.getAttribute?.("data-mixin")?.split?.(" ") || []]);
	const mixins = new Set([...names].map((n) => mixinRegistry?.get?.(n)).filter((m) => !!m));
	const mixinSet = boundMixinSet?.get?.(element) ?? /* @__PURE__ */ new WeakSet();
	if (!mixinElements?.has?.(mixin)) mixinElements?.set?.(mixin, /* @__PURE__ */ new WeakSet());
	if (!boundMixinSet?.has?.(element)) boundMixinSet?.set?.(element, mixinSet);
	const wel = new WeakRef(element);
	if (!mixinSet?.has?.(mixin)) {
		if (!mixins.has(mixin)) mixin?.disconnect?.(wel, mixin, getElementRelated(element));
		if (mixins.has(mixin) || !mixinElements?.get?.(mixin)?.has?.(element)) {
			mixin?.connect?.(wel, mixin, getElementRelated(element));
			names.add(mixinNamespace?.get?.(mixin));
			mixinSet?.add?.(mixin);
			element?.setAttribute?.("data-mixin", [...names].filter((n) => !!n).join(" "));
		}
		mixinElements?.get?.(mixin)?.add?.(element);
	}
	if (mixinSet?.has?.(mixin)) {
		if (!mixins.has(mixin)) {
			mixinSet?.delete?.(mixin);
			mixin?.disconnect?.(wel, mixin, getElementRelated(element));
		}
	}
};
var roots = /* @__PURE__ */ new Set();
var addRoot = (root = typeof document != "undefined" ? document : null) => {
	if (!root) return;
	if (!roots?.has?.(root)) {
		roots?.add?.(root);
		observeAttributeBySelector(root, "*", "data-mixin", (mutation) => updateAllMixins(mutation.target));
		observeBySelector(root, "[data-mixin]", (mutation) => {
			for (const element of mutation.addedNodes) if (element instanceof HTMLElement) updateAllMixins(element);
		});
	}
	return root;
};
var updateAllMixins = (element) => {
	const names = /* @__PURE__ */ new Set([...element?.getAttribute?.("data-mixin")?.split?.(" ") || []]);
	[...new Set([...names].map((n) => mixinRegistry?.get?.(n)).filter((m) => !!m))].map?.((m) => updateMixinAttributes(element, m));
};
var updateMixinAttributesAll = (elements, mixin) => {
	elements.forEach((e) => mixin ? updateMixinAttributes(e, mixin) : updateAllMixins(e));
};
var updateMixinAttributesAllInRoots = (mixin) => {
	for (const root of roots) updateMixinAttributesAll(root?.querySelectorAll?.("[data-mixin]"), mixin);
};
var nameRegistryF = new FinalizationRegistry((key) => {
	mixinRegistry?.delete?.(key);
});
var registerMixin = (name, mixin) => {
	if (!mixinNamespace?.has?.(mixin)) {
		const key = name?.trim?.();
		if (key) {
			mixinNamespace?.set?.(mixin, key);
			mixinRegistry?.set?.(key, mixin);
			nameRegistryF?.register?.(mixin, key);
			updateMixinAttributesAllInRoots(mixin);
		}
	}
};
addRoot(typeof document != "undefined" ? document : null);
var DOMMixin = class {
	constructor(name = null) {
		if (name) registerMixin(name, this);
	}
	connect(wElement, wSelf, related) {
		return this;
	}
	disconnect(wElement, wSelf, related) {
		return this;
	}
	storeForElement(element) {
		return namedStoreMaps.get(this.name || "")?.get?.(element);
	}
	relatedForElement(element) {
		return getElementRelated(element);
	}
	get elements() {
		return mixinElements?.get?.(this);
	}
	get storage() {
		return namedStoreMaps?.get?.(this.name || "");
	}
	get name() {
		return mixinNamespace?.get?.(this);
	}
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/Handler.ts
var handleHidden = (element, _, visible) => {
	const $ref = visible;
	if (hasValue(visible)) visible = visible.value;
	const isVisible = (visible = normalizePrimitive(visible)) != null && visible !== false;
	$avoidTrigger($ref, () => {
		if (element instanceof HTMLInputElement) element.hidden = !isVisible;
		else if (isVisible) element?.removeAttribute?.("data-hidden");
		else element?.setAttribute?.("data-hidden", "");
	});
	return element;
};
var handleProperty = (el, prop, val) => {
	if (!(prop = typeof prop == "string" ? kebabToCamel(prop) : prop) || !el || [
		"style",
		"dataset",
		"attributeStyleMap",
		"styleMap",
		"computedStyleMap"
	].indexOf(prop || "") != -1) return el;
	const $ref = val;
	if (hasValue(val)) val = val.value;
	if (el?.[prop] === val) return el;
	if (el?.[prop] !== val) $avoidTrigger($ref, () => {
		if (val != null) el[prop] = val;
		else delete el[prop];
	});
	return el;
};
var handleDataset = (el, prop, val) => {
	const datasetRef = el?.dataset;
	if (!prop || !el || !datasetRef) return el;
	const $ref = val;
	if (hasValue(val)) val = val?.value;
	prop = kebabToCamel(prop);
	if (datasetRef?.[prop] === (val = normalizePrimitive(val))) return el;
	if (val == null || val === false) delete datasetRef[prop];
	else $avoidTrigger($ref, () => {
		if (typeof val != "object" && typeof val != "function") datasetRef[prop] = String(val);
		else delete datasetRef[prop];
	});
	return el;
};
var deleteStyleProperty = (el, name) => el.style.removeProperty(camelToKebab(name));
var handleStyleChange = (el, prop, val) => {
	const styleRef = el?.style;
	if (!prop || typeof prop != "string" || !el || !styleRef) return el;
	$avoidTrigger(val, () => {
		if (isVal(val) || hasValue(val) || isValueUnit(val)) setStyleProperty(el, prop, val);
		else if (val == null) deleteStyleProperty(el, prop);
	});
	return el;
};
var handleAttribute = (el, prop, val) => {
	if (!prop || !el) return el;
	const $ref = val;
	if (hasValue(val)) val = val.value;
	prop = camelToKebab(prop);
	if (el?.getAttribute?.(prop) === (val = normalizePrimitive(val))) return el;
	$avoidTrigger($ref, () => {
		if (typeof val != "object" && typeof val != "function" && val != null && (typeof val == "boolean" ? val == true : true)) el?.setAttribute?.(prop, String(val));
		else el?.removeAttribute?.(prop);
	});
	return el;
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/junction/types.ts
function junctionToBox(a, b) {
	const left = Math.min(a.x, b.x);
	const top = Math.min(a.y, b.y);
	const right = Math.max(a.x, b.x);
	const bottom = Math.max(a.y, b.y);
	return {
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top
	};
}
var JUNCTION_SELECT_EVENTS = {
	start: "junction-select:start",
	move: "junction-select:move",
	end: "junction-select:end",
	cancel: "junction-select:cancel"
};
var JUNCTION_DRAG_EVENTS = {
	start: "junction-drag:start",
	move: "junction-drag:move",
	end: "junction-drag:end"
};
var JUNCTION_RESIZE_EVENTS = {
	start: "junction-resize:start",
	move: "junction-resize:move",
	end: "junction-resize:end"
};
//#endregion
//#region ../../modules/projects/dom.ts/src/mixin/junction/JunctionMixins.ts
/**
* Junction-based DOM mixins: selection (A/B), drag, resize.
*/
var mixinDisposersSymbol = Symbol.for("dom.ts@mixinDisposers");
var mixinDisposers = globalThis[mixinDisposersSymbol] ??= /* @__PURE__ */ new WeakMap();
var pushDisposable = (host, mixinName, fn) => {
	const map = mixinDisposers.get(host) ?? /* @__PURE__ */ new Map();
	const list = map.get(mixinName) ?? [];
	list.push(fn);
	map.set(mixinName, list);
	mixinDisposers.set(host, map);
};
var runDisposers = (host, mixinName) => {
	const map = mixinDisposers.get(host);
	const list = map?.get(mixinName);
	if (!list) return;
	for (const fn of list) try {
		fn();
	} catch {}
	map.delete(mixinName);
	if (map.size === 0) mixinDisposers.delete(host);
};
var parsePxVar = (host, name) => {
	const raw = globalThis.getComputedStyle?.(host)?.getPropertyValue?.(name)?.trim?.() ?? "";
	const n = parseFloat(raw);
	return Number.isFinite(n) ? n : 0;
};
var queryHandle = (host, attr, fallback) => {
	const sel = host.getAttribute(attr)?.trim();
	if (!sel) return fallback;
	const found = host.querySelector(sel);
	return found instanceof HTMLElement ? found : fallback;
};
var JunctionSelectMixin = class extends DOMMixin {
	constructor() {
		super("ui-junction-select");
	}
	connect(wEl) {
		const host = wEl?.deref?.();
		if (!host) return this;
		const overlay = document.createElement("div");
		overlay.className = "ui-junction-select-overlay";
		overlay.setAttribute("data-junction-overlay", "");
		overlay.style.cssText = "position:absolute;pointer-events:none;z-index:9999;box-sizing:border-box;border:1px dashed color-mix(in oklab, #3794ff 70%, transparent);background:color-mix(in oklab, #3794ff 14%, transparent);display:none;inset:auto;min-width:0;min-height:0;";
		const ensurePositioned = () => {
			if ((globalThis.getComputedStyle?.(host))?.position === "static") host.style.position = "relative";
		};
		ensurePositioned();
		host.appendChild(overlay);
		let active = false;
		let a = {
			x: 0,
			y: 0
		};
		let b = {
			x: 0,
			y: 0
		};
		const localPoint = (ev) => {
			const r = host.getBoundingClientRect();
			return {
				x: ev.clientX - r.left,
				y: ev.clientY - r.top
			};
		};
		const applyOverlay = () => {
			const box = junctionToBox(a, b);
			if (box.width < 1 && box.height < 1) {
				overlay.style.display = "none";
				return;
			}
			overlay.style.display = "block";
			overlay.style.left = `${box.left}px`;
			overlay.style.top = `${box.top}px`;
			overlay.style.width = `${box.width}px`;
			overlay.style.height = `${box.height}px`;
		};
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			if (ev.target?.closest?.("[data-junction-ignore-select], [data-junction-drag-handle], [data-junction-resize-handle], button, a, input, textarea, select")) return;
			if (!(ev.target === host || host.contains(ev.target))) return;
			active = true;
			a = localPoint(ev);
			b = { ...a };
			host.setPointerCapture(ev.pointerId);
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.start, {
				bubbles: true,
				detail: {
					a: { ...a },
					b: { ...b },
					host
				}
			}));
			applyOverlay();
		};
		const onMove = (ev) => {
			if (!active) return;
			b = localPoint(ev);
			applyOverlay();
			const box = junctionToBox(a, b);
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.move, {
				bubbles: true,
				detail: {
					a: { ...a },
					b: { ...b },
					box,
					host
				}
			}));
		};
		const end = (ev) => {
			if (!active) return;
			active = false;
			try {
				host.releasePointerCapture(ev.pointerId);
			} catch {}
			const box = junctionToBox(a, b);
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.end, {
				bubbles: true,
				detail: {
					a: { ...a },
					b: { ...b },
					box,
					host
				}
			}));
		};
		const onUp = (ev) => {
			if (!active) return;
			end(ev);
		};
		const onCancel = (ev) => {
			if (!active) return;
			active = false;
			overlay.style.display = "none";
			try {
				host.releasePointerCapture(ev.pointerId);
			} catch {}
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.cancel, {
				bubbles: true,
				detail: { host }
			}));
		};
		pushDisposable(host, "ui-junction-select", () => {
			overlay.remove();
		});
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointerdown", onDown));
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointermove", onMove));
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointerup", onUp));
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointercancel", onCancel));
		return this;
	}
	disconnect(wEl) {
		const host = wEl?.deref?.();
		if (host) runDisposers(host, "ui-junction-select");
		return this;
	}
};
var JunctionDragMixin = class extends DOMMixin {
	constructor() {
		super("ui-junction-drag");
	}
	connect(wEl) {
		const host = wEl?.deref?.();
		if (!host) return this;
		setStyleProperty(host, "--jx-drag-x", parsePxVar(host, "--jx-drag-x"));
		setStyleProperty(host, "--jx-drag-y", parsePxVar(host, "--jx-drag-y"));
		const previousTransform = host.style.transform;
		if (!host.style.transform || host.style.transform === "none") host.style.transform = "translate3d(calc(var(--jx-drag-x, 0) * 1px), calc(var(--jx-drag-y, 0) * 1px), 0)";
		const handle = queryHandle(host, "data-junction-drag-handle", host);
		let dragging = false;
		let startX = 0;
		let startY = 0;
		let baseX = 0;
		let baseY = 0;
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			if (ev.target !== handle && !handle.contains(ev.target)) return;
			dragging = true;
			startX = ev.clientX;
			startY = ev.clientY;
			baseX = parsePxVar(host, "--jx-drag-x");
			baseY = parsePxVar(host, "--jx-drag-y");
			handle.setPointerCapture(ev.pointerId);
			host.dispatchEvent(new CustomEvent(JUNCTION_DRAG_EVENTS.start, {
				bubbles: true,
				detail: {
					host,
					clientX: ev.clientX,
					clientY: ev.clientY,
					baseX,
					baseY
				}
			}));
		};
		const onMove = (ev) => {
			if (!dragging) return;
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			const nx = baseX + dx;
			const ny = baseY + dy;
			setStyleProperty(host, "--jx-drag-x", nx);
			setStyleProperty(host, "--jx-drag-y", ny);
			host.dispatchEvent(new CustomEvent(JUNCTION_DRAG_EVENTS.move, {
				bubbles: true,
				detail: {
					host,
					dx,
					dy,
					x: nx,
					y: ny
				}
			}));
		};
		const onUp = (ev) => {
			if (!dragging) return;
			dragging = false;
			try {
				handle.releasePointerCapture(ev.pointerId);
			} catch {}
			host.dispatchEvent(new CustomEvent(JUNCTION_DRAG_EVENTS.end, {
				bubbles: true,
				detail: {
					host,
					x: parsePxVar(host, "--jx-drag-x"),
					y: parsePxVar(host, "--jx-drag-y")
				}
			}));
		};
		pushDisposable(host, "ui-junction-drag", () => {
			host.style.transform = previousTransform;
		});
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointerdown", onDown));
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointermove", onMove));
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointerup", onUp));
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointercancel", onUp));
		return this;
	}
	disconnect(wEl) {
		const host = wEl?.deref?.();
		if (host) runDisposers(host, "ui-junction-drag");
		return this;
	}
};
var JunctionResizeMixin = class extends DOMMixin {
	constructor() {
		super("ui-junction-resize");
	}
	connect(wEl) {
		const host = wEl?.deref?.();
		if (!host) return this;
		const handle = queryHandle(host, "data-junction-resize-handle", host);
		let resizing = false;
		let sx = 0;
		let sy = 0;
		let sw = 0;
		let sh = 0;
		const minW = Math.max(120, parseFloat(host.getAttribute("data-junction-resize-min-w") || "") || 120);
		const minH = Math.max(80, parseFloat(host.getAttribute("data-junction-resize-min-h") || "") || 80);
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			if (ev.target !== handle && !handle.contains(ev.target)) return;
			resizing = true;
			sx = ev.clientX;
			sy = ev.clientY;
			sw = host.offsetWidth;
			sh = host.offsetHeight;
			handle.setPointerCapture(ev.pointerId);
			host.dispatchEvent(new CustomEvent(JUNCTION_RESIZE_EVENTS.start, {
				bubbles: true,
				detail: {
					host,
					width: sw,
					height: sh
				}
			}));
		};
		const onMove = (ev) => {
			if (!resizing) return;
			const nw = Math.max(minW, sw + (ev.clientX - sx));
			const nh = Math.max(minH, sh + (ev.clientY - sy));
			host.style.width = `${nw}px`;
			host.style.height = `${nh}px`;
			host.dispatchEvent(new CustomEvent(JUNCTION_RESIZE_EVENTS.move, {
				bubbles: true,
				detail: {
					host,
					width: nw,
					height: nh
				}
			}));
		};
		const onUp = (ev) => {
			if (!resizing) return;
			resizing = false;
			try {
				handle.releasePointerCapture(ev.pointerId);
			} catch {}
			host.dispatchEvent(new CustomEvent(JUNCTION_RESIZE_EVENTS.end, {
				bubbles: true,
				detail: {
					host,
					width: host.offsetWidth,
					height: host.offsetHeight
				}
			}));
		};
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointerdown", onDown));
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointermove", onMove));
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointerup", onUp));
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointercancel", onUp));
		return this;
	}
	disconnect(wEl) {
		const host = wEl?.deref?.();
		if (host) runDisposers(host, "ui-junction-resize");
		return this;
	}
};
new JunctionSelectMixin();
new JunctionDragMixin();
new JunctionResizeMixin();
//#endregion
export { addEventsList as A, setIdleInterval as B, getCorrectOrientation as C, getBoundingOrientRect as D, fixedClientZoom as E, isInFocus as F, isValidParent as I, makeRAFCycle as L, createElementVanilla as M, indexOf as N, MOCElement as O, isElement as P, setAttributesIfNull as R, fixOrientToScreen as S, whenAnyScreenChanges as T, setProperty as _, handleStyleChange as a, observeAttributeBySelector as b, reflectMixins as c, getAdoptedStyleRule as d, getPadding as f, removeAdopted as g, preloadStyle as h, handleProperty as i, containsOrSelf as j, addEvent as k, reflectStores as l, loadInlineStyle as m, handleDataset as n, DOMMixin as o, loadAsAdopted as p, handleHidden as r, addRoot as s, handleAttribute as t, reflectBehaviors as u, setStyleProperty as v, orientationNumberMap as w, observeBySelector as x, observeAttribute as y, setChecked as z };
