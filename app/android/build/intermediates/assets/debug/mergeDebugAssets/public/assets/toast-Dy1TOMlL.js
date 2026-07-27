var e={containerId:`rs-toast-layer`,position:`bottom`,maxToasts:5,zIndex:2147483647},t=3e3,n=200,r=400,i=``,a=0,o=t=>`${t.kind||`info`}\0${t.position||e.position}\0${t.message}`,s=(e,t,n)=>{for(let r of Array.from(e?.children??[]))if(r instanceof HTMLElement&&r.classList.contains(`rs-toast`)&&r.getAttribute(`data-kind`)===n&&r.textContent===t)return!0;return!1},c=`
:host {
    all: initial !important;
    position: fixed !important;
    inset: 0 !important;
    display: block !important;
    pointer-events: none !important;
    z-index: var(--shell-toast-z, 2147483647) !important;
    overflow: visible !important;
}

.rs-toast-layer {
    position: fixed;
    z-index: 1;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 20px;
    gap: 8px;
    max-block-size: 80dvh;
    max-block-size: 80dvb;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    border: none;
    background: transparent;
}

.rs-toast-layer[data-position="bottom"],
.rs-toast-layer:not([data-position]) {
    inset-block-end: 24px;
    inset-block-start: auto;
    inset-inline: 0;
    justify-content: flex-end;
}

.rs-toast-layer[data-position="top"] {
    inset-block-start: 24px;
    inset-block-end: auto;
    inset-inline: 0;
    justify-content: flex-start;
}

.rs-toast-layer[data-position="top-left"] {
    inset-block-start: 24px;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    align-items: flex-start;
}

.rs-toast-layer[data-position="top-right"] {
    inset-block-start: 24px;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    align-items: flex-end;
}

.rs-toast-layer[data-position="bottom-left"] {
    inset-block-end: 24px;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    align-items: flex-start;
}

.rs-toast-layer[data-position="bottom-right"] {
    inset-block-end: 24px;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    align-items: flex-end;
}

.rs-toast {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    max-inline-size: min(90vw, 28rem);
    inline-size: fit-content;
    min-block-size: 2.25rem;
    box-sizing: border-box;

    border-radius: 10px;
    border: 1px solid rgba(248, 250, 252, 0.14);
    background-color: #0f172a;
    color: #f8fafc;
    box-shadow: 0 10px 28px rgba(2, 6, 23, 0.45);

    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.4;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-align: center;

    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    cursor: default;

    opacity: 0;
    transform: translateY(12px) scale(0.96);
    transition:
        opacity 180ms ease-out,
        transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.rs-toast[data-visible] {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.rs-toast:active {
    transform: scale(0.98);
}

.rs-toast[data-kind="info"] {
    background-color: #0f172a;
    color: #f8fafc;
    border-color: rgba(148, 163, 184, 0.35);
}

.rs-toast[data-kind="success"] {
    background-color: #166534;
    color: #f0fdf4;
    border-color: rgba(187, 247, 208, 0.35);
}

.rs-toast[data-kind="warning"] {
    background-color: #b45309;
    color: #fffbeb;
    border-color: rgba(253, 230, 138, 0.4);
}

.rs-toast[data-kind="error"] {
    background-color: #b91c1c;
    color: #fef2f2;
    border-color: rgba(254, 202, 202, 0.4);
}

@media (prefers-reduced-motion: reduce) {
    .rs-toast,
    .rs-toast[data-visible] {
        transition-duration: 0ms;
        transform: none;
    }
}

@media print {
    :host,
    .rs-toast-layer,
    .rs-toast {
        display: none !important;
    }
}
`,l=new Map,u=new Map,d=(e,t=document)=>{let n=`${e.containerId}-${e.position}`,r=l.get(n),i=u.get(n);if(r?.isConnected&&i?.isConnected)return r.setAttribute(`data-position`,e.position),i.style.setProperty(`--shell-toast-z`,String(e.zIndex)),{host:i,layer:r};l.delete(n),u.delete(n);let a=t.getElementById(e.containerId);a||(a=t.createElement(`div`),a.id=e.containerId,a.setAttribute(`data-cwsp-toast-host`,``),a.style.cssText=[`all: initial`,`position: fixed`,`inset: 0`,`display: block`,`pointer-events: none`,`z-index: ${e.zIndex}`,`overflow: visible`,`margin: 0`,`padding: 0`,`border: none`,`background: transparent`].join(`;`),(t.body||t.documentElement).appendChild(a)),a.style.setProperty(`--shell-toast-z`,String(e.zIndex));let o=a.shadowRoot;o||=a.attachShadow({mode:`open`});let s=o.querySelector(`style[data-rs-toast]`);s?s.textContent=c:(s=t.createElement(`style`),s.setAttribute(`data-rs-toast`,``),s.textContent=c,o.insertBefore(s,o.firstChild));let d=o.querySelector(`.rs-toast-layer`);return d||(d=t.createElement(`div`),d.className=`rs-toast-layer`,d.setAttribute(`aria-live`,`polite`),d.setAttribute(`aria-atomic`,`true`),o.appendChild(d)),d.setAttribute(`data-position`,e.position),l.set(n,d),u.set(n,a),{host:a,layer:d}},f=e=>{try{let t=new BroadcastChannel(`rs-toast`);t.postMessage({type:`show-toast`,options:e}),t.close()}catch(e){console.warn(`[Toast] Broadcast failed:`,e)}},p=c=>{let u=typeof c==`string`?{message:c}:c,{message:p,kind:m=`info`,duration:h=t,persistent:g=!1,position:_=e.position,onClick:v}=u;if(!p)return null;let y=o(u),b=Date.now();if(y===i&&b-a<r)return null;if(typeof document>`u`)return i=y,a=b,f(u),null;let x={...e,position:_},{layer:S}=d(x);if(s(S,p,m))return i=y,a=b,null;for(i=y,a=b;S.children.length>=x.maxToasts;)S.firstChild?.remove();let C=document.createElement(`div`);C.className=`rs-toast`,C.setAttribute(`data-kind`,m),C.setAttribute(`role`,m===`error`||m===`warning`?`alert`:`status`),C.setAttribute(`aria-live`,m===`error`?`assertive`:`polite`),C.textContent=p,S.appendChild(C),globalThis?.requestAnimationFrame?.(()=>{C.setAttribute(`data-visible`,``)});let w=null,T=()=>{w!==null&&(globalThis.clearTimeout(w),w=null),C.removeAttribute(`data-visible`),globalThis?.setTimeout?.(()=>{if(C.remove(),!S.childElementCount){let e=`${x.containerId}-${x.position}`;l.delete(e)}},n)};return g||(w=globalThis?.setTimeout?.(T,h)),C.addEventListener(`click`,()=>{v?.(),T()}),C.addEventListener(`pointerdown`,()=>{w!==null&&(globalThis.clearTimeout(w),w=null),T()},{once:!0}),C},m=()=>{if(typeof BroadcastChannel>`u`)return()=>{};let e=new BroadcastChannel(`rs-toast`),t=e=>{e.data?.type===`show-toast`&&e.data?.options&&p(e.data.options)};return e.addEventListener(`message`,t),()=>{e.removeEventListener(`message`,t),e.close()}},h=()=>m();export{p as n,h as t};