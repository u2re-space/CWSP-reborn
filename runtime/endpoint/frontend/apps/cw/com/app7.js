import { g as registerDirectoryRoot, v as unregisterDirectoryRoot } from "./app2.js";
//#region ../../modules/projects/fl.ui/src/ui/explorer/fs-backend.ts
function normalizeVirtualPath(path, asDirectory = true) {
	let p = String(path || "/").trim() || "/";
	if (!p.startsWith("/")) p = `/${p}`;
	p = p.replace(/\/{2,}/g, "/");
	if (p !== "/" && asDirectory && !p.endsWith("/")) p += "/";
	if (p !== "/" && !asDirectory && p.endsWith("/")) p = p.slice(0, -1);
	return p;
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
//#region ../../modules/projects/fl.ui/src/ui/explorer/backends/chrome-bookmarks-backend.ts
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
		move,
		remove,
		writeFile,
		subscribeBookmarksInvalidation
	};
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/storage-bridge.ts
var api = null;
var capacitorInvoke = async (channel, payload = {}) => {
	const plugin = globalThis.Capacitor?.Plugins?.CwsBridge;
	if (typeof plugin?.invoke !== "function") return { ok: false };
	const r = await plugin.invoke({
		channel,
		payload
	});
	return r?.echo || r || {};
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
//#region ../../modules/projects/fl.ui/src/ui/explorer/backends/native-fs-backend.ts
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
	writable: root === "/sdcard/",
	async list(path) {
		const rel = normalizeVirtualPath(path, true).slice(root.length - 1) || "/";
		return toEntries(path, await listNativeStorage(root === "/saf/" ? "saf" : "sdcard", rel));
	}
});
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/mounts.ts
var MOUNTS_ROOT = "/mounts/";
var CATALOG_KEY = "cw::explorer::mounts";
var handles = /* @__PURE__ */ new Map();
var observer = null;
var readCatalog = () => {
	try {
		const raw = localStorage.getItem(CATALOG_KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		if (parsed && Array.isArray(parsed.mounts)) return parsed;
	} catch {}
	return { mounts: [] };
};
var writeCatalog = (catalog) => {
	try {
		localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
	} catch {}
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
var listExplorerMounts = () => readCatalog().mounts;
var addDirectoryMount = (handle, label) => {
	const catalog = readCatalog();
	const id = `mnt-${Date.now().toString(36)}`;
	const mount = {
		id,
		label: String(label || handle.name || id),
		path: `${MOUNTS_ROOT}${id}/`
	};
	handles.set(id, handle);
	catalog.mounts.push(mount);
	writeCatalog(catalog);
	registerFsBackend(createMountBackend(mount));
	registerDirectoryRoot(mount.path, handle);
	persistMountHandle(id, handle);
	observeHandle(handle);
	return mount;
};
var removeDirectoryMount = (id) => {
	const catalog = readCatalog();
	const mount = catalog.mounts.find((m) => m.id === id);
	catalog.mounts = catalog.mounts.filter((m) => m.id !== id);
	writeCatalog(catalog);
	handles.delete(id);
	if (mount) {
		unregisterFsBackend(mount.path);
		unregisterDirectoryRoot(mount.path);
	}
	forgetMountHandle(id);
};
var restoreDirectoryMounts = () => {
	restorePersistedHandles().then(() => {
		for (const mount of readCatalog().mounts) {
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
var persistMountHandle = async (id, handle) => {
	try {
		(await openHandleDb()).transaction(HANDLE_STORE, "readwrite").objectStore(HANDLE_STORE).put(handle, id);
	} catch {}
};
var forgetMountHandle = async (id) => {
	try {
		(await openHandleDb()).transaction(HANDLE_STORE, "readwrite").objectStore(HANDLE_STORE).delete(id);
	} catch {}
};
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
//#region ../../modules/projects/fl.ui/src/ui/explorer/path-router.ts
/**
* INVARIANT: registry keys are normalized directory roots (trailing slash,
* except `/` itself). Longest-prefix match wins so nested backends (e.g.
* `/bookmarks/` under a future `/`-rooted fallback) resolve deterministically.
*/
var registry = /* @__PURE__ */ new Map();
var normalizeRoot = (root) => normalizeVirtualPath(root, true);
var backendListeners = /* @__PURE__ */ new Set();
function subscribeFsBackendRegister(listener) {
	if (typeof listener !== "function") return () => {};
	backendListeners.add(listener);
	return () => {
		backendListeners.delete(listener);
	};
}
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
/**
* Returns one directory entry per registered root (skip the bare `/` root
* since the Explorer renders it as the virtual root frame, not as a row).
* Names are the leading path segment of each root, sorted for stable output.
*/
function listVirtualRootEntriesFromRouter() {
	const entries = [];
	for (const root of registry.keys()) {
		if (root === "/") continue;
		const name = root.split("/").filter(Boolean)[0];
		if (!name) continue;
		entries.push({
			name,
			kind: "directory",
			path: root
		});
	}
	entries.sort((a, b) => a.name.localeCompare(b.name));
	return entries;
}
var stripUserPrefix = (path) => {
	const vpath = String(path || "").replace(/^\/+/, "");
	if (vpath.startsWith("user/")) return "/" + vpath.slice(5);
	return "/" + vpath;
};
var listOpfsUserDirectory = async (path) => {
	const nav = typeof navigator !== "undefined" ? navigator : null;
	const getDir = nav?.storage?.getDirectory;
	if (typeof getDir !== "function") return [];
	let root;
	try {
		root = await getDir.call(nav.storage);
	} catch {
		return [];
	}
	if (!root) return [];
	const segments = stripUserPrefix(path).split("/").filter(Boolean);
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
function ensureDefaultFsBackends() {
	if (!resolveFsBackend("/user/")) registerFsBackend({
		root: "/user/",
		writable: true,
		async list(path) {
			return listOpfsUserDirectory(path);
		}
	});
	if (!resolveFsBackend("/assets/")) registerFsBackend({
		root: "/assets/",
		writable: false,
		async list() {
			return [];
		}
	});
	if (!resolveFsBackend("/bookmarks/")) {
		const chromeAny = globalThis?.chrome;
		if (chromeAny?.bookmarks) {
			const backend = createChromeBookmarksBackend(chromeAny.bookmarks);
			if (backend) registerFsBackend(backend);
		}
	}
	if (isNativeStorageAvailable()) {
		if (!resolveFsBackend("/sdcard/")) registerFsBackend(createNativeFsBackend("/sdcard/"));
		if (!resolveFsBackend("/saf/")) registerFsBackend(createNativeFsBackend("/saf/"));
	}
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
//#endregion
export { listExplorerMounts as a, getAllFilesStatus as c, pickSafTree as d, requestAllFilesAccess as f, resolveEntryIcon as h, addDirectoryMount as i, isNativeStorageAvailable as l, normalizeVirtualPath as m, resolveFsBackend as n, removeDirectoryMount as o, buildExplorerDragPayload as p, subscribeFsBackendRegister as r, canShowDirectoryPicker as s, listVirtualRootEntriesFromRouter as t, pickBrowserDirectory as u };
