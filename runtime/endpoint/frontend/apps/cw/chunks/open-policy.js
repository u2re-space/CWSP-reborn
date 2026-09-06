import { r as __exportAll } from "./rolldown-runtime.js";
import { c as isCwspNativeHost } from "./ecosystem-skus.js";
//#region src/shared/other/config/settings-host.ts
var SETTINGS_HOSTS = [
	"capacitor",
	"crx",
	"pwa",
	"web"
];
var isCrxHost = () => {
	try {
		const proto = String(globalThis.location?.protocol || "").toLowerCase();
		if (proto === "chrome-extension:" || proto === "moz-extension:") return true;
		return Boolean(globalThis.chrome?.runtime?.id);
	} catch {
		return false;
	}
};
var isPwaStandalone = () => {
	try {
		if (String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase().includes("pwa")) return true;
		const standalone = globalThis.matchMedia?.("(display-mode: standalone)").matches || globalThis.navigator.standalone === true;
		return Boolean(standalone);
	} catch {
		return false;
	}
};
/**
* INVARIANT: Capacitor wins over standalone (WebView is also standalone).
* CRX wins over PWA. Web and PWA on the same origin keep different slices.
*/
var detectSettingsHost = () => {
	if (isCwspNativeHost()) return "capacitor";
	if (isCrxHost()) return "crx";
	if (isPwaStandalone()) return "pwa";
	return "web";
};
//#endregion
//#region src/shared/other/config/open-policy.ts
/**
* What to do with a file or payload, per surface / channel / kind.
* INVARIANT: `ask` keeps the current SKU / content-type router.
* Explorer: Web uses `channels`/`kinds`/`placement`. Capacitor uses `nativeOpen`/`nativeKinds` only.
* Host slices live in `openPolicyByHost` (`settings-host.ts`).
*/
var open_policy_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_OPEN_POLICY: () => DEFAULT_OPEN_POLICY,
	OPEN_CHANNELS: () => OPEN_CHANNELS,
	OPEN_KINDS: () => OPEN_KINDS,
	OPEN_PLACEMENTS: () => OPEN_PLACEMENTS,
	OPEN_SINKS: () => OPEN_SINKS,
	OPEN_SURFACES: () => OPEN_SURFACES,
	adaptExplorerSinkForNative: () => adaptExplorerSinkForNative,
	classifyOpenKind: () => classifyOpenKind,
	classifyOpenKindFromName: () => classifyOpenKindFromName,
	classifyOpenKindFromPayload: () => classifyOpenKindFromPayload,
	inferIngressChannels: () => inferIngressChannels,
	looksLikePreviewableBinary: () => looksLikePreviewableBinary,
	mergeOpenPolicy: () => mergeOpenPolicy,
	mergeOpenPolicyByHost: () => mergeOpenPolicyByHost,
	normalizeOpenChannel: () => normalizeOpenChannel,
	normalizeOpenKind: () => normalizeOpenKind,
	normalizeOpenPlacement: () => normalizeOpenPlacement,
	normalizeOpenPolicy: () => normalizeOpenPolicy,
	normalizeOpenSink: () => normalizeOpenSink,
	normalizeOpenSurface: () => normalizeOpenSurface,
	peekOpenPolicy: () => peekOpenPolicy,
	rememberOpenPolicyFromSettings: () => rememberOpenPolicyFromSettings,
	resolveExplorerOpenSink: () => resolveExplorerOpenSink,
	resolveHostOpenPolicy: () => resolveHostOpenPolicy,
	resolveOpenPlacement: () => resolveOpenPlacement,
	resolveOpenPolicy: () => resolveOpenPolicy,
	sinkToAction: () => sinkToAction,
	sinkToDestination: () => sinkToDestination,
	sinkToOpenLinkTarget: () => sinkToOpenLinkTarget,
	skuForOpenSink: () => skuForOpenSink,
	stampHostOpenPolicy: () => stampHostOpenPolicy,
	surfaceForSku: () => surfaceForSku,
	viewIdForOpenSink: () => viewIdForOpenSink
});
var OPEN_KINDS = [
	"markdown",
	"text",
	"document",
	"image",
	"url",
	"other"
];
var OPEN_SINKS = [
	"ask",
	"display",
	"viewer",
	"document",
	"explorer",
	"workcenter",
	"transfer",
	"wallpaper",
	"external",
	"system"
];
var OPEN_CHANNELS = [
	"open",
	"dblclick",
	"share-target",
	"launch-queue",
	"snip",
	"capacitor"
];
var OPEN_SURFACES = [
	"viewer",
	"explorer",
	"shell",
	"crx",
	"process",
	"transfer"
];
/** How Explorer presents markdown/images in the browser (not Capacitor). */
var OPEN_PLACEMENTS = [
	"inline",
	"native-window",
	"new-tab"
];
var KIND_SET = new Set(OPEN_KINDS);
var SINK_SET = new Set(OPEN_SINKS);
var CHANNEL_SET = new Set(OPEN_CHANNELS);
var SURFACE_SET = new Set(OPEN_SURFACES);
var IMAGE_EXT = /\.(?:png|jpe?g|gif|webp|bmp|svg|avif|ico|jxl|tiff?|heic|heif)(?:$|[?#])/i;
var MARKDOWN_EXT = /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i;
var TEXT_EXT = /\.(?:txt|text|html|htm|css|scss|sass|less|json|csv|xml|yaml|yml|log|ini|env|toml|graphql|tsx?|jsx?|mts|cts|cjs|mjs|vue|svelte|rst)(?:$|[?#])/i;
var DOCUMENT_EXT = /\.(?:pdf|docx?|odt|rtf|pages|epub|pptx?|xlsx?|ods|odp)(?:$|[?#])/i;
var DEFAULT_OPEN_POLICY = {
	viewer: {
		channels: {
			open: "display",
			"share-target": "display",
			"launch-queue": "display",
			capacitor: "display"
		},
		kinds: {
			markdown: "display",
			text: "display",
			document: "display",
			image: "display",
			url: "display",
			other: "display"
		}
	},
	explorer: {
		channels: {
			open: "viewer",
			dblclick: "viewer",
			"share-target": "viewer",
			"launch-queue": "viewer",
			capacitor: "document"
		},
		placement: "inline",
		kinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "ask",
			url: "ask",
			other: "ask"
		},
		nativeOpen: "document",
		nativeKinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "ask",
			url: "ask",
			other: "ask"
		}
	},
	shell: {
		channels: {
			open: "ask",
			"share-target": "ask",
			"launch-queue": "ask",
			capacitor: "ask"
		},
		kinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "wallpaper",
			url: "ask",
			other: "ask"
		}
	},
	crx: {
		channels: {
			open: "ask",
			snip: "workcenter",
			"share-target": "ask"
		},
		kinds: {
			markdown: "viewer",
			text: "viewer",
			document: "viewer",
			image: "workcenter",
			url: "workcenter",
			other: "workcenter"
		}
	},
	process: {
		channels: {
			open: "workcenter",
			"share-target": "workcenter",
			"launch-queue": "workcenter",
			capacitor: "workcenter"
		},
		kinds: {
			markdown: "workcenter",
			text: "workcenter",
			document: "workcenter",
			image: "workcenter",
			url: "workcenter",
			other: "workcenter"
		}
	},
	transfer: {
		channels: {
			open: "ask",
			"share-target": "ask",
			"launch-queue": "ask",
			capacitor: "ask"
		},
		kinds: {
			markdown: "ask",
			text: "ask",
			document: "ask",
			image: "ask",
			url: "ask",
			other: "ask"
		}
	}
};
var cachedPolicy = DEFAULT_OPEN_POLICY;
var normalizeOpenSink = (raw, fallback = "ask") => {
	const v = String(raw || "").trim().toLowerCase();
	if (!v) return fallback;
	if (v === "markdown" || v === "in-shell" || v === "in-app") return "viewer";
	if (v === "document" || v === "cwsp-document" || v === "md") return "document";
	if (v === "process" || v === "cwsp-process") return "workcenter";
	if (v === "transfer" || v === "cwsp" || v === "cwsp-transfer" || v === "network") return "transfer";
	if (v === "wallpaper" || v === "обои" || v === "backdrop" || v === "desktop") return "wallpaper";
	if (v === "android" || v === "chooser" || v === "open-with") return "system";
	if (v === "browser" || v === "new-tab" || v === "tab") return "external";
	return SINK_SET.has(v) ? v : fallback;
};
var normalizeOpenPlacement = (raw, fallback = "inline") => {
	const v = String(raw || "").trim().toLowerCase();
	if (!v) return fallback;
	if (v === "in-shell" || v === "env" || v === "shell" || v === "iframe") return "inline";
	if (v === "native" || v === "popup" || v === "app-window" || v === "detached" || v === "separate") return "native-window";
	if (v === "tab" || v === "browser" || v === "as-is" || v === "browser-tab") return "new-tab";
	return OPEN_PLACEMENTS.includes(v) ? v : fallback;
};
var normalizeOpenKind = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	return KIND_SET.has(v) ? v : "";
};
var normalizeOpenChannel = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "dbl-click" || v === "double-click") return "dblclick";
	if (v === "share" || v === "sharetarget") return "share-target";
	if (v === "launch" || v === "launchqueue") return "launch-queue";
	return CHANNEL_SET.has(v) ? v : "";
};
var normalizeOpenSurface = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "document" || v === "markdown") return "viewer";
	if (v === "launcher" || v === "environment" || v === "home") return "shell";
	return SURFACE_SET.has(v) ? v : "";
};
var normalizeKinds = (raw) => {
	const out = {};
	if (!raw || typeof raw !== "object") return out;
	for (const key of OPEN_KINDS) {
		const sink = raw[key];
		if (sink == null || sink === "") continue;
		out[key] = normalizeOpenSink(sink);
	}
	return out;
};
var normalizeChannels = (raw) => {
	const out = {};
	if (!raw || typeof raw !== "object") return out;
	for (const key of OPEN_CHANNELS) {
		const sink = raw[key];
		if (sink == null || sink === "") continue;
		out[key] = normalizeOpenSink(sink);
	}
	return out;
};
var mergeOpenPolicy = (...parts) => {
	const out = {};
	for (const surface of OPEN_SURFACES) {
		const base = DEFAULT_OPEN_POLICY[surface] || {};
		let channels = { ...base.channels || {} };
		let kinds = { ...base.kinds || {} };
		let placement = normalizeOpenPlacement(base.placement, "inline");
		let nativeOpen = normalizeOpenSink(base.nativeOpen, surface === "explorer" ? "document" : "ask");
		let nativeKinds = { ...base.nativeKinds || {} };
		let nativeOpenSaved = false;
		for (const part of parts) {
			const src = part?.[surface];
			if (!src) continue;
			channels = {
				...channels,
				...normalizeChannels(src.channels)
			};
			kinds = {
				...kinds,
				...normalizeKinds(src.kinds)
			};
			if (src.placement != null && src.placement !== "") placement = normalizeOpenPlacement(src.placement, placement);
			if (src.nativeOpen != null && src.nativeOpen !== "") {
				nativeOpenSaved = true;
				nativeOpen = normalizeOpenSink(src.nativeOpen, nativeOpen);
			}
			if (src.nativeKinds) nativeKinds = {
				...nativeKinds,
				...normalizeKinds(src.nativeKinds)
			};
		}
		if (!nativeOpenSaved && surface === "explorer") {
			const legacy = channels.open;
			if (legacy === "system" || legacy === "transfer" || legacy === "workcenter") nativeOpen = legacy;
		}
		out[surface] = surface === "explorer" ? {
			channels,
			kinds,
			placement,
			nativeOpen,
			nativeKinds
		} : {
			channels,
			kinds,
			placement
		};
	}
	return out;
};
var normalizeOpenPolicy = (raw) => mergeOpenPolicy(raw && typeof raw === "object" ? raw : void 0);
var mergeOpenPolicyByHost = (...parts) => {
	const out = {};
	for (const host of SETTINGS_HOSTS) {
		const slices = parts.map((part) => part?.[host]).filter((p) => Boolean(p));
		if (slices.length) out[host] = mergeOpenPolicy(...slices);
	}
	return out;
};
/** Host slice wins over a leftover flat `openPolicy` so Capacitor cannot clobber Web. */
var resolveHostOpenPolicy = (settings) => {
	const host = detectSettingsHost();
	return mergeOpenPolicy(settings?.openPolicy, settings?.openPolicyByHost?.[host]);
};
var stampHostOpenPolicy = (settings) => {
	const host = detectSettingsHost();
	const next = mergeOpenPolicy(settings.openPolicy);
	settings.openPolicy = next;
	settings.openPolicyByHost = {
		...settings.openPolicyByHost || {},
		[host]: next
	};
	return next;
};
var rememberOpenPolicyFromSettings = (settings) => {
	cachedPolicy = resolveHostOpenPolicy(settings);
	return cachedPolicy;
};
var peekOpenPolicy = () => cachedPolicy;
var surfaceForSku = (sku) => {
	const v = String(sku || "").trim().toLowerCase();
	if (v === "document") return "viewer";
	if (v === "explorer") return "explorer";
	if (v === "launcher") return "shell";
	if (v === "process") return "process";
	if (v === "transfer") return "transfer";
	if (v === "crx") return "crx";
	return "";
};
var basenameOf = (raw) => {
	const t = String(raw || "").trim().replace(/\\/g, "/");
	const noQuery = t.split(/[?#]/)[0] || t;
	const cut = noQuery.lastIndexOf("/");
	return (cut >= 0 ? noQuery.slice(cut + 1) : noQuery).trim();
};
var classifyOpenKindFromName = (raw, mime = "") => {
	const name = basenameOf(raw);
	const type = String(mime || "").toLowerCase();
	if (type.startsWith("image/") || IMAGE_EXT.test(name)) return "image";
	if (type === "text/markdown" || type.includes("markdown") || MARKDOWN_EXT.test(name)) return "markdown";
	if (type === "application/pdf" || type.includes("officedocument") || type.includes("msword") || type.includes("opendocument") || DOCUMENT_EXT.test(name)) return "document";
	if (type.startsWith("text/") || type === "application/json" || type === "application/xml" || type === "application/javascript" || type === "application/typescript" || TEXT_EXT.test(name)) return "text";
	return "other";
};
var classifyOpenKind = (file) => {
	if (!file) return "other";
	if (typeof file === "string") return classifyOpenKindFromName(file);
	return classifyOpenKindFromName(String(file.name || ""), String(file.type || ""));
};
/** Image or PDF — viewer can paint these without treating bytes as markdown. */
var looksLikePreviewableBinary = (file) => {
	if (!file) return false;
	if (classifyOpenKind(file) === "image") return true;
	const name = String(file.name || "");
	return String(file.type || "").toLowerCase() === "application/pdf" || /\.pdf(?:$|[?#])/i.test(name);
};
var classifyOpenKindFromPayload = (payload) => {
	const files = Array.isArray(payload.files) ? payload.files : [];
	if (files[0]) return classifyOpenKind(files[0]);
	const hinted = String(payload.hint?.contentType || "").toLowerCase();
	if (hinted === "markdown" || hinted === "text" || hinted === "image" || hinted === "url") return hinted;
	const name = String(payload.hint?.filename || payload.title || "").trim();
	if (name && (!payload.url || Number(payload.fileCount || 0) > 0)) {
		const fromName = classifyOpenKindFromName(name);
		if (fromName !== "other") return fromName;
	}
	const url = String(payload.url || "").trim();
	if (url) {
		const fromUrl = classifyOpenKindFromName(url);
		return fromUrl === "other" ? "url" : fromUrl;
	}
	if (String(payload.text || "").trim()) return "text";
	return "other";
};
var firstNonAsk = (...sinks) => {
	for (const sink of sinks) if (sink && sink !== "ask") return sink;
	return "";
};
/**
* Explorer: channel (Open / click) wins, kind is an override only when channel is `ask`.
* Other surfaces: kind override → first non-`ask` channel.
*/
var resolveOpenPolicy = (policy, surface, kind, channels = "open") => {
	const surf = normalizeOpenSurface(surface);
	if (!surf) return "ask";
	const block = mergeOpenPolicy(policy)[surf] || {};
	const kinds = block.kinds || {};
	const chans = block.channels || {};
	const kindSink = kind && kinds[kind] ? kinds[kind] : void 0;
	const channelSinks = (Array.isArray(channels) ? channels : [channels]).map((ch) => normalizeOpenChannel(ch)).filter((ch) => Boolean(ch)).map((ch) => chans[ch]);
	if (surf === "explorer") return firstNonAsk(...channelSinks, kindSink) || kindSink || channelSinks[0] || "ask";
	return firstNonAsk(kindSink, ...channelSinks) || kindSink || channelSinks[0] || "ask";
};
/**
* Capacitor Explorer has no inline viewer.
* `document` → CWSP-document. `system` / `ask` / `external` → Android Open-with.
* `viewer` / `display` only map to Document so a leftover web default still opens the APK.
*/
var adaptExplorerSinkForNative = (sink) => {
	if (sink === "viewer" || sink === "display") return "document";
	if (sink === "ask" || sink === "external") return "system";
	return sink;
};
var NATIVE_EXPLORER_SINKS = /* @__PURE__ */ new Set([
	"document",
	"system",
	"transfer",
	"workcenter"
]);
/**
* INVARIANT: Web reads `channels`/`kinds` only. Capacitor reads `nativeOpen`/`nativeKinds` only.
* A leftover `channels.open` of document/system is honored on native until Settings saves `nativeOpen`.
*/
var resolveExplorerOpenSink = (policy, kind, native, how = "open") => {
	const block = mergeOpenPolicy(policy).explorer || {};
	if (native) {
		const kindSink = kind && block.nativeKinds?.[kind] ? block.nativeKinds[kind] : void 0;
		const legacy = block.channels?.open;
		const open = normalizeOpenSink(block.nativeOpen || (legacy && NATIVE_EXPLORER_SINKS.has(legacy) ? legacy : "") || block.channels?.capacitor, "document");
		return adaptExplorerSinkForNative(firstNonAsk(kindSink, open) || open);
	}
	const ch = how === "dblclick" ? block.channels?.dblclick : block.channels?.open;
	const kindSink = kind && block.kinds?.[kind] ? block.kinds[kind] : void 0;
	return firstNonAsk(ch, kindSink) || kindSink || ch || "viewer";
};
var sinkToDestination = (sink, fallback) => {
	if (sink === "viewer" || sink === "document") return "viewer";
	if (sink === "explorer") return "explorer";
	if (sink === "workcenter") return "workcenter";
	if (sink === "transfer") return "network";
	if (sink === "wallpaper") return "home";
	if (sink === "display") return fallback;
	return fallback;
};
var sinkToAction = (sink, fallback = "open") => {
	if (sink === "workcenter") return "process";
	if (sink === "viewer" || sink === "display" || sink === "document" || sink === "transfer") return "open";
	if (sink === "explorer") return "open";
	if (sink === "wallpaper") return "wallpaper";
	return fallback;
};
/** Sibling SKU for a sink. `viewer` / `display` stay in this app. */
var skuForOpenSink = (sink) => {
	if (sink === "document") return "document";
	if (sink === "workcenter") return "process";
	if (sink === "transfer") return "transfer";
	if (sink === "explorer") return "explorer";
	return "";
};
/** Per-tile Speed Dial target for a sink. `ask` leaves the tile unset (global default). */
var sinkToOpenLinkTarget = (sink) => {
	if (sink === "viewer" || sink === "display") return "viewer";
	if (sink === "document") return "document";
	if (sink === "explorer") return "explorer";
	if (sink === "workcenter") return "workcenter";
	if (sink === "transfer") return "transfer";
	if (sink === "system" || sink === "external") return "external-app";
	return "";
};
var resolveOpenPlacement = (policy, surface = "explorer") => {
	const surf = normalizeOpenSurface(surface) || "explorer";
	return normalizeOpenPlacement(mergeOpenPolicy(policy)[surf]?.placement, "inline");
};
var viewIdForOpenSink = (sink) => {
	if (sink === "document" || sink === "viewer") return "viewer";
	if (sink === "workcenter") return "workcenter";
	if (sink === "transfer") return "network";
	if (sink === "explorer") return "explorer";
	return "";
};
var inferIngressChannels = (source, native) => {
	const src = String(source || "").toLowerCase();
	const out = [];
	if (native && (src === "launch-queue" || src === "share-target" || src === "capacitor")) out.push("capacitor");
	if (src === "share-target") out.push("share-target");
	else if (src === "launch-queue") out.push("launch-queue");
	else if (src === "snip") out.push("snip");
	else out.push("open");
	return out;
};
//#endregion
export { surfaceForSku as C, stampHostOpenPolicy as S, detectSettingsHost as T, resolveOpenPolicy as _, classifyOpenKindFromPayload as a, sinkToOpenLinkTarget as b, mergeOpenPolicy as c, open_policy_exports as d, peekOpenPolicy as f, resolveOpenPlacement as g, resolveHostOpenPolicy as h, classifyOpenKindFromName as i, mergeOpenPolicyByHost as l, resolveExplorerOpenSink as m, OPEN_KINDS as n, inferIngressChannels as o, rememberOpenPolicyFromSettings as p, classifyOpenKind as r, looksLikePreviewableBinary as s, DEFAULT_OPEN_POLICY as t, normalizeOpenSink as u, sinkToAction as v, viewIdForOpenSink as w, skuForOpenSink as x, sinkToDestination as y };
