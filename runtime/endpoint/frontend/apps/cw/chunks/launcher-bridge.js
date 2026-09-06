import { r as __exportAll } from "./rolldown-runtime.js";
import { o as invokeCwsPlatformIPC } from "./cws-bridge.js";
//#region src/routing/native/launcher-bridge.ts
var launcher_bridge_exports = /* @__PURE__ */ __exportAll({
	launcherAckPendingPin: () => launcherAckPendingPin,
	launcherAppInfo: () => launcherAppInfo,
	launcherConsumePendingPin: () => launcherConsumePendingPin,
	launcherHasPackages: () => launcherHasPackages,
	launcherIcon: () => launcherIcon,
	launcherIconBlobUrl: () => launcherIconBlobUrl,
	launcherIconPackIcons: () => launcherIconPackIcons,
	launcherIconPacks: () => launcherIconPacks,
	launcherIconVariants: () => launcherIconVariants,
	launcherIsDefault: () => launcherIsDefault,
	launcherLaunch: () => launcherLaunch,
	launcherList: () => launcherList,
	launcherListPinnedShortcuts: () => launcherListPinnedShortcuts,
	launcherOpenAppInfo: () => launcherOpenAppInfo,
	launcherOpenUri: () => launcherOpenUri,
	launcherRequestDefault: () => launcherRequestDefault,
	launcherShortcutIcon: () => launcherShortcutIcon,
	launcherStartShortcut: () => launcherStartShortcut,
	launcherUninstall: () => launcherUninstall,
	storageAllFilesStatus: () => storageAllFilesStatus,
	storageList: () => storageList,
	storagePickSaf: () => storagePickSaf,
	storageRead: () => storageRead,
	storageRequestAllFiles: () => storageRequestAllFiles,
	widgetAttach: () => widgetAttach,
	widgetBind: () => widgetBind,
	widgetDelete: () => widgetDelete,
	widgetDetach: () => widgetDetach,
	widgetHideAll: () => widgetHideAll,
	widgetLayout: () => widgetLayout,
	widgetList: () => widgetList
});
async function launcherIsDefault() {
	const r = await invokeCwsPlatformIPC({ channel: "launcher:is-default" });
	return Boolean(r.ok && r.echo?.isDefault);
}
async function launcherRequestDefault() {
	return (await invokeCwsPlatformIPC({ channel: "launcher:request-default" })).ok === true;
}
async function launcherList(query) {
	const trimmed = query?.trim();
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:list",
		payload: trimmed ? { query: trimmed } : {}
	});
	if (!r.ok) return [];
	const apps = r.echo?.apps ?? r.apps;
	return Array.isArray(apps) ? apps : [];
}
/** Which Android packages are installed (sibling SKU settings tabs). */
async function launcherHasPackages(pkgs) {
	const packages = [...new Set(pkgs.map((p) => String(p || "").trim()).filter(Boolean))];
	if (!packages.length) return {};
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:has-packages",
		payload: { packages }
	});
	if (!r.ok) return {};
	const installed = r.echo?.installed;
	return installed && typeof installed === "object" ? installed : {};
}
async function launcherLaunch(pkg, component, launch) {
	const packageName = String(pkg || "").trim();
	if (!packageName) return false;
	const componentName = String(launch?.componentName || component || "").trim();
	const payload = { packageName };
	if (componentName) payload.componentName = componentName;
	if (launch) {
		if (launch.action) payload.action = String(launch.action).trim();
		if (launch.data) payload.data = String(launch.data).trim();
		if (launch.mimeType) payload.mimeType = String(launch.mimeType).trim();
		if (launch.flags?.length) payload.flags = launch.flags;
		if (launch.categories?.length) payload.categories = launch.categories;
		if (launch.extras && Object.keys(launch.extras).length) payload.extras = launch.extras;
	}
	return (await invokeCwsPlatformIPC({
		channel: "launcher:launch",
		payload
	})).ok === true;
}
async function launcherAppInfo(pkg) {
	const packageName = String(pkg || "").trim();
	if (!packageName) return null;
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:app-info",
		payload: { packageName }
	});
	if (!r.ok) return null;
	return r.echo || r;
}
async function launcherOpenAppInfo(pkg) {
	const packageName = String(pkg || "").trim();
	if (!packageName) return false;
	return (await invokeCwsPlatformIPC({
		channel: "launcher:open-app-info",
		payload: { packageName }
	})).ok === true;
}
async function launcherUninstall(pkg) {
	const packageName = String(pkg || "").trim();
	if (!packageName) return false;
	return (await invokeCwsPlatformIPC({
		channel: "launcher:uninstall",
		payload: { packageName }
	})).ok === true;
}
/** Material Files document pins — LauncherApps.startShortcut(package, id). */
async function launcherStartShortcut(pkg, shortcutId) {
	const packageName = String(pkg || "").trim();
	const id = String(shortcutId || "").trim();
	if (!packageName || !id) return false;
	return (await invokeCwsPlatformIPC({
		channel: "launcher:start-shortcut",
		payload: {
			packageName,
			shortcutId: id
		}
	})).ok === true;
}
/** Shortcut-specific icon (not the publisher app icon). */
async function launcherShortcutIcon(pkg, shortcutId, size = 96) {
	const packageName = String(pkg || "").trim();
	const id = String(shortcutId || "").trim();
	if (!packageName || !id) return "";
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:shortcut-icon",
		payload: {
			packageName,
			shortcutId: id,
			size: Math.max(16, Math.min(512, Math.round(Number(size) || 96)))
		}
	});
	if (!r.ok) return "";
	const echo = r.echo;
	const base64 = String(echo?.base64 || r.base64 || "").trim();
	if (!base64) return "";
	return `data:${String(echo?.mime || r.mime || "image/png").trim() || "image/png"};base64,${base64}`;
}
async function launcherIcon(cacheKey, size = 64, variant = "default", pack = "", drawable = "") {
	const key = String(cacheKey || "").trim();
	if (!key) return "";
	const v = String(variant || "default").trim() || "default";
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	const payload = {
		packageName: key,
		cacheKey: key,
		size,
		variant: v
	};
	if (packPkg) {
		payload.pack = packPkg;
		payload.iconPack = packPkg;
	}
	if (draw) payload.drawable = draw;
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:icon",
		payload
	});
	if (!r.ok) return "";
	const echo = r.echo;
	const base64 = echo?.base64 ?? r.base64;
	if (!base64) return "";
	return `data:${echo?.mime ?? r.mime ?? "image/png"};base64,${base64}`;
}
/** Which adaptive / Material You variants PackageManager can supply for this package. */
async function launcherIconVariants(cacheKey) {
	const key = String(cacheKey || "").trim();
	if (!key) return [];
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:icon-variants",
		payload: {
			packageName: key,
			cacheKey: key
		}
	});
	if (!r.ok) return [];
	const variants = r.echo?.variants ?? r.variants;
	return Array.isArray(variants) ? variants : [];
}
/** Installed launcher icon packs (ADW / Nova / GO theme intents). */
async function launcherIconPacks() {
	const r = await invokeCwsPlatformIPC({ channel: "launcher:icon-packs" });
	if (!r.ok) return [];
	const packs = r.echo?.packs ?? r.packs;
	return Array.isArray(packs) ? packs : [];
}
/** Browse drawable names declared in a pack's appfilter. */
async function launcherIconPackIcons(pack, query = "", limit = 120) {
	const packPkg = String(pack || "").trim();
	if (!packPkg) return [];
	const r = await invokeCwsPlatformIPC({
		channel: "launcher:icon-pack-icons",
		payload: {
			pack: packPkg,
			packageName: packPkg,
			query: String(query || "").trim(),
			limit
		}
	});
	if (!r.ok) return [];
	const icons = r.echo?.icons ?? r.icons;
	return Array.isArray(icons) ? icons : [];
}
/** PNG (or native mime) as blob: object URL — preferred for WebView `<img src>`. */
async function launcherIconBlobUrl(cacheKey, size = 64, variant = "default", pack = "", drawable = "") {
	const dataUrl = await launcherIcon(cacheKey, size, variant, pack, drawable);
	if (!dataUrl) return "";
	const blob = await (await fetch(dataUrl)).blob();
	const type = blob.type && blob.type.startsWith("image/") ? blob.type : "image/png";
	const normalized = blob.type === type ? blob : new Blob([await blob.arrayBuffer()], { type });
	return URL.createObjectURL(normalized);
}
/** ACTION_VIEW for http(s)/deep links — browsers, YouTube, etc. */
async function launcherOpenUri(uri, options = {}) {
	const url = String(uri || "").trim();
	if (!url) return false;
	const packageName = String(options.packageName || "").trim();
	const mimeType = String(options.mimeType || "").trim();
	const chooser = options.chooser !== false;
	const title = String(options.title || "Open with").trim() || "Open with";
	return (await invokeCwsPlatformIPC({
		channel: "launcher:open-uri",
		payload: {
			uri: url,
			url,
			...packageName ? { packageName } : {},
			...mimeType ? { mimeType } : {},
			chooser,
			title
		}
	})).ok === true;
}
/** Peek Share / VIEW / pin-shortcut queued before the WebView was ready. */
async function launcherConsumePendingPin() {
	const r = await invokeCwsPlatformIPC({ channel: "launcher:pending-pin" });
	if (!r.ok) return null;
	const pin = r.echo?.pin ?? r.pin;
	if (!pin || typeof pin !== "object") return null;
	const url = String(pin.url || pin.href || "").trim();
	const pkg = String(pin.packageName || "").trim();
	const shortcutId = String(pin.shortcutId || "").trim();
	if (!url && !pkg && !shortcutId) return null;
	return pin;
}
/** Shortcuts the OS already pinned to this launcher (Files will not re-send them). */
async function launcherListPinnedShortcuts() {
	const r = await invokeCwsPlatformIPC({ channel: "launcher:list-pinned" });
	if (!r.ok) return [];
	const list = r.echo?.shortcuts ?? r.shortcuts;
	return Array.isArray(list) ? list : [];
}
/** Drop the native stash after the Speed Dial tile is actually added. */
async function launcherAckPendingPin() {
	try {
		await invokeCwsPlatformIPC({ channel: "launcher:ack-pin" });
	} catch {}
}
async function widgetList(query) {
	const trimmed = query?.trim();
	const r = await invokeCwsPlatformIPC({
		channel: "widget:list",
		payload: trimmed ? { query: trimmed } : {}
	});
	if (!r.ok) return [];
	const widgets = r.echo?.widgets ?? r.widgets;
	return Array.isArray(widgets) ? widgets : [];
}
async function widgetBind(provider) {
	const id = String(provider || "").trim();
	if (!id) return null;
	const r = await invokeCwsPlatformIPC({
		channel: "widget:bind",
		payload: {
			provider: id,
			componentName: id
		}
	});
	if (!r.ok) return null;
	const echo = r.echo || r;
	const widgetId = Number(echo.widgetId || r.widgetId || 0);
	if (!widgetId) return null;
	return {
		provider: String(echo.provider || id),
		packageName: String(echo.packageName || ""),
		label: String(echo.label || "Widget"),
		spanCols: Math.max(1, Number(echo.spanCols) || 2),
		spanRows: Math.max(1, Number(echo.spanRows) || 1),
		widgetId,
		preview: echo.preview ? String(echo.preview) : void 0
	};
}
async function widgetAttach(box) {
	if (!box?.widgetId) return false;
	return (await invokeCwsPlatformIPC({
		channel: "widget:attach",
		payload: box
	})).ok === true;
}
async function widgetLayout(box) {
	if (!box?.widgetId) return false;
	return (await invokeCwsPlatformIPC({
		channel: "widget:layout",
		payload: box
	})).ok === true;
}
async function widgetDetach(widgetId) {
	const id = Number(widgetId) || 0;
	if (!id) return false;
	return (await invokeCwsPlatformIPC({
		channel: "widget:detach",
		payload: { widgetId: id }
	})).ok === true;
}
async function widgetDelete(widgetId) {
	const id = Number(widgetId) || 0;
	if (!id) return false;
	return (await invokeCwsPlatformIPC({
		channel: "widget:delete",
		payload: { widgetId: id }
	})).ok === true;
}
async function widgetHideAll() {
	return (await invokeCwsPlatformIPC({ channel: "widget:hide" })).ok === true;
}
async function storageList(root, path = "/") {
	const r = await invokeCwsPlatformIPC({
		channel: "storage:list",
		payload: {
			root,
			path
		}
	});
	const echo = r.echo || r;
	return Array.isArray(echo.entries) ? echo.entries : [];
}
async function storageRead(root, path) {
	const r = await invokeCwsPlatformIPC({
		channel: "storage:read",
		payload: {
			root,
			path
		}
	});
	const echo = r.echo || r;
	return echo?.data ? echo : null;
}
async function storagePickSaf() {
	const r = await invokeCwsPlatformIPC({ channel: "storage:pick-saf" });
	const echo = r.echo || r;
	return String(echo.uri || echo.treeUri || echo.incomingDir || "");
}
async function storageAllFilesStatus() {
	const r = await invokeCwsPlatformIPC({ channel: "storage:all-files-status" });
	const echo = r.echo || r;
	return {
		allFilesAccess: echo.allFilesAccess === true,
		runtimeGranted: echo.runtimeGranted === true,
		note: echo.note ? String(echo.note) : void 0
	};
}
async function storageRequestAllFiles() {
	const r = await invokeCwsPlatformIPC({ channel: "storage:all-files-request" });
	const echo = r.echo || r;
	return r.ok === true || echo.opened === true;
}
//#endregion
export { launcher_bridge_exports as t };
