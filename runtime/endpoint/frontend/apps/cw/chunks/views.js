//#region src/shared/routing/core/views.ts
var VIEW_ENABLED_VIEWER = "viewer";
var VIEW_ENABLED_EDITOR = "editor";
var VIEW_ENABLED_WORKCENTER = "workcenter";
var VIEW_ENABLED_EXPLORER = "explorer";
var VIEW_ENABLED_SETTINGS = "settings";
var VIEW_ENABLED_HISTORY = "history";
var VIEW_ENABLED_HOME = "home";
var VIEW_ENABLED_PRINT = "print";
/** AirPad (remote trackpad/keyboard + clipboard) — used by the Capacitor shell and PWA. */
var VIEW_ENABLED_AIRPAD = "airpad";
/** CWSP connection / probe diagnostics — primary Capacitor (CWSAndroid) home view. */
var VIEW_ENABLED_NETWORK = "network";
var DEFAULT_VIEW_ID = "viewer";
var VIEW_FLAGS = {
	network: VIEW_ENABLED_NETWORK,
	airpad: VIEW_ENABLED_AIRPAD,
	settings: VIEW_ENABLED_SETTINGS,
	viewer: VIEW_ENABLED_VIEWER,
	editor: VIEW_ENABLED_EDITOR,
	workcenter: VIEW_ENABLED_WORKCENTER,
	explorer: VIEW_ENABLED_EXPLORER,
	history: VIEW_ENABLED_HISTORY,
	home: VIEW_ENABLED_HOME,
	print: VIEW_ENABLED_PRINT
};
/**
* Optional per-build allowlist: `VITE_ENABLED_VIEWS="network,settings"` restricts
* which views are enabled (e.g. the Capacitor CWSAndroid shell: Network + Settings
* only). When unset, all flagged views are enabled. Read from Vite env first,
* then Node env, guarded for non-bundled (tsx) contexts.
*/
var readEnabledViewsAllowlist = () => {
	let raw = "";
	try {
		const search = globalThis?.location?.search;
		if (search) {
			const params = new URLSearchParams(search);
			raw = String(params.get("views") || params.get("enabledViews") || "");
		}
	} catch {}
	if (!raw) try {
		raw = String(globalThis?.localStorage?.getItem?.("rs-enabled-views") ?? "");
	} catch {}
	if (!raw) try {
		raw = String("");
	} catch {}
	if (!raw) try {
		raw = String(globalThis?.process?.env?.VITE_ENABLED_VIEWS ?? "");
	} catch {}
	const list = raw.split(/[\s,;]+/).map((entry) => entry.trim().toLowerCase()).filter(Boolean);
	if (!list.length) return null;
	list.push("settings");
	try {
		const search = globalThis?.location?.search;
		if (search && new URLSearchParams(search).get("views")) globalThis?.localStorage?.setItem?.("rs-enabled-views", Array.from(new Set(list)).join(","));
	} catch {}
	return new Set(list);
};
var ENABLED_VIEWS_ALLOWLIST = readEnabledViewsAllowlist();
/**
* Build-time gate: the host bundler (CrossWord Vite) replaces `__RS_VIEW_<ID>__`
* with a boolean from `VITE_ENABLED_VIEWS`. `typeof` is safe for undeclared
* globals (returns "undefined") so non-bundled/tsx contexts fall back to enabled.
*/
var BUILD_VIEW_FLAGS = {
	viewer: true,
	editor: true,
	workcenter: true,
	explorer: true,
	settings: true,
	history: true,
	home: true,
	print: true,
	airpad: true,
	network: true
};
var buildAllows = (viewId) => BUILD_VIEW_FLAGS[String(viewId).toLowerCase()] !== false;
var runtimeAllows = (viewId) => !ENABLED_VIEWS_ALLOWLIST || ENABLED_VIEWS_ALLOWLIST.has(String(viewId).toLowerCase());
var isViewAllowed = (viewId) => buildAllows(viewId) && runtimeAllows(viewId);
var ENABLED_VIEW_IDS = Object.entries(VIEW_FLAGS).filter(([viewId, enabled]) => Boolean(enabled) && isViewAllowed(viewId)).map(([viewId]) => viewId);
var isEnabledView = (viewId) => {
	return Boolean(VIEW_FLAGS[viewId]) && isViewAllowed(viewId);
};
var pickEnabledView = (preferred = DEFAULT_VIEW_ID, fallback = DEFAULT_VIEW_ID) => {
	if (isEnabledView(preferred)) return preferred;
	if (isEnabledView(fallback)) return fallback;
	if (ENABLED_VIEW_IDS.length > 0) return ENABLED_VIEW_IDS[0];
	return "viewer";
};
//#endregion
export { VIEW_ENABLED_EXPLORER as a, VIEW_ENABLED_NETWORK as c, VIEW_ENABLED_VIEWER as d, VIEW_ENABLED_WORKCENTER as f, VIEW_ENABLED_EDITOR as i, VIEW_ENABLED_PRINT as l, pickEnabledView as m, ENABLED_VIEW_IDS as n, VIEW_ENABLED_HISTORY as o, isEnabledView as p, VIEW_ENABLED_AIRPAD as r, VIEW_ENABLED_HOME as s, DEFAULT_VIEW_ID as t, VIEW_ENABLED_SETTINGS as u };
