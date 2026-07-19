import { p as isEnabledView } from "./views.js";
import { g as removeAdopted } from "../fest/dom.js";
import { c as ref, o as observe } from "../fest/object.js";
import { l as sendMessage } from "./UnifiedMessaging.js";
import { I as H } from "../com/app.js";
import { t as DEFAULT_INSTRUCTION_TEMPLATES } from "./templates.js";
import { r as normalizeEcosystemToken, t as BUILTIN_AI_MODELS } from "./SettingsTypes.js";
import { W as resolveCwspUrlFields } from "./airpad-cwsp-client-parity.js";
import { d as applyAirpadRuntimeFromAppSettings } from "./config.js";
import { a as loadSettings, i as getLastSettingsSaveReport, n as ensureCapacitorCwspSettingsSeeded, o as saveSettings, r as ensureCrxCwspSettingsSeeded } from "./Settings.js";
import { n as isCapacitorNative } from "./capacitor-permissions.js";
import { n as requestCapacitorSettingsPermissionsAfterSave } from "./capacitor-settings-permissions.js";
import { n as applyTheme } from "./Theme.js";
import { n as navigateToView } from "../shells/boot-shell-slots.js";
import { a as SettingsChannelAction } from "./channel-actions.js";
import { n as openAdminDoorFromCore, r as resolveAdminDoorUrls } from "./admin-doors.js";
import { c as updateInstruction, i as deleteInstruction, n as addInstruction, o as getInstructionRegistry, r as addInstructions, s as setActiveInstruction } from "./CustomInstructions.js";
import { a as registerCwspSettingsContribution, c as collectContributionFields, i as registerDeviceSettingsContribution, l as getSettingsContributions, n as registerWorkcenterSettingsContribution, o as registerAirpadSettingsContribution, r as registerReaderSettingsContribution, s as bindContributionFields, t as registerBuiltinSettingsContributions, u as registerSettingsContribution } from "./register-builtin-contributions.js";
import { a as setString, t as StorageKeys } from "../com/app6.js";
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-styles-attach.ts
var STYLE_MARKER = "data-settings-view-css";
/** WHY: Inlined `@layer` loses to unlayered shell CSS in Capacitor WebView — unwrap for paint. */
var normalizeInlineSettingsCss = (raw) => {
	let css = String(raw || "").trim();
	const layered = css.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);
	if (layered) css = layered[1].trim();
	return css;
};
/** Minimal layout if SCSS inline import is empty in a bad bundle. */
var CRITICAL_SETTINGS_CSS = `
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;color:#e8edf2!important;background:#0f1318!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch}
.view-settings [data-tab-panel]:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important}
.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select{pointer-events:auto!important;color:inherit!important}
`;
/** Attach Settings.scss to a `.view-settings` host (works in light DOM + open shadow roots). */
var attachSettingsInlineStyles = (host) => {
	if (!host?.classList?.contains("view-settings")) return;
	if (host.querySelector(`style[${STYLE_MARKER}]`)) return;
	let css = normalizeInlineSettingsCss(String("@layer settings-view{.view-settings{color-scheme:inherit;--sv-bg:var(--color-surface,light-dark(#eef1f6,#0f1318));--sv-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--sv-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--sv-outline:var(--color-outline-variant,light-dark(#c5cdd8,#3d4755));--sv-surface-1:var(--color-surface-container-low,light-dark(#ffffff,#171c24));--sv-surface-2:var(--color-surface-container,light-dark(#f4f6fa,#1c232d));--sv-primary:var(--color-primary,#007acc);--sv-on-primary:var(--color-on-primary,#ffffff);--sv-danger:var(--color-error,#d32f2f);--sv-divider:color-mix(in oklab,var(--sv-outline) 35%,transparent);--sv-ring:color-mix(in oklab,var(--sv-outline) 55%,transparent);--sv-elev:0 2px 14px color-mix(in oklab,var(--sv-fg) 5%,transparent);background-color:var(--sv-bg);block-size:100%;color:var(--sv-fg);display:grid;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;margin:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:clamp(.5rem,2cqi,1rem);text-align:start}.view-settings,.view-settings *,.view-settings :after,.view-settings :before{box-sizing:border-box}.view-settings :where(select,input,textarea,option,button){font-family:inherit;pointer-events:auto}.view-settings textarea{container-type:inline-size;inline-size:100%;max-inline-size:100%;resize:vertical}.view-settings :is(h2,h3){color:var(--sv-fg);margin:0;text-align:start}.view-settings h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em}.view-settings h3{font-size:.94rem;font-weight:600;letter-spacing:-.01em}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--sv-divider);display:flex;flex-direction:column;flex-shrink:0;gap:.75rem;min-inline-size:0;padding-block-end:.875rem}.view-settings .settings-screen__title{font-size:clamp(1.05rem,2.5cqi,1.35rem);font-weight:600;letter-spacing:-.015em}@media (min-width:720px){.view-settings .settings-screen__top{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:1rem;overscroll-behavior:contain;padding-block:.75rem;scrollbar-color:var(--sv-outline) transparent;scrollbar-width:thin}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:99px}.view-settings .settings-screen__footer{align-items:center;background:color-mix(in oklab,var(--sv-surface-1) 85%,var(--sv-bg));border-block-start:1px solid var(--sv-divider);box-shadow:0 -10px 28px color-mix(in oklab,var(--sv-fg) 4%,transparent);display:flex;flex-shrink:0;flex-wrap:wrap;gap:.5rem;inline-size:stretch;justify-content:flex-start;padding-block:.75rem;padding-inline:.25rem}.view-settings .settings-tab-actions{align-items:center;container-type:inline-size;display:flex;flex-wrap:nowrap;gap:.375rem;inline-size:stretch;max-inline-size:stretch;overflow-x:auto;pointer-events:auto;position:relative;scrollbar-color:var(--sv-outline) transparent;scrollbar-width:thin;z-index:1}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--sv-surface-2) 94%,transparent);border:none;border-radius:999px;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent);color:var(--sv-muted);cursor:pointer;font-size:.75rem;font-weight:500;min-block-size:2.5rem;padding:.5rem .875rem;pointer-events:auto;transition:background-color .12s ease,color .12s ease,box-shadow .12s ease;white-space:nowrap}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--sv-surface-2) 100%,transparent);color:var(--sv-fg)}.view-settings .settings-tab-btn.is-active{background:var(--sv-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 40%,transparent);color:var(--sv-on-primary)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel.is-active:not([hidden]),.view-settings .settings-tab-panel:not([hidden]){align-items:stretch;display:flex;flex-direction:column;gap:.75rem;min-inline-size:0}.view-settings .settings-tab-panel[hidden]{display:none!important}.view-settings .card{background:color-mix(in oklab,var(--sv-surface-2) 92%,var(--sv-bg));border:none;border-radius:16px;box-shadow:var(--sv-elev),0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent);display:flex;flex-direction:column;gap:.75rem;inline-size:stretch;padding:1rem}@container (max-inline-size: 480px){.view-settings .card{border-radius:14px;padding:.875rem}}.view-settings .settings-panel-form{display:flex;flex-direction:column;gap:.75rem;inline-size:stretch}.view-settings .field{display:grid;font-size:.75rem;gap:.375rem;grid-auto-flow:row;inline-size:stretch;margin:0}.view-settings .field>span{color:var(--sv-muted);font-size:.75rem;font-weight:500}.view-settings .field.checkbox{align-items:center;gap:.625rem;grid-auto-columns:max-content 1fr;grid-auto-flow:column}.view-settings .field-hint{color:var(--sv-muted);font-size:.85em;line-height:1.45;margin:0 0 .75rem;opacity:.95}.view-settings :is(.form-input,.form-select){background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:10px;color:var(--sv-fg);display:block;font-size:.875rem;inline-size:100%;line-height:1.25;min-block-size:2.5rem;outline:none;padding:.5rem .65rem;transition:border-color .12s ease,box-shadow .12s ease}.view-settings :is(.form-input:focus-visible,.form-select:focus-visible){border-color:color-mix(in oklab,var(--sv-primary) 55%,var(--sv-outline));box-shadow:0 0 0 3px color-mix(in oklab,var(--sv-primary) 22%,transparent)}.view-settings :is(select.form-input,select.form-select){appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--sv-muted) 50%),linear-gradient(135deg,var(--sv-muted) 50%,transparent 50%);background-position:calc(100% - 14px) calc(50% - 2px),calc(100% - 9px) calc(50% - 2px);background-repeat:no-repeat;background-size:5px 5px;padding-inline-end:2rem}.view-settings .btn{align-items:center;background:color-mix(in oklab,var(--sv-surface-2) 90%,transparent);border:none;border-radius:999px;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent);color:var(--sv-fg);cursor:pointer;display:inline-flex;font-size:.8125rem;font-weight:500;gap:.35rem;justify-content:center;min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color .12s ease,box-shadow .12s ease,filter .12s ease}.view-settings .btn:hover{background:color-mix(in oklab,var(--sv-fg) 6%,var(--sv-surface-2))}.view-settings .btn.primary{background:var(--sv-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 26%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 45%,transparent);color:var(--sv-on-primary)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings :is(.btn.btn-sm,.btn.small){font-size:.75rem;min-block-size:2rem;padding:.35rem .65rem}.view-settings .btn.btn-danger{background:color-mix(in oklab,var(--sv-danger) 92%,#000);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-danger) 35%,transparent);color:var(--sv-on-primary)}.view-settings .btn.btn-danger:hover{filter:brightness(1.08)}.view-settings .btn.tiny{font-size:.72rem;min-block-size:2rem;padding:.3rem .5rem}.view-settings :is(.ext-note,.note){color:var(--sv-muted);display:block;flex:1 1 auto;font-size:.75rem;line-height:1.35;max-inline-size:100%;opacity:.92;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:normal}.view-settings :is(.ext-note.note--ok,.note.note--ok){color:color-mix(in oklab,var(--sv-accent,#3ecf8e) 70%,var(--sv-fg))}.view-settings :is(.ext-note.note--warn,.note.note--warn){color:color-mix(in oklab,#e6a700 75%,var(--sv-fg))}.view-settings :is(.ext-note.note--err,.note.note--err){color:color-mix(in oklab,#e05252 80%,var(--sv-fg))}.view-settings .ext-note{line-height:1.4}.view-settings .ext-note code{background:color-mix(in oklab,var(--sv-surface-2) 80%,var(--sv-bg));border-radius:4px;color:var(--sv-fg);font-size:.68rem;padding:2px 6px}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{accent-color:var(--sv-primary);block-size:1.15rem;flex-shrink:0;inline-size:1.15rem}.view-settings .mcp-section{display:flex;flex-direction:column;gap:.5rem}.view-settings .mcp-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-start:.5rem}.view-settings .mcp-row{background:color-mix(in oklab,var(--sv-surface-2) 88%,var(--sv-bg));border-radius:12px;box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent);display:grid;gap:.5rem;padding:.75rem}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{color:var(--sv-muted);font-size:.75rem;margin:0}.view-settings .settings-spoiler{background:color-mix(in oklab,var(--sv-surface-1) 55%,transparent);border:1px solid color-mix(in oklab,var(--sv-outline) 22%,transparent);border-radius:12px;padding:.25rem .5rem}.view-settings .settings-spoiler summary{color:var(--sv-fg);cursor:pointer;font-size:.8rem;font-weight:600;padding:.35rem .25rem}.view-settings .settings-spoiler .settings-panel-form{padding-block-end:.25rem}.view-settings .view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings .view-settings__section{border-block-end:1px solid var(--sv-divider);display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem}.view-settings .view-settings__section:last-of-type{border-block-end:none}.view-settings .view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings .view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings .view-settings__label>span{font-size:.8125rem;font-weight:500}.view-settings :is(.view-settings__input,.view-settings__select){background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:10px;color:var(--sv-fg);font-size:.875rem;min-block-size:2.5rem;padding:.45rem .6rem}.view-settings .view-settings__checkbox{align-items:center;display:flex;font-size:.8125rem;gap:.5rem}.view-settings .view-settings__actions{display:flex;gap:.75rem;margin-block-start:1.5rem}.view-settings .view-settings__btn{background:transparent;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);border-radius:8px;color:var(--sv-fg);cursor:pointer;padding:.55rem 1.1rem}.view-settings .view-settings__btn--primary{background:var(--sv-primary);border-color:color-mix(in oklab,var(--sv-primary) 30%,#000);color:var(--sv-on-primary)}.view-settings .view-settings__btn--primary:hover{filter:brightness(1.06)}.view-settings :is(.custom-instructions-editor,.custom-instructions-panel){display:flex;flex-direction:column;gap:.75rem}.view-settings :is(.ci-row,.cip-select-row){display:flex;flex-direction:column;gap:.35rem}.view-settings .ci-header{margin-block-end:.25rem}.view-settings .ci-header h4{font-size:.88rem;margin:0 0 .25rem}.view-settings .ci-desc{color:var(--sv-muted);font-size:.78rem;line-height:1.45;margin:0}.view-settings .ci-active-select{display:flex;flex-direction:column;gap:.25rem}.view-settings :is(.ci-select,.cip-select){background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);border-radius:10px;color:var(--sv-fg);font-size:.8rem;min-block-size:2.35rem;padding:.4rem .55rem}.view-settings :is(.ci-list,.cip-list){display:flex;flex-direction:column;gap:.5rem}.view-settings :is(.ci-item,.cip-item){background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 16%,transparent);border-radius:12px;padding:.65rem .75rem}.view-settings :is(.ci-item.active,.ci-item.is-active,.cip-item.active,.cip-item.is-active){border-color:color-mix(in oklab,var(--sv-primary) 35%,transparent);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-primary) 18%,transparent)}.view-settings :is(.ci-item-header,.cip-item-header){align-items:flex-start;display:flex;gap:.5rem;justify-content:space-between}.view-settings :is(.ci-item-label,.cip-item-label){font-size:.8rem;font-weight:600}.view-settings :is(.ci-item-actions,.cip-item-actions){display:flex;flex-wrap:wrap;gap:.35rem;justify-content:flex-end}.view-settings :is(.ci-badge,.cip-badge){background:color-mix(in oklab,var(--sv-primary) 16%,transparent);border-radius:999px;color:var(--sv-fg);font-size:.65rem;padding:.15rem .4rem}.view-settings :is(.ci-item-preview,.cip-item-preview){color:var(--sv-muted);font-size:.75rem;line-height:1.45;margin-block-start:.35rem}.view-settings :is(.ci-edit-form,.cip-edit-form){display:flex;flex-direction:column;gap:.5rem;margin-block-start:.5rem}.view-settings :is(.ci-actions,.ci-add-actions,.ci-edit-actions,.cip-form-actions,.cip-toolbar){align-items:center;display:flex;flex-wrap:wrap;gap:.5rem}.view-settings :is(.ci-input,.ci-textarea,.cip-input,.cip-textarea,.field-control){background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);border-radius:10px;color:var(--sv-fg);font-size:.8125rem;inline-size:100%;padding:.45rem .55rem}.view-settings :is(.ci-textarea,.cip-textarea){min-block-size:5rem}.view-settings :is(.ci-empty,.cip-empty){color:var(--sv-muted);font-size:.8rem;padding:.75rem;text-align:center}.view-settings .field-label{color:var(--sv-muted);font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}@container (max-inline-size: 1024px){.view-settings{padding:.65rem}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.3rem}.view-settings .settings-tab-btn{min-block-size:2.65rem;padding-inline:.7rem}}@container (max-inline-size: 480px){.view-settings{padding:.45rem}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{gap:.75rem;padding-block:.5rem}.view-settings .settings-screen__footer{align-items:stretch;flex-direction:column-reverse;gap:.5rem}.view-settings .settings-screen__footer .btn.primary{inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{text-align:center;white-space:normal}}}"));
	if (!css.trim()) css = CRITICAL_SETTINGS_CSS;
	else css = `${CRITICAL_SETTINGS_CSS}\n${css}`;
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
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`;
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
/** Remove host-variant built-in tabs that the profile replaces or folds elsewhere. */
var pruneBuiltInSettingsTabs = (root, profile) => {
	const hidden = profile === "cwsp-mobile" ? CWSP_MOBILE_HIDDEN_BUILTIN_TABS : profile === "extension" ? EXTENSION_HIDDEN_BUILTIN_TABS : null;
	if (!hidden) return;
	for (const tab of hidden) {
		root.querySelector(`[data-tab-panel="${tab}"]`)?.remove();
		root.querySelector(`[data-action="switch-settings-tab"][data-tab="${tab}"]`)?.remove();
	}
};
var defaultSettingsTabForProfile = (profile) => {
	if (profile === "cwsp-mobile") return "cwsp";
	if (profile === "extension") return "crx";
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
		if (g?.Capacitor?.isNativePlatform?.()) return "capacitor";
		if (g?.__CWS_NATIVE__ === true) return "native";
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
	return Boolean(typeof core?.endpointUrl === "string" && core.endpointUrl.trim() || typeof core?.userId === "string" && core.userId.trim() || typeof core?.ecosystemToken === "string" && core.ecosystemToken.trim() || typeof core?.userKey === "string" && core.userKey.trim() || typeof shell?.clipboardInboundMode === "string" && shell.clipboardInboundMode || typeof shell?.clipboardOutboundMode === "string" && shell.clipboardOutboundMode || typeof shell?.remoteHost === "string" && shell.remoteHost.trim() || typeof bridge?.endpointUrl === "string" && bridge.endpointUrl.trim() || typeof bridge?.userId === "string" && String(bridge.userId).trim());
};
/** Load local settings then overlay the registered sync arm (gateway / webnative / …). */
var loadSettingsHydratedFromSync = async (loadLocal) => {
	const local = await loadLocal();
	if ((local.core?.preferBackendSync ?? true) === false) return local;
	let remote = await getSettingsSync();
	if (isDesktopSettingsSurface() && !remoteSettingsLooksUseful(remote)) for (let i = 0; i < 6; i++) {
		await new Promise((r) => setTimeout(r, 250));
		remote = await getSettingsSync();
		if (remoteSettingsLooksUseful(remote)) break;
	}
	return mergeSettingsFromSync(local, remote);
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
	const root = H`<div class="view-settings" data-view="settings">
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
	const coreUseCoreIdentityAirpad = field("[data-field=\"core.useCoreIdentityForAirPad\"]");
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
		attachSettingsInlineStylesWhenConnected(root);
	};
	for (const tabEl of root.querySelectorAll("[data-settings-tabs] button[type=\"button\"][data-action=\"switch-settings-tab\"][data-tab]")) tabEl.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		switchSettingsTab(tabEl.getAttribute("data-tab") || defaultSettingsTabForProfile(settingsProfile));
	});
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
			useCoreIdentityForAirPad: (coreUseCoreIdentityAirpad?.checked ?? true) !== false,
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
		if (coreUseCoreIdentityAirpad) coreUseCoreIdentityAirpad.checked = (s?.core?.useCoreIdentityForAirPad ?? true) !== false;
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
					useCoreIdentityForAirPad: readCheckboxValue(coreUseCoreIdentityAirpad, (current.core?.useCoreIdentityForAirPad ?? true) !== false),
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
			try {
				await persistContributionsViaSync(root, saved, contributionCtx);
			} catch (e) {
				console.warn("[Settings] backend settings:patch failed:", e);
			}
			applyContributions(root, saved, contributionCtx);
			const report = getLastSettingsSaveReport();
			const permReport = await permPromise;
			const permLines = permReport.lines;
			const permDenied = permReport.results.some((r) => r.granted === false);
			import("./hub-socket-boot.js").then((n) => n.n).then(async (m) => {
				if (typeof m.nodeClipboardHubOwnsExclusiveWebsocket === "function" && m.nodeClipboardHubOwnsExclusiveWebsocket()) {
					try {
						const g = globalThis;
						const auth = g.__WEBNATIVE_AUTH__ || g.__NEUTRALINO_AUTH__;
						const port = Number(auth?.port) || 29110;
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
						await fetch(`http://127.0.0.1:${port}/service/clipboard-hub`, {
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
				import("./hub-socket-boot.js").then((n) => n._).then((ws) => {
					if (typeof ws.reconnectTransportAfterLifecycleResume === "function") ws.reconnectTransportAfterLifecycleResume("settings-save");
				}).catch(() => void 0);
			});
			applyTheme(saved);
			opts.onTheme?.(saved.appearance?.theme || "auto");
			const parts = ["Saved locally"];
			if (report.nativeSynced === true) parts.push("synced to Android");
			else if (report.nativeSynced === false && !permDenied) console.warn("[Settings] native settings patch:", report.nativeError || "not confirmed");
			else if (report.nativeSynced === false) parts.push(`native sync failed${report.nativeError ? `: ${report.nativeError}` : ""}`);
			if (report.webnativeSynced === true) parts.push("synced to Node backend");
			else if (report.webnativeSynced === false) parts.push(`Node sync failed${report.webnativeError ? `: ${report.webnativeError}` : ""}`);
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
export { SettingsView, applyContributions, clearSettingsSyncArms, collectContributions, createMemorySettingsSyncArm, createSettingsView, createView, createView as default, detectSettingsSurface, getSettingsContributions, getSettingsDefaults, getSettingsSnapshot, getSettingsSync, hydrateContributionsFromSync, mergeSettingsPatch, mountContributions, patchSettingsSync, persistContributionsViaSync, registerAirpadSettingsContribution, registerBuiltinSettingsContributions, registerCwspSettingsContribution, registerDeviceSettingsContribution, registerReaderSettingsContribution, registerSettingsContribution, registerSettingsSyncArm, registerWorkcenterSettingsContribution, resolveSettingsSurface, resolveSettingsSyncArm, setSurfaceDetector, unregisterSettingsSyncArm };
