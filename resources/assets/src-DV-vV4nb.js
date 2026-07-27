import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{F as t,Q as n,X as r,t as i,tt as a}from"./src-ZpZP7NZA.js";import{a as o,n as s}from"./channel-actions-DC9DgSYV.js";import{a as c,dispatchHistoryAction as l,getTransferHistoryStore as u,historyImageSrc as d,i as f,n as p,o as m,r as h,s as g,startCapacitorTransferHistory as _,startNeutralinoTransferHistory as v,t as y}from"./transfer-history-runtime-CPhGD67I.js";var b,x=e((()=>{b=`/*
 * Filename: history.scss
 * FullPath: apps/CWSP-reborn/src/frontend/submodules/views/history/scss/history.scss
 * Change date and time: 22.30.00_25.07.2026
 * Reason for changes: Light/dark theme parity — lock color-scheme to app theme;
 *   history item cards use their own slightly darker surfaces so they read
 *   against the page background (light + dark).
 *   2026-07-25e: clipboard-image media row — thumb + placeholder + kind chip.
 */
/**
 * History View Styles
 * INVARIANT: Works with Veela tokens when present; otherwise light-dark()
 * fallbacks keyed off html[data-theme] / inherited color-scheme.
 */
@layer view.history {
  :is(html, body):has([data-view=history]) {
    --view-layout: "flex";
    --view-content-max-width: 1000px;
  }
  /* Lock scheme to app theme so OS light/dark cannot invert fallbacks mid-paint. */
  :is(html[data-theme=light] .view-history, :host-context(html[data-theme=light]) .view-history) {
    color-scheme: light;
  }
  :is(html[data-theme=dark] .view-history, :host-context(html[data-theme=dark]) .view-history) {
    color-scheme: dark;
  }
  .view-history {
    color-scheme: inherit;
    /* Page chrome */
    --vh-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));
    --vh-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --vh-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --vh-primary: var(--color-primary, #007acc);
    --vh-danger: var(--color-error, #d32f2f);
    --vh-on-primary: var(--color-on-primary, #ffffff);
    /*
     * WHY: cards need their own surface — slightly darker than the page in
     * both themes so rows separate from the shell without looking “floating”.
     * Light: soft slate wash; dark: deeper charcoal panel.
     */
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
    padding: 1.5rem;
    background-color: var(--vh-bg);
    color: var(--vh-fg);
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
  }
  .view-history__clear-btn:hover {
    background-color: color-mix(in oklab, var(--vh-danger) 22%, var(--vh-bg));
    border-color: var(--vh-danger);
  }
  .view-history__list {
    flex: 1;
    overflow-y: auto;
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
  /* Clipboard image cards — thumb left, meta right. */
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
    box-shadow: inset 0 0 0 1px color-mix(in oklab, #fff 6%, transparent);
  }
  .view-history__thumb--placeholder {
    display: grid;
    place-items: center;
    color: var(--vh-muted);
    background: linear-gradient(135deg, color-mix(in oklab, var(--vh-fg) 5%, var(--vh-item-bg)), color-mix(in oklab, var(--vh-fg) 10%, var(--vh-item-bg)));
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
  /*
   * WHY: bare transparent/ghost chips were hard to see on item surfaces.
   * Give every action a filled chip; primary (Accept) and danger (Remove/
   * Decline) are color-coded so they read at a glance on both themes.
   */
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
    letter-spacing: 0.01em;
    cursor: pointer;
    box-shadow: 0 1px 0 color-mix(in oklab, var(--vh-fg) 4%, transparent);
  }
  .view-history__action-btn:hover {
    background-color: color-mix(in oklab, var(--vh-primary) 24%, var(--vh-item-bg));
    border-color: color-mix(in oklab, var(--vh-primary) 60%, transparent);
  }
  .view-history__action-btn:active {
    transform: translateY(1px);
  }
  .view-history__action-btn:disabled {
    opacity: 0.55;
    cursor: default;
    transform: none;
  }
  .view-history__action-btn[data-action=accept], .view-history__action-btn[data-action=reveal], .view-history__action-btn[data-action=download], .view-history__action-btn[data-action=open] {
    background-color: var(--vh-primary);
    border-color: var(--vh-primary);
    color: var(--vh-on-primary);
  }
  .view-history__action-btn[data-action=accept]:hover, .view-history__action-btn[data-action=reveal]:hover, .view-history__action-btn[data-action=download]:hover, .view-history__action-btn[data-action=open]:hover {
    filter: brightness(1.08);
    background-color: var(--vh-primary);
  }
  .view-history__action-btn[data-action=remove], .view-history__action-btn[data-action=decline], .view-history__action-btn[data-action=cancel] {
    background-color: color-mix(in oklab, var(--vh-danger) 14%, var(--vh-item-bg));
    border-color: color-mix(in oklab, var(--vh-danger) 45%, transparent);
    color: light-dark(#b71c1c, #ff8a80);
  }
  .view-history__action-btn[data-action=remove]:hover, .view-history__action-btn[data-action=decline]:hover, .view-history__action-btn[data-action=cancel]:hover {
    background-color: color-mix(in oklab, var(--vh-danger) 24%, var(--vh-item-bg));
    border-color: var(--vh-danger);
  }
  .view-history__action-btn[data-action=dismiss] {
    background-color: color-mix(in oklab, var(--vh-fg) 8%, var(--vh-item-bg));
    border-color: color-mix(in oklab, var(--vh-fg) 18%, transparent);
    color: var(--vh-fg);
  }
  .view-history__action-btn[data-action=dismiss]:hover {
    background-color: color-mix(in oklab, var(--vh-fg) 14%, var(--vh-item-bg));
  }
  /* Keep action chips readable on muted/expired rows. */
  .view-history__item.is-muted .view-history__action-btn,
  .view-history__item[data-status=expired] .view-history__action-btn,
  .view-history__item[data-status=declined] .view-history__action-btn {
    opacity: 1;
  }
}`}));function S(e,t){let n=t?.kind===`clipboard-image`;switch(e){case`accept`:return`Accept`;case`dismiss`:return`Dismiss`;case`decline`:return`Decline`;case`open`:return`Open`;case`download`:return n?`Save`:`Download`;case`cancel`:return`Cancel`;case`reveal`:return n?`Show in folder`:`Open folder`;case`share`:return`Share again`;case`remove`:return`Remove`;default:return String(e)}}function C(e){return new w(e)}var w,T;e((()=>{i(),r(),o(),c(),y(),x(),w=class{id=`history`;name=`History`;icon=`clock-counter-clockwise`;options;shellContext;element=null;entries=[];unsub=null;_sheet=null;lifecycle={onUnmount:()=>{this.teardown()},onShow:()=>{this._sheet??=n(b),this.ensureRuntime(),this.bindStore(),this.refreshFromStore()},onHide:()=>{this.teardownSheet()}};constructor(e={}){this.options=e,this.shellContext=e.shellContext}render(e){return e&&(this.options={...this.options,...e},this.shellContext=e.shellContext||this.shellContext),this.ensureRuntime(),this.bindStore(),this.refreshFromStore(),this.element=t`
            <div class="view-history" data-view="history">
                <div class="view-history__header">
                    <h1>History</h1>
                    <button class="view-history__clear-btn" data-action="clear" type="button">
                        <ui-icon icon="trash" icon-style="duotone"></ui-icon>
                        <span>Clear</span>
                    </button>
                </div>
                <p class="view-history__hint">
                    Clipboard &amp; file transfers — active, done, and expired (max 100).
                </p>
                <div class="view-history__list" data-history-list></div>
            </div>
        `,this.setupEventHandlers(),this.updateList(),this.element}getToolbar(){return null}ensureRuntime(){let e=globalThis;e.__CWS_NEUTRALINO_BOOT__&&v(),e.Capacitor&&_(),u()}bindStore(){this.unsub||=u().subscribe(e=>{this.entries=e,this.updateList()})}refreshFromStore(){this.entries=u().list()}teardown(){try{this.unsub?.()}catch{}this.unsub=null,this.teardownSheet(),this.element=null}teardownSheet(){try{this._sheet&&a(this._sheet)}catch{}this._sheet=null}renderEntries(){let e=document.createDocumentFragment();if(this.entries.length===0)return e.appendChild(t`
                <div class="view-history__empty">
                    <ui-icon icon="clock-counter-clockwise" icon-style="duotone" size="48"></ui-icon>
                    <p>No transfers yet</p>
                </div>
            `),e;for(let n of this.entries){let r=m(n.status,n.kind)?` is-muted`:``,i=p(n),a=n.kind===`files`&&(n.status===`progress`||typeof n.bytesDone==`number`&&typeof n.totalBytes==`number`&&(n.totalBytes||0)>0&&n.status!==`expired`),o=g(n),s=Math.round(o*100),c=f(n.speedBps),l=n.kind===`files`?`Files`:n.kind===`clipboard-image`?`Image`:`Clipboard`,u=n.kind===`clipboard-image`,_=u?d(n):``,v=!!_,y=h(n.totalBytes),b=``;if(i.length>0){let e=document.createElement(`div`);e.className=`view-history__item-actions`;for(let r of i){let i=t`<button class="view-history__action-btn" type="button"
                        data-action="${r}" data-id="${n.id}">
                        ${S(r,n)}
                    </button>`;i&&e.appendChild(i)}b=e}let x=a?t`
                <div class="view-history__progress">
                    <progress max="100" value="${s}"></progress>
                    <span class="view-history__progress-meta">${s}% · ${c}${n.etaMs!=null&&n.etaMs>0?` · ~${Math.ceil(n.etaMs/1e3)}s`:``}</span>
                </div>
            `:``,C=u?t`
                <div class="view-history__media">
                    ${v?t`<img class="view-history__thumb" src="${_}" alt="" loading="lazy" decoding="async" />`:t`
                        <div class="view-history__thumb view-history__thumb--placeholder" aria-hidden="true">
                            <ui-icon icon="image" icon-style="duotone" size="28"></ui-icon>
                        </div>
                    `}
                    <div class="view-history__media-meta">
                        <p class="view-history__item-desc">${n.title}</p>
                        ${n.subtitle?t`<p class="view-history__item-sub">${n.subtitle}</p>`:y?t`<p class="view-history__item-sub">${y}</p>`:``}
                        ${v?``:t`<p class="view-history__item-sub">Preview unavailable — Accept uses retained file when present</p>`}
                    </div>
                </div>
            `:t`
                <p class="view-history__item-desc">${n.title}</p>
                ${n.subtitle?t`<p class="view-history__item-sub">${n.subtitle}</p>`:``}
                ${n.textPreview?t`<pre class="view-history__item-preview">${n.textPreview}</pre>`:``}
            `,w=t`
                <div class="view-history__item${r}${u?` is-image`:``}" data-entry="${n.id}" data-status="${n.status}" data-kind="${n.kind}">
                    <div class="view-history__item-header">
                        <span class="view-history__item-action">
                            <span class="view-history__kind-chip" data-kind="${n.kind}">${l}</span>
                            · ${n.direction} · ${n.status}
                        </span>
                        <span class="view-history__item-time">${this.formatTime(n.lastActionAt||n.ts)}${n.lastActionAt&&n.lastActionAt!==n.ts?` · arrived ${this.formatTime(n.ts)}`:``}</span>
                    </div>
                    ${C}
                    ${x}
                    ${n.error?t`<p class="view-history__item-error">${n.error}</p>`:``}
                    ${b}
                </div>
            `;e.appendChild(w)}return e}setupEventHandlers(){this.element&&this.element.addEventListener(`click`,e=>{this.onClick(e)})}async onClick(e){let t=e.target.closest(`[data-action]`);if(!t)return;let n=t.dataset.action,r=t.dataset.id;if(n===`clear`){u().clear(),this.shellContext?.showMessage?.(`History cleared`);return}if(!n||!r)return;let i=this.entries.find(e=>e.id===r);if(i){t.disabled=!0;try{let e=await l(i,n);this.shellContext?.showMessage?.(e?`${S(n)} OK`:`Action failed`)}finally{t.disabled=!1}}}updateList(){let e=this.element?.querySelector(`[data-history-list]`);e&&(e.replaceChildren(),e.appendChild(this.renderEntries()))}formatTime(e){let t=new Date(e),n=new Date;return t.toDateString()===n.toDateString()?t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}):t.toLocaleDateString([],{month:`short`,day:`numeric`})+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}reloadHistory(){this.refreshFromStore(),this.updateList()}invokeChannelApi(e,t){if(e===s.Reload||e===s.Refresh)return this.reloadHistory(),!0}canHandleMessage(){return!1}async handleMessage(){}},T=C}))();export{w as HistoryView,T as createHistoryView,C as createView,C as default};