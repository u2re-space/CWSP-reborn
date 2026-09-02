import{n as e}from"./rolldown-runtime-C0FnF6B9.js";function t(e){let t=e?.params||{},n=String(t.url||t.href||t.src||``).trim();if(!n)return``;try{if(/^https?:\/\//i.test(n))return new URL(n).href;if(/^\/\//.test(n))return new URL(`https:${n}`).href;if(/^www\./i.test(n)||/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#]|$)/i.test(n))return new URL(`https://${n.replace(/^\/+/,``)}`).href}catch{return``}return``}function n(e){let n=document.createElement(`div`);n.className=`wf-browser`,n.setAttribute(`part`,`browser`);let i=document.createElement(`style`);i.textContent=r;let a=document.createElement(`div`);a.className=`wf-browser__chrome`;let o=document.createElement(`input`);o.className=`wf-browser__url`,o.type=`url`,o.autocomplete=`off`,o.spellcheck=!1,o.placeholder=`https://…`,o.setAttribute(`aria-label`,`Page address`);let s=document.createElement(`button`);s.type=`button`,s.className=`wf-browser__btn`,s.textContent=`Go`;let c=document.createElement(`button`);c.type=`button`,c.className=`wf-browser__btn`,c.textContent=`Open ↗`,c.title=`Open in a new browser tab`,a.append(o,s,c);let l=document.createElement(`p`);l.className=`wf-browser__hint`,l.textContent=`Embedded page. If it stays blank, the site blocks iframes — use Open ↗.`;let u=document.createElement(`iframe`);u.className=`wf-browser__frame`,u.title=`Embedded page`,u.referrerPolicy=`no-referrer-when-downgrade`,u.allow=`fullscreen; clipboard-read; clipboard-write; geolocation`,u.setAttribute(`loading`,`lazy`);let d=e=>{let r=t({params:{url:e}});if(r){o.value=r,u.src=r,n.dataset.url=r;try{let e=new URL(r).hostname;n.dataset.title=e||`Browser`}catch{n.dataset.title=`Browser`}}};s.addEventListener(`click`,()=>d(o.value)),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),d(o.value))}),c.addEventListener(`click`,()=>{let e=String(o.value||u.src||``).trim();if(e)try{window.open(e,`_blank`,`noopener,noreferrer`)}catch{}}),n.append(i,a,l,u);let f=t(e);return f&&d(f),n}var r;function i(){return(i=e((()=>{r=`
.wf-browser {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: hidden;
  background: Canvas;
  color: CanvasText;
  font: 400 .875rem/1.35 system-ui, sans-serif;
}
.wf-browser__chrome {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: .4rem;
  padding: .35rem .5rem;
  border-block-end: 1px solid color-mix(in srgb, CanvasText 16%, transparent);
  background: color-mix(in srgb, Canvas 88%, CanvasText 12%);
}
.wf-browser__url {
  flex: 1 1 auto;
  min-inline-size: 0;
  border: 1px solid color-mix(in srgb, CanvasText 22%, transparent);
  border-radius: .4rem;
  padding: .3rem .55rem;
  background: Canvas;
  color: inherit;
}
.wf-browser__btn {
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, CanvasText 22%, transparent);
  border-radius: .4rem;
  padding: .28rem .55rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.wf-browser__btn:hover { background: color-mix(in srgb, CanvasText 8%, transparent); }
.wf-browser__hint {
  flex: 0 0 auto;
  margin: 0;
  padding: .35rem .65rem;
  font-size: .75rem;
  opacity: .78;
  border-block-end: 1px solid color-mix(in srgb, CanvasText 12%, transparent);
}
.wf-browser__frame {
  flex: 1 1 auto;
  inline-size: 100%;
  block-size: 100%;
  min-block-size: 0;
  border: 0;
  background: #fff;
}
`})))()}i();export{n as createBrowserView,n as default};