import { r as __exportAll } from "./rolldown-runtime.js";
import { s as inferCwspSkuFromLocation } from "./ecosystem-skus.js";
import { C as surfaceForSku, _ as resolveOpenPolicy, a as classifyOpenKindFromPayload, f as peekOpenPolicy, o as inferIngressChannels, v as sinkToAction, y as sinkToDestination } from "./open-policy.js";
import { c as peekProcessIngressSettings, d as resolveProcessIngressKind } from "./process-ingress.js";
//#region src/shared/routing/channel/sku-ingress.ts
var sku_ingress_exports = /* @__PURE__ */ __exportAll({
	applyLauncherIngress: () => applyLauncherIngress,
	dataUrlToFile: () => dataUrlToFile,
	dropHeldIngressFiles: () => dropHeldIngressFiles,
	filenameFromLocalShareUri: () => filenameFromLocalShareUri,
	flushHeldIngressToWorkCenter: () => flushHeldIngressToWorkCenter,
	holdIngressFiles: () => holdIngressFiles,
	holdIngressFilesForPolicy: () => holdIngressFilesForPolicy,
	installShellImageOpenListener: () => installShellImageOpenListener,
	isAndroidLocalShareUri: () => isAndroidLocalShareUri,
	isWallpaperCompatible: () => isWallpaperCompatible,
	looksLikeDirectoryPath: () => looksLikeDirectoryPath,
	looksLikeWallpaperFile: () => looksLikeWallpaperFile,
	onHeldIngressFiles: () => onHeldIngressFiles,
	peekHeldIngressFiles: () => peekHeldIngressFiles,
	refineLauncherImageIngress: () => refineLauncherImageIngress,
	registerWorkCenterFlushHost: () => registerWorkCenterFlushHost,
	skuIngressHint: () => skuIngressHint,
	takeHeldIngressFiles: () => takeHeldIngressFiles
});
/** Android Open-with / Share often ships `file:`/`content:` — that is not a web URL. */
var isAndroidLocalShareUri = (value) => {
	const raw = String(value || "").trim();
	if (/^(file|content):/i.test(raw)) return true;
	if (/^\/(?:sdcard|saf)(?:\/|$)/i.test(raw)) return true;
	if (/^(?:\/storage\/emulated\/0|\/mnt\/sdcard)(?:\/|$)/i.test(raw)) return true;
	return false;
};
var filenameFromLocalShareUri = (value) => {
	const raw = String(value || "").trim();
	if (!raw) return "";
	try {
		return (decodeURIComponent(raw.replace(/^(?:file|content):\/\//i, "").split("?")[0] || "").split("/").filter(Boolean).pop() || "").replace(/^open-\d+-/i, "");
	} catch {
		return "";
	}
};
/**
* Same-tab File objects die when unified messaging queues through IDB/JSON.
* Hold them in memory so Work Center can still attach the real blobs.
*/
var heldIngressFiles = [];
var heldIngressListeners = /* @__PURE__ */ new Set();
var ingressFileKey = (file) => `${file.name}|${file.size}|${file.lastModified}`;
var notifyHeldIngress = () => {
	if (!heldIngressFiles.length) return;
	const snapshot = heldIngressFiles.slice();
	for (const listener of heldIngressListeners) try {
		listener(snapshot);
	} catch {}
};
/** Hold Files only for attach-mode kinds. Process-mode shares must not stage chat chips. */
var holdIngressFilesForPolicy = (files, payload, settings) => {
	if (payload && resolveProcessIngressKind(settings || peekProcessIngressSettings(), classifyOpenKindFromPayload(payload)).mode === "process") return;
	holdIngressFiles(files);
};
var holdIngressFiles = (files) => {
	const incoming = Array.isArray(files) ? files.filter((file) => file instanceof File) : [];
	if (!incoming.length) return;
	const seen = new Set(heldIngressFiles.map(ingressFileKey));
	let added = 0;
	for (const file of incoming) {
		const key = ingressFileKey(file);
		if (seen.has(key)) continue;
		seen.add(key);
		heldIngressFiles.push(file);
		added += 1;
	}
	if (added === 0) {
		notifyHeldIngress();
		return;
	}
	notifyHeldIngress();
};
var peekHeldIngressFiles = () => heldIngressFiles.slice();
var takeHeldIngressFiles = () => heldIngressFiles.splice(0, heldIngressFiles.length);
/** Drop only the Files that a view already attached — keep the rest of a merged hold. */
var dropHeldIngressFiles = (files) => {
	if (!files?.length) return;
	const drop = new Set(files.filter((file) => file instanceof File).map(ingressFileKey));
	if (!drop.size) return;
	for (let i = heldIngressFiles.length - 1; i >= 0; i--) if (drop.has(ingressFileKey(heldIngressFiles[i]))) heldIngressFiles.splice(i, 1);
};
/** In-memory host — Process mounts the inner chat div, so `querySelector("cw-workcenter-view")` is empty. */
var registeredWorkCenterFlushHost = null;
var registerWorkCenterFlushHost = (host) => {
	registeredWorkCenterFlushHost = host;
	return () => {
		if (registeredWorkCenterFlushHost === host) registeredWorkCenterFlushHost = null;
	};
};
var collectWorkCenterFlushHosts = () => {
	const hosts = [];
	const seen = /* @__PURE__ */ new Set();
	const add = (host) => {
		if (!host || seen.has(host)) return;
		seen.add(host);
		hosts.push(host);
	};
	add(registeredWorkCenterFlushHost);
	if (typeof document === "undefined") return hosts;
	const addEl = (node) => add(node);
	document.querySelectorAll("cw-workcenter-view").forEach(addEl);
	document.querySelectorAll("[data-shell], cw-shell-minimal, cw-shell-immersive, cw-shell-content, cw-shell-environment").forEach((shell) => {
		shell.shadowRoot?.querySelectorAll("cw-workcenter-view").forEach(addEl);
	});
	return hosts;
};
/**
* Same-heap attach after share/launch. Unified `deliveredNow` is not proof chips painted
* (settle + supersede can skip `handleMessage`; `navigate(workcenter)` remounts an empty draft).
*/
var flushHeldIngressToWorkCenter = async () => {
	const files = peekHeldIngressFiles();
	if (!files.length) return 0;
	notifyHeldIngress();
	try {
		const { postWorkCenterCommand } = await import("./workcenter-command-wire.js").then((n) => n.n);
		postWorkCenterCommand({
			type: "attach.add",
			files
		});
	} catch {}
	console.log("[sku-ingress] Flushing held ingress to Work Center", {
		fileCount: files.length,
		names: files.map((file) => file.name)
	});
	for (const host of collectWorkCenterFlushHosts()) try {
		if (typeof host.addFiles === "function") await host.addFiles(files);
		else if (typeof host.handleMessage === "function") await host.handleMessage({
			type: "content-attach",
			data: {
				files,
				fileCount: files.length
			}
		});
	} catch (error) {
		console.warn("[sku-ingress] flush to Work Center failed", error);
	}
	return files.length;
};
/**
* Work Center subscribes here so a hold after `sessionReady` still paints chips.
* If files are already held, the listener runs immediately.
*/
var onHeldIngressFiles = (listener) => {
	heldIngressListeners.add(listener);
	if (heldIngressFiles.length) try {
		listener(heldIngressFiles.slice());
	} catch {}
	return () => {
		heldIngressListeners.delete(listener);
	};
};
var loadLauncherState = () => import("../com/app4.js").then((n) => n.f);
var WALLPAPER_EXT = /* @__PURE__ */ new Set([
	"png",
	"jpg",
	"jpeg",
	"webp",
	"gif",
	"bmp",
	"avif"
]);
var MIN_WALLPAPER_BYTES = 20480;
var MAX_WALLPAPER_BYTES = 26214400;
var MIN_WALLPAPER_EDGE = 320;
var MAX_WALLPAPER_EDGE = 16384;
var MIN_WALLPAPER_ASPECT = .3;
var MAX_WALLPAPER_ASPECT = 3.5;
var fileExt = (name) => {
	const n = String(name || "").trim().toLowerCase();
	const cut = n.lastIndexOf(".");
	return cut > 0 ? n.slice(cut + 1) : "";
};
/** Directory-like path (share URL, launch path, or typed location). */
var looksLikeDirectoryPath = (raw) => {
	const t = String(raw || "").trim();
	if (!t) return false;
	if (/[/\\]$/.test(t)) return true;
	const noQuery = t.split(/[?#]/)[0] || t;
	if (/[/\\]$/.test(noQuery)) return true;
	const base = noQuery.replace(/\\/g, "/");
	const last = base.slice(base.lastIndexOf("/") + 1);
	if (!last) return true;
	if (/\.[a-z0-9]{1,8}$/i.test(last)) return false;
	return /[/\\]/.test(noQuery) || /^(file|content|saf):/i.test(t);
};
/** Sync wallpaper gate — decode still required before paint. */
var looksLikeWallpaperFile = (file) => {
	if (!file) return false;
	const mime = String(file.type || "").toLowerCase();
	const ext = fileExt(file.name);
	if (!(mime.startsWith("image/") || WALLPAPER_EXT.has(ext))) return false;
	if (mime.includes("svg") || ext === "svg") return false;
	if (file.size < MIN_WALLPAPER_BYTES || file.size > MAX_WALLPAPER_BYTES) return false;
	return true;
};
/** Decode-time checks: edge length and aspect so icons / strips do not become wallpaper. */
var isWallpaperCompatible = async (file) => {
	if (!looksLikeWallpaperFile(file)) return false;
	try {
		const bmp = await createImageBitmap(file);
		const w = bmp.width;
		const h = bmp.height;
		bmp.close?.();
		if (w < MIN_WALLPAPER_EDGE || h < MIN_WALLPAPER_EDGE) return false;
		if (w > MAX_WALLPAPER_EDGE || h > MAX_WALLPAPER_EDGE) return false;
		const aspect = w / h;
		return aspect >= MIN_WALLPAPER_ASPECT && aspect <= MAX_WALLPAPER_ASPECT;
	} catch {
		return false;
	}
};
var firstFile = (payload) => {
	return (Array.isArray(payload.files) ? payload.files : []).find((f) => f instanceof File);
};
var pathProbe = (payload) => {
	const hintPath = typeof payload.hint?.source === "string" ? payload.hint.source.trim() : "";
	if (hintPath) return hintPath;
	const url = String(payload.url || "").trim();
	if (url) return url;
	const title = String(payload.title || "").trim();
	if (title && /[/\\]/.test(title)) return title;
	const text = String(payload.text || "").trim();
	if (text && !/\s/.test(text) && /[/\\]/.test(text)) return text;
	return "";
};
/**
* Receiving SKU owns the share. Hub/CRX fall through to content-based routing.
* WHY: otherwise process hands text to document, and document hands images to process.
*/
var isNativeCapacitor = () => {
	try {
		return Boolean(globalThis.Capacitor?.isNativePlatform?.());
	} catch {
		return false;
	}
};
var skuDefaultDestination = (sku) => {
	if (sku === "process") return "workcenter";
	if (sku === "document") return "viewer";
	if (sku === "explorer") return "explorer";
	if (sku === "launcher") return "home";
};
var skuIngressHint = (payload, opts) => {
	const sku = opts?.sku || inferCwspSkuFromLocation();
	const settings = opts?.settings || peekProcessIngressSettings();
	const file = firstFile(payload);
	const path = pathProbe(payload);
	const filename = payload.hint?.filename || file?.name || "";
	const kind = classifyOpenKindFromPayload(payload);
	const sourceToken = String(payload.source || payload.route || payload.hint?.source || "").toLowerCase();
	const ingressSource = sourceToken.includes("launch") ? "launch-queue" : sourceToken.includes("share") ? "share-target" : sourceToken.includes("snip") ? "snip" : sourceToken.includes("capacitor") ? "capacitor" : "";
	const surface = surfaceForSku(sku);
	const channels = inferIngressChannels(ingressSource || void 0, isNativeCapacitor());
	const sink = resolveOpenPolicy(opts?.openPolicy || peekOpenPolicy(), surface, kind, channels);
	const skuDest = skuDefaultDestination(sku);
	if (sku === "document") return {
		destination: "viewer",
		action: "open",
		filename,
		source: path || payload.hint?.source,
		contentType: kind
	};
	if (sku === "process") {
		const row = resolveProcessIngressKind(settings, kind);
		return {
			destination: "workcenter",
			action: row.mode === "attach" ? "attach" : "process",
			filename,
			source: path || payload.hint?.source,
			contentType: kind,
			instructionId: row.instructionId,
			copyToClipboard: row.copyToClipboard
		};
	}
	if (surface && sink !== "ask") {
		if (sku === "explorer" && looksLikeDirectoryPath(path) && !file) return {
			destination: "explorer",
			action: "open",
			filename,
			source: path || payload.hint?.source,
			contentType: kind
		};
		const destination = sinkToDestination(sink, skuDest || "workcenter");
		if (destination === "workcenter") {
			const row = resolveProcessIngressKind(settings, kind);
			return {
				destination,
				action: row.mode === "attach" ? "attach" : "process",
				filename,
				source: path || payload.hint?.source,
				contentType: kind,
				sink,
				instructionId: row.instructionId,
				copyToClipboard: row.copyToClipboard
			};
		}
		return {
			destination,
			action: sinkToAction(sink, "open"),
			filename,
			source: path || payload.hint?.source,
			contentType: kind,
			sink
		};
	}
	if (!sku || sku === "crx") return void 0;
	if (sku === "transfer") return {
		destination: "network",
		action: "open",
		filename,
		contentType: kind,
		sink: "transfer"
	};
	if (sku === "explorer") {
		const dir = looksLikeDirectoryPath(path) && !file;
		if ((Boolean(file) || Number(payload.fileCount || 0) > 0) && !dir) return {
			destination: "viewer",
			action: "open",
			filename,
			source: path || payload.hint?.source,
			contentType: kind,
			sink: "document"
		};
		return {
			destination: "explorer",
			action: "open",
			filename,
			source: path || payload.hint?.source,
			contentType: kind
		};
	}
	if (sku === "launcher") {
		const hinted = payload.hint?.action;
		const wallpaper = hinted === "wallpaper" || hinted !== "shortcut" && looksLikeWallpaperFile(file || null);
		return {
			destination: "home",
			action: wallpaper ? "wallpaper" : "shortcut",
			filename,
			contentType: wallpaper ? "image" : void 0
		};
	}
};
/**
* Wallpaper sink: keep home only when the photo passes size/aspect.
* WHY: icons and strips must not become wallpaper — send those to the viewer.
*/
var refineLauncherImageIngress = async (hint, files) => {
	if (!hint || hint.action !== "wallpaper") return hint;
	if (!files?.length) return hint;
	const image = files.find((f) => looksLikeWallpaperFile(f));
	if (image && await isWallpaperCompatible(image)) return hint;
	return {
		...hint,
		destination: "viewer",
		action: "open",
		contentType: "image",
		sink: "viewer"
	};
};
var dataUrlToFile = async (raw, name = "shared.bin", mime = "application/octet-stream") => {
	const src = String(raw || "").trim();
	if (!src) return null;
	try {
		const blob = src.startsWith("data:") ? await (await fetch(src)).blob() : new Blob([Uint8Array.from(atob(src.replace(/^data:[^,]*,/, "")), (c) => c.charCodeAt(0))], { type: mime });
		return new File([blob], name, { type: blob.type || mime });
	} catch {
		return null;
	}
};
/** Paint wallpaper or pin a Speed Dial tile. Used by shell share-target and launch-queue. */
var applyLauncherIngress = async (payload) => {
	const files = Array.isArray(payload.files) ? payload.files.filter((f) => f instanceof File) : [];
	const image = files.find((f) => looksLikeWallpaperFile(f));
	if ((payload.action === "wallpaper" || !payload.action) && image && await isWallpaperCompatible(image)) {
		const { setAppWallpaperFromBlob, getWallpaperStoragePointer, WALLPAPER_IDB_MARKER } = await import("../vendor/culori2.js").then((n) => n.t);
		const { wallpaperState, persistWallpaper } = await loadLauncherState();
		await setAppWallpaperFromBlob(image);
		wallpaperState.src = getWallpaperStoragePointer() || WALLPAPER_IDB_MARKER;
		persistWallpaper();
		return "wallpaper";
	}
	if (payload.action === "wallpaper") return "none";
	const { pinSpeedDialLinkFromIntent, parseSpeedDialItemFromURL, parseSpeedDialItemFromSmartText, addSpeedDialItem, persistSpeedDialItems, persistSpeedDialMeta, findNextFreeSpeedDialCell } = await loadLauncherState();
	const cell = findNextFreeSpeedDialCell();
	const url = String(payload.url || "").trim();
	const text = String(payload.text || "").trim();
	const title = String(payload.title || files[0]?.name || "").trim();
	if (url) {
		if (pinSpeedDialLinkFromIntent({
			url,
			href: url,
			label: title || void 0,
			text,
			source: "share-target"
		}, cell)) {
			persistSpeedDialItems();
			persistSpeedDialMeta();
			return "shortcut";
		}
	}
	const fromUrl = url ? parseSpeedDialItemFromURL(url, cell) : null;
	const fromText = !fromUrl && text ? parseSpeedDialItemFromSmartText(text, cell) || parseSpeedDialItemFromURL(text, cell) : null;
	const item = fromUrl || fromText;
	if (item) {
		addSpeedDialItem(item);
		persistSpeedDialItems();
		persistSpeedDialMeta();
		return "shortcut";
	}
	if (files[0]) {
		if (pinSpeedDialLinkFromIntent({
			label: files[0].name,
			text: files[0].name,
			mimeType: files[0].type,
			source: "share-target",
			action: "open-view"
		}, cell)) {
			persistSpeedDialItems();
			persistSpeedDialMeta();
			return "shortcut";
		}
	}
	return "none";
};
var SHELL_IMAGE_OPEN_EVENT = "cwsp:shell-image-open";
var shellImageOpenInstalled = false;
var openShellImageInViewer = async (file) => {
	const { dispatchViewTransfer } = await import("./ViewTransferRouting.js").then((n) => n.t);
	await dispatchViewTransfer({
		source: "clipboard",
		route: "clipboard",
		files: [file],
		fileCount: 1,
		hint: {
			destination: "viewer",
			action: "open",
			filename: file.name,
			contentType: "image",
			sink: "viewer"
		}
	});
};
var applyShellWallpaper = async (file) => {
	if (!await isWallpaperCompatible(file)) return false;
	const { setAppWallpaperFromBlob, getWallpaperStoragePointer, WALLPAPER_IDB_MARKER } = await import("../vendor/culori2.js").then((n) => n.t);
	const { wallpaperState, persistWallpaper } = await loadLauncherState();
	await setAppWallpaperFromBlob(file);
	wallpaperState.src = getWallpaperStoragePointer() || WALLPAPER_IDB_MARKER;
	persistWallpaper();
	return true;
};
/**
* Home drop/paste: SpeedDial fires `cwsp:shell-image-open`. Policy picks wallpaper vs viewer.
*/
var installShellImageOpenListener = () => {
	if (shellImageOpenInstalled || typeof window === "undefined") return;
	shellImageOpenInstalled = true;
	window.addEventListener(SHELL_IMAGE_OPEN_EVENT, (raw) => {
		const ev = raw;
		const file = ev.detail?.file;
		if (!(file instanceof File)) return;
		ev.preventDefault();
		(async () => {
			try {
				const { loadSettings } = await import("./Settings.js").then((n) => n.t);
				const { peekOpenPolicy, rememberOpenPolicyFromSettings, resolveOpenPolicy } = await import("./open-policy.js").then((n) => n.d);
				const settings = await loadSettings().catch(() => null);
				rememberOpenPolicyFromSettings(settings);
				const sink = resolveOpenPolicy(settings?.openPolicy ?? peekOpenPolicy(), "shell", "image", "open");
				if (sink === "viewer" || sink === "display") {
					await openShellImageInViewer(file);
					return;
				}
				if (sink === "document" || sink === "transfer" || sink === "system" || sink === "external") {
					const { dispatchViewTransfer } = await import("./ViewTransferRouting.js").then((n) => n.t);
					await dispatchViewTransfer({
						source: "clipboard",
						route: "clipboard",
						files: [file],
						fileCount: 1,
						hint: {
							destination: sink === "transfer" ? "network" : "viewer",
							action: "open",
							filename: file.name,
							contentType: "image",
							sink
						}
					});
					return;
				}
				if (sink === "workcenter") {
					const { dispatchViewTransfer } = await import("./ViewTransferRouting.js").then((n) => n.t);
					await dispatchViewTransfer({
						source: "clipboard",
						route: "clipboard",
						files: [file],
						fileCount: 1,
						hint: {
							destination: "workcenter",
							action: "attach",
							filename: file.name,
							contentType: "image"
						}
					});
					return;
				}
				if (sink === "wallpaper" || sink === "ask") {
					if (await applyShellWallpaper(file)) return;
					if (sink === "wallpaper") await openShellImageInViewer(file);
					return;
				}
				if (!await applyShellWallpaper(file)) await openShellImageInViewer(file);
			} catch (error) {
				console.warn("[sku-ingress] shell image open failed", error);
			}
		})();
	});
};
//#endregion
export { holdIngressFiles as a, isAndroidLocalShareUri as c, refineLauncherImageIngress as d, registerWorkCenterFlushHost as f, takeHeldIngressFiles as h, flushHeldIngressToWorkCenter as i, onHeldIngressFiles as l, sku_ingress_exports as m, dataUrlToFile as n, holdIngressFilesForPolicy as o, skuIngressHint as p, dropHeldIngressFiles as r, installShellImageOpenListener as s, applyLauncherIngress as t, peekHeldIngressFiles as u };
