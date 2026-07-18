const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./airpad-cwsp-client-parity-C_lNsHE9.js","./rolldown-runtime-aKtaBQYM.js","./cwsp-endpoint-resolve-DKZy0yGE.js","./clipboard-device-CKOVL4FO.js","./preload-helper-HclGiUj8.js","./cws-bridge-BHqKvU0m.js","./src-XmtCkHu1.js","./src-Iq-mxl1v.js","./src-rL6_dh7P.js","./Base64Data-BXk6_Z9x.js","./channel-unknown-ChsYImCi.js","./UniformInterop-CNADTbw3.js","./UnifiedMessaging-CNC7H-nT.js","./core-B2-fF3QG.js","./templates-CC_GZoon.js","./view-inbound-timing-Co4V0his.js","./view-ingress-validation-aq1gwpR8.js","./ShareTargetGateway-CPRU7zjR.js","./Settings-BNnQMaFO.js","./SettingsTypes-BwIxdll2.js","./CSSIconRegistry-a50ugwwC.js","./OPFSCache-CQiCbI2x.js","./src-Ctvo3cFG.js","./hub-socket-boot-DRyi5lvV.js","./config-BTA6fYk4.js","./websocket-DFhybHI0.js","./Theme-C92sm229.js","./Runtime-CLdCyDua.js","./Clipboard-a31Xceev.js"])))=>i.map(i=>d[i]);
import{D as e,_ as t,h as n,v as r}from"./src-Iq-mxl1v.js";import{c as i,l as a,s as o,u as s}from"./registry-CI1AYYC2.js";import{t as c}from"./preload-helper-HclGiUj8.js";import{t as l}from"./templates-CC_GZoon.js";import{u}from"./UnifiedMessaging-CNC7H-nT.js";import{r as ee}from"./BootLoader-BCy_hV1a.js";import{p as d}from"./cwsp-endpoint-resolve-DKZy0yGE.js";import{r as f,t as p}from"./SettingsTypes-BwIxdll2.js";import{n as te}from"./Theme-C92sm229.js";import{a as ne,i as re,n as ie,r as ae}from"./Settings-BNnQMaFO.js";import{d as oe}from"./config-BTA6fYk4.js";import{n as se}from"./capacitor-permissions-BXmJ7-0b.js";import{n as ce,r as m}from"./admin-doors-BVsFShPe.js";import{c as le,i as h,n as g,o as _,r as v,s as y}from"./CustomInstructions-9-hIz_nZ.js";import"./shells-DfZQgPgj.js";import{r as b}from"./channel-actions-Cq8UtBux.js";import{a as ue,c as de,i as fe,l as x,n as pe,o as me,r as he,s as ge,t as _e,u as ve}from"./register-builtin-contributions-COo83Wxm.js";var S=`data-settings-view-css`,ye=e=>{let t=String(e||``).trim(),n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},C=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;color:#e8edf2!important;background:#0f1318!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch}
.view-settings [data-tab-panel]:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important}
.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select{pointer-events:auto!important;color:inherit!important}
`,w=e=>{if(!e?.classList?.contains(`view-settings`)||e.querySelector(`style[${S}]`))return;let t=ye(`@layer settings-view{.view-settings{color-scheme:inherit;--sv-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));--sv-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));--sv-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));--sv-outline: var(--color-outline-variant, light-dark(#c5cdd8, #3d4755));--sv-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #171c24));--sv-surface-2: var(--color-surface-container, light-dark(#f4f6fa, #1c232d));--sv-primary: var(--color-primary, #007acc);--sv-on-primary: var(--color-on-primary, #ffffff);--sv-danger: var(--color-error, #d32f2f);--sv-divider: color-mix(in oklab, var(--sv-outline) 35%, transparent);--sv-ring: color-mix(in oklab, var(--sv-outline) 55%, transparent);--sv-elev: 0 2px 14px color-mix(in oklab, var(--sv-fg) 5%, transparent);box-sizing:border-box;display:grid;grid-template-rows:auto minmax(0,1fr) auto;grid-template-columns:minmax(0,1fr);gap:0;inline-size:100%;block-size:100%;max-block-size:100%;min-block-size:0;margin:0;padding:clamp(.5rem,2cqi,1rem);overflow:hidden;text-align:start;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background-color:var(--sv-bg);color:var(--sv-fg)}.view-settings *,.view-settings *:before,.view-settings *:after{box-sizing:border-box}.view-settings :where(select,input,textarea,option,button){pointer-events:auto;font-family:inherit}.view-settings textarea{container-type:inline-size;resize:vertical;inline-size:100%;max-inline-size:100%}.view-settings h2,.view-settings h3{margin:0;text-align:start;color:var(--sv-fg)}.view-settings h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em}.view-settings h3{font-size:.94rem;font-weight:600;letter-spacing:-.01em}.view-settings .settings-screen__top{display:flex;flex-direction:column;align-items:stretch;gap:.75rem;padding-block-end:.875rem;border-block-end:1px solid var(--sv-divider);flex-shrink:0;min-inline-size:0}.view-settings .settings-screen__title{font-weight:600;letter-spacing:-.015em;font-size:clamp(1.05rem,2.5cqi,1.35rem)}@media(min-width:720px){.view-settings .settings-screen__top{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;display:flex;flex-direction:column;gap:1rem;padding-block:.75rem;scrollbar-width:thin;scrollbar-color:var(--sv-outline) transparent}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:99px}.view-settings .settings-screen__footer{inline-size:stretch;display:flex;align-items:center;justify-content:flex-start;gap:.5rem;flex-wrap:wrap;flex-shrink:0;padding-block:.75rem;padding-inline:.25rem;border-block-start:1px solid var(--sv-divider);background:color-mix(in oklab,var(--sv-surface-1) 85%,var(--sv-bg));box-shadow:0 -10px 28px color-mix(in oklab,var(--sv-fg) 4%,transparent)}.view-settings .settings-tab-actions{display:flex;flex-wrap:nowrap;gap:.375rem;align-items:center;inline-size:stretch;max-inline-size:stretch;overflow-x:auto;scrollbar-width:thin;scrollbar-color:var(--sv-outline) transparent;container-type:inline-size;pointer-events:auto;position:relative;z-index:1}.view-settings .settings-tab-btn{pointer-events:auto;cursor:pointer;padding:.5rem .875rem;min-block-size:2.5rem;border:none;border-radius:999px;background:color-mix(in oklab,var(--sv-surface-2) 94%,transparent);color:var(--sv-muted);font-size:.75rem;font-weight:500;transition:background-color .12s ease,color .12s ease,box-shadow .12s ease;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent);white-space:nowrap}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--sv-surface-2) 100%,transparent);color:var(--sv-fg)}.view-settings .settings-tab-btn.is-active{background:var(--sv-primary);color:var(--sv-on-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 40%,transparent)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel:not([hidden]),.view-settings .settings-tab-panel.is-active:not([hidden]){display:flex;flex-direction:column;align-items:stretch;gap:.75rem;min-inline-size:0}.view-settings .settings-tab-panel[hidden]{display:none!important}.view-settings .card{display:flex;flex-direction:column;gap:.75rem;padding:1rem;inline-size:stretch;border:none;border-radius:16px;background:color-mix(in oklab,var(--sv-surface-2) 92%,var(--sv-bg));box-shadow:var(--sv-elev),0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent)}@container (max-inline-size: 480px){.view-settings .card{padding:.875rem;border-radius:14px}}.view-settings .settings-panel-form{display:flex;flex-direction:column;gap:.75rem;inline-size:stretch}.view-settings .field{display:grid;grid-auto-flow:row;gap:.375rem;inline-size:stretch;font-size:.75rem;margin:0}.view-settings .field>span{font-size:.75rem;font-weight:500;color:var(--sv-muted)}.view-settings .field.checkbox{grid-auto-flow:column;grid-auto-columns:max-content 1fr;align-items:center;gap:.625rem}.view-settings .field-hint{margin:0 0 .75rem;font-size:.85em;line-height:1.45;color:var(--sv-muted);opacity:.95}.view-settings .form-input,.view-settings .form-select{display:block;inline-size:100%;min-block-size:2.5rem;padding:.5rem .65rem;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);font-size:.875rem;line-height:1.25;outline:none;transition:border-color .12s ease,box-shadow .12s ease}.view-settings .form-input:focus-visible,.view-settings .form-select:focus-visible{border-color:color-mix(in oklab,var(--sv-primary) 55%,var(--sv-outline));box-shadow:0 0 0 3px color-mix(in oklab,var(--sv-primary) 22%,transparent)}.view-settings select.form-select,.view-settings select.form-input{appearance:none;padding-inline-end:2rem;background-image:linear-gradient(45deg,transparent 50%,var(--sv-muted) 50%),linear-gradient(135deg,var(--sv-muted) 50%,transparent 50%);background-position:calc(100% - 14px) calc(50% - 2px),calc(100% - 9px) calc(50% - 2px);background-size:5px 5px;background-repeat:no-repeat}.view-settings .btn{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.5rem 1.125rem;min-block-size:2.5rem;border:none;border-radius:999px;background:color-mix(in oklab,var(--sv-surface-2) 90%,transparent);color:var(--sv-fg);font-size:.8125rem;font-weight:500;cursor:pointer;transition:background-color .12s ease,box-shadow .12s ease,filter .12s ease;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent)}.view-settings .btn:hover{background:color-mix(in oklab,var(--sv-fg) 6%,var(--sv-surface-2))}.view-settings .btn.primary{background:var(--sv-primary);color:var(--sv-on-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 26%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 45%,transparent)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .btn.btn-sm,.view-settings .btn.small{padding:.35rem .65rem;min-block-size:2rem;font-size:.75rem}.view-settings .btn.btn-danger{color:var(--sv-on-primary);background:color-mix(in oklab,var(--sv-danger) 92%,#000);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-danger) 35%,transparent)}.view-settings .btn.btn-danger:hover{filter:brightness(1.08)}.view-settings .btn.tiny{min-block-size:2rem;padding:.3rem .5rem;font-size:.72rem}.view-settings .note,.view-settings .ext-note{font-size:.75rem;color:var(--sv-muted);opacity:.92;flex:1 1 auto;max-inline-size:100%;display:block;overflow:hidden;text-overflow:ellipsis;white-space:normal;line-height:1.35;pointer-events:none}.view-settings .note.note--ok,.view-settings .ext-note.note--ok{color:color-mix(in oklab,var(--sv-accent, #3ecf8e) 70%,var(--sv-fg))}.view-settings .note.note--warn,.view-settings .ext-note.note--warn{color:color-mix(in oklab,#e6a700 75%,var(--sv-fg))}.view-settings .note.note--err,.view-settings .ext-note.note--err{color:color-mix(in oklab,#e05252 80%,var(--sv-fg))}.view-settings .ext-note{line-height:1.4}.view-settings .ext-note code{padding:2px 6px;border-radius:4px;font-size:.68rem;background:color-mix(in oklab,var(--sv-surface-2) 80%,var(--sv-bg));color:var(--sv-fg)}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{inline-size:1.15rem;block-size:1.15rem;accent-color:var(--sv-primary);flex-shrink:0}.view-settings .mcp-section{display:flex;flex-direction:column;gap:.5rem}.view-settings .mcp-actions{margin-block-start:.5rem;display:flex;flex-wrap:wrap;gap:.5rem}.view-settings .mcp-row{display:grid;gap:.5rem;padding:.75rem;border-radius:12px;background:color-mix(in oklab,var(--sv-surface-2) 88%,var(--sv-bg));box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent)}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{margin:0;color:var(--sv-muted);font-size:.75rem}.view-settings .settings-spoiler{border-radius:12px;border:1px solid color-mix(in oklab,var(--sv-outline) 22%,transparent);background:color-mix(in oklab,var(--sv-surface-1) 55%,transparent);padding:.25rem .5rem}.view-settings .settings-spoiler summary{cursor:pointer;font-size:.8rem;font-weight:600;padding:.35rem .25rem;color:var(--sv-fg)}.view-settings .settings-spoiler .settings-panel-form{padding-block-end:.25rem}.view-settings .view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings .view-settings__section{display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem;border-block-end:1px solid var(--sv-divider)}.view-settings .view-settings__section:last-of-type{border-block-end:none}.view-settings .view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings .view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings .view-settings__label>span{font-size:.8125rem;font-weight:500}.view-settings .view-settings__select,.view-settings .view-settings__input{min-block-size:2.5rem;padding:.45rem .6rem;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);font-size:.875rem}.view-settings .view-settings__checkbox{display:flex;align-items:center;gap:.5rem;font-size:.8125rem}.view-settings .view-settings__actions{display:flex;gap:.75rem;margin-block-start:1.5rem}.view-settings .view-settings__btn{padding:.55rem 1.1rem;border-radius:8px;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);background:transparent;color:var(--sv-fg);cursor:pointer}.view-settings .view-settings__btn--primary{background:var(--sv-primary);border-color:color-mix(in oklab,var(--sv-primary) 30%,#000);color:var(--sv-on-primary)}.view-settings .view-settings__btn--primary:hover{filter:brightness(1.06)}.view-settings .custom-instructions-panel,.view-settings .custom-instructions-editor{display:flex;flex-direction:column;gap:.75rem}.view-settings .cip-select-row,.view-settings .ci-row{display:flex;flex-direction:column;gap:.35rem}.view-settings .ci-header{margin-block-end:.25rem}.view-settings .ci-header h4{margin:0 0 .25rem;font-size:.88rem}.view-settings .ci-desc{margin:0;font-size:.78rem;color:var(--sv-muted);line-height:1.45}.view-settings .ci-active-select{display:flex;flex-direction:column;gap:.25rem}.view-settings .ci-select,.view-settings .cip-select{min-block-size:2.35rem;padding:.4rem .55rem;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);font-size:.8rem}.view-settings .cip-list,.view-settings .ci-list{display:flex;flex-direction:column;gap:.5rem}.view-settings .cip-item,.view-settings .ci-item{padding:.65rem .75rem;border-radius:12px;background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 16%,transparent)}.view-settings .cip-item.is-active,.view-settings .cip-item.active,.view-settings .ci-item.is-active,.view-settings .ci-item.active{border-color:color-mix(in oklab,var(--sv-primary) 35%,transparent);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-primary) 18%,transparent)}.view-settings .cip-item-header,.view-settings .ci-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem}.view-settings .cip-item-label,.view-settings .ci-item-label{font-weight:600;font-size:.8rem}.view-settings .cip-item-actions,.view-settings .ci-item-actions{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:flex-end}.view-settings .cip-badge,.view-settings .ci-badge{font-size:.65rem;padding:.15rem .4rem;border-radius:999px;background:color-mix(in oklab,var(--sv-primary) 16%,transparent);color:var(--sv-fg)}.view-settings .cip-item-preview,.view-settings .ci-item-preview{font-size:.75rem;color:var(--sv-muted);margin-block-start:.35rem;line-height:1.45}.view-settings .cip-edit-form,.view-settings .ci-edit-form{display:flex;flex-direction:column;gap:.5rem;margin-block-start:.5rem}.view-settings .cip-form-actions,.view-settings .cip-toolbar,.view-settings .ci-actions,.view-settings .ci-add-actions,.view-settings .ci-edit-actions{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.view-settings .cip-input,.view-settings .cip-textarea,.view-settings .ci-input,.view-settings .ci-textarea,.view-settings .field-control{inline-size:100%;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);padding:.45rem .55rem;font-size:.8125rem}.view-settings .cip-textarea,.view-settings .ci-textarea{min-block-size:5rem}.view-settings .cip-empty,.view-settings .ci-empty{font-size:.8rem;color:var(--sv-muted);padding:.75rem;text-align:center}.view-settings .field-label{font-size:.72rem;font-weight:600;color:var(--sv-muted);text-transform:uppercase;letter-spacing:.04em}@container (max-inline-size: 1024px){.view-settings{padding:.65rem}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.3rem}.view-settings .settings-tab-btn{min-block-size:2.65rem;padding-inline:.7rem}}@container (max-inline-size: 480px){.view-settings{padding:.45rem}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{padding-block:.5rem;gap:.75rem}.view-settings .settings-screen__footer{flex-direction:column-reverse;align-items:stretch;gap:.5rem}.view-settings .settings-screen__footer .btn.primary{inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{white-space:normal;text-align:center}}}`);t=t.trim()?`${C}\n${t}`:C;let n=document.createElement(`style`);n.setAttribute(S,``),n.textContent=t,e.insertBefore(n,e.firstChild)},T=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}w(e)};e.isConnected?w(e):requestAnimationFrame(t)},be={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`};function xe(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var E=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}};new E(`rs-workcenter`,`data`),new E(`rs-history`,`entries`),new E(`rs-settings`,`config`),[...i],s(`home`,o);function Se(e){let t=`/`;if(e.params&&Object.keys(e.params).length>0){let n=new URLSearchParams(e.params).toString();t+=`?`+n}return t}function Ce(e,t={}){let n=Se(e);t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function we(e,t){Ce({view:e,params:t})}var D=[`en`,`ru`,`en-GB`,`en-US`],Te=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,O=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},Ee=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=O(n);t&&e.add(t)}for(let t of D)e.add(t);return Array.from(e)},De=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},k=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},Oe=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},A=(e,t=``)=>{if(!e)return t;let n=e.value.trim();return!n&&e instanceof HTMLInputElement&&e.type===`password`?t:n||t},j=(e,t)=>e?!!e.checked:t,ke=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null},Ae=e=>{let t={id:(e?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(e?.serverLabel||``).trim(),origin:(e?.origin||``).trim(),clientKey:(e?.clientKey||``).trim(),secretKey:(e?.secretKey||``).trim()};return n`<div class="field mcp-row" data-mcp-id=${t.id}>
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
          </div>`},je=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},Me=(e,t)=>{if(!e)return;e.replaceChildren();let r=Array.isArray(t)?t:[];if(!r.length){e.appendChild(n`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}r.forEach(t=>e.appendChild(Ae(t)))},Ne=()=>n`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`,Pe=()=>n`<header class="settings-screen__top">
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
    </header>`,Fe=()=>n`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
    </section>`,Ie=()=>n`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`,Le=()=>n`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`,Re=()=>n`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`,ze=()=>n`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`,M=(e={})=>{let r=t({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),i=n`<div class="custom-instructions-editor">
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
    </div>`,a=i.querySelector(`[data-list]`),o=i.querySelector(`[data-action='select-active']`),s=i.querySelector(`[data-add-form]`),c=i.querySelector(`[data-field='label']`),u=i.querySelector(`[data-field='instruction']`),ee=()=>{a.replaceChildren();let t=r.instructions??[];if(!t.length){a.append(n`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of t){let t=r.editingId===i.id,o=r.activeId===i.id,s=n`<div class="ci-item ${o?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${o?n`<span class="ci-badge active">Active</span>`:n`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${t?n`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:n`<div class="ci-item-preview">${f(i.instruction,120)}</div>`}
            </div>`;s.addEventListener(`click`,t=>{let n=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(n===`activate`&&y(i.id).then(p).then(()=>e.onUpdate?.()),n===`edit`&&(r.editingId=i.id,ee()),n===`delete`&&confirm(`Delete "${i.label}"?`)&&h(i.id).then(p).then(()=>e.onUpdate?.()),n===`save-edit`){let t=s.querySelector(`[data-edit-field='label']`),n=s.querySelector(`[data-edit-field='instruction']`);le(i.id,{label:t.value.trim()||i.label,instruction:n.value.trim()}).then(()=>(r.editingId=null,p())).then(()=>e.onUpdate?.())}n===`cancel-edit`&&(r.editingId=null,ee())}),a.append(s)}},d=()=>{o.replaceChildren(),o.append(n`<option value="">None (use default)</option>`);for(let e of r.instructions??[]){let t=n`<option value="${e.id}">${e.label}</option>`;e.id===r.activeId&&(t.selected=!0),o.append(t)}},f=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,p=async()=>{let e=await _(),t=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;r.instructions=t?.instructions??[],r.activeId=t?.activeId??``,ee(),d()};return i.addEventListener(`click`,t=>{let n=t.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(n===`add`&&(r.isAdding=!0,s.hidden=!1,c.value=``,u.value=``,c.focus()),n===`cancel-add`&&(r.isAdding=!1,s.hidden=!0),n===`save-new`){let t=c.value.trim(),n=u.value.trim();if(!n){u.focus();return}g(t||`Custom`,n).then(e=>{if(e)return r.isAdding=!1,s.hidden=!0,p()}).then(()=>e.onUpdate?.())}if(n===`add-templates`){let t=new Set((r.instructions??[]).map(e=>e.label.trim().toLowerCase())),n=l.filter(e=>!t.has(e.label.trim().toLowerCase()));if(!n.length){alert(`All templates are already added.`);return}v(n.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(p).then(()=>e.onUpdate?.())}}),o.addEventListener(`change`,()=>{y(o.value||null).then(p).then(()=>e.onUpdate?.())}),p(),i},Be=e=>n`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${M({onUpdate:()=>e(`Instructions updated.`)})}
      </div>
    </section>`,Ve=()=>n`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`,N={},P=He;function He(){let e=globalThis;return e.__CWS_WEBNATIVE_BOOT__?`webnative`:e.Capacitor===void 0?e.chrome!==void 0&&e.chrome?.runtime?`crx`:`web`:`capacitor`}function Ue(e){P=e}function We(e,t){N[e]=t}function Ge(e){delete N[e]}function Ke(){for(let e of Object.keys(N))delete N[e]}function F(e,t){let n={...e};for(let[e,r]of Object.entries(t)){let t=n[e];typeof r==`object`&&r&&!Array.isArray(r)&&typeof t==`object`&&t&&!Array.isArray(t)?n[e]={...t,...r}:n[e]=r}return n}function qe(e={},t={}){let n={...e};return{get:async()=>({...n}),patch:async e=>(n=F(n,e),{...n}),...t}}function I(){return P()}function L(){return N[P()]||N.web||null}async function R(){let e=L();if(!e)return{};try{return await e.get()}catch{return{}}}async function z(e){let t=L();return t?t.patch(e):{}}async function Je(){let e=L();if(!e?.defaults)return{};try{return await e.defaults()}catch{return{}}}async function Ye(){let e=L();if(!e?.snapshot)return{};try{return await e.snapshot()}catch{return{}}}var Xe=e=>e.isExtension||e.surface===`crx`?`extension`:(e.surface===`capacitor`||e.surface===`native`)&&!(a(`workcenter`)||a(`viewer`)||a(`explorer`))?`cwsp-mobile`:`full`,Ze=[`appearance`,`markdown`,`ai`,`mcp`,`server`,`instructions`,`extension`],Qe=(e,t)=>{if(t===`cwsp-mobile`)for(let t of Ze)e.querySelector(`[data-tab-panel="${t}"]`)?.remove(),e.querySelector(`[data-action="switch-settings-tab"][data-tab="${t}"]`)?.remove()},$e=e=>e===`cwsp-mobile`?`cwsp`:e===`extension`?`extension`:`ai`,et=(e,t)=>!!e.querySelector(`[data-tab-panel="${t}"]`),tt=`[data-settings-tabs]`,nt=`.settings-screen__body`,rt=()=>{try{let e=globalThis;if(e?.chrome?.runtime?.id)return`crx`;if(e?.Capacitor?.isNativePlatform?.())return`capacitor`;if(e?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`)return`web`}catch{}return`unknown`},it=(e,t)=>{if(e.requiresView&&!a(e.requiresView))return!1;let n=e.surfaces;return!(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface))},B=e=>x().filter(t=>it(t,e)),at=(e,t)=>{let n=e.querySelector(tt),r=e.querySelector(nt);if(!(!n||!r))for(let i of B(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},V=(e,t,n)=>{for(let r of B(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`);t&&n(r,t)}},ot=(e,t,n)=>{V(e,n,(e,r)=>{try{e.manualFields||ge(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},st=(e,t,n)=>{V(e,n,(e,r)=>{try{e.manualFields||de(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},H=e=>!!e&&typeof e==`object`&&!Array.isArray(e),U=(e,t)=>{if(!H(t)||!Object.keys(t).length)return e;let n=(e,t)=>{if(t==null||typeof t==`string`&&t===`[redacted]`)return e;if(Array.isArray(t))return t.slice();if(H(t)&&H(e)){let r={...e};for(let[i,a]of Object.entries(t))r[i]=n(e[i],a);return r}return H(t)?{...t}:typeof t==`string`&&!t.trim()&&typeof e==`string`&&e.trim()?e:t};return n(e,t)},ct=async e=>U(await e(),await R()),W=async(e,t,n={})=>{let r=U(n,await R());return ot(e,r,t),r},lt=async(e,t,n)=>(st(e,t,n),z(t)),ut=e=>B(e).map(e=>e.id),G=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},dt=async e=>{f(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await c(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-C_lNsHE9.js`).then(e=>e.a);return{sanitizeFleetSelfWireNodeId:e}},__vite__mapDeps([0,1,2]),import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=typeof t.endpointUrl==`string`?t.endpointUrl:``,a=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!i.trim()&&!a.trim())return;let o=G()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},s=await d({relayHttpsUrl:i,directHttpsUrl:a},o);s.relayHttpsUrl!==void 0&&(t.endpointUrl=s.relayHttpsUrl),s.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:s.directHttpsUrl})},K=e=>{let t=null,r=null,i=()=>{let e=rt();return e===`capacitor`||e===`native`?8e3:2500},a=(e,n)=>{t&&(r&&=(clearTimeout(r),null),t.textContent=e,t.classList.remove(`note--ok`,`note--warn`,`note--err`),n?.tone===`ok`&&t.classList.add(`note--ok`),n?.tone===`warn`&&t.classList.add(`note--warn`),n?.tone===`err`&&t.classList.add(`note--err`),e&&!n?.persist&&(r=setTimeout(()=>{t&&(t.textContent=``,t.classList.remove(`note--ok`,`note--warn`,`note--err`))},i())))},o=n`<div class="view-settings" data-view="settings">
    ${Pe()}
    <div class="settings-screen__body">
      ${Fe()}
      ${Ie()}
      ${Le()}
      ${Re()}
      ${ze()}
      ${Be(a)}
      ${Ve()}
    </div>
    ${Ne()}
  </div>`;T(o),_e();let s={isExtension:e.isExtension,surface:rt()},l=Xe(s);at(o,s),Qe(o,l),l===`full`&&(s.surface===`capacitor`||s.surface===`native`)&&(o.querySelector(`[data-tab-panel="server"]`)?.remove(),o.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let d=e=>et(o,e),f=e=>o.querySelector(e);t=o.querySelector(`[data-note]`);let le=f(`[data-field="ai.baseUrl"]`),h=f(`[data-field="ai.apiKey"]`),g=f(`[data-field="ui.showKey"]`),_=f(`[data-field="ai.model"]`),v=f(`[data-field="ai.customModel"]`),y=o.querySelector(`[data-field-group="ai.customModel"]`),b=f(`[data-field="ai.defaultReasoningEffort"]`),ue=f(`[data-field="ai.defaultVerbosity"]`),de=f(`[data-field="ai.maxOutputTokens"]`),fe=f(`[data-field="ai.contextTruncation"]`),x=f(`[data-field="ai.promptCacheRetention"]`),pe=f(`[data-field="ai.maxToolCalls"]`),me=f(`[data-field="ai.parallelToolCalls"]`),he=f(`[data-field="ai.requestTimeout.low"]`),ge=f(`[data-field="ai.requestTimeout.medium"]`),ve=f(`[data-field="ai.requestTimeout.high"]`),S=f(`[data-field="ai.maxRetries"]`),ye=f(`[data-field="ai.shareTargetMode"]`),C=()=>{let e=(_?.value||``).trim()===`custom`;y&&(y.hidden=!e),v&&(v.disabled=!e)};if(_){_.replaceChildren();for(let e of p){let t=document.createElement(`option`);t.value=e,t.textContent=e,_.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,_.append(e),_.addEventListener(`change`,C)}v?.addEventListener(`focus`,()=>{_&&(_.value=`custom`,C())});let w=f(`[data-field="ai.autoProcessShared"]`),E=f(`[data-field="ai.responseLanguage"]`),Se=f(`[data-field="ai.translateResults"]`),Ce=f(`[data-field="ai.generateSvgGraphics"]`),D=f(`[data-field="speech.language"]`),O=f(`[data-field="appearance.theme"]`),M=f(`[data-field="appearance.fontSize"]`),N=f(`[data-field="appearance.markdown.preset"]`),P=f(`[data-field="appearance.markdown.fontFamily"]`),He=f(`[data-field="appearance.markdown.fontSizePx"]`),Ue=f(`[data-field="appearance.markdown.lineHeight"]`),We=f(`[data-field="appearance.markdown.contentMaxWidthPx"]`),Ge=f(`[data-field="appearance.markdown.printScale"]`),Ke=f(`[data-field="appearance.markdown.page.size"]`),F=f(`[data-field="appearance.markdown.page.orientation"]`),qe=f(`[data-field="appearance.markdown.page.marginMm"]`),I=f(`[data-field="appearance.markdown.modules.typography"]`),L=f(`[data-field="appearance.markdown.modules.lists"]`),R=f(`[data-field="appearance.markdown.modules.tables"]`),z=f(`[data-field="appearance.markdown.modules.codeBlocks"]`),Je=f(`[data-field="appearance.markdown.modules.blockquotes"]`),Ye=f(`[data-field="appearance.markdown.modules.media"]`),Ze=f(`[data-field="appearance.markdown.modules.printBreaks"]`),tt=f(`[data-field="appearance.markdown.plugins.smartTypography"]`),nt=f(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),it=f(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),B=o.querySelector(`[data-field="appearance.markdown.customCss"]`),V=o.querySelector(`[data-field="appearance.markdown.printCss"]`),H=o.querySelector(`[data-field="appearance.markdown.extensions"]`),U=f(`[data-field="core.ntpEnabled"]`),W=f(`[data-field="core.mode"]`),G=f(`[data-field="core.endpointUrl"]`),K=f(`[data-field="core.userId"]`),q=f(`[data-field="core.userKey"]`),J=f(`[data-field="core.ecosystemToken"]`),Y=f(`[data-field="core.preferBackendSync"]`),ft=f(`[data-field="core.encrypt"]`),pt=f(`[data-field="core.appClientId"]`),mt=f(`[data-field="core.allowInsecureTls"]`),ht=f(`[data-field="core.ops.allowUnencrypted"]`),gt=f(`[data-field="core.admin.httpsOrigin"]`),_t=f(`[data-field="core.admin.httpOrigin"]`),vt=f(`[data-field="core.admin.path"]`),yt=f(`[data-field="core.useCoreIdentityForAirPad"]`),X=f(`[data-field="core.socket.accessToken"]`),bt=f(`[data-field="core.socket.routeTarget"]`),xt=f(`[data-field="core.socket.clientAccessToken"]`),St=f(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),Ct=f(`[data-field="shell.maintainHubSocketConnection"]`),wt=f(`[data-field="shell.clipboardBroadcastTargets"]`),Tt=f(`[data-field="shell.pushLocalClipboardToLan"]`),Et=f(`[data-field="shell.clipboardPushIntervalMs"]`),Dt=f(`[data-field="shell.enableRemoteClipboardBridge"]`),Ot=f(`[data-field="shell.acceptInboundClipboardData"]`),kt=f(`[data-field="shell.clipboardInboundAllowIds"]`),At=f(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),jt=f(`[data-field="shell.clipboardShareDestinationIds"]`),Mt=f(`[data-field="shell.applyRemoteClipboardToDevice"]`),Nt=f(`[data-field="shell.acceptContactsBridgeData"]`),Pt=f(`[data-field="shell.acceptSmsBridgeData"]`),Ft=f(`[data-field="shell.enableNativeSms"]`),It=f(`[data-field="shell.enableNativeContacts"]`),Lt=o.querySelector(`[data-admin-preview]`),Z=o.querySelector(`[data-mcp-section]`),Rt=o.querySelector(`[data-section="extension"]`),zt=o.querySelector(`[data-extension-tab]`);if(E){E.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,E.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,E.append(t);for(let e of De()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,E.append(t)}}if(D){D.replaceChildren();for(let e of Ee()){let t=document.createElement(`option`);t.value=e,t.textContent=Te(e),D.append(t)}}o.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Vt()}),o.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Vt()});let Q=e=>{let t=$e(l),n=e||t;o.querySelector(`[data-tab-panel="${n}"]`)||(n=o.querySelector(`[data-tab-panel]`)?.getAttribute(`data-tab-panel`)||t),o.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let r=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(r)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let i=o.querySelectorAll(`[data-tab-panel]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}T(o)};for(let e of o.querySelectorAll(`[data-settings-tabs] button[type="button"][data-action="switch-settings-tab"][data-tab]`))e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),Q(e.getAttribute(`data-tab`)||$e(l))});let Bt=e=>{let t=$e(l),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?d(`markdown`)?`markdown`:t:new Set([...d(`appearance`)?[`appearance`]:[],...d(`markdown`)?[`markdown`]:[],...d(`ai`)?[`ai`]:[],...d(`mcp`)?[`mcp`]:[],...d(`server`)?[`server`]:[],...d(`instructions`)?[`instructions`]:[],...d(`extension`)?[`extension`]:[],...ut(s)]).has(n)?n:t:t},$=()=>{let e=J?.value?.trim()||q?.value?.trim()||X?.value?.trim()||``;return{mode:W?.value||`native`,endpointUrl:G?.value?.trim()||``,userId:K?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!ft?.checked,preferBackendSync:(Y?.checked??!0)!==!1,appClientId:pt?.value?.trim()||``,allowInsecureTls:!!mt?.checked,useCoreIdentityForAirPad:(yt?.checked??!0)!==!1,socket:{accessToken:e,routeTarget:bt?.value?.trim()||``,selfId:``,clientAccessToken:xt?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!St?.checked},admin:{httpsOrigin:gt?.value?.trim()||``,httpOrigin:_t?.value?.trim()||``,path:vt?.value?.trim()||`/`},ops:{allowUnencrypted:!!ht?.checked}}},Vt=()=>{if(!Lt)return;let e=m($());Lt.textContent=`Resolved: ${e.https} · ${e.http}`},Ht=e=>{try{xe(be.EXPLORER_PATH,e),we(`explorer`),u({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),a(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),a(`Failed to open Explorer path.`)}};if(Promise.resolve((async()=>((s.surface===`capacitor`||s.surface===`native`)&&await ie().catch(()=>null),ct(()=>re())))()).then(t=>{le&&(le.value=(t?.ai?.baseUrl||``).trim()),h&&(h.value=(t?.ai?.apiKey||``).trim());let n=(t?.ai?.model||`gpt-5.4`).trim(),r=(t?.ai?.customModel||``).trim();if(_){let e=p.includes(n);n===`custom`||!e&&n?(_.value=`custom`,v&&(v.value=r||n)):(_.value=e?n:`gpt-5.4`,v&&(v.value=r)),C()}if(b&&(b.value=t?.ai?.defaultReasoningEffort||`medium`),ue&&(ue.value=t?.ai?.defaultVerbosity||`medium`),de&&(de.value=String(t?.ai?.maxOutputTokens??4e5)),fe&&(fe.value=t?.ai?.contextTruncation||`disabled`),x&&(x.value=t?.ai?.promptCacheRetention||`in-memory`),pe&&(pe.value=String(t?.ai?.maxToolCalls??8)),me&&(me.checked=(t?.ai?.parallelToolCalls??!0)!==!1),he&&(he.value=String(t?.ai?.requestTimeout?.low??6e4)),ge&&(ge.value=String(t?.ai?.requestTimeout?.medium??3e5)),ve&&(ve.value=String(t?.ai?.requestTimeout?.high??9e5)),S&&(S.value=String(t?.ai?.maxRetries??2)),ye&&(ye.value=t?.ai?.shareTargetMode||`recognize`),w&&(w.checked=(t?.ai?.autoProcessShared??!0)!==!1),E&&(E.value=t?.ai?.responseLanguage||`auto`),Se&&(Se.checked=!!t?.ai?.translateResults),Ce&&(Ce.checked=!!t?.ai?.generateSvgGraphics),D&&(D.value=t?.speech?.language||`en-US`),O&&(O.value=t?.appearance?.theme||`auto`),M&&(M.value=t?.appearance?.fontSize||`medium`),N&&(N.value=t?.appearance?.markdown?.preset||`default`),P&&(P.value=t?.appearance?.markdown?.fontFamily||`system`),He&&(He.value=String(t?.appearance?.markdown?.fontSizePx??16)),Ue&&(Ue.value=String(t?.appearance?.markdown?.lineHeight??1.7)),We&&(We.value=String(t?.appearance?.markdown?.contentMaxWidthPx??860)),Ge&&(Ge.value=String(t?.appearance?.markdown?.printScale??1)),Ke&&(Ke.value=t?.appearance?.markdown?.page?.size||`auto`),F&&(F.value=t?.appearance?.markdown?.page?.orientation||`portrait`),qe&&(qe.value=String(t?.appearance?.markdown?.page?.marginMm??12)),I&&(I.checked=(t?.appearance?.markdown?.modules?.typography??!0)!==!1),L&&(L.checked=(t?.appearance?.markdown?.modules?.lists??!0)!==!1),R&&(R.checked=(t?.appearance?.markdown?.modules?.tables??!0)!==!1),z&&(z.checked=(t?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),Je&&(Je.checked=(t?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),Ye&&(Ye.checked=(t?.appearance?.markdown?.modules?.media??!0)!==!1),Ze&&(Ze.checked=(t?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),tt&&(tt.checked=!!t?.appearance?.markdown?.plugins?.smartTypography),nt&&(nt.checked=!!t?.appearance?.markdown?.plugins?.softBreaksAsBr),it&&(it.checked=(t?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),B&&(B.value=(t?.appearance?.markdown?.customCss||``).trim()),V&&(V.value=(t?.appearance?.markdown?.printCss||``).trim()),H){let e=Array.isArray(t?.appearance?.markdown?.extensions)?t.appearance?.markdown?.extensions:[];H.value=e.length>0?JSON.stringify(e,null,2):``}U&&(U.checked=!!t?.core?.ntpEnabled),W&&(W.value=t?.core?.mode||`native`),G&&(G.value=(t?.core?.endpointUrl||``).trim()),K&&(K.value=(t?.core?.userId||``).trim());{let e=String(t?.core?.ecosystemToken||``).trim()||String(t?.core?.userKey||``).trim()||String(t?.core?.socket?.accessToken||t?.core?.socket?.airpadAuthToken||``).trim();J&&(J.value=e),q&&(q.value=e),X&&(X.value=e)}if(Y&&(Y.checked=(t?.core?.preferBackendSync??!0)!==!1),ft&&(ft.checked=!!t?.core?.encrypt),pt&&(pt.value=(t?.core?.appClientId||``).trim()),yt&&(yt.checked=(t?.core?.useCoreIdentityForAirPad??!0)!==!1),bt&&(bt.value=(t?.core?.socket?.routeTarget||t?.core?.socket?.selfId||``).trim()),xt&&(xt.value=(t?.core?.socket?.clientAccessToken||``).trim()),St&&(St.checked=(t?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),mt&&(mt.checked=!!t?.core?.allowInsecureTls),ht&&(ht.checked=!!t?.core?.ops?.allowUnencrypted),gt&&(gt.value=(t?.core?.admin?.httpsOrigin||``).trim()),_t&&(_t.value=(t?.core?.admin?.httpOrigin||``).trim()),vt&&(vt.value=(t?.core?.admin?.path||`/`).trim()||`/`),Ct&&(Ct.checked=!!t?.shell?.maintainHubSocketConnection),wt&&(wt.value=(t?.shell?.clipboardBroadcastTargets||``).trim()),Tt&&(Tt.checked=!!t?.shell?.pushLocalClipboardToLan),Et){let e=Number(t?.shell?.clipboardPushIntervalMs);Et.value=String(Number.isFinite(e)&&e>=800?Math.min(Math.round(e),6e4):2e3)}Dt&&(Dt.checked=(t?.shell?.enableRemoteClipboardBridge??!0)!==!1),Ot&&(Ot.checked=(t?.shell?.acceptInboundClipboardData??!0)!==!1),kt&&(kt.value=(t?.shell?.clipboardInboundAllowIds||``).trim()),At&&(At.checked=(t?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),jt&&(jt.value=(t?.shell?.clipboardShareDestinationIds||``).trim()),Mt&&(Mt.checked=(t?.shell?.applyRemoteClipboardToDevice??!0)!==!1),Nt&&(Nt.checked=(t?.shell?.acceptContactsBridgeData??!1)===!0),Pt&&(Pt.checked=!se()&&(t?.shell?.acceptSmsBridgeData??!1)===!0),Ft&&(Ft.checked=!se()&&(t?.shell?.enableNativeSms??!1)===!0),It&&(It.checked=(t?.shell?.enableNativeContacts??!0)!==!1),Vt(),Me(Z,Array.isArray(t?.ai?.mcp)?t.ai.mcp:[]),oe(t),te(t),ot(o,t,s),e.onTheme?.(t?.appearance?.theme||`auto`)}).catch(()=>{Me(Z,[])}),g?.addEventListener(`change`,()=>{!h||!g||(h.type=g.checked?`text`:`password`)}),O?.addEventListener(`change`,()=>{let t=O.value||`auto`;(async()=>{try{let e=await re();te({...e,appearance:{...e.appearance||{},theme:t}})}catch{te({appearance:{theme:t,fontSize:`medium`}})}e.onTheme?.(t)})()}),o.addEventListener(`click`,t=>{let n=ke(t);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&Z){Z.querySelector(`.mcp-empty-note`)?.remove(),Z.appendChild(Ae({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),Z&&!Z.querySelector(`[data-mcp-id]`)&&Me(Z,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){Ht(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){Ht(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){ce($(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){ce($(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=m($());navigator.clipboard?.writeText?.(e.https).then(()=>a(`HTTPS admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=m($());navigator.clipboard?.writeText?.(e.http).then(()=>a(`HTTP admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){c(()=>import(`./clipboard-device-CKOVL4FO.js`).then(e=>e.t).then(e=>e.openAppClipboardRelatedSettings()),__vite__mapDeps([3,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,2,0,19,20,21,22]),import.meta.url).then(()=>a(`App settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){c(()=>import(`./clipboard-device-CKOVL4FO.js`).then(e=>e.t).then(e=>e.openNativeNotificationSettings?.()),__vite__mapDeps([3,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,2,0,19,20,21,22]),import.meta.url).then(()=>a(`Notification settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{a(`Saving…`,{tone:`warn`});let t=await re(),n=t.appearance?.markdown?.extensions||[],r=d(`markdown`)&&H?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){Q(`markdown`),a(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...t,ai:d(`ai`)?{baseUrl:le?.value?.trim?.()||``,apiKey:h?.value?.trim?.()||``,model:_?.value||`gpt-5.4`,customModel:_?.value===`custom`&&v?.value?.trim?.()||``,defaultReasoningEffort:b?.value||`medium`,defaultVerbosity:ue?.value||`medium`,maxOutputTokens:k(de?.value,4e5),contextTruncation:fe?.value||`disabled`,promptCacheRetention:x?.value||`in-memory`,maxToolCalls:k(pe?.value,8),parallelToolCalls:(me?.checked??!0)!==!1,requestTimeout:{low:k(he?.value,6e4),medium:k(ge?.value,3e5),high:k(ve?.value,9e5)},maxRetries:k(S?.value,2),shareTargetMode:ye?.value||`recognize`,autoProcessShared:(w?.checked??!0)!==!1,responseLanguage:E?.value||`auto`,translateResults:!!Se?.checked,generateSvgGraphics:!!Ce?.checked,mcp:d(`mcp`)?je(Z):t.ai?.mcp||[],customInstructions:t.ai?.customInstructions||[],activeInstructionId:t.ai?.activeInstructionId||``}:t.ai||{},speech:d(`ai`)?{language:D?.value||`en-US`}:t.speech||{},core:d(`server`)?{...t.core,ntpEnabled:j(U,!!t.core?.ntpEnabled),mode:A(W,t.core?.mode||`native`)||`native`,endpointUrl:A(G,t.core?.endpointUrl||``),userId:A(K,t.core?.userId||``),ecosystemToken:A(J,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||A(q,t.core?.userKey||``)||A(X,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),userKey:A(J,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||A(q,t.core?.userKey||``)||A(X,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``),encrypt:j(ft,!!t.core?.encrypt),preferBackendSync:j(Y,(t.core?.preferBackendSync??!0)!==!1),appClientId:A(pt,t.core?.appClientId||``),allowInsecureTls:j(mt,!!t.core?.allowInsecureTls),useCoreIdentityForAirPad:j(yt,(t.core?.useCoreIdentityForAirPad??!0)!==!1),socket:(()=>{let e={...t.core?.socket||{}};delete e.airpadAuthToken;let n=A(J,t.core?.ecosystemToken||t.core?.userKey||t.core?.socket?.accessToken||``)||A(q,t.core?.userKey||``)||A(X,t.core?.socket?.accessToken||t.core?.socket?.airpadAuthToken||``);return{...e,accessToken:n,routeTarget:A(bt,t.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:A(xt,t.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:j(St,!!t.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...t.core?.admin||{},httpsOrigin:A(gt,t.core?.admin?.httpsOrigin||``),httpOrigin:A(_t,t.core?.admin?.httpOrigin||``),path:A(vt,t.core?.admin?.path||`/`)||`/`},ops:{...t.core?.ops||{},allowUnencrypted:j(ht,!!t.core?.ops?.allowUnencrypted)}}:{...t.core||{}},shell:d(`server`)?{...t.shell||{},maintainHubSocketConnection:j(Ct,!!t.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:A(wt,t.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:j(Tt,!!t.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let e=Et?.value,n=k(e,t.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:j(Dt,(t.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:j(Ot,(t.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:A(kt,t.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:j(At,!!t.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:A(jt,t.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:j(Mt,(t.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:j(Nt,!!t.shell?.acceptContactsBridgeData),acceptSmsBridgeData:!se()&&j(Pt,!!t.shell?.acceptSmsBridgeData),enableNativeSms:!se()&&j(Ft,(t.shell?.enableNativeSms??!1)===!0),enableNativeContacts:j(It,(t.shell?.enableNativeContacts??!0)!==!1)}:{...t.shell||{}},appearance:d(`appearance`)||d(`markdown`)?{theme:O?.value||`auto`,fontSize:M?.value||`medium`,markdown:{preset:N?.value||`default`,fontFamily:P?.value||`system`,fontSizePx:k(He?.value,16),lineHeight:Oe(Ue?.value,1.7,1.1,2.2),contentMaxWidthPx:k(We?.value,860),printScale:Oe(Ge?.value,1,.5,1.5),page:{size:Ke?.value||`auto`,orientation:F?.value||`portrait`,marginMm:k(qe?.value,12)},modules:{typography:(I?.checked??!0)!==!1,lists:(L?.checked??!0)!==!1,tables:(R?.checked??!0)!==!1,codeBlocks:(z?.checked??!0)!==!1,blockquotes:(Je?.checked??!0)!==!1,media:(Ye?.checked??!0)!==!1,printBreaks:(Ze?.checked??!0)!==!1},plugins:{smartTypography:!!tt?.checked,softBreaksAsBr:!!nt?.checked,externalLinksNewTab:(it?.checked??!0)!==!1},customCss:B?.value||``,printCss:V?.value||``,extensions:n||[]}}:t.appearance||{}};st(o,i,s),await dt(i);let l=i,u=s.surface===`capacitor`||s.surface===`native`?ee(l).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),f=await ne(l);if(!f){a(`Settings save returned no data.`,{tone:`err`});return}try{await lt(o,f,s)}catch(e){console.warn(`[Settings] backend settings:patch failed:`,e)}ot(o,f,s);let p=ae(),ie=await u,oe=ie.lines,ce=ie.results.some(e=>e.granted===!1);c(()=>import(`./hub-socket-boot-DRyi5lvV.js`).then(e=>e.n).then(async e=>{if(typeof e.nodeClipboardHubOwnsExclusiveWebsocket==`function`&&e.nodeClipboardHubOwnsExclusiveWebsocket()){try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__,n=Number(t?.port)||29110,r=String(t?.key||`cwsp-neutralino-local`),i=f.core,a=String(i?.ecosystemToken||i?.userKey||i?.socket?.accessToken||``).trim(),o={};i?.endpointUrl&&(o.remoteHost=String(i.endpointUrl).trim()),a&&(o.accessToken=a,o.clientToken=a),i?.userId&&(o.clientId=String(i.userId).trim()),o.force=!0,await fetch(`http://127.0.0.1:${n}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":r},body:JSON.stringify(o),cache:`no-store`})}catch(e){console.warn(`[Settings] Node clipboard-hub reload skipped`,e)}return}if(typeof e.nativeShellOwnsExclusiveHubWebsocket==`function`&&e.nativeShellOwnsExclusiveHubWebsocket()){try{let{invokeCwsNative:e}=await c(async()=>{let{invokeCwsNative:e}=await import(`./cws-bridge-BHqKvU0m.js`).then(e=>e.n);return{invokeCwsNative:e}},__vite__mapDeps([5,1,6,7,8,4,9,10,11,12,13,14,15,16,17,18,2,0,19,20,21,22]),import.meta.url);await e(`runtime:reload-settings`,{})}catch(e){console.warn(`[Settings] Java /ws reload skipped`,e)}return}await e.applyHubSocketFromSettings(f),c(()=>import(`./websocket-DFhybHI0.js`).then(e=>e.h).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),__vite__mapDeps([25,1,6,7,8,4,9,10,11,12,13,14,15,16,17,18,2,0,19,20,21,22,5,24,23,3]),import.meta.url).catch(()=>void 0)}),__vite__mapDeps([23,1,4,18,7,6,8,9,10,11,12,13,14,15,16,17,20,21,22,2,0,19,24]),import.meta.url),te(f),e.onTheme?.(f.appearance?.theme||`auto`);let m=[`Saved locally`];p.nativeSynced===!0?m.push(`synced to Android`):p.nativeSynced===!1&&!ce?console.warn(`[Settings] native settings patch:`,p.nativeError||`not confirmed`):p.nativeSynced===!1&&m.push(`native sync failed${p.nativeError?`: ${p.nativeError}`:``}`),p.webnativeSynced===!0?m.push(`synced to Node backend`):p.webnativeSynced===!1&&m.push(`Node sync failed${p.webnativeError?`: ${p.webnativeError}`:``}`),oe.length&&m.push(...oe);let g=`ok`;(ce||p.webnativeSynced===!1)&&(g=`warn`),a(m.join(` · `),{tone:g})})().catch(e=>a(String(e),{tone:`err`}))}),e.isExtension){Rt&&(Rt.hidden=!1),zt&&(zt.hidden=!1);let e=n`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;o.append(e)}let Ut=Bt(e.initialTab);if(Q(Ut),!o.querySelector(`[data-tab-panel="${Ut}"]:not([hidden])`)){let e=o.querySelector(`[data-tab-panel]`);e&&Q(e.getAttribute(`data-tab-panel`)||Ut)}C();let Wt=o.querySelectorAll(`[data-tab-panel]`).length,Gt=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${l} surface=${s.surface} tabs=${Gt} panels=${Wt} active=${o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(Wt===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,o.querySelector(`.settings-screen__body`)?.appendChild(e),Q(`cwsp`)}return o.addEventListener(`cwsp-settings-resync`,()=>{T(o),Q(o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Ut)}),o},q={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},J=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=r(q);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings();let t=globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id;return this.element=K({isExtension:t,initialTab:e?.params?.tab||e?.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>T(this.element)),this.element}getToolbar(){return null}setupEventHandlers(){}loadSettings(){this.settings.value={...q}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...q},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){T(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(e(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===b.Patch||e===b.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([c(()=>import(`./Settings-BNnQMaFO.js`).then(e=>e.t),__vite__mapDeps([18,1,7,6,8,4,9,10,11,12,13,14,15,16,17,20,21,22,2,0,19]),import.meta.url),c(()=>import(`./Theme-C92sm229.js`).then(e=>e.t),__vite__mapDeps([26,1,7,6,8,4,9,10,11,12,13,14,15,16,17,18,2,0,19,20,21,22,27,28]),import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}};function Y(e){return new J(e)}export{J as SettingsView,ot as applyContributions,Ke as clearSettingsSyncArms,st as collectContributions,qe as createMemorySettingsSyncArm,K as createSettingsView,Y as createView,Y as default,I as detectSettingsSurface,x as getSettingsContributions,Je as getSettingsDefaults,Ye as getSettingsSnapshot,R as getSettingsSync,W as hydrateContributionsFromSync,F as mergeSettingsPatch,at as mountContributions,z as patchSettingsSync,lt as persistContributionsViaSync,me as registerAirpadSettingsContribution,_e as registerBuiltinSettingsContributions,ue as registerCwspSettingsContribution,fe as registerDeviceSettingsContribution,he as registerReaderSettingsContribution,ve as registerSettingsContribution,We as registerSettingsSyncArm,pe as registerWorkcenterSettingsContribution,rt as resolveSettingsSurface,L as resolveSettingsSyncArm,Ue as setSurfaceDetector,Ge as unregisterSettingsSyncArm};