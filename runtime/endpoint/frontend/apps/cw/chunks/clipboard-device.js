import { n as __exportAll } from "./rolldown-runtime.js";
import { a as invokeCwsNative, s as isCapacitorCwsNativeShell } from "../vendor/@capacitor_core.js";
//#region src/shared/routing/native/capacitor-clipboard.ts
/**
* Capacitor clipboard read/write with supernotes fork first, then official plugin.
* @see https://capacitorjs.com/docs/apis/clipboard
* @see https://www.npmjs.com/package/@supernotes/capacitor-clipboard
*/
var CLIPBOARD_PKGS = ["@supernotes/capacitor-clipboard", "@capacitor/clipboard"];
var loadClipboardModule = async () => {
	try {
		if (typeof globalThis.document === "undefined") return null;
	} catch {
		return null;
	}
	for (const pkg of CLIPBOARD_PKGS) try {
		return await import(
			/* @vite-ignore */
			pkg
);
	} catch {}
	return null;
};
async function readCapacitorClipboardText() {
	const mod = await loadClipboardModule();
	if (!mod?.Clipboard?.read) return "";
	try {
		const value = (await mod.Clipboard.read())?.value;
		if (typeof value === "string" && value.trim()) return value;
	} catch {}
	return "";
}
async function writeCapacitorClipboardText(text) {
	const mod = await loadClipboardModule();
	if (!mod?.Clipboard?.write) return false;
	try {
		await mod.Clipboard.write({
			string: String(text ?? ""),
			label: "cwsp"
		});
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/shared/routing/native/clipboard-device.ts
/**
* Device clipboard I/O: desktop control host → CwsBridge Java → Capacitor → Web API.
*
* WHY desktop-first: Neutralino/WebNative WebView `navigator.clipboard` is unreliable
* for system clipboard (esp. images / background). The Node control host exposes
* ClipboardService at `/service/clipboard` with the same `__WEBNATIVE_AUTH__` as settings.
*/
var clipboard_device_exports = /* @__PURE__ */ __exportAll({
	isCapacitorNativeShell: () => isCapacitorNativeShell,
	openAppClipboardRelatedSettings: () => openAppClipboardRelatedSettings,
	openNativeNotificationSettings: () => openNativeNotificationSettings,
	readClipboardTextFromDevice: () => readClipboardTextFromDevice,
	writeClipboardImageToDevice: () => writeClipboardImageToDevice,
	writeClipboardTextToDevice: () => writeClipboardTextToDevice
});
var isCapacitorNative = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Same check — use when "clipboard" naming is misleading (e.g. AirPad WebSocket transport). */
var isCapacitorNativeShell = () => isCapacitorNative();
/** Loopback Neutralino/WebNative control auth (settings + clipboard share this). */
var readDesktopControlAuth = () => {
	try {
		const g = globalThis;
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		if (!auth || typeof auth.port !== "number") return null;
		if (!(g.__CWS_WEBNATIVE_BOOT__ || g.__CWS_NEUTRALINO_BOOT__ || auth.key)) {}
		if (!auth.key) return null;
		return {
			port: auth.port,
			key: String(auth.key)
		};
	} catch {
		return null;
	}
};
var desktopControlFetch = async (path, init) => {
	const auth = readDesktopControlAuth();
	if (!auth) return null;
	try {
		const headers = new Headers(init?.headers);
		headers.set("Content-Type", "application/json");
		headers.set("X-API-Key", auth.key);
		const res = await fetch(`http://127.0.0.1:${auth.port}${path}`, {
			...init,
			headers,
			cache: "no-store"
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
};
var extractBridgeClipboardText = (result) => {
	if (!result || typeof result !== "object") return "";
	const record = result;
	const echo = record.echo;
	if (echo && typeof echo === "object") {
		const echoRec = echo;
		if (typeof echoRec.text === "string") return echoRec.text;
		if (typeof echoRec.value === "string") return echoRec.value;
	}
	if (typeof record.text === "string") return record.text;
	if (typeof record.value === "string") return record.value;
	if (typeof record.data === "string") return record.data;
	return "";
};
async function readViaDesktopControl() {
	const result = await desktopControlFetch("/service/clipboard?kind=text");
	if (!result || result.ok === false) return null;
	const text = typeof result.text === "string" && result.text || typeof result.content === "string" && result.content || typeof result.data === "string" && result.data || "";
	if (result.ok === true || "text" in result || "data" in result) return text;
	return null;
}
async function writeViaDesktopControl(text) {
	const result = await desktopControlFetch("/service/clipboard", {
		method: "POST",
		body: JSON.stringify({
			kind: "text",
			text,
			content: text,
			data: text
		})
	});
	return Boolean(result && result.ok !== false);
}
async function writeImageViaDesktopControl(data, mimeType, hash) {
	const result = await desktopControlFetch("/service/clipboard", {
		method: "POST",
		body: JSON.stringify({
			kind: "image",
			mimeType,
			hash: hash || void 0,
			imageBase64: data,
			asset: {
				mimeType,
				hash: hash || void 0,
				data,
				source: "base64"
			}
		})
	});
	return Boolean(result && result.ok !== false);
}
async function readViaCwsBridge() {
	if (!isCapacitorCwsNativeShell()) return "";
	try {
		return extractBridgeClipboardText(await invokeCwsNative("clipboard:read-local", {}));
	} catch {
		return "";
	}
}
async function writeViaCwsBridgeImage(data, mimeType, hash) {
	if (!isCapacitorCwsNativeShell()) return false;
	try {
		const result = await invokeCwsNative("clipboard:write-local-image", {
			mimeType,
			hash: hash || "",
			data
		});
		return Boolean(result?.ok);
	} catch {
		return false;
	}
}
async function writeViaCwsBridge(text) {
	if (!isCapacitorCwsNativeShell()) return false;
	try {
		const result = await invokeCwsNative("clipboard:write-local", { text });
		return Boolean(result?.ok);
	} catch {
		return false;
	}
}
async function writeClipboardImageToDevice(data, mimeType = "image/png", hash) {
	const payload = String(data ?? "").trim();
	if (!payload) throw new Error("Clipboard image payload empty");
	const mime = String(mimeType || "image/png").trim() || "image/png";
	if (isDesktopControlClipboardShell()) {
		for (let i = 0; i < 4; i++) {
			if (await writeImageViaDesktopControl(payload, mime, hash)) return;
			if (i + 1 < 4) await new Promise((r) => globalThis.setTimeout(r, 120 * (i + 1)));
		}
		throw new Error("Desktop control clipboard image write failed");
	}
	if (await writeImageViaDesktopControl(payload, mime, hash)) return;
	if (await writeViaCwsBridgeImage(payload, mime, hash)) return;
	if (isCapacitorNative() && globalThis.navigator?.clipboard?.write) try {
		const bytes = decodeClipboardImageBase64(payload);
		if (bytes?.length) {
			const blob = new Blob([bytes], { type: mime });
			const pngBlob = mime === "image/png" ? blob : await blobToPng(blob);
			await globalThis.navigator.clipboard.write([new ClipboardItem({ [pngBlob.type]: pngBlob })]);
			return;
		}
	} catch {}
	throw new Error("Clipboard image write unavailable");
}
var decodeClipboardImageBase64 = (raw) => {
	let data = raw.trim();
	if (!data) return null;
	if (data.startsWith("data:")) {
		const comma = data.indexOf(",");
		if (comma < 0) return null;
		data = data.slice(comma + 1);
	}
	try {
		const bin = globalThis.atob(data.replace(/\s+/g, ""));
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
		return out;
	} catch {
		return null;
	}
};
var blobToPng = async (blob) => {
	if (blob.type === "image/png") return blob;
	if (typeof createImageBitmap === "function" && typeof OffscreenCanvas !== "undefined") {
		const bitmap = await createImageBitmap(blob);
		const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
		const ctx = canvas.getContext("2d");
		if (!ctx) return blob;
		ctx.drawImage(bitmap, 0, 0);
		bitmap.close();
		return await canvas.convertToBlob({ type: "image/png" });
	}
	return blob;
};
/** True when WebView must use Node control host for real OS clipboard (not navigator). */
var isDesktopControlClipboardShell = () => {
	try {
		const g = globalThis;
		if (g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__) return true;
		if (typeof g.NL_OS === "string") return true;
		const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
		return Boolean(auth && typeof auth.port === "number" && auth.key);
	} catch {
		return false;
	}
};
/**
* WHY: Neutralino WebView `navigator.clipboard` often reports success without
* touching the Windows OS clipboard — never treat it as the desktop path.
*/
async function writeViaDesktopControlWithRetry(text, attempts = 4) {
	for (let i = 0; i < attempts; i++) {
		if (await writeViaDesktopControl(text)) return true;
		if (i + 1 < attempts) await new Promise((r) => globalThis.setTimeout(r, 120 * (i + 1)));
	}
	return false;
}
async function writeClipboardTextToDevice(text) {
	const value = String(text ?? "");
	if (isDesktopControlClipboardShell()) {
		if (await writeViaDesktopControlWithRetry(value)) return;
		throw new Error("Desktop control clipboard write failed");
	}
	if (await writeViaDesktopControl(value)) return;
	if (await writeViaCwsBridge(value)) return;
	if (isCapacitorNative() && await writeCapacitorClipboardText(value)) return;
	if (globalThis.navigator?.clipboard?.writeText) {
		await globalThis.navigator.clipboard.writeText(value);
		return;
	}
	throw new Error("Clipboard write unavailable");
}
async function readClipboardTextFromDevice() {
	if (isDesktopControlClipboardShell()) {
		for (let i = 0; i < 4; i++) {
			const fromDesktop = await readViaDesktopControl();
			if (fromDesktop !== null) return fromDesktop;
			if (i + 1 < 4) await new Promise((r) => globalThis.setTimeout(r, 120 * (i + 1)));
		}
		throw new Error("Desktop control clipboard read failed");
	}
	const fromDesktop = await readViaDesktopControl();
	if (fromDesktop !== null) return fromDesktop;
	const fromBridge = await readViaCwsBridge();
	if (fromBridge) return fromBridge;
	if (isCapacitorNative()) {
		const fromCapacitor = await readCapacitorClipboardText();
		if (fromCapacitor) return fromCapacitor;
	}
	if (globalThis.navigator?.clipboard?.readText) return String(await globalThis.navigator.clipboard.readText());
	throw new Error("Clipboard read unavailable");
}
/** Opens notification settings for this app (Android / iOS). Best-effort. */
async function openNativeNotificationSettings() {
	if (!isCapacitorNative()) return;
	try {
		const { NativeSettings, AndroidSettings, IOSSettings } = await import(
			/* @vite-ignore */
			"capacitor-native-settings"
);
		await NativeSettings.open({
			optionAndroid: AndroidSettings.AppNotification,
			optionIOS: IOSSettings.AppNotification
		});
	} catch {}
}
/** Opens system UI where the user can adjust app permissions (Android / iOS). Best-effort. */
async function openAppClipboardRelatedSettings() {
	if (!isCapacitorNative()) return;
	try {
		const { NativeSettings, AndroidSettings, IOSSettings } = await import(
			/* @vite-ignore */
			"capacitor-native-settings"
);
		await NativeSettings.open({
			optionAndroid: AndroidSettings.ApplicationDetails,
			optionIOS: IOSSettings.App
		});
	} catch {}
}
//#endregion
export { writeClipboardTextToDevice as a, writeClipboardImageToDevice as i, isCapacitorNativeShell as n, readClipboardTextFromDevice as r, clipboard_device_exports as t };
