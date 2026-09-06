import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { observe } from "/fest/object.js";
import { UUIDv4, storagePathCandidates, stripStorageScopePrefix } from "/fest/core.js";
import { QueuedWorkerChannel, createWorkerChannel } from "/fest/uniform.js";
//#region ../../modules/projects/lur.e/src/utils/opfs/IdbFs.ts
/**
* FIND:idb-fs
* TAG:opfs,idb
* IndexedDB FileSystem-handle backend for OPFS.
*
* INVARIANT: handles expose the same surface as OPFS
* (`getDirectoryHandle` / `getFileHandle` / `entries` / `removeEntry` /
* `getFile` / `createWritable`) so `mappedRoots` can swap backends.
*
* WHY: OPFS is missing on some hosts, or can be turned off. Then `/user/`
* uses this store. When OPFS stays on (default), the same store is `/idb/`.
*/
var IDB_FS_ROOT = "/idb/";
var OPFS_SUPPORT_KEY = "cwsp.opfs.enabled";
var IDB_FS_BRAND = Symbol.for("fest.idb-fs");
var DB_NAME = "fest-idb-fs";
var STORE_NAME = "nodes";
var DB_VERSION = 1;
var refreshRoots = null;
/** OPFS.ts binds this so toggling support remounts `/user/` and `/idb/`. */
var bindStorageRootsRefresher = (fn) => {
	refreshRoots = fn;
};
var fsError = (name, message) => {
	if (typeof DOMException !== "undefined") return new DOMException(message, name);
	const error = new Error(message);
	error.name = name;
	return error;
};
var normalizeIdbNodePath = (path) => {
	const parts = [];
	for (const part of String(path || "/").split("/")) {
		if (!part || part === ".") continue;
		if (part === "..") {
			parts.pop();
			continue;
		}
		parts.push(part);
	}
	return parts.length ? `/${parts.join("/")}` : "/";
};
var joinChildPath = (parent, name) => {
	const clean = String(name || "").replace(/[/\\]/g, "");
	if (!clean || clean === "." || clean === "..") throw fsError("TypeMismatchError", `Invalid entry name: ${name}`);
	const base = normalizeIdbNodePath(parent);
	return base === "/" ? `/${clean}` : `${base}/${clean}`;
};
var parentOf = (path) => {
	const normalized = normalizeIdbNodePath(path);
	if (normalized === "/") return "";
	const index = normalized.lastIndexOf("/");
	return index <= 0 ? "/" : normalized.slice(0, index);
};
var ensureRootNode = async (store) => {
	if ((await store.get("/"))?.kind === "directory") return;
	await store.put({
		path: "/",
		name: "",
		parent: "",
		kind: "directory"
	});
};
var createMemoryIdbFsStore = () => {
	const nodes = /* @__PURE__ */ new Map();
	return {
		async get(path) {
			return nodes.get(normalizeIdbNodePath(path));
		},
		async put(node) {
			const path = normalizeIdbNodePath(node.path);
			nodes.set(path, {
				...node,
				path
			});
		},
		async delete(path) {
			nodes.delete(normalizeIdbNodePath(path));
		},
		async list(parent) {
			const key = normalizeIdbNodePath(parent);
			return [...nodes.values()].filter((node) => node.path !== "/" && node.parent === key);
		}
	};
};
var idbRequest = (request) => new Promise((resolve, reject) => {
	request.onsuccess = () => resolve(request.result);
	request.onerror = () => reject(request.error);
});
var openIdbFsDatabase = () => new Promise((resolve, reject) => {
	const request = indexedDB.open(DB_NAME, DB_VERSION);
	request.onerror = () => reject(request.error);
	request.onsuccess = () => resolve(request.result);
	request.onupgradeneeded = () => {
		const db = request.result;
		if (db.objectStoreNames.contains(STORE_NAME)) return;
		db.createObjectStore(STORE_NAME, { keyPath: "path" }).createIndex("parent", "parent", { unique: false });
	};
});
var createIndexedDbFsStore = async () => {
	const db = await openIdbFsDatabase();
	const withStore = async (mode, run) => {
		return run(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
	};
	const store = {
		async get(path) {
			return withStore("readonly", (objectStore) => idbRequest(objectStore.get(normalizeIdbNodePath(path))));
		},
		async put(node) {
			const path = normalizeIdbNodePath(node.path);
			await withStore("readwrite", (objectStore) => idbRequest(objectStore.put({
				...node,
				path
			})));
		},
		async delete(path) {
			await withStore("readwrite", (objectStore) => idbRequest(objectStore.delete(normalizeIdbNodePath(path))));
		},
		async list(parent) {
			const key = normalizeIdbNodePath(parent);
			return withStore("readonly", async (objectStore) => {
				if (objectStore.indexNames.contains("parent")) return (await idbRequest(objectStore.index("parent").getAll(key)) || []).filter((node) => node.path !== "/");
				return (await idbRequest(objectStore.getAll()) || []).filter((node) => node.path !== "/" && node.parent === key);
			});
		}
	};
	await ensureRootNode(store);
	return store;
};
var isIdbAvailable = () => {
	try {
		return typeof indexedDB !== "undefined";
	} catch {
		return false;
	}
};
var isOpfsCapabilityAvailable = () => {
	try {
		return typeof navigator !== "undefined" && typeof navigator.storage?.getDirectory === "function";
	} catch {
		return false;
	}
};
var isOpfsSupportEnabled = () => {
	try {
		if (typeof localStorage === "undefined") return true;
		const value = localStorage.getItem(OPFS_SUPPORT_KEY);
		return value !== "0" && value !== "false";
	} catch {
		return true;
	}
};
var setOpfsSupportEnabled = (enabled) => {
	try {
		localStorage?.setItem?.(OPFS_SUPPORT_KEY, enabled ? "1" : "0");
	} catch {}
	refreshRoots?.();
};
/** OPFS is used for `/user/` only when the API exists and support is on. */
var isOpfsBackendActive = () => isOpfsCapabilityAvailable() && isOpfsSupportEnabled();
var isIdbFsHandle = (value) => !!value && typeof value === "object" && value[IDB_FS_BRAND] === true;
var removeTree = async (store, path) => {
	const target = normalizeIdbNodePath(path);
	const children = await store.list(target);
	for (const child of children) if (child.kind === "directory") await removeTree(store, child.path);
	else await store.delete(child.path);
	if (target !== "/") await store.delete(target);
};
var IdbFileHandle = class {
	kind = "file";
	[IDB_FS_BRAND] = true;
	name;
	#store;
	#path;
	#type;
	constructor(store, path, name, type = "") {
		this.#store = store;
		this.#path = normalizeIdbNodePath(path);
		this.name = name;
		this.#type = type;
	}
	async getFile() {
		const node = await this.#store.get(this.#path);
		if (!node || node.kind !== "file") throw fsError("NotFoundError", `File not found: ${this.#path}`);
		const payload = node.data ?? new Blob();
		const blob = payload instanceof Blob ? payload : new Blob([payload]);
		return new File([blob], this.name, {
			type: node.type || blob.type || this.#type,
			lastModified: node.lastModified || Date.now()
		});
	}
	async createWritable() {
		const chunks = [];
		let aborted = false;
		const store = this.#store;
		const path = this.#path;
		const name = this.name;
		const type = this.#type;
		return {
			async write(data) {
				if (aborted) throw fsError("AbortError", "Writable aborted");
				const chunk = data && typeof data === "object" && "data" in data ? data.data : data;
				chunks.push(chunk);
			},
			async seek() {},
			async truncate() {
				chunks.length = 0;
			},
			async abort() {
				aborted = true;
				chunks.length = 0;
			},
			async close() {
				if (aborted) return;
				const blob = new Blob(chunks, { type: type || void 0 });
				await store.put({
					path,
					name,
					parent: parentOf(path),
					kind: "file",
					type: blob.type || type,
					lastModified: Date.now(),
					size: blob.size,
					data: blob
				});
			}
		};
	}
};
var IdbDirectoryHandle = class IdbDirectoryHandle {
	kind = "directory";
	[IDB_FS_BRAND] = true;
	name;
	#store;
	#path;
	constructor(store, path, name) {
		this.#store = store;
		this.#path = normalizeIdbNodePath(path);
		this.name = name;
	}
	async getDirectoryHandle(name, options = {}) {
		const childPath = joinChildPath(this.#path, name);
		let node = await this.#store.get(childPath);
		if (!node) {
			if (!options.create) throw fsError("NotFoundError", `Directory not found: ${childPath}`);
			node = {
				path: childPath,
				name: String(name),
				parent: this.#path,
				kind: "directory"
			};
			await this.#store.put(node);
		}
		if (node.kind !== "directory") throw fsError("TypeMismatchError", `Not a directory: ${childPath}`);
		return new IdbDirectoryHandle(this.#store, childPath, node.name);
	}
	async getFileHandle(name, options = {}) {
		const childPath = joinChildPath(this.#path, name);
		let node = await this.#store.get(childPath);
		if (!node) {
			if (!options.create) throw fsError("NotFoundError", `File not found: ${childPath}`);
			node = {
				path: childPath,
				name: String(name),
				parent: this.#path,
				kind: "file",
				type: "",
				lastModified: Date.now(),
				size: 0,
				data: new Blob()
			};
			await this.#store.put(node);
		}
		if (node.kind !== "file") throw fsError("TypeMismatchError", `Not a file: ${childPath}`);
		return new IdbFileHandle(this.#store, childPath, node.name, node.type);
	}
	async removeEntry(name, options = {}) {
		const childPath = joinChildPath(this.#path, name);
		const node = await this.#store.get(childPath);
		if (!node) throw fsError("NotFoundError", `Entry not found: ${childPath}`);
		if (node.kind === "directory") {
			if ((await this.#store.list(childPath)).length && !options.recursive) throw fsError("InvalidModificationError", `Directory not empty: ${childPath}`);
			await removeTree(this.#store, childPath);
			return;
		}
		await this.#store.delete(childPath);
	}
	async *entries() {
		const children = await this.#store.list(this.#path);
		for (const node of children) {
			const handle = node.kind === "directory" ? new IdbDirectoryHandle(this.#store, node.path, node.name) : new IdbFileHandle(this.#store, node.path, node.name, node.type);
			yield [node.name, handle];
		}
	}
	async *keys() {
		for await (const [name] of this.entries()) yield name;
	}
	async *values() {
		for await (const [, handle] of this.entries()) yield handle;
	}
};
var defaultRootPromise = null;
var getIdbRoot = async (store) => {
	if (store) {
		await ensureRootNode(store);
		return new IdbDirectoryHandle(store, "/", "");
	}
	if (!isIdbAvailable()) return null;
	defaultRootPromise ??= (async () => {
		try {
			return new IdbDirectoryHandle(await createIndexedDbFsStore(), "/", "");
		} catch {
			return null;
		}
	})();
	return defaultRootPromise;
};
var copyHandleTree = async (fromHandle, toHandle) => {
	try {
		if (fromHandle?.kind === "directory") {
			for await (const [name, entry] of fromHandle.entries()) if (entry?.kind === "directory") await copyHandleTree(entry, await toHandle.getDirectoryHandle(name, { create: true }));
			else {
				const file = await entry.getFile();
				const writable = await (await toHandle.getFileHandle(name, { create: true })).createWritable();
				await writable.write(file);
				await writable.close();
			}
			return true;
		}
		const file = await fromHandle.getFile();
		const writable = await toHandle.createWritable();
		await writable.write(file);
		await writable.close();
		return true;
	} catch {
		return false;
	}
};
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/provide.ts
/**
* FIND:provide
* TAG:idb-fs,opfs
*
* Virtual-FS `provide()` pieces: files, directories, and host backends.
*
* WHY: `provide` used to mean "OPFS `/user/` file or HTTP". Callers now need
* `/idb/`, `/mounts/`, and Capacitor `/sdcard/` `/saf/` — plus directory
* listings, not only `File`. Handle walking stays here so lure does not
* import fl.ui; Explorer registers native roots via `registerProvideBackend`.
*
* INVARIANT: a directory result is never a `Blob`/`File`. Use
* `isProvidedDirectory` / `asProvidedFile` at call sites that still want bytes.
*/
var provideBackends = /* @__PURE__ */ new Map();
var normalizeRoot = (root) => {
	const raw = String(root || "").trim() || "/";
	if (raw === "/") return "/";
	return raw.endsWith("/") ? raw : `${raw}/`;
};
var isProvidedDirectory = (value) => !!value && typeof value === "object" && !(value instanceof Blob) && value.kind === "directory" && Array.isArray(value.entries);
var asProvidedFile = (value) => {
	if (typeof File !== "undefined" && value instanceof File) return value;
	return null;
};
var registerProvideBackend = (backend) => {
	if (!backend?.root || typeof backend.list !== "function") return;
	provideBackends.set(normalizeRoot(backend.root), backend);
};
var unregisterProvideBackend = (root) => {
	provideBackends.delete(normalizeRoot(root));
};
var matchProvideBackend = (path) => {
	let p = String(path || "").trim() || "/";
	if (!p.startsWith("/")) p = `/${p}`;
	let best = null;
	let bestLen = -1;
	for (const [root, backend] of provideBackends) {
		if (root === "/") continue;
		if (p === root.slice(0, -1) || p === root || p.startsWith(root)) {
			if (root.length > bestLen) {
				best = backend;
				bestLen = root.length;
			}
		}
	}
	return best;
};
var stripProvideRootPrefix = (path, root) => {
	const normalized = String(path || "").trim() || "/";
	const key = normalizeRoot(root);
	if (key === "/") return normalized.startsWith("/") ? normalized : `/${normalized}`;
	if (normalized === key.slice(0, -1) || normalized === key) return "/";
	if (normalized.startsWith(key)) return `/${normalized.slice(key.length)}`.replace(/\/{2,}/g, "/") || "/";
	return stripStorageScopePrefix(normalized);
};
var wantsDirectoryProvide = (path, options) => {
	if (options?.asDirectory) return true;
	const raw = String(path || "").trim();
	if (!raw || raw.endsWith("/")) return true;
	const p = raw.replace(/\/+$/, "");
	return p === "/user" || p === "/idb" || p === "/sdcard" || p === "/saf" || p === "/mounts" || p === "/desktop" || p === "/assets";
};
var isDirHandle = (handle) => !!handle && handle.kind === "directory" && typeof handle.getDirectoryHandle === "function";
var childVirtualPath = (dirPath, name, kind) => {
	return `${String(dirPath || "/").endsWith("/") ? dirPath : `${dirPath}/`}${name}${kind === "directory" ? "/" : ""}`;
};
var listHandleEntries = async (dir, dirPath) => {
	if (!dir?.entries) return [];
	const entries = [];
	try {
		for await (const [name, handle] of dir.entries()) {
			const kind = handle?.kind === "directory" ? "directory" : "file";
			entries.push({
				name: String(name),
				kind,
				path: childVirtualPath(dirPath, String(name), kind)
			});
		}
	} catch {
		return [];
	}
	return entries;
};
var toProvidedDirectory = async (path, handle) => {
	const normalized = String(path || "/").trim() || "/";
	const dirPath = normalized.endsWith("/") || normalized === "/" ? normalized : `${normalized}/`;
	return {
		kind: "directory",
		name: dirPath.split("/").filter(Boolean).pop() || dirPath.replace(/\//g, "") || "root",
		path: dirPath,
		handle,
		entries: await listHandleEntries(handle, dirPath)
	};
};
var walkHandle = async (root, rel, asDirectory, create) => {
	const parts = String(rel || "/").split("/").filter(Boolean);
	let dir = root;
	const fileName = asDirectory ? null : parts.pop();
	for (const part of parts) {
		dir = await dir?.getDirectoryHandle?.(part, { create });
		if (!dir) return null;
	}
	if (!fileName) return dir;
	return dir?.getFileHandle?.(fileName, { create }) ?? null;
};
var provideFromHandle = async (root, virtualPath, mappedRoot, rw = false, options) => {
	if (!isDirHandle(root)) return null;
	const asDir = wantsDirectoryProvide(virtualPath, options);
	const rel = stripProvideRootPrefix(virtualPath, mappedRoot);
	if (asDir) {
		const dir = await walkHandle(root, rel, true, !!rw).catch(() => null);
		if (!dir) return null;
		return toProvidedDirectory(virtualPath, dir);
	}
	const fileHandle = await walkHandle(root, rel, false, !!rw).catch(() => null);
	if (fileHandle?.kind === "file" || typeof fileHandle?.getFile === "function") {
		if (rw) return fileHandle.createWritable?.() ?? null;
		return await fileHandle.getFile?.() ?? null;
	}
	const dir = await walkHandle(root, rel, true, false).catch(() => null);
	if (dir) return toProvidedDirectory(virtualPath, dir);
	return null;
};
var writableFromBackend = (backend, path) => {
	const chunks = [];
	return {
		async write(data) {
			const chunk = data && typeof data === "object" && "data" in data ? data.data : data;
			chunks.push(chunk);
		},
		async seek() {},
		async truncate() {
			chunks.length = 0;
		},
		async abort() {
			chunks.length = 0;
		},
		async close() {
			const name = path.split("/").filter(Boolean).pop() || "file";
			const file = new File([new Blob(chunks)], name);
			await backend.writeFile?.(path, file);
		}
	};
};
var provideFromBackend = async (backend, virtualPath, rw = false, options) => {
	if (wantsDirectoryProvide(virtualPath, options)) {
		const entries = await backend.list(virtualPath).catch(() => []);
		const dirPath = virtualPath.endsWith("/") ? virtualPath : `${virtualPath}/`;
		return {
			kind: "directory",
			name: dirPath.split("/").filter(Boolean).pop() || backend.root.replace(/\//g, ""),
			path: dirPath,
			entries
		};
	}
	if (rw && backend.writeFile) return writableFromBackend(backend, virtualPath);
	return await backend.readFile?.(virtualPath).catch(() => null) ?? null;
};
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/OPFS.uniform.worker.ts?worker
function WorkerWrapper(options) {
	return new Worker("" + new URL("../workers/opfs/OPFS.uniform.worker.js", import.meta.url).href, {
		type: "module",
		name: options?.name
	});
}
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/OPFS.ts
/**
* FIND:opfs
* TAG:idb-fs
*/
var OPFS_exports = /* @__PURE__ */ __exportAll({
	asProvidedFile: () => asProvidedFile,
	attachFile: () => attachFile,
	clearAllInDirectory: () => clearAllInDirectory,
	copyFromOneHandlerToAnother: () => copyFromOneHandlerToAnother,
	createHandler: () => createHandler,
	currentHandleMap: () => currentHandleMap,
	defaultLogger: () => defaultLogger,
	detectTypeByRelPath: () => detectTypeByRelPath,
	directHandlers: () => directHandlers,
	directoryCacheMap: () => directoryCacheMap,
	downloadFile: () => downloadFile,
	dropAsTempFile: () => dropAsTempFile,
	dropFile: () => dropFile,
	ensureWorker: () => ensureWorker,
	generalFileImportDesc: () => generalFileImportDesc,
	getDir: () => getDir,
	getDirectoryHandle: () => getDirectoryHandle,
	getFileExtension: () => getFileExtension,
	getFileHandle: () => getFileHandle,
	getFileWriter: () => getFileWriter,
	getHandler: () => getHandler,
	getLeast: () => getLeast,
	getMimeTypeByFilename: () => getMimeTypeByFilename,
	ghostImage: () => ghostImage,
	handleError: () => handleError,
	handleIncomingEntries: () => handleIncomingEntries,
	hasFileExtension: () => hasFileExtension,
	imageImportDesc: () => imageImportDesc,
	isFsDirectoryHandle: () => isFsDirectoryHandle,
	isProvidedDirectory: () => isProvidedDirectory,
	isVirtualFsPath: () => isVirtualFsPath,
	mappedRoots: () => mappedRoots,
	matchMappedRoot: () => matchMappedRoot,
	matchProvideBackend: () => matchProvideBackend,
	mayNotPromise: () => mayNotPromise,
	mountAsRoot: () => mountAsRoot,
	normalizePath: () => normalizePath,
	openDirectory: () => openDirectory,
	openImageFilePicker: () => openImageFilePicker,
	post: () => post,
	provide: () => provide,
	readAsObjectURL: () => readAsObjectURL,
	readFile: () => readFile,
	readFileUTF8: () => readFileUTF8,
	refreshMappedStorageRoots: () => refreshMappedStorageRoots,
	registerDirectoryRoot: () => registerDirectoryRoot,
	registerProvideBackend: () => registerProvideBackend,
	remove: () => remove,
	removeDirectory: () => removeDirectory,
	removeFile: () => removeFile,
	resolvePath: () => resolvePath,
	resolveRootHandle: () => resolveRootHandle,
	unmountAsRoot: () => unmountAsRoot,
	unregisterDirectoryRoot: () => unregisterDirectoryRoot,
	unregisterProvideBackend: () => unregisterProvideBackend,
	uploadDirectory: () => uploadDirectory,
	uploadFile: () => uploadFile,
	walkExactFile: () => walkExactFile,
	wantsDirectoryProvide: () => wantsDirectoryProvide,
	writeFile: () => writeFile
});
var workerChannel = null;
var isServiceWorker = typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope;
var SW_BRIDGE_CHANNEL_NAME = "opfs-sw-bridge-v1";
var observers = /* @__PURE__ */ new Map();
var workerInitPromise = null;
var swBridgeChannel = null;
var swBridgeRequestCounter = 0;
var ensureSwBridgeChannel = () => {
	if (!isServiceWorker) return null;
	if (swBridgeChannel) return swBridgeChannel;
	try {
		if (typeof BroadcastChannel === "undefined") return null;
		swBridgeChannel = new BroadcastChannel(SW_BRIDGE_CHANNEL_NAME);
		return swBridgeChannel;
	} catch {
		return null;
	}
};
var postViaSwBridge = (type, payload = {}, timeoutMs = 2500) => {
	const channel = ensureSwBridgeChannel();
	if (!channel) return Promise.reject(/* @__PURE__ */ new Error("SW OPFS bridge is unavailable"));
	const requestId = `sw-opfs-${Date.now()}-${++swBridgeRequestCounter}`;
	return new Promise((resolve, reject) => {
		let timeoutId = null;
		const onMessage = (event) => {
			const data = event?.data || {};
			if (!data || typeof data !== "object") return;
			if (data?.type !== "opfs-sw-response") return;
			if (String(data?.requestId || "") !== requestId) return;
			channel.removeEventListener("message", onMessage);
			if (timeoutId) clearTimeout(timeoutId);
			if (data?.ok) resolve(data?.result);
			else reject(new Error(String(data?.error || "Unknown bridge error")));
		};
		channel.addEventListener("message", onMessage);
		timeoutId = setTimeout(() => {
			channel.removeEventListener("message", onMessage);
			reject(/* @__PURE__ */ new Error("SW OPFS bridge timeout"));
		}, timeoutMs);
		channel.postMessage({
			type: "opfs-sw-request",
			requestId,
			action: type,
			payload
		});
	});
};
var ensureWorker = () => {
	if (workerInitPromise) return workerInitPromise;
	workerInitPromise = new Promise(async (resolve) => {
		if (typeof Worker !== "undefined" && !isServiceWorker) try {
			const baseChannel = await createWorkerChannel({
				name: "opfs-worker",
				script: WorkerWrapper
			});
			workerChannel = new QueuedWorkerChannel("opfs-worker", async () => baseChannel, {
				timeout: 3e4,
				retries: 3,
				batching: true,
				compression: false
			});
			resolve(workerChannel);
		} catch (e) {
			console.warn("OPFSUniformWorker instantiation failed, falling back to main thread...", e);
			workerChannel = null;
			resolve(null);
		}
		else {
			workerChannel = null;
			resolve(null);
		}
	});
	return workerInitPromise;
};
var directHandlers = {
	readDirectory: async ({ rootId, path, create }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			let current = root;
			for (const part of parts) current = await current.getDirectoryHandle(part, { create });
			const entries = [];
			for await (const [name, entry] of current.entries()) entries.push([name, entry]);
			return entries;
		} catch (e) {
			console.warn("Direct readDirectory error:", e);
			return [];
		}
	},
	readFile: async ({ rootId, path, type }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const filename = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
			const file = await (await dir.getFileHandle(filename, { create: false })).getFile();
			if (type === "text") return await file.text();
			if (type === "arrayBuffer") return await file.arrayBuffer();
			return file;
		} catch (e) {
			console.warn("Direct readFile error:", e);
			return null;
		}
	},
	writeFile: async ({ rootId, path, data }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const filename = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true });
			const writable = await (await dir.getFileHandle(filename, { create: true })).createWritable();
			await writable.write(data);
			await writable.close();
			return true;
		} catch (e) {
			console.warn("Direct writeFile error:", e);
			return false;
		}
	},
	remove: async ({ rootId, path, recursive }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const name = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
			await dir.removeEntry(name, { recursive });
			return true;
		} catch {
			return false;
		}
	},
	copy: async ({ from, to }) => {
		try {
			const copyRecursive = async (source, dest) => {
				if (source.kind === "directory") for await (const [name, entry] of source.entries()) if (entry.kind === "directory") {
					const newDest = await dest.getDirectoryHandle(name, { create: true });
					await copyRecursive(entry, newDest);
				} else {
					const file = await entry.getFile();
					const writable = await (await dest.getFileHandle(name, { create: true })).createWritable();
					await writable.write(file);
					await writable.close();
				}
				else {
					const file = await source.getFile();
					const writable = await dest.createWritable();
					await writable.write(file);
					await writable.close();
				}
			};
			await copyRecursive(from, to);
			return true;
		} catch (e) {
			console.warn("Direct copy error:", e);
			return false;
		}
	},
	observe: async () => false,
	unobserve: async () => true,
	mount: async () => true,
	unmount: async () => true
};
var post = (type, payload = {}, transfer = []) => {
	if (isServiceWorker && directHandlers[type]) return postViaSwBridge(type, payload).catch(() => directHandlers[type](payload));
	return new Promise(async (resolve, reject) => {
		try {
			const channel = await ensureWorker();
			if (!channel) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
				return reject(/* @__PURE__ */ new Error("No worker channel available"));
			}
			let result;
			try {
				result = await channel.request(type, payload);
			} catch (requestError) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
				throw requestError;
			}
			if (result === false && (type === "writeFile" || type === "remove" || type === "copy")) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
			}
			resolve(result);
		} catch (err) {
			if (directHandlers[type]) try {
				return resolve(directHandlers[type](payload));
			} catch (fallbackError) {
				return reject(fallbackError);
			}
			reject(err);
		}
	});
};
var getDir = (dest) => {
	if (typeof dest != "string") return dest;
	dest = dest?.trim?.() || dest;
	if (!dest?.endsWith?.("/")) dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest;
	const p1 = !dest?.trim()?.endsWith("/") ? dest + "/" : dest;
	return !p1?.startsWith("/") ? "/" + p1 : p1;
};
var imageImportDesc = {
	startIn: "pictures",
	multiple: false,
	types: [{
		description: "wallpaper",
		accept: { "image/*": [
			".png",
			".gif",
			".jpg",
			".jpeg",
			".webp",
			".jxl"
		] }
	}]
};
var generalFileImportDesc = {
	startIn: "documents",
	multiple: false,
	types: [{
		description: "files",
		accept: { "application/*": [
			".txt",
			".md",
			".html",
			".htm",
			".css",
			".js",
			".json",
			".csv",
			".xml",
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".svg",
			".ico",
			".mp3",
			".wav",
			".mp4",
			".webm",
			".pdf",
			".zip",
			".rar",
			".7z"
		] }
	}]
};
var resolveOpfsDirectory = async () => await navigator?.storage?.getDirectory?.() ?? null;
var resolveUserStorageRoot = async () => {
	if (isOpfsBackendActive()) return resolveOpfsDirectory();
	return getIdbRoot();
};
var mappedRoots = /* @__PURE__ */ new Map([
	["/", resolveUserStorageRoot],
	["/user/", resolveUserStorageRoot],
	["/assets/", async () => {
		console.warn("Backend related API not implemented!");
		return null;
	}]
]);
var refreshMappedStorageRoots = () => {
	mappedRoots.set("/", resolveUserStorageRoot);
	mappedRoots.set("/user/", resolveUserStorageRoot);
	if (isOpfsBackendActive() && isIdbAvailable()) mappedRoots.set("/idb/", () => getIdbRoot());
	else mappedRoots.delete("/idb/");
};
bindStorageRootsRefresher(refreshMappedStorageRoots);
refreshMappedStorageRoots();
var isFsDirectoryHandle = (handle) => !!handle && handle.kind === "directory" && typeof handle.getDirectoryHandle === "function";
var currentHandleMap = /* @__PURE__ */ new Map();
/** Virtual Explorer / OPFS roots that `provide()` can read without HTTP. */
var isVirtualFsPath = (path) => {
	const raw = String(path || "").trim();
	if (!raw) return false;
	if (/^(?:https?:|blob:|data:|file:|mailto:)/i.test(raw)) return false;
	if (!raw.startsWith("/")) return false;
	let p = raw;
	try {
		if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(raw)) p = new URL(raw).pathname;
	} catch {}
	if (!p.startsWith("/")) p = `/${p}`;
	if (p === "/user" || p.startsWith("/user/") || p === "/idb" || p.startsWith("/idb/") || p === "/mounts" || p.startsWith("/mounts/") || p === "/sdcard" || p.startsWith("/sdcard/") || p === "/saf" || p.startsWith("/saf/") || p === "/desktop" || p.startsWith("/desktop/")) return true;
	for (const root of mappedRoots.keys()) {
		if (root === "/" || root === "/user/" || root === "/assets/") continue;
		if (p === root || p.startsWith(root) || `${p}/` === root) return true;
	}
	return false;
};
var matchMappedRoot = (path) => {
	let p = String(path || "").trim() || "/";
	try {
		if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(p)) p = new URL(p).pathname || p;
	} catch {}
	if (!p.startsWith("/")) p = `/${p}`;
	let best = null;
	let bestLen = -1;
	for (const [root, resolver] of mappedRoots.entries()) if (p === root || p.startsWith(root) || `${p}/` === root) {
		if (root.length > bestLen) {
			best = {
				root,
				resolver
			};
			bestLen = root.length;
		}
	}
	return best;
};
/**
* WHY: `getFileHandle` hyphen-rewrites OPFS `/user/` names. Local
* `showDirectoryPicker` trees must keep exact filenames (`My Image.png`).
*/
var walkExactFile = async (root, rel) => {
	const parts = String(rel || "").split("/").filter(Boolean);
	if (!parts.length) return null;
	let dir = root;
	for (const seg of parts.slice(0, -1)) try {
		dir = await dir.getDirectoryHandle(seg, { create: false });
	} catch {
		return null;
	}
	try {
		return await dir.getFileHandle(parts[parts.length - 1], { create: false });
	} catch {
		return null;
	}
};
/** Register a directory handle as a virtual root (`/mounts/<id>/`, etc.). */
var registerDirectoryRoot = (root, handle) => {
	if (!handle) return;
	const key = String(root || "").endsWith("/") ? String(root) : `${root}/`;
	if (!key.startsWith("/")) return;
	mappedRoots.set(key, async () => handle);
	const segs = key.split("/").filter(Boolean);
	if (segs[0] === "mounts" && segs[1]) currentHandleMap.set(segs[1], handle);
	currentHandleMap.set(key, handle);
};
var unregisterDirectoryRoot = (root) => {
	const key = String(root || "").endsWith("/") ? String(root) : `${root}/`;
	mappedRoots.delete(key);
	currentHandleMap.delete(key);
	const segs = key.split("/").filter(Boolean);
	if (segs[0] === "mounts" && segs[1]) currentHandleMap.delete(segs[1]);
};
var mountAsRoot = async (forId, copyFromInternal) => {
	const cleanId = forId?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((p) => !!p?.trim?.())?.at?.(0);
	const rootHandle = currentHandleMap?.get(cleanId) ?? await showDirectoryPicker?.({
		mode: "readwrite",
		id: `${cleanId}`
	})?.catch?.(console.warn.bind(console));
	if (rootHandle && cleanId && typeof cleanId == "string") currentHandleMap?.set?.(cleanId, rootHandle);
	if (rootHandle && typeof localStorage != "undefined") localStorage?.setItem?.("opfs.mounted", JSON.stringify([...JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]"), cleanId]));
	if (rootHandle) post("mount", {
		id: cleanId,
		handle: rootHandle
	});
	if (copyFromInternal && rootHandle && cleanId == "user") await copyFromOneHandlerToAnother(await navigator?.storage?.getDirectory?.(), rootHandle, {})?.catch?.(console.warn.bind(console));
	return rootHandle;
};
var unmountAsRoot = async (forId) => {
	if (typeof localStorage != "undefined") localStorage?.setItem?.("opfs.mounted", JSON.stringify(JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").filter((id) => id != forId)));
	post("unmount", { id: forId });
};
async function resolveRootHandle(rootHandle, relPath = "") {
	const fallbackRoot = async () => {
		if (isOpfsBackendActive()) return resolveOpfsDirectory();
		return getIdbRoot();
	};
	const mappedFromPath = matchMappedRoot(relPath);
	if ((rootHandle == null || rootHandle == void 0 || rootHandle?.trim?.()?.length == 0) && mappedFromPath && mappedFromPath.root !== "/") {
		const fromPath = await mappedFromPath.resolver().catch(() => null);
		if (fromPath) return fromPath;
	}
	if (rootHandle == null || rootHandle == void 0 || rootHandle?.trim?.()?.length == 0) rootHandle = "/user/";
	if (isFsDirectoryHandle(rootHandle)) return rootHandle;
	const cleanId = typeof rootHandle == "string" ? rootHandle?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((p) => !!p?.trim?.())?.at?.(0) : null;
	if (cleanId) {
		if (typeof localStorage != "undefined" && JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").includes(cleanId)) rootHandle = currentHandleMap?.get(cleanId);
		if (!rootHandle) rootHandle = await mappedRoots?.get?.(`/${cleanId}/`)?.() ?? await fallbackRoot();
	}
	if (isFsDirectoryHandle(rootHandle)) return rootHandle;
	const normalizedPath = relPath?.trim?.() || "/";
	const pathForMatch = normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;
	let bestMatch = null;
	let bestMatchLength = 0;
	for (const [rootPath, rootResolver] of mappedRoots.entries()) if (pathForMatch.startsWith(rootPath) && rootPath.length > bestMatchLength) {
		bestMatch = rootResolver;
		bestMatchLength = rootPath.length;
	}
	try {
		return (bestMatch ? await bestMatch() : null) || await fallbackRoot();
	} catch (error) {
		console.warn("Failed to resolve root handle, falling back to user storage:", error);
		return await fallbackRoot();
	}
}
function normalizePath(basePath = "", relPath) {
	if (!relPath?.trim()) return basePath;
	const cleanRelPath = relPath.trim();
	if (cleanRelPath.startsWith("/")) return cleanRelPath;
	const baseParts = basePath.split("/").filter((p) => p?.trim());
	const relParts = cleanRelPath.split("/").filter((p) => p?.trim());
	for (const part of relParts) if (part === ".") continue;
	else if (part === "..") {
		if (baseParts.length > 0) baseParts.pop();
	} else baseParts.push(part);
	return "/" + baseParts.join("/");
}
async function resolvePath(rootHandle, relPath, basePath = "") {
	const normalizedRelPath = normalizePath(basePath, relPath);
	return {
		rootHandle: await resolveRootHandle(rootHandle, normalizedRelPath),
		resolvedPath: normalizedRelPath
	};
}
function handleError(logger, status, message) {
	logger?.(status, message);
	return null;
}
function defaultLogger(status, message) {
	console.trace(`[${status}] ${message}`);
}
function getFileExtension(path) {
	return path?.trim?.()?.split?.(".")?.[1];
}
function detectTypeByRelPath(relPath) {
	if (relPath?.trim()?.endsWith?.("/")) return "directory";
	return "file";
}
function getMimeTypeByFilename(filename) {
	return {
		"txt": "text/plain",
		"md": "text/markdown",
		"html": "text/html",
		"htm": "text/html",
		"css": "text/css",
		"js": "application/javascript",
		"json": "application/json",
		"csv": "text/csv",
		"xml": "application/xml",
		"jpg": "image/jpeg",
		"jpeg": "image/jpeg",
		"png": "image/png",
		"gif": "image/gif",
		"webp": "image/webp",
		"svg": "image/svg+xml",
		"ico": "image/x-icon",
		"mp3": "audio/mpeg",
		"wav": "audio/wav",
		"mp4": "video/mp4",
		"webm": "video/webm",
		"pdf": "application/pdf",
		"zip": "application/zip",
		"rar": "application/vnd.rar",
		"7z": "application/x-7z-compressed"
	}[filename?.split?.(".")?.pop?.()?.toLowerCase?.()] || "application/octet-stream";
}
var hasFileExtension = (path) => {
	return path?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
};
async function getDirectoryHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
		const parts = stripStorageScopePrefix(resolvedPath).split("/").filter((p) => !!p?.trim?.());
		if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) parts?.pop?.();
		let dir = resolvedRoot;
		if (parts?.length > 0) for (const part of parts) {
			dir = await dir?.getDirectoryHandle?.(part, { create });
			if (!dir) break;
		}
		return dir;
	} catch (e) {
		return handleError(logger, "error", `getDirectoryHandle: ${e.message}`);
	}
}
async function getFileHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
		const cleanPath = stripStorageScopePrefix(resolvedPath);
		const parts = cleanPath.split("/").filter((d) => !!d?.trim?.());
		if (parts?.length == 0) return null;
		const filePath = parts.length > 0 ? parts[parts.length - 1]?.trim?.()?.replace?.(/\s+/g, "-") : "";
		const dirName = parts.length > 1 ? parts?.slice(0, -1)?.join?.("/")?.trim?.()?.replace?.(/\s+/g, "-") : "";
		if (cleanPath?.trim?.()?.endsWith?.("/")) return null;
		return (await getDirectoryHandle(resolvedRoot, dirName, {
			create,
			basePath
		}, logger))?.getFileHandle?.(filePath, { create });
	} catch (e) {
		return handleError(logger, "error", `getFileHandle: ${e.message}`);
	}
}
async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		if (detectTypeByRelPath(resolvedPath) == "directory") {
			const dir = await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ""), options, logger);
			if (dir) return {
				type: "directory",
				handle: dir
			};
		} else {
			const file = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
			if (file) return {
				type: "file",
				handle: file
			};
		}
		return null;
	} catch (e) {
		return handleError(logger, "error", `getHandler: ${e.message}`);
	}
}
async function createHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		if (detectTypeByRelPath(resolvedPath) == "directory") return await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ""), options, logger);
		else return await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
	} catch (e) {
		return handleError(logger, "error", `createHandler: ${e.message}`);
	}
}
var directoryCacheMap = /* @__PURE__ */ new Map();
var mayNotPromise = (pms, cb, errCb = console.warn.bind(console)) => {
	if (typeof pms?.then == "function") return pms?.then?.(cb)?.catch?.(errCb);
	else try {
		return cb(pms);
	} catch (e) {
		errCb(e);
		return null;
	}
};
function openDirectory(rootHandle, relPath, options = { create: false }, logger = defaultLogger) {
	let cacheKey = "";
	let localMapCache = observe(/* @__PURE__ */ new Map());
	const statePromise = (async () => {
		try {
			const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
			cacheKey = `${resolvedRootHandle?.name || "root"}:${resolvedPath}`;
			return {
				rootHandle: resolvedRootHandle,
				resolvedPath
			};
		} catch {
			return {
				rootHandle: null,
				resolvedPath: ""
			};
		}
	})().then(async ({ rootHandle, resolvedPath }) => {
		if (!resolvedPath) return null;
		const existing = directoryCacheMap.get(cacheKey);
		if (existing) {
			existing.refCount++;
			localMapCache = existing.mapCache;
			return existing;
		}
		const mapCache = observe(/* @__PURE__ */ new Map());
		localMapCache = mapCache;
		const observationId = UUIDv4();
		const dirHandlePromise = getDirectoryHandle(rootHandle, resolvedPath, options, logger);
		const updateCache = async () => {
			const cleanPath = stripStorageScopePrefix(resolvedPath);
			const dir = await dirHandlePromise;
			const entries = isIdbFsHandle(dir) || isIdbFsHandle(rootHandle) || !isOpfsBackendActive() ? await Promise.all(await Array.fromAsync(dir?.entries?.() ?? [])) : await post("readDirectory", {
				rootId: "",
				path: cleanPath,
				create: options.create
			}, rootHandle ? [rootHandle] : []);
			if (!entries) return mapCache;
			const entryMap = new Map(entries);
			for (const key of mapCache.keys()) if (!entryMap.has(key)) mapCache.delete(key);
			for (const [key, handle] of entryMap) if (!mapCache.has(key)) mapCache.set(key, handle);
			return mapCache;
		};
		const cleanup = () => {
			post("unobserve", { id: observationId });
			observers.delete(observationId);
			directoryCacheMap.delete(cacheKey);
		};
		observers.set(observationId, (changes) => {
			for (const change of changes) {
				if (!change?.name) continue;
				if (change.type === "modified" || change.type === "created" || change.type === "appeared") mapCache.set(change.name, change.handle);
				else if (change.type === "deleted" || change.type === "disappeared") mapCache.delete(change.name);
			}
		});
		const cleanPath = stripStorageScopePrefix(resolvedPath);
		if (!isIdbFsHandle(rootHandle) && isOpfsBackendActive()) post("observe", {
			rootId: "",
			path: cleanPath,
			id: observationId
		}, rootHandle ? [rootHandle] : []);
		updateCache();
		const newState = {
			mapCache,
			dirHandle: dirHandlePromise,
			resolvePath: resolvedPath,
			observationId,
			refCount: 1,
			cleanup,
			updateCache
		};
		directoryCacheMap.set(cacheKey, newState);
		const entries = await Promise.all(await Array.fromAsync((await dirHandlePromise)?.entries?.() ?? []));
		for (const [name, handle] of entries) if (!mapCache.has(name)) mapCache.set(name, handle);
		return {
			...newState,
			mapCache
		};
	});
	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		statePromise.then((s) => {
			if (!s) return;
			s.refCount--;
			if (s.refCount <= 0) s.cleanup();
		}).catch(console.warn);
	};
	const handler = {
		get(_target, prop) {
			if (prop === Symbol.toStringTag || prop === Symbol.iterator || prop === "toString" || prop === "valueOf" || prop === "inspect" || prop === "constructor" || prop === "__proto__" || prop === "prototype") return;
			if (prop === "dispose") return dispose;
			if (prop === "getMap") return () => localMapCache;
			if (prop === "entries") return () => localMapCache.entries();
			if (prop === "keys") return () => localMapCache.keys();
			if (prop === "values") return () => localMapCache.values();
			if (prop === Symbol.iterator) return () => localMapCache[Symbol.iterator]();
			if (prop === "size") return localMapCache.size;
			if (prop === "has") return (k) => localMapCache.has(k);
			if (prop === "get") return (k) => localMapCache.get(k);
			if (prop === "entries") return () => localMapCache.entries();
			if (prop === "keys") return () => localMapCache.keys();
			if (prop === "values") return () => localMapCache.values();
			if (prop === "refresh") return () => statePromise.then((s) => s?.updateCache?.()).then(() => pxy);
			if (prop === "then" || prop === "catch" || prop === "finally") {
				const p = statePromise.then(() => true);
				return p[prop].bind(p);
			}
			return (...args) => statePromise.then(async (s) => {
				if (!s) return void 0;
				const dh = await s.dirHandle;
				const v = dh?.[prop];
				if (typeof v === "function") return v.apply(dh, args);
				return v;
			});
		},
		ownKeys() {
			return Array.from(localMapCache.keys());
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		}
	};
	const fx = function() {};
	const pxy = new Proxy(fx, handler);
	return pxy;
}
async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		const cleanPath = stripStorageScopePrefix(resolvedPath);
		if (isIdbFsHandle(resolvedRoot) || !isOpfsBackendActive()) return await (await getFileHandle(resolvedRoot, resolvedPath, options, logger))?.getFile?.();
		return await post("readFile", {
			rootId: "",
			path: cleanPath,
			type: "blob"
		}, resolvedRoot ? [resolvedRoot] : []);
	} catch (e) {
		return handleError(logger, "error", `readFile: ${e.message}`);
	}
}
async function readAsObjectURL(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const file = await readFile(rootHandle, relPath, options, logger);
		return file ? URL.createObjectURL(file) : null;
	} catch (e) {
		return handleError(logger, "error", `readAsObjectURL: ${e.message}`);
	}
}
async function readFileUTF8(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const file = await readFile(rootHandle, relPath, options, logger);
		if (!file) return "";
		return await file.text();
	} catch (e) {
		return handleError(logger, "error", `readFileUTF8: ${e.message}`);
	}
}
async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
	if (data?.kind === "file" && typeof data.getFile === "function") data = await data.getFile();
	if (isFsDirectoryHandle(data)) {
		const dstHandle = await getDirectoryHandle(await resolveRootHandle(rootHandle, relPath), relPath + (relPath?.trim?.()?.endsWith?.("/") ? "" : "/") + (data?.name || "")?.trim?.()?.replace?.(/\s+/g, "-"), { create: true });
		return await copyFromOneHandlerToAnother(data, dstHandle, {})?.catch?.(console.warn.bind(console));
	} else try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, "");
		const cleanPath = stripStorageScopePrefix(resolvedPath);
		if (isIdbFsHandle(resolvedRoot) || !isOpfsBackendActive()) {
			const writable = await (await getFileHandle(resolvedRoot, resolvedPath, { create: true }, logger))?.createWritable?.();
			if (!writable) return false;
			await writable.write(data);
			await writable.close();
			return true;
		}
		return await post("writeFile", {
			rootId: "",
			path: cleanPath,
			data
		}, resolvedRoot ? [resolvedRoot] : []) !== false;
	} catch (e) {
		return handleError(logger, "error", `writeFile: ${e.message}`);
	}
}
async function getFileWriter(rootHandle, relPath, options = { create: true }, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		return (await getFileHandle(resolvedRootHandle, resolvedPath, options, logger))?.createWritable?.();
	} catch (e) {
		return handleError(logger, "error", `getFileWriter: ${e.message}`);
	}
}
async function removeFile(rootHandle, relPath, options = { recursive: true }, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		const candidates = storagePathCandidates(resolvedPath);
		if (isIdbFsHandle(resolvedRoot) || !isOpfsBackendActive()) {
			const parts = stripStorageScopePrefix(resolvedPath).split("/").filter((part) => !!part?.trim?.());
			if (!parts.length) return false;
			const name = parts.pop();
			const dir = await getDirectoryHandle(resolvedRoot, parts.join("/") || "/", { create: false }, logger);
			if (!dir) return false;
			await dir.removeEntry(name, { recursive: options.recursive });
			return true;
		}
		let lastResult = false;
		for (const candidate of candidates) {
			lastResult = await post("remove", {
				rootId: "",
				path: candidate,
				recursive: options.recursive
			}, resolvedRoot ? [resolvedRoot] : []);
			if (lastResult !== false) return true;
		}
		return lastResult !== false;
	} catch (e) {
		return handleError(logger, "error", `removeFile: ${e.message}`);
	}
}
async function removeDirectory(rootHandle, relPath, options = { recursive: true }, logger = defaultLogger) {
	try {
		return removeFile(rootHandle, relPath, options, logger);
	} catch (e) {
		return handleError(logger, "error", `removeDirectory: ${e.message}`);
	}
}
async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		return removeFile(rootHandle, relPath, {
			recursive: true,
			...options
		}, logger);
	} catch (e) {
		return handleError(logger, "error", `remove: ${e.message}`);
	}
}
var openImageFilePicker = async () => {
	const $e = "showOpenFilePicker";
	return (window?.[$e]?.bind?.(window) ?? (await import("./app18.js"))?.[$e])(imageImportDesc);
};
var downloadFile = async (file, filename) => {
	if (file instanceof FileSystemFileHandle) file = await file.getFile();
	if (typeof file == "string") file = asProvidedFile(await provide(file));
	filename = filename ?? file?.name;
	if (!filename) return;
	if ("msSaveOrOpenBlob" in self.navigator) self.navigator.msSaveOrOpenBlob(file, filename);
	if (file instanceof FileSystemDirectoryHandle) {
		let dstHandle = await showDirectoryPicker?.({ mode: "readwrite" })?.catch?.(console.warn.bind(console));
		if (file && dstHandle) {
			dstHandle = await getDirectoryHandle(dstHandle, file?.name || "", { create: true })?.catch?.(console.warn.bind(console)) || dstHandle;
			return await copyFromOneHandlerToAnother(file, dstHandle, {})?.catch?.(console.warn.bind(console));
		}
		return;
	}
	const fx = await (self?.showOpenFilePicker ? new Promise((r) => r({
		showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
		showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window)
	})) : import("./app18.js"));
	if (window?.showSaveFilePicker) {
		const writableFileStream = await (await fx?.showSaveFilePicker?.({ suggestedName: filename })?.catch?.(console.warn.bind(console)))?.createWritable?.({ keepExistingData: true })?.catch?.(console.warn.bind(console));
		await writableFileStream?.write?.(file)?.catch?.(console.warn.bind(console));
		await writableFileStream?.close?.()?.catch?.(console.warn.bind(console));
	} else {
		const a = document.createElement("a");
		try {
			a.href = URL.createObjectURL(file);
		} catch (e) {
			console.warn(e);
		}
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			globalThis.URL.revokeObjectURL(a.href);
		}, 0);
	}
};
var provide = async (req = "", rw = false, options) => {
	const requestUrl = (typeof req === "string" ? req : req?.url || "").trim();
	if (!requestUrl) return null;
	let pathname = requestUrl;
	try {
		pathname = new URL(requestUrl, location?.origin || self?.location?.origin || "http://localhost").pathname || requestUrl;
	} catch {}
	const cleanPath = pathname?.trim?.() || "/";
	const mapped = matchMappedRoot(cleanPath);
	const hostBackend = matchProvideBackend(cleanPath);
	const mappedRoot = mapped && mapped.root !== "/" && mapped.root !== "/assets/" ? mapped.root : cleanPath.startsWith("/idb") ? "/idb/" : cleanPath.startsWith("/user") ? "/user/" : "";
	if (mappedRoot) {
		const root = await resolveRootHandle(null, cleanPath).catch(() => null);
		if (isFsDirectoryHandle(root)) {
			const fromHandle = await provideFromHandle(root, cleanPath, mappedRoot, rw, options);
			if (fromHandle) return fromHandle;
		}
	}
	if (hostBackend) {
		const fromHost = await provideFromBackend(hostBackend, cleanPath, rw, options);
		if (fromHost) return fromHost;
	}
	if (isVirtualFsPath(cleanPath)) return null;
	if (rw) return null;
	try {
		const baseOrigin = String(location?.origin || self?.location?.origin || "").trim();
		const fetchTarget = cleanPath.startsWith("/") ? new URL(cleanPath, baseOrigin || "http://localhost").toString() : requestUrl;
		const r = await fetch(fetchTarget);
		const blob = await r?.blob()?.catch?.(console.warn.bind(console));
		const lastModifiedHeader = r?.headers?.get?.("Last-Modified");
		const lastModified = lastModifiedHeader ? Date.parse(lastModifiedHeader) : 0;
		if (blob) {
			const fallbackName = cleanPath?.substring?.(cleanPath?.lastIndexOf?.("/") + 1) || "resource";
			return new File([blob], fallbackName, {
				type: blob?.type,
				lastModified: isNaN(lastModified) ? 0 : lastModified
			});
		}
	} catch (e) {
		return handleError(defaultLogger, "error", `provide: ${e.message}`);
	}
	return null;
};
var getLeast = (item) => {
	if (item?.types?.length > 0) return item?.getType?.(Array.from(item?.types || [])?.at?.(-1));
	return null;
};
var dropFile = async (file, dest = "/user/".trim?.()?.replace?.(/\s+/g, "-"), current) => {
	const fs = await resolveRootHandle(null);
	const user = getDir(stripStorageScopePrefix(dest))?.replace?.("/user", "")?.trim?.();
	file = file instanceof File ? file : new File([file], UUIDv4() + "." + (file?.type?.split?.("/")?.[1] || "tmp"));
	const fp = user + (file?.name || "wallpaper")?.trim?.()?.replace?.(/\s+/g, "-");
	await writeFile(fs, fp, file);
	current?.set?.("/user" + fp?.trim?.()?.replace?.(/\s+/g, "-"), file);
	return "/user" + fp?.trim?.();
};
var uploadDirectory = async (dest = "/user/", id = null) => {
	dest = stripStorageScopePrefix(dest);
	if (!globalThis.showDirectoryPicker) return;
	const srcHandle = await showDirectoryPicker?.({
		mode: "readonly",
		id
	})?.catch?.(console.warn.bind(console));
	if (!srcHandle) return;
	const dstHandle = await getDirectoryHandle(await resolveRootHandle(null), dest + (dest?.trim?.()?.endsWith?.("/") ? "" : "/") + srcHandle.name?.trim?.()?.replace?.(/\s+/g, "-"), { create: true });
	if (!dstHandle) return;
	return await copyFromOneHandlerToAnother(srcHandle, dstHandle, {})?.catch?.(console.warn.bind(console));
};
var uploadFile = async (dest = "/user/".trim?.()?.replace?.(/\s+/g, "-"), current) => {
	const $e = "showOpenFilePicker";
	dest = stripStorageScopePrefix(dest);
	return (window?.[$e]?.bind?.(window) ?? (await import("./app18.js"))?.[$e])({
		...generalFileImportDesc,
		multiple: true
	})?.then?.(async (handles = []) => {
		for (const handle of handles) await dropFile(handle instanceof File ? handle : await handle?.getFile?.(), dest, current);
	});
};
var ghostImage = typeof Image != "undefined" ? new Image() : null;
if (ghostImage) {
	ghostImage.decoding = "async";
	ghostImage.width = 24;
	ghostImage.height = 24;
	try {
		ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], { type: "image/svg+xml" }));
	} catch (e) {}
}
var attachFile = (transfer, file, path = "") => {
	try {
		const url = URL.createObjectURL(file);
		if (file?.type && file?.type != "text/plain") transfer?.items?.add?.(file, file?.type || "text/plain");
		else transfer?.add?.(file);
		if (path) transfer?.items?.add?.(path, "text/plain");
		transfer?.setData?.("text/uri-list", url);
		transfer?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
	} catch (e) {}
};
var dropAsTempFile = async (data) => {
	const item = (data?.items)?.[0];
	const isImage = item?.types?.find?.((n) => n?.startsWith?.("image/"));
	return dropFile(await (data?.files?.[0] ?? ((isImage ? item?.getType?.(isImage) : null) || getLeast(item))), "/user/temp/".trim?.()?.replace?.(/\s+/g, "-"));
};
var clearAllInDirectory = async (rootHandle = null, relPath = "", options = {}, logger = defaultLogger) => {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		const cleanPath = stripStorageScopePrefix(resolvedPath);
		if (isIdbFsHandle(resolvedRoot) || !isOpfsBackendActive()) return removeFile(resolvedRoot, resolvedPath, {
			recursive: true,
			basePath: options?.basePath
		}, logger);
		await post("remove", {
			rootId: "",
			path: cleanPath,
			recursive: true
		}, resolvedRoot ? [resolvedRoot] : []);
	} catch (e) {
		return handleError(logger, "error", `clearAllInDirectory: ${e.message}`);
	}
};
var copyFromOneHandlerToAnother = async (fromHandle, toHandle, options = {}, logger = defaultLogger) => {
	if (isIdbFsHandle(fromHandle) || isIdbFsHandle(toHandle) || !isOpfsBackendActive()) return copyHandleTree(fromHandle, toHandle);
	return post("copy", {
		from: fromHandle,
		to: toHandle
	}, [fromHandle, toHandle]);
};
var handleIncomingEntries = (data, destPath = "/user/", rootHandle = null, onItemHandled) => {
	const tasks = [];
	const items = Array.from(data?.items ?? []);
	const files = Array.from(data?.files ?? []);
	const dataArray = Array.isArray(data) ? data : [...data?.[Symbol.iterator] ? data : [data]];
	return Promise.try(async () => {
		const resolvedRoot = await resolveRootHandle(rootHandle);
		const processItem = async (item) => {
			let handle;
			if (item.kind === "file" || item.kind === "directory") try {
				handle = await item.getAsFileSystemHandle?.();
			} catch {}
			if (handle) {
				if (handle.kind === "directory") {
					const nwd = await getDirectoryHandle(resolvedRoot, destPath + (handle.name || "").trim().replace(/\s+/g, "-"), { create: true });
					if (nwd) tasks.push(copyFromOneHandlerToAnother(handle, nwd, { create: true }));
				} else {
					const file = await handle.getFile();
					const path = destPath + (file.name || handle.name).trim().replace(/\s+/g, "-");
					tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
				}
				return;
			}
			if (item.kind === "file" || item instanceof File) {
				const file = item instanceof File ? item : item.getAsFile();
				if (file) {
					const path = destPath + file.name.trim().replace(/\s+/g, "-");
					tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
				}
				return;
			}
		};
		if (items?.length > 0) for (const item of items) await processItem(item);
		if (files?.length > 0) for (const file of files) await processItem(file);
		if (dataArray?.length > 0) for (const item of dataArray) await processItem(item);
		const uriList = data?.getData?.("text/uri-list") || data?.getData?.("text/plain");
		if (uriList && typeof uriList === "string") {
			const urls = uriList.split(/\r?\n/).filter(Boolean);
			for (const url of urls) {
				if (url.startsWith("file://")) continue;
				if (url.startsWith("/user/")) {
					const src = url.trim();
					tasks.push(Promise.try(async () => {
						const srcHandle = await getHandler(resolvedRoot, src);
						if (srcHandle?.handle) {
							const name = src.split("/").filter(Boolean).pop();
							if (srcHandle.type === "directory") {
								const nwd = await getDirectoryHandle(resolvedRoot, destPath + name, { create: true });
								await copyFromOneHandlerToAnother(srcHandle.handle, nwd, { create: true });
							} else {
								const file = await srcHandle.handle.getFile();
								const path = destPath + name;
								await writeFile(resolvedRoot, path, file);
								onItemHandled?.(file, path);
							}
						}
					}));
				} else tasks.push(Promise.try(async () => {
					const file = asProvidedFile(await provide(url));
					if (file) {
						const path = destPath + file.name;
						await writeFile(resolvedRoot, path, file);
						onItemHandled?.(file, path);
					}
				}));
			}
		}
		if (dataArray?.[0] instanceof ClipboardItem) {
			for (const item of dataArray) for (const type of item.types) if (type.startsWith("image/") || type.startsWith("text/")) {
				const blob = await item.getType(type);
				const ext = type.split("/")[1].split("+")[0] || "txt";
				const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type });
				const path = destPath + file.name;
				tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
			}
		}
		await Promise.allSettled(tasks).catch(console.warn.bind(console));
	});
};
//#endregion
export { uploadFile as $, isVirtualFsPath as A, readAsObjectURL as B, getMimeTypeByFilename as C, setOpfsSupportEnabled as Ct, hasFileExtension as D, handleIncomingEntries as E, normalizePath as F, remove as G, readFileUTF8 as H, openDirectory as I, resolvePath as J, removeDirectory as K, openImageFilePicker as L, matchMappedRoot as M, mayNotPromise as N, imageImportDesc as O, mountAsRoot as P, uploadDirectory as Q, post as R, getLeast as S, normalizeIdbNodePath as St, handleError as T, refreshMappedStorageRoots as U, readFile as V, registerDirectoryRoot as W, unmountAsRoot as X, resolveRootHandle as Y, unregisterDirectoryRoot as Z, getDirectoryHandle as _, isIdbAvailable as _t, createHandler as a, registerProvideBackend as at, getFileWriter as b, isOpfsCapabilityAvailable as bt, detectTypeByRelPath as c, IDB_FS_ROOT as ct, downloadFile as d, OPFS_SUPPORT_KEY as dt, walkExactFile as et, dropAsTempFile as f, bindStorageRootsRefresher as ft, getDir as g, getIdbRoot as gt, generalFileImportDesc as h, createMemoryIdbFsStore as ht, copyFromOneHandlerToAnother as i, matchProvideBackend as it, mappedRoots as j, isFsDirectoryHandle as k, directHandlers as l, IdbDirectoryHandle as lt, ensureWorker as m, createIndexedDbFsStore as mt, attachFile as n, asProvidedFile as nt, currentHandleMap as o, unregisterProvideBackend as ot, dropFile as p, copyHandleTree as pt, removeFile as q, clearAllInDirectory as r, isProvidedDirectory as rt, defaultLogger as s, wantsDirectoryProvide as st, OPFS_exports as t, writeFile as tt, directoryCacheMap as u, IdbFileHandle as ut, getFileExtension as v, isIdbFsHandle as vt, ghostImage as w, getHandler as x, isOpfsSupportEnabled as xt, getFileHandle as y, isOpfsBackendActive as yt, provide as z };
