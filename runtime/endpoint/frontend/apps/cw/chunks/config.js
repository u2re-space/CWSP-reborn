import { s as withTimeout } from "../fest/core.js";
import { l as patchNativeUnifiedSettingsDetailed, s as isCapacitorCwsNativeShell } from "../vendor/@capacitor_core.js";
import { A as toShortFleetWireNodeId, B as looksLikeConnectHost, C as resolveWanGatewayConnectOrigin, D as shouldFleetDeskGatewayProbeFallbacks, E as shouldConnectViaFleetGateway, G as resolveConnectHostToOrigin, H as normalizeConnectHostInput, J as splitConnectHostList, M as wireNodeIdToLanHost, O as shouldPreferWanGatewayForAirpad, S as resolveFleetGatewayConnectOrigins, T as sanitizeFleetSelfWireNodeId, V as migrateLegacyCwspPublicPort, Y as splitMultiValueList, _ as isOffHomeFleetNetwork, b as resolveDeskDirectOriginFromWireNodeId, c as fleetWireNodeIdsEquivalent, d as isExplicitFleetGatewayTarget, f as isFleetDeskWireNodeId, i as FLEET_GATEWAY_WIRE_NODE_ID, j as wireNodeIdToBareConnectHost, l as inferDirectHttpsOriginFromConnectInput, m as isGatewayHttpsOrigin, o as appSettingsShellToNativeExtras, p as isFleetGatewayWireNodeId, r as DEFAULT_DESK_WIRE_NODE_ID, s as appSettingsToRemoteConnectionV1, t as AIRPAD_REMOTE_CONFIG_STORAGE_KEY, u as isAssociableFleetWireNodeId, w as sanitizeFleetRouteTarget, x as resolveFleetDeskProbeWireNodeId, y as normalizeWireNodeIdForWire, z as hasExplicitConnectOrigin } from "./airpad-cwsp-client-parity.js";
//#region ../../modules/projects/cwsp-shared/src/wire-target-id.ts
function parseWireTargetEntry(raw) {
	const t = String(raw ?? "").trim();
	if (!t) return { nodeId: "" };
	const idx = t.lastIndexOf("::");
	if (idx <= 0) return { nodeId: t };
	const nodeId = t.slice(0, idx).trim();
	const accessToken = t.slice(idx + 2).trim();
	if (!nodeId) return { nodeId: t };
	return {
		nodeId,
		accessToken: accessToken || void 0
	};
}
/** Split comma / semicolon / whitespace list or legacy array into parsed entries (dedupe by nodeId + token). */
function parseWireTargetList(value) {
	if (Array.isArray(value)) {
		const out = [];
		const seen = /* @__PURE__ */ new Set();
		for (const entry of value) {
			if (typeof entry === "string") {
				for (const parsed of parseWireTargetList(entry)) pushUnique(out, seen, parsed);
				continue;
			}
			if (!entry || typeof entry !== "object") continue;
			const record = entry;
			const nodeId = String(record.nodeId ?? record.id ?? "").trim();
			if (!nodeId) continue;
			pushUnique(out, seen, {
				nodeId,
				accessToken: (record.accessToken != null ? String(record.accessToken).trim() : void 0) || void 0
			});
		}
		return out;
	}
	if (typeof value !== "string") return [];
	const parts = splitMultiValueList(value);
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const p of parts) {
		const e = parseWireTargetEntry(p);
		if (!e.nodeId) continue;
		pushUnique(out, seen, e);
	}
	return out;
}
var pushUnique = (out, seen, e) => {
	const key = `${e.nodeId.toLowerCase()}::${e.accessToken ?? ""}`;
	if (seen.has(key)) return;
	seen.add(key);
	out.push(e);
};
//#endregion
//#region ../../modules/projects/cwsp-shared/src/cws-client-wire-defaults.ts
var CWSP_WIRE_ARCHETYPE_AIRPAD = "airpad";
/** Wire query value when logical type is exchanger-* (gateway compatibility). */
var CWSP_WIRE_CONNECTION_GATEWAY = "first-order";
function resolveWireArchetype(value) {
	const raw = typeof value === "string" ? value.trim() : "";
	if (raw) return raw;
	return CWSP_WIRE_ARCHETYPE_AIRPAD;
}
function resolveWireConnectionType(value) {
	const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
	if (!raw || raw === "auto") return CWSP_WIRE_CONNECTION_GATEWAY;
	if (raw.includes("exchanger")) return CWSP_WIRE_CONNECTION_GATEWAY;
	return typeof value === "string" ? value.trim() : CWSP_WIRE_CONNECTION_GATEWAY;
}
//#endregion
//#region ../../modules/projects/cwsp-shared/src/airpad-motion-adaptive.ts
/**
* Adaptive AirPad motion rate (IPS / Hz) — client send cadence + desk apply governor.
* Tiers: 60 → 30 when the channel cannot keep pace.
*/
var AIRPAD_MOTION_IPS_TIERS = [60, 30];
var motionIntervalMsForHz = (hz) => Math.max(1, Math.round(1e3 / Math.max(1, hz)));
var motionIntervalMsForIps = motionIntervalMsForHz;
var inferAirpadMotionPathClass = (hint) => {
	const offHome = isOffHomeFleetNetwork(hint.pageHost);
	const gatewayEndpoint = isGatewayHttpsOrigin(hint.endpointUrl) || isGatewayHttpsOrigin(hint.directUrl);
	const routedViaGateway = Boolean(hint.routedDesk) && gatewayEndpoint;
	if (offHome && routedViaGateway) return "wan-wan";
	if (offHome) return "wan";
	return "lan";
};
var initialMotionIpsForPath = (path) => {
	if (path === "lan") return 60;
	return 30;
};
var readPerfNow = () => {
	try {
		const perf = globalThis.performance;
		if (typeof perf?.now === "function") return perf.now();
	} catch {}
	return Date.now();
};
var LAG_SAMPLE_CAP = 10;
var LAG_DOWNGRADE_RATIO = 1.45;
var STABLE_UPGRADE_SAMPLES = 48;
var tierIndexForIps = (ips) => {
	const idx = AIRPAD_MOTION_IPS_TIERS.indexOf(ips);
	return idx >= 0 ? idx : AIRPAD_MOTION_IPS_TIERS.length - 1;
};
var AdaptiveMotionRateController = class {
	pathHint;
	tierIndex = 0;
	lastSendAt = 0;
	lagSamples = [];
	stableSamples = 0;
	constructor(pathHint, initialIps) {
		this.pathHint = pathHint;
		if (initialIps !== void 0) this.tierIndex = tierIndexForIps(initialIps);
		else this.resetTier();
	}
	resetTier() {
		const path = inferAirpadMotionPathClass(this.pathHint());
		this.tierIndex = tierIndexForIps(initialMotionIpsForPath(path));
		this.lastSendAt = 0;
		this.lagSamples = [];
		this.stableSamples = 0;
	}
	setTierByIps(ips) {
		this.tierIndex = tierIndexForIps(ips);
		this.lagSamples = [];
		this.stableSamples = 0;
	}
	getIps() {
		return AIRPAD_MOTION_IPS_TIERS[this.tierIndex];
	}
	/** @deprecated use {@link getIps} */
	getHz() {
		return this.getIps();
	}
	getIntervalMs() {
		return motionIntervalMsForIps(this.getIps());
	}
	isWanMotionPath() {
		return inferAirpadMotionPathClass(this.pathHint()) !== "lan";
	}
	/** Step down when overload is detected (queue depth, arrival flood). */
	forceDowngrade(steps = 1) {
		const next = Math.min(AIRPAD_MOTION_IPS_TIERS.length - 1, this.tierIndex + Math.max(1, steps));
		if (next !== this.tierIndex) {
			this.tierIndex = next;
			this.lagSamples = [];
			this.stableSamples = 0;
		}
	}
	/** Record a completed motion flush — adapt when cadence lags behind target IPS. */
	onMotionSent() {
		const now = readPerfNow();
		const expected = this.getIntervalMs();
		if (this.lastSendAt > 0) {
			const gap = now - this.lastSendAt;
			if (gap > expected * LAG_DOWNGRADE_RATIO) {
				this.lagSamples.push(gap);
				this.stableSamples = 0;
				if (this.lagSamples.length >= LAG_SAMPLE_CAP) {
					if (this.lagSamples.reduce((sum, entry) => sum + entry, 0) / this.lagSamples.length > expected * LAG_DOWNGRADE_RATIO && this.tierIndex < AIRPAD_MOTION_IPS_TIERS.length - 1) this.tierIndex += 1;
					this.lagSamples = [];
				}
			} else if (gap <= expected * 1.15) {
				this.lagSamples = [];
				this.stableSamples += 1;
				if (this.stableSamples >= STABLE_UPGRADE_SAMPLES && this.tierIndex > 0) {
					this.tierIndex -= 1;
					this.stableSamples = 0;
				}
			}
		}
		this.lastSendAt = now;
	}
};
var sharedController = null;
var getAirpadMotionRateController = (pathHint) => {
	if (!sharedController) sharedController = new AdaptiveMotionRateController(pathHint ?? (() => ({})));
	return sharedController;
};
//#endregion
//#region ../../modules/views/airpad-view/src/config/config.ts
var toTrimmedString = (value) => {
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
	return typeof value === "string" ? value.trim() : "";
};
var hasExplicitPort = (value) => {
	const valueTrimmed = value.trim();
	if (!valueTrimmed) return false;
	const hostSpec = valueTrimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0];
	const at = hostSpec.lastIndexOf(":");
	if (at <= 0) return false;
	const port = hostSpec.slice(at + 1);
	return /^\d{1,5}$/.test(port);
};
var appendPort = (value, port) => {
	const valueTrimmed = value.trim();
	if (!valueTrimmed) return "";
	const portTrimmed = port.trim();
	if (!portTrimmed) return valueTrimmed;
	if (hasExplicitPort(valueTrimmed)) return valueTrimmed;
	return `${valueTrimmed}:${portTrimmed}`;
};
var normalizeOriginUrl = (value) => normalizeConnectHostInput(toTrimmedString(value));
var normalizeWireTransport = (value) => {
	const raw = toTrimmedString(value).toLowerCase();
	if (!raw) return void 0;
	if (raw === "ws" || raw === "wss" || raw === "socket" || raw === "socket.io" || raw === "socketio") return "ws";
};
var looksLikeConnectUrl = looksLikeConnectHost;
var normalizeWireNodeId = normalizeWireNodeIdForWire;
var joinUniqueUrls = (...values) => {
	return Array.from(new Set(values.map((entry) => normalizeOriginUrl(entry)).filter(Boolean))).join(", ");
};
/** If AirPad storage says `https://<this-host>:8434` but the app tab is `https://<this-host>/` (443), use tab origin. */
/** Control SPA / markdown hosts — never a CWSP hub `/ws` target. */
var CONTROL_SPA_PAGE_HOSTS = /* @__PURE__ */ new Set([
	"cwsp.u2re.space",
	"www.cwsp.u2re.space",
	"md.u2re.space",
	"www.md.u2re.space"
]);
var isControlSpaHostName = (host) => CONTROL_SPA_PAGE_HOSTS.has(String(host || "").trim().toLowerCase());
var isControlSpaPage = () => {
	try {
		if (String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase().trim() === "cwsp-control") return true;
	} catch {}
	try {
		return isControlSpaHostName(String(globalThis.location?.hostname || ""));
	} catch {
		return false;
	}
};
var urlIsControlSpaOrigin = (urlStr) => {
	const trimmed = toTrimmedString(urlStr);
	if (!trimmed) return false;
	try {
		const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		return isControlSpaHostName(new URL(raw).hostname);
	} catch {
		return /cwsp\.u2re\.space|md\.u2re\.space/i.test(trimmed);
	}
};
/**
* Detect public (non-loopback) tab origins so we can ignore dev-only loopback remote URLs in stored settings.
*/
var isBrowserPublicOrigin = () => {
	if (typeof globalThis.location === "undefined") return false;
	const proto = String(globalThis.location.protocol || "").toLowerCase();
	if (proto === "chrome-extension:" || proto === "moz-extension:" || proto === "safari-web-extension:") return false;
	const h = String(globalThis.location.hostname || "").toLowerCase();
	if (!h || h === "localhost" || h === "127.0.0.1" || h === "[::1]") return false;
	if (/^[a-p]{32}$/.test(h)) return false;
	return true;
};
var urlHostIsLoopback = (urlStr) => {
	const trimmed = toTrimmedString(urlStr);
	if (!trimmed) return false;
	try {
		const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const h = new URL(raw.endsWith("/") ? raw : `${raw.replace(/\/+$/, "")}/`).hostname.toLowerCase();
		return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
	} catch {
		return false;
	}
};
/**
* When the tab is on a real deployed host but every configured remote URL is loopback-only,
* use {@link globalThis.location.origin} at read-time instead so websocket probes reach this deployment.
* Does not rewrite IndexedDB / AirPad localStorage.
*
* INVARIANT: Control SPA (`cwsp.u2re.space`) is not a hub — never rewrite to page origin
* (that produced `wss://cwsp.u2re.space/ws`). Prefer real URLs or WAN gateway fallback.
*/
var sanitizeLoopbackRemoteOnPublicOrigin = (value) => {
	const trimmed = value.trim();
	if (!trimmed || !isBrowserPublicOrigin()) return trimmed;
	const parts = splitConnectHostList(trimmed);
	if (!parts.length) return trimmed;
	const usable = parts.filter((p) => !urlIsControlSpaOrigin(p) && !urlHostIsLoopback(p));
	if (usable.length) return usable.join(", ");
	if (!parts.every((p) => urlHostIsLoopback(p) || urlIsControlSpaOrigin(p))) return trimmed;
	if (isControlSpaPage()) return resolveWanGatewayConnectOrigin("");
	try {
		const origin = normalizeOriginUrl(globalThis.location.origin);
		if (urlIsControlSpaOrigin(origin)) return resolveWanGatewayConnectOrigin("");
		return origin;
	} catch {
		return trimmed;
	}
};
var rewriteEndpointToMatchHttpsTab = (originLike) => {
	const trimmed = toTrimmedString(originLike);
	if (!trimmed || typeof globalThis.location === "undefined" || !globalThis.location.hostname) return trimmed;
	if (urlIsControlSpaOrigin(trimmed) || isControlSpaPage()) return trimmed;
	try {
		const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const u = new URL(raw.endsWith("/") ? raw : `${raw.replace(/\/+$/, "")}/`);
		const tab = globalThis.location;
		if (isControlSpaHostName(u.hostname) || isControlSpaHostName(tab.hostname)) return trimmed;
		if (u.hostname === tab.hostname && u.protocol === "https:" && u.port === "8434" && tab.protocol === "https:" && (tab.port === "" || tab.port === "443")) return normalizeOriginUrl(tab.origin);
	} catch {}
	return trimmed;
};
function loadStoredRemoteConfig() {
	try {
		const raw = globalThis?.localStorage?.getItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		const source = parsed;
		const sourceHost = migrateLegacyCwspPublicPort(toTrimmedString(source.host));
		const sourceTunnelHost = migrateLegacyCwspPublicPort(toTrimmedString(source.tunnelHost));
		const sourcePort = toTrimmedString(source.port);
		if (sourcePort === "8443" || sourcePort === "8343") source.port = "8434";
		parsed.host = sourceHost;
		if (parsed.tunnelHost) parsed.tunnelHost = sourceTunnelHost;
		parsed.endpointUrl = migrateLegacyCwspPublicPort(toTrimmedString(parsed.endpointUrl));
		parsed.directUrl = migrateLegacyCwspPublicPort(toTrimmedString(parsed.directUrl));
		parsed.quickConnectValue = migrateLegacyCwspPublicPort(toTrimmedString(parsed.quickConnectValue));
		if (!(sourcePort !== "" || sourceTunnelHost !== "")) return parsed;
		const hostParts = [];
		const seen = /* @__PURE__ */ new Set();
		const addHostPart = (hostValue) => {
			const normalized = (sourcePort ? appendPort(hostValue, sourcePort) : hostValue).trim();
			if (!normalized || seen.has(normalized)) return;
			seen.add(normalized);
			hostParts.push(normalized);
		};
		if (sourceHost) addHostPart(sourceHost);
		if (sourceTunnelHost) addHostPart(sourceTunnelHost);
		if (!sourceHost && !sourceTunnelHost && sourcePort && location?.hostname) addHostPart(`${location.hostname}:${sourcePort}`);
		return {
			...parsed,
			host: hostParts.join(", "),
			_legacyMigrated: true
		};
	} catch {
		return {};
	}
}
var readGlobalAirpadValue = (keys) => {
	const globalValue = globalThis.AIRPAD_CONFIG;
	for (const key of keys) {
		const direct = globalThis[key];
		if (typeof direct === "string" && direct.trim()) return direct.trim();
		const fromConfig = globalValue && typeof globalValue === "object" && typeof globalValue[key] === "string" ? globalValue[key] : "";
		if (fromConfig.trim()) return String(fromConfig).trim();
	}
	return "";
};
var scrubStaleGuestAirpadIdentity = () => {
	remoteConfig.clientId = sanitizeFleetSelfWireNodeId(remoteConfig.clientId);
	const sanitizedDest = sanitizeFleetRouteTarget(remoteConfig.destinationId, remoteConfig.endpointUrl);
	if (sanitizedDest) remoteConfig.destinationId = sanitizedDest;
	else if (remoteConfig.destinationId && !isAssociableFleetWireNodeId(remoteConfig.destinationId)) remoteConfig.destinationId = "";
};
function persistRemoteConfig() {
	scrubStaleGuestAirpadIdentity();
	try {
		const payload = {
			v: 1,
			quickConnectValue: remoteConfig.quickConnectValue,
			endpointUrl: remoteConfig.endpointUrl,
			directUrl: remoteConfig.directUrl,
			destinationId: remoteConfig.destinationId,
			accessToken: remoteConfig.accessToken,
			clientId: remoteConfig.clientId,
			peerInstanceId: remoteConfig.peerInstanceId,
			identificationToken: remoteConfig.identificationToken.trim() || void 0,
			clientAccessToken: remoteConfig.clientAccessToken.trim() || void 0
		};
		const wireTransport = normalizeWireTransport(remoteConfig.wireTransport);
		if (wireTransport) payload.wireTransport = wireTransport;
		globalThis?.localStorage?.setItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY, JSON.stringify(payload));
	} catch {}
}
var createPeerInstanceId = () => {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	return `ap-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
};
var remoteConfig = {
	quickConnectValue: "",
	endpointUrl: "",
	directUrl: "",
	accessToken: "",
	destinationId: "",
	clientId: "",
	peerInstanceId: "",
	identificationToken: "",
	clientAccessToken: ""
};
/** IndexedDB “Server” tab: userId fallback for AirPad client identity (CWS_ASSOCIATED_*). */
var coreIdentityBridgeUserId = "";
var coreIdentityBridgeUserKey = "";
var coreIdentityUseForAirpad = true;
/** Shell / Capacitor toggles (coordinator + future native bridges). */
var shellRemoteClipboardEnabled = true;
var shellApplyRemoteToDevice = true;
var shellPushLocalClipboard = false;
var shellClipboardPushIntervalMs = 2e3;
var shellClipboardBroadcastTargets = "";
var shellMaintainHubSocket = false;
var shellPreferNativeWebsocket = true;
var shellNativeSmsEnabled = false;
var shellNativeContactsEnabled = true;
var shellAcceptInboundClipboardData = true;
var shellClipboardInboundAllowIds = "";
var shellAccessTokenBypassesClipboardAllowlist = false;
var coreSocketProtocol = "auto";
var coreSocketRouteTarget = "";
var coreSocketSelfId = "";
var coreSocketAccessToken = "";
var coreSocketClientAccessToken = "";
var coreSocketTransportMode = "plaintext";
var coreSocketTransportSecret = "";
var coreSocketConnectionType = "";
var coreSocketArchetype = "";
var remoteHost = "";
var refreshRemoteHost = () => {
	const endpoint = remoteConfig.endpointUrl.trim();
	const direct = remoteConfig.directUrl.trim();
	const rawDest = remoteConfig.destinationId.trim();
	const routeTarget = sanitizeFleetRouteTarget(rawDest, endpoint) || (isAssociableFleetWireNodeId(rawDest) ? normalizeWireNodeId(rawDest) : "");
	const routeTargetIsGateway = isFleetGatewayWireNodeId(routeTarget);
	const routeTargetHost = wireNodeIdToLanHost(routeTarget);
	const directMatchesGatewayTarget = routeTargetIsGateway && (isGatewayHttpsOrigin(direct) || Boolean(routeTargetHost && direct.includes(routeTargetHost)));
	const parts = [];
	if (direct && (!routeTargetIsGateway || directMatchesGatewayTarget)) parts.push(direct);
	const fleetDeskProbe = !routeTargetIsGateway && (shouldFleetDeskGatewayProbeFallbacks(routeTarget, endpoint, direct) || shouldConnectViaFleetGateway(endpoint, routeTarget));
	if (routeTargetIsGateway) {
		for (const gw of resolveFleetGatewayConnectOrigins(globalThis.location?.hostname)) if (!parts.some((entry) => entry.includes(new URL(gw).hostname))) parts.push(gw);
		if (endpoint && !parts.includes(endpoint)) parts.push(endpoint);
	} else if (fleetDeskProbe) {
		const deskWireId = resolveFleetDeskProbeWireNodeId(routeTarget, endpoint, direct);
		const deskOrigin = resolveDeskDirectOriginFromWireNodeId(deskWireId);
		if (deskOrigin && !parts.some((entry) => entry.includes(wireNodeIdToLanHost(deskWireId)))) parts.push(deskOrigin);
		for (const gw of resolveFleetGatewayConnectOrigins(globalThis.location?.hostname)) if (!parts.some((entry) => entry.includes(new URL(gw).hostname))) parts.push(gw);
		if (endpoint && !parts.includes(endpoint)) parts.push(endpoint);
	} else if (endpoint) parts.push(endpoint);
	remoteHost = joinUniqueUrls(...parts);
};
/**
* Apply settings from a stored blob (localStorage shape). Safe to call on tab focus / storage events.
*/
function hydrateFromStored(stored) {
	const legacyHost = toTrimmedString(stored.host);
	const legacyRouteTarget = toTrimmedString(stored.routeTarget);
	const endpointUrl = normalizeOriginUrl(stored.endpointUrl) || (legacyRouteTarget ? normalizeOriginUrl(legacyHost) : "");
	const directUrl = normalizeOriginUrl(stored.directUrl) || (!legacyRouteTarget ? normalizeOriginUrl(legacyHost) : "");
	const quickConnectValue = toTrimmedString(stored.quickConnectValue);
	remoteConfig.endpointUrl = rewriteEndpointToMatchHttpsTab(endpointUrl);
	remoteConfig.directUrl = rewriteEndpointToMatchHttpsTab(directUrl);
	remoteConfig.accessToken = toTrimmedString(stored.accessToken) || toTrimmedString(stored.authToken) || "";
	remoteConfig.quickConnectValue = quickConnectValue || toTrimmedString(stored.destinationId) || legacyRouteTarget || remoteConfig.directUrl;
	remoteConfig.clientId = sanitizeFleetSelfWireNodeId(stored.clientId);
	const rawDestination = toTrimmedString(stored.destinationId) || legacyRouteTarget;
	remoteConfig.destinationId = sanitizeFleetRouteTarget(rawDestination, remoteConfig.endpointUrl) || (isAssociableFleetWireNodeId(rawDestination) ? normalizeWireNodeId(rawDestination) : "");
	const storedPeer = toTrimmedString(stored.peerInstanceId);
	if (storedPeer) remoteConfig.peerInstanceId = storedPeer;
	else if (!remoteConfig.peerInstanceId) remoteConfig.peerInstanceId = createPeerInstanceId();
	remoteConfig.identificationToken = toTrimmedString(stored.identificationToken);
	remoteConfig.clientAccessToken = toTrimmedString(stored.clientAccessToken);
	remoteConfig.wireTransport = normalizeWireTransport(stored.wireTransport);
	refreshRemoteHost();
}
var stored = loadStoredRemoteConfig();
hydrateFromStored(stored);
scrubStaleGuestAirpadIdentity();
if (remoteConfig.clientId || remoteConfig.destinationId) persistRemoteConfig();
/** Re-probe stored origins with explicit ports only (boot must not block on a full port sweep). */
var rediscoverStoredRemoteUrls = async () => {
	if (shouldPreferWanGatewayForAirpad(remoteConfig.endpointUrl)) return;
	const input = {};
	const probeOpts = {
		timeoutMs: 1500,
		maxProbeCandidates: 2
	};
	if (remoteConfig.directUrl.trim() && hasExplicitConnectOrigin(remoteConfig.directUrl.trim())) {
		const next = await resolveConnectHostToOrigin(remoteConfig.directUrl.trim(), probeOpts);
		if (next && next !== remoteConfig.directUrl.trim()) input.directUrl = next;
	}
	if (remoteConfig.endpointUrl.trim() && hasExplicitConnectOrigin(remoteConfig.endpointUrl.trim())) {
		const next = await resolveConnectHostToOrigin(remoteConfig.endpointUrl.trim(), probeOpts);
		if (next && next !== remoteConfig.endpointUrl.trim()) input.endpointUrl = next;
	}
	if (Object.keys(input).length) applyAirpadRemoteConfig(input, { persist: true });
};
rediscoverStoredRemoteUrls();
/** WHY: legacy quick-connect stored `L-192.168.0.110` as destination only — WS had no probe host. */
var repairWireDestinationDirectUrl = async () => {
	if (remoteConfig.directUrl.trim()) return;
	if (shouldPreferWanGatewayForAirpad(remoteConfig.endpointUrl)) return;
	const fromDest = wireNodeIdToBareConnectHost(remoteConfig.destinationId);
	const fromQuick = wireNodeIdToBareConnectHost(remoteConfig.quickConnectValue);
	const bare = fromDest || fromQuick;
	if (!bare) return;
	const origin = inferDirectHttpsOriginFromConnectInput(bare) || await resolveConnectHostToOrigin(bare, {
		timeoutMs: 1500,
		maxProbeCandidates: 2
	});
	if (!origin || origin === remoteConfig.directUrl) return;
	remoteConfig.directUrl = origin;
	if (fromDest) remoteConfig.destinationId = normalizeWireNodeId(remoteConfig.destinationId);
	else if (fromQuick) remoteConfig.destinationId = normalizeWireNodeId(remoteConfig.quickConnectValue);
	refreshRemoteHost();
	persistRemoteConfig();
};
repairWireDestinationDirectUrl();
if (!toTrimmedString(stored.peerInstanceId)) remoteConfig.peerInstanceId = remoteConfig.peerInstanceId || createPeerInstanceId();
var storedAccessToken = toTrimmedString(stored.accessToken);
var storedLegacyAuthToken = toTrimmedString(stored.authToken);
var storedRaw = globalThis?.localStorage?.getItem?.("airpad.remote.connection.v1") ?? "";
if (/(?<![0-9]):8443(?![0-9])|:8343(?![0-9])/.test(storedRaw) || stored._legacyMigrated === true || !stored.peerInstanceId || storedLegacyAuthToken && !storedAccessToken || stored.v !== 1) persistRemoteConfig();
/** Re-read localStorage (e.g. after another tab saved, or before mounting AirPad). */
function reloadAirpadRemoteConfigFromStorage() {
	hydrateFromStored(loadStoredRemoteConfig());
}
/** When another tab updates AirPad settings, refresh in-memory state and crypto caches. */
function attachAirpadCrossTabConfigSync() {
	const onStorage = (e) => {
		if (e.key !== "airpad.remote.connection.v1" || e.newValue == null) return;
		reloadAirpadRemoteConfigFromStorage();
		invalidateAirpadTransportCredentials();
	};
	globalThis.addEventListener?.("storage", onStorage);
	return () => globalThis.removeEventListener?.("storage", onStorage);
}
function applyAirpadRemoteConfig(input, options) {
	if (input.endpointUrl !== void 0) {
		const next = normalizeOriginUrl(input.endpointUrl);
		remoteConfig.endpointUrl = urlIsControlSpaOrigin(next) ? "" : next;
	} else if (input.host !== void 0) {
		const next = normalizeOriginUrl(input.host);
		remoteConfig.endpointUrl = urlIsControlSpaOrigin(next) ? "" : next;
	}
	if (input.directUrl !== void 0) remoteConfig.directUrl = normalizeOriginUrl(input.directUrl);
	if (input.accessToken !== void 0) remoteConfig.accessToken = input.accessToken || "";
	else if (input.authToken !== void 0) remoteConfig.accessToken = input.authToken || "";
	if (input.destinationId !== void 0) remoteConfig.destinationId = sanitizeFleetRouteTarget(input.destinationId, remoteConfig.endpointUrl) || (isAssociableFleetWireNodeId(input.destinationId) ? normalizeWireNodeId(input.destinationId) : "");
	else if (input.routeTarget !== void 0) remoteConfig.destinationId = sanitizeFleetRouteTarget(input.routeTarget, remoteConfig.endpointUrl) || (isAssociableFleetWireNodeId(input.routeTarget) ? normalizeWireNodeId(input.routeTarget) : "");
	if (input.clientId !== void 0) remoteConfig.clientId = sanitizeFleetSelfWireNodeId(input.clientId);
	if (input.identificationToken !== void 0) remoteConfig.identificationToken = (input.identificationToken || "").trim();
	if (input.clientAccessToken !== void 0) remoteConfig.clientAccessToken = (input.clientAccessToken || "").trim();
	const wireTransport = normalizeWireTransport(input.wireTransport);
	if (wireTransport) remoteConfig.wireTransport = wireTransport;
	refreshRemoteHost();
	if (options?.persist !== false) persistRemoteConfig();
}
/**
* Project Settings → AirPad `localStorage` ({@link AIRPAD_REMOTE_CONFIG_STORAGE_KEY}) + in-memory remoteConfig.
* Call after Save on Capacitor/native so NS `/ws` can read the same blob.
*/
function syncAirpadRemoteConfigFromAppSettings(settings, options) {
	const blob = appSettingsToRemoteConnectionV1(settings);
	const input = {};
	if ((() => {
		try {
			const id = globalThis.chrome?.runtime?.id;
			return typeof id === "string" && id.length > 0;
		} catch {
			return false;
		}
	})()) input.endpointUrl = String(settings.shell?.localHubUrl || "").trim() || "https://127.0.0.1:8434/";
	else if (blob.endpointUrl && !urlIsControlSpaOrigin(blob.endpointUrl)) input.endpointUrl = blob.endpointUrl;
	if (blob.directUrl) input.directUrl = blob.directUrl;
	if (blob.quickConnectValue) input.quickConnectValue = blob.quickConnectValue;
	if (blob.destinationId || blob.routeTarget) {
		const dest = blob.destinationId || blob.routeTarget;
		const sanitized = sanitizeFleetRouteTarget(dest, blob.endpointUrl);
		if (sanitized) input.destinationId = sanitized;
		else if (isAssociableFleetWireNodeId(dest)) input.destinationId = normalizeWireNodeId(dest);
	}
	if (blob.accessToken || blob.authToken) input.accessToken = blob.accessToken || blob.authToken;
	if (blob.clientId) input.clientId = sanitizeFleetSelfWireNodeId(blob.clientId) || void 0;
	if (blob.peerInstanceId) input.peerInstanceId = blob.peerInstanceId;
	if (blob.identificationToken) input.identificationToken = blob.identificationToken;
	if (blob.clientAccessToken) input.clientAccessToken = blob.clientAccessToken;
	if (blob.wireTransport) input.wireTransport = blob.wireTransport;
	if (Boolean(input.endpointUrl || input.directUrl || input.quickConnectValue || input.destinationId || input.accessToken || input.clientId || input.peerInstanceId || input.identificationToken || input.clientAccessToken)) applyAirpadRemoteConfig(input, { persist: options?.persist ?? true });
}
var endpointUrlToAirpadConnectHost = (endpointUrl) => {
	try {
		const u = new URL(endpointUrl);
		return `${u.protocol}//${u.host}`;
	} catch {
		return "";
	}
};
/**
* Apply CrossWord AppSettings shell + identity overlay (call after load/save settings and on boot).
* Does not clear AirPad localStorage fields; only updates in-memory host/route when shell requests it.
*/
function applyAirpadRuntimeFromAppSettings(settings) {
	const core = settings.core;
	const shell = settings.shell;
	const socket = core?.socket;
	const interop = core?.interop;
	coreIdentityBridgeUserId = sanitizeFleetSelfWireNodeId(core?.userId) || "";
	coreIdentityBridgeUserKey = String(core?.ecosystemToken || core?.userKey || core?.socket?.accessToken || "").trim();
	coreIdentityUseForAirpad = (core?.useCoreIdentityForAirPad ?? true) !== false;
	shellRemoteClipboardEnabled = (shell?.enableRemoteClipboardBridge ?? true) !== false;
	shellApplyRemoteToDevice = (shell?.applyRemoteClipboardToDevice ?? true) !== false;
	shellPushLocalClipboard = Boolean(shell?.pushLocalClipboardToLan);
	const intervalRaw = Number(shell?.clipboardPushIntervalMs);
	shellClipboardPushIntervalMs = Number.isFinite(intervalRaw) && intervalRaw >= 800 ? Math.min(Math.round(intervalRaw), 6e4) : 2e3;
	shellClipboardBroadcastTargets = (shell?.clipboardBroadcastTargets || "").trim();
	/** Default off; enable in Settings when background clipboard/hub sync is needed. */
	shellMaintainHubSocket = shell?.maintainHubSocketConnection === true;
	shellPreferNativeWebsocket = (shell?.preferNativeWebsocket ?? interop?.preferNativeWebsocket ?? true) !== false;
	shellNativeSmsEnabled = (shell?.enableNativeSms ?? false) === true;
	shellNativeContactsEnabled = (shell?.enableNativeContacts ?? true) !== false;
	shellAcceptInboundClipboardData = (shell?.acceptInboundClipboardData ?? true) !== false;
	shellClipboardInboundAllowIds = (shell?.clipboardInboundAllowIds || "").trim();
	(shell?.clipboardShareDestinationIds || "").trim();
	shellAccessTokenBypassesClipboardAllowlist = (shell?.accessTokenBypassesClipboardAllowlist ?? false) === true;
	shell?.acceptContactsBridgeData;
	shell?.acceptSmsBridgeData;
	coreSocketProtocol = socket?.protocol === "http" || socket?.protocol === "https" ? socket.protocol : "auto";
	const routeRaw = (socket?.routeTarget || "").trim();
	coreSocketRouteTarget = sanitizeFleetRouteTarget(routeRaw, core?.endpointUrl) || (isAssociableFleetWireNodeId(routeRaw) ? normalizeWireNodeId(routeRaw) : "");
	coreSocketSelfId = sanitizeFleetSelfWireNodeId(socket?.selfId) || "";
	if (coreIdentityBridgeUserId && coreSocketSelfId && coreSocketSelfId !== coreIdentityBridgeUserId) coreSocketSelfId = "";
	coreSocketAccessToken = (socket?.accessToken || socket?.airpadAuthToken || "").trim();
	coreSocketClientAccessToken = (socket?.clientAccessToken || "").trim();
	coreSocketTransportMode = socket?.transportMode === "secure" ? "secure" : "plaintext";
	coreSocketTransportSecret = (socket?.transportSecret || "").trim();
	(socket?.signingSecret || "").trim();
	coreSocketConnectionType = (socket?.connectionType || "").trim();
	coreSocketArchetype = (socket?.archetype || "").trim();
	(socket?.protocolLanesJson || "").trim();
	const input = {};
	const wireUrl = (() => {
		try {
			const id = globalThis.chrome?.runtime?.id;
			return typeof id === "string" && id.length > 0;
		} catch {
			return false;
		}
	})() ? String(shell?.localHubUrl || "").trim() || "https://127.0.0.1:8434/" : String(core?.endpointUrl || "").trim();
	if (wireUrl) {
		const origin = endpointUrlToAirpadConnectHost(rewriteEndpointToMatchHttpsTab(wireUrl));
		if (origin) input.endpointUrl = origin;
	}
	if (Object.keys(input).length) applyAirpadRemoteConfig(input, { persist: false });
	syncAirpadRemoteConfigFromAppSettings(settings, { persist: false });
	try {
		globalThis.__CWS_SHELL_FEATURES__ = {
			clipboardBridge: shellRemoteClipboardEnabled,
			applyRemoteClipboard: shellApplyRemoteToDevice,
			pushLocalClipboard: shellPushLocalClipboard,
			maintainHubSocket: shellMaintainHubSocket,
			preferNativeWebsocket: shellPreferNativeWebsocket,
			sms: shellNativeSmsEnabled,
			contacts: shellNativeContactsEnabled
		};
	} catch {}
}
function getClipboardBroadcastTargetEntries() {
	const fromExplicit = parseWireTargetList(shellClipboardBroadcastTargets);
	if (fromExplicit.length) return fromExplicit;
	const route = getRemoteRouteTarget().trim();
	if (route) return parseWireTargetList(route);
	if (isDesktopCwspShell()) return parseWireTargetList("*");
	return [];
}
/** True for Neutralino / WebNative desktop shells (not Capacitor/PWA-only). */
function isDesktopCwspShell() {
	try {
		const g = globalThis;
		if (g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__) return true;
		if (g.__NEUTRALINO_AUTH__ || g.Neutralino || typeof g.NL_OS === "string") return true;
	} catch {}
	return false;
}
/**
* Neutralino / WebNative Win/Linux: Node clipboard-hub owns LAN sync.
* INVARIANT: WebView must not push/apply remote clipboard when this is true.
*/
function isNeutralinoNodeClipboardHubOwned() {
	try {
		const g = globalThis;
		try {
			const host = String(location.hostname || "");
			if (location.protocol === "https:" && host !== "localhost" && host !== "127.0.0.1" && !g.Neutralino && typeof g.NL_OS !== "string") return false;
		} catch {}
		if (g.__CWS_NODE_CLIPBOARD_HUB__ === false) return false;
		if (g.__CWS_NODE_CLIPBOARD_HUB__ === true) return true;
		if (g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__ || g.Neutralino || typeof g.NL_OS === "string") return true;
	} catch {}
	return false;
}
function isShellRemoteClipboardBridgeEnabled() {
	return shellRemoteClipboardEnabled !== false;
}
function isApplyRemoteClipboardToDeviceEnabled() {
	if (isNeutralinoNodeClipboardHubOwned()) return false;
	return shellApplyRemoteToDevice !== false;
}
function isPushLocalClipboardToLanEnabled() {
	if (isNeutralinoNodeClipboardHubOwned()) return false;
	if (shellPushLocalClipboard === true) return true;
	return false;
}
function getClipboardPushIntervalMs() {
	return shellClipboardPushIntervalMs;
}
/** Parsed outbound clipboard entries including optional per-id access tokens. */
function getClipboardBroadcastWireTargets() {
	return getClipboardBroadcastTargetEntries();
}
/** When false, ignore inbound clipboard payloads (coordinator still may run for other ops). */
function isShellClipboardInboundEnabled() {
	return shellAcceptInboundClipboardData !== false;
}
/** True when access token bypass of inbound allow list is enabled and a token is configured. */
function shouldBypassClipboardInboundAllowlistWithAccessToken() {
	return shellAccessTokenBypassesClipboardAllowlist && Boolean(getAccessToken().trim());
}
/** COMPAT: `L-110` ≡ `L-192.168.0.110` (prefer short fleet form for allowlist compare). */
function normalizeClipboardPeerId(value) {
	const raw = value.trim();
	if (!raw) return "";
	const short = toShortFleetWireNodeId(raw);
	if (short) return short.toLowerCase();
	const normalized = normalizeWireNodeIdForWire(raw);
	if (normalized) return normalized.toLowerCase();
	if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(raw)) return `l-${raw}`.toLowerCase();
	return raw.toLowerCase();
}
/**
* Keep `/ws` up for inbound/outbound clipboard outside the AirPad/Network view.
* Capacitor Android only — Neutralino clipboard hub lives in Node.
*/
function isClipboardHubBootstrapEnabled() {
	if (isNeutralinoNodeClipboardHubOwned()) return false;
	try {
		if (isDesktopCwspShell()) return isShellRemoteClipboardBridgeEnabled() && isApplyRemoteClipboardToDeviceEnabled();
		const c = globalThis.Capacitor;
		if (!(typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform()))) return false;
	} catch {
		return false;
	}
	return isShellRemoteClipboardBridgeEnabled() && isApplyRemoteClipboardToDeviceEnabled();
}
/**
* Inbound clipboard from `senderId` (peer / device id on the wire). Respects allow list unless bypassed by access token.
*/
function isClipboardSenderAllowedForInbound(senderId) {
	if (!isShellClipboardInboundEnabled()) return false;
	if (!isShellRemoteClipboardBridgeEnabled()) return false;
	if (shouldBypassClipboardInboundAllowlistWithAccessToken()) return true;
	const allow = parseWireTargetList(shellClipboardInboundAllowIds);
	if (!allow.length) return true;
	const s = String(senderId || "").trim();
	if (!s) return false;
	return allow.some((e) => fleetWireNodeIdsEquivalent(e.nodeId, s) || normalizeClipboardPeerId(e.nodeId) === normalizeClipboardPeerId(s));
}
/** Background WebSocket to cwsp / endpoint hub (any shell, not only AirPad view). */
function isMaintainHubSocketConnectionEnabled() {
	return shellMaintainHubSocket === true;
}
function isPreferNativeWebsocketEnabled() {
	return shellPreferNativeWebsocket !== false;
}
function getRemoteHost() {
	const sanitized = sanitizeLoopbackRemoteOnPublicOrigin(remoteHost);
	const endpoint = remoteConfig.endpointUrl.trim() || normalizeOriginUrl(readGlobalAirpadValue(["AIRPAD_ENDPOINT_URL"]));
	getRemoteRouteTarget().trim();
	if (shouldPreferWanGatewayForAirpad(endpoint)) return resolveWanGatewayConnectOrigin(endpoint);
	if (!sanitized || urlIsControlSpaOrigin(sanitized)) {
		if (endpoint && !urlIsControlSpaOrigin(endpoint) && !urlHostIsLoopback(endpoint)) return endpoint;
		if (isControlSpaPage() || isBrowserPublicOrigin()) return resolveWanGatewayConnectOrigin(endpoint);
		return "";
	}
	return sanitized;
}
function getAirPadEndpointUrl() {
	if (remoteConfig.endpointUrl.trim()) return remoteConfig.endpointUrl.trim();
	const fromGlobal = normalizeOriginUrl(readGlobalAirpadValue(["AIRPAD_ENDPOINT_URL"]));
	if (fromGlobal) return fromGlobal;
	if (isOffHomeFleetNetwork()) return resolveWanGatewayConnectOrigin("");
	return "";
}
function getAirPadDirectTargetUrl() {
	return remoteConfig.directUrl.trim();
}
/**
* Quick-connect value shown in the AirPad popup (plus optional auth pass field).
* Prefer an explicit target device id first, otherwise show the current direct/url target.
*/
function getAirPadQuickConnectTarget() {
	if (remoteConfig.quickConnectValue.trim()) return remoteConfig.quickConnectValue.trim();
	if (remoteConfig.destinationId.trim()) return remoteConfig.destinationId.trim();
	if (remoteConfig.directUrl.trim()) return remoteConfig.directUrl.trim();
	if (coreSocketRouteTarget.trim()) return coreSocketRouteTarget.trim();
	return getAirPadEndpointUrl();
}
/**
* Quick-connect accepts either a target device id (routed through the Server-tab
* endpoint URL) or a direct host/IP/domain (port auto-discovered when omitted).
*/
async function setAirPadQuickConnectTarget(value, opts = {}) {
	const trimmed = toTrimmedString(value);
	remoteConfig.quickConnectValue = trimmed;
	if (!trimmed) {
		remoteConfig.directUrl = "";
		remoteConfig.destinationId = "";
		refreshRemoteHost();
		persistRemoteConfig();
		return;
	}
	const probeOpts = {
		timeoutMs: opts.probeTimeoutMs ?? 1200,
		maxProbeCandidates: opts.maxProbeCandidates
	};
	const wireBare = wireNodeIdToBareConnectHost(trimmed);
	if (looksLikeConnectUrl(trimmed)) {
		const inferred = inferDirectHttpsOriginFromConnectInput(trimmed);
		if (opts.discover === false) remoteConfig.directUrl = inferred || normalizeConnectHostInput(trimmed);
		else remoteConfig.directUrl = await resolveConnectHostToOrigin(trimmed, {
			discover: true,
			...probeOpts
		}) || inferred || normalizeConnectHostInput(trimmed);
		remoteConfig.destinationId = inferControlNodeIdFromUrl(remoteConfig.directUrl) || (isGatewayHttpsOrigin(trimmed) ? "L-200" : "");
	} else if (wireBare) {
		const inferred = inferDirectHttpsOriginFromConnectInput(wireBare);
		if (opts.discover === false) remoteConfig.directUrl = inferred || normalizeConnectHostInput(wireBare);
		else remoteConfig.directUrl = inferred || await resolveConnectHostToOrigin(wireBare, {
			discover: true,
			...probeOpts
		}) || normalizeConnectHostInput(wireBare);
		remoteConfig.destinationId = sanitizeFleetRouteTarget(trimmed, remoteConfig.endpointUrl) || (isExplicitFleetGatewayTarget(trimmed) ? "L-200" : "") || (isAssociableFleetWireNodeId(trimmed) ? normalizeWireNodeId(trimmed) : "L-110");
	} else {
		remoteConfig.destinationId = sanitizeFleetRouteTarget(trimmed, remoteConfig.endpointUrl) || (isAssociableFleetWireNodeId(trimmed) ? normalizeWireNodeId(trimmed) : "");
		remoteConfig.directUrl = "";
	}
	refreshRemoteHost();
	persistRemoteConfig();
}
/** Push AirPad popup settings into CWSAndroid prefs + trigger native {@code CwspRuntime.reloadSettings}. */
async function syncAirpadRemoteConfigToNativeShell() {
	const NATIVE_SYNC_TIMEOUT_MS = 6e3;
	try {
		if (!isCapacitorCwsNativeShell()) return { ok: true };
		const nativeExtras = appSettingsShellToNativeExtras({
			endpointUrl: remoteConfig.endpointUrl,
			directUrl: remoteConfig.directUrl,
			quickConnectValue: remoteConfig.quickConnectValue,
			destinationId: remoteConfig.destinationId,
			accessToken: remoteConfig.accessToken,
			identificationToken: remoteConfig.identificationToken,
			clientAccessToken: remoteConfig.clientAccessToken,
			clientId: remoteConfig.clientId,
			peerInstanceId: remoteConfig.peerInstanceId,
			wireTransport: "ws"
		});
		return await withTimeout(patchNativeUnifiedSettingsDetailed({ core: {
			endpointUrl: remoteConfig.endpointUrl || void 0,
			ops: { directUrl: remoteConfig.directUrl || void 0 },
			network: { quickConnect: remoteConfig.quickConnectValue || void 0 },
			socket: {
				routeTarget: remoteConfig.destinationId || void 0,
				accessToken: remoteConfig.accessToken || void 0,
				selfId: remoteConfig.clientId || void 0,
				clientAccessToken: remoteConfig.clientAccessToken || void 0
			},
			userKey: remoteConfig.identificationToken || void 0,
			appClientId: remoteConfig.peerInstanceId || void 0,
			...nativeExtras
		} }), NATIVE_SYNC_TIMEOUT_MS, "native settings sync timed out").catch((error) => ({
			ok: false,
			error: String(error instanceof Error ? error.message : error)
		}));
	} catch (error) {
		return {
			ok: false,
			error: String(error instanceof Error ? error.message : error)
		};
	}
}
function getRemoteProtocol() {
	return coreSocketProtocol;
}
/** Infer canonical peer id (e.g. `L-192.168.0.110`) from a direct connect URL/host. */
var inferControlNodeIdFromUrl = (value) => {
	const normalized = normalizeOriginUrl(value);
	if (!normalized) return "";
	let nodeId = "";
	try {
		const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
		const host = new URL(withScheme).hostname.trim();
		if (host) nodeId = /^L-/i.test(host) ? host : `L-${host}`;
	} catch {
		const bare = normalized.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0]?.split(":")[0]?.trim() || "";
		if (bare) nodeId = /^L-/i.test(bare) ? bare : `L-${bare}`;
	}
	if (isFleetGatewayWireNodeId(nodeId)) return FLEET_GATEWAY_WIRE_NODE_ID;
	if (isAssociableFleetWireNodeId(nodeId)) return normalizeWireNodeId(nodeId);
	if (isGatewayHttpsOrigin(value)) return FLEET_GATEWAY_WIRE_NODE_ID;
	return "";
};
var isGatewayWireNode = (value) => {
	const normalized = normalizeWireNodeId(value).toLowerCase();
	return normalized === "l-192.168.0.200" || normalized === "l-45.147.121.152" || normalized.includes("gateway");
};
/**
* Coordinator routing target for mouse/keyboard/clipboard acts and handshake hints.
* Empty string means "execute on the peer we are socket-connected to" (direct mode).
*/
function getRemoteRouteTarget() {
	if (remoteConfig.destinationId.trim()) {
		const sanitized = sanitizeFleetRouteTarget(remoteConfig.destinationId, remoteConfig.endpointUrl);
		if (sanitized) return sanitized;
		if (isAssociableFleetWireNodeId(remoteConfig.destinationId)) return remoteConfig.destinationId.trim();
	}
	const endpoint = remoteConfig.endpointUrl.trim();
	const quick = remoteConfig.quickConnectValue.trim();
	if (quick) {
		const sanitized = sanitizeFleetRouteTarget(quick, endpoint);
		if (sanitized) return sanitized;
		if (isGatewayHttpsOrigin(quick)) return FLEET_GATEWAY_WIRE_NODE_ID;
		if (isAssociableFleetWireNodeId(quick)) return normalizeWireNodeId(quick);
	}
	const direct = remoteConfig.directUrl.trim();
	if (direct) {
		if (isGatewayHttpsOrigin(direct)) return FLEET_GATEWAY_WIRE_NODE_ID;
		const inferred = inferControlNodeIdFromUrl(direct);
		if (inferred) return inferred;
		if (endpoint && isGatewayHttpsOrigin(endpoint)) return DEFAULT_DESK_WIRE_NODE_ID;
		return "";
	}
	const fromCore = coreSocketRouteTarget.trim();
	if (fromCore) {
		if (isFleetGatewayWireNodeId(fromCore)) return normalizeWireNodeId(fromCore);
		if (!isGatewayWireNode(fromCore)) return fromCore;
	}
	if (endpoint && isGatewayHttpsOrigin(endpoint)) {
		if (isFleetDeskWireNodeId(fromCore)) return normalizeWireNodeId(fromCore);
		if (isFleetGatewayWireNodeId(fromCore)) return FLEET_GATEWAY_WIRE_NODE_ID;
		return DEFAULT_DESK_WIRE_NODE_ID;
	}
	return fromCore || "";
}
function getAirPadDestinationId() {
	return getRemoteRouteTarget();
}
function getAirPadTransportMode() {
	return coreSocketTransportMode;
}
/** Resolved access / control token (local overlay, settings, then env globals). */
function getAccessToken() {
	const local = (remoteConfig.accessToken || "").trim();
	if (local) return local;
	if (coreSocketAccessToken.trim()) return coreSocketAccessToken.trim();
	if (coreIdentityBridgeUserKey.trim()) return coreIdentityBridgeUserKey.trim();
	return readGlobalAirpadValue([
		"CWS_ACCESS_TOKEN",
		"CWS_ASSOCIATED_TOKEN",
		"ACCESS_TOKEN",
		"AIRPAD_AUTH_TOKEN",
		"AIRPAD_TOKEN",
		"CWS_AUTH_TOKEN",
		"HUB_AUTH_TOKEN",
		"MASTER_AUTH_TOKEN",
		"CONTROL_TOKEN",
		"ADMIN_TOKEN"
	]);
}
function setAccessToken(token) {
	remoteConfig.accessToken = token || "";
	persistRemoteConfig();
}
function getAirPadClientId() {
	const candidates = [
		coreIdentityUseForAirpad ? coreIdentityBridgeUserId.trim() : "",
		coreSocketSelfId.trim(),
		remoteConfig.clientId.trim(),
		readGlobalAirpadValue(["AIRPAD_CLIENT_ID", "AIRPAD_CLIENT"])
	];
	for (const entry of candidates) {
		const sanitized = sanitizeFleetSelfWireNodeId(entry);
		if (sanitized) return sanitized;
	}
	return "";
}
function getAssociatedClientToken() {
	return coreIdentityBridgeUserKey.trim();
}
/** Optional future-facing access token when this client acts as an inbound WS / reverse-server peer. */
function getClientAccessToken() {
	const local = coreSocketClientAccessToken.trim();
	if (local) return local;
	const fromRemote = remoteConfig.clientAccessToken.trim();
	if (fromRemote) return fromRemote;
	return readGlobalAirpadValue(["CWS_CLIENT_ACCESS_TOKEN", "CLIENT_ACCESS_TOKEN"]);
}
function getAirPadPeerInstanceId() {
	const env = readGlobalAirpadValue(["AIRPAD_PEER_INSTANCE_ID", "AIRPAD_DEVICE_ID"]);
	if (env.trim()) return env.trim();
	return remoteConfig.peerInstanceId || "";
}
function getAirPadTransportSecret() {
	return coreSocketTransportSecret;
}
/** Handshake `connectionType` before gateway `first-order` normalization (Settings → env → default). */
function getAirPadHandshakeConnectionType() {
	const fromSettings = coreSocketConnectionType.trim();
	if (fromSettings) return resolveWireConnectionType(fromSettings);
	return resolveWireConnectionType(readGlobalAirpadValue(["CWS_CONNECTION_TYPE", "AIRPAD_CONNECTION_TYPE"]));
}
/** Handshake `archetype` (Settings → env → default). */
function getAirPadHandshakeArchetype() {
	const fromSettings = coreSocketArchetype.trim();
	if (fromSettings) return resolveWireArchetype(fromSettings);
	return resolveWireArchetype(readGlobalAirpadValue(["CWS_ARCHETYPE", "AIRPAD_ARCHETYPE"]));
}
var GYRO_DEADZONE = .001;
var GYRO_SMOOTH = .3;
var GYRO_MAX_SAMPLE_COUNT = 1e3;
var GYRO_ROTATION_GAIN = .9;
motionIntervalMsForHz(30);
var MOTION_JITTER_EPS = .001;
var airpadMotionPathHint = () => ({
	endpointUrl: remoteConfig.endpointUrl,
	directUrl: remoteConfig.directUrl,
	pageHost: typeof globalThis !== "undefined" && globalThis.location ? globalThis.location.hostname : "",
	routedDesk: Boolean(getRemoteRouteTarget().trim())
});
var motionRateController = getAirpadMotionRateController(airpadMotionPathHint);
/** Adaptive motion flush interval (60 → 30 Hz on WAN/gateway lag). */
var getMotionSendIntervalMs = () => motionRateController.getIntervalMs();
var getMotionSendHz = () => motionRateController.getHz();
var getMotionPathClass = () => inferAirpadMotionPathClass(airpadMotionPathHint());
var recordMotionSendSample = () => motionRateController.onMotionSent();
/** Recompute tier after endpoint / route changes (before reconnect). */
var refreshMotionSendRateFromConfig = () => {
	motionRateController.resetTier();
};
var ACCELEROMETER_DEADZONE = .1;
var ACCELEROMETER_SMOOTH = .2;
var ACCELEROMETER_MAX_SAMPLE_COUNT = 1e3;
var REL_ORIENT_DEADZONE = .001;
var REL_ORIENT_SMOOTH = .55;
//#endregion
export { getMotionSendIntervalMs as A, isPushLocalClipboardToLanEnabled as B, getAirPadTransportSecret as C, getClipboardPushIntervalMs as D, getClipboardBroadcastWireTargets as E, isClipboardHubBootstrapEnabled as F, setAccessToken as G, recordMotionSendSample as H, isClipboardSenderAllowedForInbound as I, syncAirpadRemoteConfigToNativeShell as J, setAirPadQuickConnectTarget as K, isMaintainHubSocketConnectionEnabled as L, getRemoteProtocol as M, getRemoteRouteTarget as N, getMotionPathClass as O, isApplyRemoteClipboardToDeviceEnabled as P, isNeutralinoNodeClipboardHubOwned as R, getAirPadTransportMode as S, getClientAccessToken as T, refreshMotionSendRateFromConfig as U, isShellRemoteClipboardBridgeEnabled as V, reloadAirpadRemoteConfigFromStorage as W, getAirPadEndpointUrl as _, GYRO_MAX_SAMPLE_COUNT as a, getAirPadPeerInstanceId as b, MOTION_JITTER_EPS as c, applyAirpadRuntimeFromAppSettings as d, attachAirpadCrossTabConfigSync as f, getAirPadDirectTargetUrl as g, getAirPadDestinationId as h, GYRO_DEADZONE as i, getRemoteHost as j, getMotionSendHz as k, REL_ORIENT_DEADZONE as l, getAirPadClientId as m, ACCELEROMETER_MAX_SAMPLE_COUNT as n, GYRO_ROTATION_GAIN as o, getAccessToken as p, syncAirpadRemoteConfigFromAppSettings as q, ACCELEROMETER_SMOOTH as r, GYRO_SMOOTH as s, ACCELEROMETER_DEADZONE as t, REL_ORIENT_SMOOTH as u, getAirPadHandshakeArchetype as v, getAssociatedClientToken as w, getAirPadQuickConnectTarget as x, getAirPadHandshakeConnectionType as y, isPreferNativeWebsocketEnabled as z };
