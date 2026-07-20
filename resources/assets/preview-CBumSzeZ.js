import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{F as t,L as n,R as r,t as i}from"./src-kpjtbscK.js";import{n as a,t as o}from"./preload-helper-NDuSAHbO.js";import{G as s,K as c}from"./cwsp-app.js";import{i as l,n as u,r as d,t as f}from"./shells-G9vW_c0L.js";import{t as p}from"./src-DUnEbC_E.js";var m,h=e((()=>{m=`/* Minimal shell: layered tokens + nav/content grid, WCO-safe, shadow slot views. */
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
      -webkit-app-region: drag;
      app-region: drag;
    }
    :where(.app-shell, .app-shell[data-style=minimal]) .app-shell__nav-left,
    :where(.app-shell, .app-shell[data-style=minimal]) .app-shell__nav-right {
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
    --icon-size: clamp(1.25rem, 5.5vmin, 1.75rem);
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
    background-color: var(--shell-btn-active-bg, color-mix(in oklab, #5a7fff 18%, #fafbfc));
    color: var(--shell-btn-active-fg, #1e293b);
    /*
     * WHY: \`--icon-color\` is a registered inheriting property (Phosphor initial #fff).
     * Scope it to \`ui-icon\` only — never set on the button (would leak toward label).
     */
  }
  .app-shell__nav-btn.active ui-icon {
    opacity: 1;
    --icon-color: var(--color-primary, #5a7fff);
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
  }
  .app-shell__overlays > slot::slotted(*) {
    pointer-events: auto;
  }
  .app-shell__overlays > * {
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
  /* Pin viewer surface tokens on the slotted light-DOM host — survives late \`:root\` / Veela token updates */
  :host([data-theme=light]) ::slotted([data-view=viewer]) {
    color-scheme: light;
    --view-bg: #f4f6fa;
    --view-fg: #1a1a1a;
    --view-toolbar-bg: rgba(0, 0, 0, 0.06);
    --view-btn-hover-bg: rgba(0, 0, 0, 0.07);
    --view-code-bg: #f0f2f5;
    --view-blockquote-bg: rgba(0, 0, 0, 0.03);
    --color-on-surface: #2d3748;
    --color-primary: #2563eb;
    /* Toolbar row (inherited into viewer shadow — replaces nested .view-viewer__toolbar rules) */
    --viewer-toolbar-row-fill: #e8ecf4;
    --view-picon-fill: #1e293b;
    --view-picon-fill-hover: #2563eb;
    --color-surface-container-high: rgb(0 0 0 / 0.1);
  }
  :host([data-theme=dark]) ::slotted([data-view=viewer]) {
    color-scheme: dark;
    --view-bg: #0b0d12;
    --view-fg: #e8eaef;
    --view-toolbar-bg: rgba(255, 255, 255, 0.06);
    --view-btn-hover-bg: rgba(255, 255, 255, 0.08);
    --view-code-bg: #161a22;
    --view-blockquote-bg: rgba(255, 255, 255, 0.04);
    --color-on-surface: #c4c9d4;
    --color-primary: #8ab4ff;
    --viewer-toolbar-row-fill: #151f2e;
    --view-picon-fill: #e5e7eb;
    --view-picon-fill-hover: var(--color-primary-hover, #93c5fd);
    --color-surface-container-high: rgb(255 255 255 / 0.14);
  }
  /*
   * Prose that stays in light DOM under the viewer host (slotted / adopted nodes).
   * Descendant combinator after ::slotted is valid for elements under the assigned node.
   */
  :host([data-theme=light]) ::slotted([data-view=viewer]) :where(.markdown-body, [data-render-target].markdown-body) {
    --color-surface: #ffffff;
    --color-on-surface: #1a1a1a;
    color-scheme: light;
  }
  :host([data-theme=dark]) ::slotted([data-view=viewer]) :where(.markdown-body, [data-render-target].markdown-body) {
    --color-surface: #121212;
    --color-on-surface: #e8eaef;
    color-scheme: dark;
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
      --icon-size: clamp(1.35rem, 6vmin, 1.85rem);
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
}`}));function g(e){return y.has(e)}function _(e){return new b}var v,y,b,x=e((()=>{i(),n(),h(),p(),u(),s(),l(),a(),v=[{id:`viewer`,name:`Markdown`,icon:`eye`},{id:`explorer`,name:`Explorer`,icon:`folder`},{id:`workcenter`,name:`Work Center`,icon:`lightning`},{id:`network`,name:`Network`,icon:`wifi-high`},{id:`airpad`,name:`AirPad`,icon:`hand-pointing`},{id:`settings`,name:`Settings`,icon:`gear`},{id:`history`,name:`History`,icon:`clock-counter-clockwise`}].filter(e=>c(e.id)),y=new Set(v.map(e=>e.id)),b=class extends f{id=`minimal`;name=`Minimal`;layout={hasSidebar:!1,hasToolbar:!0,hasTabs:!1,supportsMultiView:!1,supportsWindowing:!1};createLayout(){let e=t`
            <div class="app-shell" data-shell="minimal">
                <div class="app-shell__viewport">
                    <div class="app-shell__underlying">
                        <slot name="${d.underlying}"></slot>
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
                        <slot name="${d.overlay}"></slot>
                    </div>
                </div>
                <div class="app-shell__status" data-shell-status hidden aria-live="polite"></div>
            </div>
        `;return this.setupNavClickHandlers(e),this.setupConnectionSourceButton(e),this.setupAdminDoorButton(e),e}setupConnectionSourceButton(e){try{if(document.documentElement.dataset.cwspSurface!==`cwsp-control`)return}catch{return}let n=e.querySelector(`[data-shell-toolbar]`);if(!n||n.querySelector(`[data-connection-source]`))return;let r=t`
            <button
                type="button"
                class="app-shell__connection-source"
                data-connection-source
                aria-label="Connect to another source"
                title="Connection source — Neutralino bridge + CWSP endpoint (login/PIN when needed)"
            >SRC</button>
        `;n.appendChild(r),r.addEventListener(`click`,()=>{try{window.dispatchEvent(new CustomEvent(`cwsp:open-connection-source`))}catch(e){console.warn(`[MinimalShell] connection source:`,e)}})}setupAdminDoorButton(e){let n=e.querySelector(`[data-shell-toolbar]`);if(!n||n.querySelector(`[data-admin-door]`))return;let r=t`
            <button
                type="button"
                class="app-shell__admin-door"
                data-admin-door
                aria-label="Open server admin (HTTPS)"
                title="Server admin (HTTPS :8434). Configure origins in Settings → Server."
            >ADM</button>
        `;n.appendChild(r),r.addEventListener(`click`,()=>{o(async()=>{let{loadSettings:e}=await import(`./Settings-CzQ1lgp1.js`).then(e=>(e.a(),e.t));return{loadSettings:e}},[],import.meta.url).then(({loadSettings:e})=>e()).then(e=>o(async()=>{let{openAdminDoorFromCore:e}=await import(`./admin-doors-BoU4RSfd.js`).then(e=>(e.n(),e.t));return{openAdminDoorFromCore:e}},[],import.meta.url).then(({openAdminDoorFromCore:t})=>{t(e.core,`https`)})).catch(e=>console.warn(`[MinimalShell] admin door:`,e))})}renderNavButtons(){let e=document.createDocumentFragment();for(let n of v){let r=t`
                <button
                    class="app-shell__nav-btn"
                    data-view="${n.id}"
                    type="button"
                    title="${n.name}"
                >
                    <ui-icon icon="${n.icon}" icon-style="duotone"></ui-icon>
                    <span class="app-shell__nav-label">${n.name}</span>
                </button>
            `;e.appendChild(r)}return e}setupNavClickHandlers(e){let t=e.querySelector(`[data-nav-left]`);t&&(t.addEventListener(`click`,e=>{let t=e.target.closest(`[data-view]`);if(!t)return;let n=t.dataset.view;n&&g(n)&&this.navigate(n)}),r(this.currentView,e=>{this.updateActiveNavButton(t,e)}))}updateActiveNavButton(e,t){e.querySelectorAll(`[data-view]`).forEach(e=>{let n=e.dataset.view===t;e.classList.toggle(`active`,n),e.setAttribute(`aria-current`,n?`page`:`false`)})}getStylesheet(){return m}renderView(e){if(!this.contentContainer||!this.rootElement){console.warn(`[${this.id}] No content container available`);return}this.contentContainer.setAttribute(`data-current-view`,this.currentView.value);let t=this.navigationState.previousView;if(t&&t!==this.currentView.value&&this.loadedViews.has(t)){let e=this.loadedViews.get(t);e.element.removeAttribute(`data-view`),e.element.hidden=!0,this.rootElement.contains(e.element)&&e.element.remove()}e.setAttribute(`data-view`,this.currentView.value),e.hidden=!1,e.removeAttribute(`slot`),this.rootElement.contains(e)||this.rootElement.appendChild(e);let n=this.contentContainer.querySelector(`.app-shell__loading`);n&&(n.hidden=!0),this.currentViewElement=e}applyTheme(e){let t=this.rootElement?.shadowRoot?.querySelector(`.app-shell`);t&&(t.dataset.theme=this.resolveShellColorScheme(e)),super.applyTheme(e)}async mount(e){await super.mount(e),this.setupPopstateNavigation(),o(()=>import(`./cwsp-app.js`).then(e=>(e.y(),e.v)).then(e=>e.ensureCapacitorPermissions()),[],import.meta.url).catch(()=>{}),o(()=>import(`./capacitor-share-intent-DaUaczPu.js`).then(e=>e.installCapacitorShareIntentBridge()),[],import.meta.url).catch(()=>{}),o(()=>import(`./capacitor-clipboard-asset-BOoNwR-f.js`).then(e=>e.installCapacitorClipboardAssetBridge()),[],import.meta.url).catch(()=>{})}}}));e((()=>{x()}))();export{b as MinimalShell,_ as createShell,_ as default};