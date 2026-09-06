import { q as Q } from "../vendor/culori.js";
import { a as loadSettings, s as saveSettings } from "./Settings.js";
import { n as applyGridSettings } from "./StateStorage.js";
import { i as core_default, r as scss_default } from "../fest/veela.js";
import { loadAsAdopted } from "/fest/style-lib.js";
var COLOR_SOURCES = [
	"auto",
	"wallpaper",
	"material-you",
	"system-wallpaper",
	"speed-dial",
	"custom"
];
var HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
var normalizeHexColor = (raw) => {
	const t = String(raw ?? "").trim();
	if (!HEX_RE.test(t)) return "";
	if (t.length === 4) return `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`.toLowerCase();
	return t.toLowerCase();
};
var isAppearanceColorSource = (raw) => COLOR_SOURCES.includes(String(raw || ""));
var isCapacitorNative = () => {
	try {
		const c = globalThis.Capacitor;
		if (typeof c?.isNativePlatform === "function" && c.isNativePlatform()) return true;
		const platform = c?.getPlatform?.();
		return platform === "android" || platform === "ios";
	} catch {
		return false;
	}
};
var isNeutralinoDesktop = () => {
	try {
		const g = globalThis;
		return Boolean(g.__CWS_NEUTRALINO_BOOT__ || g.Neutralino || typeof g.NL_OS === "string");
	} catch {
		return false;
	}
};
var isCrxSurface = () => {
	try {
		return Boolean(globalThis.chrome?.runtime?.id);
	} catch {
		return false;
	}
};
var isLauncherSku = () => {
	try {
		if (typeof document !== "undefined" && document.documentElement.dataset.cwspShellRole === "launcher") return true;
		return globalThis.__RS_SHELL_ROLE__ === "launcher";
	} catch {
		return false;
	}
};
var isCwspShellSurface = () => {
	try {
		if (typeof document === "undefined") return false;
		const role = String(document.documentElement.dataset.cwspShellRole || "").toLowerCase();
		const surface = String(document.documentElement.dataset.cwspSurface || "").toLowerCase();
		return role === "shell" || surface === "cwsp-shell" || surface === "environment" || surface === "cw-environment";
	} catch {
		return false;
	}
};
/** Platform default when `colorSource` is empty / `auto`. */
var defaultColorSource = () => {
	if (isCapacitorNative() && isLauncherSku()) return "wallpaper";
	if (isCapacitorNative()) return "material-you";
	if (isNeutralinoDesktop()) return "system-wallpaper";
	if (isCrxSurface() || isCwspShellSurface()) return "speed-dial";
	return "speed-dial";
};
var resolveColorSource = (saved) => {
	if (isAppearanceColorSource(saved) && saved !== "auto") return saved;
	return defaultColorSource();
};
var rgbToHex = (css) => {
	const m = css.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
	if (!m) return "";
	return `#${[
		m[1],
		m[2],
		m[3]
	].map((n) => Math.max(0, Math.min(255, Math.round(Number(n)))).toString(16).padStart(2, "0")).join("")}`;
};
var registerColorProperty = (name, initialValue = "#5a9ec8") => {
	try {
		CSS?.registerProperty?.({
			name,
			syntax: "<color>",
			inherits: true,
			initialValue
		});
	} catch {}
};
var seedHosts = () => {
	const nodes = /* @__PURE__ */ new Set();
	if (typeof document === "undefined") return [];
	nodes.add(document.documentElement);
	if (document.body) nodes.add(document.body);
	document.querySelectorAll(".env-shell-root, .wf-demo-root, ui-window, [data-shell], .view-settings, [data-view='settings'], .view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .cw-network-view, .cw-network-view-host").forEach((el) => nodes.add(el));
	return [...nodes];
};
var SEED_PROPS = [
	"--color-primary",
	"--base-color",
	"--wf-md-primary",
	"--wf-md-seed",
	"--primary",
	"--current"
];
var isValidColor = (color) => {
	try {
		rgbToHex(color);
		return true;
	} catch {
		return false;
	}
};
var applyBaseColorSeed = (hex, source, extras) => {
	if (typeof document === "undefined") return;
	const seed = normalizeHexColor(hex) || "#5a9ec8";
	const secondary = normalizeHexColor(extras?.secondary) || `color-mix(in oklab, ${seed} 72%, gray)`;
	const tertiary = normalizeHexColor(extras?.tertiary) || `color-mix(in oklab, ${seed} 55%, gray)`;
	const concrete = source === "user" ? "custom" : source === "system" ? "material-you" : source;
	document.documentElement.dataset.baseSource = String(concrete);
	document.documentElement.dataset.colorSource = String(concrete);
	if (!isValidColor(seed)) return;
	if (!isValidColor(secondary)) return;
	if (!isValidColor(tertiary)) return;
	registerColorProperty("--color-primary", seed);
	registerColorProperty("--base-color", seed);
	registerColorProperty("--color-secondary", secondary);
	registerColorProperty("--color-tertiary", tertiary);
	registerColorProperty("--secondary", secondary);
	registerColorProperty("--tertiary", tertiary);
	for (const host of seedHosts()) {
		for (const prop of SEED_PROPS) host.style.setProperty(prop, seed);
		host.style.setProperty("--color-secondary", secondary);
		host.style.setProperty("--color-tertiary", tertiary);
		host.style.setProperty("--secondary", secondary);
		host.style.setProperty("--tertiary", tertiary);
	}
	const globalQuery = Q("body, html, .wf-demo-root, ui-window, .view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .view-settings, [data-view='settings'], .cw-network-view, .cw-network-view-host");
	globalQuery.style.setProperty("--color-primary", seed);
	globalQuery.style.setProperty("--base-color", seed);
	globalQuery.style.setProperty("--color-secondary", secondary);
	globalQuery.style.setProperty("--color-tertiary", tertiary);
	globalQuery.style.setProperty("--secondary", secondary);
	globalQuery.style.setProperty("--tertiary", tertiary);
};
/** CSS `AccentColor` when the engine maps it to a real system accent (not generic link blue). */
var readCssAccentColor = () => {
	if (typeof document === "undefined") return "";
	const probe = document.createElement("div");
	probe.style.cssText = "position:absolute;inset:auto;color:AccentColor;background:AccentColor";
	document.documentElement.appendChild(probe);
	const css = getComputedStyle(probe).color;
	probe.remove();
	const hex = rgbToHex(css);
	if (!hex) return "";
	if (hex === "#0000ee" || hex === "#0000ff" || hex === "#000000" || hex === "#ffffff") return "";
	return hex;
};
var readBridgeColor = async (key) => {
	try {
		const cached = normalizeHexColor(globalThis.__CWS_SHELL_INFO__?.[key]);
		if (cached) return cached;
		const { fetchCwsShellInfo } = await import("./cws-bridge.js").then((n) => n.n);
		return normalizeHexColor((await fetchCwsShellInfo({ force: true }))?.[key]);
	} catch {
		return "";
	}
};
var resolveSystemAccentColor = async () => {
	const fromBridge = await readBridgeColor("accentColor");
	if (fromBridge) return fromBridge;
	return readCssAccentColor();
};
var cachedWallpaperPrimary = () => {
	try {
		const hex = normalizeHexColor(localStorage.getItem("rs-wallpaper-primary"));
		if (hex) return hex;
		const raw = localStorage.getItem("rs-wallpaper-theme");
		if (!raw) return "";
		return normalizeHexColor(JSON.parse(raw)?.primary);
	} catch {
		return "";
	}
};
var extractFromImage = async (src) => {
	try {
		const { applyThemeFromWallpaper } = await import("../vendor/culori2.js").then((n) => n.t);
		return normalizeHexColor((await applyThemeFromWallpaper(src, { force: false }))?.primary);
	} catch {
		return "";
	}
};
var colorFromLiveWallpaperCanvas = async () => {
	if (typeof document === "undefined") return "";
	const canvas = document.querySelector(".env-shell-wallpaper canvas, [data-app-layer='canvas'] canvas");
	if (!canvas || canvas.width < 2 || canvas.height < 2) return "";
	try {
		const blob = await new Promise((resolve) => {
			canvas.toBlob((b) => resolve(b), "image/jpeg", .7);
		});
		if (blob && blob.size > 0) return extractFromImage(blob);
	} catch {}
	return "";
};
var colorFromAppWallpaper = async () => {
	const cached = cachedWallpaperPrimary();
	if (cached) return cached;
	try {
		const { resolveAppWallpaperUrl } = await import("../vendor/culori2.js").then((n) => n.t);
		const url = await resolveAppWallpaperUrl();
		if (!url) return cached;
		if (/\/assets\/wallpaper\.jpg(?:$|[?#])/i.test(url)) return cached;
		if (url.startsWith("data:") && !/^data:image\//i.test(url)) return cached;
		return extractFromImage(url);
	} catch {}
	return "";
};
var neuReadEnv = async (key) => {
	try {
		const fn = globalThis.Neutralino?.os?.getEnv;
		if (typeof fn !== "function") return "";
		const raw = await fn({ key });
		if (typeof raw === "string") return raw.trim();
		if (raw && typeof raw === "object" && "value" in raw) return String(raw.value || "").trim();
		return "";
	} catch {
		return "";
	}
};
var neuReadBinary = async (path) => {
	try {
		const buf = await globalThis.Neutralino?.filesystem?.readBinaryFile?.(path);
		if (!buf || !(buf instanceof ArrayBuffer) || buf.byteLength < 32) return null;
		return new Blob([buf], { type: "image/jpeg" });
	} catch {
		return null;
	}
};
var colorFromSystemWallpaper = async () => {
	const fromBridge = await readBridgeColor("wallpaperColor");
	if (fromBridge) return fromBridge;
	if (isNeutralinoDesktop()) {
		const appData = await neuReadEnv("APPDATA") || await neuReadEnv("HOME");
		const candidates = [appData ? `${appData.replace(/[\\/]+$/, "")}/Microsoft/Windows/Themes/TranscodedWallpaper` : "", appData ? `${appData.replace(/[\\/]+$/, "")}/.cache/wallpaper` : ""].filter(Boolean);
		for (const path of candidates) {
			const blob = await neuReadBinary(path);
			if (blob) {
				const hex = await extractFromImage(blob);
				if (hex) return hex;
			}
		}
	}
	return cachedWallpaperPrimary();
};
var resolveAppearanceBaseColor = async (appearance) => {
	const input = typeof appearance === "string" || appearance == null ? { color: appearance } : appearance;
	const source = resolveColorSource(input.colorSource);
	const custom = normalizeHexColor(input.color);
	const pick = async (fn, tag) => {
		const hex = normalizeHexColor(await fn());
		return hex ? {
			hex,
			source: tag
		} : null;
	};
	if (source === "custom" && custom) return {
		hex: custom,
		source: "custom"
	};
	if (source === "material-you") return await pick(resolveSystemAccentColor, "material-you") ?? {
		hex: custom || "#5a9ec8",
		source: custom ? "custom" : "material-you"
	};
	if (source === "wallpaper") return await pick(colorFromLiveWallpaperCanvas, "wallpaper") ?? await pick(colorFromAppWallpaper, "wallpaper") ?? await pick(async () => readBridgeColor("wallpaperColor"), "wallpaper") ?? {
		hex: custom || "#5a9ec8",
		source: "wallpaper"
	};
	if (source === "speed-dial") return await pick(colorFromAppWallpaper, "speed-dial") ?? {
		hex: custom || "#5a9ec8",
		source: "speed-dial"
	};
	if (source === "system-wallpaper") return await pick(colorFromSystemWallpaper, "system-wallpaper") ?? {
		hex: custom || "#5a9ec8",
		source: "system-wallpaper"
	};
	return {
		hex: custom || "#5a9ec8",
		source
	};
};
//#endregion
//#region ../../modules/projects/subsystem/src/other/utils/Theme.ts
/**
* WHY: fl.ui Quick Settings cannot import this module (layer cycle). It dispatches
* `u2-theme-change` with `{ source: "quick-settings", theme }`; we persist to IDB and
* re-run {@link applyTheme} so env-shell + minimal shells share one persistence path.
*/
var quickSettingsThemeBridgeBound = false;
var quickSettingsThemeBridgeBusy = false;
var bindQuickSettingsThemePersistence = () => {
	if (quickSettingsThemeBridgeBound || typeof document === "undefined") return;
	quickSettingsThemeBridgeBound = true;
	document.documentElement.addEventListener("u2-theme-change", (ev) => {
		const detail = ev?.detail;
		if (!detail || detail.source !== "quick-settings") return;
		const theme = detail.theme;
		if (theme !== "light" && theme !== "dark") return;
		if (quickSettingsThemeBridgeBusy) return;
		quickSettingsThemeBridgeBusy = true;
		(async () => {
			try {
				const current = await loadSettings();
				if (current?.appearance?.theme === theme) {
					syncBrowserChromeTheme(theme, theme);
					return;
				}
				applyTheme(await saveSettings({
					...current,
					appearance: {
						...current.appearance || {},
						theme
					}
				}));
			} catch (e) {
				console.warn("[Theme] Quick Settings persistence failed", e);
				syncBrowserChromeTheme(theme, theme);
			} finally {
				quickSettingsThemeBridgeBusy = false;
			}
		})();
	});
};
/** Convert getComputedStyle background (rgb/rgba or hex) to #rrggbb for meta theme-color / PWA chrome. */
var cssBackgroundToOpaqueHex = (css) => {
	const t = css.trim();
	if (!t || t === "transparent") return null;
	const hexMatch = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hexMatch) {
		let h = hexMatch[1];
		if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
		return `#${h.toLowerCase()}`;
	}
	const m = t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
	if (!m) return null;
	const alpha = m[4] !== void 0 ? Number(m[4]) : 1;
	if (!Number.isFinite(alpha) || alpha < .98) return null;
	return `#${[
		Math.max(0, Math.min(255, Math.round(Number(m[1])))),
		Math.max(0, Math.min(255, Math.round(Number(m[2])))),
		Math.max(0, Math.min(255, Math.round(Number(m[3]))))
	].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};
/**
* Sample the top shell chrome (minimal nav or faint toolbar) from mounted shell shadow roots
* so PWA Window Controls Overlay / title bar can match the real toolbar background.
*/
var samplePwaToolbarBackgroundColor = () => {
	if (typeof document === "undefined") return null;
	const hosts = document.querySelectorAll("[data-shell]");
	for (const host of hosts) {
		const sr = host.shadowRoot;
		if (!sr) continue;
		const bar = sr.querySelector(".app-shell__nav, .app-shell__toolbar");
		if (!bar) continue;
		const bg = getComputedStyle(bar).backgroundColor;
		const hex = cssBackgroundToOpaqueHex(bg);
		if (hex) return hex;
	}
	return null;
};
/** Paint `--color-surface` so Capacitor / PWA chrome follows Material You after seed apply. */
var sampleSurfaceBackgroundColor = () => {
	if (typeof document === "undefined") return null;
	const probe = document.createElement("div");
	probe.style.cssText = "position:fixed;left:-8px;top:-8px;inline-size:4px;block-size:4px;pointer-events:none;opacity:0;background:var(--color-surface)";
	try {
		document.documentElement.appendChild(probe);
		return cssBackgroundToOpaqueHex(getComputedStyle(probe).backgroundColor);
	} catch {
		return null;
	} finally {
		probe.remove();
	}
};
var resolveColorScheme = (theme) => {
	if (theme === "dark" || theme === "light") return theme;
	return globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
};
var resolveFontSize = (size) => {
	switch (size) {
		case "small": return "14px";
		case "large": return "18px";
		default: return "16px";
	}
};
/** Keep minimal / immersive shell hosts + inner `.app-shell` in sync when only `applyTheme()` runs (Settings saves / preview) — `shell.setTheme` is not always invoked. */
var syncShellHostVisualScheme = (resolved) => {
	try {
		document.querySelectorAll("[data-shell]").forEach((el) => {
			const h = el;
			h.dataset.theme = resolved;
			h.style.colorScheme = resolved;
			const inner = h.shadowRoot?.querySelector?.(".app-shell");
			if (inner) {
				inner.dataset.theme = resolved;
				inner.style.colorScheme = resolved;
			}
		});
	} catch {}
	try {
		document.querySelectorAll("ui-window, .env-shell-root").forEach((el) => {
			const h = el;
			h.dataset.theme = resolved;
			h.style.colorScheme = resolved;
		});
	} catch {}
};
/** Keep <html> + PWA chrome aligned with resolved light/dark and user preference (auto/light/dark). */
var syncBrowserChromeTheme = (resolved, preference) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const scheme = preference === "dark" ? "dark" : preference === "light" ? "light" : "auto";
	root.setAttribute("data-scheme", scheme);
	root.setAttribute("data-theme", resolved);
	root.style.colorScheme = resolved;
	try {
		const body = document.body;
		if (body) body.style.colorScheme = resolved;
	} catch {}
	try {
		document.querySelectorAll("[data-shell='content']").forEach((el) => {
			el.style.colorScheme = resolved;
		});
	} catch {}
	if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ !== true) {
		const applyMetaThemeColor = () => {
			if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ === true) return;
			if (globalThis?.__CWSP_NATIVE_THEME_COLOR_OWNED__) return;
			if (document.querySelector("ui-window[native-mode]:not([minimized])")) return;
			let meta = document.querySelector("meta[name=\"theme-color\"]");
			if (!meta) {
				meta = document.createElement("meta");
				meta.setAttribute("name", "theme-color");
				document.head?.appendChild(meta);
			}
			const sampled = samplePwaToolbarBackgroundColor() ?? sampleSurfaceBackgroundColor();
			const fallback = resolved === "dark" ? "#1a2420" : "#d5e4dc";
			meta.setAttribute("content", sampled ?? fallback);
		};
		applyMetaThemeColor();
		requestAnimationFrame(applyMetaThemeColor);
	}
	syncShellHostVisualScheme(resolved);
};
var applyTheme = (settings) => {
	if (typeof document === "undefined") return;
	bindQuickSettingsThemePersistence();
	installThemeLifecycleResync();
	if (!settings) return;
	const root = document.documentElement;
	const theme = settings.appearance?.theme || "auto";
	const resolvedScheme = resolveColorScheme(theme);
	syncBrowserChromeTheme(resolvedScheme, theme);
	root.style.fontSize = resolveFontSize(settings.appearance?.fontSize);
	root.dataset.colorSource = resolveColorSource(settings.appearance?.colorSource);
	resolveAppearanceBaseColor(settings.appearance).then(({ hex, source }) => {
		applyBaseColorSeed(hex, source);
		syncBrowserChromeTheme(resolvedScheme, theme);
	});
	if (settings.grid) applyGridSettings(settings);
};
var restampExplorerShellScheme = () => {
	if (typeof document === "undefined") return;
	try {
		document.querySelectorAll(".view-explorer").forEach((el) => {
			const scheme = el.dataset.explorerColorScheme;
			if (scheme !== "light" && scheme !== "dark") return;
			if (el.getAttribute("data-theme") !== scheme) el.setAttribute("data-theme", scheme);
			el.style.setProperty("color-scheme", `${scheme} only`);
		});
	} catch {}
};
var themeResumeAt = 0;
var themeLifecycleBound = false;
var sawBackground = false;
var restampChromeScheme = () => {
	restampExplorerShellScheme();
	try {
		const root = document.documentElement;
		const pinned = root.getAttribute("data-theme");
		if (pinned === "light" || pinned === "dark") {
			root.style.colorScheme = pinned;
			if (document.body) document.body.style.colorScheme = pinned;
		}
		root.offsetHeight;
	} catch {}
};
/**
* Restore chrome after Android recents / Home.
* INVARIANT: never rewrite constructable sheets on cold start — first onResume/focus wiped UI.
*/
var resumeThemeAfterForeground = (force = false) => {
	if (typeof document === "undefined") return;
	if (!force && document.visibilityState === "hidden") return;
	const now = Date.now();
	if (now - themeResumeAt < 240) return;
	themeResumeAt = now;
	restampChromeScheme();
	if (!sawBackground) return;
	(async () => {
		try {
			const { rehydrateAdoptedStyleSheets } = await import("../vendor/culori.js").then((n) => n.t);
			rehydrateAdoptedStyleSheets();
		} catch {}
		restampChromeScheme();
		try {
			document.dispatchEvent(new CustomEvent("cwsp:theme-resume"));
		} catch {}
	})();
};
/** Bind visibility / pageshow / Capacitor appState + expose `__CWSP_THEME_RESUME__` for Java onResume. */
var installThemeLifecycleResync = () => {
	if (themeLifecycleBound || typeof document === "undefined") return;
	themeLifecycleBound = true;
	globalThis.__CWSP_THEME_RESUME__ = resumeThemeAfterForeground;
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			sawBackground = true;
			return;
		}
		resumeThemeAfterForeground();
	});
	document.addEventListener("resume", () => resumeThemeAfterForeground());
	globalThis.addEventListener?.("pageshow", () => resumeThemeAfterForeground());
	try {
		globalThis.Capacitor?.Plugins?.App?.addListener?.("appStateChange", (state) => {
			if (state?.isActive === false) {
				sawBackground = true;
				return;
			}
			if (state?.isActive) resumeThemeAfterForeground();
		});
	} catch {}
};
//#endregion
//#region ../../modules/projects/subsystem/src/boot/veela-variant-runtime.ts
/**
* Veela stylesheet loader for CWSP-shell (no `fest/fl-ui` runtime SCSS dependency).
*
* Uses Veela's curated public SCSS entry-points (core + foundation).
*/
var loadedVariant = null;
/**
* Loads Veela stylesheet slices for the coarse variant presets used by BootLoader.
*/
async function loadVeelaVariant(variant) {
	if (loadedVariant === variant) return;
	console.log("[Veela] Loading variant:", variant);
	const apply = async (text) => {
		if (typeof text === "string" && text.length) await loadAsAdopted(text);
	};
	if (variant === "core") {
		await apply(core_default);
		loadedVariant = variant;
		return;
	}
	await apply(scss_default);
	loadedVariant = variant;
}
//#endregion
//#region ../../modules/projects/subsystem/src/styles.ts
/**
* CWSP-shell Styles Module
*
* Provides style system integration for the CWSP-shell application.
* Supports multiple style systems based on veela CSS variants.
*
* Style Systems:
* - veela-advanced: Full-featured CSS framework (default)
* - veela-basic: Lightweight minimal styling
* - veela-beercss: Beer CSS compatible styling
* - raw: No styling framework (browser defaults)
*/
var STYLE_CONFIGS = {
	"vl-advanced": {
		id: "vl-advanced",
		name: "Veela Advanced",
		description: "Full-featured CSS framework with design tokens and effects",
		variant: "advanced",
		initFn: async () => {
			try {
				await loadVeelaVariant("advanced");
				console.log("[Styles] Veela Advanced loaded");
			} catch (e) {}
		}
	},
	"vl-basic": {
		id: "vl-basic",
		name: "Veela Basic Styles",
		description: "Lightweight minimal styling for basic functionality",
		variant: "basic",
		initFn: async () => {
			try {
				await loadVeelaVariant("basic");
				console.log("[Styles] Veela Basic Styles loaded");
			} catch (e) {
				console.warn("[Styles] Failed to load Veela Basic Styles:", e);
			}
		}
	},
	"vl-beercss": {
		id: "vl-beercss",
		name: "Veela BeerCSS",
		description: "Beer CSS compatible styling with Material Design 3",
		variant: "beercss",
		initFn: async () => {
			try {
				await loadVeelaVariant("beercss");
				console.log("[Styles] Veela BeerCSS loaded");
			} catch (e) {
				console.warn("[Styles] Failed to load Veela BeerCSS:", e);
			}
		}
	},
	"vl-core": {
		id: "vl-core",
		name: "Veela Core",
		description: "Shared foundation styles for all veela variants",
		variant: "core",
		initFn: async () => {
			try {
				await loadVeelaVariant("core");
				console.log("[Styles] Veela Core loaded");
			} catch (e) {
				console.warn("[Styles] Failed to load Veela Core:", e);
			}
		}
	},
	"raw": {
		id: "raw",
		name: "Raw",
		description: "No styling framework, browser defaults",
		variant: "core",
		initFn: async () => {
			console.log("[Styles] Raw mode - no styles loaded");
		}
	}
};
var _currentStyle = null;
/**
* Load a style system
*
* @param styleId - Style system identifier
*/
async function loadStyleSystem(styleId) {
	const config = STYLE_CONFIGS[styleId] || STYLE_CONFIGS["vl-basic"];
	if (!config) throw new Error(`Unknown style system: ${styleId}`);
	if (_currentStyle === styleId) {
		console.log(`[Styles] Style system '${styleId}' already loaded`);
		return;
	}
	console.log(`[Styles] Loading style system: ${config.name}`);
	if (config.initFn) await config.initFn();
	_currentStyle = styleId;
	console.log(`[Styles] Style system ${config.name} loaded`);
}
//#endregion
export { applyTheme as n, loadStyleSystem as t };
