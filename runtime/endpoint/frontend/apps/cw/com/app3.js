import { r as __exportAll } from "../chunks/rolldown-runtime.js";
//#region ../../modules/projects/fl.ui/src/ui/explorer/fs-backend.ts
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
function faviconForHref(href) {
	const raw = String(href || "").trim();
	if (!raw) return "";
	if (!/^https?:\/\//i.test(raw)) return "";
	try {
		const host = new URL(raw).hostname;
		if (!host) return "";
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
	} catch {
		return "";
	}
}
/**
* Drag payload for Explorer → Speed Dial / browser drops.
*
* WHY: rows used to set `text/plain` to a virtual path (`/bookmarks/10`). Speed
* Dial's last-resort parser `JSON.parse`s that string and throws. URL bookmarks
* must travel as http(s) `text/uri-list`; folders travel as a JSON shortcut
* envelope (`open-path` + `path` + label) so the dial keeps the bookmark title.
*/
function buildExplorerDragPayload(item, currentPath) {
	const href = String(item?.href || "").trim();
	const itemPath = String(item?.path || "").trim();
	const base = String(currentPath || "/");
	const name = String(item?.name || "").trim();
	const abs = itemPath || `${base.endsWith("/") ? base : `${base}/`}${name}`;
	const isUrl = /^https?:\/\//i.test(href);
	const action = isUrl ? "open-link" : "open-path";
	const label = name || href || abs;
	const envelope = {
		state: {
			icon: isUrl ? "link" : item?.kind === "directory" ? "folder" : "file",
			label,
			action
		},
		desc: {
			action,
			href: isUrl ? href : "",
			path: abs,
			kind: item?.kind || (isUrl ? "file" : "directory")
		}
	};
	const json = JSON.stringify(envelope);
	return {
		href,
		path: abs,
		json,
		uriList: isUrl ? href : abs,
		plain: isUrl ? href : json
	};
}
function resolveEntryIcon(entry) {
	if (!entry) return "";
	const href = entry.href ? String(entry.href) : "";
	if (!href) return "";
	return faviconForHref(href);
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/storage-bridge.ts
var storage_bridge_exports = /* @__PURE__ */ __exportAll({
	canShowDirectoryPicker: () => canShowDirectoryPicker,
	copyNativeStorageImage: () => copyNativeStorageImage,
	createNativeStorageDocument: () => createNativeStorageDocument,
	ensureNativeStorageProvide: () => ensureNativeStorageProvide,
	getAllFilesStatus: () => getAllFilesStatus,
	installNativeShowSaveFilePicker: () => installNativeShowSaveFilePicker,
	isNativeStorageAvailable: () => isNativeStorageAvailable,
	listNativeStorage: () => listNativeStorage,
	nativeHandleFromUri: () => nativeHandleFromUri,
	nativeUriFromSaveHandle: () => nativeUriFromSaveHandle,
	openNativeStorageDocument: () => openNativeStorageDocument,
	openNativeStorageFile: () => openNativeStorageFile,
	pickBrowserDirectory: () => pickBrowserDirectory,
	pickSafTree: () => pickSafTree,
	readNativeStorageFile: () => readNativeStorageFile,
	removeNativeStorage: () => removeNativeStorage,
	requestAllFilesAccess: () => requestAllFilesAccess,
	resolveNativeStorageRealPath: () => resolveNativeStorageRealPath,
	resolveNativeStorageUri: () => resolveNativeStorageUri,
	saveDocumentMimeForName: () => saveDocumentMimeForName,
	shareNativeStorageFile: () => shareNativeStorageFile,
	toNativeStorageVirtualPath: () => toNativeStorageVirtualPath,
	writeNativeClipboardImage: () => writeNativeClipboardImage,
	writeNativeStorageFile: () => writeNativeStorageFile,
	writeNativeStorageUri: () => writeNativeStorageUri
});
var api = null;
var INVOKE_MS = 12e3;
var withTimeout = async (task, ms, fallback) => {
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
	const r = await withTimeout(Promise.resolve(plugin.invoke({
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
/** content:// or file:// for Document ACTION_VIEW — do not read bytes. */
var resolveNativeStorageUri = async (virtualPath) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return "";
	const echo = await capacitorInvoke("storage:uri", {
		root: parsed.root,
		path: parsed.rel
	});
	return String(echo.uri || echo.url || "").trim();
};
/** Put `/sdcard/` `/saf/` image on the Android clipboard (ClipData URI). */
var copyNativeStorageImage = async (virtualPath) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return false;
	const echo = await capacitorInvoke("storage:copy-image", {
		root: parsed.root,
		path: parsed.rel
	});
	return echo.copied === true || echo.ok === true;
};
/** Bytes (data URL) → cache FileProvider URI → system clipboard. */
var writeNativeClipboardImage = async (dataUrl, mimeType = "image/png", name = "image.png") => {
	const data = String(dataUrl || "").trim();
	if (!data) return false;
	const echo = await capacitorInvoke("clipboard:write-local-image", {
		data,
		mimeType: String(mimeType || "image/png"),
		name: String(name || "image.png")
	});
	return echo.copied === true || echo.ok === true;
};
var writeEchoOk = (echo) => echo.written === true || echo.ok === true;
/** Write UTF-8 text to `/sdcard/` or `/saf/` (creates parents + file). */
var writeNativeStorageFile = async (virtualPath, content, opts) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return false;
	const payload = {
		root: parsed.root,
		path: parsed.rel,
		text: String(content ?? ""),
		mimeType: String(opts?.mimeType || "text/markdown")
	};
	const echo = await capacitorInvoke("storage:write", payload);
	if (writeEchoOk(echo)) return true;
	if (opts?.requestAccess === false) return false;
	if (parsed.root === "sdcard") {
		if (/all-files-required|permission|EACCES|denied/i.test(String(echo.error || ""))) {
			await requestAllFilesAccess();
			return writeEchoOk(await capacitorInvoke("storage:write", payload));
		}
	}
	return false;
};
/** Overwrite a remembered `content://` / `file://` from ACTION_CREATE_DOCUMENT. */
var writeNativeStorageUri = async (uri, content) => {
	const target = String(uri || "").trim();
	if (!target) return false;
	return writeEchoOk(await capacitorInvoke("storage:write-uri", {
		uri: target,
		text: String(content ?? "")
	}));
};
var nativeBridgePlugin = () => {
	const g = globalThis;
	return g.__CWS_BRIDGE_PLUGIN__ || g.Capacitor?.Plugins?.CwsBridge || null;
};
/** WHY: Android MimeTypeMap maps `.ts` → `video/mp2t`. CREATE_DOCUMENT then
* treats TypeScript as MPEG-TS or rewrites the extension. Octet-stream keeps the name. */
var saveDocumentMimeForName = (filename, fallback = "text/markdown") => {
	const n = String(filename || "").trim().toLowerCase();
	if (/\.(tsx?|mts|cts|jsx?|mjs|cjs|css|scss|sass|less|vue|svelte|json|xml|ya?ml|sh|bash|py|rs|go|java|kt)$/.test(n)) return "application/octet-stream";
	if (n.endsWith(".md") || n.endsWith(".markdown")) return "text/markdown";
	if (n.endsWith(".txt") || n.endsWith(".log") || n.endsWith(".csv")) return "text/plain";
	if (n.endsWith(".html") || n.endsWith(".htm")) return "text/html";
	if (n.endsWith(".svg")) return "image/svg+xml";
	return fallback;
};
var mimeFromSavePickerOptions = (options) => {
	const fromName = saveDocumentMimeForName(String(options?.suggestedName || "").trim(), "");
	if (fromName) return fromName;
	const accept = options?.types?.[0]?.accept;
	if (accept && typeof accept === "object") {
		const first = Object.keys(accept).find((key) => key && key !== "*/*" && !key.startsWith("video/"));
		if (first) return first;
	}
	return "text/markdown";
};
var invokeCreateDocument = async (filename, content, mimeType) => {
	const plugin = nativeBridgePlugin();
	if (typeof plugin?.invoke !== "function") return { ok: false };
	const r = await Promise.resolve(plugin.invoke({
		channel: "storage:create-document",
		payload: {
			name: filename,
			text: String(content ?? ""),
			mimeType
		}
	}));
	const echo = r?.echo || {};
	const err = String(echo.error || r?.error || "");
	if (/cancel/i.test(err)) return {
		ok: false,
		cancelled: true
	};
	const uri = String(echo.uri || echo.url || "").trim();
	if (uri && content && echo.written !== true) {
		if (await writeNativeStorageUri(uri, content)) return {
			ok: true,
			uri
		};
	}
	return r?.ok !== false && (echo.written === true || echo.ok === true || Boolean(uri)) ? {
		ok: true,
		uri: uri || void 0
	} : { ok: false };
};
var nativeFileHandle = (uri, name) => {
	const chunks = [];
	return {
		kind: "file",
		name,
		__cwsNativeUri: uri,
		queryPermission: async () => "granted",
		requestPermission: async () => "granted",
		getFile: async () => new File([], name),
		createWritable: async () => ({
			write: async (chunk) => {
				const data = chunk && typeof chunk === "object" && "data" in chunk ? chunk.data : chunk;
				if (data != null && (typeof data === "string" || data instanceof Blob || ArrayBuffer.isView(data) || data instanceof ArrayBuffer)) chunks.push(data);
			},
			close: async () => {
				const text = await new Blob(chunks).text();
				chunks.length = 0;
				if (!await writeNativeStorageUri(uri, text)) throw new DOMException("Write failed.", "InvalidStateError");
			},
			abort: async () => {
				chunks.length = 0;
			}
		})
	};
};
/**
* Capacitor stand-in for `showSaveFilePicker`: ACTION_CREATE_DOCUMENT, then write.
* WHY: Android WebView has no FSA picker; this call waits on the system sheet (no 12s cap).
*/
var createNativeStorageDocument = async (filename, content, mimeType = "text/markdown") => {
	if (!isNativeStorageAvailable()) return { ok: false };
	const name = String(filename || "document.md").trim() || "document.md";
	return invokeCreateDocument(name, content, mimeType || saveDocumentMimeForName(name));
};
var nativeUriFromSaveHandle = (handle) => String(handle?.__cwsNativeUri || "").trim();
var nativeHandleFromUri = (uri, name) => {
	const target = String(uri || "").trim();
	if (!target) return null;
	return nativeFileHandle(target, String(name || "document.md").trim() || "document.md");
};
/** ACTION_OPEN_DOCUMENT — persist write grant and map primary: files to `/sdcard/…`. */
var openNativeStorageDocument = async () => {
	if (!isNativeStorageAvailable()) return { ok: false };
	const plugin = nativeBridgePlugin();
	if (typeof plugin?.invoke !== "function") return { ok: false };
	const r = await Promise.resolve(plugin.invoke({
		channel: "storage:open-document",
		payload: {}
	}));
	const echo = r?.echo || {};
	const err = String(echo.error || r?.error || "");
	if (/cancel/i.test(err)) return {
		ok: false,
		cancelled: true
	};
	const uri = String(echo.uri || echo.url || "").trim();
	const virtualPath = String(echo.virtualPath || echo.path || "").trim() || toNativeStorageVirtualPath(uri);
	const name = String(echo.name || virtualPath.split("/").filter(Boolean).pop() || "document.md");
	const mime = String(echo.mime || echo.mimeType || "text/markdown");
	const text = String(echo.text || echo.content || "");
	let file = null;
	if (text) file = new File([text], name, { type: mime || "text/markdown" });
	else {
		const data = String(echo.data || echo.dataUrl || "");
		if (data) file = await dataUrlToFile(data, name, mime);
	}
	return {
		ok: r?.ok !== false && Boolean(file),
		uri: uri || void 0,
		virtualPath: virtualPath || void 0,
		name,
		file
	};
};
/**
* Overwrite WebView `showSaveFilePicker` (stub / NotAllowedError) with ACTION_CREATE_DOCUMENT.
* INVARIANT: only on Capacitor; web/PWA/CRX keep the browser picker.
*/
var installNativeShowSaveFilePicker = () => {
	if (!isNativeStorageAvailable()) return false;
	const g = globalThis;
	if (g.__CWS_NATIVE_SAVE_PICKER__ && typeof g.showSaveFilePicker === "function") return true;
	g.showSaveFilePicker = async (options) => {
		const opts = options || {};
		const name = String(opts.suggestedName || "document.md").trim() || "document.md";
		const created = await invokeCreateDocument(name, "", mimeFromSavePickerOptions(opts));
		if (created.cancelled) throw new DOMException("The user aborted a request.", "AbortError");
		if (!created.uri) throw new DOMException("Could not create file.", "InvalidStateError");
		return nativeFileHandle(created.uri, name);
	};
	g.__CWS_NATIVE_SAVE_PICKER__ = true;
	return true;
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
/** ACTION_SEND chooser — Android share sheet, no JS byte hop. */
var shareNativeStorageFile = async (virtualPath, opts = {}) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return false;
	const mimeType = String(opts.mimeType || "").trim();
	const title = String(opts.title || "Share").trim();
	const echo = await capacitorInvoke("storage:share", {
		root: parsed.root,
		path: parsed.rel,
		...mimeType ? { mimeType } : {},
		...title ? { title } : {}
	});
	return echo.opened === true || echo.sent === true || echo.ok === true;
};
/** Absolute `/storage/emulated/0/…` or SAF `content://` URI. */
var resolveNativeStorageRealPath = async (virtualPath) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return "";
	const echo = await capacitorInvoke("storage:realpath", {
		root: parsed.root,
		path: parsed.rel
	});
	return String(echo.path || echo.uri || echo.url || "").trim();
};
/**
* WHY: Capacitor Explorer must open `/sdcard/` / `/saf/` in one native hop
* (FileProvider + SEND/VIEW). Reading bytes in JS then hopping URI often never launches.
*/
var openNativeStorageFile = async (virtualPath, opts = {}) => {
	const parsed = parseNativeStoragePath(virtualPath);
	if (!parsed) return false;
	const packageName = String(opts.packageName || "").trim();
	const mimeType = String(opts.mimeType || "").trim();
	const title = String(opts.title || (packageName ? "Open" : "Open with")).trim();
	const echo = await capacitorInvoke("storage:open", {
		root: parsed.root,
		path: parsed.rel,
		chooser: packageName ? opts.chooser === true : opts.chooser !== false,
		...packageName ? { packageName } : {},
		...mimeType ? { mimeType } : {},
		...title ? { title } : {}
	});
	if (echo.opened === true || echo.sent === true || echo.ok === true) return true;
	const err = String(echo.error || "");
	if (err === "all-files-required" || parsed.root === "sdcard" && err === "not a file") {
		if (!(await getAllFilesStatus()).allFilesAccess) await requestAllFilesAccess();
	}
	return false;
};
/**
* WHY: Document / Process do not import Explorer path-router, so `provide("/sdcard/…")`
* had no backend and the viewer stayed empty.
*/
var ensureNativeStorageProvide = async () => {
	if (!isNativeStorageAvailable()) return;
	try {
		const { registerProvideBackend } = await import("../vendor/culori.js").then((n) => n.t);
		const { registerMarkdownFilePicker } = await import("./app2.js").then((n) => n.s);
		registerMarkdownFilePicker(async () => {
			const opened = await openNativeStorageDocument();
			if (opened.cancelled) return null;
			if (!opened.ok || !opened.file) return void 0;
			return {
				file: opened.file,
				sidecars: [],
				virtualPath: opened.virtualPath || null,
				handle: opened.uri ? nativeHandleFromUri(opened.uri, opened.file.name) : null
			};
		});
		const bind = (root) => {
			registerProvideBackend({
				root,
				list: async (path) => {
					const parsed = parseNativeStoragePath(String(path || root));
					const rows = await listNativeStorage(parsed?.root || (root === "/saf/" ? "saf" : "sdcard"), parsed?.rel || "/");
					const base = String(path || root).endsWith("/") ? String(path || root) : `${path || root}/`;
					return rows.filter((row) => row?.name).map((row) => ({
						name: String(row.name),
						kind: row.kind === "directory" ? "directory" : "file",
						path: row.path || `${base}${row.name}${row.kind === "directory" ? "/" : ""}`
					}));
				},
				readFile: (path) => readNativeStorageFile(path),
				writeFile: async (path, file) => {
					return writeNativeStorageFile(path, await file.text().catch(() => ""), { mimeType: file.type || "text/markdown" });
				}
			});
		};
		bind("/sdcard/");
		bind("/saf/");
	} catch {}
};
var pickSafTree = async () => {
	if (api?.pickSaf) return api.pickSaf();
	const echo = await capacitorInvoke("storage:pick-saf", {});
	return String(echo.uri || echo.treeUri || "");
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
var canShowDirectoryPicker = () => typeof globalThis.showDirectoryPicker === "function";
var pickBrowserDirectory = async () => {
	const pick = globalThis.showDirectoryPicker;
	if (typeof pick !== "function") return null;
	try {
		return await pick({ mode: "readwrite" });
	} catch {
		return null;
	}
};
//#endregion
export { normalizeVirtualPath as C, buildExplorerDragPayload as S, toExplorerStoragePath as T, storage_bridge_exports as _, installNativeShowSaveFilePicker as a, writeNativeStorageFile as b, nativeUriFromSaveHandle as c, readNativeStorageFile as d, removeNativeStorage as f, shareNativeStorageFile as g, resolveNativeStorageUri as h, getAllFilesStatus as i, pickBrowserDirectory as l, resolveNativeStorageRealPath as m, copyNativeStorageImage as n, isNativeStorageAvailable as o, requestAllFilesAccess as p, createNativeStorageDocument as r, listNativeStorage as s, canShowDirectoryPicker as t, pickSafTree as u, toNativeStorageVirtualPath as v, resolveEntryIcon as w, writeNativeStorageUri as x, writeNativeClipboardImage as y };
