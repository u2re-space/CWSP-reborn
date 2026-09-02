import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{$t as t,Gt as n,Ht as r,Jt as i,Rt as a,an as o,en as s,fn as c,ft as l,j as u,k as d,t as f}from"./src-C8p-yYHh.js";import{c as p,f as m,g as h,h as g,i as _,l as v,m as y,r as b,s as ee,u as te}from"./ecosystem-skus-Bz92tN57.js";import{a as ne,n as re,r as ie,t as x}from"./history-base-CizxJDYD.js";import{_ as S,a as C,c as w,d as T,f as E,l as ae,u as oe}from"./registry-1BhElAAe.js";import{n as D,t as O}from"./preload-helper-DFTwEg7x.js";import{n as se,t as ce}from"./templates-C66WQ7dZ.js";import{a as le,d as ue}from"./UnifiedMessaging-D97RqiW3.js";import{r as de}from"./BootLoader-DGb4ebxG.js";import{B as fe,K as pe}from"./airpad-cwsp-client-parity-CetAcicq.js";import{c as me,m as he,n as ge,o as _e,y as ve}from"./open-policy-DV4wO_gQ.js";import{a as ye,i as be,r as k,t as xe}from"./SettingsTypes-COvJs73b.js";import{c as Se,o as Ce,t as A}from"./process-ingress-Dk4cinzN.js";import{t as we,v as Te}from"./remote-connection-runtime-BIgCjW4a.js";import{a as Ee,c as De,i as Oe,n as ke,o as Ae,r as je,s as Me}from"./Settings-BdjZKlQM.js";import{c as Ne,l as Pe,n as Fe,o as Ie,r as Le,s as Re,u as ze}from"./Theme-CppsnuLy.js";import{n as Be,r as Ve}from"./capacitor-permissions-DeazvCZP.js";import{i as He,r as Ue}from"./capacitor-settings-permissions-DkzN5Fmd.js";import{a as We,c as Ge,d as Ke,f as qe,i as Je,l as Ye,m as Xe,n as Ze,o as Qe,p as $e,r as et,s as tt,u as nt}from"./web-DO9A9aFx.js";import{s as rt}from"./icon-CJpUOiBC.js";import{a as it,c as at,d as ot,f as st,h as ct,i as lt,l as ut,m as dt,n as ft,o as pt,p as mt,r as ht,s as gt,u as _t}from"./shells-DieeNVSZ.js";import{c as vt,i as yt,l as bt,n as xt,o as j,r as St,s as Ct}from"./CustomInstructions-B89zkbIy.js";import{i as wt,n as Tt,r as Et}from"./admin-doors-DKuDENp1.js";import{n as Dt}from"./registry-BDUaTly8.js";import{a as Ot,r as kt}from"./channel-actions-DkmBPovk.js";function At(){return(At=e((()=>{})))()}var jt,Mt,M,Nt,Pt;function Ft(){return(Ft=e((()=>{a(),At(),jt=`data-settings-view-css`,Mt=e=>c(String(e||``),`settings-view`),M=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;grid-template-columns:minmax(0,1fr)!important;inline-size:100%!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;pointer-events:auto!important;container-type:inline-size}
.view-settings .settings-screen__top{display:flex!important;flex-direction:column!important;align-items:stretch!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;pointer-events:auto!important}
.view-settings .settings-tab-actions{display:flex!important;flex-wrap:nowrap!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;overflow-x:auto!important;overflow-y:hidden!important;pointer-events:auto!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch;pointer-events:auto!important}
.view-settings .settings-screen__body>[data-tab-panel]:not(.is-active),.view-settings .settings-screen__body>[data-tab-panel][hidden]{display:none!important}
.view-settings .settings-screen__body>[data-tab-panel].is-active:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important;pointer-events:auto!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select,.view-settings .btn,.view-settings .card{pointer-events:auto!important}
.view-settings .settings-tab-btn{pointer-events:auto!important;cursor:pointer!important;flex:0 0 auto!important}
`,Nt=e=>{if(e&&!e.classList?.contains(`view-settings`)||typeof document>`u`)return;if(document.head?.querySelector(`style[${jt}]`)){e&&t(e);return}let n=Mt(`/* Settings view — self-contained stylesheet.
 * INVARIANT: Works inside open shadow roots: no reliance on \`html:has(...)\`, \`:root:has(...)\`,
 * or \`html[data-active-view]\` for paint. Uses inherited \`color-scheme\` + \`light-dark()\` fallbacks
 * wherever \`--color-*\` Veela tokens are absent on first paint.
 * WHY: Lock \`color-scheme\` to app theme so fallbacks do not follow OS while Veela is light.
 *
 * NOTE: \`--sv-*\` are a view-specific semantic layer DERIVED from canonical \`--color-*\`
 * (source of truth: veela \`core/misc/_tokens.scss\`). The \`light-dark()\` fallbacks are kept
 * for shadow-DOM self-sufficiency when veela is not loaded — do not remove.
 */
@layer components {
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
    /* WHY: WebView often has CSS anchor but not \`clip-path: shape()\`.
     * The frame then becomes a solid \`position:fixed\` fill over Appearance
     * and can stay on top after navigating back to Explorer. */
  }
  @supports (clip-path: shape(evenodd from 0 0)) {
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
  .view-settings .apk-update-fleet-row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-block: 0.35rem 0.75rem;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    background: var(--sv-surface-1, light-dark(#f4f6f8, #12171e));
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 45%, transparent);
  }
  .view-settings .apk-update-fleet-row h4 {
    margin: 0;
    font-size: 0.95rem;
  }
  .view-settings .apk-update-fleet-row .field-hint {
    margin-block-end: 0.25rem;
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
}`);n.trim()||(n=M);let r=document.createElement(`style`);r.setAttribute(jt,``),r.textContent=n,document.head?.appendChild(r),e&&t(e)},Pt=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}Nt(e)};e.isConnected?Nt(e):requestAnimationFrame(t)}})))()}function It(){return(It=e((()=>{f()})))()}function Lt(e){x();let t=String(e.view||``).trim().replace(/^\/+/,``).toLowerCase();if(h(t))return y(t)||`/${t}`;let n={...e.params||{}},r;if(t===`settings`){let e=gt(lt(String(n.section||``).trim()));delete n.section,r=ne(e?`/settings/${e}`:`/settings`)}else r=ne(t&&t!==`home`?ie(`/${t}`):`/`);let i=r;if(Object.keys(n).length>0){let e=new URLSearchParams(n).toString();i+=(i.includes(`?`)?`&`:`?`)+e}return i}function Rt(e,t={}){let n=Lt(e);if(h(e.view)||/^https?:\/\//i.test(n)){globalThis.location.assign(n);return}t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function zt(e,t){Rt({view:e,params:t})}function Bt(){return(Bt=e((()=>{de(),oe(),p(),S(),re(),at(),[...ae],E(`home`,w)})))()}function Vt(){return(Vt=e((()=>{})))()}function Ht(){return(Ht=e((()=>{ft(),C(),Dt(),Bt(),de(),Vt()})))()}var Ut,Wt,Gt,Kt,qt,N,Jt,P,F,Yt;function Xt(){return(Xt=e((()=>{Ut=[`en`,`ru`,`en-GB`,`en-US`],Wt=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,Gt=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},Kt=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=Gt(n);t&&e.add(t)}for(let t of Ut)e.add(t);return Array.from(e)},qt=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},N=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},Jt=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},P=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},F=(e,t)=>e?!!e.checked:t,Yt=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})))()}var Zt,Qt,$t;function en(){return(en=e((()=>{f(),Zt=e=>{let t={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return l`<div class="field mcp-row" data-mcp-id=${t.id}>
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
          </div>`},Qt=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},$t=(e,t)=>{if(!e)return;e.replaceChildren();let n=Array.isArray(t)?t:[];if(!n.length){e.appendChild(l`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}n.forEach(t=>e.appendChild(Zt(t)))}})))()}var tn;function nn(){return(nn=e((()=>{f(),tn=()=>l`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})))()}var rn;function an(){return(an=e((()=>{f(),rn=()=>l`<header class="settings-screen__top">
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`})))()}var on,sn,I,cn,ln,L,un,dn,fn,pn,mn;function hn(){return(hn=e((()=>{f(),Ne(),on=[{hex:Ie,label:`Cyan`},{hex:`#4f8eb5`,label:`Steel`},{hex:`#64748b`,label:`Slate`},{hex:`#3b82f6`,label:`Blue`},{hex:`#6366f1`,label:`Indigo`},{hex:`#14b8a6`,label:`Teal`},{hex:`#22c55e`,label:`Green`},{hex:`#f59e0b`,label:`Amber`},{hex:`#ef4444`,label:`Red`},{hex:`#ec4899`,label:`Pink`},{hex:`#8b5cf6`,label:`Violet`}],sn={wallpaper:`From wallpaper`,"material-you":`From Material You`,"system-wallpaper":`From system wallpaper`,"speed-dial":`From Speed Dial wallpaper`,custom:`Custom hue`},I=(e,t)=>{if(e===`auto`)return`Auto (${sn[t]})`;let n=sn[e];return e===t?`${n} (default)`:n},cn=()=>{let e=Re();return l`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
            <option value="auto">${I(`auto`,e)}</option>
            <option value="wallpaper">${I(`wallpaper`,e)}</option>
            <option value="material-you">${I(`material-you`,e)}</option>
            <option value="system-wallpaper">${I(`system-wallpaper`,e)}</option>
            <option value="speed-dial">${I(`speed-dial`,e)}</option>
            <option value="custom">${I(`custom`,e)}</option>
          </select>
        </label>
        <span class="field-hint" data-appearance-source-hint></span>
        <div class="appearance-custom" data-appearance-custom hidden>
          <span>Accent / hue</span>
          <div class="appearance-swatches" role="listbox" aria-label="Accent color">
            ${on.map(e=>l`<button type="button" class="appearance-swatch" data-color="${e.hex}" title="${e.label}" aria-label="${e.label}" style="background:${e.hex}"></button>`)}
          </div>
          <label class="appearance-hue">
            <span>Hue</span>
            <input class="appearance-hue__range" type="range" min="0" max="360" value="200" data-field="appearance.hue" />
          </label>
          <input class="form-input appearance-color-input" type="color" data-field="appearance.color" value="${Ie}" />
        </div>
      </div>
    </section>`},ln={auto:`Uses this app’s default source.`,wallpaper:`Dominant color from the launcher / environment wallpaper.`,"material-you":`Android Material You system accent.`,"system-wallpaper":`Dominant color from the OS desktop wallpaper.`,"speed-dial":`Dominant color from the Speed Dial wallpaper.`,custom:`Manual swatch, hue, or color picker.`},L=e=>{let t=ze(e);if(!t)return 200;let n=parseInt(t.slice(1,3),16)/255,r=parseInt(t.slice(3,5),16)/255,i=parseInt(t.slice(5,7),16)/255,a=Math.max(n,r,i),o=a-Math.min(n,r,i);if(o<1e-4)return 200;let s=0;return s=a===n?(r-i)/o%6:a===r?(i-n)/o+2:(n-r)/o+4,s=Math.round(s*60),s<0?s+360:s},un=e=>{let t=(Number(e)%360+360)%360,n=e=>{let n=(e+t/30)%12,r=.57-.1806*Math.max(Math.min(n-3,9-n,1),-1);return Math.round(255*r).toString(16).padStart(2,`0`)};return`#${n(0)}${n(8)}${n(4)}`},dn=e=>{let t=e.querySelector(`[data-field="appearance.colorSource"]`);return Pe(t?.value)?t.value:`auto`},fn=(e,t)=>{let n=e.querySelector(`[data-field="appearance.colorSource"]`),r=e.querySelector(`[data-appearance-custom]`),i=e.querySelector(`[data-appearance-source-hint]`),a=Pe(t)?t:`auto`;n&&(n.value=a),r&&(r.hidden=a!==`custom`),i&&(i.textContent=ln[a])},pn=(e,t)=>{let n=e.querySelector(`[data-field="appearance.color"]`),r=e.querySelector(`[data-field="appearance.hue"]`),i=ze(t)||`#5a9ec8`;n&&(n.value=i),r&&(r.value=String(L(i))),e.querySelectorAll(`.appearance-swatch`).forEach(e=>{e.setAttribute(`aria-selected`,ze(e.dataset.color)===i?`true`:`false`)})},mn=e=>{let t=e.querySelector(`[data-field="appearance.color"]`);return ze(t?.value)}})))()}var gn;function _n(){return(_n=e((()=>{f(),gn=()=>l`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`})))()}var vn;function R(){return(R=e((()=>{f(),vn=()=>l`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
      <h3>AI</h3>
      <p class="settings-hint">Process chat posts to <code>/api/process</code> (PWA SW, Capacitor Java, then process.u2re.space). Base URL and key below are the same fallback the backends use when core is down.</p>
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
    </section>`})))()}var yn;function bn(){return(bn=e((()=>{f(),yn=()=>l`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})))()}var xn;function z(){return(z=e((()=>{f(),xn=()=>l`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`})))()}var Sn;function Cn(){return(Cn=e((()=>{f(),n(),Ct(),se(),Sn=(e={})=>{let t=i({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),n=l`<div class="custom-instructions-editor">
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
    </div>`,r=n.querySelector(`[data-list]`),a=n.querySelector(`[data-action='select-active']`),o=n.querySelector(`[data-add-form]`),s=n.querySelector(`[data-field='label']`),c=n.querySelector(`[data-field='instruction']`),u=()=>{r.replaceChildren();let n=t.instructions??[];if(!n.length){r.append(l`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of n){let n=t.editingId===i.id,a=t.activeId===i.id,o=l`<div class="ci-item ${a?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${a?l`<span class="ci-badge active">Active</span>`:l`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${n?l`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:l`<div class="ci-item-preview">${f(i.instruction,120)}</div>`}
            </div>`;o.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&vt(i.id).then(p).then(()=>e.onUpdate?.()),r===`edit`&&(t.editingId=i.id,u()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&yt(i.id).then(p).then(()=>e.onUpdate?.()),r===`save-edit`){let n=o.querySelector(`[data-edit-field='label']`),r=o.querySelector(`[data-edit-field='instruction']`);bt(i.id,{label:n.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(t.editingId=null,p())).then(()=>e.onUpdate?.())}r===`cancel-edit`&&(t.editingId=null,u())}),r.append(o)}},d=()=>{a.replaceChildren(),a.append(l`<option value="">None (use default)</option>`);for(let e of t.instructions??[]){let n=l`<option value="${e.id}">${e.label}</option>`;e.id===t.activeId&&(n.selected=!0),a.append(n)}},f=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,p=async()=>{let e=await j(),n=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;t.instructions=n?.instructions??[],t.activeId=n?.activeId??``,u(),d()};return n.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(t.isAdding=!0,o.hidden=!1,s.value=``,c.value=``,s.focus()),r===`cancel-add`&&(t.isAdding=!1,o.hidden=!0),r===`save-new`){let n=s.value.trim(),r=c.value.trim();if(!r){c.focus();return}xt(n||`Custom`,r).then(e=>{if(e)return t.isAdding=!1,o.hidden=!0,p()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let n=new Set((t.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=ce.filter(e=>!n.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}St(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(p).then(()=>e.onUpdate?.())}}),a.addEventListener(`change`,()=>{let t=a.value||``;vt(t||null).then(p).then(()=>e.onUpdate?.())}),p(),n}})))()}var wn;function Tn(){return(Tn=e((()=>{f(),Cn(),wn=e=>l`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${Sn({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})))()}var En;function Dn(){return(Dn=e((()=>{f(),En=()=>l`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
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
    </section>`})))()}var On,B,kn,An,jn,Mn,Nn,Pn;function V(){return(V=e((()=>{On=new Map,B=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return On.set(t,n),()=>{On.get(t)===n&&On.delete(t)}},kn=()=>[...On.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),An=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},jn=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},Mn=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},Nn=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=An(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},Pn=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=Mn(e);r!==void 0&&jn(n,t,r)})}})))()}var H,Fn,U,In,W,G,K,q,Ln,J;function Y(){return(Y=e((()=>{H=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},Fn=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},U=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},In=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},W=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},G=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},K=(e,t,n)=>{let r=document.createElement(`button`);return r.type=`button`,r.className=n?.className||(n?.primary?`view-settings__btn view-settings__btn--primary`:`view-settings__btn`),r.setAttribute(`data-action`,t),r.textContent=e,r},q=(...e)=>{let t=document.createElement(`div`);t.className=`field settings-action-row`,t.style.display=`flex`,t.style.flexWrap=`wrap`,t.style.gap=`0.5rem`;for(let n of e)t.appendChild(n);return t},Ln=(e,t,n)=>{let r=document.createElement(`div`);r.className=`field settings-secret-field`,r.setAttribute(`data-secret-field`,t);let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`div`);a.style.cssText=`display:flex;gap:.4rem;align-items:center;margin-top:.3rem;`;let o=document.createElement(`input`);o.className=`form-input`,o.type=`password`,o.readOnly=!0,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=n?.placeholder||`••••••`,o.setAttribute(`data-${t}`,`1`),o.setAttribute(`data-secret-input`,t),o.value=``,n?.mono?(o.style.fontFamily=`ui-monospace, SFMono-Regular, Menlo, monospace`,o.style.fontSize=`0.9rem`,o.style.letterSpacing=`0.04em`):(o.style.fontSize=`1.15rem`,o.style.fontWeight=`700`,o.style.letterSpacing=`0.12em`),o.style.flex=`1 1 auto`,o.style.minWidth=`0`;let s=document.createElement(`button`);s.type=`button`,s.className=`view-settings__btn`,s.textContent=`View`,s.title=`Show / hide`,s.setAttribute(`data-action`,`control-secret-toggle`),s.setAttribute(`data-secret-for`,t);let c=document.createElement(`button`);c.type=`button`,c.className=`view-settings__btn`,c.textContent=`Copy`,c.title=`Copy to clipboard`,c.setAttribute(`data-action`,`control-secret-copy`),c.setAttribute(`data-secret-for`,t);let l=document.createElement(`p`);l.className=`field-hint`,l.setAttribute(`data-secret-meta`,t),l.style.margin=`0.2rem 0 0`,l.textContent=``;let u=()=>{let e=o.dataset.revealed===`1`;o.type=e?`text`:`password`,s.textContent=e?`Hide`:`View`};return s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),o.dataset.revealed=o.dataset.revealed===`1`?`0`:`1`,u()}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=String(o.value||``).trim();if(t)try{await navigator.clipboard.writeText(t);let e=c.textContent;c.textContent=`Copied`,window.setTimeout(()=>{c.textContent=e||`Copy`},1200)}catch{o.type=`text`,o.select();try{document.execCommand(`copy`)}catch{}u()}}),a.append(o,s,c),r.append(i,a,l),r},J=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(Fn(e)):r.appendChild(e);return r}})))()}var Rn,zn,Bn,Vn,Hn,Un,Wn;function Gn(){return(Gn=e((()=>{V(),p(),Y(),Rn=[{sku:`explorer`,label:`Explorer`},{sku:`document`,label:`Document`},{sku:`process`,label:`Process`},{sku:`transfer`,label:`Transfer`}],zn=e=>e.sku||g(),Bn=(e,t)=>{let n=document.createElement(`p`);return n.className=`field-hint`,n.setAttribute(`data-apk-local-version`,`1`),n.setAttribute(`data-apk-sku`,e),n.textContent=t,n},Vn=e=>{let t=K(`Check`,`apk-update-check`),n=K(`Download & install`,`apk-update-install`,{primary:!0});return t.setAttribute(`data-apk-sku`,e),n.setAttribute(`data-apk-sku`,e),q(t,n)},Hn=(e,t)=>{let n=document.createElement(`div`);n.className=`apk-update-fleet-row`,n.setAttribute(`data-apk-sku-row`,e);let r=document.createElement(`h4`);r.textContent=t;let i=_(e);return n.append(r,Bn(e,`Not checked — tap Check`),Vn(e),H(e===`transfer`?`Reads ${i} (ecosystem token). Newer versionCode or versionName is an update.`:`Reads ${i}. Newer versionCode or versionName is an update.`)),n},Un=e=>{let t=zn(e),n=t?_(t):``,r=g(),i=String(e.hubSection||`hub`),a=r===`launcher`&&t&&t!==`launcher`,o=r===`launcher`&&(!e.hubSection||i===`hub`),s=a?t===`transfer`?"Updates CWSP-transfer (`latest.json` / space.u2re.cwsp). Needs ecosystem token.":`Updates the installed ${t} APK (${n||`channel`}).`:t===`launcher`?`This launcher reads latest-launcher.json. Other ecosystem APKs are listed below when this is the Shell APK.`:t===`transfer`?`This hub APK reads latest.json (ecosystem token). Other SKUs are not installed from here.`:n?`This app reads ${n} for its own APK only.`:`Checks the gateway release that matches this installed package.`,c=[o?`This launcher`:`App update (dev)`,Bn(t||`launcher`,`Installed version: … (tap Check to refresh)`),G(`Update source`,`shell.apkUpdateSource`,[[`wan`,`WAN — https://45.147.121.152:8434`],[`lan`,`LAN — https://192.168.0.200:8434`],[`relay`,`Current Relay (core.endpointUrl)`]]),Vn(t||`launcher`),H(s)];if(o){c.push(`Ecosystem APKs`,H(`Check or install Explorer, Document, Process, and Transfer from this launcher.`));for(let e of Rn)c.push(Hn(e.sku,e.label))}return c},Wn=()=>B({id:`apk-update`,label:`Updates`,order:90,surfaces:[`capacitor`,`native`,`environment`],render:e=>J(`apk-update`,`Updates`,Un(e)),load:(e,t)=>{let n=t.querySelector(`[data-field="shell.apkUpdateSource"]`);if(n){let t=String(e.shell?.apkUpdateSource||`wan`).trim();n.value=t===`lan`||t===`relay`?t:`wan`}}})})))()}var Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir;function ar(){return(ar=e((()=>{V(),k(),Y(),D(),Kn=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,qn=`L-110`,Jn=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),Yn=(...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!Jn(e))return e}return qn},Xn=e=>{let t=e.surface===`crx`||!!e.isExtension,n=[H(t?`CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field.`:`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,U(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434;https://45.147.121.152:8434`),H(t?`Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control).`:"Coordinator / gateway. Multi-hub: separate with `;` or `,` (never `:`). Always include :8434 — bare host dials :443 where /ws is not served (404)."),U(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),H(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`)];return t?n.push(U(`Client id (Neutralino / backend)`,`shell.clientId`,`L-110`),H(`Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx).`)):n.push(U(`Client id`,`core.userId`,`L-196 or L-110`),H(`Short fleet id (L-196, L-210, …).`)),n.push(U(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),H(t?`Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login).`:`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),U(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),H(Kn),W(`Allow insecure TLS`,`core.allowInsecureTls`)),n},Zn=()=>[`Clipboard`,W(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),W(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),U(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),H(Kn),U(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),H(Kn),`Clipboard prompt`,G(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),G(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),W(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),W(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),In(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),H(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],Qn=e=>{let t=[`Files transfer`,H("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),W(`Accept inbound files`,`shell.acceptInboundFilesData`),U(`Default destination ids`,`shell.filesShareDestinationIds`,`L-196;L-210 (empty = picker)`),H(Kn),W(`Allow share to all (*)`,`shell.filesAllowShareToAll`),H(`SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out.`),G(`Open for share`,`shell.filesOpenForShareMode`,[[`auto`,`Auto — offer when destinations are set`],[`manual`,`Manual — always ask for destinations`]]),G(`Inbound accept`,`shell.filesInboundMode`,[[`ask`,`Ask — Accept / Decline prompt`],[`auto`,`Auto — accept into landing folder`]]),W(`Copy received files to clipboard (for Paste / re-share)`,`shell.filesCopyOnReceive`),H(`Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default.`),G(`Byte transport hint`,`shell.filesByteTransport`,[[`auto`,`Auto — receiver chooses`],[`http`,`HTTP blob GET/PUT`],[`ws`,`WebSocket chunks`]]),H(`Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.`)];if(e.surface===`capacitor`||e.surface===`native`){let e=document.createElement(`p`);e.className=`field-hint`,e.setAttribute(`data-files-saf-uri`,`1`),e.textContent=`SAF folder: (not set)`;let n=document.createElement(`p`);n.className=`field-hint`,n.setAttribute(`data-files-storage-paths`,`1`),n.style.whiteSpace=`pre-wrap`,n.textContent=`Staging / landing paths: tap Show paths.`,t.push(`Files storage (Capacitor)`,G(`Save received files to`,`shell.filesLandingMode`,[[`app`,`App storage (private — default)`],[`downloads`,`Downloads (user-visible)`],[`saf`,`SAF folder (pick below)`]]),H(`App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README.`),e,q(K(`Choose SAF folder`,`files-storage-pick-saf`,{primary:!0}),K(`Clear SAF folder`,`files-storage-clear-saf`)),W(`Ask for folder every time if SAF unset`,`shell.filesAskDirEveryTime`),G(`Temp staging place`,`shell.filesStagingRoot`,[[`app`,`App internal (files/) — default`],[`cache`,`App cache (may be purged)`],[`external`,`App external (Android/data/… — OEM may hide)`]]),H(`Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above.`),n,q(K(`Show paths`,`files-storage-show-paths`),K(`Browse CWSP Files…`,`files-storage-open-explorer`),K(`Share README…`,`files-storage-share-readme`)),`File access permissions`,(()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-files-perm-status`,`1`),e.style.whiteSpace=`pre-wrap`,e.textContent=`Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.`,e})(),q(K(`Refresh status`,`files-storage-perm-status`),K(`Request media access`,`files-storage-request-media`,{primary:!0}),K(`Allow manage all files…`,`files-storage-request-all-files`)),H(`All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish.`))}return t},$n=()=>[`Native wire (Capacitor)`,W(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),W(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],er=()=>[`Control pairing`,Ln(`Public token`,`control-public-token`,{mono:!0,placeholder:`••••••••••••`}),Ln(`Device code (20s, +10s grace)`,`control-device-code`,{placeholder:`••••••`}),q(K(`Refresh code`,`control-pairing-refresh`),K(`Regenerate public token`,`control-public-token-regenerate`)),H(`Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.`)],tr=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-crx-control-status`,`1`),e.textContent=`Control: …`,[`Control pairing`,e,q(K(`Pair Control…`,`crx-control-pair`,{primary:!0}),K(`Unpair`,`crx-control-unpair`)),H(`Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.`)]},nr=()=>{try{let e=globalThis;if(e.NL_OS!=null||e.NL_PORT!=null||e.Neutralino||e.Capacitor?.isNativePlatform?.())return!1;let t=String(e.Capacitor?.getPlatform?.()||``).toLowerCase();if(t===`android`||t===`ios`)return!1;let n=String(location.hostname||``).toLowerCase();return!n||n===`localhost`||n===`127.0.0.1`||n===`[::1]`?!1:location.protocol===`https:`}catch{return!1}},rr=()=>[`Device`,W(`Start CWSP on boot`,`shell.autoStartOnBoot`),W(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),W(`Allow Control API`,`shell.allowControlApi`),H(`Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password.`),...er(),W(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),W(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),H(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],ir=()=>B({id:`cwsp`,label:`CWSP`,order:55,excludeSurfaces:[`markdown`,`environment`],render:e=>{let t=[...Xn(e),...Zn(),...Qn(e)];return e.surface===`capacitor`||e.surface===`native`?t.push(...$n(),...rr()):e.surface===`crx`||e.isExtension?t.push(...tr()):nr()||t.push(...$n(),...er()),J(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=ye(e));let r=t.querySelector(`[data-field="shell.clientId"]`);if(r){let t=Yn(r.value,e.shell?.clientId,e.core?.userId);r.value=t,e.shell={...e.shell||{},clientId:t}}let i=t.querySelector(`[data-files-saf-uri]`);if(i){let t=String(e.shell?.filesIncomingDir||``).trim();i.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`}let a=t.querySelector(`button[data-action="control-pairing-refresh"]`);if(a){queueMicrotask(()=>a.click());let e=Number(t.__cwspPairTimer||0);e&&clearInterval(e),t.__cwspPairTimer=window.setInterval(()=>{t.isConnected&&a.click()},2500)}let o=t.querySelector(`[data-crx-control-status]`);o&&O(()=>import(`./crx-control-session-D7DIGdNp.js`).then(e=>e.formatCrxControlSessionStatus()),[],import.meta.url).then(e=>{o.isConnected&&(o.textContent=e)}).catch(()=>{o.textContent=`Control: status unavailable`})},save:e=>{be(e),Jn(e.shell?.clientId)&&(e.shell={...e.shell||{},clientId:Yn(e.core?.userId)})}})})))()}var or;function sr(){return(sr=e((()=>{or=()=>()=>void 0})))()}var cr;function lr(){return(lr=e((()=>{V(),Y(),cr=()=>B({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>J(`reader`,`Reader`,[In(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),W(`Wrap long lines`,`views.reader.wrapLongLines`)])})})))()}var X,ur,dr,fr,pr,mr,hr,gr;function _r(){return(_r=e((()=>{V(),_e(),p(),Y(),X=[[`ask`,`Follow default / this app`],[`display`,`Display here`],[`viewer`,`Markdown (in this app)`],[`document`,`CWSP-document`],[`explorer`,`CWSP-explorer`],[`workcenter`,`CWSP-process`],[`transfer`,`CWSP-transfer`],[`wallpaper`,`Wallpaper if it fits, otherwise viewer`],[`external`,`New tab / browser`],[`system`,`Android / system chooser`]],ur=[[`inline`,`Inline window (same tab)`],[`native-window`,`Separate window`],[`new-tab`,`New tab (file as-is)`]],dr=[[`document`,`CWSP-document`],[`system`,`Ask Android (Open with…)`],[`transfer`,`CWSP-transfer`],[`workcenter`,`CWSP-process`]],fr=[[`ask`,`Follow Open / click`],...dr],pr=[[`wallpaper`,`Wallpaper if it fits, otherwise viewer`],[`viewer`,`Markdown (in this app)`],[`document`,`CWSP-document`],[`workcenter`,`CWSP-process`],[`transfer`,`CWSP-transfer`],[`ask`,`Wallpaper if it fits, otherwise pin a shortcut`],[`system`,`Android / system chooser`],[`external`,`New tab / browser`]],mr=(e,t)=>{let n=String(e.hubSection||``).trim(),r=String(e.sku||``).trim(),i=String(e.surface||``).trim();return n===`hub`?!0:n===`document`?t===`viewer`:n===`explorer`?t===`explorer`:n===`process`?t===`process`:n===`transfer`?t===`transfer`:n?t===`shell`:r===`document`||i===`markdown`?t===`viewer`:r===`explorer`?t===`explorer`:r===`process`?t===`process`:r===`transfer`?t===`transfer`:r===`launcher`||i===`environment`?t===`shell`||t===`explorer`:r===`crx`||i===`crx`?t===`crx`||t===`explorer`:!0},hr=(e,t,n)=>[Fn(e),H(t),...n?.map?.(e=>typeof e==`string`?G(e,e,X):e)],gr=()=>B({id:`open-files`,label:`Open & share`,order:22,render:e=>{let t=[H(`Where files go when you open, share, or launch them. “Follow default” keeps the current app’s behavior.`)];if(mr(e,`viewer`)&&t.push(...hr(`Markdown / document`,`Opened, pasted, dropped, or shared into the viewer.`,[G(`When a file opens`,`openPolicy.viewer.channels.open`,X),G(`Share target`,`openPolicy.viewer.channels.share-target`,X),G(`Launch queue`,`openPolicy.viewer.channels.launch-queue`,X),G(`Markdown`,`openPolicy.viewer.kinds.markdown`,X),G(`Text`,`openPolicy.viewer.kinds.text`,X),G(`Documents (PDF, Office)`,`openPolicy.viewer.kinds.document`,X),G(`Images`,`openPolicy.viewer.kinds.image`,X),G(`Other files`,`openPolicy.viewer.kinds.other`,X)])),mr(e,`explorer`)){let n=e.surface===`capacitor`||e.surface===`native`||v();t.push(...hr(`Explorer`,n?`These rows are Android-only. They do not change the site / PWA / CRX. Open / click is CWSP-document or Ask Android; a file-type row overrides it only when it is not “Follow Open / click”.`:`These rows are site / PWA / CRX only. They do not change the Android Explorer APK. Markdown and images open in an inline window unless you pick a separate window or a new tab.`,n?[G(`Open / click`,`openPolicy.explorer.nativeOpen`,dr),G(`Markdown`,`openPolicy.explorer.nativeKinds.markdown`,fr),G(`Text`,`openPolicy.explorer.nativeKinds.text`,fr),G(`Documents`,`openPolicy.explorer.nativeKinds.document`,fr),G(`Images`,`openPolicy.explorer.nativeKinds.image`,fr),G(`Other files`,`openPolicy.explorer.nativeKinds.other`,fr)]:[G(`Open markdown / images in`,`openPolicy.explorer.placement`,ur),G(`Open / click`,`openPolicy.explorer.channels.open`,X),G(`Double-click`,`openPolicy.explorer.channels.dblclick`,X),G(`Markdown`,`openPolicy.explorer.kinds.markdown`,X),G(`Text`,`openPolicy.explorer.kinds.text`,X),G(`Documents`,`openPolicy.explorer.kinds.document`,X),G(`Images`,`openPolicy.explorer.kinds.image`,X),G(`Other files`,`openPolicy.explorer.kinds.other`,X)]))}return mr(e,`shell`)&&t.push(...hr(`Environment / shell`,`Launch queue, Capacitor open-with, share, and drop/paste on the home grid. Per-tile “Open link in” still wins.`,[G(`Share target`,`openPolicy.shell.channels.share-target`,X),G(`Launch queue`,`openPolicy.shell.channels.launch-queue`,X),G(`Capacitor open-with`,`openPolicy.shell.channels.capacitor`,X),G(`Markdown`,`openPolicy.shell.kinds.markdown`,X),G(`Text`,`openPolicy.shell.kinds.text`,X),G(`Documents`,`openPolicy.shell.kinds.document`,X),H(`Images on CWSP-shell: a photo that is large enough and not a strip/icon becomes wallpaper. Anything that does not fit opens in the viewer.`),G(`Images`,`openPolicy.shell.kinds.image`,pr),G(`Links`,`openPolicy.shell.kinds.url`,X)])),mr(e,`crx`)&&t.push(...hr(`Chrome extension`,`Markdown, images, documents, and snip results from CWSP-crx.`,[G(`Markdown`,`openPolicy.crx.kinds.markdown`,X),G(`Documents`,`openPolicy.crx.kinds.document`,X),G(`Images`,`openPolicy.crx.kinds.image`,X),G(`Snip results`,`openPolicy.crx.channels.snip`,X)])),mr(e,`process`)&&t.push(...hr(`Work Center / process`,`Defaults when Work Center is the receiver (share, launch, open-with).`,[G(`Text`,`openPolicy.process.kinds.text`,X),G(`Documents`,`openPolicy.process.kinds.document`,X),G(`Images`,`openPolicy.process.kinds.image`,X),G(`Links`,`openPolicy.process.kinds.url`,X),G(`Share target`,`openPolicy.process.channels.share-target`,X),G(`Launch queue`,`openPolicy.process.channels.launch-queue`,X),G(`Capacitor open-with`,`openPolicy.process.channels.capacitor`,X)])),mr(e,`transfer`)&&t.push(...hr(`Transfer`,`What to do when Transfer receives a type or share.`,[G(`Text`,`openPolicy.transfer.kinds.text`,X),G(`Documents`,`openPolicy.transfer.kinds.document`,X),G(`Images`,`openPolicy.transfer.kinds.image`,X),G(`Links`,`openPolicy.transfer.kinds.url`,X),G(`Share target`,`openPolicy.transfer.channels.share-target`,X)])),J(`open-files`,`Open & share`,t)},load:(e,t)=>{e.openPolicy=he(e),Nn(t,e)},save:e=>{e.openPolicy=me(e.openPolicy),ve(e)}})})))()}var vr,yr,br,xr,Sr;function Cr(){return(Cr=e((()=>{V(),Ce(),_e(),Y(),vr=[[`attach`,`Open as attachment in chat`],[`process`,`Run AI and write to clipboard`]],yr=(e,t)=>{let n=G(e,t,[[``,`Active instruction`]]);return n.querySelector(`select`)?.setAttribute(`data-instruction-select`,``),n},br=(e,t)=>{let n=t.ai?.customInstructions||[];e.querySelectorAll(`[data-instruction-select]`).forEach(e=>{let t=e.value;e.replaceChildren();let r=document.createElement(`option`);r.value=``,r.textContent=`Active instruction`,e.appendChild(r);for(let t of n){let n=document.createElement(`option`);n.value=t.id,n.textContent=t.label||t.id,e.appendChild(n)}t&&[...e.options].some(e=>e.value===t)&&(e.value=t)})},xr=e=>[Fn(A[e]),G(`When ${A[e].toLowerCase()} arrives`,`ai.processIngress.kinds.${e}.mode`,vr),yr(`Default instruction`,`ai.processIngress.kinds.${e}.instructionId`),W(`Copy AI result to clipboard`,`ai.processIngress.kinds.${e}.copyToClipboard`)],Sr=()=>B({id:`workcenter`,label:`Process`,order:20,requiresView:`workcenter`,manualFields:!0,render:()=>J(`workcenter`,`Process`,[W(`Auto-run pinned tasks`,`views.workcenter.autoRunPinned`),U(`Default instruction id`,`views.workcenter.defaultInstructionId`,`(none)`),Fn(`File types and incoming actions`),H(`PWA/Web Share Target and Launch Queue open files here. On Android, Share and Open with follow these per-type actions. “Run AI and write to clipboard” can keep a background service so the result still lands after Share.`),H("Chat and AI actions POST to `/api/process`. PWA service worker and Capacitor Java run the same key-on-request fallback as Fastify; dedicated hosts stay same-origin, LAN still uses process.u2re.space."),W(`Allow automatic AI for incoming files`,`ai.processIngress.autoProcess`),W(`Android: keep background service for clipboard-write`,`ai.processIngress.backgroundClipboard`),G(`AI action`,`ai.shareTargetMode`,[[`recognize`,`Recognize`],[`analyze`,`Analyze`]]),...ge.flatMap(e=>xr(e))]),load:(e,t)=>{e.ai=e.ai||{},e.ai.processIngress=Se(e.ai.processIngress),e.ai.autoProcessShared===!1&&(e.ai.processIngress.autoProcess=!1),br(t,e),Nn(t,e)},save:(e,t)=>{Pn(t,e),e.ai=e.ai||{},e.ai.processIngress=Se(e.ai.processIngress),e.ai.autoProcessShared=e.ai.processIngress.autoProcess!==!1}})})))()}var wr,Tr,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Z,Wr,Gr,Kr,qr,Jr,Yr;function Xr(){return(Xr=e((()=>{V(),Y(),wr=`cw::workspace::grid-layout`,Tr=`rs-open-link-target`,Er=`cwsp:workspace-grid`,Dr=[[`squircle`,`Squircle`],[`circle`,`Circle`],[`square`,`Rounded square`],[`wavy`,`Wavy`]],Or=[[`open-link`,`Open link`],[`open-view`,`Open view`]],kr=[[`name`,`Name`],[`installed`,`Date installed`],[`updated`,`Date updated`],[`color`,`Color (including mask)`],[`category`,`Category`],[`package`,`Package`]],Ar=[[`asc`,`Ascending`],[`desc`,`Descending`]],jr=[[`inline`,`Inline (iframe / env window, same tab)`],[`external-app`,`External app (Android chooser)`],[`viewer`,`Markdown (in this app)`],[`document`,`CWSP-document`],[`explorer`,`CWSP-explorer`],[`workcenter`,`CWSP-process`],[`transfer`,`CWSP-transfer`],[`native-window`,`Native window (new browser window)`],[`new-tab`,`New tab`]],Mr=[[`compact`,`Compact (0.78)`],[`fit`,`Fit (1.0 — no zoom)`],[`fill`,`Fill (1.28 — adaptive default)`],[`zoom`,`Zoom (1.5)`],[`max`,`Max (1.75)`]],Nr=new Set(Dr.map(([e])=>e)),Pr=new Set(Or.map(([e])=>e)),Fr=new Set(jr.map(([e])=>e)),Ir=new Set(Mr.map(([e])=>e)),Lr=(e,t)=>{let n=Number(e);return Number.isFinite(n)?Math.max(1,Math.min(16,Math.round(n))):t},Rr=(e,t=`squircle`)=>{let n=String(e||``).trim().toLowerCase();return Nr.has(n)?n:t},zr=(e,t=`open-link`)=>{let n=String(e||``).trim().toLowerCase();return Pr.has(n)?n:t},Br=(e,t=`fill`)=>{let n=String(e||``).trim().toLowerCase();return n===`small`||n===`0.78`?`compact`:n===`1`||n===`contain`?`fit`:n===`adaptive`||n===`1.28`?`fill`:n===`1.5`?`zoom`:n===`large`||n===`1.75`?`max`:Ir.has(n)?n:t},Vr=(e,t=`inline`)=>{let n=String(e||``).trim().toLowerCase();return n===`in-shell`||n===`env`||n===`shell`?`inline`:n===`native`||n===`window`||n===`app-window`?`native-window`:n===`tab`||n===`browser`||n===`browser-tab`?`new-tab`:n===`app`||n===`chooser`||n===`open-with`||n===`open-in-app`||n===`intent`?`external-app`:n===`markdown`?`viewer`:n===`document`||n===`cwsp-document`?`document`:n===`files`?`explorer`:n===`process`||n===`cwsp-process`?`workcenter`:n===`transfer`||n===`cwsp`||n===`network`?`transfer`:Fr.has(n)?n:t},Hr=e=>{if(!e)return{};try{let t=JSON.parse(e);if(t&&typeof t==`object`)return t}catch{}let t=/columns["']?\s*:\s*(\d+)/.exec(e),n=/rows["']?\s*:\s*(\d+)/.exec(e),r=/shape["']?\s*:\s*["']?([a-z-]+)/i.exec(e),i=/defaultAction["']?\s*:\s*["']?([a-z-]+)/i.exec(e),a=/defaultOpenLinkTarget["']?\s*:\s*["']?([a-z-]+)/i.exec(e),o=/iconScale["']?\s*:\s*["']?([a-z0-9.-]+)/i.exec(e),s={};return t&&(s.columns=Number(t[1])),n&&(s.rows=Number(n[1])),r&&(s.shape=Rr(r[1])),i&&(s.defaultAction=zr(i[1])),a&&(s.defaultOpenLinkTarget=Vr(a[1])),o&&(s.iconScale=Br(o[1])),s},Ur=()=>{let e=null;try{window.dispatchEvent(new CustomEvent(Er,{detail:{query:!0,receive:t=>{e=t}}}))}catch{}let t={},n=``;try{t=Hr(localStorage.getItem(wr)),n=String(localStorage.getItem(Tr)||``)}catch{}return{columns:Lr(e?.columns??t.columns,4),rows:Lr(e?.rows??t.rows,8),shape:Rr(e?.shape??t.shape,`squircle`),defaultAction:zr(e?.defaultAction??t.defaultAction,`open-link`),defaultOpenLinkTarget:Vr(e?.defaultOpenLinkTarget??t.defaultOpenLinkTarget??n,`inline`),iconScale:Br(e?.iconScale??t.iconScale,`fill`)}},Z=(e,t,n)=>{let r=e.querySelector(`[data-field="${t}"]`);!r||n==null||(r.value=String(n))},Wr=`cw::workspace::pages`,Gr=e=>{let t=[],n=`side-a`;try{let e=JSON.parse(localStorage.getItem(Wr)||`null`);e?.pages?.length&&(t=e.pages,n=String(e.activeId||t[0].id))}catch{t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]}t.length||(t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]),e.replaceChildren();for(let r of t){let i=document.createElement(`div`);i.style.cssText=`display:flex;gap:.4rem;align-items:center;margin:.25rem 0;`;let a=document.createElement(`button`);a.type=`button`,a.className=`view-settings__btn`,a.textContent=r.label+(r.id===n?` · active`:``),a.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`switch`,id:r.id}})),requestAnimationFrame(()=>Gr(e))});let o=document.createElement(`button`);if(o.type=`button`,o.className=`view-settings__btn`,o.textContent=`Rename`,o.addEventListener(`click`,()=>{let t=window.prompt(`Workspace name`,r.label);t&&(window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`rename`,id:r.id,label:t}})),requestAnimationFrame(()=>Gr(e)))}),i.append(a,o),t.length>1){let t=document.createElement(`button`);t.type=`button`,t.className=`view-settings__btn`,t.textContent=`Remove`,t.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`remove`,id:r.id}})),requestAnimationFrame(()=>Gr(e))}),i.append(t)}e.append(i)}},Kr=e=>{let t=e.querySelector(`[data-workspace-pages]`);t&&Gr(t),e.dataset.workspacePagesBound!==`1`&&(e.dataset.workspacePagesBound=`1`,e.addEventListener(`click`,e=>{let n=(e.target?.closest?.(`[data-action]`))?.getAttribute(`data-action`)||``;if(n===`add-workspace-page`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`add`}}));else if(n===`workspace-page-prev`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`prev`}}));else if(n===`workspace-page-next`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`next`}}));else return;t&&requestAnimationFrame(()=>Gr(t))}))},qr=e=>{try{localStorage.setItem(wr,JSON.stringify({columns:e.columns,rows:e.rows,shape:e.shape,defaultAction:e.defaultAction,iconScale:e.iconScale||`fill`})),e.defaultOpenLinkTarget&&localStorage.setItem(Tr,e.defaultOpenLinkTarget)}catch{}},Jr=e=>{let t=!1;try{window.dispatchEvent(new CustomEvent(Er,{detail:{...e,ack:()=>{t=!0}}}))}catch{}t||qr(e)},Yr=()=>B({id:`workspace`,label:`Workspace`,order:18,requiresView:`home`,surfaces:[`environment`,`crx`,`web`,`native`,`capacitor`],excludeSurfaces:[`markdown`],render:()=>J(`workspace`,`Workspace`,[H(`Theme, workspaces, and the Speed Dial grid share this page.`),`Workspaces`,H(`Pages of the Speed Dial. Explorer roots: /user/workspaces/side-a, side-b, …`),(()=>{let e=document.createElement(`div`);return e.setAttribute(`data-workspace-pages`,`1`),e.className=`field`,e})(),q(K(`Add workspace`,`add-workspace-page`),K(`Previous page`,`workspace-page-prev`),K(`Next page`,`workspace-page-next`)),`Grid`,H(`Speed dial grid on the Home / NTP workspace.`),G(`Default icon shape`,`grid.shape`,Dr),G(`Icon bitmap scale`,`grid.iconScale`,Mr),In(`Columns`,`grid.columns`,{min:`1`,max:`16`,step:`1`,placeholder:`4`}),In(`Rows`,`grid.rows`,{min:`1`,max:`16`,step:`1`,placeholder:`8`}),`Default actions`,G(`New tile action`,`grid.defaultAction`,Or),G(`Open links in`,`grid.defaultOpenLinkTarget`,jr),`App menu`,H(`Installed-app icons in the App Menu. Color uses the painted icon, including mask.`),G(`Sort icons by`,`appMenu.sortBy`,kr),G(`Icon order`,`appMenu.sortDir`,Ar)]),load:(e,t)=>{let n=Ur(),r=e.grid||{};Z(t,`grid.shape`,n.shape||r.shape||`squircle`),Z(t,`grid.iconScale`,n.iconScale||r.iconScale||`fill`),Z(t,`grid.columns`,n.columns??r.columns??4),Z(t,`grid.rows`,n.rows??r.rows??8),Z(t,`grid.defaultAction`,n.defaultAction||r.defaultAction||`open-link`),Z(t,`grid.defaultOpenLinkTarget`,n.defaultOpenLinkTarget||r.defaultOpenLinkTarget||`inline`);let i={};try{let e=localStorage.getItem(`cwsp-app-menu-sort`);e&&(i=JSON.parse(e))}catch{}e.appMenu={...e.appMenu||{},sortBy:i.sortBy||e.appMenu?.sortBy||`name`,sortDir:i.sortDir||e.appMenu?.sortDir||`asc`},Z(t,`appMenu.sortBy`,e.appMenu.sortBy||`name`),Z(t,`appMenu.sortDir`,e.appMenu.sortDir||`asc`),Kr(t)},save:e=>{let t={columns:Lr(e.grid?.columns,4),rows:Lr(e.grid?.rows,8),shape:Rr(e.grid?.shape,`squircle`),defaultAction:zr(e.grid?.defaultAction,`open-link`),defaultOpenLinkTarget:Vr(e.grid?.defaultOpenLinkTarget,`inline`),iconScale:Br(e.grid?.iconScale,`fill`)};e.grid={...e.grid||{},...t},Jr(t);try{localStorage.setItem(`cwsp-app-menu-sort`,JSON.stringify({sortBy:e.appMenu?.sortBy||`name`,sortDir:e.appMenu?.sortDir||`asc`})),window.dispatchEvent(new CustomEvent(`cwsp:app-menu-sort-change`))}catch{}}})})))()}var Zr,Qr,$r,ei;function ti(){return(ti=e((()=>{V(),Y(),Zr=[[`name`,`Name`],[`date`,`Date modified`],[`type`,`Type`],[`size`,`Size`],[`kind`,`Kind (file / folder)`]],Qr=[[`asc`,`Ascending`],[`desc`,`Descending`]],$r=e=>{try{localStorage.setItem(`cwsp-explorer-sort`,JSON.stringify({sortBy:e.explorer?.sortBy||`name`,sortDir:e.explorer?.sortDir||`asc`,foldersFirst:e.explorer?.foldersFirst!==!1})),window.dispatchEvent(new CustomEvent(`cwsp:explorer-sort-change`))}catch{}},ei=()=>B({id:`explorer-sort`,label:`Explorer list`,order:25,requiresView:`explorer`,render:()=>J(`explorer-sort`,`Explorer list`,[H(`Order of files and folders in CWSP-explorer / Explorer.`),G(`Sort items by`,`explorer.sortBy`,Zr),G(`Order`,`explorer.sortDir`,Qr),W(`Folders first`,`explorer.foldersFirst`)]),load:e=>{let t={};try{let e=localStorage.getItem(`cwsp-explorer-sort`);e&&(t=JSON.parse(e))}catch{}e.explorer={...e.explorer||{},sortBy:t.sortBy||e.explorer?.sortBy||`name`,sortDir:t.sortDir||e.explorer?.sortDir||`asc`,foldersFirst:(t.foldersFirst??e.explorer?.foldersFirst)!==!1}},save:e=>$r(e)})})))()}var ni,ri;function ii(){return(ii=e((()=>{Gn(),ar(),sr(),lr(),_r(),Cr(),Xr(),ti(),ni=!1,ri=()=>{ni||(ni=!0,ir(),Yr(),ei(),gr(),cr(),Sr(),or(),Wn())}})))()}var ai,oi,si,ci,li,ui,di;function fi(){return(fi=e((()=>{p(),at(),D(),ai=null,oi=null,si=()=>{try{let e=globalThis,t=e.Capacitor?.getPlatform?.();return!!(e.Capacitor?.isNativePlatform?.()||t===`android`||t===`ios`||e.__CWS_NATIVE__===!0)}catch{return!1}},ci=()=>{let e=ee()||g();return e&&e!==`launcher`&&e!==`crx`?`none`:st()!==null||m()?`hub`:e===`launcher`&&si()?`launcher`:`none`},li=()=>ai,ui=async()=>{if(oi)return oi;oi=(async()=>{let e=ht.map(e=>{let t=dt(e);return{section:e,pkg:b(t)}}).filter(e=>!!e.pkg);try{let{launcherHasPackages:t}=await O(async()=>{let{launcherHasPackages:e}=await import(`./launcher-bridge-TAl_sW_X.js`);return{launcherHasPackages:e}},[],import.meta.url),n=await t(e.map(e=>e.pkg));ai=e.filter(e=>n[e.pkg]===!0).map(e=>e.section)}catch{ai=[]}return ai})();try{return await oi}finally{oi=null}},di=(e,t)=>{let n=[...e||[]].filter(e=>e!==`hub`).sort(),r=[...t||[]].filter(e=>e!==`hub`).sort();return n.length===r.length&&n.every((e,t)=>e===r[t])}})))()}var pi,mi,Q,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi;function Fi(){return(Fi=e((()=>{k(),oe(),V(),ii(),p(),at(),fi(),fe(),Ge(),D(),pi=`[data-settings-tabs]`,mi=`.settings-screen__body`,Q=()=>{try{let e=globalThis,t=e.Capacitor?.getPlatform?.();return!!(e.Capacitor?.isNativePlatform?.()||t===`android`||t===`ios`||e.__CWS_NATIVE__===!0)}catch{return!1}},hi=()=>{try{let e=g();if(e===`document`)return Q()?`capacitor`:`markdown`;if(e===`process`||e===`explorer`)return Q()?`capacitor`:`web`;if(e===`launcher`)return Q()?`capacitor`:`environment`;if(e===`crx`)return`crx`;let t=globalThis;if(t?.chrome?.runtime?.id)return`crx`;if(t?.Capacitor?.isNativePlatform?.()||t?.Capacitor?.getPlatform?.()===`android`||t?.Capacitor?.getPlatform?.()===`ios`)return`capacitor`;if(t?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`){let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase();if(e===`cw-markdown`||e===`cw-document`||e===`document`)return`markdown`;if(e===`environment`||e===`cw-environment`||e===`cwsp-shell`||document.querySelector?.(`.env-shell-root[data-shell='environment'], env-shell-container[data-shell='environment']`))return`environment`}if(typeof document<`u`)return`web`}catch{}return`unknown`},gi=(e,t)=>{let n=st(),r=ci(),i=r===`hub`||r===`launcher`?t||_t()||`hub`:null,a=n||i||t||void 0,o=a?dt(a):g(),s=hi();return a===`document`?s=Q()?`capacitor`:`markdown`:a===`transfer`||a===`process`||a===`explorer`?s=Q()?`capacitor`:`web`:a===`hub`&&(s=Q()?`capacitor`:`environment`),{isExtension:!!e,surface:s,sku:o,hubSection:a}},_i=(e,t)=>{if(e.requiresView&&!T(e.requiresView)&&(e.id!==`workcenter`||t.sku!==`process`&&t.hubSection!==`process`))return!1;let n=e.surfaces;if(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface)||e.id===`apk-update`&&!Q())return!1;if(e.id===`cwsp`){let e=t.sku||g();if(e===`launcher`||e===`explorer`||e===`document`||e===`process`)return!1}return!0},vi=e=>kn().filter(t=>_i(t,e)),yi=(e,t)=>{let n=e.querySelector(pi),r=e.querySelector(mi);if(!(!n||!r))for(let i of vi(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;if(i.id===`workspace`){let n=e.querySelector(`[data-tab-panel="appearance"]`);if(n){let e=null;try{e=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(e){let t=document.createElement(`div`);t.setAttribute(`data-contribution`,`workspace`),t.hidden=!1,e.matches?.(`[data-tab-panel]`)?(e.removeAttribute(`hidden`),e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.append(...Array.from(e.childNodes))):(e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.appendChild(e)),n.appendChild(t)}continue}}let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},bi=(e,t,n)=>{for(let r of vi(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`)||e.querySelector(`[data-contribution="${r.id}"]`);t&&n(r,t)}},xi=(e,t,n)=>{bi(e,n,(e,r)=>{try{e.manualFields||Nn(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},Si=(e,t,n)=>{bi(e,n,(e,r)=>{try{e.manualFields||Pn(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},Ci=e=>!!e&&typeof e==`object`&&!Array.isArray(e),wi=(e,t)=>{if(!Ci(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(Ci(t)&&Ci(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return Ci(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},Ti=()=>{try{let e=globalThis,t=typeof e.chrome?.runtime?.id==`string`&&typeof e.__NEUTRALINO_AUTH__?.port==`number`;return!!(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||typeof e.__WEBNATIVE_AUTH__?.port==`number`||typeof e.__NEUTRALINO_AUTH__?.port==`number`||t)}catch{return!1}},Ei=e=>{if(!e||typeof e!=`object`)return!1;let t=e.core,n=e.shell,r=e.bridge,i=e.cwsp,a=e.control;return!!(typeof t?.endpointUrl==`string`&&t.endpointUrl.trim()||typeof t?.userId==`string`&&t.userId.trim()||typeof t?.ecosystemToken==`string`&&t.ecosystemToken.trim()||typeof t?.userKey==`string`&&t.userKey.trim()||typeof n?.clipboardInboundMode==`string`&&n.clipboardInboundMode||typeof n?.clipboardOutboundMode==`string`&&n.clipboardOutboundMode||typeof n?.remoteHost==`string`&&n.remoteHost.trim()||typeof n?.clientId==`string`&&n.clientId.trim()||typeof n?.allowControlApi==`boolean`||typeof n?.bridgeDaemonEnabled==`boolean`||typeof n?.autoStartOnBoot==`boolean`||typeof r?.endpointUrl==`string`&&r.endpointUrl.trim()||typeof r?.userId==`string`&&String(r.userId).trim()||typeof i?.clientId==`string`&&String(i.clientId).trim()||typeof i?.endpointUrl==`string`&&String(i.endpointUrl).trim()||a?.surface===`capacitor-android`)},Di=()=>{try{let e=globalThis.chrome?.runtime?.id;return typeof e==`string`&&e.length>0}catch{return!1}},Oi=e=>{if(!Di())return e;let t=`L-110-crx`,n=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),r=((...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!n(e))return e}return`L-110`})(e.shell?.clientId,e.core?.userId);return{...e,core:{...e.core||{},userId:t,socket:{...e.core?.socket||{},selfId:t}},shell:{...e.shell||{},clientId:r}}},ki=async e=>{let t=await e();if((t.core?.preferBackendSync??!0)===!1)return Oi(t);let n=await tt(),r=(()=>{try{if(!Di())return!1;let e=globalThis;return String(globalThis.document?.documentElement?.dataset?.cwspBridge||``)===`live`||typeof e.__NEUTRALINO_AUTH__?.port==`number`}catch{return!1}})();if((Ti()||r)&&!Ei(n))for(let e=0;e<8&&(await new Promise(e=>setTimeout(e,300)),n=await tt(),!Ei(n));e++);return Oi(wi(t,n))},Ai=async(e,t,n={})=>{let r=await tt(),i=wi(n,r);return xi(e,i,t),i},ji=async(e,t,n)=>(Si(e,t,n),nt(t)),Mi=e=>vi(e).map(e=>e.id),Ni=()=>Q(),Pi=async e=>{be(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await O(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-CetAcicq.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=e=>{let t=e.toLowerCase();return t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`||t===`md.u2re.space`||t===`www.md.u2re.space`},a=e=>{let t=String(e||``).trim();if(!t)return``;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e).hostname.toLowerCase();if(i(n))return``}catch{if(/cwsp\.u2re\.space|md\.u2re\.space/i.test(t))return``}return t},o=e=>{let t=String(e||``).trim();return t?/[,;\s]/.test(t)&&/:\/\//.test(t)?t.split(/[,;\s]+/).map(e=>a(e.trim())).filter(Boolean).join(`;`):a(t):``};if(typeof t.endpointUrl==`string`){let e=o(t.endpointUrl);e!==t.endpointUrl.trim()&&(t.endpointUrl=e)}let s=typeof t.endpointUrl==`string`?t.endpointUrl:``,c=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!s.trim()&&!c.trim())return;let l=Ni()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},u=await pe({relayHttpsUrl:s,directHttpsUrl:c},l);u.relayHttpsUrl!==void 0&&(t.endpointUrl=u.relayHttpsUrl),u.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:u.directHttpsUrl})}})))()}var $,Ii,Li,Ri;function zi(){return(zi=e((()=>{f(),Ee(),k(),Tt(),le(),Le(),It(),Ht(),Te(),Xt(),en(),nn(),an(),hn(),_n(),R(),bn(),z(),Tn(),Dn(),Fi(),p(),Ue(),Be(),Ft(),rt(),D(),$=null,Ii=()=>{$=null},Li=[{id:`hub`,label:`Shell`,icon:`squares-four`},{id:`explorer`,label:`Explorer`,icon:`folder`},{id:`document`,label:`Document`,icon:`books`},{id:`process`,label:`Process`,icon:`lightning`},{id:`transfer`,label:`Transfer`,icon:`arrows-left-right`}],Ri=e=>{let t=e.hubSection||st()||`hub`;if($){if($.dataset.hubSettingsSection!==t)$=null;else return e.initialTab&&$.dispatchEvent(new CustomEvent(`cwsp-settings-resync`)),$}let n=null,r=null,i=()=>{let e=hi();return e===`capacitor`||e===`native`?8e3:2500},a=(e,t)=>{n&&(r&&=(clearTimeout(r),null),n.textContent=e,n.classList.remove(`note--ok`,`note--warn`,`note--err`),t?.tone===`ok`&&n.classList.add(`note--ok`),t?.tone===`warn`&&n.classList.add(`note--warn`),t?.tone===`err`&&n.classList.add(`note--err`),e&&!t?.persist&&(r=setTimeout(()=>{n&&(n.textContent=``,n.classList.remove(`note--ok`,`note--warn`,`note--err`))},i())))},o=l`<div class="view-settings" data-view="settings">
    ${rn()}
    <div class="settings-screen__body">
      ${cn()}
      ${gn()}
      ${vn()}
      ${yn()}
      ${xn()}
      ${wn(a)}
      ${En()}
    </div>
    ${tn()}
  </div>`;Pt(o),ri();let s=ci(),c=li(),f=ct(s,c),p=gi(e.isExtension,e.hubSection);if(s!==`none`){let t=e.hubSection||p.hubSection||`hub`;p.hubSection=f.length&&!f.includes(t)?`hub`:t}let m=mt(p);if(o.dataset.hubSettingsSection=p.hubSection||t,yi(o,p),f.length>1){let e=o.querySelector(`.settings-screen__top`),t=o.querySelector(`[data-settings-tabs]`);if(e&&t){let n=document.createElement(`nav`);n.className=`settings-tab-actions settings-sku-nav`,n.setAttribute(`data-settings-sku-nav`,``),n.setAttribute(`aria-label`,`Settings area`);for(let e of Li){if(!f.includes(e.id))continue;let t=document.createElement(`button`);t.className=`settings-tab-btn`,t.type=`button`,t.setAttribute(`data-action`,`open-settings-section`),t.setAttribute(`data-section`,e.id),t.append(l`<ui-icon class="settings-sku-nav__icon" icon="${e.icon}" icon-style="duotone" aria-hidden="true"></ui-icon>`,l`<span>${e.label}</span>`),t.classList.toggle(`is-active`,e.id===(p.hubSection||`hub`)),n.appendChild(t)}e.insertBefore(n,t)}}s===`launcher`&&c===null&&ui().then(e=>{e.length&&(Ii(),globalThis.dispatchEvent(new CustomEvent(`cwsp-settings-section`)))}),ut(o,m),m===`full`&&(p.surface===`capacitor`||p.surface===`native`)&&(o.querySelector(`[data-tab-panel="server"]`)?.remove(),o.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let h=e=>pt(o,e),v=e=>{let t=String(e?.getAttribute(`data-apk-sku`)||e?.closest(`[data-apk-sku-row]`)?.getAttribute(`data-apk-sku-row`)||``).trim();return t&&te(t)&&t!==`crx`?t:``},y=e=>{let t=v(e||null),n=lt(o.dataset.hubSettingsSection||`hub`),r=t||(ci()!==`none`&&n!==`hub`?dt(n):g()||`launcher`);return{sku:r,packageName:b(r)||``,manifest:_(r)}},ee=e=>{if(typeof e==`number`&&Number.isFinite(e))return e;if(typeof e==`string`&&e.trim()&&e!==`?`){let t=Number(e);return Number.isFinite(t)?t:null}return null},ne=(e,t)=>{let n=e=>String(e||``).trim().split(/[+-]/)[0].split(`.`).map(e=>Number(String(e).replace(/[^0-9]/g,``))||0),r=n(e),i=n(t);if(!String(e||``).trim()&&!String(t||``).trim())return 0;let a=Math.max(r.length,i.length);for(let e=0;e<a;e++){let t=r[e]||0,n=i[e]||0;if(t!==n)return t<n?-1:1}return 0},re=(e,t,n)=>{if(!e)return;let r=n,i=String(t.localVersionName||t.versionName||r?.versionName||``).trim(),a=ee(t.localVersionCode??t.versionCode??r?.versionCode),o=String(t.localSignatureSha256||t.signatureSha256||``).slice(0,12),s=String(t.remoteVersionName||``).trim(),c=ee(t.remoteVersionCode),l=t.installed===!1||r?.installed===!1?!1:t.installed===!0||r?.installed===!0||!!(i&&a!=null&&a!==0),u=c==null?``:` · gateway ${s||`?`} (${c})`;if(!l){e.textContent=`Not installed — Download & install to sideload.${u}`;return}e.textContent=`Installed: ${i||`?`} (${a??`?`})`+(o?` · sig ${o}…`:``)+u},ie=()=>({srcEl:o.querySelector(`[data-field="shell.apkUpdateSource"]`),endpointEl:o.querySelector(`[data-field="core.endpointUrl"]`),tokenEl:o.querySelector(`[data-field="core.ecosystemToken"]`),insecureEl:o.querySelector(`[data-field="core.allowInsecureTls"]`)}),x=e=>o.querySelector(e);n=o.querySelector(`[data-note]`);let S=x(`[data-field="ai.baseUrl"]`),C=x(`[data-field="ai.apiKey"]`),w=x(`[data-field="ui.showKey"]`),T=x(`[data-field="ai.model"]`),E=x(`[data-field="ai.customModel"]`),ae=o.querySelector(`[data-field-group="ai.customModel"]`),oe=x(`[data-field="ai.defaultReasoningEffort"]`),D=x(`[data-field="ai.defaultVerbosity"]`),se=x(`[data-field="ai.maxOutputTokens"]`),ce=x(`[data-field="ai.contextTruncation"]`),le=x(`[data-field="ai.promptCacheRetention"]`),de=x(`[data-field="ai.maxToolCalls"]`),fe=x(`[data-field="ai.parallelToolCalls"]`),pe=x(`[data-field="ai.requestTimeout.low"]`),me=x(`[data-field="ai.requestTimeout.medium"]`),he=x(`[data-field="ai.requestTimeout.high"]`),ge=x(`[data-field="ai.maxRetries"]`),_e=x(`[data-field="ai.shareTargetMode"]`),ve=()=>{let e=(T?.value||``).trim()===`custom`;ae&&(ae.hidden=!e),E&&(E.disabled=!e)};if(T){T.replaceChildren();for(let e of xe){let t=document.createElement(`option`);t.value=e,t.textContent=e,T.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,T.append(e),T.addEventListener(`change`,ve)}E?.addEventListener(`focus`,()=>{T&&(T.value=`custom`,ve())});let be=x(`[data-field="ai.autoProcessShared"]`),k=x(`[data-field="ai.responseLanguage"]`),Se=x(`[data-field="ai.translateResults"]`),Ce=x(`[data-field="ai.generateSvgGraphics"]`),A=x(`[data-field="speech.language"]`),Te=x(`[data-field="appearance.theme"]`),Ee=x(`[data-field="appearance.fontSize"]`),Ne=o.querySelector(`[data-appearance-color]`),Pe=x(`[data-field="appearance.colorSource"]`),Ie=x(`[data-field="appearance.hue"]`),Le=x(`[data-field="appearance.color"]`),Re=x(`[data-field="appearance.markdown.preset"]`),ze=x(`[data-field="appearance.markdown.fontFamily"]`),Be=x(`[data-field="appearance.markdown.fontSizePx"]`),Ue=x(`[data-field="appearance.markdown.lineHeight"]`),We=x(`[data-field="appearance.markdown.contentMaxWidthPx"]`),Ge=x(`[data-field="appearance.markdown.printScale"]`),Ke=x(`[data-field="appearance.markdown.page.size"]`),qe=x(`[data-field="appearance.markdown.page.orientation"]`),Je=x(`[data-field="appearance.markdown.page.marginMm"]`),Ye=x(`[data-field="appearance.markdown.modules.typography"]`),Xe=x(`[data-field="appearance.markdown.modules.lists"]`),Ze=x(`[data-field="appearance.markdown.modules.tables"]`),Qe=x(`[data-field="appearance.markdown.modules.codeBlocks"]`),$e=x(`[data-field="appearance.markdown.modules.blockquotes"]`),et=x(`[data-field="appearance.markdown.modules.media"]`),tt=x(`[data-field="appearance.markdown.modules.printBreaks"]`),nt=x(`[data-field="appearance.markdown.plugins.smartTypography"]`),rt=x(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),at=x(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),ft=o.querySelector(`[data-field="appearance.markdown.customCss"]`),ht=o.querySelector(`[data-field="appearance.markdown.printCss"]`),_t=o.querySelector(`[data-field="appearance.markdown.extensions"]`),vt=x(`[data-field="core.ntpEnabled"]`),yt=x(`[data-field="core.mode"]`),bt=x(`[data-field="core.endpointUrl"]`),xt=x(`[data-field="core.userId"]`),j=x(`[data-field="core.userKey"]`),St=x(`[data-field="core.ecosystemToken"]`),Ct=x(`[data-field="core.preferBackendSync"]`),Tt=x(`[data-field="core.encrypt"]`),Dt=x(`[data-field="core.appClientId"]`),Ot=x(`[data-field="core.allowInsecureTls"]`),kt=x(`[data-field="core.ops.allowUnencrypted"]`),At=x(`[data-field="core.admin.httpsOrigin"]`),jt=x(`[data-field="core.admin.httpOrigin"]`),Mt=x(`[data-field="core.admin.path"]`),M=x(`[data-field="core.socket.accessToken"]`),Nt=x(`[data-field="core.socket.routeTarget"]`),Ft=x(`[data-field="core.socket.clientAccessToken"]`),It=x(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),Lt=x(`[data-field="shell.maintainHubSocketConnection"]`),Rt=x(`[data-field="shell.clipboardBroadcastTargets"]`),Bt=x(`[data-field="shell.pushLocalClipboardToLan"]`),Vt=x(`[data-field="shell.clipboardPushIntervalMs"]`),Ht=x(`[data-field="shell.enableRemoteClipboardBridge"]`),Ut=x(`[data-field="shell.acceptInboundClipboardData"]`),Gt=x(`[data-field="shell.clipboardInboundAllowIds"]`),Xt=x(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),en=x(`[data-field="shell.clipboardShareDestinationIds"]`),nn=x(`[data-field="shell.applyRemoteClipboardToDevice"]`),an=x(`[data-field="shell.acceptContactsBridgeData"]`),on=x(`[data-field="shell.acceptSmsBridgeData"]`),sn=x(`[data-field="shell.enableNativeSms"]`),I=x(`[data-field="shell.enableNativeContacts"]`),ln=o.querySelector(`[data-admin-preview]`),L=o.querySelector(`[data-mcp-section]`),hn=o.querySelector(`[data-section="extension"]`),_n=o.querySelector(`[data-extension-tab]`);if(k){k.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,k.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,k.append(t);for(let e of qt()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,k.append(t)}}if(A){A.replaceChildren();for(let e of Kt()){let t=document.createElement(`option`);t.value=e,t.textContent=Wt(e),A.append(t)}}o.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Sn()}),o.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Sn()});let R=e=>{let t=it(m),n=e||t,r=()=>o.querySelectorAll(`.settings-screen__body > [data-tab-panel]`);[...r()].some(e=>e.getAttribute(`data-tab-panel`)===n)||(n=r()[0]?.getAttribute(`data-tab-panel`)||t),o.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let i=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let a=r();for(let e of Array.from(a)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}};o.addEventListener(`click`,e=>{let t=Yt(e),n=t?.closest?.(`[data-action="open-settings-section"][data-section]`);if(n&&o.contains(n)){e.preventDefault(),e.stopPropagation();let t=String(n.getAttribute(`data-section`)||`hub`).toLowerCase();if(ot(t),Ii(),ci()===`hub`){let e=gt(t);zt(`settings`,e?{section:e}:{})}else globalThis.dispatchEvent(new CustomEvent(`cwsp-settings-section`,{detail:{section:t}}));return}let r=t?.closest?.(`[data-action="switch-settings-tab"][data-tab]`);!r||!o.contains(r)||(e.preventDefault(),e.stopPropagation(),R(r.getAttribute(`data-tab`)||it(m)))},!0);let bn=e=>{let t=it(m),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?h(`markdown`)?`markdown`:t:new Set([...h(`appearance`)?[`appearance`]:[],...h(`markdown`)?[`markdown`]:[],...h(`ai`)?[`ai`]:[],...h(`mcp`)?[`mcp`]:[],...h(`server`)?[`server`]:[],...h(`instructions`)?[`instructions`]:[],...h(`extension`)?[`extension`]:[],...Mi(p)]).has(n)?n:t:t},z=()=>{let e=St?.value?.trim()||j?.value?.trim()||M?.value?.trim()||``;return{mode:yt?.value||`native`,endpointUrl:bt?.value?.trim()||``,userId:xt?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!Tt?.checked,preferBackendSync:(Ct?.checked??!0)!==!1,appClientId:Dt?.value?.trim()||``,allowInsecureTls:!!Ot?.checked,useCoreIdentityForAirPad:!0,socket:{accessToken:e,routeTarget:Nt?.value?.trim()||``,selfId:``,clientAccessToken:Ft?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!It?.checked},admin:{httpsOrigin:At?.value?.trim()||``,httpOrigin:jt?.value?.trim()||``,path:Mt?.value?.trim()||`/`},ops:{allowUnencrypted:!!kt?.checked}}},Sn=()=>{if(!ln)return;let e=wt(z());ln.textContent=`Resolved: ${e.https} · ${e.http}`},Cn=e=>{try{u(d.EXPLORER_PATH,e),zt(`explorer`),ue({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),a(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),a(`Failed to open Explorer path.`)}};Promise.resolve((async()=>((p.surface===`capacitor`||p.surface===`native`)&&await ke().catch(()=>null),(p.surface===`crx`||p.isExtension)&&await je().catch(()=>null),ki(()=>Ae())))()).then(t=>{S&&(S.value=(t?.ai?.baseUrl||``).trim()),C&&(C.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.6-luna`).trim(),r=(t?.ai?.customModel||``).trim();if(T){let e=xe.includes(n);n===`custom`||!e&&n?(T.value=`custom`,E&&(E.value=r||n)):(T.value=e?n:`gpt-5.6-luna`,E&&(E.value=r)),ve()}if(oe&&(oe.value=t?.ai?.defaultReasoningEffort||`medium`),D&&(D.value=t?.ai?.defaultVerbosity||`medium`),se&&(se.value=String(t?.ai?.maxOutputTokens??4e5)),ce&&(ce.value=t?.ai?.contextTruncation||`disabled`),le&&(le.value=t?.ai?.promptCacheRetention||`in-memory`),de&&(de.value=String(t?.ai?.maxToolCalls??8)),fe&&(fe.checked=(t?.ai?.parallelToolCalls??!0)!==!1),pe&&(pe.value=String(t?.ai?.requestTimeout?.low??6e4)),me&&(me.value=String(t?.ai?.requestTimeout?.medium??3e5)),he&&(he.value=String(t?.ai?.requestTimeout?.high??9e5)),ge&&(ge.value=String(t?.ai?.maxRetries??2)),_e&&(_e.value=t?.ai?.shareTargetMode||`recognize`),be&&(be.checked=(t?.ai?.autoProcessShared??!0)!==!1),k&&(k.value=t?.ai?.responseLanguage||`auto`),Se&&(Se.checked=!!t?.ai?.translateResults),Ce&&(Ce.checked=!!t?.ai?.generateSvgGraphics),A&&(A.value=t?.speech?.language||`en-US`),Te&&(Te.value=t?.appearance?.theme||`auto`),Ee&&(Ee.value=t?.appearance?.fontSize||`medium`),Ne&&(Ne.hidden=!1,fn(o,String(t?.appearance?.colorSource||`auto`)),pn(o,String(t?.appearance?.color||``))),Re&&(Re.value=t?.appearance?.markdown?.preset||`default`),ze&&(ze.value=t?.appearance?.markdown?.fontFamily||`system`),Be&&(Be.value=String(t?.appearance?.markdown?.fontSizePx??16)),Ue&&(Ue.value=String(t?.appearance?.markdown?.lineHeight??1.7)),We&&(We.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),Ge&&(Ge.value=String(t?.appearance?.markdown?.printScale??1)),Ke&&(Ke.value=t?.appearance?.markdown?.page?.size||`auto`),qe&&(qe.value=t?.appearance?.markdown?.page?.orientation||`portrait`),Je&&(Je.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Ye&&(Ye.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),Xe&&(Xe.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Ze&&(Ze.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),Qe&&(Qe.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),$e&&($e.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),et&&(et.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),tt&&(tt.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),nt&&(nt.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),rt&&(rt.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),at&&(at.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),ft&&(ft.value=(t?.appearance?.markdown?.customCss||``).trim()),ht&&(ht.value=(t?.appearance?.markdown?.printCss||``).trim()),_t){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];_t.value=e.length>0?JSON.stringify(e,null,2):``}vt&&(vt.checked=!!t?.core?.ntpEnabled),yt&&(yt.value=t?.core?.mode||`native`),bt&&(bt.value=(t?.core?.endpointUrl||``).trim()),xt&&(xt.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();St&&(St.value=e),j&&(j.value=e),M&&(M.value=e)}if(Ct&&(Ct.checked=(t?.core?.preferBackendSync??!0)!==!1),Tt&&(Tt.checked=!!t?.core?.encrypt),Dt&&(Dt.value=(t?.core?.appClientId||``).trim()),Nt&&(Nt.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),Ft&&(Ft.value=(t?.core?.socket?.clientAccessToken||``).trim()),It&&(It.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),Ot&&(Ot.checked=!!t?.core?.allowInsecureTls),kt&&(kt.checked=!!t?.core?.ops?.allowUnencrypted),At&&(At.value=(t?.core?.admin?.httpsOrigin||``).trim()),jt&&(jt.value=(t?.core?.admin?.httpOrigin||``).trim()),Mt&&(Mt.value=(t?.core?.admin?.path||`/`).trim()||`/`),Lt&&(Lt.checked=!!t?.shell?.maintainHubSocketConnection),Rt&&(Rt.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),Bt&&(Bt.checked=!!t?.shell?.pushLocalClipboardToLan),Vt){let e=Number(t?.shell?.clipboardPushIntervalMs);Vt.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}Ht&&(Ht.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),Ut&&(Ut.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),Gt&&(Gt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),Xt&&(Xt.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),en&&(en.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),nn&&(nn.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),an&&(an.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),on&&(on.checked=!Ve()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),sn&&(sn.checked=!Ve()&&(t?.shell?.enableNativeSms??!1)===!0),I&&(I.checked=(t?.shell?.enableNativeContacts??!0)!==!1),Sn(),$t(L,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),we(t),Fe(t),xi(o,t,p),e.onTheme?.(t?.appearance?.theme||`auto`),Ve()&&O(()=>import(`./cws-bridge-BDddm-Gk.js`).then(e=>(e.a(),e.n)).then(async e=>{let n=[...o.querySelectorAll(`[data-apk-local-version]`)];if(!n.length)return;let{srcEl:r,endpointEl:i,tokenEl:a,insecureEl:s}=ie(),c=(r?.value||t.shell?.apkUpdateSource||`wan`).trim(),l=(i?.value||t.core?.endpointUrl||``).trim(),u=(a?.value||``).trim()||ye(t),d=s?.checked??!!t.core?.allowInsecureTls;await Promise.all(n.map(async t=>{let n=y(t);try{let r=await e.invokeCwsNative(`app:update:check`,{...n,source:c,endpointUrl:l,token:u,ecosystemToken:u,allowInsecureTls:d}),i=r?.echo||{};if(i.error){let r=await e.invokeCwsNative(`app:info`,n);re(t,r?.echo||{},r);return}re(t,i,r)}catch{let r=await e.invokeCwsNative(`app:info`,n);re(t,r?.echo||{},r)}}))}),[],import.meta.url).catch(()=>{})}).catch(()=>{$t(L,[])}),w?.addEventListener(`change`,()=>{!C||!w||(C.type=w.checked?`text`:`password`)});let Tn=e=>{(async()=>{try{let t=await Ae();Fe({...t,appearance:{...t.appearance||{},...e}})}catch{Fe({appearance:{theme:`auto`,fontSize:`medium`,...e}})}})()};if(Ne?.addEventListener(`click`,e=>{let t=e.target?.closest?.(`.appearance-swatch`);if(!t)return;let n=t.dataset.color??``;fn(o,`custom`),pn(o,n),Tn({color:n,colorSource:`custom`})}),Pe?.addEventListener(`change`,()=>{let e=dn(o);fn(o,e),Tn({colorSource:e,color:e===`custom`?mn(o):void 0})}),Ie?.addEventListener(`input`,()=>{let e=un(Number(Ie.value));fn(o,`custom`),pn(o,e),Tn({color:e,colorSource:`custom`})}),Le?.addEventListener(`input`,()=>{let e=Le.value||``;fn(o,`custom`),pn(o,e),Tn({color:e,colorSource:`custom`})}),Te?.addEventListener(`change`,()=>{let t=Te.value||`auto`;(async()=>{try{let e=await Ae();Fe({...e,appearance:{...e.appearance||{},theme:t}})}catch{Fe({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),o.addEventListener(`click`,t=>{let n=Yt(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&L){L.querySelector(`.mcp-empty-note`)?.remove(),L.appendChild(Zt({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),L&&!L.querySelector(`[data-mcp-id]`)&&$t(L,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){Cn(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){Cn(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){Et(z(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){Et(z(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=wt(z());navigator.clipboard?.writeText?.(e.https).then(()=>a(`HTTPS admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=wt(z());navigator.clipboard?.writeText?.(e.http).then(()=>a(`HTTP admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){O(()=>import(`./clipboard-device-DNSotdWy.js`).then(e=>(e.n(),e.t)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>a(`App settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){O(()=>import(`./clipboard-device-DNSotdWy.js`).then(e=>(e.n(),e.t)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>a(`Notification settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}let i=n?.closest?.(`button[data-action="crx-control-pair"]`),s=n?.closest?.(`button[data-action="crx-control-unpair"]`);if(i||s){(async()=>{let e=o.querySelector(`[data-crx-control-status]`),t=()=>{try{globalThis.chrome?.runtime?.sendMessage?.({type:`cwsp-control-session-changed`})}catch{}};try{let n=await O(()=>import(`./crx-control-session-D7DIGdNp.js`),[],import.meta.url);if(s){await n.clearCrxControlSession(),e&&(e.textContent=await n.formatCrxControlSessionStatus()),a(`Control unpaired — Copy & Share / Paste by CWSP disabled.`,{tone:`warn`}),t();return}let r=String(o.querySelector(`[data-field="shell.localHubUrl"]`)?.value||``).trim(),i=String(document.documentElement.dataset.cwspControlOrigin||``).trim();e&&(e.textContent=`Control: waiting for pairing dialog…`),a(`Enter public token + device code in the pairing dialog…`);let c=await n.pairCrxControlWithModal({localHubUrl:r,preferredOrigins:i?[i]:[]});if(c.cancelled){e&&(e.textContent=await n.formatCrxControlSessionStatus()),a(`Pairing cancelled.`);return}e&&(e.textContent=c.ok?await n.formatCrxControlSessionStatus():`Control: ${c.error}`),c.ok?(a(`Paired Control at ${c.session.controlHost} (persistent).`),t()):a(c.error,{tone:`warn`})}catch(e){a(`Control pairing unavailable: ${e instanceof Error?e.message:String(e)}`,{tone:`warn`})}})();return}let c=n?.closest?.(`button[data-action="control-pairing-refresh"]`),l=n?.closest?.(`button[data-action="control-public-token-regenerate"]`);if(c||l){let e=!!t?.isTrusted;(async()=>{try{let t=String(location.hostname||``);if(location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`){e&&a(`Pairing codes are shown on the device (phone/desk), not in the public Control SPA.`,{tone:`warn`});return}}catch{}let t=o.querySelector(`input[data-control-device-code], [data-control-device-code]`),n=o.querySelector(`input[data-control-public-token], [data-control-public-token]`),r=o.querySelector(`[data-secret-meta="control-device-code"]`),i=o.querySelector(`[data-secret-meta="control-public-token"]`),s=e=>{let a=String(e.deviceCode||``).trim(),o=Math.max(1,Math.round(Number(e.expiresInMs||0)/1e3)),s=String(e.publicToken||``).trim();t instanceof HTMLInputElement?t.value=a:t&&(t.textContent=a?`Code: ${a} (${o}s)`:`Code: …`),n instanceof HTMLInputElement?n.value=s:n&&(n.textContent=s?`Public token: ${s}`:`Public token: …`),r&&(r.textContent=a?`Expires in ${o}s`:``),i&&(i.textContent=s?`Stable until regenerated`:``)};try{e&&a(l?`Regenerating public token…`:`Refreshing pairing code…`,{tone:`warn`});try{let{invokeCwsNative:t}=await O(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-BDddm-Gk.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),n=await t(l?`control:public-token:regenerate`:`control:pairing:status`,{}),r=n?.controlPairing||n?.echo||{};if(r?.deviceCode||r?.publicToken){s(r),e&&a(l?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`});return}}catch{}let t=globalThis,n=Number(t.__CWSP_CONTROL_PORT__||29110)||29110,r=String(t.__CWSP_CONTROL_API_KEY__||`cwsp-neutralino-local`).trim(),i=await fetch(`http://127.0.0.1:${n}${l?`/service/pair/regenerate-public-token`:`/service/pair/display`}`,{method:l?`POST`:`GET`,headers:{Accept:`application/json`,"Content-Type":`application/json`,"X-API-Key":r},body:l?`{}`:void 0});if(!i.ok)throw Error(`Control HTTP ${i.status}`);s(await i.json()),e&&a(l?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`})}catch(t){e&&a(String(t?.message||t||`Pairing status unavailable`),{tone:`err`})}})();return}let u=n?.closest?.(`button[data-action="files-storage-pick-saf"]`),d=n?.closest?.(`button[data-action="files-storage-clear-saf"]`),f=n?.closest?.(`button[data-action="files-storage-show-paths"]`),m=n?.closest?.(`button[data-action="files-storage-share-readme"]`),g=n?.closest?.(`button[data-action="files-storage-open-explorer"]`),_=n?.closest?.(`button[data-action="files-storage-perm-status"]`),v=n?.closest?.(`button[data-action="files-storage-request-media"]`),b=n?.closest?.(`button[data-action="files-storage-request-all-files"]`);if(u||d||f||m||g||_||v||b){(async()=>{try{let{invokeCwsNative:e}=await O(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-BDddm-Gk.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),t=await Ae(),n=o.querySelector(`[data-files-saf-uri]`),r=o.querySelector(`[data-files-storage-paths]`),i=o.querySelector(`[data-files-perm-status]`),s=e=>{if(!n)return;let t=String(e||``).trim();n.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`},c=e=>{i&&(i.textContent=`Media/storage runtime: ${e.runtimeGranted===!0?`granted`:`missing`}`+(e.missingRuntime?` (${e.missingRuntime})`:``)+`\nAll-files access: ${e.allFilesAccess===!0?`granted`:`not granted`}`+(e.note?`\n${e.note}`:``))};if(d){t.shell={...t.shell||{},filesIncomingDir:``,filesLandingMode:t.shell?.filesLandingMode||`app`},await De(t),s(``),a(`SAF folder cleared.`,{tone:`ok`});return}let l=u?`files:storage:pick-landing`:m?`files:storage:share-readme`:g?`files:storage:open-explorer`:v?`files:storage:request-media`:b?`files:storage:request-all-files`:_?`files:storage:permissions-status`:`files:storage:status`,f=o.querySelector(`[data-field="shell.filesStagingRoot"]`),p=o.querySelector(`[data-field="shell.filesLandingMode"]`);a(u?`Opening folder picker…`:g?`Opening CWSP Files…`:v?`Requesting media permission…`:b?`Opening all-files settings…`:`Reading storage…`,{tone:`warn`});let h=await e(l,{stagingRoot:f?.value||t.shell?.filesStagingRoot||`app`,landingMode:p?.value||t.shell?.filesLandingMode||`app`,incomingDir:t.shell?.filesIncomingDir||``}),y=h?.echo||h?.envelope?.payload||{},ee=y?.error||h?.error||(!h?.ok&&!y?.outgoingDir&&!y?.documentUri&&y?.runtimeGranted===void 0?`storage action failed`:``);if(ee){a(String(ee),{tone:`err`});return}if(u&&y?.incomingDir){t.shell={...t.shell||{},filesIncomingDir:String(y.incomingDir),filesLandingMode:`saf`},await De(t),p&&(p.value=`saf`),s(String(y.incomingDir)),a(`SAF folder saved. Landing mode set to SAF.`,{tone:`ok`});return}(y.runtimeGranted!==void 0||y.allFilesAccess!==void 0)&&c(y),r&&(y?.outgoingDir||y?.incomingAppDir||y?.readmePath||y?.note)&&(r.textContent=`Outgoing temp: ${y.outgoingDir||`?`}\nIncoming temp: ${y.incomingAppDir||`?`}\nLanding mode: ${y.landingMode||`?`}`+(y?.incomingDir?`\nSAF: ${y.incomingDir}`:``)+(y?.note&&y.runtimeGranted===void 0?`\n${y.note}`:``)),a(m?`Shared README — open it in another app to see the paths.`:g?`Opened document picker — look for CWSP Files (or Files app sidebar).`:b?`Enable “Allow access to manage all files”, then tap Refresh status.`:v?`Media permission dialog finished — see status.`:`Status updated.`,{tone:`ok`})}catch(e){a(String(e?.message||e||`Files storage action failed`),{tone:`err`})}})();return}let te=n?.closest?.(`button[data-action="apk-update-check"]`),x=n?.closest?.(`button[data-action="apk-update-install"]`);if(te||x){let e=x?`app:update:install`:`app:update:check`;(async()=>{a(x?`Downloading APK…`:`Checking for update…`,{tone:`warn`});try{let t=await Ae(),{srcEl:n,endpointEl:r,tokenEl:i,insecureEl:s}=ie(),c=o.querySelector(`[data-apk-local-version]`),l=(n?.value||t.shell?.apkUpdateSource||`wan`).trim(),u=(r?.value||t.core?.endpointUrl||``).trim(),d=(i?.value||``).trim()||ye(t),f=s?.checked??!!t.core?.allowInsecureTls,{invokeCwsNative:p}=await O(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-BDddm-Gk.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),m=x||te,h=y(m),g=await p(e,{...h,source:l,endpointUrl:u,token:d,ecosystemToken:d,allowInsecureTls:f}),_=g?.echo||g?.envelope?.payload||{},v=_?.error||g?.error||(!g?.ok&&!g?.echo?`update failed`:``);if(v){a(String(v),{tone:`err`});return}let b=m.closest(`[data-apk-sku-row]`)?.querySelector(`[data-apk-local-version]`)||c;if(b&&(_?.localVersionCode!=null||_?.localVersionName||_?.versionName)&&re(b,_,g),x){a(_?.launchedInstaller?`Installer launched — confirm on the system prompt.`:`Install request sent.`,{tone:`ok`});return}let S=ee(_?.localVersionCode),C=ee(_?.remoteVersionCode),w=String(_?.localVersionName||``).trim(),T=String(_?.remoteVersionName||``).trim(),E=_?.updateAvailable===!0||g?.updateAvailable===!0||C!=null&&S!=null&&C>S||ne(T,w)>0,ae=_?.signatureCompatible!==!1,oe=_?.installed===!0,D=String(_?.reason||``);if(!ae){a(`Signature mismatch — remote APK not signed like this install (local ${S??`?`}, remote ${C??`?`}).`,{tone:`err`});return}if(!oe){a(`${h.sku}: not installed — remote ${C??`?`} (${T||`?`}). Download & install to sideload.`,{tone:`warn`});return}if(D===`gateway-older`||C!=null&&S!=null&&C<S&&!E){a(`${h.sku}: gateway older (local ${w||`?`} ${S}, remote ${T||`?`} ${C}). Publish the newer APK.`,{tone:`warn`});return}if(S==null&&C==null){a(`${h.sku}: native echo missing versions — try Check again.`,{tone:`err`});return}a(E?`${h.sku}: update available ${w||S} → ${T||C} (${S??`?`} → ${C??`?`}).`:`${h.sku}: current (local ${w||`?`} ${S??`?`}, remote ${T||`?`} ${C??`?`}) — Download & install will sideload.`,{tone:E?`warn`:`ok`})}catch(e){a(String(e?.message||e),{tone:`err`})}})();return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{a(`Saving…`,{tone:`warn`});let t=await Ae(),n=t.appearance?.markdown?.extensions||[],r=h(`markdown`)&&_t?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){R(`markdown`),a(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:h(`ai`)?{baseUrl:S?.value?.trim?.()||``,apiKey:C?.value?.trim?.()||``,model:T?.value||`gpt-5.6-luna`,customModel:T?.value===`custom`&&E?.value?.trim?.()||``,defaultReasoningEffort:oe?.value||`medium`,defaultVerbosity:D?.value||`medium`,maxOutputTokens:N(se?.value,4e5),contextTruncation:ce?.value||`disabled`,promptCacheRetention:le?.value||`in-memory`,maxToolCalls:N(de?.value,8),parallelToolCalls:(fe?.checked??!0)!==!1,requestTimeout:{low:N(pe?.value,6e4),medium:N(me?.value,3e5),high:N(he?.value,9e5)},maxRetries:N(ge?.value,2),shareTargetMode:_e?.value||`recognize`,autoProcessShared:(be?.checked??!0)!==!1,responseLanguage:k?.value||`auto`,translateResults:!!Se?.checked,generateSvgGraphics:!!Ce?.checked,mcp:h(`mcp`)?Qt(L):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:h(`ai`)?{language:A?.value||`en-US`}:t.speech||{},core:h(`server`)?{...t.core,ntpEnabled:F(vt,!!t.core?.ntpEnabled),mode:P(yt,t.core?.mode||`native`)||`native`,endpointUrl:P(bt,t.core?.endpointUrl||``),userId:P(xt,t.core?.userId||``),ecosystemToken:P(St,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||P(j,t.core?.userKey||``)||P(M,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:P(St,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||P(j,t.core?.userKey||``)||P(M,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:F(Tt,!!t.core?.encrypt),preferBackendSync:F(Ct,(t.core?.preferBackendSync??!0)!==!1),appClientId:P(Dt,t.core?.appClientId||``),allowInsecureTls:F(Ot,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:!0,socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=P(St,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||P(j,t.core?.userKey||``)||P(M,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:P(Nt,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:P(Ft,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:F(It,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:P(At,t.core?.admin?.httpsOrigin||``),httpOrigin:P(jt,t.core?.admin?.httpOrigin||``),path:P(Mt,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:F(kt,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:h(`server`)?{...t.shell||{},maintainHubSocketConnection:F(Lt,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:P(Rt,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:F(Bt,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=Vt?.value,n=N(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:F(Ht,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:F(Ut,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:P(Gt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:F(Xt,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:P(en,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:F(nn,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:F(an,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!Ve()&&F(on,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!Ve()&&F(sn,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:F(I,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:h(`appearance`)||h(`markdown`)?{theme:Te?.value||`auto`,fontSize:Ee?.value||`medium`,color:mn(o),colorSource:dn(o),markdown:{preset:Re?.value||`default`,fontFamily:ze?.value||`system`,fontSizePx:N(Be?.value,16),lineHeight:Jt(Ue?.value,1.7,1.1,2.2),contentMaxWidthPx:N(We?.value,860),printScale:Jt(Ge?.value,1,.5,1.5),page:{size:Ke?.value||`auto`,orientation:qe?.value||`portrait`,marginMm:N(Je?.value,12)},modules:{typography:(Ye?.checked??!0)!==!1,lists:(Xe?.checked??!0)!==!1,tables:(Ze?.checked??!0)!==!1,codeBlocks:(Qe?.checked??!0)!==!1,blockquotes:($e?.checked??!0)!==!1,media:(et?.checked??!0)!==!1,printBreaks:(tt?.checked??!0)!==!1},plugins:{smartTypography:!!nt?.checked,softBreaksAsBr:!!rt?.checked,externalLinksNewTab:(at?.checked??!0)!==!1},customCss:ft?.value||``,printCss:ht?.value||``,extensions:n||[]}}:t.appearance||{}};Si(o,i,p),await Pi(i);let s=i,c=p.surface===`capacitor`||p.surface===`native`?He(s).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),l=await De(s);if(!l){a(`Settings save returned no data.`,{tone:`err`});return}let u=!1;try{u=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cwsp-control`||/^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname||``))}catch{u=!1}try{if(u){let e=globalThis.__CWSP_ENSURE_CONTROL_FOR_SAVE__;if(typeof e==`function`){let t=await e();if(!t?.ok){Me(!1,t?.error||`Control not paired`),a(t?.error||`Pair phone Control (token + code + Accept) before Save`,{tone:`warn`});return}}}await ji(o,l,p),u&&globalThis.__CWSP_CONTROL_BRIDGE_LIVE__&&Me(!0)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e);let t=e instanceof Error?e.message:String(e);if(u&&Me(!1,t),/pairing|unauthorized|401|403|Control/i.test(t)){a(t,{tone:`warn`});return}}xi(o,l,p);let d=Oe(),f=await c,m=f.lines,g=f.results.some(e=>e.granted===!1);O(()=>import(`./hub-socket-boot-JxvQbb_I.js`).then(e=>(e.r(),e.n)).then(async e=>{if(u){try{globalThis.__CWSP_CONTROL_BRIDGE_LIVE__||console.warn(`[Settings] Control not paired — settings saved locally only; pair to push to device`)}catch{}return}if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis;if(e.__CWS_NODE_CLIPBOARD_HUB__===!1)return;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.host||`127.0.0.1`).trim()||`127.0.0.1`;if(n===8434&&r!==`127.0.0.1`&&r!==`localhost`||n!==29110)return;let i=String(t?.key||`cwsp-neutralino-local`),a=l.core,o=String(a?.ecosystemToken||a?.userKey||a?.socket?.accessToken||``).trim(),s={};a?.endpointUrl&&(s.remoteHost=String(a.endpointUrl).trim()),o&&(s.accessToken=o,s.clientToken=o),a?.userId&&(s.clientId=String(a.userId).trim()),s.force=!0,await fetch(`http://${r}:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":i},body:JSON.stringify(s),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await O(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-BDddm-Gk.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(l),O(()=>import(`./hub-socket-boot-JxvQbb_I.js`).then(e=>(e.s(),e.u)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),Fe(l),e.onTheme?.(l.appearance?.theme||`auto`);let _=[`Saved locally`];d.nativeSynced===!0?_.push(`synced to Android`):d.nativeSynced===!1&&!g?console.warn(`[Settings] native settings patch:`,d.nativeError||`not confirmed`):d.nativeSynced===!1&&_.push(`native sync failed${d.nativeError?`: ${d.nativeError}`:``}`);let v=(()=>{try{return String(globalThis.__CWSP_CONTROL_VIA__||``)}catch{return``}})(),y=v===`android`?`phone Control (Capacitor)`:v===`neutralino`?`desk Control (Neutralino)`:u?`Control`:`desk Control`;d.webnativeSynced===!0?_.push(`synced to ${y}`):d.webnativeSynced===!1&&_.push(`${y} sync failed${d.webnativeError?`: ${d.webnativeError}`:``}`),m.length&&_.push(...m);let b=`ok`;(g||d.webnativeSynced===!1)&&(b=`warn`),a(_.join(` · `),{tone:b})})().catch(e=>a(String(e),{tone:`err`}))}),e.isExtension){hn&&(hn.hidden=!1),_n&&(_n.hidden=!1);let e=l`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`,t=o.querySelector(`.settings-screen__footer`);t?t?.insertAdjacentElement?.(`beforebegin`,e):o.append(e)}let Dn=bn(e.initialTab);if(R(Dn),!o.querySelector(`.settings-screen__body > [data-tab-panel="${Dn}"]:not([hidden])`)){let e=o.querySelector(`.settings-screen__body > [data-tab-panel]`);e&&R(e.getAttribute(`data-tab-panel`)||Dn)}ve();let On=o.querySelectorAll(`.settings-screen__body > [data-tab-panel]`).length,B=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${m} surface=${p.surface} tabs=${B} panels=${On} active=${o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(On===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,o.querySelector(`.settings-screen__body`)?.appendChild(e),R(`cwsp`)}return o.addEventListener(`cwsp-settings-resync`,()=>{Pt(o),R(o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Dn)}),$=o,o}})))()}function Bi(e){return new Hi(e)}var Vi,Hi;function Ui(){return(Ui=e((()=>{n(),a(),Ot(),Ft(),zi(),Fi(),V(),Ge(),D(),Vi={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Hi=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=r(Vi);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{s(this.element),this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.syncHubSectionFromLocation(),this.refreshLauncherSiblingNav(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1})),t(this.element)},onHide:()=>{s(this.element)}};constructor(e={}){this.options=e,this.shellContext=e.shellContext;try{globalThis.addEventListener(`route-change`,this.onHubSettingsRoute),globalThis.addEventListener(`popstate`,this.onHubSettingsRoute),globalThis.addEventListener(`cwsp-settings-section`,this.onHubSettingsRoute)}catch{}}onHubSettingsRoute=()=>{this.syncHubSectionFromLocation()};render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=this.isExtensionRuntime(),n=this.resolveAreaSection(e?.params?.section);return n&&this.element&&this.element.dataset.hubSettingsSection!==n&&(Ii(),this.element=null),this.element?this.element:(this.element=Ri({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,hubSection:n,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>Pt(this.element)),this.element)}getToolbar(){return null}isExtensionRuntime(){return globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id}resolveAreaSection(e){let t=st();if(t)return lt(e||t);if(ci()===`launcher`)return lt(e||_t()||`hub`)}async refreshLauncherSiblingNav(){if(ci()!==`launcher`)return;let e=li(),t=await ui();di(e,t)||this.remountSettings(this.resolveAreaSection()||`hub`)}remountSettings(e){if(!this.element)return;let t=this.element.parentNode;Ii();let n=Ri({isExtension:this.isExtensionRuntime(),hubSection:e,initialTab:this.options.params?.tab||this.options.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}});t?.replaceChild(n,this.element),this.element=n,queueMicrotask(()=>Pt(this.element))}syncHubSectionFromLocation(){if(!this.element)return;let e=this.resolveAreaSection();e&&this.element.dataset.hubSettingsSection!==e&&this.remountSettings(e)}setupEventHandlers(){}loadSettings(){this.settings.value={...Vi}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...Vi},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){Pt(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(o(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===kt.Patch||e===kt.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([O(()=>import(`./Settings-BdjZKlQM.js`).then(e=>(e.a(),e.t)),[],import.meta.url),O(()=>import(`./Theme-CppsnuLy.js`).then(e=>(e.r(),e.t)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}})))()}Ui();export{Hi as SettingsView,xi as applyContributions,Ze as clearSettingsSyncArms,Si as collectContributions,et as createMemorySettingsSyncArm,Ri as createSettingsView,Bi as createView,Bi as default,Je as detectSettingsSurface,kn as getSettingsContributions,We as getSettingsDefaults,Qe as getSettingsSnapshot,tt as getSettingsSync,Ai as hydrateContributionsFromSync,Ye as mergeSettingsPatch,yi as mountContributions,nt as patchSettingsSync,ji as persistContributionsViaSync,ui as refreshInstalledSiblingSettingsSections,ri as registerBuiltinSettingsContributions,ir as registerCwspSettingsContribution,or as registerDeviceSettingsContribution,cr as registerReaderSettingsContribution,B as registerSettingsContribution,Ke as registerSettingsSyncArm,Sr as registerWorkcenterSettingsContribution,Ii as resetSettingsViewCache,hi as resolveSettingsSurface,qe as resolveSettingsSyncArm,$e as setSurfaceDetector,Xe as unregisterSettingsSyncArm};