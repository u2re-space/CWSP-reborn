import { n as __exportAll } from "./rolldown-runtime.js";
import { t as CwsBridge, u as Capacitor } from "../vendor/@capacitor_core.js";
//#region src/frontend/boot/frontend-debug-capture.ts
/**
* Capacitor / WebView frontend log ring + native bridge for AI/agent debugging.
* Exposes `globalThis.__CWSP_FRONTEND_DEBUG__` and forwards batches to CwsBridge `debug:*`.
*/
var frontend_debug_capture_exports = /* @__PURE__ */ __exportAll({
	getFrontendDebugApi: () => getFrontendDebugApi,
	initFrontendDebugCapture: () => initFrontendDebugCapture
});
var MAX_ENTRIES = 800;
var FLUSH_MS = 2500;
/** Opt-in: full console patch + native flush is expensive on Capacitor WebView. */
var isDebugCaptureEnabled = () => {
	try {
		if (/^(1|true|yes|on)$/i.test(String(""))) return true;
		return globalThis.localStorage?.getItem("cws-frontend-debug") === "1";
	} catch {
		return false;
	}
};
var entries = [];
var pending = [];
var installed = false;
var flushTimer = null;
var serializeArg = (value) => {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (value instanceof Error) return `${value.name}: ${value.message}`;
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};
var formatConsoleArgs = (args) => {
	if (!args.length) return { msg: "" };
	const head = serializeArg(args[0]);
	if (args.length === 1) return { msg: head };
	const rest = args.slice(1).map(serializeArg).filter(Boolean);
	return {
		msg: rest.length ? `${head} ${rest.join(" ")}` : head,
		data: args.length > 1 ? args.slice(1) : void 0
	};
};
var pushEntry = (level, scope, msg, data) => {
	const row = {
		ts: Date.now(),
		level,
		scope,
		msg,
		data
	};
	entries.push(row);
	if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
	pending.push(row);
	if (pending.length > 200) pending.splice(0, pending.length - 200);
	scheduleFlush();
};
var scheduleFlush = () => {
	if (flushTimer != null) return;
	flushTimer = setTimeout(() => {
		flushTimer = null;
		flushPending();
	}, FLUSH_MS);
};
var flushPending = async () => {
	if (!pending.length) return;
	if (!Capacitor.isNativePlatform?.()) return;
	if (!api.enabled) {
		pending.length = 0;
		return;
	}
	const batch = pending.splice(0, pending.length);
	try {
		await CwsBridge.invoke({
			channel: "debug:append",
			payload: {
				entries: batch,
				peer: "L-192.168.0.196",
				source: "webview"
			}
		});
	} catch {}
};
var patchConsole = () => {
	for (const level of [
		"log",
		"info",
		"warn",
		"error",
		"debug"
	]) {
		const orig = console[level]?.bind(console);
		if (!orig) continue;
		console[level] = (...args) => {
			try {
				const { msg, data } = formatConsoleArgs(args);
				pushEntry(level, "console", msg, data);
			} catch {}
			orig(...args);
		};
	}
};
var api = {
	entries,
	max: MAX_ENTRIES,
	enabled: true,
	tail(limit = 120) {
		const n = Math.max(1, Math.min(limit, entries.length));
		return entries.slice(entries.length - n);
	},
	clear() {
		entries.length = 0;
		pending.length = 0;
	},
	log(scope, level, msg, data) {
		pushEntry(level, scope, msg, data);
	},
	async flush() {
		await flushPending();
	}
};
/** Install error hooks once; console patch + native flush only when explicitly enabled. */
var initFrontendDebugCapture = () => {
	if (installed) return api;
	installed = true;
	globalThis.__CWSP_FRONTEND_DEBUG__ = api;
	const captureVerbose = isDebugCaptureEnabled();
	if (captureVerbose) patchConsole();
	globalThis.addEventListener?.("error", (ev) => {
		const err = ev.error instanceof Error ? ev.error : void 0;
		pushEntry("error", "window", err?.stack || err?.message || String(ev.message || "error"));
	});
	globalThis.addEventListener?.("unhandledrejection", (ev) => {
		pushEntry("error", "promise", serializeArg(ev.reason));
	});
	api.enabled = captureVerbose;
	api.log("boot", "info", `frontend-debug ready native=${Boolean(Capacitor.isNativePlatform?.())} verbose=${captureVerbose}`);
	return api;
};
var getFrontendDebugApi = () => globalThis.__CWSP_FRONTEND_DEBUG__;
//#endregion
export { getFrontendDebugApi as n, initFrontendDebugCapture as r, frontend_debug_capture_exports as t };
