import { t as initializeLayers } from "./layer-manager.js";
import "./views.js";
import { p as loadAsAdopted } from "../fest/dom.js";
import { s as withTimeout } from "../fest/core.js";
import { a as invokeCwsNative, i as initCwsNativeBridge, s as isCapacitorCwsNativeShell } from "../vendor/@capacitor_core.js";
import { D as shouldFleetDeskGatewayProbeFallbacks, E as shouldConnectViaFleetGateway, G as splitConnectHostList, N as CWSP_DEFAULT_HTTPS_PORTS, O as shouldPreferWanGatewayForAirpad, P as CWSP_DEFAULT_HTTP_PORTS, T as sanitizeFleetSelfWireNodeId, _ as isOffHomeFleetNetwork, f as isFleetDeskWireNodeId, g as isHomeFleetLanHost, h as isGuestPrivateLanIpv4, m as isGatewayHttpsOrigin, p as isFleetGatewayWireNodeId, r as DEFAULT_DESK_WIRE_NODE_ID, u as isAssociableFleetWireNodeId, v as isOnHomeFleetLanPageHost, w as sanitizeFleetRouteTarget, y as normalizeWireNodeIdForWire } from "./airpad-cwsp-client-parity.js";
import { B as isPushLocalClipboardToLanEnabled, C as getAirPadTransportSecret, D as getClipboardPushIntervalMs, E as getClipboardBroadcastWireTargets, F as isClipboardHubBootstrapEnabled, I as isClipboardSenderAllowedForInbound, L as isMaintainHubSocketConnectionEnabled, M as getRemoteProtocol, N as getRemoteRouteTarget, P as isApplyRemoteClipboardToDeviceEnabled, R as isNeutralinoNodeClipboardHubOwned, S as getAirPadTransportMode, T as getClientAccessToken, V as isShellRemoteClipboardBridgeEnabled, _ as getAirPadEndpointUrl, b as getAirPadPeerInstanceId, d as applyAirpadRuntimeFromAppSettings, g as getAirPadDirectTargetUrl, j as getRemoteHost, m as getAirPadClientId, p as getAccessToken, v as getAirPadHandshakeArchetype, w as getAssociatedClientToken, y as getAirPadHandshakeConnectionType, z as isPreferNativeWebsocketEnabled } from "./config.js";
import { t as LS_BOOT_SHELL_LAST_ACTIVE } from "../shells/preference.js";
import { i as serviceChannels } from "./channel-mixin.js";
import { a as initializeRegistries, i as defaultTheme, l as startImplicitViewMessagingBridge, o as lightTheme, r as darkTheme, t as ShellRegistry } from "./registry.js";
import { A as loadSettings, E as log, T as getWsStatusEl, a as packetWireDedupeGuard, i as inferWireDedupeCategory, j as shouldDeferCrxHubSocketBootstrap, k as ensureCapacitorCwspSettingsSeeded, l as shouldAnnotateCoordinatorPayload, n as setAirpadCredentialInvalidator, o as annotateCoordinatorPayload, r as annotatePacketWireHash, u as annotatePacketWireTime64 } from "./credential-cache-bridge.js";
import { n as applyTheme, r as DEFAULT_SETTINGS, t as loadStyleSystem } from "./styles.js";
import { a as writeClipboardTextToDevice, i as writeClipboardImageToDevice, n as isCapacitorNativeShell, r as readClipboardTextFromDevice } from "./clipboard-device.js";
import { t as ensureCapacitorBridgeDaemonStarted } from "./capacitor-settings-permissions.js";
//#region src/frontend/boot/native-socket.ts
var appendParams = (target, params) => {
	if (!params || typeof params !== "object") return;
	for (const [key, value] of Object.entries(params)) {
		if (!key || value === void 0 || value === null || value === "") continue;
		target.searchParams.set(key, String(value));
	}
};
/**
* Normalize user-entered endpoint origins and old `/socket.io` URLs to the native
* CWSP websocket endpoint while preserving route/auth query metadata.
*/
function normalizeWsEndpointUrl(rawUrl, query, auth) {
	const urlObj = new URL(rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`);
	if (urlObj.protocol === "http:") urlObj.protocol = "ws:";
	else if (urlObj.protocol === "https:") urlObj.protocol = "wss:";
	else if (urlObj.protocol !== "ws:" && urlObj.protocol !== "wss:") urlObj.protocol = "wss:";
	if (!urlObj.pathname || urlObj.pathname === "/" || /^\/socket\.io\/?$/i.test(urlObj.pathname)) urlObj.pathname = "/ws";
	for (const staleKey of [
		"EIO",
		"transport",
		"sid"
	]) urlObj.searchParams.delete(staleKey);
	appendParams(urlObj, query);
	appendParams(urlObj, auth);
	return urlObj.toString();
}
var NativeSocket = class {
	url;
	options;
	connected = false;
	connecting = false;
	id = "";
	ws = null;
	listeners = /* @__PURE__ */ new Map();
	connectTimeout;
	constructor(url, options = {}) {
		this.url = url;
		this.options = options;
		this.connect();
	}
	connect() {
		try {
			const endpointUrl = normalizeWsEndpointUrl(this.url, this.options.query, this.options.auth);
			this.connecting = true;
			this.ws = new WebSocket(endpointUrl);
			this.ws.onopen = () => {
				this.connected = true;
				this.connecting = false;
				if (this.connectTimeout) clearTimeout(this.connectTimeout);
				this.emitLocal("connect");
			};
			this.ws.onclose = (event) => {
				this.connected = false;
				this.connecting = false;
				if (this.connectTimeout) clearTimeout(this.connectTimeout);
				this.emitLocal("disconnect", event.reason || "closed");
				this.emitLocal("close", event.code, event.reason);
			};
			this.ws.onerror = (error) => {
				this.connecting = false;
				this.emitLocal("connect_error", /* @__PURE__ */ new Error("WebSocket error"));
				this.emitLocal("error", error);
			};
			this.ws.onmessage = (event) => {
				if (event.data instanceof ArrayBuffer) {
					this.emitLocal("binary", event.data);
					return;
				}
				if (typeof Blob !== "undefined" && event.data instanceof Blob) {
					event.data.arrayBuffer().then((buf) => this.emitLocal("binary", buf));
					return;
				}
				try {
					const data = JSON.parse(String(event.data));
					if (data.event && data.payload) this.emitLocal(data.event, data.payload);
					else this.emitLocal("data", data);
				} catch {
					this.emitLocal("data", event.data);
				}
			};
			if (this.options.timeout) this.connectTimeout = setTimeout(() => {
				if (!this.connected) {
					this.connecting = false;
					this.ws?.close();
					this.emitLocal("connect_error", /* @__PURE__ */ new Error("timeout"));
				}
			}, this.options.timeout);
		} catch (err) {
			this.connecting = false;
			setTimeout(() => this.emitLocal("connect_error", err), 0);
		}
	}
	on(event, listener) {
		if (!this.listeners.has(event)) this.listeners.set(event, /* @__PURE__ */ new Set());
		this.listeners.get(event).add(listener);
	}
	off(event, listener) {
		this.listeners.get(event)?.delete(listener);
	}
	send(packet) {
		if (this.connected && this.ws) this.ws.send(typeof packet === "string" ? packet : JSON.stringify(packet));
	}
	/** Send legacy 8-byte AirPad binary frame (endpoint + Java {@code CwspBinaryAirpad} parity). */
	sendBinary(data) {
		if (!this.connected || !this.ws) return;
		this.ws.send(data);
	}
	/** @deprecated Prefer send(packet); kept so old callers still compile. */
	emit(_event, ...args) {
		this.send(args[0]);
	}
	emitLocal(event, ...args) {
		const handlers = this.listeners.get(event);
		if (handlers) for (const handler of handlers) handler(...args);
	}
	removeAllListeners() {
		this.listeners.clear();
	}
	close() {
		if (this.connectTimeout) clearTimeout(this.connectTimeout);
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.connected = false;
		this.connecting = false;
	}
	disconnect() {
		this.close();
	}
};
function createWsSocket(url, options) {
	return new NativeSocket(url, options);
}
//#endregion
//#region src/frontend/boot/native-coordinator-bridge.ts
/**
* Capacitor/CWSAndroid: route coordinator acts through Java {@code CwspWsClient} when it owns `/ws`.
* WHY: WebView hub connect is skipped to avoid duplicate clientId sessions; AirPad must use CwsBridge.
*
* CWSAndroid {@code CwsBridgePlugin} channels:
* - coordinator:act / coordinator:ask — JSON envelope → Java /ws fan-out
* - coordinator:binary — base64 legacy 8-byte frame (bytes 6–7 = perfTsLo)
* - coordinator:status — { connected, wsOpen, daemon }
* - runtime:reload-settings — soft-reconnect Java /ws
*/
var nativeConnectedCache = false;
var nativeStatusCheckedAt = 0;
var NATIVE_STATUS_TTL_MS = 1200;
var shouldUseNativeCoordinatorTransport = () => nativeShellOwnsExclusiveHubWebsocket() && isCapacitorCwsNativeShell() && isPreferNativeWebsocketEnabled();
var NATIVE_BRIDGE_TIMEOUT_MS = 6e3;
var refreshNativeCoordinatorStatus = async () => {
	if (!shouldUseNativeCoordinatorTransport()) {
		nativeConnectedCache = false;
		return false;
	}
	try {
		const result = await withTimeout(invokeCwsNative("coordinator:status", {}), NATIVE_BRIDGE_TIMEOUT_MS, "coordinator:status timed out");
		const connected = Boolean(result.echo?.connected ?? result.ok);
		nativeConnectedCache = connected;
		nativeStatusCheckedAt = Date.now();
		return connected;
	} catch {
		nativeConnectedCache = false;
		nativeStatusCheckedAt = Date.now();
		return false;
	}
};
var isNativeCoordinatorConnected = () => {
	if (!shouldUseNativeCoordinatorTransport()) return false;
	if (Date.now() - nativeStatusCheckedAt > NATIVE_STATUS_TTL_MS) refreshNativeCoordinatorStatus();
	return nativeConnectedCache;
};
var nativeWirePayload = (what, payload) => {
	if (!shouldAnnotateCoordinatorPayload(what)) return payload ?? {};
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return payload ?? {};
	return annotateCoordinatorPayload(payload);
};
var sendNativeCoordinatorEnvelope = async (input) => {
	if (!shouldUseNativeCoordinatorTransport()) return false;
	const channel = input.op === "ask" ? "coordinator:ask" : "coordinator:act";
	try {
		const result = await invokeCwsNative(channel, {
			what: input.what,
			payload: nativeWirePayload(input.what, input.payload),
			nodes: input.nodes ?? [],
			uuid: input.uuid ?? "",
			op: input.op
		});
		const sent = Boolean(result.echo?.sent ?? result.ok);
		if (sent) {
			nativeConnectedCache = true;
			nativeStatusCheckedAt = Date.now();
		}
		return sent;
	} catch {
		nativeConnectedCache = false;
		nativeStatusCheckedAt = Date.now();
		return false;
	}
};
//#endregion
//#region src/frontend/boot/websocket.ts
/**
* AirPad/remote transport hub for the frontend.
*
* This module owns the client-side WebSocket connection, secure-envelope
* wrapping, coordinator ask/act flows, clipboard bridging, and the candidate
* probing logic used to discover a reachable CWSP endpoint from web, PWA, or
* extension contexts.
*
* AI-READ: this file is a compatibility layer, not only a raw websocket
* wrapper. It preserves behavior for several runtimes whose network
* restrictions differ, especially Chromium extension pages versus normal tabs.
*/
var socket = null;
var wsConnected = false;
var isConnecting = false;
/**
* Mirror live socket for page debuggers.
* WHY: never touch bare `window` — in MV3 service workers that identifier throws
* `ReferenceError: window is not defined` (even inside `typeof` guards after some bundlers).
*/
var mirrorSocketOnGlobal = (value) => {
	try {
		const g = globalThis;
		g.__socket = value;
		const w = g.window;
		if (w) w.__socket = value;
	} catch {}
};
var btnEl = null;
var wsConnectButton = null;
var connectAttemptId = 0;
/** Parallel candidate probes — close all on success or disconnect. */
var activeProbeSockets = /* @__PURE__ */ new Set();
var manualDisconnectRequested = false;
var autoReconnectAttempts = 0;
var autoReconnectTimer = null;
var lastWsCandidates = [];
var nextWsCandidateOffset = 0;
var localNetworkPermissionProbeDone = /* @__PURE__ */ new Set();
var AUTO_RECONNECT_BASE_DELAY_MS = 800;
/** WebSocket handshake timeout per candidate (dead hosts fail faster). */
var AIRPAD_PROBE_IO_TIMEOUT_MS = 4800;
/** Wall-clock cap per probe if connect_error is slow to fire. */
var AIRPAD_PROBE_HARD_CAP_MS = 5600;
/** Try this many candidates in parallel; first success wins. */
var AIRPAD_CANDIDATE_PARALLEL = 3;
var AIRPAD_VERBOSE_QUERY_KEY = "CWS_AIRPAD_VERBOSE_QUERY";
var clearAutoReconnectTimer = () => {
	if (!autoReconnectTimer) return;
	globalThis.clearTimeout(autoReconnectTimer);
	autoReconnectTimer = null;
};
var clearProbeTimer = (socketWithTimer) => {
	const probe = socketWithTimer;
	if (probe.__cwspProbeTimer) {
		globalThis.clearTimeout(probe.__cwspProbeTimer);
		delete probe.__cwspProbeTimer;
	}
};
/** CWSP v2 transport / route hint query keys (canonical `cwsp_*`; see network stack spec). */
var CWSP_ROUTE_QUERY = {
	via: "cwsp_via",
	localEndpoint: "cwsp_local_endpoint",
	route: "cwsp_route",
	routeTarget: "cwsp_route_target",
	hop: "cwsp_hop",
	host: "cwsp_host",
	target: "cwsp_target",
	targetPort: "cwsp_target_port",
	viaPort: "cwsp_via_port",
	protocol: "cwsp_protocol"
};
var shouldUseVerboseAirpadQuery = () => {
	try {
		const local = String(globalThis?.localStorage?.getItem?.(AIRPAD_VERBOSE_QUERY_KEY) || "").trim().toLowerCase();
		if ([
			"1",
			"true",
			"yes",
			"on"
		].includes(local)) return true;
	} catch {}
	const runtimeFlag = String(globalThis?.[AIRPAD_VERBOSE_QUERY_KEY] || "").trim().toLowerCase();
	return [
		"1",
		"true",
		"yes",
		"on"
	].includes(runtimeFlag);
};
var wsConnectionHandlers = /* @__PURE__ */ new Set();
var clipboardHandlers = /* @__PURE__ */ new Set();
var voiceResultHandlers = /* @__PURE__ */ new Set();
var FRAME_PROTOCOL_WS = "ws";
var WS_TRANSPORT = "ws";
var normalizeCoordinatorProtocol = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return FRAME_PROTOCOL_WS;
	if (raw === "ws" || raw === "wss" || raw === "socket" || raw === "socket.io" || raw === "socketio") return FRAME_PROTOCOL_WS;
	return raw;
};
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var aesKeyCache = /* @__PURE__ */ new Map();
var hmacKeyCache = /* @__PURE__ */ new Map();
setAirpadCredentialInvalidator(() => {
	aesKeyCache.clear();
	hmacKeyCache.clear();
});
var coordinatorPending = /* @__PURE__ */ new Map();
var queuedCoordinatorActs = [];
var MAX_QUEUED_COORDINATOR_ACTS = 128;
var flushQueuedCoordinatorActs = () => {
	if (!socket?.connected) return;
	while (queuedCoordinatorActs.length > 0) {
		const packet = queuedCoordinatorActs.shift();
		if (!packet) continue;
		emitCoordinatorPacket(packet);
	}
};
var isRealtimeInputAct = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	return normalized === "mouse:move" || normalized === "mouse:scroll";
};
/** Return the current live WebSocket instance, if any. */
function getWS() {
	return socket;
}
/** Report whether the primary transport socket is currently connected. */
function isWSConnected() {
	if (shouldUseNativeCoordinatorTransport()) return isNativeCoordinatorConnected();
	return wsConnected;
}
function notifyClipboardHandlers(text, meta) {
	for (const h of clipboardHandlers) try {
		h(text, meta);
	} catch {}
}
/** Suppress echo when applying remote text to the device clipboard vs. push polling. */
var CLIPBOARD_ECHO_SUPPRESS_MS = 3500;
var lastClipboardPushSent = "";
var lastClipboardPushSentAt = 0;
var lastClipboardWrittenFromRemote = "";
var clipboardEchoSuppressUntil = 0;
var lastInboundClipboardNormalized = "";
var lastInboundClipboardAt = 0;
var clipboardPushIntervalId = null;
var stopClipboardPushLoop = () => {
	if (clipboardPushIntervalId) {
		globalThis.clearInterval(clipboardPushIntervalId);
		clipboardPushIntervalId = null;
	}
};
var startClipboardPushLoop = () => {
	stopClipboardPushLoop();
	if (!isPushLocalClipboardToLanEnabled() || !isShellRemoteClipboardBridgeEnabled()) return;
	const ms = getClipboardPushIntervalMs();
	clipboardPushIntervalId = globalThis.setInterval(() => {
		tickLocalClipboardPush();
	}, ms);
};
async function tickLocalClipboardPush() {
	if (!socket?.connected) return;
	if (!isShellRemoteClipboardBridgeEnabled() || !isPushLocalClipboardToLanEnabled()) return;
	const entries = getClipboardBroadcastWireTargets();
	if (!entries.length) return;
	try {
		const text = await readClipboardTextFromDevice();
		const t = String(text ?? "").trim();
		if (!t) return;
		const now = Date.now();
		if (now < clipboardEchoSuppressUntil && t === lastClipboardWrittenFromRemote) return;
		if (t === lastClipboardPushSent && now - lastClipboardPushSentAt < CLIPBOARD_ECHO_SUPPRESS_MS) return;
		lastClipboardPushSent = t;
		lastClipboardPushSentAt = now;
		const groups = groupWireTargetsByAccessToken(entries, getWireAccessToken());
		for (const g of groups) sendCoordinatorAct("clipboard:update", { text: t }, g.nodeIds, { accessToken: g.accessToken });
	} catch {}
}
async function applyIncomingClipboardText(text, meta) {
	if (!isShellRemoteClipboardBridgeEnabled()) return;
	const t = typeof text === "string" ? text : "";
	const normalized = t.trim();
	if (normalized.toLowerCase().startsWith("data:image/")) {
		await applyIncomingClipboardImage({
			mimeType: "image/png",
			data: normalized
		}, meta);
		return;
	}
	const now = Date.now();
	if (normalized && normalized === lastInboundClipboardNormalized && now - lastInboundClipboardAt < CLIPBOARD_ECHO_SUPPRESS_MS) return;
	lastInboundClipboardNormalized = normalized;
	lastInboundClipboardAt = now;
	notifyClipboardHandlers(t, meta);
	if (!isApplyRemoteClipboardToDeviceEnabled() || !normalized) return;
	if (normalized === lastClipboardWrittenFromRemote && now < clipboardEchoSuppressUntil) return;
	try {
		await writeClipboardTextToDevice(normalized);
		lastClipboardWrittenFromRemote = normalized;
		lastClipboardPushSent = normalized;
		lastClipboardPushSentAt = now;
		clipboardEchoSuppressUntil = now + CLIPBOARD_ECHO_SUPPRESS_MS;
	} catch (error) {
		console.warn("[cwsp:clipboard] device write failed", {
			length: t.length,
			source: meta?.source,
			error: describeError(error)
		});
	}
}
async function applyIncomingClipboardImage(asset, meta) {
	if (!isShellRemoteClipboardBridgeEnabled()) return;
	const data = String(asset.data ?? "").trim();
	if (!data) return;
	const mimeType = String(asset.mimeType || "image/png").trim() || "image/png";
	const dedupeKey = asset.hash?.trim() || data.slice(0, 96);
	const now = Date.now();
	if (dedupeKey && dedupeKey === lastInboundClipboardNormalized && now - lastInboundClipboardAt < CLIPBOARD_ECHO_SUPPRESS_MS) return;
	lastInboundClipboardNormalized = dedupeKey;
	lastInboundClipboardAt = now;
	notifyClipboardHandlers("", meta);
	if (!isApplyRemoteClipboardToDeviceEnabled()) return;
	if (dedupeKey === lastClipboardWrittenFromRemote && now < clipboardEchoSuppressUntil) return;
	try {
		await writeClipboardImageToDevice(data, mimeType, asset.hash);
		lastClipboardWrittenFromRemote = dedupeKey;
		lastClipboardPushSent = dedupeKey;
		lastClipboardPushSentAt = now;
		clipboardEchoSuppressUntil = now + CLIPBOARD_ECHO_SUPPRESS_MS;
	} catch (error) {
		console.warn("[cwsp:clipboard] device image write failed", {
			mimeType,
			hash: asset.hash,
			source: meta?.source,
			error: describeError(error)
		});
	}
}
function safeJson(value) {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}
var extractClipboardText = (value) => {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const record = value;
	for (const key of [
		"text",
		"content",
		"body"
	]) {
		const direct = record[key];
		if (typeof direct === "string") return direct;
	}
	if (typeof record.result === "string") return record.result;
	const nested = record.payload ?? record.data;
	if (nested && nested !== value) {
		const inner = extractClipboardText(nested);
		if (inner) return inner;
	}
	return "";
};
var isInboundClipboardWhat = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	return normalized === "clipboard:update" || normalized === "clipboard:write" || normalized.startsWith("airpad:clipboard:");
};
var extractClipboardTextFromPacket = (packet) => {
	const fromPayload = extractClipboardText(packet.payload ?? packet.data ?? packet.result ?? packet.results);
	if (fromPayload) return fromPayload;
	return extractClipboardText(packet);
};
var extractClipboardAssetFromPacket = (packet) => {
	const carriers = [
		packet.payload,
		packet.data,
		packet.result,
		packet.results,
		packet
	];
	for (const carrier of carriers) {
		if (!carrier || typeof carrier !== "object") continue;
		const rec = carrier;
		const asset = rec.asset ?? rec.dataAsset ?? rec.file ?? rec.image;
		if (!asset || typeof asset !== "object") continue;
		const row = asset;
		const data = typeof row.data === "string" ? row.data.trim() : "";
		if (!data) continue;
		const mimeType = typeof row.mimeType === "string" && row.mimeType.trim() || typeof row.type === "string" && row.type.trim() || "image/png";
		if (!mimeType.toLowerCase().startsWith("image/")) continue;
		return {
			hash: typeof row.hash === "string" ? row.hash.trim() : "",
			mimeType,
			data
		};
	}
	return null;
};
var getCoordinatorPacketSenderId = (packet) => {
	const p = packet;
	if (!p || typeof p !== "object") return "";
	return String(p.from || p.byId || p.sender || "").trim();
};
var inferPacketPurpose = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	if (normalized.startsWith("clipboard:")) return "clipboard";
	if (normalized.startsWith("mouse:")) return "mouse";
	if (normalized.startsWith("keyboard:")) return "input";
	if (normalized.startsWith("airpad:")) return "airpad";
	if (normalized.startsWith("sms:")) return "sms";
	if (normalized.startsWith("contacts:")) return "contact";
	if (normalized.startsWith("notification:") || normalized.startsWith("notifications:")) return "general";
	return "general";
};
var describeError = (error) => {
	if (!error) return String(error);
	if (typeof error === "string") return error;
	if (error instanceof Error) return `${error.name}: ${error.message}`;
	return safeJson(error);
};
function getTransportMode() {
	return getAirPadTransportMode() === "secure" ? "secure" : "plaintext";
}
var fromBase64 = (value) => {
	try {
		const binary = atob(value);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
		return bytes;
	} catch {
		return null;
	}
};
var isSignedEnvelope = (value) => typeof value === "object" && value !== null && typeof value.cipher === "string" && typeof value.sig === "string";
var toSafeObject = (value) => {
	if (!value || typeof value !== "string") return null;
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};
var shouldAutoReconnectAfterDisconnect = (reason) => {
	if (!reason) return true;
	if (reason === "io client disconnect" || reason === "forced close") return false;
	return true;
};
var shouldRotateCandidateOnDisconnect = (reason) => {
	if (!reason) return true;
	if (reason === "io server disconnect" || reason === "io client disconnect") return false;
	return true;
};
var getSecret = () => (getAirPadTransportSecret() || "").trim();
var getClientId = () => {
	return sanitizeFleetSelfWireNodeId((getAirPadClientId() || "").trim()) || "airpad-client";
};
var getClientToken = () => (getAssociatedClientToken() || "").trim();
var getWireAccessToken = () => (getAccessToken() || "").trim();
var getCoordinatorNodes = () => {
	return wireTargetNodeIds(parseWireTargetList(getRemoteRouteTarget().trim()));
};
var nextPacketId = () => {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	return `airpad-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
var isCoordinatorPacket = (value) => {
	return !!value && typeof value === "object" && ("op" in value || "what" in value || "uuid" in value || "result" in value || "error" in value);
};
var mapFrameOpToRuntimeOp = (value) => {
	if (value === "request") return "ask";
	if (value === "response") return "result";
	if (value === "signal" || value === "notify" || value === "redirect") return "act";
	return value;
};
var mapRuntimeOpToFrameOp = (value) => {
	return value;
};
var toCanonicalCoordinatorPacket = (packet) => {
	const clientId = getClientId();
	const clientToken = getClientToken();
	const wireAccessToken = (typeof packet.accessToken === "string" && packet.accessToken.trim() ? packet.accessToken.trim() : typeof packet.airpadToken === "string" && packet.airpadToken.trim() ? packet.airpadToken.trim() : "") || getWireAccessToken();
	const sender = String(packet.sender || packet.byId || packet.from || clientId || "").trim() || void 0;
	const from = String(packet.from || sender || "").trim() || void 0;
	const byId = String(packet.byId || sender || "").trim() || void 0;
	const destinations = Array.isArray(packet.destinations) && packet.destinations.length ? packet.destinations : Array.isArray(packet.nodes) ? packet.nodes : getCoordinatorNodes();
	const uuid = typeof packet.uuid === "string" && packet.uuid.trim() ? packet.uuid.trim() : nextPacketId();
	const now = Date.now();
	return {
		...packet,
		op: mapRuntimeOpToFrameOp(packet.op),
		type: String(packet.type || packet.what || "").trim() || packet.what,
		protocol: normalizeCoordinatorProtocol(packet.protocol),
		transport: String(packet.transport || WS_TRANSPORT).trim() || WS_TRANSPORT,
		purpose: String(packet.purpose || inferPacketPurpose(String(packet.what || packet.type || ""))).trim() || "general",
		sender,
		byId,
		from,
		nodes: destinations,
		destinations,
		ids: typeof packet.ids === "object" && packet.ids != null ? packet.ids : {
			byId,
			from,
			sender,
			destinations
		},
		urls: Array.isArray(packet.urls) && packet.urls.length ? packet.urls : [getRemoteHost()],
		tokens: Array.isArray(packet.tokens) && packet.tokens.length ? packet.tokens : clientToken ? [clientToken] : [],
		token: packet.token || clientToken || void 0,
		userKey: typeof packet.userKey === "string" && packet.userKey.trim() ? packet.userKey : clientToken || void 0,
		accessToken: wireAccessToken || void 0,
		flags: {
			...packet.flags,
			canonicalV2: true
		},
		uuid,
		timestamp: Number(packet.timestamp || 0) > 0 ? Number(packet.timestamp) : now
	};
};
var handleCoordinatorPacket = async (packet) => {
	const op = mapFrameOpToRuntimeOp(packet.op);
	const what = (packet.what || packet.type || "").trim();
	const uuid = typeof packet.uuid === "string" ? packet.uuid : "";
	if (uuid && coordinatorPending.has(uuid)) {
		const pending = coordinatorPending.get(uuid);
		if (pending) {
			clearTimeout(pending.timeoutId);
			coordinatorPending.delete(uuid);
			if (op === "error" || packet.error !== void 0) pending.reject(packet.error ?? {
				ok: false,
				error: "Unknown coordinator error"
			});
			else pending.resolve(packet.result ?? packet.results);
		}
		return;
	}
	if (op === "ask" && what === "clipboard:get") {
		try {
			const text = await readClipboardTextFromDevice();
			emitCoordinatorPacket({
				...buildCoordinatorPacket("result", what, null, {
					uuid,
					nodes: packet.from ? [packet.from] : void 0
				}),
				result: typeof text === "string" ? text : String(text || "")
			});
		} catch (error) {
			emitCoordinatorPacket({
				...buildCoordinatorPacket("error", what, null, {
					uuid,
					nodes: packet.from ? [packet.from] : void 0
				}),
				error: error?.message || String(error)
			});
		}
		return;
	}
	if (op === "act" && what) {
		const category = isInboundClipboardWhat(what) ? "clipboard" : inferWireDedupeCategory(what);
		if (packetWireDedupeGuard.shouldSuppress(packet, category)) return;
	}
	if (isInboundClipboardWhat(what)) {
		if (!isClipboardSenderAllowedForInbound(getCoordinatorPacketSenderId(packet))) return;
		const clipboardPayload = packet.payload ?? packet.data ?? packet.result ?? packet.results;
		const asset = extractClipboardAssetFromPacket(packet);
		if (asset) {
			applyIncomingClipboardImage(asset, { source: typeof clipboardPayload === "object" && clipboardPayload ? String(clipboardPayload.source || "") : void 0 });
			return;
		}
		applyIncomingClipboardText(extractClipboardTextFromPacket(packet), { source: typeof clipboardPayload === "object" && clipboardPayload ? String(clipboardPayload.source || "") : void 0 });
	}
};
/** Emit one already-built coordinator packet if the live socket is ready. */
var emitCoordinatorPacket = (packet) => {
	if (shouldUseNativeCoordinatorTransport()) {
		const what = String(packet.what || packet.type || "");
		const payload = packet.payload ?? packet.data ?? {};
		const nodes = Array.isArray(packet.nodes) ? packet.nodes.map(String) : void 0;
		sendNativeCoordinatorEnvelope({
			op: packet.op === "ask" || packet.op === "request" ? "ask" : "act",
			what,
			payload,
			nodes,
			uuid: typeof packet.uuid === "string" ? packet.uuid : void 0
		});
		return isNativeCoordinatorConnected();
	}
	if (!socket || !socket.connected) return false;
	socket.send(toCanonicalCoordinatorPacket(packet));
	return true;
};
/** Normalize the frontend's higher-level action/request inputs into the shared coordinator packet shape. */
var buildCoordinatorPacket = (op, what, payload, options = {}) => {
	const clientId = getClientId();
	const clientToken = getClientToken();
	const accessTok = options.accessToken !== void 0 ? String(options.accessToken).trim() || getWireAccessToken() : getWireAccessToken();
	return annotatePacketWireHash(annotatePacketWireTime64({
		op: mapRuntimeOpToFrameOp(op),
		what,
		type: what,
		purpose: inferPacketPurpose(what),
		protocol: FRAME_PROTOCOL_WS,
		transport: WS_TRANSPORT,
		payload,
		nodes: options.nodes ?? getCoordinatorNodes(),
		destinations: options.nodes ?? getCoordinatorNodes(),
		uuid: options.uuid,
		sender: clientId,
		byId: clientId,
		from: clientId,
		ids: {
			byId: clientId,
			from: clientId,
			sender: clientId,
			destinations: options.nodes ?? getCoordinatorNodes()
		},
		urls: [getRemoteHost()],
		tokens: clientToken ? [clientToken] : [],
		flags: { canonicalV2: true },
		token: clientToken || void 0,
		userKey: clientToken || void 0,
		accessToken: accessTok || void 0,
		timestamp: Date.now()
	}));
};
var getAesKey = async (secret) => {
	if (!secret || !globalThis.crypto?.subtle) return null;
	if (aesKeyCache.has(secret)) return aesKeyCache.get(secret) || null;
	const material = textEncoder.encode(secret);
	const digest = await globalThis.crypto.subtle.digest("SHA-256", material);
	const key = await globalThis.crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
	aesKeyCache.set(secret, key);
	return key;
};
var unwrapSignedPayload = async (envelope) => {
	if (!isSignedEnvelope(envelope)) return envelope;
	const secret = getSecret();
	const cipherBytes = fromBase64(envelope.cipher);
	if (!cipherBytes) return envelope;
	if (!secret || !globalThis.crypto?.subtle) return toSafeObject(textDecoder.decode(cipherBytes)) ?? envelope;
	const key = await getAesKey(secret);
	if (!key) return envelope;
	if (cipherBytes.length < 28) return toSafeObject(textDecoder.decode(cipherBytes)) ?? envelope;
	const iv = cipherBytes.slice(0, 12);
	const encrypted = cipherBytes.slice(12);
	try {
		const decrypted = new Uint8Array(await globalThis.crypto.subtle.decrypt({
			name: "AES-GCM",
			iv
		}, key, encrypted));
		return toSafeObject(textDecoder.decode(decrypted)) ?? envelope;
	} catch {
		return envelope;
	}
};
var unwrapIncomingPayload = async (payload) => {
	if (!isSignedEnvelope(payload)) return payload;
	if (getTransportMode() !== "secure") return payload;
	return unwrapSignedPayload(payload);
};
/** Strip `L-` node id prefix (e.g. `L-192.168.0.110` → `192.168.0.110`) for IP / LNA checks. */
function stripWireEndpointIdPrefix(host) {
	const t = host.trim();
	return /^l-/i.test(t) ? t.slice(2).trim() : t;
}
/** Loopback labels that are invalid as CWSP route hints when dialing a LAN page origin. */
function isLoopbackHost(host) {
	const b = stripWireEndpointIdPrefix(host.trim()).toLowerCase();
	return b === "localhost" || b === "127.0.0.1" || b === "::1";
}
function isPrivateOrLocalTarget(host) {
	if (!host) return false;
	const bare = stripWireEndpointIdPrefix(host);
	if (bare === "localhost" || host === "localhost") return true;
	if (host.endsWith(".local")) return true;
	if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(bare)) return false;
	return bare.startsWith("10.") || bare.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(bare) || bare.startsWith("127.") || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(bare);
}
var getCurrentOriginHostname = () => {
	try {
		return String(new URL(location.href).hostname).toLowerCase();
	} catch {
		return "";
	}
};
var isNetworkFetchAllowed = (rawUrl) => {
	if (!rawUrl || typeof rawUrl !== "string") return false;
	let parsed;
	try {
		parsed = new URL(rawUrl, location.href);
	} catch {
		return false;
	}
	const host = parsed.hostname.toLowerCase();
	const protocol = parsed.protocol.toLowerCase();
	if (protocol !== "http:" && protocol !== "https:") return false;
	const localPageHost = getCurrentOriginHostname();
	return isPrivateOrLocalTarget(host) || host === "localhost" || host === localPageHost;
};
var normalizeNetworkFetchHeaders = (headers) => {
	const next = {};
	if (!headers) return next;
	for (const [key, value] of Object.entries(headers)) {
		if (typeof key !== "string" || !key.trim()) continue;
		if (typeof value !== "string") continue;
		next[key] = value;
	}
	return next;
};
var responseHeadersToObject = (value) => {
	const result = {};
	value.forEach((headerValue, headerName) => {
		result[headerName] = headerValue;
	});
	return result;
};
var handleServerNetworkFetchRequest = async (request) => {
	const requestId = typeof request?.requestId === "string" ? request.requestId.trim() : "";
	const method = typeof request?.method === "string" ? request.method.toUpperCase() : "GET";
	const url = typeof request?.url === "string" ? request.url : "";
	const timeoutMsRaw = request && typeof request.timeoutMs === "number" ? request.timeoutMs : 12e3;
	const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? Math.min(Math.max(Math.round(timeoutMsRaw), 1e3), 6e4) : 12e3;
	if (!requestId) return {
		ok: false,
		status: 400,
		statusText: "Bad Request",
		error: "Missing requestId"
	};
	if (!isNetworkFetchAllowed(url)) return {
		requestId,
		ok: false,
		status: 400,
		statusText: "Bad Request",
		error: "URL not allowed"
	};
	const controller = new AbortController();
	const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
	try {
		const headers = normalizeNetworkFetchHeaders(request?.headers);
		const hasBody = !["GET", "HEAD"].includes(method);
		const payload = request?.body;
		const body = hasBody ? typeof payload === "string" ? payload : safeJson(payload) : void 0;
		const response = await fetch(url, {
			method,
			headers,
			body,
			signal: controller.signal
		});
		const responseBody = await response.text();
		return {
			requestId,
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			headers: responseHeadersToObject(response.headers),
			body: responseBody
		};
	} catch (error) {
		return {
			requestId,
			ok: false,
			status: 0,
			statusText: "Network Error",
			error: describeError(error)
		};
	} finally {
		clearTimeout(timer);
	}
};
/**
* Best-effort Chrome Local Network Access warm-up for private-IP targets.
*
* WHY: probing `/lna-probe` early makes permission/PNA failures visible before
* the heavier WebSocket candidate rotation starts reporting generic timeouts.
*/
async function tryRequestLocalNetworkPermission(origin, host) {
	if (!origin || !host) return;
	if (!isPrivateOrLocalTarget(host)) return;
	if (location.protocol !== "https:") return;
	if (localNetworkPermissionProbeDone.has(origin)) return;
	localNetworkPermissionProbeDone.add(origin);
	try {
		await fetch(`${origin}/lna-probe`, {
			method: "GET",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			targetAddressSpace: "local"
		});
	} catch (error) {
		log(`LNA probe: ${String(error?.message || error || "") || "request failed"}`);
	}
}
var coordinatorWirePayload = (what, payload) => {
	if (!shouldAnnotateCoordinatorPayload(what)) return payload;
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return payload;
	return annotateCoordinatorPayload(payload);
};
/** Fire-and-forget coordinator action. */
function sendCoordinatorAct(what, payload, nodes, opts) {
	const packet = buildCoordinatorPacket("act", what, coordinatorWirePayload(what, payload), {
		nodes,
		accessToken: opts?.accessToken
	});
	if (emitCoordinatorPacket(packet)) return true;
	if (isRealtimeInputAct(what)) {
		connectWS();
		return false;
	}
	if (queuedCoordinatorActs.length >= MAX_QUEUED_COORDINATOR_ACTS) queuedCoordinatorActs.shift();
	queuedCoordinatorActs.push(packet);
	connectWS();
	return true;
}
function updateButtonLabel() {
	if (!btnEl) return;
	if (isConnecting || socket && socket.connected === false) {
		btnEl.textContent = "WS…";
		return;
	}
	if (wsConnected || socket && socket.connected) btnEl.textContent = "WS ✓";
	else btnEl.textContent = "WS ↔";
}
function logWsState(event, payload) {
	const trimmedPayload = payload.trim();
	log(`[ws-state] event=${event}${trimmedPayload ? ` ${trimmedPayload}` : ""}`);
}
var WS_STATUS_TLS_HINT_CLASS = "ws-status-tls-hint";
function setWsStatusTlsHint(originUrl) {
	const wsStatusEl = getWsStatusEl();
	if (!wsStatusEl) return;
	wsStatusEl.textContent = isCapacitorNativeShell() ? `TLS failed — install your CA in Android Settings → Security → Encryption & credentials (or use Remote host = name on the cert). Try HTTP :8080 if the server allows. ${originUrl}` : `Untrusted cert — open ${originUrl} in this browser, accept, then retry`;
	wsStatusEl.classList.add(WS_STATUS_TLS_HINT_CLASS);
	wsStatusEl.classList.remove("ws-status-ok");
	wsStatusEl.classList.add("ws-status-bad");
}
/** When the server cert is issued for a hostname, https://&lt;public-ip&gt; fails before the user can "trust" it. */
function setWsStatusTlsHostnameHint(hostname) {
	const wsStatusEl = getWsStatusEl();
	if (wsStatusEl) {
		wsStatusEl.textContent = `TLS name mismatch for raw IP — set Remote host to ${hostname} (name on certificate), keep ports as needed`;
		wsStatusEl.classList.add(WS_STATUS_TLS_HINT_CLASS);
		wsStatusEl.classList.remove("ws-status-ok");
		wsStatusEl.classList.add("ws-status-bad");
	}
}
function setWsStatus(connected) {
	wsConnected = connected;
	if (connected) flushQueuedCoordinatorActs();
	const wsStatusEl = getWsStatusEl();
	if (wsStatusEl) {
		wsStatusEl.classList.remove(WS_STATUS_TLS_HINT_CLASS);
		if (connected) {
			wsStatusEl.textContent = "connected";
			wsStatusEl.classList.remove("ws-status-bad");
			wsStatusEl.classList.add("ws-status-ok");
		} else {
			wsStatusEl.textContent = "disconnected";
			wsStatusEl.classList.remove("ws-status-ok");
			wsStatusEl.classList.add("ws-status-bad");
		}
	}
	updateButtonLabel();
	for (const handler of wsConnectionHandlers) try {
		handler(connected);
	} catch {}
}
function handleServerMessage(msg) {
	if (msg.type === "voice_result" || msg.type === "voice_error") {
		const text = msg.error || msg.message || "Actions: " + JSON.stringify(msg.actions || []);
		for (const handler of voiceResultHandlers) try {
			handler({
				text,
				type: msg.type === "voice_error" ? "voice_error" : "voice_result",
				actions: msg.actions,
				error: msg.error
			});
		} catch {}
		log("Voice result: " + text);
	}
}
/**
* Tear down the hub transport and immediately run a fresh {@link connectWS} probe.
* Used when the PWA returns from background / bfcache: OS often kills WebSockets while
* a soft resume reconnect restores endpoint clipboard/coordinator without requiring a manual WS tap.
*/
function reconnectTransportAfterLifecycleResume(reason) {
	if (!globalThis.window) return;
	logWsState("lifecycle-reconnect", reason);
	stopClipboardPushLoop();
	clearAutoReconnectTimer();
	connectAttemptId += 1;
	manualDisconnectRequested = false;
	for (const [uuid, pending] of coordinatorPending.entries()) {
		clearTimeout(pending.timeoutId);
		pending.reject({
			ok: false,
			error: `Disconnected before response for ${uuid}`
		});
		coordinatorPending.delete(uuid);
	}
	for (const probe of [...activeProbeSockets]) {
		clearProbeTimer(probe);
		probe.removeAllListeners();
		probe.close();
		activeProbeSockets.delete(probe);
	}
	isConnecting = false;
	if (socket) try {
		socket.removeAllListeners();
		socket.disconnect();
	} catch {}
	socket = null;
	mirrorSocketOnGlobal(null);
	setWsStatus(false);
	autoReconnectAttempts = 0;
	packetWireDedupeGuard.clear();
	connectWS();
}
/**
* Probe candidate origins and establish the primary WebSocket transport.
*
* AI-READ: this function is intentionally large because it combines UI-state
* updates, candidate generation, PNA/LNA warm-up, TLS hints, and reconnect
* behavior for browser tabs, extensions, and native shells.
*/
function connectWS() {
	if (isNeutralinoNodeClipboardHubOwned()) {
		log("WS skip: Node clipboard-hub owns fleet /ws (WebView must not connect)");
		return;
	}
	if (nativeShellOwnsExclusiveHubWebsocket()) {
		log("WS skip: Java CwspBridgeService owns fleet /ws (WebView must not connect)");
		return;
	}
	if (isConnecting) return;
	if (socket && (socket.connected || socket.connecting)) return;
	if (activeProbeSockets.size > 0) return;
	clearAutoReconnectTimer();
	connectAttemptId += 1;
	const attemptId = connectAttemptId;
	manualDisconnectRequested = false;
	const remoteHost = getRemoteHost().trim();
	const endpointUrlForConnect = getAirPadEndpointUrl().trim();
	const resolvedRemoteHost = remoteHost || endpointUrlForConnect || "";
	const remoteProtocol = getRemoteProtocol();
	const isIpv4Literal = (host) => !!host && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
	const isPrivateIp = (host) => {
		if (!host) return false;
		if (!isIpv4Literal(host)) return false;
		return host.startsWith("10.") || host.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host);
	};
	/**
	* HTTPS probe order: LAN / private IPs first (where CWSP admin usually listens), then DNS names
	* from **remote** settings, then **page** origin (PWA shell). Putting `u2re.space` last avoids
	* timeouts and PNA noise when the real gateway is 192.168.x.x only.
	*/
	const isHomeFleetPrivateIpv4 = (host) => isIpv4Literal(host) && host.startsWith("192.168.0.");
	const isFleetLanGatewayHost = (host) => {
		return stripWireEndpointIdPrefix(host).trim().toLowerCase() === "192.168.0.200";
	};
	const isFleetWanGatewayHost = (host) => {
		return stripWireEndpointIdPrefix(host).trim().toLowerCase().includes("45.147.");
	};
	const isFleetIngressGatewayHost = (host) => isFleetLanGatewayHost(host) || isFleetWanGatewayHost(host);
	const pageHostEarly = location.hostname || "";
	const pageBareEarly = stripWireEndpointIdPrefix(pageHostEarly) || pageHostEarly;
	const offHomeFleet = isOffHomeFleetNetwork(pageBareEarly);
	const configuredRouteTargetRaw = getRemoteRouteTarget().trim();
	const configuredRouteTarget = sanitizeFleetRouteTarget(configuredRouteTargetRaw, endpointUrlForConnect || remoteHost) || configuredRouteTargetRaw;
	const routedViaFleetGateway = shouldConnectViaFleetGateway(endpointUrlForConnect || remoteHost, configuredRouteTarget);
	const fleetDeskGatewayProbe = shouldFleetDeskGatewayProbeFallbacks(configuredRouteTarget, endpointUrlForConnect || remoteHost, getAirPadDirectTargetUrl());
	const onHomeFleetPage = isOnHomeFleetLanPageHost(pageBareEarly);
	const preferWanGatewayProbeFirst = offHomeFleet || isGuestPrivateLanIpv4(pageBareEarly) || shouldPreferWanGatewayForAirpad(endpointUrlForConnect, pageBareEarly) || routedViaFleetGateway && !onHomeFleetPage || isGatewayHttpsOrigin(endpointUrlForConnect) && offHomeFleet;
	const reorderHostEntriesForHttps = (entries) => {
		const dnsRemote = [];
		const dnsPage = [];
		const homeFleetIpv4 = [];
		const lanGatewayIpv4 = [];
		const wanGatewayIpv4 = [];
		const publicIpv4 = [];
		const guestPrivateIpv4 = [];
		for (const e of entries) if (!isIpv4Literal(e.host)) if (e.source === "page") dnsPage.push(e);
		else dnsRemote.push(e);
		else if (isFleetLanGatewayHost(e.host)) lanGatewayIpv4.push(e);
		else if (isFleetWanGatewayHost(e.host)) wanGatewayIpv4.push(e);
		else if (isHomeFleetPrivateIpv4(e.host) || e.host === "127.0.0.1") homeFleetIpv4.push(e);
		else if (isPrivateIp(e.host)) guestPrivateIpv4.push(e);
		else publicIpv4.push(e);
		if (preferWanGatewayProbeFirst) return [
			...wanGatewayIpv4,
			...lanGatewayIpv4,
			...dnsRemote,
			...publicIpv4,
			...homeFleetIpv4,
			...dnsPage,
			...guestPrivateIpv4
		];
		if (onHomeFleetPage) return [
			...homeFleetIpv4,
			...lanGatewayIpv4,
			...wanGatewayIpv4,
			...dnsRemote,
			...dnsPage,
			...publicIpv4,
			...guestPrivateIpv4
		];
		return [
			...wanGatewayIpv4,
			...lanGatewayIpv4,
			...homeFleetIpv4,
			...dnsRemote,
			...dnsPage,
			...publicIpv4,
			...guestPrivateIpv4
		];
	};
	const isLikelyPort = (value) => /^\d{1,5}$/.test(value);
	const stripProtocol = (value) => {
		return value.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0];
	};
	const parseHostAndPort = (value) => {
		const hostSpec = stripProtocol(value).trim();
		if (!hostSpec) return null;
		const at = hostSpec.lastIndexOf(":");
		if (at <= 0) return { host: hostSpec };
		const host = hostSpec.slice(0, at);
		const port = hostSpec.slice(at + 1);
		if (!host || !isLikelyPort(port)) return { host: hostSpec };
		return {
			host,
			port
		};
	};
	let remoteHostSpecs = splitConnectHostList(remoteHost).map((entry) => parseHostAndPort(entry)).filter((entry) => !!entry && !!entry.host);
	if (offHomeFleet && isGatewayHttpsOrigin(endpointUrlForConnect) && !routedViaFleetGateway) {
		const filtered = remoteHostSpecs.filter((spec) => {
			const bare = stripWireEndpointIdPrefix(spec.host).trim();
			if (!bare) return false;
			if (isFleetIngressGatewayHost(bare)) return true;
			if (isIpv4Literal(bare) && isHomeFleetPrivateIpv4(bare)) return false;
			return true;
		});
		if (filtered.length) remoteHostSpecs = filtered;
	}
	if (!remoteHostSpecs.length && endpointUrlForConnect) {
		const endpointSpec = parseHostAndPort(endpointUrlForConnect);
		if (endpointSpec?.host) remoteHostSpecs = [endpointSpec];
	}
	const remotePort = (remoteHostSpecs[0]?.port || "").trim();
	const parsedConfiguredRouteTarget = configuredRouteTarget ? parseHostAndPort(configuredRouteTarget) : void 0;
	const pageHost = pageHostEarly;
	const isLocalPageHost = /^(localhost|127\.0\.0\.1)$/.test(pageHost) || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(pageHost) && (pageHost.startsWith("10.") || pageHost.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(pageHost));
	if (location.protocol === "https:" && remoteProtocol === "http" && !isCapacitorNativeShell()) {
		log("WebSocket error: browser blocks ws/http from https page (mixed content). Open Airpad via http:// or use valid HTTPS cert on endpoint.");
		isConnecting = false;
		setWsStatus(false);
		updateButtonLabel();
		return;
	}
	const remoteHostSpec = remoteHostSpecs[0];
	const parsedRemoteHost = remoteHostSpec?.host || resolvedRemoteHost;
	const parsedRemotePort = remoteHostSpec?.port;
	const routeTargetForQuery = (() => {
		if (isFleetGatewayWireNodeId(configuredRouteTarget)) return normalizeWireNodeIdForWire(configuredRouteTarget);
		if (isFleetGatewayWireNodeId(configuredRouteTargetRaw)) return normalizeWireNodeIdForWire(configuredRouteTargetRaw);
		if (isFleetDeskWireNodeId(configuredRouteTarget)) return normalizeWireNodeIdForWire(configuredRouteTarget);
		if (isAssociableFleetWireNodeId(configuredRouteTarget)) return normalizeWireNodeIdForWire(configuredRouteTarget);
		if (routedViaFleetGateway && isFleetDeskWireNodeId(configuredRouteTargetRaw)) return normalizeWireNodeIdForWire(configuredRouteTargetRaw);
		if (fleetDeskGatewayProbe || isGatewayHttpsOrigin(endpointUrlForConnect) || isGatewayHttpsOrigin(remoteHost)) return DEFAULT_DESK_WIRE_NODE_ID;
		const parsedHost = parsedConfiguredRouteTarget?.host || "";
		if (parsedHost && isHomeFleetLanHost(parsedHost)) return normalizeWireNodeIdForWire(parsedHost);
		if (parsedHost) return parsedHost;
		if (configuredRouteTarget) return configuredRouteTarget;
		return "";
	})();
	const routeTargetPortForQuery = (parsedConfiguredRouteTarget?.port || "").trim();
	const rawProbeHostEarly = (parsedRemoteHost || resolvedRemoteHost || "").trim();
	const firstHostBare = rawProbeHostEarly.length > 0 ? stripWireEndpointIdPrefix(rawProbeHostEarly) || rawProbeHostEarly : "";
	const firstHostIpv4 = (() => {
		const b = firstHostBare.trim();
		if (!b) return "";
		const at = b.lastIndexOf(":");
		if (at > 0 && isLikelyPort(b.slice(at + 1))) return b.slice(0, at);
		return b;
	})();
	const inferProtocol = () => {
		if (remoteProtocol === "http" || remoteProtocol === "https") return remoteProtocol;
		if (remotePort === "443" || remotePort === "8434" || remotePort === "8444") return "https";
		if (remotePort === "80" || remotePort === "8080" || remotePort === "8081") return "http";
		if (isCapacitorNativeShell() && location.protocol === "https:" && firstHostIpv4 && isIpv4Literal(firstHostIpv4) && isPrivateIp(firstHostIpv4)) return "https";
		if (isCapacitorNativeShell() && location.protocol !== "https:" && firstHostIpv4 && isIpv4Literal(firstHostIpv4) && isPrivateIp(firstHostIpv4)) return "http";
		return location.protocol === "https:" ? "https" : "http";
	};
	const primaryProtocol = inferProtocol();
	const rawProbeHost = rawProbeHostEarly;
	const probeHost = stripWireEndpointIdPrefix(rawProbeHost) || rawProbeHost;
	const probePort = remotePort || (primaryProtocol === "https" ? "8434" : "8080");
	tryRequestLocalNetworkPermission(`${primaryProtocol}://${probeHost}:${probePort}`, probeHost);
	if (pageHost && isLoopbackHost(probeHost) && !isLoopbackHost(pageHost) && isPrivateOrLocalTarget(pageHost)) {
		const pageProbeHost = stripWireEndpointIdPrefix(pageHost) || pageHost;
		tryRequestLocalNetworkPermission(`${primaryProtocol}://${pageProbeHost}:${probePort}`, pageProbeHost);
	}
	const fallbackProtocol = primaryProtocol === "https" ? "http" : "https";
	const defaultPortsByProtocol = {
		http: [...CWSP_DEFAULT_HTTP_PORTS],
		https: [...CWSP_DEFAULT_HTTPS_PORTS]
	};
	const locationPort = location.port?.trim?.() || "";
	/** Default 443/80 when `location.port` is empty — used to prefer same-origin WS on unified HTTPS entrypoints. */
	const pageEffectivePort = locationPort || (location.protocol === "https:" ? "443" : location.protocol === "http:" ? "80" : "");
	const protocolOrder = remoteProtocol === "http" ? ["http"] : remoteProtocol === "https" ? ["https"] : [primaryProtocol, fallbackProtocol];
	const isLikelyHttpsPort = (port) => CWSP_DEFAULT_HTTPS_PORTS.includes(port);
	const isLikelyHttpPort = (port) => CWSP_DEFAULT_HTTP_PORTS.includes(port);
	const getPortsForProtocol = (protocol, preferredPort) => {
		const ports = [];
		const explicitPort = (preferredPort && isLikelyPort(preferredPort) ? preferredPort : "") || (remotePort && isLikelyPort(remotePort) ? remotePort : "");
		if (explicitPort) {
			if (protocol === "https") {
				if (isLikelyHttpsPort(explicitPort) || remoteProtocol === "https" || remoteProtocol === "auto") ports.push(explicitPort);
			} else if (isLikelyHttpPort(explicitPort) || remoteProtocol === "http" || remoteProtocol === "auto") ports.push(explicitPort);
			if (!ports.length && remoteProtocol === protocol) ports.push(explicitPort);
			if (ports.length) return ports.filter((port, idx) => ports.indexOf(port) === idx);
		}
		for (const defaultPort of defaultPortsByProtocol[protocol]) ports.push(defaultPort);
		if (locationPort) ports.push(locationPort);
		return ports.filter((port, idx) => ports.indexOf(port) === idx);
	};
	const connectHostFromRemote = (h) => {
		return stripWireEndpointIdPrefix(h.trim()) || h.trim();
	};
	const hostEntries = [];
	for (const remoteHostSpecEntry of remoteHostSpecs) {
		const ch = connectHostFromRemote(remoteHostSpecEntry.host);
		if (!ch) continue;
		hostEntries.push({
			host: ch,
			source: "remote",
			preferPort: remoteHostSpecEntry.port
		});
	}
	if (remoteHostSpecs.length === 0 && remoteHost) {
		const ch = connectHostFromRemote(remoteHost);
		if (ch) hostEntries.push({
			host: ch,
			source: "remote"
		});
	}
	/** Hostnames the user configured for the transport (Connect URL), lowercased. */
	const normalizedRemoteHosts = /* @__PURE__ */ new Set();
	for (const spec of remoteHostSpecs) if (spec.host) normalizedRemoteHosts.add(spec.host.toLowerCase());
	if (remoteHostSpecs.length === 0 && remoteHost.trim()) for (const part of splitConnectHostList(remoteHost.trim())) {
		const parsed = parseHostAndPort(part);
		if (parsed?.host) normalizedRemoteHosts.add(parsed.host.toLowerCase());
	}
	/**
	* If the user configured **any** LAN / local transport host, skip adding `location.hostname`
	* unless it is already listed as a remote host. (Connect URL may list both 192.168.x.x and a
	* public name — we still drop the redundant **page** copy of u2re.space when remotes already
	* include a private gateway.)
	*/
	const hasPrivateOrLocalTransportHost = () => {
		for (const h of normalizedRemoteHosts) {
			const bare = stripWireEndpointIdPrefix(h).toLowerCase();
			if (bare === "localhost" || bare === "127.0.0.1") return true;
			if (isIpv4Literal(bare) && isPrivateIp(bare)) return true;
		}
		return false;
	};
	const pageHostnameLower = pageHost.toLowerCase();
	const pageBareForGuest = stripWireEndpointIdPrefix(pageHost) || pageHost;
	const pageProtocol = String(location.protocol || "").toLowerCase();
	const skipExtensionPageOrigin = pageProtocol === "chrome-extension:" || pageProtocol === "moz-extension:" || pageProtocol === "safari-web-extension:" || /^[a-p]{32}$/.test(pageHostnameLower);
	const skipGuestPageOrigin = Boolean(pageHostnameLower) && isGuestPrivateLanIpv4(pageBareForGuest) && !normalizedRemoteHosts.has(pageHostnameLower);
	const skipPageOriginForDirectLan = Boolean(pageHost) && normalizedRemoteHosts.size > 0 && hasPrivateOrLocalTransportHost() && !isLocalPageHost && !normalizedRemoteHosts.has(pageHostnameLower);
	const skipOffFleetLoopbackPage = offHomeFleet && Boolean(pageHost) && isLoopbackHost(pageHost);
	if (location.hostname && !skipExtensionPageOrigin && !skipPageOriginForDirectLan && !skipGuestPageOrigin && !skipOffFleetLoopbackPage) hostEntries.push({
		host: location.hostname,
		source: "page",
		...pageEffectivePort ? { preferPort: pageEffectivePort } : {}
	});
	const uniqueHostEntries = /* @__PURE__ */ new Map();
	for (const entry of hostEntries) if (entry.host && !uniqueHostEntries.has(entry.host)) uniqueHostEntries.set(entry.host, entry);
	const candidateHostEntries = Array.from(uniqueHostEntries.values());
	const httpsOrderedHostEntries = reorderHostEntriesForHttps(candidateHostEntries);
	const candidates = [];
	for (const protocol of protocolOrder) {
		if (location.protocol === "https:" && protocol === "http" && true) continue;
		const hostList = protocol === "https" ? httpsOrderedHostEntries : candidateHostEntries;
		for (const hostEntry of hostList) {
			const { host, source, preferPort } = hostEntry;
			const hostPortOverride = pageHost && host === pageHost && pageEffectivePort && (!preferPort || preferPort === pageEffectivePort) ? pageEffectivePort : preferPort;
			for (const port of getPortsForProtocol(protocol, hostPortOverride)) {
				const hostBare = stripWireEndpointIdPrefix(host).trim() || host.trim();
				const hostLooksPrivate = isIpv4Literal(hostBare) && isPrivateIp(hostBare);
				const crossOriginHttpsToPrivateLan = location.protocol === "https:" && !isLocalPageHost && hostLooksPrivate;
				const privateLanHint = isCapacitorNativeShell() && hostLooksPrivate || location.protocol === "https:" && isLocalPageHost && hostLooksPrivate || crossOriginHttpsToPrivateLan && hostLooksPrivate;
				candidates.push({
					url: `${protocol}://${host}:${port}`,
					protocol,
					host,
					source,
					port,
					privateLanHint
				});
			}
		}
	}
	const deduplicatedCandidates = candidates.filter((item, idx) => candidates.findIndex((x) => x.url === item.url) === idx);
	if (deduplicatedCandidates.length === 0) {
		isConnecting = false;
		setWsStatus(false);
		updateButtonLabel();
		return;
	}
	const normalizedOffset = deduplicatedCandidates.length > 0 ? nextWsCandidateOffset % deduplicatedCandidates.length : 0;
	const uniqueCandidates = deduplicatedCandidates.slice(normalizedOffset).concat(deduplicatedCandidates.slice(0, normalizedOffset));
	nextWsCandidateOffset = normalizedOffset;
	lastWsCandidates = uniqueCandidates;
	if (lastWsCandidates.length <= 1) nextWsCandidateOffset = 0;
	const rotateCandidate = () => {
		if (lastWsCandidates.length > 1) nextWsCandidateOffset = (nextWsCandidateOffset + 1) % lastWsCandidates.length;
	};
	isConnecting = true;
	updateButtonLabel();
	const maxRounds = 3;
	const retryDelayMs = 450;
	const targetHost = connectHostFromRemote(parsedRemoteHost || remoteHost || "");
	const targetPort = routeTargetPortForQuery || parsedRemotePort || remotePort || (primaryProtocol === "https" ? "8434" : "8080");
	const routeTarget = routeTargetForQuery;
	const resolvedRouteTarget = routeTarget || targetHost || "";
	const isSameAsTargetHost = () => {
		if (!targetHost) return true;
		const normalizedRoute = normalizeWireNodeIdForWire(routeTarget);
		if (!normalizedRoute) return !isFleetIngressGatewayHost(targetHost);
		const normalizedTargetHost = targetHost.trim().toLowerCase();
		const routeBare = stripWireEndpointIdPrefix(normalizedRoute).toLowerCase();
		if (!routeBare || !normalizedTargetHost) return true;
		if (routeBare === normalizedTargetHost) return true;
		if (normalizedRoute.toLowerCase() === `l-${normalizedTargetHost}`) return true;
		if (isAssociableFleetWireNodeId(normalizedRoute) && routeBare !== normalizedTargetHost) return false;
		return false;
	};
	const buildHandshakeForCandidate = (candidate) => {
		const url = candidate.url;
		const clientToken = getClientToken();
		const accessToken = getWireAccessToken();
		const clientAccessToken = getClientAccessToken();
		const clientId = getClientId();
		const peerInstanceId = getAirPadPeerInstanceId().trim();
		const handshakeAuth = {};
		if (clientToken) {
			handshakeAuth.token = clientToken;
			handshakeAuth.userKey = clientToken;
		}
		if (accessToken) handshakeAuth.accessToken = accessToken;
		if (clientAccessToken) handshakeAuth.clientAccessToken = clientAccessToken;
		if (clientId) handshakeAuth.clientId = clientId;
		if (peerInstanceId) {
			handshakeAuth.peerInstanceId = peerInstanceId;
			handshakeAuth.deviceInstanceId = peerInstanceId;
		}
		const queryParams = {};
		if (peerInstanceId) {
			queryParams.peerInstanceId = peerInstanceId;
			queryParams.deviceInstanceId = peerInstanceId;
		}
		queryParams.connectionType = getAirPadHandshakeConnectionType();
		queryParams.archetype = getAirPadHandshakeArchetype();
		queryParams.cwspEnvelope = "v2";
		if (clientId) {
			queryParams.clientId = clientId;
			queryParams.userId = clientId;
		}
		if (clientToken) {
			queryParams.token = clientToken;
			queryParams.userKey = clientToken;
		}
		queryParams[CWSP_ROUTE_QUERY.via] = !isSameAsTargetHost() ? "tunnel" : candidate.source || "unknown";
		queryParams[CWSP_ROUTE_QUERY.localEndpoint] = isSameAsTargetHost() ? "1" : "0";
		const inferredDeskRoute = routeTarget || (isFleetGatewayWireNodeId(configuredRouteTargetRaw) ? "L-200" : "") || "";
		let effectiveRoute = inferredDeskRoute || resolvedRouteTarget;
		let effectiveRouteTarget = inferredDeskRoute || routeTarget || targetHost || resolvedRouteTarget;
		const candBare = stripWireEndpointIdPrefix(candidate.host || "").trim();
		const pageBare = stripWireEndpointIdPrefix(pageHost || "").trim();
		if (candidate.source === "page" && candBare && pageBare && candBare.toLowerCase() === pageBare.toLowerCase() && isLoopbackHost(effectiveRoute)) {
			effectiveRoute = candBare;
			effectiveRouteTarget = candBare;
		}
		if (effectiveRoute) {
			queryParams[CWSP_ROUTE_QUERY.route] = effectiveRoute;
			queryParams[CWSP_ROUTE_QUERY.routeTarget] = effectiveRouteTarget;
		}
		if (shouldUseVerboseAirpadQuery()) {
			queryParams[CWSP_ROUTE_QUERY.hop] = candidate.host || remoteHost || "unknown";
			queryParams[CWSP_ROUTE_QUERY.host] = candidate.host || remoteHost || "";
			queryParams[CWSP_ROUTE_QUERY.target] = targetHost || "";
			queryParams[CWSP_ROUTE_QUERY.targetPort] = targetPort;
			queryParams[CWSP_ROUTE_QUERY.viaPort] = candidate.port || "";
			queryParams[CWSP_ROUTE_QUERY.protocol] = candidate.protocol || "https";
		}
		if (clientAccessToken) queryParams.clientAccessToken = clientAccessToken;
		if (accessToken) queryParams.accessToken = accessToken;
		return {
			url,
			clientToken,
			accessToken,
			clientId,
			peerInstanceId,
			handshakeAuth,
			queryParams
		};
	};
	const finalizeConnectedSocket = (probeSocket, candidate, index, url) => {
		socket = probeSocket;
		logWsState("connected", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} transport=${candidate.protocol} parallel=${AIRPAD_CANDIDATE_PARALLEL}`);
		isConnecting = false;
		autoReconnectAttempts = 0;
		clearAutoReconnectTimer();
		setWsStatus(true);
		startClipboardPushLoop();
		socket.on("disconnect", (reason) => {
			stopClipboardPushLoop();
			logWsState("disconnected", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${reason || "unknown"}`);
			isConnecting = false;
			setWsStatus(false);
			updateButtonLabel();
			const manual = manualDisconnectRequested;
			manualDisconnectRequested = false;
			for (const [uuid, pending] of coordinatorPending.entries()) {
				clearTimeout(pending.timeoutId);
				pending.reject({
					ok: false,
					error: `Disconnected before response for ${uuid}`
				});
				coordinatorPending.delete(uuid);
			}
			socket = null;
			if (manual) {
				autoReconnectAttempts = 0;
				return;
			}
			if (shouldRotateCandidateOnDisconnect(reason)) {
				rotateCandidate();
				if (lastWsCandidates.length > 1) log(`WebSocket disconnect reason "${reason || "unknown"}", trying next candidate on reconnect`);
			}
			const attempt = autoReconnectAttempts + 1;
			if (!shouldAutoReconnectAfterDisconnect(reason) || false) return;
			autoReconnectAttempts = attempt;
			const delay = Math.min(AUTO_RECONNECT_BASE_DELAY_MS * attempt, 5e3);
			clearAutoReconnectTimer();
			autoReconnectTimer = globalThis.setTimeout(() => {
				autoReconnectTimer = null;
				if (isConnecting || wsConnected || socket && socket.connected || socket?.connecting) return;
				logWsState("auto-reconnect", `attempt=${`${attempt}/unlimited`} reason=${reason || "unknown reason"}`);
				connectWS();
			}, delay);
		});
		socket.on("connect_error", (error) => {
			logWsState("socket-connect-error", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${error?.message || "unknown"}`);
			isConnecting = false;
			updateButtonLabel();
		});
		socket.on("voice_result", async (msg) => {
			handleServerMessage(await unwrapIncomingPayload(msg));
		});
		socket.on("voice_error", async (msg) => {
			handleServerMessage(await unwrapIncomingPayload(msg));
		});
		socket.on("clipboard:update", async (msg) => {
			const decoded = await unwrapIncomingPayload(msg);
			if (!isClipboardSenderAllowedForInbound(getCoordinatorPacketSenderId(decoded))) return;
			const asset = extractClipboardAssetFromPacket(decoded);
			if (asset) {
				applyIncomingClipboardImage(asset, { source: decoded?.source });
				return;
			}
			applyIncomingClipboardText(extractClipboardTextFromPacket(decoded), { source: decoded?.source });
		});
		socket.on("data", async (packet) => {
			const decoded = await unwrapIncomingPayload(packet);
			if (!isCoordinatorPacket(decoded)) return;
			handleCoordinatorPacket(decoded);
		});
		socket.on("message", async (packet) => {
			const decoded = await unwrapIncomingPayload(packet);
			if (!isCoordinatorPacket(decoded)) return;
			handleCoordinatorPacket(decoded);
		});
		socket.on("network.fetch", async (request, ack) => {
			const response = await handleServerNetworkFetchRequest(request);
			if (typeof ack === "function") ack(response);
		});
		mirrorSocketOnGlobal(socket);
	};
	const probeBatch = (startIndex, round) => new Promise((resolve) => {
		if (attemptId !== connectAttemptId) {
			resolve(false);
			return;
		}
		const batch = uniqueCandidates.slice(startIndex, startIndex + AIRPAD_CANDIDATE_PARALLEL);
		if (!batch.length) {
			resolve(false);
			return;
		}
		if (startIndex === 0 && round === 0) {
			const el = getWsStatusEl();
			if (el) {
				el.classList.remove(WS_STATUS_TLS_HINT_CLASS);
				el.textContent = "connecting…";
			}
		}
		let won = false;
		let settled = false;
		let deadCount = 0;
		const batchSize = batch.length;
		let batchTlsCertUrl = null;
		let batchTlsHostname = null;
		const finishWin = (winner, candidate, index, url, hs) => {
			if (settled) return;
			settled = true;
			won = true;
			for (const s of [...activeProbeSockets]) if (s !== winner) {
				clearProbeTimer(s);
				s.removeAllListeners();
				s.close();
				activeProbeSockets.delete(s);
			}
			clearProbeTimer(winner);
			activeProbeSockets.delete(winner);
			finalizeConnectedSocket(winner, candidate, index, url);
			resolve(true);
		};
		const finishAllDead = () => {
			if (settled || won) return;
			deadCount++;
			if (deadCount < batchSize) return;
			settled = true;
			if (batchTlsCertUrl) setWsStatusTlsHint(batchTlsCertUrl);
			else if (batchTlsHostname) setWsStatusTlsHostnameHint(batchTlsHostname);
			resolve(false);
		};
		for (let localIdx = 0; localIdx < batch.length; localIdx++) {
			const candidate = batch[localIdx];
			const index = startIndex + localIdx;
			const hs = buildHandshakeForCandidate(candidate);
			const { url, handshakeAuth, queryParams } = hs;
			logWsState("connecting", `batch=${startIndex}-${startIndex + batchSize - 1} candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} transport=${candidate.protocol} source=${candidate.source} host=${candidate.host}:${candidate.port} target=${targetHost}:${targetPort}`);
			const probeSocket = createWsSocket(url, {
				auth: handshakeAuth,
				query: queryParams,
				timeout: AIRPAD_PROBE_IO_TIMEOUT_MS
			});
			activeProbeSockets.add(probeSocket);
			probeSocket.__cwspProbeTimer = globalThis.setTimeout(() => {
				if (attemptId !== connectAttemptId) {
					clearProbeTimer(probeSocket);
					probeSocket.removeAllListeners();
					probeSocket.close();
					activeProbeSockets.delete(probeSocket);
					return;
				}
				if (won || settled || probeSocket.connected) return;
				clearProbeTimer(probeSocket);
				probeSocket.removeAllListeners();
				probeSocket.close();
				activeProbeSockets.delete(probeSocket);
				logWsState("connect-failed", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=probe-hard-timeout`);
				finishAllDead();
			}, AIRPAD_PROBE_HARD_CAP_MS);
			probeSocket.on("connect", () => {
				clearProbeTimer(probeSocket);
				if (attemptId !== connectAttemptId) {
					probeSocket.removeAllListeners();
					probeSocket.close();
					activeProbeSockets.delete(probeSocket);
					return;
				}
				if (won || settled) {
					probeSocket.removeAllListeners();
					probeSocket.close();
					activeProbeSockets.delete(probeSocket);
					return;
				}
				finishWin(probeSocket, candidate, index, url, hs);
			});
			probeSocket.on("connect_error", (error) => {
				clearProbeTimer(probeSocket);
				activeProbeSockets.delete(probeSocket);
				if (won || settled) {
					probeSocket.removeAllListeners();
					probeSocket.close();
					return;
				}
				probeSocket.removeAllListeners();
				probeSocket.close();
				const details = error?.description || error?.context || "";
				const errorMessage = String(error?.message || error || "");
				const combinedProbeErr = `${errorMessage} ${String(details)}`;
				const weakWsTlsSuspect = candidate.protocol === "https" && isPrivateIp(candidate.host) && /xhr poll error|websocket error/i.test(errorMessage);
				/** Capacitor/WebView often reports generic xhr/WS errors; do not label "Untrusted cert" without TLS signals. */
				const tlsKeywordsInErr = /certificate|cert\.|ssl|tls|trust|ERR_CERT|ERR_SSL|handshake|authority|SELF_SIGNED|unknown.*cert|invalid.*cert|unable to verify|pkix|hostname|name mismatch/i.test(combinedProbeErr);
				const plainTransportFailure = /refused|ECONNREFUSED|ENOTFOUND|timed out|timeout|unreachable|ERR_CONNECTION|ADDRESS_UNREACHABLE|NAME_NOT_RESOLVED|INTERNET_DISCONNECTED|network.*lost/i.test(combinedProbeErr);
				const nativeAir = isCapacitorNativeShell();
				if (weakWsTlsSuspect && !batchTlsCertUrl && (tlsKeywordsInErr || !nativeAir && !plainTransportFailure)) batchTlsCertUrl = url;
				const publicIpv4Https = candidate.protocol === "https" && isIpv4Literal(candidate.host) && !isPrivateIp(candidate.host) && candidate.host !== "127.0.0.1";
				const combinedErr = `${errorMessage} ${String(details)}`;
				if (publicIpv4Https && /xhr poll error|websocket error|certificate|CERT|common name|ssl|tls|failed to fetch|name invalid/i.test(combinedErr) && !batchTlsHostname) {
					const suggested = pageHost && !isIpv4Literal(pageHost) && pageHost !== "localhost" ? pageHost : "";
					if (suggested) batchTlsHostname = suggested;
				}
				if (candidate.privateLanHint && /cors|private network|address space|failed fetch/i.test(errorMessage)) logWsState("connect-failed", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${errorMessage} hint=private-network-cors`);
				logWsState("connect-failed", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${errorMessage} details=${details ? safeJson(details) : "none"}`);
				finishAllDead();
			});
		}
	});
	(async () => {
		for (let round = 0; round < maxRounds; round++) {
			for (let start = 0; start < uniqueCandidates.length; start += AIRPAD_CANDIDATE_PARALLEL) {
				if (attemptId !== connectAttemptId) return;
				if (await probeBatch(start, round)) return;
			}
			if (round + 1 < maxRounds) {
				logWsState("retry", `round=${round + 2}/${maxRounds} next=0`);
				await new Promise((r) => globalThis.setTimeout(r, retryDelayMs));
			}
		}
		if (attemptId !== connectAttemptId) return;
		logWsState("failed", `round=${maxRounds}/${maxRounds} all-candidates`);
		isConnecting = false;
		setWsStatus(false);
		updateButtonLabel();
	})();
}
/** Stop probe sockets, tear down the primary transport, and mark the disconnect as user-requested. */
function disconnectWS() {
	stopClipboardPushLoop();
	clearAutoReconnectTimer();
	connectAttemptId += 1;
	manualDisconnectRequested = true;
	for (const probe of [...activeProbeSockets]) {
		clearProbeTimer(probe);
		probe.removeAllListeners();
		probe.close();
		activeProbeSockets.delete(probe);
	}
	isConnecting = false;
	if (!socket) {
		setWsStatus(false);
		updateButtonLabel();
		return;
	}
	log("Disconnecting WebSocket...");
	socket.disconnect();
	socket = null;
	mirrorSocketOnGlobal(null);
	setWsStatus(false);
}
/** Bind the optional connect button UI to the shared transport lifecycle. */
function initWebSocket(btnConnect) {
	btnEl = btnConnect;
	updateButtonLabel();
	if (!btnConnect) return;
	if (wsConnectButton === btnConnect) return;
	if (wsConnectButton) wsConnectButton.removeEventListener("click", handleWsConnectButtonClick);
	wsConnectButton = btnConnect;
	wsConnectButton.addEventListener("click", handleWsConnectButtonClick);
}
function handleWsConnectButtonClick() {
	if (isConnecting || wsConnected || socket && socket.connected || socket?.connecting) disconnectWS();
	else connectWS();
}
//#endregion
//#region src/frontend/boot/hub-socket-boot.ts
/**
* Unified hub transport: WebSocket to cwsp / endpoint (same stack as AirPad), optional background connection.
* Used from main PWA boot, Settings save, and CRX shells so clipboard coordinator works outside the AirPad view.
*
* Filename: hub-socket-boot.ts
* FullPath: modules/projects/subsystem/src/boot/hub-socket-boot.ts
* Change date and time: 14.05.00_19.07.2026
* Reason for changes: SW-safe DOM checks (no bare `window`) for CRX service worker.
*/
/** After this long in the background, force a full reconnect (zombie TCP / suspended workers). */
var PWA_STALE_BACKGROUND_MS = 12e3;
var hubLifecycleRecoveryInstalled = false;
var lastDocumentHiddenAt = 0;
/** True only in real DOM pages — never use bare `window` (throws in MV3 SW). */
var canUseDomWindow = () => {
	try {
		const g = globalThis;
		return Boolean(g.window && g.document);
	} catch {
		return false;
	}
};
var isCapacitorNativePlatform = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/**
* True when native Android (Capacitor/NativeScript) owns fleet `/ws`.
* INVARIANT: WebView must not open a second `/ws` with the same clientId.
* AirPad input goes through CwsBridge → CwspWsClient instead.
*/
function nativeShellOwnsExclusiveHubWebsocket() {
	if (!isPreferNativeWebsocketEnabled()) return false;
	try {
		if (globalThis.__CWS_NATIVE__ === true) return true;
	} catch {}
	return isCapacitorNativePlatform();
}
/**
* Neutralino/WebNative: Node clipboard-hub owns the fleet `/ws` clipboard session.
* INVARIANT: WebView must not open a second `/ws` with the same clientId (kicks the hub).
*/
function nodeClipboardHubOwnsExclusiveWebsocket() {
	return isNeutralinoNodeClipboardHubOwned();
}
/** Any shell where WebView browser WebSocket must stay dark for fleet hub. */
function backendOwnsExclusiveHubWebsocket() {
	return nativeShellOwnsExclusiveHubWebsocket() || nodeClipboardHubOwnsExclusiveWebsocket();
}
function shouldRunHubRecovery() {
	if (backendOwnsExclusiveHubWebsocket()) return false;
	if (!isMaintainHubSocketConnectionEnabled() && !isClipboardHubBootstrapEnabled()) return false;
	if (!getRemoteHost().trim()) return false;
	return true;
}
/**
* PWA / mobile: restore hub ↔ endpoint after suspend, offline, or bfcache restore.
* Requires Settings → maintain hub socket + a remote host (same rules as {@link applyHubSocketFromSettings}).
*/
function installAirpadHubLifecycleRecovery() {
	if (hubLifecycleRecoveryInstalled || !canUseDomWindow()) return;
	hubLifecycleRecoveryInstalled = true;
	const doc = globalThis.document;
	const win = globalThis.window;
	doc.addEventListener("visibilitychange", () => {
		if (doc.visibilityState !== "hidden") return;
		lastDocumentHiddenAt = Date.now();
	});
	const schedule = (fn) => {
		globalThis.setTimeout(fn, 280);
	};
	const recoverAfterVisibility = () => {
		if (!shouldRunHubRecovery()) return;
		(async () => {
			initWebSocket(null);
			const live = Boolean(getWS()?.connected);
			if (lastDocumentHiddenAt > 0 && Date.now() - lastDocumentHiddenAt >= PWA_STALE_BACKGROUND_MS && (live || isWSConnected())) {
				reconnectTransportAfterLifecycleResume("visibility");
				return;
			}
			if (!live && !isWSConnected()) connectWS();
		})();
	};
	const recoverAfterNetworkOrRestore = (reason) => {
		if (!shouldRunHubRecovery()) return;
		(() => {
			initWebSocket(null);
			reconnectTransportAfterLifecycleResume(reason);
		})();
	};
	doc.addEventListener("visibilitychange", () => {
		if (doc.visibilityState !== "visible") return;
		schedule(recoverAfterVisibility);
	});
	win.addEventListener("online", () => schedule(() => recoverAfterNetworkOrRestore("online")));
	win.addEventListener("pageshow", (ev) => {
		if (!ev.persisted) return;
		schedule(() => recoverAfterNetworkOrRestore("bfcache"));
	});
}
/**
* Apply after boot or any settings mutation (Save, storage sync). Idempotent with {@link applyAirpadRuntimeFromAppSettings}.
*/
async function applyHubSocketFromSettings(settings) {
	installAirpadHubLifecycleRecovery();
	if (await shouldDeferCrxHubSocketBootstrap(settings)) return;
	applyAirpadRuntimeFromAppSettings(settings);
	if (nativeShellOwnsExclusiveHubWebsocket()) return;
	if (nodeClipboardHubOwnsExclusiveWebsocket()) return;
	if (!isMaintainHubSocketConnectionEnabled() && !isClipboardHubBootstrapEnabled()) return;
	if (!getRemoteHost().trim()) return;
	initWebSocket(null);
	connectWS();
}
//#endregion
//#region src/frontend/boot/BootLoader.ts
/**
* Boot Loader - Shell/Style Initialization System
* 
* Manages the boot sequence for the CrossWord application:
* 1. Load settings and apply document theme (`:root` / color-scheme before Veela paints)
* 2. Load style system (Veela CSS or Minimal)
* 3. Initialize shell (frame/layout/environment)
* 4. Load view/component/module and connect uniform channels
* 
* Shell/Style Matrix:
* | Shells/Styles: | Faint | Minimal | Raw |
* |----------------|-------|-------|-----|
* | Veela          |  [r]  |  [o]  | [o] |
* | Minimal        |  [o]  |  [r]  | [r] |
* 
* [r] - recommended, [o] - optional
*/
var normalizeShellId = (shell) => {
	if (shell === "faint") return "tabbed";
	if (shell === "base") return "immersive";
	return shell;
};
/**
* Style system configurations
*/
var STYLE_CONFIGS = {
	"raw": {
		name: "Raw (No Framework)",
		stylesheets: [],
		description: "No CSS framework, raw browser defaults",
		recommendedShells: ["immersive"]
	},
	"vl-core": {
		name: "Core (Shared Foundation)",
		stylesheets: [],
		description: "Shared foundation styles for all veela variants",
		recommendedShells: ["immersive", "minimal"]
	},
	"vl-basic": {
		name: "Basic Veela Styles",
		stylesheets: [],
		description: "Minimal styling for basic functionality",
		recommendedShells: [
			"window",
			"tabbed",
			"minimal",
			"environment",
			"immersive",
			"content"
		]
	},
	"vl-advanced": {
		name: "Advanced (Full-Featured Styling)",
		stylesheets: [],
		description: "Full-featured styling with design tokens and effects",
		recommendedShells: [
			"tabbed",
			"minimal",
			"environment"
		]
	},
	"vl-beercss": {
		name: "BeerCSS (Beer CSS Compatible)",
		stylesheets: [],
		description: "Beer CSS compatible styling with Material Design 3",
		recommendedShells: ["tabbed"]
	}
};
/**
* Get the singleton boot loader
*/
var bootLoader = class BootLoader {
	static instance;
	state = {
		phase: "idle",
		styleSystem: null,
		shell: null,
		view: null,
		error: null
	};
	stateChangeHandlers = /* @__PURE__ */ new Set();
	shellInstance = null;
	/** MutationObserver-driven view host bindings (shared routing); disconnected between boots. */
	implicitBridgeCleanup = null;
	phaseHandlers = /* @__PURE__ */ new Map();
	constructor() {
		initializeRegistries();
	}
	static getInstance() {
		if (!BootLoader.instance) BootLoader.instance = new BootLoader();
		return BootLoader.instance;
	}
	/**
	* Execute the boot sequence
	*/
	async boot(container, config) {
		console.log("[BootLoader] Starting boot sequence:", config);
		try {
			if (this.shellInstance) try {
				this.implicitBridgeCleanup?.();
				this.implicitBridgeCleanup = null;
				ShellRegistry.unload(this.shellInstance.id);
			} catch (error) {
				console.warn("[BootLoader] Failed to unload previous shell:", error);
			} finally {
				this.shellInstance = null;
			}
			initializeLayers();
			initCwsNativeBridge().catch(() => {});
			try {
				const { initFrontendDebugCapture } = await import("./frontend-debug-capture.js").then((n) => n.t);
				initFrontendDebugCapture();
			} catch {}
			const persistedSettings = await loadSettings().catch((error) => {
				console.warn("[BootLoader] Failed to load settings:", error);
				return null;
			});
			let effectiveSettings = persistedSettings;
			if (isCapacitorCwsNativeShell()) {
				const seeded = await ensureCapacitorCwspSettingsSeeded().catch(() => null);
				if (seeded) effectiveSettings = seeded;
			}
			if (effectiveSettings) applyHubSocketFromSettings(effectiveSettings).catch(() => void 0);
			if (isCapacitorCwsNativeShell()) ensureCapacitorBridgeDaemonStarted(effectiveSettings).catch((error) => {
				console.warn("[BootLoader] CWSP bridge daemon auto-start skipped:", error);
			});
			applyTheme(effectiveSettings ?? DEFAULT_SETTINGS);
			if (!(() => {
				try {
					const g = globalThis;
					const surface = typeof document !== "undefined" ? String(document.documentElement?.dataset?.cwspSurface || "") : "";
					return Boolean(g.__CWS_SKIP_PWA__ || g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__ || g.Neutralino || typeof g.NL_OS === "string" || surface === "cwsp-control" || surface === "gateway");
				} catch {
					return false;
				}
			})()) try {
				const { initIngressPWA } = await import("./sw-handling.js").then((n) => n.s);
				await initIngressPWA();
			} catch (e) {
				console.warn("[BootLoader] Share-target / service worker ingress failed (non-fatal):", e);
			}
			await this.loadStyles(config.styleSystem);
			const persistedTheme = this.resolveThemeFromSettings(persistedSettings);
			const shell = await this.loadShell(config.shell, container);
			shell.setTheme(config.theme || persistedTheme);
			await shell.mount(container);
			this.implicitBridgeCleanup?.();
			this.implicitBridgeCleanup = startImplicitViewMessagingBridge();
			if (config.channels && config.channels.length > 0) await this.initChannels(config.channels, config.channelPriorityId);
			if (config.skipInitialNavigate) this.dismissShellLoadingSpinner(shell);
			else await shell.navigate(config.defaultView);
			this.setPhase("ready");
			if (config.rememberChoice) this.savePreferences(config);
			console.log("[BootLoader] Boot complete");
			return shell;
		} catch (error) {
			console.error("[BootLoader] Boot failed:", error);
			this.updateState({
				phase: "error",
				error
			});
			throw error;
		}
	}
	resolveThemeFromSettings(settings) {
		const theme = settings?.appearance?.theme || "auto";
		if (theme === "dark") return darkTheme;
		if (theme === "light") return lightTheme;
		return defaultTheme;
	}
	/** Hide immersive/minimal shell loading row when skipping {@link Shell.navigate}. */
	dismissShellLoadingSpinner(shell) {
		try {
			const loading = shell.getElement().shadowRoot?.querySelector(".app-shell__loading");
			if (loading) loading.hidden = true;
		} catch {}
	}
	/**
	* Load style system
	*/
	async loadStyles(styleSystem) {
		this.setPhase("styles");
		console.log(`[BootLoader] Loading style system: ${styleSystem}`);
		const config = STYLE_CONFIGS[styleSystem] || STYLE_CONFIGS["vl-basic"];
		try {
			await loadStyleSystem(styleSystem);
		} catch (error) {
			console.error(`[BootLoader] Failed to load style system: ${styleSystem}`, error);
			throw error;
		}
		for (const sheet of config.stylesheets) try {
			await loadAsAdopted(sheet);
		} catch (error) {
			console.warn(`[BootLoader] Failed to load stylesheet: ${sheet}`, error);
		}
		this.updateState({ styleSystem });
		console.log(`[BootLoader] Style system ${styleSystem} loaded`);
	}
	/**
	* Load and initialize shell
	*/
	async loadShell(shellId, container) {
		this.setPhase("shell");
		const normalizedShell = normalizeShellId(shellId);
		if (normalizedShell !== shellId) console.warn(`[BootLoader] Shell "${shellId}" is temporarily disabled, redirecting to "${normalizedShell}"`);
		console.log(`[BootLoader] Loading shell: ${normalizedShell}`);
		const shell = await ShellRegistry.load(normalizedShell, container);
		this.shellInstance = shell;
		this.updateState({ shell: normalizedShell });
		console.log(`[BootLoader] Shell ${normalizedShell} loaded`);
		return shell;
	}
	/**
	* Initialize service channels: one high-priority channel blocks boot, the rest
	* run when the browser is idle so startup stays within interactive budgets.
	*/
	async initChannels(channelIds, priorityId) {
		this.setPhase("channels");
		const unique = [...new Set(channelIds)];
		if (unique.length === 0) return;
		const primary = (priorityId && unique.includes(priorityId) ? priorityId : null) ?? unique[0];
		const rest = unique.filter((id) => id !== primary);
		console.log(`[BootLoader] Initializing primary channel:`, primary, rest.length ? `(+${rest.length} deferred)` : "");
		try {
			await serviceChannels.initChannel(primary);
		} catch (error) {
			console.warn(`[BootLoader] Failed to init primary channel ${primary}:`, error);
		}
		if (rest.length === 0) {
			console.log("[BootLoader] Channels initialized");
			return;
		}
		const runDeferred = () => {
			(async () => {
				for (const channelId of rest) try {
					await serviceChannels.initChannel(channelId);
				} catch (error) {
					console.warn(`[BootLoader] Failed to init channel ${channelId}:`, error);
				}
				console.log("[BootLoader] Deferred channels initialized:", rest);
			})();
		};
		if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(runDeferred, { timeout: 5e3 });
		else globalThis.setTimeout?.(runDeferred, 0);
	}
	/**
	* Update state and notify handlers
	*/
	updateState(partial) {
		Object.assign(this.state, partial);
		this.notifyStateChange();
	}
	/**
	* Set current phase and notify handlers
	*/
	setPhase(phase) {
		this.updateState({ phase });
		const handlers = this.phaseHandlers.get(phase);
		if (handlers) for (const handler of handlers) try {
			handler(this.state);
		} catch (error) {
			console.error(`[BootLoader] Phase handler error:`, error);
		}
	}
	/**
	* Notify all state change handlers
	*/
	notifyStateChange() {
		for (const handler of this.stateChangeHandlers) try {
			handler(this.state);
		} catch (error) {
			console.error(`[BootLoader] State handler error:`, error);
		}
	}
	/**
	* Subscribe to state changes
	*/
	onStateChange(handler) {
		this.stateChangeHandlers.add(handler);
		return () => {
			this.stateChangeHandlers.delete(handler);
		};
	}
	/**
	* Register a phase handler
	*/
	onPhase(phase, handler) {
		if (!this.phaseHandlers.has(phase)) this.phaseHandlers.set(phase, /* @__PURE__ */ new Set());
		this.phaseHandlers.get(phase).add(handler);
		return () => {
			this.phaseHandlers.get(phase)?.delete(handler);
		};
	}
	/**
	* Get current state
	*/
	getState() {
		return { ...this.state };
	}
	/**
	* Get current shell instance
	*/
	getShell() {
		return this.shellInstance;
	}
	/**
	* Save boot preferences
	*/
	savePreferences(config) {
		try {
			const normalizedShell = normalizeShellId(config.shell);
			localStorage.setItem("rs-boot-style", config.styleSystem);
			localStorage.setItem("rs-boot-shell", normalizedShell);
			localStorage.setItem("rs-boot-view", config.defaultView);
			localStorage.setItem("rs-boot-remember", "1");
		} catch (error) {
			console.warn("[BootLoader] Failed to save preferences:", error);
		}
	}
	/**
	* Load boot preferences
	*/
	loadPreferences() {
		try {
			if (localStorage.getItem("rs-boot-remember") !== "1") return null;
			const shell = normalizeShellId(localStorage.getItem("rs-boot-shell") || "minimal");
			return {
				styleSystem: localStorage.getItem("rs-boot-style") || void 0,
				shell,
				defaultView: localStorage.getItem("rs-boot-view") || void 0
			};
		} catch {
			return null;
		}
	}
	/**
	* Clear preferences
	*/
	clearPreferences() {
		try {
			localStorage.removeItem("rs-boot-style");
			localStorage.removeItem("rs-boot-shell");
			localStorage.removeItem("rs-boot-view");
			localStorage.removeItem("rs-boot-remember");
			localStorage.removeItem(LS_BOOT_SHELL_LAST_ACTIVE);
		} catch {}
	}
}.getInstance();
//#endregion
export { bootLoader, bootLoader as default };
