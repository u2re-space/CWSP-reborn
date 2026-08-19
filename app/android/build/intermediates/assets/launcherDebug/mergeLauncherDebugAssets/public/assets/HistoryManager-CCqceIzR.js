import{t as e}from"./Syntax-Cg__ZKXK.js";var t=class{storageKey;maxEntries;autoSave;entries=[];constructor(e={}){this.storageKey=e.storageKey||`rs-basic-history`,this.maxEntries=e.maxEntries||100,this.autoSave=e.autoSave!==!1,this.loadHistory()}addEntry(e){let t={...e,id:this.generateId(),ts:Date.now()};return this.entries.unshift(t),this.entries.length>this.maxEntries&&(this.entries=this.entries.slice(0,this.maxEntries)),this.autoSave&&this.saveHistory(),t}getAllEntries(){return[...this.entries]}getRecentEntries(e=10){return this.entries.slice(0,e)}getEntryById(e){return this.entries.find(t=>t.id===e)}removeEntry(e){let t=this.entries.findIndex(t=>t.id===e);return t!==-1&&(this.entries.splice(t,1),this.autoSave&&this.saveHistory(),!0)}clearHistory(){this.entries=[],this.autoSave&&this.saveHistory()}searchEntries(e){let t=e.toLowerCase();return this.entries.filter(e=>e.prompt.toLowerCase().includes(t)||e.before.toLowerCase().includes(t)||e.after.toLowerCase().includes(t))}getSuccessfulEntries(){return this.entries.filter(e=>e.ok)}getFailedEntries(){return this.entries.filter(e=>!e.ok)}getStatistics(){let e=this.entries.length,t=this.entries.filter(e=>e.ok).length,n=e-t,r=this.entries.filter(e=>e.duration).reduce((e,t)=>e+(t.duration||0),0)/Math.max(1,this.entries.filter(e=>e.duration).length);return{total:e,successful:t,failed:n,successRate:e>0?t/e*100:0,averageDuration:r||0}}exportHistory(){return JSON.stringify(this.entries,null,2)}importHistory(e){try{let t=JSON.parse(e);if(!Array.isArray(t))throw Error(`Invalid history data: not an array`);for(let e of t)if(typeof e.ts!=`number`||typeof e.prompt!=`string`)throw Error(`Invalid history entry: missing required fields`);let n=t.map(e=>({...e,id:e.id||this.generateId()})),r=new Set(this.entries.map(e=>e.id)),i=n.filter(e=>!r.has(e.id));return this.entries.unshift(...i),this.entries.length>this.maxEntries&&(this.entries=this.entries.slice(0,this.maxEntries)),this.autoSave&&this.saveHistory(),!0}catch(e){return console.error(`Failed to import history:`,e),!1}}createHistoryView(t){let n=e`<div class="history-view">
      <div class="history-header">
        <h3>Processing History</h3>
        <div class="history-actions">
          <button class="btn small" data-action="clear-history">Clear All</button>
          <button class="btn small" data-action="export-history">Export</button>
        </div>
      </div>

      <div class="history-stats">
        ${this.createStatsDisplay()}
      </div>

      <div class="history-list">
        ${this.entries.length===0?e`<div class="empty-history">No history yet. Start processing some content!</div>`:this.entries.map(e=>this.createHistoryItem(e,t))}
      </div>
    </div>`;return n.addEventListener(`click`,e=>{let r=e.target,i=r.getAttribute(`data-action`),a=r.getAttribute(`data-entry-id`);if(i===`clear-history`){if(confirm(`Are you sure you want to clear all history?`)){this.clearHistory();let e=this.createHistoryView(t);n.replaceWith(e)}}else if(i===`export-history`)this.exportHistoryToFile();else if(i===`use-entry`&&a){let e=this.getEntryById(a);e&&t?.(e)}}),n}createRecentHistoryView(t=3,n){let r=this.getRecentEntries(t),i=e`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${r.length===0?e`<div class="no-recent">No recent activity</div>`:r.map(e=>this.createCompactHistoryItem(e,n))}
    </div>`;return i.addEventListener(`click`,e=>{let t=e.target,r=t.getAttribute(`data-action`),i=t.getAttribute(`data-entry-id`);if(r===`view-full-history`)console.log(`View full history requested`);else if(r===`use-entry`&&i){let e=this.getEntryById(i);e&&n?.(e)}}),i}createStatsDisplay(){let t=this.getStatistics();return e`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${t.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${t.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${t.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${t.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>`}createHistoryItem(t,n){let r=new Date(t.ts).toLocaleString(),i=t.duration?` (${(t.duration/1e3).toFixed(1)}s)`:``;return e`<div class="history-item ${t.ok?`success`:`error`}">
      <div class="history-meta">
        <span class="history-status ${t.ok?`success`:`error`}">
          ${t.ok?`✓`:`✗`}
        </span>
        <span class="history-time">${r}${i}</span>
        ${t.model?e`<span class="history-model">${t.model}</span>`:``}
      </div>

      <div class="history-content">
        <div class="history-prompt">${t.prompt}</div>
        <div class="history-input">Input: ${t.before}</div>
        ${t.error?e`<div class="history-error">Error: ${t.error}</div>`:``}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${t.id}">Use Prompt</button>
        ${t.ok?e`<button class="btn small" data-action="view-result" data-entry-id="${t.id}">View Result</button>`:``}
      </div>
    </div>`}createCompactHistoryItem(t,n){let r=new Date(t.ts).toLocaleString(),i=t.prompt.length>40?t.prompt.substring(0,40)+`...`:t.prompt;return e`<div class="history-item-compact ${t.ok?`success`:`error`}">
      <div class="history-meta">
        <span class="history-status ${t.ok?`success`:`error`}">${t.ok?`✓`:`✗`}</span>
        <span class="history-prompt">${i}</span>
      </div>
      <div class="history-time">${r}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${t.id}">Use</button>
    </div>`}exportHistoryToFile(){let e=this.exportHistory(),t=new Blob([e],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`ai-history-${new Date().toISOString().split(`T`)[0]}.json`,document.body.append(r),r.click(),r.remove(),URL.revokeObjectURL(n)}generateId(){return`history_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}loadHistory(){try{if(typeof localStorage>`u`)return;let e=localStorage.getItem(this.storageKey);if(e){let t=JSON.parse(e);this.entries=t.map(e=>({...e,id:e.id||this.generateId()}))}}catch(e){console.warn(`Failed to load history from storage:`,e),this.entries=[]}}saveHistory(){try{if(typeof localStorage>`u`)return;localStorage.setItem(this.storageKey,JSON.stringify(this.entries))}catch(e){console.warn(`Failed to save history to storage:`,e)}}};function n(e){return new t(e)}export{t as HistoryManager,n as createHistoryManager};