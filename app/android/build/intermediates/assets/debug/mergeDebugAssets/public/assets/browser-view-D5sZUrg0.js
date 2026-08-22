function e(e){let t=e?.params||{},n=String(t.url||t.href||t.src||``).trim();if(!n)return``;try{if(/^https?:\/\//i.test(n))return new URL(n).href;if(/^\/\//.test(n))return new URL(`https:${n}`).href;if(/^www\./i.test(n)||/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#]|$)/i.test(n))return new URL(`https://${n.replace(/^\/+/,``)}`).href}catch{return``}return``}function t(t){let n=document.createElement(`div`);n.className=`wf-browser`,n.setAttribute(`part`,`browser`);let r=document.createElement(`style`);r.textContent=`
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
`;let i=document.createElement(`div`);i.className=`wf-browser__chrome`;let a=document.createElement(`input`);a.className=`wf-browser__url`,a.type=`url`,a.autocomplete=`off`,a.spellcheck=!1,a.placeholder=`https://…`,a.setAttribute(`aria-label`,`Page address`);let o=document.createElement(`button`);o.type=`button`,o.className=`wf-browser__btn`,o.textContent=`Go`;let s=document.createElement(`button`);s.type=`button`,s.className=`wf-browser__btn`,s.textContent=`Open ↗`,s.title=`Open in a new browser tab`,i.append(a,o,s);let c=document.createElement(`p`);c.className=`wf-browser__hint`,c.textContent=`Embedded page. If it stays blank, the site blocks iframes — use Open ↗.`;let l=document.createElement(`iframe`);l.className=`wf-browser__frame`,l.title=`Embedded page`,l.referrerPolicy=`no-referrer-when-downgrade`,l.allow=`fullscreen; clipboard-read; clipboard-write; geolocation`,l.setAttribute(`loading`,`lazy`);let u=t=>{let r=e({params:{url:t}});if(r){a.value=r,l.src=r,n.dataset.url=r;try{let e=new URL(r).hostname;n.dataset.title=e||`Browser`}catch{n.dataset.title=`Browser`}}};o.addEventListener(`click`,()=>u(a.value)),a.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),u(a.value))}),s.addEventListener(`click`,()=>{let e=String(a.value||l.src||``).trim();if(e)try{window.open(e,`_blank`,`noopener,noreferrer`)}catch{}}),n.append(r,i,c,l);let d=e(t);return d&&u(d),n}export{t as createBrowserView,t as default};