import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Mt as t,a as n,ft as r,kt as i}from"./HistoryManager-D8ebz2Z7.js";import{t as a}from"./src-fiZCSwG5.js";import{a as o,n as s}from"./channel-actions-DC9DgSYV.js";import{a as c,dispatchHistoryAction as l,getTransferHistoryStore as u,historyImageSrc as d,i as f,n as p,o as m,r as h,s as g,setTransferHistoryUiActive as _,startCapacitorTransferHistory as v,startNeutralinoTransferHistory as y,t as b}from"./transfer-history-runtime-BN40YXfL.js";var x,S=e((()=>{x=`/*
 * Filename: history.scss
 * FullPath: modules/views/history-view/src/scss/history.scss
 * Change date and time: 09.55.00_31.07.2026
 * Reason for changes: Isolate History under \`.view-history\` only — no html/body.
 *   WHY: \`@scope\` + \`contain\` broke Neutralino WebView hit-testing (whole UI
 *   unclickable after opening History). Prefer classic BEM scoping.
 *
 * INVARIANT: never style document \`html\` / \`body\` / \`:root\` from this sheet.
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
    --vh-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));
    --vh-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --vh-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --vh-primary: var(--color-primary, #007acc);
    --vh-danger: var(--color-error, #d32f2f);
    --vh-on-primary: var(--color-on-primary, #ffffff);
    --vh-item-bg: var(
        --color-surface-container-low,
        light-dark(#e0e5ee, #0a0d12)
    );
    --vh-item-border: color-mix(in oklab, var(--vh-fg) 10%, transparent);
    --vh-item-preview-bg: color-mix(in oklab, var(--vh-fg) 6%, var(--vh-item-bg));
    --vh-elev: 0 1px 0 color-mix(in oklab, var(--vh-fg) 4%, transparent);
    display: flex;
    flex-direction: column;
    block-size: 100%;
    min-block-size: 0;
    padding: 1.5rem;
    background-color: var(--vh-bg);
    color: var(--vh-fg);
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
    color: var(--vh-fg);
  }
  .view-history__clear-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.85rem;
    border: 1px solid color-mix(in oklab, var(--vh-danger) 45%, transparent);
    border-radius: 6px;
    background-color: color-mix(in oklab, var(--vh-danger) 12%, var(--vh-bg));
    color: light-dark(#b71c1c, #ff8a80);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    pointer-events: auto;
  }
  .view-history__clear-btn:hover {
    background-color: color-mix(in oklab, var(--vh-danger) 22%, var(--vh-bg));
    border-color: var(--vh-danger);
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
    color: var(--vh-muted);
  }
  .view-history__empty p {
    margin: 0;
    font-size: 1rem;
  }
  .view-history__hint {
    margin: 0 0 1rem;
    font-size: 0.8125rem;
    color: var(--vh-muted);
  }
  .view-history__item {
    padding: 1rem;
    margin-block-end: 0.75rem;
    border-radius: 10px;
    background-color: var(--vh-item-bg);
    border: 1px solid var(--vh-item-border);
    border-inline-start: 3px solid var(--vh-primary);
    box-shadow: var(--vh-elev);
    color: var(--vh-fg);
    transition: opacity 0.2s ease, border-color 0.15s ease;
    pointer-events: auto;
  }
  .view-history__item.error, .view-history__item[data-status=error] {
    border-inline-start-color: var(--vh-danger);
  }
  .view-history__item.is-muted, .view-history__item[data-status=expired], .view-history__item[data-status=declined] {
    opacity: 0.55;
    border-inline-start-color: color-mix(in oklab, var(--vh-muted) 70%, transparent);
  }
  .view-history__item-sub {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--vh-muted);
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
    background: color-mix(in oklab, var(--vh-primary) 16%, var(--vh-item-bg));
    color: light-dark(#0b5f8a, #9fd3f5);
    border: 1px solid color-mix(in oklab, var(--vh-primary) 28%, transparent);
  }
  .view-history__kind-chip[data-kind=clipboard-image] {
    background: color-mix(in oklab, #7b1fa2 14%, var(--vh-item-bg));
    border-color: color-mix(in oklab, #7b1fa2 35%, transparent);
    color: light-dark(#6a1b9a, #e1bee7);
  }
  .view-history__kind-chip[data-kind=files] {
    background: color-mix(in oklab, #2e7d32 14%, var(--vh-item-bg));
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
    background: color-mix(in oklab, var(--vh-fg) 6%, var(--vh-item-bg));
    border: 1px solid color-mix(in oklab, var(--vh-fg) 12%, transparent);
  }
  .view-history__thumb--placeholder {
    display: grid;
    place-items: center;
    color: var(--vh-muted);
    font-size: 1.5rem;
    background: color-mix(in oklab, var(--vh-fg) 8%, var(--vh-item-bg));
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
    color: var(--vh-fg);
    border: 1px solid color-mix(in oklab, var(--vh-fg) 8%, transparent);
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
    color: var(--vh-muted);
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
    color: var(--vh-fg);
  }
  .view-history__item-time {
    font-size: 0.75rem;
    color: var(--vh-muted);
  }
  .view-history__item-desc {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vh-fg);
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
    border: 1px solid color-mix(in oklab, var(--vh-primary) 40%, transparent);
    border-radius: 6px;
    background-color: color-mix(in oklab, var(--vh-primary) 14%, var(--vh-item-bg));
    color: light-dark(#0b5f8a, #7ec8f0);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    pointer-events: auto;
  }
  .view-history__action-btn:hover {
    background-color: color-mix(in oklab, var(--vh-primary) 24%, var(--vh-item-bg));
    border-color: color-mix(in oklab, var(--vh-primary) 60%, transparent);
  }
  .view-history__action-btn:disabled {
    opacity: 0.55;
    cursor: default;
  }
  .view-history__action-btn[data-action=accept], .view-history__action-btn[data-action=reveal], .view-history__action-btn[data-action=download], .view-history__action-btn[data-action=open] {
    background-color: var(--vh-primary);
    border-color: var(--vh-primary);
    color: var(--vh-on-primary);
  }
  .view-history__action-btn[data-action=remove], .view-history__action-btn[data-action=decline], .view-history__action-btn[data-action=cancel] {
    background-color: color-mix(in oklab, var(--vh-danger) 14%, var(--vh-item-bg));
    border-color: color-mix(in oklab, var(--vh-danger) 45%, transparent);
    color: light-dark(#b71c1c, #ff8a80);
  }
  .view-history__action-btn[data-action=dismiss] {
    background-color: color-mix(in oklab, var(--vh-fg) 8%, var(--vh-item-bg));
    border-color: color-mix(in oklab, var(--vh-fg) 18%, transparent);
    color: var(--vh-fg);
  }
  .view-history__item.is-muted .view-history__action-btn,
  .view-history__item[data-status=expired] .view-history__action-btn,
  .view-history__item[data-status=declined] .view-history__action-btn {
    opacity: 1;
  }
}`}));function C(e,t){let n=t?.kind===`clipboard-image`;switch(e){case`accept`:return`Accept`;case`dismiss`:return`Dismiss`;case`decline`:return`Decline`;case`open`:return`Open`;case`download`:return n?`Save`:`Download`;case`cancel`:return`Cancel`;case`reveal`:return n?`Show in folder`:`Open folder`;case`share`:return`Share again`;case`remove`:return`Remove`;default:return String(e)}}function w(e){return new T(e)}var T,E;e((()=>{a(),r(),o(),c(),b(),S(),T=class{id=`history`;name=`History`;icon=`clock-counter-clockwise`;options;shellContext;element=null;entries=[];unsub=null;_sheet=null;visible=!1;listRaf=0;lastListSig=``;lastStructSig=``;lifecycle={onUnmount:()=>{this.teardown()},onShow:()=>{this.visible=!0,this._sheet??=i(x),this.ensureRuntime(),this.bindStore(),this.refreshFromStore(),this.scheduleUpdateList(!0),requestAnimationFrame(()=>{this.visible&&_(!0)})},onHide:()=>{this.visible=!1,_(!1),this.listRaf&&=(cancelAnimationFrame(this.listRaf),0),this.teardownSheet()}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){return e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.ensureRuntime(),this.bindStore(),this.refreshFromStore(),this.visible=!0,this.element=n`
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
        `,this.setupEventHandlers(),this.updateList(!0),requestAnimationFrame(()=>{this.visible&&_(!0)}),this.element}getToolbar(){return null}ensureRuntime(){let e=globalThis;e.__CWS_NEUTRALINO_BOOT__&&y(),e.Capacitor&&v(),u()}bindStore(){this.unsub||=u().subscribe(e=>{this.entries=e,this.scheduleUpdateList(!1)})}refreshFromStore(){this.entries=u().list()}teardown(){this.visible=!1,_(!1),this.listRaf&&=(cancelAnimationFrame(this.listRaf),0);try{this.unsub?.()}catch{}this.unsub=null,this.teardownSheet(),this.element=null,this.lastListSig=``,this.lastStructSig=``}teardownSheet(){try{this._sheet&&t(this._sheet)}catch{}this._sheet=null}renderEntries(){let e=document.createDocumentFragment();if(this.entries.length===0)return e.appendChild(n`
                <div class="view-history__empty">
                    <span aria-hidden="true" style="font-size:2.5rem;opacity:.45">⏱</span>
                    <p>No transfers yet</p>
                </div>
            `),e;for(let t of this.entries){let r=m(t.status,t.kind)?` is-muted`:``,i=p(t),a=t.kind===`files`&&(t.status===`progress`||typeof t.bytesDone==`number`&&typeof t.totalBytes==`number`&&(t.totalBytes||0)>0&&t.status!==`expired`),o=g(t),s=Math.round(o*100),c=f(t.speedBps),l=t.kind===`files`?`Files`:t.kind===`clipboard-image`?`Image`:`Clipboard`,u=t.kind===`clipboard-image`,_=u?d(t):``,v=!!_,y=h(t.totalBytes),b=``;if(i.length>0){let e=document.createElement(`div`);e.className=`view-history__item-actions`;for(let r of i){let i=n`<button class="view-history__action-btn" type="button"
                        data-action="${r}" data-id="${t.id}">
                        ${C(r,t)}
                    </button>`;i&&e.appendChild(i)}b=e}let x=a?n`
                <div class="view-history__progress">
                    <progress max="100" value="${s}"></progress>
                    <span class="view-history__progress-meta">${s}% · ${c}${t.etaMs!=null&&t.etaMs>0?` · ~${Math.ceil(t.etaMs/1e3)}s`:``}</span>
                </div>
            `:``,S=u?n`
                <div class="view-history__media">
                    ${v?n`<img class="view-history__thumb" src="${_}" alt="" loading="lazy" decoding="async" />`:n`
                        <div class="view-history__thumb view-history__thumb--placeholder" aria-hidden="true">🖼</div>
                    `}
                    <div class="view-history__media-meta">
                        <p class="view-history__item-desc">${t.title}</p>
                        ${t.subtitle?n`<p class="view-history__item-sub">${t.subtitle}</p>`:y?n`<p class="view-history__item-sub">${y}</p>`:``}
                        ${v?``:n`<p class="view-history__item-sub">Preview unavailable — Accept uses retained file when present</p>`}
                    </div>
                </div>
            `:n`
                <p class="view-history__item-desc">${t.title}</p>
                ${t.subtitle?n`<p class="view-history__item-sub">${t.subtitle}</p>`:``}
                ${t.textPreview?n`<pre class="view-history__item-preview">${t.textPreview}</pre>`:``}
            `,w=n`
                <div class="view-history__item${r}${u?` is-image`:``}" data-entry="${t.id}" data-status="${t.status}" data-kind="${t.kind}">
                    <div class="view-history__item-header">
                        <span class="view-history__item-action">
                            <span class="view-history__kind-chip" data-kind="${t.kind}">${l}</span>
                            · ${t.direction} · ${t.status}
                        </span>
                        <span class="view-history__item-time">${this.formatTime(t.lastActionAt||t.ts)}${t.lastActionAt&&t.lastActionAt!==t.ts?` · arrived ${this.formatTime(t.ts)}`:``}</span>
                    </div>
                    ${S}
                    ${x}
                    ${t.error?n`<p class="view-history__item-error">${t.error}</p>`:``}
                    ${b}
                </div>
            `;e.appendChild(w)}return e}setupEventHandlers(){this.element&&this.element.addEventListener(`click`,e=>{this.onClick(e)})}async onClick(e){let t=e.target.closest(`[data-action]`);if(!t)return;let n=t.dataset.action,r=t.dataset.id;if(n===`clear`){u().clear(),this.shellContext?.showMessage?.(`History cleared`);return}if(!n||!r)return;let i=this.entries.find(e=>e.id===r);if(i){t.disabled=!0;try{let e=await l(i,n);this.shellContext?.showMessage?.(e?`${C(n)} OK`:`Action failed`)}finally{t.disabled=!1}}}listSignature(e){let t=String(e.length);for(let n of e)t+=`|${n.id}:${n.status}:${n.bytesDone??``}:${n.speedBps??``}:${n.lastActionAt??n.ts}`;return t}structureSignature(e){let t=String(e.length);for(let n of e){let e=n.thumbDataUrl?n.thumbDataUrl.length:+!!n.localFilePath;t+=`|${n.id}:${n.status}:${n.kind}:${n.title}:${n.error??``}:${e}`}return t}scheduleUpdateList(e){if(!(!this.visible||!this.element)){if(e){this.listRaf&&=(cancelAnimationFrame(this.listRaf),0),this.updateList(!0);return}this.listRaf||=requestAnimationFrame(()=>{this.listRaf=0,this.updateList(!1)})}}patchProgressOnly(){if(this.element)for(let e of this.entries){let t=String(e.id).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`),n=this.element.querySelector(`[data-entry="${t}"]`);if(!n)continue;let r=g(e),i=Math.round(r*100),a=f(e.speedBps),o=n.querySelector(`progress`),s=n.querySelector(`.view-history__progress-meta`);o&&(o.max=100,o.value=i),s&&(s.textContent=`${i}% · ${a}${e.etaMs!=null&&e.etaMs>0?` · ~${Math.ceil(e.etaMs/1e3)}s`:``}`),n.dataset.status=e.status}}updateList(e=!1){if(!this.visible)return;let t=this.element?.querySelector(`[data-history-list]`);if(!t)return;let n=this.listSignature(this.entries);if(!e&&n===this.lastListSig)return;let r=this.structureSignature(this.entries);if(!e&&r===this.lastStructSig&&t.childElementCount>0){this.patchProgressOnly(),this.lastListSig=n;return}this.lastListSig=n,this.lastStructSig=r,t.replaceChildren(),t.appendChild(this.renderEntries())}formatTime(e){let t=new Date(e),n=new Date;return t.toDateString()===n.toDateString()?t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}):t.toLocaleDateString([],{month:`short`,day:`numeric`})+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}reloadHistory(){this.refreshFromStore(),this.scheduleUpdateList(!0)}invokeChannelApi(e,t){if(e===s.Reload||e===s.Refresh)return this.reloadHistory(),!0}canHandleMessage(){return!1}async handleMessage(){}},E=w}))();export{T as HistoryView,E as createHistoryView,w as createView,w as default};