import { D as numberRef$1, F as property, I as H, P as defineElement } from "../vendor/culori.js";
import "../vendor/culori2.js";
import { W as registerDirectoryRoot } from "./app.js";
import { A as resolveFsBackend$1, c as captureSpeedDialSnapshot, h as persistSpeedDialIconBlob, n as SPEED_DIAL_MUTATION_EVENT, o as applySpeedDialSnapshot, u as getSpeedDialMeta, v as speedDialItems } from "./app4.js";
import { c as __decorate, o as UIElement, s as UIElement_default } from "./app5.js";
import { a as window_default, c as task_default, d as native_controls_default, f as ui_default, l as taskbar_default, o as appearance_mobile_default, p as statusbar_default, s as appearance_desktop_default, u as app_menu_default } from "../fest/veela.js";
import "./app8.js";
import "./app10.js";
import "../vendor/dompurify.js";
import { addEvent } from "/fest/dom.js";
import "/fest/object.js";
import "/fest/core.js";
import { S, bindStyle, loadAsAdopted as loadAsAdopted$1, preloadStyle as preloadStyle$1 } from "/fest/style-lib.js";
import "/fest/icon.js";
//#region ../../modules/projects/fl.ui/src/styles/font-loader.ts
/**
* Cache for Blob URLs to avoid re-creating them
*/
var blobUrlCache = /* @__PURE__ */ new Map();
/**
* Cache for FontFace instances
*/
var fontFaceCache = /* @__PURE__ */ new Map();
/**
* Decode base64 string to Uint8Array
* Uses Uint8Array.fromBase64 if available, otherwise falls back to atob
*/
function decodeBase64(base64) {
	if (typeof Uint8Array.fromBase64 === "function") return Uint8Array.fromBase64(base64);
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
}
/**
* Decompress data using Compression Streams API
* Only used for fonts that were compressed (e.g., gzip)
* woff2 files are already compressed and don't need decompression
*/
async function decompress(data, algorithm = "gzip") {
	if (typeof CompressionStream === "undefined") throw new Error("Compression Streams API is not supported in this browser");
	const stream = new DecompressionStream(algorithm);
	const writer = stream.writable.getWriter();
	const reader = stream.readable.getReader();
	writer.write(data);
	writer.close();
	const chunks = [];
	let done = false;
	while (!done) {
		const { value, done: readerDone } = await reader.read();
		done = readerDone;
		if (value) chunks.push(value);
	}
	const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
	const result = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}
