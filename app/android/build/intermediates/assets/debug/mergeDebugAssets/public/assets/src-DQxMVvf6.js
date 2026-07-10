const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./airpad-cwsp-client-parity-Br52iGJH.js","./QuillEditor-5EL1yOoF.js","./src-BpV51oCB.js","./preload-helper-Bo9GmnuQ.js","./src-C84Gs1AJ.js","./src-qiWUXI2q.js","./QuillEditor-Bf4bJ6eu.css","./cwsp-endpoint-resolve-yC2xPiCy.js","./clipboard-device-BmJIMpib.js","./cws-bridge-C-DolXsj.js","./UniformInterop-D3VdT-mc.js","./hub-socket-boot-DJWpZMPd.js","./config-BiICo4Kh.js","./Settings-CNCkDRrH.js","./SettingsTypes-YPycdw7z.js","./websocket-C93q1MAF.js","./Theme-a45HWoBO.js","./Clipboard--70Uu543.js","./Runtime-DCDwmOhf.js"])))=>i.map(i=>d[i]);
import{ft as e,hn as t,jn as n,mn as r}from"./src-BpV51oCB.js";import{c as i,l as a,s as o,u as s}from"./registry-49K1MLlk.js";import{t as c}from"./preload-helper-Bo9GmnuQ.js";import{t as l}from"./templates-CIgYjwZI.js";import{u}from"./UnifiedMessaging-PsPjdcFT.js";import"./BootLoader-Dx7KmUkl.js";import{p as d}from"./cwsp-endpoint-resolve-yC2xPiCy.js";import{r as f,t as p}from"./SettingsTypes-YPycdw7z.js";import{n as m}from"./Theme-a45HWoBO.js";import{a as ee,i as te,n as ne,r as re}from"./Settings-CNCkDRrH.js";import{d as ie}from"./config-BiICo4Kh.js";import{n as ae}from"./capacitor-permissions-DYfuk-wB.js";import{n as oe,r as h}from"./admin-doors-CWZQCbhh.js";import{c as g,i as _,n as v,o as y,r as se,s as b}from"./CustomInstructions-DgkmTPYv.js";import"./shells-Cu93DfQB.js";import{r as x}from"./channel-actions-D8kkWWkx.js";import{a as ce,c as le,i as ue,l as S,n as de,o as fe,r as pe,s as me,t as he,u as ge}from"./register-builtin-contributions-f3yQtUjM.js";import"./types-CWIT604_.js";var C=`data-settings-view-css`,w=e=>{let t=String(e||``).trim(),n=t.match(/^@layer\s+settings-view\s*\{([\s\S]*)\}\s*$/);return n&&(t=n[1].trim()),t},T=`
.view-settings{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;block-size:100%!important;min-block-size:0!important;overflow:hidden!important;color:#e8edf2!important;background:#0f1318!important}
.view-settings .settings-screen__body{display:flex!important;flex-direction:column!important;min-block-size:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch}
.view-settings [data-tab-panel]:not([hidden]){display:flex!important;flex-direction:column!important;gap:.75rem!important}
.view-settings [data-tab-panel][hidden]{display:none!important}
.view-settings .field,.view-settings .form-input,.view-settings .form-select{pointer-events:auto!important;color:inherit!important}
`,E=e=>{if(!e?.classList?.contains(`view-settings`)||e.querySelector(`style[${C}]`))return;let t=w(`@layer settings-view{.view-settings{color-scheme:inherit;--sv-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));--sv-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));--sv-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));--sv-outline: var(--color-outline-variant, light-dark(#c5cdd8, #3d4755));--sv-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #171c24));--sv-surface-2: var(--color-surface-container, light-dark(#f4f6fa, #1c232d));--sv-primary: var(--color-primary, #007acc);--sv-on-primary: var(--color-on-primary, #ffffff);--sv-danger: var(--color-error, #d32f2f);--sv-divider: color-mix(in oklab, var(--sv-outline) 35%, transparent);--sv-ring: color-mix(in oklab, var(--sv-outline) 55%, transparent);--sv-elev: 0 2px 14px color-mix(in oklab, var(--sv-fg) 5%, transparent);box-sizing:border-box;display:grid;grid-template-rows:auto minmax(0,1fr) auto;grid-template-columns:minmax(0,1fr);gap:0;inline-size:100%;block-size:100%;max-block-size:100%;min-block-size:0;margin:0;padding:clamp(.5rem,2cqi,1rem);overflow:hidden;text-align:start;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background-color:var(--sv-bg);color:var(--sv-fg)}.view-settings *,.view-settings *:before,.view-settings *:after{box-sizing:border-box}.view-settings :where(select,input,textarea,option,button){pointer-events:auto;font-family:inherit}.view-settings textarea{container-type:inline-size;resize:vertical;inline-size:100%;max-inline-size:100%}.view-settings h2,.view-settings h3{margin:0;text-align:start;color:var(--sv-fg)}.view-settings h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em}.view-settings h3{font-size:.94rem;font-weight:600;letter-spacing:-.01em}.view-settings .settings-screen__top{display:flex;flex-direction:column;align-items:stretch;gap:.75rem;padding-block-end:.875rem;border-block-end:1px solid var(--sv-divider);flex-shrink:0;min-inline-size:0}.view-settings .settings-screen__title{font-weight:600;letter-spacing:-.015em;font-size:clamp(1.05rem,2.5cqi,1.35rem)}@media(min-width:720px){.view-settings .settings-screen__top{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;display:flex;flex-direction:column;gap:1rem;padding-block:.75rem;scrollbar-width:thin;scrollbar-color:var(--sv-outline) transparent}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:99px}.view-settings .settings-screen__footer{inline-size:stretch;display:flex;align-items:center;justify-content:flex-start;gap:.5rem;flex-wrap:wrap;flex-shrink:0;padding-block:.75rem;padding-inline:.25rem;border-block-start:1px solid var(--sv-divider);background:color-mix(in oklab,var(--sv-surface-1) 85%,var(--sv-bg));box-shadow:0 -10px 28px color-mix(in oklab,var(--sv-fg) 4%,transparent)}.view-settings .settings-tab-actions{display:flex;flex-wrap:nowrap;gap:.375rem;align-items:center;inline-size:stretch;max-inline-size:stretch;overflow-x:auto;scrollbar-width:thin;scrollbar-color:var(--sv-outline) transparent;container-type:inline-size;pointer-events:auto;position:relative;z-index:1}.view-settings .settings-tab-btn{pointer-events:auto;cursor:pointer;padding:.5rem .875rem;min-block-size:2.5rem;border:none;border-radius:999px;background:color-mix(in oklab,var(--sv-surface-2) 94%,transparent);color:var(--sv-muted);font-size:.75rem;font-weight:500;transition:background-color .12s ease,color .12s ease,box-shadow .12s ease;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent);white-space:nowrap}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--sv-surface-2) 100%,transparent);color:var(--sv-fg)}.view-settings .settings-tab-btn.is-active{background:var(--sv-primary);color:var(--sv-on-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 40%,transparent)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel:not([hidden]),.view-settings .settings-tab-panel.is-active:not([hidden]){display:flex;flex-direction:column;align-items:stretch;gap:.75rem;min-inline-size:0}.view-settings .settings-tab-panel[hidden]{display:none!important}.view-settings .card{display:flex;flex-direction:column;gap:.75rem;padding:1rem;inline-size:stretch;border:none;border-radius:16px;background:color-mix(in oklab,var(--sv-surface-2) 92%,var(--sv-bg));box-shadow:var(--sv-elev),0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent)}@container (max-inline-size: 480px){.view-settings .card{padding:.875rem;border-radius:14px}}.view-settings .settings-panel-form{display:flex;flex-direction:column;gap:.75rem;inline-size:stretch}.view-settings .field{display:grid;grid-auto-flow:row;gap:.375rem;inline-size:stretch;font-size:.75rem;margin:0}.view-settings .field>span{font-size:.75rem;font-weight:500;color:var(--sv-muted)}.view-settings .field.checkbox{grid-auto-flow:column;grid-auto-columns:max-content 1fr;align-items:center;gap:.625rem}.view-settings .field-hint{margin:0 0 .75rem;font-size:.85em;line-height:1.45;color:var(--sv-muted);opacity:.95}.view-settings .form-input,.view-settings .form-select{display:block;inline-size:100%;min-block-size:2.5rem;padding:.5rem .65rem;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);font-size:.875rem;line-height:1.25;outline:none;transition:border-color .12s ease,box-shadow .12s ease}.view-settings .form-input:focus-visible,.view-settings .form-select:focus-visible{border-color:color-mix(in oklab,var(--sv-primary) 55%,var(--sv-outline));box-shadow:0 0 0 3px color-mix(in oklab,var(--sv-primary) 22%,transparent)}.view-settings select.form-select,.view-settings select.form-input{appearance:none;padding-inline-end:2rem;background-image:linear-gradient(45deg,transparent 50%,var(--sv-muted) 50%),linear-gradient(135deg,var(--sv-muted) 50%,transparent 50%);background-position:calc(100% - 14px) calc(50% - 2px),calc(100% - 9px) calc(50% - 2px);background-size:5px 5px;background-repeat:no-repeat}.view-settings .btn{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.5rem 1.125rem;min-block-size:2.5rem;border:none;border-radius:999px;background:color-mix(in oklab,var(--sv-surface-2) 90%,transparent);color:var(--sv-fg);font-size:.8125rem;font-weight:500;cursor:pointer;transition:background-color .12s ease,box-shadow .12s ease,filter .12s ease;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent)}.view-settings .btn:hover{background:color-mix(in oklab,var(--sv-fg) 6%,var(--sv-surface-2))}.view-settings .btn.primary{background:var(--sv-primary);color:var(--sv-on-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 26%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 45%,transparent)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .btn.btn-sm,.view-settings .btn.small{padding:.35rem .65rem;min-block-size:2rem;font-size:.75rem}.view-settings .btn.btn-danger{color:var(--sv-on-primary);background:color-mix(in oklab,var(--sv-danger) 92%,#000);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-danger) 35%,transparent)}.view-settings .btn.btn-danger:hover{filter:brightness(1.08)}.view-settings .btn.tiny{min-block-size:2rem;padding:.3rem .5rem;font-size:.72rem}.view-settings .note,.view-settings .ext-note{font-size:.75rem;color:var(--sv-muted);opacity:.92;flex:1 1 auto;max-inline-size:100%;display:block;overflow:hidden;text-overflow:ellipsis;white-space:normal;line-height:1.35;pointer-events:none}.view-settings .note.note--ok,.view-settings .ext-note.note--ok{color:color-mix(in oklab,var(--sv-accent, #3ecf8e) 70%,var(--sv-fg))}.view-settings .note.note--warn,.view-settings .ext-note.note--warn{color:color-mix(in oklab,#e6a700 75%,var(--sv-fg))}.view-settings .note.note--err,.view-settings .ext-note.note--err{color:color-mix(in oklab,#e05252 80%,var(--sv-fg))}.view-settings .ext-note{line-height:1.4}.view-settings .ext-note code{padding:2px 6px;border-radius:4px;font-size:.68rem;background:color-mix(in oklab,var(--sv-surface-2) 80%,var(--sv-bg));color:var(--sv-fg)}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{inline-size:1.15rem;block-size:1.15rem;accent-color:var(--sv-primary);flex-shrink:0}.view-settings .mcp-section{display:flex;flex-direction:column;gap:.5rem}.view-settings .mcp-actions{margin-block-start:.5rem;display:flex;flex-wrap:wrap;gap:.5rem}.view-settings .mcp-row{display:grid;gap:.5rem;padding:.75rem;border-radius:12px;background:color-mix(in oklab,var(--sv-surface-2) 88%,var(--sv-bg));box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent)}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{margin:0;color:var(--sv-muted);font-size:.75rem}.view-settings .settings-spoiler{border-radius:12px;border:1px solid color-mix(in oklab,var(--sv-outline) 22%,transparent);background:color-mix(in oklab,var(--sv-surface-1) 55%,transparent);padding:.25rem .5rem}.view-settings .settings-spoiler summary{cursor:pointer;font-size:.8rem;font-weight:600;padding:.35rem .25rem;color:var(--sv-fg)}.view-settings .settings-spoiler .settings-panel-form{padding-block-end:.25rem}.view-settings .view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings .view-settings__section{display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem;border-block-end:1px solid var(--sv-divider)}.view-settings .view-settings__section:last-of-type{border-block-end:none}.view-settings .view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings .view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings .view-settings__label>span{font-size:.8125rem;font-weight:500}.view-settings .view-settings__select,.view-settings .view-settings__input{min-block-size:2.5rem;padding:.45rem .6rem;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);font-size:.875rem}.view-settings .view-settings__checkbox{display:flex;align-items:center;gap:.5rem;font-size:.8125rem}.view-settings .view-settings__actions{display:flex;gap:.75rem;margin-block-start:1.5rem}.view-settings .view-settings__btn{padding:.55rem 1.1rem;border-radius:8px;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);background:transparent;color:var(--sv-fg);cursor:pointer}.view-settings .view-settings__btn--primary{background:var(--sv-primary);border-color:color-mix(in oklab,var(--sv-primary) 30%,#000);color:var(--sv-on-primary)}.view-settings .view-settings__btn--primary:hover{filter:brightness(1.06)}.view-settings .custom-instructions-panel,.view-settings .custom-instructions-editor{display:flex;flex-direction:column;gap:.75rem}.view-settings .cip-select-row,.view-settings .ci-row{display:flex;flex-direction:column;gap:.35rem}.view-settings .ci-header{margin-block-end:.25rem}.view-settings .ci-header h4{margin:0 0 .25rem;font-size:.88rem}.view-settings .ci-desc{margin:0;font-size:.78rem;color:var(--sv-muted);line-height:1.45}.view-settings .ci-active-select{display:flex;flex-direction:column;gap:.25rem}.view-settings .ci-select,.view-settings .cip-select{min-block-size:2.35rem;padding:.4rem .55rem;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);font-size:.8rem}.view-settings .cip-list,.view-settings .ci-list{display:flex;flex-direction:column;gap:.5rem}.view-settings .cip-item,.view-settings .ci-item{padding:.65rem .75rem;border-radius:12px;background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 16%,transparent)}.view-settings .cip-item.is-active,.view-settings .cip-item.active,.view-settings .ci-item.is-active,.view-settings .ci-item.active{border-color:color-mix(in oklab,var(--sv-primary) 35%,transparent);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-primary) 18%,transparent)}.view-settings .cip-item-header,.view-settings .ci-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem}.view-settings .cip-item-label,.view-settings .ci-item-label{font-weight:600;font-size:.8rem}.view-settings .cip-item-actions,.view-settings .ci-item-actions{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:flex-end}.view-settings .cip-badge,.view-settings .ci-badge{font-size:.65rem;padding:.15rem .4rem;border-radius:999px;background:color-mix(in oklab,var(--sv-primary) 16%,transparent);color:var(--sv-fg)}.view-settings .cip-item-preview,.view-settings .ci-item-preview{font-size:.75rem;color:var(--sv-muted);margin-block-start:.35rem;line-height:1.45}.view-settings .cip-edit-form,.view-settings .ci-edit-form{display:flex;flex-direction:column;gap:.5rem;margin-block-start:.5rem}.view-settings .cip-form-actions,.view-settings .cip-toolbar,.view-settings .ci-actions,.view-settings .ci-add-actions,.view-settings .ci-edit-actions{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.view-settings .cip-input,.view-settings .cip-textarea,.view-settings .ci-input,.view-settings .ci-textarea,.view-settings .field-control{inline-size:100%;border-radius:10px;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);background:var(--sv-surface-1);color:var(--sv-fg);padding:.45rem .55rem;font-size:.8125rem}.view-settings .cip-textarea,.view-settings .ci-textarea{min-block-size:5rem}.view-settings .cip-empty,.view-settings .ci-empty{font-size:.8rem;color:var(--sv-muted);padding:.75rem;text-align:center}.view-settings .field-label{font-size:.72rem;font-weight:600;color:var(--sv-muted);text-transform:uppercase;letter-spacing:.04em}@container (max-inline-size: 1024px){.view-settings{padding:.65rem}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.3rem}.view-settings .settings-tab-btn{min-block-size:2.65rem;padding-inline:.7rem}}@container (max-inline-size: 480px){.view-settings{padding:.45rem}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{padding-block:.5rem;gap:.75rem}.view-settings .settings-screen__footer{flex-direction:column-reverse;align-items:stretch;gap:.5rem}.view-settings .settings-screen__footer .btn.primary{inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{white-space:normal;text-align:center}}}`);t=t.trim()?`${T}\n${t}`:T;let n=document.createElement(`style`);n.setAttribute(C,``),n.textContent=t,e.insertBefore(n,e.firstChild)},D=e=>{if(!e)return;let t=()=>{if(!e.isConnected){requestAnimationFrame(t);return}E(e)};e.isConnected?E(e):requestAnimationFrame(t)},_e={FRONTEND_CHOICE:`rs-frontend-choice`,FRONTEND_REMEMBER:`rs-frontend-choice-remember`,THEME:`rs-theme`,SETTINGS:`rs-settings`,BOOT_STYLE:`rs-boot-style`,BOOT_SHELL:`rs-boot-shell`,BOOT_SHELL_LAST_ACTIVE:`rs-boot-shell-last-active`,BOOT_VIEW:`rs-boot-view`,BOOT_REMEMBER:`rs-boot-remember`,SHELL_CHOICE:`rs-shell-choice`,SHELL_REMEMBER:`rs-shell-remember`,WORKCENTER_STATE:`rs-workcenter-state`,VIEWER_STATE:`rs-viewer-state`,EDITOR_STATE:`rs-editor-state`,EXPLORER_STATE:`view-explorer-state`,EXPLORER_PATH:`view-explorer-path`,LAST_MARKDOWN:`rs-last-markdown`,HISTORY:`rs-history`,RECENT_FILES:`rs-recent-files`,AI_CONFIG:`rs-ai-config`};function ve(e,t){try{return localStorage.setItem(e,t),!0}catch{return!1}}var O=class{dbName;storeName;db=null;constructor(e,t){this.dbName=e,this.storeName=t}async open(){return this.db?this.db:new Promise((e,t)=>{let n=indexedDB.open(this.dbName,1);n.onerror=()=>t(n.error),n.onsuccess=()=>{this.db=n.result,e(this.db)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName,{keyPath:`id`})}})}async get(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readonly`).objectStore(this.storeName).get(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n(i.result||null)})}async set(e,t){let n=await this.open();return new Promise((r,i)=>{let a=n.transaction([this.storeName],`readwrite`).objectStore(this.storeName).put({id:e,...t});a.onerror=()=>i(a.error),a.onsuccess=()=>r()})}async delete(e){let t=await this.open();return new Promise((n,r)=>{let i=t.transaction([this.storeName],`readwrite`).objectStore(this.storeName).delete(e);i.onerror=()=>r(i.error),i.onsuccess=()=>n()})}async getAll(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readonly`).objectStore(this.storeName).getAll();r.onerror=()=>n(r.error),r.onsuccess=()=>t(r.result||[])})}async clear(){let e=await this.open();return new Promise((t,n)=>{let r=e.transaction([this.storeName],`readwrite`).objectStore(this.storeName).clear();r.onerror=()=>n(r.error),r.onsuccess=()=>t()})}close(){this.db?.close(),this.db=null}};new O(`rs-workcenter`,`data`),new O(`rs-history`,`entries`),new O(`rs-settings`,`config`),[...i],s(`home`,o);function ye(e){let t=`/`;if(e.params&&Object.keys(e.params).length>0){let n=new URLSearchParams(e.params).toString();t+=`?`+n}return t}function k(e,t={}){let n=ye(e);t.replace?history.replaceState(t.state??e,``,n):history.pushState(t.state??e,``,n),globalThis?.dispatchEvent?.(new CustomEvent(`route-change`,{detail:e}))}function be(e,t){k({view:e,params:t})}var A=[`en`,`ru`,`en-GB`,`en-US`],xe=e=>e===`en`?`English (generic)`:e===`ru`?`Russian`:e===`en-GB`?`English (UK)`:`English (US)`,Se=e=>{let t=(e||``).trim();return t?t===`ru`||t.startsWith(`ru-`)?`ru`:t===`en-GB`?`en-GB`:t===`en-US`?`en-US`:t===`en`||t.startsWith(`en-`)?`en`:null:null},Ce=()=>{let e=new Set,t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=Se(n);t&&e.add(t)}for(let t of A)e.add(t);return Array.from(e)},we=()=>{let e=new Set([`ru`,`en`]),t=typeof navigator<`u`?[...navigator.languages||[],navigator.language]:[];for(let n of t){let t=(n||``).trim();!t||t===`en`||t===`ru`||e.add(t)}return Array.from(e)},j=(e,t)=>{let n=Number((e||``).trim());return Number.isFinite(n)?n:t},Te=(e,t,n,r)=>{let i=Number.parseFloat((e||``).trim());return Number.isFinite(i)?Math.max(n,Math.min(r,i)):t},M=(e,t=``)=>e?e.value.trim():t,N=(e,t)=>e?!!e.checked:t,Ee=e=>{if(typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element)return t}let t=e.target;return t instanceof Element?t:t instanceof Text?t.parentElement:null},De=t=>{let n={id:(t?.id||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`).trim(),serverLabel:(t?.serverLabel||``).trim(),origin:(t?.origin||``).trim(),clientKey:(t?.clientKey||``).trim(),secretKey:(t?.secretKey||``).trim()};return e`<div class="field mcp-row" data-mcp-id=${n.id}>
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
          </div>`},Oe=e=>{if(!e)return[];let t=Array.from(e.querySelectorAll(`[data-mcp-id]`)),n=[];for(let e of t){let t=e.getAttribute(`data-mcp-id`)||`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,r=e.querySelector(`[data-mcp-field="serverLabel"]`)?.value?.trim()||``,i=e.querySelector(`[data-mcp-field="origin"]`)?.value?.trim()||``,a=e.querySelector(`[data-mcp-field="clientKey"]`)?.value?.trim()||``,o=e.querySelector(`[data-mcp-field="secretKey"]`)?.value?.trim()||``;r&&n.push({id:t,serverLabel:r,origin:i,clientKey:a,secretKey:o})}return n},ke=(t,n)=>{if(!t)return;t.replaceChildren();let r=Array.isArray(n)?n:[];if(!r.length){t.appendChild(e`<p class="mcp-empty-note">No MCP servers configured.</p>`);return}r.forEach(e=>t.appendChild(De(e)))},Ae=()=>e`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`,je=()=>e`<header class="settings-screen__top">
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
    </header>`,Me=()=>e`<section class="card settings-tab-panel" data-tab-panel="appearance">
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
    </section>`,Ne=()=>e`<section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>`,Pe=()=>e`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`,Fe=()=>e`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`,Ie=()=>e`<section class="card settings-tab-panel" data-tab-panel="server">
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
    </section>`,Le=(t={})=>{let n=r({instructions:[],activeId:``,editingId:null,newLabel:``,newInstruction:``,isAdding:!1}),i=e`<div class="custom-instructions-editor">
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
    </div>`,a=i.querySelector(`[data-list]`),o=i.querySelector(`[data-action='select-active']`),s=i.querySelector(`[data-add-form]`),c=i.querySelector(`[data-field='label']`),u=i.querySelector(`[data-field='instruction']`),d=()=>{a.replaceChildren();let r=n.instructions??[];if(!r.length){a.append(e`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);return}for(let i of r){let r=n.editingId===i.id,o=n.activeId===i.id,s=e`<div class="ci-item ${o?`active`:``}" data-id="${i.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${i.label}</span>
                    <div class="ci-item-actions">
                        ${o?e`<span class="ci-badge active">Active</span>`:e`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${r?e`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${i.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${i.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:e`<div class="ci-item-preview">${p(i.instruction,120)}</div>`}
            </div>`;s.addEventListener(`click`,e=>{let r=e.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`activate`&&b(i.id).then(m).then(()=>t.onUpdate?.()),r===`edit`&&(n.editingId=i.id,d()),r===`delete`&&confirm(`Delete "${i.label}"?`)&&_(i.id).then(m).then(()=>t.onUpdate?.()),r===`save-edit`){let e=s.querySelector(`[data-edit-field='label']`),r=s.querySelector(`[data-edit-field='instruction']`);g(i.id,{label:e.value.trim()||i.label,instruction:r.value.trim()}).then(()=>(n.editingId=null,m())).then(()=>t.onUpdate?.())}r===`cancel-edit`&&(n.editingId=null,d())}),a.append(s)}},f=()=>{o.replaceChildren(),o.append(e`<option value="">None (use default)</option>`);for(let t of n.instructions??[]){let r=e`<option value="${t.id}">${t.label}</option>`;t.id===n.activeId&&(r.selected=!0),o.append(r)}},p=(e,t)=>!e||e.length<=t?e||``:e.slice(0,t).trim()+`…`,m=async()=>{let e=await y(),t=Array.isArray(e)?{instructions:e,activeId:``,activeInstruction:null}:e;n.instructions=t?.instructions??[],n.activeId=t?.activeId??``,d(),f()};return i.addEventListener(`click`,e=>{let r=e.target.closest(`[data-action]`)?.getAttribute(`data-action`);if(r===`add`&&(n.isAdding=!0,s.hidden=!1,c.value=``,u.value=``,c.focus()),r===`cancel-add`&&(n.isAdding=!1,s.hidden=!0),r===`save-new`){let e=c.value.trim(),r=u.value.trim();if(!r){u.focus();return}v(e||`Custom`,r).then(e=>{if(e)return n.isAdding=!1,s.hidden=!0,m()}).then(()=>t.onUpdate?.())}if(r===`add-templates`){let e=new Set((n.instructions??[]).map(e=>e.label.trim().toLowerCase())),r=l.filter(t=>!e.has(t.label.trim().toLowerCase()));if(!r.length){alert(`All templates are already added.`);return}se(r.map(e=>({label:e.label,instruction:e.instruction,enabled:e.enabled}))).then(m).then(()=>t.onUpdate?.())}}),o.addEventListener(`change`,()=>{b(o.value||null).then(m).then(()=>t.onUpdate?.())}),m(),i},Re=t=>e`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${Le({onUpdate:()=>t(`Instructions updated.`)})}
      </div>
    </section>`,ze=()=>e`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`,P={},F=Be;function Be(){let e=globalThis;return e.__CWS_WEBNATIVE_BOOT__?`webnative`:e.Capacitor===void 0?e.chrome!==void 0&&e.chrome?.runtime?`crx`:`web`:`capacitor`}function Ve(e){F=e}function He(e,t){P[e]=t}function Ue(e){delete P[e]}function We(){for(let e of Object.keys(P))delete P[e]}function I(e,t){let n={...e};for(let[e,r]of Object.entries(t)){let t=n[e];typeof r==`object`&&r&&!Array.isArray(r)&&typeof t==`object`&&t&&!Array.isArray(t)?n[e]={...t,...r}:n[e]=r}return n}function Ge(e={},t={}){let n={...e};return{get:async()=>({...n}),patch:async e=>(n=I(n,e),{...n}),...t}}function Ke(){return F()}function L(){return P[F()]||P.web||null}async function R(){let e=L();if(!e)return{};try{return await e.get()}catch{return{}}}async function z(e){let t=L();return t?t.patch(e):{}}async function qe(){let e=L();if(!e?.defaults)return{};try{return await e.defaults()}catch{return{}}}async function Je(){let e=L();if(!e?.snapshot)return{};try{return await e.snapshot()}catch{return{}}}var Ye=e=>e.isExtension||e.surface===`crx`?`extension`:(e.surface===`capacitor`||e.surface===`native`)&&!(a(`workcenter`)||a(`viewer`)||a(`explorer`))?`cwsp-mobile`:`full`,Xe=[`appearance`,`markdown`,`ai`,`mcp`,`server`,`instructions`,`extension`],Ze=(e,t)=>{if(t===`cwsp-mobile`)for(let t of Xe)e.querySelector(`[data-tab-panel="${t}"]`)?.remove(),e.querySelector(`[data-action="switch-settings-tab"][data-tab="${t}"]`)?.remove()},Qe=e=>e===`cwsp-mobile`?`cwsp`:e===`extension`?`extension`:`ai`,$e=(e,t)=>!!e.querySelector(`[data-tab-panel="${t}"]`),et=`[data-settings-tabs]`,tt=`.settings-screen__body`,nt=()=>{try{let e=globalThis;if(e?.chrome?.runtime?.id)return`crx`;if(e?.Capacitor?.isNativePlatform?.())return`capacitor`;if(e?.__CWS_NATIVE__===!0)return`native`;if(typeof document<`u`)return`web`}catch{}return`unknown`},rt=(e,t)=>{if(e.requiresView&&!a(e.requiresView))return!1;let n=e.surfaces;return!(n?.length&&!n.includes(t.surface)||e.excludeSurfaces?.includes(t.surface))},B=e=>S().filter(t=>rt(t,e)),it=(e,t)=>{let n=e.querySelector(et),r=e.querySelector(tt);if(!(!n||!r))for(let i of B(t)){if(e.querySelector(`[data-tab-panel="${i.id}"]`))continue;let a=document.createElement(`button`);a.className=`settings-tab-btn`,a.type=`button`,a.role=`tab`,a.setAttribute(`data-action`,`switch-settings-tab`),a.setAttribute(`data-tab`,i.id),a.setAttribute(`data-contributed-tab`,``),a.setAttribute(`aria-selected`,`false`),a.textContent=i.label;let o=n.querySelector(`[data-extension-tab]`);o?n.insertBefore(a,o):n.appendChild(a);let s=null;try{s=i.render(t)}catch(e){console.warn(`[settings] contribution '${i.id}' render failed:`,e)}if(!s)continue;let c;s.matches?.(`[data-tab-panel]`)?(c=s,c.classList.add(`card`,`settings-tab-panel`),c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0):(c=document.createElement(`section`),c.className=`card settings-tab-panel`,c.setAttribute(`data-tab-panel`,i.id),c.setAttribute(`data-contributed-panel`,``),c.hidden=!0,c.appendChild(s)),r.appendChild(c)}},V=(e,t,n)=>{for(let r of B(t)){let t=e.querySelector(`[data-tab-panel="${r.id}"]`);t&&n(r,t)}},at=(e,t,n)=>{V(e,n,(e,r)=>{try{e.manualFields||me(r,t),e.load?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' load failed:`,t)}})},ot=(e,t,n)=>{V(e,n,(e,r)=>{try{e.manualFields||le(r,t),e.save?.(t,r,n)}catch(t){console.warn(`[settings] contribution '${e.id}' save failed:`,t)}})},st=async(e,t,n={})=>{let r=await R(),i={...n,...r};return at(e,i,t),i},H=async(e,t,n)=>(ot(e,t,n),z(t)),ct=e=>B(e).map(e=>e.id),U=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},lt=async e=>{f(e);let t=e.core;if(!t||typeof t!=`object`)return;let{sanitizeFleetSelfWireNodeId:n}=await c(async()=>{let{sanitizeFleetSelfWireNodeId:e}=await import(`./airpad-cwsp-client-parity-Br52iGJH.js`).then(e=>e.a);return{sanitizeFleetSelfWireNodeId:e}},__vite__mapDeps([0,1,2,3,4,5,6,7]),import.meta.url),r=n(t.userId);r&&(t.userId=r);let i=typeof t.endpointUrl==`string`?t.endpointUrl:``,a=typeof t.ops?.directUrl==`string`?t.ops.directUrl:``;if(!i.trim()&&!a.trim())return;let o=U()?{discover:!1,timeoutMs:1500}:{timeoutMs:3e3},s=await d({relayHttpsUrl:i,directHttpsUrl:a},o);s.relayHttpsUrl!==void 0&&(t.endpointUrl=s.relayHttpsUrl),s.directHttpsUrl!==void 0&&(t.ops={...t.ops||{},directUrl:s.directHttpsUrl})},W=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},G=e=>{let t=W()?.Plugins?.[e];return t&&typeof t==`object`?t:null},K=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch(e){console.warn(`[capacitor-settings-permissions]`,e);return}},ut=async e=>{let t=[],n=[],r=!1;if(!ae())return{lines:t,results:n,prompted:r};let i=e.shell||{},a=i.acceptContactsBridgeData===!0,o=i.acceptSmsBridgeData===!0,s=(i.bridgeDaemonEnabled??!0)!==!1,c=(i.enableRemoteClipboardBridge??!0)!==!1,l=s||c,u=G(`CwsPlatform`);if(a||o||l)if(u?.requestSettingsPermissions){let e=await K(u.requestSettingsPermissions,{contacts:a,sms:o,notifications:l,overlay:!1}),i=!1;if(e&&typeof e==`object`){i=e.prompted===!0,r=i;let t=e.results;if(Array.isArray(t)){for(let e of t)if(e&&typeof e==`object`){let t=String(e.permission??``);if(t===`SYSTEM_ALERT_WINDOW`)continue;n.push({permission:t,granted:!!e.granted})}}}let s=n.filter(e=>e.granted===!1);s.length?t.push(`Permission denied: ${s.map(e=>e.permission).filter(Boolean).join(`, `)}`):i&&t.push(`Runtime permissions requested`)}else{let e=G(`DevicePermissions`)||G(`Permissions`),n=[];a&&n.push(`READ_CONTACTS`),o&&n.push(`READ_SMS`),l&&n.push(`POST_NOTIFICATIONS`),e?.requestPermissions&&n.length&&(await K(e.requestPermissions,{permissions:n}),t.push(`Runtime permissions requested (legacy plugin)`))}return s&&u?.startCwspBridge?(await K(u.startCwspBridge),t.push(`CWSP foreground service started`)):!s&&u?.stopCwspBridge&&(await K(u.stopCwspBridge),t.push(`CWSP foreground service stopped`)),{lines:t,results:n,prompted:r}},q=t=>{let n=null,r=null,i=()=>{let e=nt();return e===`capacitor`||e===`native`?8e3:2500},a=(e,t)=>{n&&(r&&=(clearTimeout(r),null),n.textContent=e,n.classList.remove(`note--ok`,`note--warn`,`note--err`),t?.tone===`ok`&&n.classList.add(`note--ok`),t?.tone===`warn`&&n.classList.add(`note--warn`),t?.tone===`err`&&n.classList.add(`note--err`),e&&!t?.persist&&(r=setTimeout(()=>{n&&(n.textContent=``,n.classList.remove(`note--ok`,`note--warn`,`note--err`))},i())))},o=e`<div class="view-settings" data-view="settings">
    ${je()}
    <div class="settings-screen__body">
      ${Me()}
      ${Ne()}
      ${Pe()}
      ${Fe()}
      ${Ie()}
      ${Re(a)}
      ${ze()}
    </div>
    ${Ae()}
  </div>`;D(o),he();let s={isExtension:t.isExtension,surface:nt()},l=Ye(s);it(o,s),Ze(o,l),l===`full`&&(s.surface===`capacitor`||s.surface===`native`)&&(o.querySelector(`[data-tab-panel="server"]`)?.remove(),o.querySelector(`[data-action="switch-settings-tab"][data-tab="server"]`)?.remove());let d=e=>$e(o,e),f=e=>o.querySelector(e);n=o.querySelector(`[data-note]`);let ae=f(`[data-field="ai.baseUrl"]`),g=f(`[data-field="ai.apiKey"]`),_=f(`[data-field="ui.showKey"]`),v=f(`[data-field="ai.model"]`),y=f(`[data-field="ai.customModel"]`),se=o.querySelector(`[data-field-group="ai.customModel"]`),b=f(`[data-field="ai.defaultReasoningEffort"]`),x=f(`[data-field="ai.defaultVerbosity"]`),ce=f(`[data-field="ai.maxOutputTokens"]`),le=f(`[data-field="ai.contextTruncation"]`),ue=f(`[data-field="ai.promptCacheRetention"]`),S=f(`[data-field="ai.maxToolCalls"]`),de=f(`[data-field="ai.parallelToolCalls"]`),fe=f(`[data-field="ai.requestTimeout.low"]`),pe=f(`[data-field="ai.requestTimeout.medium"]`),me=f(`[data-field="ai.requestTimeout.high"]`),ge=f(`[data-field="ai.maxRetries"]`),C=f(`[data-field="ai.shareTargetMode"]`),w=()=>{let e=(v?.value||``).trim()===`custom`;se&&(se.hidden=!e),y&&(y.disabled=!e)};if(v){v.replaceChildren();for(let e of p){let t=document.createElement(`option`);t.value=e,t.textContent=e,v.append(t)}let e=document.createElement(`option`);e.value=`custom`,e.textContent=`Custom...`,v.append(e),v.addEventListener(`change`,w)}y?.addEventListener(`focus`,()=>{v&&(v.value=`custom`,w())});let T=f(`[data-field="ai.autoProcessShared"]`),E=f(`[data-field="ai.responseLanguage"]`),O=f(`[data-field="ai.translateResults"]`),ye=f(`[data-field="ai.generateSvgGraphics"]`),k=f(`[data-field="speech.language"]`),A=f(`[data-field="appearance.theme"]`),Se=f(`[data-field="appearance.fontSize"]`),Le=f(`[data-field="appearance.markdown.preset"]`),P=f(`[data-field="appearance.markdown.fontFamily"]`),F=f(`[data-field="appearance.markdown.fontSizePx"]`),Be=f(`[data-field="appearance.markdown.lineHeight"]`),Ve=f(`[data-field="appearance.markdown.contentMaxWidthPx"]`),He=f(`[data-field="appearance.markdown.printScale"]`),Ue=f(`[data-field="appearance.markdown.page.size"]`),We=f(`[data-field="appearance.markdown.page.orientation"]`),I=f(`[data-field="appearance.markdown.page.marginMm"]`),Ge=f(`[data-field="appearance.markdown.modules.typography"]`),Ke=f(`[data-field="appearance.markdown.modules.lists"]`),L=f(`[data-field="appearance.markdown.modules.tables"]`),R=f(`[data-field="appearance.markdown.modules.codeBlocks"]`),z=f(`[data-field="appearance.markdown.modules.blockquotes"]`),qe=f(`[data-field="appearance.markdown.modules.media"]`),Je=f(`[data-field="appearance.markdown.modules.printBreaks"]`),Xe=f(`[data-field="appearance.markdown.plugins.smartTypography"]`),et=f(`[data-field="appearance.markdown.plugins.softBreaksAsBr"]`),tt=f(`[data-field="appearance.markdown.plugins.externalLinksNewTab"]`),rt=o.querySelector(`[data-field="appearance.markdown.customCss"]`),B=o.querySelector(`[data-field="appearance.markdown.printCss"]`),V=o.querySelector(`[data-field="appearance.markdown.extensions"]`),st=f(`[data-field="core.ntpEnabled"]`),H=f(`[data-field="core.mode"]`),U=f(`[data-field="core.endpointUrl"]`),W=f(`[data-field="core.userId"]`),G=f(`[data-field="core.userKey"]`),K=f(`[data-field="core.ecosystemToken"]`),q=f(`[data-field="core.preferBackendSync"]`),J=f(`[data-field="core.encrypt"]`),Y=f(`[data-field="core.appClientId"]`),X=f(`[data-field="core.allowInsecureTls"]`),dt=f(`[data-field="core.ops.allowUnencrypted"]`),ft=f(`[data-field="core.admin.httpsOrigin"]`),pt=f(`[data-field="core.admin.httpOrigin"]`),mt=f(`[data-field="core.admin.path"]`),ht=f(`[data-field="core.useCoreIdentityForAirPad"]`),Z=f(`[data-field="core.socket.accessToken"]`),gt=f(`[data-field="core.socket.routeTarget"]`),_t=f(`[data-field="core.socket.clientAccessToken"]`),vt=f(`[data-field="core.socket.allowAccessTokenWithoutUserKey"]`),yt=f(`[data-field="shell.maintainHubSocketConnection"]`),bt=f(`[data-field="shell.clipboardBroadcastTargets"]`),xt=f(`[data-field="shell.pushLocalClipboardToLan"]`),St=f(`[data-field="shell.clipboardPushIntervalMs"]`),Ct=f(`[data-field="shell.enableRemoteClipboardBridge"]`),wt=f(`[data-field="shell.acceptInboundClipboardData"]`),Tt=f(`[data-field="shell.clipboardInboundAllowIds"]`),Et=f(`[data-field="shell.accessTokenBypassesClipboardAllowlist"]`),Dt=f(`[data-field="shell.clipboardShareDestinationIds"]`),Ot=f(`[data-field="shell.applyRemoteClipboardToDevice"]`),kt=f(`[data-field="shell.acceptContactsBridgeData"]`),At=f(`[data-field="shell.acceptSmsBridgeData"]`),jt=f(`[data-field="shell.enableNativeSms"]`),Mt=f(`[data-field="shell.enableNativeContacts"]`),Nt=o.querySelector(`[data-admin-preview]`),Q=o.querySelector(`[data-mcp-section]`),Pt=o.querySelector(`[data-section="extension"]`),Ft=o.querySelector(`[data-extension-tab]`);if(E){E.replaceChildren();let e=document.createElement(`option`);e.value=`auto`,e.textContent=`Auto-detect`,E.append(e);let t=document.createElement(`option`);t.value=`follow`,t.textContent=`Follow source/context`,E.append(t);for(let e of we()){let t=document.createElement(`option`);t.value=e,t.textContent=e===`ru`?`Russian`:e===`en`?`English`:e,E.append(t)}}if(k){k.replaceChildren();for(let e of Ce()){let t=document.createElement(`option`);t.value=e,t.textContent=xe(e),k.append(t)}}o.addEventListener(`input`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Rt()}),o.addEventListener(`change`,e=>{e.target?.matches?.(`[data-field^="core."]`)&&Rt()});let $=e=>{let t=Qe(l),n=e||t;o.querySelector(`[data-tab-panel="${n}"]`)||(n=o.querySelector(`[data-tab-panel]`)?.getAttribute(`data-tab-panel`)||t),o.querySelector(`[data-settings-tabs]`)?.setAttribute(`data-active-tab`,n);let r=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`);for(let e of Array.from(r)){let t=e,r=t.getAttribute(`data-tab`)===n;t.classList.toggle(`is-active`,r),t.setAttribute(`aria-selected`,String(r))}let i=o.querySelectorAll(`[data-tab-panel]`);for(let e of Array.from(i)){let t=e,r=t.getAttribute(`data-tab-panel`)===n;r?t.removeAttribute(`hidden`):t.hidden=!0,t.classList.toggle(`is-active`,r)}D(o)};for(let e of o.querySelectorAll(`[data-settings-tabs] button[type="button"][data-action="switch-settings-tab"][data-tab]`))e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),$(e.getAttribute(`data-tab`)||Qe(l))});let It=e=>{let t=Qe(l),n=(e||``).trim().toLowerCase();return n?n===`style`||n===`styles`||n===`styling`?d(`markdown`)?`markdown`:t:new Set([...d(`appearance`)?[`appearance`]:[],...d(`markdown`)?[`markdown`]:[],...d(`ai`)?[`ai`]:[],...d(`mcp`)?[`mcp`]:[],...d(`server`)?[`server`]:[],...d(`instructions`)?[`instructions`]:[],...d(`extension`)?[`extension`]:[],...ct(s)]).has(n)?n:t:t},Lt=()=>{let e=K?.value?.trim()||G?.value?.trim()||Z?.value?.trim()||``;return{mode:H?.value||`native`,endpointUrl:U?.value?.trim()||``,userId:W?.value?.trim()||``,ecosystemToken:e,userKey:e,encrypt:!!J?.checked,preferBackendSync:(q?.checked??!0)!==!1,appClientId:Y?.value?.trim()||``,allowInsecureTls:!!X?.checked,useCoreIdentityForAirPad:(ht?.checked??!0)!==!1,socket:{accessToken:e,routeTarget:gt?.value?.trim()||``,selfId:``,clientAccessToken:_t?.value?.trim()||``,allowAccessTokenWithoutUserKey:!!vt?.checked},admin:{httpsOrigin:ft?.value?.trim()||``,httpOrigin:pt?.value?.trim()||``,path:mt?.value?.trim()||`/`},ops:{allowUnencrypted:!!dt?.checked}}},Rt=()=>{if(!Nt)return;let e=h(Lt());Nt.textContent=`Resolved: ${e.https} · ${e.http}`},zt=e=>{try{ve(_e.EXPLORER_PATH,e),be(`explorer`),u({type:`content-explorer`,destination:`explorer`,data:{action:`view`,path:e},metadata:{source:`settings`}}),a(`Explorer: ${e}`)}catch(e){console.warn(`[Settings] Failed to open explorer path:`,e),a(`Failed to open Explorer path.`)}};if(Promise.resolve((async()=>((s.surface===`capacitor`||s.surface===`native`)&&await ne().catch(()=>null),te()))()).then(e=>{ae&&(ae.value=(e?.ai?.baseUrl||``).trim()),g&&(g.value=(e?.ai?.apiKey||``).trim());let n=(e?.ai?.model||`gpt-5.4`).trim(),r=(e?.ai?.customModel||``).trim();if(v){let e=p.includes(n);n===`custom`||!e&&n?(v.value=`custom`,y&&(y.value=r||n)):(v.value=e?n:`gpt-5.4`,y&&(y.value=r)),w()}if(b&&(b.value=e?.ai?.defaultReasoningEffort||`medium`),x&&(x.value=e?.ai?.defaultVerbosity||`medium`),ce&&(ce.value=String(e?.ai?.maxOutputTokens??4e5)),le&&(le.value=e?.ai?.contextTruncation||`disabled`),ue&&(ue.value=e?.ai?.promptCacheRetention||`in-memory`),S&&(S.value=String(e?.ai?.maxToolCalls??8)),de&&(de.checked=(e?.ai?.parallelToolCalls??!0)!==!1),fe&&(fe.value=String(e?.ai?.requestTimeout?.low??6e4)),pe&&(pe.value=String(e?.ai?.requestTimeout?.medium??3e5)),me&&(me.value=String(e?.ai?.requestTimeout?.high??9e5)),ge&&(ge.value=String(e?.ai?.maxRetries??2)),C&&(C.value=e?.ai?.shareTargetMode||`recognize`),T&&(T.checked=(e?.ai?.autoProcessShared??!0)!==!1),E&&(E.value=e?.ai?.responseLanguage||`auto`),O&&(O.checked=!!e?.ai?.translateResults),ye&&(ye.checked=!!e?.ai?.generateSvgGraphics),k&&(k.value=e?.speech?.language||`en-US`),A&&(A.value=e?.appearance?.theme||`auto`),Se&&(Se.value=e?.appearance?.fontSize||`medium`),Le&&(Le.value=e?.appearance?.markdown?.preset||`default`),P&&(P.value=e?.appearance?.markdown?.fontFamily||`system`),F&&(F.value=String(e?.appearance?.markdown?.fontSizePx??16)),Be&&(Be.value=String(e?.appearance?.markdown?.lineHeight??1.7)),Ve&&(Ve.value=String(e?.appearance?.markdown?.contentMaxWidthPx??860)),He&&(He.value=String(e?.appearance?.markdown?.printScale??1)),Ue&&(Ue.value=e?.appearance?.markdown?.page?.size||`auto`),We&&(We.value=e?.appearance?.markdown?.page?.orientation||`portrait`),I&&(I.value=String(e?.appearance?.markdown?.page?.marginMm??12)),Ge&&(Ge.checked=(e?.appearance?.markdown?.modules?.typography??!0)!==!1),Ke&&(Ke.checked=(e?.appearance?.markdown?.modules?.lists??!0)!==!1),L&&(L.checked=(e?.appearance?.markdown?.modules?.tables??!0)!==!1),R&&(R.checked=(e?.appearance?.markdown?.modules?.codeBlocks??!0)!==!1),z&&(z.checked=(e?.appearance?.markdown?.modules?.blockquotes??!0)!==!1),qe&&(qe.checked=(e?.appearance?.markdown?.modules?.media??!0)!==!1),Je&&(Je.checked=(e?.appearance?.markdown?.modules?.printBreaks??!0)!==!1),Xe&&(Xe.checked=!!e?.appearance?.markdown?.plugins?.smartTypography),et&&(et.checked=!!e?.appearance?.markdown?.plugins?.softBreaksAsBr),tt&&(tt.checked=(e?.appearance?.markdown?.plugins?.externalLinksNewTab??!0)!==!1),rt&&(rt.value=(e?.appearance?.markdown?.customCss||``).trim()),B&&(B.value=(e?.appearance?.markdown?.printCss||``).trim()),V){let t=Array.isArray(e?.appearance?.markdown?.extensions)?e.appearance?.markdown?.extensions:[];V.value=t.length>0?JSON.stringify(t,null,2):``}st&&(st.checked=!!e?.core?.ntpEnabled),H&&(H.value=e?.core?.mode||`native`),U&&(U.value=(e?.core?.endpointUrl||``).trim()),W&&(W.value=(e?.core?.userId||``).trim());{let t=String(e?.core?.ecosystemToken||``).trim()||String(e?.core?.userKey||``).trim()||String(e?.core?.socket?.accessToken||e?.core?.socket?.airpadAuthToken||``).trim();K&&(K.value=t),G&&(G.value=t),Z&&(Z.value=t)}if(q&&(q.checked=(e?.core?.preferBackendSync??!0)!==!1),J&&(J.checked=!!e?.core?.encrypt),Y&&(Y.value=(e?.core?.appClientId||``).trim()),ht&&(ht.checked=(e?.core?.useCoreIdentityForAirPad??!0)!==!1),gt&&(gt.value=(e?.core?.socket?.routeTarget||e?.core?.socket?.selfId||``).trim()),_t&&(_t.value=(e?.core?.socket?.clientAccessToken||``).trim()),vt&&(vt.checked=(e?.core?.socket?.allowAccessTokenWithoutUserKey??!1)===!0),X&&(X.checked=!!e?.core?.allowInsecureTls),dt&&(dt.checked=!!e?.core?.ops?.allowUnencrypted),ft&&(ft.value=(e?.core?.admin?.httpsOrigin||``).trim()),pt&&(pt.value=(e?.core?.admin?.httpOrigin||``).trim()),mt&&(mt.value=(e?.core?.admin?.path||`/`).trim()||`/`),yt&&(yt.checked=!!e?.shell?.maintainHubSocketConnection),bt&&(bt.value=(e?.shell?.clipboardBroadcastTargets||``).trim()),xt&&(xt.checked=!!e?.shell?.pushLocalClipboardToLan),St){let t=Number(e?.shell?.clipboardPushIntervalMs);St.value=String(Number.isFinite(t)&&t>=800?Math.min(Math.round(t),6e4):2e3)}Ct&&(Ct.checked=(e?.shell?.enableRemoteClipboardBridge??!0)!==!1),wt&&(wt.checked=(e?.shell?.acceptInboundClipboardData??!0)!==!1),Tt&&(Tt.value=(e?.shell?.clipboardInboundAllowIds||``).trim()),Et&&(Et.checked=(e?.shell?.accessTokenBypassesClipboardAllowlist??!1)===!0),Dt&&(Dt.value=(e?.shell?.clipboardShareDestinationIds||``).trim()),Ot&&(Ot.checked=(e?.shell?.applyRemoteClipboardToDevice??!0)!==!1),kt&&(kt.checked=(e?.shell?.acceptContactsBridgeData??!1)===!0),At&&(At.checked=(e?.shell?.acceptSmsBridgeData??!1)===!0),jt&&(jt.checked=(e?.shell?.enableNativeSms??!0)!==!1),Mt&&(Mt.checked=(e?.shell?.enableNativeContacts??!0)!==!1),Rt(),ke(Q,Array.isArray(e?.ai?.mcp)?e.ai.mcp:[]),ie(e),m(e),at(o,e,s),t.onTheme?.(e?.appearance?.theme||`auto`)}).catch(()=>{ke(Q,[])}),_?.addEventListener(`change`,()=>{!g||!_||(g.type=_.checked?`text`:`password`)}),A?.addEventListener(`change`,()=>{let e=A.value||`auto`;(async()=>{try{let t=await te();m({...t,appearance:{...t.appearance||{},theme:e}})}catch{m({appearance:{theme:e,fontSize:`medium`}})}t.onTheme?.(e)})()}),o.addEventListener(`click`,e=>{let n=Ee(e);if(n?.closest?.(`button[data-action="add-mcp-server"]`)&&Q){Q.querySelector(`.mcp-empty-note`)?.remove(),Q.appendChild(De({id:`mcp-${Date.now()}-${Math.random().toString(16).slice(2,8)}`,serverLabel:``,origin:``,clientKey:``,secretKey:``}));return}let r=n?.closest?.(`button[data-action="remove-mcp-server"]`);if(r){r.closest(`.mcp-row`)?.remove(),Q&&!Q.querySelector(`[data-mcp-id]`)&&ke(Q,[]);return}if(n?.closest?.(`button[data-action="open-user-styles"]`)){zt(`/user/styles/`);return}if(n?.closest?.(`button[data-action="open-assets-readonly"]`)){zt(`/assets/`);return}if(n?.closest?.(`button[data-action="open-admin-https"]`)){oe(Lt(),`https`);return}if(n?.closest?.(`button[data-action="open-admin-http"]`)){oe(Lt(),`http`);return}if(n?.closest?.(`button[data-action="copy-admin-https"]`)){let e=h(Lt());navigator.clipboard?.writeText?.(e.https).then(()=>a(`HTTPS admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="copy-admin-http"]`)){let e=h(Lt());navigator.clipboard?.writeText?.(e.http).then(()=>a(`HTTP admin URL copied.`),()=>a(`Copy failed.`));return}if(n?.closest?.(`button[data-action="open-native-app-settings"]`)){c(()=>import(`./clipboard-device-BmJIMpib.js`).then(e=>e.t).then(e=>e.openAppClipboardRelatedSettings()),__vite__mapDeps([8,1,2,3,4,5,6,9,0,7,10]),import.meta.url).then(()=>a(`App settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}if(n?.closest?.(`button[data-action="open-native-notification-settings"]`)){c(()=>import(`./clipboard-device-BmJIMpib.js`).then(e=>e.t).then(e=>e.openNativeNotificationSettings?.()),__vite__mapDeps([8,1,2,3,4,5,6,9,0,7,10]),import.meta.url).then(()=>a(`Notification settings opened (native shell only).`)).catch(()=>a(`Native settings unavailable in this context.`));return}n?.closest?.(`button[data-action="save"]`)&&(async()=>{a(`Saving…`,{tone:`warn`});let e=await te(),n=e.appearance?.markdown?.extensions||[],r=d(`markdown`)&&V?.value?.trim()||``;if(r)try{let e=JSON.parse(r);if(!Array.isArray(e))throw Error(`Markdown extensions JSON must be an array.`);n=e}catch(e){$(`markdown`),a(e?.message||`Invalid Markdown extensions JSON.`);return}let i={...e,ai:d(`ai`)?{baseUrl:ae?.value?.trim?.()||``,apiKey:g?.value?.trim?.()||``,model:v?.value||`gpt-5.4`,customModel:v?.value===`custom`&&y?.value?.trim?.()||``,defaultReasoningEffort:b?.value||`medium`,defaultVerbosity:x?.value||`medium`,maxOutputTokens:j(ce?.value,4e5),contextTruncation:le?.value||`disabled`,promptCacheRetention:ue?.value||`in-memory`,maxToolCalls:j(S?.value,8),parallelToolCalls:(de?.checked??!0)!==!1,requestTimeout:{low:j(fe?.value,6e4),medium:j(pe?.value,3e5),high:j(me?.value,9e5)},maxRetries:j(ge?.value,2),shareTargetMode:C?.value||`recognize`,autoProcessShared:(T?.checked??!0)!==!1,responseLanguage:E?.value||`auto`,translateResults:!!O?.checked,generateSvgGraphics:!!ye?.checked,mcp:d(`mcp`)?Oe(Q):e.ai?.mcp||[],customInstructions:e.ai?.customInstructions||[],activeInstructionId:e.ai?.activeInstructionId||``}:e.ai||{},speech:d(`ai`)?{language:k?.value||`en-US`}:e.speech||{},core:d(`server`)?{...e.core,ntpEnabled:N(st,!!e.core?.ntpEnabled),mode:M(H,e.core?.mode||`native`)||`native`,endpointUrl:M(U,e.core?.endpointUrl||``),userId:M(W,e.core?.userId||``),ecosystemToken:M(K,e.core?.ecosystemToken||e.core?.userKey||e.core?.socket?.accessToken||``)||M(G,e.core?.userKey||``)||M(Z,e.core?.socket?.accessToken||e.core?.socket?.airpadAuthToken||``),userKey:M(K,e.core?.ecosystemToken||e.core?.userKey||e.core?.socket?.accessToken||``)||M(G,e.core?.userKey||``)||M(Z,e.core?.socket?.accessToken||e.core?.socket?.airpadAuthToken||``),encrypt:N(J,!!e.core?.encrypt),preferBackendSync:N(q,(e.core?.preferBackendSync??!0)!==!1),appClientId:M(Y,e.core?.appClientId||``),allowInsecureTls:N(X,!!e.core?.allowInsecureTls),useCoreIdentityForAirPad:N(ht,(e.core?.useCoreIdentityForAirPad??!0)!==!1),socket:(()=>{let t={...e.core?.socket||{}};delete t.airpadAuthToken;let n=M(K,e.core?.ecosystemToken||e.core?.userKey||e.core?.socket?.accessToken||``)||M(G,e.core?.userKey||``)||M(Z,e.core?.socket?.accessToken||e.core?.socket?.airpadAuthToken||``);return{...t,accessToken:n,routeTarget:M(gt,e.core?.socket?.routeTarget||``),selfId:``,clientAccessToken:M(_t,e.core?.socket?.clientAccessToken||``),allowAccessTokenWithoutUserKey:N(vt,!!e.core?.socket?.allowAccessTokenWithoutUserKey)}})(),admin:{...e.core?.admin||{},httpsOrigin:M(ft,e.core?.admin?.httpsOrigin||``),httpOrigin:M(pt,e.core?.admin?.httpOrigin||``),path:M(mt,e.core?.admin?.path||`/`)||`/`},ops:{...e.core?.ops||{},allowUnencrypted:N(dt,!!e.core?.ops?.allowUnencrypted)}}:{...e.core||{}},shell:d(`server`)?{...e.shell||{},maintainHubSocketConnection:N(yt,!!e.shell?.maintainHubSocketConnection),clipboardBroadcastTargets:M(bt,e.shell?.clipboardBroadcastTargets||``),pushLocalClipboardToLan:N(xt,!!e.shell?.pushLocalClipboardToLan),clipboardPushIntervalMs:(()=>{let t=St?.value,n=j(t,e.shell?.clipboardPushIntervalMs??2e3);return Math.min(6e4,Math.max(800,Math.round(n)))})(),enableRemoteClipboardBridge:N(Ct,(e.shell?.enableRemoteClipboardBridge??!0)!==!1),acceptInboundClipboardData:N(wt,(e.shell?.acceptInboundClipboardData??!0)!==!1),clipboardInboundAllowIds:M(Tt,e.shell?.clipboardInboundAllowIds||``),accessTokenBypassesClipboardAllowlist:N(Et,!!e.shell?.accessTokenBypassesClipboardAllowlist),clipboardShareDestinationIds:M(Dt,e.shell?.clipboardShareDestinationIds||``),applyRemoteClipboardToDevice:N(Ot,(e.shell?.applyRemoteClipboardToDevice??!0)!==!1),acceptContactsBridgeData:N(kt,!!e.shell?.acceptContactsBridgeData),acceptSmsBridgeData:N(At,!!e.shell?.acceptSmsBridgeData),enableNativeSms:N(jt,(e.shell?.enableNativeSms??!0)!==!1),enableNativeContacts:N(Mt,(e.shell?.enableNativeContacts??!0)!==!1)}:{...e.shell||{}},appearance:d(`appearance`)||d(`markdown`)?{theme:A?.value||`auto`,fontSize:Se?.value||`medium`,markdown:{preset:Le?.value||`default`,fontFamily:P?.value||`system`,fontSizePx:j(F?.value,16),lineHeight:Te(Be?.value,1.7,1.1,2.2),contentMaxWidthPx:j(Ve?.value,860),printScale:Te(He?.value,1,.5,1.5),page:{size:Ue?.value||`auto`,orientation:We?.value||`portrait`,marginMm:j(I?.value,12)},modules:{typography:(Ge?.checked??!0)!==!1,lists:(Ke?.checked??!0)!==!1,tables:(L?.checked??!0)!==!1,codeBlocks:(R?.checked??!0)!==!1,blockquotes:(z?.checked??!0)!==!1,media:(qe?.checked??!0)!==!1,printBreaks:(Je?.checked??!0)!==!1},plugins:{smartTypography:!!Xe?.checked,softBreaksAsBr:!!et?.checked,externalLinksNewTab:(tt?.checked??!0)!==!1},customCss:rt?.value||``,printCss:B?.value||``,extensions:n||[]}}:e.appearance||{}};ot(o,i,s),await lt(i);let l=i,u=s.surface===`capacitor`||s.surface===`native`?ut(l).catch(e=>(console.warn(`[Settings] native permission flow failed:`,e),{lines:[],results:[]})):Promise.resolve({lines:[],results:[]}),f=await ee(l);if(!f){a(`Settings save returned no data.`,{tone:`err`});return}at(o,f,s);let p=re(),ne=await u,ie=ne.lines,oe=ne.results.some(e=>e.granted===!1);c(()=>import(`./hub-socket-boot-DJWpZMPd.js`).then(e=>e.n).then(e=>e.applyHubSocketFromSettings(f)),__vite__mapDeps([11,1,2,3,4,5,6,12,0,7,13,14]),import.meta.url),c(()=>import(`./websocket-C93q1MAF.js`).then(e=>e.h).then(e=>{typeof e.reconnectTransportAfterLifecycleResume==`function`&&e.reconnectTransportAfterLifecycleResume(`settings-save`)}),__vite__mapDeps([15,1,2,3,4,5,6,0,7,12,11,13,14,8,9,10]),import.meta.url).catch(()=>{}),m(f),t.onTheme?.(f.appearance?.theme||`auto`);let h=[`Saved locally`];p.nativeSynced===!0?h.push(`synced to Android`):p.nativeSynced===!1&&!oe?console.warn(`[Settings] native settings patch:`,p.nativeError||`not confirmed`):p.nativeSynced===!1&&h.push(`native sync failed${p.nativeError?`: ${p.nativeError}`:``}`),ie.length&&h.push(...ie);let _=`ok`;oe&&(_=`warn`),a(h.join(` · `),{tone:_})})().catch(e=>a(String(e),{tone:`err`}))}),t.isExtension){Pt&&(Pt.hidden=!1),Ft&&(Ft.hidden=!1);let t=e`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;o.append(t)}let Bt=It(t.initialTab);if($(Bt),!o.querySelector(`[data-tab-panel="${Bt}"]:not([hidden])`)){let e=o.querySelector(`[data-tab-panel]`);e&&$(e.getAttribute(`data-tab-panel`)||Bt)}w();let Vt=o.querySelectorAll(`[data-tab-panel]`).length,Ht=o.querySelectorAll(`[data-action="switch-settings-tab"][data-tab]`).length;try{globalThis.__CWSP_FRONTEND_DEBUG__?.log(`settings-view`,`info`,`mounted profile=${l} surface=${s.surface} tabs=${Ht} panels=${Vt} active=${o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)}`)}catch{}if(Vt===0){let e=document.createElement(`section`);e.className=`card settings-tab-panel`,e.setAttribute(`data-tab-panel`,`cwsp`),e.innerHTML=`<h3>CWSP</h3><p class="field-hint">Settings panels failed to mount. Check logcat tag CwspWebView or __CWSP_FRONTEND_DEBUG__.tail().</p>`,o.querySelector(`.settings-screen__body`)?.appendChild(e),$(`cwsp`)}return o.addEventListener(`cwsp-settings-resync`,()=>{D(o),$(o.querySelector(`[data-settings-tabs]`)?.getAttribute(`data-active-tab`)||Bt)}),o},J={appearance:{theme:`auto`,fontSize:`medium`},ai:{autoProcess:!0},general:{autosave:!0,notifications:!0}},Y=class{id=`settings`;name=`Settings`;icon=`gear`;options;shellContext;element=null;settings=t(J);_sheet=null;_shadowSheet=null;_styleEl=null;lifecycle={onUnmount:()=>{this.clearSettingsStylesheet()},onShow:()=>{this.applySettingsStylesheet(),this.element?.dispatchEvent(new CustomEvent(`cwsp-settings-resync`,{bubbles:!1}))},onHide:()=>{}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){return e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.loadSettings(),this.element=q({isExtension:globalThis.chrome!==void 0&&!!globalThis.chrome?.runtime?.id,initialTab:e?.params?.tab||e?.params?.focus,onTheme:e=>{this.options.onThemeChange?.(e)}}),queueMicrotask(()=>D(this.element)),this.element}getToolbar(){return null}setupEventHandlers(){}loadSettings(){this.settings.value={...J}}saveSettings(){this.options.onSettingsChange?.(this.settings.value)}resetSettings(){this.settings.value={...J},this.updateUI()}updateUI(){if(!this.element)return;let e=this.element.querySelectorAll(`[data-setting]`);for(let t of e){let[e,n]=t.dataset.setting.split(`.`),r=this.settings.value[e][n];t.type===`checkbox`?t.checked=!!r:t.value=r||``}}showMessage(e){this.shellContext?.showMessage(e)}applySettingsStylesheet(){D(this.element)}clearSettingsStylesheet(){try{if(this.element?.querySelector(`style[data-settings-view-css]`)?.remove(),this._styleEl&&=(this._styleEl.remove(),null),this._shadowSheet){let{sheet:e,root:t}=this._shadowSheet;t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e),this._shadowSheet=null}this._sheet&&=(n(this._sheet),null)}catch{}}canHandleMessage(e){return e===`settings-update`}async handleMessage(e){let t=e;t.data&&(this.settings.value={...this.settings.value,...t.data},this.updateUI())}invokeChannelApi(e,t){if(e===x.Patch||e===x.SettingsUpdate)return this.handleMessage({data:t}),(async()=>{try{let[{loadSettings:e},{applyTheme:n}]=await Promise.all([c(()=>import(`./Settings-CNCkDRrH.js`).then(e=>e.t),__vite__mapDeps([13,1,2,3,4,5,6,0,7,14]),import.meta.url),c(()=>import(`./Theme-a45HWoBO.js`).then(e=>e.t),__vite__mapDeps([16,1,2,3,4,5,6,17,13,0,7,14,18]),import.meta.url)]),r=await e(),i=t;n({...r,...i,appearance:{...r.appearance||{},...i.appearance||{}}})}catch(e){console.warn(`[SettingsView] channel applyTheme failed:`,e)}})(),!0}};function X(e){return new Y(e)}export{Y as SettingsView,at as applyContributions,We as clearSettingsSyncArms,ot as collectContributions,Ge as createMemorySettingsSyncArm,q as createSettingsView,X as createView,X as default,Ke as detectSettingsSurface,S as getSettingsContributions,qe as getSettingsDefaults,Je as getSettingsSnapshot,R as getSettingsSync,st as hydrateContributionsFromSync,I as mergeSettingsPatch,it as mountContributions,z as patchSettingsSync,H as persistContributionsViaSync,fe as registerAirpadSettingsContribution,he as registerBuiltinSettingsContributions,ce as registerCwspSettingsContribution,ue as registerDeviceSettingsContribution,pe as registerReaderSettingsContribution,ge as registerSettingsContribution,He as registerSettingsSyncArm,de as registerWorkcenterSettingsContribution,nt as resolveSettingsSurface,L as resolveSettingsSyncArm,Ve as setSurfaceDetector,Ue as unregisterSettingsSyncArm};