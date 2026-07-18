import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{F as t,H as n,L as r,V as i,X as a,t as o,tt as s}from"./src-kpjtbscK.js";import{n as c,t as l}from"./preload-helper-NDuSAHbO.js";import{n as u,t as d}from"./templates-Cp6qXLQ6.js";import{a as ee,d as f}from"./UnifiedMessaging-Bb5xrVpZ.js";import{m as p,s as m}from"./cwsp-endpoint-resolve-CsyKvxBc.js";import{a as h,i as g,r as _,t as te}from"./SettingsTypes-BL3S2Z7F.js";import{a as ne,i as re,n as ie,o as ae,r as oe}from"./Settings-_zeU2dzM.js";import{t as v,y as se}from"./config-3CjwWmU9.js";import{E as ce,G as y,H as le,K as ue,T as de,U as fe,V as pe,W as b,_ as me,a as he,b as ge,c as _e,d as ve,f as x,g as ye,h as S,i as be,l as xe,n as C,o as w,p as Se,r as Ce,s as we,t as Te,u as Ee,y as De}from"./cwsp-app.js";import{i as Oe,n as ke,r as Ae}from"./admin-doors-BoU4RSfd.js";import{c as T,i as je,l as Me,n as Ne,o as Pe,r as Fe,s as Ie}from"./CustomInstructions-Cg7VNEFY.js";import{n as Le}from"./shells-C2f8-p3t.js";import{c as Re,i as ze,n as Be,o as Ve}from"./channel-actions-DUgyqRkP.js";var He=e((()=>{})),E,Ue,D,O,k,A=e((()=>{He(),E=`data-settings-view-css`,Ue=e=>{let t=String(e||``).trim(),n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},D=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;color:#e8edf2!important;background:#0f1318!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch}
.view-settings [data-tab-panel]:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important}
.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select{pointer-events:auto!important;color:inherit!important}
`,O=e=>{if(!e?.classList?.contains(`view-settings`)||e.querySelector(`style[${E}]`))return;let t=Ue(`/* Settings view — self-contained stylesheet.
 * INVARIANT: Works inside open shadow roots: no reliance on \`html:has(...)\`, \`:root:has(...)\`,
 * or \`html[data-active-view]\` for paint. Uses inherited \`color-scheme\` + \`light-dark()\` fallbacks
 * wherever \`--color-*\` Veela tokens are absent on first paint.
 */
@layer settings-view {
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
}`);t=t.trim()?`${D}\n${t}`:D;let n=document.createElement(`style`);n.setAttribute(E,``),n.textContent=t,e.insertBefore(n,e.firstChild)},k=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}O(e)};e.isConnected?O(e):requestAnimationFrame(t)}}));function We(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var Ge,j,Ke=e((()=>{Ge={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`},j=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}},new j(`rs-workcenter`,`data`),new j(`rs-history`,`entries`),new j(`rs-settings`,`config`)})),M=e((()=>{Ke()}));function N(e){let t=`/`;if(e.params&&Object.keys(e.params).length>0){let n=new URLSearchParams(e.params).toString();t+=`?`+n}return t}function qe(e,t={}){let n=N(e);t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function Je(e,t){qe({view:e,params:t})}var Ye=e((()=>{S(),b(),[...fe],ue(`home`,le)})),Xe=e((()=>{})),Ze=e((()=>{Re(),Le(),pe(),pe(),Ve(),Ye(),S(),S(),Xe()})),P,Qe,F,$e,et,I,tt,L,R,nt,rt=e((()=>{P=[`en`,`ru`,`en-GB`,`en-US`],Qe=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,F=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},$e=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=F(n);t&&e.add(t)}for(let t of P)e.add(t);return Array.from(e)},et=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},I=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},tt=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},L=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},R=(e,t)=>e?!!e.checked:t,nt=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null}})),it,at,ot,z=e((()=>{o(),it=e=>{let n={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return t`<div class="field mcp-row" data-mcp-id=${n.id}>
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
          </div>`},at=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},ot=(e,n)=>{if(!e)return;e.replaceChildren();let r=Array.isArray(n)?n:[];if(!r.length){e.appendChild(t`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}r.forEach(t=>e.appendChild(it(t)))}})),st,ct=e((()=>{o(),st=()=>t`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`})),lt,B=e((()=>{o(),lt=()=>t`<header class="settings-screen__top">
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
    </header>`})),ut,dt=e((()=>{o(),ut=()=>t`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
    </section>`})),ft,pt=e((()=>{o(),ft=()=>t`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`})),mt,ht=e((()=>{o(),mt=()=>t`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`})),gt,_t=e((()=>{o(),gt=()=>t`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`})),vt,yt=e((()=>{o(),vt=()=>t`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`})),bt,xt=e((()=>{o(),r(),Ie(),u(),bt=(e={})=>{let n=i({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),r=t`<div class="custom-instructions-editor">
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
                    </div>`:t`<div class="ci-item-preview">${f(i.instruction,120)}</div>`}
            </div>`;s.addEventListener(`click`,t=>{let r=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&T(i.id).then(p).then(()=>e.onUpdate?.()),r===`edit`&&(n.editingId=i.id,u()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&je(i.id).then(p).then(()=>e.onUpdate?.()),r===`save-edit`){let t=s.querySelector(`[data-edit-field='label']`),r=s.querySelector(`[data-edit-field='instruction']`);Me(i.id,{label:t.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(n.editingId=null,p())).then(()=>e.onUpdate?.())}r===`cancel-edit`&&(n.editingId=null,u())}),a.append(s)}},ee=()=>{o.replaceChildren(),o.append(t`<option value="">None (use default)</option>`);for(let e of n.instructions??[]){let r=t`<option value="${e.id}">${e.label}</option>`;e.id===n.activeId&&(r.selected=!0),o.append(r)}},f=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,p=async()=>{let e=await Pe(),t=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;n.instructions=t?.instructions??[],n.activeId=t?.activeId??``,u(),ee()};return r.addEventListener(`click`,t=>{let r=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(n.isAdding=!0,s.hidden=!1,c.value=``,l.value=``,c.focus()),r===`cancel-add`&&(n.isAdding=!1,s.hidden=!0),r===`save-new`){let t=c.value.trim(),r=l.value.trim();if(!r){l.focus();return}Ne(t||`Custom`,r).then(e=>{if(e)return n.isAdding=!1,s.hidden=!0,p()}).then(()=>e.onUpdate?.())}if(r===`add-templates`){let t=new Set((n.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=d.filter(e=>!t.has(e.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}Fe(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(p).then(()=>e.onUpdate?.())}}),o.addEventListener(`change`,()=>{T(o.value||null).then(p).then(()=>e.onUpdate?.())}),p(),r}})),St,Ct=e((()=>{o(),xt(),St=e=>t`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${bt({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`})),wt,Tt=e((()=>{o(),wt=()=>t`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`})),V,H,U,Et,Dt,Ot,kt,At,W=e((()=>{V=new Map,H=e=>{let t=String(e?.id||``).trim();if(!t)return()=>{};let n={...e,id:t};return V.set(t,n),()=>{V.get(t)===n&&V.delete(t)}},U=()=>[...V.values()].sort((e,t)=>(e.order??100)-(t.order??100)||e.id.localeCompare(t.id)),Et=(e,t)=>{if(!(!e||!t))return t.split(`.`).reduce((e,t)=>{if(!(typeof e!=`object`||!e))return e[t]},e)},Dt=(e,t,n)=>{if(!e||!t)return;let r=t.split(`.`),i=e;for(let e=0;e<r.length-1;e+=1){let t=r[e],n=i[t];(typeof n!=`object`||!n)&&(i[t]={}),i=i[t]}i[r[r.length-1]]=n},Ot=e=>{let t=e,n=(e.getAttribute(`data-field-type`)||``).toLowerCase();if(n===`boolean`||t.type===`checkbox`)return!!t.checked;let r=`value`in t?String(t.value??``):``;if(n===`number`||t.type===`number`){let e=Number(r);return Number.isFinite(e)?e:void 0}if(n===`json`)try{return r.trim()?JSON.parse(r):void 0}catch{return}if(!(t.type===`password`&&!r.trim()))return r},kt=(e,t)=>{e.querySelectorAll(`[data-field]`).forEach(e=>{let n=e.getAttribute(`data-field`);if(!n)return;let r=Et(t,n);if(r===void 0)return;let i=e;if(i.type===`checkbox`){i.checked=!!r;return}if(e.getAttribute(`data-field-type`)===`json`){try{i.value=typeof r==`string`?r:JSON.stringify(r,null,2)}catch{i.value=``}return}`value`in i&&(i.value=String(r??``))})},At=(e,t)=>{let n=t;e.querySelectorAll(`[data-field]`).forEach(e=>{let t=e.getAttribute(`data-field`);if(!t)return;let r=Ot(e);r!==void 0&&Dt(n,t,r)})}})),G,jt,K,q,J,Y,X,Z=e((()=>{G=e=>{let t=document.createElement(`p`);return t.className=`field-hint`,t.textContent=e,t},jt=e=>{let t=document.createElement(`h4`);return t.textContent=e,t},K=(e,t,n=``,r=`text`)=>{let i=document.createElement(`label`);i.className=`field`;let a=document.createElement(`span`);a.textContent=e;let o=document.createElement(`input`);return o.className=`form-input`,o.type=r,o.autocomplete=`off`,o.setAttribute(`data-field`,t),n&&(o.placeholder=n),i.append(a,o),i},q=(e,t,n={})=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`input`);return a.className=`form-input`,a.type=`number`,a.setAttribute(`data-field`,t),n.min&&(a.min=n.min),n.max&&(a.max=n.max),n.step&&(a.step=n.step),n.placeholder&&(a.placeholder=n.placeholder),r.append(i,a),r},J=(e,t)=>{let n=document.createElement(`label`);n.className=`field checkbox form-checkbox`;let r=document.createElement(`input`);r.type=`checkbox`,r.setAttribute(`data-field`,t);let i=document.createElement(`span`);return i.textContent=e,n.append(r,i),n},Y=(e,t,n)=>{let r=document.createElement(`label`);r.className=`field`;let i=document.createElement(`span`);i.textContent=e;let a=document.createElement(`select`);a.className=`form-select`,a.setAttribute(`data-field`,t);for(let[e,t]of n){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.appendChild(n)}return r.append(i,a),r},X=(e,t,n)=>{let r=document.createElement(`section`);r.className=`card settings-tab-panel`,r.setAttribute(`data-tab-panel`,e),r.hidden=!0;let i=document.createElement(`h3`);i.textContent=t,r.appendChild(i);for(let e of n)typeof e==`string`?r.appendChild(jt(e)):r.appendChild(e);return r}})),Q,Mt=e((()=>{W(),Z(),Q=()=>H({id:`airpad`,label:`AirPad`,order:70,requiresView:`airpad`,render:()=>X(`airpad`,`AirPad`,[q(`Pointer sensitivity`,`views.airpad.pointerSensitivity`,{min:`0.2`,max:`5`,step:`0.1`,placeholder:`1.0`}),J(`Invert scroll`,`views.airpad.invertScroll`),J(`Send haptics`,`views.airpad.haptics`)])})})),Nt,Pt,Ft,It,Lt,Rt,zt=e((()=>{W(),_(),Z(),Nt=`Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.`,Pt=()=>[G(`Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub.`),`Connection`,K(`Relay / gateway host`,`core.endpointUrl`,`https://192.168.0.200:8434 or https://45.147.121.152:8434`),G(`Coordinator / gateway. Always include :8434 — bare host dials :443 where /ws is not served (404).`),K(`Direct host (optional)`,`core.ops.directUrl`,`https://192.168.0.110:8434`),G(`Optional direct peer (desk). Leave empty when phones only talk via gateway.`),K(`Client id`,`core.userId`,`L-196`),G(`Short fleet id (L-196, L-210, …). Used as WS userId/clientId — not airpad-client.`),K(`Ecosystem token`,`core.ecosystemToken`,`shared ecosystem key`,`password`),G(`One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token.`),K(`Destination node ids`,`core.socket.routeTarget`,`L-196;L-210;L-208`),G(Nt),J(`Allow insecure TLS`,`core.allowInsecureTls`)],Ft=()=>[`Clipboard`,J(`Accept inbound clipboard`,`shell.acceptInboundClipboardData`),J(`Apply remote clipboard to device`,`shell.applyRemoteClipboardToDevice`),K(`Inbound clipboard allow ids`,`shell.clipboardInboundAllowIds`,`* or L-196;L-210`),G(Nt),K(`Share-intent destination ids`,`shell.clipboardShareDestinationIds`,`L-196;L-210;L-110`),G(Nt),`Clipboard prompt`,Y(`Outbound mode`,`shell.clipboardOutboundMode`,[[`auto`,`Auto — share + show popup (Erase optional)`],[`ask`,`Ask — hold share until confirmed`]]),Y(`Inbound mode`,`shell.clipboardInboundMode`,[[`auto`,`Auto — apply + show popup (Undo optional)`],[`ask`,`Ask — hold apply until confirmed`]]),J(`Show Erase on outbound auto popup`,`shell.clipboardOutboundShowErase`),J(`Show Undo on inbound auto popup`,`shell.clipboardInboundShowUndo`),q(`Popup auto-dismiss (ms)`,`shell.clipboardPromptDismissMs`,{min:`1000`,step:`500`,placeholder:`10000`}),G(`On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.`)],It=()=>[`Native wire (Capacitor)`,J(`Prefer native Java WebSocket`,`core.interop.preferNativeWebsocket`),J(`Maintain hub socket in background`,`shell.maintainHubSocketConnection`)],Lt=()=>[`Device`,J(`Start CWSP on boot`,`shell.autoStartOnBoot`),J(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),J(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),J(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),G(`Save may request contacts / notifications when those toggles are on. SMS is not used.`)],Rt=()=>H({id:`cwsp`,label:`CWSP`,order:55,render:e=>{let t=[...Pt(),...Ft()];return e.surface===`capacitor`||e.surface===`native`?t.push(...It(),...Lt()):t.push(...It()),X(`cwsp`,`CWSP`,t)},load:(e,t)=>{let n=t.querySelector(`[data-field="core.ecosystemToken"]`);n&&(n.value=h(e))},save:e=>{g(e)}})})),Bt,Vt=e((()=>{W(),Z(),Bt=()=>H({id:`device`,label:`Extension`,order:80,surfaces:[`crx`],render:()=>X(`device`,`Extension preferences`,[J(`Start CWSP on boot`,`shell.autoStartOnBoot`),J(`Foreground CWSP service`,`shell.bridgeDaemonEnabled`),J(`Enable remote clipboard bridge`,`shell.enableRemoteClipboardBridge`),J(`Accept contacts bridge`,`shell.acceptContactsBridgeData`),G(`Save may open system permission UI when bridge toggles are enabled.`)])})})),Ht,Ut=e((()=>{W(),Z(),Ht=()=>H({id:`reader`,label:`Reader`,order:60,requiresView:`viewer`,render:()=>X(`reader`,`Reader`,[q(`Default zoom (%)`,`views.reader.zoomPercent`,{min:`50`,max:`300`,step:`10`,placeholder:`100`}),J(`Wrap long lines`,`views.reader.wrapLongLines`)])})})),Wt,Gt=e((()=>{W(),Z(),Wt=()=>H({id:`workcenter`,label:`Work Center`,order:65,requiresView:`workcenter`,render:()=>X(`workcenter`,`Work Center`,[J(`Auto-run pinned tasks`,`views.workcenter.autoRunPinned`),K(`Default instruction id`,`views.workcenter.defaultInstructionId`,`(none)`)])})})),Kt,qt,Jt=e((()=>{Mt(),zt(),Vt(),Ut(),Gt(),Kt=!1,qt=()=>{Kt||(Kt=!0,Rt(),Ht(),Wt(),Q(),Bt())}})),Yt,Xt,Zt,Qt,$t,en=e((()=>{b(),Yt=e=>e.isExtension||e.surface===`crx`?`extension`:(e.surface===`capacitor`||e.surface===`native`)&&!(y(`workcenter`)||y(`viewer`)||y(`explorer`))?`cwsp-mobile`:`full`,Xt=[`appearance`,`markdown`,`ai`,`mcp`,`server`,`instructions`,`extension`],Zt=(e,t)=>{if(t===`cwsp-mobile`)for(let t of Xt)e.querySelector(`[data-tab-panel="${t}"]`)?.remove(),e.querySelector(`[data-action="switch-settings-tab"][data-tab="${t}"]`)?.remove()},Qt=e=>e===`cwsp-mobile`?`cwsp`:e===`extension`?`extension`:`ai`,$t=(e,t)=>!!e.querySelector(`[data-tab-panel="${t}"]`)})),tn,nn,rn,an,on,sn,cn,ln,un,$,dn,fn,pn,mn,hn,gn,_n,vn=e((()=>{_(),b(),W(),Jt(),m(),we(),en(),c(),tn=`[data-settings-tabs]`,nn=`.settings-screen__body`,rn=()=>{try{let e=globalThis;if(e?.chrome?.runtime?.id)return`crx`;if(e?.Capacitor?.isNativePlatform?.())return`capacitor`;if(e?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`)return`web`}catch{}return`unknown`},an=(e,t)=>{if(e.requiresView&&!y(e.requiresView))return!1;let n=e.surfaces;return!(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface))},on=e=>U().filter(t=>an(t,e)),sn=(e,t)=>{let n=e.querySelector(tn),r=e.querySelector(nn);if(!(!n||!r))for(let i of on(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},cn=(e,t,n)=>{for(let r of on(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`);t&&n(r,t)}},ln=(e,t,n)=>{cn(e,n,(e,r)=>{try{e.manualFields||kt(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},un=(e,t,n)=>{cn(e,n,(e,r)=>{try{e.manualFields||At(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},$=e=>!!e&&typeof e==`object`&&!Array.isArray(e),dn=(e,t)=>{if(!$(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if($(t)&&$(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return $(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},fn=async e=>{let t=await e(),n=await w();return dn(t,n)},pn=async(e,t,n={})=>{let r=await w(),i=dn(n,r);return ln(e,i,t),i},mn=async(e,t,n)=>(un(e,t,n),xe(t)),hn=e=>on(e).map(e=>e.id),gn=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},_n=async e=>{g(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await l(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-DrmbeIAT.js`).then(e=>(e.u(),e.a));return{sanitizeFleetSelfWireNodeId:e}},[],import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=typeof t.endpointUrl==`string`?t.endpointUrl:``,a=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!i.trim()&&!a.trim())return;let o=gn()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},s=await p({relayHttpsUrl:i,directHttpsUrl:a},o);s.relayHttpsUrl!==void 0&&(t.endpointUrl=s.relayHttpsUrl),s.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:s.directHttpsUrl})}})),yn,bn=e((()=>{o(),re(),_(),ke(),ee(),ce(),M(),Ze(),se(),rt(),z(),ct(),B(),dt(),pt(),ht(),_t(),yt(),Ct(),Tt(),vn(),ye(),De(),A(),c(),yn=e=>{let n=null,r=null,i=()=>{let e=rn();return e===`capacitor`||e===`native`?8e3:2500},a=(e,t)=>{n&&(r&&=(clearTimeout(r),null),n.textContent=e,n.classList.remove(`note--ok`,`note--warn`,`note--err`),t?.tone===`ok`&&n.classList.add(`note--ok`),t?.tone===`warn`&&n.classList.add(`note--warn`),t?.tone===`err`&&n.classList.add(`note--err`),e&&!t?.persist&&(r=setTimeout(()=>{n&&(n.textContent=``,n.classList.remove(`note--ok`,`note--warn`,`note--err`))},i())))},o=t`<div class="view-settings" data-view="settings">
    ${lt()}
    <div class="settings-screen__body">
      ${ut()}
      ${ft()}
      ${mt()}
      ${gt()}
      ${vt()}
      ${St(a)}
      ${wt()}
    </div>
    ${st()}
  </div>`;k(o),qt();let s={isExtension:e.isExtension,surface:rn()},c=Yt(s);sn(o,s),Zt(o,c),c===`full`&&(s.surface===`capacitor`||s.surface===`native`)&&(o.querySelector(`[data-tab-panel="server"]`)?.remove(),o.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let u=e=>$t(o,e),d=e=>o.querySelector(e);n=o.querySelector(`[data-note]`);let ee=d(`[data-field="ai.baseUrl"]`),p=d(`[data-field="ai.apiKey"]`),m=d(`[data-field="ui.showKey"]`),h=d(`[data-field="ai.model"]`),g=d(`[data-field="ai.customModel"]`),_=o.querySelector(`[data-field-group="ai.customModel"]`),re=d(`[data-field="ai.defaultReasoningEffort"]`),se=d(`[data-field="ai.defaultVerbosity"]`),ce=d(`[data-field="ai.maxOutputTokens"]`),y=d(`[data-field="ai.contextTruncation"]`),le=d(`[data-field="ai.promptCacheRetention"]`),ue=d(`[data-field="ai.maxToolCalls"]`),fe=d(`[data-field="ai.parallelToolCalls"]`),pe=d(`[data-field="ai.requestTimeout.low"]`),b=d(`[data-field="ai.requestTimeout.medium"]`),he=d(`[data-field="ai.requestTimeout.high"]`),_e=d(`[data-field="ai.maxRetries"]`),ve=d(`[data-field="ai.shareTargetMode"]`),x=()=>{let e=(h?.value||``).trim()===`custom`;_&&(_.hidden=!e),g&&(g.disabled=!e)};if(h){h.replaceChildren();for(let e of te){let t=document.createElement(`option`);t.value=e,t.textContent=e,h.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,h.append(e),h.addEventListener(`change`,x)}g?.addEventListener(`focus`,()=>{h&&(h.value=`custom`,x())});let ye=d(`[data-field="ai.autoProcessShared"]`),S=d(`[data-field="ai.responseLanguage"]`),be=d(`[data-field="ai.translateResults"]`),xe=d(`[data-field="ai.generateSvgGraphics"]`),C=d(`[data-field="speech.language"]`),w=d(`[data-field="appearance.theme"]`),Se=d(`[data-field="appearance.fontSize"]`),Ce=d(`[data-field="appearance.markdown.preset"]`),we=d(`[data-field="appearance.markdown.fontFamily"]`),Te=d(`[data-field="appearance.markdown.fontSizePx"]`),Ee=d(`[data-field="appearance.markdown.lineHeight"]`),De=d(`[data-field="appearance.markdown.contentMaxWidthPx"]`),ke=d(`[data-field="appearance.markdown.printScale"]`),T=d(`[data-field="appearance.markdown.page.size"]`),je=d(`[data-field="appearance.markdown.page.orientation"]`),Me=d(`[data-field="appearance.markdown.page.marginMm"]`),Ne=d(`[data-field="appearance.markdown.modules.typography"]`),Pe=d(`[data-field="appearance.markdown.modules.lists"]`),Fe=d(`[data-field="appearance.markdown.modules.tables"]`),Ie=d(`[data-field="appearance.markdown.modules.codeBlocks"]`),Le=d(`[data-field="appearance.markdown.modules.blockquotes"]`),Re=d(`[data-field="appearance.markdown.modules.media"]`),ze=d(`[data-field="appearance.markdown.modules.printBreaks"]`),Be=d(`[data-field="appearance.markdown.plugins.smartTypography"]`),Ve=d(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),He=d(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),E=o.querySelector(`[data-field="appearance.markdown.customCss"]`),Ue=o.querySelector(`[data-field="appearance.markdown.printCss"]`),D=o.querySelector(`[data-field="appearance.markdown.extensions"]`),O=d(`[data-field="core.ntpEnabled"]`),A=d(`[data-field="core.mode"]`),j=d(`[data-field="core.endpointUrl"]`),Ke=d(`[data-field="core.userId"]`),M=d(`[data-field="core.userKey"]`),N=d(`[data-field="core.ecosystemToken"]`),qe=d(`[data-field="core.preferBackendSync"]`),Ye=d(`[data-field="core.encrypt"]`),Xe=d(`[data-field="core.appClientId"]`),Ze=d(`[data-field="core.allowInsecureTls"]`),P=d(`[data-field="core.ops.allowUnencrypted"]`),F=d(`[data-field="core.admin.httpsOrigin"]`),rt=d(`[data-field="core.admin.httpOrigin"]`),z=d(`[data-field="core.admin.path"]`),ct=d(`[data-field="core.useCoreIdentityForAirPad"]`),B=d(`[data-field="core.socket.accessToken"]`),dt=d(`[data-field="core.socket.routeTarget"]`),pt=d(`[data-field="core.socket.clientAccessToken"]`),ht=d(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),_t=d(`[data-field="shell.maintainHubSocketConnection"]`),yt=d(`[data-field="shell.clipboardBroadcastTargets"]`),bt=d(`[data-field="shell.pushLocalClipboardToLan"]`),xt=d(`[data-field="shell.clipboardPushIntervalMs"]`),Ct=d(`[data-field="shell.enableRemoteClipboardBridge"]`),Tt=d(`[data-field="shell.acceptInboundClipboardData"]`),V=d(`[data-field="shell.clipboardInboundAllowIds"]`),H=d(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),U=d(`[data-field="shell.clipboardShareDestinationIds"]`),Et=d(`[data-field="shell.applyRemoteClipboardToDevice"]`),Dt=d(`[data-field="shell.acceptContactsBridgeData"]`),Ot=d(`[data-field="shell.acceptSmsBridgeData"]`),kt=d(`[data-field="shell.enableNativeSms"]`),At=d(`[data-field="shell.enableNativeContacts"]`),W=o.querySelector(`[data-admin-preview]`),G=o.querySelector(`[data-mcp-section]`),jt=o.querySelector(`[data-section="extension"]`),K=o.querySelector(`[data-extension-tab]`);if(S){S.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,S.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,S.append(t);for(let e of et()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,S.append(t)}}if(C){C.replaceChildren();for(let e of $e()){let t=document.createElement(`option`);t.value=e,t.textContent=Qe(e),C.append(t)}}o.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&X()}),o.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&X()});let q=e=>{let t=Qt(c),n=e||t;o.querySelector(`[data-tab-panel="${n}"]`)||(n=o.querySelector(`[data-tab-panel]`)?.getAttribute(`data-tab-panel`)||t),o.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let r=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(r)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let i=o.querySelectorAll(`[data-tab-panel]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}k(o)};for(let e of o.querySelectorAll(`[data-settings-tabs] button[type="button"][data-action="switch-settings-tab"][data-tab]`))e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),q(e.getAttribute(`data-tab`)||Qt(c))});let J=e=>{let t=Qt(c),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?u(`markdown`)?`markdown`:t:new Set([...u(`appearance`)?[`appearance`]:[],...u(`markdown`)?[`markdown`]:[],...u(`ai`)?[`ai`]:[],...u(`mcp`)?[`mcp`]:[],...u(`server`)?[`server`]:[],...u(`instructions`)?[`instructions`]:[],...u(`extension`)?[`extension`]:[],...hn(s)]).has(n)?n:t:t},Y=()=>{let e=N?.value?.trim()||M?.value?.trim()||B?.value?.trim()||``;return{mode:A?.value||`native`,endpointUrl:j?.value?.trim()||``,userId:Ke?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!Ye?.checked,preferBackendSync:(qe?.checked??!0)!==!1,appClientId:Xe?.value?.trim()||``,allowInsecureTls:!!Ze?.checked,useCoreIdentityForAirPad:(ct?.checked??!0)!==!1,socket:{accessToken:e,routeTarget:dt?.value?.trim()||``,selfId:``,clientAccessToken:pt?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!ht?.checked},admin:{httpsOrigin:F?.value?.trim()||``,httpOrigin:rt?.value?.trim()||``,path:z?.value?.trim()||`/`},ops:{allowUnencrypted:!!P?.checked}}},X=()=>{if(!W)return;let e=Oe(Y());W.textContent=`Resolved: ${e.https} · ${e.http}`},Z=e=>{try{We(Ge.EXPLORER_PATH,e),Je(`explorer`),f({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),a(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),a(`Failed to open Explorer path.`)}};if(Promise.resolve((async()=>((s.surface===`capacitor`||s.surface===`native`)&&await ie().catch(()=>null),fn(()=>ne())))()).then(t=>{ee&&(ee.value=(t?.ai?.baseUrl||``).trim()),p&&(p.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.4`).trim(),r=(t?.ai?.customModel||``).trim();if(h){let e=te.includes(n);n===`custom`||!e&&n?(h.value=`custom`,g&&(g.value=r||n)):(h.value=e?n:`gpt-5.4`,g&&(g.value=r)),x()}if(re&&(re.value=t?.ai?.defaultReasoningEffort||`medium`),se&&(se.value=t?.ai?.defaultVerbosity||`medium`),ce&&(ce.value=String(t?.ai?.maxOutputTokens??4e5)),y&&(y.value=t?.ai?.contextTruncation||`disabled`),le&&(le.value=t?.ai?.promptCacheRetention||`in-memory`),ue&&(ue.value=String(t?.ai?.maxToolCalls??8)),fe&&(fe.checked=(t?.ai?.parallelToolCalls??!0)!==!1),pe&&(pe.value=String(t?.ai?.requestTimeout?.low??6e4)),b&&(b.value=String(t?.ai?.requestTimeout?.medium??3e5)),he&&(he.value=String(t?.ai?.requestTimeout?.high??9e5)),_e&&(_e.value=String(t?.ai?.maxRetries??2)),ve&&(ve.value=t?.ai?.shareTargetMode||`recognize`),ye&&(ye.checked=(t?.ai?.autoProcessShared??!0)!==!1),S&&(S.value=t?.ai?.responseLanguage||`auto`),be&&(be.checked=!!t?.ai?.translateResults),xe&&(xe.checked=!!t?.ai?.generateSvgGraphics),C&&(C.value=t?.speech?.language||`en-US`),w&&(w.value=t?.appearance?.theme||`auto`),Se&&(Se.value=t?.appearance?.fontSize||`medium`),Ce&&(Ce.value=t?.appearance?.markdown?.preset||`default`),we&&(we.value=t?.appearance?.markdown?.fontFamily||`system`),Te&&(Te.value=String(t?.appearance?.markdown?.fontSizePx??16)),Ee&&(Ee.value=String(t?.appearance?.markdown?.lineHeight??1.7)),De&&(De.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),ke&&(ke.value=String(t?.appearance?.markdown?.printScale??1)),T&&(T.value=t?.appearance?.markdown?.page?.size||`auto`),je&&(je.value=t?.appearance?.markdown?.page?.orientation||`portrait`),Me&&(Me.value=String(t?.appearance?.markdown?.page?.marginMm??12)),Ne&&(Ne.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),Pe&&(Pe.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),Fe&&(Fe.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),Ie&&(Ie.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),Le&&(Le.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),Re&&(Re.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),ze&&(ze.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),Be&&(Be.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),Ve&&(Ve.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),He&&(He.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),E&&(E.value=(t?.appearance?.markdown?.customCss||``).trim()),Ue&&(Ue.value=(t?.appearance?.markdown?.printCss||``).trim()),D){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];D.value=e.length>0?JSON.stringify(e,null,2):``}O&&(O.checked=!!t?.core?.ntpEnabled),A&&(A.value=t?.core?.mode||`native`),j&&(j.value=(t?.core?.endpointUrl||``).trim()),Ke&&(Ke.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();N&&(N.value=e),M&&(M.value=e),B&&(B.value=e)}if(qe&&(qe.checked=(t?.core?.preferBackendSync??!0)!==!1),Ye&&(Ye.checked=!!t?.core?.encrypt),Xe&&(Xe.value=(t?.core?.appClientId||``).trim()),ct&&(ct.checked=(t?.core?.useCoreIdentityForAirPad??!0)!==!1),dt&&(dt.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),pt&&(pt.value=(t?.core?.socket?.clientAccessToken||``).trim()),ht&&(ht.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),Ze&&(Ze.checked=!!t?.core?.allowInsecureTls),P&&(P.checked=!!t?.core?.ops?.allowUnencrypted),F&&(F.value=(t?.core?.admin?.httpsOrigin||``).trim()),rt&&(rt.value=(t?.core?.admin?.httpOrigin||``).trim()),z&&(z.value=(t?.core?.admin?.path||`/`).trim()||`/`),_t&&(_t.checked=!!t?.shell?.maintainHubSocketConnection),yt&&(yt.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),bt&&(bt.checked=!!t?.shell?.pushLocalClipboardToLan),xt){let e=Number(t?.shell?.clipboardPushIntervalMs);xt.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}Ct&&(Ct.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),Tt&&(Tt.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),V&&(V.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),H&&(H.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),U&&(U.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),Et&&(Et.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),Dt&&(Dt.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),Ot&&(Ot.checked=!ge()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),kt&&(kt.checked=!ge()&&(t?.shell?.enableNativeSms??!1)===!0),At&&(At.checked=(t?.shell?.enableNativeContacts??!0)!==!1),X(),ot(G,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),v(t),de(t),ln(o,t,s),e.onTheme?.(t?.appearance?.theme||`auto`)}).catch(()=>{ot(G,[])}),m?.addEventListener(`change`,()=>{!p||!m||(p.type=m.checked?`text`:`password`)}),w?.addEventListener(`change`,()=>{let t=w.value||`auto`;(async()=>{try{let e=await ne();de({...e,appearance:{...e.appearance||{},theme:t}})}catch{de({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),o.addEventListener(`click`,t=>{let n=nt(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&G){G.querySelector(`.mcp-empty-note`)?.remove(),G.appendChild(it({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),G&&!G.querySelector(`[data-mcp-id]`)&&ot(G,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){Z(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){Z(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){Ae(Y(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){Ae(Y(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=Oe(Y());navigator.clipboard?.writeText?.(e.https).then(()=>a(`HTTPS admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=Oe(Y());navigator.clipboard?.writeText?.(e.http).then(()=>a(`HTTP admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){l(()=>import(`./clipboard-device-C1jGUTXQ.js`).then(e=>(e.n(),e.t)).then(e=>e.openAppClipboardRelatedSettings()),[],import.meta.url).then(()=>a(`App settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){l(()=>import(`./clipboard-device-C1jGUTXQ.js`).then(e=>(e.n(),e.t)).then(e=>e.openNativeNotificationSettings?.()),[],import.meta.url).then(()=>a(`Notification settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{a(`Saving…`,{tone:`warn`});let t=await ne(),n=t.appearance?.markdown?.extensions||[],r=u(`markdown`)&&D?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){q(`markdown`),a(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:u(`ai`)?{baseUrl:ee?.value?.trim?.()||``,apiKey:p?.value?.trim?.()||``,model:h?.value||`gpt-5.4`,customModel:h?.value===`custom`&&g?.value?.trim?.()||``,defaultReasoningEffort:re?.value||`medium`,defaultVerbosity:se?.value||`medium`,maxOutputTokens:I(ce?.value,4e5),contextTruncation:y?.value||`disabled`,promptCacheRetention:le?.value||`in-memory`,maxToolCalls:I(ue?.value,8),parallelToolCalls:(fe?.checked??!0)!==!1,requestTimeout:{low:I(pe?.value,6e4),medium:I(b?.value,3e5),high:I(he?.value,9e5)},maxRetries:I(_e?.value,2),shareTargetMode:ve?.value||`recognize`,autoProcessShared:(ye?.checked??!0)!==!1,responseLanguage:S?.value||`auto`,translateResults:!!be?.checked,generateSvgGraphics:!!xe?.checked,mcp:u(`mcp`)?at(G):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:u(`ai`)?{language:C?.value||`en-US`}:t.speech||{},core:u(`server`)?{...t.core,ntpEnabled:R(O,!!t.core?.ntpEnabled),mode:L(A,t.core?.mode||`native`)||`native`,endpointUrl:L(j,t.core?.endpointUrl||``),userId:L(Ke,t.core?.userId||``),ecosystemToken:L(N,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||L(M,t.core?.userKey||``)||L(B,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:L(N,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||L(M,t.core?.userKey||``)||L(B,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:R(Ye,!!t.core?.encrypt),preferBackendSync:R(qe,(t.core?.preferBackendSync??!0)!==!1),appClientId:L(Xe,t.core?.appClientId||``),allowInsecureTls:R(Ze,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:R(ct,(t.core?.useCoreIdentityForAirPad??!0)!==!1),socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=L(N,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||L(M,t.core?.userKey||``)||L(B,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:L(dt,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:L(pt,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:R(ht,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:L(F,t.core?.admin?.httpsOrigin||``),httpOrigin:L(rt,t.core?.admin?.httpOrigin||``),path:L(z,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:R(P,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:u(`server`)?{...t.shell||{},maintainHubSocketConnection:R(_t,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:L(yt,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:R(bt,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=xt?.value,n=I(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:R(Ct,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:R(Tt,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:L(V,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:R(H,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:L(U,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:R(Et,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:R(Dt,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!ge()&&R(Ot,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!ge()&&R(kt,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:R(At,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:u(`appearance`)||u(`markdown`)?{theme:w?.value||`auto`,fontSize:Se?.value||`medium`,markdown:{preset:Ce?.value||`default`,fontFamily:we?.value||`system`,fontSizePx:I(Te?.value,16),lineHeight:tt(Ee?.value,1.7,1.1,2.2),contentMaxWidthPx:I(De?.value,860),printScale:tt(ke?.value,1,.5,1.5),page:{size:T?.value||`auto`,orientation:je?.value||`portrait`,marginMm:I(Me?.value,12)},modules:{typography:(Ne?.checked??!0)!==!1,lists:(Pe?.checked??!0)!==!1,tables:(Fe?.checked??!0)!==!1,codeBlocks:(Ie?.checked??!0)!==!1,blockquotes:(Le?.checked??!0)!==!1,media:(Re?.checked??!0)!==!1,printBreaks:(ze?.checked??!0)!==!1},plugins:{smartTypography:!!Be?.checked,softBreaksAsBr:!!Ve?.checked,externalLinksNewTab:(He?.checked??!0)!==!1},customCss:E?.value||``,printCss:Ue?.value||``,extensions:n||[]}}:t.appearance||{}};un(o,i,s),await _n(i);let c=i,d=s.surface===`capacitor`||s.surface===`native`?me(c).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),f=await ae(c);if(!f){a(`Settings save returned no data.`,{tone:`err`});return}try{await mn(o,f,s)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e)}ln(o,f,s);let m=oe(),_=await d,te=_.lines,ie=_.results.some(e=>e.granted===!1);l(()=>import(`./cwsp-app.js`).then(e=>(e.S(),e.x)).then(async e=>{if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.key||`cwsp-neutralino-local`),i=f.core,a=String(i?.ecosystemToken||i?.userKey||i?.socket?.accessToken||``).trim(),o={};i?.endpointUrl&&(o.remoteHost=String(i.endpointUrl).trim()),a&&(o.accessToken=a,o.clientToken=a),i?.userId&&(o.clientId=String(i.userId).trim()),o.force=!0,await fetch(`http://127.0.0.1:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":r},body:JSON.stringify(o),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await l(async()=>{let{invokeCwsNative:e}=await import(`./cwsp-app.js`).then(e=>(e.P(),e.N));return{invokeCwsNative:e}},[],import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(f),l(()=>import(`./websocket-DOCbpCr1.js`).then(e=>(e.i(),e.s)).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),[],import.meta.url).catch(()=>void 0)}),[],import.meta.url),de(f),e.onTheme?.(f.appearance?.theme||`auto`);let v=[`Saved locally`];m.nativeSynced===!0?v.push(`synced to Android`):m.nativeSynced===!1&&!ie?console.warn(`[Settings] native settings patch:`,m.nativeError||`not confirmed`):m.nativeSynced===!1&&v.push(`native sync failed${m.nativeError?`: ${m.nativeError}`:``}`),m.webnativeSynced===!0?v.push(`synced to Node backend`):m.webnativeSynced===!1&&v.push(`Node sync failed${m.webnativeError?`: ${m.webnativeError}`:``}`),te.length&&v.push(...te);let x=`ok`;(ie||m.webnativeSynced===!1)&&(x=`warn`),a(v.join(` · `),{tone:x})})().catch(e=>a(String(e),{tone:`err`}))}),e.isExtension){jt&&(jt.hidden=!1),K&&(K.hidden=!1);let e=t`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;o.append(e)}let Q=J(e.initialTab);if(q(Q),!o.querySelector(`[data-tab-panel="${Q}"]:not([hidden])`)){let e=o.querySelector(`[data-tab-panel]`);e&&q(e.getAttribute(`data-tab-panel`)||Q)}x();let Mt=o.querySelectorAll(`[data-tab-panel]`).length,Nt=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${c} surface=${s.surface} tabs=${Nt} panels=${Mt} active=${o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(Mt===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,o.querySelector(`.settings-screen__body`)?.appendChild(e),q(`cwsp`)}return o.addEventListener(`cwsp-settings-resync`,()=>{k(o),q(o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Q)}),o}}));function xn(e){return new Cn(e)}var Sn,Cn;e((()=>{r(),a(),ze(),A(),bn(),W(),vn(),we(),c(),Sn={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Cn=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=n(Sn);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id;return this.element=yn({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>k(this.element)),this.element}getToolbar(){return null}setupEventHandlers(){}loadSettings(){this.settings.value={...Sn}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...Sn},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){k(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(s(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===Be.Patch||e===Be.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([l(()=>import(`./Settings-_zeU2dzM.js`).then(e=>(e.i(),e.t)),[],import.meta.url),l(()=>import(`./cwsp-app.js`).then(e=>(e.E(),e.w)),[],import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}}}))();export{Cn as SettingsView,ln as applyContributions,Te as clearSettingsSyncArms,un as collectContributions,C as createMemorySettingsSyncArm,yn as createSettingsView,xn as createView,xn as default,Ce as detectSettingsSurface,U as getSettingsContributions,be as getSettingsDefaults,he as getSettingsSnapshot,w as getSettingsSync,pn as hydrateContributionsFromSync,_e as mergeSettingsPatch,sn as mountContributions,xe as patchSettingsSync,mn as persistContributionsViaSync,Q as registerAirpadSettingsContribution,qt as registerBuiltinSettingsContributions,Rt as registerCwspSettingsContribution,Bt as registerDeviceSettingsContribution,Ht as registerReaderSettingsContribution,H as registerSettingsContribution,Ee as registerSettingsSyncArm,Wt as registerWorkcenterSettingsContribution,rn as resolveSettingsSurface,ve as resolveSettingsSyncArm,x as setSurfaceDetector,Se as unregisterSettingsSyncArm};