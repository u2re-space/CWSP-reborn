var e={containerId:`rs-toast-layer`,position:`bottom`,maxToasts:5,zIndex:2147483647},t=3e3,n=200,r=400,i=``,a=0,o=t=>`${t.kind||`info`}\0${t.position||e.position}\0${t.message}`,s=(e,t,n)=>{for(let r of Array.from(e?.children??[]))if(r instanceof HTMLElement&&r.classList.contains(`rs-toast`)&&r.getAttribute(`data-kind`)===n&&r.textContent===t)return!0;return!1},c=`
@layer viewer-toast {
    .rs-toast-layer {
        position: fixed;
        z-index: var(--shell-toast-z, 2147483647);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        gap: 0.5rem;
        max-block-size: 80dvb;
        overflow: hidden;
        box-sizing: border-box;
    }

    .rs-toast-layer[data-position="bottom"],
    .rs-toast-layer:not([data-position]) {
        inset-block-end: 10dvb;
        inset-inline: 0;
        justify-content: flex-end;
    }

    .rs-toast-layer[data-position="top"] {
        inset-block-start: 10dvb;
        inset-inline: 0;
        justify-content: flex-start;
    }

    .rs-toast-layer[data-position="top-left"] {
        inset-block-start: 10dvb;
        inset-inline-start: 0;
        align-items: flex-start;
    }

    .rs-toast-layer[data-position="top-right"] {
        inset-block-start: 10dvb;
        inset-inline-end: 0;
        align-items: flex-end;
    }

    .rs-toast-layer[data-position="bottom-left"] {
        inset-block-end: 10dvb;
        inset-inline-start: 0;
        align-items: flex-start;
    }

    .rs-toast-layer[data-position="bottom-right"] {
        inset-block-end: 10dvb;
        inset-inline-end: 0;
        align-items: flex-end;
    }

    .rs-toast {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        max-inline-size: min(90vw, 32rem);
        inline-size: fit-content;

        border-radius: var(--toast-radius, 0.5rem);
        background-color: var(--toast-bg, light-dark(#fafbfc, #1e293b));
        box-shadow: var(--toast-shadow, 0 6px 14px rgba(0, 0, 0, 0.45));
        backdrop-filter: blur(12px) saturate(140%);
        color: var(--toast-text, light-dark(#000000, #ffffff));

        font-family: var(--toast-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        font-size: var(--toast-font-size, 0.875rem);
        font-weight: var(--toast-font-weight, 500);
        letter-spacing: 0.01em;
        line-height: 1.4;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;

        pointer-events: auto;
        user-select: none;
        cursor: default;

        opacity: 0;
        transform: translateY(100%) scale(0.9);
        transition:
            opacity 160ms ease-out,
            transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 100ms ease;
    }

    .rs-toast[data-visible] {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .rs-toast:active {
        transform: scale(0.98);
    }

    .rs-toast[data-kind="success"] {
        --toast-bg: var(--color-success, var(--color-success, #22c55e));
    }

    .rs-toast[data-kind="warning"] {
        --toast-bg: var(--color-warning, var(--color-warning, #f59e0b));
    }

    .rs-toast[data-kind="error"] {
        --toast-bg: var(--color-error, var(--color-error, #ef4444));
    }

    @media (prefers-reduced-motion: reduce) {
        .rs-toast,
        .rs-toast[data-visible] {
            transition-duration: 0ms;
            transform: none;
        }
    }

    @media print {
        .rs-toast-layer, .rs-toast {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            inset: 0 !important;
            z-index: -1 !important;
            inline-size: 0 !important;
            block-size: 0 !important;
            max-inline-size: 0 !important;
            max-block-size: 0 !important;
            min-inline-size: 0 !important;
            min-block-size: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            overflow: hidden !important;
        }
    }
}
`,l=new WeakSet,u=new Map,d=(e=document)=>{if(l.has(e))return;let t=e.createElement(`style`);t.id=`__rs-toast-styles__`,t.textContent=c,(e.head||e.documentElement).appendChild(t),l.add(e)},f=(e,t=document)=>{let n=`${e.containerId}-${e.position}`;if(u.has(n)){let e=u.get(n);if(e.isConnected)return e;u.delete(n)}d(t);let r=t.getElementById(e.containerId);return r||(r=t.createElement(`div`),r.id=e.containerId,r.className=`rs-toast-layer`,r.setAttribute(`aria-live`,`polite`),r.setAttribute(`aria-atomic`,`true`),(t.body||t.documentElement).appendChild(r)),r.setAttribute(`data-position`,e.position),r.style.setProperty(`--shell-toast-z`,String(e.zIndex)),u.set(n,r),r},p=e=>{try{let t=new BroadcastChannel(`rs-toast`);t.postMessage({type:`show-toast`,options:e}),t.close()}catch(e){console.warn(`[Toast] Broadcast failed:`,e)}},m=c=>{let l=typeof c==`string`?{message:c}:c,{message:d,kind:m=`info`,duration:h=t,persistent:g=!1,position:_=e.position,onClick:v}=l;if(!d)return null;let y=o(l),b=Date.now();if(y===i&&b-a<r)return null;if(typeof document>`u`)return i=y,a=b,p(l),null;let x={...e,position:_},S=f(x);if(s(S,d,m))return i=y,a=b,null;for(i=y,a=b;S.children.length>=x.maxToasts;)S.firstChild?.remove();let C=document.createElement(`div`);C.className=`rs-toast`,C.setAttribute(`data-kind`,m),C.setAttribute(`role`,m===`error`||m===`warning`?`alert`:`status`),C.setAttribute(`aria-live`,m===`error`?`assertive`:`polite`),C.textContent=d,S.appendChild(C),globalThis?.requestAnimationFrame?.(()=>{C.setAttribute(`data-visible`,``)});let w=null,T=()=>{w!==null&&(globalThis.clearTimeout(w),w=null),C.removeAttribute(`data-visible`),globalThis?.setTimeout?.(()=>{if(C.remove(),!S.childElementCount){let e=`${x.containerId}-${x.position}`;u.delete(e)}},n)};return g||(w=globalThis?.setTimeout?.(T,h)),C.addEventListener(`click`,()=>{v?.(),T()}),C.addEventListener(`pointerdown`,()=>{w!==null&&(globalThis.clearTimeout(w),w=null),T()},{once:!0}),C},h=()=>{if(typeof BroadcastChannel>`u`)return()=>{};let e=new BroadcastChannel(`rs-toast`),t=e=>{e.data?.type===`show-toast`&&e.data?.options&&m(e.data.options)};return e.addEventListener(`message`,t),()=>{e.removeEventListener(`message`,t),e.close()}},g=()=>h();export{m as n,g as t};