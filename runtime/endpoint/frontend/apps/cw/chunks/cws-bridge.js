import { r as __exportAll } from "./rolldown-runtime.js";
import { t as createInteropEnvelope } from "./UniformInterop2.js";
import { O as stringifyCwspRemoteConnectionV1, n as CWSP_REMOTE_CONFIG_SYNC_CHANNEL, o as appSettingsShellToNativeExtras, s as appSettingsToRemoteConnectionV1, t as AIRPAD_REMOTE_CONFIG_STORAGE_KEY } from "./airpad-cwsp-client-parity.js";
import { n as WebPlugin, r as registerPlugin } from "../vendor/@capacitor_core.js";
import { withTimeout } from "/fest/core.js";
import { createProtocolEnvelope, isProtocolEnvelope, normalizeProtocolEnvelope } from "/fest/uniform.js";
//#region src/shared/routing/native/cws-bridge.ts
var cws_bridge_exports = /* @__PURE__ */ __exportAll({
	CwsBridge: () => CwsBridge,
	fetchCwsShellInfo: () => fetchCwsShellInfo,
	getNativeUnifiedSettings: () => getNativeUnifiedSettings,
	initCwsNativeBridge: () => initCwsNativeBridge,
	invokeCwsNative: () => invokeCwsNative,
	invokeCwsPlatformIPC: () => invokeCwsPlatformIPC,
	isCapacitorCwsNativeShell: () => isCapacitorCwsNativeShell,
	isCwsNativeIpcAvailable: () => isCwsNativeIpcAvailable,
	isElectronCwsNativeShell: () => isElectronCwsNativeShell,
	patchNativeUnifiedSettingsDetailed: () => patchNativeUnifiedSettingsDetailed
});
var CwsBridgeWeb = class extends WebPlugin {
	async processApi() {
		return {
			ok: false,
			error: "web",
			fallback: "none"
		};
	}
	async getShellInfo() {
		return {
			shell: "browser",
			bridge: "cws-bridge",
			native: false,
			platform: typeof globalThis.navigator !== "undefined" ? "web" : "unknown"
		};
	}
	async invoke(options) {
		const envelope = normalizeBridgeEnvelope(options.channel, options.payload, options.envelope);
		return {
			ok: true,
			channel: options.channel,
			echo: { ...options.payload ?? {} },
			envelope
		};
	}
};
/**
* WHY: CRX bundles `@capacitor/core` with a first `registerPlugin("CwsBridge")`, then
* Settings dynamic-imports this module and would register again → console warn.
* INVARIANT: one Capacitor plugin proxy per JS realm.
*/
var registerCwsBridgeOnce = () => {
	const g = globalThis;
	if (g.__CWS_BRIDGE_PLUGIN__) return g.__CWS_BRIDGE_PLUGIN__;
	const existing = g.Capacitor?.Plugins?.CwsBridge;
	if (existing) {
		g.__CWS_BRIDGE_PLUGIN__ = existing;
		return existing;
	}
	const plugin = registerPlugin("CwsBridge", { web: () => new CwsBridgeWeb() });
	g.__CWS_BRIDGE_PLUGIN__ = plugin;
	return plugin;
};
var CwsBridge = registerCwsBridgeOnce();
var bridgeInitDone = false;
var normalizeBridgeEnvelope = (channel, payload, envelope) => {
	if (envelope && isProtocolEnvelope(envelope)) return normalizeProtocolEnvelope(envelope);
	const interop = createInteropEnvelope({
		purpose: "invoke",
		protocol: "service",
		transport: "service-worker",
		type: "invoke",
		op: "invoke",
		source: "webview",
		destination: "native",
		srcChannel: "webview",
		dstChannel: "native",
		payload: payload ?? {},
		data: payload ?? {}
	});
	return createProtocolEnvelope({
		...interop,
		path: ["cws-bridge", channel]
	});
};
var normalizeInvokeResultEnvelope = (channel, payload, result) => {
	if (result?.envelope && isProtocolEnvelope(result.envelope)) return normalizeProtocolEnvelope(result.envelope);
	const interop = createInteropEnvelope({
		purpose: "invoke",
		protocol: "service",
		transport: "service-worker",
		type: result.ok ? "response" : "ack",
		op: "invoke",
		source: "native",
		destination: "webview",
		srcChannel: "native",
		dstChannel: "webview",
		payload,
		data: payload
	});
	return createProtocolEnvelope({
		...interop,
		path: ["cws-bridge", channel]
	});
};
/**
* Initialize the native bridge surface and normalize inbound native messages.
*
* AI-READ: this is the TypeScript side of the WebView/native boundary, so it
* is one of the first places to inspect when networking works natively but not
* through the web shell or vice versa.
*/
/** Live `getShellInfo` — first init can cache the web stub before the Capacitor plugin is ready. */
async function fetchCwsShellInfo(options) {
	const existing = typeof globalThis.window !== "undefined" ? globalThis.window.__CWS_SHELL_INFO__ ?? null : null;
	if (!options?.force && existing?.accentColor) return existing;
	try {
		const info = await CwsBridge.getShellInfo();
		if (info && typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = {
			...existing || {},
			...info
		};
		return info ?? existing;
	} catch {
		return existing;
	}
}
async function initCwsNativeBridge() {
	if (bridgeInitDone) {
		const cached = typeof globalThis.window !== "undefined" ? globalThis.window.__CWS_SHELL_INFO__ ?? null : null;
		if (cached?.accentColor || cached?.native) return cached;
		return fetchCwsShellInfo({ force: true });
	}
	bridgeInitDone = true;
	const electronInfoFn = globalThis.window?.electronBridge?.getShellInfo;
	if (typeof electronInfoFn === "function") try {
		const info = await electronInfoFn();
		if (typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = info;
		return info;
	} catch {}
	try {
		const info = await CwsBridge.getShellInfo();
		if (typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = info;
		try {
			await CwsBridge.addListener("nativeMessage", (event) => {
				const payload = event && typeof event.payload === "object" && event.payload != null ? event.payload : {};
				const envelopeRaw = payload?.envelope;
				const envelope = envelopeRaw && typeof envelopeRaw === "object" && isProtocolEnvelope(envelopeRaw) ? normalizeProtocolEnvelope(envelopeRaw) : createProtocolEnvelope(createInteropEnvelope({
					purpose: "mail",
					protocol: "service",
					transport: "service-worker",
					type: "act",
					op: "deliver",
					source: "native",
					destination: "webview",
					srcChannel: "native",
					dstChannel: "webview",
					payload,
					data: payload
				}));
				globalThis.dispatchEvent(new CustomEvent("cws-native-message", { detail: {
					event,
					envelope,
					payload
				} }));
			});
		} catch {}
		return info;
	} catch {
		return null;
	}
}
/** Detect the Capacitor/CWSAndroid shell where native networking may replace browser transport rules. */
var isCapacitorCwsNativeShell = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Detect the Electron shell, which uses its own invoke bridge instead of Capacitor plugins. */
var isElectronCwsNativeShell = () => {
	try {
		return Boolean(globalThis.window?.electronBridge?.invoke);
	} catch {
		return false;
	}
};
/** Report whether frontend code can rely on native IPC instead of web-only fallbacks. */
var isCwsNativeIpcAvailable = () => {
	if (isElectronCwsNativeShell()) return true;
	if (isCapacitorCwsNativeShell()) return true;
	try {
		const shell = globalThis.window?.__CWS_SHELL_INFO__;
		return Boolean(shell?.native);
	} catch {
		return false;
	}
};
/** Opaque channel → Kotlin/Compose (override {@code CwsBridgePlugin.invoke} in CWSAndroid for real routing). */
async function invokeCwsNative(channel, payload) {
	const envelope = normalizeBridgeEnvelope(channel, payload);
	const result = await CwsBridge.invoke({
		channel,
		payload,
		envelope
	});
	return {
		...result,
		envelope: normalizeInvokeResultEnvelope(channel, payload ?? {}, result)
	};
}
/**
* Canonical IPC invoker for frontend modules:
* - Uses CWSAndroid native bridge envelope transport when available
* - Falls back to web plugin-compatible invoke otherwise
*/
async function invokeCwsPlatformIPC(input) {
	const channel = (input.channel || "").trim() || (Array.isArray(input.envelope?.path) && input.envelope?.path.length ? String(input.envelope.path[input.envelope.path.length - 1] || "").trim() : "") || "default";
	const payload = input.payload && typeof input.payload === "object" ? input.payload : {};
	const envelope = normalizeBridgeEnvelope(channel, payload, input.envelope);
	const electronInvoke = globalThis.window?.electronBridge?.invoke;
	if (typeof electronInvoke === "function") {
		const result = await electronInvoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
	if (!isCwsNativeIpcAvailable()) {
		const result = await CwsBridge.invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
	try {
		const result = await CwsBridge.invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	} catch (error) {
		console.warn("[cws-bridge] native invoke failed:", error);
		if (isCapacitorCwsNativeShell()) return {
			ok: false,
			channel,
			echo: {
				...payload ?? {},
				error: String(error instanceof Error ? error.message : error)
			},
			envelope: normalizeInvokeResultEnvelope(channel, payload, {
				ok: false,
				channel,
				echo: payload ?? {}
			})
		};
		const result = await new CwsBridgeWeb().invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
}
async function getNativeUnifiedSettings() {
	try {
		const result = await invokeCwsPlatformIPC({ channel: "settings:get" });
		if (!result?.ok) return null;
		return result.appSettings && typeof result.appSettings === "object" ? result.appSettings : null;
	} catch {
		return null;
	}
}
async function patchNativeUnifiedSettingsDetailed(appSettings) {
	try {
		const blob = appSettingsToRemoteConnectionV1(appSettings);
		const airpadJson = stringifyCwspRemoteConnectionV1(blob);
		const shellPatch = appSettingsShellToNativeExtras(appSettings);
		try {
			globalThis.localStorage?.setItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY, airpadJson);
		} catch {}
		try {
			const ch = new BroadcastChannel(CWSP_REMOTE_CONFIG_SYNC_CHANNEL);
			ch.postMessage({
				airpadJson,
				shellPatch
			});
			ch.close();
		} catch {}
		const result = await withTimeout(invokeCwsPlatformIPC({
			channel: "settings:patch",
			payload: {
				appSettings,
				airpadJson,
				shellPatch
			}
		}), 6e3, "settings:patch timed out").catch((error) => ({
			ok: false,
			channel: "settings:patch",
			echo: { error: String(error instanceof Error ? error.message : error) }
		}));
		const echo = result?.echo;
		if (!(result?.ok === true || result?.ok !== false && !echo?.error && result?.channel === "settings:patch")) return {
			ok: false,
			error: String(echo?.error ?? "settings:patch rejected")
		};
		return { ok: true };
	} catch (e) {
		return {
			ok: false,
			error: String(e instanceof Error ? e.message : e)
		};
	}
}
//#endregion
export { invokeCwsNative as a, isCwsNativeIpcAvailable as c, initCwsNativeBridge as i, patchNativeUnifiedSettingsDetailed as l, cws_bridge_exports as n, invokeCwsPlatformIPC as o, getNativeUnifiedSettings as r, isCapacitorCwsNativeShell as s, CwsBridge as t };
