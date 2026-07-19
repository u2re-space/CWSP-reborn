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
var connectionFields = (ctx) => {
	const isCrx = ctx.surface === "crx" || Boolean(ctx.isExtension);
	const fields = [
		settingsHint(isCrx ? "Shared with desk Neutralino Node (/service/config + clipboard-hub) when the host is up. CRX wire id lives under Extension." : "Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub."),
		"Connection",
		settingsTextField("Relay / gateway host", "core.endpointUrl", "https://192.168.0.200:8434 or https://45.147.121.152:8434"),
		settingsHint("Coordinator / gateway. Always include :8434 — bare host dials :443 where /ws is not served (404)."),
		settingsTextField("Direct host (optional)", "core.ops.directUrl", "https://192.168.0.110:8434"),
		settingsHint("Optional direct peer (desk). Leave empty when phones only talk via gateway.")
	];
	if (!isCrx) fields.push(settingsTextField("Client id", "core.userId", "L-196 or L-110"), settingsHint("Short fleet id (L-196, L-210, …)."));
	else fields.push(settingsTextField("Client id (Neutralino / backend)", "shell.clientId", "L-110"), settingsHint("Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx)."));
	fields.push(settingsTextField("Ecosystem token", "core.ecosystemToken", "shared ecosystem key", "password"), settingsHint("One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token."), settingsTextField("Destination node ids", "core.socket.routeTarget", "L-196;L-210;L-208"), settingsHint(MULTI_VALUE_HINT), settingsCheckboxField("Allow insecure TLS", "core.allowInsecureTls"));
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
var nativeWireFields = () => [
	"Native wire (Capacitor)",
	settingsCheckboxField("Prefer native Java WebSocket", "core.interop.preferNativeWebsocket"),
	settingsCheckboxField("Maintain hub socket in background", "shell.maintainHubSocketConnection")
];
/** Device toggles folded into CWSP tab on mobile (same `AppSettings.shell` paths). */
var mobileDeviceFields = () => [
	"Device",
	settingsCheckboxField("Start CWSP on boot", "shell.autoStartOnBoot"),
	settingsCheckboxField("Foreground CWSP service", "shell.bridgeDaemonEnabled"),
	settingsCheckboxField("Enable remote clipboard bridge", "shell.enableRemoteClipboardBridge"),
	settingsCheckboxField("Accept contacts bridge", "shell.acceptContactsBridgeData"),
	settingsHint("Save may request contacts / notifications when those toggles are on. SMS is not used.")
];
var registerCwspSettingsContribution = () => registerSettingsContribution({
	id: "cwsp",
	label: "CWSP",
	order: 55,
	render: (ctx) => {
		const children = [...connectionFields(ctx), ...clipboardFields()];
		if (ctx.surface === "capacitor" || ctx.surface === "native") children.push(...nativeWireFields(), ...mobileDeviceFields());
		else if (ctx.surface === "crx" || ctx.isExtension) {} else children.push(...nativeWireFields());
		return settingsPanel("cwsp", "CWSP", children);
	},
	load: (settings, panel) => {
		const input = panel.querySelector("[data-field=\"core.ecosystemToken\"]");
		if (input) input.value = resolveEcosystemToken(settings);
	},
	save: (settings) => {
		normalizeEcosystemToken(settings);
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
