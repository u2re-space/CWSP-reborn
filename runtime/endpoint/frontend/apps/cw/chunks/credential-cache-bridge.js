import { s as withTimeout } from "../fest/core.js";
import { a as normalizeProtocolEnvelope, i as isProtocolEnvelope, r as createProtocolEnvelope } from "../fest/uniform.js";
import { t as createInteropEnvelope } from "./UniformInterop.js";
import { n as writeFileSmart, v as JSOX } from "../com/app.js";
import { d as WebPlugin, f as registerPlugin } from "../vendor/@capacitor_core.js";
import { n as DEFAULT_SETTINGS, r as normalizeEcosystemToken } from "./SettingsTypes.js";
import { T as sanitizeFleetSelfWireNodeId, k as stringifyCwspRemoteConnectionV1, n as CWSP_REMOTE_CONFIG_SYNC_CHANNEL, o as appSettingsShellToNativeExtras, s as appSettingsToRemoteConnectionV1, t as AIRPAD_REMOTE_CONFIG_STORAGE_KEY, u as isAssociableFleetWireNodeId, y as normalizeWireNodeIdForWire, z as migrateLegacyCwspPublicPort } from "./airpad-cwsp-client-parity.js";
import { d as applyAirpadRuntimeFromAppSettings, q as syncAirpadRemoteConfigFromAppSettings } from "./config.js";
//#region ../../modules/projects/subsystem/src/routing/native/cws-bridge.ts
var CwsBridgeWeb = class extends WebPlugin {
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
	return createProtocolEnvelope({
		...createInteropEnvelope({
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
		}),
		path: ["cws-bridge", channel]
	});
};
var normalizeInvokeResultEnvelope = (channel, payload, result) => {
	if (result?.envelope && isProtocolEnvelope(result.envelope)) return normalizeProtocolEnvelope(result.envelope);
	return createProtocolEnvelope({
		...createInteropEnvelope({
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
		}),
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
async function initCwsNativeBridge() {
	if (bridgeInitDone) return typeof globalThis.window !== "undefined" ? globalThis.window.__CWS_SHELL_INFO__ ?? null : null;
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
		const airpadJson = stringifyCwspRemoteConnectionV1(appSettingsToRemoteConnectionV1(appSettings));
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
//#region ../../modules/projects/subsystem/src/other/config/Settings.ts
var SETTINGS_KEY = "rs-settings";
/** localStorage mirror for Capacitor WebView when IndexedDB is flaky or empty. */
var SETTINGS_LS_MIRROR_KEY = "rs-settings.v1";
var lastSettingsSaveReport = { nativeSynced: null };
var trimSetting = (v) => typeof v === "string" ? v.trim() : "";
/** Factory defaults — not treated as user-configured Client-ID on Capacitor. */
var CAPACITOR_FACTORY_SELF_IDS = /* @__PURE__ */ new Set([
	"L-196",
	"L-208",
	"L-210"
]);
var isCapacitorFactorySelfId = (id) => {
	if (!id) return true;
	const shortId = sanitizeFleetSelfWireNodeId(id) || id;
	return CAPACITOR_FACTORY_SELF_IDS.has(shortId);
};
/** Home fleet Client-ID — accepts short {@code L-196} via normalize → {@code L-192.168.0.196}. */
var isHomeFleetClientId = (id) => Boolean(id) && isAssociableFleetWireNodeId(normalizeWireNodeIdForWire(id));
/** Persist short home-fleet Client-ID ({@code L-196}); never expand to full LAN form. */
var normalizePersistedClientId = (raw) => sanitizeFleetSelfWireNodeId(raw) || String(raw ?? "").trim();
var isCapacitorNativeShell = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Desk Neutralino / endpoint peer — must be in Android clipboard destinations for Win images. */
var CAPACITOR_DESK_PEER_ID = "L-110";
var isDeskPeerId = (id) => {
	return (sanitizeFleetSelfWireNodeId(id) || id.trim()) === CAPACITOR_DESK_PEER_ID;
};
var splitClipboardDestIds = (raw) => {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const part of raw.split(/[,;\s\n\r]+/)) {
		const id = part.trim();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		out.push(id);
	}
	return out;
};
var joinClipboardDestIds = (ids) => ids.filter(Boolean).join(";");
/**
* Prepend L-110 when missing. Leaves `*` alone (wildcard already covers desk).
* WHY: legacy Capacitor prefs were phone-only (L-196;L-210;L-208) → Android↔Android only.
*/
var ensureDeskPeerInDestCsv = (raw) => {
	const t = String(raw || "").trim();
	if (!t || t === "*") return {
		value: t || "*",
		changed: false
	};
	const ids = splitClipboardDestIds(t);
	if (ids.some(isDeskPeerId)) return {
		value: joinClipboardDestIds(ids),
		changed: false
	};
	return {
		value: joinClipboardDestIds([CAPACITOR_DESK_PEER_ID, ...ids]),
		changed: true
	};
};
/** Patch Capacitor settings so routeTarget + share destinations include desk L-110. */
var ensureCapacitorDeskClipboardTargets = (settings) => {
	if (!isCapacitorNativeShell()) return null;
	const route = trimSetting(settings.core?.socket?.routeTarget);
	const share = trimSetting(settings.shell?.clipboardShareDestinationIds);
	const fallback = "L-196;L-210";
	const r = ensureDeskPeerInDestCsv(route || fallback);
	const s = ensureDeskPeerInDestCsv(share || route || fallback);
	if (!r.changed && !s.changed) return null;
	return {
		...settings,
		core: {
			...settings.core,
			socket: {
				...settings.core?.socket || {},
				routeTarget: r.value
			}
		},
		shell: {
			...settings.shell,
			clipboardShareDestinationIds: s.value
		}
	};
};
/** Neutralino shares the same loopback control RPC as WebNative (`/service/config`). */
var isWebnativeSurface = () => {
	try {
		const g = globalThis;
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		return Boolean(g.__CWS_WEBNATIVE_BOOT__ || g.__CWS_NEUTRALINO_BOOT__ || auth && typeof auth.port === "number");
	} catch {
		return false;
	}
};
var readDesktopControlAuth = () => {
	try {
		const g = globalThis;
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		if (!auth || typeof auth.port !== "number") return null;
		return {
			port: auth.port,
			key: String(auth.key || "")
		};
	} catch {
		return null;
	}
};
var webnativeControl = async (path, init) => {
	try {
		const auth = readDesktopControlAuth();
		if (!auth || typeof auth.port !== "number") return null;
		const headers = new Headers(init?.headers);
		headers.set("Content-Type", "application/json");
		if (auth.key) headers.set("X-API-Key", auth.key);
		const signal = init?.signal ?? (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(1500) : void 0);
		const res = await fetch(`http://127.0.0.1:${auth.port}${path}`, {
			...init,
			headers,
			cache: "no-store",
			signal
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
};
/**
* Map a resolved CWSP config snapshot (`readServerV2ConfigSnapshot` shape from the backend's
* GET /service/config) onto the AppSettings.core fields the Settings/Network views render. The
* snapshot's `bridge` section carries the canonical endpoint URL + identity + TLS decision.
*/
var mapWebnativeSnapshotToCore = (snap) => {
	if (!snap || typeof snap !== "object") return null;
	const bridge = snap.bridge || {};
	const shell = snap.shell || {};
	const coreIn = snap.core && typeof snap.core === "object" ? snap.core : {};
	const listenPort = Number(snap.listenPort) || Number(snap.publicHttpPort) || 8434;
	const endpointUrlRaw = String(coreIn.endpointUrl || bridge.endpointUrl || shell.remoteHost || "").trim();
	const endpointsList = Array.isArray(bridge.endpoints) ? bridge.endpoints.map((e) => String(e || "").trim()).filter(Boolean) : [];
	const endpointUrl = endpointUrlRaw || endpointsList[0] || "";
	const userId = String(coreIn.userId || bridge.userId || bridge.deviceId || "").trim();
	const userKey = String(coreIn.ecosystemToken || coreIn.userKey || bridge.userKey || shell.accessToken || shell.clientToken || "").trim();
	const allowInsecureTls = bridge.allowInsecureTls !== void 0 ? Boolean(bridge.allowInsecureTls) : coreIn.allowInsecureTls !== void 0 ? Boolean(coreIn.allowInsecureTls) : void 0;
	if (!endpointUrl && !userId && !userKey) return null;
	const overlay = {};
	if (endpointUrl) overlay.endpointUrl = endpointUrl;
	else if (!endpointUrl && !userId) overlay.endpointUrl = `https://127.0.0.1:${listenPort}`;
	if (userId) overlay.userId = userId;
	if (userKey) {
		overlay.userKey = userKey;
		overlay.ecosystemToken = userKey;
		overlay.socket = { accessToken: userKey };
	}
	if (allowInsecureTls !== void 0) overlay.allowInsecureTls = allowInsecureTls;
	overlay.preferBackendSync = (coreIn.preferBackendSync ?? true) !== false;
	return overlay;
};
/** Shell keys owned by Node portable.config — backend wins when present. */
var mapWebnativeBundleToShell = (bundle) => {
	const shell = bundle?.settings?.shell || bundle?.portable?.shell || bundle?.snapshot?.shell;
	if (!shell || typeof shell !== "object") return null;
	return { ...shell };
};
var webnativeBundleCache = null;
var webnativeSnapshotFetchedAt = 0;
var loadWebnativeControlBundle = async () => {
	if (Date.now() - webnativeSnapshotFetchedAt < 2e3 && webnativeBundleCache) return webnativeBundleCache;
	const bundle = await webnativeControl("/service/config");
	webnativeBundleCache = bundle || null;
	bundle?.snapshot || bundle?.settings || bundle?.portable;
	webnativeSnapshotFetchedAt = Date.now();
	return webnativeBundleCache;
};
/** Best-effort push of a settings save into `portable.config.json` via the backend control RPC. */
var pushWebnativeSettingsPatch = async (settings) => {
	if (!isWebnativeSurface()) return false;
	const core = settings.core;
	if (!core) return false;
	const token = String(core.ecosystemToken || core.userKey || core.socket?.accessToken || "").trim();
	const remoteHost = String(core.endpointUrl || "").trim();
	const clientId = String(core.userId || "").trim();
	const shell = settings.shell || {};
	const patch = {
		bridge: {
			endpointUrl: remoteHost,
			userId: clientId,
			userKey: token,
			allowInsecureTls: Boolean(core.allowInsecureTls)
		},
		shell: {
			remoteHost,
			accessToken: token,
			clientToken: token,
			clipboardBroadcastTargets: String(shell.clipboardBroadcastTargets || core.socket?.routeTarget || "L-196;L-210").trim(),
			clipboardOutboundMode: String(shell.clipboardOutboundMode || "auto").trim().toLowerCase() === "ask" ? "ask" : "auto",
			clipboardInboundMode: String(shell.clipboardInboundMode || "auto").trim().toLowerCase() === "ask" ? "ask" : "auto",
			clipboardOutboundShowErase: shell.clipboardOutboundShowErase !== false,
			clipboardInboundShowUndo: shell.clipboardInboundShowUndo !== false,
			clipboardPromptDismissMs: (() => {
				const n = Number(shell.clipboardPromptDismissMs);
				return Number.isFinite(n) && n >= 1e3 ? Math.floor(n) : 1e4;
			})()
		},
		launcherEnv: {
			CWS_ASSOCIATED_ID: clientId,
			CWS_ASSOCIATED_TOKEN: token
		}
	};
	if (core.ops?.directUrl) patch.bridge.endpoints = [String(core.ops.directUrl).trim()];
	const r = await webnativeControl("/service/config", {
		method: "POST",
		body: JSON.stringify(patch)
	});
	try {
		const hubBody = {};
		if (remoteHost) hubBody.remoteHost = remoteHost;
		if (token) {
			hubBody.accessToken = token;
			hubBody.clientToken = token;
		}
		if (clientId) hubBody.clientId = clientId;
		if (Object.keys(hubBody).length) await webnativeControl("/service/clipboard-hub", {
			method: "POST",
			body: JSON.stringify(hubBody)
		});
	} catch {}
	webnativeSnapshotFetchedAt = 0;
	webnativeBundleCache = null;
	return Boolean(r?.ok);
};
/** First-boot CWSP defaults for CWSAndroid when IDB still has dev/empty endpoint fields. */
var CAPACITOR_CWSP_BOOTSTRAP = {
	core: {
		endpointUrl: "https://192.168.0.200:8434",
		ecosystemToken: "n3v3rm1nd",
		userKey: "n3v3rm1nd",
		allowInsecureTls: true,
		useCoreIdentityForAirPad: true,
		ops: { directUrl: "https://192.168.0.110:8434" },
		socket: {
			routeTarget: "L-110;L-196;L-210",
			accessToken: "n3v3rm1nd",
			allowAccessTokenWithoutUserKey: true,
			protocol: "auto"
		},
		interop: { preferNativeWebsocket: true }
	},
	shell: {
		bridgeDaemonEnabled: true,
		autoStartOnBoot: true,
		enableRemoteClipboardBridge: true,
		acceptInboundClipboardData: true,
		applyRemoteClipboardToDevice: true,
		maintainHubSocketConnection: false,
		clipboardShareDestinationIds: "L-110;L-196;L-210"
	}
};
var needsCapacitorCwspBootstrap = (settings) => {
	if (!isCapacitorNativeShell()) return false;
	const ep = trimSetting(settings.core?.endpointUrl);
	const uid = trimSetting(settings.core?.userId);
	const access = trimSetting(settings.core?.ecosystemToken) || trimSetting(settings.core?.socket?.accessToken) || trimSetting(settings.core?.userKey);
	const defaultEp = trimSetting(DEFAULT_SETTINGS.core?.endpointUrl);
	if (!uid || !access) return true;
	if (!ep || ep === defaultEp || /localhost|127\.0\.0\.1|:8434/i.test(ep)) return true;
	return false;
};
/** Seed mobile CWSP settings + sync to Java prefs on first Capacitor boot. */
var capacitorCwspSeedDone = false;
var ensureCapacitorCwspSettingsSeeded = async () => {
	if (!isCapacitorNativeShell()) return null;
	if (capacitorCwspSeedDone) return null;
	let nativeUserId = "";
	try {
		if (isCwsNativeIpcAvailable()) nativeUserId = trimSetting((await getNativeUnifiedSettings())?.core?.userId);
	} catch {}
	const current = await loadSettings({ nativeOverlay: false });
	const currentUserId = trimSetting(current.core?.userId);
	const needsBootstrap = needsCapacitorCwspBootstrap(current);
	const identityDrift = Boolean(nativeUserId) && Boolean(currentUserId) && nativeUserId !== currentUserId && isCapacitorFactorySelfId(currentUserId) && isHomeFleetClientId(nativeUserId);
	const idbUserConfigured = Boolean(currentUserId) && isHomeFleetClientId(currentUserId);
	const nativeDriftsFromIdb = Boolean(nativeUserId) && Boolean(currentUserId) && nativeUserId !== currentUserId;
	const nativeIsGuestLanId = Boolean(nativeUserId) && !isHomeFleetClientId(nativeUserId);
	if (!needsBootstrap && nativeDriftsFromIdb && (idbUserConfigured || nativeIsGuestLanId)) {
		capacitorCwspSeedDone = true;
		console.log("[Settings] pushing WebView client id to native prefs");
		return saveSettings(ensureCapacitorDeskClipboardTargets(current) || current);
	}
	if (!needsBootstrap && !identityDrift) {
		capacitorCwspSeedDone = true;
		const migrated = ensureCapacitorDeskClipboardTargets(current);
		if (migrated) {
			console.log("[Settings] injecting L-110 into clipboard destinations");
			return saveSettings(migrated);
		}
		return null;
	}
	if (identityDrift && !needsBootstrap) {
		capacitorCwspSeedDone = true;
		const aligned = {
			...current,
			core: {
				...current.core,
				userId: nativeUserId,
				socket: {
					...current.core?.socket || {},
					selfId: nativeUserId
				}
			}
		};
		console.log("[Settings] aligning Capacitor client id with native prefs");
		return saveSettings(ensureCapacitorDeskClipboardTargets(aligned) || aligned);
	}
	const merged = {
		...current,
		core: {
			...CAPACITOR_CWSP_BOOTSTRAP.core,
			...current.core,
			userId: (isHomeFleetClientId(nativeUserId) ? nativeUserId : "") || (isHomeFleetClientId(currentUserId) ? currentUserId : "") || trimSetting(CAPACITOR_CWSP_BOOTSTRAP.core?.userId) || "",
			ops: {
				...CAPACITOR_CWSP_BOOTSTRAP.core?.ops || {},
				...current.core?.ops || {}
			},
			socket: {
				...CAPACITOR_CWSP_BOOTSTRAP.core?.socket || {},
				...current.core?.socket || {},
				selfId: (isHomeFleetClientId(nativeUserId) ? nativeUserId : "") || (isHomeFleetClientId(trimSetting(current.core?.socket?.selfId)) ? trimSetting(current.core?.socket?.selfId) : "") || ""
			},
			interop: {
				...CAPACITOR_CWSP_BOOTSTRAP.core?.interop || {},
				...current.core?.interop || {}
			}
		},
		shell: {
			...CAPACITOR_CWSP_BOOTSTRAP.shell || {},
			...current.shell || {}
		}
	};
	console.log("[Settings] seeding Capacitor CWSP defaults");
	capacitorCwspSeedDone = true;
	return saveSettings(ensureCapacitorDeskClipboardTargets(merged) || merged);
};
var isCrxExtensionRuntime = () => {
	try {
		const id = globalThis.chrome?.runtime?.id;
		return typeof id === "string" && id.length > 0;
	} catch {
		return false;
	}
};
var readLocalStorageSettingsMirror = () => {
	try {
		const raw = globalThis.localStorage?.getItem?.(SETTINGS_LS_MIRROR_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
};
var writeLocalStorageSettingsMirror = (value) => {
	try {
		globalThis.localStorage?.setItem?.(SETTINGS_LS_MIRROR_KEY, JSON.stringify(value));
		return true;
	} catch {
		return false;
	}
};
/** Only apply native fields that carry a non-empty value — empty bridge rows must not wipe IDB. */
var mergeNativeSettingsOverlay = (base, native) => {
	if (!native || typeof native !== "object") return base;
	const patch = {};
	const corePatch = {};
	let touched = false;
	const ep = trimSetting(native.core?.endpointUrl);
	if (ep) {
		corePatch.endpointUrl = ep;
		touched = true;
	}
	const userId = trimSetting(native.core?.userId);
	if (userId && isHomeFleetClientId(userId)) {
		const baseUserId = trimSetting(base.core?.userId);
		if (isCapacitorFactorySelfId(baseUserId) || !isHomeFleetClientId(baseUserId)) {
			corePatch.userId = userId;
			touched = true;
		}
	}
	const userKey = trimSetting(native.core?.userKey);
	if (userKey) {
		corePatch.userKey = userKey;
		touched = true;
	}
	const appClientId = trimSetting(native.core?.appClientId);
	if (appClientId) {
		corePatch.appClientId = appClientId;
		touched = true;
	}
	const socketPatch = {};
	let socketTouched = false;
	const routeTarget = trimSetting(native.core?.socket?.routeTarget);
	if (routeTarget) {
		socketPatch.routeTarget = routeTarget;
		socketTouched = true;
	}
	const accessToken = trimSetting(native.core?.socket?.accessToken);
	if (accessToken) {
		socketPatch.accessToken = accessToken;
		socketTouched = true;
	}
	const clientAccessToken = trimSetting(native.core?.socket?.clientAccessToken);
	if (clientAccessToken) {
		socketPatch.clientAccessToken = clientAccessToken;
		socketTouched = true;
	}
	const nativeSelfId = trimSetting(native.core?.socket?.selfId);
	if (nativeSelfId && isHomeFleetClientId(nativeSelfId)) {
		const baseSelfId = trimSetting(base.core?.socket?.selfId) || trimSetting(base.core?.userId);
		if (isCapacitorFactorySelfId(baseSelfId) || !isHomeFleetClientId(baseSelfId)) {
			socketPatch.selfId = nativeSelfId;
			socketTouched = true;
		}
	}
	if (socketTouched) {
		corePatch.socket = socketPatch;
		touched = true;
	}
	const shellPatch = {};
	let shellTouched = false;
	const shareDest = trimSetting(native.shell?.clipboardShareDestinationIds);
	if (shareDest) {
		shellPatch.clipboardShareDestinationIds = shareDest;
		shellTouched = true;
	}
	const inboundAllow = trimSetting(native.shell?.clipboardInboundAllowIds);
	if (inboundAllow) {
		shellPatch.clipboardInboundAllowIds = inboundAllow;
		shellTouched = true;
	}
	if (shellTouched) {
		patch.shell = shellPatch;
		touched = true;
	}
	if (!touched) return base;
	patch.core = corePatch;
	return mergeAppSettingsShape(base, patch);
};
var DB_NAME = "req-store";
var STORE = "settings";
var mergeAppSettingsShape = (base, patch) => {
	if (!patch || typeof patch !== "object") return base;
	return {
		...base,
		...patch,
		core: {
			...base.core || {},
			...patch.core || {},
			network: {
				...base.core?.network || {},
				...patch.core?.network || {}
			},
			socket: {
				...base.core?.socket || {},
				...patch.core?.socket || {}
			},
			interop: {
				...base.core?.interop || {},
				...patch.core?.interop || {}
			},
			ops: {
				...base.core?.ops || {},
				...patch.core?.ops || {}
			},
			admin: {
				...base.core?.admin || {},
				...patch.core?.admin || {}
			}
		},
		ai: {
			...base.ai || {},
			...patch.ai || {},
			mcp: patch.ai?.mcp ?? base.ai?.mcp ?? [],
			customInstructions: patch.ai?.customInstructions ?? base.ai?.customInstructions ?? [],
			activeInstructionId: patch.ai?.activeInstructionId ?? base.ai?.activeInstructionId ?? ""
		},
		webdav: {
			...base.webdav || {},
			...patch.webdav || {}
		},
		timeline: {
			...base.timeline || {},
			...patch.timeline || {}
		},
		appearance: {
			...base.appearance || {},
			...patch.appearance || {},
			markdown: {
				...base.appearance?.markdown || {},
				...patch.appearance?.markdown || {},
				page: {
					...base.appearance?.markdown?.page || {},
					...patch.appearance?.markdown?.page || {}
				},
				modules: {
					...base.appearance?.markdown?.modules || {},
					...patch.appearance?.markdown?.modules || {}
				},
				plugins: {
					...base.appearance?.markdown?.plugins || {},
					...patch.appearance?.markdown?.plugins || {}
				}
			}
		},
		speech: {
			...base.speech || {},
			...patch.speech || {}
		},
		grid: {
			...base.grid || {},
			...patch.grid || {}
		},
		shell: {
			...base.shell || {},
			...patch.shell || {}
		}
	};
};
var getWebDavCreateClient = async () => {
	return null;
};
var isContentScriptContext = () => {
	try {
		if (typeof chrome === "undefined" || !chrome?.runtime) return false;
		if (typeof window !== "undefined" && globalThis?.location?.protocol?.startsWith("http")) return true;
		return false;
	} catch {
		return false;
	}
};
var hasChromeStorage = () => typeof chrome !== "undefined" && chrome?.storage?.local;
async function idbOpen() {
	if (typeof indexedDB === "undefined") throw new Error("IndexedDB not available");
	if (isContentScriptContext()) throw new Error("IndexedDB not accessible in content script context");
	return new Promise((res, rej) => {
		try {
			const req = indexedDB.open(DB_NAME, 1);
			req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "key" });
			req.onsuccess = () => res(req.result);
			req.onerror = () => rej(req.error);
		} catch (e) {
			rej(e);
		}
	});
}
var idbGetSettings = async (key = SETTINGS_KEY) => {
	try {
		if (isCapacitorNativeShell() && typeof indexedDB !== "undefined") {
			try {
				const db = await idbOpen();
				const idbValue = await new Promise((res, rej) => {
					const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
					req.onsuccess = () => {
						res(req.result?.value);
						db.close();
					};
					req.onerror = () => {
						rej(req.error);
						db.close();
					};
				});
				if (idbValue != null) return idbValue;
			} catch (e) {
				console.warn("[Settings] Capacitor IndexedDB read failed, trying mirror:", e);
			}
			const mirror = readLocalStorageSettingsMirror();
			if (mirror != null) return mirror;
		}
		if (hasChromeStorage()) {
			console.log("[Settings] Using chrome.storage.local for get");
			const chromeValue = await new Promise((res) => {
				try {
					chrome.storage.local.get([key], (result) => {
						if (chrome.runtime.lastError) {
							console.warn("[Settings] chrome.storage.local.get error:", chrome.runtime.lastError);
							res(null);
						} else {
							console.log("[Settings] chrome.storage.local.get success, has data:", !!result[key]);
							res(result[key]);
						}
					});
				} catch (e) {
					console.warn("[Settings] chrome.storage access failed:", e);
					res(null);
				}
			});
			if (chromeValue != null) return chromeValue;
		}
		if (typeof indexedDB !== "undefined") {
			console.log("[Settings] Using IndexedDB for get");
			const db = await idbOpen();
			const idbValue = await new Promise((res, rej) => {
				const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
				req.onsuccess = () => {
					console.log("[Settings] IndexedDB get success, has data:", !!req.result?.value);
					res(req.result?.value);
					db.close();
				};
				req.onerror = () => {
					console.warn("[Settings] IndexedDB get error:", req.error);
					rej(req.error);
					db.close();
				};
			});
			if (idbValue != null) return idbValue;
		} else console.warn("[Settings] IndexedDB not available");
	} catch (e) {
		console.warn("[Settings] Settings storage access failed:", e);
	}
	const mirror = readLocalStorageSettingsMirror();
	if (mirror != null) {
		console.log("[Settings] Using localStorage mirror fallback for get");
		return mirror;
	}
	return null;
};
var idbPutSettings = async (value, key = SETTINGS_KEY) => {
	let idbOk = false;
	let lsOk = false;
	if (hasChromeStorage()) {
		await new Promise((res, rej) => {
			try {
				chrome.storage.local.set({ [key]: value }, () => {
					if (chrome.runtime.lastError) rej(chrome.runtime.lastError);
					else res();
				});
			} catch (e) {
				rej(e);
			}
		});
		return;
	}
	lsOk = writeLocalStorageSettingsMirror(value);
	try {
		if (typeof indexedDB === "undefined") {
			if (!lsOk && isCapacitorNativeShell()) throw new Error("Settings storage unavailable (no IndexedDB or localStorage)");
			return;
		}
		const db = await idbOpen();
		await new Promise((res, rej) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put({
				key,
				value
			});
			tx.oncomplete = () => {
				idbOk = true;
				res();
				db.close();
			};
			tx.onerror = () => {
				rej(tx.error);
				db.close();
			};
		});
	} catch (e) {
		console.warn("[Settings] IndexedDB write failed:", e);
		if (!lsOk && isCapacitorNativeShell()) throw new Error("Settings could not be saved (IndexedDB and localStorage failed)");
	}
	if (!idbOk && lsOk) console.log("[Settings] persisted to localStorage mirror (IndexedDB skipped or failed)");
};
/** Normalize `core.endpointUrl` for equality checks (scheme + host + port, lowercase). */
var normalizeCoreEndpointOrigin = (raw) => {
	const t = (raw || "").trim();
	if (!t) return "";
	try {
		const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `http://${t}`;
		const u = new URL(withScheme);
		return `${u.protocol}//${u.host}`.toLowerCase();
	} catch {
		return t.toLowerCase();
	}
};
/** Rewrite legacy `:8443` URLs and listenPort in persisted settings after fleet port migration. */
var applyLegacyCwspPortMigration = (settings) => {
	const core = settings.core;
	if (!core) return settings;
	const migrateList = (items) => items?.map((entry) => migrateLegacyCwspPublicPort(entry));
	const listenPortHttps = core.network?.listenPortHttps === 8443 || core.network?.listenPortHttps === 8343 ? 8434 : core.network?.listenPortHttps;
	return {
		...settings,
		core: {
			...core,
			endpointUrl: migrateLegacyCwspPublicPort(core.endpointUrl ?? ""),
			ops: core.ops ? {
				...core.ops,
				directUrl: migrateLegacyCwspPublicPort(core.ops.directUrl ?? ""),
				httpTargets: migrateList(core.ops.httpTargets),
				wsTargets: migrateList(core.ops.wsTargets),
				syncTargets: migrateList(core.ops.syncTargets)
			} : core.ops,
			admin: core.admin ? {
				...core.admin,
				httpsOrigin: migrateLegacyCwspPublicPort(core.admin.httpsOrigin ?? "")
			} : core.admin,
			network: core.network ? {
				...core.network,
				listenPortHttps,
				destinations: migrateList(core.network.destinations)
			} : core.network
		}
	};
};
/**
* True when persisted settings explicitly contain `shell.maintainHubSocketConnection`
* (Shell section was saved with that field — distinct from merge-time defaults).
*/
var didPersistShellMaintainHubSocket = async () => {
	try {
		const raw = await idbGetSettings();
		const stored = typeof raw === "string" ? JSOX.parse(raw) : raw;
		if (!stored || typeof stored !== "object") return false;
		const shell = stored.shell;
		return typeof shell === "object" && shell !== null && Object.prototype.hasOwnProperty.call(shell, "maintainHubSocketConnection");
	} catch {
		return false;
	}
};
/**
* MV3 Chrome extension: skip hub WebSocket bootstrap only when hub-maintain is off and
* the endpoint is still the unused bundled default. When CRX seeds {@code maintainHubSocketConnection}
* (localhost Neutralino hub or WAN), connect immediately.
*/
var shouldDeferCrxHubSocketBootstrap = async (settings) => {
	if (!isCrxExtensionRuntime()) return false;
	if (settings.shell?.maintainHubSocketConnection === true) return false;
	if (await didPersistShellMaintainHubSocket()) return false;
	const defaultEp = normalizeCoreEndpointOrigin(DEFAULT_SETTINGS.core?.endpointUrl || "");
	const currentEp = normalizeCoreEndpointOrigin(settings.core?.endpointUrl || "");
	return Boolean(defaultEp) && currentEp === defaultEp;
};
var loadSettings = async (opts) => {
	try {
		let raw = await idbGetSettings();
		if (raw == null) raw = readLocalStorageSettingsMirror();
		const stored = typeof raw === "string" ? JSOX.parse(raw) : raw;
		console.log("[Settings] loadSettings - raw type:", typeof raw, "stored type:", typeof stored);
		if (stored && typeof stored === "object") {
			let result = {
				core: {
					...DEFAULT_SETTINGS.core,
					...stored?.core,
					network: {
						...DEFAULT_SETTINGS.core?.network || {},
						...stored?.core?.network || {}
					},
					socket: {
						...DEFAULT_SETTINGS.core?.socket || {},
						...stored?.core?.socket || {}
					},
					interop: {
						...DEFAULT_SETTINGS.core?.interop || {},
						...stored?.core?.interop || {}
					},
					ops: {
						...DEFAULT_SETTINGS.core?.ops || {},
						...stored?.core?.ops || {}
					},
					admin: {
						...DEFAULT_SETTINGS.core?.admin || {},
						...stored?.core?.admin || {}
					}
				},
				ai: {
					...DEFAULT_SETTINGS.ai,
					...stored?.ai,
					mcp: stored?.ai?.mcp || [],
					customInstructions: stored?.ai?.customInstructions || [],
					activeInstructionId: stored?.ai?.activeInstructionId || ""
				},
				webdav: {
					...DEFAULT_SETTINGS.webdav,
					...stored?.webdav
				},
				timeline: {
					...DEFAULT_SETTINGS.timeline,
					...stored?.timeline
				},
				appearance: {
					...DEFAULT_SETTINGS.appearance,
					...stored?.appearance,
					markdown: {
						...DEFAULT_SETTINGS.appearance?.markdown || {},
						...stored?.appearance?.markdown || {},
						page: {
							...DEFAULT_SETTINGS.appearance?.markdown?.page || {},
							...stored?.appearance?.markdown?.page || {}
						},
						modules: {
							...DEFAULT_SETTINGS.appearance?.markdown?.modules || {},
							...stored?.appearance?.markdown?.modules || {}
						},
						plugins: {
							...DEFAULT_SETTINGS.appearance?.markdown?.plugins || {},
							...stored?.appearance?.markdown?.plugins || {}
						}
					}
				},
				speech: {
					...DEFAULT_SETTINGS.speech,
					...stored?.speech
				},
				grid: {
					...DEFAULT_SETTINGS.grid,
					...stored?.grid
				},
				shell: {
					...DEFAULT_SETTINGS.shell || {},
					...stored?.shell || {}
				}
			};
			try {
				if (opts?.nativeOverlay !== false && !isCapacitorNativeShell()) {
					if (isCwsNativeIpcAvailable()) {
						const nativeSettings = await getNativeUnifiedSettings();
						if (nativeSettings && typeof nativeSettings === "object") result = mergeNativeSettingsOverlay(result, nativeSettings);
					}
				}
			} catch {}
			try {
				if (isWebnativeSurface()) {
					if ((result.core?.preferBackendSync ?? true) !== false) {
						const bundle = await loadWebnativeControlBundle();
						const coreOverlay = mapWebnativeSnapshotToCore({
							...bundle?.snapshot || bundle?.settings || bundle?.portable || {},
							...bundle?.settings || {},
							...bundle?.portable || {}
						});
						const shellOverlay = mapWebnativeBundleToShell(bundle);
						if (coreOverlay || shellOverlay) result = {
							...result,
							core: coreOverlay ? {
								...result.core,
								...coreOverlay,
								socket: {
									...result.core?.socket || {},
									...coreOverlay.socket || {}
								},
								ops: { ...result.core?.ops || {} },
								admin: { ...result.core?.admin || {} },
								network: { ...result.core?.network || {} },
								interop: { ...result.core?.interop || {} }
							} : result.core,
							shell: shellOverlay ? {
								...result.shell || {},
								...shellOverlay
							} : result.shell
						};
					}
				}
			} catch {}
			console.log("[Settings] loadSettings result:", {
				hasApiKey: !!result.ai?.apiKey,
				instructionCount: result.ai?.customInstructions?.length || 0,
				activeInstructionId: result.ai?.activeInstructionId || "(none)"
			});
			return applyLegacyCwspPortMigration(result);
		}
		console.log("[Settings] loadSettings - no stored data, returning defaults");
	} catch (e) {
		console.warn("[Settings] loadSettings error:", e);
	}
	return JSOX.parse(JSOX.stringify(DEFAULT_SETTINGS));
};
var saveSettings = async (settings) => {
	const current = await loadSettings({ nativeOverlay: false });
	const getMcp = () => {
		if (settings.ai?.mcp !== void 0) return settings.ai.mcp;
		if (current.ai?.mcp !== void 0) return current.ai.mcp;
		return [];
	};
	const getCustomInstructions = () => {
		if (settings.ai?.customInstructions !== void 0) return settings.ai.customInstructions;
		if (current.ai?.customInstructions !== void 0) return current.ai.customInstructions;
		return [];
	};
	const getActiveInstructionId = () => {
		if (Object.prototype.hasOwnProperty.call(settings.ai || {}, "activeInstructionId")) return settings.ai?.activeInstructionId ?? "";
		if (current.ai?.activeInstructionId !== void 0) return current.ai.activeInstructionId;
		return "";
	};
	const merged = {
		core: {
			...DEFAULT_SETTINGS.core || {},
			...current.core || {},
			...settings.core || {},
			network: {
				...DEFAULT_SETTINGS.core?.network || {},
				...current.core?.network || {},
				...settings.core?.network || {}
			},
			socket: {
				...DEFAULT_SETTINGS.core?.socket || {},
				...current.core?.socket || {},
				...settings.core?.socket || {}
			},
			interop: {
				...DEFAULT_SETTINGS.core?.interop || {},
				...current.core?.interop || {},
				...settings.core?.interop || {}
			},
			ops: {
				...DEFAULT_SETTINGS.core?.ops || {},
				...current.core?.ops || {},
				...settings.core?.ops || {}
			},
			admin: {
				...DEFAULT_SETTINGS.core?.admin || {},
				...current.core?.admin || {},
				...settings.core?.admin || {}
			}
		},
		ai: {
			...DEFAULT_SETTINGS.ai || {},
			...current.ai || {},
			...settings.ai || {},
			mcp: getMcp(),
			customInstructions: getCustomInstructions(),
			activeInstructionId: getActiveInstructionId()
		},
		webdav: {
			...DEFAULT_SETTINGS.webdav || {},
			...current.webdav || {},
			...settings.webdav || {}
		},
		timeline: {
			...DEFAULT_SETTINGS.timeline || {},
			...current.timeline || {},
			...settings.timeline || {}
		},
		appearance: {
			...DEFAULT_SETTINGS.appearance || {},
			...current.appearance || {},
			...settings.appearance || {},
			markdown: {
				...DEFAULT_SETTINGS.appearance?.markdown || {},
				...current.appearance?.markdown || {},
				...settings.appearance?.markdown || {},
				page: {
					...DEFAULT_SETTINGS.appearance?.markdown?.page || {},
					...current.appearance?.markdown?.page || {},
					...settings.appearance?.markdown?.page || {}
				},
				modules: {
					...DEFAULT_SETTINGS.appearance?.markdown?.modules || {},
					...current.appearance?.markdown?.modules || {},
					...settings.appearance?.markdown?.modules || {}
				},
				plugins: {
					...DEFAULT_SETTINGS.appearance?.markdown?.plugins || {},
					...current.appearance?.markdown?.plugins || {},
					...settings.appearance?.markdown?.plugins || {}
				}
			}
		},
		speech: {
			...DEFAULT_SETTINGS.speech || {},
			...current.speech || {},
			...settings.speech || {}
		},
		grid: {
			...DEFAULT_SETTINGS.grid || {},
			...current.grid || {},
			...settings.grid || {}
		},
		shell: {
			...DEFAULT_SETTINGS.shell || {},
			...current.shell || {},
			...settings.shell || {}
		}
	};
	if (merged.core) {
		const canonicalUserId = normalizePersistedClientId(merged.core.userId);
		if (canonicalUserId) merged.core.userId = canonicalUserId;
		normalizeEcosystemToken(merged);
		if (merged.core.socket) {
			const selfRaw = String(merged.core.socket.selfId || "").trim();
			if (selfRaw) {
				const canonicalSelf = normalizePersistedClientId(selfRaw);
				merged.core.socket.selfId = canonicalSelf && canonicalSelf === (merged.core.userId || "") ? canonicalSelf : "";
			} else merged.core.socket.selfId = "";
		}
	}
	await idbPutSettings(merged);
	lastSettingsSaveReport = { nativeSynced: null };
	try {
		if (isCwsNativeIpcAvailable()) {
			await initCwsNativeBridge().catch(() => null);
			const patch = await patchNativeUnifiedSettingsDetailed(merged);
			lastSettingsSaveReport = {
				nativeSynced: patch.ok,
				nativeError: patch.error
			};
			if (!patch.ok) console.warn("[Settings] native settings patch did not confirm ok:", patch.error);
		}
	} catch (e) {
		lastSettingsSaveReport = {
			nativeSynced: false,
			nativeError: String(e instanceof Error ? e.message : e)
		};
		console.warn("[Settings] native settings patch failed:", e);
	}
	if (isWebnativeSurface()) try {
		const ok = await pushWebnativeSettingsPatch(merged);
		lastSettingsSaveReport = {
			...lastSettingsSaveReport,
			webnativeSynced: ok,
			webnativeError: ok ? void 0 : "control RPC unavailable"
		};
		if (!ok) console.warn("[Settings] webnative config patch not confirmed (control RPC unavailable?)");
	} catch (e) {
		lastSettingsSaveReport = {
			...lastSettingsSaveReport,
			webnativeSynced: false,
			webnativeError: String(e instanceof Error ? e.message : e)
		};
		console.warn("[Settings] webnative config patch failed:", e);
	}
	try {
		applyAirpadRuntimeFromAppSettings(merged);
		syncAirpadRemoteConfigFromAppSettings(merged, { persist: true });
	} catch (e) {
		console.warn("[Settings] AirPad runtime sync failed:", e);
	}
	updateWebDavSettings(merged)?.catch?.(console.warn.bind(console));
	return merged;
};
var joinPath = (base, name, addTrailingSlash = false) => {
	const b = (base || "/").replace(/\/+$/g, "") || "/";
	const n = (name || "").replace(/^\/+/g, "");
	let out = b === "/" ? `/${n}` : `${b}/${n}`;
	if (addTrailingSlash) out = out.replace(/\/?$/g, "/");
	return out.replace(/\/{2,}/g, "/");
};
var isDirHandle = (h) => h?.kind === "directory";
var safeTime = (v) => {
	const t = new Date(v).getTime();
	return Number.isFinite(t) ? t : 0;
};
/** Lazy `fest/lure` — keeps content scripts / lightweight callers from pulling lure + UI CSS. */
var lureFsPromise = null;
var isServiceWorkerScope = () => {
	try {
		return typeof globalThis.ServiceWorkerGlobalScope !== "undefined" && typeof globalThis.clients !== "undefined" && typeof globalThis.document === "undefined";
	} catch {
		return false;
	}
};
var loadLureFs = () => {
	if (isServiceWorkerScope()) return Promise.reject(/* @__PURE__ */ new Error("fest/lure FS unavailable in ServiceWorkerGlobalScope"));
	if (!lureFsPromise) lureFsPromise = import("../com/app.js").then((n) => n.t).then((m) => ({
		getDirectoryHandle: m.getDirectoryHandle,
		readFile: m.readFile
	}));
	return lureFsPromise;
};
var downloadContentsToOPFS = async (webDavClient, path = "/", opts = {}, rootHandle = null) => {
	const { getDirectoryHandle, readFile } = await loadLureFs();
	const files = await webDavClient?.getDirectoryContents?.(path || "/")?.catch?.((e) => {
		console.warn(e);
		return [];
	});
	if (opts.pruneLocal && files?.length > 0) try {
		const dirHandle = await getDirectoryHandle(rootHandle, path)?.catch?.(() => null);
		if (dirHandle?.entries) {
			const localEntries = await Array.fromAsync(dirHandle.entries());
			const remoteNames = new Set(files?.map?.((f) => f?.basename).filter(Boolean));
			await Promise.all(localEntries.filter(([name]) => !remoteNames.has(name)).map(([name]) => dirHandle.removeEntry(name, { recursive: true })?.catch?.(console.warn.bind(console))));
		}
	} catch (e) {
		console.warn(e);
	}
	return Promise.all(files.map(async (file) => {
		const isDir = file?.type === "directory";
		const fullPath = isDir ? joinPath(file.filename, "", true) : file.filename;
		if (isDir) return downloadContentsToOPFS(webDavClient, fullPath, opts, rootHandle);
		if (file?.type === "file") {
			const localMtime = safeTime((await readFile(rootHandle, fullPath).catch(() => null))?.lastModified);
			if (safeTime(file?.lastmod) > localMtime) {
				const contents = await webDavClient.getFileContents(fullPath).catch((e) => {
					console.warn(e);
					return null;
				});
				if (!contents || contents.byteLength === 0) return;
				const mime = file?.mime || "application/octet-stream";
				return writeFileSmart(rootHandle, fullPath, new File([contents], file.basename, { type: mime }));
			}
		}
	}));
};
var uploadOPFSToWebDav = async (webDavClient, dirHandle = null, path = "/", opts = {}) => {
	const { getDirectoryHandle } = await loadLureFs();
	const effectiveDirHandle = dirHandle ?? await getDirectoryHandle(null, path, { create: true })?.catch?.(console.warn.bind(console));
	const entries = await Array.fromAsync(effectiveDirHandle?.entries?.() ?? []);
	if (path != "/") {
		if (opts.pruneRemote && entries?.length >= 0) {
			const remoteItems = await webDavClient.getDirectoryContents(path || "/").catch((e) => {
				console.warn(e);
				return [];
			});
			const localSet = new Set(entries.map(([name]) => name.toLowerCase()));
			const filesFirst = [...remoteItems.filter((r) => {
				const base = (r?.basename || "").toLowerCase();
				return base && !localSet.has(base);
			}).filter((x) => x.type !== "directory")];
			for (const r of filesFirst) {
				const remotePath = r.filename || joinPath(path, r.basename, r.type === "directory");
				try {
					await webDavClient.deleteFile(remotePath);
				} catch (e) {
					console.warn("delete failed:", remotePath, e);
				}
			}
		}
	}
	await Promise.all(entries.map(async ([name, fileOrDir]) => {
		const isDir = isDirHandle(fileOrDir);
		const remotePath = joinPath(path, name, isDir);
		if (isDir) {
			const dirPathNoSlash = joinPath(path, name, false);
			if (!await webDavClient.exists(dirPathNoSlash).catch((_e) => {
				return false;
			})) await webDavClient.createDirectory(dirPathNoSlash, { recursive: true }).catch(console.warn);
			return uploadOPFSToWebDav(webDavClient, fileOrDir, remotePath, opts);
		}
		const fileContent = await fileOrDir.getFile();
		if (!fileContent || fileContent.size === 0) return;
		const fullFilePath = joinPath(path, name, false);
		const remoteStat = await webDavClient.stat(fullFilePath).catch(() => null);
		const remoteMtime = safeTime(remoteStat?.lastmod);
		const localMtime = safeTime(fileContent.lastModified);
		if (!remoteStat || localMtime > remoteMtime) await webDavClient.putFileContents(fullFilePath, await fileContent.arrayBuffer(), { overwrite: true }).catch((_e) => {
			return null;
		});
	}));
};
var getHostOnly = (address) => {
	const url = new URL(address);
	return url.protocol + url.hostname + ":" + url.port;
};
var WebDavSync = async (address, options = {}) => {
	console.log("[Settings] WebDavSync", address, options);
	if (!address) return null;
	const createClient = await getWebDavCreateClient();
	if (!createClient) return null;
	const client = createClient(getHostOnly(address), options);
	return {
		status: currentWebDav?.sync?.getDAVCompliance?.()?.catch?.(console.warn.bind(console)) ?? null,
		client,
		upload(withPrune = false) {
			if (this.status != null) return uploadOPFSToWebDav(client, null, "/", { pruneRemote: withPrune })?.catch?.((e) => {
				console.warn(e);
				return [];
			});
		},
		download(withPrune = false) {
			if (this.status != null) return downloadContentsToOPFS(client, "/", { pruneLocal: withPrune })?.catch?.((e) => {
				console.warn(e);
				return [];
			});
		}
	};
};
var currentWebDav = { sync: null };
if (!isContentScriptContext()) (async () => {
	try {
		const settings = await loadSettings();
		if (settings?.core?.mode === "endpoint" && settings?.core?.preferBackendSync) return;
		if (!settings?.webdav?.url) return;
		currentWebDav.sync = await WebDavSync(settings.webdav.url, {
			withCredentials: true,
			username: settings.webdav.username,
			password: settings.webdav.password,
			token: settings.webdav.token
		}) ?? currentWebDav.sync;
		await currentWebDav?.sync?.upload?.(true);
		await currentWebDav?.sync?.download?.(true);
	} catch (e) {}
})();
var updateWebDavSettings = async (settings) => {
	settings ||= await loadSettings();
	if (settings?.core?.mode === "endpoint" && settings?.core?.preferBackendSync) {
		currentWebDav.sync = null;
		return;
	}
	if (!settings?.webdav?.url) return;
	currentWebDav.sync = await WebDavSync(settings.webdav.url, {
		withCredentials: true,
		username: settings.webdav.username,
		password: settings.webdav.password,
		token: settings.webdav.token
	}) ?? currentWebDav.sync;
	await currentWebDav?.sync?.upload?.();
	await currentWebDav?.sync?.download?.(true);
};
if (!isContentScriptContext()) {
	try {
		if (typeof window !== "undefined" && typeof addEventListener === "function") {
			addEventListener("pagehide", () => {
				currentWebDav?.sync?.upload?.()?.catch?.(() => {});
			});
			addEventListener("beforeunload", () => {
				currentWebDav?.sync?.upload?.()?.catch?.(() => {});
			});
		}
	} catch {}
	(async () => {
		try {
			while (true) {
				await currentWebDav?.sync?.upload?.()?.catch?.(() => {});
				await new Promise((resolve) => setTimeout(resolve, 3e3));
			}
		} catch {}
	})();
}
//#endregion
//#region ../../modules/views/airpad-view/src/utils/utils.ts
/** Airpad markup mount node (set on mount, cleared on unmount). Avoid `document.getElementById` — IDs may not be in the document tree (routed host, shadow, iframe). */
var airpadDomRoot = null;
function setAirpadDomRoot(root) {
	airpadDomRoot = root;
}
function getAirpadDomRoot() {
	return airpadDomRoot;
}
/** Document that owns the Airpad mount (correct when embedded in an iframe). */
function getAirpadOwnerDocument() {
	return airpadDomRoot?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
}
function byId(id) {
	const r = airpadDomRoot;
	if (!r) return null;
	try {
		return r.querySelector(`#${CSS.escape(id)}`);
	} catch {
		return null;
	}
}
/** Scoped `querySelector` under the current Airpad mount root. */
function queryAirpad(selector) {
	if (!airpadDomRoot) return null;
	return airpadDomRoot.querySelector(selector);
}
var getWsStatusEl = () => byId("wsStatus");
var getAirStatusEl = () => byId("airStatus");
var getAiStatusEl = () => byId("aiStatus");
var getLogEl = () => byId("logContainer");
var getVoiceTextEl = () => byId("voiceText");
var getVkStatusEl = () => byId("vkStatus");
var getBtnConnect = () => byId("btnConnect") ?? queryAirpad("cw-airpad-action-rail #btnConnect");
var getAirButton = () => byId("airButton");
var getAiButton = () => byId("aiButton");
var getAirNeighborButton = () => byId("airNeighborButton");
var getBtnCut = () => byId("btnCut") ?? queryAirpad("cw-airpad-action-rail #btnCut");
var getBtnCopy = () => byId("btnCopy") ?? queryAirpad("cw-airpad-action-rail #btnCopy");
var getBtnPaste = () => byId("btnPaste") ?? queryAirpad("cw-airpad-action-rail #btnPaste");
var getClipboardPreviewEl = () => byId("clipboardPreview") ?? queryAirpad("cw-airpad-action-rail #clipboardPreview");
function log(msg) {
	const doc = airpadDomRoot?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
	if (!doc) {
		console.log("[LOG]", msg);
		return;
	}
	const line = doc.createElement("div");
	line.textContent = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${msg}`;
	const logContainer = getLogEl();
	if (logContainer) {
		logContainer.appendChild(line);
		logContainer.scrollTop = logContainer.scrollHeight;
	}
	console.log("[LOG]", msg);
}
//#endregion
//#region ../../modules/projects/cwsp-shared/src/clipboard-wire-constants.ts
/** Max age from first origin stamp before a non-input act is dropped (apply + relay). */
var PACKET_ORIGIN_TTL_MS = 4e3;
//#endregion
//#region ../../modules/projects/cwsp-shared/src/wire-time64.ts
var SUB_US_SCALE = 1e6;
var hrtimeOffsetUs = 0;
var hrtimeAnchorMs = 0;
var refreshHrtimeAnchor = () => {
	hrtimeAnchorMs = Date.now();
	if (typeof process !== "undefined" && typeof process.hrtime?.bigint === "function") {
		hrtimeOffsetUs = Number(process.hrtime.bigint() / 1000n) % SUB_US_SCALE;
		return;
	}
	try {
		const perf = globalThis.performance;
		if (typeof perf?.now === "function") {
			hrtimeOffsetUs = Math.floor(perf.now() % 1 * SUB_US_SCALE) % SUB_US_SCALE;
			return;
		}
	} catch {}
	hrtimeOffsetUs = 0;
};
refreshHrtimeAnchor();
/** Capture monotonic-aligned 64-bit wire time. */
var captureWireTime64 = () => {
	const ts = Date.now();
	let subUs = 0;
	if (typeof process !== "undefined" && typeof process.hrtime?.bigint === "function") {
		const deltaMs = ts - hrtimeAnchorMs;
		if (deltaMs < 0 || deltaMs > 6e4) refreshHrtimeAnchor();
		subUs = (hrtimeOffsetUs + Number(process.hrtime.bigint() / 1000n)) % SUB_US_SCALE;
	} else try {
		const perf = globalThis.performance;
		if (typeof perf?.now === "function") subUs = Math.floor(perf.now() % 1 * SUB_US_SCALE) % SUB_US_SCALE;
	} catch {
		subUs = 0;
	}
	const wireTime64 = String(BigInt(ts) * BigInt(SUB_US_SCALE) + BigInt(subUs));
	return {
		ts,
		subUs,
		wireTime64,
		ts64: wireTime64,
		wireTs: wireTime64
	};
};
/** Merge {@code ts}, {@code subUs}, {@code wireTime64} onto payload without overwriting explicit values. */
var annotateWireTime64 = (payload) => {
	const timing = captureWireTime64();
	const wireTime64 = String(payload.wireTime64 ?? payload.ts64 ?? payload.wireTs ?? timing.wireTime64);
	return {
		...payload,
		ts: Number(payload.ts ?? timing.ts),
		subUs: Number(payload.subUs ?? timing.subUs),
		wireTime64,
		ts64: wireTime64,
		wireTs: wireTime64
	};
};
var asRecord$2 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
var readPositiveMs = (value) => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : 0;
};
/** Immutable first-send wall clock — survives gateway relay without resetting age. */
var packetOriginTimestampMs = (packet) => {
	const flags = asRecord$2(packet.flags);
	const payload = asRecord$2(packet.payload ?? packet.data);
	const wireParsed = parseWireTime64(packet.originTs ?? flags.originTs ?? payload.originTs);
	if (wireParsed?.ts) return wireParsed.ts;
	return readPositiveMs(packet.originTs) || readPositiveMs(flags.originTs) || readPositiveMs(payload.originTs) || readPositiveMs(packet.timestamp) || readPositiveMs(packet.ts) || readPositiveMs(flags.timestamp) || readPositiveMs(flags.ts) || readPositiveMs(payload.timestamp) || readPositiveMs(payload.ts) || 0;
};
/** Packet-level timestamp fields (root {@code timestamp} mirrors {@code ts}). */
var annotatePacketWireTime64 = (packet) => {
	const timing = captureWireTime64();
	const existingOrigin = packetOriginTimestampMs(packet) || readPositiveMs(packet.timestamp) || readPositiveMs(packet.ts) || timing.ts;
	const ts = readPositiveMs(packet.timestamp) || readPositiveMs(packet.ts) || existingOrigin;
	const subUs = Number(packet.subUs ?? timing.subUs);
	const wireTime64 = String(packet.wireTime64 ?? packet.ts64 ?? packet.wireTs ?? timing.wireTime64);
	const priorFlags = asRecord$2(packet.flags);
	const flags = {
		...priorFlags,
		originTs: priorFlags.originTs ?? packet.originTs ?? existingOrigin,
		wireTime64: priorFlags.wireTime64 ?? wireTime64,
		ts64: priorFlags.ts64 ?? priorFlags.wireTime64 ?? wireTime64,
		wireTs: priorFlags.wireTs ?? priorFlags.wireTime64 ?? wireTime64
	};
	return {
		...packet,
		originTs: packet.originTs ?? existingOrigin,
		ts,
		subUs,
		wireTime64,
		ts64: wireTime64,
		wireTs: wireTime64,
		timestamp: ts,
		flags
	};
};
var parseWireTime64 = (value) => {
	const raw = String(value ?? "").trim();
	if (!/^\d+$/.test(raw)) return null;
	try {
		const composite = BigInt(raw);
		const ts = Number(composite / BigInt(SUB_US_SCALE));
		const subUs = Number(composite % BigInt(SUB_US_SCALE));
		if (!Number.isFinite(ts)) return null;
		return {
			ts,
			subUs,
			wireTime64: raw,
			ts64: raw,
			wireTs: raw
		};
	} catch {
		return null;
	}
};
//#endregion
//#region ../../modules/projects/cwsp-shared/src/input-command-timing.ts
/**
* Send-time markers for coordinator input + clipboard acts.
*
* INVARIANT: canonical copy lives in `fest/cwsp-shared`; portable deploy bundles via esbuild.
*/
var asRecord$1 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
var readPerfNow = () => {
	try {
		const perf = globalThis.performance;
		if (typeof perf?.now === "function") return perf.now();
	} catch {}
	return Date.now();
};
/** Low 16 bits of deci-ms perf clock — packed into legacy 8-byte AirPad frames (bytes 6–7). */
var encodeInputPerfTsLo = (perfTs = readPerfNow()) => Math.round(perfTs * 10) & 65535;
/** Expand binary {@link encodeInputPerfTsLo} back to a sortable perfTs fragment. */
var decodeInputPerfTsLo = (perfTsLo) => (perfTsLo & 65535) / 10;
var isInputCoordinatorWhat = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	return normalized.startsWith("mouse:") || normalized.startsWith("keyboard:") || normalized.startsWith("airpad:mouse") || normalized.startsWith("airpad:keyboard");
};
/** Discrete pointer/keyboard acts — must not be stale-dropped or wire-replay suppressed like move bursts. */
var isDiscreteInputWhat = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	return normalized === "mouse:click" || normalized === "mouse:down" || normalized === "mouse:up" || normalized === "keyboard:tap" || normalized === "keyboard:type" || normalized === "keyboard:toggle";
};
var readAirpadWrapperOp$1 = (packet) => {
	const payload = asRecord$1(packet.payload ?? packet.data ?? packet.body);
	const direct = String(payload.op ?? payload.action ?? payload.type ?? "").trim().toLowerCase();
	if (direct) return direct;
	const params = payload.params;
	if (Array.isArray(params) && params.length > 0) return String(params[0] ?? "").trim().toLowerCase();
	return "";
};
/** Packet-aware discrete input (incl. `airpad:mouse` click/down/up wrappers). */
var isDiscreteInputPacket = (packet) => {
	if (typeof packet === "string") return isDiscreteInputWhat(packet);
	const what = String(packet.what || packet.type || "").trim().toLowerCase();
	if (isDiscreteInputWhat(what)) return true;
	if (what === "airpad:mouse" || what.startsWith("airpad:mouse")) {
		const op = readAirpadWrapperOp$1(packet) || "move";
		return op === "click" || op === "mouse:click" || op === "down" || op === "mouse:down" || op === "up" || op === "mouse:up";
	}
	if (what === "airpad:keyboard" || what.startsWith("airpad:keyboard")) return true;
	return false;
};
var isClipboardCoordinatorWhat = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	return normalized.startsWith("clipboard:") || normalized.startsWith("airpad:clipboard:");
};
/** Input + clipboard coordinator acts carry send-time markers for ordering/dedupe. */
var shouldAnnotateCoordinatorPayload = (what) => isInputCoordinatorWhat(what) || isClipboardCoordinatorWhat(what);
/** Merge timing into payload without overwriting explicit values. */
var annotateCoordinatorPayload = (payload) => {
	const base = asRecord$1(payload);
	const perfTs = Number(base.perfTs ?? readPerfNow());
	return {
		...annotateWireTime64(base),
		perfTs,
		perfTsLo: Number(base.perfTsLo ?? encodeInputPerfTsLo(perfTs))
	};
};
//#endregion
//#region ../../modules/projects/cwsp-shared/src/packet-wire-hash.ts
/**
* CWSP wire replay markers — stable {@code wireHash} on acts to stop duplicate apply + ping-pong.
* Parity: Java {@code CwspWireHash}, Node {@code local-dispatch.ts}, browser {@code websocket.ts}.
*/
var WIRE_HASH_FIELD = "wireHash";
var VOLATILE_PAYLOAD_KEYS = /* @__PURE__ */ new Set([
	"ts",
	"subUs",
	"wireTime64",
	"ts64",
	"wireTs",
	"perfTs",
	"perfTsLo",
	WIRE_HASH_FIELD,
	"source",
	"from",
	"clientId",
	"userId",
	"sender"
]);
var asRecord = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
/** djb2 → base36 (matches Node {@code local-dispatch} + Java {@code CwspWireHash}). */
var cheapWireHash = (value) => {
	if (!value) return "";
	let h = 5381;
	for (let i = 0; i < value.length; i += 1) h = (h << 5) + h + value.charCodeAt(i) | 0;
	return (h >>> 0).toString(36);
};
var normalizeClipboardWireText = (text) => String(text ?? "").replace(/\r\n/g, "\n").trim();
var stableStringify = (value) => {
	if (value === null || value === void 0) return "";
	if (typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).filter((key) => !VOLATILE_PAYLOAD_KEYS.has(key)).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
};
var readAssetHash = (payload) => {
	for (const key of [
		"asset",
		"dataAsset",
		"file",
		"image"
	]) {
		const asset = asRecord(payload[key]);
		const hash = String(asset.hash ?? "").trim();
		if (hash) return hash;
	}
	return "";
};
var readClipboardText = (payload, packet) => {
	for (const key of [
		"text",
		"content",
		"body"
	]) {
		const direct = payload[key];
		if (typeof direct === "string" && direct.trim()) return direct;
	}
	for (const root of [
		"payload",
		"data",
		"result"
	]) {
		const carrier = packet[root];
		if (typeof carrier === "string" && carrier.trim()) return carrier;
	}
	return "";
};
var inferWireDedupeCategory = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	if (!normalized) return "general";
	if (normalized.startsWith("clipboard:") || normalized.startsWith("airpad:clipboard:")) return "clipboard";
	if (normalized.startsWith("mouse:") || normalized.startsWith("keyboard:") || normalized.startsWith("airpad:mouse") || normalized.startsWith("airpad:keyboard")) return "input";
	return "general";
};
var dedupeWindowForCategory = (category) => {
	if (category === "clipboard") return 250;
	if (category === "input") return 180;
	return 400;
};
var isDedupeExemptWhat = (what, op) => {
	if (op === "ask" || op === "request") return true;
	if (!what) return true;
	if (what.endsWith(":read") || what.endsWith(":get") || what.endsWith(":isready")) return true;
	return false;
};
/** Read explicit marker from flags / payload / root. */
var extractPacketWireHash = (packet) => {
	const flags = asRecord(packet.flags);
	const payload = asRecord(packet.payload ?? packet.data);
	return String(flags["wireHash"] ?? packet["wireHash"] ?? payload["wireHash"] ?? "").trim();
};
/** Stable content hash for one coordinator act (excludes uuid/timing noise). */
var computePacketWireHash = (packet) => {
	const op = String(packet.op || "act").trim().toLowerCase();
	const what = String(packet.what || packet.type || "").trim().toLowerCase();
	if (isDedupeExemptWhat(what, op)) return "";
	const sender = String(packet.byId || packet.from || packet.sender || "").trim().toLowerCase();
	const payload = asRecord(packet.payload ?? packet.data ?? packet.body ?? {});
	if (what.includes("clipboard")) {
		const text = readClipboardText(payload, packet);
		const assetHash = text ? "" : readAssetHash(payload);
		const content = text ? cheapWireHash(normalizeClipboardWireText(text)) : assetHash ? `asset:${assetHash}` : cheapWireHash(stableStringify(payload));
		if (!content) return "";
		const uuid = String(packet.uuid ?? "").trim();
		return cheapWireHash(`${op}|${what}|${sender}|${content}${uuid ? `|u:${uuid}` : ""}`);
	}
	if (inferWireDedupeCategory(what) === "input") {
		const perfMarker = payload.perfTs ?? payload.perfTsLo ?? "";
		return cheapWireHash(`${op}|${what}|${sender}|${stableStringify(payload)}|p:${perfMarker}`);
	}
	return cheapWireHash(`${op}|${what}|${sender}|${stableStringify(payload)}`);
};
/** Attach {@code flags.wireHash} + payload mirror; refresh when payload content changes. */
var annotatePacketWireHash = (packet) => {
	const timed = annotatePacketWireTime64(packet);
	const hash = computePacketWireHash(timed);
	if (!hash) return timed;
	if (extractPacketWireHash(timed) === hash) return timed;
	const flags = {
		...asRecord(timed.flags),
		[WIRE_HASH_FIELD]: hash
	};
	const payloadRaw = timed.payload ?? timed.data;
	let nextPayload = payloadRaw;
	if (payloadRaw && typeof payloadRaw === "object" && !Array.isArray(payloadRaw)) nextPayload = {
		...payloadRaw,
		[WIRE_HASH_FIELD]: hash
	};
	if (timed.payload !== void 0) return {
		...timed,
		flags,
		payload: nextPayload
	};
	if (timed.data !== void 0) return {
		...timed,
		flags,
		data: nextPayload
	};
	return {
		...timed,
		flags,
		payload: nextPayload
	};
};
var PacketWireDedupeGuard = class {
	maxEntries;
	seen = /* @__PURE__ */ new Map();
	constructor(maxEntries = 512) {
		this.maxEntries = maxEntries;
	}
	/** Returns true when the same wireHash was seen inside the category window. */
	shouldSuppress(packet, category) {
		const what = String(packet.what || packet.type || "").trim().toLowerCase();
		if (isDedupeExemptWhat(what, String(packet.op || "act").trim().toLowerCase())) return false;
		const hash = extractPacketWireHash(packet) || computePacketWireHash(packet);
		if (!hash) return false;
		const cat = category ?? inferWireDedupeCategory(what);
		const windowMs = dedupeWindowForCategory(cat);
		const now = Date.now();
		const key = `${cat}|${hash}`;
		const prev = this.seen.get(key);
		this.seen.set(key, now);
		this.prune(now, windowMs);
		return prev !== void 0 && now - prev < windowMs;
	}
	clear() {
		this.seen.clear();
	}
	prune(now, windowMs) {
		const ttl = Math.max(windowMs * 4, 4e3);
		for (const [key, ts] of this.seen.entries()) if (now - ts > ttl) this.seen.delete(key);
		if (this.seen.size <= this.maxEntries) return;
		const sorted = [...this.seen.entries()].sort((a, b) => a[1] - b[1]);
		for (let i = 0; i < sorted.length - this.maxEntries; i += 1) this.seen.delete(sorted[i][0]);
	}
};
var packetWireDedupeGuard = new PacketWireDedupeGuard();
/**
* Per-hop mesh relay dedupe — stops already-seen wireHash from floating between peers
* within {@link PACKET_ORIGIN_TTL_MS} without blocking first forward.
*/
var PacketWireRelayDedupeGuard = class {
	maxEntries;
	seen = /* @__PURE__ */ new Map();
	constructor(maxEntries = 512) {
		this.maxEntries = maxEntries;
	}
	shouldSuppress(packet) {
		if (isHighFrequencyInputPacket(packet)) return false;
		if (isDiscreteInputPacket(packet)) return false;
		if (isDedupeExemptWhat(String(packet.what || packet.type || "").trim().toLowerCase(), String(packet.op || "act").trim().toLowerCase())) return false;
		const hash = extractPacketWireHash(packet) || computePacketWireHash(packet);
		if (!hash) return false;
		const now = Date.now();
		const key = `relay|${hash}`;
		const prev = this.seen.get(key);
		this.seen.set(key, now);
		this.prune(now);
		return prev !== void 0 && now - prev < 4e3;
	}
	clear() {
		this.seen.clear();
	}
	prune(now) {
		const ttl = Math.max(PACKET_ORIGIN_TTL_MS * 4, 4e3);
		for (const [key, ts] of this.seen.entries()) if (now - ts > ttl) this.seen.delete(key);
		if (this.seen.size <= this.maxEntries) return;
		const sorted = [...this.seen.entries()].sort((a, b) => a[1] - b[1]);
		for (let i = 0; i < sorted.length - this.maxEntries; i += 1) this.seen.delete(sorted[i][0]);
	}
};
new PacketWireRelayDedupeGuard();
/** High-frequency relative deltas must never be replay-suppressed (drops smooth cursor). */
var isHighFrequencyInputWhat = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	return normalized === "mouse:move" || normalized === "mouse:scroll";
};
var readAirpadWrapperOp = (packet) => {
	const payload = asRecord(packet.payload ?? packet.data ?? packet.body);
	const direct = String(payload.op ?? payload.action ?? payload.type ?? "").trim().toLowerCase();
	if (direct) return direct;
	const params = payload.params;
	if (Array.isArray(params) && params.length > 0) return String(params[0] ?? "").trim().toLowerCase();
	return "";
};
/** Packet-aware high-frequency check, including `airpad:mouse` wrappers from Java/Android clients. */
var isHighFrequencyInputPacket = (packet) => {
	if (typeof packet === "string") return isHighFrequencyInputWhat(packet);
	const what = String(packet.what || packet.type || "").trim().toLowerCase();
	if (isHighFrequencyInputWhat(what)) return true;
	if (what !== "airpad:mouse" && !what.startsWith("airpad:mouse")) return false;
	const op = readAirpadWrapperOp(packet) || "move";
	return op === "move" || op === "mouse:move" || op === "scroll" || op === "mouse:scroll";
};
//#endregion
//#region ../../modules/views/airpad-view/src/credential-cache-bridge.ts
var impl = null;
/** Called from websocket.ts at module load. */
function setAirpadCredentialInvalidator(fn) {
	impl = fn;
}
/** Clear AES/HMAC key caches when transport secrets or mode change. */
function invalidateAirpadTransportCredentials() {
	try {
		impl?.();
	} catch {}
}
//#endregion
export { loadSettings as A, getVkStatusEl as C, queryAirpad as D, log as E, setAirpadDomRoot as O, getClipboardPreviewEl as S, getWsStatusEl as T, getAirpadOwnerDocument as _, packetWireDedupeGuard as a, getBtnCut as b, encodeInputPerfTsLo as c, getAiButton as d, getAiStatusEl as f, getAirpadDomRoot as g, getAirStatusEl as h, inferWireDedupeCategory as i, shouldDeferCrxHubSocketBootstrap as j, ensureCapacitorCwspSettingsSeeded as k, shouldAnnotateCoordinatorPayload as l, getAirNeighborButton as m, setAirpadCredentialInvalidator as n, annotateCoordinatorPayload as o, getAirButton as p, annotatePacketWireHash as r, decodeInputPerfTsLo as s, invalidateAirpadTransportCredentials as t, annotatePacketWireTime64 as u, getBtnConnect as v, getVoiceTextEl as w, getBtnPaste as x, getBtnCopy as y };
