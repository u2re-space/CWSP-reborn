//#region src/shared/routing/api/process-api-path.ts
var PROCESS_API_PUBLIC_ORIGIN = "https://process.u2re.space";
var PROCESS_API_PREFIX = "/api/process";
//#endregion
//#region src/shared/routing/api/process-local.ts
var PROCESS_LOCAL_DEFAULT_BASE_URL = "https://api.proxyapi.ru/openai/v1";
var PROCESS_LOCAL_DEFAULT_MODEL = "gpt-5.6-luna";
var pick = (...values) => {
	for (const value of values) {
		const text = String(value || "").trim();
		if (text) return text;
	}
	return "";
};
/** OpenAI-compatible completion when CWSP core / VDS is down. */
var runLocalProcessFallback = async (body, source = "local") => {
	if (!body || typeof body !== "object") return null;
	const apiKey = pick(body.apiKey, body.bearerToken, body.token, body.provider?.apiKey);
	if (!apiKey) return null;
	const input = pick(body.input, body.text, body.url, body.content);
	if (!input) return {
		ok: false,
		error: "Missing input (text/url/input)",
		fallback: source
	};
	const baseUrl = pick(body.baseUrl, body.provider?.baseUrl, PROCESS_LOCAL_DEFAULT_BASE_URL).replace(/\/+$/, "");
	const model = pick(body.model, body.provider?.model, PROCESS_LOCAL_DEFAULT_MODEL);
	const instruction = pick(body.customInstruction);
	const imageUrl = input.startsWith("data:image/") && input.includes(";base64,") ? input : "";
	const extractNow = "Extract all readable text, equations, tables, and data. Output the content now. Do not ask what to do.";
	const userContent = imageUrl ? [{
		type: "text",
		text: instruction ? `${extractNow}\n\n${instruction}` : extractNow
	}, {
		type: "image_url",
		image_url: { url: imageUrl }
	}] : input;
	const messages = [...instruction && !imageUrl ? [{
		role: "system",
		content: instruction
	}] : [], {
		role: "user",
		content: userContent
	}];
	try {
		const res = await fetch(`${baseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model,
				messages
			})
		});
		const json = await res.json().catch(() => null);
		if (!res.ok) return {
			ok: false,
			error: String(json?.error?.message || `Provider ${res.status}`),
			layer: "api",
			fallback: source
		};
		const text = String(json?.choices?.[0]?.message?.content || "").trim();
		if (!text) return {
			ok: false,
			error: "Empty provider response",
			fallback: source
		};
		return {
			ok: true,
			mode: String(body.mode || "smartRecognize"),
			customInstruction: Boolean(instruction),
			provider: {
				baseUrl,
				model,
				apiKeySource: "request"
			},
			result: {
				ok: true,
				text
			},
			fallback: source
		};
	} catch (error) {
		return {
			ok: false,
			error: String(error instanceof Error ? error.message : error),
			layer: "api",
			fallback: source
		};
	}
};
//#endregion
//#region src/shared/routing/api/process-api.ts
var PROCESS_API_SUFFIX = {
	processing: "processing",
	recognize: "ai/recognize",
	analyze: "ai/analyze",
	health: "health"
};
var PROCESS_SAME_ORIGIN_HOSTS = /* @__PURE__ */ new Set([
	"process.u2re.space",
	"workcenter.u2re.space",
	"ai.u2re.space",
	"u2re.space",
	"www.u2re.space"
]);
var isExtensionProtocol = (protocol) => protocol === "chrome-extension:" || protocol === "moz-extension:" || protocol === "safari-web-extension:";
var isCapacitorNative = () => {
	try {
		const g = globalThis;
		return typeof g.Capacitor?.isNativePlatform === "function" && g.Capacitor.isNativePlatform();
	} catch {
		return false;
	}
};
/** Dedicated process / hub hosts stay same-origin. Everything else uses https://process.u2re.space. */
var needsRemoteProcessApi = () => {
	try {
		if (isExtensionProtocol(String(globalThis.location?.protocol || "").toLowerCase())) return true;
		const host = String(globalThis.location?.hostname || "").toLowerCase();
		if (isCapacitorNative()) return !PROCESS_SAME_ORIGIN_HOSTS.has(host);
		if (!host) return true;
		return !PROCESS_SAME_ORIGIN_HOSTS.has(host);
	} catch {
		return true;
	}
};
var processApiPath = (suffix = "processing") => `${PROCESS_API_PREFIX}/${PROCESS_API_SUFFIX[suffix]}`;
var resolveProcessApiUrl = (suffix = "processing") => {
	const path = processApiPath(suffix);
	return needsRemoteProcessApi() ? `${PROCESS_API_PUBLIC_ORIGIN}${path}` : path;
};
var processApiAuthFromSettings = (settings) => {
	const core = settings?.core || {};
	const socket = core.socket || {};
	const accessToken = String(socket.accessToken || socket.airpadAuthToken || "").trim();
	return {
		userId: String(core.userId || "").trim() || void 0,
		userKey: String(core.userKey || "").trim() || void 0,
		accessToken: accessToken || void 0,
		apiKey: String(settings?.ai?.apiKey || "").trim() || void 0,
		baseUrl: String(settings?.ai?.baseUrl || "").trim() || void 0,
		model: String(settings?.ai?.model || "").trim() || void 0,
		mcp: Array.isArray(settings?.ai?.mcp) ? settings.ai.mcp : void 0
	};
};
var looksLikeHtmlPayload = (value) => {
	const text = typeof value === "string" ? value : value && typeof value === "object" && "error" in value ? String(value.error || "") : "";
	return /^\s*</.test(text) || /<!doctype\s+html/i.test(text) || /data-cwsp-sku/i.test(text);
};
/** True when :443 never reached a working CWSP core — caller should run in-browser AI. */
var isProcessApiUnavailable = (posted) => {
	if (posted.status === 0 || posted.status >= 500) return true;
	if (looksLikeHtmlPayload(posted.error) || looksLikeHtmlPayload(posted.json)) return true;
	const error = String(posted.error || "").toLowerCase();
	if (/failed to fetch|networkerror|econnrefused|certificate|aborted/.test(error)) return true;
	if (!posted.json || typeof posted.json !== "object") return !posted.ok;
	const row = posted.json;
	if (looksLikeHtmlPayload(row.error)) return true;
	if (row.ok !== false) return false;
	const detail = `${row.error || ""} ${row.hint || ""}`.toLowerCase();
	return row.layer === "api" || /unreachable|econnrefused|certificate|bad gateway/.test(detail);
};
var fetchProcessApi = async (url, suffix, payload, init) => {
	try {
		const isGet = suffix === "health";
		const res = await fetch(url, {
			method: isGet ? "GET" : "POST",
			headers: isGet ? { Accept: "application/json" } : {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: isGet ? void 0 : JSON.stringify(payload),
			signal: init?.signal
		});
		const text = await res.text();
		if (looksLikeHtmlPayload(text) || String(res.headers.get("content-type") || "").toLowerCase().includes("text/html")) return {
			ok: false,
			status: res.status || 404,
			json: {
				ok: false,
				layer: "api",
				error: "Process API returned HTML"
			}
		};
		let json = null;
		try {
			json = text ? JSON.parse(text) : null;
		} catch {
			json = {
				ok: false,
				error: text
			};
		}
		return {
			ok: res.ok,
			status: res.status,
			json
		};
	} catch (error) {
		return {
			ok: false,
			status: 0,
			json: null,
			error: String(error instanceof Error ? error.message : error)
		};
	}
};
var tryNativeProcessApi = async (payload) => {
	if (!isCapacitorNative()) return null;
	try {
		const { CwsBridge } = await import(
			/* @vite-ignore */
			"../native/cws-bridge.ts"
);
		const plugin = CwsBridge;
		const row = typeof plugin.processApi === "function" ? await plugin.processApi(payload) : await CwsBridge.invoke({
			channel: "process:api",
			payload
		});
		if (!row || typeof row !== "object") return null;
		const json = row;
		if (json.echo && json.ok === true && json.error == null && !("result" in json) && !("fallback" in json)) return null;
		return {
			ok: json.ok !== false,
			status: 200,
			json
		};
	} catch {
		return null;
	}
};
var postProcessApi = async (suffix, body = {}, auth, init) => {
	const path = processApiPath(suffix);
	const payload = {
		...body,
		...auth?.userId ? { userId: auth.userId } : {},
		...auth?.userKey ? { userKey: auth.userKey } : {},
		...auth?.baseUrl ? { baseUrl: auth.baseUrl } : {},
		...auth?.accessToken ? { accessToken: auth.accessToken } : {},
		...auth?.apiKey ? { apiKey: auth.apiKey } : {},
		...auth?.model ? { model: auth.model } : {},
		...auth?.mcp ? { mcp: auth.mcp } : {}
	};
	if (suffix !== "health" && (auth?.apiKey || payload.apiKey)) {
		const native = await tryNativeProcessApi(payload);
		if (native && !isProcessApiUnavailable(native) && native.json) return native;
	}
	const urls = [];
	const remote = `${PROCESS_API_PUBLIC_ORIGIN}${path}`;
	const local = path;
	if (needsRemoteProcessApi()) urls.push(remote);
	else {
		urls.push(local);
		if (isCapacitorNative()) urls.push(remote);
	}
	let last = null;
	for (const url of urls) {
		last = await fetchProcessApi(url, suffix, payload, init);
		if (!isProcessApiUnavailable(last)) return last;
	}
	if (suffix !== "health") {
		const local = await runLocalProcessFallback(payload, "page");
		if (local && local.ok !== false) return {
			ok: true,
			status: 200,
			json: local
		};
	}
	return last ?? {
		ok: false,
		status: 0,
		json: null,
		error: "Process API unavailable"
	};
};
//#endregion
//#region src/shared/other/config/Names.ts
/**
* Centralized naming system for CWSP-shell application
* Consolidates component names, channel names, route names, etc.
*/
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
* API endpoint paths
* INVARIANT: PROCESSING resolves at call time so CRX / Capacitor hit process.u2re.space.
* COMPAT: :443 still accepts POST /api/processing.
*/
var API_ENDPOINTS = {
	get PROCESSING() {
		return resolveProcessApiUrl("processing");
	},
	ANALYZE: "/api/analyze",
	TEST: "/api/test",
	HEALTH: "/health",
	ICONS: "/assets/icons",
	DUOTONE_ICONS: "/assets/icons/duotone",
	PHOSPHOR_ICONS: "/assets/icons/phosphor",
	ICON_PROXY: "/api/icon-proxy",
	SHARE_TARGET: "/share-target",
	SHARE_TARGET_ALT: "/share_target",
	LAUNCH_QUEUE: "/launch-queue",
	SW_CONTENT: "/sw-content",
	SW_CONTENT_AVAILABLE: "/sw-content/available",
	CLIPBOARD_PENDING: "/clipboard/pending",
	CLIPBOARD_CLEAR: "/clipboard/clear"
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
* Content type identifiers
*/
var CONTENT_TYPES = {
	TEXT: "text",
	URL: "url",
	FILE: "file",
	IMAGE: "image",
	MARKDOWN: "markdown",
	HTML: "html",
	JSON: "json",
	PDF: "pdf",
	AUDIO: "audio",
	VIDEO: "video",
	OTHER: "other"
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
var normalizeViewId = (value) => {
	const canonical = normalizeDestination(value);
	if (CANONICAL_VIEW_IDS.includes(canonical)) return canonical;
	return "viewer";
};
var getBroadcastChannelForDestination = (value) => {
	switch (normalizeDestination(value)) {
		case "viewer": return BROADCAST_CHANNELS.MARKDOWN_VIEWER;
		case "workcenter": return BROADCAST_CHANNELS.WORK_CENTER;
		case "explorer": return BROADCAST_CHANNELS.FILE_EXPLORER;
		case "settings": return BROADCAST_CHANNELS.SETTINGS;
		case "history": return BROADCAST_CHANNELS.HISTORY_VIEWER;
		case "print": return BROADCAST_CHANNELS.PRINT_VIEWER;
		case "clipboard": return BROADCAST_CHANNELS.CLIPBOARD;
		case "main-app": return BROADCAST_CHANNELS.MAIN_APP;
		case "basic-app": return BROADCAST_CHANNELS.MINIMAL_APP;
		default: return null;
	}
};
var createDestinationChannelMappings = () => {
	const mappings = {};
	for (const canonical of Object.keys(DESTINATION_ALIASES)) {
		const channel = getBroadcastChannelForDestination(canonical);
		if (!channel) continue;
		for (const alias of getDestinationAliases(canonical)) mappings[alias] = channel;
	}
	return mappings;
};
BROADCAST_CHANNELS.SERVICE_WORKCENTER, BROADCAST_CHANNELS.SERVICE_SETTINGS, BROADCAST_CHANNELS.SERVICE_VIEWER, BROADCAST_CHANNELS.SERVICE_EXPLORER, BROADCAST_CHANNELS.SERVICE_AIRPAD, BROADCAST_CHANNELS.SERVICE_NETWORK, BROADCAST_CHANNELS.SERVICE_PRINT, BROADCAST_CHANNELS.SERVICE_HISTORY, BROADCAST_CHANNELS.SERVICE_EDITOR, BROADCAST_CHANNELS.SERVICE_HOME;
ROUTE_HASHES.WORKCENTER, ROUTE_HASHES.SETTINGS, ROUTE_HASHES.MARKDOWN_VIEWER, ROUTE_HASHES.FILE_EXPLORER, ROUTE_HASHES.NETWORK, ROUTE_HASHES.PRINT, ROUTE_HASHES.HISTORY, ROUTE_HASHES.MARKDOWN_EDITOR;
//#endregion
export { DESTINATIONS as a, getBroadcastChannelForDestination as c, normalizeViewId as d, viewBroadcastChannelName as f, resolveProcessApiUrl as g, processApiAuthFromSettings as h, CONTENT_TYPES as i, getDestinationAliases as l, postProcessApi as m, BROADCAST_CHANNELS as n, ROUTE_HASHES as o, isProcessApiUnavailable as p, COMPONENTS as r, createDestinationChannelMappings as s, API_ENDPOINTS as t, normalizeDestination as u };
