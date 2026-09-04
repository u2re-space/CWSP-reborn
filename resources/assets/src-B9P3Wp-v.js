import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{D as t,Gt as n,Kt as r,Rt as i,Zt as a,ft as o,in as s,k as c,t as l}from"./src-DaqdrrCE.js";import{Bt as u,Lt as d,zt as f}from"./OPFS-BTZVHSsd.js";import{c as p,f as m,g as h,h as g,i as _,l as v,m as y,r as b,s as x,u as ee}from"./ecosystem-skus-Bz92tN57.js";import{n as te,o as ne,r as re,t as S}from"./history-base-C5FHF9Xl.js";import{r as C}from"./shell-preference-DNduHyVr.js";import{n as w,t as T}from"./preload-helper-DFTwEg7x.js";import{a as E,c as D,d as O,f as ie,l as ae,u as oe}from"./registry-B5ADTAyx.js";import{n as se,t as ce}from"./templates-C66WQ7dZ.js";import{a as le,d as ue}from"./UnifiedMessaging-CNtaQBln.js";import{r as de}from"./BootLoader-CR5ckSUW.js";import{B as fe,K as pe}from"./airpad-cwsp-client-parity-CetAcicq.js";import{c as me,m as he,n as ge,o as _e,y as k}from"./open-policy-DV4wO_gQ.js";import{a as ve,i as ye,r as be,t as xe}from"./SettingsTypes-CGV1OLo5.js";import{c as A,o as Se,t as Ce}from"./process-ingress-vfDqnnzE.js";import{t as we,v as Te}from"./remote-connection-runtime-ClMC-mb2.js";import{a as Ee,c as De,i as Oe,n as ke,o as Ae,r as je,s as Me}from"./Settings-D_-YuEG2.js";import{c as Ne,l as Pe,n as Fe,o as Ie,r as Le,s as Re,u as j}from"./Theme-B9yL0Epz.js";import{n as ze,r as Be}from"./capacitor-permissions-DeazvCZP.js";import{i as Ve,r as He}from"./capacitor-settings-permissions-DkzN5Fmd.js";import{a as Ue,c as We,d as Ge,f as Ke,i as qe,l as Je,m as Ye,n as Xe,o as Ze,p as Qe,r as $e,s as M,u as et}from"./web-lLXHfXm0.js";import{s as tt}from"./icon-DwAFT1ZT.js";import{a as nt,c as rt,d as it,f as at,h as ot,i as st,l as ct,m as lt,n as ut,o as dt,p as ft,r as pt,s as mt,u as ht}from"./shells-BnGLsdt8.js";import{c as gt,i as _t,l as vt,n as yt,o as bt,r as xt,s as St}from"./CustomInstructions-DCqnN9Ug.js";import{i as Ct,n as wt,r as Tt}from"./admin-doors-DKuDENp1.js";import{n as Et}from"./registry-Bib2ElTG.js";import{a as Dt,r as Ot}from"./channel-actions-DkmBPovk.js";function kt(){return(kt=e((()=>{})))()}var N,At,jt,P,Mt;function Nt(){return(Nt=e((()=>{i(),kt(),N=`data-settings-view-css`,At=e=>s(String(e||``),`settings-view`),jt=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;grid-template-columns:minmax(0,1fr)!important;inline-size:100%!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;pointer-events:auto!important;container-type:inline-size}
.view-settings .settings-screen__top{display:flex!important;flex-direction:column!important;align-items:stretch!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;pointer-events:auto!important}
.view-settings .settings-tab-actions{display:flex!important;flex-wrap:nowrap!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;overflow-x:auto!important;overflow-y:hidden!important;pointer-events:auto!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch;pointer-events:auto!important}
.view-settings .settings-screen__body>[data-tab-panel]:not(.is-active),.view-settings .settings-screen__body>[data-tab-panel][hidden]{display:none!important}
.view-settings .settings-screen__body>[data-tab-panel].is-active:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important;pointer-events:auto!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select,.view-settings .btn,.view-settings .card{pointer-events:auto!important}
.view-settings .settings-tab-btn{pointer-events:auto!important;cursor:pointer!important;flex:0 0 auto!important}
`,P=e=>{if(e&&!e.classList?.contains(`view-settings`)||typeof document>`u`)return;if(document.head?.querySelector(`style[${N}]`)){e&&n(e);return}let t=At(`/* Settings view — self-contained stylesheet.
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
}`);t.trim()||(t=jt);let r=document.createElement(`style`);r.setAttribute(N,``),r.textContent=t,document.head?.appendChild(r),e&&n(e)},Mt=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}P(e)};e.isConnected?P(e):requestAnimationFrame(t)}})))()}function Pt(){return(Pt=e((()=>{l()})))()}function Ft(e){S();let t=String(e.view||``).trim().replace(/^\/+/,``).toLowerCase();if(h(t))return y(t)||`/${t}`;let n={...e.params||{}},r;if(t===`settings`){let e=mt(st(String(n.section||``).trim()));delete n.section,r=ne(e?`/settings/${e}`:`/settings`)}else r=ne(t&&t!==`home`?re(`/${t}`):`/`);let i=r;if(Object.keys(n).length>0){let e=new URLSearchParams(n).toString();i+=(i.includes(`?`)?`&`:`?`)+e}return i}function It(e,t={}){let n=Ft(e);if(h(e.view)||/^https?:\/\//i.test(n)){globalThis.location.assign(n);return}t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function Lt(e,t){It({view:e,params:t})}function Rt(){return(Rt=e((()=>{de(),oe(),p(),C(),te(),rt(),[...ae],ie(`home`,D)})))()}function zt(){return(zt=e((()=>{})))()}function Bt(){return(Bt=e((()=>{ut(),E(),Et(),Rt(),de(),zt()})))()}var Vt,Ht,Ut,Wt,Gt,F,Kt,I,L,qt;function Jt(){return(Jt=e((()=>{Vt=[`en`,`ru`,`en-GB`,`en-US`],Ht=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,Ut=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},Wt=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=Ut(n);t&&e.add(t)}for(let t of Vt)e.add(t);return Array.from(e)},Gt=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},F=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},Kt=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},I=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},L=(e,t)=>e?!!e.checked:t,qt=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})))()}var Yt,Xt,Zt;function Qt(){return(Qt=e((()=>{l(),Yt=e=>{let t={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return o`<div class="field mcp-row" data-mcp-id=${t.id}>
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
          </div>`},Xt=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},Zt=(e,t)=>{if(!e)return;e.replaceChildren();let n=Array.isArray(t)?t:[];if(!n.length){e.appendChild(o`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}n.forEach(t=>e.appendChild(Yt(t)))}})))()}var $t;function en(){return(en=e((()=>{l(),$t=()=>o`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})))()}var tn;function nn(){return(nn=e((()=>{l(),tn=()=>o`<header class="settings-screen__top">
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`})))()}var rn,an,R,on,sn,cn,ln,un,dn,fn,pn;function z(){return(z=e((()=>{l(),Ne(),rn=[{hex:Ie,label:`Cyan`},{hex:`#4f8eb5`,label:`Steel`},{hex:`#64748b`,label:`Slate`},{hex:`#3b82f6`,label:`Blue`},{hex:`#6366f1`,label:`Indigo`},{hex:`#14b8a6`,label:`Teal`},{hex:`#22c55e`,label:`Green`},{hex:`#f59e0b`,label:`Amber`},{hex:`#ef4444`,label:`Red`},{hex:`#ec4899`,label:`Pink`},{hex:`#8b5cf6`,label:`Violet`}],an={wallpaper:`From wallpaper`,"material-you":`From Material You`,"system-wallpaper":`From system wallpaper`,"speed-dial":`From Speed Dial wallpaper`,custom:`Custom hue`},R=(e,t)=>{if(e===`auto`)return`Auto (${an[t]})`;let n=an[e];return e===t?`${n} (default)`:n},on=()=>{let e=Re();return o`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
            <option value="auto">${R(`auto`,e)}</option>
            <option value="wallpaper">${R(`wallpaper`,e)}</option>
            <option value="material-you">${R(`material-you`,e)}</option>
            <option value="system-wallpaper">${R(`system-wallpaper`,e)}</option>
            <option value="speed-dial">${R(`speed-dial`,e)}</option>
            <option value="custom">${R(`custom`,e)}</option>
          </select>
        </label>
        <span class="field-hint" data-appearance-source-hint></span>
        <div class="appearance-custom" data-appearance-custom hidden>
          <span>Accent / hue</span>
          <div class="appearance-swatches" role="listbox" aria-label="Accent color">
            ${rn.map(e=>o`<button type="button" class="appearance-swatch" data-color="${e.hex}" title="${e.label}" aria-label="${e.label}" style="background:${e.hex}"></button>`)}
          </div>
          <label class="appearance-hue">
            <span>Hue</span>
            <input class="appearance-hue__range" type="range" min="0" max="360" value="200" data-field="appearance.hue" />
          </label>
          <input class="form-input appearance-color-input" type="color" data-field="appearance.color" value="${Ie}" />
        </div>
      </div>
    </section>`},sn={auto:`Uses this app’s default source.`,wallpaper:`Dominant color from the launcher / environment wallpaper.`,"material-you":`Android Material You system accent.`,"system-wallpaper":`Dominant color from the OS desktop wallpaper.`,"speed-dial":`Dominant color from the Speed Dial wallpaper.`,custom:`Manual swatch, hue, or color picker.`},cn=e=>{let t=j(e);if(!t)return 200;let n=parseInt(t.slice(1,3),16)/255,r=parseInt(t.slice(3,5),16)/255,i=parseInt(t.slice(5,7),16)/255,a=Math.max(n,r,i),o=a-Math.min(n,r,i);if(o<1e-4)return 200;let s=0;return s=a===n?(r-i)/o%6:a===r?(i-n)/o+2:(n-r)/o+4,s=Math.round(s*60),s<0?s+360:s},ln=e=>{let t=(Number(e)%360+360)%360,n=e=>{let n=(e+t/30)%12,r=.57-.1806*Math.max(Math.min(n-3,9-n,1),-1);return Math.round(255*r).toString(16).padStart(2,`0`)};return`#${n(0)}${n(8)}${n(4)}`},un=e=>{let t=e.querySelector(`[data-field="appearance.colorSource"]`);return Pe(t?.value)?t.value:`auto`},dn=(e,t)=>{let n=e.querySelector(`[data-field="appearance.colorSource"]`),r=e.querySelector(`[data-appearance-custom]`),i=e.querySelector(`[data-appearance-source-hint]`),a=Pe(t)?t:`auto`;n&&(n.value=a),r&&(r.hidden=a!==`custom`),i&&(i.textContent=sn[a])},fn=(e,t)=>{let n=e.querySelector(`[data-field="appearance.color"]`),r=e.querySelector(`[data-field="appearance.hue"]`),i=j(t)||`#5a9ec8`;n&&(n.value=i),r&&(r.value=String(cn(i))),e.querySelectorAll(`.appearance-swatch`).forEach(e=>{e.setAttribute(`aria-selected`,j(e.dataset.color)===i?`true`:`false`)})},pn=e=>{let t=e.querySelector(`[data-field="appearance.color"]`);return j(t?.value)}})))()}var mn;function hn(){return(hn=e((()=>{l(),mn=()=>o`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`})))()}var gn;function _n(){return(_n=e((()=>{l(),gn=()=>o`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`})))()}var vn;function yn(){return(yn=e((()=>{l(),vn=()=>o`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})))()}var bn;function xn(){return(xn=e((()=>{l(),bn=()=>o`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`})))()}var Sn;function Cn(){return(Cn=e((()=>{l(),d(),St(),se(),Sn=(e={})=>{let t=f({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),n=o`<div class="custom-instructions-editor">
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
    </div>`,r=n.querySelector(`[data-list]`),i=n.querySelector(`[data-action='select-active']`),a=n.querySelector(`[data-add-form]`),s=n.querySelector(`[data-field='label']`),c=n.querySelector(`[data-field='instruction']`),l=()=>{r.replaceChildren();let n=t.instructions??[];if(!n.length){r.append(o`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of n){let n=t.editingId===i.id,a=t.activeId===i.id,s=o`<div class="ci-item ${a?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${a?o`<span class="ci-badge active">Active</span>`:o`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${n?o`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:o`<div class="ci-item-preview">${d(i.instruction,120)}</div>`}
            </div>`;s.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&gt(i.id).then(p).then(()=>e.onUpdate?.()),r===`edit`&&(t.editingId=i.id,l()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&_t(i.id).then(p).then(()=>e.onUpdate?.()),r===`save-edit`){let n=s.querySelector(`[data-edit-field='label']`),r=s.querySelector(`[data-edit-field='instruction']`);vt(i.id,{label:n.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(t.editingId=null,p())).then(()=>e.onUpdate?.())}r===`cancel-edit`&&(t.editingId=null,l())}),r.append(s)}},u=()=>{i.replaceChildren(),i.append(o`<option value="">None (use default)</option>`);for(let e of t.instructions??[]){let n=o`<option value="${e.id}">${e.label}</option>`;e.id===t.activeId&&(n.selected=!0),i.append(n)}},d=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,p=async()=>{let e=await bt(),n=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;t.instructions=n?.instructions??[],t.activeId=n?.activeId??``,l(),u()};return n.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(t.isAdding=!0,a.hidden=!1,s.value=``,c.value=``,s.focus()),r===`cancel-add`&&(t.isAdding=!1,a.hidden=!0),r===`save-new`){let n=s.value.trim(),r=c.value.trim();if(!r){c.focus();return}yt(n||`Custom`,r).then(e=>{if(e)return t.isAdding=!1,a.hidden=!0,p()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let n=new Set((t.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=ce.filter(e=>!n.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}xt(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(p).then(()=>e.onUpdate?.())}}),i.addEventListener(`change`,()=>{let t=i.value||``;gt(t||null).then(p).then(()=>e.onUpdate?.())}),p(),n}})))()}var wn;function Tn(){return(Tn=e((()=>{l(),Cn(),wn=e=>o`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${Sn({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})))()}var En;function Dn(){return(Dn=e((()=>{l(),En=()=>o`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
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
    </section>`})))()}var On,B,kn,An,jn,Mn,Nn,Pn;function V(){return(V=e((()=>{On=new Map,B=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return On.set(t,n),()=>{On.get(t)===n&&On.delete(t)}},kn=()=>[...On.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),An=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},jn=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},Mn=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},Nn=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=An(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},Pn=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=Mn(e);r!==void 0&&jn(n,t,r)})}})))()}var H,Fn,U,In,W,G,K,q,Ln,J;function Y(){return(Y=e((()=>{H=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},Fn=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},U=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},In=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},W=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},G=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},K=(e,t,n)=>{let r=document.createElement(`button`);return r.type=`button`,r.className=n?.className||(n?.primary?`view-settings__btn view-settings__btn--primary`:`view-settings__btn`),r.setAttribute(`data-action`,t),r.textContent=e,r},q=(...e)=>{let t=document.createElement(`div`);t.className=`field settings-action-row`,t.style.display=`flex`,t.style.flexWrap=`wrap`,t.style.gap=`0.5rem`;for(let n of e)t.appendChild(n);return t},Ln=(e,t,n)=>{let r=document.createElement(`div`);r.className=`field settings-secret-field`,r.setAttribute(`data-secret-field`,t);let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`div`);a.style.cssText=`display:flex;gap:.4rem;align-items:center;margin-top:.3rem;`;let o=document.createElement(`input`);o.className=`form-input`,o.type=`password`,o.readOnly=!0,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=n?.placeholder||`••••••`,o.setAttribute(`data-${t}`,`1`),o.setAttribute(`data-secret-input`,t),o.value=``,n?.mono?(o.style.fontFamily=`ui-monospace, SFMono-Regular, Menlo, monospace`,o.style.fontSize=`0.9rem`,o.style.letterSpacing=`0.04em`):(o.style.fontSize=`1.15rem`,o.style.fontWeight=`700`,o.style.letterSpacing=`0.12em`),o.style.flex=`1 1 auto`,o.style.minWidth=`0`;let s=document.createElement(`button`);s.type=`button`,s.className=`view-settings__btn`,s.textContent=`View`,s.title=`Show / hide`,s.setAttribute(`data-action`,`control-secret-toggle`),s.setAttribute(`data-secret-for`,t);let c=document.createElement(`button`);c.type=`button`,c.className=`view-settings__btn`,c.textContent=`Copy`,c.title=`Copy to clipboard`,c.setAttribute(`data-action`,`control-secret-copy`),c.setAttribute(`data-secret-for`,t);let l=document.createElement(`p`);l.className=`field-hint`,l.setAttribute(`data-secret-meta`,t),l.style.margin=`0.2rem 0 0`,l.textContent=``;let u=()=>{let e=o.dataset.revealed===`1`;o.type=e?`text`:`password`,s.textContent=e?`Hide`:`View`};return s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),o.dataset.revealed=o.dataset.revealed===`1`?`0`:`1`,u()}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=String(o.value||``).trim();if(t)try{await navigator.clipboard.writeText(t);let e=c.textContent;c.textContent=`Copied`,window.setTimeout(()=>{c.textContent=e||`Copy`},1200)}catch{o.type=`text`,o.select();try{document.execCommand(`copy`)}catch{}u()}}),a.append(o,s,c),r.append(i,a,l),r},J=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(Fn(e)):r.appendChild(e);return r}})))()}var Rn,zn,Bn,Vn,Hn,Un,Wn;function Gn(){return(Gn=e((()=>{V(),p(),Y(),Rn=[{sku:`explorer`,label:`Explorer`},{sku:`document`,label:`Document`},{sku:`process`,label:`Process`},{sku:`transfer`,label:`Transfer`}],zn=e=>e.sku||g(),Bn=(e,t)=>{let n=document.createElement(`p`);return n.className=`field-hint`,n.setAttribute(`data-apk-local-version`,`1`),n.setAttribute(`data-apk-sku`,e),n.textContent=t,n},Vn=e=>{let t=K(`Check`,`apk-update-check`),n=K(`Download & install`,`apk-update-install`,{primary:!0});return t.setAttribute(`data-apk-sku`,e),n.setAttribute(`data-apk-sku`,e),q(t,n)},Hn=(e,t)=>{let n=document.createElement(`div`);n.className=`apk-update-fleet-row`,n.setAttribute(`data-apk-sku-row`,e);let r=document.createElement(`h4`);r.textContent=t;let i=_(e);return n.append(r,Bn(e,`Not checked — tap Check`),Vn(e),H(e===`transfer`?`Reads ${i} (ecosystem token). Newer versionCode or versionName is an update.`:`Reads ${i}. Newer versionCode or versionName is an update.`)),n},Un=e=>{let t=zn(e),n=t?_(t):``,r=g(),i=String(e.hubSection||`hub`),a=r===`launcher`&&t&&t!==`launcher`,o=r===`launcher`&&(!e.hubSection||i===`hub`),s=a?t===`transfer`?"Updates CWSP-transfer (`latest.json` / space.u2re.cwsp). Needs ecosystem token.":`Updates the installed ${t} APK (${n||`channel`}).`:t===`launcher`?`This launcher reads latest-launcher.json. Other ecosystem APKs are listed below when this is the Shell APK.`:t===`transfer`?`This hub APK reads latest.json (ecosystem token). Other SKUs are not installed from here.`:n?`This app reads ${n} for its own APK only.`:`Checks the gateway release that matches this installed package.`,c=[o?`This launcher`:`App update (dev)`,Bn(t||`launcher`,`Installed version: … (tap Check to refresh)`),G(`Update source`,`shell.apkUpdateSource`,[[`wan`,`WAN — https://45.147.121.152:8434`],[`lan`,`LAN — https://192.168.0.200:8434`],[`relay`,`Current Relay (core.endpointUrl)`]]),Vn(t||`launcher`),H(s)];if(o){c.push(`Ecosystem APKs`,H(`Check or install Explorer, Document, Process, and Transfer from this launcher.`));for(let e of Rn)c.push(Hn(e.sku,e.label))}return c},Wn=()=>B({id:`apk-update`,label:`Updates`,order:90,surfaces:[`capacitor`,`native`,`environment`],render:e=>J(`apk-update`,`Updates`,Un(e)),load:(e,t)=>{let n=t.querySelector(`[data-field="shell.apkUpdateSource"]`);if(n){let t=String(e.shell?.apkUpdateSource||`wan`).trim();n.value=t===`lan`||t===`relay`?t:`wan`}}})})))()}var Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir;function ar(){return(ar=e((()=>{V(),be(),Y(),w(),Kn=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,qn=`L-110`,Jn=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),Yn=(...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!Jn(e))return e}return qn},Xn=e=>{let t=e.surface===`crx`||!!e.isExtension,n=[H(t?`CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field.`:`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,U(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434;https://45.147.121.152:8434`),H(t?`Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control).`:"Coordinator / gateway. Multi-hub: separate with `;` or `,` (never `:`). Always include :8434 — bare host dials :443 where /ws is not served (404)."),U(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),H(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`)];return t?n.push(U(`Client id (Neutralino / backend)`,`shell.clientId`,`L-110`),H(`Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx).`)):n.push(U(`Client id`,`core.userId`,`L-196 or L-110`),H(`Short fleet id (L-196, L-210, …).`)),n.push(U(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),H(t?`Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login).`:`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),U(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),H(Kn),W(`Allow insecure TLS`,`core.allowInsecureTls`)),n},Zn=()=>[`Clipboard`,W(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),W(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),U(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),H(Kn),U(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),H(Kn),`Clipboard prompt`,G(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),G(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),W(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),W(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),In(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),H(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],Qn=e=>{let t=[`Files transfer`,H("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),W(`Accept inbound files`,`shell.acceptInboundFilesData`),U(`Default destination ids`,`shell.filesShareDestinationIds`,`L-196;L-210 (empty = picker)`),H(Kn),W(`Allow share to all (*)`,`shell.filesAllowShareToAll`),H(`SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out.`),G(`Open for share`,`shell.filesOpenForShareMode`,[[`auto`,`Auto — offer when destinations are set`],[`manual`,`Manual — always ask for destinations`]]),G(`Inbound accept`,`shell.filesInboundMode`,[[`ask`,`Ask — Accept / Decline prompt`],[`auto`,`Auto — accept into landing folder`]]),W(`Copy received files to clipboard (for Paste / re-share)`,`shell.filesCopyOnReceive`),H(`Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default.`),G(`Byte transport hint`,`shell.filesByteTransport`,[[`auto`,`Auto — receiver chooses`],[`http`,`HTTP blob GET/PUT`],[`ws`,`WebSocket chunks`]]),H(`Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.`)];if(e.surface===`capacitor`||e.surface===`native`){let e=document.createElement(`p`);e.className=`field-hint`,e.setAttribute(`data-files-saf-uri`,`1`),e.textContent=`SAF folder: (not set)`;let n=document.createElement(`p`);n.className=`field-hint`,n.setAttribute(`data-files-storage-paths`,`1`),n.style.whiteSpace=`pre-wrap`,n.textContent=`Staging / landing paths: tap Show paths.`,t.push(`Files storage (Capacitor)`,G(`Save received files to`,`shell.filesLandingMode`,[[`app`,`App storage (private — default)`],[`downloads`,`Downloads (user-visible)`],[`saf`,`SAF folder (pick below)`]]),H(`App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README.`),e,q(K(`Choose SAF folder`,`files-storage-pick-saf`,{primary:!0}),K(`Clear SAF folder`,`files-storage-clear-saf`)),W(`Ask for folder every time if SAF unset`,`shell.filesAskDirEveryTime`),G(`Temp staging place`,`shell.filesStagingRoot`,[[`app`,`App internal (files/) — default`],[`cache`,`App cache (may be purged)`],[`external`,`App external (Android/data/… — OEM may hide)`]]),H(`Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above.`),n,q(K(`Show paths`,`files-storage-show-paths`),K(`Browse CWSP Files…`,`files-storage-open-explorer`),K(`Share README…`,`files-storage-share-readme`)),`File access permissions`,(()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-files-perm-status`,`1`),e.style.whiteSpace=`pre-wrap`,e.textContent=`Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.`,e})(),q(K(`Refresh status`,`files-storage-perm-status`),K(`Request media access`,`files-storage-request-media`,{primary:!0}),K(`Allow manage all files…`,`files-storage-request-all-files`)),H(`All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish.`))}return t},$n=()=>[`Native wire (Capacitor)`,W(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),W(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],er=()=>[`Control pairing`,Ln(`Public token`,`control-public-token`,{mono:!0,placeholder:`••••••••••••`}),Ln(`Device code (20s, +10s grace)`,`control-device-code`,{placeholder:`••••••`}),q(K(`Refresh code`,`control-pairing-refresh`),K(`Regenerate public token`,`control-public-token-regenerate`)),H(`Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.`)],tr=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-crx-control-status`,`1`),e.textContent=`Control: …`,[`Control pairing`,e,q(K(`Pair Control…`,`crx-control-pair`,{primary:!0}),K(`Unpair`,`crx-control-unpair`)),H(`Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.`)]},nr=()=>{try{let e=globalThis;if(e.NL_OS!=null||e.NL_PORT!=null||e.Neutralino||e.Capacitor?.isNativePlatform?.())return!1;let t=String(e.Capacitor?.getPlatform?.()||``).toLowerCase();if(t===`android`||t===`ios`)return!1;let n=String(location.hostname||``).toLowerCase();return!n||n===`localhost`||n===`127.0.0.1`||n===`[::1]`?!1:location.protocol===`https:`}catch{return!1}},rr=()=>[`Device`,W(`Start CWSP on boot`,`shell.autoStartOnBoot`),W(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),W(`Allow Control API`,`shell.allowControlApi`),H(`Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password.`),...er(),W(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),W(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),H(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],ir=()=>B({id:`cwsp`,label:`CWSP`,order:55,excludeSurfaces:[`markdown`,`environment`],render:e=>{let t=[...Xn(e),...Zn(),...Qn(e)];return e.surface===`capacitor`||e.surface===`native`?t.push(...$n(),...rr()):e.surface===`crx`||e.isExtension?t.push(...tr()):nr()||t.push(...$n(),...er()),J(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=ve(e));let r=t.querySelector(`[data-field="shell.clientId"]`);if(r){let t=Yn(r.value,e.shell?.clientId,e.core?.userId);r.value=t,e.shell={...e.shell||{},clientId:t}}let i=t.querySelector(`[data-files-saf-uri]`);if(i){let t=String(e.shell?.filesIncomingDir||``).trim();i.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`}let a=t.querySelector(`button[data-action="control-pairing-refresh"]`);if(a){queueMicrotask(()=>a.click());let e=Number(t.__cwspPairTimer||0);e&&clearInterval(e),t.__cwspPairTimer=window.setInterval(()=>{t.isConnected&&a.click()},2500)}let o=t.querySelector(`[data-crx-control-status]`);o&&T(()=>import(`./crx-control-session-D7DIGdNp.js`).then(e=>e.formatCrxControlSessionStatus()),[],import.meta.url).then(e=>{o.isConnected&&(o.textContent=e)}).catch(()=>{o.textContent=`Control: status unavailable`})},save:e=>{ye(e),Jn(e.shell?.clientId)&&(e.shell={...e.shell||{},clientId:Yn(e.core?.userId)})}})})))()}var or;function sr(){return(sr=e((()=>{or=()=>()=>void 0})))()}var cr;function lr(){return(lr=e((()=>{V(),Y(),cr=()=>B({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>J(`reader`,`Reader`,[In(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),W(`Wrap long lines`,`views.reader.wrapLongLines`)])})})))()}var X,ur,dr,fr,pr,mr,hr,gr,_r;function vr(){return(vr=e((()=>{V(),_e(),p(),Y(),X=[[`ask`,`Follow default / this app`],[`display`,`Display here`],[`viewer`,`Markdown (in this app)`],[`document`,`CWSP-document`],[`explorer`,`CWSP-explorer`],[`workcenter`,`CWSP-process`],[`transfer`,`CWSP-transfer`],[`wallpaper`,`Wallpaper if it fits, otherwise viewer`],[`external`,`New tab / browser`],[`system`,`Android / system chooser`]],ur=[[`ask`,`Follow default / this app`],[`display`,`Display here`],[`viewer`,`Markdown (in this app)`],[`document`,`Stay in this app`],[`external`,`New tab / browser`]],dr=[[`inline`,`Inline window (same tab)`],[`native-window`,`Separate window`],[`new-tab`,`New tab (file as-is)`]],fr=[[`document`,`CWSP-document`],[`system`,`Ask Android (Open with…)`],[`transfer`,`CWSP-transfer`],[`workcenter`,`CWSP-process`]],pr=[[`ask`,`Follow Open / click`],...fr],mr=[[`wallpaper`,`Wallpaper if it fits, otherwise viewer`],[`viewer`,`Markdown (in this app)`],[`document`,`CWSP-document`],[`workcenter`,`CWSP-process`],[`transfer`,`CWSP-transfer`],[`ask`,`Wallpaper if it fits, otherwise pin a shortcut`],[`system`,`Android / system chooser`],[`external`,`New tab / browser`]],hr=(e,t)=>{let n=String(e.hubSection||``).trim(),r=String(e.sku||``).trim(),i=String(e.surface||``).trim();return n===`hub`?!0:n===`document`?t===`viewer`:n===`explorer`?t===`explorer`:n===`process`?t===`process`:n===`transfer`?t===`transfer`:n?t===`shell`:r===`document`||i===`markdown`?t===`viewer`:r===`explorer`?t===`explorer`:r===`process`?t===`process`:r===`transfer`?t===`transfer`:r===`launcher`||i===`environment`?t===`shell`||t===`explorer`:r===`crx`||i===`crx`?t===`crx`||t===`explorer`:!0},gr=(e,t,n)=>[Fn(e),H(t),...n?.map?.(e=>typeof e==`string`?G(e,e,X):e)],_r=()=>B({id:`open-files`,label:`Open & share`,order:22,render:e=>{let t=[H(`Where files go when you open, share, or launch them. “Follow default” keeps the current app’s behavior.`)];if(hr(e,`viewer`)){let n=e.sku===`document`||e.hubSection===`document`||e.surface===`markdown`,r=n?ur:X;t.push(...gr(`Markdown / document`,n?`Drop, paste, share, and open always paint in this viewer. Sibling-app sinks are not available here.`:`Opened, pasted, dropped, or shared into the viewer.`,[G(`When a file opens`,`openPolicy.viewer.channels.open`,r),G(`Share target`,`openPolicy.viewer.channels.share-target`,r),G(`Launch queue`,`openPolicy.viewer.channels.launch-queue`,r),G(`Markdown`,`openPolicy.viewer.kinds.markdown`,r),G(`Text`,`openPolicy.viewer.kinds.text`,r),G(`Documents (PDF, Office)`,`openPolicy.viewer.kinds.document`,r),G(`Images`,`openPolicy.viewer.kinds.image`,r),G(`Other files`,`openPolicy.viewer.kinds.other`,r)]))}if(hr(e,`explorer`)){let n=e.surface===`capacitor`||e.surface===`native`||v();t.push(...gr(`Explorer`,n?`These rows are Android-only. They do not change the site / PWA / CRX. Open / click is CWSP-document or Ask Android; a file-type row overrides it only when it is not “Follow Open / click”.`:`These rows are site / PWA / CRX only. They do not change the Android Explorer APK. Markdown and images open in an inline window unless you pick a separate window or a new tab.`,n?[G(`Open / click`,`openPolicy.explorer.nativeOpen`,fr),G(`Markdown`,`openPolicy.explorer.nativeKinds.markdown`,pr),G(`Text`,`openPolicy.explorer.nativeKinds.text`,pr),G(`Documents`,`openPolicy.explorer.nativeKinds.document`,pr),G(`Images`,`openPolicy.explorer.nativeKinds.image`,pr),G(`Other files`,`openPolicy.explorer.nativeKinds.other`,pr)]:[G(`Open markdown / images in`,`openPolicy.explorer.placement`,dr),G(`Open / click`,`openPolicy.explorer.channels.open`,X),G(`Double-click`,`openPolicy.explorer.channels.dblclick`,X),G(`Markdown`,`openPolicy.explorer.kinds.markdown`,X),G(`Text`,`openPolicy.explorer.kinds.text`,X),G(`Documents`,`openPolicy.explorer.kinds.document`,X),G(`Images`,`openPolicy.explorer.kinds.image`,X),G(`Other files`,`openPolicy.explorer.kinds.other`,X)]))}return hr(e,`shell`)&&t.push(...gr(`Environment / shell`,`Launch queue, Capacitor open-with, share, and drop/paste on the home grid. Per-tile “Open link in” still wins.`,[G(`Share target`,`openPolicy.shell.channels.share-target`,X),G(`Launch queue`,`openPolicy.shell.channels.launch-queue`,X),G(`Capacitor open-with`,`openPolicy.shell.channels.capacitor`,X),G(`Markdown`,`openPolicy.shell.kinds.markdown`,X),G(`Text`,`openPolicy.shell.kinds.text`,X),G(`Documents`,`openPolicy.shell.kinds.document`,X),H(`Images on CWSP-shell: a photo that is large enough and not a strip/icon becomes wallpaper. Anything that does not fit opens in the viewer.`),G(`Images`,`openPolicy.shell.kinds.image`,mr),G(`Links`,`openPolicy.shell.kinds.url`,X)])),hr(e,`crx`)&&t.push(...gr(`Chrome extension`,`Markdown, images, documents, and snip results from CWSP-crx.`,[G(`Markdown`,`openPolicy.crx.kinds.markdown`,X),G(`Documents`,`openPolicy.crx.kinds.document`,X),G(`Images`,`openPolicy.crx.kinds.image`,X),G(`Snip results`,`openPolicy.crx.channels.snip`,X)])),hr(e,`process`)&&t.push(...gr(`Work Center / process`,`Defaults when Work Center is the receiver (share, launch, open-with).`,[G(`Text`,`openPolicy.process.kinds.text`,X),G(`Documents`,`openPolicy.process.kinds.document`,X),G(`Images`,`openPolicy.process.kinds.image`,X),G(`Links`,`openPolicy.process.kinds.url`,X),G(`Share target`,`openPolicy.process.channels.share-target`,X),G(`Launch queue`,`openPolicy.process.channels.launch-queue`,X),G(`Capacitor open-with`,`openPolicy.process.channels.capacitor`,X)])),hr(e,`transfer`)&&t.push(...gr(`Transfer`,`What to do when Transfer receives a type or share.`,[G(`Text`,`openPolicy.transfer.kinds.text`,X),G(`Documents`,`openPolicy.transfer.kinds.document`,X),G(`Images`,`openPolicy.transfer.kinds.image`,X),G(`Links`,`openPolicy.transfer.kinds.url`,X),G(`Share target`,`openPolicy.transfer.channels.share-target`,X)])),J(`open-files`,`Open & share`,t)},load:(e,t)=>{e.openPolicy=he(e),Nn(t,e)},save:e=>{e.openPolicy=me(e.openPolicy),k(e)}})})))()}var yr,br,xr,Sr,Cr,wr;function Tr(){return(Tr=e((()=>{V(),Se(),_e(),Y(),yr=[[`attach`,`Open as attachment in chat`],[`process`,`Run AI and write to clipboard`]],br=(e,t)=>{let n=G(e,t,[[``,`Active instruction`]]);return n.querySelector(`select`)?.setAttribute(`data-instruction-select`,``),n},xr=(e,t)=>{let n=t.ai?.customInstructions||[];e.querySelectorAll(`[data-instruction-select]`).forEach(e=>{let t=e.value;e.replaceChildren();let r=document.createElement(`option`);r.value=``,r.textContent=`Active instruction`,e.appendChild(r);for(let t of n){let n=document.createElement(`option`);n.value=t.id,n.textContent=t.label||t.id,e.appendChild(n)}t&&[...e.options].some(e=>e.value===t)&&(e.value=t)})},Sr=e=>[Fn(Ce[e]),G(`When ${Ce[e].toLowerCase()} arrives`,`ai.processIngress.kinds.${e}.mode`,yr),br(`Default instruction`,`ai.processIngress.kinds.${e}.instructionId`)],Cr=e=>{e.ai&&(delete e.ai.autoProcessShared,delete e.ai.shareTargetMode);let t=e.views?.workcenter;t&&(delete t.autoRunPinned,delete t.defaultInstructionId)},wr=()=>B({id:`workcenter`,label:`Process`,order:20,requiresView:`workcenter`,manualFields:!0,render:()=>J(`workcenter`,`Process`,[H(`Share Target, Android Share, Open with, and Launch Queue use one action per type. Attach puts the file in chat. Process runs AI in the background and writes the result to the clipboard.`),Fn(`Incoming file types`),...ge.flatMap(e=>Sr(e))]),load:(e,t)=>{e.ai=e.ai||{},e.ai.processIngress=A(e.ai.processIngress),Cr(e),xr(t,e),Nn(t,e)},save:(e,t)=>{Pn(t,e),e.ai=e.ai||{},e.ai.processIngress=A(e.ai.processIngress);let n=e.ai.processIngress,r=!1;for(let e of ge){let t=n.kinds[e];t.copyToClipboard=t.mode===`process`,t.mode===`process`&&(r=!0)}n.backgroundClipboard=r,Cr(e)}})})))()}var Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Z,Kr,qr,Jr,Yr,Xr,Zr;function Qr(){return(Qr=e((()=>{V(),Y(),Er=`cw::workspace::grid-layout`,Dr=`rs-open-link-target`,Or=`cwsp:workspace-grid`,kr=[[`squircle`,`Squircle`],[`circle`,`Circle`],[`square`,`Rounded square`],[`wavy`,`Wavy`]],Ar=[[`open-link`,`Open link`],[`open-view`,`Open view`]],jr=[[`name`,`Name`],[`installed`,`Date installed`],[`updated`,`Date updated`],[`color`,`Color (including mask)`],[`category`,`Category`],[`package`,`Package`]],Mr=[[`asc`,`Ascending`],[`desc`,`Descending`]],Nr=[[`inline`,`Inline (iframe / env window, same tab)`],[`external-app`,`External app (Android chooser)`],[`viewer`,`Markdown (in this app)`],[`document`,`CWSP-document`],[`explorer`,`CWSP-explorer`],[`workcenter`,`CWSP-process`],[`transfer`,`CWSP-transfer`],[`native-window`,`Native window (new browser window)`],[`new-tab`,`New tab`]],Pr=[[`compact`,`Compact (0.78)`],[`fit`,`Fit (1.0 — no zoom)`],[`fill`,`Fill (1.28 — adaptive default)`],[`zoom`,`Zoom (1.5)`],[`max`,`Max (1.75)`]],Fr=new Set(kr.map(([e])=>e)),Ir=new Set(Ar.map(([e])=>e)),Lr=new Set(Nr.map(([e])=>e)),Rr=new Set(Pr.map(([e])=>e)),zr=(e,t)=>{let n=Number(e);return Number.isFinite(n)?Math.max(1,Math.min(16,Math.round(n))):t},Br=(e,t=`squircle`)=>{let n=String(e||``).trim().toLowerCase();return Fr.has(n)?n:t},Vr=(e,t=`open-link`)=>{let n=String(e||``).trim().toLowerCase();return Ir.has(n)?n:t},Hr=(e,t=`fill`)=>{let n=String(e||``).trim().toLowerCase();return n===`small`||n===`0.78`?`compact`:n===`1`||n===`contain`?`fit`:n===`adaptive`||n===`1.28`?`fill`:n===`1.5`?`zoom`:n===`large`||n===`1.75`?`max`:Rr.has(n)?n:t},Ur=(e,t=`inline`)=>{let n=String(e||``).trim().toLowerCase();return n===`in-shell`||n===`env`||n===`shell`?`inline`:n===`native`||n===`window`||n===`app-window`?`native-window`:n===`tab`||n===`browser`||n===`browser-tab`?`new-tab`:n===`app`||n===`chooser`||n===`open-with`||n===`open-in-app`||n===`intent`?`external-app`:n===`markdown`?`viewer`:n===`document`||n===`cwsp-document`?`document`:n===`files`?`explorer`:n===`process`||n===`cwsp-process`?`workcenter`:n===`transfer`||n===`cwsp`||n===`network`?`transfer`:Lr.has(n)?n:t},Wr=e=>{if(!e)return{};try{let t=JSON.parse(e);if(t&&typeof t==`object`)return t}catch{}let t=/columns["']?\s*:\s*(\d+)/.exec(e),n=/rows["']?\s*:\s*(\d+)/.exec(e),r=/shape["']?\s*:\s*["']?([a-z-]+)/i.exec(e),i=/defaultAction["']?\s*:\s*["']?([a-z-]+)/i.exec(e),a=/defaultOpenLinkTarget["']?\s*:\s*["']?([a-z-]+)/i.exec(e),o=/iconScale["']?\s*:\s*["']?([a-z0-9.-]+)/i.exec(e),s={};return t&&(s.columns=Number(t[1])),n&&(s.rows=Number(n[1])),r&&(s.shape=Br(r[1])),i&&(s.defaultAction=Vr(i[1])),a&&(s.defaultOpenLinkTarget=Ur(a[1])),o&&(s.iconScale=Hr(o[1])),s},Gr=()=>{let e=null;try{window.dispatchEvent(new CustomEvent(Or,{detail:{query:!0,receive:t=>{e=t}}}))}catch{}let t={},n=``;try{t=Wr(localStorage.getItem(Er)),n=String(localStorage.getItem(Dr)||``)}catch{}return{columns:zr(e?.columns??t.columns,4),rows:zr(e?.rows??t.rows,8),shape:Br(e?.shape??t.shape,`squircle`),defaultAction:Vr(e?.defaultAction??t.defaultAction,`open-link`),defaultOpenLinkTarget:Ur(e?.defaultOpenLinkTarget??t.defaultOpenLinkTarget??n,`inline`),iconScale:Hr(e?.iconScale??t.iconScale,`fill`)}},Z=(e,t,n)=>{let r=e.querySelector(`[data-field="${t}"]`);!r||n==null||(r.value=String(n))},Kr=`cw::workspace::pages`,qr=e=>{let t=[],n=`side-a`;try{let e=JSON.parse(localStorage.getItem(Kr)||`null`);e?.pages?.length&&(t=e.pages,n=String(e.activeId||t[0].id))}catch{t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]}t.length||(t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]),e.replaceChildren();for(let r of t){let i=document.createElement(`div`);i.style.cssText=`display:flex;gap:.4rem;align-items:center;margin:.25rem 0;`;let a=document.createElement(`button`);a.type=`button`,a.className=`view-settings__btn`,a.textContent=r.label+(r.id===n?` · active`:``),a.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`switch`,id:r.id}})),requestAnimationFrame(()=>qr(e))});let o=document.createElement(`button`);if(o.type=`button`,o.className=`view-settings__btn`,o.textContent=`Rename`,o.addEventListener(`click`,()=>{let t=window.prompt(`Workspace name`,r.label);t&&(window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`rename`,id:r.id,label:t}})),requestAnimationFrame(()=>qr(e)))}),i.append(a,o),t.length>1){let t=document.createElement(`button`);t.type=`button`,t.className=`view-settings__btn`,t.textContent=`Remove`,t.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`remove`,id:r.id}})),requestAnimationFrame(()=>qr(e))}),i.append(t)}e.append(i)}},Jr=e=>{let t=e.querySelector(`[data-workspace-pages]`);t&&qr(t),e.dataset.workspacePagesBound!==`1`&&(e.dataset.workspacePagesBound=`1`,e.addEventListener(`click`,e=>{let n=(e.target?.closest?.(`[data-action]`))?.getAttribute(`data-action`)||``;if(n===`add-workspace-page`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`add`}}));else if(n===`workspace-page-prev`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`prev`}}));else if(n===`workspace-page-next`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`next`}}));else return;t&&requestAnimationFrame(()=>qr(t))}))},Yr=e=>{try{localStorage.setItem(Er,JSON.stringify({columns:e.columns,rows:e.rows,shape:e.shape,defaultAction:e.defaultAction,iconScale:e.iconScale||`fill`})),e.defaultOpenLinkTarget&&localStorage.setItem(Dr,e.defaultOpenLinkTarget)}catch{}},Xr=e=>{let t=!1;try{window.dispatchEvent(new CustomEvent(Or,{detail:{...e,ack:()=>{t=!0}}}))}catch{}t||Yr(e)},Zr=()=>B({id:`workspace`,label:`Workspace`,order:18,requiresView:`home`,surfaces:[`environment`,`crx`,`web`,`native`,`capacitor`],excludeSurfaces:[`markdown`],render:()=>J(`workspace`,`Workspace`,[H(`Theme, workspaces, and the Speed Dial grid share this page.`),`Workspaces`,H(`Pages of the Speed Dial. Explorer roots: /user/workspaces/side-a, side-b, …`),(()=>{let e=document.createElement(`div`);return e.setAttribute(`data-workspace-pages`,`1`),e.className=`field`,e})(),q(K(`Add workspace`,`add-workspace-page`),K(`Previous page`,`workspace-page-prev`),K(`Next page`,`workspace-page-next`)),`Grid`,H(`Speed dial grid on the Home / NTP workspace.`),G(`Default icon shape`,`grid.shape`,kr),G(`Icon bitmap scale`,`grid.iconScale`,Pr),In(`Columns`,`grid.columns`,{min:`1`,max:`16`,step:`1`,placeholder:`4`}),In(`Rows`,`grid.rows`,{min:`1`,max:`16`,step:`1`,placeholder:`8`}),`Default actions`,G(`New tile action`,`grid.defaultAction`,Ar),G(`Open links in`,`grid.defaultOpenLinkTarget`,Nr),`App menu`,H(`Installed-app icons in the App Menu. Color uses the painted icon, including mask.`),G(`Sort icons by`,`appMenu.sortBy`,jr),G(`Icon order`,`appMenu.sortDir`,Mr)]),load:(e,t)=>{let n=Gr(),r=e.grid||{};Z(t,`grid.shape`,n.shape||r.shape||`squircle`),Z(t,`grid.iconScale`,n.iconScale||r.iconScale||`fill`),Z(t,`grid.columns`,n.columns??r.columns??4),Z(t,`grid.rows`,n.rows??r.rows??8),Z(t,`grid.defaultAction`,n.defaultAction||r.defaultAction||`open-link`),Z(t,`grid.defaultOpenLinkTarget`,n.defaultOpenLinkTarget||r.defaultOpenLinkTarget||`inline`);let i={};try{let e=localStorage.getItem(`cwsp-app-menu-sort`);e&&(i=JSON.parse(e))}catch{}e.appMenu={...e.appMenu||{},sortBy:i.sortBy||e.appMenu?.sortBy||`name`,sortDir:i.sortDir||e.appMenu?.sortDir||`asc`},Z(t,`appMenu.sortBy`,e.appMenu.sortBy||`name`),Z(t,`appMenu.sortDir`,e.appMenu.sortDir||`asc`),Jr(t)},save:e=>{let t={columns:zr(e.grid?.columns,4),rows:zr(e.grid?.rows,8),shape:Br(e.grid?.shape,`squircle`),defaultAction:Vr(e.grid?.defaultAction,`open-link`),defaultOpenLinkTarget:Ur(e.grid?.defaultOpenLinkTarget,`inline`),iconScale:Hr(e.grid?.iconScale,`fill`)};e.grid={...e.grid||{},...t},Xr(t);try{localStorage.setItem(`cwsp-app-menu-sort`,JSON.stringify({sortBy:e.appMenu?.sortBy||`name`,sortDir:e.appMenu?.sortDir||`asc`})),window.dispatchEvent(new CustomEvent(`cwsp:app-menu-sort-change`))}catch{}}})})))()}var $r,ei,ti,ni;function ri(){return(ri=e((()=>{V(),Y(),$r=[[`name`,`Name`],[`date`,`Date modified`],[`type`,`Type`],[`size`,`Size`],[`kind`,`Kind (file / folder)`]],ei=[[`asc`,`Ascending`],[`desc`,`Descending`]],ti=e=>{try{localStorage.setItem(`cwsp-explorer-sort`,JSON.stringify({sortBy:e.explorer?.sortBy||`name`,sortDir:e.explorer?.sortDir||`asc`,foldersFirst:e.explorer?.foldersFirst!==!1})),window.dispatchEvent(new CustomEvent(`cwsp:explorer-sort-change`))}catch{}},ni=()=>B({id:`explorer-sort`,label:`Explorer list`,order:25,requiresView:`explorer`,render:()=>J(`explorer-sort`,`Explorer list`,[H(`Order of files and folders in CWSP-explorer / Explorer.`),G(`Sort items by`,`explorer.sortBy`,$r),G(`Order`,`explorer.sortDir`,ei),W(`Folders first`,`explorer.foldersFirst`)]),load:e=>{let t={};try{let e=localStorage.getItem(`cwsp-explorer-sort`);e&&(t=JSON.parse(e))}catch{}e.explorer={...e.explorer||{},sortBy:t.sortBy||e.explorer?.sortBy||`name`,sortDir:t.sortDir||e.explorer?.sortDir||`asc`,foldersFirst:(t.foldersFirst??e.explorer?.foldersFirst)!==!1}},save:e=>ti(e)})})))()}var ii,ai;function oi(){return(oi=e((()=>{Gn(),ar(),sr(),lr(),vr(),Tr(),Qr(),ri(),ii=!1,ai=()=>{ii||(ii=!0,ir(),Zr(),ni(),_r(),cr(),wr(),or(),Wn())}})))()}var si,ci,li,ui,di,fi,pi;function mi(){return(mi=e((()=>{p(),rt(),w(),si=null,ci=null,li=()=>{try{let e=globalThis,t=e.Capacitor?.getPlatform?.();return!!(e.Capacitor?.isNativePlatform?.()||t===`android`||t===`ios`||e.__CWS_NATIVE__===!0)}catch{return!1}},ui=()=>{let e=x()||g();return e&&e!==`launcher`&&e!==`crx`?`none`:at()!==null||m()?`hub`:e===`launcher`&&li()?`launcher`:`none`},di=()=>si,fi=async()=>{if(ci)return ci;ci=(async()=>{let e=pt.map(e=>{let t=lt(e);return{section:e,pkg:b(t)}}).filter(e=>!!e.pkg);try{let{launcherHasPackages:t}=await T(async()=>{let{launcherHasPackages:e}=await import(`./launcher-bridge-Df9GjB_e.js`);return{launcherHasPackages:e}},[],import.meta.url),n=await t(e.map(e=>e.pkg));si=e.filter(e=>n[e.pkg]===!0).map(e=>e.section)}catch{si=[]}return si})();try{return await ci}finally{ci=null}},pi=(e,t)=>{let n=[...e||[]].filter(e=>e!==`hub`).sort(),r=[...t||[]].filter(e=>e!==`hub`).sort();return n.length===r.length&&n.every((e,t)=>e===r[t])}})))()}var hi,gi,Q,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii;function Li(){return(Li=e((()=>{be(),oe(),V(),oi(),p(),rt(),mi(),fe(),We(),w(),hi=`[data-settings-tabs]`,gi=`.settings-screen__body`,Q=()=>{try{let e=globalThis,t=e.Capacitor?.getPlatform?.();return!!(e.Capacitor?.isNativePlatform?.()||t===`android`||t===`ios`||e.__CWS_NATIVE__===!0)}catch{return!1}},_i=()=>{try{let e=g();if(e===`document`)return Q()?`capacitor`:`markdown`;if(e===`process`||e===`explorer`)return Q()?`capacitor`:`web`;if(e===`launcher`)return Q()?`capacitor`:`environment`;if(e===`crx`)return`crx`;let t=globalThis;if(t?.chrome?.runtime?.id)return`crx`;if(t?.Capacitor?.isNativePlatform?.()||t?.Capacitor?.getPlatform?.()===`android`||t?.Capacitor?.getPlatform?.()===`ios`)return`capacitor`;if(t?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`){let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase();if(e===`cw-markdown`||e===`cw-document`||e===`document`)return`markdown`;if(e===`environment`||e===`cw-environment`||e===`cwsp-shell`||document.querySelector?.(`.env-shell-root[data-shell='environment'], env-shell-container[data-shell='environment']`))return`environment`}if(typeof document<`u`)return`web`}catch{}return`unknown`},vi=(e,t)=>{let n=at(),r=ui(),i=r===`hub`||r===`launcher`?t||ht()||`hub`:null,a=n||i||t||void 0,o=a?lt(a):g(),s=_i();return a===`document`?s=Q()?`capacitor`:`markdown`:a===`transfer`||a===`process`||a===`explorer`?s=Q()?`capacitor`:`web`:a===`hub`&&(s=Q()?`capacitor`:`environment`),{isExtension:!!e,surface:s,sku:o,hubSection:a}},yi=(e,t)=>{if(e.requiresView&&!O(e.requiresView)&&(e.id!==`workcenter`||t.sku!==`process`&&t.hubSection!==`process`))return!1;let n=e.surfaces;if(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface)||e.id===`apk-update`&&!Q())return!1;if(e.id===`cwsp`){let e=t.sku||g();if(e===`launcher`||e===`explorer`||e===`document`||e===`process`)return!1}return!0},bi=e=>kn().filter(t=>yi(t,e)),xi=(e,t)=>{let n=e.querySelector(hi),r=e.querySelector(gi);if(!(!n||!r))for(let i of bi(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;if(i.id===`workspace`){let n=e.querySelector(`[data-tab-panel="appearance"]`);if(n){let e=null;try{e=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(e){let t=document.createElement(`div`);t.setAttribute(`data-contribution`,`workspace`),t.hidden=!1,e.matches?.(`[data-tab-panel]`)?(e.removeAttribute(`hidden`),e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.append(...Array.from(e.childNodes))):(e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.appendChild(e)),n.appendChild(t)}continue}}let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},Si=(e,t,n)=>{for(let r of bi(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`)||e.querySelector(`[data-contribution="${r.id}"]`);t&&n(r,t)}},Ci=(e,t,n)=>{Si(e,n,(e,r)=>{try{e.manualFields||Nn(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},wi=(e,t,n)=>{Si(e,n,(e,r)=>{try{e.manualFields||Pn(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},Ti=e=>!!e&&typeof e==`object`&&!Array.isArray(e),Ei=(e,t)=>{if(!Ti(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(Ti(t)&&Ti(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return Ti(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},Di=()=>{try{let e=globalThis,t=typeof e.chrome?.runtime?.id==`string`&&typeof e.__NEUTRALINO_AUTH__?.port==`number`;return!!(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||typeof e.__WEBNATIVE_AUTH__?.port==`number`||typeof e.__NEUTRALINO_AUTH__?.port==`number`||t)}catch{return!1}},Oi=e=>{if(!e||typeof e!=`object`)return!1;let t=e.core,n=e.shell,r=e.bridge,i=e.cwsp,a=e.control;return!!(typeof t?.endpointUrl==`string`&&t.endpointUrl.trim()||typeof t?.userId==`string`&&t.userId.trim()||typeof t?.ecosystemToken==`string`&&t.ecosystemToken.trim()||typeof t?.userKey==`string`&&t.userKey.trim()||typeof n?.clipboardInboundMode==`string`&&n.clipboardInboundMode||typeof n?.clipboardOutboundMode==`string`&&n.clipboardOutboundMode||typeof n?.remoteHost==`string`&&n.remoteHost.trim()||typeof n?.clientId==`string`&&n.clientId.trim()||typeof n?.allowControlApi==`boolean`||typeof n?.bridgeDaemonEnabled==`boolean`||typeof n?.autoStartOnBoot==`boolean`||typeof r?.endpointUrl==`string`&&r.endpointUrl.trim()||typeof r?.userId==`string`&&String(r.userId).trim()||typeof i?.clientId==`string`&&String(i.clientId).trim()||typeof i?.endpointUrl==`string`&&String(i.endpointUrl).trim()||a?.surface===`capacitor-android`)},ki=()=>{try{let e=globalThis.chrome?.runtime?.id;return typeof e==`string`&&e.length>0}catch{return!1}},Ai=e=>{if(!ki())return e;let t=`L-110-crx`,n=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),r=((...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!n(e))return e}return`L-110`})(e.shell?.clientId,e.core?.userId);return{...e,core:{...e.core||{},userId:t,socket:{...e.core?.socket||{},selfId:t}},shell:{...e.shell||{},clientId:r}}},ji=async e=>{let t=await e();if((t.core?.preferBackendSync??!0)===!1)return Ai(t);let n=await M(),r=(()=>{try{if(!ki())return!1;let e=globalThis;return String(globalThis.document?.documentElement?.dataset?.cwspBridge||``)===`live`||typeof e.__NEUTRALINO_AUTH__?.port==`number`}catch{return!1}})();if((Di()||r)&&!Oi(n))for(let e=0;e<8&&(await new Promise(e=>setTimeout(e,300)),n=await M(),!Oi(n));e++);return Ai(Ei(t,n))},Mi=async(e,t,n={})=>{let r=await M(),i=Ei(n,r);return Ci(e,i,t),i},Ni=async(e,t,n)=>(wi(e,t,n),et(t)),Pi=e=>bi(e).map(e=>e.id),Fi=()=>Q(),Ii=async e=>{ye(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await T(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-CetAcicq.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=e=>{let t=e.toLowerCase();return t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`||t===`md.u2re.space`||t===`www.md.u2re.space`},a=e=>{let t=String(e||``).trim();if(!t)return``;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e).hostname.toLowerCase();if(i(n))return``}catch{if(/cwsp\.u2re\.space|md\.u2re\.space/i.test(t))return``}return t},o=e=>{let t=String(e||``).trim();return t?/[,;\s]/.test(t)&&/:\/\//.test(t)?t.split(/[,;\s]+/).map(e=>a(e.trim())).filter(Boolean).join(`;`):a(t):``};if(typeof t.endpointUrl==`string`){let e=o(t.endpointUrl);e!==t.endpointUrl.trim()&&(t.endpointUrl=e)}let s=typeof t.endpointUrl==`string`?t.endpointUrl:``,c=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!s.trim()&&!c.trim())return;let l=Fi()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},u=await pe({relayHttpsUrl:s,directHttpsUrl:c},l);u.relayHttpsUrl!==void 0&&(t.endpointUrl=u.relayHttpsUrl),u.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:u.directHttpsUrl})}})))()}var $,Ri,zi,Bi;function Vi(){return(Vi=e((()=>{l(),Ee(),be(),wt(),le(),Le(),Pt(),Bt(),Te(),Jt(),Qt(),en(),nn(),z(),hn(),_n(),yn(),xn(),Tn(),Dn(),Li(),p(),He(),ze(),Nt(),tt(),w(),$=null,Ri=()=>{$=null},zi=[{id:`hub`,label:`Shell`,icon:`squares-four`},{id:`explorer`,label:`Explorer`,icon:`folder`},{id:`document`,label:`Document`,icon:`books`},{id:`process`,label:`Process`,icon:`lightning`},{id:`transfer`,label:`Transfer`,icon:`arrows-left-right`}],Bi=e=>{let n=e.hubSection||at()||`hub`;if($){if($.dataset.hubSettingsSection!==n)$=null;else return e.initialTab&&$.dispatchEvent(new CustomEvent(`cwsp-settings-resync`)),$}let r=null,i=null,a=()=>{let e=_i();return e===`capacitor`||e===`native`?8e3:2500},s=(e,t)=>{r&&(i&&=(clearTimeout(i),null),r.textContent=e,r.classList.remove(`note--ok`,`note--warn`,`note--err`),t?.tone===`ok`&&r.classList.add(`note--ok`),t?.tone===`warn`&&r.classList.add(`note--warn`),t?.tone===`err`&&r.classList.add(`note--err`),e&&!t?.persist&&(i=setTimeout(()=>{r&&(r.textContent=``,r.classList.remove(`note--ok`,`note--warn`,`note--err`))},a())))},l=o`<div class="view-settings" data-view="settings">
    ${tn()}
    <div class="settings-screen__body">
      ${on()}
      ${mn()}
      ${gn()}
      ${vn()}
      ${bn()}
      ${wn(s)}
      ${En()}
    </div>
    ${$t()}
  </div>`;Mt(l),ai();let u=ui(),d=di(),f=ot(u,d),p=vi(e.isExtension,e.hubSection);if(u!==`none`){let t=e.hubSection||p.hubSection||`hub`;p.hubSection=f.length&&!f.includes(t)?`hub`:t}let m=ft(p);if(l.dataset.hubSettingsSection=p.hubSection||n,xi(l,p),f.length>1){let e=l.querySelector(`.settings-screen__top`),t=l.querySelector(`[data-settings-tabs]`);if(e&&t){let n=document.createElement(`nav`);n.className=`settings-tab-actions settings-sku-nav`,n.setAttribute(`data-settings-sku-nav`,``),n.setAttribute(`aria-label`,`Settings area`);for(let e of zi){if(!f.includes(e.id))continue;let t=document.createElement(`button`);t.className=`settings-tab-btn`,t.type=`button`,t.setAttribute(`data-action`,`open-settings-section`),t.setAttribute(`data-section`,e.id),t.append(o`<ui-icon class="settings-sku-nav__icon" icon="${e.icon}" icon-style="duotone" aria-hidden="true"></ui-icon>`,o`<span>${e.label}</span>`),t.classList.toggle(`is-active`,e.id===(p.hubSection||`hub`)),n.appendChild(t)}e.insertBefore(n,t)}}u===`launcher`&&d===null&&fi().then(e=>{e.length&&(Ri(),globalThis.dispatchEvent(new CustomEvent(`cwsp-settings-section`)))}),ct(l,m),m===`full`&&(p.surface===`capacitor`||p.surface===`native`)&&(l.querySelector(`[data-tab-panel="server"]`)?.remove(),l.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let h=e=>dt(l,e),v=e=>{let t=String(e?.getAttribute(`data-apk-sku`)||e?.closest(`[data-apk-sku-row]`)?.getAttribute(`data-apk-sku-row`)||``).trim();return t&&ee(t)&&t!==`crx`?t:``},y=e=>{let t=v(e||null),n=st(l.dataset.hubSettingsSection||`hub`),r=t||(ui()!==`none`&&n!==`hub`?lt(n):g()||`launcher`);return{sku:r,packageName:b(r)||``,manifest:_(r)}},x=e=>{if(typeof e==`number`&&Number.isFinite(e))return e;if(typeof e==`string`&&e.trim()&&e!==`?`){let t=Number(e);return Number.isFinite(t)?t:null}return null},te=(e,t)=>{let n=e=>String(e||``).trim().split(/[+-]/)[0].split(`.`).map(e=>Number(String(e).replace(/[^0-9]/g,``))||0),r=n(e),i=n(t);if(!String(e||``).trim()&&!String(t||``).trim())return 0;let a=Math.max(r.length,i.length);for(let e=0;e<a;e++){let t=r[e]||0,n=i[e]||0;if(t!==n)return t<n?-1:1}return 0},ne=(e,t,n)=>{if(!e)return;let r=n,i=String(t.localVersionName||t.versionName||r?.versionName||``).trim(),a=x(t.localVersionCode??t.versionCode??r?.versionCode),o=String(t.localSignatureSha256||t.signatureSha256||``).slice(0,12),s=String(t.remoteVersionName||``).trim(),c=x(t.remoteVersionCode),l=t.installed===!1||r?.installed===!1?!1:t.installed===!0||r?.installed===!0||!!(i&&a!=null&&a!==0),u=c==null?``:` · gateway ${s||`?`} (${c})`;if(!l){e.textContent=`Not installed — Download & install to sideload.${u}`;return}e.textContent=`Installed: ${i||`?`} (${a??`?`})`+(o?` · sig ${o}…`:``)+u},re=()=>({srcEl:l.querySelector(`[data-field="shell.apkUpdateSource"]`),endpointEl:l.querySelector(`[data-field="core.endpointUrl"]`),tokenEl:l.querySelector(`[data-field="core.ecosystemToken"]`),insecureEl:l.querySelector(`[data-field="core.allowInsecureTls"]`)}),S=e=>l.querySelector(e);r=l.querySelector(`[data-note]`);let C=S(`[data-field="ai.baseUrl"]`),w=S(`[data-field="ai.apiKey"]`),E=S(`[data-field="ui.showKey"]`),D=S(`[data-field="ai.model"]`),O=S(`[data-field="ai.customModel"]`),ie=l.querySelector(`[data-field-group="ai.customModel"]`),ae=S(`[data-field="ai.defaultReasoningEffort"]`),oe=S(`[data-field="ai.defaultVerbosity"]`),se=S(`[data-field="ai.maxOutputTokens"]`),ce=S(`[data-field="ai.contextTruncation"]`),le=S(`[data-field="ai.promptCacheRetention"]`),de=S(`[data-field="ai.maxToolCalls"]`),fe=S(`[data-field="ai.parallelToolCalls"]`),pe=S(`[data-field="ai.requestTimeout.low"]`),me=S(`[data-field="ai.requestTimeout.medium"]`),he=S(`[data-field="ai.requestTimeout.high"]`),ge=S(`[data-field="ai.maxRetries"]`),_e=()=>{let e=(D?.value||``).trim()===`custom`;ie&&(ie.hidden=!e),O&&(O.disabled=!e)};if(D){D.replaceChildren();for(let e of xe){let t=document.createElement(`option`);t.value=e,t.textContent=e,D.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,D.append(e),D.addEventListener(`change`,_e)}O?.addEventListener(`focus`,()=>{D&&(D.value=`custom`,_e())});let k=S(`[data-field="ai.responseLanguage"]`),ye=S(`[data-field="ai.translateResults"]`),be=S(`[data-field="ai.generateSvgGraphics"]`),A=S(`[data-field="speech.language"]`),Se=S(`[data-field="appearance.theme"]`),Ce=S(`[data-field="appearance.fontSize"]`),Te=l.querySelector(`[data-appearance-color]`),Ee=S(`[data-field="appearance.colorSource"]`),Ne=S(`[data-field="appearance.hue"]`),Pe=S(`[data-field="appearance.color"]`),Ie=S(`[data-field="appearance.markdown.preset"]`),Le=S(`[data-field="appearance.markdown.fontFamily"]`),Re=S(`[data-field="appearance.markdown.fontSizePx"]`),j=S(`[data-field="appearance.markdown.lineHeight"]`),ze=S(`[data-field="appearance.markdown.contentMaxWidthPx"]`),He=S(`[data-field="appearance.markdown.printScale"]`),Ue=S(`[data-field="appearance.markdown.page.size"]`),We=S(`[data-field="appearance.markdown.page.orientation"]`),Ge=S(`[data-field="appearance.markdown.page.marginMm"]`),Ke=S(`[data-field="appearance.markdown.modules.typography"]`),qe=S(`[data-field="appearance.markdown.modules.lists"]`),Je=S(`[data-field="appearance.markdown.modules.tables"]`),Ye=S(`[data-field="appearance.markdown.modules.codeBlocks"]`),Xe=S(`[data-field="appearance.markdown.modules.blockquotes"]`),Ze=S(`[data-field="appearance.markdown.modules.media"]`),Qe=S(`[data-field="appearance.markdown.modules.printBreaks"]`),$e=S(`[data-field="appearance.markdown.plugins.smartTypography"]`),M=S(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),et=S(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),tt=l.querySelector(`[data-field="appearance.markdown.customCss"]`),rt=l.querySelector(`[data-field="appearance.markdown.printCss"]`),ut=l.querySelector(`[data-field="appearance.markdown.extensions"]`),pt=S(`[data-field="core.ntpEnabled"]`),ht=S(`[data-field="core.mode"]`),gt=S(`[data-field="core.endpointUrl"]`),_t=S(`[data-field="core.userId"]`),vt=S(`[data-field="core.userKey"]`),yt=S(`[data-field="core.ecosystemToken"]`),bt=S(`[data-field="core.preferBackendSync"]`),xt=S(`[data-field="core.encrypt"]`),St=S(`[data-field="core.appClientId"]`),wt=S(`[data-field="core.allowInsecureTls"]`),Et=S(`[data-field="core.ops.allowUnencrypted"]`),Dt=S(`[data-field="core.admin.httpsOrigin"]`),Ot=S(`[data-field="core.admin.httpOrigin"]`),kt=S(`[data-field="core.admin.path"]`),N=S(`[data-field="core.socket.accessToken"]`),At=S(`[data-field="core.socket.routeTarget"]`),jt=S(`[data-field="core.socket.clientAccessToken"]`),P=S(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),Nt=S(`[data-field="shell.maintainHubSocketConnection"]`),Pt=S(`[data-field="shell.clipboardBroadcastTargets"]`),Ft=S(`[data-field="shell.pushLocalClipboardToLan"]`),It=S(`[data-field="shell.clipboardPushIntervalMs"]`),Rt=S(`[data-field="shell.enableRemoteClipboardBridge"]`),zt=S(`[data-field="shell.acceptInboundClipboardData"]`),Bt=S(`[data-field="shell.clipboardInboundAllowIds"]`),Vt=S(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),Ut=S(`[data-field="shell.clipboardShareDestinationIds"]`),Jt=S(`[data-field="shell.applyRemoteClipboardToDevice"]`),Qt=S(`[data-field="shell.acceptContactsBridgeData"]`),en=S(`[data-field="shell.acceptSmsBridgeData"]`),nn=S(`[data-field="shell.enableNativeSms"]`),rn=S(`[data-field="shell.enableNativeContacts"]`),an=l.querySelector(`[data-admin-preview]`),R=l.querySelector(`[data-mcp-section]`),sn=l.querySelector(`[data-section="extension"]`),cn=l.querySelector(`[data-extension-tab]`);if(k){k.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,k.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,k.append(t);for(let e of Gt()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,k.append(t)}}if(A){A.replaceChildren();for(let e of Wt()){let t=document.createElement(`option`);t.value=e,t.textContent=Ht(e),A.append(t)}}l.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&yn()}),l.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&yn()});let z=e=>{let t=nt(m),n=e||t,r=()=>l.querySelectorAll(`.settings-screen__body > [data-tab-panel]`);[...r()].some(e=>e.getAttribute(`data-tab-panel`)===n)||(n=r()[0]?.getAttribute(`data-tab-panel`)||t),l.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let i=l.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let a=r();for(let e of Array.from(a)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}};l.addEventListener(`click`,e=>{let t=qt(e),n=t?.closest?.(`[data-action="open-settings-section"][data-section]`);if(n&&l.contains(n)){e.preventDefault(),e.stopPropagation();let t=String(n.getAttribute(`data-section`)||`hub`).toLowerCase();if(it(t),Ri(),ui()===`hub`){let e=mt(t);Lt(`settings`,e?{section:e}:{})}else globalThis.dispatchEvent(new CustomEvent(`cwsp-settings-section`,{detail:{section:t}}));return}let r=t?.closest?.(`[data-action="switch-settings-tab"][data-tab]`);!r||!l.contains(r)||(e.preventDefault(),e.stopPropagation(),z(r.getAttribute(`data-tab`)||nt(m)))},!0);let hn=e=>{let t=nt(m),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?h(`markdown`)?`markdown`:t:new Set([...h(`appearance`)?[`appearance`]:[],...h(`markdown`)?[`markdown`]:[],...h(`ai`)?[`ai`]:[],...h(`mcp`)?[`mcp`]:[],...h(`server`)?[`server`]:[],...h(`instructions`)?[`instructions`]:[],...h(`extension`)?[`extension`]:[],...Pi(p)]).has(n)?n:t:t},_n=()=>{let e=yt?.value?.trim()||vt?.value?.trim()||N?.value?.trim()||``;return{mode:ht?.value||`native`,endpointUrl:gt?.value?.trim()||``,userId:_t?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!xt?.checked,preferBackendSync:(bt?.checked??!0)!==!1,appClientId:St?.value?.trim()||``,allowInsecureTls:!!wt?.checked,useCoreIdentityForAirPad:!0,socket:{accessToken:e,routeTarget:At?.value?.trim()||``,selfId:``,clientAccessToken:jt?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!P?.checked},admin:{httpsOrigin:Dt?.value?.trim()||``,httpOrigin:Ot?.value?.trim()||``,path:kt?.value?.trim()||`/`},ops:{allowUnencrypted:!!Et?.checked}}},yn=()=>{if(!an)return;let e=Ct(_n());an.textContent=`Resolved: ${e.https} · ${e.http}`},xn=e=>{try{c(t.EXPLORER_PATH,e),Lt(`explorer`),ue({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),s(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),s(`Failed to open Explorer path.`)}};Promise.resolve((async()=>((p.surface===`capacitor`||p.surface===`native`)&&await ke().catch(()=>null),(p.surface===`crx`||p.isExtension)&&await je().catch(()=>null),ji(()=>Ae())))()).then(t=>{C&&(C.value=(t?.ai?.baseUrl||``).trim()),w&&(w.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.6-luna`).trim(),r=(t?.ai?.customModel||``).trim();if(D){let e=xe.includes(n);n===`custom`||!e&&n?(D.value=`custom`,O&&(O.value=r||n)):(D.value=e?n:`gpt-5.6-luna`,O&&(O.value=r)),_e()}if(ae&&(ae.value=t?.ai?.defaultReasoningEffort||`medium`),oe&&(oe.value=t?.ai?.defaultVerbosity||`medium`),se&&(se.value=String(t?.ai?.maxOutputTokens??4e5)),ce&&(ce.value=t?.ai?.contextTruncation||`disabled`),le&&(le.value=t?.ai?.promptCacheRetention||`in-memory`),de&&(de.value=String(t?.ai?.maxToolCalls??8)),fe&&(fe.checked=(t?.ai?.parallelToolCalls??!0)!==!1),pe&&(pe.value=String(t?.ai?.requestTimeout?.low??6e4)),me&&(me.value=String(t?.ai?.requestTimeout?.medium??3e5)),he&&(he.value=String(t?.ai?.requestTimeout?.high??9e5)),ge&&(ge.value=String(t?.ai?.maxRetries??2)),k&&(k.value=t?.ai?.responseLanguage||`auto`),ye&&(ye.checked=!!t?.ai?.translateResults),be&&(be.checked=!!t?.ai?.generateSvgGraphics),A&&(A.value=t?.speech?.language||`en-US`),Se&&(Se.value=t?.appearance?.theme||`auto`),Ce&&(Ce.value=t?.appearance?.fontSize||`medium`),Te&&(Te.hidden=!1,dn(l,String(t?.appearance?.colorSource||`auto`)),fn(l,String(t?.appearance?.color||``))),Ie&&(Ie.value=t?.appearance?.markdown?.preset||`default`),Le&&(Le.value=t?.appearance?.markdown?.fontFamily||`system`),Re&&(Re.value=String(t?.appearance?.markdown?.fontSizePx??16)),j&&(j.value=String(t?.appearance?.markdown?.lineHeight??1.7)),ze&&(ze.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),He&&(He.value=String(t?.appearance?.markdown?.printScale??1)),Ue&&(Ue.value=t?.appearance?.markdown?.page?.size||`auto`),We&&(We.value=t?.appearance?.markdown?.page?.orientation||`portrait`),Ge&&(Ge.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Ke&&(Ke.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),qe&&(qe.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Je&&(Je.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),Ye&&(Ye.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),Xe&&(Xe.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),Ze&&(Ze.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),Qe&&(Qe.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),$e&&($e.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),M&&(M.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),et&&(et.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),tt&&(tt.value=(t?.appearance?.markdown?.customCss||``).trim()),rt&&(rt.value=(t?.appearance?.markdown?.printCss||``).trim()),ut){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];ut.value=e.length>0?JSON.stringify(e,null,2):``}pt&&(pt.checked=!!t?.core?.ntpEnabled),ht&&(ht.value=t?.core?.mode||`native`),gt&&(gt.value=(t?.core?.endpointUrl||``).trim()),_t&&(_t.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();yt&&(yt.value=e),vt&&(vt.value=e),N&&(N.value=e)}if(bt&&(bt.checked=(t?.core?.preferBackendSync??!0)!==!1),xt&&(xt.checked=!!t?.core?.encrypt),St&&(St.value=(t?.core?.appClientId||``).trim()),At&&(At.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),jt&&(jt.value=(t?.core?.socket?.clientAccessToken||``).trim()),P&&(P.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),wt&&(wt.checked=!!t?.core?.allowInsecureTls),Et&&(Et.checked=!!t?.core?.ops?.allowUnencrypted),Dt&&(Dt.value=(t?.core?.admin?.httpsOrigin||``).trim()),Ot&&(Ot.value=(t?.core?.admin?.httpOrigin||``).trim()),kt&&(kt.value=(t?.core?.admin?.path||`/`).trim()||`/`),Nt&&(Nt.checked=!!t?.shell?.maintainHubSocketConnection),Pt&&(Pt.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),Ft&&(Ft.checked=!!t?.shell?.pushLocalClipboardToLan),It){let e=Number(t?.shell?.clipboardPushIntervalMs);It.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}Rt&&(Rt.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),zt&&(zt.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),Bt&&(Bt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),Vt&&(Vt.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),Ut&&(Ut.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),Jt&&(Jt.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),Qt&&(Qt.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),en&&(en.checked=!Be()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),nn&&(nn.checked=!Be()&&(t?.shell?.enableNativeSms??!1)===!0),rn&&(rn.checked=(t?.shell?.enableNativeContacts??!0)!==!1),yn(),Zt(R,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),we(t),Fe(t),Ci(l,t,p),e.onTheme?.(t?.appearance?.theme||`auto`),Be()&&T(()=>import(`./cws-bridge-D9AjNfMU.js`).then(e=>(e.a(),e.n)).then(async e=>{let n=[...l.querySelectorAll(`[data-apk-local-version]`)];if(!n.length)return;let{srcEl:r,endpointEl:i,tokenEl:a,insecureEl:o}=re(),s=(r?.value||t.shell?.apkUpdateSource||`wan`).trim(),c=(i?.value||t.core?.endpointUrl||``).trim(),u=(a?.value||``).trim()||ve(t),d=o?.checked??!!t.core?.allowInsecureTls;await Promise.all(n.map(async t=>{let n=y(t);try{let r=await e.invokeCwsNative(`app:update:check`,{...n,source:s,endpointUrl:c,token:u,ecosystemToken:u,allowInsecureTls:d}),i=r?.echo||{};if(i.error){let r=await e.invokeCwsNative(`app:info`,n);ne(t,r?.echo||{},r);return}ne(t,i,r)}catch{let r=await e.invokeCwsNative(`app:info`,n);ne(t,r?.echo||{},r)}}))}),[],import.meta.url).catch(()=>{})}).catch(()=>{Zt(R,[])}),E?.addEventListener(`change`,()=>{!w||!E||(w.type=E.checked?`text`:`password`)});let Sn=e=>{(async()=>{try{let t=await Ae();Fe({...t,appearance:{...t.appearance||{},...e}})}catch{Fe({appearance:{theme:`auto`,fontSize:`medium`,...e}})}})()};if(Te?.addEventListener(`click`,e=>{let t=e.target?.closest?.(`.appearance-swatch`);if(!t)return;let n=t.dataset.color??``;dn(l,`custom`),fn(l,n),Sn({color:n,colorSource:`custom`})}),Ee?.addEventListener(`change`,()=>{let e=un(l);dn(l,e),Sn({colorSource:e,color:e===`custom`?pn(l):void 0})}),Ne?.addEventListener(`input`,()=>{let e=ln(Number(Ne.value));dn(l,`custom`),fn(l,e),Sn({color:e,colorSource:`custom`})}),Pe?.addEventListener(`input`,()=>{let e=Pe.value||``;dn(l,`custom`),fn(l,e),Sn({color:e,colorSource:`custom`})}),Se?.addEventListener(`change`,()=>{let t=Se.value||`auto`;(async()=>{try{let e=await Ae();Fe({...e,appearance:{...e.appearance||{},theme:t}})}catch{Fe({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),l.addEventListener(`click`,t=>{let n=qt(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&R){R.querySelector(`.mcp-empty-note`)?.remove(),R.appendChild(Yt({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),R&&!R.querySelector(`[data-mcp-id]`)&&Zt(R,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){xn(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){xn(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){Tt(_n(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){Tt(_n(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=Ct(_n());navigator.clipboard?.writeText?.(e.https).then(()=>s(`HTTPS admin URL copied.`),()=>s(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=Ct(_n());navigator.clipboard?.writeText?.(e.http).then(()=>s(`HTTP admin URL copied.`),()=>s(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){T(()=>import(`./clipboard-device-QXuiLwe1.js`).then(e=>(e.n(),e.t)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>s(`App settings opened (native shell only).`)).catch(()=>s(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){T(()=>import(`./clipboard-device-QXuiLwe1.js`).then(e=>(e.n(),e.t)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>s(`Notification settings opened (native shell only).`)).catch(()=>s(`Native settings unavailable in this context.`));return}let i=n?.closest?.(`button[data-action="crx-control-pair"]`),a=n?.closest?.(`button[data-action="crx-control-unpair"]`);if(i||a){(async()=>{let e=l.querySelector(`[data-crx-control-status]`),t=()=>{try{globalThis.chrome?.runtime?.sendMessage?.({type:`cwsp-control-session-changed`})}catch{}};try{let n=await T(()=>import(`./crx-control-session-D7DIGdNp.js`),[],import.meta.url);if(a){await n.clearCrxControlSession(),e&&(e.textContent=await n.formatCrxControlSessionStatus()),s(`Control unpaired — Copy & Share / Paste by CWSP disabled.`,{tone:`warn`}),t();return}let r=String(l.querySelector(`[data-field="shell.localHubUrl"]`)?.value||``).trim(),i=String(document.documentElement.dataset.cwspControlOrigin||``).trim();e&&(e.textContent=`Control: waiting for pairing dialog…`),s(`Enter public token + device code in the pairing dialog…`);let o=await n.pairCrxControlWithModal({localHubUrl:r,preferredOrigins:i?[i]:[]});if(o.cancelled){e&&(e.textContent=await n.formatCrxControlSessionStatus()),s(`Pairing cancelled.`);return}e&&(e.textContent=o.ok?await n.formatCrxControlSessionStatus():`Control: ${o.error}`),o.ok?(s(`Paired Control at ${o.session.controlHost} (persistent).`),t()):s(o.error,{tone:`warn`})}catch(e){s(`Control pairing unavailable: ${e instanceof Error?e.message:String(e)}`,{tone:`warn`})}})();return}let o=n?.closest?.(`button[data-action="control-pairing-refresh"]`),c=n?.closest?.(`button[data-action="control-public-token-regenerate"]`);if(o||c){let e=!!t?.isTrusted;(async()=>{try{let t=String(location.hostname||``);if(location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`){e&&s(`Pairing codes are shown on the device (phone/desk), not in the public Control SPA.`,{tone:`warn`});return}}catch{}let t=l.querySelector(`input[data-control-device-code], [data-control-device-code]`),n=l.querySelector(`input[data-control-public-token], [data-control-public-token]`),r=l.querySelector(`[data-secret-meta="control-device-code"]`),i=l.querySelector(`[data-secret-meta="control-public-token"]`),a=e=>{let a=String(e.deviceCode||``).trim(),o=Math.max(1,Math.round(Number(e.expiresInMs||0)/1e3)),s=String(e.publicToken||``).trim();t instanceof HTMLInputElement?t.value=a:t&&(t.textContent=a?`Code: ${a} (${o}s)`:`Code: …`),n instanceof HTMLInputElement?n.value=s:n&&(n.textContent=s?`Public token: ${s}`:`Public token: …`),r&&(r.textContent=a?`Expires in ${o}s`:``),i&&(i.textContent=s?`Stable until regenerated`:``)};try{e&&s(c?`Regenerating public token…`:`Refreshing pairing code…`,{tone:`warn`});try{let{invokeCwsNative:t}=await T(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-D9AjNfMU.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),n=await t(c?`control:public-token:regenerate`:`control:pairing:status`,{}),r=n?.controlPairing||n?.echo||{};if(r?.deviceCode||r?.publicToken){a(r),e&&s(c?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`});return}}catch{}let t=globalThis,n=Number(t.__CWSP_CONTROL_PORT__||29110)||29110,r=String(t.__CWSP_CONTROL_API_KEY__||`cwsp-neutralino-local`).trim(),i=await fetch(`http://127.0.0.1:${n}${c?`/service/pair/regenerate-public-token`:`/service/pair/display`}`,{method:c?`POST`:`GET`,headers:{Accept:`application/json`,"Content-Type":`application/json`,"X-API-Key":r},body:c?`{}`:void 0});if(!i.ok)throw Error(`Control HTTP ${i.status}`);a(await i.json()),e&&s(c?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`})}catch(t){e&&s(String(t?.message||t||`Pairing status unavailable`),{tone:`err`})}})();return}let u=n?.closest?.(`button[data-action="files-storage-pick-saf"]`),d=n?.closest?.(`button[data-action="files-storage-clear-saf"]`),f=n?.closest?.(`button[data-action="files-storage-show-paths"]`),m=n?.closest?.(`button[data-action="files-storage-share-readme"]`),g=n?.closest?.(`button[data-action="files-storage-open-explorer"]`),_=n?.closest?.(`button[data-action="files-storage-perm-status"]`),v=n?.closest?.(`button[data-action="files-storage-request-media"]`),b=n?.closest?.(`button[data-action="files-storage-request-all-files"]`);if(u||d||f||m||g||_||v||b){(async()=>{try{let{invokeCwsNative:e}=await T(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-D9AjNfMU.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),t=await Ae(),n=l.querySelector(`[data-files-saf-uri]`),r=l.querySelector(`[data-files-storage-paths]`),i=l.querySelector(`[data-files-perm-status]`),a=e=>{if(!n)return;let t=String(e||``).trim();n.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`},o=e=>{i&&(i.textContent=`Media/storage runtime: ${e.runtimeGranted===!0?`granted`:`missing`}`+(e.missingRuntime?` (${e.missingRuntime})`:``)+`\nAll-files access: ${e.allFilesAccess===!0?`granted`:`not granted`}`+(e.note?`\n${e.note}`:``))};if(d){t.shell={...t.shell||{},filesIncomingDir:``,filesLandingMode:t.shell?.filesLandingMode||`app`},await De(t),a(``),s(`SAF folder cleared.`,{tone:`ok`});return}let c=u?`files:storage:pick-landing`:m?`files:storage:share-readme`:g?`files:storage:open-explorer`:v?`files:storage:request-media`:b?`files:storage:request-all-files`:_?`files:storage:permissions-status`:`files:storage:status`,f=l.querySelector(`[data-field="shell.filesStagingRoot"]`),p=l.querySelector(`[data-field="shell.filesLandingMode"]`);s(u?`Opening folder picker…`:g?`Opening CWSP Files…`:v?`Requesting media permission…`:b?`Opening all-files settings…`:`Reading storage…`,{tone:`warn`});let h=await e(c,{stagingRoot:f?.value||t.shell?.filesStagingRoot||`app`,landingMode:p?.value||t.shell?.filesLandingMode||`app`,incomingDir:t.shell?.filesIncomingDir||``}),y=h?.echo||h?.envelope?.payload||{},x=y?.error||h?.error||(!h?.ok&&!y?.outgoingDir&&!y?.documentUri&&y?.runtimeGranted===void 0?`storage action failed`:``);if(x){s(String(x),{tone:`err`});return}if(u&&y?.incomingDir){t.shell={...t.shell||{},filesIncomingDir:String(y.incomingDir),filesLandingMode:`saf`},await De(t),p&&(p.value=`saf`),a(String(y.incomingDir)),s(`SAF folder saved. Landing mode set to SAF.`,{tone:`ok`});return}(y.runtimeGranted!==void 0||y.allFilesAccess!==void 0)&&o(y),r&&(y?.outgoingDir||y?.incomingAppDir||y?.readmePath||y?.note)&&(r.textContent=`Outgoing temp: ${y.outgoingDir||`?`}\nIncoming temp: ${y.incomingAppDir||`?`}\nLanding mode: ${y.landingMode||`?`}`+(y?.incomingDir?`\nSAF: ${y.incomingDir}`:``)+(y?.note&&y.runtimeGranted===void 0?`\n${y.note}`:``)),s(m?`Shared README — open it in another app to see the paths.`:g?`Opened document picker — look for CWSP Files (or Files app sidebar).`:b?`Enable “Allow access to manage all files”, then tap Refresh status.`:v?`Media permission dialog finished — see status.`:`Status updated.`,{tone:`ok`})}catch(e){s(String(e?.message||e||`Files storage action failed`),{tone:`err`})}})();return}let ee=n?.closest?.(`button[data-action="apk-update-check"]`),S=n?.closest?.(`button[data-action="apk-update-install"]`);if(ee||S){let e=S?`app:update:install`:`app:update:check`;(async()=>{s(S?`Downloading APK…`:`Checking for update…`,{tone:`warn`});try{let t=await Ae(),{srcEl:n,endpointEl:r,tokenEl:i,insecureEl:a}=re(),o=l.querySelector(`[data-apk-local-version]`),c=(n?.value||t.shell?.apkUpdateSource||`wan`).trim(),u=(r?.value||t.core?.endpointUrl||``).trim(),d=(i?.value||``).trim()||ve(t),f=a?.checked??!!t.core?.allowInsecureTls,{invokeCwsNative:p}=await T(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-D9AjNfMU.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),m=S||ee,h=y(m),g=await p(e,{...h,source:c,endpointUrl:u,token:d,ecosystemToken:d,allowInsecureTls:f}),_=g?.echo||g?.envelope?.payload||{},v=_?.error||g?.error||(!g?.ok&&!g?.echo?`update failed`:``);if(v){s(String(v),{tone:`err`});return}let b=m.closest(`[data-apk-sku-row]`)?.querySelector(`[data-apk-local-version]`)||o;if(b&&(_?.localVersionCode!=null||_?.localVersionName||_?.versionName)&&ne(b,_,g),S){s(_?.launchedInstaller?`Installer launched — confirm on the system prompt.`:`Install request sent.`,{tone:`ok`});return}let C=x(_?.localVersionCode),w=x(_?.remoteVersionCode),E=String(_?.localVersionName||``).trim(),D=String(_?.remoteVersionName||``).trim(),O=_?.updateAvailable===!0||g?.updateAvailable===!0||w!=null&&C!=null&&w>C||te(D,E)>0,ie=_?.signatureCompatible!==!1,ae=_?.installed===!0,oe=String(_?.reason||``);if(!ie){s(`Signature mismatch — remote APK not signed like this install (local ${C??`?`}, remote ${w??`?`}).`,{tone:`err`});return}if(!ae){s(`${h.sku}: not installed — remote ${w??`?`} (${D||`?`}). Download & install to sideload.`,{tone:`warn`});return}if(oe===`gateway-older`||w!=null&&C!=null&&w<C&&!O){s(`${h.sku}: gateway older (local ${E||`?`} ${C}, remote ${D||`?`} ${w}). Publish the newer APK.`,{tone:`warn`});return}if(C==null&&w==null){s(`${h.sku}: native echo missing versions — try Check again.`,{tone:`err`});return}s(O?`${h.sku}: update available ${E||C} → ${D||w} (${C??`?`} → ${w??`?`}).`:`${h.sku}: current (local ${E||`?`} ${C??`?`}, remote ${D||`?`} ${w??`?`}) — Download & install will sideload.`,{tone:O?`warn`:`ok`})}catch(e){s(String(e?.message||e),{tone:`err`})}})();return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{s(`Saving…`,{tone:`warn`});let t=await Ae(),n=t.appearance?.markdown?.extensions||[],r=h(`markdown`)&&ut?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){z(`markdown`),s(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:h(`ai`)?(()=>{let e={...t.ai||{},baseUrl:C?.value?.trim?.()||``,apiKey:w?.value?.trim?.()||``,model:D?.value||`gpt-5.6-luna`,customModel:D?.value===`custom`&&O?.value?.trim?.()||``,defaultReasoningEffort:ae?.value||`medium`,defaultVerbosity:oe?.value||`medium`,maxOutputTokens:F(se?.value,4e5),contextTruncation:ce?.value||`disabled`,promptCacheRetention:le?.value||`in-memory`,maxToolCalls:F(de?.value,8),parallelToolCalls:(fe?.checked??!0)!==!1,requestTimeout:{low:F(pe?.value,6e4),medium:F(me?.value,3e5),high:F(he?.value,9e5)},maxRetries:F(ge?.value,2),responseLanguage:k?.value||`auto`,translateResults:!!ye?.checked,generateSvgGraphics:!!be?.checked,mcp:h(`mcp`)?Xt(R):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``,processIngress:t.ai?.processIngress};return delete e.shareTargetMode,delete e.autoProcessShared,e})():t.ai||{},speech:h(`ai`)?{language:A?.value||`en-US`}:t.speech||{},core:h(`server`)?{...t.core,ntpEnabled:L(pt,!!t.core?.ntpEnabled),mode:I(ht,t.core?.mode||`native`)||`native`,endpointUrl:I(gt,t.core?.endpointUrl||``),userId:I(_t,t.core?.userId||``),ecosystemToken:I(yt,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||I(vt,t.core?.userKey||``)||I(N,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:I(yt,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||I(vt,t.core?.userKey||``)||I(N,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:L(xt,!!t.core?.encrypt),preferBackendSync:L(bt,(t.core?.preferBackendSync??!0)!==!1),appClientId:I(St,t.core?.appClientId||``),allowInsecureTls:L(wt,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:!0,socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=I(yt,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||I(vt,t.core?.userKey||``)||I(N,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:I(At,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:I(jt,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:L(P,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:I(Dt,t.core?.admin?.httpsOrigin||``),httpOrigin:I(Ot,t.core?.admin?.httpOrigin||``),path:I(kt,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:L(Et,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:h(`server`)?{...t.shell||{},maintainHubSocketConnection:L(Nt,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:I(Pt,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:L(Ft,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=It?.value,n=F(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:L(Rt,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:L(zt,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:I(Bt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:L(Vt,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:I(Ut,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:L(Jt,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:L(Qt,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!Be()&&L(en,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!Be()&&L(nn,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:L(rn,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:h(`appearance`)||h(`markdown`)?{theme:Se?.value||`auto`,fontSize:Ce?.value||`medium`,color:pn(l),colorSource:un(l),markdown:{preset:Ie?.value||`default`,fontFamily:Le?.value||`system`,fontSizePx:F(Re?.value,16),lineHeight:Kt(j?.value,1.7,1.1,2.2),contentMaxWidthPx:F(ze?.value,860),printScale:Kt(He?.value,1,.5,1.5),page:{size:Ue?.value||`auto`,orientation:We?.value||`portrait`,marginMm:F(Ge?.value,12)},modules:{typography:(Ke?.checked??!0)!==!1,lists:(qe?.checked??!0)!==!1,tables:(Je?.checked??!0)!==!1,codeBlocks:(Ye?.checked??!0)!==!1,blockquotes:(Xe?.checked??!0)!==!1,media:(Ze?.checked??!0)!==!1,printBreaks:(Qe?.checked??!0)!==!1},plugins:{smartTypography:!!$e?.checked,softBreaksAsBr:!!M?.checked,externalLinksNewTab:(et?.checked??!0)!==!1},customCss:tt?.value||``,printCss:rt?.value||``,extensions:n||[]}}:t.appearance||{}};wi(l,i,p),await Ii(i);let a=i,o=p.surface===`capacitor`||p.surface===`native`?Ve(a).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),c=await De(a);if(!c){s(`Settings save returned no data.`,{tone:`err`});return}let u=!1;try{u=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cwsp-control`||/^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname||``))}catch{u=!1}try{if(u){let e=globalThis.__CWSP_ENSURE_CONTROL_FOR_SAVE__;if(typeof e==`function`){let t=await e();if(!t?.ok){Me(!1,t?.error||`Control not paired`),s(t?.error||`Pair phone Control (token + code + Accept) before Save`,{tone:`warn`});return}}}await Ni(l,c,p),u&&globalThis.__CWSP_CONTROL_BRIDGE_LIVE__&&Me(!0)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e);let t=e instanceof Error?e.message:String(e);if(u&&Me(!1,t),/pairing|unauthorized|401|403|Control/i.test(t)){s(t,{tone:`warn`});return}}Ci(l,c,p);let d=Oe(),f=await o,m=f.lines,g=f.results.some(e=>e.granted===!1);T(()=>import(`./hub-socket-boot-NFZnryEk.js`).then(e=>(e.r(),e.n)).then(async e=>{if(u){try{globalThis.__CWSP_CONTROL_BRIDGE_LIVE__||console.warn(`[Settings] Control not paired — settings saved locally only; pair to push to device`)}catch{}return}if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis;if(e.__CWS_NODE_CLIPBOARD_HUB__===!1)return;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.host||`127.0.0.1`).trim()||`127.0.0.1`;if(n===8434&&r!==`127.0.0.1`&&r!==`localhost`||n!==29110)return;let i=String(t?.key||`cwsp-neutralino-local`),a=c.core,o=String(a?.ecosystemToken||a?.userKey||a?.socket?.accessToken||``).trim(),s={};a?.endpointUrl&&(s.remoteHost=String(a.endpointUrl).trim()),o&&(s.accessToken=o,s.clientToken=o),a?.userId&&(s.clientId=String(a.userId).trim()),s.force=!0,await fetch(`http://${r}:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":i},body:JSON.stringify(s),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await T(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-D9AjNfMU.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(c),T(()=>import(`./hub-socket-boot-NFZnryEk.js`).then(e=>(e.s(),e.u)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),Fe(c),e.onTheme?.(c.appearance?.theme||`auto`);let _=[`Saved locally`];d.nativeSynced===!0?_.push(`synced to Android`):d.nativeSynced===!1&&!g?console.warn(`[Settings] native settings patch:`,d.nativeError||`not confirmed`):d.nativeSynced===!1&&_.push(`native sync failed${d.nativeError?`: ${d.nativeError}`:``}`);let v=(()=>{try{return String(globalThis.__CWSP_CONTROL_VIA__||``)}catch{return``}})(),y=v===`android`?`phone Control (Capacitor)`:v===`neutralino`?`desk Control (Neutralino)`:u?`Control`:`desk Control`;d.webnativeSynced===!0?_.push(`synced to ${y}`):d.webnativeSynced===!1&&_.push(`${y} sync failed${d.webnativeError?`: ${d.webnativeError}`:``}`),m.length&&_.push(...m);let b=`ok`;(g||d.webnativeSynced===!1)&&(b=`warn`),s(_.join(` · `),{tone:b})})().catch(e=>s(String(e),{tone:`err`}))}),e.isExtension){sn&&(sn.hidden=!1),cn&&(cn.hidden=!1);let e=o`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`,t=l.querySelector(`.settings-screen__footer`);t?t?.insertAdjacentElement?.(`beforebegin`,e):l.append(e)}let Cn=hn(e.initialTab);if(z(Cn),!l.querySelector(`.settings-screen__body > [data-tab-panel="${Cn}"]:not([hidden])`)){let e=l.querySelector(`.settings-screen__body > [data-tab-panel]`);e&&z(e.getAttribute(`data-tab-panel`)||Cn)}_e();let Tn=l.querySelectorAll(`.settings-screen__body > [data-tab-panel]`).length,Dn=l.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${m} surface=${p.surface} tabs=${Dn} panels=${Tn} active=${l.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(Tn===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,l.querySelector(`.settings-screen__body`)?.appendChild(e),z(`cwsp`)}return l.addEventListener(`cwsp-settings-resync`,()=>{Mt(l),z(l.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Cn)}),$=l,l}})))()}function Hi(e){return new Wi(e)}var Ui,Wi;function Gi(){return(Gi=e((()=>{d(),i(),Dt(),Nt(),Vi(),Li(),V(),We(),w(),Ui={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Wi=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=u(Ui);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{r(this.element),this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.syncHubSectionFromLocation(),this.refreshLauncherSiblingNav(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1})),n(this.element)},onHide:()=>{r(this.element)}};constructor(e={}){this.options=e,this.shellContext=e.shellContext;try{globalThis.addEventListener(`route-change`,this.onHubSettingsRoute),globalThis.addEventListener(`popstate`,this.onHubSettingsRoute),globalThis.addEventListener(`cwsp-settings-section`,this.onHubSettingsRoute)}catch{}}onHubSettingsRoute=()=>{this.syncHubSectionFromLocation()};render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=this.isExtensionRuntime(),n=this.resolveAreaSection(e?.params?.section);return n&&this.element&&this.element.dataset.hubSettingsSection!==n&&(Ri(),this.element=null),this.element?this.element:(this.element=Bi({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,hubSection:n,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>Mt(this.element)),this.element)}getToolbar(){return null}isExtensionRuntime(){return globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id}resolveAreaSection(e){let t=at();if(t)return st(e||t);if(ui()===`launcher`)return st(e||ht()||`hub`)}async refreshLauncherSiblingNav(){if(ui()!==`launcher`)return;let e=di(),t=await fi();pi(e,t)||this.remountSettings(this.resolveAreaSection()||`hub`)}remountSettings(e){if(!this.element)return;let t=this.element.parentNode;Ri();let n=Bi({isExtension:this.isExtensionRuntime(),hubSection:e,initialTab:this.options.params?.tab||this.options.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}});t?.replaceChild(n,this.element),this.element=n,queueMicrotask(()=>Mt(this.element))}syncHubSectionFromLocation(){if(!this.element)return;let e=this.resolveAreaSection();e&&this.element.dataset.hubSettingsSection!==e&&this.remountSettings(e)}setupEventHandlers(){}loadSettings(){this.settings.value={...Ui}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...Ui},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){Mt(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(a(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===Ot.Patch||e===Ot.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([T(()=>import(`./Settings-D_-YuEG2.js`).then(e=>(e.a(),e.t)),[],import.meta.url),T(()=>import(`./Theme-B9yL0Epz.js`).then(e=>(e.r(),e.t)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}})))()}Gi();export{Wi as SettingsView,Ci as applyContributions,Xe as clearSettingsSyncArms,wi as collectContributions,$e as createMemorySettingsSyncArm,Bi as createSettingsView,Hi as createView,Hi as default,qe as detectSettingsSurface,kn as getSettingsContributions,Ue as getSettingsDefaults,Ze as getSettingsSnapshot,M as getSettingsSync,Mi as hydrateContributionsFromSync,Je as mergeSettingsPatch,xi as mountContributions,et as patchSettingsSync,Ni as persistContributionsViaSync,fi as refreshInstalledSiblingSettingsSections,ai as registerBuiltinSettingsContributions,ir as registerCwspSettingsContribution,or as registerDeviceSettingsContribution,cr as registerReaderSettingsContribution,B as registerSettingsContribution,Ge as registerSettingsSyncArm,wr as registerWorkcenterSettingsContribution,Ri as resetSettingsViewCache,_i as resolveSettingsSurface,Ke as resolveSettingsSyncArm,Qe as setSurfaceDetector,Ye as unregisterSettingsSyncArm};