import { E as resolveOverlayHost, F as property, I as H, N as GLitElement, P as defineElement, T as registerTransientOverlay, f as placeOverlay, w as decodeToastMessage } from "../vendor/culori.js";
import { $ as uploadFile, C as getMimeTypeByFilename, Ct as setOpfsSupportEnabled, E as handleIncomingEntries, G as remove, I as openDirectory, U as refreshMappedStorageRoots, V as readFile, Y as resolveRootHandle, _ as getDirectoryHandle, bt as isOpfsCapabilityAvailable, d as downloadFile, i as copyFromOneHandlerToAnother, nt as asProvidedFile, tt as writeFile, xt as isOpfsSupportEnabled, y as getFileHandle, z as provide } from "./app.js";
import { C as normalizeVirtualPath, S as buildExplorerDragPayload, d as readNativeStorageFile, g as shareNativeStorageFile, h as resolveNativeStorageUri, i as getAllFilesStatus, l as pickBrowserDirectory, m as resolveNativeStorageRealPath, n as copyNativeStorageImage, o as isNativeStorageAvailable, p as requestAllFilesAccess, t as canShowDirectoryPicker, u as pickSafTree, y as writeNativeClipboardImage } from "./app3.js";
import { A as resolveFsBackend, F as removeDirectoryMount, M as unregisterFsBackend, N as addDirectoryMount, O as ensureDefaultFsBackends, P as listExplorerMounts, k as listVirtualRootEntriesFromRouter } from "./app4.js";
import { _ as explorer_settings_default } from "../fest/veela.js";
import { MOCElement, addEvent } from "/fest/dom.js";
import { affected, observe, ref } from "/fest/object.js";
import { isIdbScopePath, isUserScopePath } from "/fest/core.js";
import { preloadStyle as preloadStyle$1, scheduleEnsureHostStyles } from "/fest/style-lib.js";
import { ensureStyleSheet } from "/fest/icon.js";
//#region ../../modules/projects/fl.ui/src/ui/explorer/share-copy.ts
var TEXT_EXT = /* @__PURE__ */ new Set([
	"txt",
	"md",
	"markdown",
	"csv",
	"tsv",
	"json",
	"xml",
	"html",
	"htm",
	"css",
	"scss",
	"js",
	"mjs",
	"cjs",
	"ts",
	"tsx",
	"jsx",
	"svg",
	"yml",
	"yaml",
	"ini",
	"log",
	"sh",
	"bat",
	"ps1",
	"py",
	"rb",
	"go",
	"rs",
	"java",
	"kt",
	"c",
	"h",
	"cpp",
	"hpp",
	"toml"
]);
var IMAGE_EXT = /* @__PURE__ */ new Set([
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"bmp",
	"avif",
	"svg",
	"ico",
	"tif",
	"tiff"
]);
var blobUrlKeep = [];
var extOf$1 = (name) => {
	const base = String(name || "").split(/[\\/]/).pop() || "";
	const i = base.lastIndexOf(".");
	return i >= 0 ? base.slice(i + 1).toLowerCase() : "";
};
var isTextLikeEntry = (item, path = "") => {
	const mime = String(item?.type || item?.file?.type || "").toLowerCase();
	if (mime.startsWith("text/") || mime === "application/json" || mime === "application/xml" || mime === "image/svg+xml") return true;
	return TEXT_EXT.has(extOf$1(item?.name || path));
};
var isImageLikeEntry = (item, path = "") => {
	if (String(item?.type || item?.file?.type || "").toLowerCase().startsWith("image/")) return true;
	return IMAGE_EXT.has(extOf$1(item?.name || path));
};
var explorerItemPath = (item, currentPath = "/") => {
	const own = String(item?.path || "").trim();
	if (own) return own;
	const name = String(item?.name || "").trim();
	if (!name) return String(currentPath || "/");
	const base = String(currentPath || "/");
	return base.endsWith("/") ? `${base}${name}` : `${base}/${name}`;
};
var isNativeVirtual = (path) => /^\/(?:sdcard|saf)(?:\/|$)/i.test(String(path || "").trim());
var mapSdcardRealPath = (virtualPath) => {
	const raw = String(virtualPath || "").trim();
	if (raw === "/sdcard" || raw === "/sdcard/") return "/storage/emulated/0";
	if (raw.startsWith("/sdcard/")) return `/storage/emulated/0/${raw.slice(8)}`;
	return "";
};
var waitClipboard = () => new Promise((resolve) => {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(() => resolve());
		return;
	}
	setTimeout(resolve, 0);
});
var writeText = async (text) => {
	const value = String(text || "");
	if (!value) return false;
	await waitClipboard();
	try {
		await navigator.clipboard?.writeText?.(value);
		return true;
	} catch {
		return false;
	}
};
var isCapacitorNative = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && c.isNativePlatform();
	} catch {
		return false;
	}
};
var blobToPngFile = async (file) => {
	const mime = String(file.type || "").toLowerCase();
	if (mime === "image/png") return file;
	if (mime === "image/svg+xml") return file;
	try {
		if (typeof createImageBitmap === "function") {
			const bitmap = await createImageBitmap(file);
			const canvas = document.createElement("canvas");
			canvas.width = bitmap.width;
			canvas.height = bitmap.height;
			const ctx = canvas.getContext("2d");
			if (!ctx) return file;
			ctx.drawImage(bitmap, 0, 0);
			bitmap.close?.();
			const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
			if (blob) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".png", { type: "image/png" });
		}
	} catch {}
	return file;
};
var writeImage = async (file, virtualPath = "") => {
	if (isCapacitorNative() && isNativeVirtual(virtualPath)) {
		if (await copyNativeStorageImage(virtualPath)) return true;
	}
	const png = await blobToPngFile(file);
	if (isCapacitorNative()) {
		try {
			const dataUrl = await fileToBase64Url(png);
			if (await writeNativeClipboardImage(dataUrl, png.type || "image/png", png.name)) return true;
		} catch {}
		return false;
	}
	await waitClipboard();
	try {
		if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
			await navigator.clipboard.write([new ClipboardItem({ [png.type || "image/png"]: png })]);
			return true;
		}
	} catch {}
	return false;
};
var loadExplorerFile = async (item, path) => {
	if (item?.file instanceof File) return item.file;
	const href = String(item?.href || "").trim();
	if (href && /^https?:\/\//i.test(href) && !item?.file) return null;
	if (isNativeVirtual(path) && isNativeStorageAvailable()) {
		const native = await readNativeStorageFile(path).catch(() => null);
		if (native) {
			if (item) item.file = native;
			return native;
		}
	}
	try {
		const backend = resolveFsBackend(path);
		if (typeof backend?.readFile === "function") {
			const file = await backend.readFile(path);
			if (file) {
				if (item) item.file = file;
				return file;
			}
		}
	} catch {}
	const provided = await provide(path).catch(() => null);
	if (provided instanceof File) {
		if (item) item.file = provided;
		return provided;
	}
	return null;
};
var fileToBase64Url = async (file) => {
	const mime = file.type || getMimeTypeByFilename(file.name) || "application/octet-stream";
	const buf = await file.arrayBuffer();
	const bytes = new Uint8Array(buf);
	const chunk = 32768;
	let bin = "";
	for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return `data:${mime};base64,${btoa(bin)}`;
};
var webShare = async (data) => {
	const nav = navigator;
	if (typeof nav.share !== "function") return false;
	try {
		if (typeof nav.canShare === "function" && !nav.canShare(data)) return false;
		await nav.share(data);
		return true;
	} catch (err) {
		if ((err instanceof DOMException ? err.name : "") === "AbortError") return true;
		return false;
	}
};
var capacitorShare = async (opts) => {
	try {
		const Share = globalThis.Capacitor?.Plugins?.Share;
		if (typeof Share?.share !== "function") return false;
		await Share.share({
			title: opts.title,
			text: opts.text,
			url: opts.url,
			dialogTitle: "Share"
		});
		return true;
	} catch {
		return false;
	}
};
var shareExplorerItem = async (item, currentPath = "/") => {
	const path = explorerItemPath(item, currentPath);
	const name = String(item?.name || path.split("/").filter(Boolean).pop() || "file");
	const href = String(item?.href || "").trim();
	if (isNativeVirtual(path) && isNativeStorageAvailable() && item?.kind !== "directory") {
		if (await shareNativeStorageFile(path, {
			mimeType: item?.type || getMimeTypeByFilename(name),
			title: name
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
	}
	if (href && /^https?:\/\//i.test(href)) {
		if (await webShare({
			title: name,
			text: name,
			url: href
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		if (await capacitorShare({
			title: name,
			text: name,
			url: href
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		if (await writeText(href)) return {
			ok: true,
			message: "Copied link (share unavailable)"
		};
		return {
			ok: false,
			message: "Share is unavailable"
		};
	}
	if (item?.kind === "directory") {
		const text = await resolveExplorerRealPath(item, currentPath) || path;
		if (await webShare({
			title: name,
			text
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		if (await capacitorShare({
			title: name,
			text
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		if (await writeText(text)) return {
			ok: true,
			message: "Copied path (share unavailable)"
		};
		return {
			ok: false,
			message: "Share is unavailable"
		};
	}
	const file = await loadExplorerFile(item, path);
	if (file) {
		if (await webShare({
			title: name,
			text: name,
			files: [file]
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		const uri = isNativeVirtual(path) ? await resolveNativeStorageUri(path).catch(() => "") : "";
		if (uri && await capacitorShare({
			title: name,
			url: uri
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		if (await webShare({
			title: name,
			text: name
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		if (await capacitorShare({
			title: name,
			text: name
		})) return {
			ok: true,
			message: `Shared ${name}`
		};
		return {
			ok: false,
			message: "Share is unavailable for this file"
		};
	}
	if (await webShare({
		title: name,
		text: path
	})) return {
		ok: true,
		message: `Shared ${name}`
	};
	if (await capacitorShare({
		title: name,
		text: path
	})) return {
		ok: true,
		message: `Shared ${name}`
	};
	return {
		ok: false,
		message: "Nothing to share"
	};
};
var resolveExplorerRealPath = async (item, currentPath = "/") => {
	const path = explorerItemPath(item, currentPath);
	const href = String(item?.href || "").trim();
	if (href && /^(https?|file|content):/i.test(href)) return href;
	if (isNativeVirtual(path) && isNativeStorageAvailable()) {
		const native = await resolveNativeStorageRealPath(path).catch(() => "");
		if (native) return native;
		const uri = await resolveNativeStorageUri(path).catch(() => "");
		if (uri) return uri;
	}
	return mapSdcardRealPath(path);
};
var copyExplorerBase64Url = async (item, currentPath = "/") => {
	const file = await loadExplorerFile(item, explorerItemPath(item, currentPath));
	if (!file) return {
		ok: false,
		message: "Could not read this file"
	};
	try {
		const ok = await writeText(await fileToBase64Url(file));
		return {
			ok,
			message: ok ? "Copied Base64 URL" : "Clipboard write failed"
		};
	} catch {
		return {
			ok: false,
			message: "File is too large for Base64"
		};
	}
};
var copyExplorerInlineText = async (item, currentPath = "/") => {
	const path = explorerItemPath(item, currentPath);
	if (!isTextLikeEntry(item, path)) return {
		ok: false,
		message: "Not a text file"
	};
	const file = await loadExplorerFile(item, path);
	if (!file) return {
		ok: false,
		message: "Could not read this file"
	};
	const ok = await writeText(await file.text());
	return {
		ok,
		message: ok ? "Copied text" : "Clipboard write failed"
	};
};
var copyExplorerImage = async (item, currentPath = "/") => {
	const path = explorerItemPath(item, currentPath);
	if (!isImageLikeEntry(item, path)) return {
		ok: false,
		message: "Not an image"
	};
	if (isNativeVirtual(path) && isNativeStorageAvailable()) {
		if (await copyNativeStorageImage(path)) return {
			ok: true,
			message: "Copied image"
		};
	}
	const file = await loadExplorerFile(item, path);
	if (!file) return {
		ok: false,
		message: "Could not read this file"
	};
	const ok = await writeImage(file, path);
	return {
		ok,
		message: ok ? "Copied image" : "Clipboard write failed"
	};
};
var copyExplorerRealPath = async (item, currentPath = "/") => {
	const path = explorerItemPath(item, currentPath);
	const real = await resolveExplorerRealPath(item, currentPath);
	if (real) {
		const ok = await writeText(real);
		return {
			ok,
			message: ok ? "Copied real path" : "Clipboard write failed"
		};
	}
	const ok = await writeText(path);
	return {
		ok,
		message: ok ? "Copied Explorer path (no OS path)" : "Clipboard write failed"
	};
};
var copyExplorerBlobUrl = async (item, currentPath = "/") => {
	const file = await loadExplorerFile(item, explorerItemPath(item, currentPath));
	if (!file) return {
		ok: false,
		message: "Could not read this file"
	};
	const url = URL.createObjectURL(file);
	blobUrlKeep.push(url);
	const ok = await writeText(url);
	return {
		ok,
		message: ok ? "Copied Blob URL (this session)" : "Clipboard write failed"
	};
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/toast.ts
/**
* Lightweight toasts for home-view / SpeedDial (no CWSP-shell core).
* Shells may listen for `view:toast` on `window` and render FL-UI / status UI.
*/
function showSuccess(message) {
	globalThis.dispatchEvent?.(new CustomEvent("view:toast", { detail: {
		type: "success",
		message: decodeToastMessage(message)
	} }));
}
function showError(message) {
	globalThis.dispatchEvent?.(new CustomEvent("view:toast", { detail: {
		type: "error",
		message: decodeToastMessage(message)
	} }));
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/app-menu/bookmarks-menu.ts
/** Local copy — avoid relative `../../explorer/fs-backend` (breaks when this file is hardlinked under home-view). */
function faviconForHref(href, size = 64) {
	const raw = String(href || "").trim();
	if (!raw || !/^https?:\/\//i.test(raw)) return "";
	try {
		const host = new URL(raw).hostname;
		if (!host) return "";
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
	} catch {
		return "";
	}
}
/** Accept http(s) and other schemes; bare hosts become `https://…`. */
function normalizeBookmarkHref(raw) {
	const text = String(raw || "").trim();
	if (!text) return "";
	if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return text;
	return `https://${text}`;
}
var registeredBookmarksApi = null;
var chromeErr = () => {
	try {
		const err = globalThis.chrome?.runtime?.lastError;
		return err ? new Error(String(err.message || err)) : null;
	} catch {
		return null;
	}
};
var callChrome = (api, method, ...args) => {
	const fn = api[method];
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
var nodeToEntry = (node) => {
	const url = typeof node.url === "string" && node.url ? node.url : void 0;
	return {
		id: String(node.id),
		title: String(node.title || node.url || node.id || "Bookmark"),
		url,
		folder: !url,
		parentId: node.parentId
	};
};
/** Build BookmarksMenuApi from `chrome.bookmarks` (CRX extension pages). */
function createChromeBookmarksMenuApi(raw) {
	const api = raw || (globalThis.chrome?.bookmarks ?? null);
	if (!api?.getTree || !api?.getChildren) return null;
	const resolveIconUrl = (href, size = 128) => {
		const page = String(href || "").trim();
		if (!/^https?:\/\//i.test(page)) return "";
		const s2 = faviconForHref(page, size);
		if (s2) return s2;
		try {
			const chromeRt = globalThis.chrome?.runtime;
			if (typeof chromeRt?.getURL === "function") {
				const u = new URL(chromeRt.getURL("/_favicon/"));
				u.searchParams.set("pageUrl", page);
				u.searchParams.set("size", String(size));
				return u.toString();
			}
		} catch {}
		return "";
	};
	return {
		resolveIconUrl,
		async listChildren(folderId) {
			if (folderId) return (await callChrome(api, "getChildren", folderId) || []).map(nodeToEntry);
			const roots = await callChrome(api, "getTree") || [];
			const out = [];
			for (const root of roots) for (const child of root.children || []) out.push(nodeToEntry(child));
			return out;
		},
		async search(query) {
			const q = String(query || "").trim();
			if (!q) return this.listChildren();
			if (typeof api.search !== "function") {
				const all = await this.listChildren();
				const lower = q.toLowerCase();
				return all.filter((e) => e.title.toLowerCase().includes(lower) || String(e.url || "").toLowerCase().includes(lower));
			}
			return (await callChrome(api, "search", q) || []).map(nodeToEntry);
		},
		async open(entry) {
			if (entry.folder) return;
			const href = String(entry.url || "").trim();
			if (!href) return;
			try {
				const tabs = globalThis.chrome?.tabs;
				if (typeof tabs?.create === "function") {
					await Promise.resolve(tabs.create({ url: href }));
					return;
				}
			} catch {}
			globalThis.open?.(href, "_blank", "noopener,noreferrer");
		},
		async remove(entry) {
			const id = String(entry?.id || "").trim();
			if (!id) return false;
			try {
				if (entry.folder) {
					if (typeof api.removeTree !== "function") return false;
					await callChrome(api, "removeTree", id);
				} else {
					if (typeof api.remove !== "function") return false;
					await callChrome(api, "remove", id);
				}
				return true;
			} catch {
				return false;
			}
		},
		async update(id, patch) {
			const key = String(id || "").trim();
			if (!key || typeof api.update !== "function") return null;
			const body = {};
			if (patch.title != null) body.title = String(patch.title || "").trim();
			if (patch.url != null) {
				const href = normalizeBookmarkHref(patch.url);
				if (href) body.url = href;
			}
			try {
				const node = await callChrome(api, "update", key, body);
				return node ? nodeToEntry(node) : null;
			} catch {
				return null;
			}
		},
		async create(parentId, spec) {
			if (typeof api.create !== "function") return null;
			const title = String(spec.title || "").trim();
			if (!title) return null;
			const body = {
				parentId: String(parentId || "0"),
				title
			};
			if (spec.url != null) {
				const href = normalizeBookmarkHref(spec.url);
				if (!href) return null;
				body.url = href;
			}
			const attempt = async (pid) => {
				const node = await callChrome(api, "create", {
					...body,
					parentId: pid
				});
				return node ? nodeToEntry(node) : null;
			};
			try {
				return await attempt(body.parentId);
			} catch {
				if (body.parentId === "0") try {
					return await attempt("1");
				} catch {
					return null;
				}
				return null;
			}
		}
	};
}
function resolveBookmarksMenuApi() {
	if (registeredBookmarksApi) return registeredBookmarksApi;
	return createChromeBookmarksMenuApi();
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/app-menu/app-actions.ts
var esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var openEditorDialog = (inner) => {
	const modal = document.createElement("dialog");
	modal.className = "speed-dial-editor env-shell-app-menu__chrome-editor";
	modal.innerHTML = inner;
	const close = () => {
		try {
			if (modal.open) modal.close();
		} catch {}
		modal.remove();
	};
	modal.addEventListener("cancel", (ev) => {
		ev.preventDefault();
		close();
	});
	modal.__cwspClose = close;
	document.body.append(modal);
	try {
		modal.showModal();
	} catch {
		modal.setAttribute("open", "");
	}
	return modal;
};
function openBookmarkFieldsDialog(opts) {
	const showUrl = opts.showUrl !== false;
	return new Promise((resolve) => {
		let settled = false;
		const modal = openEditorDialog(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">${esc(opts.heading)}</h2>
                ${opts.description ? `<p class="modal-description">${esc(opts.description)}</p>` : ""}
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-bm-title">Title</label>
                    <input id="am-bm-title" name="title" type="text" value="${esc(opts.initialTitle || "")}" />
                </div>
                ${showUrl ? `<div class="modal-field">
                    <label for="am-bm-url">URL</label>
                    <input id="am-bm-url" name="url" type="url" value="${esc(opts.initialUrl || "")}" placeholder="https://" />
                </div>` : ""}
            </div>
            <div class="modal-actions" role="group">
                <span></span>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">${esc(opts.submitLabel || "Save")}</button>
            </div>
        </form>
    `);
		const close = modal.__cwspClose;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			close?.();
			resolve(value);
		};
		const form = modal.querySelector("form");
		form?.addEventListener("click", (ev) => {
			if (ev.target?.closest?.("[data-action]")?.getAttribute("data-action") === "cancel") {
				ev.preventDefault();
				finish(null);
			}
		});
		modal.addEventListener("cancel", () => finish(null));
		form?.addEventListener("submit", (ev) => {
			ev.preventDefault();
			const title = String(modal.querySelector("[name=\"title\"]")?.value || "").trim();
			if (!title) {
				showError("Title is required");
				return;
			}
			if (!showUrl) {
				finish({ title });
				return;
			}
			const href = normalizeBookmarkHref(modal.querySelector("[name=\"url\"]")?.value || "");
			if (!href) {
				showError("URL is required");
				return;
			}
			finish({
				title,
				url: href
			});
		});
	});
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/Operative.ts
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
var normalizeDirectoryPath = (input) => normalizeVirtualPath(input ?? "/", true);
var isAssetsPath = (path) => normalizeDirectoryPath(path).startsWith(ASSETS_ROOT);
var isVirtualRootPath = (path) => normalizeDirectoryPath(path) === "/";
var isReadonlyPath = (path) => isAssetsPath(path) || isVirtualRootPath(path);
var isIconsPath = (path) => normalizeDirectoryPath(path).startsWith("/assets/icons/");
var isUserPath = (path) => isUserScopePath(normalizeDirectoryPath(path));
var isIdbPath = (path) => isIdbScopePath(normalizeDirectoryPath(path));
var isWorkspacePath = (path) => isUserPath(path) || isIdbPath(path);
var BOOKMARKS_ROOT = "/bookmarks/";
var isBookmarksPath = (path) => normalizeDirectoryPath(path).startsWith(BOOKMARKS_ROOT);
/**
* External ingress may target the virtual root, which is redirected to `/user/`.
* Keep this predicate shared with the context-menu layer so Paste visibility
* cannot drift from the actual drop/paste acceptance rules.
*/
var canReceiveIncomingPath = (path) => {
	const normalized = normalizeDirectoryPath(path);
	return isVirtualRootPath(normalized) || isWorkspacePath(normalized) || isBookmarksPath(normalized);
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
	/** Coalesce overlapping loadPath calls onto the latest requested path. */
	#pendingLoadPath = null;
	#loadWaiters = [];
	#clipboard = null;
	#subscribed = null;
	#bookmarksInvalidationOff = null;
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
		resolveRootHandle("/user/").then((h) => {
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
		return listVirtualRootEntriesFromRouter().map((e) => observe({
			name: e.name,
			kind: e.kind,
			path: e.path || `/${e.name}/`
		}));
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
		if (this.#bookmarksInvalidationOff) {
			this.#bookmarksInvalidationOff();
			this.#bookmarksInvalidationOff = null;
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
			try {
				const [name, handle] = $pair;
				if (!name || !handle) return null;
				const build = async () => {
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
				};
				if (typeof handleCache?.getOrInsertComputed === "function") return await handleCache.getOrInsertComputed(handle, build);
				return await build();
			} catch (error) {
				console.warn(error);
				return null;
			}
		})))?.filter?.(($item) => $item != null) || [];
	}
	async getDirectoryHandleByPath(path, create = false) {
		const root = this.#fsRoot || await this.getStorageRootHandle("/user/");
		if (!root) return null;
		const parts = normalizeDirectoryPath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	normalizeUserRelativePath(path) {
		const normalized = normalizeDirectoryPath(path);
		if (normalized === "/user/" || normalized === "/idb/") return "/";
		if (normalized.startsWith("/user/")) return normalized.slice(5);
		if (normalized.startsWith("/idb/")) return normalized.slice(4);
		return normalized;
	}
	async getStorageRootHandle(path) {
		const virtual = isIdbPath(path) ? "/idb/" : "/user/";
		return resolveRootHandle(virtual, path);
	}
	async getOpfsRootHandle() {
		this.#fsRoot = await this.getStorageRootHandle("/user/");
		return this.#fsRoot;
	}
	async getUserDirHandle(path, create = false) {
		const root = await this.getStorageRootHandle(path);
		if (!root) return null;
		const parts = this.normalizeUserRelativePath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	async writeUserFile(file, destPath = this.path) {
		if (isBookmarksPath(destPath)) {
			this.dispatchEvent(new CustomEvent("bookmarks-reject", {
				detail: {
					reason: "bookmarks backend does not store file bytes",
					path: destPath,
					count: 1
				},
				bubbles: true,
				composed: true
			}));
			return;
		}
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
	* in `/user/` and then surfaced by navigating there. `/bookmarks/` is a
	* live Chrome Bookmarks mount (CRX only) and accepts URI drops.
	*/
	incomingDestinationPath() {
		const currentPath = normalizeDirectoryPath(this.path);
		if (canReceiveIncomingPath(currentPath) && isWorkspacePath(currentPath)) return currentPath;
		if (isBookmarksPath(currentPath)) return currentPath;
		if (isVirtualRootPath(currentPath)) return "/user/";
		return null;
	}
	/**
	* Returns the registered bookmarks FsBackend for `path`, or `null` when
	* the path is not under `/bookmarks/` or the backend was never registered
	* (non-CRX hosts). WHY: mutation handlers branch on this so OPFS write
	* paths are never reached for `/bookmarks/**`.
	*/
	bookmarksBackendFor(path) {
		const backend = resolveFsBackend(path);
		return backend && backend.root === BOOKMARKS_ROOT ? backend : null;
	}
	/**
	* Ingest a drop/paste into `/bookmarks/`. URI entries become Chrome
	* bookmarks via `createUrl`; raw File bytes are rejected with a
	* user-visible event since `/bookmarks/` is not a byte store.
	*/
	async ingestIntoBookmarks(data, destination) {
		const backend = this.bookmarksBackendFor(destination);
		if (!backend?.createUrl) return;
		const files = await this.extractFilesFromData(data);
		if (files.length > 0) {
			this.dispatchEvent(new CustomEvent("bookmarks-reject", {
				detail: {
					reason: "bookmarks backend does not store file bytes",
					path: destination,
					count: files.length
				},
				bubbles: true,
				composed: true
			}));
			return;
		}
		const getData = (type) => data?.getData?.(type) ?? "";
		const uriList = String(getData("text/uri-list") || "");
		const plainText = String(getData("text/plain") || "");
		const lines = (uriList || plainText).split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
		for (const line of lines) {
			if (!/^https?:\/\//i.test(line)) continue;
			const title = line;
			try {
				await backend.createUrl(destination, title, line);
			} catch (e) {
				console.warn(e);
			}
		}
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
		const root = await this.getStorageRootHandle(absPath);
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
		const root = await this.getStorageRootHandle(absPath);
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
	async itemAction(item, how = "click") {
		const self = this;
		const itemPath = item?.path || "";
		const detailPath = itemPath || (self.path || "/") + (item?.name || "");
		const detail = {
			path: detailPath,
			item,
			originalEvent: null,
			how
		};
		const event = new CustomEvent("open-item", {
			detail,
			bubbles: true,
			composed: true,
			cancelable: true
		});
		this.host?.dispatchEvent(event);
		if (event.defaultPrevented) return;
		if (item?.kind === "directory") self.path = itemPath ? normalizeDirectoryPath(itemPath) : (self.path?.endsWith?.("/") ? self.path : self.path + "/") + (item?.name || "") + "/";
		else {
			const href = item?.href;
			if (href && /^https?:\/\//i.test(href)) {
				const openEvent = new CustomEvent("open-link", {
					detail: {
						href,
						item,
						path: detailPath
					},
					bubbles: true,
					composed: true,
					cancelable: true
				});
				this.host?.dispatchEvent(openEvent);
				if (openEvent.defaultPrevented) return;
				try {
					if (typeof window !== "undefined" && typeof window.open === "function") window.open(href, "_blank", "noopener,noreferrer");
				} catch (e) {
					console.warn(e);
				}
				return;
			}
			const abs = (self.path || "/") + (item?.name || "");
			if (!item?.file) {
				const loadPath = itemPath || abs;
				const backend = resolveFsBackend(loadPath);
				if (typeof backend?.readFile === "function") item.file = await backend.readFile(loadPath).catch(() => null);
				if (!item.file) item.file = asProvidedFile(await provide(loadPath).catch(() => null));
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
		this.#pendingLoadPath = path;
		if (this.#loadLock) return new Promise((resolve) => {
			this.#loadWaiters.push(resolve);
		});
		this.#loadLock = true;
		try {
			while (this.#pendingLoadPath != null) {
				const nextPath = this.#pendingLoadPath;
				this.#pendingLoadPath = null;
				await this.#loadPathNow(nextPath);
			}
		} finally {
			this.#loadLock = false;
			const waiters = this.#loadWaiters.splice(0, this.#loadWaiters.length);
			for (const resolve of waiters) resolve(this);
		}
		return this;
	}
	async #loadPathNow(path = this.path) {
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
				const backend = resolveFsBackend(rel);
				try {
					const remote = await backend?.list?.(rel);
					if (remote && remote.length) {
						this.applyEntries(remote.map((e) => observe(e)));
						return this;
					}
				} catch {}
				this.applyEntries(await this.listAssetEntries(rel));
				return this;
			}
			if (isUserPath(rel)) {
				const entries = await this.listUserEntriesDirect(rel, true);
				this.applyEntries(entries);
				return this;
			}
			const backend = resolveFsBackend(rel);
			if (backend && backend.root !== "/user/" && backend.root !== "/assets/") {
				this.applyEntries((await backend.list(rel)).map((e) => observe(e)));
				const subscribe = backend.subscribeBookmarksInvalidation;
				if (typeof subscribe === "function" && !this.#bookmarksInvalidationOff) this.#bookmarksInvalidationOff = subscribe(() => {
					const current = normalizeDirectoryPath(this.path);
					if (resolveFsBackend(current)?.root === backend.root) this.loadPath(current).catch(() => {});
				});
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
		}
		return this;
	}
	onRowClick = (item, ev) => {
		ev.preventDefault();
		this.itemAction(item, "click");
	};
	onRowDblClick = (item, ev) => {
		ev.preventDefault();
		this.itemAction(item, "dblclick");
	};
	onRowDragStart = (item, ev) => {
		if (!ev.dataTransfer) return;
		ev.dataTransfer.effectAllowed = "copyMove";
		const payload = buildExplorerDragPayload(item, this.path || "/");
		try {
			ev.dataTransfer.setData("application/json", payload.json);
		} catch {}
		ev.dataTransfer.setData("text/plain", payload.plain);
		ev.dataTransfer.setData("text/uri-list", payload.uriList);
		if (payload.href) try {
			ev.dataTransfer.setData("text/x-moz-url", `${payload.href}\n${item?.name || payload.href}`);
		} catch {}
		if (item?.file) {
			ev.dataTransfer.setData("DownloadURL", item?.file?.type + ":" + item?.file?.name + ":" + URL.createObjectURL(item?.file));
			ev.dataTransfer.items.add(item?.file);
		}
	};
	async runMenuAction(item, actionId, ev) {
		await this.onMenuAction(item, actionId, ev ?? new MouseEvent("contextmenu"));
	}
	async onMenuAction(item, actionId, ev) {
		try {
			const itemName = item?.name;
			if (!actionId) return;
			const abs = (this.path || "/") + (itemName || "");
			const bmPath = item?.path || "";
			const bmBackend = bmPath ? this.bookmarksBackendFor(bmPath) : null;
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
						if (bmBackend?.remove) {
							if (globalThis.confirm?.(`Delete “${itemName || "bookmark"}”?`) !== true) break;
							await bmBackend.remove(bmPath, true);
						} else {
							const fsBackend = resolveFsBackend(abs) || (bmPath ? resolveFsBackend(bmPath) : null);
							const nativePath = bmPath && fsBackend && bmPath.startsWith(fsBackend.root) ? bmPath : abs;
							if (fsBackend?.remove && fsBackend.root !== "/user/" && fsBackend.root !== "/assets/") {
								if (globalThis.confirm?.(`Delete “${itemName || "item"}”?`) !== true) break;
								await fsBackend.remove(nativePath, true);
							} else if (isWorkspacePath(abs)) await this.removeUserEntry(abs, true);
							else await remove(this.#fsRoot, abs);
						}
						await this.refreshList(this.path);
						break;
					}
					if (actionId === "rename") {
						const next = prompt("Rename to:", itemName);
						if (next && next !== itemName) {
							if (bmBackend?.rename) await bmBackend.rename(bmPath, next);
							else if (item?.kind === "file") {
								if (isWorkspacePath(abs)) await this.renameUserFile(abs ?? "", next ?? "");
								else await this.renameFile(abs ?? "", next ?? "");
							}
							await this.refreshList(this.path);
						}
						break;
					}
					if (actionId === "movePath") {
						const srcPath = bmPath || abs;
						this.#clipboard = {
							items: [srcPath],
							cut: true
						};
						try {
							await waitForClipboardFrame();
							await navigator.clipboard?.writeText?.(srcPath);
						} catch {}
						break;
					}
					break;
				case "new-folder": {
					if (this.readonly || isReadonlyPath(this.path)) {
						this.dispatchEvent(new CustomEvent("readonly-blocked", {
							detail: {
								action: actionId,
								path: this.path
							},
							bubbles: true,
							composed: true
						}));
						break;
					}
					const destBackend = this.bookmarksBackendFor(this.path);
					if (destBackend?.mkdir) {
						const fields = await openBookmarkFieldsDialog({
							heading: "New folder",
							description: "Chrome bookmarks folder",
							showUrl: false,
							initialTitle: "New folder",
							submitLabel: "Create"
						});
						if (!fields?.title) break;
						await destBackend.mkdir(this.path, fields.title);
					} else {
						const name = prompt("Folder name:", "New folder");
						if (!name) break;
						if (isWorkspacePath(this.path)) {
							const folder = String(name).trim();
							if (folder) await this.getUserDirHandle(`${this.path}${folder}/`, true);
						}
					}
					await this.refreshList(this.path);
					break;
				}
				case "new-bookmark": {
					const destBackend = this.bookmarksBackendFor(this.path);
					if (!destBackend?.createUrl) break;
					const fields = await openBookmarkFieldsDialog({
						heading: "New bookmark",
						description: "Saved to Chrome bookmarks",
						showUrl: true,
						initialUrl: "https://",
						submitLabel: "Create"
					});
					if (!fields?.url) break;
					await destBackend.createUrl(this.path, fields.title || fields.url, fields.url);
					await this.refreshList(this.path);
					break;
				}
				case "edit-bookmark": {
					if (!item || !bmBackend) break;
					const isFolder = item.kind === "directory";
					const fields = await openBookmarkFieldsDialog({
						heading: isFolder ? "Rename folder" : "Edit bookmark",
						description: "Chrome bookmarks",
						showUrl: !isFolder,
						initialTitle: item.name,
						initialUrl: item.href || "",
						submitLabel: "Save"
					});
					if (!fields) break;
					if (bmBackend.update) await bmBackend.update(bmPath, isFolder ? { title: fields.title } : {
						title: fields.title,
						url: fields.url
					});
					else if (bmBackend.rename && fields.title && fields.title !== itemName) await bmBackend.rename(bmPath, fields.title);
					await this.refreshList(this.path);
					break;
				}
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
				case "send-transfer":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "send-transfer",
						item
					} }));
					break;
				case "share":
				case "copy-base64":
				case "copy-text":
				case "copy-image":
				case "copy-real-path":
				case "copy-blob-url": {
					const current = this.path || "/";
					const result = actionId === "share" ? await shareExplorerItem(item, current) : actionId === "copy-base64" ? await copyExplorerBase64Url(item, current) : actionId === "copy-text" ? await copyExplorerInlineText(item, current) : actionId === "copy-image" ? await copyExplorerImage(item, current) : actionId === "copy-real-path" ? await copyExplorerRealPath(item, current) : await copyExplorerBlobUrl(item, current);
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: actionId,
						item,
						handled: true,
						message: result.message
					} }));
					break;
				}
				case "attach-workcenter":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "attach-workcenter",
						item
					} }));
					break;
				case "download":
					Promise.try(async () => {
						if (isAssetsPath(abs)) {
							const file = asProvidedFile(await provide(abs));
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
			if (isBookmarksPath(destination)) {
				this.dispatchEvent(new CustomEvent("bookmarks-reject", {
					detail: {
						reason: "bookmarks backend does not store file bytes",
						path: destination,
						count: 0
					},
					bubbles: true,
					composed: true
				}));
				return;
			}
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
		if (isBookmarksPath(destination)) {
			const internal = this.#clipboard;
			if (internal?.cut && internal.items.length > 0 && internal.items.every((p) => isBookmarksPath(p))) {
				const moveBackend = this.bookmarksBackendFor(destination);
				if (moveBackend?.move) {
					try {
						for (const src of internal.items) try {
							await moveBackend.move(src, destination);
						} catch (e) {
							console.warn(e);
						}
						this.#clipboard = null;
						await this.refreshList(this.path);
					} catch (e) {
						console.warn(e);
					}
					return;
				}
			}
			try {
				let systemText = "";
				try {
					await waitForClipboardFrame();
					systemText = await navigator.clipboard?.readText?.();
				} catch {}
				if (systemText) {
					await this.ingestIntoBookmarks({ getData: (type) => type === "text/plain" ? systemText : "" }, destination);
					await this.refreshList(this.path);
				}
			} catch (e) {
				console.warn(e);
			}
			return;
		}
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
		if (isBookmarksPath(destination)) {
			const payload = ev.clipboardData || ev.dataTransfer;
			if (payload) {
				Promise.try(async () => {
					await this.ingestIntoBookmarks(payload, destination);
					await this.refreshList(this.path);
				}).catch(console.warn);
				return;
			}
			this.requestPaste();
			return;
		}
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
		if (isBookmarksPath(destination)) {
			const payload = ev.clipboardData || ev.dataTransfer;
			if (payload) {
				await this.ingestIntoBookmarks(payload, destination);
				await this.refreshList(this.path);
			}
			return;
		}
		if (ev.clipboardData || ev.dataTransfer) {
			const payload = ev.clipboardData || ev.dataTransfer;
			const directoryHandlePromises = this.captureDirectoryHandlePromises(payload);
			await this.ingestIncomingData(payload, destination, directoryHandlePromises);
			await this.finishIncoming(destination);
			return;
		}
	}
	/** WHY: host is `ui-file-manager-content`; runtime listens on `ui-file-manager`. */
	dispatchEvent(event) {
		const host = this.host;
		if (!host) return;
		if (event instanceof CustomEvent) {
			host.dispatchEvent(new CustomEvent(event.type, {
				detail: event.detail,
				bubbles: true,
				composed: true,
				cancelable: event.cancelable
			}));
			return;
		}
		host.dispatchEvent(event);
	}
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/utils.ts
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
var sizeCache = /* @__PURE__ */ new Map();
/**
* Format file size with caching
* Uses cached values for performance in lists.
*/
var formatSize = (bytes) => {
	if (bytes === void 0 || bytes === null) return "";
	if (sizeCache.has(bytes)) return sizeCache.get(bytes);
	let formatted;
	if (bytes < 1024) formatted = bytes + " B";
	else if (bytes < 1048576) formatted = (bytes / 1024).toFixed(2) + " kB";
	else if (bytes < 1073741824) formatted = (bytes / 1024 / 1024).toFixed(2) + " MB";
	else formatted = (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
	sizeCache.set(bytes, formatted);
	return formatted;
};
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
//#region ../../modules/projects/fl.ui/src/ui/explorer/ContextMenu.ts
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var IMPORTANT_CSS = "important";
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var rootMenuPlacement = null;
var rootMenuOverlayUnregister = null;
var cleanupFns = [];
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuPlacementByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
var SUBMENU_FALLBACKS = [
	"left-start",
	"right-end",
	"left-end",
	"bottom-start",
	"top-start"
];
/**
* WHY: Chromium CSS Anchor (`strategy: auto`) only flips — it does not keep the
* submenu inside the visual viewport. Force the JS solver + a post-layout
* measure so the first paint (icons/fonts) cannot leave a 0×0 clamp.
*/
var placeMenuOverlay = (menu, options) => {
	const handle = placeOverlay(menu, {
		...options,
		strategy: "js"
	});
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => {
		handle.update?.();
	});
	return handle;
};
/**
* WHY: Before Settings opens, `html[data-theme]` may lag OS prefers-color-scheme.
* Stamp the same pin QS/Theme uses so light panels never keep dark-default white ink.
*/
var resolveContextMenuTheme = () => {
	const root = document.documentElement;
	const pinned = String(root.getAttribute("data-theme") || "").trim().toLowerCase();
	if (pinned === "light" || pinned === "dark") return pinned;
	const scheme = String(root.getAttribute("data-scheme") || "").trim().toLowerCase();
	if (scheme === "light" || scheme === "dark") return scheme;
	try {
		const stored = String(localStorage.getItem("rs-appearance-theme") || "").trim().toLowerCase();
		if (stored === "light" || stored === "dark") return stored;
	} catch {}
	return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};
/**
* WHY: Explorer menus can be mounted beside host-shell controls that apply
* broad `button`, `ul`, and `ui-icon` rules. Inline geometry stays important;
* INVARIANT: do not stamp slate/hex background/color — wallpaper `--base-color` must tint the panel.
*/
var stampContextMenuPanel = (menu, compact) => {
	menu.style.setProperty("position", "fixed", IMPORTANT_CSS);
	menu.style.setProperty("box-sizing", "border-box", IMPORTANT_CSS);
	menu.style.setProperty("min-width", compact ? "188px" : "220px", IMPORTANT_CSS);
	menu.style.setProperty("max-width", "min(320px, calc(100vw - 24px))", IMPORTANT_CSS);
	menu.style.setProperty("padding", compact ? "0.3rem" : "0.4rem", IMPORTANT_CSS);
	menu.style.setProperty("border-radius", "14px", IMPORTANT_CSS);
	menu.style.setProperty("pointer-events", "auto", IMPORTANT_CSS);
	menu.style.setProperty("backdrop-filter", "blur(10px)", IMPORTANT_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "blur(10px)", IMPORTANT_CSS);
	menu.style.removeProperty("border");
	menu.style.removeProperty("background");
	menu.style.removeProperty("color");
	menu.style.removeProperty("box-shadow");
	const theme = resolveContextMenuTheme();
	menu.dataset.theme = theme;
	menu.style.setProperty("color-scheme", theme === "light" ? "light only" : "dark only", IMPORTANT_CSS);
};
var stampContextMenuList = (list) => {
	list.style.setProperty("list-style", "none", IMPORTANT_CSS);
	list.style.setProperty("list-style-type", "none", IMPORTANT_CSS);
	list.style.setProperty("margin", "0", IMPORTANT_CSS);
	list.style.setProperty("padding", "0", IMPORTANT_CSS);
	list.style.setProperty("display", "flex", IMPORTANT_CSS);
	list.style.setProperty("flex-direction", "column", IMPORTANT_CSS);
	list.style.setProperty("align-items", "stretch", IMPORTANT_CSS);
	list.style.setProperty("gap", "0.2rem", IMPORTANT_CSS);
	list.style.setProperty("width", "100%", IMPORTANT_CSS);
	list.style.setProperty("box-sizing", "border-box", IMPORTANT_CSS);
};
var stampContextMenuItem = (button, danger) => {
	button.style.setProperty("appearance", "none", IMPORTANT_CSS);
	button.style.setProperty("-webkit-appearance", "none", IMPORTANT_CSS);
	button.style.setProperty("box-sizing", "border-box", IMPORTANT_CSS);
	button.style.setProperty("width", "100%", IMPORTANT_CSS);
	button.style.setProperty("max-width", "100%", IMPORTANT_CSS);
	button.style.setProperty("margin", "0", IMPORTANT_CSS);
	button.style.setProperty("display", "grid", IMPORTANT_CSS);
	button.style.setProperty("grid-template-columns", "1.375rem minmax(0, 1fr) auto", IMPORTANT_CSS);
	button.style.setProperty("align-items", "center", IMPORTANT_CSS);
	button.style.setProperty("justify-items", "start", IMPORTANT_CSS);
	button.style.setProperty("gap", "0.55rem", IMPORTANT_CSS);
	button.style.setProperty("border", "none", IMPORTANT_CSS);
	button.style.setProperty("border-radius", "10px", IMPORTANT_CSS);
	button.style.setProperty("padding", "0.5rem 0.6rem", IMPORTANT_CSS);
	button.style.setProperty("min-height", "2.35rem", IMPORTANT_CSS);
	button.style.setProperty("font", "inherit", IMPORTANT_CSS);
	button.style.setProperty("font-size", "0.8125rem", IMPORTANT_CSS);
	button.style.setProperty("line-height", "1.25", IMPORTANT_CSS);
	button.style.setProperty("text-align", "start", IMPORTANT_CSS);
	button.style.setProperty("cursor", "pointer", IMPORTANT_CSS);
	button.style.removeProperty("background");
	button.style.removeProperty("background-color");
	if (!danger) button.style.setProperty("color", "inherit", IMPORTANT_CSS);
	else {
		const dangerInk = resolveContextMenuTheme() === "light" ? "#9f1239" : "#fecaca";
		button.style.setProperty("color", dangerInk, IMPORTANT_CSS);
		button.style.setProperty("--cw-menu-fg", dangerInk, IMPORTANT_CSS);
	}
};
var ensureStyle = () => {
	let style = document.getElementById("cw-unified-context-menu-style");
	if (!style) {
		style = document.createElement("style");
		style.id = "cw-unified-context-menu-style";
		document.head.appendChild(style);
	}
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${CONTEXT_MENU_LAYER_Z_FALLBACK});
            pointer-events: none;
        }

        .cw-context-menu {
            /* WHY: Menu often mounts outside .wf-demo-root — use :root wallpaper seeds. */
            --cw-menu-seed: var(--base-color, var(--color-primary, #5a7fff));
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            /*
             * WHY: !important — unlayered button rules / token-fallback sheets shipped by some hosts
             * override the panel shadow otherwise; mirror the explorer-view unified menu so the
             * speed-dial context menu keeps visible elevation + glass blur.
             */
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            pointer-events: auto;
            user-select: none;
            /* WHY: nested Actions/Open-in menus are taller than the remaining
             * viewport; CSS Anchor flip does not clamp, so the panel must scroll. */
            max-height: min(80dvh, calc(100vh - 16px));
            overflow-x: hidden;
            overflow-y: auto;
            overscroll-behavior: contain;
        }

        html[data-theme="light"] .cw-context-menu,
        .cw-context-menu[data-theme="light"] {
            color-scheme: light only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        html[data-theme="dark"] .cw-context-menu,
        .cw-context-menu[data-theme="dark"] {
            color-scheme: dark only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) .cw-context-menu:not([data-theme="dark"]) {
                color-scheme: light only;
                --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
                --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
                --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
                border-color: var(--cw-menu-border);
                background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
                color: var(--cw-menu-fg);
                box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
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
            display: block !important;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
        }

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
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
        }

        .cw-context-menu__item > * {
            pointer-events: none;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 16%, transparent) !important;
        }

        .cw-context-menu__item[disabled] {
            opacity: 0.45;
            cursor: default;
        }

        .cw-context-menu__item--danger {
            color: #fecaca !important;
        }

        html[data-theme="light"] .cw-context-menu__item--danger,
        .cw-context-menu[data-theme="light"] .cw-context-menu__item--danger {
            color: #9f1239 !important;
        }

        .cw-context-menu__icon {
            justify-self: center;
            inline-size: 1.375rem;
            block-size: 1.375rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            inline-size: 1.125rem !important;
            block-size: 1.125rem !important;
            min-inline-size: 1.125rem !important;
            min-block-size: 1.125rem !important;
            --icon-padding: 0px !important;
            color: var(--cw-menu-fg, inherit) !important;
            pointer-events: none;
        }

        .cw-context-menu__label {
            justify-self: stretch;
            text-align: start !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-inline-size: 0;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron {
            justify-self: end;
            opacity: 0.72;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            pointer-events: none;
        }
    `;
};
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
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		submenuPlacementByDepth.get(key)?.dispose();
		submenuPlacementByDepth.delete(key);
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session, placementStrategy) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	menu.style.zIndex = String(depth + 1);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	stampContextMenuList(list);
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session, placementStrategy);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		submenuPlacementByDepth.set(nextDepth, placeMenuOverlay(submenu, {
			origin: {
				type: "element",
				element: anchorButton
			},
			placement: "right-start",
			fallbacks: SUBMENU_FALLBACKS,
			strategy: "js"
		}));
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
		stampContextMenuItem(button, Boolean(item.danger));
		const hasChildren = Boolean(item.children?.length);
		button.innerHTML = `
            <span class="cw-context-menu__icon">${item.icon ? `<ui-icon icon="${item.icon}"></ui-icon>` : ""}</span>
            <span class="cw-context-menu__label">${item.label}</span>
            <span class="cw-context-menu__chevron">${hasChildren ? `<ui-icon icon="caret-right"></ui-icon>` : ""}</span>
        `;
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
		li.appendChild(button);
		list.appendChild(li);
	}
	stampContextMenuPanel(menu, compact);
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
	rootMenuOverlayUnregister?.();
	rootMenuOverlayUnregister = null;
	rootMenuPlacement?.dispose();
	rootMenuPlacement = null;
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	submenuPlacementByDepth.clear();
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
	const overlayHost = resolveOverlayHost() ?? document.body;
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	menuLayer = layer;
	overlayHost.appendChild(layer);
	const submenuPlacementStrategy = request.placementStrategy ?? "auto";
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session, submenuPlacementStrategy);
	rootMenu = menu;
	layer.appendChild(menu);
	rootMenuPlacement = placeMenuOverlay(menu, {
		origin: {
			type: "point",
			x: request.x,
			y: request.y
		},
		placement: "bottom-start",
		gap: 0,
		strategy: "js"
	});
	rootMenuOverlayUnregister = registerTransientOverlay({
		id: `context-menu-${session}`,
		kind: "context-menu",
		element: layer,
		isActive: () => menuSession === session && menuLayer === layer && layer.isConnected,
		close: () => {
			closeUnifiedContextMenu();
			return true;
		}
	});
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		const target = event.target;
		if (target && menuLayer.contains(target)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		const parentItem = target.closest?.(".cw-context-menu__item");
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
};
var hideInAppViewerActions = () => {
	try {
		const root = document.documentElement;
		return root?.dataset?.cwspSku === "explorer" && root?.dataset?.cwspNativeShell === "capacitor";
	} catch {
		return false;
	}
};
var makeFileActionOps = () => {
	return [
		{
			id: "open",
			label: "Open",
			icon: "function"
		},
		...!hideInAppViewerActions() ? [{
			id: "view",
			label: "View",
			icon: "eye"
		}, {
			id: "view-base",
			label: "View (Base tab)",
			icon: "arrow-square-out"
		}] : [],
		{
			id: "share",
			label: "Share…",
			icon: "share-network"
		},
		{
			id: "send-transfer",
			label: "Send to CWSP Transfer",
			icon: "paper-plane-tilt"
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
			id: "copy-base64",
			label: "Copy as Base64 URL",
			icon: "code"
		},
		{
			id: "copy-text",
			label: "Copy as text",
			icon: "text-t"
		},
		{
			id: "copy-image",
			label: "Copy as image",
			icon: "image"
		},
		{
			id: "copy-real-path",
			label: "Copy real path",
			icon: "map-pin"
		},
		{
			id: "copy-blob-url",
			label: "Copy as Blob URL",
			icon: "link"
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
		"movePath",
		"share",
		"copy-real-path"
	]);
	return [...makeFileActionOps(), ...makeFileSystemOps()].filter((item) => allowed.has(item.id));
};
var makeBookmarkFileOps = () => [
	{
		id: "open",
		label: "Open",
		icon: "arrow-square-out"
	},
	{
		id: "share",
		label: "Share…",
		icon: "share-network"
	},
	{
		id: "edit-bookmark",
		label: "Edit bookmark…",
		icon: "pencil"
	},
	{
		id: "delete",
		label: "Delete",
		icon: "trash"
	},
	{
		id: "copy-real-path",
		label: "Copy real path",
		icon: "map-pin"
	},
	{
		id: "copyPath",
		label: "Copy Path",
		icon: "copy"
	},
	{
		id: "movePath",
		label: "Move",
		icon: "hand-withdraw"
	}
];
var makeBookmarkDirOps = () => [
	{
		id: "open",
		label: "Open",
		icon: "folder-open"
	},
	{
		id: "edit-bookmark",
		label: "Rename folder…",
		icon: "pencil"
	},
	{
		id: "delete",
		label: "Delete folder",
		icon: "trash"
	},
	{
		id: "copyPath",
		label: "Copy Path",
		icon: "copy"
	},
	{
		id: "movePath",
		label: "Move",
		icon: "hand-withdraw"
	}
];
var makeEmptyOps = (path) => {
	if (!canReceiveIncomingPath(path)) return [];
	if (isBookmarksPath(path)) return [
		{
			id: "new-bookmark",
			label: "New bookmark…",
			icon: "bookmark-simple"
		},
		{
			id: "new-folder",
			label: "New folder…",
			icon: "folder-plus"
		},
		{
			id: "paste",
			label: "Paste",
			icon: "clipboard"
		}
	];
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
		const bookmarkItem = Boolean(item && (isBookmarksPath(item.path) || isBookmarksPath(currentPath)));
		const baseItems = item ? bookmarkItem ? entryKind(item) === "directory" ? makeBookmarkDirOps() : makeBookmarkFileOps() : entryKind(item) === "directory" ? makeDirectoryOps() : [...makeFileActionOps(), ...makeFileSystemOps()] : makeEmptyOps(currentPath);
		if (baseItems.length === 0) return;
		ev.preventDefault();
		ev.stopPropagation();
		const menuItems = baseItems.filter((menuItem) => {
			if (menuItem.id === "copy-text") return isTextLikeEntry(item, item?.path || currentPath);
			if (menuItem.id === "copy-image") return isImageLikeEntry(item, item?.path || currentPath);
			return true;
		}).map((menuItem) => ({
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
//#region \0@oxc-project+runtime@0.148.0/helpers/esm/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/base/UIElement.ts
var UIElement = class UIElement extends GLitElement() {
	theme = "default";
	render(_weak) {
		return H`<slot></slot>`;
	}
	constructor() {
		super();
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		const self = super.connectedCallback?.() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		scheduleEnsureHostStyles(self);
		return self;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], UIElement.prototype, "theme", void 0);
UIElement = __decorate([defineElement("ui-element")], UIElement);
var UIElement_default = UIElement;
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/entry-sort.ts
var EXPLORER_SORT_EVENT = "cwsp:explorer-sort-change";
var STORAGE_KEY = "cwsp-explorer-sort";
var SORT_SET = new Set([
	["name", "Name"],
	["date", "Date modified"],
	["type", "Type"],
	["size", "Size"],
	["kind", "Kind (file / folder)"]
].map(([v]) => v));
var normalizeExplorerSortBy = (raw, fallback = "name") => {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "modified" || v === "mtime" || v === "updated") return "date";
	if (v === "mime" || v === "ext" || v === "extension") return "type";
	if (v === "bytes" || v === "length") return "size";
	if (v === "folder" || v === "folders") return "kind";
	return SORT_SET.has(v) ? v : fallback;
};
var normalizeSortDir = (raw, fallback = "asc") => {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "desc" || v === "descending" || v === "newest" || v === "z-a") return "desc";
	if (v === "asc" || v === "ascending" || v === "oldest" || v === "a-z") return "asc";
	return fallback;
};
var defaultDirForExplorerSort = (sortBy) => sortBy === "date" || sortBy === "size" ? "desc" : "asc";
var peekExplorerSort = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			const sortBy = normalizeExplorerSortBy(parsed.sortBy);
			return {
				sortBy,
				sortDir: normalizeSortDir(parsed.sortDir, defaultDirForExplorerSort(sortBy)),
				foldersFirst: parsed.foldersFirst !== false
			};
		}
	} catch {}
	return {
		sortBy: "name",
		sortDir: "asc",
		foldersFirst: true
	};
};
var writeExplorerSort = (prefs) => {
	const cur = peekExplorerSort();
	const sortBy = prefs.sortBy != null ? normalizeExplorerSortBy(prefs.sortBy, cur.sortBy) : cur.sortBy;
	const next = {
		sortBy,
		sortDir: prefs.sortDir != null ? normalizeSortDir(prefs.sortDir, defaultDirForExplorerSort(sortBy)) : cur.sortDir,
		foldersFirst: prefs.foldersFirst != null ? Boolean(prefs.foldersFirst) : cur.foldersFirst
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent(EXPLORER_SORT_EVENT, { detail: next }));
	} catch {}
	return next;
};
var cmpStr = (a, b) => a.localeCompare(b, void 0, {
	numeric: true,
	sensitivity: "base"
}) || a.localeCompare(b);
var cmpNum = (a, b) => a === b ? 0 : a < b ? -1 : 1;
var extOf = (name) => {
	const n = String(name || "").trim();
	const cut = n.lastIndexOf(".");
	return cut > 0 ? n.slice(cut + 1).toLowerCase() : "";
};
var typeOf = (item) => {
	const mime = String(item.type || item.file?.type || "").trim().toLowerCase();
	if (mime) return mime;
	return extOf(String(item.name || ""));
};
var kindOf = (item) => {
	const k = String(item.kind || "").toLowerCase();
	return k === "directory" || k === "folder" ? "directory" : "file";
};
var mtimeOf = (item) => Number(item.lastModified || item.file?.lastModified || 0) || 0;
var sizeOf = (item) => Number(item.size ?? item.file?.size ?? 0) || 0;
var sortExplorerEntries = (entries, prefs) => {
	const dir = prefs.sortDir === "desc" ? -1 : 1;
	return [...entries].sort((left, right) => {
		if (prefs.foldersFirst) {
			const folders = Number(kindOf(left) === "file") - Number(kindOf(right) === "file");
			if (folders) return folders;
		}
		let n = 0;
		if (prefs.sortBy === "date") n = cmpNum(mtimeOf(left), mtimeOf(right));
		else if (prefs.sortBy === "type") n = cmpStr(typeOf(left), typeOf(right));
		else if (prefs.sortBy === "size") n = cmpNum(sizeOf(left), sizeOf(right));
		else if (prefs.sortBy === "kind") n = cmpStr(kindOf(left), kindOf(right));
		else n = cmpStr(String(left.name || ""), String(right.name || ""));
		if (!n) n = cmpStr(String(left.name || ""), String(right.name || ""));
		return n * dir;
	});
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/explorer/ExplorerSettings.ts
try {
	preloadStyle$1(explorer_settings_default);
} catch {}
var paintMounts = (host) => {
	const list = host.querySelector("[data-explorer-mounts]");
	if (!list) return;
	const mounts = listExplorerMounts();
	list.replaceChildren();
	if (!mounts.length) {
		list.dataset.empty = "1";
		list.textContent = "No mounted folders yet.";
		return;
	}
	list.dataset.empty = "0";
	for (const mount of mounts) {
		const row = document.createElement("div");
		row.className = "explorer-settings__mount";
		row.innerHTML = `<span>${mount.label}</span><code>${mount.path}</code>`;
		const unmount = document.createElement("button");
		unmount.className = "btn";
		unmount.type = "button";
		unmount.textContent = "Unmount";
		unmount.addEventListener("click", () => {
			removeDirectoryMount(mount.id);
			paintMounts(host);
			window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
		});
		row.append(unmount);
		list.append(row);
	}
};
var paintSort = (host) => {
	const prefs = peekExplorerSort();
	const by = host.querySelector("[data-explorer-sort-by]");
	const dir = host.querySelector("[data-explorer-sort-dir]");
	const folders = host.querySelector("[data-explorer-folders-first]");
	if (by) by.value = prefs.sortBy;
	if (dir) dir.value = prefs.sortDir;
	if (folders) folders.checked = prefs.foldersFirst;
};
var paintStatus = (host, status, note = "") => {
	const el = host.querySelector("[data-explorer-status]");
	if (!el) return;
	el.textContent = [
		`All-files (/sdcard/): ${status?.allFilesAccess ? "granted" : "not granted"}`,
		status?.note ? status.note : "",
		note
	].filter(Boolean).join("\n");
};
var ExplorerSettings = class ExplorerSettings extends UIElement {
	/** WHY: pass CSS text so Glit can refill / shadow-fallback if the constructable sheet emptied. */
	styles = () => explorer_settings_default;
	onInitialize() {
		const result = super.onInitialize();
		queueMicrotask(() => {
			paintSort(this);
			paintMounts(this);
			if (isNativeStorageAvailable()) getAllFilesStatus().then((s) => paintStatus(this, s));
			else paintStatus(this, null, "Browser / PWA: use Mount folder (showDirectoryPicker).");
		});
		return result ?? this;
	}
	render = function() {
		const self = this;
		const native = isNativeStorageAvailable();
		const picker = canShowDirectoryPicker();
		return H`<div class="explorer-settings" part="root">
            <header class="explorer-settings__head">
                <h2>Explorer</h2>
                <p class="explorer-settings__hint">Sort this list and how Android or the browser reach files.</p>
            </header>
            <section class="explorer-settings__card">
                <h3 class="explorer-settings__title">
                    <ui-icon icon="sort-ascending" icon-style="duotone" size="20"></ui-icon>
                    List sort
                </h3>
                <p>Name, date, type, size, or kind. Folders can stay on top.</p>
                <label class="explorer-settings__field">
                    <span>Sort by</span>
                    <select data-explorer-sort-by on:change=${(ev) => {
			const v = ev.currentTarget.value;
			writeExplorerSort({ sortBy: v });
		}}>
                        <option value="name">Name</option>
                        <option value="date">Date modified</option>
                        <option value="type">Type</option>
                        <option value="size">Size</option>
                        <option value="kind">Kind (file / folder)</option>
                    </select>
                </label>
                <label class="explorer-settings__field">
                    <span>Order</span>
                    <select data-explorer-sort-dir on:change=${(ev) => {
			writeExplorerSort({ sortDir: ev.currentTarget.value === "desc" ? "desc" : "asc" });
		}}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
                <label class="explorer-settings__check">
                    <input type="checkbox" data-explorer-folders-first on:change=${(ev) => {
			writeExplorerSort({ foldersFirst: ev.currentTarget.checked });
		}} />
                    <span>Folders first</span>
                </label>
            </section>
            <section class="explorer-settings__card" hidden=${!native}>
                <h3 class="explorer-settings__title">
                    <ui-icon icon="hard-drives" icon-style="duotone" size="20"></ui-icon>
                    Android storage
                </h3>
                <p>All-files is <code>/sdcard/</code>. A picked tree is <code>/saf/</code> in this Explorer only.</p>
                <p data-explorer-status class="explorer-settings__status">Checking…</p>
                <div class="explorer-settings__actions">
                    <button class="btn btn--primary" type="button" disabled=${!native} on:click=${() => {
			requestAllFilesAccess().then(() => getAllFilesStatus().then((s) => paintStatus(self, s, "Opened system all-files settings.")));
		}}>Allow all files</button>
                    <button class="btn" type="button" disabled=${!native} on:click=${() => {
			pickSafTree().then((uri) => {
				paintStatus(self, null, uri ? `SAF tree: ${uri}` : "SAF pick cancelled.");
				window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
			});
		}}>Pick SAF folder</button>
                </div>
            </section>
            <section class="explorer-settings__card">
                <h3 class="explorer-settings__title">
                    <ui-icon icon="hard-drives" icon-style="duotone" size="20"></ui-icon>
                    Origin storage
                </h3>
                <p>OPFS is <code>/user/</code> when available. IndexedDB is <code>/idb/</code> beside it, or <code>/user/</code> if OPFS is off.</p>
                <label class="explorer-settings__check">
                    <input type="checkbox" data-explorer-opfs-enabled checked=${isOpfsSupportEnabled()} disabled=${!isOpfsCapabilityAvailable()} on:change=${(ev) => {
			setOpfsSupportEnabled(ev.currentTarget.checked);
			refreshMappedStorageRoots();
			unregisterFsBackend("/user/");
			unregisterFsBackend("/idb/");
			ensureDefaultFsBackends();
			window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
		}} />
                    <span>Use OPFS for <code>/user/</code></span>
                </label>
            </section>
            <section class="explorer-settings__card" hidden=${native || !picker}>
                <h3 class="explorer-settings__title">
                    <ui-icon icon="folder-plus" icon-style="duotone" size="20"></ui-icon>
                    Browser mounts
                </h3>
                <p>Chromium <code>showDirectoryPicker</code>. Handles stay in this session beside <code>/user/</code>.</p>
                <div class="explorer-settings__actions">
                    <button class="btn" type="button" disabled=${!picker} on:click=${() => {
			pickBrowserDirectory().then((handle) => {
				if (!handle) return;
				addDirectoryMount(handle);
				paintMounts(self);
				window.dispatchEvent(new CustomEvent("cwsp:explorer-mount-change"));
			});
		}}>Mount folder</button>
                </div>
                <div data-explorer-mounts class="explorer-settings__mounts"></div>
            </section>
        </div>`;
	};
};
ExplorerSettings = __decorate([defineElement("ui-explorer-settings")], ExplorerSettings);
var openExplorerSettings = (host) => {
	const existing = host?.querySelector("ui-explorer-settings") ?? document.querySelector("ui-explorer-settings");
	if (existing) {
		existing.hidden = false;
		host?.classList.add("fm-root--settings");
		return existing;
	}
	const page = document.createElement("ui-explorer-settings");
	(host || document.body).append(page);
	host?.classList.add("fm-root--settings");
	return page;
};
var closeExplorerSettings = () => {
	document.querySelectorAll("ui-file-manager").forEach((fm) => {
		const root = fm.shadowRoot?.querySelector(".fm-root");
		root?.classList.remove("fm-root--settings");
		root?.querySelector("ui-explorer-settings")?.remove();
	});
	document.querySelector("ui-explorer-settings")?.remove();
};
addEvent(window, "keydown", (ev) => {
	if (ev.key === "Escape") closeExplorerSettings();
});
//#endregion
export { FileOperative as _, sortExplorerEntries as a, showError as b, __decorate as c, openUnifiedContextMenu as d, entryKey as f, iconFor as g, formatSize as h, peekExplorerSort as i, closeUnifiedContextMenu as l, formatDate as m, openExplorerSettings as n, UIElement as o, entryKind as p, EXPLORER_SORT_EVENT as r, UIElement_default as s, closeExplorerSettings as t, createItemCtxMenu as u, isBookmarksPath as v, showSuccess as x, resolveBookmarksMenuApi as y };
