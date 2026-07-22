import { n as __exportAll } from "./rolldown-runtime.js";
//#region ../../modules/projects/cwsp-shared/src/multi-value-list.ts
/**
* Split multi-id / multi-host settings fields on comma, semicolon, or whitespace
* (space, tab, newline). Used by Settings, AirPad, and Java CWSP prefs parity.
*/
var MULTI_VALUE_SPLIT_RE = /[,;\s]+/;
/** Split a scalar list field into trimmed non-empty tokens (dedupe optional). */
var splitMultiValueList = (value) => {
	if (value == null) return [];
	if (Array.isArray(value)) return value.flatMap((item) => splitMultiValueList(item));
	const raw = String(value).trim();
	if (!raw) return [];
	return raw.split(MULTI_VALUE_SPLIT_RE).map((s) => s.trim()).filter(Boolean);
};
//#endregion
//#region ../../modules/projects/cwsp-shared/src/cwsp-endpoint-resolve.ts
/**
* CWSP endpoint host parsing + port discovery.
*
* WHY: AirPad / CWSAndroid / settings should accept bare IP or domain (no `https://`,
* no port). When the port is omitted we probe common HTTPS/HTTP ports via `/lna-probe`.
*/
var CWSP_DEFAULT_HTTPS_PORTS = [
	8434,
	9443,
	7443,
	8444,
	8445,
	18443
];
var CWSP_DEFAULT_HTTP_PORTS = [
	8080,
	8081,
	8082,
	18080,
	80,
	8888
];
var trim = (value) => typeof value === "string" ? value.trim() : "";
var isLikelyPort = (value) => /^\d{1,5}$/.test(value);
var stripProtocol = (value) => trim(value).replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0];
var looksLikeConnectHost = (value) => {
	const t = trim(value);
	if (!t) return false;
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(t)) return true;
	if (t.startsWith("localhost")) return true;
	if (t.includes("/")) return true;
	if (/^\[[0-9a-f:]+\](?::\d{1,5})?$/i.test(t)) return true;
	if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?$/.test(t)) return true;
	if (/^[^.\s:]+:\d{1,5}$/.test(t)) return true;
	if (/^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d{1,5})?$/i.test(t)) return true;
	return false;
};
/** Parse user input into host / optional port / optional protocol. */
var parseConnectHostInput = (raw) => {
	const trimmed = trim(raw);
	if (!trimmed) return null;
	let protocol;
	let hostSpec = trimmed;
	const protoMatch = trimmed.match(/^([a-z][a-z0-9+.-]*):\/\//i);
	if (protoMatch) {
		const p = protoMatch[1].toLowerCase();
		if (p === "http" || p === "https") protocol = p;
		hostSpec = stripProtocol(trimmed);
	}
	hostSpec = hostSpec.split("/")[0]?.trim() || "";
	if (!hostSpec) return null;
	const at = hostSpec.lastIndexOf(":");
	if (at > 0) {
		const host = hostSpec.slice(0, at).trim();
		const port = hostSpec.slice(at + 1).trim();
		if (host && isLikelyPort(port)) return {
			raw: trimmed,
			host,
			port,
			protocol
		};
	}
	return {
		raw: trimmed,
		host: hostSpec,
		protocol
	};
};
/** Normalize to `protocol://host:port/` when port or protocol is known; otherwise return bare host. */
var normalizeConnectHostInput = (raw) => {
	const parsed = parseConnectHostInput(raw);
	if (!parsed) return "";
	const { host, port, protocol } = parsed;
	if (!host) return "";
	if (port) return `${protocol || (CWSP_DEFAULT_HTTPS_PORTS.some((p) => String(p) === port) ? "https" : CWSP_DEFAULT_HTTP_PORTS.some((p) => String(p) === port) ? "http" : "https")}://${host}:${port}/`;
	if (protocol) return `${protocol}://${host}/`;
	return host;
};
var originFromParts = (protocol, host, port) => `${protocol}://${host}:${port}/`;
/**
* Last-resort fleet WAN gateway host (historical VPS IP).
* WHY: Prefer relay/hub/endpoint from settings or env; keep this only as fallback.
*/
var CWSP_FLEET_WAN_GATEWAY_HOST_FALLBACK = "45.147.121.152";
/** Home-fleet LAN gateway host (`.200`). */
var CWSP_FLEET_LAN_GATEWAY_HOST = "192.168.0.200";
var CWSP_FLEET_LAN_GATEWAY_HTTPS = `https://${CWSP_FLEET_LAN_GATEWAY_HOST}:8434`;
var CWSP_FLEET_WAN_GATEWAY_HTTPS_FALLBACK = `https://${CWSP_FLEET_WAN_GATEWAY_HOST_FALLBACK}:8434`;
/** Fleet gateway HTTPS ingress when the configured WAN host is unreachable (RKN / routing). */
var CWSP_FLEET_GATEWAY_HTTPS_FALLBACKS = [`${CWSP_FLEET_LAN_GATEWAY_HTTPS}/`, `${CWSP_FLEET_WAN_GATEWAY_HTTPS_FALLBACK}/`];
var readProcessEnv = (...keys) => {
	try {
		const env = globalThis.process?.env;
		if (!env) return "";
		for (const key of keys) {
			const v = String(env[key] || "").trim();
			if (v) return v;
		}
	} catch {}
	return "";
};
/** Hostname from an HTTPS(S) origin/URL; empty when unparsable. */
var hostFromHttpsOrigin = (raw) => {
	const origin = normalizeProbeHttpsOrigin(String(raw ?? ""));
	if (!origin) return "";
	try {
		const withProto = /:\/\//.test(origin) ? origin : `https://${origin}`;
		return new URL(withProto).hostname.toLowerCase();
	} catch {
		return "";
	}
};
var isFleetLanGatewayHost = (host) => {
	const h = String(host ?? "").trim().toLowerCase();
	return h === "192.168.0.200" || h === "l-192.168.0.200" || h === "l-200";
};
/**
* Resolve WAN gateway HTTPS base (no trailing slash).
* Order: settings/env relay·hub·endpoint (non-LAN) → historical WAN IP fallback.
*/
var resolveFleetWanGatewayHttpsBase = (input = {}) => {
	const envWan = readProcessEnv("CWS_FILES_PUBLIC_WAN_BASE_URL", "CWS_GATEWAY_WAN_BASE_URL", "CWSP_GATEWAY_WAN_URL", "CWS_RELAY_HTTPS_URL", "CWSP_RELAY_HTTPS_URL");
	const preferred = [
		input.wanBaseUrl,
		envWan,
		input.relay,
		input.hubUrl,
		input.endpointUrl,
		input.remoteHost,
		...input.extras ?? []
	];
	for (const raw of preferred) {
		const origin = normalizeProbeHttpsOrigin(String(raw ?? ""));
		if (!origin) continue;
		const host = hostFromHttpsOrigin(origin);
		if (!host || isFleetLanGatewayHost(host)) continue;
		return origin.replace(/\/+$/, "");
	}
	return CWSP_FLEET_WAN_GATEWAY_HTTPS_FALLBACK;
};
var resolveFleetWanGatewayHost = (input = {}) => hostFromHttpsOrigin(resolveFleetWanGatewayHttpsBase(input)) || "45.147.121.152";
var isFleetWanGatewayHost = (host, input = {}) => {
	const h = String(host ?? "").trim().toLowerCase();
	if (!h) return false;
	if (h === "45.147.121.152") return true;
	const configured = resolveFleetWanGatewayHost(input).toLowerCase();
	return Boolean(configured) && h === configured;
};
/** True when value looks like a fleet gateway HTTPS origin (LAN `.200`, configured WAN, or fallback IP). */
var isFleetGatewayHttpsOrigin = (value, input = {}) => {
	const lower = String(value ?? "").toLowerCase();
	if (lower.includes("gateway")) return true;
	const host = hostFromHttpsOrigin(value);
	if (!host) return lower.includes("192.168.0.200") || lower.includes("45.147.121.152");
	return isFleetLanGatewayHost(host) || isFleetWanGatewayHost(host, input);
};
/** Split multi-host settings (`endpointUrl`, bridge lists) on comma, semicolon, or whitespace. */
var splitConnectHostList = (value) => splitMultiValueList(trim(value));
/** Canonical CWSP HTTPS origin for probes (`https://host:8434`, no path). */
var normalizeProbeHttpsOrigin = (raw) => {
	const t = trim(raw).replace(/\/lna-probe\/?$/i, "").replace(/\/+$/, "");
	if (!t) return "";
	const parsed = parseConnectHostInput(t);
	if (!parsed?.host) return t;
	const proto = parsed.protocol ?? "https";
	if (parsed.port) return `${proto}://${parsed.host}:${parsed.port}`;
	return `${proto}://${parsed.host}:8434`;
};
/** COMPAT: rewrite persisted CWSP HTTPS URLs (legacy `:8443`, typo `:8343` → `:8434`).
* Also inject `:8434` when host has no port — bare `45.147.121.152` otherwise dials :443 → /ws 404.
*/
var migrateLegacyCwspPublicPort = (raw) => {
	const t = trim(raw);
	if (!t) return t;
	const rewritten = t.replace(/(?<![0-9]):8443(?![0-9])/g, ":8434").replace(/(?<![0-9]):8343(?![0-9])/g, ":8434");
	const parts = splitConnectHostList(rewritten);
	if (parts.length <= 1) return normalizeProbeHttpsOrigin(rewritten) || rewritten;
	return parts.map((part) => normalizeProbeHttpsOrigin(part) || part).join(";");
};
/**
* Ordered deduped HTTPS origins for reachability probes.
* WHY: WAN `45.147.121.152` may be blocked — try configured hosts first, then LAN gateway and other settings.
*/
var collectEndpointProbeCandidates = (fields) => {
	const out = [];
	const push = (raw) => {
		const origin = normalizeProbeHttpsOrigin(raw);
		if (origin && !out.includes(origin)) out.push(origin);
	};
	for (const part of splitConnectHostList(fields.relay ?? "")) push(part);
	for (const part of splitConnectHostList(fields.direct ?? "")) push(part);
	if (fields.extras?.length) for (const extra of fields.extras) push(extra);
	if (fields.fleetFallbacks !== false) for (const fallback of CWSP_FLEET_GATEWAY_HTTPS_FALLBACKS) push(fallback);
	return out;
};
/** Build ordered HTTP(S) origin candidates for probing (deduped). */
var buildEndpointOriginCandidates = (raw, opts = {}) => {
	const parsed = parseConnectHostInput(raw);
	if (!parsed?.host) return [];
	const preferHttps = opts.preferHttps !== false;
	const includeHttp = opts.includeHttp !== false;
	const httpsPorts = opts.httpsPorts ?? CWSP_DEFAULT_HTTPS_PORTS;
	const httpPorts = opts.httpPorts ?? CWSP_DEFAULT_HTTP_PORTS;
	const out = [];
	const push = (origin) => {
		if (origin && !out.includes(origin)) out.push(origin);
	};
	const { host, port, protocol } = parsed;
	if (port) {
		if (protocol === "https") {
			push(originFromParts("https", host, port));
			return out;
		}
		if (protocol === "http") {
			push(originFromParts("http", host, port));
			return out;
		}
		push(originFromParts("https", host, port));
		if (includeHttp) push(originFromParts("http", host, port));
		return out;
	}
	if (protocol === "https") {
		for (const p of httpsPorts) push(originFromParts("https", host, p));
		return out;
	}
	if (protocol === "http") {
		for (const p of httpPorts) push(originFromParts("http", host, p));
		return out;
	}
	const protocols = preferHttps ? includeHttp ? ["https", "http"] : ["https"] : includeHttp ? ["http", "https"] : ["https"];
	for (const proto of protocols) {
		const ports = proto === "https" ? httpsPorts : httpPorts;
		for (const p of ports) push(originFromParts(proto, host, p));
	}
	return out;
};
var defaultFetch = () => {
	try {
		return typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : void 0;
	} catch {
		return;
	}
};
var DEFAULT_PROBE_TIMEOUT_MS = 2500;
var describeProbeFetchError = (error) => {
	const msg = error instanceof Error ? error.message : String(error ?? "fetch failed");
	if (/abort/i.test(msg)) return "timeout";
	if (/refused|ECONNREFUSED/i.test(msg)) return "connection refused";
	if (/ENOTFOUND|NAME_NOT_RESOLVED/i.test(msg)) return "host not found";
	if (/certificate|cert\.|ssl|tls|ERR_CERT/i.test(msg)) return `TLS: ${msg}`;
	return msg;
};
/** Best-effort reachability probe (CWSP `/lna-probe`) with HTTP status / error text. */
var probeEndpointOriginReport = async (origin, opts = {}) => {
	const fetchFn = opts.fetchFn ?? defaultFetch();
	const base = trim(origin).replace(/\/+$/, "");
	const started = Date.now();
	if (!fetchFn || !base) return {
		origin: base || origin,
		ok: false,
		error: "invalid origin",
		latencyMs: 0
	};
	const timeoutMs = opts.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS;
	const controller = typeof AbortController !== "undefined" ? new AbortController() : void 0;
	const timer = controller && timeoutMs > 0 ? globalThis.setTimeout(() => controller.abort(), timeoutMs) : void 0;
	try {
		const res = await fetchFn(`${base}/lna-probe`, {
			method: "GET",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			signal: controller?.signal
		});
		const latencyMs = Date.now() - started;
		const ok = res.status === 204;
		return {
			origin: base,
			ok,
			status: res.status,
			statusText: res.statusText,
			latencyMs,
			error: ok ? void 0 : `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`.trim()
		};
	} catch (error) {
		return {
			origin: base,
			ok: false,
			error: describeProbeFetchError(error),
			latencyMs: Date.now() - started
		};
	} finally {
		if (timer) clearTimeout(timer);
	}
};
/** Best-effort reachability probe (CWSP `/lna-probe`). */
var probeEndpointOrigin = async (origin, opts = {}) => {
	const fetchFn = opts.fetchFn ?? defaultFetch();
	if (!fetchFn) return false;
	const base = trim(origin).replace(/\/+$/, "");
	if (!base) return false;
	const timeoutMs = opts.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS;
	const controller = typeof AbortController !== "undefined" ? new AbortController() : void 0;
	const timer = controller && timeoutMs > 0 ? globalThis.setTimeout(() => controller.abort(), timeoutMs) : void 0;
	try {
		return (await fetchFn(`${base}/lna-probe`, {
			method: "GET",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			signal: controller?.signal
		})).status === 204;
	} catch {
		return false;
	} finally {
		if (timer) clearTimeout(timer);
	}
};
var resultFromOrigin = (origin) => {
	try {
		const u = new URL(origin);
		return {
			origin,
			protocol: u.protocol === "http:" ? "http" : "https",
			port: u.port || (u.protocol === "http:" ? "80" : "443"),
			host: u.hostname
		};
	} catch {
		return null;
	}
};
/** Probe common ports; returns the first reachable CWSP origin. */
var discoverEndpointOrigin = async (raw, opts = {}) => {
	const parsed = parseConnectHostInput(raw);
	if (!parsed?.host) return null;
	if (parsed.port) {
		const tryOrigin = async (proto) => {
			const candidate = originFromParts(proto, parsed.host, parsed.port);
			if (!await probeEndpointOrigin(candidate, opts)) return null;
			return resultFromOrigin(candidate);
		};
		if (parsed.protocol === "https") {
			const hit = await tryOrigin("https");
			if (hit) return hit;
		} else if (parsed.protocol === "http") {
			const hit = await tryOrigin("http");
			if (hit) return hit;
		} else {
			const httpsHit = await tryOrigin("https");
			if (httpsHit) return httpsHit;
			if (opts.includeHttp !== false) {
				const httpHit = await tryOrigin("http");
				if (httpHit) return httpHit;
			}
		}
	}
	let candidates = buildEndpointOriginCandidates(parsed.host, opts);
	const cap = opts.maxProbeCandidates;
	if (cap != null && cap > 0 && candidates.length > cap) candidates = candidates.slice(0, cap);
	for (const origin of candidates) {
		if (!await probeEndpointOrigin(origin, opts)) continue;
		const hit = resultFromOrigin(origin);
		if (hit) return hit;
	}
	return null;
};
/** True when input already names a scheme or explicit port (skip full port sweep). */
var hasExplicitConnectOrigin = (raw) => {
	const t = trim(raw);
	if (!t) return false;
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(t)) return true;
	return Boolean(parseConnectHostInput(t)?.port);
};
/** Resolve bare host / partial URL to a full origin; probes alternate ports when the configured one is down. */
var resolveConnectHostToOrigin = async (raw, opts = {}) => {
	const trimmed = trim(raw);
	if (!trimmed) return "";
	if (opts.discover !== false && !hasExplicitConnectOrigin(trimmed)) {
		const found = await discoverEndpointOrigin(trimmed, opts);
		if (found?.origin) return found.origin;
	}
	return normalizeConnectHostInput(trimmed);
};
/** Resolve CWSP settings URL fields that may be bare hosts. */
var resolveCwspUrlFields = async (fields, opts = {}) => {
	const out = {};
	if (fields.relayHttpsUrl !== void 0) out.relayHttpsUrl = await resolveConnectHostToOrigin(fields.relayHttpsUrl, opts);
	if (fields.directHttpsUrl !== void 0) out.directHttpsUrl = await resolveConnectHostToOrigin(fields.directHttpsUrl, opts);
	return out;
};
//#endregion
//#region ../../modules/projects/cwsp-shared/src/airpad-cwsp-client-parity.ts
/**
* **AirPad** web (`localStorage` key below) ↔ **CWSAndroid** Java (`SharedPreferences` prefs.db, `cwsp.*`) contracts.
* Canonical for shell / view builds that must not import from `runtime/cwsp` sources.
*
* **Storage:** {@link AIRPAD_REMOTE_CONFIG_STORAGE_KEY} holds JSON {@link CwspRemoteConnectionV1}.
* **Specs:** coordinator behaviour in `runtime/cwsp/endpoint/` (`SPECIFICATION-v2.md`, route query helpers).
*
* Import in Vite apps via `cwsp-shared/airpad-cwsp-client-parity` (see `tsconfig.vite-base.json`).
*/
var airpad_cwsp_client_parity_exports = /* @__PURE__ */ __exportAll({
	AIRPAD_REMOTE_CONFIG_STORAGE_KEY: () => AIRPAD_REMOTE_CONFIG_STORAGE_KEY,
	CWSP_AIRPAD_PWA_ARCHETYPE: () => CWSP_AIRPAD_PWA_ARCHETYPE,
	CWSP_ANDROID_LEGACY_AIRPAD_CONTROL_TOKEN_KEY: () => CWSP_ANDROID_LEGACY_AIRPAD_CONTROL_TOKEN_KEY,
	CWSP_NATIVE_SHELL_ARCHETYPE: () => CWSP_NATIVE_SHELL_ARCHETYPE,
	CWSP_REMOTE_CONFIG_SYNC_CHANNEL: () => CWSP_REMOTE_CONFIG_SYNC_CHANNEL,
	CWSP_REMOTE_CONNECTION_JSON_VERSION: () => 1,
	CWSP_SETTINGS_REVISION_MS_KEY: () => CWSP_SETTINGS_REVISION_MS_KEY,
	CWSP_WIRE_ENVELOPE_V2: () => "v2",
	CWS_ANDROID_SETTINGS_KEY_PREFIX: () => CWS_ANDROID_SETTINGS_KEY_PREFIX,
	DEFAULT_DESK_WIRE_NODE_ID: () => DEFAULT_DESK_WIRE_NODE_ID,
	FLEET_DESK_WIRE_NODE_IDS: () => FLEET_DESK_WIRE_NODE_IDS,
	FLEET_GATEWAY_WIRE_NODE_ID: () => FLEET_GATEWAY_WIRE_NODE_ID,
	FLEET_HOME_LAN_PREFIX: () => FLEET_HOME_LAN_PREFIX,
	appSettingsShellToNativeExtras: () => appSettingsShellToNativeExtras,
	appSettingsToRemoteConnectionV1: () => appSettingsToRemoteConnectionV1,
	fleetWireNodeIdsEquivalent: () => fleetWireNodeIdsEquivalent,
	inferDirectHttpsOriginFromConnectInput: () => inferDirectHttpsOriginFromConnectInput,
	isAssociableFleetWireNodeId: () => isAssociableFleetWireNodeId,
	isCrxFleetWireNodeId: () => isCrxFleetWireNodeId,
	isExplicitFleetGatewayTarget: () => isExplicitFleetGatewayTarget,
	isFleetDeskWireNodeId: () => isFleetDeskWireNodeId,
	isFleetGatewayWireNodeId: () => isFleetGatewayWireNodeId,
	isGatewayHttpsOrigin: () => isGatewayHttpsOrigin,
	isGuestPrivateLanIpv4: () => isGuestPrivateLanIpv4,
	isHomeFleetLanHost: () => isHomeFleetLanHost,
	isLoopbackPageHost: () => isLoopbackPageHost,
	isOffHomeFleetNetwork: () => isOffHomeFleetNetwork,
	isOnHomeFleetLanPageHost: () => isOnHomeFleetLanPageHost,
	normalizeWireNodeIdForWire: () => normalizeWireNodeIdForWire,
	resolveDeskDirectOriginFromWireNodeId: () => resolveDeskDirectOriginFromWireNodeId,
	resolveFleetDeskProbeWireNodeId: () => resolveFleetDeskProbeWireNodeId,
	resolveFleetGatewayConnectOrigins: () => resolveFleetGatewayConnectOrigins,
	resolveWanGatewayConnectOrigin: () => resolveWanGatewayConnectOrigin,
	sanitizeCrxFleetWireNodeId: () => sanitizeCrxFleetWireNodeId,
	sanitizeFleetRouteTarget: () => sanitizeFleetRouteTarget,
	sanitizeFleetSelfWireNodeId: () => sanitizeFleetSelfWireNodeId,
	shouldConnectViaFleetGateway: () => shouldConnectViaFleetGateway,
	shouldFleetDeskGatewayProbeFallbacks: () => shouldFleetDeskGatewayProbeFallbacks,
	shouldPreferWanGatewayForAirpad: () => shouldPreferWanGatewayForAirpad,
	stringifyCwspRemoteConnectionV1: () => stringifyCwspRemoteConnectionV1,
	toShortFleetWireNodeId: () => toShortFleetWireNodeId,
	wireNodeIdToBareConnectHost: () => wireNodeIdToBareConnectHost,
	wireNodeIdToLanHost: () => wireNodeIdToLanHost
});
/** AirPad popup / view persisted remote block (`airpad-view` / embedding shells). */
var AIRPAD_REMOTE_CONFIG_STORAGE_KEY = "airpad.remote.connection.v1";
/** Home fleet LAN only ({@code 192.168.0.x}) — guest {@code 192.168.165.x} must not become Client-ID. */
var FLEET_HOME_LAN_PREFIX = "192.168.0.";
/** {@code L-192.168.0.110} / {@code L-110} → bare connect host for dialing (not identity rewrite). */
var wireNodeIdToBareConnectHost = (value) => {
	const trimmed = String(value ?? "").trim();
	if (!/^L-/i.test(trimmed)) return "";
	const bare = trimmed.replace(/^L-/i, "").trim();
	if (looksLikeConnectHost(bare)) return bare;
	if (/^\d{1,3}$/.test(bare)) return `${FLEET_HOME_LAN_PREFIX}${bare}`;
	return "";
};
/** Normalize wire node id without expanding short ↔ full forms.
* Clients keep short ids ({@code L-196}); full {@code L-192.168.0.196} stays as-is until {@link toShortFleetWireNodeId}.
*/
var normalizeWireNodeIdForWire = (value) => {
	const trimmed = String(value ?? "").trim();
	if (!trimmed) return "";
	if (/^L-/i.test(trimmed)) {
		const body = trimmed.slice(2).trim();
		if (!body) return "";
		return `L-${body}`;
	}
	if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(trimmed)) return `L-${trimmed.split(":")[0]}`;
	if (/^\d{1,3}$/.test(trimmed)) return `L-${trimmed}`;
	return trimmed;
};
/**
* Prefer short fleet Client-ID for apps/UI ({@code L-196}).
* Full home-LAN ids collapse: {@code L-192.168.0.196} → {@code L-196}.
*/
var toShortFleetWireNodeId = (value) => {
	const normalized = normalizeWireNodeIdForWire(value);
	if (!normalized) return "";
	const full = /^L-192\.168\.0\.(\d{1,3})$/i.exec(normalized);
	if (full) return `L-${full[1]}`;
	if (/^L-\d{1,3}$/i.test(normalized)) return `L-${normalized.slice(2)}`;
	return normalized;
};
/** Home-fleet identity equality: {@code L-196} ≡ {@code L-192.168.0.196}. */
var fleetWireNodeIdsEquivalent = (a, b) => {
	const left = toShortFleetWireNodeId(a).toLowerCase();
	const right = toShortFleetWireNodeId(b).toLowerCase();
	return Boolean(left) && left === right;
};
/** Desk AirPad target — short id preferred in clients. */
var DEFAULT_DESK_WIRE_NODE_ID = "L-110";
/** Fleet gateway peer — short id preferred in clients. */
var FLEET_GATEWAY_WIRE_NODE_ID = "L-200";
var isFleetGatewayWireNodeId = (nodeId) => fleetWireNodeIdsEquivalent(nodeId, FLEET_GATEWAY_WIRE_NODE_ID);
/** Home fleet desk peers controllable via AirPad (`.110` ultrabook, `.111` laptop Ethernet). */
var FLEET_DESK_WIRE_NODE_IDS = ["L-110", "L-111"];
var isFleetDeskWireNodeId = (nodeId) => {
	const shortId = toShortFleetWireNodeId(nodeId).toLowerCase();
	if (!shortId) return false;
	return FLEET_DESK_WIRE_NODE_IDS.some((entry) => entry.toLowerCase() === shortId);
};
/** Routed desk control through fleet ingress (LAN `.200` / configured WAN relay). */
var shouldConnectViaFleetGateway = (endpointUrl, routeTarget) => {
	if (!isGatewayHttpsOrigin(endpointUrl)) return false;
	if (isFleetGatewayWireNodeId(routeTarget)) return false;
	return isFleetDeskWireNodeId(routeTarget);
};
/**
* Home LAN + WAN: try direct desk ({@code .110}) then fleet gateways when WiFi is off but Ethernet stays up.
* Applies when route target is a fleet desk id or connect URL points at {@code 192.168.0.110}.
*/
var shouldFleetDeskGatewayProbeFallbacks = (routeTarget, endpointUrl, directUrl) => {
	const normalized = normalizeWireNodeIdForWire(routeTarget);
	if (isFleetGatewayWireNodeId(normalized)) return false;
	if (isFleetDeskWireNodeId(normalized)) return true;
	if (isGatewayHttpsOrigin(endpointUrl)) return true;
	const deskLanHost = wireNodeIdToLanHost(DEFAULT_DESK_WIRE_NODE_ID);
	if (!deskLanHost) return false;
	for (const raw of [String(endpointUrl ?? ""), String(directUrl ?? "")]) if (raw.includes(deskLanHost)) return true;
	return false;
};
/** Resolve desk wire id for gateway probe chain (defaults to ultrabook {@code L-110}). */
var resolveFleetDeskProbeWireNodeId = (routeTarget, endpointUrl, directUrl) => {
	const normalized = normalizeWireNodeIdForWire(routeTarget);
	if (isFleetGatewayWireNodeId(normalized)) return FLEET_GATEWAY_WIRE_NODE_ID;
	if (isFleetDeskWireNodeId(normalized)) return normalized;
	if (shouldFleetDeskGatewayProbeFallbacks(normalized, endpointUrl, directUrl)) return DEFAULT_DESK_WIRE_NODE_ID;
	return normalized;
};
/** LAN + WAN gateway origins for probe/connect (order: LAN first on home fleet page). */
var resolveFleetGatewayConnectOrigins = (pageHost, settings) => {
	const lan = `${CWSP_FLEET_LAN_GATEWAY_HTTPS}/`;
	const wan = `${resolveFleetWanGatewayHttpsBase({
		relay: settings?.relay,
		endpointUrl: settings?.endpointUrl,
		hubUrl: settings?.hubUrl
	})}/`;
	if (isOnHomeFleetLanPageHost(pageHost)) return [lan, wan];
	return [wan, lan];
};
var resolveDeskDirectOriginFromWireNodeId = (nodeId, port = 8434) => {
	const host = wireNodeIdToLanHost(nodeId);
	if (!host) return "";
	return `https://${host}:${port}/`;
};
var wireNodeIdToLanHost = (nodeId) => {
	const normalized = normalizeWireNodeIdForWire(nodeId);
	if (!normalized.toLowerCase().startsWith("l-")) return "";
	const host = normalized.slice(2).trim();
	if (/^\d{1,3}$/.test(host)) return `${FLEET_HOME_LAN_PREFIX}${host}`;
	return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) ? host : "";
};
var isHomeFleetLanHost = (host) => {
	return String(host ?? "").trim().startsWith(FLEET_HOME_LAN_PREFIX);
};
/**
* Chrome-extension peer id for the desk hub ({@code L-110-crx}).
* WHY: distinct from Neutralino {@code L-110} so both can stay connected without kicking each other.
*/
var isCrxFleetWireNodeId = (nodeId) => /^L-\d{1,3}-crx$/i.test(String(nodeId ?? "").trim());
/** Normalize {@code L-110-crx} / {@code l-110-CRX} → {@code L-110-crx}. */
var sanitizeCrxFleetWireNodeId = (value) => {
	const m = /^L-(\d{1,3})-crx$/i.exec(String(value ?? "").trim());
	return m ? `L-${m[1]}-crx` : "";
};
/** True for home fleet Client-IDs: short {@code L-196} or full {@code L-192.168.0.196}. */
var isAssociableFleetWireNodeId = (nodeId) => {
	if (isCrxFleetWireNodeId(nodeId)) return true;
	const normalized = normalizeWireNodeIdForWire(nodeId);
	if (/^L-\d{1,3}$/i.test(normalized)) return true;
	const host = wireNodeIdToLanHost(normalized);
	return host ? isHomeFleetLanHost(host) : false;
};
var isGatewayHttpsOrigin = (value) => {
	if (!String(value ?? "").trim().toLowerCase()) return false;
	return isFleetGatewayHttpsOrigin(value);
};
var isExplicitFleetGatewayTarget = (value) => {
	return isFleetGatewayWireNodeId(normalizeWireNodeIdForWire(value)) || isGatewayHttpsOrigin(value);
};
/** Accept home-fleet Client-ID; persist/return short form ({@code L-196}) for apps. */
var sanitizeFleetSelfWireNodeId = (value) => {
	const crxId = sanitizeCrxFleetWireNodeId(value);
	if (crxId) return crxId;
	const normalized = normalizeWireNodeIdForWire(value);
	if (!isAssociableFleetWireNodeId(normalized)) return "";
	return toShortFleetWireNodeId(normalized);
};
/**
* Route target for routed WAN/LAN gateway sessions — desk {@code L-110} when value is guest LAN.
*/
var sanitizeFleetRouteTarget = (value, endpointUrl) => {
	const raw = String(value ?? "").trim();
	const shortId = sanitizeFleetSelfWireNodeId(value);
	if (shortId) return shortId;
	if (raw && isExplicitFleetGatewayTarget(raw)) return FLEET_GATEWAY_WIRE_NODE_ID;
	if (isGatewayHttpsOrigin(endpointUrl)) return DEFAULT_DESK_WIRE_NODE_ID;
	return "";
};
/** Guest/corporate private IPv4 (not home {@code 192.168.0.x}) — skip for WS probe order on AirPad. */
var isGuestPrivateLanIpv4 = (host) => {
	const t = String(host ?? "").trim();
	if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)) return false;
	if (t.startsWith("10.")) return true;
	if (t.startsWith("192.168.") && !t.startsWith("192.168.0.")) return true;
	if (/^172\.(1[6-9]|2\d|3[01])\./.test(t)) return true;
	if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(t)) return true;
	return false;
};
var isLoopbackPageHost = (host) => {
	const t = String(host ?? "").trim().toLowerCase();
	return !t || t === "localhost" || t === "127.0.0.1" || t === "[::1]";
};
/** Browser / shell tab is on home fleet LAN ({@code 192.168.0.x}). */
var isOnHomeFleetLanPageHost = (host) => {
	return isHomeFleetLanHost(String(host ?? "").trim());
};
/**
* Not on home {@code 192.168.0.x} — guest WiFi, public IP, LTE, localhost shell (Windows laptop off-LAN).
*/
var isOffHomeFleetNetwork = (pageHost) => {
	const h = String(pageHost ?? (typeof globalThis !== "undefined" && globalThis.location ? globalThis.location.hostname : "")).trim();
	if (isLoopbackPageHost(h)) return true;
	if (isOnHomeFleetLanPageHost(h)) return false;
	return true;
};
/** WAN gateway connect when off home LAN and Server tab endpoint is a fleet gateway URL. */
var shouldPreferWanGatewayForAirpad = (endpointUrl, pageHost) => {
	if (!isGatewayHttpsOrigin(String(endpointUrl ?? "").trim())) return false;
	return isOffHomeFleetNetwork(pageHost);
};
/** Canonical WAN ingress from settings relay/endpoint; fleet WAN IP is fallback only. */
var resolveWanGatewayConnectOrigin = (endpointUrl) => {
	const t = String(endpointUrl ?? "").trim();
	if (isGatewayHttpsOrigin(t)) return `${t.replace(/\/+$/, "")}/`;
	return `${resolveFleetWanGatewayHttpsBase({ endpointUrl: t || void 0 })}/`;
};
/** Default HTTPS origin from quick-connect / {@code L-IP} when port omitted (Node {@code clipboardy} / Android WS parity). */
var inferDirectHttpsOriginFromConnectInput = (value, defaultPort = 8434) => {
	const raw = String(value ?? "").trim();
	if (!raw) return "";
	if (looksLikeConnectHost(raw)) {
		if (/^https?:\/\//i.test(raw)) return raw.endsWith("/") ? raw : `${raw}/`;
		const hostSpec = raw.split("/")[0]?.trim() ?? "";
		if (!hostSpec) return "";
		if (hostSpec.includes(":")) return `https://${hostSpec}/`;
		return `https://${hostSpec}:${defaultPort}/`;
	}
	const bare = wireNodeIdToBareConnectHost(raw);
	if (!bare) return "";
	if (bare.includes(":")) return `https://${bare}/`;
	return `https://${bare}:${defaultPort}/`;
};
/**
* Optional `BroadcastChannel` / worker pool name for sharing the same logical blob as localStorage
* (tabs, service worker, embedding shell). Consumers may no-op when `BroadcastChannel` is missing.
*/
var CWSP_REMOTE_CONFIG_SYNC_CHANNEL = "cwsp.remote.connection.v1";
function stringifyCwspRemoteConnectionV1(conn) {
	return JSON.stringify({
		...conn,
		v: conn.v ?? 1
	});
}
function trimOrUndef(s) {
	return String(s || "").trim() || void 0;
}
function readNestedString(root, path) {
	let cur = root;
	for (const key of path) {
		if (!cur || typeof cur !== "object" || Array.isArray(cur)) return void 0;
		cur = cur[key];
	}
	return trimOrUndef(String(cur ?? ""));
}
/**
* Map CrossWord {@link AppSettings} (Settings UI / IDB) → {@link CwspRemoteConnectionV1} for native parity.
*/
function appSettingsToRemoteConnectionV1(appSettings) {
	const core = appSettings.core && typeof appSettings.core === "object" && !Array.isArray(appSettings.core) ? appSettings.core : {};
	const socket = core.socket && typeof core.socket === "object" && !Array.isArray(core.socket) ? core.socket : {};
	const endpointUrl = readNestedString(appSettings, ["core", "endpointUrl"]) || readNestedString(appSettings, [
		"core",
		"admin",
		"httpsOrigin"
	]);
	const accessToken = readNestedString(appSettings, ["core", "ecosystemToken"]) || trimOrUndef(String(socket.accessToken ?? socket.airpadAuthToken ?? "")) || readNestedString(appSettings, ["core", "userKey"]) || void 0;
	const identificationToken = readNestedString(appSettings, ["core", "ecosystemToken"]) || readNestedString(appSettings, ["core", "userKey"]) || readNestedString(appSettings, [
		"core",
		"socket",
		"clientAccessToken"
	]) || readNestedString(appSettings, [
		"core",
		"socket",
		"accessToken"
	]);
	return {
		v: 1,
		endpointUrl,
		directUrl: readNestedString(appSettings, [
			"core",
			"ops",
			"directUrl"
		]),
		quickConnectValue: readNestedString(appSettings, [
			"core",
			"network",
			"quickConnect"
		]),
		destinationId: readNestedString(appSettings, [
			"core",
			"socket",
			"routeTarget"
		]),
		routeTarget: readNestedString(appSettings, [
			"core",
			"socket",
			"routeTarget"
		]),
		accessToken,
		authToken: accessToken,
		clientId: readNestedString(appSettings, [
			"core",
			"socket",
			"selfId"
		]) || readNestedString(appSettings, ["core", "userId"]) || readNestedString(appSettings, ["core", "appClientId"]),
		peerInstanceId: readNestedString(appSettings, ["core", "appClientId"]),
		identificationToken,
		clientAccessToken: readNestedString(appSettings, [
			"core",
			"socket",
			"clientAccessToken"
		]),
		wireTransport: "ws"
	};
}
/** Shell toggles that have no field on {@link CwspRemoteConnectionV1} but map to native `CwspClientSettings`. */
function appSettingsShellToNativeExtras(appSettings) {
	const shell = appSettings.shell && typeof appSettings.shell === "object" && !Array.isArray(appSettings.shell) ? appSettings.shell : {};
	const out = {};
	const shareDest = trimOrUndef(String(shell.clipboardShareDestinationIds ?? ""));
	if (shareDest !== void 0) out.shareIntentDestinationIds = shareDest;
	const inboundAllow = trimOrUndef(String(shell.clipboardInboundAllowIds ?? ""));
	if (inboundAllow !== void 0) out.allowClipboardReadFromIds = inboundAllow;
	if (shell.acceptInboundClipboardData !== void 0) out.acceptInboundClipboard = (shell.acceptInboundClipboardData ?? true) !== false;
	if (shell.applyRemoteClipboardToDevice !== void 0) out.applyRemoteClipboardToDevice = (shell.applyRemoteClipboardToDevice ?? true) !== false;
	if (shell.accessTokenBypassesClipboardAllowlist !== void 0) out.accessTokenBypassesIdPolicy = shell.accessTokenBypassesClipboardAllowlist === true;
	if (shell.acceptContactsBridgeData !== void 0) out.acceptContactsData = shell.acceptContactsBridgeData === true;
	if (shell.acceptSmsBridgeData !== void 0) out.acceptSmsData = shell.acceptSmsBridgeData === true;
	if (shell.autoStartOnBoot !== void 0) out.autoStartOnBoot = shell.autoStartOnBoot !== false;
	if (shell.bridgeDaemonEnabled !== void 0) out.bridgeDaemonEnabled = shell.bridgeDaemonEnabled !== false;
	return out;
}
//#endregion
export { toShortFleetWireNodeId as A, looksLikeConnectHost as B, resolveWanGatewayConnectOrigin as C, shouldFleetDeskGatewayProbeFallbacks as D, shouldConnectViaFleetGateway as E, CWSP_FLEET_LAN_GATEWAY_HOST as F, resolveConnectHostToOrigin as G, normalizeConnectHostInput as H, CWSP_FLEET_WAN_GATEWAY_HOST_FALLBACK as I, splitConnectHostList as J, resolveCwspUrlFields as K, buildEndpointOriginCandidates as L, wireNodeIdToLanHost as M, CWSP_DEFAULT_HTTPS_PORTS as N, shouldPreferWanGatewayForAirpad as O, CWSP_DEFAULT_HTTP_PORTS as P, collectEndpointProbeCandidates as R, resolveFleetGatewayConnectOrigins as S, sanitizeFleetSelfWireNodeId as T, parseConnectHostInput as U, migrateLegacyCwspPublicPort as V, probeEndpointOriginReport as W, splitMultiValueList as Y, isOffHomeFleetNetwork as _, airpad_cwsp_client_parity_exports as a, resolveDeskDirectOriginFromWireNodeId as b, fleetWireNodeIdsEquivalent as c, isExplicitFleetGatewayTarget as d, isFleetDeskWireNodeId as f, isHomeFleetLanHost as g, isGuestPrivateLanIpv4 as h, FLEET_GATEWAY_WIRE_NODE_ID as i, wireNodeIdToBareConnectHost as j, stringifyCwspRemoteConnectionV1 as k, inferDirectHttpsOriginFromConnectInput as l, isGatewayHttpsOrigin as m, CWSP_REMOTE_CONFIG_SYNC_CHANNEL as n, appSettingsShellToNativeExtras as o, isFleetGatewayWireNodeId as p, resolveFleetWanGatewayHost as q, DEFAULT_DESK_WIRE_NODE_ID as r, appSettingsToRemoteConnectionV1 as s, AIRPAD_REMOTE_CONFIG_STORAGE_KEY as t, isAssociableFleetWireNodeId as u, isOnHomeFleetLanPageHost as v, sanitizeFleetRouteTarget as w, resolveFleetDeskProbeWireNodeId as x, normalizeWireNodeIdForWire as y, hasExplicitConnectOrigin as z };
