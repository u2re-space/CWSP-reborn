import { p as loadAsAdopted } from "../fest/dom.js";
import { I as H } from "../com/app.js";
import { a as invokeCwsNative, o as invokeCwsPlatformIPC, s as isCapacitorCwsNativeShell, t as CwsBridge } from "../vendor/@capacitor_core.js";
import { i as resolveEcosystemToken } from "./SettingsTypes.js";
import { J as splitConnectHostList, L as buildEndpointOriginCandidates, R as collectEndpointProbeCandidates, U as parseConnectHostInput, W as probeEndpointOriginReport, q as resolveFleetWanGatewayHost } from "./airpad-cwsp-client-parity.js";
import { L as isMaintainHubSocketConnectionEnabled, R as isNeutralinoNodeClipboardHubOwned, z as isPreferNativeWebsocketEnabled } from "./config.js";
import { a as loadSettings } from "./Settings.js";
import { a as writeClipboardTextToDevice } from "./clipboard-device.js";
import { n as getFrontendDebugApi, r as initFrontendDebugCapture } from "./frontend-debug-capture.js";
import { a as initWebSocket, i as disconnectWS, o as isWSConnected, r as connectWS, u as onWSConnectionChange } from "./hub-socket-boot.js";
//#region ../../modules/views/network-view/src/network-probe-origin.ts
var trim$1 = (value) => typeof value === "string" ? value.trim() : "";
/** Strip probe path suffix; canonical CWSP HTTPS origin (`https://host:8434`). */
var normalizeProbeOrigin = (raw) => {
	const t = trim$1(raw).replace(/\/lna-probe\/?$/i, "").replace(/\/+$/, "");
	if (!t) return "";
	const parsed = parseConnectHostInput(t);
	if (!parsed?.host) return t;
	const proto = parsed.protocol ?? "https";
	if (parsed.port) return `${proto}://${parsed.host}:${parsed.port}`;
	return `${proto}://${parsed.host}:8434`;
};
var labelForProbeCandidate = (origin, index, fields) => {
	const relaySet = new Set(splitConnectHostList(fields.relay ?? "").map((h) => normalizeProbeOrigin(h)));
	const directSet = new Set(splitConnectHostList(fields.direct ?? "").map((h) => normalizeProbeOrigin(h)));
	const norm = normalizeProbeOrigin(origin);
	if (relaySet.has(norm)) return index === 0 ? "Relay / gateway" : "Relay (alt)";
	if (directSet.has(norm)) return "Direct peer";
	if (norm.includes("192.168.0.200")) return "Gateway LAN fallback";
	const wanHost = resolveFleetWanGatewayHost({
		relay: fields.relay,
		extras: [fields.direct]
	}).toLowerCase();
	const hostPart = (() => {
		try {
			return new URL(norm).hostname.toLowerCase();
		} catch {
			return norm.toLowerCase();
		}
	})();
	if (hostPart === wanHost || hostPart === "45.147.121.152" || norm.includes("45.147.121.152")) return "Gateway WAN fallback";
	if (norm.includes("127.0.0.1") || norm.includes("localhost")) return "Loopback";
	return `Candidate ${index + 1}`;
};
var pickDispatchOrigin = (probes, fields) => {
	const okOrigin = probes.find((p) => p.ok)?.origin;
	if (okOrigin) return normalizeProbeOrigin(okOrigin);
	const configured = collectEndpointProbeCandidates(fields);
	if (configured[0]) return configured[0];
	if (probes[0]?.origin) return normalizeProbeOrigin(probes[0].origin);
	return "";
};
//#endregion
//#region ../../modules/views/network-view/src/network-probe.ts
var trim = (value) => typeof value === "string" ? value.trim() : "";
var isWebnativeSurface = () => {
	try {
		const g = globalThis;
		return Boolean(g.__WEBNATIVE_AUTH__ || g.__CWS_WEBNATIVE_BOOT__);
	} catch {
		return false;
	}
};
var webnativeControlUrl = (pathname) => {
	try {
		const auth = globalThis.__WEBNATIVE_AUTH__;
		if (!auth?.port) return null;
		return `http://127.0.0.1:${auth.port}${pathname}`;
	} catch {
		return null;
	}
};
var describeFetchError = (error) => {
	const msg = error instanceof Error ? error.message : String(error ?? "fetch failed");
	if (/abort/i.test(msg)) return "timeout";
	if (/refused|ECONNREFUSED/i.test(msg)) return "connection refused";
	if (/ENOTFOUND|NAME_NOT_RESOLVED/i.test(msg)) return "host not found";
	if (/certificate|cert\.|ssl|tls|ERR_CERT/i.test(msg)) return `TLS: ${msg}`;
	if (/failed to fetch/i.test(msg) && isCapacitorCwsNativeShell()) return "WebView fetch blocked (CORS/TLS) — use native bridge";
	return msg;
};
var formatNativeProbeError = (row, ok, status) => {
	if (ok) return void 0;
	const bits = [];
	if (row.error) bits.push(String(row.error));
	if (status != null && status >= 0 && status !== 204) bits.push(`HTTP ${status}`);
	return bits.join(" · ") || "unreachable";
};
/** Java {@code network:probe} via CwsBridge — bypasses WebView fetch restrictions on LAN HTTPS. */
async function runNativeRouteProbes(fields) {
	if (!isCapacitorCwsNativeShell()) return null;
	const candidates = collectEndpointProbeCandidates(fields);
	try {
		const bag = await invokeCwsPlatformIPC({
			channel: "network:probe",
			payload: {
				relay: normalizeProbeOrigin(trim(fields.relay)),
				direct: normalizeProbeOrigin(trim(fields.direct)),
				candidates
			}
		});
		const echo = bag.echo;
		const raw = bag.results ?? echo?.results;
		if (!Array.isArray(raw) || !raw.length) return null;
		const seen = /* @__PURE__ */ new Set();
		const rows = [];
		for (let index = 0; index < raw.length; index++) {
			const row = raw[index];
			const origin = normalizeProbeOrigin(String(row.url ?? ""));
			if (!origin || seen.has(origin)) continue;
			seen.add(origin);
			const ok = Boolean(row.reachable);
			const status = typeof row.statusCode === "number" ? row.statusCode : void 0;
			rows.push({
				label: labelForProbeCandidate(origin, rows.length, fields),
				origin,
				ok,
				status,
				error: formatNativeProbeError(row, ok, status)
			});
		}
		return rows.length ? rows : null;
	} catch {
		return null;
	}
}
/** Native POST `/api/network/dispatch` (Java TLS stack). */
async function runNativeDispatchProbe(origin, auth) {
	if (!isCapacitorCwsNativeShell()) return null;
	const base = normalizeProbeOrigin(origin);
	if (!base) return null;
	const started = Date.now();
	try {
		const bag = await invokeCwsPlatformIPC({
			channel: "network:dispatch-probe",
			payload: {
				origin: base,
				clientId: trim(auth.clientId),
				token: trim(auth.token),
				accessToken: trim(auth.accessToken)
			}
		});
		const status = typeof bag.statusCode === "number" ? bag.statusCode : void 0;
		const ok = Boolean(bag.ok);
		const errorRaw = typeof bag.error === "string" ? bag.error.trim() : "";
		const bodySnippet = typeof bag.bodySnippet === "string" ? bag.bodySnippet : "";
		return {
			origin: base,
			ok,
			status,
			latencyMs: Date.now() - started,
			bodySnippet,
			error: ok ? void 0 : errorRaw || (status != null ? `HTTP ${status}` : "dispatch failed")
		};
	} catch {
		return null;
	}
}
/** Probe relay/direct hosts and fleet fallbacks (port scan when bare IP/domain). */
async function runEndpointProbes(fields, opts = {}) {
	const nativeRows = await runNativeRouteProbes(fields);
	if (nativeRows?.length) return nativeRows;
	const webnativeRows = await runWebnativeBackendProbes(fields);
	if (webnativeRows?.length) return webnativeRows;
	const timeoutMs = opts.timeoutMs ?? 3500;
	const maxCandidates = opts.maxCandidates ?? 6;
	const rows = [];
	const origins = collectEndpointProbeCandidates(fields);
	for (let index = 0; index < origins.length; index++) {
		const seed = origins[index];
		const label = labelForProbeCandidate(seed, index, fields);
		const hostCandidates = buildEndpointOriginCandidates(seed).slice(0, maxCandidates);
		if (!hostCandidates.length) {
			rows.push({
				label,
				origin: seed,
				ok: false,
				error: "invalid host"
			});
			continue;
		}
		for (const origin of hostCandidates) {
			const report = await probeEndpointOriginReport(origin, { timeoutMs });
			rows.push({
				label,
				...report
			});
			if (report.ok) break;
		}
	}
	return rows;
}
/**
* WebNative backend proxy: POST `/service/endpoint-probe` with `dispatch:true` so the backend runs
* both the `/lna-probe` reachability set AND a `/api/network/dispatch` probe from its loopback
* context, then return both as a combined snapshot. Returns `null` when not on the WebNative surface
* or the control RPC is unreachable (so callers fall back to direct fetch).
*/
async function runWebnativeBackendProbe(fields, auth) {
	if (!isWebnativeSurface()) return null;
	const url = webnativeControlUrl("/service/endpoint-probe");
	if (!url) return null;
	const authKey = globalThis.__WEBNATIVE_AUTH__?.key;
	const origins = collectEndpointProbeCandidates(fields);
	const controller = typeof AbortController !== "undefined" ? new AbortController() : void 0;
	const timer = controller ? globalThis.setTimeout(() => controller.abort(), 12e3) : void 0;
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: authKey ? {
				"Content-Type": "application/json",
				"X-API-Key": authKey
			} : { "Content-Type": "application/json" },
			body: JSON.stringify({
				origins,
				dispatch: true,
				auth
			}),
			signal: controller?.signal
		});
		if (!res.ok) return null;
		const bag = await res.json();
		return {
			probes: (bag.rows ?? []).map((r, i) => ({
				label: labelForProbeCandidate(r.origin, i, fields),
				origin: r.origin,
				ok: r.ok,
				status: r.status,
				error: r.error,
				latencyMs: r.latencyMs
			})),
			dispatch: bag.dispatch ? {
				origin: bag.dispatch.origin,
				ok: bag.dispatch.ok,
				status: bag.dispatch.status,
				error: bag.dispatch.error,
				bodySnippet: bag.dispatch.bodySnippet,
				latencyMs: bag.dispatch.latencyMs
			} : void 0
		};
	} catch {
		return null;
	} finally {
		if (timer) clearTimeout(timer);
	}
}
var runWebnativeBackendProbes = async (fields) => {
	const r = await runWebnativeBackendProbe(fields, {});
	return r?.probes.length ? r.probes : null;
};
/** Try dispatch on the first reachable probe origin, then fall back through other OK probes. */
async function runDispatchProbeWithFallback(probes, fields, auth, timeoutMs = 8e3) {
	const okOrigins = probes.filter((p) => p.ok).map((p) => normalizeProbeOrigin(p.origin));
	const seeds = okOrigins.length ? okOrigins : collectEndpointProbeCandidates(fields);
	let last = {
		origin: "",
		ok: false,
		error: "no origin"
	};
	for (const origin of seeds) {
		last = await runDispatchProbe(origin, auth, timeoutMs);
		if (last.ok) return last;
	}
	return last;
}
/** POST `debug:isReady` via `/api/network/dispatch` — surfaces 401/403/405/429 clearly. */
async function runDispatchProbe(origin, auth, timeoutMs = 8e3) {
	const base = normalizeProbeOrigin(origin);
	const started = Date.now();
	if (!base) return {
		origin: "",
		ok: false,
		error: "no origin"
	};
	const native = await runNativeDispatchProbe(base, auth);
	if (native) return native;
	const controller = typeof AbortController !== "undefined" ? new AbortController() : void 0;
	const timer = controller && timeoutMs > 0 ? globalThis.setTimeout(() => controller.abort(), timeoutMs) : void 0;
	const clientId = trim(auth.clientId);
	const token = trim(auth.token);
	const accessToken = trim(auth.accessToken);
	const headers = { "Content-Type": "application/json" };
	if (accessToken) headers["x-auth-token"] = accessToken;
	if (token) headers["x-cws-token"] = token;
	const body = {
		userId: clientId,
		byId: clientId,
		from: clientId,
		clientId,
		userKey: accessToken || token,
		token: token || accessToken,
		accessToken: accessToken || token,
		op: "ask",
		what: "debug:isReady",
		payload: {}
	};
	try {
		const res = await fetch(`${base}/api/network/dispatch`, {
			method: "POST",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			headers,
			body: JSON.stringify(body),
			signal: controller?.signal
		});
		const text = await res.text().catch(() => "");
		const latencyMs = Date.now() - started;
		const ok = res.ok;
		return {
			origin: base,
			ok,
			status: res.status,
			statusText: res.statusText,
			latencyMs,
			bodySnippet: text.slice(0, 240),
			error: ok ? void 0 : `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`.trim()
		};
	} catch (error) {
		return {
			origin: base,
			ok: false,
			error: describeFetchError(error),
			latencyMs: Date.now() - started
		};
	} finally {
		if (timer) clearTimeout(timer);
	}
}
/** Split destination id list (`L-196;L-210` / commas / spaces / newlines). */
var parseDestinationIds = (raw) => {
	const text = String(raw || "").trim();
	if (!text) return [];
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const part of text.split(/[,;\s\n\r]+/)) {
		const id = part.trim();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		out.push(id);
	}
	return out;
};
/**
* Ask each destination via gateway `/api/network/dispatch` (`clipboard:isReady`).
* WHY: verifies node-to-node routing through the coordinator, not just host reachability.
*/
async function probeDestinationLinks(destinations, fields, auth, opts = {}) {
	const ids = destinations.map((d) => d.trim()).filter(Boolean);
	if (!ids.length) return [];
	const timeoutMs = opts.timeoutMs ?? 8e3;
	const origin = [normalizeProbeOrigin(opts.originHint || ""), ...collectEndpointProbeCandidates(fields).map(normalizeProbeOrigin)].filter(Boolean)[0] || "";
	if (!origin) return ids.map((id) => ({
		id,
		ok: false,
		origin: "",
		error: "no gateway origin"
	}));
	const clientId = trim(auth.clientId);
	const token = trim(auth.token);
	const accessToken = trim(auth.accessToken);
	const results = [];
	for (const id of ids) {
		const started = Date.now();
		const headers = { "Content-Type": "application/json" };
		if (accessToken) headers["x-auth-token"] = accessToken;
		if (token) headers["x-cws-token"] = token;
		const body = {
			userId: clientId,
			byId: clientId,
			from: clientId,
			clientId,
			userKey: accessToken || token,
			token: token || accessToken,
			accessToken: accessToken || token,
			op: "ask",
			what: "clipboard:isReady",
			purpose: "clipboard",
			nodes: [id],
			destinations: [id],
			payload: {
				probe: true,
				destination: id
			}
		};
		if (isCapacitorCwsNativeShell()) try {
			const bag = await invokeCwsPlatformIPC({
				channel: "network:dispatch-probe",
				payload: {
					origin,
					clientId,
					token,
					accessToken,
					what: "clipboard:isReady",
					nodes: [id],
					destinations: [id]
				}
			});
			const status = typeof bag.statusCode === "number" ? bag.statusCode : void 0;
			const ok = Boolean(bag.ok);
			const errorRaw = typeof bag.error === "string" ? bag.error.trim() : "";
			results.push({
				id,
				origin,
				ok,
				status,
				latencyMs: Date.now() - started,
				bodySnippet: typeof bag.bodySnippet === "string" ? bag.bodySnippet : void 0,
				error: ok ? void 0 : errorRaw || (status != null ? `HTTP ${status}` : "dispatch failed")
			});
			continue;
		} catch {}
		const controller = typeof AbortController !== "undefined" ? new AbortController() : void 0;
		const timer = controller && timeoutMs > 0 ? globalThis.setTimeout(() => controller.abort(), timeoutMs) : void 0;
		try {
			const res = await fetch(`${origin}/api/network/dispatch`, {
				method: "POST",
				mode: "cors",
				cache: "no-store",
				credentials: "omit",
				headers,
				body: JSON.stringify(body),
				signal: controller?.signal
			});
			const text = await res.text().catch(() => "");
			const ok = res.ok;
			results.push({
				id,
				origin,
				ok,
				status: res.status,
				latencyMs: Date.now() - started,
				bodySnippet: text.slice(0, 240),
				error: ok ? void 0 : `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`.trim()
			});
		} catch (error) {
			results.push({
				id,
				origin,
				ok: false,
				error: describeFetchError(error),
				latencyMs: Date.now() - started
			});
		} finally {
			if (timer) clearTimeout(timer);
		}
	}
	return results;
}
//#endregion
//#region ../../modules/views/network-view/src/network-log-export.ts
/**
* Copy / save helpers for Network diagnostics page logs.
*/
var formatDebugEntry = (row) => {
	return `${new Date(row.ts).toISOString()} [${row.level}] (${row.scope}) ${row.msg}`;
};
/** Text from WebView ring buffer ({@link __CWSP_FRONTEND_DEBUG__}). */
var collectFrontendLogText = (limit = 400) => {
	const rows = getFrontendDebugApi()?.tail(limit) ?? [];
	if (!rows.length) return "(no frontend log entries — boot WebView debug capture first)\n";
	return rows.map(formatDebugEntry).join("\n") + "\n";
};
/** Native logcat snapshot via CwsBridge {@code debug:logcat}. */
var collectNativeLogcatText = async (limit = 400) => {
	try {
		const bag = await invokeCwsPlatformIPC({
			channel: "debug:logcat",
			payload: { limit }
		});
		const echo = bag.echo;
		const direct = typeof bag.text === "string" ? bag.text : "";
		const nested = typeof echo?.text === "string" ? echo.text : "";
		const text = (direct || nested).trim();
		if (text) return text.endsWith("\n") ? text : `${text}\n`;
	} catch (error) {
		return `(logcat failed: ${error instanceof Error ? error.message : String(error)})\n`;
	}
	return "(logcat unavailable — native bridge missing or not on Android)\n";
};
/** Pull WebView batches stored in the native ring ({@code debug:append}). */
var collectNativeFrontendRingText = async (limit = 400) => {
	try {
		const bag = await invokeCwsPlatformIPC({
			channel: "debug:frontend",
			payload: { limit }
		});
		const echo = bag.echo;
		const text = typeof bag.text === "string" ? bag.text : typeof echo?.text === "string" ? echo.text : "";
		if (text.trim()) return text.endsWith("\n") ? text : `${text}\n`;
	} catch {}
	return "";
};
var buildCombinedPageLog = async (pageLog, probeSummary = "") => {
	const header = [
		"CWSP Network diagnostics export",
		`generated: ${(/* @__PURE__ */ new Date()).toISOString()}`,
		`userAgent: ${navigator.userAgent}`,
		""
	].join("\n");
	const frontend = collectFrontendLogText(500);
	const nativeRing = await collectNativeFrontendRingText(500);
	const logcat = await collectNativeLogcatText(500);
	return [
		header,
		"=== Page log ===",
		pageLog || "(empty)",
		"",
		probeSummary ? "=== Probe summary ===\n" + probeSummary + "\n" : "",
		"=== Frontend log (WebView ring) ===",
		frontend,
		nativeRing.trim() ? "=== Frontend log (native ring) ===\n" + nativeRing + "\n" : "",
		"=== Logcat (native) ===",
		logcat
	].filter(Boolean).join("\n");
};
var copyTextToClipboard = async (text) => {
	const payload = text || "(empty log)";
	try {
		await writeClipboardTextToDevice(payload);
		return true;
	} catch {
		return false;
	}
};
var saveTextAsDownload = (filename, text) => {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.append(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};
var timestampFilename = (prefix) => {
	return `${prefix}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.txt`;
};
//#endregion
//#region ../../modules/views/network-view/src/network-a11y.ts
/**
* Network view a11y contract — landmarks, live regions, labeled actions.
*
* WHY: VIEWS.md asks for accessible live status and log semantics. The panel
* markup is the surface; this module is the auditable contract tests pin without
* mounting fest/lure or transport side effects.
*/
var NETWORK_A11Y = {
	root: {
		selector: ".cw-network-view",
		role: "main",
		label: "CWSP Network"
	},
	statusGrid: {
		selector: ".cw-network-status-grid",
		role: "status",
		ariaLive: "polite",
		ariaAtomic: "false"
	},
	activityLog: {
		selector: "[data-log]",
		ariaLive: "polite",
		ariaRelevant: "additions text",
		role: "log"
	},
	probeList: {
		selector: "[data-probe-list]",
		role: "list"
	},
	actions: [
		{
			action: "test",
			label: "Run network test"
		},
		{
			action: "reconnect",
			label: "Reconnect WebSocket"
		},
		{
			action: "open-settings",
			label: "Open settings"
		},
		{
			action: "copy-frontend-log",
			label: "Copy frontend log"
		},
		{
			action: "copy-logcat",
			label: "Copy logcat"
		},
		{
			action: "save-page-logs",
			label: "Save page logs"
		}
	],
	/** Mobile shell touch-target floor (CSS px). */
	minTouchTargetPx: 44
};
/**
* Apply Network a11y attributes onto an already-built panel root.
* Idempotent — safe to call after mount and after re-render of static chrome.
*/
var applyNetworkA11y = (root) => {
	const { root: rootSpec, statusGrid, activityLog, probeList, actions } = NETWORK_A11Y;
	root.setAttribute("role", rootSpec.role);
	if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby")) root.setAttribute("aria-label", rootSpec.label);
	const heading = root.querySelector("h1");
	if (heading && !heading.id) {
		heading.id = "cw-network-view-title";
		root.setAttribute("aria-labelledby", heading.id);
		root.removeAttribute("aria-label");
	}
	const grid = root.querySelector(statusGrid.selector);
	if (grid instanceof HTMLElement) {
		grid.setAttribute("role", statusGrid.role);
		grid.setAttribute("aria-live", statusGrid.ariaLive);
		grid.setAttribute("aria-atomic", statusGrid.ariaAtomic);
	}
	const log = root.querySelector(activityLog.selector);
	if (log instanceof HTMLElement) {
		log.setAttribute("role", activityLog.role);
		log.setAttribute("aria-live", activityLog.ariaLive);
		log.setAttribute("aria-relevant", activityLog.ariaRelevant);
	}
	const probes = root.querySelector(probeList.selector);
	if (probes instanceof HTMLElement) probes.setAttribute("role", probeList.role);
	for (const action of actions) {
		const btn = root.querySelector(`[data-action="${action.action}"]`);
		if (btn instanceof HTMLElement) {
			if (!btn.getAttribute("aria-label") && !btn.textContent?.trim()) btn.setAttribute("aria-label", action.label);
			if (btn instanceof HTMLButtonElement && !btn.type) btn.type = "button";
		}
	}
};
/**
* Audit a Network panel root against {@link NETWORK_A11Y}.
* Returns issues (empty = pass). Does not throw.
*/
var auditNetworkA11y = (root) => {
	const issues = [];
	const { root: rootSpec, statusGrid, activityLog, probeList, actions } = NETWORK_A11Y;
	if (root.getAttribute("role") !== rootSpec.role) issues.push({
		code: "root-role",
		message: `root role must be "${rootSpec.role}"`
	});
	if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby")) issues.push({
		code: "root-label",
		message: "root needs aria-label or aria-labelledby"
	});
	const grid = root.querySelector(statusGrid.selector);
	if (!grid) issues.push({
		code: "status-grid-missing",
		message: "status grid missing"
	});
	else {
		if (grid.getAttribute("role") !== statusGrid.role) issues.push({
			code: "status-role",
			message: `status grid role must be "${statusGrid.role}"`
		});
		if (grid.getAttribute("aria-live") !== statusGrid.ariaLive) issues.push({
			code: "status-live",
			message: `status grid aria-live must be "${statusGrid.ariaLive}"`
		});
	}
	const log = root.querySelector(activityLog.selector);
	if (!log) issues.push({
		code: "log-missing",
		message: "activity log [data-log] missing"
	});
	else {
		if (log.getAttribute("aria-live") !== activityLog.ariaLive) issues.push({
			code: "log-live",
			message: `log aria-live must be "${activityLog.ariaLive}"`
		});
		if (log.getAttribute("role") !== activityLog.role) issues.push({
			code: "log-role",
			message: `log role must be "${activityLog.role}"`
		});
	}
	const probes = root.querySelector(probeList.selector);
	if (!probes) issues.push({
		code: "probe-list-missing",
		message: "probe list missing"
	});
	else if (probes.getAttribute("role") !== probeList.role) issues.push({
		code: "probe-list-role",
		message: `probe list role must be "${probeList.role}"`
	});
	for (const action of actions) {
		const btn = root.querySelector(`[data-action="${action.action}"]`);
		if (!btn) {
			issues.push({
				code: `action-missing:${action.action}`,
				message: `action button data-action="${action.action}" missing`
			});
			continue;
		}
		if (!Boolean(btn.getAttribute("aria-label") || btn.textContent?.trim())) issues.push({
			code: `action-label:${action.action}`,
			message: `action "${action.action}" needs accessible name`
		});
	}
	return issues;
};
/**
* Build a minimal Network chrome fixture for contract tests (no fest/lure).
* Mirrors the static structure NetworkStatusPanel mounts.
*/
var createNetworkA11yFixture = (doc = document) => {
	const root = doc.createElement("div");
	root.className = "cw-network-view";
	root.dataset.view = "network";
	root.innerHTML = `
        <header class="cw-network-view__header">
            <h1>CWSP Network</h1>
            <p>Connection status, reachability probes, and dispatch errors.</p>
        </header>
        <div class="cw-network-body">
            <div class="cw-network-status-grid"></div>
            <div class="cw-network-actions">
                <button type="button" data-action="test">Run network test</button>
                <button type="button" data-action="reconnect">Reconnect WS</button>
                <button type="button" data-action="open-settings">Settings</button>
            </div>
            <div class="cw-network-actions cw-network-actions--logs">
                <button type="button" data-action="copy-frontend-log">Copy Frontend Log</button>
                <button type="button" data-action="copy-logcat">Copy Logcat</button>
                <button type="button" data-action="save-page-logs">Save page logs</button>
            </div>
            <section class="cw-network-probes">
                <h2>Probe results</h2>
                <div data-probe-list></div>
            </section>
        </div>
        <section class="cw-network-log-panel">
            <h2 class="cw-network-log-panel__title">Activity log</h2>
            <pre class="cw-network-log" data-log></pre>
        </section>
    `;
	applyNetworkA11y(root);
	return root;
};
//#endregion
//#region ../../modules/views/network-view/src/network.scss?inline
var network_default = "@layer ui-network{.cw-network-view,.cw-network-view-host{block-size:100%;display:flex;flex-direction:column;min-block-size:0;overflow:hidden}.cw-network-view{background:var(--c2-surface,light-dark(#f5f5f5,#121212));color:var(--c2-on-surface,light-dark(#1a1a1a,#e8e8e8));font-family:system-ui,sans-serif;gap:0}.cw-network-view__header{flex:0 0 auto;padding:.85rem 1rem .65rem}.cw-network-view__header h1{font-size:1.15rem;font-weight:650;margin:0}.cw-network-view__header p{font-size:.88rem;margin:.25rem 0 0;opacity:.78}.cw-network-body{display:flex;flex:1 1 auto;flex-direction:column;gap:.75rem;min-block-size:0;overflow:auto;overscroll-behavior:contain;padding:0 1rem .75rem}.cw-network-status-grid{display:grid;gap:.55rem}.cw-network-status-card{background:light-dark(rgba(255,255,255,.72),rgba(255,255,255,.04));border:1px solid light-dark(rgba(0,0,0,.08),rgba(255,255,255,.1));border-radius:10px;display:grid;gap:.35rem;padding:.65rem .75rem}.cw-network-status-card[data-state=ok]{border-color:color-mix(in oklab,#2e7d32 55%,transparent)}.cw-network-status-card[data-state=bad]{border-color:color-mix(in oklab,#c62828 55%,transparent)}.cw-network-status-card[data-state=warn]{border-color:color-mix(in oklab,#ef6c00 55%,transparent)}.cw-network-status-card__title{font-size:.78rem;letter-spacing:.04em;opacity:.72;text-transform:uppercase}.cw-network-status-card__value{font-size:1rem;font-weight:600;word-break:break-word}.cw-network-status-card__detail{font-size:.82rem;opacity:.88;word-break:break-word}.cw-network-actions{display:flex;flex-wrap:wrap;gap:.5rem}.cw-network-actions button{appearance:none;background:light-dark(#fff,#1e1e1e);border:1px solid light-dark(rgba(0,0,0,.12),rgba(255,255,255,.14));border-radius:999px;color:inherit;cursor:pointer;font-size:.88rem;padding:.45rem .85rem}.cw-network-actions button:disabled{cursor:wait;opacity:.55}.cw-network-actions--logs button{font-size:.8rem}.cw-network-dest-field{display:flex;flex-direction:column;font-size:.88rem;gap:.35rem}.cw-network-dest-field input{appearance:none;background:light-dark(#fff,#1e1e1e);border:1px solid light-dark(rgba(0,0,0,.12),rgba(255,255,255,.14));border-radius:.5rem;color:inherit;font-size:.9rem;padding:.5rem .75rem}.cw-network-dest-hint{font-size:.8rem;margin:0;opacity:.8}.cw-network-probes{min-block-size:0}.cw-network-probes,.cw-network-probes [data-probe-list]{display:flex;flex-direction:column;gap:.45rem}.cw-network-probes h2{font-size:.95rem;margin:0}.cw-network-probe-row{background:light-dark(rgba(0,0,0,.04),rgba(255,255,255,.05));border-radius:8px;display:grid;font-size:.82rem;gap:.15rem;padding:.55rem .65rem}.cw-network-probe-row[data-ok=true]{box-shadow:inset 3px 0 0 #2e7d32}.cw-network-probe-row[data-ok=false]{box-shadow:inset 3px 0 0 #c62828}.cw-network-probe-row__head{display:flex;font-weight:600;gap:.5rem;justify-content:space-between}.cw-network-probe-row__error{color:#c62828;word-break:break-word}.cw-network-log-panel{background:light-dark(rgba(0,0,0,.03),rgba(0,0,0,.22));border-block-start:1px solid light-dark(rgba(0,0,0,.1),rgba(255,255,255,.12));display:flex;flex:0 0 auto;flex-direction:column;gap:.35rem;max-block-size:min(32vh,11rem);min-block-size:0;padding:.55rem 1rem .85rem}.cw-network-log-panel__title{flex:0 0 auto;font-size:.72rem;letter-spacing:.04em;margin:0;opacity:.72;text-transform:uppercase}.cw-network-log{background:light-dark(rgba(0,0,0,.05),rgba(0,0,0,.35));border-radius:8px;flex:1 1 auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.75rem;line-height:1.35;margin:0;min-block-size:3.5rem;overflow:auto;padding:.55rem .65rem;white-space:pre-wrap;word-break:break-word}.cw-network-dropzone{background:light-dark(rgba(37,99,235,.04),rgba(37,99,235,.1));border:1.5px dashed light-dark(rgba(0,0,0,.28),rgba(255,255,255,.28));border-radius:10px;margin:.75rem 1rem 0;outline:none;padding:1rem 1.1rem;transition:border-color .15s ease,background .15s ease}.cw-network-dropzone:focus-visible{border-color:light-dark(#2563eb,#60a5fa);box-shadow:0 0 0 2px light-dark(rgba(37,99,235,.25),rgba(96,165,250,.35))}.cw-network-dropzone.is-dragover{background:light-dark(rgba(37,99,235,.12),rgba(37,99,235,.22));border-color:light-dark(#2563eb,#60a5fa)}.cw-network-dropzone__title{font-size:.95rem;font-weight:650}.cw-network-dropzone__hint{font-size:.82rem;margin:.35rem 0 0;opacity:.78}.cw-network-dropzone__status{font-size:.8rem;margin-top:.55rem;min-block-size:1.1em;opacity:.9}}";
//#endregion
//#region ../../modules/views/network-view/src/NetworkStatusPanel.ts
/**
* Network status panel — connection state, HTTP probes, dispatch auth errors.
*/
var isCapacitorNative = () => {
	try {
		const cap = globalThis.Capacitor;
		return typeof cap?.isNativePlatform === "function" && Boolean(cap.isNativePlatform());
	} catch {
		return false;
	}
};
/**
* Public Control SPA on VDS (cwsp.u2re.space) — static UI only.
* WHY: connectWS() intentionally no-ops here so a browser tab does not steal
* the same clientId as Capacitor/Neutralino on the gateway hub.
*/
var isPublicControlSpa = () => {
	try {
		if (isCapacitorNative()) return false;
		if (isNeutralinoNodeClipboardHubOwned()) return false;
		const surface = String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase();
		const host = String(location.hostname || "").toLowerCase();
		if (surface === "cwsp-control") return true;
		if (host === "cwsp.u2re.space" || host === "www.cwsp.u2re.space") return true;
		return location.protocol === "https:" && host !== "localhost" && host !== "127.0.0.1";
	} catch {
		return false;
	}
};
var DEFAULT_CONTROL_PORT = 29110;
var DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";
var readControlAuth = () => {
	try {
		const g = globalThis;
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		return {
			port: Number(auth?.port) || DEFAULT_CONTROL_PORT,
			key: String(auth?.key || DEFAULT_CONTROL_KEY)
		};
	} catch {
		return {
			port: DEFAULT_CONTROL_PORT,
			key: DEFAULT_CONTROL_KEY
		};
	}
};
/** Refresh loopback auth from disk — Cursor.exe often steals :19875; backend may bind :19876+. */
var refreshControlAuthFromDisk = async () => {
	try {
		const g = globalThis;
		const root = typeof g.NL_PATH === "string" ? g.NL_PATH : "";
		const readFile = g.Neutralino?.filesystem?.readFile;
		if (!root || !readFile) return;
		const raw = await readFile(`${root}/.tmp/cwsp-control-auth.json`);
		const parsed = JSON.parse(raw);
		const port = Number(parsed?.port);
		if (!Number.isFinite(port) || port < 1024 || port === 8434) return;
		const next = {
			port,
			key: String(parsed?.key || "cwsp-neutralino-local")
		};
		g.__WEBNATIVE_AUTH__ = next;
		g.__NEUTRALINO_AUTH__ = next;
	} catch {}
};
var probeControlPort = async (port, key) => {
	const ctrl = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(1500) : void 0;
	try {
		const res = await fetch(`http://127.0.0.1:${port}/service/clipboard-hub`, {
			method: "GET",
			headers: { "X-API-Key": key },
			cache: "no-store",
			signal: ctrl
		});
		if (!res.ok) return null;
		const json = await res.json();
		if (typeof json?.running !== "boolean" && typeof json?.connected !== "boolean") return null;
		return json;
	} catch {
		return null;
	}
};
var fetchNodeClipboardHubStatus = async () => {
	try {
		const g = globalThis;
		if (document.documentElement?.dataset?.cwspSurface === "cwsp-control" && !g.__CWS_NODE_CLIPBOARD_HUB__) return null;
	} catch {}
	await refreshControlAuthFromDisk();
	const auth = readControlAuth();
	const candidates = Array.from(new Set([
		auth.port,
		DEFAULT_CONTROL_PORT,
		29110
	].filter((p) => p > 1024)));
	for (const port of candidates) {
		const status = await probeControlPort(port, auth.key);
		if (status) {
			const g = globalThis;
			g.__WEBNATIVE_AUTH__ = {
				port,
				key: auth.key
			};
			g.__NEUTRALINO_AUTH__ = {
				port,
				key: auth.key
			};
			return status;
		}
	}
	return null;
};
var reloadNodeClipboardHub = async () => {
	const discovered = await fetchNodeClipboardHubStatus();
	const { port, key } = readControlAuth();
	const ctrl = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(3e3) : void 0;
	try {
		const res = await fetch(`http://127.0.0.1:${port}/service/clipboard-hub`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": key
			},
			body: JSON.stringify({
				reload: true,
				force: true
			}),
			cache: "no-store",
			signal: ctrl
		});
		if (!res.ok) return discovered;
		return await res.json();
	} catch {
		return discovered;
	}
};
/** Throttle extNode backend.ensure when control host is down. */
var lastBackendEnsureAt = 0;
var lastHubHealAt = 0;
var ensureNeutralinoBackend = async () => {
	const now = Date.now();
	if (now - lastBackendEnsureAt < 8e3) return false;
	lastBackendEnsureAt = now;
	try {
		const NL = globalThis.Neutralino;
		if (!NL?.extensions?.dispatch) return false;
		await NL.extensions.dispatch("extNode", "runNode", {
			function: "backend.ensure",
			parameter: null
		});
		return true;
	} catch {
		return false;
	}
};
/** When hub is running but /ws dropped, force a reconnect (throttled). */
var healDisconnectedHub = async () => {
	const now = Date.now();
	if (now - lastHubHealAt < 1e4) return null;
	lastHubHealAt = now;
	return reloadNodeClipboardHub();
};
var formatProbeLine = (row) => {
	const parts = [`${row.label}: ${row.origin}`];
	if (row.ok) parts.push(`OK (${row.latencyMs ?? "?"}ms)`);
	else if (row.status) parts.push(`FAIL HTTP ${row.status}`);
	if (row.error) parts.push(row.error);
	return parts.join(" — ");
};
var NetworkStatusPanel = class {
	root = null;
	sheet = null;
	wsUnsub = null;
	nodeHubPoll = null;
	running = false;
	logLines = [];
	probeSummary = "";
	els = {
		wsCard: null,
		wsValue: null,
		wsDetail: null,
		nativeCard: null,
		nativeValue: null,
		configDetail: null,
		probeList: null,
		log: null,
		testBtn: null,
		destBtn: null,
		destInput: null,
		reconnectBtn: null,
		filesDropzone: null,
		filesDropStatus: null
	};
	mount(parent) {
		this.sheet ??= loadAsAdopted(network_default);
		this.root = H`
            <div class="cw-network-view" data-view="network">
                <header class="cw-network-view__header">
                    <h1>CWSP Network</h1>
                    <p>Connection status, reachability probes, and dispatch errors.</p>
                </header>

                <div class="cw-network-body">
                    <div class="cw-network-status-grid">
                        <section class="cw-network-status-card" data-state="warn" data-ws-card>
                            <div class="cw-network-status-card__title">WebSocket hub</div>
                            <div class="cw-network-status-card__value" data-ws-value>…</div>
                            <div class="cw-network-status-card__detail" data-ws-detail></div>
                        </section>
                        <section class="cw-network-status-card" data-state="warn" data-native-card hidden>
                            <div class="cw-network-status-card__title">Native runtime</div>
                            <div class="cw-network-status-card__value" data-native-value>…</div>
                        </section>
                        <section class="cw-network-status-card">
                            <div class="cw-network-status-card__title">Configuration</div>
                            <div class="cw-network-status-card__detail" data-config-detail>Loading…</div>
                        </section>
                    </div>

                    <div class="cw-network-actions">
                        <button type="button" data-action="test">Run network test</button>
                        <button type="button" data-action="check-destinations">Check destinations</button>
                        <button type="button" data-action="reconnect">Reconnect WS</button>
                        <button type="button" data-action="open-settings">Settings</button>
                    </div>

                    <label class="cw-network-dest-field">
                        <span>Destination node ids</span>
                        <input type="text" data-dest-ids placeholder="L-196;L-210;L-208" autocomplete="off" />
                    </label>
                    <p class="cw-network-dest-hint">Probe clipboard:isReady to each id via gateway (45.147 / .200) — works for Android↔Android on LAN too.</p>

                    <div class="cw-network-dropzone" data-files-dropzone hidden tabindex="0" role="region" aria-label="Open for Share drop or paste zone">
                        <div class="cw-network-dropzone__title">Drop or paste files to share</div>
                        <p class="cw-network-dropzone__hint">Drop or paste (Ctrl+V) files here to Open for Share to configured peers (Neutralino desk).</p>
                        <div class="cw-network-dropzone__status" data-files-drop-status aria-live="polite"></div>
                    </div>

                    <div class="cw-network-actions cw-network-actions--logs">
                        <button type="button" data-action="copy-frontend-log">Copy Frontend Log</button>
                        <button type="button" data-action="copy-logcat">Copy Logcat</button>
                        <button type="button" data-action="save-page-logs">Save page logs</button>
                    </div>

                    <section class="cw-network-probes">
                        <h2>Probe results</h2>
                        <div data-probe-list></div>
                    </section>
                </div>

                <section class="cw-network-log-panel">
                    <h2 class="cw-network-log-panel__title">Activity log</h2>
                    <pre class="cw-network-log" data-log aria-live="polite"></pre>
                </section>
            </div>
        `;
		this.els.wsCard = this.root.querySelector("[data-ws-card]");
		this.els.wsValue = this.root.querySelector("[data-ws-value]");
		this.els.wsDetail = this.root.querySelector("[data-ws-detail]");
		this.els.nativeCard = this.root.querySelector("[data-native-card]");
		this.els.nativeValue = this.root.querySelector("[data-native-value]");
		this.els.configDetail = this.root.querySelector("[data-config-detail]");
		this.els.probeList = this.root.querySelector("[data-probe-list]");
		this.els.log = this.root.querySelector("[data-log]");
		this.els.testBtn = this.root.querySelector("[data-action=\"test\"]");
		this.els.destBtn = this.root.querySelector("[data-action=\"check-destinations\"]");
		this.els.destInput = this.root.querySelector("[data-dest-ids]");
		this.els.reconnectBtn = this.root.querySelector("[data-action=\"reconnect\"]");
		this.els.filesDropzone = this.root.querySelector("[data-files-dropzone]");
		this.els.filesDropStatus = this.root.querySelector("[data-files-drop-status]");
		applyNetworkA11y(this.root);
		this.els.testBtn?.addEventListener("click", () => void this.runFullTest());
		this.els.destBtn?.addEventListener("click", () => void this.runDestinationCheck());
		this.els.reconnectBtn?.addEventListener("click", () => void this.reconnectWs());
		this.wireFilesDropzone();
		this.root.querySelector("[data-action=\"open-settings\"]")?.addEventListener("click", () => {
			globalThis.dispatchEvent(new CustomEvent("cw:view-open-request", { detail: {
				viewId: "settings",
				target: "minimal"
			} }));
		});
		this.root.querySelector("[data-action=\"copy-frontend-log\"]")?.addEventListener("click", () => {
			this.copyFrontendLog();
		});
		this.root.querySelector("[data-action=\"copy-logcat\"]")?.addEventListener("click", () => {
			this.copyLogcat();
		});
		this.root.querySelector("[data-action=\"save-page-logs\"]")?.addEventListener("click", () => {
			this.savePageLogs();
		});
		parent.replaceChildren(this.root);
		this.bootstrap();
		return this.root;
	}
	unmount() {
		this.wsUnsub?.();
		this.wsUnsub = null;
		if (this.nodeHubPoll) {
			clearInterval(this.nodeHubPoll);
			this.nodeHubPoll = null;
		}
		this.root?.remove();
		this.root = null;
	}
	appendLog(line) {
		const ts = (/* @__PURE__ */ new Date()).toLocaleTimeString();
		this.logLines.unshift(`[${ts}] ${line}`);
		this.logLines = this.logLines.slice(0, 40);
		if (this.els.log) this.els.log.textContent = this.logLines.join("\n");
	}
	setWsUi(connected, detail) {
		if (!this.els.wsCard || !this.els.wsValue) return;
		if (isPublicControlSpa()) {
			this.els.wsCard.dataset.state = "warn";
			this.els.wsValue.textContent = "N/A — Control SPA";
			if (this.els.wsDetail) this.els.wsDetail.textContent = detail || "Hub lives on Neutralino/Capacitor → gateway :8434. This page only runs HTTP probes.";
			return;
		}
		if (isCapacitorNative() && isPreferNativeWebsocketEnabled()) {
			this.els.wsCard.dataset.state = connected ? "ok" : "bad";
			this.els.wsValue.textContent = connected ? "Java CwspBridge Connected" : "Java CwspBridge Disconnected";
			if (this.els.wsDetail) this.els.wsDetail.textContent = detail || "CwspBridgeService holds `/ws` — WebView browser WebSocket is not used.";
			return;
		}
		if (isNeutralinoNodeClipboardHubOwned()) {
			this.els.wsCard.dataset.state = connected ? "ok" : "bad";
			this.els.wsValue.textContent = connected ? "Node clipboard-hub Connected" : "Node clipboard-hub Disconnected";
			if (this.els.wsDetail) this.els.wsDetail.textContent = detail || "LAN clipboard uses Node `/service/clipboard-hub` — not the WebView WebSocket API.";
			return;
		}
		this.els.wsCard.dataset.state = connected ? "ok" : "bad";
		this.els.wsValue.textContent = connected ? "Connected" : "Disconnected";
		if (this.els.wsDetail) this.els.wsDetail.textContent = detail || "";
	}
	async refreshJavaHubStatus() {
		try {
			const result = await invokeCwsNative("coordinator:status", {});
			const echo = result.echo ?? {};
			const connected = Boolean(echo.wsOpen ?? echo.connected ?? result.ok);
			const parts = [echo.daemon === false ? "daemon-stopped" : "daemon", connected ? "ws-open" : "ws-closed"];
			this.setWsUi(connected, parts.join(" · "));
		} catch (error) {
			this.setWsUi(false, "Java coordinator:status unreachable");
			this.appendLog(String(error instanceof Error ? error.message : error));
		}
	}
	applyNodeHubStatus(status) {
		if (!status) {
			this.setWsUi(false, `Node clipboard-hub unreachable (:${readControlAuth().port})`);
			return;
		}
		const connected = Boolean(status.connected);
		const parts = [
			status.running ? "running" : "stopped",
			status.localId ? `id=${status.localId}` : "",
			status.hasToken === false ? "no-token" : "",
			status.hubUrl ? status.hubUrl : "",
			status.lastError ? `err=${status.lastError}` : ""
		].filter(Boolean);
		this.setWsUi(connected, parts.join(" · "));
	}
	renderConfig(settings) {
		if (!this.els.configDetail) return;
		const core = settings?.core;
		const relay = String(core?.endpointUrl ?? "—");
		const direct = String(core?.ops?.directUrl ?? "—");
		const clientId = String(core?.userId ?? "—");
		const route = String(core?.socket?.routeTarget ?? "*");
		this.els.configDetail.textContent = [
			`Relay: ${relay}`,
			`Direct: ${direct}`,
			`Client: ${clientId}`,
			`Route: ${route}`
		].join("\n");
		if (this.els.destInput && !this.els.destInput.value.trim()) {
			const share = String(settings?.shell?.clipboardShareDestinationIds || "").trim();
			this.els.destInput.value = route && route !== "*" ? route : share || "L-196;L-210;L-208";
		}
	}
	renderProbes(snapshot) {
		if (!this.els.probeList) return;
		this.els.probeList.replaceChildren();
		const rows = [...snapshot.probes];
		if (snapshot.dispatch) {
			const d = snapshot.dispatch;
			rows.push({
				label: "Dispatch /api/network/dispatch",
				origin: d.origin,
				ok: d.ok,
				status: d.status,
				statusText: d.statusText,
				error: d.error || (d.bodySnippet ? d.bodySnippet.slice(0, 120) : void 0),
				latencyMs: d.latencyMs
			});
		}
		for (const dest of snapshot.destinations || []) rows.push({
			label: `Destination ${dest.id}`,
			origin: dest.origin || dest.id,
			ok: dest.ok,
			status: dest.status,
			error: dest.error || (dest.bodySnippet ? dest.bodySnippet.slice(0, 120) : void 0),
			latencyMs: dest.latencyMs
		});
		if (!rows.length) {
			const empty = document.createElement("p");
			empty.textContent = "No probes yet — tap Run network test.";
			empty.style.opacity = "0.75";
			empty.style.fontSize = "0.85rem";
			this.els.probeList.append(empty);
			return;
		}
		for (const row of rows) {
			const el = H`
                <div class="cw-network-probe-row" data-ok="${row.ok ? "true" : "false"}">
                    <div class="cw-network-probe-row__head">
                        <span>${row.label}</span>
                        <span>${row.ok ? "OK" : "FAIL"}${row.latencyMs != null ? ` · ${row.latencyMs}ms` : ""}</span>
                    </div>
                    <div>${row.origin}</div>
                    ${row.error ? `<div class="cw-network-probe-row__error">${row.error}</div>` : ""}
                </div>
            `;
			this.els.probeList.append(el);
		}
	}
	/**
	* Neutralino desk: drop or paste files onto the Network view to Open-for-Share.
	* WHY: Explorer Copy is one path; drag-drop / Ctrl+V in the CWSP window are
	* explicit share paths. Absolute paths come from Neutralino/Chromium
	* `File.path`; paste falls back to Node reading OS CF_HDROP.
	*/
	wireFilesDropzone() {
		const zone = this.els.filesDropzone;
		if (!zone) return;
		if (!isNeutralinoNodeClipboardHubOwned() || isPublicControlSpa()) {
			zone.hidden = true;
			return;
		}
		zone.hidden = false;
		const setStatus = (msg) => {
			if (this.els.filesDropStatus) this.els.filesDropStatus.textContent = msg;
			this.appendLog(msg);
		};
		const runIngress = (label, paths, fromClipboard) => {
			this.ingressFilesForShare(paths, fromClipboard).then((msg) => setStatus(msg), (err) => setStatus(`${label} failed: ${err instanceof Error ? err.message : String(err)}`));
		};
		const onDrag = (e) => {
			e.preventDefault();
			e.stopPropagation();
			zone.classList.toggle("is-dragover", e.type === "dragover" || e.type === "dragenter");
			if (e.type === "dragleave" || e.type === "drop") zone.classList.remove("is-dragover");
		};
		zone.addEventListener("dragenter", onDrag);
		zone.addEventListener("dragover", onDrag);
		zone.addEventListener("dragleave", onDrag);
		zone.addEventListener("drop", (e) => {
			onDrag(e);
			runIngress("Drop", this.pathsFromFileList(e.dataTransfer?.files), false);
		});
		const onPaste = (e) => {
			const t = e.target;
			if (t && (t.closest("input, textarea, [contenteditable='true']") || t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
			const paths = this.pathsFromFileList(e.clipboardData?.files);
			const hasFileItems = Array.from(e.clipboardData?.items || []).some((it) => it.kind === "file");
			const types = Array.from(e.clipboardData?.types || []);
			const plain = String(e.clipboardData?.getData("text/plain") || "").trim();
			if (!(hasFileItems || paths.length > 0 || types.some((ty) => /Files|text\/uri-list|CF_HDROP/i.test(ty)) || zone.contains(t) || t === zone || !plain && this.root.contains(t))) return;
			e.preventDefault();
			e.stopPropagation();
			runIngress("Paste", paths, paths.length === 0);
		};
		zone.addEventListener("paste", onPaste);
		this.root.addEventListener("paste", onPaste);
	}
	/** Absolute paths from Neutralino/WebView2 File.path (empty in normal browsers). */
	pathsFromFileList(files) {
		if (!files || files.length === 0) return [];
		const paths = [];
		for (let i = 0; i < files.length; i++) {
			const f = files.item(i);
			if (!f) continue;
			const p = String(f.path || "").trim();
			if (p) paths.push(p);
		}
		return paths;
	}
	async ingressFilesForShare(paths, fromClipboard) {
		if (!fromClipboard && paths.length === 0) return "No files to share.";
		await refreshControlAuthFromDisk();
		const auth = readControlAuth();
		const res = await fetch(`http://127.0.0.1:${auth.port}/service/files-ingress`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": auth.key
			},
			body: JSON.stringify(fromClipboard ? {
				fromClipboard: true,
				paths
			} : { paths })
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok || body.ok === false) throw new Error(String(body.error || `HTTP ${res.status}`));
		return `Shared ${Number(body.fileCount || paths.length || 0)} file(s) → transfer ${String(body.transferId || "?")} (${String(body.phase || "ok")})`;
	}
	async bootstrap() {
		initFrontendDebugCapture();
		const publicHttpsSpa = isPublicControlSpa();
		if (publicHttpsSpa) {
			this.els.nativeCard?.removeAttribute("hidden");
			if (this.els.nativeValue) this.els.nativeValue.textContent = "Browser · no local hub";
			if (this.els.nativeCard) this.els.nativeCard.dataset.state = "warn";
			this.setWsUi(false);
			if (this.els.reconnectBtn) {
				this.els.reconnectBtn.disabled = true;
				this.els.reconnectBtn.title = "Fleet /ws is owned by Neutralino/Capacitor — use Run network test here.";
			}
			const settings = await loadSettings().catch(() => null);
			this.renderConfig(settings);
			this.appendLog("Control SPA — WebSocket hub N/A (use Neutralino/Capacitor for live /ws).");
			this.appendLog("Ready — tap Run network test for HTTP/dispatch probes.");
			return;
		}
		if (!publicHttpsSpa && isNeutralinoNodeClipboardHubOwned()) {
			this.els.nativeCard?.removeAttribute("hidden");
			if (this.els.nativeValue) this.els.nativeValue.textContent = "Node clipboard-hub";
			if (this.els.nativeCard) this.els.nativeCard.dataset.state = "ok";
			const refresh = async () => {
				try {
					await refreshControlAuthFromDisk();
					let status = await fetchNodeClipboardHubStatus();
					if (status?.running && !status.connected) {
						const healed = await healDisconnectedHub();
						if (healed) status = healed;
					}
					this.applyNodeHubStatus(status);
					if (!status) {
						if (await ensureNeutralinoBackend()) this.appendLog("Requested backend.ensure (control unreachable).");
					}
				} catch (error) {
					this.applyNodeHubStatus(null);
					ensureNeutralinoBackend();
					this.appendLog(String(error instanceof Error ? error.message : error));
				}
			};
			await refresh();
			this.nodeHubPoll = setInterval(() => void refresh(), 2500);
			const onVisible = () => {
				if (document.visibilityState !== "visible") return;
				(async () => {
					const status = await fetchNodeClipboardHubStatus();
					if (!status) {
						if (await ensureNeutralinoBackend()) this.appendLog("Wake: backend.ensure (control was down).");
						return;
					}
					if (status.running && !status.connected) {
						const healed = await healDisconnectedHub();
						if (healed) {
							this.applyNodeHubStatus(healed);
							this.appendLog("Wake: clipboard-hub reload requested.");
						}
					}
				})();
			};
			document.addEventListener("visibilitychange", onVisible);
			window.addEventListener("pageshow", onVisible);
			const settings = await loadSettings().catch(() => null);
			this.renderConfig(settings);
			this.appendLog("Ready — WebSocket status from Node clipboard-hub (not WebView).");
			return;
		}
		if (isCapacitorNative() && isPreferNativeWebsocketEnabled()) {
			this.els.nativeCard?.removeAttribute("hidden");
			try {
				const info = await CwsBridge.getShellInfo();
				if (this.els.nativeValue) this.els.nativeValue.textContent = info.native ? `Capacitor · Java /ws · ${info.platform ?? "android"}` : "Web fallback";
				if (this.els.nativeCard) this.els.nativeCard.dataset.state = info.native ? "ok" : "warn";
			} catch (error) {
				if (this.els.nativeValue) this.els.nativeValue.textContent = "Bridge unavailable";
				this.appendLog(String(error instanceof Error ? error.message : error));
			}
			await this.refreshJavaHubStatus();
			this.nodeHubPoll = setInterval(() => void this.refreshJavaHubStatus(), 2500);
			const onCapVisible = () => {
				if (document.visibilityState !== "visible") return;
				(async () => {
					await this.refreshJavaHubStatus();
					if (!(this.els.wsCard?.dataset.state === "ok")) {
						this.appendLog("Wake: Java /ws reconnect…");
						try {
							const result = await invokeCwsNative("runtime:reload-settings", {});
							await this.refreshJavaHubStatus();
							this.appendLog(result?.ok ? "Wake: Java /ws reconnect requested." : "Wake: Java /ws reconnect failed.");
						} catch (error) {
							this.appendLog(String(error instanceof Error ? error.message : error));
						}
					}
				})();
			};
			document.addEventListener("visibilitychange", onCapVisible);
			window.addEventListener("pageshow", onCapVisible);
			const settings = await loadSettings().catch(() => null);
			this.renderConfig(settings);
			this.appendLog("Ready — WebSocket status from Java CwspBridgeService (not WebView).");
			return;
		}
		initWebSocket(null);
		this.wsUnsub = onWSConnectionChange((connected) => {
			this.setWsUi(connected);
		});
		this.setWsUi(isWSConnected());
		if (isCapacitorNative()) {
			this.els.nativeCard?.removeAttribute("hidden");
			try {
				const info = await CwsBridge.getShellInfo();
				if (this.els.nativeValue) this.els.nativeValue.textContent = info.native ? `Capacitor · ${info.platform ?? "android"}` : "Web fallback";
				if (this.els.nativeCard) this.els.nativeCard.dataset.state = info.native ? "ok" : "warn";
			} catch (error) {
				if (this.els.nativeValue) this.els.nativeValue.textContent = "Bridge unavailable";
				this.appendLog(String(error instanceof Error ? error.message : error));
			}
		}
		const settings = await loadSettings().catch(() => null);
		this.renderConfig(settings);
		this.appendLog("Ready — tap Run network test for full probe.");
	}
	async reconnectWs() {
		if (isPublicControlSpa()) {
			this.appendLog("Reconnect WS skipped — Control SPA does not own fleet /ws (would kick Capacitor/Neutralino).");
			this.appendLog("Use Run network test / Check destinations, or reconnect from the desk/phone app.");
			this.setWsUi(false);
			return;
		}
		if (isCapacitorNative() && isPreferNativeWebsocketEnabled()) {
			this.appendLog("Reconnecting Java CwspBridge /ws…");
			try {
				const result = await invokeCwsNative("runtime:reload-settings", {});
				await this.refreshJavaHubStatus();
				this.appendLog(result?.ok ? "Java /ws reconnect requested" : "Java /ws reconnect failed");
			} catch (error) {
				this.appendLog(String(error instanceof Error ? error.message : error));
			}
			return;
		}
		if (isNeutralinoNodeClipboardHubOwned()) {
			this.appendLog("Reloading Node clipboard-hub…");
			try {
				const status = await reloadNodeClipboardHub();
				this.applyNodeHubStatus(status);
				this.appendLog(status?.connected ? "Node clipboard-hub reconnected" : `Node clipboard-hub not connected${status?.lastError ? `: ${status.lastError}` : ""}`);
			} catch (error) {
				this.applyNodeHubStatus(null);
				this.appendLog(String(error instanceof Error ? error.message : error));
			}
			return;
		}
		this.appendLog("Reconnecting WebSocket…");
		disconnectWS();
		connectWS();
	}
	async runFullTest() {
		if (this.running) return;
		this.running = true;
		if (this.els.testBtn) this.els.testBtn.disabled = true;
		try {
			const settings = await loadSettings().catch(() => null);
			this.renderConfig(settings);
			const core = settings?.core;
			const relay = String(core?.endpointUrl ?? "");
			const direct = String(core?.ops?.directUrl ?? "");
			const clientId = String(core?.userId ?? "");
			const eco = resolveEcosystemToken(settings);
			const token = eco;
			const accessToken = eco;
			this.appendLog("Running /lna-probe on relay, direct, and fallback hosts…");
			const webnative = await runWebnativeBackendProbe({
				relay,
				direct
			}, {
				clientId,
				token,
				accessToken
			});
			let probes;
			let dispatch;
			if (webnative?.probes.length) {
				probes = webnative.probes;
				dispatch = webnative.dispatch;
				this.appendLog("Probes via WebNative backend control RPC (/service/endpoint-probe).");
			} else {
				probes = await runEndpointProbes({
					relay,
					direct
				});
				if (isCapacitorNative() && probes.length && probes[0]?.label.startsWith("Relay")) this.appendLog("Probes via native Java bridge (network:probe).");
			}
			for (const row of probes) this.appendLog(formatProbeLine(row));
			const okCount = probes.filter((p) => p.ok).length;
			if (!dispatch && (okCount || relay || direct)) {
				this.appendLog(okCount ? `Testing dispatch on ${okCount} reachable host(s)…` : "Testing dispatch on configured hosts (all probes failed)…");
				dispatch = await runDispatchProbeWithFallback(probes, {
					relay,
					direct
				}, {
					clientId,
					token,
					accessToken
				});
			}
			if (dispatch) if (dispatch.ok) this.appendLog(`Dispatch OK (${dispatch.latencyMs ?? "?"}ms)`);
			else this.appendLog(`Dispatch FAIL: ${dispatch.error ?? dispatch.status}${dispatch.bodySnippet ? ` — ${dispatch.bodySnippet.slice(0, 80)}` : ""}`);
			this.renderProbes({
				probes,
				dispatch
			});
			this.probeSummary = [...probes.map(formatProbeLine), dispatch ? `Dispatch: ${dispatch.ok ? "OK" : "FAIL"} ${dispatch.origin} ${dispatch.error ?? dispatch.status ?? ""}` : ""].filter(Boolean).join("\n");
			if (isPublicControlSpa()) this.setWsUi(false);
			else if (!isNeutralinoNodeClipboardHubOwned() && (!isCapacitorNative() || !isPreferNativeWebsocketEnabled())) {
				if (!isWSConnected() && isMaintainHubSocketConnectionEnabled()) connectWS();
			} else if (isNeutralinoNodeClipboardHubOwned()) try {
				this.applyNodeHubStatus(await fetchNodeClipboardHubStatus());
			} catch {}
			else if (isCapacitorNative() && isPreferNativeWebsocketEnabled()) await this.refreshJavaHubStatus();
		} catch (error) {
			this.appendLog(String(error instanceof Error ? error.message : error));
		} finally {
			this.running = false;
			if (this.els.testBtn) this.els.testBtn.disabled = false;
		}
	}
	async runDestinationCheck() {
		if (this.running) return;
		this.running = true;
		if (this.els.destBtn) this.els.destBtn.disabled = true;
		if (this.els.testBtn) this.els.testBtn.disabled = true;
		try {
			const settings = await loadSettings().catch(() => null);
			this.renderConfig(settings);
			const core = settings?.core;
			const relay = String(core?.endpointUrl ?? "");
			const direct = String(core?.ops?.directUrl ?? "");
			const clientId = String(core?.userId ?? "");
			const eco = resolveEcosystemToken(settings);
			const ids = parseDestinationIds(this.els.destInput?.value?.trim() || String(core?.socket?.routeTarget || "") || String(settings?.shell?.clipboardShareDestinationIds || ""));
			if (!ids.length) {
				this.appendLog("No destination ids — enter L-196;L-210;… or set routeTarget in Settings.");
				return;
			}
			this.appendLog(`Checking ${ids.length} destination(s) via gateway: ${ids.join(", ")}`);
			const destinations = await probeDestinationLinks(ids, {
				relay,
				direct
			}, {
				clientId,
				token: eco,
				accessToken: eco
			});
			for (const row of destinations) this.appendLog(`Dest ${row.id}: ${row.ok ? "OK" : "FAIL"}${row.latencyMs != null ? ` (${row.latencyMs}ms)` : ""}${row.error ? ` — ${row.error}` : ""}`);
			this.renderProbes({
				probes: [],
				destinations
			});
			this.probeSummary = destinations.map((d) => `Dest ${d.id}: ${d.ok ? "OK" : "FAIL"} ${d.origin} ${d.error ?? d.status ?? ""}`).join("\n");
		} catch (error) {
			this.appendLog(String(error instanceof Error ? error.message : error));
		} finally {
			this.running = false;
			if (this.els.destBtn) this.els.destBtn.disabled = false;
			if (this.els.testBtn) this.els.testBtn.disabled = false;
		}
	}
	pageLogText() {
		return [...this.logLines].reverse().join("\n");
	}
	async copyFrontendLog() {
		try {
			await initFrontendDebugCapture().flush?.();
		} catch {}
		const ok = await copyTextToClipboard(collectFrontendLogText(600));
		this.appendLog(ok ? "Frontend log copied to clipboard." : "Copy failed — check clipboard permission.");
	}
	async copyLogcat() {
		this.appendLog("Reading logcat…");
		const ok = await copyTextToClipboard(await collectNativeLogcatText(600));
		this.appendLog(ok ? "Logcat copied to clipboard." : "Logcat copy failed.");
	}
	async savePageLogs() {
		this.appendLog("Building page log export…");
		const combined = await buildCombinedPageLog(this.pageLogText(), this.probeSummary);
		const name = timestampFilename("cwsp-network");
		saveTextAsDownload(name, combined);
		this.appendLog(`Saved ${name}`);
	}
};
//#endregion
//#region ../../modules/views/network-view/src/network-capability.ts
/**
* Detect Network surface from runtime globals (Capacitor → WebNative → web).
* WHY: mirrors settings-view surface detection without importing that package.
*/
var detectNetworkSurface = (g = globalThis) => {
	try {
		if (typeof g.Capacitor?.isNativePlatform === "function" && g.Capacitor.isNativePlatform()) return "capacitor";
	} catch {}
	try {
		if (g.__WEBNATIVE_AUTH__ || g.__CWS_WEBNATIVE_BOOT__) return "webnative";
	} catch {}
	return "web";
};
var cap = (id, layer, state, extra = {}) => ({
	id,
	layer,
	state,
	...extra
});
/**
* Resolve per-surface Network capabilities.
*
* Transport = WS / HTTP probe / dispatch reachability.
* Platform = native bridge or WebNative control RPC (how probes actually run).
* Diagnostics = log export paths (frontend always; logcat Capacitor-only).
*/
var resolveNetworkCapabilities = (surface, hints = {}) => {
	const wsNativeOwned = surface === "capacitor" && Boolean(hints.preferNativeWebsocket);
	const transport = [
		cap("transport.ws", "transport", wsNativeOwned ? hints.nativeBridgeReady ? "available" : "degraded" : hints.wsConnected ? "available" : "unavailable", {
			implementation: wsNativeOwned ? "native-java-ws" : "webview-ws",
			reason: wsNativeOwned ? hints.nativeBridgeReady ? "CwspRuntime owns /ws" : "Native WS preferred but bridge not ready" : hints.wsConnected ? "WebView hub connected" : "WebView hub disconnected"
		}),
		cap("transport.http-probe", "transport", hints.httpProbeReady === false ? "unavailable" : "available", {
			implementation: surface === "capacitor" ? "native-bridge-or-fetch" : surface === "webnative" ? "webnative-control-rpc" : "browser-fetch",
			reason: hints.httpProbeReady === false ? "No reachable /lna-probe candidate" : "Probe path enabled for surface"
		}),
		cap("transport.dispatch", "transport", hints.dispatchReady === false ? "unavailable" : "available", {
			implementation: surface === "capacitor" ? "network:dispatch-probe" : surface === "webnative" ? "webnative-endpoint-probe" : "http-dispatch",
			reason: hints.dispatchReady === false ? "Dispatch probe path not ready" : "Dispatch probe path enabled"
		})
	];
	const platform = surface === "capacitor" ? [cap("platform.native-bridge", "platform", hints.nativeBridgeReady ? "available" : "unavailable", {
		implementation: "CwsBridge",
		reason: hints.nativeBridgeReady ? "Native IPC ready" : "Native bridge unavailable"
	}), cap("platform.webnative-control", "platform", "unsupported", { reason: "WebNative control RPC is desktop-only" })] : surface === "webnative" ? [cap("platform.native-bridge", "platform", "unsupported", { reason: "Capacitor native bridge is Android-only" }), cap("platform.webnative-control", "platform", hints.webnativeControlReady === false ? "unavailable" : "available", {
		implementation: "/service/endpoint-probe",
		reason: hints.webnativeControlReady === false ? "WebNative auth/control port missing" : "WebNative control RPC available"
	})] : [cap("platform.native-bridge", "platform", "unsupported", { reason: "Browser surface has no native bridge" }), cap("platform.webnative-control", "platform", "unsupported", { reason: "Browser surface has no WebNative control RPC" })];
	const diagnostics = [
		cap("diagnostics.frontend-log", "diagnostics", hints.frontendLogReady === false ? "degraded" : "available", {
			implementation: "__CWSP_FRONTEND_DEBUG__",
			reason: hints.frontendLogReady === false ? "Frontend debug capture not started" : "Frontend log ring available"
		}),
		cap("diagnostics.logcat", "diagnostics", surface === "capacitor" ? hints.nativeBridgeReady ? "available" : "unavailable" : "unsupported", {
			implementation: surface === "capacitor" ? "debug:logcat" : void 0,
			reason: surface === "capacitor" ? hints.nativeBridgeReady ? "Native logcat channel available" : "Logcat requires native bridge" : "Logcat is Capacitor/Android-only"
		}),
		cap("diagnostics.page-export", "diagnostics", "available", {
			implementation: "download-blob",
			reason: "Page log download always available in Network view"
		})
	];
	return [
		...transport,
		...platform,
		...diagnostics
	];
};
/** True when the surface can run Network probes (platform path + http-probe). */
var isNetworkProbePathReady = (surface, caps) => {
	const byId = new Map(caps.map((c) => [c.id, c]));
	const http = byId.get("transport.http-probe");
	if (!http || http.state === "unavailable") return false;
	if (surface === "capacitor") return byId.get("platform.native-bridge")?.state === "available" || http.state === "available";
	if (surface === "webnative") return byId.get("platform.webnative-control")?.state === "available";
	return http.state === "available";
};
var summarizeNetworkCapabilities = (surface, hints = {}) => {
	const all = resolveNetworkCapabilities(surface, hints);
	const transport = all.filter((c) => c.layer === "transport");
	const platform = all.filter((c) => c.layer === "platform");
	const diagnostics = all.filter((c) => c.layer === "diagnostics");
	const ready = isNetworkProbePathReady(surface, all);
	return {
		surface,
		ready,
		transport,
		platform,
		diagnostics,
		blocker: ready ? void 0 : all.find((c) => c.state === "unavailable" && (c.id === "transport.http-probe" || c.id === "platform.native-bridge" || c.id === "platform.webnative-control"))
	};
};
//#endregion
//#region ../../modules/views/network-view/src/index.ts
var NetworkView = class {
	id = "network";
	name = "Network";
	icon = "wifi-high";
	options;
	element = null;
	panel = null;
	lifecycle = {
		onMount: () => {
			if (!this.element) return;
			this.panel ??= new NetworkStatusPanel();
			this.panel.mount(this.element);
		},
		onUnmount: () => {
			this.panel?.unmount();
			this.panel = null;
			this.element = null;
		},
		onShow: () => {
			if (!this.panel && this.element) {
				this.panel = new NetworkStatusPanel();
				this.panel.mount(this.element);
			}
		}
	};
	constructor(options = {}) {
		this.options = options;
	}
	render = (options) => {
		if (options) this.options = {
			...this.options,
			...options
		};
		this.panel?.unmount();
		this.panel = null;
		this.element = document.createElement("div");
		this.element.className = "cw-network-view-host";
		this.element.dataset.view = "network";
		return this.element;
	};
	getToolbar() {
		return null;
	}
};
function createNetworkView(options) {
	return new NetworkView(options);
}
//#endregion
export { NETWORK_A11Y, NetworkView, applyNetworkA11y, auditNetworkA11y, createNetworkA11yFixture, createNetworkView, createNetworkView as default, detectNetworkSurface, isNetworkProbePathReady, labelForProbeCandidate, normalizeProbeOrigin, pickDispatchOrigin, resolveNetworkCapabilities, summarizeNetworkCapabilities };
