import { I as H } from "../vendor/culori.js";
import { n as HistoryChannelAction } from "./channel-actions.js";
import { a as transferProgressRatio, dispatchHistoryAction, getTransferHistoryStore, historyImageSrc, i as isMutedHistoryStatus, n as formatTransferBytes, r as formatTransferSpeed, setTransferHistoryUiActive, startCapacitorTransferHistory, startNeutralinoTransferHistory, t as actionsForEntry } from "./transfer-history-runtime.js";
import { loadAsAdopted, removeAdopted } from "/fest/style-lib.js";
//#region ../../modules/views/history-view/src/scss/history.scss?inline
var history_default = "@layer components{:is(html[data-theme=light] .view-history,:host-context(html[data-theme=light]) .view-history){color-scheme:light}:is(html[data-theme=dark] .view-history,:host-context(html[data-theme=dark]) .view-history){color-scheme:dark}.view-history{color-scheme:inherit;--vh-item-border:color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 10%, transparent);--vh-item-preview-bg:color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 6%, var(--vh-item-bg, light-dark(#e0e5ee, #0a0d12)));--vh-elev:0 1px 0 color-mix(in oklab, var(--vh-fg, light-dark(#12151a, #e8edf2)) 4%, transparent);background-color:var(--vh-bg,light-dark(#eef1f6,#0f1318));block-size:100%;box-sizing:border-box;color:var(--vh-fg,light-dark(#12151a,#e8edf2));display:flex;flex-direction:column;min-block-size:0;padding:1.5rem;pointer-events:auto;position:relative;z-index:1}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.view-history{color:contrast-color(var(--vh-bg,light-dark(#eef1f6,#0f1318)))}}.view-history *,.view-history :after,.view-history :before{box-sizing:border-box}.view-history__header{align-items:center;display:flex;justify-content:space-between;margin-block-end:1.5rem}.view-history__header h1{color:var(--vh-fg,light-dark(#12151a,#e8edf2));font-size:1.5rem;font-weight:700;margin:0}.view-history__clear-btn{align-items:center;background-color:color-mix(in oklab,var(--vh-danger,#d32f2f) 12%,var(--vh-bg,light-dark(#eef1f6,#0f1318)));border:1px solid color-mix(in oklab,var(--vh-danger,#d32f2f) 45%,transparent);border-radius:6px;color:contrast-color(color-mix(in oklab,var(--vh-danger,#d32f2f) 12%,var(--vh-bg,light-dark(#eef1f6,#0f1318))));color:light-dark(#b71c1c,#ff8a80);cursor:pointer;display:flex;font-size:.8125rem;font-weight:600;gap:.5rem;padding:.5rem .85rem;pointer-events:auto}.view-history__clear-btn:hover{background-color:color-mix(in oklab,var(--vh-danger,#d32f2f) 22%,var(--vh-bg,light-dark(#eef1f6,#0f1318)));border-color:var(--vh-danger,#d32f2f);color:contrast-color(color-mix(in oklab,var(--vh-danger,#d32f2f) 22%,var(--vh-bg,light-dark(#eef1f6,#0f1318))))}.view-history__list{flex:1;min-block-size:0;overflow-y:auto;pointer-events:auto}.view-history__empty{align-items:center;block-size:100%;color:var(--vh-muted,light-dark(#5c6570,#a8b0bc));display:flex;flex-direction:column;gap:1rem;justify-content:center}.view-history__empty p{font-size:1rem;margin:0}.view-history__hint{color:var(--vh-muted,light-dark(#5c6570,#a8b0bc));font-size:.8125rem;margin:0 0 1rem}.view-history__item{background-color:var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12));border:1px solid var(--vh-item-border);border-inline-start:3px solid var(--vh-primary,#007acc);border-radius:10px;box-shadow:var(--vh-elev);color:var(--vh-fg,light-dark(#12151a,#e8edf2));margin-block-end:.75rem;padding:1rem;pointer-events:auto;transition:opacity .2s ease,border-color .15s ease}@supports (color:contrast-color(red)) and (color:light-dark(red,red)){.view-history__item{color:contrast-color(var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)))}}.view-history__item.error,.view-history__item[data-status=error]{border-inline-start-color:var(--vh-danger,#d32f2f)}.view-history__item.is-muted,.view-history__item[data-status=declined],.view-history__item[data-status=expired]{border-inline-start-color:color-mix(in oklab,var(--vh-muted,light-dark(#5c6570,#a8b0bc)) 70%,transparent);opacity:.55}.view-history__item-sub{color:var(--vh-muted,light-dark(#5c6570,#a8b0bc));font-size:.75rem;margin:.25rem 0 0}.view-history__kind-chip{align-items:center;background:color-mix(in oklab,var(--vh-primary,#007acc) 16%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border:1px solid color-mix(in oklab,var(--vh-primary,#007acc) 28%,transparent);border-radius:999px;color:light-dark(#0b5f8a,#9fd3f5);display:inline-flex;font-size:.7rem;font-weight:700;letter-spacing:.02em;padding:.12rem .45rem;text-transform:uppercase}.view-history__kind-chip[data-kind=clipboard-image]{background:color-mix(in oklab,#7b1fa2 14%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border-color:color-mix(in oklab,#7b1fa2 35%,transparent);color:light-dark(#6a1b9a,#e1bee7)}.view-history__kind-chip[data-kind=files]{background:color-mix(in oklab,#2e7d32 14%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border-color:color-mix(in oklab,#2e7d32 35%,transparent);color:light-dark(#1b5e20,#a5d6a7)}.view-history__item.is-image{border-inline-start-color:#9c27b0}.view-history__media{align-items:center;display:grid;gap:.85rem;grid-template-columns:5.5rem minmax(0,1fr);margin-block-start:.15rem}.view-history__thumb{background:color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 6%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));block-size:5.5rem;border:1px solid color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 12%,transparent);border-radius:10px;display:block;inline-size:5.5rem;object-fit:cover}.view-history__thumb--placeholder{background:color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 8%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));color:var(--vh-muted,light-dark(#5c6570,#a8b0bc));display:grid;font-size:1.5rem;place-items:center}.view-history__media-meta{min-inline-size:0}.view-history__media-meta .view-history__item-desc{margin:0}@media (max-width:420px){.view-history__media{gap:.65rem;grid-template-columns:4.5rem minmax(0,1fr)}.view-history__thumb{block-size:4.5rem;inline-size:4.5rem}}.view-history__item-preview{background:var(--vh-item-preview-bg);border:1px solid color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 8%,transparent);border-radius:6px;color:var(--vh-fg,light-dark(#12151a,#e8edf2));font:.75rem/1.35 ui-monospace,monospace;margin:.5rem 0 0;max-block-size:6rem;overflow:auto;padding:.5rem;white-space:pre-wrap}.view-history__progress{display:flex;flex-direction:column;gap:.25rem;margin-block-start:.65rem}.view-history__progress progress{block-size:.45rem;inline-size:100%}.view-history__progress-meta{color:var(--vh-muted,light-dark(#5c6570,#a8b0bc));font-size:.7rem}.view-history__item-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:.5rem}.view-history__item-action{color:var(--vh-fg,light-dark(#12151a,#e8edf2));font-size:.875rem;font-weight:600}.view-history__item-time{color:var(--vh-muted,light-dark(#5c6570,#a8b0bc));font-size:.75rem}.view-history__item-desc{color:var(--vh-fg,light-dark(#12151a,#e8edf2));font-size:.875rem;margin:0;opacity:.92}.view-history__item-error{color:light-dark(#b71c1c,#ff8a80);font-size:.8125rem;margin:.5rem 0 0}.view-history__item-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-start:.75rem}.view-history__action-btn{align-items:center;background-color:color-mix(in oklab,var(--vh-primary,#007acc) 14%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border:1px solid color-mix(in oklab,var(--vh-primary,#007acc) 40%,transparent);border-radius:6px;color:contrast-color(color-mix(in oklab,var(--vh-primary,#007acc) 14%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12))));color:light-dark(#0b5f8a,#7ec8f0);cursor:pointer;display:inline-flex;font-size:.8125rem;font-weight:600;gap:.375rem;justify-content:center;min-block-size:2rem;padding:.4rem .85rem;pointer-events:auto}.view-history__action-btn:hover{background-color:color-mix(in oklab,var(--vh-primary,#007acc) 24%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border-color:color-mix(in oklab,var(--vh-primary,#007acc) 60%,transparent);color:contrast-color(color-mix(in oklab,var(--vh-primary,#007acc) 24%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12))))}.view-history__action-btn:disabled{cursor:default;opacity:.55}.view-history__action-btn[data-action=accept],.view-history__action-btn[data-action=download],.view-history__action-btn[data-action=open],.view-history__action-btn[data-action=reveal]{background-color:var(--vh-primary,#007acc);border-color:var(--vh-primary,#007acc);color:var(--vh-on-primary,#ffffff)}@supports (color:contrast-color(red)){.view-history__action-btn[data-action=accept],.view-history__action-btn[data-action=download],.view-history__action-btn[data-action=open],.view-history__action-btn[data-action=reveal]{color:contrast-color(var(--vh-primary,#007acc))}}.view-history__action-btn[data-action=cancel],.view-history__action-btn[data-action=decline],.view-history__action-btn[data-action=remove]{background-color:color-mix(in oklab,var(--vh-danger,#d32f2f) 14%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border-color:color-mix(in oklab,var(--vh-danger,#d32f2f) 45%,transparent);color:light-dark(#b71c1c,#ff8a80)}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)) and (color:light-dark(red,red)){.view-history__action-btn[data-action=cancel],.view-history__action-btn[data-action=decline],.view-history__action-btn[data-action=remove]{color:contrast-color(color-mix(in oklab,var(--vh-danger,#d32f2f) 14%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12))))}}.view-history__action-btn[data-action=dismiss]{background-color:color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 8%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12)));border-color:color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 18%,transparent);color:var(--vh-fg,light-dark(#12151a,#e8edf2))}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)) and (color:light-dark(red,red)){.view-history__action-btn[data-action=dismiss]{color:contrast-color(color-mix(in oklab,var(--vh-fg,light-dark(#12151a,#e8edf2)) 8%,var(--vh-item-bg,light-dark(#e0e5ee,#0a0d12))))}}:is(.view-history__item.is-muted,.view-history__item[data-status=declined],.view-history__item[data-status=expired]) .view-history__action-btn{opacity:1}}";
//#endregion
//#region ../../modules/views/history-view/src/index.ts
var HistoryView = class {
	id = "history";
	name = "History";
	icon = "clock-counter-clockwise";
	options;
	shellContext;
	element = null;
	entries = [];
	unsub = null;
	_sheet = null;
	/** WHY: cached History stays subscribed after navigate-away; gate DOM work. */
	visible = false;
	listRaf = 0;
	lastListSig = "";
	lastStructSig = "";
	lifecycle = {
		onUnmount: () => {
			this.teardown();
		},
		onShow: () => {
			this.visible = true;
			this._sheet ??= loadAsAdopted(history_default);
			this.ensureRuntime();
			this.bindStore();
			this.refreshFromStore();
			this.scheduleUpdateList(true);
			requestAnimationFrame(() => {
				if (this.visible) setTransferHistoryUiActive(true);
			});
		},
		onHide: () => {
			this.visible = false;
			setTransferHistoryUiActive(false);
			if (this.listRaf) {
				cancelAnimationFrame(this.listRaf);
				this.listRaf = 0;
			}
			this.teardownSheet();
		}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this.ensureRuntime();
		this.bindStore();
		this.refreshFromStore();
		this.visible = true;
		this.element = H`
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
        `;
		this.setupEventHandlers();
		this.updateList(true);
		requestAnimationFrame(() => {
			if (this.visible) setTransferHistoryUiActive(true);
		});
		return this.element;
	}
	getToolbar() {
		return null;
	}
	ensureRuntime() {
		const g = globalThis;
		if (g.__CWS_NEUTRALINO_BOOT__) startNeutralinoTransferHistory();
		if (g.Capacitor) startCapacitorTransferHistory();
		getTransferHistoryStore();
	}
	bindStore() {
		if (this.unsub) return;
		this.unsub = getTransferHistoryStore().subscribe((list) => {
			this.entries = list;
			this.scheduleUpdateList(false);
		});
	}
	refreshFromStore() {
		this.entries = getTransferHistoryStore().list();
	}
	teardown() {
		this.visible = false;
		setTransferHistoryUiActive(false);
		if (this.listRaf) {
			cancelAnimationFrame(this.listRaf);
			this.listRaf = 0;
		}
		try {
			this.unsub?.();
		} catch {}
		this.unsub = null;
		this.teardownSheet();
		this.element = null;
		this.lastListSig = "";
		this.lastStructSig = "";
	}
	teardownSheet() {
		try {
			if (this._sheet) removeAdopted(this._sheet);
		} catch {}
		this._sheet = null;
	}
	renderEntries() {
		const fragment = document.createDocumentFragment();
		if (this.entries.length === 0) {
			fragment.appendChild(H`
                <div class="view-history__empty">
                    <span aria-hidden="true" style="font-size:2.5rem;opacity:.45">⏱</span>
                    <p>No transfers yet</p>
                </div>
            `);
			return fragment;
		}
		for (const entry of this.entries) {
			const muted = isMutedHistoryStatus(entry.status, entry.kind) ? " is-muted" : "";
			const acts = actionsForEntry(entry);
			const showProgress = entry.kind === "files" && (entry.status === "progress" || typeof entry.bytesDone === "number" && typeof entry.totalBytes === "number" && (entry.totalBytes || 0) > 0 && entry.status !== "expired");
			const ratio = transferProgressRatio(entry);
			const pct = Math.round(ratio * 100);
			const speed = formatTransferSpeed(entry.speedBps);
			const kindLabel = entry.kind === "files" ? "Files" : entry.kind === "clipboard-image" ? "Image" : "Clipboard";
			const isImage = entry.kind === "clipboard-image";
			const thumbSrc = isImage ? historyImageSrc(entry) : "";
			const hasThumb = Boolean(thumbSrc);
			const sizeLabel = formatTransferBytes(entry.totalBytes);
			let actionsEl = "";
			if (acts.length > 0) {
				const wrap = document.createElement("div");
				wrap.className = "view-history__item-actions";
				for (const a of acts) {
					const btn = H`<button class="view-history__action-btn" type="button"
                        data-action="${a}" data-id="${entry.id}">
                        ${labelForAction(a, entry)}
                    </button>`;
					if (btn) wrap.appendChild(btn);
				}
				actionsEl = wrap;
			}
			const progressEl = showProgress ? H`
                <div class="view-history__progress">
                    <progress max="100" value="${pct}"></progress>
                    <span class="view-history__progress-meta">${pct}% · ${speed}${entry.etaMs != null && entry.etaMs > 0 ? ` · ~${Math.ceil(entry.etaMs / 1e3)}s` : ""}</span>
                </div>
            ` : "";
			const mediaEl = isImage ? H`
                <div class="view-history__media">
                    ${hasThumb ? H`<img class="view-history__thumb" src="${thumbSrc}" alt="" loading="lazy" decoding="async" />` : H`
                        <div class="view-history__thumb view-history__thumb--placeholder" aria-hidden="true">🖼</div>
                    `}
                    <div class="view-history__media-meta">
                        <p class="view-history__item-desc">${entry.title}</p>
                        ${entry.subtitle ? H`<p class="view-history__item-sub">${entry.subtitle}</p>` : sizeLabel ? H`<p class="view-history__item-sub">${sizeLabel}</p>` : ""}
                        ${!hasThumb ? H`<p class="view-history__item-sub">Preview unavailable — Accept uses retained file when present</p>` : ""}
                    </div>
                </div>
            ` : H`
                <p class="view-history__item-desc">${entry.title}</p>
                ${entry.subtitle ? H`<p class="view-history__item-sub">${entry.subtitle}</p>` : ""}
                ${entry.textPreview ? H`<pre class="view-history__item-preview">${entry.textPreview}</pre>` : ""}
            `;
			const item = H`
                <div class="view-history__item${muted}${isImage ? " is-image" : ""}" data-entry="${entry.id}" data-status="${entry.status}" data-kind="${entry.kind}">
                    <div class="view-history__item-header">
                        <span class="view-history__item-action">
                            <span class="view-history__kind-chip" data-kind="${entry.kind}">${kindLabel}</span>
                            · ${entry.direction} · ${entry.status}
                        </span>
                        <span class="view-history__item-time">${this.formatTime(entry.lastActionAt || entry.ts)}${entry.lastActionAt && entry.lastActionAt !== entry.ts ? ` · arrived ${this.formatTime(entry.ts)}` : ""}</span>
                    </div>
                    ${mediaEl}
                    ${progressEl}
                    ${entry.error ? H`<p class="view-history__item-error">${entry.error}</p>` : ""}
                    ${actionsEl}
                </div>
            `;
			fragment.appendChild(item);
		}
		return fragment;
	}
	setupEventHandlers() {
		if (!this.element) return;
		this.element.addEventListener("click", (e) => {
			this.onClick(e);
		});
	}
	async onClick(e) {
		const button = e.target.closest("[data-action]");
		if (!button) return;
		const action = button.dataset.action;
		const entryId = button.dataset.id;
		if (action === "clear") {
			getTransferHistoryStore().clear();
			this.shellContext?.showMessage?.("History cleared");
			return;
		}
		if (!action || !entryId) return;
		const entry = this.entries.find((x) => x.id === entryId);
		if (!entry) return;
		button.disabled = true;
		try {
			const ok = await dispatchHistoryAction(entry, action);
			this.shellContext?.showMessage?.(ok ? `${labelForAction(action)} OK` : "Action failed");
		} finally {
			button.disabled = false;
		}
	}
	/** Full row signature including progress (skip when identical). */
	listSignature(entries) {
		let sig = String(entries.length);
		for (const e of entries) sig += `|${e.id}:${e.status}:${e.bytesDone ?? ""}:${e.speedBps ?? ""}:${e.lastActionAt ?? e.ts}`;
		return sig;
	}
	/** Structure without progress — progress-only updates patch bars in place. */
	structureSignature(entries) {
		let sig = String(entries.length);
		for (const e of entries) {
			const thumb = e.thumbDataUrl ? e.thumbDataUrl.length : e.localFilePath ? 1 : 0;
			sig += `|${e.id}:${e.status}:${e.kind}:${e.title}:${e.error ?? ""}:${thumb}`;
		}
		return sig;
	}
	scheduleUpdateList(force) {
		if (!this.visible || !this.element) return;
		if (force) {
			if (this.listRaf) {
				cancelAnimationFrame(this.listRaf);
				this.listRaf = 0;
			}
			this.updateList(true);
			return;
		}
		if (this.listRaf) return;
		this.listRaf = requestAnimationFrame(() => {
			this.listRaf = 0;
			this.updateList(false);
		});
	}
	/** WHY: live file transfers change bytes every poll — avoid full list remount. */
	patchProgressOnly() {
		if (!this.element) return;
		for (const entry of this.entries) {
			const safeId = String(entry.id).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
			const row = this.element.querySelector(`[data-entry="${safeId}"]`);
			if (!row) continue;
			const ratio = transferProgressRatio(entry);
			const pct = Math.round(ratio * 100);
			const speed = formatTransferSpeed(entry.speedBps);
			const progress = row.querySelector("progress");
			const meta = row.querySelector(".view-history__progress-meta");
			if (progress) {
				progress.max = 100;
				progress.value = pct;
			}
			if (meta) meta.textContent = `${pct}% · ${speed}${entry.etaMs != null && entry.etaMs > 0 ? ` · ~${Math.ceil(entry.etaMs / 1e3)}s` : ""}`;
			row.dataset.status = entry.status;
		}
	}
	updateList(force = false) {
		if (!this.visible) return;
		const list = this.element?.querySelector("[data-history-list]");
		if (!list) return;
		const fullSig = this.listSignature(this.entries);
		if (!force && fullSig === this.lastListSig) return;
		const structSig = this.structureSignature(this.entries);
		if (!force && structSig === this.lastStructSig && list.childElementCount > 0) {
			this.patchProgressOnly();
			this.lastListSig = fullSig;
			return;
		}
		this.lastListSig = fullSig;
		this.lastStructSig = structSig;
		list.replaceChildren();
		list.appendChild(this.renderEntries());
	}
	formatTime(timestamp) {
		const date = new Date(timestamp);
		const now = /* @__PURE__ */ new Date();
		if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});
		return date.toLocaleDateString([], {
			month: "short",
			day: "numeric"
		}) + " " + date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	reloadHistory() {
		this.refreshFromStore();
		this.scheduleUpdateList(true);
	}
	invokeChannelApi(action, _payload) {
		if (action === HistoryChannelAction.Reload || action === HistoryChannelAction.Refresh) {
			this.reloadHistory();
			return true;
		}
	}
	canHandleMessage() {
		return false;
	}
	async handleMessage() {}
};
function labelForAction(a, entry) {
	const isImage = entry?.kind === "clipboard-image";
	switch (a) {
		case "accept": return "Accept";
		case "dismiss": return "Dismiss";
		case "decline": return "Decline";
		case "open": return "Open";
		case "download": return isImage ? "Save" : "Download";
		case "cancel": return "Cancel";
		case "reveal": return isImage ? "Show in folder" : "Open folder";
		case "share": return "Share again";
		case "remove": return "Remove";
		default: return String(a);
	}
}
function createView(options) {
	return new HistoryView(options);
}
var createHistoryView = createView;
//#endregion
export { HistoryView, createHistoryView, createView, createView as default };
