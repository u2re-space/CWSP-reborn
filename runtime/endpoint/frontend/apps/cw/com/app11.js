import { r as normalizeFenceLanguage, t as CODE_LANGUAGE_ATTR } from "../vendor/dompurify.js";
//#region ../../modules/projects/fl.ui/src/ui/markdown/code-overlay.ts
/**
* Visual code overlay locked to a text host (code / textarea / contenteditable).
*
* FIND:code-overlay
* TAG:code-highlight
* WHY: highlight.js must not wrap the selectable source; the overlay is paint-only
* (`pointer-events: none`). Selection stays on the host; CSS Custom Highlight
* mirrors it onto the overlay when `CSS.highlights` exists.
*/
var CODE_SELECTION_HIGHLIGHT = "code-selection";
var METRIC_PROPS = [
	"font-family",
	"font-size",
	"font-weight",
	"font-style",
	"font-stretch",
	"font-variant",
	"font-variant-ligatures",
	"font-variant-numeric",
	"font-variant-caps",
	"font-variant-east-asian",
	"font-feature-settings",
	"font-kerning",
	"font-optical-sizing",
	"font-variation-settings",
	"font-size-adjust",
	"font-language-override",
	"line-height",
	"letter-spacing",
	"word-spacing",
	"tab-size",
	"white-space",
	"white-space-collapse",
	"word-break",
	"overflow-wrap",
	"line-break",
	"hyphens",
	"text-align",
	"text-indent",
	"text-transform",
	"text-rendering",
	"text-wrap",
	"text-wrap-mode",
	"direction",
	"unicode-bidi",
	"-webkit-font-smoothing",
	"-moz-osx-font-smoothing"
];
var hostPaint = /* @__PURE__ */ new Map();
var selectionBound = false;
var supportsAnchorPositioning = () => {
	try {
		const cap = globalThis.Capacitor;
		if (typeof cap?.isNativePlatform === "function" && cap.isNativePlatform()) return false;
		return typeof CSS !== "undefined" && CSS.supports?.("anchor-name: --x") === true && CSS.supports?.("block-size: anchor-size(block)") === true;
	} catch {
		return false;
	}
};
/** Used line-height, never 0px (Capacitor getComputedStyle before layout). */
var usedLineHeight = (style, frozen = "") => {
	const fontSize = parseFloat(style.fontSize);
	const floor = (Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 16) * 1.35;
	const frozenPx = parseFloat(frozen);
	if (Number.isFinite(frozenPx) && frozenPx >= floor * .85) return frozen;
	const px = parseFloat(style.lineHeight);
	const used = Number.isFinite(px) && px >= floor * .85 ? px : floor;
	return `${Math.round(used)}px`;
};
var makeAnchorName = () => `--hl${Math.random().toString(36).slice(2, 10).replace(/[0-9]/g, "x")}`;
/** Pin overlay to the host border box. `inset:0` on `pre` misses `pre` padding — selection drifts. */
var pinOverlayToHost = (host, overlay) => {
	overlay.style.position = "absolute";
	overlay.style.boxSizing = "border-box";
	overlay.style.inset = "auto";
	overlay.style.right = "auto";
	overlay.style.bottom = "auto";
	overlay.style.margin = "0";
	if (host.offsetParent && host.offsetParent === overlay.offsetParent) {
		const top = `${host.offsetTop}px`;
		const left = `${host.offsetLeft}px`;
		const width = `${host.offsetWidth}px`;
		const height = `${host.offsetHeight}px`;
		if (overlay.style.top === top && overlay.style.left === left && overlay.style.width === width && overlay.style.height === height) return;
		overlay.style.top = top;
		overlay.style.left = left;
		overlay.style.width = width;
		overlay.style.height = height;
		return;
	}
	const parent = overlay.parentElement;
	if (!parent) return;
	const parentRect = parent.getBoundingClientRect();
	const hostRect = host.getBoundingClientRect();
	overlay.style.top = `${hostRect.top - parentRect.top + parent.scrollTop}px`;
	overlay.style.left = `${hostRect.left - parentRect.left + parent.scrollLeft}px`;
	overlay.style.width = `${hostRect.width}px`;
	overlay.style.height = `${hostRect.height}px`;
};
/** Leaf overlay: CSS anchors when available, otherwise pin to the host box. */
var placeCodeOverlay = (host, overlay) => {
	overlay.style.pointerEvents = "none";
	overlay.style.userSelect = "none";
	overlay.style.position = "absolute";
	overlay.style.zIndex = "1";
	overlay.style.margin = "0";
	const parent = host.parentElement;
	if (parent && getComputedStyle(parent).position === "static") parent.style.position = "relative";
	if (supportsAnchorPositioning()) {
		const name = makeAnchorName();
		host.style.setProperty("anchor-name", name);
		overlay.style.setProperty("position-anchor", name);
		overlay.style.setProperty("position-area", "span-all");
		overlay.style.setProperty("inset-block-start", "anchor(start)");
		overlay.style.setProperty("inset-inline-start", "anchor(start)");
		overlay.style.setProperty("inset-block-end", "anchor(end)");
		overlay.style.setProperty("inset-inline-end", "anchor(end)");
		overlay.style.setProperty("inline-size", "anchor-size(inline)");
		overlay.style.setProperty("block-size", "anchor-size(block)");
		host.after(overlay);
		return;
	}
	host.after(overlay);
	pinOverlayToHost(host, overlay);
};
var watchHostRemoval = (host, onGone) => {
	let observer = null;
	const bind = () => {
		if (observer || !host.isConnected) return;
		observer = new MutationObserver(() => {
			if (host.isConnected) return;
			observer?.disconnect();
			observer = null;
			onGone();
		});
		observer.observe(host.parentElement ?? document.documentElement, {
			childList: true,
			subtree: true
		});
	};
	if (host.isConnected) bind();
	else {
		queueMicrotask(bind);
		requestAnimationFrame(bind);
	}
	return () => observer?.disconnect();
};
var highlightsRegistry = () => {
	const cap = globalThis.Capacitor;
	if (typeof cap?.isNativePlatform === "function" && cap.isNativePlatform()) return null;
	return globalThis.CSS?.highlights ?? null;
};
var collectTextNodes = (root) => {
	const nodes = [];
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let current = walker.nextNode();
	while (current) {
		nodes.push(current);
		current = walker.nextNode();
	}
	return nodes;
};
var rangeOffsetsIn = (root, range) => {
	if (!root.contains(range.commonAncestorContainer) && range.commonAncestorContainer !== root) return null;
	const prefix = document.createRange();
	prefix.selectNodeContents(root);
	prefix.setEnd(range.startContainer, range.startOffset);
	const start = prefix.toString().length;
	return {
		start,
		end: start + range.toString().length
	};
};
var pointAtOffset = (nodes, offset) => {
	let remaining = Math.max(0, offset);
	for (const node of nodes) {
		const length = node.data.length;
		if (remaining <= length) return {
			node,
			offset: remaining
		};
		remaining -= length;
	}
	const last = nodes.at(-1);
	return last ? {
		node: last,
		offset: last.data.length
	} : null;
};
var hostSelectionOffsets = (host) => {
	if (host instanceof HTMLTextAreaElement) {
		if (document.activeElement !== host) return null;
		const start = host.selectionStart ?? 0;
		const end = host.selectionEnd ?? start;
		return start === end ? null : {
			start,
			end
		};
	}
	const selection = document.getSelection();
	if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
	return rangeOffsetsIn(host, selection.getRangeAt(0));
};
var syncCodeSelectionHighlight = () => {
	const registry = highlightsRegistry();
	const HighlightCtor = globalThis.Highlight;
	if (!registry || typeof HighlightCtor !== "function") return;
	const ranges = [];
	for (const [host, paint] of hostPaint) {
		if (!host.isConnected || !paint.isConnected) continue;
		const offsets = hostSelectionOffsets(host);
		if (!offsets) continue;
		if ((host.textContent?.length ?? 0) !== (paint.textContent?.length ?? 0)) continue;
		const nodes = collectTextNodes(paint);
		const start = pointAtOffset(nodes, offsets.start);
		const end = pointAtOffset(nodes, offsets.end);
		if (!start || !end) continue;
		const range = document.createRange();
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		ranges.push(range);
	}
	if (!ranges.length) {
		registry.delete(CODE_SELECTION_HIGHLIGHT);
		return;
	}
	registry.set(CODE_SELECTION_HIGHLIGHT, new HighlightCtor(...ranges));
};
var ensureSelectionMirror = () => {
	if (selectionBound || typeof document === "undefined" || !highlightsRegistry()) return;
	selectionBound = true;
	document.addEventListener("selectionchange", syncCodeSelectionHighlight, { passive: true });
};
/** Copy used glyph metrics from `pre > code` (or the text host) onto the overlay. */
var copyCodeMetrics = (source, target, box = false) => {
	const style = getComputedStyle(source);
	const font = style.font;
	if (font) target.style.font = font;
	for (const property of METRIC_PROPS) {
		const value = style.getPropertyValue(property);
		if (value) target.style.setProperty(property, value);
	}
	const lineHeight = usedLineHeight(style, source.style.lineHeight);
	if (source.offsetHeight > 0 && source.style.lineHeight !== lineHeight) source.style.lineHeight = lineHeight;
	target.style.setProperty("line-height", lineHeight);
	(source.parentElement ?? source).style.setProperty("--code-line-height", lineHeight);
	target.style.setProperty("font-synthesis", "none");
	target.style.setProperty("font-weight", "400");
	target.style.setProperty("font-style", "normal");
	target.style.setProperty("font-kerning", "none");
	target.style.setProperty("font-variant-ligatures", "none");
	target.style.setProperty("font-feature-settings", "\"liga\" 0, \"clig\" 0, \"calt\" 0, \"dlig\" 0");
	target.style.setProperty("-webkit-text-fill-color", "currentColor");
	if (box) {
		target.style.boxSizing = "border-box";
		target.style.paddingTop = style.paddingTop;
		target.style.paddingRight = style.paddingRight;
		target.style.paddingBottom = style.paddingBottom;
		target.style.paddingLeft = style.paddingLeft;
	}
};
/**
* Place `overlay` over `host` with matching box + font metrics.
* INVARIANT: overlay never captures pointer or selection.
*/
var attachCodeOverlay = (host, overlay, options = {}) => {
	const paint = options.paint ?? overlay;
	const scroller = options.scroller ?? host.closest("pre") ?? host;
	overlay.classList.add("code-highlight-overlay");
	overlay.setAttribute("aria-hidden", "true");
	overlay.style.pointerEvents = "none";
	overlay.style.userSelect = "none";
	let metricsLocked = false;
	let metricsBusy = false;
	const updateMetrics = (force = false) => {
		if (metricsBusy) return;
		metricsBusy = true;
		try {
			if (!(host.offsetHeight > 0 || host.offsetWidth > 0)) {
				metricsLocked = false;
				return;
			}
			if (force || !metricsLocked) {
				copyCodeMetrics(host, overlay, true);
				if (paint !== overlay) copyCodeMetrics(host, paint, false);
				metricsLocked = parseFloat(host.style.lineHeight) > 0;
			}
			if (!supportsAnchorPositioning()) pinOverlayToHost(host, overlay);
		} finally {
			queueMicrotask(() => {
				metricsBusy = false;
			});
		}
	};
	updateMetrics(true);
	document.fonts?.ready?.then(() => {
		if (host.isConnected) updateMetrics(true);
	});
	const resize = typeof ResizeObserver === "function" ? new ResizeObserver(() => updateMetrics()) : null;
	resize?.observe(host);
	placeCodeOverlay(host, overlay);
	const syncScroll = () => {
		if (scroller === host && host instanceof HTMLTextAreaElement) {
			paint.style.transform = `translate(${-host.scrollLeft}px, ${-host.scrollTop}px)`;
			return;
		}
		if (paint instanceof HTMLElement && "scrollTop" in scroller) {
			paint.scrollTop = scroller.scrollTop;
			paint.scrollLeft = scroller.scrollLeft;
		}
	};
	scroller.addEventListener("scroll", syncScroll, { passive: true });
	host.addEventListener("scroll", syncScroll, { passive: true });
	host.addEventListener("select", syncCodeSelectionHighlight, { passive: true });
	host.addEventListener("keyup", syncCodeSelectionHighlight, { passive: true });
	hostPaint.set(host, paint);
	ensureSelectionMirror();
	let stopWatch = () => void 0;
	const disconnect = () => {
		stopWatch();
		resize?.disconnect();
		hostPaint.delete(host);
		scroller.removeEventListener("scroll", syncScroll);
		host.removeEventListener("scroll", syncScroll);
		host.removeEventListener("select", syncCodeSelectionHighlight);
		host.removeEventListener("keyup", syncCodeSelectionHighlight);
		overlay.remove();
		syncCodeSelectionHighlight();
	};
	stopWatch = watchHostRemoval(host, disconnect);
	return {
		overlay,
		paint,
		updateMetrics,
		syncScroll,
		disconnect
	};
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/markdown/code-editor-keys.ts
/**
* Tab indent + Esc blur for highlighted code fields (Settings CSS/JSON, viewer RAW).
*
* FIND:code-editor-keys
* TAG:code-highlight
* WHY: While the source is focused, Tab must insert spaces (not move chrome).
* Esc blurs and parks focus on the frame so Tab is navigation again; click / tap
* / Enter on the frame re-arms the editor.
*/
var indentUnit = (el) => {
	const n = Number.parseInt(getComputedStyle(el).tabSize || "4", 10);
	return " ".repeat(n === 2 ? 2 : 4);
};
var insertAtCaret = (el, text) => {
	if (el instanceof HTMLTextAreaElement) {
		const start = el.selectionStart ?? 0;
		const end = el.selectionEnd ?? start;
		el.setRangeText(text, start, end, "end");
		el.dispatchEvent(new Event("input", { bubbles: true }));
		return true;
	}
	if (!el.isContentEditable) return false;
	el.focus();
	return document.execCommand("insertText", false, text);
};
var editorFrame = (source) => {
	const frame = source.closest("pre[data-raw-target], .code-highlight-host, pre, [data-raw-target]");
	return frame instanceof HTMLElement ? frame : source;
};
/** Bind Tab / Esc / re-arm on one editable highlight host. */
var bindCodeEditorKeys = (source) => {
	if (!(source instanceof HTMLTextAreaElement || source.isContentEditable)) return () => void 0;
	const frame = editorFrame(source);
	const arm = () => {
		if (source instanceof HTMLTextAreaElement) source.tabIndex = 0;
		if (document.activeElement !== source) source.focus({ preventScroll: true });
	};
	const disarm = () => {
		if (source instanceof HTMLTextAreaElement) source.tabIndex = -1;
		source.blur();
		if (frame !== source) {
			if (!frame.hasAttribute("tabindex")) frame.tabIndex = 0;
			frame.focus({ preventScroll: true });
		}
	};
	const onSourceKey = (event) => {
		if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
		if (event.key === "Escape") {
			event.preventDefault();
			disarm();
			return;
		}
		if (event.key !== "Tab" || event.shiftKey) return;
		event.preventDefault();
		insertAtCaret(source, indentUnit(source));
	};
	const onFrameKey = (event) => {
		if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
		if (document.activeElement === source) return;
		if (event.key !== "Enter") return;
		event.preventDefault();
		arm();
	};
	const onPointerArm = () => {
		arm();
	};
	source.addEventListener("keydown", onSourceKey);
	frame.addEventListener("keydown", onFrameKey);
	frame.addEventListener("pointerdown", onPointerArm);
	return () => {
		source.removeEventListener("keydown", onSourceKey);
		frame.removeEventListener("keydown", onFrameKey);
		frame.removeEventListener("pointerdown", onPointerArm);
		if (source instanceof HTMLTextAreaElement && source.tabIndex < 0) source.tabIndex = 0;
	};
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/markdown/highlight.ts
/**
* highlight.js paint layer for fenced code, textarea, and contenteditable hosts.
*
* FIND:code-highlight
* TAG:code-highlight,safe-markdown-render
* WHY: Source stays plain text (selectable). Overlay is highlight.js HTML + optional
* line gutter, positioned with lure anchors. Language comes from `data-language`
* (markdown fence) or `language-*`.
* AI-READ: Import overlay via `./code-overlay` (same folder). A `../../../../lur.e`
* specifier 500s under Vite `preserveSymlinks` when this file is loaded as
* `fest/fl-ui/ui/markdown/highlight.ts`.
*/
var attached = /* @__PURE__ */ new WeakMap();
var hljsPromise = null;
var loadHljs = () => {
	if (hljsPromise) return hljsPromise;
	hljsPromise = Promise.all([import("../vendor/highlight.js.js"), import("../vendor/highlight2.js.js")]).then(([mod, jsonLang]) => {
		const hljs = mod.default ?? mod;
		if (!hljs.getLanguage("json") && jsonLang && hljs.registerLanguage) hljs.registerLanguage("json", jsonLang.default ?? jsonLang);
		return hljs;
	}).catch((error) => {
		console.warn("[code-highlight] highlight.js failed to load", error);
		return null;
	});
	return hljsPromise;
};
var FILENAME_LANGUAGE = {
	ts: "typescript",
	tsx: "typescript",
	mts: "typescript",
	cts: "typescript",
	js: "javascript",
	jsx: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	json: "json",
	css: "css",
	scss: "scss",
	html: "xml",
	htm: "xml",
	svg: "xml",
	md: "markdown",
	markdown: "markdown",
	py: "python",
	sh: "bash",
	bash: "bash",
	yml: "yaml",
	yaml: "yaml",
	xml: "xml"
};
/** WHY: Viewer raw `</>` is a bare `<pre>`, not a fence — language comes from the file name. */
var languageFromFilename = (pathOrName) => {
	const base = String(pathOrName || "").split(/[?#]/)[0].split(/[/\\]/).pop() || "";
	const dot = base.lastIndexOf(".");
	const ext = dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
	return normalizeFenceLanguage(FILENAME_LANGUAGE[ext] || ext);
};
var resolveCodeLanguage = (el) => {
	const direct = el.getAttribute("data-language") || el.getAttribute("data-lang") || "";
	if (direct) return normalizeFenceLanguage(direct);
	const fromClass = String(el.className || "").match(/(?:^|\s)language-([\w.+#-]+)/);
	if (fromClass?.[1]) return fromClass[1];
	const pre = el.closest("pre");
	return normalizeFenceLanguage(pre?.getAttribute("data-language") || pre?.getAttribute("data-lang"));
};
var stampCodeLanguage = (el, language) => {
	if (!language) return;
	el.setAttribute(CODE_LANGUAGE_ATTR, language);
	el.classList.add(`language-${language}`);
	const pre = el.closest("pre");
	if (pre && !pre.getAttribute("data-language")) pre.setAttribute(CODE_LANGUAGE_ATTR, language);
};
var readHostText = (host) => {
	if (host instanceof HTMLTextAreaElement) return host.value || host.placeholder || "";
	return host.textContent ?? "";
};
var isPlaceholderPaint = (host) => host instanceof HTMLTextAreaElement && !host.value && Boolean(host.placeholder);
var countLines = (text) => {
	if (!text) return 1;
	const parts = text.split("\n");
	return parts.at(-1) === "" ? Math.max(1, parts.length - 1) : parts.length;
};
var escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var highlightText = async (text, language) => {
	const hljs = await loadHljs();
	if (!hljs) return {
		html: escapeHtml(text),
		language
	};
	if (language && hljs.getLanguage(language)) return {
		html: hljs.highlight(text, {
			language,
			ignoreIllegals: true
		}).value,
		language
	};
	const auto = hljs.highlightAuto(text);
	return {
		html: auto.value,
		language: auto.language || language || ""
	};
};
var HighlightRef = globalThis.Highlight;
var cssHighlights = globalThis.CSS?.highlights;
var tokenHighlightBags = /* @__PURE__ */ new Map();
var hostTokenRanges = /* @__PURE__ */ new WeakMap();
var canPaintCssTokenHighlights = () => typeof HighlightRef === "function" && !!cssHighlights;
var tokenHighlightBag = (name) => {
	if (!canPaintCssTokenHighlights() || !HighlightRef || !cssHighlights) return null;
	let bag = tokenHighlightBags.get(name);
	if (!bag) {
		bag = new HighlightRef();
		tokenHighlightBags.set(name, bag);
		cssHighlights.set(name, bag);
	}
	return bag;
};
var collectHostTextNodes = (host) => {
	const out = [];
	const walk = (node) => {
		if (node.nodeType === Node.TEXT_NODE) out.push(node);
		else for (const child of node.childNodes) walk(child);
	};
	walk(host);
	return out;
};
var rangeFromHostOffsets = (nodes, start, end) => {
	if (end <= start || !nodes.length) return null;
	let seen = 0;
	let startNode = null;
	let startOff = 0;
	let endNode = null;
	let endOff = 0;
	for (const node of nodes) {
		const len = node.data.length;
		if (!startNode && start <= seen + len) {
			startNode = node;
			startOff = Math.max(0, start - seen);
		}
		if (end <= seen + len) {
			endNode = node;
			endOff = Math.max(0, end - seen);
			break;
		}
		seen += len;
	}
	if (!startNode || !endNode) return null;
	const range = document.createRange();
	range.setStart(startNode, Math.min(startOff, startNode.data.length));
	range.setEnd(endNode, Math.min(endOff, endNode.data.length));
	return range;
};
var nearestHljsClass = (el) => {
	while (el) {
		const found = Array.from(el.classList).find((name) => name.startsWith("hljs-"));
		if (found) return found;
		el = el.parentElement;
	}
	return "";
};
var clearHostTokenHighlights = (host) => {
	const prev = hostTokenRanges.get(host);
	if (!prev?.length) return;
	for (const range of prev) for (const bag of tokenHighlightBags.values()) try {
		bag.delete(range);
	} catch {}
	hostTokenRanges.set(host, []);
};
/** WHY: Android RAW cannot use overlay (caret X-desync) or innerHTML (plaintext-only). */
var applyCssTokenHighlights = (host, html) => {
	clearHostTokenHighlights(host);
	if (!canPaintCssTokenHighlights() || !html || host instanceof HTMLTextAreaElement) return;
	const wrap = document.createElement("div");
	wrap.innerHTML = html;
	const nodes = collectHostTextNodes(host);
	if (!nodes.length) return;
	const painted = [];
	let offset = 0;
	const walk = (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const len = node.textContent?.length ?? 0;
			const token = nearestHljsClass(node.parentElement);
			if (token && len) {
				const range = rangeFromHostOffsets(nodes, offset, offset + len);
				const bag = range ? tokenHighlightBag(token) : null;
				if (range && bag) {
					bag.add(range);
					painted.push(range);
				}
			}
			offset += len;
			return;
		}
		for (const child of node.childNodes) walk(child);
	};
	walk(wrap);
	hostTokenRanges.set(host, painted);
};
var isCapacitorNative = () => {
	try {
		const cap = globalThis.Capacitor;
		return typeof cap?.isNativePlatform === "function" && cap.isNativePlatform();
	} catch {
		return false;
	}
};
/** WebView / Android caret is measured on the source glyphs, not the overlay. */
var isAndroidCaretHost = () => {
	if (isCapacitorNative()) return true;
	try {
		return /Android/i.test(String(navigator.userAgent || ""));
	} catch {
		return false;
	}
};
var isEditableCodeHost = (host) => host instanceof HTMLTextAreaElement || host.isContentEditable;
var buildOverlay = (lineCount, showGutter) => {
	const overlay = document.createElement("div");
	overlay.className = "code-highlight-overlay";
	let gutter = null;
	if (showGutter) {
		gutter = document.createElement("div");
		gutter.className = "code-highlight-overlay__gutter";
		gutter.textContent = Array.from({ length: lineCount }, (_, index) => String(index + 1)).join("\n");
		overlay.append(gutter);
	}
	const paint = document.createElement("div");
	paint.className = "code-highlight-overlay__paint";
	overlay.append(paint);
	return {
		overlay,
		paint,
		gutter
	};
};
/**
* Attach a highlight.js overlay to one code host.
* Works for `pre > code`, `textarea`, and `contenteditable`.
*/
var attachCodeHighlight = (host, options = {}) => {
	attached.get(host)?.disconnect();
	stampCodeLanguage(host, normalizeFenceLanguage(options.language || resolveCodeLanguage(host)));
	const lineCount = countLines(readHostText(host));
	const showGutter = options.lineNumbers !== false && lineCount > 1;
	const digits = String(lineCount).length;
	(host?.parentElement?.style ?? host.style)?.setProperty("--code-gutter", showGutter ? `calc(${digits} * 1ch + 0.75rem)` : "0px");
	host?.classList?.add("code-highlight-source");
	host.style.whiteSpace = "pre";
	host.style.wordBreak = "normal";
	host.style.overflowWrap = "normal";
	if (!(host instanceof HTMLTextAreaElement)) {
		host.style.display = "block";
		host.style.backgroundColor = "transparent";
	}
	const editable = isEditableCodeHost(host);
	const sourceOnly = isAndroidCaretHost() && editable;
	const inplace = isCapacitorNative() && !editable;
	if (inplace) host.classList.add("code-highlight-inplace");
	if (sourceOnly) host.classList.add("code-highlight-source-only");
	const { overlay, paint, gutter } = buildOverlay(lineCount, showGutter);
	if (inplace || sourceOnly) paint.remove();
	const handle = !sourceOnly && (showGutter || !inplace) ? attachCodeOverlay(host, overlay, {
		paint: inplace ? overlay : paint,
		scroller: host instanceof HTMLTextAreaElement ? host : host.closest("pre")
	}) : null;
	if (sourceOnly) {
		overlay.remove();
		(host.parentElement?.style ?? host.style).setProperty("--code-gutter", "0px");
	}
	const updatePaint = async () => {
		if (sourceOnly) {
			host.classList.remove("code-highlight-painted");
			const nextLanguage = normalizeFenceLanguage(options.language || resolveCodeLanguage(host));
			stampCodeLanguage(host, nextLanguage);
			const painted = await highlightText(readHostText(host), nextLanguage);
			if (painted.language && painted.language !== nextLanguage) stampCodeLanguage(host, painted.language);
			applyCssTokenHighlights(host, painted.html);
			return;
		}
		const next = readHostText(host);
		const nextLanguage = normalizeFenceLanguage(options.language || resolveCodeLanguage(host));
		const nextLines = countLines(next);
		const nextGutter = options.lineNumbers !== false && nextLines > 1;
		(host?.parentElement?.style ?? host.style)?.setProperty("--code-gutter", nextGutter ? `calc(${String(nextLines).length} * 1ch + 0.75rem)` : "0px");
		if (gutter) {
			gutter.textContent = Array.from({ length: nextLines }, (_, index) => String(index + 1)).join("\n");
			gutter.hidden = !nextGutter;
		}
		const painted = await highlightText(next, nextLanguage);
		if (painted.language && painted.language !== nextLanguage) stampCodeLanguage(host, painted.language);
		const target = inplace ? host : paint;
		target.innerHTML = painted.html;
		if (next && (target.textContent?.length ?? 0) < Math.max(1, Math.floor(next.length * .5))) target.textContent = next;
		host.classList.toggle("code-highlight-painted", !inplace && (paint.textContent?.length ?? 0) > 0);
		host.classList.toggle("code-highlight-placeholder", isPlaceholderPaint(host));
		handle?.updateMetrics();
		handle?.syncScroll();
	};
	const onInput = () => {
		updatePaint();
	};
	host.addEventListener("input", onInput);
	const unbindKeys = bindCodeEditorKeys(host);
	const wrapped = {
		overlay: handle?.overlay ?? overlay,
		paint: inplace ? host : paint,
		updateMetrics: handle?.updateMetrics ?? (() => void 0),
		syncScroll: handle?.syncScroll ?? (() => void 0),
		updatePaint,
		disconnect: () => {
			host.removeEventListener("input", onInput);
			unbindKeys();
			clearHostTokenHighlights(host);
			host.classList.remove("code-highlight-painted", "code-highlight-inplace", "code-highlight-source-only", "code-highlight-placeholder");
			if (inplace) host.textContent = host.textContent ?? "";
			handle?.disconnect();
			overlay.remove();
			attached.delete(host);
		}
	};
	attached.set(host, wrapped);
	updatePaint();
	return wrapped;
};
/**
* Attach highlight.js overlays to settings / form code fields.
* WHY: `highlightCodeTree` only walks `pre > code`. User-defined CSS/JSON
* editors are `textarea[data-language]`.
*/
var highlightCodeFields = (root) => {
	if (!root || typeof document === "undefined") return;
	const hosts = root.querySelectorAll("textarea[data-language], textarea.code-highlight-source");
	for (const host of hosts) {
		if (!(host instanceof HTMLTextAreaElement)) continue;
		attachCodeHighlight(host, {
			language: host.getAttribute("data-language") || void 0,
			lineNumbers: false
		});
	}
};
/** Walk a rendered markdown/result tree and overlay every fenced `pre > code`. */
var highlightCodeTree = (root) => {
	if (!root || typeof document === "undefined") return;
	const codes = root.querySelectorAll("pre > code");
	for (const code of codes) {
		if (!(code instanceof HTMLElement)) continue;
		if (code.closest(".code-highlight-overlay")) continue;
		if (code.nextElementSibling?.classList.contains("code-highlight-overlay")) continue;
		if (code.classList.contains("code-highlight-inplace") && attached.get(code)) continue;
		attached.get(code)?.disconnect();
		attachCodeHighlight(code);
	}
};
//#endregion
export { languageFromFilename as i, highlightCodeFields as n, highlightCodeTree as r, attachCodeHighlight as t };
