import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{J as n,Y as r,a as i}from"./HistoryManager-5Sa1FlA6.js";import{d as a,u as o}from"./registry-DN3n_MA9.js";import{n as s,t as c}from"./preload-helper-NDuSAHbO.js";import{t as l}from"./src-mG6hxM_E.js";import{t as u}from"./src-BDKAvpBs.js";import{n as d,t as f}from"./shells-CCzQdMLd.js";import{n as p,t as m}from"./shell-slots-CDiat5LT.js";var h,g=e((()=>{h=`/* Minimal shell: layered tokens + nav/content grid, WCO-safe, shadow slot views. */
/*
 * Filename: _viewer-shell-host-theme.scss
 * FullPath: modules/views/markdown-view/src/scss/_viewer-shell-host-theme.scss
 * Change date and time: 16.30.00_31.07.2026
 * Reason for changes: Inherit wallpaper primary for viewer icons (no blue/purple pin).
 */
/*
 * Markdown viewer theme bridge for shells that render views inside an open shadow root (cw-shell-minimal, cw-shell-immersive).
 *
 * WHY: Document-level rules such as \`html[data-theme="light"] .cw-view-viewer-shell\` and \`:root:has([data-view="viewer"])\`
 * never match nodes inside shadow trees — selectors cannot descend from \`html\` through the shadow boundary.
 *
 * IMPORTANT: View hosts (\`cw-view-*\`) are assigned to \`<slot name="view">\`. They are **not** descendants of \`.app-shell\`
 * in the shadow tree's selector model — plain \`:host ... [data-view="viewer"]\` from the shell sheet **does not match**
 * slotted nodes. Use \`::slotted(...)\` so tokens are applied to the real host element; custom properties then **inherit**
 * into each view's shadow root (toolbar, prose) without piercingShadow manually.
 */
@layer shell.tokens, shell.base, shell.components, shell.utilities, shell.markdown-host-theme, shell.overrides;
@layer shell.tokens {
  :where(:root, .app-shell, .app-shell[data-style=minimal]):has(.app-shell, .app-shell[data-style=minimal]) {
    color-scheme: light dark;
    /* colors */
    --shell-bg: light-dark(var(--color-surface), var(--color-surface));
    --shell-fg: light-dark(var(--color-on-surface), var(--color-on-surface));
    --shell-nav-bg: light-dark(var(--color-surface-container-high), var(--color-surface-container-high));
    --shell-nav-fg: light-dark(var(--color-on-surface), var(--color-on-surface));
    --shell-nav-border: light-dark(var(--color-outline-variant), var(--color-outline-variant));
    --shell-btn-hover: light-dark(var(--color-surface-container, var(--color-surface-container)), var(--color-surface-container, var(--color-surface-container)));
    --shell-btn-active-bg: light-dark(var(--color-surface-container-low, var(--color-surface-container-low)), var(--color-surface-container-low, var(--color-surface-container-low)));
    --shell-btn-active-fg: light-dark(var(--color-on-surface), var(--color-on-surface));
    --shell-status-bg: light-dark(var(--color-surface-container-low, var(--color-surface-container-low)), var(--color-surface-container-low, var(--color-surface-container-low)));
    --shell-status-fg: light-dark(var(--color-on-surface), var(--color-on-surface));
    /* layout */
    --shell-nav-height: var(--shell-nav-height-base, 48px);
    --shell-sidebar-width: 0;
    --shell-status-height: 24px;
    --shell-padding: 0;
  }
  /*
   * WHY: \`data-theme\` lives on \`html\`; \`data-shell\` lives on \`.app-shell\` — never the same node.
   * Old \`:has([data-shell][data-theme])\` never matched → active pill stayed near-white while OS-dark
   * \`light-dark()\` could still resolve fg to a light color (Markdown label vanished).
   */
  html[data-theme=light]:has([data-shell=minimal]),
  html[data-theme=light] .app-shell[data-shell=minimal] {
    color-scheme: light;
    --shell-bg: #fafbfc;
    --shell-fg: #1e293b;
    --shell-nav-bg: #e8ecf4;
    --shell-nav-fg: #1e293b;
    --shell-nav-border: #94a3b8;
    --shell-btn-hover: #eef1f8;
    --shell-btn-active-bg: color-mix(in oklab, #5a7fff 18%, #fafbfc);
    --shell-btn-active-fg: #1e293b;
    --shell-status-bg: #f4f6fa;
    --shell-status-fg: #1e293b;
  }
  html[data-theme=dark]:has([data-shell=minimal]),
  html[data-theme=dark] .app-shell[data-shell=minimal] {
    color-scheme: dark;
    --shell-bg: #0f172a;
    --shell-fg: #f1f5f9;
    --shell-nav-bg: #1e293b;
    --shell-nav-fg: #f1f5f9;
    --shell-nav-border: #475569;
    --shell-btn-hover: #1e293b;
    --shell-btn-active-bg: color-mix(in oklab, #7ca7ff 22%, #0f172a);
    --shell-btn-active-fg: #f1f5f9;
    --shell-status-bg: #0f172a;
    --shell-status-fg: #f1f5f9;
  }
  /* cw-shell-minimal :host — \`.app-shell\` is in shadow; use \`:host\` only. */
  :host {
    --shell-bg: light-dark(var(--color-surface), var(--color-surface));
    --shell-nav-bg: light-dark(var(--color-surface-container-high), var(--color-surface-container-high));
  }
  /*
   * WHY: Literal fg/bg — do NOT chain through \`--color-on-surface\`.
   * That token can still be a light \`light-dark()\` result (OS dark + app light),
   * so \`var(--color-on-surface, #1e293b)\` never reaches the fallback and the
   * active pill label vanishes (white-on-lavender).
   */
  :host([data-theme=light]),
  :host-context(html[data-theme=light]) {
    color-scheme: light;
    --shell-bg: #fafbfc;
    --shell-fg: #1e293b;
    --shell-nav-bg: #e8ecf4;
    --shell-nav-fg: #1e293b;
    --shell-btn-hover: #eef1f8;
    --shell-btn-active-bg: color-mix(in oklab, #5a7fff 18%, #fafbfc);
    --shell-btn-active-fg: #1e293b;
    --shell-status-fg: #1e293b;
  }
  :host([data-theme=dark]),
  :host-context(html[data-theme=dark]) {
    color-scheme: dark;
    --shell-bg: #0f172a;
    --shell-fg: #f1f5f9;
    --shell-nav-bg: #1e293b;
    --shell-nav-fg: #f1f5f9;
    --shell-btn-hover: #1e293b;
    --shell-btn-active-bg: color-mix(in oklab, #7ca7ff 22%, #0f172a);
    --shell-btn-active-fg: #f1f5f9;
    --shell-status-fg: #f1f5f9;
  }
}
@layer shell.base {
  /* Match toolbar chrome; avoids host vs .app-shell__nav mismatch when meta/theme updates */
  :host {
    background-color: var(--shell-nav-bg);
  }
  :where(.app-shell, .app-shell[data-style=minimal]) {
    position: absolute;
    inset: 0;
    display: grid;
    /* Single chrome column: nav + main live inside \`.app-shell__viewport\` (shared layer stack with underlying/overlays). */
    grid-template-rows: [viewport-row] minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    /* stretch: center shrink-wraps grid items (viewer chrome looked like a small floating island in CRX). */
    align-items: stretch;
    justify-items: stretch;
    justify-content: start;
    gap: 0;
    padding: 0;
    margin: 0;
    inline-size: stretch;
    block-size: stretch;
    max-inline-size: stretch;
    max-block-size: stretch;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
    background: var(--color-background);
    background-color: var(--shell-bg);
    color: var(--shell-fg);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color-scheme: light dark;
    contain: strict;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.2s ease, color 0.2s ease;
    border-radius: 0px;
    /*
     * INVARIANT: theme is applied on \`.app-shell\` (MinimalShell.applyTheme).
     * Pin readable chrome here — most reliable path inside the shadow tree.
     */
  }
  :where(.app-shell, .app-shell[data-style=minimal])[data-theme=light] {
    color-scheme: light;
    --shell-bg: #fafbfc;
    --shell-fg: #1e293b;
    --shell-nav-bg: #e8ecf4;
    --shell-nav-fg: #1e293b;
    --shell-btn-hover: #eef1f8;
    --shell-btn-active-bg: color-mix(in oklab, #5a7fff 18%, #fafbfc);
    --shell-btn-active-fg: #1e293b;
    --shell-status-fg: #1e293b;
  }
  :where(.app-shell, .app-shell[data-style=minimal])[data-theme=dark] {
    color-scheme: dark;
    --shell-bg: #0f172a;
    --shell-fg: #f1f5f9;
    --shell-nav-bg: #1e293b;
    --shell-nav-fg: #f1f5f9;
    --shell-btn-hover: #1e293b;
    --shell-btn-active-bg: color-mix(in oklab, #7ca7ff 22%, #0f172a);
    --shell-btn-active-fg: #f1f5f9;
    --shell-status-fg: #f1f5f9;
  }
  @media print {
    :where(.app-shell, .app-shell[data-style=minimal]) {
      display: contents !important;
    }
  }
}
@layer shell.components {
  :where(.app-shell, .app-shell[data-style=minimal]) {
    border-radius: 0px;
  }
  :where(.app-shell, .app-shell[data-style=minimal]) .loading-spinner {
    inline-size: 32px;
    block-size: 32px;
    border: 3px solid rgba(128, 128, 128, 0.2);
    border-block-start-color: var(--shell-btn-active-fg);
    border-radius: 50%;
    animation: app-shell-spin 0.8s linear infinite;
  }
  :where(.app-shell, .app-shell[data-style=minimal]) slot {
    display: contents !important;
  }
  .app-shell__nav {
    grid-row: shell-nav-row;
    grid-column: 1;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: var(--gap-sm, 0.5rem);
    box-sizing: border-box;
    /* At least one row of toolbar; grow to cover WCO title-bar band when taller */
    min-block-size: max(var(--shell-nav-height) + max(env(safe-area-inset-top, 0px), env(titlebar-area-y, 0px)), env(titlebar-area-y, 0px) + env(titlebar-area-height, 0px));
    block-size: auto;
    padding-block-start: max(env(safe-area-inset-top, 0px), env(titlebar-area-y, 0px));
    padding-block-end: 0;
    padding-inline-start: max(env(safe-area-inset-left, 0px), env(titlebar-area-x, 0px), var(--space-md, 0.75rem));
    padding-inline-end: max(env(safe-area-inset-right, 0px), max(0px, 100vi - env(titlebar-area-x, 0px) - env(titlebar-area-width, 100vi)), var(--space-md, 0.75rem));
    margin: 0;
    background: var(--shell-nav-bg);
    background-color: var(--shell-nav-bg);
    border-block-end: 1px solid var(--shell-nav-border);
    transition: background-color var(--motion-normal, 0.2s ease), border-color var(--motion-normal, 0.2s ease);
    border-radius: 0px;
  }
  .app-shell__nav select {
    min-block-size: 0px !important;
    block-size: fit-content !important;
    max-block-size: min(2rem, 100%) !important;
    box-sizing: border-box !important;
    padding-block: 0.125rem !important;
  }
  .app-shell__nav-left,
  .app-shell__nav-right {
    display: flex;
    align-items: center;
  }
  .app-shell__nav-left select,
  .app-shell__nav-right select {
    min-block-size: 0px !important;
    block-size: fit-content !important;
    max-block-size: min(2rem, 100%) !important;
    box-sizing: border-box !important;
    padding-block: 0.125rem !important;
  }
  .app-shell__nav-left {
    gap: var(--gap-xs, 0.25rem);
  }
  .app-shell__nav-right {
    gap: var(--gap-sm, 0.5rem);
  }
  .app-shell__nav-right > * {
    display: flex;
    align-items: center;
    gap: var(--gap-xs, 0.25rem);
  }
  /* Public /cwsp hub: Neutralino bridge status + connection dialog. */
  .app-shell__connection-source {
    flex-shrink: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.3rem 0.5rem;
    border-radius: var(--radius-sm, 6px);
    border: 1px solid color-mix(in srgb, var(--color-primary, #3975ca) 45%, var(--shell-nav-border));
    background: color-mix(in srgb, var(--color-primary, #3975ca) 18%, var(--shell-nav-bg));
    color: color-mix(in srgb, var(--color-primary, #1565c0) 70%, var(--shell-nav-fg));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  .app-shell__connection-source:hover {
    background: color-mix(in srgb, var(--color-primary, #3975ca) 28%, var(--shell-nav-bg));
  }
  .app-shell__connection-source:active {
    background: color-mix(in srgb, var(--color-primary, #3975ca) 34%, var(--shell-nav-bg));
  }
  .app-shell__connection-source {
    /* Bridge live — shared SoT with Neutralino /service/config */
  }
  .app-shell__connection-source[data-bridge-live="1"] {
    border-color: color-mix(in srgb, #2e7d32 50%, var(--shell-nav-border));
    background: color-mix(in srgb, #2e7d32 22%, var(--shell-nav-bg));
    color: color-mix(in srgb, #1b5e20 75%, var(--shell-nav-fg));
  }
  /* CWS / cwsp: reach :8434 when there is no address bar (PWA, embedded). */
  .app-shell__admin-door {
    flex-shrink: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.3rem 0.5rem;
    border-radius: var(--radius-sm, 6px);
    border: 1px solid color-mix(in srgb, var(--color-error, #c62828) 40%, var(--shell-nav-border));
    background: color-mix(in srgb, var(--color-error, #c62828) 16%, var(--shell-nav-bg));
    color: color-mix(in srgb, var(--color-error, #b71c1c) 70%, var(--shell-nav-fg));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  .app-shell__admin-door:hover {
    background: color-mix(in srgb, var(--color-error, #c62828) 24%, var(--shell-nav-bg));
  }
  .app-shell__admin-door:active {
    background: color-mix(in srgb, var(--color-error, #c62828) 30%, var(--shell-nav-bg));
  }
  /*
   * WCO: drag empty chrome to move the window; keep controls clickable.
   * https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
   */
  @media (display-mode: window-controls-overlay) {
    :where(.app-shell, .app-shell[data-style=minimal]) .app-shell__nav {
      window-drag: move;
      -webkit-app-region: drag;
      app-region: drag;
    }
    :where(.app-shell, .app-shell[data-style=minimal]) .app-shell__nav-left,
    :where(.app-shell, .app-shell[data-style=minimal]) .app-shell__nav-right {
      window-drag: none;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    }
  }
  /* Icon-only theme cycle (replaces <select>); matches nav button hit target */
  .shell-theme-cycle-btn {
    padding-inline: var(--space-sm, 0.5rem);
    min-inline-size: 2.5rem;
    justify-content: center;
  }
  .shell-theme-cycle-btn ui-icon {
    margin: 0;
  }
  .app-shell__nav-btn {
    display: flex;
    align-items: center;
    gap: var(--gap-sm, 0.5rem);
    padding: var(--space-xs, 0.5rem) var(--space-md, 0.75rem);
    border: none;
    border-radius: var(--radius-lg, 8px);
    background: transparent;
    color: var(--shell-fg);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    cursor: pointer;
    transition: background-color var(--motion-fast, 0.15s ease), color var(--motion-fast, 0.15s ease);
    white-space: nowrap;
    user-select: none;
    line-height: normal;
    block-size: max-content;
    min-block-size: 2.5rem;
    flex-shrink: 0;
  }
  .app-shell__nav-btn ui-icon {
    --icon-size: clamp(1.25rem, 5.5dvmin, 1.75rem);
    /* WHY: follow nav ink (light/dark); do not rely on Phosphor @property defaults. */
    --icon-color: currentColor;
    font-size: var(--icon-size);
    opacity: 0.8;
    flex-shrink: 0;
    min-inline-size: 1.25rem;
    min-block-size: 1.25rem;
  }
  .app-shell__nav-btn:hover {
    background-color: var(--shell-btn-hover);
  }
  .app-shell__nav-btn:active {
    background-color: var(--shell-btn-active-bg);
    color: var(--shell-btn-active-fg);
  }
  .app-shell__nav-btn:focus-visible {
    outline: 2px solid var(--shell-btn-active-fg);
    outline-offset: 2px;
    box-shadow: var(--focus-ring, none);
  }
  .app-shell__nav-btn.active {
    /* INVARIANT: readable label+icon on light theme (no white-on-white). */
    background-color: var(--shell-btn-active-bg, color-mix(in oklab, #2e3a64 18%, #fafbfc));
    color: var(--shell-btn-active-fg, #1e293b);
    /* WHY: was \`var(var(...))\` — invalid, icons lost ink on active pills. */
    --icon-color: var(--shell-btn-active-fg, var(--color-on-surface, #1e293b));
    /*
     * Scope \`--icon-color\` to \`ui-icon\` so button label color stays independent.
     */
  }
  .app-shell__nav-btn.active ui-icon {
    opacity: 1;
    --icon-color: var(--shell-btn-active-fg, var(--color-on-surface, #1e293b));
    color: var(--icon-color);
  }
  .app-shell__nav-btn.active .app-shell__nav-label {
    color: var(--shell-btn-active-fg, #1e293b);
  }
  .app-shell__nav-btn {
    /* Belt-and-suspenders: light active label stays ink even if token chain drifts. */
  }
  .app-shell[data-theme=light] .app-shell__nav-btn.active, :host([data-theme=light]) .app-shell__nav-btn.active, :host-context(html[data-theme=light]) .app-shell__nav-btn.active {
    color: #1e293b;
  }
  .app-shell[data-theme=light] .app-shell__nav-btn.active .app-shell__nav-label, :host([data-theme=light]) .app-shell__nav-btn.active .app-shell__nav-label, :host-context(html[data-theme=light]) .app-shell__nav-btn.active .app-shell__nav-label {
    color: #1e293b;
  }
  .app-shell[data-theme=dark] .app-shell__nav-btn.active, :host([data-theme=dark]) .app-shell__nav-btn.active, :host-context(html[data-theme=dark]) .app-shell__nav-btn.active {
    color: #f1f5f9;
  }
  .app-shell[data-theme=dark] .app-shell__nav-btn.active .app-shell__nav-label, :host([data-theme=dark]) .app-shell__nav-btn.active .app-shell__nav-label, :host-context(html[data-theme=dark]) .app-shell__nav-btn.active .app-shell__nav-label {
    color: #f1f5f9;
  }
  /* Stacked layers: underlying (absolute) → chrome grid (nav + main, z-index 1) → overlays (absolute).
   * \`display: contents\` on slots lifts slotted views into this grid when applicable. */
  .app-shell__viewport {
    grid-row: viewport-row;
    display: grid;
    grid-template-rows: [shell-nav-row] auto [shell-main-row] minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    position: relative;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
    isolation: isolate;
    align-self: stretch;
  }
  .app-shell__underlying {
    /* Full viewport bleed behind nav + main; does not consume grid rows (\`position: absolute\`). */
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    min-inline-size: 0;
    min-block-size: 0;
  }
  .app-shell__underlying > slot::slotted(*) {
    pointer-events: auto;
  }
  .app-shell__overlays {
    position: absolute;
    inset: 0;
    z-index: 10000;
    pointer-events: none;
    overflow: visible;
    /* WHY: slot itself must stay non-hit-testing; only real overlay nodes capture. */
  }
  .app-shell__overlays > slot {
    pointer-events: none;
  }
  .app-shell__overlays > slot::slotted(*) {
    pointer-events: auto;
  }
  .app-shell__overlays > :not(slot) {
    pointer-events: auto;
  }
  .app-shell__content {
    container-type: size;
    /* layout + style: avoid \`strict\` paint containment fighting view/token repaints after async theme loads */
    contain: layout style;
    grid-row: shell-main-row;
    grid-column: 1;
    position: relative;
    z-index: 1;
    /* Chrome column: optional boot loader row + minmax main (grid boxes for slotted views via \`display: contents\` on \`<slot>\`). */
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    inline-size: stretch;
    block-size: stretch;
    max-inline-size: stretch;
    max-block-size: stretch;
    min-inline-size: 0;
    min-block-size: 0;
    padding: 0;
    margin: 0;
    border: none 0px transparent;
    /* Explicit main surface — avoids transparent flashes vs nav / host during theme-color churn */
    background: var(--shell-bg);
    background-color: var(--shell-bg);
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--shell-scrollbar, rgba(128, 128, 128, 0.3)) transparent;
    box-sizing: border-box;
    border-radius: 0px;
  }
  .app-shell__content slot:not([name])::slotted([data-view=explorer]) {
    display: flex !important;
    flex-direction: column !important;
    min-block-size: 0 !important;
    block-size: 100% !important;
    max-block-size: 100% !important;
    overflow: hidden !important;
  }
  .app-shell__content {
    /*
     * Default-slot views live in light DOM; descendant selectors do not cross shadow — use ::slotted.
     */
  }
  .app-shell__content slot:not([name])::slotted([data-view]) {
    grid-row: 2;
    position: absolute;
    inset: 0;
    overflow: auto;
    scrollbar-width: thin;
    inline-size: stretch;
    block-size: stretch;
    min-inline-size: 0;
    min-block-size: fit-content;
  }
  .app-shell__content slot:not([name])::slotted([data-view=settings]),
  .app-shell__content slot:not([name])::slotted(.view-settings),
  .app-shell__content slot:not([name])::slotted([data-view=network]),
  .app-shell__content slot:not([name])::slotted(.cw-network-view-host) {
    overflow: hidden;
    min-block-size: 0;
    block-size: 100%;
    max-block-size: 100%;
    display: flex;
    flex-direction: column;
  }
  .app-shell__content {
    /*
     * WHY: Some view hosts override \`hidden\` or stack absolutely — force inert stacking
     * so the inactive view cannot intercept scroll/pointer (minimal single-slot shell).
     */
  }
  .app-shell__content > [data-view][hidden],
  .app-shell__content slot:not([name])::slotted([hidden]),
  .app-shell__content slot:not([name])::slotted([data-view][hidden]) {
    display: none !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }
  .app-shell__content slot:not([name])::slotted(*) {
    grid-row: 2;
    min-block-size: 0;
    min-inline-size: 0;
    overflow: auto;
  }
  .app-shell__content::-webkit-scrollbar {
    inline-size: 8px;
  }
  .app-shell__content::-webkit-scrollbar-track {
    background: transparent;
  }
  .app-shell__content::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.4);
    border-radius: 4px;
  }
  .app-shell__status {
    position: fixed;
    inset-block-end: var(--space-2xl, 1.5rem);
    inset-inline-start: 50%;
    z-index: 9999;
    padding: var(--space-md, 0.75rem) var(--space-xl, 1.5rem);
    background-color: var(--shell-status-bg);
    color: var(--shell-status-fg);
    border-radius: var(--radius-lg, 8px);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    box-shadow: var(--elev-3, 0 4px 12px rgba(0, 0, 0, 0.15));
    transform: translateX(-50%);
    animation: app-shell-status-enter 0.2s ease-out;
  }
  .app-shell__status:empty, .app-shell__status[hidden] {
    display: none;
  }
  .app-shell__loading {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg, 1rem);
    inline-size: stretch;
    block-size: stretch;
    max-inline-size: stretch;
    max-block-size: stretch;
    min-inline-size: 0;
    min-block-size: 0;
    padding: var(--space-2xl, 2rem);
  }
  .app-shell__loading .loading-spinner {
    inline-size: 32px;
    block-size: 32px;
    border: 3px solid var(--color-outline-variant);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: app-shell-spin 0.8s linear infinite;
  }
}
@layer shell.utilities {
  @keyframes app-shell-spin {
    to {
      transform: rotate(1turn);
    }
  }
  @keyframes app-shell-status-enter {
    from {
      opacity: 0;
      transform: translate(-50%, 0.5rem);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
}
@layer shell.markdown-host-theme {
  /* WHY: Viewer/markdown theme selectors scoped under \`html[…]\` do not pierce this shadow root. */
  @scope (
        markdown-view,
        md-view,
        .markdown-view,
        cw-view-viewer,
        .cw-view-viewer-shell,
        :host(markdown-view),
        :host(md-view),
        :host(.markdown-view),
        :host(cw-view-viewer)
    ) {
    /* Pin viewer surface tokens on the slotted light-DOM host — survives late \`:root\` / Veela token updates */
    :host([data-theme=light]) ::slotted([data-view=viewer]) {
      color-scheme: light;
      /* Inherit wallpaper --color-primary; do not pin blue #2563eb. */
      --base-color: var(--color-primary, #5a7fff);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      --view-bg: var(--color-surface, --u2-color-mod(var(--base-color-neutralized), 70));
      --view-fg: var(--color-on-surface, --u2-color-mod(var(--base-color-neutralized), 900));
      --view-toolbar-bg: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 900) 6%, transparent);
      --view-btn-hover-bg: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 900) 7%, transparent);
      --view-code-bg: --u2-color-mod(var(--base-color-neutralized), 120);
      --view-blockquote-bg: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 900) 3%, transparent);
      --color-on-surface: --u2-color-mod(var(--base-color-neutralized), 980);
      --viewer-toolbar-row-fill: --u2-color-mod(var(--base-color), 160);
      --view-picon-fill: --u2-color-mod(var(--base-color-neutralized), 780);
      --view-picon-fill-hover: var(--color-primary, --u2-color-mod(var(--base-color-neutralized), 550));
      --color-surface-container-high: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 900) 10%, transparent);
    }
    :host([data-theme=dark]) ::slotted([data-view=viewer]) {
      color-scheme: dark;
      --base-color: var(--color-primary, #5a7fff);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      --view-bg: var(--color-surface, --u2-color-mod(var(--base-color-neutralized), 960));
      --view-fg: var(--color-on-surface, --u2-color-mod(var(--base-color-neutralized), 100));
      --view-toolbar-bg: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 100) 6%, transparent);
      --view-btn-hover-bg: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 100) 8%, transparent);
      --view-code-bg: --u2-color-mod(var(--base-color-neutralized), 900);
      --view-blockquote-bg: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 100) 4%, transparent);
      --color-on-surface: --u2-color-mod(var(--base-color-neutralized), 10);
      --viewer-toolbar-row-fill: --u2-color-mod(var(--base-color-neutralized), 880);
      --view-picon-fill: --u2-color-mod(var(--base-color-neutralized), 280);
      --view-picon-fill-hover: --u2-color-mod(var(--base-color-neutralized), 420);
      --color-surface-container-high: color-mix(in oklab, --u2-color-mod(var(--base-color-neutralized), 100) 14%, transparent);
    }
    /*
    * Prose that stays in light DOM under the viewer host (slotted / adopted nodes).
    * Descendant combinator after ::slotted is valid for elements under the assigned node.
    */
    :host([data-theme=light]) ::slotted([data-view=viewer]) :where(.markdown-body, [data-render-target].markdown-body) {
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      --color-surface: --u2-color-mod(var(--base-color-neutralized, var(--color-primary)), 10);
      --color-on-surface: --u2-color-mod(var(--base-color-neutralized, var(--color-primary)), 980);
      color-scheme: light;
    }
    :host([data-theme=dark]) ::slotted([data-view=viewer]) :where(.markdown-body, [data-render-target].markdown-body) {
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      --color-surface: --u2-color-mod(var(--base-color-neutralized, var(--color-primary)), 980);
      --color-on-surface: --u2-color-mod(var(--base-color-neutralized, var(--color-primary)), 10);
      color-scheme: dark;
    }
  }
}
@layer shell.overrides {
  @media (max-width: 640px) {
    .app-shell__nav-label {
      display: none;
    }
  }
  /* Narrow viewports: keep ≥44px touch targets; do not shrink icons (was ~20px caps). */
  @media (max-width: 768px) {
    :where(.app-shell, .app-shell[data-style=minimal]) {
      --shell-nav-height: 52px;
    }
    .app-shell__nav {
      gap: var(--gap-xs, 0.35rem);
    }
    .app-shell__nav-btn {
      min-block-size: 2.75rem;
      padding: var(--space-sm, 0.5rem) var(--space-sm, 0.65rem);
    }
    .app-shell__nav-btn ui-icon {
      --icon-size: clamp(1.35rem, 6dvmin, 1.85rem);
      font-size: var(--icon-size);
      min-inline-size: 1.35rem;
      min-block-size: 1.35rem;
    }
  }
  @media print {
    .app-shell__viewport {
      display: contents !important;
    }
    .app-shell__underlying,
    .app-shell__overlays {
      display: none !important;
    }
    .app-shell__content {
      overflow: visible;
      contain: none;
      display: contents !important;
    }
    .app-shell__content::-webkit-scrollbar {
      display: none;
    }
    .app-shell__content > [data-view],
    .app-shell__content slot:not([name])::slotted([data-view]) {
      position: static !important;
      inset: auto !important;
      overflow: visible !important;
      inline-size: auto !important;
      block-size: auto !important;
      max-block-size: none !important;
      min-block-size: 0 !important;
    }
    [data-cw-view-host=true],
    [data-cw-view-host=true] > .cw-view-element__mount,
    .cw-view-viewer-shell,
    .cw-view-viewer__prose,
    [data-cw-viewer-prose],
    md-view,
    markdown-viewer,
    .markdown-body,
    .markdown-viewer-content,
    .result-content {
      overflow: visible !important;
      contain: none !important;
      container-type: normal !important;
      block-size: auto !important;
      max-block-size: none !important;
    }
    .app-shell__nav,
    .app-shell__status {
      display: none !important;
    }
  }
}`}));function _(e){return b.has(e)}function v(e){return new x}var y,b,x,S=e((()=>{l(),n(),g(),u(),d(),o(),p(),s(),y=[{id:`viewer`,name:`Markdown`,icon:`eye`},{id:`explorer`,name:`Explorer`,icon:`folder`},{id:`workcenter`,name:`Work Center`,icon:`lightning`},{id:`network`,name:`Network`,icon:`wifi-high`},{id:`settings`,name:`Settings`,icon:`gear`},{id:`history`,name:`History`,icon:`clock-counter-clockwise`}].filter(e=>a(e.id)),b=new Set(y.map(e=>e.id)),x=class extends f{id=`minimal`;name=`Minimal`;layout={hasSidebar:!1,hasToolbar:!0,hasTabs:!1,supportsMultiView:!1,supportsWindowing:!1};createLayout(){let e=i`
            <div class="app-shell" data-shell="minimal">
                <div class="app-shell__viewport">
                    <div class="app-shell__underlying">
                        <slot name="${m.underlying}"></slot>
                    </div>
                    <nav class="app-shell__nav" role="navigation" aria-label="Main navigation">
                        <div class="app-shell__nav-left" data-nav-left>
                            ${this.renderNavButtons()}
                        </div>
                        <div class="app-shell__nav-right" data-shell-toolbar>
                            <!-- View-specific toolbar actions go here -->
                        </div>
                    </nav>
                    <main class="app-shell__content" data-shell-content role="main">
                        <div class="app-shell__loading">
                            <div class="loading-spinner"></div>
                            <span>Loading...</span>
                        </div>
                        <slot></slot>
                    </main>
                    <div class="app-shell__overlays" data-shell-overlays>
                        <slot name="${m.overlay}"></slot>
                    </div>
                </div>
                <div class="app-shell__status" data-shell-status hidden aria-live="polite"></div>
            </div>
        `;return this.setupNavClickHandlers(e),this.setupConnectionSourceButton(e),this.setupAdminDoorButton(e),e}setupConnectionSourceButton(e){try{if(document.documentElement.dataset.cwspSurface!==`cwsp-control`)return}catch{return}let t=e.querySelector(`[data-shell-toolbar]`);if(!t||t.querySelector(`[data-connection-source]`))return;let n=i`
            <button
                type="button"
                class="app-shell__connection-source"
                data-connection-source
                aria-label="Connect to another source"
                title="Connection source — Neutralino bridge + CWSP endpoint (login/PIN when needed)"
            >SRC</button>
        `;t.appendChild(n),n.addEventListener(`click`,()=>{try{window.dispatchEvent(new CustomEvent(`cwsp:open-connection-source`))}catch(e){console.warn(`[MinimalShell] connection source:`,e)}})}setupAdminDoorButton(e){let t=e.querySelector(`[data-shell-toolbar]`);if(!t||t.querySelector(`[data-admin-door]`))return;let n=i`
            <button
                type="button"
                class="app-shell__admin-door"
                data-admin-door
                aria-label="Open server admin (HTTPS)"
                title="Server admin (HTTPS :8434). Configure origins in Settings → Server."
            >ADM</button>
        `;t.appendChild(n),n.addEventListener(`click`,()=>{c(async()=>{let{loadSettings:e}=await import(`./Settings-BBPxD7yF.js`).then(e=>(e.a(),e.t));return{loadSettings:e}},[],import.meta.url).then(({loadSettings:e})=>e()).then(e=>c(async()=>{let{openAdminDoorFromCore:e}=await import(`./admin-doors-BoU4RSfd.js`).then(e=>(e.n(),e.t));return{openAdminDoorFromCore:e}},[],import.meta.url).then(({openAdminDoorFromCore:t})=>{t(e.core,`https`)})).catch(e=>console.warn(`[MinimalShell] admin door:`,e))})}renderNavButtons(){let e=document.createDocumentFragment();for(let t of y){let n=i`
                <button
                    class="app-shell__nav-btn"
                    data-view="${t.id}"
                    type="button"
                    title="${t.name}"
                >
                    <ui-icon icon="${t.icon}" icon-style="duotone"></ui-icon>
                    <span class="app-shell__nav-label">${t.name}</span>
                </button>
            `;e.appendChild(n)}return e}setupNavClickHandlers(e){let t=e.querySelector(`[data-nav-left]`);t&&(t.addEventListener(`click`,e=>{let t=e.target.closest(`[data-view]`);if(!t)return;let n=t.dataset.view;n&&_(n)&&this.navigate(n)}),r(this.currentView,e=>{this.updateActiveNavButton(t,e)}))}updateActiveNavButton(e,t){e.querySelectorAll(`[data-view]`).forEach(e=>{let n=e.dataset.view===t;e.classList.toggle(`active`,n),e.setAttribute(`aria-current`,n?`page`:`false`)})}getStylesheet(){return h}renderView(e){if(!this.contentContainer||!this.rootElement){console.warn(`[${this.id}] No content container available`);return}this.contentContainer.setAttribute(`data-current-view`,this.currentView.value);let t=this.navigationState.previousView;if(t&&t!==this.currentView.value&&this.loadedViews.has(t)){let e=this.loadedViews.get(t);if(e.element.removeAttribute(`data-view`),e.element.hidden=!0,this.rootElement.contains(e.element)&&e.element.remove(),t===`history`&&this.currentView.value!==`history`)try{globalThis.__CWSP_TRANSFER_HISTORY_UI_ACTIVE__&&c(()=>import(`./transfer-history-runtime-BN40YXfL.js`).then(e=>e.setTransferHistoryUiActive(!1)),[],import.meta.url).catch(()=>void 0)}catch{}}e.setAttribute(`data-view`,this.currentView.value),e.hidden=!1,e.removeAttribute(`slot`),this.rootElement.contains(e)||this.rootElement.appendChild(e);let n=this.contentContainer.querySelector(`.app-shell__loading`);n&&(n.hidden=!0),this.currentViewElement=e}applyTheme(e){let t=this.rootElement?.shadowRoot?.querySelector(`.app-shell`);t&&(t.dataset.theme=this.resolveShellColorScheme(e)),super.applyTheme(e)}async mount(e){await super.mount(e),this.setupPopstateNavigation(),c(()=>import(`./capacitor-permissions-Brl6YLsA.js`).then(e=>(e.n(),e.t)).then(e=>e.ensureCapacitorPermissions()),[],import.meta.url).catch(()=>{}),c(()=>import(`./capacitor-share-intent-CoGNcm4J.js`).then(e=>e.installCapacitorShareIntentBridge()),[],import.meta.url).catch(()=>{}),c(()=>import(`./capacitor-clipboard-asset-Dvnxw05z.js`).then(e=>e.installCapacitorClipboardAssetBridge()),[],import.meta.url).catch(()=>{})}}})),C=t({MinimalShell:()=>x,createShell:()=>v,default:()=>v}),w=e((()=>{S()}));export{S as i,C as n,x as r,w as t};