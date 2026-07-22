//#region src/shared/other/config/settings/crx-control-session.ts
/** chrome.storage.local key — never sessionStorage (must survive browser restart). */
var CRX_CONTROL_SESSION_KEY = "cwsp-control-session-v1";
var chromeApi = () => {
	try {
		return typeof chrome !== "undefined" && chrome?.storage?.local ? chrome : null;
	} catch {
		return null;
	}
};
/** INVARIANT: Origin used for pair/begin must match later X-Control-Session validation. */
var crxExtensionOrigin = () => {
	try {
		const c = chromeApi();
		if (c?.runtime?.id) return `chrome-extension://${c.runtime.id}`;
	} catch {}
	try {
		const o = String(globalThis.location?.origin || "").trim().replace(/\/+$/, "");
		if (o.toLowerCase().startsWith("chrome-extension://")) return o;
	} catch {}
	return "";
};
var readCrxControlSession = async () => {
	const c = chromeApi();
	if (!c) return null;
	try {
		const raw = (await c.storage.local.get(CRX_CONTROL_SESSION_KEY))?.[CRX_CONTROL_SESSION_KEY];
		if (!raw || typeof raw !== "object") return null;
		const token = String(raw.token || "").trim();
		const origin = String(raw.origin || "").trim();
		const controlHost = String(raw.controlHost || "").trim();
		const expiresAt = Number(raw.expiresAt) || 0;
		if (!token || !origin || expiresAt <= Date.now()) return null;
		return {
			token,
			origin,
			controlHost,
			expiresAt,
			persistent: true,
			pairedAt: Number(raw.pairedAt) || 0
		};
	} catch {
		return null;
	}
};
var writeCrxControlSession = async (session) => {
	const c = chromeApi();
	if (!c) return;
	await c.storage.local.set({ [CRX_CONTROL_SESSION_KEY]: session });
};
var clearCrxControlSession = async () => {
	const c = chromeApi();
	if (!c) return;
	try {
		await c.storage.local.remove(CRX_CONTROL_SESSION_KEY);
	} catch {}
};
/** Session token for Control HTTP when Origin is chrome-extension://. */
var getCrxControlSessionToken = async () => {
	return (await readCrxControlSession())?.token || "";
};
var normalizeDeviceCode = (raw) => String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/**
* Pair CRX with desk/phone Control (publicToken + live 20s deviceCode).
* Desk Neutralino auto-accepts; Android may require Accept notification.
*/
var pairCrxControl = async (opts) => {
	const origin = crxExtensionOrigin();
	if (!origin) return {
		ok: false,
		error: "Missing chrome-extension origin"
	};
	const controlHost = toControlHttpOrigin(opts.controlOrigin);
	const publicToken = String(opts.publicToken || "").trim();
	const deviceCode = normalizeDeviceCode(opts.deviceCode);
	if (!controlHost) return {
		ok: false,
		error: "Control host required"
	};
	if (!publicToken || publicToken.length < 8) return {
		ok: false,
		error: "Public token required"
	};
	if (!deviceCode || deviceCode.length < 4) return {
		ok: false,
		error: "Device code required"
	};
	let beginBody;
	const crxHeaders = (extra) => ({
		"Content-Type": "application/json",
		"X-Skip-Legacy-Key": "1",
		"X-Control-Origin": origin,
		...extra || {}
	});
	try {
		const res = await fetch(`${controlHost}/service/pair/begin`, {
			method: "POST",
			headers: crxHeaders(),
			body: JSON.stringify({
				origin,
				publicToken,
				deviceCode,
				clientLabel: `chrome-crx ${origin}`
			}),
			cache: "no-store",
			credentials: "omit"
		});
		beginBody = await res.json().catch(() => ({}));
		if (!res.ok) return {
			ok: false,
			error: String(beginBody?.error || `Pairing failed (HTTP ${res.status})`)
		};
		console.log("[CRX Control] pair/begin ok", controlHost, "session=", Boolean(beginBody?.session), "state=", beginBody?.state);
	} catch {
		return {
			ok: false,
			error: "Cannot reach Control (is Neutralino/Capacitor running?)"
		};
	}
	let sessionToken = String(beginBody?.session || "").trim();
	let expiresAt = Number(beginBody?.sessionExpiresAt) || 0;
	const pairId = String(beginBody?.pairId || "").trim();
	if (!sessionToken && pairId) {
		const deadline = Date.now() + 55e3;
		while (Date.now() < deadline && !sessionToken) {
			await sleep(800);
			try {
				const body = await (await fetch(`${controlHost}/service/pair/status?pairId=${encodeURIComponent(pairId)}`, {
					method: "GET",
					headers: crxHeaders(),
					cache: "no-store",
					credentials: "omit"
				})).json().catch(() => ({}));
				if (body?.session) {
					sessionToken = String(body.session).trim();
					expiresAt = Number(body.sessionExpiresAt) || expiresAt;
					break;
				}
				if (body?.state === "denied" || body?.state === "expired") return {
					ok: false,
					error: `Pairing ${body.state}`
				};
			} catch {}
		}
	}
	if (!sessionToken) return {
		ok: false,
		error: "No session yet — Accept the pair on the phone, or check the device code"
	};
	if (!expiresAt || expiresAt < Date.now()) expiresAt = Date.now() + 10 * 365 * 24 * 60 * 6e4;
	try {
		const verify = await fetch(`${controlHost}/service/config`, {
			method: "GET",
			headers: crxHeaders({ "X-Control-Session": sessionToken }),
			cache: "no-store",
			credentials: "omit"
		});
		if (!verify.ok) return {
			ok: false,
			error: `Session rejected by Control at ${controlHost} (HTTP ${verify.status})` + (verify.status === 401 || verify.status === 403 ? " — redeploy Neutralino (Origin-less CRX session fix + chrome-extension allowlist)" : "")
		};
	} catch {
		return {
			ok: false,
			error: "Cannot verify session against /service/config"
		};
	}
	const session = {
		token: sessionToken,
		origin,
		controlHost,
		expiresAt,
		persistent: true,
		pairedAt: Date.now()
	};
	await writeCrxControlSession(session);
	return {
		ok: true,
		session
	};
};
/** Refresh status text for CWSP tab Control pairing UI. */
var formatCrxControlSessionStatus = async () => {
	const s = await readCrxControlSession();
	if (!s) return "Control: not paired — Copy & Share / Paste by CWSP disabled";
	return `Control: paired (persistent) → ${s.controlHost.replace(/^https?:\/\//i, "")}`;
};
var normalizeControlOrigin = (raw) => String(raw || "").trim().replace(/\/+$/, "");
var isLoopbackHostname = (host) => {
	const h = String(host || "").trim().toLowerCase().replace(/^\[|\]$/g, "");
	return h === "127.0.0.1" || h === "localhost" || h === "::1";
};
/**
* INVARIANT: desk Neutralino Control RPC is plain HTTP on loopback.
* HTTPS to :8434 hits the hub TLS socket (or nothing) → ERR_SSL_PROTOCOL_ERROR.
*/
var toControlHttpOrigin = (raw) => {
	const n = normalizeControlOrigin(raw);
	if (!n) return "";
	try {
		const u = new URL(/^https?:\/\//i.test(n) ? n : `http://${n}`);
		const host = u.hostname || "127.0.0.1";
		let port = u.port;
		if (!port) port = u.protocol === "https:" ? "8434" : "80";
		if (port === "443" || port === "80") port = "8434";
		if (isLoopbackHostname(host)) return `http://${host === "::1" ? "[::1]" : host}:${port}`;
		return `${u.protocol}//${host}:${port}`;
	} catch {
		return n.replace(/^https:/i, "http:");
	}
};
/**
* Candidate Control HTTP origins (Local hub + Neutralino sidecar).
* WHY: never offer https://127.0.0.1 — Control listen is HTTP.
*/
var crxControlPairCandidateOrigins = (localHubUrl, preferred = []) => {
	const out = [];
	const push = (raw) => {
		const o = toControlHttpOrigin(raw);
		if (o) out.push(o);
	};
	for (const p of preferred) push(p);
	push("http://127.0.0.1:29110");
	push(localHubUrl || "");
	try {
		const ds = String(globalThis.document?.documentElement?.dataset?.cwspControlOrigin || "").trim();
		if (ds) push(ds);
	} catch {}
	push("http://127.0.0.1:8434");
	for (let p = 29111; p <= 29114; p++) push(`http://127.0.0.1:${p}`);
	const seen = /* @__PURE__ */ new Set();
	const ranked = [];
	for (const o of out) {
		if (seen.has(o)) continue;
		seen.add(o);
		ranked.push(o);
	}
	ranked.sort((a, b) => {
		const score = (x) => /:29110$/.test(x) ? 0 : /:8434$/.test(x) ? 2 : 1;
		return score(a) - score(b);
	});
	return ranked;
};
var HELLO_TIMEOUT_MS = 900;
/** Probe Control pairing hello (surface + token suffix for UI match). */
var probeControlPairHello = async (controlOrigin) => {
	const origin = toControlHttpOrigin(controlOrigin);
	if (!origin) return null;
	try {
		const signal = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(HELLO_TIMEOUT_MS) : void 0;
		const res = await fetch(`${origin}/service/pair/hello`, {
			method: "GET",
			headers: { "X-Skip-Legacy-Key": "1" },
			cache: "no-store",
			credentials: "omit",
			signal
		});
		if (!res.ok) return null;
		const body = await res.json().catch(() => null);
		if (!body || !(body.pairing === true || body.ok === true || Number(body.deviceCodePeriodMs) > 0)) return null;
		return {
			origin,
			surface: String(body.control?.surface || "").trim(),
			publicTokenSuffix: String(body.publicTokenSuffix || body.control?.publicTokenSuffix || "").trim()
		};
	} catch {
		return null;
	}
};
/** Live Neutralino Control origins — prefer :29110 / surface=neutralino-node. */
var discoverLiveControlOrigins = async (candidates) => {
	const ordered = [...new Set(candidates.map(toControlHttpOrigin).filter(Boolean))];
	let live = (await Promise.all(ordered.map((o) => probeControlPairHello(o)))).filter((x) => Boolean(x));
	const neut = live.filter((x) => x.surface === "neutralino-node");
	if (neut.length) live = neut;
	live.sort((a, b) => {
		const score = (x) => /:29110$/.test(x.origin) ? 0 : x.surface === "neutralino-node" ? 1 : 2;
		return score(a) - score(b);
	});
	if (live.length) {
		console.log("[CRX Control] pair hello live:", live.map((x) => `${x.origin}(${x.surface || "?"};…${x.publicTokenSuffix || "????"})`).join(", "));
		return live;
	}
	console.warn("[CRX Control] no /service/pair/hello — falling back to :29110 then :8434");
	return [{
		origin: "http://127.0.0.1:29110",
		surface: "",
		publicTokenSuffix: ""
	}, {
		origin: "http://127.0.0.1:8434",
		surface: "",
		publicTokenSuffix: ""
	}];
};
/**
* Open pairing modal, then pair against Neutralino Control (:29110 first).
*/
var pairCrxControlWithModal = async (opts) => {
	const { showCrxControlPairModal, clearCrxPublicTokenHint } = await import("./crx-control-pair-modal.js");
	const existing = await readCrxControlSession();
	const preferred = [
		"http://127.0.0.1:29110",
		...opts?.preferredOrigins || [],
		...existing?.controlHost ? [existing.controlHost] : []
	];
	const live = await discoverLiveControlOrigins(crxControlPairCandidateOrigins(opts?.localHubUrl, preferred));
	const primary = live[0];
	let lastError = "";
	let ignoreHint = false;
	for (let attempt = 0; attempt < 3; attempt++) {
		const creds = await showCrxControlPairModal({
			error: lastError || void 0,
			title: attempt ? "Pair Control — try again" : "Pair Control",
			publicTokenSuffix: primary?.publicTokenSuffix,
			controlOrigin: primary?.origin,
			ignoreStoredHint: ignoreHint || attempt > 0
		});
		if (!creds) return {
			ok: false,
			error: "Cancelled",
			cancelled: true
		};
		const suffix = primary?.publicTokenSuffix || "";
		if (suffix && !creds.publicToken.endsWith(suffix)) {
			await clearCrxPublicTokenHint();
			ignoreHint = true;
			lastError = `Public token must end with …${suffix} (copy from Neutralino CWSP → Control pairing, then Refresh).`;
			continue;
		}
		const result = await pairCrxControlAuto({
			publicToken: creds.publicToken,
			deviceCode: creds.deviceCode,
			localHubUrl: opts?.localHubUrl,
			preferredOrigins: preferred,
			liveHosts: live
		});
		if (result.ok) return result;
		lastError = result.error;
		if (/invalid public token/i.test(result.error)) {
			await clearCrxPublicTokenHint();
			ignoreHint = true;
			lastError = `Invalid public token for ${primary?.origin || ":29110"}` + (suffix ? ` (expected …${suffix})` : "") + " — copy again from Neutralino after Refresh / Regenerate.";
			continue;
		}
		if (/invalid|expired|origin not allowed/i.test(result.error)) {
			if (/origin not allowed/i.test(result.error)) lastError = "Origin not allowed — redeploy Neutralino on desk (chrome-extension Control allowlist).";
			continue;
		}
		return result;
	}
	return {
		ok: false,
		error: lastError || "Pairing failed"
	};
};
/** Pair against already-discovered live Control hosts (29110 first). */
var pairCrxControlAuto = async (opts) => {
	const live = opts.liveHosts && opts.liveHosts.length ? opts.liveHosts : await discoverLiveControlOrigins(crxControlPairCandidateOrigins(opts.localHubUrl, ["http://127.0.0.1:29110", ...opts.preferredOrigins || []]));
	if (!live.length) return {
		ok: false,
		error: "No Neutralino Control on loopback HTTP (:29110 / :8434). Is desk Neutralino running?"
	};
	let lastError = "Pairing failed";
	for (const host of live) {
		console.log("[CRX Control] pair/begin →", host.origin);
		const result = await pairCrxControl({
			controlOrigin: host.origin,
			publicToken: opts.publicToken,
			deviceCode: opts.deviceCode
		});
		if (result.ok) return result;
		lastError = result.error;
		console.warn("[CRX Control] pair/begin failed", host.origin, result.error);
		if (/invalid|expired device|public token|origin not allowed|session rejected/i.test(result.error)) return result;
	}
	return {
		ok: false,
		error: lastError
	};
};
//#endregion
export { clearCrxControlSession, formatCrxControlSessionStatus, getCrxControlSessionToken, pairCrxControlWithModal };
