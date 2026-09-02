import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{Dt as n,Et as r,Rt as i,nn as a}from"./src-C8p-yYHh.js";import{_ as o,a as s,d as c,f as l,h as u,i as d,m as f,o as p,p as ee,r as te,s as m,t as h,u as g}from"./registry-1BhElAAe.js";import{n as _,t as v}from"./preload-helper-DFTwEg7x.js";import{o as ne,s as y}from"./channel-mixin-HfL7HKU7.js";import{a as re,c as b,i as ie}from"./cws-bridge-BDddm-Gk.js";import{n as x,r as ae}from"./SettingsTypes-COvJs73b.js";import{r as S,t as C}from"./hub-socket-boot-JxvQbb_I.js";import{a as w,n as T,o as E}from"./Settings-BdjZKlQM.js";import{n as D,r as O}from"./Theme-CppsnuLy.js";import{n as k,r as oe}from"./capacitor-settings-permissions-DkzN5Fmd.js";import{a as se,o as ce}from"./image-d0hFG0A5.js";function le(){if(j){console.debug(`[LayerManager] Already initialized`);return}if(typeof document>`u`){console.warn(`[LayerManager] No document available (SSR context?)`);return}let e=[...A].sort((e,t)=>e.order-t.order).map(e=>e.name),t=`@layer ${e.join(`, `)};`,n=document.createElement(`style`);n.id=`css-layer-init`,n.setAttribute(`data-layer-manager`,`true`),n.textContent=t;let r=document.head;r.insertBefore(n,r.firstChild),M=n,j=!0,console.log(`[LayerManager] Initialized ${e.length} layers`)}var A,j,M;function N(){return(N=e((()=>{A=[{name:`ux-normalize`,category:`system`,order:0,description:`Veela normalize layer`},{name:`layer.reset`,category:`system`,order:0,description:`CSS reset rules`},{name:`layer.normalize`,category:`system`,order:10,description:`Normalize browser defaults`},{name:`tokens`,category:`system`,order:20,description:`Legacy tokens layer`},{name:`ux-tokens`,category:`system`,order:20,description:`Veela token layer`},{name:`layer.tokens`,category:`system`,order:20,description:`CSS custom properties (variables)`},{name:`base`,category:`system`,order:30,description:`Legacy base layer`},{name:`ux-base`,category:`system`,order:30,description:`Veela base layer`},{name:`layout`,category:`system`,order:40,description:`Legacy layout layer`},{name:`ux-layout`,category:`system`,order:40,description:`Veela layout layer`},{name:`components`,category:`system`,order:50,description:`Legacy components layer`},{name:`ux-components`,category:`system`,order:50,description:`Veela components layer`},{name:`utilities`,category:`system`,order:60,description:`Legacy utilities layer`},{name:`ux-utilities`,category:`system`,order:60,description:`Veela utilities layer`},{name:`ux-theme`,category:`system`,order:70,description:`Veela theme layer`},{name:`ux-overrides`,category:`system`,order:80,description:`Veela overrides layer`},{name:`layer.properties.shell`,category:`system`,order:30,description:`Shell context custom properties`},{name:`layer.properties.views`,category:`system`,order:35,description:`View context custom properties`},{name:`layer.runtime.base`,category:`runtime`,order:100,description:`Veela runtime base styles`},{name:`layer.runtime.components`,category:`runtime`,order:110,description:`Reusable component styles`},{name:`layer.runtime.forms`,category:`runtime`,order:115,description:`Form element base styles`},{name:`layer.runtime.utilities`,category:`runtime`,order:120,description:`Utility classes`},{name:`layer.runtime.animations`,category:`runtime`,order:130,description:`Keyframes and animation definitions`},{name:`layer.boot`,category:`runtime`,order:140,description:`Boot/choice screen styles`},{name:`boot.tokens`,category:`runtime`,order:142,description:`Boot tokens layer`},{name:`boot.base`,category:`runtime`,order:144,description:`Boot base layer`},{name:`boot.components`,category:`runtime`,order:146,description:`Boot components layer`},{name:`boot.responsive`,category:`runtime`,order:148,description:`Boot responsive adjustments`},{name:`layer.shell.common`,category:`shell`,order:200,description:`Shared shell styles`},{name:`shell.tokens`,category:`shell`,order:202,description:`Legacy shell tokens`},{name:`shell.base`,category:`shell`,order:204,description:`Legacy shell base`},{name:`shell.components`,category:`shell`,order:206,description:`Legacy shell components`},{name:`shell.utilities`,category:`shell`,order:208,description:`Legacy shell utilities`},{name:`shell.overrides`,category:`shell`,order:209,description:`Legacy shell overrides`},{name:`layer.shell.raw`,category:`shell`,order:210,description:`Raw shell (minimal)`},{name:`layer.shell.minimal`,category:`shell`,order:220,description:`Minimal shell (toolbar navigation)`},{name:`layer.shell.minimal.layout`,category:`shell`,order:222,description:`Minimal shell layout rules`},{name:`layer.shell.minimal.components`,category:`shell`,order:224,description:`Minimal shell component styles`},{name:`layer.shell.window`,category:`shell`,order:226,description:`Window shell (desktop/process frames)`},{name:`layer.shell.faint`,category:`shell`,order:230,description:`Faint shell (tabbed sidebar)`},{name:`layer.shell.faint.layout`,category:`shell`,order:232,description:`Faint shell layout`},{name:`layer.shell.faint.sidebar`,category:`shell`,order:234,description:`Faint shell sidebar`},{name:`layer.shell.faint.toolbar`,category:`shell`,order:236,description:`Faint shell toolbar`},{name:`layer.shell.faint.forms`,category:`shell`,order:238,description:`Faint shell form components`},{name:`layer.view.common`,category:`view`,order:300,description:`Shared view styles`},{name:`layer.view.viewer`,category:`view`,order:310,description:`Markdown viewer`},{name:`layer.view.workcenter`,category:`view`,order:320,description:`Work center (AI prompts)`},{name:`layer.view.workcenter.keyframes`,category:`view`,order:322,description:`Work center animations`},{name:`view.workcenter`,category:`view`,order:324,description:`Work center styles (legacy name)`},{name:`view.workcenter.animations`,category:`view`,order:326,description:`Work center animations (legacy name)`},{name:`layer.view.settings`,category:`view`,order:330,description:`Settings view`},{name:`layer.view.explorer`,category:`view`,order:340,description:`File explorer`},{name:`layer.view.history`,category:`view`,order:350,description:`History view`},{name:`layer.view.editor`,category:`view`,order:360,description:`Editor view`},{name:`layer.view.editor.markdown`,category:`view`,order:362,description:`Markdown editor sublayer`},{name:`layer.view.editor.quill`,category:`view`,order:364,description:`Quill editor sublayer`},{name:`layer.view.home`,category:`view`,order:380,description:`Home/landing view`},{name:`layer.view.print`,category:`view`,order:390,description:`Print view`},{name:`view-explorer`,category:`view`,order:392,description:`Explorer legacy layered scope`},{name:`view-transitions`,category:`override`,order:850,description:`View Transition API named targets and keyframes`},{name:`layer.override.theme`,category:`override`,order:900,description:`Theme customizations`},{name:`layer.override.print`,category:`override`,order:910,description:`Print media styles`},{name:`layer.override.a11y`,category:`override`,order:920,description:`Accessibility enhancements`}],j=!1})))()}function P(){return(P=e((()=>{O()})))()}var F;function I(){return(I=e((()=>{F=`/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_tokens.scss
 * Change date and time: 22.30.00_22.08.2026
 * Reason for changes: Light/dark primary-container so Start plates and chrome ink flip.
 */
/*
 * INVARIANT: This is the canonical color-token registry for the full veela bundle.
 * All color token DEFAULTS live here on \`:root, :host, :scope\`.
 * - The core entry-point owns every default; basic and theme modules consume it.
 * - Component/shell/view styles may only provide scoped semantic aliases.
 * - Component/shell/view files keep only context overrides and shadow-DOM
 *   \`var(--token, light-dark(...))\` fallbacks; they never redefine a canonical default.
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-properties.scss
 * Change date and time: 15.50.00_22.08.2026
 * Reason for changes: Seed initial-value is the desktop cyan-blue fallback (#5a9ec8).
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these (plus \`--wallpaper-*\` paper/ink);
 * surfaces derive via unregistered \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\`
 * and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a9ec8;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a9ec8;
}
@property --wallpaper-underlying-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #16161a;
}
@property --wallpaper-contrast-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #f7f7f8;
}
@property --color-secondary {
  syntax: "<color>";
  inherits: true;
  initial-value: #6b8cff;
}
@property --color-tertiary {
  syntax: "<color>";
  inherits: true;
  initial-value: #8aa0ff;
}
@property --color-error {
  syntax: "<color>";
  inherits: true;
  initial-value: #ef4444;
}
@property --color-success {
  syntax: "<color>";
  inherits: true;
  initial-value: #4caf50;
}
@property --color-warning {
  syntax: "<color>";
  inherits: true;
  initial-value: #ff9800;
}
@property --color-info {
  syntax: "<color>";
  inherits: true;
  initial-value: #2196f3;
}
/*
 * Filename: _color-mod.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-mod.scss
 * Reason for changes: Single source for the custom color modulation function.
 */
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  --i: clamp(0, var(--index), 1000);
  --pivot: 550;
  --white-distance: clamp(0, calc((var(--pivot) - var(--i)) / var(--pivot)), 1);
  --black-distance: clamp(0, calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))), 1);
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  --center-left: clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right: clamp(0, calc((1000 - var(--i)) / (1000 - var(--pivot))), 1);
  --chroma-shape: sqrt(min(var(--center-left), var(--center-right)));
  --chroma-scale: calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
/*
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * FIND:veela-layers
 * TAG:veela,style-lib
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: this is the compiled-SCSS cascade-order prelude. Component, view,
 * and shell sheets join one of these layers instead of declaring local preludes.
 * JS wrap/unwrap/order lives in \`@fest-lib/style-lib\` \`layers.ts\` (\`VEELA_CASCADE_LAYERS\`).
 */
@layer tokens, base, layout, components, utilities, theme, overrides, print;
/* ==========================================================================
    Meta / Declarations
   ========================================================================== */
/* ==========================================================================
    Tokens / Mixins (global, not layered)
   ========================================================================== */
/*
 * WHY: Pinned themes use *concrete* mod indices — not \`light-dark()\`.
 * \`light-dark()\` + mixed color-scheme (OS vs app, shadow hosts, typed @property) caused
 * Light QS tile with dark surfaces / cream panels with light-on-light labels.
 * Index scale: 0 white ← 550 seed → 1000 black. Seeds stay writable by WallpaperTheme.
 */
/** Light surfaces — always light chrome; hue from --base-color / wallpaper. */
/** Dark surfaces — always dark chrome; hue from --base-color / wallpaper. */
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a9ec8;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 40);
    --color-secondary: --u2-color-mod(var(--base-color), 420);
    --color-on-secondary: --u2-color-mod(var(--base-color), 40);
    --color-tertiary: --u2-color-mod(var(--base-color), 400);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 40);
    --color-error: #ef4444;
    --color-on-error: --u2-color-mod(var(--color-error), 40);
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: --u2-color-mod(var(--base-color), 60);
    --color-on-background: --u2-color-mod(var(--base-color), 900);
    --color-surface: --u2-color-mod(var(--base-color), 60);
    --color-on-surface: --u2-color-mod(var(--base-color), 900);
    --color-surface-variant: --u2-color-mod(var(--base-color), 160);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 700);
    --color-outline: --u2-color-mod(var(--base-color), 300);
    --color-outline-variant: --u2-color-mod(var(--base-color), 400);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 40);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 30);
    --color-surface-container: --u2-color-mod(var(--base-color), 20);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 5);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 2);
    /* WHY: Start/AppMenu plates used a dark 880 fallback when this token was missing. */
    --color-primary-container: --u2-color-mod(var(--base-color), 160);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 900);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
    --space-2xs: 0.125rem;
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 0.75rem;
    --space-lg: 1rem;
    --space-xl: 1.25rem;
    --space-2xl: 1.5rem;
    --padding-xs: var(--space-xs);
    --padding-sm: var(--space-sm);
    --padding-md: var(--space-md);
    --padding-lg: var(--space-lg);
    --padding-xl: var(--space-xl);
    --padding-2xl: var(--space-2xl);
    --padding-3xl: 2rem;
    --padding-4xl: 2.5rem;
    --padding-5xl: 3rem;
    --padding-6xl: 4rem;
    --padding-7xl: 5rem;
    --padding-8xl: 6rem;
    --padding-9xl: 8rem;
    --gap-xs: var(--space-xs);
    --gap-sm: var(--space-sm);
    --gap-md: var(--space-md);
    --gap-lg: var(--space-lg);
    --gap-xl: var(--space-xl);
    --gap-2xl: var(--space-2xl);
    --fl-ui-gap: var(--space-md);
    /*
     * Shape scale — M3 Expressive / Android 16–17 (dp≈rem at 16px).
     * extra-small 4, small 8, medium 12, large 16, extra-large 28, full pill.
     * \`--radius-sm\` stays 4dp so dense chrome does not jump.
     */
    --radius-none: 0;
    --radius-xs: 0.25rem;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.75rem;
    --radius-3xl: 2rem;
    --radius-full: 9999px;
    --fl-ui-radius: var(--radius-md);
    --border-radius: var(--radius-md);
    --shape-extra-small: var(--radius-xs);
    --shape-small: var(--radius-md);
    --shape-medium: var(--radius-lg);
    --shape-large: var(--radius-xl);
    --shape-extra-large: var(--radius-2xl);
    --shape-full: var(--radius-full);
    --elev-0: none;
    --elev-1: 0 1px 1px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
    --elev-2: 0 2px 6px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
    --elev-3: 0 6px 16px rgba(0, 0, 0, 0.14), 0 18px 48px rgba(0, 0, 0, 0.1);
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.1);
    --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow-inset-strong: inset 0 4px 8px rgba(0, 0, 0, 0.12);
    --shadow-none: 0 0 #0000;
    --text-xs: 0.8rem;
    --text-sm: 0.9rem;
    --text-base: 1rem;
    --text-lg: 1.1rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.6rem;
    --text-3xl: 2rem;
    /* COMPAT: SCSS $font-* aliases and older sheets resolve these names. */
    --font-xs: var(--text-xs);
    --font-sm: var(--text-sm);
    --font-base: var(--text-base);
    --font-md: var(--text-base);
    --font-lg: var(--text-lg);
    --font-xl: var(--text-xl);
    --font-2xl: var(--text-2xl);
    /*
     * Component foundation tokens. Keep these namespaced at root scope;
     * \`ui-icon\` maps them to its internal \`--icon-*\` variables only on
     * the component host, so a window titlebar cannot resize its content.
     */
    --ui-icon-size: 1.25rem;
    --ui-icon-padding: 0px;
    --ui-icon-tile-padding: 0.45rem;
    --ui-window-icon-size: 0.95rem;
    --ui-explorer-icon-size: 1.5rem;
    --ui-explorer-icon-track: 2rem;
    --ui-explorer-action-icon-size: 1.15rem;
    --ui-explorer-row-height: 3.25rem;
    --icon-size-sm: var(--ui-icon-size);
    --icon-size-md: var(--ui-icon-size);
    --icon-size-lg: var(--ui-explorer-icon-size);
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-family: "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    --font-family-base: var(--font-family);
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --line-height: var(--leading-normal);
    --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
    --ease-expressive: cubic-bezier(0.34, 1.25, 0.64, 1);
    --duration-fast: 140ms;
    --duration-normal: 220ms;
    --duration-slow: 360ms;
    --transition-fast: var(--duration-fast) var(--ease-emphasized);
    --transition-normal: var(--duration-normal) var(--ease-emphasized);
    --transition-slow: var(--duration-slow) var(--ease-emphasized);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --focus-ring: 0 0 0 3px color-mix(in oklab, var(--color-primary) 35%, transparent);
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
    --z-toast: 800;
    --z-max: 9999;
    --view-bg: var(--color-container);
    --view-fg: var(--color-on-surface);
    --view-border: var(--color-outline-variant);
    --view-input-bg: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 40),
        var(--color-surface-container-high)
    );
    --view-files-bg: var(--color-surface-container-low);
    --view-file-bg: var(--color-surface-container-lowest, var(--color-surface-container-low));
    --view-results-bg: var(--color-surface-container-low);
    --view-result-bg: var(--color-surface-container-lowest, var(--color-surface-container-low));
    --color-surface-elevated: var(--color-surface-container);
    --color-surface-hover: var(--color-surface-container-low);
    --color-surface-active: var(--color-surface-container-high);
    --color-on-surface-muted: var(--color-on-surface-variant);
    --color-background-alt: var(--color-surface-variant);
    --color-primary-hover: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 620),
        --u2-color-mod(var(--base-color, var(--color-primary)), 480)
    );
    --color-primary-active: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 700),
        --u2-color-mod(var(--base-color, var(--color-primary)), 400)
    );
    --color-accent: var(--color-secondary);
    --color-accent-hover: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 500),
        --u2-color-mod(var(--base-color, var(--color-primary)), 600)
    );
    --color-on-accent: var(--color-on-secondary);
    --color-border-hover: var(--color-outline-variant);
    --color-border-strong: var(--color-outline);
    --color-border-focus: var(--color-primary);
    --color-text: var(--color-on-surface);
    --color-text-secondary: var(--color-on-surface-variant);
    --color-text-muted: color-mix(in oklab, var(--color-on-surface) 50%, var(--color-surface));
    --color-text-disabled: color-mix(in oklab, var(--color-on-surface) 38%, var(--color-surface));
    --color-text-inverse: var(--color-on-primary);
    --color-link: var(--color-primary);
    --color-link-hover: var(--color-primary-hover);
    --color-success-light: --u2-color-mod(var(--color-success), 280);
    --color-success-dark: --u2-color-mod(var(--color-success), 720);
    --color-warning-light: --u2-color-mod(var(--color-warning), 280);
    --color-warning-dark: --u2-color-mod(var(--color-warning), 720);
    --color-error-light: --u2-color-mod(var(--color-error), 280);
    --color-error-dark: --u2-color-mod(var(--color-error), 720);
    --color-info-light: --u2-color-mod(var(--color-info), 280);
    --color-info-dark: --u2-color-mod(var(--color-info), 720);
    --color-bg: var(--color-surface, var(--color-surface));
    --color-bg-alt: var(--color-surface-variant, var(--color-surface-variant));
    --color-fg: var(--color-on-surface, var(--color-on-surface));
    --color-fg-muted: var(--color-on-surface-variant, var(--color-on-surface-variant));
    --touch-min: 3rem;
    --btn-height-sm: 2rem;
    --btn-height-md: var(--touch-min);
    --btn-height-lg: 3.5rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: var(--touch-min);
    --input-height-lg: 3.5rem;
    --state-opacity-hover: 0.08;
    --state-opacity-press: 0.12;
    --state-opacity-focus: 0.12;
    --state-opacity-disabled: 0.38;
    --state-opacity-drag: 0.16;
    --input-padding-x: var(--space-md);
    --input-radius: var(--radius-md);
    --input-border-color: var(--color-border, var(--color-border));
    --input-focus-ring-color: var(--color-primary);
    --input-focus-ring-width: 2px;
    --card-padding: var(--space-lg);
    --card-radius: var(--radius-lg);
    --card-shadow: var(--shadow-sm);
    --card-border-color: var(--color-border, var(--color-border));
    --modal-backdrop-bg: light-dark(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.7));
    --modal-bg: var(--color-surface, var(--color-surface));
    --modal-radius: var(--radius-xl);
    --modal-shadow: var(--shadow-xl);
    --modal-padding: 1.5rem;
    --toast-font-family: var(--font-family, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    --toast-font-size: var(--font-size-base, 1rem);
    --toast-font-weight: var(--font-weight-medium, 500);
    --toast-letter-spacing: 0.01em;
    --toast-line-height: 1.4;
    --toast-white-space: nowrap;
    --toast-pointer-events: auto;
    --toast-user-select: none;
    --toast-cursor: default;
    --toast-opacity: 0;
    --toast-transform: translateY(100%) scale(0.9);
    --toast-transition: opacity 160ms ease-out, transform 160ms cubic-bezier(0.16, 1, 0.3, 1), background-color 100ms ease;
    --toast-text: var(--color-on-surface, var(--color-on-surface, light-dark(#ffffff, #000000)));
    --toast-bg: color-mix(in oklab, var(--color-surface-elevated, var(--color-surface-container-high, var(--color-surface, light-dark(#fafbfc, #1e293b)))) 90%, var(--color-on-surface, var(--color-on-surface, light-dark(#000000, #ffffff))));
    --toast-radius: var(--radius-lg);
    --toast-shadow: var(--shadow-lg);
    --toast-padding: var(--space-lg);
    --sidebar-width: 280px;
    --sidebar-collapsed-width: 64px;
    --nav-height: 56px;
    --nav-height-compact: 48px;
    --status-height: 24px;
    --status-bg: var(--color-surface-elevated, var(--color-surface-container-high));
    --status-font-size: var(--text-xs);
    /* ── Shell chrome tokens (cross-shell registry) ─────────────────────────
     * WHY: previously scattered across minimal/immersive/faint shells with
     * duplicated \`light-dark(var(--color-*), var(--color-*))\` and offline hex
     * fallbacks. Defined once here in terms of canonical \`--color-*\` so canonical
     * is the single value source. Shells keep only theme/state overrides and
     * documented offline/SSR hex fallbacks for when veela is not loaded.
     */
    --shell-bg: var(--sv-surface-2, var(--color-surface));
    --shell-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-nav-bg: var(--sv-surface-2, var(--color-surface-container-high));
    --shell-nav-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-nav-border: var(--sv-outline-variant, var(--color-outline-variant));
    --shell-btn-hover: var(--sv-surface-2, var(--color-surface-container));
    --shell-btn-active-bg: color-mix(in oklab, var(--color-primary) 18%, var(--sv-surface-2, var(--color-surface)));
    --shell-btn-active-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-status-bg: var(--sv-surface-1, var(--color-surface-container-low));
    --shell-status-fg: var(--sv-on-surface, var(--color-on-surface));
    /* ── Faint shell tokens (subsystem boot shells) ───────────────────────
     * Derived from canonical \`--color-*\`; previously duplicated as
     * \`light-dark(var(--color-*), var(--color-*))\` in \`subsystem/boot/shells.scss\`.
     */
    --faint-nav-bg: var(--color-surface-container-high);
    --faint-nav-border: var(--color-outline-variant);
    --faint-sidebar-bg: var(--color-surface-container-high);
    /* ── Environment-shell tokens (color subset) ──────────────────────────
     * \`--env-status-fg\` follows window chrome. \`--env-launcher-fg*\` aliases
     * \`--wallpaper-contrast-color\` / paper (WallpaperTheme + statusbar luma).
     * Non-color \`--env-*\` (z-index, safe-area, insets) stay in environment-shell.
     */
    --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
    --env-status-fg-muted: color-mix(in oklab, var(--env-status-fg) 78%, transparent);
    --env-launcher-fg: var(--wallpaper-contrast-color);
    --env-launcher-fg-shadow: color-mix(in oklab, var(--wallpaper-underlying-color) 88%, transparent);
    --env-launcher-fg-glow: color-mix(in oklab, var(--wallpaper-underlying-color) 48%, transparent);
    /* ── fl.ui \`--error-color\` alias ────────────────────────────────────
     * Canonical alias so fl.ui/components can consume \`var(--error-color)\`
     * without a standalone fallback definition.
     */
    --error-color: var(--color-error, #f87171);
    /* ── Settings-view semantic tokens (\`--sv-*\`) ──────────────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\` / \`--base-color\`.
     * Source of truth for the default relationships lives here; settings-view keeps
     * only theme-pinned overrides (\`html[data-theme]\`) and shadow-DOM self-sufficiency
     * fallbacks at use sites (\`var(--sv-*, light-dark(...))\`).
     */
    --sv-bg: var(--sv-surface-2, var(--color-surface-container-low, light-dark(#eef1f6, #0f1318)));
    --sv-fg: var(--sv-on-surface, var(--color-on-surface, light-dark(#12151a, #e8edf2)));
    --sv-muted: var(--sv-on-surface-variant, var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc)));
    --sv-outline: var(--sv-outline-variant, var(--color-outline-variant, light-dark(#c5cdd8, #3d4755)));
    --sv-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #171c24));
    --sv-surface-2: var(--color-surface-container, light-dark(#f4f6fa, #1c232d));
    --sv-primary: var(--base-color, var(--color-primary, #5a9ec8));
    --sv-danger: var(--color-error, #d32f2f);
    /* ── History-view semantic tokens (\`--vh-*\`) ──────────────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\`.
     * Source of truth for the default relationships lives here; history-view keeps
     * only the complex derived tokens (\`--vh-item-border/preview-bg/elev\`) and
     * shadow-DOM self-sufficiency fallbacks at use sites.
     */
    --vh-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));
    --vh-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --vh-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --vh-primary: var(--color-primary, #007acc);
    --vh-danger: var(--color-error, #d32f2f);
    --vh-on-primary: var(--color-on-primary, #ffffff);
    --vh-item-bg: var(--color-surface-container-low, light-dark(#e0e5ee, #0a0d12));
    /* ── Explorer / shared view color tokens (\`--view-*\`) ────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\`.
     * Source of truth for the default relationships lives here; explorer-view keeps
     * only \`--explorer-*\` non-color (radius/pad/font) and shadow-DOM self-sufficiency
     * fallbacks at use sites. Shared \`--view-*\` namespace also consumed by markdown-view.
     */
    --view-border: color-mix(in oklab, var(--color-outline-variant, #888) 45%, transparent);
    --view-fg-muted: color-mix(in oklab, var(--color-on-surface, #ccc) 72%, transparent);
    --view-hover-bg: color-mix(in oklab, var(--color-primary, #3794ff) 12%, transparent);
    --view-selected-bg: color-mix(in oklab, var(--color-primary, #3794ff) 18%, transparent);
    --view-selected-border: var(--color-primary, #3794ff);
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
      --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
      --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
      --wf-md-primary: var(--color-primary);
      --wf-md-seed: var(--base-color);
      --color-on-primary: --u2-color-mod(var(--base-color), 920);
      --color-secondary: --u2-color-mod(var(--base-color), 680);
      --color-on-secondary: --u2-color-mod(var(--base-color), 920);
      --color-tertiary: --u2-color-mod(var(--base-color), 700);
      --color-on-tertiary: --u2-color-mod(var(--base-color), 920);
      --color-error: #f87171;
      --color-on-error: --u2-color-mod(var(--color-error), 920);
      --color-success: #66bb6a;
      --color-warning: #ffa726;
      --color-info: #42a5f5;
      --color-background: --u2-color-mod(var(--base-color), 940);
      --color-on-background: --u2-color-mod(var(--base-color), 100);
      --color-surface: --u2-color-mod(var(--base-color), 940);
      --color-on-surface: --u2-color-mod(var(--base-color), 100);
      --color-surface-variant: --u2-color-mod(var(--base-color), 840);
      --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
      --color-outline: --u2-color-mod(var(--base-color), 720);
      --color-outline-variant: --u2-color-mod(var(--base-color), 640);
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 920);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 940);
      --color-surface-container: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 980);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 1000);
      --color-primary-container: --u2-color-mod(var(--base-color), 820);
      --color-on-primary-container: --u2-color-mod(var(--base-color), 100);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --surface-color: var(--color-surface);
      --fl-surface: var(--color-surface);
      --fl-on-surface: var(--color-on-surface);
      --fl-primary: var(--color-primary);
      --fl-on-primary: var(--color-on-primary);
      --fl-secondary: var(--color-secondary);
      --fl-on-secondary: var(--color-on-secondary);
      --fl-shadow-xl: var(--shadow-xl);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
      --md3-primary-container: var(--color-primary-container);
      --md-primary-container: var(--color-primary-container);
    }
  }
  /*
   * Pinned app theme — highest authority. Concrete surfaces so shadow/UI never mix
   * OS color-scheme with app light (Settings cream + white labels).
   */
  :root[data-theme=light],
  :host[data-theme=light],
  [data-theme=light] {
    color-scheme: light only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 40);
    --color-secondary: --u2-color-mod(var(--base-color), 420);
    --color-on-secondary: --u2-color-mod(var(--base-color), 40);
    --color-tertiary: --u2-color-mod(var(--base-color), 400);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 40);
    --color-error: #ef4444;
    --color-on-error: --u2-color-mod(var(--color-error), 40);
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: --u2-color-mod(var(--base-color), 60);
    --color-on-background: --u2-color-mod(var(--base-color), 900);
    --color-surface: --u2-color-mod(var(--base-color), 60);
    --color-on-surface: --u2-color-mod(var(--base-color), 900);
    --color-surface-variant: --u2-color-mod(var(--base-color), 160);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 700);
    --color-outline: --u2-color-mod(var(--base-color), 300);
    --color-outline-variant: --u2-color-mod(var(--base-color), 400);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 40);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 30);
    --color-surface-container: --u2-color-mod(var(--base-color), 20);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 5);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 2);
    /* WHY: Start/AppMenu plates used a dark 880 fallback when this token was missing. */
    --color-primary-container: --u2-color-mod(var(--base-color), 160);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 900);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 920);
    --color-secondary: --u2-color-mod(var(--base-color), 680);
    --color-on-secondary: --u2-color-mod(var(--base-color), 920);
    --color-tertiary: --u2-color-mod(var(--base-color), 700);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 920);
    --color-error: #f87171;
    --color-on-error: --u2-color-mod(var(--color-error), 920);
    --color-success: #66bb6a;
    --color-warning: #ffa726;
    --color-info: #42a5f5;
    --color-background: --u2-color-mod(var(--base-color), 940);
    --color-on-background: --u2-color-mod(var(--base-color), 100);
    --color-surface: --u2-color-mod(var(--base-color), 940);
    --color-on-surface: --u2-color-mod(var(--base-color), 100);
    --color-surface-variant: --u2-color-mod(var(--base-color), 840);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
    --color-outline: --u2-color-mod(var(--base-color), 720);
    --color-outline-variant: --u2-color-mod(var(--base-color), 640);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 920);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 940);
    --color-surface-container: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 980);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 1000);
    --color-primary-container: --u2-color-mod(var(--base-color), 820);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 100);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
  }
  :root[data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),
  :root[data-scheme=system]:not([data-theme=light]):not([data-theme=dark]) {
    color-scheme: light dark;
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
      --duration-fast: 0ms;
      --duration-normal: 0ms;
      --duration-slow: 0ms;
    }
  }
  @media (prefers-contrast: high) {
    :root {
      --color-border: var(--color-border, var(--color-outline));
      --color-border-hover: color-mix(in oklab, var(--color-border, var(--color-outline)) 80%, var(--color-on-surface, var(--color-on-surface)));
      --color-text-secondary: var(--color-on-surface, var(--color-on-surface));
      --color-text-muted: var(--color-on-surface-variant, var(--color-on-surface-variant));
    }
  }
  @media print {
    :root {
      --view-padding: 0;
      --view-content-max-width: 100%;
      --view-bg: white;
      --view-fg: black;
      --view-heading-color: black;
      --view-link-color: black;
    }
    :root:has([data-view=viewer]) {
      --view-code-bg: #f5f5f5;
      --view-code-fg: black;
      --view-blockquote-bg: #f5f5f5;
    }
  }
}
/**
 * Unified CSS Custom Property Registration System
 * 
 * This module consolidates property registration logic used across the library.
 * It provides a single source of truth for @property declarations via the
 * CSS Properties and Values API (CSS Houdini).
 * 
 * Used by:
 * - lib/core/_properties.scss (orientation, transform, layout properties)
 * - lib/basic/_typed-properties.scss (UI component properties)
 * - lib/advanced/design/ (MD3 design properties)
 */
/* stylelint-disable scss/function-no-unknown */
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
@layer components {
  ui-icon {
    --icon-color: currentColor;
    --icon-size: 1rem;
    --icon-padding: 0.125rem;
    display: inline-grid;
    place-content: center;
    place-items: center;
    color: var(--icon-color);
    aspect-ratio: 1;
  }
  ui-icon {
    vertical-align: middle;
    margin-inline-end: 0.125rem;
  }
  ui-icon:last-child {
    margin-inline-end: 0;
  }
}
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/interact/index.scss
 * Reason for changes: Curated public interaction entry-point.
 */
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
@property --client-x {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --client-y {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --page-x {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --page-y {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --sp-x {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --sp-y {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --ds-x {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --ds-y {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --rx {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --ry {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --rs-x {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --rs-y {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-shift-x {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-shift-y {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-drag-x {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-drag-y {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --bound-inline-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --bound-block-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --inline-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --block-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --initial-inline-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --initial-block-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --scroll-coef {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}
@property --scroll-size {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --content-size {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --max-size {
  syntax: "<length-percentage>";
  initial-value: 0px;
  inherits: true;
}
/* */
/* */`})))()}var L;function R(){return(R=e((()=>{L=`/*
 * FIND:veela-scss
 * TAG:veela
 * WHY: One style library. Trees: core (tokens/mixins), basic (normalize),
 * interact (via core/interact), ui (chrome; also fl.ui/styles/ui symlink).
 * Do not @forward ./ui here — vl-basic must stay a small foundation bundle.
 */
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_tokens.scss
 * Change date and time: 22.30.00_22.08.2026
 * Reason for changes: Light/dark primary-container so Start plates and chrome ink flip.
 */
/*
 * INVARIANT: This is the canonical color-token registry for the full veela bundle.
 * All color token DEFAULTS live here on \`:root, :host, :scope\`.
 * - The core entry-point owns every default; basic and theme modules consume it.
 * - Component/shell/view styles may only provide scoped semantic aliases.
 * - Component/shell/view files keep only context overrides and shadow-DOM
 *   \`var(--token, light-dark(...))\` fallbacks; they never redefine a canonical default.
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-properties.scss
 * Change date and time: 15.50.00_22.08.2026
 * Reason for changes: Seed initial-value is the desktop cyan-blue fallback (#5a9ec8).
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these (plus \`--wallpaper-*\` paper/ink);
 * surfaces derive via unregistered \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\`
 * and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a9ec8;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a9ec8;
}
@property --wallpaper-underlying-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #16161a;
}
@property --wallpaper-contrast-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #f7f7f8;
}
@property --color-secondary {
  syntax: "<color>";
  inherits: true;
  initial-value: #6b8cff;
}
@property --color-tertiary {
  syntax: "<color>";
  inherits: true;
  initial-value: #8aa0ff;
}
@property --color-error {
  syntax: "<color>";
  inherits: true;
  initial-value: #ef4444;
}
@property --color-success {
  syntax: "<color>";
  inherits: true;
  initial-value: #4caf50;
}
@property --color-warning {
  syntax: "<color>";
  inherits: true;
  initial-value: #ff9800;
}
@property --color-info {
  syntax: "<color>";
  inherits: true;
  initial-value: #2196f3;
}
/*
 * Filename: _color-mod.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-mod.scss
 * Reason for changes: Single source for the custom color modulation function.
 */
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  --i: clamp(0, var(--index), 1000);
  --pivot: 550;
  --white-distance: clamp(0, calc((var(--pivot) - var(--i)) / var(--pivot)), 1);
  --black-distance: clamp(0, calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))), 1);
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  --center-left: clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right: clamp(0, calc((1000 - var(--i)) / (1000 - var(--pivot))), 1);
  --chroma-shape: sqrt(min(var(--center-left), var(--center-right)));
  --chroma-scale: calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
/*
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * FIND:veela-layers
 * TAG:veela,style-lib
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: this is the compiled-SCSS cascade-order prelude. Component, view,
 * and shell sheets join one of these layers instead of declaring local preludes.
 * JS wrap/unwrap/order lives in \`@fest-lib/style-lib\` \`layers.ts\` (\`VEELA_CASCADE_LAYERS\`).
 */
@layer tokens, base, layout, components, utilities, theme, overrides, print;
/* ==========================================================================
    Meta / Declarations
   ========================================================================== */
/* ==========================================================================
    Tokens / Mixins (global, not layered)
   ========================================================================== */
/*
 * WHY: Pinned themes use *concrete* mod indices — not \`light-dark()\`.
 * \`light-dark()\` + mixed color-scheme (OS vs app, shadow hosts, typed @property) caused
 * Light QS tile with dark surfaces / cream panels with light-on-light labels.
 * Index scale: 0 white ← 550 seed → 1000 black. Seeds stay writable by WallpaperTheme.
 */
/** Light surfaces — always light chrome; hue from --base-color / wallpaper. */
/** Dark surfaces — always dark chrome; hue from --base-color / wallpaper. */
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a9ec8;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 40);
    --color-secondary: --u2-color-mod(var(--base-color), 420);
    --color-on-secondary: --u2-color-mod(var(--base-color), 40);
    --color-tertiary: --u2-color-mod(var(--base-color), 400);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 40);
    --color-error: #ef4444;
    --color-on-error: --u2-color-mod(var(--color-error), 40);
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: --u2-color-mod(var(--base-color), 60);
    --color-on-background: --u2-color-mod(var(--base-color), 900);
    --color-surface: --u2-color-mod(var(--base-color), 60);
    --color-on-surface: --u2-color-mod(var(--base-color), 900);
    --color-surface-variant: --u2-color-mod(var(--base-color), 160);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 700);
    --color-outline: --u2-color-mod(var(--base-color), 300);
    --color-outline-variant: --u2-color-mod(var(--base-color), 400);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 40);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 30);
    --color-surface-container: --u2-color-mod(var(--base-color), 20);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 5);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 2);
    /* WHY: Start/AppMenu plates used a dark 880 fallback when this token was missing. */
    --color-primary-container: --u2-color-mod(var(--base-color), 160);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 900);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
    --space-2xs: 0.125rem;
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 0.75rem;
    --space-lg: 1rem;
    --space-xl: 1.25rem;
    --space-2xl: 1.5rem;
    --padding-xs: var(--space-xs);
    --padding-sm: var(--space-sm);
    --padding-md: var(--space-md);
    --padding-lg: var(--space-lg);
    --padding-xl: var(--space-xl);
    --padding-2xl: var(--space-2xl);
    --padding-3xl: 2rem;
    --padding-4xl: 2.5rem;
    --padding-5xl: 3rem;
    --padding-6xl: 4rem;
    --padding-7xl: 5rem;
    --padding-8xl: 6rem;
    --padding-9xl: 8rem;
    --gap-xs: var(--space-xs);
    --gap-sm: var(--space-sm);
    --gap-md: var(--space-md);
    --gap-lg: var(--space-lg);
    --gap-xl: var(--space-xl);
    --gap-2xl: var(--space-2xl);
    --fl-ui-gap: var(--space-md);
    /*
     * Shape scale — M3 Expressive / Android 16–17 (dp≈rem at 16px).
     * extra-small 4, small 8, medium 12, large 16, extra-large 28, full pill.
     * \`--radius-sm\` stays 4dp so dense chrome does not jump.
     */
    --radius-none: 0;
    --radius-xs: 0.25rem;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.75rem;
    --radius-3xl: 2rem;
    --radius-full: 9999px;
    --fl-ui-radius: var(--radius-md);
    --border-radius: var(--radius-md);
    --shape-extra-small: var(--radius-xs);
    --shape-small: var(--radius-md);
    --shape-medium: var(--radius-lg);
    --shape-large: var(--radius-xl);
    --shape-extra-large: var(--radius-2xl);
    --shape-full: var(--radius-full);
    --elev-0: none;
    --elev-1: 0 1px 1px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
    --elev-2: 0 2px 6px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
    --elev-3: 0 6px 16px rgba(0, 0, 0, 0.14), 0 18px 48px rgba(0, 0, 0, 0.1);
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.1);
    --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow-inset-strong: inset 0 4px 8px rgba(0, 0, 0, 0.12);
    --shadow-none: 0 0 #0000;
    --text-xs: 0.8rem;
    --text-sm: 0.9rem;
    --text-base: 1rem;
    --text-lg: 1.1rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.6rem;
    --text-3xl: 2rem;
    /* COMPAT: SCSS $font-* aliases and older sheets resolve these names. */
    --font-xs: var(--text-xs);
    --font-sm: var(--text-sm);
    --font-base: var(--text-base);
    --font-md: var(--text-base);
    --font-lg: var(--text-lg);
    --font-xl: var(--text-xl);
    --font-2xl: var(--text-2xl);
    /*
     * Component foundation tokens. Keep these namespaced at root scope;
     * \`ui-icon\` maps them to its internal \`--icon-*\` variables only on
     * the component host, so a window titlebar cannot resize its content.
     */
    --ui-icon-size: 1.25rem;
    --ui-icon-padding: 0px;
    --ui-icon-tile-padding: 0.45rem;
    --ui-window-icon-size: 0.95rem;
    --ui-explorer-icon-size: 1.5rem;
    --ui-explorer-icon-track: 2rem;
    --ui-explorer-action-icon-size: 1.15rem;
    --ui-explorer-row-height: 3.25rem;
    --icon-size-sm: var(--ui-icon-size);
    --icon-size-md: var(--ui-icon-size);
    --icon-size-lg: var(--ui-explorer-icon-size);
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-family: "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    --font-family-base: var(--font-family);
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --line-height: var(--leading-normal);
    --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
    --ease-expressive: cubic-bezier(0.34, 1.25, 0.64, 1);
    --duration-fast: 140ms;
    --duration-normal: 220ms;
    --duration-slow: 360ms;
    --transition-fast: var(--duration-fast) var(--ease-emphasized);
    --transition-normal: var(--duration-normal) var(--ease-emphasized);
    --transition-slow: var(--duration-slow) var(--ease-emphasized);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --focus-ring: 0 0 0 3px color-mix(in oklab, var(--color-primary) 35%, transparent);
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
    --z-toast: 800;
    --z-max: 9999;
    --view-bg: var(--color-container);
    --view-fg: var(--color-on-surface);
    --view-border: var(--color-outline-variant);
    --view-input-bg: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 40),
        var(--color-surface-container-high)
    );
    --view-files-bg: var(--color-surface-container-low);
    --view-file-bg: var(--color-surface-container-lowest, var(--color-surface-container-low));
    --view-results-bg: var(--color-surface-container-low);
    --view-result-bg: var(--color-surface-container-lowest, var(--color-surface-container-low));
    --color-surface-elevated: var(--color-surface-container);
    --color-surface-hover: var(--color-surface-container-low);
    --color-surface-active: var(--color-surface-container-high);
    --color-on-surface-muted: var(--color-on-surface-variant);
    --color-background-alt: var(--color-surface-variant);
    --color-primary-hover: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 620),
        --u2-color-mod(var(--base-color, var(--color-primary)), 480)
    );
    --color-primary-active: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 700),
        --u2-color-mod(var(--base-color, var(--color-primary)), 400)
    );
    --color-accent: var(--color-secondary);
    --color-accent-hover: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 500),
        --u2-color-mod(var(--base-color, var(--color-primary)), 600)
    );
    --color-on-accent: var(--color-on-secondary);
    --color-border-hover: var(--color-outline-variant);
    --color-border-strong: var(--color-outline);
    --color-border-focus: var(--color-primary);
    --color-text: var(--color-on-surface);
    --color-text-secondary: var(--color-on-surface-variant);
    --color-text-muted: color-mix(in oklab, var(--color-on-surface) 50%, var(--color-surface));
    --color-text-disabled: color-mix(in oklab, var(--color-on-surface) 38%, var(--color-surface));
    --color-text-inverse: var(--color-on-primary);
    --color-link: var(--color-primary);
    --color-link-hover: var(--color-primary-hover);
    --color-success-light: --u2-color-mod(var(--color-success), 280);
    --color-success-dark: --u2-color-mod(var(--color-success), 720);
    --color-warning-light: --u2-color-mod(var(--color-warning), 280);
    --color-warning-dark: --u2-color-mod(var(--color-warning), 720);
    --color-error-light: --u2-color-mod(var(--color-error), 280);
    --color-error-dark: --u2-color-mod(var(--color-error), 720);
    --color-info-light: --u2-color-mod(var(--color-info), 280);
    --color-info-dark: --u2-color-mod(var(--color-info), 720);
    --color-bg: var(--color-surface, var(--color-surface));
    --color-bg-alt: var(--color-surface-variant, var(--color-surface-variant));
    --color-fg: var(--color-on-surface, var(--color-on-surface));
    --color-fg-muted: var(--color-on-surface-variant, var(--color-on-surface-variant));
    --touch-min: 3rem;
    --btn-height-sm: 2rem;
    --btn-height-md: var(--touch-min);
    --btn-height-lg: 3.5rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: var(--touch-min);
    --input-height-lg: 3.5rem;
    --state-opacity-hover: 0.08;
    --state-opacity-press: 0.12;
    --state-opacity-focus: 0.12;
    --state-opacity-disabled: 0.38;
    --state-opacity-drag: 0.16;
    --input-padding-x: var(--space-md);
    --input-radius: var(--radius-md);
    --input-border-color: var(--color-border, var(--color-border));
    --input-focus-ring-color: var(--color-primary);
    --input-focus-ring-width: 2px;
    --card-padding: var(--space-lg);
    --card-radius: var(--radius-lg);
    --card-shadow: var(--shadow-sm);
    --card-border-color: var(--color-border, var(--color-border));
    --modal-backdrop-bg: light-dark(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.7));
    --modal-bg: var(--color-surface, var(--color-surface));
    --modal-radius: var(--radius-xl);
    --modal-shadow: var(--shadow-xl);
    --modal-padding: 1.5rem;
    --toast-font-family: var(--font-family, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    --toast-font-size: var(--font-size-base, 1rem);
    --toast-font-weight: var(--font-weight-medium, 500);
    --toast-letter-spacing: 0.01em;
    --toast-line-height: 1.4;
    --toast-white-space: nowrap;
    --toast-pointer-events: auto;
    --toast-user-select: none;
    --toast-cursor: default;
    --toast-opacity: 0;
    --toast-transform: translateY(100%) scale(0.9);
    --toast-transition: opacity 160ms ease-out, transform 160ms cubic-bezier(0.16, 1, 0.3, 1), background-color 100ms ease;
    --toast-text: var(--color-on-surface, var(--color-on-surface, light-dark(#ffffff, #000000)));
    --toast-bg: color-mix(in oklab, var(--color-surface-elevated, var(--color-surface-container-high, var(--color-surface, light-dark(#fafbfc, #1e293b)))) 90%, var(--color-on-surface, var(--color-on-surface, light-dark(#000000, #ffffff))));
    --toast-radius: var(--radius-lg);
    --toast-shadow: var(--shadow-lg);
    --toast-padding: var(--space-lg);
    --sidebar-width: 280px;
    --sidebar-collapsed-width: 64px;
    --nav-height: 56px;
    --nav-height-compact: 48px;
    --status-height: 24px;
    --status-bg: var(--color-surface-elevated, var(--color-surface-container-high));
    --status-font-size: var(--text-xs);
    /* ── Shell chrome tokens (cross-shell registry) ─────────────────────────
     * WHY: previously scattered across minimal/immersive/faint shells with
     * duplicated \`light-dark(var(--color-*), var(--color-*))\` and offline hex
     * fallbacks. Defined once here in terms of canonical \`--color-*\` so canonical
     * is the single value source. Shells keep only theme/state overrides and
     * documented offline/SSR hex fallbacks for when veela is not loaded.
     */
    --shell-bg: var(--sv-surface-2, var(--color-surface));
    --shell-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-nav-bg: var(--sv-surface-2, var(--color-surface-container-high));
    --shell-nav-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-nav-border: var(--sv-outline-variant, var(--color-outline-variant));
    --shell-btn-hover: var(--sv-surface-2, var(--color-surface-container));
    --shell-btn-active-bg: color-mix(in oklab, var(--color-primary) 18%, var(--sv-surface-2, var(--color-surface)));
    --shell-btn-active-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-status-bg: var(--sv-surface-1, var(--color-surface-container-low));
    --shell-status-fg: var(--sv-on-surface, var(--color-on-surface));
    /* ── Faint shell tokens (subsystem boot shells) ───────────────────────
     * Derived from canonical \`--color-*\`; previously duplicated as
     * \`light-dark(var(--color-*), var(--color-*))\` in \`subsystem/boot/shells.scss\`.
     */
    --faint-nav-bg: var(--color-surface-container-high);
    --faint-nav-border: var(--color-outline-variant);
    --faint-sidebar-bg: var(--color-surface-container-high);
    /* ── Environment-shell tokens (color subset) ──────────────────────────
     * \`--env-status-fg\` follows window chrome. \`--env-launcher-fg*\` aliases
     * \`--wallpaper-contrast-color\` / paper (WallpaperTheme + statusbar luma).
     * Non-color \`--env-*\` (z-index, safe-area, insets) stay in environment-shell.
     */
    --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
    --env-status-fg-muted: color-mix(in oklab, var(--env-status-fg) 78%, transparent);
    --env-launcher-fg: var(--wallpaper-contrast-color);
    --env-launcher-fg-shadow: color-mix(in oklab, var(--wallpaper-underlying-color) 88%, transparent);
    --env-launcher-fg-glow: color-mix(in oklab, var(--wallpaper-underlying-color) 48%, transparent);
    /* ── fl.ui \`--error-color\` alias ────────────────────────────────────
     * Canonical alias so fl.ui/components can consume \`var(--error-color)\`
     * without a standalone fallback definition.
     */
    --error-color: var(--color-error, #f87171);
    /* ── Settings-view semantic tokens (\`--sv-*\`) ──────────────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\` / \`--base-color\`.
     * Source of truth for the default relationships lives here; settings-view keeps
     * only theme-pinned overrides (\`html[data-theme]\`) and shadow-DOM self-sufficiency
     * fallbacks at use sites (\`var(--sv-*, light-dark(...))\`).
     */
    --sv-bg: var(--sv-surface-2, var(--color-surface-container-low, light-dark(#eef1f6, #0f1318)));
    --sv-fg: var(--sv-on-surface, var(--color-on-surface, light-dark(#12151a, #e8edf2)));
    --sv-muted: var(--sv-on-surface-variant, var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc)));
    --sv-outline: var(--sv-outline-variant, var(--color-outline-variant, light-dark(#c5cdd8, #3d4755)));
    --sv-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #171c24));
    --sv-surface-2: var(--color-surface-container, light-dark(#f4f6fa, #1c232d));
    --sv-primary: var(--base-color, var(--color-primary, #5a9ec8));
    --sv-danger: var(--color-error, #d32f2f);
    /* ── History-view semantic tokens (\`--vh-*\`) ──────────────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\`.
     * Source of truth for the default relationships lives here; history-view keeps
     * only the complex derived tokens (\`--vh-item-border/preview-bg/elev\`) and
     * shadow-DOM self-sufficiency fallbacks at use sites.
     */
    --vh-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));
    --vh-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --vh-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --vh-primary: var(--color-primary, #007acc);
    --vh-danger: var(--color-error, #d32f2f);
    --vh-on-primary: var(--color-on-primary, #ffffff);
    --vh-item-bg: var(--color-surface-container-low, light-dark(#e0e5ee, #0a0d12));
    /* ── Explorer / shared view color tokens (\`--view-*\`) ────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\`.
     * Source of truth for the default relationships lives here; explorer-view keeps
     * only \`--explorer-*\` non-color (radius/pad/font) and shadow-DOM self-sufficiency
     * fallbacks at use sites. Shared \`--view-*\` namespace also consumed by markdown-view.
     */
    --view-border: color-mix(in oklab, var(--color-outline-variant, #888) 45%, transparent);
    --view-fg-muted: color-mix(in oklab, var(--color-on-surface, #ccc) 72%, transparent);
    --view-hover-bg: color-mix(in oklab, var(--color-primary, #3794ff) 12%, transparent);
    --view-selected-bg: color-mix(in oklab, var(--color-primary, #3794ff) 18%, transparent);
    --view-selected-border: var(--color-primary, #3794ff);
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
      --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
      --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
      --wf-md-primary: var(--color-primary);
      --wf-md-seed: var(--base-color);
      --color-on-primary: --u2-color-mod(var(--base-color), 920);
      --color-secondary: --u2-color-mod(var(--base-color), 680);
      --color-on-secondary: --u2-color-mod(var(--base-color), 920);
      --color-tertiary: --u2-color-mod(var(--base-color), 700);
      --color-on-tertiary: --u2-color-mod(var(--base-color), 920);
      --color-error: #f87171;
      --color-on-error: --u2-color-mod(var(--color-error), 920);
      --color-success: #66bb6a;
      --color-warning: #ffa726;
      --color-info: #42a5f5;
      --color-background: --u2-color-mod(var(--base-color), 940);
      --color-on-background: --u2-color-mod(var(--base-color), 100);
      --color-surface: --u2-color-mod(var(--base-color), 940);
      --color-on-surface: --u2-color-mod(var(--base-color), 100);
      --color-surface-variant: --u2-color-mod(var(--base-color), 840);
      --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
      --color-outline: --u2-color-mod(var(--base-color), 720);
      --color-outline-variant: --u2-color-mod(var(--base-color), 640);
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 920);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 940);
      --color-surface-container: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 980);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 1000);
      --color-primary-container: --u2-color-mod(var(--base-color), 820);
      --color-on-primary-container: --u2-color-mod(var(--base-color), 100);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --surface-color: var(--color-surface);
      --fl-surface: var(--color-surface);
      --fl-on-surface: var(--color-on-surface);
      --fl-primary: var(--color-primary);
      --fl-on-primary: var(--color-on-primary);
      --fl-secondary: var(--color-secondary);
      --fl-on-secondary: var(--color-on-secondary);
      --fl-shadow-xl: var(--shadow-xl);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
      --md3-primary-container: var(--color-primary-container);
      --md-primary-container: var(--color-primary-container);
    }
  }
  /*
   * Pinned app theme — highest authority. Concrete surfaces so shadow/UI never mix
   * OS color-scheme with app light (Settings cream + white labels).
   */
  :root[data-theme=light],
  :host[data-theme=light],
  [data-theme=light] {
    color-scheme: light only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 40);
    --color-secondary: --u2-color-mod(var(--base-color), 420);
    --color-on-secondary: --u2-color-mod(var(--base-color), 40);
    --color-tertiary: --u2-color-mod(var(--base-color), 400);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 40);
    --color-error: #ef4444;
    --color-on-error: --u2-color-mod(var(--color-error), 40);
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: --u2-color-mod(var(--base-color), 60);
    --color-on-background: --u2-color-mod(var(--base-color), 900);
    --color-surface: --u2-color-mod(var(--base-color), 60);
    --color-on-surface: --u2-color-mod(var(--base-color), 900);
    --color-surface-variant: --u2-color-mod(var(--base-color), 160);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 700);
    --color-outline: --u2-color-mod(var(--base-color), 300);
    --color-outline-variant: --u2-color-mod(var(--base-color), 400);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 40);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 30);
    --color-surface-container: --u2-color-mod(var(--base-color), 20);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 5);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 2);
    /* WHY: Start/AppMenu plates used a dark 880 fallback when this token was missing. */
    --color-primary-container: --u2-color-mod(var(--base-color), 160);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 900);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 920);
    --color-secondary: --u2-color-mod(var(--base-color), 680);
    --color-on-secondary: --u2-color-mod(var(--base-color), 920);
    --color-tertiary: --u2-color-mod(var(--base-color), 700);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 920);
    --color-error: #f87171;
    --color-on-error: --u2-color-mod(var(--color-error), 920);
    --color-success: #66bb6a;
    --color-warning: #ffa726;
    --color-info: #42a5f5;
    --color-background: --u2-color-mod(var(--base-color), 940);
    --color-on-background: --u2-color-mod(var(--base-color), 100);
    --color-surface: --u2-color-mod(var(--base-color), 940);
    --color-on-surface: --u2-color-mod(var(--base-color), 100);
    --color-surface-variant: --u2-color-mod(var(--base-color), 840);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
    --color-outline: --u2-color-mod(var(--base-color), 720);
    --color-outline-variant: --u2-color-mod(var(--base-color), 640);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 920);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 940);
    --color-surface-container: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 980);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 1000);
    --color-primary-container: --u2-color-mod(var(--base-color), 820);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 100);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
  }
  :root[data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),
  :root[data-scheme=system]:not([data-theme=light]):not([data-theme=dark]) {
    color-scheme: light dark;
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
      --duration-fast: 0ms;
      --duration-normal: 0ms;
      --duration-slow: 0ms;
    }
  }
  @media (prefers-contrast: high) {
    :root {
      --color-border: var(--color-border, var(--color-outline));
      --color-border-hover: color-mix(in oklab, var(--color-border, var(--color-outline)) 80%, var(--color-on-surface, var(--color-on-surface)));
      --color-text-secondary: var(--color-on-surface, var(--color-on-surface));
      --color-text-muted: var(--color-on-surface-variant, var(--color-on-surface-variant));
    }
  }
  @media print {
    :root {
      --view-padding: 0;
      --view-content-max-width: 100%;
      --view-bg: white;
      --view-fg: black;
      --view-heading-color: black;
      --view-link-color: black;
    }
    :root:has([data-view=viewer]) {
      --view-code-bg: #f5f5f5;
      --view-code-fg: black;
      --view-blockquote-bg: #f5f5f5;
    }
  }
}
/**
 * Unified CSS Custom Property Registration System
 * 
 * This module consolidates property registration logic used across the library.
 * It provides a single source of truth for @property declarations via the
 * CSS Properties and Values API (CSS Houdini).
 * 
 * Used by:
 * - lib/core/_properties.scss (orientation, transform, layout properties)
 * - lib/basic/_typed-properties.scss (UI component properties)
 * - lib/advanced/design/ (MD3 design properties)
 */
/* stylelint-disable scss/function-no-unknown */
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
@layer components {
  ui-icon {
    --icon-color: currentColor;
    --icon-size: 1rem;
    --icon-padding: 0.125rem;
    display: inline-grid;
    place-content: center;
    place-items: center;
    color: var(--icon-color);
    aspect-ratio: 1;
  }
  ui-icon {
    vertical-align: middle;
    margin-inline-end: 0.125rem;
  }
  ui-icon:last-child {
    margin-inline-end: 0;
  }
}
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/interact/index.scss
 * Reason for changes: Curated public interaction entry-point.
 */
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/core/index.scss
 * Reason for changes: Flatten the core SCSS surface behind one canonical entry.
 */
@property --client-x {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --client-y {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --page-x {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --page-y {
  initial-value: 0;
  syntax: "<number>";
  inherits: true;
}
@property --sp-x {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --sp-y {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --ds-x {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --ds-y {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --rx {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --ry {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --rs-x {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --rs-y {
  initial-value: 0px;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-shift-x {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-shift-y {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-drag-x {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --limit-drag-y {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --bound-inline-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --bound-block-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --inline-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --block-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --initial-inline-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --initial-block-size {
  initial-value: 100%;
  syntax: "<length-percentage>";
  inherits: true;
}
@property --scroll-coef {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}
@property --scroll-size {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --content-size {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --max-size {
  syntax: "<length-percentage>";
  initial-value: 0px;
  inherits: true;
}
/* */
/* */
/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/index.scss
 * Reason for changes: Flatten base styles and remove the legacy misc facade.
 */
/*
 * Filename: _normalize.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/_normalize.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: Basic consumes the canonical core token emitter.
 */
/**
 * Veela CSS - Core Shared Utilities
 *
 * Reusable mixins, placeholders, and common patterns for core layout styles.
 * Reduces duplication across normalize, states, layout, and gridbox modules.
 */
/* ========================================================================
   Meta-level: Placeholders for zero-specificity selector groups
   ======================================================================== */
/**
 * Reset border and outline styles (transparent, none, 0px)
 * Use: @extend %reset-borders; or include in selectors
 */
/**
 * Disable user interaction (pointer-events, touch-action, user-select)
 * Use: @extend %disable-interaction;
 */
/**
 * Lock interaction (pointer-events: none + touch + select disabled)
 * Stronger version with explicit !important for state overrides
 */
/**
 * Basic box-model reset: margin, padding, box-sizing
 */
/* ========================================================================
   Mixins: Common property/style groups
   ======================================================================== */
/**
 * Reset box model (margin, padding, sizing)
 * @usage: @include reset-box-model();
 */
/**
 * Reset borders and outlines
 * @usage: @include reset-borders();
 */
/**
 * Disable interaction via pointer-events, touch-action, user-select
 * @param $importance [false] - if true, use !important
 * @usage: @include disable-interaction(); or @include disable-interaction(true);
 */
/**
 * Reset form element appearance (font, line-height, margin, text-transform)
 * @usage: @include reset-form-appearance();
 */
/**
 * Scrollbar styling for webkit browsers
 * @param $size [8px] - scrollbar width/height
 * @param $color [var(--color-scrollbar, currentColor)] - thumb color
 * @param $radius [var(--border-radius, 4px)] - thumb border-radius
 * @usage: @include scrollbar-webkit(8px, var(--color-scrollbar));
 */
/**
 * Scrollbar styling (both webkit and Firefox)
 * @param $color [var(--color-scrollbar, currentColor)] - scrollbar color
 * @usage: @include scrollbar-styling(var(--color-scrollbar));
 */
/**
 * Flex row layout with space-between and wrap
 * Used for nav-like layouts
 * @usage: @include flex-row-wrap();
 */
/**
 * Flex column centered (used for labels, stacked content)
 * @usage: @include flex-column-center();
 */
/**
 * Stretch to viewport size (used for root/body containers)
 * Combines inline-size, block-size with min/max constraints
 * @usage: @include stretch-viewport();
 */
/**
 * Hidden state: display none + pointer/touch disabled
 * @param $opacity [false] - if true, also apply opacity: 0
 * @usage: @include hidden-state(); or @include hidden-state(true);
 */
/**
 * Prevent dragging of element
 * @usage: @include no-drag();
 */
/**
 * Focus ring without outline (M3-style)
 * @param $color [var(--color-primary, #5a7fff)] - focus color
 * @param $radius [var(--radius-sm)] - border radius
 * @usage: @include focus-ring(var(--color-primary));
 */
/**
 * Media element sizing (img, video, canvas, svg)
 * @usage: @include media-sizing();
 */
/**
 * Code element font and sizing
 * @param $font [var(--font-family-mono, 'SF Mono', 'Monaco', 'Roboto Mono', monospace)] - monospace font
 * @usage: @include code-styling();
 */
@layer base {
  @keyframes bottom-to-top {
    0% {
      opacity: 0;
      transform: translateY(10%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media screen {
    *,
    *::before,
    *::after {
      /*margin: 0;
      padding: 0;*/
      box-sizing: border-box;
      box-sizing: border-box;
      dynamic-range-limit: no-limit;
    }
    :where(html) {
      -webkit-text-size-adjust: 100%;
      tab-size: 4;
      font-size-adjust: from-font;
      font-optical-sizing: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-family: var(--font-sans);
      font-size: 16px;
      line-height: 1.5;
      dynamic-range-limit: no-limit;
      background: none;
      background-color: transparent;
      border: none 0px transparent;
      outline: none 0px transparent;
    }
    :where(body) {
      inset: 0;
      margin: 0;
      padding: 0;
      border: none;
      min-block-size: min(var(--lv-height, 100lvb), 100cqb);
      block-size: fit-content;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: var(--line-height);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      dynamic-range-limit: no-limit;
      background: none;
      background-color: transparent;
      border: none 0px transparent;
      outline: none 0px transparent;
    }
    :where(ul, ol) {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    :where(blockquote, q) {
      quotes: none;
    }
    :where(blockquote, q)::before, :where(blockquote, q)::after {
      content: "";
      content: none;
    }
    :where(article, main, aside, section, header, footer, nav) {
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
    }
    :where(table) {
      border-collapse: collapse;
      border-spacing: 0;
      display: block;
      overflow-x: auto;
      inline-size: max-content;
      max-inline-size: 100%;
      margin-block: 1rem;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
    }
    :where(table) :where(th, td) {
      padding: 0.5rem 1rem;
      border-block-end: 1px solid var(--color-border);
      text-align: start;
    }
    :where(table) :where(th) {
      background-color: var(--color-table);
      color: var(--color-text);
      font-weight: bold;
    }
    :where(table) :where(tr:last-child td) {
      border-block-end: none;
    }
    :where(table) :where(tr:nth-child(even)) {
      background-color: var(--color-bg-secondary);
    }
    :focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary, #5a7fff) 35%, transparent);
      border-radius: var(--radius-sm);
    }
    :focus:not(:focus-visible) {
      outline: none;
    }
    :where(button, input, optgroup, select, textarea) {
      font: inherit;
      color: inherit;
      letter-spacing: inherit;
      margin: 0;
      border: none;
      outline: none;
      line-height: 1.15;
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
    }
    :where(button) {
      min-block-size: fit-content;
      min-inline-size: fit-content;
      padding-inline: 1rem;
      padding-block: 0.5rem;
      gap: 0.25rem;
      text-transform: none;
      user-select: none;
      pointer-events: auto;
      cursor: pointer;
      appearance: none;
      border: none;
      background: transparent;
    }
    :where(button):has(> ui-icon:only-child) {
      place-content: center;
      place-items: center;
      aspect-ratio: 1/1;
    }
    :where(button):disabled {
      pointer-events: none;
      cursor: not-allowed;
    }
    :where(select) {
      text-transform: none;
    }
    :where(button, [type=button], [type=reset], [type=submit]) {
      -webkit-appearance: button;
      cursor: pointer;
    }
    :where(button, [type=button], [type=reset], [type=submit])::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }
    :where(fieldset, dialog) {
      border: none;
      padding: 0;
      margin: 0;
    }
    :where(legend) {
      padding: 0;
    }
    :where(progress) {
      vertical-align: baseline;
    }
    :where(textarea) {
      overflow: auto;
      resize: vertical;
    }
    :where([type=search]) {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }
    :where([type=search])::-webkit-search-decoration {
      -webkit-appearance: none;
    }
    :where([type=range]) {
      -webkit-appearance: none;
    }
    :where(details > summary),
    :where(summary) {
      cursor: pointer;
    }
    :where(mark) {
      background-color: transparent;
      color: inherit;
    }
    :where(sub, sup) {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }
    :where(sup) {
      top: -0.5em;
    }
    :where(sub) {
      bottom: -0.25em;
    }
    :where(a) {
      color: var(--color-link, inherit);
      text-decoration: inherit;
      text-underline-offset: 0.2em;
      pointer-events: auto;
      cursor: pointer;
      transition: color var(--transition-fast);
    }
    :where(a):hover {
      color: var(--color-primary-hover);
    }
    :where(img, canvas, svg, video, iframe, picture) {
      max-inline-size: 100%;
      block-size: auto;
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
      dynamic-range-limit: no-limit;
    }
    :where(img, video, canvas, svg, picture) {
      display: block;
      max-inline-size: 100%;
      block-size: auto;
    }
    :where(img, video) {
      object-fit: contain;
      object-position: center;
    }
    :where(picture) {
      display: contents;
    }
    :where(iframe) {
      max-inline-size: 100%;
      block-size: auto;
    }
    :where(em, i) {
      font-style: normal;
    }
    :where(strong, b) {
      font-weight: normal;
    }
    :where(code, kbd, samp, pre) {
      font-family: var(--font-family-mono, "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace);
      font-size: 1em;
    }
    :where(code, pre) {
      font-family: var(--font-mono);
      font-size: 0.875em;
    }
    :where(code, samp, kbd) {
      font-family: var(--font-family-mono, "SF Mono", "Monaco", "Roboto Mono", monospace);
      background-color: var(--bgColor-muted);
      border-radius: 0.3em;
      padding: 0.2em 0.4em;
      font-size: 85%;
    }
    :where(code) {
      background: var(--color-bg-alt);
      padding: 0.125em 0.25em;
      border-radius: var(--radius-sm);
    }
    :where(pre) {
      background: var(--color-bg-alt);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      overflow-x: auto;
    }
    :where(pre) :where(code) {
      background: transparent;
      padding: 0;
      border-radius: 0;
    }
    :where(input, textarea, select, button, option) {
      border: none 0px transparent;
      outline: none 0px transparent;
      accent-color: var(--color-link, currentColor);
      font-variant-emoji: text;
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
    }
    :where(span) {
      font-variant-emoji: text;
    }
    :where(hr) {
      border: none;
      border-block-start: 1px solid var(--color-border);
      margin-block: var(--space-lg);
    }
    ::-webkit-scrollbar {
      inline-size: 8px;
      block-size: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--color-outline-variant, #d1d5db);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-outline, #9ca3af);
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--color-outline-variant, #d1d5db) transparent;
    }
    :where(input, textarea, select) {
      inline-size: 100%;
      padding: 0.5rem;
      font-size: var(--font-size-base);
      background-color: var(--color-bg-alt);
      color: var(--color-fg);
      border: 0px solid var(--color-border);
      border-radius: var(--border-radius);
    }
    :where(input, textarea, select):focus {
      outline: none;
      border-color: var(--color-primary);
    }
    :where(input, textarea, select)::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.7;
    }
    :where(input, textarea, select):disabled {
      background-color: var(--color-bg-secondary);
      cursor: not-allowed;
      opacity: 0.5;
    }
    :where(input):-webkit-autofill::first-line, :where(input):autofill::first-line {
      font-size: 1em;
      text-size-adjust: 100%;
    }
    :where(input):-internal-autofill-previewed {
      letter-spacing: calc(1em / 10) !important;
    }
    :where(input):is([type=radio], [type=checkbox]) {
      inline-size: 1rem;
      block-size: 1rem;
      accent-color: var(--color-primary);
      aspect-ratio: 1/1;
    }
    :where(label) {
      font-weight: 600;
      user-select: none;
      pointer-events: none;
      margin-block-end: 0.25rem;
    }
    :where(h1, h2, h3, h4, h5, h6) {
      font-weight: 600;
      line-height: 1.2;
      margin-block: 0.5em;
      text-wrap: balance;
    }
    :where(h1) {
      font-size: 2rem;
    }
    :where(h2) {
      font-size: 1.5rem;
    }
    :where(h3) {
      font-size: 1.25rem;
    }
    :where(h4) {
      font-size: 1.125rem;
    }
    :where(h5) {
      font-size: 1rem;
    }
    :where(h6) {
      font-size: 0.875rem;
    }
    :where(p) {
      text-wrap: pretty;
      margin-block: 1em;
    }
    :where(article, .content) ul,
    :where(article, .content) ol {
      margin-block: var(--space-md);
      padding-inline-start: var(--space-lg);
    }
    :where(article, .content) ul {
      list-style: disc;
    }
    :where(article, .content) ol {
      list-style: decimal;
    }
    :where(blockquote) {
      margin-inline: 1rem;
      padding-inline: 1rem;
      border-inline-start: 0.25rem solid var(--color-secondary);
      color: var(--color-text-secondary);
      font-style: italic;
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable) {
      scrollbar-width: thin;
      scrollbar-color: var(--color-scrollbar, currentColor) transparent;
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar {
      inline-size: var(--scrollbar-size, 8px);
      block-size: var(--scrollbar-size, 8px);
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar-track {
      background: transparent;
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar-thumb {
      background-color: var(--color-scrollbar, currentColor);
      border-radius: var(--border-radius, 4px);
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar-thumb:hover {
      background: var(--color-outline, #9ca3af);
    }
    :where(link, head, script, style, meta),
    [hidden] {
      display: none !important;
    }
    /*:not(:defined) {
        opacity: 0;
        visibility: collapse;
        pointer-events: none;
    }*/
    :where(link, head, script, style, meta) {
      pointer-events: none !important;
    }
    [aria-hidden=true] {
      visibility: collapse;
      pointer-events: none;
      opacity: 0;
    }
    [data-dragging] {
      will-change: transform;
      cursor: grabbing;
    }
    :where(a, button, [role=button]) {
      -webkit-tap-highlight-color: transparent;
    }
  }
  @media screen and (prefers-reduced-motion: reduce) {
    *,
    *::after,
    *::before {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
@layer layout {
  @media screen {
    :where(footer, header, main) {
      margin-inline: auto;
      padding: 0;
    }
    :where(header) {
      text-align: center;
    }
    :where(nav) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-block-end: 0;
    }
    :where(nav) ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 1rem;
      margin: 0;
    }
    :where(nav) ul li {
      position: relative;
    }
    :where(nav) a {
      font-weight: bold;
      color: var(--color-link);
      text-decoration: none;
    }
    :where(section) {
      display: flex;
      flex-wrap: wrap;
      justify-content: var(--justify-important, center);
      gap: 1rem;
    }
    :where(section) :where(aside) {
      border: 1px solid var(--color-bg-secondary);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: 1.25rem;
      inline-size: var(--width-card);
      flex: 1 1 var(--width-card);
    }
  }
}
@layer components {
  @media screen {
    :where(dialog) {
      margin: auto;
      padding: 1rem;
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      max-inline-size: min(90vw, 600px);
      max-block-size: 85vh;
    }
    :where(dialog)::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
    :where(dialog)[open] {
      animation: bottom-to-top 0.25s ease-out;
    }
    :where(button, input[type=submit], input[type=button]) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-link);
      border: 0px solid transparent;
      border-radius: var(--border-radius);
      padding: 0.5rem 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: filter 0.2s ease, transform 0.1s ease;
    }
    :where(button, input[type=submit], input[type=button]):disabled {
      opacity: 0.6;
      cursor: not-allowed;
      filter: none;
      background-color: var(--color-secondary);
    }
    :where(canvas):is([is=ui-canvas]) {
      position: fixed;
      inset: 0;
      inset-block-end: auto;
      pointer-events: none;
      z-index: 0;
      padding: 0;
      margin: 0;
      max-inline-size: max(100%, min(100cqi, 100lvi)) !important;
      max-block-size: max(100%, min(100cqb, 100lvb)) !important;
      max-inline-size: max(100%, min(100cqi, 100lvi)) !important;
      max-block-size: max(100%, min(100cqb, 100lvb)) !important;
      box-sizing: border-box !important;
      background-color: transparent !important;
      border: none 0px transparent !important;
      outline: none 0px transparent !important;
      min-inline-size: 0;
      min-block-size: 0;
      object-fit: cover;
      object-position: center;
    }
  }
}
@layer overrides {
  @media screen {
    [data-scheme=dark],
    [data-theme=dark] {
      color-scheme: dark only;
    }
    [data-scheme=dark] *,
    [data-theme=dark] * {
      color-scheme: dark;
    }
    [data-scheme=light],
    [data-theme=light] {
      color-scheme: light only;
    }
    [data-scheme=light] *,
    [data-theme=light] * {
      color-scheme: light;
    }
    [data-scheme=system],
    [data-theme=system] {
      color-scheme: light dark;
    }
    /* Scheme Overrides — align with Theme.ts data-scheme / data-theme */
    [data-scheme=dark], [data-theme=dark] {
      color-scheme: dark only;
    }
    [data-scheme=dark] *, [data-theme=dark] * {
      color-scheme: dark;
    }
    [data-scheme=light], [data-theme=light] {
      color-scheme: light only;
    }
    [data-scheme=light] *, [data-theme=light] * {
      color-scheme: light;
    }
    /*
     * WHY: When QS/Theme pins data-theme=light|dark, do NOT let stale data-scheme=auto
     * win (same specificity, later rule used to force \`light dark\` and keep OS dark).
     */
    [data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),
    [data-theme=auto],
    [data-scheme=system]:not([data-theme=light]):not([data-theme=dark]),
    [data-theme=system] {
      color-scheme: light dark;
    }
  }
}
@layer layout {
  @media screen {
    :root, :host, :scope, :where(body) {
      pointer-events: auto;
      transition-behavior: allow-discrete;
      interpolate-size: allow-keywords;
      content-visibility: auto;
      --keyboard-inset-bottom: calc(max(env(keyboard-inset-bottom, 0px), 0px) / max(var(--zoom, 1), 0.125));
      --keyboard-inset-height: calc(max(env(keyboard-inset-height, 0px), 0px) / max(var(--zoom, 1), 0.125));
    }
    :root, :scope, :host {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :root :where(*), :scope, :scope :where(*), :host, :host :where(*) {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :where(html) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      background-color: transparent;
      container-type: size;
      container-name: html root;
      contain: none;
      overflow: visible;
      position: fixed;
      inset: 0px;
      inset-block-end: auto;
      min-inline-size: min(100cqi, 100dvi);
      min-block-size: min(100cqb, var(--lv-height, 100lvb));
      inline-size: stretch;
      block-size: var(--lv-height, 100lvb);
      max-inline-size: min(100%, min(100cqi, 100dvi)) !important;
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb))) !important;
      place-content: start;
      place-items: start;
      place-self: start;
      line-height: normal;
      flex-direction: column;
      display: flex;
    }
    :where(body) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      font-size: var(--text-base, 0.9rem);
      overflow: visible;
      position: relative;
      pointer-events: auto;
      inset: auto;
      display: inline flex;
      place-content: start;
      place-items: start;
      place-self: start;
      background-color: transparent;
      container-name: body;
      container-type: size;
      contain: strict;
      min-inline-size: 0px;
      min-block-size: 0px;
      inline-size: stretch;
      block-size: stretch;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :where(body) > :where(#app, #container, #root, .root) {
      inline-size: stretch;
      block-size: stretch;
      min-inline-size: 0px;
      min-block-size: 0px;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
      background-color: transparent;
      border: none 0px transparent;
      outline: none 0px transparent;
    }
    :where(body) > :where(*) {
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :root, :host, :scope, :where(body) {
      pointer-events: auto;
      transition-behavior: allow-discrete;
      interpolate-size: allow-keywords;
      content-visibility: auto;
      --keyboard-inset-bottom: calc(max(env(keyboard-inset-bottom, 0px), 0px) / max(var(--zoom, 1), 0.125));
      --keyboard-inset-height: calc(max(env(keyboard-inset-height, 0px), 0px) / max(var(--zoom, 1), 0.125));
    }
    :root, :scope, :host {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :root :where(*), :scope, :scope :where(*), :host, :host :where(*) {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :where(html) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      background-color: transparent;
      container-type: size;
      container-name: html root;
      contain: none;
      overflow: visible;
      position: fixed;
      inset: 0px;
      inset-block-end: auto;
      min-inline-size: min(100cqi, 100dvi);
      min-block-size: min(100cqb, var(--lv-height, 100lvb));
      inline-size: stretch;
      block-size: var(--lv-height, 100lvb);
      max-inline-size: min(100%, min(100cqi, 100dvi)) !important;
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb))) !important;
      place-content: start;
      place-items: start;
      place-self: start;
      line-height: normal;
      flex-direction: column;
      display: flex;
    }
    :where(body) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      font-size: var(--text-base, 0.9rem);
      overflow: visible;
      position: relative;
      pointer-events: auto;
      inset: auto;
      display: inline flex;
      place-content: start;
      place-items: start;
      place-self: start;
      background-color: transparent;
      container-name: body;
      container-type: size;
      contain: strict;
      min-inline-size: 0px;
      min-block-size: 0px;
      inline-size: stretch;
      block-size: stretch;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :where(body) > :where(#app, #container, #root, .root) {
      inline-size: stretch;
      block-size: stretch;
      min-inline-size: 0px;
      min-block-size: 0px;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :where(body) > :where(*) {
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
  }
}
/*
 * Filename: _normalize.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/_normalize.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: Basic consumes the canonical core token emitter.
 */
/*
 * Filename: _normalize.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/_normalize.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: Basic consumes the canonical core token emitter.
 */
@layer base {
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
  }
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
  }
}
@layer base {
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
}
@layer utilities {
  .m-0 {
    margin: 0;
  }
  .mb-0 {
    margin-block: 0;
  }
  .mi-0 {
    margin-inline: 0;
  }
  .p-0 {
    padding: 0;
  }
  .pb-0 {
    padding-block: 0;
  }
  .pi-0 {
    padding-inline: 0;
  }
  .gap-0 {
    gap: 0;
  }
  .inset-0 {
    inset: 0;
  }
  .m-xs {
    margin: 0.25rem;
  }
  .mb-xs {
    margin-block: 0.25rem;
  }
  .mi-xs {
    margin-inline: 0.25rem;
  }
  .p-xs {
    padding: 0.25rem;
  }
  .pb-xs {
    padding-block: 0.25rem;
  }
  .pi-xs {
    padding-inline: 0.25rem;
  }
  .gap-xs {
    gap: 0.25rem;
  }
  .inset-xs {
    inset: 0.25rem;
  }
  .m-sm {
    margin: 0.5rem;
  }
  .mb-sm {
    margin-block: 0.5rem;
  }
  .mi-sm {
    margin-inline: 0.5rem;
  }
  .p-sm {
    padding: 0.5rem;
  }
  .pb-sm {
    padding-block: 0.5rem;
  }
  .pi-sm {
    padding-inline: 0.5rem;
  }
  .gap-sm {
    gap: 0.5rem;
  }
  .inset-sm {
    inset: 0.5rem;
  }
  .m-md {
    margin: 0.75rem;
  }
  .mb-md {
    margin-block: 0.75rem;
  }
  .mi-md {
    margin-inline: 0.75rem;
  }
  .p-md {
    padding: 0.75rem;
  }
  .pb-md {
    padding-block: 0.75rem;
  }
  .pi-md {
    padding-inline: 0.75rem;
  }
  .gap-md {
    gap: 0.75rem;
  }
  .inset-md {
    inset: 0.75rem;
  }
  .m-lg {
    margin: 1rem;
  }
  .mb-lg {
    margin-block: 1rem;
  }
  .mi-lg {
    margin-inline: 1rem;
  }
  .p-lg {
    padding: 1rem;
  }
  .pb-lg {
    padding-block: 1rem;
  }
  .pi-lg {
    padding-inline: 1rem;
  }
  .gap-lg {
    gap: 1rem;
  }
  .inset-lg {
    inset: 1rem;
  }
  .m-xl {
    margin: 1.25rem;
  }
  .mb-xl {
    margin-block: 1.25rem;
  }
  .mi-xl {
    margin-inline: 1.25rem;
  }
  .p-xl {
    padding: 1.25rem;
  }
  .pb-xl {
    padding-block: 1.25rem;
  }
  .pi-xl {
    padding-inline: 1.25rem;
  }
  .gap-xl {
    gap: 1.25rem;
  }
  .inset-xl {
    inset: 1.25rem;
  }
  .m-2xl {
    margin: 1.5rem;
  }
  .mb-2xl {
    margin-block: 1.5rem;
  }
  .mi-2xl {
    margin-inline: 1.5rem;
  }
  .p-2xl {
    padding: 1.5rem;
  }
  .pb-2xl {
    padding-block: 1.5rem;
  }
  .pi-2xl {
    padding-inline: 1.5rem;
  }
  .gap-2xl {
    gap: 1.5rem;
  }
  .inset-2xl {
    inset: 1.5rem;
  }
  .m-3xl {
    margin: 2rem;
  }
  .mb-3xl {
    margin-block: 2rem;
  }
  .mi-3xl {
    margin-inline: 2rem;
  }
  .p-3xl {
    padding: 2rem;
  }
  .pb-3xl {
    padding-block: 2rem;
  }
  .pi-3xl {
    padding-inline: 2rem;
  }
  .gap-3xl {
    gap: 2rem;
  }
  .inset-3xl {
    inset: 2rem;
  }
  .text-xs {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-sm {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-base {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-lg {
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-xl {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-2xl {
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .font-thin {
    font-weight: 100;
  }
  .font-light {
    font-weight: 300;
  }
  .font-normal {
    font-weight: 400;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-bold {
    font-weight: 700;
  }
  .text-start {
    text-align: start;
  }
  .text-center {
    text-align: center;
  }
  .text-end {
    text-align: end;
  }
  .text-primary {
    color: #1e293b, #f1f5f9;
  }
  .text-secondary {
    color: #64748b, #94a3b8;
  }
  .text-muted {
    color: #94a3b8, #64748b;
  }
  .text-disabled {
    color: #cbd5e1, #475569;
  }
  .block,
  .vu-block {
    display: block;
  }
  .inline,
  .vu-inline {
    display: inline;
  }
  .inline-block {
    display: inline-block;
  }
  .flex,
  .vu-flex {
    display: flex;
  }
  .inline-flex {
    display: inline-flex;
  }
  .grid,
  .vu-grid {
    display: grid;
  }
  .hidden,
  .vu-hidden {
    display: none;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .flex-nowrap {
    flex-wrap: nowrap;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-center {
    align-items: center;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-around {
    justify-content: space-around;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .h-auto,
  .block-size-auto {
    block-size: auto;
  }
  .h-full,
  .block-size-full {
    block-size: 100%;
  }
  .h-screen {
    block-size: 100vh;
  }
  .w-auto,
  .inline-size-auto {
    inline-size: auto;
  }
  .w-full,
  .inline-size-full {
    inline-size: 100%;
  }
  .w-screen {
    inline-size: 100vw;
  }
  .min-h-0,
  .min-block-size-0 {
    min-block-size: 0;
  }
  .min-w-0,
  .min-inline-size-0 {
    min-inline-size: 0;
  }
  .max-h-full,
  .max-block-size-full {
    max-block-size: 100%;
  }
  .max-w-full,
  .max-inline-size-full {
    max-inline-size: 100%;
  }
  .static {
    position: static;
  }
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .sticky {
    position: sticky;
  }
  .bg-surface {
    background-color: #fafbfc, #0f1419;
  }
  .bg-surface-container {
    background-color: #f1f5f9, #1e293b;
  }
  .bg-surface-container-high {
    background-color: #e2e8f0, #334155;
  }
  .bg-primary {
    background-color: #4e8fad, #8ec4d4;
  }
  .bg-secondary {
    background-color: #6b7280, #94a3b8;
  }
  .border {
    border: 1px solid #cbd5e1, #475569;
  }
  .border-2 {
    border: 2px solid #cbd5e1, #475569;
  }
  .border-primary {
    border: 1px solid #4e8fad, #8ec4d4;
  }
  .border-secondary {
    border: 1px solid #6b7280, #94a3b8;
  }
  .rounded-none {
    border-radius: 0;
  }
  .rounded-sm {
    border-radius: 0.25rem;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .shadow-xs {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .shadow-sm {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-not-allowed {
    cursor: not-allowed;
  }
  .select-none {
    user-select: none;
  }
  .select-text {
    user-select: text;
  }
  .select-all {
    user-select: all;
  }
  .visible {
    visibility: visible;
  }
  .invisible {
    visibility: hidden;
  }
  .collapse,
  .vs-collapsed {
    visibility: collapse;
  }
  .opacity-0 {
    opacity: 0;
  }
  .opacity-25 {
    opacity: 0.25;
  }
  .opacity-50 {
    opacity: 0.5;
  }
  .opacity-75 {
    opacity: 0.75;
  }
  .opacity-100 {
    opacity: 1;
  }
  @container (max-width: 320px) {
    .hidden\\@xs {
      display: none;
    }
  }
  @container (max-width: 640px) {
    .hidden\\@sm {
      display: none;
    }
  }
  @container (max-width: 768px) {
    .hidden\\@md {
      display: none;
    }
  }
  @container (max-width: 1024px) {
    .hidden\\@lg {
      display: none;
    }
  }
  @container (min-width: 320px) {
    .block\\@xs {
      display: block;
    }
  }
  @container (min-width: 640px) {
    .block\\@sm {
      display: block;
    }
  }
  @container (min-width: 768px) {
    .block\\@md {
      display: block;
    }
  }
  @container (min-width: 1024px) {
    .block\\@lg {
      display: block;
    }
  }
  @container (max-width: 320px) {
    .text-sm\\@xs {
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0;
    }
  }
  @container (min-width: 640px) {
    .text-base\\@sm {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0;
    }
  }
  .icon-xs {
    --icon-size: 0.75rem;
  }
  .icon-sm {
    --icon-size: 0.875rem;
  }
  .icon-md {
    --icon-size: 1rem;
  }
  .icon-lg {
    --icon-size: 1.25rem;
  }
  .icon-xl {
    --icon-size: 1.5rem;
  }
  .center-absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .center-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .interactive {
    cursor: pointer;
    touch-action: manipulation;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .interactive:focus-visible {
    outline: 2px solid #dbeafe, #1e40af;
    outline-offset: 2px;
  }
  .interactive:disabled, .interactive[aria-disabled=true] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }
  .focus-ring:focus-visible {
    outline: 2px solid #dbeafe, #1e40af;
    outline-offset: 2px;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .aspect-square {
    aspect-ratio: 1;
  }
  .aspect-video {
    aspect-ratio: 16 / 9;
  }
  .margin-block-0 {
    margin-block: 0;
  }
  .margin-block-sm {
    margin-block: var(--space-sm);
  }
  .margin-block-md {
    margin-block: var(--space-md);
  }
  .margin-block-lg {
    margin-block: var(--space-lg);
  }
  .margin-inline-0 {
    margin-inline: 0;
  }
  .margin-inline-sm {
    margin-inline: var(--space-sm);
  }
  .margin-inline-md {
    margin-inline: var(--space-md);
  }
  .margin-inline-lg {
    margin-inline: var(--space-lg);
  }
  .margin-inline-auto {
    margin-inline: auto;
  }
  .padding-block-0 {
    padding-block: 0;
  }
  .padding-block-sm {
    padding-block: var(--space-sm);
  }
  .padding-block-md {
    padding-block: var(--space-md);
  }
  .padding-block-lg {
    padding-block: var(--space-lg);
  }
  .padding-inline-0 {
    padding-inline: 0;
  }
  .padding-inline-sm {
    padding-inline: var(--space-sm);
  }
  .padding-inline-md {
    padding-inline: var(--space-md);
  }
  .padding-inline-lg {
    padding-inline: var(--space-lg);
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .vs-active {
    --state-active: 1;
  }
  .vs-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  .vs-loading {
    cursor: wait;
  }
  .vs-error {
    color: var(--color-error, #dc3545);
  }
  .vs-success {
    color: var(--color-success, #28a745);
  }
  .vs-hidden {
    display: none !important;
  }
  .vl-container,
  .container {
    inline-size: 100%;
    max-inline-size: var(--container-max, 1200px);
    margin-inline: auto;
  }
  .vl-container {
    padding-inline: var(--space-md);
  }
  .container {
    padding-inline: var(--space-lg);
  }
  .vl-grid {
    display: grid;
    gap: var(--gap-md);
  }
  .vl-stack {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }
  .vl-cluster {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    align-items: center;
  }
  .vl-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vu-sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .vc-surface {
    background-color: var(--color-surface);
    color: var(--color-on-surface);
  }
  .vc-surface-variant {
    background-color: var(--color-surface-variant);
    color: var(--color-on-surface-variant);
  }
  .vc-primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }
  .vc-secondary {
    background-color: var(--color-secondary);
    color: var(--color-on-secondary);
  }
  .vc-elevated {
    box-shadow: var(--elev-1);
  }
  .vc-elevated-2 {
    box-shadow: var(--elev-2);
  }
  .vc-elevated-3 {
    box-shadow: var(--elev-3);
  }
  .vc-rounded {
    border-radius: var(--radius-md);
  }
  .vc-rounded-sm {
    border-radius: var(--radius-sm);
  }
  .vc-rounded-lg {
    border-radius: var(--radius-lg);
  }
  .vc-rounded-full {
    border-radius: var(--radius-full, 9999px);
  }
  .card {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-sm);
  }
  .stack > * + * {
    margin-block-start: var(--space-md);
  }
  .stack-sm > * + * {
    margin-block-start: var(--space-sm);
  }
  .stack-lg > * + * {
    margin-block-start: var(--space-lg);
  }
  @media print {
    .print-hidden {
      display: none !important;
    }
    .print-visible {
      display: block !important;
    }
    .print-break-before {
      page-break-before: always;
    }
    .print-break-after {
      page-break-after: always;
    }
    .print-break-inside-avoid {
      page-break-inside: avoid;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .transition-fast,
    .transition-normal,
    .transition-slow {
      transition: none;
    }
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  @media (prefers-contrast: high) {
    .text-primary {
      color: var(--color-on-surface);
    }
    .text-secondary,
    .text-muted,
    .text-disabled {
      color: var(--color-on-surface-variant);
    }
    .border {
      border-width: 2px;
    }
    .border-top {
      border-top-width: 2px;
    }
    .border-bottom {
      border-bottom-width: 2px;
    }
    .border-left {
      border-left-width: 2px;
    }
    .border-right {
      border-right-width: 2px;
    }
  }
}
@property --value {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --relate {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --drag-x {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}
@property --drag-y {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}
@property --order {
  syntax: "<integer>";
  initial-value: 1;
  inherits: true;
}
@property --content-inline-size {
  syntax: "<length-percentage>";
  initial-value: 100%;
  inherits: true;
}
@property --content-block-size {
  syntax: "<length-percentage>";
  initial-value: 100%;
  inherits: true;
}
@property --icon-size {
  syntax: "<length-percentage>";
  initial-value: 16px;
  inherits: true;
}
@property --icon-color {
  syntax: "<color>";
  initial-value: rgba(0, 0, 0, 0);
  inherits: true;
}
@property --icon-padding {
  syntax: "<length-percentage>";
  initial-value: 0px;
  inherits: true;
}
@property --icon-image {
  syntax: "<image>";
  initial-value: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
  inherits: true;
}
@layer utilities {
  .grid-rows > ::slotted(*) {
    display: grid;
    grid-auto-flow: column;
  }
  .grid-rows > ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  .grid-rows > ::slotted(*) {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  :host(.grid-rows) ::slotted(::slotted(*)) {
    display: grid;
    grid-auto-flow: column;
  }
  :host(.grid-rows) ::slotted(::slotted(*)) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-rows) ::slotted(::slotted(*)) {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  .grid-rows > * {
    display: grid;
    grid-auto-flow: column;
  }
  .grid-rows > * {
    place-content: center;
    place-items: center;
  }
  .grid-rows > * {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  :host(.grid-rows) ::slotted(*) {
    display: grid;
    grid-auto-flow: column;
  }
  :host(.grid-rows) ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-rows) ::slotted(*) {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  .grid-rows {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .grid-rows {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-rows {
    grid-auto-rows: minmax(0px, max-content);
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  :host(.grid-rows) {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.grid-rows) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-rows) {
    grid-auto-rows: minmax(0px, max-content);
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  .grid-columns > ::slotted(*) {
    display: grid;
    grid-auto-flow: row;
  }
  .grid-columns > ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  .grid-columns > ::slotted(*) {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  :host(.grid-columns) ::slotted(::slotted(*)) {
    display: grid;
    grid-auto-flow: row;
  }
  :host(.grid-columns) ::slotted(::slotted(*)) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-columns) ::slotted(::slotted(*)) {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  .grid-columns > * {
    display: grid;
    grid-auto-flow: row;
  }
  .grid-columns > * {
    place-content: center;
    place-items: center;
  }
  .grid-columns > * {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  :host(.grid-columns) ::slotted(*) {
    display: grid;
    grid-auto-flow: row;
  }
  :host(.grid-columns) ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-columns) ::slotted(*) {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  .grid-columns {
    --display: inline-grid;
    --flow: row;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .grid-columns {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-columns {
    grid-auto-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  :host(.grid-columns) {
    --display: inline-grid;
    --flow: row;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.grid-columns) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-columns) {
    grid-auto-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  .flex-columns > ::slotted(*) {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  .flex-columns > ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  :host(.flex-columns) ::slotted(::slotted(*)) {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  :host(.flex-columns) ::slotted(::slotted(*)) {
    place-content: center;
    place-items: center;
  }
  .flex-columns > * {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  .flex-columns > * {
    place-content: center;
    place-items: center;
  }
  :host(.flex-columns) ::slotted(*) {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  :host(.flex-columns) ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  .flex-columns {
    --display: inline-flex;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .flex-columns {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.flex-columns) {
    --display: inline-flex;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.flex-columns) {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-layered > ::slotted(*) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  .grid-layered > ::slotted(*) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.grid-layered) ::slotted(::slotted(*)) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  :host(.grid-layered) ::slotted(::slotted(*)) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .grid-layered > * {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  .grid-layered > * > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.grid-layered) ::slotted(*) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  :host(.grid-layered) ::slotted(*) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .grid-layered {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  .grid-layered > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .grid-layered {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .grid-layered {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-layered) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  :host(.grid-layered) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.grid-layered) {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.grid-layered) {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-rows-3c > ::slotted(*) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  :host(.grid-rows-3c) ::slotted(::slotted(*)) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  .grid-rows-3c > * {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  :host(.grid-rows-3c) ::slotted(*) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  .grid-rows-3c {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  .grid-rows-3c {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-rows-3c) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  :host(.grid-rows-3c) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-rows-3c > ::slotted(*:last-child) {
    grid-column: var(--order, 1)/3 span;
  }
  :host(.grid-rows-3c) ::slotted(::slotted(*:last-child)) {
    grid-column: var(--order, 1)/3 span;
  }
  .grid-rows-3c > *:last-child {
    grid-column: var(--order, 1)/3 span;
  }
  :host(.grid-rows-3c) ::slotted(*:last-child) {
    grid-column: var(--order, 1)/3 span;
  }
  .grid-rows-3c {
    --order: sibling-index();
  }
  .grid-rows-3c {
    grid-column: var(--order, 1)/var(--order, 1) span;
  }
  .grid-rows-3c {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-rows-3c) {
    --order: sibling-index();
  }
  :host(.grid-rows-3c) {
    grid-column: var(--order, 1)/var(--order, 1) span;
  }
  :host(.grid-rows-3c) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .stretch-inline {
    inline-size: 100%;
    inline-size: -webkit-fill-available;
    inline-size: stretch;
  }
  :host(.stretch-inline) {
    inline-size: 100%;
    inline-size: -webkit-fill-available;
    inline-size: stretch;
  }
  .stretch-block {
    block-size: 100%;
    block-size: -webkit-fill-available;
    block-size: stretch;
  }
  :host(.stretch-block) {
    block-size: 100%;
    block-size: -webkit-fill-available;
    block-size: stretch;
  }
  .content-inline-size {
    padding-inline: max(100% - (100% - var(--content-inline-size, 100%) * 0.5), 0px);
  }
  :host(.content-inline-size) {
    padding-inline: max(100% - (100% - var(--content-inline-size, 100%) * 0.5), 0px);
  }
  .content-block-size {
    padding-block: max(100% - (100% - var(--content-block-size, 100%) * 0.5), 0px);
  }
  :host(.content-block-size) {
    padding-block: max(100% - (100% - var(--content-block-size, 100%) * 0.5), 0px);
  }
  .ux-anchor {
    inset-inline-start: max(var(--client-x, 0px), 0px);
    inset-block-start: max(var(--client-y, 0px), 0px);
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    writing-mode: horizontal-tb;
    translate: 0% 0% 0%;
    transform: none;
  }
  .ux-anchor {
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--client-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--client-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
  }
  @supports (position-anchor: --example) {
    .ux-anchor {
      position-anchor: var(--anchor-group);
      inset-inline-start: anchor(var(--anchor-group) start);
      inset-block-start: anchor(var(--anchor-group) end);
      inline-size: anchor-size(var(--anchor-group) self-inline);
    }
  }
  :host(.ux-anchor) {
    inset-inline-start: max(var(--client-x, 0px), 0px);
    inset-block-start: max(var(--client-y, 0px), 0px);
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    writing-mode: horizontal-tb;
    translate: 0% 0% 0%;
    transform: none;
  }
  :host(.ux-anchor) {
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--client-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--client-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
  }
  @supports (position-anchor: --example) {
    :host(.ux-anchor) {
      position-anchor: var(--anchor-group);
      inset-inline-start: anchor(var(--anchor-group) start);
      inset-block-start: anchor(var(--anchor-group) end);
      inline-size: anchor-size(var(--anchor-group) self-inline);
    }
  }
  .ux-anchor {
    --shift-x: var(--client-x, 0px);
    --shift-y: var(--client-y, 0px);
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--shift-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--shift-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    inset-inline-start: max(var(--shift-x), 0px);
    inset-block-start: max(var(--shift-y), var(--status-bar-padding, 0px));
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    translate: 0% 0% 0%;
    writing-mode: horizontal-tb;
    transform: none;
  }
  :host(.ux-anchor) {
    --shift-x: var(--client-x, 0px);
    --shift-y: var(--client-y, 0px);
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--shift-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--shift-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    inset-inline-start: max(var(--shift-x), 0px);
    inset-block-start: max(var(--shift-y), var(--status-bar-padding, 0px));
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    translate: 0% 0% 0%;
    writing-mode: horizontal-tb;
    transform: none;
  }
  .layered-wrap {
    background-color: transparent;
    display: inline grid;
    inline-size: max-content;
    block-size: max-content;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    z-index: calc(var(--z-index, 0) + 1);
    overflow: visible;
  }
  .layered-wrap > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.layered-wrap) {
    background-color: transparent;
    display: inline grid;
    inline-size: max-content;
    block-size: max-content;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    z-index: calc(var(--z-index, 0) + 1);
    overflow: visible;
  }
  :host(.layered-wrap) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
}
@layer theme {
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes app-shell-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes viewer-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes explorer-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes rs-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes airpad-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes view-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes viewer-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes viewer-slide-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes viewer-pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes slide-in-top {
    from {
      opacity: 0;
      transform: translate(0, calc(-1 * var(--slide-distance, 1rem)));
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translate(var(--slide-distance, 1rem), 0);
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes slide-in-bottom {
    from {
      opacity: 0;
      transform: translate(0, var(--slide-distance, 1rem));
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translate(calc(-1 * var(--slide-distance, 1rem)), 0);
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes app-shell-status-enter {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes shell-status-fade-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes viewer-skeleton-shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
  @keyframes card-pulse {
    0%, 100% {
      box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-blue) 50%, transparent), var(--card-shadow-base);
    }
    50% {
      box-shadow: 0 0 0 6px color-mix(in oklch, var(--color-blue) 20%, transparent), var(--card-shadow-base);
    }
  }
  @keyframes card-hydrate-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}
@function --wavy-step(--step <number>) {
  --angle: calc((var(--step, 0) * 2) * 1rad * pi);
  --variant: calc(cos(var(--clip-freq, 8) * var(--angle, 0deg)) * 0.5 + 0.5);
  --adjust: calc(var(--variant, 0) * var(--clip-amplitude, 0));
  --x: calc(50% + (cos(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));
  --y: calc(50% + (sin(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));
  result: var(--x) var(--y);
}
@layer components {
  .shaped {
    display: flex;
    place-content: center;
    place-items: center;
    aspect-ratio: 1/1 !important;
    inline-size: stretch;
    block-size: fit-content;
    padding: 1.25rem;
    contain: strict;
    overflow: hidden;
    border-radius: var(--border-radius, 1.5rem);
    z-index: 1;
    pointer-events: auto;
    user-select: none;
    transition-behavior: allow-discrete;
    transition: --background-tone-shift 0.2s ease-in-out, --icon-color 0.2s ease-in-out;
  }
  .shaped span, .shaped ui-icon {
    inline-size: stretch;
    block-size: fit-content;
  }
  .shaped ui-icon {
    aspect-ratio: 1/1 !important;
  }
  *[data-dragging] {
    z-index: calc(100 + var(--z-index, 0)) !important;
  }
  *:not(:has(.shaped))[data-shape],
  *:not(.shaped) > *[data-shape],
  *:not(.shaped) .shaped[data-shape] {
    contain: strict;
    overflow: hidden;
    aspect-ratio: 1/1 !important;
    pointer-events: auto;
    touch-action: none;
  }
  *:not(:has(.shaped))[data-shape=square],
  *:not(.shaped) > *[data-shape=square],
  *:not(.shaped) .shaped[data-shape=square] {
    --border-radius: var(--radius-md);
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=squircle],
  *:not(.shaped) > *[data-shape=squircle],
  *:not(.shaped) .shaped[data-shape=squircle] {
    --border-radius: 28%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=circle],
  *:not(.shaped) > *[data-shape=circle],
  *:not(.shaped) .shaped[data-shape=circle] {
    --border-radius: 50%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=rounded],
  *:not(.shaped) > *[data-shape=rounded],
  *:not(.shaped) .shaped[data-shape=rounded] {
    --border-radius: var(--radius-xl);
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=blob],
  *:not(.shaped) > *[data-shape=blob],
  *:not(.shaped) .shaped[data-shape=blob] {
    --border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=hexagon],
  *:not(.shaped) > *[data-shape=hexagon],
  *:not(.shaped) .shaped[data-shape=hexagon] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%
    );
  }
  *:not(:has(.shaped))[data-shape=diamond],
  *:not(.shaped) > *[data-shape=diamond],
  *:not(.shaped) .shaped[data-shape=diamond] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.5rem,
        50% 0%, 100% 50%, 50% 100%, 0% 50%
    );
  }
  *:not(:has(.shaped))[data-shape=star],
  *:not(.shaped) > *[data-shape=star],
  *:not(.shaped) .shaped[data-shape=star] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        50% 0%,
        61% 35%, 98% 38%,
        68% 59%, 79% 95%,
        50% 75%,
        21% 95%, 32% 59%,
        2% 38%, 39% 35%
    );
  }
  *:not(:has(.shaped))[data-shape=badge],
  *:not(.shaped) > *[data-shape=badge],
  *:not(.shaped) .shaped[data-shape=badge] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%
    );
  }
  *:not(:has(.shaped))[data-shape=heart],
  *:not(.shaped) > *[data-shape=heart],
  *:not(.shaped) .shaped[data-shape=heart] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        50% 100%,
        10% 65%, 0% 45%, 0% 30%,
        5% 15%, 18% 3%, 35% 0%, 50% 12%,
        65% 0%, 82% 3%, 95% 15%,
        100% 30%, 100% 45%, 90% 65%
    );
  }
  *:not(:has(.shaped))[data-shape=clover],
  *:not(.shaped) > *[data-shape=clover],
  *:not(.shaped) .shaped[data-shape=clover] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        50% 0%, 60% 30%, 70% 30%, 100% 50%,
        70% 70%, 60% 70%, 50% 100%,
        40% 70%, 30% 70%, 0% 50%,
        30% 30%, 40% 30%
    );
  }
  *:not(:has(.shaped))[data-shape=flower],
  *:not(.shaped) > *[data-shape=flower],
  *:not(.shaped) .shaped[data-shape=flower] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        50% 0%, 58% 25%, 85% 15%, 68% 40%,
        100% 50%, 68% 60%, 85% 85%, 58% 75%,
        50% 100%, 42% 75%, 15% 85%, 32% 60%,
        0% 50%, 32% 40%, 15% 15%, 42% 25%
    );
  }
  *:not(:has(.shaped))[data-shape=triangle],
  *:not(.shaped) > *[data-shape=triangle],
  *:not(.shaped) .shaped[data-shape=triangle] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.5rem,
        50% 0%, 100% 87%, 0% 87%
    );
  }
  *:not(:has(.shaped))[data-shape=pentagon],
  *:not(.shaped) > *[data-shape=pentagon],
  *:not(.shaped) .shaped[data-shape=pentagon] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        50% 0%, 97.5% 35%, 79.5% 95%, 20.5% 95%, 2.5% 35%
    );
  }
  *:not(:has(.shaped))[data-shape=octagon],
  *:not(.shaped) > *[data-shape=octagon],
  *:not(.shaped) .shaped[data-shape=octagon] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        30% 0%, 70% 0%, 100% 30%, 100% 70%,
        70% 100%, 30% 100%, 0% 70%, 0% 30%
    );
  }
  *:not(:has(.shaped))[data-shape=cross],
  *:not(.shaped) > *[data-shape=cross],
  *:not(.shaped) .shaped[data-shape=cross] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        35% 0%, 65% 0%, 65% 35%, 100% 35%,
        100% 65%, 65% 65%, 65% 100%, 35% 100%,
        35% 65%, 0% 65%, 0% 35%, 35% 35%
    );
  }
  *:not(:has(.shaped))[data-shape=arrow],
  *:not(.shaped) > *[data-shape=arrow],
  *:not(.shaped) .shaped[data-shape=arrow] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        0% 20%, 60% 20%, 60% 0%, 100% 50%,
        60% 100%, 60% 80%, 0% 80%
    );
  }
  *:not(:has(.shaped))[data-shape=egg],
  *:not(.shaped) > *[data-shape=egg],
  *:not(.shaped) .shaped[data-shape=egg] {
    --border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=tear],
  *:not(.shaped) > *[data-shape=tear],
  *:not(.shaped) .shaped[data-shape=tear] {
    --border-radius: 50cqmin 50cqmin 5rem 50cqmin;
    --clip-path: none;
    border-start-start-radius: 50cqmin;
    border-start-end-radius: 50cqmin;
    border-end-start-radius: 50cqmin;
    border-end-end-radius: 5rem;
  }
  *:not(:has(.shaped))[data-shape=wavy],
  *:not(.shaped) > *[data-shape=wavy],
  *:not(.shaped) .shaped[data-shape=wavy] {
    --border-radius: calc(var(--icon-size, 100%) * 0.5);
  }
}`})))()}async function z(e){if(B===e)return;console.log(`[Veela] Loading variant:`,e);let t=async e=>{typeof e==`string`&&e.length&&await a(e)};if(e===`core`){await t(F),B=e;return}await t(L),B=e}var B;function V(){return(V=e((()=>{i(),I(),R(),B=null})))()}async function H(e){let t=U[e]||U[`vl-basic`];if(!t)throw Error(`Unknown style system: ${e}`);if(W===e){console.log(`[Styles] Style system '${e}' already loaded`);return}console.log(`[Styles] Loading style system: ${t.name}`),t.initFn&&await t.initFn(),W=e,console.log(`[Styles] Style system ${t.name} loaded`)}var U,W;function G(){return(G=e((()=>{V(),U={"vl-advanced":{id:`vl-advanced`,name:`Veela Advanced`,description:`Full-featured CSS framework with design tokens and effects`,variant:`advanced`,initFn:async()=>{try{await z(`advanced`),console.log(`[Styles] Veela Advanced loaded`)}catch{}}},"vl-basic":{id:`vl-basic`,name:`Veela Basic Styles`,description:`Lightweight minimal styling for basic functionality`,variant:`basic`,initFn:async()=>{try{await z(`basic`),console.log(`[Styles] Veela Basic Styles loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Basic Styles:`,e)}}},"vl-beercss":{id:`vl-beercss`,name:`Veela BeerCSS`,description:`Beer CSS compatible styling with Material Design 3`,variant:`beercss`,initFn:async()=>{try{await z(`beercss`),console.log(`[Styles] Veela BeerCSS loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela BeerCSS:`,e)}}},"vl-core":{id:`vl-core`,name:`Veela Core`,description:`Shared foundation styles for all veela variants`,variant:`core`,initFn:async()=>{try{await z(`core`),console.log(`[Styles] Veela Core loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Core:`,e)}}},raw:{id:`raw`,name:`Raw`,description:`No styling framework, browser defaults`,variant:`core`,initFn:async()=>{console.log(`[Styles] Raw mode - no styles loaded`)}}},W=null})))()}var K;function q(){return(q=e((()=>{r(),se(),K=(e,t={})=>{let r=t.enableOrientLayer!==!1,i=t.enableCanvasLayer!==!1,a=e.querySelector(`[data-app-layer="canvas"]`),o=e.querySelector(`[data-app-layer="orient"]`),s=e.querySelector(`[data-app-layer="shell"]`),c=e.querySelector(`[data-app-layer="overlay"]`),l=()=>{let e=document.createElement(`div`);return e.dataset.appLayer=`canvas`,e.className=`app-layer app-layer--canvas`,e.style.position=`absolute`,e.style.inset=`0`,e.style.zIndex=`0`,e.style.pointerEvents=`none`,ce(e),e};if(s&&c){let t=a;if(i&&!t&&(t=l(),e.insertBefore(t,o??s)),!i&&t&&(t.remove(),t=null),r&&!o){let r=document.createElement(`div`);r.dataset.appLayer=`orient`,r.className=`app-layer app-layer--orient`,r.style.position=`absolute`,r.style.inset=`0`,r.style.zIndex=`5`,r.style.pointerEvents=`none`,r.style.background=`transparent`;let i=document.createElement(`cw-oriented-box`);return i.className=`ui-orientbox app-oriented-box`,i.setAttribute(`data-mixin`,`ui-orientbox`),i.style.position=`absolute`,i.style.inset=`0`,i.style.pointerEvents=`auto`,i.style.background=`transparent`,r.appendChild(i),n(i),e.insertBefore(r,s),{canvasLayer:t,orientLayer:r,shellLayer:s,overlayLayer:c}}return!r&&o?(o.remove(),{canvasLayer:t,orientLayer:null,shellLayer:s,overlayLayer:c}):{canvasLayer:t,orientLayer:r&&o||null,shellLayer:s,overlayLayer:c}}e.replaceChildren(),e.style.position=`relative`,e.style.overflow=`hidden`,e.dataset.appLayerRoot=`true`;try{let t=document.documentElement;(e===document.body||e.id===`app`)&&(t.style.minBlockSize||(t.style.minBlockSize=`100dvb`),!t.style.blockSize&&!t.style.height&&(t.style.blockSize=`100%`),!document.body.style.margin&&e===document.body&&(document.body.style.margin=`0`)),e.style.minBlockSize||(e.style.minBlockSize=`100dvb`),!e.style.blockSize&&!e.style.height&&(e.style.blockSize=`100%`)}catch{}let u=i?l():null,d=r?document.createElement(`div`):null;if(d){d.dataset.appLayer=`orient`,d.className=`app-layer app-layer--orient`,d.style.position=`absolute`,d.style.inset=`0`,d.style.zIndex=`5`,d.style.pointerEvents=`none`,d.style.background=`transparent`;let e=document.createElement(`cw-oriented-box`);e.className=`ui-orientbox app-oriented-box`,e.setAttribute(`data-mixin`,`ui-orientbox`),e.style.position=`absolute`,e.style.inset=`0`,e.style.pointerEvents=`auto`,e.style.background=`transparent`,d.appendChild(e),n(e)}let f=document.createElement(`div`);f.dataset.appLayer=`shell`,f.className=`app-layer app-layer--shell`,f.style.position=`absolute`,f.style.inset=`0`,f.style.zIndex=`10`,f.style.pointerEvents=`none`,f.style.display=`grid`,f.style.gridTemplateColumns=`[content-column] minmax(0px, 1fr)`,f.style.gridTemplateRows=`[status-row] minmax(0px, max-content) [content-row] minmax(0px, 1fr) [dock-row] minmax(0px, max-content)`,f.style.overflow=`hidden`,f.style.background=`transparent`,f.style.backgroundColor=`transparent`;let p=document.createElement(`div`);return p.dataset.appLayer=`overlay`,p.className=`app-layer app-layer--overlay`,p.style.position=`absolute`,p.style.inset=`0`,p.style.zIndex=`1000`,p.style.pointerEvents=`none`,p.style.background=`transparent`,p.style.backgroundColor=`transparent`,u&&e.append(u),d&&e.append(d),e.append(f,p),{canvasLayer:u,orientLayer:d,shellLayer:f,overlayLayer:p}}})))()}var ue=t({bootLoader:()=>Q});function de(e){try{return e?.dataset?.appLayer===`shell`?e:e.querySelector?.(`:scope > [data-app-layer="shell"]`)||K(e,{enableOrientLayer:!1,enableCanvasLayer:!1}).shellLayer}catch(t){return console.warn(`[BootLoader] ensureAppLayers failed; mounting into container directly:`,t),e}}async function J(e,t=`viewer`,n){let r=l(t,`viewer`),i=c(r)?[r]:[`viewer`],a=i[0],o=de(e);return Q.boot(o,{styleSystem:`vl-basic`,shell:`minimal`,defaultView:r,channels:i,channelPriorityId:a,rememberChoice:n?.rememberChoice??!0,skipInitialNavigate:n?.skipInitialNavigate??!1})}var Y,X,Z,Q;function $(){return($=e((()=>{i(),o(),ne(),s(),N(),re(),w(),ae(),P(),ee(),G(),g(),S(),oe(),q(),_(),Y=e=>e===`faint`?`tabbed`:e===`base`?`immersive`:e,X={raw:{name:`Raw (No Framework)`,stylesheets:[],description:`No CSS framework, raw browser defaults`,recommendedShells:[`immersive`]},"vl-core":{name:`Core (Shared Foundation)`,stylesheets:[],description:`Shared foundation styles for all veela variants`,recommendedShells:[`immersive`,`minimal`]},"vl-basic":{name:`Basic Veela Styles`,stylesheets:[],description:`Minimal styling for basic functionality`,recommendedShells:[`window`,`tabbed`,`minimal`,`environment`,`immersive`,`content`]},"vl-advanced":{name:`Advanced (Full-Featured Styling)`,stylesheets:[],description:`Full-featured styling with design tokens and effects`,recommendedShells:[`tabbed`,`minimal`,`environment`]},"vl-beercss":{name:`BeerCSS (Beer CSS Compatible)`,stylesheets:[],description:`Beer CSS compatible styling with Material Design 3`,recommendedShells:[`tabbed`]}},Z=class e{static instance;state={phase:`idle`,styleSystem:null,shell:null,view:null,error:null};stateChangeHandlers=new Set;shellInstance=null;implicitBridgeCleanup=null;phaseHandlers=new Map;constructor(){p()}static getInstance(){return e.instance||=new e,e.instance}async boot(e,t){console.log(`[BootLoader] Starting boot sequence:`,t);try{if(this.shellInstance)try{this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=null,h.unload(this.shellInstance.id)}catch(e){console.warn(`[BootLoader] Failed to unload previous shell:`,e)}finally{this.shellInstance=null}le(),ie().catch(()=>{}),b()&&(v(()=>import(`./capacitor-share-intent-CEzBlftN.js`).then(e=>e.installCapacitorShareIntentBridge()),[],import.meta.url).catch(()=>void 0),v(()=>import(`./capacitor-clipboard-asset-DmFX3cBR.js`).then(e=>e.installCapacitorClipboardAssetBridge()),[],import.meta.url).catch(()=>void 0));try{let{initFrontendDebugCapture:e}=await v(async()=>{let{initFrontendDebugCapture:e}=await import(`./frontend-debug-capture-Cyg6gGKk.js`).then(e=>(e.i(),e.t));return{initFrontendDebugCapture:e}},[],import.meta.url);e()}catch{}let n=await E().catch(e=>(console.warn(`[BootLoader] Failed to load settings:`,e),null)),r=n;if(b()){let e=await T().catch(()=>null);e&&(r=e)}if(r&&C(r).catch(()=>void 0),b()&&k(r).catch(e=>{console.warn(`[BootLoader] CWSP bridge daemon auto-start skipped:`,e)}),D(r??x),!(()=>{try{let e=globalThis,t=typeof document<`u`?String(document.documentElement?.dataset?.cwspSurface||``):``;return!!(e.__CWS_SKIP_PWA__||e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||e.Neutralino||typeof e.NL_OS==`string`||t===`cwsp-control`||t===`gateway`)}catch{return!1}})())try{let{initIngressPWA:e}=await v(async()=>{let{initIngressPWA:e}=await import(`./sw-handling-CMrAiCu7.js`);return{initIngressPWA:e}},[],import.meta.url);await e()}catch(e){console.warn(`[BootLoader] Share-target / service worker ingress failed (non-fatal):`,e)}await this.loadStyles(t.styleSystem);let i=this.resolveThemeFromSettings(n),a=await this.loadShell(t.shell,e);if(a.setTheme(t.theme||i),await a.mount(e),this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=f(),t.channels&&t.channels.length>0&&await this.initChannels(t.channels,t.channelPriorityId),t.skipInitialNavigate)this.dismissShellLoadingSpinner(a);else{let e;try{e=Object.fromEntries(new URLSearchParams(globalThis.location?.search||``))}catch{e=void 0}await a.navigate(t.defaultView,e)}this.setPhase(`ready`);try{typeof document<`u`&&(document.documentElement.dataset.cwspBoot=`ready`),globalThis.dispatchEvent?.(new CustomEvent(`cwsp:boot-ready`))}catch{}return t.rememberChoice&&this.savePreferences(t),console.log(`[BootLoader] Boot complete`),a}catch(e){throw console.error(`[BootLoader] Boot failed:`,e),this.updateState({phase:`error`,error:e}),e}}resolveThemeFromSettings(e){let t=e?.appearance?.theme||`auto`;return t===`dark`?te:t===`light`?m:d}dismissShellLoadingSpinner(e){try{let t=e.getElement().shadowRoot?.querySelector(`.app-shell__loading`);t&&(t.hidden=!0)}catch{}}async loadStyles(e){this.setPhase(`styles`),console.log(`[BootLoader] Loading style system: ${e}`);let t=X[e]||X[`vl-basic`];try{await H(e)}catch(t){throw console.error(`[BootLoader] Failed to load style system: ${e}`,t),t}for(let e of t.stylesheets)try{await a(e)}catch(t){console.warn(`[BootLoader] Failed to load stylesheet: ${e}`,t)}this.updateState({styleSystem:e}),console.log(`[BootLoader] Style system ${e} loaded`)}async loadShell(e,t){this.setPhase(`shell`);let n=Y(e);n!==e&&console.warn(`[BootLoader] Shell "${e}" is temporarily disabled, redirecting to "${n}"`),console.log(`[BootLoader] Loading shell: ${n}`);let r=await h.load(n,t);return this.shellInstance=r,this.updateState({shell:n}),console.log(`[BootLoader] Shell ${n} loaded`),r}async initChannels(e,t){this.setPhase(`channels`);let n=[...new Set(e)];if(n.length===0)return;let r=(t&&n.includes(t)?t:null)??n[0],i=n.filter(e=>e!==r);console.log(`[BootLoader] Initializing primary channel:`,r,i.length?`(+${i.length} deferred)`:``);try{await y.initChannel(r)}catch(e){console.warn(`[BootLoader] Failed to init primary channel ${r}:`,e)}if(i.length===0){console.log(`[BootLoader] Channels initialized`);return}let a=()=>{(async()=>{for(let e of i)try{await y.initChannel(e)}catch(t){console.warn(`[BootLoader] Failed to init channel ${e}:`,t)}console.log(`[BootLoader] Deferred channels initialized:`,i)})()};typeof globalThis.requestIdleCallback==`function`?globalThis.requestIdleCallback(a,{timeout:5e3}):globalThis.setTimeout?.(a,0)}updateState(e){Object.assign(this.state,e),this.notifyStateChange()}setPhase(e){this.updateState({phase:e});let t=this.phaseHandlers.get(e);if(t)for(let e of t)try{e(this.state)}catch(e){console.error(`[BootLoader] Phase handler error:`,e)}}notifyStateChange(){for(let e of this.stateChangeHandlers)try{e(this.state)}catch(e){console.error(`[BootLoader] State handler error:`,e)}}onStateChange(e){return this.stateChangeHandlers.add(e),()=>{this.stateChangeHandlers.delete(e)}}onPhase(e,t){return this.phaseHandlers.has(e)||this.phaseHandlers.set(e,new Set),this.phaseHandlers.get(e).add(t),()=>{this.phaseHandlers.get(e)?.delete(t)}}getState(){return{...this.state}}getShell(){return this.shellInstance}savePreferences(e){try{let t=Y(e.shell);localStorage.setItem(`rs-boot-style`,e.styleSystem),localStorage.setItem(`rs-boot-shell`,t),localStorage.setItem(`rs-boot-view`,e.defaultView),localStorage.setItem(`rs-boot-remember`,`1`)}catch(e){console.warn(`[BootLoader] Failed to save preferences:`,e)}}loadPreferences(){try{if(localStorage.getItem(`rs-boot-remember`)!==`1`)return null;let e=Y(localStorage.getItem(`rs-boot-shell`)||`environment`);return{styleSystem:localStorage.getItem(`rs-boot-style`)||void 0,shell:e,defaultView:localStorage.getItem(`rs-boot-view`)||void 0}}catch{return null}}clearPreferences(){try{localStorage.removeItem(`rs-boot-style`),localStorage.removeItem(`rs-boot-shell`),localStorage.removeItem(`rs-boot-view`),localStorage.removeItem(`rs-boot-remember`),localStorage.removeItem(u)}catch{}}},Q=Z.getInstance()})))()}export{J as n,$ as r,ue as t};