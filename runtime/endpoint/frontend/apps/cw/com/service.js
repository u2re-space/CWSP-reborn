import "../chunks/ShareTargetGateway.js";
import "../chunks/views.js";
import { d as normalizeViewId$1, f as viewBroadcastChannelName$1, l as getDestinationAliases$1, n as BROADCAST_CHANNELS$1, o as ROUTE_HASHES$1, r as COMPONENTS$1, u as normalizeDestination$1 } from "../chunks/Names.js";
import { d as sendProtocolMessage, i as enqueuePendingMessage, l as replayQueuedMessagesForDestination } from "../chunks/UnifiedMessaging.js";
import { n as toUnifiedInteropMessage } from "../chunks/UniformInterop2.js";
import { i as registerHandler, n as initializeComponent, r as registerComponent, s as unregisterHandler } from "../chunks/UnifiedMessaging2.js";
import { createServiceChannelManager } from "/fest/uniform.js";
//#region src/shared/routing/core/view-message-routing.ts
var VIEW_MESSAGE_FALLBACKS = {
	viewer: [
		"content-view",
		"content-load",
		"markdown-content"
	],
	workcenter: [
		"content-attach",
		"file-attach",
		"share-target-input",
		"content-share"
	],
	explorer: [
		"file-ask",
		"file-save",
		"navigate-path",
		"content-explorer"
	],
	home: ["home-update", "content-share"],
	editor: ["content-load", "content-edit"],
	settings: ["settings-update"],
	history: ["history-update"],
	print: ["content-view"]
};
var inferViewDestination = (viewId) => {
	return normalizeViewId$1(viewId);
};
var selectMessageTypeForView = (view, incomingType) => {
	const checks = [incomingType, ...VIEW_MESSAGE_FALLBACKS[view.id] || []];
	for (const type of checks) {
		if (!type) continue;
		if (!view.canHandleMessage || view.canHandleMessage(type)) return type;
	}
	return null;
};
var mapUnifiedMessageToView = (view, message) => {
	const selectedType = selectMessageTypeForView(view, message.type);
	if (!selectedType) return null;
	const id = typeof message.id === "string" && message.id.trim() ? message.id : void 0;
	return {
		...id ? { id } : {},
		type: selectedType,
		data: message.data,
		metadata: message.metadata
	};
};
//#endregion
//#region src/shared/routing/core/view-api.ts
/**
* View-scoped POST API + BroadcastChannel bridge.
* - Production: service worker intercepts POST /{view} and fans out to clients.
* - Dev (no SW): Vite middleware returns devRelay JSON; this module posts to rs-view-* locally.
*/
function subscribeViewChannel(viewId, handler) {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const bc = new BroadcastChannel(viewBroadcastChannelName$1(normalizeViewId$1(viewId)));
	bc.addEventListener("message", handler);
	return () => {
		bc.removeEventListener("message", handler);
		bc.close();
	};
}
/**
* Ask active shell/router to open a view using query-like envelope semantics.
* Window shell listens to this event and can map request to a process frame.
*/
function requestOpenView(request) {
	const viewId = String(request?.viewId || "").trim().toLowerCase();
	if (!viewId) return;
	const rawTarget = request?.target || "window";
	const target = rawTarget === "base" ? "immersive" : rawTarget;
	globalThis?.dispatchEvent?.(new CustomEvent("cw:view-open-request", { detail: {
		viewId,
		target,
		params: request?.params || {},
		pid: request?.pid || null,
		body: request?.body,
		contentType: request?.contentType,
		channel: request?.channel,
		attachments: request?.attachments,
		windowType: request?.windowType,
		newTask: request?.newTask
	} }));
}
//#endregion
//#region src/shared/routing/core/view-inbound-timing.ts
function getViewHTMLElement(view) {
	try {
		if (typeof HTMLElement !== "undefined" && view instanceof HTMLElement) return view;
	} catch {}
	return null;
}
function payloadRecordContainsRenderableFiles(payload) {
	if (!payload || typeof payload !== "object") return false;
	const rec = payload;
	const hasFileLike = (v) => typeof File !== "undefined" && v instanceof File || typeof Blob !== "undefined" && v instanceof Blob;
	if (hasFileLike(rec.file) || hasFileLike(rec.blob)) return true;
	const files = rec.files;
	if (Array.isArray(files) && files.some((x) => hasFileLike(x))) return true;
	const attachments = rec.attachments;
	if (Array.isArray(attachments)) for (const a of attachments) {
		if (!a || typeof a !== "object") continue;
		const data = a.data;
		if (hasFileLike(data)) return true;
	}
	return false;
}
function payloadContainsRenderableFilesDeep(payload) {
	if (!payload || typeof payload !== "object") return false;
	const rec = payload;
	if (payloadRecordContainsRenderableFiles(rec)) return true;
	const nested = rec.data;
	if (nested && typeof nested === "object" && payloadRecordContainsRenderableFiles(nested)) return true;
	const topAtt = rec.attachments;
	if (Array.isArray(topAtt)) for (const a of topAtt) {
		if (!a || typeof a !== "object") continue;
		const data = a.data;
		if (typeof File !== "undefined" && data instanceof File || typeof Blob !== "undefined" && data instanceof Blob) return true;
	}
	return false;
}
var FILE_INGRESS_TYPES = /* @__PURE__ */ new Set([
	"content-share",
	"share-target-input",
	"share-target-result",
	"content-attach",
	"file-attach"
]);
/** Narrow heuristic: ingress that carries blobs/files benefits from delayed delivery. */
function shouldDeferIngressForRenderableFiles(message, mappedType) {
	if (!FILE_INGRESS_TYPES.has(String(mappedType || "").toLowerCase())) return false;
	return payloadContainsRenderableFilesDeep(message);
}
/** Lightweight control handlers — skipping timing fences keeps sliders/toggles responsive. */
var SKIP_UNIFIED_INGRESS_TIMING = /* @__PURE__ */ new Set([
	"settings-update",
	"history-update",
	"home-update"
]);
/**
* Most unified ingress paths should settle the host before calling `handleMessage`.
* WHY: Applies to viewer, Work Center attachments, explorer saves, staged mail, … not launch-queue-only.
*/
function shouldDeferUnifiedIngressUntilStable(_message, mappedType) {
	return !SKIP_UNIFIED_INGRESS_TIMING.has(String(mappedType || "").toLowerCase());
}
/** One frame + microtask — enough when the viewer host and sinks already exist (common for launch-queue bursts). */
async function quickPaintFence() {
	await new Promise((resolve) => requestAnimationFrame(() => resolve()));
	await new Promise((resolve) => queueMicrotask(resolve));
}
/**
* Softer barrier when the DOM still needs layout (first paint / route change): double RAF without an extra idle delay.
*/
async function stepPaintFenceModerate() {
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	await new Promise((resolve) => queueMicrotask(resolve));
}
var MO_CONNECTED_MS = 220;
var MO_SINK_MS = 280;
/** Cap how long we wait on enter transitions so a burst of opens still reaches the latest file quickly. */
var ANIM_CAP_DEFAULT_MS = 160;
var ANIM_CAP_HOT_PATH_MS = 90;
/** Minimal shell (no HTMLElement view host): one frame before mutating viewer state — was too slow with full fence. */
async function settleIngressPaintForMinimalShell() {
	await quickPaintFence();
}
async function waitUntilViewConnectedToDocument(view, timeoutMs = MO_CONNECTED_MS) {
	const el = getViewHTMLElement(view);
	if (!el) return;
	if (el.isConnected) return;
	const rootEl = typeof document !== "undefined" && document.documentElement instanceof HTMLElement ? document.documentElement : null;
	if (!rootEl) return;
	await new Promise((resolve) => {
		let done = false;
		const finish = () => {
			if (done) return;
			done = true;
			try {
				mo.disconnect();
			} catch {}
			clearTimeout(tid);
			resolve();
		};
		const mo = new MutationObserver(() => {
			if (el.isConnected) finish();
		});
		mo.observe(rootEl, {
			childList: true,
			subtree: true
		});
		const tid = setTimeout(finish, timeoutMs);
	});
}
var RENDER_SINK_SELECTORS = ["[data-render-target]", "[data-raw-target]"];
function shallowSinkPresent(host) {
	for (const sel of RENDER_SINK_SELECTORS) try {
		if (host.querySelector(sel)) return true;
		if (host.shadowRoot?.querySelector(sel)) return true;
	} catch {}
	return false;
}
function needsRenderableSinkWait(mappedType, message) {
	const mt = String(mappedType || "").toLowerCase();
	if (mt === "content-load" || mt === "markdown-content" || mt === "content-view") return true;
	return shouldDeferIngressForRenderableFiles(message, mappedType);
}
async function waitForRenderableSinkMounted(view, timeoutMs = MO_SINK_MS) {
	const el = getViewHTMLElement(view);
	if (!el) return;
	if (shallowSinkPresent(el)) return;
	await new Promise((resolve) => {
		let done = false;
		const observers = [];
		const finish = () => {
			if (done) return;
			done = true;
			for (const ob of observers) try {
				ob.disconnect();
			} catch {}
			clearTimeout(tid);
			resolve();
		};
		const onMut = () => {
			if (shallowSinkPresent(el)) finish();
		};
		const watch = (root) => {
			const mo = new MutationObserver(onMut);
			mo.observe(root, {
				childList: true,
				subtree: true
			});
			observers.push(mo);
		};
		watch(el);
		if (el.shadowRoot) watch(el.shadowRoot);
		const tid = setTimeout(finish, timeoutMs);
		onMut();
	});
}
async function waitRunningSubtreeAnimations(view, hangMs = ANIM_CAP_DEFAULT_MS) {
	const el = getViewHTMLElement(view);
	if (!el?.isConnected) return;
	try {
		const getAnims = typeof el.getAnimations === "function" ? el.getAnimations.bind(el) : null;
		const anims = getAnims ? getAnims({ subtree: true }).filter((a) => a.playState === "running") : [];
		if (anims.length === 0) return;
		await Promise.race([Promise.all(anims.map((a) => typeof a?.finished?.then === "function" ? a.finished.catch(() => void 0) : Promise.resolve())), new Promise((resolve) => setTimeout(resolve, hangMs))]);
	} catch {}
}
/** Full settle pipeline before `handleMessage` on HTMLElement-backed hosts. */
async function settleIngressTargetBeforeDelivery(view, message, mappedType) {
	const el = getViewHTMLElement(view);
	const needSink = needsRenderableSinkWait(mappedType, message);
	if (Boolean(el?.isConnected && (!needSink || shallowSinkPresent(el)))) {
		await quickPaintFence();
		await waitRunningSubtreeAnimations(view, ANIM_CAP_HOT_PATH_MS);
		return;
	}
	await stepPaintFenceModerate();
	await waitUntilViewConnectedToDocument(view, MO_CONNECTED_MS);
	if (needSink) await waitForRenderableSinkMounted(view, MO_SINK_MS);
	await waitRunningSubtreeAnimations(view, ANIM_CAP_DEFAULT_MS);
	await quickPaintFence();
}
var ingressDeliveryChains = /* @__PURE__ */ new WeakMap();
/** Serialize ingress bursts per concrete View identity (HTMLElement instance). */
function scheduleSerialViewIngressDelivery(view, task) {
	const next = (ingressDeliveryChains.get(view) ?? Promise.resolve()).then(() => task()).catch((err) => {
		console.warn("[ViewIngress] delivery failed:", view?.id, err);
	});
	ingressDeliveryChains.set(view, next);
	return next;
}
//#endregion
//#region ../../modules/projects/subsystem/src/core/view-ingress-validation.ts
var MAX_DIRECT_FILE_BYTES = 50331648;
/** Types that must carry at least one substantive body carrier (file, blob, text, or url). */
var TYPES_REQUIRING_BODY = new Set([
	"content-load",
	"content-view",
	"markdown-content",
	"content-share",
	"content-attach",
	"file-attach"
].map((s) => s.toLowerCase()));
function asDataRecord(message) {
	const d = message.data;
	return d && typeof d === "object" && !Array.isArray(d) ? d : {};
}
function hasFileLike(v) {
	return typeof File !== "undefined" && v instanceof File || typeof Blob !== "undefined" && v instanceof Blob;
}
function carrierPresent(data) {
	if (hasFileLike(data.file) || hasFileLike(data.blob)) return true;
	const files = data.files;
	if (Array.isArray(files) && files.some((x) => hasFileLike(x))) return true;
	if (Number(data.fileCount) > 0) return true;
	if (String(data.path ?? data.into ?? "").trim().length > 0) return true;
	if (String(data.text ?? data.content ?? "").trim().length > 0) return true;
	return String(data.url ?? "").trim().length > 0;
}
/**
* Drop structurally empty envelopes before shell settle / handleMessage (noise from replays).
*/
function validateIngressBeforeViewHandle(message, mappedType) {
	const mt = String(mappedType || "").toLowerCase();
	if (!TYPES_REQUIRING_BODY.has(mt)) return { ok: true };
	const data = asDataRecord(message);
	if (!carrierPresent(data)) return {
		ok: false,
		reason: "missing-body-carrier"
	};
	const f = data.file;
	if (typeof File !== "undefined" && f instanceof File && f.size > MAX_DIRECT_FILE_BYTES) return {
		ok: false,
		reason: `file-too-large>${MAX_DIRECT_FILE_BYTES}`
	};
	if (Array.isArray(data.files)) {
		for (const x of data.files) if (typeof File !== "undefined" && x instanceof File && x.size > MAX_DIRECT_FILE_BYTES) return {
			ok: false,
			reason: `files-array-too-large>${MAX_DIRECT_FILE_BYTES}`
		};
	}
	return { ok: true };
}
/**
* After `File#text()` / network read: refuse obvious binary garbage mis-tagged as markdown.
* WHY: avoids blanking the viewer with mojibake or PDF bytes when MIME/name were wrong.
*/
function textIngressLooksCorrupt(text) {
	if (!text || text.length === 0) return false;
	const cap = Math.min(text.length, 16384);
	let nul = 0;
	let control = 0;
	for (let i = 0; i < cap; i++) {
		const c = text.charCodeAt(i);
		if (c === 0) nul++;
		if (c < 32 && c !== 9 && c !== 10 && c !== 13) control++;
	}
	if (nul > 2) return true;
	if (control / cap > .02 && text.length < 65536) return true;
	const head = text.slice(0, 512).trimStart();
	if (head.startsWith("%PDF")) return true;
	if (head.startsWith("PK")) return true;
	return false;
}
/**
* Pick authoritative file for staged transfers: optional hint match, then text-like, then markdown extension.
*/
function pickAuthoritativeTransferFiles(files, opts) {
	const list = files.filter((f) => f instanceof File);
	if (list.length === 0) return null;
	const hint = (opts.hintFilename || "").trim().toLowerCase();
	if (hint) {
		const byHint = list.find((f) => String(f.name || "").trim().toLowerCase() === hint);
		if (byHint) return byHint;
		const partial = list.find((f) => String(f.name || "").trim().toLowerCase().endsWith(hint));
		if (partial) return partial;
	}
	const texty = list.find((f) => opts.isTextLike(f));
	if (texty) return texty;
	return list.find((f) => /\.(md|markdown|mdown|mkdn|mkd)(?:$|\?)/i.test(f.name || "")) ?? list[0] ?? null;
}
function validateReadableFileForIngress(file) {
	if (!(file instanceof File)) return {
		ok: false,
		reason: "not-a-file"
	};
	if (file.size > MAX_DIRECT_FILE_BYTES) return {
		ok: false,
		reason: "file-too-large"
	};
	return { ok: true };
}
//#endregion
//#region src/shared/routing/channel/ServiceChannels.ts
/**
* Service Channels for CWSP-shell
* Extends fest/uniform ServiceChannelManager with app-specific configuration
*/
var SERVICE_CHANNEL_CONFIG = {
	workcenter: {
		broadcastName: BROADCAST_CHANNELS$1.WORK_CENTER,
		routeHash: ROUTE_HASHES$1.WORKCENTER,
		component: COMPONENTS$1.WORK_CENTER,
		description: "AI work center for processing files and content"
	},
	settings: {
		broadcastName: BROADCAST_CHANNELS$1.SETTINGS,
		routeHash: ROUTE_HASHES$1.SETTINGS,
		component: COMPONENTS$1.SETTINGS,
		description: "Application settings and configuration"
	},
	airpad: {
		broadcastName: BROADCAST_CHANNELS$1.SERVICE_AIRPAD,
		routeHash: ROUTE_HASHES$1.AIRPAD,
		component: COMPONENTS$1.AIRPAD,
		description: "AirPad remote trackpad/keyboard + clipboard"
	},
	network: {
		broadcastName: BROADCAST_CHANNELS$1.SERVICE_NETWORK,
		routeHash: ROUTE_HASHES$1.NETWORK,
		component: COMPONENTS$1.NETWORK,
		description: "CWSP network status, probes, and endpoint routing"
	},
	viewer: {
		broadcastName: BROADCAST_CHANNELS$1.MARKDOWN_VIEWER,
		routeHash: ROUTE_HASHES$1.MARKDOWN_VIEWER,
		component: COMPONENTS$1.MARKDOWN_VIEWER,
		description: "Content viewer for markdown and files"
	},
	explorer: {
		broadcastName: BROADCAST_CHANNELS$1.FILE_EXPLORER,
		routeHash: ROUTE_HASHES$1.FILE_EXPLORER,
		component: COMPONENTS$1.FILE_EXPLORER,
		description: "File explorer and browser"
	},
	print: {
		broadcastName: BROADCAST_CHANNELS$1.PRINT_CHANNEL,
		routeHash: ROUTE_HASHES$1.PRINT,
		component: COMPONENTS$1.BASIC_PRINT,
		description: "Print preview and export"
	},
	history: {
		broadcastName: BROADCAST_CHANNELS$1.HISTORY_CHANNEL,
		routeHash: ROUTE_HASHES$1.HISTORY,
		component: COMPONENTS$1.HISTORY,
		description: "Action history and undo/redo"
	},
	editor: {
		broadcastName: "rs-editor",
		routeHash: ROUTE_HASHES$1.MARKDOWN_EDITOR,
		component: COMPONENTS$1.MARKDOWN_EDITOR,
		description: "Content editor"
	},
	home: {
		broadcastName: "rs-home",
		routeHash: "#home",
		component: "home",
		description: "Home/landing view"
	}
};
var appServiceChannelManager = null;
/**
* Get the app-configured ServiceChannelManager
*/
function getServiceChannels() {
	if (!appServiceChannelManager) appServiceChannelManager = createServiceChannelManager({
		channels: SERVICE_CHANNEL_CONFIG,
		logPrefix: "[ServiceChannels]"
	});
	return appServiceChannelManager;
}
var serviceChannels = getServiceChannels();
//#endregion
//#region ../../modules/projects/subsystem/src/other/config/Names.ts
/**
* Broadcast channel names used throughout the application
*/
var BROADCAST_CHANNELS = {
	SHARE_TARGET: "rs-share-target",
	TOAST: "rs-toast",
	CLIPBOARD: "rs-clipboard",
	WORK_CENTER: "rs-workcenter",
	MARKDOWN_VIEWER: "rs-markdown-viewer",
	SETTINGS: "rs-settings",
	GENERAL: "rs-app-general",
	MINIMAL_APP: "minimal-app",
	MAIN_APP: "main-app",
	FILE_EXPLORER: "file-explorer",
	PRINT_VIEWER: "print-viewer",
	SETTINGS_VIEWER: "settings-viewer",
	HISTORY_VIEWER: "history-viewer",
	MARKDOWN_VIEWER_CHANNEL: "markdown-viewer",
	FILE_EXPLORER_CHANNEL: "file-explorer",
	SETTINGS_CHANNEL: "settings",
	HISTORY_CHANNEL: "history",
	PRINT_CHANNEL: "print",
	SERVICE_WORKCENTER: "rs-service-workcenter",
	SERVICE_SETTINGS: "rs-service-settings",
	SERVICE_VIEWER: "rs-service-viewer",
	SERVICE_EXPLORER: "rs-service-explorer",
	SERVICE_AIRPAD: "rs-service-airpad",
	SERVICE_NETWORK: "rs-service-network",
	SERVICE_PRINT: "rs-service-print",
	SERVICE_HISTORY: "rs-service-history",
	SERVICE_EDITOR: "rs-service-editor",
	SERVICE_HOME: "rs-service-home"
};
var viewBroadcastChannelName = (viewId) => {
	return `rs-view-${normalizeViewId(viewId) || "app"}`;
};
/**
* Component and module identifiers
*/
var COMPONENTS = {
	WORK_CENTER: "workcenter",
	MARKDOWN_VIEWER: "markdown-viewer",
	MARKDOWN_EDITOR: "markdown-editor",
	RICH_EDITOR: "rich-editor",
	SETTINGS: "settings",
	HISTORY: "history",
	FILE_PICKER: "file-picker",
	FILE_EXPLORER: "file-explorer",
	WORKCENTER_CORE: "workcenter-core",
	BASIC_WORKCENTER: "basic-workcenter",
	BASIC_VIEWER: "basic-viewer",
	BASIC_EXPLORER: "basic-explorer",
	BASIC_SETTINGS: "basic-settings",
	BASIC_HISTORY: "basic-history",
	BASIC_PRINT: "basic-print",
	AIRPAD: "airpad",
	NETWORK: "network",
	HOME: "home",
	EDITOR: "editor",
	VIEWER: "viewer",
	EXPLORER: "explorer",
	PRINT: "print"
};
/**
* Location hash identifiers for app navigation
*/
var ROUTE_HASHES = {
	MARKDOWN_VIEWER: "#markdown-viewer",
	MARKDOWN_EDITOR: "#markdown-editor",
	RICH_EDITOR: "#rich-editor",
	SETTINGS: "#settings",
	HISTORY: "#history",
	WORKCENTER: "#workcenter",
	FILE_PICKER: "#file-picker",
	FILE_EXPLORER: "#file-explorer",
	PRINT: "#print",
	AIRPAD: "#airpad",
	NETWORK: "#network",
	WORKCENTER_FILES: "#workcenter-files",
	WORKCENTER_TEXT: "#workcenter-text",
	WORKCENTER_IMAGES: "#workcenter-images",
	WORKCENTER_PROCESSING: "#workcenter-processing",
	SHARE_TARGET_TEXT: "#share-target-text",
	SHARE_TARGET_FILES: "#share-target-files",
	SHARE_TARGET_URL: "#share-target-url",
	SHARE_TARGET_IMAGE: "#share-target-image"
};
/**
* Destination identifiers for unified messaging
*/
var DESTINATIONS = {
	WORKCENTER: "workcenter",
	CLIPBOARD: "clipboard",
	VIEWER: "viewer",
	MARKDOWN_VIEWER: "markdown-viewer",
	SETTINGS: "settings",
	HISTORY: "history",
	EXPLORER: "explorer",
	FILE_EXPLORER: "file-explorer",
	PRINT: "print",
	PRINT_VIEWER: "print-viewer",
	EDITOR: "editor",
	AIRPAD: "airpad",
	HOME: "home",
	BASIC_APP: "basic-app",
	MAIN_APP: "main-app"
};
var CANONICAL_VIEW_IDS = [
	"viewer",
	"workcenter",
	"explorer",
	"editor",
	"settings",
	"history",
	"home",
	"airpad",
	"print"
];
/**
* COMPAT: legacy shells still emit `markdown-viewer`, `file-explorer`, and
* `basic-*` destinations. Keep alias resolution centralized here so transports,
* views, and workers can agree on one canonical target vocabulary.
*/
var DESTINATION_ALIASES = {
	viewer: [
		DESTINATIONS.VIEWER,
		DESTINATIONS.MARKDOWN_VIEWER,
		COMPONENTS.BASIC_VIEWER
	],
	workcenter: [
		DESTINATIONS.WORKCENTER,
		COMPONENTS.BASIC_WORKCENTER,
		COMPONENTS.WORKCENTER_CORE
	],
	explorer: [
		DESTINATIONS.EXPLORER,
		DESTINATIONS.FILE_EXPLORER,
		COMPONENTS.BASIC_EXPLORER
	],
	editor: [
		DESTINATIONS.EDITOR,
		COMPONENTS.MARKDOWN_EDITOR,
		COMPONENTS.RICH_EDITOR
	],
	settings: [
		DESTINATIONS.SETTINGS,
		BROADCAST_CHANNELS.SETTINGS_CHANNEL,
		COMPONENTS.BASIC_SETTINGS
	],
	history: [
		DESTINATIONS.HISTORY,
		BROADCAST_CHANNELS.HISTORY_CHANNEL,
		COMPONENTS.BASIC_HISTORY
	],
	print: [
		DESTINATIONS.PRINT,
		DESTINATIONS.PRINT_VIEWER,
		COMPONENTS.BASIC_PRINT
	],
	airpad: [DESTINATIONS.AIRPAD],
	home: [DESTINATIONS.HOME],
	clipboard: [DESTINATIONS.CLIPBOARD],
	"basic-app": [DESTINATIONS.BASIC_APP],
	"main-app": [DESTINATIONS.MAIN_APP]
};
var DESTINATION_LOOKUP = Object.entries(DESTINATION_ALIASES).reduce((out, [canonical, aliases]) => {
	out[canonical] = canonical;
	for (const alias of aliases) out[String(alias).toLowerCase()] = canonical;
	return out;
}, {});
var normalizeDestination = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return "";
	return DESTINATION_LOOKUP[raw] || raw;
};
var getDestinationAliases = (value) => {
	const canonical = normalizeDestination(value);
	if (!canonical) return [];
	return [.../* @__PURE__ */ new Set([canonical, ...DESTINATION_ALIASES[canonical] || []])];
};
var matchesDestination = (candidate, expected) => Boolean(normalizeDestination(candidate) && normalizeDestination(candidate) === normalizeDestination(expected));
var normalizeViewId = (value) => {
	const canonical = normalizeDestination(value);
	if (CANONICAL_VIEW_IDS.includes(canonical)) return canonical;
	return "viewer";
};
BROADCAST_CHANNELS.SERVICE_WORKCENTER, BROADCAST_CHANNELS.SERVICE_SETTINGS, BROADCAST_CHANNELS.SERVICE_VIEWER, BROADCAST_CHANNELS.SERVICE_EXPLORER, BROADCAST_CHANNELS.SERVICE_AIRPAD, BROADCAST_CHANNELS.SERVICE_NETWORK, BROADCAST_CHANNELS.SERVICE_PRINT, BROADCAST_CHANNELS.SERVICE_HISTORY, BROADCAST_CHANNELS.SERVICE_EDITOR, BROADCAST_CHANNELS.SERVICE_HOME;
ROUTE_HASHES.WORKCENTER, ROUTE_HASHES.SETTINGS, ROUTE_HASHES.MARKDOWN_VIEWER, ROUTE_HASHES.FILE_EXPLORER, ROUTE_HASHES.NETWORK, ROUTE_HASHES.PRINT, ROUTE_HASHES.HISTORY, ROUTE_HASHES.MARKDOWN_EDITOR;
//#endregion
//#region src/shared/routing/core/channel-mixin.ts
/**
* Burst opens (recent list, launch queue replay): supersede older queued work so only the latest
* payload pays settle + paint (serial queue still orders; skipped tasks exit cheaply).
*/
var ingressSupersedeGeneration = /* @__PURE__ */ new WeakMap();
var bumpIngressGeneration = (view) => {
	const next = (ingressSupersedeGeneration.get(view) ?? 0) + 1;
	ingressSupersedeGeneration.set(view, next);
	return next;
};
/** Mirrors {@link dispatchViewTransfer} + BroadcastChannel can deliver the same ingress twice; ReplayGuard only covers the manager path. */
var recentViewIngressByMessageId = /* @__PURE__ */ new Map();
var INGRESS_DEDUP_MS = 600;
/** Attached to routed view messages so views can discard stale async work after `await` (file read, fetch). */
var UNIFIED_INGRESS_STAMP_META = "__ingressStamp";
/** True when newer ingress has bumped the counter vs this delivery's stamp (`handleMessage` should no-op). */
function ingressStampWasSuperseded(view, stamp) {
	if (typeof stamp !== "number" || !Number.isFinite(stamp)) return false;
	return (ingressSupersedeGeneration.get(view) ?? 0) !== stamp;
}
function stampMappedMessageForIngressDelivery(mapped, generation) {
	const prevMeta = mapped.metadata && typeof mapped.metadata === "object" && !Array.isArray(mapped.metadata) ? mapped.metadata : {};
	return {
		...mapped,
		metadata: {
			...prevMeta,
			[UNIFIED_INGRESS_STAMP_META]: generation
		}
	};
}
var pruneViewIngressDedup = (now) => {
	for (const [k, t] of recentViewIngressByMessageId) if (now - t > INGRESS_DEDUP_MS) recentViewIngressByMessageId.delete(k);
};
var deliverUnifiedMessageToView = async (view, message) => {
	const mid = typeof message.id === "string" ? message.id.trim() : "";
	if (mid) {
		const dest = normalizeViewId(inferViewDestination(String(view.id || "")));
		const now = Date.now();
		pruneViewIngressDedup(now);
		const dedupKey = `${dest}::${mid}`;
		const prev = recentViewIngressByMessageId.get(dedupKey);
		if (prev !== void 0 && now - prev < INGRESS_DEDUP_MS) return;
		recentViewIngressByMessageId.set(dedupKey, now);
	}
	const mapped = mapUnifiedMessageToView(view, message);
	if (!mapped) return;
	const ingressCheck = validateIngressBeforeViewHandle(message, mapped.type);
	if (!ingressCheck.ok) {
		console.warn("[ViewIngress] Skipped malformed envelope:", ingressCheck.reason, mapped.type);
		return;
	}
	const generation = bumpIngressGeneration(view);
	await scheduleSerialViewIngressDelivery(view, async () => {
		if (ingressSupersedeGeneration.get(view) !== generation) return;
		if (shouldDeferUnifiedIngressUntilStable(message, mapped.type)) await settleIngressTargetBeforeDelivery(view, message, mapped.type);
		if (ingressSupersedeGeneration.get(view) !== generation) return;
		await view.handleMessage?.(stampMappedMessageForIngressDelivery(mapped, generation));
	});
};
function bindViewReceiveChannel(view, options = {}) {
	if (!view.handleMessage) return () => {};
	const destination = options.destination || inferViewDestination(String(view.id || ""));
	const componentId = options.componentId || `view:${view.id}`;
	const receiveDestinations = getDestinationAliases(destination);
	const handler = {
		canHandle: (message) => matchesDestination(message.destination, destination),
		handle: async (message) => {
			await deliverUnifiedMessageToView(view, message);
		}
	};
	const pendingSeen = /* @__PURE__ */ new Set();
	for (const alias of receiveDestinations) {
		const aliasComponentId = `${componentId}:${alias}`;
		registerComponent(aliasComponentId, alias);
		registerHandler(alias, handler);
		const pending = initializeComponent(aliasComponentId);
		if (pending.length > 0) for (const message of pending) {
			if (pendingSeen.has(message.id)) continue;
			pendingSeen.add(message.id);
			handler.handle(message);
		}
	}
	const viewChannelCleanup = subscribeViewChannel(normalizeViewId(destination), (event) => {
		const payload = event.data;
		if (!payload || typeof payload !== "object") return;
		if (payload.type === "view-transfer" && payload.message && typeof payload.message === "object") {
			deliverUnifiedMessageToView(view, toUnifiedInteropMessage(payload.message));
			return;
		}
		if (payload.type === "view-post") {
			const viewId = normalizeViewId(payload.viewId);
			if (viewId !== normalizeViewId(String(view.id || destination))) return;
			const vm = {
				id: typeof payload.id === "string" ? String(payload.id) : crypto.randomUUID(),
				type: "view-post",
				destination: viewId,
				source: "view-channel",
				data: {
					bodyText: String(payload.bodyText || ""),
					contentType: String(payload.contentType || ""),
					viewId
				},
				metadata: {
					source: "view-channel",
					destination: viewId
				}
			};
			const generation = bumpIngressGeneration(view);
			scheduleSerialViewIngressDelivery(view, async () => {
				if (ingressSupersedeGeneration.get(view) !== generation) return;
				if (shouldDeferUnifiedIngressUntilStable(vm, "view-post")) await settleIngressTargetBeforeDelivery(view, vm, "view-post");
				if (ingressSupersedeGeneration.get(view) !== generation) return;
				await view.handleMessage?.(stampMappedMessageForIngressDelivery({
					type: "view-post",
					data: {
						bodyText: String(payload.bodyText || ""),
						contentType: String(payload.contentType || ""),
						viewId
					},
					metadata: vm.metadata
				}, generation));
			});
		}
	});
	return () => {
		for (const alias of receiveDestinations) unregisterHandler(alias, handler);
		viewChannelCleanup();
	};
}
//#endregion
//#region src/shared/routing/core/implicit-view-bridge.ts
/** Narrow structural check — imperative APIs (`handleMessage`, `addFiles`, …) stay on the element. */
function isImplicitViewMessagingHost(node) {
	if (!node || typeof node !== "object") return false;
	const el = node;
	return typeof el.handleMessage === "function" && typeof el.id === "string" && el.id.trim().length > 0;
}
var STAGED_UNIFIED_SELECTOR = "[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]";
function parseJsonObject(raw) {
	if (!raw?.trim()) return null;
	try {
		const v = JSON.parse(raw);
		return v && typeof v === "object" ? v : null;
	} catch {
		return null;
	}
}
function buildUnifiedMessageFromStaging(rec) {
	const destination = normalizeDestination$1(String(rec.destination ?? "")) || String(rec.destination ?? "").trim();
	if (!destination) return null;
	return {
		id: typeof rec.id === "string" ? rec.id : crypto.randomUUID(),
		type: String(rec.type || "content-share"),
		source: typeof rec.source === "string" ? rec.source : "dom-staged-unified",
		destination,
		contentType: typeof rec.contentType === "string" ? rec.contentType : void 0,
		data: rec.data ?? rec.payload ?? {},
		metadata: {
			timestamp: Date.now(),
			...typeof rec.metadata === "object" && rec.metadata ? rec.metadata : {}
		}
	};
}
function readDeferFlushDestination(el) {
	const raw = el.getAttribute("data-cw-unified-defer-flush");
	if (!raw?.trim()) return null;
	const trimmed = raw.trim();
	if (trimmed.startsWith("{")) {
		const d = parseJsonObject(trimmed)?.destination;
		return typeof d === "string" ? d : null;
	}
	return trimmed;
}
function consumeDeferFlush(el) {
	const destRaw = readDeferFlushDestination(el);
	if (!destRaw) return;
	const dest = normalizeDestination$1(destRaw) || normalizeViewId$1(destRaw);
	replayQueuedMessagesForDestination(dest).catch(() => void 0);
	el.removeAttribute("data-cw-unified-defer-flush");
}
function consumePending(el) {
	const rec = parseJsonObject(el.getAttribute("data-cw-unified-pending"));
	if (!rec) return;
	const msg = buildUnifiedMessageFromStaging(rec);
	if (!msg?.destination) return;
	enqueuePendingMessage(msg.destination, msg);
	el.removeAttribute("data-cw-unified-pending");
}
function consumeMail(el) {
	const rec = parseJsonObject(el.getAttribute("data-cw-unified-mail"));
	if (!rec) return;
	const destination = normalizeDestination$1(String(rec.destination || "")) || String(rec.destination || "").trim();
	if (!destination) return;
	sendProtocolMessage({
		type: String(rec.type || "dispatch"),
		destination,
		source: typeof rec.source === "string" ? rec.source : "dom-staged-mail",
		data: rec.data ?? rec.payload ?? {},
		contentType: typeof rec.contentType === "string" ? rec.contentType : void 0,
		metadata: typeof rec.metadata === "object" && rec.metadata ? rec.metadata : {},
		purpose: Array.isArray(rec.purpose) ? rec.purpose : typeof rec.purpose === "string" ? [rec.purpose] : ["mail", "deliver"],
		op: typeof rec.op === "string" ? rec.op : "deliver",
		protocol: typeof rec.protocol === "string" ? rec.protocol : void 0
	}).catch(() => void 0);
	el.removeAttribute("data-cw-unified-mail");
}
/**
* Applies staged envelope markers inside `scope` (scope element + subtree via querySelectorAll).
* Intended for MutationObserver added subtrees and shell-injected payloads.
*/
function processStagedUnifiedMarkers(scope) {
	const matched = /* @__PURE__ */ new Set();
	if (scope.matches("[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]")) matched.add(scope);
	for (const n of scope.querySelectorAll(STAGED_UNIFIED_SELECTOR)) matched.add(n);
	for (const el of matched) {
		if (!el.isConnected) continue;
		consumeDeferFlush(el);
		consumePending(el);
		consumeMail(el);
	}
}
function flushDeferredTransportForView(view, explicitDestination) {
	const dest = explicitDestination || inferViewDestination(String(view.id || ""));
	const aliases = getDestinationAliases$1(dest);
	const targets = /* @__PURE__ */ new Set();
	for (const x of [dest, ...aliases]) {
		const n = normalizeDestination$1(x) || String(x || "").trim();
		if (n) targets.add(normalizeViewId$1(n));
	}
	(async () => {
		for (const t of targets) try {
			await replayQueuedMessagesForDestination(t);
		} catch {}
	})();
}
var cleanupByView = /* @__PURE__ */ new WeakMap();
/** Last bound element per canonical destination — avoids duplicate UnifiedMessaging handlers. */
var activeHostByDestination = /* @__PURE__ */ new Map();
function sealCleanup(view, destinationKey, inner) {
	let disposed = false;
	return () => {
		if (disposed) return;
		disposed = true;
		inner();
		cleanupByView.delete(view);
		if (activeHostByDestination.get(destinationKey) === view) activeHostByDestination.delete(destinationKey);
	};
}
/**
* Single receive-channel binding per live view instance; replaces any prior binding for the same destination id.
* Safe to call from {@link ViewRegistry.load} and from DOM discovery.
*/
function attachImplicitViewMessaging(view, options = {}) {
	if (!view.handleMessage) return () => {};
	const existing = cleanupByView.get(view);
	if (existing) return existing;
	const destination = options.destination || inferViewDestination(String(view.id || ""));
	const destinationKey = normalizeViewId$1(destination);
	const displaced = activeHostByDestination.get(destinationKey);
	if (displaced && displaced !== view) cleanupByView.get(displaced)?.();
	const inner = bindViewReceiveChannel(view, {
		...options,
		destination
	});
	flushDeferredTransportForView(view, destination);
	const cleanup = sealCleanup(view, destinationKey, inner);
	cleanupByView.set(view, cleanup);
	activeHostByDestination.set(destinationKey, view);
	return cleanup;
}
function detachImplicitViewMessaging(view) {
	cleanupByView.get(view)?.();
}
function walkSubtreeNodes(entry, visit) {
	const stack = [entry];
	while (stack.length) {
		const cur = stack.pop();
		if (cur.nodeType === Node.ELEMENT_NODE) {
			const el = cur;
			visit(el);
			const sr = el.shadowRoot;
			if (sr) for (let i = sr.childNodes.length - 1; i >= 0; i--) stack.push(sr.childNodes[i]);
			for (let i = el.childNodes.length - 1; i >= 0; i--) stack.push(el.childNodes[i]);
		}
	}
}
function observeMutationRoot(observer, observed, node) {
	if (observed.has(node)) return;
	observed.add(node);
	observer.observe(node, {
		childList: true,
		subtree: true
	});
}
/**
* Starts observing DOM mutations; binds messaging hosts when connected and tears down when disconnected.
*/
function startImplicitViewMessagingBridge(options = {}) {
	const root = options.root instanceof Document ? options.root.documentElement : options.root ?? document.documentElement;
	if (!root || typeof MutationObserver === "undefined") return () => {};
	const observedRoots = /* @__PURE__ */ new WeakSet();
	let scanConnect = () => {};
	const scanDisconnect = (node) => {
		walkSubtreeNodes(node, (el) => {
			if (!isImplicitViewMessagingHost(el)) return;
			if (!el.isConnected) detachImplicitViewMessaging(el);
		});
	};
	const observer = new MutationObserver((records) => {
		for (const rec of records) {
			rec.addedNodes.forEach(scanConnect);
			rec.removedNodes.forEach(scanDisconnect);
		}
	});
	scanConnect = (node) => {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const host = node;
			if (host.isConnected) processStagedUnifiedMarkers(host);
		}
		walkSubtreeNodes(node, (el) => {
			if (el.shadowRoot) observeMutationRoot(observer, observedRoots, el.shadowRoot);
			if (!el.isConnected || !isImplicitViewMessagingHost(el)) return;
			attachImplicitViewMessaging(el);
		});
	};
	observeMutationRoot(observer, observedRoots, root);
	scanConnect(root);
	return () => {
		observer.disconnect();
		walkSubtreeNodes(root, (el) => {
			if (isImplicitViewMessagingHost(el)) detachImplicitViewMessaging(el);
		});
	};
}
//#endregion
//#region src/shared/routing/core/registry.ts
/**
* View factories usually return custom elements; some legacy modules return a plain
* object implementing `View` (render/lifecycle/id). Accept both for shell compatibility.
*/
function createWebComponentViewAdapter(viewInstance) {
	if (viewInstance instanceof HTMLElement) return viewInstance;
	const legacy = viewInstance;
	if (legacy && typeof legacy.render === "function" && typeof legacy.id === "string") return legacy;
	throw new Error("View factory must return an HTMLElement or a legacy view with render() and id");
}
/** Registry for shell modules plus the single live shell instances cached at runtime. */
var ShellRegistryClass = class {
	shells = /* @__PURE__ */ new Map();
	loadedShells = /* @__PURE__ */ new Map();
	/** COMPAT: `base` resolves to immersive chromeless module (`cw-shell-immersive`). */
	resolveShellRegistrationKey(id) {
		return id === "base" ? "immersive" : id;
	}
	/**
	* Register a shell
	*/
	register(registration) {
		this.shells.set(registration.id, registration);
	}
	/**
	* Get a shell registration
	*/
	get(id) {
		return this.shells.get(this.resolveShellRegistrationKey(id));
	}
	/**
	* Get all registered shells
	*/
	getAll() {
		return Array.from(this.shells.values());
	}
	/**
	* Load and instantiate a shell
	*/
	async load(id, container) {
		const resolved = this.resolveShellRegistrationKey(id);
		const cached = this.loadedShells.get(resolved);
		if (cached) return cached;
		const registration = this.shells.get(resolved);
		if (!registration) throw new Error(`Shell not found: ${resolved}`);
		const module = await registration.loader();
		const factory = module.default || module.createShell;
		if (typeof factory !== "function") throw new Error(`Invalid shell module: ${resolved}`);
		const shell = factory(container);
		this.loadedShells.set(resolved, shell);
		return shell;
	}
	/**
	* Unload a shell
	*/
	unload(id) {
		const resolved = this.resolveShellRegistrationKey(id);
		const shell = this.loadedShells.get(resolved);
		if (shell) {
			shell.unmount();
			this.loadedShells.delete(resolved);
		}
	}
	/**
	* Check if a shell is loaded
	*/
	isLoaded(id) {
		return this.loadedShells.has(this.resolveShellRegistrationKey(id));
	}
	/**
	* Get a loaded shell instance
	*/
	getLoaded(id) {
		return this.loadedShells.get(this.resolveShellRegistrationKey(id));
	}
};
var ShellRegistry = new ShellRegistryClass();
var ViewRegistry = new class ViewRegistryClass {
	/** COMPAT: Modules often default-export a CE class (`CwViewExplorer`) — must be invoked with `new`. */
	static isCustomElementClassCtor(fn) {
		if (typeof fn !== "function") return false;
		try {
			const proto = fn.prototype;
			return proto != null && typeof HTMLElement !== "undefined" && HTMLElement.prototype.isPrototypeOf(proto);
		} catch {
			return false;
		}
	}
	resolveViewFactory(module) {
		const candidates = [
			module?.default,
			module?.createView,
			module?.createAirpadView,
			module?.createWorkCenterView,
			module?.createViewerView,
			module?.createExplorerView,
			module?.createSettingsView,
			module?.createNetworkView,
			module?.createHistoryView,
			module?.createHomeView
		];
		for (const candidate of candidates) {
			if (typeof candidate !== "function") continue;
			if (ViewRegistryClass.isCustomElementClassCtor(candidate)) {
				const Ctor = candidate;
				return ((options) => new Ctor(options));
			}
			return candidate;
		}
		const values = Object.values(module || {});
		for (const value of values) if (typeof value === "function" && value.prototype && typeof value.prototype.render === "function") {
			const ViewClass = value;
			return (options) => new ViewClass(options);
		}
		return null;
	}
	views = /* @__PURE__ */ new Map();
	loadedViews = /* @__PURE__ */ new Map();
	viewReceiveCleanup = /* @__PURE__ */ new Map();
	/**
	* Register a view
	*/
	register(registration) {
		this.views.set(registration.id, registration);
	}
	/**
	* Get a view registration
	*/
	get(id) {
		return this.views.get(id);
	}
	/**
	* Get all registered views
	*/
	getAll() {
		return Array.from(this.views.values());
	}
	/**
	* Load and instantiate a view
	*/
	async load(id, options) {
		const cached = this.loadedViews.get(id);
		if (cached) return cached;
		const registration = this.views.get(id);
		if (!registration) throw new Error(`View not found: ${id}`);
		const module = await registration.loader();
		const factory = this.resolveViewFactory(module);
		if (!factory) throw new Error(`Invalid view module: ${id}`);
		const view = createWebComponentViewAdapter(await factory(options));
		const previousCleanup = this.viewReceiveCleanup.get(id);
		if (previousCleanup) {
			previousCleanup();
			this.viewReceiveCleanup.delete(id);
		}
		this.loadedViews.set(id, view);
		this.viewReceiveCleanup.set(id, attachImplicitViewMessaging(view, {
			destination: String(id),
			componentId: `view:${id}`
		}));
		return view;
	}
	/**
	* Unload a view (clear cache)
	*/
	unload(id) {
		const view = this.loadedViews.get(id);
		if (view?.lifecycle?.onUnmount) view.lifecycle.onUnmount();
		const receiveCleanup = this.viewReceiveCleanup.get(id);
		if (receiveCleanup) {
			receiveCleanup();
			this.viewReceiveCleanup.delete(id);
		}
		this.loadedViews.delete(id);
	}
	/**
	* Check if a view is loaded
	*/
	isLoaded(id) {
		return this.loadedViews.has(id);
	}
	/**
	* Get a loaded view instance
	*/
	getLoaded(id) {
		return this.loadedViews.get(id);
	}
	/**
	* Warm the dynamic import for a view module (no instance, no receive-channel bind).
	* Safe to call from idle prefetch; failures are ignored.
	*/
	prefetchModule(id) {
		const registration = this.views.get(id);
		if (!registration) return;
		registration.loader().catch(() => {});
	}
}();
/** Register the built-in shell modules that the boot/routing layer can request. */
function registerDefaultShells() {
	ShellRegistry.register({
		id: "immersive",
		name: "Immersive",
		description: "Chromeless immersive shell (standalone pages, extensions, embedded); legacy boot id `base` aliases here.",
		loader: () => import("../chunks/src.js")
	});
	ShellRegistry.register({
		id: "minimal",
		name: "Minimal",
		description: "Minimal toolbar-based navigation",
		loader: () => import("../chunks/preview.js").then((n) => n.t)
	});
	ShellRegistry.register({
		id: "content",
		name: "Content",
		description: "CRX content shell with overlay-focused layering",
		loader: () => import("../chunks/src2.js")
	});
	ShellRegistry.register({
		id: "immersive",
		name: "Immersive",
		description: "Chromeless immersive host (extensions / embedded)",
		loader: () => import("../chunks/src.js")
	});
	ShellRegistry.register({
		id: "window",
		name: "Window",
		description: "Window-capable shell (multi-view)",
		loader: () => import("../chunks/window.js")
	});
	ShellRegistry.register({
		id: "tabbed",
		name: "Tabbed",
		description: "Tabbed window shell",
		loader: () => import("../chunks/tabbed.js")
	});
	ShellRegistry.register({
		id: "environment",
		name: "Environment",
		description: "Desktop/launcher shell: wallpaper, Speed Dial, taskbar, ui-window",
		loader: () => import("../chunks/environment.js")
	});
}
/** Register the built-in views that are enabled by current feature flags. */
function registerDefaultViews() {
	ViewRegistry.register({
		id: "viewer",
		name: "Viewer",
		icon: "eye",
		loader: () => import("../chunks/src8.js")
	});
	ViewRegistry.register({
		id: "workcenter",
		name: "Work Center",
		icon: "lightning",
		loader: () => import("./app19.js").then((n) => n.t)
	});
	ViewRegistry.register({
		id: "settings",
		name: "Settings",
		icon: "gear",
		loader: () => import("../chunks/src7.js")
	});
	ViewRegistry.register({
		id: "network",
		name: "Network",
		icon: "wifi-high",
		loader: () => import("../chunks/src6.js")
	});
	ViewRegistry.register({
		id: "history",
		name: "History",
		icon: "clock-counter-clockwise",
		loader: () => import("../chunks/src4.js")
	});
	ViewRegistry.register({
		id: "explorer",
		name: "Explorer",
		icon: "folder",
		loader: () => import("./app7.js")
	});
	ViewRegistry.register({
		id: "editor",
		name: "Editor",
		icon: "pencil",
		loader: () => import("../chunks/src3.js")
	});
	ViewRegistry.register({
		id: "home",
		name: "Home",
		icon: "house",
		loader: () => import("../chunks/src5.js")
	});
	ViewRegistry.register({
		id: "print",
		name: "Print",
		icon: "printer",
		loader: () => import("../chunks/src8.js")
	});
}
var defaultTheme = {
	id: "auto",
	name: "Auto",
	colorScheme: "auto"
};
var lightTheme = {
	id: "light",
	name: "Light",
	colorScheme: "light"
};
var darkTheme = {
	id: "dark",
	name: "Dark",
	colorScheme: "dark"
};
/**
* Populate both registries during boot before any shell or view is resolved.
*/
function initializeRegistries() {
	registerDefaultShells();
	registerDefaultViews();
}
//#endregion
export { validateReadableFileForIngress as _, initializeRegistries as a, registerDefaultViews as c, BROADCAST_CHANNELS as d, viewBroadcastChannelName as f, validateIngressBeforeViewHandle as g, textIngressLooksCorrupt as h, defaultTheme as i, startImplicitViewMessagingBridge as l, pickAuthoritativeTransferFiles as m, ViewRegistry as n, lightTheme as o, serviceChannels as p, darkTheme as r, registerDefaultShells as s, ShellRegistry as t, ingressStampWasSuperseded as u, settleIngressPaintForMinimalShell as v, requestOpenView as y };
