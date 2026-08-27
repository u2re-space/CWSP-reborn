import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{j as t,t as n}from"./src-C7QuTtnr.js";import{c as r,f as i,i as a,m as o,p as s,r as c,s as l,u}from"./ecosystem-skus-7pqekvU4.js";import{a as d,n as f,r as p,t as m}from"./history-base-Dxwgv1vv.js";import{_ as h,a as g,c as _,d as v,f as y,l as b,u as x}from"./registry-DkaO7J4G.js";import{n as S,t as C}from"./preload-helper-DcjHEl26.js";import{n as w,t as ee}from"./templates-TzWY6auj.js";import{a as te,d as T}from"./UnifiedMessaging-CDibs2yQ.js";import{a as ne,i as re,r as ie}from"./BootLoader-7aI7GkIE.js";import{B as ae,K as oe}from"./airpad-cwsp-client-parity-C1fUeWnY.js";import{t as E}from"./src-B4o_J9rd.js";import{a as se,i as ce,r as le,t as ue}from"./SettingsTypes-BEJR80_L.js";import{a as D}from"./HistoryManager-B52KbQG4.js";import{t as de,v as fe}from"./remote-connection-runtime-Bsibrymc.js";import{a as pe,c as me,i as he,n as ge,o as _e,r as ve,s as ye}from"./Settings-BDKPLgrl.js";import{i as be,s as xe,t as Se}from"./object-DpwBpfvO.js";import{c as O,l as Ce,n as we,o as Te,r as k,s as Ee,u as A}from"./Theme-sOwwvTGD.js";import{n as De,r as Oe}from"./capacitor-permissions-D8qxRNOR.js";import{a as ke,c as Ae,d as je,f as Me,i as Ne,l as Pe,m as Fe,n as Ie,o as Le,p as Re,r as ze,s as j,u as Be}from"./web-GR4EDvNJ.js";import{s as Ve}from"./icon-BI41b7Mj.js";import{a as He,c as Ue,d as We,f as Ge,h as Ke,i as qe,l as Je,m as Ye,n as Xe,o as Ze,p as Qe,r as $e,s as et,u as tt}from"./shells-CU9za0vy.js";import{i as nt,n as rt,r as it}from"./admin-doors-DkOVgiUY.js";import{c as at,i as ot,l as st,n as ct,o as lt,r as ut,s as dt}from"./CustomInstructions-BJCAYWBO.js";import{n as ft}from"./registry-BZTCKkyv.js";import{a as pt,r as mt}from"./channel-actions-D5ksGgGK.js";function M(){return(M=e((()=>{})))()}var N,ht,gt,_t,vt;function P(){return(P=e((()=>{M(),N=`data-settings-view-css`,ht=e=>{let t=String(e||``).trim();t=t.replace(/^(@charset\s+[^;]+;\s*)+/i,``);for(let e=0;e<8;e++){let e=t.replace(/^\/\*[\s\S]*?\*\/\s*/,``);if(e===t)break;t=e.trim()}let n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},gt=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;grid-template-columns:minmax(0,1fr)!important;inline-size:100%!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;pointer-events:auto!important;container-type:inline-size}
.view-settings .settings-screen__top{display:flex!important;flex-direction:column!important;align-items:stretch!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;pointer-events:auto!important}
.view-settings .settings-tab-actions{display:flex!important;flex-wrap:nowrap!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;overflow-x:auto!important;overflow-y:hidden!important;pointer-events:auto!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch;pointer-events:auto!important}
.view-settings .settings-screen__body>[data-tab-panel]:not(.is-active),.view-settings .settings-screen__body>[data-tab-panel][hidden]{display:none!important}
.view-settings .settings-screen__body>[data-tab-panel].is-active:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important;pointer-events:auto!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select,.view-settings .btn,.view-settings .card{pointer-events:auto!important}
.view-settings .settings-tab-btn{pointer-events:auto!important;cursor:pointer!important;flex:0 0 auto!important}
`,_t=e=>{if(e&&!e.classList?.contains(`view-settings`)||typeof document>`u`||document.head?.querySelector(`style[${N}]`))return;let t=ht(`/* Settings view — self-contained stylesheet.
 * INVARIANT: Works inside open shadow roots: no reliance on \`html:has(...)\`, \`:root:has(...)\`,
 * or \`html[data-active-view]\` for paint. Uses inherited \`color-scheme\` + \`light-dark()\` fallbacks
 * wherever \`--color-*\` Veela tokens are absent on first paint.
 * WHY: Lock \`color-scheme\` to app theme so fallbacks do not follow OS while Veela is light.
 *
 * NOTE: \`--sv-*\` are a view-specific semantic layer DERIVED from canonical \`--color-*\`
 * (source of truth: veela \`core/misc/_tokens.scss\`). The \`light-dark()\` fallbacks are kept
 * for shadow-DOM self-sufficiency when veela is not loaded — do not remove.
 */
@layer settings-view {
  /* Light DOM (md.u2re.space) + host-context for open shadow shells. */
  :is(html[data-theme=light] .view-settings, :host-context(html[data-theme=light]) .view-settings) {
    color-scheme: light only;
    /* WHY: Force readable labels even if an ancestor still carries dark on-surface. */
    --sv-bg: var(--color-surface, --u2-color-mod(var(--base-color, #5a7fff), 40));
    --sv-fg: var(--color-on-surface, --u2-color-mod(var(--base-color, #5a7fff), 900));
    --sv-muted: var(--color-on-surface-variant, --u2-color-mod(var(--base-color, #5a7fff), 700));
    --sv-outline: var(--color-outline-variant, --u2-color-mod(var(--base-color, #5a7fff), 400));
    --sv-surface-1: var(--color-surface-container-low, --u2-color-mod(var(--base-color, #5a7fff), 10));
    --sv-surface-2: var(--color-surface-container, --u2-color-mod(var(--base-color, #5a7fff), 10));
  }
  :is(html[data-theme=dark] .view-settings, :host-context(html[data-theme=dark]) .view-settings) {
    color-scheme: dark only;
    --sv-bg: var(--color-surface, --u2-color-mod(var(--base-color, #5a7fff), 1000));
    --sv-fg: var(--color-on-surface, --u2-color-mod(var(--base-color, #5a7fff), 100));
    --sv-muted: var(--color-on-surface-variant, --u2-color-mod(var(--base-color, #5a7fff), 280));
    --sv-outline: var(--color-outline-variant, --u2-color-mod(var(--base-color, #5a7fff), 640));
    --sv-surface-1: var(--color-surface-container-low, --u2-color-mod(var(--base-color, #5a7fff), 900));
    --sv-surface-2: var(--color-surface-container, --u2-color-mod(var(--base-color, #5a7fff), 960));
  }
  .view-settings {
    color-scheme: inherit;
    padding: 0px;
    margin: 0px;
    /* ── semantic tokens: simple defaults owned by veela \`core/misc/_tokens.scss\`
     * (\`--sv-bg/fg/muted/outline/surface-1/surface-2/primary/danger/divider/ring\`).
     * Only the complex derived tokens that depend on \`--sv-primary\` stay local.
     * Use sites carry \`var(--sv-*, light-dark(...))\` fallbacks for shadow-DOM
     * self-sufficiency when veela is not loaded.
     */
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /*
     * WHY: Wallpaper seed mid-L teal reads dull as solid CTA fill on dark chrome.
     * Brighten filled tabs/Save via --u2-color-mod (light index on dark scheme).
     */
    --sv-accent: light-dark(
        --u2-color-mod(oklch(from var(--sv-primary, #5a7fff) calc(l * 1.6) calc(c * 2) h), 600),
        --u2-color-mod(oklch(from var(--sv-primary, #5a7fff) calc(l * 1.6) calc(c * 2) h), 400)
    );
    --sv-on-primary: var(
        --color-on-primary,
        light-dark(
            --u2-color-mod(var(--sv-primary, #5a7fff), 10),
            --u2-color-mod(var(--sv-primary, #5a7fff), 990)
        )
    );
    --sv-elev: 0 2px 14px color-mix(in oklab, var(--sv-fg, light-dark(#12151a, #e8edf2)) 5%, transparent);
    /* Derived from \`--sv-outline\` (kept local — complex use-site fallback). */
    --sv-divider: color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 35%, transparent);
    --sv-ring: color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 55%, transparent);
    box-sizing: border-box;
    display: grid !important;
    grid-template-rows: minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content);
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    inline-size: 100%;
    block-size: 100%;
    max-block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
    text-align: start;
    /* WHY: @container rules below must size against the view, not a collapsed tab strip. */
    container-type: inline-size;
    container-name: settings-view;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background-color: var(--sv-surface-2, light-dark(#ffffff, #171c24));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    /*
     * WHY: ui-window host can carry \`pointer-events: none\` (setVisible / hidden-window) or
     * inherit it from a constructed sheet; pin \`auto\` on the view root so embedded settings
     * tabs + body stay clickable even when the host chain is temporarily non-interactive.
     */
    pointer-events: auto;
    touch-action: pan-x pan-y;
  }
  .view-settings *,
  .view-settings *::before,
  .view-settings *::after {
    box-sizing: border-box;
  }
  .view-settings :where(select, input, textarea, option, button) {
    pointer-events: auto;
    font-family: inherit;
  }
  .view-settings textarea {
    container-type: inline-size;
    resize: vertical;
    inline-size: 100%;
    max-inline-size: 100%;
  }
  .view-settings h2,
  .view-settings h3 {
    margin: 0;
    text-align: start;
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
  }
  .view-settings h2 {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    padding-block: 0.5rem;
    margin: 0px;
    text-align: center;
  }
  .view-settings h3 {
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding-block: 0.5rem;
    margin: 0px;
    text-align: center;
  }
  .view-settings h4 {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    padding-block: 0.5rem;
    margin: 0px;
  }
  .view-settings {
    /* ── screen chrome ── */
  }
  .view-settings .settings-screen__top {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0rem;
    padding-block-end: 0px;
    background: var(--sv-surface-2, var(--sv-bg));
    /*border-block-end: 1px solid var(--sv-divider);*/
    border: 0px none transparent;
    border-block-end: 0px none transparent;
    flex-shrink: 0;
    /* WHY: must span the grid track — shrink-to-title collapsed the tab strip to 0px. */
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    overflow: hidden;
    max-inline-size: stretch;
  }
  .view-settings .settings-screen__title {
    font-weight: 600;
    letter-spacing: -0.015em;
    font-size: clamp(1.05rem, 2.5cqi, 1.35rem);
    overflow: visible;
    flex: 0 0 auto;
    max-inline-size: stretch;
  }
  .view-settings {
    /*
     * WHY: Do not switch to flex-row + flex:1 on the tab strip at ≥720px.
     * That layout collapsed \`.settings-tab-actions\` to width 0 (tabs painted off-screen
     * with negative left, clipped by \`.view-settings { overflow: hidden }\`).
     * Keep title above tabs; strip always gets full row width + horizontal scroll.
     */
  }
  .view-settings .settings-screen__body {
    min-block-size: stretch;
    min-inline-size: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-block: 0rem;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-outline, light-dark(#c5cdd8, #3d4755)) transparent;
    touch-action: pan-y;
    max-inline-size: stretch;
    background: var(--sv-surface-1, light-dark(#f4f6fa, #1c232d));
    block-size: stretch;
    border-radius: 0px;
    overflow: hidden;
    overflow-y: auto;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-block: 0px;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-outline, light-dark(#c5cdd8, #3d4755)) transparent;
    scrollbar-gutter: stable;
    max-block-size: stretch;
    position: relative;
    anchor-name: --shape-anchor;
    z-index: 0;
    /*
    * Отступ вокруг бокса.
    */
    /*
    * Радиус углов исходного бокса.
    * Радиус выреза увеличиваем вместе с padding.
    */
    --padding: 0.5rem;
    --radius: 0.5rem;
    --box-x: calc(var(--padding) + 0.5rem);
    --box-y: calc(var(--padding) + 0.5rem);
    --box-width: calc(100% - var(--padding) * 2 - 1rem);
    --box-height: calc(100% - var(--padding) * 2 - 1rem);
    --hole-x: calc(var(--box-x) - var(--padding));
    --hole-y: calc(var(--box-y) - var(--padding));
    --hole-width: calc(
        var(--box-width) + var(--padding) + var(--padding)
    );
    --hole-height: calc(
        var(--box-height) + var(--padding) + var(--padding)
    );
    --hole-radius: calc(var(--radius) + var(--padding));
  }
  .view-settings .settings-screen__body::after {
    content: "";
    position: fixed;
    position-anchor: --shape-anchor;
    inset: auto;
    inset-block-end: anchor(end);
    inset-block-start: anchor(start);
    inset-inline-start: anchor(start);
    inset-inline-end: anchor(end);
    z-index: 1;
    background: var(--sv-surface-1, light-dark(#f4f6fa, #1c232d));
    pointer-events: none;
    touch-action: pan-y;
    inline-size: calc(anchor-size(self-inline) - var(--padding));
    block-size: anchor-size(self-block);
    clip-path: shape(evenodd from 0 0, line to 100% 0, line to 100% 100%, line to 0 100%, close, move to calc(var(--hole-x) + var(--hole-radius)) var(--hole-y), line to calc(var(--hole-x) + var(--hole-width) - var(--hole-radius)) var(--hole-y), arc to calc(var(--hole-x) + var(--hole-width)) calc(var(--hole-y) + var(--hole-radius)) of var(--hole-radius) cw, line to calc(var(--hole-x) + var(--hole-width)) calc(var(--hole-y) + var(--hole-height) - var(--hole-radius)), arc to calc(var(--hole-x) + var(--hole-width) - var(--hole-radius)) calc(var(--hole-y) + var(--hole-height)) of var(--hole-radius) cw, line to calc(var(--hole-x) + var(--hole-radius)) calc(var(--hole-y) + var(--hole-height)), arc to var(--hole-x) calc(var(--hole-y) + var(--hole-height) - var(--hole-radius)) of var(--hole-radius) cw, line to var(--hole-x) calc(var(--hole-y) + var(--hole-radius)), arc to calc(var(--hole-x) + var(--hole-radius)) var(--hole-y) of var(--hole-radius) cw, close);
  }
  .view-settings .settings-screen__body::-webkit-scrollbar {
    inline-size: 6px;
  }
  .view-settings .settings-screen__body::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 45%, transparent);
    border-radius: 99px;
  }
  .view-settings .settings-screen__footer {
    inline-size: stretch;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
    flex-shrink: 0;
    padding-block: 0.5rem;
    padding-inline: 0.25rem;
    background: var(--sv-surface-1, light-dark(#f4f6fa, #1c232d));
    /*border-block-start: 1px solid var(--sv-divider);*/
    /*background: color-mix(in oklab, var(--sv-surface-1, light-dark(#ffffff, #171c24)) 85%, var(--sv-bg, light-dark(#eef1f6, #0f1318)));
    box-shadow: 0 -10px 28px color-mix(in oklab, var(--sv-fg, light-dark(#12151a, #e8edf2)) 4%, transparent);*/
    max-inline-size: stretch;
    padding-inline: 0.5rem;
  }
  .view-settings .ext-note {
    background: var(--sv-surface-1, light-dark(#f4f6fa, #1c232d));
  }
  .view-settings .settings-tab-actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.375rem;
    align-items: center;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    flex: 0 0 auto;
    /* WHY: horizontal scroll when many tabs — never \`overflow: visible\` (hides clipped tabs). */
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-outline, light-dark(#c5cdd8, #3d4755)) transparent;
    /* CRX / layered shells: ensure the tab strip participates in hit-testing */
    pointer-events: auto;
    position: relative;
    z-index: 1;
    touch-action: pan-x;
    max-inline-size: stretch;
    /* WHY: keep the horizontal scrollbar off the pill tabs. */
    padding-block: 0.25rem;
    background-color: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    border-block-start: 1px solid var(--sv-divider);
    padding-block-end: 0.25rem;
    padding-inline: 0.5rem;
  }
  .view-settings {
    /* WHY: remove the border and background when there is no SKU nav */
  }
  .view-settings:not(:has(.settings-sku-nav)) .settings-tab-actions {
    margin: 0px;
    border: 0px none transparent;
    border-block-start: 0px none transparent;
    border-block-end: 1px solid var(--sv-divider);
    background-color: transparent;
  }
  .view-settings {
    /* ── tabs ── */
  }
  .view-settings .settings-sku-nav {
    margin-block-end: 0.125rem;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-outline, light-dark(#c5cdd8, #3d4755)) transparent;
    pointer-events: auto;
    position: relative;
    z-index: 1;
    touch-action: pan-x;
    max-inline-size: stretch;
    justify-content: flex-start;
    align-items: center;
    gap: 0.375rem;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    flex: 0 0 auto;
    padding-block: 0.5rem;
    margin: 0px;
    border: 0px none transparent;
    border-block-start: 0px none transparent;
    border-block-end: 0px none transparent;
    background-color: transparent;
    box-shadow: none;
    padding-block: 0.25rem;
  }
  .view-settings .settings-sku-nav .settings-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 0.5rem;
  }
  .view-settings .settings-sku-nav .settings-sku-nav__icon {
    --icon-size: 1.05rem;
    flex: 0 0 auto;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    font-size: var(--icon-size);
    color: currentColor;
    pointer-events: none;
  }
  .view-settings .settings-tab-actions::-webkit-scrollbar {
    block-size: 4px;
  }
  .view-settings .settings-tab-actions::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, var(--sv-accent, var(--sv-primary, #5a7fff)) 70%, transparent);
    border-radius: 99px;
  }
  .view-settings .settings-tab-btn {
    pointer-events: auto;
    cursor: pointer;
    padding: 0.5rem 0.875rem;
    min-block-size: 2.5rem;
    border: none;
    border: 2px solid transparent;
    border-radius: 999px;
    background: color-mix(in oklab, var(--sv-surface-1, light-dark(#f4f6fa, #1c232d)) 94%, transparent);
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    color: contrast-color(var(--sv-surface-1, light-dark(#f4f6fa, #1c232d)));
    font-size: 0.75rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
    /*box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 14%, transparent);*/
    white-space: nowrap;
    max-inline-size: stretch;
  }
  .view-settings .settings-tab-btn:hover {
    background: color-mix(in oklab, var(--sv-surface-2, light-dark(#f4f6fa, #1c232d)) 100%, transparent);
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
  }
  .view-settings .settings-tab-btn.is-active {
    border: 2px solid;
    border-color: var(--sv-accent, var(--sv-primary, #5a7fff));
    /*color: var(--sv-on-primary);
    color: contrast-color(var(--sv-accent, var(--sv-primary, #5a7fff)));*/
    /*box-shadow:
        0 2px 16px color-mix(in oklab, var(--sv-accent, var(--sv-primary, #5a7fff)) 42%, transparent),
        0 0 0 1px color-mix(in oklab, var(--sv-accent, var(--sv-primary, #5a7fff)) 55%, transparent);*/
  }
  .view-settings {
    /*
     * INVARIANT: only *body-level* tab panels hide. Nested Workspace
     * sections live inside Appearance and must keep painting.
     */
  }
  .view-settings .settings-screen__body > .settings-tab-panel {
    pointer-events: auto;
    touch-action: pan-x pan-y;
    scrollbar-width: none;
    max-inline-size: stretch;
  }
  .view-settings .settings-screen__body > .settings-tab-panel[hidden], .view-settings .settings-screen__body > .settings-tab-panel:not(.is-active) {
    display: none !important;
  }
  .view-settings .settings-screen__body > .settings-tab-panel.is-active:not([hidden]) {
    display: flex !important;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    min-inline-size: 0;
  }
  .view-settings {
    /* ── cards & forms ── */
  }
  .view-settings .card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    inline-size: stretch;
    border: none;
    border-radius: 16px;
    max-inline-size: stretch;
    box-shadow: none;
    /*box-shadow: var(--sv-elev), 0 0 0 1px color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 14%, transparent);*/
    background: var(--sv-surface-2, light-dark(#ffffff, #171c24));
    margin-inline: 0.5rem;
  }
  @container settings-view (max-inline-size: 480px) {
    .view-settings .card {
      padding: 0.75rem;
      border-radius: 12px;
    }
  }
  .view-settings .settings-panel-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    inline-size: stretch;
    max-inline-size: stretch;
  }
  .view-settings .field {
    display: grid;
    grid-auto-flow: row;
    gap: 0.375rem;
    inline-size: stretch;
    font-size: 0.75rem;
    margin: 0;
    pointer-events: auto;
    max-inline-size: stretch;
    margin-block-start: 0.5rem;
  }
  .view-settings .field > span {
    padding-block: 0.25rem;
    padding-block-end: 0px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
  }
  .view-settings .field.checkbox {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0px, max-content) 1fr;
    align-items: center;
    gap: 0.625rem;
    max-inline-size: stretch;
  }
  .view-settings [data-contribution] {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-inline-size: stretch;
    padding: 0.5rem;
    border-radius: 12px;
    background: var(--sv-surface-2, light-dark(#ffffff, #171c24));
    border: 0px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 40%, transparent);
  }
  .view-settings .field-hint {
    margin: 0 0 0.75rem;
    font-size: 0.85em;
    line-height: 1.45;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    opacity: 0.95;
    max-inline-size: stretch;
    padding-inline: 0.25rem;
  }
  .view-settings .appearance-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
  .view-settings .appearance-swatch {
    inline-size: 1.75rem;
    block-size: 1.75rem;
    border-radius: 999px;
    border: 2px solid color-mix(in oklab, var(--sv-fg, #e8edf2) 18%, transparent);
    padding: 0;
    cursor: pointer;
    background: var(--color-primary, #5a9ec8);
  }
  .view-settings .appearance-swatch[aria-selected=true] {
    outline: 2px solid var(--sv-accent, var(--color-primary, #5a9ec8));
    outline-offset: 2px;
  }
  .view-settings .appearance-hue {
    display: grid;
    gap: 0.25rem;
  }
  .view-settings .appearance-hue__range {
    inline-size: 100%;
    accent-color: var(--color-primary, #5a9ec8);
  }
  .view-settings .appearance-color-input {
    inline-size: 3.25rem;
    block-size: 2rem;
    padding: 0.15rem;
  }
  .view-settings .form-input,
  .view-settings .form-select {
    display: block;
    inline-size: 100%;
    min-block-size: 2.5rem;
    padding: 0.5rem 0.65rem;
    border-radius: 10px;
    /*border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 45%, transparent);*/
    background: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    -webkit-text-fill-color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    caret-color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    max-inline-size: stretch;
    border: none 0px transparent;
    outline: none 0px transparent;
    box-shadow: none;
  }
  .view-settings .form-input:focus-visible,
  .view-settings .form-select:focus-visible {
    /*border-color: color-mix(in oklab, var(--sv-primary, #5a7fff) 55%, var(--sv-outline, light-dark(#c5cdd8, #3d4755)));*/
    /*box-shadow: 0 0 0 3px color-mix(in oklab, var(--sv-primary, #5a7fff) 22%, transparent);*/
  }
  .view-settings select.form-select,
  .view-settings select.form-input {
    padding-inline-end: 2rem;
    /*background-image: linear-gradient(45deg, transparent 50%, var(--sv-muted, light-dark(#5c6570, #a8b0bc)) 50%),
        linear-gradient(135deg, var(--sv-muted, light-dark(#5c6570, #a8b0bc)) 50%, transparent 50%);*/
    background-position: calc(100% - 14px) calc(50% - 2px), calc(100% - 9px) calc(50% - 2px);
    background-size: 5px 5px;
    background-repeat: no-repeat;
    pointer-events: auto;
    max-inline-size: stretch;
    background-color: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    border: none 0px transparent;
    outline: none 0px transparent;
    box-shadow: none;
  }
  .view-settings {
    /* ── buttons ── */
  }
  .view-settings .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.5rem 1.125rem;
    min-block-size: 2.5rem;
    border: none;
    border-radius: 999px;
    background: color-mix(in oklab, var(--sv-surface-1, light-dark(#ffffff, #171c24)) 90%, transparent);
    color: var(--sv-fg, var(--color-on-surface));
    color: contrast-color(var(--sv-surface-1, var(--color-surface)));
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.12s ease, filter 0.12s ease;
    /*box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 12%, transparent);*/
    max-inline-size: stretch;
  }
  .view-settings .btn:hover {
    background: color-mix(in oklab, var(--sv-fg, light-dark(#12151a, #e8edf2)) 6%, var(--sv-surface-1, light-dark(#ffffff, #171c24)));
  }
  .view-settings .btn.primary {
    background: var(--sv-accent, var(--sv-primary, #5a7fff));
    color: var(--sv-on-primary);
    color: contrast-color(var(--sv-accent, var(--sv-primary, #5a7fff)));
    /*box-shadow:
        0 2px 16px color-mix(in oklab, var(--sv-accent, var(--sv-primary, #5a7fff)) 40%, transparent),
        0 0 0 1px color-mix(in oklab, var(--sv-accent, var(--sv-primary, #5a7fff)) 55%, transparent);*/
  }
  .view-settings .btn.primary:hover {
    filter: brightness(1.1);
  }
  .view-settings .btn.btn-sm, .view-settings .btn.small {
    padding: 0.35rem 0.65rem;
    min-block-size: 2rem;
    font-size: 0.75rem;
  }
  .view-settings .btn.btn-danger {
    color: var(--sv-on-primary);
    background: color-mix(in oklab, var(--sv-danger, #d32f2f) 92%, #000);
    /*box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-danger, #d32f2f) 35%, transparent);*/
  }
  .view-settings .btn.btn-danger:hover {
    filter: brightness(1.08);
  }
  .view-settings .btn.tiny {
    min-block-size: 2rem;
    padding: 0.3rem 0.5rem;
    font-size: 0.72rem;
  }
  .view-settings .note,
  .view-settings .ext-note {
    font-size: 0.75rem;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    opacity: 0.92;
    flex: 1 1 auto;
    max-inline-size: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  .view-settings .note:empty,
  .view-settings .ext-note:empty {
    display: none;
  }
  .view-settings .note,
  .view-settings .ext-note {
    line-height: 1.35;
    pointer-events: none;
    max-inline-size: stretch;
  }
  .view-settings .note.note--ok,
  .view-settings .ext-note.note--ok {
    color: color-mix(in oklab, var(--color-success, #3ecf8e) 70%, var(--sv-fg, light-dark(#12151a, #e8edf2)));
  }
  .view-settings .note.note--warn,
  .view-settings .ext-note.note--warn {
    color: color-mix(in oklab, var(--color-warning, #e6a700) 75%, var(--sv-fg, light-dark(#12151a, #e8edf2)));
  }
  .view-settings .note.note--err,
  .view-settings .ext-note.note--err {
    color: color-mix(in oklab, var(--color-error, #e05252) 80%, var(--sv-fg, light-dark(#12151a, #e8edf2)));
  }
  .view-settings .ext-note {
    line-height: 1.4;
    max-inline-size: stretch;
  }
  .view-settings .ext-note code {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.68rem;
    background: color-mix(in oklab, var(--sv-surface-1, light-dark(#ffffff, #171c24)) 80%, var(--sv-bg, light-dark(#eef1f6, #0f1318)));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    max-inline-size: stretch;
  }
  .view-settings {
    /* ── checkboxes ── */
  }
  .view-settings .form-checkbox input[type=checkbox],
  .view-settings label.field.checkbox input[type=checkbox] {
    inline-size: 1.15rem;
    block-size: 1.15rem;
    accent-color: var(--sv-accent, var(--sv-primary, #5a7fff));
    flex-shrink: 0;
    max-inline-size: stretch;
  }
  .view-settings {
    /* ── MCP ── */
  }
  .view-settings .mcp-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-inline-size: stretch;
  }
  .view-settings .mcp-actions {
    margin-block-start: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-inline-size: stretch;
  }
  .view-settings .mcp-row {
    display: grid;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 12px;
    background: color-mix(in oklab, var(--sv-surface-1, light-dark(#ffffff, #171c24)) 88%, var(--sv-bg, light-dark(#eef1f6, #0f1318)));
    max-inline-size: stretch;
    /*box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 12%, transparent);*/
  }
  .view-settings .mcp-row .field {
    margin: 0;
    max-inline-size: stretch;
  }
  .view-settings .mcp-empty-note {
    margin: 0;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    font-size: 0.75rem;
    max-inline-size: stretch;
  }
  .view-settings {
    /* ── spoiler / details ── */
  }
  .view-settings .settings-spoiler {
    border-radius: 12px;
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 22%, transparent);
    background: color-mix(in oklab, var(--sv-surface-1, light-dark(#ffffff, #171c24)) 55%, transparent);
    padding: 0.25rem 0.5rem;
    max-inline-size: stretch;
  }
  .view-settings .settings-spoiler summary {
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.35rem 0.25rem;
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    max-inline-size: stretch;
  }
  .view-settings .settings-spoiler .settings-panel-form {
    padding-block-end: 0.25rem;
    max-inline-size: stretch;
  }
  .view-settings {
    /* ── legacy / demo shell (index.ts) ── */
  }
  .view-settings .view-settings__content {
    inline-size: 100%;
    max-inline-size: min(clamp(640px, 90%, 800px), 100%);
  }
  .view-settings .view-settings__section {
    display: flex;
    flex-direction: column;
    margin-block-end: 2rem;
    padding-block-end: 2rem;
    border-block-end: 1px solid var(--sv-divider);
    max-inline-size: stretch;
  }
  .view-settings .view-settings__section:last-of-type {
    border-block-end: none;
  }
  .view-settings .view-settings__group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-inline-size: stretch;
  }
  .view-settings .view-settings__label {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    max-inline-size: stretch;
  }
  .view-settings .view-settings__label > span {
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .view-settings .view-settings__select,
  .view-settings .view-settings__input {
    min-block-size: 2.5rem;
    padding: 0.45rem 0.6rem;
    border-radius: 10px;
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 45%, transparent);
    background: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    font-size: 0.875rem;
    max-inline-size: stretch;
    border: none 0px transparent;
    outline: none 0px transparent;
    box-shadow: none;
  }
  .view-settings .view-settings__checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    max-inline-size: stretch;
  }
  .view-settings .view-settings__actions {
    display: flex;
    gap: 0.75rem;
    margin-block-start: 1.5rem;
    max-inline-size: stretch;
  }
  .view-settings .view-settings__btn {
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    border: 0px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 40%, transparent);
    background: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    cursor: pointer;
    max-inline-size: stretch;
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    color: contrast-color(var(--sv-surface-1, var(--color-surface)));
  }
  .view-settings .view-settings__btn--primary {
    background: var(--sv-accent, var(--sv-primary, #5a7fff));
    border-color: color-mix(in oklab, var(--sv-accent, var(--sv-primary, #5a7fff)) 35%, transparent);
    color: var(--sv-on-primary);
    color: contrast-color(var(--sv-accent, var(--sv-primary, #5a7fff)));
  }
  .view-settings .view-settings__btn--primary:hover {
    filter: brightness(1.1);
  }
  .view-settings {
    /* ── custom instructions (panel + editor variants) ── */
  }
  .view-settings .custom-instructions-panel,
  .view-settings .custom-instructions-editor {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-select-row,
  .view-settings .ci-row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    max-inline-size: stretch;
  }
  .view-settings .ci-header {
    margin-block-end: 0.25rem;
    max-inline-size: stretch;
  }
  .view-settings .ci-header h4 {
    margin: 0 0 0.25rem;
    font-size: 0.88rem;
  }
  .view-settings .ci-desc {
    margin: 0;
    font-size: 0.78rem;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    line-height: 1.45;
    max-inline-size: stretch;
  }
  .view-settings .ci-active-select {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-inline-size: stretch;
  }
  .view-settings .ci-select,
  .view-settings .cip-select {
    min-block-size: 2.35rem;
    padding: 0.4rem 0.55rem;
    border-radius: 10px;
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 40%, transparent);
    background: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    font-size: 0.8rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-list,
  .view-settings .ci-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-item,
  .view-settings .ci-item {
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
    background: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 16%, transparent);
    max-inline-size: stretch;
  }
  .view-settings .cip-item.is-active, .view-settings .cip-item.active,
  .view-settings .ci-item.is-active,
  .view-settings .ci-item.active {
    border-color: color-mix(in oklab, var(--sv-primary, #5a7fff) 35%, transparent);
    /*box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-primary, #5a7fff) 18%, transparent);*/
  }
  .view-settings .cip-item-header,
  .view-settings .ci-item-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-item-label,
  .view-settings .ci-item-label {
    font-weight: 600;
    font-size: 0.8rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-item-actions,
  .view-settings .ci-item-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: start;
    max-inline-size: stretch;
  }
  .view-settings .cip-badge,
  .view-settings .ci-badge {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
    border-radius: 999px;
    background: color-mix(in oklab, var(--sv-primary, #5a7fff) 16%, transparent);
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    max-inline-size: stretch;
  }
  .view-settings .cip-item-preview,
  .view-settings .ci-item-preview {
    font-size: 0.75rem;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    margin-block-start: 0.35rem;
    line-height: 1.45;
    max-inline-size: stretch;
  }
  .view-settings .cip-edit-form,
  .view-settings .ci-edit-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block-start: 0.5rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-form-actions,
  .view-settings .cip-toolbar,
  .view-settings .ci-actions,
  .view-settings .ci-add-actions,
  .view-settings .ci-edit-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    max-inline-size: stretch;
  }
  .view-settings .cip-input,
  .view-settings .cip-textarea,
  .view-settings .ci-input,
  .view-settings .ci-textarea,
  .view-settings .field-control {
    inline-size: 100%;
    border-radius: 10px;
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 40%, transparent);
    background: var(--sv-surface-1, light-dark(#ffffff, #171c24));
    color: var(--sv-fg, light-dark(#12151a, #e8edf2));
    padding: 0.45rem 0.55rem;
    font-size: 0.8125rem;
    max-inline-size: stretch;
    border: none 0px transparent;
    outline: none 0px transparent;
    box-shadow: none;
  }
  .view-settings .cip-textarea,
  .view-settings .ci-textarea {
    min-block-size: 5rem;
    max-inline-size: stretch;
  }
  .view-settings .cip-empty,
  .view-settings .ci-empty {
    font-size: 0.8rem;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    padding: 0.75rem;
    text-align: center;
    max-inline-size: stretch;
  }
  .view-settings .field-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    text-transform: uppercase;
    letter-spacing: 0.04em;
    max-inline-size: stretch;
  }
  .view-settings input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .view-settings input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .view-settings {
    /* ── touch targets & responsive footer ── */
  }
  @container settings-view (max-inline-size: 1024px) {
    .view-settings {
      padding: 0.65rem;
      max-inline-size: stretch;
    }
  }
  @container settings-view (max-inline-size: 560px) {
    .view-settings .settings-tab-actions {
      gap: 0.3rem;
      max-inline-size: stretch;
    }
    .view-settings .settings-tab-btn {
      min-block-size: 2.65rem;
      padding-inline: 0.7rem;
      max-inline-size: stretch;
    }
  }
  @container settings-view (max-inline-size: 480px) {
    .view-settings {
      padding: 0.45rem;
      padding-block-end: 0.15rem;
    }
    .view-settings .settings-screen__title {
      display: none;
      max-inline-size: stretch;
    }
    .view-settings .settings-screen__body {
      padding-block: 0.5rem;
      gap: 0.75rem;
      max-inline-size: stretch;
    }
    .view-settings .settings-screen__footer {
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 0.35rem;
      max-inline-size: stretch;
      padding-block: 0.5rem;
      /* WHY: window is full-bleed; leave the Home FAB corner free. */
      padding-inline: 0.5rem;
      padding-inline-end: 3.25rem;
    }
    .view-settings .settings-screen__footer .btn.primary {
      inline-size: 100%;
      justify-content: center;
      min-block-size: 2.75rem;
      max-inline-size: stretch;
    }
    .view-settings .settings-screen__footer .note {
      white-space: normal;
      text-align: center;
      max-inline-size: stretch;
    }
  }
}`);t.trim()||(t=gt);let n=document.createElement(`style`);n.setAttribute(N,``),n.textContent=t,document.head?.appendChild(n)},vt=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}_t(e)};e.isConnected?_t(e):requestAnimationFrame(t)}})))()}function yt(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var bt,F;function xt(){return(xt=e((()=>{bt={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`},F=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}},new F(`rs-workcenter`,`data`),new F(`rs-history`,`entries`),new F(`rs-settings`,`config`)})))()}function St(){return(St=e((()=>{xt()})))()}function Ct(e){m();let t=String(e.view||``).trim().replace(/^\/+/,``).toLowerCase();if(o(t))return i(t)||`/${t}`;let n={...e.params||{}},r;if(t===`settings`){let e=et(qe(String(n.section||``).trim()));delete n.section,r=d(e?`/settings/${e}`:`/settings`)}else r=d(t&&t!==`home`?p(`/${t}`):`/`);let a=r;if(Object.keys(n).length>0){let e=new URLSearchParams(n).toString();a+=(a.includes(`?`)?`&`:`?`)+e}return a}function I(e,t={}){let n=Ct(e);if(o(e.view)||/^https?:\/\//i.test(n)){globalThis.location.assign(n);return}t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function wt(e,t){I({view:e,params:t})}function Tt(){return(Tt=e((()=>{ie(),x(),r(),h(),f(),Ue(),[...b],y(`home`,_)})))()}function Et(){return(Et=e((()=>{})))()}function Dt(){return(Dt=e((()=>{Xe(),g(),ft(),Tt(),ie(),Et()})))()}var Ot,kt,At,jt,Mt,L,Nt,R,z,Pt;function Ft(){return(Ft=e((()=>{Ot=[`en`,`ru`,`en-GB`,`en-US`],kt=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,At=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},jt=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=At(n);t&&e.add(t)}for(let t of Ot)e.add(t);return Array.from(e)},Mt=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},L=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},Nt=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},R=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},z=(e,t)=>e?!!e.checked:t,Pt=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})))()}var It,Lt,Rt;function zt(){return(zt=e((()=>{E(),It=e=>{let t={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return D`<div class="field mcp-row" data-mcp-id=${t.id}>
            <label class="field">
              <span>Server Label</span>
              <input class="form-input" type="text" data-mcp-field="serverLabel" autocomplete="off" value="${t.serverLabel}" />
            </label>
            <label class="field">
              <span>Origin</span>
              <input class="form-input" type="url" data-mcp-field="origin" autocomplete="off" placeholder="https://server.example" value="${t.origin}" />
            </label>
            <label class="field">
              <span>Client Key</span>
              <input class="form-input" type="text" data-mcp-field="clientKey" autocomplete="off" value="${t.clientKey}" />
            </label>
            <label class="field">
              <span>Secret Key</span>
              <input class="form-input" type="password" data-mcp-field="secretKey" autocomplete="off" placeholder="sk-..." value="${t.secretKey}" />
            </label>
            <button class="btn btn-danger" type="button" data-action="remove-mcp-server">Remove</button>
          </div>`},Lt=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},Rt=(e,t)=>{if(!e)return;e.replaceChildren();let n=Array.isArray(t)?t:[];if(!n.length){e.appendChild(D`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}n.forEach(t=>e.appendChild(It(t)))}})))()}var Bt;function Vt(){return(Vt=e((()=>{E(),Bt=()=>D`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})))()}var Ht;function Ut(){return(Ut=e((()=>{E(),Ht=()=>D`<header class="settings-screen__top">
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`})))()}var Wt,Gt,B,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t;function en(){return(en=e((()=>{E(),O(),Wt=[{hex:Te,label:`Cyan`},{hex:`#4f8eb5`,label:`Steel`},{hex:`#64748b`,label:`Slate`},{hex:`#3b82f6`,label:`Blue`},{hex:`#6366f1`,label:`Indigo`},{hex:`#14b8a6`,label:`Teal`},{hex:`#22c55e`,label:`Green`},{hex:`#f59e0b`,label:`Amber`},{hex:`#ef4444`,label:`Red`},{hex:`#ec4899`,label:`Pink`},{hex:`#8b5cf6`,label:`Violet`}],Gt={wallpaper:`From wallpaper`,"material-you":`From Material You`,"system-wallpaper":`From system wallpaper`,"speed-dial":`From Speed Dial wallpaper`,custom:`Custom hue`},B=(e,t)=>{if(e===`auto`)return`Auto (${Gt[t]})`;let n=Gt[e];return e===t?`${n} (default)`:n},Kt=()=>{let e=Ee();return D`<section class="card settings-tab-panel" data-tab-panel="appearance">
      <h3>Appearance</h3>
      <p class="field-hint">Theme, type size, and where the adaptive base color comes from. Auto picks the default for this app.</p>
      <label class="field">
        <span>Theme</span>
        <select class="form-select" data-field="appearance.theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>
      <label class="field">
        <span>Font Size</span>
        <select class="form-select" data-field="appearance.fontSize">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
      <div class="field appearance-base-color" data-appearance-color>
        <label class="field">
          <span>Base color</span>
          <select class="form-select" data-field="appearance.colorSource">
            <option value="auto">${B(`auto`,e)}</option>
            <option value="wallpaper">${B(`wallpaper`,e)}</option>
            <option value="material-you">${B(`material-you`,e)}</option>
            <option value="system-wallpaper">${B(`system-wallpaper`,e)}</option>
            <option value="speed-dial">${B(`speed-dial`,e)}</option>
            <option value="custom">${B(`custom`,e)}</option>
          </select>
        </label>
        <span class="field-hint" data-appearance-source-hint></span>
        <div class="appearance-custom" data-appearance-custom hidden>
          <span>Accent / hue</span>
          <div class="appearance-swatches" role="listbox" aria-label="Accent color">
            ${Wt.map(e=>D`<button type="button" class="appearance-swatch" data-color="${e.hex}" title="${e.label}" aria-label="${e.label}" style="background:${e.hex}"></button>`)}
          </div>
          <label class="appearance-hue">
            <span>Hue</span>
            <input class="appearance-hue__range" type="range" min="0" max="360" value="200" data-field="appearance.hue" />
          </label>
          <input class="form-input appearance-color-input" type="color" data-field="appearance.color" value="${Te}" />
        </div>
      </div>
    </section>`},qt={auto:`Uses this app’s default source.`,wallpaper:`Dominant color from the launcher / environment wallpaper.`,"material-you":`Android Material You system accent.`,"system-wallpaper":`Dominant color from the OS desktop wallpaper.`,"speed-dial":`Dominant color from the Speed Dial wallpaper.`,custom:`Manual swatch, hue, or color picker.`},Jt=e=>{let t=A(e);if(!t)return 200;let n=parseInt(t.slice(1,3),16)/255,r=parseInt(t.slice(3,5),16)/255,i=parseInt(t.slice(5,7),16)/255,a=Math.max(n,r,i),o=a-Math.min(n,r,i);if(o<1e-4)return 200;let s=0;return s=a===n?(r-i)/o%6:a===r?(i-n)/o+2:(n-r)/o+4,s=Math.round(s*60),s<0?s+360:s},Yt=e=>{let t=(Number(e)%360+360)%360,n=e=>{let n=(e+t/30)%12,r=.57-.1806*Math.max(Math.min(n-3,9-n,1),-1);return Math.round(255*r).toString(16).padStart(2,`0`)};return`#${n(0)}${n(8)}${n(4)}`},Xt=e=>{let t=e.querySelector(`[data-field="appearance.colorSource"]`);return Ce(t?.value)?t.value:`auto`},Zt=(e,t)=>{let n=e.querySelector(`[data-field="appearance.colorSource"]`),r=e.querySelector(`[data-appearance-custom]`),i=e.querySelector(`[data-appearance-source-hint]`),a=Ce(t)?t:`auto`;n&&(n.value=a),r&&(r.hidden=a!==`custom`),i&&(i.textContent=qt[a])},Qt=(e,t)=>{let n=e.querySelector(`[data-field="appearance.color"]`),r=e.querySelector(`[data-field="appearance.hue"]`),i=A(t)||`#5a9ec8`;n&&(n.value=i),r&&(r.value=String(Jt(i))),e.querySelectorAll(`.appearance-swatch`).forEach(e=>{e.setAttribute(`aria-selected`,A(e.dataset.color)===i?`true`:`false`)})},$t=e=>{let t=e.querySelector(`[data-field="appearance.color"]`);return A(t?.value)}})))()}var tn;function nn(){return(nn=e((()=>{E(),tn=()=>D`<section class="card settings-tab-panel" data-tab-panel="markdown">
      <h3>Markdown Viewer</h3>
      <label class="field">
        <span>Style preset</span>
        <select class="form-select" data-field="appearance.markdown.preset">
          <option value="default">Default</option>
          <option value="classic">Classic</option>
          <option value="compact">Compact</option>
          <option value="paper">Paper</option>
        </select>
      </label>
      <label class="field">
        <span>Font family</span>
        <select class="form-select" data-field="appearance.markdown.fontFamily">
          <option value="system">System UI</option>
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </label>
      <label class="field">
        <span>Font size (px)</span>
        <input class="form-input" type="number" inputmode="numeric" min="12" max="26" step="1" data-field="appearance.markdown.fontSizePx" />
      </label>
      <label class="field">
        <span>Line height</span>
        <input class="form-input" type="number" inputmode="decimal" min="1.1" max="2.2" step="0.05" data-field="appearance.markdown.lineHeight" />
      </label>
      <label class="field">
        <span>Content max width (px)</span>
        <input class="form-input" type="number" inputmode="numeric" min="500" max="1400" step="10" data-field="appearance.markdown.contentMaxWidthPx" />
      </label>
      <label class="field">
        <span>Print scale</span>
        <input class="form-input" type="number" inputmode="decimal" min="0.5" max="1.5" step="0.05" data-field="appearance.markdown.printScale" />
      </label>
      <label class="field">
        <span>Page size</span>
        <select class="form-select" data-field="appearance.markdown.page.size">
          <option value="auto">Auto</option>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
          <option value="A5">A5</option>
        </select>
      </label>
      <label class="field">
        <span>Page orientation</span>
        <select class="form-select" data-field="appearance.markdown.page.orientation">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>
      <label class="field">
        <span>Page margins (mm)</span>
        <input class="form-input" type="number" inputmode="numeric" min="5" max="40" step="1" data-field="appearance.markdown.page.marginMm" />
      </label>
      <h4>Style modules</h4>
      <p class="field-hint" style="margin: 0 0 0.5rem; opacity: 0.85; font-size: 0.9em;">Grouped by what they affect in the viewer. All are on by default.</p>
      <fieldset class="field-group" style="border: 0; padding: 0; margin: 0 0 1rem;">
        <legend class="field" style="font-weight: 600; margin-bottom: 0.35rem;">Type &amp; layout</legend>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.typography" />
          <span>Typography (paragraphs, headings)</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.lists" />
          <span>Lists (bullets &amp; numbering)</span>
        </label>
      </fieldset>
      <fieldset class="field-group" style="border: 0; padding: 0; margin: 0 0 1rem;">
        <legend class="field" style="font-weight: 600; margin-bottom: 0.35rem;">Blocks &amp; media</legend>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.tables" />
          <span>Tables</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.codeBlocks" />
          <span>Code blocks</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.blockquotes" />
          <span>Blockquotes</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.media" />
          <span>Images &amp; video</span>
        </label>
      </fieldset>
      <fieldset class="field-group" style="border: 0; padding: 0; margin: 0 0 1rem;">
        <legend class="field" style="font-weight: 600; margin-bottom: 0.35rem;">Print</legend>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.printBreaks" />
          <span>Print breaks (avoid splits inside headings, tables, …)</span>
        </label>
      </fieldset>
      <h4>Rendering plugins</h4>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="appearance.markdown.plugins.smartTypography" />
        <span>Smart typography</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="appearance.markdown.plugins.softBreaksAsBr" />
        <span>Soft line breaks as BR</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="appearance.markdown.plugins.externalLinksNewTab" />
        <span>Open external links in new tab</span>
      </label>
      <label class="field">
        <span>Custom CSS (screen/view)</span>
        <textarea class="form-input" rows="8" data-field="appearance.markdown.customCss" placeholder=".markdown-viewer-content h1 { color: var(--color-primary); }"></textarea>
      </label>
      <label class="field">
        <span>Custom CSS (print only)</span>
        <textarea class="form-input" rows="8" data-field="appearance.markdown.printCss" placeholder=".markdown-viewer-content { font-size: 12pt; line-height: 1.5; }"></textarea>
      </label>
      <label class="field">
        <span>Markdown extensions (JSON rules)</span>
        <textarea class="form-input" rows="10" data-field="appearance.markdown.extensions" placeholder='[
  {
    "id": "highlight",
    "pattern": "==(.+?)==",
    "replacement": "<mark>$1</mark>",
    "flags": "g",
    "enabled": true
  }
]'></textarea>
      </label>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="open-user-styles">Open <code>/user/styles/</code> in Explorer</button>
        <button class="btn" type="button" data-action="open-assets-readonly">Open <code>/assets/</code> (read-only) in Explorer</button>
      </div>
      <p class="mcp-empty-note">Rules are regex replacements applied before markdown parsing. Invalid JSON is rejected on save. Custom CSS supports explicit <code>@layer</code> blocks for advanced interop.</p>
    </section>`})))()}var rn;function an(){return(an=e((()=>{E(),rn=()=>D`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
      <h3>AI</h3>
      <form class="settings-panel-form" novalidate onsubmit="return false">
      <label class="field">
        <span>Base URL</span>
        <input placeholder="https://api.proxyapi.ru/openai/v1" class="form-input" type="url" inputmode="url" autocomplete="off" data-field="ai.baseUrl" />
      </label>
      <label class="field">
        <span>API Key</span>
        <input placeholder="sk-..." class="form-input" type="password" autocomplete="off" data-field="ai.apiKey"/>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ui.showKey" />
        <span>Show API key</span>
      </label>
      <label class="field">
        <span>Model</span>
        <select class="form-select" data-field="ai.model"></select>
      </label>
      <label class="field" data-field-group="ai.customModel">
        <span>Custom model identifier</span>
        <input placeholder="provider/model-or-id" class="form-input" type="text" autocomplete="off" data-field="ai.customModel"/>
      </label>
      <label class="field">
        <span>Default reasoning effort</span>
        <select class="form-select" data-field="ai.defaultReasoningEffort">
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
      </label>
      <details class="settings-spoiler" data-advanced-ai-spoiler>
        <summary>Advanced AI settings</summary>
        <div>
          
          <label class="field">
            <span>Default verbosity</span>
            <select class="form-select" data-field="ai.defaultVerbosity">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label class="field">
            <span>Max output tokens</span>
            <input placeholder="400000" class="form-input" type="number" inputmode="numeric" data-field="ai.maxOutputTokens" />
          </label>
          <label class="field">
            <span>Context truncation</span>
            <select class="form-select" data-field="ai.contextTruncation">
              <option value="disabled">Disabled</option>
              <option value="auto">Auto</option>
            </select>
          </label>
          <label class="field">
            <span>Prompt cache retention</span>
            <select class="form-select" data-field="ai.promptCacheRetention">
              <option value="in-memory">In-memory</option>
              <option value="24h">24h</option>
            </select>
          </label>
          <label class="field">
            <span>Max tool calls</span>
            <input placeholder="8" class="form-input" type="number" inputmode="numeric" data-field="ai.maxToolCalls" />
          </label>
          <label class="field checkbox form-checkbox">
            <input type="checkbox" data-field="ai.parallelToolCalls" />
            <span>Allow parallel tool calls</span>
          </label>
          <label class="field">
            <span>Timeout low (ms)</span>
            <input placeholder="60000" class="form-input" type="number" inputmode="numeric" data-field="ai.requestTimeout.low" />
          </label>
          <label class="field">
            <span>Timeout medium (ms)</span>
            <input placeholder="300000" class="form-input" type="number" inputmode="numeric" data-field="ai.requestTimeout.medium" />
          </label>
          <label class="field">
            <span>Timeout high (ms)</span>
            <input placeholder="900000" class="form-input" type="number" inputmode="numeric" data-field="ai.requestTimeout.high" />
          </label>
          <label class="field">
            <span>Max retries</span>
            <input placeholder="2" class="form-input" type="number" inputmode="numeric" data-field="ai.maxRetries" />
          </label>
        </div>
      </details>
      <label class="field">
        <span>Share target mode</span>
        <select class="form-select" data-field="ai.shareTargetMode">
          <option value="recognize">Recognize and copy</option>
          <option value="analyze">Analyze and store</option>
        </select>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ai.autoProcessShared" />
        <span>Auto AI on Share Target / File Open (and copy to clipboard)</span>
      </label>
      <label class="field">
        <span>Response language</span>
        <select class="form-select" data-field="ai.responseLanguage"></select>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ai.translateResults" />
        <span>Translate results</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ai.generateSvgGraphics" />
        <span>Generate SVG graphics</span>
      </label>
      <label class="field">
        <span>Speech Recognition language</span>
        <select class="form-select" data-field="speech.language"></select>
      </label>
      </form>
    </section>`})))()}var on;function sn(){return(sn=e((()=>{E(),on=()=>D`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})))()}var cn;function V(){return(V=e((()=>{E(),cn=()=>D`<section class="card settings-tab-panel" data-tab-panel="server">
      <h3>Server</h3>
      <p class="field-hint" style="margin: 0 0 0.75rem; opacity: 0.88; font-size: 0.9em;">
        Connect to the hub with server URL, short client id (L-196), and one ecosystem token.
      </p>
      <h4>Endpoint and identity</h4>
      <form class="settings-panel-form" novalidate onsubmit="return false">
      <label class="field">
        <span>Server URL</span>
        <input class="form-input" type="text" inputmode="url" autocomplete="off" placeholder="45.147.121.152 or 192.168.0.200" data-field="core.endpointUrl" />
      </label>
      <p class="field-hint">IP or domain only — port and protocol are auto-discovered (8434, 443, 8080, …). Use gateway for phone↔phone even on LAN.</p>
      <label class="field">
        <span>Associated device / client ID</span>
        <input class="form-input" type="text" autocomplete="off" data-field="core.userId" placeholder="L-196" />
      </label>
      <label class="field">
        <span>Ecosystem token</span>
        <input class="form-input" type="password" autocomplete="off" data-field="core.ecosystemToken" placeholder="Shared ecosystem key" />
      </label>
      <p class="field-hint">Replaces separate identification and control / access tokens — one key for the whole CWSP ecosystem.</p>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.allowInsecureTls" />
        <span>Allow self-signed / insecure TLS</span>
      </label>
      </form>
    </section>`})))()}var ln;function un(){return(un=e((()=>{E(),be(),dt(),w(),ln=(e={})=>{let t=xe({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),n=D`<div class="custom-instructions-editor">
        <div class="ci-row">
            <div class="ci-header">
                <h4>Custom Instructions</h4>
                <p class="ci-desc">Define custom instructions for AI operations. These can be activated for "Recognize & Copy" and selected in the Work Center.</p>
            </div>

            <div class="ci-active-select">
                <label>
                    <span>Active instruction:</span>
                    <select class="ci-select" data-action="select-active">
                        <option value="">None (use default)</option>
                    </select>
                </label>
            </div>
        </div>

        <div class="ci-list" data-list></div>

        <div class="ci-add-form" data-add-form hidden>
            <input type="text" class="ci-input" data-field="label" placeholder="Instruction label..." />
            <textarea class="ci-textarea" data-field="instruction" placeholder="Enter your custom instruction..." rows="4"></textarea>
            <div class="ci-add-actions">
                <button class="btn small primary" type="button" data-action="save-new">Add</button>
                <button class="btn small" type="button" data-action="cancel-add">Cancel</button>
            </div>
        </div>

        <div class="ci-actions">
            <button class="btn small" type="button" data-action="add">+ Add Instruction</button>
            <button class="btn small" type="button" data-action="add-templates">Add Templates</button>
        </div>
    </div>`,r=n.querySelector(`[data-list]`),i=n.querySelector(`[data-action='select-active']`),a=n.querySelector(`[data-add-form]`),o=n.querySelector(`[data-field='label']`),s=n.querySelector(`[data-field='instruction']`),c=()=>{r.replaceChildren();let n=t.instructions??[];if(!n.length){r.append(D`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of n){let n=t.editingId===i.id,a=t.activeId===i.id,o=D`<div class="ci-item ${a?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${a?D`<span class="ci-badge active">Active</span>`:D`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${n?D`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:D`<div class="ci-item-preview">${u(i.instruction,120)}</div>`}
            </div>`;o.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&at(i.id).then(d).then(()=>e.onUpdate?.()),r===`edit`&&(t.editingId=i.id,c()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&ot(i.id).then(d).then(()=>e.onUpdate?.()),r===`save-edit`){let n=o.querySelector(`[data-edit-field='label']`),r=o.querySelector(`[data-edit-field='instruction']`);st(i.id,{label:n.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(t.editingId=null,d())).then(()=>e.onUpdate?.())}r===`cancel-edit`&&(t.editingId=null,c())}),r.append(o)}},l=()=>{i.replaceChildren(),i.append(D`<option value="">None (use default)</option>`);for(let e of t.instructions??[]){let n=D`<option value="${e.id}">${e.label}</option>`;e.id===t.activeId&&(n.selected=!0),i.append(n)}},u=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,d=async()=>{let e=await lt(),n=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;t.instructions=n?.instructions??[],t.activeId=n?.activeId??``,c(),l()};return n.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(t.isAdding=!0,a.hidden=!1,o.value=``,s.value=``,o.focus()),r===`cancel-add`&&(t.isAdding=!1,a.hidden=!0),r===`save-new`){let n=o.value.trim(),r=s.value.trim();if(!r){s.focus();return}ct(n||`Custom`,r).then(e=>{if(e)return t.isAdding=!1,a.hidden=!0,d()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let n=new Set((t.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=ee.filter(e=>!n.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}ut(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(d).then(()=>e.onUpdate?.())}}),i.addEventListener(`change`,()=>{let t=i.value||``;at(t||null).then(d).then(()=>e.onUpdate?.())}),d(),n}})))()}var dn;function H(){return(H=e((()=>{E(),un(),dn=e=>D`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${ln({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})))()}var fn;function pn(){return(pn=e((()=>{E(),fn=()=>D`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field">
        <span>Local hub URL (Neutralino / desk backend)</span>
        <input class="form-input" type="text" inputmode="url" autocomplete="off" placeholder="https://127.0.0.1:8434/" data-field="shell.localHubUrl" />
      </label>
      <p class="field-hint">Chrome wire hub for L-110-crx only. Independent from CWSP → Relay / gateway.</p>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (CWSP-shell speed dial)</span>
      </label>
    </section>`})))()}var U,W,mn,hn,gn,_n,vn,yn;function G(){return(G=e((()=>{U=new Map,W=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return U.set(t,n),()=>{U.get(t)===n&&U.delete(t)}},mn=()=>[...U.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),hn=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},gn=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},_n=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},vn=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=hn(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},yn=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=_n(e);r!==void 0&&gn(n,t,r)})}})))()}var K,bn,q,xn,J,Y,X,Z,Sn,Cn;function wn(){return(wn=e((()=>{K=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},bn=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},q=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},xn=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},J=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},Y=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},X=(e,t,n)=>{let r=document.createElement(`button`);return r.type=`button`,r.className=n?.className||(n?.primary?`view-settings__btn view-settings__btn--primary`:`view-settings__btn`),r.setAttribute(`data-action`,t),r.textContent=e,r},Z=(...e)=>{let t=document.createElement(`div`);t.className=`field settings-action-row`,t.style.display=`flex`,t.style.flexWrap=`wrap`,t.style.gap=`0.5rem`;for(let n of e)t.appendChild(n);return t},Sn=(e,t,n)=>{let r=document.createElement(`div`);r.className=`field settings-secret-field`,r.setAttribute(`data-secret-field`,t);let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`div`);a.style.cssText=`display:flex;gap:.4rem;align-items:center;margin-top:.3rem;`;let o=document.createElement(`input`);o.className=`form-input`,o.type=`password`,o.readOnly=!0,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=n?.placeholder||`••••••`,o.setAttribute(`data-${t}`,`1`),o.setAttribute(`data-secret-input`,t),o.value=``,n?.mono?(o.style.fontFamily=`ui-monospace, SFMono-Regular, Menlo, monospace`,o.style.fontSize=`0.9rem`,o.style.letterSpacing=`0.04em`):(o.style.fontSize=`1.15rem`,o.style.fontWeight=`700`,o.style.letterSpacing=`0.12em`),o.style.flex=`1 1 auto`,o.style.minWidth=`0`;let s=document.createElement(`button`);s.type=`button`,s.className=`view-settings__btn`,s.textContent=`View`,s.title=`Show / hide`,s.setAttribute(`data-action`,`control-secret-toggle`),s.setAttribute(`data-secret-for`,t);let c=document.createElement(`button`);c.type=`button`,c.className=`view-settings__btn`,c.textContent=`Copy`,c.title=`Copy to clipboard`,c.setAttribute(`data-action`,`control-secret-copy`),c.setAttribute(`data-secret-for`,t);let l=document.createElement(`p`);l.className=`field-hint`,l.setAttribute(`data-secret-meta`,t),l.style.margin=`0.2rem 0 0`,l.textContent=``;let u=()=>{let e=o.dataset.revealed===`1`;o.type=e?`text`:`password`,s.textContent=e?`Hide`:`View`};return s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),o.dataset.revealed=o.dataset.revealed===`1`?`0`:`1`,u()}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=String(o.value||``).trim();if(t)try{await navigator.clipboard.writeText(t);let e=c.textContent;c.textContent=`Copied`,window.setTimeout(()=>{c.textContent=e||`Copy`},1200)}catch{o.type=`text`,o.select();try{document.execCommand(`copy`)}catch{}u()}}),a.append(o,s,c),r.append(i,a,l),r},Cn=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(bn(e)):r.appendChild(e);return r}})))()}var Tn,En,Dn;function On(){return(On=e((()=>{G(),r(),wn(),Tn=e=>e.sku||s(),En=e=>{let t=Tn(e),n=t?a(t):``,r=document.createElement(`p`);r.className=`field-hint`,r.setAttribute(`data-apk-local-version`,`1`),r.textContent=`Installed version: … (tap Check to refresh)`;let i=s()===`launcher`&&t&&t!==`launcher`?t===`transfer`?"Updates CWSP-transfer (`latest.json` / space.u2re.cwsp). Needs ecosystem token.":`Updates the installed ${t} APK (${n||`channel`}).`:t===`launcher`?`This launcher APK reads latest-launcher.json. Sibling apps update from their own section when installed.`:t===`transfer`?`This hub APK reads latest.json (ecosystem token). Other SKUs are not installed from here.`:n?`This app reads ${n} for its own APK only.`:`Checks the gateway release that matches this installed package.`;return[`App update (dev)`,r,Y(`Update source`,`shell.apkUpdateSource`,[[`wan`,`WAN — https://45.147.121.152:8434`],[`lan`,`LAN — https://192.168.0.200:8434`],[`relay`,`Current Relay (core.endpointUrl)`]]),Z(X(`Check for update`,`apk-update-check`),X(`Download & install`,`apk-update-install`,{primary:!0})),K(i)]},Dn=()=>W({id:`apk-update`,label:`Updates`,order:90,surfaces:[`capacitor`,`native`,`environment`],render:e=>Cn(`apk-update`,`Updates`,En(e)),load:(e,t)=>{let n=t.querySelector(`[data-field="shell.apkUpdateSource"]`);if(n){let t=String(e.shell?.apkUpdateSource||`wan`).trim();n.value=t===`lan`||t===`relay`?t:`wan`}}})})))()}var kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Bn,Vn;function Hn(){return(Hn=e((()=>{G(),le(),wn(),S(),kn=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,An=`L-110`,jn=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),Mn=(...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!jn(e))return e}return An},Nn=e=>{let t=e.surface===`crx`||!!e.isExtension,n=[K(t?`CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field.`:`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,q(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434;https://45.147.121.152:8434`),K(t?`Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control).`:"Coordinator / gateway. Multi-hub: separate with `;` or `,` (never `:`). Always include :8434 — bare host dials :443 where /ws is not served (404)."),q(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),K(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`)];return t?n.push(q(`Client id (Neutralino / backend)`,`shell.clientId`,`L-110`),K(`Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx).`)):n.push(q(`Client id`,`core.userId`,`L-196 or L-110`),K(`Short fleet id (L-196, L-210, …).`)),n.push(q(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),K(t?`Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login).`:`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),q(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),K(kn),J(`Allow insecure TLS`,`core.allowInsecureTls`)),n},Pn=()=>[`Clipboard`,J(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),J(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),q(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),K(kn),q(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),K(kn),`Clipboard prompt`,Y(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),Y(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),J(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),J(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),xn(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),K(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],Fn=e=>{let t=[`Files transfer`,K("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),J(`Accept inbound files`,`shell.acceptInboundFilesData`),q(`Default destination ids`,`shell.filesShareDestinationIds`,`L-196;L-210 (empty = picker)`),K(kn),J(`Allow share to all (*)`,`shell.filesAllowShareToAll`),K(`SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out.`),Y(`Open for share`,`shell.filesOpenForShareMode`,[[`auto`,`Auto — offer when destinations are set`],[`manual`,`Manual — always ask for destinations`]]),Y(`Inbound accept`,`shell.filesInboundMode`,[[`ask`,`Ask — Accept / Decline prompt`],[`auto`,`Auto — accept into landing folder`]]),J(`Copy received files to clipboard (for Paste / re-share)`,`shell.filesCopyOnReceive`),K(`Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default.`),Y(`Byte transport hint`,`shell.filesByteTransport`,[[`auto`,`Auto — receiver chooses`],[`http`,`HTTP blob GET/PUT`],[`ws`,`WebSocket chunks`]]),K(`Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.`)];if(e.surface===`capacitor`||e.surface===`native`){let e=document.createElement(`p`);e.className=`field-hint`,e.setAttribute(`data-files-saf-uri`,`1`),e.textContent=`SAF folder: (not set)`;let n=document.createElement(`p`);n.className=`field-hint`,n.setAttribute(`data-files-storage-paths`,`1`),n.style.whiteSpace=`pre-wrap`,n.textContent=`Staging / landing paths: tap Show paths.`,t.push(`Files storage (Capacitor)`,Y(`Save received files to`,`shell.filesLandingMode`,[[`app`,`App storage (private — default)`],[`downloads`,`Downloads (user-visible)`],[`saf`,`SAF folder (pick below)`]]),K(`App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README.`),e,Z(X(`Choose SAF folder`,`files-storage-pick-saf`,{primary:!0}),X(`Clear SAF folder`,`files-storage-clear-saf`)),J(`Ask for folder every time if SAF unset`,`shell.filesAskDirEveryTime`),Y(`Temp staging place`,`shell.filesStagingRoot`,[[`app`,`App internal (files/) — default`],[`cache`,`App cache (may be purged)`],[`external`,`App external (Android/data/… — OEM may hide)`]]),K(`Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above.`),n,Z(X(`Show paths`,`files-storage-show-paths`),X(`Browse CWSP Files…`,`files-storage-open-explorer`),X(`Share README…`,`files-storage-share-readme`)),`File access permissions`,(()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-files-perm-status`,`1`),e.style.whiteSpace=`pre-wrap`,e.textContent=`Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.`,e})(),Z(X(`Refresh status`,`files-storage-perm-status`),X(`Request media access`,`files-storage-request-media`,{primary:!0}),X(`Allow manage all files…`,`files-storage-request-all-files`)),K(`All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish.`))}return t},In=()=>[`Native wire (Capacitor)`,J(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),J(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],Ln=()=>[`Control pairing`,Sn(`Public token`,`control-public-token`,{mono:!0,placeholder:`••••••••••••`}),Sn(`Device code (20s, +10s grace)`,`control-device-code`,{placeholder:`••••••`}),Z(X(`Refresh code`,`control-pairing-refresh`),X(`Regenerate public token`,`control-public-token-regenerate`)),K(`Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.`)],Rn=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-crx-control-status`,`1`),e.textContent=`Control: …`,[`Control pairing`,e,Z(X(`Pair Control…`,`crx-control-pair`,{primary:!0}),X(`Unpair`,`crx-control-unpair`)),K(`Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.`)]},zn=()=>{try{let e=globalThis;if(e.NL_OS!=null||e.NL_PORT!=null||e.Neutralino||e.Capacitor?.isNativePlatform?.())return!1;let t=String(e.Capacitor?.getPlatform?.()||``).toLowerCase();if(t===`android`||t===`ios`)return!1;let n=String(location.hostname||``).toLowerCase();return!n||n===`localhost`||n===`127.0.0.1`||n===`[::1]`?!1:location.protocol===`https:`}catch{return!1}},Bn=()=>[`Device`,J(`Start CWSP on boot`,`shell.autoStartOnBoot`),J(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),J(`Allow Control API`,`shell.allowControlApi`),K(`Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password.`),...Ln(),J(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),J(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),K(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],Vn=()=>W({id:`cwsp`,label:`CWSP`,order:55,excludeSurfaces:[`markdown`,`environment`],render:e=>{let t=[...Nn(e),...Pn(),...Fn(e)];return e.surface===`capacitor`||e.surface===`native`?t.push(...In(),...Bn()):e.surface===`crx`||e.isExtension?t.push(...Rn()):zn()||t.push(...In(),...Ln()),Cn(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=se(e));let r=t.querySelector(`[data-field="shell.clientId"]`);if(r){let t=Mn(r.value,e.shell?.clientId,e.core?.userId);r.value=t,e.shell={...e.shell||{},clientId:t}}let i=t.querySelector(`[data-files-saf-uri]`);if(i){let t=String(e.shell?.filesIncomingDir||``).trim();i.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`}let a=t.querySelector(`button[data-action="control-pairing-refresh"]`);if(a){queueMicrotask(()=>a.click());let e=Number(t.__cwspPairTimer||0);e&&clearInterval(e),t.__cwspPairTimer=window.setInterval(()=>{t.isConnected&&a.click()},2500)}let o=t.querySelector(`[data-crx-control-status]`);o&&C(()=>import(`./crx-control-session-DduCgqUH.js`).then(e=>e.formatCrxControlSessionStatus()),[],import.meta.url).then(e=>{o.isConnected&&(o.textContent=e)}).catch(()=>{o.textContent=`Control: status unavailable`})},save:e=>{ce(e),jn(e.shell?.clientId)&&(e.shell={...e.shell||{},clientId:Mn(e.core?.userId)})}})})))()}var Un;function Wn(){return(Wn=e((()=>{Un=()=>()=>void 0})))()}var Gn;function Kn(){return(Kn=e((()=>{G(),wn(),Gn=()=>W({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>Cn(`reader`,`Reader`,[xn(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),J(`Wrap long lines`,`views.reader.wrapLongLines`)])})})))()}var qn;function Jn(){return(Jn=e((()=>{G(),wn(),qn=()=>W({id:`workcenter`,label:`Work Center`,order:65,requiresView:`workcenter`,render:()=>Cn(`workcenter`,`Work Center`,[J(`Auto-run pinned tasks`,`views.workcenter.autoRunPinned`),q(`Default instruction id`,`views.workcenter.defaultInstructionId`,`(none)`)])})})))()}var Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,Q,pr,mr,hr,gr,_r,vr;function yr(){return(yr=e((()=>{G(),wn(),Yn=`cw::workspace::grid-layout`,Xn=`rs-open-link-target`,Zn=`cwsp:workspace-grid`,Qn=[[`squircle`,`Squircle`],[`circle`,`Circle`],[`square`,`Rounded square`],[`wavy`,`Wavy`]],$n=[[`open-link`,`Open link`],[`open-view`,`Open view`]],er=[[`inline`,`Inline (iframe / env window, same tab)`],[`external-app`,`External app (Android chooser)`],[`native-window`,`Native window (new browser window)`],[`new-tab`,`New tab`]],tr=[[`compact`,`Compact (0.78)`],[`fit`,`Fit (1.0 — no zoom)`],[`fill`,`Fill (1.28 — adaptive default)`],[`zoom`,`Zoom (1.5)`],[`max`,`Max (1.75)`]],nr=new Set(Qn.map(([e])=>e)),rr=new Set($n.map(([e])=>e)),ir=new Set(er.map(([e])=>e)),ar=new Set(tr.map(([e])=>e)),or=(e,t)=>{let n=Number(e);return Number.isFinite(n)?Math.max(1,Math.min(16,Math.round(n))):t},sr=(e,t=`squircle`)=>{let n=String(e||``).trim().toLowerCase();return nr.has(n)?n:t},cr=(e,t=`open-link`)=>{let n=String(e||``).trim().toLowerCase();return rr.has(n)?n:t},lr=(e,t=`fill`)=>{let n=String(e||``).trim().toLowerCase();return n===`small`||n===`0.78`?`compact`:n===`1`||n===`contain`?`fit`:n===`adaptive`||n===`1.28`?`fill`:n===`1.5`?`zoom`:n===`large`||n===`1.75`?`max`:ar.has(n)?n:t},ur=(e,t=`inline`)=>{let n=String(e||``).trim().toLowerCase();return n===`in-shell`||n===`env`||n===`shell`?`inline`:n===`native`||n===`window`||n===`app-window`?`native-window`:n===`tab`||n===`browser`||n===`browser-tab`?`new-tab`:n===`app`||n===`chooser`||n===`open-with`||n===`open-in-app`||n===`intent`?`external-app`:ir.has(n)?n:t},dr=e=>{if(!e)return{};try{let t=JSON.parse(e);if(t&&typeof t==`object`)return t}catch{}let t=/columns["']?\s*:\s*(\d+)/.exec(e),n=/rows["']?\s*:\s*(\d+)/.exec(e),r=/shape["']?\s*:\s*["']?([a-z-]+)/i.exec(e),i=/defaultAction["']?\s*:\s*["']?([a-z-]+)/i.exec(e),a=/defaultOpenLinkTarget["']?\s*:\s*["']?([a-z-]+)/i.exec(e),o=/iconScale["']?\s*:\s*["']?([a-z0-9.-]+)/i.exec(e),s={};return t&&(s.columns=Number(t[1])),n&&(s.rows=Number(n[1])),r&&(s.shape=sr(r[1])),i&&(s.defaultAction=cr(i[1])),a&&(s.defaultOpenLinkTarget=ur(a[1])),o&&(s.iconScale=lr(o[1])),s},fr=()=>{let e=null;try{window.dispatchEvent(new CustomEvent(Zn,{detail:{query:!0,receive:t=>{e=t}}}))}catch{}let t={},n=``;try{t=dr(localStorage.getItem(Yn)),n=String(localStorage.getItem(Xn)||``)}catch{}return{columns:or(e?.columns??t.columns,4),rows:or(e?.rows??t.rows,8),shape:sr(e?.shape??t.shape,`squircle`),defaultAction:cr(e?.defaultAction??t.defaultAction,`open-link`),defaultOpenLinkTarget:ur(e?.defaultOpenLinkTarget??t.defaultOpenLinkTarget??n,`inline`),iconScale:lr(e?.iconScale??t.iconScale,`fill`)}},Q=(e,t,n)=>{let r=e.querySelector(`[data-field="${t}"]`);!r||n==null||(r.value=String(n))},pr=`cw::workspace::pages`,mr=e=>{let t=[],n=`side-a`;try{let e=JSON.parse(localStorage.getItem(pr)||`null`);e?.pages?.length&&(t=e.pages,n=String(e.activeId||t[0].id))}catch{t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]}t.length||(t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]),e.replaceChildren();for(let r of t){let i=document.createElement(`div`);i.style.cssText=`display:flex;gap:.4rem;align-items:center;margin:.25rem 0;`;let a=document.createElement(`button`);a.type=`button`,a.className=`view-settings__btn`,a.textContent=r.label+(r.id===n?` · active`:``),a.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`switch`,id:r.id}})),requestAnimationFrame(()=>mr(e))});let o=document.createElement(`button`);if(o.type=`button`,o.className=`view-settings__btn`,o.textContent=`Rename`,o.addEventListener(`click`,()=>{let t=window.prompt(`Workspace name`,r.label);t&&(window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`rename`,id:r.id,label:t}})),requestAnimationFrame(()=>mr(e)))}),i.append(a,o),t.length>1){let t=document.createElement(`button`);t.type=`button`,t.className=`view-settings__btn`,t.textContent=`Remove`,t.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`remove`,id:r.id}})),requestAnimationFrame(()=>mr(e))}),i.append(t)}e.append(i)}},hr=e=>{let t=e.querySelector(`[data-workspace-pages]`);t&&mr(t),e.dataset.workspacePagesBound!==`1`&&(e.dataset.workspacePagesBound=`1`,e.addEventListener(`click`,e=>{let n=(e.target?.closest?.(`[data-action]`))?.getAttribute(`data-action`)||``;if(n===`add-workspace-page`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`add`}}));else if(n===`workspace-page-prev`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`prev`}}));else if(n===`workspace-page-next`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`next`}}));else return;t&&requestAnimationFrame(()=>mr(t))}))},gr=e=>{try{localStorage.setItem(Yn,JSON.stringify({columns:e.columns,rows:e.rows,shape:e.shape,defaultAction:e.defaultAction,iconScale:e.iconScale||`fill`})),e.defaultOpenLinkTarget&&localStorage.setItem(Xn,e.defaultOpenLinkTarget)}catch{}},_r=e=>{let t=!1;try{window.dispatchEvent(new CustomEvent(Zn,{detail:{...e,ack:()=>{t=!0}}}))}catch{}t||gr(e)},vr=()=>W({id:`workspace`,label:`Workspace`,order:18,requiresView:`home`,surfaces:[`environment`,`crx`,`web`,`native`,`capacitor`],excludeSurfaces:[`markdown`],render:()=>Cn(`workspace`,`Workspace`,[K(`Theme, workspaces, and the Speed Dial grid share this page.`),`Workspaces`,K(`Pages of the Speed Dial. Explorer roots: /user/workspaces/side-a, side-b, …`),(()=>{let e=document.createElement(`div`);return e.setAttribute(`data-workspace-pages`,`1`),e.className=`field`,e})(),Z(X(`Add workspace`,`add-workspace-page`),X(`Previous page`,`workspace-page-prev`),X(`Next page`,`workspace-page-next`)),`Grid`,K(`Speed dial grid on the Home / NTP workspace.`),Y(`Default icon shape`,`grid.shape`,Qn),Y(`Icon bitmap scale`,`grid.iconScale`,tr),xn(`Columns`,`grid.columns`,{min:`1`,max:`16`,step:`1`,placeholder:`4`}),xn(`Rows`,`grid.rows`,{min:`1`,max:`16`,step:`1`,placeholder:`8`}),`Default actions`,Y(`New tile action`,`grid.defaultAction`,$n),Y(`Open links in`,`grid.defaultOpenLinkTarget`,er)]),load:(e,t)=>{let n=fr(),r=e.grid||{};Q(t,`grid.shape`,n.shape||r.shape||`squircle`),Q(t,`grid.iconScale`,n.iconScale||r.iconScale||`fill`),Q(t,`grid.columns`,n.columns??r.columns??4),Q(t,`grid.rows`,n.rows??r.rows??8),Q(t,`grid.defaultAction`,n.defaultAction||r.defaultAction||`open-link`),Q(t,`grid.defaultOpenLinkTarget`,n.defaultOpenLinkTarget||r.defaultOpenLinkTarget||`inline`),hr(t)},save:e=>{let t={columns:or(e.grid?.columns,4),rows:or(e.grid?.rows,8),shape:sr(e.grid?.shape,`squircle`),defaultAction:cr(e.grid?.defaultAction,`open-link`),defaultOpenLinkTarget:ur(e.grid?.defaultOpenLinkTarget,`inline`),iconScale:lr(e.grid?.iconScale,`fill`)};e.grid={...e.grid||{},...t},_r(t)}})})))()}var br,xr;function Sr(){return(Sr=e((()=>{On(),Hn(),Wn(),Kn(),Jn(),yr(),br=!1,xr=()=>{br||(br=!0,Vn(),vr(),Gn(),qn(),Un(),Dn())}})))()}var Cr,wr,Tr,Er,Dr,Or,kr;function Ar(){return(Ar=e((()=>{r(),Ue(),S(),Cr=null,wr=null,Tr=()=>{try{let e=globalThis,t=e.Capacitor?.getPlatform?.();return!!(e.Capacitor?.isNativePlatform?.()||t===`android`||t===`ios`||e.__CWS_NATIVE__===!0)}catch{return!1}},Er=()=>{let e=l()||s();return e&&e!==`launcher`&&e!==`crx`?`none`:Ge()!==null||u()?`hub`:e===`launcher`&&Tr()?`launcher`:`none`},Dr=()=>Cr,Or=async()=>{if(wr)return wr;wr=(async()=>{let e=$e.map(e=>{let t=Ye(e);return{section:e,pkg:c(t)}}).filter(e=>!!e.pkg);try{let{launcherHasPackages:t}=await C(async()=>{let{launcherHasPackages:e}=await import(`./launcher-bridge-Crivecrz.js`);return{launcherHasPackages:e}},[],import.meta.url),n=await t(e.map(e=>e.pkg));Cr=e.filter(e=>n[e.pkg]===!0).map(e=>e.section)}catch{Cr=[]}return Cr})();try{return await wr}finally{wr=null}},kr=(e,t)=>{let n=[...e||[]].filter(e=>e!==`hub`).sort(),r=[...t||[]].filter(e=>e!==`hub`).sort();return n.length===r.length&&n.every((e,t)=>e===r[t])}})))()}var jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r;function ei(){return(ei=e((()=>{le(),x(),G(),Sr(),r(),Ue(),Ar(),ae(),Ae(),S(),jr=`[data-settings-tabs]`,Mr=`.settings-screen__body`,Nr=()=>{try{let e=globalThis,t=e.Capacitor?.getPlatform?.();return!!(e.Capacitor?.isNativePlatform?.()||t===`android`||t===`ios`||e.__CWS_NATIVE__===!0)}catch{return!1}},Pr=()=>{try{let e=s();if(e===`document`)return`markdown`;if(e===`process`)return`capacitor`;if(e===`launcher`)return Nr()?`capacitor`:`environment`;if(e===`crx`)return`crx`;let t=globalThis;if(t?.chrome?.runtime?.id)return`crx`;if(t?.Capacitor?.isNativePlatform?.()||t?.Capacitor?.getPlatform?.()===`android`||t?.Capacitor?.getPlatform?.()===`ios`)return`capacitor`;if(t?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`){let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase();if(e===`cw-markdown`||e===`cw-document`||e===`document`)return`markdown`;if(e===`environment`||e===`cw-environment`||e===`cwsp-shell`||document.querySelector?.(`.env-shell-root[data-shell='environment'], env-shell-container[data-shell='environment']`))return`environment`}if(typeof document<`u`)return`web`}catch{}return`unknown`},Fr=(e,t)=>{let n=Ge(),r=Er(),i=r===`hub`||r===`launcher`?t||tt()||`hub`:null,a=n||i||t||void 0,o=a?Ye(a):s(),c=Pr();return a===`document`?c=`markdown`:a===`transfer`||a===`process`||a===`explorer`?c=`web`:a===`hub`&&(c=`environment`),{isExtension:!!e,surface:c,sku:o,hubSection:a}},Ir=(e,t)=>{if(e.requiresView&&!v(e.requiresView))return!1;let n=e.surfaces;if(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface)||e.id===`apk-update`&&t.surface===`environment`&&!Nr())return!1;if(e.id===`cwsp`){let e=t.sku||s();if(e===`launcher`||e===`explorer`||e===`document`||e===`process`)return!1}return!0},Lr=e=>mn().filter(t=>Ir(t,e)),Rr=(e,t)=>{let n=e.querySelector(jr),r=e.querySelector(Mr);if(!(!n||!r))for(let i of Lr(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;if(i.id===`workspace`){let n=e.querySelector(`[data-tab-panel="appearance"]`);if(n){let e=null;try{e=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(e){let t=document.createElement(`div`);t.setAttribute(`data-contribution`,`workspace`),t.hidden=!1,e.matches?.(`[data-tab-panel]`)?(e.removeAttribute(`hidden`),e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.append(...Array.from(e.childNodes))):(e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.appendChild(e)),n.appendChild(t)}continue}}let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},zr=(e,t,n)=>{for(let r of Lr(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`)||e.querySelector(`[data-contribution="${r.id}"]`);t&&n(r,t)}},Br=(e,t,n)=>{zr(e,n,(e,r)=>{try{e.manualFields||vn(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},Vr=(e,t,n)=>{zr(e,n,(e,r)=>{try{e.manualFields||yn(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},Hr=e=>!!e&&typeof e==`object`&&!Array.isArray(e),Ur=(e,t)=>{if(!Hr(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(Hr(t)&&Hr(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return Hr(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},Wr=()=>{try{let e=globalThis,t=typeof e.chrome?.runtime?.id==`string`&&typeof e.__NEUTRALINO_AUTH__?.port==`number`;return!!(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||typeof e.__WEBNATIVE_AUTH__?.port==`number`||typeof e.__NEUTRALINO_AUTH__?.port==`number`||t)}catch{return!1}},Gr=e=>{if(!e||typeof e!=`object`)return!1;let t=e.core,n=e.shell,r=e.bridge,i=e.cwsp,a=e.control;return!!(typeof t?.endpointUrl==`string`&&t.endpointUrl.trim()||typeof t?.userId==`string`&&t.userId.trim()||typeof t?.ecosystemToken==`string`&&t.ecosystemToken.trim()||typeof t?.userKey==`string`&&t.userKey.trim()||typeof n?.clipboardInboundMode==`string`&&n.clipboardInboundMode||typeof n?.clipboardOutboundMode==`string`&&n.clipboardOutboundMode||typeof n?.remoteHost==`string`&&n.remoteHost.trim()||typeof n?.clientId==`string`&&n.clientId.trim()||typeof n?.allowControlApi==`boolean`||typeof n?.bridgeDaemonEnabled==`boolean`||typeof n?.autoStartOnBoot==`boolean`||typeof r?.endpointUrl==`string`&&r.endpointUrl.trim()||typeof r?.userId==`string`&&String(r.userId).trim()||typeof i?.clientId==`string`&&String(i.clientId).trim()||typeof i?.endpointUrl==`string`&&String(i.endpointUrl).trim()||a?.surface===`capacitor-android`)},Kr=()=>{try{let e=globalThis.chrome?.runtime?.id;return typeof e==`string`&&e.length>0}catch{return!1}},qr=e=>{if(!Kr())return e;let t=`L-110-crx`,n=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),r=((...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!n(e))return e}return`L-110`})(e.shell?.clientId,e.core?.userId);return{...e,core:{...e.core||{},userId:t,socket:{...e.core?.socket||{},selfId:t}},shell:{...e.shell||{},clientId:r}}},Jr=async e=>{let t=await e();if((t.core?.preferBackendSync??!0)===!1)return qr(t);let n=await j(),r=(()=>{try{if(!Kr())return!1;let e=globalThis;return String(globalThis.document?.documentElement?.dataset?.cwspBridge||``)===`live`||typeof e.__NEUTRALINO_AUTH__?.port==`number`}catch{return!1}})();if((Wr()||r)&&!Gr(n))for(let e=0;e<8&&(await new Promise(e=>setTimeout(e,300)),n=await j(),!Gr(n));e++);return qr(Ur(t,n))},Yr=async(e,t,n={})=>{let r=await j(),i=Ur(n,r);return Br(e,i,t),i},Xr=async(e,t,n)=>(Vr(e,t,n),Be(t)),Zr=e=>Lr(e).map(e=>e.id),Qr=()=>Nr(),$r=async e=>{ce(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await C(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-C1fUeWnY.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=e=>{let t=e.toLowerCase();return t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`||t===`md.u2re.space`||t===`www.md.u2re.space`},a=e=>{let t=String(e||``).trim();if(!t)return``;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e).hostname.toLowerCase();if(i(n))return``}catch{if(/cwsp\.u2re\.space|md\.u2re\.space/i.test(t))return``}return t},o=e=>{let t=String(e||``).trim();return t?/[,;\s]/.test(t)&&/:\/\//.test(t)?t.split(/[,;\s]+/).map(e=>a(e.trim())).filter(Boolean).join(`;`):a(t):``};if(typeof t.endpointUrl==`string`){let e=o(t.endpointUrl);e!==t.endpointUrl.trim()&&(t.endpointUrl=e)}let s=typeof t.endpointUrl==`string`?t.endpointUrl:``,c=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!s.trim()&&!c.trim())return;let l=Qr()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},u=await oe({relayHttpsUrl:s,directHttpsUrl:c},l);u.relayHttpsUrl!==void 0&&(t.endpointUrl=u.relayHttpsUrl),u.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:u.directHttpsUrl})}})))()}var $,ti,ni,ri;function ii(){return(ii=e((()=>{E(),pe(),le(),rt(),te(),k(),St(),Dt(),fe(),Ft(),zt(),Vt(),Ut(),en(),nn(),an(),sn(),V(),H(),pn(),ei(),r(),re(),De(),P(),Ve(),S(),$=null,ti=()=>{$=null},ni=[{id:`hub`,label:`Shell`,icon:`squares-four`},{id:`explorer`,label:`Explorer`,icon:`folder`},{id:`document`,label:`Document`,icon:`books`},{id:`process`,label:`Process`,icon:`lightning`},{id:`transfer`,label:`Transfer`,icon:`arrows-left-right`}],ri=e=>{let t=e.hubSection||Ge()||`hub`;if($){if($.dataset.hubSettingsSection!==t)$=null;else return e.initialTab&&$.dispatchEvent(new CustomEvent(`cwsp-settings-resync`)),$}let n=null,r=null,i=()=>{let e=Pr();return e===`capacitor`||e===`native`?8e3:2500},o=(e,t)=>{n&&(r&&=(clearTimeout(r),null),n.textContent=e,n.classList.remove(`note--ok`,`note--warn`,`note--err`),t?.tone===`ok`&&n.classList.add(`note--ok`),t?.tone===`warn`&&n.classList.add(`note--warn`),t?.tone===`err`&&n.classList.add(`note--err`),e&&!t?.persist&&(r=setTimeout(()=>{n&&(n.textContent=``,n.classList.remove(`note--ok`,`note--warn`,`note--err`))},i())))},l=D`<div class="view-settings" data-view="settings">
    ${Ht()}
    <div class="settings-screen__body">
      ${Kt()}
      ${tn()}
      ${rn()}
      ${on()}
      ${cn()}
      ${dn(o)}
      ${fn()}
    </div>
    ${Bt()}
  </div>`;vt(l),xr();let u=Er(),d=Dr(),f=Ke(u,d),p=Fr(e.isExtension,e.hubSection);if(u!==`none`){let t=e.hubSection||p.hubSection||`hub`;p.hubSection=f.length&&!f.includes(t)?`hub`:t}let m=Qe(p);if(l.dataset.hubSettingsSection=p.hubSection||t,Rr(l,p),f.length>1){let e=l.querySelector(`.settings-screen__top`),t=l.querySelector(`[data-settings-tabs]`);if(e&&t){let n=document.createElement(`nav`);n.className=`settings-tab-actions settings-sku-nav`,n.setAttribute(`data-settings-sku-nav`,``),n.setAttribute(`aria-label`,`Settings area`);for(let e of ni){if(!f.includes(e.id))continue;let t=document.createElement(`button`);t.className=`settings-tab-btn`,t.type=`button`,t.setAttribute(`data-action`,`open-settings-section`),t.setAttribute(`data-section`,e.id),t.append(D`<ui-icon class="settings-sku-nav__icon" icon="${e.icon}" icon-style="duotone" aria-hidden="true"></ui-icon>`,D`<span>${e.label}</span>`),t.classList.toggle(`is-active`,e.id===(p.hubSection||`hub`)),n.appendChild(t)}e.insertBefore(n,t)}}u===`launcher`&&d===null&&Or().then(e=>{e.length&&(ti(),globalThis.dispatchEvent(new CustomEvent(`cwsp-settings-section`)))}),Je(l,m),m===`full`&&(p.surface===`capacitor`||p.surface===`native`)&&(l.querySelector(`[data-tab-panel="server"]`)?.remove(),l.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let h=e=>Ze(l,e),g=()=>{let e=qe(l.dataset.hubSettingsSection||`hub`),t=Er()!==`none`&&e!==`hub`?Ye(e):s()||`launcher`;return{sku:t,packageName:c(t)||``,manifest:a(t)}},_=e=>l.querySelector(e);n=l.querySelector(`[data-note]`);let v=_(`[data-field="ai.baseUrl"]`),y=_(`[data-field="ai.apiKey"]`),b=_(`[data-field="ui.showKey"]`),x=_(`[data-field="ai.model"]`),S=_(`[data-field="ai.customModel"]`),w=l.querySelector(`[data-field-group="ai.customModel"]`),ee=_(`[data-field="ai.defaultReasoningEffort"]`),te=_(`[data-field="ai.defaultVerbosity"]`),re=_(`[data-field="ai.maxOutputTokens"]`),ie=_(`[data-field="ai.contextTruncation"]`),ae=_(`[data-field="ai.promptCacheRetention"]`),oe=_(`[data-field="ai.maxToolCalls"]`),E=_(`[data-field="ai.parallelToolCalls"]`),ce=_(`[data-field="ai.requestTimeout.low"]`),le=_(`[data-field="ai.requestTimeout.medium"]`),fe=_(`[data-field="ai.requestTimeout.high"]`),pe=_(`[data-field="ai.maxRetries"]`),be=_(`[data-field="ai.shareTargetMode"]`),xe=()=>{let e=(x?.value||``).trim()===`custom`;w&&(w.hidden=!e),S&&(S.disabled=!e)};if(x){x.replaceChildren();for(let e of ue){let t=document.createElement(`option`);t.value=e,t.textContent=e,x.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,x.append(e),x.addEventListener(`change`,xe)}S?.addEventListener(`focus`,()=>{x&&(x.value=`custom`,xe())});let Se=_(`[data-field="ai.autoProcessShared"]`),O=_(`[data-field="ai.responseLanguage"]`),Ce=_(`[data-field="ai.translateResults"]`),Te=_(`[data-field="ai.generateSvgGraphics"]`),k=_(`[data-field="speech.language"]`),Ee=_(`[data-field="appearance.theme"]`),A=_(`[data-field="appearance.fontSize"]`),De=l.querySelector(`[data-appearance-color]`),ke=_(`[data-field="appearance.colorSource"]`),Ae=_(`[data-field="appearance.hue"]`),je=_(`[data-field="appearance.color"]`),Me=_(`[data-field="appearance.markdown.preset"]`),Ne=_(`[data-field="appearance.markdown.fontFamily"]`),Pe=_(`[data-field="appearance.markdown.fontSizePx"]`),Fe=_(`[data-field="appearance.markdown.lineHeight"]`),Ie=_(`[data-field="appearance.markdown.contentMaxWidthPx"]`),Le=_(`[data-field="appearance.markdown.printScale"]`),Re=_(`[data-field="appearance.markdown.page.size"]`),ze=_(`[data-field="appearance.markdown.page.orientation"]`),j=_(`[data-field="appearance.markdown.page.marginMm"]`),Be=_(`[data-field="appearance.markdown.modules.typography"]`),Ve=_(`[data-field="appearance.markdown.modules.lists"]`),Ue=_(`[data-field="appearance.markdown.modules.tables"]`),Xe=_(`[data-field="appearance.markdown.modules.codeBlocks"]`),$e=_(`[data-field="appearance.markdown.modules.blockquotes"]`),tt=_(`[data-field="appearance.markdown.modules.media"]`),rt=_(`[data-field="appearance.markdown.modules.printBreaks"]`),at=_(`[data-field="appearance.markdown.plugins.smartTypography"]`),ot=_(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),st=_(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),ct=l.querySelector(`[data-field="appearance.markdown.customCss"]`),lt=l.querySelector(`[data-field="appearance.markdown.printCss"]`),ut=l.querySelector(`[data-field="appearance.markdown.extensions"]`),dt=_(`[data-field="core.ntpEnabled"]`),ft=_(`[data-field="core.mode"]`),pt=_(`[data-field="core.endpointUrl"]`),mt=_(`[data-field="core.userId"]`),M=_(`[data-field="core.userKey"]`),N=_(`[data-field="core.ecosystemToken"]`),ht=_(`[data-field="core.preferBackendSync"]`),gt=_(`[data-field="core.encrypt"]`),_t=_(`[data-field="core.appClientId"]`),P=_(`[data-field="core.allowInsecureTls"]`),F=_(`[data-field="core.ops.allowUnencrypted"]`),xt=_(`[data-field="core.admin.httpsOrigin"]`),St=_(`[data-field="core.admin.httpOrigin"]`),Ct=_(`[data-field="core.admin.path"]`),I=_(`[data-field="core.socket.accessToken"]`),Tt=_(`[data-field="core.socket.routeTarget"]`),Et=_(`[data-field="core.socket.clientAccessToken"]`),Dt=_(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),Ot=_(`[data-field="shell.maintainHubSocketConnection"]`),At=_(`[data-field="shell.clipboardBroadcastTargets"]`),Ft=_(`[data-field="shell.pushLocalClipboardToLan"]`),zt=_(`[data-field="shell.clipboardPushIntervalMs"]`),Vt=_(`[data-field="shell.enableRemoteClipboardBridge"]`),Ut=_(`[data-field="shell.acceptInboundClipboardData"]`),Wt=_(`[data-field="shell.clipboardInboundAllowIds"]`),Gt=_(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),B=_(`[data-field="shell.clipboardShareDestinationIds"]`),qt=_(`[data-field="shell.applyRemoteClipboardToDevice"]`),Jt=_(`[data-field="shell.acceptContactsBridgeData"]`),en=_(`[data-field="shell.acceptSmsBridgeData"]`),nn=_(`[data-field="shell.enableNativeSms"]`),an=_(`[data-field="shell.enableNativeContacts"]`),sn=l.querySelector(`[data-admin-preview]`),V=l.querySelector(`[data-mcp-section]`),ln=l.querySelector(`[data-section="extension"]`),un=l.querySelector(`[data-extension-tab]`);if(O){O.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,O.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,O.append(t);for(let e of Mt()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,O.append(t)}}if(k){k.replaceChildren();for(let e of jt()){let t=document.createElement(`option`);t.value=e,t.textContent=kt(e),k.append(t)}}l.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&W()}),l.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&W()});let H=e=>{let t=He(m),n=e||t,r=()=>l.querySelectorAll(`.settings-screen__body > [data-tab-panel]`);[...r()].some(e=>e.getAttribute(`data-tab-panel`)===n)||(n=r()[0]?.getAttribute(`data-tab-panel`)||t),l.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let i=l.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let a=r();for(let e of Array.from(a)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}};l.addEventListener(`click`,e=>{let t=Pt(e),n=t?.closest?.(`[data-action="open-settings-section"][data-section]`);if(n&&l.contains(n)){e.preventDefault(),e.stopPropagation();let t=String(n.getAttribute(`data-section`)||`hub`).toLowerCase();if(We(t),ti(),Er()===`hub`){let e=et(t);wt(`settings`,e?{section:e}:{})}else globalThis.dispatchEvent(new CustomEvent(`cwsp-settings-section`,{detail:{section:t}}));return}let r=t?.closest?.(`[data-action="switch-settings-tab"][data-tab]`);!r||!l.contains(r)||(e.preventDefault(),e.stopPropagation(),H(r.getAttribute(`data-tab`)||He(m)))},!0);let pn=e=>{let t=He(m),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?h(`markdown`)?`markdown`:t:new Set([...h(`appearance`)?[`appearance`]:[],...h(`markdown`)?[`markdown`]:[],...h(`ai`)?[`ai`]:[],...h(`mcp`)?[`mcp`]:[],...h(`server`)?[`server`]:[],...h(`instructions`)?[`instructions`]:[],...h(`extension`)?[`extension`]:[],...Zr(p)]).has(n)?n:t:t},U=()=>{let e=N?.value?.trim()||M?.value?.trim()||I?.value?.trim()||``;return{mode:ft?.value||`native`,endpointUrl:pt?.value?.trim()||``,userId:mt?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!gt?.checked,preferBackendSync:(ht?.checked??!0)!==!1,appClientId:_t?.value?.trim()||``,allowInsecureTls:!!P?.checked,useCoreIdentityForAirPad:!0,socket:{accessToken:e,routeTarget:Tt?.value?.trim()||``,selfId:``,clientAccessToken:Et?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!Dt?.checked},admin:{httpsOrigin:xt?.value?.trim()||``,httpOrigin:St?.value?.trim()||``,path:Ct?.value?.trim()||`/`},ops:{allowUnencrypted:!!F?.checked}}},W=()=>{if(!sn)return;let e=nt(U());sn.textContent=`Resolved: ${e.https} · ${e.http}`},mn=e=>{try{yt(bt.EXPLORER_PATH,e),wt(`explorer`),T({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),o(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),o(`Failed to open Explorer path.`)}};Promise.resolve((async()=>((p.surface===`capacitor`||p.surface===`native`)&&await ge().catch(()=>null),(p.surface===`crx`||p.isExtension)&&await ve().catch(()=>null),Jr(()=>_e())))()).then(t=>{v&&(v.value=(t?.ai?.baseUrl||``).trim()),y&&(y.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.6-luna`).trim(),r=(t?.ai?.customModel||``).trim();if(x){let e=ue.includes(n);n===`custom`||!e&&n?(x.value=`custom`,S&&(S.value=r||n)):(x.value=e?n:`gpt-5.6-luna`,S&&(S.value=r)),xe()}if(ee&&(ee.value=t?.ai?.defaultReasoningEffort||`medium`),te&&(te.value=t?.ai?.defaultVerbosity||`medium`),re&&(re.value=String(t?.ai?.maxOutputTokens??4e5)),ie&&(ie.value=t?.ai?.contextTruncation||`disabled`),ae&&(ae.value=t?.ai?.promptCacheRetention||`in-memory`),oe&&(oe.value=String(t?.ai?.maxToolCalls??8)),E&&(E.checked=(t?.ai?.parallelToolCalls??!0)!==!1),ce&&(ce.value=String(t?.ai?.requestTimeout?.low??6e4)),le&&(le.value=String(t?.ai?.requestTimeout?.medium??3e5)),fe&&(fe.value=String(t?.ai?.requestTimeout?.high??9e5)),pe&&(pe.value=String(t?.ai?.maxRetries??2)),be&&(be.value=t?.ai?.shareTargetMode||`recognize`),Se&&(Se.checked=(t?.ai?.autoProcessShared??!0)!==!1),O&&(O.value=t?.ai?.responseLanguage||`auto`),Ce&&(Ce.checked=!!t?.ai?.translateResults),Te&&(Te.checked=!!t?.ai?.generateSvgGraphics),k&&(k.value=t?.speech?.language||`en-US`),Ee&&(Ee.value=t?.appearance?.theme||`auto`),A&&(A.value=t?.appearance?.fontSize||`medium`),De&&(De.hidden=!1,Zt(l,String(t?.appearance?.colorSource||`auto`)),Qt(l,String(t?.appearance?.color||``))),Me&&(Me.value=t?.appearance?.markdown?.preset||`default`),Ne&&(Ne.value=t?.appearance?.markdown?.fontFamily||`system`),Pe&&(Pe.value=String(t?.appearance?.markdown?.fontSizePx??16)),Fe&&(Fe.value=String(t?.appearance?.markdown?.lineHeight??1.7)),Ie&&(Ie.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),Le&&(Le.value=String(t?.appearance?.markdown?.printScale??1)),Re&&(Re.value=t?.appearance?.markdown?.page?.size||`auto`),ze&&(ze.value=t?.appearance?.markdown?.page?.orientation||`portrait`),j&&(j.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Be&&(Be.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),Ve&&(Ve.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Ue&&(Ue.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),Xe&&(Xe.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),$e&&($e.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),tt&&(tt.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),rt&&(rt.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),at&&(at.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),ot&&(ot.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),st&&(st.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),ct&&(ct.value=(t?.appearance?.markdown?.customCss||``).trim()),lt&&(lt.value=(t?.appearance?.markdown?.printCss||``).trim()),ut){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];ut.value=e.length>0?JSON.stringify(e,null,2):``}dt&&(dt.checked=!!t?.core?.ntpEnabled),ft&&(ft.value=t?.core?.mode||`native`),pt&&(pt.value=(t?.core?.endpointUrl||``).trim()),mt&&(mt.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();N&&(N.value=e),M&&(M.value=e),I&&(I.value=e)}if(ht&&(ht.checked=(t?.core?.preferBackendSync??!0)!==!1),gt&&(gt.checked=!!t?.core?.encrypt),_t&&(_t.value=(t?.core?.appClientId||``).trim()),Tt&&(Tt.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),Et&&(Et.value=(t?.core?.socket?.clientAccessToken||``).trim()),Dt&&(Dt.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),P&&(P.checked=!!t?.core?.allowInsecureTls),F&&(F.checked=!!t?.core?.ops?.allowUnencrypted),xt&&(xt.value=(t?.core?.admin?.httpsOrigin||``).trim()),St&&(St.value=(t?.core?.admin?.httpOrigin||``).trim()),Ct&&(Ct.value=(t?.core?.admin?.path||`/`).trim()||`/`),Ot&&(Ot.checked=!!t?.shell?.maintainHubSocketConnection),At&&(At.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),Ft&&(Ft.checked=!!t?.shell?.pushLocalClipboardToLan),zt){let e=Number(t?.shell?.clipboardPushIntervalMs);zt.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}Vt&&(Vt.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),Ut&&(Ut.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),Wt&&(Wt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),Gt&&(Gt.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),B&&(B.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),qt&&(qt.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),Jt&&(Jt.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),en&&(en.checked=!Oe()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),nn&&(nn.checked=!Oe()&&(t?.shell?.enableNativeSms??!1)===!0),an&&(an.checked=(t?.shell?.enableNativeContacts??!0)!==!1),W(),Rt(V,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),de(t),we(t),Br(l,t,p),e.onTheme?.(t?.appearance?.theme||`auto`),Oe()&&C(()=>import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n)).then(e=>e.invokeCwsNative(`app:info`,g())),[],import.meta.url).then(e=>{let t=e?.echo||{},n=l.querySelector(`[data-apk-local-version]`);if(!n)return;let r=String(t?.signatureSha256||``).slice(0,12),i=e;n.textContent=`Installed: ${t?.versionName||i?.versionName||`?`} (${t?.versionCode??i?.versionCode??`?`})`+(r?` · sig ${r}…`:``)}).catch(()=>{})}).catch(()=>{Rt(V,[])}),b?.addEventListener(`change`,()=>{!y||!b||(y.type=b.checked?`text`:`password`)});let hn=e=>{(async()=>{try{let t=await _e();we({...t,appearance:{...t.appearance||{},...e}})}catch{we({appearance:{theme:`auto`,fontSize:`medium`,...e}})}})()};if(De?.addEventListener(`click`,e=>{let t=e.target?.closest?.(`.appearance-swatch`);if(!t)return;let n=t.dataset.color??``;Zt(l,`custom`),Qt(l,n),hn({color:n,colorSource:`custom`})}),ke?.addEventListener(`change`,()=>{let e=Xt(l);Zt(l,e),hn({colorSource:e,color:e===`custom`?$t(l):void 0})}),Ae?.addEventListener(`input`,()=>{let e=Yt(Number(Ae.value));Zt(l,`custom`),Qt(l,e),hn({color:e,colorSource:`custom`})}),je?.addEventListener(`input`,()=>{let e=je.value||``;Zt(l,`custom`),Qt(l,e),hn({color:e,colorSource:`custom`})}),Ee?.addEventListener(`change`,()=>{let t=Ee.value||`auto`;(async()=>{try{let e=await _e();we({...e,appearance:{...e.appearance||{},theme:t}})}catch{we({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),l.addEventListener(`click`,t=>{let n=Pt(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&V){V.querySelector(`.mcp-empty-note`)?.remove(),V.appendChild(It({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),V&&!V.querySelector(`[data-mcp-id]`)&&Rt(V,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){mn(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){mn(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){it(U(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){it(U(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=nt(U());navigator.clipboard?.writeText?.(e.https).then(()=>o(`HTTPS admin URL copied.`),()=>o(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=nt(U());navigator.clipboard?.writeText?.(e.http).then(()=>o(`HTTP admin URL copied.`),()=>o(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){C(()=>import(`./clipboard-device-DaJ_Uxk7.js`).then(e=>(e.n(),e.t)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>o(`App settings opened (native shell only).`)).catch(()=>o(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){C(()=>import(`./clipboard-device-DaJ_Uxk7.js`).then(e=>(e.n(),e.t)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>o(`Notification settings opened (native shell only).`)).catch(()=>o(`Native settings unavailable in this context.`));return}let i=n?.closest?.(`button[data-action="crx-control-pair"]`),a=n?.closest?.(`button[data-action="crx-control-unpair"]`);if(i||a){(async()=>{let e=l.querySelector(`[data-crx-control-status]`),t=()=>{try{globalThis.chrome?.runtime?.sendMessage?.({type:`cwsp-control-session-changed`})}catch{}};try{let n=await C(()=>import(`./crx-control-session-DduCgqUH.js`),[],import.meta.url);if(a){await n.clearCrxControlSession(),e&&(e.textContent=await n.formatCrxControlSessionStatus()),o(`Control unpaired — Copy & Share / Paste by CWSP disabled.`,{tone:`warn`}),t();return}let r=String(l.querySelector(`[data-field="shell.localHubUrl"]`)?.value||``).trim(),i=String(document.documentElement.dataset.cwspControlOrigin||``).trim();e&&(e.textContent=`Control: waiting for pairing dialog…`),o(`Enter public token + device code in the pairing dialog…`);let s=await n.pairCrxControlWithModal({localHubUrl:r,preferredOrigins:i?[i]:[]});if(s.cancelled){e&&(e.textContent=await n.formatCrxControlSessionStatus()),o(`Pairing cancelled.`);return}e&&(e.textContent=s.ok?await n.formatCrxControlSessionStatus():`Control: ${s.error}`),s.ok?(o(`Paired Control at ${s.session.controlHost} (persistent).`),t()):o(s.error,{tone:`warn`})}catch(e){o(`Control pairing unavailable: ${e instanceof Error?e.message:String(e)}`,{tone:`warn`})}})();return}let s=n?.closest?.(`button[data-action="control-pairing-refresh"]`),c=n?.closest?.(`button[data-action="control-public-token-regenerate"]`);if(s||c){let e=!!t?.isTrusted;(async()=>{try{let t=String(location.hostname||``);if(location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`){e&&o(`Pairing codes are shown on the device (phone/desk), not in the public Control SPA.`,{tone:`warn`});return}}catch{}let t=l.querySelector(`input[data-control-device-code], [data-control-device-code]`),n=l.querySelector(`input[data-control-public-token], [data-control-public-token]`),r=l.querySelector(`[data-secret-meta="control-device-code"]`),i=l.querySelector(`[data-secret-meta="control-public-token"]`),a=e=>{let a=String(e.deviceCode||``).trim(),o=Math.max(1,Math.round(Number(e.expiresInMs||0)/1e3)),s=String(e.publicToken||``).trim();t instanceof HTMLInputElement?t.value=a:t&&(t.textContent=a?`Code: ${a} (${o}s)`:`Code: …`),n instanceof HTMLInputElement?n.value=s:n&&(n.textContent=s?`Public token: ${s}`:`Public token: …`),r&&(r.textContent=a?`Expires in ${o}s`:``),i&&(i.textContent=s?`Stable until regenerated`:``)};try{e&&o(c?`Regenerating public token…`:`Refreshing pairing code…`,{tone:`warn`});try{let{invokeCwsNative:t}=await C(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),n=await t(c?`control:public-token:regenerate`:`control:pairing:status`,{}),r=n?.controlPairing||n?.echo||{};if(r?.deviceCode||r?.publicToken){a(r),e&&o(c?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`});return}}catch{}let t=globalThis,n=Number(t.__CWSP_CONTROL_PORT__||29110)||29110,r=String(t.__CWSP_CONTROL_API_KEY__||`cwsp-neutralino-local`).trim(),i=await fetch(`http://127.0.0.1:${n}${c?`/service/pair/regenerate-public-token`:`/service/pair/display`}`,{method:c?`POST`:`GET`,headers:{Accept:`application/json`,"Content-Type":`application/json`,"X-API-Key":r},body:c?`{}`:void 0});if(!i.ok)throw Error(`Control HTTP ${i.status}`);a(await i.json()),e&&o(c?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`})}catch(t){e&&o(String(t?.message||t||`Pairing status unavailable`),{tone:`err`})}})();return}let u=n?.closest?.(`button[data-action="files-storage-pick-saf"]`),d=n?.closest?.(`button[data-action="files-storage-clear-saf"]`),f=n?.closest?.(`button[data-action="files-storage-show-paths"]`),m=n?.closest?.(`button[data-action="files-storage-share-readme"]`),_=n?.closest?.(`button[data-action="files-storage-open-explorer"]`),b=n?.closest?.(`button[data-action="files-storage-perm-status"]`),w=n?.closest?.(`button[data-action="files-storage-request-media"]`),T=n?.closest?.(`button[data-action="files-storage-request-all-files"]`);if(u||d||f||m||_||b||w||T){(async()=>{try{let{invokeCwsNative:e}=await C(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),t=await _e(),n=l.querySelector(`[data-files-saf-uri]`),r=l.querySelector(`[data-files-storage-paths]`),i=l.querySelector(`[data-files-perm-status]`),a=e=>{if(!n)return;let t=String(e||``).trim();n.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`},s=e=>{i&&(i.textContent=`Media/storage runtime: ${e.runtimeGranted===!0?`granted`:`missing`}`+(e.missingRuntime?` (${e.missingRuntime})`:``)+`\nAll-files access: ${e.allFilesAccess===!0?`granted`:`not granted`}`+(e.note?`\n${e.note}`:``))};if(d){t.shell={...t.shell||{},filesIncomingDir:``,filesLandingMode:t.shell?.filesLandingMode||`app`},await me(t),a(``),o(`SAF folder cleared.`,{tone:`ok`});return}let c=u?`files:storage:pick-landing`:m?`files:storage:share-readme`:_?`files:storage:open-explorer`:w?`files:storage:request-media`:T?`files:storage:request-all-files`:b?`files:storage:permissions-status`:`files:storage:status`,f=l.querySelector(`[data-field="shell.filesStagingRoot"]`),p=l.querySelector(`[data-field="shell.filesLandingMode"]`);o(u?`Opening folder picker…`:_?`Opening CWSP Files…`:w?`Requesting media permission…`:T?`Opening all-files settings…`:`Reading storage…`,{tone:`warn`});let h=await e(c,{stagingRoot:f?.value||t.shell?.filesStagingRoot||`app`,landingMode:p?.value||t.shell?.filesLandingMode||`app`,incomingDir:t.shell?.filesIncomingDir||``}),g=h?.echo||h?.envelope?.payload||{},v=g?.error||h?.error||(!h?.ok&&!g?.outgoingDir&&!g?.documentUri&&g?.runtimeGranted===void 0?`storage action failed`:``);if(v){o(String(v),{tone:`err`});return}if(u&&g?.incomingDir){t.shell={...t.shell||{},filesIncomingDir:String(g.incomingDir),filesLandingMode:`saf`},await me(t),p&&(p.value=`saf`),a(String(g.incomingDir)),o(`SAF folder saved. Landing mode set to SAF.`,{tone:`ok`});return}(g.runtimeGranted!==void 0||g.allFilesAccess!==void 0)&&s(g),r&&(g?.outgoingDir||g?.incomingAppDir||g?.readmePath||g?.note)&&(r.textContent=`Outgoing temp: ${g.outgoingDir||`?`}\nIncoming temp: ${g.incomingAppDir||`?`}\nLanding mode: ${g.landingMode||`?`}`+(g?.incomingDir?`\nSAF: ${g.incomingDir}`:``)+(g?.note&&g.runtimeGranted===void 0?`\n${g.note}`:``)),o(m?`Shared README — open it in another app to see the paths.`:_?`Opened document picker — look for CWSP Files (or Files app sidebar).`:T?`Enable “Allow access to manage all files”, then tap Refresh status.`:w?`Media permission dialog finished — see status.`:`Status updated.`,{tone:`ok`})}catch(e){o(String(e?.message||e||`Files storage action failed`),{tone:`err`})}})();return}let ue=n?.closest?.(`button[data-action="apk-update-check"]`),D=n?.closest?.(`button[data-action="apk-update-install"]`);if(ue||D){let e=D?`app:update:install`:`app:update:check`;(async()=>{o(D?`Downloading APK…`:`Checking for update…`,{tone:`warn`});try{let t=await _e(),n=l.querySelector(`[data-field="shell.apkUpdateSource"]`),r=l.querySelector(`[data-field="core.endpointUrl"]`),i=l.querySelector(`[data-field="core.ecosystemToken"]`),a=l.querySelector(`[data-field="core.allowInsecureTls"]`),s=l.querySelector(`[data-apk-local-version]`),c=(n?.value||t.shell?.apkUpdateSource||`wan`).trim(),u=(r?.value||t.core?.endpointUrl||``).trim(),d=(i?.value||``).trim()||se(t),f=a?.checked??!!t.core?.allowInsecureTls,{invokeCwsNative:p}=await C(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),m=await p(e,{...g(),source:c,endpointUrl:u,token:d,ecosystemToken:d,allowInsecureTls:f}),h=m?.echo||m?.envelope?.payload||{},_=h?.error||m?.error||(!m?.ok&&!m?.echo?`update failed`:``);if(_){o(String(_),{tone:`err`});return}if(s&&(h?.localVersionCode!=null||h?.localVersionName)){let e=String(h?.localSignatureSha256||``).slice(0,12);s.textContent=`Installed: ${h.localVersionName||`?`} (${h.localVersionCode??`?`})`+(e?` · sig ${e}…`:``)}if(D){o(h?.launchedInstaller?`Installer launched — confirm on the system prompt.`:`Install request sent.`,{tone:`ok`});return}let v=h?.localVersionCode??`?`,y=h?.remoteVersionCode??`?`,b=h?.updateAvailable===!0;if(h?.signatureCompatible===!1){o(`Signature mismatch — remote APK not signed like this install (local ${v}, remote ${y}).`,{tone:`err`});return}o(b?`Update available: ${v} → ${y} (${h?.remoteVersionName||`?`}).`:`Up to date (local ${v}, remote ${y}).`,{tone:b?`warn`:`ok`})}catch(e){o(String(e?.message||e),{tone:`err`})}})();return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{o(`Saving…`,{tone:`warn`});let t=await _e(),n=t.appearance?.markdown?.extensions||[],r=h(`markdown`)&&ut?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){H(`markdown`),o(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:h(`ai`)?{baseUrl:v?.value?.trim?.()||``,apiKey:y?.value?.trim?.()||``,model:x?.value||`gpt-5.6-luna`,customModel:x?.value===`custom`&&S?.value?.trim?.()||``,defaultReasoningEffort:ee?.value||`medium`,defaultVerbosity:te?.value||`medium`,maxOutputTokens:L(re?.value,4e5),contextTruncation:ie?.value||`disabled`,promptCacheRetention:ae?.value||`in-memory`,maxToolCalls:L(oe?.value,8),parallelToolCalls:(E?.checked??!0)!==!1,requestTimeout:{low:L(ce?.value,6e4),medium:L(le?.value,3e5),high:L(fe?.value,9e5)},maxRetries:L(pe?.value,2),shareTargetMode:be?.value||`recognize`,autoProcessShared:(Se?.checked??!0)!==!1,responseLanguage:O?.value||`auto`,translateResults:!!Ce?.checked,generateSvgGraphics:!!Te?.checked,mcp:h(`mcp`)?Lt(V):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:h(`ai`)?{language:k?.value||`en-US`}:t.speech||{},core:h(`server`)?{...t.core,ntpEnabled:z(dt,!!t.core?.ntpEnabled),mode:R(ft,t.core?.mode||`native`)||`native`,endpointUrl:R(pt,t.core?.endpointUrl||``),userId:R(mt,t.core?.userId||``),ecosystemToken:R(N,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||R(M,t.core?.userKey||``)||R(I,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:R(N,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||R(M,t.core?.userKey||``)||R(I,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:z(gt,!!t.core?.encrypt),preferBackendSync:z(ht,(t.core?.preferBackendSync??!0)!==!1),appClientId:R(_t,t.core?.appClientId||``),allowInsecureTls:z(P,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:!0,socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=R(N,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||R(M,t.core?.userKey||``)||R(I,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:R(Tt,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:R(Et,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:z(Dt,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:R(xt,t.core?.admin?.httpsOrigin||``),httpOrigin:R(St,t.core?.admin?.httpOrigin||``),path:R(Ct,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:z(F,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:h(`server`)?{...t.shell||{},maintainHubSocketConnection:z(Ot,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:R(At,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:z(Ft,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=zt?.value,n=L(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:z(Vt,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:z(Ut,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:R(Wt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:z(Gt,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:R(B,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:z(qt,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:z(Jt,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!Oe()&&z(en,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!Oe()&&z(nn,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:z(an,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:h(`appearance`)||h(`markdown`)?{theme:Ee?.value||`auto`,fontSize:A?.value||`medium`,color:$t(l),colorSource:Xt(l),markdown:{preset:Me?.value||`default`,fontFamily:Ne?.value||`system`,fontSizePx:L(Pe?.value,16),lineHeight:Nt(Fe?.value,1.7,1.1,2.2),contentMaxWidthPx:L(Ie?.value,860),printScale:Nt(Le?.value,1,.5,1.5),page:{size:Re?.value||`auto`,orientation:ze?.value||`portrait`,marginMm:L(j?.value,12)},modules:{typography:(Be?.checked??!0)!==!1,lists:(Ve?.checked??!0)!==!1,tables:(Ue?.checked??!0)!==!1,codeBlocks:(Xe?.checked??!0)!==!1,blockquotes:($e?.checked??!0)!==!1,media:(tt?.checked??!0)!==!1,printBreaks:(rt?.checked??!0)!==!1},plugins:{smartTypography:!!at?.checked,softBreaksAsBr:!!ot?.checked,externalLinksNewTab:(st?.checked??!0)!==!1},customCss:ct?.value||``,printCss:lt?.value||``,extensions:n||[]}}:t.appearance||{}};Vr(l,i,p),await $r(i);let a=i,s=p.surface===`capacitor`||p.surface===`native`?ne(a).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),c=await me(a);if(!c){o(`Settings save returned no data.`,{tone:`err`});return}let u=!1;try{u=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cwsp-control`||/^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname||``))}catch{u=!1}try{if(u){let e=globalThis.__CWSP_ENSURE_CONTROL_FOR_SAVE__;if(typeof e==`function`){let t=await e();if(!t?.ok){ye(!1,t?.error||`Control not paired`),o(t?.error||`Pair phone Control (token + code + Accept) before Save`,{tone:`warn`});return}}}await Xr(l,c,p),u&&globalThis.__CWSP_CONTROL_BRIDGE_LIVE__&&ye(!0)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e);let t=e instanceof Error?e.message:String(e);if(u&&ye(!1,t),/pairing|unauthorized|401|403|Control/i.test(t)){o(t,{tone:`warn`});return}}Br(l,c,p);let d=he(),f=await s,m=f.lines,g=f.results.some(e=>e.granted===!1);C(()=>import(`./hub-socket-boot-DHoAK4lQ.js`).then(e=>(e.r(),e.n)).then(async e=>{if(u){try{globalThis.__CWSP_CONTROL_BRIDGE_LIVE__||console.warn(`[Settings] Control not paired — settings saved locally only; pair to push to device`)}catch{}return}if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis;if(e.__CWS_NODE_CLIPBOARD_HUB__===!1)return;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.host||`127.0.0.1`).trim()||`127.0.0.1`;if(n===8434&&r!==`127.0.0.1`&&r!==`localhost`||n!==29110)return;let i=String(t?.key||`cwsp-neutralino-local`),a=c.core,o=String(a?.ecosystemToken||a?.userKey||a?.socket?.accessToken||``).trim(),s={};a?.endpointUrl&&(s.remoteHost=String(a.endpointUrl).trim()),o&&(s.accessToken=o,s.clientToken=o),a?.userId&&(s.clientId=String(a.userId).trim()),s.force=!0,await fetch(`http://${r}:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":i},body:JSON.stringify(s),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await C(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(c),C(()=>import(`./hub-socket-boot-DHoAK4lQ.js`).then(e=>(e.s(),e.u)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),we(c),e.onTheme?.(c.appearance?.theme||`auto`);let _=[`Saved locally`];d.nativeSynced===!0?_.push(`synced to Android`):d.nativeSynced===!1&&!g?console.warn(`[Settings] native settings patch:`,d.nativeError||`not confirmed`):d.nativeSynced===!1&&_.push(`native sync failed${d.nativeError?`: ${d.nativeError}`:``}`);let b=(()=>{try{return String(globalThis.__CWSP_CONTROL_VIA__||``)}catch{return``}})(),w=b===`android`?`phone Control (Capacitor)`:b===`neutralino`?`desk Control (Neutralino)`:u?`Control`:`desk Control`;d.webnativeSynced===!0?_.push(`synced to ${w}`):d.webnativeSynced===!1&&_.push(`${w} sync failed${d.webnativeError?`: ${d.webnativeError}`:``}`),m.length&&_.push(...m);let T=`ok`;(g||d.webnativeSynced===!1)&&(T=`warn`),o(_.join(` · `),{tone:T})})().catch(e=>o(String(e),{tone:`err`}))}),e.isExtension){ln&&(ln.hidden=!1),un&&(un.hidden=!1);let e=D`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`,t=l.querySelector(`.settings-screen__footer`);t?t?.insertAdjacentElement?.(`beforebegin`,e):l.append(e)}let gn=pn(e.initialTab);if(H(gn),!l.querySelector(`.settings-screen__body > [data-tab-panel="${gn}"]:not([hidden])`)){let e=l.querySelector(`.settings-screen__body > [data-tab-panel]`);e&&H(e.getAttribute(`data-tab-panel`)||gn)}xe();let _n=l.querySelectorAll(`.settings-screen__body > [data-tab-panel]`).length,vn=l.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${m} surface=${p.surface} tabs=${vn} panels=${_n} active=${l.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(_n===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,l.querySelector(`.settings-screen__body`)?.appendChild(e),H(`cwsp`)}return l.addEventListener(`cwsp-settings-resync`,()=>{vt(l),H(l.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||gn)}),$=l,l}})))()}function ai(e){return new si(e)}var oi,si;function ci(){return(ci=e((()=>{be(),n(),pt(),P(),ii(),ei(),G(),Ae(),S(),oi={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},si=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=Se(oi);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.syncHubSectionFromLocation(),this.refreshLauncherSiblingNav(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext;try{globalThis.addEventListener(`route-change`,this.onHubSettingsRoute),globalThis.addEventListener(`popstate`,this.onHubSettingsRoute),globalThis.addEventListener(`cwsp-settings-section`,this.onHubSettingsRoute)}catch{}}onHubSettingsRoute=()=>{this.syncHubSectionFromLocation()};render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=this.isExtensionRuntime(),n=this.resolveAreaSection(e?.params?.section);return n&&this.element&&this.element.dataset.hubSettingsSection!==n&&(ti(),this.element=null),this.element?this.element:(this.element=ri({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,hubSection:n,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>vt(this.element)),this.element)}getToolbar(){return null}isExtensionRuntime(){return globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id}resolveAreaSection(e){let t=Ge();if(t)return qe(e||t);if(Er()===`launcher`)return qe(e||tt()||`hub`)}async refreshLauncherSiblingNav(){if(Er()!==`launcher`)return;let e=Dr(),t=await Or();kr(e,t)||this.remountSettings(this.resolveAreaSection()||`hub`)}remountSettings(e){if(!this.element)return;let t=this.element.parentNode;ti();let n=ri({isExtension:this.isExtensionRuntime(),hubSection:e,initialTab:this.options.params?.tab||this.options.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}});t?.replaceChild(n,this.element),this.element=n,queueMicrotask(()=>vt(this.element))}syncHubSectionFromLocation(){if(!this.element)return;let e=this.resolveAreaSection();e&&this.element.dataset.hubSettingsSection!==e&&this.remountSettings(e)}setupEventHandlers(){}loadSettings(){this.settings.value={...oi}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...oi},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){vt(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(t(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===mt.Patch||e===mt.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([C(()=>import(`./Settings-BDKPLgrl.js`).then(e=>(e.a(),e.t)),[],import.meta.url),C(()=>import(`./Theme-sOwwvTGD.js`).then(e=>(e.r(),e.t)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}})))()}ci();export{si as SettingsView,Br as applyContributions,Ie as clearSettingsSyncArms,Vr as collectContributions,ze as createMemorySettingsSyncArm,ri as createSettingsView,ai as createView,ai as default,Ne as detectSettingsSurface,mn as getSettingsContributions,ke as getSettingsDefaults,Le as getSettingsSnapshot,j as getSettingsSync,Yr as hydrateContributionsFromSync,Pe as mergeSettingsPatch,Rr as mountContributions,Be as patchSettingsSync,Xr as persistContributionsViaSync,Or as refreshInstalledSiblingSettingsSections,xr as registerBuiltinSettingsContributions,Vn as registerCwspSettingsContribution,Un as registerDeviceSettingsContribution,Gn as registerReaderSettingsContribution,W as registerSettingsContribution,je as registerSettingsSyncArm,qn as registerWorkcenterSettingsContribution,ti as resetSettingsViewCache,Pr as resolveSettingsSurface,Me as resolveSettingsSyncArm,Re as setSurfaceDetector,Fe as unregisterSettingsSyncArm};