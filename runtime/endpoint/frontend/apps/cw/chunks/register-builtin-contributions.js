import { i as resolveEcosystemToken, r as normalizeEcosystemToken } from "./SettingsTypes.js";
//#region src/shared/other/config/SettingsContributions.ts
var registry = /* @__PURE__ */ new Map();
var registerSettingsContribution = (entry) => {
	const id = String(entry?.id || "").trim();
	if (!id) return () => {};
	const contribution = {
		...entry,
		id
	};
	registry.set(id, contribution);
	return () => {
		if (registry.get(id) === contribution) registry.delete(id);
	};
};
var getSettingsContributions = () => [...registry.values()].sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.id.localeCompare(b.id));
var getByPath = (source, path) => {
	if (!source || !path) return void 0;
	return path.split(".").reduce((acc, key) => {
		if (acc == null || typeof acc !== "object") return void 0;
		return acc[key];
	}, source);
};
var setByPath = (target, path, value) => {
	if (!target || !path) return;
	const keys = path.split(".");
	let cursor = target;
	for (let i = 0; i < keys.length - 1; i += 1) {
		const key = keys[i];
		const next = cursor[key];
		if (next == null || typeof next !== "object") cursor[key] = {};
		cursor = cursor[key];
	}
	cursor[keys[keys.length - 1]] = value;
};
var readFieldValue = (el) => {
	const input = el;
	const fieldType = (el.getAttribute("data-field-type") || "").toLowerCase();
	if (fieldType === "boolean" || input.type === "checkbox") return !!input.checked;
	const raw = "value" in input ? String(input.value ?? "") : "";
	if (fieldType === "number" || input.type === "number") {
		const n = Number(raw);
		return Number.isFinite(n) ? n : void 0;
	}
	if (fieldType === "json") try {
		return raw.trim() ? JSON.parse(raw) : void 0;
	} catch {
		return;
	}
	if (input.type === "password" && !raw.trim()) return;
	return raw;
};
/** Populate `[data-field]` controls from `AppSettings`. */
var bindContributionFields = (panel, settings) => {
	panel.querySelectorAll("[data-field]").forEach((el) => {
		const path = el.getAttribute("data-field");
		if (!path) return;
		const value = getByPath(settings, path);
		if (value === void 0) return;
		const input = el;
		if (input.type === "checkbox") {
			input.checked = !!value;
			return;
		}
		if (el.getAttribute("data-field-type") === "json") {
			try {
				input.value = typeof value === "string" ? value : JSON.stringify(value, null, 2);
			} catch {
				input.value = "";
			}
			return;
		}
		if ("value" in input) input.value = String(value ?? "");
	});
};
/** Merge `[data-field]` control values into `AppSettings`. */
var collectContributionFields = (panel, settings) => {
	const target = settings;
	panel.querySelectorAll("[data-field]").forEach((el) => {
		const path = el.getAttribute("data-field");
		if (!path) return;
		const value = readFieldValue(el);
		if (value === void 0) return;
		setByPath(target, path, value);
	});
};
//#endregion
//#region src/shared/other/config/settings/settings-contribution-ui.ts
/**
* DOM helpers for settings contribution panels (no fest/lure — safe for any host).
*/
var settingsHint = (text) => {
	const p = document.createElement("p");
	p.className = "field-hint";
	p.textContent = text;
	return p;
};
var settingsHeading = (text) => {
	const h = document.createElement("h4");
	h.textContent = text;
	return h;
};
var settingsTextField = (label, path, placeholder = "", type = "text") => {
	const wrap = document.createElement("label");
	wrap.className = "field";
	const span = document.createElement("span");
	span.textContent = label;
	const input = document.createElement("input");
	input.className = "form-input";
	input.type = type;
	input.autocomplete = "off";
	input.setAttribute("data-field", path);
	if (placeholder) input.placeholder = placeholder;
	wrap.append(span, input);
	return wrap;
};
var settingsNumberField = (label, path, attrs = {}) => {
	const wrap = document.createElement("label");
	wrap.className = "field";
	const span = document.createElement("span");
	span.textContent = label;
	const input = document.createElement("input");
	input.className = "form-input";
	input.type = "number";
	input.setAttribute("data-field", path);
	if (attrs.min) input.min = attrs.min;
	if (attrs.max) input.max = attrs.max;
	if (attrs.step) input.step = attrs.step;
	if (attrs.placeholder) input.placeholder = attrs.placeholder;
	wrap.append(span, input);
	return wrap;
};
var settingsCheckboxField = (label, path) => {
	const wrap = document.createElement("label");
	wrap.className = "field checkbox form-checkbox";
	const input = document.createElement("input");
	input.type = "checkbox";
	input.setAttribute("data-field", path);
	const span = document.createElement("span");
	span.textContent = label;
	wrap.append(input, span);
	return wrap;
};
var settingsSelectField = (label, path, options) => {
	const wrap = document.createElement("label");
	wrap.className = "field";
	const span = document.createElement("span");
	span.textContent = label;
	const sel = document.createElement("select");
	sel.className = "form-select";
	sel.setAttribute("data-field", path);
	for (const [value, text] of options) {
		const opt = document.createElement("option");
		opt.value = value;
		opt.textContent = text;
		sel.appendChild(opt);
	}
	wrap.append(span, sel);
	return wrap;
};
/** Action button (not a settings field) — wire via `data-action` in Settings.ts. */
var settingsButton = (label, action, opts) => {
	const btn = document.createElement("button");
	btn.type = "button";
	btn.className = opts?.className || (opts?.primary ? "view-settings__btn view-settings__btn--primary" : "view-settings__btn");
	btn.setAttribute("data-action", action);
	btn.textContent = label;
	return btn;
};
/** Horizontal row of action buttons. */
var settingsButtonRow = (...buttons) => {
	const row = document.createElement("div");
	row.className = "field settings-action-row";
	row.style.display = "flex";
	row.style.flexWrap = "wrap";
	row.style.gap = "0.5rem";
	for (const btn of buttons) row.appendChild(btn);
	return row;
};
/**
* Read-only secret display: masked with dots until View; Copy writes the real value.
* WHY: Control public token / rotating device code must not sit in cleartext by default.
*/
var settingsSecretDisplayField = (label, dataKey, opts) => {
	const wrap = document.createElement("div");
	wrap.className = "field settings-secret-field";
	wrap.setAttribute("data-secret-field", dataKey);
	const span = document.createElement("span");
	span.textContent = label;
	const row = document.createElement("div");
	row.style.cssText = "display:flex;gap:.4rem;align-items:center;margin-top:.3rem;";
	const input = document.createElement("input");
	input.className = "form-input";
	input.type = "password";
	input.readOnly = true;
	input.autocomplete = "off";
	input.spellcheck = false;
	input.placeholder = opts?.placeholder || "••••••";
	input.setAttribute(`data-${dataKey}`, "1");
	input.setAttribute("data-secret-input", dataKey);
	input.value = "";
	if (opts?.mono) {
		input.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
		input.style.fontSize = "0.9rem";
		input.style.letterSpacing = "0.04em";
	} else {
		input.style.fontSize = "1.15rem";
		input.style.fontWeight = "700";
		input.style.letterSpacing = "0.12em";
	}
	input.style.flex = "1 1 auto";
	input.style.minWidth = "0";
	const viewBtn = document.createElement("button");
	viewBtn.type = "button";
	viewBtn.className = "view-settings__btn";
	viewBtn.textContent = "View";
	viewBtn.title = "Show / hide";
	viewBtn.setAttribute("data-action", "control-secret-toggle");
	viewBtn.setAttribute("data-secret-for", dataKey);
	const copyBtn = document.createElement("button");
	copyBtn.type = "button";
	copyBtn.className = "view-settings__btn";
	copyBtn.textContent = "Copy";
	copyBtn.title = "Copy to clipboard";
	copyBtn.setAttribute("data-action", "control-secret-copy");
	copyBtn.setAttribute("data-secret-for", dataKey);
	const meta = document.createElement("p");
	meta.className = "field-hint";
	meta.setAttribute("data-secret-meta", dataKey);
	meta.style.margin = "0.2rem 0 0";
	meta.textContent = "";
	const applyMasked = () => {
		const revealed = input.dataset.revealed === "1";
		input.type = revealed ? "text" : "password";
		viewBtn.textContent = revealed ? "Hide" : "View";
	};
	viewBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		input.dataset.revealed = input.dataset.revealed === "1" ? "0" : "1";
		applyMasked();
	});
	copyBtn.addEventListener("click", async (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		const value = String(input.value || "").trim();
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
			const prev = copyBtn.textContent;
			copyBtn.textContent = "Copied";
			window.setTimeout(() => {
				copyBtn.textContent = prev || "Copy";
			}, 1200);
		} catch {
			input.type = "text";
			input.select();
			try {
				document.execCommand("copy");
			} catch {}
			applyMasked();
		}
	});
	row.append(input, viewBtn, copyBtn);
	wrap.append(span, row, meta);
	return wrap;
};
var settingsPanel = (id, title, children) => {
	const section = document.createElement("section");
	section.className = "card settings-tab-panel";
	section.setAttribute("data-tab-panel", id);
	section.hidden = true;
	const h3 = document.createElement("h3");
	h3.textContent = title;
	section.appendChild(h3);
	for (const child of children) if (typeof child === "string") section.appendChild(settingsHeading(child));
	else section.appendChild(child);
	return section;
};
//#endregion
//#region src/shared/other/config/settings/contributions/airpad.ts
/** AirPad view-owned prefs — register from airpad-view or the central bootstrap. */
var registerAirpadSettingsContribution = () => registerSettingsContribution({
	id: "airpad",
	label: "AirPad",
	order: 70,
	requiresView: "airpad",
	render: () => settingsPanel("airpad", "AirPad", [
		settingsNumberField("Pointer sensitivity", "views.airpad.pointerSensitivity", {
			min: "0.2",
			max: "5",
			step: "0.1",
			placeholder: "1.0"
		}),
		settingsCheckboxField("Invert scroll", "views.airpad.invertScroll"),
		settingsCheckboxField("Send haptics", "views.airpad.haptics")
	])
});
//#endregion
//#region src/shared/other/config/settings/contributions/cwsp.ts
var MULTI_VALUE_HINT = "Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.";
var CRX_DESK_CLIENT_ID_DEFAULT = "L-110";
var isCrxWireId = (value) => /^L-\d{1,3}-crx$/i.test(String(value ?? "").trim());
var pickDeskClientId = (...candidates) => {
	for (const raw of candidates) {
		const id = String(raw ?? "").trim();
		if (id && !isCrxWireId(id)) return id;
	}
	return CRX_DESK_CLIENT_ID_DEFAULT;
};
var connectionFields = (ctx) => {
	const isCrx = ctx.surface === "crx" || Boolean(ctx.isExtension);
	const fields = [
		settingsHint(isCrx ? "CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field." : "Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub."),
		"Connection",
		settingsTextField("Relay / gateway host", "core.endpointUrl", "https://192.168.0.200:8434 or https://45.147.121.152:8434"),
		settingsHint(isCrx ? "Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control)." : "Coordinator / gateway. Always include :8434 — bare host dials :443 where /ws is not served (404)."),
		settingsTextField("Direct host (optional)", "core.ops.directUrl", "https://192.168.0.110:8434"),
		settingsHint("Optional direct peer (desk). Leave empty when phones only talk via gateway.")
	];
	if (!isCrx) fields.push(settingsTextField("Client id", "core.userId", "L-196 or L-110"), settingsHint("Short fleet id (L-196, L-210, …)."));
	else fields.push(settingsTextField("Client id (Neutralino / backend)", "shell.clientId", "L-110"), settingsHint("Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx)."));
	fields.push(settingsTextField("Ecosystem token", "core.ecosystemToken", "shared ecosystem key", "password"), settingsHint(isCrx ? "Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login)." : "One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token."), settingsTextField("Destination node ids", "core.socket.routeTarget", "L-196;L-210;L-208"), settingsHint(MULTI_VALUE_HINT), settingsCheckboxField("Allow insecure TLS", "core.allowInsecureTls"));
	return fields;
};
var clipboardFields = () => [
	"Clipboard",
	settingsCheckboxField("Accept inbound clipboard", "shell.acceptInboundClipboardData"),
	settingsCheckboxField("Apply remote clipboard to device", "shell.applyRemoteClipboardToDevice"),
	settingsTextField("Inbound clipboard allow ids", "shell.clipboardInboundAllowIds", "* or L-196;L-210"),
	settingsHint(MULTI_VALUE_HINT),
	settingsTextField("Share-intent destination ids", "shell.clipboardShareDestinationIds", "L-196;L-210;L-110"),
	settingsHint(MULTI_VALUE_HINT),
	"Clipboard prompt",
	settingsSelectField("Outbound mode", "shell.clipboardOutboundMode", [["auto", "Auto — share + show popup (Erase optional)"], ["ask", "Ask — hold share until confirmed"]]),
	settingsSelectField("Inbound mode", "shell.clipboardInboundMode", [["auto", "Auto — apply + show popup (Undo optional)"], ["ask", "Ask — hold apply until confirmed"]]),
	settingsCheckboxField("Show Erase on outbound auto popup", "shell.clipboardOutboundShowErase"),
	settingsCheckboxField("Show Undo on inbound auto popup", "shell.clipboardInboundShowUndo"),
	settingsNumberField("Popup auto-dismiss (ms)", "shell.clipboardPromptDismissMs", {
		min: "1000",
		step: "500",
		placeholder: "10000"
	}),
	settingsHint("On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.")
];
/**
* Files transfer (Open-with / share-target / files:* hub).
* WHY: W3 hubs already honor these keys; CWSP tab had no UI until W5.
* INVARIANT: never overload clipboard prompt fields — separate shell.files*.
*/
var filesTransferFields = (ctx) => {
	const fields = [
		"Files transfer",
		settingsHint("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),
		settingsCheckboxField("Accept inbound files", "shell.acceptInboundFilesData"),
		settingsTextField("Default destination ids", "shell.filesShareDestinationIds", "L-196;L-210 (empty = picker)"),
		settingsHint(MULTI_VALUE_HINT),
		settingsCheckboxField("Allow share to all (*)", "shell.filesAllowShareToAll"),
		settingsHint("SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out."),
		settingsSelectField("Open for share", "shell.filesOpenForShareMode", [["auto", "Auto — offer when destinations are set"], ["manual", "Manual — always ask for destinations"]]),
		settingsSelectField("Inbound accept", "shell.filesInboundMode", [["ask", "Ask — Accept / Decline prompt"], ["auto", "Auto — accept into landing folder"]]),
		settingsCheckboxField("Copy received files to clipboard (for Paste / re-share)", "shell.filesCopyOnReceive"),
		settingsHint("Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default."),
		settingsSelectField("Byte transport hint", "shell.filesByteTransport", [
			["auto", "Auto — receiver chooses"],
			["http", "HTTP blob GET/PUT"],
			["ws", "WebSocket chunks"]
		]),
		settingsHint("Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.")
	];
	if (ctx.surface === "capacitor" || ctx.surface === "native") {
		const safHint = document.createElement("p");
		safHint.className = "field-hint";
		safHint.setAttribute("data-files-saf-uri", "1");
		safHint.textContent = "SAF folder: (not set)";
		const pathsHint = document.createElement("p");
		pathsHint.className = "field-hint";
		pathsHint.setAttribute("data-files-storage-paths", "1");
		pathsHint.style.whiteSpace = "pre-wrap";
		pathsHint.textContent = "Staging / landing paths: tap Show paths.";
		fields.push("Files storage (Capacitor)", settingsSelectField("Save received files to", "shell.filesLandingMode", [
			["app", "App storage (private — default)"],
			["downloads", "Downloads (user-visible)"],
			["saf", "SAF folder (pick below)"]
		]), settingsHint("App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README."), safHint, settingsButtonRow(settingsButton("Choose SAF folder", "files-storage-pick-saf", { primary: true }), settingsButton("Clear SAF folder", "files-storage-clear-saf")), settingsCheckboxField("Ask for folder every time if SAF unset", "shell.filesAskDirEveryTime"), settingsSelectField("Temp staging place", "shell.filesStagingRoot", [
			["app", "App internal (files/) — default"],
			["cache", "App cache (may be purged)"],
			["external", "App external (Android/data/… — OEM may hide)"]
		]), settingsHint("Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above."), pathsHint, settingsButtonRow(settingsButton("Show paths", "files-storage-show-paths"), settingsButton("Browse CWSP Files…", "files-storage-open-explorer"), settingsButton("Share README…", "files-storage-share-readme")), "File access permissions", (() => {
			const el = document.createElement("p");
			el.className = "field-hint";
			el.setAttribute("data-files-perm-status", "1");
			el.style.whiteSpace = "pre-wrap";
			el.textContent = "Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.";
			return el;
		})(), settingsButtonRow(settingsButton("Refresh status", "files-storage-perm-status"), settingsButton("Request media access", "files-storage-request-media", { primary: true }), settingsButton("Allow manage all files…", "files-storage-request-all-files")), settingsHint("All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish."));
	}
	return fields;
};
var nativeWireFields = () => [
	"Native wire (Capacitor)",
	settingsCheckboxField("Prefer native Java WebSocket", "core.interop.preferNativeWebsocket"),
	settingsCheckboxField("Maintain hub socket in background", "shell.maintainHubSocketConnection")
];
/** Control pairing credentials shown on device (public token + rotating code). */
var controlPairingFields = () => [
	"Control pairing",
	settingsSecretDisplayField("Public token", "control-public-token", {
		mono: true,
		placeholder: "••••••••••••"
	}),
	settingsSecretDisplayField("Device code (20s, +10s grace)", "control-device-code", { placeholder: "••••••" }),
	settingsButtonRow(settingsButton("Refresh code", "control-pairing-refresh"), settingsButton("Regenerate public token", "control-public-token-regenerate")),
	settingsHint("Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.")
];
/**
* CRX Control pairing — compact status + modal trigger (no inline token/code fields).
* WHY: same UX as https://cwsp.u2re.space modal; secrets never land in portable.config.
*/
var crxControlPairingFields = () => {
	const status = document.createElement("p");
	status.className = "field-hint";
	status.setAttribute("data-crx-control-status", "1");
	status.textContent = "Control: …";
	return [
		"Control pairing",
		status,
		settingsButtonRow(settingsButton("Pair Control…", "crx-control-pair", { primary: true }), settingsButton("Unpair", "crx-control-unpair")),
		settingsHint("Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.")
	];
};
/**
* Pairing secrets belong on the device shell (Neutralino / Capacitor), never on the
* public Control SPA. `resolveSettingsSurface()` maps Neutralino → `"web"`, so we
* must not key off `"webnative"` alone.
*/
var isPublicCwspControlSpa = () => {
	try {
		const g = globalThis;
		if (g.NL_OS != null || g.NL_PORT != null || g.Neutralino) return false;
		if (g.Capacitor?.isNativePlatform?.()) return false;
		const plat = String(g.Capacitor?.getPlatform?.() || "").toLowerCase();
		if (plat === "android" || plat === "ios") return false;
		const host = String(location.hostname || "").toLowerCase();
		if (!host || host === "localhost" || host === "127.0.0.1" || host === "[::1]") return false;
		return location.protocol === "https:";
	} catch {
		return false;
	}
};
/** Device toggles folded into CWSP tab on mobile (same `AppSettings.shell` paths). */
var mobileDeviceFields = () => [
	"Device",
	settingsCheckboxField("Start CWSP on boot", "shell.autoStartOnBoot"),
	settingsCheckboxField("Foreground CWSP service", "shell.bridgeDaemonEnabled"),
	settingsCheckboxField("Allow Control API", "shell.allowControlApi"),
	settingsHint("Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password."),
	...controlPairingFields(),
	settingsCheckboxField("Enable remote clipboard bridge", "shell.enableRemoteClipboardBridge"),
	settingsCheckboxField("Accept contacts bridge", "shell.acceptContactsBridgeData"),
	settingsHint("Save may request contacts / notifications when those toggles are on. SMS is not used.")
];
/** Capacitor-only: sideload newer APK from gateway without SSH/SFTP File Manager. */
var mobileApkUpdateFields = () => {
	const versionHint = document.createElement("p");
	versionHint.className = "field-hint";
	versionHint.setAttribute("data-apk-local-version", "1");
	versionHint.textContent = "Installed version: … (tap Check to refresh)";
	return [
		"App update (dev)",
		versionHint,
		settingsSelectField("Update source", "shell.apkUpdateSource", [
			["wan", "WAN — https://45.147.121.152:8434"],
			["lan", "LAN — https://192.168.0.200:8434"],
			["relay", "Current Relay (core.endpointUrl)"]
		]),
		settingsButtonRow(settingsButton("Check for update", "apk-update-check"), settingsButton("Download & install", "apk-update-install", { primary: true })),
		settingsHint("Uses ecosystem token (X-API-Key) against /releases/android. Install requires the same APK signing certificate as the installed app. Each `npm run build:capacitor` auto-bumps VERSION_CODE and restages the gateway release.")
	];
};
var registerCwspSettingsContribution = () => registerSettingsContribution({
	id: "cwsp",
	label: "CWSP",
	order: 55,
	excludeSurfaces: ["markdown"],
	render: (ctx) => {
		const children = [
			...connectionFields(ctx),
			...clipboardFields(),
			...filesTransferFields(ctx)
		];
		if (ctx.surface === "capacitor" || ctx.surface === "native") children.push(...nativeWireFields(), ...mobileDeviceFields(), ...mobileApkUpdateFields());
		else if (ctx.surface === "crx" || ctx.isExtension) children.push(...crxControlPairingFields());
		else if (!isPublicCwspControlSpa()) children.push(...nativeWireFields(), ...controlPairingFields());
		return settingsPanel("cwsp", "CWSP", children);
	},
	load: (settings, panel) => {
		const input = panel.querySelector("[data-field=\"core.ecosystemToken\"]");
		if (input) input.value = resolveEcosystemToken(settings);
		const clientInput = panel.querySelector("[data-field=\"shell.clientId\"]");
		if (clientInput) {
			const desk = pickDeskClientId(clientInput.value, settings.shell?.clientId, settings.core?.userId);
			clientInput.value = desk;
			settings.shell = {
				...settings.shell || {},
				clientId: desk
			};
		}
		const src = panel.querySelector("[data-field=\"shell.apkUpdateSource\"]");
		if (src) {
			const v = String(settings.shell?.apkUpdateSource || "wan").trim();
			src.value = v === "lan" || v === "relay" ? v : "wan";
		}
		const safEl = panel.querySelector("[data-files-saf-uri]");
		if (safEl) {
			const uri = String(settings.shell?.filesIncomingDir || "").trim();
			safEl.textContent = uri ? `SAF folder: ${uri.length > 72 ? `${uri.slice(0, 36)}…${uri.slice(-28)}` : uri}` : "SAF folder: (not set)";
		}
		const refreshBtn = panel.querySelector("button[data-action=\"control-pairing-refresh\"]");
		if (refreshBtn) {
			queueMicrotask(() => refreshBtn.click());
			const prev = Number(panel.__cwspPairTimer || 0);
			if (prev) clearInterval(prev);
			panel.__cwspPairTimer = window.setInterval(() => {
				if (!panel.isConnected) return;
				refreshBtn.click();
			}, 2500);
		}
		const crxStatus = panel.querySelector("[data-crx-control-status]");
		if (crxStatus) import("./crx-control-session.js").then((m) => m.formatCrxControlSessionStatus()).then((text) => {
			if (crxStatus.isConnected) crxStatus.textContent = text;
		}).catch(() => {
			crxStatus.textContent = "Control: status unavailable";
		});
	},
	save: (settings) => {
		normalizeEcosystemToken(settings);
		if (isCrxWireId(settings.shell?.clientId)) settings.shell = {
			...settings.shell || {},
			clientId: pickDeskClientId(settings.core?.userId)
		};
	}
});
//#endregion
//#region src/shared/other/config/settings/contributions/device.ts
/**
* Former CRX-only "Extension" contribution — removed to avoid duplicate tabs.
* Capacitor folds device toggles into the CWSP tab; CRX uses the `crx` panel.
*/
var registerDeviceSettingsContribution = () => () => void 0;
//#endregion
//#region src/shared/other/config/settings/contributions/reader.ts
var registerReaderSettingsContribution = () => registerSettingsContribution({
	id: "reader",
	label: "Reader",
	order: 60,
	requiresView: "viewer",
	render: () => settingsPanel("reader", "Reader", [settingsNumberField("Default zoom (%)", "views.reader.zoomPercent", {
		min: "50",
		max: "300",
		step: "10",
		placeholder: "100"
	}), settingsCheckboxField("Wrap long lines", "views.reader.wrapLongLines")])
});
//#endregion
//#region src/shared/other/config/settings/contributions/workcenter.ts
var registerWorkcenterSettingsContribution = () => registerSettingsContribution({
	id: "workcenter",
	label: "Work Center",
	order: 65,
	requiresView: "workcenter",
	render: () => settingsPanel("workcenter", "Work Center", [settingsCheckboxField("Auto-run pinned tasks", "views.workcenter.autoRunPinned"), settingsTextField("Default instruction id", "views.workcenter.defaultInstructionId", "(none)")])
});
//#endregion
//#region src/shared/other/config/settings/register-builtin-contributions.ts
/**
* Central bootstrap for shared settings contributions.
* Views may also call individual `register*SettingsContribution()` exports
* (idempotent by contribution id).
*/
var registered = false;
var registerBuiltinSettingsContributions = () => {
	if (registered) return;
	registered = true;
	registerCwspSettingsContribution();
	registerReaderSettingsContribution();
	registerWorkcenterSettingsContribution();
	registerAirpadSettingsContribution();
};
//#endregion
export { registerCwspSettingsContribution as a, collectContributionFields as c, registerDeviceSettingsContribution as i, getSettingsContributions as l, registerWorkcenterSettingsContribution as n, registerAirpadSettingsContribution as o, registerReaderSettingsContribution as r, bindContributionFields as s, registerBuiltinSettingsContributions as t, registerSettingsContribution as u };
