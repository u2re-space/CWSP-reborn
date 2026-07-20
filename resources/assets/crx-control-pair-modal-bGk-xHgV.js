import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";var t,n,r,i,a,o,s;e((()=>{t=`cwsp-crx-control-pair-modal-style`,n=`cwsp-control-public-token-hint`,r=()=>{if(document.getElementById(t))return;let e=document.createElement(`style`);e.id=t,e.textContent=`
.cwsp-crx-pair-backdrop {
  position: fixed; inset: 0; z-index: 100000;
  background: rgba(6, 10, 16, 0.78);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.25rem;
  font-family: "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  animation: cwsp-crx-pair-fade .16s ease-out;
}
@keyframes cwsp-crx-pair-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.cwsp-crx-pair-modal {
  width: min(400px, 100%);
  background: linear-gradient(165deg, #161d28 0%, #10161f 100%);
  color: #e8eef5;
  border: 1px solid #2c3a4c;
  border-radius: 14px;
  padding: 1.35rem 1.4rem 1.2rem;
  box-shadow: 0 22px 56px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.03) inset;
  animation: cwsp-crx-pair-rise .18s ease-out;
}
@keyframes cwsp-crx-pair-rise {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: none; }
}
.cwsp-crx-pair-modal h2 {
  margin: 0 0 .4rem;
  font-size: 1.12rem;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.cwsp-crx-pair-modal .hint {
  margin: 0 0 1rem;
  font-size: .84rem;
  line-height: 1.45;
  color: #9aabbc;
}
.cwsp-crx-pair-modal .hint a {
  color: #7eb0ff;
  text-decoration: none;
}
.cwsp-crx-pair-modal .hint a:hover { text-decoration: underline; }
.cwsp-crx-pair-modal label {
  display: block;
  margin: 0 0 .85rem;
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: #a8b8c8;
}
.cwsp-crx-pair-modal input {
  display: block;
  width: 100%;
  margin-top: .35rem;
  box-sizing: border-box;
  border: 1px solid #334155;
  border-radius: 9px;
  background: #0a0f15;
  color: #f1f5f9;
  padding: .65rem .75rem;
  font-size: .95rem;
  letter-spacing: .03em;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.cwsp-crx-pair-modal input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .22);
}
.cwsp-crx-pair-modal input[name="deviceCode"] {
  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
  font-size: 1.15rem;
  letter-spacing: .18em;
  text-transform: uppercase;
}
.cwsp-crx-pair-modal .err {
  color: #fca5a5;
  font-size: .8rem;
  min-height: 1.15em;
  margin: .15rem 0 .85rem;
}
.cwsp-crx-pair-modal .row {
  display: flex;
  gap: .55rem;
  justify-content: flex-end;
  margin-top: .25rem;
}
.cwsp-crx-pair-modal button {
  border: 0;
  border-radius: 9px;
  padding: .58rem 1rem;
  font-size: .9rem;
  cursor: pointer;
  transition: background .12s, transform .08s;
}
.cwsp-crx-pair-modal button:active { transform: scale(.98); }
.cwsp-crx-pair-modal .cancel {
  background: #243041;
  color: #dbe4ee;
}
.cwsp-crx-pair-modal .cancel:hover { background: #2d3c50; }
.cwsp-crx-pair-modal .ok {
  background: #2f6fed;
  color: #fff;
  font-weight: 600;
}
.cwsp-crx-pair-modal .ok:hover { background: #3b7cf0; }
.cwsp-crx-pair-modal .ok:disabled {
  opacity: .55;
  cursor: wait;
}
`,document.head.appendChild(e)},i=async()=>{try{if(typeof chrome>`u`||!chrome?.storage?.local)return``;let e=await chrome.storage.local.get(n);return String(e?.[n]||``).trim()}catch{return``}},a=async e=>{try{if(typeof chrome>`u`||!chrome?.storage?.local)return;let t=String(e||``).trim();t&&await chrome.storage.local.set({[n]:t})}catch{}},o=async()=>{try{if(typeof chrome>`u`||!chrome?.storage?.local)return;await chrome.storage.local.remove(n)}catch{}},s=async e=>{r();let t=e?.ignoreStoredHint?String(e?.initialPublicToken||``).trim():e?.initialPublicToken||await i(),n=String(e?.publicTokenSuffix||``).trim(),o=String(e?.controlOrigin||``).replace(/^https?:\/\//i,``).replace(/\/+$/,``),s=`Copy <strong>Public token</strong> + live <strong>device code</strong> from Neutralino → CWSP → Control pairing`+(o?` (<code>${o}</code>)`:` (:29110)`)+(n?`. Token must end with <strong>…${n}</strong>`:``)+`. Session in this extension is persistent.`;return new Promise(r=>{let i=document.createElement(`div`);i.className=`cwsp-crx-pair-backdrop`,i.setAttribute(`role`,`dialog`),i.setAttribute(`aria-modal`,`true`),i.setAttribute(`aria-labelledby`,`cwsp-crx-pair-title`);let o=document.createElement(`div`);o.className=`cwsp-crx-pair-modal`,o.innerHTML=`
          <h2 id="cwsp-crx-pair-title">${e?.title||`Pair Control`}</h2>
          <p class="hint">${e?.hint||s}</p>
          <label>Public token${n?` (…${n})`:``}
            <input name="publicToken" type="password" autocomplete="off" spellcheck="false" placeholder="cwsp-pub-…" />
          </label>
          <label>Device code (20s · +10s grace)
            <input name="deviceCode" autocomplete="off" spellcheck="false" placeholder="ABC123" maxlength="12" />
          </label>
          <p class="err" data-err></p>
          <div class="row">
            <button type="button" class="cancel" data-cancel>Cancel</button>
            <button type="button" class="ok" data-ok>Pair &amp; verify</button>
          </div>
        `,i.appendChild(o),document.body.appendChild(i);let c=o.querySelector(`input[name="publicToken"]`),l=o.querySelector(`input[name="deviceCode"]`),u=o.querySelector(`[data-err]`),d=o.querySelector(`[data-ok]`);t&&(c.value=t),e?.error&&(u.textContent=e.error);let f=!1,p=e=>{f||(f=!0,i.remove(),r(e))};o.querySelector(`[data-cancel]`)?.addEventListener(`click`,()=>p(null)),i.addEventListener(`click`,e=>{e.target===i&&p(null)}),i.addEventListener(`keydown`,e=>{e.key===`Escape`&&(e.preventDefault(),p(null))});let m=()=>{let t=String(c.value||``).trim(),n=String(l.value||``).trim().toUpperCase().replace(/[^A-Z0-9]/g,``);if(!t||t.length<8){u.textContent=`Public token is required (from desk Neutralino Settings).`,c.focus();return}if(n.length<4){u.textContent=`Enter the live device code shown on the device.`,l.focus();return}d.disabled=!0,d.textContent=e?.busyLabel||`Pairing…`,a(t),p({publicToken:t,deviceCode:n})};d.addEventListener(`click`,m),l.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),m())}),c.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),l.focus())}),c.value?l.focus():c.focus()})}}))();export{o as clearCrxPublicTokenHint,s as showCrxControlPairModal};