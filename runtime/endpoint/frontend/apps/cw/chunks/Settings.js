import { n as __exportAll } from "./rolldown-runtime.js";
import { n as writeFileSmart, v as JSOX } from "../com/app.js";
import { c as isCwsNativeIpcAvailable, i as initCwsNativeBridge, l as patchNativeUnifiedSettingsDetailed, r as getNativeUnifiedSettings } from "../vendor/@capacitor_core.js";
import { n as DEFAULT_SETTINGS, r as normalizeEcosystemToken } from "./SettingsTypes.js";
import { T as sanitizeFleetSelfWireNodeId, V as migrateLegacyCwspPublicPort, u as isAssociableFleetWireNodeId, y as normalizeWireNodeIdForWire } from "./airpad-cwsp-client-parity.js";
import { d as applyAirpadRuntimeFromAppSettings, q as syncAirpadRemoteConfigFromAppSettings } from "./config.js";
//#region src/shared/other/config/Settings.ts
var Settings_exports = /* @__PURE__ */ __exportAll({
	DB_NAME: () => DB_NAME,
	SETTINGS_KEY: () => SETTINGS_KEY,
	SETTINGS_LS_MIRROR_KEY: () => SETTINGS_LS_MIRROR_KEY,
	STORE: () => STORE,
	WebDavSync: () => WebDavSync,
	currentWebDav: () => currentWebDav,
	default: () => WebDavSync,
	didPersistShellMaintainHubSocket: () => didPersistShellMaintainHubSocket,
	ensureCapacitorCwspSettingsSeeded: () => ensureCapacitorCwspSettingsSeeded,
	ensureCrxCwspSettingsSeeded: () => ensureCrxCwspSettingsSeeded,
	getByPath: () => getByPath,
	getLastSettingsSaveReport: () => getLastSettingsSaveReport,
	idbGetSettings: () => idbGetSettings,
	idbPutSettings: () => idbPutSettings,
	loadSettings: () => loadSettings,
	normalizeCoreEndpointOrigin: () => normalizeCoreEndpointOrigin,
	noteSettingsControlSync: () => noteSettingsControlSync,
	saveSettings: () => saveSettings,
	shouldDeferCrxHubSocketBootstrap: () => shouldDeferCrxHubSocketBootstrap,
	slugify: () => slugify,
	splitPath: () => splitPath,
	updateWebDavSettings: () => updateWebDavSettings
});
var SETTINGS_KEY = "rs-settings";
/** localStorage mirror for Capacitor WebView when IndexedDB is flaky or empty. */
var SETTINGS_LS_MIRROR_KEY = "rs-settings.v1";
var lastSettingsSaveReport = { nativeSynced: null };
var getLastSettingsSaveReport = () => ({ ...lastSettingsSaveReport });
/** Public /cwsp Settings arm reports Control POST outcome (Capacitor Java or Neutralino). */
var noteSettingsControlSync = (ok, error) => {
	lastSettingsSaveReport = {
		...lastSettingsSaveReport,
		webnativeSynced: ok,
		webnativeError: ok ? void 0 : error
	};
};
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
var CAPACITOR_CLIPBOARD_ASK_MIGRATED_KEY = "cwsp.clipboardAskHeadsMigratedV1";
/**
* WHY: older Capacitor IDB defaults used shell.clipboard*Mode=auto — Accept never posts.
* One-shot upgrade to ask (user can switch back in Settings).
*/
var ensureCapacitorClipboardAskModes = (settings) => {
	if (!isCapacitorNativeShell()) return null;
	try {
		if (globalThis.localStorage?.getItem?.(CAPACITOR_CLIPBOARD_ASK_MIGRATED_KEY) === "1") return null;
	} catch {}
	const inbound = String(settings.shell?.clipboardInboundMode || "auto").trim().toLowerCase();
	const outbound = String(settings.shell?.clipboardOutboundMode || "auto").trim().toLowerCase();
	const needIn = inbound !== "ask";
	const needOut = outbound !== "ask";
	try {
		globalThis.localStorage?.setItem?.(CAPACITOR_CLIPBOARD_ASK_MIGRATED_KEY, "1");
	} catch {}
	if (!needIn && !needOut) return null;
	return {
		...settings,
		shell: {
			...settings.shell,
			...needIn ? { clipboardInboundMode: "ask" } : null,
			...needOut ? { clipboardOutboundMode: "ask" } : null
		}
	};
};
/** Compose Capacitor shell migrations (desk peers + ask modes). */
var applyCapacitorShellMigrations = (settings) => {
	let next = null;
	const desk = ensureCapacitorDeskClipboardTargets(settings);
	if (desk) next = desk;
	const ask = ensureCapacitorClipboardAskModes(next || settings);
	if (ask) next = ask;
	return next;
};
/** Neutralino / WebNative / /cwsp Control bridge shares `/service/config`. */
var isWebnativeSurface = () => {
	try {
		const g = globalThis;
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		return Boolean(g.__CWS_WEBNATIVE_BOOT__ || g.__CWS_NEUTRALINO_BOOT__ || g.__CWSP_CONTROL_BRIDGE_LIVE__ || auth && typeof auth.port === "number");
	} catch {
		return false;
	}
};
var readDesktopControlAuth = () => {
	try {
		const g = globalThis;
		const src = g.__CWSP_CONTROL_SOURCE__;
		const via = String(g.__CWSP_CONTROL_VIA__ || "");
		if (via === "android" && src && typeof src.port === "number" && src.host) return {
			port: src.port,
			key: String(src.apiKey || src.userKey || ""),
			host: String(src.host).trim(),
			scheme: src.scheme === "https" ? "https" : "http"
		};
		if (via === "neutralino" || g.__NEUTRALINO_AUTH__) {
			const n = g.__NEUTRALINO_AUTH__ || g.__WEBNATIVE_AUTH__;
			if (n && typeof n.port === "number") return {
				port: n.port || 29110,
				key: String(n.key || "cwsp-neutralino-local"),
				host: String(n.host || "127.0.0.1"),
				scheme: n.scheme === "https" ? "https" : "http"
			};
		}
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		if (auth && typeof auth.port === "number") return {
			port: auth.port,
			key: String(auth.key || src?.apiKey || src?.userKey || ""),
			host: String(auth.host || src?.host || "127.0.0.1").trim() || "127.0.0.1",
			scheme: auth.scheme === "https" || src?.scheme === "https" ? "https" : "http"
		};
		if (src && typeof src.port === "number" && src.host) return {
			port: src.port,
			key: String(src.apiKey || src.userKey || ""),
			host: String(src.host).trim() || "127.0.0.1",
			scheme: src.scheme === "https" ? "https" : "http"
		};
		return null;
	} catch {
		return null;
	}
};
var readControlBridgeVia = () => {
	try {
		return String(globalThis.__CWSP_CONTROL_VIA__ || "");
	} catch {
		return "";
	}
};
/** https://cwsp.u2re.space Control SPA — settings:patch arm owns device SoT (not saveSettings Node push). */
var isPublicCwspControlSpa = () => {
	try {
		if (String(globalThis.document?.documentElement?.dataset?.cwspSurface || "").toLowerCase() === "cwsp-control") return true;
		return /^(www\.)?cwsp\.u2re\.space$/i.test(String(location?.hostname || ""));
	} catch {
		return false;
	}
};
var isChromeExtensionPage = () => {
	try {
		return String(location?.protocol || "").toLowerCase() === "chrome-extension:";
	} catch {
		return false;
	}
};
var readControlSessionToken = () => {
	try {
		const fromGlobal = String(globalThis.__CWSP_CONTROL_SESSION__ || "").trim();
		if (fromGlobal) return fromGlobal;
	} catch {}
	try {
		const raw = sessionStorage.getItem("cwsp-control-session-v1");
		if (!raw) return "";
		const parsed = JSON.parse(raw);
		if (!parsed?.token) return "";
		if (Number(parsed.expiresAt) && Date.now() >= Number(parsed.expiresAt)) return "";
		try {
			if (parsed.origin && parsed.origin !== String(location.origin || "")) return "";
		} catch {}
		return String(parsed.token).trim();
	} catch {
		return "";
	}
};
/** CRX persistent session lives in chrome.storage.local (not sessionStorage). */
var readCrxControlSessionTokenAsync = async () => {
	if (!isChromeExtensionPage()) return "";
	try {
		return await (await import("./crx-control-session.js")).getCrxControlSessionToken() || "";
	} catch {
		return "";
	}
};
var webnativeControl = async (path, init) => {
	try {
		const auth = readDesktopControlAuth();
		if (!auth || typeof auth.port !== "number") return null;
		const host = String(auth.host || "127.0.0.1").trim() || "127.0.0.1";
		const scheme = auth.scheme === "https" ? "https" : "http";
		const pageHost = String(location.hostname || "").toLowerCase();
		const pageIsPublicHttps = location.protocol === "https:" && pageHost !== "127.0.0.1" && pageHost !== "localhost" && pageHost !== "::1";
		const viaAndroid = readControlBridgeVia() === "android";
		if (pageIsPublicHttps && !viaAndroid && (host === "127.0.0.1" || host === "localhost" || host === "::1") && auth.port === 8434) return null;
		const headers = new Headers(init?.headers);
		headers.set("Content-Type", "application/json");
		const pageIsChromeExtension = isChromeExtensionPage();
		let session = readControlSessionToken();
		if (!session && pageIsChromeExtension) {
			session = await readCrxControlSessionTokenAsync();
			if (session) try {
				globalThis.__CWSP_CONTROL_SESSION__ = session;
			} catch {}
		}
		if (pageIsPublicHttps || pageIsChromeExtension) {
			if (!session) {
				const method = String(init?.method || "GET").toUpperCase();
				if (pageIsChromeExtension && method !== "GET" && method !== "HEAD") try {
					globalThis.dispatchEvent(new CustomEvent("cwsp-control-unauthorized", { detail: {
						status: 401,
						path,
						reason: "missing-session"
					} }));
				} catch {}
				return null;
			}
			headers.set("X-Control-Session", session);
			headers.delete("X-API-Key");
			headers.delete("X-Skip-Legacy-Key");
			if (pageIsChromeExtension) try {
				const id = String(globalThis.chrome?.runtime?.id || "").trim();
				if (id) headers.set("X-Control-Origin", `chrome-extension://${id}`);
			} catch {}
		} else {
			if (session) headers.set("X-Control-Session", session);
			if (auth.key) headers.set("X-API-Key", auth.key);
		}
		const signal = init?.signal ?? (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(2500) : void 0);
		const url = `${scheme}://${host.includes(":") && !host.startsWith("[") ? `[${host}]` : host}:${auth.port}${path.startsWith("/") ? path : `/${path}`}`;
		const isLoopback = host === "127.0.0.1" || host === "localhost" || host === "::1";
		const isPrivate = /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
		const fetchInit = {
			...init,
			headers,
			cache: "no-store",
			signal,
			mode: "cors",
			credentials: "omit"
		};
		if (isLoopback) fetchInit.targetAddressSpace = "loopback";
		else if (isPrivate) fetchInit.targetAddressSpace = "local";
		const res = await fetch(url, fetchInit);
		if ((res.status === 401 || res.status === 403) && (pageIsPublicHttps || pageIsChromeExtension)) try {
			sessionStorage.removeItem("cwsp-control-session-v1");
			delete globalThis.__CWSP_CONTROL_SESSION__;
			const g = globalThis;
			g.__CWSP_CONTROL_BRIDGE_LIVE__ = false;
			g.__CWS_NODE_CLIPBOARD_HUB__ = false;
			if (pageIsChromeExtension) import("./crx-control-session.js").then((m) => m.clearCrxControlSession()).catch(() => void 0);
			globalThis.dispatchEvent(new CustomEvent("cwsp-control-unauthorized", { detail: {
				status: res.status,
				path
			} }));
		} catch {}
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
	try {
		const pageHost = String(location.hostname || "").toLowerCase();
		if (location.protocol === "https:" && pageHost !== "127.0.0.1" && pageHost !== "localhost" && pageHost !== "::1" && !readControlSessionToken()) {
			console.warn("[Settings] Control session missing — pair before saving to device");
			return false;
		}
	} catch {}
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
			clipboardOutboundMode: String(shell.clipboardOutboundMode || "ask").trim().toLowerCase() === "ask" ? "ask" : "auto",
			clipboardInboundMode: String(shell.clipboardInboundMode || "ask").trim().toLowerCase() === "ask" ? "ask" : "auto",
			clipboardOutboundShowErase: shell.clipboardOutboundShowErase !== false,
			clipboardInboundShowUndo: shell.clipboardInboundShowUndo !== false,
			clipboardPromptDismissMs: (() => {
				const n = Number(shell.clipboardPromptDismissMs);
				return Number.isFinite(n) && n >= 1e3 ? Math.floor(n) : 1e4;
			})(),
			filesShareDestinationIds: String(shell.filesShareDestinationIds || "").trim(),
			filesAllowShareToAll: Boolean(shell.filesAllowShareToAll),
			filesOpenForShareMode: String(shell.filesOpenForShareMode || "auto").trim().toLowerCase() === "manual" ? "manual" : "auto",
			filesInboundMode: String(shell.filesInboundMode || "ask").trim().toLowerCase() === "auto" ? "auto" : "ask",
			filesCopyOnReceive: shell.filesCopyOnReceive !== false,
			filesByteTransport: (() => {
				const v = String(shell.filesByteTransport || "auto").trim().toLowerCase();
				return v === "http" || v === "ws" ? v : "auto";
			})(),
			filesLandingMode: (() => {
				const v = String(shell.filesLandingMode || "app").trim().toLowerCase();
				return v === "downloads" || v === "saf" ? v : "app";
			})(),
			filesIncomingDir: String(shell.filesIncomingDir || "").trim(),
			filesAskDirEveryTime: shell.filesAskDirEveryTime !== false,
			filesStagingRoot: (() => {
				const v = String(shell.filesStagingRoot || "app").trim().toLowerCase();
				return v === "cache" || v === "external" ? v : "app";
			})(),
			acceptInboundFilesData: shell.acceptInboundFilesData !== false
		},
		launcherEnv: {
			CWS_ASSOCIATED_ID: clientId,
			CWS_ASSOCIATED_TOKEN: token
		}
	};
	if (core.ops?.directUrl) patch.bridge.endpoints = [String(core.ops.directUrl).trim()];
	const authForPatch = readDesktopControlAuth();
	const isCapacitorControl = readControlBridgeVia() === "android" || Number(authForPatch?.port) === 8434;
	let body = patch;
	if (isCapacitorControl) {
		const coreIn = { ...settings.core || {} };
		delete coreIn.userKey;
		delete coreIn.ecosystemToken;
		if (coreIn.socket && typeof coreIn.socket === "object") {
			const sock = { ...coreIn.socket };
			delete sock.accessToken;
			delete sock.airpadAuthToken;
			delete sock.clientAccessToken;
			coreIn.socket = sock;
		}
		const shellIn = {
			...patch.shell,
			...settings.shell || {}
		};
		delete shellIn.accessToken;
		delete shellIn.clientToken;
		const bridgeIn = { ...patch.bridge };
		delete bridgeIn.userKey;
		body = {
			...patch,
			bridge: bridgeIn,
			core: coreIn,
			shell: shellIn,
			cwsp: settings.cwsp
		};
	}
	const r = await webnativeControl("/service/config", {
		method: "POST",
		body: JSON.stringify(body)
	});
	try {
		const auth = readDesktopControlAuth();
		const hubPort = Number(auth?.port) || 0;
		const hubHost = String(auth?.host || "127.0.0.1");
		if (hubPort === 29110 && (hubHost === "127.0.0.1" || hubHost === "localhost" || hubHost === "::1")) {
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
		}
	} catch {}
	webnativeSnapshotFetchedAt = 0;
	webnativeBundleCache = null;
	return Boolean(r?.ok === true || isCapacitorControl && r && (r.settings || r.portable));
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
		allowControlApi: false,
		autoStartOnBoot: true,
		enableRemoteClipboardBridge: true,
		acceptInboundClipboardData: true,
		applyRemoteClipboardToDevice: true,
		maintainHubSocketConnection: false,
		clipboardShareDestinationIds: "L-110;L-196;L-210",
		clipboardInboundMode: "ask",
		clipboardOutboundMode: "ask"
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
		return saveSettings(applyCapacitorShellMigrations(current) || current);
	}
	if (!needsBootstrap && !identityDrift) {
		capacitorCwspSeedDone = true;
		const migrated = applyCapacitorShellMigrations(current);
		if (migrated) {
			console.log("[Settings] Capacitor shell migrations (desk peers / ask modes)");
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
		return saveSettings(applyCapacitorShellMigrations(aligned) || aligned);
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
	return saveSettings(applyCapacitorShellMigrations(merged) || merged);
};
/**
* Chrome extension CWSP defaults: same local hub as Neutralino (`127.0.0.1:8434`),
* wire identity {@code L-110-crx} (distinct from desk Neutralino {@code L-110}).
*
* WHY: sharing L-110 with Neutralino steals the desk socket — inbound ask-holds
* never reach the extension. Neutralino mirrors paste-hold → L-110-crx; CRX
* holds for "Paste by CWSP" and control-take dismisses Accept.
*/
var CRX_CWSP_CLIENT_ID = "L-110-crx";
/** WHY: hub `verify()` requires a non-empty userKey; L-110-crx policy accepts associated tokens. */
var CRX_CWSP_BOOTSTRAP_TOKEN = "n3v3rm1nd";
/** Extension wire hub (chrome.storage) — not CWSP Relay / Neutralino portable. */
var CRX_LOCAL_HUB_URL = "https://127.0.0.1:8434/";
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
/** Control SPA hosts that must never win as Relay / gateway in Capacitor Settings. */
var isControlSpaRelayUrl = (url) => {
	const raw = String(url || "").trim().toLowerCase();
	if (!raw) return false;
	try {
		const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
		const host = new URL(withScheme).hostname.toLowerCase();
		return host === "cwsp.u2re.space" || host === "www.cwsp.u2re.space" || host === "md.u2re.space" || host === "www.md.u2re.space";
	} catch {
		return /cwsp\.u2re\.space|md\.u2re\.space/i.test(raw);
	}
};
/**
* Capacitor-only: overlay native Relay when IDB is empty/loopback/Control-SPA-poisoned.
* WHY: full native overlay was disabled so IDB stays SoT — but Relay must track Java Configure.
*/
var mergeCapacitorNativeRelayOverlay = (base, native) => {
	if (!native || typeof native !== "object") return base;
	const nativeEp = trimSetting(native.core?.endpointUrl);
	if (!nativeEp || isControlSpaRelayUrl(nativeEp)) return base;
	const localEp = trimSetting(base.core?.endpointUrl);
	const localBad = !localEp || isControlSpaRelayUrl(localEp) || /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(localEp);
	if (!localBad && localEp === nativeEp) return base;
	if (!localBad) return base;
	return {
		...base,
		core: {
			...base.core,
			endpointUrl: nativeEp
		}
	};
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
var splitPath = (path) => path.split(".");
var getByPath = (source, path) => splitPath(path).reduce((acc, key) => acc == null ? acc : acc[key], source);
var slugify = (value) => value.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
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
* Seed CRX wire identity + Local hub only.
*
* INVARIANT: do not write CWSP Relay (`core.endpointUrl`), clipboard modes, or
* gateway bootstrap into chrome.storage — those load from Neutralino Control at
* Extension Local hub URL (`shell.localHubUrl`, default https://127.0.0.1:8434)
* via settings:get /service/config.
*/
var crxCwspSeedDone = false;
var ensureCrxCwspSettingsSeeded = async () => {
	if (!isCrxExtensionRuntime()) return null;
	if (crxCwspSeedDone) return null;
	const current = await loadSettings({ nativeOverlay: false });
	const currentUserId = trimSetting(current.core?.userId);
	const hubPersisted = await didPersistShellMaintainHubSocket();
	const existingToken = trimSetting(current.core?.ecosystemToken) || trimSetting(current.core?.userKey) || trimSetting(current.core?.socket?.accessToken);
	const needsHttpsProtocol = current.core?.socket?.protocol !== "https";
	const needsCrxIdNormalize = /^L-110$/i.test(currentUserId);
	const savedLocalHub = trimSetting(current.shell?.localHubUrl);
	const needsLocalHub = !savedLocalHub;
	if (!(!currentUserId || needsCrxIdNormalize || !/^L-110-crx$/i.test(currentUserId) || !hubPersisted || !existingToken || needsHttpsProtocol || needsLocalHub)) {
		crxCwspSeedDone = true;
		return null;
	}
	const keepUserId = CRX_CWSP_CLIENT_ID;
	const savedEp = trimSetting(current.core?.endpointUrl);
	const savedEpIsLoopback = (() => {
		try {
			const h = new URL(/^https?:\/\//i.test(savedEp) ? savedEp : `https://${savedEp}`).hostname.toLowerCase();
			return h === "127.0.0.1" || h === "localhost" || h === "::1";
		} catch {
			return /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:|\/|$)/i.test(savedEp);
		}
	})();
	const localHubUrl = savedLocalHub || (savedEpIsLoopback && savedEp ? savedEp : "") || CRX_LOCAL_HUB_URL;
	const relayUrl = savedEpIsLoopback ? "" : savedEp;
	const seedToken = existingToken || CRX_CWSP_BOOTSTRAP_TOKEN;
	const merged = {
		...current,
		core: {
			...current.core,
			allowInsecureTls: current.core?.allowInsecureTls ?? true,
			useCoreIdentityForAirPad: current.core?.useCoreIdentityForAirPad ?? true,
			userId: keepUserId,
			...existingToken ? {} : {
				ecosystemToken: seedToken,
				userKey: seedToken
			},
			endpointUrl: relayUrl,
			ops: { ...current.core?.ops || {} },
			socket: {
				...current.core?.socket || {},
				selfId: keepUserId,
				protocol: "https",
				...existingToken ? {} : {
					accessToken: seedToken,
					allowAccessTokenWithoutUserKey: true
				},
				allowAccessTokenWithoutUserKey: current.core?.socket?.allowAccessTokenWithoutUserKey ?? true
			}
		},
		shell: {
			...current.shell,
			localHubUrl,
			maintainHubSocketConnection: hubPersisted ? Boolean(current.shell?.maintainHubSocketConnection) : true,
			clientId: (() => {
				const cid = trimSetting(current.shell?.clientId);
				if (!cid || /^L-\d{1,3}-crx$/i.test(cid)) return "L-110";
				return cid;
			})()
		}
	};
	console.log("[Settings] seeding CRX wire defaults (Relay left for Control hydrate)", {
		clientId: keepUserId,
		relay: merged.core?.endpointUrl || "(empty → Neutralino)",
		localHub: merged.shell?.localHubUrl
	});
	crxCwspSeedDone = true;
	return saveSettings(merged);
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
				if (opts?.nativeOverlay !== false && isCwsNativeIpcAvailable()) {
					const nativeSettings = await getNativeUnifiedSettings();
					if (nativeSettings && typeof nativeSettings === "object") if (isCapacitorNativeShell()) result = mergeCapacitorNativeRelayOverlay(result, nativeSettings);
					else result = mergeNativeSettingsOverlay(result, nativeSettings);
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
	if (isWebnativeSurface() && !isCapacitorNativeShell() && !isPublicCwspControlSpa()) try {
		const ok = await pushWebnativeSettingsPatch(merged);
		const via = readControlBridgeVia();
		lastSettingsSaveReport = {
			...lastSettingsSaveReport,
			webnativeSynced: ok,
			webnativeError: ok ? void 0 : via === "android" ? "phone Control unreachable (Allow Control API + Pair + Accept)" : "desk Control RPC unavailable"
		};
		if (!ok) console.warn("[Settings] Control config patch not confirmed");
	} catch (e) {
		lastSettingsSaveReport = {
			...lastSettingsSaveReport,
			webnativeSynced: false,
			webnativeError: String(e instanceof Error ? e.message : e)
		};
		console.warn("[Settings] Control config patch failed:", e);
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
export { loadSettings as a, getLastSettingsSaveReport as i, ensureCapacitorCwspSettingsSeeded as n, noteSettingsControlSync as o, ensureCrxCwspSettingsSeeded as r, saveSettings as s, Settings_exports as t };
