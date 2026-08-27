import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{O as t,j as n,t as r}from"./src-C7QuTtnr.js";import{t as i}from"./src-B4o_J9rd.js";import{a}from"./HistoryManager-B52KbQG4.js";import{a as o,n as s}from"./channel-actions-D5ksGgGK.js";import{a as c,d as l,f as u,i as d,l as f,m as p,n as m,o as h,p as g,r as _,s as v,t as y,u as b}from"./transfer-history-runtime-i7YDbI9L.js";var x;function S(){return(S=e((()=>{x=`/*
 * Filename: history.scss
 * FullPath: modules/views/history-view/src/scss/history.scss
 * Change date and time: 09.55.00_31.07.2026
 * Reason for changes: Isolate History under \`.view-history\` only — no html/body.
 *   WHY: \`@scope\` + \`contain\` broke Neutralino WebView hit-testing (whole UI
 *   unclickable after opening History). Prefer classic BEM scoping.
 *
 * INVARIANT: never style document \`html\` / \`body\` / \`:root\` from this sheet.
 *
 * NOTE: \`--vh-*\` are a view-specific semantic layer DERIVED from canonical \`--color-*\`
 * (source of truth: veela \`core/misc/_tokens.scss\`). Keep \`light-dark()\` fallbacks for
 * shadow-DOM self-sufficiency.
 */
@layer view.history {
  /* Theme pins — view root only. */
  :is(html[data-theme=light] .view-history, :host-context(html[data-theme=light]) .view-history) {
    color-scheme: light;
  }
  :is(html[data-theme=dark] .view-history, :host-context(html[data-theme=dark]) .view-history) {
    color-scheme: dark;
  }
  .view-history {
    color-scheme: inherit;
    /* ── semantic tokens: simple defaults owned by veela \`core/misc/_tokens.scss\`
     * (\`--vh-bg/fg/muted/primary/danger/on-primary/item-bg\`). Only the complex
     * derived tokens (depending on \`--vh-fg\` / \`--vh-item-bg\`) stay local.
     * Use sites carry \`var(--vh-*, light-dark(...))\` fallbacks for shadow-DOM
     * self-sufficiency when veela is not loaded.
     */
    --vh-item-border: color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 10%, transparent);
    --vh-item-preview-bg: color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 6%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    --vh-elev: 0 1px 0 color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 4%, transparent);
    display: flex;
    flex-direction: column;
    block-size: 100%;
    min-block-size: 0;
    padding: 1.5rem;
    background-color: var(--vh-bg, light-dark(#eef1f6, #0f1318));
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
    color: contrast-color(var(--vh-bg, light-dark(#eef1f6, #0f1318)));
    box-sizing: border-box;
    pointer-events: auto;
    position: relative;
    z-index: 0;
  }
  .view-history *,
  .view-history *::before,
  .view-history *::after {
    box-sizing: border-box;
  }
  .view-history__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 1.5rem;
  }
  .view-history__header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
  }
  .view-history__clear-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.85rem;
    border: 1px solid color-mix(in oklab, var(--vh-danger, #d32f2f) 45%, transparent);
    border-radius: 6px;
    background-color: color-mix(in oklab, var(--vh-danger, #d32f2f) 12%, var(--vh-bg, light-dark(#eef1f6, #0f1318)));
    color: contrast-color(color-mix(in oklab, var(--vh-danger, #d32f2f) 12%, var(--vh-bg, light-dark(#eef1f6, #0f1318))));
    color: light-dark(#b71c1c, #ff8a80);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    pointer-events: auto;
  }
  .view-history__clear-btn:hover {
    background-color: color-mix(in oklab, var(--vh-danger, #d32f2f) 22%, var(--vh-bg, light-dark(#eef1f6, #0f1318)));
    border-color: var(--vh-danger, #d32f2f);
    color: contrast-color(color-mix(in oklab, var(--vh-danger, #d32f2f) 22%, var(--vh-bg, light-dark(#eef1f6, #0f1318))));
  }
  .view-history__list {
    flex: 1;
    min-block-size: 0;
    overflow-y: auto;
    pointer-events: auto;
  }
  .view-history__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    block-size: 100%;
    color: var(--vh-muted, light-dark(#5c6570, #a8b0bc));
  }
  .view-history__empty p {
    margin: 0;
    font-size: 1rem;
  }
  .view-history__hint {
    margin: 0 0 1rem;
    font-size: 0.8125rem;
    color: var(--vh-muted, light-dark(#5c6570, #a8b0bc));
  }
  .view-history__item {
    padding: 1rem;
    margin-block-end: 0.75rem;
    border-radius: 10px;
    background-color: var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12));
    border: 1px solid var(--vh-item-border);
    border-inline-start: 3px solid var(--vh-primary, #007acc);
    box-shadow: var(--vh-elev);
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
    color: contrast-color(var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    transition: opacity 0.2s ease, border-color 0.15s ease;
    pointer-events: auto;
  }
  .view-history__item.error, .view-history__item[data-status=error] {
    border-inline-start-color: var(--vh-danger, #d32f2f);
  }
  .view-history__item.is-muted, .view-history__item[data-status=expired], .view-history__item[data-status=declined] {
    opacity: 0.55;
    border-inline-start-color: color-mix(in oklab, var(--vh-muted, light-dark(#5c6570, #a8b0bc)) 70%, transparent);
  }
  .view-history__item-sub {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--vh-muted, light-dark(#5c6570, #a8b0bc));
  }
  .view-history__kind-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.12rem 0.45rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background: color-mix(in oklab, var(--vh-primary, #007acc) 16%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    color: light-dark(#0b5f8a, #9fd3f5);
    border: 1px solid color-mix(in oklab, var(--vh-primary, #007acc) 28%, transparent);
  }
  .view-history__kind-chip[data-kind=clipboard-image] {
    background: color-mix(in oklab, #7b1fa2 14%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    border-color: color-mix(in oklab, #7b1fa2 35%, transparent);
    color: light-dark(#6a1b9a, #e1bee7);
  }
  .view-history__kind-chip[data-kind=files] {
    background: color-mix(in oklab, #2e7d32 14%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    border-color: color-mix(in oklab, #2e7d32 35%, transparent);
    color: light-dark(#1b5e20, #a5d6a7);
  }
  .view-history__item.is-image {
    border-inline-start-color: #9c27b0;
  }
  .view-history__media {
    display: grid;
    grid-template-columns: 5.5rem minmax(0, 1fr);
    gap: 0.85rem;
    align-items: center;
    margin-block-start: 0.15rem;
  }
  .view-history__thumb {
    display: block;
    inline-size: 5.5rem;
    block-size: 5.5rem;
    object-fit: cover;
    border-radius: 10px;
    background: color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 6%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    border: 1px solid color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 12%, transparent);
  }
  .view-history__thumb--placeholder {
    display: grid;
    place-items: center;
    color: var(--vh-muted, light-dark(#5c6570, #a8b0bc));
    font-size: 1.5rem;
    background: color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 8%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
  }
  .view-history__media-meta {
    min-inline-size: 0;
  }
  .view-history__media-meta .view-history__item-desc {
    margin: 0;
  }
  @media (max-width: 420px) {
    .view-history__media {
      grid-template-columns: 4.5rem minmax(0, 1fr);
      gap: 0.65rem;
    }
    .view-history__thumb {
      inline-size: 4.5rem;
      block-size: 4.5rem;
    }
  }
  .view-history__item-preview {
    margin: 0.5rem 0 0;
    padding: 0.5rem;
    max-block-size: 6rem;
    overflow: auto;
    font: 0.75rem/1.35 ui-monospace, monospace;
    white-space: pre-wrap;
    border-radius: 6px;
    background: var(--vh-item-preview-bg);
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
    border: 1px solid color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 8%, transparent);
  }
  .view-history__progress {
    margin-block-start: 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .view-history__progress progress {
    inline-size: 100%;
    block-size: 0.45rem;
  }
  .view-history__progress-meta {
    font-size: 0.7rem;
    color: var(--vh-muted, light-dark(#5c6570, #a8b0bc));
  }
  .view-history__item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 0.5rem;
  }
  .view-history__item-action {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
  }
  .view-history__item-time {
    font-size: 0.75rem;
    color: var(--vh-muted, light-dark(#5c6570, #a8b0bc));
  }
  .view-history__item-desc {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
    opacity: 0.92;
  }
  .view-history__item-error {
    margin: 0.5rem 0 0 0;
    font-size: 0.8125rem;
    color: light-dark(#b71c1c, #ff8a80);
  }
  .view-history__item-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-block-start: 0.75rem;
  }
  .view-history__action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-block-size: 2rem;
    padding: 0.4rem 0.85rem;
    border: 1px solid color-mix(in oklab, var(--vh-primary, #007acc) 40%, transparent);
    border-radius: 6px;
    background-color: color-mix(in oklab, var(--vh-primary, #007acc) 14%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    color: contrast-color(color-mix(in oklab, var(--vh-primary, #007acc) 14%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12))));
    color: light-dark(#0b5f8a, #7ec8f0);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    pointer-events: auto;
  }
  .view-history__action-btn:hover {
    background-color: color-mix(in oklab, var(--vh-primary, #007acc) 24%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    border-color: color-mix(in oklab, var(--vh-primary, #007acc) 60%, transparent);
    color: contrast-color(color-mix(in oklab, var(--vh-primary, #007acc) 24%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12))));
  }
  .view-history__action-btn:disabled {
    opacity: 0.55;
    cursor: default;
  }
  .view-history__action-btn[data-action=accept], .view-history__action-btn[data-action=reveal], .view-history__action-btn[data-action=download], .view-history__action-btn[data-action=open] {
    background-color: var(--vh-primary, #007acc);
    border-color: var(--vh-primary, #007acc);
    color: var(--vh-on-primary, #ffffff);
    color: contrast-color(var(--vh-primary, #007acc));
  }
  .view-history__action-btn[data-action=remove], .view-history__action-btn[data-action=decline], .view-history__action-btn[data-action=cancel] {
    background-color: color-mix(in oklab, var(--vh-danger, #d32f2f) 14%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    border-color: color-mix(in oklab, var(--vh-danger, #d32f2f) 45%, transparent);
    color: light-dark(#b71c1c, #ff8a80);
    color: contrast-color(color-mix(in oklab, var(--vh-danger, #d32f2f) 14%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12))));
  }
  .view-history__action-btn[data-action=dismiss] {
    background-color: color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 8%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));
    border-color: color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 18%, transparent);
    color: var(--vh-fg, light-dark(#12151a, #e8edf2));
    color: contrast-color(color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 8%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12))));
  }
  .view-history__item.is-muted .view-history__action-btn,
  .view-history__item[data-status=expired] .view-history__action-btn,
  .view-history__item[data-status=declined] .view-history__action-btn {
    opacity: 1;
  }
}`})))()}function C(e,t){let n=t?.kind===`clipboard-image`;switch(e){case`accept`:return`Accept`;case`dismiss`:return`Dismiss`;case`decline`:return`Decline`;case`open`:return`Open`;case`download`:return n?`Save`:`Download`;case`cancel`:return`Cancel`;case`reveal`:return n?`Show in folder`:`Open folder`;case`share`:return`Share again`;case`remove`:return`Remove`;default:return String(e)}}function w(e){return new T(e)}var T,E;function D(){return(D=e((()=>{i(),r(),o(),u(),d(),S(),T=class{id=`history`;name=`History`;icon=`clock-counter-clockwise`;options;shellContext;element=null;entries=[];unsub=null;_sheet=null;visible=!1;listRaf=0;lastListSig=``;lastStructSig=``;lifecycle={onUnmount:()=>{this.teardown()},onShow:()=>{this.visible=!0,this._sheet??=t(x),this.ensureRuntime(),this.bindStore(),this.refreshFromStore(),this.scheduleUpdateList(!0),requestAnimationFrame(()=>{this.visible&&c(!0)})},onHide:()=>{this.visible=!1,c(!1),this.listRaf&&=(cancelAnimationFrame(this.listRaf),0),this.teardownSheet()}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){return e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.ensureRuntime(),this.bindStore(),this.refreshFromStore(),this.visible=!0,this.element=a`
            <div class="view-history" data-view="history">
                <div class="view-history__header">
                    <h1>History</h1>
                    <button class="view-history__clear-btn" data-action="clear" type="button">
                        <span aria-hidden="true">⌫</span>
                        <span>Clear</span>
                    </button>
                </div>
                <p class="view-history__hint">
                    Clipboard &amp; file transfers — active, done, and expired (max 100).
                </p>
                <div class="view-history__list" data-history-list></div>
            </div>
        `,this.setupEventHandlers(),this.updateList(!0),requestAnimationFrame(()=>{this.visible&&c(!0)}),this.element}getToolbar(){return null}ensureRuntime(){let e=globalThis;e.__CWS_NEUTRALINO_BOOT__&&v(),e.Capacitor&&h(),m()}bindStore(){this.unsub||=m().subscribe(e=>{this.entries=e,this.scheduleUpdateList(!1)})}refreshFromStore(){this.entries=m().list()}teardown(){this.visible=!1,c(!1),this.listRaf&&=(cancelAnimationFrame(this.listRaf),0);try{this.unsub?.()}catch{}this.unsub=null,this.teardownSheet(),this.element=null,this.lastListSig=``,this.lastStructSig=``}teardownSheet(){try{this._sheet&&n(this._sheet)}catch{}this._sheet=null}renderEntries(){let e=document.createDocumentFragment();if(this.entries.length===0)return e.appendChild(a`
                <div class="view-history__empty">
                    <span aria-hidden="true" style="font-size:2.5rem;opacity:.45">⏱</span>
                    <p>No transfers yet</p>
                </div>
            `),e;for(let t of this.entries){let n=g(t.status,t.kind)?` is-muted`:``,r=f(t),i=t.kind===`files`&&(t.status===`progress`||typeof t.bytesDone==`number`&&typeof t.totalBytes==`number`&&(t.totalBytes||0)>0&&t.status!==`expired`),o=p(t),s=Math.round(o*100),c=l(t.speedBps),u=t.kind===`files`?`Files`:t.kind===`clipboard-image`?`Image`:`Clipboard`,d=t.kind===`clipboard-image`,m=d?_(t):``,h=!!m,v=b(t.totalBytes),y=``;if(r.length>0){let e=document.createElement(`div`);e.className=`view-history__item-actions`;for(let n of r){let r=a`<button class="view-history__action-btn" type="button"
                        data-action="${n}" data-id="${t.id}">
                        ${C(n,t)}
                    </button>`;r&&e.appendChild(r)}y=e}let x=i?a`
                <div class="view-history__progress">
                    <progress max="100" value="${s}"></progress>
                    <span class="view-history__progress-meta">${s}% · ${c}${t.etaMs!=null&&t.etaMs>0?` · ~${Math.ceil(t.etaMs/1e3)}s`:``}</span>
                </div>
            `:``,S=d?a`
                <div class="view-history__media">
                    ${h?a`<img class="view-history__thumb" src="${m}" alt="" loading="lazy" decoding="async" />`:a`
                        <div class="view-history__thumb view-history__thumb--placeholder" aria-hidden="true">🖼</div>
                    `}
                    <div class="view-history__media-meta">
                        <p class="view-history__item-desc">${t.title}</p>
                        ${t.subtitle?a`<p class="view-history__item-sub">${t.subtitle}</p>`:v?a`<p class="view-history__item-sub">${v}</p>`:``}
                        ${h?``:a`<p class="view-history__item-sub">Preview unavailable — Accept uses retained file when present</p>`}
                    </div>
                </div>
            `:a`
                <p class="view-history__item-desc">${t.title}</p>
                ${t.subtitle?a`<p class="view-history__item-sub">${t.subtitle}</p>`:``}
                ${t.textPreview?a`<pre class="view-history__item-preview">${t.textPreview}</pre>`:``}
            `,w=a`
                <div class="view-history__item${n}${d?` is-image`:``}" data-entry="${t.id}" data-status="${t.status}" data-kind="${t.kind}">
                    <div class="view-history__item-header">
                        <span class="view-history__item-action">
                            <span class="view-history__kind-chip" data-kind="${t.kind}">${u}</span>
                            · ${t.direction} · ${t.status}
                        </span>
                        <span class="view-history__item-time">${this.formatTime(t.lastActionAt||t.ts)}${t.lastActionAt&&t.lastActionAt!==t.ts?` · arrived ${this.formatTime(t.ts)}`:``}</span>
                    </div>
                    ${S}
                    ${x}
                    ${t.error?a`<p class="view-history__item-error">${t.error}</p>`:``}
                    ${y}
                </div>
            `;e.appendChild(w)}return e}setupEventHandlers(){this.element&&this.element.addEventListener(`click`,e=>{this.onClick(e)})}async onClick(e){let t=e.target.closest(`[data-action]`);if(!t)return;let n=t.dataset.action,r=t.dataset.id;if(n===`clear`){m().clear(),this.shellContext?.showMessage?.(`History cleared`);return}if(!n||!r)return;let i=this.entries.find(e=>e.id===r);if(i){t.disabled=!0;try{let e=await y(i,n);this.shellContext?.showMessage?.(e?`${C(n)} OK`:`Action failed`)}finally{t.disabled=!1}}}listSignature(e){let t=String(e.length);for(let n of e)t+=`|${n.id}:${n.status}:${n.bytesDone??``}:${n.speedBps??``}:${n.lastActionAt??n.ts}`;return t}structureSignature(e){let t=String(e.length);for(let n of e){let e=n.thumbDataUrl?n.thumbDataUrl.length:+!!n.localFilePath;t+=`|${n.id}:${n.status}:${n.kind}:${n.title}:${n.error??``}:${e}`}return t}scheduleUpdateList(e){if(!(!this.visible||!this.element)){if(e){this.listRaf&&=(cancelAnimationFrame(this.listRaf),0),this.updateList(!0);return}this.listRaf||=requestAnimationFrame(()=>{this.listRaf=0,this.updateList(!1)})}}patchProgressOnly(){if(this.element)for(let e of this.entries){let t=String(e.id).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`),n=this.element.querySelector(`[data-entry="${t}"]`);if(!n)continue;let r=p(e),i=Math.round(r*100),a=l(e.speedBps),o=n.querySelector(`progress`),s=n.querySelector(`.view-history__progress-meta`);o&&(o.max=100,o.value=i),s&&(s.textContent=`${i}% · ${a}${e.etaMs!=null&&e.etaMs>0?` · ~${Math.ceil(e.etaMs/1e3)}s`:``}`),n.dataset.status=e.status}}updateList(e=!1){if(!this.visible)return;let t=this.element?.querySelector(`[data-history-list]`);if(!t)return;let n=this.listSignature(this.entries);if(!e&&n===this.lastListSig)return;let r=this.structureSignature(this.entries);if(!e&&r===this.lastStructSig&&t.childElementCount>0){this.patchProgressOnly(),this.lastListSig=n;return}this.lastListSig=n,this.lastStructSig=r,t.replaceChildren(),t.appendChild(this.renderEntries())}formatTime(e){let t=new Date(e),n=new Date;return t.toDateString()===n.toDateString()?t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}):t.toLocaleDateString([],{month:`short`,day:`numeric`})+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}reloadHistory(){this.refreshFromStore(),this.scheduleUpdateList(!0)}invokeChannelApi(e,t){if(e===s.Reload||e===s.Refresh)return this.reloadHistory(),!0}canHandleMessage(){return!1}async handleMessage(){}},E=w})))()}D();export{T as HistoryView,E as createHistoryView,w as createView,w as default};