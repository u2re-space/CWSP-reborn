import { t as splitMultiValueList } from "./multi-value-list.js";
import { n as isCapacitorNative } from "./capacitor-permissions.js";
//#region src/frontend/boot/capacitor-share-intent.ts
/**
* Capacitor share / process-text bridge (Android → WebView).
* FIND:open-policy
*
* Fans out to the clipboard bus and runs the SKU share pipeline
* (process → AI/attach, document → viewer, explorer → path/ask, shell → pin/wallpaper).
* Document SKU does not ack pending-share — the viewer pull paints then acks.
*/
var emptyParsedShare = () => ({
	text: "",
	title: "",
	name: "",
	mime: "",
	asset: null,
	pending: false
});
var parseSharePayload = (detail) => {
	if (detail == null) return emptyParsedShare();
	if (typeof detail === "string") {
		const trimmed = detail.trim();
		if (!trimmed) return emptyParsedShare();
		try {
			const parsed = JSON.parse(trimmed);
			return {
				text: String(parsed?.text || "").trim() || (parsed?.asset ? "" : trimmed),
				title: String(parsed?.title || "").trim(),
				name: String(parsed?.name || "").trim(),
				mime: String(parsed?.mime || "").trim(),
				asset: parsed?.asset && typeof parsed.asset === "object" ? parsed.asset : parsed?.name ? {
					name: parsed.name,
					mimeType: parsed.mime
				} : null,
				pending: parsed?.pending === true
			};
		} catch {
			return {
				...emptyParsedShare(),
				text: trimmed
			};
		}
	}
	return {
		text: String(detail.text || "").trim(),
		title: String(detail.title || "").trim(),
		name: String(detail.name || "").trim(),
		mime: String(detail.mime || "").trim(),
		asset: detail.asset && typeof detail.asset === "object" ? detail.asset : detail.name ? {
			name: detail.name,
			mimeType: detail.mime
		} : null,
		pending: detail.pending === true
	};
};
var looksLikeFileShare = (echo) => {
	if (echo.hasFile) return true;
	const mime = String(echo.mime || "").toLowerCase();
	const name = String(echo.name || echo.title || "").toLowerCase();
	if (mime.startsWith("image/") || mime.startsWith("application/") || mime.startsWith("audio/") || mime.startsWith("video/")) return true;
	if (/\.(pdf|docx?|odt|rtf|pptx?|xlsx?|md|markdown|txt|png|jpe?g|gif|webp|html?|csv|json)$/i.test(name)) return true;
	return false;
};
var readDestinationNodes = (settings) => {
	const cwsp = settings.cwsp && typeof settings.cwsp === "object" ? settings.cwsp : {};
	const raw = String(cwsp.shareIntentDestinationIds || cwsp.destinationNodeIds || "*").trim() || "*";
	if (raw === "*" || raw.toLowerCase() === "any") return ["*"];
	return splitMultiValueList(raw);
};
var isDocumentSku = () => {
	try {
		const root = document.documentElement;
		if (String(root?.dataset?.cwspSku || "").trim() === "document") return true;
		const surface = String(root?.dataset?.cwspSurface || "");
		if (surface === "cw-document" || surface === "cw-markdown" || surface === "cw-document-crx") return true;
	} catch {}
	return false;
};
var isTransferSku = () => {
	try {
		return String(document.documentElement?.dataset?.cwspSku || "").trim() === "transfer";
	} catch {
		return false;
	}
};
var consumeNativePendingShare = async () => {
	try {
		const { invokeCwsPlatformIPC } = await import("./cws-bridge.js").then((n) => n.n);
		const peek = await invokeCwsPlatformIPC({ channel: "launcher:pending-share" });
		if (!peek?.ok) return null;
		if (isDocumentSku()) return null;
		const echo = peek.echo || peek;
		const stashedAt = Number(echo.stashedAt || 0) || void 0;
		const flagged = echo.hasFile === true || echo.hasFile === "true" || echo.hasFile === 1 || echo.hasFile === "1";
		if (!echo.text && !echo.title && !echo.name && !echo.url && !flagged) return null;
		const { dataUrlToFile, filenameFromLocalShareUri, isAndroidLocalShareUri } = await import("./sku-ingress.js").then((n) => n.m);
		let text = String(echo.text || "").trim();
		const title = String(echo.title || echo.name || "").trim();
		const name = String(echo.name || "").trim();
		const mime = String(echo.mime || "").trim();
		let url = String(echo.url || "").trim();
		const files = [];
		const local = isAndroidLocalShareUri(url) || isAndroidLocalShareUri(text);
		const wantFile = flagged || local || looksLikeFileShare({
			...echo,
			hasFile: flagged
		});
		const pullFile = async () => {
			const read = await invokeCwsPlatformIPC({ channel: "launcher:read-share-file" });
			const blob = read.echo || read;
			if (!blob?.data) return;
			const file = await dataUrlToFile(blob.data, String(echo.name || blob.name || filenameFromLocalShareUri(url || text) || "shared.bin").replace(/^open-\d+-/i, ""), String(blob.mime || echo.mime || "application/octet-stream"));
			if (file) files.push(file);
		};
		if (wantFile) await pullFile();
		if (!files.length) {
			const virtual = String(url || text || "").trim().replace(/^file:\/\/(?:localhost)?/i, "").replace(/^(?:\/storage\/emulated\/0|\/mnt\/sdcard)(?=\/|$)/i, "/sdcard");
			if (/^\/(?:sdcard|saf)(?:\/|$)/i.test(virtual)) try {
				const { readNativeStorageFile } = await import("../com/app3.js").then((n) => n._);
				const file = await readNativeStorageFile(virtual);
				if (file) files.push(file);
			} catch {}
		}
		if (wantFile && !files.length) {
			const status = await invokeCwsPlatformIPC({ channel: "storage:all-files-status" }).catch(() => null);
			if (!Boolean((status?.echo)?.allFilesAccess)) {
				await invokeCwsPlatformIPC({ channel: "storage:all-files-request" }).catch(() => null);
				const { showToast } = await import("./toast.js").then((n) => n.n);
				showToast({
					message: "Allow all-files access, then share the file again",
					kind: "warning"
				});
				return null;
			}
			await invokeCwsPlatformIPC({ channel: "launcher:restash-share-file" }).catch(() => null);
			await pullFile();
		}
		if (wantFile && !files.length) return null;
		if (files.length || !local && (text || url)) await invokeCwsPlatformIPC({
			channel: "launcher:ack-share",
			payload: stashedAt ? { stashedAt } : {}
		}).catch(() => null);
		const mappedUrl = String(url || text || "").trim().replace(/^file:\/\/(?:localhost)?/i, "").replace(/^(?:\/storage\/emulated\/0|\/mnt\/sdcard)(?=\/|$)/i, "/sdcard");
		if (/^\/(?:sdcard|saf)(?:\/|$)/i.test(mappedUrl)) url = mappedUrl;
		if (!text && !url && !files.length) return null;
		return {
			text,
			title,
			url,
			name,
			mime,
			files
		};
	} catch {
		return null;
	}
};
var ingestParsedShare = async (input) => {
	const { ingestSharePayload } = await import("../index.js").then((n) => n.t);
	const filename = String(input.files?.[0]?.name || input.name || input.title || "").trim();
	await ingestSharePayload({
		title: input.title || input.name || void 0,
		text: input.text || void 0,
		url: input.url || void 0,
		files: input.files?.length ? input.files : void 0,
		fileCount: input.files?.length || 0,
		timestamp: Date.now(),
		source: "share-target",
		hint: filename ? { filename } : void 0
	});
	try {
		const { flushHeldIngressToWorkCenter } = await import("./sku-ingress.js").then((n) => n.m);
		await flushHeldIngressToWorkCenter();
	} catch {}
};
var installed = false;
var ingestChain = Promise.resolve();
var enqueueShareIngest = (job) => {
	ingestChain = ingestChain.then(job, job);
};
var installCapacitorShareIntentBridge = () => {
	if (!isCapacitorNative() || installed) return;
	installed = true;
	if (isTransferSku()) return;
	const handler = (ev) => {
		(async () => {
			const { text, title, name, mime, asset, pending } = parseSharePayload(ev.detail);
			try {
				const [{ loadSettings }, ws, { classifyOpenKindFromPayload }, ingress] = await Promise.all([
					import("./Settings.js").then((n) => n.t),
					import("./hub-socket-boot.js").then((n) => n.c),
					import("./open-policy.js").then((n) => n.d),
					import("./process-ingress.js").then((n) => n.l)
				]);
				const settings = await loadSettings();
				ingress.rememberProcessIngressSettings(settings);
				const files = [];
				if (asset?.data) {
					const { dataUrlToFile } = await import("./sku-ingress.js").then((n) => n.m);
					const file = await dataUrlToFile(asset.data, String(asset.name || "shared.bin"), String(asset.mimeType || asset.type || "application/octet-stream"));
					if (file) files.push(file);
				}
				const kind = classifyOpenKindFromPayload({
					text,
					title,
					files,
					hint: { filename: name || title || files[0]?.name }
				});
				const row = ingress.resolveProcessIngressKind(settings, kind);
				if (row.mode === "process") {
					const { ensureCapacitorBridgeDaemonStarted } = await import("./capacitor-settings-permissions.js").then((n) => n.t);
					await ensureCapacitorBridgeDaemonStarted({
						...settings || {},
						shell: {
							...settings?.shell || {},
							bridgeDaemonEnabled: true
						}
					});
				}
				if (!(row.mode === "process" || String(document.documentElement?.dataset?.cwspSku || "").trim() === "process")) {
					const nodes = readDestinationNodes(settings);
					ws.connectWS();
					if (asset) ws.sendCoordinatorAct("clipboard:update", {
						asset,
						source: "android-share"
					}, nodes);
					if (text) ws.sendCoordinatorAct("clipboard:update", {
						text,
						source: "android-share"
					}, nodes);
				}
			} catch {}
			enqueueShareIngest(async () => {
				try {
					if (pending && isDocumentSku()) {
						try {
							window.dispatchEvent(new CustomEvent("cwsp:document-open", { detail: { source: "share-intent" } }));
						} catch {}
						return;
					}
					if (pending) {
						const native = await consumeNativePendingShare();
						if (native) {
							await ingestParsedShare(native);
							return;
						}
						return;
					}
					const { dataUrlToFile } = await import("./sku-ingress.js").then((n) => n.m);
					const files = [];
					if (asset?.data) {
						const file = await dataUrlToFile(asset.data, String(asset.name || name || "shared.bin"), String(asset.mimeType || asset.type || mime || "application/octet-stream"));
						if (file) files.push(file);
					}
					if (!text && !files.length && !asset) return;
					await ingestParsedShare({
						text,
						title: title || name || asset?.name,
						name,
						mime,
						files
					});
				} catch {}
			});
		})().catch(() => {});
	};
	window.addEventListener("cws:shareIntent", handler);
	const pullPending = () => {
		if (isDocumentSku() || isTransferSku()) return;
		try {
			if (document.visibilityState && document.visibilityState !== "visible") return;
		} catch {}
		enqueueShareIngest(async () => {
			const native = await consumeNativePendingShare().catch(() => null);
			if (native) await ingestParsedShare(native);
		});
	};
	document.addEventListener("visibilitychange", pullPending);
	window.addEventListener("pageshow", pullPending);
	enqueueShareIngest(async () => {
		await new Promise((resolve) => {
			const done = () => resolve();
			try {
				if (document.documentElement?.dataset?.cwspBoot === "ready") {
					done();
					return;
				}
			} catch {}
			const onReady = () => {
				window.removeEventListener("cwsp:boot-ready", onReady);
				done();
			};
			window.addEventListener("cwsp:boot-ready", onReady);
			window.setTimeout(done, 4e3);
		});
		if (isDocumentSku() || isTransferSku()) return;
		const native = await consumeNativePendingShare().catch(() => null);
		if (native) await ingestParsedShare(native);
	});
};
//#endregion
export { installCapacitorShareIntentBridge };
