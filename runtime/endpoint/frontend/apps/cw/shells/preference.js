import { c as isCwspNativeHost, n as SKU_HUB_PATHS, s as inferCwspSkuFromLocation } from "../chunks/ecosystem-skus.js";
//#region src/frontend/boot/history-base.ts
var KNOWN_PATH_MOUNTS = [
	"cwsp",
	"transfer",
	"markdown",
	"document",
	"viewer",
	"explorer",
	"workcenter",
	"process",
	"ai",
	"kvm"
];
/** Dedicated PWA hosts — app lives at `/`. Hub/LAN keep `/markdown` `/viewer` path mounts. */
var DEDICATED_SKU_HOSTS = [
	"md.u2re.space",
	"www.md.u2re.space",
	"explorer.u2re.space",
	"www.explorer.u2re.space",
	"process.u2re.space",
	"workcenter.u2re.space",
	"ai.u2re.space",
	"cwsp.u2re.space",
	"www.cwsp.u2re.space",
	"transfer.u2re.space"
];
function isDedicatedSkuHost(hostname) {
	try {
		const host = String(hostname ?? globalThis.location?.hostname ?? "").toLowerCase();
		return DEDICATED_SKU_HOSTS.includes(host);
	} catch {
		return false;
	}
}
function isKnownPathMountSegment(segment) {
	return KNOWN_PATH_MOUNTS.includes(String(segment || "").toLowerCase());
}
/**
* On a named SKU host, `/viewer` `/markdown` `/explorer` … are Fastify aliases of `/`, not view routes.
* WHY: minimal path-routing wrote `/viewer?shell=minimal` → 302 `/viewer/` → 302 `/` → bootloop.
*/
function pathForSkuHostView(viewPath) {
	let path = String(viewPath || "/").trim() || "/";
	if (!path.startsWith("/")) path = `/${path}`;
	const sku = inferCwspSkuFromLocation();
	const nativeSku = isCwspNativeHost() && !!sku && sku !== "launcher" && sku !== "crx";
	if (!isDedicatedSkuHost() && !nativeSku) return path;
	const seg = path.replace(/^\/+/, "").split("/")[0]?.toLowerCase() || "";
	if (!seg || !isKnownPathMountSegment(seg)) return path;
	if (sku && sku !== "launcher" && sku !== "crx") return SKU_HUB_PATHS[sku]?.includes(seg) ? "/" : path;
	return "/";
}
/**
* Router base path without trailing slash ("" at domain root, "/cwsp" on IP path mount).
* WHY: absolute `/network` history entries drop the Fastify debugPath prefix and 404 on reload.
*/
function getHistoryBasePath() {
	try {
		const fromData = String(globalThis.document?.documentElement?.dataset?.cwspRouterBase || "").trim();
		if (fromData) return (fromData.startsWith("/") ? fromData : `/${fromData}`).replace(/\/+$/, "") || "";
		const baseHref = globalThis.document?.querySelector?.("base")?.getAttribute("href");
		if (baseHref && baseHref !== "/" && !baseHref.startsWith(".")) {
			const origin = globalThis.location?.origin || "http://localhost";
			return new URL(baseHref, origin).pathname.replace(/\/+$/, "") || "";
		}
		if (isDedicatedSkuHost()) return "";
		const pathname = String(globalThis.location?.pathname || "/");
		const re = new RegExp(`^/(${KNOWN_PATH_MOUNTS.join("|")})(?:/|$)`, "i");
		const m = pathname.match(re);
		if (m?.[1]) return `/${m[1].toLowerCase()}`;
	} catch {}
	return "";
}
/** Prefix an absolute app path with the history base (`/network` → `/cwsp/network`). */
function withHistoryBase(pathname) {
	const base = getHistoryBasePath();
	let path = String(pathname || "/").trim() || "/";
	if (!path.startsWith("/")) path = `/${path}`;
	if (!base) return path;
	if (path === base || path.startsWith(`${base}/`)) return path;
	const pathSeg = path.replace(/^\/+/, "").split("/")[0]?.toLowerCase() || "";
	const baseSeg = base.replace(/^\/+/, "").split("/")[0]?.toLowerCase() || "";
	if (baseSeg && pathSeg && isKnownPathMountSegment(baseSeg) && isKnownPathMountSegment(pathSeg) && pathSeg !== baseSeg) return path;
	if (path === "/") return `${base}/`;
	return `${base}${path}`;
}
/** Strip history base from a location pathname before view matching. */
function stripHistoryBase(pathname) {
	const base = getHistoryBasePath();
	let path = String(pathname || "/");
	if (!path.startsWith("/")) path = `/${path}`;
	if (!base) return path;
	if (path === base || path === `${base}/`) return "/";
	if (path.startsWith(`${base}/`)) {
		const rest = path.slice(base.length);
		return rest.startsWith("/") ? rest : `/${rest}`;
	}
	return path;
}
/** Persist detected mount on `<html>` so later navigations stay scoped. */
function ensureHistoryBaseDataset() {
	const base = getHistoryBasePath();
	try {
		const el = globalThis.document?.documentElement;
		if (el && base) el.dataset.cwspRouterBase = base;
	} catch {}
	return base;
}
//#endregion
//#region src/frontend/boot/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return shell;
	return getDefaultBootShellId();
}
/**
* Canonical default when no explicit shell preference exists: environment launcher.
*/
function getDefaultBootShellId() {
	return "environment";
}
function recordBootShellWindowActivity(shellId) {
	try {
		const payload = {
			shell: normalizeBootShellId(shellId),
			t: Date.now()
		};
		globalThis.localStorage?.setItem(LS_BOOT_SHELL_LAST_ACTIVE, JSON.stringify(payload));
	} catch {}
}
/**
* Track this tab/window as the last-used shell context (focus + pointer).
* Returns a dispose function for unmount.
*/
function initBootShellWindowActivity(shellId) {
	const shell = normalizeBootShellId(shellId);
	const onWinFocus = () => recordBootShellWindowActivity(shell);
	const onPointer = () => recordBootShellWindowActivity(shell);
	const w = globalThis;
	w.addEventListener("focus", onWinFocus);
	w.addEventListener("pointerdown", onPointer, {
		capture: true,
		passive: true
	});
	queueMicrotask(() => recordBootShellWindowActivity(shell));
	return () => {
		w.removeEventListener("focus", onWinFocus);
		w.removeEventListener("pointerdown", onPointer, { capture: true });
	};
}
//#endregion
export { stripHistoryBase as a, pathForSkuHostView as i, initBootShellWindowActivity as n, withHistoryBase as o, ensureHistoryBaseDataset as r, LS_BOOT_SHELL_LAST_ACTIVE as t };
