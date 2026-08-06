import { f as isEnabledView } from "./views.js";
import { g as removeAdopted } from "../fest/dom.js";
import { l as ref, s as observe } from "../fest/object.js";
import { l as sendMessage } from "./UnifiedMessaging.js";
import { i as H } from "../com/app.js";
import "../com/app2.js";
import { t as DEFAULT_INSTRUCTION_TEMPLATES } from "./templates.js";
import { i as resolveEcosystemToken, r as normalizeEcosystemToken, t as BUILTIN_AI_MODELS } from "./SettingsTypes.js";
import { W as resolveCwspUrlFields } from "./airpad-cwsp-client-parity.js";
import { t as applyAirpadRuntimeFromAppSettings } from "./remote-connection-runtime.js";
import { a as loadSettings, i as getLastSettingsSaveReport, n as ensureCapacitorCwspSettingsSeeded, o as noteSettingsControlSync, r as ensureCrxCwspSettingsSeeded, s as saveSettings } from "./Settings.js";
import { n as applyTheme } from "./Theme.js";
import { n as isCapacitorNative } from "./capacitor-permissions.js";
import { n as requestCapacitorSettingsPermissionsAfterSave } from "./capacitor-settings-permissions.js";
import { n as navigateToView } from "../shells/boot-shell-slots.js";
import { i as SettingsChannelAction } from "./channel-actions.js";
import { n as openAdminDoorFromCore, r as resolveAdminDoorUrls } from "./admin-doors.js";
import { c as updateInstruction, i as deleteInstruction, n as addInstruction, o as getInstructionRegistry, r as addInstructions, s as setActiveInstruction } from "./CustomInstructions.js";
import { r as setString, t as StorageKeys } from "../com/app7.js";
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-styles-attach.ts
var STYLE_MARKER = "data-settings-view-css";
/**
* WHY: Inlined `@layer` loses to unlayered shell CSS in Capacitor / ui-window hosts — unwrap for paint.
* COMPAT: Vite often prefixes `@charset` and the SCSS file may start with a block comment, so a
* strict `^@layer` match never fired and tab/panel rules stayed layered (and lost).
*/
var normalizeInlineSettingsCss = (raw) => {
	let css = String(raw || "").trim();
	css = css.replace(/^(@charset\s+[^;]+;\s*)+/i, "");
	for (let i = 0; i < 8; i++) {
		const next = css.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
		if (next === css) break;
		css = next.trim();
	}
	const layered = css.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);
	if (layered) css = layered[1].trim();
	return css;
};
/**
* Layout-only fallback when SCSS inline import is empty.
* INVARIANT: no hardcoded dark `color`/`background` — Settings.scss owns theme via `--sv-*`.
* INVARIANT: only `.is-active` tab panels paint (`.card { display:flex }` must not reveal siblings).
*/
var CRITICAL_SETTINGS_CSS = `
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;grid-template-columns:minmax(0,1fr)!important;inline-size:100%!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;pointer-events:auto!important;container-type:inline-size}
.view-settings .settings-screen__top{display:flex!important;flex-direction:column!important;align-items:stretch!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;pointer-events:auto!important}
.view-settings .settings-tab-actions{display:flex!important;flex-wrap:nowrap!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;overflow-x:auto!important;overflow-y:hidden!important;pointer-events:auto!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch;pointer-events:auto!important}
.view-settings [data-tab-panel]:not(.is-active),.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings [data-tab-panel].is-active:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important;pointer-events:auto!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select,.view-settings .btn,.view-settings .card{pointer-events:auto!important}
.view-settings .settings-tab-btn{pointer-events:auto!important;cursor:pointer!important;flex:0 0 auto!important}
`;
/** Attach Settings.scss to a `.view-settings` host (works in light DOM + open shadow roots). */
var attachSettingsInlineStyles = (host) => {
	if (!host?.classList?.contains("view-settings")) return;
	if (host.querySelector(`style[${STYLE_MARKER}]`)) return;
	let css = normalizeInlineSettingsCss(String("@layer settings-view{:is(html[data-theme=light] .view-settings,:host-context(html[data-theme=light]) .view-settings){color-scheme:light only;--sv-bg:var(--color-surface,--u2-color-mod(var(--base-color,#5a7fff),40));--sv-fg:var(--color-on-surface,--u2-color-mod(var(--base-color,#5a7fff),900));--sv-muted:var(--color-on-surface-variant,--u2-color-mod(var(--base-color,#5a7fff),700));--sv-outline:var(--color-outline-variant,--u2-color-mod(var(--base-color,#5a7fff),400));--sv-surface-1:var(--color-surface-container-low,--u2-color-mod(var(--base-color,#5a7fff),10));--sv-surface-2:var(--color-surface-container,--u2-color-mod(var(--base-color,#5a7fff),10))}:is(html[data-theme=dark] .view-settings,:host-context(html[data-theme=dark]) .view-settings){color-scheme:dark only;--sv-bg:var(--color-surface,--u2-color-mod(var(--base-color,#5a7fff),1000));--sv-fg:var(--color-on-surface,--u2-color-mod(var(--base-color,#5a7fff),100));--sv-muted:var(--color-on-surface-variant,--u2-color-mod(var(--base-color,#5a7fff),280));--sv-outline:var(--color-outline-variant,--u2-color-mod(var(--base-color,#5a7fff),640));--sv-surface-1:var(--color-surface-container-low,--u2-color-mod(var(--base-color,#5a7fff),900));--sv-surface-2:var(--color-surface-container,--u2-color-mod(var(--base-color,#5a7fff),960))}.view-settings{color-scheme:inherit;--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--sv-accent:light-dark(--u2-color-mod(oklch(from var(--sv-primary,#5a7fff) calc(l * 1.5) calc(c * 2) h),600),--u2-color-mod(oklch(from var(--sv-primary,#5a7fff) calc(l * 1.8) calc(c * 2) h),400));--sv-on-primary:var(\n        --color-on-primary,light-dark(--u2-color-mod(var(--sv-primary,#5a7fff),10),--u2-color-mod(var(--sv-primary,#5a7fff),990))\n    );--sv-elev:0 2px 14px color-mix(in oklab,var(--sv-fg,light-dark(#12151a,#e8edf2)) 5%,transparent);--sv-divider:color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 35%,transparent);--sv-ring:color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 55%,transparent);background-color:var(--sv-surface-1,light-dark(#ffffff,#171c24));block-size:100%;color:var(--sv-fg,light-dark(#12151a,#e8edf2));container-name:settings-view;container-type:inline-size;display:grid;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;margin:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:clamp(.5rem,2cqi,1rem);pointer-events:auto;text-align:start;touch-action:pan-x pan-y}.view-settings,.view-settings *,.view-settings :after,.view-settings :before{box-sizing:border-box}.view-settings :where(select,input,textarea,option,button){font-family:inherit;pointer-events:auto}.view-settings textarea{container-type:inline-size;inline-size:100%;max-inline-size:100%;resize:vertical}.view-settings :is(h2,h3){color:var(--sv-fg,light-dark(#12151a,#e8edf2));margin:0;text-align:start}.view-settings h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em}.view-settings h3{font-size:.94rem;font-weight:600;letter-spacing:-.01em}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--sv-divider);display:flex;flex-direction:column;flex-shrink:0;gap:.75rem;inline-size:100%;max-inline-size:100%;max-inline-size:stretch;min-inline-size:0;overflow:visible;padding-block-end:.875rem}.view-settings .settings-screen__title{flex:0 0 auto;font-size:clamp(1.05rem,2.5cqi,1.35rem);font-weight:600;letter-spacing:-.015em;max-inline-size:stretch;overflow:visible}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:1rem;max-inline-size:stretch;overscroll-behavior:contain;padding-block:.75rem;scrollbar-color:var(--sv-outline,light-dark(#c5cdd8,#3d4755)) transparent;scrollbar-width:thin;touch-action:pan-y}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 45%,transparent);border-radius:99px}.view-settings .settings-screen__footer{align-items:center;background:transparent;display:flex;flex-shrink:0;flex-wrap:wrap;gap:.5rem;inline-size:stretch;justify-content:flex-start;max-inline-size:stretch;padding-block:.75rem;padding-inline:.25rem}.view-settings .settings-tab-actions{align-items:center;display:flex;flex:0 0 auto;flex-wrap:nowrap;gap:.375rem;inline-size:100%;max-inline-size:100%;max-inline-size:stretch;min-inline-size:0;overflow-x:auto;overflow-y:hidden;pointer-events:auto;position:relative;scrollbar-color:var(--sv-outline,light-dark(#c5cdd8,#3d4755)) transparent;scrollbar-width:thin;touch-action:pan-x;z-index:1}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--sv-surface-2,light-dark(#f4f6fa,#1c232d)) 94%,transparent);border:none;border-radius:999px;color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));cursor:pointer;font-size:.75rem;font-weight:500;max-inline-size:stretch;min-block-size:2.5rem;padding:.5rem .875rem;pointer-events:auto;transition:background-color .12s ease,color .12s ease,box-shadow .12s ease;white-space:nowrap}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.view-settings .settings-tab-btn{color:contrast-color(var(--sv-surface-2,light-dark(#f4f6fa,#1c232d)))}}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--sv-surface-2,light-dark(#f4f6fa,#1c232d)) 100%,transparent);color:var(--sv-fg,light-dark(#12151a,#e8edf2))}.view-settings .settings-tab-btn.is-active{background:var(--sv-accent,var(--sv-primary,#5a7fff));color:var(--sv-on-primary)}@supports (color:contrast-color(red)){.view-settings .settings-tab-btn.is-active{color:contrast-color(var(--sv-accent,var(--sv-primary,#5a7fff)))}}.view-settings .settings-tab-panel{max-inline-size:stretch;pointer-events:auto;scrollbar-width:none;touch-action:pan-x pan-y}.view-settings :is(.settings-tab-panel:not(.is-active),.settings-tab-panel[hidden]){display:none!important}.view-settings .settings-tab-panel.is-active:not([hidden]){align-items:stretch;display:flex!important;flex-direction:column;gap:.75rem;min-inline-size:0}.view-settings .card{background:var(--sv-surface-2,light-dark(#f4f6fa,#1c232d));border:none;border-radius:16px;box-shadow:none;display:flex;flex-direction:column;gap:.75rem;inline-size:stretch;max-inline-size:stretch;padding:1rem}@container settings-view (max-inline-size: 480px){.view-settings .card{border-radius:14px;padding:.875rem}}.view-settings .settings-panel-form{display:flex;flex-direction:column;gap:.75rem;inline-size:stretch;max-inline-size:stretch}.view-settings .field{display:grid;font-size:.75rem;gap:.375rem;grid-auto-flow:row;inline-size:stretch;margin:0;max-inline-size:stretch;pointer-events:auto}.view-settings .field>span{color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));font-size:.75rem;font-weight:500}.view-settings .field.checkbox{align-items:center;gap:.625rem;grid-auto-columns:minmax(0,max-content) 1fr;grid-auto-flow:column;max-inline-size:stretch}.view-settings .field-hint{color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));font-size:.85em;line-height:1.45;margin:0 0 .75rem;max-inline-size:stretch;opacity:.95}.view-settings :is(.form-input,.form-select){background:var(--sv-surface-1,light-dark(#ffffff,#171c24));border:0 transparent;border-radius:10px;box-shadow:none;color:var(--sv-fg,light-dark(#12151a,#e8edf2));display:block;font-size:.875rem;inline-size:100%;line-height:1.25;max-inline-size:stretch;min-block-size:2.5rem;outline:none;outline:0 none transparent;padding:.5rem .65rem;transition:border-color .12s ease,box-shadow .12s ease}.view-settings :is(select.form-input,select.form-select){background-color:var(--sv-surface-1,light-dark(#ffffff,#171c24));background-position:calc(100% - 14px) calc(50% - 2px),calc(100% - 9px) calc(50% - 2px);background-repeat:no-repeat;background-size:5px 5px;border:0 transparent;box-shadow:none;max-inline-size:stretch;outline:0 none transparent;padding-inline-end:2rem;pointer-events:auto}.view-settings .btn{align-items:center;background:color-mix(in oklab,var(--sv-surface-1,light-dark(#ffffff,#171c24)) 90%,transparent);border:none;border-radius:999px;color:var(--sv-fg,var(--color-on-surface));cursor:pointer;display:inline-flex;font-size:.8125rem;font-weight:500;gap:.35rem;justify-content:center;max-inline-size:stretch;min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color .12s ease,filter .12s ease}@supports (color:contrast-color(red)){.view-settings .btn{color:contrast-color(var(--sv-surface-1,var(--color-surface)))}}.view-settings .btn:hover{background:color-mix(in oklab,var(--sv-fg,light-dark(#12151a,#e8edf2)) 6%,var(--sv-surface-1,light-dark(#ffffff,#171c24)))}.view-settings .btn.primary{background:var(--sv-accent,var(--sv-primary,#5a7fff));color:var(--sv-on-primary)}@supports (color:contrast-color(red)){.view-settings .btn.primary{color:contrast-color(var(--sv-accent,var(--sv-primary,#5a7fff)))}}.view-settings .btn.primary:hover{filter:brightness(1.1)}.view-settings :is(.btn.btn-sm,.btn.small){font-size:.75rem;min-block-size:2rem;padding:.35rem .65rem}.view-settings .btn.btn-danger{background:color-mix(in oklab,var(--sv-danger,#d32f2f) 92%,#000);color:var(--sv-on-primary)}.view-settings .btn.btn-danger:hover{filter:brightness(1.08)}.view-settings .btn.tiny{font-size:.72rem;min-block-size:2rem;padding:.3rem .5rem}.view-settings :is(.ext-note,.note){color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));display:block;flex:1 1 auto;font-size:.75rem;line-height:1.35;max-inline-size:100%;max-inline-size:stretch;opacity:.92;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:normal}.view-settings :is(.ext-note.note--ok,.note.note--ok){color:color-mix(in oklab,var(--sv-accent,#3ecf8e) 70%,var(--sv-fg,light-dark(#12151a,#e8edf2)))}.view-settings :is(.ext-note.note--warn,.note.note--warn){color:color-mix(in oklab,#e6a700 75%,var(--sv-fg,light-dark(#12151a,#e8edf2)))}.view-settings :is(.ext-note.note--err,.note.note--err){color:color-mix(in oklab,#e05252 80%,var(--sv-fg,light-dark(#12151a,#e8edf2)))}.view-settings .ext-note{line-height:1.4;max-inline-size:stretch}.view-settings .ext-note code{background:color-mix(in oklab,var(--sv-surface-1,light-dark(#ffffff,#171c24)) 80%,var(--sv-bg,light-dark(#eef1f6,#0f1318)));border-radius:4px;color:var(--sv-fg,light-dark(#12151a,#e8edf2));font-size:.68rem;max-inline-size:stretch;padding:2px 6px}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{accent-color:var(--sv-accent,var(--sv-primary,#5a7fff));block-size:1.15rem;flex-shrink:0;inline-size:1.15rem;max-inline-size:stretch}.view-settings .mcp-section{display:flex;flex-direction:column;gap:.5rem;max-inline-size:stretch}.view-settings .mcp-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-start:.5rem;max-inline-size:stretch}.view-settings .mcp-row{background:color-mix(in oklab,var(--sv-surface-1,light-dark(#ffffff,#171c24)) 88%,var(--sv-bg,light-dark(#eef1f6,#0f1318)));border-radius:12px;display:grid;gap:.5rem;max-inline-size:stretch;padding:.75rem}.view-settings .mcp-empty-note,.view-settings .mcp-row .field{margin:0;max-inline-size:stretch}.view-settings .mcp-empty-note{color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));font-size:.75rem}.view-settings .settings-spoiler{background:color-mix(in oklab,var(--sv-surface-1,light-dark(#ffffff,#171c24)) 55%,transparent);border:1px solid color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 22%,transparent);border-radius:12px;max-inline-size:stretch;padding:.25rem .5rem}.view-settings .settings-spoiler summary{color:var(--sv-fg,light-dark(#12151a,#e8edf2));cursor:pointer;font-size:.8rem;font-weight:600;max-inline-size:stretch;padding:.35rem .25rem}.view-settings .settings-spoiler .settings-panel-form{max-inline-size:stretch;padding-block-end:.25rem}.view-settings .view-settings__content{inline-size:100%;max-inline-size:min(clamp(640px,90%,800px),100%)}.view-settings .view-settings__section{border-block-end:1px solid var(--sv-divider);display:flex;flex-direction:column;margin-block-end:2rem;max-inline-size:stretch;padding-block-end:2rem}.view-settings .view-settings__section:last-of-type{border-block-end:none}.view-settings .view-settings__group{display:flex;flex-direction:column;gap:1rem;max-inline-size:stretch}.view-settings .view-settings__label{display:flex;flex-direction:column;gap:.375rem;max-inline-size:stretch}.view-settings .view-settings__label>span{font-size:.8125rem;font-weight:500}.view-settings :is(.view-settings__input,.view-settings__select){background:var(--sv-surface-1,light-dark(#ffffff,#171c24));border:0 transparent;border-radius:10px;box-shadow:none;color:var(--sv-fg,light-dark(#12151a,#e8edf2));font-size:.875rem;max-inline-size:stretch;min-block-size:2.5rem;outline:0 none transparent;padding:.45rem .6rem}.view-settings .view-settings__checkbox{align-items:center;display:flex;font-size:.8125rem;gap:.5rem;max-inline-size:stretch}.view-settings .view-settings__actions{display:flex;gap:.75rem;margin-block-start:1.5rem;max-inline-size:stretch}.view-settings .view-settings__btn{background:transparent;border:1px solid color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 40%,transparent);border-radius:8px;color:var(--sv-fg,light-dark(#12151a,#e8edf2));cursor:pointer;max-inline-size:stretch;padding:.55rem 1.1rem}@supports (color:light-dark(red,red)){.view-settings .view-settings__btn{color:var(--sv-fg,light-dark(#12151a,#e8edf2))}}@supports (color:contrast-color(red)){.view-settings .view-settings__btn{color:contrast-color(var(--sv-surface-1,var(--color-surface)))}}.view-settings .view-settings__btn--primary{background:var(--sv-accent,var(--sv-primary,#5a7fff));border-color:color-mix(in oklab,var(--sv-accent,var(--sv-primary,#5a7fff)) 35%,transparent);color:var(--sv-on-primary)}@supports (color:contrast-color(red)){.view-settings .view-settings__btn--primary{color:contrast-color(var(--sv-accent,var(--sv-primary,#5a7fff)))}}.view-settings .view-settings__btn--primary:hover{filter:brightness(1.1)}.view-settings :is(.custom-instructions-editor,.custom-instructions-panel){display:flex;flex-direction:column;gap:.75rem;max-inline-size:stretch}.view-settings :is(.ci-row,.cip-select-row){display:flex;flex-direction:column;gap:.35rem;max-inline-size:stretch}.view-settings .ci-header{margin-block-end:.25rem;max-inline-size:stretch}.view-settings .ci-header h4{font-size:.88rem;margin:0 0 .25rem}.view-settings .ci-desc{color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));font-size:.78rem;line-height:1.45;margin:0;max-inline-size:stretch}.view-settings .ci-active-select{display:flex;flex-direction:column;gap:.25rem;max-inline-size:stretch}.view-settings :is(.ci-select,.cip-select){background:var(--sv-surface-1,light-dark(#ffffff,#171c24));border:1px solid color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 40%,transparent);border-radius:10px;color:var(--sv-fg,light-dark(#12151a,#e8edf2));font-size:.8rem;max-inline-size:stretch;min-block-size:2.35rem;padding:.4rem .55rem}.view-settings :is(.ci-list,.cip-list){display:flex;flex-direction:column;gap:.5rem;max-inline-size:stretch}.view-settings :is(.ci-item,.cip-item){background:var(--sv-surface-1,light-dark(#ffffff,#171c24));border:1px solid color-mix(in oklab,var(--sv-outline,light-dark(#c5cdd8,#3d4755)) 16%,transparent);border-radius:12px;max-inline-size:stretch;padding:.65rem .75rem}.view-settings :is(.ci-item.active,.ci-item.is-active,.cip-item.active,.cip-item.is-active){border-color:color-mix(in oklab,var(--sv-primary,#5a7fff) 35%,transparent)}.view-settings :is(.ci-item-header,.cip-item-header){align-items:flex-start;display:flex;gap:.5rem;justify-content:space-between;max-inline-size:stretch}.view-settings :is(.ci-item-label,.cip-item-label){font-size:.8rem;font-weight:600;max-inline-size:stretch}.view-settings :is(.ci-item-actions,.cip-item-actions){display:flex;flex-wrap:wrap;gap:.35rem;justify-content:start;max-inline-size:stretch}.view-settings :is(.ci-badge,.cip-badge){background:color-mix(in oklab,var(--sv-primary,#5a7fff) 16%,transparent);border-radius:999px;color:var(--sv-fg,light-dark(#12151a,#e8edf2));font-size:.65rem;max-inline-size:stretch;padding:.15rem .4rem}.view-settings :is(.ci-item-preview,.cip-item-preview){color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));font-size:.75rem;line-height:1.45;margin-block-start:.35rem;max-inline-size:stretch}.view-settings :is(.ci-edit-form,.cip-edit-form){display:flex;flex-direction:column;gap:.5rem;margin-block-start:.5rem;max-inline-size:stretch}.view-settings :is(.ci-actions,.ci-add-actions,.ci-edit-actions,.cip-form-actions,.cip-toolbar){align-items:center;display:flex;flex-wrap:wrap;gap:.5rem;max-inline-size:stretch}.view-settings :is(.ci-input,.ci-textarea,.cip-input,.cip-textarea,.field-control){background:var(--sv-surface-1,light-dark(#ffffff,#171c24));border:0 transparent;border-radius:10px;box-shadow:none;color:var(--sv-fg,light-dark(#12151a,#e8edf2));font-size:.8125rem;inline-size:100%;max-inline-size:stretch;outline:0 none transparent;padding:.45rem .55rem}.view-settings :is(.ci-textarea,.cip-textarea){max-inline-size:stretch;min-block-size:5rem}.view-settings :is(.ci-empty,.cip-empty){font-size:.8rem;padding:.75rem;text-align:center}.view-settings .field-label,.view-settings :is(.ci-empty,.cip-empty){color:var(--sv-muted,light-dark(#5c6570,#a8b0bc));max-inline-size:stretch}.view-settings .field-label{font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}@container settings-view (max-inline-size: 1024px){.view-settings{max-inline-size:stretch;padding:.65rem}}@container settings-view (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.3rem;max-inline-size:stretch}.view-settings .settings-tab-btn{max-inline-size:stretch;min-block-size:2.65rem;padding-inline:.7rem}}@container settings-view (max-inline-size: 480px){.view-settings{padding:.45rem}.view-settings .settings-screen__title{display:none;max-inline-size:stretch}.view-settings .settings-screen__body{gap:.75rem;max-inline-size:stretch;padding-block:.5rem}.view-settings .settings-screen__footer{align-items:stretch;flex-direction:column-reverse;gap:.5rem;max-inline-size:stretch}.view-settings .settings-screen__footer .btn.primary{inline-size:100%;justify-content:center;max-inline-size:stretch;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{max-inline-size:stretch;text-align:center;white-space:normal}}}"));
	if (!css.trim()) css = CRITICAL_SETTINGS_CSS;
	const style = document.createElement("style");
	style.setAttribute(STYLE_MARKER, "");
	style.textContent = css;
	host.insertBefore(style, host.firstChild);
};
/** Retry until the host is connected (Capacitor shell attaches views async). */
var attachSettingsInlineStylesWhenConnected = (host) => {
	if (!host) return;
	const tryAttach = () => {
		if (!host.isConnected) {
			requestAnimationFrame(tryAttach);
			return;
		}
		attachSettingsInlineStyles(host);
	};
	if (host.isConnected) attachSettingsInlineStyles(host);
	else requestAnimationFrame(tryAttach);
};
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-utils.ts
var SUPPORTED_SPEECH_LANGUAGES = [
	"en",
	"ru",
	"en-GB",
	"en-US"
];
var speechLanguageLabel = (lang) => {
	if (lang === "en") return "English (generic)";
	if (lang === "ru") return "Russian";
	if (lang === "en-GB") return "English (UK)";
	return "English (US)";
};
var normalizeSpeechLanguage = (lang) => {
	const value = (lang || "").trim();
	if (!value) return null;
	if (value === "ru" || value.startsWith("ru-")) return "ru";
	if (value === "en-GB") return "en-GB";
	if (value === "en-US") return "en-US";
	if (value === "en" || value.startsWith("en-")) return "en";
	return null;
};
var buildSpeechLanguageOptions = () => {
	const ordered = /* @__PURE__ */ new Set();
	const navLanguages = typeof navigator !== "undefined" ? [...navigator.languages || [], navigator.language] : [];
	for (const navLanguage of navLanguages) {
		const normalized = normalizeSpeechLanguage(navLanguage);
		if (normalized) ordered.add(normalized);
	}
	for (const fallback of SUPPORTED_SPEECH_LANGUAGES) ordered.add(fallback);
	return Array.from(ordered);
};
var buildResponseLanguageOptions = () => {
	const ordered = /* @__PURE__ */ new Set(["ru", "en"]);
	const navLanguages = typeof navigator !== "undefined" ? [...navigator.languages || [], navigator.language] : [];
	for (const navLanguage of navLanguages) {
		const value = (navLanguage || "").trim();
		if (!value || value === "en" || value === "ru") continue;
		ordered.add(value);
	}
	return Array.from(ordered);
};
var parseNumberOrDefault = (value, fallback) => {
	const parsed = Number((value || "").trim());
	if (!Number.isFinite(parsed)) return fallback;
	return parsed;
};
var parseFloatInRange = (value, fallback, min, max) => {
	const parsed = Number.parseFloat((value || "").trim());
	if (!Number.isFinite(parsed)) return fallback;
	return Math.max(min, Math.min(max, parsed));
};
var readTrimmedControlValue = (control, fallback = "") => {
	if (!control) return fallback;
	const value = control.value.trim();
	if (!value && control instanceof HTMLInputElement && control.type === "password") return fallback;
	return value || fallback;
};
var readCheckboxValue = (control, fallback) => {
	return control ? Boolean(control.checked) : fallback;
};
/**
* Innermost `Element` for delegated handlers — prefer `composedPath()` so Text targets,
* shadow-tree retargeting, and Chrome extension pages resolve like a real hit element.
*/
var eventTargetElement = (ev) => {
	if (typeof ev.composedPath === "function") {
		for (const n of ev.composedPath()) if (n instanceof Element) return n;
	}
	const raw = ev.target;
	if (raw instanceof Element) return raw;
	if (raw instanceof Text) return raw.parentElement;
	return null;
};
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-mcp.ts
var createMcpRow = (cfg) => {
	const safeCfg = {
		id: (cfg?.id || `mcp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`).trim(),
		serverLabel: (cfg?.serverLabel || "").trim(),
		origin: (cfg?.origin || "").trim(),
		clientKey: (cfg?.clientKey || "").trim(),
		secretKey: (cfg?.secretKey || "").trim()
	};
	return H`<div class="field mcp-row" data-mcp-id=${safeCfg.id}>
            <label class="field">
              <span>Server Label</span>
              <input class="form-input" type="text" data-mcp-field="serverLabel" autocomplete="off" value="${safeCfg.serverLabel}" />
            </label>
            <label class="field">
              <span>Origin</span>
              <input class="form-input" type="url" data-mcp-field="origin" autocomplete="off" placeholder="https://server.example" value="${safeCfg.origin}" />
            </label>
            <label class="field">
              <span>Client Key</span>
              <input class="form-input" type="text" data-mcp-field="clientKey" autocomplete="off" value="${safeCfg.clientKey}" />
            </label>
            <label class="field">
              <span>Secret Key</span>
              <input class="form-input" type="password" data-mcp-field="secretKey" autocomplete="off" placeholder="sk-..." value="${safeCfg.secretKey}" />
            </label>
            <button class="btn btn-danger" type="button" data-action="remove-mcp-server">Remove</button>
          </div>`;
};
var collectMcpConfigurations = (mcpSection) => {
	if (!mcpSection) return [];
	const rows = Array.from(mcpSection.querySelectorAll("[data-mcp-id]"));
	const items = [];
	for (const row of rows) {
		const id = row.getAttribute("data-mcp-id") || `mcp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
		const serverLabel = row.querySelector("[data-mcp-field=\"serverLabel\"]")?.value?.trim() || "";
		const origin = row.querySelector("[data-mcp-field=\"origin\"]")?.value?.trim() || "";
		const clientKey = row.querySelector("[data-mcp-field=\"clientKey\"]")?.value?.trim() || "";
		const secretKey = row.querySelector("[data-mcp-field=\"secretKey\"]")?.value?.trim() || "";
		if (!serverLabel) continue;
		items.push({
			id,
			serverLabel,
			origin,
			clientKey,
			secretKey
		});
	}
	return items;
};
var renderMcpConfigurations = (mcpSection, configs) => {
	if (!mcpSection) return;
	mcpSection.replaceChildren();
	const list = Array.isArray(configs) ? configs : [];
	if (!list.length) {
		mcpSection.appendChild(H`<p class="mcp-empty-note">No MCP servers configured.</p>`);
		return;
	}
	list.forEach((cfg) => mcpSection.appendChild(createMcpRow(cfg)));
};
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsFooter.ts
var createSettingsFooter = () => H`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsHeader.ts
/** Top title + category tabs. */
var createSettingsHeader = () => H`<header class="settings-screen__top">
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsAppearance.ts
var createAppearanceSection = () => H`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsMarkdown.ts
var createMarkdownSection = () => H`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsAI.ts
var createAiSection = () => H`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsMcp.ts
var createMcpSection = () => H`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsServer.ts
/** CWSP endpoint and device identity. */
var createServerSection = () => H`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/CustomInstructionsEditor.ts
var createCustomInstructionsEditor = (opts = {}) => {
	const state = observe({
		instructions: [],
		activeId: "",
		editingId: null,
		newLabel: "",
		newInstruction: "",
		isAdding: false
	});
	const root = H`<div class="custom-instructions-editor">
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
    </div>`;
	const listEl = root.querySelector("[data-list]");
	const selectEl = root.querySelector("[data-action='select-active']");
	const addFormEl = root.querySelector("[data-add-form]");
	const labelInput = root.querySelector("[data-field='label']");
	const instructionInput = root.querySelector("[data-field='instruction']");
	const renderList = () => {
		listEl.replaceChildren();
		const items = state.instructions ?? [];
		if (!items.length) {
			listEl.append(H`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);
			return;
		}
		for (const instr of items) {
			const isEditing = state.editingId === instr.id;
			const isActive = state.activeId === instr.id;
			const item = H`<div class="ci-item ${isActive ? "active" : ""}" data-id="${instr.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${instr.label}</span>
                    <div class="ci-item-actions">
                        ${isActive ? H`<span class="ci-badge active">Active</span>` : H`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${isEditing ? H`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${instr.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${instr.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>` : H`<div class="ci-item-preview">${truncate(instr.instruction, 120)}</div>`}
            </div>`;
			item.addEventListener("click", (e) => {
				const action = e.target.closest("[data-action]")?.getAttribute("data-action");
				if (action === "activate") setActiveInstruction(instr.id).then(loadData).then(() => opts.onUpdate?.());
				if (action === "edit") {
					state.editingId = instr.id;
					renderList();
				}
				if (action === "delete") {
					if (confirm(`Delete "${instr.label}"?`)) deleteInstruction(instr.id).then(loadData).then(() => opts.onUpdate?.());
				}
				if (action === "save-edit") {
					const labelEl = item.querySelector("[data-edit-field='label']");
					const instrEl = item.querySelector("[data-edit-field='instruction']");
					updateInstruction(instr.id, {
						label: labelEl.value.trim() || instr.label,
						instruction: instrEl.value.trim()
					}).then(() => {
						state.editingId = null;
						return loadData();
					}).then(() => opts.onUpdate?.());
				}
				if (action === "cancel-edit") {
					state.editingId = null;
					renderList();
				}
			});
			listEl.append(item);
		}
	};
	const updateSelect = () => {
		selectEl.replaceChildren();
		selectEl.append(H`<option value="">None (use default)</option>`);
		for (const instr of state.instructions ?? []) {
			const opt = H`<option value="${instr.id}">${instr.label}</option>`;
			if (instr.id === state.activeId) opt.selected = true;
			selectEl.append(opt);
		}
	};
	const truncate = (text, maxLen) => {
		if (!text || text.length <= maxLen) return text || "";
		return text.slice(0, maxLen).trim() + "…";
	};
	const loadData = async () => {
		const raw = await getInstructionRegistry();
		const snapshot = Array.isArray(raw) ? {
			instructions: raw,
			activeId: "",
			activeInstruction: null
		} : raw;
		state.instructions = snapshot?.instructions ?? [];
		state.activeId = snapshot?.activeId ?? "";
		renderList();
		updateSelect();
	};
	root.addEventListener("click", (e) => {
		const action = e.target.closest("[data-action]")?.getAttribute("data-action");
		if (action === "add") {
			state.isAdding = true;
			addFormEl.hidden = false;
			labelInput.value = "";
			instructionInput.value = "";
			labelInput.focus();
		}
		if (action === "cancel-add") {
			state.isAdding = false;
			addFormEl.hidden = true;
		}
		if (action === "save-new") {
			const label = labelInput.value.trim();
			const instruction = instructionInput.value.trim();
			if (!instruction) {
				instructionInput.focus();
				return;
			}
			addInstruction(label || "Custom", instruction).then((newInstr) => {
				if (!newInstr) return;
				state.isAdding = false;
				addFormEl.hidden = true;
				return loadData();
			}).then(() => opts.onUpdate?.());
		}
		if (action === "add-templates") {
			const existingLabels = new Set((state.instructions ?? []).map((i) => i.label.trim().toLowerCase()));
			const templatesToAdd = DEFAULT_INSTRUCTION_TEMPLATES.filter((t) => !existingLabels.has(t.label.trim().toLowerCase()));
			if (!templatesToAdd.length) {
				alert("All templates are already added.");
				return;
			}
			addInstructions(templatesToAdd.map((t) => ({
				label: t.label,
				instruction: t.instruction,
				enabled: t.enabled
			}))).then(loadData).then(() => opts.onUpdate?.());
		}
	});
	selectEl.addEventListener("change", () => {
		setActiveInstruction(selectEl.value || null).then(loadData).then(() => opts.onUpdate?.());
	});
	loadData();
	return root;
};
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsInstructions.ts
var createInstructionsSection = (setNote) => H`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${createCustomInstructionsEditor({ onUpdate: () => setNote("Instructions updated.") })}
      </div>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsExtension.ts
var createExtensionSection = () => H`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
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
    </section>`;
//#endregion
//#region src/shared/other/config/SettingsContributions.ts
var registry = /* @__PURE__ */ new Map();
var registerSettingsContribution = (entry) => {
	const id = String(entry?.id || "").trim();
	if (!id) return () => {};
	const contribution = {
		...entry,
		id
	};
	registry.set(id, contribution);
	return () => {
		if (registry.get(id) === contribution) registry.delete(id);
	};
};
var getSettingsContributions = () => [...registry.values()].sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.id.localeCompare(b.id));
var getByPath = (source, path) => {
	if (!source || !path) return void 0;
	return path.split(".").reduce((acc, key) => {
		if (acc == null || typeof acc !== "object") return void 0;
		return acc[key];
	}, source);
};
var setByPath = (target, path, value) => {
	if (!target || !path) return;
	const keys = path.split(".");
	let cursor = target;
	for (let i = 0; i < keys.length - 1; i += 1) {
		const key = keys[i];
		const next = cursor[key];
		if (next == null || typeof next !== "object") cursor[key] = {};
		cursor = cursor[key];
	}
	cursor[keys[keys.length - 1]] = value;
};
var readFieldValue = (el) => {
	const input = el;
	const fieldType = (el.getAttribute("data-field-type") || "").toLowerCase();
	if (fieldType === "boolean" || input.type === "checkbox") return !!input.checked;
	const raw = "value" in input ? String(input.value ?? "") : "";
	if (fieldType === "number" || input.type === "number") {
		const n = Number(raw);
		return Number.isFinite(n) ? n : void 0;
	}
	if (fieldType === "json") try {
		return raw.trim() ? JSON.parse(raw) : void 0;
	} catch {
		return;
	}
	if (input.type === "password" && !raw.trim()) return;
	return raw;
};
/** Populate `[data-field]` controls from `AppSettings`. */
var bindContributionFields = (panel, settings) => {
	panel.querySelectorAll("[data-field]").forEach((el) => {
		const path = el.getAttribute("data-field");
		if (!path) return;
		const value = getByPath(settings, path);
		if (value === void 0) return;
		const input = el;
		if (input.type === "checkbox") {
			input.checked = !!value;
			return;
		}
		if (el.getAttribute("data-field-type") === "json") {
			try {
				input.value = typeof value === "string" ? value : JSON.stringify(value, null, 2);
			} catch {
				input.value = "";
			}
			return;
		}
		if ("value" in input) input.value = String(value ?? "");
	});
};
/** Merge `[data-field]` control values into `AppSettings`. */
var collectContributionFields = (panel, settings) => {
	const target = settings;
	panel.querySelectorAll("[data-field]").forEach((el) => {
		const path = el.getAttribute("data-field");
		if (!path) return;
		const value = readFieldValue(el);
		if (value === void 0) return;
		setByPath(target, path, value);
	});
};
//#endregion
//#region src/shared/other/config/settings/settings-contribution-ui.ts
/**
* DOM helpers for settings contribution panels (no fest/lure — safe for any host).
*/
var settingsHint = (text) => {
	const p = document.createElement("p");
	p.className = "field-hint";
	p.textContent = text;
	return p;
};
var settingsHeading = (text) => {
	const h = document.createElement("h4");
	h.textContent = text;
	return h;
};
var settingsTextField = (label, path, placeholder = "", type = "text") => {
	const wrap = document.createElement("label");
	wrap.className = "field";
	const span = document.createElement("span");
	span.textContent = label;
	const input = document.createElement("input");
	input.className = "form-input";
	input.type = type;
	input.autocomplete = "off";
	input.setAttribute("data-field", path);
	if (placeholder) input.placeholder = placeholder;
	wrap.append(span, input);
	return wrap;
};
var settingsNumberField = (label, path, attrs = {}) => {
	const wrap = document.createElement("label");
	wrap.className = "field";
	const span = document.createElement("span");
	span.textContent = label;
	const input = document.createElement("input");
	input.className = "form-input";
	input.type = "number";
	input.setAttribute("data-field", path);
	if (attrs.min) input.min = attrs.min;
	if (attrs.max) input.max = attrs.max;
	if (attrs.step) input.step = attrs.step;
	if (attrs.placeholder) input.placeholder = attrs.placeholder;
	wrap.append(span, input);
	return wrap;
};
var settingsCheckboxField = (label, path) => {
	const wrap = document.createElement("label");
	wrap.className = "field checkbox form-checkbox";
	const input = document.createElement("input");
	input.type = "checkbox";
	input.setAttribute("data-field", path);
	const span = document.createElement("span");
	span.textContent = label;
	wrap.append(input, span);
	return wrap;
};
var settingsSelectField = (label, path, options) => {
	const wrap = document.createElement("label");
	wrap.className = "field";
	const span = document.createElement("span");
	span.textContent = label;
	const sel = document.createElement("select");
	sel.className = "form-select";
	sel.setAttribute("data-field", path);
	for (const [value, text] of options) {
		const opt = document.createElement("option");
		opt.value = value;
		opt.textContent = text;
		sel.appendChild(opt);
	}
	wrap.append(span, sel);
	return wrap;
};
/** Action button (not a settings field) — wire via `data-action` in Settings.ts. */
var settingsButton = (label, action, opts) => {
	const btn = document.createElement("button");
	btn.type = "button";
	btn.className = opts?.className || (opts?.primary ? "view-settings__btn view-settings__btn--primary" : "view-settings__btn");
	btn.setAttribute("data-action", action);
	btn.textContent = label;
	return btn;
};
/** Horizontal row of action buttons. */
var settingsButtonRow = (...buttons) => {
	const row = document.createElement("div");
	row.className = "field settings-action-row";
	row.style.display = "flex";
	row.style.flexWrap = "wrap";
	row.style.gap = "0.5rem";
	for (const btn of buttons) row.appendChild(btn);
	return row;
};
/**
* Read-only secret display: masked with dots until View; Copy writes the real value.
* WHY: Control public token / rotating device code must not sit in cleartext by default.
*/
var settingsSecretDisplayField = (label, dataKey, opts) => {
	const wrap = document.createElement("div");
	wrap.className = "field settings-secret-field";
	wrap.setAttribute("data-secret-field", dataKey);
	const span = document.createElement("span");
	span.textContent = label;
	const row = document.createElement("div");
	row.style.cssText = "display:flex;gap:.4rem;align-items:center;margin-top:.3rem;";
	const input = document.createElement("input");
	input.className = "form-input";
	input.type = "password";
	input.readOnly = true;
	input.autocomplete = "off";
	input.spellcheck = false;
	input.placeholder = opts?.placeholder || "••••••";
	input.setAttribute(`data-${dataKey}`, "1");
	input.setAttribute("data-secret-input", dataKey);
	input.value = "";
	if (opts?.mono) {
		input.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
		input.style.fontSize = "0.9rem";
		input.style.letterSpacing = "0.04em";
	} else {
		input.style.fontSize = "1.15rem";
		input.style.fontWeight = "700";
		input.style.letterSpacing = "0.12em";
	}
	input.style.flex = "1 1 auto";
	input.style.minWidth = "0";
	const viewBtn = document.createElement("button");
	viewBtn.type = "button";
	viewBtn.className = "view-settings__btn";
	viewBtn.textContent = "View";
	viewBtn.title = "Show / hide";
	viewBtn.setAttribute("data-action", "control-secret-toggle");
	viewBtn.setAttribute("data-secret-for", dataKey);
	const copyBtn = document.createElement("button");
	copyBtn.type = "button";
	copyBtn.className = "view-settings__btn";
	copyBtn.textContent = "Copy";
	copyBtn.title = "Copy to clipboard";
	copyBtn.setAttribute("data-action", "control-secret-copy");
	copyBtn.setAttribute("data-secret-for", dataKey);
	const meta = document.createElement("p");
	meta.className = "field-hint";
	meta.setAttribute("data-secret-meta", dataKey);
	meta.style.margin = "0.2rem 0 0";
	meta.textContent = "";
	const applyMasked = () => {
		const revealed = input.dataset.revealed === "1";
		input.type = revealed ? "text" : "password";
		viewBtn.textContent = revealed ? "Hide" : "View";
	};
	viewBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		input.dataset.revealed = input.dataset.revealed === "1" ? "0" : "1";
		applyMasked();
	});
	copyBtn.addEventListener("click", async (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		const value = String(input.value || "").trim();
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
			const prev = copyBtn.textContent;
			copyBtn.textContent = "Copied";
			window.setTimeout(() => {
				copyBtn.textContent = prev || "Copy";
			}, 1200);
		} catch {
			input.type = "text";
			input.select();
			try {
				document.execCommand("copy");
			} catch {}
			applyMasked();
		}
	});
	row.append(input, viewBtn, copyBtn);
	wrap.append(span, row, meta);
	return wrap;
};
var settingsPanel = (id, title, children) => {
	const section = document.createElement("section");
	section.className = "card settings-tab-panel";
	section.setAttribute("data-tab-panel", id);
	section.hidden = true;
	const h3 = document.createElement("h3");
	h3.textContent = title;
	section.appendChild(h3);
	for (const child of children) if (typeof child === "string") section.appendChild(settingsHeading(child));
	else section.appendChild(child);
	return section;
};
//#endregion
//#region src/shared/other/config/settings/contributions/cwsp.ts
var MULTI_VALUE_HINT = "Separate with comma, semicolon, space, or newline. Short IDs: L-110, L-196, L-200, L-208, L-210.";
var CRX_DESK_CLIENT_ID_DEFAULT = "L-110";
var isCrxWireId = (value) => /^L-\d{1,3}-crx$/i.test(String(value ?? "").trim());
var pickDeskClientId = (...candidates) => {
	for (const raw of candidates) {
		const id = String(raw ?? "").trim();
		if (id && !isCrxWireId(id)) return id;
	}
	return CRX_DESK_CLIENT_ID_DEFAULT;
};
var connectionFields = (ctx) => {
	const isCrx = ctx.surface === "crx" || Boolean(ctx.isExtension);
	const fields = [
		settingsHint(isCrx ? "CWSP tab syncs Neutralino portable (/service/config + clipboard-hub). Chrome wire hub URL is under Extension → Local hub URL — not this Relay field." : "Persist to IDB; Neutralino/WebNative also syncs to Node portable.config + clipboard-hub."),
		"Connection",
		settingsTextField("Relay / gateway host", "core.endpointUrl", "https://192.168.0.200:8434;https://45.147.121.152:8434"),
		settingsHint(isCrx ? "Neutralino/Node gateway SoT only. Does not overwrite Extension Local hub URL. External/WAN hosts may require the ecosystem token (and gateway login for Control)." : "Coordinator / gateway. Multi-hub: separate with `;` or `,` (never `:`). Always include :8434 — bare host dials :443 where /ws is not served (404)."),
		settingsTextField("Direct host (optional)", "core.ops.directUrl", "https://192.168.0.110:8434"),
		settingsHint("Optional direct peer (desk). Leave empty when phones only talk via gateway.")
	];
	if (!isCrx) fields.push(settingsTextField("Client id", "core.userId", "L-196 or L-110"), settingsHint("Short fleet id (L-196, L-210, …)."));
	else fields.push(settingsTextField("Client id (Neutralino / backend)", "shell.clientId", "L-110"), settingsHint("Desk Node identity for portable.config / clipboard-hub / PNA. Chrome wire peer stays under Extension (L-110-crx)."));
	fields.push(settingsTextField("Ecosystem token", "core.ecosystemToken", "shared ecosystem key", "password"), settingsHint(isCrx ? "Shared ecosystem key for Neutralino + Chrome hub auth. WAN / external Relay or Local hub still needs this token (Control may also require gateway login)." : "One shared token for identification + control (replaces separate identifier / access tokens). Leave blank on Save to keep the stored token."), settingsTextField("Destination node ids", "core.socket.routeTarget", "L-196;L-210;L-208"), settingsHint(MULTI_VALUE_HINT), settingsCheckboxField("Allow insecure TLS", "core.allowInsecureTls"));
	return fields;
};
var clipboardFields = () => [
	"Clipboard",
	settingsCheckboxField("Accept inbound clipboard", "shell.acceptInboundClipboardData"),
	settingsCheckboxField("Apply remote clipboard to device", "shell.applyRemoteClipboardToDevice"),
	settingsTextField("Inbound clipboard allow ids", "shell.clipboardInboundAllowIds", "* or L-196;L-210"),
	settingsHint(MULTI_VALUE_HINT),
	settingsTextField("Share-intent destination ids", "shell.clipboardShareDestinationIds", "L-196;L-210;L-110"),
	settingsHint(MULTI_VALUE_HINT),
	"Clipboard prompt",
	settingsSelectField("Outbound mode", "shell.clipboardOutboundMode", [["auto", "Auto — share + show popup (Erase optional)"], ["ask", "Ask — hold share until confirmed"]]),
	settingsSelectField("Inbound mode", "shell.clipboardInboundMode", [["auto", "Auto — apply + show popup (Undo optional)"], ["ask", "Ask — hold apply until confirmed"]]),
	settingsCheckboxField("Show Erase on outbound auto popup", "shell.clipboardOutboundShowErase"),
	settingsCheckboxField("Show Undo on inbound auto popup", "shell.clipboardInboundShowUndo"),
	settingsNumberField("Popup auto-dismiss (ms)", "shell.clipboardPromptDismissMs", {
		min: "1000",
		step: "500",
		placeholder: "10000"
	}),
	settingsHint("On Ask mode, dismiss / timeout means no share and no apply. Defaults to 10000ms.")
];
/**
* Files transfer (Open-with / share-target / files:* hub).
* WHY: W3 hubs already honor these keys; CWSP tab had no UI until W5.
* INVARIANT: never overload clipboard prompt fields — separate shell.files*.
*/
var filesTransferFields = (ctx) => {
	const fields = [
		"Files transfer",
		settingsHint("Open-with / share-target and files:offer use these knobs. Empty destinations open a peer picker. Wildcards (`*`) need Allow share to all."),
		settingsCheckboxField("Accept inbound files", "shell.acceptInboundFilesData"),
		settingsTextField("Default destination ids", "shell.filesShareDestinationIds", "L-196;L-210 (empty = picker)"),
		settingsHint(MULTI_VALUE_HINT),
		settingsCheckboxField("Allow share to all (*)", "shell.filesAllowShareToAll"),
		settingsHint("SECURITY: off by default — blocks accidental fleet-wide files:offer fan-out."),
		settingsSelectField("Open for share", "shell.filesOpenForShareMode", [["auto", "Auto — offer when destinations are set"], ["manual", "Manual — always ask for destinations"]]),
		settingsSelectField("Inbound accept", "shell.filesInboundMode", [["ask", "Ask — Accept / Decline prompt"], ["auto", "Auto — accept into landing folder"]]),
		settingsCheckboxField("Copy received files to clipboard (for Paste / re-share)", "shell.filesCopyOnReceive"),
		settingsHint("Neutralino/Windows: after Accept, place landed files on CF_HDROP (Explorer Paste). On by default."),
		settingsSelectField("Byte transport hint", "shell.filesByteTransport", [
			["auto", "Auto — receiver chooses"],
			["http", "HTTP blob GET/PUT"],
			["ws", "WebSocket chunks"]
		]),
		settingsHint("Transport hint is advisory. Large batches still need a live blob endpoint (W4); small batches may embed.")
	];
	if (ctx.surface === "capacitor" || ctx.surface === "native") {
		const safHint = document.createElement("p");
		safHint.className = "field-hint";
		safHint.setAttribute("data-files-saf-uri", "1");
		safHint.textContent = "SAF folder: (not set)";
		const pathsHint = document.createElement("p");
		pathsHint.className = "field-hint";
		pathsHint.setAttribute("data-files-storage-paths", "1");
		pathsHint.style.whiteSpace = "pre-wrap";
		pathsHint.textContent = "Staging / landing paths: tap Show paths.";
		fields.push("Files storage (Capacitor)", settingsSelectField("Save received files to", "shell.filesLandingMode", [
			["app", "App storage (private — default)"],
			["downloads", "Downloads (user-visible)"],
			["saf", "SAF folder (pick below)"]
		]), settingsHint("App storage is NOT under Android/data in File Manager. After install, open Files → sidebar → “CWSP Files” (DocumentsProvider / SAF). Or use Downloads / SAF landing, Show paths, Share README."), safHint, settingsButtonRow(settingsButton("Choose SAF folder", "files-storage-pick-saf", { primary: true }), settingsButton("Clear SAF folder", "files-storage-clear-saf")), settingsCheckboxField("Ask for folder every time if SAF unset", "shell.filesAskDirEveryTime"), settingsSelectField("Temp staging place", "shell.filesStagingRoot", [
			["app", "App internal (files/) — default"],
			["cache", "App cache (may be purged)"],
			["external", "App external (Android/data/… — OEM may hide)"]
		]), settingsHint("Outgoing (Open-with) and incoming unpack stage here first, then export to the Save location above."), pathsHint, settingsButtonRow(settingsButton("Show paths", "files-storage-show-paths"), settingsButton("Browse CWSP Files…", "files-storage-open-explorer"), settingsButton("Share README…", "files-storage-share-readme")), "File access permissions", (() => {
			const el = document.createElement("p");
			el.className = "field-hint";
			el.setAttribute("data-files-perm-status", "1");
			el.style.whiteSpace = "pre-wrap";
			el.textContent = "Permissions: tap Refresh status. Media/storage is a runtime dialog; all-files opens system settings.";
			return el;
		})(), settingsButtonRow(settingsButton("Refresh status", "files-storage-perm-status"), settingsButton("Request media access", "files-storage-request-media", { primary: true }), settingsButton("Allow manage all files…", "files-storage-request-all-files")), settingsHint("All-files access (MANAGE_EXTERNAL_STORAGE) is for shared storage / USB / MediaStore — not other apps’ Android/data. Our tree stays under Files → CWSP Files. Play may review this permission if you publish."));
	}
	return fields;
};
var nativeWireFields = () => [
	"Native wire (Capacitor)",
	settingsCheckboxField("Prefer native Java WebSocket", "core.interop.preferNativeWebsocket"),
	settingsCheckboxField("Maintain hub socket in background", "shell.maintainHubSocketConnection")
];
/** Control pairing credentials shown on device (public token + rotating code). */
var controlPairingFields = () => [
	"Control pairing",
	settingsSecretDisplayField("Public token", "control-public-token", {
		mono: true,
		placeholder: "••••••••••••"
	}),
	settingsSecretDisplayField("Device code (20s, +10s grace)", "control-device-code", { placeholder: "••••••" }),
	settingsButtonRow(settingsButton("Refresh code", "control-pairing-refresh"), settingsButton("Regenerate public token", "control-public-token-regenerate")),
	settingsHint("Copy order for https://cwsp.u2re.space: Public token, then live Device code. Values are hidden by default — use View / Copy. Session ≤ 1 hour. Regenerating the public token invalidates old pairings.")
];
/**
* CRX Control pairing — compact status + modal trigger (no inline token/code fields).
* WHY: same UX as https://cwsp.u2re.space modal; secrets never land in portable.config.
*/
var crxControlPairingFields = () => {
	const status = document.createElement("p");
	status.className = "field-hint";
	status.setAttribute("data-crx-control-status", "1");
	status.textContent = "Control: …";
	return [
		"Control pairing",
		status,
		settingsButtonRow(settingsButton("Pair Control…", "crx-control-pair", { primary: true }), settingsButton("Unpair", "crx-control-unpair")),
		settingsHint("Opens a pairing dialog (public token + 20s device code from Neutralino). Persistent session authorizes Copy & Share / Paste by CWSP and CWSP tab sync.")
	];
};
/**
* Pairing secrets belong on the device shell (Neutralino / Capacitor), never on the
* public Control SPA. `resolveSettingsSurface()` maps Neutralino → `"web"`, so we
* must not key off `"webnative"` alone.
*/
var isPublicCwspControlSpa = () => {
	try {
		const g = globalThis;
		if (g.NL_OS != null || g.NL_PORT != null || g.Neutralino) return false;
		if (g.Capacitor?.isNativePlatform?.()) return false;
		const plat = String(g.Capacitor?.getPlatform?.() || "").toLowerCase();
		if (plat === "android" || plat === "ios") return false;
		const host = String(location.hostname || "").toLowerCase();
		if (!host || host === "localhost" || host === "127.0.0.1" || host === "[::1]") return false;
		return location.protocol === "https:";
	} catch {
		return false;
	}
};
/** Device toggles folded into CWSP tab on mobile (same `AppSettings.shell` paths). */
var mobileDeviceFields = () => [
	"Device",
	settingsCheckboxField("Start CWSP on boot", "shell.autoStartOnBoot"),
	settingsCheckboxField("Foreground CWSP service", "shell.bridgeDaemonEnabled"),
	settingsCheckboxField("Allow Control API", "shell.allowControlApi"),
	settingsHint("Allow Control API listens on :8434 so public CWSP Control can pair (public token + 20s code + Accept). Ecosystem token stays on-device for the hub — not used as the Control SPA password."),
	...controlPairingFields(),
	settingsCheckboxField("Enable remote clipboard bridge", "shell.enableRemoteClipboardBridge"),
	settingsCheckboxField("Accept contacts bridge", "shell.acceptContactsBridgeData"),
	settingsHint("Save may request contacts / notifications when those toggles are on. SMS is not used.")
];
/** Capacitor-only: sideload newer APK from gateway without SSH/SFTP File Manager. */
var mobileApkUpdateFields = () => {
	const versionHint = document.createElement("p");
	versionHint.className = "field-hint";
	versionHint.setAttribute("data-apk-local-version", "1");
	versionHint.textContent = "Installed version: … (tap Check to refresh)";
	return [
		"App update (dev)",
		versionHint,
		settingsSelectField("Update source", "shell.apkUpdateSource", [
			["wan", "WAN — https://45.147.121.152:8434"],
			["lan", "LAN — https://192.168.0.200:8434"],
			["relay", "Current Relay (core.endpointUrl)"]
		]),
		settingsButtonRow(settingsButton("Check for update", "apk-update-check"), settingsButton("Download & install", "apk-update-install", { primary: true })),
		settingsHint("Uses ecosystem token (X-API-Key) against /releases/android. Install requires the same APK signing certificate as the installed app. Each `npm run build:capacitor` auto-bumps VERSION_CODE and restages the gateway release.")
	];
};
var registerCwspSettingsContribution = () => registerSettingsContribution({
	id: "cwsp",
	label: "CWSP",
	order: 55,
	excludeSurfaces: ["markdown", "environment"],
	render: (ctx) => {
		const children = [
			...connectionFields(ctx),
			...clipboardFields(),
			...filesTransferFields(ctx)
		];
		if (ctx.surface === "capacitor" || ctx.surface === "native") children.push(...nativeWireFields(), ...mobileDeviceFields(), ...mobileApkUpdateFields());
		else if (ctx.surface === "crx" || ctx.isExtension) children.push(...crxControlPairingFields());
		else if (!isPublicCwspControlSpa()) children.push(...nativeWireFields(), ...controlPairingFields());
		return settingsPanel("cwsp", "CWSP", children);
	},
	load: (settings, panel) => {
		const input = panel.querySelector("[data-field=\"core.ecosystemToken\"]");
		if (input) input.value = resolveEcosystemToken(settings);
		const clientInput = panel.querySelector("[data-field=\"shell.clientId\"]");
		if (clientInput) {
			const desk = pickDeskClientId(clientInput.value, settings.shell?.clientId, settings.core?.userId);
			clientInput.value = desk;
			settings.shell = {
				...settings.shell || {},
				clientId: desk
			};
		}
		const src = panel.querySelector("[data-field=\"shell.apkUpdateSource\"]");
		if (src) {
			const v = String(settings.shell?.apkUpdateSource || "wan").trim();
			src.value = v === "lan" || v === "relay" ? v : "wan";
		}
		const safEl = panel.querySelector("[data-files-saf-uri]");
		if (safEl) {
			const uri = String(settings.shell?.filesIncomingDir || "").trim();
			safEl.textContent = uri ? `SAF folder: ${uri.length > 72 ? `${uri.slice(0, 36)}…${uri.slice(-28)}` : uri}` : "SAF folder: (not set)";
		}
		const refreshBtn = panel.querySelector("button[data-action=\"control-pairing-refresh\"]");
		if (refreshBtn) {
			queueMicrotask(() => refreshBtn.click());
			const prev = Number(panel.__cwspPairTimer || 0);
			if (prev) clearInterval(prev);
			panel.__cwspPairTimer = window.setInterval(() => {
				if (!panel.isConnected) return;
				refreshBtn.click();
			}, 2500);
		}
		const crxStatus = panel.querySelector("[data-crx-control-status]");
		if (crxStatus) import("./crx-control-session.js").then((m) => m.formatCrxControlSessionStatus()).then((text) => {
			if (crxStatus.isConnected) crxStatus.textContent = text;
		}).catch(() => {
			crxStatus.textContent = "Control: status unavailable";
		});
	},
	save: (settings) => {
		normalizeEcosystemToken(settings);
		if (isCrxWireId(settings.shell?.clientId)) settings.shell = {
			...settings.shell || {},
			clientId: pickDeskClientId(settings.core?.userId)
		};
	}
});
//#endregion
//#region src/shared/other/config/settings/contributions/device.ts
/**
* Former CRX-only "Extension" contribution — removed to avoid duplicate tabs.
* Capacitor folds device toggles into the CWSP tab; CRX uses the `crx` panel.
*/
var registerDeviceSettingsContribution = () => () => void 0;
//#endregion
//#region src/shared/other/config/settings/contributions/reader.ts
var registerReaderSettingsContribution = () => registerSettingsContribution({
	id: "reader",
	label: "Reader",
	order: 60,
	requiresView: "viewer",
	render: () => settingsPanel("reader", "Reader", [settingsNumberField("Default zoom (%)", "views.reader.zoomPercent", {
		min: "50",
		max: "300",
		step: "10",
		placeholder: "100"
	}), settingsCheckboxField("Wrap long lines", "views.reader.wrapLongLines")])
});
//#endregion
//#region src/shared/other/config/settings/contributions/workcenter.ts
var registerWorkcenterSettingsContribution = () => registerSettingsContribution({
	id: "workcenter",
	label: "Work Center",
	order: 65,
	requiresView: "workcenter",
	render: () => settingsPanel("workcenter", "Work Center", [settingsCheckboxField("Auto-run pinned tasks", "views.workcenter.autoRunPinned"), settingsTextField("Default instruction id", "views.workcenter.defaultInstructionId", "(none)")])
});
//#endregion
//#region src/shared/other/config/settings/register-builtin-contributions.ts
/**
* Central bootstrap for shared settings contributions.
* Views may also call individual `register*SettingsContribution()` exports
* (idempotent by contribution id).
*/
var registered = false;
var registerBuiltinSettingsContributions = () => {
	if (registered) return;
	registered = true;
	registerCwspSettingsContribution();
	registerReaderSettingsContribution();
	registerWorkcenterSettingsContribution();
};
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-sync-adapter.ts
var arms = {};
var surfaceDetector = detectSurfaceDefault;
/**
* Default surface detector — order matters (most specific first).
*
* `__CWS_WEBNATIVE_BOOT__` is set by `runtime/cwsp/webnative/app/frontend/index.ts`.
* The Capacitor native shell is detected via the `Capacitor` global injected by
* `@capacitor/core`; the CRX surface via the chrome extension global. Fallback is `web`.
*/
function detectSurfaceDefault() {
	const g = globalThis;
	if (g.__CWS_WEBNATIVE_BOOT__ || g.__CWS_NEUTRALINO_BOOT__) return "webnative";
	if (typeof g.Capacitor !== "undefined") return "capacitor";
	if (typeof g.chrome !== "undefined" && g.chrome?.runtime) return "crx";
	return "web";
}
/** Override the surface detector (used by shells that know their surface better than heuristics). */
function setSurfaceDetector(fn) {
	surfaceDetector = fn;
}
/** Register a sync arm for a surface. Shells call this at bootstrap. */
function registerSettingsSyncArm(surface, arm) {
	arms[surface] = arm;
}
/** Remove a previously registered arm (tests / shell teardown). */
function unregisterSettingsSyncArm(surface) {
	delete arms[surface];
}
/** Clear every registered arm (tests / shell teardown). */
function clearSettingsSyncArms() {
	for (const key of Object.keys(arms)) delete arms[key];
}
/**
* One-level object merge used by the reference memory arm.
*
* INVARIANT: patching a nested object must not drop sibling keys already persisted
* (hidden / unsupported UI sections must not delete persisted values).
*/
function mergeSettingsPatch(base, patch) {
	const out = { ...base };
	for (const [key, value] of Object.entries(patch)) {
		const prev = out[key];
		if (value !== null && typeof value === "object" && !Array.isArray(value) && prev !== null && typeof prev === "object" && !Array.isArray(prev)) out[key] = {
			...prev,
			...value
		};
		else out[key] = value;
	}
	return out;
}
/**
* Reference in-memory `settings:get` / `settings:patch` arm.
*
* WHY: Capacitor and WebNative backends live above this package; contract tests and
* pure-web shells need a dependency-free persistence model that matches the merge
* invariant. Shells may register this as a temporary `web` fallback.
*/
function createMemorySettingsSyncArm(initial = {}, extras = {}) {
	let store = { ...initial };
	return {
		get: async () => ({ ...store }),
		patch: async (patch) => {
			store = mergeSettingsPatch(store, patch);
			return { ...store };
		},
		...extras
	};
}
/** Current detected surface (exposed for diagnostics + arm selection). */
function detectSettingsSurface() {
	return surfaceDetector();
}
/**
* Resolve the sync arm for the current surface, falling back to `web` (IDB-only, no backend
* persistence — the historical browser/PWA behavior).
*/
function resolveSettingsSyncArm() {
	return arms[surfaceDetector()] || arms.web || null;
}
/**
* settings:get — read the persisted settings blob for the current surface.
* Returns `{}` when no arm is registered (caller falls back to IDB / defaults).
*/
async function getSettingsSync() {
	const arm = resolveSettingsSyncArm();
	if (!arm) return {};
	try {
		return await arm.get();
	} catch {
		return {};
	}
}
/**
* settings:patch — shallow-merge a patch into persisted settings and trigger backend reload.
* Returns the merged blob, or `{}` when no arm is registered (caller should persist to IDB).
*/
async function patchSettingsSync(patch) {
	const arm = resolveSettingsSyncArm();
	if (!arm) return {};
	return arm.patch(patch);
}
/**
* settings:defaults — config-driven defaults (DEFAULT_SETTINGS + resolved snapshot) for views
* that render actual-config-derived values. Returns `{}` when the arm doesn't expose defaults.
*/
async function getSettingsDefaults() {
	const arm = resolveSettingsSyncArm();
	if (!arm?.defaults) return {};
	try {
		return await arm.defaults();
	} catch {
		return {};
	}
}
/**
* settings:snapshot — the actual resolved runtime config (ports, bridge, roles, endpointIDs, …)
* for views (e.g. network-view) that display live config state. Returns `{}` when unavailable.
*/
async function getSettingsSnapshot() {
	const arm = resolveSettingsSyncArm();
	if (!arm?.snapshot) return {};
	try {
		return await arm.snapshot();
	} catch {
		return {};
	}
}
//#endregion
//#region src/shared/other/config/settings/settings-shell-profile.ts
/**
* CWSAndroid / Capacitor CWSP shells enable only `network` + `settings` — no workcenter,
* viewer, explorer AI stack, or CRX extension panels.
*/
var resolveSettingsShellProfile = (ctx) => {
	if (ctx.isExtension || ctx.surface === "crx") return "extension";
	if (ctx.surface === "markdown") return "markdown";
	if (ctx.surface === "environment") return "environment";
	if (ctx.surface === "capacitor" || ctx.surface === "native") {
		if (!(isEnabledView("workcenter") || isEnabledView("viewer") || isEnabledView("explorer"))) return "cwsp-mobile";
	}
	return "full";
};
var CWSP_MOBILE_HIDDEN_BUILTIN_TABS = [
	"appearance",
	"markdown",
	"ai",
	"mcp",
	"server",
	"instructions",
	"extension"
];
/**
* CRX options page: drop built-in Extension (NTP) — folded into contributed `crx`
* tab — and Server (CWSP tab owns hub/endpoint).
*/
var EXTENSION_HIDDEN_BUILTIN_TABS = ["extension", "server"];
/** Document / md.u2re.space PWA: no Server / Extension (Control/CRX own those). */
var MARKDOWN_HIDDEN_BUILTIN_TABS = ["server", "extension"];
/**
* CWSP-shell environment: no Server / Extension / CWSP.
* NOTE: `cwsp` is contributed (not built-in); same DOM selectors still remove the tab/panel.
*/
var ENVIRONMENT_HIDDEN_BUILTIN_TABS = [
	"server",
	"extension",
	"cwsp"
];
/** Remove host-variant built-in tabs that the profile replaces or folds elsewhere. */
var pruneBuiltInSettingsTabs = (root, profile) => {
	const hidden = profile === "cwsp-mobile" ? CWSP_MOBILE_HIDDEN_BUILTIN_TABS : profile === "extension" ? EXTENSION_HIDDEN_BUILTIN_TABS : profile === "markdown" ? MARKDOWN_HIDDEN_BUILTIN_TABS : profile === "environment" ? ENVIRONMENT_HIDDEN_BUILTIN_TABS : null;
	if (!hidden) return;
	for (const tab of hidden) {
		root.querySelector(`[data-tab-panel="${tab}"]`)?.remove();
		root.querySelector(`[data-action="switch-settings-tab"][data-tab="${tab}"]`)?.remove();
	}
};
var defaultSettingsTabForProfile = (profile) => {
	if (profile === "cwsp-mobile") return "cwsp";
	if (profile === "extension") return "crx";
	if (profile === "markdown") return "markdown";
	if (profile === "environment") return "appearance";
	return "ai";
};
var hasBuiltInSettingsPanel = (root, panelId) => Boolean(root.querySelector(`[data-tab-panel="${panelId}"]`));
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-contributions.ts
var TAB_LIST_SELECTOR = "[data-settings-tabs]";
var BODY_SELECTOR = ".settings-screen__body";
var resolveSettingsSurface = () => {
	try {
		const g = globalThis;
		if (g?.chrome?.runtime?.id) return "crx";
		if (g?.Capacitor?.isNativePlatform?.() || g?.Capacitor?.getPlatform?.() === "android" || g?.Capacitor?.getPlatform?.() === "ios") return "capacitor";
		if (g?.__CWS_NATIVE__ === true) return "native";
		if (typeof document !== "undefined") {
			const surface = String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase();
			if (surface === "cw-markdown" || surface === "cw-document" || surface === "document") return "markdown";
			if (surface === "environment" || surface === "cw-environment" || surface === "cwsp-shell") return "environment";
			if (document.querySelector?.(".env-shell-root[data-shell='environment'], env-shell-container[data-shell='environment']")) return "environment";
		}
		if (typeof document !== "undefined") return "web";
	} catch {}
	return "unknown";
};
var contributionVisible = (contribution, ctx) => {
	if (contribution.requiresView && !isEnabledView(contribution.requiresView)) return false;
	const surfaces = contribution.surfaces;
	if (surfaces?.length && !surfaces.includes(ctx.surface)) return false;
	if (contribution.excludeSurfaces?.includes(ctx.surface)) return false;
	return true;
};
var visibleContributions = (ctx) => getSettingsContributions().filter((c) => contributionVisible(c, ctx));
var mountContributions = (root, ctx) => {
	const tabList = root.querySelector(TAB_LIST_SELECTOR);
	const body = root.querySelector(BODY_SELECTOR);
	if (!tabList || !body) return;
	for (const contribution of visibleContributions(ctx)) {
		if (root.querySelector(`[data-tab-panel="${contribution.id}"]`)) continue;
		const tab = document.createElement("button");
		tab.className = "settings-tab-btn";
		tab.type = "button";
		tab.role = "tab";
		tab.setAttribute("data-action", "switch-settings-tab");
		tab.setAttribute("data-tab", contribution.id);
		tab.setAttribute("data-contributed-tab", "");
		tab.setAttribute("aria-selected", "false");
		tab.textContent = contribution.label;
		const extTab = tabList.querySelector("[data-extension-tab]");
		if (extTab) tabList.insertBefore(tab, extTab);
		else tabList.appendChild(tab);
		let content = null;
		try {
			content = contribution.render(ctx);
		} catch (error) {
			console.warn(`[settings] contribution '${contribution.id}' render failed:`, error);
		}
		if (!content) continue;
		let panel;
		if (content.matches?.("[data-tab-panel]")) {
			panel = content;
			panel.classList.add("card", "settings-tab-panel");
			panel.setAttribute("data-tab-panel", contribution.id);
			panel.setAttribute("data-contributed-panel", "");
			panel.hidden = true;
		} else {
			panel = document.createElement("section");
			panel.className = "card settings-tab-panel";
			panel.setAttribute("data-tab-panel", contribution.id);
			panel.setAttribute("data-contributed-panel", "");
			panel.hidden = true;
			panel.appendChild(content);
		}
		body.appendChild(panel);
	}
};
var forEachContributionPanel = (root, ctx, cb) => {
	for (const contribution of visibleContributions(ctx)) {
		const panel = root.querySelector(`[data-tab-panel="${contribution.id}"]`);
		if (panel) cb(contribution, panel);
	}
};
var applyContributions = (root, settings, ctx) => {
	forEachContributionPanel(root, ctx, (contribution, panel) => {
		try {
			if (!contribution.manualFields) bindContributionFields(panel, settings);
			contribution.load?.(settings, panel, ctx);
		} catch (error) {
			console.warn(`[settings] contribution '${contribution.id}' load failed:`, error);
		}
	});
};
var collectContributions = (root, settings, ctx) => {
	forEachContributionPanel(root, ctx, (contribution, panel) => {
		try {
			if (!contribution.manualFields) collectContributionFields(panel, settings);
			contribution.save?.(settings, panel, ctx);
		} catch (error) {
			console.warn(`[settings] contribution '${contribution.id}' save failed:`, error);
		}
	});
};
var isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
/**
* Deep-merge backend settings:get into local AppSettings for form prefill.
* INVARIANT: skip `[redacted]` placeholders so a redacted GET cannot wipe IDB values.
* Backend non-empty values win (gateway/webnative SoT after login).
*/
var mergeSettingsFromSync = (base, remote) => {
	if (!isPlainObject(remote) || !Object.keys(remote).length) return base;
	const mergeValue = (local, incoming) => {
		if (incoming === void 0 || incoming === null) return local;
		if (typeof incoming === "string" && incoming === "[redacted]") return local;
		if (Array.isArray(incoming)) return incoming.slice();
		if (isPlainObject(incoming) && isPlainObject(local)) {
			const out = { ...local };
			for (const [key, value] of Object.entries(incoming)) out[key] = mergeValue(local[key], value);
			return out;
		}
		if (isPlainObject(incoming)) return { ...incoming };
		if (typeof incoming === "string" && !incoming.trim() && typeof local === "string" && local.trim()) return local;
		return incoming;
	};
	return mergeValue(base, remote);
};
var isDesktopSettingsSurface = () => {
	try {
		const g = globalThis;
		const crxWithBridge = typeof g.chrome?.runtime?.id === "string" && typeof g.__NEUTRALINO_AUTH__?.port === "number";
		return Boolean(g.__CWS_WEBNATIVE_BOOT__ || g.__CWS_NEUTRALINO_BOOT__ || typeof g.__WEBNATIVE_AUTH__?.port === "number" || typeof g.__NEUTRALINO_AUTH__?.port === "number" || crxWithBridge);
	} catch {
		return false;
	}
};
var remoteSettingsLooksUseful = (remote) => {
	if (!remote || typeof remote !== "object") return false;
	const core = remote.core;
	const shell = remote.shell;
	const bridge = remote.bridge;
	const cwsp = remote.cwsp;
	const control = remote.control;
	return Boolean(typeof core?.endpointUrl === "string" && core.endpointUrl.trim() || typeof core?.userId === "string" && core.userId.trim() || typeof core?.ecosystemToken === "string" && core.ecosystemToken.trim() || typeof core?.userKey === "string" && core.userKey.trim() || typeof shell?.clipboardInboundMode === "string" && shell.clipboardInboundMode || typeof shell?.clipboardOutboundMode === "string" && shell.clipboardOutboundMode || typeof shell?.remoteHost === "string" && shell.remoteHost.trim() || typeof shell?.clientId === "string" && shell.clientId.trim() || typeof shell?.allowControlApi === "boolean" || typeof shell?.bridgeDaemonEnabled === "boolean" || typeof shell?.autoStartOnBoot === "boolean" || typeof bridge?.endpointUrl === "string" && bridge.endpointUrl.trim() || typeof bridge?.userId === "string" && String(bridge.userId).trim() || typeof cwsp?.clientId === "string" && String(cwsp.clientId).trim() || typeof cwsp?.endpointUrl === "string" && String(cwsp.endpointUrl).trim() || control?.surface === "capacitor-android");
};
var isCrxSettingsRuntime = () => {
	try {
		const id = globalThis.chrome?.runtime?.id;
		return typeof id === "string" && id.length > 0;
	} catch {
		return false;
	}
};
/**
* INVARIANT (CRX): Extension wire `core.userId` = L-110-crx;
* CWSP desk `shell.clientId` = L-110 (never *-crx).
* WHY: polluted chrome.storage / portable swaps these on open without this pass.
*/
var reconcileCrxIdentityAfterHydrate = (settings) => {
	if (!isCrxSettingsRuntime()) return settings;
	const CRX_WIRE = "L-110-crx";
	const DESK_DEFAULT = "L-110";
	const isCrxWire = (v) => /^L-\d{1,3}-crx$/i.test(String(v ?? "").trim());
	const pickDesk = (...cands) => {
		for (const c of cands) {
			const id = String(c ?? "").trim();
			if (id && !isCrxWire(id)) return id;
		}
		return DESK_DEFAULT;
	};
	const deskId = pickDesk(settings.shell?.clientId, settings.core?.userId);
	return {
		...settings,
		core: {
			...settings.core || {},
			userId: CRX_WIRE,
			socket: {
				...settings.core?.socket || {},
				selfId: CRX_WIRE
			}
		},
		shell: {
			...settings.shell || {},
			clientId: deskId
		}
	};
};
/** Load local settings then overlay the registered sync arm (gateway / webnative / …). */
var loadSettingsHydratedFromSync = async (loadLocal) => {
	const local = await loadLocal();
	if ((local.core?.preferBackendSync ?? true) === false) return reconcileCrxIdentityAfterHydrate(local);
	let remote = await getSettingsSync();
	const crxControlLive = (() => {
		try {
			if (!isCrxSettingsRuntime()) return false;
			const g = globalThis;
			return String(globalThis.document?.documentElement?.dataset?.cwspBridge || "") === "live" || typeof g.__NEUTRALINO_AUTH__?.port === "number";
		} catch {
			return false;
		}
	})();
	if ((isDesktopSettingsSurface() || crxControlLive) && !remoteSettingsLooksUseful(remote)) for (let i = 0; i < 8; i++) {
		await new Promise((r) => setTimeout(r, 300));
		remote = await getSettingsSync();
		if (remoteSettingsLooksUseful(remote)) break;
	}
	return reconcileCrxIdentityAfterHydrate(mergeSettingsFromSync(local, remote));
};
/**
* settings:get → applyContributions — hydrate contributed panels from the registered sync arm.
*
* NOTE: returns the merged blob used for binding so callers can keep a local settings copy
* without a second get. When no arm is registered, `base` is applied unchanged.
*/
var hydrateContributionsFromSync = async (root, ctx, base = {}) => {
	const settings = mergeSettingsFromSync(base, await getSettingsSync());
	applyContributions(root, settings, ctx);
	return settings;
};
/**
* collectContributions → settings:patch — persist contributed field values through the sync arm.
*
* INVARIANT: callers pass the full settings object they intend to keep; the arm owns merge
* semantics (see `createMemorySettingsSyncArm` / platform backends).
*/
var persistContributionsViaSync = async (root, settings, ctx) => {
	collectContributions(root, settings, ctx);
	return patchSettingsSync(settings);
};
var contributedTabIds = (ctx) => visibleContributions(ctx).map((c) => c.id);
var isCapacitorNativeShell = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Resolve bare host/IP fields in `core.endpointUrl` / `core.ops.directUrl` before persist. */
var resolveCwspSettingsBeforeSave = async (settings) => {
	normalizeEcosystemToken(settings);
	const core = settings.core;
	if (!core || typeof core !== "object") return;
	const { sanitizeFleetSelfWireNodeId } = await import("./airpad-cwsp-client-parity.js").then((n) => n.a);
	const canonicalUserId = sanitizeFleetSelfWireNodeId(core.userId);
	if (canonicalUserId) core.userId = canonicalUserId;
	const isControlSpaHost = (host) => {
		const h = host.toLowerCase();
		return h === "cwsp.u2re.space" || h === "www.cwsp.u2re.space" || h === "md.u2re.space" || h === "www.md.u2re.space";
	};
	const stripControlSpaSegment = (url) => {
		const raw = String(url || "").trim();
		if (!raw) return "";
		try {
			const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
			const host = new URL(withScheme).hostname.toLowerCase();
			if (isControlSpaHost(host)) return "";
		} catch {
			if (/cwsp\.u2re\.space|md\.u2re\.space/i.test(raw)) return "";
		}
		return raw;
	};
	const stripControlSpa = (url) => {
		const raw = String(url || "").trim();
		if (!raw) return "";
		if (/[,;\s]/.test(raw) && /:\/\//.test(raw)) return raw.split(/[,;\s]+/).map((part) => stripControlSpaSegment(part.trim())).filter(Boolean).join(";");
		return stripControlSpaSegment(raw);
	};
	if (typeof core.endpointUrl === "string") {
		const cleaned = stripControlSpa(core.endpointUrl);
		if (cleaned !== core.endpointUrl.trim()) core.endpointUrl = cleaned;
	}
	const relay = typeof core.endpointUrl === "string" ? core.endpointUrl : "";
	const direct = typeof core.ops?.directUrl === "string" ? core.ops.directUrl : "";
	if (!relay.trim() && !direct.trim()) return;
	const resolveOpts = isCapacitorNativeShell() ? {
		discover: false,
		timeoutMs: 1500
	} : { timeoutMs: 3e3 };
	const resolved = await resolveCwspUrlFields({
		relayHttpsUrl: relay,
		directHttpsUrl: direct
	}, resolveOpts);
	if (resolved.relayHttpsUrl !== void 0) core.endpointUrl = resolved.relayHttpsUrl;
	if (resolved.directHttpsUrl !== void 0) core.ops = {
		...core.ops || {},
		directUrl: resolved.directHttpsUrl
	};
};
//#endregion
//#region ../../modules/views/settings-view/src/ts/Settings.ts
var createSettingsView = (opts) => {
	let note = null;
	let noteTimer = null;
	const noteClearMs = () => {
		const surface = resolveSettingsSurface();
		return surface === "capacitor" || surface === "native" ? 8e3 : 2500;
	};
	const setNote = (text, opts) => {
		if (!note) return;
		if (noteTimer) {
			clearTimeout(noteTimer);
			noteTimer = null;
		}
		note.textContent = text;
		note.classList.remove("note--ok", "note--warn", "note--err");
		if (opts?.tone === "ok") note.classList.add("note--ok");
		if (opts?.tone === "warn") note.classList.add("note--warn");
		if (opts?.tone === "err") note.classList.add("note--err");
		if (text && !opts?.persist) noteTimer = setTimeout(() => {
			if (note) {
				note.textContent = "";
				note.classList.remove("note--ok", "note--warn", "note--err");
			}
		}, noteClearMs());
	};
	const root = H`<div class="view-settings" data-view="settings" style="padding: 1rem;">
    ${createSettingsHeader()}
    <div class="settings-screen__body">
      ${createAppearanceSection()}
      ${createMarkdownSection()}
      ${createAiSection()}
      ${createMcpSection()}
      ${createServerSection()}
      ${createInstructionsSection(setNote)}
      ${createExtensionSection()}
    </div>
    ${createSettingsFooter()}
  </div>`;
	attachSettingsInlineStylesWhenConnected(root);
	registerBuiltinSettingsContributions();
	const contributionCtx = {
		isExtension: opts.isExtension,
		surface: resolveSettingsSurface()
	};
	const settingsProfile = resolveSettingsShellProfile(contributionCtx);
	mountContributions(root, contributionCtx);
	pruneBuiltInSettingsTabs(root, settingsProfile);
	if (settingsProfile === "full" && (contributionCtx.surface === "capacitor" || contributionCtx.surface === "native")) {
		root.querySelector("[data-tab-panel=\"server\"]")?.remove();
		root.querySelector("[data-action=\"switch-settings-tab\"][data-tab=\"server\"]")?.remove();
	}
	const hasPanel = (panelId) => hasBuiltInSettingsPanel(root, panelId);
	const field = (sel) => root.querySelector(sel);
	note = root.querySelector("[data-note]");
	const apiUrl = field("[data-field=\"ai.baseUrl\"]");
	const apiKey = field("[data-field=\"ai.apiKey\"]");
	const showKey = field("[data-field=\"ui.showKey\"]");
	const model = field("[data-field=\"ai.model\"]");
	const customModel = field("[data-field=\"ai.customModel\"]");
	const customModelGroup = root.querySelector("[data-field-group=\"ai.customModel\"]");
	const defaultReasoningEffort = field("[data-field=\"ai.defaultReasoningEffort\"]");
	const defaultVerbosity = field("[data-field=\"ai.defaultVerbosity\"]");
	const maxOutputTokens = field("[data-field=\"ai.maxOutputTokens\"]");
	const contextTruncation = field("[data-field=\"ai.contextTruncation\"]");
	const promptCacheRetention = field("[data-field=\"ai.promptCacheRetention\"]");
	const maxToolCalls = field("[data-field=\"ai.maxToolCalls\"]");
	const parallelToolCalls = field("[data-field=\"ai.parallelToolCalls\"]");
	const requestTimeoutLow = field("[data-field=\"ai.requestTimeout.low\"]");
	const requestTimeoutMedium = field("[data-field=\"ai.requestTimeout.medium\"]");
	const requestTimeoutHigh = field("[data-field=\"ai.requestTimeout.high\"]");
	const maxRetries = field("[data-field=\"ai.maxRetries\"]");
	const mode = field("[data-field=\"ai.shareTargetMode\"]");
	const syncCustomModelVisibility = () => {
		const isCustom = (model?.value || "").trim() === "custom";
		if (customModelGroup) customModelGroup.hidden = !isCustom;
		if (customModel) customModel.disabled = !isCustom;
	};
	if (model) {
		model.replaceChildren();
		for (const builtInModel of BUILTIN_AI_MODELS) {
			const option = document.createElement("option");
			option.value = builtInModel;
			option.textContent = builtInModel;
			model.append(option);
		}
		const customOption = document.createElement("option");
		customOption.value = "custom";
		customOption.textContent = "Custom...";
		model.append(customOption);
		model.addEventListener("change", syncCustomModelVisibility);
	}
	customModel?.addEventListener("focus", () => {
		if (!model) return;
		model.value = "custom";
		syncCustomModelVisibility();
	});
	const autoProcessShared = field("[data-field=\"ai.autoProcessShared\"]");
	const responseLanguage = field("[data-field=\"ai.responseLanguage\"]");
	const translateResults = field("[data-field=\"ai.translateResults\"]");
	const generateSvgGraphics = field("[data-field=\"ai.generateSvgGraphics\"]");
	const speechLanguage = field("[data-field=\"speech.language\"]");
	const theme = field("[data-field=\"appearance.theme\"]");
	const fontSize = field("[data-field=\"appearance.fontSize\"]");
	const markdownPreset = field("[data-field=\"appearance.markdown.preset\"]");
	const markdownFontFamily = field("[data-field=\"appearance.markdown.fontFamily\"]");
	const markdownFontSizePx = field("[data-field=\"appearance.markdown.fontSizePx\"]");
	const markdownLineHeight = field("[data-field=\"appearance.markdown.lineHeight\"]");
	const markdownContentMaxWidthPx = field("[data-field=\"appearance.markdown.contentMaxWidthPx\"]");
	const markdownPrintScale = field("[data-field=\"appearance.markdown.printScale\"]");
	const markdownPageSize = field("[data-field=\"appearance.markdown.page.size\"]");
	const markdownPageOrientation = field("[data-field=\"appearance.markdown.page.orientation\"]");
	const markdownPageMarginMm = field("[data-field=\"appearance.markdown.page.marginMm\"]");
	const markdownModuleTypography = field("[data-field=\"appearance.markdown.modules.typography\"]");
	const markdownModuleLists = field("[data-field=\"appearance.markdown.modules.lists\"]");
	const markdownModuleTables = field("[data-field=\"appearance.markdown.modules.tables\"]");
	const markdownModuleCodeBlocks = field("[data-field=\"appearance.markdown.modules.codeBlocks\"]");
	const markdownModuleBlockquotes = field("[data-field=\"appearance.markdown.modules.blockquotes\"]");
	const markdownModuleMedia = field("[data-field=\"appearance.markdown.modules.media\"]");
	const markdownModulePrintBreaks = field("[data-field=\"appearance.markdown.modules.printBreaks\"]");
	const markdownPluginSmartTypography = field("[data-field=\"appearance.markdown.plugins.smartTypography\"]");
	const markdownPluginSoftBreaks = field("[data-field=\"appearance.markdown.plugins.softBreaksAsBr\"]");
	const markdownPluginExternalLinks = field("[data-field=\"appearance.markdown.plugins.externalLinksNewTab\"]");
	const markdownCustomCss = root.querySelector("[data-field=\"appearance.markdown.customCss\"]");
	const markdownPrintCss = root.querySelector("[data-field=\"appearance.markdown.printCss\"]");
	const markdownExtensions = root.querySelector("[data-field=\"appearance.markdown.extensions\"]");
	const ntpEnabled = field("[data-field=\"core.ntpEnabled\"]");
	const coreMode = field("[data-field=\"core.mode\"]");
	const coreEndpointUrl = field("[data-field=\"core.endpointUrl\"]");
	const coreUserId = field("[data-field=\"core.userId\"]");
	const coreUserKey = field("[data-field=\"core.userKey\"]");
	const coreEcosystemToken = field("[data-field=\"core.ecosystemToken\"]");
	const corePreferBackendSync = field("[data-field=\"core.preferBackendSync\"]");
	const coreEncrypt = field("[data-field=\"core.encrypt\"]");
	const coreAppClientId = field("[data-field=\"core.appClientId\"]");
	const coreAllowInsecureTls = field("[data-field=\"core.allowInsecureTls\"]");
	const coreOpsAllowUnencrypted = field("[data-field=\"core.ops.allowUnencrypted\"]");
	const coreAdminHttps = field("[data-field=\"core.admin.httpsOrigin\"]");
	const coreAdminHttp = field("[data-field=\"core.admin.httpOrigin\"]");
	const coreAdminPath = field("[data-field=\"core.admin.path\"]");
	const coreSocketAccessToken = field("[data-field=\"core.socket.accessToken\"]");
	const coreSocketRouteTarget = field("[data-field=\"core.socket.routeTarget\"]");
	const coreSocketClientAccessToken = field("[data-field=\"core.socket.clientAccessToken\"]");
	const coreSocketAllowAccessWithoutUserKey = field("[data-field=\"core.socket.allowAccessTokenWithoutUserKey\"]");
	const shellMaintainHubSocket = field("[data-field=\"shell.maintainHubSocketConnection\"]");
	const shellClipboardBroadcastTargets = field("[data-field=\"shell.clipboardBroadcastTargets\"]");
	const shellPushLocalClipboard = field("[data-field=\"shell.pushLocalClipboardToLan\"]");
	const shellClipboardPushIntervalMs = field("[data-field=\"shell.clipboardPushIntervalMs\"]");
	const shellClipboard = field("[data-field=\"shell.enableRemoteClipboardBridge\"]");
	const shellAcceptInboundClipboard = field("[data-field=\"shell.acceptInboundClipboardData\"]");
	const shellClipboardInboundAllowIds = field("[data-field=\"shell.clipboardInboundAllowIds\"]");
	const shellAccessTokenBypassClipboardAllow = field("[data-field=\"shell.accessTokenBypassesClipboardAllowlist\"]");
	const shellClipboardShareDestIds = field("[data-field=\"shell.clipboardShareDestinationIds\"]");
	const shellApplyRemoteDevice = field("[data-field=\"shell.applyRemoteClipboardToDevice\"]");
	const shellAcceptContactsBridge = field("[data-field=\"shell.acceptContactsBridgeData\"]");
	const shellAcceptSmsBridge = field("[data-field=\"shell.acceptSmsBridgeData\"]");
	const shellSms = field("[data-field=\"shell.enableNativeSms\"]");
	const shellContacts = field("[data-field=\"shell.enableNativeContacts\"]");
	const adminPreview = root.querySelector("[data-admin-preview]");
	const mcpSection = root.querySelector("[data-mcp-section]");
	const extSection = root.querySelector("[data-section=\"extension\"]");
	const extTab = root.querySelector("[data-extension-tab]");
	if (responseLanguage) {
		responseLanguage.replaceChildren();
		const autoOption = document.createElement("option");
		autoOption.value = "auto";
		autoOption.textContent = "Auto-detect";
		responseLanguage.append(autoOption);
		const followOption = document.createElement("option");
		followOption.value = "follow";
		followOption.textContent = "Follow source/context";
		responseLanguage.append(followOption);
		for (const lang of buildResponseLanguageOptions()) {
			const option = document.createElement("option");
			option.value = lang;
			option.textContent = lang === "ru" ? "Russian" : lang === "en" ? "English" : lang;
			responseLanguage.append(option);
		}
	}
	if (speechLanguage) {
		speechLanguage.replaceChildren();
		for (const lang of buildSpeechLanguageOptions()) {
			const option = document.createElement("option");
			option.value = lang;
			option.textContent = speechLanguageLabel(lang);
			speechLanguage.append(option);
		}
	}
	root.addEventListener("input", (ev) => {
		if (ev.target?.matches?.("[data-field^=\"core.\"]")) refreshAdminDoorPreview();
	});
	root.addEventListener("change", (ev) => {
		if (ev.target?.matches?.("[data-field^=\"core.\"]")) refreshAdminDoorPreview();
	});
	const switchSettingsTab = (tab) => {
		const fallback = defaultSettingsTabForProfile(settingsProfile);
		let nextTab = tab || fallback;
		if (!root.querySelector(`[data-tab-panel="${nextTab}"]`)) nextTab = root.querySelector("[data-tab-panel]")?.getAttribute("data-tab-panel") || fallback;
		root.querySelector("[data-settings-tabs]")?.setAttribute("data-active-tab", nextTab);
		const tabButtons = root.querySelectorAll("[data-action=\"switch-settings-tab\"][data-tab]");
		for (const tabButton of Array.from(tabButtons)) {
			const btn = tabButton;
			const isActive = btn.getAttribute("data-tab") === nextTab;
			btn.classList.toggle("is-active", isActive);
			btn.setAttribute("aria-selected", String(isActive));
		}
		const panels = root.querySelectorAll("[data-tab-panel]");
		for (const panel of Array.from(panels)) {
			const el = panel;
			const isActive = el.getAttribute("data-tab-panel") === nextTab;
			if (isActive) el.removeAttribute("hidden");
			else el.hidden = true;
			el.classList.toggle("is-active", isActive);
		}
	};
	root.addEventListener("click", (e) => {
		const tabBtn = eventTargetElement(e)?.closest?.("[data-action=\"switch-settings-tab\"][data-tab]");
		if (!tabBtn || !root.contains(tabBtn)) return;
		e.preventDefault();
		e.stopPropagation();
		switchSettingsTab(tabBtn.getAttribute("data-tab") || defaultSettingsTabForProfile(settingsProfile));
	}, true);
	const resolveInitialTab = (raw) => {
		const fallback = defaultSettingsTabForProfile(settingsProfile);
		const normalized = (raw || "").trim().toLowerCase();
		if (!normalized) return fallback;
		if (normalized === "style" || normalized === "styles" || normalized === "styling") return hasPanel("markdown") ? "markdown" : fallback;
		return (/* @__PURE__ */ new Set([
			...hasPanel("appearance") ? ["appearance"] : [],
			...hasPanel("markdown") ? ["markdown"] : [],
			...hasPanel("ai") ? ["ai"] : [],
			...hasPanel("mcp") ? ["mcp"] : [],
			...hasPanel("server") ? ["server"] : [],
			...hasPanel("instructions") ? ["instructions"] : [],
			...hasPanel("extension") ? ["extension"] : [],
			...contributedTabIds(contributionCtx)
		])).has(normalized) ? normalized : fallback;
	};
	const buildCoreSnapshotForAdminPreview = () => {
		const eco = coreEcosystemToken?.value?.trim() || coreUserKey?.value?.trim() || coreSocketAccessToken?.value?.trim() || "";
		return {
			mode: coreMode?.value || "native",
			endpointUrl: coreEndpointUrl?.value?.trim() || "",
			userId: coreUserId?.value?.trim() || "",
			ecosystemToken: eco,
			userKey: eco,
			encrypt: Boolean(coreEncrypt?.checked),
			preferBackendSync: (corePreferBackendSync?.checked ?? true) !== false,
			appClientId: coreAppClientId?.value?.trim() || "",
			allowInsecureTls: Boolean(coreAllowInsecureTls?.checked),
			useCoreIdentityForAirPad: true,
			socket: {
				accessToken: eco,
				routeTarget: coreSocketRouteTarget?.value?.trim() || "",
				selfId: "",
				clientAccessToken: coreSocketClientAccessToken?.value?.trim() || "",
				allowAccessTokenWithoutUserKey: Boolean(coreSocketAllowAccessWithoutUserKey?.checked)
			},
			admin: {
				httpsOrigin: coreAdminHttps?.value?.trim() || "",
				httpOrigin: coreAdminHttp?.value?.trim() || "",
				path: coreAdminPath?.value?.trim() || "/"
			},
			ops: { allowUnencrypted: Boolean(coreOpsAllowUnencrypted?.checked) }
		};
	};
	const refreshAdminDoorPreview = () => {
		if (!adminPreview) return;
		const urls = resolveAdminDoorUrls(buildCoreSnapshotForAdminPreview());
		adminPreview.textContent = `Resolved: ${urls.https} · ${urls.http}`;
	};
	const openExplorerPath = (path) => {
		try {
			setString(StorageKeys.EXPLORER_PATH, path);
			navigateToView("explorer");
			sendMessage({
				type: "content-explorer",
				destination: "explorer",
				data: {
					action: "view",
					path
				},
				metadata: { source: "settings" }
			});
			setNote(`Explorer: ${path}`);
		} catch (error) {
			console.warn("[Settings] Failed to open explorer path:", error);
			setNote("Failed to open Explorer path.");
		}
	};
	const loadSettingsForView = async () => {
		if (contributionCtx.surface === "capacitor" || contributionCtx.surface === "native") await ensureCapacitorCwspSettingsSeeded().catch(() => null);
		if (contributionCtx.surface === "crx" || contributionCtx.isExtension) await ensureCrxCwspSettingsSeeded().catch(() => null);
		return loadSettingsHydratedFromSync(() => loadSettings());
	};
	Promise.resolve(loadSettingsForView()).then((s) => {
		if (apiUrl) apiUrl.value = (s?.ai?.baseUrl || "").trim();
		if (apiKey) apiKey.value = (s?.ai?.apiKey || "").trim();
		const savedModel = (s?.ai?.model || "gpt-5.6-luna").trim();
		const savedCustomModel = (s?.ai?.customModel || "").trim();
		if (model) {
			const hasBuiltin = BUILTIN_AI_MODELS.includes(savedModel);
			if (savedModel === "custom" || !hasBuiltin && !!savedModel) {
				model.value = "custom";
				if (customModel) customModel.value = savedCustomModel || savedModel;
			} else {
				model.value = hasBuiltin ? savedModel : "gpt-5.6-luna";
				if (customModel) customModel.value = savedCustomModel;
			}
			syncCustomModelVisibility();
		}
		if (defaultReasoningEffort) defaultReasoningEffort.value = s?.ai?.defaultReasoningEffort || "medium";
		if (defaultVerbosity) defaultVerbosity.value = s?.ai?.defaultVerbosity || "medium";
		if (maxOutputTokens) maxOutputTokens.value = String(s?.ai?.maxOutputTokens ?? 4e5);
		if (contextTruncation) contextTruncation.value = s?.ai?.contextTruncation || "disabled";
		if (promptCacheRetention) promptCacheRetention.value = s?.ai?.promptCacheRetention || "in-memory";
		if (maxToolCalls) maxToolCalls.value = String(s?.ai?.maxToolCalls ?? 8);
		if (parallelToolCalls) parallelToolCalls.checked = (s?.ai?.parallelToolCalls ?? true) !== false;
		if (requestTimeoutLow) requestTimeoutLow.value = String(s?.ai?.requestTimeout?.low ?? 6e4);
		if (requestTimeoutMedium) requestTimeoutMedium.value = String(s?.ai?.requestTimeout?.medium ?? 3e5);
		if (requestTimeoutHigh) requestTimeoutHigh.value = String(s?.ai?.requestTimeout?.high ?? 9e5);
		if (maxRetries) maxRetries.value = String(s?.ai?.maxRetries ?? 2);
		if (mode) mode.value = s?.ai?.shareTargetMode || "recognize";
		if (autoProcessShared) autoProcessShared.checked = (s?.ai?.autoProcessShared ?? true) !== false;
		if (responseLanguage) responseLanguage.value = s?.ai?.responseLanguage || "auto";
		if (translateResults) translateResults.checked = Boolean(s?.ai?.translateResults);
		if (generateSvgGraphics) generateSvgGraphics.checked = Boolean(s?.ai?.generateSvgGraphics);
		if (speechLanguage) speechLanguage.value = s?.speech?.language || "en-US";
		if (theme) theme.value = s?.appearance?.theme || "auto";
		if (fontSize) fontSize.value = s?.appearance?.fontSize || "medium";
		if (markdownPreset) markdownPreset.value = s?.appearance?.markdown?.preset || "default";
		if (markdownFontFamily) markdownFontFamily.value = s?.appearance?.markdown?.fontFamily || "system";
		if (markdownFontSizePx) markdownFontSizePx.value = String(s?.appearance?.markdown?.fontSizePx ?? 16);
		if (markdownLineHeight) markdownLineHeight.value = String(s?.appearance?.markdown?.lineHeight ?? 1.7);
		if (markdownContentMaxWidthPx) markdownContentMaxWidthPx.value = String(s?.appearance?.markdown?.contentMaxWidthPx ?? 860);
		if (markdownPrintScale) markdownPrintScale.value = String(s?.appearance?.markdown?.printScale ?? 1);
		if (markdownPageSize) markdownPageSize.value = s?.appearance?.markdown?.page?.size || "auto";
		if (markdownPageOrientation) markdownPageOrientation.value = s?.appearance?.markdown?.page?.orientation || "portrait";
		if (markdownPageMarginMm) markdownPageMarginMm.value = String(s?.appearance?.markdown?.page?.marginMm ?? 12);
		if (markdownModuleTypography) markdownModuleTypography.checked = (s?.appearance?.markdown?.modules?.typography ?? true) !== false;
		if (markdownModuleLists) markdownModuleLists.checked = (s?.appearance?.markdown?.modules?.lists ?? true) !== false;
		if (markdownModuleTables) markdownModuleTables.checked = (s?.appearance?.markdown?.modules?.tables ?? true) !== false;
		if (markdownModuleCodeBlocks) markdownModuleCodeBlocks.checked = (s?.appearance?.markdown?.modules?.codeBlocks ?? true) !== false;
		if (markdownModuleBlockquotes) markdownModuleBlockquotes.checked = (s?.appearance?.markdown?.modules?.blockquotes ?? true) !== false;
		if (markdownModuleMedia) markdownModuleMedia.checked = (s?.appearance?.markdown?.modules?.media ?? true) !== false;
		if (markdownModulePrintBreaks) markdownModulePrintBreaks.checked = (s?.appearance?.markdown?.modules?.printBreaks ?? true) !== false;
		if (markdownPluginSmartTypography) markdownPluginSmartTypography.checked = Boolean(s?.appearance?.markdown?.plugins?.smartTypography);
		if (markdownPluginSoftBreaks) markdownPluginSoftBreaks.checked = Boolean(s?.appearance?.markdown?.plugins?.softBreaksAsBr);
		if (markdownPluginExternalLinks) markdownPluginExternalLinks.checked = (s?.appearance?.markdown?.plugins?.externalLinksNewTab ?? true) !== false;
		if (markdownCustomCss) markdownCustomCss.value = (s?.appearance?.markdown?.customCss || "").trim();
		if (markdownPrintCss) markdownPrintCss.value = (s?.appearance?.markdown?.printCss || "").trim();
		if (markdownExtensions) {
			const extensions = Array.isArray(s?.appearance?.markdown?.extensions) ? s.appearance?.markdown?.extensions : [];
			markdownExtensions.value = extensions.length > 0 ? JSON.stringify(extensions, null, 2) : "";
		}
		if (ntpEnabled) ntpEnabled.checked = Boolean(s?.core?.ntpEnabled);
		if (coreMode) coreMode.value = s?.core?.mode || "native";
		if (coreEndpointUrl) coreEndpointUrl.value = (s?.core?.endpointUrl || "").trim();
		if (coreUserId) coreUserId.value = (s?.core?.userId || "").trim();
		{
			const eco = String(s?.core?.ecosystemToken || "").trim() || String(s?.core?.userKey || "").trim() || String(s?.core?.socket?.accessToken || s?.core?.socket?.airpadAuthToken || "").trim();
			if (coreEcosystemToken) coreEcosystemToken.value = eco;
			if (coreUserKey) coreUserKey.value = eco;
			if (coreSocketAccessToken) coreSocketAccessToken.value = eco;
		}
		if (corePreferBackendSync) corePreferBackendSync.checked = (s?.core?.preferBackendSync ?? true) !== false;
		if (coreEncrypt) coreEncrypt.checked = Boolean(s?.core?.encrypt);
		if (coreAppClientId) coreAppClientId.value = (s?.core?.appClientId || "").trim();
		if (coreSocketRouteTarget) coreSocketRouteTarget.value = (s?.core?.socket?.routeTarget || s?.core?.socket?.selfId || "").trim();
		if (coreSocketClientAccessToken) coreSocketClientAccessToken.value = (s?.core?.socket?.clientAccessToken || "").trim();
		if (coreSocketAllowAccessWithoutUserKey) coreSocketAllowAccessWithoutUserKey.checked = (s?.core?.socket?.allowAccessTokenWithoutUserKey ?? false) === true;
		if (coreAllowInsecureTls) coreAllowInsecureTls.checked = Boolean(s?.core?.allowInsecureTls);
		if (coreOpsAllowUnencrypted) coreOpsAllowUnencrypted.checked = Boolean(s?.core?.ops?.allowUnencrypted);
		if (coreAdminHttps) coreAdminHttps.value = (s?.core?.admin?.httpsOrigin || "").trim();
		if (coreAdminHttp) coreAdminHttp.value = (s?.core?.admin?.httpOrigin || "").trim();
		if (coreAdminPath) coreAdminPath.value = (s?.core?.admin?.path || "/").trim() || "/";
		if (shellMaintainHubSocket) shellMaintainHubSocket.checked = Boolean(s?.shell?.maintainHubSocketConnection);
		if (shellClipboardBroadcastTargets) shellClipboardBroadcastTargets.value = (s?.shell?.clipboardBroadcastTargets || "").trim();
		if (shellPushLocalClipboard) shellPushLocalClipboard.checked = Boolean(s?.shell?.pushLocalClipboardToLan);
		if (shellClipboardPushIntervalMs) {
			const iv = Number(s?.shell?.clipboardPushIntervalMs);
			shellClipboardPushIntervalMs.value = String(Number.isFinite(iv) && iv >= 800 ? Math.min(Math.round(iv), 6e4) : 2e3);
		}
		if (shellClipboard) shellClipboard.checked = (s?.shell?.enableRemoteClipboardBridge ?? true) !== false;
		if (shellAcceptInboundClipboard) shellAcceptInboundClipboard.checked = (s?.shell?.acceptInboundClipboardData ?? true) !== false;
		if (shellClipboardInboundAllowIds) shellClipboardInboundAllowIds.value = (s?.shell?.clipboardInboundAllowIds || "").trim();
		if (shellAccessTokenBypassClipboardAllow) shellAccessTokenBypassClipboardAllow.checked = (s?.shell?.accessTokenBypassesClipboardAllowlist ?? false) === true;
		if (shellClipboardShareDestIds) shellClipboardShareDestIds.value = (s?.shell?.clipboardShareDestinationIds || "").trim();
		if (shellApplyRemoteDevice) shellApplyRemoteDevice.checked = (s?.shell?.applyRemoteClipboardToDevice ?? true) !== false;
		if (shellAcceptContactsBridge) shellAcceptContactsBridge.checked = (s?.shell?.acceptContactsBridgeData ?? false) === true;
		if (shellAcceptSmsBridge) shellAcceptSmsBridge.checked = isCapacitorNative() ? false : (s?.shell?.acceptSmsBridgeData ?? false) === true;
		if (shellSms) shellSms.checked = isCapacitorNative() ? false : (s?.shell?.enableNativeSms ?? false) === true;
		if (shellContacts) shellContacts.checked = (s?.shell?.enableNativeContacts ?? true) !== false;
		refreshAdminDoorPreview();
		renderMcpConfigurations(mcpSection, Array.isArray(s?.ai?.mcp) ? s.ai.mcp : []);
		applyAirpadRuntimeFromAppSettings(s);
		applyTheme(s);
		applyContributions(root, s, contributionCtx);
		opts.onTheme?.(s?.appearance?.theme || "auto");
		if (isCapacitorNative()) import("../vendor/@capacitor_core.js").then((n) => n.n).then((m) => m.invokeCwsNative("app:info", {})).then((result) => {
			const echo = result?.echo || {};
			const el = root.querySelector("[data-apk-local-version]");
			if (!el) return;
			const sig = String(echo?.signatureSha256 || "").slice(0, 12);
			const anyResult = result;
			el.textContent = `Installed: ${echo?.versionName || anyResult?.versionName || "?"} (${echo?.versionCode ?? anyResult?.versionCode ?? "?"})` + (sig ? ` · sig ${sig}…` : "");
		}).catch(() => {});
	}).catch(() => {
		renderMcpConfigurations(mcpSection, []);
	});
	showKey?.addEventListener("change", () => {
		if (!apiKey || !showKey) return;
		apiKey.type = showKey.checked ? "text" : "password";
	});
	theme?.addEventListener("change", () => {
		const t = theme.value || "auto";
		(async () => {
			try {
				const cur = await loadSettings();
				applyTheme({
					...cur,
					appearance: {
						...cur.appearance || {},
						theme: t
					}
				});
			} catch {
				applyTheme({ appearance: {
					theme: t,
					fontSize: "medium"
				} });
			}
			opts.onTheme?.(t);
		})();
	});
	root.addEventListener("click", (e) => {
		const t = eventTargetElement(e);
		if (t?.closest?.("button[data-action=\"add-mcp-server\"]") && mcpSection) {
			mcpSection.querySelector(".mcp-empty-note")?.remove();
			mcpSection.appendChild(createMcpRow({
				id: `mcp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
				serverLabel: "",
				origin: "",
				clientKey: "",
				secretKey: ""
			}));
			return;
		}
		const removeMcpBtn = t?.closest?.("button[data-action=\"remove-mcp-server\"]");
		if (removeMcpBtn) {
			removeMcpBtn.closest(".mcp-row")?.remove();
			if (mcpSection && !mcpSection.querySelector("[data-mcp-id]")) renderMcpConfigurations(mcpSection, []);
			return;
		}
		if (t?.closest?.("button[data-action=\"open-user-styles\"]")) {
			openExplorerPath("/user/styles/");
			return;
		}
		if (t?.closest?.("button[data-action=\"open-assets-readonly\"]")) {
			openExplorerPath("/assets/");
			return;
		}
		if (t?.closest?.("button[data-action=\"open-admin-https\"]")) {
			openAdminDoorFromCore(buildCoreSnapshotForAdminPreview(), "https");
			return;
		}
		if (t?.closest?.("button[data-action=\"open-admin-http\"]")) {
			openAdminDoorFromCore(buildCoreSnapshotForAdminPreview(), "http");
			return;
		}
		if (t?.closest?.("button[data-action=\"copy-admin-https\"]")) {
			const urls = resolveAdminDoorUrls(buildCoreSnapshotForAdminPreview());
			navigator.clipboard?.writeText?.(urls.https).then(() => setNote("HTTPS admin URL copied."), () => setNote("Copy failed."));
			return;
		}
		if (t?.closest?.("button[data-action=\"copy-admin-http\"]")) {
			const urls = resolveAdminDoorUrls(buildCoreSnapshotForAdminPreview());
			navigator.clipboard?.writeText?.(urls.http).then(() => setNote("HTTP admin URL copied."), () => setNote("Copy failed."));
			return;
		}
		if (t?.closest?.("button[data-action=\"open-native-app-settings\"]")) {
			import("./clipboard-device.js").then((n) => n.t).then((m) => m.openAppClipboardRelatedSettings()).then(() => setNote("App settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
			return;
		}
		if (t?.closest?.("button[data-action=\"open-native-notification-settings\"]")) {
			import("./clipboard-device.js").then((n) => n.t).then((m) => m.openNativeNotificationSettings?.()).then(() => setNote("Notification settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
			return;
		}
		const crxPairBtn = t?.closest?.("button[data-action=\"crx-control-pair\"]");
		const crxUnpairBtn = t?.closest?.("button[data-action=\"crx-control-unpair\"]");
		if (crxPairBtn || crxUnpairBtn) {
			(async () => {
				const statusEl = root.querySelector("[data-crx-control-status]");
				const notifySw = () => {
					try {
						globalThis.chrome?.runtime?.sendMessage?.({ type: "cwsp-control-session-changed" });
					} catch {}
				};
				try {
					const m = await import("./crx-control-session.js");
					if (crxUnpairBtn) {
						await m.clearCrxControlSession();
						if (statusEl) statusEl.textContent = await m.formatCrxControlSessionStatus();
						setNote("Control unpaired — Copy & Share / Paste by CWSP disabled.", { tone: "warn" });
						notifySw();
						return;
					}
					const localHub = String(root.querySelector("[data-field=\"shell.localHubUrl\"]")?.value || "").trim();
					const preferredOrigin = String(document.documentElement.dataset.cwspControlOrigin || "").trim();
					if (statusEl) statusEl.textContent = "Control: waiting for pairing dialog…";
					setNote("Enter public token + device code in the pairing dialog…");
					const result = await m.pairCrxControlWithModal({
						localHubUrl: localHub,
						preferredOrigins: preferredOrigin ? [preferredOrigin] : []
					});
					if (result.cancelled) {
						if (statusEl) statusEl.textContent = await m.formatCrxControlSessionStatus();
						setNote("Pairing cancelled.");
						return;
					}
					if (statusEl) statusEl.textContent = result.ok ? await m.formatCrxControlSessionStatus() : `Control: ${result.error}`;
					if (result.ok) {
						setNote(`Paired Control at ${result.session.controlHost} (persistent).`);
						notifySw();
					} else setNote(result.error, { tone: "warn" });
				} catch (err) {
					setNote(`Control pairing unavailable: ${err instanceof Error ? err.message : String(err)}`, { tone: "warn" });
				}
			})();
			return;
		}
		const pairRefreshBtn = t?.closest?.("button[data-action=\"control-pairing-refresh\"]");
		const pairRegenBtn = t?.closest?.("button[data-action=\"control-public-token-regenerate\"]");
		if (pairRefreshBtn || pairRegenBtn) {
			const userClicked = Boolean(e?.isTrusted);
			(async () => {
				try {
					const host = String(location.hostname || "");
					if (location.protocol === "https:" && host !== "localhost" && host !== "127.0.0.1") {
						if (userClicked) setNote("Pairing codes are shown on the device (phone/desk), not in the public Control SPA.", { tone: "warn" });
						return;
					}
				} catch {}
				const codeEl = root.querySelector("input[data-control-device-code], [data-control-device-code]");
				const tokenEl = root.querySelector("input[data-control-public-token], [data-control-public-token]");
				const codeMeta = root.querySelector("[data-secret-meta=\"control-device-code\"]");
				const tokenMeta = root.querySelector("[data-secret-meta=\"control-public-token\"]");
				const paint = (echo) => {
					const code = String(echo.deviceCode || "").trim();
					const left = Math.max(1, Math.round(Number(echo.expiresInMs || 0) / 1e3));
					const pub = String(echo.publicToken || "").trim();
					if (codeEl instanceof HTMLInputElement) codeEl.value = code;
					else if (codeEl) codeEl.textContent = code ? `Code: ${code} (${left}s)` : "Code: …";
					if (tokenEl instanceof HTMLInputElement) tokenEl.value = pub;
					else if (tokenEl) tokenEl.textContent = pub ? `Public token: ${pub}` : "Public token: …";
					if (codeMeta) codeMeta.textContent = code ? `Expires in ${left}s` : "";
					if (tokenMeta) tokenMeta.textContent = pub ? "Stable until regenerated" : "";
				};
				try {
					if (userClicked) setNote(pairRegenBtn ? "Regenerating public token…" : "Refreshing pairing code…", { tone: "warn" });
					try {
						const { invokeCwsNative } = await import("../vendor/@capacitor_core.js").then((n) => n.n);
						const result = await invokeCwsNative(pairRegenBtn ? "control:public-token:regenerate" : "control:pairing:status", {});
						const echo = result?.controlPairing || result?.echo || {};
						if (echo?.deviceCode || echo?.publicToken) {
							paint(echo);
							if (userClicked) setNote(pairRegenBtn ? "New public token generated — update the Control SPA." : "Pairing code refreshed.", { tone: "ok" });
							return;
						}
					} catch {}
					const g = globalThis;
					const port = Number(g.__CWSP_CONTROL_PORT__ || 29110) || 29110;
					const apiKey = String(g.__CWSP_CONTROL_API_KEY__ || "cwsp-neutralino-local").trim();
					const res = await fetch(`http://127.0.0.1:${port}${pairRegenBtn ? "/service/pair/regenerate-public-token" : "/service/pair/display"}`, {
						method: pairRegenBtn ? "POST" : "GET",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"X-API-Key": apiKey
						},
						body: pairRegenBtn ? "{}" : void 0
					});
					if (!res.ok) throw new Error(`Control HTTP ${res.status}`);
					paint(await res.json());
					if (userClicked) setNote(pairRegenBtn ? "New public token generated — update the Control SPA." : "Pairing code refreshed.", { tone: "ok" });
				} catch (e) {
					if (userClicked) setNote(String(e?.message || e || "Pairing status unavailable"), { tone: "err" });
				}
			})();
			return;
		}
		const filesPickSaf = t?.closest?.("button[data-action=\"files-storage-pick-saf\"]");
		const filesClearSaf = t?.closest?.("button[data-action=\"files-storage-clear-saf\"]");
		const filesShowPaths = t?.closest?.("button[data-action=\"files-storage-show-paths\"]");
		const filesShareReadme = t?.closest?.("button[data-action=\"files-storage-share-readme\"]");
		const filesOpenExplorer = t?.closest?.("button[data-action=\"files-storage-open-explorer\"]");
		const filesPermStatus = t?.closest?.("button[data-action=\"files-storage-perm-status\"]");
		const filesRequestMedia = t?.closest?.("button[data-action=\"files-storage-request-media\"]");
		const filesRequestAllFiles = t?.closest?.("button[data-action=\"files-storage-request-all-files\"]");
		if (filesPickSaf || filesClearSaf || filesShowPaths || filesShareReadme || filesOpenExplorer || filesPermStatus || filesRequestMedia || filesRequestAllFiles) {
			(async () => {
				try {
					const { invokeCwsNative } = await import("../vendor/@capacitor_core.js").then((n) => n.n);
					const s = await loadSettings();
					const safEl = root.querySelector("[data-files-saf-uri]");
					const pathsEl = root.querySelector("[data-files-storage-paths]");
					const permEl = root.querySelector("[data-files-perm-status]");
					const paintSaf = (uri) => {
						if (!safEl) return;
						const u = String(uri || "").trim();
						safEl.textContent = u ? `SAF folder: ${u.length > 72 ? `${u.slice(0, 36)}…${u.slice(-28)}` : u}` : "SAF folder: (not set)";
					};
					const paintPerm = (echo) => {
						if (!permEl) return;
						permEl.textContent = `Media/storage runtime: ${echo.runtimeGranted === true ? "granted" : "missing"}` + (echo.missingRuntime ? ` (${echo.missingRuntime})` : "") + `\nAll-files access: ${echo.allFilesAccess === true ? "granted" : "not granted"}` + (echo.note ? `\n${echo.note}` : "");
					};
					if (filesClearSaf) {
						s.shell = {
							...s.shell || {},
							filesIncomingDir: "",
							filesLandingMode: s.shell?.filesLandingMode || "app"
						};
						await saveSettings(s);
						paintSaf("");
						setNote("SAF folder cleared.", { tone: "ok" });
						return;
					}
					const channel = filesPickSaf ? "files:storage:pick-landing" : filesShareReadme ? "files:storage:share-readme" : filesOpenExplorer ? "files:storage:open-explorer" : filesRequestMedia ? "files:storage:request-media" : filesRequestAllFiles ? "files:storage:request-all-files" : filesPermStatus ? "files:storage:permissions-status" : "files:storage:status";
					const stagingEl = root.querySelector("[data-field=\"shell.filesStagingRoot\"]");
					const landingEl = root.querySelector("[data-field=\"shell.filesLandingMode\"]");
					setNote(filesPickSaf ? "Opening folder picker…" : filesOpenExplorer ? "Opening CWSP Files…" : filesRequestMedia ? "Requesting media permission…" : filesRequestAllFiles ? "Opening all-files settings…" : "Reading storage…", { tone: "warn" });
					const result = await invokeCwsNative(channel, {
						stagingRoot: stagingEl?.value || s.shell?.filesStagingRoot || "app",
						landingMode: landingEl?.value || s.shell?.filesLandingMode || "app",
						incomingDir: s.shell?.filesIncomingDir || ""
					});
					const echo = result?.echo || result?.envelope?.payload || {};
					const err = echo?.error || result?.error || (!result?.ok && !echo?.outgoingDir && !echo?.documentUri && echo?.runtimeGranted === void 0 ? "storage action failed" : "");
					if (err) {
						setNote(String(err), { tone: "err" });
						return;
					}
					if (filesPickSaf && echo?.incomingDir) {
						s.shell = {
							...s.shell || {},
							filesIncomingDir: String(echo.incomingDir),
							filesLandingMode: "saf"
						};
						await saveSettings(s);
						if (landingEl) landingEl.value = "saf";
						paintSaf(String(echo.incomingDir));
						setNote("SAF folder saved. Landing mode set to SAF.", { tone: "ok" });
						return;
					}
					if (echo.runtimeGranted !== void 0 || echo.allFilesAccess !== void 0) paintPerm(echo);
					if (pathsEl && (echo?.outgoingDir || echo?.incomingAppDir || echo?.readmePath || echo?.note)) pathsEl.textContent = `Outgoing temp: ${echo.outgoingDir || "?"}\nIncoming temp: ${echo.incomingAppDir || "?"}\nLanding mode: ${echo.landingMode || "?"}` + (echo?.incomingDir ? `\nSAF: ${echo.incomingDir}` : "") + (echo?.note && echo.runtimeGranted === void 0 ? `\n${echo.note}` : "");
					setNote(filesShareReadme ? "Shared README — open it in another app to see the paths." : filesOpenExplorer ? "Opened document picker — look for CWSP Files (or Files app sidebar)." : filesRequestAllFiles ? "Enable “Allow access to manage all files”, then tap Refresh status." : filesRequestMedia ? "Media permission dialog finished — see status." : "Status updated.", { tone: "ok" });
				} catch (e) {
					setNote(String(e?.message || e || "Files storage action failed"), { tone: "err" });
				}
			})();
			return;
		}
		const apkCheckBtn = t?.closest?.("button[data-action=\"apk-update-check\"]");
		const apkInstallBtn = t?.closest?.("button[data-action=\"apk-update-install\"]");
		if (apkCheckBtn || apkInstallBtn) {
			const channel = apkInstallBtn ? "app:update:install" : "app:update:check";
			(async () => {
				setNote(apkInstallBtn ? "Downloading APK…" : "Checking for update…", { tone: "warn" });
				try {
					const s = await loadSettings();
					const srcEl = root.querySelector("[data-field=\"shell.apkUpdateSource\"]");
					const endpointEl = root.querySelector("[data-field=\"core.endpointUrl\"]");
					const tokenEl = root.querySelector("[data-field=\"core.ecosystemToken\"]");
					const insecureEl = root.querySelector("[data-field=\"core.allowInsecureTls\"]");
					const versionEl = root.querySelector("[data-apk-local-version]");
					const source = (srcEl?.value || s.shell?.apkUpdateSource || "wan").trim();
					const endpointUrl = (endpointEl?.value || s.core?.endpointUrl || "").trim();
					const token = (tokenEl?.value || "").trim() || resolveEcosystemToken(s);
					const allowInsecureTls = insecureEl?.checked ?? Boolean(s.core?.allowInsecureTls);
					const { invokeCwsNative } = await import("../vendor/@capacitor_core.js").then((n) => n.n);
					const result = await invokeCwsNative(channel, {
						source,
						endpointUrl,
						token,
						ecosystemToken: token,
						allowInsecureTls
					});
					const echo = result?.echo || result?.envelope?.payload || {};
					const err = echo?.error || result?.error || (!result?.ok && !result?.echo ? "update failed" : "");
					if (err) {
						setNote(String(err), { tone: "err" });
						return;
					}
					if (versionEl && (echo?.localVersionCode != null || echo?.localVersionName)) {
						const sig = String(echo?.localSignatureSha256 || "").slice(0, 12);
						versionEl.textContent = `Installed: ${echo.localVersionName || "?"} (${echo.localVersionCode ?? "?"})` + (sig ? ` · sig ${sig}…` : "");
					}
					if (apkInstallBtn) {
						setNote(echo?.launchedInstaller ? "Installer launched — confirm on the system prompt." : "Install request sent.", { tone: "ok" });
						return;
					}
					const local = echo?.localVersionCode ?? "?";
					const remote = echo?.remoteVersionCode ?? "?";
					const avail = echo?.updateAvailable === true;
					if (!(echo?.signatureCompatible !== false)) {
						setNote(`Signature mismatch — remote APK not signed like this install (local ${local}, remote ${remote}).`, { tone: "err" });
						return;
					}
					setNote(avail ? `Update available: ${local} → ${remote} (${echo?.remoteVersionName || "?"}).` : `Up to date (local ${local}, remote ${remote}).`, { tone: avail ? "warn" : "ok" });
				} catch (e) {
					setNote(String(e?.message || e), { tone: "err" });
				}
			})();
			return;
		}
		if (!t?.closest?.("button[data-action=\"save\"]")) return;
		(async () => {
			setNote("Saving…", { tone: "warn" });
			const current = await loadSettings();
			let parsedMarkdownExtensions = current.appearance?.markdown?.extensions || [];
			const rawExtensions = hasPanel("markdown") ? markdownExtensions?.value?.trim() || "" : "";
			if (rawExtensions) try {
				const parsed = JSON.parse(rawExtensions);
				if (!Array.isArray(parsed)) throw new Error("Markdown extensions JSON must be an array.");
				parsedMarkdownExtensions = parsed;
			} catch (error) {
				switchSettingsTab("markdown");
				setNote(error?.message || "Invalid Markdown extensions JSON.");
				return;
			}
			const next = {
				...current,
				ai: hasPanel("ai") ? {
					baseUrl: apiUrl?.value?.trim?.() || "",
					apiKey: apiKey?.value?.trim?.() || "",
					model: model?.value || "gpt-5.6-luna",
					customModel: model?.value === "custom" ? customModel?.value?.trim?.() || "" : "",
					defaultReasoningEffort: defaultReasoningEffort?.value || "medium",
					defaultVerbosity: defaultVerbosity?.value || "medium",
					maxOutputTokens: parseNumberOrDefault(maxOutputTokens?.value, 4e5),
					contextTruncation: contextTruncation?.value || "disabled",
					promptCacheRetention: promptCacheRetention?.value || "in-memory",
					maxToolCalls: parseNumberOrDefault(maxToolCalls?.value, 8),
					parallelToolCalls: (parallelToolCalls?.checked ?? true) !== false,
					requestTimeout: {
						low: parseNumberOrDefault(requestTimeoutLow?.value, 6e4),
						medium: parseNumberOrDefault(requestTimeoutMedium?.value, 3e5),
						high: parseNumberOrDefault(requestTimeoutHigh?.value, 9e5)
					},
					maxRetries: parseNumberOrDefault(maxRetries?.value, 2),
					shareTargetMode: mode?.value || "recognize",
					autoProcessShared: (autoProcessShared?.checked ?? true) !== false,
					responseLanguage: responseLanguage?.value || "auto",
					translateResults: Boolean(translateResults?.checked),
					generateSvgGraphics: Boolean(generateSvgGraphics?.checked),
					mcp: hasPanel("mcp") ? collectMcpConfigurations(mcpSection) : current.ai?.mcp || [],
					customInstructions: current.ai?.customInstructions || [],
					activeInstructionId: current.ai?.activeInstructionId || ""
				} : current.ai || {},
				speech: hasPanel("ai") ? { language: speechLanguage?.value || "en-US" } : current.speech || {},
				core: hasPanel("server") ? {
					...current.core,
					ntpEnabled: readCheckboxValue(ntpEnabled, Boolean(current.core?.ntpEnabled)),
					mode: readTrimmedControlValue(coreMode, current.core?.mode || "native") || "native",
					endpointUrl: readTrimmedControlValue(coreEndpointUrl, current.core?.endpointUrl || ""),
					userId: readTrimmedControlValue(coreUserId, current.core?.userId || ""),
					ecosystemToken: (() => {
						return readTrimmedControlValue(coreEcosystemToken, current.core?.ecosystemToken || current.core?.userKey || current.core?.socket?.accessToken || "") || readTrimmedControlValue(coreUserKey, current.core?.userKey || "") || readTrimmedControlValue(coreSocketAccessToken, current.core?.socket?.accessToken || current.core?.socket?.airpadAuthToken || "");
					})(),
					userKey: (() => {
						return readTrimmedControlValue(coreEcosystemToken, current.core?.ecosystemToken || current.core?.userKey || current.core?.socket?.accessToken || "") || readTrimmedControlValue(coreUserKey, current.core?.userKey || "") || readTrimmedControlValue(coreSocketAccessToken, current.core?.socket?.accessToken || current.core?.socket?.airpadAuthToken || "");
					})(),
					encrypt: readCheckboxValue(coreEncrypt, Boolean(current.core?.encrypt)),
					preferBackendSync: readCheckboxValue(corePreferBackendSync, (current.core?.preferBackendSync ?? true) !== false),
					appClientId: readTrimmedControlValue(coreAppClientId, current.core?.appClientId || ""),
					allowInsecureTls: readCheckboxValue(coreAllowInsecureTls, Boolean(current.core?.allowInsecureTls)),
					useCoreIdentityForAirPad: true,
					socket: (() => {
						const prev = { ...current.core?.socket || {} };
						delete prev.airpadAuthToken;
						const eco = readTrimmedControlValue(coreEcosystemToken, current.core?.ecosystemToken || current.core?.userKey || current.core?.socket?.accessToken || "") || readTrimmedControlValue(coreUserKey, current.core?.userKey || "") || readTrimmedControlValue(coreSocketAccessToken, current.core?.socket?.accessToken || current.core?.socket?.airpadAuthToken || "");
						return {
							...prev,
							accessToken: eco,
							routeTarget: readTrimmedControlValue(coreSocketRouteTarget, current.core?.socket?.routeTarget || ""),
							selfId: "",
							clientAccessToken: readTrimmedControlValue(coreSocketClientAccessToken, current.core?.socket?.clientAccessToken || ""),
							allowAccessTokenWithoutUserKey: readCheckboxValue(coreSocketAllowAccessWithoutUserKey, Boolean(current.core?.socket?.allowAccessTokenWithoutUserKey))
						};
					})(),
					admin: {
						...current.core?.admin || {},
						httpsOrigin: readTrimmedControlValue(coreAdminHttps, current.core?.admin?.httpsOrigin || ""),
						httpOrigin: readTrimmedControlValue(coreAdminHttp, current.core?.admin?.httpOrigin || ""),
						path: readTrimmedControlValue(coreAdminPath, current.core?.admin?.path || "/") || "/"
					},
					ops: {
						...current.core?.ops || {},
						allowUnencrypted: readCheckboxValue(coreOpsAllowUnencrypted, Boolean(current.core?.ops?.allowUnencrypted))
					}
				} : { ...current.core || {} },
				shell: hasPanel("server") ? {
					...current.shell || {},
					maintainHubSocketConnection: readCheckboxValue(shellMaintainHubSocket, Boolean(current.shell?.maintainHubSocketConnection)),
					clipboardBroadcastTargets: readTrimmedControlValue(shellClipboardBroadcastTargets, current.shell?.clipboardBroadcastTargets || ""),
					pushLocalClipboardToLan: readCheckboxValue(shellPushLocalClipboard, Boolean(current.shell?.pushLocalClipboardToLan)),
					clipboardPushIntervalMs: (() => {
						const raw = shellClipboardPushIntervalMs?.value;
						const n = parseNumberOrDefault(raw, current.shell?.clipboardPushIntervalMs ?? 2e3);
						return Math.min(6e4, Math.max(800, Math.round(n)));
					})(),
					enableRemoteClipboardBridge: readCheckboxValue(shellClipboard, (current.shell?.enableRemoteClipboardBridge ?? true) !== false),
					acceptInboundClipboardData: readCheckboxValue(shellAcceptInboundClipboard, (current.shell?.acceptInboundClipboardData ?? true) !== false),
					clipboardInboundAllowIds: readTrimmedControlValue(shellClipboardInboundAllowIds, current.shell?.clipboardInboundAllowIds || ""),
					accessTokenBypassesClipboardAllowlist: readCheckboxValue(shellAccessTokenBypassClipboardAllow, Boolean(current.shell?.accessTokenBypassesClipboardAllowlist)),
					clipboardShareDestinationIds: readTrimmedControlValue(shellClipboardShareDestIds, current.shell?.clipboardShareDestinationIds || ""),
					applyRemoteClipboardToDevice: readCheckboxValue(shellApplyRemoteDevice, (current.shell?.applyRemoteClipboardToDevice ?? true) !== false),
					acceptContactsBridgeData: readCheckboxValue(shellAcceptContactsBridge, Boolean(current.shell?.acceptContactsBridgeData)),
					acceptSmsBridgeData: isCapacitorNative() ? false : readCheckboxValue(shellAcceptSmsBridge, Boolean(current.shell?.acceptSmsBridgeData)),
					enableNativeSms: isCapacitorNative() ? false : readCheckboxValue(shellSms, (current.shell?.enableNativeSms ?? false) === true),
					enableNativeContacts: readCheckboxValue(shellContacts, (current.shell?.enableNativeContacts ?? true) !== false)
				} : { ...current.shell || {} },
				appearance: hasPanel("appearance") || hasPanel("markdown") ? {
					theme: theme?.value || "auto",
					fontSize: fontSize?.value || "medium",
					markdown: {
						preset: markdownPreset?.value || "default",
						fontFamily: markdownFontFamily?.value || "system",
						fontSizePx: parseNumberOrDefault(markdownFontSizePx?.value, 16),
						lineHeight: parseFloatInRange(markdownLineHeight?.value, 1.7, 1.1, 2.2),
						contentMaxWidthPx: parseNumberOrDefault(markdownContentMaxWidthPx?.value, 860),
						printScale: parseFloatInRange(markdownPrintScale?.value, 1, .5, 1.5),
						page: {
							size: markdownPageSize?.value || "auto",
							orientation: markdownPageOrientation?.value || "portrait",
							marginMm: parseNumberOrDefault(markdownPageMarginMm?.value, 12)
						},
						modules: {
							typography: (markdownModuleTypography?.checked ?? true) !== false,
							lists: (markdownModuleLists?.checked ?? true) !== false,
							tables: (markdownModuleTables?.checked ?? true) !== false,
							codeBlocks: (markdownModuleCodeBlocks?.checked ?? true) !== false,
							blockquotes: (markdownModuleBlockquotes?.checked ?? true) !== false,
							media: (markdownModuleMedia?.checked ?? true) !== false,
							printBreaks: (markdownModulePrintBreaks?.checked ?? true) !== false
						},
						plugins: {
							smartTypography: Boolean(markdownPluginSmartTypography?.checked),
							softBreaksAsBr: Boolean(markdownPluginSoftBreaks?.checked),
							externalLinksNewTab: (markdownPluginExternalLinks?.checked ?? true) !== false
						},
						customCss: markdownCustomCss?.value || "",
						printCss: markdownPrintCss?.value || "",
						extensions: parsedMarkdownExtensions || []
					}
				} : current.appearance || {}
			};
			collectContributions(root, next, contributionCtx);
			await resolveCwspSettingsBeforeSave(next);
			const settingsToSave = next;
			const permPromise = contributionCtx.surface === "capacitor" || contributionCtx.surface === "native" ? requestCapacitorSettingsPermissionsAfterSave(settingsToSave).catch((e) => {
				console.warn("[Settings] native permission flow failed:", e);
				return {
					lines: [],
					results: []
				};
			}) : Promise.resolve({
				lines: [],
				results: []
			});
			const saved = await saveSettings(settingsToSave);
			if (!saved) {
				setNote("Settings save returned no data.", { tone: "err" });
				return;
			}
			let publicControlSpa = false;
			try {
				publicControlSpa = String(document.documentElement?.dataset?.cwspSurface || "").toLowerCase() === "cwsp-control" || /^(www\.)?cwsp\.u2re\.space$/i.test(String(location.hostname || ""));
			} catch {
				publicControlSpa = false;
			}
			try {
				if (publicControlSpa) {
					const ensure = globalThis.__CWSP_ENSURE_CONTROL_FOR_SAVE__;
					if (typeof ensure === "function") {
						const ready = await ensure();
						if (!ready?.ok) {
							noteSettingsControlSync(false, ready?.error || "Control not paired");
							setNote(ready?.error || "Pair phone Control (token + code + Accept) before Save", { tone: "warn" });
							return;
						}
					}
				}
				await persistContributionsViaSync(root, saved, contributionCtx);
				if (publicControlSpa) {
					if (Boolean(globalThis.__CWSP_CONTROL_BRIDGE_LIVE__)) noteSettingsControlSync(true);
				}
			} catch (e) {
				console.warn("[Settings] backend settings:patch failed:", e);
				const msg = e instanceof Error ? e.message : String(e);
				if (publicControlSpa) noteSettingsControlSync(false, msg);
				if (/pairing|unauthorized|401|403|Control/i.test(msg)) {
					setNote(msg, { tone: "warn" });
					return;
				}
			}
			applyContributions(root, saved, contributionCtx);
			const report = getLastSettingsSaveReport();
			const permReport = await permPromise;
			const permLines = permReport.lines;
			const permDenied = permReport.results.some((r) => r.granted === false);
			import("./hub-socket-boot.js").then((n) => n.n).then(async (m) => {
				if (publicControlSpa) {
					try {
						if (!Boolean(globalThis.__CWSP_CONTROL_BRIDGE_LIVE__)) console.warn("[Settings] Control not paired — settings saved locally only; pair to push to device");
					} catch {}
					return;
				}
				if (typeof m.nodeClipboardHubOwnsExclusiveWebsocket === "function" && m.nodeClipboardHubOwnsExclusiveWebsocket()) {
					try {
						const g = globalThis;
						if (g.__CWS_NODE_CLIPBOARD_HUB__ === false) return;
						const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
						const port = Number(auth?.port) || 29110;
						const host = String(auth?.host || "127.0.0.1").trim() || "127.0.0.1";
						if (port === 8434 && host !== "127.0.0.1" && host !== "localhost") return;
						if (port !== 29110) return;
						const key = String(auth?.key || "cwsp-neutralino-local");
						const core = saved.core;
						const token = String(core?.ecosystemToken || core?.userKey || core?.socket?.accessToken || "").trim();
						const body = {};
						if (core?.endpointUrl) body.remoteHost = String(core.endpointUrl).trim();
						if (token) {
							body.accessToken = token;
							body.clientToken = token;
						}
						if (core?.userId) body.clientId = String(core.userId).trim();
						body.force = true;
						await fetch(`http://${host}:${port}/service/clipboard-hub`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-API-Key": key
							},
							body: JSON.stringify(body),
							cache: "no-store"
						});
					} catch (e) {
						console.warn("[Settings] Node clipboard-hub reload skipped", e);
					}
					return;
				}
				if (typeof m.nativeShellOwnsExclusiveHubWebsocket === "function" && m.nativeShellOwnsExclusiveHubWebsocket()) {
					try {
						const { invokeCwsNative } = await import("../vendor/@capacitor_core.js").then((n) => n.n);
						await invokeCwsNative("runtime:reload-settings", {});
					} catch (e) {
						console.warn("[Settings] Java /ws reload skipped", e);
					}
					return;
				}
				await m.applyHubSocketFromSettings(saved);
				import("./hub-socket-boot.js").then((n) => n.c).then((ws) => {
					if (typeof ws.reconnectTransportAfterLifecycleResume === "function") ws.reconnectTransportAfterLifecycleResume("settings-save");
				}).catch(() => void 0);
			});
			applyTheme(saved);
			opts.onTheme?.(saved.appearance?.theme || "auto");
			const parts = ["Saved locally"];
			if (report.nativeSynced === true) parts.push("synced to Android");
			else if (report.nativeSynced === false && !permDenied) console.warn("[Settings] native settings patch:", report.nativeError || "not confirmed");
			else if (report.nativeSynced === false) parts.push(`native sync failed${report.nativeError ? `: ${report.nativeError}` : ""}`);
			const controlVia = (() => {
				try {
					return String(globalThis.__CWSP_CONTROL_VIA__ || "");
				} catch {
					return "";
				}
			})();
			const controlLabel = controlVia === "android" ? "phone Control (Capacitor)" : controlVia === "neutralino" ? "desk Control (Neutralino)" : publicControlSpa ? "Control" : "desk Control";
			if (report.webnativeSynced === true) parts.push(`synced to ${controlLabel}`);
			else if (report.webnativeSynced === false) parts.push(`${controlLabel} sync failed${report.webnativeError ? `: ${report.webnativeError}` : ""}`);
			if (permLines.length) parts.push(...permLines);
			let tone = "ok";
			if (permDenied || report.webnativeSynced === false) tone = "warn";
			setNote(parts.join(" · "), { tone });
		})().catch((err) => setNote(String(err), { tone: "err" }));
	});
	if (opts.isExtension) {
		if (extSection) extSection.hidden = false;
		if (extTab) extTab.hidden = false;
		const extNote = H`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;
		root.append(extNote);
	}
	const initialTab = resolveInitialTab(opts.initialTab);
	switchSettingsTab(initialTab);
	if (!root.querySelector(`[data-tab-panel="${initialTab}"]:not([hidden])`)) {
		const firstPanel = root.querySelector("[data-tab-panel]");
		if (firstPanel) switchSettingsTab(firstPanel.getAttribute("data-tab-panel") || initialTab);
	}
	syncCustomModelVisibility();
	const panelCount = root.querySelectorAll("[data-tab-panel]").length;
	const tabCount = root.querySelectorAll("[data-action=\"switch-settings-tab\"][data-tab]").length;
	try {
		globalThis.__CWSP_FRONTEND_DEBUG__?.log("settings-view", "info", `mounted profile=${settingsProfile} surface=${contributionCtx.surface} tabs=${tabCount} panels=${panelCount} active=${root.querySelector("[data-settings-tabs]")?.getAttribute("data-active-tab")}`);
	} catch {}
	if (panelCount === 0) {
		const empty = document.createElement("section");
		empty.className = "card settings-tab-panel";
		empty.setAttribute("data-tab-panel", "cwsp");
		empty.innerHTML = "<h3>CWSP</h3><p class=\"field-hint\">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>";
		root.querySelector(".settings-screen__body")?.appendChild(empty);
		switchSettingsTab("cwsp");
	}
	root.addEventListener("cwsp-settings-resync", () => {
		attachSettingsInlineStylesWhenConnected(root);
		switchSettingsTab(root.querySelector("[data-settings-tabs]")?.getAttribute("data-active-tab") || initialTab);
	});
	return root;
};
//#endregion
//#region ../../modules/views/settings-view/src/index.ts
var defaultSettings = {
	appearance: {
		theme: "auto",
		fontSize: "medium"
	},
	ai: { autoProcess: true },
	general: {
		autosave: true,
		notifications: true
	}
};
var SettingsView = class {
	id = "settings";
	name = "Settings";
	icon = "gear";
	options;
	shellContext;
	element = null;
	settings = ref(defaultSettings);
	/** Document-level adopted sheet (PWA / no shadow). */
	_sheet = null;
	/** Shell open-shadow: same CSS must be on `shadowRoot.adoptedStyleSheets` — document rules do not pierce. */
	_shadowSheet = null;
	/** Fallback if constructable stylesheet fails in a shadow root. */
	_styleEl = null;
	lifecycle = {
		onUnmount: () => {
			this.clearSettingsStylesheet();
		},
		onShow: () => {
			this.applySettingsStylesheet();
			this.element?.dispatchEvent(new CustomEvent("cwsp-settings-resync", { bubbles: false }));
		},
		onHide: () => {}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this.loadSettings();
		const isExtensionRuntime = typeof globalThis.chrome !== "undefined" && Boolean(globalThis.chrome?.runtime?.id);
		this.element = createSettingsView({
			isExtension: isExtensionRuntime,
			initialTab: options?.params?.tab || options?.params?.focus,
			onTheme: (theme) => {
				this.options.onThemeChange?.(theme);
			}
		});
		queueMicrotask(() => attachSettingsInlineStylesWhenConnected(this.element));
		return this.element;
	}
	getToolbar() {
		return null;
	}
	setupEventHandlers() {}
	loadSettings() {
		this.settings.value = { ...defaultSettings };
	}
	saveSettings() {
		this.options.onSettingsChange?.(this.settings.value);
	}
	resetSettings() {
		this.settings.value = { ...defaultSettings };
		this.updateUI();
	}
	updateUI() {
		if (!this.element) return;
		const inputs = this.element.querySelectorAll("[data-setting]");
		for (const input of inputs) {
			const [section, key] = input.dataset.setting.split(".");
			const value = this.settings.value[section][key];
			if (input.type === "checkbox") input.checked = Boolean(value);
			else input.value = value || "";
		}
	}
	showMessage(message) {
		this.shellContext?.showMessage(message);
	}
	applySettingsStylesheet() {
		attachSettingsInlineStylesWhenConnected(this.element);
	}
	clearSettingsStylesheet() {
		try {
			this.element?.querySelector("style[data-settings-view-css]")?.remove();
			if (this._styleEl) {
				this._styleEl.remove();
				this._styleEl = null;
			}
			if (this._shadowSheet) {
				const { sheet, root } = this._shadowSheet;
				root.adoptedStyleSheets = root.adoptedStyleSheets.filter((s) => s !== sheet);
				this._shadowSheet = null;
			}
			if (this._sheet) {
				removeAdopted(this._sheet);
				this._sheet = null;
			}
		} catch {}
	}
	canHandleMessage(messageType) {
		return messageType === "settings-update";
	}
	async handleMessage(message) {
		const msg = message;
		if (msg.data) {
			this.settings.value = {
				...this.settings.value,
				...msg.data
			};
			this.updateUI();
		}
	}
	invokeChannelApi(action, payload) {
		if (action === SettingsChannelAction.Patch || action === SettingsChannelAction.SettingsUpdate) {
			this.handleMessage({ data: payload });
			(async () => {
				try {
					const [{ loadSettings }, { applyTheme }] = await Promise.all([import("./Settings.js").then((n) => n.t), import("./Theme.js").then((n) => n.t)]);
					const cur = await loadSettings();
					const patch = payload;
					applyTheme({
						...cur,
						...patch,
						appearance: {
							...cur.appearance || {},
							...patch.appearance || {}
						}
					});
				} catch (e) {
					console.warn("[SettingsView] channel applyTheme failed:", e);
				}
			})();
			return true;
		}
	}
};
function createView(options) {
	return new SettingsView(options);
}
//#endregion
export { SettingsView, applyContributions, clearSettingsSyncArms, collectContributions, createMemorySettingsSyncArm, createSettingsView, createView, createView as default, detectSettingsSurface, getSettingsContributions, getSettingsDefaults, getSettingsSnapshot, getSettingsSync, hydrateContributionsFromSync, mergeSettingsPatch, mountContributions, patchSettingsSync, persistContributionsViaSync, registerBuiltinSettingsContributions, registerCwspSettingsContribution, registerDeviceSettingsContribution, registerReaderSettingsContribution, registerSettingsContribution, registerSettingsSyncArm, registerWorkcenterSettingsContribution, resolveSettingsSurface, resolveSettingsSyncArm, setSurfaceDetector, unregisterSettingsSyncArm };
