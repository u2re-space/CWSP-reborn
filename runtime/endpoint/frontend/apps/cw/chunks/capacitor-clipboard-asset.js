import { n as isCapacitorNative } from "./capacitor-permissions.js";
//#region src/frontend/boot/capacitor-clipboard-asset.ts
var installed = false;
var dataUrlFromAsset = async (asset) => {
	const data = String(asset.data || "").trim();
	if (data.startsWith("data:")) return data;
	const mime = String(asset.mimeType || asset.type || "application/octet-stream");
	if (data && (asset.source === "base64" || /^[A-Za-z0-9+/=]+$/.test(data.slice(0, 64)))) return `data:${mime};base64,${data}`;
	const uri = String(asset.uri || asset.path || "").trim();
	if (uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("blob:")) try {
		const blob = await (await fetch(uri)).blob();
		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result || ""));
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
	return null;
};
/**
* Listen for native `cws:clipboardAsset` / CwsBridge nativeMessage and write
* image/file payloads through the WebView ClipboardItem API.
*/
var installCapacitorClipboardAssetBridge = () => {
	if (!isCapacitorNative() || installed) return;
	installed = true;
	const apply = (detail) => {
		(async () => {
			const asset = detail?.asset;
			if (!asset) return;
			const dataUrl = await dataUrlFromAsset(asset);
			if (!dataUrl || !navigator.clipboard?.write) return;
			const mime = String(asset.mimeType || asset.type || "image/png");
			const blob = await (await fetch(dataUrl)).blob();
			const item = new ClipboardItem({ [mime]: blob });
			await navigator.clipboard.write([item]);
		})().catch((err) => {
			console.warn("[capacitor-clipboard-asset] apply failed", err);
		});
	};
	window.addEventListener("cws:clipboardAsset", ((ev) => {
		const detail = ev.detail;
		if (typeof detail === "string") {
			try {
				apply(JSON.parse(detail));
			} catch {}
			return;
		}
		apply(detail);
	}));
	try {
		const bridge = globalThis.Capacitor?.Plugins?.CwsBridge;
		if (bridge?.addListener) bridge.addListener("nativeMessage", (event) => {
			if (event?.payload?.type === "clipboard:asset") apply(event.payload);
		});
	} catch {}
};
//#endregion
export { installCapacitorClipboardAssetBridge };
