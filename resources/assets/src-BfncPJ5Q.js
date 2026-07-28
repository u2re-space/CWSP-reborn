import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Rt as n,Tt as r,a as i,en as a,jt as o}from"./HistoryManager-DVqS4qoS.js";import{a as s,c,d as l,f as u,l as d,u as f}from"./registry-DBV7KaK9.js";import{n as p,t as m}from"./preload-helper-NDuSAHbO.js";import{n as h,t as g}from"./templates-Cp6qXLQ6.js";import{a as _,d as v}from"./UnifiedMessaging-CchHDprR.js";import{a as ee,i as y,r as b}from"./BootLoader-CEIeNoRB.js";import{B as te,K as ne}from"./airpad-cwsp-client-parity-CXnZuSSw.js";import{t as x}from"./src-yMca1J0Q.js";import{a as re,i as ie,r as S,t as ae}from"./SettingsTypes-D6q9S6cT.js";import{t as oe,v as se}from"./remote-connection-runtime-LZGft3kg.js";import{a as ce,c as le,i as ue,n as C,o as de,r as fe,s as pe}from"./Settings-DP2WRv9J.js";import{n as me,r as he}from"./Theme-COkKQ-CU.js";import{n as ge,r as _e}from"./capacitor-permissions-Brl6YLsA.js";import{a as ve,c as w,d as ye,f as T,i as be,l as xe,n as E,o as D,p as Se,r as Ce,s as we,t as Te,u as Ee}from"./cwsp-app.js";import{a as De,n as Oe,o as ke,s as Ae}from"./shells-C8GzwuHo.js";import{i as je,n as Me,r as Ne}from"./admin-doors-BoU4RSfd.js";import{c as Pe,i as Fe,l as Ie,n as Le,o as Re,r as ze,s as Be}from"./CustomInstructions-Clv5bJpE.js";import{i as Ve,n as He}from"./registry-AeNvqj7m.js";import{a as Ue,r as We}from"./channel-actions-DC9DgSYV.js";var Ge=e((()=>{})),O,Ke,k,A,j,M=e((()=>{Ge(),O=`data-settings-view-css`,Ke=e=>{let t=String(e||``).trim(),n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},k=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch}
.view-settings [data-tab-panel]:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important}
.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select{pointer-events:auto!important}
`,A=e=>{if(!e?.classList?.contains(`view-settings`)||e.querySelector(`style[${O}]`))return;let t=Ke(`/* Settings view — self-contained stylesheet.
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
}`);t.trim()||(t=k);let n=document.createElement(`style`);n.setAttribute(O,``),n.textContent=t,e.insertBefore(n,e.firstChild)},j=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}A(e)};e.isConnected?A(e):requestAnimationFrame(t)}}));function qe(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var N,P,F=e((()=>{N={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`},P=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}},new P(`rs-workcenter`,`data`),new P(`rs-history`,`entries`),new P(`rs-settings`,`config`)})),Je=e((()=>{F()}));function Ye(e){De();let t=Ae(`/`);if(e.params&&Object.keys(e.params).length>0){let n=new URLSearchParams(e.params).toString();t+=(t.includes(`?`)?`&`:`?`)+n}return t}function Xe(e,t={}){let n=Ye(e);t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function Ze(e,t){Xe({view:e,params:t})}var Qe=e((()=>{b(),f(),ke(),[...d],u(`home`,c)})),$e=e((()=>{})),et=e((()=>{Ve(),Oe(),s(),s(),He(),Qe(),b(),b(),$e()})),I,tt,L,nt,rt,R,it,z,B,at,V=e((()=>{I=[`en`,`ru`,`en-GB`,`en-US`],tt=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,L=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},nt=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=L(n);t&&e.add(t)}for(let t of I)e.add(t);return Array.from(e)},rt=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},R=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},it=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},z=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},B=(e,t)=>e?!!e.checked:t,at=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})),ot,st,ct,lt=e((()=>{x(),ot=e=>{let t={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return i`<div class="field mcp-row" data-mcp-id=${t.id}>
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
          </div>`},st=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},ct=(e,t)=>{if(!e)return;e.replaceChildren();let n=Array.isArray(t)?t:[];if(!n.length){e.appendChild(i`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}n.forEach(t=>e.appendChild(ot(t)))}})),ut,dt=e((()=>{x(),ut=()=>i`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})),ft,pt=e((()=>{x(),ft=()=>i`<header class="settings-screen__top">
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
    </header>`})),mt,ht=e((()=>{x(),mt=()=>i`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
    </section>`})),gt,_t=e((()=>{x(),gt=()=>i`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`})),vt,yt=e((()=>{x(),vt=()=>i`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`})),bt,xt=e((()=>{x(),bt=()=>i`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})),St,Ct=e((()=>{x(),St=()=>i`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`})),wt,Tt=e((()=>{x(),r(),Be(),h(),wt=(e={})=>{let n=t({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),r=i`<div class="custom-instructions-editor">
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
    </div>`,a=r.querySelector(`[data-list]`),o=r.querySelector(`[data-action='select-active']`),s=r.querySelector(`[data-add-form]`),c=r.querySelector(`[data-field='label']`),l=r.querySelector(`[data-field='instruction']`),u=()=>{a.replaceChildren();let t=n.instructions??[];if(!t.length){a.append(i`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let r of t){let t=n.editingId===r.id,o=n.activeId===r.id,s=i`<div class="ci-item ${o?`active`:``}" data-id="${r.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${r.label}</span>
                    <div class="ci-item-actions">
                        ${o?i`<span class="ci-badge active">Active</span>`:i`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${t?i`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${r.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${r.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:i`<div class="ci-item-preview">${f(r.instruction,120)}</div>`}
            </div>`;s.addEventListener(`click`,t=>{let i=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(i===`activate`&&Pe(r.id).then(p).then(()=>e.onUpdate?.()),i===`edit`&&(n.editingId=r.id,u()),i===`delete`&&confirm(`Delete "${r.label}"?`)&&Fe(r.id).then(p).then(()=>e.onUpdate?.()),i===`save-edit`){let t=s.querySelector(`[data-edit-field='label']`),i=s.querySelector(`[data-edit-field='instruction']`);Ie(r.id,{label:t.value.trim()||r.label,instruction:i.value.trim()}).then(()=>(n.editingId=null,p())).then(()=>e.onUpdate?.())}i===`cancel-edit`&&(n.editingId=null,u())}),a.append(s)}},d=()=>{o.replaceChildren(),o.append(i`<option value="">None (use default)</option>`);for(let e of n.instructions??[]){let t=i`<option value="${e.id}">${e.label}</option>`;e.id===n.activeId&&(t.selected=!0),o.append(t)}},f=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,p=async()=>{let e=await Re(),t=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;n.instructions=t?.instructions??[],n.activeId=t?.activeId??``,u(),d()};return r.addEventListener(`click`,t=>{let r=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(n.isAdding=!0,s.hidden=!1,c.value=``,l.value=``,c.focus()),r===`cancel-add`&&(n.isAdding=!1,s.hidden=!0),r===`save-new`){let t=c.value.trim(),r=l.value.trim();if(!r){l.focus();return}Le(t||`Custom`,r).then(e=>{if(e)return n.isAdding=!1,s.hidden=!0,p()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let t=new Set((n.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=g.filter(e=>!t.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}ze(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(p).then(()=>e.onUpdate?.())}}),o.addEventListener(`change`,()=>{Pe(o.value||null).then(p).then(()=>e.onUpdate?.())}),p(),r}})),Et,Dt=e((()=>{x(),Tt(),Et=e=>i`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${wt({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})),Ot,kt=e((()=>{x(),Ot=()=>i`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
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
    </section>`})),H,U,W,At,jt,Mt,G,Nt,K=e((()=>{H=new Map,U=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return H.set(t,n),()=>{H.get(t)===n&&H.delete(t)}},W=()=>[...H.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),At=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},jt=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},Mt=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},G=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=At(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},Nt=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=Mt(e);r!==void 0&&jt(n,t,r)})}})),q,Pt,J,Y,X,Z,Q,$,Ft,It,Lt=e((()=>{q=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},Pt=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},J=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},Y=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},X=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},Z=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},Q=(e,t,n)=>{let r=document.createElement(`button`);return r.type=`button`,r.className=n?.className||(n?.primary?`view-settings__btn view-settings__btn--primary`:`view-settings__btn`),r.setAttribute(`data-action`,t),r.textContent=e,r},$=(...e)=>{let t=document.createElement(`div`);t.className=`field settings-action-row`,t.style.display=`flex`,t.style.flexWrap=`wrap`,t.style.gap=`0.5rem`;for(let n of e)t.appendChild(n);return t},Ft=(e,t,n)=>{let r=document.createElement(`div`);r.className=`field settings-secret-field`,r.setAttribute(`data-secret-field`,t);let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`div`);a.style.cssText=`display:flex;gap:.4rem;align-items:center;margin-top:.3rem;`;let o=document.createElement(`input`);o.className=`form-input`,o.type=`password`,o.readOnly=!0,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=n?.placeholder||`••••••`,o.setAttribute(`data-${t}`,`1`),o.setAttribute(`data-secret-input`,t),o.value=``,n?.mono?(o.style.fontFamily=`ui-monospace, SFMono-Regular, Menlo, monospace`,o.style.fontSize=`0.9rem`,o.style.letterSpacing=`0.04em`):(o.style.fontSize=`1.15rem`,o.style.fontWeight=`700`,o.style.letterSpacing=`0.12em`),o.style.flex=`1 1 auto`,o.style.minWidth=`0`;let s=document.createElement(`button`);s.type=`button`,s.className=`view-settings__btn`,s.textContent=`View`,s.title=`Show / hide`,s.setAttribute(`data-action`,`control-secret-toggle`),s.setAttribute(`data-secret-for`,t);let c=document.createElement(`button`);c.type=`button`,c.className=`view-settings__btn`,c.textContent=`Copy`,c.title=`Copy to clipboard`,c.setAttribute(`data-action`,`control-secret-copy`),c.setAttribute(`data-secret-for`,t);let l=document.createElement(`p`);l.className=`field-hint`,l.setAttribute(`data-secret-meta`,t),l.style.margin=`0.2rem 0 0`,l.textContent=``;let u=()=>{let e=o.dataset.revealed===`1`;o.type=e?`text`:`password`,s.textContent=e?`Hide`:`View`};return s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),o.dataset.revealed=o.dataset.revealed===`1`?`0`:`1`,u()}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=String(o.value||``).trim();if(t)try{await navigator.clipboard.writeText(t);let e=c.textContent;c.textContent=`Copied`,window.setTimeout(()=>{c.textContent=e||`Copy`},1200)}catch{o.type=`text`,o.select();try{document.execCommand(`copy`)}catch{}u()}}),a.append(o,s,c),r.append(i,a,l),r},It=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(Pt(e)):r.appendChild(e);return r}})),Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt=e((()=>{K(),S(),Lt(),p(),Rt=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,zt=`L-110`,Bt=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),Vt=(...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!Bt(e))return e}return zt},Ht=e=>{let t=e.surface===`crx`||!!e.isExtension,n=[q(t?`CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field.`:`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,J(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434;https://45.147.121.152:8434`),q(t?`Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control).`:"Coordinator / gateway. Multi-hub: separate with `;` or `,` (never `:`). Always include :8434 — bare host dials :443 where /ws is not served (404)."),J(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),q(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`)];return t?n.push(J(`Client id (Neutralino / backend)`,`shell.clientId`,`L-110`),q(`Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx).`)):n.push(J(`Client id`,`core.userId`,`L-196 or L-110`),q(`Short fleet id (L-196, L-210, …).`)),n.push(J(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),q(t?`Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login).`:`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),J(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),q(Rt),X(`Allow insecure TLS`,`core.allowInsecureTls`)),n},Ut=()=>[`Clipboard`,X(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),X(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),J(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),q(Rt),J(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),q(Rt),`Clipboard prompt`,Z(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),Z(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),X(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),X(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),Y(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),q(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],Wt=e=>{let t=[`Files transfer`,q("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),X(`Accept inbound files`,`shell.acceptInboundFilesData`),J(`Default destination ids`,`shell.filesShareDestinationIds`,`L-196;L-210 (empty = picker)`),q(Rt),X(`Allow share to all (*)`,`shell.filesAllowShareToAll`),q(`SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out.`),Z(`Open for share`,`shell.filesOpenForShareMode`,[[`auto`,`Auto — offer when destinations are set`],[`manual`,`Manual — always ask for destinations`]]),Z(`Inbound accept`,`shell.filesInboundMode`,[[`ask`,`Ask — Accept / Decline prompt`],[`auto`,`Auto — accept into landing folder`]]),X(`Copy received files to clipboard (for Paste / re-share)`,`shell.filesCopyOnReceive`),q(`Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default.`),Z(`Byte transport hint`,`shell.filesByteTransport`,[[`auto`,`Auto — receiver chooses`],[`http`,`HTTP blob GET/PUT`],[`ws`,`WebSocket chunks`]]),q(`Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.`)];if(e.surface===`capacitor`||e.surface===`native`){let e=document.createElement(`p`);e.className=`field-hint`,e.setAttribute(`data-files-saf-uri`,`1`),e.textContent=`SAF folder: (not set)`;let n=document.createElement(`p`);n.className=`field-hint`,n.setAttribute(`data-files-storage-paths`,`1`),n.style.whiteSpace=`pre-wrap`,n.textContent=`Staging / landing paths: tap Show paths.`,t.push(`Files storage (Capacitor)`,Z(`Save received files to`,`shell.filesLandingMode`,[[`app`,`App storage (private — default)`],[`downloads`,`Downloads (user-visible)`],[`saf`,`SAF folder (pick below)`]]),q(`App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README.`),e,$(Q(`Choose SAF folder`,`files-storage-pick-saf`,{primary:!0}),Q(`Clear SAF folder`,`files-storage-clear-saf`)),X(`Ask for folder every time if SAF unset`,`shell.filesAskDirEveryTime`),Z(`Temp staging place`,`shell.filesStagingRoot`,[[`app`,`App internal (files/) — default`],[`cache`,`App cache (may be purged)`],[`external`,`App external (Android/data/… — OEM may hide)`]]),q(`Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above.`),n,$(Q(`Show paths`,`files-storage-show-paths`),Q(`Browse CWSP Files…`,`files-storage-open-explorer`),Q(`Share README…`,`files-storage-share-readme`)),`File access permissions`,(()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-files-perm-status`,`1`),e.style.whiteSpace=`pre-wrap`,e.textContent=`Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.`,e})(),$(Q(`Refresh status`,`files-storage-perm-status`),Q(`Request media access`,`files-storage-request-media`,{primary:!0}),Q(`Allow manage all files…`,`files-storage-request-all-files`)),q(`All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish.`))}return t},Gt=()=>[`Native wire (Capacitor)`,X(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),X(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],Kt=()=>[`Control pairing`,Ft(`Public token`,`control-public-token`,{mono:!0,placeholder:`••••••••••••`}),Ft(`Device code (20s, +10s grace)`,`control-device-code`,{placeholder:`••••••`}),$(Q(`Refresh code`,`control-pairing-refresh`),Q(`Regenerate public token`,`control-public-token-regenerate`)),q(`Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.`)],qt=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-crx-control-status`,`1`),e.textContent=`Control: …`,[`Control pairing`,e,$(Q(`Pair Control…`,`crx-control-pair`,{primary:!0}),Q(`Unpair`,`crx-control-unpair`)),q(`Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.`)]},Jt=()=>{try{let e=globalThis;if(e.NL_OS!=null||e.NL_PORT!=null||e.Neutralino||e.Capacitor?.isNativePlatform?.())return!1;let t=String(e.Capacitor?.getPlatform?.()||``).toLowerCase();if(t===`android`||t===`ios`)return!1;let n=String(location.hostname||``).toLowerCase();return!n||n===`localhost`||n===`127.0.0.1`||n===`[::1]`?!1:location.protocol===`https:`}catch{return!1}},Yt=()=>[`Device`,X(`Start CWSP on boot`,`shell.autoStartOnBoot`),X(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),X(`Allow Control API`,`shell.allowControlApi`),q(`Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password.`),...Kt(),X(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),X(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),q(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],Xt=()=>{let e=document.createElement(`p`);return e.className=`field-hint`,e.setAttribute(`data-apk-local-version`,`1`),e.textContent=`Installed version: … (tap Check to refresh)`,[`App update (dev)`,e,Z(`Update source`,`shell.apkUpdateSource`,[[`wan`,`WAN — https://45.147.121.152:8434`],[`lan`,`LAN — https://192.168.0.200:8434`],[`relay`,`Current Relay (core.endpointUrl)`]]),$(Q(`Check for update`,`apk-update-check`),Q(`Download & install`,`apk-update-install`,{primary:!0})),q("Uses ecosystem token (X-API-Key) against /releases/android. Install requires the same APK signing certificate as the installed app. Each `npm run build:capacitor` auto-bumps VERSION_CODE and restages the gateway release.")]},Zt=()=>U({id:`cwsp`,label:`CWSP`,order:55,excludeSurfaces:[`markdown`],render:e=>{let t=[...Ht(e),...Ut(),...Wt(e)];return e.surface===`capacitor`||e.surface===`native`?t.push(...Gt(),...Yt(),...Xt()):e.surface===`crx`||e.isExtension?t.push(...qt()):Jt()||t.push(...Gt(),...Kt()),It(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=re(e));let r=t.querySelector(`[data-field="shell.clientId"]`);if(r){let t=Vt(r.value,e.shell?.clientId,e.core?.userId);r.value=t,e.shell={...e.shell||{},clientId:t}}let i=t.querySelector(`[data-field="shell.apkUpdateSource"]`);if(i){let t=String(e.shell?.apkUpdateSource||`wan`).trim();i.value=t===`lan`||t===`relay`?t:`wan`}let a=t.querySelector(`[data-files-saf-uri]`);if(a){let t=String(e.shell?.filesIncomingDir||``).trim();a.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`}let o=t.querySelector(`button[data-action="control-pairing-refresh"]`);if(o){queueMicrotask(()=>o.click());let e=Number(t.__cwspPairTimer||0);e&&clearInterval(e),t.__cwspPairTimer=window.setInterval(()=>{t.isConnected&&o.click()},2500)}let s=t.querySelector(`[data-crx-control-status]`);s&&m(()=>import(`./crx-control-session--61Cvgg2.js`).then(e=>e.formatCrxControlSessionStatus()),[],import.meta.url).then(e=>{s.isConnected&&(s.textContent=e)}).catch(()=>{s.textContent=`Control: status unavailable`})},save:e=>{ie(e),Bt(e.shell?.clientId)&&(e.shell={...e.shell||{},clientId:Vt(e.core?.userId)})}})})),$t,en=e((()=>{$t=()=>()=>void 0})),tn,nn=e((()=>{K(),Lt(),tn=()=>U({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>It(`reader`,`Reader`,[Y(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),X(`Wrap long lines`,`views.reader.wrapLongLines`)])})})),rn,an=e((()=>{K(),Lt(),rn=()=>U({id:`workcenter`,label:`Work Center`,order:65,requiresView:`workcenter`,render:()=>It(`workcenter`,`Work Center`,[X(`Auto-run pinned tasks`,`views.workcenter.autoRunPinned`),J(`Default instruction id`,`views.workcenter.defaultInstructionId`,`(none)`)])})})),on,sn,cn=e((()=>{Qt(),en(),nn(),an(),on=!1,sn=()=>{on||(on=!0,Zt(),tn(),rn(),$t())}})),ln,un,dn,fn,pn,mn,hn,gn=e((()=>{f(),ln=e=>e.isExtension||e.surface===`crx`?`extension`:e.surface===`markdown`?`markdown`:(e.surface===`capacitor`||e.surface===`native`)&&!(l(`workcenter`)||l(`viewer`)||l(`explorer`))?`cwsp-mobile`:`full`,un=[`appearance`,`markdown`,`ai`,`mcp`,`server`,`instructions`,`extension`],dn=[`extension`,`server`],fn=[`server`,`extension`],pn=(e,t)=>{let n=t===`cwsp-mobile`?un:t===`extension`?dn:t===`markdown`?fn:null;if(n)for(let t of n)e.querySelector(`[data-tab-panel="${t}"]`)?.remove(),e.querySelector(`[data-action="switch-settings-tab"][data-tab="${t}"]`)?.remove()},mn=e=>e===`cwsp-mobile`?`cwsp`:e===`extension`?`crx`:e===`markdown`?`markdown`:`ai`,hn=(e,t)=>!!e.querySelector(`[data-tab-panel="${t}"]`)})),_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn=e((()=>{S(),f(),K(),cn(),te(),we(),gn(),p(),_n=`[data-settings-tabs]`,vn=`.settings-screen__body`,yn=()=>{try{let e=globalThis;if(e?.chrome?.runtime?.id)return`crx`;if(e?.Capacitor?.isNativePlatform?.()||e?.Capacitor?.getPlatform?.()===`android`||e?.Capacitor?.getPlatform?.()===`ios`)return`capacitor`;if(e?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`&&String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cw-markdown`)return`markdown`;if(typeof document<`u`)return`web`}catch{}return`unknown`},bn=(e,t)=>{if(e.requiresView&&!l(e.requiresView))return!1;let n=e.surfaces;return!(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface))},xn=e=>W().filter(t=>bn(t,e)),Sn=(e,t)=>{let n=e.querySelector(_n),r=e.querySelector(vn);if(!(!n||!r))for(let i of xn(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},Cn=(e,t,n)=>{for(let r of xn(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`);t&&n(r,t)}},wn=(e,t,n)=>{Cn(e,n,(e,r)=>{try{e.manualFields||G(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},Tn=(e,t,n)=>{Cn(e,n,(e,r)=>{try{e.manualFields||Nt(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},En=e=>!!e&&typeof e==`object`&&!Array.isArray(e),Dn=(e,t)=>{if(!En(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(En(t)&&En(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return En(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},On=()=>{try{let e=globalThis,t=typeof e.chrome?.runtime?.id==`string`&&typeof e.__NEUTRALINO_AUTH__?.port==`number`;return!!(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||typeof e.__WEBNATIVE_AUTH__?.port==`number`||typeof e.__NEUTRALINO_AUTH__?.port==`number`||t)}catch{return!1}},kn=e=>{if(!e||typeof e!=`object`)return!1;let t=e.core,n=e.shell,r=e.bridge,i=e.cwsp,a=e.control;return!!(typeof t?.endpointUrl==`string`&&t.endpointUrl.trim()||typeof t?.userId==`string`&&t.userId.trim()||typeof t?.ecosystemToken==`string`&&t.ecosystemToken.trim()||typeof t?.userKey==`string`&&t.userKey.trim()||typeof n?.clipboardInboundMode==`string`&&n.clipboardInboundMode||typeof n?.clipboardOutboundMode==`string`&&n.clipboardOutboundMode||typeof n?.remoteHost==`string`&&n.remoteHost.trim()||typeof n?.clientId==`string`&&n.clientId.trim()||typeof n?.allowControlApi==`boolean`||typeof n?.bridgeDaemonEnabled==`boolean`||typeof n?.autoStartOnBoot==`boolean`||typeof r?.endpointUrl==`string`&&r.endpointUrl.trim()||typeof r?.userId==`string`&&String(r.userId).trim()||typeof i?.clientId==`string`&&String(i.clientId).trim()||typeof i?.endpointUrl==`string`&&String(i.endpointUrl).trim()||a?.surface===`capacitor-android`)},An=()=>{try{let e=globalThis.chrome?.runtime?.id;return typeof e==`string`&&e.length>0}catch{return!1}},jn=e=>{if(!An())return e;let t=`L-110-crx`,n=e=>/^L-\d{1,3}-crx$/i.test(String(e??``).trim()),r=((...e)=>{for(let t of e){let e=String(t??``).trim();if(e&&!n(e))return e}return`L-110`})(e.shell?.clientId,e.core?.userId);return{...e,core:{...e.core||{},userId:t,socket:{...e.core?.socket||{},selfId:t}},shell:{...e.shell||{},clientId:r}}},Mn=async e=>{let t=await e();if((t.core?.preferBackendSync??!0)===!1)return jn(t);let n=await D(),r=(()=>{try{if(!An())return!1;let e=globalThis;return String(globalThis.document?.documentElement?.dataset?.cwspBridge||``)===`live`||typeof e.__NEUTRALINO_AUTH__?.port==`number`}catch{return!1}})();if((On()||r)&&!kn(n))for(let e=0;e<8&&(await new Promise(e=>setTimeout(e,300)),n=await D(),!kn(n));e++);return jn(Dn(t,n))},Nn=async(e,t,n={})=>{let r=await D(),i=Dn(n,r);return wn(e,i,t),i},Pn=async(e,t,n)=>(Tn(e,t,n),xe(t)),Fn=e=>xn(e).map(e=>e.id),In=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},Ln=async e=>{ie(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await m(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-CXnZuSSw.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=e=>{let t=e.toLowerCase();return t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`||t===`md.u2re.space`||t===`www.md.u2re.space`},a=e=>{let t=String(e||``).trim();if(!t)return``;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e).hostname.toLowerCase();if(i(n))return``}catch{if(/cwsp\.u2re\.space|md\.u2re\.space/i.test(t))return``}return t},o=e=>{let t=String(e||``).trim();return t?/[,;\s]/.test(t)&&/:\/\//.test(t)?t.split(/[,;\s]+/).map(e=>a(e.trim())).filter(Boolean).join(`;`):a(t):``};if(typeof t.endpointUrl==`string`){let e=o(t.endpointUrl);e!==t.endpointUrl.trim()&&(t.endpointUrl=e)}let s=typeof t.endpointUrl==`string`?t.endpointUrl:``,c=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!s.trim()&&!c.trim())return;let l=In()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},u=await ne({relayHttpsUrl:s,directHttpsUrl:c},l);u.relayHttpsUrl!==void 0&&(t.endpointUrl=u.relayHttpsUrl),u.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:u.directHttpsUrl})}})),zn,Bn=e((()=>{x(),ce(),S(),Me(),_(),he(),Je(),et(),se(),V(),lt(),dt(),pt(),ht(),_t(),yt(),xt(),Ct(),Dt(),kt(),Rn(),y(),ge(),M(),p(),zn=e=>{let t=null,n=null,r=()=>{let e=yn();return e===`capacitor`||e===`native`?8e3:2500},a=(e,i)=>{t&&(n&&=(clearTimeout(n),null),t.textContent=e,t.classList.remove(`note--ok`,`note--warn`,`note--err`),i?.tone===`ok`&&t.classList.add(`note--ok`),i?.tone===`warn`&&t.classList.add(`note--warn`),i?.tone===`err`&&t.classList.add(`note--err`),e&&!i?.persist&&(n=setTimeout(()=>{t&&(t.textContent=``,t.classList.remove(`note--ok`,`note--warn`,`note--err`))},r())))},o=i`<div class="view-settings" data-view="settings">
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
  </div>`;j(o),sn();let s={isExtension:e.isExtension,surface:yn()},c=ln(s);Sn(o,s),pn(o,c),c===`full`&&(s.surface===`capacitor`||s.surface===`native`)&&(o.querySelector(`[data-tab-panel="server"]`)?.remove(),o.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let l=e=>hn(o,e),u=e=>o.querySelector(e);t=o.querySelector(`[data-note]`);let d=u(`[data-field="ai.baseUrl"]`),f=u(`[data-field="ai.apiKey"]`),p=u(`[data-field="ui.showKey"]`),h=u(`[data-field="ai.model"]`),g=u(`[data-field="ai.customModel"]`),_=o.querySelector(`[data-field-group="ai.customModel"]`),y=u(`[data-field="ai.defaultReasoningEffort"]`),b=u(`[data-field="ai.defaultVerbosity"]`),te=u(`[data-field="ai.maxOutputTokens"]`),ne=u(`[data-field="ai.contextTruncation"]`),x=u(`[data-field="ai.promptCacheRetention"]`),ie=u(`[data-field="ai.maxToolCalls"]`),S=u(`[data-field="ai.parallelToolCalls"]`),se=u(`[data-field="ai.requestTimeout.low"]`),ce=u(`[data-field="ai.requestTimeout.medium"]`),he=u(`[data-field="ai.requestTimeout.high"]`),ge=u(`[data-field="ai.maxRetries"]`),ve=u(`[data-field="ai.shareTargetMode"]`),w=()=>{let e=(h?.value||``).trim()===`custom`;_&&(_.hidden=!e),g&&(g.disabled=!e)};if(h){h.replaceChildren();for(let e of ae){let t=document.createElement(`option`);t.value=e,t.textContent=e,h.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,h.append(e),h.addEventListener(`change`,w)}g?.addEventListener(`focus`,()=>{h&&(h.value=`custom`,w())});let ye=u(`[data-field="ai.autoProcessShared"]`),T=u(`[data-field="ai.responseLanguage"]`),be=u(`[data-field="ai.translateResults"]`),xe=u(`[data-field="ai.generateSvgGraphics"]`),E=u(`[data-field="speech.language"]`),D=u(`[data-field="appearance.theme"]`),Se=u(`[data-field="appearance.fontSize"]`),Ce=u(`[data-field="appearance.markdown.preset"]`),we=u(`[data-field="appearance.markdown.fontFamily"]`),Te=u(`[data-field="appearance.markdown.fontSizePx"]`),Ee=u(`[data-field="appearance.markdown.lineHeight"]`),De=u(`[data-field="appearance.markdown.contentMaxWidthPx"]`),Oe=u(`[data-field="appearance.markdown.printScale"]`),ke=u(`[data-field="appearance.markdown.page.size"]`),Ae=u(`[data-field="appearance.markdown.page.orientation"]`),Me=u(`[data-field="appearance.markdown.page.marginMm"]`),Pe=u(`[data-field="appearance.markdown.modules.typography"]`),Fe=u(`[data-field="appearance.markdown.modules.lists"]`),Ie=u(`[data-field="appearance.markdown.modules.tables"]`),Le=u(`[data-field="appearance.markdown.modules.codeBlocks"]`),Re=u(`[data-field="appearance.markdown.modules.blockquotes"]`),ze=u(`[data-field="appearance.markdown.modules.media"]`),Be=u(`[data-field="appearance.markdown.modules.printBreaks"]`),Ve=u(`[data-field="appearance.markdown.plugins.smartTypography"]`),He=u(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),Ue=u(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),We=o.querySelector(`[data-field="appearance.markdown.customCss"]`),Ge=o.querySelector(`[data-field="appearance.markdown.printCss"]`),O=o.querySelector(`[data-field="appearance.markdown.extensions"]`),Ke=u(`[data-field="core.ntpEnabled"]`),k=u(`[data-field="core.mode"]`),A=u(`[data-field="core.endpointUrl"]`),M=u(`[data-field="core.userId"]`),P=u(`[data-field="core.userKey"]`),F=u(`[data-field="core.ecosystemToken"]`),Je=u(`[data-field="core.preferBackendSync"]`),Ye=u(`[data-field="core.encrypt"]`),Xe=u(`[data-field="core.appClientId"]`),Qe=u(`[data-field="core.allowInsecureTls"]`),$e=u(`[data-field="core.ops.allowUnencrypted"]`),et=u(`[data-field="core.admin.httpsOrigin"]`),I=u(`[data-field="core.admin.httpOrigin"]`),L=u(`[data-field="core.admin.path"]`),V=u(`[data-field="core.socket.accessToken"]`),lt=u(`[data-field="core.socket.routeTarget"]`),dt=u(`[data-field="core.socket.clientAccessToken"]`),pt=u(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),ht=u(`[data-field="shell.maintainHubSocketConnection"]`),_t=u(`[data-field="shell.clipboardBroadcastTargets"]`),yt=u(`[data-field="shell.pushLocalClipboardToLan"]`),xt=u(`[data-field="shell.clipboardPushIntervalMs"]`),Ct=u(`[data-field="shell.enableRemoteClipboardBridge"]`),wt=u(`[data-field="shell.acceptInboundClipboardData"]`),Tt=u(`[data-field="shell.clipboardInboundAllowIds"]`),Dt=u(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),kt=u(`[data-field="shell.clipboardShareDestinationIds"]`),H=u(`[data-field="shell.applyRemoteClipboardToDevice"]`),U=u(`[data-field="shell.acceptContactsBridgeData"]`),W=u(`[data-field="shell.acceptSmsBridgeData"]`),At=u(`[data-field="shell.enableNativeSms"]`),jt=u(`[data-field="shell.enableNativeContacts"]`),Mt=o.querySelector(`[data-admin-preview]`),G=o.querySelector(`[data-mcp-section]`),Nt=o.querySelector(`[data-section="extension"]`),K=o.querySelector(`[data-extension-tab]`);if(T){T.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,T.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,T.append(t);for(let e of rt()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,T.append(t)}}if(E){E.replaceChildren();for(let e of nt()){let t=document.createElement(`option`);t.value=e,t.textContent=tt(e),E.append(t)}}o.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Y()}),o.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Y()});let q=e=>{let t=mn(c),n=e||t;o.querySelector(`[data-tab-panel="${n}"]`)||(n=o.querySelector(`[data-tab-panel]`)?.getAttribute(`data-tab-panel`)||t),o.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let r=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(r)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let i=o.querySelectorAll(`[data-tab-panel]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}j(o)};for(let e of o.querySelectorAll(`[data-settings-tabs] button[type="button"][data-action="switch-settings-tab"][data-tab]`))e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),q(e.getAttribute(`data-tab`)||mn(c))});let Pt=e=>{let t=mn(c),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?l(`markdown`)?`markdown`:t:new Set([...l(`appearance`)?[`appearance`]:[],...l(`markdown`)?[`markdown`]:[],...l(`ai`)?[`ai`]:[],...l(`mcp`)?[`mcp`]:[],...l(`server`)?[`server`]:[],...l(`instructions`)?[`instructions`]:[],...l(`extension`)?[`extension`]:[],...Fn(s)]).has(n)?n:t:t},J=()=>{let e=F?.value?.trim()||P?.value?.trim()||V?.value?.trim()||``;return{mode:k?.value||`native`,endpointUrl:A?.value?.trim()||``,userId:M?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!Ye?.checked,preferBackendSync:(Je?.checked??!0)!==!1,appClientId:Xe?.value?.trim()||``,allowInsecureTls:!!Qe?.checked,useCoreIdentityForAirPad:!0,socket:{accessToken:e,routeTarget:lt?.value?.trim()||``,selfId:``,clientAccessToken:dt?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!pt?.checked},admin:{httpsOrigin:et?.value?.trim()||``,httpOrigin:I?.value?.trim()||``,path:L?.value?.trim()||`/`},ops:{allowUnencrypted:!!$e?.checked}}},Y=()=>{if(!Mt)return;let e=je(J());Mt.textContent=`Resolved: ${e.https} · ${e.http}`},X=e=>{try{qe(N.EXPLORER_PATH,e),Ze(`explorer`),v({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),a(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),a(`Failed to open Explorer path.`)}};if(Promise.resolve((async()=>((s.surface===`capacitor`||s.surface===`native`)&&await C().catch(()=>null),(s.surface===`crx`||s.isExtension)&&await fe().catch(()=>null),Mn(()=>de())))()).then(t=>{d&&(d.value=(t?.ai?.baseUrl||``).trim()),f&&(f.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.6-luna`).trim(),r=(t?.ai?.customModel||``).trim();if(h){let e=ae.includes(n);n===`custom`||!e&&n?(h.value=`custom`,g&&(g.value=r||n)):(h.value=e?n:`gpt-5.6-luna`,g&&(g.value=r)),w()}if(y&&(y.value=t?.ai?.defaultReasoningEffort||`medium`),b&&(b.value=t?.ai?.defaultVerbosity||`medium`),te&&(te.value=String(t?.ai?.maxOutputTokens??4e5)),ne&&(ne.value=t?.ai?.contextTruncation||`disabled`),x&&(x.value=t?.ai?.promptCacheRetention||`in-memory`),ie&&(ie.value=String(t?.ai?.maxToolCalls??8)),S&&(S.checked=(t?.ai?.parallelToolCalls??!0)!==!1),se&&(se.value=String(t?.ai?.requestTimeout?.low??6e4)),ce&&(ce.value=String(t?.ai?.requestTimeout?.medium??3e5)),he&&(he.value=String(t?.ai?.requestTimeout?.high??9e5)),ge&&(ge.value=String(t?.ai?.maxRetries??2)),ve&&(ve.value=t?.ai?.shareTargetMode||`recognize`),ye&&(ye.checked=(t?.ai?.autoProcessShared??!0)!==!1),T&&(T.value=t?.ai?.responseLanguage||`auto`),be&&(be.checked=!!t?.ai?.translateResults),xe&&(xe.checked=!!t?.ai?.generateSvgGraphics),E&&(E.value=t?.speech?.language||`en-US`),D&&(D.value=t?.appearance?.theme||`auto`),Se&&(Se.value=t?.appearance?.fontSize||`medium`),Ce&&(Ce.value=t?.appearance?.markdown?.preset||`default`),we&&(we.value=t?.appearance?.markdown?.fontFamily||`system`),Te&&(Te.value=String(t?.appearance?.markdown?.fontSizePx??16)),Ee&&(Ee.value=String(t?.appearance?.markdown?.lineHeight??1.7)),De&&(De.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),Oe&&(Oe.value=String(t?.appearance?.markdown?.printScale??1)),ke&&(ke.value=t?.appearance?.markdown?.page?.size||`auto`),Ae&&(Ae.value=t?.appearance?.markdown?.page?.orientation||`portrait`),Me&&(Me.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Pe&&(Pe.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),Fe&&(Fe.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Ie&&(Ie.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),Le&&(Le.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),Re&&(Re.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),ze&&(ze.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),Be&&(Be.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),Ve&&(Ve.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),He&&(He.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),Ue&&(Ue.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),We&&(We.value=(t?.appearance?.markdown?.customCss||``).trim()),Ge&&(Ge.value=(t?.appearance?.markdown?.printCss||``).trim()),O){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];O.value=e.length>0?JSON.stringify(e,null,2):``}Ke&&(Ke.checked=!!t?.core?.ntpEnabled),k&&(k.value=t?.core?.mode||`native`),A&&(A.value=(t?.core?.endpointUrl||``).trim()),M&&(M.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();F&&(F.value=e),P&&(P.value=e),V&&(V.value=e)}if(Je&&(Je.checked=(t?.core?.preferBackendSync??!0)!==!1),Ye&&(Ye.checked=!!t?.core?.encrypt),Xe&&(Xe.value=(t?.core?.appClientId||``).trim()),lt&&(lt.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),dt&&(dt.value=(t?.core?.socket?.clientAccessToken||``).trim()),pt&&(pt.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),Qe&&(Qe.checked=!!t?.core?.allowInsecureTls),$e&&($e.checked=!!t?.core?.ops?.allowUnencrypted),et&&(et.value=(t?.core?.admin?.httpsOrigin||``).trim()),I&&(I.value=(t?.core?.admin?.httpOrigin||``).trim()),L&&(L.value=(t?.core?.admin?.path||`/`).trim()||`/`),ht&&(ht.checked=!!t?.shell?.maintainHubSocketConnection),_t&&(_t.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),yt&&(yt.checked=!!t?.shell?.pushLocalClipboardToLan),xt){let e=Number(t?.shell?.clipboardPushIntervalMs);xt.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}Ct&&(Ct.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),wt&&(wt.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),Tt&&(Tt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),Dt&&(Dt.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),kt&&(kt.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),H&&(H.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),U&&(U.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),W&&(W.checked=!_e()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),At&&(At.checked=!_e()&&(t?.shell?.enableNativeSms??!1)===!0),jt&&(jt.checked=(t?.shell?.enableNativeContacts??!0)!==!1),Y(),ct(G,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),oe(t),me(t),wn(o,t,s),e.onTheme?.(t?.appearance?.theme||`auto`),_e()&&m(()=>import(`./cws-bridge-DZFRlVYE.js`).then(e=>(e.a(),e.n)).then(e=>e.invokeCwsNative(`app:info`,{})),[],import.meta.url).then(e=>{let t=e?.echo||{},n=o.querySelector(`[data-apk-local-version]`);if(!n)return;let r=String(t?.signatureSha256||``).slice(0,12),i=e;n.textContent=`Installed: ${t?.versionName||i?.versionName||`?`} (${t?.versionCode??i?.versionCode??`?`})`+(r?` · sig ${r}…`:``)}).catch(()=>{})}).catch(()=>{ct(G,[])}),p?.addEventListener(`change`,()=>{!f||!p||(f.type=p.checked?`text`:`password`)}),D?.addEventListener(`change`,()=>{let t=D.value||`auto`;(async()=>{try{let e=await de();me({...e,appearance:{...e.appearance||{},theme:t}})}catch{me({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),o.addEventListener(`click`,t=>{let n=at(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&G){G.querySelector(`.mcp-empty-note`)?.remove(),G.appendChild(ot({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),G&&!G.querySelector(`[data-mcp-id]`)&&ct(G,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){X(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){X(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){Ne(J(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){Ne(J(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=je(J());navigator.clipboard?.writeText?.(e.https).then(()=>a(`HTTPS admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=je(J());navigator.clipboard?.writeText?.(e.http).then(()=>a(`HTTP admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){m(()=>import(`./clipboard-device-7zVqLXI9.js`).then(e=>(e.n(),e.t)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>a(`App settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){m(()=>import(`./clipboard-device-7zVqLXI9.js`).then(e=>(e.n(),e.t)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>a(`Notification settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}let i=n?.closest?.(`button[data-action="crx-control-pair"]`),c=n?.closest?.(`button[data-action="crx-control-unpair"]`);if(i||c){(async()=>{let e=o.querySelector(`[data-crx-control-status]`),t=()=>{try{globalThis.chrome?.runtime?.sendMessage?.({type:`cwsp-control-session-changed`})}catch{}};try{let n=await m(()=>import(`./crx-control-session--61Cvgg2.js`),[],import.meta.url);if(c){await n.clearCrxControlSession(),e&&(e.textContent=await n.formatCrxControlSessionStatus()),a(`Control unpaired — Copy & Share / Paste by CWSP disabled.`,{tone:`warn`}),t();return}let r=String(o.querySelector(`[data-field="shell.localHubUrl"]`)?.value||``).trim(),i=String(document.documentElement.dataset.cwspControlOrigin||``).trim();e&&(e.textContent=`Control: waiting for pairing dialog…`),a(`Enter public token + device code in the pairing dialog…`);let s=await n.pairCrxControlWithModal({localHubUrl:r,preferredOrigins:i?[i]:[]});if(s.cancelled){e&&(e.textContent=await n.formatCrxControlSessionStatus()),a(`Pairing cancelled.`);return}e&&(e.textContent=s.ok?await n.formatCrxControlSessionStatus():`Control: ${s.error}`),s.ok?(a(`Paired Control at ${s.session.controlHost} (persistent).`),t()):a(s.error,{tone:`warn`})}catch(e){a(`Control pairing unavailable: ${e instanceof Error?e.message:String(e)}`,{tone:`warn`})}})();return}let u=n?.closest?.(`button[data-action="control-pairing-refresh"]`),p=n?.closest?.(`button[data-action="control-public-token-regenerate"]`);if(u||p){let e=!!t?.isTrusted;(async()=>{try{let t=String(location.hostname||``);if(location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`){e&&a(`Pairing codes are shown on the device (phone/desk), not in the public Control SPA.`,{tone:`warn`});return}}catch{}let t=o.querySelector(`input[data-control-device-code], [data-control-device-code]`),n=o.querySelector(`input[data-control-public-token], [data-control-public-token]`),r=o.querySelector(`[data-secret-meta="control-device-code"]`),i=o.querySelector(`[data-secret-meta="control-public-token"]`),s=e=>{let a=String(e.deviceCode||``).trim(),o=Math.max(1,Math.round(Number(e.expiresInMs||0)/1e3)),s=String(e.publicToken||``).trim();t instanceof HTMLInputElement?t.value=a:t&&(t.textContent=a?`Code: ${a} (${o}s)`:`Code: …`),n instanceof HTMLInputElement?n.value=s:n&&(n.textContent=s?`Public token: ${s}`:`Public token: …`),r&&(r.textContent=a?`Expires in ${o}s`:``),i&&(i.textContent=s?`Stable until regenerated`:``)};try{e&&a(p?`Regenerating public token…`:`Refreshing pairing code…`,{tone:`warn`});try{let{invokeCwsNative:t}=await m(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-DZFRlVYE.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),n=await t(p?`control:public-token:regenerate`:`control:pairing:status`,{}),r=n?.controlPairing||n?.echo||{};if(r?.deviceCode||r?.publicToken){s(r),e&&a(p?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`});return}}catch{}let t=globalThis,n=Number(t.__CWSP_CONTROL_PORT__||29110)||29110,r=String(t.__CWSP_CONTROL_API_KEY__||`cwsp-neutralino-local`).trim(),i=await fetch(`http://127.0.0.1:${n}${p?`/service/pair/regenerate-public-token`:`/service/pair/display`}`,{method:p?`POST`:`GET`,headers:{Accept:`application/json`,"Content-Type":`application/json`,"X-API-Key":r},body:p?`{}`:void 0});if(!i.ok)throw Error(`Control HTTP ${i.status}`);s(await i.json()),e&&a(p?`New public token generated — update the Control SPA.`:`Pairing code refreshed.`,{tone:`ok`})}catch(t){e&&a(String(t?.message||t||`Pairing status unavailable`),{tone:`err`})}})();return}let _=n?.closest?.(`button[data-action="files-storage-pick-saf"]`),v=n?.closest?.(`button[data-action="files-storage-clear-saf"]`),ae=n?.closest?.(`button[data-action="files-storage-show-paths"]`),oe=n?.closest?.(`button[data-action="files-storage-share-readme"]`),C=n?.closest?.(`button[data-action="files-storage-open-explorer"]`),fe=n?.closest?.(`button[data-action="files-storage-perm-status"]`),w=n?.closest?.(`button[data-action="files-storage-request-media"]`),j=n?.closest?.(`button[data-action="files-storage-request-all-files"]`);if(_||v||ae||oe||C||fe||w||j){(async()=>{try{let{invokeCwsNative:e}=await m(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-DZFRlVYE.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),t=await de(),n=o.querySelector(`[data-files-saf-uri]`),r=o.querySelector(`[data-files-storage-paths]`),i=o.querySelector(`[data-files-perm-status]`),s=e=>{if(!n)return;let t=String(e||``).trim();n.textContent=t?`SAF folder: ${t.length>72?`${t.slice(0,36)}…${t.slice(-28)}`:t}`:`SAF folder: (not set)`},c=e=>{i&&(i.textContent=`Media/storage runtime: ${e.runtimeGranted===!0?`granted`:`missing`}`+(e.missingRuntime?` (${e.missingRuntime})`:``)+`\nAll-files access: ${e.allFilesAccess===!0?`granted`:`not granted`}`+(e.note?`\n${e.note}`:``))};if(v){t.shell={...t.shell||{},filesIncomingDir:``,filesLandingMode:t.shell?.filesLandingMode||`app`},await le(t),s(``),a(`SAF folder cleared.`,{tone:`ok`});return}let l=_?`files:storage:pick-landing`:oe?`files:storage:share-readme`:C?`files:storage:open-explorer`:w?`files:storage:request-media`:j?`files:storage:request-all-files`:fe?`files:storage:permissions-status`:`files:storage:status`,u=o.querySelector(`[data-field="shell.filesStagingRoot"]`),d=o.querySelector(`[data-field="shell.filesLandingMode"]`);a(_?`Opening folder picker…`:C?`Opening CWSP Files…`:w?`Requesting media permission…`:j?`Opening all-files settings…`:`Reading storage…`,{tone:`warn`});let f=await e(l,{stagingRoot:u?.value||t.shell?.filesStagingRoot||`app`,landingMode:d?.value||t.shell?.filesLandingMode||`app`,incomingDir:t.shell?.filesIncomingDir||``}),p=f?.echo||f?.envelope?.payload||{},h=p?.error||f?.error||(!f?.ok&&!p?.outgoingDir&&!p?.documentUri&&p?.runtimeGranted===void 0?`storage action failed`:``);if(h){a(String(h),{tone:`err`});return}if(_&&p?.incomingDir){t.shell={...t.shell||{},filesIncomingDir:String(p.incomingDir),filesLandingMode:`saf`},await le(t),d&&(d.value=`saf`),s(String(p.incomingDir)),a(`SAF folder saved. Landing mode set to SAF.`,{tone:`ok`});return}(p.runtimeGranted!==void 0||p.allFilesAccess!==void 0)&&c(p),r&&(p?.outgoingDir||p?.incomingAppDir||p?.readmePath||p?.note)&&(r.textContent=`Outgoing temp: ${p.outgoingDir||`?`}\nIncoming temp: ${p.incomingAppDir||`?`}\nLanding mode: ${p.landingMode||`?`}`+(p?.incomingDir?`\nSAF: ${p.incomingDir}`:``)+(p?.note&&p.runtimeGranted===void 0?`\n${p.note}`:``)),a(oe?`Shared README — open it in another app to see the paths.`:C?`Opened document picker — look for CWSP Files (or Files app sidebar).`:j?`Enable “Allow access to manage all files”, then tap Refresh status.`:w?`Media permission dialog finished — see status.`:`Status updated.`,{tone:`ok`})}catch(e){a(String(e?.message||e||`Files storage action failed`),{tone:`err`})}})();return}let qe=n?.closest?.(`button[data-action="apk-update-check"]`),N=n?.closest?.(`button[data-action="apk-update-install"]`);if(qe||N){let e=N?`app:update:install`:`app:update:check`;(async()=>{a(N?`Downloading APK…`:`Checking for update…`,{tone:`warn`});try{let t=await de(),n=o.querySelector(`[data-field="shell.apkUpdateSource"]`),r=o.querySelector(`[data-field="core.endpointUrl"]`),i=o.querySelector(`[data-field="core.ecosystemToken"]`),s=o.querySelector(`[data-field="core.allowInsecureTls"]`),c=o.querySelector(`[data-apk-local-version]`),l=(n?.value||t.shell?.apkUpdateSource||`wan`).trim(),u=(r?.value||t.core?.endpointUrl||``).trim(),d=(i?.value||``).trim()||re(t),f=s?.checked??!!t.core?.allowInsecureTls,{invokeCwsNative:p}=await m(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-DZFRlVYE.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url),h=await p(e,{source:l,endpointUrl:u,token:d,ecosystemToken:d,allowInsecureTls:f}),g=h?.echo||h?.envelope?.payload||{},_=g?.error||h?.error||(!h?.ok&&!h?.echo?`update failed`:``);if(_){a(String(_),{tone:`err`});return}if(c&&(g?.localVersionCode!=null||g?.localVersionName)){let e=String(g?.localSignatureSha256||``).slice(0,12);c.textContent=`Installed: ${g.localVersionName||`?`} (${g.localVersionCode??`?`})`+(e?` · sig ${e}…`:``)}if(N){a(g?.launchedInstaller?`Installer launched — confirm on the system prompt.`:`Install request sent.`,{tone:`ok`});return}let v=g?.localVersionCode??`?`,ee=g?.remoteVersionCode??`?`,y=g?.updateAvailable===!0;if(g?.signatureCompatible===!1){a(`Signature mismatch — remote APK not signed like this install (local ${v}, remote ${ee}).`,{tone:`err`});return}a(y?`Update available: ${v} → ${ee} (${g?.remoteVersionName||`?`}).`:`Up to date (local ${v}, remote ${ee}).`,{tone:y?`warn`:`ok`})}catch(e){a(String(e?.message||e),{tone:`err`})}})();return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{a(`Saving…`,{tone:`warn`});let t=await de(),n=t.appearance?.markdown?.extensions||[],r=l(`markdown`)&&O?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){q(`markdown`),a(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:l(`ai`)?{baseUrl:d?.value?.trim?.()||``,apiKey:f?.value?.trim?.()||``,model:h?.value||`gpt-5.6-luna`,customModel:h?.value===`custom`&&g?.value?.trim?.()||``,defaultReasoningEffort:y?.value||`medium`,defaultVerbosity:b?.value||`medium`,maxOutputTokens:R(te?.value,4e5),contextTruncation:ne?.value||`disabled`,promptCacheRetention:x?.value||`in-memory`,maxToolCalls:R(ie?.value,8),parallelToolCalls:(S?.checked??!0)!==!1,requestTimeout:{low:R(se?.value,6e4),medium:R(ce?.value,3e5),high:R(he?.value,9e5)},maxRetries:R(ge?.value,2),shareTargetMode:ve?.value||`recognize`,autoProcessShared:(ye?.checked??!0)!==!1,responseLanguage:T?.value||`auto`,translateResults:!!be?.checked,generateSvgGraphics:!!xe?.checked,mcp:l(`mcp`)?st(G):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:l(`ai`)?{language:E?.value||`en-US`}:t.speech||{},core:l(`server`)?{...t.core,ntpEnabled:B(Ke,!!t.core?.ntpEnabled),mode:z(k,t.core?.mode||`native`)||`native`,endpointUrl:z(A,t.core?.endpointUrl||``),userId:z(M,t.core?.userId||``),ecosystemToken:z(F,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||z(P,t.core?.userKey||``)||z(V,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:z(F,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||z(P,t.core?.userKey||``)||z(V,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:B(Ye,!!t.core?.encrypt),preferBackendSync:B(Je,(t.core?.preferBackendSync??!0)!==!1),appClientId:z(Xe,t.core?.appClientId||``),allowInsecureTls:B(Qe,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:!0,socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=z(F,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||z(P,t.core?.userKey||``)||z(V,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:z(lt,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:z(dt,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:B(pt,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:z(et,t.core?.admin?.httpsOrigin||``),httpOrigin:z(I,t.core?.admin?.httpOrigin||``),path:z(L,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:B($e,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:l(`server`)?{...t.shell||{},maintainHubSocketConnection:B(ht,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:z(_t,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:B(yt,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=xt?.value,n=R(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:B(Ct,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:B(wt,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:z(Tt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:B(Dt,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:z(kt,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:B(H,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:B(U,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!_e()&&B(W,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!_e()&&B(At,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:B(jt,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:l(`appearance`)||l(`markdown`)?{theme:D?.value||`auto`,fontSize:Se?.value||`medium`,markdown:{preset:Ce?.value||`default`,fontFamily:we?.value||`system`,fontSizePx:R(Te?.value,16),lineHeight:it(Ee?.value,1.7,1.1,2.2),contentMaxWidthPx:R(De?.value,860),printScale:it(Oe?.value,1,.5,1.5),page:{size:ke?.value||`auto`,orientation:Ae?.value||`portrait`,marginMm:R(Me?.value,12)},modules:{typography:(Pe?.checked??!0)!==!1,lists:(Fe?.checked??!0)!==!1,tables:(Ie?.checked??!0)!==!1,codeBlocks:(Le?.checked??!0)!==!1,blockquotes:(Re?.checked??!0)!==!1,media:(ze?.checked??!0)!==!1,printBreaks:(Be?.checked??!0)!==!1},plugins:{smartTypography:!!Ve?.checked,softBreaksAsBr:!!He?.checked,externalLinksNewTab:(Ue?.checked??!0)!==!1},customCss:We?.value||``,printCss:Ge?.value||``,extensions:n||[]}}:t.appearance||{}};Tn(o,i,s),await Ln(i);let c=i,u=s.surface===`capacitor`||s.surface===`native`?ee(c).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),p=await le(c);if(!p){a(`Settings save returned no data.`,{tone:`err`});return}let _=!1;try{_=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase()===`cwsp-control`||/^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname||``))}catch{_=!1}try{if(_){let e=globalThis.__CWSP_ENSURE_CONTROL_FOR_SAVE__;if(typeof e==`function`){let t=await e();if(!t?.ok){pe(!1,t?.error||`Control not paired`),a(t?.error||`Pair phone Control (token + code + Accept) before Save`,{tone:`warn`});return}}}await Pn(o,p,s),_&&globalThis.__CWSP_CONTROL_BRIDGE_LIVE__&&pe(!0)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e);let t=e instanceof Error?e.message:String(e);if(_&&pe(!1,t),/pairing|unauthorized|401|403|Control/i.test(t)){a(t,{tone:`warn`});return}}wn(o,p,s);let v=ue(),re=await u,ae=re.lines,oe=re.results.some(e=>e.granted===!1);m(()=>import(`./hub-socket-boot-Bwi3YRK4.js`).then(e=>(e.r(),e.n)).then(async e=>{if(_){try{globalThis.__CWSP_CONTROL_BRIDGE_LIVE__||console.warn(`[Settings] Control not paired — settings saved locally only; pair to push to device`)}catch{}return}if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis;if(e.__CWS_NODE_CLIPBOARD_HUB__===!1)return;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.host||`127.0.0.1`).trim()||`127.0.0.1`;if(n===8434&&r!==`127.0.0.1`&&r!==`localhost`||n!==29110)return;let i=String(t?.key||`cwsp-neutralino-local`),a=p.core,o=String(a?.ecosystemToken||a?.userKey||a?.socket?.accessToken||``).trim(),s={};a?.endpointUrl&&(s.remoteHost=String(a.endpointUrl).trim()),o&&(s.accessToken=o,s.clientToken=o),a?.userId&&(s.clientId=String(a.userId).trim()),s.force=!0,await fetch(`http://${r}:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":i},body:JSON.stringify(s),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await m(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-DZFRlVYE.js`).then(e=>(e.a(),e.n));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(p),m(()=>import(`./hub-socket-boot-Bwi3YRK4.js`).then(e=>(e.s(),e.u)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),me(p),e.onTheme?.(p.appearance?.theme||`auto`);let C=[`Saved locally`];v.nativeSynced===!0?C.push(`synced to Android`):v.nativeSynced===!1&&!oe?console.warn(`[Settings] native settings patch:`,v.nativeError||`not confirmed`):v.nativeSynced===!1&&C.push(`native sync failed${v.nativeError?`: ${v.nativeError}`:``}`);let fe=(()=>{try{return String(globalThis.__CWSP_CONTROL_VIA__||``)}catch{return``}})(),w=fe===`android`?`phone Control (Capacitor)`:fe===`neutralino`?`desk Control (Neutralino)`:_?`Control`:`desk Control`;v.webnativeSynced===!0?C.push(`synced to ${w}`):v.webnativeSynced===!1&&C.push(`${w} sync failed${v.webnativeError?`: ${v.webnativeError}`:``}`),ae.length&&C.push(...ae);let je=`ok`;(oe||v.webnativeSynced===!1)&&(je=`warn`),a(C.join(` · `),{tone:je})})().catch(e=>a(String(e),{tone:`err`}))}),e.isExtension){Nt&&(Nt.hidden=!1),K&&(K.hidden=!1);let e=i`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;o.append(e)}let Z=Pt(e.initialTab);if(q(Z),!o.querySelector(`[data-tab-panel="${Z}"]:not([hidden])`)){let e=o.querySelector(`[data-tab-panel]`);e&&q(e.getAttribute(`data-tab-panel`)||Z)}w();let Q=o.querySelectorAll(`[data-tab-panel]`).length,$=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${c} surface=${s.surface} tabs=${$} panels=${Q} active=${o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(Q===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,o.querySelector(`.settings-screen__body`)?.appendChild(e),q(`cwsp`)}return o.addEventListener(`cwsp-settings-resync`,()=>{j(o),q(o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Z)}),o}}));function Vn(e){return new Un(e)}var Hn,Un;e((()=>{r(),n(),Ue(),M(),Bn(),K(),Rn(),we(),p(),Hn={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Un=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=o(Hn);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id;return this.element=zn({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>j(this.element)),this.element}getToolbar(){return null}setupEventHandlers(){}loadSettings(){this.settings.value={...Hn}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...Hn},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){j(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(a(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===We.Patch||e===We.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([m(()=>import(`./Settings-DP2WRv9J.js`).then(e=>(e.a(),e.t)),[],import.meta.url),m(()=>import(`./Theme-COkKQ-CU.js`).then(e=>(e.r(),e.t)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}}))();export{Un as SettingsView,wn as applyContributions,Te as clearSettingsSyncArms,Tn as collectContributions,E as createMemorySettingsSyncArm,zn as createSettingsView,Vn as createView,Vn as default,Ce as detectSettingsSurface,W as getSettingsContributions,be as getSettingsDefaults,ve as getSettingsSnapshot,D as getSettingsSync,Nn as hydrateContributionsFromSync,w as mergeSettingsPatch,Sn as mountContributions,xe as patchSettingsSync,Pn as persistContributionsViaSync,sn as registerBuiltinSettingsContributions,Zt as registerCwspSettingsContribution,$t as registerDeviceSettingsContribution,tn as registerReaderSettingsContribution,U as registerSettingsContribution,Ee as registerSettingsSyncArm,rn as registerWorkcenterSettingsContribution,yn as resolveSettingsSurface,ye as resolveSettingsSyncArm,T as setSurfaceDetector,Se as unregisterSettingsSyncArm};