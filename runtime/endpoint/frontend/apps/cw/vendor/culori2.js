import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { X as parse, Y as oklch, Z as converter, q as Q } from "./culori.js";
import { getCorrectOrientation, makeRAFCycle, orientationNumberMap, whenAnyScreenChanges } from "/fest/dom.js";
import { setStyleProperty } from "/fest/style-lib.js";
var clamp$1 = (value) => Math.max(0, Math.min(1, value || 0));
var fixup = (value) => Math.round(clamp$1(value) * 255);
var rgb = converter("rgb");
converter("hsl");
var serializeHex = (color) => {
	if (color === void 0) return;
	let r = fixup(color.r);
	let g = fixup(color.g);
	let b = fixup(color.b);
	return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};
var formatHex = (c) => serializeHex(rgb(c));
//#endregion
//#region ../../modules/projects/image.ts/src/engine/KMean.ts
var sortColors = (list, criteria = "l") => list.sort((a, b) => Math.sign(oklch({
	mode: "rgb",
	r: a[0],
	g: a[1],
	b: a[2]
})?.[criteria] - oklch({
	mode: "rgb",
	r: b[0],
	g: b[1],
	b: b[2]
})?.[criteria]) || 0);
var euclideanDistance = (color1, color2) => Math.hypot(color1[0] - color2[0], color1[1] - color2[1], color1[2] - color2[2]);
var makeClusters = (data, centroids) => {
	let clusters = Array.from({ length: centroids.length }, () => ({
		points: [],
		mean: null
	}));
	data.forEach((point) => {
		let minDistance = 1e4;
		let minDistanceClusterIndex = 0;
		centroids.forEach((centroid, index) => {
			const distance = euclideanDistance(point, centroid);
			if (typeof minDistance === "undefined" || minDistance > distance) {
				minDistance = distance;
				minDistanceClusterIndex = index;
			}
		});
		clusters[minDistanceClusterIndex].points.push(point);
	});
	return clusters;
};
var computeMean = (points) => {
	return points?.length > 0 ? points.reduce((acc, point) => [
		point[0] + acc[0],
		point[1] + acc[1],
		point[2] + acc[2]
	], [
		0,
		0,
		0
	]).map((val) => val / points.length) : [
		0,
		0,
		0
	];
};
var kMeans = (data, k) => {
	let centroids = sortColors(initializeCentroids(data, k));
	const maxIterations = 10;
	for (let iteration = 0; iteration < maxIterations; iteration++) {
		const newCentroids = makeClusters(data, centroids).map((cluster) => cluster.points.length > 0 ? computeMean(cluster.points) : null);
		if (newCentroids.every((newCentroid, index) => newCentroid && euclideanDistance(newCentroid, centroids[index]) < .001)) break;
		centroids = newCentroids;
	}
	return centroids;
};
var initializeCentroids = (data, k) => {
	const centroids = [data[Math.floor(Math.random() * data.length)]];
	while (centroids.length < k) {
		const distances = data.map((point) => Math.min(...centroids.map((centroid) => euclideanDistance(point, centroid))));
		const totalDistance = distances.reduce((sum, d) => sum + d, 0);
		const probabilities = distances.map((d) => d / totalDistance);
		let cumulativeProbability = 0;
		const randomValue = Math.random();
		for (let i = 0; i < probabilities.length; i++) {
			cumulativeProbability += probabilities[i];
			if (randomValue < cumulativeProbability) {
				centroids.push(data[i]);
				break;
			}
		}
	}
	return centroids;
};
var preBlurPixels = async (imgURL) => {
	const blob = imgURL instanceof Blob || imgURL instanceof File ? imgURL : await fetch(imgURL)?.then?.((r) => r?.blob?.());
	const bitmap = await createImageBitmap(blob);
	const offset = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = offset.getContext("2d");
	ctx.filter = "blur(16px)";
	ctx?.drawImage?.(bitmap, 0, 0, offset.width, offset.height);
	return offset;
};
var getClusterImageData = async (imgURL) => {
	const bitmap = await preBlurPixels(imgURL);
	const offset = new OffscreenCanvas(bitmap.width * .125, bitmap.height * .125);
	const ctx = offset.getContext("2d");
	ctx?.drawImage?.(bitmap, 0, 0, offset.width, offset.height);
	const data = (ctx?.getImageData?.(0, 0, offset.width, offset.height, {
		storageFormat: "float32",
		pixelFormat: "rgba-float32",
		colorSpace: "srgb"
	})).data;
	const allCount = offset.width * offset.height || 0;
	const dv = 1 / 255;
	const fp32 = [];
	for (let s = 0; s < allCount; s++) {
		const i4 = s * 4;
		fp32.push(data instanceof Float32Array || data instanceof Float16Array ? [
			data?.[i4 + 0] || 0,
			data?.[i4 + 1] || 0,
			data?.[i4 + 2] || 0
		] : [
			(data?.[i4 + 0] || 0) * dv,
			(data?.[i4 + 1] || 0) * dv,
			(data?.[i4 + 2] || 0) * dv
		]);
	}
	return fp32;
};
var getDominantColors = async (imgURL) => {
	return sortColors(kMeans(await getClusterImageData(imgURL), 4), "h");
};
//#endregion
//#region ../../modules/projects/image.ts/src/engine/WallpaperTheme.ts
/** Persisted JSON `{ primary, secondary, tertiary, underlying, contrast }` from last wallpaper extract. */
var WALLPAPER_THEME_STORAGE_KEY = "rs-wallpaper-theme";
/** Convenience: last primary hex alone (for quick reads / debugging). */
var WALLPAPER_PRIMARY_STORAGE_KEY = "rs-wallpaper-primary";
/** Wallpaper URL/data-URL key that produced the cached theme (skip re-KMeans when unchanged). */
var WALLPAPER_THEME_SRC_STORAGE_KEY = "rs-wallpaper-theme-src";
var THEME_STORAGE_KEY = WALLPAPER_THEME_STORAGE_KEY;
var PRIMARY_STORAGE_KEY = WALLPAPER_PRIMARY_STORAGE_KEY;
var WALLPAPER_URL_KEY = WALLPAPER_THEME_SRC_STORAGE_KEY;
/** L split: above = light paper + dark ink; at/below = dark paper + light ink. */
var PAPER_L_SPLIT = .52;
var PAPER_CHROMA_CAP = .025;
var FALLBACK_PAPER = {
	underlying: "#16161a",
	contrast: "#f7f7f8"
};
/** Last paper from a real photo luma — KMeans/cache must not flip it back to white ink. */
var lastLivePaper = null;
/** Cleared WebGL/resize frames sit near 0; a real black photo is still > this. */
var USABLE_LUMA_MIN = .03;
/** Token names written onto theme hosts (veela / wf-demo / ui-window). */
var SEED_PROPS = [
	["--color-primary", "primary"],
	["--color-secondary", "secondary"],
	["--color-tertiary", "tertiary"],
	["--base-color", "primary"],
	["--wf-md-primary", "primary"],
	["--wf-md-seed", "primary"],
	["--primary", "primary"],
	["--secondary", "secondary"],
	["--tertiary", "tertiary"]
];
var clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var hexOklch = (l, c, h, fallback) => formatHex({
	mode: "oklch",
	l,
	c,
	h
}) || fallback;
var rgbToSample = (rgb) => {
	const [r, g, b] = rgb;
	if (![
		r,
		g,
		b
	].every((n) => Number.isFinite(n))) return null;
	const hex = formatHex({
		mode: "rgb",
		r,
		g,
		b
	});
	if (!hex) return null;
	const ok = oklch({
		mode: "rgb",
		r,
		g,
		b
	});
	return {
		rgb,
		hex,
		l: ok?.l ?? .5,
		c: ok?.c ?? 0,
		h: ok?.h ?? 0
	};
};
var paperLFromHex = (hex) => oklch(hex)?.l ?? .4;
var haloForPaper = (darkPaper) => darkPaper ? {
	shadow: "rgb(0 0 0 / 0.88)",
	glow: "rgb(0 0 0 / 0.45)"
} : {
	shadow: "rgb(255 255 255 / 0.72)",
	glow: "rgb(255 255 255 / 0.35)"
};
var isUsablePaperLuma = (luma) => Number.isFinite(luma) && luma >= USABLE_LUMA_MIN && luma <= 1;
/**
* WHY: Paper is the wallpaper's non-chromatic base (dark vs light photo), not the accent seed.
* Polarity comes from pixel luma (or brighter-of mean/median centroids). Lowest-chroma is hue
* only — a black speck must not outvote a light sky (that stamped white ink after a correct flash).
*/
var deriveWallpaperPaperTokensFromSamples = (samples, pixelLuma) => {
	if (!samples.length && pixelLuma == null) return { ...FALLBACK_PAPER };
	const ls = samples.map((s) => s.l).sort((a, b) => a - b);
	const meanL = samples.length ? samples.reduce((sum, s) => sum + s.l, 0) / samples.length : pixelLuma;
	const medianL = ls.length ? ls[Math.floor(ls.length / 2)] : meanL;
	const paperL = clamp(pixelLuma != null && isUsablePaperLuma(pixelLuma) ? pixelLuma : Math.max(meanL, medianL), .08, .94);
	const paper = samples.length ? [...samples].sort((a, b) => a.c - b.c || Math.abs(a.l - paperL) - Math.abs(b.l - paperL))[0] : null;
	const paperC = paper ? Math.min(PAPER_CHROMA_CAP, Math.max(0, paper.c * .2)) : 0;
	const h = paper?.h || 0;
	const darkPaper = paperL < PAPER_L_SPLIT;
	return {
		underlying: hexOklch(paperL, paperC, h, darkPaper ? FALLBACK_PAPER.underlying : "#e8e6e2"),
		contrast: hexOklch(darkPaper ? .93 : .16, .008, h, darkPaper ? FALLBACK_PAPER.contrast : "#141416")
	};
};
/** Tiny downsample — same polarity as the statusbar canvas probe, without KMeans. */
var sampleImageMeanLuma = async (imgURL) => {
	try {
		const blob = imgURL instanceof Blob ? imgURL : await (await fetch(imgURL)).blob();
		if (!blob || blob.size <= 0) return null;
		const bitmap = await createImageBitmap(blob);
		const w = 48;
		const h = Math.max(1, Math.round(bitmap.height / Math.max(1, bitmap.width) * w));
		const canvas = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), {
			width: w,
			height: h
		});
		if (!(canvas instanceof OffscreenCanvas)) {
			canvas.width = w;
			canvas.height = h;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			bitmap.close?.();
			return null;
		}
		ctx.drawImage(bitmap, 0, 0, w, h);
		bitmap.close?.();
		const data = ctx.getImageData(0, 0, w, h).data;
		let sum = 0;
		let n = 0;
		for (let i = 0; i < data.length; i += 16) {
			if ((data[i + 3] ?? 255) < 16) continue;
			const r = data[i] / 255;
			const g = data[i + 1] / 255;
			const b = data[i + 2] / 255;
			sum += .2126 * r + .7152 * g + .0722 * b;
			n++;
		}
		if (n < 8) return null;
		const luma = sum / n;
		return isUsablePaperLuma(luma) ? luma : null;
	} catch {
		return null;
	}
};
/** Fast luma path (statusbar canvas probe) — same token names as KMeans paper. */
var deriveWallpaperPaperTokensFromLuma = (luma) => {
	return luma <= PAPER_L_SPLIT ? { ...FALLBACK_PAPER } : {
		underlying: "#e8e6e2",
		contrast: "#141416"
	};
};
var hasWallpaperPaper = (seeds) => Boolean(seeds.underlying && seeds.contrast);
/**
* WHY: Hue-sorted KMeans often puts near-black first; UI accents need mid-L high-chroma
* (nebula teal) as primary, then distinct secondary/tertiary clusters.
*/
var rankWallpaperSeeds = (centroids, pixelLuma) => {
	const samples = centroids.map(rgbToSample).filter(Boolean);
	if (!samples.length) return null;
	const accentPool = samples.filter((s) => s.l >= .18 && s.l <= .88 && s.c >= .02).sort((a, b) => b.c - a.c || Math.abs(b.l - .55) - Math.abs(a.l - .55));
	const pool = accentPool.length ? accentPool : [...samples].sort((a, b) => b.c - a.c);
	const primary = pool[0];
	if (!primary) return null;
	const hueDist = (a, b) => {
		const d = Math.abs(a - b) % 360;
		return d > 180 ? 360 - d : d;
	};
	const pickNext = (used) => {
		const rest = pool.filter((s) => !used.includes(s));
		if (!rest.length) {
			const base = used[used.length - 1] ?? primary;
			const nudged = formatHex({
				mode: "oklch",
				l: Math.min(.85, Math.max(.2, base.l + (used.length === 1 ? -.12 : .1))),
				c: Math.max(.04, base.c * .85),
				h: base.h
			});
			return {
				...base,
				hex: nudged || base.hex,
				l: base.l
			};
		}
		return [...rest].sort((a, b) => Math.min(...used.map((u) => hueDist(b.h, u.h))) - Math.min(...used.map((u) => hueDist(a.h, u.h))) || b.c - a.c)[0] ?? rest[0];
	};
	const secondary = pickNext([primary]);
	const tertiary = pickNext([primary, secondary]);
	const paper = deriveWallpaperPaperTokensFromSamples(samples, pixelLuma);
	return {
		primary: primary.hex,
		secondary: secondary.hex,
		tertiary: tertiary.hex,
		...paper
	};
};
var themeHosts = () => {
	const nodes = /* @__PURE__ */ new Set();
	nodes.add(document.documentElement);
	document.querySelectorAll(".env-shell-root, .wf-demo-root, ui-window").forEach((el) => nodes.add(el));
	return [...nodes];
};
var wallpaperSeedsMayPaint = () => {
	if (typeof document === "undefined") return true;
	const src = String(document.documentElement.dataset.colorSource || "");
	if (!src) return true;
	return src === "wallpaper" || src === "speed-dial" || src === "system-wallpaper";
};
var isValidColor = (color) => Boolean(parse(color));
/**
* INVARIANT: paper/ink follow the photo even when colorSource is Material You
* (`--base-color` stays gated; labels/rail still sit on the wallpaper).
*/
var applyWallpaperPaperTokens = (paper, extraHosts = []) => {
	if (typeof document === "undefined") return;
	const { shadow, glow } = haloForPaper(paperLFromHex(paper.underlying) < PAPER_L_SPLIT);
	const hosts = new Set(themeHosts());
	for (const el of extraHosts) hosts.add(el);
	if (!isValidColor(paper.underlying)) return;
	if (!isValidColor(paper.contrast)) return;
	if (!isValidColor(shadow)) return;
	if (!isValidColor(glow)) return;
	registerColorProperty("--wallpaper-underlying-color", paper.underlying);
	registerColorProperty("--wallpaper-contrast-color", paper.contrast);
	registerColorProperty("--env-launcher-fg", paper.contrast);
	registerColorProperty("--env-launcher-fg-shadow", shadow);
	registerColorProperty("--env-launcher-fg-glow", glow);
	for (const host of hosts) {
		setStyleProperty(host, "--wallpaper-underlying-color", paper.underlying);
		setStyleProperty(host, "--wallpaper-contrast-color", paper.contrast);
		setStyleProperty(host, "--env-launcher-fg", paper.contrast);
		setStyleProperty(host, "--env-launcher-fg-shadow", shadow);
		setStyleProperty(host, "--env-launcher-fg-glow", glow);
	}
	const globalQuery = Q("body, html, .wf-demo-root, ui-window, .view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .view-settings, [data-view='settings'], .cw-network-view, .cw-network-view-host");
	globalQuery.style.setProperty("--wallpaper-underlying-color", paper.underlying);
	globalQuery.style.setProperty("--wallpaper-contrast-color", paper.contrast);
	globalQuery.style.setProperty("--env-launcher-fg", paper.contrast);
	globalQuery.style.setProperty("--env-launcher-fg-shadow", shadow);
	globalQuery.style.setProperty("--env-launcher-fg-glow", glow);
};
var registerColorProperty = (name, initialValue = "#5a9ec8") => {
	try {
		CSS?.registerProperty?.({
			name,
			syntax: "<color>",
			inherits: true,
			initialValue
		});
	} catch (error) {
		console.debug(error);
	}
};
var persistLivePaper = (paper) => {
	try {
		const cached = loadCachedWallpaperTheme();
		if (!cached) return;
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
			...cached,
			underlying: paper.underlying,
			contrast: paper.contrast
		}));
	} catch {}
};
/** Early paint from canvas luma — KMeans/cache may not overwrite this polarity. */
var applyWallpaperPaperFromLuma = (luma, extraHosts = []) => {
	if (!isUsablePaperLuma(luma)) {
		if (lastLivePaper) {
			applyWallpaperPaperTokens(lastLivePaper, extraHosts);
			return lastLivePaper;
		}
		return { ...FALLBACK_PAPER };
	}
	const paper = deriveWallpaperPaperTokensFromLuma(luma);
	lastLivePaper = paper;
	applyWallpaperPaperTokens(paper, extraHosts);
	persistLivePaper(paper);
	return paper;
};
var applyWallpaperThemeSeeds = (seeds) => {
	const next = lastLivePaper ? {
		...seeds,
		...lastLivePaper
	} : seeds;
	try {
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
		localStorage.setItem(PRIMARY_STORAGE_KEY, next.primary);
	} catch {}
	if (hasWallpaperPaper(next)) applyWallpaperPaperTokens(next);
	if (!wallpaperSeedsMayPaint()) return;
	for (const host of themeHosts()) for (const [prop, key] of SEED_PROPS) setStyleProperty(host, prop, next[key]);
	if (!isValidColor(next.primary)) return;
	if (!isValidColor(next.secondary)) return;
	if (!isValidColor(next.tertiary)) return;
	document.querySelectorAll("body, html, .wf-demo-root, ui-window, .view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .view-settings, [data-view='settings'], .cw-network-view, .cw-network-view-host").forEach((el) => {
		setStyleProperty(el, "--color-primary", next.primary);
		setStyleProperty(el, "--base-color", next.primary);
		setStyleProperty(el, "--color-secondary", next.secondary);
		setStyleProperty(el, "--color-tertiary", next.tertiary);
	});
	const globalQuery = Q("body, html, .wf-demo-root, ui-window, .view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .view-settings, [data-view='settings'], .cw-network-view, .cw-network-view-host");
	globalQuery.style.setProperty("--color-primary", next.primary);
	globalQuery.style.setProperty("--base-color", next.primary);
	globalQuery.style.setProperty("--color-secondary", next.secondary);
	globalQuery.style.setProperty("--color-tertiary", next.tertiary);
	document.dispatchEvent(new CustomEvent("u2-theme-change", { detail: {
		source: "wallpaper",
		seeds: next
	} }));
};
var loadCachedWallpaperTheme = () => {
	try {
		const raw = localStorage.getItem(THEME_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.primary || !parsed?.secondary || !parsed?.tertiary) return null;
		return parsed;
	} catch {
		return null;
	}
};
/**
* Extract dominant colors from wallpaper URL/Blob/data-URL and write CSS seeds.
* INVARIANT: surfaces stay `--u2-color-mod(var(--base-color), N)`; only hue seeds change.
*/
var applyThemeFromWallpaper = async (imgURL, opts) => {
	const srcKey = typeof imgURL === "string" ? imgURL.slice(0, 2048) : `blob:${imgURL.name || "wallpaper"}:${imgURL.size}`;
	if (typeof imgURL === "string") {
		if (!imgURL) return null;
		if (globalThis[Symbol.for("image.canvas.failedWallpaperSrc")]?.has(imgURL)) return null;
		if (imgURL.startsWith("data:") && !/^data:image\//i.test(imgURL)) return null;
		if (/video\/mp2t/i.test(imgURL)) return null;
		if (/\/assets\/wallpaper\.jpg(?:$|[?#])/i.test(imgURL)) try {
			const sku = String(document.documentElement?.dataset?.cwspSku || "").toLowerCase();
			const host = String(globalThis.location?.hostname || "").toLowerCase();
			if (sku === "process" || host === "process.u2re.space" || host === "workcenter.u2re.space" || host === "ai.u2re.space") return null;
		} catch {
			return null;
		}
	} else if (imgURL instanceof Blob && imgURL.type && !imgURL.type.startsWith("image/") && imgURL.type !== "application/octet-stream") return null;
	const liveLuma = await sampleImageMeanLuma(imgURL);
	if (liveLuma != null) applyWallpaperPaperFromLuma(liveLuma);
	if (!opts?.force) try {
		if (localStorage.getItem(WALLPAPER_URL_KEY) === srcKey) {
			const cached = loadCachedWallpaperTheme();
			if (cached) {
				applyWallpaperThemeSeeds(cached);
				return lastLivePaper ? {
					...cached,
					...lastLivePaper
				} : cached;
			}
		}
	} catch {}
	try {
		const seeds = rankWallpaperSeeds(await getDominantColors(imgURL), liveLuma ?? void 0);
		if (!seeds) return null;
		applyWallpaperThemeSeeds(seeds);
		try {
			localStorage.setItem(WALLPAPER_URL_KEY, srcKey);
		} catch {}
		return lastLivePaper ? {
			...seeds,
			...lastLivePaper
		} : seeds;
	} catch (err) {
		console.warn("[fest/image] applyThemeFromWallpaper failed", err);
		const cached = loadCachedWallpaperTheme();
		if (cached) {
			applyWallpaperThemeSeeds(cached);
			return cached;
		}
		return null;
	}
};
/** Cold-start: restore last seeds before async re-extract finishes. */
var restoreWallpaperThemeCache = () => {
	const cached = loadCachedWallpaperTheme();
	if (cached) applyWallpaperThemeSeeds(cached);
	return cached;
};
//#endregion
//#region ../../modules/projects/image.ts/src/canvas/Canvas.ts
/**
* Underlying app canvas layer.
*
* Hosts background/image surface under shell windows.
*
* WHY: Photo data-URLs often exceed `localStorage` (~5MB). `setItem` throws, was
* swallowed, paint updated in-memory only — reload restored the previous URL.
* INVARIANT: durable custom wallpapers live in IndexedDB; `localStorage` holds
* either a short URL (`/assets/…`) or the {@link WALLPAPER_IDB_MARKER} pointer.
* INVARIANT: `blob:` object URLs are session-only. Never persist them; never
* pass a stored `blob:` to `fetch` / KMeans (`ERR_FILE_NOT_FOUND` after reload).
*/
var WALLPAPER_STORAGE_KEY = "rs-wallpaper-image";
var DEFAULT_WALLPAPER_URL = "/assets/wallpaper.jpg";
/** Marker stored in localStorage when bytes live in IndexedDB. */
var WALLPAPER_IDB_MARKER = "idb:rs-wallpaper";
var IDB_NAME = "cwsp-wallpaper-v1";
var IDB_STORE = "blobs";
var IDB_KEY = "current";
/** Prefer IDB when payload is larger than this (or always for data:/blob:). */
var LOCAL_STORAGE_SAFE_CHARS = 512e3;
var liveObjectUrl = null;
/** Bumped on revoke so an in-flight IDB restore cannot resurrect a dead object URL. */
var wallpaperEpoch = 0;
var currentOrientNumber = () => orientationNumberMap?.[getCorrectOrientation()] ?? 0;
var isIdbPointer = (pointer) => pointer === "idb:rs-wallpaper" || pointer.startsWith("idb:");
/** Stored `blob:` is always dead after reload; oversized `data:` is a quota leftover. */
var isUnusableStoredUrl = (pointer) => pointer.startsWith("blob:") || pointer.startsWith("data:") && (pointer.length > LOCAL_STORAGE_SAFE_CHARS || !/^data:image\//i.test(pointer));
var revokeLiveObjectUrl = () => {
	wallpaperEpoch += 1;
	if (liveObjectUrl && liveObjectUrl.startsWith("blob:")) try {
		URL.revokeObjectURL(liveObjectUrl);
	} catch {}
	liveObjectUrl = null;
};
/** Reuse this session's object URL so a second resolve cannot revoke mid-theme-fetch. */
var adoptWallpaperBlob = (blob, epoch) => {
	if (epoch !== wallpaperEpoch) return liveObjectUrl;
	if (liveObjectUrl) return liveObjectUrl;
	liveObjectUrl = URL.createObjectURL(blob);
	return liveObjectUrl;
};
var openWallpaperDb = () => new Promise((resolve, reject) => {
	if (typeof indexedDB === "undefined") {
		reject(/* @__PURE__ */ new Error("indexedDB unavailable"));
		return;
	}
	const req = indexedDB.open(IDB_NAME, 1);
	req.onupgradeneeded = () => {
		const db = req.result;
		if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
	};
	req.onsuccess = () => resolve(req.result);
	req.onerror = () => reject(req.error || /* @__PURE__ */ new Error("IDB open failed"));
});
var idbPutWallpaper = async (blob) => {
	const db = await openWallpaperDb();
	try {
		await new Promise((resolve, reject) => {
			const tx = db.transaction(IDB_STORE, "readwrite");
			tx.objectStore(IDB_STORE).put(blob, IDB_KEY);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error || /* @__PURE__ */ new Error("IDB put failed"));
		});
	} finally {
		db.close();
	}
};
var idbGetWallpaper = async () => {
	const db = await openWallpaperDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(IDB_KEY);
			req.onsuccess = () => {
				const v = req.result;
				resolve(v instanceof Blob ? v : null);
			};
			req.onerror = () => reject(req.error || /* @__PURE__ */ new Error("IDB get failed"));
		});
	} finally {
		db.close();
	}
};
var idbClearWallpaper = async () => {
	try {
		const db = await openWallpaperDb();
		try {
			await new Promise((resolve, reject) => {
				const tx = db.transaction(IDB_STORE, "readwrite");
				tx.objectStore(IDB_STORE).delete(IDB_KEY);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error || /* @__PURE__ */ new Error("IDB delete failed"));
			});
		} finally {
			db.close();
		}
	} catch {}
};
var readStoragePointer = () => {
	try {
		const value = localStorage.getItem(WALLPAPER_STORAGE_KEY);
		return value && value.trim() ? value.trim() : DEFAULT_WALLPAPER_URL;
	} catch {
		return DEFAULT_WALLPAPER_URL;
	}
};
var writeStoragePointer = (value) => {
	if (value.startsWith("blob:")) return false;
	try {
		localStorage.setItem(WALLPAPER_STORAGE_KEY, value);
		return true;
	} catch {
		return false;
	}
};
var restoreWallpaperBlobUrl = async () => {
	if (liveObjectUrl) return liveObjectUrl;
	const epoch = wallpaperEpoch;
	try {
		const blob = await idbGetWallpaper();
		if (!blob) return null;
		return adoptWallpaperBlob(blob, epoch);
	} catch (err) {
		console.warn("[fest/image] wallpaper IDB restore failed", err);
		return null;
	}
};
var isInlinePayload = (url) => url.startsWith("data:") || url.startsWith("blob:");
/**
* Resolve the durable pointer to a paintable URL (may create a blob: object URL).
* Callers that only need the pointer should use {@link getWallpaperStoragePointer}.
*/
var resolveAppWallpaperUrl = async () => {
	const pointer = readStoragePointer();
	if (isIdbPointer(pointer) || isUnusableStoredUrl(pointer)) {
		const url = await restoreWallpaperBlobUrl();
		if (url) {
			if (!isIdbPointer(pointer)) writeStoragePointer(WALLPAPER_IDB_MARKER);
			return url;
		}
		return processHostSkipsBundledWallpaper() ? "" : DEFAULT_WALLPAPER_URL;
	}
	if (processHostSkipsBundledWallpaper() && (!pointer || pointer === DEFAULT_WALLPAPER_URL)) return "";
	return pointer || DEFAULT_WALLPAPER_URL;
};
/** Durable pointer currently stored (`/assets/…` or {@link WALLPAPER_IDB_MARKER}). */
var getWallpaperStoragePointer = () => readStoragePointer();
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
/** Re-resolve storage/IDB pointer and repaint — after HOME/back or WebView resume. */
var refreshAppWallpaperPaint = () => {
	resolveAppWallpaperUrl().then((url) => {
		paintWallpaperOnCanvases(url);
		syncAppWallpaperOrient();
	});
};
/** Tint the soft glow with the wallpaper primary (falls back to cool blue). */
var syncGlowToTheme = (glow) => {
	getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim();
	glow.style.background = "none";
	glow.style.backgroundColor = "transparent";
};
var paintWallpaperOnCanvases = (paintUrl) => {
	const canvases = document.querySelectorAll("[data-app-layer=\"canvas\"] canvas[is=\"ui-canvas\"], [data-app-layer=\"canvas\"] canvas.ui-canvas");
	const orient = String(currentOrientNumber());
	canvases.forEach((canvas) => {
		canvas.setAttribute("data-src", paintUrl);
		canvas.setAttribute("data-orient", orient);
		canvas.setAttribute("orient", orient);
		canvas.style.setProperty("--orient", orient);
	});
};
var dataUrlToBlob = async (dataUrl) => {
	return (await fetch(dataUrl)).blob();
};
/**
* Persist + paint a wallpaper blob/File (preferred entry for file pickers).
* Stores bytes in IndexedDB and the durable marker in localStorage.
*/
var setAppWallpaperFromBlob = async (blob) => {
	if (!(blob instanceof Blob) || blob.size <= 0) {
		setAppWallpaper(DEFAULT_WALLPAPER_URL);
		return DEFAULT_WALLPAPER_URL;
	}
	revokeLiveObjectUrl();
	liveObjectUrl = URL.createObjectURL(blob);
	paintWallpaperOnCanvases(liveObjectUrl);
	applyThemeFromWallpaper(blob, { force: true }).then(() => {
		document.querySelectorAll(".app-canvas__glow").forEach(syncGlowToTheme);
	});
	try {
		await idbPutWallpaper(blob);
		writeStoragePointer(WALLPAPER_IDB_MARKER);
	} catch (err) {
		console.warn("[fest/image] wallpaper IDB persist failed", err);
		try {
			const reader = new FileReader();
			const dataUrl = await new Promise((resolve, reject) => {
				reader.onload = () => resolve(String(reader.result || ""));
				reader.onerror = () => reject(reader.error || /* @__PURE__ */ new Error("read failed"));
				reader.readAsDataURL(blob);
			});
			if (dataUrl && !writeStoragePointer(dataUrl)) console.warn("[fest/image] wallpaper localStorage persist also failed (quota?)");
		} catch {}
	}
	try {
		globalThis.dispatchEvent?.(new CustomEvent("cwsp-wallpaper-change", { detail: {
			pointer: WALLPAPER_IDB_MARKER,
			url: liveObjectUrl
		} }));
	} catch {}
	return liveObjectUrl;
};
var initializeAppCanvasLayer = (container) => {
	const root = container;
	root.replaceChildren();
	root.dataset.appLayer = "canvas";
	root.style.position = "absolute";
	root.style.inset = "0";
	root.style.overflow = "hidden";
	root.style.background = "none";
	root.style.backgroundColor = "transparent";
	const glow = document.createElement("div");
	glow.className = "app-canvas__glow";
	glow.style.position = "absolute";
	glow.style.inset = "-20%";
	glow.style.pointerEvents = "none";
	glow.style.opacity = "0.7";
	glow.style.background = "none";
	glow.style.backgroundColor = "transparent";
	const canvas = document.createElement("canvas", { is: "ui-canvas" });
	canvas.className = "app-canvas__image ui-canvas";
	canvas.style.position = "absolute";
	canvas.style.inset = "0";
	canvas.style.pointerEvents = "none";
	canvas.style.inlineSize = "100%";
	canvas.style.blockSize = "100%";
	canvas.style.maxInlineSize = "100%";
	canvas.style.maxBlockSize = "100%";
	canvas.style.opacity = "1";
	canvas.style.mixBlendMode = "normal";
	canvas.setAttribute("is", "ui-canvas");
	canvas.style.setProperty("dynamic-range-limit", "no-limit");
	canvas.style.setProperty("color-space", "display-p3");
	canvas.style.setProperty("background-color", "transparent", "important");
	canvas.style.setProperty("opacity", "1", "important");
	root.append(glow, canvas);
	rememberMissingDefaultWallpaper();
	const pointer = readStoragePointer();
	const coldUrl = isIdbPointer(pointer) || pointer.startsWith("data:") || pointer.startsWith("blob:") ? DEFAULT_WALLPAPER_URL : pointer;
	if (coldUrl && !failedWallpaperSrc.has(coldUrl)) canvas.setAttribute("data-src", coldUrl);
	const disposeOrient = syncCanvasOrient(canvas);
	restoreWallpaperThemeCache();
	syncGlowToTheme(glow);
	(async () => {
		const wallpaper = await resolveAppWallpaperUrl();
		if (!wallpaper || failedWallpaperSrc.has(wallpaper)) {
			syncGlowToTheme(glow);
			return;
		}
		canvas.setAttribute("data-src", wallpaper);
		syncCanvasOrient(canvas);
		await applyThemeFromWallpaper(wallpaper.startsWith("blob:") ? await idbGetWallpaper() || wallpaper : wallpaper);
		syncGlowToTheme(glow);
	})();
	return {
		root,
		canvas,
		glow,
		disposeOrient
	};
};
/**
* Set wallpaper from a URL. Short asset paths stay in localStorage; `data:` / `blob:` /
* oversized payloads are persisted to IndexedDB with {@link WALLPAPER_IDB_MARKER}.
*/
var setAppWallpaper = (wallpaperUrl) => {
	const value = String(wallpaperUrl || "").trim() || DEFAULT_WALLPAPER_URL;
	if (isInlinePayload(value) || value.length > LOCAL_STORAGE_SAFE_CHARS) {
		(async () => {
			try {
				await setAppWallpaperFromBlob(value.startsWith("blob:") ? await (await fetch(value)).blob() : await dataUrlToBlob(value));
			} catch (err) {
				console.warn("[fest/image] setAppWallpaper inline persist failed", err);
				const fallback = value.startsWith("blob:") ? DEFAULT_WALLPAPER_URL : value;
				paintWallpaperOnCanvases(fallback);
				applyThemeFromWallpaper(fallback, { force: true }).then(() => {
					document.querySelectorAll(".app-canvas__glow").forEach(syncGlowToTheme);
				});
			}
		})();
		return;
	}
	idbClearWallpaper();
	revokeLiveObjectUrl();
	if (!writeStoragePointer(value)) console.warn("[fest/image] wallpaper pointer write failed");
	paintWallpaperOnCanvases(value);
	applyThemeFromWallpaper(value, { force: true }).then(() => {
		document.querySelectorAll(".app-canvas__glow").forEach(syncGlowToTheme);
	});
	try {
		globalThis.dispatchEvent?.(new CustomEvent("cwsp-wallpaper-change", { detail: {
			pointer: value,
			url: value
		} }));
	} catch {}
};
var blobImageSymbol = Symbol.for("image.canvas.blob");
globalThis[blobImageSymbol] ??= /* @__PURE__ */ new WeakMap();
var blobImageMap = globalThis[blobImageSymbol];
var delayedSymbol = Symbol.for("image.canvas.delayed");
globalThis[delayedSymbol] ??= /* @__PURE__ */ new Map([]);
globalThis[delayedSymbol];
var shedulerSymbol = Symbol.for("image.canvas.sheduler");
globalThis[shedulerSymbol] ??= makeRAFCycle();
var sheduler = globalThis[shedulerSymbol];
var failedWallpaperSrcSymbol = Symbol.for("image.canvas.failedWallpaperSrc");
globalThis[failedWallpaperSrcSymbol] ??= /* @__PURE__ */ new Set();
var failedWallpaperSrc = globalThis[failedWallpaperSrcSymbol];
/** Process PWA does not ship `/assets/wallpaper.jpg` — skip the 404 + decode loop. */
var processHostSkipsBundledWallpaper = () => {
	try {
		if (String(document.documentElement?.dataset?.cwspSku || "").toLowerCase() === "process") return true;
		const host = String(globalThis.location?.hostname || "").toLowerCase();
		return host === "process.u2re.space" || host === "workcenter.u2re.space" || host === "ai.u2re.space";
	} catch {
		return false;
	}
};
var rememberMissingDefaultWallpaper = () => {
	if (processHostSkipsBundledWallpaper()) failedWallpaperSrc.add(DEFAULT_WALLPAPER_URL);
};
var getImgWidth = (img) => {
	return img?.naturalWidth || img?.width || 1;
};
var getImgHeight = (img) => {
	return img?.naturalHeight || img?.height || 1;
};
/**
* WHY: Chromium often rejects `rec2100-hlg` / `rec2100-pq` as PredefinedColorSpace.
* A bare throw aborts ui-canvas init (no ctx, no ResizeObserver) → blank wallpaper.
* INVARIANT: always return a usable 2d context when the browser allows any.
*/
var create2dContext = (canvas) => {
	const base = {
		alpha: true,
		desynchronized: true,
		powerPreference: "high-performance",
		preserveDrawingBuffer: true
	};
	for (const colorSpace of [
		"rec2100-hlg",
		"display-p3",
		"srgb"
	]) try {
		const ctx = canvas.getContext("2d", {
			...base,
			colorSpace
		});
		if (ctx) return ctx;
	} catch {}
	try {
		return canvas.getContext("2d", base);
	} catch {
		return canvas.getContext("2d");
	}
};
var cover = (ctx, img, scale = 1, port, orient = 0) => {
	const canvas = ctx.canvas;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((-orient || 0) * (Math.PI * .5));
	ctx.rotate((1 - port) * (Math.PI / 2));
	ctx.translate(-(getImgWidth(img) / 2) * scale, -(getImgHeight(img) / 2) * scale);
};
var createImageBitmapCache = (blob) => {
	if (!blobImageMap.has(blob) && (blob instanceof Blob || blob instanceof File || blob instanceof OffscreenCanvas || blob instanceof ImageBitmap || blob instanceof Image)) {
		const pending = createImageBitmap(blob).catch((err) => {
			blobImageMap.delete(blob);
			throw err;
		});
		blobImageMap.set(blob, pending);
	}
	return blobImageMap.get(blob);
};
var bindCacheSymbol = Symbol.for("image.canvas.bindCache");
globalThis[bindCacheSymbol] ??= /* @__PURE__ */ new WeakMap();
var bindCache = globalThis[bindCacheSymbol];
/**
* WHY: `WeakMap.set` returns the map, not the value — `get() ?? set() ?? bind()` used to
* schedule the WeakMap itself on the first paint (blank wallpaper until a later #render).
*/
var bindCached = (cb, ctx) => {
	const cached = bindCache.get(cb);
	if (typeof cached === "function") return cached;
	const bound = cb.bind(ctx);
	bindCache.set(cb, bound);
	return bound;
};
var UICanvas = null;
if (typeof HTMLCanvasElement != "undefined") UICanvas = class UICanvas extends HTMLCanvasElement {
	static observedAttributes = [
		"data-src",
		"data-orient",
		"orient"
	];
	ctx = null;
	image = null;
	#size = [1, 1];
	#loading = "";
	#ready = "";
	get #orient() {
		const raw = this.getAttribute("data-orient") ?? this.getAttribute("orient") ?? "0";
		const n = Number.parseInt(raw, 10);
		return Number.isFinite(n) ? n : 0;
	}
	set #orient(value) {
		const s = String(value);
		this.setAttribute("data-orient", s);
		this.setAttribute("orient", s);
	}
	attributeChangedCallback(name, _, newValue) {
		if (name == "data-src") this.#preload(newValue);
		if (name == "data-orient" || name == "orient") this.#render(this.#ready);
	}
	connectedCallback() {
		const parent = this.parentNode;
		this.style.setProperty("max-inline-size", "min(100%, min(100cqi, 100dvi))");
		this.style.setProperty("max-block-size", "min(100%, min(100cqb, 100dvb))");
		this.#size = [Math.min(Math.min(Math.max(this.clientWidth || parent?.clientWidth || 1, 1), parent?.clientWidth || 1) * (this.currentCSSZoom || 1), screen?.width || 1) * (devicePixelRatio || 1), Math.min(Math.min(Math.max(this.clientHeight || parent?.clientHeight || 1, 1), parent?.clientHeight || 1) * (this.currentCSSZoom || 1), screen?.height || 1) * (devicePixelRatio || 1)];
		this.#preload(this.#loading = this.dataset.src || this.#loading);
		if (this.image) this.#render(this.#ready);
	}
	constructor() {
		super();
		const canvas = this;
		const parent = this.parentNode;
		const fixSize = () => {
			const old = this.#size;
			this.#size = [Math.min(Math.min(Math.max(this.clientWidth || parent?.clientWidth || 1, 1), parent?.clientWidth || 1) * (this.currentCSSZoom || 1), screen?.width || 1) * (devicePixelRatio || 1), Math.min(Math.min(Math.max(this.clientHeight || parent?.clientHeight || 1, 1), parent?.clientHeight || 1) * (this.currentCSSZoom || 1), screen?.height || 1) * (devicePixelRatio || 1)];
			if (old?.[0] != this.#size[0] || old?.[1] != this.#size[1]) this.#render(this.#ready);
		};
		sheduler?.shedule?.(() => {
			this.ctx = create2dContext(canvas);
			try {
				this.ctx?.configureHighDynamicRange?.({ mode: "extended" });
				canvas?.configureHighDynamicRange?.({ mode: "extended" });
			} catch {}
			this.inert = true;
			this.style.objectFit = "cover";
			this.style.objectPosition = "center";
			this.classList.add("u-canvas");
			this.classList.add("u2-canvas");
			this.classList.add("ui-canvas");
			this.style.setProperty("max-inline-size", "min(100%, min(100cqi, 100dvi))");
			this.style.setProperty("max-block-size", "min(100%, min(100cqb, 100dvb))");
			this.style.setProperty("dynamic-range-limit", "no-limit");
			this.style.setProperty("color-space", "display-p3");
			this.style.setProperty("background-color", "transparent", "important");
			this.style.setProperty("opacity", "1", "important");
			fixSize();
			new ResizeObserver((entries) => {
				for (const entry of entries) {
					const box = entry?.devicePixelContentBoxSize?.[0];
					if (box) {
						const old = this.#size;
						this.#size = [Math.max(box.inlineSize || this.width, 1), Math.max(box.blockSize || this.height, 1)];
						if (old?.[0] != this.#size[0] || old?.[1] != this.#size[1]) this.#render(this.#ready);
					}
				}
			}).observe(this, { box: "device-pixel-content-box" });
			this.#preload(this.#loading = this.dataset.src || this.#loading);
			if (this.image) this.#render(this.#ready || this.#loading);
		});
	}
	async $useImageAsSource(blob, ready) {
		ready ||= this.#loading;
		const img = blob instanceof ImageBitmap ? blob : await createImageBitmapCache(blob).catch(console.warn.bind(console));
		if (img && ready == this.#loading) {
			this.image = img;
			this.#render(ready);
		}
		return blob;
	}
	$renderPass(whatIsReady) {
		const canvas = this, ctx = this.ctx, img = this.image;
		if (img && ctx && (whatIsReady == this.#loading || !whatIsReady)) {
			if (whatIsReady) this.#ready = whatIsReady;
			if (this.width != this.#size[0]) this.width = this.#size[0];
			if (this.height != this.#size[1]) this.height = this.#size[1];
			this.style.aspectRatio = `${this.width || 1} / ${this.height || 1}`;
			const ox = this.#orient % 2 || 0;
			const port = getImgWidth(img) <= getImgHeight(img) ? 1 : 0;
			const scale = Math.max(canvas[["height", "width"][ox]] / (port ? getImgHeight(img) : getImgWidth(img)), canvas[["width", "height"][ox]] / (port ? getImgWidth(img) : getImgHeight(img)));
			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			cover(ctx, img, scale, port, this.#orient);
			ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
			ctx.restore();
		}
	}
	#preload(src) {
		const ready = src || this.#loading;
		this.#loading = ready;
		if (!ready || typeof ready !== "string") return Promise.resolve();
		if (failedWallpaperSrc.has(ready)) return Promise.resolve();
		if (ready.startsWith("data:") && !/^data:image\//i.test(ready)) {
			failedWallpaperSrc.add(ready);
			return Promise.resolve();
		}
		return fetch(ready, {
			cache: "force-cache",
			mode: "same-origin"
		})?.then?.(async (rsp) => {
			if (!rsp.ok) {
				failedWallpaperSrc.add(ready);
				return;
			}
			const blob = await rsp.blob();
			if (!blob?.size || blob.type && !blob.type.startsWith("image/")) {
				failedWallpaperSrc.add(ready);
				return;
			}
			return this.$useImageAsSource(blob, ready)?.catch?.(() => {
				failedWallpaperSrc.add(ready);
			});
		})?.catch?.(() => {
			failedWallpaperSrc.add(ready);
		});
	}
	#render(whatIsReady) {
		const ctx = this.ctx;
		if (this.image && ctx && (whatIsReady == this.#loading || !whatIsReady)) sheduler?.shedule?.(bindCached(this.$renderPass, this));
	}
};
else UICanvas = class UICanvas {
	constructor() {}
	$renderPass(whatIsReady) {}
	$useImageAsSource(blob, ready) {
		return blob;
	}
	#preload(src) {
		return Promise.resolve();
	}
	#render(whatIsReady) {}
	#orient = 0;
	#loading = "";
	#ready = "";
	#size = [1, 1];
	ctx = null;
	image = null;
};
try {
	customElements.define("ui-canvas", UICanvas, { extends: "canvas" });
} catch (e) {}
//#endregion
//#region ../../modules/projects/image.ts/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	UICanvas: () => UICanvas,
	WALLPAPER_IDB_MARKER: () => WALLPAPER_IDB_MARKER,
	WALLPAPER_PRIMARY_STORAGE_KEY: () => WALLPAPER_PRIMARY_STORAGE_KEY,
	WALLPAPER_THEME_SRC_STORAGE_KEY: () => WALLPAPER_THEME_SRC_STORAGE_KEY,
	WALLPAPER_THEME_STORAGE_KEY: () => WALLPAPER_THEME_STORAGE_KEY,
	applyThemeFromWallpaper: () => applyThemeFromWallpaper,
	applyWallpaperPaperFromLuma: () => applyWallpaperPaperFromLuma,
	applyWallpaperPaperTokens: () => applyWallpaperPaperTokens,
	applyWallpaperThemeSeeds: () => applyWallpaperThemeSeeds,
	bindCache: () => bindCache,
	blobImageMap: () => blobImageMap,
	cover: () => cover,
	createImageBitmapCache: () => createImageBitmapCache,
	deriveWallpaperPaperTokensFromLuma: () => deriveWallpaperPaperTokensFromLuma,
	electronAPI: () => electronAPI,
	failedWallpaperSrc: () => failedWallpaperSrc,
	getDominantColors: () => getDominantColors,
	getWallpaperStoragePointer: () => getWallpaperStoragePointer,
	initializeAppCanvasLayer: () => initializeAppCanvasLayer,
	loadCachedWallpaperTheme: () => loadCachedWallpaperTheme,
	rankWallpaperSeeds: () => rankWallpaperSeeds,
	refreshAppWallpaperPaint: () => refreshAppWallpaperPaint,
	registerColorProperty: () => registerColorProperty,
	resolveAppWallpaperUrl: () => resolveAppWallpaperUrl,
	restoreWallpaperThemeCache: () => restoreWallpaperThemeCache,
	setAppWallpaper: () => setAppWallpaper,
	setAppWallpaperFromBlob: () => setAppWallpaperFromBlob,
	sheduler: () => sheduler,
	syncAppWallpaperOrient: () => syncAppWallpaperOrient,
	syncCanvasOrient: () => syncCanvasOrient,
	themeHosts: () => themeHosts
});
//#endregion
export { refreshAppWallpaperPaint as a, restoreWallpaperThemeCache as c, initializeAppCanvasLayer as i, WALLPAPER_IDB_MARKER as n, setAppWallpaperFromBlob as o, getWallpaperStoragePointer as r, applyWallpaperPaperFromLuma as s, src_exports as t };
