import { r as __exportAll } from "./rolldown-runtime.js";
//#region src/shared/other/config/ecosystem-skus.ts
var ecosystem_skus_exports = /* @__PURE__ */ __exportAll({
	CWSP_SKU_HANDOFF_KEY: () => CWSP_SKU_HANDOFF_KEY,
	ECOSYSTEM_SKUS: () => ECOSYSTEM_SKUS,
	HUB_PUBLIC_HOSTS: () => HUB_PUBLIC_HOSTS,
	SKU_HUB_PATHS: () => SKU_HUB_PATHS,
	SKU_LOCAL_NAV_VIEWS: () => SKU_LOCAL_NAV_VIEWS,
	SKU_PUBLIC_HOSTS: () => SKU_PUBLIC_HOSTS,
	SKU_PUBLIC_HUB_PATH: () => SKU_PUBLIC_HUB_PATH,
	VIEW_TO_SIBLING_SKU: () => VIEW_TO_SIBLING_SKU,
	androidPackageForSku: () => androidPackageForSku,
	apkManifestForSku: () => apkManifestForSku,
	applyCwspSku: () => applyCwspSku,
	ensureCwspSkuFromLocation: () => ensureCwspSkuFromLocation,
	inferCwspSkuFromLocation: () => inferCwspSkuFromLocation,
	isCwspNativeHost: () => isCwspNativeHost,
	isCwspSku: () => isCwspSku,
	isHubPublicHost: () => isHubPublicHost,
	isViewLocalToSurface: () => isViewLocalToSurface,
	isWebHubSurface: () => isWebHubSurface,
	publicHrefForSku: () => publicHrefForSku,
	publicHrefForView: () => publicHrefForView,
	readCwspSku: () => readCwspSku,
	shouldHandoffViewToSibling: () => shouldHandoffViewToSibling,
	siblingSkuForView: () => siblingSkuForView,
	skuForHubPathSegment: () => skuForHubPathSegment,
	stashSkuHandoff: () => stashSkuHandoff,
	takeSkuHandoff: () => takeSkuHandoff
});
var ECOSYSTEM_SKUS = {
	launcher: {
		sku: "launcher",
		androidPackage: "space.u2re.cw",
		scheme: "space.u2re.cw",
		phosphorIcon: "cross",
		defaultView: "home",
		shell: "environment",
		apkManifest: "latest-launcher.json",
		apkName: "cwsp-launcher.apk"
	},
	transfer: {
		sku: "transfer",
		androidPackage: "space.u2re.cwsp",
		scheme: "space.u2re.cwsp",
		phosphorIcon: "drone",
		defaultView: "network",
		shell: "minimal",
		apkManifest: "latest.json",
		apkName: "cwsp.apk"
	},
	explorer: {
		sku: "explorer",
		androidPackage: "space.u2re.explorer",
		scheme: "space.u2re.explorer",
		phosphorIcon: "folder",
		defaultView: "explorer",
		shell: "minimal",
		apkManifest: "latest-explorer.json",
		apkName: "cwsp-explorer.apk"
	},
	document: {
		sku: "document",
		androidPackage: "space.u2re.document",
		scheme: "space.u2re.document",
		phosphorIcon: "books",
		defaultView: "viewer",
		shell: "minimal",
		apkManifest: "latest-document.json",
		apkName: "cwsp-document.apk"
	},
	process: {
		sku: "process",
		androidPackage: "space.u2re.process",
		scheme: "space.u2re.process",
		phosphorIcon: "magic-wand",
		defaultView: "workcenter",
		shell: "minimal",
		apkManifest: "latest-process.json",
		apkName: "cwsp-process.apk"
	},
	crx: {
		sku: "crx",
		androidPackage: null,
		scheme: "chrome-extension",
		phosphorIcon: "cross",
		defaultView: "home",
		shell: "environment",
		apkManifest: "",
		apkName: ""
	}
};
var SKU_SET = new Set(Object.keys(ECOSYSTEM_SKUS));
/** Views that leave the launcher APK and open a sibling SKU. */
var VIEW_TO_SIBLING_SKU = {
	explorer: "explorer",
	viewer: "document",
	editor: "document",
	markdown: "document",
	print: "document",
	workcenter: "process",
	network: "transfer"
};
var isCwspSku = (value) => typeof value === "string" && SKU_SET.has(value);
var readCwspSku = () => {
	try {
		const raw = String(document.documentElement?.dataset?.cwspSku || "").trim().toLowerCase();
		return isCwspSku(raw) ? raw : "";
	} catch {
		return "";
	}
};
/** Stamp `data-cwsp-sku` so Settings / openView / APK update resolve the same host. */
var applyCwspSku = (sku) => {
	try {
		document.documentElement.dataset.cwspSku = sku;
		const rec = ECOSYSTEM_SKUS[sku];
		if (rec.defaultView && !document.documentElement.dataset.cwspDefaultView) document.documentElement.dataset.cwspDefaultView = rec.defaultView;
	} catch {}
};
var siblingSkuForView = (view) => {
	return VIEW_TO_SIBLING_SKU[String(view || "").trim().toLowerCase()] || null;
};
var HUB_PUBLIC_HOSTS = ["u2re.space", "www.u2re.space"];
var SKU_PUBLIC_HOSTS = {
	document: ["md.u2re.space", "www.md.u2re.space"],
	explorer: ["explorer.u2re.space", "www.explorer.u2re.space"],
	process: [
		"process.u2re.space",
		"workcenter.u2re.space",
		"ai.u2re.space"
	],
	transfer: [
		"cwsp.u2re.space",
		"www.cwsp.u2re.space",
		"transfer.u2re.space"
	]
};
/** Hub/LAN Fastify prefixes — never nest (`/viewer/explorer`). */
var SKU_HUB_PATHS = {
	document: [
		"markdown",
		"document",
		"viewer"
	],
	explorer: [
		"explorer",
		"files",
		"fm"
	],
	process: [
		"workcenter",
		"process",
		"ai"
	],
	transfer: ["cwsp", "transfer"]
};
/** Specialized chrome. Empty list = hub/CRX keeps every view. */
var SKU_LOCAL_NAV_VIEWS = {
	launcher: [],
	crx: [],
	document: [
		"viewer",
		"editor",
		"print",
		"settings",
		"history"
	],
	explorer: [
		"explorer",
		"settings",
		"history"
	],
	process: [
		"workcenter",
		"settings",
		"history"
	],
	transfer: [
		"network",
		"settings",
		"history"
	]
};
var currentHostname = () => {
	try {
		return String(globalThis.location?.hostname || "").toLowerCase();
	} catch {
		return "";
	}
};
var firstPathSegment = () => {
	try {
		return (String(globalThis.location?.pathname || "/").split("?")[0] || "/").split("/").filter(Boolean)[0]?.toLowerCase() || "";
	} catch {
		return "";
	}
};
var isLanOrLoopbackHost = (host) => host === "localhost" || host === "127.0.0.1" || host === "::1" || /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
var isHubPublicHost = (hostname) => {
	const host = String(hostname || currentHostname()).toLowerCase();
	return HUB_PUBLIC_HOSTS.includes(host);
};
/** Web `u2re.space` / LAN hub — not a Capacitor APK and not a dedicated SKU host. */
var isWebHubSurface = () => {
	if (isCwspNativeHost()) return false;
	const host = currentHostname();
	return isHubPublicHost(host) || isLanOrLoopbackHost(host);
};
var skuForHubPathSegment = (segment) => {
	const seg = String(segment || "").trim().toLowerCase();
	if (!seg) return "";
	for (const sku of Object.keys(SKU_HUB_PATHS)) if (SKU_HUB_PATHS[sku].includes(seg)) return sku;
	return "";
};
/** Host + hub/LAN path mount → SKU. `u2re.space/` stays launcher (full chrome). */
var inferCwspSkuFromLocation = () => {
	const stamped = readCwspSku();
	if (stamped) return stamped;
	const host = currentHostname();
	for (const sku of Object.keys(SKU_PUBLIC_HOSTS)) if (SKU_PUBLIC_HOSTS[sku].includes(host)) return sku;
	const fromPath = skuForHubPathSegment(firstPathSegment());
	if (fromPath) return fromPath;
	if (isHubPublicHost(host) || isLanOrLoopbackHost(host)) return "launcher";
	return "";
};
var ensureCwspSkuFromLocation = () => {
	const sku = inferCwspSkuFromLocation();
	if (sku) applyCwspSku(sku);
	return sku;
};
var normalizeNavViewId = (view) => {
	const key = String(view || "").trim().toLowerCase();
	if (key === "markdown" || key === "document" || key === "md") return "viewer";
	if (key === "process") return "workcenter";
	if (key === "files" || key === "fm") return "explorer";
	if (key === "transfer") return "network";
	return key;
};
/** False on a specialized host/mount for views that belong to another SKU. */
var isViewLocalToSurface = (view, sku = inferCwspSkuFromLocation()) => {
	const id = normalizeNavViewId(view);
	if (!id) return false;
	if (!sku || sku === "launcher" || sku === "crx") return true;
	const local = SKU_LOCAL_NAV_VIEWS[sku];
	if (!local.length) return true;
	return local.includes(id);
};
/** Canonical hub/LAN path the user types (`/viewer` not `/markdown`). */
var SKU_PUBLIC_HUB_PATH = {
	document: "/viewer",
	explorer: "/explorer",
	process: "/process",
	transfer: "/cwsp"
};
/** Path or absolute URL for a sibling SKU. Hub keeps `/viewer` `/explorer` `/process`. */
var publicHrefForSku = (sku) => {
	const host = currentHostname();
	const hosts = SKU_PUBLIC_HOSTS[sku];
	const path = SKU_PUBLIC_HUB_PATH[sku];
	if (hosts.includes(host)) return "/";
	if (isHubPublicHost(host) || isLanOrLoopbackHost(host)) return path;
	return `https://${hosts[0]}/`;
};
var publicHrefForView = (view) => {
	const sku = siblingSkuForView(normalizeNavViewId(view));
	return sku ? publicHrefForSku(sku) : null;
};
var isCwspNativeHost = () => {
	try {
		const g = globalThis;
		const platform = g.Capacitor?.getPlatform?.();
		return Boolean(g.Capacitor?.isNativePlatform?.() || platform === "android" || platform === "ios" || g.__CWS_NATIVE__ === true);
	} catch {
		return false;
	}
};
/**
* Leave this PWA for a sibling SKU.
* INVARIANT: web `u2re.space` (launcher) keeps `/viewer` `/explorer` `/process` in-process.
* Native launcher still opens sibling APKs.
*/
var shouldHandoffViewToSibling = (view) => {
	const id = normalizeNavViewId(view);
	const sibling = siblingSkuForView(id);
	if (!sibling) return false;
	const sku = inferCwspSkuFromLocation();
	if (sku === "crx") return false;
	if ((!sku || sku === "launcher") && !isCwspNativeHost()) return false;
	if (sku === sibling) return false;
	if (sku && sku !== "launcher" && sku !== "crx" && isViewLocalToSurface(id, sku)) return false;
	return true;
};
var CWSP_SKU_HANDOFF_KEY = "cwsp-sku-handoff";
var stashSkuHandoff = (payload) => {
	const json = JSON.stringify({
		...payload,
		ts: Date.now()
	});
	try {
		globalThis.sessionStorage?.setItem?.(CWSP_SKU_HANDOFF_KEY, json);
	} catch {}
	try {
		globalThis.localStorage?.setItem?.(CWSP_SKU_HANDOFF_KEY, json);
	} catch {}
};
var takeSkuHandoff = (...accept) => {
	try {
		const raw = globalThis.sessionStorage?.getItem?.("cwsp-sku-handoff") || globalThis.localStorage?.getItem?.("cwsp-sku-handoff");
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		const dest = normalizeNavViewId(String(parsed.dest || ""));
		if (accept.length && dest) {
			if (!accept.some((entry) => normalizeNavViewId(entry) === dest)) return null;
		}
		globalThis.sessionStorage?.removeItem?.(CWSP_SKU_HANDOFF_KEY);
		globalThis.localStorage?.removeItem?.(CWSP_SKU_HANDOFF_KEY);
		return parsed;
	} catch {
		return null;
	}
};
try {
	ensureCwspSkuFromLocation();
} catch {}
var androidPackageForSku = (sku) => ECOSYSTEM_SKUS[sku]?.androidPackage ?? null;
var apkManifestForSku = (sku) => ECOSYSTEM_SKUS[sku]?.apkManifest || "";
//#endregion
export { stashSkuHandoff as _, ecosystem_skus_exports as a, isCwspNativeHost as c, isWebHubSurface as d, publicHrefForSku as f, siblingSkuForView as g, shouldHandoffViewToSibling as h, apkManifestForSku as i, isCwspSku as l, readCwspSku as m, SKU_HUB_PATHS as n, ensureCwspSkuFromLocation as o, publicHrefForView as p, androidPackageForSku as r, inferCwspSkuFromLocation as s, ECOSYSTEM_SKUS as t, isViewLocalToSurface as u, takeSkuHandoff as v };