/**
* Get or create a Blob URL from font data
* Caches the URL to avoid re-creating Blobs
*/
async function getBlobUrl(fontData, cacheKey, mimeType = "font/woff2") {
	if (blobUrlCache.has(cacheKey)) return blobUrlCache.get(cacheKey);
	const blob = new Blob([fontData], { type: mimeType });
	const url = URL.createObjectURL(blob);
	blobUrlCache.set(cacheKey, url);
	return url;
}
/**
* Load a font from base64-encoded, compressed data
*/
async function loadFont(metadata) {
	const { base64, family, style = "normal", weight = "normal", compressed = false } = metadata;
	const cacheKey = `${family}-${style}-${weight}`;
	if (fontFaceCache.has(cacheKey)) return fontFaceCache.get(cacheKey);
	const encodedData = decodeBase64(base64);
	const blobUrl = await getBlobUrl(compressed ? await decompress(encodedData) : encodedData, cacheKey, compressed ? "application/octet-stream" : "font/woff2");
	const fontFace = new FontFace(family, `url(${blobUrl}) format('woff2')`, {
		style,
		weight: typeof weight === "string" ? weight : `${weight}`,
		display: "swap"
	});
	await fontFace.load();
	document.fonts.add(fontFace);
	fontFaceCache.set(cacheKey, fontFace);
	return fontFace;
}
/**
* Load multiple fonts
*/
async function loadFonts(metadataArray) {
	const promises = metadataArray.map((metadata) => loadFont(metadata));
	return Promise.all(promises);
}
var loadingFontRegistry = null;
async function loadFontRegistry() {
	if (loadingFontRegistry) return loadingFontRegistry;
	loadingFontRegistry = import("./app17.js").then((mod) => typeof mod.loadFontRegistryShards === "function" ? mod.loadFontRegistryShards().then((fontRegistry) => ({ fontRegistry })) : { fontRegistry: mod.fontRegistry }).catch((error) => {
		console.error("Failed to load font registry:", error);
	});
	return loadingFontRegistry;
}
/**
* Load all fonts from the registry
*/
async function loadAllFonts() {
	const fontRegistry = await loadFontRegistry();
	return loadFonts(Object.values(fontRegistry.fontRegistry));
}
/**
* Font data registry (populated by Vite plugin)
* Import from generated font-registry module
*/
//#endregion
//#region ../../modules/projects/fl.ui/src/styles/index.ts
/**
* FL.UI Style Facade
*
* Loads canonical Veela styles while retaining FL.UI's public runtime API.
*/
var loader = async (options) => {
	await loadAllFonts().catch(() => void 0);
	await loadAsAdopted$1(ui_default)?.catch(() => void 0);
	if (options?.includeGlobalNativeControls) await loadAsAdopted$1(native_controls_default)?.catch(() => void 0);
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.ts
/**
* WHY: Uses FL-UI `ui-statusbar` (left/center/right slots) — not a parallel component.
* Reactive network/battery chips are shared via {@link attachShellDeviceStatus} for the desktop taskbar.
* Overlay mode (mobile browser / fullscreen, not standalone): transparent top band, time L / icons R.
*/
var styled$4 = preloadStyle$1(statusbar_default);
var StatusBar = class StatusBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$4;
	render = () => {
		return H`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`;
	};
};
StatusBar = __decorate([defineElement("ui-statusbar")], StatusBar);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/fs-backend.ts
function normalizeVirtualPath(path, asDirectory = true) {
	let p = String(path || "/").trim() || "/";
	if (!p.startsWith("/")) p = `/${p}`;
	p = p.replace(/\/{2,}/g, "/");
	if (p !== "/" && asDirectory && !p.endsWith("/")) p += "/";
	if (p !== "/" && !asDirectory && p.endsWith("/")) p = p.slice(0, -1);
	return p;
}
/**
* WHY: Transfer / Android send `/storage/emulated/0/…`, `file://`, or
* `content://…/primary:Download/…`. Explorer lists that as `/sdcard/…`.
* Do not map `/saf/` — that is Explorer's own tree, not Transfer landing.
*/
function toExplorerStoragePath(path, asDirectory = true) {
	let p = String(path || "").trim();
	if (!p) return "";
	try {
		if (/^file:/i.test(p)) {
			const u = new URL(p);
			p = decodeURIComponent(u.pathname || p);
		}
	} catch {}
	if (/^content:/i.test(p)) {
		let decoded = p;
		try {
			decoded = decodeURIComponent(p);
		} catch {
			decoded = p;
		}
		const id = decoded.match(/(?:primary|home):([^?#]*)/i);
		if (!id) return "";
		const rel = String(id[1] || "").replace(/^\/+/, "");
		p = rel ? `/sdcard/${rel}` : "/sdcard/";
	}
	p = p.replace(/\\/g, "/");
	p = p.replace(/^(?:\/storage\/emulated\/0|\/mnt\/sdcard|storage\/emulated\/0|mnt\/sdcard)(?=\/|$)/i, "/sdcard");
	p = p.replace(/^\/sdcard\/sdcard(?=\/|$)/i, "/sdcard");
	if (!p.startsWith("/")) p = `/${p}`;
	return normalizeVirtualPath(p, asDirectory);
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/backends/chrome-bookmarks-backend.ts
var BOOKMARKS_ROOT = "/bookmarks/";
/**
* chrome.bookmarks is callback-first historically; modern Chromium returns a
* Promise when the callback arg is omitted. Normalize both shapes so
* `await api.getTree()` never resolves to `undefined` (empty Explorer list).
*/
function promisifyBookmarksApi(api) {
	const chromeErr = () => {
		try {
			const err = globalThis?.chrome?.runtime?.lastError;
			return err ? new Error(String(err.message || err)) : null;
		} catch {
			return null;
		}
	};
	const call = (method, ...args) => {
		const fn = api?.[method];
		if (typeof fn !== "function") return Promise.reject(/* @__PURE__ */ new Error(`chrome.bookmarks.${String(method)} missing`));
		try {
			const result = fn.apply(api, args);
			if (result != null && typeof result.then === "function") return result;
		} catch (e) {
			return Promise.reject(e);
		}
		return new Promise((resolve, reject) => {
			try {
				fn.apply(api, [...args, (res) => {
					const err = chromeErr();
					if (err) reject(err);
					else resolve(res);
				}]);
			} catch (e) {
				reject(e);
			}
		});
	};
	return {
		getTree: () => call("getTree"),
		getChildren: (id) => call("getChildren", id),
		create: (opts) => call("create", opts),
		update: (id, changes) => call("update", id, changes),
		move: (id, dest) => call("move", id, dest),
		remove: (id) => call("remove", id),
		removeTree: (id) => call("removeTree", id),
		onCreated: api.onCreated,
		onChanged: api.onChanged,
		onRemoved: api.onRemoved,
		onMoved: api.onMoved
	};
}
var toEntry = (node) => {
	if (typeof node.url === "string" && node.url.length > 0) return {
		name: node.title || node.id,
		kind: "file",
		href: node.url,
		type: "text/uri-list",
		bookmarkId: node.id,
		path: `${BOOKMARKS_ROOT}${node.id}`
	};
	return {
		name: node.title || node.id,
		kind: "directory",
		bookmarkId: node.id,
		path: `${BOOKMARKS_ROOT}${node.id}/`
	};
};
/**
* Extract the trailing path segment as a Chrome bookmark id.
* `/bookmarks/1/` → "1"; `/bookmarks/1/10` → "10"; `/bookmarks/` → "" (root).
*/
var lastId = (path) => {
	const segments = normalizeVirtualPath(path, false).split("/").filter(Boolean);
	const ids = segments[0] === "bookmarks" ? segments.slice(1) : segments;
	return ids[ids.length - 1] ?? "";
};
/**
* `true` when the path addresses a folder (ends with `/`).
*
* WHY (final review #3): the previous impl called `normalizeVirtualPath(path,
* true)` which **forces** a trailing slash onto every input, so URL bookmark
* paths like `/bookmarks/10` were rewritten to `/bookmarks/10/` and `remove`
* always picked `removeTree`. Chrome `remove` rejects folders-with-children
* and `removeTree` rejects URL nodes, so URL deletes failed. We now collapse
* duplicate slashes only and inspect the original trailing slash, which the
* backend's own `toEntry` sets deterministically (folders end with `/`, URL
* nodes do not).
*/
var isFolderPath = (path) => {
	const raw = String(path || "").replace(/\/{2,}/g, "/");
	return raw.length > 1 && raw.endsWith("/");
};
/**
* Build a FsBackend backed by `chrome.bookmarks`. Pass the real API in CRX
* boot, or a mock in tests. Returns `null` if no API is provided so callers
* can short-circuit registration outside CRX.
*/
function createChromeBookmarksBackend(api) {
	if (!api) return null;
	const bookmarks = promisifyBookmarksApi(api);
	const list = async (path) => {
		const norm = normalizeVirtualPath(path, true);
		if (norm === BOOKMARKS_ROOT) {
			const tree = await bookmarks.getTree();
			const entries = [];
			for (const root of tree || []) for (const child of root?.children ?? []) entries.push(toEntry(child));
			return entries;
		}
		const id = lastId(norm);
		if (!id) return [];
		return (await bookmarks.getChildren(id) || []).map(toEntry);
	};
	const mkdir = async (parentPath, name) => {
		const parentId = lastId(parentPath) || "0";
		await bookmarks.create({
			parentId,
			title: name
		});
	};
	const createUrl = async (parentPath, title, url) => {
		const parentId = lastId(parentPath) || "0";
		await bookmarks.create({
			parentId,
			title,
			url
		});
	};
	const rename = async (path, newName) => {
		const id = lastId(path);
		if (!id) return;
		await bookmarks.update(id, { title: newName });
	};
	const update = async (path, patch) => {
		const id = lastId(path);
		if (!id) return;
		const body = {};
		if (patch.title != null) body.title = String(patch.title || "").trim();
		if (patch.url != null && !isFolderPath(path)) body.url = String(patch.url || "").trim();
		if (!Object.keys(body).length) return;
		await bookmarks.update(id, body);
	};
	const move = async (fromPath, toDirPath) => {
		const id = lastId(fromPath);
		const parentId = lastId(toDirPath) || "0";
		if (!id) return;
		await bookmarks.move(id, { parentId });
	};
	const remove = async (path, _recursive) => {
		const id = lastId(path);
		if (!id) return;
		if (isFolderPath(path)) await bookmarks.removeTree(id);
		else await bookmarks.remove(id);
	};
	const writeFile = async (_parentPath, _file) => {
		throw new Error("bookmarks backend does not store file bytes");
	};
	const invalidationListeners = /* @__PURE__ */ new Set();
	const emitInvalidation = () => {
		for (const cb of invalidationListeners) try {
			cb();
		} catch {}
	};
	if (bookmarks.onCreated?.addListener) bookmarks.onCreated.addListener(emitInvalidation);
	if (bookmarks.onChanged?.addListener) bookmarks.onChanged.addListener(emitInvalidation);
	if (bookmarks.onRemoved?.addListener) bookmarks.onRemoved.addListener(emitInvalidation);
	if (bookmarks.onMoved?.addListener) bookmarks.onMoved.addListener(emitInvalidation);
	const subscribeBookmarksInvalidation = (cb) => {
		if (typeof cb !== "function") return () => {};
		invalidationListeners.add(cb);
		return () => {
			invalidationListeners.delete(cb);
		};
	};
	return {
		root: BOOKMARKS_ROOT,
		writable: true,
		list,
		mkdir,
		createUrl,
		rename,
		update,
		move,
		remove,
		writeFile,
		subscribeBookmarksInvalidation
	};
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/backends/chrome-downloads-backend.ts
var DOWNLOADS_ROOT = "/downloads/";
var fileNameOf = (item) => {
	const raw = String(item.filename || item.url || "").trim();
	if (!raw) return `download-${item.id ?? "0"}`;
	const parts = raw.split(/[/\\]/).filter(Boolean);
	return parts[parts.length - 1] || raw;
};
var createChromeDownloadsBackend = (downloads) => {
	if (typeof downloads?.search !== "function") return null;
	return {
		root: DOWNLOADS_ROOT,
		writable: false,
		async list() {
			const rows = await downloads.search({});
			return (Array.isArray(rows) ? rows : []).filter((item) => item && item.exists !== false && String(item.state || "") !== "interrupted").map((item) => {
				const id = String(item.id ?? fileNameOf(item));
				return {
					name: fileNameOf(item),
					kind: "file",
					path: `${DOWNLOADS_ROOT}${id}`
				};
			});
		}
	};
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/storage-bridge.ts
var api = null;
var INVOKE_MS = 12e3;
var withTimeout$1 = async (task, ms, fallback) => {
	let timer;
	try {
		return await Promise.race([task, new Promise((resolve) => {
			timer = setTimeout(() => resolve(fallback), ms);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};
var capacitorInvoke = async (channel, payload = {}) => {
	const g = globalThis;
	const plugin = g.__CWS_BRIDGE_PLUGIN__ || g.Capacitor?.Plugins?.CwsBridge;
	if (typeof plugin?.invoke !== "function") return {
		ok: false,
		error: "no-bridge"
	};
	const r = await withTimeout$1(Promise.resolve(plugin.invoke({
		channel,
		payload
	})), INVOKE_MS, {
		ok: false,
		error: "timeout"
	});
	const echo = r?.echo && typeof r.echo === "object" ? r.echo : {};
	return {
		...r || {},
		...echo
	};
};
/**
* WHY: Speed Dial / shortcuts store `file:///storage/emulated/0/…`, `/mnt/sdcard/…`,
* or `sdcard/…`. CwsStorageHost only understands `/sdcard/` `/saf/`.
*/
var toNativeStorageVirtualPath = (raw) => {
	let s = String(raw || "").trim();
	if (!s) return "";
	try {
		s = decodeURIComponent(s);
	} catch {}
	const mapped = toExplorerStoragePath(s, false);
	return /^\/(?:sdcard|saf)(?:\/|$)/i.test(mapped) ? mapped : "";
};
var parseNativeStoragePath = (virtualPath) => {
	const raw = toNativeStorageVirtualPath(virtualPath) || String(virtualPath || "").trim();
	if (!raw) return null;
	const root = raw === "/saf" || raw.startsWith("/saf/") ? "saf" : raw === "/sdcard" || raw.startsWith("/sdcard/") ? "sdcard" : "";
	if (!root) return null;
	if (raw === `/${root}`) return {
		root,
		rel: "/"
	};
	const prefix = root === "saf" ? "/saf/" : "/sdcard/";
	return {
		root,
		rel: (raw.startsWith(prefix) ? raw.slice(prefix.length - 1) : raw) || "/"
	};
};
var isNativeStorageAvailable = () => {
	if (api?.list) return true;
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && c.isNativePlatform();
	} catch {
		return false;
	}
};
var listNativeStorage = async (root, path = "/") => {
	if (api?.list) return api.list(root, path);
	const echo = await capacitorInvoke("storage:list", {
		root,
		path
	});
	const rows = echo.entries || echo.files;
	return Array.isArray(rows) ? rows : [];
};
var dataUrlToFile = async (dataUrl, name, mime) => {
	const src = String(dataUrl || "").trim();
	if (!src) return null;
	const fileName = name || "file";
	const fallbackType = mime || "application/octet-stream";
	if (src.startsWith("data:")) {
		const comma = src.indexOf(",");
		if (comma < 0) return null;
		const meta = src.slice(5, comma);
		const payload = src.slice(comma + 1);
		const type = meta.split(";")[0] || fallbackType;
		try {
			if (/;base64/i.test(meta)) {
				const bin = atob(payload);
				const bytes = new Uint8Array(bin.length);
				for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
				return new File([bytes], fileName, { type });
			}
			return new File([decodeURIComponent(payload)], fileName, { type });
		} catch {
			return null;
		}
	}
	if (/^[A-Za-z0-9+/=\s]+$/.test(src) && src.length > 16) try {
		const bin = atob(src.replace(/\s/g, ""));
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		return new File([bytes], fileName, { type: fallbackType });
	} catch {}
	try {
		const blob = await (await fetch(src)).blob();
		return new File([blob], fileName, { type: blob.type || fallbackType });
	} catch {
		return null;
	}
};
/** Read one `/sdcard/` or `/saf/` file through CwsBridge (`storage:read`). */
var readNativeStorageFile = async (virtualPath, opts) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return null;
	const readOnce = async () => {
		const echo = await capacitorInvoke("storage:read", {
			root: parsed.root,
			path: parsed.rel
		});
		const name = String(echo.name || virtualPath.split("/").filter(Boolean).pop() || "file");
		const mime = String(echo.mime || echo.mimeType || "application/octet-stream");
		const error = String(echo.error || "");
		const text = String(echo.text || echo.content || "");
		if (text) return {
			file: new File([text], name, { type: mime || "text/markdown" }),
			error
		};
		const data = String(echo.data || echo.dataUrl || "");
		if (data) return {
			file: await dataUrlToFile(data, name, mime),
			error
		};
		return {
			file: null,
			error
		};
	};
	let got = await readOnce();
	if (got.file) return got.file;
	if (opts?.requestAccess === false) return null;
	if (parsed.root === "sdcard") {
		const denied = /all-files-required|permission|EACCES|denied|timeout/i.test(got.error);
		const status = await getAllFilesStatus();
		if (denied || !status.allFilesAccess) {
			await requestAllFilesAccess();
			got = await readOnce();
		}
	}
	return got.file;
};
/** Delete a `/sdcard/` or `/saf/` file or folder through CwsBridge (`storage:delete`). */
var removeNativeStorage = async (virtualPath) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) throw new Error("not native storage");
	const plugin = globalThis.Capacitor?.Plugins?.CwsBridge;
	if (typeof plugin?.invoke !== "function") throw new Error("no native storage");
	const r = await plugin.invoke({
		channel: "storage:delete",
		payload: {
			root: parsed.root,
			path: parsed.rel
		}
	});
	const echo = r?.echo || {};
	if (r?.ok === false || echo.deleted !== true) throw new Error(String(echo.error || "delete failed"));
};
var getAllFilesStatus = async () => {
	if (api?.allFilesStatus) return api.allFilesStatus();
	const echo = await capacitorInvoke("storage:all-files-status", {});
	return {
		allFilesAccess: echo.allFilesAccess === true,
		runtimeGranted: echo.runtimeGranted === true,
		note: echo.note ? String(echo.note) : void 0
	};
};
var requestAllFilesAccess = async () => {
	if (api?.requestAllFiles) return api.requestAllFiles();
	const echo = await capacitorInvoke("storage:all-files-request", {});
	return echo.ok === true || echo.opened === true;
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/backends/native-fs-backend.ts
var toEntries = (path, rows) => {
	const base = normalizeVirtualPath(path, true);
	return rows.filter((row) => row?.name).map((row) => {
		const kind = row.kind === "directory" ? "directory" : "file";
		return {
			name: String(row.name),
			kind,
			path: row.path || `${base}${row.name}${kind === "directory" ? "/" : ""}`,
			type: kind === "file" ? void 0 : void 0
		};
	});
};
var createNativeFsBackend = (root) => ({
	root,
	writable: true,
	async list(path) {
		const rel = normalizeVirtualPath(path, true).slice(root.length - 1) || "/";
		return toEntries(path, await listNativeStorage(root === "/saf/" ? "saf" : "sdcard", rel));
	},
	async readFile(path) {
		return readNativeStorageFile(path);
	},
	async remove(path, _recursive) {
		await removeNativeStorage(path);
	}
});
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/backends/neutralino-fs-backend.ts
var DESKTOP_ROOT = "/desktop/";
var neu = () => {
	try {
		return globalThis.Neutralino ?? null;
	} catch {
		return null;
	}
};
var isNeutralinoFilesystemAvailable = () => typeof neu()?.filesystem?.readDirectory === "function";
var resolveNeutralinoHome = async () => {
	const os = neu()?.os;
	if (typeof os?.getPath === "function") for (const name of ["home", "documents"]) try {
		const path = String(await os.getPath(name) || "").trim();
		if (path) return path;
	} catch {}
	return "";
};
var joinNative = (home, rel) => {
	const base = home.replace(/[/\\]+$/, "");
	const tail = rel.replace(/^[/\\]+/, "").replace(/[/\\]+$/, "");
	if (!tail) return base || home;
	const sep = base.includes("\\") ? "\\" : "/";
	return `${base}${sep}${tail.replace(/[/\\]+/g, sep)}`;
};
var virtualToNative = (home, virtualPath, asDirectory) => {
	const v = normalizeVirtualPath(virtualPath, asDirectory);
	return joinNative(home, v.startsWith("/desktop/") ? v.slice(9) : v.replace(/^\/+/, ""));
};
var createNeutralinoFsBackend = (homePath) => {
	const fs = neu()?.filesystem;
	const home = String(homePath || "").trim();
	if (!home || typeof fs?.readDirectory !== "function") return null;
	return {
		root: DESKTOP_ROOT,
		writable: true,
		async list(path) {
			const native = virtualToNative(home, path, true);
			const rows = await fs.readDirectory(native);
			const base = normalizeVirtualPath(path, true);
			return (Array.isArray(rows) ? rows : []).map((row) => {
				const name = String(row?.entry || "").trim();
				if (!name || name === "." || name === "..") return null;
				const kind = String(row?.type || "").toUpperCase() === "DIRECTORY" ? "directory" : "file";
				return {
					name,
					kind,
					path: `${base}${name}${kind === "directory" ? "/" : ""}`
				};
			}).filter((row) => Boolean(row));
		},
		async mkdir(path, name) {
			if (typeof fs.createDirectory !== "function") throw new Error("Neutralino filesystem.createDirectory unavailable");
			const parent = virtualToNative(home, path, true);
			const sep = parent.includes("\\") ? "\\" : "/";
			await fs.createDirectory(`${parent}${sep}${name}`);
		},
		async remove(path) {
			if (typeof fs.remove !== "function") throw new Error("Neutralino filesystem.remove unavailable");
			await fs.remove(virtualToNative(home, path, false));
		},
		async rename(path, newName) {
			if (typeof fs.move !== "function") throw new Error("Neutralino filesystem.move unavailable");
			const from = virtualToNative(home, path, false);
			const parentVirt = normalizeVirtualPath(path, false).replace(/[^/]+$/, "");
			const dest = virtualToNative(home, `${parentVirt}${newName}`, false);
			await fs.move(from, dest);
		},
		async move(fromPath, toDirPath) {
			if (typeof fs.move !== "function") throw new Error("Neutralino filesystem.move unavailable");
			const from = virtualToNative(home, fromPath, false);
			const name = normalizeVirtualPath(fromPath, false).split("/").filter(Boolean).pop() || "";
			const dest = virtualToNative(home, `${normalizeVirtualPath(toDirPath, true)}${name}`, false);
			await fs.move(from, dest);
		},
		async writeFile(parentPath, file) {
			const dest = virtualToNative(home, `${normalizeVirtualPath(parentPath, true)}${file.name}`, false);
			const bytes = await file.arrayBuffer();
			if (typeof fs.writeBinaryFile === "function") {
				await fs.writeBinaryFile(dest, bytes);
				return;
			}
			if (typeof fs.writeFile === "function") {
				await fs.writeFile(dest, await file.text());
				return;
			}
			throw new Error("Neutralino filesystem write unavailable");
		}
	};
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/mounts.ts
var MOUNTS_ROOT = "/mounts/";
var CATALOG_KEY$1 = "cw::explorer::mounts";
var handles = /* @__PURE__ */ new Map();
var observer = null;
var readCatalog$1 = () => {
	try {
		const raw = localStorage.getItem(CATALOG_KEY$1);
		const parsed = raw ? JSON.parse(raw) : null;
		if (parsed && Array.isArray(parsed.mounts)) return parsed;
	} catch {}
	return { mounts: [] };
};
var walkHandle = async (dir, virtualDir) => {
	const entries = [];
	const base = normalizeVirtualPath(virtualDir, true);
	try {
		for await (const [name, handle] of dir.entries()) {
			const kind = handle.kind === "directory" ? "directory" : "file";
			entries.push({
				name,
				kind,
				path: `${base}${name}${kind === "directory" ? "/" : ""}`
			});
		}
	} catch {
		return [];
	}
	return entries;
};
var resolveNestedHandle = async (root, rel) => {
	let dir = root;
	for (const seg of rel.split("/").filter(Boolean)) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return null;
	}
	return dir;
};
var createMountBackend = (mount) => ({
	root: mount.path,
	writable: true,
	async list(path) {
		const handle = handles.get(mount.id);
		if (!handle) return [];
		const rel = normalizeVirtualPath(path, true).slice(mount.path.length);
		const dir = rel ? await resolveNestedHandle(handle, rel) : handle;
		if (!dir) return [];
		return walkHandle(dir, path);
	}
});
var observeHandle = (handle) => {
	const Ctor = globalThis.FileSystemObserver;
	if (typeof Ctor !== "function") return;
	try {
		observer?.disconnect?.();
		const next = new Ctor(() => {
			window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
		});
		next.observe(handle);
		observer = next;
	} catch {}
};
var listExplorerMounts = () => readCatalog$1().mounts;
var restoreDirectoryMounts = () => {
	restorePersistedHandles().then(() => {
		for (const mount of readCatalog$1().mounts) {
			const handle = handles.get(mount.id);
			if (!handle) continue;
			registerFsBackend(createMountBackend(mount));
			registerDirectoryRoot(mount.path, handle);
			observeHandle(handle);
		}
	});
};
var HANDLE_DB = "cw-explorer-fs";
var HANDLE_STORE = "handles";
var openHandleDb = () => new Promise((resolve, reject) => {
	const req = indexedDB.open(HANDLE_DB, 1);
	req.onupgradeneeded = () => req.result.createObjectStore(HANDLE_STORE);
	req.onsuccess = () => resolve(req.result);
	req.onerror = () => reject(req.error);
});
var restorePersistedHandles = async () => {
	if (typeof indexedDB === "undefined") return;
	try {
		const db = await openHandleDb();
		const stored = await new Promise((resolve, reject) => {
			const req = db.transaction(HANDLE_STORE, "readonly").objectStore(HANDLE_STORE).openCursor();
			const rows = [];
			req.onsuccess = () => {
				const cursor = req.result;
				if (!cursor) {
					resolve(rows);
					return;
				}
				rows.push([String(cursor.key), cursor.value]);
				cursor.continue();
			};
			req.onerror = () => reject(req.error);
		});
		for (const [id, handle] of stored) {
			if (!handle || handles.has(id)) continue;
			try {
				const perm = await handle.queryPermission?.({ mode: "read" });
				if (perm && perm !== "granted") continue;
				handles.set(id, handle);
			} catch {}
		}
	} catch {}
};
/** Placeholder so /mounts/ appears at virtual root even before a pick. */
var ensureMountsRootBackend = () => {
	registerFsBackend({
		root: MOUNTS_ROOT,
		writable: false,
		async list() {
			return listExplorerMounts().map((m) => ({
				name: m.label,
				kind: "directory",
				path: m.path
			}));
		}
	});
	restoreDirectoryMounts();
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/explorer/path-router.ts
/**
* INVARIANT: registry keys are normalized directory roots (trailing slash,
* except `/` itself). Longest-prefix match wins so nested backends (e.g.
* `/bookmarks/` under a future `/`-rooted fallback) resolve deterministically.
*/
var registry = /* @__PURE__ */ new Map();
var normalizeRoot = (root) => normalizeVirtualPath(root, true);
var backendListeners = /* @__PURE__ */ new Set();
var notifyBackendRegistered = (root) => {
	for (const listener of backendListeners) try {
		listener(root);
	} catch {}
};
function registerFsBackend(backend) {
	if (!backend?.root) return;
	const key = normalizeRoot(backend.root);
	registry.set(key, backend);
	notifyBackendRegistered(key);
	bindFsBackendToProvide(backend);
}
function unregisterFsBackend(root) {
	registry.delete(normalizeRoot(root));
}
/**
* Longest-prefix match. A backend rooted at `/user/` matches `/user/links/`
* but not `/user-other/`. The root `/` matches anything when registered.
*/
function resolveFsBackend(path) {
	const target = normalizeVirtualPath(path, true);
	let best = null;
	let bestLen = -1;
	for (const [root, backend] of registry) {
		if (root === "/") {
			if (bestLen < 1) {
				best = backend;
				bestLen = 1;
			}
			continue;
		}
		if (target === root || target.startsWith(root)) {
			if (root.length > bestLen) {
				best = backend;
				bestLen = root.length;
			}
		}
	}
	return best;
}
var OPFS_SUPPORT_KEY = "cwsp.opfs.enabled";
var isOpfsSupportEnabledSync = () => {
	try {
		if (typeof localStorage === "undefined") return true;
		const value = localStorage.getItem(OPFS_SUPPORT_KEY);
		return value !== "0" && value !== "false";
	} catch {
		return true;
	}
};
var isOpfsCapabilityAvailableSync = () => typeof navigator !== "undefined" && typeof navigator.storage?.getDirectory === "function";
var isOpfsBackendActiveSync = () => isOpfsCapabilityAvailableSync() && isOpfsSupportEnabledSync();
var stripStoragePrefix = (path, scope) => {
	const vpath = String(path || "").replace(/^\/+/, "");
	const prefix = `${scope}/`;
	if (vpath.startsWith(prefix)) return `/${vpath.slice(prefix.length)}`;
	if (vpath === scope) return "/";
	return `/${vpath}`;
};
var listHandleDirectory = async (root, path) => {
	if (!root) return [];
	const segments = stripStoragePrefix(path, normalizeVirtualPath(path, true).startsWith("/idb/") ? "idb" : "user").split("/").filter(Boolean);
	let dir = root;
	for (const seg of segments) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return [];
	}
	const entries = [];
	try {
		for await (const [name, handle] of dir.entries()) {
			const kind = handle?.kind === "directory" ? "directory" : "file";
			const childPath = `${normalizeVirtualPath(path, true)}${name}${kind === "directory" ? "/" : ""}`;
			entries.push({
				name,
				kind,
				path: childPath
			});
		}
	} catch {
		return [];
	}
	return entries;
};
var readHandleFile = async (root, path, scope) => {
	if (!root) return null;
	const segments = stripStoragePrefix(path, scope).split("/").filter(Boolean);
	if (!segments.length) return null;
	let dir = root;
	for (const seg of segments.slice(0, -1)) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return null;
	}
	try {
		return await (await dir.getFileHandle(segments[segments.length - 1], { create: false })).getFile();
	} catch {
		return null;
	}
};
var bindFsBackendToProvide = (backend) => {
	if (backend.root === "/bookmarks/" || backend.root === "/downloads/") return;
	import("../vendor/culori.js").then((n) => n.t).then(({ registerProvideBackend }) => {
		registerProvideBackend({
			root: backend.root,
			list: async (path) => {
				const rows = await backend.list(path);
				const base = normalizeVirtualPath(path, true);
				return rows.map((row) => ({
					name: row.name,
					kind: row.kind,
					path: row.path || `${base}${row.name}${row.kind === "directory" ? "/" : ""}`
				}));
			},
			readFile: backend.readFile,
			writeFile: backend.writeFile ? async (path, file) => {
				const slash = String(path || "").lastIndexOf("/");
				const parent = slash >= 0 ? path.slice(0, slash + 1) : backend.root;
				await backend.writeFile?.(parent, file);
				return true;
			} : void 0
		});
	}).catch(() => {});
};
var loadIdbRoot = async () => {
	if (typeof indexedDB === "undefined") return null;
	try {
		const { getIdbRoot } = await import("../vendor/culori.js").then((n) => n.t);
		return await getIdbRoot();
	} catch {
		return null;
	}
};
var resolveUserHandleRoot = async () => {
	if (isOpfsBackendActiveSync()) try {
		return await navigator.storage.getDirectory();
	} catch {
		return null;
	}
	return loadIdbRoot();
};
var createStorageFsBackend = (root, getRoot) => {
	const scope = root === "/idb/" ? "idb" : "user";
	return {
		root,
		writable: true,
		async list(path) {
			return listHandleDirectory(await getRoot().catch(() => null), path);
		},
		async readFile(path) {
			return readHandleFile(await getRoot().catch(() => null), path, scope);
		},
		async mkdir(parentPath, name) {
			const handleRoot = await getRoot();
			if (!handleRoot) return;
			const segments = [...stripStoragePrefix(parentPath, scope).split("/").filter(Boolean), String(name || "").trim()].filter(Boolean);
			let dir = handleRoot;
			for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create: true });
		},
		async writeFile(parentPath, file) {
			const handleRoot = await getRoot();
			if (!handleRoot || !file) return;
			const segments = stripStoragePrefix(parentPath, scope).split("/").filter(Boolean);
			let dir = handleRoot;
			for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create: true });
			const writable = await (await dir.getFileHandle(file.name || `file-${Date.now()}`, { create: true })).createWritable();
			await writable.write(file);
			await writable.close();
		},
		async remove(path, recursive = true) {
			const handleRoot = await getRoot();
			if (!handleRoot) return;
			const segments = stripStoragePrefix(path, scope).replace(/\/+$/g, "").split("/").filter(Boolean);
			if (!segments.length) return;
			const name = segments.pop();
			let dir = handleRoot;
			for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create: false });
			await dir.removeEntry(name, { recursive });
		}
	};
};
function ensureDefaultFsBackends() {
	if (!resolveFsBackend("/user/")) registerFsBackend(createStorageFsBackend("/user/", resolveUserHandleRoot));
	if (isOpfsBackendActiveSync() && typeof indexedDB !== "undefined") {
		if (!resolveFsBackend("/idb/")) registerFsBackend(createStorageFsBackend("/idb/", loadIdbRoot));
	} else {
		unregisterFsBackend("/idb/");
		import("../vendor/culori.js").then((n) => n.t).then(({ unregisterProvideBackend }) => {
			unregisterProvideBackend("/idb/");
		}).catch(() => {});
	}
	if (!resolveFsBackend("/assets/")) registerFsBackend({
		root: "/assets/",
		writable: false,
		async list(path) {
			try {
				const { tryRemoteMountedList } = await import("../vendor/culori.js").then((n) => n.t);
				return await tryRemoteMountedList(path) ?? [];
			} catch {
				return [];
			}
		},
		async readFile(path) {
			const p = String(path || "").trim();
			if (!p || p.endsWith("/")) return null;
			try {
				const { tryRemoteMountedRead } = await import("../vendor/culori.js").then((n) => n.t);
				const remote = await tryRemoteMountedRead(p);
				if (remote) return remote;
			} catch {}
			try {
				const r = await fetch(p);
				if (!r?.ok) return null;
				const blob = await r.blob();
				const name = p.slice(p.lastIndexOf("/") + 1) || "asset";
				return new File([blob], name, { type: blob.type || "" });
			} catch {
				return null;
			}
		}
	});
	import("../vendor/culori.js").then((n) => n.t).then(({ ensureRemoteMountedFs }) => {
		ensureRemoteMountedFs();
	}).catch(() => {});
	if (!resolveFsBackend("/bookmarks/")) {
		const chromeAny = globalThis?.chrome;
		if (chromeAny?.bookmarks) {
			const backend = createChromeBookmarksBackend(chromeAny.bookmarks);
			if (backend) registerFsBackend(backend);
		}
	}
	if (!resolveFsBackend("/downloads/")) {
		const chromeAny = globalThis?.chrome;
		if (chromeAny?.downloads) {
			const backend = createChromeDownloadsBackend(chromeAny.downloads);
			if (backend) registerFsBackend(backend);
		}
	}
	if (isNativeStorageAvailable()) {
		if (!resolveFsBackend("/sdcard/")) registerFsBackend(createNativeFsBackend("/sdcard/"));
		if (!resolveFsBackend("/saf/")) registerFsBackend(createNativeFsBackend("/saf/"));
	}
	if (isNeutralinoFilesystemAvailable() && !resolveFsBackend("/desktop/")) resolveNeutralinoHome().then((home) => {
		if (!home || resolveFsBackend("/desktop/")) return;
		const backend = createNeutralinoFsBackend(home);
		if (backend) registerFsBackend(backend);
	});
	if (!resolveFsBackend("/mounts/")) ensureMountsRootBackend();
	observeUserFileSystem();
}
/**
* WHY: FileSystemObserver is Chromium-experimental. When present, OPFS
* mutations refresh Explorer without polling. Cap / SAF fall back to the
* toolbar refresh and `cwsp:explorer-mount-change`.
*/
var observeUserFileSystem = () => {
	if (typeof window === "undefined") return;
	const g = globalThis;
	const Ctor = g.FileSystemObserver;
	const getDir = g.navigator?.storage?.getDirectory;
	if (typeof Ctor !== "function" || typeof getDir !== "function") return;
	if (globalThis.__CWSP_USER_FS_OBS__) return;
	globalThis.__CWSP_USER_FS_OBS__ = true;
	getDir.call(g.navigator?.storage).then((root) => {
		return new Ctor(() => {
			window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
		}).observe(root);
	}).catch(() => {
		globalThis.__CWSP_USER_FS_OBS__ = false;
	});
};
ensureDefaultFsBackends();
preloadStyle$1(app_menu_default);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/widgets.ts
var androidBridge = null;
var getAndroidWidgetId = (item) => {
	const meta = getSpeedDialMeta(item.id);
	return Math.max(0, Number(meta?.androidWidgetId) || 0);
};
var boxFromElement = (widgetId, el) => {
	const rect = el.getBoundingClientRect();
	return {
		widgetId,
		x: rect.left,
		y: rect.top,
		w: Math.max(8, rect.width),
		h: Math.max(8, rect.height),
		dpr: Number(window.devicePixelRatio) || 1
	};
};
var syncAndroidWidgetHosts = (root) => {
	if (!androidBridge) return;
	const host = root || document.getElementById("home");
	if (!host) return;
	host.querySelectorAll("[data-speed-dial-item][data-widget=\"android\"][data-layer=\"icons\"]").forEach((node) => {
		const item = (speedDialItems || []).find((it) => it?.id === node.dataset.id);
		if (!item) return;
		const widgetId = getAndroidWidgetId(item);
		if (!widgetId) return;
		const box = boxFromElement(widgetId, node);
		androidBridge.widgetAttach(box);
	});
};
var hideAndroidWidgetHosts = () => {
	androidBridge?.widgetHideAll?.();
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/workspace-pages.ts
var WORKSPACES_ROOT = "/user/workspaces/";
var WORKSPACE_PAGE_EVENT = "cwsp:workspace-page";
var CATALOG_KEY = "cw::workspace::pages";
var slugPath = (id) => `${WORKSPACES_ROOT}${id}/`;
var defaultPages = () => [
	"side-a",
	"side-b",
	"side-c"
].map((id) => ({
	id,
	label: `Side ${id.slice(-1).toUpperCase()}`,
	path: slugPath(id)
}));
var emptyCatalog = () => ({
	activeId: "side-a",
	pages: defaultPages(),
	snapshots: {}
});
var readCatalog = () => {
	try {
		const raw = localStorage.getItem(CATALOG_KEY);
		if (!raw) return emptyCatalog();
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.pages) || !parsed.pages.length) return emptyCatalog();
		return {
			activeId: String(parsed.activeId || parsed.pages[0].id),
			pages: parsed.pages.map((p) => ({
				id: String(p.id || "").trim(),
				label: String(p.label || p.id),
				path: String(p.path || slugPath(p.id))
			})).filter((p) => p.id),
			snapshots: parsed.snapshots && typeof parsed.snapshots === "object" ? parsed.snapshots : {}
		};
	} catch {
		return emptyCatalog();
	}
};
var slimSnapshot = (snap) => ({ items: (snap?.items || []).map((row) => {
	const iconUrl = String(row.meta?.iconUrl || "");
	if (!/^(data:|blob:)/i.test(iconUrl)) return row;
	const meta = { ...row.meta || {} };
	if (/^data:/i.test(iconUrl) && row.id) meta.iconUrl = persistSpeedDialIconBlob(String(row.id), iconUrl);
	else delete meta.iconUrl;
	return {
		...row,
		meta
	};
}) });
var writeCatalog = (catalog) => {
	try {
		localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
	} catch (e) {
		console.warn("[workspace-pages] catalog persist failed", e);
	}
};
var emitPageChange = (id) => {
	try {
		window.dispatchEvent(new CustomEvent(WORKSPACE_PAGE_EVENT, { detail: {
			id,
			pages: listWorkspacePages()
		} }));
	} catch {}
};
var listWorkspacePages = () => readCatalog().pages;
var getActiveWorkspaceId = () => readCatalog().activeId || "side-a";
/** Keep the active page snapshot in sync with add/edit/remove grid mutations. */
var syncActiveWorkspaceSnapshot = () => {
	const cat = readCatalog();
	if (!cat.pages.some((page) => page.id === cat.activeId)) return;
	cat.snapshots[cat.activeId] = slimSnapshot(captureSpeedDialSnapshot());
	writeCatalog(cat);
};
try {
	const g = globalThis;
	if (!g.__CWSP_WORKSPACE_SNAPSHOT_SYNC_BOUND__) {
		g.__CWSP_WORKSPACE_SNAPSHOT_SYNC_BOUND__ = true;
		window.addEventListener(SPEED_DIAL_MUTATION_EVENT, syncActiveWorkspaceSnapshot);
	}
} catch {}
/** Best-effort Explorer tree: /user/workspaces/<id>/workspace.json */
var ensureWorkspaceExplorerDir = async (page) => {
	try {
		const backend = resolveFsBackend$1("/user/");
		if (!backend?.mkdir || !backend.writable) return;
		await backend.mkdir("/user/", "workspaces").catch(() => void 0);
		await backend.mkdir(WORKSPACES_ROOT, page.id).catch(() => void 0);
		if (backend.writeFile) {
			const blob = new File([JSON.stringify({
				id: page.id,
				label: page.label,
				path: page.path
			}, null, 2)], "workspace.json", { type: "application/json" });
			await backend.writeFile(page.path, blob).catch(() => void 0);
		}
	} catch (e) {
		console.warn("[workspace-pages] explorer dir failed", page.id, e);
	}
};
var prefersReducedMotion = () => {
	try {
		return matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return false;
	}
};
var workspaceTurnTargets = () => {
	const root = document.querySelector(".speed-dial-root") || document.getElementById("home");
	if (!root) return [];
	const grids = [...root.querySelectorAll(".speed-dial-grid")];
	return grids.length ? grids : [root];
};
var clearWorkspaceTurnGhosts = (root) => {
	const scope = root || (typeof document !== "undefined" ? document : null);
	if (!scope?.querySelectorAll) return;
	scope.querySelectorAll(".speed-dial-grid--turn-ghost").forEach((node) => node.remove());
	scope.querySelectorAll("[data-ws-turning]").forEach((el) => {
		delete el.dataset.wsTurning;
		el.querySelectorAll(".speed-dial-grid").forEach((grid) => {
			grid.style.opacity = "";
		});
	});
};
/**
* Clone outgoing tiles, then return a closer that turns the new page in.
* WHY: snapshot apply stays synchronous so rapid A→C clicks never persist the wrong page.
*/
var beginWorkspacePageTurn = (direction) => {
	const targets = workspaceTurnTargets();
	const root = targets[0]?.closest(".speed-dial-root") || targets[0] || null;
	clearWorkspaceTurnGhosts(root);
	if (!targets.length || prefersReducedMotion() || typeof targets[0].animate !== "function") return () => void 0;
	const dir = direction < 0 ? -1 : 1;
	const outDeg = `${-88 * dir}deg`;
	const inDeg = `${88 * dir}deg`;
	const outX = `${-18 * dir}%`;
	const inX = `${18 * dir}%`;
	const turnRoot = root || targets[0];
	turnRoot.dataset.wsTurning = dir > 0 ? "next" : "prev";
	const ghosts = [];
	for (const el of targets) {
		const ghost = el.cloneNode(true);
		ghost.classList.add("speed-dial-grid--turn-ghost");
		ghost.dataset.wsGhost = "1";
		ghost.setAttribute("aria-hidden", "true");
		el.parentElement?.insertBefore(ghost, el.nextSibling);
		el.style.opacity = "0";
		ghosts.push(ghost);
		ghost.animate([{
			transform: "translateX(0) rotateY(0deg)",
			opacity: 1
		}, {
			transform: `translateX(${outX}) rotateY(${outDeg})`,
			opacity: 0
		}], {
			duration: 180,
			easing: "cubic-bezier(.4, 0, .2, 1)",
			fill: "forwards"
		});
	}
	const finishCleanup = () => {
		for (const el of targets) el.style.opacity = "";
		for (const ghost of ghosts) ghost.remove();
		delete turnRoot.dataset.wsTurning;
	};
	return () => {
		const incoming = targets.map((el) => el.animate([{
			transform: `translateX(${inX}) rotateY(${inDeg})`,
			opacity: .2
		}, {
			transform: "translateX(0) rotateY(0deg)",
			opacity: 1
		}], {
			duration: 220,
			easing: "cubic-bezier(.22, 1, .36, 1)",
			fill: "none"
		}));
		const done = Promise.all(incoming.map((anim) => anim.finished.catch(() => void 0)));
		const watchdog = new Promise((resolve) => {
			setTimeout(resolve, 500);
		});
		Promise.race([done, watchdog]).then(finishCleanup);
	};
};
/**
* Persist the live Speed Dial into the active page, then load another page.
* INVARIANT: the in-memory `speedDialItems` array is always the active workspace.
*/
var switchWorkspacePage = (id) => {
	const cat = readCatalog();
	const next = cat.pages.find((p) => p.id === id);
	if (!next) return false;
	const currentId = cat.activeId || cat.pages[0].id;
	if (currentId === next.id) return true;
	const fromIdx = Math.max(0, cat.pages.findIndex((p) => p.id === currentId));
	let turnDir = Math.max(0, cat.pages.findIndex((p) => p.id === next.id)) - fromIdx;
	if (Math.abs(turnDir) > cat.pages.length / 2) turnDir += turnDir > 0 ? -cat.pages.length : cat.pages.length;
	cat.snapshots[currentId] = slimSnapshot(captureSpeedDialSnapshot());
	cat.activeId = next.id;
	writeCatalog(cat);
	hideAndroidWidgetHosts();
	const finishTurn = beginWorkspacePageTurn(turnDir);
	applySpeedDialSnapshot(cat.snapshots[next.id] || { items: [] });
	requestAnimationFrame(() => {
		finishTurn();
		requestAnimationFrame(() => syncAndroidWidgetHosts());
	});
	ensureWorkspaceExplorerDir(next);
	emitPageChange(next.id);
	return true;
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/taskbar/element/TaskBar.ts
var styled$2 = preloadStyle$1(taskbar_default);
var UITaskBar = class UITaskBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$2;
	render = () => H`<div part="taskbar" class="taskbar"><slot></slot></div>`;
};
UITaskBar = __decorate([defineElement("ui-taskbar")], UITaskBar);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/taskbar/element/Task.ts
var styled$1 = preloadStyle$1(task_default);
/** First letter for blank-glyph fallback — never String(undefined)→"U". */
var titleLetter = (title) => {
	let s = "";
	if (typeof title === "string") s = title;
	else if (title != null && typeof title === "object" && "value" in title) {
		const v = title.value;
		s = v == null ? "" : String(v);
	} else if (title != null && typeof title !== "object") s = String(title);
	if (!s || s === "undefined" || s === "null" || s === "[object Object]") s = "";
	const ch = s.trim().charAt(0);
	return ch ? ch.toUpperCase() : "?";
};
var attrString = (el, name, fallback) => {
	const raw = el.getAttribute(name);
	if (raw != null && String(raw).trim()) return String(raw).trim();
	return fallback;
};
var UITask = class UITask extends UIElement_default {
	title;
	icon;
	constructor() {
		super();
	}
	styles = () => styled$1;
	render = function() {
		const titleText = attrString(this, "title", "Task");
		const iconName = attrString(this, "icon", "app-window");
		const letter = titleLetter(titleText);
		return H`
            <div part="icon" class="task-icon c2-contrast c2-transparent" data-letter=${letter}>
                <span class="task-letter" part="letter" aria-hidden="true">${letter}</span>
                <ui-icon class="c2-contrast c2-transparent task-icon-glyph" part="glyph" icon=${iconName} icon-style="duotone"></ui-icon>
            </div>
            <div part="title" class="task-title c2-contrast c2-transparent">${titleText}</div>
        `;
	};
};
__decorate([property({ source: "attr" })], UITask.prototype, "title", void 0);
__decorate([property({ source: "attr" })], UITask.prototype, "icon", void 0);
UITask = __decorate([defineElement("ui-task")], UITask);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/appearance/Desktop.ts
preloadStyle$1(appearance_desktop_default);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/appearance/Mobile.ts
preloadStyle$1(appearance_mobile_default);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/containers/window/native-window-chrome.ts
function readWco() {
	try {
		return globalThis.navigator?.windowControlsOverlay ?? null;
	} catch {
		return null;
	}
}
var cachedDisplayMode = null;
function matchDisplayMode() {
	if (cachedDisplayMode) return cachedDisplayMode;
	if (typeof globalThis.matchMedia !== "function") return "unknown";
	try {
		if (globalThis.matchMedia("(display-mode: window-controls-overlay)").matches) return cachedDisplayMode = "window-controls-overlay";
		if (globalThis.matchMedia("(display-mode: fullscreen)").matches) return cachedDisplayMode = "fullscreen";
		if (globalThis.matchMedia("(display-mode: standalone)").matches) return cachedDisplayMode = "standalone";
		if (globalThis.matchMedia("(display-mode: minimal-ui)").matches) return cachedDisplayMode = "minimal-ui";
		if (globalThis.matchMedia("(display-mode: browser)").matches) return cachedDisplayMode = "browser";
	} catch {}
	return cachedDisplayMode = "unknown";
}
function readTitlebarRect(wco) {
	if (!wco?.visible || typeof wco.getTitlebarAreaRect !== "function") return null;
	try {
		const r = wco.getTitlebarAreaRect();
		if (!r) return null;
		return {
			x: r.x,
			y: r.y,
			width: r.width,
			height: r.height
		};
	} catch {
		return null;
	}
}
/**
* Snapshot of native chrome capability for a host that requested `native-mode`.
*/
function probeNativeWindowChrome(requested) {
	const wco = readWco();
	const wcoVisible = Boolean(wco?.visible);
	const displayMode = matchDisplayMode();
	const isStandaloneLike = wcoVisible || displayMode === "standalone" || displayMode === "fullscreen" || displayMode === "window-controls-overlay" || displayMode === "minimal-ui";
	let surface = "off";
	if (requested) {
		if (wcoVisible) surface = "wco";
		else if (isStandaloneLike) surface = "standalone";
		else surface = "fallback";
	}
	return {
		requested,
		wcoVisible,
		displayMode,
		titlebarRect: readTitlebarRect(wco),
		isStandaloneLike,
		surface
	};
}
/**
* Subscribe to WCO + display-mode changes. Returns dispose.
*/
function subscribeNativeWindowChrome(options) {
	const emit = () => {
		cachedDisplayMode = null;
		options.onChange(probeNativeWindowChrome(options.getRequested()));
	};
	const mqs = [];
	if (typeof globalThis.matchMedia === "function") for (const q of [
		"(display-mode: window-controls-overlay)",
		"(display-mode: standalone)",
		"(display-mode: fullscreen)",
		"(display-mode: minimal-ui)",
		"(display-mode: browser)"
	]) try {
		mqs.push(globalThis.matchMedia(q));
	} catch {}
	const onMq = () => emit();
	for (const mq of mqs) try {
		mq.addEventListener?.("change", onMq);
	} catch {
		try {
			mq.addListener?.(onMq);
		} catch {}
	}
	const wco = readWco();
	const onGeo = () => emit();
	try {
		wco?.addEventListener?.("geometrychange", onGeo);
	} catch {}
	queueMicrotask(emit);
	return () => {
		for (const mq of mqs) try {
			mq.removeEventListener?.("change", onMq);
		} catch {
			try {
				mq.removeListener?.(onMq);
			} catch {}
		}
		try {
			wco?.removeEventListener?.("geometrychange", onGeo);
		} catch {}
	};
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/containers/window/native-theme-color.ts
/**
* WHY: Installed PWA / Window Controls Overlay paints the OS title strip from
* `<meta name="theme-color">`. While a managed `ui-window` is in native-mode
* (or fills the viewport), that meta must match **this window's** `.title-handler`.
*
* INVARIANT: while owned, this module owns `meta[name=theme-color]`
* (see `isNativeThemeColorOwned`). DynamicEngine must not overwrite with
* wallpaper / ambient `elementsFromPoint` samples.
*
* AI-READ: Never sample via `elementsFromPoint` — when the titlebar is thin or
* WCO-padded, hits fall through to the env wallpaper canvas.
*/
var themeColorBeforeNative = null;
var themeAttrWatch = null;
var metaContentWatch = null;
var paintProbe = null;
var ownedNativeHost = null;
/** Last hex we intentionally wrote — used to fight ambient overwrites. */
var lastAppliedHex = null;
/** PERF: one token resolve per theme; paintVarOnHost + getComputedStyle froze opens. */
var cachedSurfaceHex = null;
var themeSampleHandle = 0;
var themeSampleHost = null;
/** Warm light surface — matches `index.html` default (not VS Code blue). */
var FALLBACK_WARM = "#cbb8a4";
var OWNER_KEY = "__CWSP_NATIVE_THEME_COLOR_OWNED__";
/** VS Code / Chromium-default blues that must never stick under WCO. */
var isForbiddenThemeColor = (raw) => {
	const t = String(raw || "").trim().toLowerCase();
	if (!t) return false;
	if (t === "#007acc" || t === "#007accff") return true;
	if (t === "#36c" || t === "#3366cc") return true;
	const m = t.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);
	if (m && (t?.startsWith?.("#") || t?.startsWith?.("rgb"))) {
		const r = Math.round(Number(m[1]));
		const g = Math.round(Number(m[2]));
		const b = Math.round(Number(m[3]));
		if (r <= 20 && g >= 100 && g <= 140 && b >= 180 && b <= 220) return true;
	}
	return false;
};
/** True while a native immersive window drives theme-color. */
var isNativeThemeColorOwned = () => {
	try {
		return Boolean(globalThis?.[OWNER_KEY]);
	} catch {
		return false;
	}
};
var setOwned = (host) => {
	ownedNativeHost = host;
	try {
		globalThis[OWNER_KEY] = Boolean(host);
	} catch {}
};
/** True when a window chrome fills the viewport top (native or maximized). */
var isViewportCoveringWindow = (host) => {
	if (!host || !host.isConnected || host.hasAttribute("minimized")) return false;
	if (host.hasAttribute("native-mode")) return true;
	return host.hasAttribute("maximized") || host.hasAttribute("data-desk-max") || host.hasAttribute("data-mobile-max") || host.hasAttribute("data-native-active");
};
/** Prefer focused/native covering window for theme-color ownership. */
var findThemeColorOwnerWindow = () => {
	if (typeof document === "undefined") return null;
	if (ownedNativeHost?.isConnected && isViewportCoveringWindow(ownedNativeHost)) return ownedNativeHost;
	const natives = Array.from(document.querySelectorAll("ui-window[native-mode]:not([minimized])"));
	if (natives.length) return natives[natives.length - 1];
	const candidates = Array.from(document.querySelectorAll("ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])"));
	for (let i = candidates.length - 1; i >= 0; i--) {
		const el = candidates[i];
		if (isViewportCoveringWindow(el)) return el;
	}
	return null;
};
var ensureThemeAttrWatch = () => {
	if (themeAttrWatch || typeof MutationObserver === "undefined" || typeof document === "undefined") return;
	themeAttrWatch = new MutationObserver(() => {
		cachedSurfaceHex = null;
		const host = findThemeColorOwnerWindow();
		if (host?.isConnected) syncThemeColorFromNativeWindow(host);
		else syncAmbientThemeColor();
	});
	themeAttrWatch.observe(document.documentElement, {
		attributes: true,
		attributeFilter: [
			"data-theme",
			"class",
			"style",
			"color-scheme"
		]
	});
};
/** Fight DynamicEngine / wallpaper ambient writers while we own the meta. */
var ensureMetaContentWatch = (meta) => {
	if (metaContentWatch || typeof MutationObserver === "undefined") return;
	metaContentWatch = new MutationObserver(() => {
		if (!isNativeThemeColorOwned()) return;
		const cur = (meta.getAttribute("content") || "").toLowerCase();
		const expected = (lastAppliedHex || "").toLowerCase();
		if (expected && cur === expected && !isForbiddenThemeColor(cur)) return;
		const host = findThemeColorOwnerWindow();
		if (host) syncThemeColorFromNativeWindow(host);
		else if (isForbiddenThemeColor(cur)) applyMetaHex(FALLBACK_WARM, true);
	});
	metaContentWatch.observe(meta, {
		attributes: true,
		attributeFilter: ["content"]
	});
};
/** Resolve any CSS color (oklch / color-mix / var-resolved) to opaque #rrggbb via canvas. */
var resolveCssColorToHex = (css) => {
	const t = String(css || "").trim();
	if (!t || t === "transparent" || t === "rgba(0, 0, 0, 0)") return null;
	const hexMatch = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
	if (hexMatch) {
		let h = hexMatch[1];
		if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
		else if (h.length === 8) h = h.slice(0, 6);
		const hex = `#${h.toLowerCase()}`;
		return isForbiddenThemeColor(hex) ? null : hex;
	}
	const m = t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
	if (m) {
		const alpha = m[4] !== void 0 ? Number(m[4]) : 1;
		if (!Number.isFinite(alpha) || alpha < .5) return null;
		const hex = `#${[
			Math.max(0, Math.min(255, Math.round(Number(m[1])))),
			Math.max(0, Math.min(255, Math.round(Number(m[2])))),
			Math.max(0, Math.min(255, Math.round(Number(m[3]))))
		].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
		return isForbiddenThemeColor(hex) ? null : hex;
	}
	const m2 = t.match(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
	if (m2) {
		let alpha = 1;
		if (m2[4] !== void 0) alpha = String(m2[4]).endsWith("%") ? Number(m2[4]) / 100 : Number(m2[4]);
		if (!Number.isFinite(alpha) || alpha < .5) return null;
		const hex = `#${[
			Math.max(0, Math.min(255, Math.round(Number(m2[1])))),
			Math.max(0, Math.min(255, Math.round(Number(m2[2])))),
			Math.max(0, Math.min(255, Math.round(Number(m2[3]))))
		].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
		return isForbiddenThemeColor(hex) ? null : hex;
	}
	try {
		if (typeof document === "undefined") return null;
		if (!paintProbe) {
			paintProbe = document.createElement("canvas");
			paintProbe.width = 1;
			paintProbe.height = 1;
		}
		const ctx = paintProbe.getContext("2d", { willReadFrequently: true });
		if (!ctx) return null;
		ctx.fillStyle = "#000000";
		ctx.fillStyle = t;
		const resolved = String(ctx.fillStyle || "");
		if (resolved.startsWith("#") && resolved.length >= 7) {
			const hex = resolved.slice(0, 7).toLowerCase();
			return isForbiddenThemeColor(hex) ? null : hex;
		}
		return resolveCssColorToHex(resolved);
	} catch {
		return null;
	}
};
var ensureThemeColorMeta = () => {
	if (typeof document === "undefined") return null;
	let meta = document.querySelector("meta[data-theme-color]") || document.querySelector("meta[name=\"theme-color\"]");
	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute("name", "theme-color");
		meta.setAttribute("data-theme-color", "");
		document.head?.appendChild(meta);
	}
	try {
		const all = Array.from(document.querySelectorAll("meta[name=\"theme-color\"]"));
		for (const extra of all) {
			if (extra === meta) continue;
			extra.remove();
		}
	} catch {}
	ensureMetaContentWatch(meta);
	return meta;
};
var paintVarOnHost = (host, cssBackground) => {
	try {
		const probe = document.createElement("div");
		probe.setAttribute("data-theme-color-probe", "true");
		probe.style.cssText = `position:fixed;left:-8px;top:-8px;inline-size:4px;block-size:4px;pointer-events:none;opacity:0;background:${cssBackground}`;
		host.appendChild(probe);
		const hex = resolveCssColorToHex(getComputedStyle(probe).backgroundColor);
		probe.remove();
		return hex;
	} catch {
		return null;
	}
};
/** Resolve `--color-surface-container` once — later opens reuse the hex. */
var surfaceTokenHex = () => {
	if (cachedSurfaceHex) return cachedSurfaceHex;
	try {
		cachedSurfaceHex = resolveCssColorToHex(getComputedStyle(document.documentElement).getPropertyValue("--color-surface-container").trim()) || paintVarOnHost(document.documentElement, "var(--color-surface-container, Canvas)") || FALLBACK_WARM;
	} catch {
		cachedSurfaceHex = FALLBACK_WARM;
	}
	return cachedSurfaceHex;
};
/**
* Sample the window titlebar — CSS only.
* WHY: never `elementsFromPoint` — hits fall through to wallpaper under WCO / thin bars.
*/
var sampleTitlebarHex = (host) => {
	const body = host.querySelector(".env-ui-window__body");
	const chrome = body?.querySelector(".settings-screen__top, .view-settings, .view-explorer, .cw-view-viewer-shell") || body;
	if (chrome) {
		const fromChrome = resolveCssColorToHex(getComputedStyle(chrome).backgroundColor);
		if (fromChrome) return fromChrome;
	}
	return surfaceTokenHex();
};
var applyMetaHex = (hex, forceReinsert = false) => {
	const meta = ensureThemeColorMeta();
	if (!meta || !hex) return;
	let next = hex.toLowerCase();
	if (isForbiddenThemeColor(next)) next = FALLBACK_WARM;
	const prev = (meta.getAttribute("content") || "").toLowerCase();
	if (prev === next && !forceReinsert && !isForbiddenThemeColor(prev)) return;
	meta.setAttribute("content", next);
	meta.setAttribute("data-theme-color", "");
	meta.removeAttribute("media");
	lastAppliedHex = next;
	if (forceReinsert || prev !== next || isForbiddenThemeColor(prev)) try {
		const parent = meta.parentNode || document.head;
		parent?.removeChild(meta);
		parent?.appendChild(meta);
	} catch {}
};
/** Sample page surface for ambient WCO (desktop with no covering window). */
var syncAmbientThemeColor = () => {
	if (typeof document === "undefined") return;
	if (findThemeColorOwnerWindow()) return;
	setOwned(null);
	lastAppliedHex = null;
	const meta = ensureThemeColorMeta();
	if (!meta) return;
	const root = document.documentElement;
	const cs = getComputedStyle(root);
	const bodyCs = document.body ? getComputedStyle(document.body) : null;
	const hex = resolveCssColorToHex(cs.getPropertyValue("--color-surface-container").trim()) || resolveCssColorToHex(cs.getPropertyValue("--color-surface").trim()) || resolveCssColorToHex(cs.getPropertyValue("--ui-win-titlebar-bg").trim()) || (bodyCs ? resolveCssColorToHex(bodyCs.backgroundColor) : null) || resolveCssColorToHex(cs.backgroundColor);
	if (hex) applyMetaHex(hex);
	else if (isForbiddenThemeColor(String(meta.getAttribute("content") || ""))) applyMetaHex(FALLBACK_WARM, true);
	ensureThemeAttrWatch();
};
var isMaxChrome = (host) => host.hasAttribute("maximized") || host.hasAttribute("data-desk-max") || host.hasAttribute("data-mobile-max") || host.hasAttribute("data-native-active");
var cancelThemeSample = () => {
	if (!themeSampleHandle) return;
	if (typeof cancelIdleCallback === "function") try {
		cancelIdleCallback(themeSampleHandle);
	} catch {
		clearTimeout(themeSampleHandle);
	}
	else clearTimeout(themeSampleHandle);
	themeSampleHandle = 0;
	themeSampleHost = null;
};
var scheduleThemeSample = (host) => {
	themeSampleHost = host;
	if (themeSampleHandle) return;
	const run = () => {
		themeSampleHandle = 0;
		const h = themeSampleHost;
		themeSampleHost = null;
		if (!h?.isConnected) return;
		if (h.hasAttribute("minimized")) return;
		if (!h.hasAttribute("native-mode") && !isMaxChrome(h)) return;
		applyMetaHex(sampleTitlebarHex(h) || FALLBACK_WARM, false);
		ensureThemeAttrWatch();
	};
	if (typeof requestIdleCallback === "function") themeSampleHandle = requestIdleCallback(run, { timeout: 120 });
	else themeSampleHandle = setTimeout(run, 0);
};
/** Push **this** window's titlebar fill into meta theme-color (native or viewport-covering). */
var syncThemeColorFromNativeWindow = (host) => {
	if (!host || typeof document === "undefined") return;
	if (host.hasAttribute("minimized")) return;
	if (!host.hasAttribute("native-mode") && !isMaxChrome(host) && !isViewportCoveringWindow(host)) return;
	const meta = ensureThemeColorMeta();
	if (!meta) return;
	if (themeColorBeforeNative == null) {
		const prev = meta.getAttribute("content") || "";
		themeColorBeforeNative = isForbiddenThemeColor(prev) ? "" : prev;
	}
	setOwned(host);
	if (isForbiddenThemeColor(String(meta.getAttribute("content") || ""))) applyMetaHex(FALLBACK_WARM, false);
	if (lastAppliedHex && !isForbiddenThemeColor(lastAppliedHex)) {
		applyMetaHex(lastAppliedHex, false);
		ensureThemeAttrWatch();
		return;
	}
	scheduleThemeSample(host);
};
/**
* Restore ambient theme-color when no covering/native windows remain.
* If another owner window is still up, re-sample from that host.
*/
var restoreThemeColorAfterNativeWindow = (exitingHost) => {
	if (typeof document === "undefined") return;
	if (!document.querySelector("meta[name=\"theme-color\"]")) return;
	const other = findThemeColorOwnerWindow();
	if (other && other !== exitingHost) {
		syncThemeColorFromNativeWindow(other);
		return;
	}
	const peers = Array.from(document.querySelectorAll("ui-window[native-mode]:not([minimized]), ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])")).filter((el) => el !== exitingHost && isViewportCoveringWindow(el));
	if (peers.length) {
		syncThemeColorFromNativeWindow(peers[peers.length - 1]);
		return;
	}
	setOwned(null);
	lastAppliedHex = null;
	cancelThemeSample();
	if (themeColorBeforeNative != null && themeColorBeforeNative && !isForbiddenThemeColor(themeColorBeforeNative)) {
		applyMetaHex(themeColorBeforeNative, true);
		themeColorBeforeNative = null;
	} else {
		themeColorBeforeNative = null;
		syncAmbientThemeColor();
	}
};
if (typeof document !== "undefined") queueMicrotask(() => {
	try {
		syncAmbientThemeColor();
	} catch {}
});
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/containers/window/Windows2.ts
var styled = preloadStyle$1(window_default);
/** Phosphor names (duotone registry): minimize / maximize / restore / close. */
var ICON_MINIMIZE = "minus";
var ICON_MAXIMIZE = "corners-out";
var ICON_RESTORE = "corners-in";
var ICON_CLOSE = "x";
var DRAG_MIN = Object.freeze({
	w: 240,
	h: 160
});
var Windows2 = class Windows2 extends UIElement {
	titleHandler;
	contentHandler;
	footerHandler;
	resizer;
	/** Cumulative drag offset in CSS pixels (unmanaged / standalone mode). */
	#ox = numberRef$1(0);
	#oy = numberRef$1(0);
	#dragUnbind = null;
	#resizeUnbind = null;
	#focusUnbind = null;
	#controlsUnbind = null;
	#controlsMo = null;
	#nativeUnbind = null;
	#attrObserver = null;
	#controlsReady = false;
	#wireAttempts = 0;
	#lastChromeActionAt = 0;
	#lastNativeProbe = null;
	#footerSlotUnbind = null;
	#lastThemeCover = null;
	styles = function() {
		return styled;
	};
	render = function() {
		return H`<div class="window-container" part="window-container">
            <header class="title-handler" part="title-handler">
                <div class="title-handler-main" part="title">
                    <slot name="title"></slot>
                </div>
                <div class="title-handler-actions" part="actions">
                    <slot name="actions"></slot>
                </div>
                <div class="title-handler-buttons" part="controls" data-no-drag>
                    <button class="title-minimize" type="button" aria-label="Minimize" title="Minimize" data-no-drag data-ui-win-action="minimize">
                        <ui-icon icon=${ICON_MINIMIZE}></ui-icon>
                    </button>
                    <button class="title-maximize" type="button" aria-label="Maximize" title="Maximize" data-no-drag data-ui-win-action="maximize">
                        <ui-icon icon=${ICON_MAXIMIZE}></ui-icon>
                    </button>
                    <button
                        class="title-exit-native"
                        type="button"
                        aria-label="Exit native"
                        title="Exit native"
                        data-no-drag
                        data-ui-win-action="exit-native"
                        hidden
                    >
                        <ui-icon icon=${ICON_RESTORE}></ui-icon>
                    </button>
                    <button class="title-close" type="button" aria-label="Close" title="Close" data-no-drag data-ui-win-action="close">
                        <ui-icon icon=${ICON_CLOSE}></ui-icon>
                    </button>
                </div>
            </header>
            <div class="content-handler" part="content-handler" style="container-type: size;">
                <slot name="content"></slot>
                <slot></slot>
            </div>
            <footer class="footer-handler" part="footer-handler">
                <slot name="footer"></slot>
            </footer>
            <div class="window-resizer" part="resizer" aria-hidden="true" data-no-drag></div>
        </div>`;
	};
	constructor() {
		super();
	}
	/** Shell-driven chrome: position/size come from host CSS, not transform. */
	get managed() {
		return this.hasAttribute("managed");
	}
	/** Host requested mono/task native chrome (WCO / standalone / fallback full-bleed). */
	get nativeMode() {
		return this.hasAttribute("native-mode");
	}
	set nativeMode(value) {
		this.toggleAttribute("native-mode", Boolean(value));
		this.#syncNativeChrome();
	}
	get nativeSurface() {
		return this.#lastNativeProbe?.surface ?? (this.nativeMode ? "fallback" : "off");
	}
	onInitialize() {
		super.onInitialize();
	}
	onRender() {
		super.onRender();
		this.#scheduleChromeWire();
	}
	connectedCallback() {
		super.connectedCallback?.();
		this.#scheduleChromeWire();
		this.#bindNativeChrome();
	}
	disconnectedCallback() {
		queueMicrotask(() => {
			if (this.isConnected) return;
			this.#nativeUnbind?.();
			this.#nativeUnbind = null;
			this.#attrObserver?.disconnect();
			this.#attrObserver = null;
			this.#controlsMo?.disconnect();
			this.#controlsMo = null;
			this.#controlsUnbind?.();
			this.#controlsUnbind = null;
			this.#controlsReady = false;
			this.#wireAttempts = 0;
			this.#focusUnbind?.();
			this.#focusUnbind = null;
			this.#dragUnbind?.();
			this.#dragUnbind = null;
			this.#resizeUnbind?.();
			this.#resizeUnbind = null;
			this.#footerSlotUnbind?.();
			this.#footerSlotUnbind = null;
			this.#lastThemeCover = null;
			super.disconnectedCallback?.();
		});
	}
	#scheduleChromeWire() {
		const run = () => {
			this.#wireControls();
			this.#wireFocus();
			if (!this.#dragUnbind) this.#wireDrag();
			if (!this.#resizeUnbind) this.#wireResize();
			this.#bindEmptyFooter();
			if (this.#controlsReady) return;
			if (this.#wireAttempts++ < 12) requestAnimationFrame(run);
		};
		queueMicrotask(run);
	}
	/**
	* WHY: `<footer><slot name="footer"></slot></footer>` is never `:empty`, so unused
	* chrome painted a 2.25rem slab under Settings / Explorer.
	*/
	#bindEmptyFooter() {
		if (this.#footerSlotUnbind) {
			this.#syncEmptyFooter();
			return;
		}
		const slot = this.shadowRoot?.querySelector?.("slot[name=\"footer\"]");
		if (!(slot instanceof HTMLSlotElement)) return;
		const onChange = () => this.#syncEmptyFooter();
		slot.addEventListener("slotchange", onChange);
		this.#footerSlotUnbind = () => slot.removeEventListener("slotchange", onChange);
		this.#syncEmptyFooter();
	}
	#syncEmptyFooter() {
		const slot = this.shadowRoot?.querySelector?.("slot[name=\"footer\"]");
		const footer = this.shadowRoot?.querySelector?.(".footer-handler");
		if (!(slot instanceof HTMLSlotElement) || !(footer instanceof HTMLElement)) return;
		const empty = !slot.assignedNodes({ flatten: true }).some((node) => {
			if (node.nodeType === Node.ELEMENT_NODE) return true;
			return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
		});
		footer.toggleAttribute("data-empty", empty);
		footer.hidden = empty;
	}
	#bindNativeChrome() {
		if (this.#nativeUnbind) return;
		this.#nativeUnbind = subscribeNativeWindowChrome({
			getRequested: () => this.nativeMode,
			onChange: (probe) => this.#applyNativeProbe(probe)
		});
		if (typeof MutationObserver !== "undefined" && !this.#attrObserver) {
			this.#attrObserver = new MutationObserver((records) => {
				let native = false;
				let maxIcon = false;
				for (const r of records) {
					if (r.attributeName === "native-mode") native = true;
					if (r.attributeName === "maximized" || r.attributeName === "data-desk-max" || r.attributeName === "data-mobile-max") maxIcon = true;
				}
				if (native || maxIcon) this.#syncNativeChrome();
				if (maxIcon) this.#syncMaximizeIcon();
			});
			this.#attrObserver.observe(this, {
				attributes: true,
				attributeFilter: [
					"native-mode",
					"maximized",
					"data-desk-max",
					"data-mobile-max"
				]
			});
		}
	}
	#syncNativeChrome() {
		this.#applyNativeProbe(probeNativeWindowChrome(this.nativeMode));
	}
	#applyNativeProbe(probe) {
		const covers = this.nativeMode || this.hasAttribute("data-desk-max") || this.hasAttribute("maximized") || this.hasAttribute("data-mobile-max");
		if (this.#lastNativeProbe?.surface === probe.surface && this.#lastThemeCover === covers && this.#dragUnbind) {
			this.#lastNativeProbe = probe;
			return;
		}
		this.#lastNativeProbe = probe;
		const host = this;
		host.toggleAttribute("data-native-wco", probe.surface === "wco");
		host.toggleAttribute("data-native-standalone", probe.surface === "standalone");
		host.toggleAttribute("data-native-fallback", probe.surface === "fallback");
		host.toggleAttribute("data-native-active", probe.surface !== "off");
		this.#syncExitNativeButton(probe.surface);
		if (probe.titlebarRect) {
			host.style.setProperty("--ui-win-titlebar-area-x", `${probe.titlebarRect.x}px`);
			host.style.setProperty("--ui-win-titlebar-area-y", `${probe.titlebarRect.y}px`);
			host.style.setProperty("--ui-win-titlebar-area-width", `${probe.titlebarRect.width}px`);
			host.style.setProperty("--ui-win-titlebar-area-height", `${probe.titlebarRect.height}px`);
		} else {
			host.style.removeProperty("--ui-win-titlebar-area-x");
			host.style.removeProperty("--ui-win-titlebar-area-y");
			host.style.removeProperty("--ui-win-titlebar-area-width");
			host.style.removeProperty("--ui-win-titlebar-area-height");
		}
		this.#dragUnbind?.();
		this.#dragUnbind = null;
		this.#resizeUnbind?.();
		this.#resizeUnbind = null;
		this.#wireDrag();
		this.#wireResize();
		this.#syncMaximizeIcon();
		if (covers !== this.#lastThemeCover) {
			this.#lastThemeCover = covers;
			if (covers) syncThemeColorFromNativeWindow(this);
			else {
				restoreThemeColorAfterNativeWindow(this);
				syncAmbientThemeColor();
			}
		}
		this.dispatchEvent(new CustomEvent("window-native-change", {
			bubbles: true,
			composed: true,
			detail: probe
		}));
	}
	/** Standalone-only control; `hidden` must win over button `display: inline-flex`. */
	#syncExitNativeButton(surface = this.nativeSurface) {
		const exitBtn = this.shadowRoot?.querySelector(".title-exit-native");
		if (exitBtn) exitBtn.hidden = surface !== "standalone";
	}
	/**
	* INVARIANT: one glyph on maximize — corners-out (max) or corners-in (restore).
	* NOTE: native fallback stays corners-out (maximize = exit native, not restore-down).
	*/
	#syncMaximizeIcon() {
		const btn = this.shadowRoot?.querySelector(".title-maximize");
		const icon = btn?.querySelector("ui-icon");
		if (!btn || !icon) return;
		const restoredLook = !(this.nativeMode && this.nativeSurface === "fallback") && (this.hasAttribute("maximized") || this.hasAttribute("data-desk-max") || this.hasAttribute("data-mobile-max"));
		const name = restoredLook ? ICON_RESTORE : ICON_MAXIMIZE;
		const label = restoredLook ? "Restore" : "Maximize";
		if (icon.getAttribute("icon") !== name) icon.setAttribute("icon", name);
		btn.setAttribute("aria-label", label);
		btn.setAttribute("title", label);
	}
	/** Apply absolute bounds (managed shells / workspace layer). */
	applyBounds(bounds) {
		const el = this;
		el.style.position = "absolute";
		if (typeof bounds.x === "number") el.style.left = `${bounds.x}px`;
		if (typeof bounds.y === "number") el.style.top = `${bounds.y}px`;
		if (typeof bounds.w === "number") {
			el.style.width = `${bounds.w}px`;
			el.style.setProperty("--ui-win-width", `${bounds.w}px`);
		}
		if (typeof bounds.h === "number") {
			el.style.height = `${bounds.h}px`;
			el.style.setProperty("--ui-win-height", `${bounds.h}px`);
		}
		if (typeof bounds.z === "number") el.style.zIndex = String(bounds.z);
		el.style.right = "";
		el.style.bottom = "";
		if (this.managed) {
			this.#ox.value = 0;
			this.#oy.value = 0;
			el.style.transform = "";
		}
	}
	setVisible(visible) {
		this.toggleAttribute("hidden-window", !visible);
		this.style.visibility = visible ? "" : "hidden";
		this.style.pointerEvents = visible ? "" : "none";
	}
	get isMaximized() {
		return this.hasAttribute("maximized") || this.hasAttribute("data-desk-max") || this.hasAttribute("data-mobile-max");
	}
	get isMinimized() {
		return this.hasAttribute("minimized");
	}
	/** True when CSS window-drag owns titlebar (WCO / installed standalone). */
	get usesNativeWindowDrag() {
		const s = this.nativeSurface;
		return s === "wco" || s === "standalone";
	}
	/**
	* Enter/exit native-mode. Managed hosts should listen for `window-native` /
	* `window-exit-native` instead of mutating attrs directly when preferred.
	*/
	enterNativeMode() {
		if (this.managed) {
			this.#emitChrome("window-native");
			return;
		}
		this.nativeMode = true;
		this.#emitChrome("window-native");
	}
	exitNativeMode() {
		if (this.managed) {
			this.#emitChrome("window-exit-native");
			return;
		}
		this.nativeMode = false;
		this.#emitChrome("window-exit-native");
	}
	#emitChrome(name, cancelable = false) {
		return this.dispatchEvent(new CustomEvent(name, {
			bubbles: true,
			composed: true,
			cancelable
		}));
	}
	/**
	* WHY (managed): only emit intent — environment-shell owns attrs via applyChrome.
	*/
	toggleMaximize() {
		const restoring = this.isMaximized;
		if (this.managed) {
			this.#emitChrome(restoring ? "window-restore" : "window-maximize");
			return;
		}
		const next = !restoring;
		this.toggleAttribute("maximized", next);
		if (next) this.removeAttribute("minimized");
		this.#syncMaximizeIcon();
		this.#emitChrome(next ? "window-maximize" : "window-restore");
	}
	toggleMinimize() {
		if (this.managed) {
			this.#emitChrome(this.isMinimized ? "window-restore" : "window-minimize");
			return;
		}
		const next = !this.isMinimized;
		this.toggleAttribute("minimized", next);
		if (next) this.removeAttribute("maximized");
		this.#emitChrome(next ? "window-minimize" : "window-restore");
	}
	restoreWindow() {
		if (this.managed) {
			this.#emitChrome("window-restore");
			return;
		}
		const wasMin = this.isMinimized;
		const wasMax = this.isMaximized;
		this.removeAttribute("minimized");
		this.removeAttribute("maximized");
		if (wasMin || wasMax) this.#emitChrome("window-restore");
	}
	closeWindow() {
		this.#emitChrome("window-close", true);
		if (this.isConnected) this.remove();
	}
	#wireFocus() {
		if (this.#focusUnbind) return;
		this.#focusUnbind = addEvent(this, "pointerdown", () => {
			this.requestFocus();
		}, {
			capture: true,
			passive: true
		});
	}
	requestFocus() {
		this.dispatchEvent(new CustomEvent("window-focus", {
			bubbles: true,
			composed: true
		}));
	}
	bringToFront(z) {
		const el = this;
		if (Number.isFinite(z)) el.style.zIndex = String(z);
		el.toggleAttribute("data-focused", true);
	}
	clearFocused() {
		this.toggleAttribute("data-focused", false);
	}
	/** Resolve control hit from composedPath / data-ui-win-action (ui-icon retargeting). */
	#hitControl(ev) {
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		for (const n of path) {
			if (!(n instanceof Element)) continue;
			const action = n.getAttribute?.("data-ui-win-action");
			if (action === "close" || action === "exit-native" || action === "maximize" || action === "minimize") return action;
			if (n.matches?.(".title-close")) return "close";
			if (n.matches?.(".title-exit-native")) return "exit-native";
			if (n.matches?.(".title-maximize")) return "maximize";
			if (n.matches?.(".title-minimize")) return "minimize";
		}
		const t = ev.target;
		if (t instanceof Element) {
			const el = t.closest?.("[data-ui-win-action], .title-close, .title-exit-native, .title-maximize, .title-minimize") ?? null;
			if (!el) return null;
			const action = el.getAttribute("data-ui-win-action");
			if (action === "close" || action === "exit-native" || action === "maximize" || action === "minimize") return action;
			if (el.classList.contains("title-close")) return "close";
			if (el.classList.contains("title-exit-native")) return "exit-native";
			if (el.classList.contains("title-maximize")) return "maximize";
			if (el.classList.contains("title-minimize")) return "minimize";
		}
		return null;
	}
	/** Debounce pointerup+click (and dual host/button listeners) within one gesture. */
	#consumeChromeAction() {
		const now = typeof performance !== "undefined" ? performance.now() : Date.now();
		if (now - this.#lastChromeActionAt < 280) return false;
		this.#lastChromeActionAt = now;
		return true;
	}
	#runChromeAction(which) {
		if (which === "close") this.closeWindow();
		else if (which === "exit-native") this.exitNativeMode();
		else if (which === "maximize") {
			if (this.nativeMode && this.nativeSurface === "fallback") this.exitNativeMode();
			else this.toggleMaximize();
		} else this.toggleMinimize();
	}
	#handleControlEvent(ev) {
		const which = this.#hitControl(ev);
		if (!which) return false;
		ev.preventDefault();
		ev.stopPropagation();
		ev.stopImmediatePropagation?.();
		if (!this.#consumeChromeAction()) return true;
		this.#runChromeAction(which);
		return true;
	}
	/**
	* WHY (radical): H/lure can replace shadow buttons and kill addEventListener bindings.
	* Assign `onclick` / `onpointerup` properties on the live nodes and re-stamp after every
	* shadow mutation. Delegation on shadowRoot + host remains as a safety net.
	*/
	#bindControlButtonProps() {
		const root = this.shadowRoot;
		if (!root) return;
		for (const [which, sel] of [
			["minimize", ".title-minimize"],
			["maximize", ".title-maximize"],
			["close", ".title-close"],
			["exit-native", ".title-exit-native"]
		]) {
			const btn = root.querySelector(sel);
			if (!btn) continue;
			btn.setAttribute("data-ui-win-action", which);
			const run = (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				ev.stopImmediatePropagation?.();
				if (!this.#consumeChromeAction()) return;
				this.#runChromeAction(which);
			};
			btn.onclick = run;
			btn.onpointerup = (ev) => {
				if (ev.button !== 0) return;
				run(ev);
			};
		}
	}
	#wireControls() {
		const root = this.shadowRoot;
		if (!root) return;
		const fromTitle = this.titleHandler;
		const titleBar = fromTitle instanceof HTMLElement ? fromTitle : root.querySelector(".title-handler");
		const buttons = root.querySelector(".title-handler-buttons");
		if (!titleBar || !buttons) return;
		this.#bindControlButtonProps();
		if (this.#controlsReady) {
			this.#syncExitNativeButton();
			this.#syncMaximizeIcon();
			return;
		}
		const onDelegated = (ev) => {
			this.#handleControlEvent(ev);
		};
		const onDbl = (ev) => {
			if (this.#hitControl(ev)) return;
			if (!(typeof ev.composedPath === "function" ? ev.composedPath() : []).some((n) => n instanceof Element && n.classList?.contains("title-handler"))) return;
			if (ev.target?.closest?.("button, a, input, textarea, select, [data-no-drag]")) return;
			ev.preventDefault();
			if (!this.#consumeChromeAction()) return;
			this.toggleMaximize();
		};
		const offShadowClick = addEvent(root, "click", onDelegated, { capture: true });
		const offShadowPtr = addEvent(root, "pointerup", onDelegated, { capture: true });
		const offHostClick = addEvent(this, "click", onDelegated, { capture: true });
		const offHostPtr = addEvent(this, "pointerup", onDelegated, { capture: true });
		const offHostDbl = addEvent(this, "dblclick", onDbl, { capture: true });
		if (typeof MutationObserver !== "undefined" && !this.#controlsMo) {
			this.#controlsMo = new MutationObserver(() => {
				this.#bindControlButtonProps();
				this.#syncExitNativeButton();
				this.#syncMaximizeIcon();
			});
			this.#controlsMo.observe(buttons, {
				childList: true,
				subtree: true
			});
		}
		this.#controlsUnbind = () => {
			offShadowClick?.();
			offShadowPtr?.();
			offHostClick?.();
			offHostPtr?.();
			offHostDbl?.();
			this.#controlsMo?.disconnect();
			this.#controlsMo = null;
			this.#controlsUnbind = null;
			this.#controlsReady = false;
		};
		this.#controlsReady = true;
		this.#syncExitNativeButton();
		this.#syncMaximizeIcon();
	}
	#wireDrag() {
		const root = this.shadowRoot ?? this;
		const fromProp = this.titleHandler;
		const bar = fromProp instanceof HTMLElement ? fromProp : root.querySelector?.(".title-handler");
		if (!bar || this.#dragUnbind) return;
		if (this.usesNativeWindowDrag) {
			this.#dragUnbind = () => {
				this.#dragUnbind = null;
			};
			return;
		}
		if (!this.managed) bindStyle(this, S`transform: translate(${this.#ox}px, ${this.#oy}px)`);
		const DRAG_THRESHOLD_PX = 4;
		const pointerMap = /* @__PURE__ */ new Map();
		const offDown = addEvent(bar, "pointerdown", (ev) => {
			if (ev.button !== 0) return;
			if (this.#hitControl(ev)) return;
			if (ev.target?.closest("button, a, input, textarea, select, [data-no-drag]")) return;
			if (this.isMaximized || this.isMinimized || this.nativeMode) return;
			this.requestFocus();
			const host = this;
			pointerMap.set(ev.pointerId, {
				sx: ev.clientX,
				sy: ev.clientY,
				ox: this.#ox.value,
				oy: this.#oy.value,
				bx: Number.parseFloat(host.style.left || "0") || 0,
				by: Number.parseFloat(host.style.top || "0") || 0,
				dragging: false
			});
			const offMove = addEvent(document.body, "pointermove", (ev) => {
				const p = pointerMap.get(ev.pointerId);
				if (!p) return;
				const dx = ev.clientX - p.sx;
				const dy = ev.clientY - p.sy;
				if (!p.dragging) {
					if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
					p.dragging = true;
					try {
						ev.preventDefault();
					} catch {}
					this.setPointerCapture?.(ev.pointerId);
				}
				if (this.managed) {
					this.dispatchEvent(new CustomEvent("window-move", {
						bubbles: true,
						composed: true,
						detail: {
							x: p.bx + dx,
							y: p.by + dy,
							dx,
							dy
						}
					}));
					return;
				}
				this.#ox.value = p.ox + dx;
				this.#oy.value = p.oy + dy;
			});
			const end = (ev) => {
				if (!pointerMap.has(ev.pointerId)) return;
				const p = pointerMap.get(ev.pointerId);
				pointerMap.delete(ev.pointerId);
				if (p?.dragging) try {
					this.releasePointerCapture?.(ev.pointerId);
				} catch {}
				offMove?.();
				offUp?.();
				offCancel?.();
			};
			const offUp = addEvent(document.body, "pointerup", end);
			const offCancel = addEvent(document.body, "pointercancel", end);
		});
		this.#dragUnbind = () => {
			offDown?.();
		};
	}
	#wireResize() {
		const root = this.shadowRoot ?? this;
		const fromProp = this.resizer;
		const grip = fromProp instanceof HTMLElement ? fromProp : root.querySelector?.(".window-resizer");
		if (!grip || this.#resizeUnbind) return;
		const pointerMap = /* @__PURE__ */ new Map();
		const offDown = addEvent(grip, "pointerdown", (ev) => {
			if (ev.button !== 0) return;
			if (this.isMaximized || this.isMinimized || this.nativeMode) return;
			ev.preventDefault();
			ev.stopPropagation();
			this.requestFocus();
			this.setPointerCapture?.(ev.pointerId);
			const rect = this.getBoundingClientRect();
			pointerMap.set(ev.pointerId, {
				sx: ev.clientX,
				sy: ev.clientY,
				w: rect.width,
				h: rect.height
			});
			const offMove = addEvent(document.body, "pointermove", (ev) => {
				const p = pointerMap.get(ev.pointerId);
				if (!p) return;
				const w = Math.max(DRAG_MIN.w, p.w + (ev.clientX - p.sx));
				const h = Math.max(DRAG_MIN.h, p.h + (ev.clientY - p.sy));
				if (this.managed) {
					this.dispatchEvent(new CustomEvent("window-resize", {
						bubbles: true,
						composed: true,
						detail: {
							w,
							h
						}
					}));
					return;
				}
				this.style.width = `${w}px`;
				this.style.height = `${h}px`;
				this.style.setProperty("--ui-win-width", `${w}px`);
				this.style.setProperty("--ui-win-height", `${h}px`);
			});
			const end = (ev) => {
				if (!pointerMap.has(ev.pointerId)) return;
				pointerMap.delete(ev.pointerId);
				try {
					this.releasePointerCapture?.(ev.pointerId);
				} catch {}
				offMove?.();
				offUp?.();
				offCancel?.();
			};
			const offUp = addEvent(document.body, "pointerup", end);
			const offCancel = addEvent(document.body, "pointercancel", end);
		});
		this.#resizeUnbind = () => {
			offDown?.();
		};
	}
};
__decorate([property({
	source: "query-shadow",
	name: ".title-handler"
})], Windows2.prototype, "titleHandler", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".content-handler"
})], Windows2.prototype, "contentHandler", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".footer-handler"
})], Windows2.prototype, "footerHandler", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".window-resizer"
})], Windows2.prototype, "resizer", void 0);
Windows2 = __decorate([defineElement("ui-window")], Windows2);
[
	"button:not([disabled])",
	"[href]",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex='-1'])"
].join(",");
//#endregion
//#region ../../modules/projects/fl.ui/src/index.ts
var _config = {
	loadStyles: true,
	includeGlobalNativeControlStyles: false,
	styleVariant: "veela-basic"
};
/**
* Get current fl.ui configuration
*/
function getFlUIConfig() {
	return { ..._config };
}
(async () => {
	const cfg = getFlUIConfig();
	if (cfg.loadStyles === false) return;
	await loader({ includeGlobalNativeControls: cfg.includeGlobalNativeControlStyles === true });
})()?.catch?.(() => void 0);
//#endregion
export { switchWorkspacePage as i, getActiveWorkspaceId as n, listWorkspacePages as r, WORKSPACE_PAGE_EVENT as t };
