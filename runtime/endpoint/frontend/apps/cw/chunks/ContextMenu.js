import { E as MOCElement } from "../fest/dom.js";
import { t as isUserScopePath } from "../fest/core.js";
import { c as ref, n as affected, o as observe } from "../fest/object.js";
import { c as getMimeTypeByFilename, d as provide, f as readFile, h as writeFile, i as downloadFile, l as handleIncomingEntries, m as uploadFile, o as getDirectoryHandle, p as remove, r as copyFromOneHandlerToAnother, s as getFileHandle, u as openDirectory } from "../com/app2.js";
import { n as resolveOverlayMountPoint } from "../shells/slots.js";
//#region ../../modules/views/explorer-view/src/ts/Operative.ts
var handleCache = /* @__PURE__ */ new WeakMap();
var waitForClipboardFrame = () => new Promise((resolve) => {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(() => resolve());
		return;
	}
	if (typeof MessageChannel !== "undefined") {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => resolve();
		channel.port2.postMessage(void 0);
		return;
	}
	if (typeof setTimeout === "function") {
		setTimeout(() => resolve(), 16);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(() => resolve());
		return;
	}
	resolve();
});
/**
* Accept File objects from the page, an iframe, or a WebView realm.
* `instanceof File` is not reliable across those realms.
*/
var isFileLike = (value) => Boolean(value && typeof value === "object" && typeof value.name === "string" && typeof value.size === "number" && (typeof value.arrayBuffer === "function" || typeof value.stream === "function"));
var ASSETS_ROOT = "/assets/";
var ASSET_SEED_PATHS = [
	"/assets/crossword.css",
	"/assets/icons/",
	"/assets/imgs/",
	"/assets/wallpapers/"
];
var ASSET_ICON_STYLES = [
	"thin",
	"light",
	"regular",
	"bold",
	"fill",
	"duotone"
];
var ASSET_ICON_FALLBACK_NAMES = [
	"copy",
	"clipboard",
	"trash",
	"folder",
	"folder-open",
	"download",
	"upload",
	"arrow-up",
	"arrow-clockwise",
	"code",
	"eye",
	"gear",
	"printer",
	"file-doc",
	"file-text",
	"lightning",
	"pencil",
	"clock-counter-clockwise"
];
var normalizeDirectoryPath = (input) => {
	const value = (input || "/").trim() || "/";
	const withLeading = value.startsWith("/") ? value : `/${value}`;
	return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
};
var isAssetsPath = (path) => normalizeDirectoryPath(path).startsWith(ASSETS_ROOT);
var isVirtualRootPath = (path) => normalizeDirectoryPath(path) === "/";
var isReadonlyPath = (path) => isAssetsPath(path) || isVirtualRootPath(path);
var isIconsPath = (path) => normalizeDirectoryPath(path).startsWith("/assets/icons/");
var isUserPath = (path) => isUserScopePath(normalizeDirectoryPath(path));
/**
* External ingress may target the virtual root, which is redirected to `/user/`.
* Keep this predicate shared with the context-menu layer so Paste visibility
* cannot drift from the actual drop/paste acceptance rules.
*/
var canReceiveIncomingPath = (path) => {
	const normalized = normalizeDirectoryPath(path);
	return isVirtualRootPath(normalized) || isUserPath(normalized);
};
var buildVirtualAssetPaths = (path) => {
	const target = normalizeDirectoryPath(path);
	const paths = /* @__PURE__ */ new Set();
	if (!isIconsPath(target)) return [];
	paths.add("/assets/icons/");
	paths.add("/assets/icons/phosphor/");
	paths.add("/assets/icons/duotone/");
	for (const style of ASSET_ICON_STYLES) {
		paths.add(`/assets/icons/phosphor/${style}/`);
		paths.add(`/assets/icons/${style}/`);
	}
	const addIconFiles = (base) => {
		for (const iconName of ASSET_ICON_FALLBACK_NAMES) paths.add(`${base}${iconName}.svg`);
	};
	if (target === "/assets/icons/" || target === "/assets/icons/duotone/") addIconFiles("/assets/icons/duotone/");
	if (target.startsWith("/assets/icons/phosphor/")) {
		const parts = target.split("/").filter(Boolean);
		if (parts.length >= 4) {
			const style = parts[3];
			if (ASSET_ICON_STYLES.includes(style)) addIconFiles(`/assets/icons/phosphor/${style}/`);
		}
	}
	if (target.startsWith("/assets/icons/")) {
		const parts = target.split("/").filter(Boolean);
		if (parts.length >= 3) {
			const style = parts[2];
			if (ASSET_ICON_STYLES.includes(style)) addIconFiles(`/assets/icons/${style}/`);
		}
	}
	return Array.from(paths);
};
var FileOperative = class {
	#entries = ref([]);
	#loading = ref(false);
	#error = ref("");
	#fsRoot = null;
	#dirProxy = null;
	#loadLock = false;
	#clipboard = null;
	#subscribed = null;
	#loaderDebounceTimer = null;
	#readonly = ref(false);
	host = null;
	pathRef = ref("/");
	get path() {
		return this.pathRef?.value || "/";
	}
	set path(value) {
		if (this.pathRef) this.pathRef.value = value || "/";
	}
	get entries() {
		return this.#entries;
	}
	get readonly() {
		return this.#readonly?.value === true;
	}
	constructor() {
		this.#entries = ref([]);
		this.pathRef ??= ref("/");
		affected(this.pathRef, (path) => {
			this.#readonly.value = isReadonlyPath(path || "/");
			this.loadPath(path || "/");
		});
		navigator?.storage?.getDirectory?.()?.then?.((h) => {
			this.#fsRoot = h;
			this.refreshList(this.path || "/");
		});
	}
	async listAssetEntries(path) {
		const target = normalizeDirectoryPath(path);
		const knownPaths = new Set(ASSET_SEED_PATHS);
		for (const virtualPath of buildVirtualAssetPaths(target)) knownPaths.add(virtualPath);
		try {
			const cacheNames = await caches.keys();
			for (const cacheName of cacheNames) try {
				const requests = await (await caches.open(cacheName)).keys();
				for (const req of requests) {
					const pathname = new URL(req.url).pathname;
					if (pathname.startsWith(ASSETS_ROOT)) knownPaths.add(pathname);
				}
			} catch {}
		} catch {}
		const dirs = /* @__PURE__ */ new Set();
		const files = [];
		for (const full of knownPaths) {
			const normalized = full.startsWith("/") ? full : `/${full}`;
			if (!normalized.startsWith(target)) continue;
			const remainder = normalized.slice(target.length);
			if (!remainder) continue;
			const [firstSegment, ...rest] = remainder.split("/").filter(Boolean);
			if (!firstSegment) continue;
			if (rest.length > 0 || normalized.endsWith("/")) dirs.add(firstSegment);
			else files.push(firstSegment);
		}
		const directoryEntries = Array.from(dirs).sort((a, b) => a.localeCompare(b)).map((name) => observe({
			name,
			kind: "directory"
		}));
		const fileEntries = Array.from(new Set(files)).filter((name) => !dirs.has(name)).sort((a, b) => a.localeCompare(b)).map((name) => {
			const item = observe({
				name,
				kind: "file"
			});
			item.type = getMimeTypeByFilename?.(name);
			return item;
		});
		return [...directoryEntries, ...fileEntries];
	}
	listVirtualRootEntries() {
		return [observe({
			name: "user",
			kind: "directory"
		}), observe({
			name: "assets",
			kind: "directory"
		})];
	}
	detachDirectoryObservers() {
		if (this.#loaderDebounceTimer) {
			clearTimeout(this.#loaderDebounceTimer);
			this.#loaderDebounceTimer = null;
		}
		if (typeof this.#subscribed === "function") {
			this.#subscribed();
			this.#subscribed = null;
		}
		if (this.#dirProxy?.dispose) this.#dirProxy.dispose();
		this.#dirProxy = null;
	}
	async collectDirectoryEntries() {
		const source = await this.#dirProxy?.entries?.();
		let pairs = [];
		if (Array.isArray(source)) pairs = source;
		else if (source && typeof source[Symbol.iterator] === "function") pairs = Array.from(source);
		else if (source && typeof source[Symbol.asyncIterator] === "function") for await (const pair of source) pairs.push(pair);
		return (await Promise.all((pairs || []).map(async ($pair) => {
			return Promise.try(async () => {
				const [name, handle] = $pair;
				return handleCache?.getOrInsertComputed?.(handle, async () => {
					const kind = handle?.kind || (name?.endsWith?.("/") ? "directory" : "file");
					const item = observe({
						name,
						kind,
						handle
					});
					if (kind === "file") {
						item.type = getMimeTypeByFilename?.(name);
						try {
							const f = await handle?.getFile?.();
							item.file = f;
							item.size = f?.size;
							item.lastModified = f?.lastModified;
							item.type = f?.type || item.type;
						} catch {}
					}
					return item;
				});
			})?.catch?.(console.warn.bind(console));
		})))?.filter?.(($item) => $item != null) || [];
	}
	async getDirectoryHandleByPath(path, create = false) {
		const root = this.#fsRoot || await navigator?.storage?.getDirectory?.();
		if (!root) return null;
		const parts = normalizeDirectoryPath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	normalizeUserRelativePath(path) {
		const normalized = normalizeDirectoryPath(path);
		if (normalized === "/user/") return "/";
		if (normalized.startsWith("/user/")) return normalized.slice(5);
		return normalized;
	}
	async getOpfsRootHandle() {
		this.#fsRoot = this.#fsRoot || await navigator?.storage?.getDirectory?.();
		return this.#fsRoot;
	}
	async getUserDirHandle(path, create = false) {
		const root = await this.getOpfsRootHandle();
		if (!root) return null;
		const parts = this.normalizeUserRelativePath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	async writeUserFile(file, destPath = this.path) {
		const dir = await this.getUserDirHandle(destPath, true);
		if (!dir) return;
		const safeName = (file?.name || `file-${Date.now()}`).trim().replace(/\s+/g, "-");
		const writable = await (await dir.getFileHandle(safeName, { create: true })).createWritable();
		await writable.write(file);
		await writable.close();
	}
	/**
	* Select files without assuming the File System Access constructors exist.
	* Some shells expose a `showOpenFilePicker` polyfill that throws while
	* evaluating `FileSystemHandle`; a normal file input is the safe fallback.
	*/
	async pickFilesForUpload() {
		const picker = globalThis?.showOpenFilePicker;
		if (typeof picker === "function" && typeof globalThis?.FileSystemHandle === "function") {
			const handles = await picker({ multiple: true }).catch(() => []);
			const files = [];
			for (const handle of handles || []) {
				const file = await handle?.getFile?.().catch?.(() => null);
				if (isFileLike(file)) files.push(file);
			}
			return files;
		}
		if (typeof document === "undefined") return [];
		return new Promise((resolve) => {
			const input = document.createElement("input");
			input.type = "file";
			input.multiple = true;
			input.style.cssText = "position:fixed;inline-size:1px;block-size:1px;opacity:0;pointer-events:none;";
			let settled = false;
			const finish = (files = []) => {
				if (settled) return;
				settled = true;
				input.remove();
				resolve(files);
			};
			input.addEventListener("change", () => {
				finish(Array.from(input.files || []).filter(isFileLike));
			}, { once: true });
			input.addEventListener("cancel", () => finish(), { once: true });
			(document.body || document.documentElement).appendChild(input);
			input.click();
		});
	}
	/**
	* Resolve the only writable destinations for external file ingress.
	* The virtual root is a navigation scope, so root drops/pastes are stored
	* in `/user/` and then surfaced by navigating there.
	*/
	incomingDestinationPath() {
		const currentPath = normalizeDirectoryPath(this.path);
		if (canReceiveIncomingPath(currentPath) && isUserPath(currentPath)) return currentPath;
		if (isVirtualRootPath(currentPath)) return "/user/";
		return null;
	}
	/**
	* Capture directory-handle promises during the original drop event.
	*
	* WHY: Chromium exposes `getAsFileSystemHandle()` only during the same
	* event turn. Calling it after `extractFilesFromData()` has awaited, or
	* calling it from an insecure HTTP page, can terminate the renderer with
	* RESULT_CODE_KILLED_BAD_MESSAGE instead of throwing a normal exception.
	*/
	captureDirectoryHandlePromises(data) {
		if (globalThis.isSecureContext !== true) return [];
		const promises = [];
		for (const item of Array.from(data?.items ?? [])) {
			if (item?.kind !== "file" || typeof item?.getAsFileSystemHandle !== "function") continue;
			let legacyEntry = null;
			try {
				legacyEntry = item.webkitGetAsEntry?.() ?? null;
			} catch {}
			if (legacyEntry && !legacyEntry.isDirectory) continue;
			if (!legacyEntry) try {
				if (isFileLike(item.getAsFile?.())) continue;
			} catch {}
			try {
				promises.push(Promise.resolve(item.getAsFileSystemHandle()));
			} catch {}
		}
		return promises;
	}
	async ingestIncomingData(data, destination, directoryHandlePromises = []) {
		const files = await this.extractFilesFromData(data);
		const directories = (await Promise.allSettled(directoryHandlePromises)).flatMap((result) => result.status === "fulfilled" && result.value?.kind === "directory" ? [result.value] : []);
		if (files.length > 0) for (const file of files) await this.writeUserFile(file, destination);
		for (const directory of directories) {
			const name = String(directory?.name || `folder-${Date.now()}`).trim().replace(/\s+/g, "-");
			const target = await getDirectoryHandle(this.#fsRoot, `${destination}${name}`, { create: true });
			if (target) await copyFromOneHandlerToAnother(directory, target, { create: true });
		}
		if (files.length > 0 || directories.length > 0) return;
		const transferItems = Array.from(data?.items ?? []);
		const getData = (type) => data?.getData?.(type) || "";
		const uriList = getData("text/uri-list");
		const plainText = getData("text/plain");
		if (transferItems.length > 0) {
			if (!uriList && !plainText) return;
			await handleIncomingEntries({ getData }, destination, this.#fsRoot);
			return;
		}
		await handleIncomingEntries(data, destination, this.#fsRoot);
	}
	async finishIncoming(destination) {
		if (isVirtualRootPath(this.path)) this.path = destination;
		await this.refreshList(this.path);
	}
	/**
	* Imperative save API for shells/channels — writes into the OPFS-backed workspace folder.
	* Defaults to {@link FileOperative.path}; optional `destPath` overrides the parent directory.
	*/
	async ingestFileIntoWorkspace(file, destPath) {
		await this.writeUserFile(file, destPath ?? this.path);
	}
	async removeUserEntry(absPath, recursive = true) {
		const root = await this.getOpfsRootHandle();
		if (!root) return false;
		const parts = this.normalizeUserRelativePath(absPath).replace(/\/+$/g, "").split("/").filter(Boolean);
		if (!parts.length) return false;
		const name = parts.pop();
		let dir = root;
		for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
		await dir.removeEntry(name, { recursive });
		return true;
	}
	async renameUserFile(absPath, newName) {
		const root = await this.getOpfsRootHandle();
		if (!root) return;
		const parts = this.normalizeUserRelativePath(absPath).replace(/\/+$/g, "").split("/").filter(Boolean);
		if (!parts.length) return;
		const oldName = parts.pop();
		let dir = root;
		for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
		const oldFile = await (await dir.getFileHandle(oldName, { create: false })).getFile();
		const safeName = (newName || "").trim().replace(/\s+/g, "-");
		if (!safeName || safeName === oldName) return;
		const writable = await (await dir.getFileHandle(safeName, { create: true })).createWritable();
		await writable.write(oldFile);
		await writable.close();
		await dir.removeEntry(oldName);
	}
	async extractFilesFromData(data) {
		const files = [];
		const now = Date.now();
		const extByMime = (mime) => {
			const m = (mime || "").toLowerCase();
			if (m.includes("css")) return "css";
			if (m.includes("json")) return "json";
			if (m.includes("markdown")) return "md";
			if (m.includes("svg")) return "svg";
			if (m.includes("png")) return "png";
			if (m.includes("jpeg") || m.includes("jpg")) return "jpg";
			if (m.includes("gif")) return "gif";
			if (m.includes("webp")) return "webp";
			if (m.includes("plain")) return "txt";
			return "bin";
		};
		const nativeFiles = Array.from(data?.files ?? []).filter(isFileLike);
		files.push(...nativeFiles);
		const items = Array.from(data?.items ?? []);
		for (const item of items) {
			if (item?.kind === "file" && typeof item?.getAsFile === "function") {
				const f = item.getAsFile();
				if (isFileLike(f)) files.push(f);
				continue;
			}
			const types = Array.from(item?.types ?? []);
			if (typeof item?.getType === "function" && types.length > 0) {
				const type = String(types[0] || "");
				try {
					const blob = await item.getType(type);
					if (!blob) continue;
					const ext = extByMime(blob.type || type);
					files.push(new File([blob], `clipboard-${now}-${files.length}.${ext}`, {
						type: blob.type || type,
						lastModified: now
					}));
				} catch {}
			}
		}
		return files;
	}
	async readEntriesFromDirectory(dir) {
		if (!dir) return [];
		const entries = [];
		for await (const [name, handle] of dir.entries()) {
			const kind = handle?.kind || (name?.endsWith?.("/") ? "directory" : "file");
			const item = observe({
				name,
				kind,
				handle
			});
			if (kind === "file") {
				item.type = getMimeTypeByFilename?.(name);
				try {
					const f = await handle?.getFile?.();
					item.file = f;
					item.size = f?.size;
					item.lastModified = f?.lastModified;
					item.type = f?.type || item.type;
				} catch {}
			}
			entries.push(item);
		}
		return entries;
	}
	async listUserEntriesDirect(path, createIfMissing = false) {
		const normalized = normalizeDirectoryPath(path);
		const strippedPath = normalized.replace(/^\/user\/?/, "/");
		const legacyPath = normalized;
		const dirs = [];
		const tryPush = (dir) => {
			if (!dir) return;
			if (!dirs.includes(dir)) dirs.push(dir);
		};
		tryPush(await this.getDirectoryHandleByPath(strippedPath, false).catch(() => null));
		if (legacyPath !== strippedPath) tryPush(await this.getDirectoryHandleByPath(legacyPath, false).catch(() => null));
		if (!dirs.length && createIfMissing) tryPush(await this.getDirectoryHandleByPath(strippedPath, true).catch(() => null));
		const merged = /* @__PURE__ */ new Map();
		for (const dir of dirs) {
			const chunk = await this.readEntriesFromDirectory(dir);
			for (const entry of chunk) {
				if (!entry?.name) continue;
				const key = `${entry.kind}:${entry.name}`;
				if (!merged.has(key)) merged.set(key, entry);
			}
		}
		return Array.from(merged.values());
	}
	applyEntries(entries) {
		const unique = /* @__PURE__ */ new Map();
		for (const entry of entries || []) {
			if (!entry || !entry.name) continue;
			const key = `${entry.kind}:${entry.name}`;
			if (!unique.has(key)) unique.set(key, entry);
		}
		this.#entries.value = Array.from(unique.values());
		this.dispatchEvent(new CustomEvent("entries-updated", {
			detail: {
				path: this.path,
				count: unique.size
			},
			bubbles: true,
			composed: true
		}));
	}
	async itemAction(item) {
		const self = this;
		const detail = {
			path: (self.path || "/") + item?.name,
			item,
			originalEvent: null
		};
		const event = new CustomEvent("open-item", {
			detail,
			bubbles: true,
			composed: true,
			cancelable: true
		});
		this.host?.dispatchEvent(event);
		if (event.defaultPrevented) return;
		if (item?.kind === "directory") self.path = (self.path?.endsWith?.("/") ? self.path : self.path + "/") + item?.name + "/";
		else {
			const abs = (self.path || "/") + (item?.name || "");
			if (!item?.file && isAssetsPath(abs)) {
				item.file = await provide(abs).catch(() => null);
				if (item.file) {
					item.size = item.file.size;
					item.lastModified = item.file.lastModified;
					item.type = item.file.type || item.type;
				}
			}
			const openEvent = new CustomEvent("open", {
				detail,
				bubbles: true,
				composed: true
			});
			this.host?.dispatchEvent(openEvent);
		}
	}
	async requestUse() {}
	async refreshList(path = this.path) {
		await this.loadPath(path);
		return this;
	}
	async loadPath(path = this.path) {
		if (this.#loadLock) {
			if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(() => this.loadPath(path), { timeout: 1e3 });
			return globalThis.setTimeout(() => this.loadPath(path), 0);
		}
		this.#loadLock = true;
		try {
			this.#loading.value = true;
			this.#error.value = "";
			const rel = normalizeDirectoryPath(path?.value || path || this.path || "/");
			this.detachDirectoryObservers();
			if (isVirtualRootPath(rel)) {
				this.applyEntries(this.listVirtualRootEntries());
				return this;
			}
			if (isAssetsPath(rel)) {
				this.applyEntries(await this.listAssetEntries(rel));
				return this;
			}
			if (isUserPath(rel)) {
				const entries = await this.listUserEntriesDirect(rel, true);
				this.applyEntries(entries);
				return this;
			}
			try {
				this.#dirProxy = openDirectory(this.#fsRoot, rel, { create: false });
				await this.#dirProxy;
			} catch (openErr) {
				if (!isUserPath(rel)) throw openErr;
				this.#dirProxy = openDirectory(this.#fsRoot, rel, { create: true });
				await this.#dirProxy;
			}
			console.log("rel", rel);
			const loader = async () => {
				const entries = await this.collectDirectoryEntries();
				if (entries?.length != null && entries?.length >= 0 && typeof entries?.length == "number") this.applyEntries(entries);
			};
			const debouncedLoader = () => {
				if (this.#loaderDebounceTimer) clearTimeout(this.#loaderDebounceTimer);
				this.#loaderDebounceTimer = setTimeout(() => loader(), 50);
			};
			await loader()?.catch?.(console.warn.bind(console));
			this.#subscribed = affected(await this.#dirProxy?.getMap?.() ?? [], debouncedLoader);
		} catch (e) {
			this.#error.value = e?.message || String(e || "");
			this.applyEntries([]);
			console.warn(e);
		} finally {
			this.#loading.value = false;
			this.#loadLock = false;
		}
		return this;
	}
	onRowClick = (item, ev) => {
		ev.preventDefault();
		this.itemAction(item);
	};
	onRowDblClick = (item, ev) => {
		ev.preventDefault();
		this.itemAction(item);
	};
	onRowDragStart = (item, ev) => {
		if (!ev.dataTransfer) return;
		ev.dataTransfer.effectAllowed = "copyMove";
		const abs = (this.path || "/") + (item?.name || "");
		ev.dataTransfer.setData("text/plain", abs);
		ev.dataTransfer.setData("text/uri-list", abs);
		if (item?.file) {
			ev.dataTransfer.setData("DownloadURL", item?.file?.type + ":" + item?.file?.name + ":" + URL.createObjectURL(item?.file));
			ev.dataTransfer.items.add(item?.file);
		}
	};
	async onMenuAction(item, actionId, ev) {
		try {
			const itemName = item?.name;
			if (!actionId) return;
			const abs = (this.path || "/") + (itemName || "");
			switch (actionId) {
				case "delete":
				case "rename":
				case "movePath":
					if (this.readonly || isReadonlyPath(abs)) {
						this.dispatchEvent(new CustomEvent("readonly-blocked", {
							detail: {
								action: actionId,
								path: abs
							},
							bubbles: true,
							composed: true
						}));
						break;
					}
					if (actionId === "delete") {
						if (isUserPath(abs)) await this.removeUserEntry(abs, true);
						else await remove(this.#fsRoot, abs);
						await this.refreshList(this.path);
						break;
					}
					if (actionId === "rename") {
						if (item?.kind === "file") {
							const next = prompt("Rename to:", itemName);
							if (next && next !== itemName) {
								if (isUserPath(abs)) await this.renameUserFile(abs ?? "", next ?? "");
								else await this.renameFile(abs ?? "", next ?? "");
								await this.refreshList(this.path);
							}
						}
						break;
					}
					break;
				case "open":
					await this.itemAction(item);
					break;
				case "paste":
					await this.requestPaste();
					break;
				case "view":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "view",
						item
					} }));
					break;
				case "attach-workcenter":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "attach-workcenter",
						item
					} }));
					break;
				case "download":
					Promise.try(async () => {
						if (isAssetsPath(abs)) {
							const file = await provide(abs);
							if (file) await downloadFile(file);
							return;
						}
						if (item?.kind === "file") await downloadFile(await getFileHandle(this.#fsRoot, abs, { create: false }));
						else await downloadFile(await getDirectoryHandle(this.#fsRoot, abs, { create: false }));
					}).catch(console.warn);
					break;
				case "copyPath":
					this.#clipboard = {
						items: [abs],
						cut: false
					};
					try {
						await waitForClipboardFrame();
						await navigator.clipboard?.writeText?.(abs);
					} catch {}
					break;
				case "copy":
					this.#clipboard = {
						items: [abs],
						cut: false
					};
					try {
						await waitForClipboardFrame();
						await navigator.clipboard?.writeText?.(abs);
					} catch {}
					break;
			}
		} catch (e) {
			console.warn(e);
			this.#error.value = e?.message || String(e || "");
		}
	}
	async renameFile(oldName, newName) {
		const file = await (await getFileHandle(this.#fsRoot, oldName, { create: false }))?.getFile?.();
		if (!file) return;
		if (!await getFileHandle(this.#fsRoot, newName, { create: true }).catch(() => null)) await writeFile(this.#fsRoot, this.path + newName, file);
		else await writeFile(this.#fsRoot, this.path + newName, file);
		await remove(this.#fsRoot, this.path + oldName);
	}
	async requestUpload() {
		const destination = this.incomingDestinationPath();
		if (destination) {
			try {
				const files = await this.pickFilesForUpload();
				for (const file of files) await this.writeUserFile(file, destination);
				await this.finishIncoming(destination);
			} catch (e) {
				console.warn(e);
			}
			return;
		}
		const currentPath = normalizeDirectoryPath(this.path);
		if (this.readonly || isReadonlyPath(currentPath)) return;
		try {
			await uploadFile(currentPath, null);
			await this.refreshList(currentPath);
		} catch (e) {
			console.warn(e);
		}
	}
	async requestPaste() {
		const destination = this.incomingDestinationPath();
		if (!destination) return;
		try {
			try {
				await waitForClipboardFrame();
				const clipboardItems = await navigator.clipboard.read();
				if (clipboardItems && clipboardItems.length > 0) {
					const files = await this.extractFilesFromData(clipboardItems);
					if (files.length > 0) {
						for (const file of files) await this.writeUserFile(file, destination);
						await this.finishIncoming(destination);
						return;
					}
				}
			} catch (e) {}
			let systemText = "";
			try {
				await waitForClipboardFrame();
				systemText = await navigator.clipboard?.readText?.();
			} catch {}
			const internalItems = this.#clipboard?.items || [];
			if (systemText) {
				await handleIncomingEntries({ getData: (type) => type === "text/plain" ? systemText : "" }, destination, this.#fsRoot);
				await this.finishIncoming(destination);
				return;
			}
			if (internalItems.length > 0) {
				const txt = internalItems.join("\n");
				if (internalItems.every((x) => String(x || "").startsWith("/user/"))) {
					for (const src of internalItems) {
						const file = await readFile(this.#fsRoot, src).catch(() => null);
						if (isFileLike(file)) {
							await this.writeUserFile(file, destination);
							if (this.#clipboard?.cut) await this.removeUserEntry(src, true).catch(() => null);
						}
					}
					if (this.#clipboard?.cut) this.#clipboard = null;
				} else await handleIncomingEntries({ getData: (type) => type === "text/plain" ? txt : "" }, destination, this.#fsRoot);
				await this.finishIncoming(destination);
			}
		} catch (e) {
			console.warn(e);
		}
	}
	onPaste(ev) {
		const destination = this.incomingDestinationPath();
		if (!destination) return;
		ev.preventDefault();
		if (ev.clipboardData || ev.dataTransfer) {
			Promise.try(async () => {
				const payload = ev.clipboardData || ev.dataTransfer;
				await this.ingestIncomingData(payload, destination);
				await this.finishIncoming(destination);
			}).catch(console.warn);
			return;
		}
		this.requestPaste();
	}
	onCopy(ev) {}
	async onDrop(ev) {
		const destination = this.incomingDestinationPath();
		if (!destination) return;
		ev.preventDefault();
		if (ev.clipboardData || ev.dataTransfer) {
			const payload = ev.clipboardData || ev.dataTransfer;
			const directoryHandlePromises = this.captureDirectoryHandlePromises(payload);
			await this.ingestIncomingData(payload, destination, directoryHandlePromises);
			await this.finishIncoming(destination);
			return;
		}
	}
	dispatchEvent(event) {
		this.host?.dispatchEvent(event);
	}
};
//#endregion
//#region ../../modules/views/explorer-view/src/ts/utils.ts
/**
* Get icon name by MIME type
*/
var iconByMime = (mime, def = "file") => {
	if (!mime) return def;
	if (mime.startsWith("image/")) return "image";
	if (mime.startsWith("audio/")) return "music";
	if (mime.startsWith("video/")) return "video";
	if (mime === "application/pdf") return "file-text";
	if (mime.includes("zip") || mime.includes("7z") || mime.includes("rar")) return "file-archive";
	if (mime.includes("json")) return "brackets-curly";
	if (mime.includes("csv")) return "file-spreadsheet";
	if (mime.includes("xml")) return "code";
	if (mime.startsWith("text/")) return "file-text";
	return def;
};
/**
* Extension to icon mapping
*/
var EXTENSION_ICON_MAP = {
	md: "file-text",
	txt: "file-text",
	pdf: "file-pdf",
	doc: "file-doc",
	docx: "file-doc",
	png: "file-image",
	jpg: "file-image",
	jpeg: "file-image",
	gif: "file-image",
	svg: "file-image",
	webp: "file-image",
	js: "file-js",
	ts: "file-ts",
	jsx: "file-jsx",
	tsx: "file-tsx",
	html: "file-html",
	css: "file-css",
	scss: "file-css",
	json: "file-json",
	zip: "file-zip",
	tar: "file-zip",
	gz: "file-zip",
	rar: "file-zip",
	mp3: "file-audio",
	wav: "file-audio",
	mp4: "file-video",
	mov: "file-video",
	webm: "file-video"
};
/**
* Get icon name by file extension
*/
var getFileIcon = (filename) => {
	return EXTENSION_ICON_MAP[filename.split(".").pop()?.toLowerCase() || ""] || "file";
};
/**
* Get icon for file entry item (unified function)
* Handles FileEntry objects and string types.
*/
var iconFor = (item, type) => {
	if (typeof item === "string") return item === "directory" ? "folder" : iconByMime(type || item || "");
	if (item?.kind === "directory") return "folder";
	return iconByMime(item?.type) || getFileIcon(item?.name || "");
};
/**
* Normalize the identity kind used by row rendering and context-menu lookup.
* A legacy entry may expose a File object without a `kind` field.
*/
var entryKind = (item) => item?.kind === "file" || item?.file ? "file" : "directory";
/**
* Keep file and directory rows distinct even when their names match.
*/
var entryKey = (item) => `${entryKind(item)}:${item?.name ?? ""}`;
var dateCache = /* @__PURE__ */ new Map();
/**
* Format date with caching
*/
var formatDate = (timestamp) => {
	if (timestamp === void 0 || timestamp === null) return "";
	const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	if (dateCache.has(ts)) return dateCache.get(ts);
	const formatted = new Date(ts).toLocaleString("en-US", {
		dateStyle: "short",
		timeStyle: "short"
	});
	dateCache.set(ts, formatted);
	return formatted;
};
//#endregion
//#region ../../modules/views/explorer-view/src/ts/ContextMenu.ts
/** WHY: Must sit above `.env-shell-chrome` (see environment-shell `_variables.scss` $z-shell-chrome ~2.1e9) and near `[data-env-shell-overlays]` pass-through layer. */
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var styleMounted = false;
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var cleanupFns = [];
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
var IMP_CSS = "important";
/**
* WHY: Host apps load FL-UI native `button { … !important … }`; CSS files alone lose to style-attribute precedence.
* Stamping palette + transparent rows avoids “gray slab per row”.
*/
function stampUnifiedContextMenuPanelChrome(menu, compact) {
	const light = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches;
	menu.style.setProperty("position", "fixed", IMP_CSS);
	menu.style.setProperty("box-sizing", "border-box", IMP_CSS);
	menu.style.setProperty("min-width", compact ? "188px" : "220px", IMP_CSS);
	menu.style.setProperty("max-width", "min(320px, calc(100vw - 24px))", IMP_CSS);
	menu.style.setProperty("padding", compact ? "0.3rem" : "0.4rem", IMP_CSS);
	menu.style.setProperty("border-radius", "14px", IMP_CSS);
	menu.style.setProperty("pointer-events", "auto", IMP_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "none", IMP_CSS);
	menu.style.setProperty("backdrop-filter", "none", IMP_CSS);
	if (light) {
		menu.style.setProperty("border", "1px solid rgba(15, 23, 42, 0.14)", IMP_CSS);
		menu.style.setProperty("background", "rgba(241, 245, 249, 0.98)", IMP_CSS);
		menu.style.setProperty("color", "#0f172a", IMP_CSS);
		menu.style.setProperty("box-shadow", "0 14px 36px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.06)", IMP_CSS);
	} else {
		menu.style.setProperty("border", "1px solid rgba(255, 255, 255, 0.1)", IMP_CSS);
		menu.style.setProperty("background", "rgba(15, 23, 42, 0.97)", IMP_CSS);
		menu.style.setProperty("color", "#e8eaed", IMP_CSS);
		menu.style.setProperty("box-shadow", "0 14px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06)", IMP_CSS);
	}
}
function stampUnifiedContextMenuListChrome(list) {
	list.style.setProperty("list-style", "none", IMP_CSS);
	list.style.setProperty("list-style-type", "none", IMP_CSS);
	list.style.setProperty("margin", "0", IMP_CSS);
	list.style.setProperty("padding", "0", IMP_CSS);
	list.style.setProperty("display", "flex", IMP_CSS);
	list.style.setProperty("flex-direction", "column", IMP_CSS);
	list.style.setProperty("align-items", "stretch", IMP_CSS);
	list.style.setProperty("gap", "0.2rem", IMP_CSS);
	list.style.setProperty("width", "100%", IMP_CSS);
	list.style.setProperty("box-sizing", "border-box", IMP_CSS);
	list.style.setProperty("text-align", "left", IMP_CSS);
}
function stampUnifiedContextMenuLiChrome(li) {
	li.style.setProperty("list-style", "none", IMP_CSS);
	li.style.setProperty("list-style-type", "none", IMP_CSS);
	li.style.setProperty("margin", "0", IMP_CSS);
	li.style.setProperty("padding", "0", IMP_CSS);
	li.style.setProperty("width", "100%", IMP_CSS);
	li.style.setProperty("display", "block", IMP_CSS);
	li.style.setProperty("box-sizing", "border-box", IMP_CSS);
}
function stampUnifiedContextMenuRowChrome(button, danger) {
	const light = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches;
	button.style.setProperty("appearance", "none", IMP_CSS);
	button.style.setProperty("-webkit-appearance", "none", IMP_CSS);
	button.style.setProperty("box-sizing", "border-box", IMP_CSS);
	button.style.setProperty("width", "100%", IMP_CSS);
	button.style.setProperty("max-width", "100%", IMP_CSS);
	button.style.setProperty("margin", "0", IMP_CSS);
	button.style.setProperty("display", "grid", IMP_CSS);
	button.style.setProperty("grid-template-columns", "1.375rem minmax(0, 1fr) auto", IMP_CSS);
	button.style.setProperty("align-items", "center", IMP_CSS);
	button.style.setProperty("justify-items", "start", IMP_CSS);
	button.style.setProperty("gap", "0.55rem", IMP_CSS);
	button.style.setProperty("border-style", "none", IMP_CSS);
	button.style.setProperty("border-width", "0", IMP_CSS);
	button.style.setProperty("outline", "none", IMP_CSS);
	button.style.setProperty("border-radius", "10px", IMP_CSS);
	button.style.setProperty("padding", "0.5rem 0.6rem", IMP_CSS);
	button.style.setProperty("min-height", "2.35rem", IMP_CSS);
	button.style.setProperty("font-family", "inherit", IMP_CSS);
	button.style.setProperty("font-size", "0.8125rem", IMP_CSS);
	button.style.setProperty("font-weight", "400", IMP_CSS);
	button.style.setProperty("line-height", "1.25", IMP_CSS);
	button.style.setProperty("text-align", "start", IMP_CSS);
	button.style.setProperty("cursor", "pointer", IMP_CSS);
	button.style.setProperty("background", "none", IMP_CSS);
	button.style.setProperty("background-color", "transparent", IMP_CSS);
	button.style.setProperty("background-image", "none", IMP_CSS);
	button.style.setProperty("box-shadow", "none", IMP_CSS);
	button.style.setProperty("transition", "none", IMP_CSS);
	if (!danger) button.style.setProperty("color", "inherit", IMP_CSS);
	else if (light) button.style.setProperty("color", "#b91c1c", IMP_CSS);
	else button.style.setProperty("color", "#fca5a5", IMP_CSS);
}
var ensureStyle = () => {
	if (styleMounted) return;
	styleMounted = true;
	const style = document.createElement("style");
	style.id = "cw-unified-context-menu-style";
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${CONTEXT_MENU_LAYER_Z_FALLBACK});
            pointer-events: none;
        }

        .cw-context-menu {
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: light dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.97);
            color: #e8eaed;
            box-shadow:
                0 14px 36px rgba(0, 0, 0, 0.45),
                0 0 0 1px rgba(255, 255, 255, 0.06);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu {
                border: 1px solid rgba(15, 23, 42, 0.14);
                background: rgba(241, 245, 249, 0.98);
                color: #0f172a;
                box-shadow:
                    0 14px 36px rgba(15, 23, 42, 0.12),
                    0 0 0 1px rgba(15, 23, 42, 0.06);
            }
        }

        .cw-context-menu.cw-context-menu--compact {
            min-width: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: left;
        }

        .cw-context-menu__list > li {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            box-sizing: border-box;
            display: block !important;
        }

        /*
         * INVARIANT: one horizontal row per item (icon | label | chevron).
         * Rows stay transparent inside the slab; FL-UI host button styling must not turn each row into its own gray chip.
         */
        button.cw-context-menu__item,
        .cw-context-menu button.cw-context-menu__item {
            appearance: none !important;
            -webkit-appearance: none !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: grid !important;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto !important;
            align-items: center !important;
            justify-items: start !important;
            justify-content: start !important;
            flex-direction: row !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            font-weight: 400 !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
            transition: none !important;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }

        @media (prefers-color-scheme: light) {
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: rgba(15, 23, 42, 0.08) !important;
            }
        }

        button.cw-context-menu__item[disabled],
        .cw-context-menu button.cw-context-menu__item[disabled] {
            opacity: 0.45 !important;
            cursor: default !important;
        }

        .cw-context-menu__item--danger {
            color: #fca5a5 !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu__item--danger {
                color: #b91c1c !important;
            }
        }

        .cw-context-menu__icon {
            justify-self: center !important;
            width: 1.375rem !important;
            height: 1.375rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /*
         * WHY:
         * 1) Inherited registered icon-color can be fully transparent — force currentColor.
         * 2) Phosphor min-size uses min(var(--icon-size), 100%); when percentage base is cyclic/0,
         *    mask ::before collapses — lock an explicit px box matching --icon-size.
         */
        .cw-context-menu__icon ui-icon,
        .cw-context-menu__chevron ui-icon {
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            width: var(--icon-size, 1.125rem) !important;
            height: var(--icon-size, 1.125rem) !important;
            min-width: var(--icon-size, 1.125rem) !important;
            min-height: var(--icon-size, 1.125rem) !important;
            min-inline-size: var(--icon-size, 1.125rem) !important;
            min-block-size: var(--icon-size, 1.125rem) !important;
            inline-size: var(--icon-size, 1.125rem) !important;
            block-size: var(--icon-size, 1.125rem) !important;
            max-inline-size: var(--icon-size, 1.125rem) !important;
            max-block-size: var(--icon-size, 1.125rem) !important;
            --icon-padding: 0px !important;
            color: inherit !important;
            --icon-color: currentColor !important;
            overflow: visible !important;
            pointer-events: none !important;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem !important;
        }

        .cw-context-menu__label {
            justify-self: stretch !important;
            text-align: start !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            min-width: 0 !important;
        }

        .cw-context-menu__chevron {
            justify-self: end !important;
            opacity: 0.72 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem !important;
        }

        @supports (color: color-mix(in oklab, white 50%, black)) {
            .cw-context-menu {
                border: 1px solid color-mix(in oklab, var(--wf-md-outline-variant, transparent) 100%, transparent);
                background: color-mix(in oklab, var(--wf-md-surf-container, rgba(30, 41, 59, 0.92)) 96%, transparent);
                color: var(--wf-md-on-surface, var(--color-on-surface, inherit));
                box-shadow:
                    var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                    0 0 0 1px color-mix(in oklab, var(--wf-md-on-surface, #fff) 7%, transparent);
            }
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: color-mix(in oklab, var(--wf-md-on-surface, #fff) 8%, transparent) !important;
            }
        }
    `;
	document.head.appendChild(style);
};
/** Re-run phosphor hydration after DOM connect (helps IO-deferred raster icons). */
function refreshContextMenuUiIcons(root) {
	if (typeof customElements !== "undefined" && typeof customElements.upgrade === "function") try {
		customElements.upgrade(root);
	} catch {}
	for (const node of root.querySelectorAll("ui-icon")) {
		const el = node;
		if (typeof el.updateIcon === "function") el.updateIcon.call(node);
	}
}
function appendUiIcon(target, iconName) {
	const el = document.createElement("ui-icon");
	el.setAttribute("icon", iconName);
	el.setAttribute("icon-style", "duotone");
	target.append(el);
}
var clearCleanup = () => {
	for (const fn of cleanupFns) try {
		fn();
	} catch {}
	cleanupFns = [];
};
var clearTimersFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuOpenTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuOpenTimers.delete(key);
	}
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var placeMenu = (menu, x, y) => {
	menu.style.left = `${x}px`;
	menu.style.top = `${y}px`;
	const rect = menu.getBoundingClientRect();
	const maxX = Math.max(8, window.innerWidth - rect.width - 8);
	const maxY = Math.max(8, window.innerHeight - rect.height - 8);
	menu.style.left = `${Math.min(Math.max(8, x), maxX)}px`;
	menu.style.top = `${Math.min(Math.max(8, y), maxY)}px`;
};
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var placeSubmenuWithFallback = (submenu, anchor) => {
	const rect = anchor.getBoundingClientRect();
	placeMenu(submenu, Math.round(rect.right + 4), Math.round(rect.top));
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	menu.style.zIndex = String(depth + 1);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	stampUnifiedContextMenuListChrome(list);
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		placeSubmenuWithFallback(submenu, anchorButton);
	};
	const scheduleOpenSubmenu = (item, anchorButton, nextDepth) => {
		const existingOpen = submenuOpenTimers.get(nextDepth);
		if (existingOpen) clearTimeout(existingOpen);
		cancelScheduledCloseFromDepth(nextDepth);
		const timer = setTimeout(() => {
			submenuOpenTimers.delete(nextDepth);
			openSubmenu(item, anchorButton, nextDepth);
		}, SUBMENU_HOVER_OPEN_MS);
		submenuOpenTimers.set(nextDepth, timer);
	};
	const scheduleCloseSubmenuFromDepth = (nextDepth) => {
		const existingClose = submenuCloseTimers.get(nextDepth);
		if (existingClose) clearTimeout(existingClose);
		const timer = setTimeout(() => {
			submenuCloseTimers.delete(nextDepth);
			closeSubmenusFromDepth(nextDepth);
		}, SUBMENU_HOVER_CLOSE_MS);
		submenuCloseTimers.set(nextDepth, timer);
	};
	for (const item of entries) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `cw-context-menu__item${item.danger ? " cw-context-menu__item--danger" : ""}`;
		button.setAttribute("role", "menuitem");
		button.disabled = Boolean(item.disabled);
		const hasChildren = Boolean(item.children?.length);
		const iconWrap = document.createElement("span");
		iconWrap.className = "cw-context-menu__icon";
		if (item.icon) appendUiIcon(iconWrap, item.icon);
		const labelSpan = document.createElement("span");
		labelSpan.className = "cw-context-menu__label";
		labelSpan.textContent = item.label;
		const chevronWrap = document.createElement("span");
		chevronWrap.className = "cw-context-menu__chevron";
		if (hasChildren) appendUiIcon(chevronWrap, "caret-right");
		button.append(iconWrap, labelSpan, chevronWrap);
		stampUnifiedContextMenuRowChrome(button, Boolean(item.danger));
		if (hasChildren) {
			const nextDepth = depth + 1;
			button.setAttribute("aria-haspopup", "menu");
			button.addEventListener("pointerenter", () => scheduleOpenSubmenu(item, button, nextDepth));
			button.addEventListener("pointerleave", () => scheduleCloseSubmenuFromDepth(nextDepth));
			button.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (session !== menuSession || !rootMenu?.isConnected) return;
				cancelScheduledCloseFromDepth(nextDepth);
				const existing = submenuByDepth.get(nextDepth);
				const activeAnchor = submenuAnchorByDepth.get(nextDepth);
				if (existing?.isConnected && activeAnchor === button) {
					closeSubmenusFromDepth(nextDepth);
					return;
				}
				openSubmenu(item, button, nextDepth);
			});
		} else button.addEventListener("click", async (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (session !== menuSession || !rootMenu?.isConnected) return;
			closeUnifiedContextMenu();
			if (item.disabled) return;
			await item.action();
		});
		const li = document.createElement("li");
		stampUnifiedContextMenuLiChrome(li);
		li.appendChild(button);
		list.appendChild(li);
	}
	stampUnifiedContextMenuPanelChrome(menu, compact);
	menu.addEventListener("pointerenter", () => cancelScheduledCloseFromDepth(depth));
	menu.addEventListener("pointerleave", () => {
		if (depth > 0) {
			const existingClose = submenuCloseTimers.get(depth);
			if (existingClose) clearTimeout(existingClose);
			const timer = setTimeout(() => {
				submenuCloseTimers.delete(depth);
				closeSubmenusFromDepth(depth);
			}, SUBMENU_HOVER_CLOSE_MS);
			submenuCloseTimers.set(depth, timer);
		}
	});
	return menu;
};
var closeUnifiedContextMenu = () => {
	clearCleanup();
	clearTimersFromDepth(0);
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	rootMenu?.remove();
	rootMenu = null;
	menuLayer?.remove();
	menuLayer = null;
	menuSession += 1;
};
var openUnifiedContextMenu = (request) => {
	const entries = (request.items || []).filter((item) => item && item.id && item.label);
	if (!entries.length) {
		closeUnifiedContextMenu();
		return;
	}
	ensureStyle();
	closeUnifiedContextMenu();
	const session = menuSession;
	const mount = request.resolveOverlayMountPoint?.(request.anchor ?? null) ?? resolveOverlayMountPoint(request.anchor ?? null);
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	menuLayer = layer;
	mount.appendChild(layer);
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session);
	rootMenu = menu;
	layer.appendChild(menu);
	placeMenu(menu, request.x, request.y);
	queueMicrotask(() => {
		if (session !== menuSession || !menu.isConnected) return;
		refreshContextMenuUiIcons(menu);
		requestAnimationFrame(() => {
			if (session !== menuSession || !menu.isConnected) return;
			refreshContextMenuUiIcons(menu);
		});
	});
	/**
	* WHY: `menuLayer.contains(event.target)` is false for nodes inside open shadow trees (e.g. ui-icon internals).
	* That made document-capture pointerdown treat in-menu presses as "outside" → menu removed before click fires.
	*/
	const eventPathTouchesOpenMenu = (event) => {
		if (!menuLayer?.isConnected || !rootMenu) return false;
		const rawPath = typeof event.composedPath === "function" ? event.composedPath() : [];
		const path = Array.isArray(rawPath) && rawPath.length ? rawPath : [];
		for (const node of path) {
			if (!(node instanceof Element)) continue;
			if (node === menuLayer || node === rootMenu) return true;
			if (menuLayer.contains(node)) return true;
			if (node.classList?.contains?.("cw-context-menu") || node.closest?.(".cw-context-menu")) return true;
		}
		const t = event.target;
		if (t instanceof Node && menuLayer.contains(t)) return true;
		if (t instanceof Element && t.closest?.(".cw-context-menu")) return true;
		return false;
	};
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		if (eventPathTouchesOpenMenu(event)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		let parentItem = target.closest?.(".cw-context-menu__item");
		if (!parentItem && typeof event.composedPath === "function") {
			for (const node of event.composedPath()) if (node instanceof Element && node.classList?.contains?.("cw-context-menu__item")) {
				parentItem = node;
				break;
			}
		}
		if (!parentItem) {
			closeSubmenusFromDepth(1);
			return;
		}
		if (!(parentItem.getAttribute("aria-haspopup") === "menu")) closeSubmenusFromDepth(1);
	};
	const onEscape = (event) => {
		if (session !== menuSession) return;
		if (event.key === "Escape") closeUnifiedContextMenu();
	};
	const close = () => closeUnifiedContextMenu();
	queueMicrotask(() => {
		if (session !== menuSession) return;
		document.addEventListener("pointerdown", onPointerDown, { capture: true });
		document.addEventListener("contextmenu", onPointerDown, { capture: true });
		document.addEventListener("keydown", onEscape);
		menu.addEventListener("click", onMenuInternalClick, { capture: true });
		window.addEventListener("resize", close, { passive: true });
		window.addEventListener("blur", close, { passive: true });
		cleanupFns.push(() => document.removeEventListener("pointerdown", onPointerDown, { capture: true }));
		cleanupFns.push(() => document.removeEventListener("contextmenu", onPointerDown, { capture: true }));
		cleanupFns.push(() => document.removeEventListener("keydown", onEscape));
		cleanupFns.push(() => menu.removeEventListener("click", onMenuInternalClick, { capture: true }));
		cleanupFns.push(() => window.removeEventListener("resize", close));
		cleanupFns.push(() => window.removeEventListener("blur", close));
	});
};
var makeFileActionOps = () => {
	return [
		{
			id: "open",
			label: "Open",
			icon: "function"
		},
		{
			id: "view",
			label: "View",
			icon: "eye"
		},
		{
			id: "view-base",
			label: "View (Base tab)",
			icon: "arrow-square-out"
		},
		{
			id: "attach-workcenter",
			label: "Attach to Work Center",
			icon: "lightning"
		},
		{
			id: "attach-workcenter-queued",
			label: "Queue attach (pending)",
			icon: "clock-counter-clockwise"
		},
		{
			id: "attach-workcenter-headless",
			label: "Queue attach (headless)",
			icon: "wave-sine"
		},
		{
			id: "pin-home",
			label: "Pin to Home Screen",
			icon: "push-pin-simple"
		},
		{
			id: "download",
			label: "Download",
			icon: "download"
		}
	];
};
var makeFileSystemOps = () => {
	return [
		{
			id: "delete",
			label: "Delete",
			icon: "trash"
		},
		{
			id: "rename",
			label: "Rename",
			icon: "pencil"
		},
		{
			id: "copyPath",
			label: "Copy Path",
			icon: "copy"
		},
		{
			id: "movePath",
			label: "Move Path",
			icon: "hand-withdraw"
		}
	];
};
var makeDirectoryOps = () => {
	const allowed = /* @__PURE__ */ new Set([
		"open",
		"download",
		"delete",
		"rename",
		"copyPath",
		"movePath"
	]);
	return [...makeFileActionOps(), ...makeFileSystemOps()].filter((item) => allowed.has(item.id));
};
var makeEmptyOps = (path) => {
	if (!canReceiveIncomingPath(path)) return [];
	return [{
		id: "paste",
		label: "Paste",
		icon: "clipboard"
	}];
};
var getExplorerOperative = (fileManager) => ((fileManager.getRootNode?.())?.host)?.operativeInstance ?? null;
var createItemCtxMenu = (fileManager, onMenuAction, entries) => {
	const onContextMenu = (event) => {
		const ev = event;
		const row = Array.from(ev.composedPath?.() || []).find((element) => element?.classList?.contains?.("row")) ?? MOCElement(ev.target, ".row");
		const rowKey = row?.getAttribute("data-entry-key");
		const rowName = row?.getAttribute("data-id");
		const item = (entries?.value ?? entries).find((entry) => rowKey ? entryKey(entry) === rowKey : entry?.name === rowName) ?? null;
		const operative = getExplorerOperative(fileManager);
		const currentPath = String(operative?.path || "/");
		const baseItems = item ? entryKind(item) === "directory" ? makeDirectoryOps() : [...makeFileActionOps(), ...makeFileSystemOps()] : makeEmptyOps(currentPath);
		if (baseItems.length === 0) return;
		ev.preventDefault();
		ev.stopPropagation();
		const menuItems = baseItems.map((menuItem) => ({
			...menuItem,
			danger: menuItem.id === "delete",
			action: () => onMenuAction?.(item, menuItem.id, ev)
		}));
		openUnifiedContextMenu({
			x: ev.clientX,
			y: ev.clientY,
			items: menuItems,
			anchor: fileManager
		});
	};
	fileManager.addEventListener("contextmenu", onContextMenu);
	return () => fileManager.removeEventListener("contextmenu", onContextMenu);
};
//#endregion
export { entryKind as a, FileOperative as c, entryKey as i, createItemCtxMenu as n, formatDate as o, openUnifiedContextMenu as r, iconFor as s, closeUnifiedContextMenu as t };
