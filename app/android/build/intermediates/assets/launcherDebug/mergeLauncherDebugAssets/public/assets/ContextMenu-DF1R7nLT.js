import"./path-router-uI-EtU6O.js";var e=`__CWSP_SPEED_DIAL_VIEW_OPENER_V1__`,t=`__CWSP_HOME_OVERLAY_MOUNT_V1__`,n=e=>{let t=globalThis;return{get:()=>e in t?t[e]:null,set:n=>{t[e]=n}}},r=n(e),i=n(t);function a(e){r.set(typeof e==`function`?e:null)}function o(){let e=r.get();return typeof e==`function`?e:null}function s(e){i.set(typeof e==`function`?e:null)}var c=320,l=220,u=`2147483640`,d=`important`,f=0,p=null,m=null,h=[],g=new Map,_=new Map,v=new Map,y=new Map;typeof CSS<`u`&&(CSS.supports(`position-anchor: --cw-anchor-test`)||CSS.supports(`anchor-name: --cw-anchor-test`));var b=()=>{let e=document.documentElement,t=String(e.getAttribute(`data-theme`)||``).trim().toLowerCase();if(t===`light`||t===`dark`)return t;let n=String(e.getAttribute(`data-scheme`)||``).trim().toLowerCase();if(n===`light`||n===`dark`)return n;try{let e=String(localStorage.getItem(`rs-appearance-theme`)||``).trim().toLowerCase();if(e===`light`||e===`dark`)return e}catch{}return typeof matchMedia==`function`&&matchMedia(`(prefers-color-scheme: light)`).matches?`light`:`dark`},x=(e,t)=>{e.style.setProperty(`position`,`fixed`,d),e.style.setProperty(`box-sizing`,`border-box`,d),e.style.setProperty(`min-width`,t?`188px`:`220px`,d),e.style.setProperty(`max-width`,`min(320px, calc(100vw - 24px))`,d),e.style.setProperty(`padding`,t?`0.3rem`:`0.4rem`,d),e.style.setProperty(`border-radius`,`14px`,d),e.style.setProperty(`pointer-events`,`auto`,d),e.style.setProperty(`backdrop-filter`,`blur(10px)`,d),e.style.setProperty(`-webkit-backdrop-filter`,`blur(10px)`,d),e.style.removeProperty(`border`),e.style.removeProperty(`background`),e.style.removeProperty(`color`),e.style.removeProperty(`box-shadow`);let n=b();e.dataset.theme=n,e.style.setProperty(`color-scheme`,n===`light`?`light only`:`dark only`,d)},S=e=>{e.style.setProperty(`list-style`,`none`,d),e.style.setProperty(`list-style-type`,`none`,d),e.style.setProperty(`margin`,`0`,d),e.style.setProperty(`padding`,`0`,d),e.style.setProperty(`display`,`flex`,d),e.style.setProperty(`flex-direction`,`column`,d),e.style.setProperty(`align-items`,`stretch`,d),e.style.setProperty(`gap`,`0.2rem`,d),e.style.setProperty(`width`,`100%`,d),e.style.setProperty(`box-sizing`,`border-box`,d)},C=(e,t)=>{if(e.style.setProperty(`appearance`,`none`,d),e.style.setProperty(`-webkit-appearance`,`none`,d),e.style.setProperty(`box-sizing`,`border-box`,d),e.style.setProperty(`width`,`100%`,d),e.style.setProperty(`max-width`,`100%`,d),e.style.setProperty(`margin`,`0`,d),e.style.setProperty(`display`,`grid`,d),e.style.setProperty(`grid-template-columns`,`1.375rem minmax(0, 1fr) auto`,d),e.style.setProperty(`align-items`,`center`,d),e.style.setProperty(`justify-items`,`start`,d),e.style.setProperty(`gap`,`0.55rem`,d),e.style.setProperty(`border`,`none`,d),e.style.setProperty(`border-radius`,`10px`,d),e.style.setProperty(`padding`,`0.5rem 0.6rem`,d),e.style.setProperty(`min-height`,`2.35rem`,d),e.style.setProperty(`font`,`inherit`,d),e.style.setProperty(`font-size`,`0.8125rem`,d),e.style.setProperty(`line-height`,`1.25`,d),e.style.setProperty(`text-align`,`start`,d),e.style.setProperty(`cursor`,`pointer`,d),e.style.removeProperty(`background`),e.style.removeProperty(`background-color`),!t)e.style.setProperty(`color`,`inherit`,d);else{let t=b()===`light`?`#9f1239`:`#fecaca`;e.style.setProperty(`color`,t,d),e.style.setProperty(`--cw-menu-fg`,t,d)}},w=()=>{let e=document.getElementById(`cw-unified-context-menu-style`);e||(e=document.createElement(`style`),e.id=`cw-unified-context-menu-style`,document.head.appendChild(e)),e.textContent=`
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${u});
            pointer-events: none;
        }

        .cw-context-menu {
            /* WHY: Menu often mounts outside .wf-demo-root — use :root wallpaper seeds. */
            --cw-menu-seed: var(--base-color, var(--color-primary, #5a7fff));
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            /*
             * WHY: !important — unlayered button rules / token-fallback sheets shipped by some hosts
             * override the panel shadow otherwise; mirror the explorer-view unified menu so the
             * speed-dial context menu keeps visible elevation + glass blur.
             */
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            pointer-events: auto;
            user-select: none;
        }

        html[data-theme="light"] .cw-context-menu,
        .cw-context-menu[data-theme="light"] {
            color-scheme: light only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        html[data-theme="dark"] .cw-context-menu,
        .cw-context-menu[data-theme="dark"] {
            color-scheme: dark only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) .cw-context-menu:not([data-theme="dark"]) {
                color-scheme: light only;
                --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
                --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
                --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
                border-color: var(--cw-menu-border);
                background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
                color: var(--cw-menu-fg);
                box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
            }
        }

        .cw-context-menu.cw-context-menu--compact {
            min-width: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: left;
        }

        .cw-context-menu__list > li {
            list-style: none !important;
            list-style-type: none !important;
            display: block !important;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
        }

        button.cw-context-menu__item,
        .cw-context-menu button.cw-context-menu__item {
            appearance: none !important;
            -webkit-appearance: none !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: grid !important;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto !important;
            align-items: center !important;
            justify-items: start !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
        }

        .cw-context-menu__item > * {
            pointer-events: none;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 16%, transparent) !important;
        }

        .cw-context-menu__item[disabled] {
            opacity: 0.45;
            cursor: default;
        }

        .cw-context-menu__item--danger {
            color: #fecaca !important;
        }

        html[data-theme="light"] .cw-context-menu__item--danger,
        .cw-context-menu[data-theme="light"] .cw-context-menu__item--danger {
            color: #9f1239 !important;
        }

        .cw-context-menu__icon {
            justify-self: center;
            inline-size: 1.375rem;
            block-size: 1.375rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            inline-size: 1.125rem !important;
            block-size: 1.125rem !important;
            min-inline-size: 1.125rem !important;
            min-block-size: 1.125rem !important;
            --icon-padding: 0px !important;
            color: var(--cw-menu-fg, inherit) !important;
            pointer-events: none;
        }

        .cw-context-menu__label {
            justify-self: stretch;
            text-align: start !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-inline-size: 0;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron {
            justify-self: end;
            opacity: 0.72;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            pointer-events: none;
        }
    `},T=()=>document.querySelector(`[data-app-layer="overlay"]`)||document.body,E=()=>{for(let e of h)try{e()}catch{}h=[]},D=e=>{for(let[t,n]of Array.from(v.entries()))t>=e&&(clearTimeout(n),v.delete(t));for(let[t,n]of Array.from(y.entries()))t>=e&&(clearTimeout(n),y.delete(t))},O=(e,t,n)=>{e.style.left=`${t}px`,e.style.top=`${n}px`;let r=e.getBoundingClientRect(),i=Math.max(8,window.innerWidth-r.width-8),a=Math.max(8,window.innerHeight-r.height-8);e.style.left=`${Math.min(Math.max(8,t),i)}px`,e.style.top=`${Math.min(Math.max(8,n),a)}px`},k=e=>{D(e);for(let[t,n]of Array.from(g.entries()))t>=e&&(n.remove(),g.delete(t),_.delete(t))},A=(e,t)=>{let n=t.getBoundingClientRect();O(e,Math.round(n.right+4),Math.round(n.top))},j=e=>{for(let[t,n]of Array.from(y.entries()))t>=e&&(clearTimeout(n),y.delete(t))},M=(e,t,n,r)=>{let i=document.createElement(`div`);i.className=`cw-context-menu${t?` cw-context-menu--compact`:``}`,i.setAttribute(`role`,`menu`),i.dataset.menuDepth=String(n),i.style.zIndex=String(n+1);let a=document.createElement(`ul`);a.className=`cw-context-menu__list`,S(a),i.appendChild(a);let o=(e,n,i)=>{if(r!==f||!m?.isConnected||!p?.isConnected||(k(i),!e.children?.length))return;let a=M(e.children,t,i,r);a.classList.add(`cw-context-menu--submenu`),p.appendChild(a),g.set(i,a),_.set(i,n),A(a,n)},s=(e,t,n)=>{let r=v.get(n);r&&clearTimeout(r),j(n);let i=setTimeout(()=>{v.delete(n),o(e,t,n)},c);v.set(n,i)},u=e=>{let t=y.get(e);t&&clearTimeout(t);let n=setTimeout(()=>{y.delete(e),k(e)},l);y.set(e,n)};for(let t of e){let e=document.createElement(`button`);e.type=`button`,e.className=`cw-context-menu__item${t.danger?` cw-context-menu__item--danger`:``}`,e.setAttribute(`role`,`menuitem`),e.disabled=!!t.disabled,C(e,!!t.danger);let i=!!t.children?.length;if(e.innerHTML=`
            <span class="cw-context-menu__icon">${t.icon?`<ui-icon icon="${t.icon}"></ui-icon>`:``}</span>
            <span class="cw-context-menu__label">${t.label}</span>
            <span class="cw-context-menu__chevron">${i?`<ui-icon icon="caret-right"></ui-icon>`:``}</span>
        `,i){let i=n+1;e.setAttribute(`aria-haspopup`,`menu`),e.addEventListener(`pointerenter`,()=>s(t,e,i)),e.addEventListener(`pointerleave`,()=>u(i)),e.addEventListener(`click`,n=>{if(n.preventDefault(),n.stopPropagation(),r!==f||!m?.isConnected)return;j(i);let a=g.get(i),s=_.get(i);if(a?.isConnected&&s===e){k(i);return}o(t,e,i)})}else e.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),!(r!==f||!m?.isConnected)&&(N(),!t.disabled&&await t.action())});let c=document.createElement(`li`);c.appendChild(e),a.appendChild(c)}return x(i,t),i.addEventListener(`pointerenter`,()=>j(n)),i.addEventListener(`pointerleave`,()=>{if(n>0){let e=y.get(n);e&&clearTimeout(e);let t=setTimeout(()=>{y.delete(n),k(n)},l);y.set(n,t)}}),i},N=()=>{E(),D(0),k(1),g.clear(),_.clear(),m?.remove(),m=null,p?.remove(),p=null,f+=1},P=e=>{let t=(e.items||[]).filter(e=>e&&e.id&&e.label);if(!t.length){N();return}w(),N();let n=f,r=T(),i=document.createElement(`div`);i.className=`cw-context-menu-layer`,p=i,r.appendChild(i);let a=M(t,!!e.compact,0,n);m=a,i.appendChild(a),O(a,e.x,e.y);let o=e=>{if(n!==f||!p?.isConnected)return;let t=e.target;t&&p.contains(t)||N()},s=e=>{if(n!==f||!m?.isConnected)return;let t=e.target;if(!t)return;let r=t.closest?.(`.cw-context-menu__item`);if(!r){k(1);return}r.getAttribute(`aria-haspopup`)!==`menu`&&k(1)},c=e=>{n===f&&e.key===`Escape`&&N()},l=()=>N();document.addEventListener(`pointerdown`,o,{capture:!0}),document.addEventListener(`contextmenu`,o,{capture:!0}),document.addEventListener(`keydown`,c),a.addEventListener(`click`,s,{capture:!0}),window.addEventListener(`resize`,l,{passive:!0}),window.addEventListener(`blur`,l,{passive:!0}),h.push(()=>document.removeEventListener(`pointerdown`,o,{capture:!0})),h.push(()=>document.removeEventListener(`contextmenu`,o,{capture:!0})),h.push(()=>document.removeEventListener(`keydown`,c)),h.push(()=>a.removeEventListener(`click`,s,{capture:!0})),h.push(()=>window.removeEventListener(`resize`,l)),h.push(()=>window.removeEventListener(`blur`,l))};export{a as i,o as n,s as r,P as t};