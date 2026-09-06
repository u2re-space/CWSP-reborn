import { r as __exportAll } from "./rolldown-runtime.js";
import { a as classifyOpenKindFromPayload, n as OPEN_KINDS } from "./open-policy.js";
//#region src/shared/other/config/process-ingress.ts
var process_ingress_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_PROCESS_INGRESS: () => DEFAULT_PROCESS_INGRESS,
	PROCESS_INGRESS_KIND_LABELS: () => PROCESS_INGRESS_KIND_LABELS,
	allowProcessWebLaunchQueue: () => allowProcessWebLaunchQueue,
	allowProcessWebShareLaunch: () => allowProcessWebShareLaunch,
	formatProcessIngressResult: () => formatProcessIngressResult,
	holdCapacitorIngressJob: () => holdCapacitorIngressJob,
	instructionTextForIngress: () => instructionTextForIngress,
	mergeProcessIngress: () => mergeProcessIngress,
	peekProcessIngressSettings: () => peekProcessIngressSettings,
	persistProcessIngressNativeSnapshot: () => persistProcessIngressNativeSnapshot,
	processIngressSettingsFound: () => processIngressSettingsFound,
	rememberProcessIngressSettings: () => rememberProcessIngressSettings,
	resolveProcessIngressKind: () => resolveProcessIngressKind,
	resolveProcessIngressPolicy: () => resolveProcessIngressPolicy,
	shouldAttachProcessIngress: () => shouldAttachProcessIngress,
	writeProcessIngressClipboard: () => writeProcessIngressClipboard
});
var kindDefault = (mode, copy) => ({
	mode,
	instructionId: "",
	copyToClipboard: copy
});
var DEFAULT_PROCESS_INGRESS = {
	autoProcess: true,
	backgroundClipboard: true,
	kinds: {
		markdown: kindDefault("process", true),
		text: kindDefault("process", true),
		document: kindDefault("process", true),
		image: kindDefault("process", true),
		url: kindDefault("process", true),
		other: kindDefault("attach", false)
	}
};
var PROCESS_INGRESS_KIND_LABELS = {
	markdown: "Markdown",
	text: "Text",
	document: "Documents",
	image: "Images",
	url: "Links",
	other: "Other files"
};
var mergeProcessIngress = (...layers) => {
	const out = {
		autoProcess: DEFAULT_PROCESS_INGRESS.autoProcess,
		backgroundClipboard: DEFAULT_PROCESS_INGRESS.backgroundClipboard,
		kinds: { ...DEFAULT_PROCESS_INGRESS.kinds }
	};
	for (const layer of layers) {
		if (!layer) continue;
		if (typeof layer.autoProcess === "boolean") out.autoProcess = layer.autoProcess;
		if (typeof layer.backgroundClipboard === "boolean") out.backgroundClipboard = layer.backgroundClipboard;
		if (layer.kinds && typeof layer.kinds === "object") for (const key of OPEN_KINDS) {
			const src = layer.kinds[key];
			if (!src || typeof src !== "object") continue;
			const prev = out.kinds[key];
			const mode = src.mode === "attach" || src.mode === "process" ? src.mode : prev.mode;
			out.kinds[key] = {
				mode,
				instructionId: typeof src.instructionId === "string" ? src.instructionId : prev.instructionId,
				copyToClipboard: mode === "process"
			};
		}
	}
	return out;
};
var resolveProcessIngressPolicy = (settings) => mergeProcessIngress(DEFAULT_PROCESS_INGRESS, settings?.ai?.processIngress);
var resolveProcessIngressKind = (settings, kind) => {
	const policy = resolveProcessIngressPolicy(settings);
	const key = OPEN_KINDS.includes(kind) ? kind : "other";
	const row = policy.kinds[key] || DEFAULT_PROCESS_INGRESS.kinds[key];
	const mode = row.mode === "attach" ? "attach" : "process";
	return {
		kind: key,
		mode,
		instructionId: row.instructionId || "",
		copyToClipboard: mode === "process",
		autoProcess: mode === "process",
		backgroundClipboard: mode === "process"
	};
};
/** Attach-mode kinds stage chat chips. Process-mode kinds must not. */
var shouldAttachProcessIngress = (settings, payload) => resolveProcessIngressKind(settings, classifyOpenKindFromPayload(payload)).mode !== "process";
var instructionTextForIngress = (settings, instructionId) => {
	const list = settings?.ai?.customInstructions || [];
	const id = String(instructionId || settings?.ai?.activeInstructionId || "").trim();
	const byId = id ? list.find((item) => item.id === id) : null;
	const byLabel = id ? list.find((item) => String(item.label || "").trim().toLowerCase() === id.toLowerCase()) : null;
	const active = list.find((item) => item.id === settings?.ai?.activeInstructionId);
	const enabled = list.find((item) => item.enabled !== false && String(item.instruction || "").trim());
	return String(byId?.instruction || byLabel?.instruction || active?.instruction || enabled?.instruction || "").trim();
};
var formatProcessIngressResult = (data) => {
	if (typeof data === "string") return data;
	if (data == null) return "";
	try {
		return JSON.stringify(data, null, 2);
	} catch {
		return String(data);
	}
};
var settingsPeek = null;
var rememberProcessIngressSettings = (settings) => {
	if (settings) settingsPeek = settings;
	persistProcessIngressNativeSnapshot(settingsPeek);
};
/** Capacitor Process FGS reads this snapshot — share must not wait for WebView IDB. */
var persistProcessIngressNativeSnapshot = async (settings) => {
	try {
		const g = globalThis;
		if (typeof g.Capacitor?.isNativePlatform !== "function" || !g.Capacitor.isNativePlatform()) return;
	} catch {
		return;
	}
	const policy = resolveProcessIngressPolicy(settings);
	const kinds = {
		markdown: policy.kinds.markdown.mode,
		text: policy.kinds.text.mode,
		document: policy.kinds.document.mode,
		image: policy.kinds.image.mode,
		url: policy.kinds.url.mode,
		other: policy.kinds.other.mode
	};
	const instruction = instructionTextForIngress(settings);
	try {
		const { invokeCwsNative } = await import("./cws-bridge.js").then((n) => n.n);
		await invokeCwsNative("settings:snapshot", {
			apiKey: String(settings?.ai?.apiKey || "").trim(),
			baseUrl: String(settings?.ai?.baseUrl || "").trim(),
			model: String(settings?.ai?.model || "").trim(),
			instruction,
			instructionId: String(settings?.ai?.activeInstructionId || "").trim(),
			kinds,
			kindsJson: JSON.stringify(kinds)
		});
	} catch {}
};
var peekProcessIngressSettings = () => settingsPeek;
/** True when a settings blob has been loaded (defaults still apply on Capacitor). */
var processIngressSettingsFound = (settings) => Boolean(settings?.ai);
/**
* INVARIANT: Process PWA/Web is a Share Target (manifest `share_target`) and Launch Queue.
* Capacitor/Android still uses OS Share + Open-with.
*/
var allowProcessWebShareLaunch = (settings) => {
	return true;
};
/**
* INVARIANT: Process PWA/Web consumes Launch Queue like document/explorer (`file_handlers`).
*/
var allowProcessWebLaunchQueue = (settings) => {
	return true;
};
var writeProcessIngressClipboard = async (text) => {
	const value = String(text || "");
	if (!value.trim()) return false;
	try {
		const { writeClipboardTextToDevice } = await import("./clipboard-device.js").then((n) => n.t);
		await writeClipboardTextToDevice(value);
		return true;
	} catch {
		return false;
	}
};
/** Capacitor: keep the foreground bridge so AI + clipboard-write can finish after Share. */
var holdCapacitorIngressJob = async (settings) => {
	try {
		const { isCapacitorNative } = await import("./capacitor-permissions3.js");
		if (!isCapacitorNative()) return () => {};
	} catch {
		return () => {};
	}
	try {
		const { ensureCapacitorBridgeDaemonStarted } = await import("./capacitor-settings-permissions2.js");
		await ensureCapacitorBridgeDaemonStarted({
			...settings || {},
			shell: {
				...settings?.shell || {},
				bridgeDaemonEnabled: true
			}
		});
	} catch {}
	return () => {};
};
//#endregion
export { holdCapacitorIngressJob as a, peekProcessIngressSettings as c, resolveProcessIngressKind as d, shouldAttachProcessIngress as f, formatProcessIngressResult as i, process_ingress_exports as l, allowProcessWebLaunchQueue as n, instructionTextForIngress as o, writeProcessIngressClipboard as p, allowProcessWebShareLaunch as r, mergeProcessIngress as s, PROCESS_INGRESS_KIND_LABELS as t, rememberProcessIngressSettings as u };
