import { L as makeRAFCycle } from "../fest/dom.js";
import "../vendor/culori.js";
//#region ../../modules/projects/image.ts/src/canvas/Canvas.ts
var blobImageMap = /* @__PURE__ */ new WeakMap();
var sheduler = makeRAFCycle();
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
			this.style.setProperty("background-color", "black", "important");
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
		return fetch(src, {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (rsp) => this.$useImageAsSource(await rsp.blob(), ready)?.catch(console.warn.bind(console)))?.catch?.(console.warn.bind(console));
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
