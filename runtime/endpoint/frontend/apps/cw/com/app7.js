import { _ as stashSkuHandoff, c as isCwspNativeHost, f as publicHrefForSku, h as shouldHandoffViewToSibling, p as publicHrefForView, r as androidPackageForSku, v as takeSkuHandoff } from "../chunks/ecosystem-skus.js";
import { F as property, I as H, J as bindWith, P as defineElement, S as initGlobalClipboard } from "../vendor/culori.js";
import { g as getDir } from "./app.js";
import { b as sinkToOpenLinkTarget, f as peekOpenPolicy, g as resolveOpenPlacement, h as resolveHostOpenPolicy, i as classifyOpenKindFromName, m as resolveExplorerOpenSink, p as rememberOpenPolicyFromSettings, r as classifyOpenKind, s as looksLikePreviewableBinary, w as viewIdForOpenSink, x as skuForOpenSink } from "../chunks/open-policy.js";
import { a as loadSettings } from "../chunks/Settings.js";
import { n as createViewConstructor, t as sendViewProtocolMessage } from "../chunks/UniformViewTransport.js";
import { T as toExplorerStoragePath, w as resolveEntryIcon } from "./app3.js";
import { A as resolveFsBackend, O as ensureDefaultFsBackends } from "./app4.js";
import { a as persistSpeedDialItems, i as ensureSpeedDialMeta, o as persistSpeedDialMeta, r as createEmptySpeedDialItem, s as speedDialItems, t as addSpeedDialItem } from "../chunks/StateStorage.js";
import { _ as FileOperative, a as sortExplorerEntries, c as __decorate, d as openUnifiedContextMenu, f as entryKey, g as iconFor, h as formatSize, i as peekExplorerSort, m as formatDate, n as openExplorerSettings, o as UIElement, p as entryKind, r as EXPLORER_SORT_EVENT, t as closeExplorerSettings, u as createItemCtxMenu, v as isBookmarksPath } from "./app5.js";
import { t as ExplorerChannelAction } from "../chunks/channel-actions.js";
import { g as file_manager_default, v as file_manager_content_default } from "../fest/veela.js";
import { addEvent, handleStyleChange } from "/fest/dom.js";
import { affected, observe, propRef, ref } from "/fest/object.js";
import { loadAsAdopted as loadAsAdopted$1, preloadStyle as preloadStyle$1, removeAdopted, scheduleBakeScreenColors, unbakeScreenColors } from "/fest/style-lib.js";
//#region ../CWSP-explorer/src/inject.ts
/** Merge inject layers: menu items concatenate; handlers shallow-merge last-wins; onWire chains in order. */
function mergeExplorerInject(...layers) {
	const defined = layers.filter(Boolean);
	if (!defined.length) return void 0;
	return {
		extraBackgroundMenuItems: (ctx) => defined.flatMap((l) => l.extraBackgroundMenuItems?.(ctx) ?? []),
		contextActionHandlers: defined.reduce((acc, l) => ({
			...acc,
			...l.contextActionHandlers ?? {}
		}), {}),
		onWire: (fm, root) => {
			for (const l of defined) l.onWire?.(fm, root);
		}
	};
}
var registered;
/** App-wide explorer hooks (boot/plugins). */
function registerExplorerInject(api) {
	registered = api;
}
function getRegisteredExplorerInject() {
	return registered;
}
//#endregion
//#region ../CWSP-explorer/src/utils.ts
/**
* Empty-area / shell context menu for Explorer.
* Delegates to unified menu (icons, vertical layout, overlay mount, no backdrop-filter mask bugs).
*/
var openExplorerContextMenu = (x, y, items, options) => {
	const entries = items.map((item) => ({
		id: item.id,
		label: item.label,
		...item.icon ? { icon: item.icon } : {},
		action: () => item.action()
	}));
	openUnifiedContextMenu({
		x,
		y,
		items: entries,
		compact: true,
		anchor: options?.anchor ?? null,
		resolveOverlayMountPoint: options?.resolveOverlayMountPoint
	});
};
var requestOpenView = (request) => {
	const viewId = String(request?.viewId || "").trim().toLowerCase();
	if (!viewId) return;
	if (shouldHandoffViewToSibling(viewId)) {
		const href = publicHrefForView(viewId);
		if (href) {
			globalThis.location.assign(href);
			return;
		}
	}
	const raw = request?.target || "window";
	const target = raw === "base" ? "immersive" : raw;
	globalThis?.dispatchEvent?.(new CustomEvent("cw:view-open-request", { detail: {
		viewId,
		target,
		params: request?.params || {}
	} }));
};
var TEXT_FILE_EXTENSIONS = /* @__PURE__ */ new Set([
	"md",
	"markdown",
	"txt",
	"text",
	"json",
	"xml",
	"yml",
	"yaml",
	"html",
	"htm",
	"css",
	"js",
	"mjs",
	"cjs",
	"ts",
	"tsx",
	"jsx",
	"log",
	"ini",
	"conf",
	"cfg",
	"csv"
]);
var buildExplorerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `explorer-${String(path || "root").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "root"}-${stamp}-${suffix}`;
};
var extOf = (filename = "") => {
	const next = String(filename).trim().toLowerCase();
	const idx = next.lastIndexOf(".");
	if (idx <= 0 || idx >= next.length - 1) return "";
	return next.slice(idx + 1);
};
var isTextLikeFile = (file) => {
	if (!file) return false;
	if (looksLikePreviewableBinary(file)) return false;
	const type = String(file.type || "").toLowerCase();
	if (type.startsWith("text/")) return true;
	if (type.includes("markdown") || type.includes("json") || type.includes("xml")) return true;
	return TEXT_FILE_EXTENSIONS.has(extOf(file.name || ""));
};
var buildViewerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `viewer-${String(path || "viewer").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "viewer"}-${stamp}-${suffix}`;
};
var guessNextShortcutCell = () => {
	const occupied = new Set(Array.from(speedDialItems ?? []).map((item) => `${Math.round(item?.cell?.[0] || 0)}:${Math.round(item?.cell?.[1] || 0)}`));
	const maxRows = 12;
	const maxCols = 8;
	for (let row = 0; row < maxRows; row += 1) for (let col = 0; col < maxCols; col += 1) {
		const key = `${col}:${row}`;
		if (!occupied.has(key)) return [col, row];
	}
	return [0, 0];
};
//#endregion
//#region ../CWSP-explorer/src/runtime.ts
/** WHY: do not import StorageKeys from the lure barrel — com/app.js letters desync. */
var EXPLORER_PATH_LS_KEYS = ["view-explorer-path", "rs-explorer-path"];
var lsGet = (key) => {
	try {
		return String(globalThis?.localStorage?.getItem?.(key) || "").trim();
	} catch {
		return "";
	}
};
var lsSet = (key, value) => {
	try {
		globalThis?.localStorage?.setItem?.(key, value);
	} catch {}
};
var openFileWithSystem = async (file, sourcePath, chooser) => {
	const href = String(sourcePath || "").trim();
	const mime = String(file.type || "").trim() || guessMimeFromName(file.name || href) || void 0;
	try {
		const { launcherOpenUri } = await import("../chunks/launcher-bridge.js").then((n) => n.t);
		if (typeof launcherOpenUri === "function") {
			const uri = /^(file|content|https?):/i.test(href) ? href : "";
			if (uri && await launcherOpenUri(uri, {
				chooser,
				mimeType: mime,
				title: "Open with"
			})) return true;
			if (isNativeStorageVirtualPath(href)) {
				const { openNativeStorageFile } = await import("./app3.js").then((n) => n._);
				if (await openNativeStorageFile(href, {
					chooser,
					mimeType: mime,
					title: "Open with"
				})) return true;
			}
		}
	} catch {}
	if (isCwspNativeHost() && chooser && file.size > 0 && file.size <= 8388608) try {
		const { launcherOpenFile } = await import("../chunks/launcher-bridge.js").then((n) => n.t);
		if (await launcherOpenFile(file, {
			chooser: true,
			mimeType: mime,
			title: "Open with"
		})) return true;
	} catch {}
	if (isCwspNativeHost()) return false;
	try {
		const url = URL.createObjectURL(file);
		globalThis.open?.(url, "_blank", "noopener,noreferrer");
		return true;
	} catch {
		return false;
	}
};
var guessMimeFromName = (name) => {
	const n = String(name || "").toLowerCase();
	if (/\.(?:md|markdown|mdown|mkd)(?:$|[?#])/i.test(n)) return "text/markdown";
	if (/\.(?:txt|log|csv)(?:$|[?#])/i.test(n)) return "text/plain";
	if (/\.json(?:$|[?#])/i.test(n)) return "application/json";
	if (/\.pdf(?:$|[?#])/i.test(n)) return "application/pdf";
	if (/\.png(?:$|[?#])/i.test(n)) return "image/png";
	if (/\.jpe?g(?:$|[?#])/i.test(n)) return "image/jpeg";
	if (/\.webp(?:$|[?#])/i.test(n)) return "image/webp";
	if (/\.gif(?:$|[?#])/i.test(n)) return "image/gif";
	return "";
};
var isNativeStorageVirtualPath = (path) => /^\/(?:sdcard|saf)(?:\/|$)/i.test(String(path || "").trim());
/** Site / OPFS / mount paths the viewer can fetch without a File blob. */
var canOpenExplorerSrc = (path) => /^(?:\/(?:assets|user|mounts)\b|https?:)/i.test(String(path || "").trim());
var openExplorerSrcInTab = (sourcePath) => {
	const href = String(sourcePath || "").trim();
	if (!href) return false;
	try {
		const url = /^https?:/i.test(href) ? href : new URL(href, globalThis.location?.href || "https://u2re.space/").href;
		globalThis.open?.(url, "_blank", "noopener,noreferrer");
		return true;
	} catch {
		return false;
	}
};
/** WHY: `/sdcard/` `/saf/` open in one native IPC — no JS read, no WebView hop. */
var openNativeStorageByPolicy = async (sourcePath, sink, mimeType) => {
	const { openNativeStorageFile } = await import("./app3.js").then((n) => n._);
	const mime = String(mimeType || "").trim() || guessMimeFromName(sourcePath);
	if (sink === "system" || sink === "external" || sink === "ask") return openNativeStorageFile(sourcePath, {
		chooser: true,
		mimeType: mime,
		title: "Open with"
	});
	if (sink === "document" || sink === "transfer" || sink === "viewer" || sink === "display") {
		const pkg = androidPackageForSku(sink === "transfer" ? "transfer" : "document");
		if (pkg && await openNativeStorageFile(sourcePath, {
			packageName: pkg,
			chooser: false,
			mimeType: mime,
			title: "Open"
		})) return true;
		return openNativeStorageFile(sourcePath, {
			chooser: true,
			mimeType: mime,
			title: "Open with"
		});
	}
	return false;
};
var nativeViewUri = async (sourcePath) => {
	const p = String(sourcePath || "").trim();
	if (/^(content|file|https?):/i.test(p)) return p;
	try {
		const { resolveNativeStorageUri } = await import("./app3.js").then((n) => n._);
		const uri = await resolveNativeStorageUri(p);
		if (uri) return uri;
	} catch {}
	if (/^\/(?:sdcard|storage)\//i.test(p)) return `file://${p}`;
	return "";
};
var handoffFileToSku = async (sink, item, sourcePath) => {
	const file = item.file;
	const sku = skuForOpenSink(sink);
	const viewId = viewIdForOpenSink(sink);
	if (!sku || !viewId) return false;
	if (!file) {
		if (!isCwspNativeHost() && viewId === "viewer" && canOpenExplorerSrc(sourcePath) && !shouldHandoffViewToSibling("viewer")) {
			requestOpenView({
				viewId: "viewer",
				target: "window",
				params: {
					src: sourcePath,
					filename: String(item.name || "")
				}
			});
			return true;
		}
		return false;
	}
	try {
		const content = isTextLikeFile(file) ? await file.text() : "";
		stashSkuHandoff({
			dest: viewId,
			content,
			filename: file.name || "",
			src: sourcePath
		});
	} catch {
		stashSkuHandoff({
			dest: viewId,
			filename: file.name || "",
			src: sourcePath
		});
	}
	if (isCwspNativeHost()) {
		const pkg = androidPackageForSku(sku);
		const mime = String(file.type || "").trim() || guessMimeFromName(file.name) || void 0;
		const uri = await nativeViewUri(sourcePath);
		if (pkg && uri) try {
			const { launcherOpenUri } = await import("../chunks/launcher-bridge.js").then((n) => n.t);
			if (await launcherOpenUri(uri, {
				packageName: pkg,
				chooser: false,
				mimeType: mime,
				title: "Open"
			})) return true;
		} catch {}
		if (pkg && file.size > 0 && file.size <= 8388608) try {
			const { launcherOpenFile } = await import("../chunks/launcher-bridge.js").then((n) => n.t);
			if (await launcherOpenFile(file, {
				packageName: pkg,
				chooser: false,
				mimeType: mime,
				title: "Open"
			})) return true;
		} catch {}
		return false;
	}
	const href = publicHrefForSku(sku);
	if (href) {
		try {
			const next = new URL(href, globalThis.location?.href || href);
			if (sourcePath) next.searchParams.set("src", sourcePath);
			if (file.name) next.searchParams.set("filename", file.name);
			globalThis.location.assign(next.toString());
		} catch {
			globalThis.location.assign(href);
		}
		return true;
	}
	requestOpenView({
		viewId,
		target: "window",
		params: {
			src: sourcePath,
			filename: file.name || ""
		}
	});
	return true;
};
var readPersistedExplorerPath = () => {
	for (const key of EXPLORER_PATH_LS_KEYS) {
		const value = lsGet(key);
		if (value) return value;
	}
	return "";
};
var writePersistedExplorerPath = (path) => {
	const value = path || "/user/";
	for (const key of EXPLORER_PATH_LS_KEYS) lsSet(key, value);
};
function loadLastPath(explorer, initialPath) {
	try {
		ensureDefaultFsBackends();
		import("../vendor/culori.js").then((n) => n.t).then((m) => m.ensureRemoteMountedFs()).catch(() => {});
	} catch {}
	if (initialPath && initialPath.trim()) {
		explorer.path = toExplorerStoragePath(initialPath) || initialPath.trim();
		return;
	}
	const handed = takeSkuHandoff("explorer");
	if (handed?.src) {
		explorer.path = toExplorerStoragePath(handed.src) || handed.src;
		return;
	}
	const persisted = readPersistedExplorerPath();
	explorer.path = !persisted || persisted === "/" ? "/user/" : persisted;
}
function setupExplorerEvents(explorer, opts, inject, signal) {
	const listenerOpts = { signal };
	const showMessage = (message) => opts.shellContext?.showMessage?.(message);
	const openFileInViewer = async (item, fullPath, target = "window", placement = "inline") => {
		const file = item?.file;
		const sourcePath = String(fullPath || "").trim();
		const filename = String(file?.name || item?.name || sourcePath.split("/").pop() || "").trim();
		if (!!!(file && (isTextLikeFile(file) || looksLikePreviewableBinary(file))) && !canOpenExplorerSrc(sourcePath)) return false;
		if (target === "base" || target === "immersive") {
			requestOpenView({
				viewId: "viewer",
				target: "immersive",
				params: {
					src: sourcePath,
					filename,
					processId: buildViewerProcessId(sourcePath)
				}
			});
			return true;
		}
		if (!isCwspNativeHost() && placement === "new-tab") {
			if (file) return openFileWithSystem(file, sourcePath, false);
			return openExplorerSrcInTab(sourcePath);
		}
		if (!isCwspNativeHost() && placement === "native-window") {
			try {
				const content = file && isTextLikeFile(file) ? await file.text() : "";
				stashSkuHandoff({
					dest: "viewer",
					content,
					filename,
					src: sourcePath
				});
			} catch {
				stashSkuHandoff({
					dest: "viewer",
					filename,
					src: sourcePath
				});
			}
			try {
				const next = new URL(globalThis.location?.href || "https://u2re.space/");
				next.searchParams.set("shell", "environment");
				next.searchParams.set("view", "viewer");
				next.searchParams.set("native", "1");
				if (sourcePath) next.searchParams.set("src", sourcePath);
				if (filename) next.searchParams.set("filename", filename);
				globalThis.open?.(next.href, "cwsp-viewer", "noopener,noreferrer,width=960,height=800");
				return true;
			} catch {}
			if (file) return openFileWithSystem(file, sourcePath, false);
			return openExplorerSrcInTab(sourcePath);
		}
		const processId = buildViewerProcessId(sourcePath);
		const params = {
			processId,
			src: sourcePath,
			filename
		};
		requestOpenView({
			viewId: "viewer",
			target: "window",
			params
		});
		const openView = opts.shellContext?.openView;
		if (typeof openView === "function") openView("viewer", { params });
		if (file) try {
			if (!await sendViewProtocolMessage({
				type: "content-view",
				source: "explorer",
				destination: "viewer",
				contentType: file.type || "text/plain",
				attachments: [{
					data: file,
					source: "explorer-viewer-open"
				}],
				data: {
					filename,
					path: sourcePath,
					source: sourcePath
				},
				metadata: {
					processId,
					openTarget: "window"
				}
			})) showMessage("Viewer is not ready yet, retrying in background");
		} catch (error) {
			console.warn("[Explorer] Failed to send viewer payload:", error);
		}
		try {
			globalThis.dispatchEvent(new CustomEvent("cwsp:document-open", { detail: {
				src: sourcePath,
				filename
			} }));
		} catch {}
		return true;
	};
	const attachToWorkCenter = async (item, mode) => {
		const file = item?.file;
		if (!file) {
			showMessage("No file selected");
			return;
		}
		const sourcePath = `${explorer?.path || "/"}${item?.name || file.name}`;
		if (shouldHandoffViewToSibling("workcenter")) {
			try {
				const content = isTextLikeFile(file) ? await file.text() : "";
				stashSkuHandoff({
					dest: "workcenter",
					content,
					filename: file.name || "",
					src: sourcePath
				});
			} catch {
				stashSkuHandoff({
					dest: "workcenter",
					filename: file.name || "",
					src: sourcePath
				});
			}
			const href = publicHrefForView("workcenter");
			if (href) globalThis.location.assign(href);
			return;
		}
		if (mode === "headless") requestOpenView({
			viewId: "workcenter",
			target: "headless",
			params: {
				queue: "1",
				mode: "headless",
				sourcePath
			}
		});
		else if (mode === "active") requestOpenView({
			viewId: "workcenter",
			target: "window"
		});
		else requestOpenView({
			viewId: "workcenter",
			target: "window",
			params: {
				minimized: "1",
				queue: "1",
				sourcePath
			}
		});
		if (await sendViewProtocolMessage({
			type: "content-share",
			source: "explorer",
			destination: "workcenter",
			contentType: file.type || "application/octet-stream",
			attachments: [{
				data: file,
				source: "explorer-workcenter-attach"
			}],
			data: {
				filename: file.name,
				path: sourcePath,
				source: "explorer-attach",
				queued: mode !== "active"
			},
			metadata: {
				queueState: mode === "active" ? "awaiting" : mode === "queued" ? "pending" : "queued",
				mode,
				sourcePath
			}
		})) showMessage(mode === "active" ? `Attached ${file.name} to Work Center` : `Queued ${file.name} for Work Center (${mode})`);
		else showMessage("Work Center queue is unavailable");
	};
	const pinToHome = (item) => {
		const file = item?.file;
		const name = String(item?.name || file?.name || "").trim();
		if (!name) {
			showMessage("Nothing to pin");
			return;
		}
		const path = `${explorer?.path || "/"}${name}`;
		const cell = observe(guessNextShortcutCell());
		const shortcut = createEmptySpeedDialItem(cell);
		shortcut.label.value = name;
		shortcut.icon.value = item?.kind === "directory" ? "folder" : "file-text";
		shortcut.action = "open-link";
		addSpeedDialItem(shortcut);
		const meta = ensureSpeedDialMeta(shortcut.id, { action: "open-link" });
		meta.action = "open-link";
		meta.href = path;
		meta.description = `Pinned from Explorer: ${path}`;
		const pinSink = resolveExplorerOpenSink(peekOpenPolicy(), classifyOpenKind(file || { name }), isCwspNativeHost());
		const pinTarget = sinkToOpenLinkTarget(pinSink);
		if (pinTarget) meta.openLinkTarget = pinTarget;
		persistSpeedDialItems();
		persistSpeedDialMeta();
		showMessage(`Pinned ${name} to Home`);
	};
	const getItemPath = (item) => String(item?.path || `${explorer?.path || "/"}${item?.name || ""}`);
	const mergedHandlers = {
		view: async (item) => {
			const p = getItemPath(item);
			if (isCwspNativeHost() && isNativeStorageVirtualPath(p)) {
				if (await openNativeStorageByPolicy(p, "document")) return;
			}
			if (isCwspNativeHost()) {
				await handoffFileToSku("document", item, p);
				return;
			}
			await openFileInViewer(item, p, "window", resolveOpenPlacement(peekOpenPolicy(), "explorer"));
		},
		"view-base": async (item) => {
			const p = getItemPath(item);
			if (isCwspNativeHost() && isNativeStorageVirtualPath(p)) {
				if (await openNativeStorageByPolicy(p, "document")) return;
			}
			if (isCwspNativeHost()) {
				await handoffFileToSku("document", item, p);
				return;
			}
			await openFileInViewer(item, p, "base");
		},
		"send-transfer": async (item) => {
			if (!item) {
				showMessage("No file selected");
				return;
			}
			const sendPath = getItemPath(item);
			if (isCwspNativeHost() && isNativeStorageVirtualPath(sendPath)) {
				const ok = await openNativeStorageByPolicy(sendPath, "transfer", guessMimeFromName(item.name || sendPath));
				showMessage(ok ? `Sent ${item.name || sendPath} to Transfer` : "Transfer is unavailable");
				return;
			}
			if (!item.file && item.kind === "file") try {
				const backend = resolveFsBackend(sendPath);
				if (typeof backend?.readFile === "function") item.file = await backend.readFile(sendPath);
			} catch {}
			if (!item.file) {
				showMessage("Nothing to send");
				return;
			}
			const ok = await handoffFileToSku("transfer", item, sendPath);
			showMessage(ok ? `Sent ${item.name || item.file.name} to Transfer` : "Transfer is unavailable");
		},
		"attach-workcenter": (item) => attachToWorkCenter(item, "active"),
		"attach-workcenter-queued": (item) => attachToWorkCenter(item, "queued"),
		"attach-workcenter-headless": (item) => attachToWorkCenter(item, "headless"),
		"pin-home": (item) => pinToHome(item),
		...inject?.contextActionHandlers ?? {}
	};
	const ensureItemFile = async (item, sourcePath) => {
		if (item.file) return;
		try {
			const backend = resolveFsBackend(sourcePath);
			if (typeof backend?.readFile === "function") item.file = await backend.readFile(sourcePath);
		} catch {}
		if (!item.file) try {
			const { provide } = await import("../vendor/culori.js").then((n) => n.t);
			item.file = await provide(sourcePath);
		} catch {}
	};
	const onNativeFileOpen = async (item, sourcePath, sink) => {
		if (sink === "explorer") {
			showMessage(item.name || "File");
			return;
		}
		if (isNativeStorageVirtualPath(sourcePath) && sink !== "workcenter") {
			try {
				if (await openNativeStorageByPolicy(sourcePath, sink, guessMimeFromName(item.name || sourcePath))) return;
			} catch {}
			showMessage(sink === "document" ? "CWSP-document did not open the file" : sink === "transfer" ? "Transfer is unavailable" : "No app available to open this file");
			return;
		}
		await ensureItemFile(item, sourcePath);
		if (sink === "system" || sink === "external" || sink === "ask") {
			if (item.file && await openFileWithSystem(item.file, sourcePath, true)) return;
			showMessage("No app available to open this file");
			return;
		}
		if (sink === "document" || sink === "transfer") {
			if (await handoffFileToSku(sink, item, sourcePath)) return;
			showMessage(sink === "document" ? "CWSP-document did not open the file" : "Transfer is unavailable");
			return;
		}
		if (sink === "workcenter") {
			if (item.file) await attachToWorkCenter(item, "active");
			else showMessage("Could not read this file");
			return;
		}
		if (await handoffFileToSku("document", item, sourcePath)) return;
		showMessage("CWSP-document did not open the file");
	};
	const onFileOpen = async (e) => {
		const detail = e.detail || {};
		const { item, path } = detail;
		if (item?.kind !== "file") return;
		const sourcePath = path || getItemPath(item);
		const settings = await loadSettings().catch(() => null);
		rememberOpenPolicyFromSettings(settings);
		const kind = item.file ? classifyOpenKind(item.file) : classifyOpenKindFromName(item.name || sourcePath, String(item.file?.type || ""));
		const how = detail.how === "dblclick" ? "dblclick" : "open";
		const policy = resolveHostOpenPolicy(settings);
		if (isCwspNativeHost()) {
			await onNativeFileOpen(item, sourcePath, resolveExplorerOpenSink(policy, kind, true, how));
			return;
		}
		await ensureItemFile(item, sourcePath);
		const canOpenBySrc = canOpenExplorerSrc(sourcePath);
		if (!item.file && !canOpenBySrc) {
			showMessage("Could not read this file");
			return;
		}
		const sink = resolveExplorerOpenSink(policy, kind, false, how);
		const placement = resolveOpenPlacement(policy, "explorer");
		if ((sink === "system" || sink === "external") && item.file) {
			if (await openFileWithSystem(item.file, sourcePath, true)) return;
		}
		if (sink === "document" || sink === "transfer") {
			if (sink === "document" && !shouldHandoffViewToSibling("viewer")) {
				if (await openFileInViewer(item, sourcePath, "window", placement)) return;
			}
			if (await handoffFileToSku(sink, item, sourcePath)) return;
			showMessage(sink === "document" ? "CWSP-document did not open the file" : "Transfer is unavailable");
			return;
		}
		if (sink === "workcenter") {
			if (item.file) await attachToWorkCenter(item, "active");
			else showMessage("Could not read this file");
			return;
		}
		if (sink === "explorer") {
			showMessage(item.name || "File");
			return;
		}
		if (sink === "viewer" || sink === "display" || sink === "ask" && (item.file && (isTextLikeFile(item.file) || looksLikePreviewableBinary(item.file)) || canOpenBySrc)) {
			const opened = await openFileInViewer(item, sourcePath, "window", placement);
			if (!opened && item.file) await attachToWorkCenter(item, "active");
			else if (!opened) showMessage("Could not open this file");
			return;
		}
		if (item.file) await attachToWorkCenter(item, "active");
		else showMessage("Could not open this file");
	};
	explorer.addEventListener("open-item", onFileOpen, listenerOpts);
	explorer.addEventListener("open", onFileOpen, listenerOpts);
	explorer.addEventListener("rs-open", onFileOpen, listenerOpts);
	const savePath = () => {
		writePersistedExplorerPath(explorer.path || "/user/");
	};
	explorer.addEventListener("entries-updated", savePath, listenerOpts);
	explorer.addEventListener("rs-navigate", savePath, listenerOpts);
	explorer.addEventListener("context-action", async (event) => {
		const detail = event.detail || {};
		const action = String(detail.action || "");
		const item = detail.item;
		if (!action) return;
		if (detail.handled) {
			const msg = String(detail.message || "").trim();
			if (msg) showMessage(msg);
			return;
		}
		const handler = mergedHandlers[action];
		if (!handler) return;
		await handler(item);
	}, listenerOpts);
	explorer.addEventListener("contextmenu", (event) => {
		if ((event.composedPath?.() || []).some((node) => {
			const el = node;
			if (!el || typeof el.classList?.contains !== "function") return false;
			return el.classList.contains("row") || el.classList.contains("action-btn") || el.classList.contains("ctx-menu");
		})) return;
		event.preventDefault();
		const path = explorer?.path || "/";
		const extra = inject?.extraBackgroundMenuItems?.({ path }) ?? [];
		const runBookmarkMenu = explorer.operative?.runMenuAction;
		const bookmarkCreateItems = isBookmarksPath(path) && typeof runBookmarkMenu === "function" ? [{
			id: "new-bookmark",
			label: "New bookmark…",
			icon: "bookmark-simple",
			action: () => {
				runBookmarkMenu(null, "new-bookmark");
			}
		}, {
			id: "new-folder",
			label: "New folder…",
			icon: "folder-plus",
			action: () => {
				runBookmarkMenu(null, "new-folder");
			}
		}] : [];
		openExplorerContextMenu(event.clientX, event.clientY, [
			...bookmarkCreateItems,
			{
				id: "refresh",
				label: "Refresh",
				icon: "arrows-clockwise",
				action: () => {
					explorer.navigate(path);
				}
			},
			{
				id: "open-new-explorer",
				label: "New Explorer window",
				icon: "books",
				action: () => requestOpenView({
					viewId: "explorer",
					target: "window",
					params: {
						path,
						processId: buildExplorerProcessId(path)
					}
				})
			},
			{
				id: "open-home",
				label: "Go to Home",
				icon: "house",
				action: () => opts.shellContext?.navigate?.("home")
			},
			...extra
		], {
			anchor: event.target instanceof Element ? event.target : explorer,
			resolveOverlayMountPoint: opts.shellContext?.resolveOverlayMountPoint
		});
	}, listenerOpts);
}
function setupFallbackExplorerEvents(shellRoot, opts, signal) {
	const listenerOpts = { signal };
	const showMessage = (msg) => opts.shellContext?.showMessage?.(msg);
	const filesList = shellRoot.querySelector("[data-fallback-files]");
	const pickBtn = shellRoot.querySelector("[data-action=\"pick-files\"]");
	const workBtn = shellRoot.querySelector("[data-action=\"open-workcenter\"]");
	if (!pickBtn || !filesList) return;
	const input = document.createElement("input");
	input.type = "file";
	input.multiple = true;
	input.accept = ".md,.markdown,.txt,.json,.xml,.yaml,.yml,.csv,.log,text/*";
	input.style.display = "none";
	shellRoot.append(input);
	pickBtn.addEventListener("click", () => input.click(), listenerOpts);
	workBtn?.addEventListener("click", () => requestOpenView({
		viewId: "workcenter",
		target: "window"
	}), listenerOpts);
	input.addEventListener("change", async () => {
		const files = Array.from(input.files || []);
		filesList.replaceChildren();
		if (files.length === 0) return;
		for (const file of files) {
			const li = document.createElement("li");
			li.textContent = file.name;
			filesList.append(li);
		}
		const firstTextLike = files.find((file) => isTextLikeFile(file));
		if (firstTextLike && isCwspNativeHost()) {
			await handoffFileToSku("document", {
				kind: "file",
				name: firstTextLike.name,
				file: firstTextLike
			}, firstTextLike.name);
			return;
		}
		if (firstTextLike) {
			requestOpenView({
				viewId: "viewer",
				target: "window"
			});
			if (!await sendViewProtocolMessage({
				type: "content-view",
				source: "explorer-fallback",
				destination: "viewer",
				contentType: firstTextLike.type || "text/plain",
				attachments: [{
					data: firstTextLike,
					source: "explorer-fallback"
				}],
				data: {
					filename: firstTextLike.name,
					source: "explorer-fallback"
				}
			})) showMessage("Viewer is not ready yet");
		}
	}, listenerOpts);
}
/**
* Attach explorer behaviors to `shellRoot` (`.view-explorer`). Returns cleanup and the file manager host if present.
*/
function wireExplorerSubtree(shellRoot, wireOpts) {
	const injectMerged = mergeExplorerInject(getRegisteredExplorerInject(), wireOpts.inject);
	const ac = new AbortController();
	const { signal } = ac;
	const fm = shellRoot.querySelector("ui-file-manager");
	injectMerged?.onWire?.(fm, shellRoot);
	if (fm) {
		loadLastPath(fm, wireOpts.initialPath ?? null);
		setupExplorerEvents(fm, wireOpts, injectMerged, signal);
		const rebakeRows = () => scheduleBakeScreenColors(shellRoot);
		fm.addEventListener("entries-updated", rebakeRows, { signal });
		fm.addEventListener("rs-navigate", rebakeRows, { signal });
		import("./app10.js").then((n) => n.n).then((m) => m.installExplorerBackStack()).catch(() => {});
		return {
			cleanup: () => {
				writePersistedExplorerPath(fm.path || "/user/");
				ac.abort();
			},
			fileManager: fm
		};
	}
	setupFallbackExplorerEvents(shellRoot, wireOpts, signal);
	return {
		cleanup: () => ac.abort(),
		fileManager: null
	};
}
//#endregion
//#region ../CWSP-explorer/src/theme.ts
/**
* Explorer appearance: resolves light / dark / system and applies stable data attributes +
* `color-scheme` so UA form controls / scrollbars track the shell.
*
* NOTE: `system` follows CWSP-shell’s `document.documentElement[data-theme]` first (from Theme.syncBrowserChromeTheme),
* then `(prefers-color-scheme)`, so explorer matches the app shell after async theme loads.
*/
/** Read app-level resolved theme when available (PWA / shell); else null. */
function readAppDataTheme() {
	if (typeof document === "undefined") return null;
	const raw = document.documentElement?.getAttribute("data-theme");
	if (raw === "light" || raw === "dark") return raw;
	return null;
}
/** Effective scheme after resolving `system` — prefers `html[data-theme]`, then prefers-color-scheme. */
function resolveExplorerColorSchemePreference(mode) {
	if (mode === "light" || mode === "dark") return mode;
	const fromDoc = readAppDataTheme();
	if (fromDoc) return fromDoc;
	if (typeof globalThis.matchMedia === "function" && globalThis.matchMedia("(prefers-color-scheme: light)").matches) return "light";
	return "dark";
}
/** Push resolved scheme onto the explorer shell. Do not rewrite `--color-*` (veela + `light-dark()`). */
function applyExplorerColorScheme(shellRoot, mode) {
	if (!shellRoot) return;
	const resolved = resolveExplorerColorSchemePreference(mode ?? void 0);
	shellRoot.dataset.explorerColorScheme = resolved;
	if (shellRoot.getAttribute("data-theme") !== resolved) shellRoot.setAttribute("data-theme", resolved);
	shellRoot.style.setProperty("color-scheme", `${resolved} only`);
	bindExplorerForegroundResync();
	scheduleBakeScreenColors(shellRoot);
}
var explorerForegroundBound = false;
/** WHY: pinned light/dark does not subscribe to `data-theme`; WebView still drops `color-scheme` on resume. */
function bindExplorerForegroundResync() {
	if (explorerForegroundBound || typeof document === "undefined") return;
	explorerForegroundBound = true;
	const restamp = () => {
		if (document.visibilityState === "hidden") return;
		document.querySelectorAll(".view-explorer").forEach((el) => {
			const scheme = el.dataset.explorerColorScheme;
			if (scheme === "light" || scheme === "dark") applyExplorerColorScheme(el, scheme);
		});
	};
	document.addEventListener("visibilitychange", restamp);
	globalThis.addEventListener?.("pageshow", restamp);
}
/**
* When `colorScheme === "system"`, re-apply explorer tokens whenever app `data-theme` or OS scheme changes.
* Call `disconnect()` on unmount; no-op if `mode` is fixed `light` | `dark`.
*/
function subscribeExplorerSystemTheme(shellRoot, getMode) {
	const noop = () => ({ disconnect: () => {} });
	if (!shellRoot || typeof document === "undefined") return noop();
	const apply = () => {
		if (!shellRoot.isConnected) return;
		if ((getMode() ?? "system") !== "system") return;
		applyExplorerColorScheme(shellRoot, "system");
	};
	if ((getMode() ?? "system") !== "system") return noop();
	const root = document.documentElement;
	const mq = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia("(prefers-color-scheme: dark)") : null;
	const obs = new MutationObserver(apply);
	try {
		obs.observe(root, {
			attributes: true,
			attributeFilter: ["data-theme"]
		});
	} catch {
		obs.disconnect();
		return noop();
	}
	mq?.addEventListener("change", apply);
	apply();
	return { disconnect: () => {
		obs.disconnect();
		mq?.removeEventListener("change", apply);
	} };
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/FileManagerContent.ts
initGlobalClipboard();
try {
	preloadStyle$1(file_manager_content_default);
} catch {}
var FileManagerContent = class FileManagerContent extends UIElement {
	gridRowsEl;
	gridEl;
	operativeInstance = null;
	operativeInstanceRef = ref(null);
	#rowsContainer = null;
	#dropHandlersBound = false;
	get entries() {
		return this.operativeInstance?.entries ?? [];
	}
	get path() {
		return this.operativeInstance?.path || "/";
	}
	set path(value) {
		if (this.operativeInstance) this.operativeInstance.path = value || "/";
	}
	get pathRef() {
		return this.operativeInstance?.pathRef;
	}
	refreshList() {
		this.findRowsContainer()?.replaceChildren();
		const operative = this.operativeInstance;
		if (!operative) {
			this.syncRows();
			return Promise.resolve();
		}
		return Promise.resolve(operative.refreshList(this.path || "/")).then(() => this.syncRows()).catch((error) => {
			console.warn(error);
		});
	}
	onInitialize() {
		const result = super.onInitialize();
		this.bindResumePaint();
		return result ?? this;
	}
	/** WHY: Android recents pauses the compositor; names vanish until a style recalc. */
	bindResumePaint() {
		const onShow = () => {
			if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
			const rows = this.findRowsContainer();
			if (rows) this.kickRowPaint(rows);
		};
		addEvent(document, "visibilitychange", onShow);
		addEvent(document, "cwsp:theme-resume", onShow);
		addEvent(globalThis, "pageshow", onShow);
	}
	eventBelongsToExplorer(ev) {
		if (!ev) return false;
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		if (path.includes(this)) return true;
		if (this.shadowRoot && path.includes(this.shadowRoot)) return true;
		const target = ev.target;
		if (target === this || target && this.contains(target)) return true;
		if (target && this.shadowRoot?.contains(target)) return true;
		let active = document.activeElement;
		while (active) {
			if (active === this || this.contains(active)) return true;
			const host = active.getRootNode?.({ composed: true })?.host;
			if (!host || host === active) break;
			active = host;
		}
		return false;
	}
	bindDropHandlers() {
		if (this.#dropHandlersBound) return;
		const shadow = this.shadowRoot;
		if (!shadow) return;
		this.#dropHandlersBound = true;
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
		addEvent(this, "pointerdown", (ev) => {
			if ((typeof ev.composedPath === "function" ? ev.composedPath() : []).some((node) => node instanceof HTMLButtonElement)) return;
			this.focus({ preventScroll: true });
		});
		const acceptDrag = (ev) => {
			if (!this.eventBelongsToExplorer(ev)) return;
			ev.preventDefault();
			if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy";
		};
		const onDrop = (ev) => {
			if (!this.eventBelongsToExplorer(ev)) return;
			ev.preventDefault();
			ev.stopPropagation();
			this.operativeInstance?.onDrop?.(ev);
		};
		const dragOpts = {
			capture: true,
			passive: false
		};
		for (const target of [shadow, this]) {
			addEvent(target, "dragenter", acceptDrag, dragOpts);
			addEvent(target, "dragover", acceptDrag, dragOpts);
			addEvent(target, "drop", onDrop, dragOpts);
		}
		addEvent(this, "paste", (ev) => this.onPaste(ev));
		addEvent(shadow, "paste", (ev) => this.onPaste(ev));
	}
	onPaste(ev) {
		if (this.eventBelongsToExplorer(ev) && this.operativeInstance) this.operativeInstance.onPaste(ev);
	}
	onCopy(ev) {
		if (this.eventBelongsToExplorer(ev) && this.operativeInstance) this.operativeInstance.onCopy(ev);
	}
	byFirstTwoLetterOrName(name) {
		return ((name?.substring?.(0, 2)?.toUpperCase?.())?.charCodeAt?.(0) || 65) - 65;
	}
	constructor() {
		super();
		this.operativeInstance ??= new FileOperative();
		this.operativeInstance.host = this;
		this.addEventListener("entries-updated", () => this.syncRows());
		addEvent(window, EXPLORER_SORT_EVENT, () => this.syncRows());
		this.addEventListener("bookmarks-reject", (ev) => {
			const detail = ev?.detail || {};
			const reason = String(detail?.reason || "bookmarks reject");
			const path = String(detail?.path || "");
			const count = Number(detail?.count || 0);
			console.warn(`[bookmarks-reject] ${reason}${path ? ` (path=${path})` : ""}${count ? ` count=${count}` : ""}`);
			this.showBookmarksRejectToast(reason, path, count);
		});
		this.refreshList();
	}
	/**
	* Minimal user-facing notice for bookmarks ingress rejections. Avoids a
	* toast framework dependency; uses a fixed-position element that
	* auto-dismisses after a short timeout. No-op when `document` is absent.
	*/
	showBookmarksRejectToast(reason, path, count) {
		if (typeof document === "undefined" || !document.body) return;
		try {
			const toast = document.createElement("div");
			toast.setAttribute("part", "bookmarks-reject-toast");
			toast.textContent = `Bookmarks: ${reason}${count ? ` (${count} item${count === 1 ? "" : "s"})` : ""}`;
			toast.style.cssText = [
				"position:fixed",
				"right:16px",
				"bottom:16px",
				"max-width:360px",
				"padding:10px 12px",
				"border-radius:10px",
				"background:rgba(20,20,22,0.92)",
				"color:#f5f5f5",
				"border:1px solid rgba(255,255,255,0.16)",
				"font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
				"z-index:9999",
				"pointer-events:auto",
				"box-shadow:0 6px 24px rgba(0,0,0,0.35)"
			].join(";");
			(document.body || document.documentElement).appendChild(toast);
			setTimeout(() => {
				try {
					toast.remove();
				} catch {}
			}, 3500);
		} catch {}
	}
	findRowsContainer() {
		if (this.#rowsContainer?.isConnected) return this.#rowsContainer;
		const latest = Array.from(this.shadowRoot?.querySelectorAll?.(".fm-grid") || []).at(-1)?.querySelector(".fm-grid-rows") ?? null;
		this.#rowsContainer = latest;
		return latest;
	}
	syncRows() {
		const rows = this.findRowsContainer();
		const operative = this.operativeInstance;
		if (!rows || !operative) return;
		const rawEntries = operative.entries;
		const currentEntries = Array.isArray(rawEntries) ? rawEntries : Array.isArray(rawEntries?.value) ? rawEntries.value : [];
		const uniqueEntries = /* @__PURE__ */ new Map();
		for (const item of Array.isArray(currentEntries) ? currentEntries : []) {
			if (!item || typeof item !== "object" || item.name == null) continue;
			const key = entryKey(item);
			if (!uniqueEntries.has(key)) uniqueEntries.set(key, item);
		}
		const safeEntries = sortExplorerEntries(Array.from(uniqueEntries.values()), peekExplorerSort());
		rows.replaceChildren();
		const fragment = document.createDocumentFragment();
		safeEntries.forEach((item, index) => {
			fragment.append(this.makeListElement(item, operative, index + 1));
		});
		rows.append(fragment);
		this.kickRowPaint(rows);
	}
	/** WHY: WebView skips row glyphs after replaceChildren or shell re-slot. */
	kickRowPaint(rows) {
		rows.style.translate = "0";
		rows.offsetHeight;
		requestAnimationFrame(() => {
			rows.style.removeProperty("translate");
		});
	}
	makeListElement(item, operative, order) {
		const op = operative;
		const kind = entryKind(item);
		const isFile = kind === "file";
		const faviconUrl = resolveEntryIcon(item);
		const fallbackIcon = iconFor(item);
		const iconHostStyle = "--ui-icon-size:var(--ui-explorer-icon-size,1.5rem);--ui-icon-padding:0px;inline-size:var(--ui-explorer-icon-size,1.5rem);block-size:var(--ui-explorer-icon-size,1.5rem);min-inline-size:var(--ui-explorer-icon-size,1.5rem);min-block-size:var(--ui-explorer-icon-size,1.5rem);max-inline-size:var(--ui-explorer-icon-size,1.5rem);max-block-size:var(--ui-explorer-icon-size,1.5rem);flex-shrink:0";
		const iconSlot = faviconUrl ? H`<img src=${faviconUrl} alt=${fallbackIcon} referrerpolicy="no-referrer" loading="lazy"
                style=${iconHostStyle}
                onerror=${(ev) => {
			const img = ev.currentTarget;
			if (!img || img.dataset.fallbackApplied === "1") return;
			img.dataset.fallbackApplied = "1";
			const parent = img.parentElement;
			if (!parent) return;
			img.remove();
			parent.append(H`<ui-icon icon=${fallbackIcon} size="1.5rem" style=${iconHostStyle}></ui-icon>`);
		}} />` : H`<ui-icon icon=${fallbackIcon} size="1.5rem" style=${iconHostStyle} />`;
		const itemEl = H`<div draggable="${isFile}" class="row c2-surface"
            on:click=${(ev) => requestAnimationFrame(() => op.onRowClick?.(item, ev))}
            on:dblclick=${(ev) => requestAnimationFrame(() => op.onRowDblClick?.(item, ev))}
            on:dragstart=${(ev) => op.onRowDragStart?.(item, ev)}
            data-id=${item?.name || ""}
            data-kind=${kind}
            data-entry-key=${entryKey(item)}
        >
            <div style="pointer-events:none;background-color:transparent;inline-size:1.5rem;block-size:1.5rem;min-inline-size:1.5rem;min-block-size:1.5rem;max-inline-size:1.5rem;max-block-size:1.5rem;flex-shrink:0;overflow:visible" class="c icon">${iconSlot}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c name" title=${item?.name || ""}><span class="t">${item?.name || ""}</span></div>
            <div style="pointer-events: none; background-color: transparent;" class="c size"><span class="t">${isFile ? formatSize(item?.size) : ""}</span></div>
            <div style="pointer-events: none; background-color: transparent;" class="c date"><span class="t">${isFile ? formatDate(item?.lastModified ?? 0) : ""}</span></div>
            <div style="pointer-events: none; background-color: transparent;" class="c actions">
                <button class="action-btn" title="Copy Path" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copyPath", ev));
		}}>
                    <ui-icon icon="copy" />
                </button>
                <button class="action-btn" title="Copy" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copy", ev));
		}}>
                    <ui-icon icon="clipboard" />
                </button>
                <button class="action-btn" title="Delete" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "delete", ev));
		}}>
                    <ui-icon icon="trash" />
                </button>
            </div>
        </div>`;
		bindWith(itemEl, "--order", order, handleStyleChange);
		return itemEl;
	}
	/** WHY: pass CSS text so Glit can refill / shadow-fallback if the constructable sheet emptied. */
	styles = () => file_manager_content_default;
	render = function() {
		const self = this;
		const fileHeader = H`<div class="fm-grid-header">
            <div class="c icon"><span class="t">@</span></div>
            <div class="c name"><span class="t">Name</span></div>
            <div class="c size"><span class="t">Size</span></div>
            <div class="c date"><span class="t">Modified</span></div>
            <div class="c actions"><span class="t">Actions</span></div>
        </div>`;
		const operative = self.operativeInstance;
		if (!operative) return "";
		const fileRows = H`<div class="fm-grid-rows"></div>`;
		this.#rowsContainer = fileRows;
		createItemCtxMenu?.(fileRows, operative.onMenuAction.bind(operative), self.entries);
		queueMicrotask(() => {
			self.bindDropHandlers();
			const root = self.shadowRoot;
			const grids = Array.from(root?.querySelectorAll?.(".fm-grid") || []);
			if (grids.length > 1) {
				const latest = grids.at(-1);
				for (const extra of grids) if (extra !== latest) extra.remove();
				self.#rowsContainer = latest.querySelector(".fm-grid-rows");
			}
			self.syncRows();
		});
		return H`<div class="fm-grid" part="grid">
            ${fileHeader}
            ${fileRows}
        </div>`;
	};
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManagerContent.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManagerContent.prototype, "gridEl", void 0);
FileManagerContent = __decorate([defineElement("ui-file-manager-content")], FileManagerContent);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/FileManager.ts
try {
	preloadStyle$1(file_manager_default);
} catch {}
var FileManager = class FileManager extends UIElement {
	gridRowsEl;
	gridEl;
	sidebar = "auto";
	inlineSize;
	/** WHY: pass CSS text so Glit can refill / shadow-fallback if the constructable sheet emptied. */
	styles = () => file_manager_default;
	#pathWatcherDisposer = null;
	/** WHY: `wireExplorerSubtree` sets `path` before `onInitialize` creates the operative. */
	#pendingPath = null;
	constructor() {
		super();
	}
	get content() {
		return this?.querySelector?.("ui-file-manager-content");
	}
	get operative() {
		return this.content?.operativeInstance;
	}
	get pathRef() {
		return this.operative?.pathRef;
	}
	get path() {
		return this.content?.path || this.operative?.path || this.#pendingPath || "/";
	}
	set path(value) {
		const next = toExplorerStoragePath(value) || value || "/";
		if (this.content) this.content.path = next;
		if (this.operative) this.operative.path = next;
		else this.#pendingPath = next;
	}
	get input() {
		return this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
	}
	get inputValue() {
		return this.input?.value || "/";
	}
	set inputValue(value) {
		if (this.input) this.input.value = value || "/";
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		const existingContents = Array.from(self.querySelectorAll("ui-file-manager-content"));
		const primaryContent = existingContents[0] ?? document.createElement("ui-file-manager-content");
		if (!existingContents.length) self.append(primaryContent);
		if (existingContents.length > 1) for (const extra of existingContents.slice(1)) extra?.remove?.();
		if (this.#pendingPath) {
			const staged = this.#pendingPath;
			this.#pendingPath = null;
			this.path = staged;
		}
		queueMicrotask(() => {
			this.#pathWatcherDisposer?.();
			this.#pathWatcherDisposer = null;
			if (!this.pathRef) return;
			this.#pathWatcherDisposer = affected(this.pathRef, (path) => {
				const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
				if (input && input instanceof HTMLInputElement && input.value != path) input.value = path || "/";
			});
		});
		return self;
	}
	onRender() {
		super.onRender();
		const weak = new WeakRef(this);
		const onEnter = (ev) => {
			if (ev.key === "Enter") {
				const self = weak.deref();
				const val = (self?.querySelector?.("input[name=\"address\"]"))?.value?.trim?.() || "";
				if (val) self?.navigate(val);
			}
		};
		addEvent(this, "keydown", onEnter);
		addEvent(window, "cwsp:explorer-mount-change", () => {
			this.operative?.refreshList?.(this.path || "/");
		});
	}
	get showSidebar() {
		const force = String(this.sidebar ?? "auto").toLowerCase();
		if (force === "true" || force === "1") return true;
		if (force === "false" || force === "0") return false;
		return (propRef(this, "inlineSize")?.value ?? this.inlineSize ?? 0) >= 720;
	}
	async navigate(toPath) {
		const mapped = toExplorerStoragePath(toPath) || toPath;
		const clean = getDir(mapped);
		this.path = clean || this.path || "/";
		const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
		if (input && input instanceof HTMLInputElement && input.value != this.path) input.value = this.path || "/";
	}
	async goUp() {
		const parts = (this.path || this.content?.path || "/").replace(/\/+$/g, "").split("/").filter(Boolean);
		if (parts.length <= 1) {
			this.navigate(this.path = "/");
			return;
		}
		const up = "/" + parts.slice(0, -1).join("/") + "/";
		const clean = getDir(up);
		this.navigate(this.path = clean || "/");
	}
	requestUpload() {
		this.operative?.requestUpload?.();
	}
	requestPaste() {
		this.operative?.requestPaste?.();
	}
	requestUse() {
		this.operative?.requestUse?.();
	}
	toggleSettings() {
		const root = this.shadowRoot?.querySelector(".fm-root");
		if (Boolean(root?.querySelector("ui-explorer-settings"))) {
			closeExplorerSettings();
			root?.querySelector("ui-explorer-settings")?.remove();
			this.operative?.refreshList?.(this.path || "/");
			return;
		}
		openExplorerSettings(root);
	}
	render = function() {
		const self = this;
		const sidebarVisible = self.showSidebar;
		const content = H`<div part="content" class="fm-content"><slot></slot></div>`;
		const toolbar = H`<div part="toolbar" class="fm-toolbar">
            <div class="fm-toolbar-left">
                <button class="btn" title="Up" on:click=${() => requestAnimationFrame(() => self.goUp())}><ui-icon icon="arrow-up" size="1.5rem" style="--ui-icon-padding:0px"/></button>
                <button class="btn" title="Refresh" on:click=${() => requestAnimationFrame(() => self.navigate(self.inputValue || self.path || "/"))}><ui-icon icon="arrow-clockwise" size="1.5rem" style="--ui-icon-padding:0px"/></button>
            </div>
            <div class="fm-toolbar-center"><form style="display: contents;" onsubmit="return false;">
                <input class="address c2-surface" autocomplete="off" type="text" name="address" inputmode="url" value=${self.path || "/"} />
            </form></div>
            <div class="fm-toolbar-right">
                <button class="btn" title="Add" on:click=${() => requestAnimationFrame(() => self.requestUpload?.())}><ui-icon icon="upload" size="1.5rem" style="--ui-icon-padding:0px"/></button>
                <button class="btn" title="Paste" on:click=${() => requestAnimationFrame(() => self.requestPaste?.())}><ui-icon icon="clipboard" size="1.5rem" style="--ui-icon-padding:0px"/></button>
                <button class="btn" title="Use" on:click=${() => requestAnimationFrame(() => self.requestUse?.())}><ui-icon icon="hand-withdraw" size="1.5rem" style="--ui-icon-padding:0px"/></button>
                <button class="btn" title="Explorer settings" on:click=${() => requestAnimationFrame(() => self.toggleSettings?.())}><ui-icon icon="gear" size="1.5rem" style="--ui-icon-padding:0px"/></button>
            </div>
        </div>`;
		return H`<div part="root" class="fm-root" data-with-sidebar=${sidebarVisible}>${toolbar}${content}</div>`;
	};
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManager.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManager.prototype, "gridEl", void 0);
__decorate([property({
	source: "attr",
	name: "sidebar"
})], FileManager.prototype, "sidebar", void 0);
__decorate([property({ source: "inline-size" })], FileManager.prototype, "inlineSize", void 0);
FileManager = __decorate([defineElement("ui-file-manager")], FileManager);
//#endregion
//#region ../CWSP-explorer/src/index.scss?inline
var src_default = "@layer components{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:#f7f8fc;background-color:light-dark(#f7f8fc,#1a1d24);background-color:var(--color-surface);block-size:100%;border-radius:0;color:#1a1c1f;color:light-dark(#1a1c1f,#e8eaed);color:var(--color-on-surface);color-scheme:inherit;container-name:ui-file-manager;container-type:inline-size;content-visibility:visible;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;--ui-icon-size:var(--ui-explorer-icon-size, 1.5rem);--ui-icon-padding:0px;--icon-color:light-dark(#1a1c1f, #e8eaed);--icon-color:var(--color-on-surface)}:host(ui-file-manager) .fm-root{block-size:100%;display:grid;flex:1 1 auto;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;position:relative}:host(ui-file-manager) .fm-toolbar{background:#f7f8fc;background:light-dark(#f7f8fc,#1a1d24);background:var(--color-surface);border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar :is(button,input){background-color:initial;color:#1a1c1f;color:light-dark(#1a1c1f,#e8eaed);color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 ui-monospace,Cascadia Code,SF Mono,Consolas,monospace;inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#5a7fff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{--ui-icon-size:var(--ui-explorer-icon-size, 1.5rem);--ui-icon-padding:0px;block-size:var(--ui-icon-size)!important;flex-shrink:0;inline-size:var(--ui-icon-size)!important;max-block-size:var(--ui-icon-size)!important;max-inline-size:var(--ui-icon-size)!important;min-block-size:var(--ui-icon-size)!important;min-inline-size:var(--ui-icon-size)!important}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#5a7fff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar :is(.fm-toolbar-left,.fm-toolbar-right){background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-root--settings .fm-content{pointer-events:none;visibility:hidden}:host(ui-file-manager) .fm-content{block-size:100%;border-radius:0;display:flex;flex:1 1 auto;flex-direction:column;grid-column:content-col;grid-row:2;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}:host(ui-file-manager) .fm-toolbar{gap:.35rem;padding-inline:.4rem}:host(ui-file-manager) .fm-toolbar .btn{block-size:2rem;inline-size:2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{min-inline-size:0}}}@layer components{:host(ui-file-manager-content){background-color:#f7f8fc;background-color:light-dark(#f7f8fc,#1a1d24);background-color:var(--color-surface);block-size:100%;border:0 transparent;border-radius:0;color:#1a1c1f;color:light-dark(#1a1c1f,#e8eaed);color:var(--color-on-surface);color-scheme:inherit;contain:none;container-type:size;display:flex;flex:1 1 auto;flex-direction:column;grid-column:1/-1;inline-size:100%;margin:0;min-block-size:0;min-inline-size:0;outline:0 none transparent;overflow:hidden;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;border:0 transparent;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0;outline:0 none transparent;overflow:hidden;pointer-events:none;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:100%;contain:none;contain-intrinsic-size:1px var(--ui-explorer-row-height,var(--touch-min,3rem));content-visibility:visible;display:flex;flex:1 1 auto;flex-direction:column;gap:var(--gap-sm,.5rem);inline-size:100%;min-block-size:0;min-inline-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:auto;border:none;border-radius:var(--radius-lg,.75rem);box-sizing:border-box;color:var(--color-on-surface);cursor:pointer;display:grid;grid-template-columns:[icon] 2rem [name] minmax(5rem,1fr) [size] 4.25rem [date] minmax(0,7.5rem) [actions] 6.4rem;grid-template-rows:minmax(var(--ui-explorer-row-height,var(--touch-min,3rem)),auto);inline-size:100%;min-block-size:var(--ui-explorer-row-height,var(--touch-min,3rem));min-inline-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:.35rem .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{--ui-icon-size:var(--ui-explorer-icon-size, 1.5rem);--ui-icon-padding:0px;block-size:var(--ui-icon-size);flex-shrink:0;inline-size:var(--ui-icon-size);min-block-size:var(--ui-icon-size);min-inline-size:var(--ui-icon-size);place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) :is(a,span){background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#5a7fff);outline-offset:-2px}:host(ui-file-manager-content) .c:not(.icon){block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) :is(.c.date,.c.name,.c.size){color:#1a1c1f;color:light-dark(#1a1c1f,#e8eaed);color:var(--color-on-surface);display:block;-webkit-text-fill-color:initial}:host(ui-file-manager-content) .c .t{color:inherit;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;-webkit-text-fill-color:initial}:host(ui-file-manager-content) .icon{aspect-ratio:1;block-size:1.5rem;display:flex;flex-shrink:0;grid-column:icon;inline-size:1.5rem;min-block-size:1.5rem;min-inline-size:1.5rem;overflow:visible;place-content:center;place-items:center}:host(ui-file-manager-content) .icon :is(img,ui-icon){--ui-icon-size:var(--ui-explorer-icon-size, 1.5rem);--ui-icon-padding:0px;block-size:var(--ui-icon-size)!important;flex-shrink:0;inline-size:var(--ui-icon-size)!important;max-block-size:var(--ui-icon-size)!important;max-inline-size:var(--ui-icon-size)!important;min-block-size:var(--ui-icon-size)!important;min-inline-size:var(--ui-icon-size)!important;object-fit:contain}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] 2rem [name] minmax(5rem,1fr) [size] 4.25rem [date] minmax(0,7.5rem) [actions] 6.4rem}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] 2rem [name] minmax(4.5rem,1fr) [size] 3.75rem [date] 0 [actions] 6.4rem}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:6.4rem;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;max-inline-size:6.4rem;overflow:hidden;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#5a7fff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{--ui-icon-size:var(--ui-explorer-action-icon-size, 1.15rem);--ui-icon-padding:0px;block-size:var(--ui-icon-size)!important;inline-size:var(--ui-icon-size)!important;max-block-size:var(--ui-icon-size)!important;max-inline-size:var(--ui-icon-size)!important;min-block-size:var(--ui-icon-size)!important;min-inline-size:var(--ui-icon-size)!important}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);box-sizing:border-box;color:#5c5f66;color:light-dark(#5c5f66,#c4c7ce);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;grid-template-columns:[icon] 2rem [name] minmax(5rem,1fr) [size] 4.25rem [date] minmax(0,7.5rem) [actions] 6.4rem;inline-size:100%;inset-block-start:0;letter-spacing:.04em;min-inline-size:0;padding:.4rem .65rem;position:sticky!important;text-transform:uppercase;z-index:8;-webkit-text-fill-color:initial;gap:.35rem;min-block-size:2rem;opacity:1;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;text-align:start;touch-action:manipulation}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}@layer ux-normalize,\n    tokens,\n    ux-tokens,\n    base,\n    ux-base,\n    layout,\n    ux-layout,\n    shells,\n    shell,\n    views,\n    view,\n    viewer,\n    components,\n    ux-components,\n    ux-layer,\n    ui-icon,\n    ui-icon-reset,\n    ux-file-manager,\n    ux-file-manager-content,\n    utilities,\n    ux-utilities,\n    theme,\n    ux-theme,\n    markdown,\n    essentials,\n    print,\n    print-breaks,\n    view-transitions,\n    overrides,\n    ux-overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}@supports (color:contrast-color(red)){.btn,button{color:contrast-color(var(--color-bg-alt))}}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border);color:contrast-color(var(--color-border))}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}@supports (color:contrast-color(red)){.btn{color:contrast-color(var(--ui-bg))}}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);color:contrast-color(var(--ui-bg-hover));transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0);color:contrast-color(var(--color-surface-container-high))}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab, var(--color-primary) 90%, black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}@supports (color:contrast-color(red)){.btn-primary{color:contrast-color(var(--color-primary))}}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover);color:contrast-color(var(--color-primary-hover))}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item:not([data-layer=labels]) span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{.ctx-menu,.ui-grid-item,ui-modal,ui-window-frame{--font-family:\"InterVariable\", \"Inter\", \"Helvetica Neue\", \"Helvetica\", \"Calibri\", \"Roboto\", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\", \"Inter\", \"Helvetica Neue\", \"Helvetica\", \"Calibri\", \"Roboto\", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;color-scheme:light dark}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;backdrop-filter:blur(10px);background-color:var(--color-surface,light-dark(#f6f8fc,#1b2029));block-size:fit-content;border:1px solid var(--color-outline-variant,light-dark(#c9ced8,#474e5e));border-radius:var(--radius-md,10px);box-shadow:0 10px 28px light-dark(rgba(15,23,42,.14),rgba(0,0,0,.42)),0 0 0 1px light-dark(rgba(15,23,42,.08),rgba(255,255,255,.07));color:var(--color-on-surface,light-dark(#12151c,#eceff7));display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.ctx-menu{color:contrast-color(var(--color-surface,light-dark(#f6f8fc,#1b2029)))}}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm,8px);color:var(--color-on-surface,light-dark(#12151c,#eceff7));cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.ctx-menu>*{color:contrast-color(var(--color-surface,light-dark(#f6f8fc,#1b2029)))}}.ctx-menu>:hover{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140));color:var(--color-on-surface,light-dark(#12151c,#eceff7))}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.ctx-menu>:hover{color:contrast-color(var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140)))}}.ctx-menu>:active{background-color:var(--color-surface-container-highest,light-dark(#dde3ee,#343b4d));color:var(--color-on-surface,light-dark(#12151c,#eceff7))}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.ctx-menu>:active{color:contrast-color(var(--color-surface-container-highest,light-dark(#dde3ee,#343b4d)))}}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140));color:contrast-color(var(--color-surface-container-high,light-dark(#e8ecf4,#2a3140)));outline:2px solid var(--color-primary,light-dark(#1d6fd1,#7eb8ff));outline-offset:1px}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*,.ctx-menu>*>span{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);flex-shrink:0;inline-size:var(--icon-size);user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>*>ui-icon,.ctx-menu>.ctx-menu-separator{color:var(--color-on-surface-variant,light-dark(#545c6f,#b4bfd4));pointer-events:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant,light-dark(#c9ced8,#474e5e));block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.55;padding:0}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{color:contrast-color(var(--color-outline-variant,light-dark(#c9ced8,#474e5e)))}}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x, 0px);--shift-y:var(--client-y, 0px);--translate-x:round(nearest, min(0px, calc(100cqi - (100% + var(--shift-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;--translate-y:round(nearest, min(0px, calc(100cqb - (100% + var(--shift-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:spin 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon :is(img,svg){block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}@supports (color:contrast-color(red)){.file-picker .file-picker-actions .btn.btn-primary{color:contrast-color(var(--color-primary))}}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}@supports (color:contrast-color(red)){.file-picker .file-picker-actions .btn:not(.btn-primary){color:contrast-color(var(--color-surface-container))}}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}#app:has(>ui-window.explorer-native-window),#app:has(>ui-window[native-mode]){block-size:100%;display:flex;flex-direction:column;min-block-size:0}ui-window.explorer-native-window,ui-window.explorer-native-window[native-mode]{flex:1 1 auto;min-block-size:0}.explorer-native-window__body{display:flex;flex-direction:column;min-inline-size:0;overflow:hidden}.explorer-native-window__body,.explorer-native-window__body>.view-explorer{block-size:100%;flex:1 1 auto;inline-size:100%;min-block-size:0}@layer tokens{:root:has([data-view=explorer]),html:has([data-view=explorer]){--view-layout:\"flex\";--view-content-max-width:none}.view-explorer{--explorer-menu-radius:0.75rem;--explorer-menu-pad:0.35rem;--ui-explorer-row-height:2.875rem;--explorer-font-sans:var(--font-family, \"InterVariable\", \"Inter\", \"Segoe UI Variable\", ui-sans-serif, system-ui, -apple-system,\n        BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif);--explorer-font-mono:ui-monospace, \"Cascadia Code\", \"Cascadia Mono\", \"SF Mono\", Menlo, Consolas, \"DejaVu Sans Mono\", monospace}.view-explorer[data-explorer-color-scheme=light]{color-scheme:light only}.view-explorer[data-explorer-color-scheme=dark]{color-scheme:dark only}}@layer layout{:host:has(.view-explorer){background:#f7f8fc;background:light-dark(#f7f8fc,#1a1d24);background:var(--color-surface);block-size:100%;color:#1a1c1f;color:light-dark(#1a1c1f,#e8eaed);color:var(--color-on-surface);contain:layout style;display:flex;flex-direction:column;font-family:var(--font-family,var(--explorer-font-sans,system-ui,sans-serif));font-size:.875rem;line-height:1.5;min-block-size:0}cw-view-explorer{box-sizing:border-box}.view-explorer,cw-view-explorer{block-size:100%;display:flex;flex:1 1 0;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0}.view-explorer{background:#f7f8fc;background:light-dark(#f7f8fc,#1a1d24);background:var(--color-surface);border:none;border-radius:0;color:#1a1c1f;color:light-dark(#1a1c1f,#e8eaed);color:var(--color-on-surface);font-family:var(--font-family,var(--explorer-font-sans,system-ui,sans-serif));overflow:hidden}.view-explorer__content{background:transparent;box-sizing:border-box;color:inherit;display:flex;flex:1 1 0;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0}.view-explorer__content>ui-file-manager{block-size:100%;flex:1 1 0;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer components{.view-explorer__error,.view-explorer__loading{align-items:center;block-size:100%;display:flex;flex-direction:column;gap:1rem;justify-content:center}.view-explorer__loading{color:var(--color-on-surface);opacity:.65}.view-explorer__spinner{animation:f .8s linear infinite;block-size:32px;border:3px solid var(--view-border,color-mix(in oklab,var(--color-on-surface,#888) 18%,transparent));border-block-start-color:var(--color-primary,#3794ff);border-radius:50%;inline-size:32px}.view-explorer__error p{color:var(--color-error,#f2b8b5);margin:0}.view-explorer__error button{background:var(--color-primary,#3794ff);border:none;border-radius:.375rem;color:var(--color-on-primary,#fff);cursor:pointer;padding:.5rem 1rem}@supports (color:contrast-color(red)){.view-explorer__error button{color:contrast-color(var(--color-primary,#3794ff))}}.view-explorer__error button:hover{filter:brightness(1.08)}.view-explorer__fallback{block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:.75rem;overflow:auto;padding:1rem 1.125rem}.view-explorer__fallback h3{font-size:1rem;font-weight:600;margin:0}.view-explorer__fallback p{color:var(--view-fg-muted,var(--color-on-surface-variant));font-size:.875rem;line-height:1.45;margin:0}.view-explorer__fallback-actions{display:flex;flex-wrap:wrap;gap:.5rem}.view-explorer__fallback-actions button{background:color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent);border:none;border-radius:999px;color:inherit;cursor:pointer;font-size:.8125rem;font-weight:500;padding:.5rem 1rem}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.view-explorer__fallback-actions button{color:contrast-color(color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent))}}.view-explorer__fallback-actions button:hover{background:color-mix(in oklab,var(--color-on-surface,#fff) 13%,transparent);color:contrast-color(color-mix(in oklab,var(--color-on-surface,#fff) 13%,transparent))}.view-explorer__fallback-actions button:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 60%,transparent);outline-offset:1px}.view-explorer__fallback-files{color:var(--color-on-surface-variant);display:grid;font-size:.8125rem;gap:.35rem;margin:.5rem 0 0;padding-inline-start:1.125rem}}.view-explorer__share-ask{background:var(--color-surface);border:none;border-radius:.75rem;box-shadow:0 .5rem 1.5rem color-mix(in srgb,var(--color-on-surface) 18%,transparent);color:var(--color-on-surface);padding:1rem 1.1rem}.view-explorer__share-ask menu{display:flex;flex-wrap:wrap;gap:.5rem;margin:.85rem 0 0;padding:0}@layer theme{@keyframes f{to{transform:rotate(1turn)}}}";
//#endregion
//#region ../CWSP-explorer/src/index.ts
function coerceColorScheme(raw) {
	if (raw === "light" || raw === "dark" || raw === "system") return raw;
	if (typeof raw === "string") {
		const t = raw.trim().toLowerCase();
		if (t === "light" || t === "dark" || t === "system") return t;
	}
}
function resolveExplorerOptionsColorScheme(opts) {
	if (!opts) return void 0;
	const ex = opts;
	if (ex.colorScheme) return ex.colorScheme;
	return coerceColorScheme(ex.params?.colorScheme ?? ex.params?.theme);
}
function normalizeSetColorSchemePayload(payload) {
	if (payload === void 0 || payload === null) return void 0;
	if (typeof payload === "string") return coerceColorScheme(payload.trim());
	if (typeof payload === "object") {
		const o = payload;
		return coerceColorScheme(o.colorScheme ?? o.scheme ?? o.theme);
	}
}
function buildExplorerShell() {
	const shell = document.createElement("div");
	shell.className = "view-explorer";
	shell.setAttribute("data-view", "explorer");
	shell.setAttribute("aria-label", "File explorer");
	const content = document.createElement("div");
	content.className = "view-explorer__content";
	content.setAttribute("data-explorer-content", "");
	try {
		const fm = document.createElement("ui-file-manager");
		fm.setAttribute("view-mode", "list");
		content.append(fm);
	} catch (err) {
		console.error("[Explorer] ui-file-manager construct failed:", err);
		return buildFallbackShell();
	}
	shell.append(content);
	return shell;
}
function buildFallbackShell() {
	const shell = document.createElement("div");
	shell.className = "view-explorer";
	shell.setAttribute("data-view", "explorer");
	shell.setAttribute("aria-label", "File explorer (fallback)");
	const content = document.createElement("div");
	content.className = "view-explorer__content";
	content.setAttribute("data-explorer-content", "");
	content.innerHTML = `
        <div class="view-explorer__fallback">
            <h3>Explorer fallback mode</h3>
            <p>File manager component is unavailable; use local files below.</p>
            <div class="view-explorer__fallback-actions">
                <button type="button" data-action="pick-files">Open files</button>
                <button type="button" data-action="open-workcenter">Open Work Center</button>
            </div>
            <ul class="view-explorer__fallback-files" data-fallback-files></ul>
        </div>`;
	shell.append(content);
	return shell;
}
var TAG = "cw-view-explorer";
var CwViewExplorer = createViewConstructor(TAG, (Base) => {
	return class ExplorerView extends Base {
		id = "explorer";
		name = "Explorer";
		icon = "folder";
		explorerRoot = null;
		explorerCleanup = null;
		wiredFileManager = null;
		initialPath = null;
		explorerInject;
		_sheet = null;
		themeSync = null;
		lifecycle = {
			onMount: () => {
				try {
					this._sheet ??= loadAsAdopted$1(src_default);
				} catch {
					this._sheet = null;
				}
				this.syncExplorerThemeSubscription();
				this.attachExplorerWire();
				scheduleBakeScreenColors(this.explorerRoot);
			},
			onUnmount: () => {
				this.themeSync?.disconnect();
				this.themeSync = null;
				unbakeScreenColors(this.explorerRoot);
				this.detachExplorerWire();
				removeAdopted(this._sheet);
				this._sheet = null;
			},
			onShow: () => {
				try {
					this._sheet ??= loadAsAdopted$1(src_default);
				} catch {
					this._sheet = null;
				}
				this.syncExplorerThemeSubscription();
				if (!this.explorerCleanup && this.explorerRoot) this.attachExplorerWire();
				scheduleBakeScreenColors(this.explorerRoot);
			},
			onHide: () => {
				this.themeSync?.disconnect();
				this.themeSync = null;
				unbakeScreenColors(this.explorerRoot);
				this.detachExplorerWire();
				try {
					if (this._sheet) removeAdopted(this._sheet);
				} catch {}
				this._sheet = null;
			}
		};
		constructor(options) {
			super();
			if (options) {
				this.options = options;
				this.explorerInject = options.explorerInject;
				if (options.params?.path) this.initialPath = String(options.params.path);
				const fromParams = coerceColorScheme(options.params?.colorScheme ?? options.params?.theme);
				if (!options.colorScheme && fromParams) this.options.colorScheme = fromParams;
			}
		}
		/** Imperative theme — persists on view options for later re-renders. */
		setExplorerColorScheme(mode) {
			this.options.colorScheme = mode;
			applyExplorerColorScheme(this.explorerRoot, mode);
			this.syncExplorerThemeSubscription();
		}
		/** When using `system`, follow `html[data-theme]` + OS scheme; rebuild subscription on mode change. */
		syncExplorerThemeSubscription() {
			this.themeSync?.disconnect();
			this.themeSync = null;
			if (!this.explorerRoot) return;
			this.themeSync = subscribeExplorerSystemTheme(this.explorerRoot, () => this.options.colorScheme ?? "system");
		}
		render = (options) => {
			if (options) {
				this.options = {
					...this.options,
					...options
				};
				const p = options?.params?.path;
				if (p) this.initialPath = String(p);
				const inj = options?.explorerInject;
				if (inj !== void 0) this.explorerInject = inj;
			}
			if (this.explorerCleanup) {
				this.themeSync?.disconnect();
				this.themeSync = null;
				this.detachExplorerWire();
			}
			const hasFileManager = Boolean(customElements.get("ui-file-manager"));
			try {
				this.explorerRoot = hasFileManager ? buildExplorerShell() : buildFallbackShell();
			} catch (err) {
				console.error("[Explorer] render shell failed:", err);
				this.explorerRoot = buildFallbackShell();
			}
			const scheme = resolveExplorerOptionsColorScheme(options) ?? resolveExplorerOptionsColorScheme(this.options);
			applyExplorerColorScheme(this.explorerRoot, scheme ?? "system");
			this.syncExplorerThemeSubscription();
			return this.explorerRoot;
		};
		getToolbar() {
			return null;
		}
		canHandleMessage(messageType) {
			return [
				"file-ask",
				"file-save",
				"navigate-path",
				"content-explorer",
				ExplorerChannelAction.FileAsk,
				ExplorerChannelAction.SetColorScheme
			].includes(messageType);
		}
		async handleMessage(message) {
			const msg = message;
			if (msg.type === ExplorerChannelAction.SetColorScheme) {
				const next = normalizeSetColorSchemePayload(msg.data?.colorScheme ?? msg.data?.scheme ?? msg.data?.theme) ?? "system";
				this.setExplorerColorScheme(next);
				return;
			}
			const targetPath = String(msg.data?.path || msg.data?.into || msg.data?.src || msg.data?.virtualPath || "").trim();
			const files = [...msg.data?.file instanceof File ? [msg.data.file] : [], ...(Array.isArray(msg.data?.files) ? msg.data.files : []).filter((f) => f instanceof File)];
			if (msg.type === "file-ask" || msg.type === ExplorerChannelAction.FileAsk) {
				await this.askWhatToDoWithSharedFiles(files, targetPath);
				return;
			}
			if (msg.type === "navigate-path" || msg.type === "content-explorer") {
				if (targetPath && this.wiredFileManager) this.wiredFileManager.navigate(targetPath);
				return;
			}
			if (files[0]) {
				await this.saveIncomingFileToWorkspace(files[0], targetPath || void 0);
				return;
			}
			if (targetPath && this.wiredFileManager) this.wiredFileManager.navigate(targetPath);
		}
		async saveIncomingFileToWorkspace(file, destPath) {
			const op = this.wiredFileManager?.operative;
			if (!op?.ingestFileIntoWorkspace) return false;
			await op.ingestFileIntoWorkspace(file, destPath);
			return true;
		}
		parentDirOf(path) {
			const raw = String(path || "").trim().replace(/\\/g, "/");
			if (!raw) return "";
			const trimmed = raw.replace(/\/+$/, "");
			const cut = trimmed.lastIndexOf("/");
			if (cut <= 0) return trimmed;
			if (/\.[a-z0-9]{1,8}$/i.test(trimmed.slice(cut + 1))) return trimmed.slice(0, cut) || "/";
			return trimmed;
		}
		async askWhatToDoWithSharedFiles(files, pathHint) {
			const file = files[0];
			const folder = this.parentDirOf(pathHint);
			if (!file && folder) {
				if (this.wiredFileManager) this.wiredFileManager.navigate(folder);
				return;
			}
			if (!file) return;
			const choice = await new Promise((resolve) => {
				const dialog = document.createElement("dialog");
				dialog.className = "view-explorer__share-ask";
				const label = file.name || "shared file";
				dialog.innerHTML = `<form method="dialog">
                    <p>What should Explorer do with <strong></strong>?</p>
                    <menu>
                        <button value="open" type="submit"${folder ? "" : " disabled"}>Open folder</button>
                        <button value="save" type="submit">Save to workspace</button>
                        <button value="cancel" type="submit">Cancel</button>
                    </menu>
                </form>`;
				const strong = dialog.querySelector("strong");
				if (strong) strong.textContent = label;
				dialog.addEventListener("close", () => {
					const v = dialog.returnValue;
					dialog.remove();
					resolve(v === "open" || v === "save" ? v : "cancel");
				});
				(this.explorerRoot || document.body).appendChild(dialog);
				if (typeof dialog.showModal === "function") dialog.showModal();
				else dialog.show();
			});
			if (choice === "open" && folder && this.wiredFileManager) {
				this.wiredFileManager.navigate(folder);
				return;
			}
			if (choice === "save") await this.saveIncomingFileToWorkspace(file, folder || pathHint || void 0);
		}
		/** Imperative API — channels / tooling (`ui-file-manager` when wired). */
		navigateExplorer(path) {
			const p = String(path || "").trim();
			if (!p || !this.wiredFileManager) return;
			return this.wiredFileManager.navigate(p);
		}
		getExplorerFileManager() {
			return this.wiredFileManager;
		}
		getExplorerShellRoot() {
			return this.explorerRoot;
		}
		invokeChannelApi(action, payload) {
			const pathFromPayload = () => {
				if (typeof payload === "string") return payload.trim();
				if (payload && typeof payload === "object") {
					const o = payload;
					const raw = o.path ?? o.into ?? o.target;
					return typeof raw === "string" ? raw.trim() : "";
				}
				return "";
			};
			switch (action) {
				case ExplorerChannelAction.NavigatePath:
				case ExplorerChannelAction.ContentExplorer:
				case ExplorerChannelAction.Navigate: {
					const path = pathFromPayload();
					if (!path) return false;
					this.navigateExplorer(path);
					return true;
				}
				case ExplorerChannelAction.GetPath: return this.wiredFileManager?.path ?? null;
				case ExplorerChannelAction.FileAsk:
				case "file-ask": {
					const o = payload && typeof payload === "object" ? payload : {};
					const file = o.file instanceof File ? o.file : null;
					const files = [...file ? [file] : [], ...(Array.isArray(o.files) ? o.files : []).filter((f) => f instanceof File)];
					const dest = typeof o.path === "string" ? o.path : typeof o.into === "string" ? o.into : "";
					return this.askWhatToDoWithSharedFiles(files, dest);
				}
				case ExplorerChannelAction.FileSave:
				case "file-save": {
					const o = payload && typeof payload === "object" ? payload : {};
					const file = o.file instanceof File ? o.file : null;
					const dest = typeof o.path === "string" ? o.path : typeof o.into === "string" ? o.into : void 0;
					if (!file) return false;
					return this.saveIncomingFileToWorkspace(file, dest);
				}
				case ExplorerChannelAction.RequestUse:
					this.wiredFileManager?.requestUse?.();
					return true;
				case ExplorerChannelAction.RequestUpload:
					this.wiredFileManager?.requestUpload?.();
					return true;
				case ExplorerChannelAction.RequestPaste:
					this.wiredFileManager?.requestPaste?.();
					return true;
				case ExplorerChannelAction.SetColorScheme: {
					const next = normalizeSetColorSchemePayload(payload) ?? "system";
					this.setExplorerColorScheme(next);
					return true;
				}
				case "get-color-scheme": {
					const o = this.options;
					return o.colorScheme ?? resolveExplorerOptionsColorScheme(o) ?? "system";
				}
				default: return this.handleMessage({
					type: action,
					data: typeof payload === "object" && payload ? payload : { path: pathFromPayload() || void 0 }
				}).then(() => true);
			}
		}
		attachExplorerWire() {
			if (!this.explorerRoot) return;
			const shellOpts = this.options;
			try {
				const { cleanup, fileManager } = wireExplorerSubtree(this.explorerRoot, {
					shellContext: shellOpts?.shellContext,
					initialPath: this.initialPath,
					inject: this.explorerInject
				});
				this.explorerCleanup = cleanup;
				this.wiredFileManager = fileManager;
			} catch (err) {
				console.error("[Explorer] wire failed:", err);
				this.explorerCleanup = null;
				this.wiredFileManager = null;
			}
		}
		detachExplorerWire() {
			this.explorerCleanup?.();
			this.explorerCleanup = null;
			this.wiredFileManager = null;
		}
	};
});
function createExplorerView(options) {
	return new CwViewExplorer(options);
}
//#endregion
export { CwViewExplorer, TAG, applyExplorerColorScheme, createExplorerView, createExplorerView as default, getRegisteredExplorerInject, mergeExplorerInject, readAppDataTheme, registerExplorerInject, resolveExplorerColorSchemePreference, subscribeExplorerSystemTheme, wireExplorerSubtree };
