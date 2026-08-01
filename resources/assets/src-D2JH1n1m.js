import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Ht as n,J as r,S as i,X as a,a as o,b as s,et as c,ft as l,jt as u,kt as d,nt as f,tt as ee,u as te}from"./HistoryManager-D8ebz2Z7.js";import{t as p}from"./src-BQ2lM3dn.js";import{n as m,t as h}from"./preload-helper-NDuSAHbO.js";import{F as ne,I as g,L as _,M as re,N as v,k as ie,t as y,z as b}from"./src-fiZCSwG5.js";import{t as x}from"./src-C9heO9y9.js";import{n as S}from"./CSSIconRegistry-D88SYH0A.js";import{n as C,r as ae}from"./shell-slots-CDiat5LT.js";function w(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var T=e((()=>{})),E,D,O=e((()=>{y(),x(),T(),E=class extends g(){theme=`default`;render=function(){return o`<slot></slot>`};constructor(){super()}onRender(){return super.onRender()}connectedCallback(){return super.connectedCallback?.()??this}onInitialize(){let e=super.onInitialize()??this;return e.loadStyleLibrary(S()),e}},w([b({source:`attr`})],E.prototype,`theme`,void 0),E=w([_(`ui-element`)],E),D=E})),k,oe=e((()=>{k=`/*
 * Filename: statusbar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.scss
 * Change date and time: 14.00.00_31.07.2026
 * Reason for changes: Mobile/fullscreen transparent overlay statusbar + desktop footer.
 */
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 16.20.00_31.07.2026
 * Reason for changes: Box primary restored to familiar blue (#5a7fff/#7ca7ff); wallpaper may override.
 */
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
 * Global theme mixins — token NAMES stable; VALUES from --u2-color-mod.
 * Index scale: 0 white ← 550 seed → 1000 black (see function above).
 */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    color-scheme: light dark;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  @media (prefers-color-scheme: dark) {
    :root,
    :host,
    :scope {
      --color-primary: #7ca7ff;
      --base-color: var(--color-primary);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    }
  }
  [data-theme=light] {
    color-scheme: light;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
  }
  [data-theme=dark] {
    color-scheme: dark;
    --color-primary: #7ca7ff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
/* Shadow layout for <ui-statusbar> slots. */
:host(ui-statusbar) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  box-sizing: border-box;
  inline-size: 100%;
  color: var(--env-status-fg, CanvasText);
  background: transparent;
}

:host(ui-statusbar) .left,
:host(ui-statusbar) .center,
:host(ui-statusbar) .right {
  display: flex;
  align-items: center;
  min-inline-size: 0;
  background: transparent;
  padding-block-start: 0.5rem;
}

:host(ui-statusbar) .left {
  flex: 0 1 auto;
  justify-content: flex-start;
  padding-inline-start: max(1rem, env(safe-area-inset-left, 0));
}

:host(ui-statusbar) .center {
  flex: 1 1 auto;
  justify-content: center;
}

:host(ui-statusbar) .right {
  flex: 0 1 auto;
  justify-content: flex-end;
  margin-inline-start: auto;
  padding-inline-end: max(1rem, env(safe-area-inset-right, 0));
}

@media screen and (pointer: fine) and ((min-width: 768px) or (hover: hover)) {
  :host(ui-statusbar), ui-statusbar {
    display: none !important;
  }
}
@layer ui-statusbar {
  /* Desktop footer statusbar (inside bottom chrome stack). */
  .env-ui-statusbar {
    order: 1;
    padding: 0.35rem 0.65rem calc(0.35rem + env(safe-area-inset-bottom, 0));
    background: color-mix(in oklch, oklch(14% 0.02 280deg) 82%, transparent);
    border-block-start: 1px solid var(--wf-md-outline-variant, color-mix(in oklch, white 12%, transparent));
    backdrop-filter: blur(10px);
  }
  .env-ui-statusbar__intro p {
    margin: 0.1rem 0;
    opacity: 0.92;
  }
  .env-ui-statusbar__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .env-ui-statusbar__clock {
    font: 600 0.8125rem/1 ui-sans-serif, system-ui, sans-serif;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
    color: inherit;
    user-select: none;
    pointer-events: none;
  }
  .env-status-bar__tray {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.35rem;
  }
  .env-status-bar__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.12rem 0.35rem;
    border-radius: 999px;
    background: color-mix(in oklch, var(--env-status-fg, var(--wf-md-on-surface, white)) 10%, transparent);
    border: 1px solid color-mix(in oklch, var(--env-status-fg, var(--wf-md-on-surface, white)) 18%, transparent);
    line-height: 1;
    color: inherit;
  }
  .env-status-bar__chip ui-icon {
    font-size: 1.15rem;
    display: block;
    color: inherit;
    --icon-color: currentColor;
  }
  .env-status-bar__pct {
    font-variant-numeric: tabular-nums;
    opacity: 0.95;
  }
  .env-status-bar__meta {
    margin: 0;
    opacity: 0.88;
    font-size: 11px;
  }
  /*
   * Overlay statusbar: fixed top band over wallpaper / window title spacer.
   * Shown when \`.env-shell-chrome[data-status-overlay]\` (mobile browser or fullscreen; not standalone).
   */
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar,
  .env-shell-root[data-status-overlay] > .env-shell-chrome .env-ui-statusbar {
    position: fixed;
    inset-inline: 0;
    inset-block-start: 0;
    inset-block-end: auto;
    z-index: calc(var(--env-z-shell-chrome, 2147483000) + 2);
    order: unset;
    display: flex;
    align-items: center;
    /* INVARIANT: same token as ui-window title spacer (\`--env-status-inset-top\`). */
    block-size: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
    min-block-size: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
    padding: 0 0.75rem;
    box-sizing: border-box;
    background: transparent !important;
    border: 0 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    color: var(--env-status-fg, #f5f5f7);
    pointer-events: none;
  }
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar__intro,
  .env-shell-chrome[data-status-overlay] .env-status-bar__meta {
    display: none !important;
  }
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock {
    display: block;
  }
  .env-shell-chrome[data-status-overlay] .env-device-tray--footer {
    display: flex !important;
  }
  .env-shell-chrome[data-status-overlay] .env-status-bar__chip {
    background: transparent;
    border-color: transparent;
    padding-inline: 0.15rem;
  }
  /* Standalone PWA: no shell statusbar (OS / home chrome owns that). */
  .env-shell-chrome[data-standalone] .env-ui-statusbar,
  .env-shell-root[data-standalone] .env-shell-chrome:not([data-desktop]) .env-ui-statusbar {
    display: none !important;
  }
  /* Desktop footer: hide clock (taskbar has its own). */
  .env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-ui-statusbar__clock {
    display: none !important;
  }
  /*
   * WHY: Desktop native-mode (WCO) hides env chrome. On mobile the Home dock must stay —
   * it is the only leave-view control (no title Close). Overlay statusbar also hides with chrome.
   */
  .env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],
  env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop] {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}`}));function A(){if(typeof matchMedia!=`function`)return`unknown`;try{if(matchMedia(`(display-mode: window-controls-overlay)`).matches)return`window-controls-overlay`;if(matchMedia(`(display-mode: fullscreen)`).matches)return`fullscreen`;if(matchMedia(`(display-mode: standalone)`).matches)return`standalone`;if(matchMedia(`(display-mode: minimal-ui)`).matches)return`minimal-ui`;if(matchMedia(`(display-mode: browser)`).matches)return`browser`}catch{}return`unknown`}function se(){let e=A();if(e===`standalone`||e===`minimal-ui`)return!0;try{if(navigator.standalone===!0)return!0}catch{}return!1}function ce(e){if(e.standalone??se())return!1;let t=e.displayMode??A(),n=typeof document<`u`&&!!(document.fullscreenElement||document.webkitFullscreenElement);return t===`fullscreen`||n?!0:!e.desktop}function le(e=new Date){try{return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(e)}catch{return`${e.getHours()}:${String(e.getMinutes()).padStart(2,`0`)}`}}function ue(e){let t=!1,n=null,r=t=>{let n=t>.55;e.style.setProperty(`--env-status-fg`,n?`#1c1c1e`:`#f5f5f7`),e.style.setProperty(`--env-status-fg-muted`,n?`rgba(28,28,30,0.72)`:`rgba(245,245,247,0.78)`),e.dataset.statusContrast=n?`dark`:`light`},i=()=>{if(t)return;try{let t=Math.max(8,Math.round(parseFloat(getComputedStyle(e).getPropertyValue(`--env-status-inset-top`))||32));Math.min(e.clientWidth||window.innerWidth||360,480);let n=e.querySelector(`.env-shell-wallpaper canvas`)||document.querySelector(`.env-shell-wallpaper canvas`);if(n instanceof HTMLCanvasElement&&n.width>0&&n.height>0){let e=n.getContext(`2d`,{willReadFrequently:!0});if(e){let i=Math.max(1,Math.round(t/Math.max(1,n.clientHeight||t)*n.height)),a=n.width,o=e.getImageData(0,0,a,Math.min(i,n.height)).data,s=0,c=0;for(let e=0;e<o.length;e+=192){let t=o[e]/255,n=o[e+1]/255,r=o[e+2]/255;s+=.2126*t+.7152*n+.0722*r,c++}if(c>0){r(s/c);return}}}}catch{}let n=matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0;r(n?.2:.85)},a=()=>{n!=null&&clearTimeout(n),n=setTimeout(i,120)};i();let o=typeof MutationObserver==`function`?new MutationObserver(a):null,s=e.querySelector(`.env-shell-wallpaper`)||document.querySelector(`.env-shell-wallpaper`);s&&o&&o.observe(s,{childList:!0,subtree:!0,attributes:!0}),window.addEventListener(`resize`,a),document.addEventListener(`visibilitychange`,a);let c=typeof matchMedia==`function`?matchMedia(`(prefers-color-scheme: dark)`):null;c?.addEventListener?.(`change`,a);let l=setInterval(i,8e3);return()=>{t=!0,n!=null&&clearTimeout(n),clearInterval(l),o?.disconnect(),window.removeEventListener(`resize`,a),document.removeEventListener(`visibilitychange`,a),c?.removeEventListener?.(`change`,a)}}function j(e){return e.connection}function de(e){let t=e.toLowerCase();return t===`slow-2g`?`wifi-low`:t===`2g`?`wifi-medium`:`wifi-high`}function fe(){let e=f(`wifi-high`),t=f(``),n=f(`battery-full`),r=f(``),i=f(``),a=()=>{if(!navigator.onLine){e.value=`wifi-slash`,t.value=`Offline`;return}let n=j(navigator);if(!n||typeof n.effectiveType!=`string`){e.value=`globe`,t.value=`Online (connection details unavailable)`;return}let r=String(n.effectiveType||``).toLowerCase(),i=typeof n.downlink==`number`?`${n.downlink} Mb/s`:``,a=n.saveData?` · Data saver`:``;t.value=[r.toUpperCase(),i].filter(Boolean).join(` · `)+a,e.value=de(r)},o=null,s=null,c=null,l=(e,t)=>{let a=Math.max(0,Math.min(100,Math.round(e*100)));if(i.value=`${a}%`,t){n.value=`battery-charging-vertical`,r.value=`Charging · ${i.value}`;return}r.value=`Battery · ${i.value}`,e<=.08?n.value=`battery-warning`:e<=.22?n.value=`battery-low`:e<=.5?n.value=`battery-medium`:e<=.8?n.value=`battery-high`:n.value=`battery-full`};a(),window.addEventListener(`online`,a),window.addEventListener(`offline`,a);let u=j(navigator);return u?.addEventListener?.(`change`,a),typeof navigator.getBattery==`function`?navigator.getBattery().then(e=>{c=e,o=()=>l(e.level,e.charging),s=o,e.addEventListener(`levelchange`,o),e.addEventListener(`chargingchange`,s),l(e.level,e.charging)}):(n.value=`question`,r.value=`Battery status not supported in this browser`,i.value=`—`),{networkIcon:e,networkTitle:t,batteryIcon:n,batteryTitle:r,batteryPct:i,dispose:()=>{window.removeEventListener(`online`,a),window.removeEventListener(`offline`,a),u?.removeEventListener?.(`change`,a),c&&o&&s&&(c.removeEventListener(`levelchange`,o),c.removeEventListener(`chargingchange`,s))}}}function pe(e,t){let n=o`<div class="env-status-bar__tray ${t}">
        <span class="env-status-bar__chip" title=${e.networkTitle} aria-label=${e.networkTitle}>
            <ui-icon icon=${e.networkIcon} aria-hidden="true"></ui-icon>
        </span>
        <span class="env-status-bar__chip" title=${e.batteryTitle} aria-label=${e.batteryTitle}>
            <ui-icon icon=${e.batteryIcon} aria-hidden="true"></ui-icon>
            <span class="env-status-bar__pct"></span>
        </span>
    </div>`,r=n.querySelector(`.env-status-bar__pct`);return r instanceof HTMLElement&&te(r,{properties:{textContent:e.batteryPct}}),n}function me(e,t,n){let r=document.createElement(`ui-statusbar`);r.className=`env-ui-statusbar wf-chrome-no-select`,r.setAttribute(`part`,`status-bar`);let i=document.createElement(`div`);i.slot=`left`,i.className=`env-ui-statusbar__left`;let o=document.createElement(`time`);o.className=`env-ui-statusbar__clock`,o.dateTime=``,o.textContent=le(),o.setAttribute(`aria-live`,`polite`);let s=document.createElement(`div`);s.className=`env-ui-statusbar__intro`,t&&(s.innerHTML=t),i.append(o,s);let c=document.createElement(`div`);c.slot=`center`;let l=document.createElement(`p`);l.className=`env-status-bar__meta`,c.appendChild(l);let u=document.createElement(`div`);u.slot=`right`,u.className=`env-ui-statusbar__right`,u.appendChild(pe(n,`env-device-tray env-device-tray--footer`)),r.append(i,c,u),a(()=>{let t=e.navEcho.value?` │ ${e.navEcho.value}`:``;l.textContent=`doc=${e.selectedPath.value} │ viewer=${e.viewerStatus.value} │ layout=${e.mqLabel.value}${t}`},[e.selectedPath,e.viewerStatus,e.mqLabel,e.navEcho],{triggerImmediately:!0});let d=()=>{let e=new Date;o.textContent=le(e),o.dateTime=e.toISOString()};d();let f=setInterval(d,15e3);return{element:r,dispose:()=>{clearInterval(f)}}}var he,ge,_e=e((()=>{y(),r(),O(),oe(),l(),T(),he=u(k),ge=class extends D{constructor(){super()}styles=()=>he;render=()=>o`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`},ge=w([_(`ui-statusbar`)],ge)})),ve=e((()=>{r(),p(),y()}));function ye(e,t){e.style.setProperty(`position`,`fixed`,V),e.style.setProperty(`box-sizing`,`border-box`,V),e.style.setProperty(`min-width`,t?`188px`:`220px`,V),e.style.setProperty(`max-width`,`min(320px, calc(100vw - 24px))`,V),e.style.setProperty(`padding`,t?`0.3rem`:`0.4rem`,V),e.style.setProperty(`border-radius`,`14px`,V),e.style.setProperty(`pointer-events`,`auto`,V),e.style.setProperty(`-webkit-backdrop-filter`,`none`,V),e.style.setProperty(`backdrop-filter`,`none`,V),e.style.removeProperty(`border`),e.style.removeProperty(`background`),e.style.removeProperty(`color`),e.style.removeProperty(`outline`),e.style.removeProperty(`box-shadow`)}function be(e){e.style.setProperty(`list-style`,`none`,V),e.style.setProperty(`list-style-type`,`none`,V),e.style.setProperty(`margin`,`0`,V),e.style.setProperty(`padding`,`0`,V),e.style.setProperty(`display`,`flex`,V),e.style.setProperty(`flex-direction`,`column`,V),e.style.setProperty(`align-items`,`stretch`,V),e.style.setProperty(`gap`,`0.2rem`,V),e.style.setProperty(`width`,`100%`,V),e.style.setProperty(`box-sizing`,`border-box`,V),e.style.setProperty(`text-align`,`left`,V)}function xe(e){e.style.setProperty(`list-style`,`none`,V),e.style.setProperty(`list-style-type`,`none`,V),e.style.setProperty(`margin`,`0`,V),e.style.setProperty(`padding`,`0`,V),e.style.setProperty(`width`,`100%`,V),e.style.setProperty(`display`,`block`,V),e.style.setProperty(`box-sizing`,`border-box`,V)}function Se(e,t){e.style.setProperty(`appearance`,`none`,V),e.style.setProperty(`-webkit-appearance`,`none`,V),e.style.setProperty(`box-sizing`,`border-box`,V),e.style.setProperty(`width`,`100%`,V),e.style.setProperty(`max-width`,`100%`,V),e.style.setProperty(`margin`,`0`,V),e.style.setProperty(`display`,`grid`,V),e.style.setProperty(`grid-template-columns`,`1.375rem minmax(0, 1fr) auto`,V),e.style.setProperty(`align-items`,`center`,V),e.style.setProperty(`justify-items`,`start`,V),e.style.setProperty(`gap`,`0.55rem`,V),e.style.setProperty(`border-style`,`none`,V),e.style.setProperty(`border-width`,`0`,V),e.style.setProperty(`outline`,`none`,V),e.style.setProperty(`border-radius`,`10px`,V),e.style.setProperty(`padding`,`0.5rem 0.6rem`,V),e.style.setProperty(`min-height`,`2.35rem`,V),e.style.setProperty(`font-family`,`inherit`,V),e.style.setProperty(`font-size`,`0.8125rem`,V),e.style.setProperty(`font-weight`,`400`,V),e.style.setProperty(`line-height`,`1.25`,V),e.style.setProperty(`text-align`,`start`,V),e.style.setProperty(`cursor`,`pointer`,V),e.style.removeProperty(`background`),e.style.removeProperty(`background-color`),e.style.removeProperty(`background-image`),e.style.setProperty(`box-shadow`,`none`,V),e.style.setProperty(`transition`,`none`,V),t?e.style.setProperty(`color`,`var(--color-error, #fca5a5)`,V):e.style.setProperty(`color`,`inherit`,V)}function Ce(e){if(typeof customElements<`u`&&typeof customElements.upgrade==`function`)try{customElements.upgrade(e)}catch{}for(let t of e.querySelectorAll(`ui-icon`)){let e=t;e.style.setProperty(`--icon-size`,`1.125rem`,V),e.style.setProperty(`--icon-padding`,`0px`,V),e.style.setProperty(`--icon-color`,`currentColor`,V),e.style.setProperty(`width`,`1.125rem`,V),e.style.setProperty(`height`,`1.125rem`,V),e.style.setProperty(`min-width`,`1.125rem`,V),e.style.setProperty(`min-height`,`1.125rem`,V),e.style.setProperty(`display`,`inline-grid`,V),typeof e.updateIcon==`function`&&e.updateIcon.call(t)}}function we(e,t){let n=String(t||``).trim();if(!n)return;let r=document.createElement(`ui-icon`);r.setAttribute(`icon`,n),r.setAttribute(`icon-style`,`duotone`),r.setAttribute(`size`,`18`),r.setAttribute(`aria-hidden`,`true`),r.style.setProperty(`--icon-size`,`1.125rem`,V),r.style.setProperty(`--icon-padding`,`0px`,V),r.style.setProperty(`--icon-color`,`currentColor`,V),r.style.setProperty(`width`,`1.125rem`,V),r.style.setProperty(`height`,`1.125rem`,V),e.append(r)}var Te,Ee,De,Oe,M,N,P,F,I,ke,Ae,je,L,R,z,B,V,Me,Ne,Pe,Fe,H,Ie,U,Le,W,G,Re=e((()=>{l(),x(),y(),ve(),C(),Te=`2147483640`,Ee=320,De=220,Oe=!1,M=0,N=null,P=null,F=[],I=new Map,ke=()=>{for(let e of I.values())try{e.destroy()}catch{}I.clear()},Ae=e=>{I.get(e)?.destroy(),I.set(e,ie(e))},je=e=>{I.get(e)?.destroy(),I.delete(e)},L=new Map,R=new Map,z=new Map,B=new Map,typeof CSS<`u`&&(CSS.supports(`position-anchor: --cw-anchor-test`)||CSS.supports(`anchor-name: --cw-anchor-test`)),V=`important`,Me=()=>{if(Oe)return;Oe=!0;let e=document.createElement(`style`);e.id=`cw-unified-context-menu-style`,e.textContent=`
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${Te});
            pointer-events: none;
        }

        .cw-context-menu {
            /* WHY: Menu mounts on body (outside .wf-demo-root) — use :root wallpaper seeds. */
            --cw-menu-seed: var(--base-color, var(--color-primary, #00a3ad));
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: light dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            background: color-mix(in oklab, var(--color-surface-container, --u2-color-mod(var(--cw-menu-seed), 880)) 94%, transparent);
            color: var(--color-on-surface, --u2-color-mod(var(--cw-menu-seed), 100));
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
        }

        .cw-context-menu-under.underlying-shadow-container,
        .cw-context-menu-under {
            pointer-events: none !important;
            overflow: visible !important;
            z-index: -1 !important;
            filter: blur(12px) saturate(1.2) !important;
        }

        .cw-context-menu-under .underlying-shadow-geometry {
            background: #000000af !important;
            border-radius: 14px;
            overflow: hidden !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu {
                border: 1px solid color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
                background: color-mix(in oklab, var(--color-surface-container, --u2-color-mod(var(--cw-menu-seed), 160)) 96%, transparent);
                color: var(--color-on-surface, --u2-color-mod(var(--cw-menu-seed), 900));
                box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16));
            }

            .cw-context-menu-under .underlying-shadow-geometry {
                background: #0000001f !important;
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
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            box-sizing: border-box;
            display: block !important;
        }

        /*
         * INVARIANT: one horizontal row per item (icon | label | chevron).
         * Rows stay transparent inside the slab; FL-UI host button styling must not turn each row into its own gray chip.
         */
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
            justify-content: start !important;
            flex-direction: row !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            font-weight: 400 !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
            transition: none !important;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 16%, transparent) !important;
        }

        @media (prefers-color-scheme: light) {
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 12%, transparent) !important;
            }
        }

        button.cw-context-menu__item[disabled],
        .cw-context-menu button.cw-context-menu__item[disabled] {
            opacity: 0.45 !important;
            cursor: default !important;
        }

        .cw-context-menu__item--danger {
            color: var(--color-error, #fca5a5) !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu__item--danger {
                color: var(--color-error, #b91c1c) !important;
            }
        }

        .cw-context-menu__icon {
            justify-self: center !important;
            width: 1.375rem !important;
            height: 1.375rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /*
         * WHY:
         * 1) Inherited registered icon-color can be fully transparent — force currentColor.
         * 2) Phosphor min-size uses min(var(--icon-size), 100%); when percentage base is cyclic/0,
         *    mask ::before collapses — lock an explicit px box matching --icon-size.
         */
        .cw-context-menu__icon ui-icon,
        .cw-context-menu__chevron ui-icon {
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            width: var(--icon-size, 1.125rem) !important;
            height: var(--icon-size, 1.125rem) !important;
            min-width: var(--icon-size, 1.125rem) !important;
            min-height: var(--icon-size, 1.125rem) !important;
            min-inline-size: var(--icon-size, 1.125rem) !important;
            min-block-size: var(--icon-size, 1.125rem) !important;
            inline-size: var(--icon-size, 1.125rem) !important;
            block-size: var(--icon-size, 1.125rem) !important;
            max-inline-size: var(--icon-size, 1.125rem) !important;
            max-block-size: var(--icon-size, 1.125rem) !important;
            --icon-padding: 0px !important;
            color: inherit !important;
            --icon-color: currentColor !important;
            overflow: visible !important;
            pointer-events: none !important;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem !important;
        }

        .cw-context-menu__label {
            justify-self: stretch !important;
            text-align: start !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            min-width: 0 !important;
        }

        .cw-context-menu__chevron {
            justify-self: end !important;
            opacity: 0.72 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem !important;
        }

        /* Surfaces already tokenized above from wallpaper --base-color / --color-*. */
    `,document.head.appendChild(e)},Ne=()=>{for(let e of F)try{e()}catch{}F=[]},Pe=e=>{for(let[t,n]of Array.from(z.entries()))t>=e&&(clearTimeout(n),z.delete(t));for(let[t,n]of Array.from(B.entries()))t>=e&&(clearTimeout(n),B.delete(t))},Fe=(e,t,n)=>{e.style.left=`${t}px`,e.style.top=`${n}px`;let r=e.getBoundingClientRect(),i=Math.max(8,window.innerWidth-r.width-8),a=Math.max(8,window.innerHeight-r.height-8);e.style.left=`${Math.min(Math.max(8,t),i)}px`,e.style.top=`${Math.min(Math.max(8,n),a)}px`},H=e=>{Pe(e);for(let[t,n]of Array.from(L.entries()))t>=e&&(je(n),n.remove(),L.delete(t),R.delete(t))},Ie=(e,t)=>{let n=t.getBoundingClientRect();Fe(e,Math.round(n.right+4),Math.round(n.top))},U=e=>{for(let[t,n]of Array.from(B.entries()))t>=e&&(clearTimeout(n),B.delete(t))},Le=(e,t,n,r)=>{let i=document.createElement(`div`);i.className=`cw-context-menu${t?` cw-context-menu--compact`:``}`,i.setAttribute(`role`,`menu`),i.dataset.menuDepth=String(n),i.style.zIndex=String(n+1);let a=document.createElement(`ul`);a.className=`cw-context-menu__list`,be(a),i.appendChild(a);let o=(e,n,i)=>{if(r!==M||!P?.isConnected||!N?.isConnected||(H(i),!e.children?.length))return;let a=Le(e.children,t,i,r);a.classList.add(`cw-context-menu--submenu`),N.appendChild(a),L.set(i,a),R.set(i,n),Ie(a,n),Ae(a)},s=(e,t,n)=>{let r=z.get(n);r&&clearTimeout(r),U(n);let i=setTimeout(()=>{z.delete(n),o(e,t,n)},Ee);z.set(n,i)},c=e=>{let t=B.get(e);t&&clearTimeout(t);let n=setTimeout(()=>{B.delete(e),H(e)},De);B.set(e,n)};for(let t of e){let e=document.createElement(`button`);e.type=`button`,e.className=`cw-context-menu__item${t.danger?` cw-context-menu__item--danger`:``}`,e.setAttribute(`role`,`menuitem`),e.disabled=!!t.disabled;let i=!!t.children?.length,l=document.createElement(`span`);l.className=`cw-context-menu__icon`,t.icon&&we(l,t.icon);let u=document.createElement(`span`);u.className=`cw-context-menu__label`,u.textContent=t.label;let d=document.createElement(`span`);if(d.className=`cw-context-menu__chevron`,i&&we(d,`caret-right`),e.append(l,u,d),Se(e,!!t.danger),i){let i=n+1;e.setAttribute(`aria-haspopup`,`menu`),e.addEventListener(`pointerenter`,()=>s(t,e,i)),e.addEventListener(`pointerleave`,()=>c(i)),e.addEventListener(`click`,n=>{if(n.preventDefault(),n.stopPropagation(),r!==M||!P?.isConnected)return;U(i);let a=L.get(i),s=R.get(i);if(a?.isConnected&&s===e){H(i);return}o(t,e,i)})}else e.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),!(r!==M||!P?.isConnected)&&(W(),!t.disabled&&await t.action())});let f=document.createElement(`li`);xe(f),f.appendChild(e),a.appendChild(f)}return ye(i,t),i.addEventListener(`pointerenter`,()=>U(n)),i.addEventListener(`pointerleave`,()=>{if(n>0){let e=B.get(n);e&&clearTimeout(e);let t=setTimeout(()=>{B.delete(n),H(n)},De);B.set(n,t)}}),i},W=()=>{Ne(),Pe(0),H(1),L.clear(),R.clear(),ke(),P?.remove(),P=null,N?.remove(),N=null,M+=1},G=e=>{let t=(e.items||[]).filter(e=>e&&e.id&&e.label);if(!t.length){W();return}Me(),W();let n=M,r=e.resolveOverlayMountPoint?.(e.anchor??null)??ae(e.anchor??null),i=document.createElement(`div`);i.className=`cw-context-menu-layer`,i.style.setProperty(`position`,`fixed`,V),i.style.setProperty(`inset`,`0`,V),i.style.setProperty(`z-index`,Te,V),i.style.setProperty(`pointer-events`,`none`,V),i.style.setProperty(`backdrop-filter`,`none`,V),i.style.setProperty(`-webkit-backdrop-filter`,`none`,V),N=i,r.appendChild(i);let a=Le(t,!!e.compact,0,n);P=a,i.appendChild(a),Fe(a,e.x,e.y),Ae(a);let o=()=>{n!==M||!a.isConnected||Ce(a)},s=typeof customElements<`u`&&customElements.whenDefined?customElements.whenDefined(`ui-icon`).then(o).catch(()=>{}):Promise.resolve();queueMicrotask(()=>{s.then(o),requestAnimationFrame(()=>{o(),requestAnimationFrame(o)})});let c=e=>{if(!N?.isConnected||!P)return!1;let t=typeof e.composedPath==`function`?e.composedPath():[],n=Array.isArray(t)&&t.length?t:[];for(let e of n)if(e instanceof Element&&(e===N||e===P||N.contains(e)||e.classList?.contains?.(`cw-context-menu`)||e.closest?.(`.cw-context-menu`)))return!0;let r=e.target;return!!(r instanceof Node&&N.contains(r)||r instanceof Element&&r.closest?.(`.cw-context-menu`))},l=e=>{n!==M||!N?.isConnected||c(e)||W()},u=e=>{if(n!==M||!P?.isConnected)return;let t=e.target;if(!t)return;let r=t.closest?.(`.cw-context-menu__item`);if(!r&&typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element&&t.classList?.contains?.(`cw-context-menu__item`)){r=t;break}}if(!r){H(1);return}r.getAttribute(`aria-haspopup`)!==`menu`&&H(1)},d=e=>{n===M&&e.key===`Escape`&&W()},f=()=>W();queueMicrotask(()=>{n===M&&(document.addEventListener(`pointerdown`,l,{capture:!0}),document.addEventListener(`contextmenu`,l,{capture:!0}),document.addEventListener(`keydown`,d),a.addEventListener(`click`,u,{capture:!0}),window.addEventListener(`resize`,f,{passive:!0}),window.addEventListener(`blur`,f,{passive:!0}),F.push(()=>document.removeEventListener(`pointerdown`,l,{capture:!0})),F.push(()=>document.removeEventListener(`contextmenu`,l,{capture:!0})),F.push(()=>document.removeEventListener(`keydown`,d)),F.push(()=>a.removeEventListener(`click`,u,{capture:!0})),F.push(()=>window.removeEventListener(`resize`,f)),F.push(()=>window.removeEventListener(`blur`,f)))})}})),ze,Be=e((()=>{ze=`/*
 * Filename: TaskBar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/taskbar/scss/TaskBar.scss
 * Change date and time: 13.35.00_31.07.2026
 * Reason for changes: Reconnect after chrome.scss split — no cross-package Sass @use (use CSS var).
 */
/* Taskbar / env chrome (document + host). Former environment-shell/scss/chrome.scss. */
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 16.20.00_31.07.2026
 * Reason for changes: Box primary restored to familiar blue (#5a7fff/#7ca7ff); wallpaper may override.
 */
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
 * Global theme mixins — token NAMES stable; VALUES from --u2-color-mod.
 * Index scale: 0 white ← 550 seed → 1000 black (see function above).
 */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    color-scheme: light dark;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  @media (prefers-color-scheme: dark) {
    :root,
    :host,
    :scope {
      --color-primary: #7ca7ff;
      --base-color: var(--color-primary);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    }
  }
  [data-theme=light] {
    color-scheme: light;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
  }
  [data-theme=dark] {
    color-scheme: dark;
    --color-primary: #7ca7ff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
@layer ui-taskbar {
  /* Fixed chrome: taskbar (desktop + mobile dock) + FL-UI \`ui-statusbar\` (desktop meta). */
  /* WHY: \`--env-z-shell-chrome\` is set in environment-shell \`scss/root.scss\` ($z-shell-chrome). */
  .env-shell-chrome {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: var(--env-z-shell-chrome, 2147483000);
    isolation: isolate;
    display: flex;
    flex-direction: column;
    gap: 0;
    font: 12px ui-sans-serif, system-ui, sans-serif;
    color: var(--wf-md-on-surface-variant, oklch(78% 0.03 274deg));
    pointer-events: none;
  }
  .env-shell-chrome > * {
    pointer-events: auto;
  }
  /*
  * Taskbar base (desktop Win10 acrylic + mobile transparent dock share the same host).
  * Soft elevation: \`.env-shell-taskbar-under\` (UnderlyingShadow) — not box-shadow on blur host.
  */
  .env-shell-taskbar {
    order: 0;
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0.15rem;
    block-size: 2.5rem;
    min-block-size: 2.5rem;
    padding: 0 0.25rem;
    padding-block-end: env(safe-area-inset-bottom, 0);
    background: color-mix(in oklab, #1a1a1a 72%, transparent);
    border-block-start: 1px solid color-mix(in oklab, #fff 12%, transparent);
    backdrop-filter: blur(22px) saturate(1.35);
    -webkit-backdrop-filter: blur(22px) saturate(1.35);
    color: #f3f3f3;
    box-shadow: none;
  }
  .env-shell-taskbar-under.underlying-shadow-container,
  .env-shell-taskbar-under {
    pointer-events: none !important;
    overflow: visible !important;
    z-index: -1 !important;
  }
  .env-shell-taskbar-under .underlying-shadow-geometry {
    background: transparent !important;
    box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.4) !important;
  }
  .env-shell-taskbar::part(taskbar) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0.15rem;
    flex: 1;
    min-inline-size: 0;
    inline-size: 100%;
  }
  .env-shell-taskbar__pins,
  .env-shell-taskbar__windows {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0;
    min-inline-size: 0;
  }
  .env-shell-taskbar__pins {
    flex: 0 0 auto;
  }
  .env-shell-taskbar__pins [data-env-home] {
    backdrop-filter: blur(10px);
    transform: translateY(-0.5rem);
    outline: solid 1px light-dark(rgba(0, 0, 0, 0.1333333333), rgba(255, 255, 255, 0.1333333333));
  }
  .env-shell-taskbar__windows {
    flex: 1 1 auto;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .env-shell-taskbar ui-task {
    cursor: pointer;
    color: inherit;
    align-self: stretch;
    min-inline-size: 2.75rem;
    min-block-size: 100%;
    padding-inline: 0.55rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    outline: none;
    opacity: 1;
    /* Active underline via inset shadow so we don't fight ui-task border tokens. */
    box-shadow: inset 0 -2px 0 transparent;
  }
  .env-shell-taskbar ui-task:hover {
    background: color-mix(in oklab, #fff 10%, transparent);
    opacity: 1;
  }
  .env-shell-taskbar ui-task[data-env-active=true],
  .env-shell-taskbar ui-task[data-active],
  .env-shell-taskbar ui-task[data-focus] {
    outline: none;
    opacity: 1;
    background: color-mix(in oklab, #fff 14%, transparent);
    box-shadow: inset 0 -2px 0 #60cdff;
  }
  .env-shell-taskbar ui-task[data-minimized] {
    opacity: 0.65;
  }
  .env-shell-taskbar__tray-host {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 0.35rem;
    padding-inline: 0.35rem;
    border-inline-start: 1px solid color-mix(in oklab, #fff 12%, transparent);
  }
  .env-shell-taskbar__clock {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 0.05rem;
    min-inline-size: 4.5rem;
    padding-inline: 0.35rem 0.15rem;
    line-height: 1.05;
    user-select: none;
    pointer-events: none;
  }
  .env-shell-taskbar__clock-time {
    font-size: 0.78rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: #f3f3f3;
  }
  .env-shell-taskbar__clock-date {
    font-size: 0.62rem;
    font-weight: 500;
    color: color-mix(in oklab, #f3f3f3 72%, transparent);
    white-space: nowrap;
  }
  /* Desktop: icon-only tasks (tooltip via title / aria-label). */
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title) {
    display: none !important;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task {
    min-inline-size: 2.5rem;
    padding-inline: 0.45rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon) {
    inline-size: 1.35rem;
    block-size: 1.35rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph) {
    inline-size: 1.35rem;
    block-size: 1.35rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter) {
    font-size: 0.8rem;
  }
  /* Desktop: Home pin is redundant (empty bar / menu → Show desktop). */
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home] {
    display: none !important;
  }
  /*
  * Mobile nav bar: fully transparent; centered house icon only.
  * Long-press Home → \`.env-shell-navbar__switcher\` (open processes).
  */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar {
    position: relative;
    display: flex;
    flex-direction: row;
    place-content: center;
    place-items: center;
    place-self: center;
    align-items: center;
    justify-content: center;
    gap: 0;
    block-size: 3rem;
    min-block-size: 3rem;
    padding: 0.15rem 0.75rem;
    padding-block-end: calc(0.15rem + env(safe-area-inset-bottom, 0px));
    background: transparent;
    border-block-start: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins {
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]) {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home] {
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
    padding: 0;
    border-radius: 999px;
    background: transparent;
    box-shadow: none;
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
  }
  /* Icon-only Home (hide task title label). */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title) {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon) {
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }
  /* Prefer Phosphor glyph; letter fallback is last resort (was wrongly showing "U"). */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph) {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    opacity: 1;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter) {
    opacity: 0;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:hover,
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:active {
    background: color-mix(in oklch, #fff 10%, transparent);
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-env-active=true],
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-active],
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-focus] {
    background: color-mix(in oklch, #fff 8%, transparent);
    /*box-shadow: inset 0 -2px 0 #60cdff;*/
  }
  /*
   * Mobile footer statusbar is replaced by the fixed overlay band when
   * \`[data-status-overlay]\` is set (see statusbar.scss). Without overlay
   * (standalone), hide the footer copy entirely.
   */
  .env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-ui-statusbar {
    display: none !important;
  }
}`}));function K(e){return`${Ge}${String(e||``).trim().toLowerCase()}`}function q(){let e=document.querySelector(`.env-shell-chrome`);return e instanceof HTMLElement&&e.hasAttribute(`data-desktop`)?!1:e instanceof HTMLElement&&e.dataset.chromeLayout===`mobile`||typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches}function Ve(e=new Date){return{time:e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),date:e.toLocaleDateString(void 0,{weekday:`short`,day:`numeric`,month:`short`})}}function He(e){let t=ee([]);ne(t),re(J,t,{title:`Home`,icon:`house-line`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`home`,e.onHome()}),re(Y,t,{title:`Markdown`,icon:`article`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`viewer`,e.onViewer()});let n=document.createElement(`ui-taskbar`);n.className=`env-shell-taskbar wf-chrome-no-select`,n.setAttribute(`part`,`taskbar`),n.setAttribute(`data-type`,`desktop`);let r=document.createElement(`div`);r.className=`env-shell-taskbar__pins`;let i=document.createElement(`div`);i.className=`env-shell-taskbar__windows`;let o=document.createElement(`ui-task`);o.setAttribute(`title`,`Home`),o.setAttribute(`icon`,`house-line`),o.setAttribute(`data-id`,J),o.setAttribute(`data-env-home`,``),o.setAttribute(`aria-label`,`Home`),o.setAttribute(`aria-haspopup`,`menu`),o.setAttribute(`aria-keyshortcuts`,`LongPress`);let s=document.createElement(`ui-task`);s.setAttribute(`title`,`Markdown`),s.setAttribute(`icon`,`article`),s.setAttribute(`data-id`,Y),s.setAttribute(`data-env-pin`,`viewer`),s.setAttribute(`aria-label`,`Markdown`),r.append(o,s);let c=document.createElement(`div`);c.className=`env-shell-taskbar__tray-host`;let l=document.createElement(`div`);l.className=`env-shell-taskbar__clock`,l.setAttribute(`role`,`timer`),l.setAttribute(`aria-live`,`polite`);let u=document.createElement(`span`);u.className=`env-shell-taskbar__clock-time`;let d=document.createElement(`span`);d.className=`env-shell-taskbar__clock-date`,l.append(u,d);let f=()=>{let{time:e,date:t}=Ve();u.textContent=e,d.textContent=t,l.title=`${e} · ${t}`};f();let te=setInterval(f,qe);c.append(pe(e.device,`env-device-tray env-device-tray--taskbar`),l);let p=document.createElement(`div`);p.className=`env-shell-navbar__switcher`,p.setAttribute(`role`,`menu`),p.setAttribute(`aria-label`,`Open apps`),p.hidden=!0;let m=document.createElement(`ul`);m.className=`env-shell-navbar__switcher-list`,p.appendChild(m),n.append(r,i,c,p);let h=new Map,g=[],_=null,y=!1,b=!1,x=null,S=[];S.push(()=>clearInterval(te));let C=e=>g.find(t=>String(t.id||``).trim().toLowerCase()===e),ae=t=>{let n=String(t||``).trim().toLowerCase();if(!n)return;let r=C(n),i=String(e.focusedTaskId.value||``).trim().toLowerCase(),a=!!r?.focused||i===n||i===`markdown`&&n===`viewer`||i===`viewer`&&(n===`viewer`||n===`markdown`);if(r?.minimized){r.minimized=!1,r.focused=!0,h.get(n)?.toggleAttribute(`data-minimized`,!1),e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n);return}if(a&&r&&r.visible!==!1){r.minimized=!0,r.focused=!1,h.get(n)?.toggleAttribute(`data-minimized`,!0),e.onMinimizeWindow?.(n);return}e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n)},w=(t,r,i)=>{if(q())return;t.preventDefault(),t.stopPropagation();let a=String(r||``).trim().toLowerCase(),o=!!C(a)?.minimized,s=[{id:o?`restore`:`minimize`,label:o?`Restore`:`Minimize`,icon:o?`arrow-square-out`:`minus`,action:()=>{o?(e.focusedTaskId.value=a,e.onWindowTask?.(a)):e.onMinimizeWindow?.(a)}},{id:`close`,label:`Close`,icon:`x`,danger:!0,action:()=>e.onCloseWindow?.(a)}];G({x:t.clientX,y:t.clientY,compact:!0,anchor:t.target instanceof Element?t.target:n,items:s})};n.addEventListener(`contextmenu`,t=>{if(q())return;let r=typeof t.composedPath==`function`?t.composedPath():[];for(let e of r)if(e instanceof Element&&e.closest?.(`ui-task`))return;t.preventDefault(),t.stopPropagation(),G({x:t.clientX,y:t.clientY,compact:!0,anchor:n,items:[{id:`show-desktop`,label:`Show desktop`,icon:`desktop`,action:()=>e.onHome()},{id:`home`,label:`Home`,icon:`house-line`,action:()=>e.onHome()}]})});let T=()=>{b=!1,p.hidden=!0,m.replaceChildren(),n.removeAttribute(`data-switcher-open`)},E=()=>{let r=g.filter(e=>String(e.id||``).trim());if(m.replaceChildren(),r.length)for(let n of r){let r=String(n.id||``).trim().toLowerCase(),i=document.createElement(`li`);i.className=`env-shell-navbar__switcher-row`,i.setAttribute(`role`,`none`);let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-navbar__switcher-item`,a.setAttribute(`role`,`menuitem`),a.toggleAttribute(`data-active`,!!n.focused&&!n.minimized),a.toggleAttribute(`data-minimized`,!!n.minimized);let o=document.createElement(`ui-icon`);o.setAttribute(`icon`,n.icon||`app-window`),o.setAttribute(`icon-style`,`duotone`),o.setAttribute(`aria-hidden`,`true`);let s=document.createElement(`span`);s.className=`env-shell-navbar__switcher-label`,s.textContent=n.title||r,a.append(o,s),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation(),T(),e.focusedTaskId.value=r;let i=K(r),a=v(t,i);a?a.focus=!0:e.onWindowTask?.(r)});let c=document.createElement(`button`);c.type=`button`,c.className=`env-shell-navbar__switcher-close`,c.setAttribute(`aria-label`,`Close ${n.title||r}`),c.title=`Close`;let l=document.createElement(`ui-icon`);l.setAttribute(`icon`,`x`),l.setAttribute(`icon-style`,`bold`),l.setAttribute(`aria-hidden`,`true`),c.appendChild(l),c.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.onCloseWindow?.(r),g=g.filter(e=>String(e.id||``).trim().toLowerCase()!==r),h.get(r)?.remove(),h.delete(r),g.length?E():T()}),i.append(a,c),m.appendChild(i)}else{let e=document.createElement(`li`);e.className=`env-shell-navbar__switcher-empty`,e.textContent=`No open apps`,m.appendChild(e)}b=!0,p.hidden=!1,n.setAttribute(`data-switcher-open`,``)},D=()=>{_!=null&&(clearTimeout(_),_=null)},O=()=>{T(),v(t,J).focus=!0};o.addEventListener(`click`,e=>{if(y){e.preventDefault(),e.stopPropagation(),y=!1;return}O()}),o.addEventListener(`pointerdown`,e=>{if(q()&&!(e.button!=null&&e.button!==0)){y=!1,D(),_=setTimeout(()=>{_=null,y=!0;try{o.releasePointerCapture?.(e.pointerId)}catch{}E()},Ke);try{o.setPointerCapture?.(e.pointerId)}catch{}}},{capture:!0});let k=()=>{D()};o.addEventListener(`pointerup`,k,{capture:!0}),o.addEventListener(`pointercancel`,k,{capture:!0}),o.addEventListener(`contextmenu`,e=>{q()&&(e.preventDefault(),y=!0,D(),E())}),s.addEventListener(`click`,()=>{let e=C(`viewer`)||C(`markdown`);if(e){ae(String(e.id||`viewer`).toLowerCase());return}v(t,Y).focus=!0}),s.addEventListener(`contextmenu`,t=>{let n=C(`viewer`)||C(`markdown`);if(!n){if(q())return;t.preventDefault(),G({x:t.clientX,y:t.clientY,compact:!0,anchor:s,items:[{id:`open-markdown`,label:`Open Markdown`,icon:`article`,action:()=>e.onViewer()}]});return}w(t,String(n.id||`viewer`),n.title||`Markdown`)});let oe=e=>{if(!b)return;let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t)if(e===p||e===o||e instanceof Element&&(e===p||p.contains(e)||e===o))return;T()};document.addEventListener(`pointerdown`,oe,{capture:!0}),S.push(()=>document.removeEventListener(`pointerdown`,oe,{capture:!0}));let A=()=>{let t=String(e.focusedTaskId.value||`home`),n=(e,t)=>{e.toggleAttribute(`data-env-active`,t),e.toggleAttribute(`data-active`,t),e.toggleAttribute(`data-focus`,t)};n(o,t===`home`),n(s,t===`viewer`||t===`markdown`);for(let[e,r]of h)n(r,t===e)};a(()=>{A()},[e.focusedTaskId],{triggerImmediately:!0});let se=e=>{let n=String(e.id||``).trim().toLowerCase();if(!n||n===`home`)return;let r=K(n),a=e.title||n,o=String(e.icon||``).trim()||`app-window`,s=h.get(n);if(!s){let e=re(r,null,{title:a,icon:o},{viewId:n},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,ae(n)});e.list=t,t.push(e),s=document.createElement(`ui-task`),s.setAttribute(`data-id`,r),s.setAttribute(`data-view`,n),s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),ae(n)}),s.addEventListener(`contextmenu`,e=>{w(e,n,a)}),h.set(n,s),i.appendChild(s)}s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.toggleAttribute(`data-minimized`,!!e.minimized),s.hidden=e.visible===!1},ce=n=>{g=Array.isArray(n)?n.slice():[];let r=new Set;for(let t of n){let n=String(t.id||``).trim().toLowerCase();!n||n===`home`||(r.add(n),se(t),t.focused&&(e.focusedTaskId.value=n))}for(let[e,n]of[...h.entries()]){if(r.has(e))continue;let i=K(e),a=v(t,i);if(a){let e=t.indexOf(a);e>=0&&t.splice(e,1)}n.remove(),h.delete(e)}A(),b&&E()},le=n=>{let r=String(n||`home`).toLowerCase(),i=J;r===`viewer`||r===`markdown`?i=Y:r!==`home`&&(i=K(r));let a=v(t,i);if(a){for(let e of t)e!==a&&(e.active=!1);a.active=!0}e.focusedTaskId.value=r===`markdown`?`viewer`:r,A()},ue=()=>{q()?x&&=(x.destroy(),null):!x&&n.isConnected&&(x=ie(n,{className:`env-shell-taskbar-under`,shadowBlur:28,shadowOffsetY:8,shadowColor:`rgba(0, 0, 0, 0.4)`}))};queueMicrotask(ue);let j=typeof matchMedia==`function`?matchMedia(`(min-width: 641px)`):null,de=()=>ue();return j?.addEventListener?.(`change`,de),S.push(()=>j?.removeEventListener?.(`change`,de)),{element:n,taskList:t,setFocusedTaskId:le,syncWindowTasks:ce,dispose:()=>{D(),T(),x?.destroy(),x=null;for(let e of S)try{e()}catch{}S.length=0,h.clear(),i.replaceChildren()}}}var Ue,We,J,Y,Ge,Ke,qe,Je=e((()=>{x(),y(),r(),Re(),_e(),O(),Be(),l(),T(),Ue=u(ze),We=class extends D{constructor(){super()}styles=()=>Ue;render=()=>o`<div part="taskbar" class="taskbar"><slot></slot></div>`},We=w([_(`ui-taskbar`)],We),J=`#env-home`,Y=`#env-viewer`,Ge=`#env-win-`,Ke=420,qe=3e4})),Ye,Xe=e((()=>{Ye=`/**
 * Font Styles Index
 *
 * Font style declarations (not loading fonts directly)
 * Fonts are loaded via JavaScript font-loader module
 */
/**
 * Inter Font Family Styles
 *
 * Style declarations for Inter font family (not loading directly)
 * Fonts are loaded via JavaScript font-loader module
 */
/* Fallback fonts: */
:root, :host, :scope {
  font-family: Inter, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 16;
}

/* Variable fonts usage: */
@supports (font-variation-settings: normal) {
  :root, :host, :scope {
    font-family: InterVariable, sans-serif;
    font-optical-sizing: auto;
    font-variation-settings: "opsz" 16;
  }
}
/* Font feature values: */
@font-feature-values InterVariable {
  @character-variant {
    cv01: 1;
    cv02: 2;
    cv03: 3;
    cv04: 4;
    cv05: 5;
    cv06: 6;
    cv07: 7;
    cv08: 8;
    cv09: 9;
    cv10: 10;
    cv11: 11;
    cv12: 12;
    cv13: 13;
    alt-1: 1; /* Alternate one */
    alt-3: 9; /* Flat-top three */
    open-4: 2; /* Open four */
    open-6: 3; /* Open six */
    open-9: 4; /* Open nine */
    lc-l-with-tail: 5; /* Lower-case L with tail */
    simplified-u: 6; /* Simplified u */
    alt-double-s: 7; /* Alternate German double s */
    uc-i-with-serif: 8; /* Upper-case i with serif */
    uc-g-with-spur: 10; /* Capital G with spur */
    single-story-a: 11; /* Single-story a */
    compact-lc-f: 12; /* Compact f */
    compact-lc-t: 13; /* Compact t */
  }
  @styleset {
    ss01: 1;
    ss02: 2;
    ss03: 3;
    ss04: 4;
    ss05: 5;
    ss06: 6;
    ss07: 7;
    ss08: 8;
    open-digits: 1; /* Open digits */
    disambiguation: 2; /* Disambiguation (with zero) */
    disambiguation-except-zero: 4; /* Disambiguation (no zero) */
    round-quotes-and-commas: 3; /* Round quotes & commas */
    square-punctuation: 7; /* Square punctuation */
    square-quotes: 8; /* Square quotes */
    circled-characters: 5; /* Circled characters */
    squared-characters: 6; /* Squared characters */
  }
}
@font-feature-values Inter {
  @character-variant {
    cv01: 1;
    cv02: 2;
    cv03: 3;
    cv04: 4;
    cv05: 5;
    cv06: 6;
    cv07: 7;
    cv08: 8;
    cv09: 9;
    cv10: 10;
    cv11: 11;
    cv12: 12;
    cv13: 13;
    alt-1: 1; /* Alternate one */
    alt-3: 9; /* Flat-top three */
    open-4: 2; /* Open four */
    open-6: 3; /* Open six */
    open-9: 4; /* Open nine */
    lc-l-with-tail: 5; /* Lower-case L with tail */
    simplified-u: 6; /* Simplified u */
    alt-double-s: 7; /* Alternate German double s */
    uc-i-with-serif: 8; /* Upper-case i with serif */
    uc-g-with-spur: 10; /* Capital G with spur */
    single-story-a: 11; /* Single-story a */
    compact-lc-f: 12; /* Compact f */
    compact-lc-t: 13; /* Compact t */
  }
  @styleset {
    ss01: 1;
    ss02: 2;
    ss03: 3;
    ss04: 4;
    ss05: 5;
    ss06: 6;
    ss07: 7;
    ss08: 8;
    open-digits: 1; /* Open digits */
    disambiguation: 2; /* Disambiguation (with zero) */
    disambiguation-except-zero: 4; /* Disambiguation (no zero) */
    round-quotes-and-commas: 3; /* Round quotes & commas */
    square-punctuation: 7; /* Square punctuation */
    square-quotes: 8; /* Square quotes */
    circled-characters: 5; /* Circled characters */
    squared-characters: 6; /* Squared characters */
  }
}
@font-feature-values InterDisplay {
  @character-variant {
    cv01: 1;
    cv02: 2;
    cv03: 3;
    cv04: 4;
    cv05: 5;
    cv06: 6;
    cv07: 7;
    cv08: 8;
    cv09: 9;
    cv10: 10;
    cv11: 11;
    cv12: 12;
    cv13: 13;
    alt-1: 1; /* Alternate one */
    alt-3: 9; /* Flat-top three */
    open-4: 2; /* Open four */
    open-6: 3; /* Open six */
    open-9: 4; /* Open nine */
    lc-l-with-tail: 5; /* Lower-case L with tail */
    simplified-u: 6; /* Simplified u */
    alt-double-s: 7; /* Alternate German double s */
    uc-i-with-serif: 8; /* Upper-case i with serif */
    uc-g-with-spur: 10; /* Capital G with spur */
    single-story-a: 11; /* Single-story a */
    compact-lc-f: 12; /* Compact f */
    compact-lc-t: 13; /* Compact t */
  }
  @styleset {
    ss01: 1;
    ss02: 2;
    ss03: 3;
    ss04: 4;
    ss05: 5;
    ss06: 6;
    ss07: 7;
    ss08: 8;
    open-digits: 1; /* Open digits */
    disambiguation: 2; /* Disambiguation (with zero) */
    disambiguation-except-zero: 4; /* Disambiguation (no zero) */
    round-quotes-and-commas: 3; /* Round quotes & commas */
    square-punctuation: 7; /* Square punctuation */
    square-quotes: 8; /* Square quotes */
    circled-characters: 5; /* Circled characters */
    squared-characters: 6; /* Squared characters */
  }
}
/*
 * Filename: _variables.scss
 * FullPath: modules/projects/fl.ui/src/styles/ui/_variables.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: Fallback --color-* via --u2-color-mod (token names kept).
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
:root {
  --fl-ui-radius: 0.5rem;
  --fl-ui-gap: 0.75rem;
  /* Explorer / shell (used by _explorer.scss, _explorer-content.scss) */
  --color-primary: #3794ff;
  --base-color: var(--color-primary);
  --color-surface: --u2-color-mod(var(--base-color), 920);
  --color-on-surface: --u2-color-mod(var(--base-color), 100);
  --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
  --error-color: #f87171;
}

/* ai-refactor: optimized/refactored at 2026-02-13T00:45:15Z */
/* ai-refactor: optimized/refactored at 2026-02-13T00:45:12Z */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding-block: 0px;
    padding-inline: 0px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    background: var(--color-bg-alt);
    color: var(--color-fg);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn:hover:not(:disabled) {
    background: var(--color-border);
  }
  .btn:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn {
    --ui-bg: var(--color-surface-container-high);
    --ui-fg: var(--color-on-surface);
    --ui-bg-hover: var(--color-surface-container-highest);
    --ui-ring: var(--color-primary);
    --ui-radius: var(--radius-lg);
    --ui-pad-y: var(--space-sm);
    --ui-pad-x: var(--space-lg);
    --ui-font-size: var(--text-sm);
    --ui-font-weight: var(--font-weight-semibold);
    --ui-min-h: 40px;
    --ui-opacity: 1;
    appearance: none;
    border: none;
    background: var(--ui-bg);
    color: var(--ui-fg);
    border-radius: var(--ui-radius);
    padding: max(var(--ui-pad-y, 0px), 0px) max(var(--ui-pad-x, 0px), 0px);
    font-size: var(--ui-font-size);
    font-weight: var(--ui-font-weight);
    letter-spacing: 0.01em;
    line-height: 1.2;
    block-size: calc-size(fit-content, max(var(--ui-min-h), size));
    transition: background-color var(--motion-fast), box-shadow var(--motion-fast), transform var(--motion-fast);
    box-shadow: var(--elev-0);
    user-select: none;
    touch-action: manipulation;
    pointer-events: auto;
    gap: var(--space-xs);
    text-transform: none;
    opacity: var(--ui-opacity);
    min-block-size: fit-content;
    min-inline-size: calc-size(fit-content, size + 0.5rem + var(--icon-size, 1rem));
    max-inline-size: none;
    max-block-size: stretch;
    flex-direction: row;
    flex-wrap: nowrap;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    text-decoration: none;
    text-shadow: none;
    text-rendering: auto;
    contain: none;
    container-type: normal;
    place-items: center;
    place-content: center;
    justify-content: safe center;
    justify-items: safe center;
    align-content: safe center;
    align-items: safe center;
  }
  .btn > ui-icon {
    flex-shrink: 0;
    pointer-events: none;
    color: inherit;
    align-self: center;
    vertical-align: middle;
  }
  @media (max-width: 480px) {
    .btn.btn-icon {
      font-size: 0px !important;
      aspect-ratio: 1/1;
      block-size: fit-content;
      max-block-size: stretch;
      min-inline-size: 0px;
      max-inline-size: fit-content;
      gap: 0px;
    }
    .btn.btn-icon .btn-text,
    .btn.btn-icon span:not(.sr-only) {
      display: none !important;
    }
  }
  .btn:hover {
    background: var(--ui-bg-hover);
    box-shadow: var(--elev-1);
    transform: translateY(-1px);
  }
  .btn:active {
    transform: translateY(0);
    box-shadow: var(--elev-0);
  }
  .btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ui-ring) 35%, transparent);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  .btn:disabled:hover {
    background: var(--color-surface-container-high);
    box-shadow: var(--elev-0);
  }
  .btn.primary, .btn.active {
    --ui-bg: var(--color-primary);
    --ui-fg: var(--color-on-primary);
    --ui-ring: var(--color-primary);
  }
  .btn.primary {
    --ui-bg-hover: color-mix(in oklab, var(--color-primary) 90%, black);
  }
  .btn.active {
    box-shadow: var(--elev-1);
  }
  .btn.small {
    --ui-pad-y: var(--space-xs);
    --ui-pad-x: var(--space-md);
    --ui-font-size: var(--text-xs);
    --ui-min-h: 32px;
    --ui-radius: var(--radius-md);
  }
  .btn.icon-btn {
    inline-size: 40px;
    block-size: 40px;
    --ui-pad-y: 0px;
    --ui-pad-x: 0px;
    --ui-radius: 9999px;
    --ui-font-size: var(--text-lg);
  }
  .btn[data-action=open-md], .btn[data-action=export-md], .btn[data-action=export-docx] {
    --ui-font-size: 12px;
    --ui-pad-x: 8px;
    --ui-pad-y: 0px;
    --ui-min-h: 28px;
  }
  .btn:is([data-action=view-markdown-viewer],
  [data-action=view-markdown-editor],
  [data-action=view-rich-editor],
  [data-action=view-settings],
  [data-action=view-history],
  [data-action=view-workcenter]) {
    --ui-font-size: 13px;
    --ui-font-weight: 500;
    --ui-pad-x: 12px;
    --ui-pad-y: 0px;
    --ui-min-h: 32px;
    --ui-radius: 16px;
    text-transform: capitalize;
  }
  .btn:is([data-action=view-markdown-viewer],
  [data-action=view-markdown-editor],
  [data-action=view-rich-editor],
  [data-action=view-settings],
  [data-action=view-history],
  [data-action=view-workcenter][data-current],
  [data-action=view-workcenter].active) {
    --ui-bg: var(--color-surface-container-highest);
    --ui-fg: var(--color-primary);
    --ui-ring: var(--color-primary);
  }
  .btn:is([data-action=toggle-edit],
  [data-action=snip],
  [data-action=solve],
  [data-action=code],
  [data-action=css],
  [data-action=voice],
  [data-action=edit-templates],
  [data-action=recognize],
  [data-action=analyze],
  [data-action=select-files],
  [data-action=clear-prompt],
  [data-action=view-full-history]) {
    --ui-font-size: 12px;
    --ui-pad-x: 8px;
    --ui-pad-y: 0px;
    --ui-min-h: 28px;
    --ui-radius: 14px;
  }
  .btn:has(> ui-icon):not(:has(> *:not(ui-icon))), .btn:has(> span:only-of-type:empty) {
    font-size: 0px !important;
    aspect-ratio: 1/1;
    block-size: fit-content;
    max-block-size: stretch;
    min-inline-size: 0px;
    max-inline-size: fit-content;
    gap: 0px;
    overflow: visible;
  }
  .btn:has(> ui-icon):not(:has(> *:not(ui-icon))) span:not(.sr-only), .btn:has(> span:only-of-type:empty) span:not(.sr-only) {
    display: none !important;
  }
  .btn-primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }
  @media (max-inline-size: 768px) {
    .btn {
      --ui-pad-y: var(--space-xs);
      --ui-pad-x: var(--space-md);
      --ui-font-size: var(--text-xs);
      --ui-min-h: 36px;
    }
  }
  @media (max-inline-size: 480px) {
    .btn {
      --ui-pad-y: var(--space-xs);
      --ui-pad-x: var(--space-xs);
      --ui-font-size: var(--text-xs);
      --ui-min-h: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn.btn-icon {
      overflow: visible;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
      transform: none !important;
    }
    .btn:hover, .btn:active {
      transform: none !important;
    }
  }
}
@layer utilities {
  .round-decor {
    --background-tone-shift: 0;
    padding-block: 0.25rem;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  .round-decor:empty {
    padding: 0;
    display: none;
    pointer-events: none;
    visibility: collapse;
  }
  .time-format {
    display: inline-flex;
    flex-direction: row;
    place-content: center;
    place-items: center;
    place-self: center;
    padding: 0.125rem;
    font: 500 0.9em "InterVariable", "Inter", "Fira Mono", "Menlo", "Consolas", monospace;
    font-optical-sizing: auto;
    font-variant-numeric: tabular-nums;
    font-kerning: auto;
    font-stretch: condensed;
    font-width: condensed;
    letter-spacing: -0.05em;
    text-wrap: nowrap;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /*
   * WHY: Launcher caption rows use \`[data-layer="labels"]\`; a global \`span { aspect-ratio: 1/1 }\` makes each pill as tall as its width (“box” tiles).
   * Square helpers apply only outside label captions (icon/grid tiles still use spans elsewhere).
   */
  .ui-ws-item:not([data-layer=labels]) span {
    pointer-events: none;
    aspect-ratio: 1/1;
    inline-size: fit-content;
    block-size: fit-content;
    display: inline;
  }
  .ui-ws-item {
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
  }
  .ui-ws-item:active, .ui-ws-item:has(:active) {
    will-change: inset, translate, transform, opacity, z-index;
    cursor: grabbing;
  }
}
@layer essentials {
  @media print {
    .ctx-menu, .ux-anchor, .component-loading, .component-error {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: absolute !important;
      inset: 0 !important;
      z-index: -1 !important;
      inline-size: 0 !important;
      block-size: 0 !important;
      max-inline-size: 0 !important;
      max-block-size: 0 !important;
      min-inline-size: 0 !important;
      min-block-size: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      overflow: hidden !important;
    }
  }
  @media screen {
    :root, :host, :scope {
      --font-family: "InterVariable", "Inter", "Helvetica Neue", "Helvetica", "Calibri", "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    }
    ui-window-frame,
    ui-modal,
    .ui-grid-item {
      --opacity: 1;
      --scale: 1;
      --rotate: 0deg;
      --translate-x: 0%;
      --translate-y: 0%;
      isolation: isolate;
      content-visibility: auto;
      transform-origin: 50% 50%;
      transform-style: flat;
      transform-box: fill-box;
      translate: 0% 0% 0%;
      opacity: var(--opacity, 1);
      rotate: 0deg;
      scale: 1;
    }
    .ctx-menu {
      --font-family: "InterVariable", "Inter", "Helvetica Neue", "Helvetica", "Calibri", "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    }
    .ctx-menu,
    .ctx-menu * {
      visibility: visible;
      content-visibility: visible;
    }
    .ctx-menu {
      position: fixed;
      z-index: 99999;
      inline-size: max-content;
      min-inline-size: 160px;
      max-inline-size: min(240px, 100cqi);
      block-size: fit-content;
      padding: 0.25rem 0;
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-md);
      background-color: var(--color-surface);
      color: var(--color-on-surface);
      font-size: 0.875rem;
      font-weight: 400;
      box-shadow: var(--elev-3);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: scale3d(var(--scale, 1), var(--scale, 1), 1) translate3d(var(--translate-x, 0px), var(--translate-y, 0px), 0px);
      transition: opacity 0.15s ease-out, visibility 0.15s ease-out, transform 0.15s ease-out;
      font-family: var(--font-family, 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif') !important;
      text-align: start;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .ctx-menu[data-hidden] {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .ctx-menu > * {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      text-align: start;
      inline-size: stretch;
      min-block-size: 2rem;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border: none;
      border-radius: var(--radius-sm);
      outline: none;
      position: relative;
      background-color: transparent;
      color: var(--color-on-surface);
      cursor: pointer;
      text-wrap: nowrap;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      pointer-events: auto;
      transition: background-color 0.15s ease, color 0.15s ease;
      font-family: var(--font-family, 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif') !important;
    }
    .ctx-menu > *:hover {
      background-color: var(--color-surface-container-high);
      color: var(--color-on-surface);
    }
    .ctx-menu > *:active {
      background-color: var(--color-surface-container-highest);
      color: var(--color-on-surface);
    }
    .ctx-menu > *:focus-visible {
      outline: var(--focus-ring);
      background-color: var(--color-surface-container-high);
    }
    .ctx-menu > *:not(.ctx-menu-separator) {
      gap: 0.5rem;
    }
    .ctx-menu > * > * {
      pointer-events: none;
    }
    .ctx-menu > * > span {
      flex: 1 1 auto;
      min-inline-size: 0;
      text-align: start !important;
      user-select: none;
      pointer-events: none;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25;
      color: inherit;
    }
    .ctx-menu > * > ui-icon {
      --icon-size: 1rem;
      flex-shrink: 0;
      inline-size: var(--icon-size);
      block-size: var(--icon-size);
      color: var(--color-on-surface-variant);
      user-select: none;
      pointer-events: none;
    }
    .ctx-menu > .ctx-menu-separator, .ctx-menu.ctx-menu-separator {
      min-block-size: auto;
      block-size: 1px;
      margin: 0.125rem 0.375rem;
      padding: 0;
      background-color: var(--color-outline-variant);
      opacity: 0.3;
      pointer-events: none;
    }
    .ctx-menu {
      /*
       * \`.grid-rows\` applies subgrid + place(center) to children, which centers
       * label text per row. Context menus must stay flex rows with start-aligned labels.
       */
    }
    .ctx-menu.grid-rows {
      display: flex !important;
      flex-direction: column;
      align-items: stretch;
      grid-template-columns: unset !important;
      grid-auto-rows: unset !important;
    }
    .ctx-menu.grid-rows > *:not(.ctx-menu-separator) {
      display: flex !important;
      flex-flow: row nowrap !important;
      align-items: center !important;
      justify-content: flex-start !important;
      grid-column: unset !important;
      grid-row: unset !important;
      grid-template-columns: unset !important;
      grid-template-rows: unset !important;
      place-content: unset !important;
      place-items: unset !important;
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
      writing-mode: horizontal-tb;
      translate: 0% 0% 0%;
      transform: none;
    }
    .component-loading,
    .component-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
      color: var(--text-secondary, light-dark(#666, #aaa));
    }
    .component-loading .loading-spinner {
      inline-size: 2rem;
      block-size: 2rem;
      border: 2px solid var(--border, light-dark(#ddd, #444));
      border-block-start: 2px solid var(--primary, light-dark(#007bff, #5fa8ff));
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .component-error {
      text-align: center;
    }
    .component-error h3 {
      margin: 0;
      color: var(--error, light-dark(#dc3545, #ff6b6b));
    }
    .component-error p {
      margin: 0;
    }
    ui-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--icon-size, 1.25rem);
      block-size: var(--icon-size, 1.25rem);
      min-inline-size: var(--icon-size, 1.25rem);
      min-block-size: var(--icon-size, 1.25rem);
      color: currentColor;
      fill: currentColor;
      flex-shrink: 0;
      vertical-align: middle;
      opacity: 1;
      visibility: visible;
      /* When a parent uses font-size: 0 for layout, keep raster/mask math stable */
      font-size: 1rem;
    }
    ui-icon svg,
    ui-icon img {
      inline-size: 100%;
      block-size: 100%;
      color: inherit;
      fill: currentColor;
    }
    :is(button, .btn) > ui-icon {
      color: inherit;
    }
    .file-picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-block-size: 300px;
      padding: 2rem;
      text-align: center;
    }
    .file-picker .file-picker-header {
      margin-block-end: 2rem;
    }
    .file-picker .file-picker-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--color-on-surface);
      font-size: 1.5rem;
      font-weight: 600;
    }
    .file-picker .file-picker-header p {
      margin: 0;
      color: var(--color-on-surface-variant);
      font-size: 0.9rem;
    }
    .file-picker .file-picker-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-block-end: 2rem;
    }
    .file-picker .file-picker-actions .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .file-picker .file-picker-actions .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .file-picker .file-picker-actions .btn.btn-primary {
      background: var(--color-primary);
      color: var(--color-on-primary);
      border-color: var(--color-primary);
    }
    .file-picker .file-picker-actions .btn:not(.btn-primary) {
      background: var(--color-surface-container);
      color: var(--color-on-surface);
      border-color: var(--color-outline-variant);
    }
    .file-picker .file-picker-info {
      max-inline-size: 400px;
    }
    .file-picker .file-picker-info p {
      margin: 0.25rem 0;
      font-size: 0.85rem;
      color: var(--color-on-surface-variant);
    }
    .file-picker .file-picker-info p strong {
      color: var(--color-on-surface);
    }
  }
}
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 16.20.00_31.07.2026
 * Reason for changes: Box primary restored to familiar blue (#5a7fff/#7ca7ff); wallpaper may override.
 */
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
 * Global theme mixins — token NAMES stable; VALUES from --u2-color-mod.
 * Index scale: 0 white ← 550 seed → 1000 black (see function above).
 */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    color-scheme: light dark;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  @media (prefers-color-scheme: dark) {
    :root,
    :host,
    :scope {
      --color-primary: #7ca7ff;
      --base-color: var(--color-primary);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    }
  }
  [data-theme=light] {
    color-scheme: light;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
  }
  [data-theme=dark] {
    color-scheme: dark;
    --color-primary: #7ca7ff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
@position-try --just-block {
  inset-block-end: 0px;
}
@position-try --just-inline {
  inset-inline-end: 0px;
}
@keyframes percent-coef-x {
  from {
    sass("--percent-x"): 0;
  }
  to {
    sass("--percent-x"): 1;
  }
}
@keyframes percent-coef-y {
  from {
    sass("--percent-y"): 0;
  }
  to {
    sass("--percent-y"): 1;
  }
}
.c-underlying {
  position: absolute;
  pointer-events: none;
  overflow: visible;
  inset: 0;
  z-index: calc(var(--layer-main-z, 0) - 1);
}

.c-underlying__shaped {
  border-radius: var(--layer-shape-radius, inherit);
  clip-path: var(--layer-shape-clip, none);
  mask-image: var(--layer-shape-mask, none);
  -webkit-mask-image: var(--layer-shape-mask, none);
  inline-size: 100%;
  block-size: 100%;
}

.c-overlaying {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: calc(var(--layer-main-z, 0) + 1);
}

.c-overlaying [data-axis] {
  pointer-events: auto;
}`}));function Ze(e){if(typeof Uint8Array.fromBase64==`function`)return Uint8Array.fromBase64(e);let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}async function Qe(e,t=`gzip`){if(typeof CompressionStream>`u`)throw Error(`Compression Streams API is not supported in this browser`);let n=new DecompressionStream(t),r=n.writable.getWriter(),i=n.readable.getReader();r.write(e),r.close();let a=[],o=!1;for(;!o;){let{value:e,done:t}=await i.read();o=t,e&&a.push(e)}let s=a.reduce((e,t)=>e+t.length,0),c=new Uint8Array(s),l=0;for(let e of a)c.set(e,l),l+=e.length;return c}async function $e(e,t,n=`font/woff2`){if(X.has(t))return X.get(t);let r=new Blob([e],{type:n}),i=URL.createObjectURL(r);return X.set(t,i),i}async function et(e){let{base64:t,family:n,style:r=`normal`,weight:i=`normal`,compressed:a=!1}=e,o=`${n}-${r}-${i}`;if(Z.has(o))return Z.get(o);let s=Ze(t),c=await $e(a?await Qe(s):s,o,a?`application/octet-stream`:`font/woff2`),l=new FontFace(n,`url(${c}) format('woff2')`,{style:r,weight:typeof i==`string`?i:`${i}`,display:`swap`});return await l.load(),document.fonts.add(l),Z.set(o,l),l}async function tt(e){let t=e.map(e=>et(e));return Promise.all(t)}async function nt(){return it||(it=h(()=>import(`./font-registry-D4KJRdpC.js`),[],import.meta.url)?.catch?.(e=>{console.error(`Failed to load font registry:`,e)}),it)}async function rt(){let e=await nt();return tt(Object.values(e.fontRegistry))}var X,Z,it,at=e((()=>{m(),X=new Map,Z=new Map,it=null})),ot,st=e((()=>{ot=`@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer components {
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding-block: 0px;
    padding-inline: 0px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    background: var(--color-bg-alt);
    color: var(--color-fg);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  button:hover:not(:disabled) {
    background: var(--color-border);
  }
  button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
@layer layer.shell.faint.forms {
  input,
  select,
  textarea {
    background-repeat: no-repeat;
    min-block-size: 2.5rem;
    font-size: inherit;
    max-inline-size: stretch;
    max-inline-size: 100cqi;
    text-overflow: ellipsis;
    overflow: auto;
    scrollbar-width: none;
  }
  textarea[data-multiline=true] {
    min-block-size: 5rem;
    resize: vertical;
  }
}`})),ct,lt,ut=e((()=>{at(),l(),Xe(),st(),at(),ct=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`,lt=async e=>{await d(ct)?.catch(()=>void 0),await rt().catch(()=>void 0),await d(Ye)?.catch(()=>void 0),e?.includeGlobalNativeControls&&await d(ot)?.catch(()=>void 0)}})),dt,ft=e((()=>{dt=`@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 16.20.00_31.07.2026
 * Reason for changes: Box primary restored to familiar blue (#5a7fff/#7ca7ff); wallpaper may override.
 */
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
 * Global theme mixins — token NAMES stable; VALUES from --u2-color-mod.
 * Index scale: 0 white ← 550 seed → 1000 black (see function above).
 */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    color-scheme: light dark;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  @media (prefers-color-scheme: dark) {
    :root,
    :host,
    :scope {
      --color-primary: #7ca7ff;
      --base-color: var(--color-primary);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    }
  }
  [data-theme=light] {
    color-scheme: light;
    --color-primary: #5a7fff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
  }
  [data-theme=dark] {
    color-scheme: dark;
    --color-primary: #7ca7ff;
    --base-color: var(--color-primary);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
:host(ui-task), :host(ui-task) * {
  box-sizing: border-box;
  user-select: none;
  touch-action: manipulation;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: transparent;
  gap: 0px;
  margin: 0px;
  padding: 0px;
  border: 0px none transparent;
}
:host(ui-task) {
  /* WHY: Without host display, desktop taskbar buttons collapse to 0×0. */
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-inline-size: 2.25rem;
  min-block-size: 2.25rem;
  padding-inline: 0.45rem;
  padding-block: 0.25rem;
  border-radius: 0.5rem;
  user-select: none;
  pointer-events: auto;
  box-shadow: none;
  filter: none;
  cursor: pointer;
}
:host(ui-task) > * {
  pointer-events: none;
}
:host(ui-task) .task-icon {
  position: relative;
  display: inline-flex;
  place-content: center;
  place-items: center;
  line-height: 0;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  min-inline-size: 1.25rem;
  min-block-size: 1.25rem;
}
:host(ui-task) .task-letter {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  color: currentColor;
  opacity: 0.92;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}
:host(ui-task) .task-icon-glyph {
  position: relative;
  z-index: 1;
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 1rem;
  min-block-size: 1rem;
  /* WHY: blank/missing Phosphor masks leave the letter visible underneath. */
  color: currentColor;
}
:host(ui-task) {
  /* When a real icon name is set, keep the letter under the glyph (not on top). */
}
:host(ui-task) .task-icon:has(ui-icon[icon]:not([icon=""])) .task-letter {
  opacity: 0.35;
}
:host(ui-task) .task-icon:has(ui-icon[icon]:not([icon=""]):not([icon=app-window])) .task-letter {
  opacity: 0;
}
:host(ui-task) .task-title {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  max-inline-size: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

:host(ui-task:hover) {
  --background-tone-shift: 0.1;
  background-color: --c2-surface(var(--background-tone-shift, 0), var(--current));
}

:host(ui-task[data-focus]) {
  border-block-end-color: --c2-on-surface(0, var(--current)) !important;
}

:host(ui-task:not([data-active])) {
  opacity: 0.6;
}`})),pt,mt,ht,Q,gt=e((()=>{O(),l(),y(),ft(),T(),pt=u(dt),mt=e=>{let t=``;if(typeof e==`string`)t=e;else if(typeof e==`object`&&e&&`value`in e){let n=e.value;t=n==null?``:String(n)}else e!=null&&typeof e!=`object`&&(t=String(e));(!t||t===`undefined`||t===`null`||t===`[object Object]`)&&(t=``);let n=t.trim().charAt(0);return n?n.toUpperCase():`?`},ht=(e,t,n)=>{let r=e.getAttribute(t);return r!=null&&String(r).trim()?String(r).trim():n},Q=class extends D{title;icon;constructor(){super()}styles=()=>pt;render=function(){let e=ht(this,`title`,`Task`),t=ht(this,`icon`,`app-window`),n=mt(e);return o`
            <div part="icon" class="task-icon c2-contrast c2-transparent" data-letter=${n}>
                <span class="task-letter" part="letter" aria-hidden="true">${n}</span>
                <ui-icon class="c2-contrast c2-transparent task-icon-glyph" part="glyph" icon=${t} icon-style="duotone"></ui-icon>
            </div>
            <div part="title" class="task-title c2-contrast c2-transparent">${e}</div>
        `}},w([b({source:`attr`})],Q.prototype,`title`,void 0),w([b({source:`attr`})],Q.prototype,`icon`,void 0),Q=w([_(`ui-task`)],Q)})),_t,vt=e((()=>{_t=`ui-taskbar[data-type=desktop] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}

:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}`})),yt=e((()=>{l(),vt(),u(_t)})),bt,xt=e((()=>{bt=`ui-taskbar[data-type=mobile] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}

:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}`})),St=e((()=>{l(),xt(),u(bt)}));function Ct(){try{return globalThis.navigator?.windowControlsOverlay??null}catch{return null}}function wt(){if(typeof globalThis.matchMedia!=`function`)return`unknown`;try{if(globalThis.matchMedia(`(display-mode: window-controls-overlay)`).matches)return`window-controls-overlay`;if(globalThis.matchMedia(`(display-mode: fullscreen)`).matches)return`fullscreen`;if(globalThis.matchMedia(`(display-mode: standalone)`).matches)return`standalone`;if(globalThis.matchMedia(`(display-mode: minimal-ui)`).matches)return`minimal-ui`;if(globalThis.matchMedia(`(display-mode: browser)`).matches)return`browser`}catch{}return`unknown`}function Tt(e){if(!e?.visible||typeof e.getTitlebarAreaRect!=`function`)return null;try{let t=e.getTitlebarAreaRect();return t?{x:t.x,y:t.y,width:t.width,height:t.height}:null}catch{return null}}function Et(e){let t=Ct(),n=!!t?.visible,r=wt(),i=n||r===`standalone`||r===`fullscreen`||r===`window-controls-overlay`||r===`minimal-ui`,a=`off`;return e&&(a=n?`wco`:i?`standalone`:`fallback`),{requested:e,wcoVisible:n,displayMode:r,titlebarRect:Tt(t),isStandaloneLike:i,surface:a}}function Dt(e){let t=()=>{e.onChange(Et(e.getRequested()))},n=[];if(typeof globalThis.matchMedia==`function`)for(let e of[`(display-mode: window-controls-overlay)`,`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`])try{n.push(globalThis.matchMedia(e))}catch{}let r=()=>t();for(let e of n)try{e.addEventListener?.(`change`,r)}catch{try{e.addListener?.(r)}catch{}}let i=Ct(),a=()=>t();try{i?.addEventListener?.(`geometrychange`,a)}catch{}return queueMicrotask(t),()=>{for(let e of n)try{e.removeEventListener?.(`change`,r)}catch{try{e.removeListener?.(r)}catch{}}try{i?.removeEventListener?.(`geometrychange`,a)}catch{}}}var Ot=e((()=>{})),kt,At=e((()=>{kt=`/*
 * Filename: Windows2.scss
 * FullPath: modules/projects/fl.ui/src/ui/containers/window/Windows2.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: --ui-win-* palette via --u2-color-mod (token names kept).
 */
/* WHY: Inline adopted sheet for <ui-window>; function local so shadow sheet resolves mods. */
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
:host(ui-window) {
  /* Tokens — light defaults via light-dark(); dark flips with color-scheme / data-theme */
  --ui-win-radius: 0.75rem;
  --ui-win-titlebar-height: 2.5rem;
  --ui-win-footer-min: 2.25rem;
  --ui-win-control-size: 1.75rem;
  --ui-win-icon-size: 0.95rem;
  --ui-win-gap: 0.5rem;
  --ui-win-pad-inline: 0.75rem;
  --ui-win-pad-block: 0.65rem;
  /* Prefer host/document brand; fallback seed keeps window usable without veela. */
  --ui-win-seed: var(--base-color, var(--color-primary, #5a7fff));
  --ui-win-bg: light-dark(
      --u2-color-mod(var(--ui-win-seed), 70),
      --u2-color-mod(var(--ui-win-seed), 930)
  );
  --ui-win-fg: light-dark(
      --u2-color-mod(var(--ui-win-seed), 900),
      --u2-color-mod(var(--ui-win-seed), 100)
  );
  --ui-win-muted: light-dark(
      --u2-color-mod(var(--ui-win-seed), 700),
      --u2-color-mod(var(--ui-win-seed), 280)
  );
  --ui-win-border: color-mix(in oklab, var(--ui-win-fg) 12%, transparent);
  --ui-win-titlebar-bg: light-dark(
      --u2-color-mod(var(--ui-win-seed), 140),
      --u2-color-mod(var(--ui-win-seed), 860)
  );
  --ui-win-content-bg: light-dark(
      --u2-color-mod(var(--ui-win-seed), 40),
      --u2-color-mod(var(--ui-win-seed), 950)
  );
  --ui-win-footer-bg: light-dark(
      --u2-color-mod(var(--ui-win-seed), 120),
      --u2-color-mod(var(--ui-win-seed), 900)
  );
  --ui-win-shadow:
      light-dark(
          0 18px 40px -18px rgb(15 23 42 / 0.28),
          0 22px 48px -16px rgb(0 0 0 / 0.55)
      );
  /* WHY: transparent idle so controls share the solid titlebar fill (no “chip strip”). */
  --ui-win-control-bg: transparent;
  --ui-win-control-bg-hover: color-mix(in oklab, var(--ui-win-fg) 14%, transparent);
  --ui-win-control-fg: var(--ui-win-fg);
  --ui-win-close-bg: transparent;
  --ui-win-close-bg-hover: light-dark(
      --u2-color-mod(#ef4444, 550),
      --u2-color-mod(#ef4444, 480)
  );
  --ui-win-close-fg: var(--ui-win-fg);
  --ui-win-close-fg-hover: --u2-color-mod(var(--ui-win-seed), 40);
  --icon-color: var(--ui-win-fg);
  --icon-size: var(--ui-win-icon-size);
  color-scheme: light dark;
  box-sizing: border-box;
  /* WHY: Prefer :host display over setting style attr in CE lifecycle (createElement rules). */
  display: block;
  position: relative;
  inline-size: var(--ui-win-width, min(32rem, 92vw));
  block-size: var(--ui-win-height, min(22rem, 70vh));
  min-inline-size: 16rem;
  min-block-size: 10rem;
  color: var(--ui-win-fg);
  font-family: "InterVariable", "Inter", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1.35;
  border-radius: var(--ui-win-radius);
  overflow: hidden;
  box-shadow: var(--ui-win-shadow);
  isolation: isolate;
  contain: layout paint style;
}
:host(ui-window),
:host(ui-window) *,
:host(ui-window) *::before,
:host(ui-window) *::after {
  box-sizing: border-box;
}

/* Explicit theme overrides (playground / app shell) */
:host(ui-window[data-theme=light]),
:host(ui-window.theme-light) {
  color-scheme: light;
}

:host(ui-window[data-theme=dark]),
:host(ui-window.theme-dark) {
  color-scheme: dark;
}

:host(ui-window[managed]) {
  position: absolute;
  /* WHY: environment-shell owns geometry via inline left/top/width/height. */
  transform: none !important;
}

/* WHY: Focused window gets a slightly stronger edge so z-order changes are visible. */
:host(ui-window[managed][data-focused]) {
  box-shadow: var(--ui-win-shadow), 0 0 0 1px color-mix(in oklab, var(--ui-win-fg) 22%, transparent);
}

/*
 * WHY: CWSP views own their chrome padding; default ui-window pad crushed toolbars into overlaps.
 * INVARIANT: \`native-mode\` / \`data-native-active\` need the same flex fill as \`managed\`, otherwise
 * slotted Explorer (\`.view-explorer\` → \`ui-file-manager\`) collapses to toolbar-only height.
 */
:host(ui-window[managed]) .content-handler,
:host(ui-window[native-mode]) .content-handler,
:host(ui-window[data-native-active]) .content-handler {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:host(ui-window[managed]) .content-handler ::slotted(*),
:host(ui-window[native-mode]) .content-handler ::slotted(*),
:host(ui-window[data-native-active]) .content-handler ::slotted(*) {
  flex: 1 1 auto;
  min-block-size: 0;
  min-inline-size: 0;
  max-inline-size: none;
  inline-size: 100%;
  block-size: 100%;
}

:host(ui-window[maximized]) {
  --ui-win-radius: 0;
  inset: 0 !important;
  inline-size: 100% !important;
  block-size: 100% !important;
  border-radius: 0;
  transform: none !important;
}

/*
 * Mobile (env shell): full-bleed except bottom dock reserve; no min/max/close —
 * Home on the mobile taskbar replaces Close.
 * Titlebar becomes an empty spacer under the transparent overlay statusband
 * (\`--env-status-inset-top\`) unless standalone (\`data-no-titlebar\`).
 */
:host(ui-window[data-mobile-max]) {
  --ui-win-radius: 0;
  /* Spacer height matches overlay status / notch when status-gap is on. */
  --ui-win-titlebar-height: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
  /*inset: 0 0 var(--env-mobile-dock-reserve, 0rem) 0 !important;*/
  inset: 0px;
  inline-size: 100% !important;
  block-size: calc(100% - var(--env-mobile-dock-reserve)) !important;
  border-radius: 0;
  transform: none !important;
}
@media screen and (pointer: fine) and ((min-width: 480px) or (hover: hover)) {
  :host(ui-window[data-mobile-max]) {
    inset: 0 0 var(--env-mobile-dock-reserve, 0rem) 0 !important;
  }
}
@media screen and (pointer: coarse) and (hover: none) {
  :host(ui-window[data-mobile-max]) {
    block-size: stretch !important;
  }
}

:host(ui-window[data-mobile-max]) .title-minimize,
:host(ui-window[data-mobile-max]) .title-maximize,
:host(ui-window[data-mobile-max]) .title-close,
:host(ui-window[data-mobile-max]) .title-exit-native {
  display: none !important;
}

:host(ui-window[data-mobile-max]) .title-handler {
  cursor: default;
  /* Empty gap under overlay statusbar — wallpaper / window edge shows through. */
  background: transparent;
  border-block-end: 0;
  min-block-size: var(--ui-win-titlebar-height);
  padding-block: 0;
  pointer-events: none;
}

:host(ui-window[data-mobile-max]) .title-handler-main,
:host(ui-window[data-mobile-max]) .title-handler-actions,
:host(ui-window[data-mobile-max]) .title-handler-buttons {
  display: none !important;
}

/* Standalone PWA mobile: no titlebar — content is edge-to-edge (safe-area via views if needed). */
:host(ui-window[data-no-titlebar]) {
  --ui-win-titlebar-height: 0px;
}

:host(ui-window[data-no-titlebar]) .title-handler {
  display: none !important;
}

/* Desktop/fullscreen with status overlay: maximized windows also reserve the top band. */
:host(ui-window[data-status-gap]:not([data-no-titlebar])) {
  --ui-win-titlebar-height: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
}

:host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler {
  cursor: default;
  background: transparent;
  border-block-end: 0;
  min-block-size: var(--ui-win-titlebar-height);
  padding-block: 0;
  pointer-events: none;
}

:host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler-main,
:host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler-actions,
:host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler-buttons {
  display: none !important;
}

:host(ui-window[data-desk-max]) {
  --ui-win-radius: 0;
  inset: 0px !important;
  inline-size: auto !important;
  block-size: calc(100% - var(--ui-win-titlebar-height)) !important;
  border-radius: 0;
  transform: none !important;
}
@media screen and (pointer: coarse) and (hover: none) {
  :host(ui-window[data-desk-max]) {
    block-size: stretch !important;
  }
}

:host(ui-window[minimized]) {
  block-size: var(--ui-win-titlebar-height) !important;
  min-block-size: var(--ui-win-titlebar-height);
}

:host(ui-window[minimized]) .content-handler,
:host(ui-window[minimized]) .footer-handler,
:host(ui-window[minimized]) .window-resizer {
  display: none;
}

:host(ui-window[hidden-window]) {
  visibility: hidden !important;
  pointer-events: none !important;
}

:host(ui-window[maximized]) .window-resizer,
:host(ui-window[data-mobile-max]) .window-resizer,
:host(ui-window[data-desk-max]) .window-resizer,
:host(ui-window[data-native-active]) .window-resizer {
  display: none;
}

/* -------------------------------------------------------------------------- */
/* native-mode: full-bleed + WCO / standalone / in-tab fallback               */
/* -------------------------------------------------------------------------- */
:host(ui-window[native-mode]),
:host(ui-window[data-native-active]) {
  --ui-win-radius: 0;
  position: fixed !important;
  inset: 0 !important;
  inline-size: 100% !important;
  block-size: 100% !important;
  max-inline-size: none;
  max-block-size: none;
  border-radius: 0;
  transform: none !important;
  box-shadow: none;
  /* WHY: above env chrome (~2e9 in env vars can minify oddly); stay under system overlays. */
  z-index: 100000;
}

:host(ui-window[data-native-wco]) .title-handler,
:host(ui-window[data-native-standalone]) .title-handler {
  /* Prefer standardized window-drag; keep Chromium legacy aliases. */
  window-drag: move;
  app-region: drag;
  -webkit-app-region: drag;
  cursor: default;
  /* Titleband: cover WCO / safe-area strip */
  min-block-size: max(var(--ui-win-titlebar-height), env(titlebar-area-height, var(--ui-win-titlebar-area-height, 0px)), env(safe-area-inset-top, 0px) + 1.75rem);
  padding-block-start: max(env(safe-area-inset-top, 0px), env(titlebar-area-y, 0px));
  padding-inline-start: max(env(safe-area-inset-left, 0px), env(titlebar-area-x, var(--ui-win-titlebar-area-x, 0px)), var(--ui-win-pad-inline));
  padding-inline-end: max(env(safe-area-inset-right, 0px), max(0px, 100vi - env(titlebar-area-x, 0px) - env(titlebar-area-width, 100vi)), var(--ui-win-pad-inline));
}

:host(ui-window[data-native-wco]) .title-handler-buttons,
:host(ui-window[data-native-wco]) .title-handler-actions,
:host(ui-window[data-native-standalone]) .title-handler-buttons,
:host(ui-window[data-native-standalone]) .title-handler-actions,
:host(ui-window[data-native-wco]) .title-handler-buttons button,
:host(ui-window[data-native-standalone]) .title-handler-buttons button {
  window-drag: none;
  app-region: no-drag;
  -webkit-app-region: no-drag;
}

/* WCO: OS owns min/max/close — hide custom duplicates. */
:host(ui-window[data-native-wco]) .title-minimize,
:host(ui-window[data-native-wco]) .title-maximize,
:host(ui-window[data-native-wco]) .title-close,
:host(ui-window[data-native-wco]) .title-exit-native {
  display: none !important;
}

/* Mobile / installed standalone: hide resize-like chrome; keep exit-native for env restore. */
:host(ui-window[data-native-standalone]) .title-minimize,
:host(ui-window[data-native-standalone]) .title-maximize,
:host(ui-window[data-native-standalone]) .title-close {
  display: none !important;
}

:host(ui-window[data-native-active]) .footer-handler:empty {
  display: none;
}

/*
 * WHY: \`.title-handler-buttons button { display: inline-flex }\` beats bare \`[hidden]\` /
 * \`.title-exit-native { display: none }\` — without !important the 4th control always leaks.
 * INVARIANT: exit-native only for installed standalone; fallback uses maximize as exit.
 */
.title-exit-native,
.title-exit-native[hidden] {
  display: none !important;
}

:host(ui-window[data-native-standalone]) .title-exit-native:not([hidden]) {
  display: inline-flex !important;
}

.window-container {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas: "title" "content" "footer";
  inline-size: 100%;
  block-size: 100%;
  background: var(--ui-win-bg);
  color: var(--ui-win-fg);
  border: 1px solid var(--ui-win-border);
  border-radius: inherit;
  overflow: hidden;
  /* WHY: isolate title vs content stacking so slotted paint cannot cover chrome. */
  isolation: isolate;
}

.title-handler {
  grid-area: title;
  /*
   * WHY: Slotted view roots (e.g. settings) can create stacking contexts that paint over
   * the title grid row and swallow drag + min/max/close. Keep chrome above content.
   * INVARIANT: title z > content z (same pattern as env \`.wf-frame\` titlebar).
   */
  position: relative;
  z-index: 50;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--ui-win-gap);
  min-block-size: var(--ui-win-titlebar-height);
  padding-inline: var(--ui-win-pad-inline);
  padding-block: 0.35rem;
  background: var(--ui-win-titlebar-bg);
  border-block-end: 1px solid var(--ui-win-border);
  cursor: grab;
  user-select: none;
  touch-action: none;
  pointer-events: auto;
}
.title-handler:active {
  cursor: grabbing;
}

.title-handler-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-inline-size: 0;
  overflow: hidden;
  pointer-events: none;
}
.title-handler-main ::slotted(*),
.title-handler-main .title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.title-handler-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-inline-size: 0;
}

.title-handler-buttons {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  position: relative;
  z-index: 51;
  pointer-events: auto;
  background: transparent;
  /* WHY: parent titlebar uses touch-action:none for drag; controls need click synthesis. */
  touch-action: manipulation;
}

.title-handler-buttons button,
.title-handler-actions button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--ui-win-control-size);
  block-size: var(--ui-win-control-size);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--ui-win-control-bg);
  color: var(--ui-win-control-fg);
  --icon-color: currentColor;
  cursor: pointer;
  pointer-events: auto;
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.12s ease;
}
.title-handler-buttons button:hover,
.title-handler-actions button:hover {
  background: var(--ui-win-control-bg-hover);
}
.title-handler-buttons button:active,
.title-handler-actions button:active {
  transform: scale(0.94);
}
.title-handler-buttons button:focus-visible,
.title-handler-actions button:focus-visible {
  outline: 2px solid light-dark(#3794ff, #6ee7b7);
  outline-offset: 2px;
}
.title-handler-buttons button ui-icon,
.title-handler-actions button ui-icon {
  inline-size: var(--ui-win-icon-size);
  block-size: var(--ui-win-icon-size);
  pointer-events: none;
}

.title-handler-buttons .title-close {
  background: var(--ui-win-close-bg);
  color: var(--ui-win-close-fg);
  --icon-color: currentColor;
}
.title-handler-buttons .title-close:hover {
  background: var(--ui-win-close-bg-hover);
  color: var(--ui-win-close-fg-hover);
}

/* Maximize glyph swaps via JS (\`#syncMaximizeIcon\`) — one ui-icon, never dual corners. */
.content-handler {
  grid-area: content;
  /*
   * WHY (radical): views with \`position: fixed; inset: 0\` (settings/markdown) escape the
   * content grid and swallow titlebar hits. \`transform\` makes this the fixed containing
   * block; \`contain: paint\` keeps compositing under the chrome row.
   */
  position: relative;
  z-index: 0;
  isolation: isolate;
  transform: translateZ(0);
  contain: paint;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: auto;
  padding: 0px; /*var(--ui-win-pad-block) var(--ui-win-pad-inline);*/
  background: var(--ui-win-content-bg);
  color: var(--ui-win-fg);
  /*
   * WHY: \`:host(ui-window[hidden-window])\` sets \`pointer-events: none !important\` on the host;
   * without an explicit \`auto\` here the slotted view inherits \`none\` and the entire body
   * (settings tabs, explorer, etc.) becomes unclickable even while visible.
   */
  pointer-events: auto;
}
.content-handler ::slotted(*) {
  max-inline-size: 100%;
  /* WHY: keep view roots inside the content box; do not cover chrome. */
  max-block-size: 100%;
  min-block-size: 0;
  pointer-events: auto;
}

.footer-handler {
  grid-area: footer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  min-block-size: var(--ui-win-footer-min);
  padding: 0.45rem var(--ui-win-pad-inline);
  background: var(--ui-win-footer-bg);
  border-block-start: 1px solid var(--ui-win-border);
  color: var(--ui-win-muted);
}
.footer-handler:empty, .footer-handler:not(:has(*)):not(:has(::slotted(*))) {
  display: none;
}

/* SE resize affordance (optional slot / child) */
.window-resizer {
  position: absolute;
  z-index: 4;
  inset-inline-end: 4px;
  inset-block-end: 4px;
  inline-size: 12px;
  block-size: 12px;
  cursor: nwse-resize;
  border-radius: 2px;
  background: linear-gradient(135deg, transparent 48%, color-mix(in oklab, var(--ui-win-muted) 55%, transparent) 50%);
  opacity: 0.55;
  pointer-events: auto;
}
.window-resizer:hover {
  opacity: 0.9;
}`})),jt,Mt,Nt,Pt,Ft,It,$,Lt=e((()=>{y(),l(),O(),x(),Ot(),At(),T(),jt=u(kt),Mt=`minus`,Nt=`corners-out`,Pt=`corners-in`,Ft=`x`,It=Object.freeze({w:240,h:160}),$=class extends E{titleHandler;contentHandler;footerHandler;resizer;#e=c(0);#t=c(0);#n=null;#r=null;#i=null;#a=null;#o=null;#s=null;#c=null;#l=!1;#u=0;#d=0;#f=null;styles=function(){return jt};render=function(){return o`<div class="window-container" part="window-container">
            <header class="title-handler" part="title-handler">
                <div class="title-handler-main" part="title">
                    <slot name="title"></slot>
                </div>
                <div class="title-handler-actions" part="actions">
                    <slot name="actions"></slot>
                </div>
                <div class="title-handler-buttons" part="controls" data-no-drag>
                    <button class="title-minimize" type="button" aria-label="Minimize" title="Minimize" data-no-drag data-ui-win-action="minimize">
                        <ui-icon icon=${Mt}></ui-icon>
                    </button>
                    <button class="title-maximize" type="button" aria-label="Maximize" title="Maximize" data-no-drag data-ui-win-action="maximize">
                        <ui-icon icon=${Nt}></ui-icon>
                    </button>
                    <button
                        class="title-exit-native"
                        type="button"
                        aria-label="Exit native"
                        title="Exit native"
                        data-no-drag
                        data-ui-win-action="exit-native"
                        hidden
                    >
                        <ui-icon icon=${Pt}></ui-icon>
                    </button>
                    <button class="title-close" type="button" aria-label="Close" title="Close" data-no-drag data-ui-win-action="close">
                        <ui-icon icon=${Ft}></ui-icon>
                    </button>
                </div>
            </header>
            <div class="content-handler" part="content-handler" style="container-type: size;">
                <slot name="content"></slot>
                <slot></slot>
            </div>
            <footer class="footer-handler" part="footer-handler">
                <slot name="footer"></slot>
            </footer>
            <div class="window-resizer" part="resizer" aria-hidden="true" data-no-drag></div>
        </div>`};constructor(){super()}get managed(){return this.hasAttribute(`managed`)}get nativeMode(){return this.hasAttribute(`native-mode`)}set nativeMode(e){this.toggleAttribute(`native-mode`,!!e),this.#h()}get nativeSurface(){return this.#f?.surface??(this.nativeMode?`fallback`:`off`)}onInitialize(){super.onInitialize()}onRender(){super.onRender(),this.#p()}connectedCallback(){super.connectedCallback?.(),this.#p(),this.#m()}disconnectedCallback(){this.#s?.(),this.#s=null,this.#c?.disconnect(),this.#c=null,this.#o?.disconnect(),this.#o=null,this.#a?.(),this.#a=null,this.#l=!1,this.#u=0,this.#i?.(),this.#i=null,this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,super.disconnectedCallback?.()}#p(){let e=()=>{this.#E(),this.#b(),this.#D(),this.#O(),this.#h(),this.#u<20&&(this.#u+=1,(!this.#l||this.#u<8)&&requestAnimationFrame(e))};queueMicrotask(e)}#m(){this.#s||(this.#s=Dt({getRequested:()=>this.nativeMode,onChange:e=>this.#g(e)}),typeof MutationObserver<`u`&&!this.#c&&(this.#c=new MutationObserver(e=>{let t=!1,n=!1;for(let r of e)r.attributeName===`native-mode`&&(t=!0),(r.attributeName===`maximized`||r.attributeName===`data-desk-max`||r.attributeName===`data-mobile-max`)&&(n=!0);t&&this.#h(),n&&this.#v()}),this.#c.observe(this,{attributes:!0,attributeFilter:[`native-mode`,`maximized`,`data-desk-max`,`data-mobile-max`]})))}#h(){this.#g(Et(this.nativeMode))}#g(e){this.#f=e;let t=this;t.toggleAttribute(`data-native-wco`,e.surface===`wco`),t.toggleAttribute(`data-native-standalone`,e.surface===`standalone`),t.toggleAttribute(`data-native-fallback`,e.surface===`fallback`),t.toggleAttribute(`data-native-active`,e.surface!==`off`),this.#_(e.surface),e.titlebarRect?(t.style.setProperty(`--ui-win-titlebar-area-x`,`${e.titlebarRect.x}px`),t.style.setProperty(`--ui-win-titlebar-area-y`,`${e.titlebarRect.y}px`),t.style.setProperty(`--ui-win-titlebar-area-width`,`${e.titlebarRect.width}px`),t.style.setProperty(`--ui-win-titlebar-area-height`,`${e.titlebarRect.height}px`)):(t.style.removeProperty(`--ui-win-titlebar-area-x`),t.style.removeProperty(`--ui-win-titlebar-area-y`),t.style.removeProperty(`--ui-win-titlebar-area-width`),t.style.removeProperty(`--ui-win-titlebar-area-height`)),this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,this.#D(),this.#O(),this.#v(),this.dispatchEvent(new CustomEvent(`window-native-change`,{bubbles:!0,composed:!0,detail:e}))}#_(e=this.nativeSurface){let t=this.shadowRoot?.querySelector(`.title-exit-native`);t&&(t.hidden=e!==`standalone`)}#v(){let e=this.shadowRoot?.querySelector(`.title-maximize`),t=e?.querySelector(`ui-icon`);if(!e||!t)return;let n=!(this.nativeMode&&this.nativeSurface===`fallback`)&&(this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)),r=n?Pt:Nt,i=n?`Restore`:`Maximize`;t.getAttribute(`icon`)!==r&&t.setAttribute(`icon`,r),e.setAttribute(`aria-label`,i),e.setAttribute(`title`,i)}applyBounds(e){let t=this;t.style.position=`absolute`,typeof e.x==`number`&&(t.style.left=`${e.x}px`),typeof e.y==`number`&&(t.style.top=`${e.y}px`),typeof e.w==`number`&&(t.style.width=`${e.w}px`,t.style.setProperty(`--ui-win-width`,`${e.w}px`)),typeof e.h==`number`&&(t.style.height=`${e.h}px`,t.style.setProperty(`--ui-win-height`,`${e.h}px`)),typeof e.z==`number`&&(t.style.zIndex=String(e.z)),t.style.right=``,t.style.bottom=``,this.managed&&(this.#e.value=0,this.#t.value=0,t.style.transform=``)}setVisible(e){this.toggleAttribute(`hidden-window`,!e),this.style.visibility=e?``:`hidden`,this.style.pointerEvents=e?``:`none`}get isMaximized(){return this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)}get isMinimized(){return this.hasAttribute(`minimized`)}get usesNativeWindowDrag(){let e=this.nativeSurface;return e===`wco`||e===`standalone`}enterNativeMode(){if(this.managed){this.#y(`window-native`);return}this.nativeMode=!0,this.#y(`window-native`)}exitNativeMode(){if(this.managed){this.#y(`window-exit-native`);return}this.nativeMode=!1,this.#y(`window-exit-native`)}#y(e,t=!1){return this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,cancelable:t}))}toggleMaximize(){let e=this.isMaximized;if(this.managed){this.#y(e?`window-restore`:`window-maximize`);return}let t=!e;this.toggleAttribute(`maximized`,t),t&&this.removeAttribute(`minimized`),this.#v(),this.#y(t?`window-maximize`:`window-restore`)}toggleMinimize(){if(this.managed){this.#y(this.isMinimized?`window-restore`:`window-minimize`);return}let e=!this.isMinimized;this.toggleAttribute(`minimized`,e),e&&this.removeAttribute(`maximized`),this.#y(e?`window-minimize`:`window-restore`)}restoreWindow(){if(this.managed){this.#y(`window-restore`);return}let e=this.isMinimized,t=this.isMaximized;this.removeAttribute(`minimized`),this.removeAttribute(`maximized`),(e||t)&&this.#y(`window-restore`)}closeWindow(){this.#y(`window-close`,!0),this.isConnected&&this.remove()}#b(){this.#i||=n(this,`pointerdown`,()=>{this.requestFocus()},{capture:!0,passive:!0})}requestFocus(){this.dispatchEvent(new CustomEvent(`window-focus`,{bubbles:!0,composed:!0}))}bringToFront(e){let t=this;Number.isFinite(e)&&(t.style.zIndex=String(e)),t.toggleAttribute(`data-focused`,!0)}clearFocused(){this.toggleAttribute(`data-focused`,!1)}#x(e){let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}let n=e.target;if(n instanceof Element){let e=n.closest?.(`[data-ui-win-action], .title-close, .title-exit-native, .title-maximize, .title-minimize`)??null;if(!e)return null;let t=e.getAttribute(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.classList.contains(`title-close`))return`close`;if(e.classList.contains(`title-exit-native`))return`exit-native`;if(e.classList.contains(`title-maximize`))return`maximize`;if(e.classList.contains(`title-minimize`))return`minimize`}return null}#S(){let e=typeof performance<`u`?performance.now():Date.now();return e-this.#d<280?!1:(this.#d=e,!0)}#C(e){e===`close`?this.closeWindow():e===`exit-native`?this.exitNativeMode():e===`maximize`?this.nativeMode&&this.nativeSurface===`fallback`?this.exitNativeMode():this.toggleMaximize():this.toggleMinimize()}#w(e){let t=this.#x(e);return t?(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#S()&&this.#C(t),!0):!1}#T(){let e=this.shadowRoot;if(e)for(let[t,n]of[[`minimize`,`.title-minimize`],[`maximize`,`.title-maximize`],[`close`,`.title-close`],[`exit-native`,`.title-exit-native`]]){let r=e.querySelector(n);if(!r)continue;r.setAttribute(`data-ui-win-action`,t);let i=e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#S()&&this.#C(t)};r.onclick=i,r.onpointerup=e=>{e.button===0&&i(e)}}}#E(){let e=this.shadowRoot;if(!e)return;let t=this.titleHandler??e.querySelector(`.title-handler`),r=e.querySelector(`.title-handler-buttons`);if(!t||!r)return;if(this.#T(),this.#l){this.#_(),this.#v();return}let i=e=>{this.#w(e)},a=e=>{this.#x(e)||(typeof e.composedPath==`function`?e.composedPath():[]).some(e=>e instanceof Element&&e.classList?.contains(`title-handler`))&&(e.target?.closest?.(`button, a, input, textarea, select, [data-no-drag]`)||(e.preventDefault(),this.#S()&&this.toggleMaximize()))},o=n(e,`click`,i,{capture:!0}),s=n(e,`pointerup`,i,{capture:!0}),c=n(this,`click`,i,{capture:!0}),l=n(this,`pointerup`,i,{capture:!0}),u=n(this,`dblclick`,a,{capture:!0});typeof MutationObserver<`u`&&!this.#o&&(this.#o=new MutationObserver(()=>{this.#T(),this.#_(),this.#v()}),this.#o.observe(e,{childList:!0,subtree:!0})),this.#a=()=>{o?.(),s?.(),c?.(),l?.(),u?.(),this.#o?.disconnect(),this.#o=null,this.#a=null,this.#l=!1},this.#l=!0,this.#u=0,this.#_(),this.#v()}#D(){let e=this.shadowRoot??this,t=this.titleHandler??e.querySelector?.(`.title-handler`);if(!t||this.#n)return;if(this.usesNativeWindowDrag){this.#n=()=>{this.#n=null};return}this.managed||i(this,s`transform: translate(${this.#e}px, ${this.#t}px)`);let r=new Map,a=n(t,`pointerdown`,e=>{if(e.button!==0||this.#x(e)||e.target?.closest(`button, a, input, textarea, select, [data-no-drag]`)||this.isMaximized||this.isMinimized||this.nativeMode)return;this.requestFocus();let t=this;r.set(e.pointerId,{sx:e.clientX,sy:e.clientY,ox:this.#e.value,oy:this.#t.value,bx:Number.parseFloat(t.style.left||`0`)||0,by:Number.parseFloat(t.style.top||`0`)||0,dragging:!1});let i=n(document.body,`pointermove`,e=>{let t=r.get(e.pointerId);if(!t)return;let n=e.clientX-t.sx,i=e.clientY-t.sy;if(!t.dragging){if(Math.hypot(n,i)<4)return;t.dragging=!0;try{e.preventDefault()}catch{}this.setPointerCapture?.(e.pointerId)}if(this.managed){this.dispatchEvent(new CustomEvent(`window-move`,{bubbles:!0,composed:!0,detail:{x:t.bx+n,y:t.by+i,dx:n,dy:i}}));return}this.#e.value=t.ox+n,this.#t.value=t.oy+i}),a=e=>{if(!r.has(e.pointerId))return;let t=r.get(e.pointerId);if(r.delete(e.pointerId),t?.dragging)try{this.releasePointerCapture?.(e.pointerId)}catch{}i?.(),o?.(),s?.()},o=n(document.body,`pointerup`,a),s=n(document.body,`pointercancel`,a)});this.#n=()=>{a?.()}}#O(){let e=this.shadowRoot??this,t=this.resizer??e.querySelector?.(`.window-resizer`);if(!t||this.#r)return;let r=new Map,i=n(t,`pointerdown`,e=>{if(e.button!==0||this.isMaximized||this.isMinimized||this.nativeMode)return;e.preventDefault(),e.stopPropagation(),this.requestFocus(),this.setPointerCapture?.(e.pointerId);let t=this.getBoundingClientRect();r.set(e.pointerId,{sx:e.clientX,sy:e.clientY,w:t.width,h:t.height});let i=n(document.body,`pointermove`,e=>{let t=r.get(e.pointerId);if(!t)return;let n=Math.max(It.w,t.w+(e.clientX-t.sx)),i=Math.max(It.h,t.h+(e.clientY-t.sy));if(this.managed){this.dispatchEvent(new CustomEvent(`window-resize`,{bubbles:!0,composed:!0,detail:{w:n,h:i}}));return}this.style.width=`${n}px`,this.style.height=`${i}px`,this.style.setProperty(`--ui-win-width`,`${n}px`),this.style.setProperty(`--ui-win-height`,`${i}px`)}),a=e=>{if(r.has(e.pointerId)){r.delete(e.pointerId);try{this.releasePointerCapture?.(e.pointerId)}catch{}i?.(),o?.(),s?.()}},o=n(document.body,`pointerup`,a),s=n(document.body,`pointercancel`,a)});this.#r=()=>{i?.()}}},w([b({source:`query`,name:`.title-handler`})],$.prototype,`titleHandler`,void 0),w([b({source:`query`,name:`.content-handler`})],$.prototype,`contentHandler`,void 0),w([b({source:`query`,name:`.footer-handler`})],$.prototype,`footerHandler`,void 0),w([b({source:`query`,name:`.window-resizer`})],$.prototype,`resizer`,void 0),$=w([_(`ui-window`)],$)})),Rt=e((()=>{y()})),zt=e((()=>{})),Bt=e((()=>{r(),y()})),Vt=e((()=>{O(),_e(),Je(),gt(),yt(),St(),Lt(),Rt(),zt(),Bt()}));function Ht(){return{...Ut}}var Ut,Wt=e((()=>{l(),Xe(),ut(),Vt(),Ut={loadStyles:!0,includeGlobalNativeControlStyles:!1,styleVariant:`veela-basic`},(async()=>{let e=Ht();e.loadStyles!==!1&&(await lt({includeGlobalNativeControls:e.includeGlobalNativeControlStyles===!0}),await t(Ye))})()?.catch?.(()=>void 0)}));export{ue as a,A as c,E as d,O as f,fe as i,me as l,T as m,Je as n,_e as o,w as p,He as r,se as s,Wt as t,ce as u};