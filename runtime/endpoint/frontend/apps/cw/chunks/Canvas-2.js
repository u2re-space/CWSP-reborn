import { E as whenAnyScreenChanges, T as orientationNumberMap, w as getCorrectOrientation } from "../fest/dom.js";
//#region ../../modules/projects/image.ts/src/canvas/Canvas-2.ts
/**
* Underlying app canvas layer.
*
* Hosts background/image surface under shell windows.
*/
var WALLPAPER_STORAGE_KEY = "rs-wallpaper-image";
var DEFAULT_WALLPAPER_URL = "/assets/wallpaper.jpg";
var currentOrientNumber = () => orientationNumberMap?.[getCorrectOrientation()] ?? 0;
/**
* INVARIANT: `ui-canvas` cover-rotate reads `data-orient` (see Canvas.ts).
* Keep attr + CSS var in lockstep with {@link fixOrientToScreen} / `orientRef`.
*/
var syncCanvasOrient = (canvas) => {
	const apply = () => {
		const n = currentOrientNumber();
		const s = String(n);
		if (canvas.getAttribute("data-orient") !== s) canvas.setAttribute("data-orient", s);
		if (canvas.getAttribute("orient") !== s) canvas.setAttribute("orient", s);
		canvas.style.setProperty("--orient", s);
		canvas.orient = n;
	};
	apply();
	return whenAnyScreenChanges(apply);
};
/** Re-apply orient on every live wallpaper canvas (e.g. after late mount). */
var syncAppWallpaperOrient = () => {
	document.querySelectorAll("[data-app-layer=\"canvas\"] canvas[is=\"ui-canvas\"], [data-app-layer=\"canvas\"] canvas.ui-canvas").forEach((canvas) => {
		const n = currentOrientNumber();
		const s = String(n);
		canvas.setAttribute("data-orient", s);
		canvas.setAttribute("orient", s);
		canvas.style.setProperty("--orient", s);
	});
};
var initializeAppCanvasLayer = (container) => {
	const root = container;
	root.replaceChildren();
	root.dataset.appLayer = "canvas";
	root.style.position = "absolute";
	root.style.inset = "0";
	root.style.overflow = "hidden";
	root.style.background = "radial-gradient(circle at 18% 12%, #1b2a45 0%, #0f1728 42%, #060910 100%)";
	const glow = document.createElement("div");
	glow.className = "app-canvas__glow";
	glow.style.position = "absolute";
	glow.style.inset = "-20%";
	glow.style.pointerEvents = "none";
	glow.style.opacity = "0.7";
	glow.style.background = "radial-gradient(circle at 15% 20%, rgba(145,185,255,0.45) 0%, transparent 40%), radial-gradient(circle at 75% 72%, rgba(91,134,235,0.35) 0%, transparent 43%)";
	const canvas = document.createElement("canvas", { is: "ui-canvas" });
	canvas.className = "app-canvas__image ui-canvas";
	canvas.style.position = "absolute";
	canvas.style.inset = "0";
	canvas.style.pointerEvents = "none";
	canvas.style.inlineSize = "100%";
	canvas.style.blockSize = "100%";
	canvas.style.maxInlineSize = "100%";
	canvas.style.maxBlockSize = "100%";
	canvas.style.opacity = "0.88";
	canvas.style.mixBlendMode = "normal";
	canvas.setAttribute("is", "ui-canvas");
	root.append(glow, canvas);
	const wallpaper = loadWallpaperUrl();
	canvas.setAttribute("data-src", wallpaper);
	return {
		root,
		canvas,
		glow,
		disposeOrient: syncCanvasOrient(canvas)
	};
};
var setAppWallpaper = (wallpaperUrl) => {
	const value = String(wallpaperUrl || "").trim() || DEFAULT_WALLPAPER_URL;
	try {
		localStorage.setItem(WALLPAPER_STORAGE_KEY, value);
	} catch {}
	const canvases = document.querySelectorAll("[data-app-layer=\"canvas\"] canvas[is=\"ui-canvas\"], [data-app-layer=\"canvas\"] canvas.ui-canvas");
	const orient = String(currentOrientNumber());
	canvases.forEach((canvas) => {
		canvas.setAttribute("data-src", value);
		canvas.setAttribute("data-orient", orient);
		canvas.setAttribute("orient", orient);
		canvas.style.setProperty("--orient", orient);
	});
};
var loadWallpaperUrl = () => {
	try {
		const value = localStorage.getItem(WALLPAPER_STORAGE_KEY);
		return value && value.trim() ? value.trim() : DEFAULT_WALLPAPER_URL;
	} catch {
		return DEFAULT_WALLPAPER_URL;
	}
};
//#endregion
export { setAppWallpaper as n, syncAppWallpaperOrient as r, initializeAppCanvasLayer as t };
