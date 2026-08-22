import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{j as t,t as n}from"./src-6wudtv1A.js";import{a as r,c as i,d as a,f as o,l as s,u as c}from"./registry-DEgBckbw.js";import{n as l,t as u}from"./preload-helper-DcjHEl26.js";import{n as d,t as f}from"./templates-TzWY6auj.js";import{a as p,d as m}from"./UnifiedMessaging-CDibs2yQ.js";import{a as h,i as g,r as _}from"./BootLoader-q0TEtP7I.js";import{B as v,K as y}from"./airpad-cwsp-client-parity-C1fUeWnY.js";import{t as b}from"./src-bJzyvrxg.js";import{a as x,i as ee,r as te,t as ne}from"./SettingsTypes-BEJR80_L.js";import{a as S}from"./HistoryManager-lhXX01K8.js";import{t as re,v as ie}from"./remote-connection-runtime-Bsibrymc.js";import{a as ae,c as oe,i as se,n as C,o as ce,r as le,s as ue}from"./Settings-C2gfTGzF.js";import{i as de,s as fe,t as pe}from"./object-DpwBpfvO.js";import{c as me,l as he,n as ge,o as _e,r as w,s as ve,u as T}from"./Theme-7Qwu6Img.js";import{n as ye,r as be}from"./capacitor-permissions-D8qxRNOR.js";import{a as xe,c as E,d as Se,f as Ce,i as D,l as we,m as O,n as Te,o as Ee,p as De,r as Oe,s as k,u as ke}from"./web-DRqOj9Mp.js";import{a as Ae,i as je,n as Me,r as Ne}from"./shells-DzoZ7fK3.js";import{i as Pe,n as Fe,r as Ie}from"./admin-doors-DkOVgiUY.js";import{c as Le,i as Re,l as ze,n as Be,o as Ve,r as He,s as Ue}from"./CustomInstructions-XzJJ_sjJ.js";import{n as We}from"./registry-VjOAMGcE.js";import{a as Ge,r as Ke}from"./channel-actions-D5ksGgGK.js";function qe(){return(qe=e((()=>{})))()}var A,Je,Ye,j,Xe;function M(){return(M=e((()=>{qe(),A=`data-settings-view-css`,Je=e=>{let t=String(e||``).trim();t=t.replace(/^(@charset\s+[^;]+;\s*)+/i,``);for(let e=0;e<8;e++){let e=t.replace(/^\/\*[\s\S]*?\*\/\s*/,``);if(e===t)break;t=e.trim()}let n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},Ye=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;grid-template-columns:minmax(0,1fr)!important;inline-size:100%!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;pointer-events:auto!important;container-type:inline-size}
.view-settings .settings-screen__top{display:flex!important;flex-direction:column!important;align-items:stretch!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;pointer-events:auto!important}
.view-settings .settings-tab-actions{display:flex!important;flex-wrap:nowrap!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;overflow-x:auto!important;overflow-y:hidden!important;pointer-events:auto!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch;pointer-events:auto!important}
.view-settings .settings-screen__body>[data-tab-panel]:not(.is-active),.view-settings .settings-screen__body>[data-tab-panel][hidden]{display:none!important}
.view-settings .settings-screen__body>[data-tab-panel].is-active:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important;pointer-events:auto!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select,.view-settings .btn,.view-settings .card{pointer-events:auto!important}
.view-settings .settings-tab-btn{pointer-events:auto!important;cursor:pointer!important;flex:0 0 auto!important}
`,j=e=>{if(!e?.classList?.contains(`view-settings`)||e.querySelector(`style[${A}]`))return;let t=Je(`/* Settings view — self-contained stylesheet.
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
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    inline-size: 100%;
    block-size: 100%;
    max-block-size: 100%;
    min-block-size: 0;
    margin: 0;
    padding: clamp(0.5rem, 2cqi, 1rem);
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
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .view-settings h3 {
    font-size: 0.94rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .view-settings {
    /* ── screen chrome ── */
  }
  .view-settings .settings-screen__top {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding-block-end: 0.875rem;
    background: var(--sv-surface-2, var(--sv-bg));
    border-block-end: 1px solid var(--sv-divider);
    flex-shrink: 0;
    /* WHY: must span the grid track — shrink-to-title collapsed the tab strip to 0px. */
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    overflow: visible;
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
    min-block-size: 0;
    min-inline-size: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-block: 0.75rem;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-outline, light-dark(#c5cdd8, #3d4755)) transparent;
    touch-action: pan-y;
    max-inline-size: stretch;
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
    padding-block: 0.75rem;
    padding-inline: 0.25rem;
    /*border-block-start: 1px solid var(--sv-divider);*/
    /*background: color-mix(in oklab, var(--sv-surface-1, light-dark(#ffffff, #171c24)) 85%, var(--sv-bg, light-dark(#eef1f6, #0f1318)));
    box-shadow: 0 -10px 28px color-mix(in oklab, var(--sv-fg, light-dark(#12151a, #e8edf2)) 4%, transparent);*/
    background: transparent;
    max-inline-size: stretch;
  }
  .view-settings {
    /* ── tabs ── */
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
  }
  .view-settings .settings-tab-btn {
    pointer-events: auto;
    cursor: pointer;
    padding: 0.5rem 0.875rem;
    min-block-size: 2.5rem;
    border: none;
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
    background: var(--sv-accent, var(--sv-primary, #5a7fff));
    color: var(--sv-on-primary);
    color: contrast-color(var(--sv-accent, var(--sv-primary, #5a7fff)));
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
    background: var(--sv-surface-1, light-dark(#f4f6fa, #1c232d));
    max-inline-size: stretch;
    box-shadow: none;
    /*box-shadow: var(--sv-elev), 0 0 0 1px color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 14%, transparent);*/
  }
  @container settings-view (max-inline-size: 480px) {
    .view-settings .card {
      padding: 0.875rem;
      border-radius: 14px;
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
  }
  .view-settings .field > span {
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
  .view-settings .field-hint {
    margin: 0 0 0.75rem;
    font-size: 0.85em;
    line-height: 1.45;
    color: var(--sv-muted, light-dark(#5c6570, #a8b0bc));
    opacity: 0.95;
    max-inline-size: stretch;
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
    background: var(--sv-surface-2, light-dark(#ffffff, #171c24));
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
    background-color: var(--sv-surface-2, light-dark(#ffffff, #171c24));
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
    background: color-mix(in oklab, var(--sv-surface-2, light-dark(#ffffff, #171c24)) 90%, transparent);
    color: var(--sv-fg, var(--color-on-surface));
    color: contrast-color(var(--sv-surface-2, var(--color-surface)));
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
    border: 1px solid color-mix(in oklab, var(--sv-outline, light-dark(#c5cdd8, #3d4755)) 40%, transparent);
    background: transparent;
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
      gap: 0.5rem;
      max-inline-size: stretch;
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
}`);t.trim()||(t=Ye);let n=document.createElement(`style`);n.setAttribute(A,``),n.textContent=t,e.insertBefore(n,e.firstChild)},Xe=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}j(e)};e.isConnected?j(e):requestAnimationFrame(t)}})))()}function Ze(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var Qe,N;function P(){return(P=e((()=>{Qe={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`},N=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}},new N(`rs-workcenter`,`data`),new N(`rs-history`,`entries`),new N(`rs-settings`,`config`)})))()}function $e(){return($e=e((()=>{P()})))()}function et(e){Ne();let t=String(e.view||``).trim().replace(/^\/+/,``).toLowerCase(),n=Ae(t&&t!==`home`?`/${t}`:`/`);if(e.params&&Object.keys(e.params).length>0){let t=new URLSearchParams(e.params).toString();n+=(n.includes(`?`)?`&`:`?`)+t}return n}function tt(e,t={}){let n=et(e);t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function nt(e,t){tt({view:e,params:t})}function rt(){return(rt=e((()=>{_(),c(),je(),[...s],o(`home`,i)})))()}function it(){return(it=e((()=>{})))()}function F(){return(F=e((()=>{Me(),r(),We(),rt(),_(),it()})))()}var at,ot,st,ct,lt,I,ut,L,R,dt;function z(){return(z=e((()=>{at=[`en`,`ru`,`en-GB`,`en-US`],ot=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,st=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},ct=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=st(n);t&&e.add(t)}for(let t of at)e.add(t);return Array.from(e)},lt=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},I=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},ut=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},L=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},R=(e,t)=>e?!!e.checked:t,dt=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})))()}var ft,pt,mt;function ht(){return(ht=e((()=>{b(),ft=e=>{let t={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return S`<div class="field mcp-row" data-mcp-id=${t.id}>
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
          </div>`},pt=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},mt=(e,t)=>{if(!e)return;e.replaceChildren();let n=Array.isArray(t)?t:[];if(!n.length){e.appendChild(S`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}n.forEach(t=>e.appendChild(ft(t)))}})))()}var gt;function _t(){return(_t=e((()=>{b(),gt=()=>S`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})))()}var vt;function yt(){return(yt=e((()=>{b(),vt=()=>S`<header class="settings-screen__top">
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`})))()}var bt,xt,B,St,Ct,wt,Tt,Et,Dt,Ot,kt;function At(){return(At=e((()=>{b(),me(),bt=[{hex:_e,label:`Cyan`},{hex:`#4f8eb5`,label:`Steel`},{hex:`#64748b`,label:`Slate`},{hex:`#3b82f6`,label:`Blue`},{hex:`#6366f1`,label:`Indigo`},{hex:`#14b8a6`,label:`Teal`},{hex:`#22c55e`,label:`Green`},{hex:`#f59e0b`,label:`Amber`},{hex:`#ef4444`,label:`Red`},{hex:`#ec4899`,label:`Pink`},{hex:`#8b5cf6`,label:`Violet`}],xt={wallpaper:`From wallpaper`,"material-you":`From Material You`,"system-wallpaper":`From system wallpaper`,"speed-dial":`From Speed Dial wallpaper`,custom:`Custom hue`},B=(e,t)=>{if(e===`auto`)return`Auto (${xt[t]})`;let n=xt[e];return e===t?`${n} (default)`:n},St=()=>{let e=ve();return S`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
            ${bt.map(e=>S`<button type="button" class="appearance-swatch" data-color="${e.hex}" title="${e.label}" aria-label="${e.label}" style="background:${e.hex}"></button>`)}
          </div>
          <label class="appearance-hue">
            <span>Hue</span>
            <input class="appearance-hue__range" type="range" min="0" max="360" value="200" data-field="appearance.hue" />
          </label>
          <input class="form-input appearance-color-input" type="color" data-field="appearance.color" value="${_e}" />
        </div>
      </div>
    </section>`},Ct={auto:`Uses this app’s default source.`,wallpaper:`Dominant color from the launcher / environment wallpaper.`,"material-you":`Android Material You system accent.`,"system-wallpaper":`Dominant color from the OS desktop wallpaper.`,"speed-dial":`Dominant color from the Speed Dial wallpaper.`,custom:`Manual swatch, hue, or color picker.`},wt=e=>{let t=T(e);if(!t)return 200;let n=parseInt(t.slice(1,3),16)/255,r=parseInt(t.slice(3,5),16)/255,i=parseInt(t.slice(5,7),16)/255,a=Math.max(n,r,i),o=a-Math.min(n,r,i);if(o<1e-4)return 200;let s=0;return s=a===n?(r-i)/o%6:a===r?(i-n)/o+2:(n-r)/o+4,s=Math.round(s*60),s<0?s+360:s},Tt=e=>{let t=(Number(e)%360+360)%360,n=e=>{let n=(e+t/30)%12,r=.57-.1806*Math.max(Math.min(n-3,9-n,1),-1);return Math.round(255*r).toString(16).padStart(2,`0`)};return`#${n(0)}${n(8)}${n(4)}`},Et=e=>{let t=e.querySelector(`[data-field="appearance.colorSource"]`);return he(t?.value)?t.value:`auto`},Dt=(e,t)=>{let n=e.querySelector(`[data-field="appearance.colorSource"]`),r=e.querySelector(`[data-appearance-custom]`),i=e.querySelector(`[data-appearance-source-hint]`),a=he(t)?t:`auto`;n&&(n.value=a),r&&(r.hidden=a!==`custom`),i&&(i.textContent=Ct[a])},Ot=(e,t)=>{let n=e.querySelector(`[data-field="appearance.color"]`),r=e.querySelector(`[data-field="appearance.hue"]`),i=T(t)||`#5a9ec8`;n&&(n.value=i),r&&(r.value=String(wt(i))),e.querySelectorAll(`.appearance-swatch`).forEach(e=>{e.setAttribute(`aria-selected`,T(e.dataset.color)===i?`true`:`false`)})},kt=e=>{let t=e.querySelector(`[data-field="appearance.color"]`);return T(t?.value)}})))()}var jt;function Mt(){return(Mt=e((()=>{b(),jt=()=>S`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`})))()}var Nt;function Pt(){return(Pt=e((()=>{b(),Nt=()=>S`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`})))()}var Ft;function It(){return(It=e((()=>{b(),Ft=()=>S`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})))()}var Lt;function Rt(){return(Rt=e((()=>{b(),Lt=()=>S`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`})))()}var zt;function Bt(){return(Bt=e((()=>{b(),de(),Ue(),d(),zt=(e={})=>{let t=fe({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),n=S`<div class="custom-instructions-editor">
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
    </div>`,r=n.querySelector(`[data-list]`),i=n.querySelector(`[data-action='select-active']`),a=n.querySelector(`[data-add-form]`),o=n.querySelector(`[data-field='label']`),s=n.querySelector(`[data-field='instruction']`),c=()=>{r.replaceChildren();let n=t.instructions??[];if(!n.length){r.append(S`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of n){let n=t.editingId===i.id,a=t.activeId===i.id,o=S`<div class="ci-item ${a?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${a?S`<span class="ci-badge active">Active</span>`:S`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${n?S`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:S`<div class="ci-item-preview">${u(i.instruction,120)}</div>`}
            </div>`;o.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&Le(i.id).then(d).then(()=>e.onUpdate?.()),r===`edit`&&(t.editingId=i.id,c()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&Re(i.id).then(d).then(()=>e.onUpdate?.()),r===`save-edit`){let n=o.querySelector(`[data-edit-field='label']`),r=o.querySelector(`[data-edit-field='instruction']`);ze(i.id,{label:n.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(t.editingId=null,d())).then(()=>e.onUpdate?.())}r===`cancel-edit`&&(t.editingId=null,c())}),r.append(o)}},l=()=>{i.replaceChildren(),i.append(S`<option value="">None (use default)</option>`);for(let e of t.instructions??[]){let n=S`<option value="${e.id}">${e.label}</option>`;e.id===t.activeId&&(n.selected=!0),i.append(n)}},u=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,d=async()=>{let e=await Ve(),n=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;t.instructions=n?.instructions??[],t.activeId=n?.activeId??``,c(),l()};return n.addEventListener(`click`,n=>{let r=n.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(t.isAdding=!0,a.hidden=!1,o.value=``,s.value=``,o.focus()),r===`cancel-add`&&(t.isAdding=!1,a.hidden=!0),r===`save-new`){let n=o.value.trim(),r=s.value.trim();if(!r){s.focus();return}Be(n||`Custom`,r).then(e=>{if(e)return t.isAdding=!1,a.hidden=!0,d()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let n=new Set((t.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=f.filter(e=>!n.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}He(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(d).then(()=>e.onUpdate?.())}}),i.addEventListener(`change`,()=>{let t=i.value||``;Le(t||null).then(d).then(()=>e.onUpdate?.())}),d(),n}})))()}var Vt;function Ht(){return(Ht=e((()=>{b(),Bt(),Vt=e=>S`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${zt({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})))()}var Ut;function Wt(){return(Wt=e((()=>{b(),Ut=()=>S`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
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
    </section>`})))()}var V,H,Gt,Kt,U,qt,W,Jt;function G(){return(G=e((()=>{V=new Map,H=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return V.set(t,n),()=>{V.get(t)===n&&V.delete(t)}},Gt=()=>[...V.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),Kt=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},U=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},qt=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},W=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=Kt(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},Jt=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=qt(e);r!==void 0&&U(n,t,r)})}})))()}var K,Yt,q,Xt,J,Y,X,Z,Zt,Qt;function $t(){return($t=e((()=>{K=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},Yt=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},q=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},Xt=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},J=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},Y=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},X=(e,t,n)=>{let r=document.createElement(`button`);return r.type=`button`,r.className=n?.className||(n?.primary?`view-settings__btn view-settings__btn--primary`:`view-settings__btn`),r.setAttribute(`data-action`,t),r.textContent=e,r},Z=(...e)=>{let t=document.createElement(`div`);t.className=`field settings-action-row`,t.style.display=`flex`,t.style.flexWrap=`wrap`,t.style.gap=`0.5rem`;for(let n of e)t.appendChild(n);return t},Zt=(e,t,n)=>{let r=document.createElement(`div`);r.className=`field settings-secret-field`,r.setAttribute(`data-secret-field`,t);let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`div`);a.style.cssText=`display:flex;gap:.4rem;align-items:center;margin-top:.3rem;`;let o=document.createElement(`input`);o.className=`form-input`,o.type=`password`,o.readOnly=!0,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=n?.placeholder||`••••••`,o.setAttribute(`data-${t}`,`1`),o.setAttribute(`data-secret-input`,t),o.value=``,n?.mono?(o.style.fontFamily=`ui-monospace, SFMono-Regular, Menlo, monospace`,o.style.fontSize=`0.9rem`,o.style.letterSpacing=`0.04em`):(o.style.fontSize=`1.15rem`,o.style.fontWeight=`700`,o.style.letterSpacing=`0.12em`),o.style.flex=`1 1 auto`,o.style.minWidth=`0`;let s=document.createElement(`button`);s.type=`button`,s.className=`view-settings__btn`,s.textContent=`View`,s.title=`Show / hide`,s.setAttribute(`data-action`,`control-secret-toggle`),s.setAttribute(`data-secret-for`,t);let c=document.createElement(`button`);c.type=`button`,c.className=`view-settings__btn`,c.textContent=`Copy`,c.title=`Copy to clipboard`,c.setAttribute(`data-action`,`control-secret-copy`),c.setAttribute(`data-secret-for`,t);let l=document.createElement(`p`);l.className=`field-hint`,l.setAttribute(`data-secret-meta`,t),l.style.margin=`0.2rem 0 0`,l.textContent=``;let u=()=>{let e=o.dataset.revealed===`1`;o.type=e?`text`:`password`,s.textContent=e?`Hide`:`View`};return s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),o.dataset.revealed=o.dataset.revealed===`1`?`0`:`1`,u()}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=String(o.value||``).trim();if(t)try{await navigator.clipboard.writeText(t);let e=c.textContent;c.textContent=`Copied`,window.setTimeout(()=>{c.textContent=e||`Copy`},1200)}catch{o.type=`text`,o.select();try{document.execCommand(`copy`)}catch{}u()}}),a.append(o,s,c),r.append(i,a,l),r},Qt=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(Yt(e)):r.appendChild(e);return r}})))()}var en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn;function hn(){return(hn=e((()=>{G(),te(),$t(),l(),en=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,tn=`L-110`,nn=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),rn=(...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!nn(e))return e}return tn},an=e=>{let t=e.surface===`crx`||!!e.isExtension,n=[K(t?`CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field.`:`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,q(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434;https://45.147.121.152:8434`),K(t?`Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control).`:"Coordinator / gateway. Multi-hub: separate with `;` or `,` (never `:`). Always include :8434 — bare host dials :443 where /ws is not served (404)."),q(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),K(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`)];return t?n.push(q(`Client id (Neutralino / backend)`,`shell.clientId`,`L-110`),K(`Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx).`)):n.push(q(`Client id`,`core.userId`,`L-196 or L-110`),K(`Short fleet id (L-196, L-210, …).`)),n.push(q(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),K(t?`Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login).`:`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),q(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),K(en),J(`Allow insecure TLS`,`core.allowInsecureTls`)),n},on=()=>[`Clipboard`,J(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),J(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),q(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),K(en),q(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),K(en),`Clipboard prompt`,Y(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),Y(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),J(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),J(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),Xt(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),K(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],sn=e=>{let t=[`Files transfer`,K("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),J(`Accept inbound files`,`shell.acceptInboundFilesData`),q(`Default destination ids`,`shell.filesShareDestinationIds`,`L-196;L-210 (empty = picker)`),K(en),J(`Allow share to all (*)`,`shell.filesAllowShareToAll`),K(`SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out.`),Y(`Open for share`,`shell.filesOpenForShareMode`,[[`auto`,`Auto — offer when destinations are set`],[`manual`,`Manual — always ask for destinations`]]),Y(`Inbound accept`,`shell.filesInboundMode`,[[`ask`,`Ask — Accept / Decline prompt`],[`auto`,`Auto — accept into landing folder`]]),J(`Copy received files to clipboard (for Paste / re-share)`,`shell.filesCopyOnReceive`),K(`Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default.`),Y(`Byte transport hint`,`shell.filesByteTransport`,[[`auto`,`Auto — receiver chooses`],[`http`,`HTTP blob GET/PUT`],[`ws`,`WebSocket chunks`]]),K(`Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.`)];if(e.surface===`capacitor`||e.surface===`native`){let e=document.createElement(`p`);e.className=`field-hint`,e.setAttribute(`data-files-saf-uri`,`1`),e.textContent=`SAF folder: (not set)`;let n=document.createElement(`p`);n.className=`field-hint`,n.setAttribute(`data-files-storage-paths`,`1`),n.style.whiteSpace=`pre-wrap`,n.textContent=`Staging / landing paths: tap Show paths.`,t.push(`Files storage (Capacitor)`,Y(`Save received files to`,`shell.filesLandingMode`,[[`app`,`App storage (private — default)`],[`downloads`,`Downloads (user-visible)`],[`saf`,`SAF folder (pick below)`]]),K(`App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README.`),e,Z(X(`Choose SAF folder`,`files-storage-pick-saf`,{primary:!0}),X(`Clear SAF folder`,`files-storage-clear-saf`)),J(`Ask for folder every time if SAF unset`,`shell.filesAskDirEveryTime`),Y(`Temp staging place`,`shell.filesStagingRoot`,[[`app`,`App internal (files/) — default`],[`cache`,`App cache (may be purged)`],[`external`,`App external (Android/data/… — OEM may hide)`]]),K(`Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above.`),n,Z(X(`Show paths`,`files-storage-show-paths`),X(`Browse CWSP Files…`,`files-storage-open-explorer`),X(`Share README…`,`files-storage-share-readme`)),`File access permissions`,(()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-files-perm-status`,`1`),e.style.whiteSpace=`pre-wrap`,e.textContent=`Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.`,e})(),Z(X(`Refresh status`,`files-storage-perm-status`),X(`Request media access`,`files-storage-request-media`,{primary:!0}),X(`Allow manage all files…`,`files-storage-request-all-files`)),K(`All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish.`))}return t},cn=()=>[`Native wire (Capacitor)`,J(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),J(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],ln=()=>[`Control pairing`,Zt(`Public token`,`control-public-token`,{mono:!0,placeholder:`••••••••••••`}),Zt(`Device code (20s, +10s grace)`,`control-device-code`,{placeholder:`••••••`}),Z(X(`Refresh code`,`control-pairing-refresh`),X(`Regenerate public token`,`control-public-token-regenerate`)),K(`Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.`)],un=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-crx-control-status`,`1`),e.textContent=`Control: …`,[`Control pairing`,e,Z(X(`Pair Control…`,`crx-control-pair`,{primary:!0}),X(`Unpair`,`crx-control-unpair`)),K(`Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.`)]},dn=()=>{try{let e=globalThis;if(e.NL_OS!=null||e.NL_PORT!=null||e.Neutralino||e.Capacitor?.isNativePlatform?.())return!1;let t=String(e.Capacitor?.getPlatform?.()||``).toLowerCase();if(t===`android`||t===`ios`)return!1;let n=String(location.hostname||``).toLowerCase();return!n||n===`localhost`||n===`127.0.0.1`||n===`[::1]`?!1:location.protocol===`https:`}catch{return!1}},fn=()=>[`Device`,J(`Start CWSP on boot`,`shell.autoStartOnBoot`),J(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),J(`Allow Control API`,`shell.allowControlApi`),K(`Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password.`),...ln(),J(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),J(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),K(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],pn=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-apk-local-version`,`1`),e.textContent=`Installed version: … (tap Check to refresh)`,[`App update (dev)`,e,Y(`Update source`,`shell.apkUpdateSource`,[[`wan`,`WAN — https://45.147.121.152:8434`],[`lan`,`LAN — https://192.168.0.200:8434`],[`relay`,`Current Relay (core.endpointUrl)`]]),Z(X(`Check for update`,`apk-update-check`),X(`Download & install`,`apk-update-install`,{primary:!0})),K("Uses ecosystem token (X-API-Key) against /releases/android. Install requires the same APK signing certificate as the installed app. Each `npm run build:capacitor` auto-bumps VERSION_CODE and restages the gateway release.")]},mn=()=>H({id:`cwsp`,label:`CWSP`,order:55,excludeSurfaces:[`markdown`,`environment`],render:e=>{let t=[...an(e),...on(),...sn(e)];return e.surface===`capacitor`||e.surface===`native`?t.push(...cn(),...fn(),...pn()):e.surface===`crx`||e.isExtension?t.push(...un()):dn()||t.push(...cn(),...ln()),Qt(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=x(e));let r=t.querySelector(`[data-field="shell.clientId"]`);if(r){let t=rn(r.value,e.shell?.clientId,e.core?.userId);r.value=t,e.shell={...e.shell||{},clientId:t}}let i=t.querySelector(`[data-field="shell.apkUpdateSource"]`);if(i){let t=String(e.shell?.apkUpdateSource||`wan`).trim();i.value=t===`lan`||t===`relay`?t:`wan`}let a=t.querySelector(`[data-files-saf-uri]`);if(a){let t=String(e.shell?.filesIncomingDir||``).trim();a.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`}let o=t.querySelector(`button[data-action="control-pairing-refresh"]`);if(o){queueMicrotask(()=>o.click());let e=Number(t.__cwspPairTimer||0);e&&clearInterval(e),t.__cwspPairTimer=window.setInterval(()=>{t.isConnected&&o.click()},2500)}let s=t.querySelector(`[data-crx-control-status]`);s&&u(()=>import(`./crx-control-session-DduCgqUH.js`).then(e=>e.formatCrxControlSessionStatus()),[],import.meta.url).then(e=>{s.isConnected&&(s.textContent=e)}).catch(()=>{s.textContent=`Control: status unavailable`})},save:e=>{ee(e),nn(e.shell?.clientId)&&(e.shell={...e.shell||{},clientId:rn(e.core?.userId)})}})})))()}var gn;function _n(){return(_n=e((()=>{gn=()=>()=>void 0})))()}var vn;function yn(){return(yn=e((()=>{G(),$t(),vn=()=>H({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>Qt(`reader`,`Reader`,[Xt(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),J(`Wrap long lines`,`views.reader.wrapLongLines`)])})})))()}var bn;function xn(){return(xn=e((()=>{G(),$t(),bn=()=>H({id:`workcenter`,label:`Work Center`,order:65,requiresView:`workcenter`,render:()=>Qt(`workcenter`,`Work Center`,[J(`Auto-run pinned tasks`,`views.workcenter.autoRunPinned`),q(`Default instruction id`,`views.workcenter.defaultInstructionId`,`(none)`)])})})))()}var Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Q,Bn,$,Vn,Hn,Un,Wn;function Gn(){return(Gn=e((()=>{G(),$t(),Sn=`cw::workspace::grid-layout`,Cn=`rs-open-link-target`,wn=`cwsp:workspace-grid`,Tn=[[`squircle`,`Squircle`],[`circle`,`Circle`],[`square`,`Rounded square`],[`wavy`,`Wavy`]],En=[[`open-link`,`Open link`],[`open-view`,`Open view`]],Dn=[[`inline`,`Inline (iframe / env window, same tab)`],[`external-app`,`External app (Android chooser)`],[`native-window`,`Native window (new browser window)`],[`new-tab`,`New tab`]],On=[[`compact`,`Compact (0.78)`],[`fit`,`Fit (1.0 — no zoom)`],[`fill`,`Fill (1.28 — adaptive default)`],[`zoom`,`Zoom (1.5)`],[`max`,`Max (1.75)`]],kn=new Set(Tn.map(([e])=>e)),An=new Set(En.map(([e])=>e)),jn=new Set(Dn.map(([e])=>e)),Mn=new Set(On.map(([e])=>e)),Nn=(e,t)=>{let n=Number(e);return Number.isFinite(n)?Math.max(1,Math.min(16,Math.round(n))):t},Pn=(e,t=`squircle`)=>{let n=String(e||``).trim().toLowerCase();return kn.has(n)?n:t},Fn=(e,t=`open-link`)=>{let n=String(e||``).trim().toLowerCase();return An.has(n)?n:t},In=(e,t=`fill`)=>{let n=String(e||``).trim().toLowerCase();return n===`small`||n===`0.78`?`compact`:n===`1`||n===`contain`?`fit`:n===`adaptive`||n===`1.28`?`fill`:n===`1.5`?`zoom`:n===`large`||n===`1.75`?`max`:Mn.has(n)?n:t},Ln=(e,t=`inline`)=>{let n=String(e||``).trim().toLowerCase();return n===`in-shell`||n===`env`||n===`shell`?`inline`:n===`native`||n===`window`||n===`app-window`?`native-window`:n===`tab`||n===`browser`||n===`browser-tab`?`new-tab`:n===`app`||n===`chooser`||n===`open-with`||n===`open-in-app`||n===`intent`?`external-app`:jn.has(n)?n:t},Rn=e=>{if(!e)return{};try{let t=JSON.parse(e);if(t&&typeof t==`object`)return t}catch{}let t=/columns["']?\s*:\s*(\d+)/.exec(e),n=/rows["']?\s*:\s*(\d+)/.exec(e),r=/shape["']?\s*:\s*["']?([a-z-]+)/i.exec(e),i=/defaultAction["']?\s*:\s*["']?([a-z-]+)/i.exec(e),a=/defaultOpenLinkTarget["']?\s*:\s*["']?([a-z-]+)/i.exec(e),o=/iconScale["']?\s*:\s*["']?([a-z0-9.-]+)/i.exec(e),s={};return t&&(s.columns=Number(t[1])),n&&(s.rows=Number(n[1])),r&&(s.shape=Pn(r[1])),i&&(s.defaultAction=Fn(i[1])),a&&(s.defaultOpenLinkTarget=Ln(a[1])),o&&(s.iconScale=In(o[1])),s},zn=()=>{let e=null;try{window.dispatchEvent(new CustomEvent(wn,{detail:{query:!0,receive:t=>{e=t}}}))}catch{}let t={},n=``;try{t=Rn(localStorage.getItem(Sn)),n=String(localStorage.getItem(Cn)||``)}catch{}return{columns:Nn(e?.columns??t.columns,4),rows:Nn(e?.rows??t.rows,8),shape:Pn(e?.shape??t.shape,`squircle`),defaultAction:Fn(e?.defaultAction??t.defaultAction,`open-link`),defaultOpenLinkTarget:Ln(e?.defaultOpenLinkTarget??t.defaultOpenLinkTarget??n,`inline`),iconScale:In(e?.iconScale??t.iconScale,`fill`)}},Q=(e,t,n)=>{let r=e.querySelector(`[data-field="${t}"]`);!r||n==null||(r.value=String(n))},Bn=`cw::workspace::pages`,$=e=>{let t=[],n=`side-a`;try{let e=JSON.parse(localStorage.getItem(Bn)||`null`);e?.pages?.length&&(t=e.pages,n=String(e.activeId||t[0].id))}catch{t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]}t.length||(t=[{id:`side-a`,label:`Side A`},{id:`side-b`,label:`Side B`},{id:`side-c`,label:`Side C`}]),e.replaceChildren();for(let r of t){let i=document.createElement(`div`);i.style.cssText=`display:flex;gap:.4rem;align-items:center;margin:.25rem 0;`;let a=document.createElement(`button`);a.type=`button`,a.className=`view-settings__btn`,a.textContent=r.label+(r.id===n?` · active`:``),a.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`switch`,id:r.id}})),requestAnimationFrame(()=>$(e))});let o=document.createElement(`button`);if(o.type=`button`,o.className=`view-settings__btn`,o.textContent=`Rename`,o.addEventListener(`click`,()=>{let t=window.prompt(`Workspace name`,r.label);t&&(window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`rename`,id:r.id,label:t}})),requestAnimationFrame(()=>$(e)))}),i.append(a,o),t.length>1){let t=document.createElement(`button`);t.type=`button`,t.className=`view-settings__btn`,t.textContent=`Remove`,t.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`remove`,id:r.id}})),requestAnimationFrame(()=>$(e))}),i.append(t)}e.append(i)}},Vn=e=>{let t=e.querySelector(`[data-workspace-pages]`);t&&$(t),e.dataset.workspacePagesBound!==`1`&&(e.dataset.workspacePagesBound=`1`,e.addEventListener(`click`,e=>{let n=(e.target?.closest?.(`[data-action]`))?.getAttribute(`data-action`)||``;if(n===`add-workspace-page`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`add`}}));else if(n===`workspace-page-prev`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`prev`}}));else if(n===`workspace-page-next`)window.dispatchEvent(new CustomEvent(`cwsp:workspace-cmd`,{detail:{cmd:`next`}}));else return;t&&requestAnimationFrame(()=>$(t))}))},Hn=e=>{try{localStorage.setItem(Sn,JSON.stringify({columns:e.columns,rows:e.rows,shape:e.shape,defaultAction:e.defaultAction,iconScale:e.iconScale||`fill`})),e.defaultOpenLinkTarget&&localStorage.setItem(Cn,e.defaultOpenLinkTarget)}catch{}},Un=e=>{let t=!1;try{window.dispatchEvent(new CustomEvent(wn,{detail:{...e,ack:()=>{t=!0}}}))}catch{}t||Hn(e)},Wn=()=>H({id:`workspace`,label:`Workspace`,order:18,requiresView:`home`,surfaces:[`environment`,`crx`,`web`,`native`,`capacitor`],excludeSurfaces:[`markdown`],render:()=>Qt(`workspace`,`Workspace`,[K(`Theme, workspaces, and the Speed Dial grid share this page.`),`Workspaces`,K(`Pages of the Speed Dial. Explorer roots: /user/workspaces/side-a, side-b, …`),(()=>{let e=document.createElement(`div`);return e.setAttribute(`data-workspace-pages`,`1`),e.className=`field`,e})(),Z(X(`Add workspace`,`add-workspace-page`),X(`Previous page`,`workspace-page-prev`),X(`Next page`,`workspace-page-next`)),`Grid`,K(`Speed dial grid on the Home / NTP workspace.`),Y(`Default icon shape`,`grid.shape`,Tn),Y(`Icon bitmap scale`,`grid.iconScale`,On),Xt(`Columns`,`grid.columns`,{min:`1`,max:`16`,step:`1`,placeholder:`4`}),Xt(`Rows`,`grid.rows`,{min:`1`,max:`16`,step:`1`,placeholder:`8`}),`Default actions`,Y(`New tile action`,`grid.defaultAction`,En),Y(`Open links in`,`grid.defaultOpenLinkTarget`,Dn)]),load:(e,t)=>{let n=zn(),r=e.grid||{};Q(t,`grid.shape`,n.shape||r.shape||`squircle`),Q(t,`grid.iconScale`,n.iconScale||r.iconScale||`fill`),Q(t,`grid.columns`,n.columns??r.columns??4),Q(t,`grid.rows`,n.rows??r.rows??8),Q(t,`grid.defaultAction`,n.defaultAction||r.defaultAction||`open-link`),Q(t,`grid.defaultOpenLinkTarget`,n.defaultOpenLinkTarget||r.defaultOpenLinkTarget||`inline`),Vn(t)},save:e=>{let t={columns:Nn(e.grid?.columns,4),rows:Nn(e.grid?.rows,8),shape:Pn(e.grid?.shape,`squircle`),defaultAction:Fn(e.grid?.defaultAction,`open-link`),defaultOpenLinkTarget:Ln(e.grid?.defaultOpenLinkTarget,`inline`),iconScale:In(e.grid?.iconScale,`fill`)};e.grid={...e.grid||{},...t},Un(t)}})})))()}var Kn,qn;function Jn(){return(Jn=e((()=>{hn(),_n(),yn(),xn(),Gn(),Kn=!1,qn=()=>{Kn||(Kn=!0,mn(),Wn(),vn(),bn(),gn())}})))()}var Yn,Xn,Zn,Qn,$n,er,tr,nr;function rr(){return(rr=e((()=>{c(),Yn=e=>e.isExtension||e.surface===`crx`?`extension`:e.surface===`markdown`?`markdown`:e.surface===`environment`?`environment`:(e.surface===`capacitor`||e.surface===`native`)&&!(a(`workcenter`)||a(`viewer`)||a(`explorer`))?`cwsp-mobile`:`full`,Xn=[`appearance`,`markdown`,`ai`,`mcp`,`server`,`instructions`,`extension`],Zn=[`extension`,`server`],Qn=[`server`,`extension`],$n=[`server`,`extension`,`cwsp`],er=(e,t)=>{let n=t===`cwsp-mobile`?Xn:t===`extension`?Zn:t===`markdown`?Qn:t===`environment`?$n:null;if(n)for(let t of n)e.querySelector(`[data-tab-panel="${t}"]`)?.remove(),e.querySelector(`[data-action="switch-settings-tab"][data-tab="${t}"]`)?.remove()},tr=e=>e===`cwsp-mobile`?`cwsp`:e===`extension`?`crx`:e===`markdown`?`markdown`:e===`environment`?`appearance`:`ai`,nr=(e,t)=>!!e.querySelector(`[data-tab-panel="${t}"]`)})))()}var ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,wr;function Tr(){return(Tr=e((()=>{te(),c(),G(),Jn(),v(),E(),rr(),l(),ir=`[data-settings-tabs]`,ar=`.settings-screen__body`,or=()=>{try{let e=globalThis;if(e?.chrome?.runtime?.id)return`crx`;if(e?.Capacitor?.isNativePlatform?.()||e?.Capacitor?.getPlatform?.()===`android`||e?.Capacitor?.getPlatform?.()===`ios`)return`capacitor`;if(e?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`){let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase();if(e===`cw-markdown`||e===`cw-document`||e===`document`)return`markdown`;if(e===`environment`||e===`cw-environment`||e===`cwsp-shell`||document.querySelector?.(`.env-shell-root[data-shell='environment'], env-shell-container[data-shell='environment']`))return`environment`}if(typeof document<`u`)return`web`}catch{}return`unknown`},sr=(e,t)=>{if(e.requiresView&&!a(e.requiresView))return!1;let n=e.surfaces;return!(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface))},cr=e=>Gt().filter(t=>sr(t,e)),lr=(e,t)=>{let n=e.querySelector(ir),r=e.querySelector(ar);if(!(!n||!r))for(let i of cr(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;if(i.id===`workspace`){let n=e.querySelector(`[data-tab-panel="appearance"]`);if(n){let e=null;try{e=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(e){let t=document.createElement(`div`);t.setAttribute(`data-contribution`,`workspace`),t.hidden=!1,e.matches?.(`[data-tab-panel]`)?(e.removeAttribute(`hidden`),e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.append(...Array.from(e.childNodes))):(e.removeAttribute(`data-tab-panel`),e.classList.remove(`settings-tab-panel`),t.appendChild(e)),n.appendChild(t)}continue}}let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},ur=(e,t,n)=>{for(let r of cr(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`)||e.querySelector(`[data-contribution="${r.id}"]`);t&&n(r,t)}},dr=(e,t,n)=>{ur(e,n,(e,r)=>{try{e.manualFields||W(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},fr=(e,t,n)=>{ur(e,n,(e,r)=>{try{e.manualFields||Jt(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},pr=e=>!!e&&typeof e==`object`&&!Array.isArray(e),mr=(e,t)=>{if(!pr(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(pr(t)&&pr(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return pr(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},hr=()=>{try{let e=globalThis,t=typeof e.chrome?.runtime?.id==`string`&&typeof e.__NEUTRALINO_AUTH__?.port==`number`;return!!(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||typeof e.__WEBNATIVE_AUTH__?.port==`number`||typeof e.__NEUTRALINO_AUTH__?.port==`number`||t)}catch{return!1}},gr=e=>{if(!e||typeof e!=`object`)return!1;let t=e.core,n=e.shell,r=e.bridge,i=e.cwsp,a=e.control;return!!(typeof t?.endpointUrl==`string`&&t.endpointUrl.trim()||typeof t?.userId==`string`&&t.userId.trim()||typeof t?.ecosystemToken==`string`&&t.ecosystemToken.trim()||typeof t?.userKey==`string`&&t.userKey.trim()||typeof n?.clipboardInboundMode==`string`&&n.clipboardInboundMode||typeof n?.clipboardOutboundMode==`string`&&n.clipboardOutboundMode||typeof n?.remoteHost==`string`&&n.remoteHost.trim()||typeof n?.clientId==`string`&&n.clientId.trim()||typeof n?.allowControlApi==`boolean`||typeof n?.bridgeDaemonEnabled==`boolean`||typeof n?.autoStartOnBoot==`boolean`||typeof r?.endpointUrl==`string`&&r.endpointUrl.trim()||typeof r?.userId==`string`&&String(r.userId).trim()||typeof i?.clientId==`string`&&String(i.clientId).trim()||typeof i?.endpointUrl==`string`&&String(i.endpointUrl).trim()||a?.surface===`capacitor-android`)},_r=()=>{try{let e=globalThis.chrome?.runtime?.id;return typeof e==`string`&&e.length>0}catch{return!1}},vr=e=>{if(!_r())return e;let t=`L-110-crx`,n=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),r=((...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!n(e))return e}return`L-110`})(e.shell?.clientId,e.core?.userId);return{...e,core:{...e.core||{},userId:t,socket:{...e.core?.socket||{},selfId:t}},shell:{...e.shell||{},clientId:r}}},yr=async e=>{let t=await e();if((t.core?.preferBackendSync??!0)===!1)return vr(t);let n=await k(),r=(()=>{try{if(!_r())return!1;let e=globalThis;return String(globalThis.document?.documentElement?.dataset?.cwspBridge||``)===`live`||typeof e.__NEUTRALINO_AUTH__?.port==`number`}catch{return!1}})();if((hr()||r)&&!gr(n))for(let e=0;e<8&&(await new Promise(e=>setTimeout(e,300)),n=await k(),!gr(n));e++);return vr(mr(t,n))},br=async(e,t,n={})=>{let r=await k(),i=mr(n,r);return dr(e,i,t),i},xr=async(e,t,n)=>(fr(e,t,n),ke(t)),Sr=e=>cr(e).map(e=>e.id),Cr=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},wr=async e=>{ee(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await u(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-C1fUeWnY.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=e=>{let t=e.toLowerCase();return t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`||t===`md.u2re.space`||t===`www.md.u2re.space`},a=e=>{let t=String(e||``).trim();if(!t)return``;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e).hostname.toLowerCase();if(i(n))return``}catch{if(/cwsp\.u2re\.space|md\.u2re\.space/i.test(t))return``}return t},o=e=>{let t=String(e||``).trim();return t?/[,;\s]/.test(t)&&/:\/\//.test(t)?t.split(/[,;\s]+/).map(e=>a(e.trim())).filter(Boolean).join(`;`):a(t):``};if(typeof t.endpointUrl==`string`){let e=o(t.endpointUrl);e!==t.endpointUrl.trim()&&(t.endpointUrl=e)}let s=typeof t.endpointUrl==`string`?t.endpointUrl:``,c=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!s.trim()&&!c.trim())return;let l=Cr()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},d=await y({relayHttpsUrl:s,directHttpsUrl:c},l);d.relayHttpsUrl!==void 0&&(t.endpointUrl=d.relayHttpsUrl),d.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:d.directHttpsUrl})}})))()}var Er;function Dr(){return(Dr=e((()=>{b(),ae(),te(),Fe(),p(),w(),$e(),F(),ie(),z(),ht(),_t(),yt(),At(),Mt(),Pt(),It(),Rt(),Ht(),Wt(),Tr(),g(),ye(),M(),l(),Er=e=>{let t=null,n=null,r=()=>{let e=or();return e===`capacitor`||e===`native`?8e3:2500},i=(e,i)=>{t&&(n&&=(clearTimeout(n),null),t.textContent=e,t.classList.remove(`note--ok`,`note--warn`,`note--err`),i?.tone===`ok`&&t.classList.add(`note--ok`),i?.tone===`warn`&&t.classList.add(`note--warn`),i?.tone===`err`&&t.classList.add(`note--err`),e&&!i?.persist&&(n=setTimeout(()=>{t&&(t.textContent=``,t.classList.remove(`note--ok`,`note--warn`,`note--err`))},r())))},a=S`<div class="view-settings" data-view="settings" style="padding: 1rem;">
    ${vt()}
    <div class="settings-screen__body">
      ${St()}
      ${jt()}
      ${Nt()}
      ${Ft()}
      ${Lt()}
      ${Vt(i)}
      ${Ut()}
    </div>
    ${gt()}
  </div>`;Xe(a),qn();let o={isExtension:e.isExtension,surface:or()},s=Yn(o);lr(a,o),er(a,s),s===`full`&&(o.surface===`capacitor`||o.surface===`native`)&&(a.querySelector(`[data-tab-panel="server"]`)?.remove(),a.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let c=e=>nr(a,e),l=e=>a.querySelector(e);t=a.querySelector(`[data-note]`);let d=l(`[data-field="ai.baseUrl"]`),f=l(`[data-field="ai.apiKey"]`),p=l(`[data-field="ui.showKey"]`),g=l(`[data-field="ai.model"]`),_=l(`[data-field="ai.customModel"]`),v=a.querySelector(`[data-field-group="ai.customModel"]`),y=l(`[data-field="ai.defaultReasoningEffort"]`),b=l(`[data-field="ai.defaultVerbosity"]`),ee=l(`[data-field="ai.maxOutputTokens"]`),te=l(`[data-field="ai.contextTruncation"]`),ie=l(`[data-field="ai.promptCacheRetention"]`),ae=l(`[data-field="ai.maxToolCalls"]`),de=l(`[data-field="ai.parallelToolCalls"]`),fe=l(`[data-field="ai.requestTimeout.low"]`),pe=l(`[data-field="ai.requestTimeout.medium"]`),me=l(`[data-field="ai.requestTimeout.high"]`),he=l(`[data-field="ai.maxRetries"]`),_e=l(`[data-field="ai.shareTargetMode"]`),w=()=>{let e=(g?.value||``).trim()===`custom`;v&&(v.hidden=!e),_&&(_.disabled=!e)};if(g){g.replaceChildren();for(let e of ne){let t=document.createElement(`option`);t.value=e,t.textContent=e,g.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,g.append(e),g.addEventListener(`change`,w)}_?.addEventListener(`focus`,()=>{g&&(g.value=`custom`,w())});let ve=l(`[data-field="ai.autoProcessShared"]`),T=l(`[data-field="ai.responseLanguage"]`),ye=l(`[data-field="ai.translateResults"]`),xe=l(`[data-field="ai.generateSvgGraphics"]`),E=l(`[data-field="speech.language"]`),Se=l(`[data-field="appearance.theme"]`),Ce=l(`[data-field="appearance.fontSize"]`),D=a.querySelector(`[data-appearance-color]`),we=l(`[data-field="appearance.colorSource"]`),O=l(`[data-field="appearance.hue"]`),Te=l(`[data-field="appearance.color"]`),Ee=l(`[data-field="appearance.markdown.preset"]`),De=l(`[data-field="appearance.markdown.fontFamily"]`),Oe=l(`[data-field="appearance.markdown.fontSizePx"]`),k=l(`[data-field="appearance.markdown.lineHeight"]`),ke=l(`[data-field="appearance.markdown.contentMaxWidthPx"]`),Ae=l(`[data-field="appearance.markdown.printScale"]`),je=l(`[data-field="appearance.markdown.page.size"]`),Me=l(`[data-field="appearance.markdown.page.orientation"]`),Ne=l(`[data-field="appearance.markdown.page.marginMm"]`),Fe=l(`[data-field="appearance.markdown.modules.typography"]`),Le=l(`[data-field="appearance.markdown.modules.lists"]`),Re=l(`[data-field="appearance.markdown.modules.tables"]`),ze=l(`[data-field="appearance.markdown.modules.codeBlocks"]`),Be=l(`[data-field="appearance.markdown.modules.blockquotes"]`),Ve=l(`[data-field="appearance.markdown.modules.media"]`),He=l(`[data-field="appearance.markdown.modules.printBreaks"]`),Ue=l(`[data-field="appearance.markdown.plugins.smartTypography"]`),We=l(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),Ge=l(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),Ke=a.querySelector(`[data-field="appearance.markdown.customCss"]`),qe=a.querySelector(`[data-field="appearance.markdown.printCss"]`),A=a.querySelector(`[data-field="appearance.markdown.extensions"]`),Je=l(`[data-field="core.ntpEnabled"]`),Ye=l(`[data-field="core.mode"]`),j=l(`[data-field="core.endpointUrl"]`),M=l(`[data-field="core.userId"]`),N=l(`[data-field="core.userKey"]`),P=l(`[data-field="core.ecosystemToken"]`),$e=l(`[data-field="core.preferBackendSync"]`),et=l(`[data-field="core.encrypt"]`),tt=l(`[data-field="core.appClientId"]`),rt=l(`[data-field="core.allowInsecureTls"]`),it=l(`[data-field="core.ops.allowUnencrypted"]`),F=l(`[data-field="core.admin.httpsOrigin"]`),at=l(`[data-field="core.admin.httpOrigin"]`),st=l(`[data-field="core.admin.path"]`),z=l(`[data-field="core.socket.accessToken"]`),ht=l(`[data-field="core.socket.routeTarget"]`),_t=l(`[data-field="core.socket.clientAccessToken"]`),yt=l(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),bt=l(`[data-field="shell.maintainHubSocketConnection"]`),xt=l(`[data-field="shell.clipboardBroadcastTargets"]`),B=l(`[data-field="shell.pushLocalClipboardToLan"]`),Ct=l(`[data-field="shell.clipboardPushIntervalMs"]`),wt=l(`[data-field="shell.enableRemoteClipboardBridge"]`),At=l(`[data-field="shell.acceptInboundClipboardData"]`),Mt=l(`[data-field="shell.clipboardInboundAllowIds"]`),Pt=l(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),It=l(`[data-field="shell.clipboardShareDestinationIds"]`),Rt=l(`[data-field="shell.applyRemoteClipboardToDevice"]`),zt=l(`[data-field="shell.acceptContactsBridgeData"]`),Bt=l(`[data-field="shell.acceptSmsBridgeData"]`),Ht=l(`[data-field="shell.enableNativeSms"]`),Wt=l(`[data-field="shell.enableNativeContacts"]`),V=a.querySelector(`[data-admin-preview]`),H=a.querySelector(`[data-mcp-section]`),Gt=a.querySelector(`[data-section="extension"]`),Kt=a.querySelector(`[data-extension-tab]`);if(T){T.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,T.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,T.append(t);for(let e of lt()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,T.append(t)}}if(E){E.replaceChildren();for(let e of ct()){let t=document.createElement(`option`);t.value=e,t.textContent=ot(e),E.append(t)}}a.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Jt()}),a.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Jt()});let U=e=>{let t=tr(s),n=e||t,r=()=>a.querySelectorAll(`.settings-screen__body > [data-tab-panel]`);[...r()].some(e=>e.getAttribute(`data-tab-panel`)===n)||(n=r()[0]?.getAttribute(`data-tab-panel`)||t),a.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let i=a.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let o=r();for(let e of Array.from(o)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}};a.addEventListener(`click`,e=>{let t=dt(e)?.closest?.(`[data-action="switch-settings-tab"][data-tab]`);!t||!a.contains(t)||(e.preventDefault(),e.stopPropagation(),U(t.getAttribute(`data-tab`)||tr(s)))},!0);let qt=e=>{let t=tr(s),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?c(`markdown`)?`markdown`:t:new Set([...c(`appearance`)?[`appearance`]:[],...c(`markdown`)?[`markdown`]:[],...c(`ai`)?[`ai`]:[],...c(`mcp`)?[`mcp`]:[],...c(`server`)?[`server`]:[],...c(`instructions`)?[`instructions`]:[],...c(`extension`)?[`extension`]:[],...Sr(o)]).has(n)?n:t:t},W=()=>{let e=P?.value?.trim()||N?.value?.trim()||z?.value?.trim()||``;return{mode:Ye?.value||`native`,endpointUrl:j?.value?.trim()||``,userId:M?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!et?.checked,preferBackendSync:($e?.checked??!0)!==!1,appClientId:tt?.value?.trim()||``,allowInsecureTls:!!rt?.checked,useCoreIdentityForAirPad:!0,socket:{accessToken:e,routeTarget:ht?.value?.trim()||``,selfId:``,clientAccessToken:_t?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!yt?.checked},admin:{httpsOrigin:F?.value?.trim()||``,httpOrigin:at?.value?.trim()||``,path:st?.value?.trim()||`/`},ops:{allowUnencrypted:!!it?.checked}}},Jt=()=>{if(!V)return;let e=Pe(W());V.textContent=`Resolved: ${e.https} · ${e.http}`},G=e=>{try{Ze(Qe.EXPLORER_PATH,e),nt(`explorer`),m({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),i(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),i(`Failed to open Explorer path.`)}};Promise.resolve((async()=>((o.surface===`capacitor`||o.surface===`native`)&&await C().catch(()=>null),(o.surface===`crx`||o.isExtension)&&await le().catch(()=>null),yr(()=>ce())))()).then(t=>{d&&(d.value=(t?.ai?.baseUrl||``).trim()),f&&(f.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.6-luna`).trim(),r=(t?.ai?.customModel||``).trim();if(g){let e=ne.includes(n);n===`custom`||!e&&n?(g.value=`custom`,_&&(_.value=r||n)):(g.value=e?n:`gpt-5.6-luna`,_&&(_.value=r)),w()}if(y&&(y.value=t?.ai?.defaultReasoningEffort||`medium`),b&&(b.value=t?.ai?.defaultVerbosity||`medium`),ee&&(ee.value=String(t?.ai?.maxOutputTokens??4e5)),te&&(te.value=t?.ai?.contextTruncation||`disabled`),ie&&(ie.value=t?.ai?.promptCacheRetention||`in-memory`),ae&&(ae.value=String(t?.ai?.maxToolCalls??8)),de&&(de.checked=(t?.ai?.parallelToolCalls??!0)!==!1),fe&&(fe.value=String(t?.ai?.requestTimeout?.low??6e4)),pe&&(pe.value=String(t?.ai?.requestTimeout?.medium??3e5)),me&&(me.value=String(t?.ai?.requestTimeout?.high??9e5)),he&&(he.value=String(t?.ai?.maxRetries??2)),_e&&(_e.value=t?.ai?.shareTargetMode||`recognize`),ve&&(ve.checked=(t?.ai?.autoProcessShared??!0)!==!1),T&&(T.value=t?.ai?.responseLanguage||`auto`),ye&&(ye.checked=!!t?.ai?.translateResults),xe&&(xe.checked=!!t?.ai?.generateSvgGraphics),E&&(E.value=t?.speech?.language||`en-US`),Se&&(Se.value=t?.appearance?.theme||`auto`),Ce&&(Ce.value=t?.appearance?.fontSize||`medium`),D&&(D.hidden=!1,Dt(a,String(t?.appearance?.colorSource||`auto`)),Ot(a,String(t?.appearance?.color||``))),Ee&&(Ee.value=t?.appearance?.markdown?.preset||`default`),De&&(De.value=t?.appearance?.markdown?.fontFamily||`system`),Oe&&(Oe.value=String(t?.appearance?.markdown?.fontSizePx??16)),k&&(k.value=String(t?.appearance?.markdown?.lineHeight??1.7)),ke&&(ke.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),Ae&&(Ae.value=String(t?.appearance?.markdown?.printScale??1)),je&&(je.value=t?.appearance?.markdown?.page?.size||`auto`),Me&&(Me.value=t?.appearance?.markdown?.page?.orientation||`portrait`),Ne&&(Ne.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Fe&&(Fe.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),Le&&(Le.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Re&&(Re.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),ze&&(ze.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),Be&&(Be.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),Ve&&(Ve.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),He&&(He.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),Ue&&(Ue.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),We&&(We.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),Ge&&(Ge.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),Ke&&(Ke.value=(t?.appearance?.markdown?.customCss||``).trim()),qe&&(qe.value=(t?.appearance?.markdown?.printCss||``).trim()),A){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];A.value=e.length>0?JSON.stringify(e,null,2):``}Je&&(Je.checked=!!t?.core?.ntpEnabled),Ye&&(Ye.value=t?.core?.mode||`native`),j&&(j.value=(t?.core?.endpointUrl||``).trim()),M&&(M.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();P&&(P.value=e),N&&(N.value=e),z&&(z.value=e)}if($e&&($e.checked=(t?.core?.preferBackendSync??!0)!==!1),et&&(et.checked=!!t?.core?.encrypt),tt&&(tt.value=(t?.core?.appClientId||``).trim()),ht&&(ht.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),_t&&(_t.value=(t?.core?.socket?.clientAccessToken||``).trim()),yt&&(yt.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),rt&&(rt.checked=!!t?.core?.allowInsecureTls),it&&(it.checked=!!t?.core?.ops?.allowUnencrypted),F&&(F.value=(t?.core?.admin?.httpsOrigin||``).trim()),at&&(at.value=(t?.core?.admin?.httpOrigin||``).trim()),st&&(st.value=(t?.core?.admin?.path||`/`).trim()||`/`),bt&&(bt.checked=!!t?.shell?.maintainHubSocketConnection),xt&&(xt.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),B&&(B.checked=!!t?.shell?.pushLocalClipboardToLan),Ct){let e=Number(t?.shell?.clipboardPushIntervalMs);Ct.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}wt&&(wt.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),At&&(At.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),Mt&&(Mt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),Pt&&(Pt.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),It&&(It.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),Rt&&(Rt.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),zt&&(zt.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),Bt&&(Bt.checked=!be()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),Ht&&(Ht.checked=!be()&&(t?.shell?.enableNativeSms??!1)===!0),Wt&&(Wt.checked=(t?.shell?.enableNativeContacts??!0)!==!1),Jt(),mt(H,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),re(t),ge(t),dr(a,t,o),e.onTheme?.(t?.appearance?.theme||`auto`),be()&&u(()=>import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n)).then(e=>e.invokeCwsNative(`app:info`,{})),[],import.meta.url).then(e=>{let t=e?.echo||{},n=a.querySelector(`[data-apk-local-version]`);if(!n)return;let r=String(t?.signatureSha256||``).slice(0,12),i=e;n.textContent=`Installed: ${t?.versionName||i?.versionName||`?`} (${t?.versionCode??i?.versionCode??`?`})`+(r?` · sig ${r}…`:``)}).catch(()=>{})}).catch(()=>{mt(H,[])}),p?.addEventListener(`change`,()=>{!f||!p||(f.type=p.checked?`text`:`password`)});let K=e=>{(async()=>{try{let t=await ce();ge({...t,appearance:{...t.appearance||{},...e}})}catch{ge({appearance:{theme:`auto`,fontSize:`medium`,...e}})}})()};if(D?.addEventListener(`click`,e=>{let t=e.target?.closest?.(`.appearance-swatch`);if(!t)return;let n=t.dataset.color??``;Dt(a,`custom`),Ot(a,n),K({color:n,colorSource:`custom`})}),we?.addEventListener(`change`,()=>{let e=Et(a);Dt(a,e),K({colorSource:e,color:e===`custom`?kt(a):void 0})}),O?.addEventListener(`input`,()=>{let e=Tt(Number(O.value));Dt(a,`custom`),Ot(a,e),K({color:e,colorSource:`custom`})}),Te?.addEventListener(`input`,()=>{let e=Te.value||``;Dt(a,`custom`),Ot(a,e),K({color:e,colorSource:`custom`})}),Se?.addEventListener(`change`,()=>{let t=Se.value||`auto`;(async()=>{try{let e=await ce();ge({...e,appearance:{...e.appearance||{},theme:t}})}catch{ge({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),a.addEventListener(`click`,t=>{let n=dt(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&H){H.querySelector(`.mcp-empty-note`)?.remove(),H.appendChild(ft({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),H&&!H.querySelector(`[data-mcp-id]`)&&mt(H,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){G(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){G(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){Ie(W(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){Ie(W(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=Pe(W());navigator.clipboard?.writeText?.(e.https).then(()=>i(`HTTPS admin URL copied.`),()=>i(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=Pe(W());navigator.clipboard?.writeText?.(e.http).then(()=>i(`HTTP admin URL copied.`),()=>i(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){u(()=>import(`./clipboard-device-DaJ_Uxk7.js`).then(e=>(e.n(),e.t)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>i(`App settings opened (native shell only).`)).catch(()=>i(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){u(()=>import(`./clipboard-device-DaJ_Uxk7.js`).then(e=>(e.n(),e.t)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>i(`Notification settings opened (native shell only).`)).catch(()=>i(`Native settings unavailable in this context.`));return}let s=n?.closest?.(`button[data-action="crx-control-pair"]`),l=n?.closest?.(`button[data-action="crx-control-unpair"]`);if(s||l){(async()=>{let e=a.querySelector(`[data-crx-control-status]`),t=()=>{try{globalThis.chrome?.runtime?.sendMessage?.({type:`cwsp-control-session-changed`})}catch{}};try{let n=await u(()=>import(`./crx-control-session-DduCgqUH.js`),[],import.meta.url);if(l){await n.clearCrxControlSession(),e&&(e.textContent=await n.formatCrxControlSessionStatus()),i(`Control unpaired — Copy & Share / Paste by CWSP disabled.`,{tone:`warn`}),t();return}let r=String(a.querySelector(`[data-field="shell.localHubUrl"]`)?.value||``).trim(),o=String(document.documentElement.dataset.cwspControlOrigin||``).trim();e&&(e.textContent=`Control: waiting for pairing dialog…`),i(`Enter public token + device code in the pairing dialog…`);let s=await n.pairCrxControlWithModal({localHubUrl:r,preferredOrigins:o?[o]:[]});if(s.cancelled){e&&(e.textContent=await n.formatCrxControlSessionStatus()),i(`Pairing cancelled.`);return}e&&(e.textContent=s.ok?await n.formatCrxControlSessionStatus():`Control: ${s.error}`),s.ok?(i(`Paired Control at ${s.session.controlHost} (persistent).`),t()):i(s.error,{tone:`warn`})}catch(e){i(`Control pairing unavailable: ${e instanceof Error?e.message:String(e)}`,{tone:`warn`})}})();return}let p=n?.closest?.(`button[data-action="control-pairing-refresh"]`),m=n?.closest?.(`button[data-action="control-public-token-regenerate"]`);if(p||m){let e=!!t?.isTrusted;(async()=>{try{let t=String(location.hostname||``);if(location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`){e&&i(`Pairing codes are shown on the device (phone/desk), not in the public Control SPA.`,{tone:`warn`});return}}catch{}let t=a.querySelector(`input[data-control-device-code], [data-control-device-code]`),n=a.querySelector(`input[data-control-public-token], [data-control-public-token]`),r=a.querySelector(`[data-secret-meta="control-device-code"]`),o=a.querySelector(`[data-secret-meta="control-public-token"]`),s=e=>{let i=String(e.deviceCode||``).trim(),a=Math.max(1,Math.round(Number(e.expiresInMs||0)/1e3)),s=String(e.publicToken||``).trim();t instanceof HTMLInputElement?t.value=i:t&&(t.textContent=i?`Code: ${i} (${a}s)`:`Code: …`),n instanceof HTMLInputElement?n.value=s:n&&(n.textContent=s?`Public token: ${s}`:`Public token: …`),r&&(r.textContent=i?`Expires in ${a}s`:``),o&&(o.textContent=s?`Stable until regenerated`:``)};try{e&&i(m?`Regenerating public token…`:`Refreshing pairing code…`,{tone:`warn`});try{let{invokeCwsNative:t}=await u(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),n=await t(m?`control:public-token:regenerate`:`control:pairing:status`,{}),r=n?.controlPairing||n?.echo||{};if(r?.deviceCode||r?.publicToken){s(r),e&&i(m?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`});return}}catch{}let t=globalThis,n=Number(t.__CWSP_CONTROL_PORT__||29110)||29110,r=String(t.__CWSP_CONTROL_API_KEY__||`cwsp-neutralino-local`).trim(),a=await fetch(`http://127.0.0.1:${n}${m?`/service/pair/regenerate-public-token`:`/service/pair/display`}`,{method:m?`POST`:`GET`,headers:{Accept:`application/json`,"Content-Type":`application/json`,"X-API-Key":r},body:m?`{}`:void 0});if(!a.ok)throw Error(`Control HTTP ${a.status}`);s(await a.json()),e&&i(m?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`})}catch(t){e&&i(String(t?.message||t||`Pairing status unavailable`),{tone:`err`})}})();return}let v=n?.closest?.(`button[data-action="files-storage-pick-saf"]`),ne=n?.closest?.(`button[data-action="files-storage-clear-saf"]`),S=n?.closest?.(`button[data-action="files-storage-show-paths"]`),re=n?.closest?.(`button[data-action="files-storage-share-readme"]`),C=n?.closest?.(`button[data-action="files-storage-open-explorer"]`),le=n?.closest?.(`button[data-action="files-storage-perm-status"]`),w=n?.closest?.(`button[data-action="files-storage-request-media"]`),D=n?.closest?.(`button[data-action="files-storage-request-all-files"]`);if(v||ne||S||re||C||le||w||D){(async()=>{try{let{invokeCwsNative:e}=await u(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),t=await ce(),n=a.querySelector(`[data-files-saf-uri]`),r=a.querySelector(`[data-files-storage-paths]`),o=a.querySelector(`[data-files-perm-status]`),s=e=>{if(!n)return;let t=String(e||``).trim();n.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`},c=e=>{o&&(o.textContent=`Media/storage runtime: ${e.runtimeGranted===!0?`granted`:`missing`}`+(e.missingRuntime?` (${e.missingRuntime})`:``)+`\nAll-files access: ${e.allFilesAccess===!0?`granted`:`not granted`}`+(e.note?`\n${e.note}`:``))};if(ne){t.shell={...t.shell||{},filesIncomingDir:``,filesLandingMode:t.shell?.filesLandingMode||`app`},await oe(t),s(``),i(`SAF folder cleared.`,{tone:`ok`});return}let l=v?`files:storage:pick-landing`:re?`files:storage:share-readme`:C?`files:storage:open-explorer`:w?`files:storage:request-media`:D?`files:storage:request-all-files`:le?`files:storage:permissions-status`:`files:storage:status`,d=a.querySelector(`[data-field="shell.filesStagingRoot"]`),f=a.querySelector(`[data-field="shell.filesLandingMode"]`);i(v?`Opening folder picker…`:C?`Opening CWSP Files…`:w?`Requesting media permission…`:D?`Opening all-files settings…`:`Reading storage…`,{tone:`warn`});let p=await e(l,{stagingRoot:d?.value||t.shell?.filesStagingRoot||`app`,landingMode:f?.value||t.shell?.filesLandingMode||`app`,incomingDir:t.shell?.filesIncomingDir||``}),m=p?.echo||p?.envelope?.payload||{},h=m?.error||p?.error||(!p?.ok&&!m?.outgoingDir&&!m?.documentUri&&m?.runtimeGranted===void 0?`storage action failed`:``);if(h){i(String(h),{tone:`err`});return}if(v&&m?.incomingDir){t.shell={...t.shell||{},filesIncomingDir:String(m.incomingDir),filesLandingMode:`saf`},await oe(t),f&&(f.value=`saf`),s(String(m.incomingDir)),i(`SAF folder saved. Landing mode set to SAF.`,{tone:`ok`});return}(m.runtimeGranted!==void 0||m.allFilesAccess!==void 0)&&c(m),r&&(m?.outgoingDir||m?.incomingAppDir||m?.readmePath||m?.note)&&(r.textContent=`Outgoing temp: ${m.outgoingDir||`?`}\nIncoming temp: ${m.incomingAppDir||`?`}\nLanding mode: ${m.landingMode||`?`}`+(m?.incomingDir?`\nSAF: ${m.incomingDir}`:``)+(m?.note&&m.runtimeGranted===void 0?`\n${m.note}`:``)),i(re?`Shared README — open it in another app to see the paths.`:C?`Opened document picker — look for CWSP Files (or Files app sidebar).`:D?`Enable “Allow access to manage all files”, then tap Refresh status.`:w?`Media permission dialog finished — see status.`:`Status updated.`,{tone:`ok`})}catch(e){i(String(e?.message||e||`Files storage action failed`),{tone:`err`})}})();return}let we=n?.closest?.(`button[data-action="apk-update-check"]`),O=n?.closest?.(`button[data-action="apk-update-install"]`);if(we||O){let e=O?`app:update:install`:`app:update:check`;(async()=>{i(O?`Downloading APK…`:`Checking for update…`,{tone:`warn`});try{let t=await ce(),n=a.querySelector(`[data-field="shell.apkUpdateSource"]`),r=a.querySelector(`[data-field="core.endpointUrl"]`),o=a.querySelector(`[data-field="core.ecosystemToken"]`),s=a.querySelector(`[data-field="core.allowInsecureTls"]`),c=a.querySelector(`[data-apk-local-version]`),l=(n?.value||t.shell?.apkUpdateSource||`wan`).trim(),d=(r?.value||t.core?.endpointUrl||``).trim(),f=(o?.value||``).trim()||x(t),p=s?.checked??!!t.core?.allowInsecureTls,{invokeCwsNative:m}=await u(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),h=await m(e,{source:l,endpointUrl:d,token:f,ecosystemToken:f,allowInsecureTls:p}),g=h?.echo||h?.envelope?.payload||{},_=g?.error||h?.error||(!h?.ok&&!h?.echo?`update failed`:``);if(_){i(String(_),{tone:`err`});return}if(c&&(g?.localVersionCode!=null||g?.localVersionName)){let e=String(g?.localSignatureSha256||``).slice(0,12);c.textContent=`Installed: ${g.localVersionName||`?`} (${g.localVersionCode??`?`})`+(e?` · sig ${e}…`:``)}if(O){i(g?.launchedInstaller?`Installer launched — confirm on the system prompt.`:`Install request sent.`,{tone:`ok`});return}let v=g?.localVersionCode??`?`,y=g?.remoteVersionCode??`?`,b=g?.updateAvailable===!0;if(g?.signatureCompatible===!1){i(`Signature mismatch — remote APK not signed like this install (local ${v}, remote ${y}).`,{tone:`err`});return}i(b?`Update available: ${v} → ${y} (${g?.remoteVersionName||`?`}).`:`Up to date (local ${v}, remote ${y}).`,{tone:b?`warn`:`ok`})}catch(e){i(String(e?.message||e),{tone:`err`})}})();return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{i(`Saving…`,{tone:`warn`});let t=await ce(),n=t.appearance?.markdown?.extensions||[],r=c(`markdown`)&&A?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){U(`markdown`),i(e?.message||`Invalid Markdown extensions JSON.`);return}let s={...t,ai:c(`ai`)?{baseUrl:d?.value?.trim?.()||``,apiKey:f?.value?.trim?.()||``,model:g?.value||`gpt-5.6-luna`,customModel:g?.value===`custom`&&_?.value?.trim?.()||``,defaultReasoningEffort:y?.value||`medium`,defaultVerbosity:b?.value||`medium`,maxOutputTokens:I(ee?.value,4e5),contextTruncation:te?.value||`disabled`,promptCacheRetention:ie?.value||`in-memory`,maxToolCalls:I(ae?.value,8),parallelToolCalls:(de?.checked??!0)!==!1,requestTimeout:{low:I(fe?.value,6e4),medium:I(pe?.value,3e5),high:I(me?.value,9e5)},maxRetries:I(he?.value,2),shareTargetMode:_e?.value||`recognize`,autoProcessShared:(ve?.checked??!0)!==!1,responseLanguage:T?.value||`auto`,translateResults:!!ye?.checked,generateSvgGraphics:!!xe?.checked,mcp:c(`mcp`)?pt(H):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:c(`ai`)?{language:E?.value||`en-US`}:t.speech||{},core:c(`server`)?{...t.core,ntpEnabled:R(Je,!!t.core?.ntpEnabled),mode:L(Ye,t.core?.mode||`native`)||`native`,endpointUrl:L(j,t.core?.endpointUrl||``),userId:L(M,t.core?.userId||``),ecosystemToken:L(P,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||L(N,t.core?.userKey||``)||L(z,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:L(P,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||L(N,t.core?.userKey||``)||L(z,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:R(et,!!t.core?.encrypt),preferBackendSync:R($e,(t.core?.preferBackendSync??!0)!==!1),appClientId:L(tt,t.core?.appClientId||``),allowInsecureTls:R(rt,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:!0,socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=L(P,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||L(N,t.core?.userKey||``)||L(z,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:L(ht,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:L(_t,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:R(yt,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:L(F,t.core?.admin?.httpsOrigin||``),httpOrigin:L(at,t.core?.admin?.httpOrigin||``),path:L(st,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:R(it,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:c(`server`)?{...t.shell||{},maintainHubSocketConnection:R(bt,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:L(xt,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:R(B,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=Ct?.value,n=I(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:R(wt,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:R(At,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:L(Mt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:R(Pt,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:L(It,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:R(Rt,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:R(zt,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!be()&&R(Bt,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!be()&&R(Ht,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:R(Wt,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:c(`appearance`)||c(`markdown`)?{theme:Se?.value||`auto`,fontSize:Ce?.value||`medium`,color:kt(a),colorSource:Et(a),markdown:{preset:Ee?.value||`default`,fontFamily:De?.value||`system`,fontSizePx:I(Oe?.value,16),lineHeight:ut(k?.value,1.7,1.1,2.2),contentMaxWidthPx:I(ke?.value,860),printScale:ut(Ae?.value,1,.5,1.5),page:{size:je?.value||`auto`,orientation:Me?.value||`portrait`,marginMm:I(Ne?.value,12)},modules:{typography:(Fe?.checked??!0)!==!1,lists:(Le?.checked??!0)!==!1,tables:(Re?.checked??!0)!==!1,codeBlocks:(ze?.checked??!0)!==!1,blockquotes:(Be?.checked??!0)!==!1,media:(Ve?.checked??!0)!==!1,printBreaks:(He?.checked??!0)!==!1},plugins:{smartTypography:!!Ue?.checked,softBreaksAsBr:!!We?.checked,externalLinksNewTab:(Ge?.checked??!0)!==!1},customCss:Ke?.value||``,printCss:qe?.value||``,extensions:n||[]}}:t.appearance||{}};fr(a,s,o),await wr(s);let l=s,p=o.surface===`capacitor`||o.surface===`native`?h(l).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),m=await oe(l);if(!m){i(`Settings save returned no data.`,{tone:`err`});return}let v=!1;try{v=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cwsp-control`||/^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname||``))}catch{v=!1}try{if(v){let e=globalThis.__CWSP_ENSURE_CONTROL_FOR_SAVE__;if(typeof e==`function`){let t=await e();if(!t?.ok){ue(!1,t?.error||`Control not paired`),i(t?.error||`Pair phone Control (token + code + Accept) before Save`,{tone:`warn`});return}}}await xr(a,m,o),v&&globalThis.__CWSP_CONTROL_BRIDGE_LIVE__&&ue(!0)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e);let t=e instanceof Error?e.message:String(e);if(v&&ue(!1,t),/pairing|unauthorized|401|403|Control/i.test(t)){i(t,{tone:`warn`});return}}dr(a,m,o);let x=se(),ne=await p,S=ne.lines,re=ne.results.some(e=>e.granted===!1);u(()=>import(`./hub-socket-boot-DrJPxdnM.js`).then(e=>(e.r(),e.n)).then(async e=>{if(v){try{globalThis.__CWSP_CONTROL_BRIDGE_LIVE__||console.warn(`[Settings] Control not paired — settings saved locally only; pair to push to device`)}catch{}return}if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis;if(e.__CWS_NODE_CLIPBOARD_HUB__===!1)return;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.host||`127.0.0.1`).trim()||`127.0.0.1`;if(n===8434&&r!==`127.0.0.1`&&r!==`localhost`||n!==29110)return;let i=String(t?.key||`cwsp-neutralino-local`),a=m.core,o=String(a?.ecosystemToken||a?.userKey||a?.socket?.accessToken||``).trim(),s={};a?.endpointUrl&&(s.remoteHost=String(a.endpointUrl).trim()),o&&(s.accessToken=o,s.clientToken=o),a?.userId&&(s.clientId=String(a.userId).trim()),s.force=!0,await fetch(`http://${r}:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":i},body:JSON.stringify(s),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await u(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CJBOA0Wb.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(m),u(()=>import(`./hub-socket-boot-DrJPxdnM.js`).then(e=>(e.s(),e.u)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),ge(m),e.onTheme?.(m.appearance?.theme||`auto`);let C=[`Saved locally`];x.nativeSynced===!0?C.push(`synced to Android`):x.nativeSynced===!1&&!re?console.warn(`[Settings] native settings patch:`,x.nativeError||`not confirmed`):x.nativeSynced===!1&&C.push(`native sync failed${x.nativeError?`: ${x.nativeError}`:``}`);let le=(()=>{try{return String(globalThis.__CWSP_CONTROL_VIA__||``)}catch{return``}})(),w=le===`android`?`phone Control (Capacitor)`:le===`neutralino`?`desk Control (Neutralino)`:v?`Control`:`desk Control`;x.webnativeSynced===!0?C.push(`synced to ${w}`):x.webnativeSynced===!1&&C.push(`${w} sync failed${x.webnativeError?`: ${x.webnativeError}`:``}`),S.length&&C.push(...S);let D=`ok`;(re||x.webnativeSynced===!1)&&(D=`warn`),i(C.join(` · `),{tone:D})})().catch(e=>i(String(e),{tone:`err`}))}),e.isExtension){Gt&&(Gt.hidden=!1),Kt&&(Kt.hidden=!1);let e=S`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;a.append(e)}let Yt=qt(e.initialTab);if(U(Yt),!a.querySelector(`.settings-screen__body > [data-tab-panel="${Yt}"]:not([hidden])`)){let e=a.querySelector(`.settings-screen__body > [data-tab-panel]`);e&&U(e.getAttribute(`data-tab-panel`)||Yt)}w();let q=a.querySelectorAll(`.settings-screen__body > [data-tab-panel]`).length,Xt=a.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${s} surface=${o.surface} tabs=${Xt} panels=${q} active=${a.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(q===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,a.querySelector(`.settings-screen__body`)?.appendChild(e),U(`cwsp`)}return a.addEventListener(`cwsp-settings-resync`,()=>{Xe(a),U(a.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Yt)}),a}})))()}function Or(e){return new Ar(e)}var kr,Ar;function jr(){return(jr=e((()=>{de(),n(),Ge(),M(),Dr(),G(),Tr(),E(),l(),kr={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Ar=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=pe(kr);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id;return this.element=Er({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>Xe(this.element)),this.element}getToolbar(){return null}setupEventHandlers(){}loadSettings(){this.settings.value={...kr}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...kr},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){Xe(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(t(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===Ke.Patch||e===Ke.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([u(()=>import(`./Settings-C2gfTGzF.js`).then(e=>(e.a(),e.t)),[],import.meta.url),u(()=>import(`./Theme-7Qwu6Img.js`).then(e=>(e.r(),e.t)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}})))()}jr();export{Ar as SettingsView,dr as applyContributions,Te as clearSettingsSyncArms,fr as collectContributions,Oe as createMemorySettingsSyncArm,Er as createSettingsView,Or as createView,Or as default,D as detectSettingsSurface,Gt as getSettingsContributions,xe as getSettingsDefaults,Ee as getSettingsSnapshot,k as getSettingsSync,br as hydrateContributionsFromSync,we as mergeSettingsPatch,lr as mountContributions,ke as patchSettingsSync,xr as persistContributionsViaSync,qn as registerBuiltinSettingsContributions,mn as registerCwspSettingsContribution,gn as registerDeviceSettingsContribution,vn as registerReaderSettingsContribution,H as registerSettingsContribution,Se as registerSettingsSyncArm,bn as registerWorkcenterSettingsContribution,or as resolveSettingsSurface,Ce as resolveSettingsSyncArm,De as setSurfaceDetector,O as unregisterSettingsSyncArm};