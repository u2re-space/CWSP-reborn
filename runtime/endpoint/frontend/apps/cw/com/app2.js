import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { A as isVirtualFsPath, F as normalizePath, W as registerDirectoryRoot, et as walkExactFile, g as getDir, nt as asProvidedFile, z as provide } from "./app.js";
//#region ../../modules/projects/lur.e/src/utils/opfs/markdown-assets.ts
var markdown_assets_exports = /* @__PURE__ */ __exportAll({
	bindDirectoryForLaunchedFiles: () => bindDirectoryForLaunchedFiles,
	collectRelativeMarkdownAssetRefs: () => collectRelativeMarkdownAssetRefs,
	findEntryRelPath: () => findEntryRelPath,
	indexDirectoryFiles: () => indexDirectoryFiles,
	isMarkdownRelativeRef: () => isMarkdownRelativeRef,
	markdownNeedsBoundDirectory: () => markdownNeedsBoundDirectory,
	mountPickedDirectory: () => mountPickedDirectory,
	observeFileSystemHandle: () => observeFileSystemHandle,
	originalRelFromRef: () => originalRelFromRef,
	pickAssetDirectory: () => pickAssetDirectory,
	pickMarkdownFile: () => pickMarkdownFile,
	pickMarkdownSaveHandle: () => pickMarkdownSaveHandle,
	pickSidecarDirectoryFiles: () => pickSidecarDirectoryFiles,
	provideBoundRelative: () => provideBoundRelative,
	registerMarkdownFilePicker: () => registerMarkdownFilePicker,
	relPathCandidates: () => relPathCandidates,
	resolveFileUnderDirectory: () => resolveFileUnderDirectory,
	saveMarkdownBlob: () => saveMarkdownBlob,
	saveMarkdownDocument: () => saveMarkdownDocument,
	writeMarkdownToHandle: () => writeMarkdownToHandle
});
/** True for `./assets/x`, `docs/a.md` — not http(s)/blob/data/#. */
var isMarkdownRelativeRef = (value) => {
	const raw = String(value || "").trim();
	return Boolean(raw) && !/^(?:[a-zA-Z][a-zA-Z\d+\-.]*:|\/\/|#|data:|blob:)/.test(raw);
};
/** Keep the markdown-relative token (`./assets/x.png`) even after the browser resolved it to the PWA origin. */
var originalRelFromRef = (value) => {
	const raw = String(value || "").trim();
	if (!raw || raw.startsWith("#") || raw.startsWith("blob:") || raw.startsWith("data:")) return "";
	if (isMarkdownRelativeRef(raw)) return raw;
	try {
		const url = new URL(raw, globalThis.location?.href || "http://localhost/");
		if (globalThis.location?.origin && url.origin === globalThis.location.origin) return url.pathname.replace(/^\/+/, "");
	} catch {}
	return "";
};
/**
* Main-thread `provide()` of a bound relative path (`/mounts/md-xxx/` + `./assets/logo.png`).
* WHY: skips OPFS worker + HTTP fetch (JXL hooks those). Mapped `/mounts/` uses `walkExactFile`.
*/
var provideBoundRelative = async (mountRoot, originalRel, sourceUrl) => {
	const rel = originalRelFromRef(originalRel) || String(originalRel || "").trim();
	if (!rel) return null;
	const bases = [];
	if (sourceUrl && isVirtualFsPath(sourceUrl)) bases.push(getDir(sourceUrl));
	if (mountRoot) bases.push(mountRoot);
	const seen = /* @__PURE__ */ new Set();
	for (const base of bases) for (const candidate of relPathCandidates(rel)) {
		const path = normalizePath(base, candidate);
		if (!path || seen.has(path)) continue;
		seen.add(path);
		const file = asProvidedFile(await provide(path).catch(() => null));
		if (file) return file;
	}
	return null;
};
/** `assets/logo/x.png` → also `logo/x.png`, `x.png` (picker was `assets/` or `logo/`). */
var relPathCandidates = (rel) => {
	const clean = String(rel || "").trim().replace(/^\.\//, "").replace(/^\/+/, "");
	if (!clean || /^(?:[a-zA-Z][a-zA-Z\d+\-.]*:|\/\/)/.test(clean)) return [];
	const parts = clean.split(/[\\/]/).filter(Boolean);
	return parts.map((_, i) => parts.slice(i).join("/"));
};
var findFileByBasename = async (dir, basename, depth = 5) => {
	try {
		return await (await dir.getFileHandle(basename, { create: false })).getFile();
	} catch {}
	if (depth <= 0) return null;
	for await (const [, handle] of dir.entries()) {
		if (handle.kind !== "directory") continue;
		const found = await findFileByBasename(handle, basename, depth - 1);
		if (found) return found;
	}
	return null;
};
/** Walk a picked folder so the viewer can resolve `./assets/…` by relative path or basename. */
var indexDirectoryFiles = async (dir, prefix = "", depth = 8, acc = []) => {
	if (depth < 0) return acc;
	for await (const [name, handle] of dir.entries()) {
		const rel = prefix ? `${prefix}/${name}` : name;
		if (handle.kind === "file") try {
			acc.push({
				rel,
				file: await handle.getFile()
			});
		} catch {}
		else if (handle.kind === "directory") await indexDirectoryFiles(handle, rel, depth - 1, acc);
	}
	return acc;
};
/** Read a markdown-relative file from a picked directory (any ancestor of the file). */
var resolveFileUnderDirectory = async (dir, rel) => {
	if (!dir) return null;
	const candidates = relPathCandidates(rel);
	for (const candidate of candidates) {
		const handle = await walkExactFile(dir, candidate);
		if (!handle) continue;
		try {
			return await handle.getFile();
		} catch {}
	}
	const base = candidates.at(-1);
	if (!base || base.includes("/")) return null;
	return findFileByBasename(dir, base);
};
/** Chromium File System Access — pick the folder that holds images / includes. */
var pickAssetDirectory = async (options = {}) => {
	const pick = globalThis.showDirectoryPicker;
	if (typeof pick !== "function") return null;
	try {
		return await pick({
			mode: options.mode || "read",
			id: options.id || "markdown-assets",
			startIn: options.startIn
		});
	} catch (error) {
		if (error?.name === "AbortError") return null;
		console.warn("[markdown-assets] showDirectoryPicker failed", error);
		return null;
	}
};
/** Watch a handle with experimental FileSystemObserver. */
var observeFileSystemHandle = (handle, onRecords) => {
	const Ctor = globalThis.FileSystemObserver;
	if (typeof Ctor !== "function" || !handle) return null;
	try {
		const observer = new Ctor((records) => onRecords(records));
		const obs = observer;
		Promise.resolve(obs.observe(handle, { recursive: true })).catch(() => Promise.resolve(obs.observe(handle))).catch(() => {});
		return { disconnect: () => observer.disconnect?.() };
	} catch {
		return null;
	}
};
/** Map a picked directory to `/mounts/<id>/` for `provide()` + relative markdown URLs. */
var mountPickedDirectory = (dir, prefix = "md") => {
	const root = `/mounts/${prefix}-${Date.now().toString(36)}/`;
	registerDirectoryRoot(root, dir);
	return root;
};
/** Walk a directory tree for the relative path of a file handle. */
var findEntryRelPath = async (dir, target) => {
	for await (const [name, handle] of dir.entries()) if (handle.kind === "file") try {
		if (await handle.isSameEntry(target)) return name;
	} catch {}
	else if (handle.kind === "directory") {
		const inner = await findEntryRelPath(handle, target);
		if (inner) return `${name}/${inner}`;
	}
	return null;
};
var ABSOLUTE_OR_EMBEDDED = /^(?:[a-zA-Z][a-zA-Z\d+\-.]*:|\/\/|#|data:|blob:)/;
/** Relative `![](…)` / `src` / `href` refs that need a sibling folder or sidecar files. */
var collectRelativeMarkdownAssetRefs = (markdown) => {
	const refs = /* @__PURE__ */ new Set();
	const md = String(markdown || "");
	for (const re of [/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?/g, /\b(?:src|href)=["']([^"']+)["']/gi]) {
		re.lastIndex = 0;
		let match = re.exec(md);
		while (match) {
			const raw = String(match[1] || "").trim();
			if (raw && !ABSOLUTE_OR_EMBEDDED.test(raw)) refs.add(raw.replace(/^\.\//, ""));
			match = re.exec(md);
		}
	}
	return [...refs];
};
var basenameOf = (value) => String(value || "").split(/[\\/]/).pop() || String(value || "");
/** True when the markdown points at local assets that are not already in the transfer. */
var markdownNeedsBoundDirectory = (markdown, sidecarNames = []) => {
	const refs = collectRelativeMarkdownAssetRefs(markdown);
	if (!refs.length) return false;
	const names = new Set(sidecarNames.map((name) => basenameOf(name).toLowerCase()).filter(Boolean));
	return refs.some((ref) => !names.has(basenameOf(ref).toLowerCase()));
};
/**
* Offer `showDirectoryPicker` (same user-activation as Launch Queue when possible).
* Cancel / missing API → null; caller continues with the File body alone.
*/
var bindDirectoryForLaunchedFiles = async (options) => {
	const files = Array.isArray(options.files) ? options.files : [];
	const mdName = String(options.filename || "").trim();
	const mdFile = mdName && files.find((file) => file.name === mdName) || files.find((file) => /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/i.test(file.name)) || files[0];
	let text = String(options.markdownText || "");
	if (!text && mdFile) try {
		text = await mdFile.text();
	} catch {
		text = "";
	}
	const sidecars = files.filter((file) => file !== mdFile).map((file) => file.name);
	if (!markdownNeedsBoundDirectory(text, sidecars)) return null;
	const dir = await pickAssetDirectory({
		startIn: options.startIn,
		id: "markdown-assets",
		mode: "read"
	});
	if (!dir) return null;
	const root = mountPickedDirectory(dir, "md");
	let rel = mdFile?.name || mdName || "document.md";
	const start = options.startIn;
	if (start && start.kind === "file") {
		const found = await findEntryRelPath(dir, start);
		if (found) rel = found;
	}
	return {
		root,
		virtualPath: `${root}${rel}`
	};
};
var MARKDOWN_INPUT_ACCEPT = ".md,.markdown,.mdown,.mkd,.mkdn,.mdtxt,.mdtext,.txt,text/markdown,text/plain";
var pickFilesViaInput = (options) => new Promise((resolve) => {
	const input = document.createElement("input");
	input.type = "file";
	if (options.accept) input.accept = options.accept;
	if (options.multiple) input.multiple = true;
	if (options.directory) {
		input.setAttribute("webkitdirectory", "");
		input.setAttribute("directory", "");
		input.multiple = true;
	}
	const finish = (files) => resolve(files);
	input.addEventListener("change", () => finish(Array.from(input.files || [])), { once: true });
	input.addEventListener("cancel", () => finish([]), { once: true });
	input.click();
});
var isExtensionPage = () => {
	try {
		return globalThis.location?.protocol === "chrome-extension:";
	} catch {
		return false;
	}
};
var registeredMarkdownFilePicker = null;
var registerMarkdownFilePicker = (fn) => {
	registeredMarkdownFilePicker = fn;
};
/** FSA when present; Capacitor / CRX / Firefox fall back to `<input type=file>`. */
var pickMarkdownFile = async () => {
	if (registeredMarkdownFilePicker) {
		const native = await registeredMarkdownFilePicker().catch(() => void 0);
		if (native?.file) return native;
		if (native === null) return null;
	}
	const pickFile = globalThis.showOpenFilePicker;
	if (!isExtensionPage() && typeof pickFile === "function") try {
		const [handle] = await pickFile({
			multiple: false,
			types: [{
				description: "Markdown",
				accept: {
					"text/markdown": [
						".md",
						".markdown",
						".mdown",
						".mkd"
					],
					"text/plain": [".txt"]
				}
			}]
		});
		if (!handle) return null;
		return {
			file: await handle.getFile(),
			sidecars: [],
			handle
		};
	} catch (error) {
		if (error?.name === "AbortError") return null;
	}
	const files = await pickFilesViaInput({ accept: MARKDOWN_INPUT_ACCEPT });
	return files[0] ? {
		file: files[0],
		sidecars: []
	} : null;
};
/**
* Folder of images / includes. Chromium FSA first; otherwise `webkitdirectory`
* (Capacitor WebView + CRX) so relative `![](./assets/…)` can resolve from sidecars.
*/
var pickSidecarDirectoryFiles = async () => {
	const dir = await pickAssetDirectory({
		id: "markdown-assets",
		mode: "read"
	});
	if (dir) return {
		files: (await indexDirectoryFiles(dir)).map((row) => {
			try {
				Object.defineProperty(row.file, "webkitRelativePath", { value: row.rel });
			} catch {}
			return row.file;
		}),
		directory: dir,
		root: mountPickedDirectory(dir, "md")
	};
	return {
		files: await pickFilesViaInput({ directory: true }),
		directory: null,
		root: null
	};
};
var MARKDOWN_SAVE_TYPES = [{
	description: "Markdown files",
	accept: { "text/markdown": [".md", ".markdown"] }
}];
/** Write through a remembered FSA handle (no second picker when permission holds). */
var writeMarkdownToHandle = async (handle, content) => {
	if (!handle || typeof handle.createWritable !== "function") return false;
	try {
		const query = handle.queryPermission?.({ mode: "readwrite" });
		if (query) {
			if (await query !== "granted") {
				const next = await handle.requestPermission?.({ mode: "readwrite" });
				if (next && next !== "granted") return false;
			}
		}
		const writable = await handle.createWritable();
		await writable.write(content);
		await writable.close();
		return true;
	} catch {
		return false;
	}
};
/** `showSaveFilePicker` when the browser exposes it (Web / PWA / some CRX). */
var pickMarkdownSaveHandle = async (filename) => {
	const savePicker = globalThis.showSaveFilePicker;
	if (typeof savePicker !== "function") return null;
	const name = String(filename || "document.md").trim() || "document.md";
	try {
		return await savePicker({
			suggestedName: name,
			types: MARKDOWN_SAVE_TYPES
		});
	} catch (error) {
		if (error?.name === "AbortError") return "cancelled";
		return null;
	}
};
/**
* Remembered FSA handle → `showSaveFilePicker` → CRX `chrome.downloads`
* → Web Share (Capacitor) → `<a download>`.
* WHY: Save must not re-prompt when the last picker handle is still writable.
*/
var saveMarkdownDocument = async (content, filename, existingHandle) => {
	const name = String(filename || "document.md").trim() || "document.md";
	if (existingHandle && await writeMarkdownToHandle(existingHandle, content)) return {
		result: "saved",
		handle: existingHandle
	};
	const picked = await pickMarkdownSaveHandle(name);
	if (picked === "cancelled") return { result: "cancelled" };
	if (picked) {
		if (await writeMarkdownToHandle(picked, content)) return {
			result: "saved",
			handle: picked
		};
	}
	const chromeDl = globalThis.chrome?.downloads?.download;
	const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
	if (typeof chromeDl === "function") {
		const url = URL.createObjectURL(blob);
		try {
			await chromeDl({
				url,
				filename: name,
				saveAs: true
			});
			return { result: "downloaded" };
		} catch {
			URL.revokeObjectURL(url);
		}
	}
	const file = new File([blob], name, { type: "text/markdown" });
	const nav = navigator;
	if (typeof nav.share === "function" && (!nav.canShare || nav.canShare({ files: [file] }))) try {
		await nav.share({
			files: [file],
			title: name
		});
		return { result: "shared" };
	} catch (error) {
		if (error?.name === "AbortError") return { result: "cancelled" };
	}
	try {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = name;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 250);
		return { result: "downloaded" };
	} catch {
		return { result: "failed" };
	}
};
/** PWA FSA → CRX `chrome.downloads` → Web Share (Capacitor) → `<a download>`. */
var saveMarkdownBlob = async (content, filename) => (await saveMarkdownDocument(content, filename)).result;
//#endregion
export { relPathCandidates as _, isMarkdownRelativeRef as a, saveMarkdownDocument as b, mountPickedDirectory as c, pickAssetDirectory as d, pickMarkdownFile as f, registerMarkdownFilePicker as g, provideBoundRelative as h, indexDirectoryFiles as i, observeFileSystemHandle as l, pickSidecarDirectoryFiles as m, collectRelativeMarkdownAssetRefs as n, markdownNeedsBoundDirectory as o, pickMarkdownSaveHandle as p, findEntryRelPath as r, markdown_assets_exports as s, bindDirectoryForLaunchedFiles as t, originalRelFromRef as u, resolveFileUnderDirectory as v, writeMarkdownToHandle as x, saveMarkdownBlob as y };
