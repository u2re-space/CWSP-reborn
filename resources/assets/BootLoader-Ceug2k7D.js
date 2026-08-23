import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{I as n,L as r,O as i,V as a,t as o,z as s}from"./src-C7QuTtnr.js";import{_ as c,a as l,d as u,f as d,h as f,i as p,m,o as h,p as g,r as _,s as v,t as y,u as ee}from"./registry-D2pvZ4V6.js";import{n as te,t as ne}from"./preload-helper-DcjHEl26.js";import{o as re,s as ie}from"./channel-mixin-xxxCJwOb.js";import{a as ae,c as oe,i as se}from"./cws-bridge-CJBOA0Wb.js";import{n as ce,r as le}from"./SettingsTypes-BEJR80_L.js";import{r as ue,t as de}from"./hub-socket-boot-crn8yrMC.js";import{a as fe,n as pe,o as me}from"./Settings-CahzB18o.js";import{n as he,r as ge}from"./Theme-BBl9yY0n.js";import{n as _e,r as ve}from"./capacitor-permissions-D8qxRNOR.js";function ye(){if(xe){console.debug(`[LayerManager] Already initialized`);return}if(typeof document>`u`){console.warn(`[LayerManager] No document available (SSR context?)`);return}let e=[...be].sort((e,t)=>e.order-t.order).map(e=>e.name),t=`@layer ${e.join(`, `)};`,n=document.createElement(`style`);n.id=`css-layer-init`,n.setAttribute(`data-layer-manager`,`true`),n.textContent=t;let r=document.head;r.insertBefore(n,r.firstChild),Se=n,xe=!0,console.log(`[LayerManager] Initialized ${e.length} layers`)}var be,xe,Se;function Ce(){return(Ce=e((()=>{be=[{name:`ux-normalize`,category:`system`,order:0,description:`Veela normalize layer`},{name:`layer.reset`,category:`system`,order:0,description:`CSS reset rules`},{name:`layer.normalize`,category:`system`,order:10,description:`Normalize browser defaults`},{name:`tokens`,category:`system`,order:20,description:`Legacy tokens layer`},{name:`ux-tokens`,category:`system`,order:20,description:`Veela token layer`},{name:`layer.tokens`,category:`system`,order:20,description:`CSS custom properties (variables)`},{name:`base`,category:`system`,order:30,description:`Legacy base layer`},{name:`ux-base`,category:`system`,order:30,description:`Veela base layer`},{name:`layout`,category:`system`,order:40,description:`Legacy layout layer`},{name:`ux-layout`,category:`system`,order:40,description:`Veela layout layer`},{name:`components`,category:`system`,order:50,description:`Legacy components layer`},{name:`ux-components`,category:`system`,order:50,description:`Veela components layer`},{name:`utilities`,category:`system`,order:60,description:`Legacy utilities layer`},{name:`ux-utilities`,category:`system`,order:60,description:`Veela utilities layer`},{name:`ux-theme`,category:`system`,order:70,description:`Veela theme layer`},{name:`ux-overrides`,category:`system`,order:80,description:`Veela overrides layer`},{name:`layer.properties.shell`,category:`system`,order:30,description:`Shell context custom properties`},{name:`layer.properties.views`,category:`system`,order:35,description:`View context custom properties`},{name:`layer.runtime.base`,category:`runtime`,order:100,description:`Veela runtime base styles`},{name:`layer.runtime.components`,category:`runtime`,order:110,description:`Reusable component styles`},{name:`layer.runtime.forms`,category:`runtime`,order:115,description:`Form element base styles`},{name:`layer.runtime.utilities`,category:`runtime`,order:120,description:`Utility classes`},{name:`layer.runtime.animations`,category:`runtime`,order:130,description:`Keyframes and animation definitions`},{name:`layer.boot`,category:`runtime`,order:140,description:`Boot/choice screen styles`},{name:`boot.tokens`,category:`runtime`,order:142,description:`Boot tokens layer`},{name:`boot.base`,category:`runtime`,order:144,description:`Boot base layer`},{name:`boot.components`,category:`runtime`,order:146,description:`Boot components layer`},{name:`boot.responsive`,category:`runtime`,order:148,description:`Boot responsive adjustments`},{name:`layer.shell.common`,category:`shell`,order:200,description:`Shared shell styles`},{name:`shell.tokens`,category:`shell`,order:202,description:`Legacy shell tokens`},{name:`shell.base`,category:`shell`,order:204,description:`Legacy shell base`},{name:`shell.components`,category:`shell`,order:206,description:`Legacy shell components`},{name:`shell.utilities`,category:`shell`,order:208,description:`Legacy shell utilities`},{name:`shell.overrides`,category:`shell`,order:209,description:`Legacy shell overrides`},{name:`layer.shell.raw`,category:`shell`,order:210,description:`Raw shell (minimal)`},{name:`layer.shell.minimal`,category:`shell`,order:220,description:`Minimal shell (toolbar navigation)`},{name:`layer.shell.minimal.layout`,category:`shell`,order:222,description:`Minimal shell layout rules`},{name:`layer.shell.minimal.components`,category:`shell`,order:224,description:`Minimal shell component styles`},{name:`layer.shell.window`,category:`shell`,order:226,description:`Window shell (desktop/process frames)`},{name:`layer.shell.faint`,category:`shell`,order:230,description:`Faint shell (tabbed sidebar)`},{name:`layer.shell.faint.layout`,category:`shell`,order:232,description:`Faint shell layout`},{name:`layer.shell.faint.sidebar`,category:`shell`,order:234,description:`Faint shell sidebar`},{name:`layer.shell.faint.toolbar`,category:`shell`,order:236,description:`Faint shell toolbar`},{name:`layer.shell.faint.forms`,category:`shell`,order:238,description:`Faint shell form components`},{name:`layer.view.common`,category:`view`,order:300,description:`Shared view styles`},{name:`layer.view.viewer`,category:`view`,order:310,description:`Markdown viewer`},{name:`layer.view.workcenter`,category:`view`,order:320,description:`Work center (AI prompts)`},{name:`layer.view.workcenter.keyframes`,category:`view`,order:322,description:`Work center animations`},{name:`view.workcenter`,category:`view`,order:324,description:`Work center styles (legacy name)`},{name:`view.workcenter.animations`,category:`view`,order:326,description:`Work center animations (legacy name)`},{name:`layer.view.settings`,category:`view`,order:330,description:`Settings view`},{name:`layer.view.explorer`,category:`view`,order:340,description:`File explorer`},{name:`layer.view.history`,category:`view`,order:350,description:`History view`},{name:`layer.view.editor`,category:`view`,order:360,description:`Editor view`},{name:`layer.view.editor.markdown`,category:`view`,order:362,description:`Markdown editor sublayer`},{name:`layer.view.editor.quill`,category:`view`,order:364,description:`Quill editor sublayer`},{name:`layer.view.home`,category:`view`,order:380,description:`Home/landing view`},{name:`layer.view.print`,category:`view`,order:390,description:`Print view`},{name:`view-explorer`,category:`view`,order:392,description:`Explorer legacy layered scope`},{name:`view-transitions`,category:`override`,order:850,description:`View Transition API named targets and keyframes`},{name:`layer.override.theme`,category:`override`,order:900,description:`Theme customizations`},{name:`layer.override.print`,category:`override`,order:910,description:`Print media styles`},{name:`layer.override.a11y`,category:`override`,order:920,description:`Accessibility enhancements`}],xe=!1})))()}function we(){return(we=e((()=>{ge()})))()}var Te;function Ee(){return(Ee=e((()=>{Te=`@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 22.30.00_22.08.2026
 * Reason for changes: Light/dark primary-container so Start plates and chrome ink flip.
 */
/*
 * INVARIANT: This is the canonical color-token registry for the full veela bundle.
 * All color token DEFAULTS live here on \`:root, :host, :scope\`.
 * - \`misc/_tokens.scss\` is a symlink of this file.
 * - \`basic/misc/_tokens.scss\` and \`advanced/misc/_tokens.scss\` are intentional
 *   per-bundle SCSS alias shims (no CSS output) for the lightweight vl-basic / advanced
 *   bundles; they MUST NOT \`@forward\` this file (would pull the full \`@layer tokens\`
 *   CSS into those bundles and break their size semantics).
 * - \`basic/misc/_normalize.scss\` carries a documented vl-basic fallback palette for
 *   standalone vl-basic loading (no advanced MD3 tokens bundled).
 * - The advanced MD3/C2 system (\`advanced/tokens/_variables.scss\`, \`_color.scss\`,
 *   \`_shadow.scss\`) keeps its mixin/function definitions in place (depends on
 *   \`veela-lib\`); color-token EMISSION for that system is invoked from here where
 *   safe, otherwise remains in its layer with a pointer comment.
 * - Component/shell/view files keep only context overrides and shadow-DOM
 *   \`var(--token, light-dark(...))\` fallbacks; they never redefine a canonical default.
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
 * Change date and time: 15.50.00_22.08.2026
 * Reason for changes: Seed initial-value is the desktop cyan-blue fallback (#5a9ec8).
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these; surfaces derive via unregistered
 * \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\` and re-evaluate per used color-scheme.
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
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: legacy layer names remain in the registry while their consumers
 * migrate. New component rules use the \`ux-*\` names; no host may establish a
 * competing layer order by importing a second prelude.
 */
@layer ux-normalize,
    tokens,
    ux-tokens,
    base,
    ux-base,
    layout,
    ux-layout,
    shells,
    shell,
    views,
    view,
    viewer,
    components,
    ux-components,
    ux-layer,
    ui-icon,
    ui-icon-reset,
    ux-file-manager,
    ux-file-manager-content,
    utilities,
    ux-utilities,
    theme,
    ux-theme,
    markdown,
    essentials,
    print,
    print-breaks,
    view-transitions,
    overrides,
    ux-overrides;
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  /* Ограничиваем индекс */
  --i: clamp(0, var(--index), 1000);
  /* Переданный цвет считается оттенком 550 */
  --pivot: 550;
  /* Расстояние от базового цвета к белой и чёрной границам */
  --white-distance:
    clamp(
      0,
      calc((var(--pivot) - var(--i)) / var(--pivot)),
      1
    );
  --black-distance:
    clamp(
      0,
      calc(
        (var(--i) - var(--pivot)) /
        (1000 - var(--pivot))
      ),
      1
    );
  /*
   * Нелинейное изменение светлоты:
   * близкие к 550 оттенки меньше отличаются от базового.
   */
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  /*
   * Цветность максимальна около 550
   * и плавно снижается к обоим краям.
   */
  --center-left:
    clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right:
    clamp(
      0,
      calc(
        (1000 - var(--i)) /
        (1000 - var(--pivot))
      ),
      1
    );
  --chroma-shape:
    sqrt(min(var(--center-left), var(--center-right)));
  /*
   * На краях остаётся 8% исходной цветности:
   * получается почти белый/чёрный, но с оттенком base-color.
   */
  --chroma-scale:
    calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
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
    --ui-explorer-row-height: 2.875rem;
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
    --shell-bg: var(--color-surface);
    --shell-fg: var(--color-on-surface);
    --shell-nav-bg: var(--color-surface-container-high);
    --shell-nav-fg: var(--color-on-surface);
    --shell-nav-border: var(--color-outline-variant);
    --shell-btn-hover: var(--color-surface-container);
    --shell-btn-active-bg: color-mix(in oklab, var(--color-primary) 18%, var(--color-surface));
    --shell-btn-active-fg: var(--color-on-surface);
    --shell-status-bg: var(--color-surface-container-low);
    --shell-status-fg: var(--color-on-surface);
    /* ── Faint shell tokens (subsystem boot shells) ───────────────────────
     * Derived from canonical \`--color-*\`; previously duplicated as
     * \`light-dark(var(--color-*), var(--color-*))\` in \`subsystem/boot/shells.scss\`.
     */
    --faint-nav-bg: var(--color-surface-container-high);
    --faint-nav-border: var(--color-outline-variant);
    --faint-sidebar-bg: var(--color-surface-container-high);
    /* ── Environment-shell tokens (color subset) ──────────────────────────
     * \`--env-status-fg\` / \`--env-launcher-fg*\` are concrete defaults: the
     * overlay status/launcher sit on wallpaper, so they carry their own
     * luminance values (wallpaper probe may override on \`:root\`).
     * Non-color \`--env-*\` (z-index, safe-area, insets) stay in environment-shell.
     */
    --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
    --env-status-fg-muted: color-mix(in oklab, var(--env-status-fg) 78%, transparent);
    --env-launcher-fg: #f7f7f8;
    --env-launcher-fg-shadow: rgb(0 0 0 / 0.88);
    --env-launcher-fg-glow: rgb(0 0 0 / 0.45);
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
    --sv-bg: var(--color-surface-container-low, light-dark(#eef1f6, #0f1318));
    --sv-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --sv-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --sv-outline: var(--color-outline-variant, light-dark(#c5cdd8, #3d4755));
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
@layer ux-classes {
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
}`})))()}var De;function Oe(){return(Oe=e((()=>{De=`@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 22.30.00_22.08.2026
 * Reason for changes: Light/dark primary-container so Start plates and chrome ink flip.
 */
/*
 * INVARIANT: This is the canonical color-token registry for the full veela bundle.
 * All color token DEFAULTS live here on \`:root, :host, :scope\`.
 * - \`misc/_tokens.scss\` is a symlink of this file.
 * - \`basic/misc/_tokens.scss\` and \`advanced/misc/_tokens.scss\` are intentional
 *   per-bundle SCSS alias shims (no CSS output) for the lightweight vl-basic / advanced
 *   bundles; they MUST NOT \`@forward\` this file (would pull the full \`@layer tokens\`
 *   CSS into those bundles and break their size semantics).
 * - \`basic/misc/_normalize.scss\` carries a documented vl-basic fallback palette for
 *   standalone vl-basic loading (no advanced MD3 tokens bundled).
 * - The advanced MD3/C2 system (\`advanced/tokens/_variables.scss\`, \`_color.scss\`,
 *   \`_shadow.scss\`) keeps its mixin/function definitions in place (depends on
 *   \`veela-lib\`); color-token EMISSION for that system is invoked from here where
 *   safe, otherwise remains in its layer with a pointer comment.
 * - Component/shell/view files keep only context overrides and shadow-DOM
 *   \`var(--token, light-dark(...))\` fallbacks; they never redefine a canonical default.
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
 * Change date and time: 15.50.00_22.08.2026
 * Reason for changes: Seed initial-value is the desktop cyan-blue fallback (#5a9ec8).
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these; surfaces derive via unregistered
 * \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\` and re-evaluate per used color-scheme.
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
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: legacy layer names remain in the registry while their consumers
 * migrate. New component rules use the \`ux-*\` names; no host may establish a
 * competing layer order by importing a second prelude.
 */
@layer ux-normalize,
    tokens,
    ux-tokens,
    base,
    ux-base,
    layout,
    ux-layout,
    shells,
    shell,
    views,
    view,
    viewer,
    components,
    ux-components,
    ux-layer,
    ui-icon,
    ui-icon-reset,
    ux-file-manager,
    ux-file-manager-content,
    utilities,
    ux-utilities,
    theme,
    ux-theme,
    markdown,
    essentials,
    print,
    print-breaks,
    view-transitions,
    overrides,
    ux-overrides;
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  /* Ограничиваем индекс */
  --i: clamp(0, var(--index), 1000);
  /* Переданный цвет считается оттенком 550 */
  --pivot: 550;
  /* Расстояние от базового цвета к белой и чёрной границам */
  --white-distance:
    clamp(
      0,
      calc((var(--pivot) - var(--i)) / var(--pivot)),
      1
    );
  --black-distance:
    clamp(
      0,
      calc(
        (var(--i) - var(--pivot)) /
        (1000 - var(--pivot))
      ),
      1
    );
  /*
   * Нелинейное изменение светлоты:
   * близкие к 550 оттенки меньше отличаются от базового.
   */
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  /*
   * Цветность максимальна около 550
   * и плавно снижается к обоим краям.
   */
  --center-left:
    clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right:
    clamp(
      0,
      calc(
        (1000 - var(--i)) /
        (1000 - var(--pivot))
      ),
      1
    );
  --chroma-shape:
    sqrt(min(var(--center-left), var(--center-right)));
  /*
   * На краях остаётся 8% исходной цветности:
   * получается почти белый/чёрный, но с оттенком base-color.
   */
  --chroma-scale:
    calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
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
    --ui-explorer-row-height: 2.875rem;
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
    --shell-bg: var(--color-surface);
    --shell-fg: var(--color-on-surface);
    --shell-nav-bg: var(--color-surface-container-high);
    --shell-nav-fg: var(--color-on-surface);
    --shell-nav-border: var(--color-outline-variant);
    --shell-btn-hover: var(--color-surface-container);
    --shell-btn-active-bg: color-mix(in oklab, var(--color-primary) 18%, var(--color-surface));
    --shell-btn-active-fg: var(--color-on-surface);
    --shell-status-bg: var(--color-surface-container-low);
    --shell-status-fg: var(--color-on-surface);
    /* ── Faint shell tokens (subsystem boot shells) ───────────────────────
     * Derived from canonical \`--color-*\`; previously duplicated as
     * \`light-dark(var(--color-*), var(--color-*))\` in \`subsystem/boot/shells.scss\`.
     */
    --faint-nav-bg: var(--color-surface-container-high);
    --faint-nav-border: var(--color-outline-variant);
    --faint-sidebar-bg: var(--color-surface-container-high);
    /* ── Environment-shell tokens (color subset) ──────────────────────────
     * \`--env-status-fg\` / \`--env-launcher-fg*\` are concrete defaults: the
     * overlay status/launcher sit on wallpaper, so they carry their own
     * luminance values (wallpaper probe may override on \`:root\`).
     * Non-color \`--env-*\` (z-index, safe-area, insets) stay in environment-shell.
     */
    --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
    --env-status-fg-muted: color-mix(in oklab, var(--env-status-fg) 78%, transparent);
    --env-launcher-fg: #f7f7f8;
    --env-launcher-fg-shadow: rgb(0 0 0 / 0.88);
    --env-launcher-fg-glow: rgb(0 0 0 / 0.45);
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
    --sv-bg: var(--color-surface-container-low, light-dark(#eef1f6, #0f1318));
    --sv-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --sv-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --sv-outline: var(--color-outline-variant, light-dark(#c5cdd8, #3d4755));
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
@layer ux-classes {
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
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/misc/_tokens.scss
 * Change date and time: 12.30.00_06.08.2026
 * Reason for changes: Document canonical SoT for color tokens.
 */
/*
 * INVARIANT: Intentional per-bundle SCSS alias shim for the vl-basic bundle.
 * Produces NO CSS output — only \`$color-*\` / \`$space-*\` / \`$radius-*\` / \`$font-*\` SCSS aliases.
 * Canonical color-token source of truth: \`core/misc/_tokens.scss\` (full bundle).
 * Do NOT \`@forward\` canonical here — would emit the full \`@layer tokens\` CSS into the
 * lightweight vl-basic bundle and break its size semantics.
 */
/**
 * Veela CSS - Core Runtime
 *
 * Shared foundation styles for all veela variants.
 * This module provides:
 * - CSS layer definitions
 * - Normalize/reset styles
 * - Core layout utilities
 * - Base tokens and properties
 * - Essential state management
 *
 * Inherited by: basic, advanced, beercss
 */
@layer animations {
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
@layer ux-shapes {
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
}`})))()}async function ke(e){if(Ae===e)return;console.log(`[Veela] Loading variant:`,e);let t=async e=>{typeof e==`string`&&e.length&&await i(e)};if(e===`core`){await t(Te),Ae=e;return}await t(De),Ae=e}var Ae;function je(){return(je=e((()=>{o(),Ee(),Oe(),Ae=null})))()}async function Me(e){let t=Ne[e]||Ne[`vl-basic`];if(!t)throw Error(`Unknown style system: ${e}`);if(Pe===e){console.log(`[Styles] Style system '${e}' already loaded`);return}console.log(`[Styles] Loading style system: ${t.name}`),t.initFn&&await t.initFn(),Pe=e,console.log(`[Styles] Style system ${t.name} loaded`)}var Ne,Pe;function Fe(){return(Fe=e((()=>{je(),Ne={"vl-advanced":{id:`vl-advanced`,name:`Veela Advanced`,description:`Full-featured CSS framework with design tokens and effects`,variant:`advanced`,initFn:async()=>{try{await ke(`advanced`),console.log(`[Styles] Veela Advanced loaded`)}catch{}}},"vl-basic":{id:`vl-basic`,name:`Veela Basic Styles`,description:`Lightweight minimal styling for basic functionality`,variant:`basic`,initFn:async()=>{try{await ke(`basic`),console.log(`[Styles] Veela Basic Styles loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Basic Styles:`,e)}}},"vl-beercss":{id:`vl-beercss`,name:`Veela BeerCSS`,description:`Beer CSS compatible styling with Material Design 3`,variant:`beercss`,initFn:async()=>{try{await ke(`beercss`),console.log(`[Styles] Veela BeerCSS loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela BeerCSS:`,e)}}},"vl-core":{id:`vl-core`,name:`Veela Core`,description:`Shared foundation styles for all veela variants`,variant:`core`,initFn:async()=>{try{await ke(`core`),console.log(`[Styles] Veela Core loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Core:`,e)}}},raw:{id:`raw`,name:`Raw`,description:`No styling framework, browser defaults`,variant:`core`,initFn:async()=>{console.log(`[Styles] Raw mode - no styles loaded`)}}},Pe=null})))()}var Ie,Le,Re,ze,Be;function Ve(){return(Ve=e((()=>{_e(),Ie=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},Le=e=>{let t=Ie()?.Plugins?.[e];return t&&typeof t==`object`?t:null},Re=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch(e){console.warn(`[capacitor-settings-permissions]`,e);return}},ze=async e=>{let t=[],n=[],r=!1;if(!ve())return{lines:t,results:n,prompted:r};e.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let i=e.shell||{},a=i.acceptContactsBridgeData===!0,o=(i.bridgeDaemonEnabled??!0)!==!1,s=(i.enableRemoteClipboardBridge??!0)!==!1,c=o||s,l=Le(`CwsPlatform`);if(a||c){if(l?.requestSettingsPermissions){let e=await Re(l.requestSettingsPermissions,{contacts:a,sms:!1,notifications:c,overlay:!1}),i=!1;if(e&&typeof e==`object`){i=e.prompted===!0,r=i;let t=e.results;if(Array.isArray(t)){for(let e of t)if(e&&typeof e==`object`){let t=String(e.permission??``);if(t===`SYSTEM_ALERT_WINDOW`||t===`READ_SMS`||t===`RECEIVE_SMS`||t===`SEND_SMS`)continue;n.push({permission:t,granted:!!e.granted})}}}let o=n.filter(e=>e.granted===!1);o.length?t.push(`Permission denied: ${o.map(e=>e.permission).filter(Boolean).join(`, `)}`):i&&t.push(`Runtime permissions requested`)}else{let e=Le(`DevicePermissions`)||Le(`Permissions`),n=[];a&&n.push(`READ_CONTACTS`),c&&n.push(`POST_NOTIFICATIONS`),e?.requestPermissions&&n.length&&(await Re(e.requestPermissions,{permissions:n}),t.push(`Runtime permissions requested (legacy plugin)`))}}return o&&l?.startCwspBridge?(await Re(l.startCwspBridge),t.push(`CWSP foreground service started`)):!o&&l?.stopCwspBridge&&(await Re(l.stopCwspBridge),t.push(`CWSP foreground service stopped`)),{lines:t,results:n,prompted:r}},Be=async e=>{if(!ve()||((e?.shell||{}).bridgeDaemonEnabled??!0)===!1)return!1;e?.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let t=Le(`CwsPlatform`);return t?.startCwspBridge?(await Re(t.startCwspBridge),!0):!1}})))()}var He;function Ue(){return(Ue=e((()=>{He=(e,t)=>{if(typeof e==`number`){if(t===3)return{mode:`rgb`,r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|e&240)/255,b:(e&15|e<<4&240)/255};if(t===4)return{mode:`rgb`,r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|e&240)/255,alpha:(e&15|e<<4&240)/255};if(t===6)return{mode:`rgb`,r:(e>>16&255)/255,g:(e>>8&255)/255,b:(e&255)/255};if(t===8)return{mode:`rgb`,r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(e&255)/255}}}})))()}var We;function Ge(){return(Ge=e((()=>{We={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074}})))()}var Ke;function qe(){return(qe=e((()=>{Ue(),Ge(),Ke=e=>He(We[e.toLowerCase()],6)})))()}var Je,Ye;function Xe(){return(Xe=e((()=>{Ue(),Je=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,Ye=e=>{let t;return(t=e.match(Je))?He(parseInt(t[1],16),t[1].length):void 0}})))()}var b,Ze,Qe,$e,et,tt;function nt(){return(nt=e((()=>{b=`([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)`,`${b}`,Ze=`${b}%`,`${b}`,Qe=`(?:${b}%|${b})`,$e=`(?:${b}%|${b}|none)`,et=`(?:${b}(deg|grad|rad|turn)|${b})`,`${b}${b}`,tt=`\\s*,\\s*`,RegExp(`^`+$e+`$`)})))()}var rt,it,at;function ot(){return(ot=e((()=>{nt(),rt=RegExp(`^rgba?\\(\\s*${b}${tt}${b}${tt}${b}\\s*(?:,\\s*${Qe}\\s*)?\\)$`),it=RegExp(`^rgba?\\(\\s*${Ze}${tt}${Ze}${tt}${Ze}\\s*(?:,\\s*${Qe}\\s*)?\\)$`),at=e=>{let t={mode:`rgb`},n;if(n=e.match(rt))n[1]!==void 0&&(t.r=n[1]/255),n[2]!==void 0&&(t.g=n[2]/255),n[3]!==void 0&&(t.b=n[3]/255);else if(n=e.match(it))n[1]!==void 0&&(t.r=n[1]/100),n[2]!==void 0&&(t.g=n[2]/100),n[3]!==void 0&&(t.b=n[3]/100);else return;return n[4]===void 0?n[5]!==void 0&&(t.alpha=Math.max(0,Math.min(1,+n[5]))):t.alpha=Math.max(0,Math.min(1,n[4]/100)),t}})))()}var st;function ct(){return(ct=e((()=>{T(),st=(e,t)=>e===void 0?void 0:typeof e==`object`?e.mode===void 0?t?{...e,mode:t}:void 0:e:jt(e)})))()}var lt;function ut(){return(ut=e((()=>{_t(),ct(),lt=(e=`rgb`)=>t=>(t=st(t,e))===void 0?void 0:t.mode===e?t:x[t.mode][e]?x[t.mode][e](t):e===`rgb`?x[t.mode].rgb(t):x.rgb[e](x[t.mode].rgb(t))})))()}var x,dt,ft,pt,mt,S,ht,gt;function _t(){return(_t=e((()=>{ut(),x={},dt={},ft=[],pt={},mt=e=>e,S=e=>(x[e.mode]={...x[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach(t=>{x[t]||(x[t]={}),x[t][e.mode]=e.fromMode[t]}),e.ranges||={},e.difference||={},e.channels.forEach(t=>{if(e.ranges[t]===void 0&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw Error(`Missing interpolator for: ${t}`);typeof e.interpolate[t]==`function`&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=mt)}),dt[e.mode]=e,(e.parse||[]).forEach(t=>{gt(t,e.mode)}),lt(e.mode)),ht=e=>dt[e],gt=(e,t)=>{if(typeof e==`string`){if(!t)throw Error(`'mode' required when 'parser' is a string`);pt[e]=t}else typeof e==`function`&&ft.indexOf(e)<0&&ft.push(e)}})))()}function vt(e){let t=e[w],n=e[w+1];return t===`-`||t===`+`?/\d/.test(n)||n===`.`&&/\d/.test(e[w+2]):t===`.`?/\d/.test(n):/\d/.test(t)}function yt(e){if(w>=e.length)return!1;let t=e[w];if(Ot.test(t))return!0;if(t===`-`){if(e.length-w<2)return!1;let t=e[w+1];return!!(t===`-`||Ot.test(t))}return!1}function bt(e){let t=``;if((e[w]===`-`||e[w]===`+`)&&(t+=e[w++]),t+=xt(e),e[w]===`.`&&/\d/.test(e[w+1])&&(t+=e[w++]+xt(e)),(e[w]===`e`||e[w]===`E`)&&((e[w+1]===`-`||e[w+1]===`+`)&&/\d/.test(e[w+2])?t+=e[w++]+e[w++]+xt(e):/\d/.test(e[w+1])&&(t+=e[w++]+xt(e))),yt(e)){let n=St(e);return n===`deg`||n===`rad`||n===`turn`||n===`grad`?{type:C.Hue,value:t*At[n]}:void 0}return e[w]===`%`?(w++,{type:C.Percentage,value:+t}):{type:C.Number,value:+t}}function xt(e){let t=``;for(;/\d/.test(e[w]);)t+=e[w++];return t}function St(e){let t=``;for(;w<e.length&&kt.test(e[w]);)t+=e[w++];return t}function Ct(e){let t=St(e);return e[w]===`(`?(w++,{type:C.Function,value:t}):t===`none`?{type:C.None,value:void 0}:{type:C.Ident,value:t}}function wt(e=``){let t=e.trim(),n=[],r;for(w=0;w<t.length;){if(r=t[w++],r===`
`||r===`	`||r===` `){for(;w<t.length&&(t[w]===`
`||t[w]===`	`||t[w]===` `);)w++;continue}if(r===`,`)return;if(r===`)`){n.push({type:C.ParenClose});continue}if(r===`+`){if(w--,vt(t)){n.push(bt(t));continue}return}if(r===`-`){if(w--,vt(t)){n.push(bt(t));continue}if(yt(t)){n.push({type:C.Ident,value:St(t)});continue}return}if(r===`.`){if(w--,vt(t)){n.push(bt(t));continue}return}if(r===`/`){for(;w<t.length&&(t[w]===`
`||t[w]===`	`||t[w]===` `);)w++;let e;if(vt(t)&&(e=bt(t),e.type!==C.Hue)){n.push({type:C.Alpha,value:e});continue}if(yt(t)&&St(t)===`none`){n.push({type:C.Alpha,value:{type:C.None,value:void 0}});continue}return}if(/\d/.test(r)){w--,n.push(bt(t));continue}if(Ot.test(r)){w--,n.push(Ct(t));continue}return}return n}function Tt(e){e._i=0;let t=e[e._i++];if(!t||t.type!==C.Function||t.value!==`color`||(t=e[e._i++],t.type!==C.Ident))return;let n=pt[t.value];if(!n)return;let r={mode:n},i=Et(e,!1);if(!i)return;let a=ht(n).channels;for(let e=0,t,n;e<a.length;e++)t=i[e],n=a[e],t.type!==C.None&&(r[n]=t.type===C.Number?t.value:t.value/100,n===`alpha`&&(r[n]=Math.max(0,Math.min(1,r[n]))));return r}function Et(e,t){let n=[],r;for(;e._i<e.length;){if(r=e[e._i++],r.type===C.None||r.type===C.Number||r.type===C.Alpha||r.type===C.Percentage||t&&r.type===C.Hue){n.push(r);continue}if(r.type===C.ParenClose){if(e._i<e.length)return;continue}return}if(!(n.length<3||n.length>4)){if(n.length===4){if(n[3].type!==C.Alpha)return;n[3]=n[3].value}return n.length===3&&n.push({type:C.None,value:void 0}),n.every(e=>e.type!==C.Alpha)?n:void 0}}function Dt(e,t){e._i=0;let n=e[e._i++];if(!n||n.type!==C.Function)return;let r=Et(e,t);if(r)return r.unshift(n.value),r}var Ot,kt,C,w,At,jt;function T(){return(T=e((()=>{_t(),Ot=/[^\x00-\x7F]|[a-zA-Z_]/,kt=/[^\x00-\x7F]|[-\w]/,C={Function:`function`,Ident:`ident`,Number:`number`,Percentage:`percentage`,ParenClose:`)`,None:`none`,Hue:`hue`,Alpha:`alpha`},w=0,At={deg:1,rad:180/Math.PI,grad:9/10,turn:360},jt=e=>{if(typeof e!=`string`)return;let t=wt(e),n=t?Dt(t,!0):void 0,r,i=0,a=ft.length;for(;i<a;)if((r=ft[i++](e,n))!==void 0)return r;return t?Tt(t):void 0}})))()}function Mt(e,t){if(!t||t[0]!==`rgb`&&t[0]!==`rgba`)return;let n={mode:`rgb`},[,r,i,a,o]=t;if(r.type!==C.Hue&&i.type!==C.Hue&&a.type!==C.Hue)return r.type!==C.None&&(n.r=r.type===C.Number?r.value/255:r.value/100),i.type!==C.None&&(n.g=i.type===C.Number?i.value/255:i.value/100),a.type!==C.None&&(n.b=a.type===C.Number?a.value/255:a.value/100),o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function Nt(){return(Nt=e((()=>{T()})))()}var Pt;function Ft(){return(Ft=e((()=>{Pt=e=>e===`transparent`?{mode:`rgb`,r:0,g:0,b:0,alpha:0}:void 0})))()}var It;function Lt(){return(Lt=e((()=>{It=(e,t,n)=>e+n*(t-e)})))()}var Rt,zt;function Bt(){return(Bt=e((()=>{Rt=e=>{let t=[];for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1];r===void 0&&i===void 0?t.push(void 0):r!==void 0&&i!==void 0?t.push([r,i]):t.push(r===void 0?[i,i]:[r,r])}return t},zt=e=>t=>{let n=Rt(t);return t=>{let r=t*n.length,i=t>=1?n.length-1:Math.max(Math.floor(r),0),a=n[i];return a===void 0?void 0:e(a[0],a[1],r-i)}}})))()}var E;function D(){return(D=e((()=>{Lt(),Bt(),E=zt(It)})))()}var O;function k(){return(k=e((()=>{O=e=>{let t=!1,n=e.map(e=>e===void 0?1:(t=!0,e));return t?n:e}})))()}var A;function j(){return(j=e((()=>{qe(),Xe(),ot(),Nt(),Ft(),D(),k(),A={mode:`rgb`,channels:[`r`,`g`,`b`,`alpha`],parse:[Mt,Ye,at,Ke,Pt,`srgb`],serialize:`srgb`,interpolate:{r:E,g:E,b:E,alpha:{use:E,fixup:O}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}}})))()}var Vt,Ht;function Ut(){return(Ut=e((()=>{Vt=(e=0)=>Math.abs(e)**(563/256)*Math.sign(e),Ht=e=>{let t=Vt(e.r),n=Vt(e.g),r=Vt(e.b),i={mode:`xyz65`,x:.5766690429101305*t+.1855582379065463*n+.1882286462349947*r,y:.297344975250536*t+.6273635662554661*n+.0752914584939979*r,z:.0270313613864123*t+.0706888525358272*n+.9913375368376386*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i}})))()}var Wt,Gt;function Kt(){return(Kt=e((()=>{Wt=e=>Math.abs(e)**(256/563)*Math.sign(e),Gt=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`a98`,r:Wt(e*2.0415879038107465-t*.5650069742788597-.3447313507783297*n),g:Wt(e*-.9692436362808798+t*1.8759675015077206+.0415550574071756*n),b:Wt(e*.0134442806320312-t*.1183623922310184+1.0151749943912058*n)};return r!==void 0&&(i.alpha=r),i}})))()}var qt,M;function N(){return(N=e((()=>{qt=(e=0)=>{let t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*((t+.055)/1.055)**2.4},M=({r:e,g:t,b:n,alpha:r})=>{let i={mode:`lrgb`,r:qt(e),g:qt(t),b:qt(n)};return r!==void 0&&(i.alpha=r),i}})))()}var P;function F(){return(F=e((()=>{N(),P=e=>{let{r:t,g:n,b:r,alpha:i}=M(e),a={mode:`xyz65`,x:.4123907992659593*t+.357584339383878*n+.1804807884018343*r,y:.2126390058715102*t+.715168678767756*n+.0721923153607337*r,z:.0193308187155918*t+.119194779794626*n+.9505321522496607*r};return i!==void 0&&(a.alpha=i),a}})))()}var Jt,I;function L(){return(L=e((()=>{Jt=(e=0)=>{let t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*t**(1/2.4)-.055):e*12.92},I=({r:e,g:t,b:n,alpha:r},i=`rgb`)=>{let a={mode:i,r:Jt(e),g:Jt(t),b:Jt(n)};return r!==void 0&&(a.alpha=r),a}})))()}var R;function z(){return(z=e((()=>{L(),R=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=I({r:e*3.2409699419045226-t*1.537383177570094-.4986107602930034*n,g:e*-.9692436362808796+t*1.8759675015077204+.0415550574071756*n,b:e*.0556300796969936-t*.2039769588889765+1.0569715142428784*n});return r!==void 0&&(i.alpha=r),i}})))()}var Yt;function Xt(){return(Xt=e((()=>{j(),Ut(),Kt(),F(),z(),Yt={...A,mode:`a98`,parse:[`a98-rgb`],serialize:`a98-rgb`,fromMode:{rgb:e=>Gt(P(e)),xyz65:Gt},toMode:{rgb:e=>R(Ht(e)),xyz65:Ht}}})))()}var B;function V(){return(V=e((()=>{B=e=>(e%=360)<0?e+360:e})))()}var Zt,H;function U(){return(U=e((()=>{V(),Zt=(e,t)=>e.map((n,r,i)=>{if(n===void 0)return n;let a=B(n);return r===0||e[r-1]===void 0?a:t(a-B(i[r-1]))}).reduce((e,t)=>!e.length||t===void 0||e[e.length-1]===void 0?(e.push(t),e):(e.push(t+e[e.length-1]),e),[]),H=e=>Zt(e,e=>Math.abs(e)<=180?e:e-360*Math.sign(e))})))()}var W,Qt,$t;function en(){return(en=e((()=>{W=[-.14861,1.78277,-.29227,-.90649,1.97294,0],Qt=Math.PI/180,$t=180/Math.PI})))()}var tn,nn,rn,an;function on(){return(on=e((()=>{en(),tn=W[3]*W[4],nn=W[1]*W[4],rn=W[1]*W[2]-W[0]*W[3],an=({r:e,g:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(rn*n+e*tn-t*nn)/(rn+tn-nn),a=n-i,o=(W[4]*(t-i)-W[2]*a)/W[3],s={mode:`cubehelix`,l:i,s:i===0||i===1?void 0:Math.sqrt(a*a+o*o)/(W[4]*i*(1-i))};return s.s&&(s.h=Math.atan2(o,a)*$t-120),r!==void 0&&(s.alpha=r),s}})))()}var sn;function cn(){return(cn=e((()=>{en(),sn=({h:e,s:t,l:n,alpha:r})=>{let i={mode:`rgb`};e=(e===void 0?0:e+120)*Qt,n===void 0&&(n=0);let a=t===void 0?0:t*n*(1-n),o=Math.cos(e),s=Math.sin(e);return i.r=n+a*(W[0]*o+W[1]*s),i.g=n+a*(W[2]*o+W[3]*s),i.b=n+a*(W[4]*o+W[5]*s),r!==void 0&&(i.alpha=r),i}})))()}var ln,un,dn;function G(){return(G=e((()=>{V(),ln=(e,t)=>{if(e.h===void 0||t.h===void 0||!e.s||!t.s)return 0;let n=B(e.h),r=B(t.h),i=Math.sin((r-n+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*i},un=(e,t)=>{if(e.h===void 0||t.h===void 0)return 0;let n=B(e.h),r=B(t.h);return Math.abs(r-n)>180?n-(r-360*Math.sign(r-n)):r-n},dn=(e,t)=>{if(e.h===void 0||t.h===void 0||!e.c||!t.c)return 0;let n=B(e.h),r=B(t.h),i=Math.sin((r-n+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*i}})))()}var K;function q(){return(q=e((()=>{K=e=>{let t=e.reduce((e,t)=>{if(t!==void 0){let n=t*Math.PI/180;e.sin+=Math.sin(n),e.cos+=Math.cos(n)}return e},{sin:0,cos:0}),n=Math.atan2(t.sin,t.cos)*180/Math.PI;return n<0?360+n:n}})))()}var fn;function pn(){return(pn=e((()=>{U(),k(),D(),on(),cn(),G(),q(),fn={mode:`cubehelix`,channels:[`h`,`s`,`l`,`alpha`],parse:[`--cubehelix`],serialize:`--cubehelix`,ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:an},toMode:{rgb:sn},interpolate:{h:{use:E,fixup:H},s:E,l:E,alpha:{use:E,fixup:O}},difference:{h:ln},average:{h:K}}})))()}var J;function mn(){return(mn=e((()=>{V(),J=({l:e,a:t,b:n,alpha:r},i=`lch`)=>{t===void 0&&(t=0),n===void 0&&(n=0);let a=Math.sqrt(t*t+n*n),o={mode:i,l:e,c:a};return a&&(o.h=B(Math.atan2(n,t)*180/Math.PI)),r!==void 0&&(o.alpha=r),o}})))()}var Y;function hn(){return(hn=e((()=>{Y=({l:e,c:t,h:n,alpha:r},i=`lab`)=>{n===void 0&&(n=0);let a={mode:i,l:e,a:t?t*Math.cos(n/180*Math.PI):0,b:t?t*Math.sin(n/180*Math.PI):0};return r!==void 0&&(a.alpha=r),a}})))()}var gn,_n;function vn(){return(vn=e((()=>{gn=29**3/27,_n=216/29**3})))()}var X,Z;function yn(){return(yn=e((()=>{X={X:.3457/.3585,Y:1,Z:.2958/.3585},Z={X:.3127/.329,Y:1,Z:.3583/.329}})))()}var bn,xn;function Sn(){return(Sn=e((()=>{vn(),yn(),bn=e=>e**3>_n?e**3:(116*e-16)/gn,xn=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+16)/116,a=t/500+i,o=i-n/200,s={mode:`xyz65`,x:bn(a)*Z.X,y:bn(i)*Z.Y,z:bn(o)*Z.Z};return r!==void 0&&(s.alpha=r),s}})))()}var Cn;function wn(){return(wn=e((()=>{Sn(),z(),Cn=e=>R(xn(e))})))()}var Tn,En;function Dn(){return(Dn=e((()=>{vn(),yn(),Tn=e=>e>_n?Math.cbrt(e):(gn*e+16)/116,En=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Tn(e/Z.X),a=Tn(t/Z.Y),o=Tn(n/Z.Z),s={mode:`lab65`,l:116*a-16,a:500*(i-a),b:200*(a-o)};return r!==void 0&&(s.alpha=r),s}})))()}var On;function kn(){return(kn=e((()=>{F(),Dn(),On=e=>{let t=En(P(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})))()}var An,jn,Mn,Nn;function Pn(){return(Pn=e((()=>{An=26/180*Math.PI,jn=Math.cos(An),Mn=Math.sin(An),Nn=100/Math.log(139/100)})))()}var Fn;function In(){return(In=e((()=>{Pn(),Fn=({l:e,c:t,h:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`lab65`,l:(Math.exp(e*1/Nn)-1)/.0039},a=(Math.exp(.0435*t*1*1)-1)/.075,o=a*Math.cos(n/180*Math.PI-An),s=a*Math.sin(n/180*Math.PI-An);return i.a=o*jn-s/.83*Mn,i.b=o*Mn+s/.83*jn,r!==void 0&&(i.alpha=r),i}})))()}var Ln;function Rn(){return(Rn=e((()=>{Pn(),V(),Ln=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=t*jn+n*Mn,a=.83*(n*jn-t*Mn),o=Math.sqrt(i*i+a*a),s={mode:`dlch`,l:Nn/1*Math.log(1+.0039*e),c:Math.log(1+.075*o)/.0435};return s.c&&(s.h=B((Math.atan2(a,i)+An)/Math.PI*180)),r!==void 0&&(s.alpha=r),s}})))()}var zn,Bn,Vn;function Hn(){return(Hn=e((()=>{mn(),hn(),wn(),kn(),In(),Rn(),D(),k(),zn=e=>Fn(J(e,`dlch`)),Bn=e=>Y(Ln(e),`dlab`),Vn={mode:`dlab`,parse:[`--din99o-lab`],serialize:`--din99o-lab`,toMode:{lab65:zn,rgb:e=>Cn(zn(e))},fromMode:{lab65:Bn,rgb:e=>Bn(On(e))},channels:[`l`,`a`,`b`,`alpha`],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:E,a:E,b:E,alpha:{use:E,fixup:O}}}})))()}var Un;function Wn(){return(Wn=e((()=>{mn(),hn(),In(),Rn(),wn(),kn(),U(),k(),D(),G(),q(),Un={mode:`dlch`,parse:[`--din99o-lch`],serialize:`--din99o-lch`,toMode:{lab65:Fn,dlab:e=>Y(e,`dlab`),rgb:e=>Cn(Fn(e))},fromMode:{lab65:Ln,dlab:e=>J(e,`dlch`),rgb:e=>Ln(On(e))},channels:[`l`,`c`,`h`,`alpha`],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:E,c:E,h:{use:E,fixup:H},alpha:{use:E,fixup:O}},difference:{h:dn},average:{h:K}}})))()}function Gn({h:e,s:t,i:n,alpha:r}){e=B(e===void 0?0:e),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.abs(e/60%2-1),a;switch(Math.floor(e/60)){case 0:a={r:n*(1+t*(3/(2-i)-1)),g:n*(1+t*(3*(1-i)/(2-i)-1)),b:n*(1-t)};break;case 1:a={r:n*(1+t*(3*(1-i)/(2-i)-1)),g:n*(1+t*(3/(2-i)-1)),b:n*(1-t)};break;case 2:a={r:n*(1-t),g:n*(1+t*(3/(2-i)-1)),b:n*(1+t*(3*(1-i)/(2-i)-1))};break;case 3:a={r:n*(1-t),g:n*(1+t*(3*(1-i)/(2-i)-1)),b:n*(1+t*(3/(2-i)-1))};break;case 4:a={r:n*(1+t*(3*(1-i)/(2-i)-1)),g:n*(1-t),b:n*(1+t*(3/(2-i)-1))};break;case 5:a={r:n*(1+t*(3/(2-i)-1)),g:n*(1-t),b:n*(1+t*(3*(1-i)/(2-i)-1))};break;default:a={r:n*(1-t),g:n*(1-t),b:n*(1-t)}}return a.mode=`rgb`,r!==void 0&&(a.alpha=r),a}function Kn(){return(Kn=e((()=>{V()})))()}function qn({r:e,g:t,b:n,alpha:r}){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.max(e,t,n),a=Math.min(e,t,n),o={mode:`hsi`,s:e+t+n===0?0:1-3*a/(e+t+n),i:(e+t+n)/3};return i-a!==0&&(o.h=(i===e?(t-n)/(i-a)+(t<n)*6:i===t?(n-e)/(i-a)+2:(e-t)/(i-a)+4)*60),r!==void 0&&(o.alpha=r),o}var Jn;function Yn(){return(Yn=e((()=>{Kn(),U(),k(),D(),G(),q(),Jn={mode:`hsi`,toMode:{rgb:Gn},parse:[`--hsi`],serialize:`--hsi`,fromMode:{rgb:qn},channels:[`h`,`s`,`i`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,interpolate:{h:{use:E,fixup:H},s:E,i:E,alpha:{use:E,fixup:O}},difference:{h:ln},average:{h:K}}})))()}function Xn({h:e,s:t,l:n,alpha:r}){e=B(e===void 0?0:e),t===void 0&&(t=0),n===void 0&&(n=0);let i=n+t*(n<.5?n:1-n),a=i-(i-n)*2*Math.abs(e/60%2-1),o;switch(Math.floor(e/60)){case 0:o={r:i,g:a,b:2*n-i};break;case 1:o={r:a,g:i,b:2*n-i};break;case 2:o={r:2*n-i,g:i,b:a};break;case 3:o={r:2*n-i,g:a,b:i};break;case 4:o={r:a,g:2*n-i,b:i};break;case 5:o={r:i,g:2*n-i,b:a};break;default:o={r:2*n-i,g:2*n-i,b:2*n-i}}return o.mode=`rgb`,r!==void 0&&(o.alpha=r),o}function Zn(){return(Zn=e((()=>{V()})))()}function Qn({r:e,g:t,b:n,alpha:r}){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.max(e,t,n),a=Math.min(e,t,n),o={mode:`hsl`,s:i===a?0:(i-a)/(1-Math.abs(i+a-1)),l:.5*(i+a)};return i-a!==0&&(o.h=(i===e?(t-n)/(i-a)+(t<n)*6:i===t?(n-e)/(i-a)+2:(e-t)/(i-a)+4)*60),r!==void 0&&(o.alpha=r),o}var $n;function er(){return(er=e((()=>{$n=(e,t)=>{switch(t){case`deg`:return+e;case`rad`:return e/Math.PI*180;case`grad`:return e/10*9;case`turn`:return e*360}}})))()}var tr,nr;function rr(){return(rr=e((()=>{er(),nt(),tr=RegExp(`^hsla?\\(\\s*${et}${tt}${Ze}${tt}${Ze}\\s*(?:,\\s*${Qe}\\s*)?\\)$`),nr=e=>{let t=e.match(tr);if(!t)return;let n={mode:`hsl`};return t[3]===void 0?t[1]!==void 0&&t[2]!==void 0&&(n.h=$n(t[1],t[2])):n.h=+t[3],t[4]!==void 0&&(n.s=Math.min(Math.max(0,t[4]/100),1)),t[5]!==void 0&&(n.l=Math.min(Math.max(0,t[5]/100),1)),t[6]===void 0?t[7]!==void 0&&(n.alpha=Math.max(0,Math.min(1,+t[7]))):n.alpha=Math.max(0,Math.min(1,t[6]/100)),n}})))()}function ir(e,t){if(!t||t[0]!==`hsl`&&t[0]!==`hsla`)return;let n={mode:`hsl`},[,r,i,a,o]=t;if(r.type!==C.None){if(r.type===C.Percentage)return;n.h=r.value}if(i.type!==C.None){if(i.type===C.Hue)return;n.s=i.value/100}if(a.type!==C.None){if(a.type===C.Hue)return;n.l=a.value/100}return o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function ar(){return(ar=e((()=>{T()})))()}var or;function sr(){return(sr=e((()=>{Zn(),rr(),ar(),U(),k(),D(),G(),q(),or={mode:`hsl`,toMode:{rgb:Xn},fromMode:{rgb:Qn},channels:[`h`,`s`,`l`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,parse:[ir,nr],serialize:e=>`hsl(${e.h===void 0?`none`:e.h} ${e.s===void 0?`none`:e.s*100+`%`} ${e.l===void 0?`none`:e.l*100+`%`}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{h:{use:E,fixup:H},s:E,l:E,alpha:{use:E,fixup:O}},difference:{h:ln},average:{h:K}}})))()}function cr({h:e,s:t,v:n,alpha:r}){e=B(e===void 0?0:e),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.abs(e/60%2-1),a;switch(Math.floor(e/60)){case 0:a={r:n,g:n*(1-t*i),b:n*(1-t)};break;case 1:a={r:n*(1-t*i),g:n,b:n*(1-t)};break;case 2:a={r:n*(1-t),g:n,b:n*(1-t*i)};break;case 3:a={r:n*(1-t),g:n*(1-t*i),b:n};break;case 4:a={r:n*(1-t*i),g:n*(1-t),b:n};break;case 5:a={r:n,g:n*(1-t),b:n*(1-t*i)};break;default:a={r:n*(1-t),g:n*(1-t),b:n*(1-t)}}return a.mode=`rgb`,r!==void 0&&(a.alpha=r),a}function lr(){return(lr=e((()=>{V()})))()}function ur({r:e,g:t,b:n,alpha:r}){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.max(e,t,n),a=Math.min(e,t,n),o={mode:`hsv`,s:i===0?0:1-a/i,v:i};return i-a!==0&&(o.h=(i===e?(t-n)/(i-a)+(t<n)*6:i===t?(n-e)/(i-a)+2:(e-t)/(i-a)+4)*60),r!==void 0&&(o.alpha=r),o}var dr;function fr(){return(fr=e((()=>{lr(),U(),k(),D(),G(),q(),dr={mode:`hsv`,toMode:{rgb:cr},parse:[`--hsv`],serialize:`--hsv`,fromMode:{rgb:ur},channels:[`h`,`s`,`v`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,interpolate:{h:{use:E,fixup:H},s:E,v:E,alpha:{use:E,fixup:O}},difference:{h:ln},average:{h:K}}})))()}function pr({h:e,w:t,b:n,alpha:r}){if(t===void 0&&(t=0),n===void 0&&(n=0),t+n>1){let e=t+n;t/=e,n/=e}return cr({h:e,s:n===1?1:1-t/(1-n),v:1-n,alpha:r})}function mr(){return(mr=e((()=>{lr()})))()}function hr(e){let t=ur(e);if(t===void 0)return;let n=t.s===void 0?0:t.s,r=t.v===void 0?0:t.v,i={mode:`hwb`,w:(1-n)*r,b:1-r};return t.h!==void 0&&(i.h=t.h),t.alpha!==void 0&&(i.alpha=t.alpha),i}function gr(){return(gr=e((()=>{})))()}function _r(e,t){if(!t||t[0]!==`hwb`)return;let n={mode:`hwb`},[,r,i,a,o]=t;if(r.type!==C.None){if(r.type===C.Percentage)return;n.h=r.value}if(i.type!==C.None){if(i.type===C.Hue)return;n.w=i.value/100}if(a.type!==C.None){if(a.type===C.Hue)return;n.b=a.value/100}return o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function vr(){return(vr=e((()=>{T()})))()}var yr;function br(){return(br=e((()=>{mr(),gr(),vr(),U(),k(),D(),G(),q(),yr={mode:`hwb`,toMode:{rgb:pr},fromMode:{rgb:hr},channels:[`h`,`w`,`b`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,parse:[_r],serialize:e=>`hwb(${e.h===void 0?`none`:e.h} ${e.w===void 0?`none`:e.w*100+`%`} ${e.b===void 0?`none`:e.b*100+`%`}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{h:{use:E,fixup:H},w:E,b:E,alpha:{use:E,fixup:O}},difference:{h:un},average:{h:K}}})))()}function xr(e){if(e<0)return 0;let t=e**(1/wr);return 1e4*(Math.max(0,t-Tr)/(Er-Dr*t))**(1/Cr)}function Sr(e){if(e<0)return 0;let t=(e/1e4)**Cr;return((Tr+Er*t)/(1+Dr*t))**+wr}var Cr,wr,Tr,Er,Dr;function Or(){return(Or=e((()=>{Cr=.1593017578125,wr=78.84375,Tr=.8359375,Er=18.8515625,Dr=18.6875})))()}var kr,Ar;function jr(){return(jr=e((()=>{Or(),kr=e=>Math.max(e/203,0),Ar=({i:e,t,p:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=xr(e+.008609037037932761*t+.11102962500302593*n),a=xr(e-.00860903703793275*t-.11102962500302599*n),o=xr(e+.5600313357106791*t-.32062717498731885*n),s={mode:`xyz65`,x:kr(2.070152218389422*i-1.3263473389671556*a+.2066510476294051*o),y:kr(.3647385209748074*i+.680566024947227*a-.0453045459220346*o),z:kr(-.049747207535812*i-.0492609666966138*a+1.1880659249923042*o)};return r!==void 0&&(s.alpha=r),s}})))()}var Mr,Nr;function Pr(){return(Pr=e((()=>{Or(),Mr=(e=0)=>Math.max(e*203,0),Nr=({x:e,y:t,z:n,alpha:r})=>{let i=Mr(e),a=Mr(t),o=Mr(n),s=Sr(.3592832590121217*i+.6976051147779502*a-.0358915932320289*o),c=Sr(-.1920808463704995*i+1.1004767970374323*a+.0753748658519118*o),l=Sr(.0070797844607477*i+.0748396662186366*a+.8433265453898765*o),u={mode:`itp`,i:.5*s+.5*c,t:1.61376953125*s-3.323486328125*c+1.709716796875*l,p:4.378173828125*s-4.24560546875*c-.132568359375*l};return r!==void 0&&(u.alpha=r),u}})))()}var Fr;function Ir(){return(Ir=e((()=>{D(),k(),jr(),Pr(),F(),z(),Fr={mode:`itp`,channels:[`i`,`t`,`p`,`alpha`],parse:[`--ictcp`],serialize:`--ictcp`,toMode:{xyz65:Ar,rgb:e=>R(Ar(e))},fromMode:{xyz65:Nr,rgb:e=>Nr(P(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:E,t:E,p:E,alpha:{use:E,fixup:O}}}})))()}var Lr,Rr,zr,Br,Vr;function Hr(){return(Hr=e((()=>{Or(),Lr=134.03437499999998,Rr=16295499532821565e-27,zr=e=>{if(e<0)return 0;let t=(e/1e4)**Cr;return((Tr+Er*t)/(1+Dr*t))**+Lr},Br=(e=0)=>Math.max(e*203,0),Vr=({x:e,y:t,z:n,alpha:r})=>{e=Br(e),t=Br(t),n=Br(n);let i=1.15*e-.15*n,a=.66*t+.34*e,o=zr(.41478972*i+.579999*a+.014648*n),s=zr(-.20151*i+1.120649*a+.0531008*n),c=zr(-.0166008*i+.2648*a+.6684799*n),l=(o+s)/2,u={mode:`jab`,j:.44*l/(1-.56*l)-Rr,a:3.524*o-4.066708*s+.542708*c,b:.199076*o+1.096799*s-1.295875*c};return r!==void 0&&(u.alpha=r),u}})))()}var Ur,Wr,Gr,Kr,qr;function Jr(){return(Jr=e((()=>{Or(),Ur=134.03437499999998,Wr=16295499532821565e-27,Gr=e=>{if(e<0)return 0;let t=e**(1/Ur);return 1e4*((Tr-t)/(Dr*t-Er))**(1/Cr)},Kr=e=>e/203,qr=({j:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+Wr)/(.44+.56*(e+Wr)),a=Gr(i+.13860504*t+.058047316*n),o=Gr(i-.13860504*t-.058047316*n),s=Gr(i-.096019242*t-.8118919*n),c={mode:`xyz65`,x:Kr(1.661373024652174*a-.914523081304348*o+.23136208173913045*s),y:Kr(-.3250758611844533*a+1.571847026732543*o-.21825383453227928*s),z:Kr(-.090982811*a-.31272829*o+1.5227666*s)};return r!==void 0&&(c.alpha=r),c}})))()}var Yr;function Xr(){return(Xr=e((()=>{Hr(),F(),Yr=e=>{let t=Vr(P(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})))()}var Zr;function Qr(){return(Qr=e((()=>{z(),Jr(),Zr=e=>R(qr(e))})))()}var $r;function ei(){return(ei=e((()=>{Hr(),Jr(),Xr(),Qr(),D(),k(),$r={mode:`jab`,channels:[`j`,`a`,`b`,`alpha`],parse:[`--jzazbz`],serialize:`--jzazbz`,fromMode:{rgb:Yr,xyz65:Vr},toMode:{rgb:Zr,xyz65:qr},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:E,a:E,b:E,alpha:{use:E,fixup:O}}}})))()}var ti;function ni(){return(ni=e((()=>{V(),ti=({j:e,a:t,b:n,alpha:r})=>{t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.sqrt(t*t+n*n),a={mode:`jch`,j:e,c:i};return i&&(a.h=B(Math.atan2(n,t)*180/Math.PI)),r!==void 0&&(a.alpha=r),a}})))()}var ri;function ii(){return(ii=e((()=>{ri=({j:e,c:t,h:n,alpha:r})=>{n===void 0&&(n=0);let i={mode:`jab`,j:e,a:t?t*Math.cos(n/180*Math.PI):0,b:t?t*Math.sin(n/180*Math.PI):0};return r!==void 0&&(i.alpha=r),i}})))()}var ai;function oi(){return(oi=e((()=>{ni(),ii(),Qr(),Xr(),U(),k(),D(),G(),q(),ai={mode:`jch`,parse:[`--jzczhz`],serialize:`--jzczhz`,toMode:{jab:ri,rgb:e=>Zr(ri(e))},fromMode:{rgb:e=>ti(Yr(e)),jab:ti},channels:[`j`,`c`,`h`,`alpha`],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:E,fixup:H},c:E,j:E,alpha:{use:E,fixup:O}},difference:{h:dn},average:{h:K}}})))()}var si,ci;function li(){return(li=e((()=>{si=29**3/27,ci=216/29**3})))()}var ui,di;function fi(){return(fi=e((()=>{li(),yn(),ui=e=>e**3>ci?e**3:(116*e-16)/si,di=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+16)/116,a=t/500+i,o=i-n/200,s={mode:`xyz50`,x:ui(a)*X.X,y:ui(i)*X.Y,z:ui(o)*X.Z};return r!==void 0&&(s.alpha=r),s}})))()}var pi;function mi(){return(mi=e((()=>{L(),pi=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=I({r:e*3.1341359569958707-t*1.6173863321612538-.4906619460083532*n,g:e*-.978795502912089+t*1.916254567259524+.03344273116131949*n,b:e*.07195537988411677-t*.2289768264158322+1.405386058324125*n});return r!==void 0&&(i.alpha=r),i}})))()}var hi;function gi(){return(gi=e((()=>{fi(),mi(),hi=e=>pi(di(e))})))()}var _i;function vi(){return(vi=e((()=>{N(),_i=e=>{let{r:t,g:n,b:r,alpha:i}=M(e),a={mode:`xyz50`,x:.436065742824811*t+.3851514688337912*n+.14307845442264197*r,y:.22249319175623702*t+.7168870538238823*n+.06061979053616537*r,z:.013923904500943465*t+.09708128566574634*n+.7140993584005155*r};return i!==void 0&&(a.alpha=i),a}})))()}var yi,bi;function xi(){return(xi=e((()=>{li(),yn(),yi=e=>e>ci?Math.cbrt(e):(si*e+16)/116,bi=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=yi(e/X.X),a=yi(t/X.Y),o=yi(n/X.Z),s={mode:`lab`,l:116*a-16,a:500*(i-a),b:200*(a-o)};return r!==void 0&&(s.alpha=r),s}})))()}var Si;function Ci(){return(Ci=e((()=>{vi(),xi(),Si=e=>{let t=bi(_i(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})))()}function wi(e,t){if(!t||t[0]!==`lab`)return;let n={mode:`lab`},[,r,i,a,o]=t;if(r.type!==C.Hue&&i.type!==C.Hue&&a.type!==C.Hue)return r.type!==C.None&&(n.l=Math.min(Math.max(0,r.value),100)),i.type!==C.None&&(n.a=i.type===C.Number?i.value:i.value*125/100),a.type!==C.None&&(n.b=a.type===C.Number?a.value:a.value*125/100),o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function Ti(){return(Ti=e((()=>{T()})))()}var Ei;function Di(){return(Di=e((()=>{gi(),fi(),Ci(),xi(),Ti(),D(),k(),Ei={mode:`lab`,toMode:{xyz50:di,rgb:hi},fromMode:{xyz50:bi,rgb:Si},channels:[`l`,`a`,`b`,`alpha`],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[wi],serialize:e=>`lab(${e.l===void 0?`none`:e.l} ${e.a===void 0?`none`:e.a} ${e.b===void 0?`none`:e.b}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{l:E,a:E,b:E,alpha:{use:E,fixup:O}}}})))()}var Oi;function ki(){return(ki=e((()=>{wn(),Sn(),kn(),Dn(),Di(),Oi={...Ei,mode:`lab65`,parse:[`--lab-d65`],serialize:`--lab-d65`,toMode:{xyz65:xn,rgb:Cn},fromMode:{xyz65:En,rgb:On},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}}})))()}function Ai(e,t){if(!t||t[0]!==`lch`)return;let n={mode:`lch`},[,r,i,a,o]=t;if(r.type!==C.None){if(r.type===C.Hue)return;n.l=Math.min(Math.max(0,r.value),100)}if(i.type!==C.None&&(n.c=Math.max(0,i.type===C.Number?i.value:i.value*150/100)),a.type!==C.None){if(a.type===C.Percentage)return;n.h=a.value}return o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function ji(){return(ji=e((()=>{T()})))()}var Mi;function Ni(){return(Ni=e((()=>{mn(),hn(),gi(),Ci(),ji(),U(),k(),D(),G(),q(),Mi={mode:`lch`,toMode:{lab:Y,rgb:e=>hi(Y(e))},fromMode:{rgb:e=>J(Si(e)),lab:J},channels:[`l`,`c`,`h`,`alpha`],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[Ai],serialize:e=>`lch(${e.l===void 0?`none`:e.l} ${e.c===void 0?`none`:e.c} ${e.h===void 0?`none`:e.h}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{h:{use:E,fixup:H},c:E,l:E,alpha:{use:E,fixup:O}},difference:{h:dn},average:{h:K}}})))()}var Pi;function Fi(){return(Fi=e((()=>{mn(),hn(),wn(),kn(),Ni(),Pi={...Mi,mode:`lch65`,parse:[`--lch-d65`],serialize:`--lch-d65`,toMode:{lab65:e=>Y(e,`lab65`),rgb:e=>Cn(Y(e,`lab65`))},fromMode:{rgb:e=>J(On(e),`lch65`),lab65:e=>J(e,`lch65`)},ranges:{l:[0,100],c:[0,150],h:[0,360]}}})))()}var Ii;function Li(){return(Li=e((()=>{V(),Ii=({l:e,u:t,v:n,alpha:r})=>{t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.sqrt(t*t+n*n),a={mode:`lchuv`,l:e,c:i};return i&&(a.h=B(Math.atan2(n,t)*180/Math.PI)),r!==void 0&&(a.alpha=r),a}})))()}var Ri;function zi(){return(zi=e((()=>{Ri=({l:e,c:t,h:n,alpha:r})=>{n===void 0&&(n=0);let i={mode:`luv`,l:e,u:t?t*Math.cos(n/180*Math.PI):0,v:t?t*Math.sin(n/180*Math.PI):0};return r!==void 0&&(i.alpha=r),i}})))()}var Bi,Vi,Hi,Ui,Wi,Gi;function Ki(){return(Ki=e((()=>{li(),yn(),Bi=(e,t,n)=>4*e/(e+15*t+3*n),Vi=(e,t,n)=>9*t/(e+15*t+3*n),Hi=Bi(X.X,X.Y,X.Z),Ui=Vi(X.X,X.Y,X.Z),Wi=e=>e<=ci?si*e:116*Math.cbrt(e)-16,Gi=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Wi(t/X.Y),a=Bi(e,t,n),o=Vi(e,t,n);!isFinite(a)||!isFinite(o)?i=a=o=0:(a=13*i*(a-Hi),o=13*i*(o-Ui));let s={mode:`luv`,l:i,u:a,v:o};return r!==void 0&&(s.alpha=r),s}})))()}var qi,Ji,Yi,Xi,Zi;function Qi(){return(Qi=e((()=>{li(),yn(),qi=(e,t,n)=>4*e/(e+15*t+3*n),Ji=(e,t,n)=>9*t/(e+15*t+3*n),Yi=qi(X.X,X.Y,X.Z),Xi=Ji(X.X,X.Y,X.Z),Zi=({l:e,u:t,v:n,alpha:r})=>{if(e===void 0&&(e=0),e===0)return{mode:`xyz50`,x:0,y:0,z:0};t===void 0&&(t=0),n===void 0&&(n=0);let i=t/(13*e)+Yi,a=n/(13*e)+Xi,o=X.Y*(e<=8?e/si:((e+16)/116)**3),s={mode:`xyz50`,x:9*i*o/(4*a),y:o,z:o*(12-3*i-20*a)/(4*a)};return r!==void 0&&(s.alpha=r),s}})))()}var $i,ea,ta;function na(){return(na=e((()=>{Li(),zi(),Ki(),Qi(),mi(),vi(),U(),k(),D(),G(),q(),$i=e=>Ii(Gi(_i(e))),ea=e=>pi(Zi(Ri(e))),ta={mode:`lchuv`,toMode:{luv:Ri,rgb:ea},fromMode:{rgb:$i,luv:Ii},channels:[`l`,`c`,`h`,`alpha`],parse:[`--lchuv`],serialize:`--lchuv`,ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:E,fixup:H},c:E,l:E,alpha:{use:E,fixup:O}},difference:{h:dn},average:{h:K}}})))()}var ra;function ia(){return(ia=e((()=>{j(),N(),L(),ra={...A,mode:`lrgb`,toMode:{rgb:I},fromMode:{rgb:M},parse:[`srgb-linear`],serialize:`srgb-linear`}})))()}var aa;function oa(){return(oa=e((()=>{Ki(),Qi(),mi(),vi(),D(),k(),aa={mode:`luv`,toMode:{xyz50:Zi,rgb:e=>pi(Zi(e))},fromMode:{xyz50:Gi,rgb:e=>Gi(_i(e))},channels:[`l`,`u`,`v`,`alpha`],parse:[`--luv`],serialize:`--luv`,ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:E,u:E,v:E,alpha:{use:E,fixup:O}}}})))()}var sa;function ca(){return(ca=e((()=>{sa=({r:e,g:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*n),a=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*n),o=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*n),s={mode:`oklab`,l:.210454268309314*i+.7936177747023054*a-.0040720430116193*o,a:1.9779985324311684*i-2.42859224204858*a+.450593709617411*o,b:.0259040424655478*i+.7827717124575296*a-.8086757549230774*o};return r!==void 0&&(s.alpha=r),s}})))()}var la;function ua(){return(ua=e((()=>{N(),ca(),la=e=>{let t=sa(M(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})))()}var da;function fa(){return(fa=e((()=>{da=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+.3963377773761749*t+.2158037573099136*n)**3,a=(e-.1055613458156586*t-.0638541728258133*n)**3,o=(e-.0894841775298119*t-1.2914855480194092*n)**3,s={mode:`lrgb`,r:4.076741636075957*i-3.3077115392580616*a+.2309699031821044*o,g:-1.2684379732850317*i+2.6097573492876887*a-.3413193760026573*o,b:-.0041960761386756*i-.7034186179359362*a+1.7076146940746117*o};return r!==void 0&&(s.alpha=r),s}})))()}var pa;function ma(){return(ma=e((()=>{L(),fa(),pa=e=>I(da(e))})))()}function ha(e){let t=.206,n=1.206/1.03;return .5*(n*e-t+Math.sqrt((n*e-t)*(n*e-t)+.12*n*e))}function ga(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function _a(e,t){let n,r,i,a,o,s,c,l;-1.88170328*e-.80936493*t>1?(n=1.19086277,r=1.76576728,i=.59662641,a=.75515197,o=.56771245,s=4.0767416621,c=-3.3077115913,l=.2309699292):1.81444104*e-1.19445276*t>1?(n=.73956515,r=-.45954404,i=.08285427,a=.1254107,o=.14503204,s=-1.2684380046,c=2.6097574011,l=-.3413193965):(n=1.35733652,r=-.00915799,i=-1.1513021,a=-.50559606,o=.00692167,s=-.0041960863,c=-.7034186147,l=1.707614701);let u=n+r*e+i*t+a*e*e+o*e*t,d=.3963377774*e+.2158037573*t,f=-.1055613458*e-.0638541728*t,p=-.0894841775*e-1.291485548*t;{let e=1+u*d,t=1+u*f,n=1+u*p,r=e*e*e,i=t*t*t,a=n*n*n,o=3*d*e*e,m=3*f*t*t,h=3*p*n*n,g=6*d*d*e,_=6*f*f*t,v=6*p*p*n,y=s*r+c*i+l*a,ee=s*o+c*m+l*h,te=s*g+c*_+l*v;u-=y*ee/(ee*ee-.5*y*te)}return u}function va(e,t){let n=_a(e,t),r=da({l:1,a:n*e,b:n*t}),i=Math.cbrt(1/Math.max(r.r,r.g,r.b));return[i,i*n]}function ya(e,t,n,r,i,a=null){a||=va(e,t);let o;if((n-i)*a[1]-(a[0]-i)*r<=0)o=a[1]*i/(r*a[0]+a[1]*(i-n));else{o=a[1]*(i-1)/(r*(a[0]-1)+a[1]*(i-n));{let a=n-i,s=r,c=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,u=-.0894841775*e-1.291485548*t,d=a+s*c,f=a+s*l,p=a+s*u;{let e=i*(1-o)+o*n,t=o*r,a=e+t*c,s=e+t*l,m=e+t*u,h=a*a*a,g=s*s*s,_=m*m*m,v=3*d*a*a,y=3*f*s*s,ee=3*p*m*m,te=6*d*d*a,ne=6*f*f*s,re=6*p*p*m,ie=4.0767416621*h-3.3077115913*g+.2309699292*_-1,ae=4.0767416621*v-3.3077115913*y+.2309699292*ee,oe=4.0767416621*te-3.3077115913*ne+.2309699292*re,se=ae/(ae*ae-.5*ie*oe),ce=-ie*se,le=-1.2684380046*h+2.6097574011*g-.3413193965*_-1,ue=-1.2684380046*v+2.6097574011*y-.3413193965*ee,de=-1.2684380046*te+2.6097574011*ne-.3413193965*re,fe=ue/(ue*ue-.5*le*de),pe=-le*fe,me=-.0041960863*h-.7034186147*g+1.707614701*_-1,he=-.0041960863*v-.7034186147*y+1.707614701*ee,ge=-.0041960863*te-.7034186147*ne+1.707614701*re,_e=he/(he*he-.5*me*ge),ve=-me*_e;ce=se>=0?ce:1e6,pe=fe>=0?pe:1e6,ve=_e>=0?ve:1e6,o+=Math.min(ce,Math.min(pe,ve))}}}return o}function ba(e,t,n=null){n||=va(e,t);let r=n[0],i=n[1];return[i/r,i/(1-r)]}function xa(e,t,n){let r=va(t,n),i=ya(t,n,e,1,e,r),a=ba(t,n,r),o=.11516993+1/(7.4477897+4.1590124*n+t*(-2.19557347+1.75198401*n+t*(-2.13704948-10.02301043*n+t*(-4.24894561+5.38770819*n+4.69891013*t)))),s=.11239642+1/(1.6132032-.68124379*n+t*(.40370612+.90148123*n+t*(-.27087943+.6122399*n+t*(.00299215-.45399568*n-.14661872*t)))),c=i/Math.min(e*a[0],(1-e)*a[1]),l=e*o,u=(1-e)*s,d=.9*c*Math.sqrt(Math.sqrt(1/(1/(l*l*l*l)+1/(u*u*u*u))));return l=e*.4,u=(1-e)*.8,[Math.sqrt(1/(1/(l*l)+1/(u*u))),d,i]}function Sa(){return(Sa=e((()=>{fa()})))()}function Ca(e){let t=e.l===void 0?0:e.l,n=e.a===void 0?0:e.a,r=e.b===void 0?0:e.b,i={mode:`okhsl`,l:ha(t)};e.alpha!==void 0&&(i.alpha=e.alpha);let a=Math.sqrt(n*n+r*r);if(!a)return i.s=0,i;let[o,s,c]=xa(t,n/a,r/a),l;if(a<s){let e=.8*o,t=1-e/s;l=(a-0)/(e+t*(a-0))*.8}else{let e=s,t=.2*s*s*1.25*1.25/o,n=1-t/(c-s);l=.8+.2*((a-e)/(t+n*(a-e)))}return l&&(i.s=l,i.h=B(Math.atan2(r,n)*180/Math.PI)),i}function wa(){return(wa=e((()=>{V(),Sa()})))()}function Ta(e){let t=e.h===void 0?0:e.h,n=e.s===void 0?0:e.s,r=e.l===void 0?0:e.l,i={mode:`oklab`,l:ga(r)};if(e.alpha!==void 0&&(i.alpha=e.alpha),!n||r===1)return i.a=i.b=0,i;let a=Math.cos(t/180*Math.PI),o=Math.sin(t/180*Math.PI),[s,c,l]=xa(i.l,a,o),u,d,f,p;n<.8?(u=1.25*n,d=0,f=.8*s,p=1-f/c):(u=5*(n-.8),d=c,f=.2*c*c*1.25*1.25/s,p=1-f/(l-c));let m=d+u*f/(1-p*u);return i.a=m*a,i.b=m*o,i}function Ea(){return(Ea=e((()=>{Sa()})))()}var Da;function Oa(){return(Oa=e((()=>{ua(),ma(),wa(),Ea(),sr(),Da={...or,mode:`okhsl`,channels:[`h`,`s`,`l`,`alpha`],parse:[`--okhsl`],serialize:`--okhsl`,fromMode:{oklab:Ca,rgb:e=>Ca(la(e))},toMode:{oklab:Ta,rgb:e=>pa(Ta(e))}}})))()}function ka(e){let t=e.l===void 0?0:e.l,n=e.a===void 0?0:e.a,r=e.b===void 0?0:e.b,i=Math.sqrt(n*n+r*r),a=i?n/i:1,o=i?r/i:1,[s,c]=ba(a,o),l=.5,u=1-l/s,d=c/(i+t*c),f=d*t,p=d*i,m=ga(f),h=p*m/f,g=da({l:m,a:a*h,b:o*h}),_=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=_,i=i/_*ha(t)/t,t=ha(t);let v={mode:`okhsv`,s:i?(l+c)*p/(c*l+c*u*p):0,v:t?t/f:0};return v.s&&(v.h=B(Math.atan2(r,n)*180/Math.PI)),e.alpha!==void 0&&(v.alpha=e.alpha),v}function Aa(){return(Aa=e((()=>{V(),fa(),Sa()})))()}function ja(e){let t={mode:`oklab`};e.alpha!==void 0&&(t.alpha=e.alpha);let n=e.h===void 0?0:e.h,r=e.s===void 0?0:e.s,i=e.v===void 0?0:e.v,a=Math.cos(n/180*Math.PI),o=Math.sin(n/180*Math.PI),[s,c]=ba(a,o),l=.5,u=1-l/s,d=1-r*l/(l+c-c*u*r),f=r*c*l/(l+c-c*u*r),p=ga(d),m=f*p/d,h=da({l:p,a:a*m,b:o*m}),g=Math.cbrt(1/Math.max(h.r,h.g,h.b,0)),_=ga(i*d),v=f*_/d;return t.l=_*g,t.a=v*a*g,t.b=v*o*g,t}function Ma(){return(Ma=e((()=>{fa(),Sa()})))()}var Na;function Pa(){return(Pa=e((()=>{ua(),ma(),Aa(),Ma(),fr(),Na={...dr,mode:`okhsv`,channels:[`h`,`s`,`v`,`alpha`],parse:[`--okhsv`],serialize:`--okhsv`,fromMode:{oklab:ka,rgb:e=>ka(la(e))},toMode:{oklab:ja,rgb:e=>pa(ja(e))}}})))()}function Fa(e,t){if(!t||t[0]!==`oklab`)return;let n={mode:`oklab`},[,r,i,a,o]=t;if(r.type!==C.Hue&&i.type!==C.Hue&&a.type!==C.Hue)return r.type!==C.None&&(n.l=Math.min(Math.max(0,r.type===C.Number?r.value:r.value/100),1)),i.type!==C.None&&(n.a=i.type===C.Number?i.value:i.value*.4/100),a.type!==C.None&&(n.b=a.type===C.Number?a.value:a.value*.4/100),o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function Ia(){return(Ia=e((()=>{T()})))()}var La;function Ra(){return(Ra=e((()=>{fa(),ca(),ua(),ma(),Ia(),Di(),La={...Ei,mode:`oklab`,toMode:{lrgb:da,rgb:pa},fromMode:{lrgb:sa,rgb:la},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[Fa],serialize:e=>`oklab(${e.l===void 0?`none`:e.l} ${e.a===void 0?`none`:e.a} ${e.b===void 0?`none`:e.b}${e.alpha<1?` / ${e.alpha}`:``})`}})))()}function za(e,t){if(!t||t[0]!==`oklch`)return;let n={mode:`oklch`},[,r,i,a,o]=t;if(r.type!==C.None){if(r.type===C.Hue)return;n.l=Math.min(Math.max(0,r.type===C.Number?r.value:r.value/100),1)}if(i.type!==C.None&&(n.c=Math.max(0,i.type===C.Number?i.value:i.value*.4/100)),a.type!==C.None){if(a.type===C.Percentage)return;n.h=a.value}return o.type!==C.None&&(n.alpha=Math.min(1,Math.max(0,o.type===C.Number?o.value:o.value/100))),n}function Ba(){return(Ba=e((()=>{T()})))()}var Va;function Ha(){return(Ha=e((()=>{Ni(),mn(),hn(),ma(),ua(),Ba(),Va={...Mi,mode:`oklch`,toMode:{oklab:e=>Y(e,`oklab`),rgb:e=>pa(Y(e,`oklab`))},fromMode:{rgb:e=>J(la(e),`oklch`),oklab:e=>J(e,`oklch`)},parse:[za],serialize:e=>`oklch(${e.l===void 0?`none`:e.l} ${e.c===void 0?`none`:e.c} ${e.h===void 0?`none`:e.h}${e.alpha<1?` / ${e.alpha}`:``})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}}})))()}var Ua;function Wa(){return(Wa=e((()=>{N(),Ua=e=>{let{r:t,g:n,b:r,alpha:i}=M(e),a={mode:`xyz65`,x:.486570948648216*t+.265667693169093*n+.1982172852343625*r,y:.2289745640697487*t+.6917385218365062*n+.079286914093745*r,z:0*t+.0451133818589026*n+1.043944368900976*r};return i!==void 0&&(a.alpha=i),a}})))()}var Ga;function Ka(){return(Ka=e((()=>{L(),Ga=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=I({r:e*2.4934969119414263-t*.9313836179191242-.402710784450717*n,g:e*-.8294889695615749+t*1.7626640603183465+.0236246858419436*n,b:e*.0358458302437845-t*.0761723892680418+.9568845240076871*n},`p3`);return r!==void 0&&(i.alpha=r),i}})))()}var qa;function Ja(){return(Ja=e((()=>{j(),Wa(),Ka(),F(),z(),qa={...A,mode:`p3`,parse:[`display-p3`],serialize:`display-p3`,fromMode:{rgb:e=>Ga(P(e)),xyz65:Ga},toMode:{rgb:e=>R(Ua(e)),xyz65:Ua}}})))()}var Ya,Xa;function Za(){return(Za=e((()=>{Ya=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*t**(1/1.8):16*e},Xa=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`prophoto`,r:Ya(e*1.3457868816471585-t*.2555720873797946-.0511018649755453*n),g:Ya(e*-.5446307051249019+t*1.5082477428451466+.0205274474364214*n),b:Ya(e*0+t*0+1.2119675456389452*n)};return r!==void 0&&(i.alpha=r),i}})))()}var Qa,$a;function eo(){return(eo=e((()=>{Qa=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*t**1.8:e/16},$a=e=>{let t=Qa(e.r),n=Qa(e.g),r=Qa(e.b),i={mode:`xyz50`,x:.7977666449006423*t+.1351812974005331*n+.0313477341283922*r,y:.2880748288194013*t+.7118352342418731*n+899369387256e-16*r,z:0*t+0*n+.8251046025104602*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i}})))()}var to;function no(){return(no=e((()=>{j(),Za(),eo(),mi(),vi(),to={...A,mode:`prophoto`,parse:[`prophoto-rgb`],serialize:`prophoto-rgb`,fromMode:{xyz50:Xa,rgb:e=>Xa(_i(e))},toMode:{xyz50:$a,rgb:e=>pi($a(e))}}})))()}var ro,io,ao,oo;function so(){return(so=e((()=>{ro=1.09929682680944,io=.018053968510807,ao=e=>{let t=Math.abs(e);return t>io?(Math.sign(e)||1)*(ro*t**.45-.09929682680944008):4.5*e},oo=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`rec2020`,r:ao(e*1.7166511879712683-t*.3556707837763925-.2533662813736599*n),g:ao(e*-.6666843518324893+t*1.6164812366349395+.0157685458139111*n),b:ao(e*.0176398574453108-t*.0427706132578085+.9421031212354739*n)};return r!==void 0&&(i.alpha=r),i}})))()}var co,lo,uo,fo;function po(){return(po=e((()=>{co=1.09929682680944,lo=.018053968510807,uo=(e=0)=>{let t=Math.abs(e);return t<lo*4.5?e/4.5:(Math.sign(e)||1)*((t+co-1)/co)**(1/.45)},fo=e=>{let t=uo(e.r),n=uo(e.g),r=uo(e.b),i={mode:`xyz65`,x:.6369580483012911*t+.1446169035862083*n+.1688809751641721*r,y:.262700212011267*t+.6779980715188708*n+.059301716469862*r,z:0*t+.0280726930490874*n+1.0609850577107909*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i}})))()}var mo;function ho(){return(ho=e((()=>{j(),so(),po(),F(),z(),mo={...A,mode:`rec2020`,fromMode:{xyz65:oo,rgb:e=>oo(P(e))},toMode:{xyz65:fo,rgb:e=>R(fo(e))},parse:[`rec2020`],serialize:`rec2020`}})))()}var Q,go;function _o(){return(_o=e((()=>{Q=.0037930732552754493,go=Math.cbrt(Q)})))()}var vo,yo;function bo(){return(bo=e((()=>{N(),_o(),vo=e=>Math.cbrt(e)-go,yo=e=>{let{r:t,g:n,b:r,alpha:i}=M(e),a=vo(.3*t+.622*n+.078*r+Q),o=vo(.23*t+.692*n+.078*r+Q),s=vo(.2434226892454782*t+.2047674442449682*n+.5518098665095535*r+Q),c={mode:`xyb`,x:(a-o)/2,y:(a+o)/2,b:s-(a+o)/2};return i!==void 0&&(c.alpha=i),c}})))()}var xo,So;function Co(){return(Co=e((()=>{L(),_o(),xo=e=>(e+go)**3,So=({x:e,y:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=xo(e+t)-Q,a=xo(t-e)-Q,o=xo(n+t)-Q,s=I({r:11.031566904639861*i-9.866943908131562*a-.16462299650829934*o,g:-3.2541473810744237*i+4.418770377582723*a-.16462299650829934*o,b:-3.6588512867136815*i+2.7129230459360922*a+1.9459282407775895*o});return r!==void 0&&(s.alpha=r),s}})))()}var wo;function To(){return(To=e((()=>{D(),k(),bo(),Co(),wo={mode:`xyb`,channels:[`x`,`y`,`b`,`alpha`],parse:[`--xyb`],serialize:`--xyb`,toMode:{rgb:So},fromMode:{rgb:yo},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:E,y:E,b:E,alpha:{use:E,fixup:O}}}})))()}var Eo;function Do(){return(Do=e((()=>{mi(),xi(),vi(),fi(),D(),k(),Eo={mode:`xyz50`,parse:[`xyz-d50`],serialize:`xyz-d50`,toMode:{rgb:pi,lab:bi},fromMode:{rgb:_i,lab:di},channels:[`x`,`y`,`z`,`alpha`],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:E,y:E,z:E,alpha:{use:E,fixup:O}}}})))()}var Oo;function ko(){return(ko=e((()=>{Oo=e=>{let{x:t,y:n,z:r,alpha:i}=e;t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0);let a={mode:`xyz50`,x:1.0479298208405488*t+.0229467933410191*n-.0501922295431356*r,y:.0296278156881593*t+.990434484573249*n-.0170738250293851*r,z:-.0092430581525912*t+.0150551448965779*n+.7518742899580008*r};return i!==void 0&&(a.alpha=i),a}})))()}var Ao;function jo(){return(jo=e((()=>{Ao=e=>{let{x:t,y:n,z:r,alpha:i}=e;t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0);let a={mode:`xyz65`,x:.9554734527042182*t-.0230985368742614*n+.0632593086610217*r,y:-.0283697069632081*t+1.0099954580058226*n+.021041398966943*r,z:.0123140016883199*t-.0205076964334779*n+1.3303659366080753*r};return i!==void 0&&(a.alpha=i),a}})))()}var Mo;function No(){return(No=e((()=>{z(),F(),ko(),jo(),D(),k(),Mo={mode:`xyz65`,toMode:{rgb:R,xyz50:Oo},fromMode:{rgb:P,xyz50:Ao},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:[`x`,`y`,`z`,`alpha`],parse:[`xyz`,`xyz-d65`],serialize:`xyz-d65`,interpolate:{x:E,y:E,z:E,alpha:{use:E,fixup:O}}}})))()}var Po;function Fo(){return(Fo=e((()=>{Po=({r:e,g:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`yiq`,y:.29889531*e+.58662247*t+.11448223*n,i:.59597799*e-.2741761*t-.32180189*n,q:.21147017*e-.52261711*t+.31114694*n};return r!==void 0&&(i.alpha=r),i}})))()}var Io;function Lo(){return(Lo=e((()=>{Io=({y:e,i:t,q:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`rgb`,r:e+.95608445*t+.6208885*n,g:e-.27137664*t-.6486059*n,b:e-1.10561724*t+1.70250126*n};return r!==void 0&&(i.alpha=r),i}})))()}var Ro;function zo(){return(zo=e((()=>{Fo(),Lo(),D(),k(),Ro={mode:`yiq`,toMode:{rgb:Io},fromMode:{rgb:Po},channels:[`y`,`i`,`q`,`alpha`],parse:[`--yiq`],serialize:`--yiq`,ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:E,i:E,q:E,alpha:{use:E,fixup:O}}}})))()}var Bo,Vo;function Ho(){return(Ho=e((()=>{Bo=(e,t)=>Math.round(e*(t=10**t))/t,Vo=(e=4)=>t=>typeof t==`number`?Bo(t,e):t})))()}var Uo,Wo,Go,Ko,qo;function Jo(){return(Jo=e((()=>{ut(),Ho(),Vo(2),Uo=e=>Math.max(0,Math.min(1,e||0)),Wo=e=>Math.round(Uo(e)*255),Go=lt(`rgb`),lt(`hsl`),Ko=e=>{if(e===void 0)return;let t=Wo(e.r),n=Wo(e.g),r=Wo(e.b);return`#`+(1<<24|t<<16|n<<8|r).toString(16).slice(1)},qo=e=>Ko(Go(e))})))()}var Yo;function Xo(){return(Xo=e((()=>{Xt(),pn(),Hn(),Wn(),Yn(),sr(),fr(),br(),Ir(),ei(),oi(),Di(),ki(),Ni(),Fi(),na(),ia(),oa(),Oa(),Pa(),Ra(),Ha(),Ja(),no(),ho(),j(),To(),Do(),No(),zo(),_t(),Jo(),S(Yt),S(fn),S(Vn),S(Un),S(Jn),S(or),S(dr),S(yr),S(Fr),S($r),S(ai),S(Ei),S(Oi),S(Mi),S(Pi),S(ta),S(ra),S(aa),S(Da),S(Na),S(La),Yo=S(Va),S(qa),S(to),S(mo),S(A),S(wo),S(Eo),S(Mo),S(Ro)})))()}var Zo,Qo,$o,es,ts,ns,rs,is,as;function os(){return(os=e((()=>{Xo(),Zo=(e,t=`l`)=>e.sort((e,n)=>Math.sign(Yo({mode:`rgb`,r:e[0],g:e[1],b:e[2]})?.[t]-Yo({mode:`rgb`,r:n[0],g:n[1],b:n[2]})?.[t])||0),Qo=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2]),$o=(e,t)=>{let n=Array.from({length:t.length},()=>({points:[],mean:null}));return e.forEach(e=>{let r=1e4,i=0;t.forEach((t,n)=>{let a=Qo(e,t);(r===void 0||r>a)&&(r=a,i=n)}),n[i].points.push(e)}),n},es=e=>e?.length>0?e.reduce((e,t)=>[t[0]+e[0],t[1]+e[1],t[2]+e[2]],[0,0,0]).map(t=>t/e.length):[0,0,0],ts=(e,t)=>{let n=Zo(ns(e,t));for(let t=0;t<10;t++){let t=$o(e,n).map(e=>e.points.length>0?es(e.points):null);if(t.every((e,t)=>e&&Qo(e,n[t])<.001))break;n=t}return n},ns=(e,t)=>{let n=[e[Math.floor(Math.random()*e.length)]];for(;n.length<t;){let t=e.map(e=>Math.min(...n.map(t=>Qo(e,t)))),r=t.reduce((e,t)=>e+t,0),i=t.map(e=>e/r),a=0,o=Math.random();for(let t=0;t<i.length;t++)if(a+=i[t],o<a){n.push(e[t]);break}}return n},rs=async e=>{let t=e instanceof Blob||e instanceof File?e:await fetch(e)?.then?.(e=>e?.blob?.()),n=await createImageBitmap(t),r=new OffscreenCanvas(n.width,n.height),i=r.getContext(`2d`);return i.filter=`blur(16px)`,i?.drawImage?.(n,0,0,r.width,r.height),r},is=async e=>{let t=await rs(e),n=new OffscreenCanvas(t.width*.125,t.height*.125),r=n.getContext(`2d`);r?.drawImage?.(t,0,0,n.width,n.height);let i=(r?.getImageData?.(0,0,n.width,n.height,{storageFormat:`float32`,pixelFormat:`rgba-float32`,colorSpace:`srgb`})).data,a=n.width*n.height||0,o=1/255,s=[];for(let e=0;e<a;e++){let t=e*4;s.push(i instanceof Float32Array||i instanceof Float16Array?[i?.[t+0]||0,i?.[t+1]||0,i?.[t+2]||0]:[(i?.[t+0]||0)*o,(i?.[t+1]||0)*o,(i?.[t+2]||0)*o])}return s},as=async e=>{let t=await is(e);return Zo(ts(t,4),`h`)}})))()}var ss,cs,ls,us,ds,fs,ps,ms,hs,gs,_s,vs,ys,bs,xs;function Ss(){return(Ss=e((()=>{Xo(),os(),ss=`rs-wallpaper-theme`,cs=`rs-wallpaper-primary`,ls=`rs-wallpaper-theme-src`,us=ss,ds=cs,fs=ls,ps=[[`--color-primary`,`primary`],[`--color-secondary`,`secondary`],[`--color-tertiary`,`tertiary`],[`--base-color`,`primary`],[`--wf-md-primary`,`primary`],[`--wf-md-seed`,`primary`],[`--primary`,`primary`],[`--secondary`,`secondary`],[`--tertiary`,`tertiary`]],ms=e=>{let[t,n,r]=e;if(![t,n,r].every(e=>Number.isFinite(e)))return null;let i=qo({mode:`rgb`,r:t,g:n,b:r});if(!i)return null;let a=Yo({mode:`rgb`,r:t,g:n,b:r});return{rgb:e,hex:i,l:a?.l??.5,c:a?.c??0,h:a?.h??0}},hs=e=>{let t=e.map(ms).filter(Boolean);if(!t.length)return null;let n=t.filter(e=>e.l>=.18&&e.l<=.88&&e.c>=.02).sort((e,t)=>t.c-e.c||Math.abs(t.l-.55)-Math.abs(e.l-.55)),r=n.length?n:[...t].sort((e,t)=>t.c-e.c),i=r[0];if(!i)return null;let a=(e,t)=>{let n=Math.abs(e-t)%360;return n>180?360-n:n},o=e=>{let t=r.filter(t=>!e.includes(t));if(!t.length){let t=e[e.length-1]??i,n=qo({mode:`oklch`,l:Math.min(.85,Math.max(.2,t.l+(e.length===1?-.12:.1))),c:Math.max(.04,t.c*.85),h:t.h});return{...t,hex:n||t.hex,l:t.l}}return[...t].sort((t,n)=>Math.min(...e.map(e=>a(n.h,e.h)))-Math.min(...e.map(e=>a(t.h,e.h)))||n.c-t.c)[0]??t[0]},s=o([i]),c=o([i,s]);return{primary:i.hex,secondary:s.hex,tertiary:c.hex}},gs=()=>{let e=new Set;return e.add(document.documentElement),document.querySelectorAll(`.env-shell-root, .wf-demo-root, ui-window`).forEach(t=>e.add(t)),[...e]},_s=()=>{if(typeof document>`u`)return!0;let e=String(document.documentElement.dataset.colorSource||``);return!e||e===`wallpaper`||e===`speed-dial`||e===`system-wallpaper`},vs=e=>{try{localStorage.setItem(us,JSON.stringify(e)),localStorage.setItem(ds,e.primary)}catch{}if(_s()){for(let t of gs())for(let[n,r]of ps)t.style.setProperty(n,e[r]);document.querySelectorAll(`.view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .view-settings, [data-view='settings'], .cw-network-view, .cw-network-view-host`).forEach(t=>{t.style.setProperty(`--color-primary`,e.primary),t.style.setProperty(`--base-color`,e.primary),t.style.setProperty(`--color-secondary`,e.secondary),t.style.setProperty(`--color-tertiary`,e.tertiary)}),document.dispatchEvent(new CustomEvent(`u2-theme-change`,{detail:{source:`wallpaper`,seeds:e}}))}},ys=()=>{try{let e=localStorage.getItem(us);if(!e)return null;let t=JSON.parse(e);return!t?.primary||!t?.secondary||!t?.tertiary?null:t}catch{return null}},bs=async(e,t)=>{let n=typeof e==`string`?e.slice(0,2048):`blob:${e.name||`wallpaper`}:${e.size}`;if(!t?.force)try{if(localStorage.getItem(fs)===n){let e=ys();if(e)return vs(e),e}}catch{}try{let t=await as(e),r=hs(t);if(!r)return null;vs(r);try{localStorage.setItem(fs,n)}catch{}return r}catch(e){console.warn(`[fest/image] applyThemeFromWallpaper failed`,e);let t=ys();return t?(vs(t),t):null}},xs=()=>{let e=ys();return e&&vs(e),e}})))()}var Cs,ws,Ts,Es,Ds,Os,ks,$,As,js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs;function Bs(){return(Bs=e((()=>{o(),Ss(),Cs=`rs-wallpaper-image`,ws=`/assets/wallpaper.jpg`,Ts=`idb:rs-wallpaper`,Es=`cwsp-wallpaper-v1`,Ds=`blobs`,Os=`current`,ks=512e3,$=null,As=()=>s?.[r()]??0,js=()=>{if($&&$.startsWith(`blob:`))try{URL.revokeObjectURL($)}catch{}$=null},Ms=()=>new Promise((e,t)=>{if(typeof indexedDB>`u`){t(Error(`indexedDB unavailable`));return}let n=indexedDB.open(Es,1);n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(Ds)||e.createObjectStore(Ds)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error||Error(`IDB open failed`))}),Ns=async()=>{let e=await Ms();try{return await new Promise((t,n)=>{let r=e.transaction(Ds,`readonly`).objectStore(Ds).get(Os);r.onsuccess=()=>{let e=r.result;t(e instanceof Blob?e:null)},r.onerror=()=>n(r.error||Error(`IDB get failed`))})}finally{e.close()}},Ps=()=>{try{let e=localStorage.getItem(Cs);return e&&e.trim()?e.trim():ws}catch{return ws}},Fs=e=>{try{return localStorage.setItem(Cs,e),!0}catch{return!1}},Is=async()=>{let e=Ps();if(e===`idb:rs-wallpaper`||e.startsWith(`idb:`)){try{let e=await Ns();if(e)return js(),$=URL.createObjectURL(e),$}catch(e){console.warn(`[fest/image] wallpaper IDB restore failed`,e)}return ws}if(e.startsWith(`data:`)&&e.length>ks)try{let e=await Ns();if(e)return js(),$=URL.createObjectURL(e),Fs(Ts),$}catch{}return e||ws},Ls=e=>{let t=()=>{let t=As(),n=String(t);e.getAttribute(`data-orient`)!==n&&e.setAttribute(`data-orient`,n),e.getAttribute(`orient`)!==n&&e.setAttribute(`orient`,n),e.style.setProperty(`--orient`,n),e.orient=t};return t(),a(t)},Rs=e=>{let t=getComputedStyle(document.documentElement).getPropertyValue(`--color-primary`).trim()||`#5b86eb`;e.style.background=`radial-gradient(circle at 15% 20%, color-mix(in oklab, ${t} 45%, transparent) 0%, transparent 40%), radial-gradient(circle at 75% 72%, color-mix(in oklab, ${t} 35%, transparent) 0%, transparent 43%)`},zs=e=>{let t=e;t.replaceChildren(),t.dataset.appLayer=`canvas`,t.style.position=`absolute`,t.style.inset=`0`,t.style.overflow=`hidden`,t.style.background=`radial-gradient(circle at 18% 12%, #1b2a45 0%, #0f1728 42%, #060910 100%)`;let n=document.createElement(`div`);n.className=`app-canvas__glow`,n.style.position=`absolute`,n.style.inset=`-20%`,n.style.pointerEvents=`none`,n.style.opacity=`0.7`,n.style.background=`radial-gradient(circle at 15% 20%, rgba(145,185,255,0.45) 0%, transparent 40%), radial-gradient(circle at 75% 72%, rgba(91,134,235,0.35) 0%, transparent 43%)`;let r=document.createElement(`canvas`,{is:`ui-canvas`});r.className=`app-canvas__image ui-canvas`,r.style.position=`absolute`,r.style.inset=`0`,r.style.pointerEvents=`none`,r.style.inlineSize=`100%`,r.style.blockSize=`100%`,r.style.maxInlineSize=`100%`,r.style.maxBlockSize=`100%`,r.style.opacity=`1`,r.style.mixBlendMode=`normal`,r.setAttribute(`is`,`ui-canvas`),r.style.setProperty(`dynamic-range-limit`,`no-limit`),r.style.setProperty(`color-space`,`display-p3`),r.style.setProperty(`background-color`,`black`,`important`),r.style.setProperty(`opacity`,`1`,`important`),t.append(n,r);let i=Ps(),a=i===`idb:rs-wallpaper`||i.startsWith(`idb:`)||i.startsWith(`data:`)?ws:i;r.setAttribute(`data-src`,a);let o=Ls(r);return xs(),Rs(n),Is().then(e=>(r.setAttribute(`data-src`,e),Ls(r),bs(e).then(()=>Rs(n)))),{root:t,canvas:r,glow:n,disposeOrient:o}}})))()}var Vs;function Hs(){return(Hs=e((()=>{o(),Bs(),Vs=(e,t={})=>{let r=t.enableOrientLayer!==!1,i=t.enableCanvasLayer!==!1,a=e.querySelector(`[data-app-layer="canvas"]`),o=e.querySelector(`[data-app-layer="orient"]`),s=e.querySelector(`[data-app-layer="shell"]`),c=e.querySelector(`[data-app-layer="overlay"]`),l=()=>{let e=document.createElement(`div`);return e.dataset.appLayer=`canvas`,e.className=`app-layer app-layer--canvas`,e.style.position=`absolute`,e.style.inset=`0`,e.style.zIndex=`0`,e.style.pointerEvents=`none`,zs(e),e};if(s&&c){let t=a;if(i&&!t&&(t=l(),e.insertBefore(t,o??s)),!i&&t&&(t.remove(),t=null),r&&!o){let r=document.createElement(`div`);r.dataset.appLayer=`orient`,r.className=`app-layer app-layer--orient`,r.style.position=`absolute`,r.style.inset=`0`,r.style.zIndex=`5`,r.style.pointerEvents=`none`,r.style.background=`transparent`;let i=document.createElement(`cw-oriented-box`);return i.className=`ui-orientbox app-oriented-box`,i.setAttribute(`data-mixin`,`ui-orientbox`),i.style.position=`absolute`,i.style.inset=`0`,i.style.pointerEvents=`auto`,i.style.background=`transparent`,r.appendChild(i),n(i),e.insertBefore(r,s),{canvasLayer:t,orientLayer:r,shellLayer:s,overlayLayer:c}}return!r&&o?(o.remove(),{canvasLayer:t,orientLayer:null,shellLayer:s,overlayLayer:c}):{canvasLayer:t,orientLayer:r&&o||null,shellLayer:s,overlayLayer:c}}e.replaceChildren(),e.style.position=`relative`,e.style.overflow=`hidden`,e.dataset.appLayerRoot=`true`;try{let t=document.documentElement;(e===document.body||e.id===`app`)&&(t.style.minBlockSize||(t.style.minBlockSize=`100dvb`),!t.style.blockSize&&!t.style.height&&(t.style.blockSize=`100%`),!document.body.style.margin&&e===document.body&&(document.body.style.margin=`0`)),e.style.minBlockSize||(e.style.minBlockSize=`100dvb`),!e.style.blockSize&&!e.style.height&&(e.style.blockSize=`100%`)}catch{}let u=i?l():null,d=r?document.createElement(`div`):null;if(d){d.dataset.appLayer=`orient`,d.className=`app-layer app-layer--orient`,d.style.position=`absolute`,d.style.inset=`0`,d.style.zIndex=`5`,d.style.pointerEvents=`none`,d.style.background=`transparent`;let e=document.createElement(`cw-oriented-box`);e.className=`ui-orientbox app-oriented-box`,e.setAttribute(`data-mixin`,`ui-orientbox`),e.style.position=`absolute`,e.style.inset=`0`,e.style.pointerEvents=`auto`,e.style.background=`transparent`,d.appendChild(e),n(e)}let f=document.createElement(`div`);f.dataset.appLayer=`shell`,f.className=`app-layer app-layer--shell`,f.style.position=`absolute`,f.style.inset=`0`,f.style.zIndex=`10`,f.style.pointerEvents=`none`,f.style.display=`grid`,f.style.gridTemplateColumns=`[content-column] minmax(0px, 1fr)`,f.style.gridTemplateRows=`[status-row] minmax(0px, max-content) [content-row] minmax(0px, 1fr) [dock-row] minmax(0px, max-content)`,f.style.overflow=`hidden`,f.style.background=`transparent`,f.style.backgroundColor=`transparent`;let p=document.createElement(`div`);return p.dataset.appLayer=`overlay`,p.className=`app-layer app-layer--overlay`,p.style.position=`absolute`,p.style.inset=`0`,p.style.zIndex=`1000`,p.style.pointerEvents=`none`,p.style.background=`transparent`,p.style.backgroundColor=`transparent`,u&&e.append(u),d&&e.append(d),e.append(f,p),{canvasLayer:u,orientLayer:d,shellLayer:f,overlayLayer:p}}})))()}var Us=t({bootLoader:()=>Ys});function Ws(e){try{return e?.dataset?.appLayer===`shell`?e:e.querySelector?.(`:scope > [data-app-layer="shell"]`)||Vs(e,{enableOrientLayer:!1,enableCanvasLayer:!1}).shellLayer}catch(t){return console.warn(`[BootLoader] ensureAppLayers failed; mounting into container directly:`,t),e}}async function Gs(e,t=`viewer`,n){let r=d(t,`viewer`),i=u(r)?[r]:[`viewer`],a=i[0],o=Ws(e);return Ys.boot(o,{styleSystem:`vl-basic`,shell:`minimal`,defaultView:r,channels:i,channelPriorityId:a,rememberChoice:n?.rememberChoice??!0,skipInitialNavigate:n?.skipInitialNavigate??!1})}var Ks,qs,Js,Ys;function Xs(){return(Xs=e((()=>{o(),c(),re(),l(),Ce(),ae(),fe(),le(),we(),g(),Fe(),ee(),ue(),Ve(),Hs(),te(),Ks=e=>e===`faint`?`tabbed`:e===`base`?`immersive`:e,qs={raw:{name:`Raw (No Framework)`,stylesheets:[],description:`No CSS framework, raw browser defaults`,recommendedShells:[`immersive`]},"vl-core":{name:`Core (Shared Foundation)`,stylesheets:[],description:`Shared foundation styles for all veela variants`,recommendedShells:[`immersive`,`minimal`]},"vl-basic":{name:`Basic Veela Styles`,stylesheets:[],description:`Minimal styling for basic functionality`,recommendedShells:[`window`,`tabbed`,`minimal`,`environment`,`immersive`,`content`]},"vl-advanced":{name:`Advanced (Full-Featured Styling)`,stylesheets:[],description:`Full-featured styling with design tokens and effects`,recommendedShells:[`tabbed`,`minimal`,`environment`]},"vl-beercss":{name:`BeerCSS (Beer CSS Compatible)`,stylesheets:[],description:`Beer CSS compatible styling with Material Design 3`,recommendedShells:[`tabbed`]}},Js=class e{static instance;state={phase:`idle`,styleSystem:null,shell:null,view:null,error:null};stateChangeHandlers=new Set;shellInstance=null;implicitBridgeCleanup=null;phaseHandlers=new Map;constructor(){h()}static getInstance(){return e.instance||=new e,e.instance}async boot(e,t){console.log(`[BootLoader] Starting boot sequence:`,t);try{if(this.shellInstance)try{this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=null,y.unload(this.shellInstance.id)}catch(e){console.warn(`[BootLoader] Failed to unload previous shell:`,e)}finally{this.shellInstance=null}ye(),se().catch(()=>{});try{let{initFrontendDebugCapture:e}=await ne(async()=>{let{initFrontendDebugCapture:e}=await import(`./frontend-debug-capture-jxKOmsWN.js`).then(e=>(e.i(),e.t));return{initFrontendDebugCapture:e}},[],import.meta.url);e()}catch{}let n=await me().catch(e=>(console.warn(`[BootLoader] Failed to load settings:`,e),null)),r=n;if(oe()){let e=await pe().catch(()=>null);e&&(r=e)}if(r&&de(r).catch(()=>void 0),oe()&&Be(r).catch(e=>{console.warn(`[BootLoader] CWSP bridge daemon auto-start skipped:`,e)}),he(r??ce),!(()=>{try{let e=globalThis,t=typeof document<`u`?String(document.documentElement?.dataset?.cwspSurface||``):``;return!!(e.__CWS_SKIP_PWA__||e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||e.Neutralino||typeof e.NL_OS==`string`||t===`cwsp-control`||t===`gateway`)}catch{return!1}})())try{let{initIngressPWA:e}=await ne(async()=>{let{initIngressPWA:e}=await import(`./sw-handling-_G8R4F27.js`);return{initIngressPWA:e}},[],import.meta.url);await e()}catch(e){console.warn(`[BootLoader] Share-target / service worker ingress failed (non-fatal):`,e)}await this.loadStyles(t.styleSystem);let i=this.resolveThemeFromSettings(n),a=await this.loadShell(t.shell,e);if(a.setTheme(t.theme||i),await a.mount(e),this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=m(),t.channels&&t.channels.length>0&&await this.initChannels(t.channels,t.channelPriorityId),t.skipInitialNavigate)this.dismissShellLoadingSpinner(a);else{let e;try{e=Object.fromEntries(new URLSearchParams(globalThis.location?.search||``))}catch{e=void 0}await a.navigate(t.defaultView,e)}return this.setPhase(`ready`),t.rememberChoice&&this.savePreferences(t),console.log(`[BootLoader] Boot complete`),a}catch(e){throw console.error(`[BootLoader] Boot failed:`,e),this.updateState({phase:`error`,error:e}),e}}resolveThemeFromSettings(e){let t=e?.appearance?.theme||`auto`;return t===`dark`?_:t===`light`?v:p}dismissShellLoadingSpinner(e){try{let t=e.getElement().shadowRoot?.querySelector(`.app-shell__loading`);t&&(t.hidden=!0)}catch{}}async loadStyles(e){this.setPhase(`styles`),console.log(`[BootLoader] Loading style system: ${e}`);let t=qs[e]||qs[`vl-basic`];try{await Me(e)}catch(t){throw console.error(`[BootLoader] Failed to load style system: ${e}`,t),t}for(let e of t.stylesheets)try{await i(e)}catch(t){console.warn(`[BootLoader] Failed to load stylesheet: ${e}`,t)}this.updateState({styleSystem:e}),console.log(`[BootLoader] Style system ${e} loaded`)}async loadShell(e,t){this.setPhase(`shell`);let n=Ks(e);n!==e&&console.warn(`[BootLoader] Shell "${e}" is temporarily disabled, redirecting to "${n}"`),console.log(`[BootLoader] Loading shell: ${n}`);let r=await y.load(n,t);return this.shellInstance=r,this.updateState({shell:n}),console.log(`[BootLoader] Shell ${n} loaded`),r}async initChannels(e,t){this.setPhase(`channels`);let n=[...new Set(e)];if(n.length===0)return;let r=(t&&n.includes(t)?t:null)??n[0],i=n.filter(e=>e!==r);console.log(`[BootLoader] Initializing primary channel:`,r,i.length?`(+${i.length} deferred)`:``);try{await ie.initChannel(r)}catch(e){console.warn(`[BootLoader] Failed to init primary channel ${r}:`,e)}if(i.length===0){console.log(`[BootLoader] Channels initialized`);return}let a=()=>{(async()=>{for(let e of i)try{await ie.initChannel(e)}catch(t){console.warn(`[BootLoader] Failed to init channel ${e}:`,t)}console.log(`[BootLoader] Deferred channels initialized:`,i)})()};typeof globalThis.requestIdleCallback==`function`?globalThis.requestIdleCallback(a,{timeout:5e3}):globalThis.setTimeout?.(a,0)}updateState(e){Object.assign(this.state,e),this.notifyStateChange()}setPhase(e){this.updateState({phase:e});let t=this.phaseHandlers.get(e);if(t)for(let e of t)try{e(this.state)}catch(e){console.error(`[BootLoader] Phase handler error:`,e)}}notifyStateChange(){for(let e of this.stateChangeHandlers)try{e(this.state)}catch(e){console.error(`[BootLoader] State handler error:`,e)}}onStateChange(e){return this.stateChangeHandlers.add(e),()=>{this.stateChangeHandlers.delete(e)}}onPhase(e,t){return this.phaseHandlers.has(e)||this.phaseHandlers.set(e,new Set),this.phaseHandlers.get(e).add(t),()=>{this.phaseHandlers.get(e)?.delete(t)}}getState(){return{...this.state}}getShell(){return this.shellInstance}savePreferences(e){try{let t=Ks(e.shell);localStorage.setItem(`rs-boot-style`,e.styleSystem),localStorage.setItem(`rs-boot-shell`,t),localStorage.setItem(`rs-boot-view`,e.defaultView),localStorage.setItem(`rs-boot-remember`,`1`)}catch(e){console.warn(`[BootLoader] Failed to save preferences:`,e)}}loadPreferences(){try{if(localStorage.getItem(`rs-boot-remember`)!==`1`)return null;let e=Ks(localStorage.getItem(`rs-boot-shell`)||`environment`);return{styleSystem:localStorage.getItem(`rs-boot-style`)||void 0,shell:e,defaultView:localStorage.getItem(`rs-boot-view`)||void 0}}catch{return null}}clearPreferences(){try{localStorage.removeItem(`rs-boot-style`),localStorage.removeItem(`rs-boot-shell`),localStorage.removeItem(`rs-boot-view`),localStorage.removeItem(`rs-boot-remember`),localStorage.removeItem(f)}catch{}}},Ys=Js.getInstance()})))()}export{ze as a,Ve as i,Gs as n,Xs as r,Us as t};