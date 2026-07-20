import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{F as t,H as n,L as r,V as i,X as a,t as o,tt as s}from"./src-kpjtbscK.js";import{n as c,t as l}from"./preload-helper-NDuSAHbO.js";import{n as u,t as d}from"./templates-Cp6qXLQ6.js";import{a as f,d as p}from"./UnifiedMessaging-Bb5xrVpZ.js";import{R as m,W as h}from"./airpad-cwsp-client-parity-BenwfXdR.js";import{a as ee,i as g,r as _,t as v}from"./SettingsTypes-CpPsAQyG.js";import{t as y,y as b}from"./config-DRIOcGx0.js";import{a as x,i as te,n as ne,o as re,r as ie,s as ae}from"./Settings-CzQ1lgp1.js";import{F as oe,G as S,H as se,K as C,P as ce,U as le,W as ue,_ as de,a as fe,b as pe,c as me,d as he,f as ge,g as _e,h as w,i as ve,l as T,n as ye,o as E,p as D,q as be,r as xe,s as Se,t as Ce,u as we,y as Te}from"./cwsp-app.js";import{a as Ee,n as De,o as Oe,s as ke}from"./shells-G9vW_c0L.js";import{i as Ae,n as je,r as Me}from"./admin-doors-BoU4RSfd.js";import{c as Ne,i as Pe,l as Fe,n as Ie,o as Le,r as Re,s as ze}from"./CustomInstructions-Ba2LGyQg.js";import{c as Be,i as Ve,n as He,o as Ue}from"./channel-actions-C8Fni3h2.js";var We=e((()=>{})),O,Ge,k,A,j,M=e((()=>{We(),O=`data-settings-view-css`,Ge=e=>{let t=String(e||``).trim(),n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},k=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch}
.view-settings [data-tab-panel]:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important}
.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select{pointer-events:auto!important}
`,A=e=>{if(!e?.classList?.contains(`view-settings`)||e.querySelector(`style[${O}]`))return;let t=Ge(`/* Settings view — self-contained stylesheet.
 * INVARIANT: Works inside open shadow roots: no reliance on \`html:has(...)\`, \`:root:has(...)\`,
 * or \`html[data-active-view]\` for paint. Uses inherited \`color-scheme\` + \`light-dark()\` fallbacks
 * wherever \`--color-*\` Veela tokens are absent on first paint.
 * WHY: Lock \`color-scheme\` to app theme so fallbacks do not follow OS while Veela is light.
 */
@layer settings-view {
  /* Light DOM (md.u2re.space) + host-context for open shadow shells. */
  :is(html[data-theme=light] .view-settings, :host-context(html[data-theme=light]) .view-settings) {
    color-scheme: light;
  }
  :is(html[data-theme=dark] .view-settings, :host-context(html[data-theme=dark]) .view-settings) {
    color-scheme: dark;
  }
  .view-settings {
    color-scheme: inherit;
    /* ── semantic tokens (Veela when inherited, else self-sufficient) ── */
    --sv-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));
    --sv-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --sv-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --sv-outline: var(--color-outline-variant, light-dark(#c5cdd8, #3d4755));
    --sv-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #171c24));
    --sv-surface-2: var(--color-surface-container, light-dark(#f4f6fa, #1c232d));
    --sv-primary: var(--color-primary, #007acc);
    --sv-on-primary: var(--color-on-primary, #ffffff);
    --sv-danger: var(--color-error, #d32f2f);
    --sv-divider: color-mix(in oklab, var(--sv-outline) 35%, transparent);
    --sv-ring: color-mix(in oklab, var(--sv-outline) 55%, transparent);
    --sv-elev: 0 2px 14px color-mix(in oklab, var(--sv-fg) 5%, transparent);
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
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background-color: var(--sv-bg);
    color: var(--sv-fg);
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
    color: var(--sv-fg);
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
    border-block-end: 1px solid var(--sv-divider);
    flex-shrink: 0;
    min-inline-size: 0;
  }
  .view-settings .settings-screen__title {
    font-weight: 600;
    letter-spacing: -0.015em;
    font-size: clamp(1.05rem, 2.5cqi, 1.35rem);
  }
  @media (min-width: 720px) {
    .view-settings .settings-screen__top {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    }
    .view-settings .settings-screen__top .settings-tab-actions {
      flex: 1;
      justify-content: flex-end;
    }
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
    scrollbar-color: var(--sv-outline) transparent;
  }
  .view-settings .settings-screen__body::-webkit-scrollbar {
    inline-size: 6px;
  }
  .view-settings .settings-screen__body::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, var(--sv-outline) 45%, transparent);
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
    border-block-start: 1px solid var(--sv-divider);
    background: color-mix(in oklab, var(--sv-surface-1) 85%, var(--sv-bg));
    box-shadow: 0 -10px 28px color-mix(in oklab, var(--sv-fg) 4%, transparent);
  }
  .view-settings {
    /* ── tabs ── */
  }
  .view-settings .settings-tab-actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.375rem;
    align-items: center;
    inline-size: stretch;
    max-inline-size: stretch;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-outline) transparent;
    container-type: inline-size;
    /* CRX / layered shells: ensure the tab strip participates in hit-testing */
    pointer-events: auto;
    position: relative;
    z-index: 1;
  }
  .view-settings .settings-tab-btn {
    pointer-events: auto;
    cursor: pointer;
    padding: 0.5rem 0.875rem;
    min-block-size: 2.5rem;
    border: none;
    border-radius: 999px;
    background: color-mix(in oklab, var(--sv-surface-2) 94%, transparent);
    color: var(--sv-muted);
    font-size: 0.75rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-outline) 14%, transparent);
    white-space: nowrap;
  }
  .view-settings .settings-tab-btn:hover {
    background: color-mix(in oklab, var(--sv-surface-2) 100%, transparent);
    color: var(--sv-fg);
  }
  .view-settings .settings-tab-btn.is-active {
    background: var(--sv-primary);
    color: var(--sv-on-primary);
    box-shadow: 0 2px 12px color-mix(in oklab, var(--sv-primary) 28%, transparent), 0 0 0 1px color-mix(in oklab, var(--sv-primary) 40%, transparent);
  }
  .view-settings .settings-tab-panel {
    display: none;
  }
  .view-settings .settings-tab-panel:not([hidden]), .view-settings .settings-tab-panel.is-active:not([hidden]) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    min-inline-size: 0;
  }
  .view-settings .settings-tab-panel[hidden] {
    display: none !important;
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
    background: color-mix(in oklab, var(--sv-surface-2) 92%, var(--sv-bg));
    box-shadow: var(--sv-elev), 0 0 0 1px color-mix(in oklab, var(--sv-outline) 14%, transparent);
  }
  @container (max-inline-size: 480px) {
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
  }
  .view-settings .field {
    display: grid;
    grid-auto-flow: row;
    gap: 0.375rem;
    inline-size: stretch;
    font-size: 0.75rem;
    margin: 0;
  }
  .view-settings .field > span {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--sv-muted);
  }
  .view-settings .field.checkbox {
    grid-auto-flow: column;
    grid-auto-columns: max-content 1fr;
    align-items: center;
    gap: 0.625rem;
  }
  .view-settings .field-hint {
    margin: 0 0 0.75rem;
    font-size: 0.85em;
    line-height: 1.45;
    color: var(--sv-muted);
    opacity: 0.95;
  }
  .view-settings .form-input,
  .view-settings .form-select {
    display: block;
    inline-size: 100%;
    min-block-size: 2.5rem;
    padding: 0.5rem 0.65rem;
    border-radius: 10px;
    border: 1px solid color-mix(in oklab, var(--sv-outline) 45%, transparent);
    background: var(--sv-surface-1);
    color: var(--sv-fg);
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
  }
  .view-settings .form-input:focus-visible,
  .view-settings .form-select:focus-visible {
    border-color: color-mix(in oklab, var(--sv-primary) 55%, var(--sv-outline));
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--sv-primary) 22%, transparent);
  }
  .view-settings select.form-select,
  .view-settings select.form-input {
    appearance: none;
    padding-inline-end: 2rem;
    background-image: linear-gradient(45deg, transparent 50%, var(--sv-muted) 50%), linear-gradient(135deg, var(--sv-muted) 50%, transparent 50%);
    background-position: calc(100% - 14px) calc(50% - 2px), calc(100% - 9px) calc(50% - 2px);
    background-size: 5px 5px;
    background-repeat: no-repeat;
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
    background: color-mix(in oklab, var(--sv-surface-2) 90%, transparent);
    color: var(--sv-fg);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-outline) 12%, transparent);
  }
  .view-settings .btn:hover {
    background: color-mix(in oklab, var(--sv-fg) 6%, var(--sv-surface-2));
  }
  .view-settings .btn.primary {
    background: var(--sv-primary);
    color: var(--sv-on-primary);
    box-shadow: 0 2px 12px color-mix(in oklab, var(--sv-primary) 26%, transparent), 0 0 0 1px color-mix(in oklab, var(--sv-primary) 45%, transparent);
  }
  .view-settings .btn.primary:hover {
    filter: brightness(1.06);
  }
  .view-settings .btn.btn-sm, .view-settings .btn.small {
    padding: 0.35rem 0.65rem;
    min-block-size: 2rem;
    font-size: 0.75rem;
  }
  .view-settings .btn.btn-danger {
    color: var(--sv-on-primary);
    background: color-mix(in oklab, var(--sv-danger) 92%, #000);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-danger) 35%, transparent);
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
    color: var(--sv-muted);
    opacity: 0.92;
    flex: 1 1 auto;
    max-inline-size: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.35;
    pointer-events: none;
  }
  .view-settings .note.note--ok,
  .view-settings .ext-note.note--ok {
    color: color-mix(in oklab, var(--sv-accent, #3ecf8e) 70%, var(--sv-fg));
  }
  .view-settings .note.note--warn,
  .view-settings .ext-note.note--warn {
    color: color-mix(in oklab, #e6a700 75%, var(--sv-fg));
  }
  .view-settings .note.note--err,
  .view-settings .ext-note.note--err {
    color: color-mix(in oklab, #e05252 80%, var(--sv-fg));
  }
  .view-settings .ext-note {
    line-height: 1.4;
  }
  .view-settings .ext-note code {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.68rem;
    background: color-mix(in oklab, var(--sv-surface-2) 80%, var(--sv-bg));
    color: var(--sv-fg);
  }
  .view-settings {
    /* ── checkboxes ── */
  }
  .view-settings .form-checkbox input[type=checkbox],
  .view-settings label.field.checkbox input[type=checkbox] {
    inline-size: 1.15rem;
    block-size: 1.15rem;
    accent-color: var(--sv-primary);
    flex-shrink: 0;
  }
  .view-settings {
    /* ── MCP ── */
  }
  .view-settings .mcp-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .view-settings .mcp-actions {
    margin-block-start: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .view-settings .mcp-row {
    display: grid;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 12px;
    background: color-mix(in oklab, var(--sv-surface-2) 88%, var(--sv-bg));
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--sv-outline) 12%, transparent);
  }
  .view-settings .mcp-row .field {
    margin: 0;
  }
  .view-settings .mcp-empty-note {
    margin: 0;
    color: var(--sv-muted);
    font-size: 0.75rem;
  }
  .view-settings {
    /* ── spoiler / details ── */
  }
  .view-settings .settings-spoiler {
    border-radius: 12px;
    border: 1px solid color-mix(in oklab, var(--sv-outline) 22%, transparent);
    background: color-mix(in oklab, var(--sv-surface-1) 55%, transparent);
    padding: 0.25rem 0.5rem;
  }
  .view-settings .settings-spoiler summary {
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.35rem 0.25rem;
    color: var(--sv-fg);
  }
  .view-settings .settings-spoiler .settings-panel-form {
    padding-block-end: 0.25rem;
  }
  .view-settings {
    /* ── legacy / demo shell (index.ts) ── */
  }
  .view-settings .view-settings__content {
    inline-size: 100%;
    max-inline-size: clamp(640px, 90%, 800px);
  }
  .view-settings .view-settings__section {
    display: flex;
    flex-direction: column;
    margin-block-end: 2rem;
    padding-block-end: 2rem;
    border-block-end: 1px solid var(--sv-divider);
  }
  .view-settings .view-settings__section:last-of-type {
    border-block-end: none;
  }
  .view-settings .view-settings__group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .view-settings .view-settings__label {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
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
    border: 1px solid color-mix(in oklab, var(--sv-outline) 45%, transparent);
    background: var(--sv-surface-1);
    color: var(--sv-fg);
    font-size: 0.875rem;
  }
  .view-settings .view-settings__checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }
  .view-settings .view-settings__actions {
    display: flex;
    gap: 0.75rem;
    margin-block-start: 1.5rem;
  }
  .view-settings .view-settings__btn {
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    border: 1px solid color-mix(in oklab, var(--sv-outline) 40%, transparent);
    background: transparent;
    color: var(--sv-fg);
    cursor: pointer;
  }
  .view-settings .view-settings__btn--primary {
    background: var(--sv-primary);
    border-color: color-mix(in oklab, var(--sv-primary) 30%, #000);
    color: var(--sv-on-primary);
  }
  .view-settings .view-settings__btn--primary:hover {
    filter: brightness(1.06);
  }
  .view-settings {
    /* ── custom instructions (panel + editor variants) ── */
  }
  .view-settings .custom-instructions-panel,
  .view-settings .custom-instructions-editor {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .view-settings .cip-select-row,
  .view-settings .ci-row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .view-settings .ci-header {
    margin-block-end: 0.25rem;
  }
  .view-settings .ci-header h4 {
    margin: 0 0 0.25rem;
    font-size: 0.88rem;
  }
  .view-settings .ci-desc {
    margin: 0;
    font-size: 0.78rem;
    color: var(--sv-muted);
    line-height: 1.45;
  }
  .view-settings .ci-active-select {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .view-settings .ci-select,
  .view-settings .cip-select {
    min-block-size: 2.35rem;
    padding: 0.4rem 0.55rem;
    border-radius: 10px;
    border: 1px solid color-mix(in oklab, var(--sv-outline) 40%, transparent);
    background: var(--sv-surface-1);
    color: var(--sv-fg);
    font-size: 0.8rem;
  }
  .view-settings .cip-list,
  .view-settings .ci-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .view-settings .cip-item,
  .view-settings .ci-item {
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
    background: var(--sv-surface-1);
    border: 1px solid color-mix(in oklab, var(--sv-outline) 16%, transparent);
  }
  .view-settings .cip-item.is-active, .view-settings .cip-item.active,
  .view-settings .ci-item.is-active,
  .view-settings .ci-item.active {
    border-color: color-mix(in oklab, var(--sv-primary) 35%, transparent);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--sv-primary) 18%, transparent);
  }
  .view-settings .cip-item-header,
  .view-settings .ci-item-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .view-settings .cip-item-label,
  .view-settings .ci-item-label {
    font-weight: 600;
    font-size: 0.8rem;
  }
  .view-settings .cip-item-actions,
  .view-settings .ci-item-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: flex-end;
  }
  .view-settings .cip-badge,
  .view-settings .ci-badge {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
    border-radius: 999px;
    background: color-mix(in oklab, var(--sv-primary) 16%, transparent);
    color: var(--sv-fg);
  }
  .view-settings .cip-item-preview,
  .view-settings .ci-item-preview {
    font-size: 0.75rem;
    color: var(--sv-muted);
    margin-block-start: 0.35rem;
    line-height: 1.45;
  }
  .view-settings .cip-edit-form,
  .view-settings .ci-edit-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block-start: 0.5rem;
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
  }
  .view-settings .cip-input,
  .view-settings .cip-textarea,
  .view-settings .ci-input,
  .view-settings .ci-textarea,
  .view-settings .field-control {
    inline-size: 100%;
    border-radius: 10px;
    border: 1px solid color-mix(in oklab, var(--sv-outline) 40%, transparent);
    background: var(--sv-surface-1);
    color: var(--sv-fg);
    padding: 0.45rem 0.55rem;
    font-size: 0.8125rem;
  }
  .view-settings .cip-textarea,
  .view-settings .ci-textarea {
    min-block-size: 5rem;
  }
  .view-settings .cip-empty,
  .view-settings .ci-empty {
    font-size: 0.8rem;
    color: var(--sv-muted);
    padding: 0.75rem;
    text-align: center;
  }
  .view-settings .field-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--sv-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .view-settings {
    /* ── touch targets & responsive footer ── */
  }
  @container (max-inline-size: 1024px) {
    .view-settings {
      padding: 0.65rem;
    }
  }
  @container (max-inline-size: 560px) {
    .view-settings .settings-tab-actions {
      gap: 0.3rem;
    }
    .view-settings .settings-tab-btn {
      min-block-size: 2.65rem;
      padding-inline: 0.7rem;
    }
  }
  @container (max-inline-size: 480px) {
    .view-settings {
      padding: 0.45rem;
    }
    .view-settings .settings-screen__title {
      display: none;
    }
    .view-settings .settings-screen__body {
      padding-block: 0.5rem;
      gap: 0.75rem;
    }
    .view-settings .settings-screen__footer {
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 0.5rem;
    }
    .view-settings .settings-screen__footer .btn.primary {
      inline-size: 100%;
      justify-content: center;
      min-block-size: 2.75rem;
    }
    .view-settings .settings-screen__footer .note {
      white-space: normal;
      text-align: center;
    }
  }
}`);t.trim()||(t=k);let n=document.createElement(`style`);n.setAttribute(O,``),n.textContent=t,e.insertBefore(n,e.firstChild)},j=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}A(e)};e.isConnected?A(e):requestAnimationFrame(t)}}));function Ke(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var qe,N,P=e((()=>{qe={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`},N=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}},new N(`rs-workcenter`,`data`),new N(`rs-history`,`entries`),new N(`rs-settings`,`config`)})),Je=e((()=>{P()}));function Ye(e){Ee();let t=ke(`/`);if(e.params&&Object.keys(e.params).length>0){let n=new URLSearchParams(e.params).toString();t+=(t.includes(`?`)?`&`:`?`)+n}return t}function Xe(e,t={}){let n=Ye(e);t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function Ze(e,t){Xe({view:e,params:t})}var Qe=e((()=>{w(),S(),Oe(),[...ue],be(`home`,le)})),$e=e((()=>{})),et=e((()=>{Be(),De(),se(),se(),Ue(),Qe(),w(),w(),$e()})),F,tt,I,nt,rt,L,it,R,z,at,ot=e((()=>{F=[`en`,`ru`,`en-GB`,`en-US`],tt=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,I=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},nt=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=I(n);t&&e.add(t)}for(let t of F)e.add(t);return Array.from(e)},rt=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},L=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},it=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},R=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},z=(e,t)=>e?!!e.checked:t,at=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})),st,ct,lt,B=e((()=>{o(),st=e=>{let n={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return t`<div class="field mcp-row" data-mcp-id=${n.id}>
            <label class="field">
              <span>Server Label</span>
              <input class="form-input" type="text" data-mcp-field="serverLabel" autocomplete="off" value="${n.serverLabel}" />
            </label>
            <label class="field">
              <span>Origin</span>
              <input class="form-input" type="url" data-mcp-field="origin" autocomplete="off" placeholder="https://server.example" value="${n.origin}" />
            </label>
            <label class="field">
              <span>Client Key</span>
              <input class="form-input" type="text" data-mcp-field="clientKey" autocomplete="off" value="${n.clientKey}" />
            </label>
            <label class="field">
              <span>Secret Key</span>
              <input class="form-input" type="password" data-mcp-field="secretKey" autocomplete="off" placeholder="sk-..." value="${n.secretKey}" />
            </label>
            <button class="btn btn-danger" type="button" data-action="remove-mcp-server">Remove</button>
          </div>`},ct=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},lt=(e,n)=>{if(!e)return;e.replaceChildren();let r=Array.isArray(n)?n:[];if(!r.length){e.appendChild(t`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}r.forEach(t=>e.appendChild(st(t)))}})),ut,dt=e((()=>{o(),ut=()=>t`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})),ft,pt=e((()=>{o(),ft=()=>t`<header class="settings-screen__top">
        <h2 class="settings-screen__title">Settings</h2>
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`})),mt,ht=e((()=>{o(),mt=()=>t`<section class="card settings-tab-panel" data-tab-panel="appearance">
      <h3>Appearance</h3>
      <label class="field">
        <span>Theme</span>
        <select class="form-select" data-field="appearance.theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
        <span>Font Size</span>
        <select class="form-select" data-field="appearance.fontSize">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    </section>`})),gt,_t=e((()=>{o(),gt=()=>t`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`})),vt,yt=e((()=>{o(),vt=()=>t`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`})),bt,xt=e((()=>{o(),bt=()=>t`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})),St,Ct=e((()=>{o(),St=()=>t`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`})),wt,Tt=e((()=>{o(),r(),ze(),u(),wt=(e={})=>{let n=i({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),r=t`<div class="custom-instructions-editor">
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
    </div>`,a=r.querySelector(`[data-list]`),o=r.querySelector(`[data-action='select-active']`),s=r.querySelector(`[data-add-form]`),c=r.querySelector(`[data-field='label']`),l=r.querySelector(`[data-field='instruction']`),u=()=>{a.replaceChildren();let r=n.instructions??[];if(!r.length){a.append(t`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of r){let r=n.editingId===i.id,o=n.activeId===i.id,s=t`<div class="ci-item ${o?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${o?t`<span class="ci-badge active">Active</span>`:t`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${r?t`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:t`<div class="ci-item-preview">${p(i.instruction,120)}</div>`}
            </div>`;s.addEventListener(`click`,t=>{let r=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&Ne(i.id).then(m).then(()=>e.onUpdate?.()),r===`edit`&&(n.editingId=i.id,u()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&Pe(i.id).then(m).then(()=>e.onUpdate?.()),r===`save-edit`){let t=s.querySelector(`[data-edit-field='label']`),r=s.querySelector(`[data-edit-field='instruction']`);Fe(i.id,{label:t.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(n.editingId=null,m())).then(()=>e.onUpdate?.())}r===`cancel-edit`&&(n.editingId=null,u())}),a.append(s)}},f=()=>{o.replaceChildren(),o.append(t`<option value="">None (use default)</option>`);for(let e of n.instructions??[]){let r=t`<option value="${e.id}">${e.label}</option>`;e.id===n.activeId&&(r.selected=!0),o.append(r)}},p=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,m=async()=>{let e=await Le(),t=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;n.instructions=t?.instructions??[],n.activeId=t?.activeId??``,u(),f()};return r.addEventListener(`click`,t=>{let r=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(n.isAdding=!0,s.hidden=!1,c.value=``,l.value=``,c.focus()),r===`cancel-add`&&(n.isAdding=!1,s.hidden=!0),r===`save-new`){let t=c.value.trim(),r=l.value.trim();if(!r){l.focus();return}Ie(t||`Custom`,r).then(e=>{if(e)return n.isAdding=!1,s.hidden=!0,m()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let t=new Set((n.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=d.filter(e=>!t.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}Re(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(m).then(()=>e.onUpdate?.())}}),o.addEventListener(`change`,()=>{Ne(o.value||null).then(m).then(()=>e.onUpdate?.())}),m(),r}})),Et,Dt=e((()=>{o(),Tt(),Et=e=>t`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${wt({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})),Ot,kt=e((()=>{o(),Ot=()=>t`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field">
        <span>Local hub URL (Neutralino / desk backend)</span>
        <input class="form-input" type="text" inputmode="url" autocomplete="off" placeholder="https://127.0.0.1:8434/" data-field="shell.localHubUrl" />
      </label>
      <p class="field-hint">Chrome wire hub for L-110-crx only. Independent from CWSP → Relay / gateway.</p>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`})),V,H,U,At,jt,Mt,Nt,W,G=e((()=>{V=new Map,H=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return V.set(t,n),()=>{V.get(t)===n&&V.delete(t)}},U=()=>[...V.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),At=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},jt=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},Mt=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},Nt=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=At(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},W=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=Mt(e);r!==void 0&&jt(n,t,r)})}})),K,q,J,Y,X,Z,Q,$,Pt,Ft,It=e((()=>{K=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},q=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},J=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},Y=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},X=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},Z=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},Q=(e,t,n)=>{let r=document.createElement(`button`);return r.type=`button`,r.className=n?.className||(n?.primary?`view-settings__btn view-settings__btn--primary`:`view-settings__btn`),r.setAttribute(`data-action`,t),r.textContent=e,r},$=(...e)=>{let t=document.createElement(`div`);t.className=`field settings-action-row`,t.style.display=`flex`,t.style.flexWrap=`wrap`,t.style.gap=`0.5rem`;for(let n of e)t.appendChild(n);return t},Pt=(e,t,n)=>{let r=document.createElement(`div`);r.className=`field settings-secret-field`,r.setAttribute(`data-secret-field`,t);let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`div`);a.style.cssText=`display:flex;gap:.4rem;align-items:center;margin-top:.3rem;`;let o=document.createElement(`input`);o.className=`form-input`,o.type=`password`,o.readOnly=!0,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=n?.placeholder||`••••••`,o.setAttribute(`data-${t}`,`1`),o.setAttribute(`data-secret-input`,t),o.value=``,n?.mono?(o.style.fontFamily=`ui-monospace, SFMono-Regular, Menlo, monospace`,o.style.fontSize=`0.9rem`,o.style.letterSpacing=`0.04em`):(o.style.fontSize=`1.15rem`,o.style.fontWeight=`700`,o.style.letterSpacing=`0.12em`),o.style.flex=`1 1 auto`,o.style.minWidth=`0`;let s=document.createElement(`button`);s.type=`button`,s.className=`view-settings__btn`,s.textContent=`View`,s.title=`Show / hide`,s.setAttribute(`data-action`,`control-secret-toggle`),s.setAttribute(`data-secret-for`,t);let c=document.createElement(`button`);c.type=`button`,c.className=`view-settings__btn`,c.textContent=`Copy`,c.title=`Copy to clipboard`,c.setAttribute(`data-action`,`control-secret-copy`),c.setAttribute(`data-secret-for`,t);let l=document.createElement(`p`);l.className=`field-hint`,l.setAttribute(`data-secret-meta`,t),l.style.margin=`0.2rem 0 0`,l.textContent=``;let u=()=>{let e=o.dataset.revealed===`1`;o.type=e?`text`:`password`,s.textContent=e?`Hide`:`View`};return s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),o.dataset.revealed=o.dataset.revealed===`1`?`0`:`1`,u()}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=String(o.value||``).trim();if(t)try{await navigator.clipboard.writeText(t);let e=c.textContent;c.textContent=`Copied`,window.setTimeout(()=>{c.textContent=e||`Copy`},1200)}catch{o.type=`text`,o.select();try{document.execCommand(`copy`)}catch{}u()}}),a.append(o,s,c),r.append(i,a,l),r},Ft=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(q(e)):r.appendChild(e);return r}})),Lt,Rt=e((()=>{G(),It(),Lt=()=>H({id:`airpad`,label:`AirPad`,order:70,requiresView:`airpad`,render:()=>Ft(`airpad`,`AirPad`,[Y(`Pointer sensitivity`,`views.airpad.pointerSensitivity`,{min:`0.2`,max:`5`,step:`0.1`,placeholder:`1.0`}),X(`Invert scroll`,`views.airpad.invertScroll`),X(`Send haptics`,`views.airpad.haptics`)])})})),zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt=e((()=>{G(),_(),It(),c(),zt=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,Bt=`L-110`,Vt=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),Ht=(...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!Vt(e))return e}return Bt},Ut=e=>{let t=e.surface===`crx`||!!e.isExtension,n=[K(t?`CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field.`:`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,J(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434 or https://45.147.121.152:8434`),K(t?`Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control).`:`Coordinator / gateway. Always include :8434 — bare host dials :443 where /ws is not served (404).`),J(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),K(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`)];return t?n.push(J(`Client id (Neutralino / backend)`,`shell.clientId`,`L-110`),K(`Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx).`)):n.push(J(`Client id`,`core.userId`,`L-196 or L-110`),K(`Short fleet id (L-196, L-210, …).`)),n.push(J(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),K(t?`Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login).`:`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),J(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),K(zt),X(`Allow insecure TLS`,`core.allowInsecureTls`)),n},Wt=()=>[`Clipboard`,X(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),X(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),J(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),K(zt),J(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),K(zt),`Clipboard prompt`,Z(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),Z(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),X(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),X(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),Y(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),K(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],Gt=()=>[`Native wire (Capacitor)`,X(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),X(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],Kt=()=>[`Control pairing`,Pt(`Device code (20s, +10s grace)`,`control-device-code`,{placeholder:`••••••`}),Pt(`Public token`,`control-public-token`,{mono:!0,placeholder:`••••••••••••`}),$(Q(`Refresh code`,`control-pairing-refresh`),Q(`Regenerate public token`,`control-public-token-regenerate`)),K(`Values are hidden by default — use View / Copy. For https://cwsp.u2re.space enter public token + live code in the pairing modal. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.`)],qt=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-crx-control-status`,`1`),e.textContent=`Control: …`,[`Control pairing`,e,$(Q(`Pair Control…`,`crx-control-pair`,{primary:!0}),Q(`Unpair`,`crx-control-unpair`)),K(`Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.`)]},Jt=()=>{try{let e=globalThis;if(e.NL_OS!=null||e.NL_PORT!=null||e.Neutralino||e.Capacitor?.isNativePlatform?.())return!1;let t=String(e.Capacitor?.getPlatform?.()||``).toLowerCase();if(t===`android`||t===`ios`)return!1;let n=String(location.hostname||``).toLowerCase();return!n||n===`localhost`||n===`127.0.0.1`||n===`[::1]`?!1:location.protocol===`https:`}catch{return!1}},Yt=()=>[`Device`,X(`Start CWSP on boot`,`shell.autoStartOnBoot`),X(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),X(`Allow Control API`,`shell.allowControlApi`),K(`Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password.`),...Kt(),X(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),X(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),K(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],Xt=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-apk-local-version`,`1`),e.textContent=`Installed version: … (tap Check to refresh)`,[`App update (dev)`,e,Z(`Update source`,`shell.apkUpdateSource`,[[`wan`,`WAN — https://45.147.121.152:8434`],[`lan`,`LAN — https://192.168.0.200:8434`],[`relay`,`Current Relay (core.endpointUrl)`]]),$(Q(`Check for update`,`apk-update-check`),Q(`Download & install`,`apk-update-install`,{primary:!0})),K("Uses ecosystem token (X-API-Key) against /releases/android. Install requires the same APK signing certificate as the installed app. Each `npm run build:capacitor` auto-bumps VERSION_CODE and restages the gateway release.")]},Zt=()=>H({id:`cwsp`,label:`CWSP`,order:55,excludeSurfaces:[`markdown`],render:e=>{let t=[...Ut(e),...Wt()];return e.surface===`capacitor`||e.surface===`native`?t.push(...Gt(),...Yt(),...Xt()):e.surface===`crx`||e.isExtension?t.push(...qt()):Jt()||t.push(...Gt(),...Kt()),Ft(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=ee(e));let r=t.querySelector(`[data-field="shell.clientId"]`);if(r){let t=Ht(r.value,e.shell?.clientId,e.core?.userId);r.value=t,e.shell={...e.shell||{},clientId:t}}let i=t.querySelector(`[data-field="shell.apkUpdateSource"]`);if(i){let t=String(e.shell?.apkUpdateSource||`wan`).trim();i.value=t===`lan`||t===`relay`?t:`wan`}let a=t.querySelector(`button[data-action="control-pairing-refresh"]`);if(a){queueMicrotask(()=>a.click());let e=Number(t.__cwspPairTimer||0);e&&clearInterval(e),t.__cwspPairTimer=window.setInterval(()=>{t.isConnected&&a.click()},2500)}let o=t.querySelector(`[data-crx-control-status]`);o&&l(()=>import(`./crx-control-session--61Cvgg2.js`).then(e=>e.formatCrxControlSessionStatus()),[],import.meta.url).then(e=>{o.isConnected&&(o.textContent=e)}).catch(()=>{o.textContent=`Control: status unavailable`})},save:e=>{g(e),Vt(e.shell?.clientId)&&(e.shell={...e.shell||{},clientId:Ht(e.core?.userId)})}})})),$t,en=e((()=>{$t=()=>()=>void 0})),tn,nn=e((()=>{G(),It(),tn=()=>H({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>Ft(`reader`,`Reader`,[Y(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),X(`Wrap long lines`,`views.reader.wrapLongLines`)])})})),rn,an=e((()=>{G(),It(),rn=()=>H({id:`workcenter`,label:`Work Center`,order:65,requiresView:`workcenter`,render:()=>Ft(`workcenter`,`Work Center`,[X(`Auto-run pinned tasks`,`views.workcenter.autoRunPinned`),J(`Default instruction id`,`views.workcenter.defaultInstructionId`,`(none)`)])})})),on,sn,cn=e((()=>{Rt(),Qt(),en(),nn(),an(),on=!1,sn=()=>{on||(on=!0,Zt(),tn(),rn(),Lt(),$t())}})),ln,un,dn,fn,pn,mn,hn,gn=e((()=>{S(),ln=e=>e.isExtension||e.surface===`crx`?`extension`:e.surface===`markdown`?`markdown`:(e.surface===`capacitor`||e.surface===`native`)&&!(C(`workcenter`)||C(`viewer`)||C(`explorer`))?`cwsp-mobile`:`full`,un=[`appearance`,`markdown`,`ai`,`mcp`,`server`,`instructions`,`extension`],dn=[`extension`,`server`],fn=[`server`,`extension`],pn=(e,t)=>{let n=t===`cwsp-mobile`?un:t===`extension`?dn:t===`markdown`?fn:null;if(n)for(let t of n)e.querySelector(`[data-tab-panel="${t}"]`)?.remove(),e.querySelector(`[data-action="switch-settings-tab"][data-tab="${t}"]`)?.remove()},mn=e=>e===`cwsp-mobile`?`cwsp`:e===`extension`?`crx`:e===`markdown`?`markdown`:`ai`,hn=(e,t)=>!!e.querySelector(`[data-tab-panel="${t}"]`)})),_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn=e((()=>{_(),S(),G(),cn(),m(),Se(),gn(),c(),_n=`[data-settings-tabs]`,vn=`.settings-screen__body`,yn=()=>{try{let e=globalThis;if(e?.chrome?.runtime?.id)return`crx`;if(e?.Capacitor?.isNativePlatform?.()||e?.Capacitor?.getPlatform?.()===`android`||e?.Capacitor?.getPlatform?.()===`ios`)return`capacitor`;if(e?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`&&String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cw-markdown`)return`markdown`;if(typeof document<`u`)return`web`}catch{}return`unknown`},bn=(e,t)=>{if(e.requiresView&&!C(e.requiresView))return!1;let n=e.surfaces;return!(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface))},xn=e=>U().filter(t=>bn(t,e)),Sn=(e,t)=>{let n=e.querySelector(_n),r=e.querySelector(vn);if(!(!n||!r))for(let i of xn(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},Cn=(e,t,n)=>{for(let r of xn(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`);t&&n(r,t)}},wn=(e,t,n)=>{Cn(e,n,(e,r)=>{try{e.manualFields||Nt(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},Tn=(e,t,n)=>{Cn(e,n,(e,r)=>{try{e.manualFields||W(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},En=e=>!!e&&typeof e==`object`&&!Array.isArray(e),Dn=(e,t)=>{if(!En(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(En(t)&&En(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return En(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},On=()=>{try{let e=globalThis,t=typeof e.chrome?.runtime?.id==`string`&&typeof e.__NEUTRALINO_AUTH__?.port==`number`;return!!(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||typeof e.__WEBNATIVE_AUTH__?.port==`number`||typeof e.__NEUTRALINO_AUTH__?.port==`number`||t)}catch{return!1}},kn=e=>{if(!e||typeof e!=`object`)return!1;let t=e.core,n=e.shell,r=e.bridge,i=e.cwsp,a=e.control;return!!(typeof t?.endpointUrl==`string`&&t.endpointUrl.trim()||typeof t?.userId==`string`&&t.userId.trim()||typeof t?.ecosystemToken==`string`&&t.ecosystemToken.trim()||typeof t?.userKey==`string`&&t.userKey.trim()||typeof n?.clipboardInboundMode==`string`&&n.clipboardInboundMode||typeof n?.clipboardOutboundMode==`string`&&n.clipboardOutboundMode||typeof n?.remoteHost==`string`&&n.remoteHost.trim()||typeof n?.clientId==`string`&&n.clientId.trim()||typeof n?.allowControlApi==`boolean`||typeof n?.bridgeDaemonEnabled==`boolean`||typeof n?.autoStartOnBoot==`boolean`||typeof r?.endpointUrl==`string`&&r.endpointUrl.trim()||typeof r?.userId==`string`&&String(r.userId).trim()||typeof i?.clientId==`string`&&String(i.clientId).trim()||typeof i?.endpointUrl==`string`&&String(i.endpointUrl).trim()||a?.surface===`capacitor-android`)},An=()=>{try{let e=globalThis.chrome?.runtime?.id;return typeof e==`string`&&e.length>0}catch{return!1}},jn=e=>{if(!An())return e;let t=`L-110-crx`,n=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),r=((...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!n(e))return e}return`L-110`})(e.shell?.clientId,e.core?.userId);return{...e,core:{...e.core||{},userId:t,socket:{...e.core?.socket||{},selfId:t}},shell:{...e.shell||{},clientId:r}}},Mn=async e=>{let t=await e();if((t.core?.preferBackendSync??!0)===!1)return jn(t);let n=await E();if((On()||An())&&!kn(n))for(let e=0;e<8&&(await new Promise(e=>setTimeout(e,300)),n=await E(),!kn(n));e++);return jn(Dn(t,n))},Nn=async(e,t,n={})=>{let r=await E(),i=Dn(n,r);return wn(e,i,t),i},Pn=async(e,t,n)=>(Tn(e,t,n),T(t)),Fn=e=>xn(e).map(e=>e.id),In=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},Ln=async e=>{g(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await l(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-BenwfXdR.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=e=>{let t=String(e||``).trim().toLowerCase();if(!t)return``;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e).hostname.toLowerCase();if(n===`cwsp.u2re.space`||n===`www.cwsp.u2re.space`||n===`md.u2re.space`||n===`www.md.u2re.space`)return``}catch{if(/cwsp\.u2re\.space|md\.u2re\.space/i.test(t))return``}return String(e||``).trim()};if(typeof t.endpointUrl==`string`){let e=i(t.endpointUrl);e!==t.endpointUrl.trim()&&(t.endpointUrl=e)}let a=typeof t.endpointUrl==`string`?t.endpointUrl:``,o=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!a.trim()&&!o.trim())return;let s=In()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},c=await h({relayHttpsUrl:a,directHttpsUrl:o},s);c.relayHttpsUrl!==void 0&&(t.endpointUrl=c.relayHttpsUrl),c.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:c.directHttpsUrl})}})),zn,Bn=e((()=>{o(),x(),_(),je(),f(),oe(),Je(),et(),b(),ot(),B(),dt(),pt(),ht(),_t(),yt(),xt(),Ct(),Dt(),kt(),Rn(),_e(),Te(),M(),c(),zn=e=>{let n=null,r=null,i=()=>{let e=yn();return e===`capacitor`||e===`native`?8e3:2500},a=(e,t)=>{n&&(r&&=(clearTimeout(r),null),n.textContent=e,n.classList.remove(`note--ok`,`note--warn`,`note--err`),t?.tone===`ok`&&n.classList.add(`note--ok`),t?.tone===`warn`&&n.classList.add(`note--warn`),t?.tone===`err`&&n.classList.add(`note--err`),e&&!t?.persist&&(r=setTimeout(()=>{n&&(n.textContent=``,n.classList.remove(`note--ok`,`note--warn`,`note--err`))},i())))},o=t`<div class="view-settings" data-view="settings">
    ${ft()}
    <div class="settings-screen__body">
      ${mt()}
      ${gt()}
      ${vt()}
      ${bt()}
      ${St()}
      ${Et(a)}
      ${Ot()}
    </div>
    ${ut()}
  </div>`;j(o),sn();let s={isExtension:e.isExtension,surface:yn()},c=ln(s);Sn(o,s),pn(o,c),c===`full`&&(s.surface===`capacitor`||s.surface===`native`)&&(o.querySelector(`[data-tab-panel="server"]`)?.remove(),o.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let u=e=>hn(o,e),d=e=>o.querySelector(e);n=o.querySelector(`[data-note]`);let f=d(`[data-field="ai.baseUrl"]`),m=d(`[data-field="ai.apiKey"]`),h=d(`[data-field="ui.showKey"]`),g=d(`[data-field="ai.model"]`),_=d(`[data-field="ai.customModel"]`),b=o.querySelector(`[data-field-group="ai.customModel"]`),x=d(`[data-field="ai.defaultReasoningEffort"]`),oe=d(`[data-field="ai.defaultVerbosity"]`),S=d(`[data-field="ai.maxOutputTokens"]`),se=d(`[data-field="ai.contextTruncation"]`),C=d(`[data-field="ai.promptCacheRetention"]`),le=d(`[data-field="ai.maxToolCalls"]`),ue=d(`[data-field="ai.parallelToolCalls"]`),fe=d(`[data-field="ai.requestTimeout.low"]`),me=d(`[data-field="ai.requestTimeout.medium"]`),he=d(`[data-field="ai.requestTimeout.high"]`),ge=d(`[data-field="ai.maxRetries"]`),_e=d(`[data-field="ai.shareTargetMode"]`),w=()=>{let e=(g?.value||``).trim()===`custom`;b&&(b.hidden=!e),_&&(_.disabled=!e)};if(g){g.replaceChildren();for(let e of v){let t=document.createElement(`option`);t.value=e,t.textContent=e,g.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,g.append(e),g.addEventListener(`change`,w)}_?.addEventListener(`focus`,()=>{g&&(g.value=`custom`,w())});let ve=d(`[data-field="ai.autoProcessShared"]`),T=d(`[data-field="ai.responseLanguage"]`),ye=d(`[data-field="ai.translateResults"]`),E=d(`[data-field="ai.generateSvgGraphics"]`),D=d(`[data-field="speech.language"]`),be=d(`[data-field="appearance.theme"]`),xe=d(`[data-field="appearance.fontSize"]`),Se=d(`[data-field="appearance.markdown.preset"]`),Ce=d(`[data-field="appearance.markdown.fontFamily"]`),we=d(`[data-field="appearance.markdown.fontSizePx"]`),Te=d(`[data-field="appearance.markdown.lineHeight"]`),Ee=d(`[data-field="appearance.markdown.contentMaxWidthPx"]`),De=d(`[data-field="appearance.markdown.printScale"]`),Oe=d(`[data-field="appearance.markdown.page.size"]`),ke=d(`[data-field="appearance.markdown.page.orientation"]`),je=d(`[data-field="appearance.markdown.page.marginMm"]`),Ne=d(`[data-field="appearance.markdown.modules.typography"]`),Pe=d(`[data-field="appearance.markdown.modules.lists"]`),Fe=d(`[data-field="appearance.markdown.modules.tables"]`),Ie=d(`[data-field="appearance.markdown.modules.codeBlocks"]`),Le=d(`[data-field="appearance.markdown.modules.blockquotes"]`),Re=d(`[data-field="appearance.markdown.modules.media"]`),ze=d(`[data-field="appearance.markdown.modules.printBreaks"]`),Be=d(`[data-field="appearance.markdown.plugins.smartTypography"]`),Ve=d(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),He=d(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),Ue=o.querySelector(`[data-field="appearance.markdown.customCss"]`),We=o.querySelector(`[data-field="appearance.markdown.printCss"]`),O=o.querySelector(`[data-field="appearance.markdown.extensions"]`),Ge=d(`[data-field="core.ntpEnabled"]`),k=d(`[data-field="core.mode"]`),A=d(`[data-field="core.endpointUrl"]`),M=d(`[data-field="core.userId"]`),N=d(`[data-field="core.userKey"]`),P=d(`[data-field="core.ecosystemToken"]`),Je=d(`[data-field="core.preferBackendSync"]`),Ye=d(`[data-field="core.encrypt"]`),Xe=d(`[data-field="core.appClientId"]`),Qe=d(`[data-field="core.allowInsecureTls"]`),$e=d(`[data-field="core.ops.allowUnencrypted"]`),et=d(`[data-field="core.admin.httpsOrigin"]`),F=d(`[data-field="core.admin.httpOrigin"]`),I=d(`[data-field="core.admin.path"]`),ot=d(`[data-field="core.useCoreIdentityForAirPad"]`),B=d(`[data-field="core.socket.accessToken"]`),dt=d(`[data-field="core.socket.routeTarget"]`),pt=d(`[data-field="core.socket.clientAccessToken"]`),ht=d(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),_t=d(`[data-field="shell.maintainHubSocketConnection"]`),yt=d(`[data-field="shell.clipboardBroadcastTargets"]`),xt=d(`[data-field="shell.pushLocalClipboardToLan"]`),Ct=d(`[data-field="shell.clipboardPushIntervalMs"]`),wt=d(`[data-field="shell.enableRemoteClipboardBridge"]`),Tt=d(`[data-field="shell.acceptInboundClipboardData"]`),Dt=d(`[data-field="shell.clipboardInboundAllowIds"]`),kt=d(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),V=d(`[data-field="shell.clipboardShareDestinationIds"]`),H=d(`[data-field="shell.applyRemoteClipboardToDevice"]`),U=d(`[data-field="shell.acceptContactsBridgeData"]`),At=d(`[data-field="shell.acceptSmsBridgeData"]`),jt=d(`[data-field="shell.enableNativeSms"]`),Mt=d(`[data-field="shell.enableNativeContacts"]`),Nt=o.querySelector(`[data-admin-preview]`),W=o.querySelector(`[data-mcp-section]`),G=o.querySelector(`[data-section="extension"]`),K=o.querySelector(`[data-extension-tab]`);if(T){T.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,T.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,T.append(t);for(let e of rt()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,T.append(t)}}if(D){D.replaceChildren();for(let e of nt()){let t=document.createElement(`option`);t.value=e,t.textContent=tt(e),D.append(t)}}o.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&X()}),o.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&X()});let q=e=>{let t=mn(c),n=e||t;o.querySelector(`[data-tab-panel="${n}"]`)||(n=o.querySelector(`[data-tab-panel]`)?.getAttribute(`data-tab-panel`)||t),o.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let r=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(r)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let i=o.querySelectorAll(`[data-tab-panel]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}j(o)};for(let e of o.querySelectorAll(`[data-settings-tabs] button[type="button"][data-action="switch-settings-tab"][data-tab]`))e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),q(e.getAttribute(`data-tab`)||mn(c))});let J=e=>{let t=mn(c),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?u(`markdown`)?`markdown`:t:new Set([...u(`appearance`)?[`appearance`]:[],...u(`markdown`)?[`markdown`]:[],...u(`ai`)?[`ai`]:[],...u(`mcp`)?[`mcp`]:[],...u(`server`)?[`server`]:[],...u(`instructions`)?[`instructions`]:[],...u(`extension`)?[`extension`]:[],...Fn(s)]).has(n)?n:t:t},Y=()=>{let e=P?.value?.trim()||N?.value?.trim()||B?.value?.trim()||``;return{mode:k?.value||`native`,endpointUrl:A?.value?.trim()||``,userId:M?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!Ye?.checked,preferBackendSync:(Je?.checked??!0)!==!1,appClientId:Xe?.value?.trim()||``,allowInsecureTls:!!Qe?.checked,useCoreIdentityForAirPad:(ot?.checked??!0)!==!1,socket:{accessToken:e,routeTarget:dt?.value?.trim()||``,selfId:``,clientAccessToken:pt?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!ht?.checked},admin:{httpsOrigin:et?.value?.trim()||``,httpOrigin:F?.value?.trim()||``,path:I?.value?.trim()||`/`},ops:{allowUnencrypted:!!$e?.checked}}},X=()=>{if(!Nt)return;let e=Ae(Y());Nt.textContent=`Resolved: ${e.https} · ${e.http}`},Z=e=>{try{Ke(qe.EXPLORER_PATH,e),Ze(`explorer`),p({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),a(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),a(`Failed to open Explorer path.`)}};if(Promise.resolve((async()=>((s.surface===`capacitor`||s.surface===`native`)&&await ne().catch(()=>null),(s.surface===`crx`||s.isExtension)&&await ie().catch(()=>null),Mn(()=>re())))()).then(t=>{f&&(f.value=(t?.ai?.baseUrl||``).trim()),m&&(m.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.6-luna`).trim(),r=(t?.ai?.customModel||``).trim();if(g){let e=v.includes(n);n===`custom`||!e&&n?(g.value=`custom`,_&&(_.value=r||n)):(g.value=e?n:`gpt-5.6-luna`,_&&(_.value=r)),w()}if(x&&(x.value=t?.ai?.defaultReasoningEffort||`medium`),oe&&(oe.value=t?.ai?.defaultVerbosity||`medium`),S&&(S.value=String(t?.ai?.maxOutputTokens??4e5)),se&&(se.value=t?.ai?.contextTruncation||`disabled`),C&&(C.value=t?.ai?.promptCacheRetention||`in-memory`),le&&(le.value=String(t?.ai?.maxToolCalls??8)),ue&&(ue.checked=(t?.ai?.parallelToolCalls??!0)!==!1),fe&&(fe.value=String(t?.ai?.requestTimeout?.low??6e4)),me&&(me.value=String(t?.ai?.requestTimeout?.medium??3e5)),he&&(he.value=String(t?.ai?.requestTimeout?.high??9e5)),ge&&(ge.value=String(t?.ai?.maxRetries??2)),_e&&(_e.value=t?.ai?.shareTargetMode||`recognize`),ve&&(ve.checked=(t?.ai?.autoProcessShared??!0)!==!1),T&&(T.value=t?.ai?.responseLanguage||`auto`),ye&&(ye.checked=!!t?.ai?.translateResults),E&&(E.checked=!!t?.ai?.generateSvgGraphics),D&&(D.value=t?.speech?.language||`en-US`),be&&(be.value=t?.appearance?.theme||`auto`),xe&&(xe.value=t?.appearance?.fontSize||`medium`),Se&&(Se.value=t?.appearance?.markdown?.preset||`default`),Ce&&(Ce.value=t?.appearance?.markdown?.fontFamily||`system`),we&&(we.value=String(t?.appearance?.markdown?.fontSizePx??16)),Te&&(Te.value=String(t?.appearance?.markdown?.lineHeight??1.7)),Ee&&(Ee.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),De&&(De.value=String(t?.appearance?.markdown?.printScale??1)),Oe&&(Oe.value=t?.appearance?.markdown?.page?.size||`auto`),ke&&(ke.value=t?.appearance?.markdown?.page?.orientation||`portrait`),je&&(je.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Ne&&(Ne.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),Pe&&(Pe.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Fe&&(Fe.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),Ie&&(Ie.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),Le&&(Le.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),Re&&(Re.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),ze&&(ze.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),Be&&(Be.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),Ve&&(Ve.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),He&&(He.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),Ue&&(Ue.value=(t?.appearance?.markdown?.customCss||``).trim()),We&&(We.value=(t?.appearance?.markdown?.printCss||``).trim()),O){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];O.value=e.length>0?JSON.stringify(e,null,2):``}Ge&&(Ge.checked=!!t?.core?.ntpEnabled),k&&(k.value=t?.core?.mode||`native`),A&&(A.value=(t?.core?.endpointUrl||``).trim()),M&&(M.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();P&&(P.value=e),N&&(N.value=e),B&&(B.value=e)}if(Je&&(Je.checked=(t?.core?.preferBackendSync??!0)!==!1),Ye&&(Ye.checked=!!t?.core?.encrypt),Xe&&(Xe.value=(t?.core?.appClientId||``).trim()),ot&&(ot.checked=(t?.core?.useCoreIdentityForAirPad??!0)!==!1),dt&&(dt.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),pt&&(pt.value=(t?.core?.socket?.clientAccessToken||``).trim()),ht&&(ht.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),Qe&&(Qe.checked=!!t?.core?.allowInsecureTls),$e&&($e.checked=!!t?.core?.ops?.allowUnencrypted),et&&(et.value=(t?.core?.admin?.httpsOrigin||``).trim()),F&&(F.value=(t?.core?.admin?.httpOrigin||``).trim()),I&&(I.value=(t?.core?.admin?.path||`/`).trim()||`/`),_t&&(_t.checked=!!t?.shell?.maintainHubSocketConnection),yt&&(yt.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),xt&&(xt.checked=!!t?.shell?.pushLocalClipboardToLan),Ct){let e=Number(t?.shell?.clipboardPushIntervalMs);Ct.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}wt&&(wt.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),Tt&&(Tt.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),Dt&&(Dt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),kt&&(kt.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),V&&(V.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),H&&(H.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),U&&(U.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),At&&(At.checked=!pe()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),jt&&(jt.checked=!pe()&&(t?.shell?.enableNativeSms??!1)===!0),Mt&&(Mt.checked=(t?.shell?.enableNativeContacts??!0)!==!1),X(),lt(W,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),y(t),ce(t),wn(o,t,s),e.onTheme?.(t?.appearance?.theme||`auto`),pe()&&l(()=>import(`./cws-bridge-CRDA1GOm.js`).then(e=>(e.a(),e.n)).then(e=>e.invokeCwsNative(`app:info`,{})),[],import.meta.url).then(e=>{let t=e?.echo||{},n=o.querySelector(`[data-apk-local-version]`);if(!n)return;let r=String(t?.signatureSha256||``).slice(0,12),i=e;n.textContent=`Installed: ${t?.versionName||i?.versionName||`?`} (${t?.versionCode??i?.versionCode??`?`})`+(r?` · sig ${r}…`:``)}).catch(()=>{})}).catch(()=>{lt(W,[])}),h?.addEventListener(`change`,()=>{!m||!h||(m.type=h.checked?`text`:`password`)}),be?.addEventListener(`change`,()=>{let t=be.value||`auto`;(async()=>{try{let e=await re();ce({...e,appearance:{...e.appearance||{},theme:t}})}catch{ce({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),o.addEventListener(`click`,t=>{let n=at(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&W){W.querySelector(`.mcp-empty-note`)?.remove(),W.appendChild(st({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),W&&!W.querySelector(`[data-mcp-id]`)&&lt(W,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){Z(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){Z(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){Me(Y(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){Me(Y(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=Ae(Y());navigator.clipboard?.writeText?.(e.https).then(()=>a(`HTTPS admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=Ae(Y());navigator.clipboard?.writeText?.(e.http).then(()=>a(`HTTP admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){l(()=>import(`./cwsp-app.js`).then(e=>(e.j(),e.A)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>a(`App settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){l(()=>import(`./cwsp-app.js`).then(e=>(e.j(),e.A)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>a(`Notification settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}let i=n?.closest?.(`button[data-action="crx-control-pair"]`),c=n?.closest?.(`button[data-action="crx-control-unpair"]`);if(i||c){(async()=>{let e=o.querySelector(`[data-crx-control-status]`),t=()=>{try{globalThis.chrome?.runtime?.sendMessage?.({type:`cwsp-control-session-changed`})}catch{}};try{let n=await l(()=>import(`./crx-control-session--61Cvgg2.js`),[],import.meta.url);if(c){await n.clearCrxControlSession(),e&&(e.textContent=await n.formatCrxControlSessionStatus()),a(`Control unpaired — Copy & Share / Paste by CWSP disabled.`,{tone:`warn`}),t();return}let r=String(o.querySelector(`[data-field="shell.localHubUrl"]`)?.value||``).trim(),i=String(document.documentElement.dataset.cwspControlOrigin||``).trim();e&&(e.textContent=`Control: waiting for pairing dialog…`),a(`Enter public token + device code in the pairing dialog…`);let s=await n.pairCrxControlWithModal({localHubUrl:r,preferredOrigins:i?[i]:[]});if(s.cancelled){e&&(e.textContent=await n.formatCrxControlSessionStatus()),a(`Pairing cancelled.`);return}e&&(e.textContent=s.ok?await n.formatCrxControlSessionStatus():`Control: ${s.error}`),s.ok?(a(`Paired Control at ${s.session.controlHost} (persistent).`),t()):a(s.error,{tone:`warn`})}catch(e){a(`Control pairing unavailable: ${e instanceof Error?e.message:String(e)}`,{tone:`warn`})}})();return}let d=n?.closest?.(`button[data-action="control-pairing-refresh"]`),p=n?.closest?.(`button[data-action="control-public-token-regenerate"]`);if(d||p){let e=!!t?.isTrusted;(async()=>{try{let t=String(location.hostname||``);if(location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`){e&&a(`Pairing codes are shown on the device (phone/desk), not in the public Control SPA.`,{tone:`warn`});return}}catch{}let t=o.querySelector(`input[data-control-device-code], [data-control-device-code]`),n=o.querySelector(`input[data-control-public-token], [data-control-public-token]`),r=o.querySelector(`[data-secret-meta="control-device-code"]`),i=o.querySelector(`[data-secret-meta="control-public-token"]`),s=e=>{let a=String(e.deviceCode||``).trim(),o=Math.max(1,Math.round(Number(e.expiresInMs||0)/1e3)),s=String(e.publicToken||``).trim();t instanceof HTMLInputElement?t.value=a:t&&(t.textContent=a?`Code: ${a} (${o}s)`:`Code: …`),n instanceof HTMLInputElement?n.value=s:n&&(n.textContent=s?`Public token: ${s}`:`Public token: …`),r&&(r.textContent=a?`Expires in ${o}s`:``),i&&(i.textContent=s?`Stable until regenerated`:``)};try{e&&a(p?`Regenerating public token…`:`Refreshing pairing code…`,{tone:`warn`});try{let{invokeCwsNative:t}=await l(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CRDA1GOm.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),n=await t(p?`control:public-token:regenerate`:`control:pairing:status`,{}),r=n?.controlPairing||n?.echo||{};if(r?.deviceCode||r?.publicToken){s(r),e&&a(p?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`});return}}catch{}let t=globalThis,n=Number(t.__CWSP_CONTROL_PORT__||29110)||29110,r=String(t.__CWSP_CONTROL_API_KEY__||`cwsp-neutralino-local`).trim(),i=await fetch(`http://127.0.0.1:${n}${p?`/service/pair/regenerate-public-token`:`/service/pair/display`}`,{method:p?`POST`:`GET`,headers:{Accept:`application/json`,"Content-Type":`application/json`,"X-API-Key":r},body:p?`{}`:void 0});if(!i.ok)throw Error(`Control HTTP ${i.status}`);s(await i.json()),e&&a(p?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`})}catch(t){e&&a(String(t?.message||t||`Pairing status unavailable`),{tone:`err`})}})();return}let h=n?.closest?.(`button[data-action="apk-update-check"]`),v=n?.closest?.(`button[data-action="apk-update-install"]`);if(h||v){let e=v?`app:update:install`:`app:update:check`;(async()=>{a(v?`Downloading APK…`:`Checking for update…`,{tone:`warn`});try{let t=await re(),n=o.querySelector(`[data-field="shell.apkUpdateSource"]`),r=o.querySelector(`[data-field="core.endpointUrl"]`),i=o.querySelector(`[data-field="core.ecosystemToken"]`),s=o.querySelector(`[data-field="core.allowInsecureTls"]`),c=o.querySelector(`[data-apk-local-version]`),u=(n?.value||t.shell?.apkUpdateSource||`wan`).trim(),d=(r?.value||t.core?.endpointUrl||``).trim(),f=(i?.value||``).trim()||ee(t),p=s?.checked??!!t.core?.allowInsecureTls,{invokeCwsNative:m}=await l(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CRDA1GOm.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),h=await m(e,{source:u,endpointUrl:d,token:f,ecosystemToken:f,allowInsecureTls:p}),g=h?.echo||h?.envelope?.payload||{},_=g?.error||h?.error||(!h?.ok&&!h?.echo?`update failed`:``);if(_){a(String(_),{tone:`err`});return}if(c&&(g?.localVersionCode!=null||g?.localVersionName)){let e=String(g?.localSignatureSha256||``).slice(0,12);c.textContent=`Installed: ${g.localVersionName||`?`} (${g.localVersionCode??`?`})`+(e?` · sig ${e}…`:``)}if(v){a(g?.launchedInstaller?`Installer launched — confirm on the system prompt.`:`Install request sent.`,{tone:`ok`});return}let y=g?.localVersionCode??`?`,b=g?.remoteVersionCode??`?`,x=g?.updateAvailable===!0;if(g?.signatureCompatible===!1){a(`Signature mismatch — remote APK not signed like this install (local ${y}, remote ${b}).`,{tone:`err`});return}a(x?`Update available: ${y} → ${b} (${g?.remoteVersionName||`?`}).`:`Up to date (local ${y}, remote ${b}).`,{tone:x?`warn`:`ok`})}catch(e){a(String(e?.message||e),{tone:`err`})}})();return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{a(`Saving…`,{tone:`warn`});let t=await re(),n=t.appearance?.markdown?.extensions||[],r=u(`markdown`)&&O?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){q(`markdown`),a(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:u(`ai`)?{baseUrl:f?.value?.trim?.()||``,apiKey:m?.value?.trim?.()||``,model:g?.value||`gpt-5.6-luna`,customModel:g?.value===`custom`&&_?.value?.trim?.()||``,defaultReasoningEffort:x?.value||`medium`,defaultVerbosity:oe?.value||`medium`,maxOutputTokens:L(S?.value,4e5),contextTruncation:se?.value||`disabled`,promptCacheRetention:C?.value||`in-memory`,maxToolCalls:L(le?.value,8),parallelToolCalls:(ue?.checked??!0)!==!1,requestTimeout:{low:L(fe?.value,6e4),medium:L(me?.value,3e5),high:L(he?.value,9e5)},maxRetries:L(ge?.value,2),shareTargetMode:_e?.value||`recognize`,autoProcessShared:(ve?.checked??!0)!==!1,responseLanguage:T?.value||`auto`,translateResults:!!ye?.checked,generateSvgGraphics:!!E?.checked,mcp:u(`mcp`)?ct(W):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:u(`ai`)?{language:D?.value||`en-US`}:t.speech||{},core:u(`server`)?{...t.core,ntpEnabled:z(Ge,!!t.core?.ntpEnabled),mode:R(k,t.core?.mode||`native`)||`native`,endpointUrl:R(A,t.core?.endpointUrl||``),userId:R(M,t.core?.userId||``),ecosystemToken:R(P,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||R(N,t.core?.userKey||``)||R(B,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:R(P,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||R(N,t.core?.userKey||``)||R(B,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:z(Ye,!!t.core?.encrypt),preferBackendSync:z(Je,(t.core?.preferBackendSync??!0)!==!1),appClientId:R(Xe,t.core?.appClientId||``),allowInsecureTls:z(Qe,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:z(ot,(t.core?.useCoreIdentityForAirPad??!0)!==!1),socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=R(P,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||R(N,t.core?.userKey||``)||R(B,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:R(dt,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:R(pt,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:z(ht,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:R(et,t.core?.admin?.httpsOrigin||``),httpOrigin:R(F,t.core?.admin?.httpOrigin||``),path:R(I,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:z($e,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:u(`server`)?{...t.shell||{},maintainHubSocketConnection:z(_t,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:R(yt,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:z(xt,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=Ct?.value,n=L(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:z(wt,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:z(Tt,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:R(Dt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:z(kt,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:R(V,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:z(H,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:z(U,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!pe()&&z(At,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!pe()&&z(jt,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:z(Mt,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:u(`appearance`)||u(`markdown`)?{theme:be?.value||`auto`,fontSize:xe?.value||`medium`,markdown:{preset:Se?.value||`default`,fontFamily:Ce?.value||`system`,fontSizePx:L(we?.value,16),lineHeight:it(Te?.value,1.7,1.1,2.2),contentMaxWidthPx:L(Ee?.value,860),printScale:it(De?.value,1,.5,1.5),page:{size:Oe?.value||`auto`,orientation:ke?.value||`portrait`,marginMm:L(je?.value,12)},modules:{typography:(Ne?.checked??!0)!==!1,lists:(Pe?.checked??!0)!==!1,tables:(Fe?.checked??!0)!==!1,codeBlocks:(Ie?.checked??!0)!==!1,blockquotes:(Le?.checked??!0)!==!1,media:(Re?.checked??!0)!==!1,printBreaks:(ze?.checked??!0)!==!1},plugins:{smartTypography:!!Be?.checked,softBreaksAsBr:!!Ve?.checked,externalLinksNewTab:(He?.checked??!0)!==!1},customCss:Ue?.value||``,printCss:We?.value||``,extensions:n||[]}}:t.appearance||{}};Tn(o,i,s),await Ln(i);let c=i,d=s.surface===`capacitor`||s.surface===`native`?de(c).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),p=await ae(c);if(!p){a(`Settings save returned no data.`,{tone:`err`});return}try{await Pn(o,p,s)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e);let t=e instanceof Error?e.message:String(e);if(/pairing|unauthorized|401|403|Control/i.test(t)){a(t,{tone:`warn`});return}}wn(o,p,s);let h=te(),ee=await d,v=ee.lines,y=ee.results.some(e=>e.granted===!1);l(()=>import(`./cwsp-app.js`).then(e=>(e.S(),e.x)).then(async e=>{let t=!1;try{t=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cwsp-control`||/^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname||``))}catch{t=!1}if(t){try{globalThis.__CWSP_CONTROL_BRIDGE_LIVE__||console.warn(`[Settings] Control not paired — settings saved locally only; pair to push to device`)}catch{}return}if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis;if(e.__CWS_NODE_CLIPBOARD_HUB__===!1)return;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.host||`127.0.0.1`).trim()||`127.0.0.1`;if(n===8434&&r!==`127.0.0.1`&&r!==`localhost`||n!==29110)return;let i=String(t?.key||`cwsp-neutralino-local`),a=p.core,o=String(a?.ecosystemToken||a?.userKey||a?.socket?.accessToken||``).trim(),s={};a?.endpointUrl&&(s.remoteHost=String(a.endpointUrl).trim()),o&&(s.accessToken=o,s.clientToken=o),a?.userId&&(s.clientId=String(a.userId).trim()),s.force=!0,await fetch(`http://${r}:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":i},body:JSON.stringify(s),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await l(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-CRDA1GOm.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(p),l(()=>import(`./cwsp-app.js`).then(e=>(e.E(),e.k)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),ce(p),e.onTheme?.(p.appearance?.theme||`auto`);let b=[`Saved locally`];h.nativeSynced===!0?b.push(`synced to Android`):h.nativeSynced===!1&&!y?console.warn(`[Settings] native settings patch:`,h.nativeError||`not confirmed`):h.nativeSynced===!1&&b.push(`native sync failed${h.nativeError?`: ${h.nativeError}`:``}`),h.webnativeSynced===!0?b.push(`synced to Node backend`):h.webnativeSynced===!1&&b.push(`Node sync failed${h.webnativeError?`: ${h.webnativeError}`:``}`),v.length&&b.push(...v);let ne=`ok`;(y||h.webnativeSynced===!1)&&(ne=`warn`),a(b.join(` · `),{tone:ne})})().catch(e=>a(String(e),{tone:`err`}))}),e.isExtension){G&&(G.hidden=!1),K&&(K.hidden=!1);let e=t`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;o.append(e)}let Q=J(e.initialTab);if(q(Q),!o.querySelector(`[data-tab-panel="${Q}"]:not([hidden])`)){let e=o.querySelector(`[data-tab-panel]`);e&&q(e.getAttribute(`data-tab-panel`)||Q)}w();let $=o.querySelectorAll(`[data-tab-panel]`).length,Pt=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${c} surface=${s.surface} tabs=${Pt} panels=${$} active=${o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if($===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,o.querySelector(`.settings-screen__body`)?.appendChild(e),q(`cwsp`)}return o.addEventListener(`cwsp-settings-resync`,()=>{j(o),q(o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Q)}),o}}));function Vn(e){return new Un(e)}var Hn,Un;e((()=>{r(),a(),Ve(),M(),Bn(),G(),Rn(),Se(),c(),Hn={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Un=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=n(Hn);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id;return this.element=zn({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>j(this.element)),this.element}getToolbar(){return null}setupEventHandlers(){}loadSettings(){this.settings.value={...Hn}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...Hn},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){j(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(s(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===He.Patch||e===He.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([l(()=>import(`./Settings-CzQ1lgp1.js`).then(e=>(e.a(),e.t)),[],import.meta.url),l(()=>import(`./cwsp-app.js`).then(e=>(e.F(),e.N)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}}))();export{Un as SettingsView,wn as applyContributions,Ce as clearSettingsSyncArms,Tn as collectContributions,ye as createMemorySettingsSyncArm,zn as createSettingsView,Vn as createView,Vn as default,xe as detectSettingsSurface,U as getSettingsContributions,ve as getSettingsDefaults,fe as getSettingsSnapshot,E as getSettingsSync,Nn as hydrateContributionsFromSync,me as mergeSettingsPatch,Sn as mountContributions,T as patchSettingsSync,Pn as persistContributionsViaSync,Lt as registerAirpadSettingsContribution,sn as registerBuiltinSettingsContributions,Zt as registerCwspSettingsContribution,$t as registerDeviceSettingsContribution,tn as registerReaderSettingsContribution,H as registerSettingsContribution,we as registerSettingsSyncArm,rn as registerWorkcenterSettingsContribution,yn as resolveSettingsSurface,he as resolveSettingsSyncArm,ge as setSurfaceDetector,D as unregisterSettingsSyncArm};